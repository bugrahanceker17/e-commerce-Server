const router = require("express").Router();
const {verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyToken} = require("./verifyToken");
const Cart = require("../models/Cart");

//ADD
router.post("/", verifyToken, async (req, res) => {
    const newCart = new Cart(req.body);

    try {
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    } catch (err) {
        res.status(500).json(err);
    }
});


//UPDATE
router.put("/:id", verifyToken, async (req, res) => {
    try {
        const updatedCart = Cart.findByIdAndUpdate(
            req.params.id,
            {$set: req.body},
            {new: true}
        );
        res.status(200).json(updatedCart);
    } catch (err) {
        res.status(500).json(err);
    }
});


//DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart has been deleted!");
    } catch (err) {
        res.status(500).json(err);
    }
});


//GET BY ID
router.get("/find/:userId", verifyToken, async (req, res) => {
    try {
        const cart = await Cart.findOne({userId: req.params.userId});
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json(err);
    }
});


//GET ALL
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const carts = await Cart.find();
        res.status(200).json(carts);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router