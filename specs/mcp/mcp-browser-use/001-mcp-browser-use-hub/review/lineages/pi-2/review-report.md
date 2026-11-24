# Review Report: mcp-browser-use hub epic (lineage pi-2)

## 1. Executive Summary

**Verdict: CONDITIONAL.** Active findings: P0 = 0, P1 = 1, P2 = 5 — the counts the verdict used, recomputed by `review-verdict.cjs` from the findings registry and the state log at this stop.

**hasAdvisories: false.** The verdict is not PASS, so no advisory flag applies.

**Scope.** `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` as a phase parent (001 to 014), with the shipped surfaces its criteria name: the `mcp-browser-use` hub and its three mode packets, the `mcp-tooling` relocation, the compiled routing slice for the hub, the three manual-testing playbooks and their run reports, the shared advisor scorer that phase 014 changed, the doctor scripts and git hook that guard hub scripts, and the packet documents themselves. Scope discovery bound 507 files in `review-scope-files.txt`. Six iterations ran, one dimension per pass plus one cross-reference sweep, 4 of 4 dimensions covered.

**Operator review focus:** every phase's shipped work against its goal criteria, including the phase 014 fixes and the advisor scorer change it made.

**Self-check outcomes.** The adversarial self-check re-read the one active P1 against source and confirmed it unchanged: the `staging` hint is still declared and the hint still satisfies the naming anchor, so the Referee made no downgrade and no false-positive call. No P0 was ever raised, so no Hunter/Skeptic/Referee replay was needed. The self-check list is empty, which means the Referee changed nothing.

**Stop reason: `stuckRecovery`** after iteration 6. The composite decision reached two consecutive passes with no new finding (ratios 1, 1, 1, 1, 0, 0) while an active P1 remains, which the loop treats as the stuck threshold rather than as convergence. The review is not stuck for lack of direction: iterations 5 and 6 exhausted the two remaining evidence groups (the un-rechecked acceptance rows and the compiled routing slice). The next pass with new information would need the operator's call on the scorer finding, not another reading of the same tree.

## 2. Planning Trigger

