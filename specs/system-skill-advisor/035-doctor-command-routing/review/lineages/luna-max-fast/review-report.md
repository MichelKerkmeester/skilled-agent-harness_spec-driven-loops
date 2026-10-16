# Deep Review Report — Doctor Command Routing v4.0.0.12

## 1. Executive Summary

- **Overall verdict: CONDITIONAL.** There are no active P0 or P1 findings and seven active P2 findings. Severity-only routing would be PASS with advisories, but one search-debt obligation remains blocked; the synthesis search-ledger rule retains CONDITIONAL until that probe is covered or ruled out.
- **hasAdvisories:** false under the contract's PASS-only definition. Seven active P2 suggestions remain listed below.
- **Stop reason:** maxIterationsReached after five iterations. Convergence score 0.8571 is telemetry; the configured stop policy did not allow early synthesis.
- **Review scope:** shipped advisor routing, doctor setup command and mirrors, skill documentation, cross-repository command references, and the three v4.0.0.12 changelogs. Packet specification files were not review targets under the lead steer.
- **Finding counts:** P0 0, P1 0, P2 7 active; one earlier P2 finding was resolved after source rechecking changed its evidence basis.

## 2. Planning Trigger

`/speckit:plan` is required by the synthesis routing because the final result is CONDITIONAL. The remaining review debt is a blocked runtime probe, alongside the seven P2 remediation items. The Planning Packet records the active findings and follow-up work.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {"id":"P2-001","severity":"P2","title":"Quoted doctor-command text bypasses skill-first ordering","dimension":"correctness","file":".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:679"},
    {"id":"P2-002","severity":"P2","title":"Generic check wording advertises setup on unrelated no-match prompts","dimension":"correctness","file":".skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:51"},
    {"id":"P2-003","severity":"P2","title":"Doctor phrase reach can report stale scorer behavior as current","dimension":"correctness","file":".skilled/commands/doctor/scripts/doctor-phrase-reach.cjs:264"},
    {"id":"P2-004","severity":"P2","title":"Doctor-routing scenarios omit their required feature-catalog backlink","dimension":"maintainability","file":".skilled/skills/system-skill-advisor/manual-testing-playbook/doctor-commands/doctor-routing-setup-onboarding.md:94"},
    {"id":"P2-006","severity":"P2","title":"The feature catalog lists an OpenCode hook capability without a feature page","dimension":"traceability","file":".skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md:126"},
    {"id":"P2-007","severity":"P2","title":"Root README understates the command catalog by two entries","dimension":"traceability","file":"README.md:1074"},
    {"id":"P2-008","severity":"P2","title":"DOC-391's write-free claim misses a socket-directory creation","dimension":"correctness","file":".skilled/skills/system-skill-advisor/manual-testing-playbook/doctor-commands/doctor-setup-run.md:16"}
  ],
  "remediationWorkstreams": [
    {"name":"Advisor routing and probe accuracy","findingIds":["P2-001","P2-002","P2-003"]},
    {"name":"Catalog and scenario traceability","findingIds":["P2-004","P2-006","P2-007"]},
    {"name":"Setup side-effect claim","findingIds":["P2-008"]}
  ],
  "specSeed": [
    "Clarify the distinction between a directly typed doctor command and quoted command text.",
    "Constrain setup hints to setup or tooling-health context and make the phrase-reach probe reject stale builds.",
    "Add the missing catalog leaf and scenario backlinks, reconcile the README command totals, and describe the temporary socket-directory write."
  ],
  "planSeed": [
    "Add quoted-command and unrelated-check cases, then verify doctor bridge ordering and hint behavior.",
    "Add a source/build freshness check to the doctor phrase-reach probe.",
    "Repair the feature-catalog and scenario links and update all affected command counts.",
    "Update DOC-391 and public read-only claims, and add an assertion for socket-directory state."
  ],
  "findingClasses": [
    "routing-disambiguation",
    "fallback-intent-qualification",
    "stale-build-probe",
    "documentation-traceability",
    "catalog-leaf-coverage",
    "command-catalog-count-drift",
    "side-effect-accuracy"
  ],
  "affectedSurfacesSeed": [
    "advisor rankings and fallback hints across Claude, Pi, and OpenCode",
    "doctor phrase-reach validation",
    "advisor feature catalog and DOC-385 through DOC-391",
    "root README and command index",
    "/doctor:setup temporary socket-directory behavior"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

### P2-001 — Quoted doctor-command text bypasses skill-first ordering

- **Location and dimension:** .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:679; correctness.
- **Evidence and impact:** A raw `/doctor:` substring bypasses the skill-first reorder. A prompt that quotes `/doctor:setup` can therefore leave a matching skill below the doctor bridge.
- **Recommendation:** Recognize direct slash-command invocation separately from quoted references.
- **Disposition:** Active. **Class:** routing-disambiguation. **Scope proof:** The scorer and release compatibility claim are in the lead-steered scope. **Affected surfaces:** advisor ranking and doctor-routing release notes.

### P2-002 — Generic check wording advertises setup on unrelated no-match prompts

- **Location and dimension:** .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:51; correctness.
- **Evidence and impact:** The setup predicate accepts standalone “check” inflections and the no-match renderer then adds `/doctor:setup`. A no-match prompt such as “Check what time the tide turns” receives a tooling setup hint.
- **Recommendation:** Require setup, environment, installation, or tooling-health context along with a generic check verb.
- **Disposition:** Active. **Class:** fallback-intent-qualification. **Scope proof:** The predicate and fallback renderer are in the advisor-code scope. **Affected surfaces:** Claude, Pi, and OpenCode fallbacks.

### P2-003 — Doctor phrase reach can report stale scorer behavior as current

- **Location and dimension:** .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs:264; correctness.
- **Evidence and impact:** The probe verifies that the built scorer exists but does not compare it with current source. A stale, present scorer can still report a phrase as reachable after source behavior changes.
- **Recommendation:** Check source/build freshness or report the result as indeterminate when the artifact is stale.
- **Disposition:** Active. **Class:** stale-build-probe. **Scope proof:** The script is an in-scope doctor command target. **Affected surfaces:** advisor router reach and generated runtime.

### P2-004 — Doctor-routing scenarios omit their required feature-catalog backlink

- **Location and dimension:** .skilled/skills/system-skill-advisor/manual-testing-playbook/doctor-commands/doctor-routing-setup-onboarding.md:94; maintainability.
- **Evidence and impact:** DOC-385 through DOC-391 link to the playbook and implementation sources but not to the existing doctor-routing feature page. A reader opening a scenario cannot follow it directly to the behavior contract and test anchors.
- **Recommendation:** Link every scenario to feature-catalog/scorer-fusion/doctor-command-routing.md.
- **Disposition:** Active. **Class:** documentation-traceability. **Scope proof:** The authoring contract requires the backlink and the feature page exists. **Affected surfaces:** DOC-385 through DOC-391 and the feature catalog.

### P2-006 — The feature catalog lists an OpenCode hook capability without a feature page

- **Location and dimension:** .skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md:126; traceability.
- **Evidence and impact:** The catalog lists native OpenCode SessionStart/UserPromptSubmit hooks with prompt-wrapper fallback but says there is no feature page. Readers have no per-feature implementation or validation anchors.
- **Recommendation:** Add the feature page or merge/remove the row if it is not a distinct capability.
- **Disposition:** Active. **Class:** catalog-leaf-coverage. **Scope proof:** The catalog contract requires a leaf for each root entry. **Affected surfaces:** feature inventory and OpenCode hook documentation.

### P2-007 — Root README understates the command catalog by two entries

- **Location and dimension:** README.md:1074; traceability.
- **Evidence and impact:** The README says 37 commands; the canonical checker and command index report 39. The same total is repeated at README.md:80.
- **Recommendation:** Update both totals and the group breakdown, or define and explain the two excluded entries.
- **Disposition:** Active. **Class:** command-catalog-count-drift. **Scope proof:** The checker reports 39 canonical commands and 39/39 indexed. **Affected surfaces:** root README and command index.

### P2-008 — DOC-391's write-free claim misses a socket-directory creation

- **Location and dimension:** .skilled/skills/system-skill-advisor/manual-testing-playbook/doctor-commands/doctor-setup-run.md:16; correctness.
- **Evidence and impact:** DOC-391 invokes the advisor CLI shim at line 56. The shim calls `ensureSocketDir()` at startup, which uses `mkdirSync` to create `/tmp/system-skill-advisor` when absent. The scenario's repository status comparison does not observe this write. The `--warm-only` path does not cold-start the daemon or write its lease database.
- **Recommendation:** Document and assert the temporary directory effect, or make socket-directory creation conditional on a mode that can start or attach to the daemon.
- **Disposition:** Active. **Class:** side-effect-accuracy. **Scope proof:** The in-scope doctor setup leg calls the shim and the source performs the directory creation at module startup. **Affected surfaces:** `/doctor:setup`, DOC-391, and repeated read-only release claims.

### Resolved correction — P2-005

P2-005's cold-start lease-write case was disproved in iteration 5. With `--warm-only`, an unavailable daemon returns a retryable error before the spawn path; it does not start the daemon. The finding is resolved. P2-008 records the narrower, independently verified `/tmp` directory creation.

## 4. Remediation Workstreams

1. **Advisor routing and probe accuracy — P2-001, P2-002, P2-003.** Separate quoted command mentions from direct invocation, qualify the setup hint, and prevent stale built artifacts from producing a current reach result.
2. **Catalog and scenario traceability — P2-004, P2-006, P2-007.** Add the scenario backlinks and OpenCode feature leaf, then reconcile the README command count and group arithmetic.
3. **Setup side-effect claim — P2-008.** Align DOC-391 and the public read-only claims with socket-directory creation, and verify that path in the scenario.

## 5. Spec Seed

- Define direct doctor command invocation separately from quoted command references.
- Specify the context required before emitting a generic setup hint.
- Require doctor phrase reach to reject stale build artifacts.
- Keep feature catalog leaves and playbook scenario backlinks aligned with their authoring contracts.
- Define `/doctor:setup` filesystem effects, including temporary socket-directory setup.
- Reconcile the root README's command count with the canonical 39-command index.

## 6. Plan Seed

1. Add routing cases for quoted slash-command text and unrelated generic “check” prompts.
2. Add a source/build freshness guard to doctor phrase reach.
3. Add the missing OpenCode feature page and link DOC-385 through DOC-391 to the matching catalog entry.
4. Update README command totals and group counts against the canonical checker.
5. Revise the setup read-only wording and assert the default socket directory before and after the advisor leg.
6. Run the permitted code and document gates for the follow-up change, including a runtime probe in a workspace whose temporary paths are within its authorized write boundary.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence and unresolved drift |
|---|---|---|
| spec_code | Partial | The lead steer bound this review to shipped release artifacts and excluded packet spec docs; the review did not claim requirement-by-requirement packet parity. |
| checklist_evidence | Exempt | The Level 2 packet has no checklist.md. AC_COVERAGE is exempt under the synthesis rule, despite the packet having acceptance-criteria.md. |

### Overlay Protocols

| Protocol | Status | Evidence and unresolved drift |
|---|---|---|
| skill_agent | Partial | Advisor README, SKILL, and hook documentation were cross-checked; the recorded review did not emit a formal protocol result. |
| agent_cross_runtime | Pass | The runtime mirror check passed for 185 mirrors across eight runtime trees; requested doctor setup mirrors were present. |
| feature_catalog_code | Partial | Catalog anchors were checked; P2-006 records the OpenCode hook row without its required feature leaf. |
| playbook_capability | Partial | DOC-385 through DOC-391 cover setup and routing, while P2-004 and P2-008 record backlink and side-effect accuracy gaps. |

**AC_COVERAGE:** exempt because checklist.md is absent. **Resource Map Coverage Gate:** skipped because resource-map emission was disabled for this lineage.

## 8. Deferred Items

- The doctor phrase-reach runtime probe remains blocked: its current implementation writes a temporary database under the system temporary directory, outside this lineage's authorized write surface. This is the single remaining search-debt obligation.
- No test runner, build, or runtime probe was run in this lineage. Document validators and static source inspection provide the recorded evidence.
- Security did not receive a dedicated iteration under the lead steer; no security finding was recorded, and the reducer leaves security coverage incomplete.
- Canonical continuity files in the spec packet were not updated because the write authority is restricted to this lineage.

## Dimension Expansion Map

- Completed, failed, and audited pivots: 0.
- Saturated directions: none recorded.
- Council artifact references: none.
- Selected review directions: advisor behavior; command and runtime mirrors; skill documentation and catalogs; cross-repository inventories; release changelogs and final recheck.
- Remaining frontier: none recorded. Security remains outside completed dimension coverage.

## 9. Search Ledger

- **Coverage:** 12 bug classes covered, 10 ruled out, 0 deferred, and 1 blocked; graph coverage used graphless fallback. The final iteration covered release claim accuracy, setup write claim accuracy, route compatibility, warm-only daemon behavior, and changelog format.
- **Covered classes:** built runtime freshness; catalog entry leaf coverage; changelog claim accuracy; command catalog count alignment; command intent qualification; cross-runtime consistency; fallback context qualification; prior route compatibility claim; scenario feature crosslink; scenario side-effect accuracy; setup mutation claim accuracy; setup write claim accuracy.
- **Ruled-out classes:** changelog format contract; cross-repository reference integrity; document format contract; doctor command list alignment; generated bridge parity; lease stress coverage; route manifest parity; runtime mirror parity; UNKNOWN; warm-only daemon start.
- **Blocked search debt:** iteration 2, doctor_probe_execution. Running doctor-phrase-reach.cjs would write its temporary database outside the lineage. The static stale-artifact finding remains P2-003; runtime output was not confirmed.
- **Iteration 5 ledger:** SL-018 links the unrelated setup hint claim to P2-002; SL-019 links the socket-directory write claim to P2-008; SL-020 links the compatibility claim to P2-001; SL-021 rules out a warm-only cold start; SL-022 rules out changelog format violations.
- **Clean search proof:** route manifest and read-only declarations passed route validation; runtime mirrors passed their sync check; single-file document validation found no structural failures in the reviewed docs; command inventories include `/doctor:setup`; the system-spec-kit playbook reference exists; all three changelogs passed validation and HVR had no hard blockers.

## 10. Audit Appendix

### Convergence and Coverage

- Five iterations recorded; convergence score 0.8571 was telemetry under max-iterations stop policy.
- Stop reason: `maxIterationsReached`.
- Dimension coverage: correctness, traceability, and maintainability covered; security not marked complete.
- Active registry: P0 0, P1 0, P2 7; resolved: 1.

### Cross-Reference Appendix — Core Protocols

The review scope intentionally followed the lead steer's shipped-work boundary. Code and public references were inspected against those artifacts, but packet requirement mapping was not performed. Checklist evidence is exempt because checklist.md is absent.

### Cross-Reference Appendix — Overlay Protocols

Runtime mirrors, feature-catalog structure, and playbook references were checked. Remaining catalog and scenario gaps are P2-004, P2-006, and P2-008; command count drift is P2-007.

### Sources Reviewed

- Lead steer: specs/system-skill-advisor/035-doctor-command-routing/review/lineages/luna-max-fast/steer.md.
- Iteration records and deltas: iterations/iteration-001.md through iterations/iteration-005.md and deltas/iter-001.jsonl through deltas/iter-005.jsonl.
- Three v4.0.0.12 changelogs and the changelog authoring contract.
- Advisor fusion, hook, renderer, CLI shim and warm-only call path.
- Doctor setup workflow, runtime mirrors, DOC-385 through DOC-391, advisor feature catalog, README, and command index.
- Reducer-owned findings registry, dashboard, and search ledger.

### Iteration 5 Synthesis Reconciliation

The closeout helper emitted synthesis_incomplete because it compared 26 finding-detail appearances across the five cumulative iteration records with eight deduplicated registry entries. Its own missingStructuredFindingCount is 0, and a direct set comparison confirms all eight unique IDs in iteration details appear in the registry, including the resolved P2-005 and active P2-008. The warning therefore reflects duplicate appearances being counted as distinct findings, not a missing registry entry. The synthesis_complete event records the reconciled result; synthesis_incomplete is retained as audit evidence.

The stored final verdict lines for iterations 1 through 4 are CONDITIONAL even though their iteration records show zero P0 and zero P1 findings. This differs from the iteration contract, which maps P2-only iterations to PASS. Those iteration files are write-once; iteration 5 uses PASS, while synthesis remains CONDITIONAL because of the blocked search-debt obligation.
