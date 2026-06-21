# Claude Design Parity Research: gpt55fast Lineage

## 1. Executive Summary

This lineage recommends a shared Claude Design parity protocol across `sk-design-interface` and `mcp-magicpath`, not a product clone. Claude Design's observable advantage is the combination of design-system inheritance, context attachments, conversational plus visual iteration, canvas review, output export, and Claude Code handoff. Locally, `sk-design-interface` already owns design judgment and anti-default critique, while `mcp-magicpath` already owns canvas and code-session execution. The gap is the missing connective protocol: persistent design-system/context intake, a revision ledger, visual feedback routing, fidelity scorecard, and handoff manifest.

## 2. Research Topic

How can `sk-design-interface` and `mcp-magicpath` be improved to get their UI-design results closer to Claude Design while preserving the scope of two CLI skills?

## 3. Method

- Ran five focused iterations in the `gpt55fast` lineage.
- Used Anthropic support docs for Claude Design's public product behavior.
- Read local skill contracts and references for `sk-design-interface` and `mcp-magicpath`.
- Produced ADOPT / ADAPT / SKIP recommendations and negative knowledge for the parent synthesis.

## 4. Source Inventory

| Source | Role |
|---|---|
| Claude Design getting-started article | Target user flow, iteration, export, handoff |
| Claude Design design-system setup article | Design-system inheritance target |
| Claude Design admin guide | Governance and rollout context |
| `sk-design-interface/SKILL.md` and references | Current design-judgment skill surface |
| `mcp-magicpath/SKILL.md` and references | Current canvas and CLI execution surface |
| Parent `spec.md` | Scope, success criteria, and cross-lineage requirements |

## 5. Claude Design Baseline

