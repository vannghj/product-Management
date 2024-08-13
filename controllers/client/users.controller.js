const User = require("../../models/user.model");
const usersSocket = require("../../sockets/client/users.socket");
const {infoUser} = require("../../middlewares/client/user.middleware");

module.exports.notFriend = async (req, res) => {
    //socket
    usersSocket(res);
    //end socket
    const userId = res.locals.user.id;
    const myUser = await User.findOne({
        _id: userId
    });
    const requestFriends = myUser.requestFriends;
    const acceptFriends = myUser.acceptFriends;
    const users = await User.find({
        $and: [
            {_id: { $ne: userId}},
            {_id: { $nin: requestFriends}},
            {_id: { $nin: acceptFriends}},
        ],
        status: "active",
        deleted: false
    }).select("id avatar fullName");
    res.render("client/pages/users/not-friend", {
        pageTitle: "Danh sach nguoi dung",
        users: users
    });
};
module.exports.request = async (req, res) => {
    //socket
    usersSocket(res);
    //end socket
    const userId = res.locals.user.id;
    const myUser = await User.findOne({
        _id: userId
    });
    const requestFriends = myUser.requestFriends;
    const users = await User.find({
        _id: { $in: requestFriends},
        status: "active",
        deleted: false
    }).select("id avatar fullName");
    res.render("client/pages/users/request", {
        pageTitle: "Loi moi da gui",
        users: users
    });
};
module.exports.accept = async (req, res) => {
    //socket
    usersSocket(res);
    //end socket
    const userId = res.locals.user.id;
    const myUser = await User.findOne({
        _id: userId
    });
    const acceptFriends = myUser.acceptFriends;
    const users = await User.find({
        _id: { $in: acceptFriends},
        status: "active",
        deleted: false
    }).select("id avatar fullName");
    res.render("client/pages/users/accept", {
        pageTitle: "Loi moi da nhan",
        users: users
    });
};
module.exports.friends = async (req, res) => {
    //socket
    usersSocket(res);
    //end socket
    const userId = res.locals.user.id;
    const myUser = await User.findOne({
        _id: userId
    });
    const friendList = myUser.friendList;
    const friendListId = friendList.map(item => item.user_id);
    const users = await User.find({
        _id: { $in: friendListId},
        status: "active",
        deleted: false
    }).select("id avatar fullName statusOnline");
    for( const user of users) {

        const infoFriend = friendList.find(friend => friend.user_id === user.id);
        user.infoFriend = infoFriend;
    }
    res.render("client/pages/users/friends", {
        pageTitle: "Danh sach ban be",
        users: users,
    });

};