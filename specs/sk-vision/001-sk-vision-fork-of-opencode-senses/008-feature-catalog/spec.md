---
title: "Feature Specification: sk-vision 008 feature catalog"
description: "Author the canonical feature-catalog package for sk-vision: root catalog, five category folders, sixteen per-feature files with source and validation anchors."
trigger_phrases:
  - "sk-vision feature catalog"
  - "sk-vision capability inventory"
  - "sk-vision catalog package"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/008-feature-catalog"
    last_updated_at: "2026-08-16T12:00:00.000Z"
    last_updated_by: "pi"
    recent_action: "Created 008 copy pack."
    next_safe_action: "Implement the catalog package from this spec copy pack."
    blockers: []
    key_files:
      - "spec.md"
      - ".opencode/skills/sk-vision/feature-catalog/feature-catalog.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-008-feature-catalog"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: sk-vision 008 feature catalog

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-16 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | 007-pi-input-images |
| **Successor** | 009-manual-testing-playbook |
| **Handoff Criteria** | Root catalog + 16 per-feature files with source/test anchors; root↔leaf parity; `validate_catalog_package.cjs` exit 0; `validate_document.py` clean on root and leaves. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is a **leaf phase** under the sk-vision packet root.

**Scope Boundary**: `.opencode/skills/sk-vision/feature-catalog/**` only. No SKILL.md/README changes (006 owns), no playbook (009 owns), no code changes.

**Dependencies**:
- 006 + 007 shipped (catalog must describe shipped behavior only).

**Deliverables**:
- `.opencode/skills/sk-vision/feature-catalog/feature-catalog.md`
- 16 per-feature files in 5 category folders.

**Changelog**:
- Record the catalog delivery in the skill changelog if one exists; otherwise in this child's implementation-summary.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
sk-vision ships 13 tools plus a runtime and two host adapters, but has no canonical current-state inventory. Reviewers, the 009 playbook, and the skill README all need one stable place that says what the skill does today, with source anchors for every claim.

### Purpose
Deliver the feature-catalog package per `sk-create-feature-catalog` so every capability has a stable slug, a per-feature reference file, and auditable source/test anchors — and so 009 can cross-link its scenarios to catalog entries.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `feature-catalog/feature-catalog.md` root (from `assets/feature-catalog-template.md`)
- Category folders + per-feature files (from `assets/feature-catalog-snippet-template.md`), exactly:

| Category folder | Feature files (slug.md) |
|-----------------|--------------------------|
| `scene-understanding/` | `inspect.md`, `ocr.md`, `detect.md`, `point.md`, `segment.md` |
| `pixel-analysis/` | `colors.md`, `diff.md`, `metadata.md`, `crop.md`, `zoom.md`, `annotate.md` |
| `system-health/` | `status.md`, `reverse.md` |
| `host-adapters/` | `opencode-plugin.md`, `pi-extension.md` |
| `runtime-core/` | `json-rpc-runtime.md` |

- Validation: shared validators + package validator (see copy pack).

