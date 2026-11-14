---
title: "sk-code-frontend: Manual Testing Playbook"
description: "Corpus for the sk-code-frontend surface: the routing-recall scenarios for its 11 intents, the evidence a run leaves, and the review rules a release reads."
version: 1.0.3.0
---

# sk-code-frontend: Manual Testing Playbook

Routing-recall corpus for the `sk-code-frontend` surface.

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
> **Result persistence**: a scenario run is complete only after its `PASS`, `FAIL` or `SKIP` outcome and
> reason are recorded into `sk-code/benchmark/reports/<dated-run-label>/`. The packet carries no
> `benchmark/` of its own, so its runs land in the hub's report tree.
>
> The record is written by hand, because the harness that once wrote it was retired with its lane.
> A manual run produces one dated folder holding a `README.md` with the verdict, the reason, the
> evidence paths and the scenario ids, and a `source.md` naming the spec packet that holds the raw
> transcript. The hub's own report index states that its rows are written by that harness at the
> moment it writes a report, so a hand-written run adds its folder and leaves that index alone; the
> folder name is what makes it findable.

---

## 1. OVERVIEW

Eleven scenarios live here, one per intent the surface routes. Each one sends a single exact prompt through the packet router, confirms the intent it selects, and confirms the resource set `RESOURCE_MAP` declares for that intent.

The intents and the map are read from the `MACHINE ROUTER` section at the end of [`ROUTER.md`](../ROUTER.md); the router's `INTENT MODEL` in section 2 and the reference map in [`SKILL.md`](../SKILL.md) carry the prose that names the same paths.

The hub's router-sync guard replays every scenario here that declares `expected_intent` (check `4` of `sk-code-skilled/assets/scripts/verify-router-sync.cjs`), and the guard walks packet-level playbooks only, so a routing scenario kept anywhere else would never be replayed. Every scenario in this corpus declares an intent, because every one of them makes a route claim.

### Categories

| # | Category | Folder | Scenario IDs |
|---|---|---|---|
| 1 | Frontend Surface | `frontend-surface/` | frontend-surface-web, frontend-surface-figma-check, frontend-surface-visual-values, frontend-surface-web-elements, frontend-surface-web-cascade, frontend-surface-web-layout, frontend-surface-web-accessibility, frontend-surface-web-performance, frontend-surface-web-internationalization, frontend-surface-visual-hierarchy, frontend-surface-motion-interaction |

### Scenarios

| # | ID | Intent | File |
| --- | --- | --- | --- |
| 1 | frontend-surface-web | FRONTEND_WEB | [frontend-web.md](frontend-surface/frontend-web.md) |
| 2 | frontend-surface-figma-check | FIGMA_TO_CODE | [figma-check.md](frontend-surface/figma-check.md) |
| 3 | frontend-surface-visual-values | WEB_VISUAL_VALUES | [visual-values.md](frontend-surface/visual-values.md) |
| 4 | frontend-surface-web-elements | WEB_ELEMENTS | [web-elements.md](frontend-surface/web-elements.md) |
| 5 | frontend-surface-web-cascade | WEB_CASCADE | [web-cascade.md](frontend-surface/web-cascade.md) |
| 6 | frontend-surface-web-layout | WEB_LAYOUT | [web-layout.md](frontend-surface/web-layout.md) |
| 7 | frontend-surface-web-accessibility | WEB_A11Y | [web-accessibility.md](frontend-surface/web-accessibility.md) |
| 8 | frontend-surface-web-performance | WEB_PERF | [web-performance.md](frontend-surface/web-performance.md) |
| 9 | frontend-surface-web-internationalization | WEB_I18N | [web-internationalization.md](frontend-surface/web-internationalization.md) |
| 10 | frontend-surface-visual-hierarchy | WEB_VISUAL_HIERARCHY | [visual-hierarchy.md](frontend-surface/visual-hierarchy.md) |
| 11 | frontend-surface-motion-interaction | WEB_MOTION | [motion-interaction.md](frontend-surface/motion-interaction.md) |

