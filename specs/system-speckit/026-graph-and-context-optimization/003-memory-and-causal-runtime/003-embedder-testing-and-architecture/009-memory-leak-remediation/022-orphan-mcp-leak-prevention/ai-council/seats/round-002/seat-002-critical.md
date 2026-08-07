---
round: 2
seat: seat-002-critical
executor: simulated-cli-claude-code
lens: Critical
status: ok
timestamp: 2026-05-24T11:42:38.259Z
simulated: true
confidence: 94
---

# Seat 002: Critical / simulated cli-claude-code

## Proposed Plan
Block any real orphan MCP sweep until a fresh dry-run is reviewed as a conservative allowlist gate. Continue only when every kill/remove candidate is clearly an orphaned MCP artifact and no ambiguous or active resource appears in the candidate set.

## Reasoning
The highest-risk step is not strict-mode validation; it is the transition from dry-run to real sweep. The dry-run must be treated as a safety contract. If it includes active non-MCP servers, Ollama, `devin --print`, `/tmp/devin-*`, `/tmp/cli-devin-*`, `/tmp/codex-browser-use`, live Claude descendants, active non-MCP TCP listeners, cache directories, or ambiguous classes, the real sweep is blocked. This prevents collateral termination or deletion while still allowing supervised remediation when the candidate list is narrow and allowlisted.

## Risks
- An overly broad allowlist could hide dangerous candidates.
- Process state can change between dry-run and real sweep; the real run should be close in time to the reviewed dry-run.
- Ambiguous process labels or temp paths require a stop condition, not operator optimism.

## Gaps
- The actual fresh dry-run output is not persisted in this council round.
- The allowlist decision still requires human or top-level agent review before execution.

## Alternative
Skip the real sweep entirely and report validation plus dry-run findings only if any candidate class is ambiguous or out of scope.

## Confidence
94/100.
