import express from 'express';
const router = express.Router();

// Stock View Dashboard Portal
router.get('/assets/stockView', (req, res) => {
    res.render('assets/stockView');
});


router.get('/', (req, res) => {
    res.redirect('/assets/stockView');
});

export default router;