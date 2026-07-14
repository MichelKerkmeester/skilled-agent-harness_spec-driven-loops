# Deep Review Iteration 001

## Dimension

Inventory pass. The target remained read-only and review-core severity/evidence rules were loaded before adjudication.

## Files Reviewed

The target is a phase parent with the lean trio `spec.md`, `description.json`, and `graph-metadata.json`, plus five child phases. `000-foundations/` has its Level 2 set, `lane-config.json`, and prior `alignment/` report/config/corpus/registry/state/delta/iteration/prompt artifacts. `001-command-template-conformance/` has seven files; `002-agent-canon-conformance/`, `003-codex-command-parity/`, and `004-integrate-validate-ship/` each have the seven-file set plus `decision-record.md`.

The census found 50 markdown files under `.opencode/commands/`; the generator's exclusion rules reduce this to 37 production command sources: 10 `create`, 8 `deep`, 5 `design`, 3 `doctor`, 4 `memory`, 4 `speckit`, plus `goal_opencode.md`, `prompt-improve.md`, and `agent_router.md`.

Runtime inventories are 13 `.opencode/agents/*.md`, 13 `.claude/agents/*.md`, 13 `.codex/agents/*.toml`, and 37 `.codex/prompts/*.md`. The prompt name comparison found no missing or extra mirror. The key scripts are 933 lines (`validate_document.py`), 283 lines (`sync-agents.cjs`), and 174 lines (`sync-prompts.cjs`). Agent markdowns range from 124–814 lines, Codex TOML mirrors 129–808 lines, and prompts are 12-line generated routers.

Required validator baseline: `doctor/mcp.md` exit 0 with no issues; `memory/search.md` exit 0 with no issues; `deep-review.md` exit 0 with one `non_sequential_numbering` warning (expected section 1, found 0).

## Findings by Severity

### P0

None.

### P1

#### P1-001 — Review configuration under-scopes the declared production command and prompt surface

- File: `.opencode/specs/skilled-agent-orchestration/138-command-agent-canon-conformance/review/deep-review-config.json:47`
- Claim: The immutable scope list contains only 28 command paths and 9 prompt paths, so it cannot certify the declared 37-command/37-prompt surface.
- Evidence: Configured commands are listed at lines 80–107 and configured prompts stop at lines 147–155. The omitted production commands are `agent_router.md` and the eight `deep/*` routers; 28 generated prompt mirrors are also absent. `sync-prompts.cjs:25-52` walks those sources and `sync-prompts.cjs:88-98` builds the complete output map.
- Finding class: matrix/evidence.
- Scope proof: filesystem census plus generator exclusion rules returned 37 production sources and 37 prompt outputs; the configured list counted 28 commands and 9 prompts.
- Counterevidence sought: `spec.md:90` intentionally names seven command families, which account for the 28 configured command paths.
- Alternative explanation: Deep-loop commands and `agent_router.md` may be infrastructure owned elsewhere. That does not reconcile the review contract's 37-file scope, the generator's 37-source surface, or the config's partial deep prompt inclusion.
- Final severity: P1; confidence: 0.92.
- Downgrade trigger: Add all 37 sources/mirrors, or document an explicit exclusion and separate coverage owner.
- Recommendation: Reconcile `reviewScopeFiles` before later dimensions claim whole-surface evidence.

### P2

#### P2-001 — Representative agent validation emits a non-sequential numbering warning

- File: `.opencode/agents/deep-review.md:1`
- Evidence: The required validator exits 0 but reports `non_sequential_numbering`, expected section 1 and found 0; `validate_document.py:345-352` emits this warning.
- Finding class: instance-only. Scope proof is limited to the required representative invocation.
- Recommendation: Confirm whether section 0 is intentional under create-agent canon; otherwise renumber it or document the validator exception.

## Traceability Checks

- Core `spec_code`: partial; seven-family spec scope matches 28 configured commands, while the generator surface is 37.
- Core `checklist_evidence`: inventory only; all five child checklists were located, not adjudicated.
- Overlay `skill_agent`: 13/13/13 runtime files present; semantic parity pending.
- Overlay `agent_cross_runtime`: structural inventory complete; correctness pass remains.
- Overlay `feature_catalog_code` and `playbook_capability`: not assessed.
- Resource-map coverage: skipped because `resource-map.md` is absent.
- Scope violations: none; no reviewed target file was modified.

## Verdict

CONDITIONAL. No P0 findings. The P1 scope mismatch prevents a whole-surface review claim; the P2 validator warning is advisory.

## Next Dimension

Correctness. Verify scope coverage, sync-generator invariants, runtime parity, and whether the section-number warning is isolated or systemic.

Review verdict: CONDITIONAL

