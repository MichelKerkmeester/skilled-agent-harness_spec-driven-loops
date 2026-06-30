# Iteration 50: D5-A5 CLI Smart-Router Design Blindness

## Focus

[D5-A5 / D5] Smart-router blindness: verify whether routine design prompts cause each `cli-*` skill to load a design dispatch contract, and define the buildable router or ALWAYS-baseline change that makes `sk-design` utilization survive delegation.

newInfoRatio estimate: 0.63. Status: insight. The fresh information is the exact routing failure point: previous D5 passes established the design manifest and Open Design child contract, but the current CLI smart routers have no `DESIGN` intent lane and their baseline resources do not carry the design contract.

## Actions Taken

1. Re-read the deep-research output references and strategy so this pass stayed inside the iteration artifact, state-log append, and delta contract.
2. Re-read iterations 47-49 to avoid repeating the already-established manifest, Open Design transport pairing, and craft-proof-lane findings.
3. Inspected the provider-specific smart-router dictionaries in `cli-opencode`, `cli-codex`, and `cli-claude-code`.
4. Inspected the shared CLI smart-router helper to verify how ALWAYS, UNKNOWN fallback, conditional resource loading, and same-skill path guards work.
5. Compared the CLI router behavior to the live `sk-design` context-loading contract and the existing `cli-opencode` design/UI prompt template.

## Findings

### Finding 1: None of the three CLI smart routers has a DESIGN intent lane

Severity: P1. Label: ENFORCEABLE for static router lint and replay fixtures; ADVISORY for novel natural-language phrasing beyond the fixture corpus.

`cli-opencode` only defines `EXTERNAL_DISPATCH`, `PARALLEL_DETACHED`, `CROSS_AI_HANDBACK`, `AGENT_DISPATCH`, `CROSS_REPO`, `TEMPLATES`, and `PATTERNS` intents. Its ALWAYS resources are only `references/cli_reference.md` and `assets/prompt_quality_card.md`, and its `RESOURCE_MAP` has no design-specific target. [SOURCE: .opencode/skills/cli-opencode/SKILL.md:100] [SOURCE: .opencode/skills/cli-opencode/SKILL.md:116] [SOURCE: .opencode/skills/cli-opencode/SKILL.md:126] [SOURCE: .opencode/skills/cli-opencode/SKILL.md:136]

`cli-codex` similarly routes through generation, review, research, architecture, delegation, templates, patterns, and hooks. It can match a design implementation prompt through `GENERATION` if the user says "build" or "create", but that loads `references/cli_reference.md` and generic prompt templates, not a design manifest rule. [SOURCE: .opencode/skills/cli-codex/SKILL.md:89] [SOURCE: .opencode/skills/cli-codex/SKILL.md:100] [SOURCE: .opencode/skills/cli-codex/SKILL.md:111] [SOURCE: .opencode/skills/cli-codex/SKILL.md:122]

`cli-claude-code` has deep reasoning, code editing, structured output, review, delegation, templates, and patterns, again with no design lane and no design contract in the ALWAYS baseline. [SOURCE: .opencode/skills/cli-claude-code/SKILL.md:91] [SOURCE: .opencode/skills/cli-claude-code/SKILL.md:102] [SOURCE: .opencode/skills/cli-claude-code/SKILL.md:112] [SOURCE: .opencode/skills/cli-claude-code/SKILL.md:122]

The shared helper makes that absence operational, not cosmetic: it loads only the configured ALWAYS resources, returns UNKNOWN with only those resources when no keyword scores, and conditionally loads only `RESOURCE_MAP[intent]` for matched intents. [SOURCE: .opencode/skills/system-spec-kit/references/cli/shared_smart_router.md:103] [SOURCE: .opencode/skills/system-spec-kit/references/cli/shared_smart_router.md:107] [SOURCE: .opencode/skills/system-spec-kit/references/cli/shared_smart_router.md:118] [SOURCE: .opencode/skills/system-spec-kit/references/cli/shared_smart_router.md:133]

Buildable recommendation: add a `DESIGN` intent to all three CLI dictionaries with fixture-backed keywords such as `design`, `ui`, `ux`, `visual`, `interface`, `screen`, `layout`, `palette`, `typography`, `motion`, `animation`, `accessibility`, `readiness`, `redesign`, `polish`, `figma`, and `open design`. Map it to a skill-local `references/design_dispatch_contract.md` in each CLI skill, because the shared router currently guards resource paths to the current skill root. [SOURCE: .opencode/skills/system-spec-kit/references/cli/shared_smart_router.md:46]

### Finding 2: The current ALWAYS rules protect spec folders and code standards, but not design standards

Severity: P1. Label: ENFORCEABLE for required ALWAYS text and negative prompt replay; ADVISORY for deciding whether a borderline prompt is design-adjacent at runtime.

All three CLI skills already have a proven hard-shape delegation rule: pass the Gate-3 spec folder to the child when active, otherwise ask before non-interactive delegation. [SOURCE: .opencode/skills/cli-opencode/SKILL.md:318] [SOURCE: .opencode/skills/cli-codex/SKILL.md:353] [SOURCE: .opencode/skills/cli-claude-code/SKILL.md:347] They also all have a code-standards loading rule requiring `sk-code` for code review or generation dispatch. [SOURCE: .opencode/skills/cli-opencode/SKILL.md:327] [SOURCE: .opencode/skills/cli-codex/SKILL.md:359] [SOURCE: .opencode/skills/cli-claude-code/SKILL.md:354]

There is no sibling design-standards loading rule in that ALWAYS block. That matters because `sk-design` itself treats design context as a gate, not a preference: register must be read first for design or UI work, build/redesign/generation/evaluation work must load the larger bundle, and a context manifest is required before dispatching an agent or making a design/build decision. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:22] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:33] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:46]

