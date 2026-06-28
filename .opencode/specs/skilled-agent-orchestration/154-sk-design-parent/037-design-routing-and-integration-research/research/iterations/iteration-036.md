# Iteration 36: D4-A5 - Positive Pure-Transport Exemption Token

## Focus

[D4-A5 / D4] `feeds_design_decision` is caller-supplied and defaults false. This iteration narrowed the prior D4 findings into the token semantics needed to invert the default: unknown Open Design purpose should be denied for design influence, and pure transport should pass only through a checkable positive exemption token.

## Actions Taken

1. Re-read the deep-research output contract and the active strategy's Q3/D4 target: a deny-by-default, content-bound-token mechanism for `mcp-open-design` across MCP, CLI, HTTP, and automation surfaces. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/037-design-routing-and-integration-research/research/deep-research-strategy.md:37]
2. Re-read the live `mcp-open-design` mandatory pairing and pseudocode to verify the current default and where the exemption bit enters. [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:21] [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:164] [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:171]
3. Re-read `tool_surface.md` and the design-gate manual playbook to compare the mutability-only "safe read" policy with the design-feeding read boundary. [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:44] [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:68] [SOURCE: .opencode/skills/mcp-open-design/manual_testing_playbook/05--design-gate/mandatory-design-gate.md:62]
4. Re-read the current `sk-design` context/proof cards and iteration 35 token sketch to check whether `skDesignGate` alone can also represent pure transport. [SOURCE: .opencode/skills/sk-design/shared/assets/context_loaded_card.md:45] [SOURCE: .opencode/skills/sk-design/shared/assets/proof_of_application_card.md:68] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/037-design-routing-and-integration-research/research/iterations/iteration-035.md:108]

## Findings

### Finding 1: A false default makes "unclassified" look like "pure transport"

Severity: P1. ENFORCEABLE-vs-ADVISORY label: ENFORCEABLE for a docs/schema lint and a guarded proxy or PreToolUse fixture; ADVISORY if a model merely promises it did not use the result for design.

The skill contract is stricter than the router signature. The prose says any generation or read that feeds a design decision must load `sk-design`, while pure transport is exempt only because it makes no design decision. [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:21] Phase detection repeats that RUN, or READ feeding a design decision, is a hard gate. [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:78] The pseudocode then asks the caller to supply `feeds_design_decision`, and `route_open_design_resources(request, feeds_design_decision: bool = False)` makes absence equivalent to "not design-feeding." [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:164] [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:171]

That default is the wrong fail state. For an ambiguous read, the safe states are not `true` or `false`; they are `design_authorized`, `transport_exempt`, and `unclassified`. `unclassified` must not be allowed to become design input. Iteration 34 already found the exemption is caller-asserted; this iteration pins the enforceable inversion: remove the false default, make purpose classification required at the guarded boundary, and treat missing purpose as `unclassified` with no design-use privilege. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/037-design-routing-and-integration-research/research/iterations/iteration-034.md:19] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/037-design-routing-and-integration-research/research/iterations/iteration-035.md:24]

Buildable recommendation: replace the boolean with a required purpose object in the later implementation backlog:

```json
{
  "openDesignPurpose": {
    "class": "unclassified | transport_exempt | design_authorized",
    "use": "wire | bare_inventory | diagnostic | design_grounding | artifact_review | generation",
    "token": "openDesignExemption | skDesignGate"
  }
}
```

Policy rule: absent or malformed `openDesignPurpose` becomes `unclassified`; `unclassified` may not feed a prompt, design-system choice, artifact critique, generation brief, or discovery-form answer. Only `transport_exempt` with a valid `openDesignExemption` can bypass `sk-design`, and only `design_authorized` with a valid `skDesignGate` can become design input.

### Finding 2: The current read-only surface has no positive proof that a read stayed pure transport

Severity: P1. ENFORCEABLE-vs-ADVISORY label: ENFORCEABLE for transcript replay where tool calls and receipts are captured; ADVISORY for unstated mental use outside a captured transcript.

`tool_surface.md` classifies eleven tools as read-only and says they are "always safe to surface." [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:42] [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:46] Section 3 then says those read-only tools can be called "without ceremony." [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:66] [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:68] The manual design-gate scenario needs a more precise invariant: a bare `list_projects` inventory must pass, but a `list_projects` call used to resolve design grounding must be blocked without `sk-design`; the boundary is use, not the tool name. [SOURCE: .opencode/skills/mcp-open-design/manual_testing_playbook/05--design-gate/mandatory-design-gate.md:49] [SOURCE: .opencode/skills/mcp-open-design/manual_testing_playbook/05--design-gate/mandatory-design-gate.md:54] [SOURCE: .opencode/skills/mcp-open-design/manual_testing_playbook/05--design-gate/mandatory-design-gate.md:62]

