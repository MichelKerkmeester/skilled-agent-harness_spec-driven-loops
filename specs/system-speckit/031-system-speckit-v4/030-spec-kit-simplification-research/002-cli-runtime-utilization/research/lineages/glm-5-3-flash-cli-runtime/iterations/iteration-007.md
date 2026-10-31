---
title: "Iteration 7: The Delivery Surface — codex/, pi/, runtime-mirrors/, setup/, ops/"
trigger_phrases: []
---
# Iteration 7: The Delivery Surface — codex/, pi/, runtime-mirrors/, setup/, ops/

## Focus

Q5's first half: whether the codex/, pi/ and runtime-mirrors/ sync scripts (10 files, ~1790L) are actually invoked and by what; plus setup/ (6, 525L) and ops/ (7, 1347L) — the promised CI workflows, the doctor route, and who (if anyone) exercises the package's own test, typecheck and gate layers.

## Actions Taken

1. Read the three promised workflows' actual run blocks (agent-mirror-sync.yml:15-40, prompt-card-sync.yml:13-24, rule-canary-sync.yml:15-28) — expecting these to be the mirrors' callers.
2. Ran the caller search for all 7 mirror/sync scripts across .opencode + .github; then read the doctor route (commands/doctor/_routes.yaml:169-199) and its target (doctor/assets/doctor-runtime-mirrors.yaml:34-40,141) — the execution lines.
3. Read the doctor checkers' own mirror-logic (agent-roster-mirror-check.cjs:255-263 and its symlink/generated comments); inventoried the trigger_phrases that summon the route.
4. Searched callers for the 5 setup/ residuals and 6 ops/ modules; read ops/README.md:15-37 (the self-declared stub status); wc -l'd everything.
5. Inventoried which of the 12 workflows touch this package at all, and what they execute (working-directory sensitivity: routing-registry-drift's four vitest runs all sit in system-skill-advisor/mcp-server:83,163,175,192).

## Findings

1. Two parallel mirror-drift guardians with disjoint coverage — (a) CI: agent-mirror-sync.yml:15-24 runs the DEEP-LOOP's checker (.opencode/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs — "fail closed in CI") over .opencode|claude|codex/agents/: agents, 3 of the 5 runtime surfaces, NOT prompts, NOT pi, and no connection to these 7 scripts; (b) AI-invoked doctor: commands/doctor/_routes.yaml:169-182 (route target `runtime-mirrors`; trigger phrases "runtime mirror drift", "agent command mirror parity", "command catalog drift", "cursor devin codex sync check", "discovery mirror out of sync") → doctor/assets/doctor-runtime-mirrors.yaml:34-40,141 maps and runs --check on FIVE surfaces: runtime-mirrors/sync-runtime-mirrors.cjs, codex/sync-agents.cjs, codex/sync-prompts.cjs, pi/sync-agents-pi.cjs, pi/sync-prompts-pi.cjs — PLUS two more doctor-side checkers (agent-roster-mirror-check.cjs, command-catalog-mirror-check.cjs) and .opencode/bin/install-codex-hooks.mjs --check. So prompts/pi/claude drift is CI-INVISIBLE: it surfaces only when the AI remembers the doctor route. Neither guardian references the other. One residual: codex/generate-command-routers.cjs is the one sync-family script with no --check line in the doctor route (referenced via the commands-level checker: seen by filename, execution: caller-not-verified). Severity P1. Recommendation: merge — one guardian, full 5-surface + prompts coverage, CI-wired (or, minimum, doctor's five --check lines promoted into the CI workflow).

2. ops/ is a dispatcher for two admitted stubs — ops/README.md:15-37, self-declared: "neither heal-*.sh script currently completes a detect/repair/verify cycle: heal-session-ambiguity.sh is a deprecated stub that logs a deprecation notice and exits before running any step, and heal-telemetry-drift.sh parses and validates its options but always reports that its verifier was removed and exits with an error. Both wait on a replacement remediation path." Observed: runbook.sh (147L) "still lists and dispatches to both registered failure classes" — 147L of dispatch machinery for 225L (118+107) of stubs; the ONLY production-wired ops module is process-sweep.ts (251L, called by .opencode/plugins/session-cleanup.js — the session-cleanup PLUGIN, real); process-memory-harness.ts (589L) is test-pinned (tests/process-memory-harness.vitest.ts + 1 fixture string); runbook.sh's other reference: a templates/EXAMPLE (documentation). So ops/ = 1 working harness + 1 test-pinned harness + 372L of self-acknowledged stub theater. Severity P1. Recommendation: merge — collapse runbook+heal-*+their two registrations until the promised remediation paths exist (or, if the 005-simplification packet adopts it, fix the paths and keep the structure).

