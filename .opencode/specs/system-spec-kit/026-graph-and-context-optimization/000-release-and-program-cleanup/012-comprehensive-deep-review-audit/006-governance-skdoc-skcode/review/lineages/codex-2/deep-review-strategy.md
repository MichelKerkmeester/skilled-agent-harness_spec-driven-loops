# Deep Review Strategy

## Topic

Governance + sk-doc + sk-code drift review slice.

## Review Dimensions

| Dimension | Status | Iteration | Result |
| --- | --- | ---: | --- |
| Correctness | complete | 1 | P1 enforcement gap in comment-hygiene regex coverage. |
| Security | complete | 2 | P1 governance bypass via broad `hygiene-ok` suppression. |
| Traceability | complete | 3 | P1 contradiction between constitutional tool routing and AGENTS code-search rules. |
| Maintainability | complete | 4 | P1 sk-doc command contract drift; P2 sk-code verification severity drift. |

## Completed Dimensions

- correctness: complete with active P1 F001.
- security: complete with active P1 F002.
- traceability: complete with active P1 F003 and core traceability partial.
- maintainability: complete with active P1 F004 and P2 F005.
- stabilization: iteration 5 found no new P0/P1/P2 findings.

## Running Findings

| Severity | Active | New In Last Iteration |
| --- | ---: | ---: |
| P0 | 0 | 0 |
| P1 | 4 | 0 |
| P2 | 1 | 0 |

## What Worked

- Direct comparison of constitutional prose to executable regexes found concrete enforcement gaps.
- Cross-checking sk-doc prose, JSON rules, and validator code exposed incompatible command contracts.
- Treating Code Graph as unavailable forced a useful fallback audit against AGENTS.md and constitutional routing.

## What Failed

- No resource-map coverage pass was possible because the target spec folder has no `resource-map.md`.
- No checklist evidence pass was possible because this level-1 review packet has no `checklist.md`.
- No external `cli-codex` dispatch was used because Codex self-invocation is explicitly refused by the cli-codex skill.

## Exhausted Approaches

- Resource-map coverage: not applicable at init.
- Checklist evidence audit: no checklist file exists in the target packet.
- Code Graph structural query: unavailable in session context; used Grep/Glob plus direct reads.

## Ruled-Out Directions

- P0 escalation for the comment-hygiene checker was ruled out because the rule still has partial pre-commit/CI enforcement and the gap is remediable without architectural replacement.
- P1 escalation for F005 was ruled out because the sk-code alignment reference explicitly documents warning-only default behavior, making the issue a contract clarity drift rather than a hidden runtime bug.

## Cross-Reference Status

| Protocol | Gate | Status | Evidence |
| --- | --- | --- | --- |
| spec_code | hard | partial | Spec asks for constitutional/sk-doc/sk-code drift; F001-F005 satisfy that, but active P1 drift remains. |
| checklist_evidence | hard | pass by absence | No `checklist.md` exists in the level-1 target packet. |
| feature_catalog_code | advisory | partial | Not all reviewed standards have feature-catalog coverage in scope. |
| playbook_capability | advisory | partial | Playbook scenarios were sampled through available manual-testing references only. |

## Files Under Review

| File | Coverage | Notes |
| --- | --- | --- |
| `.opencode/skills/system-spec-kit/constitutional/comment-hygiene.md` | complete | Compared rule text to checker and hook behavior. |
| `.opencode/skills/system-spec-kit/constitutional/gate-tool-routing.md` | complete | Compared routing fallback to AGENTS.md code-search rules. |
| `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh` | complete | Regex and suppression branch reviewed. |
| `.opencode/hooks/pre-commit` | sampled | Reviewed as enforcement surface for constitutional comment hygiene. |
| `.github/workflows/comment-hygiene.yml` | sampled | Reviewed as PR enforcement surface. |
| `.opencode/skills/sk-doc/SKILL.md` | sampled | Router and validation promises reviewed. |
| `.opencode/skills/sk-doc/references/global/core_standards.md` | complete | Command-section requirements compared. |
| `.opencode/skills/sk-doc/references/global/quick_reference.md` | complete | Command-section requirements compared. |
| `.opencode/skills/sk-doc/assets/template_rules.json` | complete | Machine required sections compared. |
| `.opencode/skills/sk-doc/scripts/validate_document.py` | complete | Required-section validator path reviewed. |
| `.opencode/skills/sk-code/SKILL.md` | complete | Verification command contract reviewed. |
| `.opencode/skills/sk-code/assets/opencode/checklists/universal_checklist.md` | complete | P0/P1/P2 checklist wording reviewed. |
| `.opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py` | complete | Severity and exit behavior reviewed. |
| `.opencode/skills/sk-code/assets/scripts/test_verify_alignment_drift.py` | complete | Warning-only zero-exit behavior confirmed by test. |

## Known Context

- User supplied an explicit fan-out lineage artifact directory and instructed not to run the artifact-root resolver.
- Code Graph is unavailable in the session context, so direct Grep/Glob plus file reads were used for concept discovery.
- `resource-map.md` was not present in the target spec folder at init; resource-map coverage gate was skipped.

## Next Focus

Synthesis complete. Remediation should address F001-F004 before release readiness can become PASS.

## Review Boundaries

- Review target is read-only.
- Output writes are restricted to `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/006-governance-skdoc-skcode/review/lineages/codex-2`.
- Max iterations: 7. Executed iterations: 5.
- Convergence threshold: 0.10.
- Session lineage: sessionId=fanout-codex-2-1780595350529-qmzg9f, parentSessionId=null, generation=1, lineageMode=new.
