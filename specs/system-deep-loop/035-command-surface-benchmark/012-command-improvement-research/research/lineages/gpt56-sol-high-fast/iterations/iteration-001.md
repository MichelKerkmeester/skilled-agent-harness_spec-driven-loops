# Iteration 001 — Canon completeness gaps

## Focus

RQ1: identify incomplete or contradictory canon rules that can generate apparently conformant commands with incorrect behavior.

## Evidence and findings

### F01 — The required-input rule contradicts the shipped router template

The skill requires a mandatory input gate immediately after frontmatter whenever `argument-hint` contains a required `<argument>`. It also says the gate must halt before setup or tool loading. [SOURCE: .opencode/skills/sk-doc/create-command/SKILL.md:219-240] The router template declares `argument-hint: "<required> [--auto|--confirm]"`, but the next content is the H1 and overview; no gate exists. [SOURCE: .opencode/skills/sk-doc/create-command/assets/command_router_template.md:42-51] The command template repeats the gate requirement, yet its router skeleton likewise has no executable gate. [SOURCE: .opencode/skills/sk-doc/create-command/assets/command_template.md:360-407]

Candidate delta: update `SKILL.md`, `command_router_template.md`, and the router skeleton in `command_template.md` to express one canonical gate block, with an explicit exception marker for commands whose target owns missing-input handling.

Acceptance criterion: a generated router with a required hint either contains the canonical immediate gate or a machine-readable `gate-owner: execution-target` declaration; `validate_document.py --type command` rejects every other form.

### F02 — The canon contains stale paths, section pointers, and family topology

The template tells authors to place commands under `.opencode/command/` (singular), while the shipped tree and the skill use `.opencode/commands/`. [SOURCE: .opencode/skills/sk-doc/create-command/assets/command_template.md:65-75] Two template blocks direct authors to the mandatory gate in “Section 6,” although the gate is Section 8. [SOURCE: .opencode/skills/sk-doc/create-command/assets/command_template.md:604-606] [SOURCE: .opencode/skills/sk-doc/create-command/assets/command_template.md:721-723] The router-family table omits `design/*` despite live design routers and says doctor has no workflow YAML even though doctor owns routed assets. [SOURCE: .opencode/skills/sk-doc/create-command/assets/command_template.md:816-845]

Candidate delta: replace hand-maintained section numbers and topology prose with anchors and an inventory generated from the command contract manifest.

Acceptance criterion: a documentation check resolves every internal anchor and compares every claimed family/topology row against the live inventory; a stale path or omitted routed family fails CI.

### F03 — The validator verifies headings, not the canon's behavioral contract

Router validation detects canonical headings and reports missing or recommended sections, but does not inspect gate placement, dispatch target existence, default-mode semantics, or presentation ownership. [SOURCE: .opencode/skills/sk-doc/shared/scripts/validate_document.py:417-515] This explains why every current canonical command can pass while required-hint routers lack the mandated immediate gate.

Candidate delta: add a semantic command-contract pass after structural validation, consuming a machine-readable router contract rather than inferring behavior from prose.

Acceptance criterion: mutation fixtures independently fail for missing gate, unknown execution target, inconsistent default mode, missing presentation owner, and disallowed inline display logic.

## Ruled out

- Reclassifying the gate rule as optional. That would remove the contradiction but preserve silent missing-input side effects.
- Adding more explanatory prose without an executable check. The current failure already exists despite repeated prose.
- Fixing only live routers. The templates would regenerate the same defect.

## Iteration assessment

New-info ratio: 0.88. The iteration established three canon-level causes, not merely examples: a normative/template contradiction, stale self-references, and a structural-only validator.
