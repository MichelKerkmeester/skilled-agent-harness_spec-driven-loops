---
title: "Deep Review Report: Hook Runtime Relocation — Re-Review After Phase 6 Remediation (GLM Lineage)"
description: "3-iteration re-review (cli-devin glm-5-2, stop_policy=max-iterations) of the .opencode/runtime-hooks/ relocation after Phase 6 P1 remediation. Verdict: FAIL, P0=4 P1=4 P2=1 — 4 broken live imports discovered via repo-wide stale-path sweep."
importance_tier: normal
contextType: general
version: 1
---

# Deep Review Report: Hook Runtime Relocation — Re-Review (GLM Lineage)

---

## 1. Executive Summary

**Verdict: FAIL** (hasAdvisories: true — 1 P2 advisory)

- **P0: 4** | **P1: 4** | **P2: 1** (all active, 0 resolved, 0 duplicates)
- 3 iterations completed (`stop_policy=max-iterations`), dimensions: correctness (iter 1), security (iter 2), traceability+maintainability (iter 3)
- Executor: `cli-devin`, model `glm-5-2` — fan-out lineage `glm`
- **Review scope**: the `.opencode/runtime-hooks/` relocation (commit `40d5f0d2b3`) + the uncommitted Phase 6 P1 remediation (T017-T024), on worktree branch `skilled/0118-hook-runtime-relocation`
- **The 6 original P1 findings are correctly fixed** (REQ-008 through REQ-013 all verified PASS). However, a repo-wide stale-path sweep — which neither the prior 5-iteration review nor the Phase 6 remediation performed — discovered **4 P0 broken live imports** in 2 skill trees (`system-spec-kit`, `sk-git`) that were not in the relocation's documented "surfaces changed" list. These are production hooks wired across 5 runtime configs that will crash with `ERR_MODULE_NOT_FOUND` when they fire.

**Root cause of the P0s**: The relocation commit `40d5f0d2b3` moved `dispatch-rule-checks.mjs` from `cli-opencode/scripts/lib/` to `.opencode/runtime-hooks/dispatch/lib/`, and updated the import paths in `.pi/extensions/*.ts` and `.opencode/plugins/mk-*.js` — but did NOT update 4 consumer files in other skill trees that imported the same file via relative path. The prior review's R4-P1-001 found 2 stale playbook paths but its grep was scoped to playbook files only; the Phase 6 remediation fixed those 2 and re-verified only those 2, never performing the repo-wide sweep that REQ-003/CHK-011 [P0] actually claims.

## 2. Planning Trigger

`/speckit:plan` **is required** before merge — 4 active P0 findings need immediate remediation.

