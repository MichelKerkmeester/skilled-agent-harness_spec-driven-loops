# Build evidence for the code half, 2026-11-14

Implemented REQ-001 and REQ-002 in the four permitted files.

## Changes

**`retrieval/rg-wrapper.mjs`**
- `search()` — in the `path` branch, added `archivedPaths = paths.filter(isArchivedPath)` beside the unchanged `paths` array, so JSON readers can identify the archived subset without re-reading strings.
- Updated the return JSDoc with the optional field.

**`spec/suggest-subtracks.mjs`**
- Added `MAP_PACKET_NAME` — mirrors the relocator’s `NNN-slug` source/destination rule.
- Added `readExistingFolders()` — lists every existing folder in the track, declared or not.
- `nameGroups()` — seeds its `used` set from those existing folder names, so a generated group name never reuses an undeclared folder.
- `proposeRetroactive()` — checks packet names before mapping; names each invalid packet and says it must be renamed first, prints no map, and returns 0.

## Tests added

`tests/rg-include-archive.vitest.ts`
- `lists archived path hits in archivedPaths and keeps paths as strings`
- `reports archivedPaths as empty when every listed path is live`

`tests/suggest-subtracks.vitest.ts`
- `prints a map the relocate preflight accepts when the track already holds the proposed name`
- `names a packet that cannot be renamed to NNN-slug and prints no map`

## Failing runs before the fix

Archive case:

```text
AssertionError: expected undefined to deeply equal [ Array(1) ]
+ Received:
undefined
Tests  1 failed | 7 passed (8)
```

Proposal cases:

```text
relocate: refused: to specs/demo/render-window/001-alpha-one: specs/demo/render-window exists but is not a declared sub-track
expected 2 to be 1

AssertionError: expected '[\n  {\n    "from": "demo/001-alpha-o…' to match /003_under[^\n]*must be renamed first/
Tests  2 failed | 6 passed (8)
```

## Final verification

```text
Test Files  3 passed (3)
     Tests  43 passed (43)
exit=0
```

REQ-001 proof from the repository root:

```text
2 2
exit=0
```

The text path output still prints the same path list with `[archived]` markers and no added field.

## Open question

`nameGroups()` now avoids every existing folder, but the remainder group is still assigned the fixed name `general` before that function runs. An undeclared folder literally named `general` would therefore still be reused; the two named acceptance cases do not cover that edge.

## Orchestrator reruns

- three suites: baseline 39 passed, after 43 passed. COUNT printed 2 2 (2 0 before). Full CLI npm test: 2599 passed, 0 failed, npm exit 0. Comment check clean.
