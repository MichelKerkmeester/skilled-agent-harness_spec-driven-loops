---
title: "Changelog: Phase 7 — rename sk-small-model → sk-ai-small-model [114-small-ai-model-optimization/007-sk-ai-small-model-rename]"
description: "Chronological changelog for the Phase 7 — rename sk-small-model → sk-ai-small-model phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-21

> Spec folder: `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/007-sk-ai-small-model-rename` (Level 2)
> Parent packet: `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization`

### Summary

A coordinated rename pass across 22 live-reference surfaces, plus advisor reindex, plus parent metadata reconciliation.

### Added

- CHK-003 Predecessor 006-cross-skill-propagation/implementation-summary.md exists
- CHK-010 git mv .opencode/skills/sk-small-model .opencode/skills/sk-ai-small-model succeeded; old dir absent; new dir present
- CHK-016 New sk-ai-small-model/changelog/v0.3.0.0.md exists and documents the rename
- CHK-030 No hardcoded secrets introduced
- CHK-031 No new input handling, no new validation surfaces
- CHK-040 spec.md + plan.md + tasks.md + checklist.md + implementation-summary.md synchronized (all reference sk-ai-small-model as canonical)

### Changed

- CHK-001 spec.md exists with all 7 anchors + Level 2 anchors (nfr, edge-cases, complexity)
- CHK-002 plan.md exists with all 7 anchors + Level 2 anchors (phase-deps, effort, enhanced-rollback)
- CHK-004 Pre-rename rg "sk-small-model" baseline captured at 007-…/scratch/rg/rg-baseline-before.txt with 101 lines (95 unique files × multi-hit-files)
- CHK-005 cli-devin SKILL.md read in current context before any cli-devin dispatch composition
- CHK-011 sk-ai-small-model/SKILL.md frontmatter name: reads sk-ai-small-model
- CHK-012 sk-ai-small-model/graph-metadata.json skill_id reads sk-ai-small-model

### Fixed

- CHK-FIX-001 Each rename hit classified as class-of-bug (live) or instance-only (historical); classifier = spec.md §3 In Scope vs Out of Scope
- CHK-FIX-002 Same-class producer inventory completed: 95 unique files × multi-hits = 101 total rg lines; ~22 live files classified + edited; ~73 historical files preserved
- CHK-FIX-003 Consumer inventory completed: cli-devin + cli-opencode + sk-prompt graph-metadata.json scanned; manual playbooks scanned; root docs scanned; auto-memory scanned
- CHK-FIX-004 Adversarial table tests N/A (rename is non-security non-parser); substituted by historical-preservation invariant (NFR-003)
- CHK-FIX-005 Matrix axes listed: {live × historical} × {skill-body × sibling × root × memory × parent}
- CHK-FIX-006 Hostile env variant N/A (no env/global-state reads)

### Verification

- Spec folder strict validate - bash validate.sh 007/ --strict
- Live-surface rg (20 files) - rg "sk-small-model" on the allow-list
- Live-surface underscore variant - rg "sk_small_model" .opencode/skills/sk-ai-small-model/
- Historical-surface preservation - git diff --stat on 114/{001-006,review}/** + 026/.../iteration-009.md + sk-ai-small-model/changelog/v0.1+v0.2
- Compiled skill-graph.json fresh - jq '.generated_at, .skill_count'
- Compiled graph contains new name - jq '.families["sk-util"]'
- Compiled graph excludes old name - jq '.adjacency["sk-small-model"]'
- Reverse enhances edges fresh - jq '.adjacency["cli-devin"].enhances, .adjacency["cli-opencode"].enhances'

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/sk-small-model/` → `.opencode/skills/sk-ai-small-model/` | Renamed dir | `git mv` whole directory; history preserved |
| `sk-ai-small-model/SKILL.md` | Updated | frontmatter `name`, H1, in-body refs (incl. underscored Python identifier `sk_small_model` → `sk_ai_small_model`) |
| `sk-ai-small-model/README.md` | Updated | title, H1, all body refs |
| `sk-ai-small-model/description.json` | Updated | `name`, keywords[0], `pattern_index` path |
| `sk-ai-small-model/graph-metadata.json` | Updated | `skill_id`, entities[].name/path, derived.key_files |
| `sk-ai-small-model/references/pattern-index.md` | Updated | header + table self-refs |
| `sk-ai-small-model/changelog/v0.3.0.0.md` | Created | Rename changelog with verification table |
| `cli-devin/graph-metadata.json` + `cli-opencode/graph-metadata.json` | Updated | `edges.enhances[].target` → `sk-ai-small-model` |
| 4 manual playbook entries (`cli-devin/...03--model-presets/005,006-…` + `cli-opencode/...07--prompt-templates/004,005-…`) | Renamed + edited | Filenames + body refs |
| 2 manual playbook indexes (`manual_testing_playbook.md` ×2) | Updated | Link text + filename paths |
| `cli-opencode/references/permissions-matrix.md` + `cli-opencode/assets/permissions-matrix.example-packet-local.json` | Updated | Example rule path / `target_glob` |
| `AGENTS.md` (CLAUDE.md is a symlink) | Updated | Line 40 Small-model dispatch rule |
| `README.md` | Updated | Line 912 skill catalog entry |
| `~/.claude/projects/.../memory/MEMORY.md` | Updated | Dispatch-matrix index entry |
| `~/.claude/projects/.../memory/reference_small_model_dispatch_matrix.md` | Updated | Body refs (filename slug preserved per D-002) |
| `~/.claude/projects/.../memory/feedback_skill_graph_compiler_rebuild.md` | Updated (surgical) | Tagged `(renamed sk-ai-small-model 2026-05-21)` on 2026-05-18 narrative |
| `.../system-skill-advisor/mcp_server/scripts/skill-graph.json` | Regenerated | `skill_graph_compiler.py --export-json --pretty` (22 skills, fresh timestamp) |
| `.../system-rerank-sidecar/graph-metadata.json` | Incidental fix | `category: "skill"` → `"system"` (compiler blocker) |
| `.../mcp-coco-index/graph-metadata.json` | Incidental fix | Added reverse-sibling edge to `system-rerank-sidecar` (symmetry) |
| `.../114-small-ai-model-optimization/spec.md` | Appended | Phase 7 row in PHASE DOCUMENTATION MAP + amended Phase F deletion note |

### Follow-Ups

- Pin CHK-FIX-007 evidence to commit SHA after the rename commit lands on `main`.
- Consider tightening `system-rerank-sidecar` `edges.prerequisite_for[0]` weight from 0.3 into the recommended [0.7, 1.0] band (compiler still emits a soft WEIGHT-BAND warning; non-blocking).
- Packet 115 (queued by the user): rename `deep-ai-council` skill → `sk-ai-council` and `deep-ai-council.md` agent → `ai-council.md`, repo-wide reference propagation.
