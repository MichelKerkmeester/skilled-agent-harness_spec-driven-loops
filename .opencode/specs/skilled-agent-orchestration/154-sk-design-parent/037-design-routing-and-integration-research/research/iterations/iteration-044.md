# Iteration 44: D4-A13 - Daemon-Side Open Design Precondition

## Focus

[D4-A13 / D4] HTTP/fourth-surface escape: only a daemon-side precondition on the Open Design run/build boundary covers CLI, MCP, HTTP, and in-app Skills. The narrow question is whether the existing `sk-design` hard precondition is enforceable across every Open Design entry point, or whether MCP/Bash hooks leave an HTTP/Skills path around the gate.

newInfoRatio estimate: 0.70. Status: insight. ENFORCEABLE-vs-ADVISORY summary: daemon-side request classification and token validation are enforceable on captured four-surface fixtures; visual quality and user intent outside canonical token fields remain advisory.

## Actions Taken

1. Read the active strategy questions. Q3 asks for a deny-by-default content-bound token across MCP, CLI, HTTP, and automation, and Q4 asks how the contract survives into children and Open Design inner generation. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/037-design-routing-and-integration-research/research/deep-research-strategy.md:37] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/037-design-routing-and-integration-research/research/deep-research-strategy.md:38]
2. Re-read the Open Design skill contract, tool surface, CLI reference, and MCP wiring docs with the fourth-surface question in mind.
3. Compared this angle against iterations 42 and 43 so this pass did not repeat token freshness or scheduled automation findings. Iteration 42 already required freshness checks at token mint and tool boundary; iteration 43 already required schedule-time automation bindings. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/037-design-routing-and-integration-research/research/iterations/iteration-042.md:107] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/037-design-routing-and-integration-research/research/iterations/iteration-043.md:60]
4. Searched the local Open Design skill family for `DESIGN_PROOF_TOKEN`, `skDesignGate`, `openDesignGate`, `start_run`, HTTP, daemon, and precondition language to distinguish documented guidance from executable enforcement.

## Findings

### Finding 1: The documented Open Design surface has four daemon-backed entrances, so MCP-only or Bash-only enforcement is incomplete

Severity: P1. ENFORCEABLE-vs-ADVISORY label: ENFORCEABLE for daemon request denial on captured CLI/MCP/HTTP/Skills fixtures; ADVISORY for private inner-agent aesthetic reasoning after a valid run starts.

The Open Design skill states that one daemon exposes four interchangeable surfaces: the `od` CLI, the stdio MCP server, an HTTP API, and in-app Skills. [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:207] [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:209] The CLI reference confirms the HTTP API is a first-class transport over the same store, with `/api/projects` able to create a project plus pending message and `/api/mcp/install-info` exposing the canonical daemon config. [SOURCE: .opencode/skills/mcp-open-design/references/od_cli_reference.md:99] [SOURCE: .opencode/skills/mcp-open-design/references/od_cli_reference.md:101] [SOURCE: .opencode/skills/mcp-open-design/references/od_cli_reference.md:106] [SOURCE: .opencode/skills/mcp-open-design/references/od_cli_reference.md:107]

That means a precondition implemented only in a Codex PreToolUse hook, only in Bash command parsing, or only in an MCP proxy would not cover direct HTTP clients or in-app Skills. The transport docs even warn that the HTTP port is ephemeral and rediscovered from the socket or install-info, so the reachable endpoint is expected operational surface, not an accidental debug path. [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:259] [SOURCE: .opencode/skills/mcp-open-design/references/od_cli_reference.md:112]

Buildable recommendation: put the required `DESIGN_PROOF_TOKEN v1` check in the Open Design daemon's normalized run/build boundary, before the daemon spawns the inner generation agent or accepts a form response that fires the build. Client-side MCP/Bash/PreToolUse gates can remain early UX and defense-in-depth, but the daemon should be the first authoritative enforcement point because every surface converges there.

Fixture rule: replay four equivalent design-generation attempts - MCP `start_run`, CLI `od run start`, HTTP project/chat generation, and in-app Skills generation - against the daemon validator. Missing, expired, mismatched, or wrong-purpose tokens deny before turn 1/build. A valid token passes to the existing multi-turn flow. Pure transport endpoints pass without a design token.

### Finding 2: The current hard precondition is written as operator contract and pseudocode, not as a shared daemon invariant

Severity: P1. ENFORCEABLE-vs-ADVISORY label: ENFORCEABLE for converting the precondition into a daemon validator and replay suite; ADVISORY for prose-only agent compliance.

The skill is explicit that `mcp-open-design` is transport and `sk-design` is mandatory for any generation or design-feeding read. [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:19] [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:21] The routing pseudocode encodes the same idea: `design_gate()` blocks `RUN` and design-feeding `READ` by calling `require_sk_interface_design()`. [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:164] [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:168] [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:175]

But the local artifacts that validate the gate are manual or prompt-facing. The design-gate playbook says a negative RUN should be blocked before `start_run`, a design-feeding READ should be blocked, and pure transport should remain exempt. [SOURCE: .opencode/skills/mcp-open-design/manual_testing_playbook/05--design-gate/mandatory-design-gate.md:47] [SOURCE: .opencode/skills/mcp-open-design/manual_testing_playbook/05--design-gate/mandatory-design-gate.md:49] [SOURCE: .opencode/skills/mcp-open-design/manual_testing_playbook/05--design-gate/mandatory-design-gate.md:58] The feature catalog says the design step is blocked without `sk-design`, but again as skill guidance. [SOURCE: .opencode/skills/mcp-open-design/feature_catalog/03--grounding/design-system-grounding.md:20] [SOURCE: .opencode/skills/mcp-open-design/feature_catalog/03--grounding/design-system-grounding.md:30]

