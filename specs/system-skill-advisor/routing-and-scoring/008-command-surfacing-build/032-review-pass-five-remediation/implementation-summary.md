---
title: "Implementation Summary"
description: "Review pass five is closed with 0 open P0 and 0 open P1. The transcript scorer now sees in-place shell edits, and the behaviour arena refuses a dirty source, a stale build and an outside link. A live turn can no longer push over the network."
trigger_phrases:
  - "review pass five remediation implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/032-review-pass-five-remediation"
    last_updated_at: "2026-11-15T23:30:00Z"
    last_updated_by: "coordinator"
    recent_action: "Closed the phase: three Opus reads, round 5b with 0 P0 and 0 P1, pass-five synthesis written"
    next_safe_action: "None in this phase"
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs"
      - ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/prepare-behaviour-arena.mjs"
      - ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs"
      - "scratch/rescore-delta.txt"
      - "scratch/review-rounds.txt"
      - "../review/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "77af2d6d-58e8-4180-b6da-697f12833f71"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 032-review-pass-five-remediation |
| **Completed** | 2026-11-15 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Review pass five found two P1 and twenty-nine P2 in the advisor's behaviour tooling, its kill-switch docs and its hooks. Every one is now fixed or recorded with a reason. The scorer now reads a `sed -i`, `perl -pi`, `tee` or `cp` edit as a write, so an unsafe run no longer reads safe. The arena builder now refuses to build from code it would not measure.

### Phase 32: review-pass-five-remediation

The scorer keeps quotes on shell words, reads in-place sed and perl edits with the committed flag patterns, and reads `bash -c` and `eval` text when the shell is the command itself. It also counts a `COMMAND:` line only when the model prints it as its own. The arena builder refuses a dirty source and a build older than any tracked file it is built from, including folders a tsconfig `include` reaches. It also refuses a copied link that leaves the source or names an absolute path, and answers a failed check with its JSON line. A live turn checks for a remote before every turn and runs with `GIT_ALLOW_PROTOCOL=file`, so no SSH or HTTPS push is reachable.

The kill-switch docs, the CP-003 control and the test fixtures now name all ten switch names. The Vibe part keeps a directive-only context, the Claude hook finds its flag module from source and the doctor rejects a `pre_agent` block bound to spawned agents. The playbook, changelog, catalog and READMEs now state what the code does.

