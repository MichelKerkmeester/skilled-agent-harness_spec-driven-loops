# Review Report: Command Surfacing Build, Pass Twelve - mention area

- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder)
- Pass: the twelfth review pass, `mention` area of `review/review-scope-12.txt`. It read the branch state at `05475f9d044` against `2f3f893c153` for the two mention files and rechecked the pass-eleven fixes.
- Lineage: `mention-12`, session `fanout-mention-12-1794856957949-n58dw7`, three iterations, stop reason `converged` at threshold 0.10. Brief `review/review-brief-12.txt`.

## 1. Executive Summary

- **Overall verdict: CONDITIONAL.** P0 0, P1 1, P2 2 — the counts the verdict used.
- **hasAdvisories: false.** P2 advisories exist, but the verdict is CONDITIONAL on the active P1, so the advisory flag is not set.
- **Self-check outcomes.** The only P1 (F001) was confirmed by the adversarial pass: the plain refusal is withheld, the bracketed refusal is offered, and the occurrence scan still finds the name, which isolates the defect to the lead gap. F002 is confirmed as a P2 because it needs a second path occurrence in the same prompt. F003 is confirmed as a P2 because the reader typed the command and loses only the attached offer. No finding was downgraded to a false positive.
- **Review scope summary.** Two files: `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` and `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts`. The branch changed 12 lines in the module (a closing-quote strip and the retired-name spelling alternation) and added 42 lines of tests (the wrapper invariance and retired-name cases).
- **Operator review focus:** Review pass twelve. First read specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-brief-12.txt and follow it: it names your area by lineage label, the scope file, the graph and stop steps each iteration runs, and the holdout rule.

## 2. Planning Trigger

