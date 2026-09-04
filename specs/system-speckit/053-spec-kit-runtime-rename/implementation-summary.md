---
title: "Implementation Summary: spec-kit runtime rename"
description: "The spec-kit engine moved to system-spec-kit/runtime, dropped eight dependencies no consumer reaches, and took 703 references with it in one change."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-spec-kit-runtime-rename"
    last_updated_at: "2026-09-04T19:16:06Z"
    last_updated_by: "code-agent"
    recent_action: "Moved the engine to runtime/, pruned the manifest and rewrote every reference"
    next_safe_action: "Commit the move as one commit, then run the ten-iteration review"
    blockers:
      - "Packet 052 validates with a stale source fingerprint from commit b960584085, which this packet did not touch"
    key_files:
      - ".opencode/skills/system-spec-kit/runtime/package.json"
      - ".opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs"
      - ".opencode/bin/hf-model-server.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-053-spec-kit-runtime-rename"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 053-spec-kit-runtime-rename |
| **Completed** | 2026-09-04 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The spec-kit engine no longer claims to be a server. It lives at
`.opencode/skills/system-spec-kit/runtime/`, is published to its workspace as
`@spec-kit/runtime`, and declares four dependencies instead of twelve. The name a
reader meets now matches what the package does: validate spec folders, refresh
generated metadata, write continuity, and host the per-runtime hook adapters.

### The move

`git mv` carried 324 tracked files across, so history follows each one. The layout
was already the shape the packet asked for — `lib/`, `scripts/`, `hooks/`, `tests/`,
its own `package.json`, `tsconfig`, vitest config and README — so nothing was
restructured inside; only the folder and the npm name changed. That matters for
review: the diff is a rename plus path text, and a behaviour change would have had
nowhere to hide in it.

Every reference moved in the same change. 379 files were rewritten in place and 84
symlinks repointed, covering the five runtime hook registrations, the `.claude`,
`.codex`, `.cursor`, `.devin` and `.pi` discovery mirrors, the dist-freshness package
table, `validate.sh`, the scripts package's imports and tsconfig paths, the workspace
manifest, doctor assets, plugins, install guides and the skill's own references.

### Dependencies decided by resolution, not by grep

Eight of twelve entries went. The two interesting rows are the ones an import grep
would have got wrong in both directions. `@huggingface/transformers` looks live
because the HF model server imports it, but that server resolves through
`createRequire(system-spec-kit/package.json)` and lands in the skill-root
`node_modules`, which the workspace root and `@spec-kit/shared` both populate — so
this manifest was never what placed it, and it goes. `chokidar` looks dead because
nothing in the package imports it, but the skill advisor probes
`…/system-spec-kit/runtime/node_modules/chokidar/index.js` as its second resolution
candidate, so it stays and the advisor's path was updated with the rest.

