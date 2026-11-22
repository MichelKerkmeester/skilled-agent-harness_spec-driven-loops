# Iteration 004: Maintainability

## Dispatcher

- Dimension: maintainability (first pass; the last uncovered dimension)
- Iteration 4 of 10, derived from 3 prior `type:"iteration"` records in the state log; matches the dispatch.
- Focus: `sweep-lane-residue.mjs` structure, allowlist reason quality, test fixture realism, stale or packet-id comments in the edited advisor scorer files.

## Files Reviewed

- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs` (2219 lines; sections at :77, :328, :434, :480, :818, :1623, :1993, :2137; `loadAllowlist` :446-477)
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/lane-residue-allowlist.json` (47 rows)
- `.skilled/skills/system-spec-kit/runtime/cli/tests/sweep-lane-residue.vitest.ts` (:84, :175, :320, :340-350)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts` (:8-28, diff against `main`)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/types.ts` (:165-180)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/weights-config.ts` (:7-25)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **32 of 47 allowlist reasons cite line numbers that the check never verifies, so the reasons drift without failing anything** -- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:446` -- `loadAllowlist` only checks that `reason` is a non-empty string (`:464-466`). Rows such as `.skilled/skills/cli-external-orchestration/cli-codex/references/cli-reference.md` ("lines 105, 173, 549") and `.skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md` ("Line 99") pin the justification to line numbers. A probe at the tip resolved every cited line and found the lane term there (32/32 hold today), but because rows exempt the whole file, nothing re-checks the numbers after an edit. The reason becomes the only record of why a file is exempt, and it rots silently.
   Finding class: documentation drift in an audit artifact
   Scope proof: allowlist rows carrying `line N` / `lines N, M` in `reason`; `loadAllowlist` validation at `sweep-lane-residue.mjs:446-477`
   Affected surface hints: `fixtures/lane-residue-allowlist.json` reasons; `loadAllowlist`; optionally a test that asserts each cited line still matches the vocabulary
   Case: an editor adds ten lines near the top of the cli-codex `cli-reference.md`; repo mode still exits 0 and the row's reason now points at three unrelated lines, so the next auditor checking the exemption reads the wrong text.

## Traceability Checks

- `spec_code`: pass. The exact-path allowlist contract (no folder rows, no glob rows, no duplicates, reason required) is enforced in code at `sweep-lane-residue.mjs:461-475`, matching the header rationale at `sweep-lane-residue.mjs:34`.

## Integration Evidence

- Advisor scorer: `lane-registry.ts:8-13` now lists four live lanes; the `main` diff removes only the `semantic_shadow` row (`defaultWeight: 0`), so the live weight vector is unchanged in value (sum 0.95 before and after).

## Edge Cases

- `types.ts:172-175` says the registry `live` flag stops an override from making a "shadow-only lane" contribute, yet every row in `LANE_DEFINITIONS` is `live: true`. The same sentence exists on `main` (`types.ts:193` there), and the removed row was also `live: true`, so this is pre-existing and not introduced by the removal. Recorded, not raised.
- Socket fixture realism was only partially checked: the test builds a short temp folder "for a socket path that must fit sun_path" (`sweep-lane-residue.vitest.ts:175`), which suggests a real socket is bound somewhere; I did not trace which case binds it within budget.

## Confirmed-Clean Surfaces

- Packet-id hygiene in the residue tool: the `M1`-`M8` tokens (`sweep-lane-residue.mjs:15`, `:1036`, `:1511`) are the tool's own emitted check ids (`finding('M1', ...)` at `:1076`), a durable output contract, not ephemeral packet labels. No ADR/REQ/CHK/task ids or spec paths appear in comments; the `specs/` mentions describe the excluded pathspec (`:47-48`).
- Module structure: 2219 lines but split into eight numbered sections (constants, helpers, allowlist, repo, machine, apply, output, CLI) with a design-rationale header (`:29-45`); the longest function is `cleanOwnedLeftovers` at about 96 lines (`:1881`). Size alone is not a defect.
- Weights: `weights-config.ts:14-25` derives every exported weight from the registry, so there is no second hand-maintained weight table to go stale.

## Ruled Out

- Ephemeral ids in code comments of the residue tool: ruled out (M-ids are output ids).
- Monolithic module as a maintainability defect: ruled out (sectioned, bounded function sizes).
- Stale weight constants after the lane removal: ruled out (single source in `lane-registry.ts`).

## Next Focus

- Dimension: correctness (second pass) or cross-reference
- Focus area: run the `skill_agent` and `agent_cross_runtime` overlays (still never run), and finish the socket-fixture trace in `sweep-lane-residue.vitest.ts` near :175
- Reason: all four dimensions now have a first pass; two overlay protocols are uncovered
- Rotation status: correctness, security, traceability, maintainability done (first pass)
- Carry-forward: R1-P2-001, R1-P2-002, R2-P2-001, R3-P2-001, R3-P2-002, R3-P2-003, R4-P2-001
- Required evidence: file:line for each overlay result

Review verdict: PASS