`/speckit:plan` **is required.** The verdict is CONDITIONAL: one shared-surface P1 needs a decision and a fix, and four of the five P2 items are small, independent documentation or gate alignments that can ride the same plan.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "reviewDidNotRun": false,
  "activeFindings": [
    {"id": "PI2-I2-P1-001", "severity": "P1", "dimension": "correctness", "file": ".skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts:30"},
    {"id": "PI2-I1-P2-001", "severity": "P2", "dimension": "traceability", "file": "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/goal.md:135"},
    {"id": "PI2-I1-P2-002", "severity": "P2", "dimension": "traceability", "file": "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/research.md:57"},
    {"id": "PI2-I2-P2-001", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:332"},
    {"id": "PI2-I3-P2-001", "severity": "P2", "dimension": "security", "file": ".utcp_config.json:1"},
    {"id": "PI2-I4-P2-001", "severity": "P2", "dimension": "maintainability", "file": ".skilled/skills/mcp-browser-use/ROUTER.md:53"}
  ],
  "remediationWorkstreams": [
    {"lane": 1, "name": "Scorer naming anchor", "findingIds": ["PI2-I2-P1-001", "PI2-I2-P2-001"]},
    {"lane": 2, "name": "Packet state alignment", "findingIds": ["PI2-I1-P2-001", "PI2-I1-P2-002"]},
    {"lane": 3, "name": "Hub routing documentation", "findingIds": ["PI2-I4-P2-001"]},
    {"lane": 4, "name": "Live-attach gate", "findingIds": ["PI2-I3-P2-001"]}
  ],
  "specSeed": [
    "Decide whether a category hint may satisfy the scorer naming anchor, or narrow the `mcp-browser-use` hint list to phrases only.",
    "Record the close-out discipline that a phase's own progress row is updated in the same change that flips its status.",
    "Require the hub's doc keyword block to be compared against `hub-router.json` whenever routing vocabulary changes."
  ],
  "planSeed": [
    "Replace the bare `staging` hint with a phrase, or exclude hint-only evidence from the naming anchor; re-run the routing replay before and after.",
    "Add a decline-corpus row that pairs a task-intent verb with `staging` and expects no browser recommendation.",
    "Update the parent goal progress row for 014 to Done with its evidence.",
    "Re-state the research lane row with the pin and the operator yes, keeping the amendment note.",
    "Align the `ROUTER.md` Chrome DevTools keyword list with `hub-router.json`.",
    "State the operator gate for `chrome_devtools_live` in the hub docs and the manual note."
  ],
  "findingClasses": {
    "PI2-I2-P1-001": "class-of-bug",
    "PI2-I2-P2-001": "instance-only",
    "PI2-I1-P2-001": "instance-only",
    "PI2-I1-P2-002": "instance-only",
    "PI2-I3-P2-001": "instance-only",
    "PI2-I4-P2-001": "instance-only"
  },
  "affectedSurfacesSeed": [
    "advisor lexical lane",
    "advisor task-intent confidence floor",
    "mcp-browser-use routing",
    "labeled-prompts corpus",
    "parent goal log",
    "001-research research synthesis",
    "hub ROUTER.md",
    ".utcp_config.json"
  ],
  "fixCompletenessRequired": ["PI2-I2-P1-001"]
}
```

## 3. Active Finding Registry

| ID | Sev | Dimension | Title | Evidence | Impact | Fix | Class | Scope proof |
|---|---|---|---|---|---|---|---|---|
| PI2-I2-P1-001 | P1 | correctness | A bare `staging` category hint still lifts `mcp-browser-use` to the 0.82 task-intent floor on non-browser prompts | `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts:30`, `fusion.ts:1226-1233`, `fusion.ts:380-405`, `scoring-constants.ts:191-194` | A non-browser prompt carrying a task verb and the word "staging" is answered with a browser hub at 0.82, which is the class of misroute 014 set out to remove | Drop the bare hint or stop counting a hint as the naming anchor, then replay | class-of-bug | The other two `mcp-browser-use` hints are phrases; the word is used as a deploy-environment word across the corpus; existing decline rows avoid task verbs, so the corpus cannot catch it |
| PI2-I1-P2-001 | P2 | traceability | Parent goal log still reports phase 014 as In Progress | `001-mcp-browser-use-hub/goal.md:135` | A reader of the progress table concludes a fix lane is still running while spec.md, the criteria block and the continuity all say Complete | Update the row to Done with its evidence | instance-only | `rg "In Progress"` matches only this row |
| PI2-I1-P2-002 | P2 | traceability | Research lane table still offers an ungated `npx -y bladebro` launch | `001-research/research/research.md:57` | A reader who stops at the table can launch an unpinned package without an operator yes; AC-002 is marked Met while its stated grep over this file does not hold | State the pin and the operator yes in the row itself | instance-only | Every other Bladebro doc already carries both; only this row is ungated |
| PI2-I2-P2-001 | P2 | correctness | `promptNamesIdNoun` accepts any generic noun as the skill's name | `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:332-335` | Prompts that say "mode", "loop", "code" or "plan" satisfy the naming test for whichever skill id ends in that word | Restrict the noun anchor to distinctive nouns or require a second signal | instance-only | One definition, one call site; the three-character floor already blocks `doc`, `git` and `use` |
| PI2-I3-P2-001 | P2 | security | The live-attach MCP manual is callable with no stated operator gate | `.utcp_config.json:1` (`chrome_devtools_live`, `--autoConnect`) | A Code Mode caller can read the user's signed-in Chrome without any rule requiring consent, while the sibling Bladebro lane requires one | Add the gate to the hub docs and a note on the manual | instance-only | Only the manual and two doc mentions exist; `chrome_devtools_1` already carries `--isolated=true` |
| PI2-I4-P2-001 | P2 | maintainability | `ROUTER.md`'s Chrome DevTools keyword list has drifted from the router | `.skilled/skills/mcp-browser-use/ROUTER.md:53` | Eight applied keywords are undocumented, including `lighthouse audit` (a declared alias) and `chrome performance trace` (the scorer's read-only anchor) | Align the row with `hub-router.json` | instance-only | Aside and Bladebro rows match their classes exactly; Chrome is the one drift |

No finding was resolved, downgraded or disproved during the run.

## 4. Remediation Workstreams

1. **Scorer naming anchor** (`PI2-I2-P1-001`, `PI2-I2-P2-001`). One change in two places: decide what may satisfy the naming anchor, then narrow the vocabulary that reaches it. Order matters: land the anchor rule first, because it changes which vocabulary entries can lift a skill. Re-run the two-stage replay before and after, and add the corpus row that pairs a task verb with `staging`.
2. **Packet state alignment** (`PI2-I1-P2-001`, `PI2-I1-P2-002`). Independent edits, no code risk. Both are cases where a close-out updated the summary and left the row a reader looks at.
3. **Hub routing documentation** (`PI2-I4-P2-001`). The documented vocabulary is a hand-kept copy, so either align it once or copy the generated list.
4. **Live-attach gate** (`PI2-I3-P2-001`). The only security item and the only one that changes a rule rather than a row. Decide whether the gate is documented consent or an actual stop-for-yes.

## 5. Spec Seed

- State what a routing hint is allowed to prove. Right now a hint is both a lexical bonus and proof that the prompt named the skill, and one bare word shows why those should not be the same thing.
- Record the close-out rule that a phase closes its own log row, so a later phase cannot reintroduce a stale progress line by only updating the summary and the status field.
- Record that a routing vocabulary change owns every surface that restates it: `hub-router.json`, `ROUTER.md`, the mode aliases and the corpus.

## 6. Plan Seed

- `T1` Narrow the `mcp-browser-use` hint list or the anchor rule, whichever the operator prefers; re-run the two-stage replay and the corpus evaluation, and add the staging-plus-task-verb row.
- `T2` Update the parent goal progress row for 014 and re-check that `spec.md`, `goal.md` and `graph-metadata.json` still agree after the edit.
- `T3` Re-state the research lane row with `bladebro@4.8.2` and the operator yes, keeping the amendment note as history.
- `T4` Align `ROUTER.md`'s Chrome DevTools keywords with `hub-router.json`, and add a check that the three rows match their classes.
- `T5` State the operator gate for `chrome_devtools_live`, in the hub `SKILL.md`, `ROUTER.md` and the manual note.

## 7. Traceability Status

**Core protocols**

| Protocol | Status | Evidence | Drift |
|---|---|---|---|
| `spec_code` | partial | `registry-compiler.cjs:98-109` builds stage two from `hub-router.json` and fails closed on an unknown class; the hub registry holds the three modes with the required kinds | The 014 scorer contract is not fully met: a bare hint still satisfies the naming anchor (`PI2-I2-P1-001`) |
| `checklist_evidence` | partial | `acceptance-criteria.md:84` (AC-002) | One row's stated verification does not hold as written; every other re-checked row holds (`PI2-I1-P2-002` refines this) |

**Overlay protocols**

| Protocol | Status | Evidence |
|---|---|---|
| `skill_agent` | pass | Hub `SKILL.md:60` and `ROUTER.md:36` state the own-Chrome rule the router applies |
| `agent_cross_runtime` | notApplicable | No agent file is in this target's scope |
| `feature_catalog_code` | pass | Catalog present per mode; nothing contradicted it |
| `playbook_capability` | pass | Three playbook roots with recorded runs; BB-015 carries the Chrome 136+ precondition |

**AC_COVERAGE:** advisory-shortfall. Level 2 target with `acceptance-criteria.md` and a completed `implementation-summary.md`. AC-002 is the one row whose stated verification does not hold. Every row re-checked in iterations 1 to 6 holds; the rows whose only proof is packet tooling keep packet evidence and are named in the Deferred Items. The signal is advisory and did not change the verdict.

## 8. Deferred Items

- **MBU-PB-04** (`benchmark/reports/compiled-routing/2026-11-24--two-stage-replay--compiled/results.csv:38`) fails at stage one only: the advisor returns `mcp-browser-use` at 0 for "The staging site throws runtime errors on load; I need to inspect its network requests and the live DOM to find the cause.", while the front door routes it correctly to `mcp-chrome-devtools`. 014's criteria are scoped to original, paraphrase and out-of-domain rows, so this does not block them; it is a follow-up vocabulary question, and it is the same word ("staging") that `PI2-I2-P1-001` is about.
- **Criteria whose only proof is packet tooling** — `parent-skill-check.cjs`, `validate-playbook-package.cjs`, `check-mcp-mutation-class.sh`, `check-goal.cjs` and `validate.sh --strict --recursive` — were not re-run: this lineage is write-bound to its own directory. They keep their prior packet evidence and should be re-run by the closing commit.
- **Live browser behaviour** was not exercised; no browser was launched by this review.
- **Continuity save** was not performed: the lineage writes only inside its own directory, so the packet's canonical continuity was left untouched.

## Dimension Expansion Map

No pivots, no saturation overrides, no Council artifacts. Directions selected: traceability of the phase criteria (iteration 1), correctness of the 014 fixes and the scorer (2), security of the shipped surfaces (3), maintainability of the routing documentation (4), a cross-reference sweep of the acceptance table (5), and the compiled routing slice (6). Remaining frontier: none recorded; the two unread groups were consumed in iterations 5 and 6.

## 9. Search Ledger

*No search-depth state captured (legacy v1 record).* This lineage emitted v1 iteration records, so `searchCoverage`, `candidateCoverage` and `searchDebt` are empty. `hasSearchDebt: false`. The six iteration narratives carry the equivalent ledger in prose: each names its target group, the bug classes it looked for, and what it ruled out.

## 10. Audit Appendix

**Iteration table**

| N | Dimension | Focus | New findings | Ratio | Files |
|---|---|---|---|---|---|
| 1 | traceability | Phase goal criteria vs shipped work | 2 P2 | 1.0 | 24 |
| 2 | correctness | 014 installer fixes and the scorer change | 1 P1, 1 P2 | 1.0 | 13 |
| 3 | security | Trust boundaries: manual, guards, examples | 1 P2 | 1.0 | 10 |
| 4 | maintainability | Routing documentation vs router | 1 P2 | 1.0 | 12 |
| 5 | traceability | Acceptance cross-reference sweep | none | 0.0 | 16 |
| 6 | correctness + traceability | Compiled routing slice | none | 0.0 | 8 |

**Coverage.** 4 of 4 dimensions covered (correctness, security, traceability, maintainability). Groups covered: packet documents, hub skill root, three mode packets, playbooks and run reports, advisor scorer and corpora, doctor scripts and pre-commit hook, compiled routing slice and activation manifest, `.utcp_config.json`.

**Convergence replay.** Ratios 1, 1, 1, 1, 0, 0. Rolling two-pass average at the stop: 0.0, below the 0.08 cutoff. The loop stopped with `stuckRecovery` because two consecutive passes added no finding while a P1 remains; the composite decision treated that as the stuck threshold rather than as convergence.

**Ruled-out claims.** Installer parity is byte-identical; the `@alpha` pin residue is gone; the mutation guard covers all three hub modes; the Aside examples refuse injection; the compiled vocabulary fails closed; the activation manifest's policy hash matches the recorded serving policy; packet versions match their newest changelog entries.

**Sources reviewed.** Each iteration narrative lists the files it read or grepped in its `## Sources` and `## Files Reviewed` sections; those lists, not a rolled-up count, are the record.

**Cross-reference appendix.** Core: `spec_code` partial, `checklist_evidence` partial. Overlay: `skill_agent` pass, `agent_cross_runtime` notApplicable, `feature_catalog_code` pass, `playbook_capability` pass.

**Provenance.** Session `fanout-pi-2-1795504079797-ay97sx`, generation 1, lineage mode `new`. State records went through the append gateway; the registry, dashboard and strategy are reducer output. Verdict recomputed by `review-verdict.cjs`: CONDITIONAL (0 P0, 1 P1, 5 P2).
