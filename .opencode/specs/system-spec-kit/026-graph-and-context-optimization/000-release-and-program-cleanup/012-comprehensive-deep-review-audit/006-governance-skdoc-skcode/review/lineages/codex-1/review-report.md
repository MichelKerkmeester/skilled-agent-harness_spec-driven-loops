---
title: Review Report - Governance + sk-doc + sk-code Drift Review Slice
description: Final synthesis for fan-out lineage codex-1.
---

# Review Report - Governance + sk-doc + sk-code Drift Review Slice

## 1. Executive Summary
Verdict: CONDITIONAL.

The review covered all four deep-review dimensions across the declared governance, sk-doc and sk-code surfaces. No P0 release blockers were confirmed. Three P1 findings remain active and require remediation before a PASS verdict. Two P2 findings are advisory, but both are close enough to the active cleanup lane that they should be fixed in the same pass if practical.

Active counts: P0=0, P1=3, P2=2. Stop reason: converged after 5 iterations with one stabilization pass and no new findings.

## 2. Planning Trigger
Plan remediation because the active P1 findings affect executable standards guidance and high-authority governance docs:

- F001 makes sk-code's documented manual comment-hygiene gate fail as written.
- F002 overstates the strength of the comment-hygiene enforcement model across write-time, commit-time, CI and direct-push paths.
- F003 can lead sk-doc to remove Spec Kit spec frontmatter that current templates and active packets rely on.

## 3. Active Finding Registry
| ID | Severity | Dimension | Title | Evidence | Status |
|----|----------|-----------|-------|----------|--------|
| F001 | P1 | correctness | Documented comment-hygiene command executes the Python checker through bash | `.opencode/skills/sk-code/SKILL.md:216`; `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh:1` | active |
| F002 | P1 | security | Comment-hygiene enforcement is documented stronger than the actual protected paths | `.opencode/skills/system-spec-kit/constitutional/comment-hygiene.md:66`; `.github/workflows/comment-hygiene.yml:2`; `.opencode/skills/system-spec-kit/constitutional/main-branch-direct-push.md:20` | active |
| F003 | P1 | traceability | sk-doc tells agents to remove spec YAML frontmatter that Spec Kit templates now require | `.opencode/skills/sk-doc/assets/frontmatter_templates.md:400`; `.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl:2` | active |
| F004 | P2 | traceability | sk-doc filename standards still require snake_case despite hyphenated shipped docs | `.opencode/skills/sk-doc/references/global/core_standards.md:31`; `.opencode/skills/sk-doc/manual_testing_playbook/06--agent-dispatch/019-markdown-agent-cli-codex.md:1` | active |
| F005 | P2 | maintainability | sk-code verifier reports Python `.sh` entrypoints as shell-style drift | `.opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py:31`; `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh:1` | active |

## 4. Remediation Workstreams
1. Comment-hygiene command and enforcement contract.
   Fix F001 by aligning the documented command with the Python implementation, or by replacing the Python script with a shell wrapper. Then fix F002 by either narrowing the guarantee to client-side plus PR CI or adding direct-push/server-side coverage.

2. sk-doc Spec Kit metadata policy.
   Fix F003 by updating `frontmatter_templates.md` and related quick references so Spec Kit packet docs preserve YAML frontmatter. Mention external informal specs separately if that rule still matters.

3. Standards cleanup advisories.
   Fix F004 by replacing the blanket snake_case Markdown filename rule with package-specific rules. Fix F005 by renaming Python `.sh` entrypoints, adding wrappers or teaching the verifier to inspect shebangs.

## 5. Spec Seed
Add remediation scope for:

- Aligning sk-code comment-hygiene command docs with executable reality.
- Reconciling constitutional comment-hygiene enforcement language with direct-push and PR-only CI behavior.
- Updating sk-doc frontmatter and filename standards to match current Spec Kit templates and shipped package layout.

Acceptance criteria:

- The documented comment-hygiene command exits 0 on a clean supported file and 1 on a violating supported file.
- Comment-hygiene governance docs accurately state which gates block, warn or can be bypassed.
- sk-doc no longer instructs agents to remove YAML frontmatter from indexed Spec Kit packet docs.
- sk-doc filename guidance no longer contradicts shipped hyphenated playbook/spec package files.

## 6. Plan Seed
1. Patch sk-code command strings in `SKILL.md`, `code_quality_standards.md` and the universal checklist.
2. Decide whether `check-comment-hygiene.sh` remains Python with direct/python3 invocation or becomes a shell wrapper.
3. Patch constitutional comment-hygiene wording and sk-code enforcement wording to distinguish write-time warnings, commit-time blocks, PR CI and direct-push behavior.
4. Patch sk-doc `frontmatter_templates.md`, `core_standards.md`, quick reference and any validation docs that still imply old spec/filename rules.
5. Run targeted verification:
   - Direct comment-hygiene clean/violating file checks.
   - `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/sk-code`
   - `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/sk-doc/README.md --json`
   - Spec validation for the remediation packet.

## 7. Traceability Status
| Protocol | Status | Gate | Summary |
|----------|--------|------|---------|
| spec_code | partial | hard | The requested drift review found active P1/P2 drift. No P0 contradictions were found. |
| checklist_evidence | pass | hard | No checklist.md exists for this Level 1 slice, so there are no unsupported checked items. |
| feature_catalog_code | partial | advisory | sk-code standards claim a manual quality command that does not execute as written. |
| playbook_capability | partial | advisory | sk-doc playbook filenames contradict older filename prose. |

## 8. Deferred Items
- F004 is advisory but should be cleaned with F003 because both live in sk-doc standards.
- F005 is advisory but should be cleaned with F001 because both share the Python `.sh` checker surface.
- The reducer script was not run because it resolves the canonical review root and would write outside the fan-out lineage override. This lineage therefore writes reducer-shaped outputs directly inside the bound artifact directory.

## 9. Audit Appendix
Iterations:

| Iteration | Focus | New P0 | New P1 | New P2 | Verdict |
|-----------|-------|-------:|-------:|-------:|---------|
| 1 | correctness | 0 | 1 | 0 | CONDITIONAL |
| 2 | security | 0 | 1 | 0 | CONDITIONAL |
| 3 | traceability | 0 | 1 | 1 | CONDITIONAL |
| 4 | maintainability | 0 | 0 | 1 | PASS |
| 5 | stabilization | 0 | 0 | 0 | PASS |

Convergence replay:

- Coverage reached 4/4 configured dimensions by iteration 4.
- Stabilization iteration 5 found zero new findings.
- Last two ratios were 0.09 and 0.00, average 0.045, below the 0.08 rolling stop threshold.
- P0 count remained 0 throughout the run.
- Final verdict remains CONDITIONAL because active P1 count is 3.