A **routing** scenario, meaning one that declares `expected_intent` and `expected_resources`, is `PASS` when every path in its `expected_resources` resolves under the packet root, the replayed router selects that intent, and the router emits that path set for the exact prompt. It is `FAIL` when its checks do not hold, and `SKIP` only when a specific sandbox or runtime blocker prevented the run.

---

## 2. GLOBAL PRECONDITIONS

- Run every command from the repository root.
- The `sk-code` hub registers `sk-code-frontend` in `mode-registry.json`, so the packet is a known surface, and the compiled route serves the hub.
- Node is available for the router-sync guard and for the replay command each scenario runs.
- The packet is read-only and every scenario reads the same router and references, so a run writes nothing inside the repository and needs no fixture.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- Keep the command transcript and the exit status for each step.
- For every scenario: record the resolved `expected_resources` block from its frontmatter, the two replay lines step 6 prints, and the titles step 5 prints.
- Record the guard's check-`4` result for this packet, which is the count of its problem lines naming a `sk-code-frontend` scenario plus the count of the leg's summary line. The leg is fleet-wide, so a red total whose problem lines all name another packet is that packet's finding.
- For the Figma scenario: record the answer's pass table and the overall Figma verdict beside step 8's count.
- Record every scenario's own expected-result table with the observed value beside each row, because that table is the verdict rule the scenario states.

---

## 4. DETERMINISTIC COMMAND NOTATION

Commands are written as numbered steps with the exact shell line in backticks. A step passes when its output matches the scenario's Expected text and its exit status is the one the scenario states, which is `0` unless the step says otherwise.

Several steps expect a non-zero status on purpose, and each one names it where it is written. A `grep` that finds nothing exits 1, so the first count in each scenario's guard step reports 1 when the guard printed no problem line for this packet. A step whose status is not stated is expected to exit 0.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. This root playbook.
2. The scenario file for each intent family under review.
3. The command transcript and exit statuses recorded under section 3.
4. The feature-to-scenario map in section 8.
5. A triage note for any `FAIL` or `SKIP` verdict.

### Scenario Acceptance Rules

A scenario's verdict is `PASS` when every check below holds:

1. The section 2 preconditions held.
2. The prompt and commands ran exactly as written.
3. Every path in `expected_resources` exists under the packet root.
4. The replay selects this scenario's `expected_intent` alone and emits exactly the declared path set.
5. The transcript, the resolved `expected_resources` block and the guard's check-`4` result for this packet are recorded and readable.
6. For the Figma scenario, the answer records a pass that did not run as `NOT RUN` with its reason and ends the Figma check `INCOMPLETE`.

The verdict is `FAIL` when any check is false, including a run whose behaviour was right but whose evidence is incomplete. It is `SKIP` only when a named sandbox, runtime or fixture blocker kept the check from running.

### Feature Verdict Rules

- `PASS`: the mapped scenario is `PASS`.
- `FAIL`: the mapped scenario is `FAIL`.
- `SKIP`: the mapped scenario is `SKIP` for a named environment-only reason.

### Release Readiness Rule

The packet is release-ready only when every scenario is `PASS` or carries a justified `SKIP`. A `FAIL` on any one blocks the release, because each scenario proves a different intent and together they are the surface's only routing evidence. A scenario that fails leaves its intent unverified, and the guard would replay the failing one on every future run.

### Root-vs-Feature Rule

Global verdict logic lives here. The prompt, the expected signals, the commands and the source anchors live in the per-feature files.

### Evidence Ledger Fields

| Field | Required | Notes |
|---|---|---|
| Scenario ID | Yes | The scenario's frontmatter `id`, copied as written |
| Feature file | Yes | The scenario's path relative to this root |
| Runtime | Yes | The surface that ran, or the skipped surface with its blocker |
| Exact prompt | Yes | The pasted prompt that proved canonical prompt equality |
| Evidence path | Yes | The dated folder under `sk-code/benchmark/reports/` that holds the record |
| Verdict | Yes | `PASS`, `FAIL` or `SKIP` |
| Blocking reason | Conditional | Required for `FAIL` and `SKIP` |

