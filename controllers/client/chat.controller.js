module.exports.index = async (req, res) => {
    //socketio
    _io.on('connection', (socket) => {
        console.log('a user connected', socket.id);
    });
    //endsocketio
    res.render("client/pages/chat/index", {
        pageTitle: "Chat",
    });
};
