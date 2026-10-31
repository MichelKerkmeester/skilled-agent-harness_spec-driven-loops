---
title: "Implementation Summary"
description: "235 benchmark report READMEs now open with an overview and read in the numbered layout the template asks for, with every non-heading line they arrived with, and the repo's README checks read them as fixed rather than as drift."
trigger_phrases:
  - "benchmark report readmes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/070-repo-doc-debt/004-benchmark-report-readmes"
    last_updated_at: "2026-10-27T09:30:00Z"
    last_updated_by: "lane-e-conductor"
    recent_action: "Recorded what changed and how it was verified"
    next_safe_action: "Commit this phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "lane-e-repo-doc-debt"
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
| **Spec Folder** | 004-benchmark-report-readmes |
| **Completed** | 2026-10-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The 235 benchmark report READMEs now open with an overview, so the README validator no longer stops at them, and a reader meets the same numbered shape as in every report written since. Every line of prose and every table row inside them is the text the run left there.

### Benchmark report READMEs: restructure 235 legacy reports to the numbered template and resolve their broken references

The 235 reports sit under 13 skills and 2 Pi extensions, and all of them were written by a retired benchmark writer in a layout with no overview: a title, sometimes a derived-record line, a `>` line, a verdict line, then `## Run`, `## Files` and `## Reading This Folder`. The validator requires an overview section, so each report failed with one blocking error and nothing else. Regenerating them from their JSON records would have been cleaner and was rejected, because the renderer in the repo drops facts on records that writer left behind.

So each report was rewritten in place: separators inserted, the Reading This Folder paragraph moved up as `## 1. OVERVIEW`, `## Run` renamed to `## 2. RUN` and `## Files` to `## 3. FILES`. FILES is 3 rather than 4 because none of the 235 has a RESULTS section, and 4 is where FILES lands when one does.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `*/benchmark/reports/*/README.md` | Modified | 235 reports: 181 under cli-external-orchestration, 30 under system-spec-kit, 10 under sk-vision, 9 under sk-design, 2 under mcp-tooling, 1 under sk-prompt, 2 under the Pi extensions |
| `.skilled/skills/sk-code/benchmark/reports/2026-06-02--d4r-live--live/README.md` | Modified | Names the removed benchmark runner in words |
| 13 `*/changelog/v<next>.md` | Created | cli-claude-code 1.5.4.0, cli-codex 1.9.9.0, cli-cursor 1.5.4.0, cli-devin 1.4.8.0, cli-opencode 1.5.3.0, cli-pi 1.5.17.0, sk-design-diagram 1.2.4.0, sk-prompt 3.0.6.0, sk-vision 0.3.7.0, system-spec-kit 2.12.6.0, mcp-tooling 1.8.5.0, sk-code 3.9.4.0, sk-doc 2.3.17.0 |
| `SKILL.md`, plus `description.json`, `mode-registry.json` and `hub-router.json` on sk-doc, mcp-tooling and sk-code | Modified | Version carriers |
| 13 `.hermes/skills/*/SKILL.md` copies | Modified | Version line only |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json` | Modified | Records the 235 as valid |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A census first, then a transform, then the checks in the order they had to pass. The census read the heading sequence of every report README and confirmed all 235 shared one layout: `## Run`, `## Files`, `## Reading This Folder` in that order, no `---` line, and a one-paragraph Reading This Folder section. One file, `ux-hooks-3`, carries a two-line `>` quote; it sits in the preamble the transform does not touch.

The transform lives in the session scratch folder rather than the repo, so no new tracked code entered the tree. It refuses any file that does not match the census, and it refuses a file that already carries the new headings, which is how a second pass was proven harmless. After the pass, a checker compared each of the 235 with its HEAD revision and proved the multiset of non-heading, non-separator, non-blank lines unchanged.

Then the repo's own checks, each one a rerun rather than an inspection: the README validator over the 235, the audit over the repo, the parity test against its rebuilt baseline, and the manifest test.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Restructure in place rather than regenerate | The renderer in the repo loses facts on records the retired writer made, and these reports are the only record of runs nobody will repeat |
| Move the Reading This Folder paragraph up as the overview | It already says what the folder holds and how to read it, so it is the overview the validator asks for and no new prose had to be invented |
| Call FILES section 3 | The renderer numbers FILES 3 when a record carries no RESULTS section and 4 when it does, and none of the 235 has one |
| Rebuild the verdict baseline rather than teach the test an exception | The baseline is a record of what the validator says, and the validator really does say these are valid now |
| Leave the five `relaunch-run*.log` references as written | `*.log` is gitignored, so the paths are runtime evidence that a checkout never had; teaching the audit that lesson is another lane's change |
| Keep the transform out of the repo | It reads and writes 235 generated files once, and a one-shot script in the tree would outlive its purpose |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Transform over the census | `235 OK, 0 refused`; a rerun on a transformed file is refused |
| Line checker against HEAD | `checked=235 pass=235 fail=0`, exit 0 |
| `validate_document.py --type readme --json` over the 235 | 235 valid, 0 blocking errors, 0 warnings |
| `audit_readmes.py` | `template_invalid` 237 -> 2, both another lane's; `broken_references` 102 -> 101 |
| `test_readme_verdict_parity.py` | before the baseline rewrite `diff_entries=235`, each one a report moving from the overview error to valid; after `--write`, `PARITY PASS: verdict diff is empty` |
| `test_readme_manifest.py` | `SUMMARY: discovery=pass exclusions=21/21 manifest=reproducible`, exit 0 |
| `validate.sh --strict` on this folder | `RESULT: PASSED`, Errors: 0, Warnings: 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The transform is not in the repo.** It ran from the session scratch folder, so a future report that lands in the old layout needs a new script rather than a rerun. That is the trade: 235 generated files once, against a tracked script that would sit unused afterwards.
2. **Two READMEs stay template-invalid.** `.skilled/commands/create/readme.md` and the `sk-create-repo-rule` fixture README belong to another lane, so the audit's count does not reach zero on this change alone.
3. **Five broken references stay counted.** The two system-spec-kit session-relaunch reports name `relaunch-run*.log` evidence files that `*.log` keeps out of git, so the audit still counts them until another lane teaches it that a gitignored path is not a broken reference.
<!-- /ANCHOR:limitations -->

---
