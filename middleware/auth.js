import jwt from 'jsonwebtoken'
import nconf from 'nconf'
import Mechanic from '../database/models/mechanic';
import Driver from '../database/models/driver';
import { sendBadRequest } from '../utils'


export const authMechanic = (req, res, next) => {
  const JWT_SECRET = nconf.get('jwtSecret')
  const token = req.header("x-auth-token");
  if (!token) {
    return sendBadRequest(res, 401, 'No token provided')
  }

  try {
    jwt.verify(token, JWT_SECRET, (err, decodedData) => {
      if (err) {
        console.log(err)
        return sendBadRequest(res, 401, `Unauth ${err}`)
      }

      Mechanic.findById(decodedData._id, (err, mechanic) => {
        if(!mechanic){
          return sendBadRequest(res, 401, 'No such mechanic')
        }

        req.user = mechanic;
        next()
      })
    })
  } catch(err) {
    return sendBadRequest(res, 401, `Unauth ${err}`)
  }
}

export const authDriver = (req, res, next) => {
  const JWT_SECRET = nconf.get('jwtSecret')
  const token = req.header("x-auth-token");
  if (!token) {
    return sendBadRequest(res, 401, 'No token provided')
  }

  try {
    jwt.verify(token, JWT_SECRET, (err, decodedData) => {
      if (err) {
        console.log(err)
        return sendBadRequest(res, 401, `Unauth ${err}`)
      }

      Driver.findById(decodedData._id, (err, driver) => {
        if(!driver){
          return sendBadRequest(res, 401, 'No such driver')
        }

        req.user = driver;
        next()
      })
    })
  } catch(err) {
    return sendBadRequest(res, 401, `Unauth ${err}`)
  }
}

export const signToken = (user) => {
  const JWT_SECRET = nconf.get('jwtSecret')
  const userData = user.toObject();
  delete user.password
  return jwt.sign(userData, JWT_SECRET)
}
