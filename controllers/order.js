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
        throw new Error("Order not found");
    }

    if (order.seller.toString() !== ctx.user.id) {
        throw new Error("You don't have the credentials");
    }

    return order;

}


const getOrdersSeller = async (ctx) => {

    try {
        const orders = await Order.find({ seller: ctx.user.id }).populate('client');
        return orders;
    } catch (error) {
        console.log(error);
    }
}

const getOrdersState = async (state, ctx) => {

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
        throw new Error("Order not found");
    }

    if (clientFind.seller.toString() !== ctx.user.id) {
        throw new Error("You don't have the credentials");
    }



    for await (const article of input.order) {
        const { id } = article;

        const product = await Product.findById(id);

        if (article.quantity > product.stock) {
            throw new Error(`The product: ${product.name} exceeds the available quantity`);
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
        throw new Error("Order not found");
    }

    const existClient = await Client.findById(client);
    if (!existClient) {
        throw new Error("Client not found");
    }


    if (existClient.seller.toString() !== ctx.user.id) {
        throw new Error("You don't have the credentials");
    }

    // update stock
    if (input.order) {
        for await (const article of input.order) {
            const { id } = article;

            const product = await Product.findById(id);

            if (article.quantity > product.stock) {
                throw new Error(`The product: ${product.name} exceeds the available quantity`);
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
        throw new Error("Order not found");
    }

    if (order.seller.toString() !== ctx.user.id) {
        throw new Error("You don't have the credentials");
    }

    await Order.findOneAndDelete({
        _id: id
    });

    return "Order deleted";

}


export default {
    getOrders,
    getOrder,
    getOrdersSeller,
    getOrdersState,
    newOrder,
    updateOrder,
    deleteOrder,
}
