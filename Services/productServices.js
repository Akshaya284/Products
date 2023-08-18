const Product = require("../Models/productModel");

async function createProduct(params) {
    try {
        if (params.productCode === undefined) {
            throw new Error("product code required");
        };

        const existingProduct = await Product.findOne({ productCode: params.ProductCode });

        if (existingProduct) {
            throw new Error("product already exists");
        };

        const product = new Product(params);
        const response = await product.save();

        if (params.productImage) {
            response.productImage = params.productImage;
        };

        return response.toJSON();
    }
    catch (error) {
        throw error;
    };
};

async function editProduct(productId, updatedFields) {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(productId, updatedFields, { new: true });

        if (!updatedProduct) {
            throw new Error("Product not found");
        }

        return updatedProduct.toJSON();
    } catch (error) {
        throw error;
    }
};

async function getProductById(productId) {
    try {
        const product = Product.findById(productId);
        if (!product) {
            throw new Error("Product not found");
        }
        return product;
    }
    catch (error) {
        throw error;
    }
};

async function getProducts(search) {
    try {
        const query = {};
        if (search) {
            query.$or = [
                { productCode: { $regex: search, $options: "i" } },
                { productName: { $regex: search, $options: "i" } }
            ];
        }



        const products = await Product.find(query);
        return products.map(product => product.toJSON());

    } catch (error) {
        throw error;
    }
};

async function deleteProductById(productId) {
    try {
        const deletedProduct = await Product.findByIdAndUpdate(
            productId,
            { deleted: true },
            { new: true }
        )
        if (!deletedProduct) {
            throw new Error("product not found")
        }
        return deletedProduct
    }
    catch (error) {
        throw error;
    }
}

module.exports = {
    createProduct,
    editProduct,
    getProductById,
    getProducts,
    deleteProductById
}