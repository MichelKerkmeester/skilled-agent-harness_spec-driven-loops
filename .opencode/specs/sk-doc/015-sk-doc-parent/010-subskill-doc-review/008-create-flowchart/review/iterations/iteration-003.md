# Deep Review Iteration 003

## Dispatcher

- Command: `/deep:review:auto`
- Agent: `deep-review`
- Mode: `review`
- Route proof: `target_agent=deep-review`; `resolved_route=/deep:review:auto -> .opencode/agents/deep-review.md`; `agent_definition_loaded=true`; `mode=review`
- Review target: `.opencode/skills/sk-doc/create-flowchart/`
- Review target type: `skill`
- Spec folder: `.opencode/specs/skilled-agent-orchestration/125-sk-doc-parent/010-subskill-doc-review/008-create-flowchart`
- Lifecycle mode: `resume`
- Iteration focus: maintainability — path/script/tool/flag/section-claim verification, especially packet-local `validate_flowchart.sh` and shared `sk-doc` scripts
- Budget profile: `scan`

## Files Reviewed

- `.opencode/skills/sk-doc/create-flowchart/SKILL.md`
- `.opencode/skills/sk-doc/create-flowchart/references/notation_and_validator.md`
- `.opencode/skills/sk-doc/create-flowchart/scripts/validate_flowchart.sh`
- `.opencode/skills/sk-doc/shared/scripts/validate_document.py`
- `.opencode/skills/sk-doc/shared/scripts/`
- `.opencode/specs/skilled-agent-orchestration/125-sk-doc-parent/010-subskill-doc-review/008-create-flowchart/review/deep-review-state.jsonl`
- `.opencode/specs/skilled-agent-orchestration/125-sk-doc-parent/010-subskill-doc-review/008-create-flowchart/review/deep-review-strategy.md`
- `.opencode/specs/skilled-agent-orchestration/125-sk-doc-parent/010-subskill-doc-review/008-create-flowchart/review/iterations/iteration-002.md`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Preferred arrow notation drifts from the validator's actual connector detector** -- `.opencode/skills/sk-doc/create-flowchart/SKILL.md:115` -- The primary contract recommends `▼` for top-to-bottom flow and `──▶` for horizontal flow [SOURCE: `.opencode/skills/sk-doc/create-flowchart/SKILL.md:115`; SOURCE: `.opencode/skills/sk-doc/create-flowchart/SKILL.md:116`], but the packet-local script only counts `→`, `↓`, `├─`, or `└─` as arrow/branch markers [SOURCE: `.opencode/skills/sk-doc/create-flowchart/scripts/validate_flowchart.sh:63`; SOURCE: `.opencode/skills/sk-doc/create-flowchart/scripts/validate_flowchart.sh:70`]. The notation reference accurately describes the script detector [SOURCE: `.opencode/skills/sk-doc/create-flowchart/references/notation_and_validator.md:32`], which means the primary workflow's preferred glyphs and the validator mechanics are not aligned. This is advisory because the existing broader connector bug from iteration 001 can mask the mismatch by counting `└─` box borders, but the docs should still converge on the same connector vocabulary. Recommendation: either add `▼` and `▶`/`──▶` to `check_arrows`, or change `SKILL.md` preferred arrows to the glyphs the validator actually recognizes.
   - Finding class: `cross-consumer`
   - Scope proof: Compared `SKILL.md` notation rules, `notation_and_validator.md` connector mechanics, and `validate_flowchart.sh` `grep -Ec` detector; also ran a preferred-vertical fixture through the validator and observed exit 0 due the existing border-counting behavior, confirming this finding is drift risk rather than a separate blocking failure.
   - Affected surface hints: [`SKILL.md notation rules`, `scripts/validate_flowchart.sh check_arrows`, `references/notation_and_validator.md`, `assets/flowcharts/*`]

## Traceability Checks

