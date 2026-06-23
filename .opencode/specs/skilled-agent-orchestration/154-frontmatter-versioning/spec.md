---
title: "Feature Specification: Skill Frontmatter Versioning Phase Parent"
description: "Phase parent for retroactively versioning skill-doc frontmatter and making version a generated, enforced standard."
trigger_phrases:
  - "skill frontmatter versioning"
  - "154 frontmatter versioning"
  - "doc version field standard"
  - "retroactive frontmatter version"
  - "changelog-anchored version derivation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-frontmatter-versioning"
    last_updated_at: "2026-06-23T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Completed all 5 phases; versioned 2210 docs and enforced the standard"
    next_safe_action: "Spec complete; commit the working tree when ready"
    blockers: []
    key_files:
      - "001-versioning-standard/spec.md"
      - "002-derivation-engine/spec.md"
      - "003-apply-core-skill-docs/spec.md"
      - "004-apply-catalogs-and-playbooks/spec.md"
      - "005-verify-and-enforce/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-154-frontmatter-versioning"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Corpus scope is FULL: core skill docs plus every per-feature catalog/playbook leaf."
      - "Version shape is skill-anchored with the per-doc edit count in the build segment (e.g. 3.6.0.41)."
      - "Execution is MiMo-in-the-loop on doc edits, with a deterministic script as ground-truth + fallback."
      - "Enforcement: version is required everywhere in scope, gated by a validation/CI check."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Skill Frontmatter Versioning Phase Parent

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-23 |
| **Updated** | 2026-06-23 |
| **Parent Packet** | `skilled-agent-orchestration` |
| **Execution Model** | Deterministic engine is the sole writer; MiMo v2.5 Pro ran a read-only audit of the computed versions |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Skill documentation (`SKILL.md`, `README.md`, `references/*.md`, `assets/**/*.md`, feature catalogs, testing playbooks) carries YAML frontmatter consumed by the skill advisor and system-spec-kit. Only the 21 `SKILL.md` files carry a `version:` field today, and even those are inconsistent: four use a 3-part `X.Y.Z`, and several are stale versus their own `changelog/v*.md`. Every other doc — READMEs, references, assets, and the large feature-catalog and testing-playbook corpus — has no version at all, so there is no at-a-glance way to know which revision of a document you are reading. The corpus is 2,222 in-scope markdown files (2,210 versioned; 12 frontmatter-less docs intentionally skipped).

### Purpose
Coordinate the five child phases that (1) write the version standard into sk-doc and make it required, (2) build a deterministic derivation engine, (3) apply versions to the core skill docs, (4) apply versions to the full catalog + playbook corpus, and (5) verify everything and enforce the standard with a gate. The outcome: every in-scope skill doc self-reports a 4-part `version: X.Y.Z.W` whose front digit stays low (anchored to the human-curated skill version, never computed from git), and new docs cannot ship without one.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A documented, generated, enforced 4-part `version: X.Y.Z.W` frontmatter field for every in-scope skill doc.
- Doc classes: `SKILL.md`, `README.md`, `references/**`, `assets/**`, feature catalogs (roots + leaves), testing playbooks (roots + leaves) under `.opencode/skills/*/`.
- A deterministic compute/insert/verify engine and the sk-doc standards/templates/validators/generators that codify the field.

### Out of Scope
- Standalone `.opencode/install_guides/`, `.opencode/commands/*.md`, and `.opencode/agents/*.md` (also have frontmatter; possible follow-up).
- Detailed per-phase implementation plans at the parent level.

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in child plans.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/sk-doc/{assets,references,scripts}/**` | Modify | 001 | Add `version` to templates/standards; promote to required in validators |
| `.opencode/skills/sk-doc/scripts/frontmatter-version.*` | Create | 002 | Deterministic compute/insert/verify engine + tests |
| `.opencode/skills/*/ {SKILL.md, README.md, references/**, assets/**}` | Modify | 003 | Version the core skill docs (457 files) |
| `.opencode/skills/*/{feature_catalog,manual_testing_playbook}/**` | Modify | 004 | Version the full catalog + playbook corpus (1,753 files) |
| validation/CI gate + affected `changelog/v*.md` | Modify/Create | 005 | Enforce + record |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-versioning-standard/ | Define 4-part `X.Y.Z.W` semantics + changelog-anchored derivation; add `version` to every sk-doc template/reference and promote to required; update create-command generators | Complete |
| 2 | 002-derivation-engine/ | Build the deterministic compute/insert/verify script (anchor = max(frontmatter, changelog); numstat-gated edit count → build segment; idempotent line-wise insert; dry-run manifest) + unit tests | Complete |
| 3 | 003-apply-core-skill-docs/ | Apply versions to 457 core docs — 21 SKILL.md (normalized, incl. the 4 pre-existing 3-part files canonicalized to 4-part), 22 READMEs, references, assets — via compute → MiMo read-only audit → script-verify | Complete |
| 4 | 004-apply-catalogs-and-playbooks/ | Apply versions to the full catalog + playbook corpus, roots and per-feature leaves: 693 catalog + 1,060 playbook = 1,753 docs | Complete |
| 5 | 005-verify-and-enforce/ | Full validation sweep; promote validators to required + add CI/validation gate; update affected changelogs; reconcile completion | Complete |
| 6 | 006-fix-deep-review-findings-for-spec-docs/ | Reconcile the MiMo + DeepSeek deep-review findings: correct spec.md counts, refresh parent/child metadata + continuity, populate phase plan/tasks, document the reconcile behavior, minor engine hardening | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-versioning-standard | 002-derivation-engine | Standard + templates document the required `version` field; validators recognize it | Parent + sk-doc validate; templates emit `version` |
| 002-derivation-engine | 003-apply-core-skill-docs | Engine passes unit tests; dry-run manifest reviewed; idempotent re-run is a no-op | `--verify` green on fixtures; manifest CSV produced |
| 003-apply-core-skill-docs | 004-apply-catalogs-and-playbooks | Core docs verified (version == computed; frontmatter intact); consumer parse check green | `--verify` over core set; quick_validate/package_skill pass |
| 004-apply-catalogs-and-playbooks | 005-verify-and-enforce | Full corpus verified; no YAML corruption; counts reconciled with manifest | `--verify` over corpus; structural diff clean |
| 005-verify-and-enforce | 006-fix-deep-review-findings-for-spec-docs | Deep-review findings resolved; spec/metadata accurate; plan/tasks populated | validate.sh --strict exit 0 on parent + all 6 children |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None blocking. The four load-bearing decisions (corpus scope, version shape, execution model, enforcement level) are locked — see `answered_questions` in the continuity block above.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
