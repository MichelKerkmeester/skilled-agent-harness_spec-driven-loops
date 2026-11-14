# Deep Review Report - Subtrack proposal and archive reach

- Review target: `specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach`
- Review mode: deep review, fan-out lineage `dsh-1`
- Session: `fanout-dsh-1-1794652127582-mfqldk`
- Scope: the 74 paths in `goal-file-manifest.txt`
- Operator focus: documentation alignment against phases 006 to 010, with exact file:line evidence and a no-change list
- Iterations: 5 of 5
- Stop reason: `maxIterationsReached`
- Verdict: **CONDITIONAL**
- Active findings: 0 P0, 6 P1, 6 P2

## 1. Executive Summary

The implementation matches the phase 006-010 decisions. The review found no code defect in the six live P1 areas and no P0. The failure is documentation lag: the relocation feature page and changelog still describe the pre-008 exit contract; the SKILL quick reference computes the next number from live packets only; the restore docs omit the status-3 success branch and the mixed-track refusal; the archive-search docs omit `archivedPaths`; the sub-track docs claim exactly three no-map cases while the implementation has a fourth; and the release notes, manual scenario, and test inventory remain at the phase-005 state.

The implementation evidence is precise: `relocate.mjs` adds status 3 only after the steps and sweep land (`relocate.mjs:1661`), `create.sh` counts archived numbers (`create.sh:1644`), `archive.sh` exits 0 on a status-3 restore and refuses a mixed-track restore (`archive.sh:437`, `archive.sh:394`), `rg-wrapper.mjs` adds `archivedPaths` (`rg-wrapper.mjs:382`), and `suggest-subtracks.mjs` refuses non-`NNN-slug` names before proposing (`suggest-subtracks.mjs:293`). The fixes are documentation and release-note edits, not implementation work.

`hasAdvisories: false` because the verdict is CONDITIONAL, not PASS with P2-only.

## 2. Planning Trigger

