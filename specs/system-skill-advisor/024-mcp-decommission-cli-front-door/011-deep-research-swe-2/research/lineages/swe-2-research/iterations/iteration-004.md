---
title: "Iteration 4: The checklist — ordered by the cost of the failure each step prevents"
trigger_phrases: []
---
# Iteration 4: The checklist — ordered by the cost of the failure each step prevents

## Focus

Q3: a repeatable checklist for the next transport-to-CLI migration, ordered so steps preventing the most expensive failures come first. Ordering rationale: the expensive failures in this packet were the ones whose cost is paid somewhere the change's own tests never look — another package's shim, CI, the operator's terminal, next session's cold start — so the steps that map *those* surfaces come first.

## Actions Taken

1. Verified the parity harness artifacts: `parity/report.json` — 22 frozen cases, 7 matched, 15 allowlisted under named `allowlistIds` (e.g. `cache-hit-run-order`), 0 differed.
2. Verified the warm-only mechanism that made L4 possible: `defaultWarmOnly()` returns true when any prompt-time env marker is set (`skill-advisor-cli.ts:390-394`) — so a hook-spawned CLI refuses cold spawn by default, which is exactly why the fallback helper needed `--no-warm-only`.
3. Ranked the latent failures and residue classes by blast radius and detectability to derive the ordering.

## The checklist (each step cites its packet episode)

### A. Before touching anything — map what the transport silently carries

**1. Inventory by two reconciled sweeps — one by transport string, one by symbol — and classify every row rewire/delete/preserve/historical with zero unclassified.** The packet froze `6012ec5c7d` with 5 SDK sites, 5 declarations, 13 callers, 4 automatic behaviors, 63 flags, 7 preserve-set items. [SOURCE: file:001 inventory.md:22-30,160-172]

**2. Lift the config out of the declaration before deleting the declaration.** The five MCP server blocks carried the db dir, socket dir, doc-trigger flag and trust default the daemon still needs; deleting them would have disabled indexing "with nothing failing and no test going red" and made mutations fail closed. Rehome first (`REPO_ENV_DEFAULTS` at `.opencode/bin/system-skill-advisor-launcher.cjs:83-91`, with "a .env entry still wins" preserving operator override). *Most expensive near-miss in the packet.* [SOURCE: command:`git show eb53802beb`] [SOURCE: file:001 inventory.md:152-155]

**3. Trace the automatic behavior through the path a real session takes — the registered shim, not the package's entry point.** Spec-kit's hook shim hardcoded the advisor's compiled path; the advisor's own tests would all have passed with it broken. Cross-package references are inventory items, not surprises. [SOURCE: command:`git show 3feab865ea`] [SOURCE: file:system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:19]

**4. Decide the resident process's fate by measurement, and name what starts it once the transport's client no longer does.** Cold 3008 ms vs warm 926 ms kept the daemon; "the MCP client connection starts it today" became a per-runtime `--warm-only` at session start, with Pi recorded as a known gap rather than assumed solved. [SOURCE: file:002 baseline.md:40-73] [SOURCE: file:002 warm-mechanism.md:22-63]

### B. Prove the replacement while the old transport is live

**5. Freeze the wire contract in writing first, and separate the transport's vocabulary from the generic framing it rides on.** JSON-RPC + `initialize` stayed because the shared bridge's at-capacity liveness probe parses them (D1 amended rather than violated); only the MCP vocabulary went. A bespoke protocol was rejected precisely because it adds a second grammar without removing the first. [SOURCE: file:002 protocol-contract.md:41-58,131-135]

**6. Build the parity harness on a frozen input set with a named-reason allowlist — and validate the inputs themselves.** 22 cases: 7 matched, 15 allowlisted under named ids, 0 differed. Two cases carried an invalid `queryType` and exercised an argument error instead of a query — a green run that could not see what it measured ("the second time this file has carried a wrong argument shape"). [SOURCE: file:003 parity/report.json] [SOURCE: command:`git show 127aef03e7`]

