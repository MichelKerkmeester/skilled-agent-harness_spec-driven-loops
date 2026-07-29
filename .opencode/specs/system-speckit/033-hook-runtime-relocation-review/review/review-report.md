---
title: "Deep Review Report: Hook Runtime Relocation — Fan-Out Re-Review After Phase 6 Remediation"
description: "2-lineage fan-out re-review (cli-devin glm-5-2 + cli-pi gpt-5.6-luna, stop_policy=max-iterations) of the .opencode/runtime-hooks/ relocation after Phase 6 P1 remediation. Merged verdict: FAIL, P0=4 P1=4 P2=1. Luna lineage did not execute (cli-pi fan-out dispatch unimplemented)."
importance_tier: normal
contextType: general
version: 1
---

# Deep Review Report: Hook Runtime Relocation — Fan-Out Re-Review

---

## 1. Executive Summary

**Merged verdict: FAIL** (strongest-restriction policy: any lineage with active P0 findings fails the merge)

- **P0: 4** | **P1: 4** | **P2: 1** — all sourced from the `glm` lineage (see below); no findings from `luna`.
- Fan-out configuration: 2 lineages, `stop_policy=max-iterations`, `lineage_mode=restart` (prior single-executor 5-iteration session archived to `review-archive/20260728T161859/`, not deleted).
- **Lineage `glm`** (`cli-devin`, model `glm-5-2` = "GLM-5.2 High"): **completed all 3 forced iterations successfully.** Full report: [`lineages/glm/review-report.md`](./lineages/glm/review-report.md). Verdict FAIL, P0=4 P1=4 P2=1.
- **Lineage `luna`** (`cli-pi`, model `gpt-5.6-luna`): **failed to execute at all** — 6ms after start, before any review work began. Root cause: `buildPiLineageCommand()` in `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` (line 1830-1832) is a deliberate, permanent stub:
  ```js
  // TODO: Build args only after Pi's headless command contract is confirmed.
  // Do not treat a subprocess exit code alone as proof of a successful dispatch.
  throw inputError('cli-pi command construction is unavailable until its headless invocation contract is confirmed');
  ```
  This is a genuine, pre-existing gap in the deep-loop runtime's fan-out support — `cli-pi` is registered in `EXECUTOR_KINDS` and `LINEAGE_COMMAND_ADAPTERS`, but its command-builder was never implemented. Not a model-selection or configuration mistake on this run's part; `cli-pi/SKILL.md` itself hedges this ("Use the executor kind cli-pi once the runtime supports it"). No amount of retrying or re-flagging this dispatch would have made it succeed.

## 2. Why the merged verdict is FAIL regardless of Luna's absence

