const multer = require("multer")

const storage = multer.diskStorage({
    destination : (req , file , cb) => {
        cb(null , "public/uploads")
    },
    filename : (req , file , cb) => {
        const nomFichier =  `${Date.now()}-${file.originalname}`
        req.fileName =  `/uploads/${nomFichier}`
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

const upload = multer({ storage , 
                        limits : 1024 *1024 * 5 , // taille max de l'image => 5 Mo,
                        fileFilter : filter
                    })
module.exports = upload ; 