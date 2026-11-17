# Iteration 001: A11 malformed detail, doctor phrase domain, and create Gate 3 wording

## Dispatcher

- Lineage `doctor-docs-4`, session `fanout-doctor-docs-4-1794669272137-9v23rz`, generation 1, lineage mode `new`.
- Mode: review. Focus dimension: `correctness`. Budget profile: `verify`.
- Operator review focus: pass-four review of the doctor-docs area under `review-brief-4.txt`, including the five checks it names. This iteration addresses it by reading the four changed files, tracing the A11 detail to its consumer and repair contract, confirming the removed doctor phrases are gone from the derived bridge data, and checking the create presentation against the canonical Gate 3 constant and the workflow that consumes its answer.
- Steering: `steer.md` is absent in the lineage directory; no ruling was available to apply.
- Sources read: `review-brief-4.txt:1`, `review-scope-4.txt:1-30`, `agents-md-check.cjs:205-249,690-879,975-1034`, `agents-md-check.test.cjs:720-782`, `_routes.yaml:1-360,360-479,480-749,750-828`, `create-skill-presentation.txt:1-169`, `doctor-agents-md-presentation.txt:240-288`, `doctor-agents-md-check.yaml:1-69`, `agents-md-embed.cjs:770-824`, `create-skill-auto.yaml:80-239,450-529`, `create-skill-confirm.yaml:500-534`, `sk-skill.md:1-72`, `spec-gate-core.mjs:154`, `gate-3-menu-parity.test.mjs:1-57`, `doctor-helper-handoff.ts:1-188`, `doctor-helper-handoff.vitest.ts:112-133`, `command-bridges.generated.json` (queried as data), `folder-structure.md:99-152`, and the packet's `goal.md:216`, `014-review-remediation/tasks.md:115`, `014-review-remediation/acceptance-criteria.md:72`.

## Files Reviewed

