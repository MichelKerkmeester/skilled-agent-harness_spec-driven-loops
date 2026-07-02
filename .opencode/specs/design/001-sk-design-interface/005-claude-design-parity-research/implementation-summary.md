---
title: "Implementation Summary: Claude Design parity research"
description: "A 10-iteration parallel-by-model deep-research loop produced a cross-checked recommendation for improving sk-design-interface and mcp-magicpath toward Claude Design parity: a shared cross-skill protocol, not a clone, with fidelity verification as the keystone."
trigger_phrases:
  - "claude design parity summary"
  - "sk-design-interface mcp-magicpath research outcome"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/001-sk-design-interface/005-claude-design-parity-research"
    last_updated_at: "2026-06-14T08:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Research complete; parity recommendation synthesized and cross-checked"
    next_safe_action: "Operator reviews research.md; if accepted, open a follow-up implementation packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-148-005-claude-design-parity-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-claude-design-parity-research |
| **Completed** | 2026-06-14 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet is research, not code. It answers how to move `sk-design-interface` and `mcp-magicpath` closer to Claude Design. The deliverable is `research/research.md`. Neither skill was changed.

### The recommendation
Do not clone Claude Design; wire the two existing skills into the loop it has, via a shared `claude-design-parity` protocol built from three durable schemas (design-context snapshot, iteration ledger, handoff manifest) driven by one feedback loop (intent -> render -> screenshot -> compare-to-intent -> targeted revision -> stop). The keystone, on which both lineages agree, is `mcp-magicpath` fidelity verification after `code submit`: today "done" means compiles + responsive, never matches-intent. The hard guardrail: nothing may turn `sk-design-interface` into a templated generator.

### Two independent lineages, reconciled
The run used two parallel by-model lineages so the recommendation does not rest on one model. The opus lineage (via account #2) produced the sharper loop mechanics + scorecard; the gpt-5.5 lineage (with web access) produced the primary-source baseline + the three schemas. They agreed on the shared-protocol thesis and the anti-default guardrail; divergences (quality levers, keystone framing, governance) were resolved toward the lower-risk option in research.md.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/research.md` | Created | Canonical cross-checked parity recommendation |
| `research/lineages/{opus48-claude2,gpt55fast}/` | Created | Per-lineage iterations, registries, syntheses |
| `research/deep-research-findings-registry.json` | Created | Merged 15-finding registry |
| `spec.md`, `plan.md`, `tasks.md`, this file | Created | Packet control docs |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Via the deep-research workflow's machinery: `fanout-run.cjs` spawned two lineages in an async pool (opus-4.8 via `CLAUDE_CONFIG_DIR=~/.claude-account2`, gpt-5.5-fast via cli-opencode), each running a full 5-iteration loop; `fanout-merge.cjs` consolidated the registries; the host web-verified the keystone claim and authored the canonical synthesis. Both lineages succeeded (exit 0).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Shared protocol, not a clone or a merge | Both lineages agree; the depends_on seam is clean, so keep per-skill + one shared protocol |
| Fidelity verification is the keystone | The one gap that closes Claude Design's visual-iteration advantage; both skills define "done" as compiles, not matches-intent |
| Resolve divergences toward lower-risk | The mandate is parity without turning either CLI skill into a web product or a templated generator |
| Stop at recommendation | Operator decision: implementation is a separate follow-up packet |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Fan-out completion | PASS, exit 0, 2/2 lineages succeeded |
| Lineage merge | PASS, `fanout-merge.cjs` merged 2, skipped 0, 15 findings |
| Host web verification | PASS, design-system-inheritance keystone confirmed against the Claude Design setup article |
| Cross-lineage reconciliation | PASS, agreements + resolved divergences in research.md |
| `validate.sh --strict` | PASS (recorded at packet completion) |
| Skills unchanged | PASS, no diff in either skill |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Recommendation only.** No change to either skill; adopting it requires a follow-up implementation packet.
2. **Claude Design internals are not public.** Capabilities are taken from its support docs (gpt lineage + host verified), not internals.
3. **The protocol is a design proposal**, not a built-and-measured loop; the fidelity-compare's practical cost is unmeasured.
<!-- /ANCHOR:limitations -->
