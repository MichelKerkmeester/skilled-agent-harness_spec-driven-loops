---
title: "Implementation Summary"
description: "All 25 findings of the v4.0.0.11 conformance review are fixed: the sk-git package check passes again, six docs clear the voice-rule scan, and three setup-check probes now fail closed under test."
trigger_phrases:
  - "review remediation implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/033-git-setup-customization/007-review-remediation"
    last_updated_at: "2026-10-16T07:06:01Z"
    last_updated_by: "generate-context"
    recent_action: "Fixed all 25 review findings plus three second-review findings"
    next_safe_action: "Review the diff and commit the phase when ready"
    blockers: []
    key_files:
      - ".skilled/skills/sk-git/SKILL.md"
      - ".skilled/commands/doctor/scripts/git-setup-check.cjs"
      - ".skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs"
      - ".skilled/commands/doctor/git.md"
      - ".skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md"
    session_dedup:
      fingerprint: "sha256:b821ad6324a62d68b2cb77ad0dc68f27d468339ff899c235cb36ee78e4cbd1b6"
      session_id: "scaffold-007-review-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
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
| **Spec Folder** | 007-review-remediation |
| **Completed** | 2026-10-16 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The documented sk-git release check passes again, at 4,990 words against the 5,000 limit. Every doc the review named clears the voice-rule hard-blocker scan, and the setup battery no longer reports PASS for a probe it never ran, a hook git would skip, or an adapter that only mentions its handler.

### Phase 7: review-remediation

All 25 findings in `../006-release-conformance-review/review/review-report.md` were re-read against the code, and all 25 held. None was rejected. F-08 needed care: `sk-create-command/SKILL.md` Step 7 puts the input gate before all other content, while `assets/command-router-template.md` shows it after the H1. Moving the gate to directly after the frontmatter meets both, because it still precedes ROUTER CONTRACT.

Two fixes went past the cited line because the finding named a class. Playbook section 8 carried the same stale range as section 13, and the catalog leaf `workflow-playbooks/doctor-git-settings.md:29` carried the same bare status line as the root README. The SKILL.md playbook census (F-10) was removed rather than updated: the playbook index already declares itself the only inventory, and a restated count is what went stale.

