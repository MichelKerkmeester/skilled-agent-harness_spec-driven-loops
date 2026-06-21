# Iteration 5: Synthesis-Prep — Parity Scorecard, Prioritized Recommendation, Cross-Lineage Hooks

## Focus
Consolidate iterations 1–4 into (a) a single parity scorecard (R3), (b) a prioritized per-skill ADOPT/ADAPT/SKIP recommendation with one concrete next step each (success criteria), and (c) the cross-check hooks the host will use against the `gpt55fast` lineage (R4). No new gap analysis — this is assembly and prioritization.

## Findings

### F21 — Parity scorecard (R3); 0=absent, 1=adjacent, 2=partial, 3=parity
| # | Dimension | Claude Design target | sk-design-interface | score | mcp-magicpath | score |
|---|---|---|---|:--:|---|:--:|
| 1 | Design-system inheritance | Inherit org design system | Token *thinking* only; no ingest/emit (F3/F10) | 1 | Consumes themes (CSS vars+fonts+prompt); no generation (F7/F11) | 2 |
| 2 | Iteration / visual feedback | Canvas + inline-comment loop | One-shot self-critique, reveal at confidence (F5/F14) | 1 | Canvas + revisions but open loop, no fidelity check (F6/F15) | 2 |
| 3 | Context grounding | Context attachments | Subject + memory hints; no attachment intake (F2/F12) | 1 | Strong code context + selected images; partial visual (F13) | 2 |
| 4 | Quality levers | Named user-facing levers | Binary floor + implicit principles, not dials (F4/F17) | 2 | None of its own; inherits via dependency (F18) | 1 |
| 5 | Output / handoff | Multi-format export + Claude Code handoff | None; prose intent → sk-code (F2/F19) | 0 | Code-in-repo + share URL; no token export (F8/F20) | 2 |

**Lineage parity read:** mcp-magicpath is closer to Claude Design on the *mechanical* dimensions (1,2,3,5) because it owns a real canvas/CLI; sk-design-interface is closer only on the *judgment* dimension (4) because that is its whole purpose. The gap is therefore split exactly along the depends_on seam (F9): give magicpath the missing *loop + export*, give sk-design-interface the missing *inherit + emit*, and wire them with a shared protocol.

### F22 — Prioritized recommendation (per skill, ranked)

**mcp-magicpath**
- **P1 · ADOPT — Fidelity verification after `code submit`** (F15). Next step: add a post-submit step that screenshots `view`/`share` and compares the render to the design intent (token system + brief), iterating on divergence. Closes the single biggest named gap (dim 2).
- **P1 · ADOPT — Cross-skill visual-feedback-loop protocol** (F16). Next step: document the loop intent→render→screenshot→compare→targeted-revision→stop-at-confidence as a small protocol shared with sk-design-interface (no new infra).
- **P2 · ADOPT — Design-token export** (F20). Next step: emit a tokens artifact (CSS vars / `tailwind.config` block) from the inherited/authored theme so handoff carries the design system, not just one component. Closes "no token generation."
- **P3 · ADAPT — Selection → targeted revision** (F15). Next step: route `selection` + a text instruction into `code start --component --revision <selectedRevisionId>` instead of a full rebuild (inline-comment analog).
- **P3 · ADAPT — Repo→theme bridge** (F11) + **target-device lever** (F18).
- **SKIP:** generate/push themes to MagicPath; Figma/PDF/slide export; comment threading; duplicating quality levers (F11/F18/F20/iter4 table).

**sk-design-interface**
- **P2 · ADAPT — Inherit-if-present token step** (F10). Next step: add an optional Step 0.5 that grounds in an existing token system (brand palette, `tailwind.config`, CSS vars, memory) when present, spending the aesthetic risk within those constraints. Extends the existing memory-as-hint rule.
- **P2 · ADAPT — Emit a structured handoff artifact** (F19). Next step: optionally output the token system + signature + copy rules as a small structured block for sk-code/magicpath to consume (pairs with magicpath token export).
- **P3 · ADAPT — Context intake** (F12). Next step: accept brand refs / page screenshots / competitor examples as grounding inputs framed "inherit-from / critique-against," never "copy."
- **P3 · ADAPT — Named bounded quality levers** (F17). Next step: name boldness/density/motion as intensity dials — guardrailed so they never become style presets.
- **P3 · ADAPT — Rendered self-critique loop** (F14). Next step: when a render surface exists, run a bounded render→critique→one-revision loop via mcp-chrome-devtools; keep reveal-at-confidence default.
- **SKIP:** style-preset/"pick-a-vibe" levers (philosophy violation); self-owned rendering pipeline; hosted canvas (F17/F19/F14).

### F23 — Resolved recommendation philosophy guardrail (R2)
Every sk-design-interface proposal is an *extension of an existing seam*, never a new chooser: inheritance rides memory-as-hint, levers name existing principles, the loop reuses the named screenshot tool. The one hard line — **no style presets / pick-a-vibe menu** — is preserved as primary negative knowledge (F17), so "closer to Claude Design" never means "templated generator."

### F24 — Cross-lineage cross-check hooks for the host (R4)
- **Expected agreement:** fidelity verification (F15) as the #1 magicpath move; the depends_on split (F9) as the organizing principle; multi-format export ruled out (F20).
- **Watch for divergence:** (a) whether sk-design-interface should expose *any* quality levers (philosophy risk — gpt55fast may rate this ADOPT vs this lineage's cautious P3 ADAPT); (b) the shape of token emit/export (structured block vs full token file); (c) whether the visual-feedback loop is one cross-skill protocol (this lineage, F16) or duplicated per skill.
- **Resolution rule:** prefer the lower-risk, fewer-new-subsystems option where lineages disagree, since the packet's mandate is parity *without* turning either CLI skill into a web product.

## Sources Consulted
- All iteration-1–4 findings (this lineage) [SOURCE: file:.opencode/specs/skilled-agent-orchestration/143-sk-design-interface/005-claude-design-parity-research/research/lineages/opus48-claude2/iterations/iteration-001.md:1]
- spec.md R1–R5 + success criteria [SOURCE: file:.opencode/specs/skilled-agent-orchestration/143-sk-design-interface/005-claude-design-parity-research/spec.md:88]

## Assessment
- **newInfoRatio: 0.25** — Mostly assembly of prior findings; genuinely new content is the scorecard scoring (F21), the cross-skill priority ranking (F22), and the cross-lineage divergence hooks (F24).
- **Novelty justification:** Prioritization across both skills (which P1 vs P3) and the divergence-watch list are new decisions not present in any single prior iteration.
- **Confidence:** High — the scorecard and ranking are derived entirely from cited prior findings; the only soft items are the predicted cross-lineage divergences (inherently speculative until the host compares).

## Reflection
- **Worked:** The depends_on seam (F9) made prioritization clean — every gap belongs unambiguously to one skill or to the shared protocol.
- **Failed / ruled out:** No new dead ends this iteration; consolidation only. Reaffirmed all prior negative knowledge in the scorecard SKIP rows.

## Recommended Next Focus
Loop complete at maxIterations (5/5). Hand to synthesis: compile `research.md` (17-section format with the Eliminated Alternatives section) from these five iterations; the host then cross-checks this lineage against `gpt55fast` per F24.
