const Club = require("../models/Club");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const firstNames = [
  "JOHN",
  "ROBERT",
  "MICHAEL",
  "WILLIAM",
  "DAVID",
  "RICHARD",
  "CHARLES",
  "JOSEPH",
  "THOMAS",
  "CHRISTOPHER",
  "DANIEL",
  "PAUL",
  "MARK",
  "DONALD",
  "GEORGE",
  "KENNETH",
  "STEVEN",
  "EDWARD",
  "BRIAN",
  "RONALD",
  "ANTHONY",
  "KEVIN",
  "JASON",
  "MATTHEW",
  "GARY",
  "TIMOTHY",
  "JOSE",
  "LARRY",
  "JEFFREY",
  "FRANK",
  "SCOTT",
  "ERIC",
  "STEPHEN",
  "ANDREW",
];

const lastnames = [
  "JOHNSON",
  "WILLIAMS",
  "BROWN",
  "JONES",
  "GARCIA",
  "MILLER",
  "DAVIS",
  "RODRIGUEZ",
  "MARTINEZ",
  "HERNANDEZ",
  "LOPEZ",
  "GONZALEZ",
  "WILSON",
  "ANDERSON",
  "THOMAS",
  "TAYLOR",
  "MOORE",
  "JACKSON",
  "MARTIN",
  "LEE",
  "PEREZ",
  "THOMPSON",
  "WHITE",
  "HARRIS",
];

const clubNames = [
  "San Miguel",
  "San Andres",
  "Oripoto",
  "La Lagunita",
  "Country Club",
];

const generateClubObjects = async (req, res) => {
  const clubs = [];
  for (let club of clubNames) {
    let email = club.replaceAll(" ", "-");
    const clubData = {
      name: club,
      email: `${email.toLowerCase()}@gmail.com`,
      state: "Maturin",
      country: "Venezuela",
      maxParty: 3,
      guestPrice: 20,
      subscription: {
        start_date: new Date(),
        plan: "Base",
        price: 10,
      },
    };
    console.log(clubData);

    const clubResponse = await Club.create(clubData);
    console.log("club created");

    const provitionalPassword = clubData.name
      .replaceAll(" ", "_")
      .toLowerCase();
    console.log(provitionalPassword);
    const hashedPassword = await bcrypt.hash(provitionalPassword, saltRounds);
    console.log("encripted");
    const superUser = {
      email: clubData.email,
      password: hashedPassword,
      role: "admin",
      clubId: clubResponse._id,
    };
    const userResponse = await User.create(superUser);
    console.log("user created");
    clubs.push({ club: clubResponse, adminUser: userResponse });
  }
  return res.status(200).send(clubs);
};

const generateMember = () => {};
module.exports = { generateClubObjects };
