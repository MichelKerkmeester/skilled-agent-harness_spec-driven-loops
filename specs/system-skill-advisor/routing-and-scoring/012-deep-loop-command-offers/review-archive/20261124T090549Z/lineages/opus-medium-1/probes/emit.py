import json,sys,datetime,subprocess,os
L,spec_path=sys.argv[1],sys.argv[2]
s=json.load(open(spec_path))
n=s['iteration']
now=datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3]+'Z'
fd=s['findingDetails']
summ={'P0':0,'P1':0,'P2':0}
for f in fd: summ[f['severity']]+=1
rec={"type":"iteration","iteration":n,"mode":"review","target_agent":"deep-review","agent_definition_loaded":True,
"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"fanout-opus-medium-1-1795495423434-9mvwzq",
"status":"complete","focus":s['focus'],"dimensions":s['dimensions'],"filesReviewed":s['filesReviewed'],
"findingsCount":len(fd),"findingsSummary":summ,"findingsNew":[f['id'] for f in fd if not f.get('refines')],
"findingDetails":[{k:v for k,v in f.items()} for f in fd],"traceabilityChecks":{"results":s['traceability']},
"newFindingsRatio":s['ratio'],"noveltyJustification":s['novelty'],"sessionId":"fanout-opus-medium-1-1795495423434-9mvwzq",
"generation":1,"lineageMode":"new","timestamp":now,"durationMs":s['durationMs'],"graphEvents":s.get('graphEvents',[])}
for k in ('reviewDepthSchemaVersion','reviewDepthApplicability','targetSelection','searchCoverage','searchLedger'):
    if k in s: rec[k]=s[k]
recfile=f"{L}/probes/record-{n:03d}.json"
json.dump(rec,open(recfile,'w'))
delta=f"{L}/deltas/iter-{n:03d}.jsonl"
assert not os.path.exists(delta)
with open(delta,'w') as o:
    o.write(json.dumps(rec)+"\n")
    for f in fd:
        row={"type":"finding","id":f['id'],"severity":f['severity'],"title":f['title'],"file":f['file'],"iteration":n,"dimension":f.get('dimension')}
        if f.get('refines'): row['refines']=f['refines']
        o.write(json.dumps(row)+"\n")
    for t in s['traceability']:
        o.write(json.dumps({"type":"traceability-check","iteration":n,**t})+"\n")
    for r in s.get('ruledOut',[]):
        o.write(json.dumps({"type":"ruled_out","direction":r[0],"reason":r[1],"iteration":n})+"\n")
r=subprocess.run(["node",".skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs","--mode","review","--run-directory",L,"--event-json",recfile],capture_output=True,text=True)
print("GATEWAY",r.returncode,r.stdout[:300],r.stderr[:500])
if r.returncode!=0: sys.exit(2)
r=subprocess.run(["node",".skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs","specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers","--artifact-dir",L,"--create-missing-anchors"],capture_output=True,text=True)
print("REDUCE",r.returncode,r.stdout[-400:],r.stderr[-500:])
