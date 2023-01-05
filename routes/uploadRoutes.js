import path from 'path'
import express from 'express'
import multer from 'multer';
import aws from 'aws-sdk';
import multerS3 from 'multer-s3';
 

const router = express.Router()

// UPLOAD TO LOCAL ==========================================================

// const imageStorage = multer.diskStorage({
//   // Destination to store image     
//   destination: 'uploads', 
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + '_' + Date.now() 
//            + path.extname(file.originalname))
//           // file.fieldname is name of the field (image)
//           // path.extname get the uploaded file extension
//   }
// });

// const imageUpload = multer({
//   storage: imageStorage,
//   limits: {
//     fileSize: 1000000 // 1000000 Bytes = 1 MB
//   },
//   fileFilter(req, file, cb) {
//     if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) { 
//        // upload only png and jpg format
//        return cb(new Error('Please upload a Image'))
//      }
//    cb(undefined, true)
// }
// }) 

// router.post('/', imageUpload.single('image'), (req, res) => {
//   res.send(req.file)
// }, (error, req, res, next) => {
//   res.status(400).send({ error: error.message })
// })


// UPLOAD TO AWS S3 ==========================================================


// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, 'uploads/')
//     //  cb(null, '/home/ubuntu/genovacollection/uploads/');

//   },
//   filename(req, file, cb) {
//     cb(
//       null,
//       `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
//     )
//   },
// })

// function checkFileType(file, cb) {
//   const filetypes = /jpg|jpeg|png/
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
//   const mimetype = filetypes.test(file.mimetype)

//   if (extname && mimetype) {
//     return cb(null, true)
//   } else {
//     cb('Images only!')
//   }
// }

// const upload = multer({
//   storage,
//   fileFilter: function (req, file, cb) {
//     checkFileType(file, cb)
//   },
// })


// Upload to s3
aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: 'ap-southeast-1',
});

const s3 = new aws.S3();


const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Invalid Mime Type, only JPEG and PNG'), false);
  }
};

const upload = multer({
  fileFilter,
  storage: multerS3({
    s3,
    bucket: 'wardathi-s3',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: 'TESTING_META_DATA!' });
    },
    key: function (req, file, cb) {
      let myFile = file.mimetype.split('/');
      const fileType = myFile[myFile.length - 1];
      cb(null, Date.now().toString() + '.' + fileType);
    },
  }),
});


router.post('/', upload.single('image'), (req, res) => {
  
   
     let myFile = req.file.originalname.split('.');
     const fileType = myFile[myFile.length - 1];

     const params = {
       Bucket: process.env.AWS_BUCKET_NAME,
       Key: `${fileType}`,
       Body: req.file,
     };
 

  s3.upload(params, (error, data) => {
       
 console.log(process.env.AWS_SECRET_ACCESS_KEY);
// console.log(error);
//        if (error) {
//          res.status(500).send(error);
//        }

      res.status(200).send(req.file.location);
     });
})

export default router
