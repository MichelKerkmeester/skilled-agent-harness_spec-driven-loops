---
title: "Feature Specification: Phase 5: barter-parity"
description: "A project that vendors Skilled with its own overlay folder could not use /doctor:overlay: with no setting file status exited 2 on a missing manifest, and one token-named file aborted the whole report. This phase makes the engine report a protected file per entry, re-pin .dsh by default, list the upstream changes a re-pin leaves out, say what a stage skips, and documents and routes adoption, then moves Barter's vendored copy onto the engine."
trigger_phrases:
  - "barter parity"
  - "phase 5 barter parity"
  - "adopt the overlay engine"
  - "vendored overlay adoption"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 5: barter-parity

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-07 |
| **Branch** | `worktrees/324-overlay-repin-barter-parity` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 5 |
| **Predecessor** | 004-guard-hook |
| **Successor** | None |
| **Handoff Criteria** | Upstream `overlay-engine.cjs status --root barter/ai-speckit/skilled` prints `RESULT: PASSED`, the doctor suite shows no failure beyond the six recorded baseline failures, and a staged re-pin of Barter onto this branch's commit is clean |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the overlay build. Phases 001 to 004 built the skill, the engine, the re-pin and the guard hook against fixtures. This phase checks them against the one real vendoring project, Barter's `ai-speckit`, which runs its own fork of the engine.

**Scope Boundary**: the engine, its tests, the `/doctor:overlay` workflow and presentation assets, the doctor route phrases and the advisor bridge files derived from them, the overlays reference, the install presentation and root `README.md` §5. On Barter's side, only the three files the adoption needs.

**Dependencies**:
- A local Skilled checkout holding both commits a re-pin moves between.
- Barter's vendored tree at `barter/ai-speckit/skilled`, which git does not track yet.

**Deliverables**:
- Engine changes P1 to P5 with tests, and the doc and routing changes D1 to D6, from `research/research.md` §4 and §6.
- Barter adoption: a setting file, `protectedPaths` on one entry and a `repin` block.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Barter vendors Skilled with 130 overlays, and the upstream `/doctor:overlay` could not read them. With no `.skilled-overlays.json`, `status` looked in `skilled-overlays/` and exited 2 with a manifest error that never named the setting. With the setting, one token-named file inside a walked folder aborted the whole run. A re-pin would also have skipped `.dsh` and dropped upstream changes to root files without saying so, which is why Barter kept a forked engine and an eight-step hand runbook.

