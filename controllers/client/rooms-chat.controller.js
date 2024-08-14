const User = require("../../models/user.model");
const RoomChat = require("../../models/rooms-chat.model");
module.exports.index = async (req, res) => {
    const userId = res.locals.user.id;
    const listRoomChat =await RoomChat.find({
        typeRoom: "group",
        "users.user_id": userId,
        deleted: false,
    });

    res.render("client/pages/rooms-chat/index", {
        pageTitle: "danh sach phong",
        listRoomChat: listRoomChat
    })
}
module.exports.create = async (req, res) => {
    const friendsList = res.locals.user.friendList;
    for (const friend of friendsList) {
        const infoFriend = await User.findOne({
            _id: friend.user_id,
            deleted: false,
        }).select("fullName avatar");
        console.log(infoFriend);
        if(infoFriend) {
            friend.infoFriend = infoFriend;
        }
    }

    res.render("client/pages/rooms-chat/create", {
        pageTitle: "tao phong",
        friendsList: friendsList,
    })
}
module.exports.createPost = async (req, res) => {
    const title = req.body.title;
    const usersId = req.body.usersId;
    const dataRoom = {
        title: title,
        typeRoom: "group",
        users:[],
    }
    if(typeof usersId !== "string") {
        for(const userId of usersId) {
            dataRoom.users.push({
                user_id: userId,
                role: "user"
            });
        }
    } else {
        dataRoom.users.push({
            user_id: usersId,
            role: "user"
        });
    }

    dataRoom.users.push({
        user_id: res.locals.user.id,
        role: "superAdmin"
    })
    const roomChat = new RoomChat(dataRoom);
    roomChat.save();
    res.redirect(`/chat/${roomChat.id}`);
}