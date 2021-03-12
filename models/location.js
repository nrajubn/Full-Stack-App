/**
 *  Location model
 *  Describes the characteristics of each attribute in a Location resource.
 *
 *
 * For more information about defining sequelize models, see
 * https://sequelize.org/v5/manual/data-types.html
 * https://sequelize.org/master/manual/validations-and-constraints.html
 *
 * For validators see: https://github.com/validatorjs/validator.js
 *
 */
// Export a function that defines the model.
// It automatically receives the Sequelize connection parameter.

module.exports = (db, DataTypes) => {
    db.define(
      'Location',
    {
      // sqlite creates a rowid attribute automatically
      name: {
        type: DataTypes.STRING(50),
      },
    },
    {
      // Other model options go here
    }
  );
};
