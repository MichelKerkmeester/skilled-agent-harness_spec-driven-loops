---
title: "Implementation Plan: Extend the Compatibility Upcasters to the Six Live Event Vocabularies"
description: "Census the legacy state that must survive, capture replay fixtures from real command output, then write full upcaster coverage for the six live vocabularies and prove each mode migrates a captured real log with zero `blocked:unknown-legacy-record`."
trigger_phrases:
  - "legacy compat event vocabulary"
  - "blocker 2 upcaster coverage"
  - "unknown legacy record migration"
  - "live event vocabulary upcaster"
  - "deep loop 023 compat"
importance_tier: "critical"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/003-legacy-compat-event-vocabulary"
    last_updated_at: "2026-08-07T03:06:00Z"
    last_updated_by: "codex"
    recent_action: "Completed the census, real-capture replay, six vocabularies, and per-file verification matrix"
    next_safe_action: "Orchestrator reviews and lands the uncommitted candidate"
    blockers: []
    key_files:
      - "plan.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

# Implementation Plan: Extend the Compatibility Upcasters to the Six Live Event Vocabularies

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (`runtime/lib/*-ledger-schema`) |
| **Framework** | vitest via `runtime/vitest.config.ts` |
| **Storage** | JSONL state logs (legacy) migrating to the typed ledger |
| **Testing** | vitest (`npm test`), tsc (`npm run typecheck`) |

### Overview
The census runs first and produces the list of legacy state that must survive; it is evidence for the mapping work, not an alternative to it. Fixtures are then captured from real command output per mode. Only then are the six vocabularies written, each stem mapped or pinned with a recorded rationale, and each mode closed with a zero-blocked replay of its captured real log.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `021`'s hashed-child-manifest boundary has landed, so this child can be scaffolded without widening the parent recursive glob
- [x] The `021` `runtime` baseline is captured and cited as the pre-fix HEAD plus the real-log red probes; the whole-process replacement is recorded below
- [x] The legacy-state census is complete and names what must survive
- [x] A real captured log exists per mode, or the substitution is recorded

### Definition of Done
- [x] Six vocabularies with full stem coverage and per-stem dispositions
- [x] Zero-blocked replay per mode against a captured real log
- [x] Multi-slice alignment lane stream proves no premature lane completion
- [x] Scoped whole gate re-run as the mandated per-mode/per-file matrix; the prohibited shared-process run is documented as a verification substitution
- [x] Post-build adversarial verification pass complete; its lack of a second human/model actor is recorded explicitly
- [x] `validate.sh --strict` exits 0 for this child
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Census-first upcaster coverage with real-capture replay fixtures

### Key Components
- **Legacy-state census**: Enumeration of the legacy state logs that exist and must survive, produced before any mapping
- **Real-capture fixtures**: Per-mode replay fixtures captured from actual command output, each recording its producing command
- **Six vocabularies**: Full stem coverage per mode: research, review, alignment, council, skill-benchmark, improvement-common
- **Per-stem dispositions**: A recorded map-or-pin decision with rationale for every stem a live run emits
- **Delegation path**: Skill-benchmark delegating unmapped stems to the common upcaster, matching the agent and model variants

### Data Flow
Live run -> legacy JSONL state log -> capture as fixture -> upcaster (map or pin per stem) -> typed ledger records -> replay assertion: zero `blocked:unknown-legacy-record`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This child plans from a deep-review CONDITIONAL verdict, so the fix addendum applies in full.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Six `*-ledger-schema/legacy-compatibility.ts` | Map legacy records to typed events | update | Zero-blocked replay of a captured real log per mode |
| Six `runtime/tests/unit/*-ledger-schema.vitest.ts` | Observe upcaster behavior | update | Real-capture fixtures replace synthetic ones |
| `commands/deep/assets/deep-{research,review,alignment}-auto.yaml` | Emit the live vocabularies | not a consumer; read-only evidence | Stems enumerated from these files, not from the current mapping |
| `deep-ai-council/scripts/orchestrate-{session,topic}.cjs` | Emit the live council vocabulary | not a consumer; read-only evidence | Live heartbeat shape read from source |
| `014` cutover gate | Reads migration evidence | unchanged | Blocker 2 discharge recorded in the unblock table |

Required inventories (run before implementation, record the output):
- Live stems per mode: `rg -n "type: *['\"]|event: *['\"]" .opencode/skills/system-deep-loop/commands/deep/assets/deep-*-auto.yaml` and the council orchestrator scripts.
- Currently mapped and pinned stems: `rg -n "case |PINNED|pinned" .opencode/skills/system-deep-loop/runtime/lib/*-ledger-schema/legacy-compatibility.ts`.
- Blocked-record producers: `rg -n "unknown-legacy-record" .opencode/skills/system-deep-loop/runtime`.
- Delegation pattern reference: compare skill-benchmark against the agent and model variants in the same directory family.

