---
title: "Implementation Plan: Phase 1: source-inventory-and-placement"
description: "A read-only inventory of the lieflat-charts clone and an evidence-backed placement verdict, measured by two scripts whose output is reconciled against independent counts."
trigger_phrases:
  - "implementation"
  - "plan"
  - "name"
  - "template"
  - "plan core"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: source-inventory-and-placement

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM for the scanner and classifier, `python3` for the independent recount |
| **Framework** | None. Two short scripts, no dependency beyond the standard library |
| **Storage** | TSV in `scratch/`, markdown in the packet |
| **Testing** | Reconciliation against a second tool, rather than unit tests over a one-shot script |

### Overview
Every file in the clone gets a disposition, and the placement question gets an answer produced by
measuring the alternatives rather than by reading the skill's name. Nothing is written into
`.opencode/skills/`, which is what makes a wrong answer here cheap and a wrong answer in phase 3
expensive. The approach is deliberately script-first: a hand-built inventory of 124 files drifts
from the tree it describes, so both the scan and the classification are regenerable.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A three-stage pipeline, each stage a separate script so a mistake in one is visible rather than
absorbed by the next.

### Key Components
- **`scratch/scan-source.mjs`**: Walks the tree and emits one row per file. Decides text against
  binary by NUL byte and UTF-8 decodability rather than by extension, because an extension split
  silently skips the census on a mislabelled file.
- **`scratch/classify.mjs`**: Applies one ordered rule list to assign each row a disposition. The
  final rule is a catch-all that exits non-zero, so an unclassified file fails the run instead of
  passing quietly.
- **`scratch/emit-tables.mjs`**: Renders the classified rows into the tables the inventory
  publishes, so the document is regenerated rather than hand-maintained.

### Data Flow
Clone → `scan.tsv` (124 rows: bytes, class, lines, Han, CJK punctuation) → `classified.tsv` (the
same rows plus a disposition and a reason) → `tables.md` → spliced into `research/inventory.md`.
The placement decision runs alongside on a separate input: measurements of the 14 existing hub
mode folders and the 9 standalone siblings, which feed `decision-record.md` directly.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

Not applicable. This phase is not a bug fix and touches no runtime surface. The table is kept
because the template owns it, and filled with the one row that is true.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/**` | The tree this packet will eventually write into | Not a consumer yet. This phase reads it and writes nothing to it | `git status` shows changes only under this packet's own folder |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The proof here is reconciliation, not assertion. A one-shot script that counts files is best
checked by counting them again with a different tool, because a unit test over the script would
only confirm the script agrees with itself.

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Not applicable. The scripts run once and their output is checked directly | - |
| Integration | File-set reconciliation: the scanner's 124 paths against `git ls-files` | `diff` |
| Integration | Census reconciliation: a Unicode range regex against `unicodedata.name()` | `node`, `python3` |
| Manual | Sampling the Chinese in a colour file and a template to confirm it is prose and not a structural key | `grep` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The `lieflat-charts` clone in scratch | External | Green | Every measurement stops. Refetch at commit `4eef5ce` from the URL recorded in the inventory |
| `node` and `python3` | Internal | Green | The two independent counts collapse into one, and the census loses its cross-check |
| Read access to `.opencode/skills/sk-doc/` | Internal | Green | The placement comparison cannot be measured and the decision would fall back to reading the name |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The placement verdict is overturned, or a measurement is found to be wrong.
- **Procedure**: Delete this phase folder's `research/` and `decision-record.md`. Nothing outside
  this packet was touched, so there is no other state to unwind. The scripts in `scratch/` make
  the measurements reproducible, so a disputed number is rechecked rather than argued about.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Read the brief, load the rules, capture the baseline |
| Core Implementation | Medium | The scan and classification are quick. The placement comparison is the real work |
| Verification | Low | Two reconciliations and a validation run |
| **Total** | | **One session, no external dependency beyond the clone** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (not applicable, no data changes and no file outside this packet is touched)
- [x] Feature flag configured (not applicable)
- [x] Monitoring alerts set (not applicable)

### Rollback Procedure
1. Nothing to disable. This phase changed no behaviour.
2. `git checkout -- specs/sk-doc/051-sk-create-chart/001-source-inventory-and-placement`, or delete
   the two authored documents if the packet was never staged.
3. Re-run `validate.sh` on the folder and confirm it returns to its prior state.
4. Not user-facing. Tell whoever is running phase 2, because the census sizes their work.

### Data Reversal
- **Has data migrations?** [Yes/No]
- **Reversal procedure**: [Steps or "N/A"]
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phase 1   │────►│   Phase 2   │────►│   Phase 3   │
│   Setup     │     │    Core     │     │   Verify    │
└─────────────┘     └──────┬──────┘     └─────────────┘
                          │
                    ┌─────▼─────┐
                    │  Phase 2b │
                    │  Parallel │
                    └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Source scan | The clone | `scan.tsv` | Classification, census |
| Classification | Source scan | `classified.tsv` | The inventory tables |
| Hub comparison | Read access to the skills tree | Mode and sibling measurements | The placement decision |
| Placement decision | Hub comparison | `decision-record.md` ADR-001 | Phase 3, phase 5 |
| Licence and asset tracing | The clone, this repository's LICENSE | ADR-002, ADR-003 | Phase 4 |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Hub comparison** - the longest single step - CRITICAL
2. **Placement decision** - blocked until the comparison exists - CRITICAL
3. **Reconciliation and validation** - blocked until the inventory exists - CRITICAL

**Total Critical Path**: comparison, then decision, then verification.

**Parallel Opportunities**:
- The source scan and the hub comparison share no input and were run concurrently.
- Licence and binary-asset tracing runs alongside the classification.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Every file classified | `classify.mjs` exits 0 with 124 rows and no unclassified file | This phase |
| M2 | Placement decided | The comparison table exists and the losing option is named with its reason | This phase |
| M3 | Counts trustworthy | Both reconciliations agree and `validate.sh --strict` reports `RESULT: PASSED` | This phase |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

The decisions live in `decision-record.md`, which is the document the level-3 contract gives them
to. Summarised here only so this plan is readable on its own.

### ADR-001: sk-create-chart is a workflow mode packet under the sk-doc hub

**Status**: Accepted

**Context**: The packet name suggests a documentation-hub mode, while the subject sits further
from documentation than any current sibling. Phase 3 builds to the answer.

**Decision**: A workflow mode packet at `.opencode/skills/sk-doc/sk-create-chart/`.

**Consequences**:
- Phase 3 scaffolds a mode packet, and phase 5 follows the documented eleven-surface registration.
- `sk-doc` widens into data visualization, mitigated by keeping the new aliases narrow and
  replaying each against an out-of-domain phrase before shipping.

**Alternatives Rejected**:
- Standalone skill: the overlap with `sk-create-diagram` exists either way, and only a hub has the
  `routerPolicy.tieBreak` machinery to resolve it. Full reasoning in `decision-record.md`.
- Surface packet: ruled out by contract, since a surface packet is read-only reference material
  and this has its own lifecycle.

---


<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->
