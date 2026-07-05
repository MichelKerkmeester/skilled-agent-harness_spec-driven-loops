# Four-Reviewer Audit Findings — Goal Plugin (2026-07-03)

> Working dossier for remediation phases 015-021 + 009. Source: four parallel read-only reviewers
> (plugin code, documentation surfaces, spec packet, speckit integration) run 2026-07-03.
> Every phase's spec/plan/tasks MUST trace its requirements back to finding IDs in this file.

Refresh note 2026-07-04: F4, F5, DOC-2, and e-2.2 were re-checked against live code/catalogs during phase 022 and are now marked RESOLVED below with current file-line evidence.

## Phase Allocation

| Phase | Findings covered |
|-------|-----------------|
| 015-packet-hygiene-and-narrative-integrity | PKT-1..PKT-15, DOC-1, DOC-2, VAL-1 |
| 016-plugin-correctness-fixes | F1-F12, D1-D3 (+ e-2.6, e-2.7, e-3.3 as remedy shapes) |
| 017-hot-path-optimization | e-1.1, e-1.2, e-1.3, e-1.4, e-1.6, e-1.7, e-1.8, e-1.10 |
| 018-test-architecture-restructure | TEST-1, TEST-2, e-2.10, e-2.11 |
| 019-code-refinements | e-2.1, e-2.2, e-2.3, e-2.4, e-2.5, e-2.8, e-2.9 |
| 020-capability-additions | e-3.2, e-3.4, e-3.5, e-3.6, e-3.7, e-3.8, e-3.9 (e-3.10 deferred) |
| 021-completion-verifier-wiring | e-3.1 (design-gated) |
| 009-speckit-command-goal-prompt-offer | INT-1, INT-2, INT-3 (build per existing handover design) |

