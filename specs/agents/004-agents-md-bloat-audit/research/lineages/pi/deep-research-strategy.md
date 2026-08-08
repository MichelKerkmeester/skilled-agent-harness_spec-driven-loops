# Deep Research Strategy

## Research Topic

Audit the root `AGENTS.md` (555 lines, 47,110 bytes) for removable or reducible bloat: redundancy across sections, over-long prose that could compress, content already authoritative in referenced files, verbose tables/examples, and low-value boilerplate. Read-only (no edits during the loop); produce a ranked findings report of concrete removable/reducible candidates with rationale and rough line savings.

## Known Context

- Target: `AGENTS.md` — 555 lines, 47,110 bytes, 10 sections (§1 108, §2 104, §3 44, §4 66, §5 68, §6 28, §7 23, §8 33, §9 39, §10 28).
- All 7 root `constitutional/` pointers dangling; authoritative copies at `.opencode/skills/system-spec-kit/constitutional/` (F1-1).
- Anchors corrected through iter 4: ask-first L165–167 + VIOLATION L214–216; Memory Save L179–191; Final-State L193–200; Completion L202–212; validate.sh L204 + L499–501.
- Savings ledger semantics: physical lines only (whole-line removals/merges); F3-* compression is byte-only.
- Deduped estimate (F4-8): ~70–90 physical lines (13–16%), + ~30–40 byte-only lines.
- Lineage artifact root: `specs/agents/004-agents-md-bloat-audit/research/lineages/pi` (fan-out contract; no writes outside).

## Key Questions

1. Intra-document redundancy? — **answered (iter 1)**.
2. Authoritative-source substitution? — **answered (iter 2, verified iter 3)**.
3. Prose compression headroom? — **answered (iter 3)**.
4. Low-value tables/examples/boilerplate? — **answered (iter 4)**.
5. Final ranked list + preserve set? — in progress (iter 5).

## Answered Questions

- Q1..Q4 all answered (see registry F1*..F4*).

## What Worked

- Line-anchored evidence throughout; passage-level verification before claims; physical-line ledger discipline.

## What Failed

- Iter-1/2 anchor errors (fixed iter 3/4). Bash mutations hook-denied; legacy `findings-registry.json` remains — sweep item.

## Exhausted Approaches

- None.

## Ruled-Out Directions

- Gate 3 full pointer replacement (iter 2).
- F2-6 as duplication → staleness (iter 3).
- F3-* compression as line savings → byte-only (iter 4).
- Emoji removal from ranked list (iter 4).

## Next Focus

Iteration 5: Final ranking + preserve set — dedupe by line range, rank by physical savings ÷ risk, define preserve list, sanity-check against baseline.

## Non-Goals

- No edits to AGENTS.md or any file outside the lineage artifact directory.
- No removal of normative constraints unless identical text exists verbatim elsewhere.
- No style-polish recommendations unless they remove lines.

## Stop Conditions

- maxIterations (5) reached → synthesize.
- Convergence before max iterations is telemetry only; angles broaden instead.
