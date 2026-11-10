### .skilled/skills/sk-design/sk-design-md-generator/references/quality-checklist.md

- [P2] .skilled/skills/sk-design/sk-design-md-generator/references/quality-checklist.md:25 | 1 | Section 1 repeats both intro sentences word for word, so the hook and OVERVIEW say the same thing and the reference template's no-duplication rule is broken. | Replace line 25 with: "The current output is the v3 **Style Reference** (`design-md-format.md`): a named, confident, restrained design-system handoff whose value-bearing sections (`## Tokens — Colors`, `## Tokens — Spacing & Shapes`, `## Surfaces`, `## Quick Start`) are pre-rendered deterministically by `backend/scripts/formatters-v3.ts` and pasted unchanged. The agent writes prose only. Many checks below therefore verify that the pre-rendered sections were not edited and that the prose is named, grounded, and honest." (Both deleted sentences survive verbatim in the line 19 intro.)
- [P2] .skilled/skills/sk-design/sk-design-md-generator/references/quality-checklist.md:27 | 7 | One paragraph carries four distinct mechanisms — evocative naming, pre-rendered-table restoration, Quick Start fidelity, FLAT elevation — so none of the four can be scanned. | Replace line 27 with:
  ```
  **Named, deterministic, and honest.**

  - Colours are NAMED evocatively (Obsidian Ink, Voltage) with clean `--color-<slug>` tokens; components are NAMED by function (Primary CTA, Card, Badge), never "Variant-N" or "div".
  - Because the value tables are pre-rendered, value-fidelity failures mean the block was edited after pasting — restore it.
  - The Quick Start is checked by `checkQuickStartFidelity` (every hex traces to a token; `--page-max-width` matches `tokens.maxContentWidth`).
  - Elevation is never omitted — when 0 shadows it is rendered FLAT and the prose states how depth is achieved (border contrast, whitespace), never "gradient-as-depth".
  ```
- [P2] .skilled/skills/sk-design/sk-design-md-generator/references/quality-checklist.md:29 | 7 | One paragraph carries six distinct mechanisms — token gating, ABSENT stamping, the no-fabrication expectation, the cite-or-`[INFERRED]` rule, the two WARNING checks plus dual score, and the hard-failure pass gate. | Replace line 29 with:
  ```
  **Data-driven, not fabrication-driven.** Conditional sections (e.g. Imagery) are gated on token presence. When a section has no backing token data, stamp it ABSENT (`_No <X> data was extracted._`) — never invent content, a minimum count, comparative framing, or a named principle to fill it. "All sections present and non-empty" is a data-driven expectation, not a mandate to fabricate.

  - Every interpretive claim must cite a token or be labelled `[INFERRED]`.
  - `validate.ts` enforces this with prose-discipline and section-coverage checks (both WARNING-tier) and reports a dual score — `valuesScore` (hex/section/format fidelity) and `claimsScore` (prose provenance).
  - `isValidationPass` passes only with zero hard failures in the `target`, `schema` and `provenance` categories.
  - The dual score is printed for information and does not decide the verdict.
  ```
- [P2] .skilled/skills/sk-design/sk-design-md-generator/references/quality-checklist.md:466 | 6 | The aggregate dual-score item (VS-03) sits between two specific checks and the pass gate, contradicting line 454's own stated order ("its WARNING-tier semantic checks, its v3 Quick-Start fidelity check, and the dual score and pass gate"). | Move lines 466-469 (VS-03 through its `Fix:` line) to after line 474 (the VS-04 `Fix:` line), giving VS-01, VS-02, VS-04, VS-03, VS-05.

### .skilled/skills/sk-design/sk-design-md-generator/references/sk-code-handoff.md

- [P2] .skilled/skills/sk-design/sk-design-md-generator/references/sk-code-handoff.md:25 | 4 | The overview's second subsection is `### Usage`, but the reference template and the overview rule call it `### When to Use`; the paragraph already states the trigger ("Use this schema whenever..."). | Replace line 25 `### Usage` with `### When to Use`.

### .skilled/skills/sk-design/sk-design-md-generator/references/troubleshooting.md

- [P2] .skilled/skills/sk-design/sk-design-md-generator/references/troubleshooting.md:53 | 7 | The single `- Note:` bullet packs five mechanisms into one run-on item: the pre-rendered source, paste-unchanged, mismatch diagnosis, re-run-rather-than-patch, and the Typography/FACTS exception. | Replace line 53 with:
  ```
  - Note: the value-bearing token sections — Tokens — Colors, Tokens — Spacing & Shapes, Surfaces, and the Quick Start CSS + Tailwind — come **pre-rendered** from `build-write-prompt.ts` (doc-as-view, via `formatters-v3.ts`). Paste those tables unchanged.
    - A hex mismatch in those sections means they were hand-edited after pre-rendering — re-run `build-write-prompt.ts` and paste the fresh tables rather than patching values by hand.
    - Typography and component values are not pre-rendered as tables; they come verbatim from the FACTS block, so a mismatch there means a value was typed by hand instead of copied from FACTS.
  ```
- [P2] .skilled/skills/sk-design/sk-design-md-generator/references/troubleshooting.md:58 | 6 | Two of the four items under `## 4. VALIDATION FAILURES` are not validation failures — interaction-state capture and the output directory — so a reader scanning headings looks in the wrong section. | Insert `---` and a blank line before line 58, add `## 5. CAPTURE AND OUTPUT` above the `Interaction states are missing` item at line 58, and renumber `## 5. TESTS` (line 64) to `## 6. TESTS`.

### .skilled/skills/sk-design/sk-design-md-generator/references/writing-style-guide.md

- [P2] .skilled/skills/sk-design/sk-design-md-generator/references/writing-style-guide.md:506 | 6 | The section titled FINAL QUALITY GATE is §14 and §§15-20 follow it, including two things the gate checks (agent-prompt self-containment and brand voice); the reader reaches the "final" gate before the guidance it gates. | Delete lines 506-526, renumber `## 15.`–`## 20.` to `## 14.`–`## 19.`, then append after old line 786: a blank line, `---`, a blank line, `## 20. FINAL QUALITY GATE`, a blank line, and the deleted body ("Before publishing a Style Reference, run these checks:" plus its 15 checkboxes).
- [P1] .skilled/skills/sk-design/sk-design-md-generator/references/writing-style-guide.md:594 | 2 | Three bold-labelled formula lines are consecutive, so Markdown joins them into one paragraph (validator emits `render_bold_label_join` at 595 and 596). | Replace lines 594-596 with:
  ```
  - **Pattern A:** [adjective] + [noun]
  - **Pattern B:** [technique]-as-[metaphor]
  - **Pattern C:** [quality] + [domain]
  ```
- [P1] .skilled/skills/sk-design/sk-design-md-generator/references/writing-style-guide.md:779 | 2 | Each FAILS/PASSES pair sits on consecutive lines, so each pair joins into one paragraph (validator emits `render_bold_label_join` at 780, 783 and 786). | Replace lines 779-786 with three two-item lists separated by blank lines:
  ```
  - **FAILS**: "Create a button with the primary brand color" -- which color?
  - **PASSES**: "Create a button with background `#5e6ad2`, text `#ffffff`"

  - **FAILS**: "Use the system font at heading size" -- which font, which size?
  - **PASSES**: "Use Inter at 32px weight 600 line-height 1.2 letter-spacing -0.96px"

  - **FAILS**: "Add the standard card shadow" -- what is standard?
  - **PASSES**: "Add shadow `0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.08)`"
  ```
