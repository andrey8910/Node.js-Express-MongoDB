import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = async(req,res) => {
    try {
       // const errors = validationResult(req);

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);

        const doc = new UserModel({
            email: req.body.email,
            passwordHash: hash,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl
        });

        const user = await doc.save();
        const {passwordHash, ...userData} = user._doc

        const token = jwt.sign({
                _id: user._id
            },
            'secret123',
            {
                expiresIn: '30d' //token life
            }
        )

        // if(!errors.isEmpty()){
        //     return res.status(400).json(errors.array());
        // }


        res.json({
            ...userData,
            token
        })

    } catch (err){
        console.log(err);
        res.status(500).json({
            message: 'failed to register'
        });
    }
};

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({
            email: req.body.email
        });

        if(!user){
            return res.status(404).json({message: "user not found"})
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if(!isValidPass){
            return res.status(400).json({message: "wrong login or password"})
        }

        if(isValidPass){
            const token = jwt.sign({
                    _id: user._id
                },
                'secret123',
                {
                    expiresIn: '30d' //token life
                }
            );
            const {passwordHash, ...userData} = user._doc;

            res.json({
                ...userData,
                token
            })
        }



    }catch (err){
        console.log(err);
        res.status(401).json({
            message: '401 Unauthorized'
        });
    }
};

export const getMe = async (req,res) => {
    try {
        const user = await UserModel.findById(req.userId);

        if(!user){
            return res.status(404).json({message: "user not found"})
        }

        const {passwordHash, ...userData} = user._doc;

        res.json(userData);


    }catch (err){
        console.log(err)
        res.status(500).json({
            message: 'No access!'
        })
    }
    res.send('Hello 111');
}