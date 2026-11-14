import sys,re,json,subprocess,os
P=sys.argv[1]; S=P+"/scratch"; os.makedirs(S,exist_ok=True)
def sh(c): return subprocess.run(c,shell=True,capture_output=True,text=True).stdout
def route(hub,prompt):
    o=sh("node .skilled/bin/compiled-route.cjs --hub %s --prompt %s"%(hub,json.dumps(prompt)))
    try:
        d=json.loads(o); return d.get("action"),[t.get("packetId") for t in d.get("targets",[])]
    except Exception: return "error:"+o[:80],[]
head=sh("git rev-parse --short HEAD").strip()
cmds=["rg -l 'compiled-route' .skilled/agents | wc -l","rg -o 'sk-code/sk-code-frontend/[a-z/.-]+' .skilled/agents/design.md | sort -u | wc -l","rg -o '\\.skilled/skills/sk-doc/sk-create-[a-z-]+/[A-Za-z0-9_./-]+' .skilled/agents/markdown.md | sort -u | wc -l"]
open(S+"/baseline.txt","w").write("# Baseline at "+head+"\n"+"".join("\n$ "+c+"\n"+sh(c) for c in cmds))
out=["# Route parity: every skill path an agent file cites, and whether the skill's router reaches it","","Written at commit "+head+", before any agent file was edited. Each row ends with its outcome.","","## design.md","","The `sk-code` router was run for a design task:","","`node .skilled/bin/compiled-route.cjs --hub sk-code --prompt \"Decide the spacing scale, colour palette, elevation and motion for a new settings page interface\"`",""]
a,t=route("sk-code","Decide the spacing scale, colour palette, elevation and motion for a new settings page interface")
out+=["It returned action `%s` with target `%s`. The table shows where that packet's own `ROUTER.md` or `SKILL.md` names each file."%(a,", ".join(t)),"","| Cited path | Named in the routed packet | Outcome |","|---|---|---|"]
fr=".skilled/skills/sk-code/sk-code-frontend/"
for p in sorted(set(re.findall(r"sk-code/sk-code-frontend/[a-z/.-]+",open(".skilled/agents/design.md").read()))):
    rel=p.split("sk-code-frontend/")[1].rstrip(".") if not p.endswith(".md") and not p.endswith(".css") else p.split("sk-code-frontend/")[1]
    hits=[f for f in ("ROUTER.md","SKILL.md") if rel in open(fr+f).read()]
    ok=("sk-code-frontend" in t) and hits and os.path.exists(fr+rel)
    out.append("| `%s` | %s | %s |"%(p,", ".join("`sk-code-frontend/%s`"%h for h in hits) or "not named",("reachable" if ok else "kept, router cannot select it")))
out+=["","## markdown.md","","The `sk-doc` router was run once per command, with the command's own purpose as the prompt.","","| Command | Cited path | Router target | Named in the routed packet | Outcome |","|---|---|---|---|---|"]
md=open(".skilled/agents/markdown.md").read().split("\n")
prompts={"/create:agent":"create a new agent definition file","/create:skill":"create a new skill SKILL.md","/create:skill-parent":"create a parent skill hub with nested mode packets","/create:feature-catalog":"create a feature catalog package","/create:manual-testing-playbook":"create a manual testing playbook package","/create:readme":"create a README.md for this folder","/create:changelog":"write a versioned changelog entry","/create:command":"create a new slash command with its workflow assets","/create:benchmark":"create a benchmark folder and report","/create:diff":"create a before and after document diff report","/create:repo-rule":"create a repo rule in the rules directory","/create:with-human-voice":"apply the human voice rules to existing prose","/create:goal":"author a goal.md for a spec packet","markdown":"edit a scoped markdown document"}
seen=set(); cache={}
for l in md:
    m=re.match(r"\| `(/create:[a-z-]+|markdown)` ",l)
    key=m.group(1) if m else "(reference table)"
    for p in re.findall(r"\.skilled/skills/sk-doc/sk-create-[a-z-]+/[A-Za-z0-9_./-]+",l):
        p=p.rstrip(".")
        if (key,p) in seen: continue
        seen.add((key,p))
        packet=p.split("sk-doc/")[1].split("/")[0]; rel=p.split(packet+"/")[1]; base=os.path.basename(rel)
        if key in prompts:
            if key not in cache: cache[key]=route("sk-doc",prompts[key])
            a,t=cache[key]; tgt=", ".join(t) or a
            routed=packet in t
        else:
            tgt="same packet as its command row"; routed=True
        d=".skilled/skills/sk-doc/"+packet+"/"
        hits=[f for f in ("SKILL.md","ROUTER.md") if os.path.exists(d+f) and (rel in open(d+f).read() or base in open(d+f).read())]
        ok=routed and hits and os.path.exists(p)
        out.append("| `%s` | `%s` | `%s` | %s | %s |"%(key,p,tgt,", ".join("`%s/%s`"%(packet,h) for h in hits) or "not named",("reachable" if ok else "kept, router cannot select it")))
out+=["","## deep-review.md","","| Cited path | Named in the review mode | Outcome |","|---|---|---|"]
rv=".skilled/skills/sk-code/sk-code-review/"
hits=[f for f in ("SKILL.md","ROUTER.md") if os.path.exists(rv+f) and "review-core.md" in open(rv+f).read()]
out.append("| `.skilled/skills/sk-code/sk-code-review/references/review-core.md` | %s | %s |"%(", ".join("`sk-code-review/%s`"%h for h in hits) or "not named","reachable" if hits else "kept, router cannot select it"))
open(S+"/route-parity.md","w").write("\n".join(out)+"\n")
