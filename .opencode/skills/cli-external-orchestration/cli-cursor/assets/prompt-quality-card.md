---
title: Cursor CLI — Prompt Quality Card
description: Fast-path prompt-quality discipline for Cursor CLI dispatches. Frameworks and CLEAR are canonical in sk-prompt; this card adds only confirmed Cursor-dispatch-mechanics addenda.
trigger_phrases:
  - "cursor prompt quality card"
  - "cursor dispatch prompt discipline"
  - "cursor prompt framework selection"
  - "cursor clear check"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Cursor CLI — Prompt Quality Card

Fast-path prompt-quality discipline for Cursor CLI dispatches. The 7-framework table, task-to-framework map, density notes, and CLEAR 5-question check are owned by the canonical card — do not inline them here.

## 1. OVERVIEW

### Purpose

This card is the Cursor CLI fast-path prompt-quality reference; it delegates the framework table + CLEAR check to the canonical card and records only confirmed Cursor-dispatch-mechanics addenda plus the precedence rule. Cursor has zero prior empirical dispatch data in this repo — no per-model default asserted here comes from measured Cursor usage, only from the confirmed CLI contract.

### Precedence Rule (state this first, always)

1. **`sk-prompt`** is authoritative for framework definitions (RCAF, CO-STAR, TIDD-EC, etc.).
2. **`sk-prompt/prompt-models`** governs per-model defaults for any profiled model.
3. **This card** adds only confirmed Cursor-dispatch-mechanics addenda that don't belong in either of the first two tiers — never a competing framework, never an invented per-model default.

---

## 2. SHARED LAYER (DELEGATED — DO NOT INLINE)

The 7-framework selection table, the task-to-framework map, the pre-planning-density / bundle-gate / anti-hallucination notes, and the CLEAR 5-question check are OWNED by the canonical card. Do NOT copy them here.

-> `../../../sk-prompt/prompt-models/assets/cli-prompt-quality-card.md`  (deep theory: `../../../sk-prompt/references/patterns-evaluation.md`)

---

## 3. CURSOR DISPATCH-MECHANICS ADDENDA (CONFIRMED ONLY)

These are mechanical facts about how Cursor CLI receives and processes a prompt — not framework guidance, and not per-model defaults.

- **Non-interactive dispatch is `-p "<prompt>"`, always.** The prompt is a positional argument, not stdin-piped (unlike Codex's `-` convention). Compose the full prompt text before invocation; there is no interactive follow-up mid-dispatch.
- **`--output-format` shapes how to parse the response**, not the prompt itself: `text` (default) returns only the final answer, `json` wraps it in an envelope with `session_id`/`usage`, `stream-json` streams message-level progress. When a prompt asks for structured output, that structure lives inside the model's own answer (`.result` in JSON mode), not a CLI-native schema-enforcement flag.
- **No `--reasoning-effort` flag, no `model[effort=...]` bracket.** Never compose a prompt assuming either exists — live-tested against the real CLI and rejected outright. Select an effort-suffixed model id (`gpt-5.2-high`) instead of adding an effort instruction to the prompt text.
- **Approval mode (`--auto-review`/`--force`) is separate from the prompt content.** Do not embed "please just do it without asking" instructions in the prompt to work around an unattended-approval gap — set `--auto-review` or `--force` on the invocation instead; the prompt should describe the task, not negotiate permissions.
- **`--mode plan`/`--mode ask` are read-only regardless of prompt phrasing.** If a prompt says "make the change" but the invocation uses `--mode ask`, no write happens — the mode governs capability, the prompt cannot override it.
- **Composer (`composer-2.5`) has no empirical prompt-craft profile in this repo yet.** If a task specifically requests Composer, compose the prompt via the same fast-path framework as any other model (§2) — do not invent a Composer-specific framing.

---

## 4. DELEGATION / PRECEDENCE

The 3-tier precedence rule (fast path -> model override -> deep path) is canonical in `../../../sk-prompt/prompt-models/assets/cli-prompt-quality-card.md` and restated in `../SKILL.md`.

Cursor-specific escalation example: if the task needs a prompt disambiguating execution mode (default vs. `--mode plan`/`--mode ask`) plus explicit model-id selection across Cursor's wide roster, dispatch `@prompt-improver` via the Task tool first and hand the returned `ENHANCED_PROMPT` to Cursor CLI. Escalate on any canonical Tier 3 trigger.

---

## 5. RELATED RESOURCES

-> `../../../sk-prompt/prompt-models/assets/cli-prompt-quality-card.md` · `./prompt-templates.md` · `../SKILL.md` · `../../../sk-prompt/prompt-models/references/models/` (per-model profiles)
