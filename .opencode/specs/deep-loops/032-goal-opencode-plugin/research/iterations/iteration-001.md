# Iteration 001 — Establish Ground Truth & First-Pass Drift Map

- **Segment:** 1 | **Iteration:** 1 of 15
- **Mode:** research | **Target agent:** @deep-research (native LEAF)
- **Focus:** Read all 8 in-scope phase folders' `spec.md` (001–008) plus shipped `.opencode/plugins/mk-goal.js` and `.opencode/commands/opencode_goal.md`; produce a first-pass phase-by-phase drift map (planned vs shipped). **Phase 009 was NOT opened** (separate in-flight session).

---

## Focus

Establish ground truth for the `/goal` OpenCode plugin audit: what each of phases 001–008 *planned* (per `spec.md`) versus what *actually shipped* in `mk-goal.js` + `opencode_goal.md`. Output is a one-row-per-phase drift map plus the drift classes / open gaps discovered while reading.

---

## Actions Taken

1. Globbed the packet for all `*/spec.md` to confirm the 8 in-scope phases exist (and 009 is present but excluded).
2. Read shipped `.opencode/plugins/mk-goal.js` (lines 1–1243; **read was truncated at 50 KB**, so the tail — plugin export, `event()`/`tool()` registration, `experimental.chat.system.transform`, and the passive injection renderer — is **unverified** this iteration).
3. Read shipped `.opencode/commands/opencode_goal.md` (full, 83 lines).
4. Read all 8 in-scope phase `spec.md` files in parallel (001–008).
5. Cross-referenced planned deliverables (per-phase `spec.md` Deliverables / Requirements / Files-to-Change) against shipped code symbols.

**Read scope for this iteration = `spec.md` only.** `plan.md` / `tasks.md` / `checklist.md` for each phase were NOT read (deferred — insufficient tool budget). Findings marked `[spec-level]`; deeper verification deferred to later iterations.

---

## Findings

### A. First-Pass Phase-by-Phase Drift Map (`spec.md` planned vs shipped)

