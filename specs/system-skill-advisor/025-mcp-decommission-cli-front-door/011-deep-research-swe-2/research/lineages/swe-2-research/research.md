---
title: "Research synthesis — what the skill advisor's MCP-transport decommission teaches"
description: "Five-iteration lessons study (swe-2 lineage) of packet 025: latent failures exposed by promoting the CLI, the residue taxonomy a transport removal leaves, and the ordered checklist for the next migration."
trigger_phrases: []
---
# Research synthesis — what the skill advisor's MCP-transport decommission teaches

Case study: `specs/system-skill-advisor/025-mcp-decommission-cli-front-door` — five runtime server declarations deleted, the MCP SDK removed, the plugin bridge deleted, the daemon wire replaced with the advisor's own newline-delimited protocol, `mcp-server/` renamed to `runtime/`, environment handling rehomed to the launcher, ~190 documents rewritten, 26 bridge tests retired, 7 contract tests inverted. Phase 009 ran the defect hunt and closed nine findings; this lineage is the independent second reading, a lessons study.

## Q1 — Failures latent while the CLI was only a fallback

**L1. The hook fallback probed a socket path that never existed.** `runtime/dist/hooks/lib/skill-advisor-cli-fallback.js` probed a flat socket path while real sockets are nested under a scope directory derived from a `sha256` digest of the database directory — the helper always reported `socket_absent`. Hidden because the helper ran only after the primary path had already failed; nothing exercised it while a working answer existed upstream. [SOURCE: command:`git show e8d564ca98`] [SOURCE: file:.opencode/skills/system-skill-advisor/runtime/dist/hooks/lib/skill-advisor-cli-fallback.js (fixed)]

**L2. The fallback's 250 ms budget was under half the warm latency.** The same helper clamped its wait to 250 ms while a warm CLI call measures ~440 ms — a reachable daemon still timed out. Hidden by the same secondary-path masking. The repaired resolver now honors the caller's real deadline: "clamping it to the fallback default would kill a warm CLI call inside its measured latency" (`fallback.js:66-73`). [SOURCE: command:`git show e8d564ca98`] [SOURCE: file:same file:66-73]

**L3. An unreachable daemon cost the full ~30 s tool timeout.** Missing sockets and refused connections are immediately knowable, but the fallback treated them like timeouts. Hidden because the Python/native path answered first, so the path was rarely exercised at all. [SOURCE: command:`git show e8d564ca98`]

**L4. On a cold session, the CLI refused to start the daemon — the prompt hook got no brief at all.** The child env's prompt-time marker makes the CLI default to warm-only (`skill-advisor-cli.ts:390-394`: `defaultWarmOnly()` returns true when `SYSTEM_SKILL_ADVISOR_CLI_PROMPT_TIME` or siblings are set), and warm-only refuses with exit 75 and never spawns. The fix passes `--no-warm-only`; the repaired code's own comment records the defect: "leaving every cold session with no brief at all" (`fallback.js:148-150`). Hidden because the worst failure was *silence*: the first fix produced a 209 ms hook that read as an improvement — "a faster number was the defect's signature" — until commit `7920288acb` bounded the cold-start wait. This is the packet's central lesson: **the observable signature of the failure looked like success.** [SOURCE: file:.opencode/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:390-394] [SOURCE: file:skill-advisor-cli-fallback.js:148-150] [SOURCE: command:`git show 7920288acb`]

**L5. Callers carried their own resilience, and the new front door initially had none.** The CLI gained its own local-scorer fallback (`degraded`-marked, excluded from `--warm-only`) in `514f2be726` *before* callers were moved onto it — sequencing, not a code defect, is what kept the gap latent. [SOURCE: command:`git show 514f2be726`]

