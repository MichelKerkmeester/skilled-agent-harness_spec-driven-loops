---
title: Spec Folder Write Recipe
description: Step-by-step recipe for writing a new spec folder that satisfies validate.sh --strict on first try.
trigger_phrases:
  - "spec folder write recipe"
  - "scaffold spec folder steps"
  - "level one docs authoring"
  - "strict validate first try"
importance_tier: normal
contextType: implementation
version: 3.5.0.5
---

# Spec Folder Write Recipe

## 1. OVERVIEW

When `/speckit:complete` or any other workflow needs to write a new spec folder, this recipe is the canonical path. Follow each step in order. Each step has a verification gate.

## 2. PRE-CONDITIONS

- Spec folder track decided (e.g., `skilled-agent-orchestration/`, `00--ai-systems/`, etc.)
- Next packet number known (highest `[0-9][0-9][0-9]-*` + 1 in track)
- Documentation level decided (Level 1, 2, 3, or 3+)

## 3. STEPS

### Step 1: Scaffold via create.sh

Run the system-spec-kit scaffold from the repository root:

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/create.sh \
  --skip-branch \
  --short-name "opencode-authoring-recipe" \
  --number 078 \
  --level 1
```

Verification gate: confirm the scaffolded folder exists and contains the expected Level contract files.

### Step 2: Move to track

Move the scaffolded folder from the default location into the selected track, for example:

```bash
mv specs/078-opencode-authoring-recipe \
  <spec-folder>
```

Verification gate: confirm the final path is under `specs/` or `.opencode/specs/` and matches the packet pointer.

### Step 3: Author 4 Level-1 docs

- `spec.md` (7 anchors: metadata, problem, scope, requirements, success-criteria, risks, questions)
- `plan.md` (7 anchors: summary, quality-gates, architecture, phases, testing, dependencies, rollback)
- `tasks.md` (6 anchors: notation, phase-1, phase-2, phase-3, completion, cross-refs; phase headers MUST be canonical "Phase 1: Setup" / "Phase 2: Implementation" / "Phase 3: Verification")
- `implementation-summary.md` (6 anchors: metadata, what-built, how-delivered, decisions, verification, limitations)

Verification gate: run `rg -n "ANCHOR:" <folder>` and confirm each doc has the full anchor count.

### Step 4: Frontmatter `_memory.continuity` block

- `packet_pointer`: slash-separated relative path (NOT just folder name)
- `recent_action`: keep compact (NOT verbose multi-clause)
- `last_updated_at`: ISO-8601 UTC

Verification gate: run `rg -n "_memory:|packet_pointer|recent_action|last_updated_at" <folder>`.

### Step 5: Refresh metadata

```bash
node .opencode/skills/system-spec-kit/scripts/dist/spec-folder/generate-description.js \
  <folder> \
  <repo-root> \
  --description "Short description for memory search" \
  --level N

node .opencode/skills/system-spec-kit/scripts/dist/spec-folder/backfill-graph-metadata.js \
  --root <folder>
```

Verification gate: confirm `description.json` and `graph-metadata.json` exist and describe the same folder.

### Step 6: validate.sh --strict gate

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict
```

Must exit with 0 errors AND 0 warnings (warnings count as failures under `--strict`).

Common pitfalls: `SPECDOC_SUFFICIENCY_004` (research.md needs anchor + citation pattern), `TEMPLATE_HEADERS` (canonical phase header names required), `ANCHORS_VALID` (full 7/7/6/6 anchor count per doc-type).

### Step 7: Commit + push

- Stay on main (no feature branches per memory rule)
- Conventional commit message: `feat|chore|fix(<packet>): <short description>`
- Co-Authored-By trailer

Verification gate: confirm `git status --short` only includes the intended packet files before commit.

## 4. POST-CHECKS

- [ ] validate.sh --strict exit 0
- [ ] git status clean (only the new packet files)
- [ ] git push origin main success
- [ ] /memory:save via generate-context.js (optional but recommended)

## 5. COMMON FAILURES

| Failure | Fix |
|---|---|
| TEMPLATE_HEADERS error | tasks.md must use canonical "Phase 1: Setup" / "Phase 2: Implementation" / "Phase 3: Verification" headers |
| ANCHORS_VALID error | plan.md needs all 7 anchors (summary/quality-gates/architecture/phases/testing/dependencies/rollback) |
| SPECDOC_SUFFICIENCY_004 | research.md needs at least one ANCHOR block containing a citation pattern (file path in backticks, markdown link, or "iteration-N" reference) |
| FRONTMATTER_VALID error on packet_pointer | Use the full slash-separated relative path for the active work packet, not only its leaf folder name |

## 6. RELATED RESOURCES

- spec_folder_authoring_checklist.md (companion checklist, same directory)
- system-spec-kit/scripts/spec/validate.sh (the gate)
- system-spec-kit/scripts/dist/spec-folder/generate-description.js (metadata refresh)
- system-spec-kit/templates/manifest/{spec,plan,tasks,implementation-summary}.md.tmpl (canonical templates)
