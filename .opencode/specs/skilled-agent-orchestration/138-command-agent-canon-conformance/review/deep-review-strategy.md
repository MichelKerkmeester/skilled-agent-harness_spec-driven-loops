---
title: "Deep Review Strategy - 138-command-agent-canon-conformance"
description: Runtime strategy for the deep review of command + agent canon conformance.
trigger_phrases:
  - "deep review strategy"
  - "138 canon conformance review"
importance_tier: normal
contextType: planning
version: 1.11.0.13
---

# Deep Review Strategy - 138-command-agent-canon-conformance

## 1. OVERVIEW

### Purpose

Review the command + agent canon conformance packet (138) across all four dimensions: correctness, security, traceability, and maintainability. The packet is a phase parent with 5 children covering template-canon conformance of all command families and agents, plus Codex dual-runtime parity.

### Topic

Review: .opencode/specs/skilled-agent-orchestration/138-command-agent-canon-conformance

### Review Target Type

spec-folder (phase parent with 5 children: 000-foundations, 001-command-template-conformance, 002-agent-canon-conformance, 003-codex-command-parity, 004-integrate-validate-ship)

---

## 2. TOPIC

Review the command + agent create-skill canon conformance packet — template-canon structure across every command family and agent, plus Codex dual-runtime parity. The packet conformes all 7 OpenCode command families to create-command canon (numbered router-core), conforms 13 agents to create-agent canon across `.opencode`/`.claude`, regenerates `.codex/agents/*.toml`, and builds `sync-prompts.cjs` for Codex command parity. All conformance is audited per-lane by the deep-alignment loop against the sk-doc authority.

---

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness — Logic, state transitions, invariants, edge cases, behavior against observable intent in the spec artifacts and implementation files
- [x] D2 Security — Trust boundaries, auth/authz, input handling, secrets exposure, exploit paths in the scripts and sync generators; score: 2/5 with two active P1 findings
- [ ] D3 Traceability — Spec alignment, checklist evidence, cross-reference integrity, runtime parity across `.opencode`/`.claude`/`.codex`
- [ ] D4 Maintainability — Pattern compliance, documentation quality, clarity, safe follow-on change cost across all artifacts
<!-- MACHINE-OWNED: END -->

---

## 4. NON-GOALS

- NOT reviewing reality/routing-drift conformance (owned by complete packet 131)
- NOT reviewing the design or behavior of validate_document.py itself — only its usage
- NOT reviewing the deep-alignment engine — only its lane-config output
- NOT implementing fixes — this is a read-only review producing findings only

---

## 5. STOP CONDITIONS

- max_iterations=5 reached (stop_policy=max-iterations — convergence is telemetry only)
- All 4 dimensions reviewed with all quality gates passing
- 3+ consecutive error iterations

---

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| correctness | CONDITIONAL | 2 | Seven-family command validation and prompt sync pass; review-scope separation, two stale agent TOMLs, and the parent/child home-install contract remain unresolved. |
<!-- MACHINE-OWNED: END -->

---

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 5 active
- **P2 (Minor):** 0 active
- **Delta this iteration:** +0 P0, +2 P1; refined P2-002 to P1-004

[Findings are tracked in `deep-review-findings-registry.json`. This section provides a running count summary updated after each iteration.]
<!-- MACHINE-OWNED: END -->

---

## 8. WHAT WORKED
[First iteration -- populated after iteration 1 completes]
Correctness verification established 28/28 direct family-command passes, 26/26 agent-validator passes, and 37/37 prompt-sync passes. The flat-name collision probe found no collisions, and the 22 section-0 warnings match the documented sanctioned dialect.
Security review confirmed the validator and prompt-forwarding surfaces are clean, and the targeted secret scan found no matches.

---

## 9. WHAT FAILED
[First iteration -- populated after iteration 1 completes]
The review matrix still does not distinguish the intentional 28-file template-canon lane from phase 003's 37-source prompt-parity lane. The agent sync gate is red for ai-council.toml and context.toml, and the parent handoff still lists home installation/symlink repair that child 003 defers.
Security review found two P1 boundaries: both generators can follow pre-existing output symlinks, and deep-alignment is emitted as workspace-write despite its read-only manifest.

---

## 10. EXHAUSTED APPROACHES (do not retry)
[Populated when a review approach has been tried from multiple angles without yielding new findings]

