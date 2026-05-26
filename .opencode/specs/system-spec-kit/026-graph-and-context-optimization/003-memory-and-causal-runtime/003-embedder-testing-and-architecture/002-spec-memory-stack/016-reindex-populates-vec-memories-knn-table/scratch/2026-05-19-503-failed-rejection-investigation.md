---
title: "Investigation: 503 failed in memory_index_scan after packet 016/002/016 ship"
description: "Decomposition of the 503 failed entries from the post-fix memory_index_scan run. Only 2 are sufficiency-gate rejections; the rest are lineage/metadata schema failures."
date: 2026-05-19
investigator: cli-codex gpt-5.5 high fast (via main agent dispatch)
sandbox: read-only
---

# 503 failed memory_index_scan rejections — diagnostic

## Summary

The premise that all 503 failed entries were `INSUFFICIENT_CONTEXT_ABORT` rejections was wrong. Only **2** rows actually carry that rejection code, both constitutional markdown files. The other 501 failures are lineage-alias divergences and stale graph-metadata schema issues that surface inside the same scan but are categorically distinct from the sufficiency gate.

## Source of the sufficiency gate

| File | Line | Role |
|------|------|------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | 470 | Scan marks spec docs `qualityGateMode: 'warn-only'`, then calls the save/index path |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | 497 | Calls `evaluateMemorySufficiency` on the entry being indexed |
| `.opencode/skills/system-spec-kit/shared/parsing/memory-sufficiency.ts` | 315 | Primary evidence = files, observations, decisions, next actions, blockers, outcomes |
| `.opencode/skills/system-spec-kit/shared/parsing/memory-sufficiency.ts` | 343 | Support evidence = meaningful section, context, triggers, anchors |
| `.opencode/skills/system-spec-kit/shared/parsing/memory-sufficiency.ts` | 372 | Manual fallback requires `support >= 3` and `anchors >= 1` when primary is absent |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | 2165 | Failing sufficiency hard-rejects unless structural metadata or warn-only |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/validation-responses.ts` | 38 | Builds the `INSUFFICIENT_CONTEXT_ABORT` envelope |

The decisive line is `useWarnOnly = force || isSpecDoc` at memory-index.ts:470. Spec docs are spared because they pass through warn-only mode. Constitutional files are NOT spec docs, so they hit the strict gate.

## Failure categories and counts

| Category | Failure rows | Insufficient context | Verdict |
|---|---:|---:|---|
| Constitutional markdown | 2 | 2 | Misconfigured gate |
| Active spec folders | 424 | 0 | Index / lineage metadata issue |
| `z_archive` specs | 77 | 0 | Out of scope for sufficiency, stale metadata schemas |
| Other | 0 | 0 | n/a |
| **Total** | **503** | **2** | |

## Representative samples

| File | Failure mode |
|---|---|
| `.opencode/skills/system-spec-kit/constitutional/cli-dispatch-skill-preload.md` | No `ANCHOR` tags, no recognized primary-evidence section |
| `.opencode/skills/system-spec-kit/constitutional/post-implementation-deep-review.md` | Rich rule content, but no `ANCHOR` tags or primary evidence |
| `.opencode/specs/.../z_archive/048-cli-testing-playbooks/graph-metadata.json` | `importance_tier: "high"` violates DB enum |
| `.opencode/specs/.../001-fix-skill-advisor-fail-open-fallback/checklist.md` | Evidence-rich but fails `E_LINEAGE`, not sufficiency |
| `.opencode/specs/.../017-hybrid-fusion-empirical-recalibration/graph-metadata.json` | Legacy graph schema, missing required v1 fields |

## Remediation classes

1. **Constitutional markdown (2 files)** — misconfigured gate. Two paths:
   - Option A: add a `useWarnOnly = isConstitutional` branch alongside the existing `isSpecDoc` branch.
   - Option B: backfill anchors and a primary-evidence section into the constitutional markdown so they pass strict mode.
   - Recommendation: Option A. Constitutional files are policy, not evidence-bearing memory.

2. **Active spec folders (424 rows)** — index / lineage metadata cleanup. Not an evidence gap. Repair tracks:
   - Lineage alias divergences (`E_LINEAGE`).
   - Stale `graph-metadata.json` v0 → v1 schema upgrades.
   - Stale `importance_tier: "high"` rows where the DB enum no longer accepts that value.

3. **`z_archive` specs (77 rows)** — out of scope for sufficiency. Same metadata schema mismatches as class 2 but on archived material. Lower priority since archived specs don't drive active retrieval.

## Estimated effort

**M-L**. Class 1 is a 5-line code change. Class 2 dominates the work: 424 rows of lineage-alias and graph-metadata schema repairs require a migration runner or a script that walks the spec tree and rewrites stale fields. Class 3 piggybacks on class 2's tooling.

## Suggested follow-on packets

| Packet name candidate | Class | Scope |
|---|---|---|
| `018-constitutional-quality-gate-exemption` | 1 | Add `isConstitutional` branch to `useWarnOnly` in `memory-index.ts:470`; document why constitutional files are policy, not evidence |
| `019-lineage-and-metadata-repair-runner` | 2, 3 | One-shot CLI under `scripts/spec/` that walks all spec folders, normalizes `importance_tier`, upgrades v0 `graph-metadata.json` to v1, resolves `E_LINEAGE` alias divergences |

## Notes

- Codex sandbox blocked the requested write to `/tmp`. Report contents were captured from stdout and persisted here by the main agent.
- This file lives under the scratch folder of packet 016/002/016 because that packet's scan run produced the data. Move it to a dedicated investigation packet if it becomes load-bearing.
