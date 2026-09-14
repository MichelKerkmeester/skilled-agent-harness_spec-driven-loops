# Deep Research Strategy — Session Tracking

Lineage: `live-b` · Session: `fanout-live-b-1789402289626-dt269k` · Generation 1

## 1. OVERVIEW

Persistent plan for this lineage's research run. Per iteration: read `Next Focus`, write iteration
evidence, then refresh the machine-owned sections from the delta. Section 3 is a projection of the
findings registry.

---

## 2. TOPIC

List every exported function of `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts`
with a one-line purpose each, citing `file:line`.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- [x] Which symbols does the module export, and how many of them are functions?
- [x] What is each exported function's purpose, at one line each, with a `file:line` anchor?
- [x] Is each stated purpose borne out by the implementation body and by a real caller?
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Reviewing, judging, or proposing changes to containment behaviour; this run inventories the
  exported surface only.
- Enumerating the module's private helpers, except where a private helper is reached through the
  exported `__internals` object.
- Repository-wide exported-symbol inventory; only this one module is in scope.

---

## 5. STOP CONDITIONS

- Iteration cap reached (`maxIterations: 1`, `stopPolicy: max-iterations`) — primary stop.
- Convergence before the cap is telemetry only for this run: it widens the review angle instead of
  triggering early synthesis.
- Escalate if the module cannot be read or its line anchors disagree with a second read.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

- Which symbols does the module export, and how many of them are functions?
  → Eight functions (`:312`, `:511`, `:772`, `:814`, `:1065`, `:1146`, `:1214`, `:1267`), plus
  three exported constants and twelve exported types/interfaces (iteration 1).
- What is each exported function's purpose, at one line each, with a `file:line` anchor?
  → Eight one-line purposes delivered as a table with declaration line + body span per row
  (iteration 1, `iterations/iteration-001.md` §1.1).
- Is each stated purpose borne out by the implementation body and by a real caller?
  → Yes for all eight, with one caveat recorded: four of them have no non-test caller outside the
  module and rest on the body plus unit tests (iteration 1, §1.4).
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED

- Mechanical count plus full-file read: pairing `grep -c "^export function"` (returns 8) with a
  line-by-line read made the "how many" claim falsifiable and self-checking (iteration 1).
- Reading each function's own doc comment as the purpose source kept every one-liner attributable
  to the author's stated intent rather than to an inference from the identifier (iteration 1).
- Following the import graph one step out to `fanout-run.cjs:2776` converted purpose claims into
  usage claims and surfaced the caller-coverage caveat (iteration 1).
- Recording the file sha256 with the work kept the enumeration pinned to one exact revision
  (iteration 1).
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED

- Feature-catalog cross-check: `feature-catalog/fanout-write-containment/*.md` names none of the
  eight exported functions, so it could not corroborate the inventory (iteration 1).
- Name-derived purpose guessing: wrong for `classifyViolation` (its only in-module use is the
  detection path at `:839`) and wrong for `__internals` (an object, not a function); both were
  corrected by reading the declarations (iteration 1).
- The append-gateway route for state records was evaluated and not used in this lineage; the
  reason and the substitute are recorded in `research.md` §7 and in
  `dispatch-receipts/research-i1-g1.json` (iteration 1).
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

### Feature-catalog corroboration — BLOCKED (iteration 1, 1 attempt)
- What was tried: searching the subsystem's feature-catalog document for the exported names and
  for `BASELINE_MAX*` to cross-check the inventory.
- Why blocked: the document does not carry a function inventory at all.
- Do NOT retry: do not cite the feature catalog as an export inventory or as a cross-check.

### Identifier-name inference — BLOCKED (iteration 1, 1 attempt)
- What was tried: deriving the one-line purposes from the exported names alone.
- Why blocked: it produced two wrong claims (`classifyViolation` reach, `__internals` kind).
- Do NOT retry: purpose claims must be read from the declaration, its doc comment, or its body.
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS

- Counting `__internals` in the asked class: it is an exported object of private helpers, so the
  asked class stays at eight (iteration 1, evidence: `write-containment.ts:1381-1391`).
- Bare declaration-line citations: a single line cannot support a purpose claim, so each row
  carries both the declaration line and the read body span (iteration 1).
- Reading the exported types as part of the answer without labelling: they are reported in a
  separate, clearly delimited section so the asked class boundary stays explicit (iteration 1).
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: exported-function enumeration (mechanical count agrees with full read)
- Pivot lineage: none yet
- Remaining frontier: independent set-diff verification of the enumeration; live quarantine-dir
  spot-check for the two indirectly-reached exports
<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS

- Does an independent enumeration from the `^export` grep alone produce the same eight names and
  the same count? (verification gap, not a coverage gap)
- Do `quarantineViolations` and `revertOutOfScopeViolations` behave in a live fan-out run as their
  doc comments state, beyond what the unit tests assert?
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

Sibling-verification pass: re-derive the export set mechanically in a second lineage, diff the two
name sets, and spot-check the two purpose one-liners whose support is a doc comment plus unit tests
against a real run's `<lineage>/containment/quarantine/` contents.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

- Target: `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts`
  (1391 lines, sha256 `45b462789245b579b19111df028c2a3a534463e2dacdbf1ea01e0b3e79e2a540`,
  anchored to `HEAD cbb1e4ae53`).
- Module intent (header comment): a dispatched leaf's artifact-dir boundary is prompt-only; this
  module makes it structural by diffing the git working tree after a dispatch, with
  preservation-by-default as the remedy. [SOURCE: `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:1-37`]
- Production consumer: `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`
  (import `:2776`, call `:3436`).
- Test surface: `.opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts`.
- `resource_map_present: false` for this lineage; no `resource-map.md` existed in the packet at
  init.

### Bounded Context Snapshot

- Source pointers: module header `:1-37`; export block `:40-250`; body `:300-1391`; exports at
  `:312`, `:511`, `:707`, `:716`, `:772`, `:814`, `:1065`, `:1146`, `:1214`, `:1267`, `:1382`.
- Integration points: `fanout-run.cjs` (baseline before dispatch, enforce after dispatch,
  `unattributableDirs`/`unattributablePaths` exclusions, `containment.mode` from config);
  `runtime/tests/unit/write-containment.vitest.ts`.
- Constraints and risks: the module fails open by design, so an empty result from a broken git
  call is indistinguishable from a clean tree at the call sites; `drainGitContentionWarnings`
  exists precisely to keep that degradation visible. Line numbers are revision-bound.

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 1 (stopPolicy `max-iterations`)
- Convergence threshold: 0.05 on newInfoRatio (telemetry only under this stop policy)
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `new` used; `resume`/`restart` live, `fork`/`completed-continue` deferred
- Machine-owned sections: Sections 3, 6, 7–11A
- Canonical pause sentinel: `.deep-research-pause`
- Current generation: 1
- Started: 2026-09-14T16:12:04Z · Stopped: 2026-09-14T16:12:58Z (`maxIterationsReached`)
