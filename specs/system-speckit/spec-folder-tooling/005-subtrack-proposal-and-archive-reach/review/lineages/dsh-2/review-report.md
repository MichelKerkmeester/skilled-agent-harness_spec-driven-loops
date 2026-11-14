# Deep Review Report: 005-subtrack-proposal-and-archive-reach

## 1. Executive Summary

- **Overall verdict: CONDITIONAL**
- **hasAdvisories: false** (the verdict is CONDITIONAL, so the P2-only advisory flag does not apply)
- **Active findings:** P0 = 0, P1 = 4, P2 = 11 (15 total)
- **Review scope:** exactly `goal-file-manifest.txt`, 74 paths changed by phases 001-010 outside `specs/`. The review read the code producers (`relocate.mjs`, `create.sh`, `archive.sh`, `suggest-subtracks.mjs`, `rg-wrapper.mjs`) and every manifest documentation page that states a phase 006-010 behaviour. Tests, generated JSON, fixtures and presentation assets outside that behavioural path were checked only as supporting anchors; the manifest excludes generated JSON by design.
- **Operator review focus:** Scope is exactly goal-file-manifest.txt in the spec folder. Check alignment: code against .skilled/skills/sk-code/sk-code-skilled; SKILL.md, references, feature-catalog and manual-testing-playbook against .skilled/skills/sk-doc/sk-create-skill, sk-create-feature-catalog and sk-create-manual-testing-playbook; command docs and presentation assets against sk-doc/sk-create-command; READMEs including root README.md against sk-doc/sk-create-readme. Highest yield: docs stale against phases 006-010 behaviour, which SKILL.md, references, changelog, feature catalog, playbook and README were never updated for: relocate.mjs exit 3, late-step ledger marks and resume, case-folded duplicate refusal, phase-map bare-name and re-parent rewrites, pre-archive id rewrite, mixed-track restore refusal, archive-aware phase numbering, archivedPaths in path JSON, suggest-subtracks refusing non NNN-slug packets, reworded archive signal. Cite exact file:line for each gap; also say which docs need no change.
- The review's answer to that focus: the shipped code for phases 006-010 matches the phase goals; the operator-facing documentation does not, in fifteen specific places. Six behaviours are cleanly documented (resume by rerunning the same map, default archive exclusion, the four relocation modes, the sub-track declaration, archive-aware packet numbering in the lifecycle catalog, and the phase 001-005 changelog narrative), and several docs need no change (see Confirmed-Clean in iterations 3-5).

## 2. Planning Trigger

