---
title: "Feature Specification: large-surface catalog reconciliation"
description: "The two catalog surfaces outside every gate are the two that most need one: system-spec-kit (348 leaves, 94 orphans, eight registered MCP tools with no root mention, two leaves publishing obsolete contracts) and the system-deep-loop nested runtime and benchmark catalogs (75 leaves, whole undocumented typed-spine domains, two stale executor rosters, 22 leaves carrying forbidden packet-history metadata). This phase reconciles both, with the typed-spine rollout state adjudicated externally rather than guessed."
trigger_phrases:
  - "spec-kit catalog reconciliation"
  - "deep-loop runtime catalog typed spine"
  - "missing MCP tools catalog root"
  - "executor roster derived catalog"
  - "source phase metadata cleanup"
importance_tier: "high"
contextType: "planning"
parent: "sk-doc/023-feature-catalog-integrity"
_memory:
  continuity:
    packet_pointer: "sk-doc/023-feature-catalog-integrity/003-large-surface-catalog-reconciliation"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the large-surface reconciliation phase from the track C synthesis"
    next_safe_action: "Run T001 confirm-against-HEAD, then build the Lane B rollout-state evidence table"
    blockers:
      - "Q5 typed-spine rollout adjudication is owned by the 036 program; Lane B writing is blocked on it"
      - "001 must rule the feature-leaf definition before the 94 orphans can be triaged"
    key_files:
      - "spec.md"
      - "decision-record.md"
    completion_pct: 0
    open_questions:
      - "Q5 who adjudicates typed-spine rollout state"
      - "Q6 volatile-value policy, ruled by 001"
      - "feature-leaf definition, ruled by 001"
    answered_questions: []
---
# Feature Specification: Large-Surface Catalog Reconciliation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

> Phase adjacency under the `sk-doc/023-feature-catalog-integrity` parent: predecessor
> `001-catalog-enforcement-and-coverage` (feature-leaf definition and validator coverage); parallel sibling
> `002-hub-catalog-truth-repair` on disjoint files.

---

## EXECUTIVE SUMMARY

Two surfaces sit outside every automated check and are large enough that manual sweeps will not hold.
`system-spec-kit/feature-catalog` holds 348 leaves and 94 of the repo's 104 orphan leaves; its root claims to inventory
all 41 registered MCP tools while eight of them appear nowhere in it, and two of its leaves publish response contracts
and token budgets that an agent following them will get wrong. The `system-deep-loop` nested `runtime/` and
`deep-improvement/` catalogs hold 75 leaves; the runtime catalog claims a complete 50-entry inventory while whole typed
domains are undocumented, two executor rosters are stale in ways an agent will act on, and 22 leaves carry the
packet-history metadata the standard forbids.

**Key Decisions**: derive executor rosters from source rather than retyping them; triage the 94 orphans individually
against `001`'s feature-leaf definition rather than bulk-linking; produce the typed-spine rollout-state table as
evidence and send it out for adjudication rather than deciding it here.

**Critical Dependencies**: `001`'s feature-leaf definition and validator coverage; the Q5 adjudication from the 036
program owner, which is the single hard external dependency in the whole decomposition.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-30 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent** | `sk-doc/023-feature-catalog-integrity` |
| **Findings** | 9 (7 P1, 2 P2) — the densest P1 concentration per finding in the track |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Both surfaces are structurally outside the validator: `system-spec-kit` because it is a single skill rather than a mode
hub, and the deep-loop catalogs because they are nested rather than hub roots. The consequences are concrete. The
`session_bootstrap` leaf describes a response contract of `profile` / `graph` / `recommendedNextAction` where the live
schema requires `resume` / `health` / `hints` / `nextActions`, so an agent following the leaf parses the wrong envelope.
The `memory_context` leaf publishes token budgets of 800 / 1500 / 2000 / 1200 against live values of 800 / 3500 / 3000,
so a caller sizing a request against the catalog under-requests by more than half on focused mode. The fan-out leaf
literally reads "all 3 CLI kinds: `cli-opencode`, `cli-claude-code`, `cli-opencode`" — three named kinds, one of them
duplicated, against seven live executor kinds with state directories in the runtime. The model-benchmark dispatcher
leaf claims three executors against five in `KNOWN_EXECUTORS`.

