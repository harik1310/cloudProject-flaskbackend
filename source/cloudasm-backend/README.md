### Developed on Ubuntu 22.04.2 LTS, Node.js v18.16.0 , NPM 9.6.5 , PostgreSQL  15.2

The backend is configured to run on Port 8000

1. ###  npm install to install all the dependencies

2. Refer cloudquery's documentation to set up cloudquery on your device

3. Create the necessary configuration files and store it in the directory    ###    cloudasm-backend/shellScripts/yamlfiles/

4. Update the commands that configured to run the cloudquery sync and policies, Navigate to  ###    cloudasm-backend/shellScripts  ### and update the ".sh" files according to your files and also update the DSN in the 'policyRun.sh'

5. If cloudquery has been synced once it would install the plugins and to use the Run Policies Unzip the plugin files inside  ###   cloudasm-backend/.cq/plugins/source/cloudquery/  ### do it separetely for AWS, GCP and Azure

6. The connection for the database is stored in ###     cloudasm-backend/database.js  ### update it with your database that is configured for Cloudquery 

6. If you're using Bard api refer to https://github.com/dsdanielpark/Bard-API/tree/main and install it

7. After setting all the dependcies run 
    ### nodemon server.js 
    to start the backend server