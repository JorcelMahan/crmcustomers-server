import clientController from '../controllers/client.js';
import productController from '../controllers/product.js';
import orderController from '../controllers/order.js';
import userController from '../controllers/user.js';


const resolvers = {
    Query: {
        // User
        getUser: (_, { }, ctx) => userController.getUser(ctx),

        // Client
        getClients: (_, { }, ctx) => clientController.getClients(ctx),
        getClient: (_, { id }, ctx) => clientController.getClient(id, ctx),
        getClientsSeller: (_, { }, ctx) => clientController.getClientsSeller(ctx),
        bestClients: () => clientController.bestClients(),
        bestSellers: () => clientController.bestSellers(),

        // Product
        getProducts: () => productController.getProducts(),
        getProduct: (_, { id }) => productController.getProduct(id),
        searchProduct: (_, { text }) => productController.searchProduct(text),

        // Order
        getOrders: () => orderController.getOrders(),
        getOrder: (_, { id }) => orderController.getOrder(id),
        getOrdersSeller: (_, { }, ctx) => orderController.getOrdersSeller(ctx),
        getOrdersState: (_, { state }, ctx) => orderController.getOrdersState(state, ctx),


    },
    Mutation: {
        // User
        newUser: (_, { input }) => userController.newUser(input),
        authUser: (_, { input }) => userController.authUser(input),

        // Client
        newClient: (_, { input }, ctx) => clientController.newClient(input, ctx),
        updateClient: (_, { id, input }, ctx) => clientController.updateClient(id, input, ctx),
        deleteClient: (_, { id }, ctx) => clientController.deleteClient(id, ctx),

        // Product
        newProduct: (_, { input }) => productController.newProduct(input),
        updateProduct: (_, { id, input }) => productController.updateProduct(id, input),
        deleteProduct: (_, { id }) => productController.deleteProduct(id),

        // Order
        newOrder: (_, { input }, ctx) => orderController.newOrder(input, ctx),
        updateOrder: (_, { id, input }, ctx) => orderController.updateOrder(id, input, ctx),
        deleteOrder: (_, { id }, ctx) => orderController.deleteOrder(id, ctx),

    }
}


export default resolvers;