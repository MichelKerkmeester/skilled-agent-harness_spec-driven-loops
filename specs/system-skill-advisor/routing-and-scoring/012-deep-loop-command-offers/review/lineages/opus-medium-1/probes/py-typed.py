import importlib.util,json
spec=importlib.util.spec_from_file_location("sa",".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py")
sa=importlib.util.module_from_spec(spec); spec.loader.exec_module(sa)
for p in ["/deep:review:confirm the auth module","/deep:research:auto vector index compaction","my deep review run is stuck, /deep:review again"]:
    rows=sa.analyze_request(p)
    print(p, '=>', json.dumps([{k:r.get(k) for k in ('skill','kind','command','policy','typed','confidence')} for r in rows[:3]]))
