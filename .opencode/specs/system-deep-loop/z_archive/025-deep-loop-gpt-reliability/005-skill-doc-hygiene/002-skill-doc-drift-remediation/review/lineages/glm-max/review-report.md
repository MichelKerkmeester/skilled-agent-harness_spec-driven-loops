# Review Report — Skill Documentation Drift Remediation (lineage: glm-max)

> Independent fan-out deep-review of phase `015-skill-doc-drift-remediation`.
> Executor: `cli-opencode model=zai-coding-plan/glm-5.2` | sessionId: `fanout-glm-max-1782925103545-7vw78n`
> Stop reason: `maxIterationsReached` (5/5; composite convergence reached at 0.78 but stopPolicy=max-iterations per fan-out config).

---

## 1. Executive Summary

**Verdict: CONDITIONAL**

- Active findings: **P0 = 0**, **P1 = 1** (F001), **P2 = 1** (F002). `hasAdvisories: true`.
- `releaseReadinessState: release-blocking` (active P1 present).
- Scope: independent verification that phase 015's 6 drift clusters were patched to match current runtime reality, with no residual drift, no new stale claims, and no regressions.
- Convergence reason: all 4 dimensions covered with ≥1 full iteration; semantic signals `all_support_stop` (semanticNovelty 0.06, findingStability 0.93); terminal stop driven by `maxIterationsReached` per fan-out `stopPolicy=max-iterations`.

**Headline:** The remediation is substantively sound. All 6 clusters were independently re-verified against the live repo — every claimed edit matches reality, the scanner runs clean, vitest reproduces exactly (411/413), and `validate.sh --strict` passes. The phase does **not** block on any of its own acceptance criteria. The CONDITIONAL verdict comes from **one residual internal contradiction** (F001) that the phase's Cluster-1 sweep did not fully reconcile, plus one advisory reproducibility gap (F002).

---

## 2. Planning Trigger

Routes to **`/speckit:plan`** because `activeP1 > 0` (F001). F001's remediation is a one-line edit to `manual_testing_playbook.md:362` (drop `ai-council` from "repo-defined primaries", or reframe it as a subagent routed via orchestrate). F002 is a checklist-command-path fix. Neither requires re-architecting; both are documentation completeness fixes. If the operator accepts F001's recorded downgradeTrigger (treating line 362 as part of the explicitly-excluded pre-existing ai-council naming mismatch), F001 downgrades to P2 and the verdict becomes PASS-with-advisories.

---

## 3. Active Finding Registry

| ID | Sev | Dim | Title | file:line | first/last | Status |
|----|-----|-----|-------|-----------|------------|--------|
| **F001** | P1 | traceability | Residual ai-council "primary" classification contradicts Cluster 1 intent, SKILL.md, and the registry | `.opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md:362` | 3 / 5 | active |
| **F002** | P2 | maintainability | CHK-010 verification command non-reproducible (`python3` on a `.sh`; ambiguous path) | `.opencode/specs/.../015-skill-doc-drift-remediation/checklist.md:59` | 4 / 5 | active |

### F001 — detail
Line 362 states cli-opencode "distinguishes 4 primary agents (... orchestrate + **ai-council as repo-defined primaries**)". Refuted by: (a) `.opencode/agents/ai-council.md:4` `mode: subagent`; (b) `SKILL.md:31` & `:285` (three primaries: general/plan/orchestrate); (c) `SKILL.md:292` (ai-council is `mode: subagent`, "rejected at the top level"). Same defect category as Cluster 1, in a file the phase edited (T004), at a line outside the cited 417–423 range. **Provenance:** git blame → authored 2026-05-30 (pre-existing, not the remediation commit a3c983639e). Adjudication packet in `iterations/iteration-003.md`; confidence 0.72; downgradeTrigger recorded.

### F002 — detail
CHK-010 cites `python3 check-comment-hygiene.sh` but the script is a POSIX `.sh` (wrong interpreter) and lives at `system-spec-kit/scripts/rules/` or `sk-code/scripts/` (ambiguous path). **Substance is clean** — the real script exits 0 on `scan-integration.cjs`. Defect is documentation reproducibility only.

---

## 4. Remediation Workstreams

**Lane A — Cluster-1 intent completion (F001, P1):**
1. Edit `manual_testing_playbook.md:362`: remove `ai-council` from "repo-defined primaries" or reframe as a subagent routed via `orchestrate`/`/deep:ai-council` (consistent with `SKILL.md:292`).
2. Re-grep `cli-opencode` for `ai-council.*primary` to confirm zero residual primary classifications.
3. (Optional) decide whether line 362 falls under the spec's explicitly-excluded pre-existing ai-council naming mismatch → if so, record the downgrade F001→P2 and re-classify verdict to PASS-with-advisories.

**Lane B — Verification reproducibility (F002, P2):**
1. Fix `checklist.md:59` CHK-010 command: cite the correct path (`system-spec-kit/scripts/rules/check-comment-hygiene.sh`) and interpreter (`bash`, not `python3`).
2. Optionally add the exact cwd requirement to CHK-022's vitest command (`scripts/` dir) for full reproducibility.

---

## 5. Spec Seed

- `spec.md` §3 In-Scope Cluster 1: consider widening the acceptance grep in REQ-001 from the literal `--agent ai-council` token to also flag affirmative "ai-council ... primary / directly invokable" framing, so F001's class is caught by the acceptance criterion rather than only by intent.
- `spec.md` §9 Open Questions / Out-of-Scope: clarify whether the "pre-existing ai-council naming mismatch" exclusion covers the primary-vs-subagent *classification* (F001) or only the `@deep-ai-council` *naming*.

---

## 6. Plan Seed

