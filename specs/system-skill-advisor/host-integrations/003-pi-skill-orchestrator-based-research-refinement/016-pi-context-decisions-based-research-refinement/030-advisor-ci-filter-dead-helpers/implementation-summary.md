---
title: "Implementation Summary"
description: "A change to the advisor hooks alone now runs the advisor test suite in CI, and four advisor helpers that nothing in production called are gone with their tests and doc rows."
trigger_phrases:
  - "advisor ci filter dead helpers implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/030-advisor-ci-filter-dead-helpers"
    last_updated_at: "2026-11-24T18:44:39Z"
    last_updated_by: "generate-context"
    recent_action: "Advisor changelog v2.0.5.0 aligned with template, landed 582d2f3814c"
    next_safe_action: "None; packet complete"
    packet_purpose: "Purpose: A hooks-only change runs the advisor suite in CI, and no advisor code or doc names a helper that production never calls."
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/changelog/v2.0.5.0.md"
      - ".skilled/skills/sk-git/changelog/v1.11.15.0.md"
    session_dedup:
      fingerprint: "sha256:f910f9311d1dfd6d72dc0f15dc250c6b3ad13e12d8c8a17edfbb00363f36f32d"
      session_id: "scaffold-030-advisor-ci-filter-dead-helpers"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "0b81ad2f-04a7-4ad7-b174-0b3f9930b833"
      workspace: "/Users/michelkerkmeester/MEGA/Development/Skilled"
      savedAt: "2026-11-24T18:44:39Z"
      locatorKind: "transcript_path"
      version: 1
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
| **Spec Folder** | 030-advisor-ci-filter-dead-helpers |
| **Completed** | 2026-11-24 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A pull request that touches only `system-skill-advisor/hooks/` now runs the advisor default suite, so the Pi budget parity test guards the file it was written for. Four helpers with no production caller are gone: `lib/compat/redirect-metadata.ts`, `lib/lifecycle/rollback.ts`, `sanitizeEnvelopeSkillLabel` and `filterDefaultRoutable`. No doc or test still describes them as live.

### Run the advisor suite on hook-only changes and delete the production-dead advisor helpers

[What this feature does and why it exists. 1-2 paragraphs. Use direct address.
Explain what the user gains, not what files you touched.]

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.github/workflows/skill-advisor-stress.yml` | Modified | Both path filters add the `.opencode` and `.skilled` advisor `hooks/**` globs |
| `.skilled/skills/system-skill-advisor/runtime/lib/compat/redirect-metadata.ts`, `.skilled/skills/system-skill-advisor/runtime/tests/compat/redirect-metadata.vitest.ts` | Deleted | Dead module and its only test |
| `.skilled/skills/system-skill-advisor/runtime/lib/lifecycle/rollback.ts` | Deleted | Its one function had no production caller |
| `.skilled/skills/system-skill-advisor/runtime/lib/derived/sanitizer.ts`, `.skilled/skills/system-skill-advisor/runtime/lib/lifecycle/archive-handling.ts` | Modified | `sanitizeEnvelopeSkillLabel` and `filterDefaultRoutable` removed |
| `.skilled/skills/system-skill-advisor/runtime/tests/lifecycle-derived-metadata.vitest.ts`, `.skilled/skills/system-skill-advisor/runtime/tests/route-exclusions.vitest.ts`, two stress files | Modified | Assertions on the deleted functions removed; live assertions kept |
| Compat, lifecycle, runtime and config READMEs, NC-005 playbook scenario | Modified | Rows and arguments naming the deleted code removed |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Six one-change briefs ran on cli-pi DeepSeek V4.1 Flash max in worktree 537. The three briefs that edit `tests/lifecycle-derived-metadata.vitest.ts` ran in sequence. The orchestrator then removed one route-exclusions case left with no assertion and renamed the A7 test title, which still named an envelope check. A 17-gate baseline on the untouched tree passed first. It needed the worktree's skill-graph database built with `skill_graph_scan --trusted`, because provisioning does not create it. The same 17 gates passed on the changed tree.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Delete the emptied route-exclusions case | It named a path-based seam that no longer exists and asserted nothing. Exclusion stays covered by the env-override case |
| Keep the `'envelope'` member of the sanitizer boundary union | The auto-indexing stress test still checks that boundary through `sanitizeDerivedValue` |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baseline 17 gates, untouched tree | PASS: advisor 190 files, 3207 passed, 4 skipped |
| 17 gates, changed tree | PASS: advisor 189 files, 3201 passed, 4 skipped; stress 62 passed; Python, doctor, mirrors, catalog and playbook exit 0 |
| Test delta | 6 fewer tests: 4 in the deleted redirect test, the rollback case, the emptied route-exclusions case |
| Repo-wide symbol `rg` | No output, exit 1 |
| Hooks glob match | `hooks/pi/prompt-advisor.ts` matched by the new glob |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **CI filter unproven on GitHub.** The glob match was checked locally. A hooks-only pull request would show it on GitHub.
2. **Worktree provisioning skips the skill graph.** A fresh worktree fails 24 advisor tests until `skill_graph_scan --trusted` runs. This is outside this packet.
<!-- /ANCHOR:limitations -->

---


