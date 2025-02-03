import cloudinary from "../config/cloudinary.js";
import stream from 'stream';

export async function uploadToCloud(file, resourceType) {
    try {
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: resourceType,
                    public_id: `${resourceType}s/${Date.now()}-${file.originalname}`,
                },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error details:', error);
                        reject(new Error(`Cloudinary upload failed: ${error.message}`));
                    } else {
                        resolve(result);
                    }
                }
            );

            const bufferStream = new stream.PassThrough();
            bufferStream.end(file.buffer);
            bufferStream.pipe(uploadStream);
        });

        return result;

    } catch (error) {
        console.error('Cloudinary Upload Error:', error); 
        throw new Error(`Upload to Cloudinary failed: ${error.message}`);
    }
}

