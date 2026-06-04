# Iteration 006 - Maintainability

## Scope
Focused pass over least-privilege boundaries, tests, and code hygiene.

## Findings

### P2

- **F006**: fan-out lineage write boundary is prompt-only while sandbox defaults to workspace-write - `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:83` - The sandbox resolver defaults null to `workspace-write` [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:83], and fanout-run passes the resolved sandbox to CLI executors [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:180]. The lineage prompt tells the child to write only under its lineage directory [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:142], but the sandbox itself permits broader workspace writes. This is advisory because the child still needs to persist artifacts, but it is not an enforced artifact-dir boundary.

- **F007**: reviewed code comments still contain perishable packet and finding labels - `.opencode/skills/system-code-graph/mcp_server/handlers/detect-changes.ts:7` - The reviewed code contains comments with perishable packet/finding labels, for example `pt-02`, `RISK-03`, and `R-002-4` [SOURCE: .opencode/skills/system-code-graph/mcp_server/handlers/detect-changes.ts:7], `R-007-3` [SOURCE: .opencode/skills/system-code-graph/mcp_server/handlers/detect-changes.ts:190], and `BUG-02` [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:180]. Current project rules classify these labels as code-comment hygiene debt; durable explanations should keep the why and remove the packet/finding IDs.

## Verdict Rationale
This iteration found P2 advisories only, so its local verdict is PASS.

Review verdict: PASS
