---
title: "032 substrate-repair-followups (phase parent)"
description: "Phase parent for the 5 approved follow-ups to 022-local-llm-legacy-remediation's substrate-repair work. Each child is a focused unit shipped via a fresh cli-codex gpt-5.5 high fast dispatch. Wave 1 (001/003/004) runs in parallel; Wave 2 (002/005) runs sequentially after Wave 1 lands."
trigger_phrases:
  - "032 substrate repair followups"
  - "post-022 ephemeral-governance decouple"
  - "post-022 scenario re-run validation"
  - "post-022 mcp server build fix"
  - "post-022 failed embedding cleanup"
  - "post-022 substrate stability instrumentation"
importance_tier: "important"
status: "in_progress"
---

# 032 — Substrate-repair Follow-ups (Phase Parent)

## Root purpose

The 022 packet repaired the local-LLM Memory MCP substrate after the chronic E081 save failure. Three high-value fixes shipped inline (retry-throughput env knob, E081 → classified codes, scenario doc cleanup). Five follow-ups were flagged in 022's `ai-council/embedding-worker-diagnostic/post-execution-followup.md` and approved by the user:

1. Implement ADR-002 Option A (decouple `retentionPolicy: "ephemeral"` from governed-ingest enforcement)
2. Re-run the full 15-scenario 24-- suite end-to-end against the post-fix substrate
3. Fix the broken `mcp_server` `npm run build` (3 MCP SDK "Cannot find module" errors)
4. Clean up the remaining 24 historical failed embeddings
5. Add substrate-stability instrumentation (RSS log, circuit-flapping flag, threshold doc)

Each follow-up gets a dedicated child packet + a fresh cli-codex agent (gpt-5.5 high fast). Waves respect the practical 3-4 concurrent codex ceiling.

## Child inventory

| # | Child | Wave | Depends on | Status |
|---|-------|------|-----------|--------|
| 001 | governance-retention-decouple | 1 | — | planned |
| 002 | rerun-24-scenarios-suite | 2 | 001 (recommended); stable substrate | planned |
| 003 | mcp-server-build-fix | 1 | — | planned |
| 004 | failed-embedding-cleanup | 1 | — | planned |
| 005 | substrate-stability-instrumentation | 2 | — | planned |

## Wave plan

**Wave 1** — 3 parallel codex dispatches (Wave-1 children are independent code work):
- 001-governance-retention-decouple
- 003-mcp-server-build-fix
- 004-failed-embedding-cleanup

**Wave 2** — 2 sequential codex dispatches (after Wave 1 implementation-summaries are filled):
- 002-rerun-24-scenarios-suite
- 005-stability-instrumentation

## Parent-level invariants

- Each child runs as ONE codex dispatch with pre-bound Gate 3 + inline-contract binding trace.
- Each child writes its own `implementation-summary.md` + marks `checklist.md` with evidence.
- No child calls another CLI from within its dispatch.
- All sandbox dirs created by a child must be removed by that child before the dispatch ends.
- `npm run build` may stay broken during Wave 1 (003 lands it); children that need dist files should dual-patch (TS source + JS dist) during Wave 1.

## Completion criteria

- All 5 children: `derived.status: complete`
- All 5 `implementation-summary.md` files filled (real content, not template)
- All 5 `checklist.md` files marked with evidence
- Parent's own `derived.status: complete` once children land
- Final handover.md at parent root summarizing PASS/FAIL across the 5 children + the 15 scenarios (from 002)

## References

- Parent (022) substrate-repair narrative: `../022-local-llm-legacy-remediation/implementation-summary.md`
- Council findings: `../022-local-llm-legacy-remediation/ai-council/embedding-worker-diagnostic/{seat-statements,cross-critique,convergence,decision-record,post-execution-followup}.md`
- ADR-002 (the governance-trigger decoupling, implemented by child 001): `../022-local-llm-legacy-remediation/ai-council/embedding-worker-diagnostic/adr-002-decouple-retention-from-governance.md`
- Original substrate fixes shipped: `b3363483c`, `7fbed77c8`, `4e5ee2dda`, `0eabd6d14`
