# Iteration 26: Dispatch-Boundary Design Proof

## Focus

[D3-A9 / D3] sub-agent and small-model dispatch utilization across the context boundary: whether `sk-design` can prove a delegated child actually received, loaded, and applied the required design context, either through out-of-band proof or by pre-loading the contract into the child prompt.

This iteration does not re-cover the prior D3 findings on live `ROUTED` declarations, source-proof self-attestation, or backend/tool-surface lockstep. It narrows to the boundary where parent-local design context stops being evidence because a child CLI, sub-agent, or small model has its own prompt and context window.

## Actions Taken

1. Re-read the live `sk-design` hub and registry to anchor the route vocabulary: `workflowMode`, `backendKind`, mode packet, and the build bundle. [SOURCE: .opencode/skills/sk-design/SKILL.md:41] [SOURCE: .opencode/skills/sk-design/SKILL.md:45] [SOURCE: .opencode/skills/sk-design/SKILL.md:60] [SOURCE: .opencode/skills/sk-design/mode-registry.json:5] [SOURCE: .opencode/skills/sk-design/mode-registry.json:16]
2. Read the shared context-loading contract, context card, proof card, and proof checker to separate "parent loaded it" from "child saw and applied it." [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:46] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:71] [SOURCE: .opencode/skills/sk-design/shared/assets/context_loaded_card.md:45] [SOURCE: .opencode/skills/sk-design/shared/assets/proof_of_application_card.md:15] [SOURCE: .opencode/skills/sk-design/shared/scripts/proof_check.py:47]
3. Compared the generic Agent I/O evidence contract against the design-specific child-dispatch requirement. [SOURCE: .opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md:20] [SOURCE: .opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md:25] [SOURCE: .opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md:170] [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/evidence-contract.ts:94]
4. Checked the live benchmark prompt/parser/scorer and the skill-benchmark fixture contract to see where a boundary-proof lane could be enforced. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:18] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:66] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:243] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:188] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/references/skill_benchmark/scenario_authoring.md:22]
5. Checked CLI dispatch surfaces for pre-load-by-construction support, especially small-model and design/UI dispatch templates. [SOURCE: .opencode/skills/cli-opencode/assets/prompt_templates.md:569] [SOURCE: .opencode/skills/cli-opencode/assets/prompt_templates.md:575] [SOURCE: .opencode/skills/sk-prompt-models/references/models/minimax-m3.md:130] [SOURCE: .opencode/skills/cli-codex/assets/prompt_templates.md:110]

## Findings

### Finding 1: The design contract names the dispatch-boundary requirement, but enforcement stops at shape

Severity: P1. Label: ENFORCEABLE for cards/schema/checker; ADVISORY for final design taste.

The shared contract already says the same proof field names must be used in parent sessions, delegated prompts, child responses, and final proof cards. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:71] The `design-interface` packet makes that child boundary explicit: any child-agent or small-model dispatch must carry the context manifest, require the Context Loaded card before recommendations, and require the Proof Of Application card before a ready claim. [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:258]

That is stronger than generic agent metadata, but it is still not fully enforceable today. `proof_check.py` validates whether required proof-field labels and a READY verdict are present; it does not validate the child prompt, prove the child read the listed files, or tie the child output back to the parent route declaration. [SOURCE: .opencode/skills/sk-design/shared/scripts/proof_check.py:47] [SOURCE: .opencode/skills/sk-design/shared/scripts/proof_check.py:52] The context card has a row for "Small-model profile for delegation", but it is a checkbox, not a cross-boundary link. [SOURCE: .opencode/skills/sk-design/shared/assets/context_loaded_card.md:57]

Buildable recommendation: add a design-specific boundary envelope, emitted by children and validated by the parent before any adoption or readiness claim:

```text
DESIGN_BOUNDARY_PROOF v1
dispatch_id:
boundary_kind: child-agent | cli-codex | cli-opencode | cli-claude-code | small-model
skill: sk-design
workflowModes:
backendKinds:
required_files:
provided_context_hash:
child_context_loaded_card: present | missing
child_proof_of_application_card: present | missing
proof_check: pass | fail | not_run
parent_verified: true | false
```

This is deterministically enforceable when the parent owns the prompt and receives the child transcript. It remains advisory for the open-ended quality of the design output.

### Finding 2: Generic Agent I/O evidence cannot be the hard gate for `sk-design`

Severity: P1. Label: ENFORCEABLE to detect absence; ADVISORY in the current generic contract.

