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
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        field: 'id'
    },
    judge_id: {
        type: Sequelize.INTEGER,
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

//------------------------------------ INITIAL CREATE STATEMENTS ------------------------------------//
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
  Participant.create({
    id: 12345,
    name: 'Clarke',
    address: 1,
    type: 'claimant'
  });
  Participant.create({
    id: 12346,
    name: 'John',
    address: 2,
    type: 'respondent'
  });
  Participant.create({
    id: 12347,
    name: 'Neil',
    address: 123,
    type: 'claimant'
  });
});

Case.sync({force: true}).then(function () {
    return Case.create({
    id: 123,
    judge_id: 1234,
    courtroom_id: 123,
    claimant_id: 12345,
    respondent_id: 12346,
    start_date: 211017,
    duration: 100,
    result: null
    });
});

Judge.hasMany(Case, { foreignKey: 'judge_id', primaryKey: true});
Participant.hasMany(Case, { foreignKey: 'claimant_id', primaryKey: true });
Participant.hasMany(Case, { foreignKey: 'responsendent_id', primaryKey: true});
Courtroom.hasMany(Case, {foreignKey: 'courtroom_id', primaryKey: true});

//------------------------------------ CREATE STATEMENTS ------------------------------------//
app.get('/case/create', function(req, res) {
 Case.create({
    id: req.body.id,
    judge_id: req.body.judge_id,
    courtroom_id: req.body.courtroom_id,
    respondent_id: req.body.respondent_id,
    claimant_id: req.body.claimant_id,
    start_date: req.body.start_date,
    duration: req.body.duration,
    result: req.body.result
  }).then(function(result) {
    res.json(result);
  });
});

app.get('/courtroom/create', function(req, res) {
 Courtroom.create({
    id: req.body.id,
    number: req.body.number
  }).then(function(courtroom) {
    res.json(courtroom);
  });
});

app.get('/judge/create', function(req, res) {
  Judge.create({
    id: req.body.id,
    name: req.body.name,
    room: req.body.room,
    ext: req.body.string
  }).then(function(user) {
    res.json(user);
  });
});

app.get('/participant/create/:id/name/:name/address/:address/type/:type', function(req, res) {
 Participant.create({
    id: req.body.id,
    name: req.body.name,
    address: req.body.address,
    type: req.body.type
  }).then(function(participant) {
    res.json(participant);
  });
});

//------------------------------------ READ STATEMENTS ------------------------------------//
app.get('/judge/:id', function(req, res) {
    db.judges.find({ id: req.params.id }, function(err,result){
        res.send(result);
    })
});

app.get('/courtroom/:id', function(req, res) {
    db.courtrooms.find({ id: req.params.id }, function(err,result){
        res.send(result);
    })
});

app.get('/participant/:id', function(req, res) {
    db.participants.find({ id: req.params.id }, function(err,result){
        res.send(result);
    })
});

app.get('/case/:id', function(req, res) {
    db.cases.find({ id: req.params.id }, function(err,result){
        res.send(result);
    })
});

//------------------------------------ UPDATE STATEMENTS ------------------------------------//
app.get('/judge/update/:id/name/:name/room/:room/ext/:ext', function(req, res) {
  Judge.update({
    name: req.params.name,
    room: req.params.room,
    ext: req.params.string
  }, {
      where: {
          id: req.params.id
      }
  }).then(function(user) {
    res.json(user);
  });
});

app.get('/courtroom/update/:id/number/:number', function(req, res) {
 Courtroom.update({
    number: req.params.number
  }, {
      where: {
          id: req.params.id
      } 
  }).then(function(courtroom) {
    res.json(courtroom);
  });
});

app.get('/participant/update/:id/name/:name/address/:address/type/:type', function(req, res) {
 Participant.update({
    name: req.params.name,
    address: req.params.address,
    type: req.params.type
  }, {
      where: {
          id: req.params.id
      } 
  }).then(function(participant) {
    res.json(participant);
  });
});

app.get('/case/update/:id/judge_id/:judge_id/courtroom_id/:courtroom_id/respondent_id/:respondent_id/claimant_id/:claimant_id/start_date/:start_date/duration/:duration/result/:result', function(req, res) {
 Case.update({
    number: req.params.number
  }, {
      where: {
          id: req.params.id
      } 
  }).then(function(result) {
    res.json(result);
  });
});

//------------------------------------ DELETE STATEMENTS ------------------------------------//
app.get('/judge/delete/:id', function(req, res) {
  Judge.destroy({
   where: {
       id: req.params.id
   }
  }).then(function(judge) {
    res.json(judge);
  });
});

app.get('/courtroom/delete/:id', function(req, res) {
 Courtroom.destroy({
    where: {
        id: req.params.id
    }
  }).then(function(courtroom) {
    res.json(courtroom);
  });
});

app.get('/participant/delete/:id', function(req, res) {
 Participant.destroy({
    where: {
        id: req.params.id
    }
  }).then(function(participant) {
    res.json(participant);
  });
});

app.get('/case/delete/:id', function(req, res) {
 Case.destroy({
    where: {
        id: req.params.id
    }
  }).then(function(result) {
    res.json(result);
  });
});