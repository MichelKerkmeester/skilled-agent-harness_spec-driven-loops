# Deep Research Dashboard

## Iteration Table
| run | focus | newInfoRatio | findings count | status |
|---:|---|---:|---:|---|
| 1 | Common root cause for doc/schema-to-code drift | 1.00 | 5 | complete |
| 2 | Metadata-drift systemic-ness across 026 and 027 | 0.74 | 5 | complete |
| 3 | Memory-correctness real impact and reproducibility | 0.52 | 4 | complete |
| 4 | P0 security severity calibration under local MCP threat model | 0.36 | 4 | complete |
| 5 | Deep-loop and catalog/playbook blast radius | 0.18 | 6 | complete |

## Question Status
5/5 answered.

- Answered: doc/schema-to-code drift root cause.
- Answered: metadata drift systemic-ness and blast radius.
- Answered: memory-correctness impact and reproducibility.
- Answered: local MCP security severity calibration.
- Answered: deep-loop fan-out blast radius and suspect artifacts.

## Convergence Trend
Last 3 newInfoRatio values: `0.52 -> 0.36 -> 0.18`, descending.

Composite stop score at iteration 5: `0.65 / 0.60`; legal stop gates pass because all charter questions have evidence-backed answers and sources span review artifacts plus implementation files.

## Dead Ends
| Approach | Reason Eliminated | Evidence |
|---|---|---|
| Treat drift as isolated docs typo | Repeated contract drift appears across reconcile, ingest, causal stats, session bootstrap, catalog, and playbook. | [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/003-mcp-session-index-schema/review/deep-review-findings-registry.json] |
| Treat metadata drift as only manual editing | Automation exists but does not enforce semantic completion and launch invariants. | [SOURCE: file:.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts:493] |
| Treat single-user memory bugs as non-impacting | Normal update/delete and save flows can produce stale routing or DB/file mismatch without malicious input. | [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:306] |
| Treat local MCP P0s as remote-network vulnerabilities | Local threat model reduces exploit likelihood, but governed-scope bypass remains a boundary violation. | [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:704] |
| Trust orchestration summaries as lineage success proof | The pool counts non-throwing worker returns as fulfilled even when the return carries `exitCode`. | [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:362] |

## Blocked Stops
None.

## Graph Convergence
No graphEvents emitted in this lineage; graph-aware STOP blockers not applicable.

## Next Focus
Proceed to remediation planning. Start with scope-preserving retrieval fallback, fan-out exit-code handling, and generated/parity-tested MCP tool contracts.

## Active Risks
- The review registries contain duplicate fan-out rows in some slices; synthesis deduped by finding signature and cited direct evidence.
- Severity calibration depends on whether governed scope is declared a security boundary or an operational partition in the MCP threat model.
