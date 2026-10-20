export EVIDENCE_DIR="${EVIDENCE_DIR:-$(git rev-parse --show-toplevel)/.skilled/skills/.state/plugin-utilization}"
export AI_SESSION_CHILD=1

bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh v1 skill-advisor "Without running any tools, answer in one line: which skill in this repository should handle the request 'commit my staged changes with a conventional commit message'?"
jq -r '.system[]' "$EVIDENCE_DIR/skill-advisor.v1.capture.jsonl" | grep -E 'Advisor: live;.*sk-git' || { echo "FAIL: no live advisor line naming sk-git on v1"; exit 1; }

SYSTEM_SKILL_ADVISOR_DISABLED=1 bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh v1 killswitch-skill-advisor "Without running any tools, answer in one line: which skill in this repository should handle the request 'commit my staged changes with a conventional commit message'?"
F="$EVIDENCE_DIR/killswitch-skill-advisor.v1.capture.jsonl"; [ -s "$F" ] || { echo "FAIL: no capture at $F"; exit 1; }
SYS="$(jq -r '.system[]' "$F")" || { echo "FAIL: capture did not parse"; exit 1; }
n=$(printf '%s\n' "$SYS" | grep -c 'Advisor:' || true); echo "Advisor lines with the switch: $n"; [ "$n" -eq 0 ]

bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh v2 skill-advisor "Without running any tools, answer in one line: which skill in this repository should handle the request 'commit my staged changes with a conventional commit message'?"
jq -r '.system[]' "$EVIDENCE_DIR/skill-advisor.v2.capture.jsonl" | grep -E 'Advisor: live;.*sk-git' || { echo "FAIL: no live advisor line naming sk-git on v2"; exit 1; }

SYSTEM_SKILL_ADVISOR_DISABLED=1 bash .opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh v2 killswitch-skill-advisor "Without running any tools, answer in one line: which skill in this repository should handle the request 'commit my staged changes with a conventional commit message'?"
F="$EVIDENCE_DIR/killswitch-skill-advisor.v2.capture.jsonl"; [ -s "$F" ] || { echo "FAIL: no capture at $F"; exit 1; }
SYS="$(jq -r '.system[]' "$F")" || { echo "FAIL: capture did not parse"; exit 1; }
n=$(printf '%s\n' "$SYS" | grep -c 'Advisor:' || true); echo "Advisor lines with the switch: $n"; [ "$n" -eq 0 ]
