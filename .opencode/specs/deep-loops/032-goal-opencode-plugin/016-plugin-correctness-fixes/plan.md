---
title: "Implementation Plan: Phase 16: plugin-correctness-fixes"
description: "Fix the 12 audit defects and 3 contract mismatches in mk-goal.js in severity order — each fix landing with its regression test in the same task — then align goal_opencode.md with the live envelope."
trigger_phrases:
  - "goal plugin correctness fixes plan"
  - "mk-goal defect fix sequencing"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/032-goal-opencode-plugin/016-plugin-correctness-fixes"
    last_updated_at: "2026-07-03T00:00:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Authored plan from spec.md and the dossier's remedy shapes"
    next_safe_action: "Run the baseline test suite (Phase 1) before touching mk-goal.js"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/commands/goal_opencode.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "032-phase-016-plugin-correctness-fixes-20260703"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 16: plugin-correctness-fixes

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (ESM), Node.js, `@opencode-ai/plugin` |
| **Framework** | OpenCode plugin hooks (`event`, `experimental.chat.system.transform`, `tool`) |
| **Storage** | Flat-file JSON state under `.opencode/skills/.goal-state/` + JSONL logs |
| **Testing** | `node --test` over the 6 existing `.cjs` scripts in `.opencode/plugins/tests/` |

### Overview
Close all 15 section-A findings from the four-reviewer audit dossier against `.opencode/plugins/mk-goal.js` (1907 lines): 7 P2 defects (F1-F7), 5 P3 defects (F8-F12), and 3 command-doc contract mismatches (D1-D3). Fixes are surgical, in-place changes in severity order; no restructuring beyond what a fix requires.

**Invariant: every fix lands WITH its regression test in the same task.** Tests extend the existing 6 files in their current single-`main()` shape — the node:test subtest restructure comes later in phase 018 and picks up these new tests with everything else.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md, sourced from dossier §A)
- [x] Success criteria measurable (SC-001 through SC-005)
- [x] Dependencies identified (016 before 017; serial on mk-goal.js with 017/019/020)

### Definition of Done
- [ ] All acceptance criteria met (REQ-001 through REQ-009)
- [ ] Full 6-file suite green, fresh run pasted as evidence against the Phase 1 baseline
- [ ] checklist.md per-finding rows verified with evidence
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Targeted defect repair inside an existing single-file plugin. Every fix reuses machinery the plugin already has rather than adding new subsystems.

### Key Remedy Shapes (from the dossier, folded backlog items included)

- **F3 → existing `mutationQueues` (e-2.6)**: `archiveGoalStateFile` (847-865) and `sweepOrphanedActiveStates`' per-file archival (874-902) enqueue on the same per-session queue `mutateGoal` uses (key `` `${stateDir}:${sessionKey}` ``, 912-931). The archive rename then serializes against any queued `writeGoalAtomic`, so a deleted session can no longer resurrect a divergent active goal. The queued archive body must not call `mutateGoal` re-entrantly on the same key.
- **F5 → sanitizer hardening (e-2.7)**: the role-label prefix class in `normalizeUserAuthoredText` (199-202) widens from `(^|[\s\n>])` to a non-word-boundary class so punctuation-prefixed labels (`(system:`, `"system:`) are caught; a homoglyph folding map normalizes Cyrillic/Greek look-alikes in candidate role tokens before the check (NFKC at 192 does not fold them). While touching the same surface, `redactEvidence` (228-236) gains Bearer-token and JWT redaction patterns.
- **F1 → JSONL hygiene reusing `pruneArchive` (e-3.3)**: default-config always-hit gates in `maybeContinueGoal`'s `decision()` (1432-1437) skip or sample their log append; both `.continuation.log` and `.goal-events.log` get rotation/prune built on the existing `pruneArchive` age machinery (phase-014 cleanup only ever handled `.json` state files); entries gain `ts` and `goalId` (471-487 currently write neither).
- **F7 → label computed inside the mutator (e-1.5)**: `executeGoalAction`'s `set` branch (1668-1675) stops pre-reading the goal outside the queue; the mutator in `setGoal` (993-1016) returns/records the `created|refreshed|replaced` label from the state it actually transformed, and the same-objective-on-terminal-status path (998-999) reports `replaced` to match the `buildNewGoal` reality. Side benefit: halves the reads on the set path.
- **F2 → verification-lock pattern**: check-and-acquire of `inFlightContinuations` become adjacent before any await (the verification lock at 1806-1807 is the in-file precedent), replacing the has-at-1456 / add-at-1498 split.
- **F6 → bounded per-messageID map**: `accountUsage` (1074-1104) replaces the single `lastAccountedMessageID` slot with a bounded per-messageID last-accounted map and charges deltas, fixing both the undercount and the late-final recharge.
- **D1 → additive envelope field**: `failureLines` (1650-1657) gains `ACTION=<resolved action>`; existing `STATUS`/`ERROR`/`code` output stays byte-identical, honoring the `goal_opencode.md:35` contract per the dossier's recorded DECISION.

