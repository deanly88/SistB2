var multer  = require('multer');
var path = 'public/uploads';
// cloud9의 path 이상현상으로 인해서 path 설정 파일 생성..
// 때에 따라서 ../public 과 public 의 path가 2 level차이가 난다.
// 또 추후 라즈베리파이 이식위해서 

exports.path = path;
exports.multer = multer;