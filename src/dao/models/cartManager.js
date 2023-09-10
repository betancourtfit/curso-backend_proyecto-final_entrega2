import { cartModel } from "./carts.models.js";
import { productModel } from "./products.models.js";

class CartDAO {
    async findAll(limit) {
        return await cartModel.find().limit(limit);
    }

    async findById(id) {
        return await cartModel.findById(id);
    }

    async create() {
        return await cartModel.create({});
    }

    async addOrUpdateProductInCart(cartId, productId, quantity) {
        const cart = await this.findById(cartId);
        if (!cart) {
            throw new Error("Cart not found");
        }

        const product = await productModel.findById(productId);
        if (!product) {
            throw new Error("Product not found");
        }

        const index = cart.products.findIndex(prod => prod.id_prod.toString() === productId);
        if (index !== -1) {
            cart.products[index].quantity = quantity;
        } else {
            cart.products.push({ id_prod: productId, quantity: quantity });
        }

        return await cart.save();
    }
}

export const CartManager = new CartDAO();
