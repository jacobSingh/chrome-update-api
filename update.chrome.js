var updateManager = {
  extensions: {},
  updates: {}
};

updateManager.init = function(updates) {
  this.updates = updates;
  self = this;
  var getAllCallback = function(exts) {
    for(i=0; i < exts.length; i++) {
      var ext = exts[i];
      self.extensions[ext.id] = ext; // store a reference to the app
    }
    chrome.management.getAll(getAllCallback);
    chrome.management.onInstalled(function(extensionInfo) {self.onInstalled(extensionInfo)});
  }
}

updateManager.onInstalled = function(extensionInfo) {
  if (extensionInfo.id == chrome.app.getDetails().id) {
    if (extensionInfo.version > this.extensions[extensionInfo.id].version) {
      this.runUpdates(this.extensions[extensionInfo.id].version);
    }
  }
};

/**
 * Runs any updates with a later version than the current version.
 * 
 * Note that this has to read from a global variable (updates) which is in the form
 * updates[version] = function()...
 */
updateManager.runUpdates = function(startVersion) {
  var updatesToRun = new Array();
  
  for (var i in this.updates) {
    if (this.updates.hasOwnProperty(i)) {
      if (parseFloat(i) > startVersion) {
        updatesToRun.push(this.updates[i]);
      }
    }
  }
  
  updatesToRun = updatesToRun.sort(function(a, b) {
    return a.version > b.version;
  });
  
  for (i =0; i < updatesToRun.length; i++) {
    updatesToRun[i]();
  }
}