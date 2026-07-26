import express from 'express';
const router = express.Router();

// Stock View Dashboard Portal
router.get('/assets/stockView', (req, res) => {
    res.render('assets/stockView');
});

//Asset Management
router.get('/assets', (req, res) => {
    res.render('assets/index', {
        title: 'Asset Master'
    });
});

router.get('/categories', (req, res) => {
    res.render('category/index', {
        title: 'Category Master'
    });
});

router.get('/', (req, res) => {
    res.render('assets/stockView');
});

export default router;