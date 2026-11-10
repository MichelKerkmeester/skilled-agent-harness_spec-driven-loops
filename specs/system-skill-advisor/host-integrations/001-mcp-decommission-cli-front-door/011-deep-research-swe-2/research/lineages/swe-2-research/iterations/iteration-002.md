---
title: "Iteration 2: The latent failures a promoted fallback exposes"
trigger_phrases: []
---
# Iteration 2: The latent failures a promoted fallback exposes

## Focus

Q1: which failures were latent while the CLI was only a fallback and surfaced solely because it became the primary path — each named at its file with the mechanism that kept it hidden. The defect *hunt* was phase 009's; this iteration studies the exposure pattern.

## Actions Taken

1. Read the repair-commit narratives (`e8d564ca98`, `7920288acb`, `514f2be726`, `9015d00c79`, `127aef03e7`, `3feab865ea`) and mapped each described defect onto the current file.
2. Verified the fixes in `hooks/lib/skill-advisor-cli-fallback.ts` (timeout resolution, `--no-warm-only`, degraded-answer freshness, process-group kill).
3. Verified the socket scope-digest in `.opencode/bin/lib/launcher-ipc-bridge.cjs` and the cold-start bound in `runtime/skill-advisor-cli.ts`.
4. Verified the trust-default consumer in `runtime/advisor-server.ts` and the launcher rehome at `system-skill-advisor-launcher.cjs:83-91`.
5. Verified the cross-package shim path at `system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:19` and the Python scorer's `probe_native_advisor()` at `runtime/scripts/skill_advisor.py:757`.

## Findings — the latent set, each with its hiding mechanism

**L1. The hook helper had never found the daemon.** The pre-fix helper probed a flat socket path; real sockets live a level deeper in a scope directory named by `sha256(dbDir).slice(0,12)` — still true today at `.opencode/bin/lib/launcher-ipc-bridge.cjs:152`. Its own comment admitted hooks do not inherit `SPECKIT_IPC_SOCKET_DIR`. It always reported `socket_absent`. **Hiding mechanism:** the helper only ran after the Python primary path had already failed, so `socket_absent` was indistinguishable from a true negative — a fallback that always reports "nothing to fall back to" looks correct. [SOURCE: command:`git show e8d564ca98` message] [SOURCE: file:.opencode/bin/lib/launcher-ipc-bridge.cjs:118-153]

**L2. A 250 ms clamp that could never succeed.** The same helper clamped its call to a 250 ms fallback budget while warm latency is ~440 ms; even a reachable daemon would have timed out. **Hiding mechanism:** same as L1 — a fallback nobody reaches is never observed failing. The fix inverts the clamp: the caller's hook budget is the real deadline and the default is only a floor (`resolveSkillAdvisorCliFallbackTimeoutMs`, lines 145–158, with the comment "clamping it to the fallback default would kill a warm CLI call inside its measured latency"). [SOURCE: command:`git show e8d564ca98`] [SOURCE: file:.opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:145-158]

**L3. Thirty seconds to learn the daemon was down.** An unreachable daemon waited out the whole tool timeout because a missing socket and a refused connection were treated as timeouts rather than knowable-immediately conditions. **Hiding mechanism:** the slow path still eventually answered, so nothing red; the latency was the defect wearing the shape of a result. The fix splits the probe by reason — `probeTimedOut()` + bounded `COLD_START_WAIT_MS = 5000` in `ensureDaemonReady`, with the design comment "a caller that can also answer without the daemon must not be held for the whole tool timeout by one that never accepts a connection." [SOURCE: command:`git show e8d564ca98`] [SOURCE: file:.opencode/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:28,1247-1275]

**L4. The first fix made it worse — and faster.** Removing the daemon spawn meant cold sessions never started one: the CLI answered from the local scorer and the hook emitted no `Advisor:` line at all. "The 209ms that read as success was the defect's signature. It was fast because it had stopped doing the work." **Hiding mechanism:** a regression that improves the number being watched. The correction: a missing socket now starts the daemon and waits up to five seconds; only then does the local scorer answer — and the fallback helper gained `--no-warm-only` because the prompt-time env marker otherwise makes the CLI default to warm-only, which "refuses with exit 75 and never starts anything — leaving every cold session with no brief at all." [SOURCE: command:`git show 7920288acb`] [SOURCE: file:.opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:242-246]

