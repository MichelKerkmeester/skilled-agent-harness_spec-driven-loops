---
title: "Implementation Summary"
description: "Ran 5 assigned manual-playbook dispatches (TV-002-V2/V3/V4, TV-003, TV-004) against the sk-design orchestrator, grading each against its scenario file's own Pass/Fail Criteria. Result: 2 PASS, 3 FAIL, all with cited evidence."
trigger_phrases:
  - "implementation"
  - "summary"
  - "wave 005 implementation summary"
  - "transform verb should it be summary"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/005-transform-verb-should-it-be"
    last_updated_at: "2026-07-07T17:22:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Completed implementation-summary.md; all tasks and checklist items done"
    next_safe_action: "Run generate-description.js, backfill-graph-metadata.js, validate.sh --strict"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "dispatch-log.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "wave-005-should-it-be"
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
| **Spec Folder** | 005-transform-verb-should-it-be |
| **Completed** | 2026-07-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Ran the validated advisor-probe-then-live-dispatch recipe against 5 dispatches assigned to this wave from the `03--transform-verb-framing` manual-playbook category: three of `TV-002`'s four "should it be" variants (`V2` quieter, `V3` distill, `V4` delight), plus the full `TV-003` (`clarify` alias-only routing) and `TV-004` (`typeset`/`colorize` foundations-exclusion) scenarios. Each dispatch got an advisor probe (clean prompt, no addendum) and a live `opencode run` dispatch (clean prompt + standard dispatch-note addendum), with the full JSON-lines transcript captured and parsed before grading. Result: **2 PASS (TV-002-V2, TV-002-V3), 3 FAIL (TV-002-V4, TV-003, TV-004)** — all three failures trace to a concrete, quoted transcript detail, not a generic judgment call.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `dispatch-log.md` | Created | One row per dispatch: prompt, advisor result, resolved mode/packet, verdict, rationale citing the specific scenario criterion |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` | Created | Level 2 spec-folder documentation for this wave, mirroring `../022-benchmark-rerun-and-coverage-fill/`'s shape |
| `/tmp/skd-TV002-V2-response.jsonl`, `/tmp/skd-TV002-V3-response.jsonl`, `/tmp/skd-TV002-V4-response.jsonl`, `/tmp/skd-TV003-response.jsonl`, `/tmp/skd-TV004-response.jsonl` | Created (ephemeral) | Raw live-dispatch transcripts, the ground-truth evidence for grading |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Read all 3 constituent scenario files in full first (`should-it-be-audit.md`, `clarify-alias-only.md`, `foundations-excluded-aliases.md`) to capture their exact prompts and Pass/Fail Criteria verbatim, then checked sibling wave folders in `023-full-manual-playbook-execution/` to confirm no folder collision with concurrently-running sibling waves.

Ran the 5 dispatches strictly sequentially. For TV-002-V2 and TV-002-V3 (`Should it be quieter, or would that reduce conversion clarity?` and `Should it be distill the interface to fewer elements before launch?`), the advisor probe (`skill_advisor.py --threshold 0.8`) returned an empty `[]` result — meaning the standalone CLI advisor lost, contradicting the scenario's own "Expected advisor behavior: win... >= 0.80" assertion. Despite that, the live orchestrator dispatch still correctly self-routed to `sk-design` -> `audit` for both, loading `design-audit/SKILL.md` and answering as critique/evaluation (weighing the tradeoff before recommending), which is exactly what `should-it-be-audit.md`'s PASS bar requires. This showed the live dispatch path carries routing signal beyond what the isolated probe CLI receives.

TV-002-V4 (`Should it be delight users more, or would that feel gratuitous?`) broke that pattern: the advisor probe also lost (`[]`), and this time the live dispatch failed to route at all — zero `skill` tool calls, the model answered directly with generic copywriting/wordsmithing suggestions instead of design critique. This matches the scenario's own Failure Triage step 3 ("If advisor loses, inspect sk-design advisor signals for design-review and transform-question wording") almost exactly — "delight ... gratuitous" phrasing evidently carries markedly weaker sk-design vocabulary signal than "quieter ... conversion clarity" or "distill the interface ... elements," weak enough that even the live dispatch's richer routing context couldn't recover it.

