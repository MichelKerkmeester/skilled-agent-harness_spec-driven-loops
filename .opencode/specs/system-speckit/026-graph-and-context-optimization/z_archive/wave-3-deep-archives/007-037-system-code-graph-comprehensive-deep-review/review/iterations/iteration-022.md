# Iteration 022 — P0-2 CCC Readiness Claim Verification

## Summary

P0-2 is **PARTIAL**. The literal hardcoded readiness calls are present exactly at the cited lines. The release-blocker framing is not fully supported because `tool-schemas.ts` does not advertise readiness for the `ccc_*` tools, and the handlers label the readiness reason as `readiness_not_applicable`.

## Files Reviewed

- `.opencode/skills/system-code-graph/mcp_server/handlers/ccc-status.ts` (lines read: 1-74)
- `.opencode/skills/system-code-graph/mcp_server/handlers/ccc-reindex.ts` (lines read: 1-99)
- `.opencode/skills/system-code-graph/mcp_server/handlers/ccc-feedback.ts` (lines read: 1-90)
- `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts` (lines read: 196-229)

## Findings

### P0 (release-blocking)

| ID | Verdict | File:line | Finding | Remediation |
|----|---------|-----------|---------|-------------|
| P0-2 | PARTIAL | `mcp_server/handlers/ccc-status.ts:37`; `mcp_server/handlers/ccc-reindex.ts:57`; `mcp_server/handlers/ccc-feedback.ts:57`; `mcp_server/tool-schemas.ts:197-218` | The handlers do hardcode `buildUnavailableReadiness('readiness_not_applicable')`. However, schema descriptions for `ccc_status`, `ccc_reindex`, and `ccc_feedback` do not advertise readiness; `ccc_status` advertises availability/index existence/recommendation instead. This looks like an undocumented N/A readiness block, not proven fake readiness. | Revise packet 038 scope: document CCC readiness as N/A or remove the readiness fields from CCC payloads. Implement real CocoIndex readiness only if the intended contract is changed. |

### P1 (high priority)

| ID | Verdict | File:line | Finding | Remediation |
|----|---------|-----------|---------|-------------|
| — | — | — | None | — |

### P2 (nice-to-have)

| ID | Verdict | File:line | Finding | Remediation |
|----|---------|-----------|---------|-------------|
| P2-021-1 | VERIFIED | `mcp_server/handlers/ccc-status.ts:11-19`; `ccc-reindex.ts:16-24`; `ccc-feedback.ts:18-26` | `buildUnavailableReadiness` is duplicated in all three CCC handlers. | Optional cleanup: centralize the helper if CCC payload shape is retained. |

## Convergence Signal

newInfoRatio 0.55: literal code evidence matches, but schema evidence downgrades the finding from a clear release blocker to a contract/documentation decision.
