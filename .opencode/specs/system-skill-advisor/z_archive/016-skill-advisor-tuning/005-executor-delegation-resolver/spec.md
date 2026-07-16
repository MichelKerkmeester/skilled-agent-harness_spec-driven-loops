---
title: "Feature Specification: Metadata-Driven Executor-Delegation Resolver"
description: "Replace the inline cli-opencode band-aid in the advisor scorer with a metadata-driven executor-delegation resolver applied post-fusion, mirrored in the Python local scorer. Routes explicit executor handoffs (cli-opencode / cli-claude-code and the small models that dispatch through them) to their executor, abstains on retired executors, and preserves the code hub's opencode surface via a negative guard."
trigger_phrases:
  - "executor delegation resolver"
  - "cli-opencode delegation routing"
  - "metadata-driven executor aliases"
  - "post-fusion delegation override"
importance_tier: "high"
contextType: "implementation"
parent: "system-skill-advisor"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/016-skill-advisor-tuning/005-executor-delegation-resolver"
    last_updated_at: "2026-07-06T21:30:00.000Z"
    last_updated_by: "opus-4.8"
    recent_action: "WS2 resolver implemented and verified on TS + Python"
    next_safe_action: "Orchestrator pushes the working tree to the shared branch"
---
# Feature Specification: Metadata-Driven Executor-Delegation Resolver

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-06 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The advisor scorer routed explicit OpenCode delegation prompts to `cli-opencode` through an inline pre-clamp band-aid in the explicit lane (`+0.9` cli-opencode / `-3.0` sk-code). The `-3.0` magnitude existed only to survive the explicit lane's clamp — a saturation-class hack. It was too narrow (matched only the literal `cli-opencode` / `opencode cli`), so non-literal orchestrator framings and small-model handoffs both misrouted, and the TS and Python engines disagreed on those prompts.

### Purpose
Route any explicit executor handoff to its executor from one metadata-derived source, applied after fusion, identically on both engines, with no pre-clamp penalty.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A new `lib/scorer/executor-delegation.ts` module: metadata-derived alias table + pure resolver + post-fusion override helper.
- A post-fusion integration point in `lib/scorer/fusion.ts`.
- Removal of the pre-clamp band-aid in `lib/scorer/lanes/explicit.ts`.
- A metadata-driven, executor-agnostic mirror in `scripts/skill_advisor.py`.
- A shared TS/Python parity fixture and its consuming tests.

### Out of Scope
- WS1 post-cap demotion channel - separate workstream; WS2 introduces no replacement pre-clamp penalty.
- The 193-row gold corpus content - WS2 is delegation-neutral on it.
- Any embedding / daemon / database change - none touched.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/executor-delegation.ts` | Create | Alias table, pure resolver, post-fusion override |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts` | Modify | Post-fusion override call |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts` | Modify | Delete the `+0.9`/`-3.0` band-aid block |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Modify | Metadata-driven executor-agnostic resolver + inject-if-absent |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/parity/fixtures/executor-delegation-cases.json` | Create | Shared TS/Python fixture |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/executor-delegation.vitest.ts` | Create | Unit + native + parity tests |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/parity/fixtures/local-native-approved-divergences.json` | Modify | Remove the now-resolved `harder:79997ebae7df` entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Alias table built from metadata, not hardcoded | Active aliases derive from cli-family projection + `model_profiles.json`; suppressed set from archived cli metadata |
| REQ-002 | Override applied post-fusion; band-aid removed; no replacement pre-clamp penalty | `explicit.ts` band-aid gone; routing moved to `fusion.ts` post-fusion override |
| REQ-003 | Corpus-neutral | `python-ts-parity.vitest.ts` stays `pythonCorrect=105 / tsAlsoCorrect=101 / regressions=4` |
| REQ-004 | TS and Python agree on every shared fixture case | Parity assertion over `executor-delegation-cases.json` passes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Non-literal orchestrator framings route correctly | The two harder "OpenCode ... executor/second opinion" prompts route to `cli-opencode` on both engines |
| REQ-006 | Retired executor abstains | "delegate to codex" routes to none on both engines; never to a live executor or the code hub |
| REQ-007 | Negative guard preserves the code hub opencode surface | "OpenCode standards route" / `.opencode/` path prompts stay `sk-code` |
| REQ-008 | Ratchet reconciled surgically | `local-native-divergence-ratchet.vitest.ts` green after removing only the resolved entry |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The band-aid block is gone and no new pre-clamp penalty exists.
- **SC-002**: `python-ts-parity` holds at 105/101/4; the new fixture vitest and ratchet are green.
- **SC-003**: The two previously-misrouted harder orchestrator framings now route to `cli-opencode` on both engines.
- **SC-004**: Adding a new executor or small model needs no code change here (metadata-only).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Alias over-match flips a corpus row | High | Exclude derived keywords (paths/doc names); negative guard runs first; verified corpus-neutral by grep + the 105/101/4 gate |
| Risk | TS/Python base scorers diverge on the abstain prompt | Med | Chose a codex prompt both engines cleanly abstain on (no task-verb saturation) |
| Dependency | Ratchet ledger file (orchestrator fork-3 work) | Med | Edited only the one resolved entry, surgically |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The filesystem read (model registry + archived metadata) is memoized by workspace root; the override is O(aliases) per prompt and a no-op on non-delegation prompts.

### Security
- **NFR-S01**: No secrets, daemon, or database touched; changes are scoped to two TypeScript scorer modules, one Python script, and JSON test fixtures.

### Reliability
- **NFR-R01**: A missing/malformed metadata source degrades to an empty alias contribution, never a hard failure.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty projection: cli-family filter yields no active aliases; model registry still back-stops; resolver returns null on all prompts.
- Fixture (stripped) projection sharing the real workspace root: filesystem aliases are memoized by root; projection aliases recomputed per call, so no cross-contamination.

### Error Scenarios
- Absent `z_archive`: suppressed set is empty; abstain branch simply never fires.
- Malformed `model_profiles.json`: caught; model aliases empty.

### State Transitions
- Executor absent from `ranked` on a route: inject-if-absent synthesizes a minimal recommendation and lifts it to the top.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 2 TS modules + 1 Python script + fixtures/tests, ~300 LOC net |
| Risk | 14/25 | Shared parity gate + ratchet ledger; no breaking API change |
| Research | 8/20 | Behavior verified empirically against corpus + both engines |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

<!-- ANCHOR:questions -->
- None. All resolver behavior verified empirically on both engines (TS native scorer + Python local scorer).
<!-- /ANCHOR:questions -->

