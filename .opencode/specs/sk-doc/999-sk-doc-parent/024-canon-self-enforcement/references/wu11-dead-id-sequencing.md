# WU11 PREP — Dead-id retirement & 193-row re-baseline sequencing

> Gate-free PREP for the GATE-ADJACENT WU11. This document makes the post-gate batch
> mechanical: it maps every dead-id site to its live replacement, names the corpus
> coupling, and states why the retirement + corpus rewrite + parity recompute must land
> as **one** re-baseline event. **No edits are made by this doc** — WU11 executes only
> after the operator opens the advisor scorer lane.

## The dead ids and their live replacements

| Dead id (in scorer surfaces) | Live command (exists on disk) |
|------------------------------|-------------------------------|
| `/deep:start-research-loop` | `/deep:research` |
| `/deep:start-review-loop` | `/deep:review` |
| `/deep:start-model-benchmark-loop` | `/deep:model-benchmark` |

## Sites (≈30 references across four scorer files)

- `lib/scorer/projection.ts` — `command-spec-kit` keywords/intentSignals + the `deep-model-benchmark` inline bridge description/keywords/intentSignals.
- `lib/scorer/lanes/explicit.ts` — weighted NL lanes keyed on the dead ids.
- `lib/scorer/aliases.ts` — **generated block** (`--emit`); do NOT hand-edit. It is produced from the registry `legacyAliases`. Editing the emitted lines is reverted by the next `--emit` and breaks the hash triple (`aliases.ts` header hash == `skill_advisor.py` == the drift guard).
- `scripts/skill_advisor.py` — the Python mirror (command records, slash markers, alias sets).

**Emit source (edit here, then re-emit):** `deep-loop-workflows/mode-registry.json`
`legacyAliases` at `:50` (`/deep:start-research-loop`) and `:74` (`/deep:start-review-loop`).
The model-benchmark dead id is scorer-hand-coded (no registry legacyAlias), so it is a
direct projection.ts/explicit.ts/skill_advisor.py edit.

## The bigger defect (do not miss it in the batch)

The **live** ids `/deep:research`, `/deep:review`, `/deep:model-benchmark` appear in
**zero** routing surfaces today (verified). Retiring the dead ids is not enough — the live
ids must be ADDED as the slash markers / command-bridge keys, or a user typing the real
command routes only by NL-phrase luck. Keep the dead ids as compat aliases only if the
registry keeps them in `legacyAliases`; otherwise remove both the id and its lane.

## Corpus coupling — why this is ONE event

- Corpus: `scripts/routing-accuracy/labeled-prompts.jsonl` = **193 rows**; ≈8 rows invoke
  the dead ids directly.
- Ratchets pinning 193: `scripts/routing-accuracy/scorer-eval-baseline.json` (`total:193`),
  `tests/legacy/advisor-corpus-parity.vitest.ts`, `tests/scorer/semantic-shadow-ablation.vitest.ts`,
  `tests/parity/python-ts-parity.vitest.ts`.
- Because the corpus rows and the dead vocabulary are mutually load-bearing, a piecemeal
  removal reds parity repeatedly. Retire the ids + rewrite the corpus rows + recompute the
  193-row baseline as a single committed event, co-landing with the 023 WU5 command-bridge
  unit (gated on the same lane).

## Also fold into the same event (inert / vote-splitting, from the council)

- `command-create-manual-testing-playbook` is boosted in `explicit.ts` but absent from
  `COMMAND_BRIDGES` → provably inert (`fusion.ts`). Remove the dead boost.
- Duplicate `memory:save` / `command-memory-save` bridges vote-split in `projection.ts`.

## Acceptance (post-gate)

1. Every command id referenced in scorer surfaces resolves to a live `.opencode/commands/**`
   file (WU4's command-binding gate goes green with the allowlist emptied of these ids).
2. The live ids are present in routing surfaces.
3. Advisor drift-guard + all parity vitests green; the 193-row baseline recomputed once.
4. The batch is a single commit; this PREP doc is its checklist.
