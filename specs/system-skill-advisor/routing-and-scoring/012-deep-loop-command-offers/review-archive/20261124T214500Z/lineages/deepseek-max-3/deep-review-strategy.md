---
title: Deep Review Strategy - 012 deep-loop-command-offers (lineage deepseek-max-3)
description: Runtime strategy for the fan-out lineage deepseek-max-3 of the deep review on packet 012.
trigger_phrases:
  - "deep review strategy lineage deepseek-max-3"
importance_tier: normal
contextType: planning
version: 1.11.1.0
---

# Deep Review Strategy - Session Tracking

## 1. REVIEW CHARTER

- Target: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers (spec-folder)
- Dimensions: correctness, security, traceability, maintainability; traceability is the lead dimension
- Operator review focus: Traceability is the lead focus: finish the spec_code and checklist_evidence protocols. Check every REQ in spec.md (REQ-001 to REQ-053) against the code that implements it or the decision that records it (ADR-001 to ADR-009), and every ticked task in tasks.md and every Met row in acceptance-criteria.md (AC-001 to AC-061) against evidence that really exists in the tree, including the twelfth fix round (T112 to T114). Cover all four configured dimensions, because the coverage gate needs each one recorded before the last iteration. Give correctness, security and maintainability one iteration each within iterations 1 to 4, and spend the rest on traceability. Record every finding's file as its full repo-relative path, such as specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md, never a bare file name. The scope gate matches full paths only. Do not write a terminal_gates row yourself. The orchestrator computes it with terminal-gates.cjs after the run.
- Stop conditions: maxIterations=7 reached (stopPolicy=max-iterations, convergence read as telemetry only)
- Success criteria: every REQ-001..REQ-053 traced to code or a decision record, every ticked task and Met acceptance row traced to evidence that exists in the tree, all four dimensions recorded, and no active P0 left unadjudicated
- Packet: fan-out lineage `deepseek-max-3` under the root review packet `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/`

---

## 2. TOPIC

Review of `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers`: a closed spec packet whose implementation spans the skill-advisor gate (`command-attach.ts`), the Python fallback (`skill_advisor.py`), the render/degraded brief paths, the scorer lanes, the shared fixture corpus, and the closure docs (spec.md, tasks.md, acceptance-criteria.md, implementation-summary.md, decision-record.md).

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Re-litigating the twelve prior fix rounds' design decisions recorded in ADR-001..ADR-009; this review checks whether the decisions are recorded and whether the tree matches them.
- Reviewing sibling packet 013's implementation as a code target (it is read as traceability context only).
- Fixing anything: the review target is read-only.
- Computing terminal gates: the orchestrator runs `terminal-gates.cjs` after the run.

---

## 5. STOP CONDITIONS

- `config.stopPolicy = max-iterations` with `maxIterations = 7`: the loop runs all seven iterations; convergence is telemetry.
- Halt early only on state corruption or a gateway refusal.

---

<!-- ANCHOR:completed-dimensions -->
## 6. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 7. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 1
- P2 (Suggestions): 4
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Reading both gate copies side by side (`command-attach.ts` against `skill_advisor.py`) made the question and past-run predicates directly comparable; the Python copy could be executed in place with no bytecode written, which turned a reading into observed evidence (iteration 1).
- Replaying all 359 shared fixture rows through the Python copy was cheap and confirmed the pinned offer surface before any finding was raised (iteration 1).
- Timing the repeated 10,000-character prompt against the fallback (4 ms ask test, 17 ms mention scan) settled `REQ-030`'s cost claim without a build (iteration 2).
- Following the untrusted prompt from the hook to the CLI and from the handler to the Python child showed one consistent boundary: stdin, argv arrays, no shell (iteration 2).
- Running the packet's own citation checker (`scratch/citations/evidence-tails.py`, read-only) turned every acceptance and task citation into a checked line rather than a reading; it printed `problems=0` (iteration 3).
- Counting the Verification Summary boxes against the rows they count confirmed the summary exactly (12 P0 with 11 ticked, 13 P1, 1 P2) (iteration 3).
- Comparing `spec.md` section 3's change set with `review/fanout-review-scope.txt` found only the gitignored `runtime/dist/` outside the scope, which `T111` excludes by design.
- The kept 69-row probe artifact made `REQ-001` to `REQ-004` a table comparison rather than a reading: 69 ids, every row `ok`/`live`, and zero changed keep or negative rows against the baseline (iteration 4).
- Running the real mirror and reference gates (`sync-runtime-mirrors.cjs --check`, `validate-command-references.cjs`) turned `REQ-007` into observed output: 260 mirrors and 84 asset files, both exit 0 (iteration 4).

