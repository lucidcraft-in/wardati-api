import path from 'path'
import express from 'express'
import multer from 'multer';
// import aws from 'aws-sdk';
// import multerS3 from 'multer-s3';
 

const router = express.Router()

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
// aws.config.update({
//   secretAccessKey: 'N6Yl4F2U9863usfdEhAAb5jj0Tqtm2NkVMTs7YNR',
//   accessKeyId: 'AKIA5YVZ4K5IW64OHX7B',
//   region: 'ap-south-1',
// });

// const s3 = new aws.S3();


const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Invalid Mime Type, only JPEG and PNG'), false);
  }
};

// const upload = multer({
//   fileFilter,
//   storage: multerS3({
//     s3,
//     bucket: 'genovacollections',
//     acl: 'public-read',
//     metadata: function (req, file, cb) {
//       cb(null, { fieldName: 'TESTING_META_DATA!' });
//     },
//     key: function (req, file, cb) {
       
//       let myFile = file.mimetype.split('/');
//       const fileType = myFile[myFile.length - 1];
//       cb(null, Date.now().toString() +'.'+ fileType);
//     },
//   }),
// });


// router.post('/', upload.single('image'), (req, res) => {
//   // console.log(`uploads/${req.file.filename}`);
   
//      let myFile = req.file.originalname.split('.');
//      const fileType = myFile[myFile.length - 1];

//      const params = {
//        Bucket: 'genovacollections',
//        Key: `${fileType}`,
//        Body: req.file,
//   };
 

//   s3.upload(params, (error, data) => {
       
 

//       //  if (error) {
//       //    res.status(500).send(error);
//       //  }

//        res.status(200).send(req.file.location);
//      });
// })

export default router
