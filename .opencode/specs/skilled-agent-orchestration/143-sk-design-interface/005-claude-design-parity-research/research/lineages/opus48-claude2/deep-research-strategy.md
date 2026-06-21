# Deep Research Strategy — Lineage opus48-claude2

## 1. OVERVIEW

Lineage `opus48-claude2` of the Claude Design parity fan-out (executor: `cli-claude-code` model `claude-opus-4-8` xhigh). Sibling lineage: `gpt55fast` (openai/gpt-5.5-fast). Each lineage runs an independent full loop and converges independently; the host cross-checks the two at synthesis.

---

## 2. TOPIC

How to improve `sk-design-interface` (148) and `mcp-magicpath` (147) so their UI-design results get closer to **Claude Design** (Anthropic's conversational design tool). Research-only: produce a prioritized, evidence-backed ADOPT/ADAPT/SKIP recommendation per skill plus a parity scorecard and negative knowledge. No change to either skill in this packet.

---

## 3. KEY QUESTIONS (remaining)
- [x] Q1: What is each skill's current state against the five Claude Design parity dimensions? (iter 1)
- [x] Q2: For design-system inheritance + context grounding, what concrete improvements close the gap per skill? (iter 2)
- [x] Q3: For iteration / visual feedback (canvas + inline-comment loop, fidelity verification), what closes the gap per skill? (iter 3)
- [x] Q4: For quality levers + output/handoff, what closes the gap per skill? (iter 4)
- [x] Q5: What is the consolidated parity scorecard, prioritized recommendation, and negative knowledge? (iter 5)

All five key questions answered. Loop stopped at maxIterations (5/5).

---

## 4. NON-GOALS
- Implementing any improvement (no change to either skill in this packet).
- Re-deriving Claude Design's feature set beyond the seeded capability summary (host does web verification).
- Building a hosted canvas or replicating Claude Design's web product wholesale.
- Replacing the sk-design-interface anti-default philosophy with a templated generator.

---

## 5. STOP CONDITIONS
- All five key questions answered with evidence-backed verdicts, OR
- maxIterations (5) reached (hard stop), OR
- Convergence: newInfoRatio below threshold across the required consecutive evidence iterations with legal-stop gates passing.

---

## 6. ANSWERED QUESTIONS
- Q1 (iter 1): Current state mapped — baseline verdict table; key structural fact is the judgment-vs-canvas depends_on split (F9).
- Q2 (iter 2): Inheritance + context grounding — sk-design-interface "endorsed-but-absent" inheritance (F10); magicpath near-parity on theme consume (F11); context intake for sk-design-interface (F12).
- Q3 (iter 3): Iteration/visual feedback — fidelity verification is the #1 magicpath move (F15); "missing protocol, not missing parts" cross-skill loop (F16); rendered self-critique loop for sk-design-interface (F14).
- Q4 (iter 4): Quality levers + output/handoff — name bounded levers, never presets (F17); design-token export for magicpath (F20); structured handoff artifact for sk-design-interface (F19).
- Q5 (iter 5): Scorecard (F21), prioritized recommendation (F22), guardrail (F23), cross-lineage hooks (F24).

---

<!-- MACHINE-OWNED: START -->
## 7. WHAT WORKED
- Reading both SKILL.md + the two deep references gave enough cited evidence for every scorecard cell (iter 1).
- Anchoring each recommendation to an existing seam (memory-as-hint, theme schema, repo-foundation read, named screenshot tool) kept proposals low-risk and philosophy-safe (iter 2-4).
- The depends_on seam (F9) made cross-skill prioritization unambiguous — every gap belongs to one skill or to the shared protocol (iter 5).

---

## 8. WHAT FAILED
- No tool failures. The only "failure" was confirming that both skills' definitions of "done" stop at compiles+responsive, never "matches intent" — which is precisely the fidelity gap (iter 3).

---

## 9. EXHAUSTED APPROACHES (do not retry)
- None exhausted via repeated failure; the loop ran cleanly to maxIterations. Ruled-out directions (below) were eliminated by reasoning, not by exhaustion.

---

## 10. RULED OUT DIRECTIONS
- Independently re-deriving Claude Design's feature set — out of scope; rely on seeded summary (iter 1).
- Treating the two skills as one merge target — clean depends_on boundary; keep per-skill (iter 1).
- Generate/push themes back to MagicPath account — no CLI surface; platform scope creep (iter 2).
- File/attachment upload-and-storage pipeline — runtime already supplies paths (iter 2).
- Hosted canvas + live comment threads in either CLI skill — that is the web product, out of scope (iter 3).
- Heavyweight visual-regression/diff engine — screenshot+judgment compare suffices (iter 3).
- Style presets / "pick-a-vibe" lever menu in sk-design-interface — reintroduces templated defaults; PRIMARY negative knowledge (iter 4).
- Figma/PDF/presentation multi-format export in magicpath — heavy integration, low leverage (iter 4).
- Self-owned rendering pipeline in sk-design-interface — rendering belongs elsewhere (iter 4).
- Duplicating quality levers in magicpath — splits source of truth (iter 4).

---

## 11. NEXT FOCUS
Loop complete (5/5, maxIterationsReached). Synthesis written to `research.md`. Host to cross-check this lineage against `gpt55fast` per F24 divergence hooks.

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

Parity target (seeded from spec §8, https://support.claude.com/en/articles/14604416-get-started-with-claude-design): Claude Design is Anthropic's conversational design tool — conversational generation of designs/prototypes/presentations; org design-system inheritance; canvas + inline-comment iteration; context attachments; multi-format export; Claude Code handoff; named quality levers.

Skill 1 — `sk-design-interface` (`.opencode/skills/sk-design-interface/`): design judgment skill vendored from Anthropic frontend-design (Apache-2.0) + ui-ux-pro-max data (MIT). Two-pass ground→token-system→critique→build→self-critique process; anti-default philosophy (avoid the three AI-default looks); quality floor (ux_quality_reference.md); critique-against data CSVs + design_search.py. LEAF design-judgment skill: decides the look, hands implementation to sk-code.

Skill 2 — `mcp-magicpath` (`.opencode/skills/mcp-magicpath/`): CLI wrapper for the `magicpath-ai` canvas tool. install direction (search/inspect/add → React/TS) + author direction (code start/submit canvas revisions) + repo import. Has themes (get-theme: CSS vars light/dark + fonts + prompt field), canvas with pending revisions, Design Defaults. Depends_on sk-design-interface for the visual direction. Known gaps (spec §8): no iteration loop, no token generation, no fidelity verification, Design Defaults canvas-only.

`resource-map.md` not present; skipping coverage gate.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5
- Convergence threshold: 0.05 on newInfoRatio
- Per-iteration budget: 12 tool calls, ~10 minutes
- Progressive synthesis: true
- research.md ownership: workflow-owned canonical synthesis output (this lineage writes its own lineage-local research.md)
- Lifecycle: new
- Machine-owned sections: reducer controls Sections 3, 6, 7-11 (in this direct-execution fan-out the executor maintains them in reducer spirit)
- Current generation: 1
- Started: 2026-06-14T06:21:48Z
