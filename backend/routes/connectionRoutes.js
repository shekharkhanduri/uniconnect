// routes/connectionRoutes.js

const express = require('express');
const router = express.Router();
const {
    sendConnectionRequest,
    acceptConnectionRequest,
    rejectConnectionRequest,
    getMyConnections,
    getPendingRequests,
    removeConnection,
    getSentRequests,
    getConnectionStatus
} = require('../controllers/connectionController');
const validateToken = require('../middleware/validateTokenHandler');

router.use(validateToken);

router.post('/send/:userId', sendConnectionRequest);

router.put('/accept/:connectionId', acceptConnectionRequest);

router.put('/reject/:connectionId', rejectConnectionRequest);

router.get('/my-connections', getMyConnections);

router.get('/pending', getPendingRequests);

router.get('/sent', getSentRequests);

router.delete('/remove/:userId', removeConnection);

router.get('/status/:userId', getConnectionStatus);

module.exports = router;