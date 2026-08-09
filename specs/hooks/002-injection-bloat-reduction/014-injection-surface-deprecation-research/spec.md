---
title: "Research: Injection-Surface Deprecation"
description: "Research packet: inventory every injection surface appended into sessions, weigh behavioral evidence against cost and bloat, and recommend keep / deprecate / redesign per surface with a concrete migration path for hooks/002."
status: "in_progress"
completion_pct: 0
trigger_phrases:
  - "injection surface deprecation"
  - "prompt-injection surfaces keep deprecate redesign"
  - "directives-only fallback dedup"
importance_tier: "important"
contextType: "spec"
parent: "hooks/002-injection-bloat-reduction"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/014-injection-surface-deprecation-research"
    last_updated_at: "2026-08-09T10:45:00Z"
    last_updated_by: "deep-research"
    recent_action: "Seeded Level 1 spec.md from the research ask (deep-research pre-init seed)"
    next_safe_action: "Review research/research.md findings; plan the recommended migration steps"
    blockers: []
    key_files:
      - "research/research.md"
      - ".opencode/hooks/injection-contract.md"
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/render.ts"
    completion_pct: 0
    open_questions:
      - "Which migration step lands first: 013-headless dedup extension or 004 activation through the 007 gate?"
    answered_questions: []
---
# Research: Injection-Surface Deprecation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | 014-injection-surface-deprecation-research |
| **Status** | In Progress (research phase) |
| **Created** | 2026-08-09 |
| **Level** | 1 |
| **Parent** | hooks/002-injection-bloat-reduction |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Determine whether the repo should deprecate its unproven prompt-injection surfaces and keep only the two proven smart injections, or whether the correct disposition is keep / deprecate / redesign per surface. Weigh evidence of behavioral value against cost and bloat, especially Pi visible per-turn repetition, and produce a concrete migration path per surface.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

Inventory every injection point currently appended into sessions (three always-on directives, Pi subagent-dispatch directive, active-goal briefs, continuity and dist-warning briefs, Gate-3 question, skill-advisor recommendation line), weigh behavioral evidence versus cost/bloat, and recommend keep, deprecate, or redesign per injection with a migration path. Research output only — no runtime code changes.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

<!-- DR-SEED:REQUIREMENTS -->
Produce a per-surface keep / deprecate / redesign recommendation with evidence and a concrete migration path, anchored in `research/research.md`. Research output only; no runtime code changes in this packet.
<!-- /DR-SEED:REQUIREMENTS -->
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

1. Every injection surface currently appended into sessions is inventoried and classified per-turn vs per-session.
2. Each surface has an evidence-backed disposition (keep / deprecate / redesign) with measured cost.
3. A concrete, ordered migration path is documented per surface.
4. `research/research.md` is the canonical synthesis and carries the convergence report.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Guardrail preservation** — any deprecation/redesign must not break the AGENTS.md-absent case or the advisor-failure fallback path.
- **Evidence gate (007)** — activation of the dedup machine must not proceed on byte savings alone.
- **Dependencies** — hooks/001 measurement receipts, 002 phase children (004/006/007/013), 037 gate-question noise packet.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the repo deprecate its unproven prompt-injection surfaces and keep only the two proven smart injections? (research/research.md answers this)
- How should the directives-only fallback that the 013 dedup skips be handled?
- What is the correct migration path per surface?
<!-- /ANCHOR:questions -->

---

## 8. RESEARCH CONTEXT

Deep-research is active for this topic; `research/research.md` remains the canonical synthesis.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
**Abridged findings (canonical source: `research/research.md`):** The repo should not deprecate its injection surfaces wholesale nor reduce to "only the two proven smart injections." Disposition is three-tier: KEEP the two proven smart injections (Gate-3 question — 521 B, 037 noise fix shipped; advisor route line — 42 B/turn), KEEP the opt-in/event-driven briefs (active-goal, continuity, dist-warning), and REDESIGN the always-on constant per-turn text (three directives 767 B/turn; Pi dispatch directive 554 B/turn). Highest-leverage defect: the directives-only fallback (767 B) that the 013 Pi dedup structurally cannot reduce — extend the dedup to the headless case. Activate 004's full-first/route-only machine through the 007 evidence gate on the four [SYS] runtimes (0/13 evidence cells live today). OpenCode bridge local fallback mirror has a 2-of-3 directive drift (missing proof-over-appearance, bridge.mjs:368-373).
<!-- END GENERATED: deep-research/spec-findings -->
