---
title: Deep Research Strategy — Refero MCP Luna Lineage
description: Detached fan-out lineage strategy for the Refero MCP developer-surface investigation.
---

# Deep Research Strategy — Refero MCP Luna Lineage

## 1. OVERVIEW

This is a detached `cli-codex` lineage. State is externalized in this packet; the reducer owns machine-managed sections after each iteration.

## 2. TOPIC

Refero MCP developer surface for an mcp-tooling transport mode, including the Refero MCP server, official `refero_skill` repository, search workflows, auth, limits, pricing gates, and constraints for a read-only Code Mode transport paired with `sk-design` judgment.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] What is the complete Refero MCP tool inventory and each tool's input/output contract?
- [ ] How does authentication work through `mcp-remote`, and what rate limits apply?
- [ ] What UI-reference search workflows does `refero_skill` document for apps, screens, flows, and elements?
- [ ] What differs between free and paid Refero access?
- [ ] What transport-packet constraints follow from the existing manual, read-only Code Mode surface, and `sk-design` pairing?

<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS

- Do not modify `.utcp_config.json`, `.opencode/skills/**`, hub routing, or downstream packet-authoring files.
- Do not implement the `mcp-refero` transport packet during research.
- Do not treat undocumented live behavior as a guaranteed contract.

## 5. STOP CONDITIONS

- Run exactly three iterations for this forced-depth lineage; convergence before the cap is telemetry only.
- Synthesis must preserve uncertainty and identify gaps where live probing or account-tier evidence is unavailable.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- The GitHub skill’s `references/mcp-tools.md` should be reconciled against current docs during authoring; its older parameter/response examples must not be copied as current contracts. (iteration 1)
- Live endpoint `tools/list` schema and actual unauthenticated/OAuth challenge behavior remain unverified due to DNS failure in this environment. (iteration 1)
- Whether `mcp-remote` itself persists OAuth credentials in the target runtime, and the exact CLI flags needed for static Bearer headers, should be verified during packet installation testing. (iteration 1)
- A live `tools/list` response and actual Refero OAuth challenge remain unverified because the API hostname was not reachable in this environment. (iteration 2)
- A real installation test against the target host remains unperformed; the exact upstream flags are verified from documentation, but client-specific packaging/caching behavior is not. (iteration 2)
- No authoritative per-minute, concurrency, or per-tool Refero rate limit was found. (iteration 2)
- Exact Refero throttling beyond the documented monthly quota remains undocumented. (iteration 3)
- A real installation against the target host, including package/cache behavior, client argument escaping, and persistence across runtime restarts, remains unperformed. (iteration 3)
- The apparent four-tool search-index extract versus the current eight-tool detailed page should be rechecked during packet authoring or installation-time schema inspection. (iteration 3)
- Live endpoint `tools/list` and the actual OAuth challenge remain unverified because the API hostname was unreachable in this environment. (iteration 3)

<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Live endpoint `tools/list` and the actual OAuth challenge remain unverified because the API hostname was unreachable in this environment.

<!-- /ANCHOR:next-focus -->

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

- Pinned product source: `.opencode/specs/mcp-tooling/009-mcp-refero/001-research/context/website-link.md` → `https://refero.design/mcp`.
- Pinned official repository: `.opencode/specs/mcp-tooling/009-mcp-refero/001-research/context/website-link.md` → `https://github.com/referodesign/refero_skill`.
- Existing local manual: `.utcp_config.json:148-163`, using `npx -y mcp-remote https://api.refero.design/mcp` over stdio.
- Downstream boundary: research only; packet authoring is a later phase.

## 13. RESEARCH BOUNDARIES

- Max iterations: 3
- Convergence threshold: 0.05
- Stop policy: max-iterations; early convergence is telemetry only.
- Per-iteration budget: 12 tool calls, 10 minutes.
- Allowed lineage output root: this `luna` packet only.
