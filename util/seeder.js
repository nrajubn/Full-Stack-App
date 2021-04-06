/**
 * Seed the database with sample data.
 *
 * During development, drop & recreate the database on startup.
 *
 * Only as we move into production (and the app is stable) will we
 * begin to store real data.
 *
 * *
 */

// NEW! Best practices recommend:
// put ALL imports FIRST rather than 'hiding' them in code below
// use a LOGGER that writes to files / turns off console logging in production

const LOG = require("./logger");

module.exports = async (db) => {
  LOG.info("Starting seeder.......................");

  try {
    const syncResult = await db.sync({ force: true });
    LOG.info(`Recreated all tables: ${syncResult}`);
  } catch (err) {
    LOG.error(`ERROR: on sync process - ${err.message}`);
  }

  try {
    await db.models.location.bulkCreate(
      [
        {
          id: 1,
          locationName: "Colden Pond",
        },
        {
          id: 2,
          locationName: "Villago",
        },
      ],
      { validate: true } // add options object to call new model validators
    );

    const locationsCount = await db.models.location.count();

    LOG.info(`Seeded ${locationsCount} locations .`);
  } catch (err) {
    LOG.error(`ERROR: Location seeding - ${err}`);
  }

  try {
    await db.models.coordinate.bulkCreate(
      [
        {
          id: 1,
          locationId: 1,
          latitude: 40.3530752049,
          longitude: -94.8865039605,
        },
        {
          id: 2,
          locationId: 1,
          latitude: 40.3530752049,
          longitude: -94.8861437058,
        },
        {
          id: 3,
          locationId: 1,
          latitude: 40.3524272449,
          longitude: -94.8861437058,
        },
        {
          id: 4,
          locationId: 1,
          latitude: 40.3524272449,
          longitude: -94.8865039605,
        },
        {
          id: 5,
          locationId: 2,
          latitude: 40.36085711,
          longitude: -94.88815211,
        },
        {
          id: 6,
          locationId: 2,
          latitude: 40.36084911,
          longitude: -94.88748911,
        },
        {
          id: 7,
          locationId: 2,
          latitude: 40.36049511,
          longitude: -94.88751111,
        },
        {
          id: 8,
          locationId: 2,
          latitude: 40.36052111,
          longitude: -94.88821111,
        },
      ],
      { validate: true } // add options object to call new model validators
    );

    const coordinatesCount = await db.models.coordinate.count();

    LOG.info(`Seeded ${coordinatesCount} coordinates .`);
  } catch (err) {
    LOG.error(`ERROR: Coordinates seeding - ${err}`);
  }

  LOG.info("Done with seeder................");

  return db;
};