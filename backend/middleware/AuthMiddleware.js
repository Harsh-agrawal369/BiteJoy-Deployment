import jwt from 'jsonwebtoken';


const authMiddleware = async (req, res, next) => {
    const {token} = req.headers;

    if(!token){
        return res.status(401).json({success:false ,message: "Unauthorized! Login Again"});
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = decoded.id;
        next();
    }catch(error){
        console.log(error);
        return res.status(500).json({success:false, message: "Internal Server Error"});
    }
}


export {authMiddleware} ;