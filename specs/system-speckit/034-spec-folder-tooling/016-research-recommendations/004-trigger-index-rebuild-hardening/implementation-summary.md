---
title: "Implementation Summary"
description: "The trigger index rebuild job now stages all four generator outputs, skips only its own commits by a trailer, and recovers once from a lost push race. Built, reviewed twice and checked locally; no run on GitHub yet."
trigger_phrases:
  - "trigger index rebuild hardening implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/004-trigger-index-rebuild-hardening"
    last_updated_at: "2026-10-08T09:55:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed with a live rebuild run"
    next_safe_action: "None; phase complete"
    blockers:
      - "No run on GitHub yet; nothing is pushed"
    key_files:
      - ".github/workflows/trigger-index-rebuild.yml"
      - ".github/workflows/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-trigger-index-rebuild-hardening |
| **Status** | Complete |
| **Level** | 2 |
| **Created** | 2026-10-08 |

### Status

The workflow change is built, reviewed in two rounds and **Complete**. A live run on 2026-10-08 settled every acceptance row: wave 1 was pushed to `main` as `73be1380b6`, and a second commit, `c65147fca3`, was pushed while run 37761007246 was still building. That run's first push was rejected with `(fetch first)`; it printed the non-fast-forward warning, fetched, reset to `c65147fca`, regenerated and pushed `08af7d089e`, which changes exactly the four generated files. The runs on the bot's own commits were skipped, and a local build of `08af7d089e` matches CI byte for byte.
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The trigger index rebuild job now commits everything the generator writes, skips only the commits it made itself, and recovers once when another writer wins the push. The token is left as it is, by operator decision.

### Rebuild job hardening

