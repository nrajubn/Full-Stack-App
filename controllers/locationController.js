
/**
 *  Location controller
 *  Handles requests related to this resource (see routes)
 *
 
 */
const { Sequelize} = require("sequelize");
// const { ValidationError } = require('sequelize');
const LOG = require("../util/logger");
const db = require("../models/index")();

const tabTitle = "Locations";

// FUNCTIONS TO RESPOND WITH JSON DATA  ----------------------------------------

// GET all JSON
module.exports.findAll = async (req, res) => {
  (await db).models.Location.findAll({
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
    // include: [
    //   {
    //     model: (await db).models.Location,
    //     attributes: ["locationId", "locationName"],
      
      include: ["coordinate"],
    
  })
    .then((data) => {
      // localStorage.setItem("locations",JSON.stringify(data));
      res.send(data);
    })
    .catch((err) => {
      LOG.error(`Error: ${JSON.stringify(err)}`);
      res.status(500).send({
        message: err.message || "Error retrieving all.",
      });
    });
};

// GET one JSON by ID
module.exports.findOne = async (req, res) => {
  const { locationId } = req.params;
  (await db).models.Location.findByPk(locationId)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      LOG.error(`Error: ${JSON.stringify(err)}`);
      res.status(500).send({
        message: `Error retrieving item with id=${locationId}: ${err.message}`,
      });
    });

};
// GET a random location and it's coordinates	
module.exports.getARandomLocation = async (req, res) => {	
  (await db).models.Location	
    .findAll({	
      attributes: {	
        exclude: ["createdAt", "updatedAt"],	
      },	
      include: [	
        {	
          model: (await db).models.coordinate,	
          as: "coordinate",	
        },	
      ],	
    })	
    .then((data) => {	
      res.send(data[Math.floor(Math.random() * (data.length - 0) + 0)]);	
    })	
    .catch((err) => {	
      LOG.error(`Error: ${JSON.stringify(err)}`);	
      res.status(500).send({	
        message: err.message || "Error retrieving all.",	
      });	
    });	
};	


// HANDLE EXECUTE DATA MODIFICATION REQUESTS -----------------------------------

// POST /save
module.exports.saveNew = async (req, res) => {
  try {
    const context = await db;
    await context.models.Location.create(req.body,{
      include: [	
        {	
          model: context.models.coordinate,	
          as: "coordinate",	
        },	
      ],	
    });
    
    return res.redirect("/location");
  } catch (err) {
    LOG.error(`Error: ${JSON.stringify(err)}`);
    return res.redirect("/location");
  }
};

// POST /save/:id
module.exports.saveEdit = async (req, res) => {
  try {
    const reqId = parseInt(req.params.locationId);
    const context = await db;
    const updated = await context.models.Location.update(req.body, {
     	
      where: { id: reqId },	
    });	
    req.body.coordinate.map(async (coord) => {	
      await context.models.coordinate.update(coord, {	
        where: { id: coord.id },	
      });	
    });
    LOG.info(`Updated: ${JSON.stringify(updated)}`);	
    return res.redirect("/location");	
  } catch (err) {	
    LOG.error(`Error: ${JSON.stringify(err)}`);	
    return res.redirect("/location");	
  }	
};	

// POST /delete/:id
module.exports.deleteItem = async (req, res) => {
  try {
    const reqId = parseInt(req.params.locationId);
    const deleted = (await db).models.Location.destroy({
      where: { id: reqId },
    });
    if (deleted) {
      return res.redirect("/location");
    }
    throw new Error(`${reqId} not found`);
  } catch (err) {
    LOG.error(`Error: ${JSON.stringify(err)}`);
    return res.status(500).send(err.message);
  }
};

// RESPOND WITH VIEWS  --------------------------------------------

// GET to this controller base URI (the default)
module.exports.showIndex = async (req, res) => {
  (await db).models.Location.findAll({
  attributes: {	
    exclude: ["createdAt", "updatedAt"],	
  },	
  include: [	
    {	
      model: (await db).models.coordinate,	
      attributes: ["latitude", "longitude"],	
      as: "coordinate",	
    },	
  ],	
})
    .then((data) => {
      res.locals.locations = data;
      res.render("location/index.ejs", { title: tabTitle, res });
    })
    .catch((err) => {
      LOG.error(`Error: ${JSON.stringify(err)}`);
      res.status(500).send({
        message: err.message || "Error retrieving all.",
      });
    });
};

// GET /create
module.exports.showCreate = async (req, res) => {
  // create a temporary item and add it to the response.locals object
  // this also provides a place to pass any validation errors to the view
  // Important! attributes must match those defined in the model
  const tempItem = {
    name: "LocationName",
  };
  res.locals.location = tempItem;
  res.render("location/create.ejs", { title: tabTitle, res });
};

// GET /delete/:id
module.exports.showDelete = async (req, res) => {
  const { locationId } = req.params;
  (await db).models.Location.findByPk(locationId,{
    attributes: {	
      exclude: ["createdAt", "updatedAt"],	
    },	
    include: [	
      {	
        model: (await db).models.coordinate,	
        attributes: ["latitude", "longitude"],	
        as: "coordinate",	
      },	
    ],	
  })
      .then((data) => {
      res.locals.location = data;
      if (data) {
        res.render("location/delete.ejs", { title: tabTitle, res });
      } else {
        res.redirect("/location/");
      }
    })
    .catch((err) => {
      LOG.error(`Error: ${JSON.stringify(err)}`);
      res.status(500).send({
        message: `Error retrieving item with locationId=${locationId}: ${err.message}`,      });
    });
};

// GET /details/:id
module.exports.showDetails = async (req, res) => {
  const { locationId } = req.params;
  (await db).models.Location.findByPk(locationId,{
    attributes: {	
      exclude: ["createdAt", "updatedAt"],	
    },	
    include: [	
      {	
        model: (await db).models.coordinate,	
        attributes: ["latitude", "longitude"],	
        as: "coordinate",	
      },	
    ],
  })
    .then((data) => {
      res.locals.location = data;
      res.render("location/details.ejs", { title: tabTitle, res });
    })
    .catch((err) => {
      LOG.error(`Error: ${JSON.stringify(err)}`);
      res.status(500).send({
        message: `Error retrieving item with id=${locationId}: ${err.message}`,
      });
    });
};

// GET /edit/:id
module.exports.showEdit = async (req, res) => {
  const { locationId } = req.params;
  (await db).models.Location.findByPk(locationId,{
    attributes: {	
      exclude: ["createdAt", "updatedAt"],	
    },	
    include: [	
      {	
        model: (await db).models.coordinate,	
        exclude: ["createdAt", "updatedAt"],	
        as: "coordinate",	
      },	
    ],
  })
    .then((data) => {
      res.locals.location = data;
      res.render("location/edit.ejs", { title: tabTitle, res });
    })
    .catch((err) => {
      LOG.error(`Error: ${JSON.stringify(err)}`);
      res.status(500).send({
        message: `Error retrieving item with id=${locationId}: ${err.message}`,
      });
    });
};