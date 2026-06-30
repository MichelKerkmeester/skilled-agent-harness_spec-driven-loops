---
title: "Deep Research Strategy — opus48-claude2 lineage (006 competitor design tools)"
description: Persistent research plan for the opus48-claude2 fan-out lineage investigating adoptable competitor AI design-tool ideas for sk-design-interface and mcp-magicpath.
importance_tier: normal
contextType: planning
---

# Deep Research Strategy — opus48-claude2 lineage

Runtime strategy for the `opus48-claude2` fan-out lineage of packet 006. Tracks focus, what worked/failed, and next focus across 5 iterations.

---

## 2. TOPIC

What do leading AI UI/design-generation tools (v0 by Vercel, Lovable, Figma Make, Subframe, and similar) do that `sk-design-interface` (design judgment) and `mcp-magicpath` (canvas/CLI) could adopt — beyond the 005 Claude Design parity findings — classified ADOPT / ADAPT / SKIP per skill, preserving the anti-default philosophy and the lean-CLI-skill scope.

---

## 3. KEY QUESTIONS (remaining)
- [x] Q1: What distinctive, design-relevant capabilities do v0, Lovable, Figma Make, and Subframe ship? (answered iters 1–4)
- [x] Q2: Which are net-new vs the 005 Claude Design findings (dedup)? (dedup table T1–T8, iter 4)
- [x] Q3: Per idea, ADOPT / ADAPT / SKIP for each skill with reason + guardrail? (consolidated table, iter 4; ranked iter 5)
- [x] Q4: What features are ruled out as out-of-scope (negative knowledge)? (consolidated iter 4)
- [x] Q5: Prioritized, reconciled recommendation per skill? (F24 ranking, iter 5)

---

## 4. NON-GOALS
- Implementing anything; no change to either skill in this packet (research-only).
- Re-litigating the 005 Claude Design findings; this widens, not replaces them.
- Adopting hosted-product / platform-only features two CLI skills cannot host (team admin, hosted canvas, billing, live multiplayer).
- Producing a feature-by-feature marketing comparison; the output is adoptable-idea verdicts.

---

## 5. STOP CONDITIONS
- 5 iterations reached (hard cap for this lineage), OR
- newInfoRatio converges (no net-new adoptable ideas across an iteration), OR
- All 5 key questions answered with sourced evidence and a prioritized per-skill recommendation exists.

---

## 6. ANSWERED QUESTIONS
- Q1: v0 / Lovable / Bolt / Figma Make / Subframe + broader field surveyed (iters 1–4).
- Q2: dedup vs 005 complete — themes T1–T8; net-new = T1 (direct edits), T2 (constrain-to-system, keystone), T3 (error self-healing), T4 (persistent brief), T5 (diff-before-apply).
- Q3: per-skill ADOPT/ADAPT/SKIP table complete (iter 4), ranked (iter 5).
- Q4: negative knowledge consolidated (iter 4).
- Q5: prioritized recommendation delivered (F24, iter 5).

---

<!-- MACHINE-OWNED: START -->
## 7. WHAT WORKED
- Anchoring each competitor feature to (net-new-vs-005) × (which skill's boundary) — kept the survey decision-relevant, not a feature dump (iter 1).
- Treating repeated patterns across tools as *corroboration* (raising confidence) rather than new findings — kept newInfoRatio honest (iter 2).
- The theme table (T1–T8) made saturation visible: iter-4 tools all mapped to existing themes → convergence signal (iter 4).
- Ranking by value × anti-default-safety × lean-CLI-hostability produced a defensible priority order with T2 keystone on top (iter 5).

---

## 8. WHAT FAILED
- Live web verification: WebSearch denied; WebFetch denied after the first cross-host redirect. Web is permission-gated in this autonomous sandbox. Fell back to model knowledge (UNVERIFIED-tagged, host verifies) per the NEVER-ask-the-user rule and the spec's risk mitigation. No retry burned after confirmation (iters 1–2).

---

## 9. EXHAUSTED APPROACHES (do not retry)
### Live web verification in this lineage — BLOCKED (iters 1–2, 3 attempts)
- What was tried: WebSearch (v0 features ×2), WebFetch (vercel.com → v0.app redirect).
- Why blocked: permission-gated sandbox; no interactive grant in an autonomous fan-out run.
- Do NOT retry: web tools in this lineage; hand verification to the host/merge step.

---

## 10. RULED OUT DIRECTIONS
- Full-stack/backend generation (Lovable Supabase, Bolt) — UI skills, not app generators (iter 2).
- In-browser runtime/WebContainers, deploy/host, GitHub sync, community remix galleries — platform features (iters 1–2).
- Figma-plugin-native coupling (Figma Make libraries, Builder/Anima/Visual Copilot plugins) — the skills are not plugins; keep only generalized tokens-as-input (iters 1, 3).
- Preset theme-swap / "pick-a-vibe" variant menus in sk-design-interface — violates the anti-default mandate (primary; agrees with 005) (iters 1, 4).
- Heavyweight visual-regression/diff engines; pushing generated themes back to the MagicPath account / hosted canvas — platform/scope creep (agrees with 005) (iter 4).

---

## 11. NEXT FOCUS
STOP — maxIterations reached (5/5) with genuine diminishing-novelty convergence (newInfoRatio 1.00→0.25; 0 new themes at iter 4). Synthesis complete. Open items handed to host/merge: live web verification of feature claims + reconciliation with the `gpt55fast` sibling lineage.

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
- Sibling 005 research (Claude Design parity) is COMPLETE and is the dedup baseline. Its findings: a shared `claude-design-parity` protocol = design-context snapshot + iteration ledger (render→screenshot→compare-to-intent fidelity loop) + handoff manifest; #1 move = fidelity verification after `code submit`; chat-vs-comment revision routing; design-system inheritance; token export. Negative knowledge: no style presets, no CSV-to-generator, no merging the two skills, no multi-format export, no hosted canvas, no heavyweight visual-regression engine, no self-owned rendering pipeline.
- `sk-design-interface`: judgment skill — ground → token system → critique-against-AI-defaults → build → self-critique. Anti-default mandate. Critique-against CSV data is "never a chooser".
- `mcp-magicpath`: CLI-only canvas skill — search/inspect/add (install), code start/submit (author), repo import; Tailwind v4 design defaults; auto-applies sk-design-interface when shaping UI.
- resource-map.md not present; skipping coverage gate.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5 (fan-out lineage cap)
- Convergence threshold: 0.05 newInfoRatio
- Per-iteration budget: ~8-11 tool calls (max 12), web-heavy
- Progressive synthesis: true
- research.md ownership: workflow-owned canonical synthesis (this lineage writes its own research.md under the lineage dir)
- Lineage: opus48-claude2 (cli-claude-code / claude-opus-4-8 xhigh, account #2)
- Current generation: 1
- Started: 2026-06-14T09:06:00Z
