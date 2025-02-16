import { uploadToCloud } from "./uploadToCloud.js";

export const handleFileUpload = async (files, fileType, isCloud) => {
    if (!files || files.length === 0) {
        return { success: false, message: "No files uploaded" };
    }

    const filteredFiles = files.filter((file) =>
        (file.mimetype.startsWith(fileType)) || 
        (fileType === "image" && /\.(jpg|jpeg|png|gif)$/i.test(file.originalname)) || 
        (fileType === "video" && /\.(mp4|mov|avi)$/i.test(file.originalname)) ||
        (fileType === "application/pdf" && file.originalname.endsWith(".pdf"))
    );

    if (filteredFiles.length !== files.length) {
        return { success: false, message: `All files should be ${fileType}s.` };
    }

    if (isCloud === 'true') { // fuck this error
        try {
            const uploadedFiles = await Promise.all(
                filteredFiles.map((file) => uploadToCloud(file, fileType))
            );

            return {
                success: true,
                message: `${fileType}s uploaded successfully to Cloud`,
                files: uploadedFiles.map((cloudFile) => ({
                    filename: cloudFile.public_id,
                    originalname: cloudFile.originalname,
                    size: cloudFile.size,
                    url: cloudFile.secure_url,
                })),
            };
        } catch (error) {
            return { success: false, message: `Error uploading ${fileType}s to Cloud`, error: error.message };
        }
    } else {
        return {
            success: true,
            message: `${fileType}s uploaded successfully locally`,
            files: filteredFiles.map((file) => ({
                filename: file.filename,
                originalname: file.originalname,
                size: file.size,
                url: `/uploads/${file.mimetype.split("/")[1]}s/${file.filename}`,
            })),
        };
    }
}