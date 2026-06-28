---
title: "D6-R7 — nextOptions[] + handoff status grammar"
description: "Add STATUS/PRODUCES/NEXT_OPTIONS/HANDOFF_REQUIRED/HANDOFF_REASON to the design command wrappers + command-metadata.json; checker resolves each next option to a known recipe; auto-chain forbidden unless requested."
trigger_phrases:
  - "d6-r7 next options handoff grammar"
  - "handoff grammar design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D6-R7 — nextOptions[] + handoff status grammar

## 1. OBJECTIVE
Extend the design command return contract with explicit follow-up grammar so each wrapper declares what it produced and which known recipes may run next — never auto-chaining silently.

## 2. WHY
designer-skills-main commands end with explicit follow-up suggestions ("## Output" + next steps). sk-design wrappers return bare `STATUS=OK|FAIL`, hiding the pipeline and risking silent chaining; a typed handoff grammar makes the next hop legible and checkable.

## 3. TARGET & CLASS
- **Target file(s):** `.opencode/commands/design/*.md` (wrappers); `.opencode/skills/sk-design/command-metadata.json` (new, shared with D6-R1)
- **Severity:** P2
- **Enforcement class:** enforceable
- **Dimension:** D6 — Corpus Ports
- **Feeds:** D2

## 4. BUILD OUTLINE
- Add `STATUS` / `PRODUCES` / `NEXT_OPTIONS` / `HANDOFF_REQUIRED` / `HANDOFF_REASON` to wrappers + metadata.
- Checker resolves every `NEXT_OPTIONS` entry to a known recipe in `command-metadata.json`.
- Forbid auto-chaining unless the request explicitly asks for it.

## 5. ACCEPTANCE
- A wrapper emitting an unknown next option fails the checker; a silent auto-chain is rejected; declared options all resolve to known recipes.

## 6. EVIDENCE
- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/ui-design/commands/design-screen.md:15` — "## Output" section showing the output + follow-up grammar.
- Source: `research/research.md` §9 (D6-R7)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