**L6. The MCP declaration blocks carried configuration the daemon still needed.** The five `env` blocks held the database dir, socket dir, doc-trigger flag, and trust default. Deleting them with the declarations would have disabled indexing "with nothing failing and no test going red" and made mutations fail closed (the trust gate at `caller-context.ts` rejects tools unless `callerContext.trusted === true`). Caught by the phase-001 inventory before deletion; rehomed to `REPO_ENV_DEFAULTS` at `.opencode/bin/system-skill-advisor-launcher.cjs:83-91`. Hidden because nothing in the transport's shape reveals that the declaration is also a config carrier. [SOURCE: file:001 inventory.md:152-155] [SOURCE: file:.opencode/bin/system-skill-advisor-launcher.cjs:83-91]

**L7. A different package's shim hardcoded the renamed path.** Spec-kit's hook shim resolved the advisor's compiled hook via `TARGET_REL` (`system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:19`); every in-package test would pass with it broken. Hidden because the real call path lives outside the package being changed. [SOURCE: command:`git show 3feab865ea`] [SOURCE: file:user-prompt-submit.ts:19]

**L8. The "transport" object was load-bearing plumbing.** Phase 005 found the MCP `Server` object was the socket's request handler, not a stdio transport, and halted rather than delete the socket the CLI depends on; the phase reopened and shipped the wire migration (`3def6d6c9b`). Hidden because the object was named for a transport but functioned as the daemon's request loop. [SOURCE: command:`git show 3def6d6c9b`]

**Verification-system failures (latent in the harness, not the product):**
- **L9.** Two parity cases carried an invalid `queryType`, so "green" cases exercised an argument error, not a query — "the second time this file has carried a wrong argument shape" (`127aef03e7`).
- **L10.** Sampling four suites hid 48 failures elsewhere; "Running it at all was the fix" (`9015d00c79`).
- **L11.** The documented `--convergence-mode` flag was never read by the fan-out runner; `--stop-policy=max-iterations` produced identical observable behavior and hid the gap. Now repaired — the fix's comment at `fanout-run.cjs:191-196` records the mechanism. [SOURCE: file:.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:191-196]

**The unifying mechanism:** every latent failure sat on a path the healthy system never took — the fallback behind a working primary, the env inside a declaration, the shim outside the package, the handler behind a transport name, the flag behind an equivalent flag. Promotion is what made the untraveled path load-bearing.

## Q2 — Residue classes a transport removal leaves

Eleven classes, each grounded in this packet (details and citations: `iterations/iteration-003.md`):

1. **Assertion residue** — claims containing neither retired token: "the only MCP daemon this repository still runs"; "MCP remains the primary in-session transport." **The class the existing sweep missed** — the review found eight surfaces "by hunting claims instead of tokens" (goal.md:144).
2. **Corpus-outside path residue** — 87 live files outside the swept corpus, including four `.github/` workflows (one a `working-directory` that no longer resolved — residue that *executes*). "Neither audit loop looked under `.github/`" (goal.md:145). The second missed class, spatial rather than semantic.
3. **Printed-command residue** — instructions that fail on the operator's machine (install/build against the deleted directory).
4. **Diagnostic residue** — checks asserting the removed world become permanent false negatives (mcp-doctor could never report healthy).
5. **Test/fixture residue** — a fake daemon speaking the MCP handshake, invalid-enum parity inputs, a retrieval fixture carrying a retired tool id as data, a stress suite no default run executes.
6. **Name-outlived-referent, kept by constraint** — `SYSTEM_SKILL_ADVISOR_BRIDGE_TIMEOUT_MS` and plugin status fields left deliberately: renaming an operator-set env var is itself the operator-visible change D2 forbids.
7. **Generated-artifact residue** — the committed trigger index is regenerated, not edited (`f5c55c7eb8`); dist paths invalidate at once.
8. **Evidence residue** — changelogs and dated benchmarks record what was true; rewriting them is falsification (rewritten, then restored, `afd10f291f`). The class where the correct action is inaction.
9. **Negative-guard residue** — tests asserting absence keep the retired name to keep guarding it (`route-contract.test.cjs:141-142`).
10. **Packet-record residue** — unfilled "Not started" summaries in completed phases, stale limitation blocks, coverage accounting living only in commit messages (009 F015–F017). The record rots with the work — and across loop boundaries: uncommitted review output reverted a research lineage through write containment (goal.md:146).
11. **Retrieval-vocabulary residue** — trigger phrases naming the old transport index the asker's vocabulary (`"mcp recommend tool"`, advisor-recommend.md:6); intentionality unrecorded — hypothesis: deliberate.