### Out of Scope
- `manual-testing-playbook/` and `benchmark/` (009).
- Editing SKILL.md/README/graph-metadata/leaf manifests (catalog is NOT a leafRoot — per system-spec-kit precedent, `leaf-manifest.config.json` stays `["references"]`).
- `context/` edits. Code changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-vision/feature-catalog/feature-catalog.md` | Create | Root catalog |
| `.opencode/skills/sk-vision/feature-catalog/{category}/*.md` | Create | 16 per-feature files |

### Implementer copy pack (follow exactly)

Stop and report if any of these is true: you are about to write a per-feature file for a behavior that does not exist on disk; you are about to freeze a measured count or dated snapshot in prose; you are about to add numeric prefixes to category or feature names; you are about to touch leaf manifests.

Read first:
- `.opencode/skills/sk-doc/sk-create-feature-catalog/assets/feature-catalog-template.md` (root scaffold)
- `.opencode/skills/sk-doc/sk-create-feature-catalog/assets/feature-catalog-snippet-template.md` (per-feature scaffold)
- The shipped sources for anchor accuracy: `vision-runtime/src/providers/photon.ts` (tool→provider method map), `vision-runtime/src/providers/types.ts`, `vision-runtime/python/runtime.py` (analysis handlers + methods), `pi/sk-vision.ts` (13 tool registrations + input hook), `vision-runtime/src/opencode/tools.ts` + `attachments.ts` (plugin tools + auto-inspect), `vision-runtime/src/plugin.ts` (dump hooks), `.opencode/plugins/sk-vision.js`, `.pi/extensions/sk-vision.ts` (symlink).
- Test anchors: `vision-runtime/src/providers/photon.test.ts`, `vision-runtime/python/runtime.test.ts`, `vision-runtime/scripts/build.ts`.

**Root catalog (`feature-catalog.md`).** Frontmatter (title, description, trigger_phrases, last updated, four-part version). H1 intro. `## 1. OVERVIEW`. Numbered H2 capability sections per category with H3 feature entries: H3 heading == per-feature `title` literally; H3 description matches the per-feature frontmatter `description` after normalization. No TOC, no ANCHOR comments. Link each H3 to its per-feature file. Current-reality summaries only.

**Per-feature files.** Exactly the snippet template contract:
- Frontmatter: `title` (== root H3), `description` (== root H3 description, normalized), `trigger_phrases` (≥3, including the tool name and user phrasings), `version` four-part. No `importance_tier` unless the feature is Tier 1 (recommend: none, or only `inspect`/`ocr` if the implementer judges them critical).
- H1 with tool name in parens: `# Image inspection (sk_vision_inspect)`; for the two adapters `# OpenCode plugin adapter (sk-vision.js)` / `# Pi extension adapter (sk-vision.ts)`; for the runtime `# JSON-RPC runtime (python/runtime.py)`.
- Template marker after H1: `<!-- sk-doc-template: skill_asset_feature_catalog -->`
- Sections: `## 1. OVERVIEW`, `## 2. HOW IT WORKS` (H3 subheads when >3 paragraphs), `## 3. SOURCE FILES` with `### Implementation` (File|Layer|Role; Layer ∈ Handler/Shared/Script) and `### Validation And Tests` (File|Type|Role; Type from the canonical taxonomy: Unit, Integration, Fixture, Manual playbook, etc.), `## 4. SOURCE METADATA` (Group, Canonical catalog source: `feature-catalog.md`, Feature file path, Related references to neighboring files).
- Behavior from the caller/operator perspective. No roadmap.

**Cross-links.** Root↔leaf parity both directions. Per-feature `Related references` link real sibling files.

Close this child with:

```bash
# New-content naming guard (staging root = the new package only)
python3 .opencode/skills/sk-doc/shared/scripts/check_no_hyphenated_catalog_content.py .opencode/skills/sk-vision/feature-catalog

# Root
python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-vision/feature-catalog/feature-catalog.md
python3 .opencode/skills/sk-doc/shared/scripts/extract_structure.py .opencode/skills/sk-vision/feature-catalog/feature-catalog.md

# Every leaf (16 files)
python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-vision/feature-catalog/<category>/<feature>.md

# Package validator
node .opencode/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.cjs --report-only   # advisory first
node .opencode/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.cjs                  # must exit 0

bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/sk-vision/001-sk-vision-fork-of-opencode-senses/008-feature-catalog --strict
```
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Root catalog exists at canonical path | `feature-catalog/feature-catalog.md` present, built from template |
| REQ-002 | 16 per-feature files, 5 categories, kebab-case, no numeric prefixes | find output matches the In Scope table exactly |
| REQ-003 | Root↔leaf parity | every root entry links a real file; every file linked from root |
| REQ-004 | Source + validation anchors on every file | tables reference real paths (test -f each) |
| REQ-005 | Package validator clean | `validate_catalog_package.cjs` exit 0 |
| REQ-006 | Shared validator clean on root + leaves | `validate_document.py` exit 0 on all 17 docs |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-P1 | No measured-count/dated snapshots in prose | grep for dates/counts in prose — none frozen |
| REQ-P2 | Leaf manifests untouched | `leaf-manifest.config.json` still `["references"]` |
| REQ-P3 | No scope creep | files outside feature-catalog/ untouched |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [ ] Root + 16 leaves on disk at exact paths
- [ ] `validate_catalog_package.cjs` exit 0 (record output)
- [ ] `validate_document.py` exit 0 on root and all 16 leaves
- [ ] `check_no_hyphenated_catalog_content.py` clean on the package
- [ ] All source/test anchor paths exist (`test -f`)
- [ ] This child `validate.sh --strict` exits 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Root H3 vs leaf title/description parity failures | High | Copy titles/descriptions exactly between root and leaves |
| Risk | Stale anchors after 007 changes | Medium | Catalog authored after 007 ships |
| Risk | Catalog treated as roadmap | Medium | Current-state wording enforced in review |
| Dependency | 006 + 007 shipped | Shipped | Stop if docs/code contradict |
<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

### Answered Questions
- **Q**: Are feature-catalog leaves routable advisor resources? **A**: No — they are not leafRoots; `leaf-manifest.config.json` stays `["references"]`.

### Open Questions
- None.
<!-- /ANCHOR:questions -->

