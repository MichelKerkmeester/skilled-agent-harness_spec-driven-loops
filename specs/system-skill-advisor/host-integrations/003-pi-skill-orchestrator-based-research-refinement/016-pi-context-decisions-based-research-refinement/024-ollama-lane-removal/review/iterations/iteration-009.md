# Iteration 009: Correctness (third pass), the M7 dotenv path

## Dispatcher
- Iteration 9 of 10, mode review, dimension correctness (third pass).
- Focus carried from iteration 8: the cleanup tool's `.env` rewrite path for `LANE_ENV_KEYS`, plus whether removing `MEMORY_DB_PATH` from an operator `.env` can hurt a tool outside the lane.
- Iteration number derived from the state log: 8 `type:"iteration"` records, so this is 9. It matches the dispatch.

## Files Reviewed
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:195-202` (dotenv CLI and file list)
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:286-303` (`LANE_ENV_KEYS`, prefixes)
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1464-1507` (`isLaneEnvKey`, `checkDotenv`)
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:997-1000` (`statusOf`)
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1970-1984` (`reportUserLeftovers`)
- `.skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs:889-925` (`parseDotenv`), `:970-974` (`listKeys`)
- `.skilled/skills/system-spec-kit/runtime/cli/tests/sweep-lane-residue.vitest.ts:733-740` (the one M7 test)
- Live-code search for every `LANE_ENV_KEYS` name and prefix outside `specs/`, `node_modules` and `dist`.

## Findings - New

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **M7 drops lane keys on lines the dotenv parser rejects and still reports the check absent** -- .skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1497 -- `listKeys` returns `valid: false` when any line fails to parse, and it lists only keys from lines that did parse (`env-secret-guard.cjs:970-974`, `:896-899`). `checkDotenv` reads `result.keys` and never looks at `result.valid` (`sweep-lane-residue.mjs:1491-1504`), so a lane key on a rejected line produces no item. `statusOf` (`:997-1000`) then returns ABSENT, not NOT_CHECKED. A probe of the exported `parseDotenv` on in-memory text showed `OLLAMA_BASE_URL="http://localhost:11434` (unclosed quote) and `EMBEDDINGS_PROVIDER: ollama` (colon form) both land in `invalidLines` [1,2] and neither key is listed. Machine mode and apply then call the dotenv files clean.
   - Finding class: false-negative status in a residue check
   - Scope proof: `checkDotenv` is new in this packet (phase 001); the parser it calls is out-of-packet and behaves as documented
   - Affected surface hints: `checkDotenv` in `sweep-lane-residue.mjs`; the M7 case in `sweep-lane-residue.vitest.ts:733`; the catalog page's M7 sentence
   - Case: a `.env` holding only `EMBEDDINGS_PROVIDER: ollama`, a form the popular `dotenv` package also loads, makes M7 report absent with no note
   - Fix direction: when `result.valid === false`, set `incomplete` and add a note naming the file, so the status becomes NOT_CHECKED instead of ABSENT. Values stay unread.
   - Severity rationale: P2. The lane code that read these keys is gone, so a missed key changes nothing at runtime. The harm is a residue report that says clean when it is not.

## Traceability Checks
- `spec_code`: pass for the dotenv path. `001/spec.md:95` promises machine mode reports "lane keys in dotenv files", and `checkDotenv` does, apart from the parse-reject gap filed above. Apply only reports M7 items and never edits a dotenv file (`sweep-lane-residue.mjs:1981-1983`), which matches the catalog's "values are never read" wording.
- `feature_catalog_code`: partial. `lane-residue-gate-and-cleanup.md:31` says machine mode reports "lane keys in dotenv files", and nothing qualifies that for lines the parser rejects. This is covered by the finding above, not filed separately.

## Integration Evidence
- `.skilled/hooks/env-secret-guard/cli/env-secret.cjs:32` → `lib/env-secret-guard.cjs:listKeys`. This is the value-free reader M7 spawns.
- The PreToolUse env-secret-guard hook refused a shell write of a temp `.env`. The probe called the exported `parseDotenv` on a string instead, and no dotenv file was created or read.

## Edge Cases
- Ambiguity in the carried focus: it named a "`.env` rewrite path". No such path exists. Apply turns M7 items into `reported` actions only (`:1981-1983`), so comment and quoting preservation cannot break. That direction is ruled out, not partially covered.
- Duplicate keys: `parseDotenv` lists each occurrence (probe: `HF_EMBED_SERVER_URL` twice, once with `export`), so M7 shows one item per occurrence. That is harmless and arguably right, since the operator has to remove each line.
- A `.env` that is a symlink resolving outside the checkout is refused by `resolveInspectable` (`env-secret-guard.cjs:933-946`). `checkDotenv` turns that refusal into `incomplete` (`:1497-1501`), so the status is NOT_CHECKED rather than a false pass. That case is handled correctly.

## Confirmed-Clean Surfaces
- `MEMORY_DB_PATH`: no live (non-test) reader remains. The only hits are test helpers that set it or guard against it (`vitest-setup.ts:42`, `spawn-cjs.ts:157`, `auto-detection-fixes.vitest.ts:29`, `test-integration.vitest.ts:82`, `config.test.ts:24`). Removing it from an operator `.env` hurts no tool outside the lane, and the tool asks the user to remove it by hand rather than doing it.
- Every other `LANE_ENV_KEYS` name and every prefix (`HF_EMBED_`, `HF_EMBEDDINGS_`, `SPECKIT_CASCADE_`, `SPECKIT_HF_`) has zero live-code readers outside the residue tool. Generic provider credentials are excluded on purpose (`:286-289`).

## Ruled Out
- A dotenv rewrite that corrupts comments, quoting or repeated keys: there is no rewrite (`sweep-lane-residue.mjs:1981-1983`).
- Removing `MEMORY_DB_PATH` breaking another tool: no live reader remains (search above).
- Value exposure through M7: only key names cross the CLI boundary (`listKeys` returns `entries.map(({ key }) => key)`).

## Next Focus
- Dimension: security (third pass), the last iteration.
- Focus area: apply's recursive `directory` deletes of compiled lane output (`sweep-lane-residue.mjs` near `:214-220`) and the HuggingFace cache folder delete. Check that containment holds for every recursive `rmSync` and that a build-tree symlink cannot widen a recursive delete.
- Reason: earlier passes covered single-file deletes and symlinked targets. The two recursive folder deletes are the widest destructive surface left without a line-by-line trace.
- Rotation status: correctness 3, security 2, traceability 2, maintainability 2.
- Carry-forward: R1-P2-001, R1-P2-002, R2-P2-001, R3-P2-001, R3-P2-002, R3-P2-003, R4-P2-001, R7-P2-001, R9-P2-001.
- Required evidence: file:line references into each recursive `rmSync` call and its containment guard.

Review verdict: PASS
