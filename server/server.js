const express = require("express");
const cors = require("cors");
const connectDatabase = require("./configuration/databaseConnection");
const errorHandler = require("./middleware/errorHandler");

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger");

const socket = require("socket.io");

const app = express();
connectDatabase();

app.use(express.json());
app.use(cors());

app.use("/", (req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

const swaggerOptions = {
    swaggerDefinition: swaggerDocument,
    apis: ["server.js", "./routes/*.js", "./middleware/*.js", "./models/*.js"]
}

app.get("/", function (req, res) {
	res.redirect("/docs");
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerJsDoc(swaggerOptions)));

app.use("/api/users", require("./routes/users"));
app.use("/api/messages", require("./routes/messages"));
app.use("/api/conversations", require("./routes/conversations"));
app.use("/api/attachments", require("./routes/attachments"));

// Authentication
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearer:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

// Error Handler
app.use(errorHandler);

const server = app.listen(process.env.PORT || 5000, () => console.log("Up and running 🚀"));

// Config socket.io
const io = socket(server, {
	cors: {
		origin: "http://localhost:5173",
		credentials: true
	}
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
	global.chatSocket = socket;

	socket.on("addUser", (userId) => {
		onlineUsers.set(userId, socket.id);
	});

	socket.on("sendMessage", (data) => {
		const sendUserSocket = onlineUsers.get(data.user.userId);
		
		if (sendUserSocket) {
			socket.to(sendUserSocket).emit("receiveMessage", data.messageSender, data.messageText);
		}
	});
});