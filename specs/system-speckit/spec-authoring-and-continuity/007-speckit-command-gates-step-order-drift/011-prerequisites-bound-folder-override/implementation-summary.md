---
title: "Implementation Summary"
description: "The speckit workflows now run check-prerequisites.sh with the bound spec folder, so the prerequisites gate passes on worktree and release branches."
trigger_phrases:
  - "prerequisites bound folder override implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift/011-prerequisites-bound-folder-override"
    last_updated_at: "2026-11-15T06:06:10Z"
    last_updated_by: "generate-context"
    recent_action: "Built and verified the phase"
    next_safe_action: "Resume /speckit:implement on agents packet 015."
    packet_purpose: "Purpose: Every speckit workflow call to `check-prerequisites.sh` checks the bound packet, so the prerequisites gate passes or fails on that packet's files, not on the branch name."
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:e30d0de3f8c5274d97c846fefcd78a87ca10094b63ee6bbd701497410d9cd5eb"
      session_id: "scaffold-011-prerequisites-bound-folder-override"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "a84f4eed-26f9-49ac-91eb-e2375c207e96"
      workspace: "/Users/michelkerkmeester/worktrees/public/384-agent-alignment-follow-ups"
      savedAt: "2026-11-15T06:06:10Z"
      locatorKind: "transcript_path"
      version: 1
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
| **Spec Folder** | 011-prerequisites-bound-folder-override |
| **Completed** | 2026-11-15 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`/speckit:implement` no longer stops at step 1 on a worktree branch. The plan, implement and complete workflows now run `check-prerequisites.sh` with `SPECIFY_FEATURE` set to the bound spec folder, so the script names the packet directly instead of reading it from the branch name, and the `prerequisites_complete` gate can pass.

### Phase 11: prerequisites-bound-folder-override

Before this change, every call ran the script bare. On any branch that is not an `NNN-` feature branch the script exits 1 with "Not on a feature branch", which blocked packet 015 on `worktrees/384-agent-alignment-follow-ups`. The script already honoured `SPECIFY_FEATURE`; the workflows just never set it. The setup README now explains the override.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/speckit/assets/speckit-implement.yaml` | Modified | Step 1 call prefixed; the `prerequisites_complete` criterion names the override. |
| `.skilled/commands/speckit/assets/speckit-plan.yaml` | Modified | Step 5 call prefixed, quoted inside its flow list. |
| `.skilled/commands/speckit/assets/speckit-complete.yaml` | Modified | Three calls prefixed. |
| `.skilled/skills/system-spec-kit/runtime/cli/setup/README.md` | Modified | Paragraph and example on `SPECIFY_FEATURE`. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

I recorded the bare call, the override call and four workflow test counts in `scratch/baseline.txt`. Then I made the six YAML edits and the README paragraph directly, and reran the same commands, a YAML parse of all three files and the old-form grep into `scratch/after.txt`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Set `SPECIFY_FEATURE` in the workflow steps, not relax the branch check in the script | The script's override path already exists and is safe; a wrong path still fails at the directory check. |
| Quote the plan item | It sits in a YAML flow sequence, where an unquoted `[` would break parsing. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Override call for packet 015 | exit 0 (bare call still exit 1) |
| Old `Run bash .../check-prerequisites` form in the three YAMLs | `rg` exit 1, none left |
| `SPECIFY_FEATURE` counts | implement 2, plan 1, complete 3, README 2 |
| `test-phase-command-workflows.js` | passed=143 failed=0 (baseline same) |
| `gate-3-menu-parity.test.mjs` | pass 17, fail 0 (baseline same) |
| `speckit-autopilot-contract.vitest.ts` | 5 passed (baseline same) |
| `yaml-intake-event-payloads.vitest.ts` | 7 passed (baseline same) |
| YAML parse, three files | ok |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The value is filled by the agent running the step.** The prefix is a placeholder, `<[SPEC_FOLDER] without its leading specs/>`, that the agent substitutes; no script derives it. A wrong substitution fails loudly at the script's directory check.
<!-- /ANCHOR:limitations -->

---


