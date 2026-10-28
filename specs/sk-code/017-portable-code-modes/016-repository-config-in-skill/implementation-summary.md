---
title: "Implementation Summary"
description: "The CI profile and the quality config now live inside the skill folder that reads them, a repository field keeps a copy from applying in the wrong repository, and a file left at the old root path is refused with the move."
trigger_phrases:
  - "repository config in skill implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/017-portable-code-modes/016-repository-config-in-skill"
    last_updated_at: "2026-10-28T05:58:48Z"
    last_updated_by: "implementer"
    recent_action: "Filled the packet with the implementation and its observed verification"
    next_safe_action: "Conductor reviews and commits the packet"
    blockers: []
    key_files:
      - ".skilled/skills/sk-code/shared/scripts/lib/repository-identity.cjs"
      - ".skilled/commands/doctor/scripts/lib/ci-profile.cjs"
      - ".skilled/skills/sk-code/sk-code-quality/scripts/lib/quality-config.cjs"
      - ".skilled/skills/sk-code/sk-code-ci/repository/ci.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "repository-config-in-skill-implementer"
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
| **Spec Folder** | 016-repository-config-in-skill |
| **Status** | Complete |
| **Completed** | 2026-10-28 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The CI profile and the quality config now live inside the skill folder that reads them, so a repository installs the skills and gets the settings without carrying a root folder the skills did not own. A `repository` field makes a copy apply only where it was written for, and a file left at the old root path is refused with the move.

### Repository config inside the owning skill folder

`shared/scripts/lib/repository-identity.cjs` reads which repository a checkout is: `GITHUB_REPOSITORY` when it matches `owner/name`, the origin remote otherwise, through one parser for https, ssh and scp-like URLs. A missing or malformed remote is an unknown repository rather than a failure.

`ci-profile.cjs` reads `repository/ci.json` from the `sk-code-ci` packet, or the same path under `.opencode/`, and keeps the existing order: `--profile`, the file-scoped `skcode.ciProfile`, the committed file, then the generic default. `quality-config.cjs` does the same for `repository/quality.json` in the `sk-code-quality` packet and points `init` at that path. Both loaders validate an optional `repository` field and, when a committed file names another repository, return the default with an `ignored` object holding the path, the declared repository and the current one. The report and toggle JSON carry the field, the report's profile line carries a suffix, the scaffold writes a stderr note, and the quality loader returns source `none`. A file left at `.sk-code/ci.json` or `.sk-code/quality.json` is refused with its own code and the path to move it to; the CI routes and the quality gate exit 3 with it, the doctor prints the same move as a config error, and the gate reports `CONFIG_LEGACY_LOCATION` with its own repair line.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-code/shared/scripts/lib/repository-identity.cjs` | Created | Remote normalization, the current identity and the match rule |
| `.skilled/skills/sk-code/shared/scripts/tests/repository-identity.test.cjs` | Created | Nine cases over URL shapes, the environment, the remote and the match |
| `.skilled/commands/doctor/scripts/lib/ci-profile.cjs` | Modified | Skill-folder path and `.opencode/` twin, `repository` field, `ignored` result, legacy refusal |
| `.skilled/commands/doctor/scripts/ci-report.cjs`, `ci-toggle.cjs`, `ci-scaffold.cjs` | Modified | Carry `ignored` into JSON, the profile line and the stderr note |
| `.skilled/skills/sk-code/sk-code-quality/scripts/lib/quality-config.cjs` | Modified | Skill-folder path and init target, `repository` field, `ignored` result, legacy refusal |
| `.skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs`, `hygiene-config-flags.cjs` | Modified | Own code and repair line for the legacy refusal, follow the loader |
| `.skilled/skills/sk-code/sk-code-ci/repository/ci.json` | Moved | This repository's profile, now with its `repository` field; the root `.sk-code/` folder is gone |
| `.skilled/commands/doctor/**`, `.skilled/commands/README.txt` | Modified | Doctor commands, routes, presentations and workflow assets name the new path |
| `README.md`, `.skilled/skills/sk-code/README.md`, `ROUTER.md`, `hub-router.json`, `mode-registry.json`, `description.json` | Modified | Root and hub docs name the new path and the field |
| `.skilled/skills/sk-code/shared/references/**`, `feature-catalog/**`, `manual-testing-playbook/**` | Modified | Shared references, catalog and playbook name the new path |
| `.skilled/skills/sk-code/sk-code-ci/**`, `sk-code-quality/**`, `sk-code-review/**` | Modified | READMEs, references, playbooks and fixtures name the new path |
| `.skilled/skills/sk-doc/sk-create-readme/scripts/check_readme_references.py` | Modified | The checker resolves the new on-demand path and allows the two old paths only to describe the move |
| Five `changelog/` entries and their `SKILL.md` carriers | Created, Modified | Hub 3.9.15.0, ci 1.1.7.0, quality 1.13.9.0, review 1.9.8.0, create-readme 1.3.7.0 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The baseline report was saved before any edit. The identity module landed with its suite, then each loader moved with its cases, then this repository's profile moved and the root folder was deleted. The docs sweep followed, then the five changelogs and their carriers. Every suite ran from the worktree at the end: the nine identity cases, the five CI suites at 73 of 73, the combined quality, doctor-quality, shared and CI run at 270 of 270, the pre-commit hook suite at 152 of 152, the rule canary suite and the README checker self-test. The report was rerun to show the profile path and nothing else changed.

