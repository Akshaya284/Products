const productServices = require("../Services/productServices");
const multer = require('multer');
const path = require("path");
const axios = require('axios');


let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
  }
})

let maxSize = 2 * 1000 * 1000;
let upload = multer({
  storage: storage,
  limits: {
    fileSize: maxSize
  }
});

exports.createProduct = [
  upload.single("productImage"),
  async (req, res, next) => {
    const { productName, productCode, manufacturer, price, stock } = req.body;


    if (!productCode || productCode.trim() === "" || productCode === null) {
      return res.status(400).json({ message: "Product code is required" });
    }

    try {
      const roleResponse = await axios.get('http://localhost:3001/auth/check-user-role', {
        headers: {
          Authorization: `Bearer ${req.headers.authorization.split(' ')[1]}`
        }
      });

      const userRole = roleResponse.data.role;

      if (userRole !== 'admin') {
        return res.status(403).json({ message: "Unauthorized. Only admins can create product" });
      };

      const result = await productServices.createProduct({
        productName,
        productCode,
        manufacturer,
        price,
        stock
      });

      if (req.file) {
        result.productImage = req.file.originalname;
      }

      return res.status(201).json({ message: "Product created successfully", data: result });
    } catch (error) {
      return res.status(500).json({ message: "Error creating product", error: error.message });
    }
  }
];

exports.editProduct = [
  upload.single("productImage"),
  async (req, res) => {
    const productId = req.params.id;

    try {
      const roleResponse = await axios.get('http://localhost:3001/auth/check-user-role', {
        headers: {
          Authorization: `Bearer ${req.headers.authorization.split(' ')[1]}`
        }
      });

      const userRole = roleResponse.data.role;

      if (userRole !== "admin") {
        res.status(401).json({ message: "Unauthorized. Only admins can edit products" })
      }

      const existingProduct = await productServices.getProductById(productId);

      if (!existingProduct) {
        return res.status(400).json({ message: "No product found" })
      }

      if (existingProduct.deleted === true) {
        return res.status(403).json({ message: "Product has been deleted and cannot be edited" });
      }

      const { productName, manufacturer, price, stock } = req.body;

      const updatedFields = {
        productName,
        manufacturer,
        price,
        stock,
      };

      if (req.file) {
        updatedFields.productImage = req.file.originalname;
      }
      const updatedProduct = await productServices.editProduct(productId, updatedFields);
      return res.status(200).json({ message: "Product updated successfully", data: updatedProduct });
    } catch (error) {
      return res.status(500).json({ message: "Error updating product", error: error.message });
    }
  }
];

exports.getProductById = async (req, res, next) => {
  const productId = req.params.id;

  try {
    const product = await productServices.getProductById(productId);
    if (product.deleted === true) {
      return res.status(401).json({ message: "Product has been deleted and cannot be viewed" })
    }
    if (!product) {
      throw new Error("Product not found")
    };
    return res.status(201).json({ message: "Product retrieved successfully", data: product });
  }
  catch (error) {
    return res.status(500).json({ message: "Error retrieving product detail", error: error.message })
  }
};

exports.getProducts = async (req, res, next) => {
  const { search } = req.query;

  try {
    const product = await productServices.getProducts(search);
    const activeProducts = product.filter(product => product.deleted !== true);
    if (product.length === 0) {
      return res.status(404).json({ message: "No products" })
    }
    return res.status(200).json({ message: "Products retrieved successfully.", data: activeProducts });
  } catch (error) {
    console.error("Error retrieving products:", error);
    return res.status(500).json({ message: "Error retrieving products.", error: error.message });
  }
};

exports.deleteProductById = async (req, res, next) => {
  const productId = req.params.id;

  try {
    const roleResponse = await axios.get('http://localhost:3001/auth/check-user-role', {
      headers: {
        Authorization: `Bearer ${req.headers.authorization.split(' ')[1]}`
      }
    });

    const userRole = roleResponse.data.role;

    if (userRole !== "admin") {
      res.status(401).json({ message: "Unauthorized. Only admins can delete products" })
    }
    const product = await productServices.getProductById(productId)
    const deletedProduct = await productServices.deleteProductById(productId);
    if (product.deleted === true) {
      return res.status(404).json({ message: "Product has been already deleted." })
    }
    return res.status(200).json({ message: "Product deleted successfully.", data: deletedProduct });
  } catch (error) {
    console.error("Error deleting Product");
    return res.status(500).json({ message: "Error deleting product.", error: error.message });
  }
}

exports.checkUserRole = (req, res) => {
  const userRole = req.user;
  return res.status(200).json({ role: userRole });
};