| Phase | Planned (spec.md) | Shipped (observed in code/cmd) | Drift Verdict |
|-------|-------------------|---------------------------------|----------------|
| **001 state-store** | per-session JSON; hex-keyed paths; atomic write (temp+fsync+rename+dir-fsync); `mutationQueues` serialize; fail-closed on missing session id; `readGoal`/`writeGoalAtomic`/`mutateGoal`/`setGoal`/`clearGoal` | All present & faithful: `ensureGoalStateDir` (mode 0o700), `goalPathForSession`+`sessionKeyForSession` (hex), `writeGoalAtomic` (temp→`handle.sync()`→`rename`→`fsyncDirectory`), `mutateGoal` (`mutationQueues` Map keyed by `stateDir:sessionKey`), `requireSessionID` throws `MISSING_SESSION_ID`. Bonus: `deleteGoalFile` added. | **MATCH** — faithful realization; slightly exceeds plan (harmless). |
| **002 injection-plugin** | `renderGoalInjection` → `[active_goal:<goalId>]`…`[/active_goal]` block; `appendGoalBrief` (dedupe by marker); `experimental.chat.system.transform`; fail-open; inject only when status `active` | Only `renderContinuationPrompt` (`[active_goal_continuation]` — a *different* continuation block) seen in-window. `renderGoalInjection` / `appendGoalBrief` / the transform hook live **post-line-1243 (truncated)**. | **PARTIAL — UNVERIFIED.** Cannot confirm/deny drift; high priority for iter 2. |
| **003 goal-command** | file `.opencode/commands/**goal.md**`; `mk_goal`+`mk_goal_status` tools; actions `set/show/clear/complete/pause`; `injection_preview` in status; `STATUS=OK ACTION=…` / `STATUS=FAIL ERROR=…` envelopes; state-free router | Shipped command file is `.opencode/commands/**opencode_goal.md**` (filename drift); `GOAL_ACTIONS=['set','show','clear','complete','pause']` matches; envelope contract matches; tool defs (`mk_goal`/`mk_goal_status`) post-truncation. | **DRIFT (filename).** Planned `goal.md` → shipped `opencode_goal.md`. Invocation namespace may have changed (e.g. `/opencode:goal` vs `/goal`). Needs confirmation a `goal.md` does/doesn't coexist. |
| **004 lifecycle-tracking** | `event()` switch; message-id dedupe; `budget_limited` on budget cross; assistant `lastEvidence` capture; `permission.asked`/`question.asked`→`blockedByPrompt`; `session.deleted`/`*.disposed` clear volatile locks | `recordMessageUpdated`, `accountUsage` (dedupe via `lastAccountedMessageID`), `budgetWasCrossed`→`budget_limited`, `refreshGoalActivity` (evidence via `extractAssistantEvidence`+`redactEvidence`), `setBlockedByPrompt` all present. Volatile-lock clear on `session.deleted`/`*.disposed` is in the unverified `event()` tail. | **MATCH (core).** Teardown-lock-clear deferred. |
| **005 completion-supervisor** | `maybeVerifyGoal`; `met`→`complete`+`completionSource=supervisor`; `blocked`→blocked; `not_met`/absent→stay active; redact evidence; manual=`manual` | `maybeVerifyGoal`, `runSupervisorVerifier`, `normalizeVerifierResult` (verdict clamp, absent→`not_met`), `redactEvidence`; `completionSource='manual'|'supervisor'` logic present; `verifierRunID` added. | **MATCH.** Note: production supervisor prompt/model wiring explicitly out-of-scope (planned open question). |
| **006 active-continuation** | `maybeContinueGoal`; default-off via `MK_GOAL_AUTONOMY`; ordered gates; hard caps (8 auto-turns, 30 min wall); `smoke`/`active` modes; JSONL `.continuation.log`+`.goal-events.log`; reserve-before-send | `maybeContinueGoal`, `reserveContinuationTurn` (reserve-before-send ✓), `continuationCapReason` (`auto_turn_cap_reached`/`wall_clock_cap_reached`), `CONTINUATION_LOG_FILENAME`, `GOAL_EVENTS_LOG_FILENAME` (debug-gated), `autonomyModeFromEnv`, `DEFAULT_MAX_AUTO_TURNS=8`, `DEFAULT_MAX_WALL_MS=30*60*1000`. | **MATCH (core).** Full ordered-gate enumeration needs complete `maybeContinueGoal` read (partially in-window). |
| **007 sk-prompt-enhancement** | `goalPrompt`+`promptEnhancement`; deterministic CRAFT/TIDD-EC; ≤4000 chars; preserve raw `objective`; CLEAR score ≥40; injection from enhanced prompt; no hidden LLM call | `buildEnhancedGoalPrompt`, `scoreEnhancedGoalPrompt`, `goalFocusHints`, `normalizeGoalPromptFields`; `PROMPT_ENHANCEMENT_FRAMEWORK='CRAFT+TIDD-EC'`, `METHODOLOGY='DEPTH'`, `PERSPECTIVES` array; `DEFAULT_MAX_GOAL_PROMPT_CHARS=4000`; raw `objective` preserved separately. CLEAR max = 9+9+13+9+4 = **44** (≥40 ✓, `reusability` fixed at 4). | **MATCH.** Deterministic (no LLM call) ✓. |
| **008 system-spec-kit-integration** | `references/hooks/goal_plugin.md`; `SKILL.md` routing; feature-catalog + playbook; `ENV_REFERENCE` `MK_GOAL_*`; non-bridge boundary | Cannot verify from code reads; the hook doc path is named as shipped in the audit brief. Doc-side existence/accuracy **unverified** this iteration (no doc reads performed). | **NEEDS CONFIRMATION — deferred** to a doc-reading iteration. |

### B. Drift Classes & Code-Discoverable Gaps (findings beyond the table)

