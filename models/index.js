const Sequelize = require("sequelize");
const db = new Sequelize("postgres://localhost:5432/wikistack", {
  logging: false,
});

const Page = db.define("page", {
  title: { type: Sequelize.STRING, allowNull: false },
  slug: {
    type: Sequelize.STRING,
    allowNull: false,
    //since we are searching, editing, deleting by slug, these need to be unique
    unique: true,
  },
  content: { type: Sequelize.TEXT, allowNull: false },
  status: Sequelize.ENUM("open", "closed"),
});

Page.beforeValidate((page) => {
  // Generate slug if one isn't inputted
  if (!page.slug) {
    page.slug = page.title.replace(/\s/g, "_").replace(/\W/g, "").toLowerCase();
  }
});

const User = db.define("user", {
  name: { type: Sequelize.STRING, allowNull: false },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: { isEmail: true },
  },
});

Page.belongsTo(User, { as: "author" });
User.hasMany(Page);

module.exports = {
  db,
  Page,
  User,
};
