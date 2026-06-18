# Iteration 4: The Output Side — Quality Levers (dim 4) + Output/Handoff (dim 5)

## Focus
Deep gap analysis on the two "output" dimensions, plus the consolidated negative-knowledge set (R5: what two CLI skills should deliberately leave out). Quality levers are assessed against the anti-default guardrail (R2) so that "make quality steerable" never degrades into "ship templated presets."

## Findings

### Dimension 4 — Quality Levers

#### F17 — sk-interface-design has implicit levers it could *name*, and a hard line it must not cross
Claude Design exposes user-facing quality dials. sk-interface-design has the same *concepts* but as fixed principles, not controls: (a) a binary quality **floor** (responsive, visible focus, reduced motion) [SOURCE: file:.opencode/skills/sk-interface-design/SKILL.md:115]; (b) "match complexity to the vision — maximalist directions need elaborate execution, minimal directions need precision" (a density/complexity lever) [SOURCE: file:.opencode/skills/sk-interface-design/references/design_principles.md:51]; (c) "spend your boldness in one place" (a restraint/signature-intensity lever) [SOURCE: file:.opencode/skills/sk-interface-design/references/design_principles.md:73]; (d) "one orchestrated moment" vs scattered effects (a motion lever) [SOURCE: file:.opencode/skills/sk-interface-design/references/design_principles.md:49].
- **ADAPT (medium value, guardrail-critical):** Name a *small* set of bounded levers that already exist implicitly — **boldness/restraint**, **density (minimal↔maximalist)**, **motion (none↔one orchestrated moment)** — so the user can steer intensity. The lever controls *how much risk to spend*, never *which look to apply*.
- **SKIP — and this is the most important guardrail in the study:** Do **not** turn levers into style presets / a palette-chooser / "pick a vibe" menu. That would reintroduce exactly the templated defaults the skill exists to reject ("NEVER ship a templated default … on a free axis"). [SOURCE: file:.opencode/skills/sk-interface-design/SKILL.md:133] The data CSVs stay "patterns to critique against … never a chooser." [SOURCE: file:.opencode/skills/sk-interface-design/SKILL.md:151] (Primary negative knowledge.)

#### F18 — mcp-magicpath has no quality levers of its own, and should keep it that way
Its canvas Design Defaults (responsive, centered, no mockups, single screen, fully interactive) are a fixed floor for authoring, not dials [SOURCE: file:.opencode/skills/mcp-magicpath/references/magicpath_operations.md:295]; quality judgment is delegated to sk-interface-design (F9). The one latent lever it owns is **target device** via `--width`/`--height` on `code start`/`submit`. [SOURCE: file:.opencode/skills/mcp-magicpath/references/magicpath_operations.md:311]
- **ADAPT (low):** Surface "target device/viewport" as an explicit lever (it is already a parameter, just not framed as a user-facing quality control).
- **ADOPT: nothing** — quality levers should live once, in sk-interface-design; duplicating them in magicpath would split the source of truth (negative knowledge).

### Dimension 5 — Output / Handoff

#### F19 — sk-interface-design produces no artifact; its handoff is prose intent
It explicitly owns the look and hands implementation to sk-code; it does not render or emit. [SOURCE: file:.opencode/skills/sk-interface-design/SKILL.md:184]
- **ADAPT (high value, pairs with F10):** Emit the design direction as a small **structured handoff artifact** — the token system (named hex + type roles + scale), the signature element, and the copy rules — so sk-code / mcp-magicpath consume a contract instead of re-deriving intent from prose. This is the natural "Claude Code handoff" analog: a machine-usable brief, not a rendered file.
- **SKIP:** Rendering images/PDF/slides itself — a judgment skill should not own a rendering pipeline; that belongs to sk-code/magicpath/chrome-devtools (negative knowledge).

