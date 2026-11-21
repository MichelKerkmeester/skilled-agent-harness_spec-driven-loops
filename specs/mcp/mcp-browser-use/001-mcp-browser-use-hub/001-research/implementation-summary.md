---
title: "Implementation Summary"
description: "The twelve-iteration research run answered all eight key questions and the operator accepted it, with a known closeout gap: the workflow's own closeout check still fails."
trigger_phrases:
  - "research implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research"
    last_updated_at: "2026-11-21T12:34:51Z"
    last_updated_by: "generate-context"
    recent_action: "Research accepted at 12 iterations; children 002-006 refined; operator decisions recorded"
    next_safe_action: "Run the 002-hub-scaffold build on Opus 5.5 medium via claude2"
    packet_purpose: "Purpose: One evidence-cited research synthesis answers the eight key questions below well enough that 002-006 can each be written as a concrete plan."
    blockers: []
    key_files:
      - "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md"
      - "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/goal.md"
      - "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:e3b6df99b008cb8cbe01ba3d56ba441fa258be0a2784b3ec654ace9e268369fc"
      session_id: "scaffold-001-research"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "433fe077-5d40-4bad-953f-18be20938fb8"
      workspace: "/Users/michelkerkmeester/worktrees/public/505-mcp-browser-use-hub"
      savedAt: "2026-11-21T12:34:51Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-research |
| **Status** | Complete: accepted by operator with a known closeout gap |
| **Completed** | 2026-11-21 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The research run answered all eight key questions in `research/research.md`, and phases 002 to 006 are now written as concrete plans from it. The operator accepted the research as it stands. The deep-research workflow itself did not finish its closeout, and this summary does not claim it did.

### Phase 1: research

Twelve iterations ran instead of the ten in the charter. Iterations 11 and 12 were a resumed run that answered two questions the operator queued: the per-file blast radius outside `mcp-tooling` (iteration 11) and whether Chrome DevTools really offers Lighthouse (iteration 12). Section 17 of `research.md` still carries convergence numbers from before that extension, so read the two iteration files for their answers.

The decisions that the next phases build on:

| Question | Answer | Where |
|----------|--------|-------|
| KQ3 hub contract | Copy `mcp-tooling`'s file skeleton without the `transport-axis` extension. All three modes are `routingClass: metadata`, `packetKind: workflow`, `backendKind: cli-plus-mcp` | `research.md` §5 |
| KQ5 naming | Keep the prefix: `mcp-chrome-devtools`, `mcp-aside-devtools`, `mcp-bladebro`, with folder == workflowMode == packetSkillName | `research.md` §7 |
| KQ4 blast radius | Rewrite path, mode name unchanged, or historical. The doctor mutation-class manifest `skill_dir` is the highest-risk edit | `research.md` §6, `iterations/iteration-011.md` |
| KQ1 Lighthouse | Offered through the MCP `lighthouse_audit` tool only; `bdg` has none. Lighthouse and performance traces are separate capabilities | `iterations/iteration-012.md` |
| KQ6 macOS | A 14-step plan with expected output and rollback per step, authored and not run | `iterations/iteration-006.md` |
| KQ7 security | Three quotable rules R-SEC-1, R-SEC-2, R-SEC-3 | `iterations/iteration-007.md` |
| KQ8 Aside overlap | No. Bladebro does not take over Aside's deterministic signed-in work | `research.md` §10 |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/` | Created by the workflow | Iterations, state, deltas, ledger and `research.md` synthesis. Workflow-owned and not edited by hand |
| `spec.md`, `tasks.md`, `goal.md`, `implementation-summary.md` (this folder) | Modified | Closeout recorded as the operator's acceptance |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The loop ran `/deep:research:auto` on `cli-opencode` with `opencode-go/hy4-flash-free` at reasoning `high` and stop policy `max-iterations`, raised to 12 for the resumed run. The operator then reviewed `research.md` and accepted it.

**The closeout gap.** `synthesis-closeout.cjs` failed its invariant. The last `synthesis_incomplete` event in `research/deep-research-state.jsonl`, at 2026-11-21T10:18:24Z, records 80 findings claimed by the iteration records and 59 rebuilt into the findings registry, with reason `count_only_state_findings_not_reconstructed`. Iterations 1 to 8 wrote findings as `### Finding N` subsections, and the reducer only parses the `## Findings` list form, so 21 findings were never reconstructed. No `synthesis_complete` event exists and `research/deep-research-config.json` still reads `"status": "initialized"`. The answers are not affected; the machine-checked reconciliation is.

The reducer's heading-format blind spot is a separate follow-up outside this packet. Fixing it lets a later resume rerun closeout cleanly.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Stop policy `max-iterations` | The operator wanted forced depth across eight questions, so early convergence on one easy question must not end the run |
| Extend from 10 to 12 iterations | Two operator inbox questions were still open after iteration 10 |
| Accept the research with the closeout gap | The gap is a reducer parsing limit, not a missing answer, and every key question has a cited answer |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `rg -c '"type":"iteration"' research/deep-research-state.jsonl` | `12` |
| `ls research/iterations \| wc -l` | `12` |
| `rg -o 'KQ[1-8]' research/research.md \| sort -u \| wc -l` | `8` |
| `rg -o '00[2-6]-[a-z-]+' research/research.md \| sort -u \| wc -l` | `5` |
| Cited line `.skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml:45` | Prints `skill_dir: ".skilled/skills/mcp-tooling/mcp-chrome-devtools"`, as `iteration-011.md` quotes |
| Workflow closeout (`synthesis_incomplete` event) | FAIL: 80 claimed, 59 rebuilt. Accepted by operator with known closeout gap |
| `jq -r .status research/deep-research-config.json` | `initialized` |
| `validate.sh` on this folder, `--strict` | `RESULT: PASSED` with one warning: a `SOURCE_TAGS` citation inside workflow-owned `research/**` that does not resolve, left untouched |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The workflow closeout is not complete.** The config stays `initialized` until the reducer parses `### Finding N` subsections and closeout reruns.
2. **`research.md` §17 is stale.** It still shows the pre-extension 65/44 finding counts. The iteration 11 and 12 files carry the newer answers.
3. **KQ4 is file-level only for the outside-hub subset.** Phase 003 re-runs the inventory before it edits anything.
4. **Upstream Bladebro moves fast.** Findings are pinned to v4.8.2, read 2026-11-21; 004 and 006 re-check the pin.
<!-- /ANCHOR:limitations -->

---
