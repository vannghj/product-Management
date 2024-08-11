const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
const {info} = require("./user.controller");
const chatSocket = require("../../sockets/client/chat.socket");

module.exports.index = async (req, res) => {

    //socketio
    chatSocket(res);
    //endsocketio
    const chats = await Chat.find({
        deleted: false
    });
    for(const chat of chats) {
        const infoUser = await User.findOne({
            _id: chat.user_id,
        }).select("fullName");
        chat.infoUser = infoUser;
    }
    res.render("client/pages/chat/index", {
        pageTitle: "Chat",
        chats: chats,
    });
};
