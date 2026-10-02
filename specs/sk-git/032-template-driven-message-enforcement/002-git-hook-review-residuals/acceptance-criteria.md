---
title: "Acceptance Criteria: Phase 2: git-hook-review-residuals"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "git hook residuals acceptance"
  - "rules probe parity acceptance"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/032-template-driven-message-enforcement/002-git-hook-review-residuals"
    last_updated_at: "2026-10-02T16:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "All residual review findings fixed and verified in worktree 075"
    next_safe_action: "Commit in worktree 075 on the operator's go-ahead"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fd6197bf-4447-484a-82b8-d9015d93169d"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 2: git-hook-review-residuals

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-git/032-template-driven-message-enforcement/002-git-hook-review-residuals
**Level:** 2
**Status:** Complete
**Date:** 2026-10-02
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a comment checker that exits 3, When the legacy pre-commit runs, Then the commit is blocked | `.skilled/scripts/git-hooks/tests/pre-commit.test.sh:668`; fails on the old hook (rc 0) | Met | - |
| AC-002 | REQ-002 | Given the router program packet moved and the layout module naming its new path, When a hub SKILL.md is committed, Then both manifests re-mint and the authored one at the new path is staged | `.skilled/scripts/git-hooks/tests/pre-commit.test.sh:675`; `.skilled/bin/lib/compiled-route-layout.cjs:53`; fails with the old hardcoded line; route guard exit 0; route test failures identical to baseline | Met | - |
| AC-003 | REQ-003 | Given a tab after the heading hashes, the words inside a longer word, a `.sk-git/` without the template, or a `skgit.contractDir` that points nowhere, When the probe runs, Then it answers as the validator does | `.skilled/scripts/git-hooks/tests/commit-msg.test.sh:442`; the old probe answers all four wrongly | Met | - |
| AC-004 | REQ-004 | Given a contract scope pattern `^(a+)+$` and a 35-character scope, When `validate-message.mjs` runs, Then it finishes under ten seconds with a rule failure | `.skilled/skills/sk-git/scripts/lib/message-contract.test.mjs:264` (211 ms); the old CLI was still running after 12 s | Met | - |
| AC-005 | REQ-005 | Given the stamper's key list and the template's `forbiddenKeys`, When they differ, Then a test fails | `.skilled/skills/sk-git/scripts/lib/message-contract.test.mjs:284`; a drifted key changes the compared list | Met | - |
| AC-006 | REQ-006 | Given the parent acceptance criteria, the feature catalog and the CI reference, When read against the code, Then they name `skgit.contractDir`, record the re-verification, say Complete, describe the Commit-Id copy rule and list the gates the hooks run | `specs/sk-git/032-template-driven-message-enforcement/acceptance-criteria.md:46`; `.skilled/skills/sk-git/references/continuous-integration.md:122`; `.skilled/skills/sk-git/feature-catalog/workflow-playbooks/message-contract-enforcement.md:48` | Met | - |
| AC-007 | REQ-006 | Given the source-root block copied into nine scripts, When the review's claim that only a comment guards it is checked, Then an existing test is found to compare every copy | `.skilled/scripts/git-hooks/tests/source-root-selection.test.sh:49` (58 passed); no change made | Met | - |
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

All seven criteria are Met with observed evidence, and every new test was run against the old code and failed there. The review's R4-P2-006 needed no change, because the copies were already tested.
<!-- /ANCHOR:closure -->
