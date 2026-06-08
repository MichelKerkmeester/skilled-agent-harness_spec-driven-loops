---
title: "Implementation Summary: Spec-tree structural cleanup"
description: "Resolved two active duplicate-number sets and restructured four conformant phase parents to purity; the review-campaign parent and the cross-cutting decision-record parents were documented as deliberate non-changes."
trigger_phrases:
  - "spec tree structural cleanup done"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/141-spec-tree-structural-cleanup"
    last_updated_at: "2026-06-08T13:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "4 phase parents restructured + 2 duplicates fixed; B2 documented"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/141-spec-tree-structural-cleanup/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000141"
      session_id: "spec-141-spec-tree-structural-cleanup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 141-spec-tree-structural-cleanup |
| **Completed** | 2026-06-08 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A deterministic audit of the 1,751 active spec folders, cross-checked by an independent gpt-5.5-fast pass, found two structural violation classes. Both were fixed where the packets were conformant, and the non-conformant cases were documented rather than forced.

### Rule A: duplicate sibling numbers
Two active sibling sets shared a 3-digit prefix. `029-post-027-findings-remediation` became `030-` (the slot was free), and `016-cross-session-kill-scoping` became `029-` (next free after `028`). A third apparent duplicate, two `016-*-pt-01/02` folders under a `review/` directory, was a false positive: they are deep-review workspace artifacts, not spec packets.

### Rule B: phase-parent purity
Seven phase parents carried heavy docs at the root. Four conformant parents were restructured so the root holds only a lean phase-parent spec plus the two JSONs: `014-infra-memory-db-and-graph-churn`, `001-search-intelligence-stress-playbook`, `011-source-bug-and-misalignment-audit`, and `008-real-world-usefulness-test-planning`. For each, the root work moved into a new `001` phase and the existing phases shifted up by one. Where the root was already a phase-parent-style spec, a fresh leaf spec was authored for the new `001`; where it was a plain feature spec, the moved spec served as the leaf.

Three were left unchanged by decision. `012-comprehensive-deep-review-audit` was reverted because its phases are non-conformant review-slice workspaces (just `spec.md` plus probe reports), so a clean restructure would have meant fabricating spec packets. `004-code-index-stack` and `004-semantic-trigger-fallback` carry only a `decision-record.md` at root, which is a packet-wide cross-cutting doc, not misfiled phase work.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.../001-local-embeddings-foundation/030-post-027-findings-remediation` | Rename | Rule A duplicate fix |
| `.../007-mcp-daemon-reliability/029-cross-session-kill-scoping` | Rename | Rule A duplicate fix |
| `.../007-mcp-daemon-reliability/014-infra-memory-db-and-graph-churn/**` | Restructure | Rule B: new 001 + shift |
| `.../003-fix-mcp-runtime-stress-findings/001-search-intelligence-stress-playbook/**` | Restructure | Rule B: new 001 + shift |
| `.../004-code-graph/011-source-bug-and-misalignment-audit/**` | Restructure | Rule B: new 001 + shift |
| `.../004-code-graph/008-real-world-usefulness-test-planning/**` | Restructure | Rule B: new 001 + shift |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each rename set the packet's own identity from its new location (`packet_pointer`, `spec_folder`/`specFolder`) and surgically patched the parent `children_ids` manifest, then validated `--strict`. A first attempt to refresh metadata with the subtree backfill over-reached, regenerating dozens of unrelated `graph-metadata.json` files; that churn was reverted and replaced with the minimal per-packet patch. The restructures shifted existing phases in reverse order to avoid collisions, moved the heavy docs into the new `001`, and rebuilt the parent manifest. Commits were scoped with `git commit --only -- <subtree>` because concurrent sessions share the git index, and each commit's stat was verified to contain only its packet.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| New 001 from root docs, shift existing phases up | The operator's stated convention; keeps the root work as the first phase |
| Author a fresh leaf spec when the root was phase-parent-style | The moved phase-parent spec is wrong for a leaf; a clean feature spec fits |
| Revert `012` rather than restructure | Its phases are review-slice workspaces; cleaning them would fabricate packets |
| Leave the decision-record-only parents | A packet-wide ADR record is a legitimate cross-cutting parent doc |
| Leave `z_archive` violations | Documented tolerant/legacy policy |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Active Rule-A audit re-run | Clean (two sets resolved) |
| `014-infra` parent + 2 phases --strict | PASS (parent + 002 clean; 001 carries 1 pre-existing research.md citation warning) |
| `001-search-playbook` parent + 3 phases --strict | PASS, 0/0 |
| `011-source-bug-audit` parent + 4 phases --strict | PASS, 0/0 |
| `008-usefulness-test` parent + 8 phases --strict | PASS, 0/0 |
| Commit scoping (no foreign-file leak) | Verified per commit |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`014-infra` phase 001 carries one pre-existing warning.** Its `research/research.md` lacks a citation token; it is a `@deep-research`-owned file, left as-is rather than padded.
2. **`012-comprehensive-deep-review-audit` keeps its heavy root docs.** Its phases are review-slice workspaces, so it stays as-is until a review-artifact layout is decided.
3. **`z_archive` and decision-record parents unchanged.** Documented as deliberate non-changes, not oversights.
<!-- /ANCHOR:limitations -->
