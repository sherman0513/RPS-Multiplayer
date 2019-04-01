// first create my firebase and establish connection to the database
var config = {
    apiKey: "AIzaSyAH2vDq7WCnkZAn7xc7b2y-qYhOF288t5Y",
    authDomain: "click-counter-a1b9f.firebaseapp.com",
    databaseURL: "https://click-counter-a1b9f.firebaseio.com",
    projectId: "click-counter-a1b9f",
    storageBucket: "click-counter-a1b9f.appspot.com",
    messagingSenderId: "85686736612"
};

firebase.initializeApp(config);

var database = firebase.database();

// this is the function for the submit button that recognizes the value that are entered into the input fields and the data is then sent to the firebase DB
$("#submit").on("click", function (event) {

    event.preventDefault();

    var trName = $("#train-name").val().trim();
    var dest = $("#destination").val().trim();
    var frName = $("#first-train").val().trim();
    var freq = $("#frequency").val().trim();

    var newTrain = {
        trainName: trName,
        destination: dest,
        firstTrain: frName,
        frequency: freq,
    };

    database.ref().push(newTrain);

});

// now to create function that takes values stored in firebase and append to page
database.ref().on("child_added", function (childSnapshot) {
    var trName = childSnapshot.val().trainName;
    var dest = childSnapshot.val().destination;
    var frTrain = childSnapshot.val().firstTrain;
    var freq = childSnapshot.val().frequency;

    // // formula that calculates next arrival
    var startTrSch = moment(frTrain, "hh:mm").subtract(1, "years");
    var timeDiff = moment().diff(moment(startTrSch), "minutes");
    var minutesRemain = timeDiff % freq;
    var minutesAway = freq - minutesRemain;

    var nextArrival = moment().add(minutesAway, "minutes");
    var nextTrain = moment(nextArrival).format("HH:mm");

    // creates new row everytime the submit button is clicked
    // takes values above and appends them in the correct category of the table
    var addRow = $("<tr>").append(
        $("<td>").text(trName),
        $("<td>").text(dest),
        $("<td>").text(freq),
        $("<td>").text(nextTrain),
        $("<td>").text(minutesAway),
    );

    $(("#table-body")).append(addRow);

});