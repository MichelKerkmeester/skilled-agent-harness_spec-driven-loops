---
title: "Implementation Plan: Create-Skill Template and Validator Alignment"
description: "Serialize the Phase 002 tooling alignment: two-state template authoring, stage1-only initializer, pure root-router contract library with stable codes, command workflow classification, parent doctor and package integration, positive/negative fixtures, and a receipt-backed 002 to 003 handoff."
trigger_phrases:
  - "create skill alignment plan"
  - "root router validator plan"
  - "stage1-only scaffold plan"
  - "parent doctor integration plan"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-router-unification-program/020-root-router-document-standard/002-create-skill-template-and-validator-alignment"
    last_updated_at: "2026-08-16T07:40:46.607Z"
    last_updated_by: "markdown-agent"
    recent_action: "Executed the serial Phase 002 tooling-alignment plan end to end."
    next_safe_action: "Hand the verified fixtures and stable-code matrix to phase 003."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Create-Skill Template and Validator Alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3 (generator/package), Node.js CommonJS (validators/doctor/tests), Markdown/JSON/YAML/TXT templates |
| **Framework** | sk-create-skill assets and scripts, `/create:skill-parent` workflows, parent-skill doctor, system-spec-kit Level 3 packet |
| **Storage** | Child-local `scratch/` receipts plus the named authoring surfaces |
| **Testing** | Node test suites, Python package gate, doctor fixtures, replay-byte compatibility, strict spec validation, scoped Git diff |
| **Mutation Policy** | Only the named create-skill, command, doctor, and test files; zero live hub edits |

### Overview

The alignment runs in five serial phases: preflight and protected-byte pins, template/schema authoring, generator and command workflow changes, validator/doctor/package integration, then the positive/negative test matrix and the 002 to 003 handoff. Every claim requires a receipt with a timestamp, command, and exit code.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Approved plan, `../spec.md`, and `../001-contract-and-fleet-audit/spec.md` reread from the worktree.
- [x] No staged files; initial scoped status captured.
- [x] `skill-root-metadata-contract.cjs`, `router-replay.cjs`, and the two scorer files match their pinned digests.
- [x] The child receipt root resolves below this child folder.
- [x] The current legacy-path authoring instruction set is inventoried before edits.

### Definition of Done for the 002 to 003 Handoff

- [x] `init_skill.py --kind parent` emits a valid root `stage1-only` `ROUTER.md`.
- [x] A hand-authored `active` fixture passes the library, parent doctor, and package gate.
- [x] All eight negative fixtures fail at their intended stable codes.
- [x] Command workflows classify all six states and emit one `ROUTER.md: create|migrate|unchanged` action; dual copies stop the flow.
- [x] Migration fixture proves the machine block hash is unchanged in ordinary migration.
- [x] No live authoring surface instructs legacy-path creation.
- [x] `defaultResource` behavior is unchanged for all seven hubs.
- [x] Protected byte-identity gates pass before and after.
- [x] Strict child validation exits 0; no staged files; no out-of-scope changed path.
- [x] Lifecycle is Complete; delivery and handoff evidence are recorded in `checklist.md` and `implementation-summary.md`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Single-source contract enforcement: the ratified two-state schema lives in one pure library; every generator, command, doctor, and package consumer prints the same stable codes; templates teach the same authoring rules; tests pin the same fixtures.

### Key Components

- **Root Router Contract Library**: `scripts/lib/root-router-contract.cjs` parses `router_state`, `INTENT_SIGNALS`, `RESOURCE_MAP`, stage-two default, `SKILL.md` pointer, and legacy coexistence; path identity delegates to `lib/leaf-resource-contract.cjs`; it never imports frozen replay scoring.
- **Stage1-only Initializer**: `init_skill.py --kind parent` writes a root `stage1-only` `ROUTER.md` with empty maps and a root `SKILL.md` pointer.
- **Command Classifier**: `/create:skill-parent` classifies `stage1-only`, `active`, `legacy-migratable`, `already-current`, `conflict`, or `malformed` and renders `ROUTER.md: create|migrate|unchanged`.
- **Enforcement Layer**: `parent-skill-check.cjs` and the parent path of `validate_skill_package.py` run the library and fail closed on any negative code.
- **Fixture Matrix**: positive stage1-only and active fixtures plus eight negative mutants consumed by the doctor, package, and contract test suites.

