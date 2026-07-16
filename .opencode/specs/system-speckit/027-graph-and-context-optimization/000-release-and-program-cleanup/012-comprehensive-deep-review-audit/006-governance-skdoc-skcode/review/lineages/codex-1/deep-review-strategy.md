---
title: Deep Review Strategy
description: Persistent strategy state for fan-out lineage codex-1.
---

# Deep Review Strategy - Governance + sk-doc + sk-code Drift Review Slice

## 1. TOPIC
Review of governance, constitutional enforcement, sk-doc and sk-code standards drift for `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/006-governance-skdoc-skcode`.

## 2. REVIEW CHARTER
- Scope: `.opencode/skills/system-spec-kit/constitutional/**`, `.opencode/skills/sk-doc/**`, `.opencode/skills/sk-code/**`, plus direct enforcement cross-references required to verify claims.
- Non-goal: modify reviewed source files.
- Artifact root: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/006-governance-skdoc-skcode/review/lineages/codex-1`.
- Executor note: cli-codex self-invocation was refused by the loaded executor contract, so the current Codex runtime executed the lineage directly.

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| Correctness | CONDITIONAL | 1 | Manual sk-code comment-hygiene command fails as documented. |
| Security | CONDITIONAL | 2 | Comment-hygiene enforcement guarantee is stronger than actual write/direct-push gates. |
| Traceability | CONDITIONAL | 3 | sk-doc frontmatter and filename standards drift from current Spec Kit practice. |
| Maintainability | PASS | 4 | Verifier warning noise confirmed as advisory. |
| Stabilization | PASS | 5 | No new findings after full coverage. |

<!-- /ANCHOR:completed-dimensions -->

<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 3
- P2 (Suggestions): 2
- Resolved: 0

<!-- /ANCHOR:running-findings -->

## 6. WHAT WORKED
- Comparing documented commands against actual shebang/execution behavior found a direct sk-code contract mismatch.
- Cross-checking sk-doc policy references against current system-spec-kit templates separated stale guidance from active packet practice.
- Treating direct-push governance and PR-only CI as one enforcement system exposed a policy gap that isolated file review would miss.

## 7. WHAT FAILED
- Directory-existence probing alone was insufficient for sk-code drift. A first read suggested missing resources, but exact `find` output showed the referenced OpenCode/Webflow assets exist.
- The reducer script could not be used directly because it resolves the canonical review root from the spec folder, while this lineage is bound to the fan-out override path.

<!-- ANCHOR:exhausted-approaches -->
## 8. EXHAUSTED APPROACHES (do not retry)
### Missing sk-code resource tree -- BLOCKED (iteration 4, 1 attempts)
- What was tried: checked OpenCode/Webflow assets and references named in sk-code.
- Why blocked: the resources exist.
- Do NOT retry: do not report absent sk-code resource directories without a new path-specific miss.

<!-- /ANCHOR:exhausted-approaches -->

## 9. RULED OUT DIRECTIONS
- No comment-hygiene CI: ruled out because `.github/workflows/comment-hygiene.yml` exists.
- Spec frontmatter isolated to one packet: ruled out by current manifest and example spec templates.
- Filename rule enforced by validate_document.py: ruled out because the representative hyphenated playbook file validates cleanly and `--fix --dry-run` emits no rename.

<!-- ANCHOR:next-focus -->
## 10. NEXT FOCUS
Synthesis complete. Next useful action is remediation planning for F001, F002 and F003.

<!-- /ANCHOR:next-focus -->

## 11. KNOWN CONTEXT
- Startup context reported Memory summary only and Code Graph unavailable.
- User bound `artifact_dir` directly to the fan-out lineage override and explicitly prohibited writes outside that directory.
- `resource-map.md` was not present in the target spec at init, so the resource-map coverage gate is skipped for this lineage.

## 12. CROSS-REFERENCE STATUS
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 5 | Spec requested drift audit; findings confirm drift and no P0. |
| `checklist_evidence` | core | pass | 5 | No checklist.md exists for this Level 1 slice. |
| `skill_agent` | overlay | notApplicable | 5 | Target is a spec-folder slice, not a single skill package. |
| `agent_cross_runtime` | overlay | notApplicable | 5 | Target is not an agent. |
| `feature_catalog_code` | overlay | partial | 3 | sk-code manual quality command claim does not execute as written. |
| `playbook_capability` | overlay | partial | 3 | sk-doc playbook filenames contradict older filename prose. |

## 13. FILES UNDER REVIEW
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|---------------------|----------------|----------|--------|
| `.opencode/skills/sk-code/SKILL.md` | correctness, maintainability | 5 | F001 | complete |
| `.opencode/skills/sk-code/references/universal/code_quality_standards.md` | correctness, security, maintainability | 5 | F001, F002 | complete |
| `.opencode/skills/sk-code/assets/opencode/checklists/universal_checklist.md` | correctness | 1 | F001 | complete |
| `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh` | correctness, maintainability | 4 | F001, F005 | complete |
| `.opencode/skills/sk-code/scripts/hooks/claude-posttooluse.sh` | security, maintainability | 4 | F002, F005 | complete |
| `.opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py` | maintainability | 4 | F005 | complete |
| `.opencode/skills/system-spec-kit/constitutional/comment-hygiene.md` | security | 5 | F002 | complete |
| `.opencode/skills/system-spec-kit/constitutional/main-branch-direct-push.md` | security | 2 | F002 | complete |
| `.github/workflows/comment-hygiene.yml` | security | 5 | F002 | complete |
| `.opencode/skills/sk-doc/assets/frontmatter_templates.md` | traceability | 5 | F003 | complete |
| `.opencode/skills/sk-doc/references/global/core_standards.md` | traceability | 5 | F004 | complete |
| `.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl` | traceability | 3 | F003 | complete |
| `.opencode/skills/system-spec-kit/templates/examples/level_1/spec.md` | traceability | 3 | F003 | complete |
| `.opencode/skills/sk-doc/manual_testing_playbook/agent-dispatch/markdown-agent-cli-codex.md` | traceability | 3 | F004 | complete |

## 14. REVIEW BOUNDARIES
- Max iterations: 7
- Completed iterations: 5
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-codex-1-1780595350529-v1hlrq, parentSessionId=null, generation=1, lineageMode=new
- Severity threshold: P2
- Verdict: CONDITIONAL
