---
title: "Tasks: Phase 6: ai-council-mode-deprecation"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "ai council mode deprecation tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 6: ai-council-mode-deprecation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Shell variables used below. `S` is `.skilled/skills/system-deep-loop`. `R` is `.skilled/skills/system-deep-loop/runtime`. `A` is `.skilled/skills/system-skill-advisor/runtime`. `K` is `.skilled/skills/system-spec-kit/runtime/cli`. `C` is `.skilled/commands`. `P` is `specs/system-deep-loop/loop-architecture/004-workflow-logic-hardening/006-ai-council-mode-deprecation`. `Q` is the council prompt "convene an ai council to compare three migration plans". Run every command from the repository root. Tasks T013 to T017 run only when the operator chose option B for D3.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm phases 004 and 005 are Complete (`specs/system-deep-loop/loop-architecture/004-workflow-logic-hardening/`). Verify: `rg -l -F '| **Status** | Complete' specs/system-deep-loop/loop-architecture/004-workflow-logic-hardening/00[45]-*/spec.md | wc -l` prints 2.
- [ ] T002 Record the operator's D3 decision as a line `D3 decision: option A` or `D3 decision: option B`, plus the start SHA, in the log (`$P/goal.md`). Verify: `rg -n '^D3 decision: option [AB]$|^Start SHA: ' $P/goal.md` prints 2 lines.
- [ ] T003 Rerun the council inventory and save it beside the baseline (`$P/scratch/council-inventory-start.txt`). Verify: `wc -l < $P/scratch/council-inventory-start.txt` prints a count, logged in `goal.md` beside 451.
- [ ] T004 Capture every gate in the precedent list `specs/system-deep-loop/loop-architecture/003-deprecate-improvement-modes/010-verification-and-closeout/scratch/baseline.md` that still applies, plus the gates in `plan.md` section 5, with exit status and counts (`$P/scratch/gate-baseline.md`). Verify: `rg -c '^\| ' $P/scratch/gate-baseline.md` prints at least 25 and the file names the start SHA.
- [ ] T005 Write the history allowlist for the sweep: changelogs, dated benchmark reports, spec-copy fixtures, `cite-drift-redirects.json` and CI ignore paths into archived specs (`$P/scratch/exceptions.md`). Verify: `sed 's/^- //' $P/scratch/exceptions.md | xargs ls >/dev/null` exits 0, so every listed path exists.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Agent first (D2)
- [ ] T006 Move the artifact layout and output schema into the agent body and drop every packet path, script call and `node` instruction (`.skilled/agents/ai-council.md`). Verify: `rg -n 'system-deep-loop|deep-ai-council|/deep:ai-council|append-mode-event|persist-artifacts|node ' .skilled/agents/ai-council.md` prints nothing and the frontmatter still says `bash: deny`.
- [ ] T007 Apply the same body to the Claude twin (`.claude/agents/ai-council.md`). Verify: `node .skilled/bin/check-agent-mirror-sync.cjs --all` exits 0.
- [ ] T008 Regenerate the Codex agent (`.codex/agents/ai-council.toml`). Verify: `node $K/codex/sync-agents.cjs --check` exits 0.
- [ ] T009 Regenerate the Pi agent (`.pi/agents/ai-council.md`). Verify: `node $K/pi/sync-agents-pi.cjs --check` exits 0.
- [ ] T010 Regenerate the DSH agent (`.dsh/agents/ai-council.patch.yml`). Verify: `node $K/dsh/sync-agents-dsh.cjs --check` exits 0.
- [ ] T011 Confirm the symlink mirrors still resolve (`.cursor/agents/ai-council.md`). Verify: `node .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs` exits 0 and `find -L .skilled/agents .claude/agents .codex/agents .cursor/agents .devin/agents .dsh/agents .opencode/agents .pi/agents -maxdepth 1 -name 'ai-council*' | wc -l` prints 8.
- [ ] T012 Drop `@ai-council` from the deep-route rule and keep it as a LEAF (`.skilled/agents/orchestrate.md`). Verify: `rg -n 'Deep Route' .skilled/agents/orchestrate.md | rg -c 'ai-council'` prints 0, and the checks from T007 to T010 exit 0 again after the twin and generators run.

