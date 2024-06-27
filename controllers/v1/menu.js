const menusModel = require("./../../models/menu");

exports.getAll = async (req, res) => {
  const menus = await menusModel.find({}).lean();

  menus.forEach((menu) => {
    const submenus = [];
    for (let i = 0; i < menus.length; i++) {
      const mainManu = menus[i];
      // if (String(mainManu.parent) === String(menu._id)) {
      if (mainManu.parent?.equals(menu._id)) {
        submenus.push(menus.splice(i, 1)[0]); // trace => support
        i = i - 1;
      }
    }
    menu.submenus = submenus;
  });

  return res.json(menus);
};

exports.create = async (req, res) => {
  const { title, href, parent } = req.body;

  // Validate

  const menu = await menusModel.create({ title, href, parent });

  return res.status(201).json(menu);
};

exports.getAllInPanel = async (req, res) => {
  const menus = await menusModel.find({}).populate("parent").lean();

  return res.json(menus);
};

exports.remove = async (req, res) => {
  /// Codes
};
