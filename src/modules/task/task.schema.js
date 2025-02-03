import Joi from "joi";

const taskSchema = Joi.object({
    title: Joi.string().trim().required().messages({
        "string.empty": "Title is required",
        "any.required": "Title is required"
    }),

    description: Joi.string().required().messages({
        "string.empty": "Description is required",
        "any.required": "Description is required"
    }),

    priority: Joi.string()
        .valid("High", "Medium", "Low")
        .required()
        .messages({
            "string.empty": "Priority is required",
            "any.required": "Priority is required",
            "any.only": "Priority must be one of High, Medium, Low"
        }),

    due_date: Joi.date().iso().required().messages({
        "date.base": "Due date must be a valid date",
        "any.required": "Due date is required"
    }),

    status: Joi.string()
        .valid("Pending", "Completed", "Overdue")
        .default("Pending")
        .messages({
            "string.empty": "Status is required",
            "any.only": "Status must be one of Pending, Completed, Overdue"
        }),

    assigned_to: Joi.array()
        .items(Joi.string().hex().length(24)) 
        .min(1)
        .required()
        .messages({
            "array.base": "Assigned users must be an array",
            "array.min": "At least one user must be assigned",
            "any.required": "Assigned users are required"
        }),

    created_by: Joi.string().hex().length(24).required().messages({
        "string.empty": "Created by user is required",
        "any.required": "Created by user is required",
        "string.hex": "Created by user must be a valid ObjectId"
    }),

    attachments: Joi.array()
        .items(Joi.string().uri().message("Attachment must be a valid URL"))
        .optional()
        .messages({
            "array.base": "Attachments must be an array of URLs",
        })
});

export default taskSchema;
