---
title: "Implementation Plan: Phase 13: corpus-wide-validation-repair"
description: "Clean the archive's template phrases, re-derive every packet's recomputable metadata, fix anchors and frontmatter by script, hand the remaining structural failures to DeepSeek lanes of twelve folders each, and re-validate all 4,371 packets against the baseline."
trigger_phrases:
  - "corpus wide validation repair plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 13: corpus-wide-validation-repair

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM and Bash scripts for the scripted fixes, DeepSeek V4.1 Flash through cli-pi for the lanes |
| **Framework** | system-spec-kit runtime CLI, no application framework |
| **Storage** | The `specs/` tree: Markdown documents, `description.json` and `graph-metadata.json` |
| **Testing** | `validate.sh --strict` per packet, compared against a baseline taken before any change |

### Overview

A baseline over all 4,371 packets found 2,046 failing strict validation, most of them archived. The repair runs cheapest first: the phase 12 phrase cleanup over the archive, then the metadata that tools can recompute, then scripted anchor and frontmatter fixes. Each step only shrinks the set the next one sees. The 474 folders still failing after the scripts went to 43 DeepSeek lanes of up to twelve folders each. A final full run compares every packet with the baseline.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented - spec.md sections 2 and 3 fix the scope at packets under `specs/`, with non-packet folders excluded
- [x] Success criteria measurable - SC-001 names the full validation run and SC-002 names the census count
- [x] Dependencies identified - the phase 12 cleanup tool, `repair-derived.cjs` and the cli-pi lanes

### Definition of Done
- [x] Acceptance criteria reviewed - each row in `acceptance-criteria.md` carries its evidence
- [x] Tests passing - the full strict validation run is the gate for a documentation repair
- [x] Docs updated - spec, plan, tasks, acceptance criteria and the implementation summary reconciled at close
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A staged repair pipeline. Each stage is a script or a lane batch, and the validator's own output decides what the next stage receives.

### Key Components
- **Baseline**: strict validation of every folder with a `spec.md`, recorded per folder before any change.
- **Scripted fixes**: the phrase cleanup, a `description.json` path fix, `repair-derived.cjs`, a duplicate-anchor fixer that changes only marker lines and a frontmatter field copier that reads each folder's `spec.md`.
- **Lanes**: DeepSeek V4.1 Flash at max thinking through cli-pi, six at a time, each given twelve folders and their validator findings.
- **Final comparison**: a second full run joined to the baseline by folder path.

### Data Flow
The baseline lists failing folders and their rule findings. Each script reads those findings, fixes one class and writes only the lines that class owns. The validator runs again and the remaining findings feed the next stage. The lanes read their batch's findings and edit only files directly inside their folders. The final run is joined to the baseline, and any folder that passed before and fails now is a regression.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `specs/**` packets, live and archived | The record of every piece of work | Updated: structure, metadata, links and reconstructed documents | Full strict validation run joined to the baseline |
| Non-packet folders holding a `spec.md` | Backup snapshots, fixtures and review scopes | Unchanged, 91 files a repair touched were restored | `git diff` over the 37 folders is empty |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` | Retrieval index built from the corpus | Regenerated | `generate-trigger-index.mjs --check` |

Required inventories:
- Same-class producers: the validator's rule list is the inventory of failure classes, and each class has one fixer.
- Consumers of changed surfaces: the trigger index and the graph metadata read the corpus, and both are regenerated.
- Matrix axes: live or archived, by failure class, by fixer (script or lane).
- Algorithm invariant: no fix changes what an existing document says. The prose check compares every modified document's body with HEAD, ignoring frontmatter, comments and blank lines.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. Baseline: strict validation of all 4,408 folders with a `spec.md`, and the split into 4,371 packets and 37 non-packets.
2. Scripted fixes: the archive phrase cleanup, the path fix, re-derived metadata, duplicate anchors and frontmatter fields.
3. Lanes: 43 batches over the 474 folders the scripts could not fix.
4. Verification: the full re-validation, the prose check, the reconstruction note check and the trigger index rebuild.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Regression | Every packet that passed the baseline | `validate.sh --strict`, joined to the baseline by path |
| Content | Every modified Markdown document | A body comparison with HEAD, then a read of each flagged change |
| Manual | Lane output | The orchestrator read the flagged changes and each lane's report |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 12's cleanup tool | Internal | Green | The archive phrases would stay |
| `repair-derived.cjs` | Internal | Green | Derived metadata would drift |
| cli-pi with DeepSeek V4.1 Flash | External | Green | The 474 structural failures would need hand fixes |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A fix is found to have changed what a document says, or a packet that passed the baseline fails.
- **Procedure**: Each stage lands as its own commit, so `git revert` of that commit undoes one stage without touching the others.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Baseline (validate.sh over 4,408 folders)
     |
     +--> Scripted fixes (phrases, paths, metadata, anchors, fields)
                |
                +--> Lanes (43 batches, 474 folders)
                          |
                          +--> Full re-validation and prose check
                                    |
                                    +--> Trigger index rebuild
```

| Stage | Depends On | Blocks |
|-------|------------|--------|
| Baseline | Nothing | Every fix |
| Scripted fixes | Baseline | Lanes |
| Lanes | Scripted fixes | Re-validation |
| Re-validation | Lanes | Index rebuild and closure |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Stage | Complexity | Estimated Effort |
|-------|------------|------------------|
| Baseline and scripted fixes | Med | One session |
| Lanes | High | 43 batches, six at a time, about three hours |
| Verification | Med | Two full validation runs and the prose review |
| **Total** | | **2026-10-07 to 2026-10-08, no separate estimate recorded** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline recorded before any change - per folder, in the session's working files
- [x] Write scope bounded - scripts change only marker lines, frontmatter fields and paths, and lanes edit only files directly inside their folders
- [x] Non-packets excluded - the 37 folders are listed and their changes were restored
- Feature flags and monitoring alerts do not apply to a documentation repair

### Rollback Procedure
1. Identify the stage that introduced the problem from its commit.
2. `git revert` that commit.
3. Re-validate the folders the commit touched.

### Data Reversal
- **Has data migrations?** No. The changes are file edits under `specs/`.
- **Reversal procedure**: `git revert` per stage commit.
<!-- /ANCHOR:enhanced-rollback -->

---
