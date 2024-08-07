const Role = require("../../models/role.model");
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }
    const records = await Role.find(find);
    res.render("admin/pages/roles/index", {
        pageTitle: "Nhom quyen",
        records: records
    });
};
module.exports.create = async (req, res) => {
    res.render("admin/pages/roles/create", {
        pageTitle: "Tao nhom quyen",
    });
};
module.exports.createPost = async (req, res) => {
    const record = new Role(req.body);
    await record.save();
    res.redirect("back");
};
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        let find = {
            _id: id,
            deleted: false
        }
        const data = await Role.findOne(find);
        res.render("admin/pages/roles/edit", {
            pageTitle: "Tao nhom quyen",
            data: data
        });
    } catch (error) {
        res.redirect("back");
    }
};
module.exports.editPatch = async (req, res) => {
    try
    {
        const id = req.params.id;
        await Role.updateOne({_id: id}, req.body);
        req.flash("success", `Cap nhat thanh cong`);
        res.redirect("back");
    } catch (error) {
        req.flash("error", "Cap nhat nhom quyen that bai");
    }
};
module.exports.permissions = async (req, res) => {
    let find = {
        deleted: false
    }

    const records = await Role.find(find);

    res.render("admin/pages/roles/permissions", {
        pageTitle: "Phan quyen",
        records:records
    });
};
module.exports.permissionsPatch = async (req, res) => {
    const permissions = JSON.parse(req.body.permissions);

    for (const item of permissions) {
        await Role.updateOne({_id: item.id}, {permissions: item.permisstions});
    }
    req.flash("success", "Cap nhat phan quyen thanh cong");
    res.redirect("back");
};
