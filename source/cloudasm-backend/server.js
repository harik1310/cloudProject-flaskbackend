const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const app = express();
const axios = require('axios');
const router = express.Router();
const { SECTIONS } = require('./sections.js')
const { client } = require("./database.js");
const { spawn } = require("child_process");
const report = require('./downloadreport.js')
const jwt = require('jsonwebtoken')

const { Configuration, OpenAIApi } = require("openai");


const configuration = new Configuration({
    organization: "org-EuSvSFN4AVVf2MrYCClebuQ8",
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
// const response = await openai.listEngines();

const jwt_secret = 'jwtsecretkey'
const salt = 10;

app.use(cors());
app.use(express.json());
app.use(router);


app.post('/register', async (req, res) => {
  // console.log("Backend")
  const username = req.body.email;
  const password = req.body.password
  console.log(username, password);
  const user = await client.query(`SELECT * FROM app_users where username='${username}'`)
  console.log(user);
  
  if (!user) {
    return res.json({error : 'user already exists'})
  }
  else{
    console.log('else');
    try {
      console.log("inside");
      const hashedPassword = await bcrypt.hash(password, salt)
      const user1 = await client.query(`INSERT INTO app_users ( username, password ) VALUES ('${username}','${hashedPassword}')`)
      if(user1){
        return res.json({status:"OK"})
      }  
    }
      catch (error) {
        res.json({ status: 'error', error: "invalid password" })
        console.log(error);
      }
    }
  })



app.post('/login', async (req, res) => {
  // console.log("Backend")
  const username = req.body.email;
  const password = req.body.password
  console.log('username & pass',username, password)
  try {
    const  { rows : users } = await client.query(`SELECT * FROM app_users where username='${username}'`)
    
    if (users.length === 0 ) {
      return res.json({ err: "user not found" })
    }
    const user = users[0];
      console.log("inside")
      console.log('user',user)
      console.log('compare',password, user.password)
      const token = jwt.sign({}, jwt_secret);
      console.log(token)
      const pass = await bcrypt.compare(password, user.password)
      console.log(pass);
      if (pass){
        return res.json({ status: 'OK', token: token })
      }
      else{
        return res.json({ error:"error" })
      }
    } catch (error) {
    res.json({ status: 'error', error: "invalid password" })
    console.log(error);
  }
})



// to sync all of the resources
app.post("/sync-resources", async (req, res) => {
  const sync = await spawn("bash", ["./shellScripts/resourceSync.sh"]);

  sync.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  sync.stderr.on("data", (data) => {
    console.log(`stderr: ${data}`);
  });

  sync.on("error", (error) => {
    console.log(`error: ${error.message}`);
  });

  sync.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
    res.sendStatus(200);
  });
});


// to sync the resources 
app.post("/shortsync-resources", async (req, res) => {
  const sync = await spawn("bash", ["./shellScripts/shortSync.sh"]);

  sync.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  sync.stderr.on("data", (data) => {
    console.log(`stderr: ${data}`);
  });

  sync.on("error", (error) => {
    console.log(`error: ${error.message}`);
  });

  sync.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
    res.sendStatus(200);
  });
});

// to run policies on all of the resources
app.post("/policyrun", async (req, res) => {
  const sync = await spawn("bash", ["./shellScripts/policyRun.sh"]);

  sync.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  sync.stderr.on("data", (data) => {
    console.log(`stderr: ${data}`);
  });

  sync.on("error", (error) => {
    console.log(`error: ${error.message}`);
  });

  sync.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
    res.sendStatus(200);
  });
});


// for downloading the report
router.get('/download-report', (req, res, next) => {
  let base64 = ""
  report.buildPDF(data => {
    base64 = data
    res.json({ base64 })
  })
})


//to get the list of the projects registered 
app.get('/getprojects', async (req, res) => {
  try {
    const projectList = await client.query(`SELECT * FROM app_project_form;`)
    res.json(projectList)
  } catch (error) {
    console.log(error)
  }
})


