---
title: "D3-R7 — Registry static-audit gate"
description: "Add scanHubRegistry() beside scanConnectivity in d5-connectivity.cjs and emit BLOCKED-BY-REGISTRY on structural registry defects."
trigger_phrases:
  - "d3-r7 registry static audit"
  - "hub registry scan design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D3-R7 — Registry static-audit gate

## 1. OBJECTIVE
Add a `scanHubRegistry()` check beside `scanConnectivity` in `d5-connectivity.cjs` that reports `missingModes`, `deadPackets`, `packetNameMismatches`, `aliasCollisions`, and `uncoveredIntentRate`, emitting `BLOCKED-BY-REGISTRY` on defect.

## 2. WHY
The registry is structurally clean today (5 modes, 56 aliases, 0 alias collisions, 5/5 packet+name parity) but nothing guards that state, and 46.5% of raw hub keywords are uncovered/untyped. A static gate keeps the clean baseline from silently rotting.

## 3. TARGET & CLASS
- **Target file(s):** `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs`
- **Severity:** P1
- **Enforcement class:** enforceable
- **Dimension:** D3 — Routing & Utilization

## 4. BUILD OUTLINE
- Add `scanHubRegistry()` next to `scanConnectivity`.
- Compute missingModes, deadPackets, packetNameMismatches, aliasCollisions, uncoveredIntentRate.
- Emit `BLOCKED-BY-REGISTRY` (P0 hard-gate pattern) on any defect.

## 5. ACCEPTANCE
- `d5-connectivity.cjs` passes on the clean registry (0 alias collisions, 5/5 parity) and emits `BLOCKED-BY-REGISTRY` when a seeded dead packet / alias collision is introduced.

## 6. EVIDENCE
- `d5-connectivity.cjs:10` — `scanConnectivity` neighborhood where the registry scan attaches.
- Source: `research/research.md` §6 (D3-R7).

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
