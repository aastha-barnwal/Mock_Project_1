const redirectURI = "auth/google/redirect";
 
function getGoogleAuthURL() {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: `http://localhost:3000/${redirectURI}`,
    client_id: CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };
  return `${rootUrl}?${querystring.stringify(options)}`;
}
 
// Getting login URL
app.get("/auth/google", (req, res) => {
  return res.redirect(getGoogleAuthURL());
});             
 
async function getTokens({ code, clientId, clientSecret, redirectUri }) {
  const url = "https://oauth2.googleapis.com/token";
  const values = {
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  };
 
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
app.get(`/${redirectURI}`, async (req, res) => {
    try{
        const code = req.query.code;
        const tokenx = await getTokens({
          code,
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          redirectUri: `http://localhost:3000/${redirectURI}`,
        });
        console.log(tokenx)
        const { id_token, access_token } = tokenx;
      
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
          const currUser = new Userdata({
            name: googleUser.name,
            email: googleUser.email
          })
          console.log(googleUser);
          currUser.save();
          const token = jwt.sign(googleUser, JWT_SECRET);
      
        res.cookie("AuthCookie", token, {
          maxAge: 1800000       // expiration set to 30 mins
        });
      
        res.redirect('/');
    }catch(error){
        console.log("Error getting the user!")
    }
});
 