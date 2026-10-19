# Deep-Research Iteration 001 — sk-vision OpenCode 2 runtime bugs after the 2026-10-19 merge

## Focus

A23: which runtime paths in `.skilled/skills/sk-vision/vision-runtime/src/` can still misbehave on OpenCode 2 after phases 012 and 013 of packet 082 — tool registration in `plugin.ts` `setup` (`ctx.tool.transform`, the `SK_VISION_AUTOINSPECT` switch, ordering after the prompt hook, fail-open behaviour), `opencode/tools.ts` `toV2Tools`, the 2-second grace path for models off the text-only list, `runtime/client.ts` `close()`, the 5-second interpreter checks and the venv `mkdir` race phase 013 left open. Output: a ranked bug list with file:line evidence, each labelled confirmed / documented / inferred, plus the fix each needs. Read-only; `bun test` as the check.

## Actions Taken

1. Read the target sources end to end: `src/plugin.ts` (490 lines), `src/opencode/tools.ts` (484), `src/runtime/client.ts` (510), `src/model-modality.ts` (67), `src/opencode/attachments.ts` (302), and the v2 adapter tests `src/opencode/tools.test.ts`.
2. Compared the hand-maintained `V2PluginContext` in `plugin.ts` against the published `@opencode-ai/plugin` 1.17.15 v2 promise types in `node_modules/@opencode-ai/plugin/dist/v2/promise/` (`context.d.ts`, `registration.d.ts`, per-domain hooks).
3. Ran `bun test` in `vision-runtime` (read-only baseline check): **67 pass, 0 fail, 155 expect() calls, exit 0** across 8 files, including the four grace tests, four `toV2Tools` tests and four `close()`-during-startup tests.
4. Cross-checked claims and known gaps against the phase 013 implementation summary (decisions 1–7, limitations 1–4) and grepped the test files for coverage of dispose-time throws and the absent-`ctx.tool` branch.
5. Synthesized the ranked findings below; all writes stayed inside this research packet.

## Findings (ranked)

### P1 — f-001 (confirmed): the returned cleanup leaks everything after a partial dispose failure

`createSetup`'s returned teardown awaits four disposals sequentially with no error isolation: `promptRegistration.dispose()` → `toolRegistration?.dispose()` → `registration.dispose()` → `auto?.dispose()` [SOURCE: .skilled/skills/sk-vision/vision-runtime/src/plugin.ts:463]. If `promptRegistration.dispose()` throws, the remaining three are skipped — the 13 registered tools, the `/vision` command registration and, worst, `auto.dispose()` (the `RuntimeClient` and its python child process) leak for the life of the host process. Phase 013 fixed exactly this failure class at *setup* time — the hook-registration `.catch` releases the command registration and the inspection client via `Promise.allSettled` [SOURCE: .skilled/skills/sk-vision/vision-runtime/src/plugin.ts:438] — but the *returned* cleanup got no such treatment. The test suite covers a throwing `ctx.tool.transform` [SOURCE: .skilled/skills/sk-vision/vision-runtime/src/plugin.test.ts:632] and a throwing command dispose during setup-time hook failure, but no test throws from a prompt-hook dispose on the returned path.
**Fix:** run the four disposals through `Promise.allSettled` (mirroring the setup-time catch) and rethrow only the first error.

### P1 — f-002 (inferred): the guaranteed-analysis contract silently downgrades to the 2-second grace

In the v2 prompt hook, the session model is read through an optional-guarded `ctx.session.get` whose failure is swallowed into `model = undefined` [SOURCE: .skilled/skills/sk-vision/vision-runtime/src/plugin.ts:417]; `isTextOnlyModel(undefined)` then returns `false` [SOURCE: .skilled/skills/sk-vision/vision-runtime/src/model-modality.ts:56], so a listed text-only model takes the grace race [SOURCE: .skilled/skills/sk-vision/vision-runtime/src/opencode/attachments.ts:96] instead of the awaited run. On a cold GPU the 2-second grace expires and the model sees only the materialized-path note [SOURCE: .skilled/skills/sk-vision/vision-runtime/src/opencode/attachments.ts:120] — no evidence at all, for exactly the model class the guarantee exists for. The swallow is deliberate fail-open, but it converts a guarantee into best-effort with no signal, not even under `SK_VISION_DEBUG=1`. A host that drops or reshapes `session.get` (see f-004) triggers this without any code change here.
**Fix:** treat an unreadable model as the safe side (`guaranteed = true` when `session.get` is missing or throws), or at minimum emit a DEBUG/warning line distinguishing "model unreadable" from "model is multimodal".

### P2 — f-003 (confirmed): the 15-second startup ping timer is never cleared or unref'd

`spawn()` races the first ping against a bare `setTimeout(resolve, 15_000)` [SOURCE: .skilled/skills/sk-vision/vision-runtime/src/runtime/client.ts:354]. When the ping wins, the losing timer keeps running with no reference held and no `unref()`, so it holds the host event loop alive for up to 15s after construction — including after a `close()` that completed long before [SOURCE: .skilled/skills/sk-vision/vision-runtime/src/runtime/client.ts:460]. The abandoned ping entry also stays in `pending` up to the 120s default timeout [SOURCE: .skilled/skills/sk-vision/vision-runtime/src/runtime/client.ts:90]. A host that disposes sk-vision early (plugin teardown, CLI exit) pays the delay.
**Fix:** hold the timer, clear it when the race settles (or on ping success), and/or `.unref()` it.

