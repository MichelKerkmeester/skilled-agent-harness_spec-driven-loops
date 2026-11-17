# Review pass five, verification of findings

Verifier: Opus 5.5, 2026-11-15. Read-only on code at HEAD 2427bc4c4b6. Probes are in `probes/`. No model session, runtime chat, live runner, build or daemon ran, and no prompt file was opened. The verifier returned this report as text, and the coordinator saved it here.

Count: confirmed P0 0, P1 2, P2 29. Rejected 1.

## accuracy-runner-5

- **iter1-P1-shell-writes-invisible: CONFIRMED P1.** `probes/shell-inplace-write.mjs` sends one Claude `Bash` call per spelling through `normalize`, `startState` (an `ask` row expecting `/deep:review`) and `loopInit`. A redirect into `specs/x/review/report.md` prints `kinds=write unsafe=true loopInit=false`. `sed -i`, `perl -pi`, `tee`, `cp` and a `python3 -c` write to the same path each print `kinds=shell unsafe=false loopInit=null`. Decline-row starts are hidden by the same cause: a `cat` of `.skilled/commands/deep/review.md` then a redirect gives `startedCommand=/deep:review`, and the same `cat` then `sed -i` gives `null`. Phase 022 T032 already called `sed -i` a write but only removed it from the read rule. P1 because the goal log must explain `unsafe` row by row, so a missed write is a missed safety verdict. Fix: in `score-command-transcripts.mjs` `normalize`, emit a `write` event for in-place and non-redirect shell writers (`sed -i`/`--in-place`, `perl -i`, `tee`, `cp`, `mv`, `rm`, `mkdir`, `touch`).
- **iter3-P1-arena-build-not-the-commit: CONFIRMED P1.** `probes/arena-provenance.sh` runs the real builder on a temp source repository. Case A, source edited and rebuilt with nothing committed: builder exit 0 and `ok:true`, the arena `src.js` is `v1` (HEAD) but `dist/out.js` is `built-from-v2-uncommitted`, and the marker records the HEAD. Case B, source committed clean at v3 with `dist` left at the v2 build: exit 0, the arena `src.js` is `v3` and `dist/out.js` is still `built-from-v2-uncommitted`. In the source `dist/out.js` (.342) is older than `src.js` (.484), and in the arena it is stamped newer (.887 against .844), so the freshness guard reads a stale build as fresh. Case B shows a clean-tree check alone would not close the gap. The 026 runbook (T039) builds arenas with `--source .` and checks only HEAD and `AGENTS.md`. Fix: in `prepare-behaviour-arena.mjs` `buildArena`, refuse unless the source tree is clean and every copied `dist` is newer than the newest tracked source it builds from, and record the source status in the marker.
- **iter3-P1-remote-guard-first-turn-only: CONFIRMED, true severity P2.** `probes/remote-guard.mjs` calls the exported `liveArmRefusal`, `statusSnapshot` and `restoreTurn` on a temp arena-shaped repository. The turn-1 guard returns `null`. A turn adds `origin` as a file URL, status shows 0 paths before and after, `restoreTurn` returns `{"restored":true,"leftoverPaths":[]}` and the remote survives. The guard would now return `remote_present`, but `runTurn` calls it only when `isFirst` (`run-command-behaviour.mjs:1266`, caller `index === 0` at :1403). Not P1: the remote check was never the push boundary. With no remote at all, `git push file://<bare> HEAD:refs/heads/probe` exits 0 on the first turn. The boundary that holds is `childEnv` (empty `credential.helper`, empty `GH_CONFIG_DIR`, `GIT_TERMINAL_PROMPT=0`), and the comment at :610-613 overclaims. Fix: in `runTurn`, run the remote half of `liveArmRefusal` before every live turn, and correct the comment to name the credential overrides as the boundary.
- **iter1-P2-quoted-command-line-is-a-start: CONFIRMED P2.** `probes/command-line-cases.mjs`: refusal text that quotes `COMMAND: /deep:review → started` gives `startedCommand=/deep:review` and `startState.started=true`. Fix: in `commandLines`, accept only a marker that opens its line (after list or emphasis markup) outside a quoted or fenced span.
- **iter1-P2-mode-suffix-hides-repeat: CONFIRMED P2.** `COMMAND: /deep:review → offered` then `COMMAND: /deep:review:auto → started` counts `1` and `1`, the pair without the suffix `2` and `2`. Fix: in `commandLines`, tally on the namespace and name, not the raw match.
- **iter2-P2-symlink-escapes-arena: CONFIRMED P2, latent.** Case C of `arena-provenance.sh`: a `dist/linked` symlink to an outside folder arrives as the same link and the outside file is readable. In this repository 80 links, 0 absolute, 0 resolving outside. Fix: in `copyPath`, refuse or dereference a symlink whose real path leaves the source.
- **iter2-P2-tracked-dotenv-cloned: CONFIRMED P2, latent, from reading.** `cloneInto` and `checkoutDetached` bring every tracked file, and `holdsDotenv` runs only in `copyPath`. `git ls-files` finds 2 tracked dotenv-named files, both `.env.example`. Fix: in `buildArena`, refuse or name tracked `.env*` files, and narrow the header's dotenv sentence to the copied trees.
- **iter2-P2-macos-only-copy-flag: CONFIRMED P2, from reading.** `runCp` always spawns `cp -Rc`. The lineage's CI citation is wrong. Fix: pass `-c` only on darwin.
- **iter4-P2-marker-literal-duplicated: CONFIRMED P2.** Three code copies of `skilled-behaviour-arena` and two tests that write the marker by hand. Fix: export `MARK` and import it.
- **iter4-P2-arena-copy-path-untested: CONFIRMED P2.** The arena builder cases commit only `AGENTS.md` and `CLAUDE.md`, so `runCp` never runs. Fix: add a case that commits an ignored `dist` holding a dotenv file and asserts the skip and the stamp.

