---
title: "Implementation Summary"
description: "Three candidate anchor rules fixed every probe and held all eight ratchet metrics, but each moved pinned command and doctor rows, so no scorer change landed."
trigger_phrases:
  - "lexical anchor narrowing implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/014-lexical-anchor-narrowing"
    last_updated_at: "2026-11-24T13:30:00Z"
    last_updated_by: "claude"
    recent_action: "Measured three candidate rules and stopped on moved pins"
    next_safe_action: "Find a rule that keeps the typed /create:* rows on sk-doc before landing any anchor change"
    blockers:
      - "Every measured candidate moved pinned command and doctor slice rows"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-014-lexical-anchor-narrowing"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 014-lexical-anchor-narrowing |
| **Completed** | Not completed: blocked 2026-11-24 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

No scorer change landed. This packet now holds the measurements a future rule needs: which clause fires each false lift, three candidate rules, and the pinned rows each one moved.

### Attribution

A temporary trace in `fusion.ts`, since removed, recorded each anchor clause per skill for the five probe prompts.

| Lift | Clause that fired | Note |
|------|-------------------|------|
| local-webflow, "fix the code in the parser" | Direct-score lift, expanded lexical 0.67 | The branch above 0.65 has no anchor test at all |
| sk-code, "rewrite this prompt so it is shorter" | Direct-score lift, expanded lexical 0.67, no prompt word in its vocabulary | Same branch |
| cli-external-orchestration, container prompt | Id noun "orchestration" plus `token:patch` | The companion word was a synonym of "fix" |
| mcp-code-mode, container prompt | Lexical anchor 0.50 on "orchestration" and "config" | Both prompt words |
| cli-classifier and sk-doc, doctor prompt | Lexical anchor 0.50 on "run" and "check" | 13 and 22 of 61 skills list them |
| cli-external-orchestration, plan prompt | Lexical anchor 0.50 on "plan" and "mode" | Shared words |

### Candidates

| Candidate | Probes | Ratchet (8 metrics) | Pinned rows moved |
|-----------|--------|---------------------|-------------------|
| A: anchor on prompt words in at most 5% of entries, plus direct lift needs an anchor, plus literal id-noun companion | All five behave | Unchanged | Command slice (11 rows, attached 19 to 12), doctor slice, golden sk-doc changelog, 3 scorer tests |
| B: A without the direct-lift rule | Parser and rewrite lifts return | Unchanged | Command slice (attached 19 to 15), 1 doctor row, 1 scorer test |
| C: A with sharing counted over skills only, 15% share | All five behave | Unchanged | Command slice (9 rows), 1 doctor row, 2 scorer tests |

In every candidate, typed command prompts such as `/create:changelog`, `/create:command`, `/create:goal`, `/create:skill-parent` and `/speckit:save` lose sk-doc as top, and with it the attached command offer. The words those prompts carry are shared by sk-doc, its modes and the command entries, so a sharing cap removes the anchor sk-doc depends on.

Candidate C's source is kept in `scratch/` as text files for the next attempt.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each candidate ran first against the in-process ratchet metrics and the five probes, then against the full advisor suite on a rebuilt `dist`. The suite's first run also failed tests that call `dist`, because `dist` was stale; those passed once it was rebuilt, and only the real moves are listed above. The advisor source was restored to HEAD and `dist` rebuilt.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Record and stop (Q012) | Every candidate takes sk-doc off typed command prompts, a real routing loss, not only a re-pin |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baseline probes on HEAD | Match the measured block in `spec.md` |
| Ratchet metrics, every candidate | full 161, unknown 14, false fires 5, holdout 49, ambiguity 21, review 25, memory save 27, delegation 22 (C at 25%: unknown 13) |
| Full advisor suite, candidate A | 11 failed against a baseline of 1, of which 7 are real moves after a `dist` rebuild |
| Advisor source after the stop | `git status` shows no change under the advisor runtime |
| `validate.sh --strict` on this packet | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The five false lifts remain.** The advisor is unchanged.
2. **The browser hub's P2 #15 stays open here.** The id-noun clause still reads the capped evidence list.
<!-- /ANCHOR:limitations -->

---
