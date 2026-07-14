---
title: "Implementation Summary: system-skill-advisor README"
description: "The system-skill-advisor README now reads in the narrative voice and leads with standalone Gate 2 routing that scores with calibrated confidence and refuses on a stale index, with three stale facts corrected."
trigger_phrases:
  - "system-skill-advisor readme shipped"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/109-skill-readme-standardization/022-system-skill-advisor-readme"
    last_updated_at: "2026-06-07T16:45:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped system-skill-advisor README; Batch E 2 of 3"
    next_safe_action: "Begin phase 023 (system-spec-kit README, keep depth)"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-022"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Voice rewrite with three stale facts corrected: embedder described as a pluggable registry that defaults via a local-first cascade to a local model (dropped the stale single-manifest claim and the count), advisor_recommend options now include includeAbstainReasons, changelog link points to the directory; preserved nine MCP tools, five live lane weights, four-value trust model; all cited paths resolve"
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
| **Spec Folder** | 022-system-skill-advisor-readme |
| **Completed** | 2026-06-07 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The system-skill-advisor README now opens with a human pitch and an at-a-glance table, explains the misrouting and stale-index problem before the mechanism, and leads with the distinctive value: standalone Gate 2 routing that answers "which skill should handle this prompt" with a calibrated, prompt-safe score and refuses to answer on a stale or absent index rather than fabricate a recommendation the runtime would trust.

### Narrative rewrite

HOW IT WORKS covers the five-lane scorer and prompt-safe attribution, the freshness and trust contract with its daemon, the SQLite skill graph and the pluggable embedder, then closes with a nine-tool reference table. QUICK START shows an `advisor_status` then `advisor_recommend` then `advisor_rebuild` sequence with expected output. INTEGRATION sets the boundary with the target skills, with system-spec-kit and with system-code-graph. It is 218 lines and HVR-clean in prose.

### Facts preserved and corrected

Preserved: the nine MCP tools (four advisor plus five skill-graph, the last trusted-caller gated), the five live lane weights (0.42 / 0.28 / 0.13 / 0.12 / 0.05), the four-value trust model (live, stale, absent, unavailable), the daemon contract (watch, bump generation, no auto-rebuild) and the corpus and holdout baselines. Corrected three stale claims: the embedder is now described as a pluggable registry that defaults through a local-first cascade to a local model (the prior "single shipped manifest" claim was stale, the shared registry holds seven manifests today), `advisor_recommend` now lists all three options including `includeAbstainReasons`, and the changelog link points to the directory rather than one old version file. No version line was present or added.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-skill-advisor/README.md` | Modified | Narrative-voice rewrite of the Gate 2 routing README |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A two-iteration deep-context sweep ran DeepSeek v4 Pro and MiMo v2.5 Pro as read-only seats. The models converged on the tools, the lane weights and the trust model, and diverged on one point: DeepSeek flagged the embedder "single manifest" claim as stale while MiMo called it consistent. The host check of `INSTALL_GUIDE.md` §12.2 and the shared registry confirmed seven manifests are registered, so DeepSeek was correct. DeepSeek's draft was the stronger base. The host grafted the consolidated nine-tool table from the MiMo draft, fixed the section header to the ampersand form, verified every cited path resolves and published. The draft was already HVR-clean, so no voice fixes were needed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Lead with calibrated routing and the refuse-on-stale property | That is the skill's distinctive value and its defining safety behavior |
| Describe the embedder as a pluggable registry, drop the count | The "single manifest" claim was stale and any count drifts; pointing to INSTALL_GUIDE §12 stays accurate |
| Graft the nine-tool table from the MiMo draft | DeepSeek scattered the tools across sections; one table is a genuine lookup the routing skill needs |
| Keep the nine-tool and five-lane counts, avoid other totals | Both are stable; manifest, feature-catalog and scenario totals drift |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate_document.py --type readme` | PASS, 0 issues |
| HVR prose scan (em dash, semicolon, Oxford-comma list, banned words, code blocks excluded) | PASS, clean (no fixes needed) |
| Stale facts corrected (embedder, advisor_recommend options, changelog link) | PASS |
| Lane weights, nine tools and trust model match source | PASS |
| All cited paths resolve | PASS |
| `validate.sh --strict` on the phase | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Embedder detail intentionally compressed.** The dense embedder internals from the prior README (manifest names, dimensions, the 3-arg versus 4-arg `setActiveEmbedder` split) now live behind a pointer to `INSTALL_GUIDE.md` §12, which is the canonical reference. The README states the behavior, not the registry contents, so it does not re-drift.
<!-- /ANCHOR:limitations -->
