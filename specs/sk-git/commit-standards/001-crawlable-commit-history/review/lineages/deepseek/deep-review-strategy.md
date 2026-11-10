---
title: Deep Review Strategy — sk-git/028-crawlable-commit-history (deepseek lineage)
description: Persistent brain for the deepseek fan-out lineage deep review of the crawlable-commit-history packet.
---

# Deep Review Strategy — sk-git/028-crawlable-commit-history

## 1. REVIEW CHARTER

- Target: `.opencode/specs/sk-git/028-crawlable-commit-history` (spec-folder, phase-parent + 7 children)
- Dimensions: correctness, security, traceability, maintainability
- Stop conditions: `stopPolicy=max-iterations`; iteration cap 4 reached → synthesis with `stopReason: maxIterationsReached`.
- Success criteria: all four dimensions covered; core protocols run; iteration files carry final-line verdicts; synthesis emitted.

---

## 2. TOPIC

Deep review of the crawlable commit history packet: the frozen commit grammar, the `commit-msg` / `prepare-commit-msg` hooks, the commit-id allocator, the history-rewrite scripts, the search surface, the docs/release metadata, and the git run-failure hardening.

---

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness, Logic errors, off-by-one, wrong return types, broken invariants
- [x] D2 Security, Injection, auth bypass, secrets exposure, unsafe deserialization
- [x] D3 Traceability, Spec/code alignment, checklist evidence, cross-reference integrity
- [x] D4 Maintainability, Patterns, clarity, documentation quality, safe follow-on change cost
<!-- MACHINE-OWNED: END -->

---

## 4. NON-GOALS

- No implementation fixes — observation only; target files read-only.
- No re-run of the history-rewrite rehearsal (write containment); evidence audited by reading.
- No review of the 58 unrebased branches or the 20 worktrees (declared out of scope by spec.md).

---

## 5. STOP CONDITIONS

- Reached: iteration 4 completed → synthesis with `stopReason: maxIterationsReached`.

---

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | CONDITIONAL | 1, replayed 4 | 1 P1 (trailer position unenforced, F001) + 3 P2 on hook/allocator precision |
| D2 Security | PASS | 2, rechecked 4 | 4 P2 (hook execution trust F005, log redaction F006, symlink write F007, env validation F008) |
| D3 Traceability | PASS* | 3, extended 4 | 5 P2 + 1 P1 (F013, unshipped advisory rule); protocols: spec_code partial, checklist_evidence partial, feature_catalog pass, playbook partial |
| D4 Maintainability | CONDITIONAL | 4 | 2 P2 (README overclaim F014, stale catalog stamp F015) |

*Iteration-3 verdict line was PASS by the iteration mapping (P2-only); F013 was found in iteration 4.
<!-- MACHINE-OWNED: END -->

---

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 2 active (F001, F013)
- **P2 (Minor):** 13 active
- **Delta this iteration:** +0 P0, +1 P1, +2 P2
- **Final:** 15 findings, 0 resolved, 0 disproved; `persistentSameSeverity` covers F001-F012
<!-- MACHINE-OWNED: END -->

---

## 8. WHAT WORKED

- Reading the actual hook bytes first, then replaying the failure with `git interpret-trailers --parse` (read-only), turned F001 from an inference into a demonstrated behavior (iteration 4).
- Walking the parent spec's Files-to-Change table row by row against the tree surfaced F009 and, later, F013 (iterations 3-4).
- Checking the operator's global `core.hooksPath` and its symlink inventory grounded the F005 security assessment instead of speculating (iteration 2).
- Cross-checking checked tasks against phase artifacts separated real completion (174/180) from template boilerplate (iteration 3).

## 9. WHAT FAILED

- Attempting to execute GIT-044 end-to-end: hook installation is a write outside the lineage surface; the scenario was verified by reading its commands against the hook code instead (iteration 3).
- Trying to attribute the RCE-class exposure to this packet alone: the pattern predates it (pre-commit/post-merge source repo files under a global install), so the finding was framed as systemic (iteration 2).

---

## 10. EXHAUSTED APPROACHES (do not retry)

### Hook position semantics — PRODUCTIVE (iteration 4)
- What worked: `git interpret-trailers --parse` on stdin reproduces the exact reader gap; any future fix can use the same test.
- Prefer for: re-verifying F001 after remediation.

### Test-suite re-execution — BLOCKED (iteration 1, constraint)
- What was tried: planned harness runs for commit-msg/allocator suites.
- Why blocked: lineage write containment forbids commands that create files outside the lineage directory.
- Do NOT retry: audit harness claims by reading test sources and recorded verification tables; use only read-only tool invocations for replay.

---

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
<!-- MACHINE-OWNED: START -->
- Completed pivots: 4 (D1, D2, D3, D4)
- Failed pivots: 0
- Audited overrides: 1 (security-sensitive stabilization re-check in iteration 4)
- Swept: correctness, security, traceability, maintainability
- Pivot lineage: 1→2→3→4 (dimension rotation, no repeats except the stabilization replay)
- Remaining frontier: none recorded (cap reached; candidate next angles listed under Deferred Items in the report)
<!-- MACHINE-OWNED: END -->

