"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = __importDefault(require("./env"));
const category_1 = __importDefault(require("../database/models/category"));
function initializeSpecialCategories() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const completedCategory = yield category_1.default.findOne({
                name: "Completed Tasks",
            });
            if (!completedCategory) {
                yield category_1.default.create({
                    name: "Completed Tasks",
                    isSpecial: true,
                    isDeletable: false,
                });
                console.log("Created Completed Tasks category");
            }
            const deletedCategory = yield category_1.default.findOne({ name: "Deleted Tasks" });
            if (!deletedCategory) {
                yield category_1.default.create({
                    name: "Deleted Tasks",
                    isSpecial: true,
                    isDeletable: false,
                });
                console.log("Created Deleted Tasks category");
            }
        }
        catch (err) {
            console.error("Error initializing special categories:", err);
        }
    });
}
const mongoUri = env_1.default.application.database.mongodb_uri;
if (!mongoUri) {
    console.error("MONGODB_URI is not set. Add it to your .env file or environment.");
    process.exit(1);
}
mongoose_1.default
    .connect(mongoUri, {
    // MongoDB Enterprise connection options
    serverSelectionTimeoutMS: env_1.default.application.database.serverSelectionTimeoutMS,
    socketTimeoutMS: env_1.default.application.database.socketTimeoutMS,
    maxPoolSize: env_1.default.application.database.maxPoolSize,
    minPoolSize: env_1.default.application.database.minPoolSize,
    retryWrites: true,
    w: "majority",
    // For Enterprise clusters with replica sets
    readPreference: "primary",
    readConcern: { level: "majority" },
})
    .then(() => {
    console.log("Connected to MongoDB Enterprise");
    // Initialize special categories after connection is established
    initializeSpecialCategories();
})
    .catch((err) => console.error("MongoDB connection error:", err));
exports.default = mongoose_1.default;