### Data Flow

```text
Ratified Phase 001 contract
          |
          v
root-router-contract.cjs (state + shape + stable codes)
   |           |           |
   v           v           v
init_skill.py  commands    parent-skill-check.cjs
(stage1-only)  (classify)  validate_skill_package.py
   |           |
   +-------+---+
           v
   positive/negative fixture matrix
           |
           v
   replay-byte compatibility + handoff gate
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Phase 002 Action | Verification |
|---------|--------------|------------------|--------------|
| `assets/parent-skill/parent-skill-smart-routing-template.md` | Legacy copy-paste scaffold | Convert to root `ROUTER.md` template; no legacy path | Grep shows zero creation instruction |
| `assets/parent-skill/parent-skill-hub-template.md` | Parent hub authoring template | Add two-state `router_state` and root pointer guidance | Template review + active fixture |
| `assets/parent-skill/scaffold/hub-skill-scaffold.md` | Hub scaffold | Reference the generated stage1-only root router | Scaffold passes doctor and package gate |
| `assets/parent-skill/parent-skill-hub-router-template.json` | Stage-one template | Document root router as stage-two companion; no map flattening | JSON parse + schema review |
| `references/parent-skill/parent-hub-router-schema.md` | Stage-one schema reference | Add root `ROUTER.md` location, version, pointer, and state rules | Reference review |
| `references/parent-skill/parent-skills-nested-packets.md` | Nested packet reference | Update to two-stage authoring narrative | Reference review |
| `references/shared/skill-root-metadata-contract.md` | Docs for root metadata | Documentation-only; discriminator unchanged | Byte-identity gate on `.cjs` |
| `SKILL.md`, `README.md` (sk-create-skill) | Skill guidance | Document two-state authoring and promotion rule | Doc review |
| `scripts/init_skill.py` | Generator | `--kind parent` emits valid `stage1-only` `ROUTER.md` | Generated scaffold validation |
| `scripts/validate_skill_package.py` | Package gate | Parent path runs the library | Active + stage1-only pass; negatives fail at code |
| `scripts/lib/root-router-contract.cjs` | New | Pure state/shape validator with RRC codes | Contract test suite |
| `commands/create/skill-parent.md` | Command router | Add state classification contract | Parity checks |
| `commands/create/assets/create-skill-parent-{auto,confirm}.yaml` | Workflows | Emit `ROUTER.md: create|migrate|unchanged`; stop on conflict | Auto/confirm parity checks |
| `commands/create/assets/create-skill-parent-presentation.txt` | UX copy | Show router state and action line | Presentation review |
| `commands/create/README.txt` | Command docs | Reflect two-state authoring | Doc review |
| `.opencode/agents/markdown.md` | Markdown agent guidance | Reference the two-state parent authoring flow | Doc review |
| `commands/doctor/scripts/parent-skill-check.cjs` | Doctor | Run the library; stable codes on failure | Doctor fixture suite |
| Test suites and fixtures | Coverage | Positive/negative matrix + parity + migration hash | All suites exit 0 |
| Seven live hubs | Evidence only | No edits | Final scoped diff |

Required inventories:

- Legacy-instruction inventory: every live authoring surface that currently tells authors to create `shared/references/smart-routing.md`.
- Protected-byte inventory: `skill-root-metadata-contract.cjs` plus the frozen replay/scorer trio and their pinned digests.
- State-classification matrix: each of the six states mapped to a decision and an action line.
- Machine-block hash boundary: identical to the Phase 001 definition (inner Python fence bytes, excluding fence lines).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Preflight and Protected Pins

- [x] Capture worktree, stage, and scoped status.
- [x] Re-read the approved plan, `../spec.md`, and `001/spec.md`.
- [x] Verify protected digests (discriminator + replay + scorers) and record them.
- [x] Inventory current legacy-path authoring instructions.
- [x] Ratify the stable-code table and machine-block hash boundary in `decision-record.md`.

### Phase 2: Template and Schema Authoring

- [x] Convert the smart-routing template to a root `ROUTER.md` template.
- [x] Add two-state guidance to the hub template, scaffold, hub-router JSON template, and both parent-skill references.
- [x] Update `references/shared/skill-root-metadata-contract.md` (docs only).
- [x] Update `sk-create-skill/SKILL.md` and `README.md`.

### Phase 3: Generator and Command Workflow

- [x] Make `init_skill.py --kind parent` emit a valid root `stage1-only` `ROUTER.md`.
- [x] Implement the six-state classifier and `ROUTER.md: create|migrate|unchanged` in the auto and confirm workflows.
- [x] Update `skill-parent.md`, the three command assets, `commands/create/README.txt`, and `.opencode/agents/markdown.md`.
- [x] Preserve the machine block byte-for-byte in ordinary migration; stop on dual copies.

### Phase 4: Validator, Doctor, and Package Integration

- [x] Add `scripts/lib/root-router-contract.cjs` with the frozen RRC code table.
- [x] Integrate the library into `parent-skill-check.cjs`.
- [x] Integrate the library into the parent path of `validate_skill_package.py`.
- [x] Keep `skill-root-metadata-contract.cjs` classification byte-identical.

### Phase 5: Fixtures, Tests, and Handoff

- [x] Add the active and stage1-only positive fixtures and eight negative mutants.
- [x] Extend `create-journey-proof.test.cjs`; add `root-router-contract.test.cjs`; add doctor fixture/mutant and auto/confirm parity suites.
- [x] Add the migration fixture with before/after machine-block hash.
- [x] Run root-first replay compatibility against existing replay bytes.
- [x] Run the no-legacy-instruction grep, protected byte-identity recheck, strict validation, and scoped diff gate.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Pass Condition |
|-----------|-------|-------|----------------|
| Contract unit | State, maps, pointers, coexistence | `root-router-contract.test.cjs` | Each positive passes; each negative reports its exact RRC code |
| Journey proof | init → doctor → package | `create-journey-proof.test.cjs` | Stage1-only scaffold passes all gates |
| Doctor fixtures | Parent doctor consumers | `parent-skill-check-*.test.cjs` plus fixture/mutant dirs | All eight negatives fail at intended codes |
| Package gate | `validate_skill_package.py` parent path | Python invocation on fixtures | Active/stage1-only pass; negatives exit non-zero with codes |
| Workflow parity | Auto vs confirm YAML | Commands asset test runner | Identical state classification and action lines |
| Migration | Machine block preservation | Fixture hash before/after | Hash equality for ordinary migration |
| Replay compatibility | Root-first leaf selection | Existing replay byte set against active fixture | Route outcomes match without replay edits |
| Protected bytes | Discriminator and frozen trio | `sha256sum` before/after | All four digests unchanged |

### Objective Commands

Run from the worktree repository root. Redirect outputs into `scratch/` inside this child.

#### 1. Preflight and Protected-Byte Pins

```bash
set -euo pipefail
CHILD='specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/020-root-router-document-standard/002-create-skill-template-and-validator-alignment'
mkdir -p "$CHILD/scratch"
git status --short | tee "$CHILD/scratch/git-status-before.txt"
git diff --cached --name-only | tee "$CHILD/scratch/git-staged-before.txt"
test ! -s "$CHILD/scratch/git-staged-before.txt"
sha256sum \
  .opencode/skills/sk-doc/sk-create-skill/scripts/lib/skill-root-metadata-contract.cjs \
  .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs \
  .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs \
  .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs \
  | tee "$CHILD/scratch/protected-bytes-before.txt"
