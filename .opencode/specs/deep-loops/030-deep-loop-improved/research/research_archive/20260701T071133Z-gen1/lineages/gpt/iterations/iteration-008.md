# Iteration 8: Final Gap Sweep

## Focus

Final targeted gap sweep across comment hygiene, threshold tests, stale scaffolds, and review-lineage state.

## Findings

1. The workflow comment-hygiene problem is broader than the initially named lines. In addition to the resource-map config/state comments, `deep_review_auto.yaml` has another ephemeral `F-010-B5-03` marker in the missing-output JSONL fallback [SOURCE: `.opencode/commands/deep/assets/deep_review_auto.yaml:980`-`.opencode/commands/deep/assets/deep_review_auto.yaml:991`], and `deep_research_auto.yaml` has `F-010-B5-02` in its missing-output fallback [SOURCE: `.opencode/commands/deep/assets/deep_research_auto.yaml:1090`-`.opencode/commands/deep/assets/deep_research_auto.yaml:1102`]. Recommendation: run comment hygiene on workflow YAML, not only modified code files, and remove all `F-010-B5-*` markers in one patch.

2. The test suite has no grep-visible assertion for `--convergence-threshold`, `config.convergenceThreshold`, `computeLineageTimeoutMs`, timeout-cap override, or lineage timeout cap under `deep-loop-runtime/tests` [SOURCE: Grep `convergence-threshold|convergenceThreshold:|config.convergenceThreshold|--convergence-threshold|computeLineageTimeoutMs|lineageTimeout|timeoutCap|4 * 60 * 60` under `.opencode/skills/deep-loop-runtime/tests` returned no files]. Recommendation: add regression coverage for both research YAML argument threading and timeout cap configurability.

3. The stale scaffold problem extends beyond the initially sampled `001`, `004`, `005`, `006`, and `007` examples. `002/013-coverage-graph-time-decay` and `002/017-fanout-stall-watchdog` are Complete-status phases in grep results, but their task files still contain scaffold continuity (`Replace template defaults`, zero fingerprint, `completion_pct: 0`) and generic unchecked task rows [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/002-deep-loop-runtime/013-coverage-graph-time-decay/tasks.md:1`-`.opencode/specs/deep-loops/030-agent-loops-improved/002-deep-loop-runtime/013-coverage-graph-time-decay/tasks.md:87`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/002-deep-loop-runtime/017-fanout-stall-watchdog/tasks.md:1`-`.opencode/specs/deep-loops/030-agent-loops-improved/002-deep-loop-runtime/017-fanout-stall-watchdog/tasks.md:87`]. Recommendation: do not patch these piecemeal; run a packet-wide scaffold-drift detector and regenerate all affected closeout docs.

4. Existing comment-hygiene infrastructure exists in `sk-code`, but it is not preventing the checked-in workflow YAML markers. The system-spec-kit manual playbooks identify `check-comment-hygiene.sh` as the baseline enforcement script [SOURCE: `.opencode/skills/system-spec-kit/manual_testing_playbook/18--ux-hooks/A--comment-hygiene-checker-baseline.md:72`], and `sk-code` requires the checker before commit [SOURCE: `.opencode/skills/sk-code/SKILL.md:245`]. Recommendation: include `.yaml` command assets in the pre-commit/CI scan or add an explicit command-asset hygiene gate.

## Sources Consulted

- Grep for ephemeral markers under `.opencode/commands/deep/assets`
- Grep for threshold/timeout tests under `.opencode/skills/deep-loop-runtime/tests`
- Grep for stale scaffold patterns under the packet
- `deep_review_auto.yaml` fallback section
- `deep_research_auto.yaml` fallback section
- `002/013` and `002/017` task files

## Assessment

- newInfoRatio: 0.32
- Novelty justification: Found two additional ephemeral markers and confirmed absence of threshold/timeout regression coverage.
- Confidence: High for marker presence and missing grep-visible test coverage; medium for total scaffold count because grep output was truncated.

## Reflection

- What worked: Narrow grep patterns found missed durable-comment markers.
- What failed: Full stale-scaffold enumeration remains too broad for manual review.
- Ruled out: Limiting comment-hygiene cleanup to the two originally cited YAML lines.

## Recommended Next Focus

No-new-information convergence verification pass.