GLM-5.2 High's independent 3-iteration review (correctness → security → traceability+maintainability) found **4 genuine P0 broken imports** that survived the original relocation, the first 5-iteration `cli-opencode` review, AND the Phase 6 remediation's own re-verification. Independently re-confirmed here (not just taken on the lineage's word):

```
$ grep -n dispatch-rule-checks .opencode/skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs
22:import { evaluate, readHardRules } from '../../../../cli-external-orchestration/cli-opencode/scripts/lib/dispatch-rule-checks.mjs';

$ grep -n dispatch-rule-checks .opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs
31:} from '../../../cli-external-orchestration/cli-opencode/scripts/lib/dispatch-rule-checks.mjs';

$ grep -n dispatch-rule-checks .opencode/skills/sk-git/scripts/lib/advisory-noise-audit.mjs
29:} from '../../../cli-external-orchestration/cli-opencode/scripts/lib/dispatch-rule-checks.mjs';

$ grep -n dispatch-rule-checks .opencode/skills/sk-git/scripts/lib/git-rule-checks.test.mjs
24:import { readHardRules, evaluate } from '../../../cli-external-orchestration/cli-opencode/scripts/lib/dispatch-rule-checks.mjs';

$ ls .opencode/skills/cli-external-orchestration/cli-opencode/scripts/lib/dispatch-rule-checks.mjs
ls: No such file or directory
```

All 4 files import a path that no longer exists (the relocation commit `40d5f0d2b3` moved the real file to `.opencode/runtime-hooks/dispatch/lib/dispatch-rule-checks.mjs` but never updated these 4 consumers). Two of these are **live, wired production hooks** (`permission-request-policy.mjs` for Devin, `git-preflight-advisory.mjs` across 4 runtimes) that will throw `ERR_MODULE_NOT_FOUND` the next time they fire. This is a real regression, confirmed independently, not a hypothesis.

**Root cause of why this was missed 3 times**: the original relocation's stale-path grep, the first review's focus areas, and the Phase 6 remediation's re-verification (R4-P1-001) all scoped their sweeps to specific known-affected files (playbook docs, the 4 relocated concern folders) rather than a true repo-wide grep for the old path string across every skill tree. `system-spec-kit` and `sk-git` were outside all three sweeps' scope.

## 3. Full Finding Registry

See [`lineages/glm/review-report.md`](./lineages/glm/review-report.md) §3-8 for the complete finding registry (F001-F009), remediation workstreams, spec/plan seeds, and traceability status. Summary:

| ID | Sev | Title | Pre-existing or introduced |
|----|-----|-------|------------------------------|
| F001 | P0 | `permission-request-policy.mjs` imports moved-away `dispatch-rule-checks.mjs` | Introduced by the relocation |
| F002 | P0 | `git-preflight-advisory.mjs` imports moved-away `dispatch-rule-checks.mjs` | Introduced by the relocation |
| F003 | P0 | `advisory-noise-audit.mjs` imports moved-away `dispatch-rule-checks.mjs` | Introduced by the relocation |
| F004 | P0 | `git-rule-checks.test.mjs` imports moved-away `dispatch-rule-checks.mjs` | Introduced by the relocation |
| F005 | P2 | Credential redaction remains allowlist-based (novel shapes still escape) | Pre-existing design limitation |
| F006 | P1 | 3 stale adapter path references in `cli-codex/references/hook-contract.md` | Introduced by the relocation |
| F007 | P1 | Stale path reference in deep-alignment known-deviations doc | Introduced by the relocation |
| F008 | P1 | Stale `dispatch-guard.cjs` path in `.loop-guard-state/README.md` | Introduced by the relocation |
| F009 | P1 | `checklist.md` CHK-011 overstates stale-path verification scope | Introduced by the Phase 6 remediation |

## 4. Answers to the operator's 5 focus questions

**(a) Do the 6 original P1 fixes hold up when read cold?** Yes — GLM's iteration 1 (correctness pass) independently confirmed REQ-008 through REQ-013 are all correctly implemented. No regression found in the 6 original fixes themselves.

**(b) Did either lineage defeat the R3-P1-001/R3-P1-002 hardening adversarially?** No. GLM's iteration 2 (security pass) reviewed both hardening fixes and did not find a bypass; it raised F005 as a P2 advisory (allowlist-based redaction still has theoretical gaps for entropy-based novel credential shapes) but this is a pre-existing design limitation, not a defeat of the fix itself. Luna could not attempt this since it never dispatched.

**(c) Is the R5 dependency-removal (new `runtime-hooks/shared/hook-adapter-shared.cjs`) complete and consistent?** Yes, per GLM's review — no finding contradicts this. Not independently re-verified by a second lineage since Luna didn't run.

**(d) Any new regression from the remediation itself?** Yes — F009 (the CHK-011 evidence row overclaim) is itself introduced by the Phase 6 remediation's narrow re-verification scope, and indirectly the remediation's narrow scope is why F001-F004 went undetected for a third consecutive pass.

**(e) Are the R4 doc/evidence corrections now actually accurate?** No — F009 shows the corrected CHK-011 row is still inaccurate (overstates verification scope), and F006-F008 show 3 additional stale doc references beyond the 2 the remediation fixed.

## 5. Next Step

Per the standard review path (`/deep:review` → FAIL → `/speckit:plan` → `/speckit:implement`), a Phase 7 remediation is required before any merge decision: fix F001-F008, correct F009, re-run `git-rule-checks.test.mjs`, and this time run a genuine repo-wide grep sweep (not scoped to specific known files) to confirm zero stale references to the old `dispatch-rule-checks.mjs` path — or any other relocated file — remain anywhere in the repository.

Separately, the operator should decide how to handle the `cli-pi` fan-out gap: it is a real, pre-existing limitation of the deep-loop runtime unrelated to this review's content, not something fixable by retrying or reconfiguring this dispatch.
