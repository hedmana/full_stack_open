const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

require("dotenv").config();

const app = express();
const Contact = require("./models/contact");
const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(express.json());
app.use(express.static("dist"));
app.use(cors());
app.use(
  morgan(function (tokens, req, res) {
    if (tokens.method(req, res) === "POST") {
      return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, "content-length"),
        "-",  
        tokens["response-time"](req, res),
        "ms",
        JSON.stringify(req.body),
      ].join(" ");
    } else {
      return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, "content-length"),
        "-",
        tokens["response-time"](req, res),
        "ms",
      ].join(" ");
    }
  })
);

app.get("/api/phonebook", (request, response, next) => {
  Contact.find({})
    .then((result) => {
      response.json(result);
    })
    .catch((error) => next(error));
});

app.get("/api/phonebook/:id", (request, response, next) => {
  Contact.findById(request.params.id)
    .then((contact) => {
      if (contact) {
        response.json(contact);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.get("/info", (request, response, next) => {
  const date = new Date();
  Contact.find({})
    .then((contacts) => {
      response.send(
        `<p>Phonebook has info for ${contacts.length} people</p><p>${date}</p>`
      );
    })
    .catch((error) => next(error));
});

app.post("/api/phonebook", (request, response, next) => {
  const body = request.body;
  const contact = new Contact({
    name: body.name,
    number: body.number,
  });
  contact
    .save()
    .then((savedContact) => {
      response.json(savedContact);
      console.log(`added ${body.name} number ${body.number} to phonebook`);
    })
    .catch((error) => next(error));
});

app.put("/api/phonebook/:id", (request, response, next) => {
  const { name, number } = request.body;
  Contact.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: "query" }
  )
    .then((contact) => {
      response.json(contact);
      console.log(`updated contact with ID: ${request.params.id}`);
    })
    .catch((error) => next(error));
});

app.delete("/api/phonebook/:id", (request, response, next) => {
  Contact.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
