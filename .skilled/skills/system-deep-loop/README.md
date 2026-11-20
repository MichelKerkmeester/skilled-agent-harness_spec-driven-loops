---
title: "system-deep-loop"
description: "The advisor-routable hub for the active deep-loop workflow families over a nested runtime/ layer."
trigger_phrases:
  - "system deep loop"
  - "deep loop workflows"
  - "deep research review"
  - "deep-loop hub routing"
version: 1.6.14.0
---

# system-deep-loop

> Run iterative research or an iterative code review as a loop that keeps its state on disk and stops on a convergence signal.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What it delivers |
|---|---|
| **Use it for** | Multi-round research or a multi-pass review. Each round builds on what the round before it found |
| **Invoke with** | `Skill(system-deep-loop)` with a mode hint. A `/deep:*` command such as `/deep:research` or `/deep:review` also reaches it |
| **Works on** | A research topic with web or code sources. A review target such as a spec folder or a file set |
| **Produces** | The selected mode's artifacts and convergence state under the target spec folder, such as `research/research.md` or `review/review-report.md` |

### What It Does

`system-deep-loop` is one routing hub for two active loops. A request for iterative investigation goes to the `deep-research/` packet, which writes `research/research.md` under the target spec folder. A request for an iterative audit or a release-readiness verdict goes to `deep-review/`, which writes `review/review-report.md` and returns a verdict. Each packet owns its convergence math, state files, artifacts and tool guards. The shared `runtime/` beneath both modes holds executor config, prompt-pack rendering, atomic state, the coverage graph and the frontier node store behind `--depth-mode=expansive`.

One-shot retrieval belongs to `@context`. Implementation planning belongs to `/speckit:plan`. A single-pass review belongs to the code-review mode in `sk-code`.

### Why This Skill Exists

A deep-loop request can mean outward investigation or inward audit. The two loops share the same `runtime/` and the same append-only state path. One hub gives the family a single entry point, so the same request reaches the loop that owns it without a guess. The two packets still keep their own contracts, so one entry does not flatten the modes into one.

---

## 2. QUICK START

**Step 1: Invoke it.** Run `Skill(system-deep-loop)` with a mode hint such as `research: <request>`. You can also call `/deep:research` or `/deep:review`. Every surface reaches the same packet.

**Step 2: Check where a request routes.**

```bash
node .skilled/bin/compiled-route.cjs --hub system-deep-loop --prompt "deep review of the checklist changes"
```

Expected output: one JSON decision with `"action":"route"` and a target where `"workflowMode":"review"`. Exit code 0. Swap the prompt to `deep research on the routing drift` to see the research route.

**Step 3: Run the mode.** Pass the request to `/deep:review:auto "skill deep-review"`. The command workflow initializes `{spec_folder}/review/`, dispatches one review iteration per pass and synthesizes the report. The run produces `review-report.md` with a verdict, a findings registry, remediation workstreams and an audit appendix, plus the iteration files under `{spec_folder}/review/iterations/`.

---

## 3. HOW IT WORKS

Routing runs in two stages. Stage one picks the mode: the hub scores the request against the vocabulary classes in `hub-router.json`. The winning `workflowMode` selects one entry in `mode-registry.json`. Stage two picks the leaves: `ROUTER.md` maps the request's intent to packet-qualified reference files. Each path resolves to a canonical pair in `leaf-manifest.json`. The packet then runs its loop. It initializes state, dispatches one fresh agent per iteration, checks convergence and synthesizes its artifact. The hub only routes, so per-mode logic stays in the packet.

```text
                            ┌──────────────────────┐
                            │ Deep-loop request    │
                            └──────────┬───────────┘
                                       │
                                       ▼
                            ┌──────────────────────┐
                            │ Hub scores the       │
                            │ request              │
                            └──────────┬───────────┘
                                       │
           ┬───────────────────────────┼───────────────────────────┬
           ▼ research                  ▼ review                    ▼ no mode
┌──────────────────────┐    ┌──────────────────────┐    ┌──────────────────────┐
│ deep-research/       │    │ deep-review/         │    │ defer: ask for       │
│ packet               │    │ packet               │    │ the mode             │
└──────────┬───────────┘    └──────────┬───────────┘    └──────────────────────┘
           │                           │
           └───────────────────────┐   │
                                   ▼   ▼
                            ┌──────────────────────┐
                            │ runtime/             │
                            └──────────┬───────────┘
                                       │
                                       ▼
                            ┌──────────────────────┐
                            │ Artifacts and        │
                            │ convergence state    │
                            └──────────────────────┘
```

