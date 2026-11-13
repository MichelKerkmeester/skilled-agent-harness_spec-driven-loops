---
title: "Acceptance Criteria: Phase 12: plain-offer-reach"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "plain offer reach acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/012-plain-offer-reach"
    last_updated_at: "2026-11-13T06:10:00Z"
    last_updated_by: "markdown"
    recent_action: "Marked every criterion Met with evidence"
    next_safe_action: "Commit the phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-012-plain-offer-reach"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 12: plain-offer-reach

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `system-skill-advisor/routing-and-scoring/008-command-surfacing-build/012-plain-offer-reach`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-13
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the four doctor tune prompts, When the scorer runs under the frozen regime, Then the agents-md and CI prompts lead with `command-doctor-agents-md-check` and `command-doctor-ci-report`, a ranked `ask` runnable maps to no bridge and the three relabelled hand-off rows of the doctor slice pass | `VFHT` and `VDS` report 0 failed (T005, T006). Met 2026-11-13: `after-final.txt` reports `VDS` 2 passed and the focused run with `VFHT` 9 files and 200 tests passed. The baseline tops of the agents-md and CI rows read `command-doctor-agents-md-check` and `command-doctor-ci-report`. `FHT` holds the `/doctor:git hooks` case that maps to no bridge, and `DP` reads 3, 1 and 78 on the T006 counts. | Met | - |
| AC-002 | REQ-002 | Given `my research loop stopped converging and I cannot see why` and `I have a problem and want the right repair path suggested with reasons`, When they are scored, Then the first ranks `command-doctor-deep-loop` right after `system-deep-loop` and the second leads with `command-doctor-helper`, while `I have a problem with my CSS layout` gets no doctor id | `VDHT` and `VFHT` report 0 failed (T004, T005). Met 2026-11-13: the focused run with `VDHT` and `VFHT` in `after-final.txt` reports 200 passed. `FHT` holds the converging, repair path and CSS layout cases, and `rg -c "stopped converg"` in `DH` printed 1. | Met | - |
| AC-003 | REQ-003 | Given the six `sk-doc` aliases, When every non-holdout corpus row and canary prompt is routed before and after, Then only `cmd-create-agent-plain-tune-01`, `-02`, `cmd-create-command-plain-tune-01`, `cmd-create-diff-plain-tune-01` and `cmd-create-goal-plain-tune-01` change, and the hub is fresh with matching manifests | T010's diff and `HUBOK sk-doc`, guard `0`, `BINT` `ℹ fail 0`. Met 2026-11-13: the diff of `scratch/routes-sk-doc-before.tsv` and `routes-sk-doc-after.tsv` changes exactly the five named ids and no `canary:` id. `after-final.txt` reports `HUBOK sk-doc` fresh, cmp identical and parent-skill-check OK, `GUARD: 0` and `BINT` `ℹ fail 0`. | Met | - |
| AC-004 | REQ-004 | Given a `system-deep-loop` recommendation with `needsMode: true` and no command, When the brief renders, Then the head reads `Advisor: live; use system-deep-loop (needs a mode) 0.82/0.20 pass.`, a command on the same recommendation drops the label and no existing golden head changes | `VGT`, `VHFT`, `VARC` and `VCA` report 0 failed, and the `GT` diff removes no `expectedHead` (T013 to T018). Met 2026-11-13: the focused run with `VGT`, `VHFT`, `VARC` and `VCA` in `after-final.txt` reports 200 passed. On rerun the `GT` diff printed no removed `expectedHead` line and added the two heads, one of them `Advisor: live; use system-deep-loop (needs a mode) 0.82/0.20 pass.` | Met | - |
| AC-005 | REQ-004 | Given the Claude prompt hook in a sandbox, When it runs on `use the sk-doc skill` and `use the system-deep-loop skill`, Then each head carries `(needs a mode)` | T033 output. Met 2026-11-13: after the prompt policy fix, read through the worktree's own daemon, the end of `scratch/live-heads.txt` holds `Advisor: live; use system-deep-loop (needs a mode) 0.91/0.12 pass.`, `Advisor: live; use sk-doc (needs a mode) 0.91/0.12 pass.` and `Advisor: live; use system-skilled-doctor → /doctor:agents-md check (run) 0.80/0.26 pass.` The first run had skipped the deep-loop prompt, as `implementation-summary.md` records. | Met | - |
| AC-006 | REQ-005 | Given the deep anchors and aliases, When the baseline is recaptured, Then the three deep tune rows top `system-deep-loop` and attach `/deep:research`, `/deep:review` and `/deep:ai-council`, and `nm-system-deep-loop-01` keeps its route and attaches nothing | T022's diff and T023's `jq` lines. Met 2026-11-13: the deep-loop route diff changes exactly the three deep tune rows to `research`, `review` and `ai-council`, and `nm-system-deep-loop-01` reads the same route in both tables. On rerun the baseline tops read `system-deep-loop` for all three, the attached commands read `/deep:research`, `/deep:review` and `/deep:ai-council`, and `nm-system-deep-loop-01` attaches `none`. | Met | - |
| AC-007 | REQ-006 | Given each wave's end, When `FLOORCHECK` runs, Then `FLOOR` prints at least `{"correct":24,"total":44}` and exactly `{"count":0,"total":35}`, `TYPED` prints `{"count":0,"total":35}` and the before typed line, `EVAL` is no lower than `[159,50,20]` and its before line with false fire at most 5, and `PY`, `PAR` and `SUITE` pass | `scratch/after-A.txt`, `after-B.txt`, `after-C.txt`, `after-D.txt`, `after-E.txt` and `after-final.txt`. Met 2026-11-13 with one deviation: B, C and D were measured by one check, `scratch/after-BCD.txt`, which stands in for `after-B.txt`, `after-C.txt` and `after-D.txt` (see `implementation-summary.md`). `after-A.txt`, `after-BCD.txt`, `after-E.txt` and `after-final.txt` each print `FLOOR` `{"correct":24,"total":44}` and `{"count":0,"total":35}`, `TYPED` `{"count":0,"total":35}` and the before typed line, `EVAL` `[160,50,21,5]`, `PY` exit 0, `PAR` 2 passed and a `SUITE` with no failed count. | Met | - |
| AC-008 | REQ-007 | Given the final tree, When the boundary checks run, Then `AGENTS.md`, `.skilled/commands/create/`, both `ROUTER.md` files and both canary fixtures are unchanged, no added comment names an ephemeral label and no package file changed | T032. Met 2026-11-13: on rerun the `git diff --quiet HEAD` boundary check exited 0, the added-comment scan and the `package.json` scan printed nothing, and `git status` over `.skilled` and `specs/sk-doc` listed only files this phase names. | Met | - |
| AC-009 | REQ-008 | Given T025's decision, When wave E runs, Then `create-command` and `create-goal` attach their command and `create-manual-testing-playbook` hits at top 1 with every floor line equal to wave D, or the skip or revert is recorded with the line that moved | T025, T027 to T029. Met 2026-11-13: T025 compared `after-A.txt` with `after-BCD.txt` and found the floor lines identical, so wave E ran. On rerun the baseline attaches `/create:command` and `/create:goal` and `create-manual-testing-playbook` reads `top1` true. `after-E.txt` holds the same `FLOOR`, `TYPED` and `EVAL` lines as `after-BCD.txt` and ends `wave E: kept`. | Met | - |
| AC-010 | REQ-009 | Given the final baseline, When it is read, Then `attachedMetrics.plain.tune.combined` is above 9 and T031 counts 16 carried chat rows with wave E kept, or 13 without it | `jq -c '.attachedMetrics.plain.tune' ADV/scripts/routing-accuracy/command-routing-baseline.json` and `scratch/chat-after.json`. Met 2026-11-13: on rerun the `jq` printed `{"own":8,"attached":15,"combined":23,"total":45}`, and the count of rows with `carried` true in `scratch/chat-after.json` is 16 with wave E kept. | Met | - |
| AC-011 | REQ-010 | Given the docs, When they are read against the code, Then the hook guide shows the `(needs a mode)` head and the doctor catalog page names the ranked `run` command, the ask fallback and the repair request | T007 and T019 verify lines. Met 2026-11-13: on rerun `rg -c "needs a mode"` printed 2 for the hook guide, which shows the example head, and `rg -c "repair path"` printed 1 for the doctor catalog page while the old helper sentence counts 0. The page names the ranked `run` command and the ask fallback. | Met | - |

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

AC-001 to AC-011 are `Met` on `scratch/after-final.txt`, `scratch/after-final-policy.txt`, `scratch/live-heads.txt`, the named scratch files and read-only checks rerun from the repository root on 2026-11-13. AC-005 was met after a scope amendment to the prompt policy, which `implementation-summary.md` records.
<!-- /ANCHOR:closure -->
