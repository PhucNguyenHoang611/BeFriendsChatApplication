const multer = require("multer");

exports.uploadMemoryStorage = multer({ storage: multer.memoryStorage() });