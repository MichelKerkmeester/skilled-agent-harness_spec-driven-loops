# Iteration 5 - Final cross-check: live P1s and no-change surfaces

## Dispatcher

- Mode: review
- Dimension: final cross-check (correctness, security, traceability, maintainability already covered)
- Review target: `specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach`
- Artifact directory: `specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/review/lineages/dsh-1`
- Operator focus: manifest-scoped documentation alignment; this pass rechecks every live P1 against current file content and records which docs need no change.
- Budget profile: adjudicate (8-10 tool calls). No nested dispatch was performed.

## Files Reviewed

- `deep-review-findings-registry.json`
- All six live P1 primary surfaces and their code evidence
- `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md`
- `.skilled/skills/system-spec-kit/feature-catalog/retrieval/rg-flood-control.md`
- `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-validation-archive-reach.md`
- `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-validation-rule-engine.md`
- `.skilled/commands/create/assets/*-presentation.txt`
- `.skilled/commands/deep/assets/*presentation.txt`
- `.skilled/commands/speckit/README.txt`
- `references/workflows/quick-reference.md`, `worked-examples.md`, `references/memory/trigger-config.md`
- `.env.example`, `AGENTS.md`, `.skilled/commands/doctor/assets/agents-md-manifest.json`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None. The six active P1 findings and six active P2 findings from iterations 1 to 4 remain live; no new gap was found in this pass.

## Traceability Checks

### Core Protocols

- `spec_code`: partial. Re-read the six primary evidence pairs; each still shows a document contract that differs from the implemented phase 006-010 behavior. The implementation itself matches the phase goals.
- `checklist_evidence`: partial. The packet log and spec status are current, but the changelog, feature catalog, and manual playbook still describe an earlier release state.
- `skill_agent`: partial. `SKILL.md:295` still lists a live-only next-number command; the create presentation assets already carry the phase-002 option C wording.
- `agent_cross_runtime`: notApplicable; no agent file is in the manifest.
- `feature_catalog_code`: fail. The relocation, lifecycle, archive-search, and sub-track pages still carry the gaps recorded in iterations 1 to 4.
- `playbook_capability`: fail. Scenario 492 and its test anchors still omit the phase 006-010 paths.

### Live P1 recheck

1. `R1-P1-001`: `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-packet-relocation.md:66` still says status 2 covers a failed close; `relocate.mjs:1661` still sets status 3. Live.
2. `R1-P1-002`: `.skilled/skills/system-spec-kit/SKILL.md:295` still computes live numbers only; `create.sh:1644` still counts `z_archive`. Live.
3. `R2-P1-004`: `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-lifecycle-automation.md:45` still says a failed relocation restore exits 1; `archive.sh:437` still exits 0 on status 3. Live.
4. `R2-P1-005`: `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md:114` still describes restore without the mixed-track refusal; `archive.sh:394` still refuses it. Live.
5. `R3-P1-007`: `.skilled/skills/system-spec-kit/feature-catalog/retrieval/rg-archive-search.md:28` still omits `archivedPaths`; `rg-wrapper.mjs:382` still adds it. Live.
6. `R3-P1-008`: `.skilled/skills/system-spec-kit/references/structure/folder-structure.md:141` still says three no-map cases; `suggest-subtracks.mjs:293` still adds the misnamed branch. Live.

## Integration Evidence

- `runtime/cli/spec/README.md:120` is the current relocation command reference and needs no change; `archive.sh` at line 114 of the same file still needs the mixed-track/status-3 update.
- `feature-catalog/retrieval/rg-flood-control.md:69` only links to the archive-search page; it needs no change of its own.
- `manual-testing-playbook/tooling-and-scripts/spec-validation-archive-reach.md` and `feature-catalog/tooling-and-scripts/spec-validation-rule-engine.md` describe `validate.sh --recursive --include-archive` and need no change for phases 006-010.
- `.env.example` has no new relocation or archive environment variable; no change.
- `AGENTS.md` and `.skilled/commands/doctor/assets/agents-md-manifest.json` carry the Gate 3 option C wording from phase 002, not a phase 006-010 behavior; no change in this packet.
- The create command presentation assets at `.skilled/commands/create/assets/create-*-presentation.txt` all carry the same option C sub-track wording; no phase 006-010 behavior is missing there.
- The deep command presentation assets and compiled contracts still use the older "new or existing sub-track" phrasing. That is reviewer B's hub-vocabulary area, handed to the 008 command-surfacing session by decision Q013, and is outside this packet's planned scope; it is recorded here rather than raised as a new finding.
- `.skilled/commands/speckit/README.txt:105` and `search-presentation.txt:120` are already affected surfaces of `R3-P1-007`; the fix belongs there, not in a new finding.
- No source file was modified. No build, test, `validate.sh`, or git write command was run.

## Edge Cases

- This pass did not claim a clean review. Active P1 findings remain, so the verdict is CONDITIONAL even though no new finding was raised.
- The manifest contains 74 files; this review read the behavior-bearing code, the command/reference/catalog/playbook/README surfaces, and the tests tied to phases 006-010. Presentation assets with only Gate 3 option C wording were checked for affected terms and need no phase 006-010 change.
- A held-out `--renumber` resume remains out of scope per the packet log; the changelog's old statement about it was not raised as a new finding.

## Confirmed-Clean Surfaces

- `runtime/cli/spec/README.md:120` relocation entry is current for exit statuses 0/1/2/3 and rerun behavior.
- `runtime/cli/spec/README.md:121` sub-track proposal entry is current for the explained non-answer exit 0.
- `feature-catalog/retrieval/rg-flood-control.md:69` is a pure cross-reference and needs no change.
- `manual-testing-playbook/tooling-and-scripts/spec-validation-archive-reach.md` is current for archived validation.
- `feature-catalog/tooling-and-scripts/spec-validation-rule-engine.md` is current for the validation flag reach.
- `.env.example`, `AGENTS.md`, and `agents-md-manifest.json` are unaffected by the relocation/archive behavior.
- The create command presentation assets already carry the phase-002 option C wording.
- The runtime code for `relocate.mjs`, `archive.sh`, `create.sh`, `suggest-subtracks.mjs`, and `rg-wrapper.mjs` matches the phase 006-010 goals; the remaining defects are documentation and release-note surfaces.

## Ruled Out

- A new code defect in the six live P1 areas: ruled out by direct reread of each producer and its test.
- A missing `archivedPaths` implementation: ruled out by `rg-wrapper.mjs:382`.
- A missing mixed-track restore guard: ruled out by `archive.sh:394` and `archive-track.vitest.ts:645`.
- A missing non-NNN proposal branch: ruled out by `suggest-subtracks.mjs:293`.
- A new finding in the Gate 3 option C presentation wording: ruled out as reviewer B's handed-off hub-vocabulary area (Q013), not this packet's phase 006-010 scope.

## Next Focus

- Dimension: synthesis
- Focus area: compile the review report from the active registry, keep the six P1 and six P2 findings, record the max-iteration stop reason, and state the no-change surfaces.
- Reason: the review reached its fifth and final scheduled iteration; the remaining work is synthesis and provenance, not another discovery pass.
- Required evidence: registry, all five iteration narratives, current command README, and the terminal closeout event.

## Assessment

Dimensions addressed: correctness, security, traceability, maintainability (final cross-check)

Review verdict: CONDITIONAL
