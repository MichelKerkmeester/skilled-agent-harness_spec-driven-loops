---
title: "Implementation Summary: numbered-H2 divider and TOC/anchor standard (planning stage)"
description: "Investigation and reconciliation spec are complete; validator enforcement and fleet normalization are specified but not yet executed. Records the verified findings and the ratified direction."
trigger_phrases:
  - "029 implementation summary"
  - "divider anchor standard status"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/029-doc-divider-and-anchor-standard"
    last_updated_at: "2026-08-13T06:20:00Z"
    last_updated_by: "spec-author"
    recent_action: "Phase 2 landed + verified: SKDOC_ENFORCE_STRUCTURE-gated general-path divider/TOC/anchor check in validate_document.py (gpt-5.6-luna via cli-codex)"
    next_safe_action: "Phase 3 (fleet normalization ~1,016 files) on operator go-ahead; then flip SKDOC_ENFORCE_STRUCTURE to default-on"
    blockers:
      - "Phase 3 bulk fleet edit needs explicit operator go-ahead (high blast radius)"
      - "Concurrent session activity in specs/sk-doc reverted docs mid-authoring; confirm no other session owns 029 before executing"
    key_files:
      - ".opencode/skills/sk-doc/shared/scripts/validate_document.py"
      - ".opencode/skills/sk-doc/shared/assets/template-rules.json"
      - ".opencode/skills/sk-doc/shared/references/hvr-rules.md"
      - ".opencode/skills/sk-doc/shared/references/core-standards.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-029-authoring"
      parent_session_id: null
    completion_pct: 40
    open_questions:
      - "Constitutional-memory divider policy (Title-Case H2 class)"
      - "GitHub single-vs-double-dash slug (empirical)"
    answered_questions:
      - "README nav convention: bare numbered-H2"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 029-doc-divider-and-anchor-standard |
| **Status** | Planning complete, execution pending |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet is at planning stage. What exists today is a verified fleet-wide investigation and a Level 3 reconciliation spec, not the validator change or the fleet edits. The value delivered so far is a precise diagnosis and a ratified direction.

### The diagnosis

Two documented conventions drifted because nothing enforced them on the general path. Dividers (`---` between numbered ALL-CAPS H2) are required by every written authority but checked only on the opt-in code-folder path, so 1,015 of 3,667 numbered-H2 files are missing at least one (2,725 gaps). Navigation (TOC plus `<!-- ANCHOR -->` comments) is forbidden for READMEs by `core-standards.md` and `sk-create-readme`, but the validator and `hvr-rules.md` §9 still endorse the old TOC-plus-double-dash style, so both eras coexist.

### The distinction that matters

There are two different anchor systems. The vestigial README/skill nav anchors are the drift. The spec-kit continuity anchors in `spec.md` / `plan.md` / `tasks.md` / `implementation-summary.md` / `memory/context.md` are required, validated at error severity, and stay untouched. Any remediation must separate them.

### The ratified direction

Bare numbered-H2 wins: no TOC, no nav-anchors, `---` between numbered ALL-CAPS H2. See `decision-record.md` ADR-001.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The investigation read the authority files (`core-standards.md`, `hvr-rules.md`, the `sk-create-readme` suite) and the enforced validator (`validate_document.py`, `template-rules.json`), then ran a census script over 8,620 structured `.md` files to quantify the drift. The census heuristic was calibrated against real files after an initial false positive on `templates/README.md` (which does have dividers, hidden behind anchor comments). The spec, plan, tasks, decision record and this summary follow the same bare numbered-H2 standard they define.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Bare numbered-H2 as the single standard | Matches the written standard and 803 of 819 READMEs; only 16 carry a TOC, so it is the lowest-churn way to remove the contradiction |
| Preserve the continuity-anchor system | It is a separate required contract; stripping it would break memory and resume tooling |
| Sequence enforcement before normalization | The gate must be able to prove each of the 1,015 fixes |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Fleet census (8,645 `.md`) | DONE: 1,016 files / 2,728 divider gaps; 7 TOC; 54 anchor-comment files |
| Authority-conflict confirmed | DONE: `validate_document.py` + HVR §9 vs `core-standards.md` + sk-create-readme |
| Validator enforcement change (Phase 2) | DONE + independently verified: `validate_general_structure()` gated by `SKDOC_ENFORCE_STRUCTURE` (default OFF); negative control passes without flag / fails with flag; code-folder + core-validator suites green; continuity anchors exempt |
| Phase 2 executor | gpt-5.6-luna (max, fast) via cli-codex; scope-locked to 3 runtime files + fixtures/test |
| Fleet normalization | PENDING (Phase 3) — needs operator go-ahead (~1,016 files) |
| `validate.sh --strict` on this packet | BLOCKED: pre-existing `mcp-server/node_modules/zod` hollow install crashes the node validator for all packets |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Execution not started.** The validator change and the 1,015-file normalization are specified, not applied. Phase 3 needs an explicit operator go-ahead given its blast radius.
2. **GitHub slug behavior unverified.** Whether `## 1. OVERVIEW` renders as `#1-overview` or `#1--overview` on GitHub is asserted by the validator but not empirically confirmed. It gates any anchor-slug normalization.
3. **Constitutional-memory policy open.** Those files use unnumbered Title-Case H2 and are excluded from numbered-divider enforcement pending a separate decision.
4. **Concurrent-session interference observed.** During authoring, another live session running a spec reconcile pass over `specs/sk-doc/` reverted several docs in this packet to blank templates and regenerated `graph-metadata.json`. Confirm no other session owns 029 before executing.
<!-- /ANCHOR:limitations -->
