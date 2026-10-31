---
title: "Implementation Summary"
description: "The document validator stops failing 1,175 benchmark companion and fixture files, and the README reference and count checkers drop from 5,760 and 801 hits to 9 and 76 while still checking every link, row and tree line, with the real README debt corrected. Merged with main's false-positive release, they fail no README that main's checker passes."
trigger_phrases:
  - "alignment fixes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/070-repo-doc-debt/007-alignment-fixes"
    last_updated_at: "2026-10-27T21:30:00Z"
    last_updated_by: "lane-l5"
    recent_action: "Recorded what changed and how it was verified"
    next_safe_action: "Commit this phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "lane-l5-doc-checker-fixes"
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
| **Spec Folder** | 007-alignment-fixes |
| **Completed** | 2026-10-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The document validator stops failing 1,175 benchmark companion and fixture files on README rules. The README reference and count checkers drop from 5,760 and 801 hits to 9 and 76, by judging only what they can prove while still checking every link, inventory row and tree line, and by correcting the README debt the restored checks found. Those figures were measured with this phase's checkers. Repo-wide totals are now measured with the checkers merged with main's false-positive release, which reads more code spans, so they stand at 1,069 reference lines and 83 count lines over 979 READMEs.

### Benchmark companion type and fixture folders

`failed-runs.md`, `source.md`, `skill-benchmark-report.md` and `findings-and-recommendations.md` in a run folder below `benchmark/reports/` are typed `benchmark_companion`, a rule set with no required section, divider or heading-case rule. A folder segment ending in `fixture` is skipped like one ending in `fixtures`, and a numbered spec folder is still checked.

### README reference checker

`check_readme_references.py` imports `normalize_reference_token`, `token_looks_like_path`, `classify_reference_status` and `resolve_gitignored_references` from `audit_readmes.py`. Every Markdown link that is not a URL or an anchor is checked once it normalizes; only a target such as `{placeholder}` that does not normalize is dropped. Inline code follows the audit's path rules, so a slash command is not a path. A table cell made only of code spans and a file tree entry, drawn with box glyphs or ASCII `+--`, `|--` and `` `-- ``, are inventory claims, resolved from the README folder, its package root and the repository root and flagged only when none holds the file. Git-ignored runtime paths are cleared in batched `git -c core.fsmonitor=false check-ignore` calls, never one per path. Line numbers and example-fence skipping stay.

### README count checker

`check_derived_readme_counts.py` reads a number as a claim only when a plural count term follows it directly, with at most one word between, and the number stands alone. A number is skipped only when its own sentence names a path outside the README folder and does not name the folder itself, so "`.claude/hooks/` contains 25 symlinks" is still checked beside a link to another README. Own-folder claims still need a complete file inventory.

### README debt

The restored checks found broken references in about 40 READMEs across system-spec-kit, system-skill-advisor, system-deep-loop, sk-prompt, mcp-tooling, sk-code, sk-design-md-generator, sk-doc, `.skilled/hooks/` and `.skilled/commands/doctor/`. Each was read against its folder and pointed at the file that exists, or its row was removed when the file is gone and nothing replaced it. Stale counts were corrected in `.claude/hooks/README.md` (27 symlinks, two of them missing from the inventory) and the sk-design-md-generator backend and tests READMEs (28 modules, 20 suites, 176 tests). The flowchart validator test now points at the script's home in sk-design-diagram.

### Merge with the false-positive release

Main shipped its own pass over both checkers (`0830f0bc0d`, sk-create-readme v1.3.2.0) while this phase was open, and the rebase merged the two. The reference checker keeps this phase's link, table and tree reading, its three resolution bases and its batched git-ignore clearing. From main it takes the broad code-span reading with its skip classes (slash commands, home paths, model ids, placeholders, quoted arguments, output flags), the `readme-check` marker block, the machine-path failure, the three other absent-by-design classes, the probe that stops a README inside an ignored folder from clearing its paths, and a stale tree root failing once. A token only main's rule reads, such as a bare name, resolves by main's rules alone, so a marker cannot go stale through this phase's package-root base. Fenced commands keep this phase's anchored rule. The count checker keeps this phase's claim rule and other-path skip and adds main's label and bound skips, `one` as an article, plugin code counts, named-folder derivation and `allow-count` entries.

Two behaviors differ from both parents. A bare name resolves when a file of that name is tracked or untracked but not ignored, read with `git ls-files --cached --others --exclude-standard`, where main counted tracked names only; the reference test writes its files without committing them. Git-ignored clearing takes two batched calls per run, the first for the folder probes and the names main's rule resolves, the second through `audit_readmes.py`, where this phase had one.

