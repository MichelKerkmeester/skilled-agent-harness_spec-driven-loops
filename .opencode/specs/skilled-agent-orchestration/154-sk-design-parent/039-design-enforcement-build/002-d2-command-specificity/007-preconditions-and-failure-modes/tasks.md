---
title: "Tasks: D2-R7 — Preconditions & named failure modes for the /design:* surface"
description: "Ordered build tasks with verification for adding preconditions to command-metadata.json, generating wrapper Requires/Ask-first/Cannot-run/Escalate sections, and extending design-command-surface-check.mjs to ban status-only failure."
trigger_phrases:
  - "d2-r7 preconditions failure modes tasks"
  - "design command preconditions tasks"
  - "named failure modes tasks"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/007-preconditions-and-failure-modes"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Mark all 22 tasks complete with checker evidence"
    next_safe_action: "Run D2-R8 register-pinning phase for the /design surface"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-29-d2-r7-preconditions-and-failure-modes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: D2-R7 — Preconditions & named failure modes for the /design:* surface

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Extend the SSOT (45–60 min)

- [x] T001 Confirm the D2-R3 baseline is green: `node .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` → `invalid=0 drift=0` before any edit [10m] — baseline confirmed pre-build
- [x] T002 Add a `preconditions{ requiredInputKind, missingInputQuestion, cannotRunWhen, escalateIf, routeInstead }` object to each of the five records, using the `plan.md` §3 authored table (`.opencode/skills/sk-design/command-metadata.json`) [25m] — `"preconditions"` count = 5
- [x] T003 Reconcile each record's `preconditions` with its existing `accepts` (input kind), `argumentHint` (the tokens the `missingInputQuestion` asks for), and `deferToHubWhen` (the `routeInstead` condition) [15m] — per-record reconciliation authored
- [x] T004 Confirm valid JSON, five records, and no spec/packet/phase ID or spec path embedded (evergreen [HARD]) [5m] — `require()` parses, records=5, grep clean

**Verify Phase 1:** JSON parses; exactly 5 records; every record has `preconditions` with five non-empty string sub-fields.

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Generate the wrapper sections (1–1.5 h)

- [x] T005 [P] Insert the generated PRECONDITIONS block in `audit.md`, projected from its `preconditions` (`.opencode/commands/design/audit.md`) [15m] — landed at `## 3. PRECONDITIONS` (audit.md:28)
- [x] T006 [P] Same for `foundations.md` (`.opencode/commands/design/foundations.md`) [10m] — `## 3. PRECONDITIONS` present
- [x] T007 [P] Same for `interface.md` (`.opencode/commands/design/interface.md`) [10m] — `## 3. PRECONDITIONS` present
- [x] T008 [P] Same for `md-generator.md` (`.opencode/commands/design/md-generator.md`) [10m] — `## 3. PRECONDITIONS` present
- [x] T009 [P] Same for `motion.md` (`.opencode/commands/design/motion.md`) [10m] — `## 3. PRECONDITIONS` present
- [x] T010 Upgrade each Return-Status step to the named grammar (`STATUS=OK` / `STATUS=ASK MISSING=` / `STATUS=FAIL ERROR=<named-cause>` / `STATUS=DEFER ROUTE=`); delete every `STATUS=FAIL ERROR="<message>"` placeholder [20m] — named tokens 5/5; bare placeholder 0/5
- [x] T011 Confirm each wrapper's frontmatter (`description`, `argument-hint`, `allowed-tools`) is byte-unchanged so existing drift stays 0 [10m] — frontmatter drift channel = 0

### Extend the checker (1–1.5 h)

- [x] T012 Add `preconditions` to `REQUIRED_FIELDS`; validate it is an object whose five sub-fields are each a non-empty string → violations exit 2 (INVALID) (`.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs`) [25m] — Stage 1 extended; empty sub-field → INVALID
- [x] T013 Add the Stage-2 wrapper-body rule: require the four markers `Requires:` / `Ask-first:` / `Cannot-run:` / `Escalate:` in each wrapper body [20m] — markers present 5/5
- [x] T014 Ban status-only failure in Stage 2: fail any wrapper containing `ERROR="<message>"` or lacking the named-route tokens (`STATUS=ASK` and `STATUS=DEFER`/`ROUTE=`); report as drift `field: "preconditions"` (exit 1) [20m] — placeholder banned (0/5); named tokens required (5/5)
- [x] T015 Run `node --check` on the checker; confirm no spec/packet/phase ID or spec path is embedded (evergreen [HARD]) [10m] — NODE_CHECK=OK; grep clean

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Verify the gate (30–45 min)

#### Functional
- [x] T016 Run `node design-command-surface-check.mjs` → `invalid=0`, `drift=0`, exit 0 (additive, no regression) [10m] — STATUS=PASS invalid=0 drift=0
- [x] T017 Negative control: temporarily break one record's `preconditions` → checker exits 2 (INVALID); restore [5m] — empty `cannotRunWhen` → STATUS=INVALID invalid=1; restored to invalid=0 drift=0
- [x] T018 Negative control: temporarily re-add `ERROR="<message>"` to one wrapper → checker reports `preconditions` drift, exit 1; restore [5m] — status-only-failure ban verified via the same gate

#### Integrity
- [x] T019 Confirm `mode-registry.json` is byte-unchanged (sha / `git diff`) [5m] — `git diff` empty
- [x] T020 Confirm `git status` shows only the seven intended targets changed (metadata, five wrappers, checker) [5m] — porcelain lists exactly the seven

#### Documentation
- [x] T021 Re-read the three artifacts; confirm evergreen (no IDs/paths in metadata, wrappers, or checker); `node --check` passes [5m] — NODE_CHECK=OK; grep clean
- [x] T022 Mark all checklist items with evidence; author `implementation-summary.md` [10m] — checklist 27/27; impl summary authored

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `command-metadata.json` validates (5 records, each with a five-field `preconditions`)
- [x] Every wrapper carries the generated sections and a named-route failure grammar; no `ERROR="<message>"` placeholder remains
- [x] `node design-command-surface-check.mjs` passes additively (`invalid=0 drift=0`, exit 0)
- [x] `mode-registry.json` byte-unchanged; checker `node --check` clean
- [x] `checklist.md` fully verified

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Research**: See `037-design-routing-and-integration-research/research/research.md` §5 (D2-R7)
- **Upstream SSOT**: See sibling `003-command-metadata-ssot` (D2-R3) — the record shape + checker extended here

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Core + Level 2 detail (effort estimates + explicit verification tasks)
- Adds preconditions to command-metadata.json, generates wrapper sections, extends the surface-check
- Strictly additive: frontmatter frozen, mode-registry untouched, final drift=0
-->
