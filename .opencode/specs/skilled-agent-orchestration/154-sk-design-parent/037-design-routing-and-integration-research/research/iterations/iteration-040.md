# Iteration 40: D4-A9 Sub-Agent Delegation Proof Laundering

## Focus

[D4-A9 / D4] sub-agent/Task delegation laundering: the `sk-design` proof token must travel in the child dispatch payload and be re-validated at the child's Open Design tool boundary. This iteration follows iteration 39's Open Design inner-agent payload finding into ordinary CLI/Task child delegation, where a parent can load `sk-design` correctly but still lose the proof before the child calls `start_run`.

## Actions Taken

1. Re-read the active strategy questions and prior D4-A8 handoff. The strategy asks for a D4 deny-by-default mechanism across MCP/CLI/HTTP/automation and for D5 survival through cli-opencode/codex/claude-code children; iteration 39 already established that Open Design inner generation needs payload digests, not parent-local context proof. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/037-design-routing-and-integration-research/research/deep-research-strategy.md:37] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/037-design-routing-and-integration-research/research/deep-research-strategy.md:38] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/037-design-routing-and-integration-research/research/iterations/iteration-039.md:130] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/037-design-routing-and-integration-research/research/iterations/iteration-039.md:143]
2. Verified the Open Design mutation boundary. `start_run` is mutating, multi-turn, spawns an inner agent, returns a discovery form with zero files, and the form answer triggers the build. [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:48] [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:52] [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:228] [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:245]
3. Verified the existing `sk-design` proof primitives. The shared contract already requires proof fields in parent sessions, delegated prompts, child responses, and final proof cards, and it ships deterministic checks for proof-field completeness. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:71] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:150] [SOURCE: .opencode/skills/sk-design/shared/assets/proof_of_application_card.md:15] [SOURCE: .opencode/skills/sk-design/shared/assets/proof_of_application_card.md:68]
4. Checked cross-agent dispatch contracts. Agent I/O is explicitly optional/advisory, cli-* skills pass spec-folder and code-standard context, and cli-opencode has a design/UI prompt scaffold, but no checked source makes a design proof token mandatory at the child Open Design tool boundary. [SOURCE: .opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md:20] [SOURCE: .opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md:25] [SOURCE: .opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md:174] [SOURCE: .opencode/skills/cli-opencode/assets/prompt_templates.md:575]

## Findings

### Finding 1: Agent I/O is the wrong place to make the design proof token mandatory

Severity: P1. ENFORCEABLE-vs-ADVISORY label: ENFORCEABLE for a separate design-proof payload contract on matching dispatches; ADVISORY if kept inside the current Agent I/O optional metadata.

The Agent I/O contract intentionally says its status is `optional-advisory`, that every field is optional unless caller and receiver explicitly agree otherwise, and that absence of a dispatch header or result envelope is never a refusal condition. [SOURCE: .opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md:20] [SOURCE: .opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md:25] [SOURCE: .opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md:26] Its evidence group has the exact laundering shape that looks tempting, including `child_result_verified`, but the same section says omission is valid, partial payloads are advisory, and even strict mode does not block because no blocking failure reason exists yet. [SOURCE: .opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md:160] [SOURCE: .opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md:167] [SOURCE: .opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md:174] [SOURCE: .opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md:176]

That makes Agent I/O a useful carrier for optional evidence, not a hard gate. If the proof token only rides as `evidence`, a child can omit it and still be a valid legacy dispatch, then later call Open Design through a separately loaded tool surface.

Buildable recommendation: add a separate `DESIGN_PROOF_TOKEN v1` block for any dispatch where the child may make UI/design decisions or call Open Design mutating tools. Minimum fields: `tokenId`, `dispatchId`, `issuedAt`, `expiresAt`, `surface`, `taskType`, `register`, `modeBundle`, `loadedFiles[{path,sha256}]`, `allowedMutatingTools`, `openDesignLineage`, `briefDigest`, `formAnswersDigest`, and `parentValidation`. Keep Agent I/O optional for compatibility; make this new block mandatory only under the design/Open Design predicate.

