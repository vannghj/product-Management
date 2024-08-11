const uploadToCloudinary = require("../../helpers/uploadToCloudinary");

module.exports.upload = async (req, res, next) => {
    console.log(req.file);
    if (req.file) {
        const link = await uploadToCloudinary(req.file.buffer);
        req.body[req.file.fieldname] = link;
    } else {
        next();
    }
    next();

}