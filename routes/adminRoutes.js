require('dotenv').config(); // Load environment variables

const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

const superAdmin = require("../modules/superAdmin");
const subAdmin = require("../modules/subAdmin");
const Op = require("../modules/op");
const Action = require("../modules/actionsHistory")
const Terminal = require("../modules/terminal")
const Bank = require('../modules/bank')

const superAdminAuthVerify = require('../middleware/superAdminAuthVerify'); 
// ---------------------------Start-History-Funcs----------------------------------
// create a func that get creatorRole , createdDate , title and save action in actions (import actions module)

// Route to get all actions history (accessible only to super admins)
router.get('/get-history', superAdminAuthVerify, async (req, res) => {
    try {
        const actions = await Action.find();
        res.send(actions);
    } catch (error) {
        res.status(500).send(error);
    }
});

// ---------------------------Start-Admin-Login---------------------------------
router.post('/login', async (req, res) => {
  const { id, password } = req.body;
  try {
    const admin = await superAdmin.findOne({ id, password });
    if (admin) {
      // Generate JWT token
      const token = jwt.sign({ id: admin._id ,adminId : admin.id , role : "superAdmin" }, process.env.SECRET_KEY , {expiresIn : "1h"});
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

// -----------------------------Start-SubAdmin-------------------------------


// Route to create subadmin (accessible only to super admins)
router.post('/create-subadmin', superAdminAuthVerify, async (req, res) => {
    try {
      const subadmin = new subAdmin(req.body);
      await subadmin.save();
      res.status(201).send(subadmin);
    } catch (error) {
      res.status(400).send(error);
    }
});

// Route to read a specific subadmin (accessible only to super admins)
router.get('/get-subadmin/:id', superAdminAuthVerify, async (req, res) => {
    try {
      const subadmin = await subAdmin.findById(req.params.id); // Use SubAdmin model
      if (!subadmin) return res.status(404).send('Subadmin not found');
      res.send(subadmin);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
// Route to get all subadmins (accessible only to super admins)
router.get('/get-all-subadmins', superAdminAuthVerify, async (req, res) => {
try {
    const subadmins = await subAdmin.find(); // Use SubAdmin model
    res.send(subadmins);
} catch (error) {
    res.status(500).send(error);
}
});

// Route to update a specific subadmin (accessible only to super admins)
router.patch('/update-subadmin/:id', superAdminAuthVerify, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'id', 'password']; // Specify allowed fields for update
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const subadmin = await subAdmin.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!subadmin) return res.status(404).send('Subadmin not found');
        res.send(subadmin);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Route to delete a specific subadmin (accessible only to super admins)
router.delete('/delete-subadmin/:id', superAdminAuthVerify, async (req, res) => {
    try {
        const subadmin = await subAdmin.findByIdAndDelete(req.params.id); // Use SubAdmin model
        if (!subadmin) return res.status(404).send('Subadmin not found');
        res.send(subadmin);
    } catch (error) {
        res.status(500).send(error);
    }
});


// ---------------------------Start-Opirator----------------------------------


// Route to create op (accessible only to super admins)
router.post('/create-op', superAdminAuthVerify, async (req, res) => {
    try {
      const op = new Op(req.body);
      await op.save();
      res.status(201).send(op);
    } catch (error) {
      res.status(400).send(error);
    }
});

// Route to read a specific op (accessible only to super admins)
router.get('/get-op/:id', superAdminAuthVerify, async (req, res) => {
    try {
      const op = await Op.findById(req.params.id); // Use op model
      if (!op) return res.status(404).send('op not found');
      res.send(op);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
// Route to get all ops (accessible only to super admins)
router.get('/get-all-ops', superAdminAuthVerify, async (req, res) => {
try {
    const ops = await Op.find(); // Use op model
    res.send(ops);
} catch (error) {
    res.status(500).send(error);
}
});

// Route to update a specific op (accessible only to super admins)
router.patch('/update-op/:id', superAdminAuthVerify, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'id', 'password']; // Specify allowed fields for update
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const op = await Op.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!op) return res.status(404).send('op not found');
        res.send(op);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Route to delete a specific op (accessible only to super admins)
router.delete('/delete-op/:id', superAdminAuthVerify, async (req, res) => {
    try {
        const op = await Op.findByIdAndDelete(req.params.id); // Use op model
        if (!op) return res.status(404).send('op not found');
        res.send(op);
    } catch (error) {
        res.status(500).send(error);
    }
});


// ---------------------------Start-Download-SData---------------------------------

// Route to serve a file for download (accessible only to super admins)
router.get('/download-file', superAdminAuthVerify, (req, res) => {
    // Path to the file to be downloaded
    const filePath = '../SDATA.json'; // Replace with the actual path to your file

    // Set response headers for the file download
    const fileName = 'SDATA.json'; 
    res.download(filePath, fileName, (err) => {
        if (err) {
        // Handle error
        console.error('Error downloading file:', err);
        res.status(500).send('Error downloading file');
        }
    });
});


// ---------------------------TMK-Start--------------------------------
// Route to create op (accessible only to super admins)
router.post('/create-tmk', superAdminAuthVerify, async (req, res) => {
  const { TID , TMK } = req.body;

  try {
    const terminal = await Terminal.findOne({TID})

    if(!terminal) {
      return res.status(400).send("No Terminal With This Id")
    }

    terminal.TMK = TMK;
    await terminal.save();

    res.status(200).send(terminal);
  } catch (error) {
    res.status(400).send(error);
  }
});

// ---------------------------Create-COMP and ZMK-Start--------------------------------
// func that will generate zmk
function xorStrings(str1, str2, str3) {
  if (str1.length !== str2.length || str2.length !== str3.length) {
      throw new Error('Strings must have the same length');
  }

  let result = '';
  for (let i = 0; i < str1.length; i++) {
      // Convert characters to ASCII codes
      const char1 = str1.charCodeAt(i);
      const char2 = str2.charCodeAt(i);
      const char3 = str3.charCodeAt(i);

      // Perform XOR operation between ASCII codes
      const xorResult = char1 ^ char2 ^ char3;

      // Convert back to character and append to result
      result += String.fromCharCode(xorResult);
  }

  return result;
}

router.post('/add-comp', superAdminAuthVerify, async (req, res) => {

  const { comp , compNumber} = req.body;

  try {

    const bank = await Bank.findOne({})

    if(!bank ) {
      return res.status(400).send("No Bank Yet Check Your DB or No Admin With This Id")
    }

    if(compNumber == 1) {
      bank.COMP1 = comp
      await bank.save();
    } else if(compNumber == 2) {
      bank.COMP2 = comp
      await bank.save();
    } else {
      bank.COMP3 = comp
      await bank.save();
    }

    if(bank.COMP1 && bank.COMP2 && bank.COMP3) {
      const zmk = xorStrings(bank.COMP1 , bank.COMP2 , bank.COMP3)
      bank.ZMK = zmk
      await bank.save()
    }
    res.status(200).send("COMP ADDED !");
  } catch (error) {
    res.status(400).send(error);
  }
});
module.exports = router;