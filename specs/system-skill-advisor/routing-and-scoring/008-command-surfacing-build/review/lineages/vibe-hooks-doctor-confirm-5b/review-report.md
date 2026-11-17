# Review Report - pass five confirming round 5b, vibe-hooks-doctor area

Lineage: `vibe-hooks-doctor-confirm-5b`. Review target:
`specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`. Mode: review.
Iterations: 3 of 3. Session: `fanout-vibe-hooks-doctor-confirm-5b-1794780590351-ezt1v0`.

## 1. Executive Summary

- **Overall verdict: PASS**
- **hasAdvisories: true** (two active P2 items)
- **Active findings: P0=0, P1=0, P2=2**
- **Review scope**: the eight `vibe-hooks-doctor` files from `review/review-scope-5b.txt` for the
  commit range `2a1a42263cc..d21dbc1cafe`, plus the docs that describe them
  (`doctor/scripts/README.markdown`, `skill-advisor-hook.md`, the Vibe hook READMEs and `CL-010`).
- **Operator review focus**: Confirming round 5b of code review pass five of command surfacing.
  Read `review/review-brief-5b.txt` in the packet first and follow it. Review the files in
  `review/review-scope-5b.txt` whose area equals your lineage label without its `-confirm-5b`
  suffix, plus docs that describe them. Each finding is P0, P1 or P2 with file:line and a
  concrete input. Check that the shell write reader misses no in-place edit, the COMMAND reader
  reads only a line the model printed as its own, the arena builder refuses a dirty source, a
  stale build, an escaping or absolute link and answers a failed check with a JSON line, a live
  turn checks for a remote every turn and has no network push, the kill-switch names agree in
  code and docs, and docs agree with code. Never open command-prompts.jsonl,
  holdout-prompts.jsonl or behaviour-fresh-prompts.jsonl except through jq del(.prompt). Change
  no code and write only inside your lineage folder.

The pass-five fixes in this area hold. The hook sources now read the fallback context unchanged,
follow the injected environment for the head receipt, and find the kill-switch resolver from both
the source and the built folder; the doctor now reads the Vibe `match` selector and refuses a
non-`main` entry; the contract test's new name matches what it asserts; the hook contract names
Vibe in its three places and states the alias scope the resolver implements. Two P2 advisories
remain: the doctor scripts README still contains a sentence the selector fix made false, and the
new "names the main agent" case duplicates the default case instead of covering a new branch.

Five of the operator focus's seven checks belong to the `accuracy-runner` area by
`review-scope-5b.txt` and were not graded here.

## 2. Planning Trigger

`/speckit:plan` is **not required** for this lineage. The verdict is PASS with advisories; the
two P2 items are documentation and test-hygiene work that can be folded into the remediation
phase's close-out or a later docs pass. The block below still carries them so a plan run can pick
them up without re-reading the prose.

```json
{
  "triggered": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": [
    {
      "id": "C5B-P2-001",
      "severity": "P2",
      "title": "The doctor README still says a single-quoted or trailing-comment value reads hook-missing, and never names the match selector rule",
      "file": ".skilled/commands/doctor/scripts/README.markdown:235",
      "findingClass": "documentation_contract"
    },
    {
      "id": "C5B-P2-002",
      "severity": "P2",
      "title": "The new names-the-main-agent case duplicates the default case, so it cannot fail for a reason of its own",
      "file": ".skilled/commands/doctor/scripts/tests/hook-wiring-check.test.cjs:249",
      "findingClass": "test_hygiene"
    }
  ],
  "remediationWorkstreams": [
    "Advisory A: correct README.markdown row 235 and name the selector rule in row 112.",
    "Advisory B: drop the duplicate case or give it a shape the helper default does not write."
  ],
  "specSeed": "No new spec. Record the two advisories in the remediation packet's close-out.",
  "planSeed": "No new plan. If picked up, one docs edit and one test edit.",
  "findingClasses": ["documentation_contract", "test_hygiene"],
  "affectedSurfacesSeed": [
    "doctor scripts README rows 112 and 235",
    "doctor wiring suite case list"
  ],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

| ID | Severity | Title | Dimension | File:line | Disposition |
|---|---|---|---|---|---|
| C5B-P2-001 | P2 | Doctor README sentence made false by the selector fix; selector rule undocumented | traceability | `.skilled/commands/doctor/scripts/README.markdown:235` | active |
| C5B-P2-002 | P2 | New "names the main agent" case duplicates the default case | maintainability | `.skilled/commands/doctor/scripts/tests/hook-wiring-check.test.cjs:249` | active |

### C5B-P2-001

- **Evidence**: the row says "a value with a trailing comment or a single-quoted string reads
  `hook-missing`"; four fixtures and the repository run show `match = 'main'` and
  `match = "main"  # main agent only` print `ok vibe` with exit 0, while `match = "agents_spawn"`
  prints `hook-missing vibe .vibe/hooks.toml` with exit 1.
