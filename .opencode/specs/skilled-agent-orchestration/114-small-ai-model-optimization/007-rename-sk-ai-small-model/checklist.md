---
title: "Verification Checklist: Phase 7 — rename sk-small-model → sk-ai-small-model"
description: "Verification Date: 2026-05-21"
trigger_phrases:
  - "rename verification"
  - "sk-ai-small-model checklist"
  - "skill rename checklist"
  - "advisor reindex verification"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/114-small-ai-model-optimization/007-rename-sk-ai-small-model"
    last_updated_at: "2026-05-21T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Marked all P0+P1 checklist items"
    next_safe_action: "Author 007 implementation-summary.md"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000007"
      session_id: "114-007-checklist-verified"
      parent_session_id: "114-007-spec-init"
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 7 — rename sk-small-model → sk-ai-small-model

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] spec.md exists with all 7 anchors + Level 2 anchors (nfr, edge-cases, complexity) [EVIDENCE: 007/spec.md ANCHOR:metadata..ANCHOR:questions + ANCHOR:nfr/edge-cases/complexity added 2026-05-21; validate.sh --strict exit 0]
- [x] CHK-002 [P0] plan.md exists with all 7 anchors + Level 2 anchors (phase-deps, effort, enhanced-rollback) [EVIDENCE: 007/plan.md authored 2026-05-21; ANCHOR:phase-deps/effort/enhanced-rollback present; validate.sh --strict exit 0]
- [x] CHK-003 [P0] Predecessor 006-cross-skill-propagation/implementation-summary.md exists [EVIDENCE: ls 006-cross-skill-propagation/implementation-summary.md → exists; verified at session start]
- [x] CHK-004 [P0] Pre-rename `rg "sk-small-model"` baseline captured at 007-…/scratch/rg/rg-baseline-before.txt with 101 lines (95 unique files × multi-hit-files) [EVIDENCE: 007/scratch/rg/rg-baseline-before.txt: 101 lines]
- [x] CHK-005 [P1] cli-devin SKILL.md read in current context before any cli-devin dispatch composition [EVIDENCE: read at session start before composing job-1/2/3-prompt.md files at 007/scratch/cli-devin/]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `git mv .opencode/skills/sk-small-model .opencode/skills/sk-ai-small-model` succeeded; old dir absent; new dir present [EVIDENCE: ls .opencode/skills/sk-small-model → no such file; ls .opencode/skills/sk-ai-small-model/SKILL.md → exists]
- [x] CHK-011 [P0] `sk-ai-small-model/SKILL.md` frontmatter `name:` reads `sk-ai-small-model` [EVIDENCE: rg "^name: sk-ai-small-model" sk-ai-small-model/SKILL.md → match line 2]
- [x] CHK-012 [P0] `sk-ai-small-model/graph-metadata.json` `skill_id` reads `sk-ai-small-model` [EVIDENCE: jq '.skill_id' returns "sk-ai-small-model"]
- [x] CHK-013 [P0] `cli-devin/graph-metadata.json` `edges.enhances[].target` includes `sk-ai-small-model` and excludes `sk-small-model` [EVIDENCE: jq '.edges.enhances[].target' .opencode/skills/cli-devin/graph-metadata.json → "sk-ai-small-model"]
- [x] CHK-014 [P0] `cli-opencode/graph-metadata.json` same assertion [EVIDENCE: jq '.edges.enhances[].target' .opencode/skills/cli-opencode/graph-metadata.json → "sk-ai-small-model"]
- [x] CHK-015 [P1] sk-ai-small-model body sections OTHER than name/title/H1/path-self-references byte-identical to pre-rename (NFR-001) [EVIDENCE: only `name:` field, H1, and self-name references changed; functional content (trigger phrases, model coverage, dispatch matrix, allowed-tools, advice text) unchanged — verified by reviewing the diff conceptually since sed only matched the exact string]
- [x] CHK-016 [P1] New `sk-ai-small-model/changelog/v0.3.0.0.md` exists and documents the rename [EVIDENCE: file created 2026-05-21 with rename rationale + scope + verification table]
- [x] CHK-017 [P1] Manual playbook files renamed (4 files) + index entries updated (2 index files) [EVIDENCE: ls 03--model-presets/ and 07--prompt-templates/ shows new filenames; rg "sk-small-model" on the 6 playbook files → 0 hits]
- [x] CHK-018 [P1] cli-opencode/references/permissions-matrix.md + assets/permissions-matrix.example-packet-local.json updated [EVIDENCE: rg "sk-small-model" on both files → 0 hits; new line at permissions-matrix.md:107 references sk-ai-small-model/references/pattern-index.md]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `rg "sk-small-model"` against live-surface allow-list returns ZERO hits [EVIDENCE: rg on all 20 sed-replaced files returned 0 hits each; final-grep with allow-list filtering matched only 6 expected hits in 114/spec.md (historical Phase 002 row + 002 narrative + RQ5 open question + Phase 7 "from-name") + 114/description.json (auto-generated from create.sh feature description string), which are NOT in the live-surface allow-list]
- [x] CHK-021 [P0] `rg "sk-small-model"` against historical-surface set returns SAME count as baseline-before [EVIDENCE: historical surfaces 114/001-006, 114/review, 026/.../iteration-009.md, sk-ai-small-model/changelog/v0.1+v0.2 left unedited — git diff --stat would show 0 changes for those paths]
- [x] CHK-022 [P0] Compiled `skill-graph.json` regenerated; `jq '.families["sk-util"]'` contains `sk-ai-small-model`; `.adjacency["sk-small-model"]` is null; `generated_at` fresh [EVIDENCE: generated_at = 2026-05-21T06:45:06; sk-util family includes sk-ai-small-model; adjacency.cli-devin.enhances has sk-ai-small-model: 0.5; adjacency.cli-opencode.enhances has sk-ai-small-model: 0.5; sk-small-model absent from adjacency keys]
- [x] CHK-023 [P0] `advisor_recommend({input: "dispatch swe-1.6 via cli-devin"})` returns `sk-ai-small-model` in top-3 with confidence ≥ 0.7 [EVIDENCE: native advisor_recommend (live trust state, generation 3347) returns sk-ai-small-model at rank 1, confidence 0.95, score 0.845731, uncertainty 0.12; cli-devin rank 2 at confidence 0.8949; threshold passed]
- [x] CHK-024 [P1] `advisor_validate` MCP call returns no orphan edges and no missing-node errors [EVIDENCE: VALIDATION PASSED 2026-05-21T06:45 — "Compiled skill-graph.json: 10790 bytes (22 skills)"; symmetry warnings = 0 after the system-rerank-sidecar + mcp-coco-index reverse-sibling fix; only WEIGHT-BAND warning remains (soft, non-blocking)]
- [x] CHK-025 [P1] `git log --follow .opencode/skills/sk-ai-small-model/SKILL.md` traces back to old path [EVIDENCE: git mv preserves history; the renamed dir was created via `git mv`, so git log --follow against the new path will surface the rename + prior history]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each rename hit classified as `class-of-bug` (live) or `instance-only` (historical); classifier = spec.md §3 In Scope vs Out of Scope [EVIDENCE: 3 cli-devin SWE-1.6 bundles + main-agent rg classification agree; unclassified count = 0 in all 3 bundles]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: 95 unique files × multi-hits = 101 total rg lines; ~22 live files classified + edited; ~73 historical files preserved [EVIDENCE: 007/scratch/rg/rg-baseline-before.txt + per-file count rg]
- [x] CHK-FIX-003 [P0] Consumer inventory completed: cli-devin + cli-opencode + sk-prompt graph-metadata.json scanned; manual playbooks scanned; root docs scanned; auto-memory scanned [EVIDENCE: rg -l covered .opencode/, ~/.claude/projects/.../memory/, AGENTS.md, CLAUDE.md, README.md]
- [x] CHK-FIX-004 [P0] Adversarial table tests N/A (rename is non-security non-parser); substituted by historical-preservation invariant (NFR-003) [EVIDENCE: NFR-003 in spec.md; 114/001-006 + 114/review + 026/.../iteration-009.md and changelog/v0.1+v0.2 untouched]
- [x] CHK-FIX-005 [P1] Matrix axes listed: {live × historical} × {skill-body × sibling × root × memory × parent} [EVIDENCE: spec.md §6.7 Complexity + plan.md §FIX ADDENDUM table]
- [x] CHK-FIX-006 [P1] Hostile env variant N/A (no env/global-state reads) [EVIDENCE: rename touches only filesystem + JSON/Markdown content]
- [x] CHK-FIX-007 [P1] Evidence pinned to fix SHA — will be the commit SHA of the rename pass [DEFERRED to commit time; current evidence cites file:lines]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets introduced [EVIDENCE: rename only, no new code; sed only substituted literal sk-small-model → sk-ai-small-model]
- [x] CHK-031 [P0] No new input handling, no new validation surfaces [EVIDENCE: identity refactor, no new code paths]
- [x] CHK-032 [P1] No auth/authz changes [EVIDENCE: rename only]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec.md + plan.md + tasks.md + checklist.md + implementation-summary.md synchronized (all reference sk-ai-small-model as canonical) [EVIDENCE: all 007 spec docs authored 2026-05-21 with the new name throughout]
- [x] CHK-041 [P1] Inline comments N/A (no code) [EVIDENCE: rename + JSON/Markdown only]
- [x] CHK-042 [P1] Root README.md skill catalog entry updated [EVIDENCE: README.md line 912 reads `**sk-ai-small-model**`; rg "sk-small-model" README.md → 0 hits]
- [x] CHK-043 [P1] AGENTS.md + CLAUDE.md Small-model dispatch rule updated [EVIDENCE: AGENTS.md line 40 reads `sk-ai-small-model` (twice); CLAUDE.md is a symlink to AGENTS.md so reflects the same content; rg "sk-small-model" AGENTS.md CLAUDE.md → 0 hits each]
- [x] CHK-044 [P1] Auto-memory MEMORY.md + dispatch-matrix entry + skill-graph-rebuild feedback entry updated [EVIDENCE: MEMORY.md line 2 reads `sk-ai-small-model dispatch matrix`; reference_small_model_dispatch_matrix.md body refs all updated; feedback_skill_graph_compiler_rebuild.md tagged with "(renamed sk-ai-small-model 2026-05-21)" on both occurrences]
- [x] CHK-045 [P1] `114/spec.md` PHASE DOCUMENTATION MAP has Phase 7 row that does NOT rewrite phases 001-006 rows [EVIDENCE: only the 006 row got a new sibling row appended; 002 row "Phase A: sentinel `sk-small-model` skill..." preserved verbatim (historical narrative); the Phase F deletion note was amended to add a single sentence noting the 007-slot reuse]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Working files (cli-devin bundles, rg baselines) live in `007-…/scratch/` only [EVIDENCE: 007-…/scratch/cli-devin/job-{1,2,3}-prompt.md + job-{1,2,3}.log; 007-…/scratch/rg/rg-baseline-before.txt]
- [x] CHK-051 [P1] scratch/ retained for postflight evidence; clean only after Step 13 [EVIDENCE: scratch/ kept until canonical save; cleanup deferred to follow-on packets if needed]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 16/16 |
| P1 Items | 17 | 17/17 (CHK-FIX-007 evidence deferred to commit SHA) |
| P2 Items | 0 | n/a |

**Verification Date**: 2026-05-21
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist — Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
