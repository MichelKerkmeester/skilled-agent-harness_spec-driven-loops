---
title: "Implementation Plan: Phase 053 doc-alignment and README fill-in [template:level_3/plan.md]"
description: "Five-work-block dispatch plan for sk-doc template alignment, two missing folder READMEs, and operator_runbook -> manual_testing_playbook merge."
trigger_phrases:
  - "phase 053 plan"
  - "wave a wave b wave c"
  - "cli-codex dispatch plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/028-documentation-alignment-readme-fill-in"
    last_updated_at: "2026-05-07T11:00:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Authored plan.md alongside spec and decision-record"
    next_safe_action: "Dispatch Wave A via cli-codex"
    blockers: []
    key_files:
      - "specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/028-documentation-alignment-readme-fill-in/plan.md"
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 053

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

This phase orchestrates five disjoint doc-quality work-blocks plus one folder merge. Strategy: parallelize independent work-blocks across cli-codex (gpt-5.5 medium fast) dispatches, run the heavy merge solo, then verify with sk-doc validator + strict spec validate. No executable code changes.

### Approach

Three dispatch waves:
- **Wave A** (parallel, 3 blocks): WB-1 multi-ai-council, WB-2 manifest docs, WB-3 predicates README
- **Wave B** (parallel, 1 block): WB-4 utils README
- **Wave C** (solo): WB-5 operator_runbook -> manual_testing_playbook merge

Detailed source/target paths in `resource-map.md` (the canonical dispatch reference).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:execution -->
## 2. EXECUTION FLOW

### Phase 0 — Packet scaffold (DONE)

1. `create.sh --phase --phase-parent <parent> --phases 1 --phase-names "doc-alignment-and-readme-filling" --level 3 --number 53` — scaffolded core docs.
2. Authored: spec.md (Level 3 content), resource-map.md (detailed catalog), decision-record.md (3 ADRs), plan.md (this file).
3. Pending in Phase 0: tasks.md, checklist.md, restore graph-metadata.json `parent_id`.

### Phase 1 — Dispatch waves

**Per-WB cli-codex prompt skeleton** (always with `-c service_tier="fast"`):
```
codex exec -c service_tier="fast" -m gpt-5.5 -r medium <<'EOF'
Read the resource-map.md for phase 053:
  specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/028-documentation-alignment-readme-fill-in/resource-map.md
Find the WB-N anchor section. Execute exactly the modifications listed there.

Template (read-only): <template path>
Pattern anchor (read-only): <anchor path>

Constraints:
- Modify only the WB-N target files
- Verify each modified file with: python3 .opencode/skills/sk-doc/scripts/validate_document.py <path>
- Do NOT relocate WB-2 files (stay at templates/manifest/)
- Do NOT add emojis, em dashes, or fabricated content
- Report a one-line status per file when done
EOF
```

**Wave A** (3 parallel codex shells):
- WB-1: 6 multi-ai-council files frontmatter + structure
- WB-2: 2 manifest maintainer docs frontmatter + structure (in place)
- WB-3: predicates folder README

**Wave B** (1 codex shell):
- WB-4: code_graph utils folder README

**Wave C** (solo codex shell, longer running):
- WB-5: full operator_runbook -> manual_testing_playbook merge with cross-reference appendix and `rm -rf` of source dir

### Phase 2 — Verification

Run all checks from `resource-map.md` §Author Instructions. Fix any failures; do not advance to Phase 3 until all pass.

### Phase 3 — Completion

1. Fill `implementation-summary.md` with concrete evidence per WB.
2. Mark every checklist item `[x]` with file-path + grep-hit evidence.
3. Final `validate.sh --strict` — exit 0.
4. `generate-context.js` to refresh continuity; restore parent_id, manual.depends_on, derived.last_active_child_id afterward.
<!-- /ANCHOR:execution -->

---

<!-- ANCHOR:dependencies -->
## 3. DEPENDENCIES

| Type | Dependency | Note |
|------|------------|------|
| Tool | `cli-codex` (gpt-5.5, medium reasoning, fast service tier) | Per memory `feedback_codex_cli_fast_mode`, `-c service_tier="fast"` always |
| Tool | sk-doc validator | `python3 .opencode/skills/sk-doc/scripts/validate_document.py` |
| Tool | system-spec-kit strict validate | `bash scripts/spec/validate.sh --strict` |
| Template | `sk-doc skill_reference_template.md` | WB-1, WB-2 |
| Template | `sk-doc readme_code_template.md` | WB-3, WB-4 |
| Template | `sk-doc manual_testing_playbook_template.md` | WB-5 |
<!-- /ANCHOR:dependencies -->