**Algorithm invariant.** For every stem S that a live run of mode M emits, the upcaster for M must either produce a typed record or produce an explicitly pinned legacy record; it may never produce `blocked:unknown-legacy-record`. Adversarial cases: a nested-shape heartbeat, a record carrying only the identity fields the live config emits, a mid-lane iteration slice, and a stem that only the common upcaster knows.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Confirm and census
- [x] T001 classification of all 6 findings, including the `F-022-02` `manualStop` correction
- [x] Run the legacy-state census: which logs exist, for which modes, and which must survive
- [x] Cite the `021` `runtime` baseline

### Phase 2: Capture real fixtures
- [x] Capture a real state log per mode from actual command output
- [x] Record the producing command and run identifier per fixture
- [x] Where a fresh run is impractical, substitute an existing run artifact and record the substitution

### Phase 3: Write the six vocabularies
- [x] Research: map or pin `graph_convergence`, `config_warning`, `lock_released`
- [x] Review: add the four omitted live stems
- [x] Alignment: separate slices from lane completion; accept live identity fields
- [x] Council: match the live heartbeat shape; register the two terminal stems
- [x] Skill-benchmark: delegate unmapped stems to common
- [x] Record a map-or-pin disposition with rationale for every stem

### Phase 4: Replay proof
- [x] Per mode, replay the captured real log and assert zero `blocked:unknown-legacy-record`
- [x] Multi-slice alignment lane stream: assert the lane does not complete after slice one
- [x] Assert pins are reported as pins, not blocks

### Phase 5: Delta and gate
- [x] Re-run TypeScript and the required per-mode/per-file matrix; report the scoped delta against the `021` baseline
- [x] Independent post-build adversarial verification pass; staffing limitation recorded in `implementation-summary.md`
- [x] Record the Blocker 2 discharge handoff; the checked-out 014 packet has no standalone unblock table, so the entry is recorded in `implementation-summary.md`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Replay | Captured real log per mode, end to end | vitest |
| Unit | Per-stem map-or-pin behavior | vitest |
| Negative | Unmapped stem blocks loudly with the stem named | vitest |
| Negative | Multi-slice alignment lane does not complete after slice one | vitest |
| Regression | Whole `runtime` suite as a delta against the `021` baseline | vitest, tsc |

### Named verification commands

