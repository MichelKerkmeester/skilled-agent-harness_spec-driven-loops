# Deep Review Report — sk-git/028-crawlable-commit-history

- **Session**: `fanout-deepseek-1789125627716-t7qggd` (lineage `deepseek`, mode review, execution AUTONOMOUS)
- **Target**: `.opencode/specs/sk-git/028-crawlable-commit-history` (spec-folder, phase-parent + 7 children)
- **Executor**: cli-pi / deepseek-v4.1-flash (reasoning max)
- **Stop policy**: `max-iterations`, cap 4 → `stopReason: maxIterationsReached` (convergence was never the stop condition; see Audit Appendix)

---

## 1. Executive Summary

**Verdict: CONDITIONAL.** Two active P1 findings and thirteen P2 advisories; no P0. `hasAdvisories: false` by the contract's definition (the flag is set only on a PASS verdict with P2s). Release readiness: `in-progress` — the packet's own two operator gates (005 push window, 006 advisor probe) remain open, matching its documented status.

Scope reviewed: the parent directive, all seven child phases, the sk-git contract surface (SKILL.md, README, template, commit-workflows, quick-reference), the `commit-msg` / `prepare-commit-msg` hooks and their suites, the commit-id allocator, the preflight rule engine, the feature catalog, the GIT-044 playbook scenario, the 005 rewrite toolchain, the 006 docs/governance wiring, and the 007 run-safety changes.

| Severity | Active | Blocking? |
|---|---|---|
| P0 | 0 | — |
| P1 | 2 | CONDITIONAL verdict; remediation plan below |
| P2 | 13 | advisories |

The packet is coherent and its central machinery is well tested. The two P1s are precision failures rather than breakage: the blocking hook validates trailer keys anywhere in the body while every advertised reader parses only the final paragraph, and a scoped deliverable (the preflight advisory rule for the new commit shape) was dropped between the parent spec and phase execution without a recorded decision.

---

## 2. Planning Trigger

Verdict CONDITIONAL → route to `/speckit:plan` for the remediation workstreams below before any changelog step. A PASS would have routed to `/create:changelog`; the P1s must be closed first, and the P2 advisories can travel as a cleanup lane inside the same plan.

---

## 3. Active Finding Registry

| ID | Severity | Dimension | Title | Evidence |
|----|----------|-----------|-------|----------|
| F001 | P1 | correctness | Trailer-position contract unenforced; advertised `%(trailers:)` reader can miss accepted keys | `commit-msg:150-167`; `SKILL.md:491-493`; `changelog/v1.6.0.0.md:22`; GIT-044 `:49` |
| F013 | P1 | traceability | Scoped preflight advisory rule and `git-rule-checks.mjs` row unshipped, no supersession decision | `spec.md:86,108`; `git-rule-checks.mjs:167-435`; `README.md:53` |
| F002 | P2 | correctness | `Fixes:`/`Closes:` colon-form trailers unrecognized | `commit-msg:121` |
| F003 | P2 | correctness | Quoted `Commit-Id:` text poisons collision scan and allocator high-water | `commit-msg:155-158`; `commit-id-naming.sh:66-69` |
| F004 | P2 | correctness | `--amend -m` re-mints an id despite the unconditional "amend keeps its id" claim | `prepare-commit-msg:7-8,173-176`; `SKILL.md:493` |
| F005 | P2 | security | Machine-wide hook model executes a repository-controlled allocator path (systemic; pre-existing pattern) | `prepare-commit-msg:39-50,191`; `install-git-hooks.sh:34-37`; global hooksPath configured |
| F006 | P2 | security | Unredacted `SOURCE` URL (possible token) persisted into `rewrite.log` and push lines | `rewrite-run.sh:107,575` |
| F007 | P2 | security | Remap writes through file symlinks outside `--root` | `remap-citations.py:125-135,160-168` |
| F008 | P2 | security | `SPECKIT_COMMIT_SPEC` unvalidated; newline can forge trailer lines | `prepare-commit-msg:242-244`; `commit-msg:121` |
| F009 | P2 | traceability | `REPO RULES.md` Files-to-Change row superseded by ADR-005 but still open in the table | `spec.md:117`; `decision-record.md:437` |
| F010 | P2 | traceability | Governance claim "refuses a hand-written id" overstates enforcement | `AGENTS.md:343`; `commit-msg:152-165`; `prepare-commit-msg:174-186` |
| F011 | P2 | traceability | L3+ compliance checklist items checked without evidence in 006 and 007 | `006/tasks.md:224-227`; `007/tasks.md:224-227` |
| F012 | P2 | traceability | Duplicate scaffold phase row says Pending beside the completed phase-7 row | `spec.md:137` vs `:139` |
| F014 | P2 | maintainability | README "always-stamped" overstates the fail-open stamper | `README.md:28,155`; `prepare-commit-msg:191-194` |
| F015 | P2 | maintainability | `feature-catalog.md last_updated` stale after this packet's edit | `feature-catalog.md:9`; commit `9cb5e9c4a4` |

