const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");
const productsHelper = require("../../helper/product");
const { createPaymentUrl } = require("../../helper/vnpay");
const crypto = require("crypto");
const querystring = require("qs");

// Tính tổng tiền (đã áp dụng giảm giá)
function calculateTotalAmount(orderProducts) {
  return orderProducts.reduce((sum, p) => {
    const discountedPrice = p.price * (1 - (p.discountPercentage || 0) / 100);
    return sum + discountedPrice * p.quantity;
  }, 0);
}

// Sắp xếp object để ký
function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  for (let key of keys) {
    sorted[key] = obj[key];
  }
  return sorted;
}

// [GET] /api/checkout
module.exports.index = async (req, res) => {
  try {
    const cart = await Cart.findOne({ _id: req.cookies.cartId });

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Giỏ hàng trống"
      });
    }

    for (const item of cart.products) {
      const productInfo = await Product.findById(item.product_id);
      if (productInfo) {
        productInfo.priceNew = productsHelper.priceNewProduct(productInfo);
        item.productInfo = productInfo;
        item.totalPrice = item.quantity * productInfo.priceNew;
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

// [POST] /api/checkout
module.exports.order = async (req, res) => {
  try {
    const cartId = req.cookies.cartId;
    const userInfo = req.body;

    const cart = await Cart.findOne({ _id: cartId });
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Giỏ hàng trống"
      });
    }

    const products = [];
    for (const product of cart.products) {
      const productInfo = await Product.findById(product.product_id);

      products.push({
        product_id: product.product_id,
        price: productInfo.price,
        discountPercentage: productInfo.discountPercentage,
        quantity: product.quantity,
      });
    }

    const totalAmount = calculateTotalAmount(products);

    const order = new Order({
      cart_id: cartId,
      userInfo,
      products,
      totalAmount,
      status: "pending",
    });

    await order.save();

    const paymentMethod = req.body.paymentMethod;

    if (paymentMethod === "cod") {
      order.status = "paid";
      await order.save();
      await Cart.updateOne({ _id: order.cart_id }, { products: [] });

      res.json({
        success: true,
        message: "Đặt hàng thành công!",
        data: {
          orderId: order._id,
          status: "paid"
        }
      });

    } else if (paymentMethod === "vnpay") {
      const orderInfo = order._id.toString();
      const paymentUrl = createPaymentUrl({
        orderId: order._id.toString(),
        amount: totalAmount,
        orderInfo,
        returnUrl: "http://localhost:3000/api/checkout/vnpay-return",
      });
      
      res.json({
        success: true,
        message: "Chuyển hướng đến trang thanh toán",
        data: {
          orderId: order._id,
          paymentUrl: paymentUrl,
          status: "pending"
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Vui lòng chọn phương thức thanh toán!"
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message
    });
  }
};

// [GET] /api/checkout/success/:id
module.exports.success = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng"
      });
    }

    for (const product of order.products) {
      const productInfo = await Product.findById(product.product_id).select("title thumbnail");
      product.productInfo = productInfo;
      product.priceNew = productsHelper.priceNewProduct(product);
      product.totalPrice = product.quantity * product.priceNew;
    }

    order.totalPrice = order.products.reduce((sum, item) => sum + item.totalPrice, 0);

    res.json({
      success: true,
      data: {
        order: order
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

// [GET] /api/checkout/vnpay-return
module.exports.vnpayReturn = async (req, res) => {
  try {
    let vnp_Params = req.query;

    let secureHash = vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"]; // nếu có

    vnp_Params = sortObject(vnp_Params);

    const secretKey = process.env.VNP_HASH_SECRET || "FI8DNHRRIWNQ3WB4RVMJ4ZTYKQGTLMJG";

    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hash = crypto.createHmac("sha512", secretKey).update(signData).digest("hex");

    if (secureHash === hash) {
      if (vnp_Params["vnp_ResponseCode"] === "00") {
        // Cập nhật trạng thái đơn hàng
        const orderId = vnp_Params["vnp_TxnRef"];
        await Order.updateOne(
          { _id: orderId },
          { status: "paid" }
        );
        
        res.json({
          success: true,
          message: "Thanh toán thành công!"
        });
      } else {
        res.json({
          success: false,
          message: "Giao dịch thất bại."
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: "Chữ ký không hợp lệ!"
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message
    });
  }
};
