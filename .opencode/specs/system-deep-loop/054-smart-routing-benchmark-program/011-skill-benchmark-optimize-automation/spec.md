---
title: "Spec: Skill-Benchmark Optimize Automation (patch-gen)"
description: "Build the planned loop-host --mode=skill-benchmark-optimize → optimize-skill-benchmark.cjs that turns benchmark signals into propose-by-default router.patch + gold.patch (behind --apply-router/--apply-gold), re-deriving concrete fixes from source, gating every candidate through a mandatory anti-gaming guard and a re-benchmark, and preserving the sk-code parent==union(children) invariant."
trigger_phrases:
  - "skill-benchmark optimize automation"
  - "router patch gold patch"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/054-smart-routing-benchmark-program/011-skill-benchmark-optimize-automation"
    last_updated_at: "2026-07-09T12:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase scaffolded from fresh-Opus analysis"
    next_safe_action: "Build the anti-gaming guard + D3-ex-default diagnostic first (RED/GREEN)"
    blockers: []
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
# Spec: Skill-Benchmark Optimize Automation (patch-gen)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

## 1. METADATA
<!-- ANCHOR:metadata -->
| Field | Value |
|-------|-------|
| **Packet** | 011-skill-benchmark-optimize-automation |
| **Level** | 2 |
| **Status** | Planned |
| **Origin** | Builds the automation that packet 003 documented as "Planned" (`skill-benchmark.md:119`) |
<!-- /ANCHOR:metadata -->

## 2. PROBLEM & PURPOSE
<!-- ANCHOR:problem -->
Optimize-mode is an operator-driven runbook today; packet 003 shipped its docs/methodology but the
`.cjs` engine is unbuilt. This phase builds `optimize-skill-benchmark.cjs` + the loop-host wiring +
tests. Key constraint discovered: the report omits the actual wasted resource *paths*
(`score-skill-benchmark.cjs:1222-1230`), so the optimizer must **re-derive** fixes from source via the
same engine (`routeSkillResources`/`parseRouter`/`scanConnectivity`/`loadPlaybookScenarios`) — which
is also what keeps it honest. The `D3-ex-default` diagnostic stays **optimizer-local** (not a
`scoreD3` change) to avoid the byte-identical-baseline blast radius across all skills.
<!-- /ANCHOR:problem -->

## 3. SCOPE
<!-- ANCHOR:scope -->
- Signal→fix classifier: orphan → wire into a meaningful EXISTING intent, or (index/catalog file) →
  `routing-allowlist.json`, never a fake intent; always-loaded → RESOURCE_MAP/gold; gold-align to the
  declared designed load; intent-gate GENUINE over-routing (via `wasteExDefault`).
- Emit `proposals/{router.patch,gold.patch,optimize-report.{json,md}}` via `git diff --no-index`;
  `--apply-router`/`--apply-gold` apply via `git apply --check` then re-benchmark.
- Mandatory anti-gaming guard (methodology §7): never invent gold, never add misrouting keywords
  (reuse `contamination-lint` vocab + a sibling-regression re-run), no placeholder intents, no blanket
  ALWAYS promotion, re-benchmark gate before emission.
- Hub-aware: edit the CHILD SKILL.md; verify `parent == union(children) + tier` as a hard precondition.
- loop-host mode wiring; flip the command-doc "Planned automation" caveat.

**Out of scope:** auto-inventing new intents (advisory candidates only — anti-gaming §7 boundary).
<!-- /ANCHOR:scope -->

## 4. REQUIREMENTS
<!-- ANCHOR:requirements -->
- **R1:** Propose-by-default — zero target mutation without `--apply-*`.
- **R2:** Every emitted patch survives the anti-gaming guard + a re-benchmark (D5/D3 non-decreasing,
  verdict not lowered, drift guard clean).
- **R3:** Hub fixes never break the union invariant (refuse + flag if they would).
<!-- /ANCHOR:requirements -->

## 5. SUCCESS CRITERIA
<!-- ANCHOR:success-criteria -->
1. RED/GREEN vitest on synthetic skills: orphan→intent, orphan→allowlist, D3-ex-default→gold,
   D3-ex-default→router, anti-gaming rejections, hub drift-guard, propose-by-default, apply-modes.
2. Dry-run reproduces the packet-002 code-review fix class (orphan-wire + gold-align).
3. loop-host `planInvocation('skill-benchmark-optimize', …)` returns a single step; missing args fail.
<!-- /ANCHOR:success-criteria -->

## 6. RISKS & DEPENDENCIES
<!-- ANCHOR:risks -->
- *Auto-invented intents* (highest) → never emit new-intent hunks; allowlist/operator-flag only.
- *Sibling regression from keyword edits* → corpus-wide re-benchmark gate before emission.
- *Patch-apply fragility* → diffs from computed full-file text + `git apply --check`; flag risky hunks.
- Reuses all existing engine modules (no new scoring engine); could ingest phase-010's anti-overfit
  awareness. Pure build — no operator decision.
<!-- /ANCHOR:risks -->

## 7. OPEN QUESTIONS
<!-- ANCHOR:questions -->
None blocking. The one deliberate design boundary (never auto-apply new intents) is settled by the
anti-gaming methodology, not an open decision.
<!-- /ANCHOR:questions -->
