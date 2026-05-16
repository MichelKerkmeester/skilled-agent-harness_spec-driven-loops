# Deep Review Iteration 005 - Traceability Pass

Session: `2026-05-07T17:08:57Z`
Generation: `1`
Lineage mode: `new`
Dimension: traceability
Focus: smart-router validator, advisor state path, sk-deep dead refs, 4-runtime mirror parity, cross-reference integrity
Verdict: **FAIL**

## Scope Reviewed

- `.opencode/skills/system-spec-kit/scripts/spec/check-smart-router.sh`
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py`
- `.opencode/commands/doctor/scripts/audit_descriptions.py`
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/freshness/generation.ts`
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-rebuild.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts`
- `.opencode/agents/`, `.claude/agents/`, `.gemini/agents/`, `.codex/agents/`
- `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/006-skill-advisor-python/`
- `sk-deep-*` references across live commands and runtime agent mirrors
- `.opencode/skills/sk-code-review/references/review_core.md`

`review_core.md` was loaded before severity calls. Its P1 standard covers required gate failures and traceability mismatches where checked-in evidence does not support the claimed runtime behavior.

## Findings

### P1-020 [P1] `audit_descriptions.py` still passes the zero-inventory stub case that 098/006 requires to fail

- File: `.opencode/commands/doctor/scripts/audit_descriptions.py:155`
- Evidence: The 098/006 spec requires `python3 audit_descriptions.py` on a stub repo without expected dirs to exit non-zero at `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/006-skill-advisor-python/spec.md:98`. The live implementation returns an empty list when `.opencode/skills` is absent at lines 155-159, and a read-only smoke from `/private/tmp` exited 0 with `Items audited: 0`. The same zero-coverage guard is explicitly deferred in the implementation summary at lines 127-139, despite being in the phase scope at spec line 71.
- Finding class: matrix/evidence
- Scope proof: `python3 .opencode/commands/doctor/scripts/audit_descriptions.py` in the repo audits 51 items, but the same script run from `/private/tmp` exits 0 with zero items. This proves the plural path works in the happy path while the required fail-closed stub behavior is absent.
- Recommendation: Add a non-zero exit when all three inventories are empty, and wire the 098/006 checklist evidence to that smoke. If zero inventory is intentionally allowed in some mode, make it an explicit flag so CI/default audit remains fail-closed.
- Claim: The phase accepted a deferred zero-coverage guard even though REQ-003 makes the guard required for completion.
- EvidenceRefs: `.opencode/commands/doctor/scripts/audit_descriptions.py:155`, `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/006-skill-advisor-python/spec.md:98`, `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/006-skill-advisor-python/implementation-summary.md:127`, `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/003-remediation/006-skill-advisor-python/checklist.md:48`
- Counterevidence sought: a CLI flag or wrapper used by the acceptance test that converts zero audited items into a non-zero exit, or an updated spec/checklist downgrading REQ-003.
- Alternative explanation: The implementation may have treated zero-coverage failure as advisory after narrowing scope. The spec and success criteria still list it as required, so traceability remains failed.
- Final severity: P1
- Confidence: high
- Downgrade trigger: Either implement the default non-zero zero-inventory guard and capture evidence, or update the spec/checklist to explicitly remove REQ-003 before claiming the phase resolved it.

### P1-021 [P1] Smart-router validation false-fails valid shared CLI router references

- File: `.opencode/skills/system-spec-kit/scripts/spec/check-smart-router.sh:260`
- Evidence: The validator now scans 16 top-level skills and fails on zero scanned skills at lines 280-286 and 343-353, so P1-013's vacuous-scan bug is resolved. However, a repo-root run of `check-smart-router.sh --json` exits 1 because it reports `references/cli/shared_smart_router.md` and `references/cli/memory_handback.md` missing for all four CLI skills. Those CLI skill links point to `../system-spec-kit/references/cli/...`, and both target files exist under `.opencode/skills/system-spec-kit/references/cli/`. The failure comes from the validator extracting only the `references/...` suffix and checking it under each CLI skill directory at lines 260-263.
- Finding class: cross-consumer
- Scope proof: `rg -n "references/cli/(memory_handback|shared_smart_router)\\.md" .opencode/skills/cli-*/SKILL.md` finds the same shared references in `cli-claude-code`, `cli-codex`, `cli-gemini`, and `cli-opencode`; `test -f` confirms both shared files exist under `system-spec-kit/references/cli/`.
- Recommendation: Teach `check-smart-router.sh` to resolve markdown links with `..` segments before deciding locality, or declare shared resources through an explicit allowlist/schema. The check should continue failing missing local resources and zero coverage, but it should not fail valid cross-skill shared references.
- Claim: The validator's hard failure is no longer a real missing-resource signal for the CLI shared-router docs.
- EvidenceRefs: `.opencode/skills/system-spec-kit/scripts/spec/check-smart-router.sh:70`, `.opencode/skills/system-spec-kit/scripts/spec/check-smart-router.sh:260`, `.opencode/skills/cli-codex/SKILL.md:400`, `.opencode/skills/cli-claude-code/SKILL.md:392`, `.opencode/skills/system-spec-kit/references/cli/shared_smart_router.md`, `.opencode/skills/system-spec-kit/references/cli/memory_handback.md`
- Counterevidence sought: a documented contract requiring every referenced `references/*.md` path to be physically duplicated inside the referring skill, or a CI invocation that excludes cross-skill shared references before running the validator.
- Alternative explanation: The CLI skills may be intentionally depending on local copies that were never created. The actual checked-in links point at `system-spec-kit`, so the current validator still disagrees with the authored reference model.
- Final severity: P1
- Confidence: high
- Downgrade trigger: Add cross-skill resolution support or local copies with updated links, then show `check-smart-router.sh --json` exits 0 while the zero-skill-root smoke still exits 1.

## Carried / Strengthened Findings

- **P1-015 still active, strengthened**: `skill_graph_scan` still defaults to `.opencode/skill` at `.opencode/skills/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts:40`, and this pass found another live writer: `advisor_rebuild` indexes `resolve(workspaceRoot, '.opencode', 'skill')` at `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-rebuild.ts:84`. Tests assert the singular path at `.opencode/skills/system-spec-kit/mcp_server/tests/advisor-rebuild.vitest.ts:86` and `:148`, while the feature catalog still says rebuild indexes `.opencode/skill` at `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/feature_catalog/06--mcp-surface/05-advisor-rebuild.md:25`.
- **P1-016 still active**: generated `scripts/dist` singular references remain unresolved from iteration 003.
- **P1-017 still active**: sampled mirror parity remains failed. For five sampled agents, body drift persists beyond runtime-specific frontmatter: `@code` differs on router wording between `.opencode/agents/code.md:179` and `.claude/agents/code.md:179`; `@review` is `ROUTING SCAN` in `.opencode/agents/review.md:70` but `CAPABILITY SCAN` in `.claude/agents/review.md:70`; `@orchestrate` dispatches implementation to `@code` in `.opencode/agents/orchestrate.md:100` but to `@general` in `.claude/agents/orchestrate.md:100`, `.gemini/agents/orchestrate.md:89`, and `.codex/agents/orchestrate.toml:91`.
- **P1-018 still active**: owning skill files still do not link the new 093 playbooks.
- **P1-019 still active**: no traceability evidence in this pass showed the deep-review `spec_folder` interpolation issue was fixed.
- **P2-004 still active**: the Copilot helper/export drift remains covered by iteration 004.

## Checks Without New Findings

- Smart-router zero coverage: **pass**. Running the validator from `/private/tmp` scans zero skills and exits 1.
- Smart-router plural root: **pass**. `find .opencode/skills -mindepth 2 -maxdepth 2 -name SKILL.md | wc -l` reports 16, and the validator scans 16 top-level skills before hitting the cross-skill false failure.
- `skill_advisor.py` plural discovery: **pass**. `--health` reports `skills_dir` as `.opencode/skills`, `skills_dir_exists: true`, and inventory parity in sync.
- Generation path: **pass for the source writer**. `generation.ts:12` writes `.opencode/skills/.advisor-state/skill-graph-generation.json`.
- Root singular directory: **pass narrowly**. `test -d .opencode/skill` returns absent at repo root. Broader `find .opencode -path '*/.opencode/skill*'` still finds nested singular fixtures/data under specs and skill subtrees, so a root-only check is insufficient as a regression guard.
- `sk-deep-*` live sweep: **pass**. `rg "sk-deep-(review|research)" .opencode/commands .opencode/agents .codex/agents .gemini/agents .claude/agents` returns no live command or agent hits. Hits under `.opencode/specs/system-spec-kit/` are historical corpus/review data, not live command or runtime-agent references.
- Install guides: **no finding**. No `install_guides/` files were present under `.opencode/skills`, so the requested stale singular install-guide spot-check had no live surface to inspect.
- 094 RCAF naturalization: **mixed, no new finding**. The live sk-doc templates now direct natural-human prompts by default with an RCAF exception for AI-orchestrator cases, but 094 planning docs still contain historical singular-path wording. That is packet-history drift, not a live capability failure in this pass.

