import * as faceapi from '@vladmandic/face-api';

let modelsLoaded = false;
let modelsLoadingPromise = null;

export const loadModels = async () => {
  if (modelsLoaded) return;
  if (modelsLoadingPromise) return modelsLoadingPromise;

  console.log('[Face-API] Starting to load high-accuracy models from /models...');

  const MODEL_URL = '/models';

  modelsLoadingPromise = (async () => {
    try {
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL, 'ssd_mobilenetv1_model-weights_manifest.json'),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL, 'face_landmark_68_model-weights_manifest.json'),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL, 'face_expression_model-weights_manifest.json'),
      ]);
      modelsLoaded = true;
      console.log('[Face-API] High-accuracy models loaded successfully');
    } catch (err) {
      console.error('[Face-API] Error loading models:', err);
      modelsLoadingPromise = null;
      throw err;
    }
  })();

  return modelsLoadingPromise;
};

/**
 * Calculates image blurriness using Variance of Laplacian on a specific region.
 * @param {HTMLCanvasElement} canvas 
 * @returns {number} Blur score
 */
export const calculateBlurScore = (canvas) => {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const { width, height } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  let nonZeroCount = 0;
  for (let i = 0; i < Math.min(data.length, 1000); i++) {
    if (data[i] !== 0) nonZeroCount++;
  }

  if (nonZeroCount === 0) {
    console.warn('[Analysis] WARNING: Crop canvas is empty or tainted.');
    return 0;
  }

  const grayscale = new Float32Array(width * height);
  for (let i = 0; i < data.length; i += 4) {
    grayscale[i / 4] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  }

  const laplacian = new Float32Array((width - 2) * (height - 2));
  let sum = 0;
  let count = 0;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      const val =
        grayscale[idx - width] +
        grayscale[idx - 1] +
        grayscale[idx + 1] +
        grayscale[idx + width] -
        4 * grayscale[idx];

      laplacian[count] = val;
      sum += val;
      count++;
    }
  }

  const mean = sum / count;
  let variance = 0;
  for (let i = 0; i < count; i++) {
    variance += Math.pow(laplacian[i] - mean, 2);
  }

  const finalScore = variance / count;
  console.log(`[Analysis] Center-Crop Blur Score (Variance of Laplacian): ${finalScore.toFixed(2)}`);
  return finalScore;
};

/**
 * Analyzes an image for blur and smiles.
 * @param {string} imageSrc 
 * @returns {Promise<{blurScore: number, smileScore: number, isBlurry: boolean, isSmiling: boolean}>}
 */
export const analyzeImage = async (imageSrc) => {
  console.log(`[Analysis] Starting high-accuracy analysis for: ${imageSrc.substring(0, 50)}...`);

  await loadModels();

  return new Promise((resolve, reject) => {
    const img = new Image();

    // CRITICAL: Only set crossOrigin for remote URLs. 
    // Setting it for local blobs (URL.createObjectURL) can taint the canvas in some browsers.
    if (imageSrc.startsWith('http')) {
      img.crossOrigin = 'anonymous';
    }

    img.onload = async () => {
      try {
        console.log(`[Analysis] Image loaded: ${img.width}x${img.height}`);

        // 1. Prepare Blur Analysis (Center Crop)
        const CROP_SIZE = 600;
        const drawW = Math.min(CROP_SIZE, img.width);
        const drawH = Math.min(CROP_SIZE, img.height);

        const cropCanvas = document.createElement('canvas');
        cropCanvas.width = drawW;
        cropCanvas.height = drawH;
        const cropCtx = cropCanvas.getContext('2d', { willReadFrequently: true });

        const startX = Math.max(0, (img.width - drawW) / 2);
        const startY = Math.max(0, (img.height - drawH) / 2);

        cropCtx.drawImage(img, startX, startY, drawW, drawH, 0, 0, drawW, drawH);

        // 2. Calculate Blur Score
        const blurScore = calculateBlurScore(cropCanvas);
        const BLUR_THRESHOLD = 40;
        const isBlurry = blurScore < BLUR_THRESHOLD;

        // 3. Detect Faces
        console.log('[Analysis] Running Face Detection (SSD Mobilenet)...');
        const detections = await faceapi
          .detectAllFaces(img, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
          .withFaceLandmarks()
          .withFaceExpressions();

        let smileScore = 0;
        let isSmiling = false;

        if (detections && detections.length > 0) {
          smileScore = detections.reduce((acc, det) => acc + det.expressions.happy, 0) / detections.length;
          isSmiling = smileScore > 0.7;
          console.log(`[Analysis] Found ${detections.length} face(s). Smile Score: ${(smileScore * 100).toFixed(2)}%`);
        } else {
          console.warn('[Analysis] No faces detected.');
        }

        resolve({
          blurScore,
          smileScore,
          isBlurry,
          isSmiling,
          hasFaces: detections.length > 0,
          error: blurScore === 0 && detections.length === 0 ? 'Tainted Canvas' : null
        });
      } catch (err) {
        console.error('[Analysis] Error:', err);
        reject(err);
      }
    };

    img.onerror = () => reject(new Error('Failed to load image source'));
    img.src = imageSrc;
  });
};
