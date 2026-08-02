---
title: "Implementation Plan: Code README Standard And Enforcement"
description: "Two-halves plan for child 001: settle three operator rulings as ADRs, restate the standard on the authoring surfaces, then build a fixture corpus before an opt-in code-folder validator mode and a durable-directory auditor rewrite."
trigger_phrases:
  - "code readme standard plan"
  - "readme enforcement plan"
  - "code readme validator mode"
importance_tier: "normal"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/sk-doc/022-code-readme-coverage/001-code-readme-standard-and-enforcement"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the two-halves plan (ruling then enforcement) for the code README standard"
    next_safe_action: "Confirm all 10 findings against HEAD and escalate Q1/Q2/Q3 (Phase 1)"
    blockers:
      - "Operator rulings Q1, Q2, Q3 required before Phase 2 can start"
    key_files:
      - ".opencode/specs/sk-doc/022-code-readme-coverage/001-code-readme-standard-and-enforcement/spec.md"
      - ".opencode/specs/sk-doc/022-code-readme-coverage/001-code-readme-standard-and-enforcement/plan.md"
      - ".opencode/specs/sk-doc/022-code-readme-coverage/001-code-readme-standard-and-enforcement/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "022-001-code-readme-standard-and-enforcement"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Q1: tree vs table equivalence"
      - "Q2: format-rule applicability scope"
      - "Q3: equivalent orientation"
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

# Implementation Plan: Code README Standard And Enforcement

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3 (`validate_document.py`, `audit_readmes.py`), JSON rule data, Markdown authoring surfaces |
| **Test harness** | The existing `sk-doc/scripts/tests/` suite |
| **Consumers** | CI workflows that call the document validator; the create-readme authoring workflow; children `002`, `003` and `036/019` |
| **Change class** | Standard change + validator code change. Not documentation-only. |

### Overview

Two halves, strictly ordered. First the ruling: three questions settled and recorded as ADRs, then the authoring surfaces edited so the rule is stated rather than inferred and the `hvr-rules.md` contradiction is gone. Second the enforcement: a fixture corpus written *before* the validator mode so the mode is developed against a fixed target, an opt-in code-folder mode in `validate_document.py`, and a rewritten discovery path in `audit_readmes.py` that walks a durable-directory manifest across every repository root with codified path-class exclusions.

The ordering is not stylistic. The validator mode encodes the ruling; writing it first would bake in a guess.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] All 10 findings confirmed against HEAD using the supplied current-line confirmation
- [x] Operator rulings Q1, Q2, Q3 received
- [x] The durable-directory manifest re-frozen at current HEAD, with 585 derived directories against the 501 prose baseline
- [x] The CI and script blast radius of `validate_document.py` enumerated

### Definition of Done
- [x] Every negative fixture fails with its expected rule id; the flat-table equivalence and conformant control pass
- [x] Verdict dump over existing READMEs is byte-identical pre/post
- [x] `rg -n "with anchors|TOC entries match" hvr-rules.md` returns only lines explicitly scoped away from code-folder READMEs
- [x] Auditor reproduces the raw candidate set and records named exclusions and gaps
- [x] `validate.sh --strict` → Errors: 0
- [x] Every ADR has status Accepted
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Components

- **The ruling** — `decision-record.md` ADRs. The durable artifact `002`, `003` and `019` cite.
- **Authoring surface** — `sk-create-readme/SKILL.md` §6, `assets/readme-code-template.md`, `references/readme/quality-and-checklist.md`. Human-facing statement of the ruling.
- **Machine rule data** — `shared/assets/template-rules.json`. A `documentTypes` entry for the code-folder class, sibling to the existing narrow `readme` entry which stays untouched.
- **Validator mode** — `shared/scripts/validate_document.py`. New opt-in branch; the existing README branch is not modified.
- **Auditor discovery** — `sk-create-readme/scripts/audit_readmes.py`. `find_readmes()` replaced by a manifest walk plus an exclusion classifier.
- **Fixture corpus** — `sk-doc/scripts/tests/`. One directory per defect class plus a conformant control.

### Rule set the mode implements

| Rule | Check | Ruling dependency |
|------|-------|-------------------|
| Directory Tree presence | Fenced tree required per the ruling's folder-shape condition | Q1 |
| H2 separators | `---` between numbered H2 sections | Q2 |
| H2 numbering and casing | Sequential numbered ALL-CAPS; `9A`-style non-sequential rejected | Q2 |
| Fence language tags | Every fenced block carries a language tag | Q2 |
| No TOC / no anchor comments | Absent from code-folder READMEs | Q2 + REQ-003 |
| Local link resolution | Every relative link and inline-code path resolves from the README's own location | none |
| Durability | No packet/phase IDs, ADR ids, commit hashes, or `.opencode/specs/` paths | none |