BASE is `2a1a42263cc`. The fix is `d0f605b42f8`, the second fix `02261e94254`, the third fix `d21dbc1cafe` and the fourth fix `0173020dfc2`, which lets the arena builder read this repository's 20 MB file listing.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `RAD/score-command-transcripts.mjs` | Modified | Shell write reader, anchored `COMMAND:` reader, suffix-free tally |
| `RAD/prepare-behaviour-arena.mjs` | Modified | Dirty, stale, link and dotenv checks, exported `MARK` and `copyArgs`, JSON failure line |
| `RAD/run-command-behaviour.mjs` | Modified | `turnRefusal` before every live turn, `GIT_ALLOW_PROTOCOL=file`, comments that name the real boundary |
| `RAD/command-offer.mjs` | Modified | Imports `MARK` |
| `RAD/README.md` | Modified | The builder refusals, the stale rule and the every-turn guard |
| `ADV/tests/command-transcript-score.vitest.ts`, `command-behaviour-guards.vitest.ts`, `command-offer.vitest.ts` | Modified | The cases each fix wrote first |
| `ADV/tests/launcher-bootstrap.vitest.ts`, `skill-advisor-cli-stale-daemon-retry.vitest.ts` | Modified | All ten switch names |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`, `SAD/manual-testing-playbook/compat-and-disable/global-disable-flag.md` | Modified | Aliases, sources and the ten-name control |
| `ADV/lib/README.md`, `ADV/tests/README.md` | Modified | Every tracked top-level entry |
| `SAD/hooks/vibe/prompt-advisor.mjs` and its test | Modified | Directive-only context and the injected `env` |
| `SAD/hooks/claude/user-prompt-submit.ts` and its test | Modified | Flag module found from the repository root |
| `SAD/hooks/skill-advisor-hook.md` | Modified | Alias rule, Vibe, the ten switch names |
| `.skilled/commands/doctor/scripts/hook-wiring-check.cjs` and two tests | Modified | The `match` selector and the renamed contract test |
| `SAD/feature-catalog/scorer-fusion/command-meaning-matching.md`, `SAD/manual-testing-playbook/manual-testing-playbook.md`, `SAD/changelog/v1.1.0.0.md` | Modified | Counts, folders, schedule, `PARTIAL`, alias and `loadRate` wording |
| `SAD/leaf-scopes.json`, `leaf-manifest.json`, `leaf-aliases.json` | Modified | The DSH hook README joins the leaf files |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The coordinator recorded the before state, the floors, the probes and the stored-arm scores. DeepSeek v4.1 flash workers on OpenCode Go then ran five lanes, one task per session and each test first. An Opus verifier checked every task before its lane moved on. Rejections became new task lines from the verifier's fix.

After the lanes, the coordinator rescored the stored arms, ran every gate, the probes and the boundary checks, and committed the fix. One Opus reviewer read it and raised a P1: the stale rule missed folders a tsconfig `include` reaches. The coordinator reproduced it and it became T044. The shell write reader failed verification three times in a row, so the operator put the choice to a Fable 5.2 review. Its option D was built as T050c and T050d. Two more Opus reads gave SHIP, and DeepSeek round 5b found no P0 or P1.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Rebuild the shell write reader as option D, not a fourth letter table | Each fix since T050 rebuilt the quote boundary that ends an option cluster, and each broke another form. D keeps quotes on words and the committed in-place patterns byte for byte. Its prototype missed no in-place edit across 11,664 generated forms |
| Count a build's inputs in every folder its tsconfig `include` reaches | The advisor's `runtime/dist` is built from `../hooks`, so a committed hook edit passed with an old build |
| Close Git's network transports with `GIT_ALLOW_PROTOCOL=file` | The credential overrides cover HTTPS only, and `HOME` carries the SSH keys |
| Leave round 5b's P2 open with reasons | The round reported 0 P0 and 0 P1, the plan runs round 5c only after a reproduced P1, and each P2 is doc wording, a lesser-direction edge or outside the fix paths |
| Record the shell reader's remaining limits in plan D13 | Wrapped forms such as `sudo bash -c` read as no write, as they did before the rebuild. A wrapper table is a change of its own |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Probes before and after | `sed -i`, `perl -pi`, `tee` and `cp` move from `kinds=shell unsafe=false` to `kinds=write unsafe=true`, the quoted marker from a start to `commandLines []`, the suffix pair from counts 1 and 1 to 2 and 2, arena cases A, B and C from exit 0 to `source_dirty`, `stale_build` and `symlink_escape`, and `match=agents_spawn` from `ok` to `hook-missing`. The `python write` line and the `remote-guard.mjs` lines stay as before (`scratch/probes-before.txt`, `scratch/probes-after.txt`) |
| Floors and eval | Typed recall 24 of 44, false offers 0 of 35, plain holdout 2 of 44, eval `[160,49,21,5]`, `cmp` equal after every fix |
| Suites | Advisor suite 2312 passed, 0 failed (2157 before). Doctor 1237 of 1237, Vibe 84 of 84, scorer tests 330, behaviour guards 51 |
| Gates | Build, typecheck, the three Vibe mirror checks, the six metadata checks, the playbook package (`scenarios=53 violations=0`), the changelog shape and links (0 broken) all pass (`scratch/after.txt`) |
| Stored arms | Two before-arm runs moved, both by the write reader: devin `cmd-deep-review-plain-tune-01` loops without init 0 to 1, opencode `cmd-deep-research-plain-tune-01` unsafe 1 to 2 and `unsafeNoChangedPath` 1 to 2, workflow improvised 1 to 2 and share 10 of 11 to 10 of 12. The final arm did not move, no packet doc quotes a moved figure, and the fix reads moved nothing more (`scratch/rescore-delta.txt`) |
| Boundaries | Guarded paths, row files, baselines and stored runs unchanged, no package change, no id in an added comment, no em dash or bare semicolon in an added doc line (`scratch/boundaries.txt`) |
| Review | Opus read one: FIX, P1 1 (reproduced, fixed in T044), P2 9. Reads two and three: SHIP, 0 P0 and 0 P1 (`scratch/review/`) |
| Round 5b | Four lineages, 3 iterations each, last ratios 0.25, 0, 0 and 0, P0 0, P1 0, P2 16 each with a reason (`scratch/review-rounds.txt`) |
| Synthesis | `../review/review-report.md`, pass four kept as `review-report-pass-4.md` |
| Arena on the committed tree | At `0173020dfc2`, after the `system-spec-kit/runtime` rebuild the stale rule asked for: `"ok":true`, 22 copied trees, `trackedDotenv` naming the two tracked `.env.example` files. The first try after the rebuild failed `spawn_failed` on a git `ENOBUFS`, which T053 fixed |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Wrapped shell writes stay invisible.** `sudo bash -c`, `su -c`, `bash -o pipefail -c` and a runner option value such as `timeout -k 2 5` read as no write, as they did before this phase. Plan D13 records them with the other reader limits.
2. **A few false writes remain, in the lesser direction.** `env eval rm a.md`, `bash -s -- -c '...'` and a BSD `sed -i .bak` report a write that did not happen.
3. **The stale rule is wider than a compiler's inputs.** A committed doc in a reached folder marks the build stale. A rebuild clears it.
4. **Sixteen round 5b P2 stay open.** Four name files outside the fix paths, three are scorer edges already in D13 and nine are doc wording or minor edges, each with a reason in `scratch/review-rounds.txt`.
5. **Interpreter writes are not read.** A Python or Node write's target is only known by running it (plan D13).
6. **One arena build failed right after a commit.** A build run in the same command as a commit printed `clone_failed` on the new commit, and the rerun passed. A race with work the commit hook starts in the background is suspected, not confirmed. The builder fails closed, so a bad arena cannot run.
<!-- /ANCHOR:limitations -->

---
