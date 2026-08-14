# Handover — 037 Graph-Engineering Research Program

> Continuity handover for the phase parent `system-deep-loop/037-graph-engineering`. Read this first on resume, then [context-index.md](context-index.md) for the full map. Written 2026-08-14.

---

## Current state

**The research program is COMPLETE.** Six studies ran to fixed depth and closed out; all are validated (`validate.sh --strict` Errors:0, one benign `EVIDENCE_CITED` warning each) and landed on both `origin/skilled/v4.0.0.0` and `origin/main`. No runtime code was changed — this is research only.

The program answered one question: **how to evolve `system-deep-loop` into a graph-based agent-loop system over the 036 authority plane.** The answer is a single integrated design, captured in the study-6 capstone.

---

## What shipped

| Item | Where | State |
|------|-------|-------|
| Program map / index | [context-index.md](context-index.md) | Complete |
| 5 source studies (S1–S5) | `001-agent-swarms` … `005-noaa-paper-and-blog-theory` | Complete, each with synthesis + plain-language + (S2–S5) DeepSeek verification |
| Integration capstone (S6) | `006-cross-study-integration` | Complete, DeepSeek PASS-WITH-FIXES applied |
| Curated background primers | [reference/](reference/) | Present (5 primers + README) |
| Vendored source corpus | [context/](context/) | 4 repos, 12 blogs, 1 paper |

Study verdicts: S1 SOL-only (no DeepSeek pass), S2/S4/S5/S6 PASS-WITH-FIXES, S3 REWORK (applied). See [context-index.md §2](context-index.md).

---

## The one real next step (not yet started)

**A mutant-driven shadow vertical slice** — the only thing that moves the program from *integrated design* to *implementation-qualification*. Freeze a deep-research corpus + the exact legacy build, run one typed graph through the full return→evidence→belief→policy machine, fire 036's dark adapter only *after* the legacy result (prove zero externally visible difference), inject ~15 mutants, and require each to fail at its expected earliest owner. Fully specified in [006/research/research.md](006-cross-study-integration/research/research.md) §"What Remains Unproven".

This step **would touch shipped runtime** (all six studies did not). It should be scoped as its own Gate-3 packet with an operator decision before any implementation.

---

## Blockers / open items

- **None blocking the research.** The program is closed.
- **036 runs dark** — every authority claim is target-state, not enforced. This is the standing reality the next step must respect.
- **Parent `spec.md` is a stale gen-1 seed** (`Status: In Progress`, `completion_pct: 0`, "complete from research.md"). It predates the six studies and describes only the original 2026-08-08 seed research in `research/`. It is intentionally left as the root-purpose record; the live program state lives in this handover + [context-index.md](context-index.md), not in the parent spec.

---

## How to resume

1. Read [context-index.md](context-index.md) for the map and reading order.
2. To understand the target design: [006/research/findings-plain-language.md](006-cross-study-integration/research/findings-plain-language.md) → [006/research/research.md](006-cross-study-integration/research/research.md).
3. To act: scope the shadow-slice packet (above) as a new child under `system-deep-loop`, get the operator decision, then plan.
4. Each study's `research/README.md` explains what's in that folder.

---

## Key files

- [context-index.md](context-index.md) — program map
- [006-cross-study-integration/research/research.md](006-cross-study-integration/research/research.md) — the integrated design
- [006-cross-study-integration/research/findings-plain-language.md](006-cross-study-integration/research/findings-plain-language.md) — plain-language capstone
- [reference/README.md](reference/README.md) — curated background primers
- `graph-metadata.json` — registers all six children (`derived.children_ids`)
