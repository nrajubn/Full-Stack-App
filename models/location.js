module.exports = (db, DataTypes) => {
  db.define("Location", {
    locationId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement:true,
    },
    locationName: {
      type: DataTypes.STRING(50),
      unique: true,
      required: true,
      allowNull: false,
      validate: {
        is: {
          // use a Regular Expression (regex)
          // ^starts & ends$ with a letter
          // no consecutive spaces
          // TODO: Find more efficient approach
          args: /^([a-zA-Z]+\s)*[a-zA-Z]+$/i  ,
          msg:
            'Name is only letters and single spaces, no numbers or punctuation.',
        },
        max: {
          args: [50],
          msg: 'Name is limited to 50 characters.',
        },
        min: {
          args: [3],
          msg: 'Name must be at least 3 characters.',
        },
      },
    },

    locationLatitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false,
      validate: {
        min: {
          args: -90,
          msg: 'Latitude must be -90 degrees or more.',
        },
        max: {
          args: 90,
          msg: 'Latitude must be 90 degrees or less.'
        },
      },
    },

    locationLongitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false,
      validate: {
        min: {
          args: -180,
          msg: 'Latitude must be -180 degrees or more.',
        },
        max: {
          args: 180,
          msg: 'Latitude must be 180 degrees or less.',
        },
      },
    },
   
  });
};
