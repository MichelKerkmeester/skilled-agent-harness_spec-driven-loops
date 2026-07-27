---
title: "Feature Specification: sk-design template conformance"
description: "Program parent auditing every folder in every sk-design mode against the sk-doc create-skill templates and standards, fixing the deviations, and honestly de-vendoring an Apache-2.0 dependency, organized into eight per-folder children."
trigger_phrases:
  - "sk-design template conformance"
  - "create-skill template audit"
  - "apache devendoring"
  - "sk-design structural anomalies"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored program parent with 8-child audit baseline"
    next_safe_action: "Author remaining six children; then validate --recursive"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/"
      - ".opencode/skills/sk-design/design-mcp-open-design/"
      - ".opencode/skills/sk-doc/create-skill/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose + sub-phase map only; no plan/tasks/checklist/decision/impl-summary here (those live in child phase folders). -->

# Feature Specification: sk-design template conformance

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Structure** | Phase Parent lean trio (program umbrella over eight per-folder children) |
| **Priority** | P1 |
| **Status** | Planned — no child implemented yet |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | None; root packet under the design track |
| **Parent Packet** | `sk-design` |
| **Predecessor** | `sk-design/012-sk-design-program` (the program this hub's own history is organized under) |
| **Successor** | None |
| **Handoff Criteria** | Each child validates independently under `validate.sh`; the whole program validates under `validate.sh --recursive` once all eight children exist |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

An audit of every folder across every `sk-design` mode (`design-interface`, `design-motion`, `design-md-generator`, `design-mcp-open-design`, `shared`, plus the hub root) against the `sk-doc` create-skill templates and standards found the hub's 75 reference files are frontmatter-conformant but structurally uneven: numbered-section discipline, separator hygiene, and a handful of frontmatter enum values drift per folder rather than uniformly, and one folder (`design-interface`) still carries a committed Apache-2.0 license artefact for content that was never de-vendored into original words.

### Purpose

Fix every conformance deviation folder by folder, and de-vendor the one real dependency the hub is not free to just delete: the Apache-2.0 `LICENSE.txt` in `design-interface`. Every other mode's own conformance work is scoped to its dedicated child (002-007); this parent exists only to hold the shared audit baseline, the enforcement-gap catalogue that explains why the work had to be manual, and the phase map.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The program-level audit baseline (below) and enforcement-gap catalogue that motivated a per-folder rather than a single sweep.
- Eight themed children, each independently scoped and independently validatable.
- The Apache-2.0 de-vendor decision and execution (`001-apache-devendoring`).
- Four small independent structural anomalies that don't belong to any one mode's conformance child (`008-structural-anomalies`).

### Out of Scope

- Any change to design judgment, taste, or runtime routing logic in any mode — this program only touches template/structural conformance and the one licensing dependency.
- Automating the enforcement gaps listed below — that is future tooling work, not this program's deliverable.
- Re-running or re-scoring prior benchmark or review artefacts under `benchmark/` — those stay as historical record.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/specs/sk-design/014-template-conformance/spec.md` | Create | (parent) | Program narrative + audit baseline + phase map |
| `.opencode/skills/sk-design/design-interface/LICENSE.txt` and its 6 citing sites | Remove/Rewrite | 001 | De-vendor then delete the Apache-2.0 artefact |
| `.opencode/skills/sk-design/design-md-generator/node_modules/` | Delete | 008 | Vestigial empty test-result stub |
| `.opencode/skills/sk-design/benchmark/reports/compiled-routing/` | Create (index) | 008 | Missing index file its sibling run directories have |
| `.opencode/specs/sk-design/014-template-conformance/00[2-7]-*/` | Create | 002-007 | Per-mode template/structure conformance (owned by sibling workers, not this packet) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:audit-baseline -->
## AUDIT BASELINE

> Hub-wide audit across all 75 reference files in every `sk-design` mode, compared against the `sk-doc` create-skill templates and standards.

| Finding | Count | Detail |
|---|---|---|
| Frontmatter conformance | 75/75 | Every reference file's frontmatter keys and shape are conformant. |
| Missing `## 1. OVERVIEW` | 30 | References that skip the required opening numbered section. |
| Unnumbered H2 | 13 | References using bare `## Heading` instead of `## N. HEADING`. |
| Numbered-but-sentence-case H2 | 12 | References numbered correctly but not upper-cased (`## 2. Design process` instead of `## 2. DESIGN PROCESS`). |
| Abandoned `---` separators | ~15-25 | References with inconsistent or missing horizontal-rule section breaks (range reflects borderline cases not yet triaged per-folder). |
| Frontmatter values outside allowed enums | 5 | References carrying `importance_tier`/`contextType` (or similar) values not in the documented enum list. |

**Decisive finding:** these deviations cluster by directory rather than appearing randomly across the hub — a given folder tends to be either mostly conformant or mostly non-conformant, consistent with each folder having been authored or last touched as a unit. This is why the remediation is organized **per folder** (children 002-007) rather than as one hub-wide sweep: a sweep would either over-fix already-conformant folders or under-fix the clustered ones.
<!-- /ANCHOR:audit-baseline -->

---

<!-- ANCHOR:enforcement-gaps -->
## KNOWN ENFORCEMENT GAPS

> These gaps define where **manual** audit was required, because no existing script or doctrine check covers them. They are recorded here, not fixed here (fixing them is future tooling work, out of scope for this program).

| Gap | Detail |
|---|---|
| Packet companion files unchecked | `README.md` and `changelog/` are mandated by doctrine but `parent-skill-check.cjs` only inspects the hub, not per-mode companion files. |
| Procedure cards unautomated | The seven-field procedure-card contract has zero automated validation. |
| Section discipline is substring-matched | Section order, numbering, ALL-CAPS headings, and `---` separators are declared STRICT in doctrine but the checker only does a substring match, not a structural one. |
| No packet-root hygiene rule | Stray files, build artefacts, and vendored licenses at a packet root (e.g. `LICENSE.txt`) have no authored rule at all — nothing flags them for removal or review. |
| `tests/` requirement unenforced | Docs state `tests/` is required when `scripts/` exists, but nothing checks for it. |
<!-- /ANCHOR:enforcement-gaps -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Per-folder decomposition. Each child is an independently validatable Level 2 (or matching) packet; all plan/tasks/checklist/decision/continuity content lives inside the children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-apache-devendoring/` | De-vendor `design-interface`'s Apache-2.0 guidance into original words, then remove `LICENSE.txt` and its six citing sites | **Planned** |
| 2 | `002-design-interface/` | Template/structure conformance for the `design-interface` mode's own references | **Planned** (owned by a sibling worker) |
| 3 | `003-design-motion/` | Template/structure conformance for the `design-motion` mode | **Planned** (owned by a sibling worker) |
| 4 | `004-design-md-generator/` | Template/structure conformance for the `design-md-generator` mode | **Planned** (owned by a sibling worker) |
| 5 | `005-design-mcp-open-design/` | Template/structure conformance for the `design-mcp-open-design` transport | **Planned** (owned by a sibling worker) |
| 6 | `006-shared/` | Template/structure conformance for `shared/` | **Planned** (owned by a sibling worker) |
| 7 | `007-hub-root/` | Template/structure conformance for the hub root (`README.md`, `feature-catalog/`, `benchmark/`, `manual-testing-playbook/`) | **Planned** (owned by a sibling worker) |
| 8 | `008-structural-anomalies/` | Four small independent structural fixes: node_modules stub, loose `.mjs` executables decision, missing benchmark index, two legitimate absences recorded | **Planned** |

### Phase Transition Rules

- Each child MUST pass `validate.sh` independently before the whole program is claimed conformant.
- Resume a specific child with `/speckit:resume sk-design/014-template-conformance/[NNN-child]/`.
- Do not run `validate.sh --recursive` on this parent until all eight children exist — children 002-007 are authored by other workers concurrently.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 de-vendor | Program complete | `design-principles.md`'s guidance is genuinely rewritten in original words, `LICENSE.txt` and all six citing sites are removed, and the de-vendor is recorded in `changelog/` | `checklist.md` in 001 + `rg -n "Apache\|LICENSE.txt" design-interface/**` returns nothing outside the changelog history |
| 008 anomalies | Program complete | The three actionable items are resolved or explicitly left Planned with the tradeoff stated; the two legitimate absences are recorded without a fix | `checklist.md` in 008 |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- **Loose `.mjs` executables in `design-mcp-open-design`:** should `grounding-receipt.mjs`, `live-transport.mjs`, `offline-gate.mjs`, and `return-reconciliation.mjs` move under `scripts/` for consistency with every other mode? Moving them changes imports in `return-reconciliation.mjs:9`, the transport tests, and `shared/scripts/design-command-surface-check.mjs` — this is an operator decision, recorded as Planned in `008-structural-anomalies` rather than swept.
- **De-vendor risk:** if `design-principles.md`'s guidance cannot be genuinely rewritten in original words while preserving intent, `001-apache-devendoring` must halt before deleting `LICENSE.txt` and escalate rather than ship Apache-2.0 text without its license — this is a hard stop, not a soft preference.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children:** `00[1-8]-*/`; see each child's own `spec.md`/`plan.md`/`tasks.md`/`checklist.md`/`implementation-summary.md`.
- **Predecessor program:** `.opencode/specs/sk-design/012-sk-design-program/` — the historic record this hub's prior work is organized under.
- **create-skill templates:** `.opencode/skills/sk-doc/create-skill/` — the conformance target for every child.
- **Graph Metadata:** `graph-metadata.json` (`derived.last_active_child_id` resume pointer).
