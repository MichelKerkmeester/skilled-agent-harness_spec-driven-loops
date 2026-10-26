# Prints "file<TAB>line" for every JavaScript or TypeScript line the checker reads as comment text.
import importlib.machinery, importlib.util, sys, os, re
cp, lst, out = sys.argv[1:4]
l=importlib.machinery.SourceFileLoader("c",cp); s=importlib.util.spec_from_loader(l.name,l); m=importlib.util.module_from_spec(s); l.exec_module(m)
t=m.load_table(os.path.join(os.path.dirname(os.path.realpath(cp)),"..","assets","comment-syntax.json"))
with open(out,"w") as o:
    for f in open(lst,"rb").read().decode().split("\0"):
        if not re.search(r"\.(c|m)?(j|t)sx?$", f): continue
        try: lang,fam=m.language_for(f,t,{})
        except OSError: continue
        if not lang: continue
        fm=t["families"][fam]; st=m.ScanState()
        for i,r in enumerate(open(f,encoding="utf-8",errors="replace").readlines(),1):
            if m.comment_text(r,fm,st): o.write(f"{f}\t{i}\n")
