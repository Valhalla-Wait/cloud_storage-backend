import { Request, Response, Router } from "express"
import User from "../models/User"
import bcrypt from 'bcryptjs'
import {check, validationResult} from 'express-validator'
import jwt from 'jsonwebtoken'
import config from 'config'

const router = Router()

type RegistrationType = {
  email: string,
  password: string
}

router.post('/registration', 
  [
    check('email', 'Uncorrect email').isEmail(),
    check('password', "Password must be longer than 3 and shorter than 12").isLength({min:3, max: 12})
  ],
  async (req:Request, res:Response) => {
  try {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({message: "Uncorrect request", errors})
    }

    const {email, password}:RegistrationType = req.body

    const condidate = await User.findOne({email})

    if (condidate) {
      return res.status(400).json({message: `User with email ${email} already exist`})
    }

    const hashPassword = await bcrypt.hash(password, 8)
    const user = new User({email, password: hashPassword})
    await user.save()
    return  res.json({message: 'User was created'})
  } catch (e) {
    console.log(e)
    res.send({message: 'Server error'})
  }
})

router.post('/login', async (req:Request, res:Response) => {
  try {

    const {email, password}:RegistrationType = req.body

    const user = await User.findOne({email})

    if (!user) {
      return res.status(400).json({message: `User not found`})
    }
    const isPassValid = bcrypt.compareSync(password, user.password)
    if (!isPassValid) {
      return res.status(400).json({message: "Invalid password"})
    }
    const token = jwt.sign({id: user.id}, config.get("secretKey"), {expiresIn: "1h"})

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        diskSpace: user.diskSpace,
        usedSpace: user.usedSpace,
        avatar: user.avatar
      }
    })
  } catch (e) {
    console.log(e)
    res.send({message: 'Server error'})
  }
})

export default router