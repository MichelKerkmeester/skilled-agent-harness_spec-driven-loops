---
title: "Feature Specification: Benchmark Authoring Completion and Cross-Links"
description: "Finish making sk-doc/create-benchmark the single home for benchmark-document authoring guidance across all five families: author the missing Lane A (agent-improvement) authoring guide, promote it from a code-owned non-goal to authoring-guided-here (code artifacts stay in-lane), complete the bidirectional create-benchmark <-> deep-loop links (deep-alignment back-pointer + Lane A lane->hub pointer), and land three carried-over corrections: the 016->015 packet-identity drift, the dangling sibling reference, and the systemic model-benchmark fixtureDir path break."
trigger_phrases:
  - "benchmark authoring completion"
  - "lane a authoring guide create-benchmark"
  - "benchmark cross-link deep-alignment"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/018-benchmark-authoring-and-validation-fixes/002-complete-benchmark-guides-and-links"
    last_updated_at: "2026-07-13T14:35:28Z"
    last_updated_by: "claude-code"
    recent_action: "Packet scaffolded; scope frozen after two read-only audits"
    next_safe_action: "Author the Lane A guide, apply the three fixes, complete links, run gates"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Contracts stay lane-owned and cross-linked (operator ruling); no relocation"
---
# Feature Specification: Benchmark Authoring Completion and Cross-Links

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-13 |
| **Track** | sk-doc |
| **Parent** | `sk-doc/018-benchmark-authoring-and-validation-fixes` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | `../001-organize-benchmark-resources-and-routing/spec.md` |
| **Successor** | `../003-fix-benchmark-paths-docs-and-routing/spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Parent packet 015 made `sk-doc/create-benchmark` the single home for benchmark-document templates and standards for four families (MCP promotion, behavior, skill-benchmark, model-benchmark). Two audits show the mission is incomplete: create-benchmark carries zero authoring guidance for Lane A (agent-improvement), so a reader is silently missing one of five families; the `deep-alignment -> create-benchmark` back-link is absent; and three defects were left carried-over (the packet-identity metadata still reads `016` on a folder renamed to `015`, the parent names a sibling that no longer exists, and every model-benchmark profile's `fixtureDir` points at a directory the underscore-migration renamed away).

### Purpose
Complete the centralization at the authoring-guidance layer: author the missing family guide, make all five families discoverable from create-benchmark, finish the bidirectional links, and land the three corrections — without relocating any lane-owned run/scoring contract or code-coupled artifact.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One new authoring guide under `create-benchmark/references/`: Lane A (`agent_improvement/agent_improvement_authoring_guide.md`).
- Word-neutral `create-benchmark/SKILL.md` edits (the file is at the 5000-word cap): §1 framing, §2 family-table Lane A row + non-goal paragraph, §12 REFERENCES rows; version bump + changelog.
- Bidirectional links: a create-benchmark back-pointer in `deep-alignment/behavior_benchmark/behavior_benchmark.md`; a Lane A lane->hub pointer from its in-lane doc.
- Fix 1 (packet identity 016->015), Fix 2 (dangling sibling), Fix 3 (fixtureDir across 10 profiles + README prose).

### Out of Scope
- Relocating ANY lane-owned contract, rubric, schema, scorer, runner, or code-coupled template into create-benchmark (operator ruling: contracts stay lane-owned, cross-linked).
- Any change to run/scoring logic, gates, or the deep-loop hub SKILL.
- Any edit to the frozen `../review/**` lineage evidence.
- Any Lane C skill-benchmark report `.md` (renderer-owned) or advisor registry/router re-baseline.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `create-benchmark/references/agent_improvement/agent_improvement_authoring_guide.md` | Create | The new Lane A family authoring guide. |
| `create-benchmark/SKILL.md`, `create-benchmark/changelog/v1.3.0.0.md` | Modify/Create | Five-family framing + version bump + changelog. |
| `deep-alignment/behavior_benchmark/behavior_benchmark.md`, Lane A `assets/agent_improvement/README.md` | Modify | lane->hub authoring back-pointers. |
| `deep-improvement/assets/model_benchmark/benchmark_profiles/*.json` (10) | Modify | fixtureDir repoint. |
| Parent + child metadata and continuity frontmatter | Modify | 016->015 identity + sibling fix. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Author the Lane A authoring guide, cross-linking (never restating) the 5-dim rubric, evaluator contract, promotion gate, and code-coupled config. | Guide exists; `validate_document.py` 0 issues; grep shows contracts linked, not restated. |
| REQ-003 | create-benchmark SKILL §2 represents all five families; Lane A names its guide; SKILL stays under the word cap. | `package_skill.py create-benchmark --check` PASS; word count <= 5000. |
| REQ-004 | Repoint every model-benchmark profile `fixtureDir` to the real directory. | All 10 `fixtureDir` resolve; 0 hyphen refs in profile JSONs. |
| REQ-005 | No lane-owned contract/schema/template relocated; no run/scoring logic changed. | `git diff --stat` clean under run/scoring code, contracts, templates, deep-alignment engine. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Complete the bidirectional link mesh, including the missing deep-alignment and Lane A back-pointers. | `rg create-benchmark deep-alignment` >= 1; the new guide has a lane back-link. |
| REQ-007 | Live packet-identity metadata reads `015`; parent sibling reference resolves. | No `016` in live metadata/continuity (only frozen review/); sibling resolves. |
| REQ-008 | Packet passes strict validation. | `validate.sh --strict` Errors:0 on this child; parent recursive no new errors. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The new authoring guide exists and passes `validate_document.py` (0 issues).
- **SC-002**: create-benchmark SKILL §2 covers all five families; `package_skill.py --check` PASS; word count <= cap.
- **SC-003**: Bidirectional links complete (deep-alignment + Lane A back-pointers present and resolving).
- **SC-004**: No lane-owned relocation; no run/scoring change; all 10 profiles resolve `fixtureDir`.
- **SC-005**: No `016` in live metadata/continuity; sibling resolves; `validate.sh --strict` Errors:0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | SKILL at the 5000-word cap | New prose could break `package_skill.py --check` | Detail lives in reference guides; SKILL edits measured word-neutral. |
| Risk | Guides could restate lane contracts | Forks the source of truth | Guides cross-link authorities; a grep pass confirms link-not-copy. |
| Risk | Metadata regen re-propagates `016` | `generate-context.js` reads packet_id from graph-metadata | Correct graph-metadata first, then regenerate. |
| Constraint | Frozen `../review/**` and run/scoring code are banned write paths | Some frozen `016` text remains (expected) | Only live metadata/continuity is normalized; report residuals. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: Every benchmark family has one discoverable authoring home (a guide reachable from create-benchmark §2).
- **NFR-M02**: Lane-owned contracts stay single-source; create-benchmark links them, never copies.

### Reliability
- **NFR-R01**: No run/scoring behavior changes; the fixtureDir fix only restores a broken default path.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Path Boundaries
- Relative back-pointer links from deep-loop lanes into create-benchmark must account for directory depth; each is resolved before finalizing.
- Frozen `../review/**` evidence retains `016` and is not an active-metadata consumer; it remains unchanged.

### Error Scenarios
- A guide that restated a rubric would fork the contract; the link-not-copy grep guards against it.
- A SKILL edit that exceeds the word cap fails `--check`; word count is measured after each edit.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | One authored guide, two back-pointers, three carried-over corrections. |
| Risk | 9/25 | Doc-authoring + config path fix; word-cap and link-not-copy are the live risks; no logic change. |
| Research | 6/20 | Two read-only audits established the move map and blast radius. |
| **Total** | **27/70** | **Level 2 verification is appropriate.** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None blocking. Whether the two doc-only Lane A templates (`improvement_charter.md`, `improvement_strategy.md`) should be physically relocated into create-benchmark is a documented, deferred follow-up; this packet keeps them in-lane and guides+links them, consistent with the contracts ruling.
<!-- /ANCHOR:questions -->
