module.exports = {
  jwtSecret: process.env.JWT_SECRET || "cover your mouth when you cough friend",
  hashRounds: process.env.HASHING_ROUNDS || 8
};
