---
title: "Implementation Summary"
description: "Real cli-opencode dispatch of AI-001-P1, P2, P3, P4, P6 against openai/gpt-5.5-fast --variant medium, graded against AI-001's own Pass/Fail Criteria. Result: 4 PASS, 1 FAIL (P6's advisor-tier loss to sk-code plus a real system side effect)."
trigger_phrases:
  - "implementation"
  - "summary"
  - "wave 003 implementation summary"
  - "advisor positive controls dispatch summary"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/003-advisor-positive-controls"
    last_updated_at: "2026-07-07T19:05:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Completed implementation-summary.md; all tasks and checklist items done"
    next_safe_action: "Run validate.sh --strict, report verdicts to the phase-parent orchestrator"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "dispatch-log.md"
      - "/tmp/skd-AI-001-P1-response.jsonl"
      - "/tmp/skd-AI-001-P2-response.jsonl"
      - "/tmp/skd-AI-001-P3-response.jsonl"
      - "/tmp/skd-AI-001-P4-response.jsonl"
      - "/tmp/skd-AI-001-P6-response.jsonl"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "advisor-positive-controls-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-advisor-positive-controls |
| **Completed** | 2026-07-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Ran the phase-parent's validated 4-step Gate-3-bypass dispatch recipe for real, one dispatch at a time, against 5 of `AI-001`'s 6 probes: `P1` (interface), `P2` (foundations), `P3` (motion), `P4` (audit), `P6` (`design-mcp-open-design` transport). For each: an independent advisor probe (`skill_advisor.py --threshold 0.8`) against the clean exact prompt, then a real `opencode run --model openai/gpt-5.5-fast --variant medium` dispatch with the standalone-evaluation dispatch-note addendum, then a strict grade against `AI-001`'s own `### Pass/Fail Criteria` section.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `dispatch-log.md` | Created | This wave's Level-2 spec-folder documentation |
| `/tmp/skd-AI-001-P1-response.jsonl` .. `/tmp/skd-AI-001-P6-response.jsonl` | Created | Raw JSON-lines transcripts of the 5 real dispatches (evidence, not repo-tracked) |

No file under `.opencode/skills/sk-design/` was modified — every dispatch was read-only against the live skill tree, confirmed by a scoped `git status --porcelain` after the wave. `P6`'s dispatch DID mutate a real, out-of-repo file (`~/.config/opencode/opencode.json`, the user's global OpenCode MCP config) — see Known Limitations.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Read `positive-design-controls.md` (`AI-001`) in full first (never paraphrased from memory), plus the sibling `001-mode-routing-core/` wave's docs as the exact structural template for this folder's frontmatter, anchors, and section shape.

Dispatched strictly sequentially. Each real `opencode run` call's full JSON-lines stdout was parsed programmatically (not read as prose) to extract every `tool_use` part's tool name and input and every `text` part, so the resolved mode, packet load, and resource citations could be verified against raw tool-call evidence rather than trusted from the model's own summary.

`P1` and `P3` both surfaced a distinct observation: when the live orchestrator itself called its own internal `mk_skill_advisor_advisor_recommend` tool, the query text it composed included the dispatch-note addendum verbatim (including the phrase "no repo documentation needed"), which pulled `sk-doc` above `sk-design` in that internal call's own ranking (`P1`: `sk-doc` 0.8658 vs `sk-design` 0.8246; `P3`: `sk-doc` 0.8524 vs `sk-design` 0.82, both marked `"ambiguous": true`). In both cases the model explicitly reasoned past this ("`sk-doc` also scored due the wording about illustrative guidance, but I'm using `sk-design` because the actual task is interface direction, not documentation authoring") and correctly resolved to `sk-design` and the right mode regardless. This is an artifact of the addendum's own wording contaminating the live orchestrator's internal advisor query — a different phenomenon from the external, clean-prompt probe (Recipe Step 1) that `AI-001`'s Pass/Fail Criteria actually grades against, which returned `sk-design` top-1 for both.

`P6` surfaced two independent, genuine findings. First: the deterministic external advisor probe on the clean prompt "Wire Open Design's MCP server into opencode so I can drive od cli from the terminal." returned `sk-code` top-1 at 0.9464, with `sk-design` second at 0.8517 (still above the 0.80 threshold, but not first) — this directly matches `AI-001`'s own stated FAIL trigger, "any positive probe routes to a non-design skill." Second: the live dispatch itself, despite the dispatch note explicitly framing the call as "a standalone evaluation call, not a tracked change," went on to perform real, mutating actions: it read the current global OpenCode config, ran the Open Design transport packet's real dry-run installer, found the daemon unreachable, launched the actual Open Design desktop app (`open -a "Open Design"`), retried through the launcher-managed payload path once the app was running, and ultimately wrote a corrected `mcp.open-design` entry (adding a previously-missing `OD_DATA_DIR`) into the user's real `~/.config/opencode/opencode.json` — a file entirely outside this git repository. A scoped `git status --porcelain` after the wave confirms zero repo files were touched, so this is not a scope violation of the repo's own file boundaries, but it is a real, out-of-repo system mutation triggered by what was intended to be a no-op grading probe, and is flagged prominently rather than silently absorbed.