**7. Move the resilience behind the new front door *before* repointing callers.** The CLI got its own local-scorer fallback first (`514f2be726`), marked `degraded`, so callers could drop their own fallbacks; warm-only is excluded because it must never spawn. [SOURCE: command:`git show 514f2be726`]

**8. Exercise the fallback path as if it were already primary, in every dependency state.** The three hook-helper defects — flat socket probe vs the `sha256(dbDir)` scope dir, the 250 ms clamp under ~440 ms warm latency, the 30 s wait on a knowable-immediately failure — were each invisible because the path ran only after a primary failure. A fallback exercised in isolation under warm/cold/absent/refused shows all of them. [SOURCE: command:`git show e8d564ca98`] [SOURCE: file:.opencode/skills/system-skill-advisor/runtime/dist/hooks/lib/skill-advisor-cli-fallback.js:148-150]

### C. Rewire, then delete — in that order, stopping on surprise

**9. Repoint every caller while the old transport still answers, and prove each caller's own helper — not just the binary.** The completion criterion reads "each caller's own helper proven too, not just the binary." [SOURCE: file:goal.md:81] [SOURCE: file:spec.md:144]

**10. Hand the deletion its dependents before deleting.** Phase 004 closed by recording the three bridge-dependent test files so the removal "retires them in the same change rather than discovering them afterwards." [SOURCE: command:`git show 91fd9b6226`]

**11. When the deletion surface turns out to be load-bearing, halt — do not work around it.** Phase 005 found the MCP `Server` object was the socket's request handler, not a stdio transport, and stopped rather than deleting the socket the CLI depends on; the phase reopened and the wire migration shipped in `3def6d6c9b`. [SOURCE: command:`git show 3def6d6c9b`]

**12. Rename after the removal, and carry everything that names the path — including generated artifacts, which are regenerated, not edited.** `git mv` plus 407 path updates: launcher, CLI shim, plugin, doctor scripts, tsconfig outputs, freshness key, the cross-package shim, and the committed trigger index (`f5c55c7eb8`). Renaming first would hide deletions inside a move diff. [SOURCE: command:`git show 3feab865ea`] [SOURCE: file:goal.md:116] [SOURCE: file:spec.md:158]

### D. Sweep residue by claims, over the whole repo, with explicit keep-classes

**13. Hunt claims, not tokens.** After the token sweep reads zero, hunt assertions that the removed thing exists — "the only MCP daemon this repository still runs" names neither the retired ids nor the old path. This is the class the packet's own sweep missed; the review found eight surfaces this way. [SOURCE: file:goal.md:144] [SOURCE: file:009 review report F002/F005/F008/F009]

**14. Sweep the whole repo, including the places no phase owns — CI, ignore files, other packages' references.** Four workflows and `.gitignore` still resolved the renamed directory, one as a `working-directory` that no longer exists — residue that *executes*, found while closing findings, in a place neither the sweep nor the audit looked. [SOURCE: file:goal.md:145] [SOURCE: command:`git grep` on .github — now `runtime/`]

**15. Classify before editing: some hits must stay.** Changelogs, dated benchmark reports, frozen fixtures and prepended run records record what was true — rewriting them is falsification (changelogs were rewritten and then restored). Negative-guard tests keep the retired name to guard its absence. Operator-visible names (env vars, status fields) can't be renamed without an operator-visible change — keep them deliberately, in writing. [SOURCE: command:`git show afd10f291f`] [SOURCE: file:008 acceptance-criteria.md:91-97] [SOURCE: file:skill-advisor-route-contract.test.cjs:142]

**16. Run every command a document prints.** A build command against the deleted directory is worse than a wrong sentence — it fails on the operator's machine (F001, F008, F012). Phase 007 listed "an invocation printed but never run" as a risk and still shipped one. [SOURCE: file:009 report F001] [SOURCE: file:007 spec.md:156]

**17. Retire diagnostics that assert the old world.** A health check that tests for a deliberately-removed declaration becomes a permanent false negative — it manufactures a failure signal, which is worse than no check (F002). [SOURCE: file:009 report F002]

