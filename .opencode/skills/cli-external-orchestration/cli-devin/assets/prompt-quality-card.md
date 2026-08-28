---
title: Devin CLI — Prompt Quality Card
description: Fast-path prompt-quality discipline for Devin CLI dispatches. Frameworks and CLEAR are canonical in sk-prompt.
trigger_phrases:
  - "devin prompt quality card"
  - "devin dispatch prompt discipline"
  - "devin prompt framework selection"
  - "devin clear check"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Devin CLI — Prompt Quality Card

Fast-path prompt-quality discipline for Devin CLI dispatches. The 7-framework table, task-to-framework map, density notes, and CLEAR 5-question check are owned by the canonical card — do not inline them here.

## 1. OVERVIEW

### Purpose

This card is the Devin CLI fast-path prompt-quality reference; it delegates the framework table + CLEAR check to the canonical card and records only Devin-specific model overrides plus the precedence rule.

### Usage

Compose a dispatch prompt by starting from the shared layer (canonical card) and following the precedence rule.

---

## 2. 2-TIER PRECEDENCE RULE

Two tiers govern how a Devin CLI dispatch prompt is built, from fastest to most thorough. Evaluate in order — stop at the first tier that fully covers the task.

**Tier 1 — Fast path (default)**
Build the prompt directly from the canonical card (`../../../sk-prompt/assets/cli-prompt-quality-card.md`). Select a framework from the table in §2, apply the task-to-framework map in §3, run the CLEAR pre-dispatch check in §4, and dispatch. No additional skill loading required for routine work.

**Tier 2 — Deep path (escalation)**
Dispatch `@prompt-improver` via the Task tool (never load full `sk-prompt` inline) when any canonical **Tier 2** trigger applies — the trigger list lives in `../../../sk-prompt/assets/cli-prompt-quality-card.md` under "Tier 2 — Deep path"; do not re-enumerate it here.

---

## 3. SHARED LAYER (DELEGATED — DO NOT INLINE)

The 7-framework selection table, the task-to-framework map, the pre-planning-density / bundle-gate / anti-hallucination notes, and the CLEAR 5-question check are OWNED by the canonical card. Do NOT copy them here.

-> `../../../sk-prompt/assets/cli-prompt-quality-card.md`  (deep theory: `../../../sk-prompt/references/patterns-evaluation.md`)

---

## 4. DELEGATION / PRECEDENCE

The 2-tier precedence rule (fast path → deep path) is canonical in `../../../sk-prompt/assets/cli-prompt-quality-card.md` and restated in §2 above and in `../SKILL.md`.

Devin-specific escalation example: if the task needs a crowded `devin -p` prompt plus explicit `--permission-mode` or subagent-delegation guidance, dispatch `@prompt-improver` via the Task tool first and hand the returned `ENHANCED_PROMPT` to Devin CLI. Escalate on any canonical Tier 3 trigger.

---

## 5. RELATED RESOURCES

-> `../../../sk-prompt/assets/cli-prompt-quality-card.md` · `./prompt-templates.md` · `../SKILL.md`