#### F20 — mcp-magicpath's handoff is already code-in-repo; the gap is *design-system* export, not component export
`add` writes React/TS component source into the user's repo (`src/components/magicpath/`) [SOURCE: file:.opencode/skills/mcp-magicpath/SKILL.md:210]; `view`/`share` produce a viewable/shareable URL of the canvas result [SOURCE: file:.opencode/skills/mcp-magicpath/references/magicpath_operations.md:405]. So a "Claude Code handoff" (editable code in the user's project) and a lightweight "presentation" (share URL) already exist.
- **ADOPT (high value, pairs with F11):** **Design-token export** — generate a tokens artifact (CSS variables / `tailwind.config` block) from the inherited/authored theme, so the handoff carries the *design system*, not just one component. This closes the "no token generation" named gap. [SOURCE: file:.opencode/specs/skilled-agent-orchestration/143-sk-interface-design/005-claude-design-parity-research/spec.md:143]
- **ADAPT (low):** Frame `share`/`view` URLs as the explicit "export/preview" deliverable alongside installed code.
- **SKIP — key dim-5 negative knowledge:** Figma export, PDF export, and slide/presentation generation. Multi-format export is the clearest place two CLI skills should stop: it is heavy third-party integration with low leverage for a code-first workflow, and Claude Code handoff (code + tokens) already covers the practical handoff need.

### Consolidated negative knowledge (R5) — what to deliberately leave out
| Ruled-out capability | Skill | Why it stays out |
|---|---|---|
| Style presets / "pick a vibe" lever menu | sk-interface-design | Reintroduces templated defaults — violates the skill's core philosophy (F17) |
| Self-owned rendering pipeline (image/PDF) | sk-interface-design | Judgment skill; rendering belongs to sk-code/magicpath/chrome-devtools (F19) |
| Generate + push themes back to MagicPath | mcp-magicpath | No CLI surface; platform scope creep (F11/iter2) |
| Comment/threading infrastructure | both | Belongs to the Claude Design / MagicPath web product (F14/F15) |
| Figma / PDF / presentation export | mcp-magicpath | Heavy integration, low leverage; code+token handoff suffices (F20) |
| Duplicating quality levers in magicpath | mcp-magicpath | Splits the source of truth; levers live once in sk-interface-design (F18) |
| Hosted canvas replicating the web product | both | Explicitly out of scope (spec §3) |

### Refined verdict (dims 4 & 5)
| Dimension | sk-interface-design | mcp-magicpath |
|---|---|---|
| 4. Quality levers | Name 3 bounded levers (boldness/density/motion); never presets (F17) | Surface target-device lever; defer levers to sk-interface-design (F18) |
| 5. Output / handoff | Emit structured handoff brief/token artifact (F19) | ADOPT design-token export; share URL as preview; no multi-format (F20) |

## Sources Consulted
- sk-interface-design/SKILL.md (quality floor; never templated default; data as critique-against; hands to sk-code) [SOURCE: file:.opencode/skills/sk-interface-design/SKILL.md:115]
- design_principles.md (complexity/density, restraint, motion levers) [SOURCE: file:.opencode/skills/sk-interface-design/references/design_principles.md:49]
- magicpath_operations.md (Design Defaults floor; width/height target; add install; view/share URLs) [SOURCE: file:.opencode/skills/mcp-magicpath/references/magicpath_operations.md:295]
- mcp-magicpath/SKILL.md (add = React/TS source handoff) [SOURCE: file:.opencode/skills/mcp-magicpath/SKILL.md:210]
- spec.md (no-token-generation named gap) [SOURCE: file:.opencode/specs/skilled-agent-orchestration/143-sk-interface-design/005-claude-design-parity-research/spec.md:143]

## Assessment
- **newInfoRatio: 0.55** — New per-skill recommendations for two dimensions plus the consolidated negative-knowledge table (R5); reuses the F10/F11 pairings (~45% leverage on prior iterations).
- **Novelty justification:** The token-export ADOPT for magicpath (F20) and the "name levers but never presets" guardrail (F17) are new and are the load-bearing items for the output side and the philosophy guarantee.
- **Confidence:** High — every item maps to an existing parameter, command, or principle; the SKIP set is grounded in explicit scope/philosophy statements.

## Reflection
- **Worked:** Pairing each output-side ADOPT with its input-side twin (F19↔F10, F20↔F11) shows the recommendation is internally consistent: inherit a system → author/judge → export the same system.
- **Failed / ruled out:** Multi-format export and self-owned rendering — both ruled out with reasons (negative knowledge), confirming the two skills should stay code-first.

## Recommended Next Focus
Iteration 5: Synthesis-prep — assemble the consolidated parity scorecard (per dimension: target, current, gap, priority), the prioritized per-skill ADOPT/ADAPT/SKIP list with one concrete next step each, and the cross-lineage cross-check hooks for the gpt55fast lineage.
