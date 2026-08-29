---
title: "Phase 4 — Dedicated sk-code Mode for Mobile-CLI App Work"
description: "Phase 4 — Dedicated sk-code Mode for Mobile-CLI App Work"
trigger_phrases:
  - "phase 4 — dedicated sk-code mode for mobile-cli app work"
importance_tier: "important"
_memory:
  continuity:
    packet_pointer: "sk-code/026-sk-code-mobile-cli-mode"
    last_updated_at: "2026-08-17T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded plan-only phase with one sk-code mode-design-plan leaf"
    next_safe_action: "Investigate the sk-code hub contract, then write the mode design plan"
    blockers: []
    key_files:
      - "spec.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: phase -->

# Phase 4 — Dedicated sk-code Mode for Mobile-CLI App Work

> **Phase parent (plan-only).** This file documents the phase's purpose and its work-leaf only.
> The mode design plan — with its `spec.md` / `plan.md` / `tasks.md` / `checklist.md` — lives in
> the leaf [`001-mode-design-plan/`](001-mode-design-plan/). No skill files are authored in this
> packet; the leaf plans the mode, it does not build it.

## 1. METADATA

- **Phase:** `sk-code/026-sk-code-mobile-cli-mode`
- **Kind:** phase parent, plan-only; work-leaves `001-mode-design-plan` and `002-scripts-ownership`.
- **Independence:** authorable any time; it encodes the conventions Phase 1 defines and Phase 2 proves.

## 2. PROBLEM & PURPOSE

### Problem Statement

Code work on `apps/pi-remote-web/` detects a generic frontend surface and does not auto-load this
app's token library, `@ds` inline-comment grammar, or editability guardrails. There is no
Mobile-CLI-specific `sk-code` surface.

### Purpose

Plan — do not build — a new SURFACE evidence packet `sk-code-mobile-cli` under the `sk-code` parent
hub so future code work on this app auto-loads the design-system and designer-editability
conventions, using the hub's real conventions (mode-registry entry, graph-metadata identity,
surface-detection marker, verification commands).

## 3. SCOPE

### In Scope

- A plan for the `sk-code-mobile-cli` surface packet, its registry entry, its identity file, its
  surface-detection marker, its folded workflow doctrine, and how it encodes this packet's conventions.

### Out of Scope (frozen)

- Authoring any skill, registry, or graph-metadata file under `.opencode/skills/sk-code/` — the leaf
  produces a plan only. Any change to the app source, the source values, or the security posture.

## 4. PHASE DOCUMENTATION MAP

| Leaf | Purpose |
|------|---------|
| [`001-mode-design-plan`](001-mode-design-plan/) | Plan the `sk-code-mobile-cli` surface packet against the real hub contract; author no skill files |
| [`002-scripts-ownership`](002-scripts-ownership/) | Decide where the app's `scripts/` tooling lives: the app keeps it, the surface skill references it. Analysis only, no code change. |

## 5. OPEN QUESTIONS

- The surface-detection precedence versus the generic `WEBFLOW`/`OPENCODE` surfaces is a plan
  decision the leaf resolves against the real hub `shared/` layer.

## RELATED DOCUMENTS

- [`implementation-phases.md`](implementation-phases.md) — the plan-only flow and documentary gate.
- `.opencode/skills/sk-code/SKILL.md` — the hub contract the plan is grounded in.
- `build-strategy` (folded into this packet during the reorg) — the conventions the planned mode encodes.
