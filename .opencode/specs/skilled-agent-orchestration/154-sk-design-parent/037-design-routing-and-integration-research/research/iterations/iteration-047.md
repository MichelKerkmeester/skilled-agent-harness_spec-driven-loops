# Iteration 47: D5-A2 Design Manifest Pass-Through

## Focus

[D5-A2 / D5] Model the design manifest on the proven Gate-3 spec-folder pass-through: a CLI dispatch proceeds only when a design manifest is present, `sk-design` has been loaded, and the Brand/Product register is set; otherwise the caller asks before dispatch.

## Actions Taken

1. Re-read the deep-research workflow contract and output references to keep this as a leaf research iteration with narrative, state-log append, and delta artifacts.
2. Re-read iteration 46 so this pass did not repeat the broad "missing Design Standards Loading rule" finding. Iteration 46 already established the shared asymmetry and recommended a general design-loading rule.
3. Compared the three CLI skills' Gate-3 pass-through rules with their code-standards dispatch rules.
4. Re-read `sk-design` hub routing, mode registry, shared context-loading contract, Context Loaded card, Proof Of Application card, and the existing cli-opencode design/UI template.
5. Checked Agent I/O to confirm whether it can serve as the hard gate.

## Findings

### Finding 1: The Gate-3 pass-through is the exact hard-shape precedent for design dispatch

Severity: P1. Label: ENFORCEABLE for static CLI-skill lint and prompt-replay fixtures; ADVISORY for semantically deciding whether a prompt is design-adjacent.

All three CLI skills already implement the same non-interactive pass-through rule for spec folders: if the caller has an active Gate-3 spec folder, include `Spec folder: <path> (pre-approved, skip Gate 3)` in the delegated prompt; if not, ask before delegation because the child cannot answer Gate 3 interactively. [SOURCE: .opencode/skills/cli-opencode/SKILL.md:318] [SOURCE: .opencode/skills/cli-codex/SKILL.md:353] [SOURCE: .opencode/skills/cli-claude-code/SKILL.md:347]

This is stronger than iteration 46's "include a Design Standards Loading rule" because it gives a binary pre-dispatch state: present and pre-approved, or ASK. The design equivalent should use the same shape:

```text
Design manifest: <DESIGN_DISPATCH_MANIFEST v1> (pre-approved, sk-design loaded, register set)
```

If the caller cannot produce that block, the CLI skill asks before dispatch rather than sending the child a vague instruction to load design context later.

Buildable recommendation: add an ALWAYS rule to `cli-opencode`, `cli-codex`, and `cli-claude-code` immediately beside the existing spec-folder pass-through rule. Predicate: UI/design/visual polish/frontend styling/accessibility-readiness/motion/design-system/Figma/Open Design/design-feeding generation. Required action: include `DESIGN_DISPATCH_MANIFEST v1` in the child prompt, or ask for missing manifest inputs before dispatch.

### Finding 2: The design manifest primitives already exist, but they are not a CLI pre-dispatch contract

Severity: P1. Label: ENFORCEABLE for required fields, file-load witnesses, registry-mode validation, and proof-check execution; ADVISORY for taste quality after the manifest is satisfied.

`sk-design` already says UI build, page/component generation, and redesign work must auto-load the build bundle, require a context manifest, use the Context Loaded card before recommendations, and use the Proof Of Application card before ready claims. [SOURCE: .opencode/skills/sk-design/SKILL.md:58] [SOURCE: .opencode/skills/sk-design/SKILL.md:60] The shared contract also makes `register.md` the first read and requires Brand or Product before palette, layout, motion, copy, severity, or handoff decisions. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:20] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:22]

The manifest fields are already concrete: surface, task type, register source, dial source, mode bundle, conditional files, and proof fields. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:44] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:48] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:63] The Context Loaded card has the dispatch task type, register set, dials, loaded-file checklist, and LOADED/BLOCKED verdict. [SOURCE: .opencode/skills/sk-design/shared/assets/context_loaded_card.md:25] [SOURCE: .opencode/skills/sk-design/shared/assets/context_loaded_card.md:30] [SOURCE: .opencode/skills/sk-design/shared/assets/context_loaded_card.md:39] [SOURCE: .opencode/skills/sk-design/shared/assets/context_loaded_card.md:45] [SOURCE: .opencode/skills/sk-design/shared/assets/context_loaded_card.md:70]

Buildable recommendation: define `DESIGN_DISPATCH_MANIFEST v1` in `sk-design/shared/context_loading_contract.md` or a sibling shared reference consumed by the CLI family. Minimum fields:

- `surface`: page, route, component, flow, frame, audit target, or generated artifact.
- `taskType`: `dispatch` plus one of advice/build/redesign/generation/audit.
- `skDesignLoaded`: true, with loaded hub path.
- `workflowModes`: registry-valid mode keys from `mode-registry.json`.
- `register`: Brand or Product. No `unknown` in the pre-dispatch manifest.
- `registerWhy` and `dials`: variance, motion, density.
- `loadedFiles`: `context_loading_contract.md`, `register.md`, `brief_to_dials.md`, mode `SKILL.md` files, and required cards/axis refs.
- `proofDemandBack`: required child return fields and proof checker expectation.
- `pureTransportExemption`: true only when the child is forbidden from making design claims or design-feeding mutations.

### Finding 3: cli-opencode has a useful design template, but it is local and still allows an unknown register at dispatch time

Severity: P1. Label: ENFORCEABLE for template/rule parity across CLI skills and for rejecting `register=unknown` in pre-dispatch manifests; ADVISORY for resolving genuinely ambiguous brand-vs-product prompts.

cli-opencode already has a design/UI dispatch template requiring the child to load `sk-design` with the right mode bundle before design decisions. [SOURCE: .opencode/skills/cli-opencode/assets/prompt_templates.md:569] [SOURCE: .opencode/skills/cli-opencode/assets/prompt_templates.md:575] Its context manifest includes spec folder, write scope, target surface, task type, register, required mode bundle, and exact files to read. [SOURCE: .opencode/skills/cli-opencode/assets/prompt_templates.md:582] [SOURCE: .opencode/skills/cli-opencode/assets/prompt_templates.md:588] It then instructs the child to load `sk-design`, emit the Context Loaded card before recommendations/code/audit/design direction, and emit the Proof Of Application card before ready/accessibility/release claims. [SOURCE: .opencode/skills/cli-opencode/assets/prompt_templates.md:596] [SOURCE: .opencode/skills/cli-opencode/assets/prompt_templates.md:601]

The gap is timing and parity. This is a cli-opencode template, not a shared ALWAYS rule mirrored in cli-codex and cli-claude-code. It also permits `Register: <Brand | Product | unknown until shared/register.md is read>` inside the dispatched prompt. [SOURCE: .opencode/skills/cli-opencode/assets/prompt_templates.md:587] D5-A2's pass-through model should make the parent resolve that register before dispatch, or ask.

Buildable recommendation: hoist the compact manifest block from the cli-opencode template into a shared CLI reference, then require each CLI skill to import or quote it in its ALWAYS section. Keep the longer cli-opencode template as an expanded prompt scaffold, but make the short manifest the enforceable contract.

### Finding 4: Agent I/O cannot be the hard carrier because it is optional-advisory by design

Severity: P2. Label: ENFORCEABLE that Agent I/O absence must not block under current contract; ADVISORY if used only as an auxiliary evidence carrier.

Agent I/O declares `status: optional-advisory`, says every field is optional unless explicitly agreed, and says absence of dispatch headers or result envelopes is never a refusal condition. [SOURCE: .opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md:20] [SOURCE: .opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md:25] [SOURCE: .opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md:26] Its evidence group remains optional and validation is advisory by default, even in strict mode. [SOURCE: .opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md:172] [SOURCE: .opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md:174] [SOURCE: .opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md:176]

Buildable recommendation: allow Agent I/O to carry a digest of `DESIGN_DISPATCH_MANIFEST v1`, but do not make it the authority. The hard check belongs in the CLI skill pre-dispatch rule and, for Open Design, the daemon/proxy boundary already explored by D4 iterations.

## Questions Answered

- Q4/D5: The design contract survives CLI children by using the same pre-dispatch pass-through shape as Gate 3: manifest present and pre-approved, or ASK before the non-interactive child is launched.
- Q4/D5: The minimum hard fields are not a new design theory. They are the existing context manifest and Context Loaded card compressed into a dispatch manifest: surface, task type, loaded `sk-design`, registry-valid mode bundle, Brand/Product register, dials, loaded files, and demand-back proof.
- Q5/all: Enforceable backlog items are static CLI rule lint, shared manifest schema validation, prompt-replay fixtures for each CLI skill, registry-mode validation, `register != unknown` checks, and negative fixtures requiring ASK. Advisory backlog remains the semantic classification of borderline design-adjacent prompts and final visual quality.

## Questions Remaining

- Should `DESIGN_DISPATCH_MANIFEST v1` live directly in `sk-design/shared/context_loading_contract.md`, or in a sibling shared reference imported by both `sk-design` and the CLI skills?
- Should ambiguous Brand/Product register resolution always ask, or may specific commands declare a default register through future command metadata?
- Should pure transport exemptions require a signed manifest block too, or is an explicit `pure_transport_exemption` line enough for non-design inventory/wiring dispatches?

## Next Focus

D5-A3: define the demand-back result block for CLI children. The parent-side manifest is only half the pass-through; the parent also needs a machine-checkable child return proving the manifest was honored, the register stayed stable, and any design/Open Design output used the same payload.
