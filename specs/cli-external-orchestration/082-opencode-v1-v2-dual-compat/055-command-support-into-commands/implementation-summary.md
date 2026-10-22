---
title: "Implementation Summary"
description: "Phase 004 kept the 12 non-command markdown files out of both OpenCode versions' command lists by moving them to .skilled/command-support/, which put them outside the tree the operator reads commands from. They are now back under .skilled/commands/ with .markdown names, a suffix neither 1.19.3 nor 2.0.32 scans, and both versions list the same 40 and 42 commands as before."
trigger_phrases:
  - "command support into commands implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/055-command-support-into-commands"
    last_updated_at: "2026-10-22T00:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Moved 12 files back into .skilled/commands as .markdown"
    next_safe_action: "Push to main, then tick T017 and T018 with the CI result"
    blockers: []
    key_files:
      - "specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/055-command-support-into-commands/scratch/commands-after.json"
      - "specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/055-command-support-into-commands/scratch/suites-after.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "055-command-support-into-commands"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Where do the non-command markdown files live: inside .skilled/commands/, with .markdown names, the operator's choice of 2026-10-22"
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
| **Spec Folder** | 055-command-support-into-commands |
| **Status** | Complete |
| **Completed** | 2026-10-22 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The operator now reads every command asset from one tree. Phase 004 had a real problem to solve - both OpenCode versions scanned `.skilled/commands/` and registered the 12 non-command markdown files as commands - but it solved it by moving them to `.skilled/command-support/`, a folder that sits outside the tree commands are read from. On 2026-10-22 the operator chose the other solution: keep everything inside `.skilled/commands/` and let the file name carry the exclusion. All 12 files are back, every `.md` now reads `.markdown`, and both versions list exactly what they listed before, 40 commands on v1 and 42 on v2.

### Phase 55: command-support-into-commands

The probe decided the shape of the fix. On both 1.19.3 and 2.0.32 the scan is `{command,commands}/**/*.md` with `dot:true` and no ignore list, and neither version has a frontmatter opt-out. A leading underscore, a dot-folder, `README`, `node_modules`, `assets/` and an ignore file are all still registered, so no folder name, prefix or marker could have kept the files out. `.markdown`, `.mdx`, `.md.txt` and `.md.bak` are not scanned. `.markdown` was the readable choice, and it is the one the operator made.

The 12 files are the four under `deep/assets/compiled/`, the four under `deep/assets/legacy/`, and the four `README` files under `doctor/scripts/`, `doctor/scripts/tests/`, `scripts/` and `scripts/fixtures/`. The orchestrator did the `git mv` renames by hand because they are mechanical, and `.skilled/command-support/` is gone with no runtime mirror or symlink left pointing at it.

Every consumer followed. The deep-loop `render-command-contract.cjs` took the manifest path and the six body and contract paths, `compile-command-contracts.cjs` moved in `outputPathFor`, and the legacy projection manifest and the compile vitest moved with them. The gate-3 parity test, the `.gitignore` rule for `manifest.jsonl`, the sk-create-command `command-contract.json`, the six moved READMEs and the sk-code-skilled `command-authoring.md` checklist were updated too. The three compiled contracts were recompiled with `--command <c> --write`, and the output was byte-identical to the moved files, so the rename changed nothing a consumer reads.

The sk-doc fixtures needed care. `durable-directory-manifest.json` had its 4 old directories replaced, and `baseline-readme-verdicts.json` had only the 6 moved paths rewritten rather than regenerated: a full regeneration would have added 7 unrelated READMEs to the baseline and hidden them inside this change.

