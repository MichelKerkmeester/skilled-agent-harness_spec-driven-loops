---
title: "Decision Record: Advisor phrase calibration: an exact declared multi-word phrase beats repeated generic one-word hits"
description: "Collapse a bare word a skill declares in two fields instead of capping or reweighting single-word hits, because the measured cause is a repeated bare word and the collapse moves no top-1 on any gated or probed prompt."
trigger_phrases:
  - "advisor phrase calibration decision record"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/017-portable-code-modes/014-advisor-phrase-calibration"
    last_updated_at: "2026-10-27T23:59:00Z"
    last_updated_by: "implementer"
    recent_action: "Recorded the dedup decision and the rejected calibrations"
    next_safe_action: "Conductor wires the child into the parent phase table"
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts"
      - ".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "014-advisor-phrase-calibration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Advisor phrase calibration: an exact declared multi-word phrase beats repeated generic one-word hits

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Count a repeated bare-word author phrase once per skill

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-27 |
| **Deciders** | Implementer lane, under the conductor's approved fix plan |

---

<!-- ANCHOR:adr-001-context -->
### Context

The report said a skill with two generic one-word keywords reaches the explicit-lane cap from two one-word hits. The lane breakdown showed the two hits are the same word: `author:browser` twice and `author:css` twice, once from graph-metadata `intent_signals` and once from the SKILL.md keyword list, which the lane reads one after the other. One bare word scores 0.7, so a repeat scores 1.4 and clamps to 1.0, while an exact two-word phrase scores 0.88. Weighted by the explicit lane's 0.42, the repeat gave the fixture surface 0.420 against the hub's 0.370, enough to beat mcp-tooling on `browser agent` (0.544667 to 0.533608) and sk-design on `css extraction` (0.603467 to 0.582933). Declared in only one field, the same word scored 0.700 and both hubs won.

### Constraints

- TypeScript and Python must keep agreeing on top-1, held by the python-ts parity and local-native divergence ratchets.
- The routing-accuracy baseline (155/195, 49/66, 19/24 at capture) is a ratchet: any moved number forces a recapture, and a drop is not shippable.
- An outside repository's metadata is not ours to edit, so the fix belongs in the scorer.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: collapse only single-word author phrases. In the TypeScript explicit lane a bare word declared in both `intent_signals` and the keywords counts once, and a multi-word phrase declared in both still counts twice. In the Python mirror a bare-word keyword that repeats the skill's own matched signal is skipped only when another skill matched an exact multi-word signal holding that word.

**How it works**: `scoreExplicitLane` keeps a per-skill `Set` of the bare words (one `\w+` token) it has scored and skips a repeat of one; any longer phrase is scored for every field that declares it, as before. In Python, `_apply_signal_boosts` now returns the signals each skill matched; the keyword pass collects the words of every matched multi-word signal per skill and drops a one-token keyword that repeats the skill's own matched signal and is one of a rival skill's phrase words.

**Why bare words only**: the first TypeScript version collapsed every repeat. The real projection holds 150 repeats across 19 skills, most of them specific multi-word phrases, and one prompt moved: `help me with markdown notes in this repo` flipped from mcp-tooling to sk-doc (the reviewer measured sk-doc 0.688117 over mcp-tooling 0.674887, against mcp-tooling 0.725287 on the unchanged scorer), because mcp-tooling declares `markdown notes` in both fields and lost its second count. The fault is a generic word reaching the cap, and a two-word phrase repeated is not generic, so the collapse now stops at one token. With it, that prompt scores mcp-tooling 0.715388 over sk-doc 0.688114 in the pinned probe regime (empty DB dir, semantic off, `VITEST=true`), identical to the unchanged build in the same regime, and the reviewer's 320-prompt repeat probe moves 0 top-1 against the unchanged build (56 top scores change, all on bare-word repeats such as `jev_mcp` and `composer`, none enough to reorder).

