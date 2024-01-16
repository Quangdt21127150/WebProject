const mongodb = require("mongodb");

const db = require("../data/database");

class Account {
  constructor(accountData) {
    this.username = accountData.username;
    this.password = accountData.password;
    this.name = accountData.name;
    this.address = accountData.address;
    this.isAdmin = accountData.isAdmin;
    if (accountData._id) {
      this.id = accountData._id.toString();
    }
  }

  static async findById(accountId) {
    let accId;
    try {
      accId = new mongodb.ObjectId(accountId);
    } catch (error) {
      error.code = 404;
      throw error;
    }
    const account = await db
      .getDb()
      .collection("users")
      .findOne({ _id: accId });

    if (!account) {
      const error = new Error("Could not find account with provided id.");
      error.code = 404;
      throw error;
    }

    return new Account(account);
  }

  static async findAll() {
    const accounts = await db
      .getDb()
      .collection("users")
      .find()
      .sort({ username: 1 })
      .toArray();

    return accounts.map(function (accountDocument) {
      return new Account(accountDocument);
    });
  }

  async save() {
    const accountData = {
      username: this.username,
      name: this.name,
      address: this.address,
    };

    if (this.id) {
      const accountId = new mongodb.ObjectId(this.id);

      await db.getDb().collection("users").updateOne(
        { _id: accountId },
        {
          $set: accountData,
        }
      );
    }
  }

  remove() {
    const accountId = new mongodb.ObjectId(this.id);
    return db.getDb().collection("users").deleteOne({ _id: accountId });
  }
}

module.exports = Account;
