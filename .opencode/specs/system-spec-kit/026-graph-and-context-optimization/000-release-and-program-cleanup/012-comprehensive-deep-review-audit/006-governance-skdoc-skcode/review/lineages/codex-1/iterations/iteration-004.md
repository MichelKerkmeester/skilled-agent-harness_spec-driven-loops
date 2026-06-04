# Iteration 004: Maintainability

## Focus
Dimension: maintainability.

Reviewed whether the identified command mismatch creates recurring maintenance noise in sk-code's own verification workflow.

## Scorecard
- Dimensions covered: maintainability
- Files reviewed: 4
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.09

## Findings

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
- **F005**: sk-code verifier reports Python `.sh` entrypoints as shell-style drift — `.opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py:31` — the verifier maps `.sh` to shell, while `check-comment-hygiene.sh` and `claude-posttooluse.sh` are Python scripts. Running the verifier on sk-code reports non-blocking shebang and strict-mode warnings for both scripts, which is consistent with the extension map but noisy for intentional Python entrypoints. [SOURCE: .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py:31] [SOURCE: .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py:39] [SOURCE: .opencode/skills/sk-code/scripts/check-comment-hygiene.sh:1] [SOURCE: .opencode/skills/sk-code/scripts/hooks/claude-posttooluse.sh:1]

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/006-governance-skdoc-skcode/spec.md:39 | All requested surfaces have been reviewed at least once. |
| checklist_evidence | pass | hard | .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/006-governance-skdoc-skcode/spec.md:84 | No checked checklist claims to validate. |

## Assessment
- New findings ratio: 0.09
- Dimensions addressed: maintainability
- Novelty justification: Found one advisory maintenance issue that explains why the comment-hygiene surface keeps producing verification noise.

## Ruled Out
- Treating the verifier warning as a blocker: ruled out because `verify_alignment_drift.py --root .opencode/skills/sk-code` exits PASS with warnings by default.
- Treating the warning as unrelated: ruled out because the same Python `.sh` naming is the root of F001's documented Bash invocation failure.

## Dead Ends
- No separate P1 was found in sk-code resource maps; OpenCode and Webflow resource directories referenced by SKILL.md exist.

## Recommended Next Focus
Stabilization pass across all dimensions to verify no new P0/P1 findings and replay traceability gates.
Review verdict: PASS
