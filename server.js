var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var exec = require('child_process').exec;

app.use(express.static('public'));
app.use(bodyParser.json());

var jwt = require('jsonwebtoken');
var appToken = "";

// app.use(bodyParser.json());

var jwtPrivatekey1 = "guyyuguygiuhgytdykg";

var loginDetails = require('./users.json');

var mainreleaseNotes = require('./tasks/main-release-notes');
var dummyReleaseNotes = require('./tasks/dummy-release-notes');

var mainDocs = require('./tasks/main-docs');
var dummyDocs = require('./tasks/dummy-docs');

var mainApi = require('./tasks/main-api');
var dummyApi = require('./tasks/dummy-api');

var esBuild = require('./tasks/es-build');

var buildInfo = require('./tasks/buildinfor');


var dummyPatchRealease = require('./tasks/dummy-patch-release');
var mainPatchRealease = require('./tasks/main-patch-release');

var dummyVolRelease = require('./tasks/dummy-vol-release');
var mainVolRelease = require('./tasks/main-vol-release');

var mail = require('./tasks/mail');

const authorization = (req, res, next) => {

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  if (req.body.token === "" || req.body.token === undefined) {
    res.status('401');
    return res.send('Token gone');
  }

  var tempToken = jwt.verify(req.body.token, jwtPrivatekey1);
  var tempVariable = false;
  for (var i = 0; i < loginDetails.users.length; i++) {
    if (loginDetails.users[i].username === tempToken.username) {
      if (loginDetails.users[i].password === tempToken.password) {
        return next();
      } else {
        tempVariable = true;
      }
    } else {
      tempVariable = true;
    }
  }
  if (tempVariable) {
    res.status('401');
    return res.send('access denied');
  }
};

app.post('/api/login', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  jwt.sign({
    username: req.body.username,
    password: req.body.password
  }, jwtPrivatekey1, {
    algorithm: 'HS256'
  }, function (err, token) {

    // var tempCheck= jwt.verify(token, jwtPrivatekey1)
    for (var i = 0; i < loginDetails.users.length; i++) {
      if (loginDetails.users[i].username === req.body.username) {
        if (loginDetails.users[i].password === req.body.password) {
          appToken = jwt.sign({
            username: loginDetails.users[i].username,
            password: loginDetails.users[i].password
          }, jwtPrivatekey1, {
            algorithm: 'HS256'
          });
        }
      }
    }
    if (appToken === "") {
      res.send('Login credentials mismatched');
    } else {
      res.send({
        token: appToken
      });
    }
  });
})


app.post('/api/send', authorization, function (req, res) {

  var reqdata = req.body.values;
  var repo = reqdata && reqdata.repo;

  if (reqdata && reqdata.release_Type === "main" && repo === 'Releasenotes') {
    mainreleaseNotes(reqdata.branch_release, reqdata.version, function (err, data) {
      mail(repo, reqdata.branchDoc, reqdata.version, function (error, info) {
        res.send({
          status: 'build started',
          jobName: data.jobName
        });
      }, reqdata.release_Type, reqdata.selectPlatform);
    });
  } else if (reqdata && reqdata.release_Type === "dummy" && repo === 'Releasenotes') {
    dummyReleaseNotes(reqdata.branch_release, reqdata.version, function (err, data) {
      mail(repo, reqdata.branchDoc, reqdata.version, function (error, info) {
        res.send({
          status: 'build started',
          jobName: data.jobName
        });
      }, reqdata.release_Type, reqdata.selectPlatform);
    });
  } else if (reqdata && reqdata.releaseTypeDoc === "main" && repo === 'Docs') {
    mainDocs(reqdata.branchDoc, reqdata.selectPlatform, function (err, data) {
      mail(repo, reqdata.branchDoc, reqdata.versionES, function (error, info) {
        res.send({
          status: 'build started',
          jobName: data.jobName
        });
      }, reqdata.releaseTypeDoc, reqdata.selectPlatform);
    });
  } else if (reqdata && reqdata.releaseTypeDoc === "dummy" && repo === 'Docs') {
    dummyDocs(reqdata.branchDoc, reqdata.selectPlatform, function (err, data) {
      mail(repo, reqdata.branchDoc, reqdata.versionES, function (error, info) {
        res.send({
          status: 'build started',
          jobName: data.jobName
        });
      }, reqdata.releaseTypeDoc, reqdata.selectPlatform);
    });
  } else if (repo === 'Es-build') {
    esBuild(reqdata.branchES, reqdata.versionES, function (err, data) {
      if (err) {
        res.send(err.message);
      } else {
        mail(repo, reqdata.branchES, reqdata.versionES, function (error, info) {
          res.send({
            status: 'build started',
            jobName: data.jobName
          });
        }, reqdata.releaseTypeapi, reqdata.selectPlatApi);
      }
    });
  } else if (reqdata.releaseTypeapi === "main" && repo === 'Api') {
    mainApi(reqdata.branchapi, reqdata.selectPlatApi, function (err, data) {
      mail(repo, reqdata.branchapi, reqdata.versionES, function (error, info) {
        res.send({
          status: 'build started',
          jobName: data.jobName
        });
      }, reqdata.releaseTypeapi, reqdata.selectPlatApi);
    });
  } else if (reqdata.releaseTypeapi === "dummy" && repo === 'Api') {
    dummyApi(reqdata.branchapi, reqdata.selectPlatApi, function (err, data) {
      mail(repo, reqdata.branchapi, reqdata.versionES, function (error, info) {
        res.send({
          status: 'build started',
          jobName: data.jobName
        });
      }, reqdata.releaseTypeapi, reqdata.selectPlatApi);
    });
  } else if (type === "main" && repo === 'Patch') {
    patchRealease(reqdata.branchPatch, reqdata.versionPatch, reqdata.changeLog, function (err, data) {
      mail(repo, reqdata.branchPatch, reqdata.versionPatch, function (error, info) {
        res.send({
          status: 'build started',
          jobName: data.jobName
        });
      }, reqdata.releaseTypeapi, reqdata.selectPlatApi);
    });
  } else if (type === "dummy" && repo === 'Patch') {
    dummyPatchRealease(reqdata.branchPatch, reqdata.versionPatch, reqdata.changeLog, function (err, data) {
      mail(repo, reqdata.branchPatch, reqdata.versionPatch, function (error, info) {
        res.send({
          status: 'build started',
          jobName: data.jobName
        });
      }, reqdata.releaseTypeapi, reqdata.selectPlatApi);
    });
  } else {
    res.send('Please provide valid type')
  }

});

app.post('/api/buildinfo', function (req, res) {
  var job = req.body.values.jobName;
  var JENKINSUSER = 'ajithr';
  var JENKINSTOKEN = 'd1eaeaf44a76055d1527332070d16343';
  var jenkinsUrl = `http://${JENKINSUSER}:${JENKINSTOKEN}@jenkins.syncfusion.com:8080`;
  buildInfo(job, function (err, data) {
    res.send(err ? err : {
      url: data.url.replace('http://jenkins.syncfusion.com', jenkinsUrl)
    });
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});