---
title: "sk-design-chart: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, the review protocol, the orchestration guide and the per-feature validation files for the sk-design-chart sk-doc workflow packet."
version: 1.1.0.0
---

# sk-design-chart: Manual Testing Playbook

This document combines the manual-validation contract for the `sk-design-chart` workflow packet into a single reference. The root playbook is the operator directory, the review protocol and the orchestration guide: it explains how a realistic user-driven test is run, how evidence is captured, how a result is graded and where each per-feature validation file lives. The per-feature files carry the execution contract for each scenario, including the user request, the agent-facing prompt, the command sequence, the source anchors and the validation criteria.

---

This playbook package adopts the Feature Catalog split-document pattern for the `sk-design-chart` packet. The root document is the directory, the review surface and the orchestration guide, while per-feature execution detail lives in the category folders at the playbook root.

Canonical package artifacts:
- `manual-testing-playbook.md`
- `reading-the-chart/`
- `corpus-integrity/`
- `delivery-and-routing/`

This packet ships no `feature-catalog/`. Every scenario records the absence in its own source table rather than linking to an entry that does not exist.

### Result persistence

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
A scenario run is complete only after its `PASS`, `FAIL` or `SKIP` outcome and reason are persisted through `run-manual-playbook-scenario.cjs` into `<skill>/benchmark/reports/<dated-run-label>/`. Generated report Markdown is renderer-owned and never hand-authored.

The marker comment above is the contract surface the package validator reads. The sentence beside it is the package contract restated without its semicolon, because a semicolon is a hard blocker under the voice standard this hub also ships and a package can meet both by rewording rather than by claiming an exemption.

### Package shape

Every per-feature file carries the plain operator-scenario frontmatter: `title`, `description`, `stage` and the four-part `version`. None of them carries a routing-gold benchmark field, which means `id`, `expected_intent`, `expected_resources`, `expected_workflow_mode` and `expected_leaf_resources`. This package is not a skill-benchmark corpus. Any one of those fields would reclassify the file as routing gold, which excludes it from the operator-scenario contract, drops the package's operator count to zero and reports a status of `SKIP` at exit zero. A check that only greps for a failure reads that silence as clean, so the evidence for this package is a nonzero operator scenario count rather than an exit status.

---

## 1. OVERVIEW

This playbook covers the operator-visible surface of the `sk-design-chart` packet across three categories: reading the chart, corpus integrity and delivery with routing. Each feature keeps its ID and links to a dedicated feature file carrying the full execution contract. The operator validator computes the census from the walked tree, so this document does not hand-maintain a count.

### A Green Corpus Check Is Not A Pass

One property shapes every grading rule below. **The corpus check never looks at the picture and never reads the words.** Its own contract says so: with `--render` it confirms the figure region holds real elements after the script ran, which catches a chart that opens as an empty box, and it does not know whether the bars are the right height. It does not judge whether the headline states a conclusion, and it cannot tell whether that conclusion is true.

The corpus author opened every template and every delivery from a `file://` URL and found eight defects that no automated check in this packet could see. Three of them were headlines that misstated the numbers beneath them. The rest were drawing faults: an axis ladder that stepped from five to ten with nothing between, a value label that ran past the edge of the drawing, a tick clipped at the plot boundary and two axis names that overlapped.

So the inverted rule for this package is that **a run reporting a pass from the corpus check alone is a `FAIL`**, whatever its `RESULT:` line said. A reader has to open the file and answer the questions no check asks.

### Family Coverage

The corpus holds twenty-one chart forms across six question families. Every family is named below with the scenario that carries it and the reason, because the failure modes here cut across families rather than along them. A per-family scenario set would produce six near-identical documents that all fail for the same reason, which is the bar a scenario has to clear to earn its place.