The merge left six READMEs failing that main's checker passed. `.skilled/skills/sk-git/README.md` drops `allow-ref work/`, because the fence rule no longer reads the quoted grammar literal `"work/"`. Five READMEs gain an `allow-count` entry for a correct count no folder listing proves: `81 tests` in the fast-mode extension tests README (a vitest run prints `81 passed (81)`), `four files` in the sk-design-diagram style-reference README (the files of `harness-diagram/`), `116 tests` in a dated runtime-executor changelog index, `5 template files` in an archived Level 2 template README and `300 files` in an archived plugin README (`toolOutputMaxFiles: 300`).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py` | Modified | Companion type, `-fixture` folder skip, `--type` choice |
| `.skilled/skills/sk-doc/shared/assets/template-rules.json` | Modified | `benchmark_companion` rule set |
| `.skilled/skills/sk-doc/sk-create-readme/scripts/check_readme_references.py` | Modified | Audit path rules |
| `.skilled/skills/sk-doc/sk-create-readme/scripts/check_derived_readme_counts.py` | Modified | Provable claims only |
| `.skilled/skills/sk-doc/sk-create-readme/scripts/audit_readmes.py` | Modified | Git calls run with fsmonitor off |
| `.skilled/skills/sk-doc/scripts/tests/test_benchmark_companion_typing.py`, `test_readme_reference_checker.py`, `test_derived_readme_counts.py` | Created | Fifteen regression tests |
| `.skilled/skills/sk-doc/scripts/tests/test-flowchart-validator.sh`, `.skilled/skills/sk-doc/scripts/README.md` | Modified | Flowchart validator path |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json` | Regenerated | The fixture README is now skipped |
| `.skilled/skills/sk-doc/scripts/tests/README.md` | Modified | Lists the new tests |
| `.skilled/bin/README.md`, `.skilled/skills/sk-code/sk-code-quality/README.md` | Modified | Stale spec path, checklist label |
| READMEs listed in tasks T014 to T019 | Modified | Broken references and stale counts |
| `.skilled/skills/sk-doc/sk-create-readme/scripts/README.md` | Modified | Documents both gates beside the audit |
| Changelog entries for twelve skills and modes, their carriers and Hermes copies | Created, Modified | Patch releases |
| `.skilled/skills/sk-git/README.md` and the five READMEs named under the merge | Modified | Marker entries the merged checkers need |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each new test was run against the HEAD scripts copied into the session scratchpad to prove it fails before the change. Each checker was run over the whole tree before and after, and the removed hits were classified by script and sampled by hand.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Companion type keyed on the four contract names | The report contract names exactly these; `serving-snapshot.md` and `report.md` are not companions in it |
| Git-ignored clearing batched per run with fsmonitor off | A per-README plain `git check-ignore` hung for minutes under fsmonitor here; batched calls keep the check and the speed. The merge made it two calls, one more for main's folder probe and name-resolved tokens |
| In the merge, each token resolves by the rules of the side that reads it | Resolving main's bare names from this phase's package root failed 246 READMEs instead of 327, but it made a marker stale through an accidental match (`benchmark/reports/` resolving to `sk-doc/benchmark/reports/`) |
| Inventory rows and tree lines resolve from three bases | A row often names a file beside the README, in its package or by repository path; flagging only when none resolves keeps real misses and drops layout noise |
| A count is skipped only when its own sentence names another path | Skipping the whole line hid real own-folder counts such as `.claude/hooks/README.md`'s 25 symlinks; counting the named folder produced false failures, because a named folder is often a working directory |
| Singular terms are never claims | "in one file" and "one log file" are prose; an inventory of one is rare |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate_document.py` over 9,381 files | exit 1 on 4,075 to 2,900; no file from 0 to 1 |
| `check_readme_references.py` over 853 READMEs | 5,760 to 9 unresolved; fail 459 to 4 |
| `check_derived_readme_counts.py` over 853 READMEs | 801 to 76 failing claims; fail 224 to 50 |
| New tests against HEAD scripts | 9 of 15 fail before, 15 pass after; the flowchart test exits 1 before and 0 after |
| `run-script-tests.sh` with fsmonitor off | 42 of 42 suite files pass, `all sk-doc script tests passed`, exit 0 |
| Merged checkers, both `--self-test` | `SELF-TEST PASS`, exit 0 on each |
| Merged checkers, the four checker pytest files | 27 passed |
| Merged `check_readme_references.py` over 979 READMEs | `pass=653 fail=326`, 1,069 flagged lines; main's checker on the same tree `pass=623 fail=356`, 1,567 lines; no README fails that main's checker passes |
| Merged `check_derived_readme_counts.py` over 979 READMEs | `pass=924 fail=55`, 83 flagged lines; main's checker on the same tree `pass=907 fail=72`, 110 lines; no README fails that main's checker passes |
| Root README under the merged checkers | `references=266 unresolved=0 allowed=7`; `claims=1 failures=0` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Nine reference hits remained before the merge, none broken.** Two are the deliberate negative fixture `sk-doc/scripts/tests/code-folder/negative/broken-links/README.md`. Six name the `.opencode/specs` legacy layout in the system-spec-kit README and its `cli/core/` and `cli/spec/` READMEs, which describe that fallback accurately. One is `specs/z_archive/`, created on demand.
2. **76 count hits remained before the merge, and the ones checked hold on disk.** The checker proves a count only from a folder listing, so test case totals, subset and remainder counts ("Other 25 scripts"), conceptual counts ("four decision tests"), dated records and counts of another folder on a tree line stay reported. A second sweep re-checked every own-folder test or file count against disk or a test run: the pi extension tests (7 files, 81 tests), the description and validation fixture suites (7 and 4 tests), the md-generator examples (8 files), the injection-screen inputs, the hook registration files (4) and the deep-review fixture iterations (3) all hold. Two stale ones the first pass missed are now fixed: the sk-create-diff scripts README (59 tests, not 39) and the sk-design-chart references README (four files, not three). The rest were classified by reading the line, so a stale count among them stays possible.
3. **Non-skill READMEs have no component changelog.** The `.claude/hooks/`, `.skilled/hooks/` and `.skilled/commands/doctor/` fixes belong in the next release notes.
4. **The merged totals are main's classes, not new debt.** Main's broad code-span reading adds about 750 inline flags this phase's checker never read, all in READMEs main's checker already fails. They were not triaged here.
<!-- /ANCHOR:limitations -->
