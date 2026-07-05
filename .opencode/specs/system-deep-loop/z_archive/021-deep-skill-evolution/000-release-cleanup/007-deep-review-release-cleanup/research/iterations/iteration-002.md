# Iter 002 — Feature catalog vs runtime docs drift

## Question

Of the 21 entries in `.opencode/skills/deep-review/feature_catalog/feature_catalog.md` (categories `01--loop-lifecycle` 6, `02--state-management` 5, `03--review-dimensions` 4, `04--severity-system` 5, plus the root index), which describe a behavior that is NOT actually supported in `SKILL.md`, `references/{convergence,loop_protocol,state_format}.md`, or the `assets/` config payloads? Conversely, which runtime behaviors documented in those surfaces have NO feature_catalog entry covering them? Each drift MUST cite both surfaces with `file:line`.

## Evidence (file:line citations required)

### Root catalog structure
The root feature_catalog.md documents 21 features across 4 categories at lines 26-31: <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/feature_catalog/feature_catalog.md" lines="26-31" />

### Loop lifecycle features (6 entries)
- Initialization: <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/feature_catalog/feature_catalog.md" lines="39-51" />
- Iteration dispatch: <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/feature_catalog/feature_catalog.md" lines="55-67" />
- Convergence check: <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/feature_catalog/feature_catalog.md" lines="71-83" />
- Synthesis: <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/feature_catalog/feature_catalog.md" lines="87-99" />
- Memory save: <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/feature_catalog/feature_catalog.md" lines="103-115" />
- Resource map emission: <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/feature_catalog/feature_catalog.md" lines="119-131" />

### State management features (5 entries)
- JSONL state log: <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/feature_catalog/feature_catalog.md" lines="139-151" />
- Strategy tracking: <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/feature_catalog/feature_catalog.md" lines="155-167" />
- Config management: <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/feature_catalog/feature_catalog.md" lines="171-183" />
- Findings registry: <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/feature_catalog/feature_catalog.md" lines="187-199" />
- Dashboard: <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/feature_catalog/feature_catalog.md" lines="203-215" />

### Review dimensions features (4 entries)
- Correctness: <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/feature_catalog/feature_catalog.md" lines="223-235" />
- Security: <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/feature_catalog/feature_catalog.md" lines="239-251" />
- Traceability: <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/feature_catalog/feature_catalog.md" lines="255-267" />
- Maintainability: <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/feature_catalog/feature_catalog.md" lines="271-283" />

### Severity system features (5 entries)
- Severity classification: <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/feature_catalog/feature_catalog.md" lines="291-303" />
- Adversarial self-check: <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/feature_catalog/feature_catalog.md" lines="307-319" />
- Claim adjudication: <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/feature_catalog/feature_catalog.md" lines="323-335" />
- Verdicts: <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/feature_catalog/feature_catalog.md" lines="339-351" />
- Quality gates: <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/feature_catalog/feature_catalog.md" lines="355-367" />

### Runtime docs coverage verification
Grep search for `resource_map_present` across runtime docs shows 15 matches in state_format.md, loop_protocol.md, and SKILL.md, confirming extensive documentation of Resource Map Coverage Gate behavior. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/state_format.md" lines="118" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/loop_protocol.md" lines="129-130" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/SKILL.md" lines="269" />

Grep search for `semanticNovelty` across runtime docs shows 8 matches in convergence.md, confirming semantic convergence signal documentation. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/convergence.md" lines="260-353" />

Grep search for `findingStability` across runtime docs shows 17 matches in state_format.md and convergence.md, confirming finding stability signal documentation. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/convergence.md" lines="282-319" />

Grep search for `executor` across runtime docs shows 4 matches in loop_protocol.md, confirming executor selection contract documentation. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/loop_protocol.md" lines="268-284" />

Grep search for `evidenceDensityGate` and `hotspotSaturationGate` across runtime docs shows 4 matches each in state_format.md, loop_protocol.md, and convergence.md, confirming extended gate documentation. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/state_format.md" lines="328-329" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/convergence.md" lines="113-114" />

Grep search for `graph_convergence` across runtime docs shows 4 matches in state_format.md, confirming graph convergence integration documentation. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/state_format.md" lines="342-369" />

