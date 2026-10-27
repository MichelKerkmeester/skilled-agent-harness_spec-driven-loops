---
title: "Implementation Summary"
description: "The sk-code hub now has one contract for dropping or replacing a code rule, a hard floor written once as JSON and a linter that refuses any floor id, ready for quality and review to adopt."
trigger_phrases:
  - "shared rule contract implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/017-portable-code-modes/001-shared-rule-contract"
    last_updated_at: "2026-10-27T21:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Built the shared rule contract, its floor list and its linter"
    next_safe_action: "Land the phase, then start phases 002, 003 and 004"
    blockers: []
    key_files:
      - ".skilled/skills/sk-code/shared/references/universal/rule-overrides.md"
      - ".skilled/skills/sk-code/shared/references/universal/rule-overrides.json"
      - ".skilled/skills/sk-code/shared/scripts/check-rule-overrides.cjs"
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
| **Spec Folder** | 001-shared-rule-contract |
| **Status** | Complete |
| **Completed** | 2026-10-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A checklist can now say "drop this rule" or "use this rule instead", in a format both sk-code workflow modes will read. The rules no repository may change are written down once, and a linter refuses any section that names one.

### Phase 1: shared-rule-contract

You write a `## Rule overrides` table in a checklist a declaration already names. Each row gives a rule id, `none` or `replace: <text>` and an optional reason. The contract says which source wins when two speak to the same rule, and how quality and review record what they applied. Nothing reads the section yet, so every run behaves as before until phases 002 to 006 adopt it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-code/shared/references/universal/rule-overrides.md` | Created | The contract |
| `.skilled/skills/sk-code/shared/references/universal/rule-overrides.json` | Created | The hard floor, read by the linter |
| `.skilled/skills/sk-code/shared/scripts/check-rule-overrides.cjs` | Created | The linter |
| `.skilled/skills/sk-code/shared/scripts/tests/check-rule-overrides.test.cjs` | Created | Its suite |
| `.skilled/skills/sk-code/shared/README.md` | Modified | Indexes the new files |
| `.skilled/skills/sk-code/changelog/v3.9.7.0.md` | Created | Hub changelog entry |
| `.skilled/skills/sk-code/SKILL.md`, `description.json`, `hub-router.json`, `mode-registry.json` | Modified | Version 3.9.7.0 |
| `.hermes/skills/sk-code/SKILL.md` | Modified | Regenerated Hermes copy |
| `.github/workflows/sk-code-script-tests.yml` | Modified | Runs the shared suite in CI |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The suite ran first against a scratch copy with no linter and failed with `Cannot find module`. It then ran against the real files and passed every test. Review round 1 added a reading-path test and a machine-check test, and both failed against a scratch copy without the change. A second scratch copy added an id to the JSON alone, and the floor agreement test failed there. The quality runner, the document validator, the README reference checker, the parent-skill check and the Hermes check ran on the final state. A last step added the suite to the sk-code Script Tests workflow, which already filtered on the hub's folder and its `.opencode` twin.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The linter lives in a new `shared/scripts/` folder | Both modes call it, so neither mode's folder owns it. The sk-doc hub already keeps cross-mode scripts in its own `shared/scripts/` |
| The floor JSON allows `<class>.*` entries | A parse or secret rule added to the runner later is fixed from the start, with no edit to the list |
| A repeated id or a second section is refused | Two answers for one rule in one file leave no way to tell which the author meant |
| The heading may be numbered and upper case | Checklists that follow the numbered heading style write `## 7. RULE OVERRIDES` |
| Fenced code is skipped | The contract reference shows the section in an example, and that example must not count as an override |
| The program ADRs sit in the parent `spec.md` section 5 | The phase-parent template forbids a parent `decision-record.md`, and the predecessor packet keeps its program decisions in the same place |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .../check-rule-overrides.test.cjs` before the linter existed | FAIL as expected: pass 0, fail 1, exit 1 |
| The same suite on the final files | PASS: pass 11, fail 0, exit 0 |
| Floor drift probe (JSON gains `floor.extra`) | FAIL as expected: pass 8, fail 1, exit 1 |
| `quality-gate.cjs --format text --files` on the four new files | `gate=NO_BLOCKER_FOUND exit=0`, findings 0 |
| `validate_document.py` on the contract, the README and the changelog | 0 issues each |
| `check_readme_references.py` on `shared/README.md` | references=61 unresolved=0 |
| `parent-skill-check.cjs .skilled/skills/sk-code` | OK, all hard invariants passed, 0 warnings |
| `sync-skills-hermes.cjs --check` | PASS: 67 Hermes skill copies in sync |
| `sk-code-script-tests.yml` after the shared step was added | YAML parses, `actionlint` exit 0, `check-gate-inputs.sh` RESULT: PASSED with failures=0 |
| `validate.sh` on this folder and the parent, strict | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The compiled route for sk-code reads `stale-manifest` after the version step.** The activation manifest hashes the hub router, which now carries 3.9.7.0, so the hub serves the legacy route until the manifest is regenerated with the other derived files at landing.
2. **The linter checks grammar, not existence.** It cannot tell whether `floor.documentation` names a real rule, because phases 003 and 005 assign the overridable ids.
<!-- /ANCHOR:limitations -->