Adjudication: every P0/P1 candidate carried a typed packet during its iteration; no finding was downgraded, upgraded, resolved or disproved, so original severities stand (registry `persistentSameSeverity`). F001 was replayed against `git interpret-trailers --parse` during iteration 4 and confirmed: a message with keys followed by prose parses to nothing.

---

## 4. Remediation Workstreams

**WS1 — Hook enforcement precision (F001, F002, F003, F004; order F001 first).**
Targets: `.opencode/scripts/git-hooks/commit-msg`, `.opencode/scripts/git-hooks/prepare-commit-msg`, `.opencode/scripts/git-hooks/tests/commit-msg.test.sh`. Add a final-paragraph check for `Spec:`/`Commit-Id:` (F001) with a positional test case; widen the trailer whitelist to the colon forms (F002); bound the collision/high-water scans to trailer-block lines or document the quoted-id behavior (F003); align the amend wording or make `--amend -m` behave as documented (F004).

**WS2 — Scope reconciliation (F013 first, then F009, F012).**
Either implement the preflight advisory rule for the new shape in `git-rule-checks.mjs` with a test (matches `spec.md:86,108`), or record an ADR that the blocking hook supersedes it; repair the `REPO RULES.md` row and delete the duplicate phase row in `spec.md`.

**WS3 — Claim and metadata accuracy (F010, F014, F011, F015).**
Adjust `AGENTS.md:343` and `README.md` wording to the fail-open reality; evidence or retire the checked compliance items; refresh `last_updated` on the catalog.

**WS4 — Rewrite-tooling hardening (F006, F007, F008; F005 as a framework follow-up).**
Redact credentialed URLs in `rewrite-run.sh` logs; skip symlinks in `remap-citations.py`; validate `SPECKIT_COMMIT_SPEC` shape. F005's systemic exposure (a machine-wide hook executing repo-controlled content) should be raised to the hooks framework owner, not patched in this packet alone.

---

## 5. Spec Seed

Minimal spec delta implied by the findings:

- `spec.md` §3: add an explicit disposition for the preflight advisory rule (implement, or mark superseded by the blocking hook) and repair the `REPO RULES.md` row per ADR-005.
- `spec.md` PHASE DOCUMENTATION MAP: remove the stale `[Phase 7 scope] | Pending` row.
- Child 006: record the checklist-evidence disposition for CHK-130..133 in both 006 and 007.
- A short requirements note that the commit contract's reader API (`%(trailers:)`) defines the positional requirement the hook must enforce.

## 6. Plan Seed