Three checks had to learn the suffix, or the moved files would have quietly lost coverage. `check-markdown-links.cjs` now walks `.markdown`, `template-phrase-lint.mjs` stages `*.markdown`, and sk-doc's `audit_readmes.py`, `test_readme_verdict_parity.py` and `validate_document.py` all recognise `README.markdown`. That last one is the delicate one: the validator classifies `readme.markdown` as `readme` before its commands-folder rule, while `.skilled/commands/create/readme.md` stays a `command`, because it really is one. Three things were deliberately left alone: the trigger index, since `.skilled/commands` is not in its corpus; comment hygiene, since it reads code comments only; and the prompt-mirror walkers, since `sync-prompts*.cjs`, `sync-runtime-mirrors.cjs` and `validate-command-references.cjs` already read only `*.md`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/deep/assets/compiled/` | Moved and renamed | `README`, `deep-ai-council.contract`, `deep-research.contract` and `deep-review.contract` now carry `.markdown` |
| `.skilled/commands/deep/assets/legacy/` | Moved and renamed | `README` and the three `.body` files now carry `.markdown` |
| `.skilled/commands/doctor/scripts/`, `doctor/scripts/tests/`, `scripts/`, `scripts/fixtures/` | Moved and renamed | The four `README` files now read `README.markdown` |
| `.skilled/command-support/` | Deleted | The old tree is gone, with nothing pointing at it |
| `.skilled/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs` | Modified | The manifest path and the six body and contract paths |
| `.skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs` | Modified | `outputPathFor` writes `.markdown` |
| `.skilled/skills/system-deep-loop/runtime/lib/legacy-projections/legacy-projection-manifest.ts` | Modified | The projection paths |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/compile-command-contracts.vitest.ts` | Modified | The expected output names |
| `.skilled/skills/system-spec-kit/runtime/tests/hooks/gate-3-menu-parity.test.mjs` | Modified | The parity fixture paths |
| `.gitignore` | Modified | The `manifest.jsonl` ignore follows its folder |
| `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` | Modified | The contract paths |
| The six `README.markdown` files | Modified | Paths, file names and the top note |
| `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/command-authoring.md` | Modified | The checklist names `.markdown` |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json` | Modified | The 4 old directories replaced |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json` | Modified | Only the 6 moved paths rewritten |
| `.skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs` | Modified | Walks `.markdown` as well |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-lint.mjs` | Modified | Stages `*.markdown` as well |
| `.skilled/skills/sk-doc/sk-create-readme/scripts/audit_readmes.py` | Modified | Recognises `readme.markdown` in either case |
| `.skilled/skills/sk-doc/scripts/tests/test_readme_verdict_parity.py` | Modified | Recognises `README.markdown` |
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py` | Modified | Classifies `readme.markdown` before the commands-folder rule |
| `specs/system-deep-loop/036-deep-loop-innovation/001-research-inputs-and-architecture/003-baseline-taxonomy-and-state-census/state-backend-census.json` | Modified | The census row `legacy-projections.test.ts` compares with the projection manifest |
| `scratch/commands-before.json`, `scratch/commands-after.json` | Created | The two versions' command lists, before and after |
| `scratch/suites-before.txt`, `scratch/suites-after.txt` | Created | The suite numbers, before and after |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Created | This phase's packet, filled from the scaffold |
| `../spec.md` | Modified | The phase map row for 055 and the 054 to 055 handoff row |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The command list was read on both versions before and after, with the battery method: v1 through `debug config` against a private data home, v2 through a private `serve`, never the shared service. Both reads came back with nothing added and nothing removed, 40 on v1 and 42 on v2. That pair is the proof the phase is judged on, because a rename is only safe if the hosts agree it changed nothing.

The tracked suites ran before and after so the result reads as a delta. Plugins 516 and 516, hook node tests 889 and 889 across 30 files, battery unit tests 51 and 51, gate-3 parity 17 and 17, and the deep-loop vitest at 2799 passed with 8 skipped both times. The first after-run had 3 deep-loop failures, all from the census row that `legacy-projections.test.ts` compares with the projection manifest; the rerun after that row was updated had 0. The sk-doc script tests passed both times. The README manifest is reproducible, the verdict parity diff is empty, the link guard found 0 broken links over 7794 files and 14204 links, and the full version battery passed 8 of 8 legs on both versions.

A separate read-only DeepSeek v4.1 flash session reviewed the change through cli-pi. Round 1 returned PASS with 2 P2s, both fixed: `audit_readmes.py`'s `readme_exists` now also accepts a lowercase `readme.markdown`, and the report scope lists `.skilled/**/README.markdown`. A narrow round 2 checked those two fixes and the census change. Luna was not used.

The push to main and CI on the pushed commit are the two tasks still open, which is why `tasks.md` leaves T017 and T018 unticked. They are ticked after the push.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Put the files back inside `.skilled/commands/` and rename them to `.markdown` | The operator's decision of 2026-10-22. It supersedes phase 004's decision 1, which chose `.skilled/command-support/`, because the operator wants everything inside `.skilled/commands/` |
| Exclude by file name rather than by folder, prefix or ignore file | The probe showed both versions scan `{command,commands}/**/*.md` with `dot:true` and no ignore list: a leading underscore, a dot-folder, `README`, `node_modules`, `assets/` and an ignore file are all still registered, and neither version has a frontmatter opt-out |
| Pick `.markdown` over `.mdx`, `.md.txt` or `.md.bak` | All four are unregistered, and `.markdown` is the one that still renders as markdown for a reader |
| Rewrite only the 6 moved paths in `baseline-readme-verdicts.json` | A full regeneration would have added 7 unrelated READMEs to the baseline and buried them inside a rename |
| Teach the link guard, the phrase lint and the three sk-doc scripts the new suffix | Otherwise the moved files would silently drop out of checks they used to pass, which is a coverage loss disguised as a green run |
| Leave the trigger index, comment hygiene and the prompt-mirror walkers alone | `.skilled/commands` is not in the trigger index's corpus, comment hygiene reads code comments only, and the mirror walkers already read only `*.md` |
| Change the deep-loop census row | `legacy-projections.test.ts` compares it with the projection manifest, so leaving it alone would have kept 3 deep-loop tests red for a path this phase renamed |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Command list, OpenCode 1.19.3 | PASS: 40 before and 40 after, nothing added and nothing removed (`scratch/commands-before.json`, `scratch/commands-after.json`) |
| Command list, OpenCode 2.0.32 | PASS: 42 before and 42 after, read through a private `serve` (`scratch/commands-before.json`, `scratch/commands-after.json`) |
| Contract recompile | PASS: `compile-command-contracts.cjs --command <c> --write` produced output byte-identical to the moved files for all three commands |
| Plugins | PASS: 516 both times (`scratch/suites-before.txt`, `scratch/suites-after.txt`) |
| Hook node tests | PASS: 889 both times across 30 files |
| Battery unit tests | PASS: 51 both times |
| Gate-3 parity | PASS: 17 both times |
| Deep-loop vitest | PASS: 2799 passed and 8 skipped both times. The first after-run had 3 failures from the census row; the rerun after the fix had 0 |
| sk-doc script tests | PASS: all passed both times |
| README manifest | PASS: `manifest=reproducible`, exclusions 21 of 21 |
| README verdict parity | PASS: `PARITY PASS`, the verdict diff is empty |
| Markdown link guard | PASS: 7794 files and 14204 links checked, 0 broken |
| Version battery, both versions | PASS: 8 of 8 legs |
| Read-only review | PASS: DeepSeek v4.1 flash through cli-pi, round 1 PASS with 2 P2s that were fixed, and a narrow round 2 on those fixes and the census change. Luna was not used |

Every number above was read from `scratch/suites-before.txt` and `scratch/suites-after.txt`, so a regression would have shown as a delta rather than as a plausible-looking figure.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The suffix is a convention the hosts happen to honour, not a contract they publish.** Both 1.19.3 and 2.0.32 scan only `.md` names today, and neither offers an ignore list or a frontmatter opt-out. A future version that widens the scan would register these 12 files again, and the command-list proof is what would catch it.
2. **The evidence is two command lists, not a per-file check.** The lists show nothing was added or removed on either version; they do not name which files exist, so a file that moved between two unlisted states would not show.
3. **The push and CI are still open.** Tasks T017 and T018 are unticked by design, so the record's CI row stays empty until the push lands.
4. **The 7 unrelated READMEs the fixture regeneration would have added are still absent** from `baseline-readme-verdicts.json`. That was the right call for this phase and remains an open gap for whoever owns the baseline next.
<!-- /ANCHOR:limitations -->

---
