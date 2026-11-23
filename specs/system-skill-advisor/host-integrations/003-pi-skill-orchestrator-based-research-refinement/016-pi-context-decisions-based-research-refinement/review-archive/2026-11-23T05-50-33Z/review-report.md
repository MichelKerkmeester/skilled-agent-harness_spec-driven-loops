---
title: "Review Report: skill-advisor code shipped by packet 016"
description: "Five-iteration deep review of the pasted-reply stripping, crash fallback and route receipt code: FAIL on the coverage gate, no P0 or P1, nine P2 advisories."
importance_tier: important
contextType: review
---

# Review Report: skill-advisor code shipped by packet 016

<!-- ANCHOR:deep-review-skill-advisor-016 -->

## 1. Executive Summary

- **Verdict:** FAIL. `review-verdict.cjs` returned it because the required `coverage` terminal gate failed (`traceability-incomplete`), not because of any severe finding.
- **hasAdvisories:** false as reported by the verdict script, which sets it only on PASS. Nine P2 advisories are active.
- **Counts the verdict used:** P0 0, P1 0, P2 9.
- **Self-check outcomes:** none. The adversarial self-check runs on active P0 and P1 findings and there were none. Iteration 5 re-read all eight earlier P2s at their cited lines and kept each at P2.
- **Why the gate failed:** iteration 5 recorded the `spec_code` protocol as `partial`, citing the open hook-side gaps R1-P2-001 and R3-P2-001, after iterations 3 and 4 had recorded it as `pass`. The reducer takes the latest result, so `spec_code` ended unfinished.
- **Orchestrator caveat on that gate:** the spec line R3-P2-001 leans on (`003-follow-up-routing-benchmark/spec.md:94`) requires stripped text "in both the bench and the guard", and both comply (`hooks/claude/user-prompt-submit.ts:381`, `runtime/bench/scorer-calibration.bench.ts:239`, `:285` and `:353`). The fire gate that reads the raw prompt (`user-prompt-submit.ts:580`) is outside that sentence. The behavior gap is real, but the spec breach behind the FAIL is weaker than the gate reads.
- **Review scope:** 27 files under `.skilled/skills/system-skill-advisor/`, implementation and tests, change range `git diff 538d2f789ec 57d3f5d9159^2`.
- **Operator review focus:** Review the code this change shipped: git diff 538d2f789ec 57d3f5d9159^2 (pasted earlier-reply stripping before scoring, the prompt-hook crash fallback, weak follow-up route receipts, Python scorer strip parity). Judge from the code and tests only; do not read the packet evidence folders or implementation-summary verdict tables.
- **Executor:** native `deep-review` agent, model Opus, effort medium, 5 iterations under `stopPolicy: max-iterations`. Stop reason `maxIterationsReached`.

## 2. Planning Trigger

`/speckit:plan` is not required by severity, since no P0 or P1 is active. The FAIL comes from the coverage gate. Whether to plan a P2 fix phase is the operator's decision.