---

## 9. WHAT FAILED
- Reading the TypeScript gate alone would have missed the interaction between `ITERATION_COUNT` and the how-to branch, because the count sits in an unrelated clause; the failure surfaced only from an input the fixture does not pin (iteration 1).
- Executing the built native gate was not possible: `dist/` is absent from the tree and building it would write outside the lineage, so native behaviour is source-read rather than observed (iteration 1).

---

<!-- ANCHOR:exhausted-approaches -->
## 10. EXHAUSTED APPROACHES (do not retry)
### A `REQ-015` to `REQ-019` gate regression: every prompt the requirement text names returns its stated result from the fallback. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: A `REQ-015` to `REQ-019` gate regression: every prompt the requirement text names returns its stated result from the fallback.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### A closure-count or citation drift outside `AC-011`: the summary, tails, task boxes and ADR references all agree. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: A closure-count or citation drift outside `AC-011`: the summary, tails, task boxes and ADR references all agree.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### A closure-doc count drift in the Verification Summary: the P0/P1/P2 totals and verified counts match the boxes exactly (iteration 3). -- RULED OUT (iteration 3, 1 attempt)
- What was tried: A closure-doc count drift in the Verification Summary: the P0/P1/P2 totals and verified counts match the boxes exactly (iteration 3).
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### A fixture-count drift in `AC-030` to `AC-032`: every count matches the file. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: A fixture-count drift in `AC-030` to `AC-032`: every count matches the file.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### A fixture/total drift in `AC-044` to `AC-052`: every count matches. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: A fixture/total drift in `AC-044` to `AC-052`: every count matches.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### A missing `REQ-053` import in the scorer: `fusion.ts` imports the constant and builds its naming pattern from it. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: A missing `REQ-053` import in the scorer: `fusion.ts` imports the constant and builds its naming pattern from it.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### A missing declared change-set path in the review scope: only the gitignored `runtime/dist/` is absent, which `T111` excludes by design (iteration 3). -- RULED OUT (iteration 3, 1 attempt)
- What was tried: A missing declared change-set path in the review scope: only the gitignored `runtime/dist/` is absent, which `T111` excludes by design (iteration 3).
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### A missing dimension or an unrecorded protocol: all four dimensions and both core protocols have a full pass. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: A missing dimension or an unrecorded protocol: all four dimensions and both core protocols have a full pass.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### A missing offer section or step 0 in either command document: both are present, with the three options and the recommended form. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: A missing offer section or step 0 in either command document: both are present, with the three options and the recommended form.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### A missing reducer refinement rule (`REQ-032`): the implementation matches the wording. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: A missing reducer refinement rule (`REQ-032`): the implementation matches the wording.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### A missing test title behind `AC-033` to `AC-037`: each named title exists. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: A missing test title behind `AC-033` to `AC-037`: each named title exists.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### A probe-artifact/cell mismatch: every id in the four groups matches, and the baseline comparison shows zero changed rows in the keep and negative groups. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: A probe-artifact/cell mismatch: every id in the four groups matches, and the baseline comparison shows zero changed rows in the keep and negative groups.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### A prototype-pollution or inherited-key read in `modeCommands` / `commands`: both levels are read with `hasOwnProperty` before use (`command-attach.ts:1628-1630`). -- RULED OUT (iteration 1, 1 attempt)
- What was tried: A prototype-pollution or inherited-key read in `modeCommands` / `commands`: both levels are read with `hasOwnProperty` before use (`command-attach.ts:1628-1630`).
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### A quadratic prompt scan in `commandOnlyMentioned`: the occurrence positions are monotonic and `forwardSearch` caches each scan, so the path is linear in the number of namings. -- RULED OUT (iteration 1, 1 attempt)
- What was tried: A quadratic prompt scan in `commandOnlyMentioned`: the occurrence positions are monotonic and `forwardSearch` caches each scan, so the path is linear in the number of namings.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### A regression in `REQ-023` to `REQ-029` and `REQ-035` to `REQ-037`: every named prompt returns its stated result except the interaction recorded as finding 1. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: A regression in `REQ-023` to `REQ-029` and `REQ-035` to `REQ-037`: every named prompt returns its stated result except the interaction recorded as finding 1.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### A regression in the pinned `REQ-015` to `REQ-053` prompt set: every stated prompt matches except the `REQ-036` interaction. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: A regression in the pinned `REQ-015` to `REQ-053` prompt set: every stated prompt matches except the `REQ-036` interaction.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### A second `DEEP_LOOP_DOCTOR_COMMAND` declaration or a scorer copy: one declaration, imported by the scorer (iteration 6). -- RULED OUT (iteration 7, 1 attempt)
- What was tried: A second `DEEP_LOOP_DOCTOR_COMMAND` declaration or a scorer copy: one declaration, imported by the scorer (iteration 6).
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### A second `DEEP_LOOP_DOCTOR_COMMAND` declaration: the `rg` prints one line. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: A second `DEEP_LOOP_DOCTOR_COMMAND` declaration: the `rg` prints one line.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### A stale `evidence-tails.py` checker: it validates the anchor on the cited line, reports a stray `path:line` citation outside a tail, and exits non-zero on any problem; it printed `problems=0` on both docs (iteration 3). -- RULED OUT (iteration 3, 1 attempt)
- What was tried: A stale `evidence-tails.py` checker: it validates the anchor on the cited line, reports a stray `path:line` citation outside a tail, and exits non-zero on any problem; it printed `problems=0` on both docs (iteration 3).
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### A stale `T113` scope: REQ-025 no longer names the removed caller, ADR-007 is scoped to the hub alias lists, and the timeline carries generation 8. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: A stale `T113` scope: REQ-025 no longer names the removed caller, ADR-007 is scoped to the hub alias lists, and the timeline carries generation 8.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### A TypeScript/Python pattern divergence: the two copies use equivalent bounded-window searches (`LEAD_WINDOW`/`_LEAD_WINDOW` = 400, `endsBefore` vs `search(pos,end)`), and every fixture row agreed; no divergence was found. -- RULED OUT (iteration 1, 1 attempt)
- What was tried: A TypeScript/Python pattern divergence: the two copies use equivalent bounded-window searches (`LEAD_WINDOW`/`_LEAD_WINDOW` = 400, `endsBefore` vs `search(pos,end)`), and every fixture row agreed; no divergence was found.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### Command injection through the prompt: no shell string is built from prompt text anywhere on the offer path; the only spawns use argv arrays and stdin. -- RULED OUT (iteration 2, 1 attempt)
- What was tried: Command injection through the prompt: no shell string is built from prompt text anywhere on the offer path; the only spawns use argv arrays and stdin.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### Prototype pollution through a child-supplied recommendation object: `isRecord` rejects arrays and non-objects, and every field is read by name with a type check (`subprocess.ts:163-230`). -- RULED OUT (iteration 2, 1 attempt)
- What was tried: Prototype pollution through a child-supplied recommendation object: `isRecord` rejects arrays and non-objects, and every field is read by name with a type check (`subprocess.ts:163-230`).
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### Regex injection through a tracked command name: the naming patterns escape every command spelling with `escapePhrase` (`command-attach.ts:1467-1469`), and the command grammar admits only `[a-z0-9_:-]`. -- RULED OUT (iteration 2, 1 attempt)
- What was tried: Regex injection through a tracked command name: the naming patterns escape every command spelling with `escapePhrase` (`command-attach.ts:1467-1469`), and the command grammar admits only `[a-z0-9_:-]`.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### Secret exposure through the hook child: `childEnvForCli` forwards the caller's environment to the repo's own CLI, adds only the socket dir and the prompt-time marker, and no prompt text is placed in the environment (`skill-advisor-cli-fallback.ts:207-213`). -- RULED OUT (iteration 2, 1 attempt)
- What was tried: Secret exposure through the hook child: `childEnvForCli` forwards the caller's environment to the repo's own CLI, adds only the socket dir and the prompt-time marker, and no prompt text is placed in the environment (`skill-advisor-cli-fallback.ts:207-213`).
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### Visual spoofing of a rendered command with bidi or zero-width characters: `sanitizeSkillLabel` does not strip bidi controls, but the `command` field it prints is not prompt-derived on any current caller (the native handler passes an internal table command; the Python child passes its own tracked rows), so no attacker-controlled value reaches it. Recorded as a hardening gap if a future caller ever forwards a model-supplied command string, not an active finding. -- RULED OUT (iteration 2, 1 attempt)
- What was tried: Visual spoofing of a rendered command with bidi or zero-width characters: `sanitizeSkillLabel` does not strip bidi controls, but the `command` field it prints is not prompt-derived on any current caller (the native handler passes an internal table command; the Python child passes its own tracked rows), so no attacker-controlled value reaches it. Recorded as a hardening gap if a future caller ever forwards a model-supplied command string, not an active finding.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
- A TypeScript/Python pattern divergence in the bounded-window search: `endsBefore` and `_ends_before` read the same 400-character window and all fixture rows agree (iteration 1, evidence: `command-attach.ts:793`, `skill_advisor.py:5240`).
- A prototype-pollution read through `modeCommands`/`commands`: both levels are own-key checked before use (iteration 1, evidence: `command-attach.ts:1628`).
- A quadratic scan in `commandOnlyMentioned`: forward searches are monotonic and cached (iteration 1, evidence: `command-attach.ts:1435`).
- Command injection on the offer path: prompt text is written to stdin by both spawn sites, argv arrays are used, and no shell string is built (iteration 2, evidence: `skill-advisor-cli-fallback.ts:276`, `subprocess.ts:283`).
- Secret exposure through the hook child environment: the child receives the caller's own environment plus two markers and no prompt text (iteration 2, evidence: `skill-advisor-cli-fallback.ts:207`).
- Bidi or zero-width spoofing of a printed command: the sanitizer does not strip bidi controls, but no current caller forwards a prompt-derived command string, so there is no reach (iteration 2).