| Family | Carried by | Why that scenario is the one |
|---|---|---|
| comparison | CHT-002, CHT-003 | `bar-columns` and `grouped-bars` carry the axis ladder. `bar-rows` is where a value label ran past the edge of the drawing |
| composition | CHT-001, CHT-003 | `treemap` carried both defect classes at once: a headline that said a third where the data said nearly half and a group label that ran off the right edge |
| time | CHT-002, CHT-003 | `daily-line` carried the coarse ladder and an end tick centred on the plot edge and clipped |
| distribution | CHT-001 | `distribution-strip` said a cohort was not slower while its median sat above the comparison |
| relationship | CHT-003 | `scatter` carried an axis name clipped by the card, and `parallel-axes` carried two axis names on top of each other |
| matrix | CHT-004, CHT-005 | `heat-matrix` draws every cell from the ordered ramp, so a cell grid that never drew and a drifted ramp step are the two ways it fails without looking broken |

### Realistic Test Model

1. A realistic user request is given to an orchestrator. Nobody asks for a corpus check. They ask for a chart they can put in front of somebody.
2. The orchestrator decides whether to work locally, delegate to sub-agents or invoke another CLI or runtime.
3. The operator captures the execution process and the user-visible outcome.
4. The scenario passes only when the workflow is sound and the returned result would satisfy a real user.

### What Each Feature File Should Explain

- The realistic user request that should trigger the behavior
- The agent-facing prompt that should drive the test
- The expected execution process, including delegation or external CLI use when relevant
- The desired user-visible outcome
- The implementation anchors that justify the scenario

---

## 2. GLOBAL PRECONDITIONS

1. Working directory is the repository root, so every `.opencode/skills/sk-design/sk-design-chart/` subpath in this package resolves.
2. Node is on PATH. The corpus check is one file with no third-party dependency.
3. A Chrome or Chromium binary is present for any scenario using `--render`, found on the usual paths or named by `CHROME_PATH`. A run without one records a `SKIP` naming the missing browser as the environment blocker.
4. A desktop browser is available for the scenarios that need a rendered page read by eye. Those scenarios name the requirement in their own preconditions, and a headless-only machine records a `SKIP` naming the unavailable display as the blocker.
5. The corpus is unmodified and the working tree is clean for the packet paths, so any diff is attributable to the run.
6. Scenarios that break a file on purpose do so on a copy under a scratch path, or restore with `git checkout --` of the touched path before the next scenario starts. A run that leaves a diff under the packet has failed the scenario it was executing.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- Command transcript, with the exit status of every corpus-check invocation read separately from any pipe
- The `RESULT:` line verbatim, plus the per-check assertion counts
- Whether the run was structural or `--render`, taken from the run's own mode line rather than from the command that was typed
- User request used
- Agent-facing prompt used
- Delegation or runtime-routing notes when applicable
- For any scenario that reads a rendered page, what was read and what was concluded, written as observations rather than as a verdict
- `git status --porcelain .opencode/skills/sk-design/sk-design-chart` for the packet path
- Scenario verdict with rationale (`PASS`, `FAIL` or `SKIP`)

A transcript that quotes only the `RESULT:` line cannot be graded. Every check reports an assertion count on every run, and a check reporting zero assertions ran on nothing, which is not the same as a check that passed. The count of checks is not fixed either, so read the lines the run printed rather than the lines a document said to expect.

---

## 4. DETERMINISTIC COMMAND NOTATION

- Bash commands shown as `bash: <command>`.
- Agent prompts shown as `agent: <instruction>`. These scenarios are agent-driven, so a step is usually what an agent does: read a reference, copy a form, derive a claim or refuse to report a number.
- `->` separates sequential steps.
- Repo-relative paths are written as `.opencode/skills/sk-design/sk-design-chart/...`. The packet root means that directory wherever the packet is installed.
- Commands in this package avoid shell pipes, because an exit status read through a pipe is the pipe's status rather than the command's.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `manual-testing-playbook.md`
2. Referenced per-feature files under the three category folders
3. Scenario execution evidence
4. Feature-to-scenario coverage map
5. Triage notes for all non-pass outcomes

### Scenario Acceptance Rules

For each executed scenario, check:

1. Preconditions were satisfied.
2. Prompt and command sequence were executed as written.
3. Expected signals are present.
4. Evidence is complete and readable.
5. Outcome rationale is explicit.

Three rules override intuition in this package specifically:

- **A green corpus check is not a `PASS`.** A run reporting a pass from the check alone is a `FAIL`. The check never reads the picture and never reads the words, and a run that skipped the reading measured a subset and reported it as the whole file.
- **A structural run is not a rendering run.** Without `--render` nothing has been opened. The mode line says which run it was, and a report that quotes the `RESULT:` line without the mode line has not said what it proved.
- **A run that left a diff under the packet is a `FAIL`.** Every deliberate break in this package is applied to a copy or restored before the next scenario, so `git status --porcelain` on the packet path is the deciding evidence rather than a formality.

Scenario verdict:
- `PASS`: all acceptance checks true
- `FAIL`: expected behavior missing, contradictory output or a critical check failed
- `SKIP`: a specific sandbox or runtime blocker prevents execution, and each `SKIP` must name the blocker

### Feature Verdict Rules

- `PASS`: all mapped scenarios for the feature are `PASS`
- `FAIL`: any mapped scenario is `FAIL`
- `SKIP`: every mapped scenario is blocked by a named sandbox or runtime blocker

Hard rule:
- Any critical-path scenario `FAIL` (`CHT-001`, `CHT-004`, `CHT-005`) forces the feature verdict to `FAIL`.

### Release Readiness Rule

Release is releasable only when:

1. No feature verdict is `FAIL`.
2. All critical scenarios are `PASS`.
3. Coverage is 100% of playbook scenarios defined by the root index and backed by per-feature files.
4. No unresolved blocking triage item remains.

`READING THE CHART` carries more weight than the other two categories. A drifted palette or an unresolvable index row fails loudly the next time the check runs. A headline that misstates its own data ships, gets read and gets believed, and every check in the packet says it is fine.

### Root-vs-Feature Rule

Keep global verdict logic in the root playbook. Record feature-specific acceptance caveats in the matching per-feature files.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Purpose

This section records wave planning and capacity guidance for the manual testing package. It is not a runtime support matrix by itself.

### Operational Rules

1. Probe runtime capacity at start.
2. Reserve one coordinator.
3. Saturate the remaining worker slots.
4. Pre-assign explicit scenario IDs and matching per-feature files to each wave before execution.
5. Run `CORPUS INTEGRITY` as the first wave. Every other scenario reads a corpus the check has already accepted, so a corpus that fails structurally invalidates the runs that follow it rather than one scenario.
6. Never run two scenarios that break a file at the same time. Both assert on `git status --porcelain` for the packet path, so neither result would be attributable.
7. Serialise anything using `--render`. Sustained back-to-back headless launches are the known cause of the intermittent render failure in section 11, and running render scenarios in parallel manufactures it.
8. After each wave, save context and evidence, then begin the next wave.
9. Record the utilization table, per-feature file references and evidence paths in the final report.

### What Belongs In Per-Feature Files

- Real user request
- Prompt field following the Role, Context, Action, Format contract when the actor is an orchestrator
- Expected delegation or alternate-CLI routing
- Desired user-visible outcome
- Feature-specific acceptance caveats or isolation constraints

---

## 7. READING THE CHART (`CHT-001..CHT-003`)

### CHT-001 | The headline agrees with its own data

#### Description
Verify every comparative claim in a card's top line is derived from the data block in the same file, rather than accepted because the file renders. Critical.

#### Scenario Contract
Prompt: `Build a chart from this data and write a headline that says what it shows. Then prove the headline is true from the numbers.`

A headline is an argument rather than a label, and three of the eight defects found by eye were headlines that contradicted the numbers under them. Those files rendered perfectly and passed every check. Nothing in this packet compares a sentence with the numbers beneath it, and nothing is going to.

Desired user-visible outcome: the user gets a chart whose top line they can defend from the data block, with the arithmetic shown.

#### Test Execution
> **Feature File:** [CHT-001](reading-the-chart/headline-agrees-with-the-data.md)
> **Catalog:** no feature-catalog entry exists for this packet.

---

### CHT-002 | The axis ladder fits the tallest mark

#### Description
Verify the top gridline sits close above the largest value, so the tallest mark fills the plot rather than half of it.

#### Scenario Contract
Prompt: `This chart looks wrong. Everything is squashed into the bottom half.`