Fixture rule: a delegated prompt containing "Open Design", `mcp-open-design`, `start_run`, `od run start`, `od ui respond`, or design-generation intent fails prompt lint unless it carries `DESIGN_PROOF_TOKEN v1`. A non-design dispatch still passes without it.

### Finding 2: cli-opencode has a partial design dispatch scaffold, but cli-codex and cli-claude-code do not carry the same proof-token boundary

Severity: P1. ENFORCEABLE-vs-ADVISORY label: ENFORCEABLE for rendered-prompt lint across cli-opencode, cli-codex, and cli-claude-code; ADVISORY for the child's private application quality.

The generic cli-* rules already know that non-interactive children need critical context in the prompt. cli-opencode, cli-codex, and cli-claude-code all require the spec folder to be passed to the delegated session because the child cannot answer Gate 3 interactively. [SOURCE: .opencode/skills/cli-opencode/SKILL.md:318] [SOURCE: .opencode/skills/cli-codex/SKILL.md:353] [SOURCE: .opencode/skills/cli-claude-code/SKILL.md:347] They also require code-standard loading when dispatching code review or generation. [SOURCE: .opencode/skills/cli-opencode/SKILL.md:327] [SOURCE: .opencode/skills/cli-codex/SKILL.md:359] [SOURCE: .opencode/skills/cli-claude-code/SKILL.md:354]

cli-opencode has the closest design-specific precedent: its design/UI template requires the child to load `sk-design`, read the shared contract and proof cards, emit the Context Loaded card before design direction, and emit the Proof Of Application card before ready/accessibility/release claims. [SOURCE: .opencode/skills/cli-opencode/assets/prompt_templates.md:571] [SOURCE: .opencode/skills/cli-opencode/assets/prompt_templates.md:575] [SOURCE: .opencode/skills/cli-opencode/assets/prompt_templates.md:590] [SOURCE: .opencode/skills/cli-opencode/assets/prompt_templates.md:597] [SOURCE: .opencode/skills/cli-opencode/assets/prompt_templates.md:601] But that is still proof-card prompting, not a token that binds the child's later `start_run` or `od ui respond` payloads.

Buildable recommendation: extract the cli-opencode design scaffold into a shared cli-family `design_delegation_payload.md` reference and require each cli-* skill to include it when the delegated prompt is design/UI/Open Design scoped. The shared payload should include both human-readable proof cards and the machine token from Finding 1. cli-opencode can keep its rich template; cli-codex and cli-claude-code need equivalent prompt templates or a required include rule.

Fixture rule: render one design delegation prompt per cli skill and assert the prompt contains `DESIGN_PROOF_TOKEN v1`, exact `sk-design` context files, Context Loaded output order, Proof Of Application output order, and "validate before Open Design tool call" language. Render one non-design delegation prompt per cli skill and assert the token is absent.

### Finding 3: The child must re-validate before Open Design mutation, because parent-local proof cannot guard the child's tool call

Severity: P1. ENFORCEABLE-vs-ADVISORY label: ENFORCEABLE for child PreToolUse/proxy denial on missing or mismatched token; ADVISORY for final aesthetic quality.

Open Design already says this skill is transport, not taste, and that every generation/start_run plus every design-feeding read must load `sk-design` and shape the brief and discovery-form answers with that judgment. [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:19] [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:21] The run path then crosses a tool boundary: `start_run` is a mutating tool, and `od ui respond` is also a gated mutating CLI write verb. [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:50] [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:77] [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:78]

The existing Open Design gate is necessary but too parent-local for delegated children. A child that receives a thin prompt can independently load mcp-open-design, see the same mandatory pairing prose, and self-attest that it loaded `sk-design`. That does not prove the parent's token, register, mode bundle, and payload digests traveled into the child's actual `start_run` call.