### Data flow

```text
directory manifest ──> auditor walk ──> exclusion classifier ──> gap report
                                              │
                                              └──> audited README set ──> validator (code-folder mode) ──> per-rule verdicts
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Confirm and decide
- [x] Re-verify all 10 findings against HEAD, recording confirmed / drifted / refuted per ID
- [x] Escalate Q1, Q2, Q3 once, together, with the research recommendations attached
- [x] Record the rulings as ADRs in `decision-record.md`

### Phase 2: Authoring surface
- [x] State the tree rule and the format-rule scope in `SKILL.md` §6
- [x] Align the code template scaffold (frontmatter, tagline, tree block) with the ruling
- [x] Reconcile `quality-and-checklist.md` with the ruling
- [x] Remove or scope away the `hvr-rules.md` anchor/TOC requirement

### Phase 3: Fixtures first
- [x] Author one negative fixture per defect class: no tree, incomplete flat inventory, missing separators, unnumbered H2, non-sequential H2, untagged fence, broken relative link, packet-ID text, TOC/anchor comments
- [x] Author the fully conformant control fixture, including a legitimate example command so the durability grep is tested against a false-positive case
- [x] Author exclusion fixtures for the 21 disposition path classes

### Phase 4: Validator mode
- [x] Add the code-folder `documentTypes` entry to `template-rules.json`
- [x] Implement the opt-in mode in `validate_document.py` against the fixture corpus
- [x] Capture the pre-change verdict dump over existing READMEs, re-run post-change, diff

### Phase 5: Auditor discovery
- [x] Replace `find_readmes()` with a manifest walk across all repository roots
- [x] Implement the exclusion classifier over named path classes
- [x] Assert the raw candidate set and the reduced actionable set against the frozen manifest

### Phase 6: Verification
- [x] Full fixture suite green
- [x] Existing validator suite green
- [x] Contradiction, discovery and verdict-parity gates all pass
- [x] `validate.sh --strict` → Errors: 0
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Target |
|-----------|-------|-------|--------|
| Negative fixtures | One per defect class | `sk-doc/scripts/tests/` harness | Every negative flagged with the expected rule id |
| Positive control | Conformant README incl. a legitimate example | Same | Zero findings |
| Exclusion fixtures | 21 disposition path classes | Same | Reported as exclusions, never as gaps |
| Regression parity | 379 existing READMEs | Verdict dump + diff | Byte-identical pre/post |
| Discovery assertion | Frozen 501-dir manifest | Auditor run | Raw candidate set reproduced; reduced set matches the agreed list |
| Contradiction gate | `hvr-rules.md` | `rg` | Zero unscoped matches |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Operator rulings Q1/Q2/Q3 | External | Accepted | Recorded in ADR-001..003 and applied to authoring, validator, and auditor |
| Frozen 501-dir manifest | Internal | Available (2026-07-30) | Re-freeze at T001 if HEAD moved |
| `sk-doc/scripts/tests/` harness | Internal | Available | Fixtures need a new harness |
| CI call sites of the validator | Internal | To enumerate | Risk of breaking pipelines on landing |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any existing README verdict changes, or a CI pipeline that consumes the validator fails.
- **Procedure**: revert the `validate_document.py` and `template-rules.json` commits — the mode is opt-in, so reverting restores the exact prior code path. Authoring-surface edits and the ADRs may stay; they are inert without the tooling.
- **Data reversal**: none. No migrations, no generated state.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 (confirm + decide) ──> Phase 2 (authoring surface)
                          └──> Phase 3 (fixtures) ──> Phase 4 (validator) ──> Phase 6 (verify)
                                                 └──> Phase 5 (auditor) ────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1 Confirm + decide | None | All |
| 2 Authoring surface | 1 | 6 |
| 3 Fixtures | 1 | 4, 5 |
| 4 Validator | 1, 3 | 6 |
| 5 Auditor | 1, 3 | 6 |
| 6 Verification | All | Downstream `002` (c), `003`, `019` |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-implementation checklist
- [ ] Verdict dump over existing READMEs captured and stored as the baseline
- [ ] CI call sites of `validate_document.py` enumerated and recorded

### Rollback procedure
1. Revert the validator and rule-data commits.
2. Re-run the verdict dump; confirm it matches the stored baseline.
3. Leave the ADRs in place — the ruling is still the ruling.
<!-- /ANCHOR:l2-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌────────────────────┐     ┌──────────────────────┐     ┌───────────────────┐
│ Operator rulings    │────►│ Phase 1: Confirm and  │────►│ Phase 2: Authoring │
│ Q1/Q2/Q3 (external)  │     │ decide (ADRs)         │     │ surface            │
└────────────────────┘     └──────────┬───────────┘     └────────┬──────────┘
                                       │                          │
                                       ▼                          │
                            ┌────────────────────┐                │
                            │ Phase 3: Fixtures    │                │
                            │ first                │                │
                            └──────┬───────┬──────┘                │
                                   │       │                       │
                                   ▼       ▼                       │
                     ┌────────────────┐ ┌────────────────┐         │
                     │ Phase 4:        │ │ Phase 5:        │         │
                     │ Validator mode  │ │ Auditor discov. │         │
                     └────────┬───────┘ └────────┬───────┘         │
                              │                   │                 │
                              └─────────┬─────────┘                 │
                                        ▼                            ▼
                              Phase 6: Verification ◄─────────────────┘
                                        │
                                        ▼
                     Downstream: 002 (class c), 003, 036/019
```