`/speckit:plan` is required: the verdict is CONDITIONAL on one active P1.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": ["F001", "F002", "F003"],
  "remediationWorkstreams": [
    {
      "id": "WS-1",
      "findingIds": ["F001"],
      "severity": "P1",
      "title": "Strip the markdown wrappers the mention normalizer does not handle",
      "scope": "commandOnlyMentioned's strip chain and the lead gap; extend the wrapper invariance matrix"
    },
    {
      "id": "WS-2",
      "findingIds": ["F002"],
      "severity": "P2",
      "title": "Apply the dot-and-slash continuation rule to the mention occurrence scan",
      "scope": "commandOnlyMentioned's after-name boundary, aligned with typedCommandIn"
    },
    {
      "id": "WS-3",
      "findingIds": ["F003"],
      "severity": "P2",
      "title": "Share one command-name boundary rule between the mention and typed readers",
      "scope": "COMMAND_START_BOUNDARY, typedCommandIn, and the typed-path test coverage"
    }
  ],
  "specSeed": [
    "State that markup around a command name is not a clause boundary, and name the mark set the guard strips.",
    "State that a path occurrence of a command name is not a naming of the command.",
    "State that the typed reader and the mention reader share one boundary definition."
  ],
  "planSeed": [
    "Add the markdown punctuation set to the mention normalizer (or ignore a short markup run in the lead gap) and extend WRAPPERS with the same set.",
    "Reuse typedCommandIn's dot-and-slash continuation rule in the mention occurrence scan, or skip occurrences that continue as a path.",
    "Apply the missing mark characters to COMMAND_START_BOUNDARY, or extract one shared boundary helper, and add a typed-path wrapper case."
  ],
  "findingClasses": ["algorithmic", "algorithmic", "cross-consumer"],
  "affectedSurfacesSeed": [
    ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts",
    ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts",
    ".skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts",
    ".skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

| ID | Severity | Dimension | Location | Finding | Fix recommendation | Finding class | Scope proof | Affected surface hints |
|----|----------|-----------|----------|---------|--------------------|---------------|-------------|------------------------|
| F001 | P1 | correctness | `lib/command-attach.ts:427` | A markdown wrapper the normalizer does not strip turns a refusal or question into an offer | Strip the markdown wrappers or ignore a short markup run in the lead gap; extend `WRAPPERS` with the same set | algorithmic | 72/72 refusal-question fixture rows flip under six uncovered wrapper pairs; 0 mismatches for the six covered pairs | `command-attach.ts` `commandOnlyMentioned`/`attachCommand`; `fusion.ts:1204-1215`; the guards test `WRAPPERS`/`PLAIN_ROWS` |
| F002 | P2 | correctness | `lib/command-attach.ts:437` | A doc-path mention of the command defeats a led refusal | Apply the dot-and-slash continuation rule after the name, or skip a path occurrence | algorithmic | The occurrence regex matches the name inside `.md` and a directory segment; the plain refusal withholds | `commandOnlyMentioned`; `typedCommandIn` as precedent; `fusion.ts:1213` |
| F003 | P2 | maintainability | `lib/command-attach.ts:208` | The typed-command reader applies a narrower wrapper set than the mention reader | Share one boundary rule, or add the missing marks and cover the typed path | cross-consumer | Bold and curly typed prompts lose the command while the plain and parenthesized forms deliver | `typedCommandIn`/`typedCommandForTop`; the deep-loop gate at `:527`; `advisor-recommend.ts:421-439` |

Impact notes:

- F001 offers a `policy: start`, `mutating: mutates` command on a refusal, from both the hub route (`attachCommand:510`) and the scorer's command rows (`fusion.ts:1213`).
- F002 needs the prompt to both refuse the command and cite a path containing its name; the impact is the same offer, and the reach is narrower.
- F003 does not change what the reader may run, because they typed the command; it drops the attached command and policy from the recommendation head.

## 4. Remediation Workstreams

- **WS-1 (P1, F001)** first. The guard's purpose is to read a naming before it trusts the name, and the strip list is the boundary. The fix should treat the markdown punctuation set as markup rather than as clause punctuation, and the invariance test should pin the same set so the class cannot reopen.
- **WS-2 (P2, F002)** after WS-1. The typed reader already refuses a `.md` continuation at line 234; the mention reader should use the same rule, or skip an occurrence that continues as a path.
- **WS-3 (P2, F003)** with WS-1, because both fixes touch what counts as a wrapper. One boundary definition shared by both readers is smaller than two character sets that must be kept in step.

No P0 workstream exists.

## 5. Spec Seed

- Add one sentence to the command-attach contract: markup around a command name is not a clause boundary, and the guard strips code, bold, straight and curly quotes and markdown punctuation before reading a lead.
- Add one sentence: a path that contains a command name is not a naming of the command.
- Add one sentence: the typed reader and the mention reader apply the same boundary definition, so a wrapped typed command is still typed.

## 6. Plan Seed

1. Extend the mention normalizer (or the lead gap) to drop `[`, `]`, `(`, `)`, `~`, `<`, `>`, `«`, `»` and a markdown-link suffix when they sit around a command name, then extend `WRAPPERS` with the same pairs and assert both directions (refusal stays a mention, request stays a request).
2. Reuse `typedCommandIn`'s `after === '.' || after === '/'` continuation rule in the mention occurrence scan, or skip an occurrence whose next characters continue a file name or path; add a case with a led refusal and a doc-path reference.
3. Add the missing mark characters to `COMMAND_START_BOUNDARY` (or extract one helper) and add a typed-path case for bold and curly quotes in `command-attach-guards.vitest.ts`.

## 7. Traceability Status

Core protocols:

- `spec_code`: pass. The branch diff matches the two scoped files and the pass-eleven fix description. F001 and F002 are new defects outside 039 AC-007's enumerated marks; F003 is a pre-existing typed-path asymmetry.
- `checklist_evidence`: notApplicable. This review pass owns no packet checklist; AC-007 was read as the wrapper contract and is met as written.

Overlay protocols:

- `skill_agent`: pass. No agent definition is in the diff or the findings.
- `agent_cross_runtime`: notApplicable. No runtime mirror is touched.
- `feature_catalog_code`: partial. The wrapper contract is implemented twice; F001 and F003 name the two gaps.
- `playbook_capability`: partial. No playbook scenario was executed; the exported functions were run directly.

`AC_COVERAGE`: **exempt**. The target spec folder has no `acceptance-criteria.md` and no `implementation-summary.md` at its own level, so the lifecycle predicate is inactive; the phase children own their AC coverage.

## 8. Deferred Items

- The refusal-lead vocabulary is finite: `under no circumstances run /x` and `kindly refrain from running /x` still read as requests. This is the design recorded at `command-attach.ts:369-377`, not a new finding.
- Underscore emphasis is deliberately not stripped, because a command name may hold an underscore; the brief records this limit and the behaviour is unchanged.
- A suffix followed by a file extension (`/deep:review:auto.md`) still reads as the command; the brief records this limit and the final pass re-confirmed it.
- Non-markdown Unicode wrappers (fullwidth primes, exceptional quote characters) remain outside the test matrix; they are not observed chat forms and are not findings.

## Dimension Expansion Map

- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Saturated directions: none. Pivot lineage: none.
- Selected review directions: correctness and traceability (iteration 1), security and maintainability (iteration 2), all four as final verification (iteration 3).
- Remaining frontier: none. This section records breadth only and does not change the verdict.

## 9. Search Ledger

`*No search-depth state captured (legacy v1 record)*`

The probes that stand in for a search ledger in this pass:

- Wrapper matrix: 23 fixture rows × 6 covered wrapper pairs (0 mismatches) and × 6 uncovered pairs (72/72 refusal-question flips, 0 request flips).
- Path occurrences: `/create:readme.md` and `/create:readme/notes.txt` both defeat a led refusal.
- Typed boundary: bold and curly typed commands are lost; plain and parenthesized forms deliver.
- Security: 100 KB prompt 3.3 ms; 2,000 occurrences 289 ms; homoglyph and zero-width forms do not name a tracked command.
- State: three iteration records, three deltas whose first line equals its record, one registry with three open findings, four dimensions covered.

## 10. Audit Appendix

- **Convergence.** Iteration 3 returned `STOP`, `converged`, score 1.0, blockedBy `[]`; all nine gates pass. Ratios were 1.0, 0.14, 0.0.
- **Coverage.** 4 of 4 dimensions; core protocols `spec_code` and `checklist_evidence` each recorded; overlay protocols recorded as pass, partial or notApplicable.
- **Ruled-out claims.** ReDoS; a prompt-controlled regex or secret surface; a DoS from repetition; a homoglyph/zero-width bypass; a broken single-quote or retired-name fix; a missing occurrence of a bracketed name; a `PLAIN_ROWS` omission hiding a second defect; a path case beyond F002; a stale-line citation.
- **Sources reviewed.** `command-attach.ts` (full file and focused ranges), `command-attach-guards.vitest.ts` (full file and the wrapper/typed ranges), `lib/scorer/fusion.ts:1200-1260`, `handlers/advisor-recommend.ts:421-439`, `review-brief-12.txt`, `review-scope-12.txt`, `review-report.md`, `review-report-pass-10.md`, 039 `acceptance-criteria.md:60`, 039 `tasks.md:64-65`, and the lineage state, registry, deltas and strategy.
- **Core Protocol Appendix.** `spec_code` pass; `checklist_evidence` notApplicable.
- **Overlay Protocol Appendix.** `skill_agent` pass; `agent_cross_runtime` notApplicable; `feature_catalog_code` partial; `playbook_capability` partial.

Review verdict: CONDITIONAL
