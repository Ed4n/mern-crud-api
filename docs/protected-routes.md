# Protected Routes

⬆︎ [Back to RedMe](../README.md)

To do this, we first must the the [jwt authentication](./jwt-autentication.md) process.

Once this is done, we create a middle ware that will be placed in the routes that we want to protect:

`middlewares/validateToken.js`

the function is this one [validateToken.js](../src/middlewares/validateToken.js)

## Auth Required Function

1. **Extract Token from Cookies**

   ```javascript
   const { token } = req.cookies;
   ```

   - Extracts the `token` from the cookies of the incoming request.

2. **Check if Token Exists**

   ```javascript
   if (!token)
       return res.status(401).json(
           {
               success: false,
               message: "Token not found, Authorization Denied!"
           })
   ```

   - If the token is not found, it responds with a 401 status code indicating that the client is unauthorized and returns a JSON object with an error message.

3. **Verify the Token**

   ```javascript
   jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
   ```

   - Uses the `jwt.verify` function from the `jsonwebtoken` library to verify the token.
   - `process.env.SECRET_KEY` is the secret key used to verify the token's authenticity.
   - If the token is invalid or expired, the `err` parameter will contain an error.

4. **Handle Verification Errors**

   ```javascript
   if (err) return res.status(403).json({
       success: false,
       message: "Invalid Token"
   })
   ```

   - If there is an error during token verification, it responds with a 403 status code indicating that the client is forbidden from accessing the resource and returns a JSON object with an error message.

6. **Attach User to Request and Call Next Middleware**

   ```javascript
   req.user = user
   next()
   ```

   - If the token is valid, it decodes the token and attaches the decoded user information to the `req.user` property.
   - Calls the `next` function to pass control to the next middleware function in the stack.

The `authRequired` middleware function checks for a JWT token in the request cookies. If the token is missing or invalid, it responds with an appropriate error message. If the token is valid, it decodes the token, attaches the user information to the request object, and allows the request to proceed to the next middleware. This function ensures that only authenticated users can access certain routes.

## Integration in The Routes

Finally we integrate it in the route like this:

```js
import { authRequired } from "../middlewares/validatetoken.js"


router.get("/profile", authRequired, profile)
```
