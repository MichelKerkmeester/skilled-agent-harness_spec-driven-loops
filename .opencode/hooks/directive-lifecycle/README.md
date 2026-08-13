---
title: "Directive Lifecycle Hooks: Boundary-Gated Directive Delivery"
description: "Tracks per-session directive delivery so the constant advisor directives are shown once per startup/compaction boundary instead of on every turn."
trigger_phrases:
  - "directive lifecycle boundary"
  - "directive dedup"
  - "directives every message"
importance_tier: "important"
contextType: "reference"
---

# Directive Lifecycle Hooks: Boundary-Gated Directive Delivery

---

## 1. OVERVIEW

Index of the directive-lifecycle boundary adapters (real code in `system-skill-advisor` and `system-spec-kit`, symlinked here). The advisor brief appends three constant directives (comment-hygiene, governor, proof-over-appearance). These hooks track, per session, whether that directive block has already been delivered, and re-arm delivery on a lifecycle boundary (`session_start` / `session_compact`) — so the directives appear at startup and after a compaction, not on every turn.

Default-on: adding the guard changes nothing until a flag is set. Honors the `directive-lifecycle` kill-switch (plus the concern-level `SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP` / `SPECKIT_PI_DIRECTIVE_DEDUP`).

## 2. KEY FILES

| Runtime | Adapter |
|---|---|
| `claude/` | `directive-lifecycle-boundary.ts` (Skill Advisor), `speckit-directive-lifecycle-boundary.ts` (Spec-Kit shim) |

Codex, Cursor, and Devin reach the same behavior embedded in the shared `user-prompt-submit` lifecycle; Pi's is embedded in `prompt-advisor.ts`. Only Claude carries a separately indexed boundary adapter (see the hub coverage matrix).

## 3. BOUNDARIES

- **Advisory only, fail-open.** Suppressing a repeat drops nothing but the directive block; any error falls open to full delivery so the guardrails are never silently lost.
- **Real code stays in the skill.** The files here are symlinks; edit the source.

## 4. RELATED

- [`../README.md`](../README.md) — the hub index and coverage matrix.
- [`../../skills/system-skill-advisor/hooks/skill-advisor-hook.md`](../../skills/system-skill-advisor/hooks/skill-advisor-hook.md) — the advisor hook contract.