`/speckit:plan` is required to schedule the documentation workstreams below. The implementation is already complete for the packet; the plan should prevent a recurrence by naming one authoritative command/reference surface per behavior and updating the secondary summaries from it.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {"id":"R1-P1-001","severity":"P1","title":"Relocation feature page and changelog still state the pre-008 exit contract and omit status 3","file":"feature-catalog/tooling-and-scripts/spec-packet-relocation.md:66"},
    {"id":"R1-P1-002","severity":"P1","title":"Published next-number command ignores archived packets","file":"SKILL.md:295"},
    {"id":"R2-P1-004","severity":"P1","title":"Renumbered restore docs say every relocation failure exits 1, but status 3 is a successful restore","file":"feature-catalog/tooling-and-scripts/spec-lifecycle-automation.md:45"},
    {"id":"R2-P1-005","severity":"P1","title":"The archive command reference and lifecycle docs omit the mixed-track restore refusal","file":"runtime/cli/spec/README.md:114"},
    {"id":"R3-P1-007","severity":"P1","title":"Archive-search docs omit archivedPaths and misstate the path record shape","file":"feature-catalog/retrieval/rg-archive-search.md:28"},
    {"id":"R3-P1-008","severity":"P1","title":"suggest-subtracks docs say three no-map cases, but a non-NNN-slug packet adds a fourth","file":"references/structure/folder-structure.md:141"},
    {"id":"R1-P2-003","severity":"P2","title":"Root and skill READMEs summarize relocation without the status-3 contract","file":"system-spec-kit/README.md:639"},
    {"id":"R2-P2-006","severity":"P2","title":"archive.sh --help omits both new restore outcomes","file":"runtime/cli/spec/archive.sh:83"},
    {"id":"R3-P2-009","severity":"P2","title":"Relocation docs describe only whole-id rewrites and omit the phase-007 bare-name and pre-archive passes","file":"feature-catalog/tooling-and-scripts/spec-packet-relocation.md:44"},
    {"id":"R4-P2-010","severity":"P2","title":"The v2.13.0.0 changelog stopped at the phase-005 release and its test counts no longer match the packet","file":"changelog/v2.13.0.0.md:216"},
    {"id":"R4-P2-011","severity":"P2","title":"Manual scenario 492 still exercises only the pre-remediation relocation surface","file":"manual-testing-playbook/tooling-and-scripts/spec-packet-relocation.md:27"},
    {"id":"R4-P2-012","severity":"P2","title":"Feature and playbook source inventories still list only relocate.vitest.ts","file":"feature-catalog/tooling-and-scripts/spec-packet-relocation.md:91"}
  ],
  "remediationWorkstreams": [
    {"order":1,"name":"Relocation exit and resume contract","findings":["R1-P1-001","R1-P2-003"],"surfaces":["feature-catalog/tooling-and-scripts/spec-packet-relocation.md","feature-catalog/feature-catalog.md","changelog/v2.13.0.0.md","system-spec-kit/README.md","README.md"]},
    {"order":2,"name":"Archived-aware numbering guidance","findings":["R1-P1-002"],"surfaces":["SKILL.md","references/structure/phase-definitions.md"]},
    {"order":3,"name":"Restore success and mixed-track refusal","findings":["R2-P1-004","R2-P1-005","R2-P2-006"],"surfaces":["feature-catalog/tooling-and-scripts/spec-lifecycle-automation.md","runtime/cli/spec/README.md","archive.sh help","changelog","skill README"]},
    {"order":4,"name":"Archive path JSON contract","findings":["R3-P1-007"],"surfaces":["feature-catalog/retrieval/rg-archive-search.md","references/retrieval/retrieval-conventions.md","commands/speckit/search.md","commands/speckit/README.txt","commands/speckit/assets/search-presentation.txt","README.md","system-spec-kit/README.md"]},
    {"order":5,"name":"Proposal no-map cases and phase-007 rewrites","findings":["R3-P1-008","R3-P2-009"],"surfaces":["references/structure/folder-structure.md","feature-catalog/tooling-and-scripts/sub-track-proposal.md","feature-catalog/tooling-and-scripts/spec-packet-relocation.md"]},
    {"order":6,"name":"Release notes, manual scenario, and test inventory","findings":["R4-P2-010","R4-P2-011","R4-P2-012"],"surfaces":["changelog/v2.13.0.0.md","manual-testing-playbook/tooling-and-scripts/spec-packet-relocation.md","feature-catalog/tooling-and-scripts/spec-packet-relocation.md"]}
  ],
  "specSeed": [
    "Add the phase-008 status-3 contract and the status-3 rerun behavior to every relocation summary that currently stops at 0/1/2.",
    "Change the SKILL next-number command and the phase-definition prose to count live and archived packets.",
    "Document the renumbered-restore status-3 success branch and the mixed-track restore refusal, including the suggested sub-track recovery command.",
    "Document archivedPaths beside paths in every path-JSON consumer, including the no-flag empty-array shape.",
    "Add the non-NNN-slug refusal as a fourth no-map case and name the bare-name and pre-archive rewrite passes in the relocation feature page.",
    "Add a later release note or version entry with the current 2603-test count and the phase 006-010 behavior."
  ],
  "planSeed": [
    "Pick one authoritative command reference per behavior; update the feature catalog, changelog, README, and presentation summaries from it.",
    "Edit the six P1 surfaces first; run the command-doc/skill/feature-catalog/manual-playbook validators after the edits.",
    "Add the status-3 and late-step rerun cases to manual scenario 492, or add a sibling scenario that uses the real-pipeline suite.",
    "Add relocate-real-pipeline.vitest.ts to the catalog and playbook test inventories.",
    "Re-run the affected validation and manual checks, then close the P1s in a follow-up review."
  ],
  "findingClasses": ["cross-consumer","instance-only"],
  "affectedSurfacesSeed": [
    "relocation CLI feature page and root catalog",
    "changelog and package version",
    "SKILL quick-reference and phase-definition guide",
    "archive command reference and lifecycle feature page",
    "archive.sh help",
    "archive-search feature page, retrieval conventions, search command, search presentation, and READMEs",
    "folder-structure sub-track guidance",
    "manual scenario 492 and its test anchors"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

| ID | Severity | Title | Dimension | File:line | Evidence | Impact | Fix recommendation | Disposition | Finding class | Scope proof | Affected surface hints |
|---|---|---|---|---|---|---|---|---|---|---|---|
| R1-P1-001 | P1 | Relocation feature page and changelog still state the pre-008 exit contract and omit status 3 | correctness, traceability | `feature-catalog/tooling-and-scripts/spec-packet-relocation.md:66` | Phase 008 goal:44; `relocate.mjs:1661`; command README:120 | A landed move that exits 3 is documented as a failed close | Add the status-3 branch and the rerun contract to the feature page, root catalog, changelog, and README summaries | Active | cross-consumer | Same omission in root catalog:690 and changelog:67; command README:120 is current | feature catalog, changelog, READMEs |
| R1-P1-002 | P1 | Published next-number command ignores archived packets | correctness, traceability | `SKILL.md:295` | `create.sh:1644`; phase 008 goal:47; `phase-definitions.md:82` | Manual next-number calculation can collide with an archived number | Count `z_archive` in the command or remove it in favor of `create.sh`; update the phase-definition prose | Active | cross-consumer | `rg` finds only the two stale surfaces; `create.sh` is the producer | SKILL, phase-definitions |
| R2-P1-004 | P1 | Renumbered restore docs say every relocation failure exits 1, but status 3 is a successful restore | security, traceability | `feature-catalog/tooling-and-scripts/spec-lifecycle-automation.md:45` | Phase 008 goal:45; `archive.sh:437`, `:442` | Automation misreads a completed restore as failed | Add the status-3 success branch and warning; keep exit 1 for nonzero statuses other than 3 | Active | cross-consumer | Command README omits the branch; feature page asserts the blanket rule | lifecycle feature page, command README, help |
| R2-P1-005 | P1 | The archive command reference and lifecycle docs omit the mixed-track restore refusal | security, traceability | `runtime/cli/spec/README.md:114` | Phase 008 goal:46; `archive.sh:363`, `:394`; `archive-track.vitest.ts:645` | Operators cannot predict or recover from the only restore refusal that protects track shape | Document the refusal and the `--to <track>/<sub>/...` recovery command | Active | cross-consumer | Same omission in lifecycle page, changelog, skill README, and help | command README, lifecycle page, changelog, help |
| R3-P1-007 | P1 | Archive-search docs omit archivedPaths and misstate the path record shape | traceability | `feature-catalog/retrieval/rg-archive-search.md:28` | Phase 009 goal:47; `rg-wrapper.mjs:382`; `rg-include-archive.vitest.ts:138` | JSON consumers miss the archived subset or assume the old shape | Document `archivedPaths` beside `paths`, including the empty-array no-flag case | Active | cross-consumer | `rg` finds zero doc hits; eight changed docs share the gap | feature page, retrieval conventions, search command, presentation, READMEs |
| R3-P1-008 | P1 | `suggest-subtracks` docs say three no-map cases, but a non-NNN-slug packet adds a fourth | traceability | `references/structure/folder-structure.md:141` | Phase 009 goal:47; `suggest-subtracks.mjs:293`, `:298`; `suggest-subtracks.vitest.ts:207` | A legacy underscore packet produces an unexplained no-map | Add the misnamed-packet case to the no-map list in both docs | Active | cross-consumer | Same three-case claim in the feature page:30 | folder-structure, sub-track feature page |
| R1-P2-003 | P2 | Root and skill READMEs summarize relocation without the status-3 contract | maintainability | `system-spec-kit/README.md:639` | `README.md:416`; command README:120 | First-read operator misses the status-3 warning | Add a short status-3 note or link to the command README | Active | cross-consumer | The two summaries are the only top-level relocation surfaces | skill README, root README |
| R2-P2-006 | P2 | `archive.sh --help` omits both new restore outcomes | maintainability | `runtime/cli/spec/archive.sh:83` | Help heredoc:77-95; `archive.sh:363`, `:437` | The command's own help is less accurate than its implementation | Add the mixed-track refusal and status-3 warning notes | Active | instance-only | The help heredoc is the only command-level help block | archive.sh help |
| R3-P2-009 | P2 | Relocation docs describe only whole-id rewrites and omit the phase-007 bare-name and pre-archive passes | traceability, maintainability | `feature-catalog/tooling-and-scripts/spec-packet-relocation.md:44` | Phase 007 goal:44; `relocate.mjs:680`, `:1029`; `relocate.vitest.ts:328`; `archive-track.vitest.ts:176` | Operator under-anticipates the documents a renumber/re-parent changes | Describe both passes and add the covering suites to the test table | Active | cross-consumer | Command README:120 also says only "whole old id" | relocation feature page, command README, test inventory |
| R4-P2-010 | P2 | The v2.13.0.0 changelog stopped at the phase-005 release and its test counts no longer match the packet | maintainability, traceability | `changelog/v2.13.0.0.md:216` | Packet log:137 records 2603 tests; changelog:67 still stops at exit 2 | Release notes understate the shipped behavior and the test baseline | Add a later release note/version entry with the current behavior and count | Active | cross-consumer | No later changelog file exists | changelog, package version |
| R4-P2-011 | P2 | Manual scenario 492 still exercises only the pre-remediation relocation surface | maintainability | `manual-testing-playbook/tooling-and-scripts/spec-packet-relocation.md:27` | Scenario prompt:29; expected signals:31; `relocate-real-pipeline.vitest.ts:151` | The manual playbook can report a false PASS on the changed command | Add status-3/late-step/mixed-track coverage or a sibling scenario | Active | instance-only | Scenario 492 is the only relocation scenario | manual playbook |
| R4-P2-012 | P2 | Feature and playbook source inventories still list only `relocate.vitest.ts` | maintainability | `feature-catalog/tooling-and-scripts/spec-packet-relocation.md:91` | `relocate-real-pipeline.vitest.ts:111`; manual anchor:254 | Maintainers can miss the only true-writer suite | Add the true-writer and archive/search suites to both inventories | Active | cross-consumer | `rg` finds no doc mention of the true-writer suite | feature catalog, manual playbook |

## 4. Remediation Workstreams

### P1 workstreams

1. **Relocation exit and resume contract** - Add status 3 and the status-3 rerun behavior to the relocation feature page, root catalog, changelog, and README summaries. This closes R1-P1-001 and R1-P2-003.
2. **Archived-aware numbering guidance** - Replace the live-only next-number command with one that includes `specs/z_archive/`, or remove the command and point to `create.sh`. Update the phase-definition prose. This closes R1-P1-002.
3. **Restore success and mixed-track refusal** - Document status 3 as a successful renumbered restore with a warning, and document the mixed-track refusal with the recovery command. Update the command reference, lifecycle page, changelog, skill README, and help. This closes R2-P1-004, R2-P1-005, and R2-P2-006.
4. **Archive path JSON contract** - Add `archivedPaths` beside `paths` in the feature page, retrieval conventions, search command, search presentation, and READMEs. State that the field is always present for path records and is empty without the flag. This closes R3-P1-007.
5. **Proposal no-map cases and phase-007 rewrites** - Add the non-`NNN-slug` case to the no-map list and describe the bare-name and pre-archive passes in the relocation page. This closes R3-P1-008 and R3-P2-009.

### P2 workstreams

- **Release notes, manual scenario, and test inventory** - Add a later release note with the 2603-test baseline, extend scenario 492 or add a sibling scenario, and list `relocate-real-pipeline.vitest.ts` in both inventories. This closes R4-P2-010, R4-P2-011, and R4-P2-012.
- **README and help consistency** - Update the root/skill README summaries and `archive.sh --help` in the same pass, then link each secondary summary to the authoritative command reference.

## 5. Spec Seed

- A relocation feature page that names all four exit statuses and states that status 3 means the move landed and only the packet's own strict validation failed.
- A next-number guidance surface that counts both live and archived packets and points to `create.sh` as the producer.
- A restore lifecycle page that names both a status-3 success and a mixed-track refusal, with the recovery command.
- An archive-search page that documents `archivedPaths` in the path JSON record, including the empty-array shape without the flag.
- A sub-track page that lists four no-map cases and names the non-`NNN-slug` rename requirement.
- A relocation page that names the phase-007 bare-name and pre-archive rewrites, with the covering suites in the test inventory.
- A release note or version entry that carries the phase 006-010 behavior and the current test count.

## 6. Plan Seed

1. Choose one authoritative command reference per behavior. Use `runtime/cli/spec/README.md` for the current relocation and archive entries, and copy its exact status/restore language into the feature catalog, changelog, and README summaries.
2. Edit R1-P1-001, R1-P1-002, R2-P1-004, R2-P1-005, R3-P1-007, and R3-P1-008 first. Re-run the sk-doc validators for the feature catalog, manual playbook, command docs, and READMEs.
3. Add `archivedPaths` to the path JSON contract in `feature-catalog/retrieval/rg-archive-search.md`, `references/retrieval/retrieval-conventions.md`, `.skilled/commands/speckit/search.md`, `.skilled/commands/speckit/README.txt`, `.skilled/commands/speckit/assets/search-presentation.txt`, `README.md`, and `.skilled/skills/system-spec-kit/README.md`.
4. Add the misnamed-packet case to `folder-structure.md:141` and `sub-track-proposal.md:30`; add the bare-name/pre-archive passes to `spec-packet-relocation.md:44`.
5. Add a later changelog entry or version bump with the 2603-test count, then update scenario 492 and both test inventories.
6. Re-run the affected acceptance checks and a follow-up review; close the P1s only when the doc surfaces are updated.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence | Drift |
|---|---|---|---|
| `spec_code` | partial | Phase 006-010 goals match the producers; six doc surfaces do not | The implementation is correct; the docs are stale |
| `checklist_evidence` | partial | Packet log says phases 006-010 are Done and 2603 tests passed | Changelog says 2567; manual scenario covers the pre-008 path |

### Overlay Protocols

| Protocol | Status | Evidence | Drift |
|---|---|---|---|
| `skill_agent` | partial | `SKILL.md:295` live-only next-number; skill README:639 summary omits status 3 | Two skill surfaces remain at the pre-008 state |
| `agent_cross_runtime` | notApplicable | No agent file in the manifest | None |
| `feature_catalog_code` | fail | Relocation, lifecycle, archive-search, and sub-track pages omit or misstate the phase 006-010 behavior | Four feature pages need edits |
| `playbook_capability` | fail | Scenario 492 and its test anchors stop at the pre-008 path | The manual playbook cannot detect the new regressions |

### AC_COVERAGE

`exempt`. The review target is a phase parent; no `acceptance-criteria.md` closure gate applies at the parent level, and the child-level evidence is the packet log and the phase-specific tests.

## 8. Deferred Items

- The held-out `--renumber` resume path remains out of scope per the packet log and phase 006. The changelog's old statement about it was not raised as a new finding.
- Reviewer B findings 1-5, including the older "new or existing sub-track" wording in the deep command presentation assets, are handed to the 008 command-surfacing session by decision Q013. They are recorded in the final cross-check, not raised as phase 006-010 findings.
- No P0 exists, so no release-blocking security workstream is open. The six P1s are documentation/contract debt and require a remediation plan before a PASS.

## 9. Dimension Expansion Map

- Four dimensions covered: correctness (iteration 1), security (iteration 2), traceability (iteration 3), maintainability (iteration 4).
- Final cross-check: iteration 5.
- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Saturated directions: none. The review did not re-enter a swept direction; every pass covered a new behavior cluster.
- Remaining frontier: none for the declared manifest; the active findings are remediation items, not unread surfaces.

## 10. Search Ledger

No explicit review-depth v2 search ledger was recorded for this lineage; the iterations used direct reads, exact `rg` searches, and producer/consumer traces. The reducer's search-debt state is empty. The candidate coverage is the manifest plus the phase 006-010 goals, and the ledger below records the main searches that produced the findings.

| Search | Method | Result | Evidence |
|---|---|---|---|
| `archivedPaths` across changed docs | exact search | 0 doc hits; 2 code/test hits | `rg-wrapper.mjs:261`, `:382`; `rg-include-archive.vitest.ts:138` |
| status-3 wording across changed docs | exact search | current only in command README and phase goal | `runtime/cli/spec/README.md:120`; phase 008 goal:44 |
| mixed-track restore wording | exact search | only relocation-preflight and tests | `archive.sh:363`; `archive-track.vitest.ts:645` |
| non-NNN proposal branch | direct read plus test search | branch at `suggest-subtracks.mjs:293`; test at `:207` | `folder-structure.md:141` still says three cases |
| bare-name/pre-archive rewrite | direct read plus test search | code at `relocate.mjs:680`, `:1029`; tests at `relocate.vitest.ts:328`, `archive-track.vitest.ts:176` | feature page:44 omits both |
| changelog test count | exact search | changelog 2567 vs packet log 2603 | `changelog/v2.13.0.0.md:216`; `goal.md:137` |

## 11. Audit Appendix

### Convergence summary

- Iterations: 5.
- New-finding ratios: 1.0, 0.5, 0.333, 0.083, 0.0.
- The fifth pass produced no new finding and confirmed all six P1s at their exact file:line.
- The effective stop reason is `maxIterationsReached`, not `converged`; the packet's max iteration ceiling is 5. The active P1s keep the verdict CONDITIONAL.

### Coverage summary

- All four configured dimensions are covered.
- All six live P1s have exact file:line evidence and typed claim-adjudication packets in their iteration narratives.
- The implementation evidence for each finding is the producer or a test; no P1 relies on inference alone.
- The command README relocation entry at line 120 is current. The remaining stale surfaces are listed in the remediation workstreams.

### Ruled-out claims

- Status-3 handling is not a code defect: `relocate.mjs:1661` and phase 008 D1 agree.
- Archived numbering is not missing from `create.sh`: `create.sh:1644` counts the archive.
- The mixed-track restore guard is not missing: `archive.sh:394` and `archive-track.vitest.ts:645` prove it.
- `archivedPaths` is not missing: `rg-wrapper.mjs:382` and `rg-include-archive.vitest.ts:138` prove it.
- The non-NNN proposal guard is not missing: `suggest-subtracks.mjs:293` and its test prove it.
- The phase-007 bare-name and pre-archive passes are not missing: `relocate.mjs:680`, `:1029` and the two suites prove them.

### Sources reviewed

- 74-path manifest, packet `goal.md` and phase 006-010 goals, `spec.md` status/log, and `decision-record.md` decisions Q010-Q014.
- Relocation, archive, create, suggest-subtracks, rg-wrapper, track-roots, repair-derived, validation, and search code and tests.
- Relocation/archive-search/sub-track/lifecycle feature pages, feature-catalog root, changelog, manual playbook scenarios 492/493/494/495/237, retrieval conventions, folder-structure, phase-definitions, quick-reference, worked-examples, trigger-config, root/skill/command READMEs, search command and presentation, and the create/deep command assets.
- No review target was modified. No build, test, `validate.sh`, or git write command was run.

### No-change surfaces

- `runtime/cli/spec/README.md:120` relocation entry is current for statuses 0/1/2/3 and rerun behavior.
- `runtime/cli/spec/README.md:121` sub-track proposal entry is current for the explained non-answer exit 0.
- `feature-catalog/retrieval/rg-flood-control.md:69` is a pure cross-reference.
- `manual-testing-playbook/tooling-and-scripts/spec-validation-archive-reach.md` is current for archived validation.
- `feature-catalog/tooling-and-scripts/spec-validation-rule-engine.md` is current for the validation flag reach.
- `.env.example` has no new relocation/archive environment variable.
- `AGENTS.md` and `.skilled/commands/doctor/assets/agents-md-manifest.json` carry phase-002 Gate 3 wording, not a phase 006-010 behavior.
- `.skilled/commands/create/assets/create-*-presentation.txt` carry the phase-002 option C sub-track wording; no phase 006-010 behavior is missing there.
- The create/deep presentation assets and compiled contract assets do not describe the relocation, restore, or path-JSON behaviors changed in phases 006-010.
- The runtime code and tests for phases 006-010 match their goals; only documentation and release-note surfaces need changes.
