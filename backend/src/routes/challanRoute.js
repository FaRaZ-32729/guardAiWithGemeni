const express = require('express');
const { getAllChallans, getAllChallansOfUser, getSingleChallanById, updateChallanStatus, deleteChallan } = require('../controllers/challanController');
const router = express.Router();

router.get('/', getAllChallans);                      // GET    /api/challan?status=unpaid&page=1&limit=10
router.get('/user/:userId', getAllChallansOfUser);    // GET    /api/challan/user/:userId
router.get('/single/:id', getSingleChallanById);            // GET    /api/challan/:id
router.put('/update/:id/status', updateChallanStatus);    // PATCH  /api/challan/:id/status
router.delete('/delete/:id', deleteChallan);                // DELETE /api/challan/:id

module.exports = router;