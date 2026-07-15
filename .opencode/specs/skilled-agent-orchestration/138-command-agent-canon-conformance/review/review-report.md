# Deep Review Report — 138-command-agent-canon-conformance

## 1. Executive Summary

| Field | Value |
|-------|-------|
| **Verdict** | CONDITIONAL |
| **hasAdvisories** | false |
| **P0 (Blockers)** | 0 |
| **P1 (Required)** | 7 active |
| **P2 (Suggestions)** | 0 active (2 resolved) |
| **Iterations** | 5 of 5 |
| **Stop reason** | maxIterationsReached |
| **Stop policy** | max-iterations |
| **Executor** | cli-codex (gpt-5.6-luna, max reasoning, fast tier) |
| **Dimensions covered** | correctness, security, traceability, maintainability (4/4) |

The review assessed the 138-command-agent-canon-conformance packet — a phase parent with 5 children covering template-canon conformance of all command families and agents, plus Codex dual-runtime parity. All four review dimensions were covered across 5 iterations (inventory + 4 dimensions).

The packet's canon conformance work is structurally sound: 28/28 in-scope command files pass `validate_document.py --type command`, 26/26 agent markdown files pass `--type agent` (with 22 documented section-0 warnings), and 37/37 Codex prompts pass `sync-prompts.cjs --check`. However, seven P1 findings remain active, primarily involving state reconciliation issues (stale sync gate, contradictory completion evidence, deferred home-install contract) and two security boundary concerns (sandbox derivation and symlink-following in output writers).

---

## 2. Planning Trigger

