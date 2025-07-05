async function setAllOffline(db) {
    await db.execute("UPDATE employees SET status = 'offline'");
  }
  
  async function setOnlineByMac(db, mac) {
    await db.execute("UPDATE employees SET status = 'online' WHERE macaddress = ?", [mac]);
  }
  
  module.exports = {
    setAllOffline,
    setOnlineByMac,
  };
  