# Deep-Alignment Iteration 001

## Dispatcher
- Prompt pack: `alignment/prompts/iteration-1.md`.
- Canonical agent definition: `.opencode/agents/deep-alignment.md` (loaded and verified read-only).
- Route proof: `mode=alignment`, `target_agent=deep-alignment`, `agent_definition_loaded=true`, `resolved_route=Resolved route: mode=alignment target_agent=deep-alignment`.
- Lifecycle: `new`, session `2026-07-14T16:29:14.3NZ`, generation `1`, lineage `new`.
- Budget profile: `scan`.

## Lane
- Lane ID: `sk-doc::docs::.opencode/commands/create/*.md, .opencode/commands/design/*.md, .opencode/commands/doctor/*.md, .opencode/commands/memory/*.md, .opencode/commands/speckit/*.md, .opencode/commands/prompt-improve.md, .opencode/commands/goal_opencode.md`
- Authority: `sk-doc`
- Artifact class: `docs`
- Scope: `.opencode/commands/create/*.md`, `.opencode/commands/design/*.md`, `.opencode/commands/doctor/*.md`, `.opencode/commands/memory/*.md`, `.opencode/commands/speckit/*.md`, `.opencode/commands/prompt-improve.md`, `.opencode/commands/goal_opencode.md`.
- Standard source: `.opencode/skills/sk-doc/shared/references/core_standards.md`, `.opencode/skills/sk-doc/shared/assets/template_rules.json`, and the live validators wrapped by `sk-doc.cjs`.

## Artifacts Checked
1. `.opencode/commands/create/agent.md`
2. `.opencode/commands/create/benchmark.md`
3. `.opencode/commands/create/changelog.md`
4. `.opencode/commands/create/command.md`
5. `.opencode/commands/create/feature-catalog.md`

The exact slice came from `partition-corpus.cjs`; it reported `remainingAfterThisSlice: 23`.

## Findings - New

### P0 Findings
None.

### P1 Findings

1. **Missing recommended router section: `router_contract`** -- `.opencode/commands/create/agent.md:7-49` -- The live sk-doc validator reports the canonical router section as missing.
   - Finding class: `template-conformance` (`missing_recommended_router_section`, deterministic).
   - Scope proof: The artifact is in the dispatched `sk-doc` / `docs` command lane.
   - Affected surface hints: `command router`, `router_contract`, `incremental migration guidance`.
   - Claim: `.opencode/commands/create/agent.md` lacks `router_contract`.
   - Reprobe evidence: `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py ... --type command --json` returned `valid: true` with `missing_recommended_router_section` for `router_contract`; the warning is emitted by `validate_document.py:497-507` from `template_rules.json:116-119`. `matchesLiveReality: true`.

2. **Missing recommended router section: `mode_routing`** -- `.opencode/commands/create/agent.md:7-49` -- The live sk-doc validator reports the canonical router section as missing.
   - Finding class: `template-conformance` (`missing_recommended_router_section`, deterministic).
   - Scope proof: The artifact is in the dispatched `sk-doc` / `docs` command lane.
   - Affected surface hints: `command router`, `mode_routing`, `execution-mode selection`.
   - Claim: `.opencode/commands/create/agent.md` lacks `mode_routing`.
   - Reprobe evidence: The same direct live-validator run returned the `mode_routing` warning; emission is verified at `validate_document.py:497-507` and the canonical list at `template_rules.json:119`. `matchesLiveReality: true`.

3. **Missing recommended router section: `execution_targets`** -- `.opencode/commands/create/agent.md:7-49` -- The live sk-doc validator reports the canonical router section as missing.
   - Finding class: `template-conformance` (`missing_recommended_router_section`, deterministic).
   - Scope proof: The artifact is in the dispatched `sk-doc` / `docs` command lane.
   - Affected surface hints: `command router`, `execution_targets`, `workflow dispatch`.
   - Claim: `.opencode/commands/create/agent.md` lacks `execution_targets`.
   - Reprobe evidence: The same direct live-validator run returned the `execution_targets` warning; emission is verified at `validate_document.py:497-507` and the canonical list at `template_rules.json:119`. `matchesLiveReality: true`.

4. **Missing recommended router section: `workflow_summary`** -- `.opencode/commands/create/agent.md:7-49` -- The live sk-doc validator reports the canonical router section as missing.
   - Finding class: `template-conformance` (`missing_recommended_router_section`, deterministic).
   - Scope proof: The artifact is in the dispatched `sk-doc` / `docs` command lane.
   - Affected surface hints: `command router`, `workflow_summary`, `workflow handoff`.
   - Claim: `.opencode/commands/create/agent.md` lacks `workflow_summary`.
   - Reprobe evidence: The same direct live-validator run returned the `workflow_summary` warning; emission is verified at `validate_document.py:497-507` and the canonical list at `template_rules.json:119`. `matchesLiveReality: true`.

