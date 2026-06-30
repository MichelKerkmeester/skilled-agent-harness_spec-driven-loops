# Iteration 34: D4-A3 Purpose-Bound Open Design Exemption

## Focus

[D4-A3 / D4] the exemption is self-judged + post-hoc: define pure transport versus design-feeding use on the Open Design tool/proxy surface, not only in the agent's inferred intent.

## Actions Taken

1. Re-read the active strategy and prior D4 iterations to avoid re-covering the direct MCP and Bash CLI bypass work. Prior work already established that mutating MCP calls need a tool-bound `skDesignGate`, and `daemon-cli.mjs` write verbs need a parser-backed Bash precondition. [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-032.md:17] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-033.md:47]
2. Re-read the `mcp-open-design` mandatory pairing language, routing pseudocode, tool-surface policy, and manual gate scenario to locate where "pure transport" is decided. [SOURCE: AGENTS.md:65] [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:21] [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:164] [SOURCE: .opencode/skills/mcp-open-design/manual_testing_playbook/05--design-gate/mandatory-design-gate.md:62]
3. Re-read the `sk-design` context/proof assets to check whether current proof binds Open Design read outputs to later design use. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:46] [SOURCE: .opencode/skills/sk-design/shared/assets/context_loaded_card.md:45] [SOURCE: .opencode/skills/sk-design/shared/assets/proof_of_application_card.md:68]

## Findings

### Finding 1: The pure-transport exemption is currently caller-asserted intent, not tool-bound policy

Severity: P1. Label: ENFORCEABLE for a guarded MCP proxy / hook fixture; ADVISORY if enforcement relies on transcript prose or an unwrapped upstream tool call.

The project-level Open Design dispatch rule says UI/design work through `mcp-open-design` must co-load `sk-design`, while pure transport is exempt. [SOURCE: AGENTS.md:65] The Open Design skill repeats the same boundary: every generation or read that feeds a design decision is gated, while wiring and bare inventory are exempt. [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:21] The pseudocode expresses the boundary as `design_gate(intents, feeds_design_decision)` and defaults `route_open_design_resources(..., feeds_design_decision: bool = False)`, which means the critical exemption bit is supplied by the caller/model rather than derived from the tool call itself. [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:164] [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:171]

The manual playbook exposes the hard case: the same `list_projects` call is exempt when it is bare inventory, but gated when it resolves which system to ground in. It explicitly says the boundary is whether the read feeds a design decision, not the tool name. [SOURCE: .opencode/skills/mcp-open-design/manual_testing_playbook/05--design-gate/mandatory-design-gate.md:53] [SOURCE: .opencode/skills/mcp-open-design/manual_testing_playbook/05--design-gate/mandatory-design-gate.md:54] [SOURCE: .opencode/skills/mcp-open-design/manual_testing_playbook/05--design-gate/mandatory-design-gate.md:62]

Buildable recommendation: add a purpose-bound Open Design policy surface, ideally in `.opencode/skills/mcp-open-design/references/tool_surface.md` and then in the guarded MCP proxy / PreToolUse policy. The policy should classify each tool with both `mutationClass` and `designInfluenceClass`, and require an inspectable field such as:

```json
{
  "openDesignUse": "transport_inventory | design_grounding | artifact_review | generation",
  "skDesignGate": { "requiredWhen": "design_grounding|artifact_review|generation" }
}
```

For ambiguous read tools (`list_projects`, `get_project`, `get_file`, `search_files`, `list_files`, `get_active_context`, `get_artifact`), absent `openDesignUse` should be treated as `transport_inventory` only and returned with a non-design-use receipt. Any later design-affecting call that cites those results must present a `design_grounding` or `artifact_review` receipt plus a valid `skDesignGate`. That makes the exemption visible in the tool transcript before the output is used, rather than post-hoc in the agent's explanation.

### Finding 2: The current tool-surface policy says read-only tools are always safe, but the design gate says some read-only calls must block

Severity: P1. Label: ENFORCEABLE for docs/schema lint plus replay fixtures; ADVISORY for live upstream Open Design tools until a proxy/hook can see the purpose field.

`tool_surface.md` correctly classifies the registered MCP tools by mutability: eleven read-only tools, five mutating tools, and two destructive tools. [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:42] [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:48] [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:56] But it then says read-only tools are always safe to surface and may be called without ceremony. [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:46] [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:66] [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:70]

