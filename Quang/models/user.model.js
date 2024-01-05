const bcrypt = require("bcryptjs");
const mongodb = require("mongodb");

const db = require("../data/database");

class User {
  constructor(username, password, fullname, street, postal, city) {
    this.username = username;
    this.password = password;
    this.name = fullname;
    this.address = {
      street: street,
      postalCode: postal,
      city: city,
    };
  }

  static findById(userId) {
    const uid = new mongodb.ObjectId(userId);

    return db
      .getDb()
      .collection("users")
      .findOne({ _id: uid }, { projection: { password: 0 } });
  }

  getUserWithSameUsername() {
    return db.getDb().collection("users").findOne({ username: this.username });
  }

  async existsAlready() {
    const existingUser = await this.getUserWithSameUsername();
    if (existingUser) {
      return true;
    }
    return false;
  }

  async signup() {
    const hashedPassword = await bcrypt.hash(this.password, 12);

    await db.getDb().collection("users").insertOne({
      username: this.username,
      password: hashedPassword,
      name: this.name,
      address: this.address,
    });
  }

  hasMatchingPassword(hashedPassword) {
    return bcrypt.compare(this.password, hashedPassword);
  }
}

module.exports = User;
