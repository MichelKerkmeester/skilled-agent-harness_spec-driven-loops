---
title: "create-benchmark"
description: "Turns a finished benchmark run into documentation an operator can find, then scaffolds the input artifacts a benchmark lane needs before it runs, across two families, never running or scoring a benchmark itself."
trigger_phrases:
  - "benchmark-report.md"
  - "behavior benchmark"
version: 1.6.8.0
---

# create-benchmark

> Turns a benchmark that already ran into documentation an operator can find and writes the scenario contracts a behavior benchmark needs. It never runs or scores a benchmark.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What you get |
|---|---|
| **Use it for** | Moving finished benchmark evidence into the skill tree |
| **Invoke with** | `/create:benchmark` for MCP promotion, `ROUTER.md` section 3 for behavior |
| **Works on** | MCP promotion folders and behavior-benchmark packages |
| **Produces** | A ten-section report, a source pointer and scenario contracts |

### What It Does

`create-benchmark` authors the files that carry a benchmark result or describe a benchmark before it runs. The MCP promotion family writes a report and a pointer into a consuming skill's `mcp-server/benchmarks/` tree. The behavior family writes the index and the scenario contracts a deep-loop mode needs. The packet never runs a benchmark and never writes a scorer. Start with `/create:benchmark` for MCP promotion. No command scaffolds a behavior package, so read the family table in `ROUTER.md` and author it from its section.

### Why This Skill Exists

A benchmark result often lands deep inside a spec packet, where the next engineer cannot find it while reading the MCP code. A second gap opens before a run starts, because a deep-loop mode needs stable contracts to measure against. This packet writes the skill-local surface and the behavior package in the shape the consuming lane already expects.

### The Benchmark Family Layer

Each family answers a different question, so each has its own package shape. Read the family table before you write a file.

| Family | What the skill authors |
|---|---|
| **MCP promotion** (`shared`) | the report, the copied evidence and the `source.md` pointer inside a dated run folder under `<skill>/mcp-server/benchmarks/` |
| **Behavior** (`behavior_benchmark`) | a `<mode>/behavior-benchmark/` package holding the index, one scenario contract per table row and the Claude baseline |

---

## 2. QUICK START

**Step 1: Invoke it.** Run `/create:benchmark` for MCP promotion. A behavior package has no command. Read the family table in `ROUTER.md`, then `SKILL.md` section 9.

**Step 2: Pick the family and author.** MCP promotion needs a completed run inside a spec packet, an accepted decision, a stable fixture and replay commands. Copy [the report template](./assets/shared/benchmark-report-template.md) into the consuming skill's dated run folder and name that folder from the execution date, as `SKILL.md` section 6 specifies. Fill the report and write `source.md` from [the source template](./assets/shared/source-template.md). Then update the index row. A behavior package copies [the index template](./assets/behavior-benchmark/behavior-benchmark-index-template.md) into `<mode>/behavior-benchmark/`. Add one scenario file per index row. Add a baseline for the Claude leg.

**Step 3: Verify before you rely on it.**

```bash
python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py \
  .skilled/skills/sk-doc/sk-create-benchmark/README.md --type readme
```

It prints `✅ VALID` and `Total issues: 0`. Run the same command against the report you just wrote.

```bash
python3 .skilled/skills/sk-doc/shared/scripts/check_authored_name_kebab.py benchmark-report
```

It prints `PASS: authored artifact name is kebab-case: benchmark-report`.

---

## 3. HOW IT WORKS

The MCP promotion family runs one fixed sequence. Confirm the gate first: an accepted decision, a stable headline, a stable fixture and replay commands. Classify the work as a first promotion or as an update to an existing folder. Confirm the target skill holds `mcp-server/`. Create the run folder on the execution date and copy the aggregate evidence into it. Write `benchmark-report.md` from the template and `source.md` as a lean pointer back to the spec packet. Update the index row last, once the validator passes.

The behavior family authors a package rather than a report. The package holds an index that lists each scenario against its contract file, plus a baseline for the Claude leg. Fixtures and run evidence stay in the spec-packet phase that executes the round.

```text
┌──────────────────────┐    ┌──────────────────────┐    ┌──────────────────────┐
│ Benchmark request    │ ─▶ │ Family table in      │ ─▶ │ Copy the behavior    │
└──────────────────────┘    │ ROUTER.md            │    │ templates            │
                            └──────────┬───────────┘    └───┬──────────────────┘
                                       │                    │
                                       ▼                    │
                            ┌──────────────────────┐        │
                            │ Confirm the          │        │
                            │ promotion gate       │        │
                            └──────────┬───────────┘        │
                                       │                    │
                                       ▼                    │
                            ┌──────────────────────┐        │
                            │ Create the run       │        │
                            │ folder               │        │
                            └──────────┬───────────┘        │
                                       │                    │
                                       ▼                    │
                            ┌──────────────────────┐        │
                            │ Write                │        │
                            │ benchmark-report.md  │        │
                            └──────────┬───────────┘        │
                                       │                    │
                                       ▼                    │
                            ┌──────────────────────┐        │
                            │ Write source.md      │        │
                            └──────────┬───────────┘        │
                                       │                    │
                                       ▼                    │
                            ┌──────────────────────┐        │
                            │ Update the           │        │
                            │ benchmarks index     │        │
                            └─────────────────┬────┘        │
                                              │             │
                                              ▼             ▼
                                          ┌──────────────────────┐
                                          │ Validate the         │
                                          │ authored markdown    │
                                          └──────────┬───────────┘
                                                     │
                                                     ▼
                                          ┌──────────────────────┐
                                          │ Authored files in    │
                                          │ the skill tree       │
                                          └──────────────────────┘
```