External dependencies (from §6 DEPENDENCIES) gate Phase 1 and Phase 2 directly: the operator rulings are a hard blocker on all authoring-surface work, the frozen 501-dir manifest gates the auditor rewrite (Phase 5), and the enumerated CI call sites gate how safely the validator mode (Phase 4) can land.
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. Confirm findings against HEAD — CRITICAL, blocks everything
2. Operator rulings Q1/Q2/Q3 — CRITICAL, external
3. Fixture corpus — CRITICAL, defines the target
4. Validator code-folder mode — CRITICAL, the gate `003` runs on
5. Verdict-parity check — CRITICAL, the safety property

**Total Critical Path**: findings confirmation → operator rulings → fixture corpus → validator mode → verdict-parity check. Every downstream consumer (`002` class (c), `003`, `036/019`) depends transitively on this chain closing.

**Parallel opportunities**: the authoring-surface edits (Phase 2) and the auditor rewrite (Phase 5) are independent of the validator work once the ruling exists.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|-------------------|--------|
| M1 | Ruling closed | ADR-001 through ADR-004 recorded and (where operator-owned) accepted | End of Phase 1 |
| M2 | Authoring surface restated | `SKILL.md`, code template and checklist reference agree with the ruling; `hvr-rules.md` contradiction scoped away | End of Phase 2 |
| M3 | Fixture corpus complete | Every negative fixture, the conformant control, and the 21 exclusion fixtures exist | End of Phase 3 |
| M4 | Validator mode ships | Opt-in code-folder mode passes the full fixture corpus with a byte-identical verdict-parity diff | End of Phase 4 |
| M5 | Auditor rewrite lands | Manifest-walk discovery reproduces the raw candidate set and reduces it via named exclusions | End of Phase 5 |
| M6 | Program verified | `validate.sh --strict` → Errors: 0; handoff note published for `002`, `003`, `036/019` | End of Phase 6 |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:ai-execution-protocol -->
## AI Execution Protocol

### Pre-Task Checklist

- Read the child contract documents before editing.
- Confirm each requested correction against the cited source and current fixture behavior.
- Keep implementation edits inside the locked editable scope.

### Execution Rules

| Rule | Contract |
|------|----------|
| TASK-SEQ | Capture the README baseline before changing validator code or rule data. |
| TASK-SCOPE | Do not edit existing README content or unrelated skills and runtime files. |
| TASK-VERIFY | Run the complete fixture suite, parity diff, contradiction gate, and strict packet validation. |

### Status Reporting Format

Report each task as completed only with a file, command, or artifact receipt. Keep the packet status In Progress while downstream sweep ownership remains separate.

### Blocked Task Protocol

Mark a task `[B]` with its blocking decision or missing external state when execution cannot proceed. Do not infer approval or substitute a workflow without recording the deviation.
<!-- /ANCHOR:ai-execution-protocol -->

---

<!-- ANCHOR:l3-adr-summary -->
## L3: ARCHITECTURE DECISION SUMMARY

See `decision-record.md` for full ADRs.

| ADR | Decision | Status |
|-----|----------|--------|
| ADR-001 | Tree-vs-table equivalence rule | Accepted — **[OPERATOR-DECISION: Q1 — tree vs table]** |
| ADR-002 | Scope of the general format rules over code-folder READMEs | Accepted — **[OPERATOR-DECISION: Q2 — format-rule applicability]** |
| ADR-003 | Content-defined equivalent orientation accepted in place of `README.md` | Accepted — **[OPERATOR-DECISION: Q3 — equivalent orientation]** |
| ADR-004 | Code-folder validator mode is opt-in, never default-on | Accepted |
<!-- /ANCHOR:l3-adr-summary -->
