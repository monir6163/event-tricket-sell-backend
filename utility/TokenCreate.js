const jwt = require("jsonwebtoken");
const TokenCreate = async (user) => {
  const token = jwt.sign(
    {
      name: user.name,
      email: user.email,
      id: user.id,
      role: user.role,
      avater: user.avater,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );
  return token;
};

module.exports = { TokenCreate };
