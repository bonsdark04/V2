const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const productsHelper = require("../../helper/product");

//[POST] /api/cart/add/:productId
module.exports.addPost = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity);

    if (!cartId) {
      return res.status(400).json({
        success: false,
        message: "Không tìm thấy giỏ hàng"
      });
    }

    const cart = await Cart.findOne({
      _id: cartId
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Giỏ hàng không tồn tại"
      });
    }

    const exitProductInCart = cart.products.find(item => item.product_id == productId);
    
    if(exitProductInCart){
      const newQuantity = quantity + exitProductInCart.quantity;
      await Cart.updateOne(
        {
          _id: cartId,
          'products.product_id': productId
        },
        {
          'products.$.quantity': newQuantity
        }
      );
    } else {
      const objectCart = {
        product_id: productId,
        quantity: quantity
      };
  
      await Cart.updateOne(
        {
          _id: cartId
        },
        {
          $push: { products: objectCart }
        }
      );
    }

    res.json({
      success: true,
      message: "Thêm sản phẩm vào giỏ hàng thành công!"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message
    });
  }
};

//[GET] /api/cart
module.exports.cart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      _id: req.cookies.cartId
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy giỏ hàng"
      });
    }

    if(cart.products.length > 0 ){
      for(const item of cart.products){
        const productInfo = await Product.findOne({
          _id: item.product_id
        });
        
        if (productInfo) {
          productInfo.priceNew = productsHelper.priceNewProduct(productInfo);
          item.productInfo = productInfo;
          item.totalPrice = item.quantity * productInfo.priceNew;
        }
      }
    }

    cart.totalPrice = cart.products.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

    res.json({
      success: true,
      data: {
        cart: cart
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message
    });
  }
};

//[DELETE] /api/cart/delete/:productId
module.exports.delete = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    
    await Cart.updateOne({
      _id: cartId
    },
    {
      "$pull": {products: { "product_id": productId}}
    });

    res.json({
      success: true,
      message: "Đã xóa sản phẩm khỏi giỏ hàng!"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message
    });
  }
};

//[PUT] /api/cart/update/:productId/:quantity
module.exports.update = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const quantity = parseInt(req.params.quantity);

    await Cart.updateOne(
      {
        _id: cartId,
        'products.product_id': productId
      },
      {
        'products.$.quantity': quantity
      }
    );
    
    res.json({
      success: true,
      message: "Cập nhật số lượng thành công"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message
    });
  }
};
