---
title: "Implementation Summary"
description: "Ten deep-research iterations on Open Knowledge Format versus system-spec-kit, verified by the orchestrator and cross-checked by an independent reviewer; verdicts handed to the design phase."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/050-open-knowledge-format-adoption/001-okf-deep-research"
    last_updated_at: "2026-10-04T05:36:11Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Closed phase 001 after orchestrator verification and an independent review"
    next_safe_action: "Author phase 002 design from research/research.md Appendix A.6"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-okf-deep-research"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
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
| **Spec Folder** | 001-okf-deep-research |
| **Completed** | 2026-10-04 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The research says to interoperate with the Open Knowledge Format (OKF), not absorb it. Ten iterations compared it with system-spec-kit field by field. After an independent review, the verified list shrinks: only a one-way export bridge and a few additive fields survive as candidates, and one run-time claim the lineage made turned out to be false.

### Phase 1: okf-deep-research

You get a ranked, evidence-backed verdict on each OKF idea, so phase 002 designs only what earned a place. A DeepSeek V4.1 Flash lineage ran the ten charter focuses through `cli-pi` on the `opencode-go` route at max effort and searched the open web for sources beyond the seed link. I then checked its work myself and had a Claude-family reviewer try to refute each verdict.

The orchestrator review changed the result. The lineage claimed `last_updated_by` is free text, but a validator error rule and the continuity writer both reject the OKF actor forms. It missed that `contextType` already marks a document kind. It also overstated why per-folder index files fail. The corrected list is in `research/research.md` Appendix A.6. The R1 and R2 disagreement between the lineage and the reviewer is left open for phase 002.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/research.md` | Created | Lineage synthesis plus the orchestrator verification appendix |
| `research/lineages/deepseek-flash-max/` | Created | Ten iteration files, deltas, state log and the lineage synthesis |
| `research/orchestration-summary.json` | Created | Runner summary: 1 of 1 lineage succeeded, 7 timestamp anomalies |
| `scratch/seed/okf-SPEC.md`, `scratch/seed/okf-README.md` | Created | Orchestrator-fetched OKF source copies |
| `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` | Modified | Charter, evidence and closure state |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The run used the deep-research workflow's fan-out runner with a single lineage, forced to ten iterations, with `AI_SESSION_CHILD=1` set and the pre-resolved gate stated in the prompt. It finished in about 19 minutes. A smoke dispatch first confirmed the route replied at max effort and that the child could fetch a web page.

I re-ran what could be re-run. A script tested 233 `file:line` citations, 228 of which resolve inside their file; the other five are shorthand paths. I read the cited OKF and spec-kit lines for content, reproduced the hashes, corpus counts, rule count and GitHub search counts, and fetched all seven source URLs, which returned 200. A Claude-family reviewer with no sight of the lineage's reasoning then tried to refute R1 to R8; I confirmed its three corrections by reading the validator, the writer and the retrieval code. Nothing is committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use the fan-out runner with one lineage, not the single-executor path | Hand-running the 2,400-line workflow for ten iterations was not practical; the cost is one child session holding all ten iterations, with no fresh context between them. |
| Primary route `opencode-go` at max, Cline as fallback only | Cline's DeepSeek route stops at `xhigh`, so only opencode-go can give max. The fallback was never needed. |
| Copy the lineage synthesis unchanged and add an appendix | Rewriting a verified report into the 17-section template risked changing claims; the appendix carries every correction. |
| Keep the reviewer's R1 and R2 dissent open | These are judgment calls with no repository answer, so averaging two opinions would hide them. Phase 002 decides. |
| Do not regenerate the child's state files | The research content verified; the invented timestamps and unusable registry are recorded as defects and do not change a finding. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Iterations completed | PASS: 10 records in `research/lineages/deepseek-flash-max/deep-research-state.jsonl`; runner reported 1 of 1 lineage succeeded, 0 failures |
| Model and effort | PASS: `invocation-metadata.json` records `opencode-go/deepseek-v4.1-flash` at `max` |
| Citations | PASS with limits: 228 of 233 resolve in range; five are shorthand; one is off by one line (`corpus.mjs:104`, definition on 103) |
| Claims | PARTIAL: 3 of the lineage's claims were wrong (R4, R5, R7 reasoning) and are corrected in Appendix A.3 |
| Run state integrity | FAIL, recorded: 7 invented timestamps and an unusable findings registry; merge carried 0 findings |
| `validate.sh --strict` | PASS: parent, phase 001, 002 and 003 each end `RESULT: PASSED`, 0 errors; 002 and 003 carry one SPEC_DOC_SUFFICIENCY warning each because they are unwritten scaffolds |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **One model family produced the research.** The reviewer is a second family, but it read only what I pointed it at; a design that depends on R1 or R2 should be re-tested.
2. **State files are not reducer-clean.** A later resume of this loop would start from an unusable registry; archive `research/` rather than resuming it.
3. **The lineage reports 11 and 17 web sources in different files.** Both clear the five-source floor, but the two numbers disagree.
4. **Two figures are unverified.** `newInfoRatio` is self-reported, and OKF adoption beyond star counts is UNKNOWN.
<!-- /ANCHOR:limitations -->

---


