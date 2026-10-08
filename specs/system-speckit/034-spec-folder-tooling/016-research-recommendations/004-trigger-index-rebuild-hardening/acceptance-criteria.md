---
title: "Acceptance Criteria: Phase 4: trigger-index-rebuild-hardening"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "trigger index rebuild hardening acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/004-trigger-index-rebuild-hardening"
    last_updated_at: "2026-10-08T09:55:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Recorded local evidence; four rows Unmet"
    next_safe_action: "Push, then meet the rows from the run log"
    blockers:
      - "No run on GitHub yet; nothing is pushed"
    key_files:
      - ".github/workflows/trigger-index-rebuild.yml"
      - ".github/workflows/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 4: trigger-index-rebuild-hardening

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/034-spec-folder-tooling/016-research-recommendations/004-trigger-index-rebuild-hardening
**Level:** 2
**Status:** In Progress
**Date:** 2026-10-08
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-002 | REQ-002 | Given the generator writes four files, When the workflow commits, Then all four files are staged and present in the tree | Run `git ls-tree HEAD` on the commit and verify `trigger-index.json`, `corpus-manifest.json`, `generation-diagnostics.json`, and `phrase-variants.json` are all present. Observed so far: the step's `FILES` array names all four paths, the sidecar paths match the generator defaults at `generate-trigger-index.mjs:77-80`, each file is checked to exist before `git add`, and the step passes `bash -n` and `shellcheck -s bash`. Still needs: `git ls-tree` on a real rebuild commit from a live run | Unmet | - |
| AC-003 | REQ-003 | Given a successful push scenario, When the commit succeeds, Then the subsequent push attempt uses a distinct error message for non-fast-forward vs auth failure | Make a push race on a throwaway branch and read the job log for the distinct message (the wording names the reset to the new tip, not a rebase). Observed so far: the step prints a different `::error::` for each of three classes, and a lifted copy of `classify_push_failure` sorted six sample push outputs as intended (`fetch first` to non-fast-forward, `pre-receive` and `Could not resolve host` to other, `GH013`, `GH006` and `terminal prompts disabled` to authentication). Still needs: a real rejected push, to show GitHub's own output text matches the patterns | Unmet | - |
| AC-005 | REQ-005 | Given a non-fast-forward error during push, When the retry logic runs, Then the job fetches and rebases to the branch tip, regenerates the index, runs `--check`, and retries the push once | Trigger on a stale commit to main; verify the log shows the fetch, the reset to the fetched tip (built in place of `git rebase`, see implementation-summary.md), one `generate-trigger-index.mjs` run and `--check` before the second push attempt; verify the final commit's index matches the tip's corpus. Observed so far: the step runs those commands in that order and pushes once, and Luna review round 1 (four findings, all applied) and round 2 (none) read it. Still needs: a live non-fast-forward race and its log | Unmet | - |
| AC-006 | REQ-006 | Given a commit whose subject starts with the rebuild subject but is not the job's own rebuild commit, When it is pushed, Then the job runs; and given the job's own rebuild commit, Then it is skipped | Read the `if:` on the job: an exact match or a marker check, not `startsWith`. Confirm on one push of each kind. Observed so far: the `if:` is `!endsWith(github.event.head_commit.message, 'Trigger-Index-Rebuild: ci')`, parsed from the YAML, with no `startsWith`; both rebuild commits end with that trailer; `sk-git/scripts/validate-message.mjs` accepts the trailer (rc 0); a suffix test on three sample messages skips only the one ending in the trailer. Still needs: one push of each kind on GitHub, which also shows whether `head_commit.message` reaches the guard without a trailing newline | Unmet | - |

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

**Closeable:** No (the workflow change is built, reviewed and checked locally, but all four rows need a live run on GitHub and none is Met)

When a live run has been seen and all AC rows show `Met`, this packet may close. To close it: push, dispatch the workflow on a stale corpus for AC-002, force a non-fast-forward race for AC-003 and AC-005, and push one human commit that quotes the subject and let the job push its own for AC-006. AC-001 and AC-004 (token hidden from checkout, token scoped to a main-only environment) were removed before any build, because the operator decided on 2026-10-08 to leave the token as it is. Their IDs are not reused.
<!-- /ANCHOR:closure -->