### Kept command, option B only (D3)
- [ ] T013 Write the single-round council command doc that binds the spec folder and dispatches the agent once (`$C/speckit/ai-council.md`). Verify: `rg -c 'speckit-ai-council.yaml|speckit-ai-council-presentation.txt' $C/speckit/ai-council.md` prints at least 2.
- [ ] T014 Write the one workflow file for both modes (`$C/speckit/assets/speckit-ai-council.yaml`). Verify: `ls $C/speckit/assets/speckit-ai-council*.yaml | wc -l` prints 1.
- [ ] T015 Write the presentation file (`$C/speckit/assets/speckit-ai-council-presentation.txt`). Verify: `ls $C/speckit/assets/speckit-ai-council-presentation.txt` prints the path.
- [ ] T016 Add the command row with owner `system-spec-kit` (`.skilled/skills/system-spec-kit/command-metadata.json`). Verify: `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` exits 0.
- [ ] T017 Add the command to the advisor's tracked commands with owner `system-spec-kit` (`$A/lib/command-attach.ts`). Verify: `rg -n "'/speckit:ai-council'" $A/lib/command-attach.ts` prints at least 1 line, and after the mirror syncs `find -L .claude/commands .cursor/commands .opencode/commands .codex/prompts .pi/prompts .dsh/prompts -maxdepth 2 \( -path '*/speckit/ai-council.md' -o -name 'speckit-ai-council.md' \) | wc -l` prints 6.

### Deep command removal (D3)
- [ ] T018 Delete the deep command doc (`$C/deep/ai-council.md`). Verify: `git ls-files $C/deep/ai-council.md` prints nothing.
- [ ] T019 Delete both council workflow files and the presentation file (`$C/deep/assets/`). Verify: `git ls-files $C/deep/assets/deep-ai-council-auto.yaml $C/deep/assets/deep-ai-council-confirm.yaml $C/deep/assets/deep-ai-council-presentation.txt` prints nothing.
- [ ] T020 Remove the `deep/ai-council` entry from the contract compiler (`$R/scripts/compile-command-contracts.cjs`). Verify: `rg -n 'ai-council' $R/scripts/compile-command-contracts.cjs` prints nothing.
- [ ] T021 Delete the compiled and legacy council copies and their readme rows (`$C/deep/assets/compiled/`). Verify: `rg -l 'deep-ai-council' $C/deep/assets/compiled $C/deep/assets/legacy` prints nothing.
- [ ] T022 Remove the council symlinks and generated prompts through the sync scripts (`$K/runtime-mirrors/sync-runtime-mirrors.cjs`). Verify: `find -L .claude/commands .cursor/commands .opencode/commands .codex/prompts .pi/prompts .dsh/prompts -maxdepth 2 \( -iname '*deep-ai-council*' -o -path '*/deep/ai-council.md' \) | wc -l` prints 0, and `bash $K/validate-command-tree-parity.sh`, `node $K/codex/sync-prompts.cjs --check`, `node $K/pi/sync-prompts-pi.cjs --check` and `node $K/dsh/sync-prompts-dsh.cjs --check` exit 0.

