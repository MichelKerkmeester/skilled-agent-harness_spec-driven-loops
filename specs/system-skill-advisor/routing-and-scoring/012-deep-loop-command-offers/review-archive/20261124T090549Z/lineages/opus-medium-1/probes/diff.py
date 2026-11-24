import importlib.util,json,sys
spec=importlib.util.spec_from_file_location("sa",".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py")
sa=importlib.util.module_from_spec(spec); spec.loader.exec_module(sa)
ts=json.load(open(sys.argv[1])); d=0
for p,a,s,w,c in ts:
    py=(sa.asks_for_loop_run(p),sa.is_stuck_run_complaint(p),sa.is_writing_about_topic(p),sa._deep_command_only_mentioned(p,'/deep:review'))
    if py!=(a,s,w,c): d+=1; print("DRIFT",json.dumps(p),"ts=",(a,s,w,c),"py=",py)
print("total",len(ts),"drift",d)
print("asks-true:",[p for p,a,*_ in ts if a])
