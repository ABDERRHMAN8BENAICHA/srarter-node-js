import { Request, Response } from "express"
import prisma from "../../lib/db";
import { hashSync, compareSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../env";
const tokenExpiration = '30d';
export const signup = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
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
                email: email,
                password: hashSync(password, 10)
            }
        })
        if (!newUser) {
            return res.status(404).json({
                ok: false,
                message: "User already exists"
            })
        }

        const token = jwt.sign({ id: newUser.id, name: newUser.name, email: newUser.email }, SECRET_KEY as string, { expiresIn: tokenExpiration })
        const { iat, exp } = jwt.decode(token) as { iat: number; exp: number };
        return res.status(201).json({
            ok: true,
            message: "User registered successfully",
            user: newUser,
            token,
            iat: new Date(iat * 1000),
            exp: new Date(exp * 1000) 
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
        const existeUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if (!existeUser) {
            return res.status(404).json({
                ok: false,
                message: "User already exists"
            })
        }
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if (!user) {
            return res.status(404).json({
                ok: false,
                message: "User already exists"
            })
        }
        const passwordValid = compareSync(password, user?.password as string)
        if (!passwordValid) {
            return res.status(404).json({
                ok: false,
                message: "Password incorrect"
            })
        }
        const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, SECRET_KEY as string, { expiresIn: tokenExpiration })
        const { iat, exp } = jwt.decode(token) as { iat: number; exp: number };
        return res.status(200).json({
            ok: true,
            message: "User registered successfully",
            user: user,
            token,
            iat: new Date(iat * 1000), 
            exp: new Date(exp * 1000) 
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error
        })
    }
}