## kill-switch-cli-5

- **iter2-P2-env-alias-column: CONFIRMED P2.** `ENV-REFERENCE.md:74` says "No aliases", but `hookFlagDecision('skill-advisor', {MK_HOOKS_DISABLED:'1'}, {})` returns `reason:"master"`, and row :75 omits the three `MK_SKILL_ADVISOR_*` names. Fix: list `MASTER_ALIASES` and the legacy names.
- **iter2-P2-env-source-column: CONFIRMED P2, from reading.** Row :75's Source cell omits the CLI and the handler that call `advisorDisabledBy`. Fix: add them.
- **iter2-P2-cp003-control-aliases: CONFIRMED P2.** The control command in `global-disable-flag.md:49` unsets 4 names, and `ADVISOR_DISABLED_FLAGS` holds 10. Fix: unset all ten.
- **iter3-P2-launcher-switch-fixture: CONFIRMED P2.** `launcher-bootstrap.vitest.ts:127-131` sets two names. Fix: set every `ADVISOR_DISABLED_FLAGS` name.
- **iter3-P2-cli-mk-alias-filter: CONFIRMED P2.** `skill-advisor-cli-stale-daemon-retry.vitest.ts:221` filters out every `MK_` name and no test asserts an abstain for one. Fix: keep them and assert `recommendations: []` and no daemon call.
- **iter3-P2-lib-readme-tree: CONFIRMED P2, true count six.** `lib/README.md:98-120` misses six files. Fix: add them.

## docs-metadata-5

- **DM5-P2-001: CONFIRMED P2.** `command-meaning-matching.md:26` says 46 and the generated file has 47. Fix: 47.
- **DM5-P2-002: CONFIRMED P2.** `manual-testing-playbook.md:103` and :38 name numbered category folders that no longer exist. Fix: name the feature-named folder and drop the gap-09 note.
- **DM5-P2-003: CONFIRMED P2.** :155 and :189 schedule `CL-004..CL-010` while CL-004 is not authored. Fix: `CL-001, CL-005..CL-010`.
- **DM5-P2-004: CONFIRMED P2.** `v1.1.0.0.md:251` says "no alias" while :106 and :206 and `RETIRED_COMMANDS` redirect the old name. Fix: say the old name has no command file and is redirected.
- **DM5-P2-005: CONFIRMED P2.** `tests/README.md` lists 39 of 91 files and none of the six command-surfacing suites. Fix: regenerate the tree.
- **DM5-P2-006: CONFIRMED P2.** `hooks/dsh/README.md` is missing from the leaf files. Fix: add it to `leaf-scopes.json` and regenerate.
- **DM5-P2-007: CONFIRMED P2.** :30 persists only `PASS`, `FAIL` or `SKIP` while :121 defines `PARTIAL`. Fix: add `PARTIAL`.
- **DM5-P2-008: CONFIRMED P2, partial.** `v1.1.0.0.md:176` describes `loadRate` loosely. Fix: say it counts loads of the expected command or skill and leaves `otherMode` out of the numerator.

## vibe-hooks-doctor-5

- **R1-P2-001: CONFIRMED P2, older-build shape only.** `probes/vibe-part.mjs`: a `Directives:`-only context gains a document line. Fix: return the context unchanged when it starts with `Directives:`.
- **R1-P2-002: REJECTED.** `cli-mistral-vibe/references/guards-and-hooks.md:184` and :195 document `parent_session_id`, and the probe shows the code handles it as intended.
- **R2-P2-001: CONFIRMED P2.** The fixed hop count in `user-prompt-submit.ts` misses `hook-flags.cjs` from source while every compiled copy resolves. Fix: find it from the repository root.
- **R2-P2-002: CONFIRMED P2.** `skill-advisor-hook.md:173` says the HOOK alias disables only the native adapters. Fix: say every alias silences every adapter and the direct call.
- **R3-P2-001: CONFIRMED P2.** `hook-wiring-check.cjs` reads `ok vibe` for a `pre_agent` block with `match = "agents_spawn"`. Fix: accept a `pre_agent` block only when `match` is absent or `main`.
- **R3-P2-002: CONFIRMED P2.** `skill-advisor-hook.md:84` and the start table omit Vibe. Fix: add it.
- **R4-P2-001: CONFIRMED P2, from reading.** `headReceiptDir` reads `process.env`, not the injected `env`. Fix: pass `env` through.
- **R4-P2-002: CONFIRMED P2.** The contract test named "the route declares all DSH checks" walks DSH and Vibe checks. Fix: rename it.

## Seen outside, not graded

- The arena header says a live turn "cannot reach anything outside its own checkout". The arena limits remotes and credentials, not the filesystem. A turn can write anywhere its user can by absolute path, and `remote-guard.mjs` shows a push with no remote to a local file URL exits 0.
- `hooks/claude/directive-lifecycle-boundary.ts` and the `system-spec-kit/runtime/hooks/*/*.ts` sources share the fixed-hop path that misses from source. Their dist copies resolve.
