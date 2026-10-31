---
title: "Implementation Summary: V4 Documentation Freshness"
description: "Ten iterations of cited evidence decided what had drifted in the v4 changelog and the root README, and twenty-two corrections went in."
trigger_phrases:
  - "v4 doc freshness summary"
  - "changelog and readme verdicts"
  - "documentation drift corrections"
  - "deep research run summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/042-v4-doc-freshness"
    last_updated_at: "2026-09-19T22:40:00Z"
    last_updated_by: "v4-doc-freshness-run"
    recent_action: "Applied 22 verdict-confirmed corrections and wrote both verdict documents"
    next_safe_action: "Commit the packet and the two release documents in an sk-git pass"
    blockers: []
    key_files:
      - "specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/verdict-changelog.md"
      - "specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/verdict-readme.md"
      - "specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/research.md"
      - "specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/review-of-synthesis.md"
      - "specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/readme-verdict-rows.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "rsr-2026-09-19T18-45-00Z"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "The changelog's pre-release numerics cannot be re-derived and stay unflagged: 28KB command, 3,000-line template, forty-two surfaces, forty-four alerts, 178 recommendations."
    answered_questions:
      - "Do the v4 changelog and the root README still tell the truth after the last ~100 commits?"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 042-v4-doc-freshness |
| **Completed** | 2026-09-19 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Both release documents were written to describe a tree that has since moved, and nobody knew how
far. They now describe the tree that exists. Thirty-one candidate claims were pulled from the two
documents, every one of them was tested against the repository, and twenty-two verdict-confirmed
corrections went in: eight count fixes and three additions to the changelog, thirteen corrections
to the README.

The two verdict documents are the deliverable, and they are decision records rather than essays.
Each row names the claim that drifted, the truth with its evidence, the correction, a confidence
level and whether it was applied. `verdict-changelog.md` covers `CHANGELOG-v4.0.0.0.md` and
`verdict-readme.md` covers `README.md`.

The run's own history matters to the result, so it is on the record. The synthesis pass dropped
ten README findings that two earlier iterations had already recorded, then described the README
question as closed. An independent review on a second model family caught that. A bounded repair
pass recovered the rows, and re-verification then overturned one row in the run's own final apply
list: a proposed "3 test files" replacement for the README's advisor counts, which would have
made a roughly-correct number wrong by about forty times. That refusal is recorded as row B2 in
`verdict-readme.md`.

What the two documents gained, in one line each: the changelog now counts ten `mcp-tooling` modes,
five deep-loop commands, thirteen repo rules and a 284-line root document, drops a retired
surface, states the Hermes symlink rule accurately, carries two missing renames, and closes with
an **After This Draft** section covering the 231 commits that landed after it was written. The
README now describes a five-gate system instead of three, states the real Node floor, the real
template count, the real skill count, the real doctor-workflow count, the real third code surface,
the real ten MCP modes and its own real name, and lists the design agent it had been missing.

### Phase 1: v4-doc-freshness

