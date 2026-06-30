---
title: "Implementation Summary: Fable-mode efficiency surface map + ranked recommendations (Complete)"
description: "Research-only round 2: a 6-lineage deep-research sweep mapped every adjustable Public-repo surface and produced a ranked, tiered (A doctrine / B mechanism / C measurement), deduped-vs-round-1 recommendation map. The findings drove sibling implementation phases 003-009. No framework surface was edited this round."
trigger_phrases:
  - "implementation"
  - "summary"
  - "fable-mode efficiency research"
  - "149 recommendations map"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/114-operate-like-fable-5/002-fable-mode-efficiency-research"
    last_updated_at: "2026-06-16T07:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Reconciled research-packet docs; implementation in phases 003-009"
    next_safe_action: "Research arc complete; implementation shipped in sibling phases 003-009"
    blockers: []
    key_files:
      - "recommendations.md"
      - "research/research.md"
      - "research/deep-research-findings-registry.json"
      - "research/fanout-attribution.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "opus-002-fable-mode-efficiency-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-fable-mode-efficiency-research |
| **Status** | Complete |
| **Completed** | 2026-06-15 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

<!-- Voice guide:
     Open with a hook: what changed and why it matters. One paragraph, impact first.
     Then use ### subsections per feature. Each subsection: what it does + why it exists.
     Write "You can now inspect the trace" not "Trace inspection was implemented."
     NO "Files Changed" table for Level 3/3+. The narrative IS the summary.
     For Level 1-2, a Files Changed table after the narrative is fine.
     Reference: specs/system-spec-kit/020-mcp-working-memory-hybrid-rag/implementation-summary.md -->

This packet is research, not code. It answered one question: across this repo, where can fable-5 operating logic actually be added so it changes behavior, and which of those changes give the most behavioral leverage per unit of cost and blast radius. The deliverable is `recommendations.md`, a ranked, tiered, sign-off-ready map that the owner then approved and that drove the implementation phases 003 through 009. Nothing in the framework was edited here; this round was deliberately recommend-only.

### The surface map and the ranked recommendations

`recommendations.md` enumerates every adjustable surface (AGENTS.md and CLAUDE.md sections, the constitutional memories, the skills, the agents, the commands, and the hot mechanisms: the live per-turn skill-advisor hook, the deep-loop runtime, executor-config) and scores each candidate delta by `Leverage / (Cost + Blast)`, tagged with how many lineages backed it and whether it duplicates round 1. The recommendations are tiered: Tier A is doctrine text into hot surfaces, Tier B is the mechanism core (ride the live hook for a compact governor, inject the governor into subagent prompts, make executor provenance fail loud), and Tier C is measurement (a leak-test-style behavioral metric so efficiency is measured, not asserted).

### The one-line thesis the research converged on

Round 1 already landed the doctrine in the highest-read text. Round 2's leverage is mechanism plus measurement, sequenced structural-first: make provenance honest, open the subagent governor channel, ride the live per-turn hook with a compact generic governor, then measure the change. The source's own honesty framing applies: this steers efficiency (token burn, context decay, result-first output), not capability.

### Deliverable artifacts

- `recommendations.md` (the sign-off deliverable: ranked Tier A/B/C surface×delta map, deduped vs round 1)
- `research/research.md` (the merged synthesis across all lineages, with convergence detail)
- `research/deep-research-findings-registry.json` and `research/fanout-attribution.md` (per-lineage attribution)
- `research/lineages/` (per-lineage sub-packets)
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

<!-- Voice guide:
     Tell the delivery story. What gave you confidence this works?
     "All features shipped behind feature flags" not "Feature flags were used."
     For Level 1: a single sentence is enough.
     For Level 3+: describe stages (testing, rollout, verification). -->

The research ran as a heterogeneous deep-loop fanout across six lineages and was consolidated by `fanout-merge`: `codex-xhigh` (gpt-5.5 xhigh, the convergence anchor), `opus-account2` plus `opus-account2-r4` (claude-opus-4-8 run twice, the second a reproducibility pass that re-derived the same ranking), `deepseek-v4-pro`, `mimo-v25-pro`, and `kimi-k2p7` (partial, 4 iterations before it wedged and was salvaged). Cross-lineage agreement was recorded per recommendation (the governor capsule and the mutation-check discipline both reached 6/6). The merged synthesis lives in `research/research.md`; the ranked map was extracted into `recommendations.md`, deduped against round 1's shipped set so nothing already-landed was re-recommended. The owner reviewed the map and approved implementation, which shipped in sibling phases 003 (measurement) through 009 (evidence contract).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

<!-- Voice guide: "Why" column should read like you're explaining to a colleague.
     "Chose X because Y" not "X was selected due to Y." -->

| Decision | Why |
|----------|-----|
| Keep this round research-only and stop for sign-off | Mechanism and measurement recommendations are higher-blast than doctrine text, so the owner wanted to approve them item-by-item before any surface was touched. |
| Score by `Leverage / (Cost + Blast)` and tag convergence per item | Makes the ranking legible and lets the owner see which recommendations multiple independent lineages agreed on versus single-lineage outliers. |
| Sequence the recommendations structural-first | Provenance honesty and the subagent governor channel are enforced code that survives context decay and is visible to subagents, so they should land before advisory text that decays. |
| Run a second opus lineage as a reproducibility pass | A re-derivation of the same ranking from an independent run raised confidence that the map was not an artifact of one model's framing. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

<!-- Voice guide: Be honest. Show failures alongside passes.
     "FAIL, TS2349 error in benchmarks.ts" not "Minor issues detected." -->

| Check | Result |
|-------|--------|
| Merged `research/research.md` present and synthesized across lineages | PASS, 6 lineages merged with per-lineage attribution in `fanout-attribution.md` |
| `recommendations.md` ranked, tiered (A/B/C), and deduped vs round 1 | PASS, every item tagged tier + leverage + blast + convergence + dedup |
| Kimi lineage degraded mid-run | PARTIAL, kimi-k2p7 reached 4 iterations then wedged; salvaged and flagged, did not block the merge |
| `validate.sh --strict` on this packet | PASS |
| Implementation traceability | PASS, recommendations map onto shipped phases (measurement→003, doctrine→004, governor capsule→005, subagent/recursion→006, sk-code rituals→007, provenance→008, evidence contract→009) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

<!-- Voice guide: Number them. Be specific and actionable.
     "Adaptive fusion is enabled by default. Set SPECKIT_ADAPTIVE_FUSION=false to disable."
     not "Some features may require configuration."
     Write "None identified." if nothing applies. -->

1. **Research-only.** No framework surface was edited in this packet. Every recommendation was deferred to a gated, owner-approved follow-up; those follow-ups shipped as sibling phases 003-009.
2. **One degraded lineage.** The kimi-k2p7 lineage wedged after 4 iterations and was salvaged rather than completed, so its contribution is partial. The 6/6 convergence claims rest on the other five lineages agreeing; kimi did not contradict them.
3. **Scoring is an ordering aid, not precision.** The `Leverage / (Cost + Blast)` scores are 1-5 estimates meant to rank candidates, not to be read as exact measurements.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
