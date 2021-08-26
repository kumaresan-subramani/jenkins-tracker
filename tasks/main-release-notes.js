var repos = "ej2-release-docs";
var branchName = "EJ2-13795-gatsby-automation"
branchName = branchName.replace("/", "%252F");

var jenkinsapi = require('@shawn/jenkins-api');
var JENKINSUSER = '6343';
var jenkins = jenkinsapi.init(`http://${JENKINSUSER}:${JENKINSTOKEN}@jenkins.syncfusion.com:8080`);

module.exports = function (branch,version, callBackFn) {
        var job = `EJ2/job/${repos}/job/${branchName}`;
        var date = new Date();
        var releaseDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
        jenkins.build(job, {
            branchName: branch,
            releaseDate: releaseDate,
            // branchName: 'hotfix/17.4.0.39_Vol4',
            releaseVersion: version,
            // releaseVersion: '17.4.40',
            excludeUnreleaseFile: 'true',
            bucketName: 'ej2.syncfusion.com',
            prefixPath: '/{{:platform}}documentation/release-notes',
            isPublicRelease: 'true',
            isReleaseNotes: 'true',
            mainApp: 'ej2-docs'
        }, callBackFn);
}