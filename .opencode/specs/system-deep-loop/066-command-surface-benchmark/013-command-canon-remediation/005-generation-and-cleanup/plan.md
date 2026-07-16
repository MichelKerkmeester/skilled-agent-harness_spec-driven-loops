---
title: "Implementation Plan: generation and cleanup"
description: "Plan for the G1-G4 + A-W4/A-G2 generation-and-cleanup phase: standardize the OWNED ASSETS and EXECUTION TARGETS tables, stand up a section-scoped generate-command-routers.cjs with a --check drift gate, repair three command-local contract mismatches, slim the fat deep/* routers by ownership, and canonize a soft argument-hint budget plus command ergonomics as validator-WARN checks. Not yet built."
status: in_progress
trigger_phrases:
  - "command router generation plan"
  - "generate-command-routers"
  - "argument-hint budget plan"
  - "deep router slimming plan"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/013-command-canon-remediation/005-generation-and-cleanup"
    last_updated_at: "2026-07-16T16:00:00Z"
    last_updated_by: "claude"
    recent_action: "Materialized Level-3 doc set for the generation-and-cleanup phase"
    next_safe_action: "Standardize the OWNED ASSETS and EXECUTION TARGETS tables (A-W4) first"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-command/assets/command_contract.json"
      - ".opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs"
      - ".opencode/skills/sk-doc/create-command/assets/command_router_template.md"
      - ".opencode/skills/sk-doc/create-command/SKILL.md"
      - ".opencode/commands/scripts/validate-command-references.cjs"
---
# Implementation Plan: generation and cleanup

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS `.cjs`) generator + Python (`validate_document.py`) validators |
| **Framework** | sk-doc create-command canon; system-spec-kit spec-folder validation |
| **Storage** | `command_contract.json` (single source); `.opencode/commands/**` router + asset tree |
| **Testing** | Generator `--check` drift gate; phase-003 semantic checks; `validate_document.py`; `validate.sh --strict` |

