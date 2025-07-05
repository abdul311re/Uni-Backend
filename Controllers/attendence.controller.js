const { exec } = require("child_process");
const db = require("../config/db.config");
const { setAllOffline, setOnlineByMac } = require("../Models/attendence.model");

function getConnectedMACs() {
  return new Promise((resolve, reject) => {
    exec("arp -a", (err, stdout, stderr) => {
      if (err) return reject(err);
      if (stderr) return reject(new Error(stderr));

      // Improved MAC address regex
      const macRegex = /(?:[0-9a-fA-F]{2}[:-]){5}[0-9a-fA-F]{2}/g;
      let macs = stdout.match(macRegex) || [];
      
      // Standardize MAC address format (uppercase with colons)
      macs = macs.map(mac => {
        return mac.replace(/-/g, ":").toUpperCase();
      });
      
      resolve(macs);
    });
  });
}

async function updateOnlineStatus(req, res) {
  try {
    const connectedMacs = await getConnectedMACs();
    const connection = await db.getConnection();

    try {
      await setAllOffline(connection);
      
      // Update online status for detected MACs
      for (const mac of connectedMacs) {
        await setOnlineByMac(connection, mac);
      }

      // Get updated attendance data
      const [results] = await connection.execute(
        "SELECT id, name, macaddress, status, last_seen FROM employees"
      );

      connection.release();
      
      res.json({
        success: true,
        message: "Status updated",
        time: new Date(),
        employees: results,
        detectedMacs: connectedMacs
      });
    } catch (error) {
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: error.message
    });
  }
}

module.exports = {
  updateOnlineStatus,
  getConnectedMACs
};