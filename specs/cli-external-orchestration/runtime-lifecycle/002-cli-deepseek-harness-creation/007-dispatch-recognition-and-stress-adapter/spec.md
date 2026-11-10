---
title: "Feature Specification: Phase 7: dispatch-recognition-and-stress-adapter"
description: "The dispatch-audit hook does not recognize a dsh task, so a dsh dispatch skips preflight and the packet's hard rules, and the stress adapter matrix has no dsh subject. This phase teaches the hook dsh task shapes and rule checks and adds a dsh shim and stress suite."
trigger_phrases:
  - "dispatch recognition and stress adapter"
  - "phase 7 dispatch recognition and stress adapter"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 7: dispatch-recognition-and-stress-adapter

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-11-05 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 15 |
| **Predecessor** | 006-deep-loop-executor-kind |
| **Successor** | 008-dsh-repo-guards-safety-wave |
| **Handoff Criteria** | The dispatch-audit suite passes under Vitest, the rule-check suite passes under `node --test`, the dsh stress suite passes and the Pi and Hermes suites pass unchanged |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the DeepSeek Harness (dsh) as a cli-external-orchestration runtime mode mirroring cli-pi specification.

**Scope Boundary**: Teach the dispatch-audit hook to recognize dsh task shapes and check the packet's hard rules. Add dsh to the stress adapter matrix through a shim. No executor config, guard plugin, hub or command YAML changes here. No live dsh run is included.

**Dependencies**:
- `003-cli-deepseek-harness-skill-packet` for `hard-rules.json`, whose rule ids the rule checks enforce
- `006-deep-loop-executor-kind` for the kind and builder the stress suite drives

**Deliverables**:
- `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` and `dispatch-audit.test.mjs`
- `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` and `dispatch-rule-checks.test.mjs`
- Under `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/`: `matrix-manifest.ts`, `fixtures/adapter-fixture.ts`, `fixtures/adapter-suite.ts`, `shims/adapter-shim-core.cjs`, new `shims/dsh-shim.cjs`, new `cli-deepseek-harness.vitest.ts`, `shims/README.md` and `README.md`
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
The dispatch-audit hook matches task shapes per binary and has no `dsh` shape, so a dsh dispatch runs with no preflight and none of the packet's hard rules checked. The stress adapter matrix has shims for seven runtimes and none for dsh, so the new kind would ship with no adapter coverage and nothing would flag the gap.

### Purpose
Every dsh task dispatch is recognized and checked against the packet's hard rules. The stress matrix exercises the kind through a shim.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ rg -c '\bdsh\b' .skilled/hooks/dispatch/lib/dispatch-audit.mjs .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs; echo "exit $?"
exit 1

$ ls .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/shims
adapter-shim-core.cjs
claude-code-shim.cjs
codex-shim.cjs
cursor-shim.cjs
devin-shim.cjs
hermes-shim.cjs
opencode-shim.cjs
pi-shim.cjs
README.md
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Match `dsh (--profile )?headless` task shapes with a task or `-`. Include env-wrapped and shell-wrapped forms. Skip `dsh plugin`, `--dump-*` and `--help`.
- Check all twelve hard-rule entries declared in `hard-rules.json`, including a missing `-`, a missing `--approval-policy never`, missing route and guards patches and repo-root cwd.
- Add `shims/dsh-shim.cjs` that emulates completed, error, denial, timeout, stdin and lineage-write behavior, extending `adapter-shim-core.cjs` only where the core cannot express the JSON event and exit shape.
- Register the dsh subject in the matrix manifest, adapter fixture and adapter suite. Add `cli-deepseek-harness.vitest.ts`.
- List the shim and the subject in both stress READMEs.

