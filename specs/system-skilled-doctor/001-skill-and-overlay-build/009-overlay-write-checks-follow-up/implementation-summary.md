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
    last_updated_at: "2026-11-11T21:21:40Z"
    last_updated_by: "claude-code"
    recent_action: "Fixed the review findings"
    next_safe_action: "Run the alignment check, then the release"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-overlay-write-checks-follow-up"
      parent_session_id: null
    completion_pct: 80
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
| **Completed** | Not yet. In progress since 2026-11-11 |
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
| `.skilled/commands/doctor/scripts/tests/overlay-engine-follow-up.test.cjs` | Created | 29 tests for the engine fixes and the new behaviour |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs` | Modified | Seven more tests: glob, excluded path, line endings and the four untested groups |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-fixes.test.cjs`, `overlay-engine-repin.test.cjs`, `doctor-overlay-contract.test.cjs` | Modified | Assertions that named the old lock line, state shape or flag list |
| `.skilled/hooks/overlay-guard/opencode/`, `.opencode/plugins/overlay-guard.js` | Created | The OpenCode adapter and its mirror |
| `.skilled/hooks/overlay-guard/tests/opencode-overlay-guard.test.mjs` | Created | Five adapter tests |
| `.skilled/commands/doctor/overlay.md`, `_routes.yaml`, `assets/doctor-overlay-*.yaml`, `assets/doctor-overlay-presentation.txt` | Modified | `--relayout`, `--audit` and the new lines |
| `.skilled/skills/system-skilled-doctor/references/overlays.md` | Modified | Eight trigger phrases, then the new behaviour, version 1.0.7.0 |
| `.skilled/skills/system-skilled-doctor/manual-testing-playbook/` | Modified | Five new scenarios |
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
| The same command after the last fix | `tests 1136`, `pass 1136`, `fail 0` |
| `node --test` over the three `overlay-guard` test files | `pass 29`, `fail 0`. The baseline was 19 |
| `route-validate.sh` | `OK: route-validate`, 31 routes |
| `sync-runtime-mirrors.cjs --check` | `PASS: 256 mirrors across 10 trees are in sync` |
| `check-skill-doc-frontmatter.sh . --coverage` | `violations=0`. It printed `violations=1` before task T004 |
| `validate-playbook-package.cjs --package system-skilled-doctor` | `PASS`, `scenarios=9`. The baseline was 4 |
| `test_readme_manifest.py` | `manifest=reproducible`. It failed in CI on `e97ca56e8d` before the manifest was regenerated |

### Review findings

The ids are those of `review/review-report.md`. Each fix has a test in `tests/overlay-engine-follow-up.test.cjs`, and `node --test tests/overlay-engine-follow-up.test.cjs` prints `pass 29`, `fail 0`.

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
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The first commit of this phase carries another session's files.** Commit `c57b7e4cef` took 57 research files from `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/`, which another session had staged in the shared index. They were not reviewed here.
2. **Nothing was run against Barter's tree after these changes.** The fixes are proven on fixtures. `handover-to-barter.md` lists what a Barter session does next.
3. **A state file from an older engine has no link or item records.** Nothing is retargeted or removed until the first apply writes them, so an item dropped before the upgrade stays until it is removed by hand.
4. **The Opus review lineage is recorded as failed.** Its session refused every `node` call, so it has no state log or findings registry. Its two iteration files and its report exist and were inputs to the synthesis.
5. **`--audit` walks every vendored file.** On a tree the size of Barter's that is about 20,000 files, so it runs only when asked.
<!-- /ANCHOR:limitations -->

---