Buildable recommendation: keep the manual playbook as behavior spec, then add a daemon-level policy object such as `openDesignDesignPrecondition` with deterministic fields:

```json
{
  "version": "DESIGN_PROOF_TOKEN v1",
  "operationClass": "transport_inventory|design_grounding|design_generation|design_form_answer|design_artifact_write",
  "surface": "mcp|cli|http|skill|automation",
  "requiresToken": true,
  "tokenCarrier": "inputs.designProofToken|metadata.designProofToken|conversation.metadata.designProofToken",
  "denyOnMissingOrInvalid": true
}
```

The actual carrier should match the live schema, but the invariant should not depend on which client surface supplied it.

### Finding 3: The token carrier must be normalized before `start_run`, not hidden inside natural-language prompt text

Severity: P1. ENFORCEABLE-vs-ADVISORY label: ENFORCEABLE for structured token presence, digest, freshness, and operation-class checks; ADVISORY for whether the prompt prose aesthetically applies the design judgment after the structured check passes.

The generation docs expose structured fields around the run. The tool surface models the flow as `start_run(prompt, [skill], [agent], [model], [inputs])`; the CLI reference similarly names `start_run(prompt, [skill], [plugin], [inputs], [agent], [model])` and the CLI equivalent `od run start --project ... --message ... --plugin ... --agent ... --model ...`. [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:108] [SOURCE: .opencode/skills/mcp-open-design/references/od_cli_reference.md:183]

Prior D4 work already established that prompt/message text must carry the compiled design judgment, and iterations 42 and 43 established freshness and automation binding. This iteration adds the carrier constraint: the enforcement token should be structured daemon input or metadata, not another paragraph in `prompt` or `--message`, because the daemon cannot reliably distinguish proof from ordinary prompt text before spawning the inner model.

Buildable recommendation: define a normalized daemon request envelope before any generation or design-form-answer mutation:

```json
{
  "operation": "start_run|ui_respond|automation_fire|project_pending_generation",
  "surface": "mcp|cli|http|skill",
  "projectId": "string",
  "conversationId": "string|null",
  "compiledOpenDesignBriefDigest": "sha256:...",
  "compiledFormAnswersDigest": "sha256:null-or-value",
  "designProofToken": {
    "tokenId": "string",
    "subjectDigest": "sha256:...",
    "briefDigest": "sha256:...",
    "allowedOperations": ["start_run", "ui_respond"],
    "expiresAt": "ISO-8601"
  }
}
```

The daemon validator should compute digests from the actual outgoing message/form payload and compare them with token fields before forwarding to the inner agent. Fixture replay can be fully deterministic with captured envelopes and injected `now`.

### Finding 4: The daemon gate must preserve the pure-transport exemption by classifying operations, not by banning surfaces

Severity: P2. ENFORCEABLE-vs-ADVISORY label: ENFORCEABLE for operation-class allow/deny fixtures; ADVISORY for later human judgment about whether a read output is used in design reasoning.

The skill repeatedly preserves a pure-transport exemption: wiring the MCP server or listing bare inventory is exempt because it makes no design decision. [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:21] [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:275] The tool-surface reference surfaces read-only tools freely, including `list_projects`, `get_project`, `get_file`, `search_files`, `list_files`, `list_skills`, and `get_run`, while mutating operations are gated. [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:66] [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:70] [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:73] [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:77]

A daemon-side precondition should therefore not block all HTTP, all MCP, or all in-app Skills traffic. It should classify the operation and purpose: `transport_inventory` and wiring are allowed without design proof; `design_grounding`, `design_generation`, `design_form_answer`, and design-feeding artifact writes require a valid token.

Buildable recommendation: add operation-purpose fixtures: bare HTTP `/api/projects` list passes as inventory; the same project list marked or later upgraded as design grounding requires a token or a re-read under a token; `start_run` and `ui_respond` always require token when they can produce or shape UI. This keeps the exemption deterministic without letting "read-only" become a stealth design input.

## Questions Answered

- Q3/D4: The deny-by-default mechanism must be daemon-side for the run/build boundary. MCP hooks, Bash matchers, and agent skill contracts are useful early checks, but only the daemon sees CLI, MCP, HTTP, and in-app Skills after surface normalization.
- Q4/D5: The contract survives child executors and Open Design inner generation by carrying a structured `DESIGN_PROOF_TOKEN v1` plus compiled brief/form digests into the daemon request envelope. The daemon validates before the inner model starts; the inner model receives the compiled design judgment as payload, not as the enforcement authority.
- Q5/all: ENFORCEABLE backlog items are daemon request normalization, operation-class classification, token-required denial for generation/build/form-answer/design-feeding reads, pure-transport exemption fixtures, and four-surface replay. ADVISORY items are final visual taste and semantic intent outside canonical subject/brief/form fields.

## Questions Remaining

- What exact upstream daemon service function or route should host the validator for `start_run`, `od run start`, HTTP generation, and in-app Skills?
- Which live MCP `start_run` input schema field can carry structured token metadata without leaking Open Design source content into repo artifacts?
- How should the in-app Skills UI surface a missing-token refusal so it asks for `sk-design` proof instead of failing opaquely?
- Does standalone `od --no-open` on `127.0.0.1:7456` expose the same generation boundary and therefore the same validator hook point?

## Next Focus

D4-A14 should capture the daemon request schema and validator insertion point: live `tools/list` schema for `start_run`, the HTTP route or service handler that creates pending generation/build runs, and a minimal four-surface fixture format that proves one daemon precondition covers MCP, CLI, HTTP, in-app Skills, and the automation replay from iteration 43.