A coarse ladder steps from five to ten with nothing between, so a peak just above the five rung doubles the axis and halves every mark. Three forms carried exactly that before it was fixed, and every one of them passed every check while doing it.

Desired user-visible outcome: the reader sees the shape of the data instead of the shape of the axis.

#### Test Execution
> **Feature File:** [CHT-002](reading-the-chart/axis-ladder-fits-the-tallest-mark.md)
> **Catalog:** no feature-catalog entry exists for this packet.

---

### CHT-003 | Nothing runs past the drawing edge

#### Description
Verify no label, tick or axis name is clipped by the plot boundary, overflows the card or collides with another.

#### Scenario Contract
Prompt: `Make this chart, then open it and tell me if anything is cut off.`

Five of the eight eye-caught defects were this: a value label past the bar area, a group label off the right edge, an end tick centred on the plot boundary, an axis name clipped by the card and two axis names on top of each other. Text overflow is invisible to a check that counts elements, because the elements are all there.

Desired user-visible outcome: every piece of text the chart draws is fully readable in the delivered file.

#### Test Execution
> **Feature File:** [CHT-003](reading-the-chart/nothing-runs-past-the-drawing-edge.md)
> **Catalog:** no feature-catalog entry exists for this packet.

---

## 8. CORPUS INTEGRITY (`CHT-004..CHT-006`)

### CHT-004 | A chart that draws nothing

#### Description
Verify the render pass runs, that a chart drawing nothing is caught and that an intermittent browser failure is told apart from a real one. Critical.

#### Scenario Contract
Prompt: `Check the chart corpus properly, not just the structure.`

A file whose script produces no marks passes every structural check, because the markup, the palette, the data block and the card parts are all correct. Only `--render` opens it. The same mode is where the known flake lives, and the discriminator in section 11 is what separates the two.

Desired user-visible outcome: the user is told which mode ran, and any red result is classified as a chart fault or a browser fault before it is reported.

#### Test Execution
> **Feature File:** [CHT-004](corpus-integrity/a-chart-that-draws-nothing.md)
> **Catalog:** no feature-catalog entry exists for this packet.

---

### CHT-005 | Colour comes from one source

#### Description
Verify a palette block still matches the palette source in both directions, and that no colour literal appears outside a palette block. Critical.

#### Scenario Contract
Prompt: `Restyle these charts to our brand colours.`

A palette edit that reaches half a file is invisible in a rendered page and almost invisible in a diff. Two checks stand behind it, `palette-block` and `colour-literals`, and this scenario proves both still bite by breaking each one and watching the run go red.

Desired user-visible outcome: the user can change a colour in one place and know the whole corpus followed.

#### Test Execution
> **Feature File:** [CHT-005](corpus-integrity/colour-comes-from-one-source.md)
> **Catalog:** no feature-catalog entry exists for this packet.

---

### CHT-006 | The index resolves in both directions

#### Description
Verify every catalog row reaches a file that identifies itself with the same id, and every chart form on disk appears in the catalog.

#### Scenario Contract
Prompt: `Add a chart form for a new question and wire it into the lookup.`

A row that exists is not a row that points anywhere, and an index checked in one direction rots on the first rename. The `catalog` check reads it both ways and names which side is wrong.

Desired user-visible outcome: a lookup a reader can trust, so a named row always opens a file that draws.

#### Test Execution
> **Feature File:** [CHT-006](corpus-integrity/catalog-resolves-both-ways.md)
> **Catalog:** no feature-catalog entry exists for this packet.

---

## 9. DELIVERY AND ROUTING (`CHT-007..CHT-009`)

### CHT-007 | It opens with no build step

#### Description
Verify a delivered file opens from a `file://` URL on a machine with no network, no install and no package manager, carrying no remote resource and no runtime fetch.

#### Scenario Contract
Prompt: `Send me the chart so I can open it on my laptop.`

The property that makes the artifact useful is also the one easiest to lose to a single convenient import. The `no-external` check fails any remote `src` or `href`, any `@import` and any `fetch`, `XMLHttpRequest` or dynamic `import`, and this scenario confirms it outside the repository as well as inside it.