### Hub wiring (D1, D6)
- [ ] T023 Remove the mode and the `council` loop type (`$S/mode-registry.json`). Verify: `node -e 'const r=require("./.skilled/skills/system-deep-loop/mode-registry.json");console.log(r.modes.map(m=>m.workflowMode).join(" "), r.extensions["runtime-loop"].runtimeLoopTypes.join(" "))'` prints `research review research review`.
- [ ] T024 Remove the council tieBreak entry, routerSignals and vocabulary class (`$S/hub-router.json`). Verify: `rg -n -i 'council' $S/hub-router.json` prints nothing.
- [ ] T025 Remove the `AI_COUNCIL` intent, its resource map and the three-mode prose (`$S/ROUTER.md`). Verify: `rg -n -i 'ai[-_ ]council' $S/ROUTER.md` prints nothing.
- [ ] T026 Remove council keywords, phrases and the packet path (`$S/graph-metadata.json`). Verify: `rg -n -i 'council' $S/graph-metadata.json` prints nothing.
- [ ] T027 Remove the command row and the sibling hint (`$S/command-metadata.json`). Verify: `rg -n -i 'council' $S/command-metadata.json` prints nothing.
- [ ] T028 Remove council keywords from the doctor metadata (`$S/description.json`). Verify: `rg -n -i 'council' $S/description.json` prints nothing.
- [ ] T029 Replace the tracked changelog symlink with a real folder holding the packet's changelog files, as the precedent did for `deep-improvement` (`.skilled/changelog/system-deep-loop/deep-ai-council`). Verify: `git ls-files -s .skilled/changelog/system-deep-loop/deep-ai-council | rg -c '^120000'` prints 0 and `ls .skilled/changelog/system-deep-loop/deep-ai-council | wc -l` prints the same count as the packet's `changelog/` at the start commit.
- [ ] T030 Delete the mode packet (`$S/deep-ai-council/`). Verify: `git ls-files $S/deep-ai-council` prints nothing.
- [ ] T031 Regenerate the leaf manifest (`$S/leaf-manifest.json`). Verify: `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs $S --check` exits 0 and `rg -c 'ai-council' $S/leaf-manifest.json` prints 0.
- [ ] T032 Refresh the compiled routing artifacts and activation manifests for the hub, and regenerate the remaining compiled deep contracts (`.skilled/bin/compiled-route-sync.cjs`). Verify: `node .skilled/bin/compiled-route-guard.cjs` exits 0.
- [ ] T033 Describe a two-mode hub and point council readers at the agent (`$S/SKILL.md`). Verify: `rg -n 'deep-ai-council|/deep:ai-council' $S/SKILL.md` prints nothing.
- [ ] T034 [P] Describe a two-mode hub (`$S/README.md`). Verify: `rg -n 'deep-ai-council|/deep:ai-council' $S/README.md` prints nothing.
- [ ] T035 [P] Describe a two-mode hub (`$S/ARCHITECTURE.md`). Verify: `rg -n 'deep-ai-council|/deep:ai-council' $S/ARCHITECTURE.md` prints nothing.
- [ ] T036 [P] Remove council entries from the hub catalog and playbook (`$S/manual-testing-playbook/`). Verify: `rg -l -i 'ai[-_ ]council' $S/feature-catalog $S/manual-testing-playbook` prints nothing.
- [ ] T037 [P] Remove the council rollout key and the council mode from the shared benchmark contract (`$S/shared/`). Verify: `rg -n 'deep-ai-council|deep/ai-council' $S/shared -g '!**/node_modules/**'` prints nothing and `node --test $S/shared/behavior-benchmark/tests/behavior-bench-run.test.cjs` exits 0.
- [ ] T038 [P] Replace the council sibling lines in research and review prose (`$S/deep-research/README.md`). Verify: `rg -n 'deep-ai-council' $S/deep-research $S/deep-review -g '!**/changelog/**'` prints nothing.

