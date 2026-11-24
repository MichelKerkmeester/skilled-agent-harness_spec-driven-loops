---
title: "Implementation Summary"
description: "Candidate E landed as advisor 2.0.4.0: the lexical anchor needs a distinctive prompt word, the strong-score lift needs an anchor, and a typed command names its owner. Two of five probe lifts are gone and no pin moved."
trigger_phrases:
  - "lexical anchor narrowing implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/014-lexical-anchor-narrowing"
    last_updated_at: "2026-11-24T13:30:00Z"
    last_updated_by: "claude"
    recent_action: "Landed candidate E as advisor 2.0.4.0"
    next_safe_action: "Find a stricter rule for the three remaining lifts that moves no pin"
    blockers:
      - "Three probe lifts remain; the stricter rules tried moved pinned rows"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-014-lexical-anchor-narrowing"
      parent_session_id: null
    completion_pct: 80
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
| **Completed** | Partial, 2026-11-24 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Candidate E landed as advisor 2.0.4.0. It clears two of the five probe lifts and moves no pinned row. Three stricter candidates, A to C, cleared all five but moved pinned rows, and are recorded here for the next attempt.

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
| **E, landed**: lexical score 0.45 or more plus one prompt word at most 25% of skills list (commands left out), direct lift needs an anchor, literal id-noun companion, a typed command names its owner | Parser and doctor lifts gone; container, rewrite (sk-doc) and plan lifts remain | Unchanged | None: suite fails only the known test |

In every candidate, typed command prompts such as `/create:changelog`, `/create:command`, `/create:goal`, `/create:skill-parent` and `/speckit:save` lose sk-doc as top, and with it the attached command offer. The words those prompts carry are shared by sk-doc, its modes and the command entries, so a sharing cap removes the anchor sk-doc depends on.

Candidate C's source is kept in `scratch/` as text files for the next attempt. E kept sk-doc on the typed `/create:*` rows because those prompts name an sk-doc command, which the new typed-command clause counts as naming sk-doc.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each candidate ran first against the in-process ratchet metrics and the five probes, then against the full advisor suite on a rebuilt `dist`. The suite's first run also failed tests that call `dist`, because `dist` was stale; those passed once it was rebuilt, and only the real moves are listed above. After the operator's go-ahead for a fresh attempt, candidate E was traced on the 13 moved prompts, measured, written clean, and re-run from the final code.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Record and stop on A to C (Q012) | They take sk-doc off typed command prompts, a real routing loss |
| Land E (Q013) | It holds every pin and clears two lifts |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baseline probes on HEAD | Match the measured block in `spec.md` |
| Ratchet metrics, every candidate | full 161, unknown 14, false fires 5, holdout 49, ambiguity 21, review 25, memory save 27, delegation 22 (C at 25%: unknown 13) |
| Full advisor suite, candidate A | 11 failed against a baseline of 1, of which 7 are real moves after a `dist` rebuild |
| Full advisor suite, final E code | 3,206 passed, 4 skipped, 1 failed (the known `system-skilled-bots` test) |
| `tests/scorer/lexical-anchor-naming.vitest.ts` | 3 passed; 2 fail on HEAD; the typed-command case fails without its clause |
| mcp-browser-use replay on the rebuilt `dist` | 55 PASS, 1 FAIL (MBU-PB-04), every row as before |
| `validate.sh --strict` on this packet | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Three probe lifts remain:** mcp-code-mode and the browser hub on the container prompt, sk-doc on the rewrite prompt, cli-external-orchestration on the plan prompt. Each shares a word few skills list.
2. **No pinned slice row was added** for the probes, because new rows change the pinned baselines.
<!-- /ANCHOR:limitations -->

---
