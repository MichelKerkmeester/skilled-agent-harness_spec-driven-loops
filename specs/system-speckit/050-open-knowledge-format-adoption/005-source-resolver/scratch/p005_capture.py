"""Record per-folder rule outcomes and RESULT lines for a fixed packet list.

Usage: p005_capture.py <packets.txt> <out.json> [ENV=VALUE ...]
Each packet runs validate.sh --strict on its own. Rule lines are x (error) and
! (warn); SOURCE_TAGS is kept so the forced-cutoff pass can show its warnings.
"""
import json, os, re, subprocess, sys
VALIDATE = ".skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh"
packets = [p for p in open(sys.argv[1]).read().split() if p]
env = dict(os.environ, **dict(kv.split("=", 1) for kv in sys.argv[3:]))
out = {}
for p in packets:
    text = subprocess.run(["bash", VALIDATE, p, "--strict"], capture_output=True, text=True, env=env).stdout
    folder, rules = None, {}
    results = []
    for line in text.splitlines():
        m = re.match(r"\s*Folder:\s*(\S+)", line)
        if m: folder = m.group(1).split("/specs/", 1)[-1]; rules.setdefault(folder, [])
        m = re.match(r"^([x!])\s+([A-Z0-9_]+):", line)
        if m and folder: rules[folder].append(m.group(1) + m.group(2))
        if line.startswith("RESULT:"): results.append(line)
    out[p] = {"rules": rules, "results": results}
json.dump(out, open(sys.argv[2], "w"), indent=1)
print(f"PACKETS {len(out)} FOLDERS {sum(len(v['rules']) for v in out.values())}")
