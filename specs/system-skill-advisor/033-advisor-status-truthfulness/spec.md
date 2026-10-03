---
title: "Feature Specification: Make the advisor's freshness, scan and routing reports match what is on disk"
description: "Make the advisor's freshness, scan and routing reports match what is on disk"
trigger_phrases:
  - "advisor status truthfulness"
  - "skill graph freshness"
  - "router reach misroutes"
  - "advisor embeddings health"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/033-advisor-status-truthfulness"
    last_updated_at: "2026-10-03T07:50:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "All three phases shipped and verified"
    next_safe_action: "Parent session reviews and commits the packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Make the advisor's freshness, scan and routing reports match what is on disk

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-03 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | scaffold/033-advisor-status-truthfulness |
| **Predecessor** | specs/system-speckit/048-doctor-command-audit |
| **Successor** | None |
| **Handoff Criteria** | All three child phases close with strict validation passing, and every recorded truthfulness finding is fixed or explicitly waived on the record |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The doctor command audit (`specs/system-speckit/048-doctor-command-audit`) recorded that several advisor reporting surfaces disagree with what is actually on disk. A live check in the audit worktree confirmed the disagreements at planning time: `advisor_status` answers `freshness: live` and `skillCount: 20` while `skill_graph_status` reports `changedSourceFiles: 14` and `totalSkills: 14`; the compiled `skill-graph.json` carries `generated_at: 2026-09-29T07:49:34Z` while `.skilled/skills/cli-classifier/graph-metadata.json` carries `derived.last_updated_at: 2026-09-29T09:00:00Z` and the freshness panel reports nothing; with no SQLite artifact (every fresh checkout, because `*.sqlite` is gitignored) the same panel prints `absent`, drops three of its five sets and exits 0 with no degraded marker. The audit also recorded 14 wrong-hub and 18 outranked phrases from a fleet run whose scorer was degraded, and four documentation or contract gaps: the mutating CLI commands' own catalog pages never state the `--trusted` requirement, `references/scoring/advisor-scorer.md` cites moved line ranges, `PHRASE_BOOSTS` has no bound declared where it lives, and `advisor_status` exposes no embedding provider or model-server health.

### Purpose
Make every advisor reporting surface mean what it says. Freshness, scan counts, the compiled-versus-source comparison and the degraded-artifact state become truthful and consistent; recorded misroutes are verified against the live advisor and only then fixed; and the operator-facing contracts around trusted mutations, scorer bounds, routing phrase sources and embeddings health are stated where the operator reads them.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Phase 1: make `advisor_status` freshness agree with the skill graph's content-hash staleness, count skill roots rather than recursive metadata fixtures, and teach the doctor freshness panel to see a compiled graph older than its sources, an absent SQLite artifact, the inert `z_archive` claim and the family/id namespace collision.
- Phase 2: rerun the full router-reach fleet against the live advisor, then fix the wrong-hub and outranked phrases the live run actually reproduces in the owning skills' routing vocabulary.
- Phase 3: state the `--trusted` requirement on the mutating commands' catalog pages, correct the moved line ranges and stale examples in `references/scoring/advisor-scorer.md`, declare the `PHRASE_BOOSTS` bound where the map lives, settle how routing phrases are read (frontmatter versus `graph-metadata.json`), and add an embeddings health surface to `advisor_status`.
- Documentation updates that keep the touched surfaces truthful: feature-catalog pages, scoring references and schema comments.

### Out of Scope
- The `/doctor` command layer itself — routes, workflows, presentation and validator were audited and fixed in `specs/system-speckit/048-doctor-command-audit`; this packet only consumes its recorded findings.
- The advisor's scoring algorithm, lane weights or fusion behavior beyond the phrase-bound declaration and the routing vocabulary fixes required by reproduced misroutes.
- The daemon architecture, watcher policy, embeddings model quality and the model server's own runtime behavior.
- Skills, packets and specs outside `specs/system-skill-advisor/033-advisor-status-truthfulness/` except for the routing vocabulary files named by Phase 2, which the audit recorded as defects in the subsystem.