**Bucketing rule:** a hit is *historical* when it records what was true when written (changelogs, dated benchmarks, frozen fixtures, run records, the packet's own documents, and — per the sibling packet — the sweep's own documents); *live* when it instructs about the current tree. Correct actions differ by bucket: live→rewrite, historical→leave, negative-guard→keep, generated→regenerate, operator-visible-name→keep deliberately.

**Sibling corroboration** (`017-memory-database-decommission`, the packet's own pattern reference): the same taxonomy independently — 214 claim-hits in 115 live files after its token sweep read zero; code seams broken (doctor:update's first phase, the embedding client's spawn-authority guard); and the literal-zero acceptance criterion itself amended to "no live instruction surface" because kept evidence made literal zero unreachable (goal.md:94,129,143). The advisor's AC-007 wording is the corrected form.

**Current state:** 820 files carry the old path; zero outside `specs/`/`changelog/`/`benchmark` — AC-007's "87 → 0 live, 24 historical by design" still holds.

## Q3 — The checklist for the next transport-to-CLI migration

21 steps in five phases, ordered so steps preventing the most expensive failures come first — where "expensive" means the cost lands somewhere the change's own tests never look. (Full step-level citations: `iterations/iteration-004.md`.)

**A. Map what the transport silently carries (prevents silent functional loss):**
1. Two reconciled inventories — by string and by symbol — classified rewire/delete/preserve/historical, zero unclassified.
2. Lift config out of declarations before deleting them; rehome env defaults with operator override preserved. *(The packet's most expensive near-miss.)*
3. Trace the automatic behavior through the real session path — the registered shim, not the package's entry point.
4. Decide the resident process's fate by measurement; name what starts it once the transport's client no longer does; record uncovered runtimes as known gaps.

**B. Prove the replacement while the old one is live (prevents a wrong replacement):**
5. Freeze the wire contract in writing; separate transport vocabulary from generic framing it rides on.
6. Parity on a frozen input set with a named-reason allowlist — and validate the inputs themselves.
7. Move resilience behind the new front door before repointing callers.
8. Exercise the fallback path as if already primary, in every dependency state (warm/cold/absent/refused).

**C. Rewire, then delete — stopping on surprise (prevents deletion breakage):**
9. Repoint every caller while the old transport still answers; prove each caller's own helper.
10. Hand the deletion its dependents in writing first.
11. When the removal surface proves load-bearing, halt — reopen the phase, don't work around it.
12. Rename after removal; carry every path, and regenerate generated artifacts rather than editing them.

**D. Sweep residue by claims, over the whole repo, with explicit keep-classes (prevents the rot that outlives the code):**
13. Hunt claims, not tokens — after the token sweep reads zero, hunt assertions that the removed thing exists.
14. Sweep the whole repo including the places no phase owns — CI, ignore files, other packages' references.
15. Classify before editing; write the buckets into the acceptance criterion itself (live-zero, not literal-zero).
16. Run every command a document prints.
17. Retire diagnostics that assert the old world — a permanent false negative is worse than no check.

**E. Verify from the final state and keep the record honest (prevents false confidence):**
18. Run the full suite, not a sample; invert old-contract tests so they guard the absence.
19. Measure the delta through the real call path, one worktree, cold and warm — and treat a suspiciously faster number as a defect signature.
20. Fill the packet record before close; commit each loop's artifacts before starting the next.
21. Audit that the harness's own flags bind, not just its outputs.

## Limitations

This lineage ran zero suite executions and timing measurements (containment prohibited commands that write outside the lineage); all test counts and latency figures are cited as packet-document claims, not re-observed. Phase 010's output was not read — agreement between lineages is independent convergence. C11's intentionality is a labeled hypothesis.