TV-003 (`Clarify this hero section's visual hierarchy without changing its content.`, run with the NO_TARGET_CLAUSE since "this hero section" names a hypothetical local target) won the advisor probe cleanly (`0.8835`), but the live dispatch resolved `foundations` instead of `interface` — the model's own stated reasoning was `"Selected mode: foundations, because the request is specifically visual hierarchy and information hierarchy, not implementation, motion, or audit."` This is a genuine, reproducible routing collision: `mode-registry.json`'s `aliasOnly: ["clarify"]` says the verb `clarify` should force `interface`, but `sk-design/SKILL.md`'s own Mode Vocabulary Guardrails explicitly assign "visual hierarchy, information hierarchy" as `foundations`-owned nouns — the noun phrase in the prompt out-competed the verb alias in the model's own routing logic.

TV-004 (`Make it typeset and colorize, but do not create a full token system.`) also won its advisor probe (`0.82`, tied top score among several skills but `sk-design` highest), and the live dispatch correctly loaded `design-interface` — but it also loaded `design-foundations`, with the model's own stated justification being `"the requested change is typography and color application"` — i.e. exactly `typeset`/`colorize`, the two terms `mode-registry.json`'s `excludedAliases.foundations` explicitly lists to prevent triggering `foundations` on their own. This matches `foundations-excluded-aliases.md`'s FAIL trigger verbatim.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Run dispatches strictly sequentially, grading each immediately after its transcript is captured | Kept every verdict anchored to a freshly-read transcript instead of batching all 5 and grading from memory, reducing misattribution risk |
| Grade TV-002-V4, TV-003, and TV-004 as FAIL even though none literally matches every word of their scenario's explicit "FAIL iff ..." trigger | Each scenario's PASS criterion uses "iff" (if-and-only-if); since the PASS bar's load-bearing clause (mode resolution / packet load / no-foundations-load) was not met in each case, PASS could not be claimed — and for TV-004 the transcript evidence directly matches the scenario's own explicit FAIL trigger, not just the PASS-bar omission |
| Document the advisor-probe-vs-live-dispatch disagreement as a named cross-cutting finding rather than silently picking one source of truth | Both TV-002-V2/V3 (probe loses, live dispatch still routes correctly) and TV-002-V4 (both lose together) are real, useful signal about where the routing-confidence gap actually lives — worth surfacing to whichever later packet remediates it |
| Leave root-cause remediation (registry/hub-router/SKILL.md changes) out of scope | This wave's job per the task brief is to run dispatches and grade against existing scenario contracts, not to fix the routing gaps it surfaces — that belongs to a dedicated remediation packet with its own scope and review |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| TV-002-V2 | **PASS** — `audit` resolved, `design-audit/SKILL.md` loaded, answer is critique/evaluation |
| TV-002-V3 | **PASS** — `audit` resolved (explicit `SKILL ROUTING:` line), `design-audit/SKILL.md` loaded, answer is evaluative |
| TV-002-V4 | **FAIL** — zero `skill` tool calls, generic copywriting answer, no packet loaded |
| TV-003 | **FAIL** — `foundations` resolved instead of `interface`; `design-interface/SKILL.md` never loaded |
| TV-004 | **FAIL** — `design-foundations` loaded, justified explicitly by typeset/colorize wording, matching the scenario's own FAIL trigger |
| `validate.sh --strict` | Errors:0 (see checklist.md CHK-file-org and this folder's own validation run) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **This wave observes and grades only — it does not remediate.** The three real routing gaps surfaced here (TV-002-V4's complete non-routing, TV-003's `foundations`-vs-`interface` vocabulary collision, TV-004's `excludedAliases.foundations` boundary being overridden by the hub's own build-bundle rule) are left for a dedicated remediation packet, per this wave's explicit out-of-scope declaration in `spec.md`.
2. **Single-sample grading.** Each dispatch ran once; model non-determinism means a re-run could show variance, particularly for TV-002-V2/V3 where the live dispatch's self-correction over the advisor probe's `[]` result appeared to depend on borderline routing signal.
3. **TV-002-V1 is out of this wave's scope** — assigned to a different wave/agent in the same parallel run; this wave's own advisor sanity-checks against it (used only to confirm tooling worked) are not a substitute for that wave's own graded dispatch.
<!-- /ANCHOR:limitations -->
