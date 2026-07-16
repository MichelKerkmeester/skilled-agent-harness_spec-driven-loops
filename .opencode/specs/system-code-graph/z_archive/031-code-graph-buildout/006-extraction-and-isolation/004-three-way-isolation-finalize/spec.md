---
title: "Three-way isolation finalize: delete-system-spec-kit-and-others-still-work"
description: "Close the last 1 production import in system-code-graph + the 6 in system-skill-advisor by duplicating symbols into each skill's lib/shared/, then drop @spec-kit/shared as a dependency. After this, system-spec-kit can be deleted without breaking either of the other two system skills."
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/031-code-graph-buildout/006-extraction-and-isolation/004-three-way-isolation-finalize"
    last_updated_at: "2026-05-15T20:50:00Z"
    last_updated_by: "main-agent-040-init"
    recent_action: "audit_complete_dispatch_ready"
    next_safe_action: "dispatch_2_parallel_cli_opencode_batches"
    blockers: []
    key_files:
      - "spec.md"
    completion_pct: 5
    open_questions: []
    answered_questions:
      - "Strategy: duplicate locally (per user choice 2026-05-15)"
      - "@spec-kit/shared dependency: REMOVE from both consumer skills' package.json after duplication; system-spec-kit/shared/ becomes internal to system-spec-kit"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Three-way Isolation Finalize

<!-- SPECKIT_LEVEL: 1 -->

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Source** | User directive 2026-05-15: "All 3 system skills need to be completely isolated — users can delete system-spec-kit and expect a functioning system-code-graph + system-skill-advisor" |
| **Executor** | `cli-opencode --pure --model deepseek/deepseek-v4-pro --variant max` |
| **Concurrency** | 2 (one per skill, disjoint scopes) |

## 2. PROBLEM

After packet 038 + parallel 058 work, system-code-graph has 1 production cross-skill import (`handlers/query.ts:14`) and system-skill-advisor has 6 (across `lib/freshness.ts`, `lib/prompt-policy.ts`, `lib/render.ts`, `lib/skill-advisor-brief.ts` + 2 `dist/*.d.ts`). Both skills also declare `@spec-kit/shared` as a `file:` dependency in their package.json, where `@spec-kit/shared` physically lives at `.opencode/skills/system-spec-kit/shared/`. Deleting system-spec-kit today kills both other skills.

## 3. SOLUTION

**Strategy: Duplicate locally.** Each consumer skill gets its own `mcp_server/lib/shared/` (system-code-graph already has this pattern from Path-1). After duplication, both consumer skills drop their `@spec-kit/shared` dependency declarations from package.json. system-spec-kit's `shared/` stays where it is but becomes internal-only.

### Symbol duplication map

**system-code-graph (1 import — `handlers/query.ts:14`):**
- Add to `mcp_server/lib/shared/shared-payload.ts` (which already exists from Path-1):
  - `attachGraphEdgeEnrichment` (function)
  - `attachStructuralTrustFields` (function)
  - `EdgeEvidenceClass` (type)
  - `HotFileBreadcrumb` (type)
- Update `handlers/query.ts:14` to import from `../lib/shared/shared-payload.js`.
- Remove `@spec-kit/shared` line from `package.json` dependencies.
- Run `npm install` to refresh lockfile.

**system-skill-advisor (6 imports — 4 production + 2 .d.ts):**
- Create new `mcp_server/lib/shared/` directory.
- Add `shared-payload.ts` containing:
  - `AdvisorEnvelopeMetadata`, `AdvisorEnvelopeFreshness`, `AdvisorEnvelopeStatus` (types)
  - `SharedPayloadEnvelope`, `SharedPayloadSection`, `SharedPayloadSourceRef`, `SharedPayloadTrustState` (types)
- Add `unicode-normalization.ts` containing:
  - `canonicalFold` (function) + `CANONICAL_FOLD_VERSION` (const) + any helpers it depends on
- Update 4 consumer files (`freshness.ts`, `prompt-policy.ts`, `render.ts`, `skill-advisor-brief.ts`) to import from `../lib/shared/*.js`.
- Remove `@spec-kit/shared` line from `mcp_server/package.json` dependencies.
- Run `npm install` to refresh lockfile.
- Re-run build to regenerate dist `.d.ts` (they'll point at the new local paths).

## 4. REQUIREMENTS

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | Zero production cross-skill imports in system-code-graph | `grep -rEh "from ['\"][^'\"]*system-spec-kit" .../system-code-graph/mcp_server --include='*.ts' \| grep -vE '/tests/\|/stress_test/' \| wc -l` returns 0 |
| REQ-002 | Zero production cross-skill imports in system-skill-advisor | Same grep for skill-advisor returns 0 |
| REQ-003 | Neither consumer skill declares `@spec-kit/shared` as a dependency | `grep '"@spec-kit/shared"' .../system-code-graph/package.json .../system-skill-advisor/mcp_server/package.json` returns 0 |
| REQ-004 | TypeScript compiles cleanly for both skills | tsc --noEmit exit 0 for both |
| REQ-005 | Smoke test: rename system-spec-kit/ temporarily, verify other 2 skills still tsc-pass | Manual or scripted check |
| REQ-006 | CI isolation-check.yml extended to enforce skill-advisor reverse-direction too | Existing code-graph rule + new skill-advisor rule, both blocking |

## 5. OUT OF SCOPE

- Modifying `system-spec-kit/shared/`'s content (it stays as-is, internal to spec-kit).
- Tests + stress_test directory imports (test refactor is a separate packet if pursued; production isolation is the bar this packet meets).
- `.d.ts` files in dist/ — those regenerate from source on `npm run build`.
- The `system-spec-kit` skill itself.
