# Iteration 007 - Closure / Saturation Pass

## Dimension(s)

Cross-cutting closure across correctness, security, traceability, and maintainability. Dimension coverage remains 4/4; this pass tested for missed P0/P1 surfaces rather than re-opening already adjudicated findings.

## Files Reviewed

- `.opencode/skills/deep-review/SKILL.md:1`
- `.opencode/skills/deep-review/references/quick_reference.md:102`
- `.opencode/skills/deep-review/references/loop_protocol.md:1`
- `.opencode/skills/deep-review/references/convergence.md:1`
- `.opencode/skills/sk-code-review/references/review_core.md:22`
- `.opencode/skills/sk-code-review/references/review_ux_single_pass.md:27`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/002-track-review/review/deep-review-state.jsonl:1`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/002-track-review/review/deep-review-strategy.md:1`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/002-track-review/review/iterations/iteration-001.md:1`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/002-track-review/review/iterations/iteration-002.md:1`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/002-track-review/review/iterations/iteration-003.md:1`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/002-track-review/review/iterations/iteration-004.md:1`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/002-track-review/review/iterations/iteration-005.md:1`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/002-track-review/review/iterations/iteration-006.md:1`
- `package.json:5`
- `.opencode/skills/system-spec-kit/mcp_server/package.json:17`
- `.gitignore:44`
- `.gitattributes:6`
- `.opencode/skills/system-spec-kit/scripts/spec/check-smart-router.sh:24`
- `.opencode/skills/system-spec-kit/scripts/spec/check-smart-router.sh:68`
- `.opencode/skills/system-spec-kit/scripts/spec/check-smart-router.sh:280`
- `.opencode/skills/system-spec-kit/scripts/spec/check-smart-router.sh:335`
- `.opencode/skills/system-spec-kit/scripts/spec/check-smart-router.sh:343`
- `.opencode/skills/system-spec-kit/scripts/spec/create.sh:821`
- `.opencode/skills/system-spec-kit/scripts/spec/progressive-validate.sh:552`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:38`
- `.opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/session-stop.js:34`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/resource-map.md:1`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/resource-map.md:20`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/spec.md:70`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/001-skills/spec.md:57`
- `.opencode/specs/skilled-agent-orchestration/094-playbook-prompt-naturalness/checklist.md:37`
- `.opencode/specs/skilled-agent-orchestration/094-playbook-prompt-naturalness/implementation-summary.md:13`
- `.codex/agents/review.toml:400`
- `.opencode/commands/speckit/assets/speckit_deep-review_auto.yaml:56`
- `.opencode/commands/speckit/assets/speckit_deep-review_confirm.yaml:56`
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/freshness/generation.ts:12`
- `.opencode/agents/deep-review.md:318`
- `.opencode/agents/orchestrate.md:96`

Additional closure commands:

- `rg -n "\.opencode/(skill|agent|command)/|sk-deep-(review|research)" .github/workflows package.json .opencode/skills/system-spec-kit/mcp_server/package.json .gitignore .gitattributes .opencode/skills/system-spec-kit/scripts/spec .opencode/skills/system-spec-kit/scripts/lib .opencode/skills/system-spec-kit/mcp_server/hooks/claude .opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude`
- `bash .opencode/skills/system-spec-kit/scripts/spec/check-smart-router.sh --json`
- `git show --name-status --format=short 40dcf80052 -- .opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural`
- `git show --name-only --format= 40dcf80052` sampled against resource-map claimed touched files

## Findings by Severity

Only new or changed findings are listed here.

### P0

No new or changed P0 findings. P0-001 remains active and unchanged.

### P1

#### P1-013 [P1] Smart-router validation scans the removed singular skill root and exits clean with zero coverage

- Status: New.
- File: `.opencode/skills/system-spec-kit/scripts/spec/check-smart-router.sh:68`
- Evidence: The help text says the check validates every top-level `.opencode/skills/*/SKILL.md` smart-router block (`check-smart-router.sh:24`), but the embedded Python sets `SKILL_ROOT = ROOT_DIR / ".opencode" / "skill"` at line 68. When that root does not exist, `iter_skill_dirs()` returns an empty list (`check-smart-router.sh:280-282`), `main()` analyzes that empty list (`check-smart-router.sh:335`), and the script exits 0 unless payload errors exist (`check-smart-router.sh:343`). Running `bash .opencode/skills/system-spec-kit/scripts/spec/check-smart-router.sh --json` returned `{"errors":[],"warnings":[]}`, which is a false clean result rather than an explicit "0 skills scanned" failure.
- Impact: This is one of the requested `validate.sh`-family closure surfaces. A release/CI helper meant to catch missing smart-router resources silently skips all current skills after the plural rename. That can let broken `SKILL.md` resource references pass even though the script advertises coverage of `.opencode/skills/*/SKILL.md`.
- Finding class: cross-consumer.
- Scope proof: The same sweep found no `.github/workflows/` directory, no root or `mcp_server/package.json` scripts referencing singular roots, no `.gitignore`/`.gitattributes` singular ignore miss, and no `.opencode/skill/` literal in Claude hook source/dist. This new issue is localized to `check-smart-router.sh`.
- Recommendation: Change `SKILL_ROOT` to `ROOT_DIR / ".opencode" / "skills"` and fail nonzero when the expected root exists but zero top-level skills are scanned. Then rerun the check and add it to the rename guard set.