- **Impact**: an operator whose `pre_agent` entry carries any other selector sees `hook-missing`
  and no describing doc explains the rule; the same row is the only account of the Vibe reading.
- **Fix recommendation**: scope the trailing-comment/single-quote clause to `type` and `command`,
  and state the selector rule (absent or exactly `main` reads wired).
- **findingClass**: documentation_contract
- **scopeProof**: the README is the describing doc for the in-scope script; the script comments at
  `:232-234` and `:377-378` state the rule the README omits.
- **affectedSurfaceHints**: doctor scripts README rows 112 and 235; operator repair path for a
  `hook-missing vibe` line.

### C5B-P2-002

- **Evidence**: `vibeBlock`'s third parameter defaults to `match = "main"` (`:54`), so `:249-255`
  writes byte-identical TOML to `:241-247` and asserts the same two outcomes.
- **Impact**: the case list suggests an explicit-selector branch that no distinct input reaches;
  it can only fail when the older case already fails.
- **Fix recommendation**: drop the case, or give it a shape the default does not write (a selector
  on a second block, or `match` before `type`).
- **findingClass**: test_hygiene
- **scopeProof**: both cases and the helper are in the in-scope test file; the absent and
  non-`main` branches are covered at `:257-271` and `:273-303`.
- **affectedSurfaceHints**: doctor wiring suite case list.

## 4. Remediation Workstreams

### P0

None.

### P1

None.

### P2 advisories (not blocking)

1. **Docs**: edit `.skilled/commands/doctor/scripts/README.markdown` rows 112 and 235 as above.
2. **Tests**: replace or remove the duplicate case at `hook-wiring-check.test.cjs:249-255`.

## 5. Spec Seed

- No spec change is required. If the two advisories are recorded, add one line to the
  remediation packet's close-out: the doctor README and its test list are the only surfaces the
  confirming round left open.

## 6. Plan Seed

- Task A: rewrite `doctor/scripts/README.markdown:235` to say the trailing-comment and
  single-quote limits apply to `type` and `command`, and that a `match` selector reads wired only
  when it is absent or `main`; mention the selector beside the Vibe reading at `:112`.
- Task B: delete `hook-wiring-check.test.cjs:249-255`, or point it at a distinct TOML shape and
  assert the same `ok vibe` line.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | pass | Phase `032` REQ-007's items hold: directive-only context unchanged, receipt follows the injected env, the Claude hook from source honors `SYSTEM_SKILL_ADVISOR_DISABLED`, `agents_spawn` reads `hook-missing vibe`, the contract test carries its new name, and the hook contract names Vibe in three places. The doctor README gap is a describing-doc issue, not a contradicted requirement. |
| `checklist_evidence` | partial | Every case phase `032` AC-007 names passes at this commit. The packet's AC row still reads `Unmet` until the phase closes; recorded as bookkeeping, not graded. |

### Overlay Protocols

| Protocol | Status | Evidence |
|---|---|---|
| `skill_agent` | notApplicable | No agent definition changed in this area. |
| `agent_cross_runtime` | pass | All seven adapters reach the one compiled handler or the shared resolver; the doctor reads five runtime files and prints `ok` for all five in this checkout. |
| `feature_catalog_code` | notApplicable | The feature catalog is the `docs-metadata` area by `review-scope-5b.txt`. |
| `playbook_capability` | pass | `CL-010`'s document-line and child-session claims match the iteration 1 probe. |

### AC_COVERAGE

`exempt`: the review target is the phase-parent packet `008-command-surfacing-build`, which has no
`checklist.md` or `acceptance-criteria.md` at its root; the acceptance criteria live in the child
phase `032-review-pass-five-remediation`.

