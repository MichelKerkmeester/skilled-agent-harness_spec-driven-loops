import sys
L,n,worked,failed=sys.argv[1],sys.argv[2],sys.argv[3],sys.argv[4]
p=L+'/deep-review-strategy.md'; t=open(p).read()
t=t.replace("[First iteration -- populated after iteration 1 completes]\n- [Approach]: [Why it worked] (iteration N)","- "+worked+f" (iteration {n})",1) if "[Why it worked]" in t else t.replace("\n## 9. WHAT FAILED","- "+worked+f" (iteration {n})\n\n## 9. WHAT FAILED",1)
t=t.replace("[First iteration -- populated after iteration 1 completes]\n- [Approach]: [Why it failed] (iteration N)","- "+failed+f" (iteration {n})",1) if "[Why it failed]" in t else t.replace("\n## 10. EXHAUSTED","- "+failed+f" (iteration {n})\n\n## 10. EXHAUSTED",1)
open(p,'w').write(t)