The Agent I/O contract is explicitly optional-advisory. Every field is optional unless the caller and receiver explicitly agree otherwise, and absence of dispatch or result metadata is never a refusal condition. [SOURCE: .opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md:20] [SOURCE: .opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md:25] Its Evidence Group is also not a text envelope that agents append; it lives as a structured `evidence` field on deep-loop JSONL records, and no agent currently emits the fenced shape as output. [SOURCE: .opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md:170]

The implementation matches that advisory posture: the evidence contract treats absent metadata as valid, malformed metadata as a warning, and never blocks. [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/evidence-contract.ts:94] [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/evidence-contract.ts:105] That is correct for cross-agent compatibility, but it cannot guarantee `sk-design` utilization across a design dispatch boundary.

Buildable recommendation: do not harden generic Agent I/O for this. Add a `requiresDesignBoundaryProof` fixture field and scorer gate scoped to `sk-design` parent-hub scenarios. Generic Agent I/O stays compatibility metadata; design boundary proof becomes the hard gate only when the design contract says the task is delegated, small-model, or child-agent work.

### Finding 3: `cli-opencode` has a pre-load-by-construction design template, but the guarantee is not fixture-scored

Severity: P1. Label: ENFORCEABLE.

`cli-opencode` already has the right shape for pre-load-by-construction. Its design/UI dispatch template says the dispatched agent must load `sk-design` with the right mode bundle before any design decision, lists the exact context/proof files to read, requires the Context Loaded card before recommendations/code/findings, and requires the Proof Of Application card before readiness claims. [SOURCE: .opencode/skills/cli-opencode/assets/prompt_templates.md:575] [SOURCE: .opencode/skills/cli-opencode/assets/prompt_templates.md:589] [SOURCE: .opencode/skills/cli-opencode/assets/prompt_templates.md:597] [SOURCE: .opencode/skills/cli-opencode/assets/prompt_templates.md:621]

Small-model craft also has a design-task variant for MiniMax-M3, adding the shared design-loading contract to the model-specific TIDD-EC scaffold. [SOURCE: .opencode/skills/sk-prompt-models/references/models/minimax-m3.md:130] [SOURCE: .opencode/skills/sk-prompt-models/references/models/minimax-m3.md:144] [SOURCE: .opencode/skills/sk-prompt-models/references/models/minimax-m3.md:149] So there is a viable pre-load-by-construction path for at least one CLI family and one small-model profile.

The gap is measurement. The live skill-benchmark prompt asks the model for `surface`, `subLanguage`, `resources`, `assets`, and `agent`; it does not ask for child-boundary proof, prompt-included design files, child cards, or parent validation. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:66] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:72] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:243]

Buildable recommendation: add a fixture class for delegated design work:

```json
{
  "expected": {
    "skillId": "sk-design",
    "workflowModes": ["interface", "foundations"],
    "requiresDesignBoundaryProof": true,
    "requiredBoundaryFiles": [
      ".opencode/skills/sk-design/shared/context_loading_contract.md",
      ".opencode/skills/sk-design/shared/assets/context_loaded_card.md",
      ".opencode/skills/sk-design/shared/assets/proof_of_application_card.md"
    ],
    "requiredChildArtifacts": ["Context Loaded card", "Proof Of Application card"]
  }
}
```

Then make the live executor parse `DESIGN_BOUNDARY_PROOF`, cards, and `proof_check` result from the child output. A run that names resources but omits boundary proof should fail before resource recall.

### Finding 4: Cross-CLI template parity is incomplete

Severity: P2. Label: ENFORCEABLE for template presence; ADVISORY for arbitrary user-written prompts.

`cli-opencode` has an explicit design/UI dispatch template. [SOURCE: .opencode/skills/cli-opencode/assets/prompt_templates.md:569] The Codex CLI design-to-code template I read is a generic image-to-component prompt: it says to match an attached design and follow patterns in a file, but it does not name `sk-design`, the context manifest, or either proof card. [SOURCE: .opencode/skills/cli-codex/assets/prompt_templates.md:110] [SOURCE: .opencode/skills/cli-codex/assets/prompt_templates.md:117] The Claude Code template surface has schema-validated structured analysis examples, which could carry proof, but the checked structured templates are generic function/security/dependency schemas rather than design-boundary proof. [SOURCE: .opencode/skills/cli-claude-code/assets/prompt_templates.md:360] [SOURCE: .opencode/skills/cli-claude-code/assets/prompt_templates.md:376]

Buildable recommendation: create one shared `design_dispatch_boundary.md` prompt asset under `sk-design/shared/` or `sk-prompt-models/assets/`, then make `cli-opencode`, `cli-codex`, and `cli-claude-code` reference it instead of each inventing their own design handoff. Add a parity checker that fails when a CLI prompt template supports design/UI dispatch without including the boundary proof fields, exact design-context files, and the no-memory-substitution rule.

