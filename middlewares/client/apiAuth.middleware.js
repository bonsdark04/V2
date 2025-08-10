const User = require("../../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
  try {
    if (!req.cookies.tokenUser) {
      return res.status(401).json({
        success: false,
        message: "Chưa đăng nhập"
      });
    }
    
    const user = await User.findOne({
      tokenUser: req.cookies.tokenUser,
      deleted: false
    });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Token không hợp lệ"
      });
    }
    
    if (user.status === "inactive") {
      return res.status(403).json({
        success: false,
        message: "Tài khoản đang bị khóa"
      });
    }
    
    req.user = user;
    res.locals.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi xác thực",
      error: error.message
    });
  }
};