A fresh read-only review then returned three P1 and four P2 findings, all fixed in the same lane. A quality config that starts with a byte-order mark was read as having no `repository` field and was applied; the field is now read after the mark is stripped. The quality gate and the doctor named no ignored file; both now print it. With an ignored CI profile the toggle lost its protected-workflow confirmation without a word; it now prints the ignored line and refuses to switch a workflow off until the profile is fixed or named. An invalid `repository` value in the CI profile is now a validation error, a path inside `.sk-code/` is refused even when `--profile`, `--config` or git config names it, a remote with no user part (`github.com:owner/name`) is read, and the identity lookup runs git with the environment its caller passed. The doc-claims guard accepts the skill-folder `quality.json` before a command writes it, and the doctor reports a legacy file as `CONFIG_LEGACY_LOCATION`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The settings live in the owning skill folder, not a root `.sk-code/` folder | The skill folder ships to every repository, so the file that describes a repository travels with the mode that reads it, and a reader finds both in one place |
| The `repository` field is optional | A repository that writes its own file should not have to name itself twice, and an absent field keeps the old applies-everywhere behavior |
| A mismatch is reported as `ignored` rather than skipped in silence | A reader who sees the default needs to know why, and the object names the file, the declared repository and the current one |
| A file at the old root path is refused, not read | A stale root copy would otherwise keep applying while the new file says something else, and two sources would disagree without a word |
| A path named with `--profile` or `--config` stays trusted, unless it sits inside `.sk-code/` | The operator chose it, and checking it against the field would make a deliberately chosen file unusable in a foreign checkout; the root folder is refused on every path, because no repository keeps its settings there |
| An ignored CI profile makes the toggle refuse `off` | The default profile protects nothing, so switching a workflow off while the real profile is ignored would skip the second confirmation the repository asked for |
| `GITHUB_REPOSITORY` is read before the origin remote | CI sets the canonical `owner/name`, while a local clone has no such variable, and both paths go through one parser so the comparison has one spelling |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `repository-identity.test.cjs` | `tests 9 pass 9 fail 0`, exit 0 |
| Five CI suites | `tests 73 pass 73 fail 0`, exit 0 |
| Combined quality, doctor-quality, shared and CI suites | `tests 270 pass 270 fail 0`, exit 0 |
| Pre-commit hook suite | `pre-commit gates: 152 passed, 0 failed`, exit 0 |
| Rule canary suite | `All rule-canary test cases passed`, exit 0 |
| README checker self-test | `SELF-TEST PASS`, exit 0 |
| `ci-report.cjs --no-gh --json` | `"path": ".skilled/skills/sk-code/sk-code-ci/repository/ci.json"`, `"workflowCount": 32`, `"errors": []` |
| A legacy file through each loader | `PROFILE_LEGACY_LOCATION` and `CONFIG_LEGACY_LOCATION`, each with its move target |
| A committed foreign file through the loader | `{"source":"default","path":null,"ignored":{"path":"…/repository/ci.json","repository":"someone/else","current":null}}` |
| After the review fixes: every suite under the doctor, quality, shared and skilled test folders | `tests 765 pass 765 fail 0`, exit 0 |
| After the review fixes: pre-commit hook suite and setup battery | `pre-commit gates: 152 passed, 0 failed`; `STATUS=OK legs=9` |
| `node --check` on the five changed scripts | all five OK |
| Spec ids over the changed scripts | no hit |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **This repository has no `quality.json` yet.** Child 012 creates it, so `/doctor:sk-code quality` reads source `none` here until then.
2. **A fork's checkout reads the fork's identity.** A committed file written for upstream is ignored when the origin remote names the fork; set `GITHUB_REPOSITORY` or name the file with `--profile`/`--config` to read it.
3. **The `repository` field is optional.** A copy that omits it still applies in every repository, so a repository that ships a file and wants it limited must add the field.
4. **Historical changelog entries keep the old path.** They record what shipped at the time and are not rewritten.
<!-- /ANCHOR:limitations -->

---
