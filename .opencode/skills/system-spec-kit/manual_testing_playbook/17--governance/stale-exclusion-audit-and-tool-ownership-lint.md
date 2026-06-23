---
title: "448 -- Stale-Exclusion Audit and Tool-Ownership Lint"
description: "Manual check that memory_health surfaces hard-exclusion audit metadata and the tool-ownership lint fails closed on drift from the registered 39-tool schema."
version: 3.6.0.2
---

# 448 -- Stale-Exclusion Audit and Tool-Ownership Lint

## 1. OVERVIEW

This scenario validates two read-only governance surfaces: stale-exclusion audit metadata and source-derived tool-ownership linting. The audit must classify intended archived exclusions separately from deprecated-tier silent-risk rows. The lint must derive the 39-tool ownership map from `TOOL_DEFINITIONS` and fail closed on missing tools, extra tools, malformed maps, field drift, or unreadable definitions.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm stale-exclusion audit visibility and blocking tool-ownership drift detection.
- Real user request: `Validate memory health stale-exclusion audit and prove the tool-ownership map blocks drift from the registered tool schema.`
- Prompt: `Validate stale-exclusion audit through memory_health and tool-ownership lint drift detection through the committed runner.`
- Expected execution process: Seed or use a sandbox with archived and deprecated rows, run `memory_health`, run the focused stale-audit/tool-ownership suite, then run the clean source-derived lint runner. Use the runner's env override to prove unreadable definitions fail closed without changing source files.
- Expected signals: `memory_health` exposes hard-exclusion audit metadata and hints; focused suite proves deprecated risk, archived intended exclusion, malformed policy handling, missing/extra ownership drift, and byte-identical clean serialization; clean lint reports a 39-tool map; unreadable definitions fail closed; source tree remains unchanged after temporary checks.
- Desired user-visible outcome: The operator can cite health audit classifications and prove the ownership lint blocks stale tool maps.
- Pass/fail: PASS only when health audit classifications are visible and the lint passes clean state while failing each drift simulation.

---

## 3. TEST EXECUTION

### Prompt

```text
Validate stale-exclusion audit through memory_health and tool-ownership lint drift detection through the committed runner.
```

### Commands

1. Use a disposable DB fixture containing at least one archived row that should be intentionally excluded and one deprecated-tier row that should be flagged as silent-risk.
2. Run `memory_health({ reportMode: "full" })` and capture the exclusion audit block and hints.
3. Run the focused suite from `.opencode/skills/system-spec-kit/mcp_server`: `npx vitest run tests/stale-audit-tool-ownership.vitest.ts`.
4. Run the clean lint command from `.opencode/skills/system-spec-kit/mcp_server`: `node tests/tool-ownership-lint-runner.mjs`.
5. Create a temp directory, copy `tests/fixtures/tool-ownership-map.json` into it, and run `SPECKIT_TOOL_SCHEMAS_PATH=<temp>/missing-tool-schemas.ts SPECKIT_TOOL_OWNERSHIP_MAP_PATH=<temp>/tool-ownership-map.json node tests/tool-ownership-lint-runner.mjs` from the same cwd.
6. Run `git diff -- .opencode/skills/system-spec-kit/mcp_server/tests/fixtures/tool-ownership-map.json .opencode/skills/system-spec-kit/mcp_server/tests/tool-ownership-lint-runner.mjs` and confirm no source fixture was changed.

### Expected

- `memory_health` separates intended archived exclusions from deprecated-tier silent-risk rows and includes operator hints.
- Focused suite passes stale-exclusion and ownership drift cases.
- Clean lint reports `tool-ownership map clean` for the valid 39-tool ownership map.
- Unreadable definitions fail closed with an actionable message.
- The committed fixture and lint runner remain unchanged after temporary drift checks.

### Evidence

Health payload excerpt, clean lint transcript, drift failure transcripts, and source-tree diff showing no committed fixture mutation.

### Pass / Fail

- **Pass**: audit metadata is visible, clean lint passes, every drift simulation fails closed, and committed source files remain unchanged.
- **Fail**: health hides stale-exclusion risk, clean lint fails, drift passes silently, or the test mutates committed fixtures.

### Failure Triage

Inspect `handlers/memory-crud-health.ts`, `tests/stale-audit-tool-ownership.vitest.ts`, `tests/tool-ownership-lint-runner.mjs`, and `tests/fixtures/tool-ownership-map.json`. Confirm the fixture contains both archived and deprecated rows before diagnosing missing audit fields.

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `17--governance/stale-exclusion-audit-and-tool-ownership-lint.md` | Scenario contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `mcp_server/handlers/memory-crud-health.ts` | Health audit surface |
| `mcp_server/tests/stale-audit-tool-ownership.vitest.ts` | Audit and lint regression coverage |
| `mcp_server/tests/tool-ownership-lint-runner.mjs` | Source-derived lint runner |
| `mcp_server/tests/fixtures/tool-ownership-map.json` | Committed ownership fixture |

---

## 5. SOURCE METADATA

- Group: Governance
- Playbook ID: 448
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `17--governance/stale-exclusion-audit-and-tool-ownership-lint.md`
