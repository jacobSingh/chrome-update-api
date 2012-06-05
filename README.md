Chrome-Extension-Updater
========================

Simple API for Chrome extension authors to run callback functions when your extension is updated.

## Usage

1. Include update.chrome.js in your background.html
2. Add an "updates" array in the *global* scope in background.js of update functions. 

### Example:
```javascript
updates[1.1] = function() {
  // Code which should run when upgrading to version 1.1 should be here.
}

updates[1.2] = function() {
  // Code which should run when upgrading to version 1.2 should be here.
}

```

### Longer Example:

```javascript
// Let's assume at version 1.0 the extension had a setting called
// "userId" and a setting called "password".
// localStorage['userId'] = 123;
// localstorage['password'] = "secret";

// Now version 1.1 comes out and you decide to combine them into one
// variable
// localStorage['creds'] = {userId: 123, password: secret};

// updates is a global Array.
updates[1.1] = function() {
  localStorage['creds'] = JSON.stringify({userId: localStorage['userId'],
password: localStorage['password']});

  localStorage.removeItem('userId');
  localStorage.removeItem('password');
}

// Then if you release 1.2 and start storing the username instead of the
// password (for whatever reason), you would add the following:

updates[1.2] = function() {
  var creds = JSON.parse(localStorage['creds']);;
  var username = someMethodToGetUserName(creds.userId, creds.password);
  delete creds.userId
  creds.username = username;
  localStorage['creds'] = JSON.stringify(creds);
}

```
