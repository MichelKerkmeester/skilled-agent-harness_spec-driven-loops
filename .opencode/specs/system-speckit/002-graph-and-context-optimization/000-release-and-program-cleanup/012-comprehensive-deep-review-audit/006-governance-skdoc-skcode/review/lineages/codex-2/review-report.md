# Review Report

## 1. Executive Summary

Verdict: CONDITIONAL.

This lineage found no P0 blockers, but it found four active P1 governance/standards drift issues and one P2 advisory. The release slice should not be treated as PASS until the P1s are remediated or explicitly accepted.

| Severity | Active |
| --- | ---: |
| P0 | 0 |
| P1 | 4 |
| P2 | 1 |

Scope reviewed: constitutional governance rules, comment-hygiene enforcement, sk-doc command validation contracts, sk-code verification/checklist contracts, and the target level-1 spec. `hasAdvisories=true`.

## 2. Planning Trigger

Plan remediation for the four active P1 findings:

- F001 and F002 belong together as comment-hygiene enforcement alignment.
- F003 is a constitutional routing correction.
- F004 is a sk-doc command validation contract cleanup.

F005 can be handled as a P2 wording/contract clarification unless the team wants warning-only alignment verifier findings to block by default.

## 3. Active Finding Registry

### F001 - P1 - Comment-hygiene checker misses several exact forbidden examples from the constitutional rule

Evidence: the constitutional rule forbids broad ephemeral identifiers in comments [SOURCE: .opencode/skills/system-spec-kit/constitutional/comment-hygiene.md:34], including root spec paths [SOURCE: .opencode/skills/system-spec-kit/constitutional/comment-hygiene.md:42], bare requirement/checklist ids [SOURCE: .opencode/skills/system-spec-kit/constitutional/comment-hygiene.md:45], bare task ids [SOURCE: .opencode/skills/system-spec-kit/constitutional/comment-hygiene.md:46], and finding ids [SOURCE: .opencode/skills/system-spec-kit/constitutional/comment-hygiene.md:47]. The checker only matches narrower `REQ-\d+[-:]`, `CHK-\d+[-:]`, `T\d{3,4}[-/]`, nested spec paths, and `review finding` [SOURCE: .opencode/skills/sk-code/scripts/check-comment-hygiene.sh:87] [SOURCE: .opencode/skills/sk-code/scripts/check-comment-hygiene.sh:88] [SOURCE: .opencode/skills/sk-code/scripts/check-comment-hygiene.sh:90] [SOURCE: .opencode/skills/sk-code/scripts/check-comment-hygiene.sh:93] [SOURCE: .opencode/skills/sk-code/scripts/check-comment-hygiene.sh:96].

Fix: add regex/test coverage for the constitutional table's exact forbidden examples.

### F002 - P1 - The hygiene-ok escape broadly bypasses an unconditional constitutional comment rule

Evidence: the rule says never embed ephemeral pointers [SOURCE: .opencode/skills/system-spec-kit/constitutional/comment-hygiene.md:34] and requires documented override only for `--no-verify` bypass [SOURCE: .opencode/skills/system-spec-kit/constitutional/comment-hygiene.md:71]. The checker suppresses any line containing `hygiene-ok` [SOURCE: .opencode/skills/sk-code/scripts/check-comment-hygiene.sh:108], documents that escape [SOURCE: .opencode/skills/sk-code/scripts/check-comment-hygiene.sh:12], and the pre-commit/checklist surfaces advertise it [SOURCE: .opencode/hooks/pre-commit:32] [SOURCE: .opencode/skills/sk-code/assets/opencode/checklists/universal_checklist.md:253].

Fix: remove the blanket escape or define and enforce a narrow audited exception in the constitutional rule.

### F003 - P1 - Semantic code-search routing falls back to memory_search even though memory does not index arbitrary code

Evidence: the constitutional routing table sends semantic/concept code-search fallback to `memory_search` [SOURCE: .opencode/skills/system-spec-kit/constitutional/gate-tool-routing.md:41]. AGENTS.md sends concept code search to Code Graph plus Grep [SOURCE: AGENTS.md:89] [SOURCE: AGENTS.md:90] and states that `memory_search` is only for spec docs, saved decisions, and memory context, not arbitrary project code [SOURCE: AGENTS.md:106].

Fix: use Grep/Glob plus direct reads as the code-search fallback when Code Graph is unavailable.

### F004 - P1 - sk-doc command requirements are split across three incompatible contracts

Evidence: `core_standards.md` says commands require INPUTS/WORKFLOW/OUTPUTS [SOURCE: .opencode/skills/sk-doc/references/global/core_standards.md:113], later says they require Purpose/Contract/Instructions/Example Usage [SOURCE: .opencode/skills/sk-doc/references/global/core_standards.md:239], and quick reference repeats the latter [SOURCE: .opencode/skills/sk-doc/references/global/quick_reference.md:125]. The machine rule requires only `purpose` and `instructions` [SOURCE: .opencode/skills/sk-doc/assets/template_rules.json:111], and the validator consumes that required list directly [SOURCE: .opencode/skills/sk-doc/scripts/validate_document.py:408].

