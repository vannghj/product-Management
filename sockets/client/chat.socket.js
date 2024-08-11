const uploadToCloudinary = require("../../helpers/uploadToCloudinary");
const Chat = require("../../models/chat.model");
module.exports = (res) => {
    const userId = res.locals.user.id;
    const fullName = res.locals.user.fullName;
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
        });
    });
}