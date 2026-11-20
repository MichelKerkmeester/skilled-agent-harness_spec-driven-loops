---
title: "Feature Specification: Phase 4: v2-review-p2-fixes"
description: "The third deep review of the OpenCode v1 removal passed with eight P2 advisories. This phase fixes all eight: the opencode2 vocabulary, the battery server bind, the unmapped hook signal, CI coverage of remove-v1, parser parity breadth, the dualPlugin name and two stale evidence lines in phase 001."
trigger_phrases:
  - "v2 review p2 fixes"
  - "phase 4 v2 review p2 fixes"
  - "definePlugin rename"
  - "opencode2 retired"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 4: v2-review-p2-fixes

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-20 |
| **Branch** | `worktrees/482-opencode-v2-p2-fixes` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 4 |
| **Predecessor** | 003-v1-docs-and-playbooks-sweep |
| **Successor** | None |
| **Handoff Criteria** | Every row of `acceptance-criteria.md` is Met, and `validate.sh` on the parent with `--recursive --strict` prints `RESULT: PASSED` for every folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the OpenCode v1 removal. Phases 001 to 003 are complete, and the third deep review (`../review/review-report.md`) returned PASS with eight P2 advisories.

**Scope Boundary**: the eight advisories in `../review/review-report.md` §3, and the files each one names. Nothing else in the removal is reopened.

**Dependencies**:
- OpenCode 2.3.2 installed locally, for the `serve --help` check and the live battery leg
- The operator's Q005 answer in `../decision-record.md`, which settles the `opencode2` names

**Deliverables**:
- Code and test fixes for the six runtime, test and CI advisories
- Corrected evidence in phase 001 for the two packet-evidence advisories
- An ADR recording the `opencode2` decision
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The review left eight P2 advisories open on the merged removal. Tests still present `opencode2` as a v2 launcher name that the version probe no longer trusts, the battery's private server binds wherever `serve` defaults, the one `remove-v1` end-to-end test runs in no workflow, a parity test checks a narrower set than its corpus, the plugin builder keeps its dual-era name, and two phase 001 evidence lines cannot be read or reproduced as written.

