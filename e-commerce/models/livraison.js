const Joi = require("joi")

const livraisonValidation = Joi.object({
    rue : Joi.string().min(5).required(),
    cp : Joi.string().length(5).pattern(/^[0-9]+$/).required(),
    ville : Joi.string().min(3).required()
})

module.exports = livraisonValidation ; 