---

## 11. RULED OUT DIRECTIONS

- Re-running the full-scale filter-repo rehearsal: writes outside the lineage; audited from the recorded rehearsal report (iterations 1-4).
- Treating the machine-wide hook execution pattern as this packet's P0: counterevidence (pre-packet pre-commit/post-merge pattern) held it at P2 with a systemic framing (iteration 4).

---

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
- Review complete. Next focus for the operator: `/speckit:plan` on WS1 (F001) and WS2 (F013); then the packet's own gates (005 push window, 006 advisor probe) after merge.
<!-- MACHINE-OWNED: END -->

---

## 13. KNOWN CONTEXT

- Parent spec is phase-parent lean; all detailed artifacts live in the 7 child folders.
- `resource-map.md` not present. Skipping coverage gate.
- Rehearsal evidence: `005-history-rewrite/implementation-summary.md` — INVARIANTS PASS, 111,686 messages checked, residue 0, 109 on-line tags.
- The push to origin is still pending; phase 006 waits on the post-merge advisor probe.

### Bounded Context Snapshot (final)

- Target pointers: as recorded in Files Under Review below; all primary surfaces read.
- Behavior claims verified: hook contract (F001-F004), allocator behavior, rewrite invariants (recorded), catalog/playbook claims, advisor vocabulary.
- Review risks and gaps: hook suites not re-executed (constraint); rehearsal not reproducible in-lineage; F005 systemic remediation out of packet scope.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 3, 4 | 14/16 Files-to-Change rows resolve; F013 unshipped advisory rule; F009/F010 accuracy defects |
| `checklist_evidence` | core | partial | 3 | 174/180 checked items trace to artifacts; 6 L3+ compliance items lack evidence (F011) |
| `feature_catalog_code` | overlay | pass | 3 | Commit Identity And Search subsection + root sentence + real source files |
| `playbook_capability` | overlay | partial | 3 | GIT-044 real; executable after hook installation (006 T010) |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.opencode/specs/sk-git/028-crawlable-commit-history/spec.md` | D3, D4 | 4 | 2 P2, 1 P1 | complete |
| `.opencode/skills/sk-git/SKILL.md` | D1, D3 | 3 | 1 P1 (via F001), 1 P2 (F004) | complete |
| `.opencode/skills/sk-git/README.md` | D4 | 4 | 1 P2 (F014) | complete |
| `.opencode/skills/sk-git/feature-catalog/feature-catalog.md` | D3, D4 | 4 | 1 P2 (F015) | complete |
| `.opencode/skills/sk-git/feature-catalog/workflow-playbooks/conventional-commit-workflows.md` | D3 | 3 | 0 | complete |
| `.opencode/skills/sk-git/assets/commit-message-template.md` | D1, D4 | 4 | 0 | complete |
| `.opencode/skills/sk-git/references/commit-workflows.md` | D1, D4 | 4 | 0 | complete |
| `.opencode/skills/sk-git/references/quick-reference.md` | D3, D4 | 4 | 1 P2 (F015 class) | complete |
| `.opencode/skills/sk-git/scripts/commit-id-naming.sh` | D1, D2 | 2 | 1 P2 (F003) | complete |
| `.opencode/skills/sk-git/scripts/lib/git-rule-checks.mjs` | D3 | 4 | 1 P1 (F013) | complete |
| `.opencode/scripts/git-hooks/commit-msg` | D1, D2 | 2 | 1 P1, 3 P2 | complete |
| `.opencode/scripts/git-hooks/prepare-commit-msg` | D1, D2 | 2 | 1 P2 (F004), 2 P2 security | complete |
| `.opencode/scripts/git-hooks/post-merge`, `install-git-hooks.sh`, `tests/commit-msg.test.sh` | D1, D2 | 2 | 0 (support evidence) | complete |
| `005-history-rewrite/scripts/*` | D1, D2 | 2 | 3 P2 (F006-F008 class: F006, F007; F008 in hook) | complete |
| `006-docs-and-release`, `007-git-workflow-run-failures` docs | D3 | 3 | 2 P2 (F011, plus status notes) | complete |
| `AGENTS.md`, `REPO RULES.md`, `repo-rules/delegation-and-orchestration.md` | D3 | 3 | 2 P2 (F009, F010) | complete |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 4 (reached)
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1 (satisfied in iteration 4)
- Session lineage: sessionId=fanout-deepseek-1789125627716-t7qggd, parentSessionId=null, generation=1, lineageMode=auto
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress (set) | converged | release-blocking
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[feature_catalog_code, playbook_capability]
- Started: 2026-09-11T11:21:00Z · Completed: 2026-09-11T12:05:00Z
<!-- MACHINE-OWNED: END -->
