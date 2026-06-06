---
title: "Implementation Summary: Migration Tooling & Dry-Run [133/002/implementation-summary]"
description: "A deterministic, dry-run-default de-number + reference-rewrite tool with fail-closed collision handling, validated by a 23-assertion harness, a real-tree dry-run, and a MiMo PASS review."
trigger_phrases:
  - "133 phase 002 implementation summary"
  - "denumber-snippets tool complete"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/133-catalog-playbook-snippet-denumbering/002-migration-tooling-and-dry-run"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase 002 complete: tool validated 23/23 + dry-run + MiMo PASS"
    next_safe_action: "Create the worktree, then run phase 003 (system-spec-kit)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 133-catalog-playbook-snippet-denumbering/002-migration-tooling-and-dry-run |
| **Completed** | 2026-06-06 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A deterministic migration tool, `tooling/denumber-snippets.cjs`, now performs the actual de-numbering on a catalog or playbook tree. You run it with `--tree <dir>`; it strips the numeric prefix from each per-feature filename, rewrites every in-tree reference (the snippet's own SOURCE METADATA path, same-directory neighbor links, and the tree's root-doc links), and writes machine-readable manifests. It defaults to `--dry-run` (writes nothing) and only mutates under `--apply`.

### Fail-closed collision handling
Before any write, the tool builds the `dst -> [srcs]` map. If two files would collapse to the same name (or a target already exists), it writes `collision-report.json` and exits code 2 with zero writes, even under `--apply`. The two known collisions in `system-spec-kit/.../16--tooling-and-scripts/` are pre-resolved to distinct slugs (see `scratch/phase-002-collision-resolution.md`) before that tree is migrated.

### Reference-rewrite safety
Matching is literal (the exact known old paths) and boundary-bounded: a match needs a non-alphanumeric character before it and after the `.md`, so a Feature ID like `M-219` or text like `xNNN.mdx` is never touched, and `#anchor` suffixes and `./`/`../` prefixes are preserved. Renames use `fs.renameSync` only — never git — so parallel agents in one worktree never race the git index (the orchestrator stages and commits, scoped and sequential).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `002-.../tooling/denumber-snippets.cjs` | Created | The migration tool |
| `002-.../tooling/test-tool.cjs` | Created | 23-assertion test harness |
| `002-.../tooling/make-fixtures.cjs` | Created | Synthetic edge-case fixtures |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek-v4-pro authored the tool from a precise contract (`--pure`, RCAF). A 23-assertion harness — built before reviewing the tool — caught one real bug: `findRootDoc` searched `<parent>/<tree>.md` instead of `<tree>/<tree>.md`, so root-doc links went un-rewritten. A one-line orchestrator fix resolved it and the harness went green. A real-tree dry-run on `system-code-graph` then confirmed correct behavior on live data (14 + 22 renames, 0 collisions, nothing written, root docs included). Finally MiMo-v2.5-pro reviewed the tool adversarially and returned PASS with no findings.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| `fs.renameSync`, never git, in the tool | Parallel agents share one worktree git index; keeping git out of the tool lets the orchestrator commit scoped + sequentially without races |
| Cross-tree / cross-skill / spec refs deferred to phase 006 | The per-tree tool only knows its own rename map; a global sweep with the accumulated map rewrites the long tail correctly |
| Distinct slugs for the 2 collisions (no merge) | The 4 files are distinct scenarios (different Feature IDs + content); merging would delete a real scenario |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Test harness (`test-tool.cjs`) | PASS, 23/23 |
| Real-tree dry-run (`system-code-graph`) | 14 + 22 renames, 0 collisions, nothing written |
| Dry-run disk safety (git status) | Clean — no files modified |
| MiMo adversarial tool review | PASS, 0 findings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Single-tree scope by design.** Cross-tree (catalog↔playbook), cross-skill, and spec-folder references are not rewritten by a per-tree run; the phase-006 global sweep handles them using the accumulated rename map. Documented in `scratch/phase-002-findings.md`.
2. **`deep-ai-council` has an uppercase `FEATURE_CATALOG.md` root** (frozen anomaly); its root-doc links need `--referrers` in phase 004 or the phase-006 sweep.
<!-- /ANCHOR:limitations -->