Fix: select one command-section contract and align prose, template JSON, validator behavior, and tests.

### F005 - P2 - Default sk-code alignment verification can pass warning-only P0 checklist gaps

Evidence: sk-code requires Phase 1.5 P0/P1/P2 checks [SOURCE: .opencode/skills/sk-code/SKILL.md:41] and runs `verify_alignment_drift.py --root <changed-scope>` as the OPENCODE verification command [SOURCE: .opencode/skills/sk-code/SKILL.md:192]. The universal checklist marks headers as P0 [SOURCE: .opencode/skills/sk-code/assets/opencode/checklists/universal_checklist.md:28] and says the verifier checks marker-level headers [SOURCE: .opencode/skills/sk-code/assets/opencode/checklists/universal_checklist.md:45], but the verifier fails only ERROR findings or warnings with `--fail-on-warn` [SOURCE: .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py:456], and tests assert warning-only exit code 0 by default [SOURCE: .opencode/skills/sk-code/assets/scripts/test_verify_alignment_drift.py:120].

Fix: clarify when `--fail-on-warn` is mandatory or downgrade checklist wording to match the default verifier.

## 4. Remediation Workstreams

| Workstream | Findings | Action |
| --- | --- | --- |
| Comment hygiene enforcement | F001, F002 | Align constitutional rule, checker regexes, suppression policy, hook messages, and tests. |
| Code-search routing | F003 | Update constitutional fallback table and any derived routing docs. |
| sk-doc command contract | F004 | Normalize required command sections across prose, template JSON, validator, and tests. |
| sk-code verification wording | F005 | Clarify warning behavior or require strict mode for completion-sensitive runs. |

## 5. Spec Seed

Add remediation scope for:

- Comment-hygiene rule/checker parity.
- Tool-routing fallback correction for graph-unavailable code search.
- sk-doc command validation contract consolidation.
- sk-code verifier severity wording.

Acceptance criteria:

- Every constitutional forbidden comment example has a matching checker test.
- `hygiene-ok` policy is either removed or explicitly governed.
- Semantic code-search fallback no longer points to memory-only search.
- Command validation docs and machine rules name the same required sections.

## 6. Plan Seed

1. Patch `check-comment-hygiene.sh` and its tests to cover the constitutional forbidden table.
2. Decide whether `hygiene-ok` remains. If yes, document a narrow exception and require rationale.
3. Patch `gate-tool-routing.md` so graph-unavailable code search falls back to Grep/Glob plus Read.
4. Pick the sk-doc command section contract and update `core_standards.md`, `quick_reference.md`, `command_template.md`, `template_rules.json`, and validator tests.
5. Decide whether OPENCODE completion-sensitive verification should use `--fail-on-warn`.

## 7. Traceability Status

| Protocol | Status | Notes |
| --- | --- | --- |
| spec_code | partial | The target spec requested governance/sk-doc/sk-code drift assessment; drift was found and remains active. |
| checklist_evidence | pass by absence | No `checklist.md` exists in the level-1 target packet. |
| feature_catalog_code | partial | Feature-catalog parity was not exhaustively audited in this lineage. |
| playbook_capability | partial | Manual playbook surfaces were sampled only where they related to active drift. |

## 8. Deferred Items

- F005 is advisory unless completion-sensitive workflows depend on warning-only verifier output as a hard gate.
- `.github/workflows/comment-hygiene.yml` likely deserves a follow-up implementation review because its `set -e` handling around checker exit code capture is brittle, but this lineage did not promote it to an active finding.
- Resource-map coverage was skipped because no target `resource-map.md` existed at init.

## 9. Audit Appendix

Iterations executed: 5.

| Iteration | Dimension | New Findings | Verdict |
| ---: | --- | --- | --- |
| 1 | correctness | F001 P1 | CONDITIONAL |
| 2 | security | F002 P1 | CONDITIONAL |
| 3 | traceability | F003 P1 | CONDITIONAL |
| 4 | maintainability | F004 P1, F005 P2 | CONDITIONAL |
| 5 | stabilization | none | PASS |

Convergence replay:

- Dimension coverage: 1.0.
- Active P0: 0.
- Active P1: 4.
- Active P2: 1.
- Last newFindingsRatio: 0.0.
- Stop reason: converged.
- Final verdict: CONDITIONAL.

Executor note: `cli-codex model=gpt-5.5` was requested, but this lineage is already running in Codex and `cli-codex/SKILL.md` prohibits self-invocation. The review therefore ran directly as the Codex fan-out lineage.