1. T1 (F001): add final-paragraph enforcement + test case in `commit-msg.test.sh`; verify with `git interpret-trailers --parse`.
2. T2 (F013): implement the advisory rule in `git-rule-checks.mjs` + rule-engine test, OR write the supersession ADR; update `spec.md` accordingly.
3. T3 (F002/F003/F004): hook precision fixes with one test each.
4. T4 (F009/F010/F012/F014/F015): documentation/claim repairs.
5. T5 (F006/F007/F008): script hardening + tests; F005 escalated to the hook-framework owner.
6. T6: rerun all hook/allocator suites and `git interpret-trailers` replay; then re-issue this review's P1 checks.

## 7. Traceability Status

| Protocol | Level | Status | Result |
|----------|-------|--------|--------|
| `spec_code` | core | **partial** | 14/16 Files-to-Change rows resolve; F013 (unshipped advisory rule) is a real scope gap; F009/F010 are accuracy defects |
| `checklist_evidence` | core | **partial** | 174/180 checked items trace to artifacts; 6 L3+ compliance items have no evidence (F011) |
| `feature_catalog_code` | overlay | **pass** | "Commit Identity And Search" subsection, root sentence, and source-file table all resolve to real files |
| `playbook_capability` | overlay | **partial** | GIT-044 commands and anchors are real; executable only after the hooks are installed (post-merge, 006 T010) |

Unresolved gaps: the two operator-gated items the packet already tracks (005 push window T010; 006 advisor probe T010) — correctly marked blocked, not findings.

---

## 9. Deferred Items

- **P2 advisories** (F002-F012, F014, F015): listed in the registry; none blocks a release, all are eligible for the WS2-WS4 cleanup lane.
- **F005 systemic note**: the repo-controlled-execution pattern in machine-wide hooks predates this packet (`pre-commit:16-19`, `post-merge:24-27`); a framework-level decision is needed.
- **GIT-044 execution**: the scenario cannot pass in the current tree because the stamper hook is not installed; schedule after merge alongside 006 T010.
- **Rewritten-history validation**: the citation remap and invariants were verified from the recorded rehearsal evidence, not re-executed in this review (lineage write containment); re-verify after the operator window.

---

## 10. Audit Appendix

### Iteration ledger

| # | Focus | Dimensions | New findings | Verdict (final line) | File |
|---|-------|-----------|--------------|----------------------|------|
| 1 | Correctness | D1 | 0/1/3 | CONDITIONAL | `iterations/iteration-001.md` |
| 2 | Security | D2 | 0/0/4 | PASS | `iterations/iteration-002.md` |
| 3 | Traceability | D3 | 0/0/4 | PASS | `iterations/iteration-003.md` |
| 4 | Maintainability + stabilization | D4, D3 residual | 0/1/2 | CONDITIONAL | `iterations/iteration-004.md` |

### Convergence replay (full-history, JSONL-only)

All four iteration records carry `newFindingsRatio: 1.0`; rolling-average and MAD signals would vote CONTINUE, and every dimension plus stabilization is covered. The run stopped by policy: `stopPolicy=max-iterations`, cap 4, `stopReason: maxIterationsReached`. No `blocked_stop` was emitted; no STOP was claimed; convergence telemetry was deliberately ignored as instructed for this lineage. Claim adjudication passed for the two P1 packages (F001 iteration 1, F013 iteration 4).

### Dimension breakdown

| Dimension | Iteration(s) | Findings |
|---|---|---|
| Correctness | 1 (+replay 4) | F001(P1), F002, F003, F004 |
| Security | 2 (+recheck 4) | F005-F008 |
| Traceability | 3, 4 | F009-F013 |
| Maintainability | 4 | F014, F015 |

### Evidence limits

- Test suites were audited by reading, not re-executed (lineage write containment forbids harness runs that create external scratch trees).
- The history-rewrite rehearsal was audited from `005-history-rewrite/implementation-summary.md` (INVARIANTS: PASS, 111,686 messages checked, residue 0).
- F001 was re-verified with `git interpret-trailers --parse` on stdin — a read-only tool invocation.

- **stopReason: maxIterationsReached**
