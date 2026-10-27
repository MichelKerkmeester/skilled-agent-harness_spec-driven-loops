---
title: "Decision Record: Router reach check scores the shipped fleet and notes operator-local ties"
description: "Why the router reach check judges the shipped fleet and notes a private surface's tie, instead of adding stage-one vocabulary so the shipped hubs win the phrases outright."
trigger_phrases:
  - "router reach local ties decision record"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/017-portable-code-modes/013-router-reach-local-ties"
    last_updated_at: "2026-10-27T23:30:00Z"
    last_updated_by: "implementer"
    recent_action: "Recorded the shipped-fleet ranking decision"
    next_safe_action: "Conductor commits the lane"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "router-reach-local-ties"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Router reach check scores the shipped fleet and notes operator-local ties

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: The reach check judges the shipped fleet and notes private ties

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-27 |
| **Deciders** | Implementer lane, under the conductor's brief |

---

<!-- ANCHOR:adr-001-context -->
### Context

The reach check failed on the main checkout and passes in CI. An operator-local surface linked into that checkout ranks first on "browser agent" (`mcp-tooling`, tie at 0.8200) and "css extraction" (`sk-design`, 0.8357 against 0.8248). Both phrases are already in the declaring hubs' stage-one `intent_signals`. The lane breakdown shows why the surface wins: its explicit lane reaches the 1.0 clamp from two evidence items, generic one-word author keywords such as `browser` and `css` judging by its declared keyword list, while the shipped hub's one exact phrase match scores 0.88. Which two keywords fire is inferred from that list and the evidence count; an in-process explicit-lane run over the main checkout's projection would confirm it.

What an operator experiences: typing the bare two-word phrase on that machine puts the private surface first, with `ambiguous: true` and the shipped hub second. That is a real but narrow routing miss. A realistic prompt routes right on the same machine: "use the browser agent" puts `mcp-tooling` first and "extract the css from this site" puts `sk-design` first at 0.9036.

### Constraints

- CI never has a private surface, so a verdict that depends on one cannot be reproduced or fixed in the tracked tree.
- No tracked file may name a private surface, so the allowlist cannot pin it as a winner.
- The private surface's files live in another repository and are out of scope.
- A private surface that really owns a phrase must still be able to win on the operator's machine.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: option (a). The reach check ranks only the shipped fleet and reports a private surface ranked ahead of the shipped leader as a non-failing `operator-local` note.

**How it works**: Every recommendation whose id carries the private-skill prefix is dropped before the declaring hub is judged. That is the prefix every advisor reader uses to decide which top-level link may be followed, and `.gitignore` keeps every such entry out of the tracked tree. Hit, presence and the reported winners all come from the shipped list. When the declaring hub leads that list but a private surface sat ahead of it, the row becomes a note that gives the surface's confidence and never its name.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **(a) Judge the shipped fleet, note private ties** | Same verdict on every machine. No advisor change. The operator still sees the tie. A private owner can still win | The bare-phrase miss on that machine stays until the surface's vocabulary or the scorer changes | 9/10 |
| (b) Strengthen the declaring hubs' stage-one vocabulary | The shipped hubs would win these two phrases on that machine | Both phrases are already declared, so the only lever left is a scorer `PHRASE_BOOSTS` anchor, which is TS scorer code with Python parity and accuracy ratchets, or keyword padding the anti-stuffing rules exist to stop. It fixes two phrases against one private surface, and the next surface with other keywords produces other ties. It also overrides a private surface that really owns a phrase | 3/10 |
| (c) Both | Covers the gate and the two phrases | Carries all of (b)'s cost for a miss that realistic prompts do not hit | 4/10 |
| Change the explicit lane so summed one-word hits cannot beat one exact phrase | Fixes the cause for every surface | A fleet-wide scorer recalibration with its own baseline and parity work, beyond a reach-check fix | Deferred |

**Why this one**: The failure is a gate artefact. The check measures tracked vocabulary, and a tie produced by untracked content is not a defect the tracked tree can repair. The real miss belongs to the private surface's own keywords, and the note keeps it visible to the one operator it affects.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The main checkout run goes from `RESULT: FAILED` (outranked=1 on each hub) to `RESULT: PASSED` with `operator-local=2`, at the same advisor generation 1779.
- The private surface's name no longer appears in the reach output. The old outranked rows printed it.

**What it costs**:
- On that machine, the bare phrases "browser agent" and "css extraction" still route to the private surface first. Mitigation: the note names the phrase every run, and the fix belongs to the surface's keywords or the scorer follow-up below.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Dropping private ids hides a shipped hub that takes the phrase | M | Hit and presence are judged on the shipped list. A test puts a shipped rival behind a private surface and asserts exit 1 with an outranked row |
| A shipped skill takes the private-skill prefix | L | `.gitignore` excludes every `/.skilled/skills/local-*` entry, so none can be tracked |

**Follow-up, not in this packet**: the explicit lane in `system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` adds `phraseSpecificity` for every matched author keyword and clamps at 1.0, so two generic one-word keywords outscore one exact two-word phrase. Whether to cap the one-word contribution is a scorer calibration question for the advisor owner, with the scorer-eval and parity ratchets as its gate.
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The doctor target fails on every operator machine that links this surface |
| 2 | **Beyond Local Maxima?** | PASS | Options (a), (b), (c) and a scorer change were weighed against the lane breakdown |
| 3 | **Sufficient?** | PASS | One filter in one script, no advisor or metadata change |
| 4 | **Fits Goal?** | PASS | The gate measures tracked vocabulary, and it now measures only that |
| 5 | **Open Horizons?** | PASS | A private owner can still win, and the scorer follow-up stays open |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `ci-router-vocabulary-reach.cjs`: `isOperatorLocal`, `rankShippedFleet`, the `operator-local` note kind and one `NON_FAILING` set.
- `doctor-router-reach.yaml` and the router-reach playbook scenario describe the new row kind.

**How to roll back**: Revert the commit that carries the reach script, its test and the two contract docs. The advisor and every vocabulary file are untouched, so nothing else needs rebuilding.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---
