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
app.post('/case/create', function(req, res) {
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

app.post('/courtroom/create', function(req, res) {
 Courtroom.create({
    id: req.body.id,
    number: req.body.number
  }).then(function(courtroom) {
    res.json(courtroom);
  });
});

app.post('/judge/create', function(req, res) {
  Judge.create({
    id: req.body.id,
    name: req.body.name,
    room: req.body.room,
    ext: req.body.string
  }).then(function(user) {
    res.json(user);
  });
});

app.post('/participant/create', function(req, res) {
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
app.post('/judge/update', function(req, res) {
  Judge.update({
    name: req.body.name,
    room: req.body.room,
    ext: req.body.string
  }, {
      where: {
          id: req.body.id
      }
  }).then(function(user) {
    res.json(user);
  });
});

app.post('/courtroom/update', function(req, res) {
 Courtroom.update({
    number: req.body.number
  }, {
      where: {
          id: req.body.id
      } 
  }).then(function(courtroom) {
    res.json(courtroom);
  });
});

app.post('/participant/update', function(req, res) {
 Participant.update({
    name: req.body.name,
    address: req.body.address,
    type: req.body.type
  }, {
      where: {
          id: req.body.id
      } 
  }).then(function(participant) {
    res.json(participant);
  });
});

app.post('/case/update', function(req, res) {
 Case.update({
    number: req.body.number
  }, {
      where: {
          id: req.body.id
      } 
  }).then(function(result) {
    res.json(result);
  });
});

//------------------------------------ DELETE STATEMENTS ------------------------------------//
app.post('/judge/delete', function(req, res) {
  Judge.destroy({
   where: {
       id: req.body.id
   }
  }).then(function(judge) {
    res.json(judge);
  });
});

app.post('/courtroom/delete', function(req, res) {
 Courtroom.destroy({
    where: {
        id: req.body.id
    }
  }).then(function(courtroom) {
    res.json(courtroom);
  });
});

app.post('/participant/delete', function(req, res) {
 Participant.destroy({
    where: {
        id: req.body.id
    }
  }).then(function(participant) {
    res.json(participant);
  });
});

app.post('/case/delete', function(req, res) {
 Case.destroy({
    where: {
        id: req.body.id
    }
  }).then(function(result) {
    res.json(result);
  });
});