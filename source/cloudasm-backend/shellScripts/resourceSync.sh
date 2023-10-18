# #syncing aws resources to postgres
echo 'syncing aws'
cloudquery sync /home/harih/Desktop/cloud-monitoring/source/cloudasm-backend/shellScripts/yamlfiles/aws_source.yaml  /home/harih/Desktop/cloud-monitoring/source/cloudasm-backend/shellScripts/yamlfiles/postgresql.yaml

# #syncing gcp resources to postgres 
echo 'syncing gcp'
cloudquery sync ./home/harih/Desktop/cloud-monitoring/source/cloudasm-backend/shellScripts/yamlfiles/gcp.yaml  /home/harih/Desktop/cloud-monitoring/source/cloudasm-backend/shellScripts/yamlfiles/postgresql.yaml       		

# #syncing azure resources to postgres
# echo 'syncing azure'
# cloudquery sync  /home/harih/Desktop/cloud-monitoring/source/cloudasm-backend/shellScripts/yamlfiles/azure.yaml  /home/harih/Desktop/cloud-monitoring/source/cloudasm-backend/shellScripts/yamlfiles/postgresql.yaml