3. The package's own test, typecheck and gate layers have ZERO CI — the 12-workflow inventory yields exactly 5 that touch system-spec-kit: changed-packet-validation.yml (validate.sh), strict-pass-freshness-report.yml (repair-derived→backfill), command-tree-parity.yml (the parity script), markdown-link-integrity.yml (check-markdown-links.cjs), routing-registry-drift.yml (whose four vitest runs execute in .opencode/skills/system-skill-advisor/mcp-server:83,163,175,192 — the ADVISOR's tests, not this package's). No workflow runs this package's vitest (53k-LOC tests/), typecheck, npm test, or the 7-script check gate (package.json:24). ARCHITECTURE.md:100's "Reverse imports are blocked by lint and CI" — the lint half: also no workflow found; whether any shielded import would ever be CAUGHT mechanically: caller-not-checked (the checks exist; nobody automated runs them — the evals/ verdict lands in iteration 8). Severity P1. Recommendation: fix — wire `npm test` and `npm run check` (or their cheap subset) into one workflow; otherwise the 53k-LOC tests/ is documentation.

4. setup/ residuals: wired, promised, and one strand — check-prerequisites.sh: 6 command YAMLs (iteration 2, STRONG); record-node-version.js: wired via the PARENT package (.opencode/skills/system-spec-kit/package.json — the one cross-package production caller); check-native-modules.sh + rebuild-native-modules.sh: documented-only (.env.example, feature-catalog/tooling-and-scripts/setup-native-module-health-and-mcp-installation.md, 1 changelog — the playbook promises them, nothing invokes them); `_utils.sh`: uncited-by-content (grep for any sourcing mention of "_utils" across the setup scripts: EMPTY — no script references it; indirect-variable sourcing: caller-not-fully-verified). Severity P2. Recommendation: document the native-module pair's manual covenant; _utils.sh is a removal candidate.

## Positive Controls (verified, not findings)

- The mirrors' outputs EXIST: .codex/agents, .codex/prompts, .pi/agents, .pi/prompts are all present — the generators ran, and pi's README correctly anticipates the difference the doctor checker encodes ("Pi agents are generated real files (sync-agents-pi.cjs), not symlinks", agent-roster-mirror-check.cjs:39).
- The mirror-shape knowledge (which runtime symlinks vs which generates real files) is RE-ENCODED in the doctor checker's comments (:23-66) rather than derived from one policy — noted for the iteration-9 duplication ledger: FOUR heads know the mirror map (the 7 generators, runtime-mirrors/command-scope.cjs, this checker, and whatever validate-command-tree-parity.sh delegates to).
- The doctor route's discovery discipline: 5 trigger_phrases + fail-closed patterns copied from the good workflows (the _routes/doctor yamls) — the AI-invoked half of this package is the best-documented invocation surface in the audit so far.

## Questions Answered

- Q5 (first half): codex/, pi/, runtime-mirrors/ sync scripts — invoked by the DOCTOR route (--check, 5 surfaces, AI-invoked, _routes.yaml:169-182 + doctor-runtime-mirrors.yaml:34-40), NOT by any of the 3 workflows their names suggest; one residual (generate-command-routers.cjs) unverified; one parallel CI guardian covers agents-only×3.

## Questions Remaining

- Q5 (second half): the evals/ check gate — invocation: established NONE-FOUND in CI (this iteration, finding 3); the checks' own quality/coverage: iteration 8. Q1 residuals: evals/, observability/, kpi/, metrics/, optimizer/, resource-map/, sweep/. Q4 rollup. Q6: framing + ../lib + shared.

## What Worked / What Failed

- Worked: reading the promised workflows' run blocks instead of their names — all three promised guardians belong to OTHER subsystems; the real invocation surfaced one hopsine later in the doctor route.
- Worked: ops/README.md's honesty — the two stubs were self-declared with their mechanism ("logs a deprecation notice and exits"), which converted alixploration into a 2-minute verdict.
- Failed: none; no approach exhausted.

## Ruled Out

- "agent-mirror-sync/prompt-card-sync/rule-canary-sync.yml guard the codex/pi/mirrors" — they run the deep-loop, skill-advisor and sk-code checkers respectively; the name neighbors deceive.
- "ops/ is wholly inert" — process-sweep.ts runs from the session-cleanup plugin; only the heal-*/runbook trio stubs.

## Sources

[SOURCE: .github/workflows/agent-mirror-sync.yml:15-40] [SOURCE: .github/workflows/prompt-card-sync.yml:13-24] [SOURCE: .github/workflows/rule-canary-sync.yml:15-28] [SOURCE: .opencode/commands/doctor/_routes.yaml:169-199] [SOURCE: .opencode/commands/doctor/assets/doctor-runtime-mirrors.yaml:34-40,141] [SOURCE: .opencode/commands/doctor/scripts/agent-roster-mirror-check.cjs:23-66,255-263] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/ops/README.md:15-37] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/ops (wc -l: heal 118+107, runbook 147, ops-common 135, process-sweep 251, harness 589)] [SOURCE: .opencode/plugins/session-cleanup.js] [SOURCE: .opencode/skills/system-spec-kit/package.json (record-node-version)] [SOURCE: .github/workflows/routing-registry-drift.yml:83-192 (working-directory: system-skill-advisor/mcp-server)]

## Next Iteration

Iteration 8: the measurement belt — evals/ (12, 2725L), observability/ (7, 1903L), optimizer/ (7, 1960L), kpi/ (2, 100L), metrics/ (3, 189L), resource-map/ (2, 554L), sweep/ (2, 337L): what the 7 checks actually gate, whether the import-policy allowlist story holds against the evals' own assumptions, which of the six measurement directories anyone executes, and the third+fourth sweep.
