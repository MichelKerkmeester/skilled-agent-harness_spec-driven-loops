---
title: "Resource Map — Vitest baseline recovery [system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/003-vitest-baseline-recovery/resource-map]"
description: "Flat inventory of files this packet touched. Implementation by cli-codex gpt-5.5 high fast on 2026-05-08."
trigger_phrases:
  - "vitest baseline recovery resource map"
  - "026/000/006 resource map"
importance_tier: "normal"
contextType: "general"
---
# Resource Map — Vitest baseline recovery

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: resource-map-core | v2.2 -->

## Triage data

| Path | Action | Notes |
|------|--------|-------|
| `scratch/vitest-baseline-pre-recovery.json` | Created | Full vitest JSON output before any fixes; 11,587 passing / 198 failing / 33 skipped. |
| `scratch/vitest-baseline-post-recovery.json` | Created | Post-fix run; 11,612 passing / 196 failing / 35 skipped. |
| `scratch/triage-inventory.json` | Created | Per-test classification into 4 buckets (drift/regression/environmental/flaky). |

## Fixture-drift fixes (sample paths — full list in scratch/triage-inventory.json)

Each fix carries a `// drift: <packet>` comment naming the originating packet:

- `mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts`
- `mcp_server/skill_advisor/tests/scorer/projection-fallback-049-005.vitest.ts`
- 16 other test files across `skill_advisor/tests/scorer/`, `tests/hooks/`, `tests/scaffold/`, `tests/alignment/`, `tests/code-graph/`.

## Annotations applied (no behavior change)

| Bucket | Annotation pattern | Count |
|--------|---|---:|
| environmental | `it.skip` + `// REASON: <env requirement>` | 28 |
| runtime-regression | `it.fails.skip` + `// followup: 026/000/002-vitest-baseline-recovery-followup` | 152 |

## Changelog correction

| Path | Action | Notes |
|------|--------|-------|
| `.opencode/skills/system-spec-kit/changelog/v3.4.1.0.md` | Modified | Verification table row "Core test suites (vitest)" replaced with measured baseline (post-recovery 11,612 passing / 196 failing / 35 skipped). Pointer to this packet for triage detail. |

## Spec docs (this packet)

| Path | Action | Notes |
|------|--------|-------|
| `spec.md` | Created | 9 reqs across 3 priority tiers; 4-bucket triage taxonomy. |
| `plan.md` | Created | 3 phases (triage, fix-or-skip, verify). |
| `tasks.md` | Created | T001+ task decomposition. |
| `checklist.md` | Created | CHK-* IDs for every REQ. |
| `implementation-summary.md` | Created | cli-codex dispatch summary with bucket counts. |
| `description.json` | Created | Packet metadata (status: complete, completion_pct: 100). |
| `graph-metadata.json` | Created | Graph metadata. |
| `changelog.md` | Created | Per-packet changelog (this release). |
| `resource-map.md` | Created | This file. |

## Counts

- **Tests classified**: 198 (4 buckets).
- **Tests fixed in-packet**: 18 fixture-drift.
- **Tests escalated**: 152 runtime-regression → `026/000/002-vitest-baseline-recovery-followup`.
- **Tests skipped (environmental)**: 28.
- **Tests skipped (flaky)**: 0.
- **Net delta**: +25 passing, -2 failing, +2 skipped.
- **Spec docs (this packet)**: 9.
- **Total file touches**: ~50 (test files modified + spec docs + scratch artifacts).

## Verification surfaces

- Pre-recovery vitest baseline: 11,587 passing / 198 failing / 33 skipped.
- Post-recovery vitest baseline: 11,612 passing / 196 failing / 35 skipped.
- Strict spec validation: exit 0.
- v3.4.1.0 changelog row corrected.

## Follow-up

The 196 remaining failures are tracked via annotation comments (`// followup: 026/000/002-vitest-baseline-recovery-followup`). Operators can `grep -rn 'followup: 026/000/007'` to inventory the deferred work. The follow-up packet itself is not scaffolded in this release.
