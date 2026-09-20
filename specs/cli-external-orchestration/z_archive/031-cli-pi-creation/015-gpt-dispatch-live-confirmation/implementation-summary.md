---
title: "Implementation Summary: Confirm the cli-pi GPT-5.6 dispatch invocation"
description: "The pi-contract GPT dispatch is now documented from a live run: provider-qualified id + --thinking."
trigger_phrases:
  - "pi gpt dispatch confirmation"
  - "cli-pi gpt-5.6 invocation"
importance_tier: "important"
contextType: "implementation"
parent: "cli-external-orchestration/031-cli-pi-creation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/015-gpt-dispatch-live-confirmation"
    last_updated_at: "2026-07-29T04:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Documented the confirmed cli-pi GPT-5.6 invocation from a live dispatch"
    next_safe_action: "Optional: implement the deep-loop fan-out cli-pi executor now that the contract is known"
    blockers: []
    completion_pct: 100
---

# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 015-gpt-dispatch-live-confirmation |
| **Completed** | 2026-07-29 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Updated `cli-pi/references/model-dispatch-gpt-5.6.md` (v1.1 -> v1.2): its old SERVICE-TIER (UNCONFIRMED)
and OPEN-EXECUTION-ITEM sections became a single CONFIRMED INVOCATION section stating that the model id
must be provider-qualified (`openai-codex/gpt-5.6-<tier>`), that reasoning effort is Pi's own
`--thinking <level>` (not Codex's `-c model_reasoning_effort`), that no service-tier flag is needed, and
the exact command shape. Added the live dispatch as a source and marked the luna row live-confirmed.
Updated `cli-pi/SKILL.md`: the reference pointer now says "confirmed invocation" and the headless-modes
table gained a GPT-5.6 row with the provider-qualification guardrail.
<!-- /ANCHOR:what-built -->


---

<!-- ANCHOR:how-delivered -->
## HOW IT WAS DELIVERED

Surgical doc edits, no code change. The evidence was a genuine dispatch from the same session's sk-design recall investigation.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## KEY DECISIONS

| Decision | Rationale |
|----------|-----------|
| Confirm only the luna row | It is the tier actually dispatched; sol/terra stay picker-confirmed until run |
| Leave the fan-out executor untouched | Its builder throwing is a separate, larger runtime change with real blast radius |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## VERIFICATION

Header order 1-4 clean; the only remaining "unconfirmed" mention is the sentence noting the supersession;
internal links (cli-reference.md, model-dispatch-gpt-5.6.md) resolve; frontmatter version bumped to
1.2.0.0. Evidence: the live `pi -p --model openai-codex/gpt-5.6-luna --thinking xhigh --tools
read,grep,find,ls` dispatch from the sk-design recall investigation.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS

The deep-loop fan-out cli-pi executor still throws by design; direct `pi -p` dispatch is the only confirmed path. sol/terra tiers are not yet live-dispatched.
<!-- /ANCHOR:limitations -->
