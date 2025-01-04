const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const Message = require("../model/message");
require("dotenv").config();

let io;

function initSocketIo(server) {
  io = new Server(server);

  io.use((socket, next) => {
    try {
      const authHeader = socket.handshake.headers["authorization"];
      

      const token = authHeader.split(" ")[1];
      if (!token) {
        throw new Error("Unauthorized: Token is invalid");
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId; 
      next();
    } catch (error) {
      console.error("Authentication error:", error);
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", async socket => {
    console.log("A new driver connected:+++++++++++++", socket.userId);

    socket.on("send-message", async data => {
      try {
        const messageData = {
          message: data.message,
          sender_id: socket.userId,
          reciver_id: data.reciver_id
        };
        const savedMessage = await Message.create(messageData);
        console.log("Message sent:", savedMessage);

        socket.to(messageData.reciver_id).emit("receive-message", savedMessage);
      } catch (error) {
        console.log("+++++ error +++++++++++", error);
      }
    });

    socket.on("update-message", async data => {
      try {
        const updateMessage = await Message.findOneAndUpdate(
          { _id: data.messageId, sender_id: socket.userId },
          { message: data.newMessage },
          { new: true }
        );

        if (!updateMessage) {
          console.error(
            "Message not found or user not authorized to update this message."
          );
          return;
        }

        console.log("Message updated successfully:", updateMessage);

        socket
          .to(updateMessage.reciver_id)
          .emit("message-updated", updateMessage);
      } catch (error) {
        console.log("+++++ error +++++++++++", error);
      }
    });

    socket.on("delete-message", async data => {
      try {
        const findMessage = await Message.findOne({
          _id: data.messageId,
          sender_id: socket.userId
        });
        console.log("====== findMessage ===========", findMessage);

        if (!findMessage) {
          console.log("Message not found!");
          return;
        }

        await Message.updateOne(
          { _id: data.messageId, sender_id: socket.userId },
          { isDeleted: true }
        );
      } catch (error) {
        console.log("------- error -----------", error);
      }
    });

    socket.on("seen-message", async (data) => {
      try {
        console.log("====== socket.userId =====", socket.userId);
        
        const findMessage = await Message.findOne({
          reciver_id: data.reciver_id,
          _id: data.messageId
        });
        console.log("====== findMessage ===========", findMessage);

        if (!findMessage) {
          console.log("Message not found!");
          return;
        }

        await Message.updateOne(
          { _id: data.messageId, sender_id: socket.userId },
          { isSeen: true }
        );
      } catch (error) {
        console.log("------- error -----------", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("user disconnected:----------- ", socket.userId);
    });
  });
}

module.exports = { initSocketIo, io };
