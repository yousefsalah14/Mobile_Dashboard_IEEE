import multer from "multer";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Uploading {
    constructor() {
        if (new.target === Uploading) {
            throw new Error("This is an interface and cannot be instantiated.");
        }
    }

    Storage() {
        throw new Error("Storage method must be implemented in subclasses.");
    }
}

class PDFUploading extends Uploading {
    constructor(place) {
        super();
        this.place = place;
    }

    Storage() {
        if (this.place === "local") {
            const uploadDir = path.join(__dirname, "..", "..", "public", "uploads", "pdfs");
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            return multer.diskStorage({
                destination: (req, file, cb) => cb(null, uploadDir),
                filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
            });
        } else if (this.place === "cloud") {
            return multer.memoryStorage();
        } else {
            throw new Error("Invalid storage option provided.");
        }
    }
}

class IMGUploading extends Uploading {
    constructor(place) {
        super();
        this.place = place;
    }

    Storage() {
        if (this.place === "local") {
            const uploadDir = path.join(__dirname, "..", "..", "public", "uploads", "images");
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            return multer.diskStorage({
                destination: (req, file, cb) => cb(null, uploadDir),
                filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
            });
        } else if (this.place === "cloud") {
            return multer.memoryStorage();
        } else {
            throw new Error("Invalid storage option provided.");
        }
    }
}

class VIDUploading extends Uploading {
    constructor(place) {
        super();
        this.place = place;
    }

    Storage() {
        if (this.place === "local") {
            const uploadDir = path.join(__dirname, "..", "..", "public", "uploads", "videos");
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            return multer.diskStorage({
                destination: (req, file, cb) => cb(null, uploadDir),
                filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
            });
        } else if (this.place === "cloud") {
            return multer.memoryStorage();
        } else {
            throw new Error("Invalid storage option provided.");
        }
    }
}

class UploadFactory {
    static createUploader(fileType, place) {
        switch (fileType) {
            case "pdf":
                return new PDFUploading(place);
            case "image":
                return new IMGUploading(place);
            case "video":
                return new VIDUploading(place);
            default:
                throw new Error("This file type is not supported.");
        }
    }
}

export function getUploader(fileType, place) {
    const uploader = UploadFactory.createUploader(fileType, place);
    return multer({ storage: uploader.Storage() });
}

export default UploadFactory;