| Dependency | Live consumer | Decision |
|------------|---------------|----------|
| `@spec-kit/shared` | 8 source and 19 test modules | keep |
| `better-sqlite3` | `lib/extraction/entity-extractor.ts:10`, `lib/storage/transaction-manager.ts:6` | keep |
| `zod` | four modules including `lib/graph/graph-metadata-schema.ts:5` | keep |
| `chokidar` | `system-skill-advisor/mcp-server/advisor-server.ts:101` resolution candidate | keep |
| `@huggingface/transformers` | resolves from the skill root, not from here | remove |
| `@modelcontextprotocol/sdk` | none; `@spec-kit/shared` declares its own | remove |
| `zod-to-json-schema` | none | remove |
| `sqlite-vec` | none; `@spec-kit/scripts` declares its own | remove |
| `sqlite-vec-darwin-arm64` | follows `sqlite-vec` | remove |
| `tree-sitter-wasms` | none | remove |
| `web-tree-sitter` | none | remove |
| `ignore` | none | remove |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp-server/**` -> `runtime/**` | Moved | 324 tracked files, history preserved |
| `runtime/package.json` | Modified | Renamed `@spec-kit/runtime`; twelve dependencies cut to four |
| `system-spec-kit/package.json`, `package-lock.json` | Modified | Workspace member renamed; lockfile regenerated, 126 packages removed |
| `scripts/package.json`, `scripts/tsconfig.json`, `tsconfig.json`, `vitest.config.ts` | Modified | Project references, path mappings and the vitest root |
| `scripts/lib/dist-freshness.cjs` | Modified | Package id, name, root and rebuild command; dropped a watched path that never existed |
| `scripts/mcp-server` -> `scripts/runtime` | Moved | The link that lets compiled `scripts/dist` reach the engine's `dist` |
| `.claude`, `.codex`, `.cursor`, `.devin`, `.pi` hook registrations and mirrors | Modified | 84 symlinks and five runtime configs |
| `.opencode/bin/hf-model-server.cjs` | Modified | Its database directory is built from string segments, so no path grep reached it |
| `system-skill-advisor/mcp-server/advisor-server.ts` | Modified | One resolution candidate, so its chokidar fallback still lands |
| 370 further docs, assets, plugins and tests | Modified | Path and name text |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Inventory first, and it paid for itself twice. `git grep` replaced ripgrep as the
authority after ripgrep turned out to skip four tracked manifests that a root
`.gitignore` rule names — including the workspace root manifest that owns the
`workspaces` array. Then a second sweep looked for references no path grep reaches
at all: string-segment path joins, symlink targets, and directory-name literals in
boundary rules. Both classes existed, and both would have shipped broken.

The rewrite ran in two guarded passes rather than one. The unambiguous spellings
went first. The relative and bare references went second, skipping any line that also
names another MCP surface, because the package's own `ENV-REFERENCE.md` documents the
skill advisor's variables with `mcp-server/...` paths that are relative to the
advisor, not to this package. Those 40 lines were then read one at a time; three were
genuine and were fixed by hand, the rest were left alone.

Verification ran from the repository root against the new paths only.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Regenerate the lockfile from the workspace root, not from the package | The package is a member of the `system-spec-kit` workspace and has no lockfile of its own, so `npm ci` inside it refuses with `EUSAGE`. The root is where the lockfile lives and where the prune takes effect. |
| Keep `chokidar` although nothing here imports it | The advisor names this package's copy as a resolution candidate that exists today. The packet's own rule is that removal needs a resolution trace, and this one has a consumer. |
| Drop `@huggingface/transformers` although the model server loads it | The resolution trace lands in the skill-root `node_modules`, which two other manifests populate. Verified after the prune: the server still resolves it. |
| Drop `configs` from the dist-freshness watch list | The build could not complete without it. The directory has never existed in this repository's history, so the entry was stale before the move and sat directly on the rebuild path this packet has to prove. |
| Leave packet 052's stale fingerprint alone | It was staled by commit `b960584085`, which edited a 052 doc without regenerating derived metadata. The fix belongs to that commit's owner, not inside a rename. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate.sh specs/.../053-spec-kit-runtime-rename --strict` | PASS - exit 0, Errors 0, `RESULT: PASSED` |
| `validate.sh specs/.../049-memory-decommission --strict --recursive` | PASS - exit 0, Errors 0 across the tree |
| `validate.sh specs/.../052-memory-decommission-landing --strict` | FAIL - exit 2, one stale source fingerprint, pre-existing and outside this packet |
| `cd runtime && npm run rebuild` | PASS - exit 0, both freshness entries recorded |
| `npm install` at the workspace root | PASS - 126 packages removed, 2 added |
| `npm ci --dry-run` at the workspace root | PASS - exit 0, lockfile matches the pruned manifests |
| `tsc` typecheck: shared, scripts, runtime | PASS - exit 0 each |
| `generate-context.js --help` from `scripts/dist` | PASS - exit 0 |
| 19 registered hook adapters, one empty payload each | PASS - every exit 0, zero missing-module errors |
| `sweep-memory-residue.mjs --json` | PASS - `counts.live` 0 |
| doctor route-validate, command references, skill-root audit, derived freshness | PASS - exit 0 each |
| `compiled-route-guard.cjs` | PASS - exit 0 after re-minting `cli-external-orchestration` |
| scripts lanes: trigger-index, parity-check, workflow-invariance, daemon-detect, retrofit-convention-pipeline | PASS - 111 tests, exit 0 each |
| `cd runtime && npm test` | INCONCLUSIVE - the runner terminated itself at its own 600000ms bound; no failure appeared before it did |
| `cd runtime && npx vitest run tests` | INCONCLUSIVE - stopped past the 20-minute cap at 98 files, 669 passing and 24 failing; every failure attributed below |
| HF model server boot from the new path | PASS - `defaultDbDir()` resolves to `runtime/database`, the socket listens, `importTransformers()` returns, and it closes cleanly |
| `rg` and `git grep` for the old path and npm name over live surfaces | PASS - 0 hits each; no symlink targets the old path |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Packet 052 does not validate.** Its `graph-metadata.json` attests documents
   older than `goal.md`, because commit `b960584085` edited that document without
   regenerating derived metadata. Nothing in this packet touches 052, and 052 is
   byte-identical to `HEAD`. Fix with
   `node .opencode/skills/system-spec-kit/scripts/spec/repair-derived.cjs --folder specs/system-speckit/052-memory-decommission-landing --apply`.

2. **`chokidar` is declared by a package that never imports it.** It is kept only so
   the advisor's second resolution candidate still resolves. The advisor's own copy
   is installed, so the fallback is not exercised today; dropping it is a judgement
   the operator can make, not one this packet's evidence licenses.

3. **The package's own suite does not finish inside its bound on this machine.** The
   bounded runner stops itself at 600 s and the scoped fallback ran past 20 minutes,
   so neither produced a total. The 24 failures both runs surfaced are attributed:
   18 reproduce test-for-test against a `git archive HEAD` tree of this skill under
   the old layout, and the other 6 - two deep-loop contract files and
   `continuity-freshness` - pass in isolation on the moved tree, so they are
   interference inside a 98-file pool rather than defects. No failure is new.

4. **Running the suite dirties a tracked database.** The council tests write to
   `system-deep-loop/runtime/database/council-graph.sqlite`, which now differs from
   `HEAD` at the same byte length. It is a test byproduct, not an edit this packet
   intends; restore it before committing.

5. **The ten-iteration review has not run.** AC-010 stays open, and this
   implementation is its input.

6. **The model server boots but cannot instantiate a model on this machine.**
   `transformers.node.cjs` fails its own internal `require('onnxruntime-common')`.
   The prune did not cause it: the whole `@huggingface/transformers` subtree still
   carries its 2026-08-21 mtime, so `npm install` never rewrote it, and its
   `onnxruntime` placements are byte-identical between the saved baseline lockfile
   and the regenerated one. `onnxruntime-node` still resolves and loads. The likely
   cause is the `allowScripts` policy this machine applies to that package's
   postinstall, which is outside this packet.

7. **Two stale references were found and left.** `scripts/tests/workflow-invariance.vitest.ts:150`
   allowlists a playbook file under a `pipeline-architecture/` directory that does not
   exist, and two `sk-doc` code-folder fixtures name
   `system-spec-kit/shared/mcp-server/database`, a path that has never existed. Both
   predate this packet and neither is a rename target.
<!-- /ANCHOR:limitations -->

---


