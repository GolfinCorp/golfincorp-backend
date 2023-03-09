const Club = require("../../models/Club");
const Member = require("../../models/Members");
const User = require("../../models/User");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const generateRandomNumber = () => {
  return Math.floor(Math.random() * 10000000);
};

const getRandomFromList = (list) => {
  const randomNumber = Math.floor(Math.random() * list.length);
  return list[randomNumber];
};

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

    const clubResponse = await Club.create(clubData);

    const hashedPassword = await bcrypt.hash("club", saltRounds);
    const superUser = {
      email: clubData.email,
      password: hashedPassword,
      role: "admin",
      clubId: clubResponse._id,
    };
    const userResponse = await User.create(superUser);
    clubs.push({ club: clubResponse, adminUser: userResponse });
  }
  return res.status(200).send(clubs);
};

const generateMembers = async () => {
  let clubData = [];
  for (let club of clubNames) {
    let email = club.replaceAll(" ", "-");
    club = await Club.findOne({ email: `${email.toLowerCase()}@gmail.com` });
    let clubUsers = [];
    for (let i = 0; i < 10; i++) {
      let userEmail = `${name.firstName}${name.lastname}${membership}@gmail.com`;
      let memberResponse = await Member.create({
        firstName: getRandomFromList(firstNames),
        lastname: getRandomFromList(lastnames),
        membership: generateRandomNumber(),
        clubId: club._id,
        billingDate: new Date(),
      });
      let hashPassword = await bcrypt.hash("club", saltRounds);
      let user = {
        email: `${memberResponse.firstName}${memberResponse.lastname}${membership}@gmail.com`,
        password: hashPassword,
        role: "member",
        clubId: club._id,
        memberId: memberResponse._id,
      };
      let userResponse = await User.create(user);
      clubUsers.push(userResponse);
    }
    clubData.push({ name: club.name, members: clubUsers });
  }
  return res.status(200).send(clubData);
};
module.exports = { generateClubObjects, generateMembers };
