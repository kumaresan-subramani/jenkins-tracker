# A common plugin for handling Jenkins CI & Digital Ocean Slaves.

## Install

- Open the command prompt from `jenkins-api`.
- Run the command line `npm i` or `npm install`.

## How to run all EJ2 components with a specific branch?

- Change the required `branchName` in `~/config.json` file.
- Run the command line `gulp build` or `build` in the command prompt.

### How to add new repository in the configuration?
- Add the new repository name in `~/repsitories.json` file.

### Where can I find the JENKINSUSER and JENKINSTOKEN?
- Goto http://jenkins.syncfusion.com/
- Click your account from top right corner.
- Click `Configure` in the left side bar.
- Click `Show API Token` button in the configuration. You can see the user ID and auth Token.


## How to remove halt digital ocean slave machines?

- Run the command line `gulp remove-slaves` or `remove-slaves` in the command prompt.
- This will clear the digital ocean slave machines which are not cleaned up properly and resolve the slave machine creation.