### The Three-Tier Discriminator

Every registry entry carries three keys. `workflowMode` is the public mode key. Its values are `research` and `review`. `runtimeLoopType` is the convergence key that `runtime/scripts/convergence.cjs` consumes. The router reads it from the registry rather than inferring it from `workflowMode`. `backendKind` names the backend that runs the mode, `runtime-loop-type` for both active modes. A custom mode would declare an explicit `null` and name its own backend path.

### One Advisor Identity

Each packet carries no `graph-metadata.json`. The hub root carries the only one, so the advisor sees one skill identity no matter which surface reaches a mode.

---

## 4. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for the hub when a request needs more than one round. Use the research mode for a topic that spans several sources, where each round should shape the next query. Use the review mode for a multi-pass audit of a spec folder or a file set. Use it for a release-readiness verdict. Both modes fit an unattended run, because each keeps its state on disk and checks convergence after every pass. A run can also go wider. `--depth-mode=expansive` keeps a frontier of follow-up questions or sub-targets in the shared runtime, and the loop keeps going while one stays open, within its iteration cap and duration budget. A finished single-executor run can also go further. `--extend=N` reopens it in the same session for N more iterations, `--extend-minutes=M` adds time, and the extension keeps the stop policy the run was created with.

Use `@context` for a one-shot lookup and `/speckit:plan` for implementation planning. A single-pass review belongs to the code-review mode in `sk-code`. A planning council is a separate agent, reached through `/speckit:ai-council`. It is not a mode of this hub.

### Related Skills

| Skill | Relationship |
|---|---|
| `system-spec-kit` | Owns the spec packets, validation and memory continuity that both modes read and write. |
| `sk-code` | Its code-review mode handles a single-pass review. The `deep-review/` packet runs the multi-pass loop. |

---

## 5. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| The compiled route returns `"action":"defer"` | The prompt names no mode, because `routerPolicy.defaultMode` is `null` | Add a mode word such as `deep research` or `deep review`. A mode hint works too. |
| The loop did not start | The mode was dispatched outside its command, so no workflow owned the state | Run `/deep:research` or `/deep:review`. The command YAML owns state, dispatch and convergence. |
| The drift check reports `registry packet absent from hub index` | This README no longer names a packet folder that `mode-registry.json` registers | Add the folder name with a trailing slash to the README |

---

## 6. VERIFICATION

The parent-skill check validates the registry shape, the tool-surface union, the hub-router consistency and the ROUTER contract in one pass.

```bash
node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/system-deep-loop
```

Expected output: `PASS:` lines for the checked invariants, with `INFO:` lines where the hub declares no surface packets. The summary reads `all hard invariants passed, 0 warnings`. Exit code 0.

```bash
node .skilled/skills/system-deep-loop/runtime/scripts/check-documentation-drift.cjs
```

Expected output: a JSON report whose `errors` array is empty. Exit code 0. The check confirms that every registered packet appears in this README with a trailing slash and that every benchmark report folder is indexed. It also fails on a broken relative link in the hub, packet, runtime and report docs.

```bash
python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/system-deep-loop/README.md --type readme
```

Expected output: `✅ VALID` and `Total issues: 0`.

---

## 7. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | The hub contract: routing, invariants and the mode table |
| [`ROUTER.md`](./ROUTER.md) | Stage-two leaf router and the machine-readable resource map |
| [`mode-registry.json`](./mode-registry.json) | The three-tier discriminator and each mode's packet path |
| [`hub-router.json`](./hub-router.json) | Stage-one vocabulary classes, router signals and tie-break order |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Package topology, canonical flows and runtime subsystems |
| [`deep-research/SKILL.md`](./deep-research/SKILL.md) | The research mode's operating contract |
| [`deep-review/SKILL.md`](./deep-review/SKILL.md) | The review mode's operating contract |
| [`runtime/README.md`](./runtime/README.md) | The shared runtime surface and its validation commands |
| [`shared/synthesis/README.md`](./shared/synthesis/README.md) | The shared resource-map render seam |
| [`manual-testing-playbook/`](./manual-testing-playbook/) | Operator scenarios for hub routing, state discipline and per-mode artifact ownership |
| [`benchmark/`](./benchmark/) | Baseline and compiled-routing benchmark reports |
| [`changelog/`](./changelog/) | Versioned release notes |

<!-- readme-check
allow-ref research/research.md | the research workflow writes it inside the target spec folder, not in this repository
allow-ref review/review-report.md | the review workflow writes it inside the target spec folder, not in this repository
-->