---

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
[Review angles that were investigated and definitively eliminated -- consolidated from iteration dead-end data]

---

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
- Dimension: traceability
- Focus area: Reconcile the security findings with checklist evidence, runtime parity claims, and the parent/child completion matrix.
- Reason: Security coverage found two active P1s and refined P2-002; the next pass must verify that the packet records them consistently.
- Rotation status: queued
- Blocked/productive carry-forward: P1 review-matrix boundary; P1 agent-sync drift; P1 parent/child home-install contract; P1 permission boundary; P1 output containment
- Required evidence: phase checklists, implementation summaries, cross-runtime permission/tool maps, and parent metadata/completion claims
<!-- MACHINE-OWNED: END -->

---

## 13. KNOWN CONTEXT

No prior memory context available (memory MCP timed out during context loading).

### Bounded Context Snapshot

- **Target pointers**: Phase parent spec folder `138-command-agent-canon-conformance` with 5 children (000-004). Parent has lean trio (spec.md, description.json, graph-metadata.json). Children have full Level 2 doc sets. 000-foundations has alignment/ artifacts from a prior deep-alignment run.
- **Behavior claims**: Every `.opencode/commands/**/*.md` must pass `validate_document.py --type command`; every agent passes `--type agent`; `sync-agents.cjs --check` clean; new `sync-prompts.cjs --check` clean; `~/.codex/prompts/` at full parity with stale symlink repaired.
- **Reuse and conventions**: sk-doc create-command and create-agent canon templates are the authority. `validate_document.py` keys on numbered `## N.` headers and a router-core (`OWNED ASSETS` + `PRESENTATION BOUNDARY`).
- **Review risks and gaps**: The spec status is `in_progress` with `completion_pct: 5`. All children are "Planned" status. The 000-foundations child has a known issue: the deep-alignment reducer did not consume the delta stream (raw delta evidence is used instead of reduced report).

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | - | Spec claims vs implementation files |
| `checklist_evidence` | core | pending | - | Checklist items vs cited evidence |
| `skill_agent` | overlay | pending | - | SKILL.md contracts vs agent files |
| `agent_cross_runtime` | overlay | pending | - | .claude vs .opencode/.codex agent parity |
| `feature_catalog_code` | overlay | pending | - | Catalog claims vs implementation |
| `playbook_capability` | overlay | pending | - | Scenario preconditions vs actual support |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated during initialization from scope discovery]

Key file groups:
- Parent spec artifacts: spec.md, description.json, graph-metadata.json (3 files)
- Child spec artifacts: 5 children × ~7 files each = ~35 files (spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md, description.json, graph-metadata.json; 000 also has lane-config.json + alignment/; 002-004 also have decision-record.md)
- Command files: 37 `.md` under `.opencode/commands/`
- Agent files: 13 `.opencode/agents/*.md` + 13 `.claude/agents/*.md` = 26
- Codex agents: 13 `.codex/agents/*.toml`
- Codex prompts: 37 `.codex/prompts/*.md`
- Key scripts: validate_document.py, sync-agents.cjs, sync-prompts.cjs (3 files)
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.10 (severity-weighted P0/P1/P2 ratio)
- Stop policy: max-iterations (convergence is telemetry only until iteration ceiling)
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-07-14T19:26:13Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Executor: cli-codex (gpt-5.6-luna, max reasoning, fast service tier, workspace-write sandbox)
- Started: 2026-07-14T19:26:13Z
<!-- MACHINE-OWNED: END -->

---

## 17. DIMENSION QUEUE

Risk-ordered dimension schedule for 5 iterations:
1. Iteration 1: Inventory pass (artifact map, file types, complexity estimation)
2. Iteration 2: Correctness (logic, state, invariants, edge cases)
3. Iteration 3: Security (trust boundaries, input handling, secrets, exploit paths)
4. Iteration 4: Traceability (spec alignment, checklist evidence, cross-reference integrity, runtime parity)
5. Iteration 5: Maintainability (patterns, documentation quality, clarity, change cost)

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

<!-- /ANCHOR:completed-dimensions -->

<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 11
- P2 (Suggestions): 2
- Resolved: 0