---

<!-- ANCHOR:next-focus -->
## 12. NEXT FOCUS
- Dimension: none remaining
- Focus area: synthesis — the findings registry, the review report and the planning packet
- Reason: the configured iteration cap is reached; the coverage and evidence gates are satisfied and both core protocols read `pass`
- Rotation status: all four dimensions complete; no further iteration is configured
- Blocked/productive carry-forward: the active P1 and four P2s are carried into synthesis unchanged
- Required evidence: the registry's open-finding set and the iteration files

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `spec.md` (REQ-001..REQ-053), `decision-record.md` (ADR-001..ADR-009), `tasks.md` (T001..T114), `acceptance-criteria.md` (AC-001..AC-061), `implementation-summary.md`, `plan.md`, `timeline.md`; implementation surfaces in `.skilled/skills/system-skill-advisor/runtime/` and the deep command files under `.skilled/commands/deep/`.
- Behavior claims: the deep-loop offer gate attaches `/deep:review` or `/deep:research` only for run asks; refusals, questions, past runs, complaints and mode-free asks withhold it; native and Python copies agree; the degraded brief renders plain `(ask)`; the review reducer keeps refinements from other files and the strategy's section numbering.
- Reuse and conventions: shared fixture `runtime/tests/fixtures/deep-loop-offer-cases.json` drives both vitest and pytest suites; `VOCABULARY_PAIRS`/`PATTERN_PAIRS` drift guards pin the two implementations together.
- Review risks and gaps: twelve fix rounds mean the closure docs carry line-number citations that may drift; the twelfth round (T112-T114) is the newest and least re-checked evidence.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | - | - |
| `checklist_evidence` | core | pending | - | - |
| `skill_agent` | overlay | pending | - | - |
| `agent_cross_runtime` | overlay | pending | - | - |
| `feature_catalog_code` | overlay | pending | - | - |
| `playbook_capability` | overlay | pending | - | - |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/changelog/skilled/v4.2.0.0.md` | [] | - | - | pending |
| `.skilled/commands/deep/assets/deep-research-presentation.txt` | [] | - | - | pending |
| `.skilled/commands/deep/assets/deep-review-presentation.txt` | [] | - | - | pending |
| `.skilled/commands/deep/research.md` | [] | - | - | pending |
| `.skilled/commands/deep/review.md` | [] | - | - | pending |
| `.skilled/hooks/injection-contract.md` | [] | - | - | pending |
| `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts` | [] | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts` | [] | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | [] | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/lib/render.ts` | [] | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` | [] | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts` | [] | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts` | [] | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | [] | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` | [] | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-attach.vitest.ts` | [] | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-brief-golden.vitest.ts` | [] | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-head-length.vitest.ts` | [] | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts` | [] | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json` | [] | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py` | [] | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/render-child-session.vitest.ts` | [] | - | - | pending |
| `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md` | [] | - | - | pending |
| `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md` | [] | - | - | pending |
| `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md` | [] | - | - | pending |
| `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/plan.md` | [] | - | - | pending |
| `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md` | [] | - | - | pending |
| `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md` | [] | - | - | pending |
| `specs/system-skill-advisor/routing-and-scoring/013-deep-loop-offer-in-hint/implementation-summary.md` | [] | - | - | pending |
| `specs/system-skill-advisor/routing-and-scoring/013-deep-loop-offer-in-hint/plan.md` | [] | - | - | pending |
| `specs/system-skill-advisor/routing-and-scoring/013-deep-loop-offer-in-hint/spec.md` | [] | - | - | pending |
| `specs/system-skill-advisor/routing-and-scoring/013-deep-loop-offer-in-hint/tasks.md` | [] | - | - | pending |
| `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` | [] | - | - | pending |
| `.skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs` | [] | - | - | pending |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/reduce-state-refinement-other-file.vitest.ts` | [] | - | - | pending |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/synthesis-closeout-refinements.vitest.ts` | [] | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` | [] | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts` | [] | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/cli-degraded-command-contract.vitest.ts` | [] | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-recommend-typed-command.vitest.ts` | [] | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/deep-loop-ask-routing.vitest.ts` | [] | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/doctor-handoff-command.vitest.ts` | [] | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/multi-typed-command-gates.vitest.ts` | [] | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/stage-one-loop-subject.vitest.ts` | [] | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/subprocess-typed-fields.vitest.ts` | [] | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/typed-on-stuck-serving.vitest.ts` | [] | - | - | pending |
| `.skilled/skills/system-deep-loop/deep-review/scripts/tests/reduce-state-traceability-and-refines.test.cjs` | [] | - | - | pending |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-state-reducer.vitest.ts` | [] | - | - | pending |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-strategy-heading.vitest.ts` | [] | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-recommend-duplicate-command.vitest.ts` | [] | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/deep-loop-plural-noun.vitest.ts` | [] | - | - | pending |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-strategy-numbering.vitest.ts` | [] | - | - | pending |
| `.skilled/skills/system-deep-loop/runtime/tests/fixtures/golden-review-default/next-focus.txt` | [] | - | - | pending |
| `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/timeline.md` | [] | - | - | pending |
| `.skilled/commands/deep/assets/compiled/README.markdown` | [] | - | - | pending |
| `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown` | [] | - | - | pending |
| `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown` | [] | - | - | pending |
| `.skilled/commands/deep/assets/deep-research.yaml` | [] | - | - | pending |
| `.skilled/commands/deep/assets/deep-review.yaml` | [] | - | - | pending |
| `.skilled/skills/system-deep-loop/ROUTER.md` | [] | - | - | pending |
| `.skilled/skills/system-deep-loop/SKILL.md` | [] | - | - | pending |
| `.skilled/skills/system-deep-loop/deep-research/SKILL.md` | [] | - | - | pending |
| `.skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md` | [] | - | - | pending |
| `.skilled/skills/system-deep-loop/deep-review/SKILL.md` | [] | - | - | pending |
| `.skilled/skills/system-deep-loop/graph-metadata.json` | [] | - | - | pending |
| `.skilled/skills/system-deep-loop/hub-router.json` | [] | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl` | [] | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json` | [] | - | - | pending |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/next-focus-iteration-verdict.vitest.ts` | [] | - | - | pending |
| `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/ac034-served-head.jsonl` | [] | - | - | pending |
| `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/citations/cites.py` | [] | - | - | pending |
| `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/citations/evidence-tails.py` | [] | - | - | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 7
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-deepseek-max-3-1795552859377-13gxwk, parentSessionId=None, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=['spec_code', 'checklist_evidence'], overlay=['skill_agent', 'agent_cross_runtime', 'feature_catalog_code', 'playbook_capability']
- Started: 2026-11-24T20:42:01.000Z
<!-- MACHINE-OWNED: END -->
