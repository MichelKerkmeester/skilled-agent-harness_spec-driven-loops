# Deep Review Report - scorer-attach-2 lineage (pass two)

- Target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`
- Lineage: `scorer-attach-2` (pass-two fan-out), session `fanout-scorer-attach-2-1794570021136-noekp0`, generation 1
- Prior pass: `review/review-report-pass-1.md` (43 merged findings); pass-one lineage summary for this area: `review/lineages/scorer-attach/review-report.md`
- Dimensions: correctness, security, traceability, maintainability (plus one cross-cutting sweep)
- Iterations: 5 of 7; `newFindingsRatio` 1.00, 1.00, 1.00, 1.00, 0.00 → converged at iteration 5 below the 0.10 threshold
- Verdict: **PASS** with 5 active P2 advisories (`hasAdvisories = true`)

## 1. Executive summary

Pass two's first job was to re-read every pass-one fix in this area. Five fixes sat in the
scorer-attach area, and all five hold on the current code:

| Pass-one id | Fix | Current evidence |
|---|---|---|
| `R2-P2-001` | hub attach honours the no-edit wording | `lib/command-attach.ts:329`, pinned by `tests/command-attach-guards.vitest.ts:25-28` |
| `R1-P2-001` | deep-loop gate opens only for the typed command being attached | `lib/command-attach.ts:343-346`, pinned by `:41-51` including the `/deep:reviw` case |
| `R1-P2-002--95282927956e` | a file name is not a typed command | `lib/command-attach.ts:217-219`, pinned by `:59-81` |
| `R4-P2-001--d1528b81a2ca` | `COMMAND_POLICIES` deleted; `TRACKED_COMMANDS` is the live table | no source reference remains; `tests/command-attach-guards.vitest.ts:85-87` asserts the export is gone |
| `R4-P2-002--828881666f76` | empty semantic-search branch deleted | no empty `if` body in `lib/scorer/fusion.ts` |

The changed surface then produced five new P2 advisories, all small and all in two themes. Three are
assurance gaps: a gate assertion whose fixture cannot reach the gate (`SA2-P2-001`), a privacy test
whose fixture stores nothing private (`SA2-P2-003`), and a generated-code escaper that does not
escape a line break (`SA2-P2-005`, latent — no authored value carries one today). Two are wording or
documentation gaps on the safety path: the no-edit pattern does not match "don't change" or
"no changes" (`SA2-P2-002`), and the command-bridges README describes the generated row without the
`mutating` field that the child-session rule reads (`SA2-P2-004`).

None of these blocks release. The mutating-command question was re-proven by execution, not by
reading: 56 `COMMAND_ROWS`, 19 with policy `run`, 0 carrying `mutating: 'mutates'`, and 0 policy or
owner mismatches against `TRACKED_COMMANDS` for the 52 commands both tables hold. Every command the
no-edit gap can still attach is `start` or `ask`, so the residual wording gap is a wrong-offer risk,
not a wrong-write risk.

**Operator review focus (verbatim):** pass two; first re-read the pass-one fix in each file marked
changed, then review every changed file line by line for a defect the fix introduced, then look for
new defects; every finding P0/P1/P2 with file:line and a concrete input; never read or print holdout
prompt text; change no code; write only inside the lineage folder.

## 2. Planning trigger

- `/speckit:plan` required: **no**. No active P0 and no active P1; promotion gate is PASS.
- Recommended: yes, as one small cleanup packet. Four of the five advisories are one-line or
  one-sentence fixes, and two of them are corrections to text or tests added by this change.
- Not recommended: reopening the command-surfacing design. The route-derived attach contract, the
  policy ladder and the single-mode rule were re-read or re-executed this pass and hold.

```json
{
  "triggered": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": [
    {"id": "SA2-P2-001", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/system-skill-advisor/runtime/tests/command-attach.vitest.ts:120", "findingClass": "vacuous_test_assertion"},
    {"id": "SA2-P2-002", "severity": "P2", "dimension": "security", "file": ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:289", "findingClass": "security_policy_vocabulary_gap"},
    {"id": "SA2-P2-003", "severity": "P2", "dimension": "security", "file": ".skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-status.vitest.ts:493", "findingClass": "vacuous_privacy_assertion"},
    {"id": "SA2-P2-004", "severity": "P2", "dimension": "traceability", "file": ".skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/README.md:50", "findingClass": "doc_code_field_drift"},
    {"id": "SA2-P2-005", "severity": "P2", "dimension": "maintainability", "file": ".skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:957", "findingClass": "generated_code_escape_gap"}
  ],
  "remediationWorkstreams": [
    {"id": "W1", "title": "Test precision on the two guards that cannot fail", "findings": ["SA2-P2-001", "SA2-P2-003"], "size": "two test files"},
    {"id": "W2", "title": "Widen the no-edit vocabulary and document the row's mutating field", "findings": ["SA2-P2-002", "SA2-P2-004"], "size": "one constant, one sentence"},
    {"id": "W3", "title": "Escape line breaks in the TypeScript emitter", "findings": ["SA2-P2-005"], "size": "three lines"}
  ],
  "specSeed": [
    "Record that the no-edit gate's vocabulary is the safety boundary and list the accepted phrasings.",
    "Record that generated string literals must escape every character that ends a single-quoted TypeScript literal."
  ],
  "planSeed": [
    "Add `'sk-create-benchmark'` to the injected table at `command-attach.vitest.ts:120` so the assertion reaches the gate.",
    "Persist a diagnostic record carrying `errorDetails: 'secret@example.com'` before the privacy assertion at `advisor-status.vitest.ts:493`.",
    "Extend `NO_EDIT_REQUEST` with the contracted and noun forms, then run `command-attach-guards.vitest.ts` and the scorer suite.",
    "Add `mutating` to the `COMMAND_ROWS` row-shape sentence in `command-bridges/README.md:50`.",
    "Escape `\\n`, `\\r`, `\\u2028` and `\\u2029` in `tsString`, regenerate, and run the drift guard."
  ],
  "findingClasses": ["vacuous_test_assertion", "security_policy_vocabulary_gap", "vacuous_privacy_assertion", "doc_code_field_drift", "generated_code_escape_gap"],
  "affectedSurfacesSeed": ["command attach gate", "command attach test suite", "advisor_status privacy guard", "generated command tables", "command-bridges README"],
  "fixCompletenessRequired": true
}
```

## 3. Active finding registry

| Id | Severity | Dimension | Location | Title | Finding class |
|---|---|---|---|---|---|
| SA2-P2-001 | P2 | correctness | `runtime/tests/command-attach.vitest.ts:120` | The gate assertion passes a table that does not hold the requested mode, so it cannot reach the gate | vacuous_test_assertion |
| SA2-P2-002 | P2 | security | `runtime/lib/command-attach.ts:289` | `NO_EDIT_REQUEST` misses "don't change" and "no changes", so a writing command is still offered | security_policy_vocabulary_gap |
| SA2-P2-003 | P2 | security | `runtime/tests/handlers/advisor-status.vitest.ts:493` | The privacy guard cannot fail because the fixture never stores anything private | vacuous_privacy_assertion |
| SA2-P2-004 | P2 | traceability | `runtime/scripts/command-bridges/README.md:50` | The row-shape sentence omits `mutating`, the field `render.ts` reads for the child downgrade | doc_code_field_drift |
| SA2-P2-005 | P2 | maintainability | `runtime/scripts/command-bridges/derive-command-bridges.cjs:957` | `tsString` escapes `\` and `'` but not a line break; latent, no current value carries one | generated_code_escape_gap |

Totals: P0 0, P1 0, P2 5 active, 0 resolved, 0 repeated. Each finding's claim, evidence refs,
counterevidence, alternative explanation, confidence and downgrade trigger live in its iteration
record (`iterations/iteration-00N.md`) and in the delta stream.

**Impact and disposition per finding**

- `SA2-P2-001` — the suite still guards the gate through the neighbouring line, so no coverage is
  lost; the defect is that one assertion proves a different property than its comment claims.
  Disposition: advisory.
- `SA2-P2-002` — a reader who says "don't change anything yet" can still be offered `/create:skill`
  with policy `start`, which asks before writing. Disposition: advisory; would become P1 if a caller
  ever treats a `start` offer as authority to run.
- `SA2-P2-003` — holdout hygiene depends on a test that cannot fail; the write path is covered by a
  neighbouring test, the read path is not. Disposition: advisory.
- `SA2-P2-004` — documentation completeness for the generated block's declared human entry point.
  Disposition: advisory.
- `SA2-P2-005` — latent; a future metadata value with a newline produces invalid generated
  TypeScript. Disposition: advisory with a named trigger.

## 4. Remediation workstreams

**W1 - Make the two guards able to fail** (SA2-P2-001, SA2-P2-003). Add the missing table key to the
injected fixture in `command-attach.vitest.ts`, and persist a diagnostic record carrying a marker
string before the privacy assertion in `advisor-status.vitest.ts`. Owner: the advisor runtime tests.
Size: two test files. Risk: low.

**W2 - Close the wording and doc gaps on the safety path** (SA2-P2-002, SA2-P2-004). Extend
`NO_EDIT_REQUEST` with `don'?t (change|edit|modify|touch)` and `no changes?`, then add `mutating` to
the `COMMAND_ROWS` row-shape sentence. Owner: the advisor runtime. Size: one constant, one sentence.
Risk: low — the pattern only withholds a command, never adds one; the scorer reads the same constant,
so both paths move together.

**W3 - Harden the generated-code escaper** (SA2-P2-005). Escape `\n`, `\r`, `\u2028` and `\u2029` in
`tsString`, or delegate to `JSON.stringify` the way `pythonString` already does, then regenerate.
Owner: the command-bridges deriver. Size: three lines plus regeneration. Risk: low — the output is
drift-guarded.

## 5. Spec seed

- The no-edit vocabulary is part of the command-safety contract: name the accepted phrasings in the
  packet rather than leaving them implicit in a regex.
- Generated string emitters must escape every character that terminates a single-quoted literal;
  state it once for both the TypeScript and Python projections.
- A guard test's name must describe the property it can fail for; a test named for a gate but
  passing through a table lookup is a documentation defect in test form.

## 6. Plan seed

1. `command-attach.vitest.ts:120` — add `'sk-create-benchmark': '/create:benchmark'` to `INJECTED`,
   then confirm the assertion still passes.
2. `advisor-status.vitest.ts:493` — persist a record with `errorDetails` holding a marker, assert the
   marker is absent from the serialized status.
3. `command-attach.ts:289` — widen `NO_EDIT_REQUEST`; run `command-attach-guards.vitest.ts` and the
   fusion suite because both read the constant.
4. `command-bridges/README.md:50` — add `mutating` to the row-shape sentence.
5. `derive-command-bridges.cjs:957` — harden `tsString`; run `--check` and the drift guard.

## 7. Traceability status

**Core protocols**

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | partial | Generated `commandPolicies` holds 69 records over 44 unique commands (SC-001's 44) and the strictest-route rollup is 7 `run` / 20 `start` / 17 `ask` against phase 002's recorded 7 / 22 / 15. Phase 002's AC-012 already records an explained variance (ask 16, run 7, start 21, `/design:extract` explained); the residual one-command move has no named command and was not reported. |
| `checklist_evidence` | pending | No packet checklist claim was in any iteration's focus; the lineage read code and docs, not `checklist.md`. |

**Overlay protocols**

| Protocol | Status | Evidence |
|---|---|---|
| `feature_catalog_code` | partial | `command-meaning-matching.md` matches the code on every checked claim (0.72/0.02 constants, the three function names, the 17-case count, the `--real-embedding` preconditions). The one row-shape drift sits in the sibling `command-bridges/README.md` (`SA2-P2-004`). |
| `skill_agent` | notApplicable | No agent definition is selected by command attachment. |
| `agent_cross_runtime` | partial | `lib/command-attach.ts` and the deriver carry no runtime branch; the attach contract is runtime-agnostic. Pass one exercised cross-runtime behaviour and pass two did not re-score it. |
| `playbook_capability` | notApplicable | No playbook surface in command attachment. |

`AC_COVERAGE`: **exempt** — this review target is a Level 2+ spec folder whose `checklist.md` is not
part of the review scope for this lineage, and the acceptance signal is advisory while the
validation rule stays INFO. No `AC_COVERAGE` shortfall is claimed or implied by this report.

## 8. Deferred items

- **The residual policy-rollup move.** Two commands read `start` at phase 002 close and 17 read `ask`
  today (20 `start`). The requirement allows explained differences and the phase already exercised
  that clause; naming the second command needs a per-command snapshot this pass did not hold.
- **`runtime/lib/README.md` folder inventories.** Section 3 lists 13 folders, section 4 lists 5, and
  `lib/skill-graph/` appears in neither although it exists (with its own README) at the base commit
  and at HEAD. Pre-existing and outside the command-surfacing change; left for the lineage that owns
  those folders.
- **The `checkArtifactIntegrity` comment.** The schema comment says the probe is off "so the
  read-style advisor_recommend path pays no per-call probe", while the recommend handler passes
  `true`; both sides predate this range. Recorded for a later pass.
- **Pass-one deferred items in section 8 of the pass-one report** (`run` + `add-only` for
  `/doctor:deep-loop` and `/doctor:speckit`, and the rest) stay open and were deliberately not
  re-reported.

## Dimension Expansion Map

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated directions: none
- Council artifacts: none (review mode, no council)
- Selected review directions: correctness (pass-one fix re-read), security (mutating-command safety and holdout hygiene), traceability (changed docs vs code), maintainability (changed handlers, schema, deriver), cross-cutting (unopened remainder and shared docs)
- Remaining frontier: none recorded; the unopened `scorer-attach` remainder was read in iteration 5

## 9. Search Ledger

- `searchCoverage`: no v2 search-depth record was emitted (legacy v1 iteration records). Coverage by
  dimension is complete: four configured dimensions plus one cross-cutting sweep.
- `candidateCoverage`: 98 scope paths (71 `scorer-attach` + 27 `shared`). Files line-read or executed
  in this lineage: `command-attach.ts`, `command-attach.vitest.ts`, `command-attach-guards.vitest.ts`,
  `fusion.ts`, `advisor-recommend.ts`, `advisor-status.ts`, `advisor-status.vitest.ts`,
  `advisor-tool-schemas.ts`, `command-bridges/README.md`, `command-bridges/derive-command-bridges.cjs`,
  `command-meaning-matching.md`, `leaf-manifest.json`, `leaf-aliases.json`, `runtime/lib/README.md`,
  `ARCHITECTURE.md`, the three compiled-routing activation manifests, and the generated
  `command-bridges.generated.json`.
- `searchDebt`: none recorded.
- `ruledOutCandidates`: 20 directions, listed per iteration; the substantive ones are a `run` row that
  mutates, `COMMAND_POLICIES` deletion stripping policy, `advisor_status` leaking holdout text, path
  traversal through `skill_nodes.source_path`, cache-key omissions, schema stripping, silent policy
  defaults, the 46-row count, the policy-ladder doc, leaf/alias orphans and activation-manifest drift.
- `cleanSearchProof`: the two executed table sweeps (56 rows / 19 run / 0 `mutates`; 63 tracked / 52
  with rows / 0 policy-owner mismatch) and the two executed registry checks (116 leaves / 116 aliases,
  46 TypeScript rows / 46 `embeddingText`) are the proof that the clean results were measured.

## Audit appendix

**Convergence.** Iteration ratios 1.00, 1.00, 1.00, 1.00, 0.00. Threshold 0.10. Stopped by
convergence at iteration 5 of 7, with no active P0 or P1 and no stuck iterations.

**Coverage.** Correctness (iteration 1), security (2), traceability (3), maintainability (4),
cross-cutting (5). Every file marked `yes` in `review-scope-2.txt` for this area was read, and every
pass-one fix in the area was re-read against current code and its guard.

**Ruled-out claims.** Enumerated in `## 9. Search Ledger` and in each iteration's `Ruled Out` section;
each carries the evidence that settled it.

**Sources reviewed.** Repository-relative paths under
`.skilled/skills/system-skill-advisor/**`, `.skilled/bin/lib/compiled-routing/013-live-activation/activation/**`
and the pass-one report `review/review-report-pass-1.md`. Tests executed:
`env -u AI_SESSION_CHILD npx vitest run tests/command-attach-guards.vitest.ts tests/command-attach.vitest.ts`
→ 2 files, 24 tests, exit 0.

**Cross-reference appendix - Core Protocols.** `spec_code` partial; `checklist_evidence` pending (see
section 7).

**Cross-reference appendix - Overlay Protocols.** `feature_catalog_code` partial; `skill_agent` and
`playbook_capability` notApplicable; `agent_cross_runtime` partial (see section 7).

**Continuity.** This lineage did not run `generate-context.js`; the dispatch binds writes to the
lineage directory and the parent run owns continuity. State is preserved in
`deep-review-state.jsonl` (5 canonical iteration records), the five deltas and the five iteration
narratives.

Review verdict: PASS
