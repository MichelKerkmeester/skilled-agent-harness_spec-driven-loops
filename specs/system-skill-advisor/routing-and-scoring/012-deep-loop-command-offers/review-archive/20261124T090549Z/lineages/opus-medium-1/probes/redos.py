import sys,time,importlib.util
spec=importlib.util.spec_from_file_location("sa",".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py")
sa=importlib.util.module_from_spec(spec); spec.loader.exec_module(sa)
N=int(sys.argv[1])
cases={'words':'review '*N,'iterRun':'run '+'more '*N+'iterations','quoteword':"don't "*N+'run /deep:review','checkfor':'check '+'x '*N+'for','led':'do not run /deep:review. '*(N//10)}
for k,p in cases.items():
    t=time.time(); sa.asks_for_loop_run(p); sa.is_stuck_run_complaint(p); sa._deep_command_only_mentioned(p,'/deep:review'); sa._apply_deep_loop_offer_gate([{"skill":"command-spec-kit-deep-review"}],p.lower())
    print(k,len(p),f"{(time.time()-t)*1000:.1f}ms")
