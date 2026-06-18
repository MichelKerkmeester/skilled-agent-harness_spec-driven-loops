# Iteration 001 — fable-mode-main net-new mechanisms

## Focus

Systematically extract every net-new fable-5 technique, ritual, mechanism, and measurement surface from `external/fable-mode-main/` (`fable-mode.md` + `fable-mode-profile.md`) that is not already covered by `external/Fable5.md` or round 1's shipped set (`001-initial-refinement`). Tag each item by category (doctrine | ritual | mechanism | measurement | model-specific).

## Sources

- `[SOURCE: file:.opencode/specs/skilled-agent-orchestration/144-operate-like-fable-5/external/fable-mode-main/fable-mode.md]`
- `[SOURCE: file:.opencode/specs/skilled-agent-orchestration/144-operate-like-fable-5/external/fable-mode-main/fable-mode-profile.md]`
- Baseline/dedup: `[SOURCE: file:.opencode/specs/skilled-agent-orchestration/144-operate-like-fable-5/external/Fable5.md]` and `[SOURCE: file:.opencode/specs/skilled-agent-orchestration/144-operate-like-fable-5/001-initial-refinement/implementation-summary.md]`

---

## Findings

### 1. Mutation-check ritual (ritual / mechanism) — NET-NEW vs round 1

Fable does not accept a green test as evidence that the test has teeth. After GREEN, it deliberately breaks the production code and confirms the specific test fails, then restores. This is a named fifth step beyond stub-to-compile / true RED / implement / GREEN.

> "After a test goes green, Fable deliberately breaks the production code and confirms the specific test fails, then restores."
> `[SOURCE: file:.opencode/specs/skilled-agent-orchestration/144-operate-like-fable-5/external/fable-mode-main/fable-mode-profile.md:111-123]`

Round 1 shipped "verify before you claim" and "baseline + delta" but did not institutionalize the mutation check. This is a concrete mechanism that can ride the sk-code skill or a test-policy surface.

### 2. Verification ladder (mechanism) — NET-NEW vs round 1

Fable climbs five layers: unit/table tests → in-memory orchestration → on-server integration → live production verification → headless-browser smoke. Each layer has a named blind spot.

> "in-memory-green is not production-green"
> `[SOURCE: file:.opencode/specs/skilled-agent-orchestration/144-operate-like-fable-5/external/fable-mode-main/fable-mode-profile.md:126-139]`

Round 1 did not add a ladder; the framework currently relies on "run the gate" without distinguishing layers. This maps directly to sk-code and any test/CI surface.

### 3. Adversarial review at scale with forced evidence schema (mechanism) — NET-NEW vs round 1

Fable spawns fleets of claim-verifiers, adversarial recheckers, and completeness critics. Output is forced into `claim / verdict / evidence` triples with file:line and verbatim quote. Agent counts grew 5 → 13–14 → 24 → 34.

> "The output schema forces a claim / verdict / evidence triple with a file:line and a verbatim quote per claim"
> `[SOURCE: file:.opencode/specs/skilled-agent-orchestration/144-operate-like-fable-5/external/fable-mode-main/fable-mode-profile.md:141-147]`

Round 1 has `finding-is-a-hypothesis.md` but not the fleet-of-reviewers mechanism or the evidence schema. This is a strong candidate for the `deep-review` skill or a pre-merge review gate.

### 4. Scar-tissue curation with blast-site annotation (ritual / mechanism) — NET-NEW vs round 1

Fable maintains a "Traps already hit (do not rediscover)" ledger. Each entry records: (a) the blast site, (b) where the trap will bite next, (c) whether a guard is currently load-bearing or defensive with activation condition.

> "It records the blast site, not just the rule"
> `[SOURCE: file:.opencode/specs/skilled-agent-orchestration/144-operate-like-fable-5/external/fable-mode-main/fable-mode-profile.md:203-211]`

Round 1's `finding-is-a-hypothesis.md` is adjacent but does not create a durable scar-tissue ledger. A `scar-tissue.md` constitutional rule or handover-section template is a new surface.

### 5. Cold-successor handoff as engineered protocol (ritual) — NET-NEW vs round 1

Fable invests heavily in handoff docs judged by role-playing a cold reader with nothing else. Handoff includes a numbered Read order, a brief for the next slice, and known gaps.

> "the handoff opens with a numbered Read order that tells a cold session which docs to read and what each settles"
> `[SOURCE: file:.opencode/specs/skilled-agent-orchestration/144-operate-like-fable-5/external/fable-mode-main/fable-mode-profile.md:213-217]`

Round 1 added handover.md conventions but did not formalize a cold-successor protocol. The `system-spec-kit` handover template could carry a mandatory cold-reader checklist.

### 6. Rotted-list → self-auditing test (mechanism) — NET-NEW vs round 1

Fable converts facts that will rot into machinery that fails loudly. Example: CSRF coverage changed from a list to a table-walking test; routes became a data table.

> "Routes become a table; CSRF coverage is now a test, not a list"
> `[SOURCE: file:.opencode/specs/skilled-agent-orchestration/144-operate-like-fable-5/external/fable-mode-main/fable-mode-profile.md:219-224]`

Round 1 did not ship any self-auditing test machinery. This maps to the `system-spec-kit` validation scripts and any enumeration that can be table-driven.

