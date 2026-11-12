---
title: "Implementation Summary"
description: "The overlay engine no longer needs a hand repair after a killed run, a changed link target or a dropped appended item, and the write checks judge every path the way the documents say. A five-iteration review found three P1 defects in relayout, all fixed."
trigger_phrases:
  - "overlay write checks follow up implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/001-skill-and-overlay-build/009-overlay-write-checks-follow-up"
    last_updated_at: "2026-11-12T17:52:23Z"
    last_updated_by: "generate-context"
    recent_action: "Closed alignment round nine"
    next_safe_action: "Fix round ten findings"
    blockers: []
    key_files:
      - "specs/system-skilled-doctor/001-skill-and-overlay-build/009-overlay-write-checks-follow-up/goal.md"
      - "specs/system-skilled-doctor/001-skill-and-overlay-build/009-overlay-write-checks-follow-up/implementation-summary.md"
      - "specs/system-skilled-doctor/001-skill-and-overlay-build/009-overlay-write-checks-follow-up/handover-to-barter.md"
      - ".skilled/commands/doctor/scripts/overlay-engine.cjs"
      - ".skilled/changelog/skilled/v4.0.2.1.md"
    session_dedup:
      fingerprint: "sha256:7f69b26927536d43416bb0af6683f4e6e27c92898a2f3ab76856ea8d0bac482d"
      session_id: "scaffold-009-overlay-write-checks-follow-up"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "e881d253-bd2e-467f-a00f-6be078d10e1c"
      workspace: "/Users/michelkerkmeester/MEGA/Development/Skilled"
      savedAt: "2026-11-12T17:52:23Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 90
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
| **Spec Folder** | 009-overlay-write-checks-follow-up |
| **Completed** | 2026-11-12 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A project that vendors Skilled can now run the overlay engine without repairing it by hand. A killed run no longer blocks the next one. A changed layout link target applies. A dropped appended item leaves the live file. The strict write checks stop refusing paths a re-pin never touches and stop allowing paths a loose glob let through.

### Overlay write checks follow-up

Barter moved onto the engine and hit three bugs and three gaps, and a fresh review of phase 8 found four defects. Each is fixed in the engine with a test. `status` gained three kinds of line: `STALE` for a root-file overlay upstream changed, `LAYOUT` for a source off the layout and, with `--audit`, `AUDIT` for vendored drift no overlay owns. `apply --relayout` moves off-layout sources. The overlay guard has an OpenCode adapter.

A five-iteration deep review then found three P1 defects, all in `apply --relayout`, and nine P2. Section Verification lists each one and what was done.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | Modified | Lock takeover, link and item records, glob, excluded paths, content compare, status lines, relayout and audit |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-follow-up.test.cjs` | Created | 38 tests for the engine fixes and the new behaviour |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs` | Modified | Seven more tests: glob, excluded path, line endings and the four untested groups |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-fixes.test.cjs`, `overlay-engine-repin.test.cjs`, `doctor-overlay-contract.test.cjs` | Modified | Assertions that named the old lock line, state shape or flag list |
| `.skilled/hooks/overlay-guard/opencode/`, `.opencode/plugins/overlay-guard.js` | Created | The OpenCode adapter and its mirror |
| `.skilled/hooks/overlay-guard/tests/opencode-overlay-guard.test.mjs` | Created | Nine adapter tests |
| `.skilled/commands/doctor/overlay.md`, `_routes.yaml`, `assets/doctor-overlay-*.yaml`, `assets/doctor-overlay-presentation.txt` | Modified | `--relayout`, `--audit` and the new lines |
| `.skilled/skills/system-skilled-doctor/references/overlays.md` | Modified | Eight trigger phrases, then the new behaviour |
| `.skilled/skills/system-skilled-doctor/graph-metadata.json`, `ROUTER.md`, `SKILL.md`, the advisor's generated bridges and skill graph | Modified | Routing words for the new work, skill version 1.1.6.0 |
| `.skilled/changelog/skilled/v4.0.2.1.md`, `.skilled/skills/system-skilled-doctor/changelog/v1.1.6.0.md` | Modified, Created | The release entry and the skill note |
| `.skilled/skills/system-skilled-doctor/manual-testing-playbook/` | Modified | Eight new scenarios |
| `.skilled/hooks/README.md`, `.skilled/hooks/overlay-guard/README.md`, `.skilled/commands/README.txt`, `README.md`, `command-contract.json` | Modified | The seventh adapter and the command hint |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json`, `system-skilled-doctor/leaf-manifest.json`, `leaf-aliases.json` | Regenerated | The new folder and scenarios |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each change was one brief to one DeepSeek V4.1 Flash agent at max thinking through `pi` on llmgateway, 24 briefs in all, in series. After each brief the whole doctor test folder ran, and a chain stopped at the first failing run. The orchestrating session wrote the plan, the briefs and the packet documents, read the diffs and ran the gates. It edited no code or skill document itself.

