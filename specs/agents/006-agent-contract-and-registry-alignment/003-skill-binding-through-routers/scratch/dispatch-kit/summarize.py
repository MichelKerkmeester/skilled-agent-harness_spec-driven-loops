import sys,json
tools={};texts=[];cost=0;err=[]
for line in open(sys.argv[1]):
    line=line.strip()
    if not line: continue
    try: e=json.loads(line)
    except Exception: continue
    t=e.get("type","")
    p=e.get("part",{}) or {}
    if t=="tool_use" or p.get("type")=="tool":
        n=p.get("tool","?"); st=(p.get("state") or {})
        tools[n]=tools.get(n,0)+1
        if st.get("status")=="error": err.append((n,str(st.get("error"))[:200]))
    if t=="text" or p.get("type")=="text":
        if p.get("text"): texts.append(p["text"])
    if p.get("type")=="step-finish": cost+=p.get("cost",0) or 0
    if t=="error": err.append(("error",json.dumps(e)[:400]))
print("TOOLS",tools,"COST",round(cost,4));print("ERRORS",err[:8]);print("LAST TEXT:\n",(texts[-1] if texts else "<none>")[-2500:])