A coordinator request added one item: `doctor-git-setup.yaml:48` told every runtime to pass `--tool`, and `--tool hermes` exits 2. It now passes the flag only for the six runtimes the battery accepts.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-git/SKILL.md` | Modified | Word limit, playbook pointer and command, HVR punctuation (F-01, F-10, F-11, F-12) |
| `.hermes/skills/sk-git/SKILL.md` | Regenerated | Hermes mirror |
| `.skilled/skills/sk-git/manual-testing-playbook/manual-testing-playbook.md` | Modified | Category list, ranges and counts, wave plan, HVR (F-13 to F-16) |
| `.skilled/skills/sk-git/feature-catalog/feature-catalog.md` | Modified | Section 3 heading, DEGRADED, HVR (F-18 to F-20) |
| `.skilled/skills/sk-git/feature-catalog/workflow-playbooks/doctor-git-settings.md` | Modified | Status-line counters (F-25) |
| `.skilled/skills/sk-git/scripts/hooks/README.md` | Modified | HVR (F-21) |
| `.skilled/skills/sk-git/README.md` | Modified | Reaper row (F-17) |
| `.skilled/commands/README.txt` | Modified | Two semicolons (F-22) |
| `.skilled/commands/doctor/assets/doctor-git-presentation.txt` | Modified | Four semicolons (F-06) |
| `.skilled/commands/doctor/assets/doctor-git-setup.yaml` | Modified | `--tool` only for supported runtimes (coordinator request) |
| `.skilled/commands/doctor/git.md` | Modified | Description, `--target` binding, gate placement (F-05, F-07, F-08) |
| `.skilled/commands/doctor/scripts/README.md` | Modified | Test coverage claim (F-09) |
| `.skilled/commands/doctor/scripts/git-setup-check.cjs` | Modified | Allowlist UNKNOWN, hook execute bit, adapter registration shape (F-02, F-03, F-04) |
| `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` | Modified | Three tests, 44 to 47 |
| `.skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md` | Modified | Names `/doctor:sk-code` (F-23) |
| `README.md` | Modified | Verdict set, repair wording, status counters (F-24, F-25) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek v4.1 Flash at max thinking, through cli-pi, made every edit outside the spec folder in 37 dispatches, one change each. Each target was backed up first, and each diff was read before the next dispatch. Punctuation passes were also checked by a script that compares every inline code span before and after. Every code fix started with a test that failed on the old script for the stated reason, then a mutation check reverted each part of the fix and confirmed the test failed again.

GPT-6 Luna at max effort reviewed the final diff read-only. It reported three findings, and all three held on a re-check. Section 8 holds seven scenarios, so the "10" written in dispatch 6 was wrong and went back to 7. The gates row prints one repair for all saved-off gates, so "for each saved-off gate" became "for each failing or degraded check". An event bound to a literal, such as `{ 'tool.execute.before': false }`, still read as registered, so the matcher now rejects a literal in the handler position.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Remove the SKILL.md scenario census instead of updating it | The playbook index names itself the only inventory, so a second count goes stale again |
| Replace the Feature Catalog paragraph in SKILL.md with a pointer | It repeated the catalog and named a pre-push naming hook the catalog records as removed, and the cut kept the word count under the limit |
| An unrunnable allowlist probe returns UNKNOWN, not FAIL | UNKNOWN is the battery's verdict for a check it could not determine, and it exits 3 |
| A non-executable hook adds a `chmod +x` detail and keeps the existing repair | The detail names the exact file, and the installer's repair also sets the bit |
| Accept DeepSeek's change to the briefed regex in dispatch 37 | The briefed lookahead let `\s*` backtrack to zero width and still matched `false`. DeepSeek moved `\s*` inside the lookahead, and a direct test confirmed it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `package_skill.py .skilled/skills/sk-git --check` | PASS, 4,990 words (baseline FAIL, 5,038) |
| Doctor runner `run-all.sh` | 7 of 7 suites, node 332 of 332, vitest 18 of 18 (baseline node 329 of 329, vitest 18 of 18) |
| `git-setup-check.test.cjs` | 47 of 47 (baseline 44 of 44) |
| Battery against this repository | `STATUS=OK checks=11` with `--tool claude`, `opencode` and `pi` |
| Mutation checks | F-02 guard removed: fails. F-03 probe removed: fails. F-04: no comment stripping, bare import, bare OpenCode event, bare Pi event and literal exclusion reverted each fail |
| `hvr_scan.py` on every touched doc | 0 hard blockers each |
| `validate_document.py` on every touched markdown doc | 0 issues each, typed for the playbook, catalog and command |
| `validate-playbook-package.cjs --package sk-git` | PASS, 46 scenarios, 9 categories |
| `validate_catalog_package.py` for sk-git and system-spec-kit | PASS, 0 violations each |
| `route-validate.sh` | OK, 14 routes, 2 warnings (same as baseline) |
| `command-catalog-mirror-check.cjs` | STATUS=OK |
| `sync-runtime-mirrors.cjs --check` | PASS, 185 mirrors |
| `sync-skills-hermes.cjs --check` | PASS, 68 copies |
| `run-all-drift-guards.sh` | 1 guard fails, 16 errors, identical to baseline and all in the 035 packet's review evidence copy. None in this phase's files |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The adapter check is a pattern match, not a parser.** An unused object that binds the event to a function, or a `.on('tool_call', fn)` on an object other than the Pi extension API, still reads as registered. The code comment states this.
2. **Adjacent defects, recorded and not fixed.** `.skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` has no test and belongs to the 035 packet. The header that `sync-skills-hermes.cjs` writes into all 68 Hermes mirrors carries two semicolons, so `.hermes/skills/sk-git/SKILL.md` shows 2 HVR hard blockers that this phase cannot fix without editing the generator.
3. **sk-create-command disagrees with itself on gate placement.** `SKILL.md` Step 7 and `references/argument-hints-and-modes.md:49` say the gate comes immediately after the frontmatter, and `assets/command-router-template.md` shows it after the H1. The template comment should say "immediately after the frontmatter, before the H1", to match Step 7.
<!-- /ANCHOR:limitations -->

---