### Data Flow
No new I/O paths. Log rotation reads/renames files the plugin already owns; the F3 change reorders existing writes behind an existing queue; F10's whitelist changes what `normalizeStoredGoal` re-serializes, not where it writes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `normalizeUserAuthoredText` (mk-goal.js:191-207) | Sole sanitizer for user-authored text; role-label neutralizer + injection redaction | Update: non-word-boundary prefix class + homoglyph folding (F5) | Adversarial fixtures in mk-goal-state.test.cjs; existing whitespace-prefixed fixtures unchanged |
| `redactEvidence` (mk-goal.js:228-236) | Secret redaction for evidence strings | Update: add Bearer/JWT patterns (F5/e-2.7) | New redaction fixtures |
| `appendGoalJsonl` / `logContinuationDecision` / `logDebugEvent*` (mk-goal.js:471-505) | JSONL writers for both logs; no ts/goalId; F9's debug-only error gate | Update: ts+goalId fields, rotation hook, always-on event-error append (F1, F9) | Entry-shape + rotation + no-debug-error tests |
| `ensureGoalStateDir` (mk-goal.js:627-631) | mkdir-recursive on every append | Unchanged this phase (memoization is 017's e-1.6); F12 stops routing failed-dir logs through it with a wrong stateDir | Covered by F12 test |
| `normalizeStoredGoal` (mk-goal.js:652-707) | Read-path normalizer; spreads `...rawGoal` (670-671), passes `tokenBudget` through (678) | Update: whitelist known fields; re-validate numerics on read (F10) | Unknown-field round-trip + non-numeric tokenBudget tests |
| `fsyncDirectory` (mk-goal.js:752-769) | Post-write durability; failure log targets the failed directory (758-764) | Update: log to state root always (F12) | Archive-dir failure logging test |
| `archiveGoalStateFile` (mk-goal.js:847-865) | session.deleted + sweep archival; bypasses queue | Update: route through mutationQueues (F3/e-2.6) | Interleaving resurrection test |
| `sweepOrphanedActiveStates` (mk-goal.js:874-902) | 30-day orphan sweep; bypasses queue | Update: per-file archival enqueued (F3) | Same interleaving test, sweep order |
| `mutateGoal` / `mutationQueues` (mk-goal.js:904-931) | Per-session serialized mutation path | Unchanged — becomes the shared entry for archive/sweep | Existing queue tests still green |
| `setGoal` mutator (mk-goal.js:993-1016) | Create/refresh/replace decision incl. terminal-status path (998-999) | Update: emit mutation label from inside the mutator (F7/e-1.5) | Terminal-status-replaced + active-refreshed label tests |
| `accountUsage` (mk-goal.js:1062-1105) | Usage charging with single-slot dedupe (1078) | Update: bounded per-messageID map, delta charging (F6) | Interleaved-stream under/overcount tests |
| `reserveContinuationTurn` (mk-goal.js:1371-1394) | Auto-turn cap check only (1375-1391) | Unchanged in isolation — F2's atomic lock upstream removes the double-entry path | Concurrency test asserts single reservation |
| `buildPromptAsyncOptions` (mk-goal.js:1396-1409) | Applies `sanitizeInlineText` to `query.directory` (1397) | Update: path-appropriate validation, no text sanitizer (F8) | `user:`-segment and NFD-unicode directory tests |
| `maybeContinueGoal` (mk-goal.js:1418-1530) | Continuation gate chain; TOCTOU lock (1455-1458 vs 1498); gate logging (1432-1437) | Update: atomic lock acquire (F2); gate-log skip/sample (F1) | Concurrent-idle single-dispatch test; log-volume test |
| `goalStateLines` / `failureLines` (mk-goal.js:1602-1657) | Success envelope emits `mutation=` (1646); failure envelope lacks `ACTION` (1650-1657) | Update: `ACTION` added to failure envelope, additive (D1) | Tool-path envelope-shape test |
| `executeGoalAction` / `executeGoalStatus` (mk-goal.js:1659-1711) | Tool entry points; pre-read for label (1669-1674); per-call env re-eval via normalizeOptions | Update: drop label pre-read (F7); keep per-call env policy as the F11 reference behavior | Label tests; F11 flip test |
| `MkGoalPlugin` factory + `handleEvent` (mk-goal.js:1728-1878) | Factory-time `options.enabled` snapshot (1729) gates transform (1852) but not events (1752-1839); `event()` swallows errors (1842-1848) | Update: disabled = fully inert for events (F4); per-call env re-eval at the transform gate (F11); always-log event errors (F9) | Disabled-inertness state-dir test; mid-process flip test; error-log test |
| `.opencode/plugins/tests/mk-goal-*.test.cjs` (6 files) | Existing regression surface, all green pre-phase | Update: one regression test per finding, placed per the spec's Files-to-Change mapping | Full suite fresh run |
| `.opencode/commands/goal_opencode.md` | Published command contract (`:35` promises ACTION; no `mutation=`/env docs) | Update: document `mutation=` (D2) + env-behavior note (D3); contract line stays, code now honors it (D1) | Doc diff reviewed against live envelope output |

Required inventories:
- Same-class producers for the envelope change: `rg -n "STATUS=FAIL|failureLines" .opencode/plugins .opencode/commands` — confirm no second failure-envelope producer needs the ACTION field.
- Consumers of the envelope/label: `rg -n "mutation=|STATUS=FAIL|code=PLUGIN_DISABLED" .opencode --glob '*.md' --glob '*.cjs' -g '!node_modules'` — update any test or doc pinning the old failure shape.
- Algorithm invariant (F5): after folding+prefix widening, every `<role>:` token with role in {system, developer, assistant, tool, user} — whatever its prefix character or homoglyph spelling — rewrites to `<role>-role:`; benign non-role `word:` text is untouched. Adversarial cases: `(system:`, `"system:`, `>system:`, `ѕystem:` (Cyrillic), `sуstem:` (Cyrillic у), whitespace forms (existing), and no-op controls.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Baseline
- [ ] Run all 6 plugin test files fresh (`node --test .opencode/plugins/tests/mk-goal-*.test.cjs`), capture output as the regression baseline
- [ ] Re-confirm each finding's cited line ranges against the working tree before editing (dossier cites verified 2026-07-03)

### Phase 2: P2 Fixes F1-F7 (one fix + its regression test per task)
- [ ] F1 log growth/rotation/timestamps (REQ-001)
- [ ] F2 continuation lock TOCTOU (REQ-002)
- [ ] F3 archive/sweep through mutationQueues (REQ-003)
- [ ] F4 disabled = fully inert events (REQ-004)
- [ ] F5 sanitizer prefix class + homoglyph folding + Bearer/JWT redaction (REQ-005)
- [ ] F6 per-messageID usage accounting (REQ-006)
- [ ] F7 mutation label inside the mutator + terminal-status replaced (REQ-007)

### Phase 3: P3 Fixes F8-F12 (one fix + its regression test per task)
- [ ] F8 directory path validation (REQ-009)
- [ ] F9 always-log event errors (REQ-009)
- [ ] F10 stored-goal field whitelist + numeric re-validation (REQ-009)
- [ ] F11 single env-snapshot policy (REQ-009)
- [ ] F12 fsync-failure log target (REQ-009)

### Phase 4: D1-D3 Contract Alignment (code + doc)
- [ ] D1 `ACTION` in the failure envelope, additive, with envelope-shape test (REQ-008)
- [ ] D2 document `mutation=` in goal_opencode.md (REQ-008)
- [ ] D3 env-behavior note in goal_opencode.md (REQ-008)

### Phase 5: Full-Suite Verification
- [ ] Fresh full 6-file suite run, delta reported against the Phase 1 baseline, output pasted
- [ ] checklist.md per-finding rows marked with evidence; `validate.sh --strict` on this folder
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Regression (per fix) | One test per finding, landed in the same task as its fix, in the file owning the seam (continuation → F1/F2/F8; lifecycle → F3/F4/F6/F9/F11; state → F5/F10/F12; tool-path → F7/D1) | `node --test`, existing `.cjs` harness style |
| Adversarial table (F5) | Punctuation prefixes, homoglyph role tokens, Bearer/JWT strings, benign no-op controls | Same harness |
| Concurrency (F2, F3, F6) | Concurrent idle events; archive-vs-queued-mutation interleaving both orders; interleaved message.updated streams | Same harness, shared `runtimeState` fixtures |
| Full suite | All 6 files, fresh run, baseline delta | `node --test .opencode/plugins/tests/mk-goal-*.test.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Dossier sequencing: 016 lands before 017 | Internal ordering | Green (this phase is next in line) | 017's e-1.9 gate-logging skip would collide with F1's fix |
| Serial editing of mk-goal.js (016 → 017 → 019 → 020) | Internal ordering | Green | Concurrent phases would produce merge conflicts on one 1907-line file |
| Phase 015 (packet hygiene, docs-only) | Internal | Independent — no shared files | None |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: full-suite regression that a fix cannot resolve forward, or a queue-routing (F3) deadlock observed in continuation/lifecycle paths
- **Procedure**: `git checkout` the prior commit for `mk-goal.js`, the touched test files, and `goal_opencode.md`; per-finding tasks are individually revertable since each fix+test pair is one task. On-disk goal state needs no migration either way — the only schema change is additive fields (`ts`, `goalId`) on log entries, which old code ignores
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
