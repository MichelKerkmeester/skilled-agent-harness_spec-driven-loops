# Iteration 46: D5-A1 Dispatch-Contract Asymmetry

## Focus

This iteration investigated D5-A1: the `cli-*` dispatch contracts have an explicit `Code Standards Loading` ALWAYS rule, but no equivalent rule that forces `sk-design` loading for design, UI, visual, audit, or Open Design-adjacent dispatches.

## Actions Taken

1. Re-read the active strategy questions for D5 and the last three iteration summaries to avoid re-covering D4 proof-token and automation angles. The open D5 question asks how the design contract survives into CLI children through payload carry, demand-back, and parent-side re-validation. [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/deep-research-strategy.md:38]
2. Opened all three CLI skill contracts and inspected their `ALWAYS` sections. Each has a code-specific standards loading rule. [SOURCE: .opencode/skills/cli-opencode/SKILL.md:327] [SOURCE: .opencode/skills/cli-codex/SKILL.md:359] [SOURCE: .opencode/skills/cli-claude-code/SKILL.md:354]
3. Opened the shared `sk-design` context loading contract. It already defines a dispatch-aware context manifest and required proof fields for parent sessions, delegated prompts, child responses, and proof cards. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:46] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:52] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:71]
4. Opened the Agent I/O contract to test whether it could carry the enforcement instead. It is explicitly optional-advisory, and missing evidence never blocks. [SOURCE: .opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md:20] [SOURCE: .opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md:25] [SOURCE: .opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md:174] [SOURCE: .opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md:176]

## Findings

### Finding 1: The code standards dispatch rule is duplicated across the whole CLI family

All three CLI skills contain the same enforceable pattern: when dispatching for code review or generation, the prompt must instruct the child to load `sk-code`, let it detect the active surface, load surface resources, run verification, and add `sk-code-review` for formal review output. [SOURCE: .opencode/skills/cli-opencode/SKILL.md:327] [SOURCE: .opencode/skills/cli-codex/SKILL.md:359] [SOURCE: .opencode/skills/cli-claude-code/SKILL.md:354]

This is deterministically enforceable. A static checker can require the heading `Code Standards Loading (surface-aware contract)` and required tokens in every `cli-*` `ALWAYS` section.

Label: ENFORCEABLE.

### Finding 2: No parallel design standards rule exists in the same ALWAYS sections

The same `ALWAYS` sections cover CLI availability, sandbox/permission mode, spec folder carry, prompt construction, code standards, single-dispatch discipline, and child session env, but none of the three contains a design equivalent that says when to load `sk-design`, resolve the mode, name loaded design files, or return proof-of-application fields. [SOURCE: .opencode/skills/cli-opencode/SKILL.md:311] [SOURCE: .opencode/skills/cli-opencode/SKILL.md:330] [SOURCE: .opencode/skills/cli-codex/SKILL.md:344] [SOURCE: .opencode/skills/cli-codex/SKILL.md:361] [SOURCE: .opencode/skills/cli-claude-code/SKILL.md:339] [SOURCE: .opencode/skills/cli-claude-code/SKILL.md:356]

That is the dispatch-contract asymmetry: code dispatches get a mandatory standards-loading payload, while design dispatches currently rely on the caller remembering separate `sk-design` rules. It is especially risky because the CLI family is explicitly for cross-AI delegation, where the child may not share the caller's already-loaded context.

Label: ENFORCEABLE for the static contract gap; ADVISORY for perfect semantic detection of every design-adjacent prompt at runtime.

### Finding 3: `sk-design` already has the reusable loading/proof substrate for a design twin

The shared design contract says that before dispatching an agent or making a design/build decision, the session must name loaded files in a context manifest. It also declares `TASK TYPE: advice | build | redesign | generation | audit | dispatch`, so CLI delegation is already an owned task type rather than a new category. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:46] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:52]

