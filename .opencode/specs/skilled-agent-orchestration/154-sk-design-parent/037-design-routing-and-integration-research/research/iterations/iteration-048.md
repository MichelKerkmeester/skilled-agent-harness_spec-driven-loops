# Iteration 48: D5-A3 CLI Child Open Design Pairing

## Focus

[D5-A3 / D5] The `mcp-open-design` pairing is parent-resident today. This iteration tested whether a CLI child must re-assert the `sk-design` plus `mcp-open-design` pairing inside its own transport context before any Open Design design-feeding read, generation run, or form answer.

newInfoRatio estimate: 0.66. Status: insight. The fresh part is not "load sk-design before design work" (covered by iterations 46 and 47), but the transport-side reassertion: an Open Design CLI child needs both design judgment and transport proof, plus a demand-back result the parent can replay.

## Actions Taken

1. Re-read the deep-research hub and research packet contracts to keep this as a leaf iteration with only the narrative, delta, and state-log append artifacts.
2. Re-read iterations 46 and 47 so this pass did not repeat the broad missing design-loading rule or the parent-side design manifest pass-through. Iteration 47 explicitly left D5-A3 as the next focus: the parent needs a machine-checkable child return proving the manifest was honored and any design/Open Design output used the same payload. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/037-design-routing-and-integration-research/research/iterations/iteration-047.md:85]
3. Inspected all three CLI skills' `ALWAYS` sections for dispatch pass-through rules. They carry the spec-folder pass-through and the code-standards loading rule, but not an Open Design child-resident transport pairing rule. [SOURCE: .opencode/skills/cli-opencode/SKILL.md:318] [SOURCE: .opencode/skills/cli-opencode/SKILL.md:327] [SOURCE: .opencode/skills/cli-codex/SKILL.md:353] [SOURCE: .opencode/skills/cli-codex/SKILL.md:359] [SOURCE: .opencode/skills/cli-claude-code/SKILL.md:347] [SOURCE: .opencode/skills/cli-claude-code/SKILL.md:354]
4. Inspected the existing cli-opencode design/UI prompt template. It already requires `sk-design`, exact design files, Context Loaded, and Proof Of Application cards, but it is local to cli-opencode and does not require `mcp-open-design` to be loaded in the child when the delegated task will use Open Design. [SOURCE: .opencode/skills/cli-opencode/assets/prompt_templates.md:575] [SOURCE: .opencode/skills/cli-opencode/assets/prompt_templates.md:589] [SOURCE: .opencode/skills/cli-opencode/assets/prompt_templates.md:596] [SOURCE: .opencode/skills/cli-opencode/assets/prompt_templates.md:601]
5. Re-read `sk-design`, `mcp-open-design`, the Open Design tool-surface reference, the design proof cards, and Agent I/O to distinguish enforceable transport proof from advisory metadata. [SOURCE: .opencode/skills/sk-design/SKILL.md:34] [SOURCE: .opencode/skills/sk-design/SKILL.md:97] [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:21] [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:48] [SOURCE: .opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md:22]

## Findings

### Finding 1: The Open Design pairing is real, but it is local to the active skill context

Severity: P1. Label: ENFORCEABLE for static presence checks and prompt-replay fixtures; ADVISORY for whether the child made good design judgments after satisfying the gate.

`sk-design` says design transports such as Open Design are loaded after the design mode is chosen and must not be treated as taste or critique authority. [SOURCE: .opencode/skills/sk-design/SKILL.md:34] [SOURCE: .opencode/skills/sk-design/SKILL.md:97] The `mcp-open-design` skill makes the inverse side equally explicit: it is transport, never taste, and any generation or design-feeding read must load `sk-design` first. [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:19] [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:21] The same hard gate appears in the router and resource-loading table. [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:78] [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:92]

That proves the pair exists. It does not prove the pair survives a CLI boundary. A delegated child is a fresh runtime context with its own loaded skills and prompt body. If the parent merely says "I already loaded sk-design" and then asks the child to call Open Design, the child's own `mcp-open-design` transport rules have not been re-established where the tool call will actually happen.

