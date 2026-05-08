# Deep Review Iteration 007 - Maintainability Pass

Session: `2026-05-07T17:08:57Z`
Generation: `1`
Lineage mode: `new`
Dimension: maintainability
Focus: doc anchors, narrative repair quality, narrative casualties from sed, deferred items
Verdict: **FAIL**

## Scope Reviewed

- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/003-narrative-validation-repair/`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/{004,005,007}/implementation-summary.md`
- `.opencode/skills/system-spec-kit/templates/manifest/*.tmpl`
- `.opencode/skills/sk-doc/assets/testing_playbook/*`
- `.opencode/skills/sk-doc/references/specific/manual_testing_playbook_creation.md`
- `.opencode/skills/cli-{opencode,codex,claude-code,gemini}/SKILL.md`
- `.opencode/skills/sk-code-review/references/review_core.md`

`review_core.md` was loaded before severity calls. Its P1 standard fits machine-readable spec-doc failures and release-gate evidence that becomes invisible to resume/continuity consumers. Stale prose with no direct behavioral break stays P2.

## Findings

### P1-022 [P1] 096 phase 004 spec has mismatched anchors and fails strict validation

- File: `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/004-symlinks/spec.md:140`
- Evidence: The spec opens `<!-- ANCHOR:questions -->` at line 136, then opens `<!-- ANCHOR:nfr -->` at line 140 before closing `questions`. It closes a never-opened `<!-- /ANCHOR:reliability -->` at line 151, closes `nfr` at line 152, and only closes `questions` at line 189. A direct strict validator run against this spec folder exits 2 with `ANCHORS_VALID: 1 template anchors issue(s)` and `SPEC_DOC_SUFFICIENCY: 3 spec_doc_sufficiency issue(s)`.
- Finding class: matrix/evidence
- Scope proof: A scripted anchor balance check across 42 sampled 096, 098/003, and system-spec-kit template files found this as the only mismatch. The manifest template anchors sampled cleanly, so this is an instance in 096/004 rather than a template-wide anchor corruption.
- Recommendation: Repair the 096/004 anchor block by closing or removing the empty `questions` anchor before `nfr`, replacing the stray `reliability` closer with the correct anchor structure, then rerun `validate.sh .../096-rename-opencode-dirs-to-plural/004-symlinks --strict`.

Claim adjudication:

- Claim: 096/004 is not maintainable as a valid spec document because machine-readable anchors are malformed.
- Evidence refs: `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/004-symlinks/spec.md:136`, `:140`, `:151`, `:152`, `:189`; strict validation exit 2.
- Counterevidence sought: Checked 42 related markdown/template files for balanced anchors and ran the official strict validator for the affected spec folder.
- Alternative explanation: This could be harmless prose if no tooling consumed anchors. The official validator does consume them and fails, so the impact is real.
- Final severity: P1.
- Confidence: high.
- Downgrade trigger: If validator logic is intentionally changed to ignore nested/mismatched anchors and the spec folder validates strictly, downgrade to P2 documentation cleanup.

### P1-023 [P1] Deferred findings are omitted from `_memory.continuity.blockers`

- File: `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/005-checklist-evidence/implementation-summary.md:16`
- Evidence: Phase 005 marks `blockers: []` while the same summary says line-by-line CHK evidence is still not backfilled and only deferred for future audit at lines 125 and 144. The same pattern appears in 098/004, where `blockers: []` coexists with deferred P1-005 realpath containment at lines 117 and 135, and in 098/007, where `blockers: []` coexists with unresolved P2-004 location audit at lines 129 and 148.
- Finding class: cross-consumer
- Scope proof: The three deferred-item focus packets in this iteration all show narrative follow-ups but empty continuity blockers: 098/004, 098/005, and 098/007. This is not a single missed line.
- Recommendation: Populate `_memory.continuity.blockers` or an equivalent machine-readable follow-on field for deferred items, especially P1-007 and unresolved P2-004. If an item is intentionally advisory, record that status explicitly so resume and memory consumers do not treat the packet as unconditionally clean.

Claim adjudication:

- Claim: Deferred work is human-readable but not carried by the continuity surface that the resume/memory workflow reads first.
- Evidence refs: `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/004-hooks-resolver-tighten/implementation-summary.md:16`, `:117`, `:135`; `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/005-checklist-evidence/implementation-summary.md:16`, `:125`, `:144`; `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/007-p2-doc-drift/implementation-summary.md:16`, `:129`, `:148`.
- Counterevidence sought: Checked the same files' limitations, deviations, and followups sections for alternate surfacing. They exist in prose, but not in `_memory.continuity.blockers`.
- Alternative explanation: `blockers` may be intended only for work that blocks the next phase. That does not hold for P1-007, which remains active in the re-review state and affects the release verdict.
- Final severity: P1.
- Confidence: high.
- Downgrade trigger: If the continuity schema defines `blockers` as phase-local only and another indexed machine-readable field is shown to carry these follow-ons, downgrade to P2.

