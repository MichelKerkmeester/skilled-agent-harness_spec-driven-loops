---
title: "Checklist: Wire Compiler + Routing-Accuracy Gates into CI"
description: "QA checklist for adding skill_graph_compiler.py and score-routing-corpus.py as new gated CI steps in routing-registry-drift.yml."
trigger_phrases:
  - "ci compiler accuracy gate checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/030-json-optimization-implementation/006-ci-compiler-accuracy-gates"
    last_updated_at: "2026-07-29T09:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase spec"
    next_safe_action: "Begin implementation per plan.md"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Wire Compiler + Routing-Accuracy Gates into CI

---

<!-- ANCHOR:protocol -->
## Verification Protocol

Every item carries a command or artifact reference. All items stay `[ ]` until implementation runs (this packet is Planned, not built).

| Priority | Meaning | Rule |
|----------|---------|------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [ ] CHK-001 [P0] 003 (fleet migration) and 004 (scaffold born-complete) confirmed shipped before this phase's gate is activated [evidence: 003/004 `implementation-summary.md` Status Complete]
- [ ] CHK-002 [P0] 002's pinned corpus-hash artifact read and the exact dataset path/reference recorded [evidence: reference to 002's pinned-hash file/output]
- [ ] CHK-003 [P1] Both target commands (`skill_graph_compiler.py --validate-only`, `score-routing-corpus.py --dataset <pinned-path>`) run locally against current `main` with a clean/expected result before the workflow file is touched [evidence: local command output]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [ ] CHK-004 [P0] Only `.github/workflows/routing-registry-drift.yml` is modified; `skill_graph_compiler.py` and `score-routing-corpus.py` are unmodified (this phase wires, does not change validator logic) [evidence: `git diff --stat` shows one file]
- [ ] CHK-005 [P1] The four pre-existing `routing-drift` steps are byte-unchanged except for the `paths:` filter extension [evidence: `git diff` on the workflow file — no line changes inside the four existing `run:` blocks]
- [ ] CHK-006 [P1] New steps run in the scripts' existing `working-directory: .opencode/skills/system-skill-advisor/mcp-server` context, matching the pattern of the four existing steps [evidence: workflow YAML diff]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [ ] CHK-007 [P0] Compiler step fails on a deliberately broken `derived.key_files` path (fresh-clone dry run, scratch copy) with the expected `ERRORS in <folder>` diagnostic [evidence: dry-run log]
- [ ] CHK-008 [P0] Accuracy step fails on a deliberately regressed accuracy number (scratch corpus copy) against the pinned floor [evidence: dry-run log]
- [ ] CHK-009 [P1] Both new steps pass in a fresh-clone dry run (not just the local working tree) [evidence: clean-clone CI simulation log]
- [ ] CHK-010 [P1] New `paths:` glob entries verified to match GitHub Actions' path-filter syntax and actually fire on a change to either new surface [evidence: workflow syntax check + a test-branch push touching only the compiler script]
- [ ] CHK-011 [P2] Compiler gate re-run against the fleet immediately post-003/004 merge confirms zero unexpected failures (no unmigrated skill slipped through) [evidence: fleet-wide `--validate-only` run log]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [ ] CHK-012 [P0] Both new CI steps are present in the merged workflow and both are reachable (not commented out, not `if: false`) [evidence: merged `routing-registry-drift.yml`]
- [ ] CHK-013 [P1] Activation order documented and honored: this phase's gate-enabling commit lands strictly after 003 and 004 [evidence: commit history / PR merge order]
- [ ] CHK-014 [P2] Accuracy floor flags sourced from the 003 post-migration baseline, not an arbitrary guess [evidence: floor values cross-referenced against 003's baseline artifact]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [ ] CHK-015 [P1] No secrets, tokens, or credentials introduced by the new workflow steps [evidence: workflow diff review]
- [ ] CHK-016 [P2] New steps run with the same permissions/runner as the existing job (no privilege escalation) [evidence: workflow diff — no new `permissions:` block added]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [ ] CHK-017 [P1] Inline workflow comment explains the pinned-corpus rationale, citing the 029 research finding (O4) [evidence: workflow YAML comment block]
- [ ] CHK-018 [P2] Packet continuity (`implementation-summary.md`) updated to Complete with verification evidence once implemented [evidence: post-implementation summary]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [ ] CHK-019 [P1] All spec-folder docs live under this phase's own folder; no file written outside `006-ci-compiler-accuracy-gates/` [evidence: `git status` scoped to this folder]
- [ ] CHK-020 [P2] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` run and passes before any completion claim [evidence: validator output]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| Pre-flight checks | 3 | 0/3 |
| Code quality | 3 | 0/3 |
| Testing | 5 | 0/5 |
| Fix completeness | 3 | 0/3 |
| Security | 2 | 0/2 |
| Docs | 2 | 0/2 |
| File org | 2 | 0/2 |

**Verification Date**: Not yet run (Planned)
<!-- /ANCHOR:summary -->
