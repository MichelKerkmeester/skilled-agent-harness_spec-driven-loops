# Iteration 6 - traceability

## Dispatcher

- Lineage: `deepseek-max-1`, generation 9, run `fanout-deepseek-max-1-1795552859377-13gxwk`
- Dimension: traceability
- Review target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers`
- Operator focus addressed: `spec_code` for the remaining requirement slice, REQ-035 to REQ-052, so the protocol that has been `partial` all run can finish with every requirement mapped to the code that implements it or the ADR that records it.

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:259` (REQ-035 to REQ-052 rows)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:635` (`hasUnrefusedPronounRerun`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1027` (`LOOP_ARTIFACT_NOUNS`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1201` (`LOOP_QUESTION_AUXILIARIES`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1694` (`routedLoopMode`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1713` (`loopAskCues`)
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:227` (`stripReviewVerdict`)
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2378` (`MIN_BLOCKED_ATTEMPTS`)
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2419` (`replaceAnchorSection`)
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:386` (`enrichCompiledRoutes` duplicate guard)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5743` (`_apply_deep_loop_offer_gate`)
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:571` (`PATTERNS_NOT_COMPARED`)
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:743` (mode vocabulary describe)
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:269` (plural rows)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json:1` (baseline provenance)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

- `spec_code` — pass. REQ-035 to REQ-052 are mapped below, which completes the map opened in iteration 3 for REQ-001 to REQ-034. Every requirement resolves to a live anchor at this revision; the three requirements that rest on a measured outcome (REQ-039, REQ-044, REQ-051) also name the record that holds the measurement. Evidence for the raised status: `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1201` (REQ-036), `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1713` (REQ-026 and REQ-042), and `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:571` (REQ-051).

  | Requirement | Evidence anchor | Status |
  |---|---|---|
  | REQ-035 | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:451` (`LOOP_NAMES`, plural forms) + 21 plural fixture rows + `ADR-008` (`decision-record.md:703`) | traced |
  | REQ-036 | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1201` (`LOOP_QUESTION_AUXILIARIES`) + `how-do-*` fixture rows | traced |
  | REQ-037 | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1016` (`LOOP_EFFORT_LEADS`) and `:1078` (`LOOP_EFFORT_WORDS`) + 24 `effort-*` rows | traced |
  | REQ-038 | `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1489` (`trackedCommandForOwner`) | traced |
  | REQ-039 | `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json:1` — 155 rows, `capturedAtSha` `a139ac3b248`, last committed by this packet on 2026-11-23 | traced |
  | REQ-040 | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:920` (`NO_EDIT_REQUEST`) + three `no-edit-*` rows | traced |
  | REQ-041 | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1713` (`loopAskCues` reads only the phrases still asked for) + five `refused-cue-*` rows | traced |
  | REQ-042 | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1694` (`routedLoopMode`) on the routed single-target branch | traced |
  | REQ-043 | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:635` (`hasUnrefusedPronounRerun`) + `stuck-rerun-*` and `past-summary-*` rows | traced |
  | REQ-044 | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1078` + `typed-doctor-*` rows (four rows keep the typed doctor) | traced |
  | REQ-045 | `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:743` (mode vocabulary on every surface) + `MODE_CUE_WORDS` at `:540` | traced |
  | REQ-046 | `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2378` and `:2419`, plus `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:386` | traced |
  | REQ-047 | `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5743` (`_apply_deep_loop_offer_gate`) + four `servedRun: "none"` fixture rows | traced |
  | REQ-048 | `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2419` (`replaceAnchorSection` keeps the file's ordinal) | traced |
  | REQ-049 | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:884` and `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5098` + `loop-wording-*` rows | traced |
  | REQ-050 | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:716` (`RUN_ASK_REFUSAL_CANCEL_LEADS`) + `negated-refusal-*` rows | traced |
  | REQ-051 | `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:571` (38 patterns listed with a reason) | traced |
  | REQ-052 | `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:227` and the dashboard writer at `:2896` | traced |

- `checklist_evidence` — pass, carried from iteration 5. Nothing in this pass contradicts the row-level verdicts; the two P2 findings from that pass are recorded against `CHK-001` and `AC-028` and do not reopen the protocol.

## Integration Evidence

- Reduction surface: `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` implements REQ-046, REQ-048 and REQ-052, and every one of those writers was read here rather than inferred from the requirement text.
- Handler surface: `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:386` is the compiled-route enrichment REQ-046's second clause names; the duplicate guard seeds its set from the rows' existing commands and strips every command field from the row it withholds.
- Corpus surface: `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json:1` holds the recaptured baseline; `git log` on that path names this packet's 2026-11-23 commit, so the recapture REQ-039 asks for is in the tree, and the pinned `capturedAt` (2026-10-11) is the scorer's fixed scoring date rather than a stale capture.

## Edge Cases

- REQ-039's two provenance fields read old at first sight: `capturedAt` is the scorer's pinned scoring date and `capturedAtSha` is the HEAD at capture time (`a139ac3b248`, a 2026-11-23 commit of this packet). Reading them against the file's own commit history resolves the apparent staleness, so neither is reported.
- REQ-044 mixes two grammars — an effort word used as manner, and a typed `/doctor:deep-loop` after a clause break. The map treats them as one requirement with two fixture families (`effort-manner-*`, `typed-doctor-*`), because the requirement states both in one row.
- REQ-047's mode-free rows are four, not the three the requirement names; the fourth is the singular `run-deep-loop` row that AC-055 also lists, so the extra row strengthens the requirement rather than drifting from it.

## Confirmed-Clean Surfaces

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:451` — `LOOP_NAMES` carries the plural loop nouns, and the fixture holds 21 `plural-*` rows, so REQ-035's plural clause and its mode-free amendment are both pinned.
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:743` — the mode-vocabulary describe pins the command table, `MODE_CUES`, `MODE_CUE_WORDS` and the hub router on the same modes, which is REQ-045's clause.
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:227` — the Next Focus projection ends at the verdict marker and the dashboard writer pushes the multi-line string whole, so REQ-052's two clauses hold.
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:386` — the compiled-route enrichment offers a derived command once and strips command, policy, owner and typed fields from a row it withholds.

## Ruled Out

- REQ-039's baseline as stale: ruled out. `capturedAt` is the pinned scoring date, `capturedAtSha` is a 2026-11-23 commit, and the file's last commit is this packet's, so the recapture is in the tree.
- REQ-047 as short of rows: ruled out. The fourth mode-free row is the singular prompt AC-055 also names.
- REQ-035's mode-free clause against ADR-008: ruled out. The four `servedRun: "none"` rows are exactly what ADR-008 records, and the hub still serves the ask without a command.

## Next Focus

- Dimension: traceability
- Focus area: closure-doc consistency and the ADR set — ADR-001 to ADR-009 against the tree, the changelog's loop-offer claims, the timeline's last round, and the report inputs synthesis needs.
- Reason: both core protocols are now at `pass`; the last iteration under the cap is spent on the remaining traceability surface rather than on a new dimension.
- Rotation status: all four dimensions covered; both core protocols at pass.
- Blocked/productive carry-forward: productive — the ADR set is small and each ADR names the row that owns it.
- Required evidence: one check per ADR and per changelog claim, plus the round record the timeline carries.
- No recovery note: this pass was not a recovery iteration.

Review verdict: PASS
