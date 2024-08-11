import prisma from "../prisma/index.js"
import fs from "fs";

// Add Food Item

const addFood = async (req, res) => {
  try {
    let image_filename = `${req.file.filename}`;

    const food = await prisma.foodModel.create({
      data: {
        name: req.body.name,
        description: req.body.description,
        price: parseInt(req.body.price, 10),
        category: req.body.category,
        image: image_filename,
      },
    });

    if (food) {
      res.json({ success: true, message: "Food Added" });
    } else {
      res.json({ success: false, message: "Internal Server Error" });
    }
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Internal Server Error" });
  }
};


// All food list

const listFood = async (req, res) => {
  try {
    const foods = await prisma.foodModel.findMany();

    const sortedFoodList = foods.sort((a, b) =>
      a.category.localeCompare(b.category)
    );

    res.json({ success: true, data: sortedFoodList });
  } catch (err) {
    console.log("Error fetching food list:", err);
    res.json({ success: false, message: "Internal Server Error" });
  }
};



// Remove Food item

const removeFood = async (req, res) => {  
  try {
    const food = await prisma.foodModel.findUnique({
      where: {
        id: req.body.id,
      },
    });

    fs.unlink(`uploads/${food.image}`, async (err) => {});

    await prisma.foodModel.delete({
      where: {
        id: req.body.id,
      },
    });

    res.json({ success: true, message: "Food Removed" });
    
  }
  catch (err) {
    console.log(err);
    res.json({ success: false, message: "Internal Server Error" });
  }

}


export { addFood, listFood, removeFood };