### 7. Reuse maps + anti-reuse warnings (mechanism) — NET-NEW vs round 1

Fable writes explicit reuse maps telling the next implementer what to build on AND which superficially-similar code to NOT reuse. A wrong map is treated as actively dangerous.

> "The reuse map's central claim is backwards. ... An implementer following the map as written would embed full framed documents inside the editor"
> `[SOURCE: file:.opencode/specs/skilled-agent-orchestration/144-operate-like-fable-5/external/fable-mode-main/fable-mode-profile.md:235-240]`

No reuse-map surface exists in the framework today. This could live in `resource-map.md` or a per-packet `reuse-map.md`.

### 8. Single-event blast-radius lists (mechanism) — NET-NEW vs round 1

Fable pre-collects every decision that would be re-validated or broken by a single trigger (e.g., upgrading a dependency). Each trap states its activation condition.

> "on any upgrade re-check SIX things ..."
> `[SOURCE: file:.opencode/specs/skilled-agent-orchestration/144-operate-like-fable-5/external/fable-mode-main/fable-mode-profile.md:226-233]`

Round 1 has "name what still speaks the old contract" but not a structured blast-radius list keyed to triggers. A `BLAST-RADIUS.md` or trigger-driven checklist is a new surface.

### 9. Two-register voice split (doctrine / model-specific) — NET-NEW vs round 1

Fable speaks clipped colon-terminated fragments while working ("GREEN. Committing:") and dense complete prose at turn boundaries. Commit register stays clean; spoken/docs register uses em-dashes and parentheticals.

> "Terse while working; verbose at turn boundaries and in docs"
> `[SOURCE: file:.opencode/specs/skilled-agent-orchestration/144-operate-like-fable-5/external/fable-mode-main/fable-mode-profile.md:420-427]`

Round 1 did not add voice-register guidance. This is model-specific output shaping; could ride agent prompts or a `sk-prompt` scaffold.

### 10. Fable lexicon (doctrine) — NET-NEW vs round 1

Signature vocabulary: `pin`, `verify`, `trap`, `drift`, `deliberately`, `honest`, `byte-identical`, `load-bearing`, `seam`, `tripwire`, `fail closed`, `rides / for free`, `would misdirect`, `scar tissue`, `flat wrong / backwards / stale`.

> "If you had to pick three words: it pins, it verifies, it disarms traps"
> `[SOURCE: file:.opencode/specs/skilled-agent-orchestration/144-operate-like-fable-5/external/fable-mode-main/fable-mode-profile.md:438-460]`

Round 1 did not ship a lexicon. A `fable-lexicon.md` or embedded lexicon section could standardize communication.

### 11. Multi-agent orchestration house rules (mechanism) — PARTIALLY covered, net-new as codified rules

Fable's implementer agents are scoped to disjoint paths, banned from git and from editing .md docs, and return typed structured output (`DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED`). Two-stage review: spec-compliance then code-quality.

> "Scope boundary: you may CREATE/EDIT files ONLY inside your assigned scope"
> `[SOURCE: file:.opencode/specs/skilled-agent-orchestration/144-operate-like-fable-5/external/fable-mode-main/fable-mode-profile.md:353-358]`

The framework has agents and skills but no explicit agent-output schema or two-stage review contract. This maps to `orchestrate.md` / agent definitions.

---

## Dedup vs round 1 / Fable5.md

| Finding | Covered by round 1 or Fable5? | Note |
|---------|------------------------------|------|
| Verify before claim, claim legibility, baseline+delta, finding-as-hypothesis, scope, rollback, match effort | YES — round 1 | Do not re-recommend. |
| Mutation-check ritual | NO | Net-new mechanism. |
| Verification ladder | NO | Net-new mechanism. |
| Adversarial review fleet + evidence schema | NO | Net-new mechanism. |
| Scar-tissue curation | NO | Net-new ritual/mechanism. |
| Cold-successor handoff protocol | NO | Net-new ritual. |
| Rotted-list → self-auditing test | NO | Net-new mechanism. |
| Reuse maps | NO | Net-new mechanism. |
| Single-event blast-radius lists | NO | Net-new mechanism. |
| Two-register voice | NO | Net-new doctrine/model-specific. |
| Fable lexicon | NO | Net-new doctrine. |
| Multi-agent orchestration house rules | PARTIAL | Round 1 has agents/skills; not the typed output schema or two-stage review. |

---

## Dead Ends / Ruled Out

- **fable-mode-main/README.md** is install instructions only; no additional doctrine. `[SOURCE: file:.opencode/specs/skilled-agent-orchestration/144-operate-like-fable-5/external/fable-mode-main/README.md]`
- The `fable-mode.md` command file explicitly says the deeper profile is optional and the command is self-contained; no hidden mechanisms beyond the profile.

---

## Assessment

- **Status:** complete
- **newInfoRatio:** 0.88
- **Novelty justification:** First pass over fable-mode-main yields 11 net-new mechanisms/rituals/doctrine items not shipped in round 1; high ratio because the profile is dense and round 1 intentionally limited itself to the distilled Fable5.md doctrine.
- **Focus track:** mechanisms
- **Key questions touched:** Q1 ( extraction ), Q3 ( initial tiering signal: most items are Tier B mechanisms, with a few Tier A doctrine/lexicon and voice as model-specific).