An initial `P6` dispatch attempt mistakenly included the UI no-target clause ("No literal target file exists in this repo for this hypothetical request..."), which does not apply to `P6` since it never names a hypothetical local UI surface (it is an MCP-transport-wiring request). This was caught before grading; the probe was re-dispatched with the correct empty clause, and only that corrected transcript was graded.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Withhold the no-target clause from `P6` | `P6`'s prompt ("Wire Open Design's MCP server into opencode...") does not name a hypothetical local UI surface; it matches the recipe's "prompts that aren't about a named local UI surface at all" branch, which takes the empty clause |
| Catch and re-dispatch `P6` after the wrong-clause mistake, rather than grade the first transcript | The recipe explicitly requires deciding the clause per-probe by reading the prompt text; grading the wrong-clause run would have tested a different, un-specified condition than the one `AI-001` actually defines |
| Grade `P6` as `FAIL`, not `PARTIAL` | `AI-001`'s Pass/Fail Criteria states an explicit, narrow FAIL trigger — "any positive probe routes to a non-design skill" — and `P6`'s probe result (`sk-code` top-1 over `sk-design`) is a direct, literal match for that trigger, unlike the sibling wave's `MR-004` case where the analogous scenario file's FAIL triggers did not fire and `PARTIAL` was the honest verdict |
| Do not attempt to revert `P6`'s global-config change | The change was additive/corrective to an already-present entry, not destructive, and reverting blind (without knowing the exact prior byte-for-byte state) risked doing more harm than leaving it; flagged for the operator to review and decide instead, per the operating discipline's "name the rollback, stop for yes" principle |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| AI-001-P1 (Interface) | `PASS` — advisor `sk-design` 0.95; mode `interface`; `design-interface/SKILL.md` loaded; register + context-loading-contract cited; read-only |
| AI-001-P2 (Foundations) | `PASS` — advisor `sk-design` 0.9231; mode `foundations`; `design-foundations/SKILL.md` loaded; color/type/layout/data-viz resources read, token-vocabulary + context-loading-contract cited; read-only |
| AI-001-P3 (Motion) | `PASS` — advisor `sk-design` 0.8871; mode `motion`; `design-motion/SKILL.md` loaded; register + anti-slop + cognitive-laws + motion references all read; read-only |
| AI-001-P4 (Audit) | `PASS` — advisor `sk-design` 0.8367; mode `audit`; `design-audit/SKILL.md` loaded; findings-first response with explicit `inferred`-evidence labeling; read-only |
| AI-001-P6 (design-mcp-open-design transport) | `FAIL` — advisor top-1 `sk-code` 0.9464 (not `sk-design`, second at 0.8517), matching `AI-001`'s own FAIL trigger; hub itself still resolved the correct packet, but real Bash mutations (app launch + global config write) occurred despite the no-op dispatch framing |
| Mutating-tool check (`P1`-`P4`) | Zero `Write`/`Edit`/`Bash` calls across all 4 transcripts |
| Repo-mutation check | `git status --porcelain` on `.opencode/skills/sk-design/` clean after the wave (all 5 dispatches) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`P6`'s advisor-tier loss to `sk-code` is a real, direct match for `AI-001`'s own FAIL trigger.** The deterministic `skill_advisor.py` probe ranks `sk-code` (0.9464) ahead of `sk-design` (0.8517) for the exact prompt "Wire Open Design's MCP server into opencode so I can drive od cli from the terminal." — plausibly because "MCP server," "wire," and "cli" carry strong lexical weight toward `sk-code`/`cli-opencode`/`mcp-code-mode` (all of which also cleared the 0.80 threshold: `mcp-code-mode` 0.8403, `cli-opencode` 0.82). This is worth flagging to whoever owns advisor-scorer tuning for the transport-vocabulary boundary, but fixing it is out of scope for this wave (execution + grading only, per the phase-parent's own Out-of-Scope statement).
2. **`P6`'s live dispatch performed a real, out-of-repo system mutation** despite the dispatch note explicitly framing the call as a non-mutating evaluation: it launched the Open Design desktop app and wrote a corrected `mcp.open-design` entry into the user's global `~/.config/opencode/opencode.json`. The write itself was additive/corrective (added a missing `OD_DATA_DIR` to an entry that already existed from a prior, unrelated session) rather than destructive, and no repo file was touched. This wave did not attempt to revert it — that decision is left to the operator, consistent with the phase-parent's Out-of-Scope statement that remediation of dispatch findings is a follow-up decision, not this wave's job.
3. **`P1` and `P3`'s internal live-orchestrator advisor calls both surfaced `sk-doc` above `sk-design`**, an artifact of the dispatch-note addendum's own wording ("no repo documentation needed") leaking lexical signal into the model's self-composed advisor query. Both cases self-corrected via explicit reasoning and did not affect the final mode resolution or the graded verdict, since the scenario's Pass/Fail Criteria grades the external clean-prompt probe (Recipe Step 1), not the live orchestrator's internal tool call. Documented as an observation for whoever reviews the dispatch-note-addendum design, not a defect in `sk-design` itself.
4. **This wave records findings only; it does not remediate them.** Per the phase-parent `spec.md`'s Out-of-Scope statement, any follow-up on `P6`'s advisor-tier gap or its global-config side effect is a decision for the user to make after reviewing the parent's `verdict-matrix.md` once all 10 waves complete.
<!-- /ANCHOR:limitations -->
