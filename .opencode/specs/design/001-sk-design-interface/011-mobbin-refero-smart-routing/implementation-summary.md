---
title: "Implementation Summary [template:level_1/implementation-summary.md]"
description: "Status: DONE. sk-design-interface now decides when to consult Mobbin/Refero via a hybrid initiative/ask/fall-back gate, with a Mobbin-vs-Refero source pick, surfaced in SKILL.md routing and RULES."
trigger_phrases:
  - "mobbin refero routing done"
  - "design reference gate status"
  - "initiative or ask reference"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "design/001-sk-design-interface/011-mobbin-refero-smart-routing"
    last_updated_at: "2026-06-17T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Added the hybrid Mobbin/Refero decision gate (v1.5.0.0)"
    next_safe_action: "Phase complete; optionally commit"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-interface/references/design-grounding/design_references_mcp.md"
      - ".opencode/skills/sk-design-interface/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-011-mobbin-refero-smart-routing"
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
| **Spec Folder** | 011-mobbin-refero-smart-routing |
| **Status** | DONE - hybrid initiative/ask gate shipped |
| **Created** | 2026-06-17 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

> **Status: DONE.** The Mobbin/Refero integration was purely passive (ON_DEMAND, user-driven). The skill now decides for itself whether a real-world reference would sharpen the default to deviate from, and acts: initiative when it clearly helps and a subscription is connected, ask when borderline, fall back otherwise.

### The decision gate
`references/design-grounding/design_references_mcp.md` §3 gained a "Deciding whether to consult (initiative or ask)" section:
- **Does it help?** A convention-heavy category list (checkout, onboarding/auth, settings, dashboards, social feeds, pricing, data tables, calendars, messaging, search/filters); little value for novel/bespoke or pinned briefs.
- **Initiative / ask / fall back:** initiative (pull ONE reference, name the default, cite the URL) when the category benefits AND a subscription is connected; ask the user one line when borderline or subscription status is unknown; fall back to the generic anti-default process otherwise (non-blocking).
- **Source pick by surface:** Mobbin for native/iOS or in-app screens and flows; Refero for web pages and visual-style direction (styles first).

### Surfaced in the skill
- `SKILL.md` §2: the Mobbin/Refero resource row reframed from `ON_DEMAND` to `INITIATIVE / ASK` with the source split.
- `SKILL.md` §4: ALWAYS rule 7 — decide at the critique step whether a real-world reference would help, by initiative or by asking.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `references/design-grounding/design_references_mcp.md` | Modified | §3 hybrid gate + taxonomy + source pick; §1 pointer |
| `SKILL.md` | Modified | §2 INITIATIVE/ASK row; §4 ALWAYS rule 7 |
| `changelog/v1.5.0.0.md` | Created | Changelog; SKILL version -> 1.5.0.0 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The decision logic was added to the owner doc (`design_references_mcp.md`), keeping every existing hard rule intact, and surfaced in two places in `SKILL.md` so the agent meets it whether it reads routing or rules. The autonomy balance leans toward asking when uncertain, because Mobbin and Refero are paid, remote calls — initiative is reserved for the case where the category clearly benefits and a subscription is known to be connected.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Hybrid (initiative + ask) | The user asked for "own initiative or asking the user"; a hybrid acts when confident and asks when not |
| Default toward asking when uncertain | Mobbin/Refero are paid, remote; an unprompted call should not surprise the user |
| Source pick by surface | Mobbin covers app/iOS; Refero covers web pages and visual styles — the target's platform decides |
| Keep all existing guardrails | One reference, no chooser, read live, never copied, grounding upstream — the anti-default discipline is unchanged |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| §3 has the initiative/ask/fall-back gate + category list | PASS |
| Source-pick heuristic present (Mobbin app/iOS, Refero web/styles) | PASS |
| SKILL.md surfaces the gate (resource row + ALWAYS rule 7) | PASS |
| Existing guardrails intact (one reference, no chooser, read live) | PASS (§4 hard rules unchanged) |
| `validate.sh <this phase> --strict` | PASS (exit 0) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Subscription-connected detection is a judgment, not a probe.** The gate says "when a subscription is connected"; the skill infers this from whether the Mobbin/Refero Code Mode manuals resolve, and asks when unsure rather than blindly calling.
2. **The category taxonomy is a guide, not exhaustive.** It names the common convention-heavy categories; the underlying test is "is the real-world default strong enough to be worth naming?", which the skill still judges.
<!-- /ANCHOR:limitations -->
