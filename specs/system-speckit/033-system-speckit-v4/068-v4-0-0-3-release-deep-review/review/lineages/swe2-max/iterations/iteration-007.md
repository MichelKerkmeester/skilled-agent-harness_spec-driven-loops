# Iteration 007 — maintainability: repo-rules corpus + AGENTS.md + README.md

## Scope and method

Iteration 6 verified the *machinery* (mirrors, guards, counts). This pass reviews
the *content edits* in the release for structural integrity — cross-reference
survival, section-number consistency, and whether the tightening pass broke its
own citation web:

- `.skilled/repo-rules/` — all 13 files changed (net −120 lines, a tightening
  pass). Verified the corpus's internal reference graph survived:
  - `communication-handoff.md:64` cites `evidence-and-proof.md §10` for the
    status requirement → §10 is `CLOSE-OUT` ✓
  - `answer-the-actual-request.md:101` cites `evidence-and-proof.md §10` ✓;
    `:54` cites `communication.md §3` for cutting filler → §2/§3 are
    LENGTH/cut rules ✓
  - Heading counts: every cited section exists (evidence-and-proof 14,
    communication 14, handoff 10, decisions 9, prose 8).
  - `check-repo-rules.cjs` 11/11 PASS (recorded in iteration 6) covers the
    machine-checkable half: fires-when bullets all have router-row coverage
    (new check 10, threshold 0.3 over stemmed content words, 61 bullets).
- `AGENTS.md` — the a7380ece83d reorder moved §4 (Verification) physically
  ahead of §3 (Execution & Quality) while keeping section numbers, so every
  `AGENTS.md §N` citation still resolves by number. Spot-verified:
  - `blast-radius.md:64` → §3 "install still waits for a yes" — §3's
    Blast-Radius bullet names exactly that wait ✓
  - `communication-decisions.md:102` → §2 consolidated-question protocol ✓;
    `:103` → §7 escalation ✓
  - `communication-handoff.md:64` → §10 quick-reference status mandate
    ("Close substantive turns with honest status") ✓
  - `communication-handoff.md:123` → §3 refusal of "should I continue?" —
    §3 line ~188 "Do not ask permission to continue an already-approved,
    in-scope step" ✓
  - Byte-level check of the Devin cut: the Blast-Radius mandatory bullet
    ("Name the rollback, stop for yes") sits at 15,792-16,359 — inside the
    16,384 window. What crosses the cut is §3's Execution-Behavior tail
    (soft guidance), not a hard rule — the changelog claim holds.
- `README.md` — content claims verified in iteration 6 (counts, plugin
  inventory, gate description, cli-classifier rename). Maintainability view:
  the doc was rewritten in the same release as the surfaces it describes —
  counts 15→14 skills / 36→39 commands / 40→42 rules track the diff exactly.
- `REPO RULES.md` — enrichment-only diff; no structural change.

## Observations below finding bar

- New stemming heuristic in `check-repo-rules.cjs` (`wordsMeet` prefix-match,
  min-4) can in principle award coverage to an unrelated row sharing a stem —
  a false-PASS risk. Mitigated by design: threshold is a floor (0.3), own-row
  coverage median is 0.75 per the code's corpus measurement note, and the
  check is additive over nine pre-existing exact checks. Heuristic quality
  concern, not a defect.
- AGENTS.md physical order is now 1,2,4,3,5…10 — correct-by-construction for
  numbered references, mildly confusing for sequential human readers. The
  commit message documents the choice; noted as a deliberate trade-off.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Review verdict: PASS
