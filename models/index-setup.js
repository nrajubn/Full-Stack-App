/**
 * Sequelize database configurer.
 *
 * Returns a default function that applies higher-level
 * database configuration aspects, such as associations between
 * models.
 *
 * @link See: https://sequelize.org/master/manual/assocs.html
 *
 * @param {*} sequelize
 */

module.exports = async (sequelize) => {
  const {
    location,
    coordinate,
    // Clue,
  } = await sequelize.models;

  location.hasMany(coordinate, {
    foreignKey: { allowNull: false },
    onDelete: "CASCADE",
    as: "coordinate",
  });

  coordinate.belongsTo(location, {
    foreignKey: { allowNull: false },
    onDelete: "CASCADE",
    as: "location",
  });

  
};