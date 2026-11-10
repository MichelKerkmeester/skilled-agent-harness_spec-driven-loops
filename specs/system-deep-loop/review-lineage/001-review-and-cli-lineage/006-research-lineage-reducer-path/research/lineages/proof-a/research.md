---
title: "Research: Which packet file documents the deep-research reducer's --artifact-dir flag, and the missing-value exit code"
description: "Synthesis of the proof-a lineage's single iteration: implementation-summary.md documents the flag; a missing --artifact-dir value exits 1 in the deep-research reducer."
trigger_phrases:
  - "research lineage reducer path proof-a synthesis"
  - "artifact-dir documentation"
date: "2026-10-09"
lineage: "proof-a"
sessionId: "fanout-proof-a-1791561073753-7hht4d"
stopReason: "maxIterationsReached"
---

# Research: Which packet file documents the deep-research reducer's `--artifact-dir` flag, and the missing-value exit code

**Topic**: Which file in this packet documents the deep-research reducer's `--artifact-dir` flag, and what exit code does a missing value produce? Answer from the packet's own docs and the reducer source only.

**Scope**: Packet `specs/system-deep-loop/038-review-and-cli-lineage/006-research-lineage-reducer-path/` and the deep-research reducer CLI at `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs`. Sources were read, never executed; no reducer run, test run, or workflow run was performed.

**Stop reason**: `maxIterationsReached` (1 of 1 iterations; stop policy `max-iterations`).

---

## Direct Answer

- **Documenting file**: `implementation-summary.md`. It is the packet file that documents the deep-research reducer's `--artifact-dir` flag — what the flag is, the decision behind its missing-value exit code, and the verification of that behavior.
- **Exit code for a missing value**: **1**. The reducer writes `[deep-research] --artifact-dir requires a path value` to stderr and exits 1.

---

## Key Findings

### F1 — `implementation-summary.md` documents the flag

The file states that "the deep-research reducer takes `--artifact-dir <path>`, the same flag the deep-review reducer already had"
[SOURCE: specs/system-deep-loop/038-review-and-cli-lineage/006-research-lineage-reducer-path/implementation-summary.md:52],
records the decision "Exit 1 when `--artifact-dir` has no value" with the rationale that the research reducer already uses exit 1 for usage errors
[SOURCE: specs/system-deep-loop/038-review-and-cli-lineage/006-research-lineage-reducer-path/implementation-summary.md:81],
and carries the verification row "Missing flag value | PASS, exit 1 with `[deep-research] --artifact-dir requires a path value`"
[SOURCE: specs/system-deep-loop/038-review-and-cli-lineage/006-research-lineage-reducer-path/implementation-summary.md:93].

### F2 — A missing value produces exit code 1

The reducer's CLI entry point defines the guard, its stderr message, and its exit:
`[SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:3154]` (missing-value condition),
`[SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:3155]` (stderr message),
`[SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:3156]` (`process.exit(1)`).
The packet's two exit-code statements agree: implementation-summary.md:81 and :93, and tasks.md:44.

### F3 — The other packet files name the flag but do not document its behavior

`spec.md` lists `--artifact-dir <path>` on the deep-research reducer CLI as an in-scope deliverable
[SOURCE: specs/system-deep-loop/038-review-and-cli-lineage/006-research-lineage-reducer-path/spec.md:71];
`tasks.md` records T003 (implementation)
[SOURCE: specs/system-deep-loop/038-review-and-cli-lineage/006-research-lineage-reducer-path/tasks.md:43]
and T004 (the check, "missing value exits 1 with `--artifact-dir requires a path value`")
[SOURCE: specs/system-deep-loop/038-review-and-cli-lineage/006-research-lineage-reducer-path/tasks.md:44];
`plan.md` describes the change at overview level
[SOURCE: specs/system-deep-loop/038-review-and-cli-lineage/006-research-lineage-reducer-path/plan.md:29].
So `spec.md` is the requirement source and `tasks.md` the work record; `implementation-summary.md` is the file that documents the flag's behavior and exit code.

### F4 — The guard's missing-value test is broader than an immediately-following empty value

A following token that starts with `--` is also read as missing, so `reduce-state.cjs <spec> --artifact-dir --lenient` exits 1 rather than treating `--lenient` as a path
[SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:3154].
The equals form `--artifact-dir=<path>` is ignored and the reducer falls back to the base research folder, a limitation the packet records
[SOURCE: specs/system-deep-loop/038-review-and-cli-lineage/006-research-lineage-reducer-path/implementation-summary.md:106].

---

## Evidence Summary

| Claim | Evidence | Confidence |
|-------|----------|------------|
| `implementation-summary.md` documents the flag | implementation-summary.md:52, 81, 93 | high |
| Missing value exits 1 | reduce-state.cjs:3154-3156; implementation-summary.md:81, 93; tasks.md:44 | high |
| `spec.md` is the requirement source, not the behavior doc | spec.md:71 | high |
| Next `--` token also exits 1; equals form ignored | reduce-state.cjs:3154; implementation-summary.md:106 | high |

---

## Method and Scope

- Read all four packet docs that mention `--artifact-dir`: `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`.
- Read the deep-research reducer CLI entry point and its `--artifact-dir` handling at `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:3145-3167`.
- Distinguished the deep-research reducer from the shared runtime reducer (`runtime/scripts/reduce-state.cjs`), which is a different CLI surface and outside the packet's scope (spec.md:83).

## Open Questions

- None for this topic. The two key questions are answered with agreement between the packet docs and the reducer source.

## Sources

- specs/system-deep-loop/038-review-and-cli-lineage/006-research-lineage-reducer-path/spec.md
- specs/system-deep-loop/038-review-and-cli-lineage/006-research-lineage-reducer-path/plan.md
- specs/system-deep-loop/038-review-and-cli-lineage/006-research-lineage-reducer-path/tasks.md
- specs/system-deep-loop/038-review-and-cli-lineage/006-research-lineage-reducer-path/implementation-summary.md
- .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs
