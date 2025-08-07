const axios = require('axios');

// Hàm kiểm tra nội dung comment bằng AI
async function moderateComment(content) {
  try {
    // Sử dụng OpenAI API để kiểm tra nội dung
    const response = await axios.post('https://api.openai.com/v1/moderations', {
      input: content
    }, {
      headers: {
        'Authorization': `Bearer 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`,
        'Content-Type': 'application/json'
      }
    });
    console.log(response.data);
    const result = response.data.results[0];
    
    // Kiểm tra các flag vi phạm
    const flags = result.flags;
    const categories = result.categories;
    
    // Danh sách các loại vi phạm cần kiểm tra
    const violationTypes = [
      'hate', 'hate/threatening', 'self-harm', 'sexual', 
      'sexual/minors', 'violence', 'violence/graphic'
    ];
    
    let hasViolation = false;
    let violationType = null;
    
    // Kiểm tra từng loại vi phạm
    for (const type of violationTypes) {
      if (categories[type] === true) {
        hasViolation = true;
        violationType = type;
        break;
      }
    }
    
    return {
      isViolation: hasViolation,
      violationType: violationType,
      flagged: result.flagged,
      categories: categories,
      scores: result.category_scores
    };
    
  } catch (error) {
    console.error('Error in AI moderation:', error);
    
    // Fallback: Kiểm tra từ khóa cấm cơ bản
    return fallbackModeration(content);
  }
}

// Fallback moderation khi không có API key hoặc lỗi
function fallbackModeration(content) {
  const bannedWords = [
    // 🔞 Chửi tục tiếng Việt (có dấu)
    'địt', 'đụ', 'lồn', 'cặc', 'đéo', 'đcm', 'vãi l*n', 'vãi lồn', 'vcl', 'loz', 'clgt',
    'má mày', 'mẹ mày', 'đồ ngu', 'óc chó', 'não chó', 'ngu vãi', 'ngu như bò', 'ngu như lợn',
  
    // 🔞 Chửi tục tiếng Việt (không dấu/lách luật)
    'dit', 'du', 'lon', 'cac', 'deo', 'dcm', 'vl', 'loz', 'oc cho', 'oc lon', 'oc heo', 'dm', 'cl',
  
    // 🔞 Chửi tục tiếng Anh
    'fuck', 'shit', 'bitch', 'asshole', 'dick', 'pussy', 'bastard', 'slut', 'faggot', 'moron',
  
    // 🚫 Spam, lừa đảo, gian lận
    'spam', 'scam', 'lừa đảo', 'lừa gạt', 'gian thương', 'bịp bợm', 'treo đầu dê', 'bán thịt chó', 'hàng fake', 'hàng giả', 'đạo nhái',
  
    // 👎 Chê bai sản phẩm nặng
    'rác', 'rác rưởi', 'đồ bỏ đi', 'phế phẩm', 'đồ đểu', 'hàng lởm', 'tệ', 'quá tệ', 'cực kỳ tệ', 
    'kém chất lượng', 'không ra gì', 'không xứng đáng', 'rẻ tiền', 'không đáng tiền', 'phí tiền',
    'dở ẹc', 'chán', 'vớ vẩn', 'xấu vãi', 'xấu vãi l', 'xấu như chó', 'xấu như cc', 'xấu kinh tởm',
    'buồn nôn', 'thảm họa', 'thiết kế như đùa', 'đỉnh cao của tệ hại', 'sản phẩm của trò đùa',
    'mua 1 lần chừa cả đời', 'tiền mất tật mang', 'như cức', 'như cứt', 'như cc', 'như loz', 'như l',
    'hãm l', 'hãm vãi', 'thất vọng', 'cực kỳ thất vọng', 'khác mô tả', 'khác xa thực tế',
  
    // 🤡 Mỉa mai, châm biếm
    'siêu phẩm phế phẩm', 'best vãi', 'đỉnh thật sự', 'đỉnh của chóp (mỉa mai)', 'đỉnh cao thất bại', 
    'trò hề', 'cạn lời', 'ai mua là dại', 'đúng là trò hề', 'bán cho ai vậy trời', 'nhìn phát ói'
  ];
  
  
  const lowerContent = content.toLowerCase();
  let hasViolation = false;
  let violationType = null;
  
  for (const word of bannedWords) {
    if (lowerContent.includes(word)) {
      hasViolation = true;
      violationType = 'inappropriate_language';
      break;
    }
  }
  
  return {
    isViolation: hasViolation,
    violationType: violationType,
    flagged: hasViolation,
    categories: {},
    scores: {}
  };
}

module.exports = {
  moderateComment
}; 