### P2-010 [P2] 096 resource-map still contains sed-induced tautological rename headings

- File: `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/resource-map.md:20`
- Evidence: The resource map still says `Phase 001 - Skills (.opencode/skills/ -> .opencode/skills/)`, with equivalent tautologies for agents at line 75 and commands at line 122. This is the exact class of source-to-target narrative casualty that 098/003 describes at `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/003-narrative-validation-repair/implementation-summary.md:60`, but 098/003 only repaired selected spec/description files and explicitly says the sed audit was not exhaustive at line 125.
- Finding class: matrix/evidence
- Scope proof: The affected file is a resource-map artifact, not one of the spec/description files listed in 098/003's repaired-files table. Symlink rows at `resource-map.md:167-170` still preserve old/new target distinction, so the file contains enough context to repair the headings.
- Recommendation: Restore singular-to-plural headings in `resource-map.md` for skills, agents, and commands, or annotate that the headings describe post-rename state rather than source-to-target migration.

## Checks Without New Findings

- **Template anchor health passes in sampled manifest templates**: The 42-file anchor script included `.opencode/skills/system-spec-kit/templates/manifest/*.tmpl`; no manifest-template mismatches appeared.
- **098/003 repaired some narrative casualties cleanly**: The implementation summary lists restored singular-to-plural arrows for 096 child specs and descriptions, and sampled child specs now have correct old/new wording. The remaining issue is the un-repaired resource map, not evidence that the fix made those edited files worse.
- **RCAF template hygiene passes on current paths**: The prompt pack's `sk-doc/assets/templates` path is stale, but the actual 094 spec points at `.opencode/skills/sk-doc/assets/testing_playbook/manual_testing_playbook_template.md` and `manual_testing_playbook_snippet_template.md`. Those files now describe natural-human prompt voice by default with RCAF as the orchestrator exception, and `manual_testing_playbook_creation.md:148-171` documents the same rule.
- **Cross-CLI memory handback consistency remains mixed from prior findings, not newly worse here**: All four CLI skills point to the shared `system-spec-kit/references/cli/memory_handback.md` and `shared_smart_router.md` resources. P1-021 remains the validator-resolution problem, not missing authored targets.

## Deferred Item Hygiene

| Deferred item | Human-readable surfacing | Machine-readable continuity | Result |
|---|---|---|---|
| P1-005 resolver containment | 098/004 limitations and followups | `blockers: []` | fail |
| P1-007 checklist evidence | 098/005 limitations and followups | `blockers: []` | fail |
| P2-004 Copilot target-authority location audit | 098/007 limitations and followups | `blockers: []` | fail |

This is the maintainability risk: the documents are honest for a reader already inside the file, but the resume ladder and memory continuity path will report a clean blocker state.

## Traceability Checks

| Check | Result | Evidence |
|---|---|---|
| spec_code | fail | P1-022 adds a strict-validation failure; prior P1s remain active. |
| checklist_evidence | fail | P1-007 remains active and P1-023 shows the deferral is not carried in continuity blockers. |
| skill_agent | mixed | `deep-review` and `review_core.md` were loaded; the canonical command loop was represented by the provided prompt pack rather than invoked directly in this executor. |
| agent_cross_runtime | fail | P1-017/P1-021 remain active from earlier runtime parity and validator-resolution checks. |
| feature_catalog_code | fail | P1-015 remains active from iteration 005. |
| playbook_capability | mixed | RCAF sk-doc templates are self-consistent; P1-018 playbook reachability remains active from iteration 006. |
| anchor_health | fail | 096/004 strict validation fails on anchors. |
| narrative_repair | mixed | Edited spec narratives are improved, but `resource-map.md` still has tautological rename headings. |
| deferred_continuity | fail | 098/004, 098/005, and 098/007 prose deferrals are not mirrored in `_memory.continuity.blockers`. |

## Coverage and Ratio

- Prior active findings entering this pass: P0=0, P1=8, P2=5.
- New findings this iteration: P1-022, P1-023, P2-010.
- Current active/carry-forward findings after this pass: P0=0, P1=10, P2=6.
- New findings ratio: 3 / 16 = 0.1875.
- Dimension coverage: inventory, correctness, security, traceability, maintainability (5/5).
- Coverage age: 0.

## Provisional Verdict

**FAIL**. Maintainability is not clean: one 096 child spec fails strict validation, three deferred follow-ons are missing from continuity blockers, and the 096 resource map still contains sed-induced tautological rename prose. RCAF templates and authored cross-CLI shared-resource links look stable in this pass, but they do not offset the new P1s.
