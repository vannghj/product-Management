const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");
const {info} = require("./user.controller");
const uploadToCloudinary = require("../../helpers/uploadToCloudinary");

module.exports.index = async (req, res) => {
    const userId = res.locals.user.id;
    const fullName = res.locals.user.fullName;
    //socketio
    _io.once('connection', (socket) => {
        socket.on("CLIENT_SEND_MESSAGE", async (data) =>{
            let images = [];
            for(const image of data.images) {
                const link = await uploadToCloudinary(image);
                images.push(link);
            }

            const chat = new Chat({
                user_id: userId,
                content: data.content,
                images: images
            });
            await chat.save();
            _io.emit("SERVER_RETURN_MESSAGE", {
                userId: userId,
                fullName: fullName,
                content: data.content,
                images: images || []
            });
        })

    });
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
