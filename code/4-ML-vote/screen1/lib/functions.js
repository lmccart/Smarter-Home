var database;

function initDatabase() {
  firebase.initializeApp(config);

  firebase.database().ref('positive/').on('value', function(snapshot) {
    p = snapshot.val();
  });
  firebase.database().ref('negative/').on('value', function(snapshot) {
    n = snapshot.val();
  });
}
