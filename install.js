import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import { exec } from 'child_process'; // Import exec from child_process

async function createFolderStructure(projectName) {
  const folders = [
    'DB/models',
    'src/middlewares',
    'src/modules',
    'src/utils'
  ];

  const files = [
    {
      path: 'DB/models/token.model.js',
      content: `import { Schema, Types, model } from "mongoose";

const tokenSchema = new Schema({
    token: {
        type: String,
        required: true
    },
    user: {
        type: Types.ObjectId,
        ref: "User"
    },
    isValid: {
        type: Boolean,
        default: true,
    }
}, { timestamps: true });

export const Token = model("Token", tokenSchema);`
    },
    {
      path: 'DB/models/connection.js',
      content: `import mongoose from "mongoose";

export const connectDB = async () => {
    return await mongoose.connect(process.env.CONNECTION_URL)
    .then(() => {
        console.log("DB Connected");
    })
    .catch(() => {
        console.log("Failed to connect to DB");
    });
};`
    },
    {
      path: 'src/middlewares/authentication.middleware.js',
      content: `import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../../DB/models/user.model.js";
import { Token } from "../../DB/models/token.model.js";

export const isAuthenticated = asyncHandler(async (req, res, next) => {
    const { token } = req.headers;
    if (!token) return next(new Error("Token missed! 😏"), { cause: 500 });

    const tokenDB = await Token.findOne({ token, isValid: true });
    if (!tokenDB) return next(new Error("Token invalid!! 😠"), { cause: 401 });

    const payload = jwt.verify(token, process.env.SECRET_KEY);

    const isUser = await User.findById(payload.id);
    if (!isUser) return next(new Error("User not found 😁"), { cause: 404 });

    if (isUser.status == "offline") return next(new Error("You must be logged in! 😏"), { cause: 400 });

    req.user = isUser;
    return next();
});`
    },
    {
      path: 'src/middlewares/authorization.middleware.js',
      content: `export const isAuthorized = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) return next(new Error("Not Authorized!! 😠"));
        return next();
    };
};`
    },
    {
      path: 'src/utils/asyncHandler.js',
      content: `export const asyncHandler = (controller) => {
    return (req, res, next) => {
        controller(req, res, next).catch((error) => next(error));
    };
};`
    },
    {
      path: 'index.js',
      content: `import express from 'express';
import dotenv from "dotenv";
import { connectDB } from './DB/connection.js';

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(express.json());

await connectDB();

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Private-Network", true);
    return next();
});

// Page not found handler
app.all('*', (req, res, next) => {
    return next(new Error("Page not found", { cause: 404 }));
});

// Global error handler
app.use((error, req, res, next) => {
    const statusCode = error.cause || 500;
    return res.status(statusCode).json({
        success: false,
        message: error.message,
        stack: error.stack
    });
});

app.listen(port, () => console.log(\`App listening on port \${port}!\`));`
    },
    {
      path: '.gitignore',
      content: `node_modules
.env
.DS_Store
*.log`
    },
    {
      path: '.env',
      content: `PORT=3000
# Don't forget to replace dbName with your actual MongoDB database name
CONNECTION_URL=mongodb://127.0.0.1:27017/dbName
SALT_ROUNDS=8
# Put your token secret key here
SECRET_KEY=your-secret-token-key`
    }
  ];

  const basePath = path.join(process.cwd(), projectName);

  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath);
    console.log(`Created project folder: ${basePath}`);
  }

  // Create the package.json file with dependencies
  const packageJson = {
    name: projectName,
    version: '1.0.0',
    description: 'A Node.js package to scaffold a basic folder structure for Express apps.',
    main: 'index.js',
    type: 'module',
    scripts: {
      postinstall: 'node install.js', // This ensures install.js runs after dependencies are installed
      test: 'echo "Error: no test specified" && exit 1'
    },
    keywords: ['node', 'express', 'project', 'setup'],
    author: 'Yousef Salah',
    license: 'ISC',
    dependencies: {
      bcryptjs: '^2.4.3',
      dotenv: '^16.4.5',
      express: '^4.19.2',
      joi: '^17.13.3',
      jsonwebtoken: '^9.0.2',
      mongoose: '^8.4.4',
      inquirer: '^8.2.0'
    }
  };

  fs.writeFileSync(path.join(basePath, 'package.json'), JSON.stringify(packageJson, null, 2));
  console.log('Created package.json file.');

  // Create subfolders
  folders.forEach(folder => {
    const folderPath = path.join(basePath, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      console.log(`Created folder: ${folderPath}`);
    }
  });

  // Create files with content
  files.forEach(file => {
    const filePath = path.join(basePath, file.path);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, file.content);
      console.log(`Created file: ${filePath}`);
    }
  });

  console.log('Folder structure with files created successfully!');
  console.log('Running npm install to install dependencies...');

  // Run npm install after creating the folder structure
  exec('npm install', { cwd: basePath }, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error executing npm install: ${stderr}`);
      return;
    }
    console.log(stdout);
    console.log('Dependencies installed successfully!');
  });
}

async function askQuestions() {
  const projectName = process.argv[2] || 'express-folder-structure-project'; // Use command-line argument or default name

  await createFolderStructure(projectName);
  console.log(`Your project ${projectName} is ready!`);
}

askQuestions();
