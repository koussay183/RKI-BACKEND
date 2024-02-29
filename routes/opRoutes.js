const express = require('express');
const router = express.Router();

const Op = require("../modules/op")
const Terminal = require("../modules/terminal")
const opAuthVerify = require("../middleware/opAuthVerify")
// ---------------------------Start-OP-Login---------------------------------
router.post('/login', async (req, res) => {
    const { id, password } = req.body;
    try {
      const op = await Op.findOne({ id, password });
      if (op) {
        // Generate JWT token
        const token = jwt.sign({ id: op._id , opId : op.id , role : "op" }, process.env.SECRET_KEY , {expiresIn : "1h"});
        // Set token in cookie
        res.cookie('token', token, { httpOnly: true }); // Set token as HTTP-only for security
        res.send('Login successful!');
      } else {
        res.status(401).send('Invalid credentials');
      }
    } catch (error) {
      res.status(500).send(error);
    }
});

// ---------------------------Start-Teleparametrage---------------------------------
router.post('/telepar', opAuthVerify ,async (req, res) => {
    const { TID , SRV , N_MARCHANT } = req.body;
    try {
      const terminal = await Terminal.findOne({ TID });

      if (terminal) {
        // this is the file props then u can generate it the way u want
        const file = {
            TID : TID,
            ADRESSE : terminal.ADRESSE ,
            SRV : SRV ,
            N_MARCHANT : N_MARCHANT,
            MID : terminal.MID ,
            TMK : terminal.TMK
        }
        
        res.send(file);
      } else {
        res.status(401).send('Invalid TID');
      }
    } catch (error) {
      res.status(500).send(error);
    }
});
module.exports = router;