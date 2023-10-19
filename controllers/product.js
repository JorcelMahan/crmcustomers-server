import Product from '../models/Product.js';


const getProducts = async () => {
    try {
        const products = await Product.find({});
        return products;
    } catch (error) {
        console.log(error);
    }
}

const getProduct = async (id) => {

    const product = await Product.findById(id);

    if (!product) {
        throw new Error("Producto no encontrado");
    }

    return product;

}

const newProduct = async (input) => {
    try {
        const product = new Product(input);
        product.save();
        return product;
    } catch (error) {
        console.log(error);
    }
}

const updateProduct = async (id, input) => {

    let product = await Product.findById(id);

    if (!product) {
        throw new Error("Producto no encontrado");
    }

    product = await Product.findOneAndUpdate({
        _id: id
    }, input, { new: true });

    return product;
}

const deleteProduct = async (id) => {
    let product = await Product.findById(id);

    if (!product) {
        throw new Error("Producto no encontrado");
    }

    await Product.findOneAndDelete({
        _id: id
    });

    return "Producto eliminado";

}


const searchProduct = async (text) => {
    const products = await Product.find({ $text: { $search: text } }).limit(10);

    return products;
}

export default {
    getProducts,
    getProduct,
    newProduct,
    updateProduct,
    deleteProduct,
    searchProduct
}