The deep-loop runtime catalog carries a different and more dangerous failure. It claims a complete 50-entry inventory
while `runtime/lib/` holds whole undocumented domains: the authorized ledger, event envelopes, conditional fan-in, mode
contracts, receipts and effect recovery, path-coverage termination, shadow parity, rollback drills, and per-mode typed
implementations with their own unit tests. The standard requires unshipped behavior to be explicitly labeled and to
carry empty or stub source tables. Determining which of those modules is active, shadow-only, dark-but-implemented, or
planned is the real work, and it is a judgment the 036 program owns. Getting it wrong makes the catalog claim that
unshipped runtime behavior ships, which is the one genuinely risky error in this track.

### Purpose
Reconcile both surfaces against their real sources, replace retyped rosters with derived ones so the same drift cannot
recur, and label every typed-spine module with an adjudicated rollout state rather than a guess.

### Non-Goals
- The ten hub-root catalogs. `002` owns those.
- The validator and the standard. `001` owns those.
- Deep-loop READMEs, SKILL.md files, script contracts, and registry rosters, which belong to
  `036/032-docs-drift-and-p2-batch`, and runtime code READMEs, which belong to `036/019-runtime-code-readmes`. Adjacent
  directories, disjoint files.
- Deciding the typed-spine rollout state. This phase produces the evidence table and requests adjudication.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

**Lane A — `system-spec-kit` (348 leaves, 94 orphans, ungated).** Eight registered MCP tools with zero occurrences in
the root; several already have leaves the root simply never links, so this is as much an indexing failure as an
authoring one. The `session_bootstrap` obsolete response contract. The `memory_context` stale token budgets. Four
template-shape defects (three leaves missing `description`, one leaf with `KEY BEHAVIORS` where `SOURCE METADATA`
belongs) and packet-history prose in the root. The 94 orphans are triaged individually against `001`'s feature-leaf
definition, never bulk-linked.

**Lane B — `system-deep-loop` nested catalogs (75 leaves, ungated). Evidence-table-first.** The lane opens by building
a per-module rollout-state table for the typed spine with evidence for each row, and that table is sent for
adjudication before any catalog prose is written. Only after adjudication does the lane author or label module entries.
The parts of Lane B that do not depend on the adjudication — the two stale executor rosters, the 22 `Source phase:`
leaves, and the Lane C benchmark-control omissions — proceed independently.

### Out of Scope
- The ten hub-root catalogs, including the `system-spec-kit` Lane A prose citation that `002` fixes.
- Any runtime code change. Documentation only.
- Deciding rollout state. **OPERATOR-DECISION (Q5).**
- **`RC-008-02`.** Refuted at iteration 9 and confirmed repaired at HEAD. Do not resurrect.

### Findings in Scope