`/speckit:plan` is **required** — the CONDITIONAL verdict with 7 active P1 findings necessitates a remediation plan.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": {
    "P0": 0,
    "P1": 7,
    "P2": 0
  },
  "remediationWorkstreams": [
    "sync-agents: regenerate stale ai-council.toml and context.toml, rerun --check gate",
    "parent-child-contract: reconcile home-install deferral between parent handoff and child 003/004",
    "security-boundaries: add deep-alignment to HISTORICAL_SETTINGS or pin sandbox; add symlink guards to output writers",
    "state-reconciliation: update parent phase map; resolve phase-004 ADR vs implementation-summary contradictions"
  ],
  "specSeed": "138-command-agent-canon-conformance",
  "planSeed": "remediation-from-deep-review-138",
  "findingClasses": ["matrix/evidence", "cross-consumer", "permission-boundary", "output-boundary"],
  "affectedSurfacesSeed": [".codex/agents", ".codex/prompts", "sync-agents.cjs", "sync-prompts.cjs", "parent spec.md"],
  "fixCompletenessRequired": false
}
```

---

## 3. Active Finding Registry

### P1-001 — Review scope matrix under-covers declared command/prompt surface
- **Severity:** P1 | **Dimension:** correctness | **First seen:** iteration 1
- **File:** `review/deep-review-config.json:47`
- **Finding class:** matrix/evidence
- **Evidence:** reviewScopeFiles lists 28 command paths and 9 prompt paths; the packet declares 37 production command sources and 37 prompt outputs. The 9 omitted commands are `agent_router.md` + 8 `deep/*.md` routers.
- **Scope proof:** Filesystem census plus sync-prompts exclusion rules produced 37 production command sources and 37 prompt outputs.
- **Affected surface hints:** reviewScopeFiles, deep command routers, agent_router.md, .codex/prompts
- **Recommendation:** Separate the seven-family canon scope (28) from the phase-003 prompt parity scope (37) in the review configuration.

### P1-002 — sync-agents.cjs --check is red while phase 002 claims 13/13 parity
- **Severity:** P1 | **Dimension:** correctness | **First seen:** iteration 2
- **File:** `.codex/agents/ai-council.toml:1`
- **Finding class:** cross-consumer
- **Evidence:** `sync-agents.cjs --check` returns exit 1 with STALE for `ai-council.toml` and `context.toml`. Phase-002 `tasks.md:75` and `:88` claim the gate is GREEN for 13/13.
- **Scope proof:** The gate enumerated all 13 canonical agent sources and found no missing or extra output; the failure is reproducible on two generated consumers.
- **Recommendation:** Regenerate the two TOMLs from current canonical markdown, rerun `--check`, and reconcile phase-002 completion evidence.

### P1-003 — Parent completion criteria require home prompt installation that child 003 defers
- **Severity:** P1 | **Dimension:** correctness/traceability | **First seen:** iteration 2
- **File:** `spec.md:92`
- **Finding class:** matrix/evidence
- **Evidence:** Parent lists `~/.codex/prompts/` installation and stale `create` symlink repair in scope. Child 003 explicitly defers both pending operator confirmation. `sync-prompts.cjs` has no home-directory or symlink mutation path.
- **Recommendation:** Amend the parent handoff/scope to record the approved deferral, or obtain the required operator decision and add a separately authorized home-install step.

### P1-004 — Read-only deep-alignment emitted with workspace-write sandbox
- **Severity:** P1 | **Dimension:** security | **First seen:** iteration 3 (refines P2-002)
- **File:** `sync-agents.cjs:138-149`
- **Finding class:** permission-boundary
- **Evidence:** deep-alignment denies write/edit/patch but allows Bash without scope. `deriveSandboxMode` treats Bash as writable; deep-alignment is absent from `HISTORICAL_SETTINGS`. Generated `.codex/agents/deep-alignment.toml:5` contains `sandbox_mode = "workspace-write"`.
- **Scope proof:** The canonical manifest, Claude mirror, and Codex TOML were inventoried; the generated TOML proves the resulting sandbox.
- **Affected surface hints:** deep-alignment, sync-agents.cjs, Codex sandbox
- **Recommendation:** Add deep-alignment to `HISTORICAL_SETTINGS` with read-only sandbox, or document why it intentionally uses derived defaults.

### P1-005 — Generated-output writers follow pre-existing symlinks outside output roots
- **Severity:** P1 | **Dimension:** security | **First seen:** iteration 3
- **File:** `sync-prompts.cjs:142-147`
- **Finding class:** output-boundary
- **Evidence:** Both sync generators construct output paths and call `writeFileSync` without `lstat`, `realpath` containment, or no-follow semantics. A pre-existing symlink at an expected output filename would redirect writes outside the nominal root.
- **Scope proof:** Both reviewed mutation writers share the same unchecked destination construction. No current symlinks exist, but the mutation path is unguarded.
- **Affected surface hints:** sync-agents.cjs, sync-prompts.cjs, .codex/agents, .codex/prompts
- **Recommendation:** Add `lstat`/`realpath` containment checks before writes, or document the runtime guarantee of non-symlink roots.

### P1-006 — Phase-004 completion artifacts contradict each other about integration gates
- **Severity:** P1 | **Dimension:** traceability | **First seen:** iteration 4
- **File:** `004-integrate-validate-ship/decision-record.md:45`
- **Finding class:** matrix/evidence
- **Evidence:** ADR describes recursive validation, parent rollup, and per-file gates as green. Implementation summary marks all three checks `PENDING`. Checklist reports only 7/9 P0 and 11/12 P1 items verified.
- **Recommendation:** Reconcile the evidence before the phase or parent can be treated as integrated.

### P1-007 — Parent phase-status map is stale relative to child completion states
- **Severity:** P1 | **Dimension:** traceability | **First seen:** iteration 4
- **File:** `spec.md:123`
- **Finding class:** matrix/evidence
- **Evidence:** Parent labels phases 000-004 as `Planned`. Child evidence records phase 002 as `Complete` and phase 004 as completed in-branch with ship/install deferred.
- **Recommendation:** Update the parent phase map to reflect actual child states, or document why it intentionally remains scaffold-state.

### Resolved Findings
- **P2-001** (resolved iteration 2): Agent validator non-sequential numbering warning — documented and systemic (22 warnings for 11 agents with sanctioned section-0 dialect).
- **P2-002** (refined to P1-004 iteration 3): HISTORICAL_SETTINGS omits deep-alignment — the omission changes the effective sandbox boundary, upgrading to P1.

### Remediation Status (2026-07-14)

All seven active P1 findings are remediated. The packet is shipped on `origin/skilled/v4.0.0.0` (HEAD == origin, 0/0) with recursive strict validate Errors:0 and per-file gates green.

| Finding | Resolution | Evidence |
|---------|-----------|----------|
| P1-001 | Scope split documented: the canon-conformance axis covers the 28 seven-family command sources; the phase-003 prompt-parity axis covers the 37 prompt outputs. The 9 excluded canon sources are `agent_router.md` + 8 `deep/*.md` routers (already conformant under packet 064). The historical `deep-review-config.json` is left as the run-of-record. | This registry note |
| P1-002 | `ai-council.toml` + `context.toml` regenerated from canonical markdown; gate green. | `sync-agents.cjs --check` → PASS 13/13 (exit 0) |
| P1-003 | `~/.codex/prompts/` install performed (37 prompts; stale `create` symlink removed); parent scope + phase-004 docs reconciled. | 37 md / 0 symlinks in `~/.codex/prompts/`; `004-integrate-validate-ship/decision-record.md` ADR-002 |
| P1-004 | `deep-alignment` added to `HISTORICAL_SETTINGS` as `workspace-write` with a durable WHY comment (behavior-preserving: it writes its own JSONL state/deltas/logs via Bash while treating every audited artifact as read-only by scope; forcing read-only would break the loop). | `sync-agents.cjs` `HISTORICAL_SETTINGS` |
| P1-005 | Pre-write `lstat` symlink guard added to both generators — a pre-existing symlink at a generated output path is refused rather than written through. | `writeOutputs` in `sync-agents.cjs` + `sync-prompts.cjs` |
| P1-006 | Phase-004 checklist + implementation-summary reconciled to the shipped state (9/9 P0, 12/12 P1; the three integration gates marked CONFIRMED with live evidence). | `004-integrate-validate-ship/{checklist,implementation-summary}.md` |
| P1-007 | Parent phase map de-staled from all-`Planned` to actual child states: 001/002/003/004 Complete, 000 In progress (its P0/P1 gates are 8/8 and 11/11; the lone open item CHK-024 is an accepted P2 reducer-gap deferral to packet 015). Parent status stays In progress accordingly. | `spec.md` PHASE DOCUMENTATION MAP |

---

## 4. Remediation Workstreams

### WS-1: Sync Gate Repair (P1-002)
1. Regenerate `ai-council.toml` and `context.toml` via `sync-agents.cjs`
2. Rerun `sync-agents.cjs --check` to confirm exit 0
3. Update phase-002 checklist evidence to reflect the current gate state

### WS-2: Parent/Child Contract Reconciliation (P1-003, P1-006, P1-007)
1. Amend parent spec.md handoff criteria to record the approved home-install deferral
2. Reconcile phase-004 ADR vs implementation-summary gate state
3. Update parent phase map to reflect actual child completion states

### WS-3: Security Boundary Hardening (P1-004, P1-005)
1. Add `deep-alignment` to `HISTORICAL_SETTINGS` with `sandbox_mode = "read-only"` OR document intentional workspace-write
2. Add `lstat`/`realpath` containment checks to both sync writers' output paths
3. Document the runtime guarantee if non-symlink roots are assumed

### WS-4: Review Scope Separation (P1-001)
1. Split `reviewScopeFiles` into canon (28) and prompt-parity (37) named surfaces
2. Document the nine excluded canon sources explicitly

---

## 5. Spec Seed

- Amend parent `spec.md` Phase Documentation Map to reflect actual child statuses
- Add explicit deferral record for `~/.codex/prompts/` home installation
- Add `deep-alignment` to `HISTORICAL_SETTINGS` map or document the intentional omission
- Reconcile phase-004 decision-record with implementation-summary gate states

---

## 6. Plan Seed

1. **Task:** Regenerate stale agent TOMLs — `node sync-agents.cjs && sync-agents.cjs --check`
2. **Task:** Add symlink containment guards to `sync-agents.cjs:241-257` and `sync-prompts.cjs:132-149`
3. **Task:** Add `deep-alignment` entry to `HISTORICAL_SETTINGS` at `sync-agents.cjs:20-37`
4. **Task:** Update parent phase map at `spec.md:123-129`
5. **Task:** Reconcile phase-004 ADR/summary/checklist evidence
6. **Task:** Amend parent handoff criteria for home-install deferral

---

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | Seven-family canon scope (28) is internally consistent; phase-003 prompt parity (37) not separately represented |
| `checklist_evidence` | fail | Phase-002 checklist claims 13/13 sync while live gate reports 2 stale; phase-004 has incomplete verification counts |

### Overlay Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `skill_agent` | pass | All 13 OpenCode agent skill-path references resolved to existing paths |
| `agent_cross_runtime` | pass (after normalization) | 13/13/13 structural inventory; semantic Markdown parity after expected runtime formatting/path normalization |
| `feature_catalog_code` | not assessed | No feature catalog in scope |
| `playbook_capability` | not assessed | No testing playbook in scope |

---

## 8. Deferred Items

- CI wiring of the validator/drift/sync gates (explicitly out of scope per parent spec)
- Home-directory prompt installation (`~/.codex/prompts/`) pending operator confirmation
- The `~/.codex/prompts/create` symlink repair pending home-install authorization

---

## Dimension Expansion Map

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none
- Remaining frontier: none recorded

---

## 9. Search Ledger

*No search-depth state captured (legacy v1 record).*

---

## 10. Audit Appendix

### Convergence Summary
- Iterations: 5 (max reached)
- Stop reason: maxIterationsReached (stop_policy=max-iterations)
- newFindingsRatio trend: 1.0 → 0.75 → 0.5 → 0.4 → 0.0
- Dimension coverage: 4/4 (100%)
- All dimensions clean: yes (but P1 findings prevent convergence-based STOP)

### Coverage Summary
- Commands validated: 28/28 family commands exit 0; 50 total command markdown files inventoried
- Agents validated: 26/26 agent markdown files exit 0 (22 documented section-0 warnings)
- Codex prompts: 37/37 in sync via `sync-prompts.cjs --check`
- Codex agents: 13 TOML files (2 STALE: ai-council, context)
- Scripts reviewed: validate_document.py (933 lines), sync-agents.cjs (283 lines), sync-prompts.cjs (174 lines)

### Sources Reviewed
- Parent spec.md, description.json, graph-metadata.json
- 5 child phase doc sets (000-004): spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md, decision-record.md
- 37 command markdown files under .opencode/commands/
- 13 .opencode/agents/*.md + 13 .claude/agents/*.md
- 13 .codex/agents/*.toml
- 37 .codex/prompts/*.md
- 3 key scripts (validate_document.py, sync-agents.cjs, sync-prompts.cjs)
- 000-foundations/lane-config.json + alignment/ artifacts
