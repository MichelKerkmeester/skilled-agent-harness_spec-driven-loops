---
title: "Implementation Summary"
description: "The 12 root and hub READMEs went from 573 unresolved references and 83 count failures to 36 and 4, then a follow-up marker and four absent-by-design rules took them to 3 and 2, every one in a README this packet may not edit."
trigger_phrases:
  - "readme reference debt implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/071-readme-reference-debt"
    last_updated_at: "2026-10-27T23:30:00Z"
    last_updated_by: "readme-reference-debt-followup-worker"
    recent_action: "Added the readme-check marker and absent-by-design rules, recorded the harness follow-up"
    next_safe_action: "None"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-readme/scripts/check_readme_references.py"
      - ".skilled/skills/sk-doc/sk-create-readme/scripts/check_derived_readme_counts.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-reference-debt-071"
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
| **Spec Folder** | 071-readme-reference-debt |
| **Completed** | 2026-10-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The 12 READMEs went from 573 unresolved references and 83 count failures to 36 and 4. Almost all of the drop came from fixing what the two checkers misread, once per class. One README carried a real stale fact, and each failure left standing is listed below with its reason.

### Per-file counts

| README | References before | After | Count failures before | After |
|--------|------------------:|------:|----------------------:|------:|
| `README.md` | 298 | 16 | 41 | 1 |
| `.skilled/bin/README.md` | 33 | 3 | 4 | 1 |
| `cli-external-orchestration/README.md` | 6 | 1 | 4 | 0 |
| `cli-external-orchestration/cli-codex/README.md` | 21 | 2 | 3 | 0 |
| `cli-external-orchestration/cli-opencode/README.md` | 48 | 1 | 6 | 0 |
| `cli-external-orchestration/cli-pi/README.md` | 3 | 0 | 1 | 0 |
| `sk-code/README.md` | 29 | 1 | 8 | 0 |
| `sk-code/sk-code-skilled/README.md` | 4 | 0 | 4 | 1 |
| `sk-doc/README.md` | 59 | 0 | 4 | 0 |
| `sk-doc/sk-create-skill/README.md` | 39 | 2 | 4 | 0 |
| `sk-git/README.md` | 27 | 10 | 2 | 1 |
| `system-deep-loop/README.md` | 6 | 0 | 2 | 0 |
| **Total** | **573** | **36** | **83** | **4** |

The reference check now passes on `cli-pi`, `sk-code-skilled`, `sk-doc` and `system-deep-loop`, and the count check on 8 of the 12. Both pass on `cli-pi`, `sk-doc` and `system-deep-loop`.

### Reference failures by class (573)

