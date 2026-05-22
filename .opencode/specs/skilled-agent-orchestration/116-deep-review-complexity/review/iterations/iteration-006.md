# Iteration 6 — Security (Round 2, Second-Order Risks)

## Dispatcher

Deep-review iteration 6/10. Round 2 of security analysis focusing on second-order risks beyond basic input validation.

## Files Reviewed

- `.opencode/skills/deep-review/scripts/reduce-state.cjs:60-67,1085-1090,1507-1511`
- `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:188`
- `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/review/deep-review-config.json:27`
- `.opencode/skills/deep-review/manual_testing_playbook/08--review-depth-v2-rollout/058-validator-warn-rollout.md`
- `.opencode/skills/deep-review/manual_testing_playbook/08--review-depth-v2-rollout/060-reducer-search-debt.md`

## Findings - New

### P2 (Suggestions)

**P2-006: Markdown injection vulnerability in reducer dashboard rendering**

- **Location**: `.opencode/skills/deep-review/scripts/reduce-state.cjs:1085-1090`
- **Bug Class**: `markdown_injection`
- **Evidence**: The `summarizeSearchEntry` function renders user-controlled fields (`bugClass`, `disposition`, `reason`, `proof`, `rationale`, `evidenceRefs`) directly into markdown without escaping. The `normalizeText` function (lines 60-67) only normalizes whitespace and trims, but does not escape markdown special characters like `#`, `*`, `_`, `[`, `]`, etc.
- **Impact**: A malicious iteration could inject markdown that breaks the report rendering (e.g., injecting `#` to create unintended headings, or `[` to create broken links). This is a second-order risk that could compromise report integrity but does not directly affect the review process or data safety.
- **Recommendation**: Add markdown escaping to user-controlled fields before rendering them in the dashboard. Consider using a dedicated markdown sanitizer or escape function for fields that originate from iteration records.

## Traceability Checks

- **spec_code**: pass - The v2 enforcement and reducer persistence are documented in state_format.md and the playbook scenarios.
- **checklist_evidence**: pass - The playbook scenarios DRV-058 and DRV-060 document the expected behavior for validator warn rollout and reducer search-debt persistence.

## Confirmed-Clean Surfaces

- **YAML shell interpolation**: The workflow YAML uses interpolations like `{state_paths.iteration_dir}` and `{spec_folder}` in shell commands (line 188), but these are system-controlled paths rather than user-controlled content. The interpolations that could contain user data (`{searchLedger}`, `{candidateCoverage}`, `{findingDetails}`) are used in report rendering sections, not in shell commands. Ruled out.

- **Path handling in iteration writer**: The iteration file parsing uses strict regex validation (`/^iteration-\d+\.md$/`) before processing files (lines 1507-1511). The `path.join` is used safely to construct full paths. There is no evidence of symlink following or path traversal via the `iteration` field. Ruled out.

- **Permission mode documentation**: The config uses `permissionMode: "auto"` (line 27 of config), not `dangerous`. The playbook scenarios do not encourage dangerous mode. The loop_protocol.md documents that cli-claude-code uses `--permission-mode acceptEdits` for iteration writes, which is the minimal permission needed for the workflow. Ruled out.

## Next Focus

Traceability (round 2) — Re-examine spec-vs-code alignment with focus on any gaps introduced by the v2 contract changes.

Review verdict: PASS