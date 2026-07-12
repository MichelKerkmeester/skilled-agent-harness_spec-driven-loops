---
title: "Resource Loading Notes"
description: "Full rationale for the load-and-prove and citation requirements on two ALWAYS rows in SKILL.md's Resource Loading Levels table, plus the reference-loading discipline notes for design_principles.md, the quality floor, design-system grounding, aesthetics cues, and Mobbin/Refero."
trigger_phrases:
  - "resource loading rationale"
  - "load and prove loop"
  - "citation required context loading contract"
  - "reference loading discipline"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Resource Loading Notes

Loading triggers themselves stay in `SKILL.md` Section 2 (the Resource Loading Levels table drives routing). This file carries the extended rationale for two of that table's ALWAYS rows, plus the reference-loading discipline notes summarized in Section 5, so SKILL.md stays lean without dropping the requirement text.

---

## 1. Load-And-Prove Loop (Register + Brief-To-Dials + Preflight Card)

**Required load-and-prove loop:** `../shared/register.md`, `references/design-process/brief_to_dials.md`, and `assets/interface_preflight_card.md` are not optional for interface work; load the first two before decisions and prove the third before delivery.

## 2. Citation Required For context_loading_contract.md

**Citation required, not just a background load**: name `../shared/context_loading_contract.md` by its relative path in the context-basis line alongside `register.md` — the same explicit by-path citation this mode already requires for procedure cards (`SKILL.md` Section 3) — a recommendation with no visible citation of this path is the same as not loading it.

## 3. Reference Loading Discipline

- Load `design_principles.md` on every design task. It is the authority for palette, type, structure, motion, and copy.
- Keep Section 2 (SMART ROUTING) of `SKILL.md` as the single routing authority.
- `references/design-process/ux_quality_reference.md` is the objective quality-floor gate; apply it after the direction is set.
- A real design system you own is an OPTIONAL source to ground in or to name the default to deviate from, never a required step and never a style chooser. `design_principles.md` stays the authority.
- The `references/aesthetics/` cues are illustrative critique-against reference only: cite at most one to name a realized default at the critique step, subordinate to grounding, never surfaced as a chooser, preset, or pick-a-vibe axis. `real_ui_loop.md` Section 8 owns this guardrail.
- When the Mobbin or Refero subscriptions are connected, they are an OPTIONAL real-world critique-against reference (via Code Mode) for naming the category default to deviate from, never a chooser and never copied. `references/design-grounding/design_references_mcp.md` owns the rules and `design_principles.md` stays the authority.