Ten deep-research iterations ran on the `cli-devin` executor through the `deep-research` workflow,
with a hard ten-iteration ceiling and convergence recorded as telemetry only. Every iteration
produced a narrative, a delta stream and a gateway-receipted state record. The loop's own
adversarial pass revised five of its earlier README claims, which is the behaviour you want from
a research run and the reason the verdict tables can be trusted row by row.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md` | Modified | Eight count and retirement corrections plus the closing **After This Draft** section |
| `README.md` | Modified | Thirteen corrections: gates, prerequisites, counts, dead references, the missing design agent, the repository's own name |
| `specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/verdict-changelog.md` | Created | Per-claim changelog verdict with evidence, correction and confidence |
| `specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/verdict-readme.md` | Created | Per-claim README verdict, including the rejected row |
| `specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/iterations/iteration-001..010.md` | Created | The ten iteration narratives that carry the evidence |
| `specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/deltas/iter-001..010.jsonl` | Created | Per-iteration delta streams, gateway-receipted |
| `specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/research.md` | Created | Synthesis with cited sources, plus the post-review corrections section |
| `specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/review-of-synthesis.md` | Created | Independent review of the synthesis on a second model family |
| `specs/system-speckit/033-system-speckit-v4/042-v4-doc-freshness/research/readme-verdict-rows.md` | Created | The README rows recovered after the review |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modified | `gemini-3-8-flash-high` re-admitted to the devin scope, on the operator's decision |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modified | The enforced devin allowlist kept in step with the config above |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modified | Allowlist fixture updated; 153 tests pass |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The research ran through the workflow that owns it. Setup, per-iteration dispatch, the reducer,
convergence and synthesis all came from the workflow contract, and every dispatch went through
the shared fan-out runtime, so the route was audited and the model allowlist stayed enforced.
Each iteration was dispatched, verified, reduced into the findings registry and the graph, and
only then counted.

Synthesis was layered on purpose. `gemini-3-8-flash-high` wrote the synthesis, `glm-5-3-flash-max`
reviewed it without seeing the first model's reasoning, and a bounded repair pass recovered what
the review proved was missing. The review is what caught both the dropped rows and the false
count, so the extra dispatch paid for itself.

Nothing was committed and nothing was pushed. The working tree holds every change, ready for an
sk-git pass.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Targeted corrections, not a rewrite | Every defect was local: a count, a label, a dead path or a missing entry. Nothing about either document's shape needed to change, and the evidence never supported a rewrite |
| Treat convergence as telemetry and run all ten iterations | The ceiling was the point of the run. An early convergence stop would have ended the audit before the later iterations corrected the earlier ones |
| Refuse the "3 test files" edit | The census behind it missed the `*.vitest.ts` files that dominate the suite. The README's existing figure is approximately right, so the correct action was to leave it alone and record why |
| Keep the changelog's pre-release numerics unflagged | The artifacts those numbers counted no longer exist, so no replacement can be verified. Recording the limitation beats inventing a correction |
| Apply the repository-slug correction even though the old name still redirects | The redirect is a courtesy rather than a guarantee, and the canonical name is the one a reader should copy |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate.sh 042-v4-doc-freshness --strict` | RESULT: PASSED, 0 errors, 0 warnings after the derived metadata was re-derived and this summary was written |
| Run shape | PASS: ten non-empty iteration files, ten gateway-receipted state events carrying the route-proof fields, a convergence report showing ten iterations and stop reason `max_iterations` |
| Residual-string scan on both documents | PASS: every corrected string now returns zero matches, including "3 mandatory gates", "20 domain skills", "Node.js 18+", "Sixteen templates", "nine modes" and the retired packet name |
| Sampled re-verification (3 claims) | PASS: `wc -l AGENTS.md` = 284; `repo-rules/` = 13 files; `.skilled/commands/doctor/assets/doctor-*.yaml` = 13 |
| Allowlist unit tests | PASS: `npx vitest run tests/unit/fanout-run.vitest.ts`, 153 tests |
| Diff scope | PASS: the packet, the two release documents, and the three deep-loop allowlist files. Nothing else changed |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The changelog's pre-release numerics are unverified.** Six figures describe events whose
   artifacts are gone. They are recorded as closed-with-no-edit rather than corrected.
2. **The Hermes bridge count is right and its identity is not.** Eighteen of twenty-two packages
   is confirmed by count; no source names the non-literal bridge, so none is claimed.
3. **Two adjacent defects stay outside this packet.** The `cli-devin` roster line in its `SKILL.md`
   still lists one model, and the migration packet's continuity block is stale. Both are named in
   the verdict documents and left for their owners.
4. **A synthesis pass hit its output ceiling once.** The first repair attempt returned nothing
   because the model's response truncated before it wrote the file. The bounded retry succeeded;
   the failure is recorded because it is a real limit of this synthesis path.
<!-- /ANCHOR:limitations -->

---

## Recommendations Implemented

The four follow-ups this packet recommended were implemented on 2026-09-19 and recorded in the
deep-loop ledger packet (`specs/system-deep-loop/050-spec-protocol-ledger-events`,
implementation summary, **Follow-up** section):

- The verifier now reads route proof from the leaf's delta when the state-log projection cannot
  carry it. The ledger route was measured and rejected: the framework's losslessness rule forbids
  an upcast from adding fields inside `data`, and 419 committed version-1 frames would stop
  validating.
- The prompt pack now requires the identity fields the gateway demands, so an append stops needing
  a retry.
- The per-iteration tool-call budget rose from 12 to 24.
- The two excluded defects were repaired: the `cli-devin` roster line and the migration packet's
  stale continuity block.