Buildable recommendation: add a child-side Open Design mutation guard in the mcp-open-design wrapper or MCP proxy. For design-generation tools (`start_run`, `od run start`, `od ui respond`, generation follow-up messages, and any equivalent automation path), the guard must:

- require `DESIGN_PROOF_TOKEN v1` in the child prompt context or structured tool metadata;
- verify expiry, dispatch id, surface, task type, loaded-file hashes, register, mode bundle, and allowed mutating tool;
- recompute `briefDigest` and `formAnswersDigest` from the exact outgoing payload;
- deny the call if a digest mismatches or if raw "use recommended defaults" / `--skip` lacks compiled default acceptance;
- record `toolCallDigest` for parent-side replay.

Fixture rule: a child transcript with a valid Context Loaded card but no token fails before `start_run`. A transcript with a token whose digest does not match the outgoing `--message` fails. A transcript with matching token + payload passes the structural gate. The remaining visual-quality assessment stays advisory.

### Finding 4: The parent needs a demand-back proof result, not only child prose

Severity: P2. ENFORCEABLE-vs-ADVISORY label: ENFORCEABLE when the dispatch surface captures JSON events/tool calls; ADVISORY when only free-text child output is available.

The cli skills already tell the caller not to trust child output blindly: cli-opencode validates dispatched output, cli-codex validates generated code, and cli-claude-code validates output before applying. [SOURCE: .opencode/skills/cli-opencode/SKILL.md:323] [SOURCE: .opencode/skills/cli-codex/SKILL.md:348] [SOURCE: .opencode/skills/cli-claude-code/SKILL.md:343] Agent I/O has `child_result_verified`, but that field lives inside optional advisory evidence and cannot be the hard acceptance path. [SOURCE: .opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md:167] [SOURCE: .opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md:174] [SOURCE: .opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md:176]

Buildable recommendation: require a `DESIGN_PROOF_RESULT v1` demand-back block from any child that received a design proof token. Minimum fields: `tokenId`, `dispatchId`, `validationStatus`, `validatedAt`, `toolsCalled`, `toolCallDigests`, `briefDigest`, `formAnswersDigest`, `proofCardDigest`, `transcriptRef`, and `missingFields`. The parent then accepts the child result only if the returned token id matches the dispatched token and replayed event logs show the guarded Open Design call used the same payload digest.

Fixture rule: parent-side replay rejects a child handoff that includes a pretty Proof Of Application card but no `DESIGN_PROOF_RESULT`, rejects mismatched digests, and accepts matching token/result/tool-call triples.

## Questions Answered

- Q3/D4: The deny-by-default Open Design guarantee has to fire at two layers: parent dispatch payload lint and child Open Design mutation boundary validation. Parent-local `sk-design` loading is not enough once a child owns the `start_run` or form-answer tool call.
- Q4/D5: The contract survives cli-opencode/codex/claude-code children by carrying a mandatory design proof token in the dispatch prompt, re-validating that token before child Open Design mutations, and demanding back a structured result whose digests the parent can replay.
- Q5/all: ENFORCEABLE items are prompt-token presence, required fields, expiry, loaded-file hashes, allowed mutating tools, payload digests, child pretool denial, and parent replay. ADVISORY items are the child's private reasoning and the final design quality.

## Questions Remaining

- Should the hard token be minted by `sk-design` proof-card parsing, by an `openDesignGate mint` helper, or by the mcp-open-design proxy immediately before dispatch?
- Should `DESIGN_PROOF_TOKEN v1` live as a shared sk-design reference, a mcp-open-design reference, or a system-spec-kit cross-agent boundary reference imported by both?
- What live MCP schema field can carry the token into `start_run` without leaking Open Design source content into repo artifacts?
- How should event replay work for cli-claude-code when output is text-only and no machine-readable tool stream is captured?

## Next Focus

D4-A10 should define the minimal `DESIGN_PROOF_TOKEN v1` and `DESIGN_PROOF_RESULT v1` schemas, then map exactly which fields are checked by parent prompt lint, child Open Design PreToolUse/proxy validation, and parent replay.
