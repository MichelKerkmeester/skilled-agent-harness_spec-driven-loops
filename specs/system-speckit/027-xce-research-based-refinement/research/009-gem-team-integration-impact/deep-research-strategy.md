---
title: Deep Research Strategy — 009 Gem Team Integration & Impact
session: 2026-06-06-027-gem-team-integration-impact
executor: cli-opencode openai/gpt-5.5-fast --variant high (read-only); orchestrator-written artifacts
iterations: 001-005 (packet-local)
---

# 009 — Gem Team Integration & Impact

## 1. OVERVIEW
Bridge research between 007's *proposals* (what to adopt) and `/speckit:plan` (how to build it). For each of 007's three surviving proposals, determine **how to integrate it into the live spec-kit** and **which existing skills/commands/agents/docs it impacts** (change-type + severity + backward-compat).

## 2. TOPIC
**For P1/P2/P3: what's the concrete integration approach, and what is the full blast radius across the existing system?**

The three proposals (from `../007-gem-team-adoption-matrix/sub-packet-proposals.md`):
- **P1 / child 012 — typed-agent-io-adapter:** a typed dispatch header (`dispatch_id` / `task_definition` / `context_snapshot`) + a normalized output envelope (`status`/`confidence`/`failure_type`) as an ADAPTER over existing `@code` RETURN / `@review` gates / `@context` Context Package. (MiMo: dispatch-INPUT side is the primary gap.)
- **P2 / child 013 — scoped-preexec-and-handoff-gates:** (a) typed debug-handoff schema when a diagnosis crosses agents; (b) boundary contract-first for API/schema changes only; (c) pre-mortem field for med/high work.
- **P3 / child 014 — planner-review-focus-and-drift-hint:** `reviewer_focus` routing hint + `spec_drift`/`update_recommended` write-back field.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (the 5 angles)
- [ ] **RQ1 (iter 001) — P1 integration & impact.** How to add the typed dispatch header + output envelope as an adapter; which agents (@code/@review/@context/@debug/@orchestrate), skills (sk-code/sk-code-review), and commands that dispatch/consume agents (speckit/*, deep/*, orchestrate) change; what breaks; where the shared `agent-io-contract.md` lives.
- [ ] **RQ2 (iter 002) — P2 integration & impact.** How to add the debug-handoff schema + boundary contract-first + pre-mortem; impact on @debug, debug-delegation.md template, @orchestrate, sk-code, system-spec-kit validation.
- [ ] **RQ3 (iter 003) — P3 integration & impact.** How to add reviewer_focus + spec_drift write-back; impact on @orchestrate, @review, continuity/generate-context.js + memory save path.
- [ ] **RQ4 (iter 004) — Cross-cutting & governance impact.** Shared envelope where P1/P2/P3 fields coexist; CLAUDE.md/AGENTS.md gates + Four Laws; skill-advisor routing; validation/tests (validate.sh, spec-doc-structure); backward-compat with existing specs/agents; integration sequencing.
- [ ] **RQ5 (iter 005) — Consolidated impact matrix + roadmap.** A full table (every skill/command/agent/doc × proposal × change-type × severity), a phased integration plan, top risks, and the smallest-viable-first-step.
<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS
- NOT implementing anything — research/impact only; implementation is `/speckit:plan` per child.
- NOT re-litigating WHETHER to adopt (007 settled that) — only HOW + impact.
- NOT touching code; read-only analysis.

## 5. STOP CONDITIONS
- All 5 angles complete + a consolidated impact matrix produced.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
_None yet._
<!-- /ANCHOR:answered-questions -->

<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
_Populated after iter 001._
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
_n/a yet._
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES
_n/a._
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
_n/a._
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
**COMPLETE (5/5 iters: 001-005).** Synthesis in `research.md`: integration is **feasible & fully additive** — one shared `agent-io-contract.md` + `@orchestrate` hub; governance/validators untouched; **4-wave rollout** (plan → implement/debug → review-loop/complete → deep-loops header-only). Smallest-first = P1 Wave 1 (contract doc + @orchestrate + /speckit:plan @context dispatches). newInfoRatio 0.78/0.82/0.76/0.72/0.86 (mean ≈0.79). Next: `/speckit:plan` on child 012.
<!-- /ANCHOR:next-focus -->

## 12. KNOWN CONTEXT
- **Verdict from 007:** the spec-kit is mature; P1/P2/P3 are *adapters/optional-modes/advisory-fields*, NOT replacements. Keep existing rich-markdown contracts; bolt typed fields on.
- **Surface inventory:** Agents = ai-council, code, context, debug, deep-improvement, deep-research, deep-review, markdown, orchestrate, prompt-improver, review. Command groups = agent_router, create, deep, doctor, memory, prompt, speckit. Agent-dispatching commands (P1 consumers) = speckit/{plan,implement,complete,resume}, deep/start-*-loop, memory/save, doctor/*.
- **Proposed homes (from 007):** P1 → `.opencode/agents/{code,review,context,debug}.md` + new `.opencode/skills/system-spec-kit/references/agent-io-contract.md` + orchestrate.md; P2 → debug.md, orchestrate.md, sk-code/SKILL.md, system-spec-kit/templates/debug-delegation.md; P3 → orchestrate.md, code.md/review.md, save path.
- **MiMo refinements:** P1 dispatch-INPUT header is primary; @code already has typed escalation enums + 7 dispatch modes [code.md:117-128,303-310]; @context already returns a Context Package [context.md:230-284]. P2 debug-handoff is a *downscale* of Gem's pre-wave gate, not new.

## 13. RESEARCH BOUNDARIES
- Executor: cli-opencode openai/gpt-5.5-fast --variant high, READ-ONLY; orchestrator writes state. Parallel fan-out (bare wait). 1200s/iter.
- Evidence: every "impact" claim cites the actual `file:line` it would touch.
