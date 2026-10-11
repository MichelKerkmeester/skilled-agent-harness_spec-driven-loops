---
title: "Deep-Research Strategy: playbook and catalog truth"
description: "Session strategy for the ten-iteration deep-research run on how playbook scenarios and feature catalog entries can check themselves against the code."
trigger_phrases:
  - "playbook catalog truth strategy"
importance_tier: normal
contextType: planning
---

# Deep Research Strategy - Session Tracking Template

Runtime template copied to `{spec_folder}/research/` during initialization. Tracks research progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep research session. Records what to investigate, what worked, what failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{spec_folder}/research/deep-research-strategy.md` and populates Topic, Key Questions, Known Context, and Research Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus.
- **Mutability:** Mutable — analyst-owned sections remain stable, while machine-owned sections are rewritten by the reducer after each iteration. Section 3 is a generated projection from the reducer registry.
- **Protection:** Shared state with explicit ownership boundaries. Orchestrator validates consistency on resume.

### Question Injection Surface

Use `{spec_folder}/research/inbox.jsonl` to append external questions during an active run. Each line is one JSON object with:

- `id`: stable inbox record identifier
- `text`: question text to promote
- `source`: concrete source label, such as an angle bank entry, analyst strategy, or operator note
- `origin`: one of `angle-bank`, `analyst-strategy`, `operator`, or `legacy-import`
- `injectedAtIteration`: iteration number when the question was introduced
- `promotedQuestionId`: promoted registry question id, or `null` until promotion

The reducer reads the inbox on every reduce step and carries `origin` into the question registry and dashboard badges. Direct edits to Section 3 still work as a compatibility path, but they are attributed as `legacy-import`.

Question ownership is explicit:

- Inbox rows are immutable input.
- The reducer registry is canonical question state.
- Section 3 is rendered only from the registry view.

When an inbox row targets an existing registry question but carries different text, the reducer keeps the registry value, records `operatorDecision: needs_decision`, and appends a `question_conflict` event with both `inboxValue` and `registryValue`.

---

## 2. TOPIC
Find the lightest way to make manual-testing playbook scenarios and feature catalog entries check themselves against the code, through the sk-create-manual-testing-playbook and sk-create-feature-catalog modes and their validators: where they drift from the code today and what catches it, the lightest self-check that tests a scenario options and expected answers and a catalog entry code anchors against the code, and which drift classes that check would still miss

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Q1: Where do manual-testing playbook scenarios and feature catalog entries drift from the code today, and what, if anything, catches that drift?
- [x] Q2: What do the sk-create-manual-testing-playbook and sk-create-feature-catalog validators check today, and which of those checks touch the code rather than the document shape?
- [x] Q3: What is the lightest self-check the two modes and their validators can run so a scenario's options and expected answers, and a catalog entry's code anchors, are tested against the code?
- [x] Q4: Which drift classes would that lightest check still miss, and what would catch each one?
- [x] Q5: Which existing scripts, validators or checks elsewhere in the repository could be extended in place instead of adding a new one?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Changing any playbook, catalog, mode or validator. Fixes are a later phase.
- Fixing the DOC-331 deep-loop admission scenario itself; a separate fix is in flight.
- New services, databases or runners. The brief rules out heavy new machinery.

---

## 5. STOP CONDITIONS
- Stop policy is max-iterations: all 10 iterations run; convergence is telemetry only.
- Halt only on a gateway refusal, a lost lock or three consecutive dispatch errors.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1: Where do manual-testing playbook scenarios and feature catalog entries drift from the code today, and what, if anything, catches that drift?
- Q2: What do the sk-create-manual-testing-playbook and sk-create-feature-catalog validators check today, and which of those checks touch the code rather than the document shape?
- Q3: What is the lightest self-check the two modes and their validators can run so a scenario's options and expected answers, and a catalog entry's code anchors, are tested against the code?
- Q4: Which drift classes would that lightest check still miss, and what would catch each one?
- Q5: Which existing scripts, validators or checks elsewhere in the repository could be extended in place instead of adding a new one?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Q4: Which drift classes would that lightest check still miss, and what would catch each one? (iteration 1)
- Q5: Which existing scripts, validators or checks elsewhere in the repository could be extended in place instead of adding a new one? (iteration 1)
- Q3: What is the lightest self-check the two modes and their validators can run so a scenario's options and expected answers, and a catalog entry's code anchors, are tested against the code? (iteration 1)
- None of the five strategy key questions remain open. Residue for synthesis, not new questions: the implementation-ready spec (check codes, insertion points, fixtures) and an estimate of the prefix-rule false-positive rate over the corpus. (iteration 4)
- None. The five strategy key questions remain closed, and the residue items carried since iteration 4 are now measured or resolved. What is left is synthesis work, not open questions: assemble the check codes, insertion points and fixtures into the implementation-ready spec, and decide (outside this research) whether to wire the catalog fixture test into CI. (iteration 5)
- None open. The synthesis residue now has a second live fixture: the wrong-line citation at `code-standards-alignment.md:76` (F1) joins the literal-naming Expected/Evidence truncation case, alongside the `--phase-count` replay, for the implementation-ready spec to use. (iteration 6)
- None open. The synthesis residue now carries a concrete fixture set: F1's stale-anchor cluster (`schemas:221`↔268, `status:89-94`↔344, `cli:1420-1440`↔1500) with the loose trio (handler/fallback/manifest) as near-miss fixtures; the corrected existence scan with its own `.json`→`.js` truncation as an extractor regression test; and the `.pi` plus archive scoping boundaries to state, not absorb. (iteration 7)
- None open. Synthesis residue additions for the implementation-ready spec: the playbook-side taxonomy (102 dead inline citations split 30 placeholder/glob, 30 historical provenance, 10 runtime/generated, 10 migrated-named, 22 other) with the "inline-only" scope for playbooks since links are already gated; the new live fixture at `spec-folder-literal-naming-create-sh-fallback.md:138`; the backtick-separated `file` line N` extractor case; the `--trace-warnings` false-positive fixture; and the Expected-excerpt vs Evidence-full consequence (assertion extraction, execution keeps the semantic tier). (iteration 8)
- Rate denominators to restate in the final packet: all playbook-side rates use 1,465 files / 12,959 inline instances / 3,952 distinct tokens. (iteration 9)
- No open questions. Synthesis residue for the implementation-ready spec, updated: corpus scope = exact `manual-testing-playbook` trees under `.skilled/skills`; base-resolution ladder in order repo root -> specs fallback -> skill root -> skill/scripts -> skill/runtime -> skill-subtree basename -> global basename, with trailing-argument and anchor stripping; expected-unresolved families = placeholder/glob, scratch paths, historical provenance, runtime/generated, migrated-named, annotated removals, directory targets, code-fence artifacts; anchor formats = `path:line`, `path:start-end`, inline backticked, prose file-line-N, markdown links resolved per-file; checks = existence (warn), bounds (objective, 0 corpus fires), token-at-line (warn-only, judgment-bound); fixtures = stale trio plus new `tools/index.ts:59` case, spec-folder-mutex 10->22, prose set of 13, guard missing-link target, and the extractor regression set; insertion points = `validate-playbook-package.cjs` for the playbook side and `validate_catalog_package.py` for the catalog side, with the CI wiring decision still the operator's. (iteration 9)
- No open questions. Final residue for the implementation-ready spec, updated by this iteration: (a) resolution order = repo root -> `.skilled` prefix -> file-relative -> specs prefix -> skill root -> skill/scripts -> skill/runtime -> top-skill root -> subtree-suffix -> global basename, with `os.path.normpath` applied to every relative token before joining; (b) catalog scope split = 2 of 29 packs carry `path:line` anchors (objective tier), the other 27 need an existence/link tier if covered; (c) fixture set grows by the sk-design missing diagram assets, the council `tool-input-schemas.ts` pair, the sk-git absent basenames (watch-only), and the `../` normpath regression; (d) fresh-sample false-positive estimate is 3.5% (153/4,384) under the corrected ladder, against iteration 9's 13% corpus-wide estimate under its own ladder — both estimates carry their ladder and scope. Rate denominators: corpus-wide figures stay 1,465 files / 12,959 inline instances / 3,952 distinct tokens; this iteration's fresh-sample figures are 663 files / 4,384 tokens and are not comparable to the corpus rates. (iteration 10)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Prior work surfaced by the ripgrep recipe (file reads only):

