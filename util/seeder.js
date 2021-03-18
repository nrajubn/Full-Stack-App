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
    await db.models.Location.bulkCreate(
      [
        // first quest locations........
        {
          locationId: 11,
          locationName: "Horizons west",
          locationLatitude: 40.35156,
          locationLongitude: -94.88267
        },
        {
          locationId: 12,
          locationName: "Colden Pond",
          locationLatitude: 40.35112,
          locationLongitude: -94.8822,
        },
        {
          locationId: 13,
          locationName: "Bearcat Soccer field",
          locationLatitude: 40.35139,
          locationLongitude: -94.88289,
        },
        {
          locationId: 14,
          locationName: "Student Union",
          locationLatitude: 40.35156,
          locationLongitude: -94.88254,
        },
      ],
      { validate: true } // add options object to call new model validators
    );
    const num = await db.models.Location.count();
    LOG.info(`Seeded ${num} locations.`);
  } catch (err) {
    LOG.error(`ERROR: Location seeding - ${err.message}`);
  }

  LOG.info("Done with seeder................");

  return db;
};