# Iteration 008 - Final Saturation Sweep

## Dimension(s)

Cross-cutting final saturation across correctness, security, traceability, and maintainability. Dimension coverage remains 4/4. This pass avoided already adjudicated findings and checked only the explicitly requested missed surfaces.

## Files Reviewed

- `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/002-track-review/review/deep-review-state.jsonl:1`
- `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/002-track-review/review/deep-review-strategy.md:1`
- `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/002-track-review/review/deep-review-findings-registry.json:1`
- `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/002-track-review/review/iterations/iteration-007.md:1`
- `package.json:5`
- `.opencode/skills/system-spec-kit/mcp_server/package.json:17`
- `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:20`
- `.opencode/skills/system-spec-kit/scripts/lib/shell-common.sh:48`
- `.opencode/skills/system-spec-kit/scripts/spec/check-smart-router.sh:68`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:1`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:1`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:1`
- `.opencode/commands/doctor/scripts/audit_descriptions.py:47`
- `.opencode/commands/doctor/scripts/audit_descriptions.py:157`
- `.opencode/commands/doctor/scripts/audit_descriptions.py:185`
- `.opencode/commands/doctor/scripts/audit_descriptions.py:220`
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py:56`
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py:67`
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py:78`
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py:267`
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py:3449`
- `.codex/agents/deep-review.toml:1`
- `.codex/agents/deep-research.toml:1`
- `.codex/agents/review.toml:1`
- `.codex/agents/orchestrate.toml:1`
- `.gemini/agents/deep-review.md:1`
- `.gemini/agents/deep-research.md:1`
- `.gemini/agents/review.md:1`
- `.gemini/agents/orchestrate.md:1`

Additional commands:

- `rg --files .github/workflows package.json mcp_server/package.json .opencode/skills/system-spec-kit/mcp_server/package.json .opencode/skills/system-spec-kit/scripts/spec .opencode/skills/system-spec-kit/scripts/lib .opencode/skills/system-spec-kit/hooks/claude .opencode/skills/system-spec-kit/mcp_server/hooks/claude .codex/agents .gemini/agents`
- `rg -n "\.opencode/(skill|agent|command)/|\.opencode/skill\b|sk-deep-" package.json .opencode/skills/system-spec-kit/mcp_server/package.json .opencode/skills/system-spec-kit/scripts/spec .opencode/skills/system-spec-kit/scripts/lib .opencode/skills/system-spec-kit/mcp_server/hooks/claude .codex/agents .gemini/agents`
- `rg -n "is_phase_parent|\.opencode/(skill|agent|command)/|\.opencode/skill\b|sk-deep-|SKILL_ROOT" .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/skills/system-spec-kit/scripts/lib .opencode/skills/system-spec-kit/scripts/spec/check-smart-router.sh`
- `python3 .opencode/commands/doctor/scripts/audit_descriptions.py --json`
- `python3 .opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py "deep review" --force-native`

## Findings by Severity

Only new or changed findings are listed here.

### P0

No new or changed P0 findings. P0-001 remains active and unchanged.

### P1

#### P1-014 [P1] Python doctor/advisor support scripts still resolve singular OpenCode roots after the plural rename