**Why Python adds the rival condition**: both sides now collapse only bare words, which is as close as the two can sit. The plain collapse was tried in Python first and cost two gold-correct rows: the legacy corpus parity fell from 113 to 111 Python-correct, and the divergence ratchet gained `rr-iter3-151` (local `system-spec-kit`, gold `system-deep-loop`) and `rr-hub6-206` (local `none`, gold `mcp-tooling`). `rr-hub6-206` rests on the bare word `mobbin` counting as keyword and as signal, because the Python keyword boost (1.0) and signal boost (0.9) are tuned with such repeats in them, while the TypeScript lane clamps at 1.0 and its eval baseline did not move. So Python skips the repeat only when it competes with a rival's exact phrase, which is the case the fault is about, and keeps it otherwise. Removing the rival condition from Python, or adding it to TypeScript, would make the rules identical at the price of either those two rows or a cross-skill pre-pass in the TypeScript lane that no measured prompt needs.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Collapse a repeated bare word: always in TypeScript, under a rival exact phrase in Python** | Fixes the measured cause on both sides; moves no corpus, holdout, ambiguity, parity, reach or 320-prompt probe top-1 | Python adds a condition TypeScript lacks; two different declared words still add, so a skill that declares both `browser` and `agent` can still tie or beat `browser agent` | 9/10 |
| Collapse every repeated phrase in TypeScript | Simplest TypeScript rule | Flipped `help me with markdown notes in this repo` from mcp-tooling to sk-doc, because specific phrases such as `markdown notes` are declared in both fields on purpose | 3/10 |
| Plain bare-word collapse in Python too | One rule on both sides | Python lost 2 gold-correct rows (113 to 111) and the divergence ratchet gained `rr-iter3-151` and `rr-hub6-206` | 4/10 |
| Cap the sum of single-word author hits below a two-word phrase (0.85 or the 0.7 maximum) | Also covers two distinct bare words | Changes the score of every skill whose correct route rests on several single-word hits, with no confirmed case that needs it | 5/10 |
| Raise two-word phrase specificity to 1.0 | One constant | Ties the clamped repeat at 1.0 instead of beating it, and lifts every multi-word phrase across the fleet | 3/10 |
| Lower the explicit lane weight or the 0.82 confidence floor | Shrinks the gap the repeat creates | Shared by every prompt, so it trades this fault for accuracy elsewhere | 2/10 |
| Ask outside surfaces to drop repeated words | No scorer change | Outside repositories are not ours, and the next surface repeats the mistake | 1/10 |

**Why this one**: the repeated bare word is the cause the breakdown shows, and collapsing it is enough for both phrases on the real projection: mcp-tooling now leads 0.533605 to 0.418667 and sk-design 0.582933 to 0.477467. The cap would answer a case nobody has reported and touches every multi-keyword route, so it stays out until a real prompt shows distinct bare words beating a declared phrase.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- On the fixture skills, an exact declared phrase outranks a bare word repeated across fields, in both scorers; one vitest spawns the Python scorer on the same fixture root and asserts both scorers pick the hub.
- `author:` evidence lists a repeated bare word once, so the lane breakdown no longer shows that phantom repeat.

**What it costs**:
- In TypeScript a skill that declared a bare word in two fields loses the second count. Mitigation: no gated corpus row and none of the 320 probe prompts changes its top-1, so no measured route depended on it.
- The Python rule is narrower than the TypeScript one. Mitigation: the parity and divergence ratchets fail the first prompt where the two disagree on top-1, and the divergence corpus now holds `delegate to opencode` and `opencode cli`, the two gated prompts where the Python skip fires (both still route to cli-external-orchestration).

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Distinct generic words still sum past a two-word phrase | M | Recorded here as the open case; the cap alternative is ready to measure when a real prompt shows it |
| The two scorers drift apart on future metadata | L | The parity and divergence ratchets fail on any new top-1 disagreement |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The fixture breakdown shows both shipped hubs losing their own exact phrase |
| 2 | **Beyond Local Maxima?** | PASS | Six other calibrations compared above, three of them measured |
| 3 | **Sufficient?** | PASS | The narrowest change that removes the measured cause: it touches only bare-word repeats, and both phrases route correctly after it |
| 4 | **Fits Goal?** | PASS | Outside surfaces can no longer take a hub's exact phrase with a repeated bare word |
| 5 | **Open Horizons?** | PASS | Leaves the specificity table and weights untouched for later tuning |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `runtime/lib/scorer/lanes/explicit.ts`: a per-skill `scoredSingleWords` set in the author loop, used only for one-token phrases.
- `runtime/scripts/skill_advisor.py`: `_apply_signal_boosts` returns matched signals, a `_phrase_tokens` helper splits a phrase into words, and the keyword pass skips a one-token repeat that is a word of a rival skill's matched multi-word signal.

**How to roll back**: revert the commit that carries the two scorer edits and their tests, then run `npm --prefix .skilled/skills/system-skill-advisor/runtime run build` so the daemon serves the old lane.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---
