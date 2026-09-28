#!/usr/bin/env bash
# Recheck each README fix against its source from the final state. Prints one line per check.
cd "$(git rev-parse --show-toplevel)" || exit 3
R=README.md; A=.skilled/skills/system-skill-advisor/README.md
pass=0; fail=0
ck() { local id="$1" desc="$2"; shift 2; if eval "$@" >/dev/null 2>&1; then echo "PASS $id $desc"; pass=$((pass+1)); else echo "FAIL $id $desc"; fail=$((fail+1)); fi; }
cmds=$(git ls-files .skilled/commands | grep '\.md$' | grep -v -E '/assets/|/scripts/|README' | wc -l | tr -d ' ')
ck R01 "36 command entry points ($cmds) and README says 36 twice" '[ "$cmds" = 36 ] && [ "$(grep -c "36 command entry points" $R)" = 2 ]'
rules=$(python3 -c "import json;print(len(json.load(open('.skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json'))))")
ck R02 "40 rules ($rules), no 38-rule claim left" '[ "$rules" = 40 ] && ! grep -q -E "38 (validation )?rules" $R'
ck R03 "create command names exist, old names gone" 'test -f .skilled/commands/create/skill.md && test -f .skilled/commands/create/skill-parent.md && test -f .skilled/commands/create/manual-testing-playbook.md && ! grep -q -E "/create:sk-skill|/create:testing-playbook" $R'
ck R04 "DQI 40/30/30 in extract_structure.py" 'grep -q "'"'"'content_max'"'"': 30" .skilled/skills/sk-doc/shared/scripts/extract_structure.py && grep -q "'"'"'style_max'"'"': 30" .skilled/skills/sk-doc/shared/scripts/extract_structure.py && [ "$(grep -c "Structure 40, Content 30, Style 30" $R)" = 2 ]'
fam=$(sed -n "/^const FAMILY_NAMES = \[/,/^\];/p" .skilled/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs | grep -c "^  '")
nb=$(sed -n "/^const NEEDS_A_BROWSER = {/,/^};/p" .skilled/skills/sk-design/sk-design-chart/scripts/tests/corpus-mutations.test.cjs | grep -c ":")
ck R05 "chart families $fam, browser-backed $nb" '[ "$fam" = 49 ] && [ "$nb" = 5 ] && grep -q "49 named check families, five of them browser-backed" $R'
mt=$(python3 -c "import json;print(len(json.load(open('.skilled/skills/mcp-tooling/mode-registry.json'))['modes']))")
ck R06 "mcp-tooling $mt modes, no mcp-orca-cli" '[ "$mt" = 9 ] && ! grep -q "mcp-orca-cli" $R && [ "$(grep -c "nine modes" $R)" = 2 ]'
ck R07 "doctor targets match _routes.yaml" '[ "$(grep "  - target:" .skilled/commands/doctor/_routes.yaml | awk "{print \$NF}" | sort | tr "\n" " ")" = "$(echo deep-loop embeddings fable-mode parent-skill router-reach runtime-mirrors skill-advisor skill-budget skill-graph-freshness speckit-retrieval | tr " " "\n" | sort | tr "\n" " ")" ] && ls .skilled/commands/doctor/assets/doctor-skill-advisor.yaml'
ck R08 "skill-advisor doctor allows --dry-run" 'grep -q "\"--dry-run\"" .skilled/commands/doctor/_routes.yaml'
ck R09 "create.sh --phase default three children" 'grep -q "^PHASE_COUNT=3" .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh'
ck R10 "AC_CLOSURE informs while in progress" 'grep -q "still open while the packet is in progress" .skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-closure.sh && grep -q "before the rollout cutoff stay advisory" .skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-closure.sh'
ck R11 "implementation-summary scaffolded, required after first task" 'grep -q afterImplementationStarts .skilled/skills/system-spec-kit/templates/spec-kit-docs.json && grep -q scaffold_lifecycle_required_docs .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh'
ck R12 "four post-execution rules in AGENTS.md" '[ "$(sed -n "/POST-EXECUTION GATES/,/Self-Check/p" AGENTS.md | grep "^#### " | grep -v -c "Self-Check")" = 4 ]'
ck R13 "save returns a plan by default" 'grep -q "Default response is a save plan" .skilled/commands/speckit/save.md && grep -q "regenerate the trigger index" .skilled/commands/speckit/save.md'
ck R14 "save lock is packet-level and fails fast" 'grep -q "Canonical save lock is active" .skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts'
ck R15 "deep-loop runtime depends on spec-kit shared and tsc" 'grep -q "\"@spec-kit/shared\": \"file:../../system-spec-kit/shared\"" .skilled/skills/system-deep-loop/runtime/package.json && grep -q "system-spec-kit/node_modules/.bin/tsc" .skilled/skills/system-deep-loop/runtime/package.json'
ck R16 "improvement lanes are host-driven" 'grep -q "improvement stays host-driven" .skilled/skills/system-deep-loop/SKILL.md'
ck R17 "legal_stop_evaluated absent from research/review assets" '! grep -q legal_stop_evaluated .skilled/commands/deep/assets/deep-research-auto.yaml .skilled/commands/deep/assets/deep-review-auto.yaml && ! grep -q legal_stop_evaluated $R'
ck R18 "runner allowlists for Cursor, Pi, Devin" 'grep -q CURSOR_ALLOWED_MODELS .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs && grep -q PI_ALLOWED_MODELS .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs && grep -q DEVIN_ALLOWED_MODELS .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs'
ck R19 "three benchmark scorers" 'grep -q "\`pattern\` \\\\| \`5dim\` \\\\| \`reviewer\`" .skilled/commands/deep/model-benchmark.md'
ck R20 "15 skills, sk-communication excluded from routing" '[ "$(git ls-files ".skilled/skills/*/SKILL.md" | awk -F/ "NF==4" | wc -l | tr -d " ")" = 15 ] && grep -q sk-communication .skilled/skills/system-skill-advisor/runtime/config/route-exclusions.json'
ck R21 "sk-code-obsidian is read-only Note Database evidence" 'grep -q "Read-only Obsidian-plugin design-system and source-convention evidence for the Note Database plugin" .skilled/skills/sk-code/sk-code-obsidian/SKILL.md'
ck R22 "sk-git three phases and their references" 'grep -q "Git development flows through 3 phases" .skilled/skills/sk-git/SKILL.md && ls .skilled/skills/sk-git/references/worktree-workflows.md .skilled/skills/sk-git/references/commit-workflows.md .skilled/skills/sk-git/references/finish-workflows.md'
ck R23 "cli-pi is the self-dispatch exception" 'grep -q "cli-pi. is the exception" .skilled/skills/cli-external-orchestration/SKILL.md'
ck R24 "orchestrate keeps write and edit" 'sed -n 1,20p .skilled/agents/orchestrate.md | grep -q "write: allow" && sed -n 1,20p .skilled/agents/orchestrate.md | grep -q "edit: allow"'
ck R25 "prompt improve and its mirrors" 'test -f .skilled/commands/prompt/improve.md && grep -q -- "--agent" .skilled/commands/prompt/improve.md && ls .codex/prompts/prompt-improve.md .cursor/commands/prompt-improve.md .pi/prompts/prompt-improve.md .hermes/prompts/prompt-improve.md'
ck R26 "goal checker flags a child with no binding row" 'grep -q "no binding-table target row for" .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs'
hf=0; for f in .opencode/plugins/*.js; do grep -q -E "hook-flags|SYSTEM_HOOKS_DISABLED" "$f" && hf=$((hf+1)); done
ck R27 "plugins on hook-flags: $hf of $(ls .opencode/plugins/*.js | wc -l | tr -d ' ')" '[ "$hf" = 12 ]'
ck R28 "complete, plan and implement mode hints" 'sed -n 3p .skilled/commands/speckit/complete.md | grep -q ":autopilot" && sed -n 3p .skilled/commands/speckit/complete.md | grep -q ":with-context" && sed -n 3p .skilled/commands/speckit/plan.md | grep -q ":with-phases" && sed -n 3p .skilled/commands/speckit/implement.md | grep -q ":autopilot"'
ck R29 "create:skill registers nothing" 'grep -q "did not mutate advisor state" .skilled/commands/create/assets/create-skill-auto.yaml'
ck R30 "create:readme is folder READMEs only" 'grep -q "Folder README creation, general or code-folder" .skilled/commands/create/readme.md'
ck R31 "agent-router adopts the target identity" 'grep -q "BECOMES" .skilled/commands/agent-router.md'
ck R32 "root utilities are agent-router, goal-opencode, vision" '[ "$(git ls-files .skilled/commands | grep "\.md$" | grep -v README | awk -F/ "NF==3" | xargs -n1 basename | sort | tr "\n" " ")" = "agent-router.md goal-opencode.md vision.md " ]'
ck R33 "webflow is stdio with WEBFLOW_TOKEN" 'python3 -c "import json,sys;d=json.load(open(\".utcp_config.json\"));t=[x for x in d[\"manual_call_templates\"] if x[\"name\"]==\"webflow\"][0];w=t[\"config\"][\"mcpServers\"][\"webflow\"];sys.exit(0 if w[\"transport\"]==\"stdio\" and \"WEBFLOW_TOKEN\" in w[\"env\"] else 1)"'
ck R34 "SPECKIT_AUTOSYNC=0 is the publish leg" 'grep -q "the publish leg with .SPECKIT_AUTOSYNC=0." .skilled/skills/sk-git/changelog/v1.5.0.0.md'
ck R35 "no CLAUDE.md in the repo" '! git ls-files --error-unmatch CLAUDE.md && ! test -e CLAUDE.md'
ck R36 "opencode.json keys" '[ "$(python3 -c "import json;print(sorted(json.load(open(\"opencode.json\")).keys()))")" = "['"'"'\$schema'"'"', '"'"'experimental'"'"', '"'"'mcp'"'"', '"'"'permission'"'"']" ]'
ck R37 "scripts runbook lists session-cleanup" 'grep -q "session-cleanup.sh" .skilled/scripts/README.md'
ck R38 "daemon CLI reference is the advisor front door" 'grep -q "The daemon-backed advisor CLI front door" .skilled/skills/system-spec-kit/references/cli/daemon-cli-reference.md'
ck R39 "spec-kit workspace root holds shared and typescript" 'python3 -c "import json,sys;d=json.load(open(\".skilled/skills/system-spec-kit/package.json\"));sys.exit(0 if \"shared\" in d[\"workspaces\"] and \"typescript\" in d[\"devDependencies\"] else 1)" && ! test -e package.json'
ck R40 "advisor build uses spec-kit shared and tsc" 'grep -q "system-spec-kit/node_modules/.bin/tsc" .skilled/skills/system-skill-advisor/runtime/package.json'
ck R41 "grep over seven Code Mode configs matches all seven" '[ "$(grep -l mcp-code-mode-launcher opencode.json .mcp.json .claude/mcp.json .codex/config.toml .cursor/mcp.json .devin/mcp_config.json .pi/mcp.json 2>/dev/null | wc -l | tr -d " ")" = 7 ]'
ck R42 "research runs with :with-research or confidence below 60%" 'grep -q "ONLY dispatch when :with-research flag is set OR confidence < 60%" .skilled/commands/speckit/assets/speckit-complete.yaml'
ck R43 "in-page links use GitHub double-hyphen slugs" '! grep -q -E "\]\(#(6-deep-loop|12-code-mode-mcp)\)" $R'
ck A01 "trust state is unavailable when the daemon is down" 'grep -q "state: .unavailable." .skilled/skills/system-skill-advisor/runtime/lib/freshness/trust-state.ts'
ck A02 "propagate apply is the gated write" 'grep -q "toolName === .skill_graph_propagate_enhances. && isPropagateApply" .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts'
ck A03 "runtime data/ holds the prompt policy, scripts/ the Python scorer" 'test -f .skilled/skills/system-skill-advisor/runtime/data/prompt-policy.default.json && test -f .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py && [ "$(git ls-files .skilled/skills/system-skill-advisor/runtime/config | grep -v README | wc -l | tr -d " ")" = 2 ]'
ck A04 "four editor shims live in spec-kit, Pi and handler in the advisor" 'ls .skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts .skilled/skills/system-spec-kit/runtime/hooks/codex/user-prompt-submit.ts .skilled/skills/system-spec-kit/runtime/hooks/cursor/user-prompt-submit.ts .skilled/skills/system-spec-kit/runtime/hooks/devin/user-prompt-submit.ts .skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts .skilled/plugins/system-skill-advisor.js'
ck A05 "advisor README carries no semicolon hard blocker" 'python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py $A'
echo "TOTAL pass=$pass fail=$fail"
[ "$fail" = 0 ]
