import Client from '../models/Client.js';
import Product from '../models/Product.js';


const getClients = async () => {
    try {
        const clients = await Client.find({});
        return clients;
    } catch (error) {
        console.log(error);
    }
}


const getClient = async (id, ctx) => {

    const client = await Client.findById(id);

    if (!client) {
        throw new Error("Cliente no encontrado");
    }

    if (client.seller.toString() !== ctx.user.id) {
        throw new Error("No tienes las credenciales");
    }

    return client;
}


const getClientsSeller = async (ctx) => {
    try {
        const clients = await Client.find({ seller: ctx.user.id });
        return clients;
    } catch (error) {
        console.log(error);
    }
}


const bestClients = async () => {

    const clients = await Order.aggregate([
        { $match: { state: "COMPLETED" } },
        {
            $group: {
                _id: "$client",
                total: { $sum: "$total" }
            }
        },
        {
            $lookup: {
                from: "clients",
                localField: "_id",
                foreignField: "_id",
                as: "client"
            }
        },
        {
            $limit: 10
        },
        {
            $sort: { total: -1 }
        }
    ]);

    return clients;

}

const bestSellers = async () => {

    const sellers = await Order.aggregate([
        { $match: { state: "COMPLETED" } },
        {
            $group: {
                _id: "$seller",
                total: { $sum: "$total" }
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "seller"
            }
        },
        {
            $limit: 3
        },
        {
            $sort: { total: -1 }
        }
    ]);

    return sellers;

}



const newClient = async (input, ctx) => {

    const { email } = input;

    const client = await Client.findOne({ email });

    if (client) {
        throw new Error("El cliente ya está registrado");
    }

    const newClient = new Client(input);
    newClient.seller = ctx.user.id;

    try {
        const result = await newClient.save();
        return result;
    } catch (error) {
        console.log(error);
    }
}

const updateClient = async (id, input, ctx) => {

    let client = await Client.findById(id);

    if (!client) {
        throw new Error("Cliente no encontrado");
    }

    if (client.seller.toString() !== ctx.user.id) {
        throw new Error("No tienes las credenciales");
    }

    client = await Client.findOneAndUpdate({
        _id: id
    }, input, { new: true });

    return client;

}

const deleteClient = async (id, ctx) => {

    let client = await Client.findById(id);

    if (!client) {
        throw new Error("Cliente no encontrado");
    }

    if (client.seller.toString() !== ctx.user.id) {
        throw new Error("No tienes las credenciales");
    }

    await Client.findOneAndDelete({
        _id: id
    });

    return "Cliente eliminado";

}


export default {
    getClients,
    getClient,
    getClientsSeller,
    bestClients,
    bestSellers,
    newClient,
    updateClient,
    deleteClient
}
