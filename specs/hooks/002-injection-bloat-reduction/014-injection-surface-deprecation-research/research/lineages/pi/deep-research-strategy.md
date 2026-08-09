---
title: Deep Research Strategy - Lineage pi (fanout-pi-1786264236566-r99u1v)
description: Persistent strategy for the injection-surface deprecation research lineage.
trigger_phrases: []
importance_tier: normal
contextType: planning
---

# Deep Research Strategy - Session Tracking (lineage pi)

## 2. TOPIC

Should the repo deprecate its unproven prompt-injection surfaces (the three always-on directives — comment-hygiene, governor, proof-over-appearance; the Pi subagent-dispatch directive; active-goal briefs; continuity and dist-warning briefs) and keep only the two proven smart injections (the Gate-3 spec-folder question and the skill-advisor recommendation line)? Inventory every injection point currently appended into sessions, weigh evidence of behavioral value against cost and bloat (especially Pi visible per-turn repetition), and recommend keep, deprecate, or redesign per injection with a concrete migration path.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- [x] q1-inventory: What is the complete inventory of injection surfaces appended into sessions (three always-on directives, Pi subagent-dispatch directive, active-goal briefs, continuity/dist-warning briefs, Gate-3 question, skill-advisor line), and where does each live and fire (per-turn vs per-session)? (iteration 1)
- [x] q2-evidence-value: What evidence exists of behavioral value for each surface — activation matrix state (0/30), shadow dedup receipts, hooks/001 measurement receipts, negative controls? (iteration 2)
- [x] q3-cost-bloat: What is the per-turn vs per-session cost of each injection — bytes/tokens, repetition behavior, especially Pi visible per-turn repetition after the 013 dedup? (iteration 3)
- [x] q4-proven-vs-unproven: What distinguishes the two proven smart injections (Gate-3 question, skill-advisor line) from the unproven always-on surfaces — what evidence marks them proven? (iteration 2)
- [x] q5-disposition-migration: Per-injection keep/deprecate/redesign recommendation with a concrete migration path, including the advisor directives-only fallback that 013 dedup skips and the never-activated full-first dedup machine. (iteration 5)
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- This research does NOT implement changes to any hook, skill, or config file.
- This research does NOT activate or deactivate any flag or activation-matrix cell.
- This research does NOT re-litigate the hooks/001 measurement methodology (it consumes its receipts as evidence).
- This research does NOT design new prompt-injection surfaces beyond migration-path recommendations.

---

## 5. STOP CONDITIONS

- Legal convergence per the deep-research stop contract (composite stop score > 0.60 with quality gates passing).
- Max iterations (10) reached.
- All five key questions answered with evidence-backed findings.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

- q1-inventory (iteration 1): Nine candidate surfaces located and classified per-turn/per-session with channel; see iterations/iteration-001.md. Tool-time BLOCK/LOG injections ruled out of the candidate set.
- q3-cost-bloat (iteration 3): Pi visible chain = advisor brief (809 full / 767 fallback / 42 dedup-reduced) + dispatch 554 B every turn. Four cases: 1,363 first-turn; 596 dedup-working repeat; 1,321 fallback repeat (unreducible); +goal brief up to 4,800 when active. 10-turn: 6.7 KB (all-head) to 13.4 KB (half fallback). Continuity 389 B/session, dist-warning OpenCode-only — minor. See iteration-003.md F1-F3.
- q4-proven-vs-unproven (iteration 2): proven = conditional, edge-triggered, evidence-gated (Gate-3 question 521 B once-per-session-when-mutating; advisor route line 43 B dynamic); unproven = always-on constant text with zero activation evidence (three directives 763 B, Pi dispatch directive 554 B — 0/30 activation cells, 13 emit/17 N/A, no behavioral or delivery evidence anywhere).
- q5-disposition-migration (iteration 5): Three-tier verdict: KEEP Gate-3 (finish 037) + advisor line; KEEP opt-in active-goal/continuity/dist-warning; REDESIGN the three directives to once-per-session + route-only repeats (activate 004 via 007 evidence gate) and extend 013 dedup to cover the headless fallback; KEEP Pi dispatch directive with 006 compact pending 5-semantics proof. 6-step migration path in iteration-005.md F3.
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED

