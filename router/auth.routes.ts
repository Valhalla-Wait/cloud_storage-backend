import { Request, Response, Router } from "express"
import User from "../models/User"
import bcrypt from 'bcryptjs'
import {check, validationResult} from 'express-validator'

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

    const hashPassword = await bcrypt.hash(password, 15)
    const user = new User({email, password: hashPassword})
    await user.save()
    return  res.json({message: 'User was created'})
  } catch (e) {
    console.log(e)
    res.send({message: 'Server error'})
  }
})

export default router