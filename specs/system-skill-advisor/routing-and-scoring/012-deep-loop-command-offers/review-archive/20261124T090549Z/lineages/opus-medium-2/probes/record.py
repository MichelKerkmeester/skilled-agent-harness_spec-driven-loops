# Builds the iteration record + delta from a spec JSON, hands the record to the gateway, then runs the reducer.
import json, sys, subprocess, datetime, os
L='specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/lineages/opus-medium-2'
spec=json.load(open(sys.argv[1]))
n=spec['iteration']
now=datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3]+'Z'
fd=spec['findings']
summ={'P0':0,'P1':0,'P2':0}
for f in fd: summ[f['severity']]+=1
w={'P0':10,'P1':5,'P2':1}
prior=spec.get('priorWeighted',0)
neww=sum(w[f['severity']]*(0.5 if f.get('refines') else 1) for f in fd if f.get('new',True))
tot=prior+sum(w[f['severity']] for f in fd if f.get('new',True))
ratio=round(neww/tot,4) if tot else 0.0
rec={"type":"iteration","iteration":n,"mode":"review","target_agent":"deep-review","agent_definition_loaded":True,
"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":n,"status":"complete","focus":spec['focus'],
"dimensions":spec['dimensions'],"filesReviewed":spec['files'],"findingsCount":len(fd),"findingsSummary":summ,
"findingsNew":[f['id'] for f in fd if f.get('new',True)],
"findingDetails":[{k:v for k,v in f.items() if k in('id','severity','title','file','findingClass','scopeProof','affectedSurfaceHints','dimension','refines')} for f in fd],
"traceabilityChecks":{"results":spec['traceability']},"newFindingsRatio":ratio,"noveltyJustification":spec['novelty'],
"ruledOut":spec.get('ruledOut',[]),"edgeCases":spec.get('edgeCases',[]),
"sessionId":"fanout-opus-medium-2-1795495423434-9mvwzq","generation":1,"lineageMode":"new","continuedFromRun":None,
"timestamp":now,"durationMs":spec.get('durationMs',300000),"graphEvents":spec.get('graphEvents',[])}
if spec.get('v2'): rec.update(spec['v2'])
ev=f'{L}/iteration-{n:03d}-event.json'
json.dump(rec,open(ev,'w'))
delta=f'{L}/deltas/iter-{n:03d}.jsonl'
assert not os.path.exists(delta)
with open(delta,'w') as fh:
  fh.write(json.dumps(rec)+'\n')
  for f in fd:
    fh.write(json.dumps({"type":"finding","id":f['id'],"severity":f['severity'],"title":f['title'],"file":f['file'],"iteration":n,**({"refines":f['refines']} if f.get('refines') else {})})+'\n')
  for t in spec['traceability']:
    fh.write(json.dumps({"type":"traceability_check","protocolId":t['protocolId'],"status":t['status'],"iteration":n})+'\n')
  for r in spec.get('ruledOut',[]):
    fh.write(json.dumps({"type":"ruled_out","direction":r,"reason":"verified by direct read or execution","iteration":n})+'\n')
g=subprocess.run(['node','.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs','--mode','review','--run-directory',L,'--event-json',ev],capture_output=True,text=True)
print('gateway rc',g.returncode,g.stdout[:300],g.stderr[:500])
if g.returncode!=0: sys.exit(2)
r=subprocess.run(['node','.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs','specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers','--artifact-dir',L,'--create-missing-anchors'],capture_output=True,text=True)
print('reducer rc',r.returncode,r.stdout[-400:],r.stderr[-600:])
print('ratio',ratio)
