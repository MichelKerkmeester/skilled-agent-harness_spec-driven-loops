---
title: "Implementation Summary"
description: "The doctor git check now accepts a host hook that hands over to a Skilled hook source and a hook the host declares omitted. A host that wraps the shipped hooks no longer fails the hooks row for that wrapper."
trigger_phrases:
  - "doctor host hook acceptance implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-git/commit-standards/008-doctor-host-hook-acceptance"
    last_updated_at: "2026-11-13T20:00:00Z"
    last_updated_by: "orchestrating-session"
    recent_action: "Built and verified, nothing committed"
    next_safe_action: "Commit when the operator asks"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/git-setup-check.cjs"
      - ".skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs"
      - ".skilled/commands/doctor/assets/doctor-git-setup.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-doctor-host-hook-acceptance"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-doctor-host-hook-acceptance |
| **Completed** | 2026-11-13 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The hooks row of `git-setup-check.cjs` accepts a host hook that carries exactly one line `# skilled-hook-handover: <dir>`. Its `<dir>/<hook name>`, resolved from the hook file's real folder, must be an accepted hook source and the body must carry an `exec`. A hook listed in the local `git config skilled.omitHook` may be absent.

### Let the doctor git check accept a hand-over hook and a hook the host declares omitted

A host that wraps a shipped hook in its own script used to fail the hooks row with `not a hook source`. Now the wrapper passes when it names its target in the marker line and runs it. A passing row names both the hand-over hooks and the omitted ones, so the verdict stays readable. A host `pre-commit` that replaces the hook and never hands over still fails.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/git-setup-check.cjs` | Modified | New `handoverTarget` and `omittedHooks` helpers and the hooks loop |
| `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` | Modified | `linkOwnHooks` helper and three hooks cases |
| `.skilled/commands/doctor/assets/doctor-git-setup.yaml` | Modified | The hooks sentence names the hand-over marker and `skilled.omitHook` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

An Opus agent planned the edits from a decided design. A DeepSeek worker (`dsh --profile headless`, LLM Gateway route) applied them from the literal text in `plan.md`. The orchestrating session read the diff, added the hooks sentence in `doctor-git-setup.yaml` and reran the gates in the worktree. Nothing is committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Accept a hand-over marker line, not any wrapper | The marker names the target, so the check can resolve it and confirm it is an accepted hook source |
| Allow a hook named in local `skilled.omitHook` to be absent | A host that drops one hook on purpose declares it in its own config and the row says so |
| A passing row names both | An operator reading a green row can see which hooks were handed over or omitted |
| Update the hooks sentence in `doctor-git-setup.yaml` | The orchestrating session added this edit beyond the plan so the command text matches the new check. It is a deviation from `plan.md` |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` | Before 80 of 80. After 83 of 83, exit 0 |
| `node .skilled/commands/doctor/scripts/git-setup-check.cjs` in this worktree | The hooks row fails with seven `not a hook source` lines, before and after. A worktree's hooks resolve to the main checkout's hook source and this work did not change that |
| `node --test .skilled/bin/tests/` | Before 180 tests, 179 pass, 0 fail, 1 skipped. After 182 tests, 181 pass, 0 fail, 1 skipped, exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The marker check is a text check.** It does not prove the script runs the target. A host `pre-commit` that replaces the hook and never hands over still fails.
2. **It was not run inside the real host repository.** The host must add the marker line and the `skilled.omitHook` config value, then run the doctor there.
<!-- /ANCHOR:limitations -->

---


