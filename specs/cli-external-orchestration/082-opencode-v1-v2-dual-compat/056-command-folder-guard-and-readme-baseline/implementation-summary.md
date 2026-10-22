---
title: "Implementation Summary"
description: "Phase 055 proved the `.markdown` exclusion with two command lists, which can only show that nothing changed. The battery's `command-listed` leg now names files: a non-command file in the command folder whose name a host lists fails the leg, even when a global or inherited folder owns that name, while v2 built-ins and configured MCP prompts stay exempt. The README verdict baseline is rebuilt from the tracked set at the same time, 978 to 985 entries with a parity diff of 0, and the live battery passes every leg on both versions with the new check in place."
trigger_phrases:
  - "command folder guard and readme baseline implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/056-command-folder-guard-and-readme-baseline"
    last_updated_at: "2026-10-22T00:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Recorded the per-file command-folder guard"
    next_safe_action: "Push, confirm CI, then update the changelog"
    blockers: []
    key_files:
      - "specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/056-command-folder-guard-and-readme-baseline/scratch/verification.txt"
      - "specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/056-command-folder-guard-and-readme-baseline/scratch/battery-live.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "056-command-folder-guard-and-readme-baseline"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions:
      - "How phase 056 closes 055's three Known Limitations: a CI-guarded suffix, a per-file command-folder check, and a README verdict baseline rebuilt from the tracked set"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 056-command-folder-guard-and-readme-baseline |
| **Status** | In Progress |
| **Completed** | Pending T016 (CI confirmation) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The command proof now names files. Phase 055 kept 12 non-command files out of both OpenCode versions' listings by renaming them to `.markdown`, and proved it by reading two command lists on each version. A list can only show that nothing changed, so the proof had no answer for the question the rename actually rests on: which file produced a listed name. The battery's `command-listed` leg now fails a listed name that a non-command file in the command folder could produce, on both versions, and the README verdict baseline it sits beside now matches the tracked set.

### Phase 56: command-folder-guard-and-readme-baseline

The check runs before the allowlist skip, which is the part that matters. A global or inherited folder can legitimately own a name, and the old leg accepted that ownership as the whole answer; C14 builds exactly that case, a real global `.md` command owning `deep/README` beside a `deep/README.markdown` in the project's command folder, and the leg now fails it. A missing `.md` command already failed before this phase and still does.

Two exemptions keep the guard from failing a listing a host is entitled to produce: v2 built-ins and configured MCP prompts. Both are listed whatever the files are, so a non-command file sharing their stem proves nothing. Review round 1 found exactly that, with the leg failing v2's built-ins whenever a non-command file shared a stem, and the exemption plus C16 fixed it. v1 registers no built-ins, so C16 keeps the same stem a stray there, which is the asymmetry the check has to hold.

The walker itself, `listNonCommandFiles`, reads `command/` and `commands/` under `.opencode` and maps both the relative path and the extension-less stem of every non-`.md` file to that file, because a host names a file with or without the extension. A stem a `.md` command already owns is left out, since the command answers that name. It follows links and ends a cycle on a visited real path, and C17 proves a symlinked command folder still exposes its non-command names.

The README verdict baseline was the other half of 055's gap. It is rebuilt from the tracked set with `test_readme_verdict_parity.py --write`: 978 to 985 entries, 8 tracked READMEs added, one stale entry removed for the deleted `.skilled/skills/sk-code/shared/assets/patterns/README.md`, and 0 existing verdicts changed. Seven of the added READMEs are valid; the eighth is the vendored npm README under `082/scratch/a2-v2pkg/package`, which is invalid with a return code of 1 and one issue, recorded as the auditor gives it.

### Docs Step: Changelog and Doctor README

The guard landed as `d39360163c` on main before the docs step, and the operator asked for the changelog and its related docs to follow it in the same phase. `.skilled/changelog/skilled/v4.0.0.13.md` changed in four places: the command-support paragraph now says the 12 files moved back into `.skilled/commands/` as `.markdown` because both versions register every `*.md` under `commands/`, with the command list unchanged at 40 on v1 and 42 on v2; the battery testing paragraph adds the new failure rule; the battery unit test row reads 55; and a new upgrade note tells readers to repoint `.skilled/command-support/` links. The glance list had grown to 13 bullets after a later edit by another change and is back to 12 by merging the two OpenCode install and plugin bullets. `.skilled/commands/doctor/scripts/README.markdown` states the new rule in its command-listed bullet, names its exemptions, and says a name a `.md` command owns is left out. Both files validate with `validate_document.py` at 0 issues, and a search of the live docs for `command-support` or the old `.md` names found no other stale reference outside spec records and generated indexes.

