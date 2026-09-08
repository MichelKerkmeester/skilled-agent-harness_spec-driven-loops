---
title: "Feature Specification: Phase 9: references-corpus-routing"
description: "Seventeen of the forty-five files under system-spec-kit's references and assets corpus are reachable only by browsing, with no README nav, command-asset path or SKILL.md route naming them."
trigger_phrases:
  - "references corpus routing"
  - "browse only reference files"
  - "leaf manifest byte stable"
  - "resource map subset routing"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 9: references-corpus-routing

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-07 |
| **Branch** | `scaffold/009-references-corpus-routing` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 16 |
| **Predecessor** | 008-review-research-scaffold-paths |
| **Successor** | 010-manifest-dead-fields-and-coaching-markers |
| **Handoff Criteria** | validate.sh reports RESULT: PASSED for this folder and generate-leaf-manifest.cjs --check reports no diff |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the Recorded findings closure specification.

**Scope Boundary**: Only the 17 browse-only files under `.opencode/skills/system-spec-kit/references/` and `assets/` named by finding F3-14, plus the routing surfaces that can make them reachable (`SKILL.md`, `references/workflows/quick-reference.md`) and the manifest pair that enumerates them. No other skill's corpus, and no change to a file already routed.

**Dependencies**:
- Child 020 of the 035 research program already corrected `SKILL.md:95`'s claim that the map emits every leaf, so this phase only has to route or remove the files themselves, not restate the claim.

**Deliverables**:
- Every one of the 17 files reachable through `SKILL.md`'s intent map or `quick-reference.md`, or removed with its `leaf-manifest.json` and `leaf-manifest.config.json` rows.
- `generate-leaf-manifest.cjs --check` reporting byte-stable.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Finding F3-14 (`specs/system-speckit/033-system-speckit-v4/030-spec-kit-simplification-research/005-overengineering-simplification/research/lineages/deepseek-v4-flash-overengineering-r3/research.md:77`) found that 17 of the 45 files under `.opencode/skills/system-spec-kit/references/` and `assets/` are named by no `RESOURCE_MAP` intent in `SKILL.md` and no prose link, so they are reachable only by directory browsing: `workflows/agent-io-contract.md`, `workflows/auto-mode-contract.md`, `workflows/execution-methods.md`, `workflows/goal-set-string-playbook.md`, `templates/level-selection-guide.md`, `templates/level-specifications.md`, `templates/template-style-guide.md`, `structure/folder-routing.md`, `structure/folder-structure.md`, `structure/phase-system.md`, `validation/decision-format.md`, `validation/five-checks.md`, `validation/path-scoped-rules.md`, `cli/daemon-cli-reference.md`, `cli/memory-handback.md`, `cli/shared-smart-router.md` and `assets/parallel-dispatch-config.md`. Confirmed by direct count against the current tree: `SKILL.md`'s `RESOURCE_MAP` (lines 166-243) routes 26 distinct paths, two more are prose-linked at `SKILL.md:428` (`references/retrieval/retrieval-conventions.md`, `references/structure/grep-convention.md`) and the corpus holds 45 files total, leaving exactly 17 unrouted. Child `020-rule-headers-registry-coverage-and-playbook-paths` already fixed the false claim at `SKILL.md:95` that the map "emits those exact leaf paths" for every enumerated file (it now states the map routes a subset and the manifest is the inventory), but left the 17 files themselves unrouted because the round that found them did not read their bodies.

### Purpose
Every one of the 17 files is either reachable through `SKILL.md`'s own routing (an added intent entry or a `quick-reference.md` pointer) or removed along with its `leaf-manifest.json` row, so the corpus the manifest enumerates matches the corpus the router can actually reach.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Reading the body of each of the 17 browse-only files and recording a route-or-remove disposition for each.
- Adding a `RESOURCE_MAP` intent entry or a `quick-reference.md` pointer for files worth keeping routable.
- Deleting files that duplicate or are superseded by an already-routed file, together with their `leaf-manifest.json` and `leaf-manifest.config.json` rows.
- Re-running `generate-leaf-manifest.cjs --write` then `--check` so the manifest stays byte-stable.

