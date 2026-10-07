---
title: "Acceptance Criteria: Require a commit body on every authored commit"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "commit body always required acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/030-commit-body-always-required"
    last_updated_at: "2026-09-28T20:37:18Z"
    last_updated_by: "claude"
    recent_action: "Marked every criterion Met with the evidence observed this session"
    next_safe_action: "Commit the packet and push Code_Environment main"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "12f293fe-5421-46a0-b1ea-9fdc15ce0f8e"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Require a commit body on every authored commit

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-git/030-commit-body-always-required
**Level:** 2
**Status:** Complete
**Date:** 2026-09-28
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a one-path commit with only a subject, When `git commit` runs under the global hooks, Then the hook refuses it | `.skilled/scripts/git-hooks/commit-msg:237` and `.skilled/scripts/git-hooks/tests/commit-msg.test.sh:314`. `commit-msg.test.sh` case 18 PASS, and the negative control on real commits accepted it before the edit and printed `REJECT one-path-subject-only` after | Met | - |
| AC-002 | REQ-002 | Given a message whose only lines below the subject are `Spec:` or `Commit-Id:`, When the hook runs, Then it counts as no body and is refused | `.skilled/scripts/git-hooks/commit-msg:173` and `.skilled/scripts/git-hooks/tests/commit-msg.test.sh:326`. `commit-msg.test.sh` case 19 PASS, and `REJECT one-path-trailer-only` in the after control | Met | - |
| AC-003 | REQ-003 | Given a `Revert "` subject with no body, When the hook runs, Then it passes | `.skilled/scripts/git-hooks/tests/commit-msg.test.sh:338`. `commit-msg.test.sh` case 20 PASS, and `PASS revert-subject-only` in both the before and after controls | Met | - |
| AC-004 | REQ-004 | Given a subject-only message, When `SPECKIT_SKIP_COMMIT_MSG_VALIDATE=1` is set, Then the hook exits 0, and an attribution trailer is still refused | `.skilled/scripts/git-hooks/commit-msg:16`. Direct run: exit 0 with the bypass and exit 1 without it, plus the suite's bypass and attribution cases PASS | Met | - |
| AC-005 | REQ-005 | Given `SKILL.md`, its references, the template, the catalog page and the playbook, When searched for the old threshold, Then none states it | `.skilled/skills/sk-git/SKILL.md:467`. `rg -i 'four or more\|4\+ paths\|STAGED_FILE_COUNT'` over `.skilled/skills/sk-git` and `.skilled/scripts/git-hooks` matches only the release entry that describes the old rule | Met | - |
| AC-006 | REQ-006 | Given every doc example and script that commits under the global hooks, When scanned for a subject-only `git commit -m`, Then only the documented-not-executed refusal rows remain | `.skilled/skills/sk-git/SKILL.md:471`. `rg` over sk-git returns GIT-008 and GIT-009 only, and the expiry proof reruns green | Met | - |
| AC-007 | REQ-007 | Given the hook and sk-git suites, When rerun, Then each matches its baseline except the added cases | `.skilled/scripts/git-hooks/tests/commit-msg.test.sh:338`. commit-msg 19 to 22, prepare-commit-msg 56 of 56 after the fixture fix, pre-commit 55, pre-push 43, source-root 38, autostash 9, mass-deletion 12, commit-id 39, stamp-branch 24, worktree-naming 80, check-gate-inputs 48, `node --test` 33 pass, 0 fail | Met | - |
| AC-008 | REQ-008 | Given the release entry and the skill version, When validated, Then the entry is valid and the version reads `1.7.0.0` | `.skilled/skills/sk-git/SKILL.md:6`. `validate_document.py` VALID with 0 issues, `hvr_scan.py` 0 hard blockers, `check-frontmatter-versions.sh --skill sk-git` 65 of 65 ok, `SKILL.md` and `README.md` both `version: 1.7.0.0` | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

AC-001 to AC-004 carried the rule itself and AC-005 to AC-008 carried its documentation, its callers and its release. Per-document `version:` values across sk-git were left alone on purpose, because the versioning reference says not to reconcile them to quiet `verify`.
<!-- /ANCHOR:closure -->