| Class | Kind | Count | What was done |
|-------|------|------:|---------------|
| Real stale fact | (a) | 1 | `sk-doc/README.md`: Level 2 adds `acceptance-criteria.md`; no `checklist.md` exists anywhere in the repo |
| Skill named outside the code span | (b) one-off | 1 | Root README: `sk-create-frontmatter/assets/frontmatter-values.json` instead of "sk-create-frontmatter's `assets/...`" |
| Bare placeholder | (c) | 2 | `sk-doc/README.md`: written as `<path/to/document.md>` and `<document.md>`, the convention the checker already skips |
| Illustrative tree | (c) | 3 | Root README phase tree under `specs/<track>/`: fence marked `text example`, the checker's documented marker |
| Bare name or folder name used as a noun (`graph-metadata.json`, `goal.md`, `addons/`) | (b) | 257 | Resolves when a tracked file or folder of that name, or a `.tmpl` template that renders it, exists in the repo |
| Slash command (`/doctor:git`, `/deep:*`, `/goal`) | (b) | 180 | Not a path |
| Slashed word without suffix (`llmgateway/deepseek-v4.1-flash-1017`, `HTTP/UDS`, `64/69/75`, branch names) | (b) | 37 | Not a path unless anchored, suffixed or ending in `/` |
| Absolute path outside the repo (`/dev/null`, `/api/embed`, `/path/to/repo/...`) | (b) | 19 | Skipped; a path under `/Users/` or `/home/` still fails |
| Home path (`~/.zshrc`, `~/.codex/config.toml`) | (b) | 11 | Not a repo path |
| Path from another base (`specs/...`, `system-spec-kit/runtime/...`, a fenced tree's entries) | (b) | 11 | `specs/` resolves from the root, a path that starts with a skill name from that skill, a tree entry under its tree root |
| Runtime folder missing from the root anchors (`.codex/hooks.json`, `.cursor/`) | (b) | 8 | `.claude/`, `.codex/`, `.cursor/`, `.devin/`, `.hermes/`, `.pi/` added to the root anchors |
| Filename with a space (`REPO RULES.md` split into `RULES.md`) | (b) | 4 | The whole code span is tried when its last word fails |
| File-type token (`*.ts`, `.d.ts`) | (b) | 3 | Not a path |
| Left standing | (c) | 36 | Listed under Known Limitations |

Two smaller rules came out of the same triage: a quoted shell argument that contains spaces (an example prompt such as `"Add input validation to src/utils.ts"`) is not a path, and a trailing `\` line continuation no longer breaks tokenizing. Fenced lines drawn inside a box (`│ ... │`) are diagram prose, so only their anchored paths are checked.

### Count failures by class (83 failures over 87 baseline claims)

| Class | Kind | Claims | What was done |
|-------|------|-------:|---------------|
| The count word "one" used as an article (`in one file`, `one project plugin`) | (b) | 25 | `one` is not read as a count |
| Count term in another clause or too far away (`exit 69 ... guard`, `42 validation rules, the ... script suite`) | (b) | 25 | The term must follow the number within three words in the same clause |
| Label or bound (`Gate 4: Workflow`, `Level 2 file set`, `Exit 3`, `more than 100 tracked files`) | (b) | 19 | A number after a label or bound word is not a count |
| Singular term as a modifier (`five workflow modes`, `three-layer guard`) | (b) | 11 | The term must agree in number with the count |
| Vague word not counting a term (`multiple HVR violations`) | (b) | 1 | Same adjacency rule |
| Claim about a folder the sentence names | (b) | 2 | `13 rule files in .skilled/repo-rules/` and `Seventeen JavaScript plugins live in .skilled/plugins/` now derive from that folder, and both are exact |
| Left standing | (c) | 4 | Listed under Known Limitations |

Four of the 87 claims passed at baseline and fall in the suppressed classes, which is why the class rows add to 87, not 83. No count in the 12 READMEs was wrong.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/sk-create-readme/scripts/check_readme_references.py` | Modified | The reference rules above, plus six new self-test cases |
| `.skilled/skills/sk-doc/sk-create-readme/scripts/check_derived_readme_counts.py` | Modified | The count rules above, plus two new self-test cases |
| `README.md` | Modified | Phase tree marked `text example`; frontmatter value list named by its skill path |
| `.skilled/skills/sk-doc/README.md` | Modified | `checklist.md` to `acceptance-criteria.md`; two placeholders written as `<...>` |
### Follow-up: marker and absent-by-design rules

A follow-up took the 36 references and 4 counts left standing to 3 and 2. The rest pass through one of two mechanisms, each proven by a self-test that keeps a broken path beside it failing.

**The `readme-check` marker.** A README names each known-good token it cannot resolve in one HTML comment block, which renders as nothing:

```text
<!-- readme-check
allow-ref worktrees/ | a git branch namespace, not a folder
allow-count zero files | a symptom of a no-op run, not an inventory
-->
```

An `allow-ref` entry suppresses that exact token, and an `allow-count` entry that exact claim phrase from its number through its count term, in that README only. An entry with no reason fails, and so does one that matches nothing, so a marker cannot outlive the reference it excuses. The block is blanked before extraction, so its own text is never read as a reference or a claim. It is documented in each checker's docstring, the existing home of their conventions; `sk-create-readme/SKILL.md` never names the checkers.

**Four absent-by-design classes in the reference checker.** Each covers a path no checkout holds, by design:

| Class | Passes | Self-test proving an ordinary path still fails |
|-------|--------|------------------------------------------------|
| The tracked `.gitignore` excludes the path | `dist/`, in-place compiled `.js`, `*.log`, `*.local.json` | `src/out.js` (not ignored); a README inside an ignored folder, including one re-included by a `!` pattern |
| A bare `name.js` whose `name.ts` is tracked | `generate-context.js` | `other.js` with no `.ts` source |
| A hub README path every child mode folder holds | `references/providers-and-models.md` in all seven cli modes | `refs/y.md` held by one mode of two |
| Per-repository config the doctor commands create | `.sk-code/quality.json`, `.sk-git/`, exact tokens only | `.sk-gitx/` |

The argument of an output flag (`-o file.txt`) is a file the command writes, so it is no longer checked; `tool out.txt` without the flag still fails. The first gitignore rule passed every relative path in a README kept inside an ignored folder, `checklist.md` in `.skilled/skills/.state/completion-sentinel/README.md` among them. The repo-wide audit caught it, and the rule now skips a README whose folder contents are ignored as a whole.

| README | References before | After | Count failures before | After |
|--------|------------------:|------:|----------------------:|------:|
| `README.md` | 16 | 0 (7 allowed by marker) | 1 | 0 (marker) |
| `.skilled/bin/README.md` | 3 | 0 (gitignored `dist/`) | 1 | 1 |
| `cli-external-orchestration/README.md` | 1 | 0 (per-mode) | 0 | 0 |
| `cli-external-orchestration/cli-codex/README.md` | 2 | 0 (compiled `.js`, output flag) | 0 | 0 |
| `cli-external-orchestration/cli-opencode/README.md` | 1 | 1 | 0 | 0 |
| `sk-code/README.md` | 1 | 0 (on-demand config) | 0 | 0 |
| `sk-code/sk-code-skilled/README.md` | 0 | 0 | 1 | 1 |
| `sk-doc/sk-create-skill/README.md` | 2 | 2 | 0 | 0 |
| `sk-git/README.md` | 10 | 0 (8 allowed by marker, `.sk-git/` by rule, `backup/` gitignored) | 1 | 0 (marker) |
| Other three | 0 | 0 | 0 | 0 |
| **Total** | **36** | **3** | **4** | **2** |

Both checks now pass on 10 of the 12. `backup/` passes because the root `.gitignore` ignores any `backup/` folder, a true statement about the path that is not the reason the README names it.

### Follow-up: hermetic rename-tooling harness test

A sibling worker made `.skilled/skills/sk-doc/scripts/tests/test_rename_tooling_fixture_harness.py` hermetic, the one suite failure recorded above. The test used the live checkout as its protected root, and `snapshot_git_worktree` in `.skilled/skills/sk-doc/shared/scripts/rename_tooling_fixture_core.py` raises `snapshot path disappeared` on a tracked file missing from the working tree. Each test now builds a throwaway git repository as its protected root, with one committed, one modified tracked and one untracked file, and its assertions are unchanged. The worker reports the regression is still caught: a harness copy that writes into the protected root fails, and so does one without the overlap guard.

A second step fixed the cause in the core. `_hash_physical_path` in `rename_tooling_fixture_core.py` now records a tracked file missing from disk with an `absent` marker instead of raising, so a missing file never hashes like an empty one. The throwaway repository also carries an uncommitted tracked deletion, and a new test, `test_snapshot_records_tracked_deletions_as_absent`, proves absent before and after is no change while present before and absent after changes the digest. The worker reports the new test errors against the HEAD core (`snapshot path disappeared: deleted.md`), a harness copy that deletes a protected file mid-run fails, and the full runner went from 38 PASS and 1 FAIL to 39 PASS, exit 0. One limit stands: the harness CLI run against the live checkout still exits 2, because other sessions write to the live tree during a run, which is why the test uses its own repository.

### Follow-up files changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/sk-create-readme/scripts/check_readme_references.py` | Modified | Marker block, four absent-by-design classes, output-flag skip, docstring, 12 new self-test cases |
| `.skilled/skills/sk-doc/sk-create-readme/scripts/check_derived_readme_counts.py` | Modified | `allow-count` entries, claim phrase, docstring, 3 new self-test cases |
| `README.md` | Modified | Marker block: 6 entries |
| `.skilled/skills/sk-git/README.md` | Modified | Marker block: 4 entries |
| `.skilled/skills/sk-doc/scripts/tests/test_rename_tooling_fixture_harness.py` | Modified | Sibling worker: a throwaway git repository per test, plus the tracked-deletion test |
| `.skilled/skills/sk-doc/shared/scripts/rename_tooling_fixture_core.py` | Modified | Sibling worker: a tracked file missing from disk is recorded as `absent`, not raised |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Both checks ran on the 12 READMEs and on all 977 tracked READMEs before any change, with copies of the original checkers kept outside the repo. Each failure group was read in context before its class was decided. After every checker change, the old and new checkers ran over all 977 READMEs on the same tree, and a line-level diff listed every line that fails now with no failure before. That diff found three regressions the rules had introduced (a tree rooted at the README's own multi-segment path, a `NAME=path` shell assignment, and a folder named in a different sentence of a count line), plus a `#` comment split that cut `specs/###-feature-name/` short. Each was fixed and the diff reran to 0.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A bare name resolves from tracked names anywhere in the repo, not from the disk | A renamed or deleted file still fails, while a name used as a noun for an existing kind of file passes; reading the disk would let gitignored local files pass in one checkout and fail in CI |
| Links keep the old strict resolution | A Markdown link must resolve from the README; the new fallbacks apply only to code spans, fence lines and tree entries |
| A stale tree root still fails while its entries fall back to the README folder | The root name is the defect; failing every entry under it would bury that one line |
| A count claim derives from a folder only when that folder sits in the claim's own sentence | A folder in the next sentence (`.embeddings-cache/` beside "Three TypeScript files") made a correct claim fail |
| No checker rule for the 36 references left standing | Each class is small, and the right signal differs per class (build output, per-repo config, git namespace), so a rule would hide real drift. The follow-up kept that line: each rule it added reads a signal the repository records (`.gitignore`, a tracked `.ts`, the mode folders), and anything else takes a marker |
| A README-level marker block, not an inline comment per reference | One block covers prose, tables and fences alike, where an inline comment would render inside a fence; a reason is mandatory and an unused entry fails |
| A rule, not a marker, for READMEs this packet may not edit | The follow-up could edit only the root and sk-git READMEs, so the other READMEs pass only where a principled class covers them |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `check_readme_references.py` on the 12 READMEs | 573 unresolved to 36; 0 to 4 files passing |
| `check_derived_readme_counts.py` on the 12 READMEs | 83 failures to 4; 0 to 8 files passing |
| Same-tree old against new, all 977 READMEs, references | pass 419 to 597; unresolved 6579 to 1752; 0 lines failing now with no old failure |
| Same-tree old against new, all 977 READMEs, counts | pass 705 to 905; failures 960 to 114; 0 lines failing now with no old failure |
| `check_readme_references.py --self-test` | Before: 2 cases. After: 8 cases, `SELF-TEST PASS`, exit 0 |
| `check_derived_readme_counts.py --self-test` | Before: 3 cases. After: 5 cases, `SELF-TEST PASS`, exit 0 |
| `validate_document.py` on `README.md` and `.skilled/skills/sk-doc/README.md` | `VALID`, 0 issues, exit 0 on each |
| Follow-up: both checks on the 12 READMEs | references 36 to 3 unresolved, 10 of 12 pass; counts 4 to 2, 10 of 12 pass (`scratch/followup-after-12.txt`) |
| Follow-up: old against new over all 987 tracked READMEs, same tree | references pass 597 to 615, unresolved 1864 to 1695; counts pass 914 to 916, failures 112 to 108; 0 new failing lines and 0 newly failing files for both (`scratch/followup-regression-diff.txt`) |
| Follow-up: `--self-test` on both checkers | `SELF-TEST PASS`, exit 0 on each (`scratch/followup-verification.txt`) |
| Follow-up: a mutant with the README-path gitignore guard | stops at `self-test-class-readme-reincluded-in-ignored-folder` without `SELF-TEST PASS`, so the case catches that flaw |
| Follow-up: `validate_document.py` on `README.md` and `.skilled/skills/sk-git/README.md` | `VALID`, 0 issues, exit 0 on each |
| Follow-up: `test_validation_switch.py` | 8 passed, exit 0 |
| Follow-up: `test_rename_tooling_fixture_harness.py` alone | `Ran 5 tests`, `OK`, exit 0 |
| Follow-up: `run-script-tests.sh` after both follow-ups | `all sk-doc script tests passed`, exit 0 |
| `run-script-tests.sh` (sk-doc script suite) | 38 PASS, 1 FAIL: `test_rename_tooling_fixture_harness.py` errors because it snapshots the live worktree and a tracked file under `specs/sk-doc/060-create-goal-mode/012-goal-send-and-dedupe/scratch/` was already deleted in the working tree before this packet began; it does not touch either checker. `test_validation_switch.py`, which runs both checkers, passes (8 passed) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **36 references stand, all class (c).** Per-repository config created on demand: `.sk-code/quality.json` (4) and `.sk-git/` (5). Git branch namespaces in `sk-git/README.md`: `worktrees/`, `branches/`, `backup/`, `work/` (9). Build output not tracked: `generate-context.js` (3), `dist/` (2), `runtime/dist/runtime/skill-advisor-cli.js` (1). Machine-local or deliberately absent: `settings.local.json` (2), `CLAUDE.md` (1, the README says the repo ships none), `storage/` under `~/.local/share/opencode/` (1). Packet-relative generated output: `research/research.md` (2), `review/review-report.md` (1). Example values: `../etc/passwd`, `file.txt`, `my-skill/`, `benchmark/reports/` (4). One per-mode path: `references/providers-and-models.md`, which exists in all seven cli modes (1).
2. **4 count claims stand, all correct.** "Two example files" (root README; the next two bullets list `.env.example` and `hook-flags.env.example`), "the three shell scripts" (`.skilled/bin/README.md`; the block above runs three `bash -n` lines), "all four guards" (`sk-code-skilled/README.md`; `run-all-drift-guards.sh` runs four), "green on zero files" (`sk-git/README.md`; a symptom, not an inventory).
3. **`snapshot/` passes by name only.** In `cli-opencode/README.md` it names a folder under `~/.local/share/opencode/`, and it resolves because some tracked folder in the repo has that name. Accepted: the line rightly names a folder outside the repository (`cli-opencode/README.md:114`), so the pass is correct even though its reason is weak.
4. **`examples=` always printed 0.** Resolved on 2026-10-28, released as sk-create-readme v1.3.6.0. The 237 rewrite landed without touching it, so this packet fixed it: the reference checker reads an example fence's lines like any other fence, tags each reference found there `example`, and resolves it as "example: not checked". The new self-test passes with the other 42, and across all 987 tracked READMEs the pass/fail verdicts match the previous checker exactly (315 fail before and after). `sk-code/shared/README.md` now reports `examples=16`.
5. **Built in the follow-up.** The marker and class rules above; items 1 and 2 describe the state before it.
6. **3 references and 2 counts stand after the follow-up, all in READMEs it could not edit.** Each needs one marker entry from its owner: `storage/` in `cli-opencode/README.md` (a folder under `~/.local/share/opencode/`), `my-skill/` and `benchmark/reports/` in `sk-create-skill/README.md` (what `init_skill.py` creates), "all four guards" in `sk-code-skilled/README.md` and "the three shell scripts" in `.skilled/bin/README.md`, which another worker was editing during this run. Done: on 2026-10-27 `check_readme_references.py` prints `PASS` with `unresolved=0` for all four READMEs, and `check_derived_readme_counts.py` prints `PASS` with `failures=0` for all four; each summary reads `files=4 pass=4 fail=0`, exit 0.
7. **The gitignore rule trusts `.gitignore`.** A typo inside an ignored path, such as a misspelled file under `dist/`, passes. Such a path cannot be checked in a clean checkout anyway. Accepted: ignored build output is absent from a clean checkout by design, so the checker has nothing to compare it with.
8. **Checker flags in two READMEs: resolved 2026-10-28.** Worktree 237's sk-doc 070 rewrite landed on main and `.skilled/skills/system-spec-kit/README.md` now passes both checkers. It left two false positives in `.skilled/hooks/README.md` (`mcp-code-mode/runtime/`, a former location, and `runtime-hooks/`, a rejected directory name), which this packet marked in a `readme-check` block; that README now passes both checkers too.
<!-- /ANCHOR:limitations -->

---
