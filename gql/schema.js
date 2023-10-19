const typeDefs = `#graphql

    type User {
        id: ID
        name: String
        lastName: String
        email: String
        createdAt: String
    }

    type Token {
        token: String
    }

    type Product {
        id: ID
        name: String
        stock: Int
        price: Float
        createdAt: String
    }

    type Client {
        id: ID
        name: String
        lastName: String
        company: String
        email: String
        phone: String
        seller: ID
        createdAt: String
    }

    type Order {
        id: ID
        order: [OrderGroup]
        total: Float
        client: Client
        seller: ID
        state: OrderState
        createdAt: String
    }

    type OrderGroup {
        id: ID
        quantity: Int
        name: String
        price: Float
    }

    type TopClient {
        total: Float
        client: [Client]
    }

    type TopSeller {
        total: Float
        seller: [User]
    }


    # Inputs

    input UserInput {
        name: String!
        lastName: String!
        email: String!
        password: String!
    }

    input AuthInput {
        email: String!
        password: String!
    }

    input ProductInput {
        name: String!
        stock: Int!
        price: Float!
    }

    input ClientInput {
        name: String!
        lastName: String!
        company: String!
        email: String!
        phone: String
    }

    input OrderProductInput {
        id: ID
        quantity: Int
        name: String
        price: Float
    }

    input OrderInput {
        order: [OrderProductInput]
        total: Float
        client: ID
        state: OrderState
    }

    enum OrderState {
        PENDING
        COMPLETED
        CANCELED
    }

    # Queries

    type Query {
        # Users
        getUser: User

        # Products
        getProducts: [Product]
        getProduct(id: ID!): Product

        # Clients
        getClients: [Client]
        getClientsSeller: [Client]
        getClient(id: ID!): Client

        # Orders
        getOrders: [Order]
        getOrdersSeller: [Order]
        getOrder(id: ID!): Order
        getOrdersState(state: String!): [Order]

        # Advanced Searches
        bestClients: [TopClient]
        bestSellers: [TopSeller]
        searchProduct(text: String!): [Product]

    }

    # Mutations

    type Mutation {
        # Users
        newUser(input: UserInput): User
        authUser(input: AuthInput): Token

        # Products
        newProduct(input: ProductInput): Product
        updateProduct(id: ID!, input: ProductInput): Product
        deleteProduct(id: ID!): String

        # Clients
        newClient(input: ClientInput): Client
        updateClient(id: ID!, input: ClientInput): Client
        deleteClient(id: ID!): String

        # Orders
        newOrder(input: OrderInput): Order
        updateOrder(id: ID!, input: OrderInput): Order
        deleteOrder(id: ID!): String
    }
`

export default typeDefs;