# #syncing aws resources to postgres
echo 'syncing aws'
cloudquery sync ./yamlfiles/aws_source.yaml  ./yamlfiles/postgresql.yaml

# #syncing gcp resources to postgres 
echo 'syncing gcp'
cloudquery sync ./yamlfiles/gcp.yaml  ./yamlfiles/postgresql.yaml       		

# #syncing azure resources to postgres
echo 'syncing azure'
cloudquery sync  ./yamlfiles/azure.yaml  ./yamlfiles/postgresql.yaml


