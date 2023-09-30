const Product = require("../../models/product.model");
    
module.exports.index = async (req, res) => {
      const products = await Product.find({});
    
      const newProducts = products.map(item => {
        item.priceNew = ((item.price * (100 - item.discountPercentage)) / 100).toFixed(0);
    
        return item;
      });
    
      
    
      res.render("client/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: newProducts
      });
}
module.exports.detail = async (req, res) => {
  const slug = req.body.slug;
  const product = await Product.findOne({slug:slug,deleted:false, status: "active"});
  res.render("client/pages/products/detail",{
    product:product
  });
}