The review ran as a two-lineage fan-out of the `/deep:review` workflow: three DeepSeek iterations and two Opus iterations. A fresh Opus agent at high effort wrote `review/review-report.md` and reproduced each P1 on a throwaway fixture before listing it. The fixes went back to DeepSeek agents, one brief per finding.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Relayout is `apply --relayout`, not a `relayout` target | A new target needs its own route and a skill-advisor bridge in five advisor runtime files. Adopt took the same flag form in phase 8 |
| A lock line with a pid and no host is treated as local | Only the previous release wrote that shape, and it ran locally. Without this, the first killed run after an upgrade still needs a hand repair |
| The takeover is guarded by a `.takeover` file | Two runs could both see one dead lock, and the second removed the lock the first had just made |
| The engine removes or retargets only what its state file records | A link or item with no record may be a person's. It is reported and left alone |
| A commit that moves the pin still skips the commit check | A re-pin commit carries upstream's own changes. `status --audit` covers the gap |
| The edit hook still fails open | That is the hook's contract on every runtime. It is recorded for Barter in `handover-to-barter.md` |
| The CI change the review asked for was not made | The OpenCode Plugin Tests workflow already collects every `node:test` file under `.skilled/hooks` |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test tests/` in `.skilled/commands/doctor/scripts`, baseline | `tests 1100`, `pass 1100`, `fail 0` |
| The same command after the last fix | `tests 1145`, `pass 1145`, `fail 0` |
| `node --test` over the `overlay-guard` test files | `pass 33`, `fail 0`. The baseline was 19 |
| `route-validate.sh` | `OK: route-validate`, 31 routes |
| `sync-runtime-mirrors.cjs --check` | `PASS: 256 mirrors across 10 trees are in sync` |
| `check-skill-doc-frontmatter.sh . --coverage` | `violations=0`. It printed `violations=1` before task T004 |
| `validate-playbook-package.cjs --package system-skilled-doctor` | `PASS`, `scenarios=12`. The baseline was 4 |
| `test_readme_manifest.py` | `manifest=reproducible`. It failed in CI on `e97ca56e8d` before the manifest was regenerated |

### Review findings

The ids are those of `review/review-report.md`. Each fix has a test in `tests/overlay-engine-follow-up.test.cjs`, and `node --test tests/overlay-engine-follow-up.test.cjs` prints `pass 38`, `fail 0`.

| Finding | Severity | Outcome | Proof |
|---------|----------|---------|-------|
| SYN-01 relayout left a live layout link dangling | P1 | Fixed | The test that relays out a directory with a link, then runs `apply` and `status` to `RESULT: PASSED` |
| SYN-02 the relayout backup copied a protected file | P1 | Fixed | The test that finds no `api-token.js` in the backup folder and a `skipped` line for it |
| SYN-03 a failed relayout left the folder half-moved | P1 | Fixed | The test with two entries sharing one id: exit 2, nothing moved, manifest bytes unchanged |
| SYN-04 the previous release's lock line was never taken over | P2 | Fixed | The test with a dead pid and no host: the `note:` line and exit 0 |
| SYN-05 two runs could both take over one dead lock | P2 | Fixed | The `.takeover` tests: a fresh file refuses, a stale one is cleared |
| SYN-06 dropping an entry removed an item upstream now ships | P2 | Fixed | The test where upstream gains the item: it stays and its record goes |
| SYN-07, SYN-08, SYN-11 document lines that named a missing target, the wrong skip rule and an incomplete lock list | P2 | Fixed | `route-validate.sh` and the contract test pass, and the lines were rewritten from the engine's output |
| SYN-09, SYN-10 no scenario for the relayout link or the old lock line | P2 | Fixed | Both scenarios carry the step, and the playbook validator prints `PASS` |
| SYN-12 a staged pin change switches the commit check off | P2 | Rejected | It predates this phase and is by design. `plan.md` records the reason, and `references/overlays.md` documents it |

The review found no P0.

### Alignment findings

`/local-skilled-alignment` ran four times with four DeepSeek lanes and a critic: over `790ced4732..dd58ccee3f`, `790ced4732..81513a220a`, `790ced4732..3edaf16efa` and `790ced4732..a82b3eb780`. Each run was followed by fixes. After the second and third runs a recheck ran, and a fresh Opus agent judged each finding the recheck could not judge.

| Finding | Severity | Outcome | Proof |
|---------|----------|---------|-------|
| Run 1: 18 lane findings, among them no patch tool test, no audit or stale root-file scenario, missing routing words, an audit that exits 2 on an unreadable pin and ten document lines | 9 P1, 9 P2 | Fixed in `81513a220a` | The second run's battery: `pass=75 fail=0`. The first run's six failed probes pass |
| Run 2 A-1: the audit folded line endings and a re-pin does not | P1 | Fixed in `412bb9e456` | The test `status --audit lists an unowned vendored file whose line endings differ from the pin` |
| Run 2 A-2: a stale root file under a `marked-section` overlay went unreported | P2 | Fixed | Two tests beside the root-file tests. `node --test tests/` prints `fail 0` |
| Run 2 A-3: the OpenCode guard copies a log helper four other plugins also carry | P2 | Deferred | No behaviour is at risk, since each guard writes its own log. A shared helper under `.opencode/plugins/lib/` is the fix, and moving the other copies edits plugins outside this phase |
| Run 2 B-001: the trigger index and its fixtures lacked three new documents | P1 | Closed by CI | The Trigger Index Rebuild workflow commits the index and its three fixture files after each push to `main` |
| Run 2 C-01 to C-04, D-3, N-1: document lines and stale counts | 1 P1, 5 P2 | Fixed | The recheck lists the literal ones as resolved. The counts read 117 and 1,142 |
| Run 2 D-1, D-2: no routing words for the stale root file, and an audit paraphrase lost to `sk-git` | 1 P1, 1 P2 | Fixed | `run-probes.cjs` on the second run's probes: 11 pass. The verifier's own prompt selects `system-skilled-doctor` |
| Probes P07 and P08 of run 2, which open with "Tell me" and "Explain" | P1 | Not a defect | The advisor hands a read-only question to the doctor helper by a rule this phase did not change. The helper lists `/doctor:overlay status` first for both |

| Run 3: a root-file routing phrase with no overlay word took a plain git question | P1 | Fixed | The phrases name the overlay, and `sk-git` gained one signal with the word fetch. `run-probes.cjs` on the third run's probes: 13 pass |
| Run 3: seven document statements, among them a re-pin said to refuse every drifted path, a relayout said to stop on a `MISS` or `STALE` line and a lock said never to be cleared | P2 | Fixed | The verifier checked each against the engine and listed nine of ten findings as resolved |
| Run 3: no scenario for the dropped appended item | P2 | Fixed | `validate-playbook-package.cjs` prints `PASS`, `scenarios=12` |
| The verifier's three notes on the fix: an exit code claim for the apply after a relayout, the same lock sentence in the re-pin workflow and a router keyword | P2 | Fixed | `route-validate.sh` and the contract test pass |
| Run 4: `apply --relayout` took the unchanged branch on a passing status and never asked | P1 | Fixed | The phase 2 branch of `doctor-overlay-apply.yaml` now excludes a relayout run. The contract test passes |
| Run 4: the phrase `changed a root file` took a build question, and a pin question cleared the confidence bar | 1 P1, 1 P2 | Fixed | Seven out-of-domain prompts were replayed and none selects this skill |
| Run 4: a dropped JSON item request missed the skill | P1 | Fixed | The fourth run's probe P04 passes |
| Run 4: three relayout refusals had no test | P2 | Fixed | Three tests. `node --test tests/` prints `tests 1145`, `fail 0` |
| Run 4: the order of `status` lines, a plain apply with only a `STALE` line and two refusal rows | P2 | Fixed | `route-validate.sh` and the contract test pass |
| Verifier on round 4: a pin question reached the doctor helper, and three aliases with no overlay word took unrelated requests | P1 | Fixed | Five of six out-of-domain prompts now select nothing or another skill |
| "Port an upstream skill into this repo" still selects this skill at confidence 0.82 | P2 | Left open | The score comes from the tokens upstream, repo and skill. Removing `repo` means editing the skill's description, which predates this phase |
| Run 4 probes P14 and P15 expect `sk-code` and `sk-git` | P1 | Not fixable here | This skill no longer takes either prompt. Neither target skill carries a signal for it, and that is their vocabulary to add |
| Run 5: `repin --stage` refused a lock whose run had ended, so the skill README and the re-pin refusal row promised a takeover the stage step did not make | P1 | Fixed | The stage pre-check now refuses only a live owner. A dead owner prints `note: the overlay lock belongs to a run that has ended` and the stage runs. Two tests |
| Run 5: the OpenCode plugin README counted three plugins that reject by default | P1 | Fixed | It names four, with the overlay guard |
| Run 5: two probes for the audit and the rebase landed on `sk-git` | P1 | Fixed | Two intent signals. `run-probes.cjs` on the fifth run's probes: 16 pass |
| Run 5: a stale takeover marker was cleared by its shared path, so two runs could both take the lock | P2 | Fixed for two runs | A leftover lock or marker is renamed aside and deleted only when it is the file judged stale. A fresh Opus verifier ran 33,680 bounded and 8,000 random two-run schedules against the real `acquireLock`. None ended with two holders and none left a `.claim` file. Four runs at once with a marker more than a minute old can still end with two holders. See Known Limitations |
| Run 5: `SECURITY.md` said the guard covers every runtime except OpenCode, the adopt scenario left out its two `LAYOUT` lines, the relayout section said one `refuse:` line, and the environment reference had no row for `SYSTEM_OVERLAY_GUARD_DISABLED` | P2 | Fixed | The verifier reran the adopt scenario and matched all six output lines byte for byte. It read every adapter and confirmed the switch stops the strict-writes refusal |
| Run 5: `audit unowned files that drifted from the pin` scores `sk-code` at 0.41 | P2 | Left open | The score is under the 0.8 bar, so no skill is forced. The longer phrase with `pinned commit` selects this skill |
| Verifier on round 5, second pass: the reference said only one run can create the marker and that a displaced file is always put back, and a marker put back after its run ended made the next takeover refuse with the advice to delete the lock | P2 | Fixed | `references/overlays.md` states both limits. The refusal now prints `run it again in a minute: a takeover marker that old is cleared`. `node --test tests/` prints `tests 1150`, `fail 0` |
| Round 5 leftovers: the adopt sentence said one `refuse:` line with no reason for the count, and the re-pin lock row described a takeover the stage step does not make | P2 | Fixed | The sentence names the one path an adopt takes. The row says the stage reads the lock and prints a `note:` line, and the live step takes it over. All three held-lock rows say a takeover-marker refusal means run it again in a minute |
| Run 6, over `fd6533c621..467131c783`: about 40 documents still called a `.pi/extensions/` entry a symlink, the environment reference's totals were stale, the hook registry's note and `shape` field said symlinks, the changelog's lock sentence left out the stage, and documents and comments gave a false reason for the long fallback specifiers | 2 P1, 11 P2 | Fixed | Each sentence says one-line entry file. The totals read 213 and 217, recounted by `scratch/count-env-vars.py` in the Pi packet. The long specifiers are described as left from the link-based layout. The hooks vitest tree passes 491, the node hook tests under `.skilled/hooks` pass 1,554 in 78 files and `tsc -p tsconfig.pi.json` exits 0 |
| Run 6 critic: three sentences said the type check reads the entry file, the committed `.env.example` template had no `SYSTEM_OVERLAY_GUARD_DISABLED` line, the re-pin workflow and its plan template did not name the stage's lock note, three READMEs said every adapter import is folder-relative, the Pi packet repeated the false fallback reason, and SKD-008 never ran `repin --stage` | 8 P2 | Fixed | SKD-008 has 16 new steps written from two observed fixture runs, and `validate-playbook-package.cjs` prints `violations=0`. `node --test tests/` prints 1152 passed. The dotenv guard refuses an agent's write to its own README. The operator chose one agent run with the guard switched off, and that run changed the two phrases on lines 65 and 85 and nothing else |
| Verifier on round 6, three passes: of the 10 findings the recheck left for a reviewer, 9 were resolved and 1 was not, because two feature catalog rows still said `linked from .pi/extensions/`. The fixes had also made six statements untrue or loose: the alias comment's OpenCode clause, the claim that every long specifier resolves in tests, the advisor's alias sentence, a `Symlink target` line, two goal adapter comments and two lines of the runtime-mirrors README | P2 | Fixed | The verifier showed that vitest does not apply an alias to a specifier held in a constant, so `DISCOVERY_CORE_PATH` resolves nowhere, and the documents now say so. The third pass found every corrected statement true except one sentence in the Pi packet, which was then narrowed |
| Run 7, over `467131c783..9c24bbdddd`, 13 findings: four requests reached the wrong skill (a staged overlay re-pin, a lock takeover and two about the Pi prompt advisor), eight documents and comments outside the hook library still called a Pi entry a link or a hand-authored factory, and the overlay reference did not say that `repin --stage` leaves a dead owner's lock | 4 P1, 9 P2 | Fixed | `run-probes.cjs` on the round's probe file passes the four prompts. The round's recheck lists 7 resolved, 0 still open, 0 new and 6 for a reviewer, and the orchestrating session checked those six against the tree |
| Run 8, over `9c24bbdddd..4d750316c5`, 7 findings: one paraphrase about the advisor skipping a prompt still reached the prompt skill, no test pinned the new routes, and four statements in the Pi documents and the dispatch README were contradicted by the tree (21 extensions where there are 22, no drift checker where the entries' shape is checked) | 1 P1, 6 P2 | Fixed | Five golden prompt rows and two phrases. The round's recheck lists 4 resolved, 0 still open, 0 new and 3 for a reviewer |
| Run 9, over `4d750316c5..d9a6f9f748`, 5 findings after the critic folded or refuted five: no golden row held only the two new phrases, so deleting them left the suite green, three Pi documents still said no checker or listed fewer than 22 entries, and the advisor's new vocabulary was in no changelog entry | 1 P1, 4 P2 | Fixed | One bare-phrase row, and each of the three phrase groups was removed in turn to show a row fails without it. The operator chose a bullet in the existing advisor entry v0.18.7.0 over a new entry. The round's recheck lists 2 resolved, 0 still open, 0 new and 3 for a reviewer |
| Run 10, over `2aa53ef3df..e4f3963384`, 7 findings: the Pi extension README had a wrong tree line, an entrypoints table with 13 of 22 exports and a false sentence about which session adapters use the shared proxy, the cross-CLI map counted 18 Pi extensions, two Pi CLI references counted 11 and 6, and three playbook scenarios expected eleven extensions or ran a search of the entry files that matches nothing since the entries became one-line re-exports | 7 P2 | Fixed | Scenario PI-015's new command prints 35 handlers over 12 events, checked by running it. The first version of that command missed three cast registrations in `session-relaunch.ts`, and the orchestrating session caught that. The round's recheck lists 2 resolved, 0 still open, 0 new and 5 for a reviewer |

Ten lane runs were made by the end of round ten. Each raised new findings after the fixes of the run before it: 18, 11, 10, 10, 11, 21, 13, 7, 5 and 7. No lane-based report with zero findings exists yet. The fifth run's critic overturned one finding. Its recheck lists 2 resolved, 2 still open and 7 for a reviewer. The two still open are literal matches: one sentence in the adopt section that the verifier found accurate, and one re-pin row that became true when the engine was fixed. The sixth round reworded both. The sixth run's critic overturned nothing. Its last recheck, run after the last fix, lists 10 resolved, 0 still open, 0 new and 11 for a reviewer, and exits 0. The eleventh is a sentence the verifier had reworded again. A fresh Opus verifier checked the reviewer's findings against the tree in three passes, and each defect it found was fixed. Rounds seven to ten each closed with a recheck that lists 0 still open and 0 new. On 2026-11-12 the operator chose to keep running full rounds until one lists 0 findings, and to tell the lanes from round eleven on to report only what the range changed.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The first commit of this phase carries another session's files.** Commit `c57b7e4cef` took 57 research files from `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/`, which another session had staged in the shared index. They were not reviewed here.
2. **One file outside the planned scope changed.** `.skilled/skills/sk-git/graph-metadata.json` gained one intent signal. The overlay vocabulary made the advisor recommend this skill for a plain upstream question, and no change on this side could undo that without losing the overlay request. `sk-git` now also competes on other upstream questions.
2. **Nothing was run against Barter's tree after these changes.** The fixes are proven on fixtures. `handover-to-barter.md` lists what a Barter session does next.
3. **A state file from an older engine has no link or item records.** Nothing is retargeted or removed until the first apply writes them, so an item dropped before the upgrade stays until it is removed by hand.
4. **The Opus review lineage is recorded as failed.** Its session refused every `node` call, so it has no state log or findings registry. Its two iteration files and its report exist and were inputs to the synthesis.
5. **`--audit` walks every vendored file.** On a tree the size of Barter's that is about 20,000 files, so it runs only when asked.
6. **A lock takeover is proven for two concurrent runs.** Four runs at once, with a takeover marker more than a minute old, can still end with two holders. The verifier scripted that schedule. No three-run schedule did it in 8,000 random tries, which is a test and not a proof.
7. **A takeover can refuse for up to a minute after another run's takeover.** A marker put back after its run ended blocks the next takeover until it is a minute old. The refusal says to run it again.
8. **A run can print the takeover note and still refuse.** Another run can create the lock in the instant the path is empty. That was so before this phase.
<!-- /ANCHOR:limitations -->

---


