#!/usr/bin/env python3
# Extract the 41 feature blocks from the trimmed CHANGELOG into features.jsonl,
# each tagged with its section + the specs/ track that backs it (so the verifier
# knows where to look).
import json, re, sys
changelog, out = sys.argv[1:3]
sec2track = {
    "Spec Kit & Memory": "system-speckit",
    "The Deep Loops, Unified and Extended": "system-deep-loop",
    "Orchestrating Other AIs": "cli-external-orchestration",
    "Documentation as a System": "sk-doc",
    "The Design Surface": "sk-design",
    "One Code Skill": "sk-code",
    "Safer Git": "sk-git",
    "Prompt Engineering": "sk-prompt",
    "MCP Tooling": "mcp-tooling",
    "Hooks, Goals and the Runtime": "hooks",
    "The Skill Advisor": "system-skill-advisor",
    "Agent Discipline": "agents",
}
lines = open(changelog, encoding="utf-8").read().splitlines()
feats, cur_sec, title, body = [], None, None, []
def flush():
    global title, body
    if title is not None:
        feats.append((cur_sec, title, "\n".join(body).strip()))
    title, body = None, []
for ln in lines:
    m2 = re.match(r'^## (.+)$', ln)
    m4 = re.match(r'^#### (.+)$', ln)
    if m2:
        flush(); cur_sec = m2.group(1).strip(); continue
    if m4:
        flush()
        if cur_sec in sec2track:
            title = m4.group(1).strip()
        continue
    if title is not None and ln.strip() != "&nbsp;":
        body.append(ln)
flush()
with open(out, "w", encoding="utf-8") as w:
    for i, (sec, t, b) in enumerate((f for f in feats if f[1] and f[0] in sec2track), 1):
        w.write(json.dumps({"id": f"{i:03d}", "section": sec, "track": sec2track[sec],
                            "title": t, "body": b}, ensure_ascii=False) + "\n")
print(f"extracted {sum(1 for f in feats if f[1] and f[0] in sec2track)} features -> {out}")
