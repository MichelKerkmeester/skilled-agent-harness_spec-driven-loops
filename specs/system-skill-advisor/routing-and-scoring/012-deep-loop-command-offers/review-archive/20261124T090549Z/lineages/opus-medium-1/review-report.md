# Deep Review Report — 012 deep-loop command offers (lineage opus-medium-1)

## 1. Executive Summary
- **Overall verdict:** PASS
- **hasAdvisories:** true
- **Counts the verdict used:** P0 = 0, P1 = 0, P2 = 3 (from `review-verdict.cjs` over the lineage registry)
- **Self-check outcomes:** no active P0 or P1 remained at synthesis, so the adversarial self-check made no calls. In iteration 3, R1-P1-001 was refined from P1 to P2, because `implementation-summary.md:228` records the operator's 2026-11-23 acceptance that a typed command outranks the stuck-run diagnosis.
- **Review scope:** 32 files: the 012 and 013 packet docs, `command-attach.ts`, `explicit.ts`, `render.ts`, `advisor-recommend.ts`, `skill_advisor.py`, the CLI fallback hook, the schemas, and the advisor test files and fixture named in `review-scope-files.txt`.
- **Operator review focus:** The deep-loop offer gate in command-attach.ts and the Python fallback in skill_advisor.py, plus the typed-command hint from packet 013
- **Iterations:** 5 of 5 (stopPolicy = max-iterations). Dimensions covered: correctness (two passes), security, traceability, maintainability.

## 2. Planning Trigger
`/speckit:plan` is not required: no active P0 or P1. The three P2 advisories can go into a follow-up packet.

```json
{
  "title": "Planning Packet",
  "triggered": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": [
    {"id": "R1-P1-001", "severity": "P2", "dimension": "traceability", "file": "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:1"},
    {"id": "R2-P2-001", "severity": "P2", "dimension": "security", "file": ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:784"},
    {"id": "R4-P2-001", "severity": "P2", "dimension": "maintainability", "file": ".skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:72"}
  ],
  "remediationWorkstreams": [
    {"id": "WS-1", "title": "Make REQ-020/SC-005/AC-027 state the accepted typed-on-stuck exception, or align the Python gate with the native hook", "findings": ["R1-P1-001"]},
    {"id": "WS-2", "title": "Make commandOnlyMentioned linear in the occurrence count (TS and Python)", "findings": ["R2-P2-001"]},
    {"id": "WS-3", "title": "Extend the parity guard to the inline regex vocabulary", "findings": ["R4-P2-001"]}
  ],
  "specSeed": ["Amend REQ-020 and SC-005 to name the typed-on-stuck exception the operator accepted", "Decide whether the Python fallback should keep the typed run row on a stuck prompt to match the native hook"],
  "planSeed": ["Add an attachTypedCommand-level test for the typed-stuck fixture case", "Hoist the per-occurrence RegExp construction out of the occurrence loop", "Add fixture cases for every COUNT_WORDS entry and the inline symptom/artifact words"],
  "findingClasses": ["spec/evidence drift on accepted exception", "bounded algorithmic complexity", "incomplete parity guard"],
  "affectedSurfacesSeed": ["specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md", "specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md", ".skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts", ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts", ".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py", ".skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts", ".skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json"],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

| ID | Sev | Dimension | file:line | Title |
|----|-----|-----------|-----------|-------|
| R1-P1-001 | P2 (was P1) | correctness → traceability | `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:1`; origin `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:428` | The typed-on-stuck exception is accepted in prose, but REQ-020, SC-005 and AC-027 still state parity, and the hook output contradicts them |
| R2-P2-001 | P2 | security | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:784` | commandOnlyMentioned rescans the whole prefix for every occurrence, so cost grows with the square of the repeat count (bounded by the 10K cap) |
| R4-P2-001 | P2 | maintainability | `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:72` | The drift guard checks only the three exported phrase lists, so a one-sided edit to the inline regex vocabulary passes both suites |

**R1-P1-001.** Evidence: `attachTypedCommand` (`advisor-recommend.ts:428-447`) runs after `enrichCompiledRoutes` (`:556-561`, `:628-633`) and replaces the doctor command that `attachCommand` returns for a stuck run (`command-attach.ts:837-841`). `typedCommandForTop` (`command-attach.ts:257-265`) has no stuck check. The Python gate drops the run row on a stuck prompt even when it is typed (`skill_advisor.py:4848-4853`). The packet's own hook capture prints `/deep:review (ask)` for "my deep review run is stuck, /deep:review again" (`scratch/probes/fresh-review-hook.txt:28`). Impact: the native and fallback advisors disagree on this prompt, while REQ-020 and SC-005 (`spec.md:218, 249`) and AC-027 say they agree. Fix: amend the requirement text to name the exception, or align the Python gate, and test the typed-stuck case at the `attachTypedCommand` layer. Disposition: open advisory. findingClass: spec/evidence drift on an accepted exception. scopeProof: the four refs above. affectedSurfaceHints: spec.md, acceptance-criteria.md, deep-loop-offer-cases.*, skill_advisor.py.

**R2-P2-001.** Evidence: TS `'do not run /deep:review. '` repeated takes 10.5 ms at 5K chars, 506 ms at 20K and 1,517 ms at 80K. Python takes 349 ms at 10K. The 10K cap is at `advisor-tool-schemas.ts:257` and `skill-advisor-cli-fallback.ts:233`. Impact: up to about 0.35 s of extra fallback latency for each deep run row checked on a hostile or pasted prompt. Fix: build the lead regexes once, and test each against a bounded tail window instead of the full prefix. findingClass: bounded algorithmic complexity. affectedSurfaceHints: command-attach.ts commandOnlyMentioned, skill_advisor.py _deep_command_only_mentioned.