### Purpose
Each advisory is fixed or shown already covered, with a command that proves it, and the gate shows no regression against the baseline taken before the first edit.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ git grep -c "dualPlugin" -- ":!specs" | wc -l
33
$ git grep -n "opencode2?" -- .skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/opencode-models-form.test.cjs | wc -l
7
$ grep -n "'serve', '--port'" .skilled/commands/doctor/scripts/opencode-version-battery.cjs
976:    child = spawn(bin, ['serve', '--port', String(port)], {
$ grep -c "opencode-setup-classify" .github/workflows/opencode-v2-battery.yml
0
$ grep -n "for (const output of VERSION_OUTPUTS)" .skilled/skills/system-deep-loop/runtime/tests/unit/opencode-dual-dispatch.vitest.ts
527:    for (const output of VERSION_OUTPUTS) {
$ node -e "console.log(require(\"./.skilled/hooks/cli-dispatch/lib/opencode-version-corpus.json\").length)"
13
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Retire `opencode2` as a v2 launcher name in tests and live docs, and keep the dispatch guards' `opencode<digits>` breadth with tests that no longer call it the v2 launcher
- Pin the battery's private server to loopback with the `--hostname` flag that `opencode serve --help` prints
- Rename `dualPlugin` to `definePlugin` across every tracked caller, with no alias, and make the bridged-plugin count a test assertion
- Add `opencode-setup-classify.test.cjs` to the battery workflow's unit step after a hermetic run of that exact command
- Run the ESM and CJS parser parity case over the corpus plus the hand-written outputs
- Correct the phase 001 event-capture header and the CHK-041 proof command

### Out of Scope
- Narrowing the `opencode\d*` dispatch-recognition patterns - they keep a renamed launcher from passing unaudited, so narrowing them would open a bypass
- Changelogs, dated benchmark reports and generated index or fixture JSON that name `opencode2` - they record history or are regenerated, not hand-edited
- The `opencode2` and `opencode1` names in the `opencode-setup.sh` launcher listing - that listing finds leftover launchers so `remove-v1` can report them

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/opencode-models-form.test.cjs` | Modify | Scan only `opencode models`; fixtures use `opencode` |
| `.opencode/plugins/tests/system-dist-freshness-guard.test.cjs` | Modify | Breadth case uses a numbered launcher, not the v2 name |
| `.skilled/hooks/cli-dispatch/lib/dispatch-audit.test.mjs` | Modify | Breadth row names a numbered launcher |
| `.skilled/hooks/cli-dispatch/pi/dispatch-preflight-lint.ts`, `.test.ts` | Modify | Comment and cases drop the v2-launcher spelling |
| `.skilled/commands/doctor/scripts/opencode-version-battery.cjs`, `tests/opencode-version-battery.test.cjs` | Modify | `--hostname 127.0.0.1` on `serve`, asserted by the fake server |
| `.opencode/plugins/lib/v2-bridge.js` and the 20 plugin entry files | Modify | `dualPlugin` becomes `definePlugin` |
| `.opencode/plugins/tests/*`, `.opencode/plugins/ARCHITECTURE.md`, `README.md`, `tests/README.md` | Modify | Rename callers and docs; inventory test asserts the bridged count |
| `.skilled/commands/doctor/scripts/git-setup-check.cjs`, `tests/git-setup-check.test.cjs` | Modify | Recognize the renamed export |
| `.skilled/skills/cli-external-orchestration/cli-opencode/references/agent-delegation.md`, `cli-reference.md`, sk-code security reference, spec-kit playbook | Modify | Rename in docs |
| `.github/workflows/opencode-v2-battery.yml` | Modify | Unit step runs the classify test |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/opencode-dual-dispatch.vitest.ts` | Modify | Parity over corpus plus hand-written outputs |
| `../001-v1-runtime-code-and-tests/scratch/event-capture.txt`, `../001-v1-runtime-code-and-tests/tasks.md` | Modify | Header and proof command corrected |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No test or live doc presents `opencode2` as a v2 launcher name, and the version probe still trusts only `opencode`, a path ending `/opencode` and `$OPENCODE_BIN`. |
| REQ-002 | The battery spawns `serve` with `--hostname 127.0.0.1`, the flag `opencode serve --help` prints, and its test asserts the flag. |
| REQ-003 | The plugin builder is `definePlugin`, no tracked file outside `specs/` names `dualPlugin`, and the hidden `factory` property still works. |
| REQ-004 | The node, vitest and Vibe gate shows no new failure against the pre-edit baseline. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | A plugin that registers a hook key outside the mapped set fails a CI test, and that test cannot pass with zero bridged plugins. |
| REQ-006 | The battery workflow's unit step runs `opencode-setup-classify.test.cjs`, and the exact step command passes with no `opencode` on PATH, a temporary HOME and an unreachable npm registry. |
| REQ-007 | The parser parity case runs over every corpus output plus the hand-written outputs. |
| REQ-008 | Phase 001's event-capture header describes both its static and live parts, and CHK-041's proof command reproduces its recorded result. |
| REQ-009 | The `opencode2` decision is recorded as an ADR citing Q005. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `git grep -c dualPlugin -- ':!specs' | wc -l` prints 0, and the plugin suites report 0 failures.
- **SC-002**: the gate rerun from the final tree reports the same or fewer failures than the baseline, for every leg.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | OpenCode 2.3.2 `serve` accepting `--hostname` | The battery's v2 leg fails to start | Run the real v2 battery leg once and save its output |
| Risk | The inventory test classifies a plugin as bridged by the builder's name | A rename leaves it checking zero plugins and passing | Rename the classifier with the builder and assert the bridged count |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A. The changes add no work on a hot path.

### Security
- **NFR-S01**: the battery's private server listens on 127.0.0.1 only.
- **NFR-S02**: the dispatch guards still recognize every `opencode<digits> run`.

### Reliability
- **NFR-R01**: no plugin logs to the console or throws at setup, because console output corrupts `opencode run --format json`.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a plugin with no unmapped hooks reports an empty `skippedKeys`, which is the expected state for all of them.
- Maximum input: the parity case covers all 13 corpus outputs plus the hand-written ones.
- Failure path: a `serve` that rejects `--hostname` never prints the listening line, so the battery reports "no listening line" instead of passing.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | About 45 files, mostly a mechanical rename |
| Risk | 6/25 | A guard test that could go vacuous, and a server flag |
| Research | 4/20 | One `--help` read and one hermetic run |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. Q005 settles the `opencode2` names, and `serve --help` settles the host flag.
<!-- /ANCHOR:questions -->
