'use strict';

const DataTypes = require('sequelize');
const sequelize = require('../config/connection');


  var goproteksi = sequelize.define('goproteksi', {
    name: {
      type: DataTypes.STRING,
      validate: {
            notEmpty: true,
            validateName: function(value) {
               if(!(/^[a-zA-Z*]+[\.\'\* ,a-zA-Z-]*[a-zA-Z.]$/.test(value))) {
                  throw new Error('Name format error!')
               }
            }
      }
    },
    gender: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
        isUnique: function(value, next) {
          goproteksi.find({
              where: {email: value}
          }).done(function(exist) {
              if (exist != null)
                return next('Email address already in use!');
              else
                next();
          });
        },
        validateEmail: function(value) {
           if(!(/^[-a-z0-9~!$%^&*_=+}{'?]+(\.[-a-z0-9~!$%^&*_=+}{'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/.test(value))) {
              throw new Error('Email format error!')
           }
        },
      }
    },
    mobileNumber: {
      type: DataTypes.STRING,
      validate: {
            notEmpty: true,
            validateMobileNumber: function(value) {
               if(!(/^\+?620?8[0-9]{8,11}$|^08[0-9]{8,11}$|^0[0-9]{2}9[0-9]{8,11}$/.test(value))) {
                  throw new Error('Mobile number format error!')
               }
            },
            isUnique: function(value, next) {
              goproteksi.find({
                  where: {mobileNumber: value}
              }).done(function(exist) {
                  if (exist != null)
                    return next('Mobile number already in use!');
                  else
                    next();
              });
            }
      }
    },
    vehiclePlate: {
      type: DataTypes.STRING,
      validate: {
            notEmpty: true,
            validateVehiclePlate: function(value) {
               if(!(/[A-Z]{1,2}[ ]*[0-9]{1,4}[ ]*[A-Z]{1,3}$/.test(value))) {
                  throw new Error('Vehicle Plate Number format error!')
               }
            },
            isUnique: function(value, next) {
              goproteksi.find({
                  where: {vehiclePlate: value}
              }).done(function(exist) {
                  if (exist != null)
                    return next('Vehicle Plate Number already in use!');
                  else
                    next();
              });
            }
      }
    },
    gojekID: {
      type: DataTypes.STRING,
      validate: {
            notEmpty: true,
            isUnique: function(value, next) {
              goproteksi.find({
                  where: {gojekID: value}
              }).done(function(exist) {
                  if (exist != null)
                    return next('gojekID already in use!');
                  else
                    next();
              });
            }
      }
    },
    newGojekID: {
      type: DataTypes.STRING
    },
    simNumber: {
      type: DataTypes.STRING,
      validate: {
            notEmpty: true,
            validateSimNumber: function(value) {
               if(!(/^[0-9]{11,15}$/.test(value))) {
                  throw new Error('Personal ID number format error!')
               }
            },
            isUnique: function(value, next) {
              goproteksi.find({
                  where: {simNumber: value}
              }).done(function(exist) {
                  if (exist != null)
                    return next('Personal ID number already in use!');
                  else
                    next();
              });
            }
      }
    },
    simExpiryDate: {
      type: DataTypes.STRING,
      validate: {
            validateSimExpire: function(value, next) {
               if(!(/^20[0-9]{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(value))) {
                  return next('Personal ID expire format error!');
               }else {
                  next();
               }
            },
      }
    },
    ipAddress: DataTypes.STRING,
    timeStamp: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN,
    policyStartDate: {
      type: DataTypes.STRING,
      validate: {
            validatePolicyStartDate: function(value, next) {
              if (value !== '') {
                if(!(/^20[0-9]{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(value))) {
                   return next('Policy start date format error!');
                }else {
                   next();
                }
              }else {
                next();
              }

            },
      }
    },
    policyEndDate: {
      type: DataTypes.STRING,
      validate: {
            validatePolicyEndDate: function(value, next) {
              if (value !== '') {
                if(!(/^20[0-9]{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(value))) {
                   return next('Policy end date format error!');
                }else {
                   next();
                }
              }else {
                next();
              }

            },
      }
    },
    isTest: DataTypes.BOOLEAN,
    vehicleYear: {
      type: DataTypes.INTEGER,
      validate: {
            notEmpty: true,
            validateSimExpire: function(value, next) {
               if(value < (new Date().getFullYear()-15) || value > new Date().getFullYear()) {
                 throw new Error('Minimal vehicle year ' + (new Date().getFullYear()-15))
               }else {
                 next();
               }
            },
      }
    },
    referrer: {
      type: DataTypes.STRING,
      validate: {
            validateReferrer: function(value, next) {
              if (value !== '') {
                if(!(/^[a-zA-Z ]{0,20}$/.test(value))) {
                   throw new Error('Referrer format error!')
                }else {
                  next();
                }
              }else {
                next();
              }

            },
      }
    },
    policyNumber: {
      type: DataTypes.STRING,
      validate: {
            notEmpty: true,
            validateSimNumber: function(value, next) {
               if(value.length < 10 || value.length > 20) {
                  return next('Policy number length error!');
               }else {
                 next();
               }
            },
            isUnique: function(value, next) {
              goproteksi.find({
                  where: {policyNumber: value}
              }).done(function(exist) {
                  if (exist != null)
                    return next('Policy number already in use!');
                  else
                    next();
              });
            }
      }
    },
    origin: {
      type: DataTypes.STRING,
      validate: {
            notEmpty: true,
      }
    },
    specialist: DataTypes.STRING,
    events: DataTypes.TEXT,
  }, {
    freezeTableName: true,
    tableName: 'goproteksi',
    timestamps: false,
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  module.exports = goproteksi