### Key Concept: The Report Answers, the Pointer Routes

The report is the answer a reader opens first. It carries the headline and the caveats. It holds the replay commands at the end. `source.md` maps each question back to the packet and stays lean on purpose. A report that copies the packet's audit trail becomes a second history that drifts. Keep the trail in one place and point at it.

---

## 4. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for this packet when a measurable MCP result already shipped inside a spec packet with an accepted decision. Reach for it when a deep-loop mode needs its scenario contracts written. Leave the result in the packet while the benchmark is still in flight. Leave it there when no fixture or replay command makes it reproducible. A release note belongs to `create-changelog`. An audit of benchmark docs that already exist belongs to `create-quality-control`.

### Related Skills

| Skill | Relationship |
|---|---|
| `create-changelog` | Carries the headline as a release-note row. This packet owns the full run folder |
| `create-quality-control` | Audits benchmark markdown that already exists. This packet authors a new family artifact |

---

## 5. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| Warnings name sections this packet does not have | The file was checked with a non-README `--type` | Pass `--type readme` and rerun |
| A re-run created a second dated folder | The re-run repeated a confirmed headline instead of updating in place | Remove the new folder and add a `Re-run YYYY-MM-DD` note to the existing `benchmark-report.md` |
| The wrong family template was copied | The family table was skipped | Reroute through `ROUTER.md` section 3 before writing anything |
| A scenario file ships with frontmatter | The template was copied whole instead of stripped | Drop the template's frontmatter, its own title and usage comment, and the `## OVERVIEW` section so the file opens at the scaffold's `# <PREFIX>-NNN` heading |

---

## 6. FAQ

### Why not leave the benchmark in its spec packet?

The packet holds the audit trail, which is the right place for it. The skill-local folder holds the answer an operator needs while reading the MCP code, with a pointer back to the packet.

### Why does this packet write no scorer or rubric?

Scoring belongs to the lane that runs the benchmark. This packet writes what the run measured or what the next run must satisfy, so a later run can be compared without rewriting the contract.

### Can it run a benchmark for me?

No. It authors files only. Execution and scoring stay in the owning lane.

### What happens when a re-run confirms the same headline?

Update the existing report with a `Re-run YYYY-MM-DD` note. Leave the folder name alone.

---

## 7. VERIFICATION

The packet ships an operator playbook. Its scenarios check family routing and the behavior package shape. Each one records its verdict with its evidence.

| Check | How to run it | What a pass looks like |
|---|---|---|
| Packet README | `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-doc/sk-create-benchmark/README.md --type readme` | A valid verdict and `Total issues: 0` |
| Authored report | The same validator against the new `benchmark-report.md` with `--type readme` | A valid verdict. One section-order warning on `HEADLINE / OVERVIEW` is expected |
| Authored name | `python3 .skilled/skills/sk-doc/shared/scripts/check_authored_name_kebab.py benchmark-report` | `PASS: authored artifact name is kebab-case: benchmark-report` |
| Operator scenarios | [The manual testing playbook](./manual-testing-playbook/manual-testing-playbook.md), scenarios BMR-001 through BMR-003 | Each run records its verdict and reason |

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Workflow, report contract and the behavior section |
| [`ROUTER.md`](./ROUTER.md) | Family table, intent model and resource map |
| [`/create:benchmark`](../../../commands/create/benchmark.md) | Command router for the MCP promotion family |
| [`manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | Operator scenarios for routing and package shape |
| [`references/shared/README.md`](./references/shared/README.md) | Case studies, worked example and pitfalls |
| [`behavior-benchmark-guide.md`](./references/behavior-benchmark/behavior-benchmark-guide.md) | Authoring path for a behavior package |
| [`benchmark-report-template.md`](./assets/shared/benchmark-report-template.md) | Fillable ten-section report |
| [`source-template.md`](./assets/shared/source-template.md) | Fillable source pointer |
| [`behavior-benchmark-index-template.md`](./assets/behavior-benchmark/behavior-benchmark-index-template.md) | Fillable package index |
| [`framework.md`](../../system-deep-loop/shared/behavior-benchmark/framework.md) | Lane-owned rubric, buckets and runner for behavior runs |

<!-- readme-check
allow-ref benchmark-report.md | the report this packet authors into a consuming skill's dated run folder, so it is never a file in this packet
allow-ref mcp-server/benchmarks/ | the tree inside the consuming skill a promotion writes into, relative to that skill rather than to this one
-->
