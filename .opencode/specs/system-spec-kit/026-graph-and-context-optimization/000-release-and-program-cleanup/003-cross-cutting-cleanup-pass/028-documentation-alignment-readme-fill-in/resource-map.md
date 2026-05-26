---
title: "Resource Map: Phase 053 doc-alignment and README fill-in [template:resource-map.md]"
description: "Detailed path catalog for the 5 work-blocks of phase 053: multi-ai-council ref alignment, manifest-doc ref alignment, two folder READMEs, and operator_runbook -> manual_testing_playbook merge."
trigger_phrases:
  - "resource map"
  - "phase 053 paths"
  - "doc alignment paths"
  - "operator_runbook merge map"
  - "predicates utils readme paths"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/028-documentation-alignment-readme-fill-in"
    last_updated_at: "2026-05-07T11:00:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Authored full per-WB path catalog"
    next_safe_action: "Cite WB-N anchors in cli-codex prompts"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Resource Map: Phase 053

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

<!-- ANCHOR:summary -->
## Summary

- **Total references**: 75 (8 in-place modify + 2 created code READMEs + 4 spec-packet docs + 47 merged playbook docs + 13 cross-reference grep targets + 1 deleted dir)
- **By category**: READMEs=2, Documents=58, Skills=58, Specs=8, Meta=2
- **Missing on disk**: 0
- **Scope**: All paths created, updated, removed, or analyzed during phase 053 (`028-documentation-alignment-readme-fill-in`) under parent `000-release-cleanup`. One aggregated map per packet (not per-WB).
- **Generated**: 2026-05-07T11:00:00Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` (exists on disk) · `MISSING` (referenced but absent) · `PLANNED` (intentional future path).
> Categories with zero entries are omitted.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:work-block-index -->
## Work-Block Index

This packet has five disjoint work-blocks. Each row in the tables below is tagged with its WB-N for cli-codex dispatch boundaries.

| WB | Scope | Files touched | Dispatch wave |
|----|-------|---------------|---------------|
| **WB-1** | `references/multi-ai-council/` frontmatter alignment | 6 modify | Wave A (parallel) |
| **WB-2** | `templates/manifest/{EXTENSION_GUIDE,MIGRATION}.md` frontmatter alignment | 2 modify | Wave A (parallel) |
| **WB-3** | `shared/predicates/README.md` create | 1 create | Wave A (parallel) |
| **WB-4** | `mcp_server/code_graph/lib/utils/README.md` create | 1 create | Wave B |
| **WB-5** | `operator_runbook/` -> `manual_testing_playbook/` merge | ~50 modify, ~48 create, ~44 delete (incl. dir) | Wave C (solo) |

Disjointness check: WB-1..WB-4 touch four distinct subtrees (`references/`, `templates/`, `shared/`, `mcp_server/code_graph/lib/`). WB-5 isolated to `mcp_server/skill_advisor/`. Safe to parallelize WB-1..3 in one wave; WB-4 alone in second wave; WB-5 solo last.
<!-- /ANCHOR:work-block-index -->

---

<!-- ANCHOR:readmes -->
## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/shared/predicates/README.md` | Created | PLANNED | WB-3. New folder README. Pattern anchor: `shared/parsing/README.md`. Sections: Overview, Directory Tree, Key Files, Stable API (5 functions), Boundaries, Validation, Related. Length norm ~120 LOC. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/utils/README.md` | Created | PLANNED | WB-4. New folder README. Pattern anchor: `shared/parsing/README.md` for brevity. Sections: Overview, Key Files, Stable API (4 exports), Boundaries (3 callers documented), Related. Length norm ~80–110 LOC. |
<!-- /ANCHOR:readmes -->

---

<!-- ANCHOR:documents -->
## 2. Documents

> Markdown artifacts that are not READMEs. Includes spec-folder docs and template references analyzed for guidance.

### Templates analyzed (read-only, do NOT modify)

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/sk-doc/assets/skill/skill_reference_template.md` | Analyzed | OK | Source of truth for WB-1 + WB-2 frontmatter and structure (1008 LOC). |
| `.opencode/skills/sk-doc/assets/documentation/readme_code_template.md` | Analyzed | OK | Source of truth for WB-3 + WB-4. |
| `.opencode/skills/sk-doc/references/specific/readme_creation.md` | Analyzed | OK | Folder-README authoring standards (DQI 75+ target). |
| `.opencode/skills/sk-doc/assets/testing_playbook/manual_testing_playbook_template.md` | Analyzed | OK | Source of truth for WB-5 entry-point + per-feature scaffolds (528 LOC). |
| `.opencode/skills/sk-doc/SKILL.md` | Cited | OK | Routing table maps reference docs to template. |