### Runtime (D4)
- [ ] T039 Delete the seven council files the pivot does not read and rewrite the folder readme (`$R/lib/council/`). Verify: `ls $R/lib/council` prints `README.md` and `multi-seat-dispatch.cjs` only, and `rg -l "council/(adjudicator-verdict-scoring|convergence|cost-guards|round-state-jsonl|session-state-hierarchy|council-graph-db|council-graph-query)" .skilled .opencode -g '!**/node_modules/**' -g '!**/changelog/**' -g '!**/benchmark/**'` prints nothing.
- [ ] T040 Delete the three council ledger, reducer and sealed-artifact libraries and the legacy contract (`$R/lib/`). Verify: `rg -l 'deep-ai-council-(ledger-schema|reducers|sealed-artifacts|config-state-contract)' .skilled -g '!**/node_modules/**' -g '!**/changelog/**'` prints nothing.
- [ ] T041 Remove the council branch and the `council` loop type (`$R/scripts/convergence.cjs`). Verify: `node $R/scripts/convergence.cjs --spec-folder $P --session-id probe --loop-type council` prints an `INPUT_VALIDATION` error that starts `loopType must be` and does not name `council`.
- [ ] T042 [P] Remove the council paths (`$R/scripts/upsert.cjs`). Verify: `rg -n -i 'council' $R/scripts/upsert.cjs` prints nothing.
- [ ] T043 [P] Remove the council paths (`$R/scripts/query.cjs`). Verify: `rg -n -i 'council' $R/scripts/query.cjs` prints nothing.
- [ ] T044 [P] Remove the council paths (`$R/scripts/status.cjs`). Verify: `rg -n -i 'council' $R/scripts/status.cjs` prints nothing.
- [ ] T045 Remove the council mode cases from the append gateway (`$R/scripts/append-mode-event.cjs`). Verify: `rg -n 'ai-council|deep-council' $R/scripts/append-mode-event.cjs $R/lib/mode-append-gateway` prints nothing.
- [ ] T046 [P] Remove the council member (`$R/lib/blinded-adjudication/mode-adapters.ts`). Verify: `rg -n -i 'council' $R/lib/blinded-adjudication` prints nothing.
- [ ] T047 [P] Remove the council node and the research-council edge (`$R/lib/write-set-conflict-graph/`). Verify: `rg -n -i 'council' $R/lib/write-set-conflict-graph` prints nothing.
- [ ] T048 [P] Remove the council resources (`$R/lib/locks-and-fencing/protected-resource-registry.ts`). Verify: `rg -n -i 'council' $R/lib/locks-and-fencing` prints nothing.
- [ ] T049 [P] Remove the council profile (`$R/lib/path-coverage-termination/`). Verify: `rg -n -i 'council' $R/lib/path-coverage-termination` prints nothing.
- [ ] T050 [P] Remove the council clock profile (`$R/lib/stopping-clocks/stopping-clock-profiles.ts`). Verify: `rg -n -i 'council' $R/lib/stopping-clocks` prints nothing.
- [ ] T051 [P] Remove the council member (`$R/lib/per-mode-authority-flip/types.ts`). Verify: `rg -n -i 'council' $R/lib/per-mode-authority-flip` prints nothing.
- [ ] T052 [P] Remove the council member (`$R/lib/authorized-ledger/dark-ledger-adapter.ts`). Verify: `rg -n -i 'council' $R/lib/authorized-ledger` prints nothing.
- [ ] T053 [P] Remove the council entries (`$R/lib/legacy-projections/legacy-projection-manifest.ts`). Verify: `rg -n -i 'council' $R/lib/legacy-projections` prints nothing.
- [ ] T054 Delete the tests of removed code and drop council cases from shared tests (`$R/tests/`). Verify: `ls $R/tests/council` prints `multi-seat-dispatch.vitest.ts` only, and `rg -l 'deep-ai-council|council-graph|loopType.*council' $R/tests` prints nothing.
- [ ] T055 [P] Remove the council catalog and playbook folders and their index rows (`$R/feature-catalog/`). Verify: `ls $R/feature-catalog/council $R/manual-testing-playbook/council` lists only multi-seat dispatch entries.
- [ ] T056 Remove the council scope from the doctor workflow and its presentation (`$C/doctor/assets/doctor-deep-loop.yaml`). Verify: `rg -n -i 'council' $C/doctor/assets/doctor-deep-loop.yaml $C/doctor/assets/doctor-deep-loop-presentation.txt` prints nothing.

