# Deep Review Report: sk-code Ponytail Refinement Epic

## 1. Executive Summary

- **Verdict:** CONDITIONAL
- **hasAdvisories:** true
- **Active findings after adjudication:** P0 0, P1 0, P2 3
- **Why CONDITIONAL:** no blocking defect was confirmed, but 17 search-debt obligations stay deferred or blocked, two of them because the Commit-Id policy helper and the Pi Fast Mode source were not in `scope-files.txt`.
- **Scope:** five iterations by cli-codex `gpt-6-luna` at max reasoning effort and fast tier, over the v4.0.0.4 changelog and 478 files changed by the epic's focused commits (commits touching 25 or fewer non-spec files), ranked by churn. Passes: correctness, security, traceability, maintainability, then a correctness recheck.
- **Remediation:** all three advisories were fixed in `031-epic-review-fixes` on 2026-10-14. The search debt remains open.
- **Iteration health:** all five iterations verified (narrative, route proof and delta). Iteration 2 failed verification once (no iteration file) and passed on its one redispatch.

## 2. Planning Trigger

`/speckit:plan` is not required for a blocker. The three P2 advisories are small, independent fixes, and the scope gap calls for a narrow follow-up review rather than remediation.

```json
{
  "label": "Planning Packet",
  "triggered": false,
  "verdict": "CONDITIONAL",
  "hasAdvisories": true,
  "activeFindings": [
    {"id": "R2-P1-001", "reviewerSeverity": "P1", "adjudicatedSeverity": "P2", "file": ".skilled/scripts/git-hooks/pre-commit:43"},
    {"id": "R5-P1-001", "reviewerSeverity": "P1", "adjudicatedSeverity": "P2", "file": ".skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:351"},
    {"id": "R4-P2-001", "reviewerSeverity": "P2", "adjudicatedSeverity": "P2", "file": ".skilled/commands/doctor/scripts/sk-code-setup-check.cjs:139"}
  ],
  "remediationWorkstreams": ["WS1 create.sh lone-dash refusal", "WS2 setup probe display quoting", "WS3 hook trust wording", "WS4 scoped follow-up review"],
  "specSeed": ["create.sh refuses a lone '-' like any other unknown option", "the setup report prints a shell-safe probe command"],
  "planSeed": ["add a lone-dash case to create-unknown-options.vitest.ts", "shell-quote ctx.prompt in the probe display", "state in the hook trust comment that trust is per clone, not per branch"],
  "findingClasses": ["instance-only"],
  "affectedSurfacesSeed": ["create.sh CLI", "/doctor:sk-code setup", "global pre-commit hook trust gate"],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

### R2-P1-001, adjudicated P2: Hook trust is per clone, not per branch


- **Disposition:** fixed in 031: the six global hooks and the git-hooks README now say trust covers the repository, not a branch.
- **Dimension:** security. **File:** `.skilled/scripts/git-hooks/pre-commit:43`
- **Reviewer claim:** a linked worktree of a trusted clone that checks out an untrusted contributor branch shares the git common directory, so the hook sources that branch's `hooks/shared/hook-flags.sh`.
- **Re-verified:** the gate trusts any checkout whose `--git-common-dir` matches the hook's own (lines 43-47), then sources `$SOURCE_ROOT/hooks/shared/hook-flags.sh` (lines 57-61). The mechanism is real.
- **Why downgraded:** the main checkout behaves the same way. Checking out an untrusted branch in the trusted clone itself runs that branch's hook code under the same rule, so worktrees add no exposure, and the block comment states the boundary as the clone (lines 31-37). Running a contributor branch's tooling is the same risk as running its package scripts.
- **Fix:** make the comment and the sk-git docs say plainly that trust covers every branch checked out in a trusted clone, so review untrusted branches in a separate clone. Pinning hook sources to a trusted revision is a larger design change and needs its own decision.
- **findingClass:** instance-only. **scopeProof:** lines 43-61 only. **affectedSurfaceHints:** pre-commit hook, linked worktree, hook trust gate.

### R5-P1-001, adjudicated P2: A lone dash passes create.sh's unknown-option refusal


- **Disposition:** fixed in 031: create.sh matches `-|-?*)`, and a lone-dash vitest case pins it.
- **Dimension:** correctness. **File:** `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:351`
- **Case:** `create.sh - Feature`. The `-?*` pattern needs a character after the dash, so `-` falls to the `*)` branch and joins `FEATURE_DESCRIPTION`.
- **Re-verified:** confirmed at lines 351-358. REQ-001 of `018-create-sh-unknown-options/spec.md:99` says an argument that starts with `-` and matches no option fails, and `create-unknown-options.vitest.ts` has no lone-dash case.
- **Why downgraded:** the result is a title with a stray dash, with no data loss and no unsafe write, and a lone `-` is an unlikely typo. It is a real gap against the requirement's wording.
- **Fix:** add a `-)` branch that prints the same unknown-option error and exits 1, plus a vitest case.
- **findingClass:** instance-only. **affectedSurfaceHints:** create.sh CLI, spec-folder scaffolder.

### R4-P2-001: The setup report's probe command is not shell-safe


- **Disposition:** fixed in 031: the probe line and the rerun repair shell-quote the prompt, and a node:test case pins it.
- **Dimension:** maintainability. **File:** `.skilled/commands/doctor/scripts/sk-code-setup-check.cjs:139`
- **Case:** `--prompt` text with a double quote, `$` or backtick. The displayed `node ... --prompt "<text>"` line no longer reproduces the run when pasted.
- **Re-verified:** line 139 interpolates the raw prompt inside double quotes. The real call at line 140 passes it as an argv element, so execution is safe and only the display is wrong.
- **Fix:** shell-quote the prompt in the display string.
- **findingClass:** instance-only. **affectedSurfaceHints:** /doctor:sk-code setup, compiled route probe.

## 4. Remediation Workstreams

- **P0 and P1:** none after adjudication.
- **P2 advisories:** WS1 create.sh lone dash (R5), WS2 probe display quoting (R4), WS3 hook trust wording (R2).
- **Coverage:** WS4, a scoped follow-up review whose manifest adds `.skilled/scripts/git-hooks/lib/commit-id-policy.sh`, the other Commit-Id hook files and the Pi Fast Mode extension source, plus a line-by-line v4.0.0.4 changelog-to-tree pass.

## 5. Spec Seed

- create.sh refuses a lone `-` with the unknown-option error and exit 1, before any write.
- The setup report prints a probe command that reproduces the run when pasted.
- The hook trust comment and the sk-git docs say trust covers every branch in a trusted clone.

## 6. Plan Seed

- Add the `-)` case to create.sh and a lone-dash test to `create-unknown-options.vitest.ts`.
- Shell-quote `ctx.prompt` in the probe leg's `command()` and add a case with a quote in the prompt.
- Reword the hook trust block identically in every global hook script, since the block is shared.
- Run the scoped follow-up review from WS4.

## 7. Traceability Status

### Core Protocols

- **spec_code:** partial. Iterations 1 and 3 checked the 026, 027 and 029 contracts against the hub and doctor scripts and found them aligned. A full child-by-child pass was deferred.
- **checklist_evidence:** partial. Selected 024, 027 and 029 evidence rows name real checks. Not every child was audited.
- **AC_COVERAGE:** advisory-shortfall. Only a sample of child acceptance criteria was read.

### Overlay Protocols

- **skill_agent:** partial. The sk-code mode and surface projection agrees across SKILL.md, ROUTER.md, mode-registry.json and hub-router.json. A cross-runtime agent comparison was deferred.
- **agent_cross_runtime:** partial, deferred.
- **feature_catalog_code:** partial. The setup probe path was checked, not the full catalog.
- **playbook_capability:** partial. The setup probe path was checked, not every scenario.

## 8. Deferred Items

- Commit-Id hook enrollment and policy validation, blocked by scope (iterations 1, 3 and 5).
- Pi Fast Mode defaults and context boundary, blocked by scope (iterations 2, 3 and 5).
- A full v4.0.0.4 claim-to-tree audit (iterations 1, 3 and 5).
- Compiled-route front door, manifest and engine parity (iteration 1), and the cross-surface projection maintenance cost (iteration 4).

## Dimension Expansion Map

- **Saturated directions:** none recorded.
- **Pivots and Council artifacts:** none, since the stop policy was max-iterations and no divergent mode ran.
- **Selected directions:** correctness, security, traceability, maintainability, correctness recheck.
- **Remaining frontier:** the WS4 items in section 4.

## 9. Search Ledger

- **hasSearchDebt:** true, 17 obligations (15 deferred, 2 blocked). The full list is in `deep-review-dashboard.md` section 10.
- **candidateCoverage:** covered 10, ruled out 11, deferred 15, blocked 2.
- **Ruled out:** compiled-route hub path traversal, setup probe command injection (argv spawn, no shell), native advisor bridge input and environment leaks, create.sh multi-character option fail-open, doctor probe false positives, the surface tie-order false negative and sk-code mode and surface projection drift.

## 10. Audit Appendix

- **Convergence:** stop policy max-iterations, so convergence was telemetry only. New-findings ratios by iteration: 0, 1, 0, 1, 1.
- **Coverage:** all four dimensions covered at least once. Each iteration took 7 to 10 minutes and read a bounded subset of the 478 files.
- **Adjudication:** the orchestrator re-read every P1 at its cited lines and downgraded both to P2 for the reasons in section 3. Claim adjudication had flagged R2 and R5 for missing typed packet fields at runs 2 and 5. The downgrade removes them from the P0/P1 gate.
- **Sources:** `iterations/iteration-001.md` to `iteration-005.md`, `deltas/iter-001.jsonl` to `iter-005.jsonl`, `deep-review-findings-registry.json`, `deep-review-dashboard.md`, `resource-map.md` and `driver-log.txt`.