### P2

No new or changed P2 findings.

## Traceability Checks

| Check | Result | Evidence |
| --- | --- | --- |
| Final missed-surface sweep | fail | New P1-013 in `check-smart-router.sh`; no `.github/workflows/` directory was present, package scripts produced no singular/sk-deep matches, `.gitignore` uses plural `.opencode/skills/.advisor-state/`, and Claude hook source/dist produced no `.opencode/skill/` literal. |
| P1 severity refinement | pass | All remaining P1s were challenged. No downgrade: P1-007 is load-bearing because the checklist defines P0/P1 completion impact while the implementation summary claims completion; P1-009 is an active Codex runtime instruction surface conflicting with shared review doctrine; P1-010 is spec/resource-map audit drift that breaks the packet's authoritative rename evidence, not harmless prose. |
| Resource-map existence sample | pass | Sampled claimed touched entries exist post-rename: `opencode.json`, `.claude/settings.local.json`, `skill_advisor.py`, `.opencode/agents/orchestrate.md`, `mcp-doctor.sh`, `target_manifest.jsonc`, `runtime_capabilities.json`, and `sk-prompt/graph-metadata.json`. The same sample appears in `git show --name-only 40dcf80052`. |
| Resource-map drift | unchanged | The map's phase headings still contain plural-to-plural tautologies (`resource-map.md:20`, plus parent/child specs), already covered by P1-010. No additional resource-map-only P2 was found. |
| Coverage accounting | pass | All four dimensions remain covered. One new P1 means saturation is not clean for this pass. |

### P1 Adversarial Classification Notes

- P1-002 remains P1: auto command YAML uses non-existent `sk-deep-review` paths at `.opencode/commands/speckit/assets/speckit_deep-review_auto.yaml:56-64`; this is command-owned workflow input, not commentary.
- P1-003 remains P1: source writes advisor generation state to `.opencode/skill/.advisor-state` at `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/freshness/generation.ts:12`; this conflicts with the plural `.gitignore` state path at `.gitignore:44`.
- P1-004 remains P1: packet 096 validation is a required gate failure for the largest rename packet.
- P1-006 remains P1: the Claude Stop hook includes `SPECKIT_GENERATE_CONTEXT_SCRIPT` before canonical candidate resolution at `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:38-46`; the hook fires on a live runtime path.
- P1-007 remains P1: checked checklist evidence is a completion gate, not decorative documentation. The checklist defines P0 as "Cannot claim done until complete" and P1 as "Must complete OR get user approval" at `.opencode/specs/skilled-agent-orchestration/094-playbook-prompt-naturalness/checklist.md:37-39`, while the implementation summary claims "Implementation complete; all gates passed" at line 13.
- P1-008 remains P1: OpenCode leaf-agent instructions cite `.opencode/skills/sk-deep-review/...` at `.opencode/agents/deep-review.md:318`, so an active runtime mirror can route readers/executors to a non-existent skill.
- P1-009 remains P1: `.codex/agents/review.toml:400-404` says not to block without P0 evidence and treats P1 as not immediate blockers, while shared doctrine says P1 is "Fix before merge" (`review_core.md:23`) and deep-review quick reference says active P1s produce `CONDITIONAL`, not `PASS` (`quick_reference.md:103`). This is active runtime instruction text, not a passive note.
- P1-010 remains P1: the plural-to-plural rewrite corrupts active packet requirements and resource-map audit evidence (`spec.md:70`, `001-skills/spec.md:57`, `resource-map.md:20`). It does not directly break runtime automation, but it breaks the authoritative spec/traceability contract for the rename packet.
- P1-011 remains P1: `.opencode/agents/orchestrate.md:96` is an active routing table that names retired `sk-deep-research`.
- P1-012 remains P1: confirm-mode YAML mirrors the same live workflow defect as auto mode at `.opencode/commands/speckit/assets/speckit_deep-review_confirm.yaml:56-64`.

## Verdict

FAIL, `hasAdvisories=true`.

The active P0 remains, and this closure pass found one additional P1 in the validator/helper surface. The cumulative active set is now P0=1, P1=11, P2=9.

## Closure Recommendation

Not ready for synthesis yet. The loop is close to saturation, but iteration 7 was not clean: P1-013 is a new validator-family miss and should get one narrow iteration-8 confirmation sweep around smart-router validation and any adjacent spec-check helpers. If iteration 8 finds no new P0/P1 and no severity changes, request synthesis even if the active P0 remains, because the verdict is already forced to FAIL.

## Next Dimension

Iteration 8 should be a narrow closure confirmation pass: verify `check-smart-router.sh` is the only validator-family singular root, rerun the final missed-surface sweep after any remediation, and then request synthesis if no additional new or changed findings appear.