### Advisor
- [ ] T057 Remove the `deep-ai-council` alias group and canonical map entry (`$A/lib/scorer/aliases.ts`). Verify: `rg -n 'ai-council' $A/lib/scorer/aliases.ts` prints nothing.
- [ ] T058 [P] Remove the council anchors and phrases (`$A/lib/scorer/lanes/explicit.ts`). Verify: `rg -n -i 'council' $A/lib/scorer/lanes/explicit.ts $A/lib/scorer/lanes/lexical.ts $A/lib/scorer/fusion.ts` prints nothing.
- [ ] T059 [P] Remove the `command-deep-ai-council` projection (`$A/lib/scorer/projection.ts`). Verify: `rg -n 'ai-council' $A/lib/scorer/projection.ts` prints nothing.
- [ ] T060 Remove the `/deep:ai-council` tracked row by hand, and leave the `GENERATED MODE COMMANDS` block to the bridge generator in T063 (`$A/lib/command-attach.ts`). Verify: after T063, `rg -n '/deep:ai-council' $A/lib/command-attach.ts` prints nothing.
- [ ] T061 Remove the council from the Python router, bridges, lexical order and disambiguation text (`$A/scripts/skill_advisor.py`). Verify: `rg -n 'deep-ai-council|/deep:ai-council|ai-council mode' $A/scripts/skill_advisor.py` prints nothing.
- [ ] T062 Delete the council parity test and drop council rows from fixtures and corpora (`$A/tests/routing-parity-deep-council.vitest.ts`). Verify: `rg -l 'deep-ai-council|/deep:ai-council' $A/tests $A/scripts/routing-accuracy` prints nothing.
- [ ] T063 Regenerate the command bridges, the generated block in `command-attach.ts` and the skill graph (`$A/scripts/command-bridges/derive-command-bridges.cjs`). Verify: `rg -c 'deep-ai-council' $A/scripts/command-bridges/command-bridges.generated.json $A/scripts/skill-graph.json` prints 0 for both.
- [ ] T064 Recapture the routing corpus baseline at unchanged thresholds when the pins changed (`.github/workflows/routing-registry-drift.yml`). Verify: the corpus scoring step of that workflow, run locally, exits 0 at the unchanged floors and `goal.md` logs each metric delta.

