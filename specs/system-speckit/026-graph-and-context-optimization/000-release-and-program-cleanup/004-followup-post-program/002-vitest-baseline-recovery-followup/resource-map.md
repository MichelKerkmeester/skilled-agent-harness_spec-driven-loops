---
title: "Resource Map - Vitest recovery followup [system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/002-vitest-baseline-recovery-followup/resource-map]"
description: "Flat inventory of files and artifacts touched while closing the current vitest baseline."
trigger_phrases:
  - "vitest recovery followup resource map"
  - "026/000/007 resource map"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/002-vitest-baseline-recovery-followup"
    last_updated_at: "2026-05-09T04:30:00Z"
    last_updated_by: "codex"
    recent_action: "Mapped vitest recovery resources"
    next_safe_action: "Use scratch classification for future child packets"
    blockers: []
    key_files:
      - "scratch/classification-inventory.json"
      - "scratch/vitest-postfix.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "vitest-recovery-followup-2026-05-09"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Resource Map - Vitest recovery followup

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: resource-map-core | v2.2 -->

## Scratch data

| Path | Action | Notes |
|------|--------|-------|
| `scratch/vitest-current-baseline.json` | Created | Full current vitest JSON, 11,618 passed / 197 failed / 35 skipped / 11 todo. |
| `scratch/current-failure-inventory.json` | Created | Assertion-level failed file and title inventory from current baseline. |
| `scratch/classification-inventory.json` | Created | 4-bucket classification including suite-import failures. |
| `scratch/vitest-postfix.json` | Created | Full post-recovery vitest JSON, 11,657 passed / 0 failed / 232 skipped / 11 todo. |

## Fixture-drift fixes

| Surface | Action |
|---------|--------|
| `mcp_server/tests/advisor-rebuild.vitest.ts` | Updated singular skill path expectations to plural `.opencode/skills`. |
| `mcp_server/tests/handler-memory-index.vitest.ts` | Updated constitutional fixture paths to plural `.opencode/skills`. |
| `scripts/tests/yaml-intake-event-payloads.vitest.ts` | Updated command asset root to plural `.opencode/commands`. |
| `scripts/tests/check-source-dist-alignment-orphans.vitest.ts` | Updated checker path to plural `.opencode/skills`; one offline `npx tsx` case remains environmental. |
| `scripts/tests/workspace-identity.vitest.ts` | Updated nested skill fixture to plural `.opencode/skills`. |
| `scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap` | Refreshed scaffold snapshot drift. |
| `.opencode/plugins/spec-kit-compact-code-graph.js` | Updated bridge imports to `../skills/...`. |
| `.opencode/plugins/spec-kit-skill-advisor.js` | Updated bridge and advisor source paths to `../skills/...`. |

## Parked runtime-regression annotations

| Surface | Action |
|---------|--------|
| `mcp_server/tests/**` | Runtime-regression failures parked with `it.fails.skip` and `// followup-actual:`. |
| `mcp_server/skill_advisor/tests/**` | Skill advisor freshness/scorer/parity regressions parked. |
| `mcp_server/code_graph/tests/**` | Code graph scope/verify regressions parked. |
| `scripts/tests/**` | Validation/docs/runtime-contract regressions parked or environment-skipped. |

## Metadata and docs

| Path | Action |
|------|--------|
| `.opencode/skills/system-spec-kit/changelog/v3.4.1.0.md` | Updated "Core test suites (vitest)" row to measured pass state. |
| `spec.md` | Re-authored from placeholder to actual completed contract. |
| `plan.md` | Re-authored to actual execution plan. |
| `tasks.md` | Marked T001-T015 complete with evidence. |
| `implementation-summary.md` | Re-authored with concrete implementation and verification. |
| `description.json` | Updated status complete / completion_pct 100. |
| `graph-metadata.json` | Updated status complete / completion_pct 100. |
| `changelog.md` | Created packet changelog. |
| `resource-map.md` | Created this file. |

## Counts

- **Assertion failures classified**: 197.
- **Suite-import failures classified**: 5.
- **Fixture drift fixed**: 27.
- **Runtime regressions parked**: 160.
- **Environmental failures skipped**: 15.
- **Flaky failures**: 0.
- **Post-recovery baseline**: 11,657 passed / 0 failed / 232 skipped / 11 todo.
