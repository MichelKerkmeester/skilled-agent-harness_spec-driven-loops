---
title: "Changelog: Phase 1: Deep-Research Install/Scripts/Doctor Realignment"
description: "A 7-iteration deep-research loop cataloged 45 post-CocoIndex and post-116 drift findings across operator-facing install guides, setup scripts and /doctor commands, with an authoritative DB-path resolution table and rework phasing."
trigger_phrases:
  - "deep research install scripts doctor"
  - "post-cocoindex install drift"
  - "116 rename install doctor impact"
  - "doctor realignment research findings"
  - "install guide drift 45 findings"
importance_tier: "normal"
contextType: "research"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-26

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/003-install-scripts-doctor-realignment/001-deep-research-install-scripts-doctor` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/003-install-scripts-doctor-realignment`

### Summary

The CocoIndex deprecation (014 arc) and the 116 deep-skill-evolution renames left operator-facing install guides, setup scripts and `/doctor` commands describing a world that no longer exists. Three competing code-graph DB path claims and three competing deep-loop DB path claims appeared across docs, configs and doctor routes with no single source of truth.

A 7-iteration deep-research loop (cli-codex gpt-5.5, reasoning=high, service_tier=fast) cataloged 45 drift findings across those surfaces. The loop also ran one in-orchestrator source-of-truth pass (iteration 7) to resolve the DB-path contradiction by reading the actual DB-open source. The full finding catalogue, the authoritative current-truth path table and recommended rework phasing are in `research/research.md`. Findings are segmented into CORE (install guides, scripts, `/doctor` including the `.claude` mirror) versus ADJACENT-116 (advisor fixtures, routing corpus, optimizer manifest, contract tests and `.gemini` deep command), so the sibling rework phases can target each surface separately.

### Added

None. Research-only phase.

### Changed

None. Research-only phase.

### Fixed

None. Research-only phase.

### Verification

- Loop state reduce (7 iters): PASS, corruptionCount 0, 45 findings / 26 ruled-out
- Resource-map emit: PASS, `research/resource-map.md` written
- `validate.sh 001 --strict`: 0 errors (2 continuity warnings cleared by implementation-summary + memory save)
- DB-path claims: Resolved from source at `readiness-marker.ts:20`, `code-graph-db.ts:264`, `coverage-graph-db.ts:238` and skill READMEs. Code-graph DB canonical path is `.opencode/.spec-kit/code-graph/database/code-graph.sqlite`. Deep-loop DB canonical path is `.opencode/skills/deep-loop-runtime/database/deep-loop-graph.sqlite`
- Synthesis artifact: `research/research.md` contains 45 findings, path table and rework phasing across 7 iterations

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `research/research.md` | Created | Canonical synthesis: 45 findings, path table, rework phasing |
| `research/resource-map.md` | Created | Reducer-generated resource map from deltas |
| `research/iterations/iteration-001.md` through `iteration-007.md` | Created | Per-iteration discovery narratives |
| `research/deltas/iter-001.jsonl` through `iter-007.jsonl` | Created | Structured per-iteration findings for state reducer |
| `research/deep-research-config.json` + `deep-research-state.jsonl` + `deep-research-strategy.md` + `deep-research-dashboard.md` + `findings-registry.json` | Created | Loop state machine artifacts |

### Follow-Ups

- Prioritize ADJACENT-116 findings A-01 and A-02 (advisor regression fixture and routing-accuracy corpus) in the sibling phase: they are live advisor correctness bugs because the advisor scores itself against `sk-deep-*` skill ids that no longer exist.
- Verify the latent `config.ts:14` `defaultDir` mismatch against the documented `.spec-kit/code-graph/database` default and file a targeted fix if the discrepancy survives current HEAD.
- Re-bless the 197-prompt routing corpus and address `fusion.ts` dead bonus branches once a scorer-owner follow-up packet is scoped.
