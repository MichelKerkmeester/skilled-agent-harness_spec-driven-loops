#!/usr/bin/env bash
# Replays the sk-design mode playbook scenarios through the compiled front door, one probe per
# scenario, each prompt copied verbatim from the scenario's "Real user request" bullet. The label
# holds the scenario id, the mode whose playbook holds it (its gold) and its source file.
# Routing only: no provider credential, no model call and no network.

set -uo pipefail

CR="node .skilled/bin/compiled-route.cjs --hub sk-design"

probe() {
  local label="$1" prompt="$2" out rc
  out=$($CR --prompt "$prompt" 2>&1)
  rc=$?
  printf '### %s\nPROMPT: %s\nRC: %s\nROUTE: %s\n\n' "$label" "$prompt" "$rc" "$out"
}

probe 'CHT-004 | sk-design-chart | sk-design-chart/manual-testing-playbook/corpus-integrity/a-chart-that-draws-nothing.md' 'Check the chart corpus properly, not just whether the files are shaped right.'
probe 'CHT-006 | sk-design-chart | sk-design-chart/manual-testing-playbook/corpus-integrity/catalog-resolves-both-ways.md' 'We keep getting asked for a chart the catalogue does not cover. Add one and wire it in.'
probe 'CHT-005 | sk-design-chart | sk-design-chart/manual-testing-playbook/corpus-integrity/colour-comes-from-one-source.md' 'Restyle these charts to our brand colours.'
probe 'CHT-009 | sk-design-chart | sk-design-chart/manual-testing-playbook/delivery-and-routing/a-delivery-on-a-dark-system.md' 'I opened the chart you sent and it is a bright white rectangle in the middle of my dark screen.'
probe 'CHT-008 | sk-design-chart | sk-design-chart/manual-testing-playbook/delivery-and-routing/form-choice-and-the-diagram-boundary.md' 'Make a waterfall chart of the budget movement from gross to net.'
probe 'CHT-007 | sk-design-chart | sk-design-chart/manual-testing-playbook/delivery-and-routing/opens-with-no-build-step.md' 'Send me the chart so I can open it on my laptop on the train.'
probe 'CHT-002 | sk-design-chart | sk-design-chart/manual-testing-playbook/reading-the-chart/axis-ladder-fits-the-tallest-mark.md' 'This chart looks wrong. Everything is squashed into the bottom half and I cannot see the difference between the middle bars.'
probe 'CHT-001 | sk-design-chart | sk-design-chart/manual-testing-playbook/reading-the-chart/headline-agrees-with-the-data.md' 'Turn these depot pick times into a chart I can put in the board pack.'
probe 'CHT-003 | sk-design-chart | sk-design-chart/manual-testing-playbook/reading-the-chart/nothing-runs-past-the-drawing-edge.md' 'Make me this chart, then open it and tell me if anything is cut off. The last one had a label hanging off the side.'
probe 'CAP-001 | sk-design-diagram | sk-design-diagram/manual-testing-playbook/capture-review/capture-review.md' 'Here'\''s the render of the diagram that'\''s going into our docs — tell me what a person actually sees wrong with it before we publish.'
probe 'CMD-001 | sk-design-diagram | sk-design-diagram/manual-testing-playbook/command-and-hub-integration/design-diagram-command.md' '/design:diagram docs/order-flow.html "sequence diagram of our order placement flow" :auto — sequence diagram of the order flow, no questions.'
probe 'CMD-002 | sk-design-diagram | sk-design-diagram/manual-testing-playbook/command-and-hub-integration/hub-registration.md' 'When someone says "redraw this drawio", the system should route to the diagram skill.'
probe 'DIA-002 | sk-design-diagram | sk-design-diagram/manual-testing-playbook/diagram-generation/editorial-style-and-connectors.md' 'Make a swimlane diagram of our support handoff process, and make it consistent with our docs.'
probe 'DIA-003 | sk-design-diagram | sk-design-diagram/manual-testing-playbook/diagram-generation/onboarding-flow.md' 'Onboard the diagram skill to my site, https://example.com.'
probe 'DIA-004 | sk-design-diagram | sk-design-diagram/manual-testing-playbook/diagram-generation/primitive-variants.md' 'Make a loop diagram for my newsletter post about compounding habits — hand-drawn style, with a couple of annotations.'
probe 'DIA-001 | sk-design-diagram | sk-design-diagram/manual-testing-playbook/diagram-generation/type-selection-and-routing.md' 'Draw an architecture diagram of our checkout service and its dependencies.'
probe 'IMP-001 | sk-design-diagram | sk-design-diagram/manual-testing-playbook/import-export/drawio-import.md' 'Here'\''s our system diagram from draw.io — make it presentable for a blog post.'
probe 'IMP-003 | sk-design-diagram | sk-design-diagram/manual-testing-playbook/import-export/export-guidance.md' 'Give me a PNG of that architecture diagram for the slide deck.'
probe 'IMP-002 | sk-design-diagram | sk-design-diagram/manual-testing-playbook/import-export/mermaid-import.md' 'Simplify this Mermaid flowchart into something clean for our docs.'
probe 'SKD-030 | sk-design-fundamentals | sk-design-fundamentals/manual-testing-playbook/boundary/extraction-defers-to-md-generator.md' 'Extract the design system from stripe.com.'
probe 'SKD-031 | sk-design-fundamentals | sk-design-fundamentals/manual-testing-playbook/boundary/implementation-defers-to-sk-code.md' 'Write the API client for this form.'
probe 'SKD-021 | sk-design-fundamentals | sk-design-fundamentals/manual-testing-playbook/conflict-handling/contrast-escape-hatches.md' 'Our brand green fails contrast on white, what do we do?'
probe 'SKD-020 | sk-design-fundamentals | sk-design-fundamentals/manual-testing-playbook/conflict-handling/project-system-precedence.md' 'Our design system says 24px spacing here, but you suggested 32px.'
probe 'SKD-022 | sk-design-fundamentals | sk-design-fundamentals/manual-testing-playbook/conflict-handling/shadow-system-consistency.md' 'Add a drop shadow to this card.'
probe 'SKD-001 | sk-design-fundamentals | sk-design-fundamentals/manual-testing-playbook/routing/diagnose-entry.md' 'This dashboard looks amateur, can you make it better?'
probe 'SKD-003 | sk-design-fundamentals | sk-design-fundamentals/manual-testing-playbook/routing/motion-entry.md' 'How long should this dropdown animation be?'
probe 'SKD-004 | sk-design-fundamentals | sk-design-fundamentals/manual-testing-playbook/routing/procedure-entry.md' 'I need to design a new settings screen, where do I start?'
probe 'SKD-002 | sk-design-fundamentals | sk-design-fundamentals/manual-testing-playbook/routing/review-entry.md' 'Can you review this component for accessibility problems?'
probe 'SKD-011 | sk-design-fundamentals | sk-design-fundamentals/manual-testing-playbook/value-discipline/no-runtime-shades.md' 'I need a slightly darker blue for the hover state, can you just darken it 10%?'
probe 'SKD-010 | sk-design-fundamentals | sk-design-fundamentals/manual-testing-playbook/value-discipline/on-scale-values.md' 'How much padding should this card have?'
probe 'SKD-012 | sk-design-fundamentals | sk-design-fundamentals/manual-testing-playbook/value-discipline/unit-discipline.md' 'Set the headline to 2.5em'
probe 'A11Y-001 | sk-design-md-generator | sk-design-md-generator/manual-testing-playbook/accessibility/accessibility-section.md' 'Does the design system capture accessibility data?'
probe 'BOUNDARY-001 | sk-design-md-generator | sk-design-md-generator/manual-testing-playbook/authoring-boundary/authoring-boundary.md' 'The brief says the brand red is #ff0000 and the body font is Inter. Put those in the design system you extracted from the live site.'
probe 'CLUSTER-001 | sk-design-md-generator | sk-design-md-generator/manual-testing-playbook/cluster/oklch-clustering.md' 'Confirm the color tokens are clustered and stability-classified correctly.'
probe 'DARKMODE-001 | sk-design-md-generator | sk-design-md-generator/manual-testing-playbook/dark-mode/dark-mode-gate.md' 'Does the Style Reference carry dark-mode values? Show me the condition.'
probe 'DETECT-001 | sk-design-md-generator | sk-design-md-generator/manual-testing-playbook/detectors/framework-icon-motion-detection.md' 'What framework, icons, and motion did the extractor detect?'
probe 'ESCALATE-001 | sk-design-md-generator | sk-design-md-generator/manual-testing-playbook/escalation/anti-bot-escalation.md' 'Extract the design system from this site: https://www.cloudflare.com'
probe 'EXTRACT-001 | sk-design-md-generator | sk-design-md-generator/manual-testing-playbook/extract/live-extraction.md' 'Extract the design system from example.com.'
probe 'FIDELITY-001 | sk-design-md-generator | sk-design-md-generator/manual-testing-playbook/fidelity/verbatim-value-fidelity.md' 'Check that the Style Reference you wrote copies every value exactly from tokens.json — no estimates, no rounding.'
probe 'GUIDED-014 | sk-design-md-generator | sk-design-md-generator/manual-testing-playbook/guided-run/guided-run-smoke-lane.md' 'Run the guided wrapper on this site and stop before validation if DESIGN.md isn'\''t written yet.'
probe 'INTERACT-001 | sk-design-md-generator | sk-design-md-generator/manual-testing-playbook/interaction/interaction-state-matrix.md' 'Extract the design system including interaction states from example.com.'
probe 'PROCCARD-003 | sk-design-md-generator | sk-design-md-generator/manual-testing-playbook/procedure-card-contract/backend-preserving-direct-fallback.md' 'Subagents are unavailable, but validate this DESIGN.md against tokens.json in the current session.'
probe 'PROCCARD-001 | sk-design-md-generator | sk-design-md-generator/manual-testing-playbook/procedure-card-contract/card-selection-proof.md' 'Extract a measured design system and write a DESIGN.md from a live URL.'
probe 'PROCCARD-002 | sk-design-md-generator | sk-design-md-generator/manual-testing-playbook/procedure-card-contract/no-card-fallback.md' 'Study the existing style reference as a calibration example without extracting or writing measured artifacts.'
probe 'REPORT-001 | sk-design-md-generator | sk-design-md-generator/manual-testing-playbook/report/report-generation.md' 'Generate a visual report of the extracted design system.'
probe 'SETUP-001 | sk-design-md-generator | sk-design-md-generator/manual-testing-playbook/setup/tool-readiness.md' 'Set up the design extractor tool so I can extract a design system from a URL.'
probe 'PROVENANCE-001 | sk-design-md-generator | sk-design-md-generator/manual-testing-playbook/source-of-truth/source-of-truth-card.md' 'Walk through each value in this design system and tell me where it came from before we trust it.'
probe 'STUDY-015 | sk-design-md-generator | sk-design-md-generator/manual-testing-playbook/study/editorial-exemplar-study.md' 'Show me a non-SaaS example and what our Style Reference should take from it.'
probe 'VALIDATE-001 | sk-design-md-generator | sk-design-md-generator/manual-testing-playbook/validate/phantom-hex-detection.md' 'Validate the Style Reference I just wrote against its tokens.json.'