```

#### 2. Stage1-Only Initializer Proof

```bash
python3 .opencode/skills/sk-doc/sk-create-skill/scripts/init_skill.py \
  --kind parent "$CHILD/scratch/proof-stage1" \
  > "$CHILD/scratch/init-stage1.txt" 2>&1
test -f "$CHILD/scratch/proof-stage1/ROUTER.md"
grep -q 'router_state: stage1-only' "$CHILD/scratch/proof-stage1/ROUTER.md"
node .opencode/commands/doctor/scripts/parent-skill-check.cjs "$CHILD/scratch/proof-stage1"
python3 .opencode/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py \
  "$CHILD/scratch/proof-stage1"
```

#### 3. Contract and Doctor Fixture Suites

```bash
node .opencode/skills/sk-doc/sk-create-skill/scripts/tests/root-router-contract.test.cjs
node .opencode/skills/sk-doc/sk-create-skill/scripts/tests/create-journey-proof.test.cjs
node .opencode/commands/doctor/scripts/tests/parent-skill-check-leaf-manifest.test.cjs
# doctor fixture/mutant suite runner per the added suite entrypoint
node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs
node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs
```

#### 4. Command Parity and No-Legacy-Instruction Grep

```bash
python3 .opencode/commands/create/assets/tests/test_emitted_name_contract.py
# auto/confirm parity runner added under .opencode/commands/create/assets/tests/
rg -n 'shared/references/smart-routing\.md|references/smart-routing\.md' \
  .opencode/skills/sk-doc/sk-create-skill .opencode/commands/create \
  | tee "$CHILD/scratch/legacy-residue.txt"
