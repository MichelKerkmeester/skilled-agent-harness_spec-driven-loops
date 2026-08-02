---
title: Deep Research Strategy Template
description: Runtime template copied to research/ during initialization to track research progress, focus decisions, and outcomes across iterations.
trigger_phrases:
  - "deep research strategy"
  - "research strategy template"
  - "research session tracking"
  - "exhausted research approaches"
  - "research stop conditions"
  - "ruled out research directions"
importance_tier: normal
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - Session Tracking Template

Runtime template copied to `{spec_folder}/research/` during initialization. Tracks research progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep research session. Records what to investigate, what worked, what failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{spec_folder}/research/deep-research-strategy.md` and populates Topic, Key Questions, Known Context, and Research Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus.
- **Mutability:** Mutable — analyst-owned sections remain stable, while machine-owned sections are rewritten by the reducer after each iteration. Section 3 is a generated projection from the reducer registry.
- **Protection:** Shared state with explicit ownership boundaries. Orchestrator validates consistency on resume.

### Question Injection Surface

Use `{spec_folder}/research/inbox.jsonl` to append external questions during an active run. Each line is one JSON object with:

- `id`: stable inbox record identifier
- `text`: question text to promote
- `source`: concrete source label, such as an angle bank entry, analyst strategy, or operator note
- `origin`: one of `angle-bank`, `analyst-strategy`, `operator`, or `legacy-import`
- `injectedAtIteration`: iteration number when the question was introduced
- `promotedQuestionId`: promoted registry question id, or `null` until promotion

The reducer reads the inbox on every reduce step and carries `origin` into the question registry and dashboard badges. Direct edits to Section 3 still work as a compatibility path, but they are attributed as `legacy-import`.

Question ownership is explicit:

- Inbox rows are immutable input.
- The reducer registry is canonical question state.
- Section 3 is rendered only from the registry view.

When an inbox row targets an existing registry question but carries different text, the reducer keeps the registry value, records `operatorDecision: needs_decision`, and appends a `question_conflict` event with both `inboxValue` and `registryValue`.

---

## 2. TOPIC
Webflow MCP 2.0 capabilities, authentication, safety boundaries, and mcp-tooling integration

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] What capabilities and tool surfaces does Webflow MCP 2.0 document?
- [ ] How are authentication, authorization, scopes, and credentials handled?
- [x] What safety boundaries and mutating-operation risks are documented?
- [x] How should the existing mcp-tooling architecture integrate it safely?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
Implementation, deployment, credential provisioning, and unsupported claims are out of scope.

---

## 5. STOP CONDITIONS
Run all five configured iterations unless a hard failure, pause, or unrecoverable state condition occurs.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- What capabilities and tool surfaces does Webflow MCP 2.0 document?
- What safety boundaries and mutating-operation risks are documented?
- How should the existing mcp-tooling architecture integrate it safely?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Official MCP overview/how-it-works pages plus local hub/config inspection triangulated product capability, transport, governance, and repository fit. (iteration 1)
- Comparing the registry/router contracts with two existing remote transport packets exposed the exact fields and safety posture Webflow must inherit, while official documentation supplied the Bridge-specific state model. (iteration 2)
- Re-reading the official overview and architecture page with a mutation/Bridge-specific lens separated provider limitations, live-Designer requirements, and caller-owned safety controls. (iteration 3)
- Action-level official tool references exposed distinctions that the overview alone does not show, especially write classification and irreversible/publish semantics. (iteration 4)
- Reading the official architecture page together with the documentation index exposed resource and instruction surfaces that were not covered by the prior mutation-only pass, while the local playbook grounded the caller-owned safety conclusion. (iteration 5)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- The guessed MCP authentication URL was unavailable, preventing exact scope and connector-flow confirmation. (iteration 1)
- A live Webflow manual/discovery probe was unavailable in this iteration, so callable names, schemas, and exact OAuth behavior cannot be asserted. (iteration 2)
- Repository search found no Webflow-specific live discovery fixture, so callable-level schemas and confirmation metadata could not be verified. (iteration 3)
- Live callable discovery was unavailable, so exact runtime names and schemas could not be verified. (iteration 4)
- No authenticated Webflow manual exists in the bound packet, so exact callable schemas and provider confirmation metadata could not be verified. (iteration 5)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A local-mutating `workflow` classification was ruled out because the remote MCP server is the external execution surface and the repository's transport axis defines workspace mutation as false. [SOURCE: .opencode/skills/mcp-tooling/mode-registry.json:18-29] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A local-mutating `workflow` classification was ruled out because the remote MCP server is the external execution surface and the repository's transport axis defines workspace mutation as false. [SOURCE: .opencode/skills/mcp-tooling/mode-registry.json:18-29]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A local-mutating `workflow` classification was ruled out because the remote MCP server is the external execution surface and the repository's transport axis defines workspace mutation as false. [SOURCE: .opencode/skills/mcp-tooling/mode-registry.json:18-29]

### Adding Webflow as an unregistered ad hoc native MCP call was ruled out by the hub's registry-driven routing and Code Mode ownership contracts. [SOURCE: .opencode/skills/mcp-tooling/SKILL.md:41-66] [SOURCE: .opencode/skills/mcp-code-mode/SKILL.md:18-23] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Adding Webflow as an unregistered ad hoc native MCP call was ruled out by the hub's registry-driven routing and Code Mode ownership contracts. [SOURCE: .opencode/skills/mcp-tooling/SKILL.md:41-66] [SOURCE: .opencode/skills/mcp-code-mode/SKILL.md:18-23]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding Webflow as an unregistered ad hoc native MCP call was ruled out by the hub's registry-driven routing and Code Mode ownership contracts. [SOURCE: .opencode/skills/mcp-tooling/SKILL.md:41-66] [SOURCE: .opencode/skills/mcp-code-mode/SKILL.md:18-23]

### Claiming provider-enforced confirmation or dry-run behavior remains unsupported by the consulted references. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works.md] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Claiming provider-enforced confirmation or dry-run behavior remains unsupported by the consulted references. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works.md]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Claiming provider-enforced confirmation or dry-run behavior remains unsupported by the consulted references. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works.md]

### Claiming provider-enforced confirmation or dry-run behavior; no such per-tool contract was found in the consulted official MCP pages. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Claiming provider-enforced confirmation or dry-run behavior; no such per-tool contract was found in the consulted official MCP pages.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Claiming provider-enforced confirmation or dry-run behavior; no such per-tool contract was found in the consulted official MCP pages.

### Claiming provider-enforced confirmation, dry-run, or per-tool safety metadata without a published contract; the remaining conclusion is caller-owned policy. [SOURCE: https://developers.webflow.com/mcp] [INFERENCE: based on the reviewed official documentation] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Claiming provider-enforced confirmation, dry-run, or per-tool safety metadata without a published contract; the remaining conclusion is caller-owned policy. [SOURCE: https://developers.webflow.com/mcp] [INFERENCE: based on the reviewed official documentation]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Claiming provider-enforced confirmation, dry-run, or per-tool safety metadata without a published contract; the remaining conclusion is caller-owned policy. [SOURCE: https://developers.webflow.com/mcp] [INFERENCE: based on the reviewed official documentation]

### Generic `design`/`CMS` routing vocabulary was ruled out because it would overlap existing modes and violate the hub's provider-specific scoring/defer contract. [SOURCE: .opencode/skills/mcp-tooling/hub-router.json:27-31] [SOURCE: .opencode/skills/mcp-tooling/hub-router.json:105-119] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Generic `design`/`CMS` routing vocabulary was ruled out because it would overlap existing modes and violate the hub's provider-specific scoring/defer contract. [SOURCE: .opencode/skills/mcp-tooling/hub-router.json:27-31] [SOURCE: .opencode/skills/mcp-tooling/hub-router.json:105-119]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Generic `design`/`CMS` routing vocabulary was ruled out because it would overlap existing modes and violate the hub's provider-specific scoring/defer contract. [SOURCE: .opencode/skills/mcp-tooling/hub-router.json:27-31] [SOURCE: .opencode/skills/mcp-tooling/hub-router.json:105-119]

### Live callable discovery was unavailable in this iteration; no guessed tool name or schema was promoted. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Live callable discovery was unavailable in this iteration; no guessed tool name or schema was promoted.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Live callable discovery was unavailable in this iteration; no guessed tool name or schema was promoted.

### Retrying the guessed MCP authentication URL; prior strategy marks it blocked, and the official overview/how-it-works pages now supply the relevant workspace and remote-authentication constraints. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Retrying the guessed MCP authentication URL; prior strategy marks it blocked, and the official overview/how-it-works pages now supply the relevant workspace and remote-authentication constraints.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Retrying the guessed MCP authentication URL; prior strategy marks it blocked, and the official overview/how-it-works pages now supply the relevant workspace and remote-authentication constraints.

### The first attempted Magnific wiring-reference path did not exist in that packet; the available `SKILL.md` architecture contract and the structurally parallel Mobbin wiring reference supplied the needed transport comparison. [SOURCE: .opencode/skills/mcp-tooling/mcp-magnific/SKILL.md:28-40] [SOURCE: .opencode/skills/mcp-tooling/mcp-mobbin/references/mcp-wiring.md:23-42] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: The first attempted Magnific wiring-reference path did not exist in that packet; the available `SKILL.md` architecture contract and the structurally parallel Mobbin wiring reference supplied the needed transport comparison. [SOURCE: .opencode/skills/mcp-tooling/mcp-magnific/SKILL.md:28-40] [SOURCE: .opencode/skills/mcp-tooling/mcp-mobbin/references/mcp-wiring.md:23-42]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The first attempted Magnific wiring-reference path did not exist in that packet; the available `SKILL.md` architecture contract and the structurally parallel Mobbin wiring reference supplied the needed transport comparison. [SOURCE: .opencode/skills/mcp-tooling/mcp-magnific/SKILL.md:28-40] [SOURCE: .opencode/skills/mcp-tooling/mcp-mobbin/references/mcp-wiring.md:23-42]

### The guessed Webflow MCP authentication page `https://developers.webflow.com/mcp/reference/authentication` returned Page Not Found; the general Data API authentication guide was used as the bounded fallback. The MCP-specific authorization details need a narrower follow-up against the official getting-started/OAuth links. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: The guessed Webflow MCP authentication page `https://developers.webflow.com/mcp/reference/authentication` returned Page Not Found; the general Data API authentication guide was used as the bounded fallback. The MCP-specific authorization details need a narrower follow-up against the official getting-started/OAuth links.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The guessed Webflow MCP authentication page `https://developers.webflow.com/mcp/reference/authentication` returned Page Not Found; the general Data API authentication guide was used as the bounded fallback. The MCP-specific authorization details need a narrower follow-up against the official getting-started/OAuth links.