5. **Missing recommended router section: `router_contract`** -- `.opencode/commands/create/benchmark.md:7-50` -- The live sk-doc validator reports the canonical router section as missing.
   - Finding class: `template-conformance` (`missing_recommended_router_section`, deterministic).
   - Scope proof: The artifact is in the dispatched `sk-doc` / `docs` command lane.
   - Affected surface hints: `command router`, `router_contract`, `incremental migration guidance`.
   - Claim: `.opencode/commands/create/benchmark.md` lacks `router_contract`.
   - Reprobe evidence: Direct live validation returned `valid: true` plus the `router_contract` warning; emission is verified at `validate_document.py:497-507` and `template_rules.json:119`. `matchesLiveReality: true`.

6. **Missing recommended router section: `mode_routing`** -- `.opencode/commands/create/benchmark.md:7-50` -- The live sk-doc validator reports the canonical router section as missing.
   - Finding class: `template-conformance` (`missing_recommended_router_section`, deterministic).
   - Scope proof: The artifact is in the dispatched `sk-doc` / `docs` command lane.
   - Affected surface hints: `command router`, `mode_routing`, `execution-mode selection`.
   - Claim: `.opencode/commands/create/benchmark.md` lacks `mode_routing`.
   - Reprobe evidence: Direct live validation returned the `mode_routing` warning; emission is verified at `validate_document.py:497-507` and `template_rules.json:119`. `matchesLiveReality: true`.

7. **Missing recommended router section: `execution_targets`** -- `.opencode/commands/create/benchmark.md:7-50` -- The live sk-doc validator reports the canonical router section as missing.
   - Finding class: `template-conformance` (`missing_recommended_router_section`, deterministic).
   - Scope proof: The artifact is in the dispatched `sk-doc` / `docs` command lane.
   - Affected surface hints: `command router`, `execution_targets`, `workflow dispatch`.
   - Claim: `.opencode/commands/create/benchmark.md` lacks `execution_targets`.
   - Reprobe evidence: Direct live validation returned the `execution_targets` warning; emission is verified at `validate_document.py:497-507` and `template_rules.json:119`. `matchesLiveReality: true`.

8. **Missing recommended router section: `workflow_summary`** -- `.opencode/commands/create/benchmark.md:7-50` -- The live sk-doc validator reports the canonical router section as missing.
   - Finding class: `template-conformance` (`missing_recommended_router_section`, deterministic).
   - Scope proof: The artifact is in the dispatched `sk-doc` / `docs` command lane.
   - Affected surface hints: `command router`, `workflow_summary`, `workflow handoff`.
   - Claim: `.opencode/commands/create/benchmark.md` lacks `workflow_summary`.
   - Reprobe evidence: Direct live validation returned the `workflow_summary` warning; emission is verified at `validate_document.py:497-507` and `template_rules.json:119`. `matchesLiveReality: true`.

9. **Missing recommended router section: `router_contract`** -- `.opencode/commands/create/changelog.md:7-49` -- The live sk-doc validator reports the canonical router section as missing.
   - Finding class: `template-conformance` (`missing_recommended_router_section`, deterministic).
   - Scope proof: The artifact is in the dispatched `sk-doc` / `docs` command lane.
   - Affected surface hints: `command router`, `router_contract`, `incremental migration guidance`.
   - Claim: `.opencode/commands/create/changelog.md` lacks `router_contract`.
   - Reprobe evidence: Direct live validation returned `valid: true` plus the `router_contract` warning; emission is verified at `validate_document.py:497-507` and `template_rules.json:119`. `matchesLiveReality: true`.

10. **Missing recommended router section: `mode_routing`** -- `.opencode/commands/create/changelog.md:7-49` -- The live sk-doc validator reports the canonical router section as missing.
   - Finding class: `template-conformance` (`missing_recommended_router_section`, deterministic).
   - Scope proof: The artifact is in the dispatched `sk-doc` / `docs` command lane.
   - Affected surface hints: `command router`, `mode_routing`, `execution-mode selection`.
   - Claim: `.opencode/commands/create/changelog.md` lacks `mode_routing`.
   - Reprobe evidence: Direct live validation returned the `mode_routing` warning; emission is verified at `validate_document.py:497-507` and `template_rules.json:119`. `matchesLiveReality: true`.

11. **Missing recommended router section: `execution_targets`** -- `.opencode/commands/create/changelog.md:7-49` -- The live sk-doc validator reports the canonical router section as missing.
   - Finding class: `template-conformance` (`missing_recommended_router_section`, deterministic).
   - Scope proof: The artifact is in the dispatched `sk-doc` / `docs` command lane.
   - Affected surface hints: `command router`, `execution_targets`, `workflow dispatch`.
   - Claim: `.opencode/commands/create/changelog.md` lacks `execution_targets`.
   - Reprobe evidence: Direct live validation returned the `execution_targets` warning; emission is verified at `validate_document.py:497-507` and `template_rules.json:119`. `matchesLiveReality: true`.

