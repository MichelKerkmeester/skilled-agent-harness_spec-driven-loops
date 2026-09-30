import json,sys,re
def load(p):
    rows={};cur=None
    for line in open(p):
        line=line.rstrip("\n")
        m=re.match(r"PROMPT (\d+): (.*)",line)
        if m: cur=int(m.group(1)); rows[cur]={"prompt":m.group(2),"json":None,"exit":None,"raw":[]}; continue
        m=re.match(r"EXIT (\d+): (\d+)",line)
        if m: rows[int(m.group(1))]["exit"]=int(m.group(2)); continue
        if cur is not None:
            rows[cur]["raw"].append(line)
            try: rows[cur]["json"]=json.loads(line)
            except Exception: pass
    return rows
MAPHUB={"cli-jev":"cli-classifier"}; MAPMODE={"cli-usage":"cli-jev"}
def norm(j,base):
    if j is None: return None
    t=[]
    for x in j.get("targets",[]) or []:
        sk=x.get("skillId"); wm=x.get("workflowMode")
        if base: sk=MAPHUB.get(sk,sk); wm=MAPMODE.get(wm,wm)
        t.append((x.get("packetId"),x.get("packetKind"),x.get("backendKind"),sk,wm))
    hub=j.get("hubId"); hub=MAPHUB.get(hub,hub) if base else hub
    return (hub,j.get("action"),j.get("selectionKind"),tuple(t),j.get("reason") if "reason" in j else None)
b=load(sys.argv[1]); a=load(sys.argv[2]); mism=0
for k in sorted(b):
    nb=norm(b[k]["json"],True); na=norm(a[k]["json"],False)
    ok = b[k]["prompt"]==a[k]["prompt"] and nb==na and b[k]["exit"]==a[k]["exit"]
    if not ok: mism+=1
    print(("MATCH" if ok else "DIFF "), k, b[k]["exit"], a[k]["exit"], nb if ok else (nb, na))
print("rows",len(b),"after",len(a),"mismatch",mism)
sys.exit(1 if mism or len(b)!=len(a) else 0)