Buildable recommendation: add a short ALWAYS rule to `cli-opencode`, `cli-codex`, and `cli-claude-code` immediately after the code-standards rule:

```text
Design Standards Loading: When dispatching for UI/design/visual polish/frontend styling/design-system/accessibility-readiness/motion/Figma/Open Design work, include DESIGN_DISPATCH_MANIFEST v1 in the child prompt. The manifest must require sk-design, shared/context_loading_contract.md, register.md, brief_to_dials.md, the registry-valid mode bundle, Context Loaded, and Proof Of Application before design decisions or ready claims. If the design register or mode bundle is unknown, ask before delegation.
```

The `DESIGN` router lane should load the longer reference; the ALWAYS rule is the safety net for phrasing that misses the keyword list.

### Finding 3: The one existing design template is useful but not a cross-CLI router guarantee

Severity: P1. Label: ENFORCEABLE for template parity and router reachability; ADVISORY for visual quality after the manifest is satisfied.

`cli-opencode` already has a design/UI task template that says delegated UI build, redesign, review, accessibility/readiness review, or design recommendation work must load `sk-design` before any design decision. [SOURCE: .opencode/skills/cli-opencode/assets/prompt_templates.md:569] [SOURCE: .opencode/skills/cli-opencode/assets/prompt_templates.md:575] Its manifest names the spec folder, write scope, target surface, task type, register, required mode bundle, exact `sk-design` files, Context Loaded card, and Proof Of Application card. [SOURCE: .opencode/skills/cli-opencode/assets/prompt_templates.md:582] [SOURCE: .opencode/skills/cli-opencode/assets/prompt_templates.md:589] [SOURCE: .opencode/skills/cli-opencode/assets/prompt_templates.md:596] [SOURCE: .opencode/skills/cli-opencode/assets/prompt_templates.md:601]

The gap is reachability and parity. The template lives under `cli-opencode` assets, not in `cli-codex` or `cli-claude-code`, and `cli-opencode` only loads templates for specific existing intents such as `AGENT_DISPATCH`, `TEMPLATES`, `PARALLEL_DETACHED`, or on-demand template keywords. A routine prompt like "send this to Codex to make the settings screen feel more polished" can route through generic generation or delegation without the design contract being the reason the prompt was built.

Buildable recommendation: promote the compact part of `cli-opencode` Template 16 into a shared generated `design_dispatch_contract.md` copied into each CLI skill's `references/` folder. Keep Template 16 as the richer OpenCode scaffold, but make the compact contract the enforceable cross-CLI baseline and add a checker that fails if only one sibling has the design template.

### Finding 4: The enforcement test should be router replay plus contract-token lint, not prose review

Severity: P1. Label: ENFORCEABLE on a deterministic local corpus; ADVISORY for post-gate taste judgment.

The router machinery is deterministic enough to test. It lowercases task text, boundary-matches keywords, scores provider intent dictionaries, selects the top one or two intents, and loads resources from `RESOURCE_MAP`. [SOURCE: .opencode/skills/system-spec-kit/references/cli/shared_smart_router.md:39] [SOURCE: .opencode/skills/system-spec-kit/references/cli/shared_smart_router.md:60] [SOURCE: .opencode/skills/system-spec-kit/references/cli/shared_smart_router.md:64] [SOURCE: .opencode/skills/system-spec-kit/references/cli/shared_smart_router.md:73]

Buildable recommendation: add D5 CLI-router fixtures with public prompts that do not name `sk-design` or internal contract files:

- `make this dashboard feel less generic and easier to scan`
- `delegate a redesign of the checkout screen with accessibility readiness`
- `ask Claude Code for a motion pass on this onboarding flow`
- `use Open Design to generate a cleaner settings page from this brief`
- negative control: `inspect CLI auth setup for OpenCode`

Expected gold: the first four route to `DESIGN`, load `references/design_dispatch_contract.md`, and require `DESIGN_DISPATCH_MANIFEST v1`; the negative control does not. Static lint should also require each CLI skill to contain `DESIGN`, `DESIGN_DISPATCH_MANIFEST`, `sk-design`, `context_loading_contract.md`, `register.md`, `context_loaded_card`, and `proof_of_application_card`.

## Questions Answered

- Q4/D5: The design contract does not fully survive CLI delegation until the CLI smart routers can recognize design prompts or an ALWAYS baseline forces design-adjacent dispatches to carry the manifest.
- Q4/D5: `DESIGN` should be a first-class router intent in all three CLI skills, but it should be backed by an ALWAYS design-standards rule because keyword routers can miss phrasing.
- Q5/all: This backlog item is deterministically enforceable on a local corpus through static lint, smart-router replay, and negative fixtures. Runtime semantic classification of unusual design phrasing remains advisory unless the prompt matches the declared corpus.

## Questions Remaining

- Should the implementation choose duplicated skill-local `references/design_dispatch_contract.md` files, or relax the shared smart-router guard so a CLI router may load a cross-skill shared reference safely?
- Should the first `DESIGN` keyword set be hand-authored, or generated from `sk-design/mode-registry.json` plus future command metadata?
- Should Open Design prompts always route to `DESIGN` first and add transport pairing second, or should they route to a compound `DESIGN_TRANSPORT` intent?

## Next Focus

This is iteration 50 of 50. Final synthesis should collapse D1-D6 into a build backlog, with this item promoted as a D5 hard gate: all `cli-*` routers must either match `DESIGN` or carry the ALWAYS design-standards baseline before any routine design prompt is delegated.

