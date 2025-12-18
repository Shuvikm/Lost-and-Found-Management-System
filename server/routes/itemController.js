const Item = require("../models/ItemSchema");
const mongoose = require("mongoose");

const checkDb = (res) => {
    if (mongoose.connection.readyState !== 1) {
        res.status(503).json({ error: "Database unavailable. Please try again later." });
        return false;
    }
    return true;
};

const fetchItems = async (req, res) => {
    try {
        if (!checkDb(res)) return;
        const { q, type, from, to, location, category, status } = req.query;

        const query = { isDeleted: { $ne: true } };
        if (type && ["lost", "found"].includes(type)) query.concerntype = type;
        if (status && ["reported", "claimed", "resolved"].includes(status)) query.status = status;
        if (location) query.location = new RegExp(location, "i");
        if (category) query.category = new RegExp(category, "i");
        if (from || to) {
            query.date = {};
            if (from) query.date.$gte = new Date(from);
            if (to) query.date.$lte = new Date(to);
        }
        if (q) {
            const re = new RegExp(q, "i");
            query.$or = [
                { itemname: re },
                { itemdescription: re },
            ];
        }

        // Use allowDiskUse to prevent memory limit errors with large datasets
        const items = await Item.find(query).sort({ date: -1 }).allowDiskUse(true).limit(100);
        res.json({ gotItem: items });
    } catch (error) {
        console.error("Error during fetchItems:", error);
        res.status(500).send("Internal Server Error");
    }
}

const fetchUserSpecificItems = async (req, res) => {
    try {
        console.log(req.user);
        // const userId = req.user._id;
        const userId = req.params.id;
        // find the items for the specified user ID
        const items = await Item.find({ user: userId });

        // respond with them
        res.json({ gotItems: items });
    } catch (error) {
        // Handle errors here
        console.error("Error during fetchItemsPersonal:", error);
        res.status(500).send("Internal Server Error");
    }
}

const fetchItem = async (req, res) => {
    try {
        // get id off the url
        const itemId = req.params.id;

        // find the notes using that id
        const item = await Item.findById(itemId);

        // respond with them
        res.json({ gotItem: item });
    } catch (error) {
        // Handle errors here
        console.error("Error during fetchItem:", error);
        res.status(500).send("Internal Server Error");
    }
}

const createItem = async (req, res) => {
    const { images } = req.body;
    try {
        // Extract data from the request body
        const itemname = req.body.itemname;
        const itemdescription = req.body.itemdescription;
        const concerntype = req.body.concerntype;

        // Get the user ID from the authenticated user (assuming you have authentication middleware)
        const userId = req.params.id; // Adjust this based on your authentication setup

        // Create the item with the associated user
        const item = await Item.create({
            itemname: itemname,
            itemdescription: itemdescription,
            concerntype: concerntype,
            images: images,
            user: userId, // Include the user ID in the item
        });

        // Respond with the created item
        res.json({ item: item });
    } catch (error) {
        // Handle errors here
        console.error("Error during createItem:", error);
        res.status(500).send("Internal Server Error");
    }
};

const updateItem = async (req, res) => {
    try {
        const itemId = req.params.id;
        const { itemname, itemdescription, concerntype, images } = req.body;

        const updatedItem = await Item.findByIdAndUpdate(
            itemId,
            {
                itemname,
                itemdescription,
                concerntype,
                ...(images ? { images } : {}),
            },
            { new: true, runValidators: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ message: "Item not found" });
        }

        res.json({ updatedItem });
    } catch (error) {
        console.error("Error during updateItem:", error);
        res.status(500).send("Internal Server Error");
    }
}

const deleteItem = async (req, res) => {
    try {
        const itemId = req.params.id;
        const updated = await Item.findByIdAndUpdate(itemId, { isDeleted: true, status: 'resolved' }, { new: true });
        if (!updated) return res.status(404).json({ message: "Item not found" });
        res.json({ success: "Item marked as resolved" });
    } catch (error) {
        console.error("Error during deleteItem:", error);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = {
    fetchItem: fetchItem,
    fetchUserSpecificItems: fetchUserSpecificItems,
    fetchItems: fetchItems,
    createItem: createItem,
    updateItem: updateItem,
    deleteItem: deleteItem
}
