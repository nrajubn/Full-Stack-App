/**
 * Route location requests to the correct controller function.
 *
 * A request includes:
 *  an HTTP verb (e.g., get or post) AND
 *  a URL endpoint (e.g., /create)
 *
 * Match each expeced verb + URL request
 * with a custom function to handle it
 *
 */

const router = require("express").Router();
const controller = require("../controllers/locationController.js");
const LOG = require("../util/logger");

LOG.info("Starting location routing.");

// -----------------------------------------------------------------------------
// match each expeced HTTP verb + URL endpoint request
// with a custom function to handle it
// -----------------------------------------------------------------------------

// handle two requests for JSON (HTTP GET)

router.get("/findall", controller.findAll);
router.get("/findone/:locationId", controller.findOne);
router.get("/get-a-random-location", controller.getARandomLocation);

// handle three requests to perform database actions (HTTP POST)

router.post("/save", controller.saveNew);
router.post("/save/:locationId", controller.saveEdit);
router.post("/delete/:locationId", controller.deleteItem);

// handle five requests for webpages (HTTP GET)

router.get("/", controller.showIndex);
router.get("/create", controller.showCreate);
router.get("/details/:locationId", controller.showDetails);
router.get("/edit/:locationId", controller.showEdit);

router.get("/delete/:locationId", controller.showDelete);
router.get("/location", controller.showIndex);

function checkUserAuth(req, res, next) {
    if (req.session.user) return next();
    return next(new NotAuthorizedError());
  }

LOG.info("Loaded locations routes.");

module.exports = router;