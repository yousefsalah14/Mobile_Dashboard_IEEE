import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../../DB/models/user.model.js";
import { Token } from "../../DB/models/token.model.js";

export const isAuthenticated = asyncHandler(async (req, res, next) => {
    // Extract token from "Authorization" header
    const { token } = req.headers;

    if (!token) return next(new Error("Token missing! 😏", { cause: 401 }));

    // Check if token exists in DB and is valid
    const tokenDB = await Token.findOne({ token, isValid: true });
    if (!tokenDB) return next(new Error("Token invalid!! 😠", { cause: 401 }));

    // Verify token
    let payload;
    try {
        payload = jwt.verify(token, process.env.TOKEN_KEY);
    } catch (err) {
        return next(new Error("Invalid token signature! 🔒", { cause: 401 }));
    }

    console.log("Decoded Token Payload:", payload);

    // Check if user exists
    const isUser = await User.findById(payload.id);
    if (!isUser) return next(new Error("User not found 😁", { cause: 404 }));

    // Check if user is logged in
    if (isUser.status.toLowerCase() === "offline") {
        return next(new Error("You must be logged in! 😏", { cause: 400 }));
    }

    // Attach user to request
    req.user = isUser;

    // Proceed to next middleware
    return next();
});