The missing primitive is a positive exemption token, not another negative claim. A pure transport read should emit a receipt that says: this output is allowed to exist without `sk-design`, but is forbidden as design grounding unless re-read or upgraded under `skDesignGate`.

Buildable recommendation: add an `openDesignExemption` token beside, not inside, `skDesignGate`:

```json
{
  "version": 1,
  "kind": "openDesignExemption",
  "purpose": "wire | bare_inventory | diagnostic",
  "toolName": "list_projects",
  "inputDigest": "sha256:...",
  "outputDigest": "sha256:...",
  "issuedAt": "ISO-8601",
  "expiresAt": "ISO-8601",
  "constraints": {
    "mayFeedDesignDecision": false,
    "mayBeCitedBySkDesignProof": false,
    "requiresReReadWithSkDesignGateForDesignUse": true
  }
}
```

Fixture rule: `list_projects` with no token and no `skDesignGate` is `unclassified`; it cannot be cited by a later design brief. `list_projects` with `openDesignExemption` may appear in a wiring or diagnostic transcript. `list_projects` with `skDesignGate` may become design grounding. This gives the exemption a positive, checkable token while preserving the hard gate.

### Finding 3: `skDesignGate` should not double as the pure-transport exemption

Severity: P2. ENFORCEABLE-vs-ADVISORY label: ENFORCEABLE for token shape, expiry, and lineage checks; ADVISORY for judging whether the resulting interface is actually good.

The existing `sk-design` context card proves design context was loaded before design decisions: it records surface, task type, register/dials, required files loaded, staged proof fields, and a LOADED/BLOCKED verdict. [SOURCE: .opencode/skills/sk-design/shared/assets/context_loaded_card.md:25] [SOURCE: .opencode/skills/sk-design/shared/assets/context_loaded_card.md:45] [SOURCE: .opencode/skills/sk-design/shared/assets/context_loaded_card.md:70] The proof-of-application card then checks that loaded context changed the output and that applicable proof fields pass before READY. [SOURCE: .opencode/skills/sk-design/shared/assets/proof_of_application_card.md:15] [SOURCE: .opencode/skills/sk-design/shared/assets/proof_of_application_card.md:35] [SOURCE: .opencode/skills/sk-design/shared/assets/proof_of_application_card.md:68]

Iteration 35's token sketch is therefore a positive authorization token for design work: expiry, surface, task type, workflow modes, loaded-file hashes, route telemetry, and proof digest. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/037-design-routing-and-integration-research/research/iterations/iteration-035.md:108] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/037-design-routing-and-integration-research/research/iterations/iteration-035.md:125] That is not the same as a pure-transport exemption. If one token tries to mean both "this may feed design" and "this must not feed design," a checker cannot enforce the boundary cleanly.

Buildable recommendation: keep two mutually exclusive token kinds:

- `skDesignGate`: positive authorization for design-feeding READ, RUN, artifact review, and discovery-form answers.
- `openDesignExemption`: positive exemption for WIRE, bare inventory, and diagnostics that explicitly may not feed design.

A proof checker or proxy can then reject mixed lineage: a proof-of-application card may cite `skDesignGate` receipts as Open Design design inputs, but must fail if it cites `openDesignExemption` output digests as design evidence. This is deterministic when receipts are captured; the advisory remainder is the visual/design-quality evaluation after the authorized path runs.

## Questions Answered

- Q3/D4: The deny-by-default mechanism needs two positive token classes. Missing classification is `unclassified`, not false. `openDesignExemption` proves pure transport and forbids later design use; `skDesignGate` proves `sk-design` was loaded and authorizes design-feeding use.
- Q5/all: The enforceable backlog item is a purpose-token policy plus replay fixtures over ambiguous reads. The advisory layer remains whether the final design outcome has good taste; the token only proves the correct routing and lineage boundary.

## Questions Remaining

- Which Open Design read tools are eligible for `openDesignExemption` at all? `list_projects` and wiring diagnostics are clear; `get_file`, `search_files`, and design-system reads may need to default to `design_authorized` or block because their output is commonly grounding material.
- Where should the token minting implementation live first: Codex PreToolUse sidecar metadata, a guarded MCP proxy that wraps Open Design tools, or a shared receipt generator consumed by both?
- How should an exempt read be upgraded if a later step discovers it actually needs design use: re-read under `skDesignGate`, or allow a hash-bound upgrade event that cites the original output digest?

## Next Focus

D4-A6 should classify the Open Design read surface by exemption eligibility: which tools can ever mint `openDesignExemption`, which must require `skDesignGate` by default, and which replay fixtures prove an exempt result cannot later become design grounding without a gated re-read.