12. **Missing recommended router section: `workflow_summary`** -- `.opencode/commands/create/changelog.md:7-49` -- The live sk-doc validator reports the canonical router section as missing.
   - Finding class: `template-conformance` (`missing_recommended_router_section`, deterministic).
   - Scope proof: The artifact is in the dispatched `sk-doc` / `docs` command lane.
   - Affected surface hints: `command router`, `workflow_summary`, `workflow handoff`.
   - Claim: `.opencode/commands/create/changelog.md` lacks `workflow_summary`.
   - Reprobe evidence: Direct live validation returned the `workflow_summary` warning; emission is verified at `validate_document.py:497-507` and `template_rules.json:119`. `matchesLiveReality: true`.

13. **Missing recommended router section: `router_contract`** -- `.opencode/commands/create/command.md:7-49` -- The live sk-doc validator reports the canonical router section as missing.
   - Finding class: `template-conformance` (`missing_recommended_router_section`, deterministic).
   - Scope proof: The artifact is in the dispatched `sk-doc` / `docs` command lane.
   - Affected surface hints: `command router`, `router_contract`, `incremental migration guidance`.
   - Claim: `.opencode/commands/create/command.md` lacks `router_contract`.
   - Reprobe evidence: Direct live validation returned `valid: true` plus the `router_contract` warning; emission is verified at `validate_document.py:497-507` and `template_rules.json:119`. `matchesLiveReality: true`.

14. **Missing recommended router section: `mode_routing`** -- `.opencode/commands/create/command.md:7-49` -- The live sk-doc validator reports the canonical router section as missing.
   - Finding class: `template-conformance` (`missing_recommended_router_section`, deterministic).
   - Scope proof: The artifact is in the dispatched `sk-doc` / `docs` command lane.
   - Affected surface hints: `command router`, `mode_routing`, `execution-mode selection`.
   - Claim: `.opencode/commands/create/command.md` lacks `mode_routing`.
   - Reprobe evidence: Direct live validation returned the `mode_routing` warning; emission is verified at `validate_document.py:497-507` and `template_rules.json:119`. `matchesLiveReality: true`.

15. **Missing recommended router section: `execution_targets`** -- `.opencode/commands/create/command.md:7-49` -- The live sk-doc validator reports the canonical router section as missing.
   - Finding class: `template-conformance` (`missing_recommended_router_section`, deterministic).
   - Scope proof: The artifact is in the dispatched `sk-doc` / `docs` command lane.
   - Affected surface hints: `command router`, `execution_targets`, `workflow dispatch`.
   - Claim: `.opencode/commands/create/command.md` lacks `execution_targets`.
   - Reprobe evidence: Direct live validation returned the `execution_targets` warning; emission is verified at `validate_document.py:497-507` and `template_rules.json:119`. `matchesLiveReality: true`.

16. **Missing recommended router section: `workflow_summary`** -- `.opencode/commands/create/command.md:7-49` -- The live sk-doc validator reports the canonical router section as missing.
   - Finding class: `template-conformance` (`missing_recommended_router_section`, deterministic).
   - Scope proof: The artifact is in the dispatched `sk-doc` / `docs` command lane.
   - Affected surface hints: `command router`, `workflow_summary`, `workflow handoff`.
   - Claim: `.opencode/commands/create/command.md` lacks `workflow_summary`.
   - Reprobe evidence: Direct live validation returned the `workflow_summary` warning; emission is verified at `validate_document.py:497-507` and `template_rules.json:119`. `matchesLiveReality: true`.

17. **Missing recommended router section: `router_contract`** -- `.opencode/commands/create/feature-catalog.md:7-50` -- The live sk-doc validator reports the canonical router section as missing.
   - Finding class: `template-conformance` (`missing_recommended_router_section`, deterministic).
   - Scope proof: The artifact is in the dispatched `sk-doc` / `docs` command lane.
   - Affected surface hints: `command router`, `router_contract`, `incremental migration guidance`.
   - Claim: `.opencode/commands/create/feature-catalog.md` lacks `router_contract`.
   - Reprobe evidence: Direct live validation returned `valid: true` plus the `router_contract` warning; emission is verified at `validate_document.py:497-507` and `template_rules.json:119`. `matchesLiveReality: true`.

