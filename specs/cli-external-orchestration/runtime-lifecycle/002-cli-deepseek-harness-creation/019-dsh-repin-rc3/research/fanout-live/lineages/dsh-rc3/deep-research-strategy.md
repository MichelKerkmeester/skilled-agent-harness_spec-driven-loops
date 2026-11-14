---
title: Deep Research Strategy - dsh-rc3 route patches
description: Session tracking for the fan-out lineage reading .dsh/patches route declarations.
---

# Deep Research Strategy - dsh-rc3

## 1. OVERVIEW

### Purpose

Persistent brain for the `dsh-rc3` fan-out lineage. It records the route-patch question, the evidence path, and the stop condition for the single-iteration run.

### Usage

- Init populated Topic, Key Questions, Known Context, and Research Boundaries.
- The reducer refreshes machine-owned sections after the iteration.
- The lineage writes only inside its own artifact directory.

## 2. TOPIC

What do the checked-in route patches under `.dsh/patches/` declare for endpoint, model id and reasoning effort? Read the files and answer in under 150 words.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Which checked-in route patches under .dsh/patches/ declare an endpoint, model id and reasoning effort?
- [x] What endpoint, model id and reasoning effort does the llmgateway route patch declare?
- [x] What endpoint, model id and reasoning effort does the opencode-go route patch declare?
- [x] Do the remaining .dsh/patches/ files declare any routing values?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Do not modify, apply, stage, or commit any patch.
- Do not test endpoint reachability or use credentials.
- Do not audit the harness code beyond what the patch files declare.

---

## 5. STOP CONDITIONS

- Single iteration cap (`maxIterations: 1`), then synthesize regardless of convergence signals.
- Any attempt to write outside the lineage artifact directory.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Which checked-in route patches under .dsh/patches/ declare an endpoint, model id and reasoning effort?
- What endpoint, model id and reasoning effort does the llmgateway route patch declare?
- What endpoint, model id and reasoning effort does the opencode-go route patch declare?
- Do the remaining .dsh/patches/ files declare any routing values?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- reading all five small YAML files in full with line numbers made the answer direct and auditable; the `route-*` filename convention separated routing declarations from plugin/config patches without guessing. (iteration 1)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- nothing failed. Not verifying endpoints live was deliberate: the question asks what the files declare, and this lineage must not make network or credential calls outside the packet. (iteration 1)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Inferring a base default route: both route patches override `agent-default-model`; the base default is not declared in these files, so no claim is made about it. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Inferring a base default route: both route patches override `agent-default-model`; the base default is not declared in these files, so no claim is made about it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Inferring a base default route: both route patches override `agent-default-model`; the base default is not declared in these files, so no claim is made about it.

### Searching outside `.dsh/patches/` for route declarations: the question is explicitly scoped to the checked-in patches, and no other source was needed. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Searching outside `.dsh/patches/` for route declarations: the question is explicitly scoped to the checked-in patches, and no other source was needed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching outside `.dsh/patches/` for route declarations: the question is explicitly scoped to the checked-in patches, and no other source was needed.

### Treating `mcp-code-mode.patch.yml` as a route patch: it declares an MCP server (`serverName: code_mode`, `transport: stdio`) and no provider, endpoint, model, or reasoning keys. [SOURCE: .dsh/patches/mcp-code-mode.patch.yml:6] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating `mcp-code-mode.patch.yml` as a route patch: it declares an MCP server (`serverName: code_mode`, `transport: stdio`) and no provider, endpoint, model, or reasoning keys. [SOURCE: .dsh/patches/mcp-code-mode.patch.yml:6]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `mcp-code-mode.patch.yml` as a route patch: it declares an MCP server (`serverName: code_mode`, `transport: stdio`) and no provider, endpoint, model, or reasoning keys. [SOURCE: .dsh/patches/mcp-code-mode.patch.yml:6]

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Inferring a base default route: both route patches override `agent-default-model`; the base default is not declared in these files, so no claim is made about it. (iteration 1)
- Searching outside `.dsh/patches/` for route declarations: the question is explicitly scoped to the checked-in patches, and no other source was needed. (iteration 1)
- Treating `mcp-code-mode.patch.yml` as a route patch: it declares an MCP server (`serverName: code_mode`, `transport: stdio`) and no provider, endpoint, model, or reasoning keys. [SOURCE: .dsh/patches/mcp-code-mode.patch.yml:6] (iteration 1)

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
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

- `.dsh/patches/` contains five checked-in patch files: `guards.patch.yml`, `lineage.patch.yml`, `mcp-code-mode.patch.yml`, `route-llmgateway-deepseek.patch.yml`, and `route-opencode-go-deepseek.patch.yml`.
- Only the two `route-*.patch.yml` files are named as route patches; the other three configure plugins, session/telemetry disables, and an MCP server.
- Research was read-only against the patch files; the write surface is the lineage artifact directory only.

## 13. RESEARCH BOUNDARIES

- Max iterations: 1
- Convergence threshold: 0.05 (not reached; max-iterations cap governs)
- Per-iteration budget: 24 tool calls
- Progressive synthesis: true
- `research.md` ownership: workflow-owned canonical synthesis output for this lineage
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred)
- Question injection surface: packet-local `inbox.jsonl` (not used)
- Current generation: 1
- Started: 2026-11-14T13:20:45.000Z