- `cd .opencode/skills/system-deep-loop/runtime && npm run typecheck`
- `cd .opencode/skills/system-deep-loop/runtime && npm test`
- `cd .opencode/skills/system-deep-loop/runtime && npx vitest run tests/unit/deep-research-ledger-schema.vitest.ts tests/unit/deep-review-ledger-schema.vitest.ts tests/unit/deep-alignment-ledger-schema.vitest.ts`
- `cd .opencode/skills/system-deep-loop/runtime && npx vitest run tests/unit/deep-ai-council-ledger-schema.vitest.ts tests/unit/skill-benchmark-ledger-schema.vitest.ts tests/unit/deep-improvement-common-ledger-schema.vitest.ts`
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/036-deep-loop-innovation/003-legacy-compat-event-vocabulary --strict`

The whole-process vitest command is intentionally not used for this child: the shared-graph SQLite append lock hangs the 168-file process. The required replacement is the serial per-mode/per-file matrix recorded in `implementation-summary.md`, plus the owned substrate suites.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `021` honest baselines | Internal | Scoped baseline available | The pre-fix HEAD and red real-log replay probes are recorded; the prohibited whole-process run is not used |
| Real run artifacts per mode | Internal | Yellow | Fixtures fall back to existing artifacts; substitution recorded |
| `runtime` vitest + tsc | Internal | Green | No verification possible |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A captured real log cannot be migrated losslessly for a mode after the vocabulary is written, or a pin is found to contradict the census.
- **Procedure**: Revert per mode. Each vocabulary is an independent commit, so a mode whose mapping is wrong reverts without disturbing the other five. Restore the prior `legacy-compatibility.ts` and re-run that mode's ledger-schema suite.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Confirm + census) ──► Phase 2 (Capture fixtures) ──► Phase 3 (Six vocabularies)
                                                                        │
                                                                        ▼
                                                          Phase 4 (Replay proof)
                                                                        │
                                                                        ▼
                                                          Phase 5 (Delta + gate)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1 Confirm + census | `021` | 2 |
| 2 Capture fixtures | 1 | 3 |
| 3 Six vocabularies | 2 | 4 |
| 4 Replay proof | 3 | 5 |
| 5 Delta + gate | 4 | `014` Blocker 2 discharge |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Confirm + census | Medium | 6-10 hours |
| Capture fixtures | Medium | 6-10 hours |
| Six vocabularies | High | 20-32 hours |
| Replay proof | High | 10-16 hours |
| Delta + gate | Medium | 4-6 hours |
| **Total** |  | **46-74 hours** |
<!-- /ANCHOR:l2-effort -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-implementation Checklist
- [x] Baseline captured for every runner this child touches, at a named SHA
- [x] Work runs in an isolated git worktree (a concurrent session moved the review target mid-run)
- [x] Legacy-state census complete before any mapping is written
- [x] A real captured log exists per mode, or the substitution is recorded

### Rollback Procedure
1. Identify the mode whose mapping fails; each vocabulary is an independent commit.
2. Revert that mode's `legacy-compatibility.ts` commit.
3. Re-run that mode's ledger-schema suite and confirm the prior behavior returns.
4. Record which mode reverted; Blocker 2 stays open for that mode.

### Data Reversal
- **Has data migrations?** Yes — this child defines how legacy state logs migrate, though it performs no migration itself.
- **Reversal procedure**: No live state is migrated by this child. If a mapping ships wrong and state has since been migrated by `014`, reversal is `014`'s rollback window, not this child's. That is the reason the mapping must be proven against real captured logs before `014` runs.
<!-- /ANCHOR:l2-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────┐   ┌───────────────────┐   ┌────────────────────┐
│ Census   │──►│ Real fixtures x6  │──►│ Vocabularies x6    │
└──────────┘   └───────────────────┘   └─────────┬──────────┘
                                                 │
                                                 ▼
                                     ┌────────────────────────┐
                                     │ Zero-blocked replay x6 │
                                     └───────────┬────────────┘
                                                 ▼
                                     ┌────────────────────────┐
                                     │ 014 Blocker 2 discharge│
                                     └────────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Census | `021` | List of legacy state that must survive | Vocabularies, pin decisions |
| Real fixtures | Live run artifacts | Per-mode captured logs with provenance | Replay proof |
| Vocabularies | Census, fixtures | Full stem coverage per mode | Replay proof |
| Replay proof | Vocabularies, fixtures | Zero-blocked evidence per mode | `014` Blocker 2 |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Legacy-state census** - 6-10 hours - CRITICAL
2. **Capture real fixtures per mode** - 6-10 hours - CRITICAL
3. **Write six vocabularies with per-stem dispositions** - 20-32 hours - CRITICAL
4. **Zero-blocked replay proof per mode** - 10-16 hours - CRITICAL

**Parallel Opportunities**:
- The six vocabularies are independent of one another once the census and fixtures exist.
- Skill-benchmark delegation can be built against the existing agent and model variants without waiting for the other vocabularies.
- This child is fully parallel with `022`; they share no files.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Census complete | Legacy state that must survive is enumerated | End of Phase 1 |
| M2 | Real fixtures captured | One real captured log per mode with recorded provenance | End of Phase 2 |
| M3 | Vocabularies written | Every live stem carries a map-or-pin disposition in all six | End of Phase 3 |
| M4 | Zero-blocked replay | Six replays with zero `blocked:unknown-legacy-record` | End of Phase 4 |
| M5 | Blocker 2 discharged | Suite delta clean; independent verification recorded | End of Phase 5 |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:l3-adr-summary -->
## L3: ARCHITECTURE DECISION SUMMARY

| ADR | Decision | Status |
|-----|----------|--------|
| ADR-001 | Write the six live event vocabularies with full upcaster coverage | Accepted |
| ADR-002 | Replay fixtures are captured from real command output | Accepted |
| ADR-003 | Map lossless lifecycle records and pin legacy-only observations | Accepted |

Full context, alternatives, and consequences: `decision-record.md`.
<!-- /ANCHOR:l3-adr-summary -->

<!-- ANCHOR:ai-execution-protocol -->
## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Read the authored packet and every cited finding location before editing.
- Confirm the census and real fixture provenance before mapping stems.
- Run each affected test file serially; do not use the hanging shared-process runtime invocation.
- Preserve the scoped files and leave authority, parity, alignment reducer semantics, and durable-write behavior untouched.

### Execution Rules

| Rule | Description |
|------|-------------|
| TASK-SEQ | Confirm findings, census state, capture fixtures, implement dispositions, replay, then validate. |
| TASK-SCOPE | Modify only the six compatibility modules, their ledger-schema tests/helpers, and this packet's evidence docs. |
| TASK-VERIFY | No completion claim without TypeScript, per-mode matrix, negative replay evidence, and strict packet validation. |

### Status Reporting Format

Record the result, command, exit code, named test/file, and content or fixture digest. Distinguish confirmed evidence from inference and state any unavailable whole-gate or independent-actor evidence explicitly.

### Blocked Task Protocol

If a target is missing, a cited line moved, a test fails, or a merge conflict appears, stop the affected workstream, record the exact blocker and rollback anchor, and do not substitute an unapproved workflow. The 014 authority-cutover packet remains unchanged.
<!-- /ANCHOR:ai-execution-protocol -->
