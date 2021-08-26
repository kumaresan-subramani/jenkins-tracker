var repos = "ej2-release-docs";
var branchName = "EJ2-13795-gatsby-automation"
branchName = branchName.replace("/", "%252F");

var platformList = require("../api-platform.json");
var jenkinsapi = require('@shawn/jenkins-api');
var JENKINSUSER = 'ajithr';
var JENKINSTOKEN = 'd1eaeaf44a76055d1527332070d16343';
var jenkins = jenkinsapi.init(`http://${JENKINSUSER}:${JENKINSTOKEN}@jenkins.syncfusion.com:8080`);

module.exports = function (branch,platform, callBackFn) {
        var job = `EJ2/job/${repos}/job/${branchName}`;
        var date = new Date();
        var releaseDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
        jenkins.build(job, {
            branchName: branch,
            // branchName: 'hotfix/17.4.0.39_Vol4',
            releaseDate: releaseDate,
            bucketName: 'ej2.syncfusion.com',
            prefixPath: platformList[platform].prefixPath,
            isPublicRelease: true,
            mainApp: platformList[platform].mainApp
        }, callBackFn);
}