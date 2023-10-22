import Client from '../models/Client.js';
import Order from '../models/Order.js';



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
        throw new Error("Customer not found");
    }

    if (client.seller.toString() !== ctx.user.id) {
        throw new Error("You don't have the credentials");
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
        throw new Error("The client already exists");
    }

    const newClient = new Client(input);
    newClient.seller = ctx.user.id;

    console.log('newClient', newClient)


    try {
        const result = await newClient.save();
        return result;
    } catch (error) {
        console.log(error);
        throw new Error("Something went wrong");
    }
}

const updateClient = async (id, input, ctx) => {

    let client = await Client.findById(id);

    if (!client) {
        throw new Error("Customer not found");
    }

    if (client.seller.toString() !== ctx.user.id) {
        throw new Error("You don't have the credentials");
    }

    client = await Client.findOneAndUpdate({
        _id: id
    }, input, { new: true });

    return client;

}

const deleteClient = async (id, ctx) => {

    let client = await Client.findById(id);

    if (!client) {
        throw new Error("Customer not found");
    }

    if (client.seller.toString() !== ctx.user.id) {
        throw new Error("You don't have the credentials");
    }

    await Client.findOneAndDelete({
        _id: id
    });

    // delete all orders from client
    await Order.deleteMany({ client: id });

    return "Customer deleted";

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
