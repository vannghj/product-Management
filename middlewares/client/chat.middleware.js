const Roomchat =require("../../models/rooms-chat.model");
module.exports.isAccess = async (req, res, next) => {
    const roomChatId = req.params.roomChatId;
    const userId = res.locals.user.id;
    const existUserInRoomChat = await Roomchat.findOne({
        _id: roomChatId,
        "users.user_id": userId,
        deleted: false
    })
    if(existUserInRoomChat) {
        next();
    }else {
        res.redirect("/");
    }
}