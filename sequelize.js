module.exports = sequelize;
var Sequelize = require('sequelize');
var sequelize = new Sequelize('postgres://neilpelow:neilpelow@localhost/pgsequelize');

var express = require('express')
var app = express()

var Massive=require("massive");
var db = Massive.connectSync({db : 'pgsequelize'});

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(8080, function () {
  console.log('Example app listening on port 8080!')
})

var Judge = sequelize.define('judge', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        field: 'id' 
    },
    name: {
        type: Sequelize.STRING,
        field: 'name'
    },
    room: {
        type: Sequelize.INTEGER,
        field: 'room'
    },
    ext: {
        type: Sequelize.STRING,
        field: 'ext'
    }
});

var Courtroom = sequelize.define('courtroom', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        field: 'id'
    },
    number: {
        type: Sequelize.STRING,
        field: 'number'
    }
});

var Participant = sequelize.define('participant', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        field: 'id' 
    },
    name: {
        type: Sequelize.STRING,
        field: 'name'
    },
    address: {
        type: Sequelize.STRING,
        field: 'address'
    },
    type: {
        type: Sequelize.STRING,
        field: 'type',
        values: ['claimant', 'respondent']
    }
});

var Case= sequelize.define('case', {
    judge_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        field: 'judgeId'
    },
    courtroom_id: {
        type: Sequelize.INTEGER,
        field: 'courtroomId'
    },
    claimant_id: {
        type: Sequelize.INTEGER,
        field: 'claimantId'
    },
    respondent_id: {
        type: Sequelize.INTEGER,
        field: 'respondentId'
    },
    start_date: {
        type: Sequelize.DATE,
        field: 'startDate'
    },
    duration: {
        type: Sequelize.INTEGER,
        field: 'duration'
    },
    result: {
        type: Sequelize.BOOLEAN,
        allowNull: true, 
        defaultValue: null,
        field: 'result'
    }
});

//------------------------------------ CREATE STATEMENTS ------------------------------------//
Judge.sync({force: true}).then(function () {
  // Table created
  return Judge.create({
    id: 1234,
    name: 'Hancock',
    room: 1,
    ext: 'ext1'
  });
});

Courtroom.sync({force: true}).then(function () {
  // Table created
  return Courtroom.create({
    id: 123,
    number: 'Courtroom1'
  });
});

Participant.sync({force: true}).then(function () {
  // Table created
  return Participant.create({
    id: 12345,
    name: 'Clarke',
    address: 1,
    type: 'claimant'
  });
});

Participant.sync({force: true}).then(function () {
  // Table created
  return Participant.create({
    id: 12346,
    name: 'John',
    address: 2,
    type: 'respondent'
  });
});

Case.sync({force:true}).then(function () {
    return Case.create({
    judge_id: 1234,
    courtroom_id: 123,
    claimant_id: 12345,
    respondent_id: 12346,
    start_date: 211017,
    duration: 100,
    result: null
    });
});

//------------------------------------ READ STATEMENTS ------------------------------------//
app.get('/judges/:id', function(req, res) {
    db.judges.find({ id: req.params.id }, function(err,result){
        res.send(result);
    })
});

app.get('/courtrooms/:id', function(req, res) {
    db.courtrooms.find({ id: req.params.id }, function(err,result){
        res.send(result);
    })
});

app.get('/cases/:judge_id', function(req, res) {
    db.cases.find({ judge_id: req.params.judge_id }, function(err,result){
        res.send(result);
    })
});

app.get('/participants/:id', function(req, res) {
    db.participants.find({ id: req.params.id }, function(err,result){
        res.send(result);
    })
});