//get the data for the donut chart
app.get("/chart", async (req, res) => {
  try {
    const pass = await client.query(`
        SELECT * FROM aws_policy_results where execution_time >= NOW() - '1 day'::INTERVAL UNION ALL SELECT * FROM gcp_policy_results where execution_time >= NOW() - '1 day'::INTERVAL UNION ALL SELECT * FROM azure_policy_results where execution_time >= NOW() - '1 day'::INTERVAL;
    `);

    const rows = pass.rows

    for (let row of rows) {
      const [check_id_rounded, check_id_after_decimal] = row.check_id.split(".")

      // 5 not in SECTIONS,
      // row.section = SECTIONS["default"]
      if (!(check_id_rounded in SECTIONS)) {
        row.section = SECTIONS["default"]
        continue
      }


      // 1 not in SECTIONS[5] (5.1)
      // row.section = SECTIONS[5]["default"
      if (!(check_id_after_decimal in SECTIONS[check_id_rounded])) {
        row.section = SECTIONS[check_id_rounded]["default"]
        continue
      }

      // SECTIONS[5][1]
      row.section = SECTIONS[check_id_rounded][check_id_after_decimal]
    }

    res.json(pass);
  } catch (err) {
    console.log(err);
  }
});
//select title, execution_time from aws_policy_results where execution_time >= NOW() - '1 day'::INTERVAL;

// for the progress bar
app.get("/chart/aws", async (req, res) => {
  try {
    const fail = await client.query(`SELECT * FROM aws_policy_results where execution_time >= NOW() - '1 day'::INTERVAL;`);
    res.json(fail);
  } catch (err) {
    console.log(err);
  }
});

// for the progress bar
app.get("/chart/gcp", async (req, res) => {
  try {
    const fail = await client.query(`SELECT * FROM gcp_policy_results where execution_time >= NOW() - '1 day'::INTERVAL;`);
    res.json(fail);
  } catch (err) {
    console.log(err);
  }
});

// for the progress bar
app.get("/chart/azure", async (req, res) => {
  try {
    const data = await client.query(`SELECT * FROM azure_policy_results where execution_time >= NOW() - '1 day'::INTERVAL;`);
    res.json(data);
  } catch (err) {
    console.log(err);
  }
});

//receive the data from the frontend for the project details
app.post('/api/projects', async (req, res) => {
  try {
    const { projectName,
      awsResourceId,
      gcpResourceId,
      azureResourceId,
      projectDescription } = req.body;

    const query = `INSERT INTO app_project_form (project_name, aws_resource_id, gcp_resource_id, azure_resource_id,project_description) VALUES ($1, $2, $3, $4, $5)`

    await client.query(query, [projectName, awsResourceId, gcpResourceId, azureResourceId, projectDescription]);

    res.status(200).json({ message: 'Form data inserted successfully' });
  } catch (error) {
    console.log('Error inserting form data:', error);
    res.status(500).json({ error: 'An error occurred while inserting form data' });
  }
});


//get a list of attack tactics , the webscraped data
app.get("/attackpatterns", async (req, res) => {
  try {
    const fail = await client.query(`SELECT DISTINCT pr.check_id, pr.title, pr.subscription_id, pr.status, controls.id, controls.techniques, controls.tactics, controls.mitigations,
    CASE
        WHEN pr.source = 'aws_controls' THEN 'AWS'
        WHEN pr.source = 'gcp_controls' THEN 'GCP'
        WHEN pr.source = 'azure_controls' THEN 'Azure'
        ELSE 'Unknown'
    END AS source
    FROM (
        SELECT check_id, title, subscription_id, status, 'azure_controls' AS source FROM azure_policy_results
        UNION ALL
        SELECT check_id, title, resource_id, status,'gcp_controls' AS source FROM gcp_policy_results
        UNION ALL 
        SELECT check_id, title, resource_id, status,'aws_controls' AS source FROM aws_policy_results
      ) AS pr
	  JOIN (
			SELECT id, section, context, techniques, tactics, mitigations, 'aws_controls' AS source FROM aws_controls
			UNION ALL
			SELECT id, section, context, techniques, tactics, mitigations, 'gcp_controls' AS source FROM gcp_controls
			UNION ALL
			SELECT id, section, context, techniques, tactics, mitigations, 'azure_controls' AS source FROM azure_controls
		) AS controls on pr.check_id = controls.id
     WHERE techniques not like 'NaN' ORDER BY pr.status,pr.check_id;`);
    res.json(fail);
  } catch (err) {
    console.log(err);
  }
});


app.get('/bardapi', async (req, res) => {

  var dataToSend;
  // spawn new child process to call the python script
  const pythonProcess = await spawn('python3', ['bard.py']);
  let response = '';
  pythonProcess.stdout.on('data', (data) => {
    response += data;
  });

  // Capture any errors that occur during execution
  pythonProcess.stderr.on('data', (data) => {
    console.error(`Error executing bard.py script: ${data}`);
  });

  // Handle the completion of the bard.py script
  pythonProcess.on('close', (code) => {
    if (code === 0) {
      const jsonData = JSON.parse(response);
      console.log(jsonData);
      res.json(jsonData)
      // Use the jsonData as needed in your Node.js code
    } else {
      console.error(`bard.py script finished with non-zero exit code ${code}`);
    }
  })
})