# Allowed rows: immutable changelog entries and protected replay strings only
```

#### 5. Final No-Out-of-Scope Gate

```bash
set -euo pipefail
CHILD='specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/020-root-router-document-standard/002-create-skill-template-and-validator-alignment'
git status --short | tee "$CHILD/scratch/git-status-after.txt"
git diff --cached --name-only | tee "$CHILD/scratch/git-staged-after.txt"
test ! -s "$CHILD/scratch/git-staged-after.txt"
if git status --porcelain=v1 | sed -E 's/^.. //' | grep -Ev "^${CHILD}(/|$)" \
  | grep -Ev '^\.opencode/(skills/sk-doc/sk-create-skill|commands/create|commands/doctor|agents/markdown\.md)' \
  > "$CHILD/scratch/out-of-scope-paths.txt"; then
  echo 'Phase 002 boundary violation' >&2
  exit 1
fi
sha256sum \
  .opencode/skills/sk-doc/sk-create-skill/scripts/lib/skill-root-metadata-contract.cjs \
  .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs \
  .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs \
  .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs \
  | tee "$CHILD/scratch/protected-bytes-after.txt"
diff "$CHILD/scratch/protected-bytes-before.txt" "$CHILD/scratch/protected-bytes-after.txt"
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh "$CHILD" --strict
```
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Ratified Phase 001 contract | Normative | Planned | Tooling cannot diverge from frozen decisions |
| sk-create-skill assets and scripts | Authoring toolchain | Present | No templates or generator to align |
| Leaf-resource contract library | Identity delegate | Present | Path identity cannot be proven |
| Parent command workflows and assets | UX surface | Present | Classification and action line cannot ship |
| `parent-skill-check.cjs` and package gate | Enforcement | Present | Negative fixtures cannot gate the handoff |
| Existing replay bytes and fixtures | Compatibility proof | Present | Root-first compatibility cannot be proven |
| Git index and worktree | Boundary evidence | Available | Handoff diff cannot be proven |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A protected byte differs, a live hub path appears in the diff, a fixture passes for the wrong code, an authoring surface still instructs legacy creation, or a command mutates a default or manifest.
- **Procedure**: Stop immediately. Preserve diagnostics in `scratch/`. Restore the aligned set as one policy-consistent unit via Git in the isolated worktree: templates, generator, command assets, validator, doctor, and tests together. Never restore router prose without its matching validator and manifest state, and never touch unrelated pre-existing work. Re-run protected-byte pins and the affected gate before resuming.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Preflight and protected pins
          |
          v
Template and schema authoring
          |
          v
Generator and command workflow
          |
          v
Validator, doctor, and package integration
          |
          v
Fixtures, tests, and handoff
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Preflight and pins | Plan, parent, Phase 001 contract | Every later phase |
| Template authoring | Preflight pins | Generator and workflow |
| Generator and workflow | Templates | Validator consumers and fixtures |
| Enforcement integration | Generator and workflow | Fixture matrix and handoff |
| Fixtures and handoff | All earlier phases | Phase 003 start |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Preflight and protected pins | Low | 1 hour |
| Template and schema authoring | Medium | 3-5 hours |
| Generator and command workflow | High | 4-6 hours |
| Validator, doctor, and package integration | High | 3-5 hours |
| Fixtures, tests, and handoff | High | 4-6 hours |
| **Total** | | **15-23 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Execution Checklist

- [x] No staged files.
- [x] Protected-byte pins recorded.
- [x] Legacy-instruction inventory captured.
- [x] Stable-code table ratified.
- [x] Receipt root resolves inside this child.

### Rollback Procedure

1. Stop the failing phase and capture command, exit code, stderr, and affected paths.
2. Compare affected paths to the allowlisted authoring-surface set and the initial status snapshot.
3. Restore the full aligned set from Git as one unit; do not partially revert generator and validator.
4. Re-run protected-byte pins and the no-legacy-instruction grep.
5. Resume only after all gates pass.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Git restoration of the worktree for the aligned tooling set. No live hub policy, manifest, runtime closure, or historical artifact is eligible for Phase 002 reversal because none is eligible for Phase 002 mutation.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
┌──────────────────────┐
│ Phase 001 Contract   │
└──────────┬───────────┘
           v
┌──────────────────────┐
│ root-router-contract │
│   library + codes    │
└───┬───────┬───────┬──┘
    v       v       v
 init_   command   doctor +
 skill    flows    package
 stage1   classify  gate
    └───────┬───────┘
            v
    ┌──────────────────┐
    │ fixture matrix   │
    └────────┬─────────┘
             v
    ┌──────────────────┐
    │ replay-byte compat│
    └────────┬─────────┘
             v
    ┌──────────────────┐
    │ 002 -> 003 gate  │
    └──────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Root-router contract library | Phase 001 contract, leaf-resource contract | Stable codes | Generator, commands, doctor, fixtures |
| Stage1-only initializer | Library shape | Valid leafless scaffold | Journey proof |
| Command classifier | Library states | Action line and stop rules | Auto/confirm parity |
| Doctor and package gates | Library | Pass/fail at codes | Handoff |
| Fixture matrix | All consumers | Negative coverage | Phase 003 confidence |
| Replay compatibility | Existing replay bytes | Root-first proof | Handoff |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Preflight and protected pins** - 1 hour - CRITICAL.
2. **Templates and schema authoring** - 3-5 hours - CRITICAL.
3. **Generator and command workflow** - 4-6 hours - CRITICAL.
4. **Validator, doctor, and package integration** - 3-5 hours - CRITICAL.
5. **Fixtures, tests, and handoff gate** - 4-6 hours - CRITICAL.

**Total Critical Path**: 15-23 hours.

**Parallel Opportunities**: Template reference docs and command presentation copy can be drafted in parallel once the state-classification matrix is fixed; negative fixture data can be prepared before doctor integration lands.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Protected baseline | No staged files, pins pass, legacy inventory captured | Phase 1 |
| M2 | Authoring surfaces aligned | Templates/references teach two states, no legacy creation instruction | Phase 2 |
| M3 | Generator and workflows ship | Stage1-only scaffold valid; classifier emits one action line | Phase 3 |
| M4 | Enforcement integrated | Doctor and package pass positives and fail negatives at codes | Phase 4 |
| M5 | Handoff ready | All suites green, replay-compatible, protected bytes unchanged, strict validation exit 0 | Phase 5 |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:ai-execution -->
## L3: AI EXECUTION PROTOCOL

Phase 002 executes within the named authoring surfaces plus this child folder.

### Pre-Task Checklist

- [x] Re-read the approved plan, `../spec.md`, and `001/spec.md`.
- [x] Confirm task ID, expected receipts, and the write boundary allowlist.
- [x] Confirm protected-byte pins.
- [x] Confirm the next change is inside an allowlisted surface or this child.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Execute tasks in numeric order; phases in plan order. |
| TASK-SCOPE | Write only the allowlisted create-skill, command, doctor, agent, and test paths plus this child folder. |
| TASK-EVIDENCE | Record command, timestamp, exit code, stdout, stderr, and interpretation. |
| TASK-CODES | Every negative fixture asserts its exact RRC code; never pass for a different code. |
| TASK-BYTES | Never rewrite the class discriminator, replay, scorers, machine blocks, defaults, or manifests. |
| TASK-FAIL-CLOSED | Stop on protected-byte drift, out-of-allowlist path, wrong-code pass, or dual-router ambiguity. |
| TASK-NO-LIVE-HUB | Never edit a live hub router, default, manifest, or compiled artifact in Phase 002. |

### Status Reporting Format

Use `TASK=<id> STATUS=PASS|FAIL|BLOCKED RECEIPT=<child-relative-path> EXIT=<code> NOTE=<short-fact>`. A phase report stays `STATUS=DRAFT` until every P0 handoff item has receipt evidence.

### Blocked Task Protocol

If a stable code, protected byte, default value, fixture expectation, or allowlist path differs from this plan, stop the affected lane, preserve the mismatch receipt, mark the task blocked, and request LOGIC-SYNC. Do not weaken a negative fixture, update a code table silently, or edit a protected file to make a gate pass.
<!-- /ANCHOR:ai-execution -->

---

<!-- ANCHOR:architecture-overview -->
## L3: ARCHITECTURE OVERVIEW

Phase 002 treats the ratified contract as a single normative source compiled into one pure library. Templates, the generator, command workflows, the doctor, and the package gate all consume that library or the same state vocabulary; tests pin the same fixtures and codes. Authoring tooling changes stay bounded to routing inputs and never alter stage-one authority, typed identity, advisor discovery, or frozen evaluation bytes.
<!-- /ANCHOR:architecture-overview -->

---

<!-- ANCHOR:risk-mitigation -->
## L3: RISK MITIGATION

| Risk | Mitigation | Verification |
|------|------------|--------------|
| Legacy instructions survive | Inventory before edits; grep after | Zero non-immutable residue |
| Code drift across consumers | Library-owned RRC table | Fixture assertions on exact codes |
| Machine block rewritten in migration | Before/after hash in fixture | Hash equality |
| Discriminator or replay drift | Byte-identity pins | Before/after digest diff empty |
| Default behavior shifts | REQ-007 no-default-change gate | Scoped diff review |
| Fake active intents | Active fixtures require typed resolved pairs | Journey proof and doctor |
<!-- /ANCHOR:risk-mitigation -->

---

## L3: ARCHITECTURE DECISION SUMMARY

| ADR | Decision | Ratified Outcome |
|-----|----------|---------------|
| ADR-101 | Root `ROUTER.md` is the two-state stage-two control document | Proposed |
| ADR-102 | `stage1-only` is the generator default; `active` requires authored maps | Proposed |
| ADR-103 | Pure root-router contract library with stable negative codes | Proposed |
| ADR-104 | Preserve `defaultResource`; no universal repoint | Proposed |
| ADR-105 | Leave class discriminator and frozen replay bytes untouched | Proposed |

See `decision-record.md` for full context, alternatives, consequences, and rollback.