Buildable recommendation: define a child-resident `OPEN_DESIGN_TRANSPORT_ASSERTION v1` that is required whenever `DESIGN_DISPATCH_MANIFEST v1` has `usesOpenDesign: true` or the child prompt contains Open Design/`mcp-open-design`/`od` design-feeding work. Minimum fields: `dispatchId`, `designManifestDigest`, `childLoadedSkills: ["sk-design","mcp-open-design"]`, `skDesignModes`, `register`, `direction: WIRE|READ|RUN`, `operationClass: pure_transport|design_feed_read|mutating_run|destructive`, `loadedTransportFiles`, `liveToolsListVerified`, `targetProject`, `rollbackNote`, `payloadDigests`, and `pureTransportExemption`.

### Finding 2: The CLI family has no Open Design-specific child rule beside its proven pass-through rules

Severity: P1. Label: ENFORCEABLE for static CLI-skill lint and negative prompt replay.

All three CLI skills have the same hard-shape precedent from Gate 3: if a spec folder is active, pass it to the child; if not, ask before non-interactive delegation. [SOURCE: .opencode/skills/cli-opencode/SKILL.md:318] [SOURCE: .opencode/skills/cli-codex/SKILL.md:353] [SOURCE: .opencode/skills/cli-claude-code/SKILL.md:347] They also all carry the code-standards loading rule for code review or generation dispatch. [SOURCE: .opencode/skills/cli-opencode/SKILL.md:327] [SOURCE: .opencode/skills/cli-codex/SKILL.md:359] [SOURCE: .opencode/skills/cli-claude-code/SKILL.md:354]

The missing twin is narrower than iteration 46's general design-loading rule: for Open Design-adjacent dispatch, the child must be told to load `mcp-open-design` too, read its tool-surface/gating reference, classify the operation, and return a transport proof. Without that, a child can satisfy `sk-design` proof fields but still operate Open Design from an under-specified transport context.

Buildable recommendation: add an `Open Design Transport Pairing (child-resident contract)` rule to the `ALWAYS` section of `cli-opencode`, `cli-codex`, and `cli-claude-code`, immediately after the future design manifest rule. Static checker tokens: `mcp-open-design`, `references/tool_surface.md`, `Open Design`, `sk-design`, `DESIGN_DISPATCH_MANIFEST`, `OPEN_DESIGN_TRANSPORT_ASSERTION`, `OPEN_DESIGN_TRANSPORT_RESULT`, `pure_transport_exemption`, and `live tools/list`.

### Finding 3: The existing cli-opencode design template is useful but incomplete for Open Design transport work

Severity: P1. Label: ENFORCEABLE for template parity and required transport fields; ADVISORY for semantic classification of borderline prompts.

The cli-opencode design/UI template already says delegated UI build, redesign, review, readiness review, or design recommendation tasks must load `sk-design` before design decisions. [SOURCE: .opencode/skills/cli-opencode/assets/prompt_templates.md:575] It includes exact `sk-design` contract, register, mode, Context Loaded, and Proof Of Application files. [SOURCE: .opencode/skills/cli-opencode/assets/prompt_templates.md:589] [SOURCE: .opencode/skills/cli-opencode/assets/prompt_templates.md:593] It then requires the child to emit the Context Loaded card and Proof Of Application card. [SOURCE: .opencode/skills/cli-opencode/assets/prompt_templates.md:596] [SOURCE: .opencode/skills/cli-opencode/assets/prompt_templates.md:601]

The gap is that this template has no transport branch. A delegated task like "use Open Design to generate this screen from the manifest" needs extra child instructions: load `mcp-open-design`, verify the desktop daemon/tool surface, classify `start_run` or `od ui respond` as gated mutation, and bind outgoing brief/form answers to the same design manifest digest. The current template can prove design context, but not Open Design transport compliance.

Buildable recommendation: split the design dispatch template into a base design manifest and an optional Open Design supplement. The supplement should only fire for Open Design prompts, so a normal UI audit does not load transport instructions it will not use.

### Finding 4: Open Design's run surface makes child-side demand-back mandatory

Severity: P1. Label: ENFORCEABLE when tool calls or structured child results are available; ADVISORY for text-only child outputs without replayable tool logs.