## 8. Deferred Items

- The `accuracy-runner` focus checks (in-place shell writes, the COMMAND line reader, arena
  provenance, the live-turn remote guard) are deferred to their own lineage by
  `review-scope-5b.txt`.
- Rebuild freshness of the untracked `runtime/dist` copy is the build contract, not a review item.
- `R1-P2-002` (Vibe `parent_session_id`) stays rejected per `review/verify-5/report.md` and plan
  D13; `re:` selectors in the doctor stay `hook-missing` per plan D9.

## Dimension Expansion Map

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated directions: none
- Selected review directions: correctness and security (iteration 1), traceability and
  maintainability (iterations 2 and 3)
- Remaining frontier: none recorded

## 9. Search Ledger

*No search-depth state captured (legacy v1 record)*

## 10. Audit Appendix

### Convergence Summary

- Iterations run: 3 of 3. The final pass added no finding and cleared the 0.10 threshold, so the
  loop stopped `converged` at the configured cap.
- New-findings ratio per iteration: 0.00, 1.00, 0.00.
- Active findings after the final reduction: P0=0, P1=0, P2=2.
- Every iteration's final line is `Review verdict: PASS`.

### Coverage Summary

| Dimension | Iterations | Status |
|---|---|---|
| correctness | 1 | covered |
| security | 1 | covered |
| traceability | 2, 3 | covered |
| maintainability | 2, 3 | covered |

### Ruled-Out Claims

- The unbounded ancestor walk loads a foreign resolver: frozen by plan D9, identical sibling in
  `advisor-disabled.ts:50-68`.
- The directive-only early return skips a real head: only the no-brief fallback opens that way.
- A missing resolver now fails closed: null answers enabled.
- A `re:` selector that includes `main` is falsely reported: frozen by plan D9 and pinned by test.
- A trailing-comment `type`/`command` line is now accepted: the entry regex still refuses it.
- The Codex/Cursor/Devin rows name a per-runtime advisor build: they name the compiled shim.
- The Python CLI also reads the newer switch names: it reads only `disabledEnv`, exactly `"1"`.
- The `MK_` rows are stale after the env-aliases bridge: the bridge and the alias list both honour
  them.

### Sources Reviewed

- The eight scoped files and the docs that describe them, listed in
  `deep-review-config.json` and in each iteration's `Files Reviewed`.
- `git -c core.fsmonitor=false diff 2a1a42263cc d21dbc1cafe -- <scoped paths>`.
- `review/review-brief-5b.txt`, `review/review-focus-5b.txt`, `review/review-scope-5b.txt`,
  `review/verify-5/report.md`, plan D9/D13 and the two scratch reports.

### Cross-Reference Appendix

Core: `spec_code` pass, `checklist_evidence` partial (packet close-out pending). Overlay:
`agent_cross_runtime` and `playbook_capability` pass; `skill_agent` and `feature_catalog_code`
not applicable to this area.

### Artifact Integrity

- The three delta files' first lines are the exact records the append gateway accepted; a
  canonical (key-sorted) comparison against `deep-review-state.jsonl` prints `semantic match:
  true` for iterations 1, 2 and 3. The only textual difference is object key order inside
  `traceabilityChecks`.
- The reducer's per-finding `dimension` field is derived by the reducer (both P2 rows read
  `correctness`), while this report and the iteration narratives assign each finding the
  dimension it was raised under (traceability and maintainability). The reducer's registry was
  not edited.
- The reducer's `findingClass`, `scopeProof` and `affectedSurfaceHints` fields read `null`/empty
  because the delta `finding` rows carry only the contract fields (`id`, `severity`, `title`,
  `file`, `iteration`). The values are stated in the Active Finding Registry above and in
  `iterations/iteration-002.md`.
- Iteration 2's recorded `timestamp` was written from an estimate and reads ahead of the
  gateway's `committed_at` for that record. It is metadata only; the counts, ids and prose agree
  across the narrative, delta and state log, which is what the integrity comparison above shows.
- During synthesis a helper script was invoked once with the wrong argument and wrote a stray
  untracked `x` at the repository root. It was removed immediately; no tracked file was touched
  and `git status --short` shows only the changes that predated this run.