- Confirmed packet-local script path exists: `.opencode/skills/sk-doc/create-flowchart/scripts/validate_flowchart.sh`.
- Confirmed shared document validator path exists: `.opencode/skills/sk-doc/shared/scripts/validate_document.py`.
- Confirmed shared scripts directory contents: `.gitkeep`, `check-frontmatter-versions.sh`, `extract_structure.py`, `frontmatter-version.mjs`, `quick_validate.py`, `validate_document.py`.
- Confirmed `validate_document.py` supports the documented and requested `--type` flag for `readme`, `skill`, `reference`, `asset`, `agent`, `command`, `install_guide`, `spec`, and `changelog` [SOURCE: `.opencode/skills/sk-doc/shared/scripts/validate_document.py:693`].
- Confirmed `validate_flowchart.sh` supports the documented single positional `<flowchart.md>` usage and no extra packet-local flags [SOURCE: `.opencode/skills/sk-doc/create-flowchart/scripts/validate_flowchart.sh:15`; SOURCE: `.opencode/skills/sk-doc/create-flowchart/scripts/validate_flowchart.sh:21`].

## Integration Evidence

- `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-flowchart/SKILL.md --type skill --json` exited 0 with `valid=True` and `total_issues=0`.
- Bounded script/path check confirmed `validate_flowchart_exists True`, `validate_document_exists True`, and listed the real shared scripts.
- Preferred-vertical fixture check ran `bash validate_flowchart.sh <temp.md>` and exited 0; this supported the counterevidence analysis that the newly filed drift is masked by the iteration-001 connector-border issue.
- Spec Memory daemon status showed runtime not ready (`CONNECT_ECONNREFUSED...`, retryable exit 75); no memory-dependent evidence was required for this code audit.

## Edge Cases

- The user requested a per-iteration delta JSONL artifact if the active write contract permits it. The active LEAF contract still limits writes to iteration artifact, strategy file, and JSONL state log, so no delta artifact was written.
- `review/deep-review-config.json` and `review/deep-review-findings-registry.json` remain absent from the existing lineage; this iteration did not create reducer/config-owned files.
- The arrow-notation issue is intentionally P2 because the existing P1 connector detector flaw already captures the blocking validator-gate weakness.

## Confirmed-Clean Surfaces

- No fabricated shared-script path was found for the reviewed claims: `validate_document.py` exists under `../shared/scripts/`.
- No fabricated packet-local validator path was found: `scripts/validate_flowchart.sh` exists and runs.
- `--type skill` is a real `validate_document.py` option and validated `SKILL.md` successfully.
- `validate_flowchart.sh` exit behavior for warnings/errors matches the documented high-level contract: it exits 0 with no errors, exits 0 with warnings only, and exits 1 when errors remain [SOURCE: `.opencode/skills/sk-doc/create-flowchart/scripts/validate_flowchart.sh:142`; SOURCE: `.opencode/skills/sk-doc/create-flowchart/scripts/validate_flowchart.sh:145`; SOURCE: `.opencode/skills/sk-doc/create-flowchart/scripts/validate_flowchart.sh:149`].

## Ruled Out

- Fabricated `validate_document.py --type` flag: ruled out by argparse definition and successful command execution.
- Fabricated `validate_flowchart.sh` script path: ruled out by file existence and command execution.
- Additional P1 for preferred arrow notation: ruled out because the active P1 from iteration 001 already covers the validator's connector-enforcement weakness, while this pass isolates a non-blocking documentation/script vocabulary drift.

## Next Focus

- dimension: security
- focus area: validation gate execution and final cross-check for blocking documentation issues
- reason: Correctness, traceability, and maintainability passes are complete; final pass should run all required template validations and check for any security/reliability implications in shell/Python command usage.
- rotation status: correctness completed; traceability completed; maintainability completed; security next
- blocked/productive carry-forward: script/flag verification was productive; avoid re-filing connector-detector variants unless new evidence changes severity
- required evidence: required shared validator commands for `SKILL.md`, top-level `README.md`, all reference files, and packet-local flowchart validator behavior as relevant
- recovery note: Continue one LEAF iteration per dispatch; final synthesis/reducer remains outside this leaf unless explicitly provided by the owning workflow within write-boundary permissions.
