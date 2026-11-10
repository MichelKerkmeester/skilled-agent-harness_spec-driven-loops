---
title: "Implementation Plan: Phase 8: drift after closure"
description: "Re-measure both routing gates first, then fix only what the measurement and the failing checks prove: three loader paths in the spec-kit CLI, one misowned signal in the CLI hub, and the stale paths and template sections the closed phases left behind."
trigger_phrases:
  - "drift after closure plan"
  - "loader path fix"
  - "gate rerun plan"
  - "hub signal retirement"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 8: drift after closure

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash wrappers over a TypeScript renderer, JSON hub metadata, Markdown spec docs |
| **Framework** | spec-kit CLI under `runtime/cli/`, the skill-advisor daemon and its compiled-route tooling |
| **Storage** | None written by this phase beyond the packet tree; the advisor's SQLite graph is read, never written |
| **Testing** | vitest for the scaffold and parity suites, the doctor hub check, the compiled-route guard, `validate.sh --strict --recursive` |

### Overview
Measure before touching anything: re-run Gate A and Gate B through the live daemon and
diff each row against its recorded bucket. Then run every check the seven phases added.
What fails or moves gets one of three treatments, in this order: fix at the producer when the
mechanism is known and inside scope, retire when the measurement shows the hub never owned
it, or record with an owner when the mechanism is not known or the fix is a scoring change
D2 forbids.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing: the scaffold suite, the hub gates, the voice-scanner checks
- [x] Docs updated: this phase, phase 007, the parent
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Measure, then repair at the producer. No new module, no new option, no new fallback.

### Key Components
- **`inline-gate-renderer.sh`**: the shell wrapper every scaffold render passes through. It locates the tsx loader relative to itself and falls into an inline renderer when the loader is absent. The fallback ignores `--out-dir` and prints only the last template, which is the whole failure
- **`compiled-route-guard.cjs` and `compiled-route-manifest.cjs`**: the freshness gate and the mint for a hub's serving manifest. A routing input edited without a mint drops the hub to legacy routing silently
- **The two gate runners**: throwaway scripts that call `skill-advisor.cjs advisor_recommend` once per row and classify the reply with the rules phase 002 and phase 003 wrote down