### Out of Scope
- The 28 already-routed files - no finding named them.
- `SKILL.md:95`'s manifest/RESOURCE_MAP coherence claim - already fixed by child 020, not reopened here.
- Any corpus outside `system-spec-kit/references/` and `assets/` - other skills' browse-only files are their own owners' findings.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/system-spec-kit/SKILL.md` | Modify | Add `RESOURCE_MAP` intent entries (or prose links) for files kept routable |
| `.opencode/skills/system-spec-kit/references/workflows/quick-reference.md` | Modify | Add pointers for files better suited to the first-touch surface than a new intent |
| `.opencode/skills/system-spec-kit/leaf-manifest.json` | Modify | Row removed for each deleted file, regenerated via `generate-leaf-manifest.cjs --write` |
| `.opencode/skills/system-spec-kit/leaf-manifest.config.json` | Modify | Config-level entry adjusted if a deleted file's directory rule changes |
| Individual files under `references/{workflows,templates,structure,validation,cli}/` and `assets/` named by F3-14 | Delete (where removal is the disposition) | Removed once its content is confirmed to duplicate or be superseded by a routed file |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every one of the 17 files named by F3-14 is either reachable through `SKILL.md`'s `RESOURCE_MAP` or `quick-reference.md`, or removed together with its `leaf-manifest.json` and `leaf-manifest.config.json` rows |
| REQ-002 | `generate-leaf-manifest.cjs --check` reports byte-stable (exit 0, no diff) against `.opencode/skills/system-spec-kit` after every change |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The routing-registry-drift workflow's leaf-manifest-freshness and skill-root-metadata gates (`ci-leaf-manifest-freshness.cjs`, `ci-skill-root-metadata.cjs` in `.github/workflows/routing-registry-drift.yml`) pass for `system-spec-kit`. The brief's "parent-skill check" does not apply here because that step only enrolls skills carrying a `mode-registry.json`, and `system-spec-kit` is a registry-less standalone root per `SKILL.md:95` |
| REQ-004 | Two repo-root-reachable files named in F3-14, `agent-io-contract.md` (cited by `CLAUDE.md` §9) and `folder-structure.md` (cited by `CLAUDE.md` §6), are routed, not removed, since another document already depends on their presence |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A disposition (routed or removed) is recorded for all 17 files, each with the intent entry or pointer added, or the deletion and manifest-row removal made.
- **SC-002**: `generate-leaf-manifest.cjs --check` exits 0 against the post-change corpus.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `generate-leaf-manifest.cjs`, owned by `sk-doc/sk-create-skill/scripts/` | A hand-edited manifest row drifts from the generator's own byte-stable output | Regenerate with `--write`, never hand-edit `leaf-manifest.json` |
| Risk | Deleting a file another document depends on outside `SKILL.md`'s own routing (e.g. `CLAUDE.md`'s direct citations) | Med - breaks a cross-repo reference silently | Grep the filename repo-wide before deleting. The two repo-root-reachable files (REQ-004) are routed, never removed |
| Risk | Adding too many new `RESOURCE_MAP` intents inflates the router past its "thin router" design stated at `SKILL.md:95` | Low | Prefer a `quick-reference.md` pointer over a new intent where the file is reference material rather than a workflow trigger |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `generate-leaf-manifest.cjs --check` completes within the CI job's existing timeout, and the change adds no new script.
- **NFR-P02**: Not applicable - this is a documentation-routing change with no runtime request path.

### Security
- **NFR-S01**: Not applicable - no auth surface changes.
- **NFR-S02**: Not applicable - no data storage changes.

### Reliability
- **NFR-R01**: The manifest stays byte-stable under `--check` on every run after this phase closes, not just once at merge time.
- **NFR-R02**: A deleted file leaves zero dangling references. A repo-wide grep for its filename after deletion returns nothing outside history.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a file with an empty or near-empty body is a removal candidate by default, recorded with the grep evidence that nothing routes to it.
- Maximum length: no file in the corpus is large enough to need special handling. The largest browse-only file is read in full before its disposition is decided.
- Invalid format: a file that fails `validate_document.py` for its class is fixed at source before its disposition is decided, since a broken document cannot be judged route-worthy.

### Error Scenarios
- External service failure: not applicable - the routing surfaces are static markdown and JSON, no external call.
- Network timeout: not applicable.
- Concurrent access: two files describing overlapping content route to the same intent rather than each getting a duplicate entry, so the map does not grow unbounded.

### State Transitions
- Partial completion: if only some of the 17 files are dispositioned before a session ends, the remainder are listed as open in `goal.md`'s log, and `generate-leaf-manifest.cjs --check` is re-run only after every file in the batch is resolved.
- Session expiry: the per-file disposition table in `goal.md`'s log is the resumption point. A resumed session starts from the first file without a recorded disposition.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 17 files to read and disposition, 2-4 files to change (SKILL.md, quick-reference.md, two manifest files) |
| Risk | 6/25 | Documentation-only surface, reversible by git revert. The one real risk is a cross-repo dangling reference |
| Research | 5/20 | The corpus census and routed-set computation are already done in this spec. Remaining research is per-file body reads |
| **Total** | **19/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Whether a file worth keeping gets a new `RESOURCE_MAP` intent or a `quick-reference.md` pointer is decided per file once its body is read, weighing the "thin router" design note at `SKILL.md:95` against the file's actual audience.
- Whether `folder-routing.md` and `phase-system.md` duplicate content already covered by the routed `folder-structure.md` and `phase-definitions.md` is a body-read question this phase's first task answers, not assumed here.
<!-- /ANCHOR:questions -->

---



<!-- SCAFFOLD_VALIDATION_COUNTS:
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
