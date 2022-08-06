# Golfincorp Api 🏌️

Restful api created for golfincorp.

## **Stack 🔰**

- Express.js
- Bcrypt
- Moongose
- MongoDb (Mongo Atlas)
- JsonWebToken

## Colaborator guidelines

Branch name convention

```
main -> Only merge from dev with previous testing
dev -> Merge with caution
feature/feature-name
fix/fix-description
exp/feature-experimental
```

Commit convention

```bash
git commit -m "[:gitmoji: action] commit detail"

# If more than one comment is required

git commit -m "[✨ add] new feature" -m "[🔧 fix] extra data"
```

Gitmoji Selection(https://gitmoji.dev/)

```
✨ add new feature/function/file
🔧 fix something
🚑 Hotfix
🚧 On progress
🏗️ New files/middlewares
🗃️ New model
🔇 Remove logs
📝 Update Docs
🔥 Remove unused files
```

## Controllers 🎛️

Inside controllers there are declared several files with their respective functions which are consumed from routes

File structure

```js
// At the start of the file we declare all required modules, with 3rd party first, then local modules
const mongoose = require("mongoose");

// Followed by the file docs

/**
 * @exports
 *  myExportedFunction(body, params)
 */

// Then all the functions
const myExportedFunction = async (req, res) => {
  return res.status(200).send({ msg: "Example function" });
};

// At the end we use a single export

module.exports = { myExportedFunction };
```

## Models

Our models folder is the home of all our database models.

Currently we have 5 Models

```json
Club: {
  email
	name
	state
	country
	subscription: {
		startDate,
		billingDate,
		bills,
		plan,
		price,
	},
};

User: {
  email
	password
	role
	newUser
	clubId
	memberId
}

game: {
  memberId
  clubId
  membership
  memberName
  date
  status
  guests: [
    {
      name,
      membership,
      payment
    },
  ]
}

Member: {
  firstName
	lastname
	membership
	billingDate
	status
	clubId
}
```