- `.skilled/commands/doctor/scripts/agents-md-check.cjs:798-809` (A11 detail construction; row output at `:975` and JSON at `:998`)
- `.skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs:742-765` (the new detail assertion and malformed fixture)
- `.skilled/commands/doctor/_routes.yaml:396-406,797-806` (removed setup and update phrases)
- `.skilled/commands/create/assets/create-skill-presentation.txt:86-90` (Q3 option C)
- `.skilled/commands/doctor/assets/doctor-agents-md-presentation.txt:258-283` (A11 troubleshooting and next-step repair)
- `.skilled/commands/doctor/assets/doctor-agents-md-check.yaml:52-69` (the "repair for each finding" route contract)
- `.skilled/commands/doctor/scripts/agents-md-embed.cjs:782-804` (the router repair the presentation points at)
- `.skilled/commands/create/sk-skill.md:30-41` (presentation-contract routing)
- `.skilled/commands/create/assets/create-skill-auto.yaml:465-480` and `create-skill-confirm.yaml:511-526` (context save condition)
- `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:154` (canonical option C)
- `.skilled/skills/system-spec-kit/runtime/tests/hooks/gate-3-menu-parity.test.mjs:20-57` (parity guard)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/doctor-helper-handoff.ts:37-38,168-188` and its test `:112-133` (route-phrase consumer)
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json` (the derived bridge data)
- `.skilled/skills/system-spec-kit/references/structure/folder-structure.md:99-152` (sub-track declaration rule)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **A11's malformed-row finding has no specific repair, while the A11 troubleshooting row points at a tool that cannot fix it** -- `.skilled/commands/doctor/assets/doctor-agents-md-presentation.txt:267` -- The A11 row says "A11 reports missing router rows" and names `/doctor:agents-md embed`, which "adds the shipped rows that are missing and touches no other row" (`agents-md-embed.cjs:794`). The changed detail now makes a malformed row a finding with zero missing rows (`agents-md-check.cjs:798-809`), so the A11-specific repair is inapplicable; a rerun leaves the finding. The generic FINDING row at `:262` still says to read the detail and fix the requirement, which is why this is an advisory docs gap rather than a blocker.

   - Case: a consumer's `REPO RULES.md` trigger row has four cells where the header has three and still carries its rule path. A11 prints `0 shipped row(s) missing, 1 malformed row(s); [repo-rules summary] (FINDING)`; the A11 troubleshooting row tells the operator to run `/doctor:agents-md embed`; embed adds no row because nothing is missing and reports "no other row was touched"; the malformed row remains and the rerun reports the same finding.
   - Finding class: `class-of-bug` (the presentation's A11 repair mapping, so a future finding cause of the same class is not left without a named repair)
   - Scope proof: `rg -n "A11|missing router rows|malformed" .skilled/commands/doctor/assets/doctor-agents-md-presentation.txt` finds one A11-specific row at `:267`; the only other repair is the generic FINDING row at `:262`. `agents-md-embed.cjs:782-804` shows the router repair only calls `addRouterRows` and never rewrites an existing row.
   - Affected surface hints: ["A11 row", "doctor-agents-md troubleshooting table", "agents-md-embed addRouterRows", "manual-testing-playbook doctor-agents-md-check"]
   - Recommendation: extend the A11 row to name the malformed case and the actual repair (correct the row's cell count in `REPO RULES.md`), or state that embed only adds missing rows and cannot rewrite a malformed one.
   - Adjudication: confidence 0.82; downgrade trigger: if the generic `A FINDING` row at `:262` is accepted as the named repair for every A11 cause, downgrade this to a documentation observation.

No new P0 or P1 finding exists, so no full Hunter/Skeptic/Referee pass was required; the P2 above was counterchecked against the generic troubleshooting row and the embed engine before recording.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | The changed detail matches the governing alignment item `goal.md:216` (A-2: the detail names the malformed row count, test failed first, 44 of 44) and the T027 contract in `014-review-remediation/tasks.md:115` (malformed line named, no missing line for that rule). The test at `agents-md-check.test.cjs:763-764` pins the new detail. |
| `checklist_evidence` | partial | AC-017 (`014-review-remediation/acceptance-criteria.md:72`) is met for the malformed line and the no-missing case. No checklist row requires a repair mapping for the malformed case, so the P2 is advisory and does not invalidate AC-017. |
| `skill_agent` | notApplicable | The changed files are a doctor command, a route manifest and a create presentation; no skill/agent pair changed. |
| `agent_cross_runtime` | pass | The presentation is plain text read by every runtime; the command routers are mirrored per runtime and none carries the presentation wording. The route manifest's derived bridge data is the cross-runtime scorer surface, and no removed phrase remains in `command-bridges.generated.json`. |
| `feature_catalog_code` | deferred | The feature-catalog description of the doctor routes and the create command is checked in the next traceability pass. |
| `playbook_capability` | partial | `manual-testing-playbook/doctor-commands/doctor-agents-md-check.md:30,102` requires a repair for each finding and treats a finding without its repair as a FAIL. The A11-specific row covers missing rows only; the generic row covers the malformed case only by inference. This is the same P2. |

## Integration Evidence

- `.skilled/commands/doctor/assets/doctor-agents-md-check.yaml:5,59-60` promises the row table "and the repair for each finding"; the engine now emits an A11 finding cause the presentation's A11 row does not name.
- `.skilled/commands/doctor/scripts/agents-md-embed.cjs:782-804` is the write half: it appends missing router rows, prints "no other row was touched", and has no path that corrects an existing row's width.
- `.skilled/commands/doctor/scripts/command-bridges/derive-command-bridges.cjs` derives `command-bridges.generated.json` from `_routes.yaml`; the generated file no longer contains any of the six removed phrases, so the phrase removal reached the advisor surface.
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/doctor-helper-handoff.ts:37-38` loads `_routes.yaml` at run time for `/doctor:helper`; `doctor-helper-handoff.vitest.ts:118-128` pins the near-match code-repair and release-note prompts as no-match.
- `.skilled/skills/system-spec-kit/runtime/tests/hooks/gate-3-menu-parity.test.mjs:46-57` checks the presentation's option C line against `GATE_3_CHOICE_RELATED` (`spec-gate-core.mjs:154`); the changed line contains the constant verbatim.

## Edge Cases

- A malformed row that also loses its rule path is counted in both `missing` and `malformed`; the detail reports both counts for one physical line, and the `lines` list names both symptoms. The detail is not false, but an operator can read it as two rows; this is a reporting edge, not a state error.
- A checker failure with zero missing and zero malformed rows still reads `0 shipped row(s) missing; the checker fails`; the A11-specific repair row points at embed, which is irrelevant to a checker failure. This predates the changed line and is noted rather than reclassified.
- A related/new sub-track selection in Q3 is a path the operator supplies; the workflow's context save is gated on `spec_path exists` (`create-skill-auto.yaml:467`, `create-skill-confirm.yaml:513`), and the canonical Gate 3 contract makes a new sub-track a proposal the operator approves before its path exists. The presentation repeats the canonical menu text; no new behavior is promised by this line.
- The removed `/doctor:setup` phrases were generic repair words; the remaining phrases ("run the doctor setup checks", "list every check this project has") still cover the route's own requests. The removed `/doctor:update` phrases were release-note questions; "is there a newer release of the toolkit" remains for the update check.
- No changed file contains a runtime branch: the presentation is plain text and the route manifest is consumed identically by every runtime's advisor.

## Confirmed-Clean Surfaces

- A11 count arithmetic is correct for the test's case: `lines` holds each missing entry once and each malformed entry once, so `lines.length - missing.length` is the malformed count; `row()` carries both `detail` and `lines` to text (`:975`) and JSON (`:998`).
- The generated bridge data is synchronized with `_routes.yaml`: none of `tell me what to fix where it fails`, `which checks fail and what to fix`, `show me every check and the fix`, `what changed in the newer release`, `are we on the latest release and what changed`, or `check whether a newer version exists and what changed` remains.
- The create presentation's option C line contains the canonical `GATE_3_CHOICE_RELATED` string exactly, and the parity test's file list includes `create-skill-presentation.txt`.
- Holdout hygiene holds in this iteration: no `command-prompts.jsonl` or `holdout-prompts.jsonl` was opened; the only prompt text seen came from the non-holdout tests and one `split: tune` row already materialized in a scratch artifact.

## Ruled Out

- A P0/P1 in the A11 count logic is ruled out: the count is derived from the same arrays that produce the printed lines, and the test's malformed row keeps its rule path so it is not double-counted as missing (`agents-md-check.test.cjs:761-762`).
- A cross-runtime defect in the changed create presentation is ruled out: the line is plain text, the canonical constant is shared, and the parity test covers it.
- A P1 on the removed doctor phrases is ruled out: the remaining phrases cover each route's core requests, the derived bridge data is in sync, and the hand-off tests pin the generic repair/release prompts as no-match.
- A P1 on the new sub-track wording is ruled out: the canonical Gate 3 menu and `suggest-subtracks.mjs` own sub-track creation, and the create workflow consumes an existing `spec_path` rather than promising to create one.
- A transcript-scorer phantom-count finding is ruled out as out of area: the changed files contain no transcript-scoring code; the only scorer-facing change is the manifest-to-bridge data checked above.

## Next Focus

- Dimension: security + traceability (rotation; the 3-iteration cap requires combining the two after correctness).
- Focus area: the doctor route mutation classes and phrase reach, the derived bridge policy (`read-only`/`add-only`/`mutates`), the packet's `016`/`025` spec and acceptance docs for these files, the feature-catalog and playbook descriptions, and the cross-runtime command mirrors.
- Reason: iteration 1 found one advisory docs gap; the next pass must prove no question, refusal or command mention can attach a mutating route, and that the changed behavior is traceable to the packet's requirements.
- Rotation status: correctness completed; security and traceability next; maintainability remains for the final pass.
- Blocked/productive carry-forward: carry `DR4-P2-001` for a check that no other doctor doc names a repair for the malformed case.
- Required evidence: `_routes.yaml` mutation classes and phrase lists, the policy derivation in `derive-command-bridges.cjs`, `doctor-helper-handoff.ts` thresholds, the packet's spec/tasks/acceptance docs, the feature catalog, and the manual playbook.
- Recovery note: none.

Review verdict: PASS