### Out of Scope
- The executor kind, builder and env allowlist - phase 006 owns them
- The live-contract row in `live-contracts.json` - phase 013 adds it after a keyed run
- Guard plugin adapters such as `dispatch-preflight-lint` - phase 008 owns them

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` | Modify | Recognize dsh task shapes |
| `.skilled/hooks/dispatch/lib/dispatch-audit.test.mjs` | Modify | Positive and negative dsh cases |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` | Modify | Check the dsh hard rules |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | Modify | Cases for each flagged rule |
| `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/matrix-manifest.ts` | Modify | Add the subject |
| `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fixtures/adapter-fixture.ts` | Modify | Binary, shim, model and mode lookup |
| `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fixtures/adapter-suite.ts` | Modify | Register the shim suite |
| `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/shims/adapter-shim-core.cjs` | Modify | JSON event and exit emulation, only if the core cannot express it |
| `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/shims/dsh-shim.cjs` | Create | The dsh shim |
| `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/cli-deepseek-harness.vitest.ts` | Create | Per-runtime stress suite |
| `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/shims/README.md` | Modify | List the shim |
| `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/README.md` | Modify | Subject and live-smoke limits |
| `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/cli-codex.vitest.ts` | Modify | Update the subject and matrix counts for the added dsh adapter |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `.skilled/node_modules/.bin/vitest run .skilled/hooks/dispatch/lib/dispatch-audit.test.mjs` passes positive cases for `dsh headless -`, `dsh --profile headless --json -`, env-wrapped calls and shell-wrapped calls. It also passes negative cases for `dsh plugin --profile x add y`, `--help`, `-h`, `-V`, `--version`, `--dump-config`, `--dump-default-config` and `--dump-config-schema` |
| REQ-002 | `node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` passes all twelve checks declared in `hard-rules.json`, including cases that flag a missing `-`, a missing `--approval-policy never`, a missing route patch and a repo-root cwd |
| REQ-003 | The runtime's vitest run of `tests/stress/cli-adapter/cli-deepseek-harness.vitest.ts` passes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | `cli-pi.vitest.ts` and `cli-hermes.vitest.ts` still pass. `git diff --exit-code` on both files shows them unchanged |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: The dispatch-audit suite passes under Vitest and the rule-check suite reports zero failures under `node --test`. Both cover the dsh positive and negative cases.
- **SC-002**: `rg -n 'cli-deepseek-harness'` on `matrix-manifest.ts` prints a subject line and the dsh suite passes beside the unchanged Pi and Hermes suites.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 003 `hard-rules.json` and phase 006 builder | Rule checks and the stress suite have nothing to assert against | Start only after both exist and cite rule ids from `hard-rules.json` |
| Risk | The regex over-matches `dsh plugin` or `--dump-config` | Medium. Admin commands may be blocked or audited as tasks | Negative test cases for each, written before the regex |
| Risk | The regex misses env-wrapped or shell-wrapped calls | Medium. Those dispatches skip preflight | Positive cases for `VAR=x dsh ...` and `bash -c 'dsh ...'` forms |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The dsh match adds no new pass over the command string beyond the existing per-binary match.
- **NFR-P02**: N/A: the shim runs only in tests, so throughput does not apply.

### Security
- **NFR-S01**: The shim never spawns the real `dsh` and never reads a provider key.
- **NFR-S02**: A dsh dispatch with a repo-root cwd is flagged, so a repo-root `.env` cannot load.

### Reliability
- **NFR-R01**: Existing runtime cases in both hook tests keep passing unchanged.
- **NFR-R02**: The dsh stress suite is deterministic: two runs give the same pass count.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: a bare `dsh` with no subcommand or task is not a task dispatch and is not matched.
- Maximum input: a long env-wrapped, shell-wrapped command with every patch flag still matches once.
- Failure path: a matched dsh task that breaks a hard rule is flagged with the rule id from `hard-rules.json`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 13 files across two systems (dispatch hooks, deep-loop stress tests) |
| Risk | 10/25 | Regex matching on a shared hook, guarded by negative tests |
| Research | 3/20 | Match shape settled in phase 001 |
| **Total** | **27/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Can `adapter-shim-core.cjs` already express a JSON `final` event with a separate exit code? Decision: read it first and change it only if it cannot.
<!-- /ANCHOR:questions -->

---