### Release Review Checklist

1. The package validator reports no violation and no warning for this package.
2. The root index links every scenario file and names no missing file.
3. Every file the section 7 and section 8 tables name still exists.
4. Every scenario recorded the guard's check-`4` result for this packet.
5. Every scenario recorded its expected-result table with the observed values.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Operational Rules

1. The eleven scenarios read the same router, the same references and the same guard, so they run in one operator session. Splitting them saves no wall time and makes the family harder to read.
2. Record the verdict and its evidence path before any follow-up work starts.
3. Keep the coordinator role with the operator who ran the check. There is no second runtime to reconcile against.
4. The Figma scenario also needs the answer itself, because its sixth acceptance check grades the verdict the answer reports. Run it last, so a routing defect is found before the answer is read.

### Suggested Waves

| Wave | Category | Scenarios | Rationale |
|---|---|---|---|
| 1 | Frontend Surface | All eleven scenarios in the section 1 table | All eleven read one router and one replay command, with no fixture to schedule. Run them serially in one session. |

### What Belongs In Per-Feature Files

- The exact prompt.
- The `expected_resources` set.
- The command steps and their expected output, with the exit status of any step that is not 0.
- The expected-result table the verdict is read from.
- The source anchors behind each pass/fail rule.

---

## 7. AUTOMATED TEST CROSS-REFERENCE

| Test Module | Coverage | Playbook Overlap |
|---|---|---|
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` (check `4`) | Replays every packet-level routing scenario against its `expected_resources` | All eleven scenarios |
| `.skilled/bin/tests/compiled-route-surface-hint.test.cjs` | Asserts a frontend review prompt bundles `[sk-code-review, sk-code-frontend]` and that near-miss prompts never bundle the surface | frontend-surface-web (the same web surface family, with a different prompt) |
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs` | The `12a-router-contract` and `12b-routing-shape` checks on this packet's `ROUTER.md` | All eleven scenarios (the machine router every one reads) |

---

## 8. FEATURE CATALOG CROSS-REFERENCE INDEX

| Feature ID | Feature Name | Category | Feature File |
|---|---|---|---|
| frontend-surface-web | Web markup and CSS routing | Frontend Surface | [frontend-web](frontend-surface/frontend-web.md) |
| frontend-surface-figma-check | Figma frame check routing | Frontend Surface | [figma-check](frontend-surface/figma-check.md) |
| frontend-surface-visual-values | Visual values routing | Frontend Surface | [visual-values](frontend-surface/visual-values.md) |
| frontend-surface-web-elements | Web elements routing | Frontend Surface | [web-elements](frontend-surface/web-elements.md) |
| frontend-surface-web-cascade | Web cascade routing | Frontend Surface | [web-cascade](frontend-surface/web-cascade.md) |
| frontend-surface-web-layout | Web layout routing | Frontend Surface | [web-layout](frontend-surface/web-layout.md) |
| frontend-surface-web-accessibility | Web accessibility routing | Frontend Surface | [web-accessibility](frontend-surface/web-accessibility.md) |
| frontend-surface-web-performance | Web performance routing | Frontend Surface | [web-performance](frontend-surface/web-performance.md) |
| frontend-surface-web-internationalization | Web internationalization routing | Frontend Surface | [web-internationalization](frontend-surface/web-internationalization.md) |
| frontend-surface-visual-hierarchy | Visual hierarchy routing | Frontend Surface | [visual-hierarchy](frontend-surface/visual-hierarchy.md) |
| frontend-surface-motion-interaction | Motion and interaction routing | Frontend Surface | [motion-interaction](frontend-surface/motion-interaction.md) |

The routing rows above belong to the entry `feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md`, which records the surface axis and the advisor-invisible surfaces. The reference families behind the scenarios, which are the core, the web layer, the topic files and the Figma check, have no separate catalog entry, and each scenario's Playbook Sources section says so.
