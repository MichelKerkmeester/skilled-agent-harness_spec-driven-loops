---
title: "Implementation Summary"
description: "A repository can now switch named core comment-hygiene rules off in its quality config, and the runner, the pre-commit hook and the CI job all honor the same list, while the rules the shared contract fixes stay on."
trigger_phrases:
  - "quality hygiene policy implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/017-portable-code-modes/002-quality-hygiene-policy"
    last_updated_at: "2026-10-27T22:45:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Built commentHygiene.disableRules, the checker flag and the layer wiring"
    next_safe_action: "Review the phase, then land it"
    blockers: []
    key_files:
      - ".skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh"
      - ".skilled/skills/sk-code/sk-code-quality/scripts/lib/quality-config.cjs"
      - ".skilled/skills/sk-code/sk-code-quality/scripts/hygiene-config-flags.cjs"
      - ".skilled/scripts/git-hooks/pre-commit"
      - ".github/workflows/comment-hygiene.yml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-27-skcode-017"
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
| **Spec Folder** | 002-quality-hygiene-policy |
| **Status** | Complete |
| **Completed** | 2026-10-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A repository whose own comments carry tracker ids or model names that read as planning labels can now say which core hygiene rules it does not want, and stop being blocked by them at every layer.

### Phase 2: quality-hygiene-policy

You add `"disableRules": ["issue", "adr", "task"]` under `commentHygiene` in `.sk-code/quality.json`. The runner passes one `--disable-rule` per id to the checker and lists them in `config.hygiene.disabled`. The pre-commit hook and the CI hygiene job ask `hygiene-config-flags.cjs` for the `--disable-rule` flags alone, so a disabled rule blocks nowhere, while a ticket prefix or extra pattern still tightens the runner alone. An unknown id, or one the shared contract fixes, is `CONFIG_INVALID` before any check runs. `/doctor:sk-code quality status` names the disabled rules, and `init` in a repository with no `specs/` folder suggests the 15 spec-kit vocabulary ids without writing them.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh` | Modified | `--disable-rule`, fixed and unknown refusals, `disabled_rules` |
| `.skilled/skills/sk-code/sk-code-quality/scripts/lib/quality-config.cjs` | Modified | Key validation, merge, flag builder, rule list from the checker |
| `.skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs` | Modified | Flag plumbing and `config.hygiene` |
| `.skilled/skills/sk-code/sk-code-quality/scripts/hygiene-config-flags.cjs` | Created | Flags for pre-commit and CI |
| `.skilled/skills/sk-code/sk-code-quality/assets/quality-config.template.json` | Modified | `disableRules: []` |
| `.skilled/scripts/git-hooks/pre-commit`, `.skilled/hooks/git/pre-commit` | Modified | Read the flags |
| `.github/workflows/comment-hygiene.yml` | Modified | Read the flags |
| `.skilled/commands/doctor/scripts/sk-code-quality-config.cjs` | Modified | `status` line, `init` suggestion |
| `.skilled/skills/sk-code/sk-code-quality/references/quality-config.md`, `references/runner-contract.md`, `scripts/README.md`, `SKILL.md` | Modified | Docs and carrier 1.13.4.0 |
| Four test files beside those scripts | Modified | New cases |
| `.skilled/skills/sk-code/sk-code-quality/changelog/v1.13.4.0.md` | Created | Changelog |
| `.hermes/skills/sk-code-quality/SKILL.md` | Modified | Regenerated Hermes copy |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The baselines ran first. The new tests were then written and run against the source files at HEAD, copied back from git into the working tree, where every new case failed for the expected reason: an unknown `--disable-rule` option, an unknown config key, a commit still blocked and a missing doctor field. The final source was restored and every suite reran green. The CI run block was replayed from the workflow file in a scratch repository with no config, a valid one and an invalid one.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Pre-commit and CI honor `disableRules` | A repository that switched a rule off would otherwise still be blocked at commit, which leaves the key useless |
| A config that does not validate keeps every core rule in pre-commit and CI, with a warning | Blocking every commit on an unrelated config typo is worse than today, and running the full set is never weaker than today |
| Pre-commit and CI take only the `--disable-rule` flags | The config's additions tighten the author gate only, as before this phase. Passing them too would block a file the runner excludes and fail the checker on a pattern only the JavaScript validator accepts. Review round 1 found both and the pre-commit suite now pins them |
| The rule names come from the checker's own table | A second list in JavaScript would drift. A test pins 21 names, 15 spec-kit and 6 tracker ids |
| The fixed ids come from `rule-overrides.json` through `loadContract`, and the checker reads the same file | The contract owns the floor, and no copy of it is kept here |
| An id may be bare or carry the `hygiene.` class | Findings and the override contract name rules as `hygiene.<rule>`, and the brief writes them bare |
| `init` suggests the 15 ids without writing them | Switching a blocking rule off is a choice the repository makes, so init shows the list and the reason and leaves the file at `[]` |
| The post-edit hook is not wired | It warns and never blocks, and its resolver is documented as side-effect free. A disabled rule can still appear there as a warning |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test` on the three new `disableRules:` cases, source at HEAD | FAIL as expected: pass 0, fail 3 |
| `check-comment-hygiene.test.sh`, checker at HEAD | FAIL as expected: 7 cases failed, exit 1 |
| `pre-commit.test.sh`, hooks at HEAD | FAIL as expected: 146 passed, 3 failed |
| Doctor suite, the two new cases, script at HEAD | FAIL as expected: pass 0, fail 2 |
| Quality node suite, final | PASS: tests 127, pass 127, fail 0 (baseline 123) |
| Checker, ceiling, typo-flag and post-edit adapter bash suites, final | PASS, each prints its pass line, exit 0 |
| `pre-commit.test.sh`, final | PASS: 152 passed, 0 failed (baseline 145) |
| Review round 1 tests on the pre-fix helper | FAIL as expected: helper test pass 0 fail 1, pre-commit 150 passed 2 failed |
| CI run block replayed with `{ticketPrefixes, exclude}` and with `extraPatterns: ["(?<=a+)b"]` | `All clear`, exit 0 each, the HEAD result |
| Doctor suite, final | PASS: pass 11, fail 0 (baseline 9) |
| Doctor, shared, post-edit router and setup-check suites | PASS: pass 52, fail 0 |
| Whole-tree hygiene in this repository | 0 lines |
| `comment-hygiene.yml` | YAML parses, `actionlint` exit 0, `check-gate-inputs.sh` RESULT: PASSED |
| `quality-gate.cjs --format text --worktree` | `gate=NO_BLOCKER_FOUND exit=0`, findings 0 |
| `validate_document.py` on the changelog, two references, scripts README and SKILL.md | 0 issues each |
| `sync-skills-hermes.cjs --check` | PASS: 67 Hermes skill copies in sync |
| `validate.sh` on this folder, strict | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The pre-commit hook reads the working-tree config.** A `disableRules` change applies to the commit that stages it, even when the change itself is not staged.
2. **The config's other hygiene keys reach the runner alone.** `ticketPrefixes`, `extraPatterns`, `extensions` and `exclude` change the runner's verdict only, so a ticket prefix can fail locally and pass on push, and a file the runner skips is still checked against the core set at commit and in CI.
3. **The write-time warning applies every core rule.** It never blocks.
4. **`/doctor:sk-code setup` reports one failing drift guard.** Check 1b names `shared/references/universal/rule-overrides.md` as a routable doc no router names. That file came from phase 001 and this phase does not touch it.
<!-- /ANCHOR:limitations -->