Sequencing constraints: 016 before 017 (017's e-1.9 gate-logging skip coordinates with F1's fix;
e-1.5 is folded into F7's fix in 016). 016+017+019+020 all edit mk-goal.js — run serially, tests
green between phases. 018 (test restructure) after 016 so new regression tests get restructured once.

## A. Plugin code findings (target: .opencode/plugins/mk-goal.js, 1907 lines)

- **F1 | P2 | mk-goal.js:471-487, 1423-1437, 1814-1820** — Unbounded `.continuation.log` growth in
  default config. `maybeContinueGoal`'s `decision()` logs JSONL on every call including earliest
  gates (`plugin_disabled` 1432, `autonomy_disabled`/`autonomy_passive` 1434-1437) which run before
  any goal-existence check. Every `session.idle` from every session appends forever; phase-014
  cleanup handles only `.json` state files, never `.continuation.log`/`.goal-events.log`. Entries
  also lack timestamps (481-486). Remedy shape: skip/sample default-config gate logging + rotation/
  prune for both JSONL logs reusing pruneArchive age machinery + add ts/goalId to entries (merges
  backlog item e-3.3).
- **F2 | P2 | mk-goal.js:1455-1458 vs 1498** — TOCTOU on continuation in-flight lock:
  `continuationLocks.has()` (1456) separated from `.add()` (1498) by many awaits. Two concurrent
  `session.idle` events both pass the check, both reach `reserveContinuationTurn` (checks only
  auto-turn cap, not cooldown — 1375-1391), both fire `promptAsync` → duplicate auto-continuation +
  double turn-charge. Contrast: verification lock is race-free (has/add adjacent, 1806-1807).
- **F3 | P2 | mk-goal.js:847-865, 874-902** — `archiveGoalStateFile` and `sweepOrphanedActiveStates`
  bypass the per-session mutation queue (`mutationQueues` 912-931). `session.deleted` archive-rename
  can interleave with a queued `accountUsage`/`refreshGoalActivity` mutation whose `writeGoalAtomic`
  re-creates the state file after the rename → deleted session resurrects a divergent active goal
  until the 30-day sweep. Remedy shape: route archive + sweep through mutationQueues (e-2.6).
- **F4 | P2 | mk-goal.js:1752-1839 | RESOLVED 2026-07-04** — `MK_GOAL_PLUGIN_DISABLED=1` does not disable event-driven
  writes. Tools (1665), status (1702), injection (1852), continuation (1432) are gated, but
  `handleEvent` performs reads, usage-accounting writes, blocked-by-prompt writes, archive renames,
  directory sweeps regardless of `options.enabled`. Contract decision: disabled = fully inert.
  Current evidence: .opencode/plugins/mk-goal.js:2511-.opencode/plugins/mk-goal.js:2513 gates `handleEvent` on `eventOptions.enabled` before event reads, writes, sweeps, or archives.
- **F5 | P2 | mk-goal.js:199-202 (+192) | RESOLVED 2026-07-04** — Role-label neutralizer prefix class too narrow: regex
  requires `(^|[\s\n>])` so punctuation-prefixed labels survive (`(system: do X)`, `"system: ..."`).
  NFKC (192) does not fold Cyrillic/Greek homoglyphs (`ѕystem:` with Cyrillic ѕ bypasses). Existing
  test fixtures only cover whitespace-prefixed forms. Remedy: non-word-boundary prefix class +
  homoglyph folding map for role tokens; also extend `redactEvidence` (230-234) with Bearer/JWT
  patterns while touching it (e-2.7).
  Current evidence: .opencode/plugins/mk-goal.js:327-.opencode/plugins/mk-goal.js:343 folds role-token homoglyphs and rewrites punctuation-prefixed role labels with a Unicode-aware boundary.
- **F6 | P2 | mk-goal.js:1074-1104 (dedupe 1078)** — Usage accounting single-slot dedupe
  (`lastAccountedMessageID === messageID`) mis-charges under interleaved `message.updated` streams.
  Undercount: msg-1 partial charged, msg-1 final skipped as dup. Overcount: msg-1 charged → msg-2
  charged (slot=msg-2) → late msg-1 final re-charges full cumulative usage. Affects `budget_limited`
  enforcement (1090-1091). Remedy: bounded per-messageID last-accounted map, charge deltas.
- **F7 | P2 | mk-goal.js:1668-1675 + 996-1014** — `mutation` label computed from a read OUTSIDE the
  mutation queue (race → wrong label) AND deterministic mislabel: same objective on a goal in
  terminal status (`complete`/`blocked`/`budget_limited`/`usage_limited`) takes `buildNewGoal` path
  (998-999, new goalId, counters reset = semantically "replaced") but reports `mutation=refreshed`
  because only objectives are compared (1674). Remedy: compute label inside the mutator (e-1.5) +
  treat same-objective-on-terminal-status as replaced.
- **F8 | P3 | mk-goal.js:1396-1400** — `sanitizeInlineText` applied to a filesystem path in
  `buildPromptAsyncOptions`: NFKC + role-label rewrite + marker redaction on `query.directory`. A
  path containing `user:`/`tool:` segment or non-NFC unicode (macOS NFD) silently rewritten → wrong
  directory dispatched. Remedy: path-appropriate validation (resolve + existence), no text sanitizer.
- **F9 | P3 | mk-goal.js:1842-1848, 497-505** — `event()` swallows every error, logs only under
  `MK_GOAL_DEBUG=1`. Persistently corrupt state file silently disables the goal system for that
  session with zero operator signal. Remedy: always append event errors to `.goal-events.log`;
  console only under debug.
- **F10 | P3 | mk-goal.js:670-671, 678** — `normalizeStoredGoal` spreads `...rawGoal` first so
  unknown/tampered fields persist and re-serialize on every write; `tokenBudget` not re-validated
  on read — non-numeric hand-edited value silently disables budget enforcement (Number.isFinite
  false at 1049-1051). Remedy: whitelist known fields; re-validate numerics on read.
- **F11 | P3 | mk-goal.js:1729 vs 1662/1701** — Inconsistent env snapshot for disabled flag:
  transform gate (1852) uses factory-time `options.enabled`; tools re-evaluate `process.env` per
  call (via normalizeOptions 106). Mid-process flips half-apply. Remedy: one policy — re-evaluate
  per call everywhere.
- **F12 | P3 | mk-goal.js:758-764** — `fsyncDirectory` failure logging writes `.goal-events.log`
  into the directory that failed (`stateDir: directoryPath`) — archive-dir failures log inside
  `.archive/`; `appendGoalJsonl`→`ensureGoalStateDir` may mkdir a dir just removed (self-defeating
  during deletion races). Remedy: log to state root always.

### Command-doc contract mismatches (goal_opencode.md vs code)

- **D1** — goal_opencode.md:35 contract promises `STATUS=<OK|FAIL> ACTION=<...>` but failure
  envelope (mk-goal.js:1650-1657) emits `STATUS=FAIL ERROR="..." code=...` with no ACTION field.
  DECISION (low-blast, reversible): add ACTION to the failure envelope (additive, honors the
  published contract) rather than weakening the doc.
- **D2** — `mutation=` emitted (mk-goal.js:1646) but absent from goal_opencode.md's contract/output
  sections. Document it.
- **D3** — goal_opencode.md documents no env vars; `MK_GOAL_PLUGIN_DISABLED` fail-closed behavior
  (STATUS=FAIL code=PLUGIN_DISABLED) invisible. Add a brief env-behavior note.

### Test-architecture findings

- **TEST-1** — All 6 test files are monolithic single-`main()` scripts; `node --test` reports 1
  test per file; first assertion failure masks ~50 downstream scenarios per file. Convert to
  `node:test` subtests, behavior-preserving.
- **TEST-2** — Export-contract test pins the `__test` export but the packet narrative says
  "14 seams" while the live export has **15** (mk-goal.js:1889-1905). Pin all 15 names via deepEqual.

## B. Improvement backlog (from code reviewer, section e)

### e-1 Optimizations
1. `normalizeGoalPromptFields` (348-357) runs full `buildEnhancedGoalPrompt()` (sanitize + 7-regex
   CLEAR scoring) inside `normalizeStoredGoal` on EVERY readGoal → lazy/memoized rebuild only when
   fields missing.
2. `appendGoalBrief` (1581-1596) = readFile + parse + full normalize per chat message, no cache;
   no-goal sessions pay ENOENT round-trip each message → mtime-keyed cache incl. negative cache.
3. `normalizeOptions` (98-130) re-reads env + re-allocates per call; one setGoal chain calls it
   6+ times → normalize once per entry point, thread through.
4. `recordMessageUpdated` (1126-1140) runs TWO queued mutations per message.updated
   (refreshGoalActivity + accountUsage) = two full atomic write cycles each with file fsync + rename
   + dir fsync (778-801) → merge into one mutator; reconsider per-message dir-fsync durability.
5. (folded into F7) mutation label computed in mutator halves reads.
6. `ensureGoalStateDir` (627-631) mkdir-recursive on every write/append → memoize per stateDir.
7. `archiveGoalStateFile` calls `pruneArchive` on every archive (860) = readdir + per-file stat per
   session.deleted → throttle like the sweep (876-879).
8. `sweepOrphanedActiveStates` (889-892) parses every state file just for `updatedAtMs` →
   stat-mtime prefilter, parse only threshold candidates.
9. (coordinates with F1) `maybeContinueGoal` awaits a `.continuation.log` append on default-config
   always-hit gates (1432-1437) → skip/sample.
10. `goalStateLines` (1602-1647) renders full injection preview (a second complete
    renderGoalInjection pass) even where callers don't need it → lazy/action-scoped preview.

### e-2 Refinements
1. Extract `normalizeGoalID()` — `sanitizeInlineText(x,160).replace(/\s+/g,'-')` copy-pasted 6×
   (673, 1064, 1319, 1338, 1355, 1372; near-variant 448).
2. Collapse `recordContinuationReason`/`recordContinuationBudgetStop`/`recordProviderUsageLimit`
   (1318-1369) into one `patchGoalIfCurrent(sessionID, goalID, patch)`.
3. **RESOLVED 2026-07-04** Unify clocks — `nowMs()` (132-134), `retentionNowMs()` (820-823), raw `Date.now()` (877-878) —
   behind one injected clock.
   Current evidence: .opencode/plugins/mk-goal.js:265 is the only raw `Date.now()` occurrence, inside the `nowMs` fallback; grep `Date.now(` against .opencode/plugins/mk-goal.js returns only that line.
4. Explicit status-transition map for `markGoalStatus` (1029-1047) — currently accepts any
   VALID_STATUSES target from any state (complete→active resurrect representable).
5. Normalize `maybeVerifyGoal` envelope: early-return path (1228-1230) omits keys present in the
   applied path (1273-1279); downstream relies on undefined fall-through.
6. (folded into F3) route archive/sweep through mutationQueues.
7. (folded into F5) non-word-boundary role-label prefix + Bearer/JWT redaction patterns.
8. Name magic numbers: goal-id cap 160, objective-preview ratio 0.12 (1284, 1541), prompt-overhead
   1900 (290), clamp floors Math.max(3,…) (1564, 1576).
9. Document which duplicated status field is canonical — `tokens_used` vs `budget_tokens_used`,
   `usage_source` vs `budget_usage_source` (1628-1633) — in goal_plugin.md.
10. (→ 018) node:test subtests conversion.
11. (→ 018) dedupe `readContinuationEntries`/`restoreEnv` test helpers (continuation test 14-30,
    lifecycle test 23-59) into shared util.

### e-3 Additions
1. **(→ 021, design-gated)** Built-in supervisor verifier — `supervisorVerifier` is
   options-injectable only (128, 1197-1199); OpenCode loads plugins without options → verdicts
   permanently not-configured→`not_met`; goals can NEVER auto-complete in production; autonomy ends
   only via caps. Options: (a) LLM verdict via ctx.client, (b) structural/heuristic verifier from
   evidence, (c) hybrid: heuristic default + env-gated LLM. RECOMMENDATION: (c). OPERATOR SIGN-OFF
   REQUIRED before implementation (precedent: phase 013's F-003/F-014 fork).
2. `/goal history` from `.archive/` (records already complete JSON) — read-side only. Small.
3. (folded into F1) log rotation + timestamps.
4. Doctor/health subcommand — state-file count, archive count, log sizes, last-sweep time, orphan
   candidates (dir-walk code exists 874-902). Small.
5. `resume` verb — pause is one-way from command surface (goal_opencode.md:58, GOAL_ACTIONS :71);
   markGoalStatus can already set active; needs new action + clear continuationSuppressed. Small.
6. Token budget via command — tool accepts `tokenBudget` (1862) but goal_opencode.md never routes
   it; add `set <objective> --budget N`. Small.
7. Configurable autonomy caps — DEFAULT_MAX_AUTO_TURNS/DEFAULT_MAX_WALL_MS hardcoded (30-32) while
   char caps have env overrides (99-102); add envs + surface remaining budget in status. Small.
8. `usage_limited` auto-recovery — 429 payload carries retry-after that could schedule
   un-suppression (1354-1369, 1131). Medium.
9. Broader provider-limit detection — only `name==='APIError' && data.statusCode===429`
   strict-number (1131); accept string codes, other error classes, quota-message patterns. Small.
10. Multi-goal/goal-queue — DEFERRED by default (Medium/Large, design decision; every reader
    assumes single object). Document deferral in 020.

NOTE: new verbs/envs added by 020 REQUIRE doc updates: goal_plugin.md, ENV_REFERENCE.md, both
feature catalogs, both playbooks (the doc audit confirmed these surfaces are currently accurate —
keep them that way).

## C. Documentation findings (all surfaces otherwise verified ACCURATE 2026-07-03)

- **DOC-1** — hook_system.md:125 claims mk-goal lifecycle event handlers cover "compaction"; the
  plugin handles session.created/status/idle/deleted, message.updated, permission.*, question.*,
  *.disposed (1758-1837) — no compaction-specific event. Remove/qualify the word.
- **DOC-2 | RESOLVED 2026-07-04** — skill-advisor manual_testing_playbook.md:192 link TEXT reads
  `007-goal-opencode-plugin.md` while the file is `goal-opencode-plugin.md` (href resolves). Fix text.
  Current evidence: .opencode/skills/system-spec-kit/feature_catalog/18--ux-hooks/goal-opencode-plugin.md:60 and .opencode/skills/system-skill-advisor/feature_catalog/07--hooks-and-plugin/goal-opencode-plugin.md:62 list `mk-goal-export-contract.test.cjs` in the validation catalogs.
- (minor, optional with DOC work) skill-advisor feature catalog validation table (07--hooks-and-plugin/
  goal-opencode-plugin.md:58-66) omits mk-goal-export-contract.test.cjs from its test list.

## D. Spec-packet findings (032 bookkeeping)

- **PKT-1** — Three-way status disagreement, phases 010-013: spec.md metadata table says `Draft`
  (010:43, 011:43, 012:44, 013:44), impl-summary says Complete (or lacks a Status row: 011, 013),
  graph-metadata.json derived.status: draft. Fix: spec.md Status→Complete; add Status rows to 011/013
  impl-summaries; regenerate graph metadata (backfill script).
- **PKT-2** — 014 spec.md metadata table has NO Status row at all; impl-summary title carries
  scaffold marker `[template:level_1/implementation-summary.md]` (line 2) + generic trigger_phrases.
- **PKT-3** — 013 impl-summary retains template voice-guide comments (55-61, 94-98, 108-109) +
  generic trigger_phrases.
- **PKT-4** — Phase-count self-labels stale (research finding F-002, never closed): 007 spec.md:51
  "7 of 7", 008 spec.md:57 "8 of 8", 009 spec.md:54 "9 of 9", 010 spec.md:47 "10 of 13",
  011 "11 of 13", 012 "12 of 13", 013 "13 of 13" + 013 spec.md:50 "Successor: None (final phase)"
  contradicted by 014+. Durable fix: drop totals — "Phase N" only; fix 013's successor.
- **PKT-5** — Rename-history FALSEHOOD in narrative docs. Git truth: `goal.md` added c5087e0955 →
  renamed `goal_opencode.md` 4be33488ea → back to `goal.md` 303902e631 → `goal_opencode.md`
  8405ba4f57. `opencode_goal.md` was NEVER a committed path; goal.md WAS the shipped name.
  Locations repeating the false "opencode_goal.md → goal_opencode.md" story: 011
  implementation-summary.md:54,128; timeline.md:30 + §6; before-vs-after.md:193 (also claims
  goal.md "never actually shipped" — false). Also internal wobble: before-vs-after §3 says
  "renamed twice"/"three times" (49/61) vs §10 "twice" — git-verified count: 3 renames.
  Reference for correct lineage: constitutional/goal-prompting-runtime-specific.md.
- **PKT-6** — "Packet-wide" fingerprint overclaim: parent spec.md:185 phase-map row 13, root
  changelog 013 row, before-vs-after §12 say "packet-wide"; actual scope was phases 001-008
  (013 spec REQ-003). 26 files still carry `sha256:0000…` placeholders incl. parent spec.md:25,
  timeline.md:20, all 009 docs, 010-014 docs. Fix: correct the wording AND recompute real
  fingerprints for 009-021 using the same mechanism 013 used for 001-008 (read 013's
  implementation-summary for the mechanism).
- **PKT-7** — Dangling cross-references after review/research archival (commit 731291a833):
  010 spec.md:58,104 + tasks.md:108 cite `review/review-report.md §3 (DR-…)` — that path now holds
  the doc-staleness report; correct target: `review_archive/2026-07-01-plugin-implementation-review/
  review-report.md`. 011 tasks.md:120 and 012 tasks.md:116 cite `../research/iterations/…` F-series
  — correct target: `research_archive/2026-07-01-plugin-implementation-audit/…`.
- **PKT-8** — Orphaned finding F-015 (full goal_prompt embedded in injection vs design's "compact
  block"): no disposition anywhere. Verify: renderGoalInjection HAS a compact fallback
  (mk-goal.js:1568-1576) added by the DR-001 clamp fix → record "subsumed by DR-001 remedy" with
  that evidence in 015.
- **PKT-9** — DR-013-P1-001 (deep-review tooling scope) deferred with rationale in the archived
  report §9 but has NO tracking pointer anywhere. Add an explicit tracked-deferral note (parent
  spec or timeline) naming where it should be picked up (deep-loop-runtime track).
- **PKT-10** — Parent graph-metadata derived.status "complete" vs parent spec.md:47 "In Progress"
  (phase 9 pending) — regenerate parent graph metadata after doc fixes; also align phase-map row 9
  wording ("Pending" at spec.md:181 vs "in progress" at :47).
- **PKT-11** — timeline.md:84 claims doc-staleness findings "all fixed and independently
  re-verified" — false for DR-006-P2-001's phase-009 half (009 handover.md:95 still cites absent
  `.opencode/commands/goal.md`). Fix the handover ref (1 line) AND the claim becomes true; note it.
- **PKT-12** — 010 spec.md:43 `Status: Draft` + impl-summary Verification numbering skips "Step 2"
  (106→126) — cosmetic, fix while in file.
- **PKT-13** — 009-diagnostic-review folder not fully self-contained: its report cites
  `review/iterations/…` + `review/deltas/` as its artifacts but those now hold the doc-staleness
  audit's files. Add a pointer note in the diagnostic folder (or its report header) directing to
  the correct artifact locations.
- **PKT-14** — Parent spec.md phase map needs rows/statuses for 015-021 (create.sh appended rows —
  verify content quality) and updated statuses when phases close.
- **PKT-15** — 009's own P2 advisories from the diagnostic (D3-P2-001 "9 of 9" label — covered by
  PKT-4; handover goal.md ref — covered by PKT-11).

### Validator findings

- **VAL-1** — All five closed phases 010-014 FAIL `validate.sh --strict` (exit 2) solely from the
  `SECTION_COUNTS` warning ("spec.md has N sections, expected at least 25 for Level 1"). The Level-1
  minimum (25) is miscalibrated against the CURRENT lean core template (~8-9 H2 sections) — the
  same warning fires on freshly-scaffolded template output and on unrelated packets (reproduced on
  system-speckit/028 phases). Durable fix (in 015): recalibrate Level-1 (and check Level-2/3)
  minimums in `.opencode/skills/system-spec-kit/scripts/rules/check-section-counts.sh` to match the
  shipped templates' actual section counts, NOT pad docs. Check `scripts/tests/` for a threshold
  test to update. Cross-track note: this un-blocks strict gates in other packets too.
- **VAL-2** (found 2026-07-03 while authoring phase 016 docs) — The compiled validation orchestrator
  (`.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts:75`) hardcodes
  `OPTIONAL_TEMPLATE_ANCHORS = new Set(['affected-surfaces'])`, missing the Level-2 optional
  anchors (`nfr`, `edge-cases`, `complexity` in spec.md; `phase-deps`, `effort`,
  `enhanced-rollback` in plan.md) that the newer `template-structure.js` helper correctly treats
  as optional. Result: `ANCHORS_VALID` reports a false ERROR on every real Level-2 packet
  (reproduced on `.opencode/specs/anobel.com/002-link-card-button-and-mobile-animation` → 28
  anchor issues, and on 032/016's freshly-authored Level-2 docs). Durable fix (in 015, alongside
  VAL-1): align `OPTIONAL_TEMPLATE_ANCHORS` in orchestrator.ts with the template-structure
  optional-anchor set (single source of truth preferred), rebuild `mcp_server` dist, add a
  regression test pinning that a template-conformant Level-2 packet passes ANCHORS_VALID.

## E. Integration findings (speckit command surfaces)

- **INT-1** — The `/speckit:*` goal-prompt offer (phase 009's whole purpose) is NOT implemented.
  Zero goal references in any speckit router .md, workflow YAML, or presentation .txt
  (only coincidental "Goals clear?" scoring-factor hits at speckit_plan_auto.yaml:460,
  speckit_plan_confirm.yaml:490). The design exists in 009 handover.md §2.1/§3.2: offer in
  `*_presentation.txt` consolidated setup prompts, a `goal_prompt_choice` field
  (offer/skip/set semantics) across 8 workflow assets, `mk_goal`/`mk_goal_status` added to speckit
  router allowed-tools, mk_goal called only on explicit `set`. Build per that design. Ownership:
  originally another session; verified stale 2026-07-03 (no live processes, last content edit
  2026-07-01 06:50) — taken over by this program; note the takeover in 009's docs.
- **INT-2** — 009's spec.md/plan.md/tasks.md/implementation-summary.md are 100% unfilled scaffolds
  (completion_pct: 0, `[What is broken…]` placeholders). Author them properly (spec from the
  handover design + this dossier; keep handover.md as historical input, fix its :95 stale ref per
  PKT-11).
- **INT-3** — No test pattern exists for command-surface contracts (presentation .txt / YAML
  assets). When 009 ships, add a contract test (grep-shaped, like mk-goal-export-contract.test.cjs)
  pinning: offer text present in the presentation contracts, goal_prompt_choice field present in
  the 8 YAML assets, allowed-tools lines on the routers, and correct live command/tool names.

## F. Verified-good (do not re-flag)

- All 26 phase 010-014 capability claims confirmed live in code with line citations.
- All 6 plugin test files pass fresh (2026-07-03).
- Plugin registration correct (convention auto-load, default-export-only satisfied at :1728,
  tools registered :1857/:1869).
- All 10 documentation surfaces + repo-wide sweep ACCURATE vs live code (2026-07-03).
- ENV_REFERENCE.md complete: exactly 10 MK_GOAL_* vars, defaults match code.
- Every DR-series and doc-staleness P1 finding has a verified closure trail with pasted evidence.
- deriveStatus false-complete tooling bug fixed repo-wide (028 phases 010-012).
