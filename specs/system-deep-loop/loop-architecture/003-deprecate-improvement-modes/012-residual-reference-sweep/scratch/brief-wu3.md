ROLE: Remove stale improvement-mode statements from live docs and graph metadata. Work only in this git worktree. Do not commit. Text only: change no behavior.

FACT: the agent-improvement and model-benchmark modes are gone; system-deep-loop has research, review and ai-council. These live lines still describe the retired modes as current:
1. .skilled/skills/system-deep-loop/SKILL.md ~108 (the runtime list ends with the promotion primitives for improvement, drop that part), ~123 (NEVER add an improvement loopType), ~125 (NEVER let a read-only mode reach the improvement mutation scripts), ~131 (escalate on an improvement loopType). Delete the three rules that only guard the retired mode; trim line ~108.
2. .skilled/skills/system-deep-loop/ARCHITECTURE.md ~151: ADR-004 "Improvement stays host-driven" -> set its status to Retired and, if the doc has an ADR body section for it, add one sentence that the improvement modes were removed.
3. .skilled/skills/system-deep-loop/graph-metadata.json ~26 and .skilled/skills/sk-prompt/graph-metadata.json ~19: the sibling edge between the two skills has context "improvement utility peer". Delete that sibling edge in both files (the pairing existed for agent improvement). Keep the JSON valid.
4. .skilled/skills/system-deep-loop/deep-ai-council/references/structure/state-format.md ~181: drop "improvement" from the mode union.
5. .skilled/skills/system-deep-loop/manual-testing-playbook/advisor-integration/lexical-mode-scoring.md ~17: "three non-improvement workflow families" -> "three workflow families".
6. .skilled/skills/system-deep-loop/runtime/lib/mode-append-gateway/README.md ~24: drop "improvement" from the composite-domains list.
7. .skilled/skills/README.txt ~71: the system-deep-loop row lists improvement (and named-standard alignment) modes; make it say research, review and AI Council, matching .skilled/skills/system-deep-loop/SKILL.md's description.
8. Then search: rg -n -i "improvement (mode|lane|loop)|improvement lanes|host-driven|promote-candidate|rollback-candidate" .skilled -g '!node_modules' -g '!**/changelog/**' -g '!**/benchmark/**' -g '!**/tests/**' -g '!*.json' and fix any further line that presents the retired modes as current. Leave lines that call them retired, and leave anything under system-skill-advisor, system-deep-loop/runtime/lib/*.ts, system-deep-loop/shared/behavior-benchmark and sk-doc/sk-create-benchmark (other workers own those).

ALLOWED WRITES: the files named above plus docs found in step 8 outside the excluded owners. Do not run generators; the orchestrator regenerates derived files.

VERIFY:
- node -e 'for (const f of process.argv.slice(1)) JSON.parse(require("fs").readFileSync(f,"utf8")); console.log("json ok")' .skilled/skills/system-deep-loop/graph-metadata.json .skilled/skills/sk-prompt/graph-metadata.json
- the step 8 search, showing what remains and why each remaining line is fine

HANDBACK: each file and line changed, the final step 8 output with a one-line reason per remaining hit.
