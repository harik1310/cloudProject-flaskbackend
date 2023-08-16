from bardapi import Bard
import os
import sys
import json


token="YQjx2Zf3pzlZgAPacindKqnjbgJifTrEFDmJPGIdeqffKZ_J2il2K35HSLWDXTmZQBZeqw."

# cloud_attacks = Bard(token=token).get_answer("Provide list of cloud top 10 ATT&CK tactics with ID, techniques with ID, sub-techniques with ID that are attacked also give me as a JSON data")['content']
# cloud_attacks = Bard(token=token).get_answer('''give a list of cloud top ATT&CK technique_id,subtechnique_id }''')['content']
cloud_attacks = Bard(token=token).get_answer('''repeat what i say "T1530,T1190,T1210,T1537" ''')['content']




response_json = json.dumps(cloud_attacks)

sys.stdout.write(response_json)
sys.stdout.flush()

# with open('output.txt','w') as file:
#     file.write(cloud_attacks)