Grep search for `pause` across runtime docs shows 22 matches in state_format.md, loop_protocol.md, and convergence.md, confirming pause sentinel mechanism documentation. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/loop_protocol.md" lines="202-219" />

Grep search for `semanticNovelty`, `findingStability`, `executor`, `Resource Map Coverage`, `hotspotSaturation`, `evidenceDensity` across feature_catalog shows NO dedicated feature entries for these behaviors, confirming feature_catalog gaps.

## Findings (numbered)

### Direction A: Runtime docs describe behaviors with NO feature_catalog entry

1. **P1 - Resource Map Coverage Gate missing from feature_catalog** 
   - (feature_catalog claim: absent - grep for "Resource Map Coverage" in feature_catalog/ returns 0 matches)
   - (runtime doc reality: SKILL.md §3 documents "Resource Map Coverage Gate" with 7 subsections at lines 265-277 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/SKILL.md" lines="265-277" />)
   - (runtime doc reality: loop_protocol.md Step 3b documents "Resource Map Coverage Audit" at lines 315-328 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/loop_protocol.md" lines="315-328" />)
   - (runtime doc reality: state_format.md documents `resource_map_present` config field at line 118 and conditional report section at lines 745-772 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/state_format.md" lines="118" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/state_format.md" lines="745-772" />)

2. **P1 - Semantic convergence signals (semanticNovelty, findingStability) missing from feature_catalog**
   - (feature_catalog claim: absent - grep for "semanticNovelty" and "findingStability" in feature_catalog/ returns 0 matches)
   - (runtime doc reality: convergence.md documents `semanticNovelty` signal (0.0-1.0) with full semantics at lines 260-280 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/convergence.md" lines="260-280" />)
   - (runtime doc reality: convergence.md documents `findingStability` signal (0.0-1.0) with full semantics at lines 282-307 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/convergence.md" lines="282-307" />)
   - (runtime doc reality: convergence.md documents integration with legal-stop gate bundle at lines 310-319 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/convergence.md" lines="310-319" />)

3. **P1 - Security-Sensitive Fix Overrides missing from feature_catalog**
   - (feature_catalog claim: absent - grep for "Security-Sensitive Fix Overrides" in feature_catalog/ returns 0 matches)
   - (runtime doc reality: convergence.md documents "Security-Sensitive Fix Overrides" section with 3 override settings at lines 66-76 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/convergence.md" lines="66-76" />)
   - (runtime doc reality: convergence.md documents `requiredClosedFindingReplay` flag at line 73 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/convergence.md" lines="73" />)
   - (runtime doc reality: convergence.md documents `requiredFixCompletenessGate` flag at line 74 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/convergence.md" lines="74" />)

4. **P2 - Executor selection contract missing from feature_catalog**
   - (feature_catalog claim: absent - grep for "executor" in feature_catalog/ returns 0 matches)
   - (runtime doc reality: loop_protocol.md documents "Executor Resolution" with parseExecutorConfig and per-kind dispatch branches at lines 268-284 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/loop_protocol.md" lines="268-284" />)
   - (runtime doc reality: loop_protocol.md documents cli-codex dispatch branch at line 271 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/loop_protocol.md" lines="271" />)
   - (runtime doc reality: loop_protocol.md documents flag compatibility enforcement at line 280 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/loop_protocol.md" lines="280" />)

5. **P1 - Extended quality gates (evidenceDensityGate, hotspotSaturationGate, graphBlockerDetail) incompletely documented in feature_catalog**
   - (feature_catalog claim: feature_catalog/04--severity-system/05-quality-gates.md line 16 mentions "evidence density, hotspot saturation" but does not document the specific gate names or their contracts <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/feature_catalog/04--severity-system/05-quality-gates.md" lines="16" />)
   - (runtime doc reality: state_format.md documents `evidenceDensityGate` in blocked-stop event at line 328 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/state_format.md" lines="328" />)
   - (runtime doc reality: state_format.md documents `hotspotSaturationGate` in blocked-stop event at line 329 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/state_format.md" lines="329" />)
   - (runtime doc reality: convergence.md documents both gates in blocked-stop event at lines 113-114 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/convergence.md" lines="113-114" />)
   - (runtime doc reality: convergence.md documents `graphBlockerDetail` array and graph blocker integration at lines 118, 128, 130 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/convergence.md" lines="118" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/convergence.md" lines="128" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/convergence.md" lines="130" />)

6. **P1 - Graph convergence integration missing dedicated feature_catalog entry**
   - (feature_catalog claim: feature_catalog/02--state-management/01-jsonl-state-log.md line 18 mentions `graph_convergence` only in passing as one of several event types <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/feature_catalog/02--state-management/01-jsonl-state-log.md" lines="18" />)
   - (runtime doc reality: state_format.md documents `graph_convergence` event shape and combined-stop rule at lines 342-369 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/state_format.md" lines="342-369" />)
   - (runtime doc reality: state_format.md documents STOP_ALLOWED/STOP_BLOCKED/CONTINUE decision enum at line 367 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/state_format.md" lines="367" />)
   - (runtime doc reality: convergence.md documents graph-assisted convergence and blockers throughout the document)

7. **P2 - Pause sentinel mechanism missing dedicated feature_catalog entry**
   - (feature_catalog claim: feature_catalog/01--loop-lifecycle/03-convergence-check.md line 12 mentions "pause handling" only in passing <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/feature_catalog/01--loop-lifecycle/03-convergence-check.md" lines="12" />)
   - (runtime doc reality: loop_protocol.md documents pause sentinel check with `.deep-review-pause` file at lines 202-219 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/loop_protocol.md" lines="202-219" />)
   - (runtime doc reality: state_format.md documents `.deep-review-pause` sentinel file at lines 23, 34, 90 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/state_format.md" lines="23" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/state_format.md" lines="34" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/state_format.md" lines="90" />)
   - (runtime doc reality: convergence.md documents `userPaused` stop reason at line 88 <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-review/references/convergence.md" lines="88" />)

### Direction B: feature_catalog claims behavior NOT supported in runtime docs

No findings in this direction. All 21 feature_catalog entries have corresponding support in runtime docs (SKILL.md, references/, assets/). The root catalog accurately reflects the documented feature surface, but is missing entries for additional documented behaviors.

## Gaps for next iter

1. **Resource Map Coverage Gate feature entry**: Add a new feature_catalog entry under a new category or as a sub-feature of Initialization/Synthesis to document the Resource Map Coverage Gate behavior (resource_map_present config field, audit pass, conditional report section).

2. **Semantic convergence signals feature entry**: Add a new feature_catalog entry under Convergence Check or as a new "Semantic Convergence" category to document semanticNovelty and findingStability signals and their integration with legal-stop gates.

3. **Security-Sensitive Fix Overrides feature entry**: Add a new feature_catalog entry under Convergence Check or Quality Gates to document security-sensitive fix override behavior (minStabilizationPasses, requiredClosedFindingReplay, requiredFixCompletenessGate).

4. **Executor selection feature entry**: Add a new feature_catalog entry under Iteration Dispatch to document executor selection contract (native, cli-codex, cli-gemini, cli-claude-code branches, flag compatibility).

5. **Extended quality gates documentation**: Update feature_catalog/04--severity-system/05-quality-gates.md to explicitly document evidenceDensityGate, hotspotSaturationGate, graphBlockerDetail, and fixCompletenessReplayGate with their contracts.

6. **Graph convergence feature entry**: Add a dedicated feature_catalog entry (possibly under Convergence Check) to document graph_convergence event, combined-stop rule, and graph-assisted convergence integration.

7. **Pause sentinel feature entry**: Add a dedicated feature_catalog entry (possibly under Loop Lifecycle) to document `.deep-review-pause` sentinel mechanism, userPaused event, and pause/resume flow.

## JSONL delta row

{"iter_id":"002","timestamp_utc":"2026-05-23T17:21:00Z","executor":"cli-devin","model":"swe-1.6","status":"complete","findings_count":7,"gaps_count":7,"primary_evidence_files":[".opencode/skills/deep-review/feature_catalog/feature_catalog.md",".opencode/skills/deep-review/SKILL.md",".opencode/skills/deep-review/references/convergence.md",".opencode/skills/deep-review/references/loop_protocol.md",".opencode/skills/deep-review/references/state_format.md"]}
