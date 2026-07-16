---
title: "Verification Checklist: Renumber system-speckit active packets above the archive ceiling"
description: "Verification checklist for the 001-016 -> 026-041 system-speckit renumber: stub removal, git mv rename integrity, ref-repair completeness, metadata regen, and strict validation delta."
trigger_phrases:
  - "system-speckit renumber checklist"
  - "026-041 rename verification"
  - "packet ref-repair checklist"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "system-speckit/000-migration-from-soa-and-cleanup/001-system-speckit-renumber"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored Level 2 verification checklist items"
    next_safe_action: "Check items with evidence as phases complete"
    blockers: []
    key_files:
      - ".opencode/specs/system-speckit/z_archive/"
      - ".opencode/skills/system-spec-kit/scripts/spec/validate.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "001-system-speckit-renumber-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Renumber system-speckit active packets above the archive ceiling

<!-- SPECKIT_LEVEL: 2 -->

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

- [ ] CHK-001 [P0] Requirements documented in `spec.md`; evidence: archive ceiling (`025`), active overlap (`001-016`), and stub mismatch (`026-029`) all confirmed with direct `ls`/`git ls-files` commands cited in `spec.md` §2 and `plan.md` Planning Evidence.
- [ ] CHK-002 [P0] Technical approach defined in `plan.md`; evidence: exact 16-row source->target map in `plan.md` §4, executed in ascending-target order.
- [ ] CHK-003 [P1] Dependencies identified and available; evidence: `plan.md` §6 lists worktree, `generate-description.js`/`backfill-graph-metadata.js`, and `validate.sh --recursive` as confirmed-available.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] All 16 `git mv` operations show `R` (rename) in `git status --porcelain`, not `D`+`??` (delete + untracked-new) pairs; evidence: per-row `git status --porcelain -- <target>` output captured in `implementation-summary.md`.
- [ ] CHK-011 [P0] Regenerated `description.json`/`graph-metadata.json` for all 16 packets parse as valid JSON and reference the new `026-041` path, not the old `001-016` path; evidence: script exit-0 plus spot-check `grep` of the new basename inside each regenerated file.
- [ ] CHK-012 [P1] No numeric prefix in `.opencode/specs/system-speckit/` is ever occupied by two directories at any intermediate step; evidence: `ls -d .opencode/specs/system-speckit/*/ | grep -oE '^[0-9]{3}' | sort | uniq -d` returns empty at every checkpoint.
- [ ] CHK-013 [P1] Ref-repair edits follow project patterns (qualified-token anchor only, no bare-digit regex); evidence: repair command/diff shown in `implementation-summary.md` anchors on `system-speckit/<old-basename>`, not bare `00N-`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All P0 acceptance criteria in `spec.md` §4 are met; evidence: REQ-001 through REQ-007 each have a corresponding command-output line in `implementation-summary.md`.
- [ ] CHK-021 [P0] **Stubs gone**: `ls .opencode/specs/system-speckit/026-graph-and-context-optimization .opencode/specs/system-speckit/027-xce-research-based-refinement .opencode/specs/system-speckit/028-memory-search-intelligence .opencode/specs/system-speckit/029-phased-spec-preference` all report "No such file or directory"; evidence: captured command output, run AFTER stub removal and BEFORE any of the 16 renames.
- [ ] CHK-022 [P0] **16 renames R-status**: `git log --follow --stat -- .opencode/specs/system-speckit/<each of 026-cmd-memory-output .. 041-cmd-speckit-family-rename>/spec.md` shows continuous history through the pre-rename path for all 16 packets; evidence: 16 command outputs (or one combined script run) captured in `implementation-summary.md`.
- [ ] CHK-023 [P0] **active-min=026 > archive-max=025**: `ls -d .opencode/specs/system-speckit/z_archive/*/ | grep -oE '^[0-9]{3}' | sort -n | tail -1` = `025`, and `ls -d .opencode/specs/system-speckit/*/ | grep -oE '^[0-9]{3}' | sort -n | head -1` (excluding `z_archive` and `000`) = `026`; evidence: both command outputs captured together in `implementation-summary.md`.
- [ ] CHK-024 [P0] **validate error-delta<=0**: summed `bash validate.sh <each of 026-041> --recursive --strict` error count is <= the Phase 1 baseline sum captured in `tasks.md` T003; evidence: before/after table in `implementation-summary.md` per the regression-baseline-and-delta discipline (whole gate re-run, not a partial re-check).
- [ ] CHK-025 [P1] Repo-wide `rg -n "system-speckit/(00[1-9]|01[0-6])-" .` returns zero matches after ref repair; evidence: final sweep output captured, both inside and outside `.opencode/specs/system-speckit/**` (0 external hits was already confirmed during planning; this re-confirms 0 internal hits too).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: this packet's changes are `cross-consumer` (self-referential path tokens across ~7,164 files inside the 16 renamed trees) and `instance-only` for the 4 stub removals (no downstream consumer, confirmed 0 tracked/external references); evidence: classification stated in `spec.md` §3/§6.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed via scoped grep; evidence: per-old-basename `grep -rl "system-speckit/<old>"` counts recorded in `plan.md` Planning Evidence (002:3533, 003:1038, 004:2578, others single digits).
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed paths — confirmed 100% self-contained inside `.opencode/specs/system-speckit/**`, 0 hits in any other track, doc, or code path; evidence: repo-wide combined-pattern sweep with explicit exclusion check recorded in `plan.md` Planning Evidence.
- [ ] CHK-FIX-004 [P0] N/A — this packet is a path/filesystem rename plus text-token repair, not a security/parser/redaction fix; no adversarial delimiter/joined-input table applies. If a future execution pass discovers the ref-repair regex over-matches (e.g. catches a `REQ-00N`-style ID), that must be treated as a P0 regression and fixed before completion.
- [ ] CHK-FIX-005 [P1] Matrix axes listed before completion is claimed; evidence: `plan.md` FIX ADDENDUM lists the 5 axes (stub removal, rename, token repair, metadata regen, strict validation) that must all complete per packet.
- [ ] CHK-FIX-006 [P1] N/A — no process-wide/global state is read by this migration; it is pure filesystem + git operations.
- [ ] CHK-FIX-007 [P1] Evidence pinned to explicit command output captured at execution time (not a moving branch-relative range); evidence: `implementation-summary.md` records literal command + output per row, not a generic "looks fine" claim.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets touched or introduced; evidence: changes are directory names, frontmatter path strings, and generated JSON metadata only.
- [ ] CHK-031 [P0] N/A — no input validation surface; this is an internal spec-folder reorganization, not a runtime code path.
- [ ] CHK-032 [P1] N/A — no auth/authz surface touched.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`/`plan.md`/`tasks.md`/`checklist.md` synchronized for this planning packet; evidence: all four author the same 16-row map with identical source/target names.
- [ ] CHK-041 [P1] Comment hygiene: no spec-path or packet/phase IDs embedded inside code comments (this packet touches no code, only Markdown/JSON spec docs, so this item is satisfied by scope rather than requiring a separate check).
- [ ] CHK-042 [P2] `implementation-summary.md` authored during execution (not by this scaffolding pass) with the executed map, ref-repair evidence, and validation deltas — deferred to the downstream execution agent per instruction.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files (baseline captures, grep output snapshots) stay in `scratch/` or approved tool-output locations, not committed alongside the rename; evidence: execution-time working files kept outside the packet's tracked docs.
- [ ] CHK-051 [P1] `scratch/` (if used during execution) cleaned before completion is claimed.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 0/11 |
| P1 Items | 9 | 0/9 |
| P2 Items | 1 | 0/1 |

**Verification Date**: UNKNOWN (not yet executed — this packet is planning-only; verification runs during downstream execution)
<!-- /ANCHOR:summary -->
