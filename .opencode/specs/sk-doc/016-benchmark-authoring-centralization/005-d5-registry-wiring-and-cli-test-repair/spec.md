---
title: "Feature Specification: D5 registry-gate wiring + cli-* skill-benchmark test repair"
description: "Closes the two runtime/test limitations documented by packet 004: wire scanHubRegistry into run-skill-benchmark so the BLOCKED-BY-REGISTRY verdict is actually reachable, and repair the 8 skill-benchmark tests still pointing at the pre-relocation cli-opencode / cli-claude-code paths."
trigger_phrases:
  - "d5 registry gate wiring"
  - "blocked-by-registry reachable"
  - "cli-external-orchestration test repair"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/016-benchmark-authoring-centralization/005-d5-registry-wiring-and-cli-test-repair"
    last_updated_at: "2026-07-14T20:10:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Fixes landed + Sonnet-verified; gates green"
    next_safe_action: "Commit and integrate to skilled/v4.0.0.0"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: D5 registry-gate wiring + cli-* skill-benchmark test repair

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-14 |
| **Parent** | `sk-doc/016-benchmark-authoring-centralization` |
| **Parent Spec** | ../spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 004 shipped the D5 exit-code hard-fail but recorded two limitations it left untouched as out-of-scope. First, `scanHubRegistry()` in `d5-connectivity.cjs` (the only producer of the `BLOCKED-BY-REGISTRY` verdict) is defined, exported, and called in that module's own `main()`, but `run-skill-benchmark.cjs` imports and calls only `scanConnectivity()` — so `BLOCKED-BY-REGISTRY` is unreachable through the real run path, and the exit-3 gate can never fire on a broken hub registry. Second, of the 8 failing tests in `skill-benchmark.vitest.ts`, 6 still resolve `join(REPO_SKILLS, 'cli-opencode')` at a pre-relocation path (`cli-opencode` / `cli-claude-code` were moved to `cli-external-orchestration/`), while the remaining 2 command-recipe tests were regressed independently: a thin-router restructure of the `/design:*` commands dropped the `## CHOREOGRAPHY` wrapper section that the choreography check (reachable only for `/design:*` commands) required, turning a satisfiable check into an unsatisfiable one.

### Purpose
Wire the hub-registry scan into the real run path so `BLOCKED-BY-REGISTRY` is reachable and gates the exit code, without any change to how non-hub skills score; and repair the relocated-path test references (and any router-parse assertions the relocation's SKILL.md condensation shifted) so the skill-benchmark suite is green again.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Import and call `scanHubRegistry()` in `run-skill-benchmark.cjs`; thread its result into `aggregate()`.
- Add a `BLOCKED-BY-REGISTRY` verdict branch in `aggregate()` with defined precedence (structural gate first, then registry).
- A test proving a hub skill with a broken/missing registry yields `BLOCKED-BY-REGISTRY` + exit 3, and a non-hub skill is unaffected.
- Repair the 6 `cli-opencode` / `cli-claude-code` test references to `cli-external-orchestration/…` (path-only substitutions).
- Align the `/design:*` wrapper-choreography check to the thin-router architecture so the 2 command-recipe tests pass again — the substantive recipe-vs-metadata match stays intact; only the now-absent prose-section penalty is removed.

### Out of Scope
- The `deadPackets` scan's hardcoded `design-` prefix (a pre-existing sk-design-specific limitation).
- The broader `cli-external-orchestration` migration itself (settled + committed elsewhere).
- create-benchmark SKILL.md word-count trim — an accepted documented exception (operator-confirmed).
- Repointing the wrapper-choreography *discoverability* check at the thin-router asset YAML step keys (`design_<mode>_auto.yaml` step keys) — a follow-up; this packet only stops penalizing the absent prose section.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs` | Modify | Call `scanHubRegistry`; pass to `aggregate` |
| `system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs` | Modify | `aggregate` accepts hub registry; `BLOCKED-BY-REGISTRY` verdict branch |
| `system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts` | Modify | Repair relocated cli-* refs; add registry-gate test |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `BLOCKED-BY-REGISTRY` reachable via run() | `run-skill-benchmark.cjs` calls `scanHubRegistry`; `aggregate` emits `BLOCKED-BY-REGISTRY` when the hub registry gate fails; `run()` returns exit 3 on it; a test proves it |
| REQ-002 | Full skill-benchmark suite green | The 6 relocated-path tests resolve `cli-external-orchestration/…` and pass; the 2 `/design:*` command-recipe tests pass via the thin-router choreography alignment; no expected-value assertion weakened to mask a routing regression |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | No regression | Non-hub skills keep `gateFailed:false` (unaffected); the 004 D5 structural gate + exit-3 behavior stays intact; full skill-benchmark suite passes with no new failures |
| REQ-004 | Fix rationale is truthful | The choreography-check comment cites the real thin-router cause (choreography moved to the command asset YAML step keys), not a fabricated relocation cause |
| REQ-005 | Frozen artifacts preserved | Historical benchmark run-report artifacts under `deep-improvement/benchmark/` remain byte-identical |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The full `skill-benchmark.vitest.ts` suite passes (0 failures), including a new `BLOCKED-BY-REGISTRY` exit-code test and the 004 `BLOCKED-BY-STRUCTURE` test.
- **SC-002**: A hub skill (has `mode-registry.json`) with a broken registry yields exit 3 + `BLOCKED-BY-REGISTRY`; a non-hub skill is unaffected.
- **SC-003**: `validate.sh --strict` on this packet returns Errors 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Registry gate false-fails non-hub skills | Med | `emptyHubRegistryResult()` returns `gateFailed:false` when no `mode-registry.json`; test a non-hub skill explicitly |
| Risk | Verdict precedence changes existing outcomes | Med | Insert `BLOCKED-BY-REGISTRY` after the structural branch only; re-run full suite for regressions |
| Risk | Router-parse assertions depend on shifted SKILL.md content | Low | Repair against the current relocated SKILL.md, not a guessed shape |
| Dependency | cli-* relocation committed + stable | — | Verified: on origin/v4, no concurrent churn |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: No existing skill-benchmark test regresses; the 004 exit-code contract is preserved.
- **NFR-R02**: The registry scan adds no behavior for skills without a `mode-registry.json`.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A skill with `mode-registry.json` but no `hub-router.json` → `BLOCKED-BY-REGISTRY` (existing scanHubRegistry behavior), now reachable.
- A skill where both structural and registry gates fail → structural precedence wins (`BLOCKED-BY-STRUCTURE`), exit 3 either way.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 3 files, one runtime wiring + test repair |
| Risk | 10/25 | Verdict-semantics change with a regression surface |
| Research | 6/20 | Wiring path + relocation already traced |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None open; spec folder (new child 016/005) and caveat-3 deferral were operator-resolved.
<!-- /ANCHOR:questions -->