That mutability-only statement conflicts with the mandatory design gate for read-only calls that become design inputs. The skill's routing table says any read feeding a design decision must load `sk-design` first. [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:78] [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:92] The grounding feature catalog says the same thing: a read that feeds a design decision is blocked without `sk-design`, while pure transport remains exempt. [SOURCE: .opencode/skills/mcp-open-design/feature_catalog/03--grounding/design-system-grounding.md:20] [SOURCE: .opencode/skills/mcp-open-design/feature_catalog/03--grounding/design-system-grounding.md:30] [SOURCE: .opencode/skills/mcp-open-design/feature_catalog/03--grounding/design-system-grounding.md:34]

Buildable recommendation: split `tool_surface.md` Section 3 into two orthogonal axes:

- `mutationSafety`: `read_only | mutating | destructive`
- `designInfluence`: `none | ambiguous_read | design_feed | generation`

Then add a checker fixture that fails if any `ambiguous_read` tool is documented as "always safe" without the caveat that it is only safe for `openDesignUse=transport_inventory`. Example expected replay: `list_projects` with `transport_inventory` passes without `skDesignGate`; `list_projects` with `design_grounding` denies without `skDesignGate`; `start_run` always requires `skDesignGate`.

### Finding 3: Existing `sk-design` proof cards prove context shape, not Open Design read-output lineage

Severity: P2. Label: ENFORCEABLE when tool outputs or receipts are captured; ADVISORY when only model-authored proof cards are available.

`sk-design` already requires a context manifest before design/build decisions and says no palette, layout, motion, copy, accessibility, score, release, or readiness claim passes until claim-supporting files are named as loaded. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:46] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:65] The context card operationalizes loaded files and staged proof fields, then records a context verdict. [SOURCE: .opencode/skills/sk-design/shared/assets/context_loaded_card.md:45] [SOURCE: .opencode/skills/sk-design/shared/assets/context_loaded_card.md:61] [SOURCE: .opencode/skills/sk-design/shared/assets/context_loaded_card.md:70] The final proof card has a deterministic checker, but the cited card surface is about required proof fields and READY/NOT READY, not an Open Design tool receipt or read-output digest. [SOURCE: .opencode/skills/sk-design/shared/assets/proof_of_application_card.md:59] [SOURCE: .opencode/skills/sk-design/shared/assets/proof_of_application_card.md:68]

Buildable recommendation: extend the future `skDesignGate` token and proof cards with an `OPEN DESIGN RECEIPTS` block:

```json
{
  "toolCallId": "open-design.list_projects#...",
  "toolName": "list_projects",
  "openDesignUse": "transport_inventory | design_grounding | artifact_review",
  "outputDigest": "sha256:...",
  "usedActiveContext": true,
  "project": "optional explicit project id",
  "expiresAt": "ISO-8601"
}
```

The proxy/checker can then enforce that pure-transport receipts cannot be cited by a later design RUN, and that design-grounding receipts require `sk-design` context loaded before the design decision. This does not judge visual taste; it only makes the boundary auditable.

## Questions Answered

- Q3/D4: The exemption should not be represented only as "pure transport" prose or a `feeds_design_decision` boolean chosen by the agent. It needs an inspectable `openDesignUse`/receipt field on the guarded tool/proxy surface, with ambiguous reads denied for design use unless a valid `skDesignGate` is present.
- Q5/all: The enforceable backlog item is to add a two-axis Open Design tool policy (`mutationSafety` plus `designInfluence`) and replay fixtures. The intrinsically advisory layer remains quality judgment: whether the loaded `sk-design` context produced a good design still needs proof-card/application witnesses and human or visual QA.

## Questions Remaining

- Should the first implementation wrap upstream Open Design tools in a local guarded proxy that adds `openDesignUse` and receipts, or should Codex/OpenCode hooks accept sidecar gate metadata attached to otherwise unchanged tool calls?
- Which read tools should be marked `ambiguous_read` versus `design_feed` by default? `list_projects` is clearly ambiguous; `get_file` and `search_files` may need stricter defaults because they commonly supply grounding material.
- Should pure-transport receipts expire immediately after the current tool result, or can they survive for diagnostic summaries while still being forbidden as design-grounding inputs?

## Next Focus

D4-A4: design the guarded Open Design proxy/tool-policy schema that carries `openDesignUse`, read receipts, `skDesignGate`, expiry, and transcript replay tests across MCP, CLI, HTTP, and automation surfaces without over-blocking true transport-only calls.
