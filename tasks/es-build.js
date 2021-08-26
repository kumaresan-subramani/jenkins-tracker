var repos = "ej2-es-build";

var jenkinsapi = require('@shawn/jenkins-api');
var JENKINSUSER = 'ajithr';
var JENKINSTOKEN = 'd1eaeaf44a76055d1527332070d16343';
var jenkins = jenkinsapi.init(`http://${JENKINSUSER}:${JENKINSTOKEN}@jenkins.syncfusion.com:8080`);

module.exports = function (branch, version, callBackFn) {
    var job = `EJ2/job/${repos}/job/${branch.replace("/", "%252F")}/`;
    jenkins.build(job, {
        RELEASE_VERSION: version,
    }, callBackFn);
}