import json,sys
# usage: collect.py <out.md> <title> name=transcript ...
out,title=sys.argv[1],sys.argv[2]
doc=["# "+title,"","Each return is quoted line by line, so its own headings do not count as headings of this file.",""]
for pair in sys.argv[3:]:
    name,path=pair.split("=",1)
    last=None
    for line in open(path):
        try: e=json.loads(line)
        except Exception: continue
        m=e.get("message") or {}
        if m.get("role")=="assistant":
            for c in m.get("content") or []:
                if isinstance(c,dict) and c.get("type")=="text" and c.get("text","").strip(): last=c["text"]
    assert last, name
    doc+=["## "+name,""]+["> "+l if l else ">" for l in last.split("\n")]+[""]
open(out,"w").write("\n".join(doc))
print(out, len(doc))