// async function sendMessage(message) {
//   try {
//     const apiKey = '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'
//     const response = await axios.get('https://api.openai.com/v1/answers', {
//       params: {
//         model: 'gpt-3.5-turbo',
//         question: message,
//         max_tokens: 100,
//         temperature: 0.6,
//         n: 1
//       },
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${apiKey}`
//       }
//     });
  
//     const { answers } = response.data;
//     const reply = answers[0].text;
//     return reply;
//   } catch (error) {
//     console.error('Error:', error);
//     return 'An error occurred while communicating with the ChatGPT.';
//   }
// }

// app.get('/bardapi', async (req, res) => {
//   try {
//     const question = 'Give me top 10 ATT&CK cloud attacks';
//     const answer = await sendMessage(question);
//     res.json({ answer });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'An error occurred while retrieving the answer.' });
//   }
// });


app.get('/getthreatpattern', async (req, res) => {

  try {
    const threatData = await client.query(`SELECT DISTINCT controls.id, controls.section, controls.context, controls.techniques, controls.tactics, controls.mitigations, policy_results.status,
    attack_techniques.description AS technique_desc,
    CASE
        WHEN controls.source = 'aws_controls' THEN 'AWS'
        WHEN controls.source = 'gcp_controls' THEN 'GCP'
        WHEN controls.source = 'azure_controls' THEN 'Azure'
        ELSE 'Unknown'
    END AS source, attack_mitigations.description,
    policy_results.status, attack_tactics.tactic_name, attack_tactics.tactic_description 
	FROM (
    SELECT id, section, context, techniques, tactics, mitigations, 'aws_controls' AS source FROM aws_controls
    UNION
    SELECT id, section, context, techniques, tactics, mitigations, 'gcp_controls' AS source FROM gcp_controls
    UNION
    SELECT id, section, context, techniques, tactics, mitigations, 'azure_controls' AS source FROM azure_controls
) AS controls
LEFT JOIN attack_techniques ON controls.techniques LIKE 'T%' AND attack_techniques.technique_id = controls.techniques
LEFT JOIN attack_tactics ON controls.tactics = attack_tactics.tactic_id
JOIN attack_mitigations ON controls.mitigations = attack_mitigations.mitigation_id
JOIN (
    SELECT check_id, resource_id, status, 'gcp' AS source FROM gcp_policy_results
    UNION ALL
    SELECT check_id, resource_id, status, 'aws' AS source FROM aws_policy_results
    UNION ALL
    SELECT check_id, resource_id, status, 'azure' AS source FROM azure_policy_results
) AS policy_results ON controls.id = policy_results.check_id
WHERE attack_techniques.technique_id LIKE 'T%'
ORDER BY policy_results.status;`)
    res.json(threatData)
  } catch (error) {
    console.log(error)
  }


}
)

app.listen(8000, () => {
  console.log("listening on 8000");
});


// SELECT DISTINCT controls.id, controls.section, controls.context, controls.techniques, controls.mitigations,
//     CASE
//         WHEN controls.source = 'aws_controls' THEN 'AWS'
//         WHEN controls.source = 'gcp_controls' THEN 'GCP'
//         WHEN controls.source = 'azure_controls' THEN 'Azure'
//         ELSE 'Unknown'
//     END AS source, attack_mitigations.description,
//     policy_results.status
// FROM (
//     SELECT id, section, context, techniques, mitigations, 'aws_controls' AS source FROM aws_controls
//     UNION
//     SELECT id, section, context, techniques, mitigations, 'gcp_controls' AS source FROM gcp_controls
//     UNION
//     SELECT id, section, context, techniques, mitigations, 'azure_controls' AS source FROM azure_controls
// ) AS controls
// LEFT JOIN attack_techniques ON controls.techniques LIKE 'T%'
// JOIN attack_mitigations ON controls.mitigations = attack_mitigations.mitigation_id
// JOIN (
//     SELECT check_id,resource_id, status, 'gcp' AS source FROM gcp_policy_results
//     UNION ALL
//     SELECT check_id,resource_id, status, 'aws' AS source FROM aws_policy_results
//     UNION ALL
//     SELECT check_id,resource_id, status, 'azure' AS source FROM azure_policy_results
// ) AS policy_results ON controls.id = policy_results.check_id
// WHERE attack_techniques.technique_id LIKE 'T%'
// ORDER BY controls.id;


