---
title: "Full spec-kit advisor import decoupling"
description: "Isolate system-spec-kit from advisor source imports by moving advisor-owned hooks, tests, and stress coverage into system-skill-advisor and replacing residual spec-kit imports with local seams or process-boundary gateways."
trigger_phrases:
  - "013/009/019"
  - "spec-kit advisor decoupling"
  - "full import isolation"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/022-system-skill-advisor-extraction/019-spec-kit-advisor-decoupling"
    last_updated_at: "2026-05-15T06:55:00Z"
    last_updated_by: "codex"
    recent_action: "Moved advisor-owned hooks/tests/stress coverage and removed spec-kit advisor source imports."
    next_safe_action: "Resolve external full-suite blockers before commit/push."
    blockers:
      - "Full advisor npm test fails on existing skill inventory/spec-path issues unrelated to the import move."
      - "Full spec-kit npm test has historical suite failures outside this packet."
    key_files:
      - ".opencode/skills/system-skill-advisor/hooks/"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/"
      - ".opencode/skills/system-skill-advisor/mcp_server/stress_test/"
      - ".opencode/skills/system-spec-kit/mcp_server/hooks/"
      - ".opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts"
    completion_pct: 85
    open_questions:
      - "Should the unrelated full-suite blockers be handled in this packet or a separate repair packet?"
    answered_questions:
      - "Operator narrowed 011 Q5: no spec-kit to advisor sibling imports."
---
# Full Spec-Kit Advisor Import Decoupling

## Executive Summary

This packet supersedes the narrower `019-advisor-schema-boundary-contract` follow-on from 018. The operator narrowed the target to full import isolation: `system-spec-kit` must not import advisor source from inside its MCP server tree.

The implementation moves advisor-owned hooks, skill-graph tests, and stress coverage into `system-skill-advisor`; leaves spec-kit hook files as thin process-boundary stubs; drops residual advisor schema exposure from spec-kit; and removes neutral re-export seams. Verification is partially green, but full-suite gates remain blocked by unrelated repository state.

## Metadata

| Field | Value |
|-------|-------|
| Level | 3 |
| Priority | P0 |
| Status | Blocked on external verification gates |
| Created | 2026-05-15 |
| Branch | `main` |

## Problem

`system-spec-kit/mcp_server` still contained advisor source imports after advisor extraction. That kept the packages coupled in-process, contradicted the operator directive, and allowed tests/hooks owned by advisor to remain under spec-kit.

## Purpose

Make advisor code self-contained in `system-skill-advisor`, with spec-kit communicating through local utilities or process/MCP boundaries only.

## Scope

In scope:
- Move advisor prompt hooks for Claude, Codex, and Gemini into `system-skill-advisor/hooks`.
- Keep spec-kit runtime hook compatibility through thin executable stubs only.
- Move advisor-owned unit and stress tests into `system-skill-advisor/mcp_server`.
- Remove spec-kit advisor schema imports and neutral advisor re-export seams.
- Keep the plugin bridge as a process-boundary gateway, not an in-process source import.
- Document continuity in the 019 packet and parent handover.

Out of scope:
- Tool/server/skill id renames.
- Fixing unrelated full-suite failures in graph health, historical spec path references, or untracked skill metadata.
- Reworking `review-10iter` artifacts.
- Replacing the plugin gateway with a new transport.

## Requirements

| ID | Requirement | Acceptance Criteria | Status |
|----|-------------|---------------------|--------|
| REQ-001 | Remove direct `system-skill-advisor` imports from spec-kit MCP code. | Exact audit grep returns zero lines. | Met |
| REQ-002 | Remove broader advisor source imports from spec-kit MCP code. | Broad source import grep returns only plugin-gateway test imports. | Met |
| REQ-003 | Move advisor-owned hooks to advisor package. | Four hook sources live under `system-skill-advisor/hooks`; spec-kit contains stubs only. | Met |
| REQ-004 | Move advisor-owned tests and stress tests. | Skill-graph, hook, rebuild, and advisor stress tests live under advisor. | Met |
| REQ-005 | Drop advisor schema exports from spec-kit. | `tool-input-schemas.ts` has no advisor schema import or advisor tool schema entries. | Met |
| REQ-006 | Verify package health. | Typechecks/builds pass; full suites must pass before commit. | Blocked |

## Success Criteria

- Exact import audit: zero `from.*system-skill-advisor` lines in spec-kit MCP tree.
- Broad source audit: zero advisor source imports in spec-kit MCP tree, excluding plugin gateway tests.
- Advisor targeted moved tests pass.
- Advisor stress smoke passes.
- Both package typechecks pass.
- Hook smoke emits an advisor brief from the advisor hook location.
- Full package suites, strict validates, commit, and push occur only after unrelated blockers are resolved.

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Runtime configs still point at spec-kit dist hook paths. | Advisor hooks might not fire if stubs are removed too early. | Keep thin process stubs in spec-kit that execute advisor compiled hooks. |
| Tests import executable stubs as modules. | Vitest can block on stdin reads. | Advisor behavior tests moved to advisor; spec-kit parity stress reduced to config wiring. |
| Full-suite failures unrelated to packet. | Cannot honestly commit/push under verification rules. | Record blockers and avoid completion/commit claims. |

## Decisions

- Advisor owns prompt-hook logic. Spec-kit stubs are compatibility launchers only.
- Advisor tests move with advisor source. Spec-kit tests may keep plugin gateway coverage because that is a process boundary.
- Neutral re-export seams are removed or made local in spec-kit when the utility is still needed.
- The plugin bridge stays in spec-kit as a gateway because it calls the advisor MCP server over stdio and does not import advisor source.

## Open Questions

- Whether to fix the current graph-health and lane-sweep failures in this packet or split them into a separate repair packet.