A read-only DeepSeek fact check returned PASS with 2 P2s, both fixed: the "stay at their old paths" wording, and the README omitting the command-owned-name exception.

### Deviations and Recorded P2s

The guard deviates from a strict per-file rule in one place, and `scratch/verification.txt` records it through review: round 1 returned FAIL with 1 P1 (v2 built-ins failed when a non-command file shares their stem) plus 3 P2s, and the fix was the exemption for built-ins on v2 and configured MCP prompts, pinned by C16. Round 2 returned PASS with 5 P2s. Fixed: the stale comment above `legCommandListed`, and a symlinked command folder test (C17). Recorded, not fixed, exactly as the verification file lists them: a configured MCP prompt whose name a non-command file also produces passes; the unreadable-config degrade rule does not recognise the new detail text; a detail repeats the name when the listed name keeps its extension; no cycle or broken-link test for the new walker, which reuses `listCommandNames`' guards.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/opencode-version-battery.cjs` | Modified | `listNonCommandFiles`, the `nonCommand` field on `allowedCommandSources`, the check in `legCommandListed` and the exemption for built-ins and configured MCP prompts |
| `.skilled/commands/doctor/scripts/tests/opencode-version-battery.test.cjs` | Modified | C14 to C17: the guarded README, the walker's mapping, the exemptions, and the symlinked command folder |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json` | Modified | Rebuilt from the tracked set: 978 to 985 entries |
| `scratch/verification.txt` | Created | The unit, revert, parity, suite and review record |
| `scratch/battery-live.txt` | Created | The live battery transcript, both versions |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Created | This phase's packet, filled from the scaffold |
| `.skilled/changelog/skilled/v4.0.0.13.md` | Modified | The `.markdown` move and the unchanged 40/42 lists, the new failure rule, 55 as the test row, the upgrade note, and a glance list back to 12 bullets |
| `.skilled/commands/doctor/scripts/README.markdown` | Modified | The command-listed bullet carries the new rule, its exemptions and the command-owned-name exception |
| `../spec.md` | Modified | The phase map row for 056 and the 055 to 056 handoff row |
| `../055-command-support-into-commands/implementation-summary.md` | Modified | One sentence per Known Limitation saying how this phase closes it |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The unit tests carry the check and the revert proof carries the tests. The battery suite ran 51/51 at `781797ce9d` before the change and 55/55 after C14 to C17. With the non-command check removed from `legCommandListed`, C14 fails, reported as `not ok 32 - C14: a listed README fails even when a global folder owns its name`, at 52/53; restored, 53/53. That round trip is what makes C14 evidence rather than an assertion, because it shows the test goes red for the behaviour it names.

The live battery then ran on both versions with the new check in place, and every leg passed: family-present, plugin-discovered, plugin-load and command-listed on v1, then family-present, plugin-active, skill-visible and command-listed on v2. The v2 read came from a private `serve`, so the shared service was never touched. The repository CI workflow runs that same battery leg on 1.19.3 and 2.0.32, which is where the suffix guard now lives: the `.markdown` exclusion is still an upstream fact about what both hosts glob, but a host that later widened its glob would fail the leg on the file it listed.

The README baseline was rebuilt rather than patched, and the parity rerun after the rebuild reports `baseline_files=985 diff_entries=0 PASS`. The sk-doc script tests ran 38 PASS with 0 FAIL through `run-script-tests.sh` at exit 0. The tracked smoke suites read plugins 533/533 and hook node tests 914/914 over 30 files; both grew on main since 055's 516 and 889, and neither suite covers the files this phase changed.