### Files to Change
Summary of files touched across all phases, kept for audit trail only; per-phase detail lives in each child's plan.md.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts` | Modify | 001-freshness-and-scan-truth | Index-level staleness and skill-root scan counts |
| `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts` | Modify | 001-freshness-and-scan-truth | Schema fields for the new status facts |
| `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-status.vitest.ts` | Modify | 001-freshness-and-scan-truth | Pin the new freshness and count semantics |
| `.skilled/commands/doctor/scripts/skill-graph-freshness.cjs` | Modify | 001-freshness-and-scan-truth | Compiled staleness, degraded marker, namespace clarity |
| `.skilled/commands/doctor/scripts/tests/skill-graph-freshness.test.cjs` | Create | 001-freshness-and-scan-truth | Pin the panel's new report lines |
| `.skilled/skills/*/graph-metadata.json` and `.skilled/skills/*/ROUTER.md` | Modify | 002-router-reach-misroutes | Only the vocabulary rows a live fleet run reproduces as misroutes |
| `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-rebuild.md` | Modify | 003-status-contract-and-docs | State the `--trusted` requirement |
| `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/skill-graph-scan.md` | Modify | 003-status-contract-and-docs | State the `--trusted` requirement |
| `.skilled/skills/system-skill-advisor/references/scoring/advisor-scorer.md` | Modify | 003-status-contract-and-docs | Correct moved line ranges and stale examples |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` | Modify | 003-status-contract-and-docs | Declare the phrase-boost bound next to the map |
| `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts` | Modify | 003-status-contract-and-docs | Embeddings provider and model-server health surface |
| `.skilled/skills/system-skill-advisor/SKILL.md` and affected feature-catalog pages | Modify | 003-status-contract-and-docs | Document the phrase-source decision and the health surface |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-freshness-and-scan-truth/ | First and second truth: make the live freshness verdict and the scan count agree with the content-hash evidence and the number of real skills, and make the doctor freshness panel name a compiled graph older than its sources, a missing SQLite artifact and its own blind spots | Complete |
| 2 | 002-router-reach-misroutes/ | Third truth: rerun the full router-reach fleet against the live advisor, keep only the misroutes it reproduces, and fix those in the routing vocabulary that owns them | Complete |
| 3 | 003-status-contract-and-docs/ | Fourth truth: put the contracts operators need where they read them — trusted mutations, scorer citations and bounds, routing phrase source, and an embeddings health surface on `advisor_status` | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-freshness-and-scan-truth | 002-router-reach-misroutes | Freshness, skill count and panel report lines are consistent with each other and with the on-disk sources; phase validates strict and the changed surfaces stay read-only or report-only | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skill-advisor/033-advisor-status-truthfulness/001-freshness-and-scan-truth --strict` ends `RESULT: PASSED`; a live `advisor_status` and `skill_graph_status` pair shows no disagreement |
| 002-router-reach-misroutes | 003-status-contract-and-docs | Every wrong-hub and outranked classification in the live fleet rerun is fixed or carries a recorded allowlist rationale; a rerun of the full fleet ends with none of either, or a waiver decision record names what remains | `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs` full-fleet run ends with `wrong-hub= 0 outranked= 0` and a live `advisor generation` number |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Should `advisor_status` downgrade `freshness` when the SQLite index's stored content hashes differ from disk, or report a separate `indexStaleness` object and leave `freshness` as the generation verdict? Phase 1 settles this in its plan and pins it with tests.
- Does any live tool read routing phrases from `SKILL.md` frontmatter, or is `graph-metadata.json` the only routing source? Phase 3 inventories the readers before deciding between populating frontmatter and documenting the graph as source of truth.
- Should the phrase-boost bound be enforced in the advisor runtime (a validation fixture or constant) or only declared where `PHRASE_BOOSTS` lives? Phase 3 decides; the doctor's proposal validator already uses `[-1.0, 2.0]`.
- Which embeddings fields does the operator need from `advisor_status` — provider resolution only, model-server health only, or both? Phase 3 plans the surface and records the decision.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Source audit**: See `specs/system-speckit/048-doctor-command-audit/` for the recorded findings and their evidence
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
