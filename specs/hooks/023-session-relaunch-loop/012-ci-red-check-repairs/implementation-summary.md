---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "ci red check repairs implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/012-ci-red-check-repairs"
    last_updated_at: "2026-10-20T06:45:03Z"
    last_updated_by: "generate-context"
    recent_action: "Spec-Kit Check passed on main at 457c4ac107, run 39380190180"
    next_safe_action: "None; every repaired check passes on main"
    blockers: []
    key_files:
      - "AGENTS.md"
      - ".skilled/hooks/hook-flags.env.example"
      - "scratch/after/spec-kit-cli-project-summary.txt"
    session_dedup:
      fingerprint: "sha256:ab19e700f950004431ae3eb49f7e4ab30a90c24e0e9e4e13fba4121936f315df"
      session_id: "scaffold-012-ci-red-check-repairs"
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
| **Spec Folder** | 012-ci-red-check-repairs |
| **Completed** | 2026-10-20 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The three checks that main turned red pass again locally. AGENTS.md wording is tightened so Blast-Radius Management ends at byte 16323, back inside the 16384-byte delivery prefix Devin delivers, the SESSION_RELAUNCH_REPO_ROOT example line now shows the export its heading always described, and the two session-relaunch playbook files now carry the provenance form and wording the Spec-Kit Check tests accept. No rule was removed or weakened; AGENTS.md went from 27505 to 27202 bytes.

### Phase 12: ci-red-check-repairs

Rule Canary Sync failed because commit b3655ed3de, the phase 007 handoff gate exemptions, added the .skilled/skills/.state/ runtime-state exemption to Gates 2 and 3 and moved that section end from byte 16377 to 16626, after b830fd0276 had already left only a 7-byte margin. Eleven wording tightenings fix it: ten restate the same rule in fewer words, and one makes Gate 2 refer to the gitignored runtime state Gate 3 exempts instead of repeating the path.
The section-end bytes and file sizes per commit, the commit that added the example line, and the ~/.claude/CLAUDE.md comparison are recorded in scratch/causes.txt.

sk-doc Script Tests failed because commit d001d69fee added `# SESSION_RELAUNCH_REPO_ROOT=/absolute/path/to/repo` to .skilled/hooks/hook-flags.env.example in switch-line form, although its own heading says the file is never read for it and the value must be exported in the shell. The line now reads `#   export SESSION_RELAUNCH_REPO_ROOT=/absolute/path/to/repo   # repo root for planned handoff notes`, so the validation-switch test no longer counts it as a switch that must take effect once uncommented.

Spec-Kit Check failed because commit b830fd0276, the self-relaunching session loop, wrote two playbook provenance lines as `Provenance: <path>.` with backticks and a trailing period, a form the provenance test does not accept, and wrote "the Hermes sync manifest" in session-relaunch-command-runtimes.md, where manifest is a word the invariance test bans on public surfaces. That commit reached main through 585c90f5f7 and 47371b495f, so the check has failed on main since 47371b495f and last passed at 33d619a538. In .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/, session-relaunch-command-runtimes.md and session-relaunch-pi-opencode.md now carry `Provenance: <path>` bare and both paths exist on disk. The Hermes sentence now names .hermes/SYNC.md, which documents both steps at line 41. Neither test was changed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| AGENTS.md | Modified | 11 wording tightenings with no rule removed or weakened; section end byte 16626 to 16323, file 27505 to 27202 bytes |
| .skilled/hooks/hook-flags.env.example | Modified | The SESSION_RELAUNCH_REPO_ROOT line is now the export command its heading describes |
| .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-command-runtimes.md | Modified | The Provenance line is now the bare form and the Hermes sentence names .hermes/SYNC.md |
| .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-pi-opencode.md | Modified | The Provenance line is now the bare form the provenance test accepts |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Before evidence was captured under scratch/before and after evidence under scratch/after. The Rule canary moved from exit 1 to exit 0. The validation-switch test moved from 1 failed, 7 passed to 8 passed, and the full run-script-tests.sh suite result is recorded in scratch/after/sk-doc-script-tests.txt. The Spec-Kit Check vitest tests moved from 2 failed and 3 passed to 5 of 5 passed with exit 0 (scratch/after/spec-kit-check-vitest.txt), and the whole CLI vitest project passes 180 files with 3 skipped, 2059 tests passed and 20 skipped, exit 0 (scratch/after/spec-kit-cli-project-summary.txt).

On main, Rule Canary Sync and sk-doc Script Tests passed on e38ff13143 and cd7f160e02, while Spec-Kit Check still failed there with 2 failed, 178 passed and 3 skipped test files in its CLI vitest project.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Tighten the wording and keep every rule | Devin delivers only the first 16384 bytes of AGENTS.md, so the file must fit the prefix; ten of the 11 tightenings restate a rule in fewer words, so nothing is removed or weakened. |
| Write the example line as an export | The heading says the file is never read and the value must be exported in the shell, so the export form is the accurate example and the switch-line test passes. |
| Rewrite the playbook provenance lines bare and name .hermes/SYNC.md | The provenance test requires exactly one Provenance line per playbook file in an accepted form and rejects the backticked form with its trailing period, and the invariance test bans manifest on public surfaces. The bare form is the accepted one, both paths exist on disk, and .hermes/SYNC.md documents both steps at line 41. Neither test changes. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Rule canary check-rule-copies.js | PASS — exit 1 before and exit 0 after (scratch/exit-statuses.txt) with the section end at byte 16323 and a 61-byte margin (scratch/after/canary.txt) |
| test_validation_switch.py | PASS — 1 failed, 7 passed before (scratch/before/validation-switch.txt), 8 passed after (scratch/after/validation-switch.txt) |
| Full sk-doc script suite (run-script-tests.sh) | PASS — all sk-doc script tests passed (scratch/after/sk-doc-script-tests.txt) |
| Spec-Kit Check vitest tests (playbook provenance paths, workflow invariance) | PASS — 2 failed and 3 passed before (scratch/before/spec-kit-check-vitest.txt), 5 of 5 passed after with exit 0 (scratch/after/spec-kit-check-vitest.txt) |
| Whole CLI vitest project | PASS — 180 files passed with 3 skipped, 2059 tests passed and 20 skipped, exit 0 (scratch/after/spec-kit-cli-project-summary.txt) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **~/.claude/CLAUDE.md now differs from AGENTS.md** It mirrors AGENTS.md outside the repository, was not edited in this phase, and matched AGENTS.md before this change but differs now (scratch/causes.txt).
2. **The canary checks only the repository AGENTS.md** The delivery prefix is measured on that one copy, so this check reports no drift in any other rule copy.
3. **Spec-Kit Check needed a second repair to pass on main** It was red on main from 47371b495f. These playbook fixes made its CLI vitest step pass, which let its Runtime vitest step run for the first time since then; that step failed on 22f563b032 (run 39373558502) and was repaired in the dual-compat packet's phase 020. Spec-Kit Check then passed on main at 457c4ac107, run 39380190180.
<!-- /ANCHOR:limitations -->

---