**L5. A degraded answer thrown away for lacking a field.** The helper discarded fallback recommendations because they lacked a freshness field — "which is how a degraded answer became no answer." **Hiding mechanism:** a schema check written for the healthy path rejecting the degraded path's output. The fix folds the envelope's `degraded`/`source` markers into the data view (`parseCliPayload`, lines 457–473) and maps degraded to `stale`, not `unavailable` (`freshnessFrom`, lines 306–315: "Reporting it as unavailable is what made the hook discard the payload and emit the directives alone"). [SOURCE: command:`git show 7920288acb`] [SOURCE: file:.opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:306-315,457-473]

**L6. The env blocks were load-bearing and nobody's tests knew.** The five MCP declarations carried the database dir, socket dir, doc-trigger flag and trust default. Deleting them would have switched off doc-frontmatter harvest "with nothing failing and no test going red" and made mutation commands fail closed (`SYSTEM_SKILL_ADVISOR_TRUST_DEFAULT === 'trusted'` gate at `runtime/advisor-server.ts:206-208`). **Hiding mechanism:** config piggybacking on the artifact being deleted — the values lived inside the thing's luggage, not in a named config owner. The rehome is `REPO_ENV_DEFAULTS` in `system-skill-advisor-launcher.cjs:83-91`, applied only when the environment stays silent, verified both ways. [SOURCE: command:`git show eb53802beb`] [SOURCE: file:.opencode/bin/system-skill-advisor-launcher.cjs:78-91] [SOURCE: file:.opencode/skills/system-skill-advisor/runtime/advisor-server.ts:206-208]

**L7. The path that mattered lived in a different package.** Spec-kit's own prompt-hook shim hardcodes the advisor's compiled hook path — `TARGET_REL = 'skills/system-skill-advisor/runtime/dist/hooks/claude/user-prompt-submit.js'` today at `user-prompt-submit.ts:19`; pre-rename it said `mcp-server/dist/...`. "The advisor's own tests would all have passed with it broken." **Hiding mechanism:** every in-package test exercises the entry point directly; only a real session through the registered shim — the path `.claude/settings.json:85` actually invokes — touches the string. Verified through the shim on a cold daemon, not through the package's tests. [SOURCE: command:`git show 3feab865ea`] [SOURCE: file:.opencode/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:19] [SOURCE: file:.claude/settings.json:85]

**L8. The wire the CLI spoke was still MCP after phase 3 "closed".** Phase 003 shipped the parity harness and the written protocol contract and closed its criteria; phase 005 then found the MCP `Server` object was the socket's request handler, not merely a stdio transport, and stopped rather than deleting the socket the CLI depends on. The actual wire migration shipped later in `3def6d6c9b`. **Hiding mechanism:** parity proved payload equality, not framing; the written contract was mistaken for its implementation — a closure-criteria gap, not a code gap. [SOURCE: command:`git show 3def6d6c9b`] [SOURCE: command:`git log f4bf73e682` "reopen phase 3"]

**L9. The parity harness's frozen inputs could not ask the question.** Two graph-query cases passed a `queryType` the schema does not accept, so they exercised an argument error rather than a query — "the second time this file has carried a wrong argument shape." **Hiding mechanism:** a green harness run over cases that never reach the code under comparison; the allowlist absorbed the failure as an expected difference. [SOURCE: command:`git show 127aef03e7`]

**L10. Sampling four suites hid forty-eight failures.** The full suite had 48 failures while the sampled four looked clean: "Running it at all was the fix: I had been sampling four suites and missing the rest." 26 tested the deleted plugin bridge; 3 were inverted to guard the new contract (no runtime declares the advisor; the launcher supplies the rehomed defaults while explicit wins; the directory is `runtime/`); 4 more asserted the removed contract in less obvious places — a launcher test reading the trust default from the deleted config block, a redaction test asserting a bridge path, a dual-client fake daemon still speaking the MCP handshake, a stress test no default run executes. **Hiding mechanism:** verification by sampling. [SOURCE: command:`git show 9015d00c79`]

**L11. A documented flag the runner never read.** `fanout-run.cjs` carried no reference to `--convergence-mode`, so the fan-out path silently dropped it and lineages took the default while the caller believed convergence was off. **Hiding mechanism:** `--stop-policy=max-iterations` produces the same observable no-early-stop behavior, so the dropped flag was invisible in outcomes — discovered only when the goal log audited the flag, not the behavior. Now fixed (`normalizeConvergenceMode` at `fanout-run.cjs:195-205`, with the comment recording the mechanism). [SOURCE: file:specs/system-skill-advisor/025-mcp-decommission-cli-front-door/goal.md:148] [SOURCE: file:.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:191-205]

