# Iteration 16: Doctor validation output and failure policy

## Focus

Define the exact doctor presentation fields and failure policy for `skill_graph_validate` alongside the existing `graph_scan_report` and advisor test results.

## Actions Taken

- Read iteration 15 and the externalized state tail before selecting this focus.
- Inspected the doctor route manifest, router tool union, skill-advisor workflow, and generic doctor presentation contract.
- Inspected the live graph-validation handler, public tool descriptor, manual playbook, graph-scan/rebuild schemas, and advisor-validation output schema.
- Inspected existing handler tests and route validation. No researched command, doctor, or advisor source file was modified.
- Ran the requested `node .opencode/bin/install-codex-hooks.mjs --check`; it refused the linked worktree and reported the primary checkout, with no mutation.

## Findings

### 1. P1 — `skill_graph_validate` has semantic severity, but no explicit severity field

The handler returns an `ok` envelope with `data.isValid`, `errorCount`, `warningCount`, `checkedNodes`, `checkedEdges`, `errors`, and `warnings`. `isValid` is false only for schema-version errors, broken edges, or dependency-cycle errors. Weight-band, reciprocal-symmetry, weight-parity, orphan, and derived-freshness findings are warnings. The documented pass/warn/error state therefore has to be derived by the doctor adapter:

```text
pass        status=ok, isValid=true,  warningCount=0
warn        status=ok, isValid=true,  warningCount>0
fail        status=ok, isValid=false, errorCount>0
unavailable status=error, thrown call, or malformed payload
```

The presentation must not treat the outer `status=ok` as a successful validation, and must preserve both error and warning arrays. [SOURCE: `mcp-server/handlers/skill-graph/validate.ts:35-130,322-346`; `feature-catalog/mcp-surface/skill-graph-validate.md:21-25`; `manual-testing-playbook/native-mcp-tools/skill-graph-validate.md:20-47`]

### 2. P1 — The scan report currently names fields that do not map one-to-one to the rebuild payload

The doctor workflow currently promises `graph_scan_report: { node_count, edge_count, freshness_ts }`, but `advisor_rebuild` returns `skillCount`, `freshnessBefore`, `freshnessAfter`, `summary`, and `diagnostics`. Its summary contains scan-operation counts such as `indexedNodes` and `indexedEdges`, not an explicit total graph count. `skill_graph_status` is the authoritative source for total node/edge counts and `lastIndexedAt` after rebuild. `indexedNodes` must not be displayed as `node_count` when unchanged nodes were skipped.

The normalized doctor field set should be:

```text
graph_scan_report:
  node_count: skill_graph_status.data.totalSkills
  edge_count: skill_graph_status.data.totalEdges
  freshness_ts: skill_graph_status.data.lastIndexedAt
  scan_summary: advisor_rebuild.data.summary
  warnings: advisor_rebuild.data.diagnostics
```

Keep `scan_summary` because rejected edges, deleted nodes, skipped files, and embedding failures explain how the index changed; do not collapse those into the two totals. [SOURCE: `commands/doctor/assets/doctor-skill-advisor.yaml:318-330`; `mcp-server/handlers/advisor-rebuild.ts:54-101`; `mcp-server/schemas/advisor-tool-schemas.ts:300-310`; `mcp-server/handlers/skill-graph/status.ts:134-152`; `mcp-server/lib/skill-graph/skill-graph-db.ts:88-106,1155-1171`]

### 3. P1 — Native advisor validation is not a `{ passed, failed, total }` test report

`advisor_validate` returns an outer `status=ok` even when individual release slices fail. Its structured payload contains threshold semantics, `overallAccuracy`, per-skill statuses, corpus and holdout `passed` flags, unknown-count state, parity regressions, ambiguity and safety flags, regression-suite `failedCount`, latency values, bucket gates, telemetry, and `generatedAt`. It has no top-level overall pass boolean and no native `total` count matching the current doctor `test_report` shape.

The doctor should keep the existing suite result separate and add a normalized `advisor_validation_report` rather than pretending the MCP payload is the shell test report:

```text
advisor_validation_report:
  status: pass|fail|unavailable
  overall_accuracy: number
  failed_checks: [named slice/check ids]
  regressions: [case ids]
  slices: [raw threshold-bearing slice summaries]
  generated_at: timestamp
```

`test_report: { passed, failed, total, regressions }` remains the summary for the advisor test suite. A validation adapter must count failed checks from the authoritative slice booleans and must not use `overallAccuracy` alone. [SOURCE: `mcp-server/handlers/advisor-validate.ts:620-760`; `mcp-server/schemas/advisor-tool-schemas.ts:394-466`; `feature-catalog/mcp-surface/advisor-validate.md:22-58`; `commands/doctor/assets/doctor-skill-advisor.yaml:323-330`]

### 4. P1 — Validation transport failures and validation findings need different failure paths

`skill_graph_validate` catches database/runtime failures and emits `{ status: "error", error }`; `advisor_validate` can throw during fixture, parity, or benchmark work instead of returning a semantic failed-slice payload. A doctor wrapper therefore needs an invocation/shape guard before reading result fields.

Recommended terminal mapping for the mutating doctor route:

