# Deep Review Iteration 006 - Traceability Resource-Map Pass

Session: `2026-05-07T17:08:57Z`
Generation: `1`
Lineage mode: `new`
Dimension: traceability
Focus: 098 sub-phase target-file traceability, cross-CLI `memory_handback.md`, install-guide drift, playbook reachability
Verdict: **FAIL**

## Scope Reviewed

- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/*/implementation-summary.md`
- `.opencode/skills/system-spec-kit/scripts/spec/check-smart-router.sh`
- `.opencode/skills/cli-*/SKILL.md`
- `.opencode/skills/system-spec-kit/references/cli/memory_handback.md`
- `.opencode/skills/system-spec-kit/references/cli/shared_smart_router.md`
- `.opencode/install_guides/`
- `.opencode/skills/sk-code-review/SKILL.md`
- `.opencode/skills/sk-git/SKILL.md`
- `.opencode/skills/sk-code-review/manual_testing_playbook/`
- `.opencode/skills/sk-git/manual_testing_playbook/`
- `.opencode/specs/system-spec-kit/`
- `.opencode/skills/sk-code-review/references/review_core.md`

`review_core.md` was loaded before severity calls. Its P2 standard fits stale documentary evidence where the behavior still exists but the cited location no longer supports a resource-map entry.

## Findings

### P2-009 [P2] 098/003 target-file evidence cites a stale smart-router line range

- File: `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/003-narrative-validation-repair/implementation-summary.md:76`
- Evidence: The summary says the zero-coverage failure was added at `check-smart-router.sh:386-394`. The current implementation has no lines 386-394; the script ends at line 357, and the zero-coverage failure now lives at `.opencode/skills/system-spec-kit/scripts/spec/check-smart-router.sh:343-353`. The behavior is present, so this is not a functional miss. It is a stale traceability citation that would seed a wrong resource-map entry.
- Finding class: matrix/evidence
- Scope proof: The same summary's `SKILL_ROOT` citation at `:68` still matches the current script, and other sampled 098 target-file claims resolve. This is an isolated stale line-range problem in 098/003.
- Recommendation: Update 098/003 implementation-summary target-file row to cite `check-smart-router.sh:343-353`, or remove exact line ranges from resource-map seed data when summaries are not maintained as live evidence.

## Carried / Strengthened Findings

- **P1-018 still active, strengthened**: Both playbook roots exist under `.opencode/skills/sk-code-review/manual_testing_playbook/` and `.opencode/skills/sk-git/manual_testing_playbook/`, but `rg "manual_testing_playbook" .opencode/skills/sk-code-review/SKILL.md .opencode/skills/sk-git/SKILL.md` returns no hits. The new 093 playbooks remain unreachable from their owning skill files.
- **P1-021 still active, clarified**: The authored cross-CLI `memory_handback.md` and `shared_smart_router.md` links resolve to real files under `.opencode/skills/system-spec-kit/references/cli/`. The failure remains in `check-smart-router.sh:260-263`, which strips the linked parent path down to a local `references/...` path and therefore false-fails valid shared references.
- **P1-007 still active**: 098/005 added honest deferral notes, but sampled checklist items remain unchecked at `.opencode/specs/skilled-agent-orchestration/093-testing-playbooks-code-review-and-git/001-sk-code-review-playbook/checklist.md:106-118`. The evidence gap is disclosed, not backfilled.
- **P1-020 still active**: 098/006 moved `audit_descriptions.py` to plural paths, but the scanned implementation still returns an empty item list when `.opencode/skills` is missing at `.opencode/commands/doctor/scripts/audit_descriptions.py:155-159`; the zero-inventory fail-closed guard remains absent.
- **P1-015, P1-016, P1-017, P1-019** were not the primary target of this pass and remain carried from iteration 005.
- **P1-005, P2-002, P2-004, P2-008** remain carried with no downgrade evidence found in this pass.

## Checks Without New P1 Findings

- **098/001 target files pass**: The regex literal at `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/hooks/settings-driven-invocation-parity.vitest.ts:185` is correctly escaped, and dist scope globs use plural roots at `.opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:13-16`.
- **098/002 target files pass**: `spec_kit_deep-review_auto.yaml:57` points at `.opencode/skills/deep-review/SKILL.md`; `.codex/agents/review.toml:400-405` contains the canonical "Never block without severity evidence" block.
- **098/003 target files mixed**: The smart-router `SKILL_ROOT` fix is present at `check-smart-router.sh:68`, and zero-coverage fail-closed behavior is present at `:343-353`; the implementation summary's `:386-394` citation is stale.
- **098/004 target files pass**: `session-stop.ts:38-50` and dist `session-stop.js:28-43` both gate `SPECKIT_GENERATE_CONTEXT_SCRIPT` to test mode.
- **098/005 target files mixed**: The deferral note exists at checklist lines 135-147, and the 093 supersession notice exists at spec lines 142-155. This resolves documentation honesty, not the underlying line-by-line checklist evidence gap.
- **098/006 target files mixed**: Plural path edits are present in `generation.ts:12`, `audit_descriptions.py:47`, `:157`, `:185`, `:220`, and `skill_advisor.py:56-84`; `.opencode/skill/` is absent. The zero-coverage guard remains absent, as recorded in P1-020.
- **098/007 install guides pass**: `rg "(\.opencode/skill/|sk-deep-(review|research))" .opencode/install_guides/` returns no hits.
- **Cross-CLI memory handback links pass as authored links**: All four `cli-*` skill references point to `../system-spec-kit/references/cli/memory_handback.md`, and the target file exists. No `.codex`, `.gemini`, or `.claude` runtime mirror references were found in the live skill-link sweep.
- **System-spec-kit legacy `sk-deep-*` references are mixed historical data**: Active spec docs and scratch/research packets still contain many `sk-deep-*` mentions, but the sampled hits are historical packet records, research prompts, or changelog narratives rather than live command, agent, or install-guide surfaces. No new required fix is raised from this pass.

## Resource-Map Seed Outline

| 098 Phase | Claimed Target Universe | Spot-Check Result | Resource-Map Status |
|---|---|---|---|
| 001 dist rebuild | parity vitest, generated `dist/code_graph/lib/index-scope-policy.js` | Claims resolve; sampled lines match current files | include as verified |
| 002 token replacement | deep-loop command YAMLs, `.opencode/agents/*`, `.codex/agents/review.toml`, install guide | Sampled command YAML and codex review doctrine match; install guides clean | include as verified |
| 003 narrative validation repair | 096 specs/descriptions, `check-smart-router.sh` | Behavior present; one stale line-range citation | include with corrected line range |
| 004 hooks resolver tighten | `session-stop.ts`, dist `session-stop.js` | Test-only env gate present in source and dist | include as verified |
| 005 checklist evidence | 7 checklist files, 093 parent spec | Deferral and supersession notes present; checklist evidence still not backfilled | include as documentary deferral |
| 006 skill advisor Python | generation path, dist generation, `audit_descriptions.py`, `skill_advisor.py`, deleted `.opencode/skill/` | Plural path claims match; zero-coverage guard still absent | include with P1-020 caveat |
| 007 P2 doc drift | 5 install guides | Stale install-guide patterns now absent | include as verified |

## Traceability Checks

| Check | Result | Evidence |
|---|---|---|
| spec_code | fail | P1-015, P1-019, P1-020 remain active. |
| checklist_evidence | fail | P1-007 remains active; 098/005 disclosed the gap rather than backfilling evidence. |
| skill_agent | pass | `deep-review` and `review_core.md` were loaded for this pass. |
| agent_cross_runtime | fail | P1-017 remains active from prior mirror parity checks. |
| feature_catalog_code | fail | P1-015 feature-catalog/code drift remains active from iteration 005. |
| playbook_capability | fail | P1-018 strengthened; playbooks exist but owning `SKILL.md` files do not link them. |
| memory_handback_refs | pass | Authored `../system-spec-kit/references/cli/memory_handback.md` links resolve to a real shared file. |
| install_guides_sk_deep | pass | No `.opencode/skill/` or `sk-deep-*` hits remain in `.opencode/install_guides/`. |
| target_files_traceability | mixed | Most sampled target-file claims match; 098/003 has a stale smart-router line range. |

## Coverage and Ratio

- Prior active findings entering this pass: P0=0, P1=8, P2=4.
- New findings this iteration: P2-009.
- Current active/carry-forward findings after this pass: P0=0, P1=8, P2=5.
- New findings ratio: 1 / 13 = 0.0769.
- Dimension coverage: inventory, correctness, security, traceability (4/5). Maintainability remains.
- Coverage age: 0.

## Provisional Verdict

**FAIL**. The install-guide and authored `memory_handback.md` link surfaces are clean, and most 098 target-file claims resolve. Traceability still fails because core P1s remain active, the new 093 playbooks are not linked from owning skills, and the resource-map seed has at least one stale target-file line citation.
