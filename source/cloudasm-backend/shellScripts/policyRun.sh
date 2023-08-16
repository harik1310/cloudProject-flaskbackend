echo 'connecting to Database'
export DSN="postgres://postgres:1310@localhost:5432/cq" 

echo 'Running aws policies'
psql ${DSN} -f /home/harih/Desktop/cloud-monitoring/source/cloudasm-backend/.cq/plugins/source/cloudquery/aws/v15.7.0/plugins/policies/cis_v1.5.0/policy.sql

echo 'Running gcp policies'
psql ${DSN} -f /home/harih/Desktop/cloud-monitoring/source/cloudasm-backend/.cq/plugins/source/cloudquery/gcp/v8.4.5/plugins/policies/cis_v1.2.0/policy.sql


echo 'Running azure policies'
psql ${DSN} -f /home/harih/Desktop/cloud-monitoring/source/cloudasm-backend/.cq/plugins/source/cloudquery/azure/v7.4.1/plugins/policies/cis_v1.3.0/policy.sql