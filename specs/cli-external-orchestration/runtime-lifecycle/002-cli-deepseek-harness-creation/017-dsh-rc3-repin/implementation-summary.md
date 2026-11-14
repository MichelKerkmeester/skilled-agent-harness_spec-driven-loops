---
title: "Implementation Summary"
description: "dsh is pinned to 0.2.2-rc.3 at all 15 sites, and every re-pin runbook probe completed on rc.3, so guarded dispatches run on the release this machine has."
trigger_phrases:
  - "dsh rc3 repin implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/017-dsh-rc3-repin"
    last_updated_at: "2026-11-14T17:00:48Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Re-pinned dsh to 0.2.2-rc.3 and ran probes T004 to T008"
    next_safe_action: "None; the phase is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-017-dsh-rc3-repin"
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
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 017-dsh-rc3-repin |
| **Completed** | 2026-11-14 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

A dsh dispatch now passes the pin check on 0.2.2-rc.3, the release on PATH. Before this phase every guarded dispatch named 0.2.2-rc.1, so the guard and the fan-out runner refused the binary this machine runs first.

### Phase 17: dsh-rc3-repin

You can dispatch dsh on either route without reinstalling rc.1. The guard refuses rc.1 now, as it refuses any other version. LLM Gateway and OpenCode Go both completed on rc.3, the workspace sandbox still refuses a write under your home folder, and one deep-research lineage ran clean through the fan-out runner.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs`, its test and `README.md` | Modified | The guard pin, with rc.1 added to the refused versions |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` and its shim, stubs and live contract | Modified | The fan-out pin |
| `cli-deepseek-harness/hard-rules.json`, `SKILL.md`, `README.md`, `assets/prompt-templates.md`, `manual-testing-playbook/manual-testing-playbook.md` | Modified | The pin and the verified-on lines |
| `cli-deepseek-harness/references/cli-reference.md` and `providers-and-models.md` | Modified | The version pin table, integrity, dist-tags and the Gateway verified row |
| `scratch/measured-before.txt`, `scratch/probes/`, `research/fanout-rc3/` | Created | The pin capture and the probe evidence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

The PATH dsh and the registry integrity were recorded first. The code and test pins moved next, and both test sets ran. Probes T004 to T007 then ran on rc.3 with fresh `DSH_HOME` folders, and T008 ran one lineage through `fanout-run.cjs`. The verified-on lines moved last, once every probe had passed. The work is on worktree branch `worktrees/388-dsh-rc3-repin`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Pin rc.3 although `latest` still names rc.1 | Operator decision of 2026-11-14. The rule pins a literal version and integrity, never a tag |
| Change only version lines in the six files the Mistral session also edits | Operator decision of 2026-11-14, so its uncommitted edits merge without a conflict |
| Move the verified-on lines only after the probes | A route is stated as verified on a release only when its probe completed on that release |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| `node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | PASS. tests 47, pass 47, fail 0 |
| vitest `tests/unit/fanout-run.vitest.ts` and `tests/unit/combo-matrix.vitest.ts` | PASS. 185 passed, exit 0 |
| T004 LLM Gateway, T005 OpenCode Go | PASS. Exit 0, final `completed` |
| T006 boundary probes | inside.txt created. Home write refused by the dsh file sandbox, no file landed. OS temp write landed. `echo ok` ran |
| T007 maximum reasoning | No `UNSUPPORTED_REASONING_EFFORT` in stderr with `reasoningEffort: max` |
| T008 lineage | Exit 0, `FANOUT_LINEAGE_COMPLETE:dsh-rc3`, 0 containment advisories, 9 cited sources in the iteration |
| `~/.dsh` listing and credential scan | `~/.dsh` unchanged. Neither key value appears in the packet |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **rc.3 is a prerelease on the `next` tag.** The probes cover the two routes, the sandbox, maximum reasoning and one lineage, nothing else. Revert this phase and reinstall rc.1 if rc.3 misbehaves elsewhere.
2. **The OS temp folder stays writable.** `workspace-write` allowed a write under the OS temp folder, as on rc.1, so it is not full confinement.
3. **The OpenCode Go row and the live contract still describe that route as proven on 2026-11-07 and as configured.** This phase changed only version lines in shared files, so the T005 result on rc.3 is recorded here and not in those rows.
<!-- /ANCHOR:limitations -->

---


