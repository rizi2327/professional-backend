// import multer from "multer";
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, '.Public/temp')
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.origninalname);
//   }
// })

// const upload = multer({
//      storage,
//      })
import multer from "multer";

const storage= multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./Public/temp')
    },
    filename:function(req,file,cb){
        cb(null,file.originalname);
    }
})
const upload=multer({
    storage,
});

export { upload }