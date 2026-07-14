---
title: "Checklist: sk-git Review Remediation Round 2"
description: "QA verifier contracts for the six review-remediation fixes: AGENTS.md Git Workspace Safety, allocator mktemp/exhaustion hardening, catalog↔references contract single-sourcing, SKILL.md NEVER refusals, and the cross-skill sk-doc validator hyphen fix. Each item marked [x] only with cited evidence."
trigger_phrases:
  - "sk-git review remediation checklist"
  - "git workspace safety checklist"
  - "allocator hardening checklist"
importance_tier: "important"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-git/006-git-review-remediation"
    last_updated_at: "2026-07-14T19:00:00Z"
    last_updated_by: "claude"
    recent_action: "All P0/P1 verifier contracts re-run by the orchestrator with evidence"
    next_safe_action: "Scoped commit + push; reconcile concurrent sk-git renumber before WS2"
    blockers: []
    key_files:
      - "checklist.md"
      - "spec.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-git-review-remediation-r2"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: sk-git Review Remediation Round 2

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

> Each item is a concern's **verifier contract**. Mark `[x]` only with evidence (path, command output, checker result). Fixes applied by fresh Sonnet-5 @ xhigh agents; every item independently re-verified by the orchestrator (finding = hypothesis).

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Readiness Impact |
|----------|----------|------------------|
| **P0** | Hard blocker | Must pass before completion |
| **P1** | Required | Must pass or carry an explicit user-approved deferral |
| **P2** | Optional | May remain for a later pass |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] All six target files confirmed clean before dispatch (no concurrent dirty edits). Evidence: `git status --porcelain` clean for `AGENTS.md`, `worktree-naming.{sh,test.sh}`, `SKILL.md`, `feature-catalog.md`, `validate_document.py`.
- [x] CHK-002 [P0] Per-concern verifier contracts frozen before agent dispatch. Evidence: this `checklist.md` authored pre-dispatch.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] (Concern 1) AGENTS.md Git Workspace Safety subsection present with all 5 rules. Evidence: `AGENTS.md:318` `##### Git Workspace Safety` — ask-first, owner-first `{owner}/{NNNN}-{slug}` grammar, allocate-never-count, no direct branch creation, hyphen-pilot guard; quick-ref row `AGENTS.md:463` ends `; see §5 Git Workspace Safety`.
- [x] CHK-011 [P1] (Concern 2c) Three contract conflicts single-sourced. Evidence: CI/CD → `gh` CLI across `references/github-mcp-integration.md`, `feature-catalog.md`, `feature-catalog/.../github-mcp-integration.md`, `quick-reference.md`; failing-test-gate override consistent (`finish-workflows.md` 45/89 add `unless the user explicitly overrides`); worktree-lanes verified non-conflict (catalog silent on `wt/`).
- [x] CHK-012 [P1] Authored packet docs carry no requirement identifiers or spec paths in code. Evidence: `validate.sh --strict` reports `COMMENT_HYGIENE_MARKER: No ephemeral comment-hygiene markers found`; fixes are doc/script edits, no code comments embed spec/packet ids.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] (Concern 2a/2b) Allocator harness green with new guard + boundary tests. Evidence: orchestrator ran `worktree-naming.test.sh` → `worktree-naming tests: PASS=47 FAIL=0`.
- [x] CHK-021 [P0] (Concern 2b) `next` fails silently at exhaustion. Evidence: `next_number` stubbed `scan_max_number=9999` → empty stdout AND `rc=1`; `9998` → `9999`.
- [x] CHK-022 [P0] (Concern 2e) Validator classifies hyphen-named leaves; no regression. Evidence: hyphen `feature-catalog` leaf → `feature_catalog`; hyphen `manual-testing-playbook` leaf → `playbook_feature`; `README.md` → `readme`/`total_issues: 0`; `--help` lists `playbook`, `playbook_feature`, `feature_catalog`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] (Concern 2a) `${TMP:?}` guard replaces `cd "$TMP" || exit 1`. Evidence: `worktree-naming.test.sh` now `cd "${TMP:?mktemp -d failed}"`; `_regression_empty_tmp_guard()` asserts empty `TMP` aborts (`expect_rc` non-zero) before any `git init`.
- [x] CHK-031 [P0] (Concern 2d) All four README-claimed refusals backed by NEVER rules. Evidence: `SKILL.md` NEVER #1 (force-push-main), #5 (secrets), #9 (`--no-verify`), #10 (amend-published).
- [x] CHK-032 [P1] (Concern 2e) `template_rules.json` path left unchanged (already correct). Evidence: line ~110 `script_dir.parent / "assets"` resolves to `sk-doc/shared/assets/template_rules.json` (verified exists).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P1] The allocator hardening removes a real footgun (harness could `git init` in the real clone on an mktemp failure). Evidence: `cd ""` returns 0 confirmed; `${TMP:?}` now aborts. No credential/network surface touched.
- [x] CHK-041 [P1] The new NEVER refusals codify existing safety intent (no behavior regression). Evidence: refusals mirror `README.md` §Cleanup And Safety Refusals; no script behavior changed.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] (Concern 1) AGENTS.md subsection mirrors SKILL.md grammar without contradiction. Evidence: agent read `SKILL.md` ALWAYS #4 / NEVER #2 before authoring; owner-first grammar + forbidden-command list match.
- [x] CHK-051 [P1] (Concern 2c) The `quick-reference.md` CI/CD example no longer calls non-existent GitHub-MCP tools. Evidence: `github.github_list_workflow_runs`/`get_job_logs` (0 hits in the authoritative inventory) replaced with `gh run list` / `gh run view --log`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] Packet lives under the `sk-git` track as `006-git-review-remediation`. Evidence: `.opencode/specs/sk-git/006-git-review-remediation/`.
- [x] CHK-061 [P1] Only the 10 intended files + this packet changed; concurrent-session files untouched. Evidence: `git diff --stat` shows the 10 target files; scoped staging only (never `git add -A`).
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | P0 Total | P0 Passed | Status |
|----------|----------|-----------|--------|
| Pre-Implementation | 2 | 2 | Pass |
| Code Quality | 1 | 1 | Pass |
| Testing | 3 | 3 | Pass |
| Fix Completeness | 2 | 2 | Pass |
| Documentation | 1 | 1 | Pass |

Overall: complete. All six concerns fixed by fresh Sonnet-5 @ xhigh agents and independently re-verified — allocator harness `PASS=47 FAIL=0`, validator hyphen-aware with no regression, CI/CD routing single-sourced to `gh` CLI, four NEVER refusals backing the README claim, AGENTS.md Git Workspace Safety subsection present. `validate.sh --strict` Errors 0.
<!-- /ANCHOR:summary -->
