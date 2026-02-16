import PocketBase from 'pocketbase';

// Initialize PocketBase Client
// Ensure your PocketBase server is running at this URL
export const pb = new PocketBase('http://127.0.0.1:8090');

// Disable auto-cancellation to prevent race conditions in React Strict Mode
pb.autoCancellation(false);

export const getPbImage = (collectionId: string, recordId: string, fileName: string | undefined) => {
    if (!fileName) return null;
    if (fileName.startsWith('http')) return fileName; 
    return `${pb.baseUrl}/api/files/${collectionId}/${recordId}/${fileName}`;
};

export const getPbAvatar = (user: any) => {
    if (user?.avatar) {
        return getPbImage(user.collectionId || 'users', user.id, user.avatar);
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random`;
}

// Check backend health
export const checkHealth = async () => {
    try {
        const health = await pb.health.check();
        return health.code === 200;
    } catch (e) {
        return false;
    }
};