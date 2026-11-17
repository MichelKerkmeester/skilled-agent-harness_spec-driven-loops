---
title: "Implementation Summary: research prompt pack matches the agent definition"
description: "The research prompt pack now allows the run's research.md under progressiveSynthesis and names the Recommended Next Focus heading, with a lockstep test that fails if the pack and the agent definition drift apart again."
trigger_phrases:
  - "prompt pack contract alignment"
  - "recommended next focus heading"
  - "progressive synthesis write rule"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/005-prompt-pack-contract-alignment"
    last_updated_at: "2026-11-17T20:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Pack aligned with the agent definition; seven suites pass; contract regenerated"
    next_safe_action: "Write the playbook scenario and changelog entry as @markdown, then merge into integration"
    blockers:
      - "Playbook and changelog commands require the @markdown agent"
    key_files:
      - ".skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl"
      - ".skilled/skills/system-deep-loop/runtime/tests/unit/prompt-pack.vitest.ts"
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-prompt-pack-contract-alignment |
| **Completed** | 2026-11-17, code and tests; the playbook scenario and changelog entry are blocked (see Known Limitations) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The research prompt pack now agrees with `.skilled/agents/deep-research.md` on two points. Its ALLOWED WRITE PATHS list carries one static entry for the `research.md` beside the `iterations/` folder of `{state_paths_iteration_pattern}`, allowed only when `progressiveSynthesis` is `true` in `{state_paths_config}`. That entry names no `research/research.md` literal, so a fan-out lineage writes its own `research.md`. The narrative heading list now ends in `Recommended Next Focus`, the heading the research reducer parses. A lockstep test reads both files and fails if either line goes missing.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl` | Modified | One conditional `research.md` entry in ALLOWED WRITE PATHS; `Next Focus` heading renamed to `Recommended Next Focus` |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/prompt-pack.vitest.ts` | Modified | Four cases: agent/pack lockstep, rendered pack, lineage render, reducer parse of a pack-compliant narrative |
| `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown` | Regenerated | Template digest refreshed by `compile-command-contracts.cjs --command deep/research --write` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Three one-change DeepSeek V4.1 Flash dispatches on the OpenCode Go lane (tests first, then the write-path entry, then the heading), each diff read and each check rerun by the orchestrator. The contract regeneration, the negative control and the suite runs were done natively. Briefs and results are in `scratch/dispatch/`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| The pack conforms to the agent definition; the agent is untouched | Goal D1: the agent owns the contract, so no runtime mirror sync is needed |
| The `research.md` entry is static text relative to `{state_paths_iteration_pattern}` | Goal D2: no new render variable, so both workflow YAMLs stay unchanged |
| The lockstep case reads the pack path from `DEEP_RESEARCH_PACK_TEMPLATE` when set | Lets a scratch copy of the pack stand in, which is how the drift case was shown to fail |
| The reducer-parse case lives in `prompt-pack.vitest.ts` and reads the heading list from the pack itself | Keeps the test tied to what the pack actually asks for, and keeps the diff on the four files the scope names |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Notes |
|-----------|--------|-------|
| Seven named suites | Pass | `npx vitest run` over the seven REQ-005 suites: 7 files, 89 passed, exit 0. Baseline was 85; the 4 new cases account for the difference |
| Fail before, pass after | Pass | The four new cases failed on assertions against the unchanged pack, then passed after the two template edits |
| Negative control | Pass | A scratch pack without the new entry failed the lockstep, rendered and lineage cases; a scratch pack with the old heading failed the lockstep, rendered and parse cases. Both copies were deleted |
| Contract drift | Pass | `shasum -a 256` of the pack equals the digest at the template's entry in the compiled contract; `check-contract-drift.cjs` printed `OK commands=2`, exit 0 |
| Scope (REQ-006) | Pass | `git diff --stat` lists no file under `deep-review/` and neither agent definition |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Playbook scenario not written (T009).** `/create:manual-testing-playbook` hard-blocks at its Phase 0 self-check unless it runs as the `@markdown` agent, and this phase was built by a worker that cannot start one. The scenario still has to be written through that command as `@markdown`.
2. **Changelog entry not written (T011).** `/create:changelog` carries the same `@markdown` gate.
3. **Compiled contract.** `../006-state-log-leaf-fields/` also edits the pack, so the research contract must be regenerated after each merge rather than hand-merged.
<!-- /ANCHOR:limitations -->
