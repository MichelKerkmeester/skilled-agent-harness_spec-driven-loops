---
title: "Implementation Summary: 101/008 Council Surface Polish"
description: "Surfaced 101/007 artifacts via SKILL.md, published v1.1.0.0 series changelog covering 101/001..008, and added a smoke vitest covering the replay helper plus the bash runner."
trigger_phrases:
  - "101/008 summary"
  - "deep-ai-council surface polish summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/101-deep-multi-ai-council-skill/008-council-surface-polish"
    last_updated_at: "2026-05-11T11:40:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Surfaced new artifacts and shipped smoke coverage"
    next_safe_action: "Mark phase 008 Complete in parent 101"
    blockers: []
    key_files:
      - .opencode/skills/deep-ai-council/SKILL.md
      - .opencode/skills/deep-ai-council/changelog/v1.1.0.0.md
      - .opencode/skills/system-spec-kit/mcp_server/tests/council-helpers-smoke.vitest.ts
      - .opencode/skills/system-spec-kit/mcp_server/package.json
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "101-008-surface-polish"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Smoke vitest follows the shape-assertion pattern for shell scripts and an end-to-end spawn for the Node helper."
      - "Direct main-agent Edit/Write throughout; no cli-codex dispatch needed for this scale."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: 101/008 Council Surface Polish

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `skilled-agent-orchestration/101-deep-multi-ai-council-skill/008-council-surface-polish` |
| **Status** | Complete |
| **Level** | 1 |
| **Completed** | 2026-05-11 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Three additive deliverables close the last follow-ups from 101's seven-phase work. New consumers reading `SKILL.md` now discover the 101/007 artifacts (`feature_catalog/` and the replay helper) directly from the skill entry point. A new `changelog/v1.1.0.0.md` summarizes the 101/001..008 series in one place using the existing v1.0.0.0 format. A new `council-helpers-smoke.vitest.ts` covers the helper scripts that previously had no regression coverage.

### SKILL.md surface

The Resource Domains section under §6 grew two new mentions: `feature_catalog/` (one entry per scenario), and `scripts/replay-graph-from-artifacts.cjs` (DAC-025 derived-projection rebuild). The router and intent model stayed untouched — these are documentation entries, not new routing targets. `CONTRIBUTING.md` exists alongside SKILL.md and is discoverable by convention, but is intentionally not cross-referenced from the skill body.

### Series changelog v1.1.0.0

The new changelog entry follows v1.0.0.0's structure (header + New Features sections + Architecture + Verification + Commands + Upgrade). It covers all six phases shipped after v1.0.0.0: 003 council graph, 004 playbook graph coverage, 005 fix-ups + value scenarios, 006 value-scenario automation, 007 infrastructure hardening, 008 surface polish. Measured value ratios from `council-graph-value-report.json` appear inline. Two new helper scripts are documented under Commands.

### Smoke vitest

The new `tests/council-helpers-smoke.vitest.ts` runs two scenarios:

