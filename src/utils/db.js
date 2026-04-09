import Dexie from 'dexie';

export const db = new Dexie('ImageDetectorDB');

db.version(1).stores({
    images: 'id, name, status, blurScore, smileScore, hasFaces'
});
