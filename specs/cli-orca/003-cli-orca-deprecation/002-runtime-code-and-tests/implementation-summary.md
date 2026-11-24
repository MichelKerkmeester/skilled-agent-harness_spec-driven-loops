---
title: "Implementation Summary"
description: "The advisor and sk-doc code no longer name cli-orca."
trigger_phrases:
  - "cli orca removal runtime code"
  - "cli orca removal tests"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-orca/003-cli-orca-deprecation/002-runtime-code-and-tests"
    last_updated_at: "2026-11-24T10:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Completed phase 2: runtime-code-and-tests"
    next_safe_action: "Run phase 3"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-orca-deprecation-002-runtime-code-and-tests"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Remove cli-orca completely, including its changelog folder"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-runtime-code-and-tests |
| **Status** | Complete |
| **Completed** | 2026-11-24 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The advisor and sk-doc code no longer name cli-orca. The scorer comment explains the tool-name rule without an example skill, the read-only route test uses a synthetic `cli-widget`, and the explicit-name test uses `cli-classifier`. The metadata contract test and its reference list five standalone roots.

### Phase 2: runtime-code-and-tests

Make the code and tests independent of cli-orca without changing what they test.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `fusion.ts` | Modify | Comment |
| `route-gates.vitest.ts` | Modify | Synthetic skill |
| `advisor-prompt-policy.vitest.ts` | Modify | Example list |
| `skill-root-metadata-contract.test.cjs` | Modify | Class map |
| `skill-root-metadata-contract.md` | Modify | Class S row |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Two cli-opencode dispatches on `llmgateway/deepseek-v4.1-flash-1017`, `#max` for the three advisor files and `#high` for the contract pair. Each brief carried the literal before and after text and an allowed-paths list. I read each diff and reran the tests myself.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use `cli-widget` in the route test | No surviving cli skill wraps one named tool, and the test only needs a `cli-` family projection |
| Leave the class table's missing `system-skilled-doctor` row alone | It predates this packet and is outside its scope |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Advisor tests | PASS, 58/58, same as baseline |
| Residue | PASS, `rg` prints nothing over the five files |
| Contract test | PASS after phase 3 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The contract reference's class S row omits `system-skilled-doctor`, which the test map includes. That gap predates this packet.
<!-- /ANCHOR:limitations -->

---
