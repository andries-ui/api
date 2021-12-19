
const Joi = require('@hapi/joi');

const userValidation = (data) => {

  const schema= Joi.object({
    username: Joi.string().required().regex(/^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/),
      password: Joi.string().required().regex(/^(?=(?:.*[a-z]){1})(?=(?:.*[A-Z]){1})(?=(?:.*\d){1})(?=(?:.*[!@#$%^&*-]){1}).{8,}$/),
      names: Joi.string().min(3).regex(/^(?![\s.]+$)[a-zA-Z\s.]*$/, 'invalid names provided'),
     contact: Joi.string().required().length(10).regex(/^(\+?27|0)[6-8][0-9]{8}$/),
      email: Joi.string().required().min(6).regex(/^[a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1}([a-zA-Z0-9][\-_\.\+\!\#\$\%\&\'\*\/\=\?\^\`\{\|]{0,1})*[a-zA-Z0-9]@[a-zA-Z0-9][-\.]{0,1}([a-zA-Z][-\.]{0,1})*[a-zA-Z0-9]\.[a-zA-Z0-9]{1,}([\.\-]{0,1}[a-zA-Z]){0,}[a-zA-Z0-9]{0,}$/),
      type: Joi.string().required(/^[a-zA-Z\s.]*$/),

   });

  
  const validation = schema.validate(data);

  return validation;

};

const userLogin = (data) => {

  const schema = Joi.object({
    username: Joi.string().min(5).regex(new RegExp(/^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/)).required(),
    password:Joi.string().required(),
    email: Joi.string().max(5).email().required(),
    });

    const validation = schema.validate(data);

    return validation;

};

module.exports.userValidation = userValidation;
module.exports.userLogin = userLogin;






// const schema={
  //   userId: Joi.string(),
  //   name: Joi.string().min(3).regex(/^(?![\s.]+$)[a-zA-Z\s.]*$/, 'invalid names provided'),
  //   url: Joi.string(),
  //   address: Joi.string().regex(/[A-Za-z0-9'\.\-\s\,]/,'invalid address provided'),
  //   city: Joi.string().regex(/^(?![\s.]+$)[a-zA-Z\s.]*$/, 'invalid city provided'),
  //   country: Joi.string().regex(/^(?![\s.]+$)[a-zA-Z\s.]*$/, 'invalid country provided'),
  //   latitude: Joi.string().regex(/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/, 'unknown value'),
  //   longitude: Joi.string().regex(/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/, 'unknown value'),
  //   createdAt: Joi.string().regex(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)(?:0?2|(?:Feb))\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/, 'invalid date'),
  //   updatedAt: Joi.string().regex(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)(?:0?2|(?:Feb))\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/, 'invalid date'),
  //   deletedAt: Joi.string().regex(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)(?:0?2|(?:Feb))\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/, 'invalid date'),
  // };