### Treating Bridge absence as a transport outage or requiring the Bridge for all mutations; official documentation separates live-Designer capabilities from Data API-backed operations. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating Bridge absence as a transport outage or requiring the Bridge for all mutations; official documentation separates live-Designer capabilities from Data API-backed operations. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating Bridge absence as a transport outage or requiring the Bridge for all mutations; official documentation separates live-Designer capabilities from Data API-backed operations. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works]

### Treating every mutation as Bridge-dependent; official documentation explicitly separates Data API-backed mutations from live-Designer operations. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating every mutation as Bridge-dependent; official documentation explicitly separates Data API-backed mutations from live-Designer operations. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating every mutation as Bridge-dependent; official documentation explicitly separates Data API-backed mutations from live-Designer operations. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works]

### Treating every Webflow mutation as Bridge-dependent was not supported by the official separation between Data API and live Designer capabilities. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works.md] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating every Webflow mutation as Bridge-dependent was not supported by the official separation between Data API and live Designer capabilities. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works.md]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating every Webflow mutation as Bridge-dependent was not supported by the official separation between Data API and live Designer capabilities. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works.md]

### Treating MCP resources or Agent Instructions as callable tool schemas; the official architecture distinguishes resources from tools. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating MCP resources or Agent Instructions as callable tool schemas; the official architecture distinguishes resources from tools. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating MCP resources or Agent Instructions as callable tool schemas; the official architecture distinguishes resources from tools. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works]