```json
{
  "triggered": false,
  "verdict": "FAIL",
  "hasAdvisories": false,
  "failedRequiredGateIds": ["coverage"],
  "activeFindings": [
    {"id": "R1-P2-001", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:200"},
    {"id": "R1-P2-002", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:376"},
    {"id": "R1-P2-003", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:604"},
    {"id": "R1-P2-004", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:253"},
    {"id": "R2-P2-001", "severity": "P2", "dimension": "security", "file": ".skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:246"},
    {"id": "R3-P2-001", "severity": "P2", "dimension": "traceability", "file": ".skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:580"},
    {"id": "R4-P2-001", "severity": "P2", "dimension": "maintainability", "file": ".skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:473"},
    {"id": "R4-P2-002", "severity": "P2", "dimension": "maintainability", "file": ".skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:651"},
    {"id": "R5-P2-001", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:198"}
  ],
  "remediationWorkstreams": ["WS1 strip-rule input handling", "WS2 fire-gate input unification", "WS3 receipt write timing and floor flag", "WS4 dead branch"],
  "specSeed": ["Decide whether the hook fire gate must read stripped text, and amend the phase 003 rule if so"],
  "planSeed": ["Make TASK_MARKER linear in TypeScript and Python first", "Then move the strip ahead of the 64 KiB cut"],
  "findingClasses": ["input-bounds", "gate-input-mismatch", "write-ordering", "dead-code", "latent-parser-gap"],
  "affectedSurfacesSeed": ["hooks/claude/user-prompt-submit.ts", "runtime/lib/prompt-policy.ts", "runtime/scripts/skill_advisor.py", "runtime/lib/skill-advisor-brief.ts", "runtime/lib/subprocess.ts"],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

Every citation below was opened by the orchestrator at synthesis time and resolves on main.

- **R1-P2-001, P2, correctness.** `hooks/claude/user-prompt-submit.ts:200`. `normalizePrompt` cuts a prompt over 64 KiB before the pasted-reply strip runs, so a paste longer than that loses its trailing `Now:` or `Task:` line and the advisor routes on the paste. This defeats the comment at `runtime/lib/skill-advisor-brief.ts:474-476`, which says the paste is dropped before the cut. Fix: strip before the cut, but only after R2-P2-001 is fixed, because the cut is the hook's only bound on that regex.
- **R1-P2-002, P2, correctness.** `hooks/claude/user-prompt-submit.ts:376`. The receipt guard ignores a `lifecycle_event` on the prompt input, which the directive dedup treats as a boundary. Iteration 3 found that only tests set this field, so no current caller reaches it.
- **R1-P2-003, P2, correctness.** `hooks/claude/user-prompt-submit.ts:604`. The route receipt is recorded before the output is delivered at `:623`, while the directive receipt waits for a successful write. A failed host write leaves a receipt for a brief the model never saw, which costs one wrongly skipped brief.
- **R1-P2-004, P2, correctness.** `runtime/lib/prompt-policy.ts:253`. The last task marker wins, so a user task with two markers keeps only the text after the second one. Iteration 5 reproduced it: `Claude replied: ok. Task: update readme. Now: commit it` scores as `commit it`. The fixture records this as accepted behavior, and the Python scorer matches.
- **R2-P2-001, P2, security.** `runtime/lib/prompt-policy.ts:246`, Python twin `runtime/scripts/skill_advisor.py:4807`. `TASK_MARKER` backtracks quadratically on a long whitespace run that contains newlines. The reviewer measured about 1.8 s for the built TypeScript and about 22 s for the Python module at 64K characters. The hook is bounded by its 64 KiB cut and the MCP tool by 10,000 characters, while the single-prompt Python path strips before any length cut. Raise to P1 if a runtime pipes raw, unbounded prompts into it.
- **R3-P2-001, P2, traceability.** `hooks/claude/user-prompt-submit.ts:580`, second site `runtime/lib/skill-advisor-brief.ts:470`. The hook decides whether to fire on the raw prompt, so a pasted reply that names `sk-doc` followed by `Now: thanks` fires the advisor while a plain `thanks` is skipped. The orchestrator's synthesis check found that phase 003's spec line scopes the stripped-text rule to the bench and the guard, so this is a behavior gap rather than a breach of that line.
- **R4-P2-001, P2, maintainability.** `runtime/lib/skill-advisor-brief.ts:473`. The fire decision is computed at five call sites on two inputs: raw at `skill-advisor-brief.ts:470`, `:473` and `user-prompt-submit.ts:580`, stripped at `skill-advisor-brief.ts:478` and `user-prompt-submit.ts:381`. A fix for R3-P2-001 has to change these together.
- **R4-P2-002, P2, maintainability.** `hooks/claude/user-prompt-submit.ts:651`. The `{ effectiveEmitted: emitted }` branch of the crash catch can never run, because `:643` already returns when there is no input.
- **R5-P2-001, P2, correctness.** `runtime/lib/subprocess.ts:198`. The `confidenceFloored` flag is declared on the type at `subprocess.ts:49` but the parser does not copy it and `skill_advisor.py` never sets it. The in-process brief path would record floored routes as earned ones. Only tests use that path today, so the gap is latent.

## 4. Remediation Workstreams

There is no P0 or P1 work. The P2 advisories group as follows, in order:

1. **WS1, strip-rule input handling:** R2-P2-001 first, then R1-P2-001, then a decision on R1-P2-004.
2. **WS2, fire-gate input:** R3-P2-001 and R4-P2-001 together, once the operator decides whether the fire gate reads stripped text.
3. **WS3, receipts:** R1-P2-003, R5-P2-001 and R1-P2-002.
4. **WS4, cleanup:** R4-P2-002.

## 5. Spec Seed

- State in the phase 003 rule, or a successor, whether the hook's fire gate must read stripped text, not only the bench and the receipt guard.
- State an input bound for the single-prompt Python scorer path.

## 6. Plan Seed

- Make `TASK_MARKER` linear in both `prompt-policy.ts` and `skill_advisor.py`, with a timing test on a 64K whitespace run.
- Move the strip ahead of the 64 KiB cut in `normalizePrompt`, with a test for a paste longer than 64 KiB.
- Route every fire-gate call through one stripped input, and add the `sk-doc` paste plus `Now: thanks` case as a test.
- Record the route receipt only after a successful delivery, matching the directive receipt.
- Carry `confidenceFloored` through the subprocess parser, or drop it from the type.

## 7. Traceability Status

**Core protocols**

- `spec_code`: partial at the final iteration. Iteration 3 checked the P0 requirement rows of phases 004, 006, 007, 008, 009 and 011 against the code and recorded pass. Iteration 4 also recorded pass. Iteration 5 recorded partial, citing the R1-P2-001 and R3-P2-001 gaps. See the caveat in section 1.
- `checklist_evidence`: not applicable. The packet's evidence folders were out of bounds by operator direction, so checklist evidence was not checked.

**Overlay protocols**

- `skill_agent`, `agent_cross_runtime` and `playbook_capability` did not apply to this code-only target. `feature_catalog_code` was not run.

**AC_COVERAGE:** exempt, because this is a files target.

resource-map.md was not present at init, so the coverage gate was skipped.

## 8. Deferred Items

- Phases 008 and 009 cite line numbers in `user-prompt-submit.ts` that moved when phase 011 added the guard. The claims still hold at the new lines.
- One Claude turn can run the strip up to three times, about 5 s at the worst case. Iteration 2 inferred this and did not measure it.
- The DSH clock rotation after compaction runs detached, so the next step could in theory read the old clock. The window is a few microtasks, recorded as a guess.
- The generated `resource-map.md` lists two graph node ids, `dim-correctness` and `file-subprocess`, as missing documents. This is a reducer projection quirk, not a repository gap.

## Dimension Expansion Map

No divergent pivots ran. Saturated directions: none. Completed pivots: none. Failed pivots: none. Audited overrides: none. Remaining frontier: none recorded.

## 9. Search Ledger

- `searchCoverage` is present in the registry with `requiredBugClasses`, `covered`, `ruledOut`, `deferred`, `blocked` and `graphCoverageMode`.
- `searchDebt`: empty, so hasSearchDebt is false.
- Ruled out across the run:
  - drift between the TypeScript and Python strippers, because both suites read the shared 24-row fixture;
  - a second directive dedup on the crash path;
  - unsafe receipt-store file handling, because it checks owner and permissions, refuses symlinks and writes by temp file and rename;
  - leaking error text through the crash fallback, which prints a fixed string;
  - prompt exposure on the command line, since the prompt goes on stdin;
  - a stale floor flag;
  - non-idempotent double stripping.

## 10. Audit Appendix

- **Convergence:** five iterations ran under `stopPolicy: max-iterations`, so convergence was telemetry only. `newFindingsRatio` went 1.0, 0.2, 0.17, 0.25, 0.11. The stuck count stayed at 0 and there were no failed iterations.
- **Coverage:** all four dimensions were covered by iteration 4: correctness in 1 and 5, security in 2, traceability in 3, maintainability in 4.
- **Terminal gates at stop:**
  - evidence: pass, all findings cited;
  - scope: pass, all findings in scope;
  - coverage: fail, traceability incomplete.
- **Legal-stop gates blocked at the cap:** `dimensionCoverageGate`, `candidateCoverageGate` and `graphlessFallbackGate`, recorded as evidence only, because the cap stops the loop first.
- **Verification per iteration:** `verify-iteration.cjs` exited 0 for iterations 1 to 5, each with route proof (`target_agent: deep-review`, `agent_definition_loaded: true`). No file outside `review/` changed during the run.
- **Sources reviewed:** the 27 scope files, the phase `spec.md` files for traceability, and `.opencode/plugins/system-skill-advisor.js` for R1-P2-002's reach.
- **Core Protocols:** `spec_code` partial, `checklist_evidence` not applicable.
- **Overlay Protocols:** `skill_agent`, `agent_cross_runtime` and `playbook_capability` not applicable, `feature_catalog_code` not run.

<!-- /ANCHOR:deep-review-skill-advisor-016 -->
