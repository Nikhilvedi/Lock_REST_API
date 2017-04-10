# The backend for a smart lock application, using MongoDB and Node.js to expose a RESTful api for a Swift 3 Mobile Application.

This repository contains the code for the backend, Node.js and MongoDB.

## Project Overview

* This repository
* The lock code scripts repository found [here](https://github.com/Nikhilvedi/lock-code-scripts),
* And the mobile application repository, found [here](https://github.com/Nikhilvedi/swift_lock_app),
are part of my Final Year Project, BSc Computer Science at Sheffield Hallam University.  

## Code Quality and Comments

* Documentation via JSDoc has been generated which is included in the repository.
* This can be downloaded and viewed by navigating to the 'docs' folder and browsing the HTML files at nikhilvedi.github.io/Lock_REST_API
* See comments within code for more information on implementation and justification for each.

## How To Use

* Follow the guide [here](https://howtonode.org/how-to-install-nodejs) to install Node on your opperating system.
* Clone the project
* Navigate to the project in terminal or CMD
* Run 'npm install --save' - you may need to run this command as root user (sudo on mac)
* Before you can run the server, you'll need to go to the index.js file and replace the command calling the pi with either your PIs IP or 'ls' on mac to just test the server and get successful responses from the API.
* Back in Terminal or CMD, run 'nodemon'
* In the browser navigate to 'http://localhost:3000/' and receive the API specification for connecting too

## Testing 

* Run 'npm test' to run the tests in command line
* Run 'istanbul cover test.js' to see the coverage report in HTML format

## License

- Copyright © 2017 Nikhil Vedi.