| ID | Sev | Lane | Note |
|----|-----|------|------|
| `RC-003-01` | P1 | A | Canonical root omits eight live MCP tools. Five of eight were sampled and all five returned zero occurrences; T001 completes the check across all 41 `TOOL_DEFINITIONS`. |
| `RC-003-02` | P1 | A | `session_bootstrap` leaf describes an obsolete response contract. An agent following it parses the wrong envelope. |
| `RC-008-01` | P1 | A | `memory_context` mode budgets are stale. A caller sizing against the catalog under-requests by more than half on focused mode. |
| `RC-001-06` | P2 | A | Four template-shape defects plus packet-history prose in the root. |
| `RC-004-01` | P1 | B | Typed runtime spine omitted from the runtime catalog. **Blocked on OPERATOR-DECISION (Q5).** The standard's dark-labeling rule governs the fix: each module labeled active, shadow-only, dark-but-implemented, or planned, with empty or stub source tables for anything not wired. |
| `RC-004-02` | P1 | B | Fan-out executor inventory is stale: the leaf reads "all 3 CLI kinds" and duplicates `cli-opencode` in its own list of three, against seven live kinds. Derive from `executor-config.ts`. **OPERATOR-DECISION (Q6)** for the derive-versus-ban policy. |
| `RC-010-01` | P1 | B | Model-benchmark dispatcher roster claims three against five in `KNOWN_EXECUTORS`. Derive from `KNOWN_EXECUTORS`. |
| `RC-010-02` | P1 | B | Lane C benchmark controls undocumented: compiled-routing parity, typed resource-contract capping, browser and live executor dispatch, multi-probe expansion, parent-hub vocabulary sync. Several are default-off, so dark-labeling applies. |
| `RC-004-04` | P2 | B | 22 runtime leaves carry `Source phase:` metadata the standard forbids as packet-history. |

