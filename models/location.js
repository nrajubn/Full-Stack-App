module.exports = (db, DataTypes) => {
  db.define("location", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    locationName: {
      type: DataTypes.STRING(50),
      unique: true,
      required: true,
      allowNull: false,
      validate: {
        is: {
          args: /^([a-zA-Z]+\s)*[a-zA-Z]+$/i,
          msg:
            "Name is only letters and single spaces, no numbers or punctuation.",
        },
        max: {
          args: [50],
          msg: "Name is limited to 50 characters.",
        },
        min: {
          args: [3],
          msg: "Name must be at least 3 characters.",
        },
      },
    },
  });
};