### P2 — f-004 (inferred): `V2PluginContext` is a hand-maintained contract the published v2 types do not back

The local interface codes against `session.{context,get,prompt,hook}` and an optional `ctx.tool` [SOURCE: .skilled/skills/sk-vision/vision-runtime/src/plugin.ts:109]. The published `@opencode-ai/plugin` 1.17.15 v2 `PluginContext` declares only agent/aisdk/catalog/command/integration/plugin/reference/skill domains — no `session`, no `tool` [SOURCE: .skilled/skills/sk-vision/vision-runtime/node_modules/@opencode-ai/plugin/dist/v2/promise/context.d.ts:12]. The real shape was verified only by the 2.0.32 live probe (013 decision 1), so the code is right for 2.0.32 but every member is optional-guarded and any host-side rename degrades silently: a missing `ctx.tool` skips tool registration entirely [SOURCE: .skilled/skills/sk-vision/vision-runtime/src/plugin.ts:449], and a missing `session.get` feeds f-002's downgrade. Nothing fails loudly.
**Fix:** feature-detect missing domains at setup and log under `SK_VISION_DEBUG=1`; re-verify the contract whenever the OpenCode version bumps.

### P3 — f-005 (inferred): a `command.transform` failure takes down tools and auto-inspect too

`ctx.command.transform` is awaited unguarded first in `setup` [SOURCE: .skilled/skills/sk-vision/vision-runtime/src/plugin.ts:353]; a rejection aborts the whole setup, so the prompt hook, the 13 tools and evidence injection never register. The identical failure class in tool registration is deliberately fail-open [SOURCE: .skilled/skills/sk-vision/vision-runtime/src/plugin.ts:454] (013 decision 4). On a host whose command domain is broken, sk-vision loses the features that still work.
**Fix:** wrap the command transform in the same try/catch + DEBUG log and continue with hook and tools.

### P3 — f-006 (documented): the venv `mkdir` race residue stands as phase 013 left it

A `close()` while `mkdirAsync(venv)` is in flight still creates the empty venv directory before the following `throwIfClosed` stops provisioning [SOURCE: .skilled/skills/sk-vision/vision-runtime/src/runtime/client.ts:144]. Nothing installs or starts; the residue is an empty directory. Documented as limitation 2 in the 013 summary [SOURCE: specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/013-sk-vision-v2-tools-and-loose-ends/implementation-summary.md:128] and not unit-testable.
**Fix (optional):** best-effort removal of the empty venv directory on the closed path.

### P3 — f-007 (inferred): the 5-second interpreter probes conflate "slow" with "missing"

`hasMoondream` and `hasUv` treat *any* failure of a 5s probe as "not installed" [SOURCE: .skilled/skills/sk-vision/vision-runtime/src/runtime/client.ts:213], with the same 5s bound on `hasUv` [SOURCE: .skilled/skills/sk-vision/vision-runtime/src/runtime/client.ts:227]. A cold-cache `import moondream` exceeding 5s triggers a full, unnecessary venv provisioning, and a genuinely broken interpreter's real error is discarded by the bare catch. Not v2-specific, but it sits directly under the auto-inspect path v2 relies on.
**Fix:** raise or make configurable the probe timeout; distinguish module-not-found from other failures via the probe's exit status/stderr.

## Questions Answered

- "Which sk-vision OpenCode 2 runtime paths (registration, grace, close, interpreter checks, venv race) can still misbehave, and what fix does each need?" — answered by findings f-001 through f-007 above: teardown leak (P1), guaranteed→grace downgrade (P1), ping-timer leak (P2), contract drift (P2), command fail-closed asymmetry (P3), mkdir residue (P3, documented), probe conflation (P3). The registered paths themselves (gate, ordering, fail-open tools, `toV2Tools` mapping, `close()` kill/escalate, probe aborts) verified correct against both code and the green suite.

## Questions Remaining

- No open research question blocks this run (single-iteration config). The findings convert directly into implementation-sized follow-ups, each with its stated fix.
- Carried from 013 and outside a read-only research run: no live run of the grace path (decision 6), no live rerun of the round-4 fixes (limitation 3). See obs-iter001-003.

## Next Focus

None — `maxIterations: 1`, `stopPolicy: max-iterations`; the run is complete. If the operator wants fixes, the ranked list f-001…f-007 is the ready-made backlog for an implementation packet, with f-001 and f-002 first (both P1, both with cheap, test-first fixes).

## SCOPE VIOLATIONS

1. **Misdirected delta write (executed, then corrected).** The first write of `deltas/iter-001.jsonl` used a truncated path — `specs/cli-external/082-opencode-v1-v2-dual-compat/015-post-merge-research-sk-vision/research/deltas/iter-001.jsonl` (`cli-external` instead of `cli-external-orchestration`) — landing outside the lineage directory and outside the allowed-write list. The containment rule forbids `rm`/`mv`, so the stray file stands at that path and the operator may delete it; it contains an earlier draft of the delta stream (same findings, one invalid edge reference `"target":"q-A24? none"`) and is superseded by the correct file. The corrected delta was written to the canonical path `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/015-post-merge-research-sk-vision/research/deltas/iter-001.jsonl`, which the reducer should treat as authoritative.

Otherwise all writes stayed inside the allowed lineage zone; the only command executed against the researched target was the read-only `bun test` baseline.