The same contract blocks palette, layout, motion, copy, accessibility, score, release, or readiness claims until the files behind the claim are named as loaded. It also requires exact proof field names in parent sessions, delegated prompts, child responses, and final proof cards. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:65] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:71]

So the build does not need a new proof shape. The CLI rule should bind to this shared contract and force the child prompt to carry its manifest/proof requirements.

Label: ENFORCEABLE for required manifest/proof field presence; ADVISORY for whether the resulting visual judgment is good.

### Finding 4: Agent I/O cannot be the only enforcement carrier

The Agent I/O contract is optional-advisory: every field is optional unless caller and receiver explicitly agree otherwise, absence of dispatch headers is not a refusal condition, and missing evidence metadata still passes validation without warning. [SOURCE: .opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md:25] [SOURCE: .opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md:26] [SOURCE: .opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md:174]

Even in strict mode, malformed evidence is advisory because no blocking failure reason is defined yet. [SOURCE: .opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md:176]

Therefore the design standards loading rule must live in the CLI dispatch contracts and rendered prompt payload, with Agent I/O as optional metadata only.

Label: ENFORCEABLE for "do not rely on Agent I/O absence as proof"; ADVISORY for richer future metadata interpretation.

## Buildable Recommendation

Add a shared `Design Standards Loading (surface-aware contract)` rule and reference it from all three CLI skills' `ALWAYS` sections, adjacent to the existing prompt-construction and code-standards rules.

Concrete wording to add later:

```text
Design Standards Loading (surface-aware contract) - When dispatching UI, design, visual polish, frontend styling, accessibility audit, motion, design-system, Figma, Open Design, or design-feeding generation work, instruct the dispatched session to: (1) load `sk-design`; (2) resolve the owner mode through `sk-design/mode-registry.json`; (3) load `sk-design/shared/context_loading_contract.md`; (4) produce the required context manifest with `TASK TYPE: dispatch`; (5) load the selected mode resources and return proof-of-application fields for any palette, layout, motion, copy, accessibility, score, release, or readiness claim. For pure transport calls, mark `pure_transport_exemption` and avoid design claims.
```

Recommended implementation placement:

- Add a canonical wording asset under `sk-design/shared/` or `system-spec-kit/references/cli/` to avoid drift.
- Add short `ALWAYS` entries in `.opencode/skills/cli-opencode/SKILL.md`, `.opencode/skills/cli-codex/SKILL.md`, and `.opencode/skills/cli-claude-code/SKILL.md`.
- Add static fixtures that parse the three `ALWAYS` sections and require `Design Standards Loading`, `sk-design`, `mode-registry.json`, `context_loading_contract.md`, `TASK TYPE: dispatch`, and proof-of-application language.
- Add prompt-replay fixtures for at least one design task and one pure-transport task per CLI skill. The design task must include the manifest/proof payload; the pure-transport task must include the exemption and must not make design quality claims.

## Questions Answered

- Q4/D5: The design contract survives CLI children by making the CLI prompt payload carry the `sk-design` loading requirement and the context manifest/proof fields. Agent I/O can supplement this, but cannot be the enforcement authority because it is optional-advisory.
- Q5/all: The enforceable backlog is static presence lint, prompt-replay tests, required manifest fields, and pure-transport exemption fixtures. The advisory boundary is semantic classification of ambiguous design-adjacent prompts and final visual taste.

## Questions Remaining

- Should the canonical wording live beside `sk-design/shared/context_loading_contract.md` or in a shared CLI reference under `system-spec-kit/references/cli/`?
- Should design-adjacent detection be token-list based at first, or should it reuse the `sk-design` mode registry metadata once command-level design surfaces are implemented?
- How should future `DESIGN_PROOF_TOKEN v1` wording compose with this loading rule without making the CLI contracts prematurely depend on an unbuilt token validator?

## Next Focus

Next D5 focus should test the rendered prompt path: whether `cli-opencode`, `cli-codex`, and `cli-claude-code` prompt templates can be replayed against a small corpus of design, pure-code, and pure-transport requests to prove the new rule fires only where it should.

