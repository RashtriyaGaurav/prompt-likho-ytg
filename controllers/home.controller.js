const Image = require("../models/image");
const Category = require("../models/category");

class HomeController {

    async index(req, res) {

        try {

            const { category } = req.query; // e.g. "boy", "girl", "trending"

            let query = { status: "published" };
            let sort = { createdAt: -1 };

            if (category && category !== "trending") {

                // match category name case-insensitively (e.g. "boy" matches "Boy")
                const categoryDoc = await Category.findOne({
                    name: new RegExp(`^${category}$`, "i")
                });

                // if the category doesn't exist, fall back to an empty result
                // rather than silently showing everything
                query.category = categoryDoc ? categoryDoc._id : null;

            }

            if (category === "trending") {
                sort = { "stats.views": -1 };
            }

            const images = await Image.find(query)
                .populate("category")
                .sort(sort);

            res.render("home/index", {
                images,
                selectedCategory: category || ""
            });

        } catch (err) {

            console.error(err);

            res.status(500).send(err.message);

        }

    }

}

module.exports = new HomeController();