### Finding 5: The scorer has no first-failing stage for boundary proof

Severity: P1. Label: ENFORCEABLE.

The current funnel can fail activation, router parse, surface mismatch, routed-intra, or discovery. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:188] It builds live evidence from event count, activation, tool names, observed reads, and whether stated routing parsed. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:209] The weighted score then still flows through intent/resource recall and routing efficiency. [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:242] [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:257]

That means a delegated design run can look partially successful if it lists the right files, even when the parent cannot prove the child prompt included the contract or that the child returned the cards. This is the D3-A9 gap.

Buildable recommendation: add hard stages before `routed-intra` for delegated design fixtures:

```text
design-boundary-proof-missing
design-boundary-required-file-missing
design-boundary-child-card-missing
design-boundary-proof-check-failed
design-boundary-parent-not-verified
```

For `cli-opencode`, corroborate with `tool_use` reads when available. For `cli-codex` and `cli-claude-code`, use out-of-band proof: exact prompt payload saved by the caller, child output parsed for boundary proof, and parent-run `proof_check.py --json --require-cards` over the captured child notes.

## Questions Answered

- Q2/D3: Parent-to-sub-skill utilization across a child boundary is not proven by parent-local context loading. The enforceable unit is a boundary proof object tying route declaration, required files, child context/proof cards, and parent validation together.
- Q4/D5: Cross-CLI survival needs two mechanisms. Pre-load-by-construction belongs in dispatch templates and model profiles; out-of-band proof belongs in the captured child result plus parent-side validation.
- Q5/all: Enforceable pieces are template parity checks, `requiresDesignBoundaryProof` fixtures, boundary-proof parsing, required-file/hash validation, child-card presence, `proof_check` execution, and first-failing-stage gates. Advisory pieces are arbitrary hand-written prompts outside the template path and final aesthetic judgment.

## Questions Remaining

- Should the shared design boundary asset live under `sk-design/shared/`, `sk-prompt-models/assets/`, or a CLI-agnostic system-spec-kit reference?
- Should `provided_context_hash` hash the exact prompt slice, the on-disk file contents, or both?
- Should `cli-codex` and `cli-claude-code` gain design-specific templates directly, or should their generic templates link to one shared boundary asset to avoid drift?
- Should a missing boundary proof cap the existing D1-intra score or become a separate hard gate before any D1/D2/D3 scoring?

## Next Focus

D3-A10: fixture schema and scorer placement for the design boundary-proof lane. The next pass should specify the exact public/private fixture fields, parser outputs, and first-failing-stage ordering so implementation can add the gate without folding it into generic Agent I/O.

## Sources Consulted

- `.opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/deep-research-strategy.md`
- `.opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-024.md`
- `.opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-025.md`
- `.opencode/skills/sk-design/SKILL.md`
- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/design-interface/SKILL.md`
- `.opencode/skills/sk-design/shared/context_loading_contract.md`
- `.opencode/skills/sk-design/shared/assets/context_loaded_card.md`
- `.opencode/skills/sk-design/shared/assets/proof_of_application_card.md`
- `.opencode/skills/sk-design/shared/scripts/proof_check.py`
- `.opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/evidence-contract.ts`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs`
- `.opencode/skills/deep-loop-workflows/deep-improvement/references/skill_benchmark/scenario_authoring.md`
- `.opencode/skills/deep-loop-workflows/deep-improvement/references/model_benchmark/mixed_executor_methodology.md`
- `.opencode/skills/cli-opencode/assets/prompt_templates.md`
- `.opencode/skills/cli-codex/assets/prompt_templates.md`
- `.opencode/skills/cli-claude-code/assets/prompt_templates.md`
- `.opencode/skills/sk-prompt-models/references/models/minimax-m3.md`

## Assessment

newInfoRatio: 0.64. Novelty is moderate-high: iterations 19, 24, and 25 already established source-proof, route-token, and backend/tool-policy gates. This pass adds the dispatch-boundary layer: child utilization must be proven by a prompt/output/validation chain, not by parent-local context or generic advisory metadata.

Confidence: high for the local contract gaps and scorer placement because they are directly traced through the checked files. Medium for the shared-asset home because implementation should decide whether design, prompt, or CLI ownership gives the least drift.

## Reflection

The useful rule is simple: parent preload proves parent behavior; child proof proves child behavior. A delegated design task needs both when the parent later adopts the child output.

Ruled out: treating generic Agent I/O evidence as the hard design gate. Its compatibility contract deliberately makes absence valid, so `sk-design` needs a scoped boundary proof rather than a global metadata promotion.