<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Agent cross-runtime: partial. Frontmatter dialect differences are expected; after normalizing runtime-path references, 10/13 bodies are exact and the remaining three differences are two formatting-only changes plus one runtime-path wording change, with no observed workflow divergence. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Agent cross-runtime: partial. Frontmatter dialect differences are expected; after normalizing runtime-path references, 10/13 bodies are exact and the remaining three differences are two formatting-only changes plus one runtime-path wording change, with no observed workflow divergence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Agent cross-runtime: partial. Frontmatter dialect differences are expected; after normalizing runtime-path references, 10/13 bodies are exact and the remaining three differences are two formatting-only changes plus one runtime-path wording change, with no observed workflow divergence.

### Agent permission boundary: FAIL — read-only deep-alignment has unscoped Bash, and Codex output is workspace-write. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Agent permission boundary: FAIL — read-only deep-alignment has unscoped Bash, and Codex output is workspace-write.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Agent permission boundary: FAIL — read-only deep-alignment has unscoped Bash, and Codex output is workspace-write.

### Catastrophic validator ReDoS. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Catastrophic validator ReDoS.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Catastrophic validator ReDoS.

### Core `checklist_evidence`: inventory only; all five child checklists were located, not adjudicated. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Core `checklist_evidence`: inventory only; all five child checklists were located, not adjudicated.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core `checklist_evidence`: inventory only; all five child checklists were located, not adjudicated.

### Core `spec_code`: partial; seven-family spec scope matches 28 configured commands, while the generator surface is 37. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Core `spec_code`: partial; seven-family spec scope matches 28 configured commands, while the generator surface is 37.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core `spec_code`: partial; seven-family spec scope matches 28 configured commands, while the generator surface is 37.

### Core checklist_evidence: failed for the live parity claim. Phase-002 evidence says 13/13, while the current sync gate reports two stale files. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Core checklist_evidence: failed for the live parity claim. Phase-002 evidence says 13/13, while the current sync gate reports two stale files.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core checklist_evidence: failed for the live parity claim. Phase-002 evidence says 13/13, while the current sync gate reports two stale files.

### Core spec_code: partial. The 28-file seven-family scope is internally consistent; phase 003 expands the prompt source set to 37, but the review matrix does not separate those ownership surfaces. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Core spec_code: partial. The 28-file seven-family scope is internally consistent; phase 003 expands the prompt source set to 37, but the review matrix does not separate those ownership surfaces.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core spec_code: partial. The 28-file seven-family scope is internally consistent; phase 003 expands the prompt source set to 37, but the review matrix does not separate those ownership surfaces.

### Generated-file containment: FAIL — nominal path joins are not symlink-safe. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Generated-file containment: FAIL — nominal path joins are not symlink-safe.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Generated-file containment: FAIL — nominal path joins are not symlink-safe.

### Home prompt/symlink behavior: explicitly deferred by child 003, but not reconciled with the parent handoff criteria. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Home prompt/symlink behavior: explicitly deferred by child 003, but not reconciled with the parent handoff criteria.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Home prompt/symlink behavior: explicitly deferred by child 003, but not reconciled with the parent handoff criteria.

### Home-directory install: NOT IMPLEMENTED — installation and stale-link repair are explicitly deferred, so no home installer was available to audit. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Home-directory install: NOT IMPLEMENTED — installation and stale-link repair are explicitly deferred, so no home installer was available to audit.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Home-directory install: NOT IMPLEMENTED — installation and stale-link repair are explicitly deferred, so no home installer was available to audit.

### Home-install symlink mutation, because no home-install implementation exists. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Home-install symlink mutation, because no home-install implementation exists.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Home-install symlink mutation, because no home-install implementation exists.

### Overlay `agent_cross_runtime`: structural inventory complete; correctness pass remains. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Overlay `agent_cross_runtime`: structural inventory complete; correctness pass remains.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay `agent_cross_runtime`: structural inventory complete; correctness pass remains.

### Overlay `feature_catalog_code` and `playbook_capability`: not assessed. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Overlay `feature_catalog_code` and `playbook_capability`: not assessed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay `feature_catalog_code` and `playbook_capability`: not assessed.

### Overlay `skill_agent`: 13/13/13 runtime files present; semantic parity pending. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Overlay `skill_agent`: 13/13/13 runtime files present; semantic parity pending.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay `skill_agent`: 13/13/13 runtime files present; semantic parity pending.

### Prompt forwarding: PASS — no shell, eval, or exec path consumes prompt content. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Prompt forwarding: PASS — no shell, eval, or exec path consumes prompt content.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Prompt forwarding: PASS — no shell, eval, or exec path consumes prompt content.

