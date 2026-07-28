---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "implementation"
  - "summary"
  - "template"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/036-code-graph-decommission/001-touchpoint-research"
    last_updated_at: "2026-07-27T16:33:53Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded the decommission phase child"
    next_safe_action: "Populate requirements from the touchpoint research synthesis"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-036-001-touchpoint-research"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-touchpoint-research |
| **Completed** | 2026-07-27 |
| **Level** | 3 |
| **Status** | Complete |
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

A forced-depth three-lane deep-research pass produced the complete touchpoint inventory that every later phase executed against. The synthesis proved the sweep rule that made the whole decommission trustworthy: `--hidden --no-ignore` is mandatory, because `--no-ignore` alone drops every dot-prefixed control file.

### Three-lane synthesis

Three executors ran to their full iteration counts: cli-codex (gpt-5.6-sol high, 10 iterations), cli-devin (glm-5-2 free, 5 iterations), and cli-cursor (cursor-grok-4.5-high, 5 iterations). The merged synthesis in `research/research.md` carries the cited touchpoint inventory bucketed by consumer and mutation class, the ordering graph stating which decouplings must precede which, and a per-consumer removal-vs-fallback recommendation.

### Refuted-claims ledger

Two claims that looked like touchpoints were refuted during verification and recorded so no later phase reinstates them: `.pi/mcp.json` is not a fourth MCP registration (its servers are `sequential_thinking`, `mk-spec-memory`, `mk_skill_advisor`, and `code_mode`), and no Pi freshness hook exists at `.pi/extensions/` (the hit resolved to a copy inside `.worktrees/`, not the working tree).

### Files Changed

<!-- Include for Level 1-2. Omit for Level 3/3+ where the narrative carries. -->

| File | Action | Purpose |
|------|--------|---------|
| `research/research.md` | Created | Canonical synthesis across all three lanes |
| `research/lineages/**` | Created | Per-lineage loop state, iterations, and deltas |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

<!-- Voice guide:
     Tell the delivery story. What gave you confidence this works?
     "All features shipped behind feature flags" not "Feature flags were used."
     For Level 1: a single sentence is enough.
     For Level 3+: describe stages (testing, rollout, verification). -->

Each lane ran with `--stop-policy=max-iterations` to force full depth rather than early convergence. A post-research `rg --hidden --no-ignore` sweep confirmed no live-surface reference was absent from the inventory, and every entry was assigned to exactly one downstream phase.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

<!-- Voice guide: "Why" column should read like you're explaining to a colleague.
     "Chose X because Y" not "X was selected due to Y." -->

| Decision | Why |
|----------|-----|
| Mandate `--hidden --no-ignore` in every sweep | `--no-ignore` alone drops dot-prefixed control files like `opencode.json` and `.claude/settings.local.json`; a sweep missing either reports a false all-clear |
| Record refuted claims in a ledger | Prevents later phases from chasing archival noise or reinstating disproven touchpoints |
| Exclude `.worktrees/` from residual counts | Worktrees carry full copies and match any sweep; they are neither the working tree nor an edit target |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

<!-- Voice guide: Be honest. Show failures alongside passes.
     "FAIL, TS2349 error in benchmarks.ts" not "Minor issues detected." -->

| Check | Result |
|-------|--------|
| Post-research `--hidden --no-ignore` sweep | PASS — no live-surface reference absent from the inventory |
| Every entry assigned to one downstream phase 003-014 | PASS |
| Confirmed touchpoints carry file:line citations | PASS |
| Refuted-claims ledger bounds archival from live | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

<!-- Voice guide: Number them. Be specific and actionable.
     "Adaptive fusion is enabled by default. Set SPECKIT_ADAPTIVE_FUSION=false to disable."
     not "Some features may require configuration."
     Write "None identified." if nothing applies. -->

1. **Residual count includes fixture/corpora string literals.** The baseline of 560 live files dropped to 50 after execution, with all remaining hits being string literals in fixtures, corpora, and manifests rather than live imports. This was confirmed in later phases, not at research time.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr-rules.md
-->
