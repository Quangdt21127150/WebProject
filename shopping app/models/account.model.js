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
    this.avatar = accountData.avatar;
    this.updateImageData();
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

  static async findExisted(username, accountId) {
    let accId;
    try {
      accId = new mongodb.ObjectId(accountId);
    } catch (error) {
      error.code = 404;
      throw error;
    }

    const accounts = await db
      .getDb()
      .collection("users")
      .find({ $and: [{ username: username }, { _id: { $ne: accId } }] })
      .toArray();

    return accounts.map(function (accountDocument) {
      return new Account(accountDocument);
    });
  }

  static async findByUsername(username) {
    const accounts = await db
      .getDb()
      .collection("users")
      .find({ username: username })
      .toArray();

    return accounts.map(function (accountDocument) {
      return new Account(accountDocument);
    });
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

  updateImageData() {
    this.imagePath = `account-data/images/${this.avatar}`;
    this.imageUrl = `/accounts/assets/images/${this.avatar}`;
  }

  async save() {
    const accountData = {
      username: this.username,
      name: this.name,
      address: this.address,
      avatar: this.avatar,
    };

    if (this.id) {
      const accountId = new mongodb.ObjectId(this.id);

      if (!this.avatar) {
        delete accountData.avatar;
      }

      await db.getDb().collection("users").updateOne(
        { _id: accountId },
        {
          $set: accountData,
        }
      );
    }
  }

  replaceImage(newImage) {
    this.avatar = newImage;
    this.updateImageData();
  }

  remove() {
    const accountId = new mongodb.ObjectId(this.id);
    return db.getDb().collection("users").deleteOne({ _id: accountId });
  }
}

module.exports = Account;