### Prompt-content command injection. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Prompt-content command injection.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Prompt-content command injection.

### Resource-map coverage: skipped because `resource-map.md` is absent. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Resource-map coverage: skipped because `resource-map.md` is absent.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Resource-map coverage: skipped because `resource-map.md` is absent.

### Resource-map coverage: skipped because review/resource-map.md is absent. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Resource-map coverage: skipped because review/resource-map.md is absent.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Resource-map coverage: skipped because review/resource-map.md is absent.

### Scope violations: none; no reviewed target file was modified. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Scope violations: none; no reviewed target file was modified.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Scope violations: none; no reviewed target file was modified.

### Secrets scan: PASS — targeted secret/API-key/private-key patterns returned no matches. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Secrets scan: PASS — targeted secret/API-key/private-key patterns returned no matches.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Secrets scan: PASS — targeted secret/API-key/private-key patterns returned no matches.

### sync-agents correctness: fail. --check reports two stale generated outputs. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: sync-agents correctness: fail. --check reports two stale generated outputs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: sync-agents correctness: fail. --check reports two stale generated outputs.

### sync-prompts correctness: pass. --check reports 37 prompts in sync; the flat-name probe found 37 unique source/output names and no collisions; spot checks reference the correct canonical commands and forward arguments. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: sync-prompts correctness: pass. --check reports 37 prompts in sync; the flat-name probe found 37 unique source/output names and no collisions; spot checks reference the correct canonical commands and forward arguments.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: sync-prompts correctness: pass. --check reports 37 prompts in sync; the flat-name probe found 37 unique source/output names and no collisions; spot checks reference the correct canonical commands and forward arguments.

### Unsafe frontmatter deserialization or arbitrary property copying. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Unsafe frontmatter deserialization or arbitrary property copying.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Unsafe frontmatter deserialization or arbitrary property copying.

### Validator coverage: pass. 28/28 in-scope command files and 26/26 agent markdown files exited 0; 22 agent warnings match the documented section-0 dialect. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Validator coverage: pass. 28/28 in-scope command files and 26/26 agent markdown files exited 0; 22 agent warnings match the documented section-0 dialect.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Validator coverage: pass. 28/28 in-scope command files and 26/26 agent markdown files exited 0; 22 agent warnings match the documented section-0 dialect.

### Validator input handling: PASS under the explicit CLI boundary — --type is allowlisted and the file path is the utility input. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Validator input handling: PASS under the explicit CLI boundary — --type is allowlisted and the file path is the utility input.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Validator input handling: PASS under the explicit CLI boundary — --type is allowlisted and the file path is the utility input.

### Validator regex safety: PASS by static inspection — no catastrophic nested quantifiers in reviewed patterns. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Validator regex safety: PASS by static inspection — no catastrophic nested quantifiers in reviewed patterns.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Validator regex safety: PASS by static inspection — no catastrophic nested quantifiers in reviewed patterns.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- dimension: traceability - focus area: Reconcile these security findings with checklist evidence, runtime parity claims, and parent/child completion contracts. - reason: Security found two active P1s and refined P2-002; the next pass must prove packet-wide traceability. - rotation status: queued - blocked/productive carry-forward: P1-001, P1-002, P1-003, P1-004, P1-005. - required evidence: child checklists, implementation summaries, cross-runtime permission/tool maps, and parent metadata. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->

## ITERATION 4 TRACEABILITY UPDATE

- Route proof: `mode=review`, `target_agent=deep-review`, `execution=single_review_iteration`, `state_source=externalized_files`, `do_not_switch_mode=true`.
- Evidence outcome: 13/13/13 agent inventory; normalized Markdown bodies semantically aligned; all skill references resolved; `sync-agents.cjs --check` remains red for `ai-council.toml` and `context.toml`; `sync-prompts.cjs --check` passes for 37 repo prompts.
- Active findings: P0=0, P1=7, P2=0. Carried P1-001 through P1-005. New P1-006 records the contradictory phase-004 ADR/summary/checklist gate state. New P1-007 records the parent phase map remaining `Planned` while children record completed/in-branch states.
- Parent/child result: P1-003 remains active because home installation and stale-link repair are explicitly deferred by phases 003/004 but remain in the parent handoff.
- Next focus: maintainability, with the seven P1 traceability findings carried forward.
