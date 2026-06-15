You are a UI design author. This is a controlled test of the sk-interface-design skill applied through its shared design-parity loop with mcp-open-design. Apply the skill's judgment rigorously and produce real, viewable work.

GATE 3: This work is tracked under the spec folder
.opencode/specs/skilled-agent-orchestration/150-mcp-open-design/009-design-skill-integration-test
Gate 3 is PRE-APPROVED. Do NOT ask about spec folders. Proceed directly with the file writes below.

READ FIRST (mandatory, apply throughout):
- .opencode/skills/sk-interface-design/references/design_principles.md (the anti-default design judgment, the authority)
- .opencode/skills/sk-interface-design/references/claude_design_parity.md (the shared ground -> reuse-before-generate -> fidelity-check loop with mcp-open-design)
- .opencode/skills/sk-interface-design/references/ux_quality_reference.md (the objective quality floor)

TASK: Create THREE self-contained HTML designs, one per brief. For each, follow the sk-interface-design process: ground in the specific subject, derive a distinctive token system (palette, type, layout, motion) that AVOIDS the templated AI default for that category, then build the page and self-critique it against the quality floor.

The three briefs (ground in these specifics, write real copy, NO lorem ipsum):
1. Landing page for "Meridian Roasters", a small-batch coffee roaster in Portland. Resist the generic warm-brown coffee-shop default.
2. Pricing page for "Wavelength", an indie podcast-hosting tool, with three tiers. Resist the generic purple-gradient three-card SaaS default.
3. Dashboard for "Wattbird", a home energy monitor (live usage, cost, per-circuit breakdown). Resist the generic dark-mode neon-charts dashboard default.

REQUIREMENTS per design:
- One self-contained .html file: ALL CSS inline in a <style> block, NO external network dependencies (no CDN, no Google Fonts link, no external JS). Use system font stacks. It MUST render correctly when opened directly from disk with no network.
- Real, specific copy grounded in the subject, not placeholder text.
- Responsive enough that it does not break at a phone width.
- Distinctive and intentional per the design principles, not a templated default.

OUTPUT (write exactly these files):
- .opencode/specs/skilled-agent-orchestration/150-mcp-open-design/009-design-skill-integration-test/designs/mimo/01-meridian-roasters.html
- .opencode/specs/skilled-agent-orchestration/150-mcp-open-design/009-design-skill-integration-test/designs/mimo/02-wavelength-pricing.html
- .opencode/specs/skilled-agent-orchestration/150-mcp-open-design/009-design-skill-integration-test/designs/mimo/03-wattbird-dashboard.html
- .opencode/specs/skilled-agent-orchestration/150-mcp-open-design/009-design-skill-integration-test/designs/mimo/NOTES.md

NOTES.md: for each of the three designs, record the subject grounding, the token system (palette hex values, type choices, layout approach, motion), the NAMED AI default you deliberately avoided, and a one-paragraph self-critique against the quality floor.

CONSTRAINTS:
- House voice in NOTES.md prose: no em dashes, avoid semicolons in prose sentences.
- Never put spec paths, packet numbers, or task ids in HTML or CSS comments. Comments state the durable WHY only.
- Do NOT run git. Do NOT install anything. Authoring only.
- Self-verify: confirm each HTML file is non-empty and contains a <style> block.

FINAL REPORT: list the four files written and give a two-sentence summary of your strongest design and why it avoids the default.
