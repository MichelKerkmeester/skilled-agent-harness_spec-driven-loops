---
title: Deep Review Strategy
description: Live session tracking for the deep-review of the seven skilled/v4.0.0.0 commits (deep-alignment removal, executor routing, Phase-0 gate retirement).
trigger_phrases:
  - "deep review strategy"
importance_tier: normal
contextType: planning
version: 1.11.0.13
---

# Deep Review Strategy — Seven-Commit Removal/Routing Audit

## 2. TOPIC
Review all work shipped this session on branch skilled/v4.0.0.0 — seven commits, each inspectable with `git show <sha>`:
1. e41aa1878ad — retire the Phase-0 dispatch-context gate across all deep/* commands (33 files)
2. d1a5981b58c — dispatch a single cli-cursor/devin/pi executor instead of silently falling back to native (10 files)
3. 8849444aa61 — remove the deep-alignment deep-loop mode and the conformance-benchmark capability it powered (291 files)
4. 766b59d6bc3 — complete that removal (four orphaned prompt mirrors under .codex/prompts and .pi/prompts, plus hub doc drift)
5. 6303c12ad27 — document that an out-of-quota default provider makes opencode retry a 429 forever and appear hung; explicit-model hard rule
6. 69d5c223668 — root README: drop the retired alignment loop family, refresh counts
7. b955f937fc9 — remove dangling .claude and .cursor command-mirror symlinks for the deleted commands

Audit focus (operator-bound): (a) correctness and completeness of the removal — no orphaned references or dangling mirrors on ANY active surface across .opencode/.claude/.codex/.cursor/.pi/.devin; the six surviving deep-loop modes and the behavior/model/skill/agent benchmark families intact; generated metadata consistent with its sources; (b) soundness of the executor single-dispatch routing; (c) whether retiring the Phase-0 gate removed a real safety boundary; (d) whether documentation matches the code. Observation-only — findings cite [SOURCE: file:line], never modify reviewed code.

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- No code modification (review is observation-only).
- No re-litigation of the decision to remove deep-alignment — only the completeness/correctness of the removal.
- No behavior benchmark execution; static audit only.

## 5. STOP CONDITIONS
- Hard ceiling: 10 iterations (stop_policy=max-iterations — convergence is telemetry only; broaden the angle instead of synthesizing before the ceiling).
- Terminal: manualStop, userPaused (sentinel), unrecoverable error.

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 0
- P2 (Suggestions): 30
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
[First iteration — populated after iteration 1 completes]

## 9. WHAT FAILED
[First iteration — populated after iteration 1 completes]

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **checklist_evidence:** Deferred (strategy.md §9 exhausted-approaches; observation-only review). -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **checklist_evidence:** Deferred (strategy.md §9 exhausted-approaches; observation-only review).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **checklist_evidence:** Deferred (strategy.md §9 exhausted-approaches; observation-only review).

### **checklist_evidence:** Not re-run (observation-only; prior iterations ruled this direction out — strategy.md §9). -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **checklist_evidence:** Not re-run (observation-only; prior iterations ruled this direction out — strategy.md §9).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **checklist_evidence:** Not re-run (observation-only; prior iterations ruled this direction out — strategy.md §9).

### **checklist_evidence:** The commit messages of e41aa1878ad and d1a5981b58c cite verification (render + check-contract-drift 24/24; validate --strict 0/0; node:test 767/17 == baseline; targeted auto-YAML vitest 71/71). Not re-run this iteration (observation-only review; no code modification). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **checklist_evidence:** The commit messages of e41aa1878ad and d1a5981b58c cite verification (render + check-contract-drift 24/24; validate --strict 0/0; node:test 767/17 == baseline; targeted auto-YAML vitest 71/71). Not re-run this iteration (observation-only review; no code modification).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **checklist_evidence:** The commit messages of e41aa1878ad and d1a5981b58c cite verification (render + check-contract-drift 24/24; validate --strict 0/0; node:test 767/17 == baseline; targeted auto-YAML vitest 71/71). Not re-run this iteration (observation-only review; no code modification).

### **checklist_evidence**: Deferred per strategy.md §9 exhausted-approaches (observation-only review). -- BLOCKED (iteration 10, 2 attempts)
- What was tried: **checklist_evidence**: Deferred per strategy.md §9 exhausted-approaches (observation-only review).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **checklist_evidence**: Deferred per strategy.md §9 exhausted-approaches (observation-only review).

### **skill_agent / agent_cross_runtime / feature_catalog_code / playbook_capability:** Deferred (strategy.md §9 exhausted-approaches; not security-relevant this angle). -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **skill_agent / agent_cross_runtime / feature_catalog_code / playbook_capability:** Deferred (strategy.md §9 exhausted-approaches; not security-relevant this angle).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **skill_agent / agent_cross_runtime / feature_catalog_code / playbook_capability:** Deferred (strategy.md §9 exhausted-approaches; not security-relevant this angle).

### **skill_agent / agent_cross_runtime / feature_catalog_code / playbook_capability:** Deferred (strategy.md §9 exhausted-approaches; not traceability-relevant to this angle). -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **skill_agent / agent_cross_runtime / feature_catalog_code / playbook_capability:** Deferred (strategy.md §9 exhausted-approaches; not traceability-relevant to this angle).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **skill_agent / agent_cross_runtime / feature_catalog_code / playbook_capability:** Deferred (strategy.md §9 exhausted-approaches; not traceability-relevant to this angle).

### **skill_agent / agent_cross_runtime / feature_catalog_code / playbook_capability:** Not assessed this iteration (deferred per reduced-scope focus). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **skill_agent / agent_cross_runtime / feature_catalog_code / playbook_capability:** Not assessed this iteration (deferred per reduced-scope focus).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **skill_agent / agent_cross_runtime / feature_catalog_code / playbook_capability:** Not assessed this iteration (deferred per reduced-scope focus).

### **skill_agent / agent_cross_runtime / feature_catalog_code / playbook_capability**: Deferred per strategy.md §9 exhausted-approaches (not correctness-relevant to this angle). -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **skill_agent / agent_cross_runtime / feature_catalog_code / playbook_capability**: Deferred per strategy.md §9 exhausted-approaches (not correctness-relevant to this angle).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **skill_agent / agent_cross_runtime / feature_catalog_code / playbook_capability**: Deferred per strategy.md §9 exhausted-approaches (not correctness-relevant to this angle).

### **skill_agent / agent_cross_runtime / feature_catalog_code / playbook_capability**: Deferred per strategy.md §9 exhausted-approaches (not maintainability-relevant to this close-out angle). -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **skill_agent / agent_cross_runtime / feature_catalog_code / playbook_capability**: Deferred per strategy.md §9 exhausted-approaches (not maintainability-relevant to this close-out angle).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **skill_agent / agent_cross_runtime / feature_catalog_code / playbook_capability**: Deferred per strategy.md §9 exhausted-approaches (not maintainability-relevant to this close-out angle).

### **spec_code (023 vs commit 1 — e41aa1878ad):** CONSISTENT. Spot-checks: (a) "retire the gate across all 8 deep/* commands" — commit stat shows `alignment.md`, `ai-council.md`, `agent-improvement.md` changed and commit message confirms all 8; (b) "reverted 022" — commit message confirms "reverted the dormant 022 render authorization + its test"; (c) "recompiled contracts" — stat shows 4 `compiled/deep-*.contract.md` files changed (2+/2- each). All three claims match the diff. ✓ -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **spec_code (023 vs commit 1 — e41aa1878ad):** CONSISTENT. Spot-checks: (a) "retire the gate across all 8 deep/* commands" — commit stat shows `alignment.md`, `ai-council.md`, `agent-improvement.md` changed and commit message confirms all 8; (b) "reverted 022" — commit message confirms "reverted the dormant 022 render authorization + its test"; (c) "recompiled contracts" — stat shows 4 `compiled/deep-*.contract.md` files changed (2+/2- each). All three claims match the diff. ✓
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **spec_code (023 vs commit 1 — e41aa1878ad):** CONSISTENT. Spot-checks: (a) "retire the gate across all 8 deep/* commands" — commit stat shows `alignment.md`, `ai-council.md`, `agent-improvement.md` changed and commit message confirms all 8; (b) "reverted 022" — commit message confirms "reverted the dormant 022 render authorization + its test"; (c) "recompiled contracts" — stat shows 4 `compiled/deep-*.contract.md` files changed (2+/2- each). All three claims match the diff. ✓

### **spec_code (024 vs commit 2 — d1a5981b58c):** CONSISTENT. Spot-checks: (a) "Add `if_cli_cursor/devin/pi` to `deep-review-auto.yaml`" — stat shows +273 to that file; (b) "research uses `config.executor.type`" — 024 spec §2 explicitly documents the field asymmetry (cross-corroborated by prior P2-009); (c) "`deep-alignment-auto.yaml` gets the three branches" — stat shows +273. The third target was subsequently deleted by commit 3 (8849444aa6, documented by the 025 packet), but 024 correctly records what commit 2 shipped at its time — correct spec-per-commit traceability, not drift. ✓ -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **spec_code (024 vs commit 2 — d1a5981b58c):** CONSISTENT. Spot-checks: (a) "Add `if_cli_cursor/devin/pi` to `deep-review-auto.yaml`" — stat shows +273 to that file; (b) "research uses `config.executor.type`" — 024 spec §2 explicitly documents the field asymmetry (cross-corroborated by prior P2-009); (c) "`deep-alignment-auto.yaml` gets the three branches" — stat shows +273. The third target was subsequently deleted by commit 3 (8849444aa6, documented by the 025 packet), but 024 correctly records what commit 2 shipped at its time — correct spec-per-commit traceability, not drift. ✓
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **spec_code (024 vs commit 2 — d1a5981b58c):** CONSISTENT. Spot-checks: (a) "Add `if_cli_cursor/devin/pi` to `deep-review-auto.yaml`" — stat shows +273 to that file; (b) "research uses `config.executor.type`" — 024 spec §2 explicitly documents the field asymmetry (cross-corroborated by prior P2-009); (c) "`deep-alignment-auto.yaml` gets the three branches" — stat shows +273. The third target was subsequently deleted by commit 3 (8849444aa6, documented by the 025 packet), but 024 correctly records what commit 2 shipped at its time — correct spec-per-commit traceability, not drift. ✓

### **spec_code:** No spec-code traceability check applicable this iteration (security dimension; no spec requirements assert safety-boundary invariants for the retired gate or executor routing). The surviving deterministic guard's behavior is documented in its own inline comments (`dispatch-guard.cjs:127-170`) and the commit message of e41aa1878ad. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **spec_code:** No spec-code traceability check applicable this iteration (security dimension; no spec requirements assert safety-boundary invariants for the retired gate or executor routing). The surviving deterministic guard's behavior is documented in its own inline comments (`dispatch-guard.cjs:127-170`) and the commit message of e41aa1878ad.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **spec_code:** No spec-code traceability check applicable this iteration (security dimension; no spec requirements assert safety-boundary invariants for the retired gate or executor routing). The surviving deterministic guard's behavior is documented in its own inline comments (`dispatch-guard.cjs:127-170`) and the commit message of e41aa1878ad.

### **spec_code:** REQ-010 (frozen auditable handoff with hashes) vs shipped state — PARTIAL: the handoff manifest exists and hashes artifacts, but the census hash is stale post-8849444aa6 and unenforced (P2-012). The evidence-exists invariant (implied by validate-evidence.cjs) IS satisfied by the row removal. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **spec_code:** REQ-010 (frozen auditable handoff with hashes) vs shipped state — PARTIAL: the handoff manifest exists and hashes artifacts, but the census hash is stale post-8849444aa6 and unenforced (P2-012). The evidence-exists invariant (implied by validate-evidence.cjs) IS satisfied by the row removal.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **spec_code:** REQ-010 (frozen auditable handoff with hashes) vs shipped state — PARTIAL: the handoff manifest exists and hashes artifacts, but the census hash is stale post-8849444aa6 and unenforced (P2-012). The evidence-exists invariant (implied by validate-evidence.cjs) IS satisfied by the row removal.

### **spec_code**: Not applicable this iteration (broadened benchmark-family angle; spec-vs-code traceability for commits 1-2 was ruled out in iteration 8). -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **spec_code**: Not applicable this iteration (broadened benchmark-family angle; spec-vs-code traceability for commits 1-2 was ruled out in iteration 8).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **spec_code**: Not applicable this iteration (broadened benchmark-family angle; spec-vs-code traceability for commits 1-2 was ruled out in iteration 8).

### **spec_code**: Not applicable this iteration (final adversarial close-out; spec-vs-code traceability for commits 1-2 was ruled out in iteration 8; REQ-010 partial status captured by P2-012). -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **spec_code**: Not applicable this iteration (final adversarial close-out; spec-vs-code traceability for commits 1-2 was ruled out in iteration 8; REQ-010 partial status captured by P2-012).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **spec_code**: Not applicable this iteration (final adversarial close-out; spec-vs-code traceability for commits 1-2 was ruled out in iteration 8; REQ-010 partial status captured by P2-012).

### `.codex/prompts/deep-alignment.md` — absent from `.codex/prompts/` (33 files listed, none matching) -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `.codex/prompts/deep-alignment.md` — absent from `.codex/prompts/` (33 files listed, none matching)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `.codex/prompts/deep-alignment.md` — absent from `.codex/prompts/` (33 files listed, none matching)

### `.codex/prompts/deep-command-benchmark.md` — absent -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `.codex/prompts/deep-command-benchmark.md` — absent
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `.codex/prompts/deep-command-benchmark.md` — absent

### `.pi/prompts/deep-alignment.md` — absent from `.pi/prompts/` (35 files listed, none matching) -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `.pi/prompts/deep-alignment.md` — absent from `.pi/prompts/` (35 files listed, none matching)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `.pi/prompts/deep-alignment.md` — absent from `.pi/prompts/` (35 files listed, none matching)

### `.pi/prompts/deep-command-benchmark.md` — absent -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `.pi/prompts/deep-command-benchmark.md` — absent
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `.pi/prompts/deep-command-benchmark.md` — absent

### P2-006: `.opencode/skills/system-deep-loop/runtime/README.md:15` — "research, review, council and alignment modes" ✓ -- BLOCKED (iteration 5, 1 attempts)
- What was tried: P2-006: `.opencode/skills/system-deep-loop/runtime/README.md:15` — "research, review, council and alignment modes" ✓
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: P2-006: `.opencode/skills/system-deep-loop/runtime/README.md:15` — "research, review, council and alignment modes" ✓

### P2-007: `.opencode/skills/system-deep-loop/shared/progress/README.md:12` — "The deep-improvement lanes and the alignment mode reduce state without this helper." ✓ -- BLOCKED (iteration 5, 1 attempts)
- What was tried: P2-007: `.opencode/skills/system-deep-loop/shared/progress/README.md:12` — "The deep-improvement lanes and the alignment mode reduce state without this helper." ✓
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: P2-007: `.opencode/skills/system-deep-loop/shared/progress/README.md:12` — "The deep-improvement lanes and the alignment mode reduce state without this helper." ✓

### P2-008: `.opencode/skills/sk-doc/sk-create-benchmark/SKILL.md:32` — "`alignment` (DAB)" in fixed-prefix list ✓ -- BLOCKED (iteration 5, 1 attempts)
- What was tried: P2-008: `.opencode/skills/sk-doc/sk-create-benchmark/SKILL.md:32` — "`alignment` (DAB)" in fixed-prefix list ✓
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: P2-008: `.opencode/skills/sk-doc/sk-create-benchmark/SKILL.md:32` — "`alignment` (DAB)" in fixed-prefix list ✓

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
[None yet]

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot
- Target pointers: seven commits above; union scope at specs/system-deep-loop/036-deep-loop-innovation/025-deprecate-deep-alignment/review/scope-files.txt — 154 existing files (added/modified) + 182 deleted paths. Commit → file mapping is in the coverage graph seed (slice-<sha> nodes).
- Behavior claims: six surviving deep-loop modes (research, review, ai-council, agent-improvement + behavior/model/skill benchmark families) stay intact; executor kinds cli-cursor/devin/pi each have a single-dispatch branch (no native fallback); Phase-0 gate retirement should not remove a needed safety boundary (untrusted-content guard and write-containment live in the prompt packs and executor-audit paths, not the Phase-0 gate).
- Reuse and conventions: deep/* command routers (review.md, research.md, ai-council.md...) each own assets/deep-<mode>-auto.yaml + presentation.txt; runtime single-dispatch branches live in .opencode/commands/deep/assets/deep-<mode>-auto.yaml per executor kind; mirrors across runtimes (.claude/.codex/.cursor/.pi/.devin) reference .opencode canonical files.
- Review risks and gaps: prior review packet (lineage generation without sessionId) was archived to specs/system-deep-loop/036-deep-loop-innovation/025-deprecate-deep-alignment/review-archive/20260827T190427Z by operator-authorized restart (its deep-review-state.jsonl was missing — partial state; its iterations are preserved in the archive and may contain useful prior observations but are NOT canonical for this lineage). memory_context daemon was cold (exit 75) — prior-context = None. Generated metadata surfaces to cross-check: hub-router.json / mode-registry.json / leaf-manifest.json / compiled-routing fixtures / registry-compiler.cjs.
- Out of scope: /deep:alignment usage guidance for END USERS post-removal (only removal completeness matters); the deep-improvement evaluator loop internals.

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | - | 025 packet spec claims vs shipped commits |
| `checklist_evidence` | core | pending | - | checklist.md evidence rows |
| `skill_agent` | overlay | pending | - | system-deep-loop SKILL/hub docs vs removed mode |
| `agent_cross_runtime` | overlay | pending | - | agent/command mirrors across .claude/.codex/.cursor/.pi/.devin |
| `feature_catalog_code` | overlay | pending | - | retired alignment feature-catalog references |
| `playbook_capability` | overlay | pending | - | retired manual-testing-playbook references |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
Scope is commit-derived (154 existing files + 182 deleted paths across 7 commits). Full list: specs/system-deep-loop/036-deep-loop-innovation/025-deprecate-deep-alignment/review/scope-files.txt. Areas: .opencode (commands/deep + assets, skills system-deep-loop/sk-doc/cli-external-orchestration, agents, bin compiled-routing, hooks, plugins tests), specs (036-deep-loop-innovation children 023/024/025), .claude, README.md.
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 10
- Convergence threshold: 0.10 (telemetry only — stop_policy=max-iterations)
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-08-27T19:11:40.386Z, parentSessionId=null, generation=1, lineageMode=restart
- Findings registry: deep-review-findings-registry.json
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: files
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-08-27T19:11:40.386Z
<!-- MACHINE-OWNED: END -->
