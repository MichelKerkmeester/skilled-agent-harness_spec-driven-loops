---
title: "Implementation Summary: Advisor Realignment"
description: "Advisor routing now recognizes cli-external-orchestration as the hub and resolves cli-opencode as its nested executor."
trigger_phrases:
  - "implementation"
  - "summary"
  - "template"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/028-cli-hub-rename/002-advisor-realign"
    last_updated_at: "2026-07-13T06:08:29Z"
    last_updated_by: "markdown-agent"
    recent_action: "Finalized phase 2 advisor evidence"
    next_safe_action: "Use phase 3 for live references"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "135-cli-hub-rename-doc-finalization"
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
| **Spec Folder** | 002-advisor-realign |
| **Completed** | 2026-07-13 |
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

Advisor and projection metadata now follow the canonical hub path while preserving `cli-opencode` as the concrete workflow packet.

### Deterministic Hub-to-Executor Routing

The local smoke resolves `cli-opencode` with confidence 0.95 and uncertainty 0.20. The routing projection is fresh at `sha256:56e8cceee4c9c7a1eadcdb024e9ac48c9215323bafa96e851abc610dc5a583f0`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

<!-- Voice guide:
     Tell the delivery story. What gave you confidence this works?
     "All features shipped behind feature flags" not "Feature flags were used."
     For Level 1: a single sentence is enough.
     For Level 3+: describe stages (testing, rollout, verification). -->

The hub identity was aligned first, then the generated projection and local advisor result were checked directly.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

<!-- Voice guide: "Why" column should read like you're explaining to a colleague.
     "Chose X because Y" not "X was selected due to Y." -->

| Decision | Why |
|----------|-----|
| Keep hub and executor identities distinct | It preserves parent ownership and concrete workflow routing. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

<!-- Voice guide: Be honest. Show failures alongside passes.
     "FAIL, TS2349 error in benchmarks.ts" not "Minor issues detected." -->

| Check | Result |
|-------|--------|
| Local advisor smoke | PASS: `cli-opencode`, confidence 0.95, uncertainty 0.20. |
| Routing projection freshness | PASS: `sha256:56e8cceee4c9c7a1eadcdb024e9ac48c9215323bafa96e851abc610dc5a583f0`. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

<!-- Voice guide: Number them. Be specific and actionable.
     "Adaptive fusion is enabled by default. Set SPECKIT_ADAPTIVE_FUSION=false to disable."
     not "Some features may require configuration."
     Write "None identified." if nothing applies. -->

1. Repository-wide skill graph validation remains a phase 4 concern because unrelated graph key paths are missing.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
