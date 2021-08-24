const event = require('../models/model.event');


const util = require("util");
const multer = require("multer");
const maxSize = 4 * 1024 * 1024;


exports.addEvent = async (req, res) => {

    let storage = multer.diskStorage({
        destination: (req, file, cb) => {
          // @ts-ignore
         
          cb(null, __basedir + "/public/upload/image");

            
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
               let eventPush = new event({
                        title: req.body.title,
                        description: req.body.description,
                        don: req.body.don,
                        donstatus: req.body.donstatus,
                        image: imageArr
                    })
                    eventPush.save()
                            .then(() => res.json({notification : "Event Added !" }))
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

exports.getEvents = async (req, res) => {
    await event.find().then((events) => {
        res.status(200).json(events)
    }).catch((err) => {
        res.status(500).json(err)
    })
}


exports.deleteEvent = async (req, res) => {
    await event.remove({_id:req.params.idEvent}).then(()=>{
        res.status(200).json("Event Deleted");
    }).catch((err) => res.status(500).json(err));
}

exports.updateEvent = async (req, res) => {
    await event.updateOne({
        _id:req.params.idEvent}, {$set :{
            title: req.body.title,
            description: req.body.description,
            don: req.body.don,
            
        }
    }).then(() => {
        res.status(200).json("Event updated");
    }).catch((err) => res.status(500).json(err))
}

exports.getEvent = async (req, res) => {
    await event.findOne({_id:req.params.idEvent}).then((event)=>{
        res.status(200).json(event);
    }).catch((err) => res.status(500).json(err));
}
