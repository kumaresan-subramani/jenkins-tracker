
var jenkinsapi = require('@shawn/jenkins-api');
var JENKINSUSER = 'ajithr';
var JENKINSTOKEN = 'd1eaeaf44a76055d1527332070d16343';
var jenkins = jenkinsapi.init(`http://${JENKINSUSER}:${JENKINSTOKEN}@jenkins.syncfusion.com:8080`);

module.exports = function (job, callBackFn) {
    jenkins.last_build_info(job, callBackFn);
}