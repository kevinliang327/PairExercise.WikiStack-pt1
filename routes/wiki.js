const express = require("express");
const router = express.Router();
const { Page, User } = require("../models");
const { main, addPage, editPage, wikiPage } = require("../views");

router.get("/", async (req, res, next) => {
  try {
    const pages = await Page.findAll();
    res.send(main(pages));
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const [user, wasCreated] = await User.findOrCreate({
      where: {
        name: req.body.name,
        email: req.body.email,
      },
    });

    const page = await Page.create(req.body);
    await page.setAuthor(user);

    // make sure we only redirect *after* our save is complete! Don't forget to `await` the previous step. `create` returns a Promise.
    res.redirect(`/wiki/${page.slug}`);
  } catch (error) {
    next(error);
  }
});

router.put("/:slug", async (req, res, next) => {
  try {
    const [updatedRowCount, updatedPages] = await Page.update(req.body, {
      where: {
        slug: req.params.slug,
      },
      returning: true,
    });
    updatedPages[0].slug = updatedPages[0].title
      .replace(/\s/g, "_")
      .replace(/\W/g, "")
      .toLowerCase();
    await updatedPages[0].save();

    res.redirect("/wiki/" + updatedPages[0].slug);
  } catch (error) {
    next(error);
  }
});

router.delete("/:slug", async (req, res, next) => {
  try {
    await Page.destroy({
      where: {
        slug: req.params.slug,
      },
    });

    res.redirect("/wiki");
  } catch (error) {
    next(error);
  }
});

router.get("/add", (req, res, next) => {
  res.send(addPage());
});

router.get("/:slug", async (req, res, next) => {
  try {
    const page = await Page.findOne({
      where: { slug: req.params.slug },
    });
    if (page === null) {
      res.sendStatus(404);
    } else {
      const author = await page.getAuthor();
      res.send(wikiPage(page, author));
    }
  } catch (error) {
    next(error);
  }
});

router.get("/:slug/edit", async (req, res, next) => {
  try {
    const page = await Page.findOne({
      where: { slug: req.params.slug },
    });
    const author = await page.getAuthor();
    res.send(editPage(page, author));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
