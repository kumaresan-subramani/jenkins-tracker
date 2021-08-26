var repos = "ej2-release-automation";
var branchName = "hotfix/17.2.0.34_Vol2"
branchName = branchName.replace("/", "%252F");

var jenkinsapi = require('@shawn/jenkins-api');
var JENKINSUSER = 'ajithr';
var JENKINSTOKEN = 'd1eaeaf44a76055d1527332070d16343';
var jenkins = jenkinsapi.init(`http://${JENKINSUSER}:${JENKINSTOKEN}@jenkins.syncfusion.com:8080`);

module.exports = function (branch, version, checkChangelog ) {
    var job = `EJ2/job/${repos}/job/${branchName}`;
    var date = new Date();
    var releaseDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
    jenkins.build(job, {
        releaseDate: releaseDate,
        releaseVersion: version,
        isPublicRelease: true,
        isPatchRelease: true,
        checkChangelog: checkChangelog,
        targetBranch: branch
    }, function (err, data) {
        if (err) {
            console.log(data.jobName + ' - is not executed')
        } else {
            console.log(data.jobName + ' - is executed');
        }
    });
}