import { Request, Response } from "express"
import prisma from "../../lib/db";
import { hashSync, compareSync } from "bcrypt";


export const signup = async (req: Request, res: Response) => {
    const { name, username, email, password, phone, address ,image} = req.body;
    try {
        const existeUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if (existeUser) {
            return res.status(404).json({
                ok: false,
                message: "User already exists"
            })
        }
        const newUser = await prisma.user.create({
            data: {
                name: name,
                username: username,
                email: email,
                password: hashSync(password, 10),
                phone: phone,
                address: address,
                image: image
            }
        })
        if (!newUser) {
            return res.status(404).json({
                ok: false,
                message: "User already exists"
            })
        }

        return res.status(201).json({
            ok: true,
            message: "User registered successfully",
            user: newUser,
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error
        })
    }
}


export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if (!user) {
            return res.status(400).json({
                ok: false,
                message: "User Not Found"
            })
        }

        const passwordValid = compareSync(password, user?.password as string)
        if (!passwordValid) {
            return res.status(404).json({
                ok: false,
                message: "Incorrect password",
            })
        }

        return res.status(200).json({
            ok: true,
            message: "User logged in successfully",
            user: user,
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error
        })
    }
}