## Traceability Checks

| Check | Result | Evidence |
|---|---|---|
| spec_code | fail | P1-020 violates 098/006 REQ-003; P1-015 remains active for singular advisor rebuild/skill graph defaults. |
| checklist_evidence | fail | 098/006 checklist remains unchecked with pending evidence, and the required stub smoke exits 0 instead of non-zero. |
| skill_agent | pass | `deep-review` and `review_core.md` were loaded for this pass. |
| agent_cross_runtime | fail | P1-017 remains active; sampled body drift persists for `@code`, `@review`, `@orchestrate`, and minor drift exists in `@debug` / `@deep-review`. |
| feature_catalog_code | fail | Advisor rebuild catalog says `.opencode/skill`, matching live code but contradicting the plural migration contract. |
| playbook_capability | mixed | No install-guide surface exists; prior playbook reachability issue P1-018 remains active. |

## Coverage and Ratio

- Prior active findings entering this pass: P0=0, P1=6, P2=4.
- New findings this iteration: P1-020, P1-021.
- Current active/carry-forward findings after this pass: P0=0, P1=8, P2=4.
- New findings ratio: 2 / 12 = 0.1667.
- Dimension coverage: inventory, correctness, security, traceability (4/5). Maintainability remains.
- Coverage age: 0.

## Provisional Verdict

**FAIL**. The earlier smart-router zero-scan and `skill_advisor.py` native path fixes are partially real, but traceability still fails on two required gates: the Python description audit accepts the zero-inventory case that 098/006 requires to fail, and the smart-router validator now hard-fails valid cross-skill shared references. Existing agent mirror drift and singular advisor rebuild defaults remain active.
