import express from "express";

const viewsRouter = express.Router();

viewsRouter.get('/static', (req, res) => {
    res.render('chat', {
        js: "chat.js",
        css: "home.css",
        title: "Chat",
        
    });
})

viewsRouter.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', {
        css: "style.css",
        title: "Products",
        js: "realTimeProducts.js"

    })
})


export default viewsRouter;