`/speckit:plan` is required. The four active P1 findings are doc/code contract contradictions, not code defects, and each names a current-state document that a doc-led operator or JSON consumer reads. The P2 set should ride with the same remediation change because the surfaces overlap (same catalog pages and playbooks).

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {"id": "F001", "severity": "P1", "title": "SKILL.md next-number helper still ignores archived packets", "file": ".skilled/skills/system-spec-kit/SKILL.md:295", "findingClass": "cross-consumer", "dimension": "traceability"},
    {"id": "F002", "severity": "P1", "title": "Relocation feature catalog omits relocate.mjs exit status 3", "file": ".skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-packet-relocation.md:66", "findingClass": "cross-consumer", "dimension": "traceability"},
    {"id": "F003", "severity": "P1", "title": "Lifecycle catalog restore paragraph contradicts phase 008 verdict and omits mixed-track refusal", "file": ".skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-lifecycle-automation.md:45", "findingClass": "cross-consumer", "dimension": "traceability"},
    {"id": "F004", "severity": "P2", "title": "archive.sh key-file row omits the phase 008 restore guards", "file": ".skilled/skills/system-spec-kit/runtime/cli/spec/README.md:114", "findingClass": "cross-consumer", "dimension": "traceability"},
    {"id": "F005", "severity": "P1", "title": "Retrieval contract documents archive marking only for the structured and count JSON recipes", "file": ".skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:84", "findingClass": "cross-consumer", "dimension": "traceability"},
    {"id": "F006", "severity": "P2", "title": "Structure reference still says the proposal has exactly three non-answer cases", "file": ".skilled/skills/system-spec-kit/references/structure/folder-structure.md:141", "findingClass": "instance-only", "dimension": "traceability"},
    {"id": "F007", "severity": "P2", "title": "Phase guidance does not say an archived phase counts when numbering a new one", "file": ".skilled/skills/system-spec-kit/references/structure/phase-definitions.md:255", "findingClass": "cross-consumer", "dimension": "traceability"},
    {"id": "F008", "severity": "P2", "title": "SKILL.md script list omits the relocation, proposal and archive entrypoints", "file": ".skilled/skills/system-spec-kit/SKILL.md:317", "findingClass": "instance-only", "dimension": "maintainability"},
    {"id": "F009", "severity": "P2", "title": "Changelog exit-code and archive-JSON paragraphs predate phases 008 and 009", "file": ".skilled/skills/system-spec-kit/changelog/v2.13.0.0.md:67", "findingClass": "cross-consumer", "dimension": "traceability"},
    {"id": "F010", "severity": "P2", "title": "Relocation catalog rewrite step still describes only whole-path ids", "file": ".skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-packet-relocation.md:44", "findingClass": "instance-only", "dimension": "maintainability"},
    {"id": "F011", "severity": "P2", "title": "Archive-search catalog says path recipe paths stay plain strings and never names archivedPaths", "file": ".skilled/skills/system-spec-kit/feature-catalog/retrieval/rg-archive-search.md:28", "findingClass": "cross-consumer", "dimension": "maintainability"},
    {"id": "F012", "severity": "P2", "title": "Relocation playbook has no status-3 or resume scenario", "file": ".skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-packet-relocation.md:226", "findingClass": "instance-only", "dimension": "maintainability"},
    {"id": "F013", "severity": "P2", "title": "Proposal playbook never feeds the printed map to the relocation preflight", "file": ".skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/sub-track-proposal.md:169", "findingClass": "instance-only", "dimension": "maintainability"},
    {"id": "F014", "severity": "P2", "title": "Archive-search playbook Pass/Fail row checks text output only and not the path JSON record", "file": ".skilled/skills/system-spec-kit/manual-testing-playbook/retrieval/rg-archive-search.md:176", "findingClass": "instance-only", "dimension": "maintainability"},
    {"id": "F015", "severity": "P2", "title": "Sub-track proposal catalog non-answer enumeration omits the non-NNN-slug refusal", "file": ".skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/sub-track-proposal.md:30", "findingClass": "instance-only", "dimension": "maintainability"}
  ],
  "remediationWorkstreams": [
    {"id": "WS1", "priority": "P1", "findingIds": ["F001", "F002", "F003"], "goal": "Make the allocation, relocation exit and restore contracts state the phase 008-010 behaviour."},
    {"id": "WS2", "priority": "P1", "findingIds": ["F005"], "goal": "Document archivedPaths in the retrieval contract and its three command surfaces."},
    {"id": "WS3", "priority": "P2", "findingIds": ["F004", "F006", "F007", "F008", "F015"], "goal": "Align the reference and SKILL.md procedural statements with the shipped guards and non-answer cases."},
    {"id": "WS4", "priority": "P2", "findingIds": ["F009", "F010", "F011"], "goal": "Refresh the changelog and catalog current-state claims for status 3, the phase 007 rewrites and archivedPaths."},
    {"id": "WS5", "priority": "P2", "findingIds": ["F012", "F013", "F014"], "goal": "Extend playbooks 492-494 so the phase 006-010 behaviours have a scenario step that can fail."}
  ],
  "specSeed": [
    "Add a documentation-remediation phase (or an amendment row in the parent scope table) covering the manifest docs named by F001-F015, so the work has a spec owner instead of an implicit fix-up.",
    "Record that phases 006-010 changed code only and did not carry their doc deltas; the parent 'Files to Change' table currently stops at phase 010's test file.",
    "Keep D2 (mixed tracks forbidden) and D4 (next-number counts archived) visible in the remediation spec, because F001 and F003 are the doc edges of those decisions."
  ],
  "planSeed": [
    "WS1: update SKILL.md:295, feature-catalog/tooling-and-scripts/spec-packet-relocation.md:66 and feature-catalog/tooling-and-scripts/spec-lifecycle-automation.md:45; verify each against relocate.mjs:34-38/1661 and archive.sh:432-440/363-395.",
    "WS2: add archivedPaths to retrieval-conventions.md:84, speckit/search.md:116, search-presentation.txt:120 and speckit/README.txt:105; link the field to rg-wrapper.mjs:380-382.",
    "WS3: update runtime/cli/spec/README.md:114, folder-structure.md:141, phase-definitions.md:255, SKILL.md:317 and feature-catalog/tooling-and-scripts/sub-track-proposal.md:30.",
    "WS4: update changelog/v2.13.0.0.md:67,165, feature-catalog/tooling-and-scripts/spec-packet-relocation.md:44 and feature-catalog/retrieval/rg-archive-search.md:28.",
    "WS5: add one step and one Pass/Fail line to playbooks 492:226, 493:169 and 494:176; run the three scenarios in throwaway copies.",
    "Do not edit runtime/cli/spec/README.md:120, root README.md, AGENTS.md, worked-examples.md, the track-root page, the validation-rule-engine page or the validation playbook; iterations 3-5 found them current for this change."
  ],
  "findingClasses": ["cross-consumer", "instance-only"],
  "affectedSurfacesSeed": [
    "SKILL.md quick reference and script list",
    "feature catalog: spec-packet-relocation, spec-lifecycle-automation, sub-track-proposal, rg-archive-search",
    "references: retrieval-conventions, folder-structure, phase-definitions, quick-reference",
    "changelog v2.13.0.0",
    "manual-testing playbooks 492, 493, 494",
    "runtime/cli/spec/README.md archive.sh and relocate rows"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

| ID | Severity | Dimension | Title | File:line | Class |
|----|----------|-----------|-------|-----------|-------|
| F001 | P1 | traceability | SKILL.md next-number helper still ignores archived packets | `.skilled/skills/system-spec-kit/SKILL.md:295` | cross-consumer |
| F002 | P1 | traceability | Relocation feature catalog omits relocate.mjs exit status 3 | `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-packet-relocation.md:66` | cross-consumer |
| F003 | P1 | traceability | Lifecycle catalog restore paragraph contradicts phase 008 verdict and omits mixed-track refusal | `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-lifecycle-automation.md:45` | cross-consumer |
| F005 | P1 | traceability | Retrieval contract documents archive marking only for the structured and count JSON recipes | `.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:84` | cross-consumer |
| F004 | P2 | traceability | archive.sh key-file row omits the phase 008 restore guards | `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md:114` | cross-consumer |
| F006 | P2 | traceability | Structure reference still says the proposal has exactly three non-answer cases | `.skilled/skills/system-spec-kit/references/structure/folder-structure.md:141` | instance-only |
| F007 | P2 | traceability | Phase guidance does not say an archived phase counts when numbering a new one | `.skilled/skills/system-spec-kit/references/structure/phase-definitions.md:255` | cross-consumer |
| F008 | P2 | maintainability | SKILL.md script list omits the relocation, proposal and archive entrypoints | `.skilled/skills/system-spec-kit/SKILL.md:317` | instance-only |
| F009 | P2 | traceability | Changelog exit-code and archive-JSON paragraphs predate phases 008 and 009 | `.skilled/skills/system-spec-kit/changelog/v2.13.0.0.md:67` | cross-consumer |
| F010 | P2 | maintainability | Relocation catalog rewrite step still describes only whole-path ids | `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-packet-relocation.md:44` | instance-only |
| F011 | P2 | maintainability | Archive-search catalog says path recipe paths stay plain strings and never names archivedPaths | `.skilled/skills/system-spec-kit/feature-catalog/retrieval/rg-archive-search.md:28` | cross-consumer |
| F012 | P2 | maintainability | Relocation playbook has no status-3 or resume scenario | `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-packet-relocation.md:226` | instance-only |
| F013 | P2 | maintainability | Proposal playbook never feeds the printed map to the relocation preflight | `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/sub-track-proposal.md:169` | instance-only |
| F014 | P2 | maintainability | Archive-search playbook Pass/Fail row checks text output only and not the path JSON record | `.skilled/skills/system-spec-kit/manual-testing-playbook/retrieval/rg-archive-search.md:176` | instance-only |
| F015 | P2 | maintainability | Sub-track proposal catalog non-answer enumeration omits the non-NNN-slug refusal | `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/sub-track-proposal.md:30` | instance-only |

### Finding Evidence

- **F001.** `SKILL.md:295` prints the highest live `specs/NNN-*` folder; `create.sh:1644` and `:1813` count `z_archive/` at the root and phase paths. Case: live `006` plus archived `007` makes the helper print `006` and the next allocation collides with `007`. Fix: add the archive to the one-liner or point the row at `create.sh`.
- **F002.** `spec-packet-relocation.md:66` ends at status 2 and calls a failed close status 2; `relocate.mjs:34-38` and `:1661` return 3 when the sweep passed and only a moved packet's validation failed. Fix: add the status-3 row and the rerun meaning.
- **F003.** `spec-lifecycle-automation.md:45` says a failed relocate run makes the restore exit 1; `archive.sh:432-440` treats status 3 as a completed restore with a warning and `:363-395` refuses a mixed-track restore. Fix: state both.
- **F004.** `runtime/cli/spec/README.md:114` lists the archive.sh restore next-number path and symlink/dot-segment refusals but not the mixed-track refusal or the status-3 verdict. Fix: add both to the row.
- **F005.** `retrieval-conventions.md:84` names `archived: true|false` on structured/count rows only; `rg-wrapper.mjs:380-382` adds `archivedPaths` beside the path recipe's unchanged `paths`. Fix: document the field in the contract and the three command surfaces.
- **F006.** `folder-structure.md:141` says exactly three no-map cases; `suggest-subtracks.mjs:291-300` adds the non-NNN-slug refusal. Fix: make it four and name the rename-first remedy.
- **F007.** `phase-definitions.md:255` says "next sequential child phase"; `create.sh:1808-1829` counts the parent's `z_archive/`. Fix: state that archived phases count.
- **F008.** `SKILL.md:317` lists four scripts and omits `relocate.mjs`, `suggest-subtracks.mjs` and `archive.sh`. Fix: add them to the script list and a relocation row to the Quick Reference.
- **F009.** `changelog/v2.13.0.0.md:67` omits status 3 and `:165` omits `archivedPaths`. Fix: amend the release note or add a post-release note.
- **F010.** `spec-packet-relocation.md:44` describes whole-path ids only; `relocate.mjs:680-753` and `:647-678` add bare-name and pre-archive rewrites. Fix: add both steps to "What a move rewrites".
- **F011.** `rg-archive-search.md:28` says the path list stays plain strings and never names `archivedPaths`. Fix: add the field beside the `paths` sentence.
- **F012.** `spec-packet-relocation.md:226` only requires `APPLY_EXIT=0` and a clean rerun; phase 006 resume and phase 008 status 3 have no step. Fix: add a failing-once step and a status-3 fixture step.
- **F013.** `sub-track-proposal.md:169` never runs `relocate.mjs --map` and has no non-NNN-slug fixture. Fix: feed the printed map to the dry run (expect exit 1) and add the misnamed case.
- **F014.** `rg-archive-search.md:176` checks text only; phase 009's path JSON `archivedPaths` has no assertion. Fix: add a path-recipe `--json` step and assert `archivedPaths`.
- **F015.** `sub-track-proposal.md:30` lists three no-map cases and omits the misnamed refusal. Fix: make the enumeration four cases, mirroring F006.

## 4. Remediation Workstreams

1. **WS1 (P1) — Allocation, exit and restore contracts.** F001, F002, F003. Update `SKILL.md:295`, `spec-packet-relocation.md:66`, `spec-lifecycle-automation.md:45`; verify each against `create.sh:1637-1662/1808-1829`, `relocate.mjs:34-38/1661`, `archive.sh:363-396/432-440`.
2. **WS2 (P1) — Archive JSON contract.** F005. Update `retrieval-conventions.md:84`, `speckit/search.md:116`, `search-presentation.txt:120`, `speckit/README.txt:105`; cross-link `rg-wrapper.mjs:380-382` and the phase 009 acceptance check.
3. **WS3 (P2) — Reference and SKILL.md procedural alignment.** F004, F006, F007, F008, F015. Add the mixed-track/status-3 guards to the CLI README, the fourth no-map case, the archived-phase numbering rule, and the three missing entrypoints.
4. **WS4 (P2) — Changelog and catalog refresh.** F009, F010, F011. Add status 3 and `archivedPaths` to the release note; add the bare-name and pre-archive rewrites to the relocation catalog; add `archivedPaths` to the archive-search catalog.
5. **WS5 (P2) — Playbook coverage.** F012, F013, F014. Add the resume/status-3 step, the preflight-acceptance step and the path-JSON assertion to playbooks 492-494.

## 5. Spec Seed

- Add a documentation-remediation phase (or an amendment row in the parent scope table) covering the manifest docs named by F001-F015. Phases 006-010 changed code only; the parent `Files to Change` table stops at phase 010's test file.
- Keep D2 (mixed tracks forbidden) and D4 (next-number counts archived) visible in the remediation spec; F001 and F003 are the doc edges of those decisions.
- Record the review focus's "docs that need no change" list as an explicit non-goal so the remediation does not churn current pages: root `README.md`, `AGENTS.md`, `worked-examples.md`, `track-root-children-lists.md`, `spec-validation-rule-engine.md`, `spec-validation-archive-reach.md`, and `runtime/cli/spec/README.md:120`.

## 6. Plan Seed

1. WS1 edits and a re-read of the three code anchors.
2. WS2 edits and one `rg-wrapper.mjs path --include-archive --json` sample proving `archivedPaths`.
3. WS3 edits, including the archive-help copy in the lifecycle playbook.
4. WS4 changelog and catalog edits.
5. WS5 playbook steps, run in throwaway copies; capture the command transcript.
6. Re-run `validate.sh` on the touched spec folder only if a spec doc changes; the skill docs are not packet files, so use the sk-doc validators against the edited pages.

## 7. Traceability Status

| Protocol | Level | Status | Evidence | Notes |
|----------|-------|--------|----------|-------|
| `spec_code` | core | partial | F001-F005 doc/code pairs; `create.sh:1644/1813`, `relocate.mjs:34-38/1661`, `archive.sh:363-396/432-440`, `rg-wrapper.mjs:380-382` | The code matches the phase goals; four P1 docs do not state the code. |
| `checklist_evidence` | core | pass | phase 006-010 `tasks.md` and `implementation-summary.md` rows | Implementation is evidenced; the doc layer is the gap. |
| `skill_agent` | overlay | notApplicable | no agent definition in the manifest | |
| `agent_cross_runtime` | overlay | notApplicable | no mirrored agent file in the manifest | |
| `feature_catalog_code` | overlay | partial | F002, F003, F010, F011, F015 | Five current-state claims lag. |
| `playbook_capability` | overlay | partial | F004, F012, F013, F014 | Four scenario/help surfaces cannot catch the new behaviours. |
| `AC_COVERAGE` | advisory | exempt | parent has no `acceptance-criteria.md`; the phase children carry their own | No gate impact. |

## Dimension Expansion Map

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 8. Deferred Items

- F004, F006-F015 are P2 advisories. They do not block the verdict but should ride with WS3-WS5 because they touch the same pages.
- The reworded archive signal lives in generated `graph-metadata.json`, which the manifest excludes. No in-scope doc restates it; it is out of scope, not verified.
- The accepted `Phase N` residual in `decision-record.md` ("Residual against D3") stays accepted; the review does not reopen it.
- The `archive.sh` mixed-track guard returns early when `relocate.mjs` is missing (`archive.sh:371`). That is an installation-state edge, not a reachable input under the shipped layout; recorded as a residual risk.

## 9. Search Ledger

*No search-depth state captured (legacy v1 record).* This review used direct reads, exact greps and producer/consumer traces; it did not run the coverage graph or a v2 search ledger.

## 10. Audit Appendix

| Iteration | Dimension | Focus | Ratio | P0/P1/P2 |
|-----------|-----------|-------|-------|----------|
| 1 | correctness | phase 006-010 code vs docs | 1.0 | 0/3/0 |
| 2 | security | archive-search and restore/refusal boundaries | 0.0625 | 0/3/1 |
| 3 | traceability | SKILL.md, references, changelog | 0.36 | 0/4/5 |
| 4 | maintainability | feature catalog, playbooks, READMEs | 0.1667 | 0/4/10 |
| 5 | cross-reference | active-P1 replay and doc ownership | 0.0323 | 0/4/11 |

- **Stop reason:** `maxIterationsReached` (5 of 5). Convergence was not declared because the coverage graph was not run in this lineage; the latest ratio was 0.0323 and all four dimensions were covered.
- **Files read:** the five code producers and every manifest doc page that states a phase 006-010 behaviour; the remaining manifest entries (tests, fixtures, presentations, config) were checked only as supporting anchors. This is a declared coverage limit, not a silent pass.
- **Findings by class:** cross-consumer 7, instance-only 8.
- **Rule sources:** `sk-code-review/references/review-core.md`; `sk-doc/sk-create-feature-catalog/SKILL.md:176-200,347`; `sk-doc/sk-create-manual-testing-playbook`; `sk-doc/sk-create-readme`; `sk-doc/sk-create-command`.
- **Integration surfaces checked:** `.skilled/skills/system-spec-kit` docs, `runtime/cli/spec` scripts, `runtime/cli/retrieval` wrapper, `/speckit:search` command and presentation, root `README.md` and `AGENTS.md`.