- `fail`: rebuild/scan unavailable, graph validation `fail`, advisor validation `fail`, build failure, or advisor test failures. The post-phase gate remains hard-blocking and offers rollback; `skip_tests` waives only the test-suite check, not graph validation.
- `partial`: graph validation is warning-only, tests were explicitly skipped, or a non-blocking diagnostic is unavailable after the required refresh. Show `WARN`, preserve the details, and require an explicit keep-changes decision; do not silently label the run `OK`.
- `pass`: rebuild/scan completed, graph validation is `pass`, and the advisor test suite plus advisor validation pass.
- `skipped_unverified`: only the literal pre-phase-4 `C` opt-out; all reports remain explicitly skipped/null and no verification claim is made.

The existing `graph_scan_unavailable` hard-failure rule and test-failure rollback rule should be extended to graph-validation errors and adapter/transport failures. Warning-only graph findings should not trigger automatic rollback because the validator explicitly classifies them below structural errors, but they must prevent a clean `PASS`. [SOURCE: `commands/doctor/assets/doctor-skill-advisor.yaml:167-196,318-331,350-388`; `mcp-server/handlers/skill-graph/validate.ts:35-130,322-346`; `mcp-server/handlers/advisor-validate.ts:408-429,620-760`]

### 5. P2 — Existing tests prove registration, not doctor-facing output semantics

The graph dispatch test confirms that `skill_graph_validate` reaches its handler, and the listing test confirms that the tool is registered. The current graph-handler tests do not assert the validator's `isValid`/error/warning payload or the warning-versus-error mapping. The advisor validation tests exercise payload shape, but no doctor contract test composes rebuild/status, graph validation, and advisor results into the presentation fields above.

The smallest useful contract test should cover: zero findings → `pass`; warnings only → `warn`/`partial`; structural errors → `fail`; envelope error or malformed payload → `unavailable`/`fail`; skipped tests → `partial`; explicit opt-out → `skipped_unverified`; and a native advisor-validation slice failure that is not visible in the outer MCP status. [SOURCE: `mcp-server/tests/handlers/skill-graph-dispatch.vitest.ts:41-70`; `mcp-server/tests/handlers/skill-graph-listing.vitest.ts:17-43`; `mcp-server/tests/handlers/advisor-validate.vitest.ts`; `commands/doctor/scripts/route-validate.py:14-20,285-303`]

## Questions Answered

- **What fields should the doctor present?** Keep `graph_scan_report` for total counts, freshness, scan summary, and warnings; add a separate `graph_validation_report` carrying derived severity, `isValid`, error/warning counts, checked node/edge counts, and diagnostic arrays; keep `test_report` separate from a normalized `advisor_validation_report`.
- **What is the failure policy?** Structural graph errors, scan/rebuild failures, advisor validation failed slices, test failures, and malformed/unavailable calls fail the verification gate and offer rollback. Warning-only graph findings and explicitly skipped tests produce `partial`/`WARN` with explicit operator acknowledgement; only a clean run is `pass`.
- **Should warnings be treated as errors?** No. The live validator deliberately separates errors from warnings. Warnings must remain visible and block a clean pass, but should not trigger automatic rollback.

## Questions Remaining

- Should the route contract test compare the declared doctor tool set against the live advisor tool registry, or pin only the selected graph-validation and refresh tools?
- Should the shared create/doctor handoff vocabulary be extracted into a small static contract fixture, given the two surfaces have separate presentation owners?
- Should `description.json` remain a descriptive parent-hub projection rather than participating in graph-vocabulary validation?

## Next Focus

Trace the existing static contract-test patterns and define the minimal assertion matrix for route declarations, workflow output fields, and the create/doctor index handoff.

## Sources Consulted

- `.opencode/commands/doctor/_routes.yaml`
- `.opencode/commands/doctor/speckit.md`
- `.opencode/commands/doctor/assets/doctor-skill-advisor.yaml`
- `.opencode/commands/doctor/assets/doctor-speckit-presentation.txt`
- `.opencode/commands/doctor/scripts/route-validate.py`
- `.opencode/skills/system-skill-advisor/mcp-server/handlers/skill-graph/validate.ts`
- `.opencode/skills/system-skill-advisor/mcp-server/handlers/skill-graph/status.ts`
- `.opencode/skills/system-skill-advisor/mcp-server/handlers/advisor-rebuild.ts`
- `.opencode/skills/system-skill-advisor/mcp-server/handlers/advisor-validate.ts`
- `.opencode/skills/system-skill-advisor/mcp-server/schemas/advisor-tool-schemas.ts`
- `.opencode/skills/system-skill-advisor/mcp-server/tests/handlers/skill-graph-dispatch.vitest.ts`
- `.opencode/skills/system-skill-advisor/mcp-server/tests/handlers/skill-graph-listing.vitest.ts`
- `.opencode/skills/system-skill-advisor/feature-catalog/mcp-surface/skill-graph-validate.md`
- `.opencode/skills/system-skill-advisor/feature-catalog/mcp-surface/advisor-validate.md`
- `.opencode/skills/system-skill-advisor/manual-testing-playbook/native-mcp-tools/skill-graph-validate.md`
- `.opencode/bin/install-codex-hooks.mjs --check` output for the linked-worktree source-selection guard

## Assessment

- New information ratio: **0.84**.
- This iteration resolves the presentation vocabulary and severity policy. It does not implement the route exposure, workflow call, or tests.
