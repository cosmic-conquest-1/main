const sequelize = require("../config/database");
const Client = require("../backend/models/Client");
const PowerSymbol = require("../backend/models/PowerSymbol");
const Card = require("../backend/models/Card");

(async () => {
    try {
        await sequelize.sync({ alter: true }); // Generates or updates tables
        console.log("✅ Database synced successfully!");
        process.exit();
    } catch (error) {
        console.error("❌ Error syncing database:", error);
        process.exit(1);
    }
})();