- injection-contract.md as canonical inventory: grep → code verification of render.ts / prompt-advisor.ts / spec-gate-classify.ts confirmed its content quickly (iteration 1)
- Programmatic cell counting of activation-matrix.json (13 emit / 17 N/A / 0 evidence) and tracing the `brief ?? renderAdvisorFallbackDirective` call site (iteration 2)
- Source-executed byte measurement against live constants (554/767/809/521 B all measured; 521 exact match) (iterations 3, 9)
- Four-case Pi per-turn economics + fallback-collapse math (iteration 3)
- 037 packet discovery reframing Gate-3 as proven-value-with-fix (iteration 4)
- End-state projections separating 013-equals-004-on-Pi from 004-activation-for-SYS-runtimes (iteration 7)
- Exhaustive transform-handler enumeration closing the Pi inventory (iterations 6, 8)
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED

- None material (iteration 1)
- None material (iteration 2)
- None material (iterations 3-9); one refinement: 037 completion_pct (98%) was stale metadata — checklist is fully green and the fix is in source (iteration 6 F1)
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

[None yet]
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS

- Deprecating tool-time BLOCK/LOG injections (post-edit quality, dispatch guards, route guard, sentinels): event-driven, not per-turn bloat, outside the topic's candidate list (iteration 1, evidence: injection-contract.md §3-4)
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded
<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS

[None yet]
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->

## 11. NEXT FOCUS

Synthesis complete (iteration 9, legal convergence). Loop finished: 9 iterations, 5/5 questions answered, stopReason converged. See research.md, resource-map.md, deep-research-dashboard.md in this lineage directory.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

### Prior-work receipts (from hooks/001 + 002 packet docs)

- hooks/001 measured the three always-on directives (comment-hygiene, governor, proof-over-appearance) at ~763 bytes / ~190 estimated tokens ≈ 94.7% of the per-turn advisor payload, delivered on nearly every valid turn across Claude Code, Codex, Devin, OpenCode; Pi adds its own ~554-byte dispatch directive. A representative 10-turn session carries ~9,600 bytes of repeated policy text (linear growth with turns). [SOURCE: specs/hooks/002-injection-bloat-reduction/spec.md]
- hooks/002 parent spec: 43% complete, shadow-only; "full-first/route-only-repeats" delivery machine built but activation flags off. [SOURCE: specs/hooks/002-injection-bloat-reduction/spec.md]
- 004-full-first-route-only-repeats spec: complete; route-only delivery disabled pending activation review. [SOURCE: specs/hooks/002-injection-bloat-reduction/004-full-first-route-only-repeats/spec.md]
- 013-pi-local-directive-dedup spec: complete; suppresses the three constant directives on confirmed same-content repeat within a lifecycle epoch via .opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts; fail-open; known gap: advisor frequently emits a directives-only fallback (no advisor line) that the dedup skips. [SOURCE: specs/hooks/002-injection-bloat-reduction/013-pi-local-directive-dedup/spec.md]
- Task context: activation matrix has 0 of 30 cells live (shadow-only program).
- resource-map.md not present at spec folder; skipping coverage gate (`resource_map_present: false`).

### Bounded Context Snapshot (codebase pointers)

- Source pointers: `.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts` (payload render), `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts` (Pi adapter), `.opencode/hooks/injection-contract.md` (directive capsule, 258 lines), `.opencode/hooks/goal/goal-plugin.md` (active-goal briefs), `specs/hooks/001-per-prompt-injection-audit/research/research.md` (source measurements), `specs/hooks/002-injection-bloat-reduction/` (phase children 001-014).
- Reuse candidates: dedup machine in skill-advisor render/lib; 013 dedup logic; activation matrix in 007-guardrail-controls-and-activation.
- Integration points: per-runtime hook adapters (claude/, codex/, opencode/, pi/, devin/), AGENTS.md root doc, .opencode/hooks/injection-contract.md capsule, skill-advisor MCP server.
- Constraints: research writes only under `research/lineages/pi`; no edits to runtime code.

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 10 (from config)
- Convergence threshold: 0.05 (from config)
- Per-iteration budget: 12 tool calls, 10 minutes (defaults)
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Canonical pause sentinel: `research/.deep-research-pause`
- Current generation: 1
- Started: 2026-08-09T08:30:36Z (fanout-run start event)
