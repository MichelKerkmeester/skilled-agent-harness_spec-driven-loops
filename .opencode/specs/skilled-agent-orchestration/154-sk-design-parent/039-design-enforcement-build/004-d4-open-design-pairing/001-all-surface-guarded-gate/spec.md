---
title: "D4-R1 — All-surface authoritative run/build gate via guarded proxy"
description: "Add a guarded MCP/HTTP proxy + openDesignDesignPrecondition validator that normalizes every surface before build-fire, anchored at mcp-open-design/SKILL.md."
trigger_phrases:
  - "d4-r1 guarded proxy gate"
  - "all-surface gate design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D4-R1 — All-surface authoritative run/build gate via guarded proxy

## 1. OBJECTIVE
Stand up a guarded MCP/HTTP proxy plus an `openDesignDesignPrecondition` validator that normalizes MCP, CLI, HTTP, and Skills requests into one canonical request shape and enforces the deny-by-default precondition before any inner-agent spawn or build-fire.

## 2. WHY
One daemon backs four interchangeable surfaces, so no single hook covers them all. The only convergent chokepoint is the run/build boundary; absent a guarded proxy there, any surface can fire a design build with no precondition check.

## 3. TARGET & CLASS
- **Target file(s):** new `.opencode/skills/mcp-open-design/references/guarded_proxy.md` + policy; anchored at `.opencode/skills/mcp-open-design/SKILL.md:209`
- **Severity:** P0
- **Enforcement class:** enforceable
- **Dimension:** D4 — mcp-open-design Pairing

## 4. BUILD OUTLINE
- Define the guarded proxy boundary and the request-normalization contract across MCP/CLI/HTTP/Skills.
- Implement `openDesignDesignPrecondition` as the deny-by-default validator invoked before inner-agent spawn / build-fire.
- Wire the proxy reference + policy into `mcp-open-design`, leaving the daemon-side residual explicitly out of scope.
- **Candidate nested sub-phases (materialize at execution):** (a) proxy transport + request normalizer; (b) `openDesignDesignPrecondition` validator core; (c) per-surface adapters (MCP / HTTP / CLI / Skills) feeding the validator.

## 5. ACCEPTANCE
- A design-feeding/mutating Open Design call without a valid fresh token is DENIED at the proxy on every wired surface (MCP, HTTP, CLI, Skills), with the residual daemon-side bypass named, not silently passed.

## 6. EVIDENCE
- `.opencode/skills/mcp-open-design/SKILL.md:209` — one daemon backing four interchangeable surfaces, forcing enforcement at the convergent boundary.
- Source: `research/research.md` §7 (D4-R1)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