Claude Design combines a chat interface with a canvas, where the user describes a design, reviews it visually, and iterates through chat or inline comments. Projects inherit organization design-system colors, typography, and component patterns automatically. Users can attach screenshots, images, slide decks, documents, codebases, and existing design files. They can export to zip, PDF, PPTX, Canva, standalone HTML, and hand off to Claude Code. [SOURCE: https://support.claude.com/en/articles/14604416-get-started-with-claude-design]

Design-system setup extracts reusable components, colors, typography, and layout patterns from brand assets, codebases, slides, documents, and prototypes. After publishing, team projects inherit that design system. [SOURCE: https://support.claude.com/en/articles/14604397-set-up-your-design-system-in-claude-design]

Team and Enterprise rollout guidance emphasizes design-system setup before broad access, custom roles, phased onboarding, qualitative monitoring, and data-handling constraints. [SOURCE: https://support.claude.com/en/articles/14604406-claude-design-admin-guide-for-team-and-enterprise-plans]

## 6. sk-design-interface Current State

`sk-design-interface` is strong where Claude Design needs design judgment: it grounds the subject, creates a compact token system, critiques against AI-default looks, builds from the revised plan, and self-critiques against a quality floor. [SOURCE: file:.opencode/skills/sk-design-interface/SKILL.md:90]

Its key gaps are persistent context and observable iteration. It does not require a design-system snapshot before choosing tokens, does not persist a user-visible design revision ledger, and does not emit a standard handoff manifest. Its CSV inventory must remain critique-against data, not a generator. [SOURCE: file:.opencode/skills/sk-design-interface/references/design_inventory.md:67]

## 7. mcp-magicpath Current State

`mcp-magicpath` is strong where Claude Design needs a canvas. It can author and edit canvas components through `code start` and `code submit`, apply themes, import repositories onto the canvas, keep a project canvas visible in embedded-browser hosts, and hand component source to downstream code workflows. [SOURCE: file:.opencode/skills/mcp-magicpath/references/magicpath_operations.md:289]

Its key gaps are conversational revision semantics and final handoff structure. It has commands, but not a Claude Design-like feedback protocol that distinguishes broad chat revisions from targeted canvas comments. It also lacks a standard post-submit manifest capturing theme, viewport, interactions, limitations, and next integration steps. [SOURCE: file:.opencode/skills/mcp-magicpath/references/cli_reference.md:322]

## 8. Parity Dimensions

| Dimension | Claude Design Target | `sk-design-interface` | `mcp-magicpath` |
|---|---|---|---|
| Design-system inheritance | Org design system auto-applies to projects | Low: no required snapshot | Medium-high: themes exist but preflight could be stronger |
| Context grounding | Screenshots, assets, decks, docs, codebases | Medium: brief and memory, no artifact schema | Medium-high: repo import reads design foundation |
| Iteration and visual feedback | Chat plus inline comments on canvas | Low-medium: internal loop, no revision ledger | Medium: canvas exists, but no feedback protocol |
| Quality levers | Ask for variations, accessibility review, responsiveness | High: anti-default and quality floor | Medium-high: Design Defaults and adaptation rules |
| Output and handoff | HTML, PDF, PPTX, Canva, Claude Code | Medium-low: handoff implicit | High for code/canvas, low for multi-format export |
| Governance | RBAC, rollout, team design system | Low: not applicable except skill docs | Low-medium: teams/themes exist in CLI |

## 9. Gap Analysis

The core gap is not that local skills cannot make or implement UI. The core gap is that Claude Design makes the design context, visual iteration, and handoff visible as first-class workflow objects. The local framework currently splits those concerns across two skills with implicit transitions.

`sk-design-interface` needs more context and handoff structure. `mcp-magicpath` needs more design-process and feedback structure. The right answer is a shared protocol that lets each skill remain itself.

## 10. ADOPT / ADAPT / SKIP Recommendations

| Skill | Rank | Recommendation | Reason |
|---|---|---|---|
| `sk-design-interface` | ADOPT | Add a design-context intake snapshot | Mirrors Claude Design attachments while staying local and prompt/file based. |
| `sk-design-interface` | ADOPT | Emit a design handoff manifest | Makes tokens, critique, quality checks, and implementation notes durable. |
| `sk-design-interface` | ADAPT | Persist a lightweight revision ledger for visual feedback | Adds iteration visibility without becoming a canvas product. |
| `sk-design-interface` | SKIP | Auto-generate from design CSVs | Violates critique-against catalog rules. |
| `mcp-magicpath` | ADOPT | Add Claude Design-style preflight for project, theme, viewport, source context, and feedback mode | Turns operational commands into a guided design workflow. |
| `mcp-magicpath` | ADOPT | Formalize chat-vs-comment revision routing | Broad feedback should re-plan; targeted feedback should scope component edits. |
| `mcp-magicpath` | ADAPT | Emit a post-submit handoff manifest | Replaces unavailable export formats with actionable local handoff. |
| `mcp-magicpath` | SKIP | Promise PDF/PPTX/Canva export parity | Not available in the CLI skill contract. |

## 11. Prioritized Recommendations

1. Create a shared `claude-design-parity` workflow section that both skills reference.
2. Add a `design-context-snapshot` schema: brand/design system, assets, code context, audience, viewport, output target, and constraints.
3. Add an `iteration-ledger` schema: revision number, feedback source, broad-vs-targeted classification, changes made, visual check, and unresolved comments.
4. Add a `handoff-manifest` schema: token system, theme variables, files changed, interactions, accessibility/responsive checks, open risks, and next `sk-code` steps.
5. Update `mcp-magicpath` AUTHOR and REPO_IMPORT paths to explicitly call the `sk-design-interface` process before canvas code work, then store the design manifest next to canvas session notes.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Treat Claude Design as only a UI generator | The support docs show design-system setup, context attachments, iteration, export, and handoff as core capabilities. | Claude Design getting-started and setup docs | 1 |
| Convert `sk-design-interface` CSVs into a design generator | The catalog is explicitly for naming and deviating from defaults, not choosing final designs. | `design_inventory.md` | 2 |
| Use MagicPath `add`/`inspect` for repository import | The repo import reference says this is the inverse flow and must use `code start` to `code submit`. | `working_with_repositories.md` | 3 |
| Clone hosted Claude Design exports | PDF/PPTX/Canva export requires product capabilities outside the CLI skills. | Claude Design export docs | 4 |
| Claim cross-model agreement in this lineage | This lineage cannot read sibling lineages; parent synthesis owns comparison. | Parent spec R4 | 5 |

## 12. Open Questions

- Should the shared parity protocol be a new helper reference under one of the two skills, or a neutral shared reference consumed by both?
- Should `mcp-magicpath` always invoke `sk-design-interface` in AUTHOR and REPO_IMPORT, or only when the brief has free visual axes?
- How much of the handoff manifest should be machine-readable JSON versus markdown?

## 13. Risks and Constraints

- Overfitting to Claude Design could dilute `sk-design-interface`'s anti-default stance.
- Overloading `mcp-magicpath` with design judgment would duplicate `sk-design-interface` instead of composing it.
- Multi-format export parity is not realistic unless MagicPath or another tool supplies those formats.
- Public Claude Design docs describe behavior, not internals.

## 14. Implementation Sequencing

1. Add shared schemas and examples for context snapshot, iteration ledger, and handoff manifest.
2. Update `sk-design-interface` to produce and consume the context snapshot and handoff manifest.
3. Update `mcp-magicpath` to require theme/context preflight for canvas authoring and repo import.
4. Add a visual feedback routing section to `mcp-magicpath`: broad chat, targeted comment, revision save, and follow-up submit.
5. Add manual testing scenarios for on-brand generation, targeted comment edit, repo import fidelity, and handoff to `sk-code`.

## 15. Cross-Lineage Merge Notes

The parent synthesis should compare sibling lineages for these points:

- Whether they also prioritize a shared protocol over separate skill-local changes.
- Whether they rank MagicPath theme preflight above `sk-design-interface` design-context intake.
- Whether they propose any export/handoff formats beyond manifest plus code/canvas link.
- Whether they preserve the no-generator rule for `sk-design-interface` data files.

## 16. References

- Claude Design getting started: `https://support.claude.com/en/articles/14604416-get-started-with-claude-design`
- Claude Design design-system setup: `https://support.claude.com/en/articles/14604397-set-up-your-design-system-in-claude-design`
- Claude Design admin guide: `https://support.claude.com/en/articles/14604406-claude-design-admin-guide-for-team-and-enterprise-plans`
- `file:.opencode/skills/sk-design-interface/SKILL.md`
- `file:.opencode/skills/sk-design-interface/references/design_principles.md`
- `file:.opencode/skills/sk-design-interface/references/ux_quality_reference.md`
- `file:.opencode/skills/sk-design-interface/references/design_inventory.md`
- `file:.opencode/skills/mcp-magicpath/SKILL.md`
- `file:.opencode/skills/mcp-magicpath/references/magicpath_operations.md`
- `file:.opencode/skills/mcp-magicpath/references/cli_reference.md`
- `file:.opencode/skills/mcp-magicpath/references/working_with_repositories.md`
- `file:.opencode/skills/mcp-magicpath/references/working_with_embedded_browsers.md`

## 17. Convergence Report

- Stop reason: `maxIterationsReached`
- Total iterations: 5
- Questions answered: 5 / 5 key questions
- Remaining questions: 0 inside this lineage; 3 merge questions deferred to parent synthesis
- Last 3 iteration summaries: run 3 `mcp-magicpath current-state parity gap` (0.63), run 4 `Per-skill ADOPT, ADAPT, SKIP recommendation set` (0.42), run 5 `Scorecard, convergence check, and host-merge notes` (0.18)
- Convergence threshold: 0.05
- Quality guard result: pass. Evidence includes three external Claude Design docs, five `sk-design-interface` files, five `mcp-magicpath` files, and parent spec requirements.