### Other callers
- [ ] T065 [P] Replace the `/deep:ai-council` resume phrase with `/speckit:ai-council` under option B, or remove it under option A (`.skilled/skills/system-spec-kit/shared/gate-3-classifier.ts`). Verify: `rg -n '/deep:ai-council' .skilled/skills/system-spec-kit/shared/gate-3-classifier.ts` prints nothing and `node --test .skilled/skills/system-spec-kit/runtime/tests/hooks/gate-3-menu-parity.test.mjs` exits 0.
- [ ] T066 [P] Reword the dispatch guard comment (`.skilled/hooks/task-dispatch/lib/dispatch-guard.cjs`). Verify: `rg -n '/deep:ai-council' .skilled/hooks` prints nothing.
- [ ] T067 [P] Drop the council mode from the plugin guard fixtures and keep the non-loop agent case (`.opencode/plugins/tests/system-deep-loop-guard.test.cjs`). Verify: `node --test .opencode/plugins/tests/system-deep-loop-guard.test.cjs` exits 0.
- [ ] T068 Delete the spec-kit tests of removed packet scripts and the matrix script, and keep `multi-ai-council-validator.vitest.ts` (`$K/tests/`). Verify: `rg -l 'deep-ai-council/scripts' .skilled/skills/system-spec-kit/runtime` prints nothing and `ls $K/tests/multi-ai-council-validator.vitest.ts` prints the path.
- [ ] T069 [P] Replace council command and mode references in live CLI docs (`.skilled/skills/cli-external-orchestration/`). Verify: `rg -l '/deep:ai-council|deep-ai-council' .skilled/skills/cli-external-orchestration -g '!**/changelog/**' -g '!**/benchmark/**'` prints nothing.
- [ ] T070 [P] Update the agent template, command contract, benchmark templates and allowlists (`.skilled/skills/sk-doc/`). Verify: `rg -l '/deep:ai-council|deep-ai-council' .skilled/skills/sk-doc -g '!**/benchmark/**' -g '!**/cite-drift-redirects.json'` prints nothing.
- [ ] T071 [P] Update the prompt card (`.skilled/skills/sk-prompt/assets/cli-prompt-quality-card.md`). Verify: `rg -n 'deep-ai-council|/deep:ai-council' .skilled/skills/sk-prompt/assets/cli-prompt-quality-card.md` prints nothing.
- [ ] T072 [P] Update the crosswalk, compiled-routing canaries and permission fixture (`.skilled/bin/`). Verify: `rg -l 'deep-ai-council|/deep:ai-council' .skilled/bin` prints nothing.
- [ ] T073 [P] Update live CI path filters and keep ignore paths into archived specs (`.github/workflows/`). Verify: `rg -n 'deep-ai-council' .github` prints only lines listed in `scratch/exceptions.md`.
- [ ] T074 [P] Remove the two council variables (`.env.example`). Verify: `rg -n 'COUNCIL' .env.example` prints nothing.
- [ ] T075 [P] Describe the council as an agent and drop the deep command (`README.md`). Verify: `rg -n '/deep:ai-council' README.md` prints nothing.
- [ ] T076 [P] Update the skill index, loop-guard readme, command readmes and doctor scenarios (`.skilled/skills/README.txt`). Verify: `rg -l 'deep-ai-council|/deep:ai-council' .skilled/skills/README.txt .skilled/skills/.state/loop-guard/README.md $C/README.txt $C/create $C/speckit/README.txt .skilled/manual-testing-playbook` prints nothing.
- [ ] T077 Regenerate the trigger index and its sidecar fixtures (`$K/retrieval/generate-trigger-index.mjs`). Verify: `rg -c 'deep-ai-council/' .skilled/skills/system-spec-kit/runtime/data/trigger-index.json` prints 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T078 Run the per-hub gate with the hub path (`$S/mode-registry.json`). Verify: `node .skilled/commands/doctor/scripts/parent-skill-check.cjs $S` prints `INFO: Parent skill: .skilled/skills/system-deep-loop`, `declares 2 modes` and `OK: parent-skill-check`.
- [ ] T079 Replay stage one for the council prompt (`$A/scripts/skill_advisor.py`). Verify: `python3 $A/scripts/skill_advisor.py "$Q" --threshold 0.5 | rg -c '"mode": "(ai-council|research|review)"'` prints 0.
- [ ] T080 Replay stage two for the council prompt (`.skilled/bin/compiled-route.cjs`). Verify: `node .skilled/bin/compiled-route.cjs --hub system-deep-loop --prompt "$Q" | rg -c '"packetId":"deep-(ai-council|research|review)"'` prints 0.
- [ ] T081 Replay both stages for one research and one review prompt (`.skilled/bin/compiled-route.cjs`). Verify: "run a deep research loop on vector index tuning" yields mode `research` and `packetId` `deep-research`, and "deep review this branch for release readiness" yields mode `review` and `packetId` `deep-review`, in both tools.
- [ ] T082 Run the divergent pivot tests (`$R/tests/integration/divergent-pivot.vitest.ts`). Verify: `cd $R && npx vitest run tests/integration/divergent-pivot.vitest.ts tests/council/multi-seat-dispatch.vitest.ts` exits 0.
- [ ] T083 Run the runtime suite and typecheck (`$R/package.json`). Verify: `cd $R && npm test && npm run typecheck` exits 0, or matches `scratch/gate-baseline.md` with the delta logged.
- [ ] T084 Run the advisor suite, typecheck and drift guard (`$A/package.json`). Verify: `cd $A && npm test && npm run typecheck` exits 0, or matches the baseline, and `npx vitest run tests/routing-registry-drift-guard.vitest.ts` exits 0.
- [ ] T085 Run every mirror checker the runtime-mirrors doctor lists (`$C/doctor/assets/doctor-runtime-mirrors.yaml`). Verify: each checker in its `upstream_assets` block exits 0 in check mode.
- [ ] T086 Run the vocabulary sweep (`$P/scratch/exceptions.md`). Verify: `rg -l --hidden -i 'deep-ai-council|deep_ai_council|/deep:ai-council|deep-council|DeepAiCouncil|planning council|council deliberation|multi-seat planning' -g '!specs/**' -g '!**/node_modules/**' -g '!.git/**' .` prints only paths in `scratch/exceptions.md` and lines that name the standalone agent.
- [ ] T087 Prove no spec-folder council artifact changed (`specs/`). Verify: `git diff --name-only <start-sha> -- 'specs/**/ai-council/**'` prints nothing.
- [ ] T088 Rerun every gate in `scratch/gate-baseline.md` and record the final column (`$P/scratch/gate-baseline.md`). Verify: no gate ends worse than its baseline.
- [ ] T089 Validate this phase folder (`$P/spec.md`). Verify: `bash $K/spec/validate.sh $P --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `scratch/gate-baseline.md` holds a start and a final column for every gate, and no final value is worse than its start value
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Goal**: See `goal.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A task stays `[B]` while phase 004 or 005 is not Complete or while the D3 answer is missing. A `[B]` task blocks close. Under option A, T013 to T017 are marked done with the note "not applicable, option A" in `goal.md`.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] `rg -c '^\| REQ-' spec.md` prints 17.
- [ ] CHK-002 [P0] `rg -c '^## 4. IMPLEMENTATION PHASES' plan.md` prints 1.
- [ ] CHK-003 [P1] `rg -n '^D3 decision: option [AB]$' goal.md` prints 1 line.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `node --check .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` and `node --check .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs` exit 0.
- [ ] CHK-011 [P0] `cd .skilled/skills/system-deep-loop/runtime && npm run typecheck` exits 0.
- [ ] CHK-012 [P1] `cd .skilled/skills/system-skill-advisor/runtime && npm run typecheck` exits 0.
- [ ] CHK-013 [P1] `python3 -m py_compile .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` exits 0.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/system-deep-loop` ends with `OK: parent-skill-check` and prints `declares 2 modes`.
- [ ] CHK-021 [P0] T079 and T080 print 0 for the council prompt.
- [ ] CHK-022 [P0] `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/integration/divergent-pivot.vitest.ts tests/council/multi-seat-dispatch.vitest.ts` exits 0.
- [ ] CHK-023 [P1] T081 routes the research and review prompts to their modes in both stages.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] `goal.md` names the finding class: cross-consumer, because one mode removal reaches the hub, the runtime, the advisor and other skills.
- [ ] CHK-FIX-002 [P0] The inventory is rerun at T003 and the vocabulary sweep at T086 prints only allowlisted paths.
- [ ] CHK-FIX-003 [P0] Every removed runtime file has its caller check in T039 to T045, and each prints nothing.
- [ ] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction logic changes. The `pathContainsAiCouncil` guard stays as it is.
- [ ] CHK-FIX-005 [P1] The D3 axis has two rows, A and B, and the task list states which tasks each row runs.
- [ ] CHK-FIX-006 [P1] The T041 convergence probe is run again with `DEEP_LOOP_COUNCIL_DB_DIR` set, and still prints the same input error.
- [ ] CHK-FIX-007 [P1] `goal.md` pins the evidence to the fix commit SHA.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] `rg -n '^  bash:' .skilled/agents/ai-council.md` prints `  bash: deny`.
- [ ] CHK-031 [P0] `rg -n 'ai-council/\*\*' .skilled/agents/ai-council.md` prints at least 1 line stating the write boundary.
- [ ] CHK-032 [P1] N/A: no auth surface changes.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `rg -o 'REQ-0[0-9]+' spec.md | sort -u` and `rg -o 'REQ-0[0-9]+' acceptance-criteria.md | sort -u` print the same ids.
- [ ] CHK-041 [P1] `rg -n 'deep-ai-council|/deep:ai-council' .skilled/skills/system-deep-loop/SKILL.md .skilled/skills/system-deep-loop/README.md .skilled/skills/system-deep-loop/ARCHITECTURE.md` prints nothing.
- [ ] CHK-042 [P2] `ls -t .skilled/skills/system-deep-loop/changelog | head -1` names a new hub entry that records the removal.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] `git status --porcelain` lists no new file outside the plan inventory, this folder and `scratch/`.
- [ ] CHK-051 [P1] `ls scratch/` lists only the inventory files, `gate-baseline.md`, `exceptions.md` and `.gitkeep` before close.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 0/13 |
| P1 Items | 12 | 0/12 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->

---
