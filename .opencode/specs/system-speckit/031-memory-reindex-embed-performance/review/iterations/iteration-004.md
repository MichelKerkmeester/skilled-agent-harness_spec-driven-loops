# Deep Review Iteration 004

## Dimension

Correctness — REQ-009 background-scan default at the MCP tool dispatch boundary. Scope was limited to default injection, schema communication, the two claimed synchronous internal-caller exemptions, focused regression-test strength, and compiled-dist parity.

## Files Reviewed

| File | Lines reviewed | Claim verified |
|---|---:|---|
| `.opencode/skills/system-spec-kit/mcp-server/tools/lifecycle-tools.ts` | 60-72 | The dispatcher injects `background: true` only when the validated argument is `undefined`; explicit booleans are forwarded unchanged. |
| `.opencode/skills/system-spec-kit/mcp-server/tool-schemas.ts` | 757-762 | Public schema advertises `default: true`, explains progress/status/cancel behavior, and documents explicit `false` as the synchronous escape hatch. |
| `.opencode/skills/system-spec-kit/mcp-server/schemas/tool-input-schemas.ts` | 812-843; schema at 516 | Runtime validation uses Zod parsing and leaves optional `background` omitted; JSON-schema metadata is not silently supplying the runtime default. |
| `.opencode/skills/system-spec-kit/mcp-server/cli.ts` | 468-491 | CLI reindex imports and calls `handleMemoryIndexScan` directly, bypassing `tools/lifecycle-tools.ts`; omission therefore retains the handler's synchronous path. |
| `.opencode/skills/system-spec-kit/mcp-server/context-server.ts` | 2264-2276 | Boot-time drift repair's `runScopedScan` calls `handleMemoryIndexScan` directly and awaits its result, bypassing the MCP dispatch default. |
| `.opencode/skills/system-spec-kit/mcp-server/tests/lifecycle-tools-scan-default.vitest.ts` | 10-72 | Hoisted handler mock captures effective arguments; four assertions cover omission, explicit false, explicit true, and preservation of unrelated args. |
| `.opencode/skills/system-spec-kit/mcp-server/dist/tools/lifecycle-tools.js` | 27-38 | Compiled output contains the same `background === undefined ? {..., background: true} : scanArgs` branch. |
| `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/spec.md` | 112 | REQ-009 requires manual/maintenance MCP scans to default to the existing background-job path. |
| `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/checklist.md` | 182-183 | CHK-073's implementation and four-test evidence match the inspected code and focused execution. |

## Findings by Severity

### P0

None.

### P1

None.

### P2

None.

### Verification claims adjudicated

#### VERIFY-009-1 — Omitted and explicit `background` values have the required semantics

- **Evidence:** `tools/lifecycle-tools.ts:63-71` validates and parses the MCP arguments, then calls `handleMemoryIndexScan(scanArgs.background === undefined ? { ...scanArgs, background: true } : scanArgs)`. Omission takes the injected branch; explicit `false` and `true` both take the pass-through branch.
- **Counterevidence sought:** schema-level default mutation that could make the dispatch branch vacuous. `schemas/tool-input-schemas.ts:816-831` uses the Zod schema, whose `background` field is optional without a default (`:516`), so omission remains `undefined` until this dispatcher.
- **Alternative explanation:** the `default: true` in `tool-schemas.ts:761` is public JSON-schema metadata and documentation; it is not the runtime mechanism used by `validateToolArgs`.
- **Final severity:** no finding — verified correct.
- **Confidence:** 0.99.
- **Downgrade trigger:** any future validator that materializes a contradictory default, or replacement of the strict `=== undefined` test with truthiness logic, would require re-adjudication.

#### VERIFY-009-2 — Both synchronous internal callers bypass the MCP dispatch boundary

