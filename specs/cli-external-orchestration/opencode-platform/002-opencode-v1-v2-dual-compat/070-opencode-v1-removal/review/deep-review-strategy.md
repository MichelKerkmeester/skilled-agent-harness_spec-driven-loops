---
title: Deep Review Strategy Template
description: Runtime template copied to review/ during initialization to track review progress, dimension coverage, findings, and outcomes across iterations.
trigger_phrases:
  - "deep review strategy template"
  - "review dimension tracking"
  - "exhausted review approaches"
  - "review session tracking"
importance_tier: normal
contextType: planning
version: 1.11.0.13
---

# Deep Review Strategy - Session Tracking Template

Runtime template copied into the resolved `{artifact_dir}/` during initialization. Tracks review progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep review session. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{artifact_dir}/deep-review-strategy.md` and populates Topic, Review Dimensions, Known Context, and Review Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, reviews the assigned dimension/files, updates findings, marks dimensions complete, and sets new Next Focus.
- **Mutability:** Mutable, updated by both orchestrator and agents throughout the session.
- **Protection:** None (shared mutable state). Orchestrator validates consistency on resume.
- **Ownership:** Machine-managed metrics and coverage blocks are wrapped in explicit ownership markers. Human commentary and operator overrides live outside those markers.

---

## 2. TOPIC
Branch worktrees/477-opencode-v1-removal, its own commits since origin/main: ba9720f2f08 (runtime code), fc8b3a9a241 (CI and packages), af87a2aa13a (docs), 96e3d8a8f24 (spec packet), 3ef324c3de1 (renames), 4c72145b752 (live evidence), plus the a793f3ad733 merge conflict resolution in cli-opencode/references/providers-and-models.md. The work removes OpenCode 1 support; OpenCode 2 (@opencode/cli 2.3.2) is the only supported major.

Review target type: files (the branch diff). Dimension queue: correctness -> security -> traceability -> maintainability. Stop policy: max-iterations (5). Generation 2 (restart; generation 1 was refused at the cli-opencode containment preflight before any iteration ran and is archived under review-archive/20261119T155645Z).

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Changes merged in from origin/main by a793f3ad733, except its conflict resolution in cli-opencode/references/providers-and-models.md.
- The Mac cleanup (out of repo scope, gated by a separate operator yes).
- Historical files the packet excludes: changelog/ folders and benchmark/reports/.
- Fixing anything: the review target is read-only.

---

## 5. STOP CONDITIONS
- stopPolicy is max-iterations: convergence is telemetry until iteration 5.
- Hard stops: maxIterationsReached (5), maxDurationReached (120 min), 3 consecutive failed iterations, executor unavailable, operator pause sentinel.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 2
- P2 (Suggestions): 7
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Reading each resolver's parser against its own test corpus: the corpus rows settle what the parser actually returns rather than what its comment claims (iteration 1)
- Grepping a suspicious symbol across the removal diff before accepting a dangling-import claim: distinguished real dead code from a locally defined constant (iteration 1)
- Reading architecture and changelog evidence beside a narrowed event branch before calling it a regression (iteration 1)
- Reading a guard module comment against its own sibling branch: the path-qualified branch states it must not run a file the command merely names, and that sentence is what exposed the ungated bare-name branch (iteration 2)
- Re-running the acceptance row's printed verification command instead of trusting its `Met` cell: one phase-003 row fails as written and the packet's own justified list explains why (iteration 3)
- Diffing two same-packet completion records against each other rather than reading either alone: the phase parent and the phase child record the same gate in opposite states (iteration 3)
- Reading the evidence file's own preamble beside its appended sections: `live.txt` says a check was not run and then records it as a success (iteration 3)
- Reading a removal against its consumers rather than against its own tests: the three suites that assert the `server` key is gone all live inside `.opencode/plugins`, and the one caller outside that folder is what the zero-match check could not see (iteration 4)
- Following an export key to its last caller before accepting a docs-and-tests closure: the docs and the suites were updated together, which is exactly what made the missed consumer read as covered (iteration 4)
- Sweeping every runtime mirror rather than the one that broke: counting `.opencode/plugins` references per mirror (`.claude`/`.codex`/`.cursor`/`.devin`/`.dsh`/`.pi` all zero, `.vibe` three files) settled that the `server` break is single-consumer instead of systemic, and turned an open worry into a confirmed-clean surface (iteration 5)
- Reading an acceptance row beside its packet's implementation summary rather than alone: the AC table says AC-004 `Met` and the summary says it is not met, which no single-file read would have exposed (iteration 5)
- Reading the consumer's header contract to classify the failure mode: the wrapper's "a core error allows" sentence is what turns the missing `server` key from a crash into a silent skipped guard (iteration 5)

---

## 9. WHAT FAILED
- Treating the commit message's "maps major 1 to unsupported" as a description of every retired major: the parser maps majors other than 1 and 2 to unknown, which is what the corpus shows (iteration 1)
- Assuming a plugin-name difference carried into its argument shape: the bridge reports `shell` as `bash` and documents that a throw denies the call, so the guard keeps its block; the name change alone proved nothing (iteration 2)
- Treating the 103-file baseline as a completeness oracle for the 30 surviving hits: the drop is real, but a survivor list written before the rename commit cannot be diffed by count alone (iteration 3)
- Treating an acceptance row's zero-match check as a consumer sweep: AC-007 searched `.opencode/plugins/tests` for `.server(`, so its passing cell said nothing about the `.vibe` caller that still holds the string (iteration 4)
- Trusting a first relative-path read taken from inside the spec folder: `.opencode/plugins/*.js` counted 0 and `ARCHITECTURE.md` looked absent until the same commands were re-run from the repository root, where the folder holds 20 files (iteration 5; corrected before any finding was written)
- Counting the appended success lines in `scratch/live.txt` as a run transcript: `:71` and `:76` say `success` but no dispatch command, exit status or artifact list sits between the `NOT RUN` preamble at `:55` and those lines (iteration 5)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **`--pure` survives in supported v2 invocations.** Ruled out: the two remaining cli-opencode mentions assert the flag's absence or record a dated v1 incident, not a v2 dispatch recipe. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **`--pure` survives in supported v2 invocations.** Ruled out: the two remaining cli-opencode mentions assert the flag's absence or record a dated v1 incident, not a v2 dispatch recipe.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`--pure` survives in supported v2 invocations.** Ruled out: the two remaining cli-opencode mentions assert the flag's absence or record a dated v1 incident, not a v2 dispatch recipe.

### **`--pure` surviving in a supported recipe.** Not re-entered: recorded BLOCKED at iteration 3 with two dated mentions, and nothing in this iteration's reads contradicts it. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **`--pure` surviving in a supported recipe.** Not re-entered: recorded BLOCKED at iteration 3 with two dated mentions, and nothing in this iteration's reads contradicts it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`--pure` surviving in a supported recipe.** Not re-entered: recorded BLOCKED at iteration 3 with two dated mentions, and nothing in this iteration's reads contradicts it.

### **`MAPPED_HOOKS` as a dead internal.** Ruled out as dead code (it drives the skipped-key filter at `:348`); only its export is surplus, which is the P2 above. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **`MAPPED_HOOKS` as a dead internal.** Ruled out as dead code (it drives the skipped-key filter at `:348`); only its export is surplus, which is the P2 above.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`MAPPED_HOOKS` as a dead internal.** Ruled out as dead code (it drives the skipped-key filter at `:348`); only its export is surplus, which is the P2 above.

### **`OPENCODE_BIN` can be poisoned from the command text.** Ruled out: `trustedExecutables` reads `process.env` only, and no path copies an inline assignment into it. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`OPENCODE_BIN` can be poisoned from the command text.** Ruled out: `trustedExecutables` reads `process.env` only, and no path copies an inline assignment into it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`OPENCODE_BIN` can be poisoned from the command text.** Ruled out: `trustedExecutables` reads `process.env` only, and no path copies an inline assignment into it.

### **003 AC-005 being a stale count.** The folder holds 20 `.js` files, so the row's claim is current. No finding. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **003 AC-005 being a stale count.** The folder holds 20 `.js` files, so the row's claim is current. No finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **003 AC-005 being a stale count.** The folder holds 20 `.js` files, so the row's claim is current. No finding.

### **A path-qualified binary named by a command can be executed by the guard.** Ruled out: `trustedExecutableFor` compares canonical path, size and mtime against the operator's own trust set and returns `null` otherwise. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A path-qualified binary named by a command can be executed by the guard.** Ruled out: `trustedExecutableFor` compares canonical path, size and mtime against the operator's own trust set and returns `null` otherwise.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A path-qualified binary named by a command can be executed by the guard.** Ruled out: `trustedExecutableFor` compares canonical path, size and mtime against the operator's own trust set and returns `null` otherwise.

### **A second `.server` consumer outside `.vibe`.** Searched all seven runtime mirrors for `.opencode/plugins` references and `.server(` calls; the only hits are `.vibe/plugins/repo-guards/session-cleanup.mjs:51` and `:60`. Ruled out as a broader cross-runtime break. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A second `.server` consumer outside `.vibe`.** Searched all seven runtime mirrors for `.opencode/plugins` references and `.server(` calls; the only hits are `.vibe/plugins/repo-guards/session-cleanup.mjs:51` and `:60`. Ruled out as a broader cross-runtime break.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A second `.server` consumer outside `.vibe`.** Searched all seven runtime mirrors for `.opencode/plugins` references and `.server(` calls; the only hits are `.vibe/plugins/repo-guards/session-cleanup.mjs:51` and `:60`. Ruled out as a broader cross-runtime break.

### **A stale native-lineage claim in the deep-loop presentation assets.** Ruled out: the two surviving mentions (`.skilled/commands/deep/assets/deep-review-presentation.txt:474`, `deep-research-presentation.txt:368`) assert that a native lineage is refused, which is the post-removal behaviour. No finding. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A stale native-lineage claim in the deep-loop presentation assets.** Ruled out: the two surviving mentions (`.skilled/commands/deep/assets/deep-review-presentation.txt:474`, `deep-research-presentation.txt:368`) assert that a native lineage is refused, which is the post-removal behaviour. No finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A stale native-lineage claim in the deep-loop presentation assets.** Ruled out: the two surviving mentions (`.skilled/commands/deep/assets/deep-review-presentation.txt:474`, `deep-research-presentation.txt:368`) assert that a native lineage is refused, which is the post-removal behaviour. No finding.

### **Decision 5 was applied out of order.** Ruled out: the widened branch-contract test exists and the protocol/presentation text is gone; order cannot be inverted retroactively by reading the branch state. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Decision 5 was applied out of order.** Ruled out: the widened branch-contract test exists and the protocol/presentation text is gone; order cannot be inverted retroactively by reading the branch state.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Decision 5 was applied out of order.** Ruled out: the widened branch-contract test exists and the protocol/presentation text is gone; order cannot be inverted retroactively by reading the branch state.

### **Orphaned `global.disposed` handlers left by the v1 removal.** Ruled out: ADR-001 keeps all three by name after reading the 2.3.2 binary, and the code matches the decision. No finding. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Orphaned `global.disposed` handlers left by the v1 removal.** Ruled out: ADR-001 keeps all three by name after reading the 2.3.2 binary, and the code matches the decision. No finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Orphaned `global.disposed` handlers left by the v1 removal.** Ruled out: ADR-001 keeps all three by name after reading the 2.3.2 binary, and the code matches the decision. No finding.

### **Removing the question-event branches leaves blocked-prompt state set.** Ruled out: `toV1ToolContext` throws `ask is not available on OpenCode 2` (`v2-bridge.js`), so no v2 question event exists to clear it. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Removing the question-event branches leaves blocked-prompt state set.** Ruled out: `toV1ToolContext` throws `ask is not available on OpenCode 2` (`v2-bridge.js`), so no v2 question event exists to clear it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Removing the question-event branches leaves blocked-prompt state set.** Ruled out: `toV1ToolContext` throws `ask is not available on OpenCode 2` (`v2-bridge.js`), so no v2 question event exists to clear it.

### **Rule-engine fail-open through `UNRESOLVED_FAMILIES`.** Ruled out by reading `evaluate` end to end: an unresolved family keeps every rule and keeps blocking severity for any rule whose `appliesTo` covers `SUPPORTED_FAMILIES`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Rule-engine fail-open through `UNRESOLVED_FAMILIES`.** Ruled out by reading `evaluate` end to end: an unresolved family keeps every rule and keeps blocking severity for any rule whose `appliesTo` covers `SUPPORTED_FAMILIES`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Rule-engine fail-open through `UNRESOLVED_FAMILIES`.** Ruled out by reading `evaluate` end to end: an unresolved family keeps every rule and keeps blocking severity for any rule whose `appliesTo` covers `SUPPORTED_FAMILIES`.

### **The `server.instance.disposed` and `app.disposed` removal is a shutdown regression.** Ruled out: `.opencode/plugins/ARCHITECTURE.md:224` records that the 2.3.2 binary defines neither, and the cleanup the bridge returns still runs the v1 `dispose` hook. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The `server.instance.disposed` and `app.disposed` removal is a shutdown regression.** Ruled out: `.opencode/plugins/ARCHITECTURE.md:224` records that the 2.3.2 binary defines neither, and the cleanup the bridge returns still runs the v1 `dispose` hook.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The `server.instance.disposed` and `app.disposed` removal is a shutdown regression.** Ruled out: `.opencode/plugins/ARCHITECTURE.md:224` records that the 2.3.2 binary defines neither, and the cleanup the bridge returns still runs the v1 `dispose` hook.

### **The 103 -> 30 file drop hides unjustified survivors.** Ruled out: the 30 live hits map one-to-one onto `scratch/justified.txt` except for the renamed feature-catalog path, and each survivor's stated reason matches a dated observation, a refusal path, a generated artifact or the `--remove-v1` helper. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The 103 -> 30 file drop hides unjustified survivors.** Ruled out: the 30 live hits map one-to-one onto `scratch/justified.txt` except for the renamed feature-catalog path, and each survivor's stated reason matches a dated observation, a refusal path, a generated artifact or the `--remove-v1` helper.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The 103 -> 30 file drop hides unjustified survivors.** Ruled out: the 30 live hits map one-to-one onto `scratch/justified.txt` except for the renamed feature-catalog path, and each survivor's stated reason matches a dated observation, a refusal path, a generated artifact or the `--remove-v1` helper.

### **The bridge lets a security hook fail open by swallowing a throw.** Ruled out: the await is unguarded and the throw becomes the host's denial (`.opencode/plugins/lib/v2-bridge.js:516`, `.opencode/plugins/ARCHITECTURE.md:130`). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The bridge lets a security hook fail open by swallowing a throw.** Ruled out: the await is unguarded and the throw becomes the host's denial (`.opencode/plugins/lib/v2-bridge.js:516`, `.opencode/plugins/ARCHITECTURE.md:130`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The bridge lets a security hook fail open by swallowing a throw.** Ruled out: the await is unguarded and the throw becomes the host's denial (`.opencode/plugins/lib/v2-bridge.js:516`, `.opencode/plugins/ARCHITECTURE.md:130`).

### **The dropped `session.resumed` branch leaves Gate 3 un-rearmed after a resume.** Ruled out: the v2 bus defines no `session.resumed` type (`.opencode/plugins/ARCHITECTURE.md:142`, `:149`), and `system-spec-gate.js` still re-arms on the one compaction event v2 does emit (`:192`). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The dropped `session.resumed` branch leaves Gate 3 un-rearmed after a resume.** Ruled out: the v2 bus defines no `session.resumed` type (`.opencode/plugins/ARCHITECTURE.md:142`, `:149`), and `system-spec-gate.js` still re-arms on the one compaction event v2 does emit (`:192`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The dropped `session.resumed` branch leaves Gate 3 un-rearmed after a resume.** Ruled out: the v2 bus defines no `session.resumed` type (`.opencode/plugins/ARCHITECTURE.md:142`, `:149`), and `system-spec-gate.js` still re-arms on the one compaction event v2 does emit (`:192`).

### **The legacy body file left behind by the asset sweep.** Ruled out: `.skilled/commands/deep/assets/legacy/deep-review.body.markdown` is still named as `legacyBodyPath` by `.skilled/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs:29`, so it has a reader. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The legacy body file left behind by the asset sweep.** Ruled out: `.skilled/commands/deep/assets/legacy/deep-review.body.markdown` is still named as `legacyBodyPath` by `.skilled/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs:29`, so it has a reader.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The legacy body file left behind by the asset sweep.** Ruled out: `.skilled/commands/deep/assets/legacy/deep-review.body.markdown` is still named as `legacyBodyPath` by `.skilled/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs:29`, so it has a reader.

### **The parent packet's phase-001 and phase-002 blockers were silently dropped.** Ruled out: both still appear in `spec.md:16,17` and in their children's task/AC rows. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The parent packet's phase-001 and phase-002 blockers were silently dropped.** Ruled out: both still appear in `spec.md:16,17` and in their children's task/AC rows.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The parent packet's phase-001 and phase-002 blockers were silently dropped.** Ruled out: both still appear in `spec.md:16,17` and in their children's task/AC rows.

### **The setup helper can delete another install's `opencode`.** Ruled out: an entry that does not resolve into the v1 package is moved aside instead of removed, and the restore re-verifies target and realpath. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The setup helper can delete another install's `opencode`.** Ruled out: an entry that does not resolve into the v1 package is moved aside instead of removed, and the restore re-verifies target and realpath.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The setup helper can delete another install's `opencode`.** Ruled out: an entry that does not resolve into the v1 package is moved aside instead of removed, and the restore re-verifies target and realpath.

### **The surviving `-m <model>#<effort>` argv is a v1 leftover.** Ruled out: the v2 argv is `run --standalone -m ... --format json`, with `--auto` only under `danger-full-access`, and the bypass warning now names `--auto` rather than a v1-only flag. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The surviving `-m <model>#<effort>` argv is a v1 leftover.** Ruled out: the v2 argv is `run --standalone -m ... --format json`, with `--auto` only under `danger-full-access`, and the bypass warning now names `--auto` rather than a v1-only flag.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The surviving `-m <model>#<effort>` argv is a v1 leftover.** Ruled out: the v2 argv is `run --standalone -m ... --format json`, with `--auto` only under `danger-full-access`, and the bypass warning now names `--auto` rather than a v1-only flag.

### **The v1 `part` table removal loses answers the sweeper used to find.** Ruled out by decision: the phase removes the legacy table branches, and on a 1.x database the reader reports `store_unreadable` instead of half-reading a legacy layout. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The v1 `part` table removal loses answers the sweeper used to find.** Ruled out by decision: the phase removes the legacy table branches, and on a 1.x database the reader reports `store_unreadable` instead of half-reading a legacy layout.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The v1 `part` table removal loses answers the sweeper used to find.** Ruled out by decision: the phase removes the legacy table branches, and on a 1.x database the reader reports `store_unreadable` instead of half-reading a legacy layout.

### **The Vibe break being a visible crash.** The adapter's header contract (`.vibe/plugins/repo-guards/session-cleanup.mjs:7-10`) states a core error allows and reports on stderr, so the failure is silent by design. Ruled out as a loud failure; it is a silent guard skip. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **The Vibe break being a visible crash.** The adapter's header contract (`.vibe/plugins/repo-guards/session-cleanup.mjs:7-10`) states a core error allows and reports on stderr, so the failure is silent by design. Ruled out as a loud failure; it is a silent guard skip.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The Vibe break being a visible crash.** The adapter's header contract (`.vibe/plugins/repo-guards/session-cleanup.mjs:7-10`) states a core error allows and reports on stderr, so the failure is silent by design. Ruled out as a loud failure; it is a silent guard skip.

<!-- /ANCHOR:exhausted-approaches -->
### **A second consumer of the removed `server` dual export.** Ruled out: of the seven runtime mirrors only `.vibe` references `.opencode/plugins`, and only `session-cleanup.mjs` calls `.server(` (`:51`, `:60`); every other `dualPlugin` user reaches OpenCode through `setup`. -- BLOCKED (iteration 5, 1 attempts)

### **The Vibe session-cleanup break as a visible crash.** Ruled out: the adapter's header contract states a core error allows and reports on stderr, so the missing key yields a silent skipped guard, not a loud failure. -- BLOCKED (iteration 5, 1 attempts)

### **003 AC-005's plugin count being stale.** Ruled out: `.opencode/plugins/*.js` holds 20 files, matching the row. No finding. -- BLOCKED (iteration 5, 1 attempts)

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
[Review angles that were investigated and definitively eliminated -- consolidated from iteration dead-end data]
- Disposed-branch narrowing as a shutdown regression: the 2.3.2 binary defines no `server.instance.disposed`, and the bridge's returned cleanup still runs the dispose hook (iteration 1, evidence: .opencode/plugins/ARCHITECTURE.md:224)
- Native fan-out removal as incomplete: the pre-flight and the builder both refuse, and the adapter is deleted rather than orphaned (iteration 1, evidence: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3505)
- Rule engine failing open on an unresolved version: unresolved families keep every rule and keep blocking severity for appliesTo-all rules (iteration 1, evidence: .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs:1120)
- The removal dropping unjustified v1 survivors: every surviving hit has a stated reason in `scratch/justified.txt` except one renamed path (iteration 3, evidence: 003-v1-docs-and-playbooks-sweep/scratch/justified.txt:23)
- Decision 5 landing out of order: the widened branch guard predates the protocol/presentation text removal in branch state (iteration 3, evidence: .skilled/skills/system-deep-loop/runtime/tests/unit/executor-branch-contract.vitest.ts:51)
- The phase 001 and 002 parent blockers being stale: both children still record theirs (iteration 3, evidence: specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/acceptance-criteria.md:57)
- The surviving `global.disposed` handlers being v1 leftovers: ADR-001 keeps all three by name after reading the 2.3.2 binary, and the code matches the decision (iteration 4, evidence: .opencode/plugins/ARCHITECTURE.md:224)
- A stale native-lineage claim in the deep-loop presentation assets: both surviving mentions state that a native lineage is refused, which is the post-removal behaviour (iteration 4, evidence: .skilled/commands/deep/assets/deep-review-presentation.txt:474)
- The legacy body file being orphaned by the asset sweep: `render-command-contract.cjs:29` still names it as `legacyBodyPath` (iteration 4, evidence: .skilled/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs:29)

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remains. The iteration cap (5 of 5) is reached with all four dimensions covered. - Focus area for synthesis: the fix surface for the two P1 findings. For the Vibe break, compare (a) restoring a `server` accessor on the wrapper, (b) giving the adapter a `setup`-shaped call path, and (c) retiring the adapter and its two `hooks.toml` entries; (b) and (c) keep the v1-facing surface gone, (a) re-adds it. For the checklist, re-scope 001 AC-007 to the repository root and reconcile 003 AC-004 with a written waiver or an `Unmet` row. - Reason: both P1s are confirmed against current content and neither is a candidate for downgrade; the remaining decision is the operator's, not a further read. - Rotation status: D1 complete, D2 complete, D3 complete, D4 complete. - Blocked/productive carry-forward: the "removal against consumers, not against its own tests" reading produced both P1s; it is exhausted for the removed keys now that the sweep is complete. - Required evidence: the chosen fix shape applied, then a re-read of `.vibe/plugins/repo-guards/session-cleanup.mjs` against the new wrapper, plus the re-scoped AC-007 cell and the reconciled AC-004 row. - Recovery note: none; no iteration was stuck.

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
Continuity ladder: no handover.md and no implementation-summary.md at the phase parent; spec.md read. The ripgrep recipe over the target text returned exit 1 (clean no-hit).

spec.md summary: the phase parent removes OpenCode 1.x so OpenCode 2.3.2 is the only supported major, in three children: 001 runtime code and tests, 002 CI and package pins, 003 docs and playbooks. Binding operator decisions: major 1 resolves as unsupported; native deep-loop lineages (v1-only run --command deep/<loop>) are dropped with no replacement; the legacy session/message table branches in the session readers are removed; --pure text is removed from the deep-loop protocol docs. What stays: .opencode/plugins/lib/v2-bridge.js (only its v1-facing server key goes) and EVENT_ALIASES. Recorded blockers: phase 001 T004 live capture not run; phase 002 CI run needs a push go-ahead; phase 003 AC-004 needs a live deep-loop iteration or an ADR waiver.

resource-map.md not present; skipping coverage gate.

### Bounded Context Snapshot

Populate during initialization before the first review dimension runs. Keep this pointer-based and scoped to the declared review target:

- Target pointers: files, specs, symbols, or resource-map entries under review.
- Behavior claims: acceptance criteria, public contracts, or docs to verify.
- Reuse and conventions: existing patterns that define expected implementation shape.
- Review risks and gaps: stale graph or memory caveats, missing files, and out-of-scope areas.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use this snapshot only to seed review dimensions and final traceability.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 3 | Direct spec.md read closed the iteration-1 deferral: all four code-visible binding decisions hold, including the `--pure` ordering against the widened branch guard. |
| `checklist_evidence` | core | partial | 5 | Full sweep at iteration 5 over all AC rows in the three tables (9 + 8 + 11): 26 `Met` rows carry a printed command and a dated observed result, 001 AC-007 is `Superseded` under ADR-001, 002 AC-008 is openly `Unmet` pending the operator push. Two defects keep it partial: 001 AC-007's `.server(` check searches `.opencode/plugins/tests` only and cannot see the `.vibe` caller, and 003 AC-004 is `Met` in the table while `implementation-summary.md:130` says it is not met with no waiver written. |
| `skill_agent` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `agent_cross_runtime` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `feature_catalog_code` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `playbook_capability` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated during initialization from scope discovery]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| .github/workflows/opencode-v2-battery.yml | - | - | - | pending |
| .github/workflows/README.md | - | - | - | pending |
| .opencode/package-lock.json | - | - | - | pending |
| .opencode/package.json | - | - | - | pending |
| .opencode/plugins/ARCHITECTURE.md | - | - | - | pending |
| .opencode/plugins/lib/opencode-goal-core.js | - | - | - | pending |
| .opencode/plugins/lib/v2-bridge.js | correctness | 1 | none | reviewed |
| .opencode/plugins/opencode-goal.js | correctness | 1 | none | reviewed |
| .opencode/plugins/README.md | - | - | - | pending |
| .opencode/plugins/system-dist-freshness-guard.js | correctness | 1 | none | reviewed |
| .opencode/plugins/system-skill-advisor.js | - | - | - | pending |
| .opencode/plugins/system-spec-gate.js | correctness | 1 | none | reviewed |
| .opencode/plugins/system-speckit-completion.js | - | - | - | pending |
| .opencode/plugins/tests/classifier-injection-screen.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/decision-capture.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/env-secret-guard.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/mcp-route-guard.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/opencode-goal-capabilities.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/opencode-goal-continuation.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/opencode-goal-export-contract.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/opencode-goal-handover.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/opencode-goal-lifecycle.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/opencode-goal-render-parity.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/opencode-goal-state.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/opencode-goal-supervisor.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/opencode-goal-tool-path.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/plugin-inventory.json | correctness | 1 | none | reviewed |
| .opencode/plugins/tests/README.md | - | - | - | pending |
| .opencode/plugins/tests/session-cleanup.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/session-handover.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/sk-code-post-edit-quality.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/sk-git-message-gate.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/source-root-consumers.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/system-completion-sentinel.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/system-deep-loop-guard.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/system-dist-freshness-guard.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/system-skill-advisor.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/system-spec-gate.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/system-speckit-completion.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/v2-bridge.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/v2-hard-plugins.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/v2-registration.test.cjs | - | - | - | pending |
| .opencode/README.md | - | - | - | pending |
| .skilled/bin/lib/compiled-routing/013-live-activation/activation/cli-external-orchestration/manifest.json | - | - | - | pending |
| .skilled/bin/skilled-loop | correctness | 1 | DR1-P2-003 | reviewed |
| .skilled/bin/tests/opencode-compat-layout.test.cjs | - | - | - | pending |
| .skilled/bin/tests/opencode-config-shape.test.cjs | - | - | - | pending |
| .skilled/changelog/skilled/v4.1.0.0.md | - | - | - | pending |
| .skilled/commands/deep/assets/compiled/deep-research.contract.markdown | - | - | - | pending |
| .skilled/commands/deep/assets/compiled/deep-review.contract.markdown | - | - | - | pending |
| .skilled/commands/deep/assets/deep-research-presentation.txt | - | - | - | pending |
| .skilled/commands/deep/assets/deep-research.yaml | - | - | - | pending |
| .skilled/commands/deep/assets/deep-review-presentation.txt | - | - | - | pending |
| .skilled/commands/deep/assets/deep-review.yaml | - | - | - | pending |
| .skilled/commands/deep/assets/legacy/deep-review.body.markdown | - | - | - | pending |
| .skilled/commands/doctor/scripts/git-setup-check.cjs | - | - | - | pending |
| .skilled/commands/doctor/scripts/opencode-version-battery.cjs | - | - | - | pending |
| .skilled/commands/doctor/scripts/README.markdown | - | - | - | pending |
| .skilled/commands/doctor/scripts/tests/opencode-version-battery.test.cjs | - | - | - | pending |
| .skilled/commands/doctor/scripts/tests/README.markdown | - | - | - | pending |
| .skilled/CROSS-CLI.md | - | - | - | pending |
| .skilled/hooks/cli-dispatch/codex/codex-shell-tool.test.mjs | - | - | - | pending |
| .skilled/hooks/cli-dispatch/lib/dispatch-audit.mjs | - | - | - | pending |
| .skilled/hooks/cli-dispatch/lib/dispatch-audit.test.mjs | - | - | - | pending |
| .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs | correctness | 1 | none | reviewed |
| .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.test.mjs | - | - | - | pending |
| .skilled/hooks/cli-dispatch/lib/opencode-version-corpus.json | correctness | 1 | none | reviewed |
| .skilled/hooks/cli-dispatch/lib/opencode-version.mjs | correctness | 1 | DR1-P2-001, DR1-P2-002 | reviewed |
| .skilled/hooks/decision-capture/bin/sweep-opencode.mjs | correctness | 1 | none | reviewed |
| .skilled/hooks/decision-capture/bin/sweep-opencode.test.mjs | - | - | - | pending |
| .skilled/hooks/decision-capture/lib/capture-core.test.mjs | - | - | - | pending |
| .skilled/hooks/injection-contract.md | - | - | - | pending |
| .skilled/hooks/overlay-guard/tests/opencode-overlay-guard.test.mjs | - | - | - | pending |
| .skilled/hooks/session-cleanup/README.md | - | - | - | pending |
| .skilled/hooks/session-handover/runtime-behavior.md | - | - | - | pending |
| .skilled/hooks/session-handover/tests/adapter-conformance.test.cjs | - | - | - | pending |
| .skilled/hooks/session-handover/tests/session-handover-cli.test.cjs | - | - | - | pending |
| .skilled/hooks/session-handover/tests/skilled-loop-wrapper-claim-goal.test.cjs | - | - | - | pending |
| .skilled/hooks/session-handover/tests/skilled-loop-wrapper-harness.cjs | - | - | - | pending |
| .skilled/hooks/session-handover/tests/skilled-loop-wrapper-launch-arguments.test.cjs | - | - | - | pending |
| .skilled/hooks/session-handover/tests/skilled-loop-wrapper-model-effort.test.cjs | - | - | - | pending |
| .skilled/hooks/shared/hook-stdin-deadline.test.mjs | - | - | - | pending |
| .skilled/hooks/shared/session-readers/opencode.d.mts | - | - | - | pending |
| .skilled/hooks/shared/session-readers/opencode.d.mts.map | - | - | - | pending |
| .skilled/hooks/shared/session-readers/opencode.mjs | correctness | 1 | none | reviewed |
| .skilled/hooks/shared/tests/session-readers/fixtures.mjs | - | - | - | pending |
| .skilled/hooks/shared/tests/session-readers/opencode.test.mjs | - | - | - | pending |
| .skilled/package-lock.json | - | - | - | pending |
| .skilled/package.json | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-claude-code/references/claude-tools.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-devin/references/providers-and-models.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/assets/prompt-quality-card.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/assets/prompt-templates.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/changelog/v2.0.0.0.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/hard-rules.json | correctness | 1 | none | reviewed |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/agent-routing/context-leaf-agent.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/agent-routing/deep-research-agent-iterations.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/agent-routing/deep-review-agent-audit.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/agent-routing/general-agent-default.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/agent-routing/multi-ai-council-multi-strategy.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/agent-routing/orchestrate-agent-multi-agent.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/agent-routing/review-agent-security-audit.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cli-invocation/base-non-interactive-invocation.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cli-invocation/dir-flag-working-directory.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cli-invocation/file-attachment-via-f-flag.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cli-invocation/format-default-vs-json.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cli-invocation/pure-and-print-logs.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cross-repo-cross-server/attach-remote-server.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cross-repo-cross-server/cross-repo-dispatch.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cross-repo-cross-server/self-invocation-guard-nested.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/external-dispatch/from-claude-code.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/git-preflight-advisory/git-preflight-advisory.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/goal-hook/goal-hook.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/integration-patterns/memory-epilogue-handback.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/intra-routing-recall/cross-repo.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/manual-testing-playbook.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/multi-provider/variant-levels-comparison.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/parallel-detached/ablation-suite.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/parallel-detached/parallel-detached-session.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/parallel-detached/worker-farm-loop.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/classifier-injection-screen.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/cli-dispatch-audit.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/codex-hooks-watchdog.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/mcp-route-guard.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/opencode-goal.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/session-cleanup.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/sk-code-post-edit-quality.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/sk-git-message-gate.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/sk-git-preflight-advisory.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/system-completion-sentinel.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/system-deep-loop-guard.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/system-dist-freshness-guard.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/system-skill-advisor.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/system-spec-gate.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/system-speckit-completion.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/prompt-templates/minimax-design-context-manifest.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/prompt-templates/template-applied-to-real-dispatch.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/session-continuity/continue-last-session.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/session-continuity/fork-and-share.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/session-continuity/resume-by-session-id.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/stress/sandbox-permission.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/README.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/references/agent-delegation.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/references/context-budget.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/references/destructive-scope-violations.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/references/integration-patterns.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/references/opencode-tools.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/references/self-invocation-guard.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/ROUTER.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/default-model-id.test.cjs | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/opencode-models-form.test.cjs | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/opencode-setup-classify.test.cjs | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/feature-catalog/cli-dispatch-authorization/cli-dispatch-authorization.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/feature-catalog/feature-catalog.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/feature-catalog/opencode-version-dispatch/opencode-version-dispatch.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/cli-dispatch-audit-trail.md | - | - | - | pending |
| .skilled/skills/sk-code/manual-testing-playbook/plugins-and-hooks/post-edit-quality-router.md | - | - | - | pending |
| .skilled/skills/sk-code/sk-code-ci/references/ci-workflow-standards.md | - | - | - | pending |
| .skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md | - | - | - | pending |
| .skilled/skills/sk-code/sk-code-skilled/references/javascript/quality-standards/security-testing-and-exemptions.md | - | - | - | pending |
| .skilled/skills/sk-doc/manual-testing-playbook/agent-dispatch/markdown-agent-cli-opencode.md | - | - | - | pending |
| .skilled/skills/sk-git/references/worktree-workflows.md | - | - | - | pending |
| .skilled/skills/sk-git/scripts/lib/git-rule-checks.test.mjs | - | - | - | pending |
| .skilled/skills/system-deep-loop/deep-research/feature-catalog/feature-catalog.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/fanout-dispatch.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/exhausted-approach-respect.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/iteration-citation-jsonl.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/pause-sentinel-halt.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/resource-map-toggle.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/setup-yaml-handoff.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/spec-fence-writeback.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/fanout/fanout-native-sequential-research.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/manual-testing-playbook.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/deep-review/feature-catalog/feature-catalog.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/executor-selection-contract.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/fanout-dispatch.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/command-flow-stress-tests/leaf-only-nested-dispatch-refusal.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/command-flow-stress-tests/resource-map-coverage-gate.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/command-flow-stress-tests/setup-yaml-handoff.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/command-flow-stress-tests/synthesis-save-boundary.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/command-flow-stress-tests/three-artifact-iteration-contract.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/command-flow-stress-tests/write-boundary-reducer-owned-files.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/fanout-native-sequential-review.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs | correctness | 1 | none | reviewed |
| .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs | correctness | 1 | none | reviewed |
| .skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs | correctness | 1 | DR1-P2-002 | reviewed |
| .skilled/skills/system-deep-loop/runtime/scripts/README.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/tests/executor-audit-cli-branch-receipts.test.ts | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/tests/fanout-loop-prompt-in-process.test.ts | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/tests/fanout-review-focus.vitest.ts | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fanout.vitest.ts | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fixtures/adapter-suite.ts | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/shims/adapter-shim-core.cjs | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/combo-matrix.vitest.ts | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/executor-branch-contract.vitest.ts | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/lineage-timestamp-window.vitest.ts | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/opencode-dual-dispatch.vitest.ts | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/vitest.config.ts | - | - | - | pending |
| .skilled/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs | - | - | - | pending |
| .skilled/skills/system-deep-loop/shared/behavior-benchmark/tests/behavior-bench-run.test.cjs | - | - | - | pending |
| .skilled/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/opencode-plugin-bridge.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/opencode-plugin-bridge-stress.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/compiled-routing-consumption.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/skill-graph-diagnostic-redaction.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/system-skill-advisor-plugin.vitest.ts | - | - | - | pending |
| .skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-handover-loop.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/completion-evidence-sentinel.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/dist-freshness-guard.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-cleanup-plugin.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-handover-pi-opencode.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/speckit-completion-exposer.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-folder-literal-naming-cli-driven-slug.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-folder-literal-naming-remediation-rule.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/comment-hygiene-opencode-plugin.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/references/workflows/auto-mode-contract.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/generation-diagnostics.json | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/cli/tests/deep-review-auto-restart-contract.vitest.ts | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/data/trigger-index.json | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/tests/opencode-plugins-folder-purity.vitest.ts | - | - | - | pending |
| README.md | - | - | - | pending |
| SECURITY.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/acceptance-criteria.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/decision-record.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/description.json | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/graph-metadata.json | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/implementation-summary.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/plan.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/scratch/.gitkeep | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/scratch/after.txt | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/scratch/baseline.txt | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/scratch/consumers.txt | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/scratch/event-capture.txt | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/scratch/justified.txt | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/spec.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/tasks.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/acceptance-criteria.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/description.json | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/graph-metadata.json | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/implementation-summary.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/plan.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/scratch/.gitkeep | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/scratch/after.txt | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/scratch/gated-suites.txt | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/scratch/sdk-usage.txt | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/scratch/variant.txt | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/scratch/versions.txt | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/spec.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/tasks.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/acceptance-criteria.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/description.json | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/graph-metadata.json | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/implementation-summary.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/plan.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/deep-research-audit-ledger/frames/0000000000000001.frame | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/deep-research-audit-ledger/frames/0000000000000002.frame | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/deep-research-audit-ledger/frames/0000000000000003.frame | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/deep-research-audit-ledger/frames/0000000000000004.frame | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/deep-research-audit-ledger/frames/0000000000000005.frame | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/deep-research-audit-ledger/frames/0000000000000006.frame | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/deep-research-audit-ledger/frames/0000000000000007.frame | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/deep-research-config.json | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/deep-research-dashboard.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/deep-research-ledger/frames/0000000000000001.frame | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/deep-research-ledger/frames/0000000000000002.frame | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/deep-research-ledger/frames/0000000000000003.frame | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/deep-research-ledger/frames/0000000000000004.frame | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/deep-research-ledger/frames/0000000000000005.frame | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/deep-research-ledger/frames/0000000000000006.frame | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/deep-research-ledger/frames/0000000000000007.frame | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/deep-research-state.jsonl | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/deep-research-strategy.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/deltas/iter-001.jsonl | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/dispatch-receipts/dispatch-research-i1-g1.completion.json | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/dispatch-receipts/dispatch-research-i1-g1.intent.json | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/findings-registry.json | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/iterations/iteration-001.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/locks-and-fencing-v1/3068150e6d888ae96b4387058ce2a375a706fb9aa66f593dd212a4db0fd55ca6/coordinator-state.json | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/locks-and-fencing-v1/3068150e6d888ae96b4387058ce2a375a706fb9aa66f593dd212a4db0fd55ca6/grant-journal.jsonl | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/observability-events.jsonl | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/prompts/iteration-1.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/research.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/resource-map.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/.gitkeep | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/baseline.txt | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/changelog-baseline.txt | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/doc-inventory.txt | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/justified.txt | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/live-version.txt | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/live.txt | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/locations.txt | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/mac-cleanup.txt | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/spec.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/tasks.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/description.json | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/graph-metadata.json | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/spec.md | - | - | - | pending |
| specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/cli-external-orchestration/manifest.json | - | - | - | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.10 (stopPolicy max-iterations)
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-11-19T15:56:57.978Z, parentSessionId=2026-11-19T15:28:38.046Z, generation=2, lineageMode=restart
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: files
- Cross-reference checks: core=spec_code,checklist_evidence, overlay=skill_agent,agent_cross_runtime,feature_catalog_code,playbook_capability
- Started: 2026-11-19T15:56:57.978Z
<!-- MACHINE-OWNED: END -->

---

## 17. EXAMPLE (POPULATED)

Reference snippet showing a partially populated strategy file mid-review. Use this as a visual anchor when opening a live strategy doc.

```markdown
## 1. REVIEW CHARTER
- Target: .skilled/skills/system-deep-loop/deep-research (skill, v1.4.0)
- Dimensions: correctness, test-coverage, cross-runtime-parity, observability
- Stop conditions: rolling newInfoRatio < 0.08 for 2 iterations OR all dimensions converged OR max=7 reached
- Success criteria: zero P0 in correctness; test-coverage P0 resolved or deferred with rationale

## 4. NEXT FOCUS
- Dimension: test-coverage
- Files: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs, .skilled/skills/system-spec-kit/runtime/cli/tests/deep-research-contract-parity.vitest.ts
- Why: Iteration 2 surfaced a P0 (convergence-path coverage gap); needs a focused follow-up before correctness can terminate PASS.

## 9. COVERAGE MATRIX
| Dimension            | Status     | Iterations touched |
|----------------------|------------|--------------------|
| correctness          | converged  | 1                  |
| test-coverage        | converging | 2, 4               |
| cross-runtime-parity | converging | 3                  |
| observability        | converging | 4                  |
```
