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
| AC-002 | REQ-002 | Given the generator writes four files, When the workflow commits, Then all four files are staged and present in the tree | Live run 37761007246 on 2026-10-08: the recovery commit `08af7d089e` by github-actions[bot] changes exactly `trigger-index.json`, `corpus-manifest.json`, `generation-diagnostics.json` and `phrase-variants.json` (`git ls-tree -r 08af7d089e` lists all four); the first commit in the same job printed `4 files changed` and its `--check` printed `trigger index matches the corpus` before the push. Static: the step checks each file exists before `git add` (`.github/workflows/trigger-index-rebuild.yml`) Code: `.github/workflows/trigger-index-rebuild.yml:57` (the four FILES), `:72` (presence check), `:85` (`--check` before push). | Met | - |
| AC-003 | REQ-003 | Given a successful push scenario, When the commit succeeds, Then the subsequent push attempt uses a distinct error message for non-fast-forward vs auth failure | Live run 37761007246: the first push was rejected with git's own text `! [rejected] main -> main (fetch first)`, and the job printed `##[warning]Push rejected as non-fast-forward; fetching the new tip, resetting to it, regenerating the index and retrying once.`, not the authentication or other message. Static: the classifier sorts `fetch first` to non-fast-forward, `pre-receive` to other, and `GH013`, `GH006` and `terminal prompts disabled` to authentication Code: `.github/workflows/trigger-index-rebuild.yml:98` (classifier), `:127` (the warning). | Met | - |
| AC-005 | REQ-005 | Given a non-fast-forward error during push, When the retry logic runs, Then the job fetches and rebases to the branch tip, regenerates the index, runs `--check`, and retries the push once | Live run 37761007246, staged by pushing a second commit while the job ran: the log shows the rejection, `git fetch` (`73be1380b..c65147fca main -> origin/main`), `HEAD is now at c65147fca` (the reset that replaces `git rebase`, see implementation-summary.md), one generator run (`trigger index published`), and the second push, which landed as `08af7d089e` on top of `c65147fca3`. A local `generate-trigger-index.mjs` run on `08af7d089e` leaves all four files byte-identical Code: `.github/workflows/trigger-index-rebuild.yml:132` (reset), `:139` (`--check` on the new tip). | Met | - |
| AC-006 | REQ-006 | Given a commit whose subject starts with the rebuild subject but is not the job's own rebuild commit, When it is pushed, Then the job runs; and given the job's own rebuild commit, Then it is skipped | Live: human commit `73be1380b6` (no trailer) ran the job (run 37761007246, success); the bot's rebuild commits `08af7d089e` and `4f659bdd4c`, both ending in `Trigger-Index-Rebuild: ci`, were skipped (runs 37761182736 and 37745043733). The guard reads only the trailer at the end of the message, so a human subject that shares the rebuild prefix cannot skip it; the `if:` holds no `startsWith`. This also shows GitHub's `head_commit.message` keeps no trailing newline, so `endsWith` matches Code: `.github/workflows/trigger-index-rebuild.yml:26` (guard), `:82` and `:157` (the trailer on both commits). | Met | - |

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

**Closeable:** Yes. All four rows are Met from a live run of the rebuild workflow on 2026-10-08 (run 37761007246 and the skipped runs on the bot's own commits). AC-001 and AC-004 (token hidden from checkout, token scoped to a main-only environment) were removed before any build, because the operator decided on 2026-10-08 to leave the token as it is. Their IDs are not reused.
<!-- /ANCHOR:closure -->
