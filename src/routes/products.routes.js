import { Router } from "express"
import { ProductManager } from "../dao/models/productsManager.js"

const productRouter = Router();

productRouter.get('/', async (req, res) => {
    const {limit} = req.query
    try {
        const products = await ProductManager.findAll(limit);
        res.status(200).send({respuesta: 'ok', mensaje: products})
    } catch (error){
        res.status(400).send({respuesta: 'Error', mensaje: error})
    }
})

productRouter.get('/:id', async (req, res) => {
    const {id} = req.params
    try {
        const product = await ProductManager.findById(id);
        if (product)
            res.status(200).send({respuesta: 'ok', mensaje: product})
        else 
            res.status(404).send({respuesta: 'Error', mensaje: 'Product not found'})
    } catch (error){
        res.status(400).send({respuesta: 'Error', mensaje: error})
    }
})

productRouter.post('/', async (req, res) => {
    const {title, description, code, price, stock, category} = req.body
    try {
        const respuesta = await ProductManager.create({title, description, code, price, stock, category});
        res.status(200).send({respuesta: 'ok', mensaje: respuesta})
    } catch (error){
        res.status(400).send({respuesta: 'Error al crear producto', mensaje: error})
    }
})

productRouter.put('/:code', async (req, res) => {
    const { code } = req.params;
    console.log(code)
    const {title, description, price, status, stock, category} = req.body
    try {
        const product = await ProductManager.updateByCode({ code: code }, { title, description, price, code,  stock, category, status});
        if (product)
            res.status(200).send({respuesta: 'ok product updated', mensaje: product})
        else 
            res.status(404).send({respuesta: 'Error', mensaje: 'Product not found'})
    } catch (error){
        res.status(400).send({respuesta: 'Error updating product', mensaje: error})
    }
})

productRouter.delete('/:id', async (req, res) => {
    const {id} = req.params
    try {
        const product = await ProductManager.deleteById(id);
        if (product)
            res.status(200).send({respuesta: 'ok product deleted', mensaje: product})
        else 
            res.status(404).send({respuesta: 'Error', mensaje: 'product not found'})
    } catch (error){
        res.status(400).send({respuesta: 'Error', mensaje: error})
    }
})

export default productRouter