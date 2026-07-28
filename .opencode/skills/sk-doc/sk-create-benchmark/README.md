---
title: "create-benchmark"
description: "Author MCP-promotion, behavior, conformance, skill-benchmark and model-benchmark artifacts, and route the Lane A authoring guide, without ever running or scoring a benchmark."
trigger_phrases:
  - "benchmark-report.md"
  - "behavior benchmark"
  - "skill-benchmark"
  - "model-benchmark"
version: 1.0.0.0
---

# create-benchmark

> Turn a benchmark that already ran into documentation an operator can find without leaving the skill tree, or scaffold the inputs a benchmark lane needs before it runs one.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Authoring benchmark documentation and input artifacts across five families, plus a guide-only sixth |
| **Invoke with** | `/create:benchmark`, "benchmark-report.md", "behavior benchmark", "skill-benchmark", "model-benchmark" |
| **Works on** | A completed benchmark run or bake-off, or the input fixtures a benchmark lane needs before it runs |
| **Produces** | Ten-section benchmark reports, package indexes, machine-contract scenario files and JSON fixtures/profiles, never a rubric, scorer or runner |

---

## 2. OVERVIEW

### Why This Skill Exists

A benchmark finishes inside a spec packet, and the result lives three folders deep in an `evidence/` directory, so the next person who touches the MCP code has no way to find "why this default?" without remembering which packet ran it. A different kind of gap opens before a benchmark even runs: a deep-loop mode or a Lane B/C harness needs stable input fixtures and an index, and hand-rolling those inputs invites exactly the kind of scoring logic that should stay lane-owned. Five distinct benchmark families each have their own package shape, and conflating them, for example hand-writing a `skill-benchmark-report.md` when it's a renderer-owned render, breaks the thing the next run depends on.

### What It Does

`create-benchmark` authors five benchmark families' documentation and input artifacts, plus a sixth guide-only lane: MCP promotion (a `benchmark-report.md` and `source.md` that move a shipped spec packet's results into a skill's `mcp-server/benchmarks/` tree), behavior benchmarks (a `behavior-benchmark/` package of scenario contracts for a deep-loop mode), conformance benchmarks (a deterministic peer-adapter input package), skill-benchmarks (a hub's `benchmark/README.md` run-label index) and model-benchmarks (Lane B fixtures and run profiles). It never runs a benchmark, never writes a scorer or rubric and never hand-authors a `skill-benchmark-report.md`. Those stay lane-owned in deep-improvement. The family router in `SKILL.md` section 2 is the required first stop before authoring anything.

---

## 3. QUICK START

**Step 1: Invoke it.** `/create:benchmark`, or read `SKILL.md` section 2 to route to a family first.

**Step 2: Route before you write anything.**

```text
Measurable MCP surface + shipped spec packet with accepted ADRs + stable fixture?
  YES -> MCP promotion (SKILL.md section 3-8)
  NO  -> check behavior / conformance / skill / model families (SKILL.md section 2 table)
```

**Step 3: Verify before you rely on it.**

```bash
python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py \
  mcp-server/benchmarks/benchmark-2026-07-06/benchmark-report.md --type readme
```

Expected: zero blocking issues once the ten required sections are filled in.

---

## 4. HOW IT WORKS

For MCP promotion, the flagship command-driven family, the sequence runs: confirm the promotion gate (an accepted decision, a stable headline, a stable fixture, replay commands), classify the task as a true promotion, a re-run or a retirement, confirm the target skill actually has `mcp-server/`, create or update the benchmarks index, choose the `benchmark-YYYY-MM-DD/` folder using the execution date, copy source artifacts starting with the aggregate CSV, write `benchmark-report.md` from the fixed ten-section structure, write `source.md` as a lean wayfinding pointer back to the spec packet, then update the README index row and validate. Behavior, conformance, skill and model benchmarks follow the same authoring-not-running shape, but each has its own package layout documented in its `SKILL.md` section (9 through 12) and its own guide under `references/`.

### The Six Families

| Family | What it measures | Package lives at |
|---|---|---|
| MCP promotion | Retrieval, quality, runtime or throughput from a shipped MCP stack | `<skill>/mcp-server/benchmarks/benchmark-<date>/` |
| Behavior | Executor-model behavior at a deep-loop mode's invocation surface | `<mode>/behavior-benchmark/` |
| Conformance | Deterministic artifact conformance against a named authority | `<mode>/assets/conformance-benchmark/<benchmark-id>/` |
| Skill-benchmark (Lane C) | Whether a skill is well-routed, discoverable and useful | `<skill>/benchmark/<run-label>/` |
| Model-benchmark (Lane B) | What a model or prompt framework produces against a held-out oracle | `system-deep-loop/deep-improvement/assets/model-benchmark/` |
| Agent-improvement (Lane A) | An agent's quality across five dimensions | deep-improvement lane, in-lane, guide only here |

### Key Concept: Authoring Never Crosses Into Scoring