### Overview
Make `command_contract.json` the single source for the structural spans of every command router. A greenfield `generate-command-routers.cjs` — sibling to `sync-prompts.cjs` — renders the contract-derivable spans and diffs them against each conformant router with a `--check` gate. Generation is section-scoped: it regenerates the `argument-hint`, the OWNED ASSETS table, the EXECUTION TARGETS table/list, the MODE ROUTING skeleton, and the PRESENTATION BOUNDARY only, never the hand-authored behavioral prose. The plan sequences A-W4 table standardization first (the generator's parse target), then the generator and its gate, then the G2 command-local fixes, then the A-G2 deep-router slimming, then the G3 hint budget and G4 ergonomics canon as validator-WARN checks, and finally the full gate set. Every new check extends an existing validator; no parallel lint engine is introduced.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md)
- [x] Success criteria measurable (spec.md SC-001..SC-006)
- [x] Dependencies identified (contract, router template, phase-003 checks)
- [x] Architecture decisions documented (ADR-001..ADR-005)
- [x] Section boundaries for generation fixed (five contract-derivable spans)

### Definition of Done
- [ ] `generate-command-routers.cjs --check` clean on the conformant tree; stale span fails
- [ ] OWNED ASSETS / EXECUTION TARGETS tables uniform across families; parser reads all
- [ ] Three command-local mismatches pass the phase-003 checks and the span-diff
- [ ] Deep routers slimmed, snapshot-verified behavior-preserving
- [ ] `argument-hint` budget WARN and ergonomics WARN checks wired and silent on conformant hints
- [ ] `create-command/SKILL.md` Steps 6/9/11 + create-quality-control gate carry the canon
- [ ] `validate.sh --strict` on this folder is Errors:0 Warnings:0

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Contract-as-single-source generation with a drift gate. The contract derives the structural skeleton; the generator renders and diffs only the derivable spans, leaving the hand-authored behavioral prose untouched (ADR-001).

### Key Components
- **`generate-command-routers.cjs`** (`.opencode/skills/system-spec-kit/scripts/codex/`): reads `command_contract.json`, builds the expected spans, and either writes them or diffs them under `--check`. Composes the drift-gated `buildExpected → check/write` skeleton of `sync-prompts.cjs`, the contract field-reads already in `sk-doc-command.cjs`, and the locked 6-section grammar of `command_router_template.md` (ADR-002).
- **`command_contract.json`** (`.opencode/skills/sk-doc/create-command/assets/`): the single source for per-family `argument-hint`, owned assets, execution targets, mode matrix, and presentation ownership.
- **`command_router_template.md`**: the locked 6-section grammar (ROUTER CONTRACT, OWNED ASSETS, MODE ROUTING, EXECUTION TARGETS, PRESENTATION BOUNDARY, WORKFLOW SUMMARY); OWNED ASSETS is `| Purpose | Asset |`, EXECUTION TARGETS is `| Mode | Target |`.
- **`validate_document.py`**: gains the `argument-hint` budget WARN (G3) and ergonomics WARN (G4) checks.
- **`validate-command-references.cjs` / `sk-doc-command.cjs`**: the reference and adapter layers the ergonomics checks extend and surface through.

### Data Flow
```
command_contract.json ──► buildExpectedSpans() ──► [argument-hint, OWNED ASSETS,
                                                     EXECUTION TARGETS, MODE ROUTING,
                                                     PRESENTATION BOUNDARY]
                                                          │
                              conformant router ──────────┼──► spanDiff()
                                                          │        │
                                                    --check  ──────┴──► clean | drift(diff)
```

### Component Diagram
```
┌──────────────────────────────────────────────────────────────┐
│                 command_contract.json (source)                │
└───────────────┬──────────────────────────────────────────────┘
                │ reads
                ▼
┌──────────────────────────────────────────────────────────────┐
│            generate-command-routers.cjs (G1)                  │
│   buildExpectedSpans()  ──►  write | --check span-diff        │
└───────┬───────────────────────────────────┬──────────────────┘
        │ targets                            │ gated by
        ▼                                    ▼
┌───────────────────┐              ┌───────────────────────────┐
│ .opencode/commands│              │ phase-003 semantic checks │
│  routers (A-W4)   │              │ (gate-obligation, mode,   │
│  + deep assets    │              │  reference coverage)      │
│  (A-G2 slimming)  │              └───────────────────────────┘
└───────┬───────────┘
        │ validated by
        ▼
┌──────────────────────────────────────────────────────────────┐
│  validate_document.py (G3 hint WARN, G4 ergonomics WARN)      │
│  validate-command-references.cjs / sk-doc-command.cjs adapter │
└──────────────────────────────────────────────────────────────┘
```

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup (A-W4 schema standardization)
- [ ] Standardize the OWNED ASSETS table to `| Purpose | Asset |` across families
- [ ] Standardize the EXECUTION TARGETS table to `| Mode | Target |` across families
- [ ] Confirm the create family's divergent tables match the `command_router_template.md` shapes

### Phase 2: Generator + drift gate (G1, REQ-001)
- [ ] Scaffold `generate-command-routers.cjs` as a sibling to `sync-prompts.cjs`
- [ ] Implement `buildExpectedSpans()` reading `command_contract.json`
- [ ] Implement section-scoped write and `--check` span-diff
- [ ] Confirm `--check` clean on the conformant tree and failing on a staled span

### Phase 3: Command-local fixes (G2, REQ-003)
- [ ] Repair `deep/research.md` timeout claim
- [ ] Repair `memory/save.md` hint / fallback text
- [ ] Repair create-family `.txt` presentation-ownership labels
- [ ] Confirm the phase-003 checks and the span-diff pass for these files

### Phase 4: Deep-router slimming (A-G2, REQ-004)
- [ ] Snapshot the current `deep/*` dispatch behavior
- [ ] Move display-box and autonomous-directive prose into the asset the boundary names
- [ ] Confirm the routers keep gates, binding, mode-selection, and summary
- [ ] Confirm behavior-preserving against the snapshot

### Phase 5: Hint budget + ergonomics canon (G3/G4, REQ-005/006)
- [ ] Add the `argument-hint` ≤140-char budget WARN to `validate_document.py`
- [ ] Wire the hint principle into `create-command/SKILL.md` Step 6 and `command_template.md`
- [ ] Add the ergonomics WARN checks (loader gating, agent-existence, raw-echo deprecation, self-sufficiency)
- [ ] Wire the ergonomics canon into Steps 6/9/11 and the create-quality-control gate
- [ ] Record the `routing_source` sub-item as deferred to phase 004

### Phase 6: Full gate set (Verification)
- [ ] Run the generator `--check`, phase-003 checks, `validate_document.py`, and `validate.sh --strict`
- [ ] Reconcile the doc set to the built state

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Target |
|-----------|-------|-------|--------|
| Drift gate | Contract-derivable spans | `generate-command-routers.cjs --check` | Clean on conformant tree; fails on staled span |
| Parse uniformity | OWNED ASSETS / EXECUTION TARGETS tables | Generator uniform parser | All six families parsed with no dialect |
| Semantic | Command-local G2 fixes | phase-003 gate-obligation / mode-completeness / reference coverage | No exceptions for the three fixed files |
| Behavior snapshot | Deep-router slimming | Dispatch snapshot compare | Behavior-preserving |
| Validator WARN | Hint budget + ergonomics | `validate_document.py` | Over-budget warns; conformant silent; never hard-fail |
| Strict | Packet docs | `validate.sh --strict` | Errors:0 Warnings:0 |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `command_contract.json` (phase 001) | Internal | Shipped | No single source to generate from |
| `command_router_template.md` grammar | Internal | Shipped | Generator has no stable parse target |
| phase-003 semantic checks | Internal | Materialized | G2 acceptance cannot be gated |
| `sync-prompts.cjs` skeleton precedent | Internal | Present | Generator loses its drift-gate precedent |
| phase 004 `routing_source` field | Internal | Planned | Subaction-router naming stays deferred (by design, ADR-005) |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The generator rewrites hand-authored prose, deep-router slimming changes behavior, or the WARN checks produce unacceptable noise.
- **Procedure**: Revert `generate-command-routers.cjs` and the standardized tables; restore the pre-slimming `deep/*` routers from the snapshot; disable the G3/G4 WARN checks in the validators. No runtime dispatch behavior changes, so rollback is doc/validator-scoped plus router-text restoration.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (A-W4 tables) ──► Phase 2 (Generator+gate) ──► Phase 3 (G2 fixes) ──► Phase 6 (Full gate)
                                                   └──► Phase 4 (A-G2 slim) ──┘
                                                   └──► Phase 5 (G3/G4 canon) ┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| A-W4 tables | Contract, template grammar | Generator |
| Generator + gate | A-W4 tables | G2 fixes, Full gate |
| G2 fixes | Generator, phase-003 checks | Full gate |
| A-G2 slimming | Contract (ownership), snapshot | Full gate |
| G3/G4 canon | Validators, SKILL Steps | Full gate |
| Full gate | All | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| A-W4 tables | Low | 3 hours |
| Generator + gate | High | 8 hours |
| G2 fixes | Low | 2 hours |
| A-G2 slimming | Medium | 5 hours |
| G3/G4 canon | Medium | 5 hours |
| Full gate | Low | 2 hours |
| **Total** | | **25 hours (~3 days)** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-implementation Checklist
- [ ] Deep-router dispatch snapshot captured before slimming
- [ ] Conformant `.opencode/commands/` tree tagged as the `--check` baseline
- [ ] Contract version pinned for the generation run

### Rollback Procedure
1. **Immediate**: Disable the G3/G4 WARN checks in `validate_document.py`
2. **Revert generator**: Remove `generate-command-routers.cjs`; the routers are plain files again
3. **Restore tables/routers**: `git checkout` the standardized tables and slimmed `deep/*` routers
4. **Verify**: Re-run the phase-003 checks and `validate.sh --strict` on the reverted state
5. **Record**: Note the rollback reason in implementation-summary.md

### Data Reversal
- **Has data migrations?** No — this phase is generator + validator + router text only
- **Reversal procedure**: `git checkout` the affected router/asset/validator files

<!-- /ANCHOR:enhanced-rollback -->
---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌───────────────────┐
│  A-W4 tables      │
│  (Phase 1)        │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│  Generator + gate │
│  (Phase 2)        │
└─────────┬─────────┘
          │
     ┌────┼───────────────┬───────────────┐
     ▼    ▼               ▼               │
┌─────────┐   ┌───────────────┐   ┌───────────────┐
│ G2 fix  │   │ A-G2 slim     │   │ G3/G4 canon   │
│(Phase 3)│   │ (Phase 4)     │   │ (Phase 5)     │
└────┬────┘   └───────┬───────┘   └───────┬───────┘
     │                │                   │
     └────────────────┼───────────────────┘
                      ▼
             ┌───────────────────┐
             │  Full gate        │
             │  (Phase 6)        │
             └───────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| A-W4 tables | Contract, template | Uniform parse target | Generator |
| Generator | A-W4 tables, contract | Spans + `--check` gate | G2 fixes, Full gate |
| G2 fixes | Generator, phase-003 | Contract-conformant routers | Full gate |
| A-G2 slimming | Snapshot, ownership | Lean deep routers | Full gate |
| G3/G4 canon | Validators, SKILL | WARN checks + canon | Full gate |
| Full gate | All | Strict-clean packet | None |

<!-- /ANCHOR:dependency-graph -->
---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **A-W4 table standardization** - 3 hours - CRITICAL (parse target for the generator)
2. **Generator + `--check` gate** - 8 hours - CRITICAL
3. **G2 command-local fixes** - 2 hours - CRITICAL (gated by the generator + phase-003 checks)
4. **Full gate set** - 2 hours - CRITICAL

**Total Critical Path**: 15 hours

**Parallel Opportunities**:
- A-G2 deep-router slimming can proceed alongside the G2 fixes once the generator exists
- G3/G4 canon and WARN checks are independent of the generator and can be built in parallel
- Snapshot capture for slimming can happen during Phase 1

<!-- /ANCHOR:critical-path -->
---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Uniform tables | A-W4 tables match template; parser reads all families | Day 1 |
| M2 | Generator live | `--check` clean on conformant tree, fails on staled span | Day 2 |
| M3 | Command-local clean | G2 fixes pass phase-003 checks + span-diff | Day 2 EOD |
| M4 | Routers slimmed | Deep routers behavior-preserving, snapshot-verified | Day 3 AM |
| M5 | Canon + gate green | G3/G4 WARN checks wired; `validate.sh --strict` Errors:0 | Day 3 EOD |

<!-- /ANCHOR:milestones -->
---

<!-- ANCHOR:l3-adr-summary -->
## L3: ARCHITECTURE DECISION SUMMARY

See `decision-record.md` for full ADRs:

| ADR | Decision | Rationale |
|-----|----------|-----------|
| ADR-001 | Section-scoped generation, not whole-file | Contract derives structure, not hand-authored behavioral prose |
| ADR-002 | Greenfield generator composing three precedents | Reuse the drift-gate skeleton, contract reads, and locked grammar |
| ADR-003 | Extend existing validators, no parallel lint engine | New checks live in the current validator layer |
| ADR-004 | G3/G4 heuristics ship as validator-WARN | Noisy until measured; keep warn-only pending allowlist tuning |
| ADR-005 | Defer subaction-router `routing_source` naming to phase 004 | The field is unset for all families; phase 004 authors it |

<!-- /ANCHOR:l3-adr-summary -->
---

<!-- ANCHOR:ai-protocol -->
## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Read the target file before editing (Law: READ FIRST)
- [ ] Confirm the task is in scope per spec.md §3 Files to Change (Law: SCOPE LOCK)
- [ ] Confirm the phase-001 `command_contract.json` and the router-template grammar are present
- [ ] Capture the `deep/*` dispatch snapshot before any A-G2 slimming

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Execute in order: A-W4 tables → generator + `--check` → G2 fixes → A-G2 slimming → G3/G4 canon → full gate |
| TASK-SCOPE | Touch only the files in spec.md §3 Files to Change; no adjacent cleanup |
| TASK-GATE | Do not claim done until `generate-command-routers.cjs --check` and `validate.sh --strict` both pass |
| TASK-CONTRACT | Read family behavior from `command_contract.json`; never re-hard-code family names or table shapes |

### Status Reporting Format
Report each task as `T### [status] — evidence (file:line / command / --check verdict)`, distinguishing confirmed claims (with a receipt) from inferred ones.

### Blocked Task Protocol
If a task is BLOCKED — a missing contract field, a span-boundary ambiguity, or a phase-003 check conflict — mark it `[B]`, record the blocker in `_memory.continuity.blockers`, and halt for a decision rather than hand-rolling a workaround. The `routing_source` sub-item is pre-classified as deferred to phase 004, not blocked.

<!-- /ANCHOR:ai-protocol -->
