---
title: "Implementation Summary"
description: "Built, with the sandbox cases still to rerun: a new phase parent now carries its Problem Statement and Purpose as value tokens under a v2.3 stamp, so the validator warns in a Draft and fails the parent once it leaves Draft with the purpose unfilled."
trigger_phrases:
  - "parent purpose scaffold implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/001-parent-purpose-scaffold"
    last_updated_at: "2026-11-13T23:44:14Z"
    last_updated_by: "markdown-agent"
    recent_action: "Built 2026-11-14 by a DeepSeek Harness worker and gated. Sandbox cases not rerun"
    next_safe_action: "Rerun the six open sandbox tasks"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/create.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-parent-purpose-scaffold"
      parent_session_id: null
    completion_pct: 85
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
| **Spec Folder** | 001-parent-purpose-scaffold |
| **Completed** | 2026-11-14 (built and gated, six sandbox checks still open) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

A new phase parent now reaches its author with Problem Statement and Purpose as `[YOUR_VALUE_HERE: ...]` tokens. The validator warns while the parent is a Draft and fails it at any other status until the purpose is written.

### Phase 1: parent-purpose-scaffold

The template stamp and its manifest entry moved from `v2.2` to `v2.3`, which is the lowest stamp that turns the token gate on. The four dead generic-text lines are gone from `create.sh`. The parent's `recent_action` default now reads `Phase parent created, child phases own continuity`, so a finished parent no longer fails `SCAFFOLD_NEVER_TOUCHED` on its own frontmatter. The operator decided on 2026-11-14 to fix that default too, and the plan was amended before the build. Two test assertions guard the result: the new parent's Purpose is still a token and its `recent_action` default does not read as a scaffold placeholder.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl` | Modified (+4 -4) | Stamp `v2.3`, two value tokens, new `recent_action` default |
| `.skilled/skills/system-spec-kit/templates/spec-kit-docs.json` | Modified (+1 -1) | Manifest version `v2.3` for the phase-parent template |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | Modified (+0 -4) | Deleted the two generic-text definitions and the two substitutions |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap` | Modified (+4 -4) | Snapshot follows the template |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts` | Modified (+8 -0) | Purpose-token assertion and parent-default assertion |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

On 2026-11-14 one DeepSeek Harness worker (`dsh --profile headless`, LLM Gateway `deepseek-v4.1-flash-1017` at max) applied the plan's literal edits in worktree 371. It exited 0 with a `completed` final event and ran no builds or tests. Its handback was a claim, so the orchestrating session checked the files itself. It found the replacement text present in 9 of the plan's 10 blocks. The tenth is an intermediate text that a later step of the same plan replaces. It built the runtime and the cli (both exit 0) and reran the gates. Nothing is committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Tokens in the template, not a new validator check | The token gate already warns in a Draft and errors after it. Two template lines reuse it |
| Stamp `v2.3`, not `v2.4` | `v2.3` turns on the token gate. `v2.4` adds only a spec-core check |
| Delete the four generic-text lines in `create.sh` | They no longer fire and they would fill the purpose again if a token ever matched them |
| Change the parent's `recent_action` default, not the scaffold rule | Operator decision, 2026-11-14. Nothing rewrites that line on a parent, and keeping the rule keeps the `scaffold/` pointer failing an untouched parent marked Complete |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

Before is `gates-371-baseline.txt`, taken before any edit. After is `gates-371-final.txt`, taken after all five builds.

| Check | Before | After |
|-------|--------|-------|
| Four scaffold vitest files | `Test Files  4 passed (4)`, `Tests  99 passed (99)` | `Test Files  4 passed (4)`, `Tests  99 passed (99)` |
| `bash -n create.sh` | exit 0 | exit 0 |
| Generic parent text in `create.sh` | 4 lines present (the diff deletes 4) | `rg -c` exits 1, none left |
| Template Problem Statement and Purpose lines | plain `[One-paragraph ...]` hints | `sed -n 66p` and `69p` print the two `[YOUR_VALUE_HERE: ...]` tokens |
| Snapshot lines | old stamp, hints and default | `grep -c` prints 3 for stamp and tokens, 1 for the new default and 0 for the old one |
| Two test assertions | absent | `grep -c` prints 1 for each |
| Files changed outside `specs/` | none | exactly the five above |
| Sandbox cases: untouched parent in Draft, purpose filled at In Progress, purpose filled at Complete | run by the planning agent before the build | Not rerun after the build |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **The sandbox cases were not rerun after the build.** The three cases (untouched parent, purpose filled at In Progress, purpose filled at Complete) ran in the planning agent's sandbox before the build only. Tasks T013, T014, T015, T021, T022 and T023 stay open. Rerun the `plan.md` section 5 sandbox to close them.
2. **Existing parents are not covered.** The 103 live parents keep their in-file `v2.2` stamp, and the 5 with the generic sentence keep it. `spec.md` Open Questions lists those 5 as a follow-up.
<!-- /ANCHOR:limitations -->

---
