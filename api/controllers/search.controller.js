const Product = require("../../models/product.model");
const productsHelper = require("../../helper/product");

//[GET] /api/search
module.exports.index = async (req, res) => {
  try {
    const keyword = req.query.keyword;
    let newProducts = [];
    
    if(keyword){
      const keywordRegex = new RegExp(keyword, "i");
      const products = await Product.find({
        title: keywordRegex,
        deleted: false,
        status: "active"
      });
      
      newProducts = productsHelper.priceNewProducts(products);
    }
    
    res.json({
      success: true,
      data: {
        products: newProducts,
        keyword: keyword
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