### E. Verify from the final state, and keep the record honest

**18. Run the full suite, not a sample — and invert the tests that guarded the old contract so they guard its absence.** Sampling four suites hid 48 failures; the fix was running it at all. Three contract tests were inverted to assert non-declaration, launcher-supplied defaults, and the new directory name. [SOURCE: command:`git show 9015d00c79`]

**19. Measure the delta through the real call path, in one worktree, cold and warm.** An earlier packet comparison across two checkouts was invalid ("the numbers flattered the change"); the final figures ran the registered shim path with the daemon stopped for cold runs. Also: a faster number can be the defect's signature — 209 ms read as success because the work had stopped. [SOURCE: file:008 latency-delta.md:32-58] [SOURCE: command:`git show 7920288acb`]

**20. Keep the packet record as honest as the tree.** Unfilled "Not started" summaries in completed phases, a stale limitation block, and coverage accounting that lived only in a commit message (F015–F017) — the record of the work is itself a residue surface. Fill it before close. [SOURCE: file:009 report F015-F017]

**21. Check that the harness's own knobs bind.** The packet's audit surfaced a documented `--convergence-mode` flag the fan-out runner never read — invisible because `--stop-policy=max-iterations` produced identical observable behavior. The defect is now repaired; the fix's own comment records the mechanism ("the runner never read the flag... Only the stop policy reached the leaf, which happens to produce the same no-early-stop behaviour and hid the gap"). Audit flags, not just outputs. [SOURCE: file:goal.md:148] [SOURCE: file:.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:191-196,2644]

## Ordering rationale

Steps 1–4 prevent *silent functional loss* — the failures with unbounded blast radius and no error signal (un-indexed docs, fail-closed mutations, no brief on cold sessions). Steps 5–8 prevent *a wrong replacement* — defects that surface only after the comparison target is gone. Steps 9–12 prevent *deletion breakage*. Steps 13–17 prevent *the rot that outlives the code*. Steps 18–21 prevent *false confidence* — the meta-failure that lets all the others pass review.

## Questions Answered

- Q3: a 21-step checklist in five phases, each step justified by a packet episode, ordered by the cost and detectability of the failure it prevents.

## Questions Remaining

- None of the three asked questions remains open; iteration 5 is the adversarial completeness pass: citation audit, ungrounded-claim sweep, and any uncovered angle (e.g. the sibling memory-server decommission referenced as the pattern).

## Ruled Out

- Ordering the checklist by the packet's own phase order: rejected — the packet's order serves execution safety (nothing deleted before its replacement), while the checklist's order serves failure-cost prevention; they agree in spirit but the checklist re-sequences for the *next* migration, which gets to learn from this one's exposures.

## Dead Ends

- None.

## Edge Cases

- The checklist assumes a resident-process backend; for a genuinely stateless transport, step 4 collapses to "confirm nothing needs starting." Packet-grounded, still generalizable.

## Sources Consulted

- 003-cli-front-door-parity/parity/{report.json,cli-vs-mcp-parity.cjs,frozen-inputs.json}
- runtime/skill-advisor-cli.ts (warm-only/prompt-time defaults)
- All packet episodes cited above (commits, docs, live files)

## Assessment

- New information ratio: 0.7
- Novelty justification: The checklist synthesizes prior findings into a new artifact; the ordering principle (cost paid where tests don't look) is the genuinely new content.
- Confidence: high — every step carries a citation; the ranking argument is analysis, labeled as such.

## Reflection

- What worked and why: deriving the order from *where the cost lands* rather than from chronology produced a defensible, non-obvious ranking.
- What did not work and why: nothing.
- What I would do differently: nothing.

## Recommended Next Focus

Iteration 5: adversarial completeness — re-verify every load-bearing citation in iterations 1–4, check the sibling memory-decommission packet named as the pattern reference for corroboration/contradiction, and close any ungrounded claim.