```json Planning Packet
{
  "triggered": true,
  "verdict": "FAIL",
  "hasAdvisories": true,
  "activeFindings": { "P0": 4, "P1": 4, "P2": 1 },
  "remediationWorkstreams": [
    "Fix 4 broken imports of dispatch-rule-checks.mjs in system-spec-kit and sk-git skill trees (F001-F004, P0)",
    "Fix 3 stale doc references to moved-away adapter paths (F006-F008, P1)",
    "Correct CHK-011 evidence row to reflect the actual (not overstated) verification scope (F009, P1)",
    "Consider entropy-based credential redaction alongside the allowlist (F005, P2 advisory)"
  ],
  "specSeed": "Amend spec.md REQ-003 to require a repo-wide grep sweep (not just playbook files) before CHK-011 can be marked [x]. Add the 4 newly-discovered consumer files to the 'Surfaces Changed' table.",
  "planSeed": "New remediation phase: (1) repoint the 4 broken imports to .opencode/runtime-hooks/dispatch/lib/dispatch-rule-checks.mjs, (2) fix the 3 stale doc references, (3) correct CHK-011, (4) re-run git-rule-checks.test.mjs to confirm the fix.",
  "findingClasses": ["cross-consumer", "stale-doc-reference", "evidence-overclaim"],
  "affectedSurfacesSeed": [
    ".opencode/skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs",
    ".opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs",
    ".opencode/skills/sk-git/scripts/lib/advisory-noise-audit.mjs",
    ".opencode/skills/sk-git/scripts/lib/git-rule-checks.test.mjs",
    ".opencode/skills/cli-external-orchestration/cli-codex/references/hook-contract.md",
    ".opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk-doc-known-deviations.md",
    ".opencode/skills/.loop-guard-state/README.md",
    ".opencode/specs/system-speckit/033-hook-runtime-relocation-review/checklist.md"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

| ID | Sev | Title | Dimension | File:Line | Class | Pre-existing or introduced |
|----|-----|-------|-----------|-----------|-------|------------------------------|
| F001 | P0 | `permission-request-policy.mjs` imports moved-away `dispatch-rule-checks.mjs` (wired as live Devin hook) | correctness | `.opencode/skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs:22` | cross-consumer | **Introduced by the relocation** (commit `40d5f0d2b3` moved the target, did not update this consumer) |
| F002 | P0 | `git-preflight-advisory.mjs` imports moved-away `dispatch-rule-checks.mjs` (wired in 4 runtimes) | correctness | `.opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:31` | cross-consumer | **Introduced by the relocation** |
| F003 | P0 | `advisory-noise-audit.mjs` imports moved-away `dispatch-rule-checks.mjs` | correctness | `.opencode/skills/sk-git/scripts/lib/advisory-noise-audit.mjs:29` | cross-consumer | **Introduced by the relocation** |
| F004 | P0 | `git-rule-checks.test.mjs` imports moved-away `dispatch-rule-checks.mjs` (test not re-run during Phase 6) | correctness | `.opencode/skills/sk-git/scripts/lib/git-rule-checks.test.mjs:24` | cross-consumer | **Introduced by the relocation** |
| F005 | P2 | Credential redaction remains allowlist-based (novel credential shapes still escape) | security | `.opencode/runtime-hooks/dispatch/lib/dispatch-audit.mjs:112-141` | design-limitation | Pre-existing design limitation, not a regression |
| F006 | P1 | 3 stale adapter path references in codex hook-contract doc | traceability | `.opencode/skills/cli-external-orchestration/cli-codex/references/hook-contract.md:92,94,96` | stale-doc-reference | **Introduced by the relocation** |
| F007 | P1 | Stale path reference in deep-alignment known-deviations doc | traceability | `.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk-doc-known-deviations.md:94` | stale-doc-reference | **Introduced by the relocation** |
| F008 | P1 | Stale `dispatch-guard.cjs` path in loop-guard-state README | traceability | `.opencode/skills/.loop-guard-state/README.md:19,107` | stale-doc-reference | **Introduced by the relocation** |
| F009 | P1 | CHK-011 [P0] evidence row overstates stale-path verification scope (same overclaim class as prior R4-P1-001) | traceability | `.opencode/specs/system-speckit/033-hook-runtime-relocation-review/checklist.md:58` | evidence-overclaim | **Introduced by the remediation** — the Phase 6 fix narrowed the re-verification to only the 2 playbook files |

## 4. Remediation Workstreams

### P0 — Required before merge (blocks all progress)

1. **F001-F004 (broken imports)** — Repoint all 4 imports from `../../../cli-external-orchestration/cli-opencode/scripts/lib/dispatch-rule-checks.mjs` to the new location. The correct relative path from each consumer file to `.opencode/runtime-hooks/dispatch/lib/dispatch-rule-checks.mjs` must be computed per-file (different directory depths). After fixing, re-run `git-rule-checks.test.mjs` to confirm the test passes, and live-fire `git-preflight-advisory.mjs` and `permission-request-policy.mjs` via stdin to confirm they load.

### P1 — Required before merge

2. **F006-F008 (stale doc references)** — Update the 3 doc files to point at the current `.opencode/runtime-hooks/...` paths. These are documentation-only fixes but they fail the `spec_code` and `playbook_capability` traceability protocols.
3. **F009 (CHK-011 overclaim)** — Correct the CHK-011 evidence row in `checklist.md` to state that a repo-wide sweep was performed (after fixing F001-F008) and its results, rather than the current overstated claim scoped to only 2 playbook files.

### P2 — Advisory

4. **F005 (allowlist redaction)** — Consider adding an entropy-based heuristic alongside the pattern allowlist so novel credential shapes are also redacted. This is a future improvement, not a blocker.

## 5. Spec Seed

- Amend `spec.md` REQ-003 to require a **repo-wide** grep sweep (not just playbook files) before CHK-011 can be marked `[x]`. The sweep must cover all skill trees, not just the documented "surfaces changed" list.
- Add the 4 newly-discovered consumer files (`permission-request-policy.mjs`, `git-preflight-advisory.mjs`, `advisory-noise-audit.mjs`, `git-rule-checks.test.mjs`) to the "Surfaces Changed" table in `spec.md` §3.
- Add a new REQ: "Any skill tree that imports a file under `.opencode/runtime-hooks/` must be included in the relocation's consumer inventory, not just `.pi/extensions/` and `.opencode/plugins/`."

## 6. Plan Seed

- New remediation phase (Phase 7): (1) repoint the 4 broken imports, (2) fix the 3 stale doc references, (3) correct CHK-011, (4) re-run `git-rule-checks.test.mjs`, (5) perform a repo-wide `grep -rn` for ALL old paths and confirm zero hits outside git history, (6) live-fire the 2 affected hooks via stdin to confirm they load.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Notes |
|----------|--------|-------|
| `spec_code` | fail | REQ-003 (zero stale paths) is violated: 4 broken imports (F001-F004) + 3 stale doc references (F006-F008) remain |
| `checklist_evidence` | fail | CHK-011 [P0] evidence row overstates the verification scope (F009); 4 P0 broken imports contradict the "no stale path survives" claim |

### Overlay Protocols

| Protocol | Status | Notes |
|----------|--------|-------|
| `skill_agent` | N/A | Spec-folder target, not a skill target |
| `agent_cross_runtime` | N/A | Spec-folder target, not an agent target |
| `feature_catalog_code` | N/A | No feature catalog claims to verify for this target |
| `playbook_capability` | fail | `cli-codex/references/hook-contract.md` (F006) describes capabilities at paths that no longer resolve; the 2 fixed playbook files (REQ-011) now pass |

`AC_COVERAGE`: not applicable — this packet has no separate acceptance-criteria coverage gate beyond the checklist itself.

## 8. Deferred Items

- F005 (allowlist-based redaction) is a P2 advisory — a future improvement, not a blocker.
- The prior review's R5-P2-001 (Cursor→Claude adapter coupling) remains a maintainability improvement, not a blocker.
- The prior review's R1-P2-002 (stale Claude hook table row in `hooks.md:89`) and R1-P2-003 (plugin-architecture prose contradiction in `plugins/README.md`) were not re-verified in this re-review; they remain as prior P2 advisories.

## 9. Audit Appendix

### Convergence Summary

`stop_policy=max-iterations` was honored: all 3 iterations ran to completion regardless of per-iteration findings ratio. Iteration 1's `newFindingsRatio=0.80` (4 P0 findings) would have triggered a P0 override blocking convergence in any case. Iteration 3's `newFindingsRatio=0.40` (4 P1 findings) confirms the loop was still productive at the final iteration — early convergence would have missed the stale doc references.

### Coverage Summary

- 3/3 iterations produced all required artifacts (iteration narrative, state-log JSONL append, delta file).
- 4/4 dimensions covered: correctness (iter 1), security (iter 2), traceability + maintainability (iter 3).
- 9 active findings in the registry, 0 dropped between iteration JSONL and the registry.

### Replay Validation

Recomputed from JSONL state:
- Iteration 1: 4 P0 findings, ratio 0.80 → FAIL verdict ✓
- Iteration 2: 1 P2 finding, ratio 0.10 → CONDITIONAL verdict (but P0s from iter 1 still active → overall FAIL) ✓
- Iteration 3: 4 P1 findings, ratio 0.40 → FAIL verdict ✓
- Final verdict: FAIL (4 active P0) — consistent across all iterations.

### Sources Reviewed

- All 3 iteration files under `iterations/`
- The full findings registry
- The 84-file relocation commit diff (`git show --stat 40d5f0d2b3`)
- The uncommitted Phase 6 remediation diff (`git diff HEAD`)
- Live `node -e` import attempts confirming `ERR_MODULE_NOT_FOUND` for F001-F003
- All affected test suites re-run (40/40, 41/41, 7/7, 17/17)
- `validate.sh --strict` on the spec packet (PASSED)
- Repo-wide grep for all 4 old path families across all skill/runtime/plugin directories

### Original P1 Remediation Verification

| Original Finding | Remediation | Verified |
|-----------------|-------------|----------|
| R2-P1-001 (Codex multi-file) | REQ-008: `patchPaths()` + `matchAll` | PASS — fix correct, regression test passes |
| R3-P1-001 (dispatch-guard forgery) | REQ-009: `Config:` path binding | PASS — fix correct, 4 forgery regression tests pass |
| R3-P1-002 (credential redaction) | REQ-010: PEM + JWT patterns | PASS — fix correct, 2 regression tests pass |
| R4-P1-001 (playbook paths) | REQ-011: 2 files repointed | PASS — zero stale hits in those 2 files |
| R4-P1-002 (6-runtimes overclaim) | REQ-012: verification table narrowed | PASS — claim now matches reality |
| R5-P1-001 (hook-adapter-shared) | REQ-013: `shared/` copy + 5 adapters repointed | PASS — zero `system-spec-kit` imports remain in `runtime-hooks/` |

**All 6 original P1s are correctly fixed.** The FAIL verdict is driven by NEW P0 findings (F001-F004) that the prior review and remediation both missed, not by any failure in the Phase 6 fixes themselves.
