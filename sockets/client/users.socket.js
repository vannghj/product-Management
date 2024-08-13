const User = require("../../models/user.model");
module.exports = (res) => {
    _io.once('connection', (socket) => {
        socket.on("CLIENT_ADD_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;
            const existIdAinB = await User.findOne({
                _id: userId,
                acceptFriends: myUserId
            });
            if (!existIdAinB) {
                await User.updateOne({
                    _id: userId,
                }, {
                    $push: {
                        acceptFriends: myUserId,
                    }
                })
            }
            const existIBAinA = await User.findOne({
                _id: userId,
                requestFriends: userId,
            });
            if (!existIBAinA) {
                await User.updateOne({
                    _id: myUserId,
                }, {
                    $push: {
                        requestFriends: userId,
                    }
                })
            }
            const infoUserB = await User.findOne({
                _id: userId,
            });
            const lenghtAcceptFriends = infoUserB.acceptFriends.length;
            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
                userId: userId,
                lenghtAcceptFriends:lenghtAcceptFriends
            });
            //lay info cua A tra ve cho B
            const infoUserA = await User.findOne({
                _id: myUserId,
            }).select("id avatar fullName")
            socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIEND", {
                userId: userId,
                infoUserA: infoUserA
            });

        });
        socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;
            //Xoa id cua A trong accept cua B
            const existIdAinB = await User.findOne({
                _id: userId,
                acceptFriends: myUserId
            });
            if (existIdAinB) {
                await User.updateOne({
                    _id: userId,
                }, {
                    $pull: {
                        acceptFriends: myUserId,
                    }
                })
            }
            //Xoa id cua B trong request cua A
            const existIBAinA = await User.findOne({
                _id: myUserId,
                requestFriends: userId,
            });
            if (existIBAinA) {
                await User.updateOne({
                    _id: myUserId,
                }, {
                    $pull: {
                        requestFriends: userId,
                    }
                })
            }
            const infoUserB = await User.findOne({
                _id: userId,
            });
            const lenghtAcceptFriends = infoUserB.acceptFriends.length;
            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
                userId: userId,
                lenghtAcceptFriends:lenghtAcceptFriends
            });
            //lay id cua A tra ve cho B
            socket.broadcast.emit("SERVER_RETURN_USER_ID_ACCEPT_FRIEND", {
                userIdB: userId,
                userIdA: myUserId
            });
        });
        socket.on("CLIENT_REFUSE_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;
            //Xoa id cua A trong accept cua B
            const existIdAinB = await User.findOne({
                _id: myUserId,
                acceptFriends: userId
            });
            if (existIdAinB) {
                await User.updateOne({
                    _id: myUserId,
                }, {
                    $pull: {
                        acceptFriends: userId,
                    }
                })
            }
            //Xoa id cua B trong request cua A
            const existIBAinA = await User.findOne({
                _id: userId,
                requestFriends: myUserId,
            });
            if (existIBAinA) {
                await User.updateOne({
                    _id: userId,
                }, {
                    $pull: {
                        requestFriends: myUserId,
                    }
                })
            }
        });
        socket.on("CLIENT_ACCEPT_FRIEND", async (userId) => {
            const myUserId = res.locals.user.id;
            //Xoa id cua A trong accept cua B
            const existIdAinB = await User.findOne({
                _id: myUserId,
                acceptFriends: userId
            });
            if (existIdAinB) {
                await User.updateOne({
                    _id: myUserId,
                }, {
                    $push: {
                        friendList: {
                            user_id:userId,
                            room_chat_id: ""
                        },
                    },
                    $pull: {
                        acceptFriends: userId,
                    }
                })
            }
            //Xoa id cua B trong request cua A
            const existIBAinA = await User.findOne({
                _id: userId,
                requestFriends: myUserId,
            });
            if (existIBAinA) {
                await User.updateOne({
                    _id: userId,
                }, {
                    $push: {
                        friendList: {
                            user_id: myUserId,
                            room_chat_id: ""
                        }
                    },
                    $pull: {
                        requestFriends: myUserId,
                    }
                })
            }
        });
    });


}