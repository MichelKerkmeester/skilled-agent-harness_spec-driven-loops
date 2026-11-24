# Deep Review Report — mcp-browser-use hub

- Spec folder: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub`
- Artifact directory: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/review/lineages/vibe-2`
- Run: `fanout-vibe-2-1795504079797-ay97sx`, generation 1, lineageMode `new`
- Executor: cli-mistral-vibe, model deepseek-flash
- Iterations: 5 of 7 (stopped on convergence)
- Stop reason: `converged`

## 1. Executive Summary

- **Overall verdict: CONDITIONAL**
- **hasAdvisories: false** — the verdict is CONDITIONAL, so the advisory flag does not apply; six P2 items remain active alongside the three P1 items.
- **P0/P1/P2 counts: 0 / 3 / 6** — these are the counts the verdict used, read from the reducer-owned registry after iteration 5.
- **Self-check outcomes.** No P0 candidate was raised in this run, so no full Hunter/Skeptic/Referee pass was required. Three gate-relevant P1 findings each carry a compact skeptic/referee packet: `R1-P1-001` survived a challenge that the anchor could not fire for the hub itself (it cannot, because `mcp-browser-use` ends in a three-letter noun, but it can for other skills, and the reach was demonstrated); `R2-P1-003` survived a challenge that the guard might normalize the path (it does not, and the guard was run as a shell probe to prove it); `R4-P1-008` survived a challenge that the hub matrix row might be a deliberate summary (the hub's own no-restatement rule at `SKILL.md:96` forbids it). No finding was downgraded and none was called a false positive.
- **Review scope summary.** 507 pre-bound files from `review-scope-files.txt`. Five iterations covered the four configured dimensions plus one cross-reference pass: correctness (iteration 1), security (iteration 2), traceability (iteration 3), maintainability (iteration 4), cross-reference (iteration 5). Thirteen candidate directions were ruled out with recorded evidence.
- **Operator review focus:** every phase's shipped work against its goal criteria, including the phase 014 fixes and the advisor scorer change it made

The run converged at iteration 5 with a new-findings ratio of 0.0 against a threshold of 0.10. The hub's routing surface is sound: the compiled destination graph carries exactly the hub's three modes, the recomputed `effectivePolicyHash` matches the recorded one, all 15 canary cases agree with the compiled router, and the `mcp-tooling` parent hub carries no browser pointer. The three P1 findings are all in surfaces the phase 014 fix pass touched but did not finish: the advisor's id-noun length filter, the Aside capture example's containment guard, and the hub capability matrix's `page.on` row.

## 2. Planning Trigger

`/speckit:plan` **is required**: the verdict is CONDITIONAL with three active P1 findings.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    { "id": "R1-P1-001", "severity": "P1", "dimension": "correctness", "file": ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:332", "findingClass": "UNKNOWN" },
    { "id": "R2-P1-003", "severity": "P1", "dimension": "security", "file": ".skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/repl-evidence-capture.sh:33", "findingClass": "UNKNOWN" },
    { "id": "R4-P1-008", "severity": "P1", "dimension": "maintainability", "file": ".skilled/skills/mcp-browser-use/SKILL.md:40", "findingClass": "UNKNOWN" },
    { "id": "R1-P2-002", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/2026-11-24--two-stage-replay--compiled/results.csv:38", "findingClass": "UNKNOWN" },
    { "id": "R2-P2-004", "severity": "P2", "dimension": "security", "file": ".skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/repl-evidence-capture.sh:24", "findingClass": "UNKNOWN" },
    { "id": "R3-P2-005", "severity": "P2", "dimension": "traceability", "file": "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/014-fix-deep-review-findings/acceptance-criteria.md:63", "findingClass": "UNKNOWN" },
    { "id": "R3-P2-006", "severity": "P2", "dimension": "traceability", "file": "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/014-fix-deep-review-findings/goal.md:24", "findingClass": "UNKNOWN" },
    { "id": "R3-P2-007", "severity": "P2", "dimension": "traceability", "file": ".skilled/skills/mcp-browser-use/mcp-chrome-devtools/benchmark/reports/2026-11-22--manual-testing-playbook--remaining-live/README.md:9", "findingClass": "UNKNOWN" },
    { "id": "R4-P2-009", "severity": "P2", "dimension": "maintainability", "file": ".skilled/skills/mcp-browser-use/README.md:8", "findingClass": "UNKNOWN" }
  ],
  "remediationWorkstreams": [
    "W1 — advisor id-noun length filter (R1-P1-001)",
    "W2 — Aside capture containment guard (R2-P1-003)",
    "W3 — hub capability matrix page.on row (R4-P1-008)",
    "W4 — P2 advisories: replay row disclosure, URL scheme allowlist, AC-013 command, registry closure, Chrome DevTools playbook text, README version"
  ],
  "specSeed": [
    "Amend the advisor scorer contract so the id-noun anchor requires a noun longer than the ordinary-word floor, and add a negative case that names a common four-letter word.",
    "Amend the Aside capture example contract so the session-dir guard normalizes the path before the prefix test.",
    "Amend the hub SKILL.md contract so the capability matrix carries no mode-level capability claim, or carries one that matches the mode packet."
  ],
  "planSeed": [
    "Fix `promptNamesIdNoun` in `fusion.ts:332-335` and add a regression case for `change the mode to plan`.",
    "Normalize the session dir in `repl-evidence-capture.sh:33-38` before the `./tmp/*` prefix test.",
    "Replace the `page.on(...)` row in `.skilled/skills/mcp-browser-use/SKILL.md:40` with the packet's documented limitation.",
    "Align `.skilled/skills/mcp-browser-use/README.md:8` to `1.1.2.0`.",
    "Record the phase 014 closures in the findings registry that `014-fix-deep-review-findings/goal.md` names."
  ],
  "findingClasses": ["UNKNOWN"],
  "affectedSurfacesSeed": [
    ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts",
    ".skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/repl-evidence-capture.sh",
    ".skilled/skills/mcp-browser-use/SKILL.md",
    ".skilled/skills/mcp-browser-use/README.md",
    ".skilled/skills/mcp-browser-use/mcp-chrome-devtools/benchmark/reports/2026-11-22--manual-testing-playbook--remaining-live/README.md",
    "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/014-fix-deep-review-findings/acceptance-criteria.md",
    "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/014-fix-deep-review-findings/goal.md"
  ],
  "fixCompletenessRequired": true
}
```

`findingClass` is `UNKNOWN` for every finding because the reducer-owned registry stores `findingClass: null` for all nine entries: the iteration deltas carried the class in prose but the registry projection did not retain it. This is marked rather than inferred, per the report contract.

## 3. Active Finding Registry

### P1 — required

| ID | Dimension | Title | Location | Evidence | Impact | Fix recommendation | Disposition | findingClass | scopeProof | affectedSurfaceHints |
|---|---|---|---|---|---|---|---|---|---|---|
| R1-P1-001 | correctness | The id-noun anchor length filter does not exclude ordinary prompt words, so the task-intent floor still lifts skills whose id noun is a common four-letter word | `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:332` | `promptNamesIdNoun` accepts any noun of length ≥ 4; `change the mode to plan` scores `mcp-code-mode` lexical 0.20 against a 0.18 floor, lifting it to 0.82 | An out-of-domain prompt routes to a skill the user did not name, which is the exact failure the anchor was added to prevent | Require the id noun to be longer than the ordinary-word floor, or require a second corroborating signal before the floor applies | active | UNKNOWN | reach demonstrated by running the scorer on the prompt | advisor scorer, lexical lane, explicit lane |
| R2-P1-003 | security | The Aside capture example session-dir containment guard does not normalize the path before the prefix test | `.skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/repl-evidence-capture.sh:33` | `case "./tmp/../../etc" in ./tmp \| ./tmp/*)` prints GUARD PASSES when run as a shell probe | A capture run can write evidence outside the session directory | Normalize with `realpath` or reject any `..` segment before the prefix test | active | UNKNOWN | guard run as a shell probe, not read | Aside capture example, evidence output path |
| R4-P1-008 | maintainability | The hub capability matrix advertises `page.on(...)` events as a working Aside capability, while the Aside packet documents that `page.on` throws on the pinned version | `.skilled/skills/mcp-browser-use/SKILL.md:40` | `mcp-aside-devtools/SKILL.md:147,202-203` and `feature-catalog/feature-catalog.md:122` say `page.on` throws on 1.26.626.1517; the hub's own rule at `SKILL.md:96` forbids restating mode contracts | An agent reading the hub entry point is told a throwing call works | Drop the row, or restate it as the packet's documented limitation | active | UNKNOWN | the contradiction is between two files in the pre-bound scope list | hub SKILL.md, Aside packet, feature catalog |

### P2 — advisory

| ID | Dimension | Title | Location | Evidence | Impact | Fix recommendation | Disposition | findingClass | scopeProof | affectedSurfaceHints |
|---|---|---|---|---|---|---|---|---|---|---|
| R1-P2-002 | correctness | A real browser request written in the hub's own playbook vocabulary reaches the compiled replay as a FAIL row without the row saying which kind it is | `.skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/2026-11-24--two-stage-replay--compiled/results.csv:38` | `MBU-PB-04` is the single FAIL of 49 rows and carries `kind=playbook` | A reader who counts FAIL rows without reading `kind` concludes the criterion failed | Disclose the kind in the README summary line | active | UNKNOWN | row read directly from the CSV | replay results, replay README |
| R2-P2-004 | security | The Aside capture example accepts any URL scheme, so a `file://` target is opened | `.skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/repl-evidence-capture.sh:24` | the URL argument is passed through with no scheme allowlist | A capture run can be pointed at a local file | Allow only `http` and `https` | active | UNKNOWN | argument handling read at the line | Aside capture example |
| R3-P2-005 | traceability | Acceptance row AC-013 names a verification command that cannot produce the evidence it claims | `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/014-fix-deep-review-findings/acceptance-criteria.md:63` | the command names `OUT_DIR`, which the script does not define, and exits 1 with no output | The row cannot be re-verified by a later reader | Name the variable the script actually defines | active | UNKNOWN | command run, exit 1 | phase 014 acceptance criteria |
| R3-P2-006 | traceability | The findings registry that phase 014 D1 names was never updated to record the closures | `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/014-fix-deep-review-findings/goal.md:24` | the parent registry moved to `review-archive/20261124T070727Z-restart/` and reads 33 open / 0 resolved, against 21 open / 2 resolved before the fix pass | The closure record and the tree disagree | Record the closures in the registry the goal names, or amend the goal to name the archive | active | UNKNOWN | both registry snapshots read | phase 014 goal, parent registry |
| R3-P2-007 | traceability | The Chrome DevTools playbook recorded run is 4 PASS and 13 FAIL, and the failing scenario text was not corrected | `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/benchmark/reports/2026-11-22--manual-testing-playbook--remaining-live/README.md:9` | the aggregate table records 4 PASS / 13 FAIL and the failing rows keep their original text | A reader cannot tell a scenario defect from an environment defect | Annotate each failing row with its cause | active | UNKNOWN | aggregate table read | Chrome DevTools playbook report |
| R4-P2-009 | maintainability | The hub README frontmatter carries version 1.1.3.0 while every other hub metadata file and the newest changelog entry carry 1.1.2.0 | `.skilled/skills/mcp-browser-use/README.md:8` | `SKILL.md`, `ROUTER.md`, `description.json`, `mode-registry.json` and `hub-router.json` all carry 1.1.2.0; the newest changelog is `v1.1.2.0.md` | The version-authority rule at `SKILL.md:20` is violated by the file a reader sees first | Set the README to 1.1.2.0 | active | UNKNOWN | six metadata files compared | hub README, hub metadata |

## 4. Remediation Workstreams

**W1 — advisor id-noun length filter (P1, `R1-P1-001`).** Fix `promptNamesIdNoun` so a common four-letter word cannot satisfy the anchor, then add the `change the mode to plan` case to the advisor's own corpus. This is the only finding outside the browser hub, and it is the one that decides whether the hub's own routing stays clean as more skills are added.

**W2 — Aside capture containment guard (P1, `R2-P1-003`).** Normalize the session directory before the prefix test. The guard is an example script, but it is the script the playbook tells an operator to run, so the gap is reachable.

**W3 — hub capability matrix (P1, `R4-P1-008`).** Remove the `page.on(...)` row from `.skilled/skills/mcp-browser-use/SKILL.md:40`, or restate it as the packet's documented limitation. This is the finding that most directly contradicts the operator focus, because phase 014 fixed the same claim inside the Aside packet and left the hub entry point untouched.

**W4 — P2 advisories.** Six items, none blocking: the replay row's kind disclosure (`R1-P2-002`), the URL scheme allowlist (`R2-P2-004`), the AC-013 command (`R3-P2-005`), the registry closure record (`R3-P2-006`), the Chrome DevTools playbook annotations (`R3-P2-007`), and the README version (`R4-P2-009`). `R3-P2-006` and `R4-P2-009` are the two that a reader hits first, so they are worth doing in the same pass as W3.

## 5. Spec Seed

- The advisor scorer contract should state the minimum id-noun length in terms of the ordinary-word floor, not as a bare character count, so the next reader cannot re-introduce the four-letter case.
- The Aside capture example contract should state that the session directory is normalized before containment is tested, and should name the scheme allowlist.
- The hub `SKILL.md` contract should state that the capability matrix carries no mode-level capability claim at all, which is what `SKILL.md:96` already implies but does not enforce.
- The phase 014 goal should name the registry path that actually holds the closure record, or the registry should be restored to the path the goal names.
- The Chrome DevTools playbook contract should require each failing row to carry its cause, so a 13-FAIL run is readable without the operator's memory.

## 6. Plan Seed

1. `fusion.ts:332-335` — replace the length filter with a floor-relative test; add the `change the mode to plan` regression case.
2. `repl-evidence-capture.sh:33-38` — normalize the session dir before the `./tmp/*` prefix test; add the `./tmp/../../etc` probe as a test.
3. `repl-evidence-capture.sh:24` — allow only `http` and `https` URL schemes.
4. `.skilled/skills/mcp-browser-use/SKILL.md:40` — remove or restate the `page.on(...)` row.
5. `.skilled/skills/mcp-browser-use/README.md:8` — set the version to `1.1.2.0`.
6. `014-fix-deep-review-findings/acceptance-criteria.md:63` — name the variable the script defines.
7. `014-fix-deep-review-findings/goal.md:24` — point at the registry that holds the closure record.
8. Chrome DevTools playbook README — annotate each failing row with its cause.
9. Replay README — disclose the `kind` column in the summary line.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence | Drift |
|---|---|---|---|
| `spec_code` | pass | `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/registry-compiler.cjs:14-16` — the compiler reads the hub's three authored files as its only sources | none |
| `checklist_evidence` | partial | `.skilled/skills/mcp-browser-use/SKILL.md:40` against `.skilled/skills/mcp-browser-use/mcp-aside-devtools/SKILL.md:202-203` — phase 014 AC-012 holds inside the Aside packet but not at the hub | recorded as `R4-P1-008` |

### Overlay Protocols

| Protocol | Status | Evidence | Drift |
|---|---|---|---|
| `skill_agent` | pass | `.skilled/skills/mcp-browser-use/SKILL.md:1-160` and `.skilled/skills/mcp-browser-use/ROUTER.md:1-140` — the hub declares no agent definition of its own; parent-skill-check `12a-router-contract` and `12b-routing-shape` pass | none |
| `agent_cross_runtime` | not applicable | the hub ships no agent definition and no runtime mirror of its own | none |
| `feature_catalog_code` | pass | `.skilled/skills/mcp-browser-use/mcp-aside-devtools/feature-catalog/feature-catalog.md:122` agrees with the Aside packet on the `page.on` limitation | none |
| `playbook_capability` | partial | all three modes have a recorded run; the Chrome DevTools run is 4 PASS / 13 FAIL and the failing scenario text was not corrected | recorded as `R3-P2-007` |

**AC_COVERAGE: advisory-shortfall.** Phase 014's acceptance criteria carry 13 rows; 12 are backed by a command that produces the claimed evidence and 1 (`AC-013`) is not, recorded as `R3-P2-005`. The floor for a lifecycle-active spec-folder target is every row re-verifiable, so the shortfall is one row.

## 8. Deferred Items

- **`validate.sh --strict --recursive` on this packet.** Blocked for this lineage: the command writes repo-wide, which is outside the lineage write surface. The completion criterion that names it is left to the cross-lineage merge, which can run it from the root.
- **The second cross-reference pass** named in iteration 5's Next Focus — the three mode packets' own cross-references, the Aside and Chrome DevTools playbooks against their recorded `results.csv` rows, and the Bladebro install guide against `install.sh`. The loop converged before it ran, so it is follow-up review work rather than a finding.
- **`R3-P2-006`** is deferred rather than fixed because the registry it names has moved into `review-archive/`; deciding whether to restore the path or amend the goal is a spec decision, not a review decision.
- **No `frontier` object** exists in the registry, so this section adds no frontier follow-up nodes.

## Dimension Expansion Map

- **Saturated directions:** none recorded.
- **Completed pivots:** 0. **Failed pivots:** 0. **Audited overrides:** 0.
- **Council artifact references:** none.
- **Selected review directions:** correctness (iteration 1), security (iteration 2), traceability (iteration 3), maintainability (iteration 4), cross-reference (iteration 5).
- **Remaining frontier:** none recorded. All four configured dimensions are complete and one cross-reference pass is complete.
- This section records breadth only and does not alter the verdict, the advisory flag, the finding registry, or the self-check results.

## 9. Search Ledger

- **`searchCoverage`:** required bug classes `stale_compiled_artifact`, `hash_drift`, `mode_set_drift`, `cross_hub_leak`; all four covered; none deferred, none blocked; `graphCoverageMode: graph`.
- **`candidateCoverage`:** 14 bug classes covered — `boundary_condition`, `cross_hub_leak`, `duplicated_contract`, `hash_drift`, `incomplete_fix`, `mode_set_drift`, `path_traversal`, `spec_mismatch`, `stale_compiled_artifact`, `stale_prose`, `stale_reference`, `unbacked_claim`, `unvalidated_input`, `version_drift`. Ruled out: `credential_exposure` and the remaining classes the registry lists.
- **`searchDebt`:** empty. `hasSearchDebt: false`.
- **`ruledOutCandidates`:** 13 entries, each with its evidence. The full list is in the Audit Appendix.
- **`cleanSearchProof`:** 13 entries, one per ruled-out candidate, each naming the probe that settled it.

## 10. Audit Appendix

### Convergence summary

| Iteration | Dimension | New findings | Weighted new | Ratio | Verdict |
|---|---|---|---|---|---|
| 1 | correctness | 2 (1 P1, 1 P2) | 6 | 1.0 | CONDITIONAL |
| 2 | security | 2 (1 P1, 1 P2) | 6 | 1.0 | CONDITIONAL |
| 3 | traceability | 3 (3 P2) | 3 | 1.0 | CONDITIONAL |
| 4 | maintainability | 2 (1 P1, 1 P2) | 6 | 1.0 | CONDITIONAL |
| 5 | cross-reference | 0 | 0 | 0.0 | CONDITIONAL |

Convergence threshold 0.10; iteration 5's ratio of 0.0 met it, so the loop stopped at 5 of 7 iterations. `convergenceScore` 1.0. No iteration was a recovery iteration and no approach was retried after being marked blocked.

### Coverage summary

- Dimensions: 4 of 4 complete (`correctness`, `security`, `traceability`, `maintainability`), plus one cross-reference pass. `dimension_coverage` = 1.0.
- Traceability: 4 required protocols executed, 3 pass, 1 partial, 0 fail, 0 blocked, 0 gating failures.
- Files reviewed across the run: 30 distinct paths, listed in the strategy's `## 15. FILES UNDER REVIEW`.

### Ruled-out claims

1. The browser hub is still lifted on out-of-domain prompts — `mcp-browser-use` ends in a three-letter noun, so the anchor cannot fire for it (iteration 1).
2. The `har` removal is incomplete — both the token boost and the lexical category hint were removed in the same change (iteration 1).
3. The mode registry and hub router disagree on mode count — both carry three modes and `10d-reachability` plus `12b-routing-shape` pass (iteration 1).
4. Phase 014's completion criterion contradicts the replay — `MBU-PB-04` is `kind=playbook`, outside the three kinds the criterion names (iteration 1).
5. The Bladebro install gate runs package code before the digest check — `--ignore-scripts` is on the install and all three `verify_digest` calls precede the first `--version` (iteration 2).
6. The Chrome DevTools install is unpinned — `install.sh:30` pins `browser-debugger-cli@0.6.10` (iteration 2).
7. The installer parity fix is one-sided — the two `_utils.sh` copies are byte-identical (iteration 2).
8. The compiled policy card can attest live activation — it is stamped `DOCUMENT_ONLY_UNATTESTED` and replay returns `PREPARED_DRAFT` (iteration 2).
9. A mode has no recorded playbook run — Bladebro has one, Aside has seven, Chrome DevTools has three (iteration 3).
10. The ClickUp evidence citations are broken — every cited path resolves and every row discloses that raw output was not kept (iteration 3).
11. Phase 014 dropped a finding — `tasks.md` names the finding ids each task closes (iteration 3).
12. `ROUTER.md` routes to leaves that are not in the generated manifest — all eight `RESOURCE_MAP` paths resolve and each is listed packet-relative (iteration 4).
13. The hub declares a second advisor identity — `description.json` carries one identity and every mode is `routingClass: metadata` (iteration 4).

Iteration 5 added six more ruled-out directions, recorded in `iterations/iteration-005.md` and in `deltas/iter-005.jsonl`: the compiled policy is not stale, the harness does not read a stale mirror, the compiled graph carries no extra mode, the canary gold agrees with the router, phase 014's `mcp-tooling` hash edit is backed by the `mcp-code-mode` source change, and the serving-closure manifest is complete.

### Sources reviewed

- Iteration artifacts: `iterations/iteration-001.md` through `iterations/iteration-005.md`.
- Deltas: `deltas/iter-001.jsonl` through `deltas/iter-005.jsonl`.
- Reducer-owned state: `deep-review-findings-registry.json`, `deep-review-dashboard.md`, `deep-review-strategy.md`.
- `steer.md` does not exist in the lineage directory; it was checked before every iteration.
- `resource-map.md` is absent, so the Resource Map Coverage Gate section is omitted rather than reported as passed.

### Cross-reference appendix

**Core Protocols**

- `spec_code` — pass. The compiled-routing hub compiler reads `mcp-browser-use/mode-registry.json`, `hub-router.json` and `SKILL.md` as its only three sources (`registry-compiler.cjs:14-16`), so the compiled policy derives from the hub the spec describes.
- `checklist_evidence` — partial. Phase 014 AC-012 fixed the `page.on` claim inside the Aside packet but its search scope excluded the hub, so the same claim survives at `SKILL.md:40` (`R4-P1-008`).

**Overlay Protocols**

- `skill_agent` — pass. The hub declares no agent definition of its own; parent-skill-check `12a-router-contract` and `12b-routing-shape` pass.
- `agent_cross_runtime` — not applicable. The hub ships no agent definition and no runtime mirror.
- `feature_catalog_code` — pass. The Aside feature catalog agrees with the Aside packet on the `page.on` limitation.
- `playbook_capability` — partial. All three modes have a recorded run; the Chrome DevTools run is 4 PASS / 13 FAIL with uncorrected failing scenario text (`R3-P2-007`).

### Recorded conflicts

- **Config write.** The deep-review agent contract marks `deep-review-config.json` read-only and forbids modifying config after init, while the workflow's `step_update_config_status` sets `status: "complete"`. The workflow was followed because the write stays inside the lineage directory; the conflict is recorded here rather than resolved silently.
- **`validate.sh --strict --recursive`.** The parent goal's completion criterion names it, but running it writes repo-wide, which is outside this lineage's write surface. It is recorded as blocked and left to the cross-lineage merge.
- **Write-surface slip.** One probe was first written to `/tmp/probe2.cjs`, outside the lineage. It was deleted in the same command that noticed it; every later probe lives inside the lineage directory. No repository file was touched.

Review verdict: CONDITIONAL
