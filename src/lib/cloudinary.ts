import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

export { cloudinary };

export async function uploadToCloudinary(
    file: string,
    folder: string,
    resourceType: "image" | "video" | "auto" = "auto"
): Promise<{ url: string; publicId: string; duration?: number }> {
    const result = await cloudinary.uploader.upload(file, {
        folder: `wonder-learning/${folder}`,
        resource_type: resourceType,
        eager: resourceType === "video" ? [
            { streaming_profile: "hd", format: "m3u8" }
        ] : undefined,
        eager_async: resourceType === "video",
    });

    return {
        url: result.secure_url,
        publicId: result.public_id,
        duration: result.duration,
    };
}

export async function deleteFromCloudinary(publicId: string, resourceType: "image" | "video" = "image") {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}

export function getSignedVideoUrl(publicId: string): string {
    return cloudinary.url(publicId, {
        resource_type: "video",
        sign_url: true,
        type: "authenticated",
        expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour
    });
}
