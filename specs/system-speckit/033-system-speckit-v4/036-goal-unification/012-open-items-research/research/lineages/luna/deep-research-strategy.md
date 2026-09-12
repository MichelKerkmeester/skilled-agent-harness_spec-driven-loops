---
title: "Deep Research Strategy: adversarial second lens on the goal open items"
description: "Two inline lineage iterations audit the first report's citations and then issue direct recommendations for five open goal questions."
trigger_phrases:
  - "adversarial goal open items"
  - "goal line width second lens"
  - "goal unowned surfaces second lens"
  - "goal README machine checks"
importance_tier: important
contextType: research
---

# Deep Research Strategy: adversarial second lens on the goal open items

## Research Topic

The first lineage's synthesis at `specs/system-speckit/033-system-speckit-v4/036-goal-unification/012-open-items-research/research/research.md` is a hypothesis, not a finding. This lineage must test its citations, expose claims that do not hold, price understated costs and blast radius, recover alternatives it dismissed too quickly, and then give one recommendation for each of the five open items.

## Execution Contract

- This is a detached fan-out lineage executed inline by the current session. No nested CLI,
  agent, task, or subprocess is used to perform research.
- All writes are confined to the lineage directory. Packet-level state, graph, continuity,
  validation, and git write tools are intentionally not invoked.
- Every claim about current behavior has a file-and-line citation. A claim about a measurement
  or an absent artifact also names the command or exact artifact path that would reproduce it.
- Convergence is telemetry only until both configured iterations are complete. The cap is the
  terminal condition.

## Key Questions

1. Which claims in the first report fail when its citations are opened, and which costs or blast
   radii are understated?
2. Which alternatives were dismissed too quickly, and is the disagreement underspecification or
   thin evidence?
3. What recommendation should be made for prose line width?
4. What should be done with the unowned surfaces?
5. Should the root README goal section be tested, retrieved, or left outside both?
6. Should any referent be renamed because the word `goal` names four things?
7. Which facts earn a machine check, with what smallest reliable test shape?

## Iteration Plan

### Iteration 1 — adversarial citation audit

Open the first report's cited files and audit all five rings. Record every material claim that does
not hold, every cost/blast-radius estimate that omits a live dependency, and every alternative whose
rejection is not supported by the cited evidence. Preserve claims that survive, but mark the
remaining disagreement as `underspecified` or `thin evidence` rather than averaging it.

### Iteration 2 — five recommendations

For each of the five open items, state the recommendation this lineage would make, the exact delta
from the first report, the evidence that separates the answers, and the condition under which the
first report would be the better answer. Include implementation cost, blast radius, and the smallest
machine-check shape where a check is justified.

## Initial Known Context

- The first report says: retire a prose-width limit; keep or repair duplicated surfaces; test the
  root README without retrieving it; rename `goal-file-manifest.txt`; and add four machine checks.
- The current tree contains an explicit universal prose guidance of roughly 100–120 characters,
  a POSIX flag mirror that documents its divergence from canonical aliases, a registered but known
  dormant Cursor `beforeSubmitPrompt` hook, and three plugin environment variables absent from the
  root env example. These are adversarial leads, not conclusions.
- The first report's referenced `iterations/iteration-001..005.md` and `deltas/iter-001..005.jsonl`
  are not present beside the root report; the completed deepseek lineage is available as a separate
  read-only comparison set. This makes provenance and reproducibility part of the audit.

## Answered Questions

Audit questions answered in iteration 1:

1. The first report's absolute width statement, claim-by-claim support-story agreement, manifest
   drift diagnosis, review-only naming frame, and shallow machine-check shapes do not hold as
   stated.
2. The missing three environment knobs are confirmed, but the proposed scan must partition CLI,
   plugin, alias, and shared ownership.
3. The remaining disagreements are `underspecified` where the desired contract is not named and
   `thin evidence` where no command output or operator incident is supplied; they must not be
   averaged.

Iteration 2 issued direct recommendations for all five open items. The reducer-owned sections below
now record the final capped position; convergence was telemetry only and did not terminate the run.

## What Worked

- Phase initialization bound the artifact root directly to the supplied lineage override.
- The adversarial pass compares report claims with source files instead of treating the report's
  counts and conclusions as authoritative.
- Re-reading the host event configuration alongside the goal adapters separated registration from
  delivery, which prevented a false Cursor cadence assertion.
- Splitting the final pass by open item made the disagreements legible: width policy, README
  retrieval, manifest naming, and check shape each have a different contract and blast radius.
- Comparing explicit manifest callers with the packet-resident script separated maintenance
  ownership from runtime default-path behavior.

## What Failed

- The normal packet resolver/reducer/validator/continuity path cannot be used without writing
  outside the supplied lineage, so those phase actions are represented by local equivalents.
- The first report's compact source list did not expose its six-manifest classification or the
  commands behind its corpus counts; the audit could correct the conclusion but not reproduce every
  number.
- The repository does not state a single owner for the support story, runtime-label documentation,
  or a future manifest migration, so those recommendations remain conditional rather than proven
  implementation tasks.

## Exhausted Approaches

- Repo-wide blocking Markdown lint.
- Global rename of all six provenance files without a semantic owner decision.
- Roster string-membership scan as a substitute for behavior tests.
- README path scan as semantic coverage.
- One generic blocking suite for facts owned by the plugin, shell mirror, README contract, and
  review workflow.

## Ruled-Out Directions

- Treat the 100-character width as either a universal blocking rule or a concept that can be
  retired wholesale without first choosing between those policy targets.
- Treat the two manifest validators as drift solely because their contracts differ.
- Treat a packet-resident executable path as a runtime default-input dependency when callers pass
  explicit test arguments.
- Treat six same-named files as review-only artifacts without reading their headers or callers.
- Treat host hook registration, a path in DOCS, or a roster string as proof of runtime delivery.

## Divergence Frontier

The first report's recommendations are provisional. The final frontier is whether a source-contract
test is cheaper and more truthful than a generic document scan, whether the manifest rename is
worth its path and historical-record blast radius, and whether line-width retirement means “no
blocking gate” or “remove every soft 100-ish convention.” The evidence supports the narrower
no-gate, targeted-contract, and keep-the-ledgers positions; the broader alternatives require an
explicit owner or policy decision.

## Next Focus

Phase synthesis: combine the two completed iterations, preserve the five conditional disagreements,
and record `stopReason: maxIterationsReached` without treating the convergence telemetry as an early
stop.

## Active Risks

- The first report's measured corpus counts are not reproducible from the synthesis alone.
- A legacy projection produced by the append gateway does not retain model route-proof fields, so
  the lineage must preserve a canonical route-proof state record locally.
- The global scope of a manifest rename is ambiguous because the same basename is used by six
  goal-touch ledgers while the workflow treats it as an optional review scope input.
- No operator incident, authoritative owner map, or explicit policy statement resolves the
  remaining naming, retrieval, and width disagreements; these are `thin evidence` or
  `underspecified`, not averaged findings.

## Blocked Stops

None.