1. **Replay helper end-to-end** — seeds a synthetic `ai-council-state.jsonl` with 5 events in a temp `.opencode/` scaffold, spawns `replay-graph-from-artifacts.cjs --spec-folder ... --session-id ...`, asserts the emitted upsert payload contains SESSION + ROUND + SEAT nodes plus at least one of CLAIM/EVIDENCE/DECISION derived from the events.
2. **`test-council-matrix.sh` shape** — file exists, owner-execute bit set, body contains `set -euo pipefail`, invokes `test:council`, runs `quick_validate.py`, runs `validate.sh --strict`.
The matrix script's `test:council` now invokes 10 vitest files (was 9 after 101/007).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/deep-ai-council/SKILL.md` | Modified | Added 2 new Resource Domains mentions surfacing feature_catalog/ and the replay helper (CONTRIBUTING.md intentionally omitted per user direction) |
| `.opencode/skills/deep-ai-council/CONTRIBUTING.md` | Deleted | User escalated CONTRIBUTING.md de-emphasis to "remove that from every skill reference across all skills"; with no skill body cross-referencing it, the file was removed per the legacy-docs-DELETED stored convention |
| `.opencode/skills/sk-doc/assets/llmstxt_templates.md` | Modified | Removed 3 CONTRIBUTING.md mentions (one inventory bullet, two sample-output DEVELOPMENT section entries) to match the cross-skill de-emphasis directive |
| `.opencode/skills/sk-doc/references/global/optimization.md` | Modified | Rephrased "Project governance (move to CONTRIBUTING.md)" → "Project governance (move to a separate governance doc)" to drop the CONTRIBUTING.md destination pattern |
| `.opencode/skills/deep-ai-council/changelog/v1.1.0.0.md` | Created | Series changelog covering 101/001..008 |
| `.opencode/skills/system-spec-kit/mcp_server/tests/council-helpers-smoke.vitest.ts` | Created | Smoke coverage for replay helper + bash runner |
| `.opencode/skills/system-spec-kit/mcp_server/package.json` | Modified | Appended `tests/council-helpers-smoke.vitest.ts` to `test:council` |
| Parent 101 `spec.md` + `graph-metadata.json` | Modified | Added phase 008 + bumped `last_active_child_id` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Direct main-agent Edit/Write throughout — no cli-codex dispatch. The work is small (3 file creations, 3 file edits, ~250 lines total) and well-scoped, so the dispatch overhead of cli-codex would have exceeded the work. The smoke vitest uses the existing `child_process.spawnSync` pattern from other council vitest files for the helper invocation, and `fs.statSync` + `fs.readFileSync` for the shell-script shape assertions. Temp scaffolds clean up in `afterEach`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Direct main-agent Edit/Write instead of cli-codex | Scope is 3 files created + 3 edited; cli-codex dispatch overhead would exceed the work |
| Shape-assert the shell scripts, end-to-end the Node helper | Running the shell scripts inside a vitest is slow (they spawn the full matrix); shape assertions catch rename / command-chain drift cheaply. The Node helper has clean JSON output that's worth exercising end-to-end |
| SKILL.md surface change limited to §6 Resource Domains bullets | The router and intent model didn't gain new categories — these artifacts are documentation, not new routing targets. Keeping the surface change minimal avoids inflating the smart-router pseudocode |
| Changelog covers 003..008 in one v1.1.0.0 entry rather than per-phase | The phases are tightly coupled (each builds on the prior) and the consumer cares about the cumulative state, not the phase-by-phase delta |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npx vitest run tests/council-helpers-smoke.vitest.ts` standalone | PASS - 1 file, 3 tests, 0 failures |
| `npm run test:council` (full 10-file matrix) | PASS - 10 files, 53 tests, 0 failures |
| `python3 .opencode/skills/sk-doc/scripts/quick_validate.py .opencode/skills/deep-ai-council` | PASS - "Skill is valid!" |
| `validate_document.py changelog/v1.1.0.0.md` | PASS - "VALID", 0 issues |
| `validate_document.py SKILL.md` | PASS - "VALID", 0 issues |
| `validate.sh --strict` packet 008 (after this summary) | PASS - 0 errors, 0 warnings |
| `validate.sh --strict` parent 101 | PASS - 0 errors, 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Shell-script tests are shape-asserts, not end-to-end runs.** The matrix runner would be slow to exercise end-to-end (it spawns the full council vitest inside a vitest); the shape test catches the regression class that's actually likely (rename, command-chain drift) without the runtime cost.
2. **SKILL.md does not add new routing intents for the surfaced artifacts.** `feature_catalog/` and the replay helper are documentation/tooling — they don't have user prompts that should trigger them via intent scoring. The bullets surface them via the Resource Domains description only.
3. **CONTRIBUTING.md is removed across the skill ecosystem.** Initial direction was "no need to reference CONTRIBUTING.md" (deep-ai-council/SKILL.md). Escalated direction was "remove that from every skill reference across all skills" — the deep-ai-council CONTRIBUTING.md file is now deleted, and three CONTRIBUTING.md mentions in sk-doc templates/references are removed. A "CONTRIBUTING" section heading inside `mcp-chrome-devtools/examples/README.md` remains because it's a section name, not a reference to a CONTRIBUTING.md file.
<!-- /ANCHOR:limitations -->