A separate read-only review through a DeepSeek session took two rounds. Round 1 FAIL with 1 P1 and 3 P2s, the P1 fixed by the exemption and pinned by C16. Round 2 PASS with 5 P2s, the stale comment and the symlink test fixed, the rest recorded. The guard and baseline work is committed and pushed as `d39360163c` on main, and the changelog and doctor README followed it. CI is the one thing still open: T016 stays unticked, so nothing here claims a green run.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fail on the non-command file before the allowlist skip | A global or inherited folder owning a name was the hole: the allowlist accepted the ownership and never asked what file in the project's command folder could have produced it |
| Record both the relative path and the extension-less stem | A host names a file with or without the extension, so either spelling has to prove the file is not a command |
| Leave out a stem a `.md` command already owns | The command answers that name, so the file behind the stem is not what a host listed |
| Exempt v2 built-ins and configured MCP prompts | Both are listed whatever the files are, so a non-command file sharing their name proves nothing. Round 1's P1 was this gap, and C16 pins the exemption in both directions, with v1 still failing the same stem |
| Rebuild the baseline from the tracked set instead of adding the 7 READMEs by hand | 055 deliberately patched only the paths it moved; the gap it left was the fixture disagreeing with the tracked set, so the fix is to make the fixture match the set |
| Keep the vendored npm README in the baseline as invalid | It is tracked, and the fixture records what the auditor returns for it, a return code of 1 with one issue, rather than hiding a tracked file behind an exclusion |
| Record four P2s instead of fixing them | Each one is either a deliberate exemption or a test-coverage gap, and none of them changes what the leg reports on a real listing |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Battery unit tests | PASS: 51/51 at `781797ce9d` before the change, 55/55 after C14 to C17 |
| Revert proof | PASS: with the check removed from `legCommandListed`, C14 fails at 52/53; restored, 53/53 |
| Live battery, OpenCode 1.19.3 | PASS: family-present, plugin-discovered, plugin-load and command-listed all PASS (`scratch/battery-live.txt`) |
| Live battery, OpenCode 2.0.32 | PASS: family-present, plugin-active, skill-visible and command-listed all PASS, read on a private `serve` with the shared service untouched |
| README verdict baseline | PASS: 978 to 985 entries, 8 added (7 valid at return code 0, the vendored npm README invalid at return code 1 with 1 issue), 1 stale entry removed, 0 existing verdicts changed |
| README verdict parity | PASS: rebuilt with `test_readme_verdict_parity.py --write`, rerun reports `baseline_files=985 diff_entries=0 PASS` |
| sk-doc script tests | PASS: 38 PASS and 0 FAIL (`run-script-tests.sh`, exit 0) |
| Plugins | PASS: 533/533 (grew on main from 516 since 055; the suite does not cover the changed files) |
| Hook node tests | PASS: 914/914 over 30 files (grew on main from 889 since 055; the suite does not cover the changed files) |
| Read-only review, round 1 | FAIL: 1 P1 (v2 built-ins failed when a non-command file shares their stem) plus 3 P2s. The P1 was fixed by exempting built-ins on v2 and configured MCP prompts, pinned by C16 |
| Read-only review, round 2 | PASS: 5 P2s, the stale comment above `legCommandListed` and a symlinked command folder test (C17) fixed, four recorded |
| Changelog and doctor README | PASS: `validate_document.py` VALID with 0 issues on `v4.0.0.13.md` and on `doctor/scripts/README.markdown` (`--type readme`); the live-doc search found no stale reference outside spec records and generated indexes |
| Docs fact check | PASS: read-only DeepSeek review with 2 P2s, both fixed (the "stay at their old paths" wording, and the README omitting the command-owned-name exception) |
| Commit | `d39360163c` on main (guard and baseline), pushed before the docs step |
| CI | PENDING: T016 is unticked, so this phase claims no CI result |

Every number above was read from `scratch/verification.txt` and `scratch/battery-live.txt`, and the battery unit test count was re-read from the suite at the final state.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The suffix is still a convention the hosts happen to honour.** Both 1.19.3 and 2.0.32 scan only `.md` names today, and neither offers an ignore list or a frontmatter opt-out; what this phase adds is a check that fails the leg on the file a widened glob would list, not a contract with the hosts.
2. **A configured MCP prompt whose name a non-command file also produces passes.** The exemption is deliberate, since a configured prompt is listed whatever the files are, but it means that one combination reads as legitimate when it is ambiguous.
3. **The unreadable-config degrade rule does not recognise the new detail text.** A config that cannot be read still degrades as it did before, without knowing about the non-command wording.
4. **A detail repeats the name when the listed name keeps its extension.** The message reads correctly but carries the name twice in that case.
5. **The new walker has no cycle or broken-link test of its own.** It reuses `listCommandNames`' guards, and C17 covers a symlinked command folder, but the cycle and broken-link paths are untested here.
6. **CI is unconfirmed at the pushed commit.** The guard commit `d39360163c` is on main and the changelog and doctor README now describe it, but T016 stays unticked, so nothing here claims a green run.
<!-- /ANCHOR:limitations -->

---
