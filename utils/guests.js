const Member = require("../models/Members");

// ? This function checks if the given user
// Validate which guests have to be charged($), and generate a "bill"
const memberValidator = async (guests, club, res) => {
  let payingGuest = []; // Non member guests have to pay
  let memberGuest = []; // Guests with membership don't pay
  //
  for (let guest of guests) {
    if (guest.membership) {
      // Validate membership legitimacy
      let response = await Member.findOne({
        membership: guest.membership,
        clubId: club._id,
      });

      if (response) {
        memberGuest.push({ ...guest, name: response.firstName });
      } else {
        return res
          .status(404)
          .send({ error: "Member was given an invalid membership" });
      }
    } else {
      // Bill price is retrieved from club.guestPrice
      payingGuest.push({ ...guest, bill: club.guestPrice });
    }
  }
  return [...payingGuest, ...memberGuest];
};

module.exports = { memberValidator };