### Pattern anchors (read-only, copy-the-shape)

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/cli-claude-code/references/integration_patterns.md` | Cited | OK | Already-aligned reference doc; copy frontmatter shape verbatim for WB-1/WB-2. |
| `.opencode/skills/system-spec-kit/shared/parsing/README.md` | Cited | OK | Minimal 6-section code README; closest peer-style for WB-3 + WB-4. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/README.md` | Cited | OK | Full code README (parent of WB-4); already documents `utils/` in §5. |
| `.opencode/skills/cli-claude-code/manual_testing_playbook/manual_testing_playbook.md` | Cited | OK | Full sk-doc-aligned playbook; pattern anchor for WB-5 entry-point file. |
| `.opencode/skills/cli-claude-code/manual_testing_playbook/01--cli-invocation/001-base-non-interactive-invocation.md` | Cited | OK | Per-test scaffold pattern for WB-5 (9-column contract). |

### WB-1 — multi-ai-council reference files (modify in place)

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/references/multi-ai-council/command-wiring.md` | Updated | OK | Add YAML frontmatter, 1–2 sentence intro, `---` divider, renumber H2. 135 LOC base. |
| `.opencode/skills/system-spec-kit/references/multi-ai-council/convergence-signals.md` | Updated | OK | Add FM + 1-line intro; keep terse (27 LOC base). |
| `.opencode/skills/system-spec-kit/references/multi-ai-council/folder-layout.md` | Updated | OK | Add FM + intro + numbered H2 (46 LOC base). |
| `.opencode/skills/system-spec-kit/references/multi-ai-council/output-schema.md` | Updated | OK | Already has FM (only file in dir that does); verify keys match template, check H2 numbering (120 LOC base). |
| `.opencode/skills/system-spec-kit/references/multi-ai-council/seat-diversity-patterns.md` | Updated | OK | Add FM + intro (35 LOC base). |
| `.opencode/skills/system-spec-kit/references/multi-ai-council/state-format.md` | Updated | OK | Add FM + intro + numbered H2 (113 LOC base). |

### WB-2 — manifest maintainer docs (modify in place, NO relocation)

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/templates/manifest/EXTENSION_GUIDE.md` | Updated | OK | Add reference frontmatter + intro + divider + numbered H2. Add a comment near top: "Lives at `templates/manifest/` (not `references/`) because it co-locates with the manifest assets it documents." 45 LOC base. |
| `.opencode/skills/system-spec-kit/templates/manifest/MIGRATION.md` | Updated | OK | Same treatment as EXTENSION_GUIDE; co-location comment in header. 30 LOC base. |
<!-- /ANCHOR:documents -->

---

<!-- ANCHOR:skills -->
## 5. Skills

> All paths under `.opencode/skills/system-spec-kit/`. Contains both the doc-alignment WB targets and the WB-5 merge surface.

