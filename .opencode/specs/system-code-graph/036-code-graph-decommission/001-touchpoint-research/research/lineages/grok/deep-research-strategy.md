---
title: Deep Research Strategy - code-graph decommission touchpoints (grok lineage)
description: Fan-out lineage strategy — COMPLETE (max_iterations).
importance_tier: important
contextType: research
version: 1.0.0.1
---

# Deep Research Strategy - Session Tracking

## 1. OVERVIEW

Fan-out lineage `grok` COMPLETE under `stopPolicy: max-iterations` (5/5).

## 2. TOPIC

Exhaustive touchpoint inventory for fully decommissioning the system-code-graph skill and the mk_code_index MCP server (see config.topic for full charter including sweep/symlink/archival constraints).

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

(none — all resolved)
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Implementing removals outside this lineage directory.
- Editing `.opencode/specs/**`, changelogs, or benchmark reports.
- Counting symlink aliases as independent mutation targets.
- Deleting deep-loop coverage-graph.
- Early synthesis under max-iterations stopPolicy.

---

## 5. STOP CONDITIONS

- maxIterations (5) reached — **met**.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

- [x] Q1 Physical MCP registrations after symlink dedupe (iter 1)
- [x] Q2 Agent/hook/doctrine/doctor grants (iter 2–4)
- [x] Q3 Import/CI/boundary/script spine (iter 3)
- [x] Q4 Ordering + rollback (iter 5)
- [x] Q5 Archival/symlink/false-positive classification (iter 1,3,4)
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED

- `rg --hidden --no-ignore` + symlink realpath (iter 1)
- Multi-runtime agent/hook matrix sweeps (iter 2)
- Boundary + isolation-check + lifecycle script tracing (iter 3)
- Bucket taxonomy of 384 live-hit paths (iter 4)
- Staged ordering graph synthesizing prior evidence (iter 5)
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED

- Unbounded first `-l` tee produced inflated line count (145894); filtered recount required (iter 1)
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

### Visible-only rg -- BLOCKED
- Do NOT retry: sweeps without `--hidden --no-ignore`
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS

- Symlink aliases as distinct edits
- Delete coverage-graph with mk_code_index
- Edit archival specs/changelogs/benchmarks
- Big-bang skill delete
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER

- Completed pivots: 0
- Saturated: registration, grants, dependencies, classification, ordering
- Remaining frontier: parent fan-out merge + phase 002 ADR
<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS

- Cross-machine `.env.local` prevalence (operator-local; not blocking)
- Parent merge of sol/grok(/other) lineages for conflicting counts
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

N/A — COMPLETE. Parent synthesizes lineages; successor phase owns decision-record.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

See iterations 001–005 and `research.md`. `resource_map_present` at packet root was false; lineage emitted `resource-map.md`.

## 13. RESEARCH BOUNDARIES

- Max iterations: 5 — reached
- Stop: max_iterations @ 2026-07-27T18:31:29Z
- Artifact dir: research/lineages/grok