- **Evidence:** CLI reindex dynamically imports `./handlers/memory-index.js` and invokes `handleMemoryIndexScan` directly at `cli.ts:468-491`. Boot drift repair invokes the same handler directly inside `runScopedScan` at `context-server.ts:2264-2275`. Neither imports nor calls `tools/lifecycle-tools.ts::handleTool`.
- **Counterevidence sought:** an indirect route through MCP dispatch or an explicit background job request at either site. Both call expressions target the handler itself, omit `background`, and await the full handler response.
- **Alternative explanation:** the strategy's earlier tentative location in launcher bridge code was inaccurate; independent search located the actual CLI caller in `mcp-server/cli.ts`, as anticipated by the prompt's “cli.ts or similar” instruction.
- **Final severity:** no finding — exemptions are real and preserve synchronous completion.
- **Confidence:** 0.99.
- **Downgrade trigger:** routing either caller through `handleTool('memory_index_scan', ...)` would newly apply the background default.

#### VERIFY-009-3 — Regression tests are non-vacuous and pass

- **Evidence:** the suite mocks `../handlers/index.js` and asserts the exact first argument received by `mockHandleMemoryIndexScan` (`tests/lifecycle-tools-scan-default.vitest.ts:10-34,45-71`). Removing the dispatch injection would make the omission test at `:45-50` receive `{}` instead of `{ background: true }`; because Zod does not default the field, that assertion would fail. The explicit-false and explicit-true tests independently protect pass-through behavior, while the fourth test protects spread preservation.
- **Verification:** `npx vitest run tests/lifecycle-tools-scan-default.vitest.ts` → 1 file passed, 4 tests passed.
- **Counterevidence sought:** mock assertions against caller input rather than handler-received output, unconditional mock return values masking the expectation, or schema-side defaulting. The assertions inspect handler-received output and Zod leaves omission intact.
- **Alternative explanation:** the mocked response does not exercise the background worker itself, but REQ-009's changed unit is dispatch argument selection; existing handler job tests cover worker behavior.
- **Final severity:** no finding — targeted tests would detect removal of the fix.
- **Confidence:** 0.98.
- **Downgrade trigger:** if validation later begins injecting `background: true`, the omission test would stop isolating this dispatch boundary and should be rewritten to pin the chosen ownership layer.

#### VERIFY-009-4 — Source, schema, checklist, and dist agree

- **Evidence:** source default at `tools/lifecycle-tools.ts:71`, schema/default description at `tool-schemas.ts:761`, compiled branch at `dist/tools/lifecycle-tools.js:29-38`, REQ-009 at `spec.md:112`, and CHK-073 at `checklist.md:182-183` all describe the same behavior and override.
- **Counterevidence sought:** stale compiled output, mismatched default metadata, or checklist evidence unsupported by execution. None found; focused suite passed 4/4.
- **Alternative explanation:** TypeScript source could be correct while the shipped package remained stale; the dist read rules this out for the reviewed dispatcher.
- **Final severity:** no finding — traceability is consistent.
- **Confidence:** 0.99.
- **Downgrade trigger:** a future build that omits or rewrites the compiled branch without updating evidence would reopen this check.

## Traceability Checks

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | passed for REQ-009 | `spec.md:112` matches dispatcher `tools/lifecycle-tools.ts:63-71`, schema `tool-schemas.ts:759-761`, and dist `dist/tools/lifecycle-tools.js:29-38`. |
| `checklist_evidence` | passed for CHK-073 | `checklist.md:182-183` claims four dispatch tests; focused execution returned 4/4 passed and direct inspection confirms non-vacuous handler-argument assertions. |
| `feature_catalog_code` | notApplicable | No feature-catalog surface is involved. |
| `skill_agent` | notApplicable | No skill-authoring change. |
| `agent_cross_runtime` | notApplicable | No agent-definition change. |
| `playbook_capability` | notApplicable | No playbook change. |

## SCOPE VIOLATIONS

None. Review targets remained read-only; writes were restricted to the authorized review-state artifacts.

## Verdict

PASS — REQ-009 is implemented at the intended boundary. Omitted MCP arguments become `background: true`, explicit booleans pass through unchanged, both synchronous internal callers bypass the dispatcher, the tests are non-vacuous and pass 4/4, and compiled dist is current. No new findings; newFindingsRatio is 0.0.

## Next Dimension

Iteration 5: Security across all 16 scoped files, prioritizing REQ-011 model-socket path handling for injection/traversal and unsafe filesystem-boundary behavior, REQ-010 `leaseId` predictability/token-authority concerns, and a general secrets or hardcoded-credential sweep. Preserve the prior correctness exclusions unless security evidence incidentally crosses them.

Review verdict: PASS