### Data Flow
The corpus row goes to the daemon as the prompt. The daemon's first recommendation gives
the hub; its compiled route gives the target mode. The classification compares both with the
row's owning hub and intended mode, and the artifact keeps the recorded bucket in the same
row so a diff is a column comparison.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runtime/cli/templates/inline-gate-renderer.sh` | Producer: resolves the loader, renders templates | update | Scaffold in scratch renders 11 documents; `scaffold-golden-snapshots.vitest.ts` 9 of 9 |
| `runtime/cli/lib/template-utils.sh` | Same resolution, spelled correctly at three levels up | unchanged | `grep -n 'node_modules/tsx' runtime/cli/lib/template-utils.sh` shows the three-level path |
| `runtime/cli/spec/create.sh` line 1678 | Consumer: backfill loader | update | Backfill runs on a real packet, skipped only outside a specs root |
| `runtime/cli/spec/validate.sh` line 28 | Consumer: TypeScript orchestrator lane | update | `validate.sh --strict` still prints rule lines and `RESULT: PASSED` |
| `cli-external-orchestration/graph-metadata.json` | Routing input: two intent-signal lists | update | Guard fresh, doctor check OK, live replay on `system-spec-kit` |
| `013-live-activation/activation/cli-external-orchestration/manifest.json` | Serving manifest | unchanged, confirmed by mint | Mint reports `already-exists`, guard reports fresh |

Required inventories:
- Same-class producers: `rg -n 'node_modules/tsx/dist/loader.mjs' .opencode/skills/system-spec-kit/runtime --glob '!node_modules'` finds six spellings; three were one level short and are fixed, two are absolute and correct, one in `template-utils.sh` was already three levels up.
- Consumers of changed symbols: none. The three edits change a path literal each, and no symbol.
- Matrix axes: level in {1, 2, 3, 3+, phase} by add-ons in {off, on}. The scaffold suite covers Level 3 both ways and Levels 1 to 3+ without add-ons.
- Algorithm invariant: every rendered file lands inside the target packet, held by `_ensure_dest_within_dir`, which this phase does not touch.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The scaffold render path, both add-on cases | `scaffold-golden-snapshots.vitest.ts` under the CLI workspace config |
| Integration | Hub freshness and structure after the signal retirement | `compiled-route-guard.cjs`, `parent-skill-check.cjs` with the hub path, the three skill-root gates |
| Manual | Live replay of the retired phrase and of a delegation phrase the hub must keep | `skill-advisor.cjs advisor_recommend` |
| Measurement | Both gates, every row | The two runners, artifacts committed under `research/` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Advisor daemon live at one generation for the length of a run | Internal | Green, generation 593 to 597 across the session | A mid-run bump would mix two states into one artifact |
| tsx installed at the spec-kit workspace root | Internal | Green, `node_modules/tsx/dist/loader.mjs` present there | The wrapper falls into the inline renderer and the scaffold breaks again |
| Parent goal D2, the scorer holds still | Internal | Green | Any scoring change voids both re-runs |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a scaffold that renders fewer documents than its contract names, or a hub the guard reports stale after the retirement
- **Procedure**: `git checkout` the three CLI files and the hub metadata; the mint left the manifest unchanged, so no serving artifact needs reverting
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Measure (both gates, all checks) ──► Repair (loader paths, signal) ──► Record (ADRs, 007, parent) ──► Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Measure | None | Repair, Record |
| Repair | Measure | Verify |
| Record | Measure | Verify |
| Verify | Repair, Record | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Measure | Med | Two daemon sweeps of roughly five minutes each, plus the check suite |
| Repair | Low | Three path literals and two JSON lines |
| Record | Med | Three ADRs, seven phase documents, three parent documents |
| **Total** | | **One session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created: none needed, every change is a tracked file with a clean prior revision
- [x] Feature flag configured: none; the scaffold wrapper has no flag, and the fallback remains for a tree without tsx
- [x] Monitoring alerts set: the scaffold test and the route guard are the alerts, both in the repository

### Rollback Procedure
1. `git checkout -- .opencode/skills/system-spec-kit/runtime/cli/templates/inline-gate-renderer.sh .opencode/skills/system-spec-kit/runtime/cli/spec/create.sh .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh`
2. `git checkout -- .opencode/skills/cli-external-orchestration/graph-metadata.json`, then run `compiled-route-guard.cjs`
3. Re-run the scaffold suite and expect the pre-fix failure to return, which proves the revert took

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Measure    │────►│    Repair    │────►│    Verify    │
│ gates+checks │     │ paths+signal │     │ gates+suite  │
└──────┬───────┘     └──────────────┘     └──────▲───────┘
       │                                         │
       │             ┌──────────────┐            │
       └────────────►│    Record    │────────────┘
                     │ ADRs+parent  │
                     └──────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Gate re-runs | Daemon live | Two TSV artifacts, the drift rows | Repair, Record |
| Check sweep | Fixed tree | The scaffold failure, the parity movement | Repair, Record |
| Loader fix | Check sweep | Green scaffold suite | Verify |
| Signal retirement | Gate A drift row | Fresh hub, live replay | Verify |
| ADRs and reconciliation | Both of the above | Closed phase, closed parent | Verify |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Gate B re-run** - 180 daemon calls, about five minutes - CRITICAL
2. **Gate A re-run** - 388 daemon calls, about ten minutes - CRITICAL
3. **Loader fix and scaffold suite** - minutes - CRITICAL
4. **Parent validation, recursive** - minutes - CRITICAL

**Total Critical Path**: the two sweeps dominate; everything else is minutes

**Parallel Opportunities**:
- The check sweep runs while the gate sweeps run, since it does not call the daemon
- Phase 007 and parent reconciliation run while the loader fix is verified
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Both gates re-measured | Two artifacts committed, drift rows named | 2026-09-05 |
| M2 | Scaffold renders again | Suite 9 of 9, scratch packet holds 11 documents | 2026-09-05 |
| M3 | Packet closed | Nine folders `RESULT: PASSED`, zero placeholders | 2026-09-05 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

Decisions live in `decision-record.md`: ADR-001 fixes the loader at the wrapper rather than
teaching the fallback to honour `--out-dir`, ADR-002 leaves the parity pin alone and
records both regime numbers, ADR-003 retires the signal and records the one that died
without a known cause.

---


<!-- ANCHOR:ai-protocol -->
## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [x] Read the failing test's assertion before reading the code it exercises
- [x] Reproduce the exact symptom in scratch before editing the producer
- [x] Confirm the daemon is live and note its generation before a sweep

### Execution Rules

| Rule | Application here |
|------|------------------|
| Fix the producer | The wrapper's root, not the fallback's argument parsing |
| Never weaken a check | The parity pin is left as written; the movement is recorded, not absorbed |
| Re-mint after a routing edit | The mint ran and the guard was read after it |
| Replay both stages | The retired phrase and a kept phrase were replayed live |

### Status Reporting Format
Each task in `tasks.md` carries its evidence in parentheses: the command run, the count
read, or the artifact path. A task without evidence is not checked.

### Blocked Task Protocol
A task that cannot close records why in `decision-record.md` with an owner, and the
acceptance row that depends on it reads `Superseded` naming that ADR. Nothing is checked to
make a row green.
<!-- /ANCHOR:ai-protocol -->
