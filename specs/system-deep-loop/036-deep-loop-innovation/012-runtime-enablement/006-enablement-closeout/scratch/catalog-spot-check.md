# Feature-catalog additions and spot-check

## Why the earlier deferral was wrong

The catalog item was deferred with the reason "would require describing an enabled runtime". That
reason does not survive contact with the catalog's own contract. Every entry carries the line
"Treat this as shipped behavior, not a roadmap claim." The catalog describes what the code does
today. Describing an enabled runtime is what it must NOT do, because no mode is enabled.

Once the requirement is read correctly the work is ordinary: describe the gateway, the projection,
and ledger authority as they actually behave, including the parts that are incomplete.

## What was added

| Entry | ID | File |
| ----- | -- | ---- |
| Gateway script | F055 | `script-entry-points/append-mode-event-script.md` (already existed) |
| Legacy projection | F053 | `state-safety/legacy-projection.md` |
| Ledger authority | F054 | `state-safety/ledger-authority.md` |

A separate defect was found and fixed while doing this: F055 existed on disk but was referenced
zero times in `feature-catalog.md`, so it was an orphan. The index now registers all three. Its
counts were corrected with them: state-safety 11 to 13, script-entry-points 4 to 5, and the
overview total 52 to 55.

## What the entries say that matters

Neither entry claims a finished state. The projection entry records that the refresh inside the
gateway is wired for research only, that a null contract leaves `projectionRefreshed` false while
the append still succeeds, and that a caller must read that field rather than the exit code. The
authority entry records that constructing the registry writes no record, that a mode with no
persisted record reads as `legacy_authoritative` because that is the default rather than a stored
value, and that no mode is on ledger authority.

The authority sentence was corrected once during this work. It first said "every mode's record
currently reads legacy_authoritative", which implied a persisted record exists. A probe against a
fresh root showed no record file for any of the eight modes while a read returned
`legacy_authoritative` for each, so the wording was tightened to name it as a read-time default.

## Spot-check performed

Every path named by the three entries was checked for existence, and every named symbol was
checked for a definition in `lib/`.

Paths, all 11 present:

- `lib/legacy-projections/legacy-projection-manifest.ts`
- `lib/legacy-projections/legacy-projection-engine.ts`
- `lib/legacy-projections/legacy-projection-fold.ts`
- `lib/legacy-projections/deep-research-contract.ts`
- `lib/per-mode-authority-flip/authority-registry.ts`
- `lib/mode-append-gateway/append-mode-event.ts`
- `tests/unit/legacy-projections.test.ts`
- `tests/unit/transactional-projections.vitest.ts`
- `tests/unit/per-mode-authority-flip.vitest.ts`
- `tests/unit/mode-append-gateway.vitest.ts`
- `tests/unit/deep-research-authority-composition.vitest.ts`

Symbols, all 12 resolved: `LEGACY_PROJECTION_MANIFEST`, `requireProjectableManifestEntry`,
`LegacyProjectionEngine`, `AuthorityRegistry`, `AUTHORITY_FLIP_MODE_ORDER`, `appendModeEvent`,
`AUTHORITY_DENIED`, `legacy_authoritative`, `shadowing`, `cutover_ready`,
`new_authoritative_reversible`, `rollback_pending`.

## Scope note

The index's per-category "Primary Surfaces" column was left alone. It lists an illustrative subset
for every category, not a complete file list, so adding to it was not required and would have
changed a convention this work does not own.