**L12. The "legacy fallback" was a production caller.** The Python shim was assumed to be a fallback for MCP-less callers; it is called in production by the OpenCode plugin, the doctor parent-skill check, the deep-loop benchmark probe, two create-skill assets and four advisor modules, and it probes the native advisor and scores locally when unreachable (`probe_native_advisor()` at `skill_advisor.py:757`). Removing it would have dropped the brief on daemon-down sessions. **Hiding mechanism:** the architecture document's label — it described the shim as a legacy fallback *and misplaced the file* (`compat/skill_advisor.py` vs real `mcp-server/scripts/skill_advisor.py`), so the label went unchallenged. D4 was amended: the fallback moved behind the CLI rather than away. [SOURCE: file:specs/system-skill-advisor/025-mcp-decommission-cli-front-door/001-transport-and-consumer-inventory/inventory.md:141-150] [SOURCE: file:specs/system-skill-advisor/025-mcp-decommission-cli-front-door/goal.md:141] [SOURCE: file:.opencode/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:757-777]

## The pattern

Every latent failure shares one mechanism family: **the fallback path was exercised so rarely that wrongness was indistinguishable from absence** (L1–L3, L5), or **the cost of the failure was paid as latency/config/history rather than as a red test** (L4, L6, L9, L10), or **the failing surface lived outside the package under test** (L7, L11) or **behind a wrong label** (L8, L12). Promotion to primary is what made each one observable: the same defect, now on the only path, on every prompt.

## Questions Answered

- Q1 — twelve named latent failures, each at a file with its hiding mechanism, grouped into four mechanism families.

## Questions Remaining

- Q2 residue classes (next).
- Q3 checklist ordering (after residue, since the checklist must interleave the two).

## Ruled Out

- Counting phase 009's nine P1 findings as "latent failures" for Q1: they are residue surfaces (Q2 material), not fallback-promotion exposures. Kept separate deliberately. The two sets interact at F013 (the `X ?? X` self-fallback at `skill-advisor-cli-fallback.ts:182`, pre-existing at `ed5f102287`) — a latent defect the review found but dated before the packet. [SOURCE: file:009 review report, P2 F013] [SOURCE: file:hooks/lib/skill-advisor-cli-fallback.ts:182]

## Dead Ends

- Looking for latent failures in the scorer/graph internals: out of scope (D7 froze routing quality) and none surfaced — the latent set clusters exactly where fallback-ness hid it.

## Edge Cases

- The `mcpServerDir` variable name at `.opencode/bin/skill-advisor.cjs:22` still names the retired directory but resolves `runtime/dist/runtime/skill-advisor-cli.js` — functional residue (name outlived referent), already catalogued by 009 as a scope note under F012; bucketed as live-code naming, not an instruction surface. [SOURCE: file:.opencode/bin/skill-advisor.cjs:22]

## Sources Consulted

- git show: e8d564ca98, 7920288acb, 514f2be726, 9015d00c79, 127aef03e7, 3feab865ea, eb53802beb (read-only)
- .opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts
- .opencode/skills/system-skill-advisor/runtime/skill-advisor-cli.ts
- .opencode/bin/lib/launcher-ipc-bridge.cjs
- .opencode/bin/system-skill-advisor-launcher.cjs
- .opencode/skills/system-skill-advisor/runtime/advisor-server.ts
- .opencode/skills/system-skill-advisor/runtime/scripts/skill_advisor.py
- .opencode/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts
- .claude/settings.json
- specs/.../025/goal.md, 001 inventory.md, 009 review report (archived deepseek-review)

## Assessment

- New information ratio: 0.95
- Novelty justification: Twelve latent failures enumerated at file granularity with four hiding-mechanism families; only the packet's naming of "three defects" was previously recorded.
- Confidence: high — each item cites a commit message verified against the current file, or the current file itself.

## Reflection

- What worked and why: reading commit *messages* as primary sources, then verifying each claim against the live file — the messages are unusually mechanism-explicit.
- What did not work and why: searching for the old buggy code — it is gone; the fixed code plus the commit narrative is the evidence pair.
- What I would do differently: nothing.

## Recommended Next Focus

Iteration 3: Q2 — residue classes. Ground each class in something actually present in this packet: the 009 finding classes, the 87-file path residue, the .github blind spot, the changelogs-rewritten-then-restored episode, the generated trigger index, the unfilled summaries, the test-fixture daemon still speaking MCP.