- `specs/sk-code/011-sk-code-poinytail-based-refinement/018-create-sh-unknown-options/spec.md:59` records the `--phase-count` drift: the literal-naming playbook scenario and its feature catalog entry passed an option that never existed, and `create.sh` accepted it silently.
- `specs/sk-code/011-sk-code-poinytail-based-refinement/016-residual-closeout/spec.md:83` records the drifted DOC-331 deep-loop admission scenario whose expected answer disagreed with the router.
- The parent `020-open-ends-research/spec.md` names deep reviews that left the catalog-to-code traceability check "pending".

### Bounded Context Snapshot

- Source pointers: `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/`, `.skilled/skills/sk-doc/sk-create-feature-catalog/`, their templates and validators; existing `manual-testing-playbook/` and `feature-catalog/` trees under `.skilled/skills/*/`.
- Reuse candidates: existing sk-doc validators and any doc-drift checks under `.skilled/skills/system-deep-loop/runtime/scripts/` and `.skilled/skills/system-spec-kit/`.
- Integration points: the two modes' validators; the playbook and catalog templates.
- Constraints and risks: read-only research; every recommendation must pass `.skilled/repo-rules/prevent-overengineering.md`.

resource-map.md not present; skipping coverage gate


---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `{spec_folder}/research/inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability matrix doc: `.skilled/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Capability resolver: `.skilled/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-10-11T16:24:27.869Z
