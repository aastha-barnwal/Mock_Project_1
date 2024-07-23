const axios = require('axios')
const querystring = require('querystring')
const redirectURI = "auth/google/callback";
const User = require('../models/user')
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
// Generate a random JWT secret (base64 encoded)
const jwtSecret = crypto.randomBytes(32).toString('base64');

const signup = (req,res)=>{
    const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?scope=profile%20email&access_type=offline&include_granted_scopes=true&response_type=code&state=state_parameter_passthrough_value&redirect_uri=http://localhost:${process.env.PORT}/auth/google/callback&client_id=${process.env.CLIENT_ID}`;
    res.redirect(redirectUrl);
}


async function getTokens({ code, clientId, clientSecret, redirectUri }) {
    const url = "https://oauth2.googleapis.com/token";
    const values = {
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    };
    // console.log(values);
   
    try {
      const response = await axios.post(url, querystring.stringify(values), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
   
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch auth tokens: ${error.message}`);
      throw new Error(error.message);
    }
  }
   
  // Getting the user from Google with the code
  const googleCallback= async (req, res) => {
      try{
          const code = req.query.code;
        //   console.log(code);
          const tokenx = await getTokens({
            code,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            redirectUri: `http://localhost:3005/${redirectURI}`,
          });
          // console.log(1)
          const { id_token, access_token } = tokenx;
          // console.log(id_token)
          // Fetch the user's profile with the access token and bearer
          const googleUser = await axios
            .get(
              `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
              {
                headers: {
                  Authorization: `Bearer ${id_token}`,
                },
              }
            )
            .then((res) => res.data)
            .catch((error) => {
              console.error(`Failed to fetch user`);
              throw new Error(error.message);
            });
            const currUser = new User({
              name: googleUser.name,
              email: googleUser.email
            })
            // console.log(googleUser);
            currUser.save();
            const token = jwt.sign(googleUser, jwtSecret);
        
          res.cookie("AuthCookie", token, {
            maxAge: 1800000       // expiration set to 30 mins
          });
        
          res.status(200).json({ message: "Authentication successful" });
      }catch(error){
          console.log("Error getting the user!")
      }
  };

  // authentication for api
  const authenticateToken = (req, res, next)=> {

    const accessToken = req.cookies.AuthCookie;
  
    if (!accessToken) {
      return res.status(401).send('Access token not found');
    }
  
    jwt.verify(accessToken, jwtSecret, (err, decoded) => {
      if (err) {
        return res.status(403).send('Invalid token');
      }
      req.user = decoded;
      next();
    });
  };


module.exports={signup,googleCallback,authenticateToken};