The Open Design tool surface is concrete enough to validate: read-only tools are named, mutating tools include `create_artifact`, `write_file`, `create_project`, `start_run`, and `cancel_run`, and `start_run` is the significant multi-turn generation boundary. [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:42] [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:48] [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:52] The skill also says a run is multi-turn: `start_run` returns a discovery form with zero files, and only answering the form fires the build that writes design files. [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:228] [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:230] [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:245]

That means the parent cannot validate the child by reading only a final natural-language summary. The child may perform a design-feeding read, turn-1 `start_run`, and later `ui respond` or follow-up answer. Each step must bind to the same dispatch manifest and transport assertion.

Buildable recommendation: require `OPEN_DESIGN_TRANSPORT_RESULT v1` from CLI children that received an Open Design transport assertion. Minimum fields: `dispatchId`, `designManifestDigest`, `transportAssertionDigest`, `childLoadedSkills`, `loadedTransportFiles`, `direction`, `operationClass`, `toolsCalled`, `toolCallDigests`, `runId`, `surfaceId`, `briefDigest`, `formAnswersDigest`, `artifactRefs`, `proofCardDigest`, `validationStatus`, and `missingFields`. Parent-side replay rejects mismatched digests, missing transport proof, or a mutating call not listed in `toolsCalled`.

### Finding 5: Agent I/O can carry a digest, but cannot be the authority

Severity: P2. Label: ENFORCEABLE that current Agent I/O absence must not block; ADVISORY as an auxiliary metadata carrier.

Agent I/O declares itself optional-advisory, and absence of dispatch headers or result envelopes is never a refusal condition. [SOURCE: .opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md:20] [SOURCE: .opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md:25] Its evidence block is not a text envelope agents append; it lives as structured deep-loop JSONL metadata, is optional, and validation remains advisory even in strict mode. [SOURCE: .opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md:170] [SOURCE: .opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md:174] [SOURCE: .opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md:176]

Buildable recommendation: Agent I/O may include the manifest/assertion/result digests later, but the hard requirement belongs in the CLI prompt contract and Open Design transport result. Parent validation must treat "no transport result" as a failed Open Design handoff when the prompt requested Open Design, even though ordinary Agent I/O remains advisory.

### Buildable enforcement package

Add three layers later:

1. Static contract lint across `cli-*`: every CLI skill must contain the Open Design transport-pairing rule and required tokens.
2. Prompt-replay fixtures: Open Design generation, Open Design design-feeding read, Open Design pure WIRE, ordinary design task, and pure code task. Expected behavior: generation/read include `OPEN_DESIGN_TRANSPORT_ASSERTION`; pure WIRE includes `pure_transport_exemption`; ordinary design loads `sk-design` without `mcp-open-design`; pure code loads neither.
3. Parent result replay: a child that returns Proof Of Application without `OPEN_DESIGN_TRANSPORT_RESULT` fails when Open Design was used; a child with mismatched payload/tool digests fails; matching manifest/assertion/result triples pass the structural gate.

## Questions Answered

- Q4/D5: The contract survives into CLI children only if Open Design work is re-asserted inside the child's own runtime: `sk-design` for judgment, `mcp-open-design` for transport, and a demand-back result proving the actual Open Design calls used the same manifest payload.
- Q5/all: Enforceable items are static CLI rule lint, required transport assertion fields, prompt-replay fixtures, result-block presence, digest matching, operation-class checks, and parent replay. Advisory items are final visual quality, semantic classification of ambiguous Open Design wording, and child outputs without replayable tool logs.

## Questions Remaining

- Should `OPEN_DESIGN_TRANSPORT_ASSERTION v1` live in `mcp-open-design/references/tool_surface.md`, a new `mcp-open-design/references/cli_child_pairing.md`, or a shared `sk-design`/CLI boundary reference?
- Should Open Design pure WIRE require a small assertion with `operationClass:pure_transport`, or is a `pure_transport_exemption` line enough?
- How should text-only `cli-claude-code` output be replayed if no structured tool stream is captured, especially for `od ui respond` and follow-up-message paths?

## Next Focus

D5-A4 should define the parent-side validator shape: how to parse child output for `DESIGN_DISPATCH_MANIFEST`, `OPEN_DESIGN_TRANSPORT_ASSERTION`, and `OPEN_DESIGN_TRANSPORT_RESULT`, then fail closed for Open Design tasks whose result lacks matching digests or transport proof.
