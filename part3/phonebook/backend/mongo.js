const mongoose = require("mongoose");

if (!(process.argv.length === 3 || process.argv.length === 5)) {
  console.log("input error!");
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://axelhedman00:${password}@phonebook.a4efclf.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=phonebook`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
});
const Contact = mongoose.model("Contact", contactSchema);

if (process.argv.length === 5) {
  const contact = new Contact({
    name: process.argv[3],
    number: process.argv[4],
  });

  contact.save().then((result) => {
    console.log(
      `added ${process.argv[3]} number ${process.argv[4]} to phonebook`
    );
    mongoose.connection.close();
  });
} else if (process.argv.length === 3) {
    console.log("phonebook:");
    Contact.find({}).then((result) => {
    result.forEach((contact) => {
      console.log(`${contact.name} ${contact.number}`)
    });
    mongoose.connection.close();
  });
}
