# Research Synthesis — Claude Design Parity for sk-interface-design and mcp-magicpath
## Lineage: opus48-claude2 (cli-claude-code · claude-opus-4-8 · xhigh)

> Lineage-local synthesis for the `opus48-claude2` fan-out lineage. Sibling lineage: `gpt55fast`. The host cross-checks the two lineages (R4) and owns the packet-level `research/research.md`. This document is one lineage's independent, converged answer.

---

## 1. Executive Summary

The two skills are already composed: `mcp-magicpath` `depends_on` `sk-interface-design`, so the parity gap splits cleanly along a **judgment-vs-canvas seam** (F9). `mcp-magicpath` owns the mechanical surface (canvas, install, themes) and is closer to Claude Design on four of five dimensions; `sk-interface-design` owns design judgment and leads only on quality. The single highest-value move in the whole study is **fidelity verification in `mcp-magicpath` after `code submit`** (F15) — both skills today define "done" as *compiles + responsive*, never *matches intent*, which is exactly the dim-2 gap. The cheapest path to a real iteration loop is **a shared cross-skill protocol, not new infrastructure** (F16): judgment (intent) → canvas (render) → screenshot (observe) → compare → targeted revision → stop-at-confidence — every part already exists across the two skills plus `mcp-chrome-devtools`. The hard constraint throughout: improvements must never turn `sk-interface-design` into a templated generator (F17/F23).

**Top 3 actions:** (1) P1 — `mcp-magicpath` fidelity verification + the shared loop protocol; (2) P2 — paired token *emit* (`sk-interface-design`) and token *export* (`mcp-magicpath`) so the design system, not just one component, is the handoff; (3) P3 — `sk-interface-design` context intake, bounded named levers, and a rendered self-critique loop.

---

## 2. Scope & Method

- **Question:** What concrete, prioritized improvements move each skill closer to Claude Design across five dimensions (design-system inheritance, iteration/visual feedback, context grounding, quality levers, output/handoff), scored against Claude Design, and what to leave out? (spec §7)
- **Type:** Read-only deep research; recommend only, no skill changes this packet (spec §2).
- **Method:** 5-iteration deep-research loop, fresh-context per iteration, externalized JSONL state. Iter 1 baseline; iters 2–4 per-dimension gaps with ADOPT/ADAPT/SKIP; iter 5 scorecard + prioritization. Stopped at maxIterations (5/5).
- **Evidence base:** direct reads of both skills' `SKILL.md` and primary references (`design_principles.md`, `magicpath_operations.md`), plus the spec's seeded Claude Design capability summary. Claude Design's feature set was taken as seeded (re-deriving it is out of scope; host verifies — spec §3).

---

## 3. Background — The Parity Target