### Treating Webflow MCP as a CMS-only integration was ruled out by the official capability inventory. [SOURCE: https://developers.webflow.com/mcp] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating Webflow MCP as a CMS-only integration was ruled out by the official capability inventory. [SOURCE: https://developers.webflow.com/mcp]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating Webflow MCP as a CMS-only integration was ruled out by the official capability inventory. [SOURCE: https://developers.webflow.com/mcp]

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Adding Webflow as an unregistered ad hoc native MCP call was ruled out by the hub's registry-driven routing and Code Mode ownership contracts. [SOURCE: .opencode/skills/mcp-tooling/SKILL.md:41-66] [SOURCE: .opencode/skills/mcp-code-mode/SKILL.md:18-23] (iteration 1)
- The guessed Webflow MCP authentication page `https://developers.webflow.com/mcp/reference/authentication` returned Page Not Found; the general Data API authentication guide was used as the bounded fallback. The MCP-specific authorization details need a narrower follow-up against the official getting-started/OAuth links. (iteration 1)
- Treating Webflow MCP as a CMS-only integration was ruled out by the official capability inventory. [SOURCE: https://developers.webflow.com/mcp] (iteration 1)
- A local-mutating `workflow` classification was ruled out because the remote MCP server is the external execution surface and the repository's transport axis defines workspace mutation as false. [SOURCE: .opencode/skills/mcp-tooling/mode-registry.json:18-29] (iteration 2)
- Generic `design`/`CMS` routing vocabulary was ruled out because it would overlap existing modes and violate the hub's provider-specific scoring/defer contract. [SOURCE: .opencode/skills/mcp-tooling/hub-router.json:27-31] [SOURCE: .opencode/skills/mcp-tooling/hub-router.json:105-119] (iteration 2)
- The first attempted Magnific wiring-reference path did not exist in that packet; the available `SKILL.md` architecture contract and the structurally parallel Mobbin wiring reference supplied the needed transport comparison. [SOURCE: .opencode/skills/mcp-tooling/mcp-magnific/SKILL.md:28-40] [SOURCE: .opencode/skills/mcp-tooling/mcp-mobbin/references/mcp-wiring.md:23-42] (iteration 2)
- Claiming provider-enforced confirmation or dry-run behavior; no such per-tool contract was found in the consulted official MCP pages. (iteration 3)
- Retrying the guessed MCP authentication URL; prior strategy marks it blocked, and the official overview/how-it-works pages now supply the relevant workspace and remote-authentication constraints. (iteration 3)
- Treating every mutation as Bridge-dependent; official documentation explicitly separates Data API-backed mutations from live-Designer operations. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works] (iteration 3)
- Claiming provider-enforced confirmation or dry-run behavior remains unsupported by the consulted references. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works.md] (iteration 4)
- Live callable discovery was unavailable in this iteration; no guessed tool name or schema was promoted. (iteration 4)
- Treating every Webflow mutation as Bridge-dependent was not supported by the official separation between Data API and live Designer capabilities. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works.md] (iteration 4)
- Claiming provider-enforced confirmation, dry-run, or per-tool safety metadata without a published contract; the remaining conclusion is caller-owned policy. [SOURCE: https://developers.webflow.com/mcp] [INFERENCE: based on the reviewed official documentation] (iteration 5)
- Treating Bridge absence as a transport outage or requiring the Bridge for all mutations; official documentation separates live-Designer capabilities from Data API-backed operations. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works] (iteration 5)
- Treating MCP resources or Agent Instructions as callable tool schemas; the official architecture distinguishes resources from tools. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works] (iteration 5)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Exact MCP OAuth authorization flow, scope names, workspace/site selection, and reconnect/revocation behavior. (iteration 1)
- Detailed safety treatment for each mutating tool, including publish/delete/custom-code confirmation expectations. (iteration 1)
- Concrete repository packet design: registry keys, remote transport configuration, Code Mode discovery, routing vocabulary, and validation/playbook coverage. (iteration 1)
- Exact OAuth authorization UX, scope names, workspace selection/revocation behavior, and whether `mcp-remote` requires any Webflow-specific flags. (iteration 2)
- Exact Webflow MCP manual object shape after live Code Mode registration and the actual discovered callable names/schemas. (iteration 2)
- Per-tool mutation confirmation semantics and the complete list of Bridge-dependent tools. (iteration 2)
- A live Code Mode `list_tools`/`tool_info` result is still needed to confirm callable names and detect documentation drift. (iteration 4)
- Exact MCP OAuth scope names, authorization UX, workspace selection, and reconnect/revocation behavior remain unresolved. (iteration 4)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Exact MCP OAuth scope names, authorization UX, workspace selection, and reconnect/revocation behavior remain unresolved.

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
No prior Spec Kit Memory context was available in this executor; repository evidence is gathered by the LEAF iterations.

### Bounded Context Snapshot

Populate during initialization when the target is codebase-scoped. Keep this pointer-based and small:

- Source pointers: paths, symbols, or resource-map entries relevant to the topic.
- Reuse candidates: existing utilities, patterns, docs, or agents worth extending.
- Integration points: files or contracts the research is likely to touch.
- Constraints and risks: scope limits, stale graph or memory gaps, and known non-goals.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use `@context` for one-shot retrieval, and use this snapshot only to seed the research loop.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5
- Convergence threshold: 0.05
- Per-iteration budget: [from config.maxToolCallsPerIteration] tool calls, [from config.maxMinutesPerIteration] minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `{spec_folder}/research/inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.opencode/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability matrix doc: `.opencode/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Capability resolver: `.opencode/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-08-02T18:13:47.937Z
