import Order from '../models/Order.js';
import Client from '../models/Client.js';
import Product from '../models/Product.js';


const getOrders = async () => {
    try {
        const orders = await Order.find({});
        return orders;
    } catch (error) {
        console.log(error);
    }
}

const getOrder = async (id) => {

    const order = await Order.findById(id);

    if (!order) {
        throw new Error("Pedido no encontrado");
    }

    if (order.seller.toString() !== ctx.user.id) {
        throw new Error("No tienes las credenciales");
    }

    return order;

}


const getOrderSeller = async (ctx) => {

    try {
        const orders = await Order.find({ seller: ctx.user.id }).populate('client');
        return orders;
    } catch (error) {
        console.log(error);
    }
}

const getOrderState = async (state, ctx) => {

    try {
        const orders = await Order.find({ seller: ctx.user.id, state });
        return orders;
    } catch (error) {
        console.log(error);
    }
}


const newOrder = async (input, ctx) => {

    const { client } = input;

    const clientFind = await Client.findById(client);

    if (!clientFind) {
        throw new Error("Cliente no encontrado");
    }

    if (clientFind.seller.toString() !== ctx.user.id) {
        throw new Error("No tienes las credenciales");
    }



    for await (const article of input.order) {
        const { id } = article;

        const product = await Product.findById(id);

        if (article.quantity > product.stock) {
            throw new Error(`El articulo: ${product.name} excede la cantidad disponible`);
        } else {
            product.stock = product.stock - article.quantity;
            await product.save();
        }
    }

    const order = new Order(input);
    order.seller = ctx.user.id;
    await order.save();
    return order;

}

const updateOrder = async (id, input, ctx) => {

    const { client } = input;

    const existsOrder = await Order.findById(id);

    if (!existsOrder) {
        throw new Error("Pedido no encontrado");
    }

    const existClient = await Client.findById(client);
    if (!existClient) {
        throw new Error("Cliente no encontrado");
    }


    if (clientFind.seller.toString() !== ctx.user.id) {
        throw new Error("No tienes las credenciales");
    }

    // update stock
    if (input.order) {
        for await (const article of input.order) {
            const { id } = article;

            const product = await Product.findById(id);

            if (article.quantity > product.stock) {
                throw new Error(`El articulo: ${product.name} excede la cantidad disponible`);
            } else {
                product.stock = product.stock - article.quantity;
                await product.save();
            }
        }
    }

    const result = await Order.findByIdAndUpdate({
        _id: id
    }, input, { new: true });

    return result;
}


const deleteOrder = async (id, ctx) => {
    let order = await Order.findById(id);

    if (!order) {
        throw new Error("Pedido no encontrado");
    }

    if (order.seller.toString() !== ctx.user.id) {
        throw new Error("No tienes las credenciales");
    }

    await Order.findOneAndDelete({
        _id: id
    });

    return "Pedido eliminado";

}


export default {
    getOrders,
    getOrder,
    getOrderSeller,
    getOrderState,
    newOrder,
    updateOrder,
    deleteOrder,
}
