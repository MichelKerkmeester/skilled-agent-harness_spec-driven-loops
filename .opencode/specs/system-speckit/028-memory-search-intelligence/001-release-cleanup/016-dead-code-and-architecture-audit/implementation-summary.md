---
title: "Implementation Summary: Dead Code, Legacy Artifact and Architecture Simplification Audit"
description: "Twenty forced-depth research passes across three model families produced 88 findings; six were independently confirmed, two were refuted, and eighty remain unverified pending remediation triage."
trigger_phrases:
  - "dead code audit summary"
  - "release cleanup 016 summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-release-cleanup/016-dead-code-and-architecture-audit"
    last_updated_at: "2026-07-27T08:56:02Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Completed the twenty-pass research program and authored the findings report"
    next_safe_action: "Operator ranks findings; remediation triage runs as a separate phase"
    blockers: []
    key_files:
      - "findings-report.md"
      - "research/findings-registry.json"
      - "research/devin-findings.json"
      - "research/manual-devin/FOCUS-PLAN.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-028-016-dead-code-audit"
      parent_session_id: null
    completion_pct: 70
    open_questions:
      - "Which findings does the operator approve for the remediation phase?"
    answered_questions:
      - "Devin cannot host an orchestrated lineage, so the GLM passes ran as manual dispatches."
      - "The fan-out runtime drops --convergence-mode, so divergence was applied at the prompt level."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 016-dead-code-and-architecture-audit |
| **Completed** | Research stage complete 2026-07-27; remediation triage outstanding |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The repository now has its first systematic sweep of the code and structure surface. Twenty forced-depth research passes across three model families produced 88 findings spanning dead code, superseded files, residue, misplacement, architecture drift, and over-engineering. Six were independently re-verified, two were disproved, and the report says plainly which is which so nobody deletes on the strength of an unchecked claim.

### The research program

Fifteen passes ran as an orchestrated fan-out: `openai/gpt-5.6-sol` at high effort for 10 iterations, `composer-2.5-fast` for 5. Five more ran as hand-driven `glm-5-2` dispatches, because Devin is not a deep-loop executor kind and cannot host a lineage. Neither fan-out lineage stopped early — `sol` reached a 0.88 convergence score and kept going, which is what `--stop-policy=max-iterations` was there to guarantee.

The models proved complementary rather than redundant. `sol` produced no CAT-1 or CAT-2 findings at all across ten deep iterations; `composer` supplied every one of those in five fast ones. The manual passes were re-targeted at surfaces the fan-out had left untouched, which turned out to be worth 56 of the 88 findings.

### The verification stage

Verification mattered more than discovery. Two claims failed:

`validate-doc-model-refs.js` was reported as dead code with no reachable callers. It runs on every commit — `.opencode/scripts/git-hooks/pre-commit:22` invokes it by path string, and `.git/hooks/pre-commit` is a live symlink to that hook. The pass had scoped its search to the sk-doc hub and never looked one tree over. Deleting it would have broken the pre-commit gate.

`chokidar` was reported as an unused dependency alongside `cors` and `express`. It has five importers; the pass's grep covered `.js`, `.cjs`, and `.mjs` but not `.ts`. The other two are genuinely unused.

Both errors are the same shape: a reachability search narrower than the reachability. That is why the report labels 80 findings UNVERIFIED rather than presenting 88 as equally solid.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `findings-report.md` | Created | Ranked findings, refutations, verification tiers, handoff order |
| `research/` | Created | Two lineage trees, five manual transcripts, merged registry, attribution |
| `research/devin-findings.json` | Created | 56 manual findings normalized for triage |
| `checklist.md` | Modified | 25 items marked with evidence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Pre-flight confirmed all three transports before dispatch and recorded a recovery baseline. The fan-out ran under fail-closed write containment, which snapshots pre-existing dirty paths, reverts any new out-of-lineage write, and fails that iteration. It never fired: zero containment violations across 15 iterations. No file outside this packet was modified, and no file under `sk-design/` or `commands/interface/` carries an mtime inside the audit window, so the concurrent session's dirty paths are demonstrably not ours.

The high-risk category got the verification budget. Every CAT-1 dead-code claim was re-tested with string-literal searches rather than import graphs, because hooks, registries, and YAML-named scripts never appear in an import graph. That is what caught both refutations.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Audit only, no remediation | A broad sweep is cheap to run and safe to review when nothing is deleted; the refutations prove the caution was earned |
| Three model families | Redundant discovery exposed blind spots a single lineage would have kept — `sol` found zero dead code, `composer` found all of it |
| Devin as manual dispatch | `cli-devin` is not in `EXECUTOR_KINDS` and appears nowhere in `fanout-run.cjs`, so no lineage could host it |
| Divergence at the prompt level | The fan-out runtime silently drops `--convergence-mode`; the operator chose prompt-level instructions over splitting into single-executor runs |
| Gap-driven manual focuses | The briefing's example focuses duplicated ground `composer` had walked; re-targeting at zero-coverage surfaces yielded 56 findings |
| Per-iteration timeouts cut to 1200s/900s | Lineage lifetime is `min(iterations × timeout × 2, 4h)` against a hard 4h ceiling; at 3600s a few slow iterations would have starved the rest |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| 20 research passes completed | PASS — 10 `sol` + 5 `composer` + 5 Devin |
| No early convergence | PASS — `sol` `maxIterationsReached` at 0.88 score; `composer` `max_iterations` |
| Finding paths resolve | PASS — all resolve after `:line` and brace parsing |
| Dead-code claims re-tested | PASS with 2 refutations — R-001, R-002 |
| Write containment | PASS — 0 `containment_violation` events; no outside-packet mtime in window |
| Secrets in evidence excerpts | PASS — scan over all transcripts and the report is clean |
| Checklist | 14/18 P0, 11/15 P1 — remainder blocked on remediation triage |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Eighty of 88 findings are unverified.** Path existence was checked; the claims were not. Two of the six claims that were re-tested turned out wrong, so assume a comparable error rate in the remainder. Do not delete on an unverified finding.
2. **`composer`'s state log carries fabricated timestamps.** Six of nine records bear future clock values. Its findings verified on spot-check, but its iteration metrics are not trustworthy. `sol`'s log is clean.
3. **`devin-05` first returned a summary instead of its findings** and exited 0. Caught by output size, not exit status. The retry with an explicit output contract produced the real report.
4. **A concurrent session modified `cli-devin` during the audit**, landing `feat(cli-devin): implement phase 013 PermissionRequest adapter`. Finding C-002 should be re-checked against current `HEAD` before action.
5. **The audit's own tooling produced three of the confirmed findings.** C-002, C-003, and C-004 are doc-vs-runtime drifts in `cli-devin` and `/deep:research` that this audit hit while trying to use them.
<!-- /ANCHOR:limitations -->
