const post = require('../models/model.post');


const util = require("util");
const multer = require("multer");
const maxSize = 4 * 1024 * 1024;


exports.addPost = async (req, res) => {

    let storage = multer.diskStorage({
        destination: (req, file, cb) => {
          // @ts-ignore
          if(file.fieldname==="file")
            {
                cb(null, __basedir + "/public/upload/files");

            }else if (file.fieldname==="image"){
                cb(null, __basedir + "/public/upload/image");

            }
        },
        filename: (req, file, cb) => {
          file.originalname = Date.now() +'-'+ file.originalname 
          cb(null, file.originalname);
        },
      });
      
    
      let uploadFile = multer({
        storage: storage,
        limits: {
          fileSize: maxSize
        },
      }).fields([{
        name: 'file', maxCount: 1
      }, {
        name: 'image', maxCount: 4
      }])
    
      
      let uploadFileMiddleware = util.promisify(uploadFile);

    try {
        await uploadFileMiddleware(req, res);
        console.log(req.body.title)

            if (req.files == undefined) {
                return res.status(400).send({ message: "Please upload a file!" });
                                 }
      let imageArr = [];
      for (let i = 0; i < req.files.image.length; i++) {
          imageArr.push(req.files.image[i].originalname)
      }
               let postPush = new post({
                        title: req.body.title,
                        description: req.body.description,
                        don: req.body.don,
                        donstatus: req.body.donstatus,
                        image: imageArr,
                        idCategorie: req.body.idCategorie,
                        file: req.files.file[0].originalname
                    })
                    postPush.save()
                            .then(() => res.json({notification : "Post Added !" }))
                            .catch((err) => res.json(err))

        

            
        } catch (err) {
        if (err.code == "LIMIT_FILE_SIZE") {
            return res.status(500).send({
              message: "File size cannot be larger than 2MB!",
            });
          }
      
          res.status(500).send({
            message: `Could not upload the file`,
          });
          
    }

    
    
}

exports.getPosts = async (req, res) => {
    await post.find().then((posts) => {
        res.status(200).json(posts)
    }).catch((err) => {
        res.status(500).json(err)
    })
}


exports.deletePost = async (req, res) => {
    await post.remove({_id:req.params.idPost}).then(()=>{
        res.status(200).json("Post Deleted");
    }).catch((err) => res.status(500).json(err));
}

exports.updatePost = async (req, res) => {
    await post.updateOne({
        _id:req.params.idPost}, {$set :{
            title: req.body.title,
            description: req.body.description,
            don: req.body.don,
            idCategorie: req.body.idCategorie,
            
        }
    }).then(() => {
        res.status(200).json("Post updated");
    }).catch((err) => res.status(500).json(err))
}

exports.getPost = async (req, res) => {
    await post.findOne({_id:req.params.idPost}).then((post)=>{
        res.status(200).json(post);
    }).catch((err) => res.status(500).json(err));
}

exports.verifyPost = (req, res, next) => {
    post.findOne({
      id: req.body.idPost,
    })
      .then((post) => {
        if (!post) {
          return res.status(404).send({ message: "post Not found." });
        }
  
        post.status = "Active";
        post.save()
             .then(() => res.json({notification : "Post Confirmed !" }))
            .catch((err) => res.json(err))
      })
      .catch((e) => console.log("error", e));
}