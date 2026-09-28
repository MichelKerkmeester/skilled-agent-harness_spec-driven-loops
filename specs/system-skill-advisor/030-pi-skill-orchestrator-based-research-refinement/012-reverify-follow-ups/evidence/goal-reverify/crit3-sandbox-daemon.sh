#!/usr/bin/env bash
# Orchestrator-run proof that a sandboxed advisor daemon leaves the live generation file unchanged. It runs
# CP-004 steps 2 to 5 exactly as the scenario file writes them, in one shell, and records the live advisor
# before and after. The blocks send no signal, and neither does this script.
set -u
cd "$(git rev-parse --show-toplevel)" || exit 1
A=.skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/daemon-absent-fallback.md
GEN=.skilled/skills/.state/advisor/skill-graph-generation.json
LIVE_LEASE=.skilled/skills/system-skill-advisor/runtime/database/.system-skill-advisor-launcher.json
RUN=$(mktemp /tmp/cp004-steps.XXXXXX)
python3 - "$A" "$RUN" <<'PY'
import sys
section = open(sys.argv[1], encoding="utf-8").read().split("## 3. TEST EXECUTION", 1)[1].split("## 4.", 1)[0]
blocks = [part.split("```", 1)[0] for part in section.split("```bash\n")[1:]]
open(sys.argv[2], "w").write("".join(blocks[1:5]))
PY
procs() { ps -axo pid,ppid,command | grep -E "node .*(system-skill-advisor-launcher\.cjs|advisor-server\.js)" | grep -v grep \
  | awk '{cmd=$NF; sub(/.*Code_Environment\/Public\//, "", cmd); print "  pid=" $1, "ppid=" $2, cmd}'; }
live() {
  echo "generation file: $(shasum -a 256 "$GEN" | cut -c1-16)"
  echo "live lease:      $(shasum -a 256 "$LIVE_LEASE" | cut -c1-16)"
  echo "advisor processes:"; procs
}
echo "# CP-004 steps 2 to 5 as written, HEAD $(git rev-parse --short HEAD), scenario sha $(shasum "$A" | cut -c1-12), steps sha $(shasum "$RUN" | cut -c1-12)"
echo "## before, $(date -u +%Y-%m-%dT%H:%M:%SZ)"; live
echo "## steps 2 to 5"
T0=$(date +%s)
bash "$RUN" 2>&1
echo "steps took $(( $(date +%s) - T0 ))s"
rm -f "$RUN"
echo "## after, $(date -u +%Y-%m-%dT%H:%M:%SZ)"; live
echo "sandbox folders left: $(find /tmp /private/tmp -maxdepth 1 -name 'cp004.*' 2>/dev/null | wc -l | tr -d ' ')"