Count: 9 findings, 7 P1 and 2 P2.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/feature-catalog/feature-catalog.md` | Modify | Tool inventory reconciliation, packet-history prose |
| `.opencode/skills/system-spec-kit/feature-catalog/{retrieval,discovery,tooling-and-scripts,pipeline-architecture,feature-flag-reference,maintenance}/**` | Modify | Contract and budget corrections, template-shape defects, orphan triage |
| `.opencode/skills/system-deep-loop/runtime/feature-catalog/**` | Modify | Typed-spine labeling, derived rosters, `Source phase:` removal |
| `.opencode/skills/system-deep-loop/deep-improvement/feature-catalog/**` | Modify | Model-benchmark roster, Lane C benchmark controls |
| `.opencode/skills/sk-doc/shared/scripts/` | Modify | A tool-reconciliation generator, which is the durable artifact rather than the table it emits |

Read-only truth sources: `system-spec-kit/mcp-server/{tool-schemas.ts,handlers/session-bootstrap.ts,handlers/memory-context.ts,tools/*.ts}`;
`system-deep-loop/runtime/{lib/**,scripts/fanout-run.cjs,executor-config.ts}`;
`deep-improvement/scripts/{model-benchmark/dispatch-model.cjs,skill-benchmark/**}`.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every registered MCP tool appears in the spec-kit root | A generated reconciliation table from `TOOL_DEFINITIONS` shows zero tools absent from the root. The generator, not the table, is the durable artifact. Baseline: 41 registered, 8 absent (5 of 8 sampled and confirmed at zero occurrences). |
| REQ-002 | The `session_bootstrap` leaf matches the live schema | The documented response envelope is asserted against the handler and schema rather than transcribed. Baseline: leaf says `profile` / `graph` / `recommendedNextAction`; live requires `resume` / `health` / `hints` / `nextActions`. |
| REQ-003 | The `memory_context` budgets match the handler | Budgets are asserted against `CONTEXT_MODES` in the handler. Baseline: leaf publishes 800 / 1500 / 2000 / 1200; live is 800 / 3500 / 3000. |
| REQ-004 | Both executor rosters are derived, not retyped | The fan-out roster derives from `executor-config.ts` and the model-benchmark roster from `KNOWN_EXECUTORS`, and a test fails when a new executor is added without a catalog update. This is the check that stops both findings from recurring. |
| REQ-005 | Zero packet-history metadata in the runtime catalog | `rg -c "Source phase" .opencode/skills/system-deep-loop/runtime/feature-catalog/` goes from 22 files to 0. |
| REQ-006 | Every typed-spine module carries an adjudicated rollout label | Each module in the catalog is labeled active, shadow-only, dark-but-implemented, or planned, and the label traces to the adjudicated table, not to an authoring judgment. Anything labeled dark or shadow-only carries an empty or stub SOURCE FILES table. **Blocked on OPERATOR-DECISION (Q5).** |
| REQ-007 | The 94 orphans are classified, not bulk-linked | Each of the 94 is either linked from the root as a feature or classified as a non-feature with a recorded reason, under `001`'s feature-leaf definition. Blind linking would satisfy the checker and corrupt the inventory. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | The four template-shape defects are repaired | Three leaves gain a `description`; the leaf carrying `KEY BEHAVIORS` where `SOURCE METADATA` belongs is corrected. |
| REQ-009 | Packet-history prose is removed from the spec-kit root | No packet or phase identifier remains; source paths only. |
| REQ-010 | Lane C benchmark controls are documented with correct labels | Compiled-routing parity, typed resource-contract capping, browser and live executor dispatch, multi-probe expansion, and parent-hub vocabulary sync each have an entry with an accurate default-off or live-only label. |
| REQ-011 | Both packages pass the widened validator | After `001` lands, both are inside the covered set and `--strict` is clean, with spec-kit orphans at zero by ruling (each either linked or classified). |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A generated 41-tool reconciliation table shows zero tools absent from the spec-kit root, and the
  generator is committed.
- **SC-002**: `rg -c "Source phase"` over the deep-loop runtime catalog goes 22 to 0.
- **SC-003**: Both executor rosters are derived from source, and a test fails when a new executor lands without a
  catalog update.
- **SC-004**: `memory_context` budgets and the `session_bootstrap` envelope are asserted against the handler and
  schema, not transcribed.
- **SC-005**: Every typed-spine module carries a label that traces to the adjudicated table, and every dark or
  shadow-only module carries an empty or stub SOURCE FILES table. A reviewer spot-checks five labels against actual
  command and YAML wiring.
- **SC-006**: Spec-kit orphans go 94 to 0-by-ruling; both packages are `--strict` clean under the widened validator.
- **SC-007**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this folder> --strict` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Q5 adjudication from the 036 program owner | Lane B's typed-spine writing cannot start | Evidence-table-first: build and send the table early; the rest of Lane B proceeds without it |
| Dependency | `001` feature-leaf definition | The 94 orphans cannot be triaged | Lane A's other work proceeds; triage is sequenced last in Lane A |
| Dependency | `001` validator coverage | The strict-clean criterion is unmeasurable | REQ-011 is verified after `001` lands |
| Risk | **A dark module is labeled as shipped** | H | This is the one genuinely risky error in the track. Labels trace to the adjudicated table only; a reviewer spot-checks five against real wiring |
| Risk | The 348-leaf surface is edited faster than it is verified | M | Derive and assert rather than transcribe; the generator is the artifact |
| Risk | `036/032` edits deep-loop docs in the same window | M | Different files but the same facts; whichever lands second links rather than re-states |
| Risk | Bulk-linking the 94 orphans to turn bijection green | H | Explicitly forbidden by REQ-007; each orphan carries a recorded classification |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The tool-reconciliation generator runs in a single pass over `TOOL_DEFINITIONS` and the root catalog, so
  it is cheap enough to run in the same gate as the validator.

### Security
- **NFR-S01**: No leaf documents a credential path, token, or internal-only endpoint.
- **NFR-S02**: A module whose rollout state is unresolved is labeled unresolved, never labeled shipped by default. The
  failure mode is an agent trusting a false claim about a safety-relevant runtime.

### Reliability
- **NFR-R01**: Every roster and budget in these catalogs derives from a source of record and is re-derivable by a
  committed command.
- **NFR-R02**: No runtime code, handler, schema, or script is modified. Catalog markdown plus one generator.

---

## 8. EDGE CASES

### Data Boundaries
- **A tool with a leaf that the root never links.** This is an indexing failure, not an authoring one; link it rather
  than author a duplicate.
- **An orphan that is a category overview.** Classified as a non-feature under the feature-leaf definition, with the
  reason recorded, and excluded from bijection by classification rather than by silence.
- **A module that is implemented and tested but wired behind a default-off flag.** Labeled dark-but-implemented with a
  stub SOURCE FILES table, per the standard.

### Error Scenarios
- **The adjudication returns "unknown" for a module.** Label it unresolved and give it a stub table. Never default to
  shipped.
- **A handler changes between the T001 measurement and the write.** Re-derive at write time; the derived-roster tests
  exist precisely so this is caught rather than shipped.
- **`036/032` has already corrected a fact in a README.** Link to it; do not re-state it in the catalog.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | 348 plus 75 leaves, 94 orphan classifications, one generator |
| Risk | 14/25 | No runtime change, but a mislabeled dark module is a false claim about a safety-relevant runtime |
| Research | 14/20 | Per-module rollout state must be evidenced before it can be adjudicated |
| Multi-Agent | 4/15 | Two lanes, largely sequential within each |
| Coordination | 11/15 | One hard external adjudication plus two `001` rulings plus a concurrent 036 program |
| **Total** | **63/100** | **Level 3** |

Level 3 is earned by the rollout-state adjudication, which decides what the system claims to do, plus the 348-leaf
triage volume.

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A dark or shadow-only module is documented as shipped | H | M | Labels trace to the adjudicated table; reviewer spot-checks five against real wiring; unresolved is a valid label |
| R-002 | Q5 never gets answered and Lane B stalls | M | M | Evidence-table-first, sent early; the non-adjudication parts of Lane B ship independently |
| R-003 | The 94 orphans get bulk-linked to turn bijection green | H | L | REQ-007 forbids it; each classification is recorded |
| R-004 | A derived roster diverges again after a new executor lands | M | M | REQ-004's test fails on a new executor without a catalog update |
| R-005 | Concurrent 036 edits collide on the same facts | M | M | Whichever lands second links rather than re-states |
| R-006 | A transcribed budget or envelope is corrected to another stale value | M | L | Assert against the handler, never against a second reading of the leaf |

---

## 11. USER STORIES

### US-001: An agent sizes a memory request correctly (Priority: P0)

**As an** agent calling `memory_context`, **I want** the catalog's published token budgets to match the handler,
**so that** I do not under-request by more than half on focused mode.

**Acceptance Criteria**:
1. Given the catalog's budget table, When it is compared to `CONTEXT_MODES` in the handler, Then the values match.
2. Given a change to the handler's budgets, When the catalog check runs, Then it fails until the catalog is updated.

### US-002: A reader can tell what actually ships (Priority: P0)

**As a** reader of the deep-loop runtime catalog, **I want** every typed-spine module labeled with its real rollout
state, **so that** I do not build on behavior that is dark or shadow-only.

**Acceptance Criteria**:
1. Given a module labeled active, When its wiring is checked, Then a command or YAML path actually invokes it.
2. Given a module labeled dark or shadow-only, When its leaf is read, Then its SOURCE FILES table is empty or stub-only.

---

## 12. OPEN QUESTIONS

- **OPERATOR-DECISION (Q5)** — Who adjudicates the rollout state of each `system-deep-loop` typed-spine module?
  Recommendation: the 036 program owner, not this packet. This phase produces the candidate table with evidence and
  requests adjudication. This is the single hard external dependency in the decomposition, and Lane B's typed-spine
  writing is blocked on it.
- **OPERATOR-DECISION (Q6)** — Volatile-value policy, ruled by `001`. Governs `RC-004-02` and `RC-010-01`.
  Recommendation: generate structural rosters, ban measurement snapshots.
- Feature-leaf definition, ruled by `001`. Until it lands, the 94 orphans cannot be triaged and bijection cannot be
  turned on for `system-spec-kit`.
- Should the tool-reconciliation generator live in `sk-doc/shared/scripts/` alongside `001`'s count-derivation helper,
  or in the spec-kit tree it reconciles? The shared location is preferred so `001`'s gate can run it.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Rulings**: `../001-catalog-enforcement-and-coverage/decision-record.md`
- **Parent**: See `../spec.md`
