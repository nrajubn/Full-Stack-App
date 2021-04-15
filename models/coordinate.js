module.exports = (db, DataTypes) => {
    db.define("coordinate", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      locationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "locations",
          key: "id",
        },
      },
      latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false,
        validate: {
          min: {
            args: -90,
            msg: "Latitude must be -90 degrees or more.",
          },
          max: {
            args: 90,
            msg: "Latitude must be 90 degrees or less",
          },
        },
      },
      longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false,
        validate: {
          min: {
            args: -180,
            msg: "Latitude must be -180 degrees or more",
          },
          max: {
            args: 180,
            msg: "Latitude must be 180 degrees or less.",
          },
        },
      },
    });
  };