- Status: New.
- File: `.opencode/commands/doctor/scripts/audit_descriptions.py:157`
- Evidence: The description audit says it walks plural `.opencode/skills`, `.opencode/commands`, and `.opencode/agents` surfaces, but `walk_skills()` sets `base = repo / ".opencode" / "skill"` at line 157, `walk_commands()` sets `base = repo / ".opencode" / "command"` at line 185, and the OpenCode agent mirror entry uses `repo / ".opencode" / "agent"` at line 220. Running `python3 .opencode/commands/doctor/scripts/audit_descriptions.py --json` reported `counts.skills=0`, `counts.commands=0`, and only 11 agent entries from non-OpenCode mirrors, while `find .opencode/skills -maxdepth 2 -name SKILL.md | wc -l` found 16 current skill files. The same support-script class also appears in `skill_advisor.py`: the native bridge module constants still build `.opencode/skill/system-spec-kit/...` paths at lines 56-89, `_native_bridge_available()` gates on those paths at lines 267-269, and `python3 .../skill_advisor.py "deep review" --force-native` exits 2 with `NATIVE_DIST_MISSING` even though the plural `SKILLS_DIR` health path reports 19 skills.
- Impact: These are active support tools, not archived prose. The doctor audit silently drops current skills, commands, and OpenCode agent descriptions from budget validation, and the skill advisor Python shim cannot exercise the native advisor bridge unless callers fall back to the local scorer. That directly weakens the rename verification and skill-routing surfaces the 096 packet claimed to patch.
- Finding class: cross-consumer.
- Scope proof: The same targeted sweep found no `.github/workflows` directory, no top-level `mcp_server/package.json`, no `.opencode/skills/system-spec-kit/hooks/claude` tree, no singular/sk-deep hits in present package scripts, no singular/sk-deep hits in `validate.sh` or `is_phase_parent`, no singular/sk-deep hits in the present Claude hook tree, and no singular/sk-deep hits in the sampled Codex/Gemini leaf-agent mirrors.
- Recommendation: Patch the doctor audit to use `.opencode/skills`, `.opencode/commands`, and `.opencode/agents`; patch the Python advisor native bridge paths to use `.opencode/skills/system-spec-kit`; then add nonzero coverage assertions for skills/commands/OpenCode agents and a `--force-native` smoke check to the rename guard set.

### P2

No new or changed P2 findings.

## Traceability Checks

| Check | Result | Evidence |
| --- | --- | --- |
| CI workflow sweep | pass | `.github/workflows` is absent in this checkout, so no CI YAML singular-path or `sk-deep-*` reference is available. |
| Package entry sweep | pass | `package.json` and `.opencode/skills/system-spec-kit/mcp_server/package.json` have no singular `.opencode/(skill|agent|command)/` or `sk-deep-*` references. The requested top-level `mcp_server/package.json` path is absent. |
| Validation helper sweep | partial | `validate.sh` and `is_phase_parent` have no singular-root literal; already-established P1-013 remains active in adjacent `check-smart-router.sh:68`. |
| Claude hook sweep | pass | The prompt's `.opencode/skills/system-spec-kit/hooks/claude` path is absent; the live `.opencode/skills/system-spec-kit/mcp_server/hooks/claude` tree has no singular `.opencode/skill/` or `sk-deep-*` hits. |
| Python audit/advisor sweep | fail | New P1-014: `audit_descriptions.py` uses singular roots for skills, commands, and OpenCode agents; `skill_advisor.py --force-native` points native bridge paths at `.opencode/skill/system-spec-kit`. |
| Codex/Gemini mirror sweep | pass | Sampled leaf-agent mirrors in `.codex/agents` and `.gemini/agents` produced no singular-root or `sk-deep-*` matches. Existing Codex `review.toml` semantic drift remains covered by P1-009, not changed here. |

## Verdict

FAIL, `hasAdvisories=true`.

The active P0 remains, and this final saturation pass found one additional P1 in the Python support-tool surface. Cumulative findings are now P0=1, P1=12, P2=9.

## Closure Recommendation

Needs iteration 9. The loop is saturated across the original four dimensions, but iteration 8 was not clean: P1-014 is material and touches two active support tools the prompt explicitly asked to verify. Iteration 9 should be a very narrow re-pass on Python support tool pluralization and zero-coverage guards; if it finds no new or changed findings, proceed to synthesis with verdict FAIL pending P0-001 remediation.

## Next Dimension / Status

Iter-9: targeted re-pass on Python support-tool pluralization (`audit_descriptions.py`, `skill_advisor.py`) and zero-coverage guard behavior. No broad re-investigation of dist drift, command YAML, runtime mirrors, resolver/hook precedence, or checklist evidence.
