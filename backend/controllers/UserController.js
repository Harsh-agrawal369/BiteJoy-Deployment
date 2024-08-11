import prisma from "../prisma/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";

// Function to create token
const createToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: 3600 });
};

// Login User
const loginUser = async (req, res) => {

    // Destructuring email and password from request body
    const { email, password } = req.body;

    try {  
        // Validate email and password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email" });
        }

        // Find user in database
        const user = await prisma.userModel.findUnique({   
            where: { email: email },
        });


        // Checking User Existence
        if (!user) {
            return res.json({ success: false, message: "User does not exist!" });
        }

        // Checking Password Validity
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }


        // Create token using jwt
        const token = createToken(user.id);
        res.json({ success: true, token: token, name: user.name });

    }
    catch (error) {
      console.error("Error:", error); 
      res.json({ success: false, message: "Internal Server Error" });
    }
};

// Register User
const registerUser = async (req, res) => {

    // Destructuring name, email, password and confirmPass from request body
    const { name, email, password, confirmPass } = req.body;

    try {

        // Validate name, email, password and confirmPass
        if (!name || !email || !password || !confirmPass) {
        return res.json({ success: false, message: "Please fill all fields" });
        }

        // Validate email
        if (!validator.isEmail(email)) {
        return res.json({ success: false, message: "Invalid email" });
        }

        // Validate password
        if (password !== confirmPass) {
        return res.json({ success: false, message: "Passwords do not match" });
        }

        // Check if user already exists
        const user = await prisma.userModel.findUnique({
        where: { email: email },
        });

        if (user) {
        return res.json({ success: false, message: "User already exists" });
        }

        // Validate password using Regex
        if (
        !password.match(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8}$/)
        ) {
        return res.json({ success: false, message: "Password is weak" });
        }

        // Hashing password
        const salt = await bcrypt.genSalt(10); // Using corrected bcrypt
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = await prisma.userModel.create({
        data: {
            name: name,
            email: email,
            password: hashedPassword,
        },
        });

        // Create token using jwt
        const token = createToken(newUser.id);
        res.json({ success: true, token: token, name : newUser.name });
    } catch (error) {
        console.error("Error:", error); // Improved error logging
        res.json({ success: false, message: "Internal Server Error" });
    }
};

export { loginUser, registerUser };