Desired user-visible outcome: the recipient double-clicks the file and sees the chart, on a train, with no network.

#### Test Execution
> **Feature File:** [CHT-007](delivery-and-routing/opens-with-no-build-step.md)
> **Catalog:** no feature-catalog entry exists for this packet.

---

### CHT-008 | The form comes from the lookup, and the diagram boundary holds

#### Description
Verify a chart request reaches this packet and resolves to a catalog row, while a structural-visual request still reaches the neighbouring diagram packet.

#### Scenario Contract
Prompt: `Make a waterfall chart of the budget movement from gross to net.`

The two packets share a hub and the boundary is what the artifact carries, not which one was asked first. A vocabulary edit on either side can quietly take the other's traffic, and the symptom is one wrong answer to one request rather than a failing check.

Desired user-visible outcome: a chart request gets a chart from a named row, and a diagram request still gets a diagram.

#### Test Execution
> **Feature File:** [CHT-008](delivery-and-routing/form-choice-and-the-diagram-boundary.md)
> **Catalog:** no feature-catalog entry exists for this packet.

---

### CHT-009 | A delivery read on a dark system

#### Description
Verify a delivered chart answers the theme the reader's operating system has already picked, that the dark values are readable rather than merely present, and that printing still puts the light palette on paper.

#### Scenario Contract
Prompt: `I opened the chart you sent and it is a bright white rectangle in the middle of my dark screen.`

Every file carries a second palette block and nothing in the file switches to it, because a delivered document has nowhere to keep a preference. The check proves the block reaches the paint by opening each file with the scheme pinned dark and requiring a different picture. Whether the dark values are readable, and whether two category colours are still separable on a near-black ground, is what a person has to answer.

Desired user-visible outcome: the reader opens the file and gets a chart that belongs on their screen, and prints it to get a chart that belongs on paper.

#### Test Execution
> **Feature File:** [CHT-009](delivery-and-routing/a-delivery-on-a-dark-system.md)
> **Catalog:** no feature-catalog entry exists for this packet.

---

## 10. AUTOMATED TEST CROSS-REFERENCE

| Test Module | Coverage | Playbook Overlap |
|---|---|---|
| `scripts/check-corpus.cjs` | The structural subset: document shape, identity, both palette blocks, colour literals, external resources, script parsing, data block, unique ids, accessibility, card parts, determinism, motion, the palette source gated once per theme, and the two-way index | Direct. `CHT-005` and `CHT-006` execute individual checks as negative controls, and `CHT-004` executes the render mode |
| `scripts/check-corpus.cjs --render` | Whether the figure region holds real elements after the script ran, whether two opens settle to the same picture, and whether a dark colour scheme paints a different one | Direct. `CHT-004` is the operator-facing form of the first, and `CHT-009` of the third |
| `sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs` | This playbook package's own operator-scenario contract | None directly. It validates the playbook, not the workflow the playbook tests |

The packet ships no automated test for a headline, an axis ladder or a clipped label, and none is possible with the checks it has. `CHT-001`, `CHT-002` and `CHT-003` are the operator-facing equivalent for that half of the surface and do not claim to be more.

---

## 11. THE KNOWN RENDER FLAKE

Write this down rather than chasing it. The render check fails intermittently on this class of machine, and the failure is Chrome refusing to start under sustained back-to-back headless launches rather than a chart drawing nothing. It was diagnosed by running all files through the exact command the check issues, serially from a shell and again from Node the way the check runs them, with every file succeeding both times. Giving each launch its own profile directory changed nothing except the runtime, which rules out profile contention. Clean runs follow a pause and red runs follow other browser work.

The check discards the browser's own error stream, so its message names the symptom rather than the cause.

**The discriminator, which is the whole point of recording this:**

| What you see | What it is | What to do |
|---|---|---|
| A different file each run, and it does not reproduce by hand | Chrome | Pause, then re-run. Do not edit the chart |
| The same file every run, and it reproduces by hand from a `file://` URL | A chart drawing nothing | Fix the chart. This is the failure the render mode exists to catch |

Reproducing by hand means opening the named file in a browser and looking at the figure region, which takes less time than a second full run and settles the question outright.