Every family in this packet stops at the same boundary: it writes down what a benchmark measured or what a benchmark needs before it can run. It never writes the thing that decides pass or fail. For example, a skill-benchmark run produces a `skill-benchmark-report.md`. This packet only ever touches the `benchmark/README.md` index that lists which run-label folders exist on disk. The report itself is a renderer-owned render from `build-report.cjs`, silently overwritten on the next run, so hand-editing it just gets thrown away.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for this packet when a benchmark already ran and shipped inside a spec packet with an accepted decision record, when a deep-loop mode needs a behavior-benchmark package, when a peer-adapter conformance check needs its input package, when a hub needs its `benchmark/README.md` index established or updated or when Lane B needs new fixtures or a run profile. Skip it when the benchmark is still in-flight, is a single unreplayable data point or the real ask is a release note (`create-changelog`) or an audit of benchmark markdown that already exists (`create-quality-control`).

### Related Skills

| Skill | Relationship |
|---|---|
| `create-changelog` | Owns a benchmark headline as a release-note row. `create-benchmark` owns the full promotion folder |
| `create-quality-control` | Owns auditing or scoring benchmark markdown that already exists, without authoring a new family artifact |
| `system-deep-loop` (deep-improvement lane) | Owns the D1-D5 scoring contract, the evaluator and every runner this packet's outputs feed |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| Validator flags a document-type mismatch | `benchmark-report.md` was checked with the wrong `--type` | Pass `--type readme` (or the closer-matching type) and re-run |
| A re-run created a second dated folder | The re-run confirmed the same headline instead of updating in place | Delete the new folder. Add a `Re-run YYYY-MM-DD` note to the existing `benchmark-report.md` instead |
| `skill-benchmark-report.md` was hand-edited and the next run wiped it | It is a renderer-owned render from `build-report.cjs` | Never hand-edit it. Change the run JSON or file a renderer issue instead |
| The wrong family template got copied | The family router in `SKILL.md` section 2 was skipped | Re-route through the family table before authoring anything |
| A "command benchmark" request got dropped into one family folder | Command benchmarks compose two families, not one | Author both a behavior and a conformance package and bind them via the matrix manifest in `references/shared/command-benchmark-composition.md` |

---

## 7. FAQ

**Q: Why not just drop the benchmark CSV into the skill's README?**

A: A raw CSV has no methodology, no caveats and no replay commands. `benchmark-report.md`'s ten sections exist so a reader months later can judge whether the result still holds.

**Q: Why five families instead of one generic "benchmark" template?**

A: MCP promotion, behavior, conformance, skill and model benchmarks measure genuinely different things, retrieval quality versus executor-model behavior versus artifact conformance versus skill routing versus model output, and conflating their package shapes breaks the lane that consumes each one.

**Q: Can this packet run a benchmark for me?**

A: No. It authors documentation and input artifacts only. Execution and scoring stay in the owning lane, deep-improvement or deep-alignment depending on the family.

**Q: What if a re-run confirms the same headline as before?**

A: Update the existing `benchmark-report.md` with a `Re-run YYYY-MM-DD` note instead of creating a new dated folder. A new folder is only for a benchmark that actually changes the headline.

---

## 8. VERIFICATION

| Check | How to run it |
|---|---|
| MCP promotion report | `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py <path>/benchmark-report.md --type readme` reports zero blocking issues |
| Behavior, skill, model, conformance package markdown | Same validator against each authored `.md`. JSON fixtures and lane-configs must additionally parse as valid JSON |
| Filename or folder naming | `python3 .opencode/skills/sk-doc/shared/scripts/check_authored_name_kebab.py <artifact-path-or-slug>` before any new artifact path ships |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Authoritative workflow contract, family router and all six family sections |
| [`references/shared/README.md`](./references/shared/README.md) | Overflow route-map: case studies, the report worked example and common pitfalls |
| [`references/behavior-benchmark/behavior-benchmark-guide.md`](./references/behavior-benchmark/behavior-benchmark-guide.md) | End-to-end guide for authoring a `behavior-benchmark` package |
| [`references/conformance-benchmark/conformance-benchmark-authoring-guide.md`](./references/conformance-benchmark/conformance-benchmark-authoring-guide.md) | Authoring guide for deterministic peer-adapter packages |
| [`references/skill-benchmark/skill-benchmark-storage-guide.md`](./references/skill-benchmark/skill-benchmark-storage-guide.md) | Storage convention for a hub's `benchmark/` tree and the renderer boundary |
| [`references/model-benchmark/model-benchmark-fixture-guide.md`](./references/model-benchmark/model-benchmark-fixture-guide.md) | Fixture-family taxonomy, profile shape and the Lane B scoring boundary |
| [`assets/shared/benchmark-report-template.md`](./assets/shared/benchmark-report-template.md) | Template for the ten-section `benchmark-report.md` |
| [`assets/shared/source-template.md`](./assets/shared/source-template.md) | Template for the `source.md` wayfinding file |
