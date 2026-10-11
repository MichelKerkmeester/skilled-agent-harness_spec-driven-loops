---
title: "create-benchmark"
description: "Turns a finished benchmark run into documentation an operator can find, then scaffolds the input artifacts a benchmark lane needs before it runs, across two families, never running or scoring a benchmark itself."
trigger_phrases:
  - "benchmark-report.md"
  - "behavior benchmark"
---

# create-benchmark

> Turn a benchmark that already ran into documentation an operator can find, then scaffold the input fixtures a benchmark lane needs before it runs, never running or scoring the benchmark itself.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Authoring benchmark documentation and input artifacts across two families |
| **Invoke with** | `/create:benchmark`, "benchmark-report.md", "behavior benchmark" |
| **Works on** | Completed benchmark runs and bake-offs, plus the input fixtures a benchmark lane needs before it runs |
| **Produces** | Ten-section benchmark reports, package indexes, machine-contract scenario files. Never a rubric, scorer or runner |

---

## 2. OVERVIEW

### Why This Skill Exists

A benchmark finishes inside a spec packet. The result lives three folders deep in an `evidence/` directory, so the next person who touches the MCP code cannot find why a default exists without remembering which packet ran the benchmark. A second gap opens before a benchmark runs at all. Deep-loop modes need stable input fixtures and an index. Hand-rolling those inputs invites exactly the kind of scoring logic that should stay lane-owned. Two distinct benchmark families each have their own package shape. Conflating them breaks the thing the next run depends on.

### What It Does

`create-benchmark` authors documentation and input artifacts for two benchmark families. MCP promotion writes a `benchmark-report.md` and a `source.md` that move a shipped spec packet's results into a skill's `mcp-server/benchmarks/` tree. Behavior benchmarks get a `behavior-benchmark/` package of scenario contracts for a deep-loop mode. The skill never runs a benchmark and never writes a scorer or rubric. Those stay lane-owned. Start with the `/create:benchmark` command. The family router in `SKILL.md` section 2 decides which family shape applies. It is the required first stop before authoring anything.

### The Family Capability Layer

| Family | What it measures | What the skill knows how to operate |
|---|---|---|
| **MCP promotion** (`shared`) | retrieval, quality, runtime or throughput of a shipped MCP stack | a `benchmark-report.md` and a `source.md` inside `<skill>/mcp-server/benchmarks/benchmark-<date>/` |
| **Behavior** (`behavior_benchmark`) | executor-model behavior at a deep-loop mode's invocation surface | a `behavior-benchmark/` package of scenario contracts at `<mode>/behavior-benchmark/` |

---

## 3. QUICK START

**Step 1: Invoke it.** Run `/create:benchmark` or read `SKILL.md` section 2 to route to a family first.

**Step 2: Route before you write anything.**

```text
Measurable MCP surface + shipped spec packet with accepted ADRs + stable fixture?
  YES -> MCP promotion (SKILL.md section 3-8)
  NO  -> check behavior families (SKILL.md section 2 table)
```

The block is the family router in miniature. MCP promotion is the flagship command-driven family.

**Step 3: Verify before you rely on it.**

```bash
python3 .skilled/skills/sk-doc/scripts/validate_document.py \
  mcp-server/benchmarks/benchmark-2026-07-06/benchmark-report.md --type readme
```

Expected: zero blocking issues once the ten required sections are filled in.

---

## 4. HOW IT WORKS

The flagship family, MCP promotion, runs a fixed sequence. Confirm the promotion gate first: an accepted decision, a stable headline, a stable fixture and replay commands. Classify the task as a re-run or a retirement when the headline repeats, otherwise as a first-time promotion. Confirm the target skill actually has `mcp-server/`. Create or update the benchmarks index. Choose the `benchmark-YYYY-MM-DD/` folder using the execution date. Copy the source artifacts starting with the aggregate CSV. Write `benchmark-report.md` from the fixed ten-section structure. Write `source.md` as a lean wayfinding pointer back to the spec packet. Update the README index row. Validate.

Behavior benchmarks follow the same authoring-not-running shape. The family's package layout is documented in its own `SKILL.md` section (9) and its own guide under `references/`.

### Key Concept: Authoring Never Crosses Into Scoring

Every family stops at the same boundary. It writes down what a benchmark measured or what a benchmark needs before it can run. It never writes the thing that decides pass or fail.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for this packet when a benchmark already ran and shipped inside a spec packet with an accepted decision record, when a deep-loop mode needs a behavior-benchmark package, when a hub needs its `benchmark/README.md` index established or updated.

Skip it when the benchmark is still in-flight, is a single unreplayable data point or the real ask is a release note (`create-changelog`) or an audit of benchmark markdown that already exists (`create-quality-control`).

### Related Skills

| Skill | Relationship |
|---|---|
| `create-changelog` | Owns a benchmark headline as a release-note row. `create-benchmark` owns the full promotion folder |
| `create-quality-control` | Owns auditing or scoring benchmark markdown that already exists, without authoring a new family artifact |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| Validator flags a document-type mismatch | `benchmark-report.md` was checked with the wrong `--type` | Pass `--type readme` (or the closer-matching type) and re-run |
| A re-run created a second dated folder | The re-run confirmed the same headline instead of updating in place | Delete the new folder. Add a `Re-run YYYY-MM-DD` note to the existing `benchmark-report.md` instead |
| The wrong family template got copied | The family router in `SKILL.md` section 2 was skipped | Re-route through the family table before authoring anything |

---

## 7. FAQ

**Q: Why not just drop the benchmark CSV into the skill's README?**

A: A raw CSV gives a reader a bare number with no methodology and no replay path. The ten sections of `benchmark-report.md` carry the caveats a reader needs, so a reader months later can judge whether the result still holds.

**Q: Why separate families instead of one generic "benchmark" template?**

A: The two families measure genuinely different things: retrieval quality and executor-model behavior each answer a different question. Conflating their package shapes breaks the lane that consumes each one.

**Q: Can this packet run a benchmark for me?**

A: No. It authors documentation and input artifacts only. Execution and scoring stay in the owning lane.

**Q: What if a re-run confirms the same headline as before?**

A: Update the existing `benchmark-report.md` with a `Re-run YYYY-MM-DD` note instead of creating a new dated folder. A new folder is only for a benchmark that actually changes the headline.

---

## 8. VERIFICATION

| Check | How to run it |
|---|---|
| MCP promotion report | `python3 .skilled/skills/sk-doc/scripts/validate_document.py <path>/benchmark-report.md --type readme` reports zero blocking issues |
| Behavior package markdown | Same validator against each authored `.md` |
| Filename or folder naming | `python3 .skilled/skills/sk-doc/shared/scripts/check_authored_name_kebab.py <artifact-path-or-slug>` before any new artifact path ships |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Authoritative workflow contract, family router and every family section |
| [`references/shared/README.md`](./references/shared/README.md) | Overflow route-map: case studies, the report worked example and common pitfalls |
| [`references/behavior-benchmark/behavior-benchmark-guide.md`](./references/behavior-benchmark/behavior-benchmark-guide.md) | End-to-end guide for authoring a `behavior-benchmark` package |
| [`assets/shared/benchmark-report-template.md`](./assets/shared/benchmark-report-template.md) | Template for the ten-section `benchmark-report.md` |
| [`assets/shared/source-template.md`](./assets/shared/source-template.md) | Template for the `source.md` wayfinding file |