- `T-F001`: Patch `manual_testing_playbook.md:362` (drop ai-council from primaries). Verify: `rg -n "ai-council.*primary" .opencode/skills/cli-opencode/` returns zero living-doc hits.
- `T-F002`: Correct `checklist.md:59` CHK-010 command path/interpreter; re-run to confirm exit 0.
- `T-FOLLOWUP`: Track D001 (restore `test-fixtures/060-stress-test/` fixture dir) as a separate task — pre-existing, broader than this phase, correctly deferred.

---

## 7. Traceability Status

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| spec_code | core (hard) | **pass** | REQ-001..005 all substantively green; clusters verified against live repo |
| checklist_evidence | core (hard) | **partial** | F002: one cited command non-reproducible; all others verified |

**REQ acceptance (independent re-verification):**
| REQ | Criterion | Result | Evidence |
|-----|-----------|--------|----------|
| REQ-001 | No direct `--agent ai-council` guidance | LITERAL PASS / INTENT GAP (F001) | grep literal = all rejection-framed; but playbook.md:362 still calls ai-council a primary |
| REQ-002 | No `.opencode/agents/*.toml` in 5 SKILLs + scanner + 6 docs | **PASS** | zero hits across deep-loop-workflows/deep-loop-runtime/cli-opencode |
| REQ-003 | plugins/README count = real 6-file dir | **PASS** | "Six"; 6 actual `.js` files; mk-deep-loop-guard.js row present |
| REQ-004 | Cluster 6 resolved per investigation | **PASS** | SKILL.md:292-295 internally consistent; orchestrate.md @deep-review row intact |
| REQ-005 | No regressions | **PASS** (substance) | vitest 411/413 exactly; comment-hygiene exit 0; validate.sh PASS |

---

## 8. Deferred Items

- **D001** (deferred, phase correctly documented): `deep-improvement/.../agent-discipline-stress-tests/setup-cp-sandbox.sh` references a `.toml` fixture, but the entire `test-fixtures/060-stress-test/` dir is MISSING — pre-existing, broader than the TOML removal. Phase's Known Limitations #1 is accurate. Not blocking.
- **D002** (advisory): deferral-consistency note — phase fixed `.toml` playbook refs in deep-research/deep-review (T013) but deferred deep-improvement's. Defensible (whole fixture dir missing); noted for a future fixture-restoration task.
- **Repo-wide `.toml` outside stated scope:** all residual `.toml` agent-mirror references outside `deep-loop-workflows/deep-loop-runtime/cli-opencode` live in historical specs (`z_archive`, iteration files) or retired skills (`cli-codex-retired`), correctly preserved per spec NFR; project-config `.toml` (Cargo.toml, pyproject.toml) are unrelated. Consistent with phase's Known Limitations #3.

---

## 9. Audit Appendix

### Iteration table
| Run | Focus | Dimensions | New (P0/P1/P2) | Ratio | Verdict |
|-----|-------|-----------|-----------------|-------|---------|
| 1 | correctness (C1, C4, REPO_ROOT) | correctness | 0/0/0 | 0.00 | PASS |
| 2 | security + Cluster 5 | security | 0/0/0 | 0.00 | PASS |
| 3 | traceability/spec-alignment | traceability | 0/1/0 | 0.50 | CONDITIONAL |
| 4 | maintainability/completeness | maintainability | 0/0/1 | 0.17 | CONDITIONAL |
| 5 | adversarial replay + breadth | all | 0/0/0 | 0.00 | CONDITIONAL |

### Convergence signal replay
- compositeStopScore: 0.78 (≥ 0.60) — would vote STOP
- rollingAverage: STOP (0.0 over iters 4–5) | madNoiseFloor: STOP | dimensionCoverage: STOP (4/4)
- semanticVerdict: `all_support_stop` (semanticNovelty 0.06, findingStability 0.93)
- **Terminal stopReason: `maxIterationsReached`** (stopPolicy=max-iterations; convergence treated as telemetry only, per fan-out directive to broaden angles instead of synthesizing early)
- Legal-stop gate bundle: all 9 gates pass (activeP0=0; claim-adjudication packets present for F001)

### File coverage matrix
| Cluster / target | Verified | Method |
|------------------|----------|--------|
| C1 ai-council (cli-opencode 5 files) | clean (intent gap F001) | rg literal + framing read |
| C2/3 .toml in 5 deep-loop SKILLs + 2 sub-docs | clean | rg across deep-loop tree |
| C4 scan-integration.cjs MIRROR_TEMPLATES | clean (2 entries) | read + smoke test exit 0 |
| C4 deep-improvement 6 docs | clean | rg (only codex `.codex/n` + historical) |
| C5 plugins/README | exact (6) | read + dir listing |
| C6 cli-opencode wording | consistent | read SKILL.md:285-300; orchestrate.md intact |
| REPO_ROOT (2 scripts) | correct (6 `..`) | path arithmetic |
| vitest (REQ-005) | 411/413, no regression | `npx vitest run` from `scripts/` cwd |
| validate.sh --strict | PASS (0/0) | bash invocation |
| comment-hygiene | clean (substance) | real script exit 0 (F002 = command-path only) |

### Dimension breakdown
- **correctness**: green — all edits match runtime reality; no fabricated claims.
- **security**: green — no secrets, no permission/scope changes; claimed `.claude/agents` mirrors verified present.
- **traceability**: 1×P1 (F001) — REQ sweep green except the Cluster-1 intent gap.
- **maintainability**: 1×P2 (F002) — residual-drift sweep complete; one verification-command reproducibility gap.

---

*Lineage: glm-max | Fan-out sibling: gpt-fast-high (strongest-restriction merge applies — any lineage active P0 → merged FAIL; this lineage has activeP0=0).*
