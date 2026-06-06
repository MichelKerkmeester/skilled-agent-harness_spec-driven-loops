# Deep-Review iter-3 — 007 rename packet — dimension: SECURITY

## Role
Senior deep-reviewer. Read-only. Cite EVIDENCE.

## Context
Target: `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/007-sk-prompt-small-model-rename/`
Mode: READ-ONLY. Iter-1 (correctness) returned 0 findings; iter-2 (traceability) running.

## Scope: SECURITY dimension (iter 3)

### Pre-planning

1. **Advisor cache integrity**: `jq '.skills | keys, .families["sk-util"]'` on the compiled `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill-graph.json`. Verify the renamed skill is present and the old name is absent. Verify `generated_at` is fresh (later than the 007 rename commits would be expected to land).
   - Acceptance: jq output cited + verdict.

2. **Sibling edges symmetry**: Run `skill_graph_compiler.py --validate-only` and verify zero SYMMETRY warnings remain after the 007 incidental fixes. If any new symmetry warnings exist, classify as finding.
   - Acceptance: stderr output + verdict.

3. **No privilege escalation**: Check that the rename did not introduce new `allowed-tools` in the renamed SKILL.md, did not add `--dangerously-skip-permissions` or `dangerous` permission-mode usage anywhere, did not add new bash escape patterns. Use `git diff main..HEAD` (or `git log -p`) on the renamed dir + sibling skill files.
   - Acceptance: per-surface diff verdict.

4. **Memory data integrity**: Verify `feedback_skill_graph_compiler_rebuild.md` tag-insertion did not corrupt YAML frontmatter or break inbound `[[wikilinks]]` to `reference_small_model_dispatch_matrix`. Check the file parses as valid markdown + frontmatter.
   - Acceptance: parse OK + link integrity verdict.

5. **No secret leak**: Confirm no API keys, tokens, paths to credentials, or session-state-sensitive data was added in any 007 spec doc + scratch artifacts.

### Action
Run 1-5 in order, emit findings.

### Output
JSON `## FINDINGS` block + `## NARRATIVE`.

End of prompt.