18. **Missing recommended router section: `mode_routing`** -- `.opencode/commands/create/feature-catalog.md:7-50` -- The live sk-doc validator reports the canonical router section as missing.
   - Finding class: `template-conformance` (`missing_recommended_router_section`, deterministic).
   - Scope proof: The artifact is in the dispatched `sk-doc` / `docs` command lane.
   - Affected surface hints: `command router`, `mode_routing`, `execution-mode selection`.
   - Claim: `.opencode/commands/create/feature-catalog.md` lacks `mode_routing`.
   - Reprobe evidence: Direct live validation returned the `mode_routing` warning; emission is verified at `validate_document.py:497-507` and `template_rules.json:119`. `matchesLiveReality: true`.

19. **Missing recommended router section: `execution_targets`** -- `.opencode/commands/create/feature-catalog.md:7-50` -- The live sk-doc validator reports the canonical router section as missing.
   - Finding class: `template-conformance` (`missing_recommended_router_section`, deterministic).
   - Scope proof: The artifact is in the dispatched `sk-doc` / `docs` command lane.
   - Affected surface hints: `command router`, `execution_targets`, `workflow dispatch`.
   - Claim: `.opencode/commands/create/feature-catalog.md` lacks `execution_targets`.
   - Reprobe evidence: Direct live validation returned the `execution_targets` warning; emission is verified at `validate_document.py:497-507` and `template_rules.json:119`. `matchesLiveReality: true`.

20. **Missing recommended router section: `workflow_summary`** -- `.opencode/commands/create/feature-catalog.md:7-50` -- The live sk-doc validator reports the canonical router section as missing.
   - Finding class: `template-conformance` (`missing_recommended_router_section`, deterministic).
   - Scope proof: The artifact is in the dispatched `sk-doc` / `docs` command lane.
   - Affected surface hints: `command router`, `workflow_summary`, `workflow handoff`.
   - Claim: `.opencode/commands/create/feature-catalog.md` lacks `workflow_summary`.
   - Reprobe evidence: Direct live validation returned the `workflow_summary` warning; emission is verified at `validate_document.py:497-507` and `template_rules.json:119`. `matchesLiveReality: true`.

### P2 Findings
None.

## Verify-First Evidence
- The adapter was invoked for each of the five artifacts. Each returned four deterministic `P1` `missing_recommended_router_section` findings, with `validatorExitCode: 0` and `artifactDocType: command`.
- The direct live re-probe used the adapter's resolved standard-source path `.opencode/skills/sk-doc/shared/scripts/validate_document.py` and reproduced all 20 warnings. The warning-generation logic is visible at `validate_document.py:497-507`; the four canonical names are live at `template_rules.json:116-119`.
- `extract_structure.py` re-probe returned DQI `84/100` for every artifact, so no DQI-floor finding was filed.
- No finding claims a separate live CLI/registry behavior; no reasoning-agent `reality-drift` finding was needed.

## Known-Deviation Suppressions Applied
- None. The `sk-doc` machine-readable list was checked at `sk_doc_known_deviations.md:130-208`; its match types do not include `missing_recommended_router_section`.
- The documented compact-pointer DQI suppression was not applicable because all five artifacts scored 84 and are command documents. No blanket artifact suppression was applied.

## Edge Cases
- The generic symlink-facing invocation `.opencode/skills/sk-doc/scripts/validate_document.py` reports a missing `sk-doc/assets/template_rules.json` path. The adapter's own standard source intentionally resolves the real validator through `.opencode/skills/sk-doc/shared/scripts/validate_document.py` (`sk-doc.cjs:61-66`, `377-380`), where the live re-probe succeeds. This was recorded as a tool-path ambiguity, not converted into an artifact finding.
- `git status --short` before writes already showed dirty alignment-owned reducer/config/corpus/report files plus `.deep-alignment.lock` and prompt-pack files. Those pre-existing files were not modified by this leaf iteration and remain outside the allowed write set.
- The five-artifact slice was fully checked. The lane still has 23 artifacts remaining after this slice, so coverage is incomplete by design for this single iteration.

## Confirmed-Clean Artifacts
- All five artifacts: frontmatter, description, argument-hint, required router core, no blocking validator errors, and DQI floor passed in the live checks.
- No P0 blocking error, no P2 DQI-floor issue, and no known-deviation match was observed.

## Ruled Out
- Missing required router core sections: ruled out by `valid: true` and empty `blocking_errors` in each live validator result; the remaining issues are non-blocking recommended-section warnings.
- DQI below 75: ruled out by five independent `84/100` `extract_structure.py` results.
- Unverified reality drift: ruled out; every active P1 was reproduced by the real adapter-resolved validator.
- Nested dispatch, remediation, edits to audited artifacts, and writes outside the three allowed packet files: not performed.

## Next Focus
`partition-corpus.cjs` returned the same `sk-doc` command-docs lane with this five-artifact slice and `remainingAfterThisSlice: 23`. The orchestrating workflow should invoke it after reducer refresh to resolve the next five unaudited artifacts; this leaf does not hand-author that selection.
