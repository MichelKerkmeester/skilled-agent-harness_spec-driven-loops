---
title: "Implementation Summary: preventing sk-design sub-skill context under-loading"
description: "6-iteration GPT-5.5-xhigh (cli-codex, single-lineage fan-out) deep-research run on how to stop AI agents — orchestrator, sub-agents, and small models — from under-loading sk-design sub-skill context in design/UI build work. Converged 10/10 questions. Produced a context-loading contract: register-first, bundle routing, a context manifest, required proof fields, a hard-gate table, sub-agent + MiniMax-M3 dispatch contracts, and an adopt-if-better path. Research only; no live skill changes."
trigger_phrases:
  - "design context loading research summary"
  - "sk-design context under-loading findings"
  - "design context manifest summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/029-design-context-loading"
    last_updated_at: "2026-06-27T14:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Synthesized the converged research and authored the lean spec-folder wrapper"
    next_safe_action: "Open build phase to implement research §15-16 contract"
    blockers: []
    key_files:
      - "spec.md"
      - "research/research.md"
      - "research/deep-research-findings-registry.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "dr-154-029-design-context-loading"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The fix is an enforceable context-loading contract, not 'read more': register-first, bundle-load for build work, a pre-dispatch context manifest, a filled pre-flight/evidence card before any ready claim, model-specific scaffolds, and gated adoption"
      - "Each observed miss maps to a missing proof field: no register proof, no contrast-pair inventory, no pre-flight card, no small-model prompt profile"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete (research phase) |
| **Date** | 2026-06-27 |
| **Level** | 1 |
| **Type** | Deep research (no live code change) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A converged deep-research deliverable: `research/research.md` — the diagnosis plus an enforceable `sk-design` context-loading contract. No live skill content changed.

### Headline
The reliable fix is not "remind agents to read more"; it is a small enforceable contract: (1) classify the register first, (2) for UI build/redesign auto-load a design *bundle* not a single mode, (3) require a context manifest before dispatch/implementation, (4) require a filled pre-flight/evidence card before any ready/release/accessibility claim, (5) embed the same manifest inside model-specific scaffolds (MiniMax-M3 → TIDD-EC dense pre-plan), and (6) adopt lineage recommendations only through a promotion-style gate. The four observed misses map cleanly to missing proof fields.

### Top recommendations (research/research.md §16)
1. Add a `design_context_manifest` requirement for UI build + design-audit tasks.
2. Bundle routing: `interface` stays primary, but build work auto-pairs foundations + pre-flight (+ register/dials).
3. Make `shared/register.md` a hard first read for all design modes and delegated design tasks.
4. Mandatory foreground/background contrast-pair inventory whenever color/text-surface pairs change.
5. Require `interface_preflight_card.md` before final UI delivery; `audit_contract.md` + evidence worksheet for any audit/release claim.
6. Require small-model profile loading before `cli-opencode` dispatch (MiniMax-M3 gets TIDD-EC dense scaffolding carrying the manifest).
7. Treat fan-out recommendations as candidates — merge + attribute first, adopt only through a gate.

### Files Changed
- `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` — created (lean spec-folder wrapper).
- `research/research.md`, `research/resource-map.md`, `research/fanout-attribution.md` — created (deliverable + inventory + attribution).
- `research/deep-research-findings-registry.json`, `research/lineages/gpt55x/**` (state.jsonl, strategy, dashboard, registry, `iterations/iteration-00{1..6}.md`, deltas, prompts) — research state.
- No `.opencode/skills/**` file changed.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A single GPT-5.5 (reasoning xhigh) cli-codex deep-research lineage was dispatched via the deep-loop fan-out runner (`fanout-run.cjs`, one lineage, concurrency 1). The codex subprocess loaded the deep-research SKILL and self-drove init → loop → synthesis into `research/lineages/gpt55x/`, writing fresh-context iteration files + deltas + state-log records. The orchestrator then ran `fanout-merge.cjs` to consolidate the single lineage's registry and promoted the lineage `research.md` to the packet root. The requested `gpt-5.5-fast` / `gpt-5.5-codex` variants are unavailable on this ChatGPT-account Codex (verified 400 "model not supported"); plain `gpt-5.5` @ xhigh was used and validated with an iteration-0 smoke test.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Mechanism design only** — investigate and recommend; change no live `sk-design`/`cli-opencode`/`sk-prompt-models` content. Every fix routes to a future build phase.
- **Single-lineage fan-out for a CLI executor** — used the shipped fan-out runner (the sanctioned path for cli-codex executors) so gpt-5.5 self-drives the whole loop, rather than the orchestrator driving codex per iteration.
- **Executor substitution, flagged** — `gpt-5.5` @ xhigh stands in for the unavailable `gpt-5.5-fast`/`-codex` on this Codex auth.
- **Ruled out**: interface-only routing for UI builds, late contrast audit, ad-hoc audit prose, thin small-model delegation, and automatic adoption from lineage output (see research/research.md §"Eliminated Alternatives").
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- **Iterations**: 6, converged (stop reason: question coverage complete, 10/10). newInfoRatio 1.00 → 0.86 → 0.82 → 0.74 → 0.64 → 0.38.
- **Grounding**: findings cite live-skill `file:line` sources (register.md, interface SKILL + pre-flight card, foundations oklch_workflow, audit_contract, MiniMax-M3 profile, fanout-merge, promotion_gate_contract).
- **State integrity**: lineage fulfilled, exit 0, ~6.5 min; `fanout-merge.cjs` → merged_lineages 1, key_findings 7.
- **Doc validation**: `validate.sh --strict` run on this packet (see final state).
- **No live skill change**: only this phase folder was written.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **Single lineage**: one executor (gpt-5.5), not a multi-model panel; findings are one strong lineage's synthesis, not cross-model triangulation.
- **Executor variant**: `gpt-5.5` not the requested `-fast`/`-codex` (unavailable on this auth).
- **Research only**: no live skill change; the recommendations are intent for a future build phase, which should itself pass the promotion-style adoption gate the research recommends.
- **Two implementation details left open** (research/research.md §17): whether the bundle rule lives only in docs or also in an executable router check, and whether contrast-pair checking is an authored worksheet or a small deterministic script.
<!-- /ANCHOR:limitations -->
