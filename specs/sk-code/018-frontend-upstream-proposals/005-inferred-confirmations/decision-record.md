---
title: "Decision Record: Phase 5: inferred-confirmations"
description: "Verdicts on proposal ranks 10 to 13, each from one saved run: ranks 10 and 11 confirmed, rank 12 half confirmed, rank 13 refuted."
trigger_phrases:
  - "inferred confirmations decision record"
  - "rank verdicts"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/018-frontend-upstream-proposals/005-inferred-confirmations"
    last_updated_at: "2026-11-03T12:45:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Recorded four rank verdicts from saved runs"
    next_safe_action: "Build the rank 10 fix"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ae286a84-7880-4ce7-a5fe-7d1335e09c78"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Rank 11: normalise hyphens in every matcher (operator, 2026-11-03)."
      - "Rank 12: warn on a root mismatch (operator, 2026-11-03)."
---
# Decision Record: Phase 5: inferred-confirmations

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
### ADR-001: Rank 10 is confirmed, with a different cause

#### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, confirmed |
| **Date** | 2026-11-03 |
| **Deciders** | Saved run, `scratch/rank10-replay.txt` |

#### Context

The proposal said the stage-two replay drops the per-keyword weights of the `(phrase, weight)` tuples in the fundamentals router, and inferred that this is why a control prompt resolved no intent there.

#### Decision

**Confirmed.** The exported `parseRouter` returns no intents for `sk-design-fundamentals/ROUTER.md`, and a control prompt scores nothing. The cause is the dict name: the replay looks for the literal `INTENT_SIGNALS = {` and the router declares `INTENT_MODEL = {`, a name `root-router-contract.cjs` explicitly allows for a non-hub packet router. With the name corrected in memory, the ten intents parse and route, and the tuples are a second defect: every weight collapses to 1, so a canonical-grammar router scores 8 where the tuple form scores 3.

**The fix:** the replay reads `INTENT_MODEL` when `INTENT_SIGNALS` is absent, as the contract does, and reads each tuple's weight.

#### Consequences

- The replay and the root-router contract read the same grammar. Nineteen routers declare `INTENT_MODEL`.

#### Implementation

**How to roll back**: `git revert` the rank 10 commit.
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
### ADR-002: Rank 11 is confirmed, and every matcher is normalised

#### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, confirmed |
| **Date** | 2026-11-03 |
| **Deciders** | Saved run, `scratch/rank11-trace.txt`; fix scope chosen by the operator |

#### Context

The proposal inferred that the sk-code hub treats "x-y" and "x y" differently when it picks a mode from its aliases.

#### Decision

**Confirmed.** The matcher is `containsSignal` in sk-code's canary router, a lower-cased substring test reached through `resolveRoute`, `compiledRoute` and `evaluateCanary`. With the test alias "widget panel" compiled into the vocabulary class, "widget panel layout bug" routes to `sk-code-frontend` and `sk-code-skilled`, while "widget-panel layout bug" routes to `sk-code-skilled` only. A hyphenated keyword fails the same way in reverse.

**The fix:** hyphen and space are treated alike on both the prompt and the signal, in every copy of the matcher: the five hub routers (sk-code, sk-doc, sk-design, mcp-tooling, system-deep-loop), the two policy cards, the compiler projection and the leaf replay's keyword hits.

#### Consequences

- A hyphenated and a spaced prompt route the same way on every hub.
- Normalising can create new matches, so every hub's compiled-route suites and a reach run on every hub gate it.

#### Implementation

**How to roll back**: `git revert` the rank 11 commit, then `compiled-route-sync.cjs` to republish the served copies.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
### ADR-003: Rank 12 is half confirmed, and a mismatch now warns

#### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, half confirmed |
| **Date** | 2026-11-03 |
| **Deciders** | Saved run, `scratch/rank12-index.txt`; fix chosen by the operator |

#### Context

The proposal said a project that links the Skilled source in gets a trigger index with none of its own `specs/` paths, and inferred that this holds even with `--repo-root .`.

#### Decision

**Half confirmed.** Run plainly from a temp project that links `.skilled`, the generator indexed 13,554 `specs/` paths from the source checkout and none of the project's, and exited 0 with no warning: confirmed. With `--repo-root .` it indexed exactly the project's one spec: refuted.

**The fix:** when the script's own repo root differs from the caller's git root and no `--repo-root` was passed, the generator prints a warning naming both roots and the `--repo-root` and `--out` flags. The default is unchanged.

#### Implementation

**How to roll back**: `git revert` the rank 12 commit.
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
### ADR-004: Rank 13 is refuted and dropped

#### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, refuted |
| **Date** | 2026-11-03 |
| **Deciders** | Saved run, `scratch/rank13-save.txt` |

#### Context

The proposal said a save aimed at a phase parent exits 0 but scores the payload 0/100, and proposed printing why a payload scores 0.

#### Decision

**Refuted and dropped.** A minimal payload exits 1 with `INSUFFICIENT_CONTEXT_ABORT` and writes nothing. A rich payload at a phase parent exits 0 and refreshes `description.json` and `graph-metadata.json` only, and the post-save review is skipped with null scores: no 0/100 is produced. A child-leaf control behaves the same, so nothing here is specific to phase parents. The metadata-only write is the documented plan-only behaviour, since only `--full-auto` writes continuity fields. No file changes for this rank.

**Noted for the operator, out of scope:** a plan-only save does not say that it skipped the continuity fields.
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Normalise in every matcher | Every hub should treat hyphen and space alike, not only sk-code | The sk-code-only option | ADR-002, T007 |
| Q002 | Warn on root mismatch | Every caller keeps today's default | Changing the default root | ADR-003, T008 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

- **Q001** asked which rank 11 fix to build. Options: "Normalise in sk-code only (Recommended)", "Normalise in every matcher", "Compiler warning only". Answer: "Normalise in every matcher".
- **Q002** asked which rank 12 fix to build. Options: "Warn on root mismatch (Recommended)", "Default to the caller's root". Answer: "Warn on root mismatch (Recommended)".
<!-- /ANCHOR:operator-answers-verbatim -->

---
