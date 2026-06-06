---
title: "Integration Research — caura-memclaw (008) Memory Hardening into Spec Kit (UX + Automation first)"
description: "5-iteration folder-scoped run (001-005) on HOW to integrate the 008 proposal, WHAT existing skills/commands/agents/hooks it impacts, with UX and automation as the explicit top design priorities."
---

# Integration Research — Session Tracking

**Executor:** cli-opencode `openai/gpt-5.5-fast --variant high` / read-only / orchestrator-driven parallel fan-out (width 5)
**Packet:** `research/008-caura-memclaw-fleet-memory-teachings/integration/` (folder-scoped iterations 001-005)
**Session:** `2026-06-06-008-integration-ux-automation`
**Integrating:** the 008 proposal (`../sub-packet-proposals.md`: new child 015 P1-P3 + amendments to 002-008 + the 008 feedback reframe)
**Into:** Spec Kit Memory — `.opencode/skills/system-spec-kit/mcp_server/` + `commands/{memory,speckit,doctor}` + `agents/` + hooks.

**TOP PRIORITIES (operator-set):** UX and AUTOMATION. Every recommendation must say (a) how to make it fully automatic / invisible, and (b) how to make the UX zero-friction. Default-on automation + good defaults beat flags and manual steps.

---

## 2. TOPIC
Produce an actionable integration plan for the 008 memory-hardening proposal: where each item lands in the live code/docs, the dependency-ordered sequence, and the full impact on existing skills, commands, agents, and hooks — designed UX-first and automation-first.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (iterations 001-005)
- [ ] 001 Integration surface & sequencing map: each proposal item -> exact file/surface in mcp_server + children specs + constitutional; integration order; user-visible vs invisible; automatable?
- [ ] 002 Impact on SKILLS: system-spec-kit (memory + spec workflow + templates + constitutional), sk-doc, sk-code, system-skill-advisor — what each needs.
- [ ] 003 Impact on COMMANDS + AGENTS + HOOKS: /memory:* /speckit:* /doctor; @context/@orchestrate/@markdown; skill-advisor hook, startup hook, pre-commit, mutation-hooks.ts (the automation surface).
- [ ] 004 UX-FIRST design (top priority): defaults, surfacing, zero-friction, opt-out, errors, progressive disclosure for every new behavior.
- [ ] 005 AUTOMATION-FIRST design + synthesis (top priority): auto-triggers (hooks/sweeps/startup/doctor), self-maintaining, no manual steps; then the phased integration roadmap.
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- No implementation (read-only research; report + plan only).
- No redesign of the memory system beyond integrating the 008 proposal.
- No fleet/multi-tenant features (008 already ruled those out as negative knowledge).
- No copying MemClaw code (Apache-2.0; design inspiration only).

---

## 5. STOP CONDITIONS
- Complete iterations 001-005, OR explicit operator stop.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
All 5 answered. Key finding: integration is **low-risk incremental hardening** — most substrate already exists (provenance fields, shadow-only feedback ledger, append-only mutation_ledger, causal natural key, constitutional always-surface, mutation-hooks fan-out, response-envelope hints). Architectural rule: split write path into pre-mutation guard / transactional writer / post-mutation hook. UX surface = response envelope; automation surfaces = write-ingress + mutation-hooks + retention sweep + startup + /doctor + pre-commit. See `research.md` + `integration-plan.md`.
<!-- /ANCHOR:answered-questions -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED-OUT DIRECTIONS
- Putting integrity decisions (overwrite-prevention, idempotency) in `mutation-hooks.ts` — it is post-write, too late; use a write-ingress/pre-mutation phase.
- New public feedback-write tool — capture stays implicit/server-side only.
- Active feedback reducers in v1 — deferred until ledger quality is measured (008 stays shadow-first).
- Op-dispatch consolidation of the 37-tool surface — harms LLM tool discoverability.
- Any user-facing flag/prompt for source_kind, idempotency, or soft-vs-hard delete — all inferred/automatic.
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
CONVERGED. Deliverables: `research.md` (synthesis) + `integration-plan.md` (phased roadmap). Next is an operator decision: adopt the plan / scaffold the new child / start Phase 0-1 (008 scope-down + 002 provenance).
<!-- /ANCHOR:next-focus -->