**R4-P2-001.** Evidence: the guard at `deep-loop-offer-cases.vitest.ts:72` iterates `LOOP_WORDING`, `LOOP_NAMES` and `LOOP_WANT_LEADS` only. `COUNT_WORDS` (`command-attach.ts:335`) is mirrored inline at `skill_advisor.py:4490`, and no fixture case uses thirty, forty, fifty or dozen. Impact: a one-sided vocabulary edit passes both suites. Fix: export the inline word lists, or add a fixture case per entry. findingClass: incomplete parity guard.

## 4. Remediation Workstreams
- **P0:** none.
- **P1:** none.
- **P2 advisories:** WS-1 (R1-P1-001), WS-2 (R2-P2-001), WS-3 (R4-P2-001), as listed in the Planning Packet.

## 5. Spec Seed
- REQ-020: add "except a typed command on a stuck run, where the native hook keeps the typed command (operator decision 2026-11-23)", or require the Python gate to match.
- SC-005: exclude that prompt from "gives its stated result through the prompt hook", or restate its stated result as `/deep:review (ask)`.

## 6. Plan Seed
1. Add a vitest case that sends the `typed-stuck` fixture prompt through `attachTypedCommand` and pins the accepted result.
2. Decide on Python parity for typed-on-stuck, then update `_apply_deep_loop_offer_gate` and the fixture's `typedReviewKept` semantics to match.
3. Refactor `commandOnlyMentioned` and its Python copy so the per-occurrence work is independent of prefix length, with a timing assertion at the 10K cap.
4. Add fixture run cases for each COUNT_WORDS entry, or export the list and extend the guard loop.

## 7. Traceability Status

### Core Protocols
| Protocol | Status | Evidence | Drift |
|----------|--------|----------|-------|
| spec_code | partial | Loop-ask clauses map to `command-attach.ts:277-640`. The deferred mode cue is at `:899-924`. The stage-one rule at `explicit.ts:449-460` scores no depth word. | REQ-020 holds at the `attachCommand` layer, not at the hook (R1-P1-001) |
| checklist_evidence | partial | The AC rows cite observed evidence. | AC-027 is verified on a narrower layer than SC-005 requires |

### Overlay Protocols
| Protocol | Status | Notes |
|----------|--------|-------|
| skill_agent | notApplicable | No skill-agent contract in scope |
| agent_cross_runtime | notApplicable | No agent files in scope |
| feature_catalog_code | notApplicable | No feature catalog in scope |
| playbook_capability | notApplicable | No manual testing playbook in scope |

- **AC_COVERAGE:** exempt for this lineage. The packet uses `acceptance-criteria.md` rather than `checklist.md`, so the signal does not apply. All 29 AC rows read Met or Waived (AC-008 waived with ADR-003).

## 8. Deferred Items
- Routed path and named loop mode: `attachCommand` on a routed single mode does not consult `NAMED_LOOP_MODE`, so a router that picks review for "run 5 research iterations on review tooling" would offer `/deep:review`. I did not run the compiled router, so this is unverified.
- `overnight` and `convergence` beside "research" lift the hub at stage one (`explicit.ts:451`) though neither is in the spec's explicit-loop list. The offer gate still withholds the command.
- Known word-rule misses that the packet already documents (`implementation-summary.md:239`): "Skip the deep review on this branch", "multi-pass compiler design review".

## Dimension Expansion Map
- Saturated directions: none recorded by the reducer.
- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Selected directions: correctness (iterations 1 and 5), security (2), traceability (3), maintainability (4).
- Remaining frontier: compiled-router mode choice versus the prompt's named loop mode. Not probed, because dist is not built in this worktree.

## 9. Search Ledger
*No search-depth state captured (legacy v1 record)*

## 10. Audit Appendix
- **Convergence:** newFindingsRatio by iteration 1.0, 0.17, 0.08, 0.13, 0.0. The reducer's convergenceScore reached 1.0 at iteration 5. Stop reason: maxIterationsReached.
- **Coverage:** 4 of 4 dimensions (`dimensionCoverage` all true).
- **Ruled out:** catastrophic regex backtracking (linear on every probe shape), forging the `typed` flag from prompt text (`advisor-tool-schemas.ts:308`), injection into the brief head (sanitized known command keys), TS-vs-Python predicate drift (0 of 61 out-of-fixture prompts), and a depth word lifting the hub at stage one.
- **Probe artifacts (inside this lineage):** `probes/gate-probe.mjs`, `probes/redos*.{mjs,py}`, `probes/diff.{mjs,py}`, `probes/prompts.json`, `probes/py-typed.py`, and `probes/ts-resolve.mjs` (a resolve hook that loads the TS source without a dist build).
- **Sources reviewed:** see `iterations/iteration-001.md` to `iteration-005.md`, Files Reviewed.
- **Scope note:** every artifact this lineage wrote is inside the lineage directory. One probe file, `/tmp/probe-oml1.mjs`, was created outside it during iteration 1 and deleted at once; its contents moved to `probes/gate-probe.mjs`. A final `find .skilled -newer invocation-metadata.json` lists only dist-freshness and mcp-code-mode dist files dated 05:43, the session-start hooks of the fan-out launch, not this lineage's probes. No `__pycache__` was written next to `skill_advisor.py`. `steer.md` was absent at init and at closeout.
