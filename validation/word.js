const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateWordInput(data){

    let errors = {};

    // Convert empty fields to an empty string so we can use validator functions
    data.title = !isEmpty(data.title) ? data.title : "";
    data.description = !isEmpty(data.description) ? data.description : "";
    data.color = !isEmpty(data.color) ? data.color : "";

    //Title checks
    if(Validator.isEmpty(data.title)) {
        errors.title = "Title field is required";
    }

    //Description checks
    if(Validator.isEmpty(data.description)){
        errors.description = "Description field is required";
    }

    //Color checks
    if(Validator.isEmpty(data.color)){
        errors.color = "Color field is required";
    }

    return{
        errors,
        isValid:isEmpty(errors)
    };

};