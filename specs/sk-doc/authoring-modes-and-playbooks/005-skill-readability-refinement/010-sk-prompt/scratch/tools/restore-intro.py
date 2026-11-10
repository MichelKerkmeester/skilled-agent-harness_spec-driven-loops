"""Put back the HEAD intro (first paragraph after the H1) of the named Markdown files, keeping the rest of each file."""
import subprocess, sys, re
pat = re.compile(r'^(# [^\n]+\n+)((?:(?!#|---|<!--)[^\n]+\n?)+)', re.M)
for f in sys.argv[1:]:
    old = subprocess.run(['git', 'show', f'HEAD:{f}'], capture_output=True, text=True).stdout
    om, cur = pat.search(old), open(f).read(); cm = pat.search(cur)
    assert om and cm, f
    body = om.group(2) if om.group(2).endswith('\n') else om.group(2) + '\n'
    open(f, 'w').write(cur[:cm.start(2)] + body + cur[cm.end(2):]); print('restored intro', f)
