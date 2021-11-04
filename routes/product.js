const router = require("express").Router();
const {verifyTokenAndAdmin} = require("./verifyToken");
const Product = require("../models/Product")

//ADD
router.post("/", async (req, res) => {
    const product = new Product(req.body);

    try {
        const savedProduct = await product.save();
        res.status(200).json(savedProduct);
    } catch (err) {
        res.status(500).json(err);
    }
});


//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findOneAndUpdate(
            req.params.id, {
                $set: req.body
            }, {new: true}
        );
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json(err);
    }
});


//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted!");
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET BY ID
router.get("/find/:id", async (req, res) => {
    try {
        const product = await Product.find(req.params.id);
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json(err);
    }
});


//GET ALL
router.get("/", async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
        let products;

        if(qNew){
            products = await Product.find().sort({createdAt: -1}).limit(5);
        } else if (qCategory){
            products = await Product.find({categories:{
                $in: [qCategory]
                }});
        } else {
            products = await Product.find();
        }

        res.status(200).json(products);
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router