### Purpose
A vendoring project with its own overlay folder adopts the engine with one setting file and the fixes `status` names, and Barter's tree passes the upstream `status` with its fork still green.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Before any change, from `barter/ai-speckit`, with Skilled at `230d22ba88`:
```text
$ node ../../.skilled/commands/doctor/scripts/overlay-engine.cjs status --root skilled
[overlay-engine] no overlay manifest at skilled-overlays/overlay-manifest.json
exit 2

# with {"overlayDir":"barter-overlays"} added on a staged copy:
[overlay-engine] repo-frontend: refusing to inspect a protected path: barter-overlays/sk-code/sk-code-frontend/references/barter-design-tokens.md
exit 2

$ node skilled/barter-overlays/sync.cjs --status --root skilled
in-sync=468 overlay-edited=0 live-edited=0 both-changed=0 upstream-moved=0 fork-drifted=0
exit 0
$ node skilled/barter-overlays/replay.cjs --check --root skilled
checked=132 ok=132 miss=0 unit=entries+layout+generated
RESULT: PASSED
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Report a protected path as a block on its own entry, with the fix, instead of aborting every overlay's report.
- Add `.dsh` to the runtime folders a re-pin copies when the manifest names none.
- List the upstream changes a re-pin leaves out, and say how many regenerate and verify steps a stage skipped.
- Name the missing setting file when the default overlay folder has no manifest.
- Document and route adoption for a project that already has an overlay folder, and adopt the engine in Barter's tree.

### Out of Scope
- The `fork-drifted` state and `outsideCertificate` support - a large change through every state path, held for the operator.
- Regenerate and verify pairs in Barter's manifest - Barter's fork runs them too, so they change Barter's own apply and pre-commit.
- Retiring Barter's `sync.cjs` and `replay.cjs` - depends on the two items above.
- Committing anything in Barter - its `coder/` to `skilled/` migration is uncommitted and not this session's.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | Modify | Per-entry protected-path block, `.dsh` default, not-copied list, stage-skip line, setting-aware missing-manifest error |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-fixes.test.cjs` | Modify | Protected paths block one entry, the report completes, apply writes nothing |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-repin.test.cjs` | Modify | `.dsh` copied, not-copied list, stage-skip line, refusal over a refused overlay |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-sync.test.cjs` | Modify | Missing-manifest error with and without the setting file |
| `.skilled/commands/doctor/assets/doctor-overlay-repin.yaml` | Modify | The stage invariant names what a stage skips |
| `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt` | Modify | Plan lines, refusal row and troubleshooting rows for the new output |
| `.skilled/commands/doctor/assets/doctor-install-presentation.txt` | Modify | Point a vendoring project at `/doctor:overlay` |
| `.skilled/commands/doctor/_routes.yaml` | Modify | Three adoption phrases on the read-only `status` route |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json` | Modify | Regenerated from the routes |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts` | Modify | Regenerated from the routes |
| `.skilled/skills/system-skilled-doctor/references/overlays.md` | Modify | Per-entry refusal, `.dsh`, not-copied list, stage skips, adoption section |
| `README.md` | Modify | §5 names the re-pin's copy set, the not-copied list and adoption |
| `barter/ai-speckit/skilled/.skilled-overlays.json` | Create | Names `barter-overlays` (untracked, outside this repository) |
| `barter/ai-speckit/skilled/barter-overlays/overlay-manifest.json` | Modify | `protectedPaths` on `repo-frontend` and a `repin` block (untracked) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A protected path blocks only its own entry | `status` on a tree with a walked token file exits 1, prints a `MISS` line naming the file and the `protectedPaths` fix, still reports other overlays, and `apply` exits 1 writing nothing |
| REQ-002 | Barter's tree passes the upstream engine | `overlay-engine.cjs status --root barter/ai-speckit/skilled` prints `checked=132 ok=132 miss=0` and `RESULT: PASSED`, and Barter's own `replay.cjs --check` and `sync.cjs --status` still pass |
| REQ-003 | No regression in the doctor suite | `node --test .skilled/commands/doctor/scripts/tests/*.test.cjs` fails only the six agents-md tests that fail on the base commit |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | A re-pin copies `.dsh` by default | With no `repin.runtimeFolders`, an upstream `.dsh` file is copied and counted |
| REQ-005 | A re-pin lists what it leaves out | Upstream changes under `repin.exclude` or a real top-level path outside the roots print as `not-copied` and land in `report.notCopied`. A top-level link is skipped |
| REQ-006 | A stage says what it skipped | A stage with regenerate or verify steps prints `stage skipped <n> regenerate and <n> verify step(s)` |
| REQ-007 | A re-pin over a refused overlay stops before its backup | Exit 2, a `refuse:` line, no `repin-runs` folder and an unchanged tree |
| REQ-008 | A missing setting is diagnosable | With no setting file the missing-manifest error names `.skilled-overlays.json`. With one it keeps the plain message |
| REQ-009 | Adoption is documented and routed | The overlays reference has an adoption section, and the three adoption phrases reach `command-doctor-overlay-status` in `doctor-phrase-reach.cjs` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Upstream `status` on Barter's tree goes from exit 2 to exit 0 with `RESULT: PASSED`.
- **SC-002**: Each new engine behavior has a test that fails when the behavior is removed.
- **SC-003**: A staged re-pin of Barter onto this branch's commit finishes clean.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Barter's vendored tree is untracked | An overwritten file has no git copy | The manifest is backed up first, and it round-trips byte-identical through `JSON.stringify(…, 2)` so the scripted edit changes only the named keys |
| Risk | Changing protected-path refusal from exit 2 to a per-entry block weakens the secret-file posture | High | Nothing is read for a refused entry: its plan stub has no outputs, and the late check swaps any plan with a protected output for the stub before classification. `apply` still writes nothing while any entry is blocked |
| Risk | New route phrases shift advisor routing elsewhere | Med | The bridge files are regenerated, phrase reach passes 228 of 228, and the full advisor suite runs |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The not-copied list adds one `git diff --name-only` between the two commits to a re-pin, and nothing to `status` or `apply`.

### Security
- **NFR-S01**: No protected file is read: a `.env` file never, a token-named file only by an exact manifest path or `protectedPaths`.
- **NFR-S02**: The guard hook's inert fast path is unchanged: it still allows on two file-existence checks in a tree with no overlay manifest.

### Reliability
- **NFR-R01**: A blocked entry never leaves a partial apply or a partial re-pin.

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a re-pin whose commits differ only inside the copied roots prints no `not-copied` line and leaves `notCopied` empty.
- Maximum input: more than 20 not-copied paths print the first 20 and a count, and `report.json` keeps all of them.
- Failure path: a manifest path that escapes its root still stops the run with exit 2, because that is a broken manifest, not a blocked entry.
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | One engine file, three test files, eight doc and routing files, two generated files |
| Risk | 12/25 | Changes a refusal contract and a re-pin precondition. Barter's real tree is untracked |
| Research | 14/20 | Five-iteration research run plus a live adoption test on Barter |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Build `fork-drifted` and `outsideCertificate` into the engine so Barter can drop its fork? Held for the operator, see `scratch/morning-decisions.md`.
- Add the four regenerate and verify pairs to Barter's manifest? Held for the operator for the same reason.
<!-- /ANCHOR:questions -->

---
