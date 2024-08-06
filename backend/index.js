const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken"); // Ensure you have jwt included
const { type } = require("os");

const port = 4000;
const app = express();



// Middleware
app.use(bodyParser.json()); // Use body-parser to parse JSON payloads
app.use(cors());

// Database connection setup

// Note: For security reasons, the MongoDB connection string is not included directly in this file.
// You need to provide your own MongoDB connection string.

// 1. Replace the empty string in the `mongoose.connect` method with your MongoDB connection URI.
//    Example:
//    mongoose.connect("mongodb+srv://<username>:<password>@<cluster-url>/<database>", {
//        useNewUrlParser: true,
//        useUnifiedTopology: true
//    })
//    .then(() => console.log("Connected to MongoDB"))
//    .catch(error => console.log("Error connecting to MongoDB: ", error));

// 2. Ensure that you have set up a MongoDB database and obtained your connection URI.
//    - Replace `<username>`, `<password>`, `<cluster-url>`, and `<database>` with your MongoDB credentials and database details.

// 3. Make sure not to commit sensitive information such as your connection string to version control.
//    - Use environment variables or other secure methods to manage sensitive data.

//Here's Mongodb connection code Modify it accordint to ur URLI
//mongoose.connect("", {
  //  useNewUrlParser: true,
    //useUnifiedTopology: true
//})
//.then(() => console.log("Connected to MongoDB"))
//.catch(error => console.log("Error connecting to MongoDB: ", error));

// API creation
app.get("/", (req, res) => {
    res.send("Express App is running");
});

// Image storage configuration
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

// Serve static images
app.use('/images', express.static(path.join(__dirname, 'upload/images')));

// Creating upload endpoint for images
app.post("/upload", upload.single('product'), (req, res) => {
    if (req.file) {
        res.json({
            success: 1,
            image_url: `http://localhost:${port}/images/${req.file.filename}`
        });
    } else {
        res.status(400).json({
            success: 0,
            message: "No file uploaded"
        });
    }
});

// Schema for products
const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true
    },
    new_price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true
    },
});

// Adding product endpoint
app.post('/addproduct', async (req, res) => {
    const lastProduct = await Product.findOne({}, {}, { sort: { id: -1 } });

    // Generate the new id
    const newId = lastProduct ? lastProduct.id + 1 : 1;
    const product = new Product({
        id: newId,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
    });
    console.log(product);
    await product.save();
    console.log("saved");
    res.json({
        success: true,
        name: req.body.name,
    })
});

app.post('/removeproduct', async (req, res) => {
    try {
        // Attempt to find and delete the product by id
        const result = await Product.findOneAndDelete({ id: req.body.id });

        // Check if a product was deleted
        if (result) {
            console.log("Removed", result);
            res.json({
                success: true,
                message: "Product removed successfully",
                product: result
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
    } catch (error) {
        console.error("Error removing product:", error);
        res.status(500).json({
            success: false,
            message: "Error removing product"
        });
    }
});

// Start the server
app.listen(port, (error) => {
    if (!error) {
        console.log("Server running on port " + port);
    } else {
        console.log("Error: " + error);
    }
});

// Getting All Products
app.get('/allproducts', async (req, res) => {
    try {
        const products = await Product.find({});
        console.log("All Products");
        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching products"
        });
    }
});

// Schema for users
const Users = mongoose.model('users', {
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    cartData: {
        type: Object,
    },
    date: {
        type: Date,
        default: Date.now,
    },
})

// Endpoint for user registration
app.post('/signup', async (req, res) => {
    let check = await Users.findOne({ email: req.body.email });
    if (check) {
        return res.status(400).json({ success: false, errors: "Existing user found with same email address" })
    }
    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[0] = 0;
    }

    const user = new Users({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData: cart,
    })

    await user.save();
    const data = {
        user: {
            id: user.id
        }
    }

    const token = jwt.sign(data, 'secret_ecom');
    res.json({ success: true, token })
})

//endpoint for users login

// Endpoint for users login
app.post('/login', async (req, res) => {
    try {
        // Check if email is provided
        if (!req.body.email) {
            return res.status(400).json({ success: false, error: "Email is required" });
        }

        let user = await Users.findOne({ email: req.body.email });

        if (user) {
            const passCompare = req.body.password === user.password;
            if (passCompare) {
                const data = {
                    user: {
                        id: user.id,
                    }
                };
                const token = jwt.sign(data, 'secret_ecom');
                res.json({ success: true, token });
            } else {
                res.json({ success: false, error: "Wrong Password" });
            }
        } else {
            res.json({ success: false, error: "Wrong Email Address" });
        }
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

//creating endpoint for newcollection

// Corrected endpoint for newcollection
app.get('/newcollections', async (req, res) => {
    try {
        let products = await Product.find({});
        let newcollection = products.slice(1).slice(-8);
        console.log("NewCollection Fetched");
        res.json(newcollection);
    } catch (error) {
        console.error("Error fetching new collection:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching new collection"
        });
    }
});

//Endpoint for Popular in Women Category

app.get('/popularinwomen',async (req,res)=>{
    let products = await Product.find({category:"women"});
    let popular_in_women = products.slice(0,4);
    console.log("Popular in women fetched")
    res.send(popular_in_women);


})

const fetchUser = async (req,res,next)=>{
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({errors:"Please authenticate using valid token"})


    }
    else{
        try{
            const data = jwt.verify(token,'secret_ecom');
            req.user = data.user;
            next();

        } catch(error)
        {
            res.status(401).send({erros:"please authenticate using a valid token"});

        }
    }



}

//creating endpoint for cart

app.post('/addtocart',fetchUser,async (req,res)=>{
    console.log("Added",req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId]+=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Added")

})

app.post('/removefromcart', fetchUser, async (req, res) => { // Corrected this line
    console.log("Removed", req.body.itemId);
    let userData = await Users.findOne({ _id: req.user.id });
    if (userData.cartData[req.body.itemId] > 0) 
        userData.cartData[req.body.itemId] -= 1;
    
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.send("Removed");
});


app.post('./getcart',fetchUser,async(req,res)=>{
    console.log("GetCart");
    let userData = await Users.findOne({_id:req.user.id})
    res.json(userData.cartData);

})

// Order schema
const Order = mongoose.model('Order', {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    items: [
        {
            productId: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            total: {
                type: Number,
                required: true,
            },
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});


// Confirm Order endpoint

app.post('/confirmorder', fetchUser, async (req, res) => {
    const { cartItems } = req.body;
    try {
        // Fetch user data
        let userData = await Users.findOne({ _id: req.user.id });
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let cartData = userData.cartData;
        let items = [];
        let totalAmount = 0;

        // Process each product in the cart
        for (let productId in cartData) {
            if (cartData[productId] > 0) {
                let product = await Product.findOne({ id: Number(productId) });
                if (product) {
                    let quantity = cartData[productId];
                    let price = product.new_price;
                    let total = price * quantity;

                    items.push({
                        productId: product.id,
                        quantity,
                        price,
                        total
                    });

                    totalAmount += total;
                } else {
                    console.warn(`Product with id ${productId} not found`);
                }
            }
        }

        // Create and save the order
        const order = new Order({
            userId: req.user.id,
            items,
            totalAmount,
        });

        await order.save();
        res.json({
            success: true,
            message: "Order confirmed",
            order,
        });

    } catch (error) {
        console.error("Error confirming order:", error);
        res.status(500).json({
            success: false,
            message: "Error confirming order",
        });
    }
});