Claude Design (Anthropic's conversational design tool, seeded from the spec / support article): conversational generation of designs/prototypes/presentations; **org design-system inheritance**; **canvas + inline-comment iteration**; **context attachments**; **multi-format export**; **Claude Code handoff**; **named quality levers** [SOURCE: file:.opencode/specs/skilled-agent-orchestration/148-sk-interface-design/005-claude-design-parity-research/spec.md:141]. These map to the five R1 assessment dimensions used throughout.

---

## 4. Current-State Baseline

- `sk-interface-design` is a **judgment** skill, not a generation skill: ground → token system → critique-against-defaults → build → self-critique, owning the *look* and handing implementation to `sk-code` [SOURCE: file:.opencode/skills/sk-interface-design/SKILL.md:92] [SOURCE: file:.opencode/skills/sk-interface-design/SKILL.md:184]. Its differentiator is the anti-default philosophy [SOURCE: file:.opencode/skills/sk-interface-design/references/design_principles.md:59].
- `mcp-magicpath` is a **CLI** over the `magicpath-ai` canvas tool: install (search/inspect/add → React/TS) + author (code start/submit revisions) + repo import, with themes and Design Defaults, and it `depends_on` `sk-interface-design` for the visual direction [SOURCE: file:.opencode/skills/mcp-magicpath/SKILL.md:250].
- **Key structural fact (F9):** the depends_on composition means judgment-side gaps belong to `sk-interface-design` and canvas/CLI-side gaps to `mcp-magicpath`; the recommendation stays per-skill plus one shared protocol.

---

## 5. Dimension 1 — Design-System Inheritance

- **Target:** inherit an org/design system automatically.
- **sk-interface-design (score 1/3):** has token *content* (4–6 named hex + display/body/utility faces + scale) but only in thinking, with no ingest or emit — yet grounding already endorses using memory/brand context "as a hint." Inheritance is *endorsed-but-absent* (F3/F10) [SOURCE: file:.opencode/skills/sk-interface-design/references/design_principles.md:61] [SOURCE: file:.opencode/skills/sk-interface-design/references/design_principles.md:37].
- **mcp-magicpath (score 2/3):** genuinely inherits via `get-theme` (light/dark CSS vars + fonts + natural-language `prompt`) and reads repo design tokens during import — near-parity on *consume*, but consume-only (F7/F11) [SOURCE: file:.opencode/skills/mcp-magicpath/references/magicpath_operations.md:124] [SOURCE: file:.opencode/skills/mcp-magicpath/references/magicpath_operations.md:282].
- **Moves:** ADAPT `sk-interface-design` "inherit-if-present" Step 0.5 + optional token emit; ADAPT `mcp-magicpath` repo→theme bridge.

---

## 6. Dimension 2 — Iteration / Visual Feedback (the hardest gap)

- **Target:** canvas + inline-comment iteration; the rendered design is the source of truth.
- **sk-interface-design (score 1/3):** iterates *privately* — "plan and iterate in your thinking, only show ideas at higher confidence," self-critique = "screenshot if possible, remove one accessory." This is the deliberate *inverse* of Claude Design's open, comment-driven loop (F14) [SOURCE: file:.opencode/skills/sk-interface-design/references/design_principles.md:67].
- **mcp-magicpath (score 2/3):** has a real canvas with pending revisions (`code start`/`submit`, `--revision`, `selectedRevisionId`), but an **open** loop — `submit --wait` verifies the *build* compiled, never that the render *matches intent*; "no iteration loop, no fidelity verification" is a named gap (F6/F15) [SOURCE: file:.opencode/skills/mcp-magicpath/references/magicpath_operations.md:289] [SOURCE: file:.opencode/specs/skilled-agent-orchestration/148-sk-interface-design/005-claude-design-parity-research/spec.md:143].
- **Critical insight (F16):** the loop is a *missing protocol, not missing parts* — judgment (`sk-interface-design`) + canvas render (`mcp-magicpath` `view`/`share`) + screenshot (`mcp-chrome-devtools`, already named) compose into a closed loop with no new machinery [SOURCE: file:.opencode/skills/sk-interface-design/SKILL.md:188].
- **Moves:** **ADOPT `mcp-magicpath` fidelity verification (P1)**; ADOPT the shared loop protocol (P1); ADAPT `sk-interface-design` rendered self-critique loop; ADAPT `mcp-magicpath` selection→targeted-revision as the inline-comment analog.

---

## 7. Dimension 3 — Context Grounding

- **Target:** context attachments (brand refs, examples, files).
- **sk-interface-design (score 1/3):** grounds in the subject + memory hints but has no structured attachment intake (F2/F12) [SOURCE: file:.opencode/skills/sk-interface-design/references/design_principles.md:37].
- **mcp-magicpath (score 2/3):** strong *code-context* grounding (reads destination functionality, layout, data flow, design system) and ingests selected canvas images to `assets/selected/**` — arguably exceeds Claude Design on code context, partial on visual reference (F13) [SOURCE: file:.opencode/skills/mcp-magicpath/references/magicpath_operations.md:118] [SOURCE: file:.opencode/skills/mcp-magicpath/references/magicpath_operations.md:154].
- **Moves:** ADAPT `sk-interface-design` "context intake" framed inherit-from/critique-against (never copy); ADAPT `mcp-magicpath` image-as-visual-brief (route into the judgment skill, not just embed).

---

## 8. Dimension 4 — Quality Levers

- **Target:** named, user-facing quality dials.
- **sk-interface-design (score 2/3):** has the *concepts* as fixed principles — a binary quality floor (responsive/focus/reduced-motion) plus complexity/density, restraint/boldness, and motion principles — but not as steerable dials (F4/F17) [SOURCE: file:.opencode/skills/sk-interface-design/SKILL.md:115] [SOURCE: file:.opencode/skills/sk-interface-design/references/design_principles.md:51].
- **mcp-magicpath (score 1/3):** no levers of its own (Design Defaults are a fixed floor); the one latent lever is target device via `--width`/`--height` (F18) [SOURCE: file:.opencode/skills/mcp-magicpath/references/magicpath_operations.md:311].
- **Moves:** ADAPT `sk-interface-design` to *name* boldness/density/motion as bounded intensity dials — guardrailed so they never become presets; ADAPT `mcp-magicpath` to surface target-device, and otherwise defer levers to `sk-interface-design`.

---

## 9. Dimension 5 — Output / Handoff

- **Target:** multi-format export + Claude Code handoff.
- **sk-interface-design (score 0/3):** produces no artifact; its handoff is prose intent to `sk-code` (F2/F19) [SOURCE: file:.opencode/skills/sk-interface-design/SKILL.md:184].
- **mcp-magicpath (score 2/3):** `add` already writes React/TS source into the user's repo (a real Claude Code handoff) and `view`/`share` give a viewable URL (a lightweight presentation) — but no design-token export ("no token generation" named gap) (F8/F20) [SOURCE: file:.opencode/skills/mcp-magicpath/SKILL.md:210] [SOURCE: file:.opencode/skills/mcp-magicpath/references/magicpath_operations.md:405].
- **Moves:** ADAPT `sk-interface-design` to emit a structured handoff artifact (token system + signature + copy rules); **ADOPT `mcp-magicpath` design-token export (P2)**; frame share/view URLs as the explicit preview deliverable.

---

## 10. Parity Scorecard (R3)

0 = absent · 1 = adjacent · 2 = partial · 3 = parity.

| # | Dimension | Target | sk-interface-design | mcp-magicpath | Headline move |
|---|---|---|:--:|:--:|---|
| 1 | Design-system inheritance | Inherit org system | 1 | 2 | sk: inherit-if-present + emit; mp: repo→theme bridge |
| 2 | Iteration / visual feedback | Canvas + comment loop | 1 | 2 | **mp: fidelity verification (P1)** + shared loop protocol |
| 3 | Context grounding | Attachments | 1 | 2 | sk: context intake; mp: image-as-brief |
| 4 | Quality levers | Named dials | 2 | 1 | sk: name bounded levers (never presets) |
| 5 | Output / handoff | Export + code handoff | 0 | 2 | **mp: token export (P2)**; sk: structured brief |

**Read:** `mcp-magicpath` leads on the mechanical dimensions (1,2,3,5) because it owns the canvas/CLI; `sk-interface-design` leads only on judgment (4). Close the gap by giving `mcp-magicpath` the missing *loop + export* and `sk-interface-design` the missing *inherit + emit*, wired by one shared protocol.

---

## 11. Recommendations (prioritized, per skill) (R2)

### mcp-magicpath
| Pri | Class | Move | Concrete next step |
|----|-------|------|--------------------|
| P1 | ADOPT | Fidelity verification after `code submit` (F15) | Post-submit: screenshot `view`/`share`, compare render to intent (tokens+brief), iterate on divergence |
| P1 | ADOPT | Shared visual-feedback-loop protocol (F16) | Document intent→render→screenshot→compare→targeted-revision→stop, shared with sk-interface-design |
| P2 | ADOPT | Design-token export (F20) | Emit CSS vars / `tailwind.config` tokens from the inherited/authored theme alongside installed code |
| P3 | ADAPT | Selection→targeted revision (F15) | Route `selection`+instruction into `code start --component --revision <selectedRevisionId>` |
| P3 | ADAPT | Repo→theme bridge (F11) + target-device lever (F18) | Synthesize repo tokens into a theme object; surface `--width/--height` as a device lever |

### sk-interface-design
| Pri | Class | Move | Concrete next step |
|----|-------|------|--------------------|
| P2 | ADAPT | Inherit-if-present token step (F10) | Optional Step 0.5: ground in an existing token system when present; spend risk within it |
| P2 | ADAPT | Emit structured handoff artifact (F19) | Optionally output token system + signature + copy rules as a small structured block |
| P3 | ADAPT | Context intake (F12) | Accept brand refs / screenshots / examples as inherit-from / critique-against inputs |
| P3 | ADAPT | Named bounded quality levers (F17) | Name boldness/density/motion as intensity dials — guardrailed, never presets |
| P3 | ADAPT | Rendered self-critique loop (F14) | When a render surface exists, run a bounded render→critique→one-revision loop via chrome-devtools |

---

## Eliminated Alternatives (negative knowledge — primary output) (R5)

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Re-derive Claude Design's feature set | Out of scope; rely on seeded summary | spec.md:78 | 1 |
| Merge the two skills into one | Clean `depends_on` boundary; keep per-skill | mcp-magicpath/SKILL.md:250 | 1 |
| Generate + push themes back to MagicPath account | No `create-theme` in CLI surface; platform scope creep | magicpath_operations.md:413 | 2 |
| File/attachment upload-and-storage pipeline | Runtime already supplies file paths/images | magicpath_operations.md:154 | 2 |
| Hosted canvas + live inline-comment threads in a CLI skill | That is the Claude Design web product; out of scope | spec.md:78 | 3 |
| Heavyweight visual-regression / diff engine for fidelity | Screenshot + judgment compare already afforded | sk-interface-design/SKILL.md:188 | 3 |
| **Style presets / "pick-a-vibe" lever menu in sk-interface-design** | **Reintroduces templated defaults — violates the skill's core anti-default philosophy (primary)** | sk-interface-design/SKILL.md:133 | 4 |
| Figma / PDF / presentation multi-format export in magicpath | Heavy integration, low leverage; code+token handoff suffices | mcp-magicpath/SKILL.md:210 | 4 |
| Self-owned rendering pipeline in sk-interface-design | Judgment skill; rendering belongs to sk-code/magicpath/chrome-devtools | sk-interface-design/SKILL.md:184 | 4 |
| Duplicating quality levers inside magicpath | Splits the source of truth; levers live once in sk-interface-design | magicpath_operations.md:295 | 4 |

---

## 12. Open Questions

- Exact *shape* of the emitted token artifact (inline structured block vs a written `tokens` file) — left to the implementation packet; this lineage favors the lightest shape that `sk-code`/`mcp-magicpath` can both consume.
- Whether the fidelity-compare step should be fully automated each submit or operator-gated — depends on cost/latency of the screenshot step in practice.
- How many named levers are too many before they read as a preset menu (the F17 guardrail boundary) — needs a design review, not more research.

---

## 13. Cross-Lineage Cross-Check Hooks (R4)

- **Expected agreement with gpt55fast:** fidelity verification as #1 magicpath move; the depends_on split as the organizing principle; multi-format export ruled out.
- **Watch for divergence:** (a) whether `sk-interface-design` should expose *any* quality levers (philosophy risk — sibling may rate ADOPT vs this lineage's cautious P3 ADAPT); (b) token emit/export shape (structured block vs full token file); (c) whether the feedback loop is one shared protocol (this lineage) or duplicated per skill.
- **Resolution rule:** where lineages disagree, prefer the lower-risk / fewer-new-subsystems option — the mandate is parity *without* turning either CLI skill into a web product.

---

## 14. Philosophy Guardrail (R2)

Every `sk-interface-design` proposal is an extension of an existing seam (memory-as-hint → inheritance; existing principles → named levers; named screenshot tool → rendered loop), never a new chooser. The hard line — **no style presets / pick-a-vibe menu** — is preserved as primary negative knowledge (F17/F23). "Closer to Claude Design" must never mean "templated generator."

---

## 15. Risks & Caveats

- Claude Design's capabilities are taken as seeded, not independently verified by this lineage (by design — host verifies). If the seeded summary is wrong on a dimension, that dimension's verdict shifts.
- The visual-feedback-loop protocol (F16) is a design proposal, not a built-and-validated loop; the fidelity-compare's practical cost is unmeasured.
- Predicted cross-lineage divergences (F24) are speculative until the host compares.

---

## 16. Convergence Report

- **Stop reason:** `maxIterationsReached` (5/5) — hard stop; legal-stop gates not required for a max-iteration exit.
- **Iterations completed:** 5.
- **Questions answered:** 5/5 (Q1–Q5).
- **newInfoRatio trend:** 1.00 → 0.70 → 0.65 → 0.55 → 0.25 (avg ≈ 0.63, descending). Well above the 0.05 threshold throughout, so the cap — not premature convergence — ended the loop; the descending trend confirms genuine diminishing novelty by iter 5.
- **Quality guards:** source diversity OK (5 distinct primary docs + spec); focus alignment OK (one dimension-pair per iteration); no single-weak-source dominance (every finding cites a primary skill doc or the spec).

---

## 17. References

- spec.md — topic, seeded Claude Design capabilities, R1–R5, success criteria, named magicpath gaps [SOURCE: file:.opencode/specs/skilled-agent-orchestration/148-sk-interface-design/005-claude-design-parity-research/spec.md:1]
- sk-interface-design/SKILL.md — process, quality floor, anti-default rules, integration boundary [SOURCE: file:.opencode/skills/sk-interface-design/SKILL.md:1]
- sk-interface-design/references/design_principles.md — grounding, token brainstorm, calibration, restraint, self-critique [SOURCE: file:.opencode/skills/sk-interface-design/references/design_principles.md:1]
- mcp-magicpath/SKILL.md — install/author directions, depends_on, success criteria [SOURCE: file:.opencode/skills/mcp-magicpath/SKILL.md:1]
- mcp-magicpath/references/magicpath_operations.md — themes, canvas code flow, Design Defaults, repo import, quick reference [SOURCE: file:.opencode/skills/mcp-magicpath/references/magicpath_operations.md:1]
- Lineage iterations 001–005 [SOURCE: file:.opencode/specs/skilled-agent-orchestration/148-sk-interface-design/005-claude-design-parity-research/research/lineages/opus48-claude2/iterations/iteration-001.md:1]

_(resource-map.md was not present at init; no coverage-gate citation.)_