- **[F-001, P2] Command filename drift.** Phase 003 spec mandates `.opencode/commands/goal.md`; shipped file is `opencode_goal.md`. Either (a) an intentional rename to fit OpenCode's namespaced command convention, or (b) the planned `goal.md` was never created / was renamed. Impact: discoverability of the `/goal` invocation path; spec-vs-disk inconsistency. *Confidence: confirmed filename; intent inferred.*
- **[F-002, P2] Phase-count metadata inconsistency.** Specs self-label "Phase 1–6 of 6" (001–006), but 007 declares "7 of 7", 008 declares "8 of 8". The packet actually has 9 phase children. Each late phase re-declared itself terminal. Metadata drift, not a code bug, but it muddies the handoff chain (e.g. 006's Successor=None yet 007 exists).
- **[F-003, P2] Possibly-dead status `usage_limited`.** `VALID_STATUSES` includes `usage_limited`, but in-window code only ever *sets* `budget_limited` (via `budgetWasCrossed`, `recordContinuationBudgetStop`, `markGoalStatus`). No production path was observed transitioning to `usage_limited`. Either dead enum, or set in the unverified tail. *Confidence: inferred from read window.*
- **[F-004, P1] Read truncation blinds 3 phases.** The 50 KB cap cut `mk-goal.js` at line 1243. Three deliverables are therefore **unverified at ground-truth level**: (1) phase 002 injection renderer + transform, (2) phase 003 tool registration, (3) phase 004/006 `event()` lifecycle + continuation wiring. This is the single largest threat to drift-map accuracy.
- **[OBS-001] Injection-char budget vs prompt-char budget.** `DEFAULT_MAX_INJECTION_CHARS=4800` > `DEFAULT_MAX_GOAL_PROMPT_CHARS=4000`. Continuation prompt clamps to injection budget; goal prompt clamps tighter. Likely intentional (injection carries extra framing lines) but worth a consistency check in a later iteration.
- **[OBS-002] Secret redaction is thorough.** `redactEvidence` masks `sk-…`, `gh[pousr]_…`, `xox[…]`, `AKIA…`, and generic `api_key=…`/`token=…`/`password=…`/`secret=…`. Matches phase 005 REQ-004 and exceeds it. Positive.
- **[OBS-003] Prompt-injection defense is layered.** `sanitizeInlineText`/`sanitizePromptText` neutralize role-labels (`system:`→`system-role:`), triple backticks, goal-marker injection, and "ignore previous instructions" phrases. Matches phase 002/007 risk mitigations.

### C. Confidence Notes
- "MATCH" rows are confirmed against in-window code symbols only; tail-region deliverables remain unverified (see F-004).
- 9 design forks (autonomy tier, scope/keying, state store, budget governance, completion detection, status set, surfacing substitute, command style, reuse vs standalone) — only partially cross-checkable this iteration; a dedicated design-synthesis-vs-shipped comparison is queued.

---

## Questions Answered

- [Q-ground] What is the high-level planned-vs-shipped state for phases 001–008? → **Answered at spec-level**: 5 of 8 appear faithful matches (001, 004-core, 005, 006-core, 007); 1 confirmed drift (003 filename); 2 unverified (002, 008).
- [Q-status-set] Does the shipped status enum match the design? → Partially. Enum = {active, paused, blocked, usage_limited, budget_limited, complete}. `usage_limited` write-path unconfirmed (F-003).

---

## Questions Remaining

- [ ] **F-004 follow-up:** Read `mk-goal.js` lines 1244+ to verify phase 002 injection (`renderGoalInjection`/`appendGoalBrief`/transform), phase 003 tool registration, and phase 004/006 `event()` wiring.
- [ ] **F-001 follow-up:** Confirm whether `.opencode/commands/goal.md` coexists with `opencode_goal.md`, and determine the actual `/goal` invocation namespace + whether spec 003 needs amending.
- [ ] **F-003 follow-up:** Trace every `status:` write to confirm whether `usage_limited` is ever set in production paths (or is dead).
- [ ] Verify phase 008 doc deliverables actually exist on disk (`goal_plugin.md`, catalog, playbook, `ENV_REFERENCE` `MK_GOAL_*`).
- [ ] Cross-check the 9 resolved design forks from `research_archive/2026-06-28-goal-design-synthesis/research.md` against shipped behavior (deferred to a dedicated iteration).
- [ ] Read `plan.md`/`tasks.md`/`checklist.md` per phase to find task-level drift (spec-level only this iteration).
- [ ] Examine the `mk-goal-*.test.cjs` suite to see whether tests cover the unverified tail and the flagged drifts.

---

## Next Focus

**Iteration 2 — Close the truncation blind spot and confirm the filename drift.** Read the *remainder* of `mk-goal.js` (line 1244 → EOF) to verify (a) phase 002 injection renderer + `experimental.chat.system.transform`, (b) `mk_goal`/`mk_goal_status` tool registration + `injection_preview`, (c) the `event()` lifecycle/continuation switch including `session.deleted`/`*.disposed` lock-clear and the `maybeContinueGoal` ordered-gate sequence. Then Glob `.opencode/commands/` to resolve F-001 (`goal.md` vs `opencode_goal.md`). Target resolving F-004 fully and F-001 before rotating to phase 008 doc verification. Do NOT open phase 009.
