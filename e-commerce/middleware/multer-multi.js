const multer = require("multer")

const addFileName = (req, rep , next) => {
    req.fileNames = [],
    next();
}

const storage = multer.diskStorage({
    destination : (req , file , cb) => {
        cb(null , "public/uploads")
    },
    filename : (req , file , cb) => {
        const nomFichier =  `${Date.now()}-${file.originalname}`
        req.fileNames.push(`/uploads/${nomFichier}`) 
        cb(null , nomFichier)
    }
});

const filter = (req , file , cb) => {
    if(file.mimetype === "image/jpeg" || file.mimetype === "image/png"){
        cb(null , true ) ; 
    }else {
        cb(null, false )
    }
}

const uploadMulti = multer({ storage , 
                        limits : 1024 *1024 * 5 , // taille max de l'image => 5 Mo,
                        fileFilter : filter
                    })
module.exports.addFileName = addFileName ;
module.exports.uploadMulti = uploadMulti ; 