- **Four files, not one.** A `FILES` array names `trigger-index.json` and the three fixture sidecars `corpus-manifest.json`, `generation-diagnostics.json` and `phrase-variants.json`. The diff test and `git add` both use it. Before staging, the step checks that each of the four exists, because `generate-trigger-index.mjs --check` reads the index alone and `git add` would stage a missing tracked file as a deletion. After the commit, `--check` runs against the committed tree and the push is refused if it fails.
- **Exact loop guard.** The job `if:` is `!endsWith(github.event.head_commit.message, 'Trigger-Index-Rebuild: ci')`. The commit step writes that trailer as the last paragraph, so only the job's own commits end with it. A human commit whose subject starts with the old rebuild subject, or that quotes the trailer in its body, still runs the job.
- **One recovery attempt.** `classify_push_failure` sorts a failed push into non-fast-forward, authentication or ruleset, or other, and each class prints its own `::error::` message. Only a non-fast-forward rejection is retried: the step fetches the branch, resets to `origin/<branch>`, regenerates the index, runs `--check`, repeats the four-file presence check, commits only if the files differ from the tip, and pushes once. A second failure exits 1 with the class message.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.github/workflows/trigger-index-rebuild.yml` | Modified | Four-file staging with presence check and post-commit `--check`, trailer loop guard, classified push errors, reset-and-regenerate retry |
| `.github/workflows/README.md` | Modified | One new row for `trigger-index-rebuild.yml` naming the four files, the trailer guard and the single retry |

### What Was Already Delivered

Commit abb53ecc698 had already added `npm ci` and a build step for the shared package, and moved the job to Node 22. This phase leaves those steps and the checkout step untouched.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Built in wave 1 and reviewed read-only by Luna max fast through cli-codex, in two rounds.

| Round | Findings | Outcome |
|-------|----------|---------|
| 1 | Four | All four applied |
| 2 | None | Closed |

The four round 1 findings:

1. **Loop guard.** `contains` on the trailer would skip a human commit that quotes the trailer. Changed to `endsWith`.
2. **Missing sidecar.** `--check` reads the index alone, so a missing sidecar passed it. Added a presence check of all four files before staging. The generator is untouched.
3. **Recovery step.** A rebase would conflict whenever the new tip regenerated the same files. Replaced by `git reset --hard origin/<branch>` plus a regenerate. See the deviation under Key Decisions.
4. **Error patterns.** A bare `remote rejected` matched too much. Dropped it, and added `GH006` and `protected branch` to the authentication class.

The README row was confirmed against `git diff` on the README; the review notes do not say whether a round read it.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Token left as it is, `skilled/**` trigger kept (operator, 2026-10-08) | Scoping was considered because a ruleset-bypass token sits in the checkout credential while repository code runs and `skilled/**` has no protection. The operator chose not to change it |
| Marker trailer matched with `endsWith`, not an exact subject match | The subject can be renamed or shared by a human commit, while a trailer written by the job's own commit step is unlikely to end a human commit. Matching the end of the message errs toward running: a missed skip costs one run that finds nothing to commit |
| Presence check of all four files before staging | `--check` reads the index alone, so it cannot catch a missing sidecar; the check runs again on the retry path |
| Regenerate and `--check` before the retry push | The new tip moves the corpus, so the index must be rebuilt on it before it is pushed |
| Retry resets to the fetched tip instead of rebasing | See the deviation below |

### Deviation from REQ-005: "rebasing"

REQ-005 says a non-fast-forward push is retried "after fetching and rebasing to the branch tip". The build fetches and then runs `git reset --hard origin/<branch>`, with no rebase. The rejected commit carries nothing but regenerated output, and the new tip may have regenerated the same four files, so a rebase would stop on a conflict in exactly the case the retry exists for. Dropping the commit and rebuilding on the tip gives the same result REQ-005 asks for, an index built on the tip it lands on that passes `--check` and is pushed once, and it cannot conflict. Luna raised this in round 1 and round 2 found nothing further.

The authored wording was left as written in spec.md (REQ-005, scope, edge cases), plan.md, the AC-005 criterion and goal.md criterion 3, which still say "rebase". AC-005's Verification cell names the reset. Amending that wording is for the operator to decide.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Workflow YAML parses (js-yaml) | PASS, 5 steps, the `if:` holds the trailer guard |
| `bash -n` on the commit step | PASS, exit 0 |
| `shellcheck` on the commit step | PASS, exit 0 |
| `sk-git/scripts/validate-message.mjs` on a message with the trailer | PASS, exit 0 |
| Failure classifier on sample push outputs | `fetch first` to non-fast-forward, `pre-receive` to other, rule violations, `GH006` and `terminal prompts disabled` to authentication |
| Luna review | Round 1 four findings, all applied; round 2 none |
| `npm --prefix .skilled/skills/system-spec-kit/runtime/cli test` | exit 0, 162 files passed and 3 skipped, 1648 tests passed and 19 skipped (baseline 161 files, 1639 passed, 19 skipped) |
| `npm --prefix .skilled/skills/system-spec-kit/runtime/cli run check` | exit 0 |
| `node --test runtime/tests/hooks/*.test.mjs` | 184 tests, 181 pass, 0 fail |
| CLI typecheck and build | both exit 0 |
| `validate.sh --strict` on this folder | `RESULT: PASSED` |
| Run on GitHub | Not run. AC-002, AC-003, AC-005 and AC-006 stay Unmet |

The test suite, check, typecheck and build figures are whole-tree gates after all wave 1 fixes. This phase touches only the workflow and its README, so they show the rest of the tree is intact; they do not exercise the workflow.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations and Follow-ups

1. **Live run seen.** Run 37761007246 (2026-10-08) showed the rebuild commit with all four files, the `--check` pass, the `(fetch first)` rejection, the distinct non-fast-forward warning, the fetch, the reset, one generator run and the retried push. Runs 37761182736 and 37745043733 on the bot's own commits were skipped.
2. **Trailing newline settled.** The skipped runs show `github.event.head_commit.message` reaches the guard without a trailing newline, so `endsWith` matches the trailer.
3. **Classifier seen live for one class.** The non-fast-forward branch ran on a real rejection. The authentication and other branches are checked against sample text only, because forcing those failures on `main` would need a broken token or a failing hook.
4. **Rebase wording remains in the authored docs.** See the deviation under Key Decisions.
5. **Changelog.** The phase context asks for a refresh of the matching file in `../changelog/` at close. No `changelog/` folder exists under the parent or the track, so there is nothing to refresh until the phase closes.
<!-- /ANCHOR:limitations -->

---

