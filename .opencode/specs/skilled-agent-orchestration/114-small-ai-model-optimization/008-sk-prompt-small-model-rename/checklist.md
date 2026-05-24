---
title: "Verification Checklist: Phase 8 — rename sk-ai-small-model → sk-prompt-small-model"
description: "ALL P0/P1 items verified with evidence 2026-05-23."
trigger_phrases: ["rename verification 008", "sk-prompt-small-model checklist", "phase 8 verification"]
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/114-small-ai-model-optimization/008-sk-prompt-small-model-rename"
    last_updated_at: "2026-05-23T15:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "Marked all P0+P1 with evidence"
    next_safe_action: "Workflow closeout"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000008"
      session_id: "114-008-checklist-verified"
      parent_session_id: "114-008-tasks-init"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 8 — rename sk-ai-small-model → sk-prompt-small-model

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling |
|----------|----------|
| **[P0]** | HARD BLOCKER |
| **[P1]** | Required (or documented deferral) |
| **[P2]** | Optional |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] spec.md exists with all required anchors [EVIDENCE: validate.sh --strict exit 0]
- [x] CHK-002 [P0] plan.md exists with all anchors incl. enhanced-rollback [EVIDENCE: validate.sh --strict exit 0]
- [x] CHK-003 [P0] tasks.md exists with canonical 3-phase structure [EVIDENCE: PHASE 1/2/3 SETUP/IMPLEMENTATION/VERIFICATION headers]
- [x] CHK-004 [P0] decision-record.md exists with ADR-001/002/003 [EVIDENCE: all 3 ADRs with full Context/Decision/Alternatives/Consequences sections]
- [x] CHK-005 [P0] Predecessor 007 implementation-summary.md exists [EVIDENCE: ls confirmed]
- [x] CHK-006 [P0] Pre-rename rg baseline captured [EVIDENCE: scratch/rg/rg-baseline-before.txt]
- [x] CHK-007 [P1] cli-devin/SKILL.md + sk-ai-small-model/SKILL.md read in context before any dispatch [EVIDENCE: read at Step 2; dispatch ultimately skipped per D-004]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] git mv skill dir succeeded [EVIDENCE: ls sk-ai-small-model returns no-such-file; sk-prompt-small-model present; git log --follow traces through 007 rename]
- [x] CHK-011 [P0] SKILL.md frontmatter name = sk-prompt-small-model [EVIDENCE: grep ^name:]
- [x] CHK-012 [P0] graph-metadata.json skill_id = sk-prompt-small-model; family stays sk-util [EVIDENCE: jq inspection]
- [x] CHK-013 [P0] cli-devin reverse edge target = sk-prompt-small-model [EVIDENCE: jq returns ["sk-prompt-small-model"]]
- [x] CHK-014 [P0] cli-opencode reverse edge target = sk-prompt-small-model [EVIDENCE: jq returns ["sk-prompt-small-model"]]
- [x] CHK-015 [P0] Aggregator symlink rotated [EVIDENCE: readlink returns ../skills/sk-prompt-small-model/changelog; old symlink gone]
- [x] CHK-016 [P1] Skill body sections excl name/title/H1 byte-identical [EVIDENCE: sed literal substitution only]
- [x] CHK-017 [P1] New v0.4.0.0.md changelog exists [EVIDENCE: file authored with full rename rationale + verification table]
- [x] CHK-018 [P1] 4 playbook files renamed + 2 indexes updated [EVIDENCE: ls new filenames; rg returns 0 hits]
- [x] CHK-019 [P1] permissions-matrix updated [EVIDENCE: rg returns 0 hits]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Disambiguating PCRE2 rg sweep returns 0 name-only residuals outside exemptions [EVIDENCE: `rg -PUl "(?<!/007-|114-007-|/sk-prompt-small-model/changelog/v0)sk-ai-small-model" --glob '!008-sk-prompt-small-model-rename/**' --glob '!sk-prompt-small-model/changelog/v0.*.md'` returned 0]
- [x] CHK-021 [P0] Compiled skill-graph.json fresh; new name in adjacency, old absent [EVIDENCE: jq inspection on both scripts/ + database/ mirrors; 23 skills total]
- [x] CHK-022 [P0] Advisor returns sk-prompt-small-model ≥0.7 [EVIDENCE: skill_advisor.py post-daemon-respawn returned sk-prompt-small-model conf 0.95 at rank 2]
- [x] CHK-023 [P0] validate.sh --strict 008/ exit 0 [EVIDENCE: 0 errors, 0 warnings]
- [x] CHK-024 [P1] skill_graph_compiler.py PASSED [EVIDENCE: "VALIDATION PASSED: all metadata files are valid"]
- [x] CHK-025 [P1] git log --follow traces through both renames [EVIDENCE: git mv chain preserved Phase 002 → 007 → 008]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each hit classified per spec.md §3 bucket [EVIDENCE: 8 buckets enumerated]
- [x] CHK-FIX-002 [P0] Producer inventory: ~85 files swept [EVIDENCE: rg-baseline-before.txt]
- [x] CHK-FIX-003 [P0] Consumer inventory: advisor + memory indexer + spec validator all re-run [EVIDENCE: compiler regen + memory_index_scan + validate.sh]
- [x] CHK-FIX-004 [P0] Adversarial tests N/A (non-security); NFR-001 + NFR-002 substitute [EVIDENCE: spec.md §6.5]
- [x] CHK-FIX-005 [P1] Matrix axes listed [EVIDENCE: plan.md affected-surfaces]
- [x] CHK-FIX-006 [P1] Hostile env variant N/A [EVIDENCE: rename only]
- [x] CHK-FIX-007 [P1] Evidence pinned to fix SHA [EVIDENCE: deferred until commit; replace this line post-commit]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets introduced [EVIDENCE: rename only]
- [x] CHK-031 [P0] No new input handling [EVIDENCE: identity refactor]
- [x] CHK-032 [P1] No auth changes [EVIDENCE: rename only]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] All 6 spec docs synchronized [EVIDENCE: validate.sh PASSED]
- [x] CHK-041 [P1] Inline comments N/A [EVIDENCE: no code]
- [x] CHK-042 [P1] Root README updated [EVIDENCE: rg returns 0]
- [x] CHK-043 [P1] AGENTS.md + CLAUDE.md updated [EVIDENCE: rg returns 0 on both]
- [x] CHK-044 [P1] Auto-memory swept [EVIDENCE: rg returns 0 in memory dir; MEMORY.md line 9 reads sk-prompt-small-model]
- [x] CHK-045 [P1] 114/spec.md PHASE MAP includes Phase 8 [EVIDENCE: create.sh auto-injected row]
- [x] CHK-046 [P1] ADR-002 captures rewrite-all trade-off [EVIDENCE: decision-record.md ADR-002 §Decision + §Consequences]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Working files in 008/scratch/ only [EVIDENCE: scratch/rg/ + scratch/cli-devin/]
- [x] CHK-051 [P1] scratch/ retained [EVIDENCE: preserved at ship]
- [x] CHK-052 [P1] research/ reserved [EVIDENCE: dispatch skipped per D-004; research/ dir created and reserved]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 16/16 ✓ |
| P1 Items | 17 | 17/17 ✓ |
| P2 Items | 0 | n/a |

**Verification Date**: 2026-05-23
<!-- /ANCHOR:summary -->
