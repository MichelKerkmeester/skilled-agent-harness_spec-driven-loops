# Deep Review Strategy — Arc 009 Memory Leak Remediation

## Scope
Review arc 009 phase children `003` through `013` for correctness, security, traceability, and maintainability. The implementation surfaces are read-only; review iterations may write only under this `review/` directory.

The explicit target covers lifecycle and memory-leak remediation code for CLI dispatch containment, deep-loop locks and state repair, process sweep policy, CocoIndex cancel/remove lifecycle, Code Graph launcher and DB ownership, rerank sidecar and adapter cleanup, Spec Kit Memory runtime retention, regression/runbook closure, system-code-graph triage follow-ons, adapter RSS benchmark harnesses, and owner-lease heartbeat staleness.

## Dimensions
- Correctness: logic bugs, races, broken lifecycle guarantees, error handling, contract violations.
- Security: command injection, path traversal, secrets/env leakage, unsafe process ownership, denial of service.
- Traceability: spec/code/test alignment for REQ/SC fixtures and implementation-summary evidence.
- Maintainability: cohesion, naming, exported API stability, operational clarity, complexity hotspots.

## Success Criteria
- Findings are deduplicated by canonical fingerprint.
- Each finding has file:line evidence and an actionable remediation.
- No source, test, phase spec, or phase implementation file is modified by review iterations.
- Iteration markdown, JSONL delta, state log, registry, and dashboard remain replayable.
- Convergence continues until the orchestrator reaches the configured 10 iterations or the parent loop declares legal convergence.

## Prior Context Summary
Phases `003` and `004` introduced deep-loop executor recursion guards, process-group supervised async dispatch, loop locks, JSONL tail repair, and atomic state writes. Phases `005` and `006` added non-destructive process sweep planning plus CocoIndex active-work tracking, cancellation, bounded remove-project drain, and daemon task cleanup. Phases `007`, `011`, and `013` hardened Code Graph launcher/database ownership, closed broader suite failures, and added heartbeat-staleness reclaim. Phases `008` and `012` added rerank sidecar ledgering, adapter close paths, fallback RSS gates, and operator-deferred benchmark scripts. Phases `009` and `010` added Spec Kit Memory runtime retention caps, timer/shutdown hooks, final targeted regression evidence, and operator runbook closure.

## Review Boundaries
- In scope: code and tests shipped for arc 009 phase children `003` through `013`.
- Out of scope: source edits, remediation implementation, committing, branch changes, git mutation, and modifying any phase child docs.
- Known tool limit: memory and CocoIndex MCP retrieval may be unavailable; direct file reads and exact searches are acceptable fallback evidence for this iteration.

## Stop Conditions
- Parent orchestrator reaches max iterations.
- Parent orchestrator declares legal convergence.
- A read/write failure prevents required review artifacts from being written.
- Scope conflict would require modifying files outside `review/`.