### WB-5 source A: operator_runbook (DELETED post-merge)

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/operator_runbook/` | Removed | OK | Entire directory `rm -rf`. No archival per memory `feedback_delete_not_archive_or_comment`. |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/operator_runbook/operator_runbook.md` | Removed | OK | 269 LOC entry-point absorbed into merged playbook entry. |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/operator_runbook/01--native-mcp-tools/**` | Removed | OK | 6 files (NC-001..NC-006), 503 LOC. Migrated to merged playbook category 01. |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/operator_runbook/02--cli-hooks-and-plugin/**` | Removed | OK | 4 files (CL-001..CL-004), 347 LOC. Migrated to merged playbook category 02. |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/operator_runbook/03--compat-and-disable/**` | Removed | OK | 4 files (CP-001..CP-004), 325 LOC. Migrated to merged playbook category 03. |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/operator_runbook/04--operator-h5/**` | Removed | OK | 3 files (OP-001..OP-003), 234 LOC. Migrated to merged playbook category 04. |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/operator_runbook/05--auto-update-daemon/**` | Removed | OK | 5 files (AU-001..AU-005), 432 LOC. Migrated to merged playbook category 05. |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/operator_runbook/06--auto-indexing/**` | Removed | OK | 5 files (AI-001..AI-005), 399 LOC. Migrated to merged playbook category 06. |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/operator_runbook/07--lifecycle-routing/**` | Removed | OK | 5 files (LC-001..LC-005), 380 LOC. Migrated to merged playbook category 07. |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/operator_runbook/08--scorer-fusion/**` | Removed | OK | 5 files (SC-001..SC-005), 383 LOC. Migrated to merged playbook category 08. |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/operator_runbook/10--python-compat/**` | Removed | OK | 5 files (PC-001..PC-005), 393 LOC. Migrated to merged playbook category 10 (number gap preserved per scope rule). |

### WB-5 source B: manual_testing_playbook (target — gets enriched)

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/manual_testing_playbook/manual_testing_playbook.md` | Updated | OK | 214 LOC entry-point rewritten to sk-doc template §1–6 boilerplate + per-category sections + cross-reference appendix. |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/manual_testing_playbook/01--recommendation/001-native-recommendation-happy-path.md` | Removed | OK | SAD-001 absorbed into NC-001. |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/manual_testing_playbook/01--recommendation/002-ambiguous-recommendation-rendering.md` | Removed | OK | SAD-002 absorbed into NC-004. |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/manual_testing_playbook/02--hook-integration/001-claude-user-prompt-submit-additional-context.md` | Removed | OK | SAD-003 absorbed into CL-001. |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/manual_testing_playbook/03--advisor-rebuild/001-explicit-advisor-rebuild-repair-path.md` | Removed | OK | SAD-004 absorbed into NC-006. |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/manual_testing_playbook/01--recommendation/` | Removed | OK | Old category dir replaced by `01--native-mcp-tools/`. |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/manual_testing_playbook/02--hook-integration/` | Removed | OK | Old category dir replaced by `02--cli-hooks-and-plugin/`. |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/manual_testing_playbook/03--advisor-rebuild/` | Removed | OK | Old category dir folded into `01--native-mcp-tools/` (SAD-004 → NC-006). |

### WB-5 target: merged manual_testing_playbook (new structure)

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/manual_testing_playbook/01--native-mcp-tools/` | Created | PLANNED | 6 files NC-001..NC-006. NC-001 + NC-004 + NC-006 each gain "Absorbed from former SAD-NNN" note. |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/manual_testing_playbook/02--cli-hooks-and-plugin/` | Created | PLANNED | 4 files CL-001..CL-004. CL-001 gains "Absorbed from former SAD-003" note. |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/manual_testing_playbook/03--compat-and-disable/` | Created | PLANNED | 4 files CP-001..CP-004. |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/manual_testing_playbook/04--operator-h5/` | Created | PLANNED | 3 files OP-001..OP-003. |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/manual_testing_playbook/05--auto-update-daemon/` | Created | PLANNED | 5 files AU-001..AU-005. |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/manual_testing_playbook/06--auto-indexing/` | Created | PLANNED | 5 files AI-001..AI-005. |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/manual_testing_playbook/07--lifecycle-routing/` | Created | PLANNED | 5 files LC-001..LC-005. |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/manual_testing_playbook/08--scorer-fusion/` | Created | PLANNED | 5 files SC-001..SC-005. |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/manual_testing_playbook/10--python-compat/` | Created | PLANNED | 5 files PC-001..PC-005. Number gap (`09--`) preserved per scope rule. |

### WB-3 + WB-4 source code analyzed (read-only, no modification)

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/shared/predicates/boolean-expr.ts` | Analyzed | OK | 379 LOC. README must enumerate the 5 functions: `parseBooleanExprString`, `validateBooleanExpr`, `parseWhenField`, `evaluateBooleanExpr`, `findProseBleed`. |
| `.opencode/skills/system-spec-kit/shared/predicates/boolean-expr.test.ts` | Analyzed | OK | 181 LOC vitest suite. README §Validation: `vitest run shared/predicates`. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/utils/workspace-path.ts` | Analyzed | OK | 64 LOC. README must enumerate exports `CanonicalizedWorkspace` (interface), `canonicalizeWorkspacePaths`, `isWithinWorkspace`, `assertWithinWorkspace`. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/detect-changes.ts` | Cited | OK | Caller of `workspace-path`. WB-4 README §Boundaries. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/verify.ts` | Cited | OK | Caller of `workspace-path`. WB-4 README §Boundaries. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts` | Cited | OK | Caller of `workspace-path`. WB-4 README §Boundaries. |
<!-- /ANCHOR:skills -->

---

<!-- ANCHOR:specs -->
## 6. Specs

> Phase 053 packet docs. Phase parent metadata also touched (see Note column).

| Path | Action | Status | Note |
|------|--------|--------|------|
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/028-documentation-alignment-readme-fill-in/spec.md` | Created | OK | Level 3 spec authored manually after `--phase` scaffold output Level 1 boilerplate. |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/028-documentation-alignment-readme-fill-in/plan.md` | Created | OK | Authored alongside spec.md; references this resource-map. |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/028-documentation-alignment-readme-fill-in/tasks.md` | Created | OK | Granular task breakdown per work-block. |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/028-documentation-alignment-readme-fill-in/checklist.md` | Created | OK | Verification checklist; populated during Phase 2/3. |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/028-documentation-alignment-readme-fill-in/decision-record.md` | Created | OK | 3 ADRs (D-1 merge scope, D-2 prefix scheme, D-3 manifest-doc placement). |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/028-documentation-alignment-readme-fill-in/resource-map.md` | Created | OK | This file. |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/028-documentation-alignment-readme-fill-in/implementation-summary.md` | Created | OK | Filled at Phase 3 completion. |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/028-documentation-alignment-readme-fill-in/description.json` | Updated | OK | Auto-generated by `create.sh`; refreshed by `generate-context.js` post-author. |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/028-documentation-alignment-readme-fill-in/graph-metadata.json` | Updated | OK | Auto-generated by `create.sh`; needs `parent_id` restored to `system-spec-kit/026-graph-and-context-optimization/000-release-cleanup` post-author. |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/graph-metadata.json` | Updated | OK | Parent metadata: `derived.last_active_child_id` set to this packet; `manual.depends_on`, `derived.status`, `parent_id` (= `system-spec-kit/026-graph-and-context-optimization`) restored after each generate-context run. |
<!-- /ANCHOR:specs -->

---

<!-- ANCHOR:author-instructions -->
## Author Instructions

This map is canonical for phase 053 dispatch boundaries. Per-WB cli-codex prompts MUST cite this file's WB-N anchor sections rather than re-deriving paths.

**Verification commands** (run from repo root):

```sh
# Per-doc DQI on every modified .md
for f in \
  .opencode/skills/system-spec-kit/references/multi-ai-council/*.md \
  .opencode/skills/system-spec-kit/templates/manifest/EXTENSION_GUIDE.md \
  .opencode/skills/system-spec-kit/templates/manifest/MIGRATION.md \
  .opencode/skills/system-spec-kit/shared/predicates/README.md \
  .opencode/skills/system-spec-kit/mcp_server/code_graph/lib/utils/README.md \
  .opencode/skills/system-spec-kit/mcp_server/skill_advisor/manual_testing_playbook/manual_testing_playbook.md
do python3 .opencode/skills/sk-doc/scripts/validate_document.py "$f" || echo "FAIL: $f"; done

# Strict packet validate
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/028-documentation-alignment-readme-fill-in \
  --strict

# operator_runbook gone
test ! -d .opencode/skills/system-spec-kit/mcp_server/skill_advisor/operator_runbook && echo OK

# No stale operator_runbook refs (excluding this packet)
rg -ln 'operator_runbook' .opencode/ specs/ \
  | grep -v '028-documentation-alignment-readme-fill-in' \
  | grep -v 'decision-record.md' \
  | grep -v 'resource-map.md'

# Stale SAD IDs gone (or only in cross-ref appendix)
rg -ln '\bSAD-00[1-4]\b' .opencode/

# All multi-ai-council files have FM
for f in .opencode/skills/system-spec-kit/references/multi-ai-council/*.md; do \
  head -1 "$f" | grep -q '^---' || echo "MISSING:$f"; done

# Both manifest docs have FM
for f in .opencode/skills/system-spec-kit/templates/manifest/{EXTENSION_GUIDE,MIGRATION}.md; do \
  head -1 "$f" | grep -q '^---' || echo "MISSING:$f"; done

# New code READMEs exist
test -f .opencode/skills/system-spec-kit/shared/predicates/README.md && \
  test -f .opencode/skills/system-spec-kit/mcp_server/code_graph/lib/utils/README.md && echo OK

# Merge per-test count == 43
find .opencode/skills/system-spec-kit/mcp_server/skill_advisor/manual_testing_playbook \
  -name '[0-9][0-9][0-9]-*.md' | wc -l
```

**Size budget:** This file is the heart of the packet per user's emphasis; ~250 LOC ceiling does not apply since paths are exhaustively enumerated for cli-codex dispatch.
<!-- /ANCHOR:author-instructions -->
