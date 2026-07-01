# What Changed in the /goal OpenCode Plugin: The Full 032 Program

> Packet 032 turned a session-goal design into a shipped passive goal layer for OpenCode: durable per-session state, sanitized system-context injection, a thin `/goal` command router, lifecycle budget tracking, conservative idle-time completion, guarded continuation, prompt-quality enhancement, and system-spec-kit documentation integration. A dual deep-research and deep-review audit against the shipped state then produced a conditional verdict; five remediation phases closed every P1 finding, settled the twice-renamed command's final name, backfilled regression tests against real integration seams, wired a dormant status enum to a real provider-usage detector, and added a goal-state archive lifecycle. Phase 009 (a `/speckit:*` goal-prompt-offer integration) is owned by a separate, concurrently in-flight session and is intentionally excluded from this record.

---

## 1. STATE STORE

Phase 001 is the foundation. Every later phase depends on one durable, atomic per-session goal record.

**Before**

The active-goal feature had no durable store at all. Nothing persisted a session's objective across turns, there was no session-id validation, and there was no serialization guarantee against concurrent mutation.

**After**

`mk-goal.js` now persists one active goal per OpenCode session, keyed by a sanitized `hex(sessionID)`, writes JSON atomically via temp-file-then-rename, refuses missing session ids outright, and serializes mutations through an in-process queue so later phases can rely on a stable store.

**Impact**

Every later phase, injection, lifecycle tracking, completion supervision, continuation, and the remediation track, builds on this store without needing its own persistence layer or its own concurrency handling.

**Why**

A passive goal feature is only as trustworthy as its state. The phase shipped the store first, alone, so every later phase could assume atomic writes and session isolation rather than reinventing them.

## 2. INJECTION PLUGIN

Phase 002 is how the active goal reaches the model without making chat depend on persistence succeeding.

**Before**

There was no way to put the current goal into the assistant's system context. A session could store a goal but the model would never see it unless a human pasted it back in.

**After**

The plugin reads the current session goal and appends a sanitized `[active_goal]` block through OpenCode's `experimental.chat.system.transform` hook, on every turn, for active goals only.

**Impact**

The model now stays oriented toward the same objective across turns without the operator re-stating it, and the injection path degrades safely (no goal, no block) rather than erroring.

**Why**

Passive injection was chosen over an active per-turn prompt because it needed to work regardless of what the user was already doing in that turn, without inserting itself into the conversation as a visible message.

## 3. GOAL COMMAND

Phase 003 gives the feature a root command surface, later renamed twice (phase 011) but architecturally unchanged since this phase.

**Before**

The passive goal feature had no command a user could type. Setting, showing, clearing, completing, or pausing a goal had no entry point.

**After**

`/goal` is a thin router: it parses `$ARGUMENTS`, resolves to exactly one of `mk_goal` or `mk_goal_status`, and never reads or writes `.goal-state` directly. Session resolution, state mutation, status rendering, and the injection preview all live in the plugin tools, not the command markdown.

**Impact**

The command surface stays state-free by construction, which is what let phase 011 rename the file three times without touching a single line of plugin logic.

**Why**

Keeping command markdown thin and state-free was a deliberate boundary: OpenCode command files are prompt text, not code, so any state logic living there would be unreviewable and untestable in the same way the plugin's own functions are.

## 4. LIFECYCLE TRACKING

Phase 004 gives `/goal` enough runtime memory to govern token budgets and prepare verifier evidence.

**Before**

The plugin had no lifecycle memory. It could not track how much of a session's budget a goal had consumed, and it had no evidence to hand a future completion check.

**After**

The plugin observes OpenCode's `event` lifecycle, records assistant activity, charges token usage only when it is safe to do so, and marks a goal `budget_limited` once its configured cap is reached.

**Impact**

Later phases (completion supervision, continuation, and phase 013's `usage_limited` detector) all read from this same lifecycle-tracked state rather than each inventing their own usage accounting.

**Why**

Budget and evidence tracking needed to exist before a supervisor could reason about "has this goal used too much" or "what evidence supports completion," so this phase shipped the bookkeeping layer first.

## 5. COMPLETION SUPERVISOR

Phase 005 adds the conservative path that decides when a goal is actually done.

**Before**

There was no automatic completion path at all. A goal stayed active indefinitely unless a human cleared it.

**After**

On `session.idle`, a supervisor evaluates the last redacted evidence, stores the verifier's result, and completes the goal only when the verdict is exactly `met`. Any ambiguous or missing evidence keeps the goal active.

**Impact**

The plugin can now close out finished goals without a human remembering to clear them, while erring hard toward "stay active" rather than falsely declaring victory.

**Why**

A completion path that is wrong in the optimistic direction (marking something done that isn't) is worse than one that never fires, so the supervisor was designed to require an exact match rather than a best guess.

## 6. ACTIVE CONTINUATION

Phase 006 adds a guarded, default-off path that can keep working on a goal after idle-time verification says it is not yet met.

**Before**

There was no continuation mechanism. Even a confidently `not_met` verdict left the session simply idle, waiting on the human.

**After**

Continuation is default-off and gated: `MK_GOAL_AUTONOMY=smoke` logs a would-fire decision without ever prompting, and `MK_GOAL_AUTONOMY=active` calls `promptAsync` only after every gate passes (real session id, active unsuppressed goal, no in-flight continuation, no pending permission or question, idle status, cooldown elapsed, cap not exceeded, budget not exhausted).

**Impact**

An operator who wants autonomous continuation can opt in explicitly and smoke-test the decision path first; everyone else gets exactly the same passive behavior as before this phase.

**Why**

Autonomous re-prompting is the highest-risk capability in the whole packet, so it shipped behind the narrowest, most explicit gate in the design, not as an implicit consequence of the supervisor's verdict.

## 7. SK-PROMPT GOAL ENHANCEMENT

Phase 007 replaces the raw objective with a deterministic, structured prompt for the parts of the system that steer the model.

**Before**

`/goal set`'s injected text was the user's raw objective, unstructured and with no guarantee it would read as an effective instruction to the model.

**After**

The plugin now turns raw objective text into a deterministic sk-prompt-style `goalPrompt`, capped under 4000 characters, carrying DEPTH, CRAFT/TIDD-EC, RICCE (added in phase 010) and CLEAR score metadata. The raw objective is kept separately for status output and auditability; the enhanced prompt is what actually steers the model.

**Impact**

Injection now uses a genuinely structured instruction rather than whatever the user happened to type, while still preserving the original wording for a human to audit.

**Why**

Splitting "what the user said" from "what the model is steered by" meant the enhancement work could evolve (as it did again in phase 010's RICCE addition) without ever losing the raw objective as ground truth.

## 8. SYSTEM-SPEC-KIT INTEGRATION

Phase 008 makes the plugin discoverable and documented as a known system-spec-kit surface, without misrepresenting it as something it is not.

**Before**

The `/goal` plugin existed in the codebase but was invisible to system-spec-kit's own routing, catalogs, and references. An operator reading system-spec-kit's docs would have no way to find it.

**After**

`references/hooks/goal_plugin.md`, feature catalog entries, manual playbook scenarios, and `ENV_REFERENCE.md` rows now document the plugin, explicitly as a local OpenCode plugin, not a Spec Kit Memory MCP tool and not a daemon-backed CLI bridge.

**Impact**

Operators and future sessions working in system-spec-kit can now find, validate, and reason about the goal plugin through the same reference surfaces they already use for the memory, code-graph, and skill-advisor plugins, without confusing its actual architecture with theirs.

**Why**

The bridge-boundary distinction mattered enough to state explicitly because the other three plugins genuinely do route through daemon-backed CLIs; documenting `mk-goal` the same way would have been actively misleading, not just incomplete.

## 9. SECURITY AND CORRECTNESS FIXES

Phase 010 is the first of five remediation phases responding to a 15-iteration deep review's conditional verdict against the shipped 001-008 state.

**Before**

Verifier exception messages could leak into stored state and status output. The prompt-injection sanitizer was bypassable via bidi/homoglyph tricks and narrower instruction-override phrasing. The active-goal injection block could exceed its own configured character cap after the prompt subsection was already clamped. A stale verifier result could let continuation act on a goal that had since been replaced. `promptEnhancement` was missing the literal RICCE field phase 007's own acceptance criterion required.

**After**

Verifier exceptions now pass through `redactEvidence` before becoming stored or rendered text. The sanitizer normalizes with NFKC, strips bidi/invisible controls, and redacts broader instruction-override phrasing. `renderGoalInjection` clamps its final returned block, not just the prompt subsection. `maybeVerifyGoal` returns an explicit envelope that lets continuation detect and suppress on staleness or goal-id mismatch. `promptEnhancement` now includes the literal `ricce` field.

**Impact**

All five confirmed P1 findings closed with reproduced, pasted evidence rather than cited from a prior run, and the full six-file test suite stayed green before and after every edit.

**Why**

These fixes shipped code-only, with zero renames or doc changes, so the remediation track could isolate "is the plugin's own logic correct and safe" from the naming and documentation drift the later phases addressed separately.

## 10. COMMAND SURFACE NORMALIZATION

Phase 011 settles a command filename that had already been renamed twice with no doc sweep either time.

**Before**

`.opencode/commands/goal.md` (never actually shipped, per phase 003's original, never-realized mandate), then `opencode_goal.md`, then `goal_opencode.md` by a concurrent session, had left nine referencing surfaces potentially stale across phase docs, graph metadata, feature catalogs, and playbooks. `MK_GOAL_PLUGIN_DISABLED` still let manual mutations execute while claiming to disable the plugin. The command doc claimed unknown verbs fail, when dispatch actually coerced every input to `set`.

**After**

This phase reasoned from a `strings` search of the installed opencode binary (confirming no built-in `/goal` collision) and renamed to `goal.md`, then was amended same-day when the operator confirmed `goal_opencode.md` as final, matching the concurrent session's independent convergence. All nine surfaces were swept twice. `MK_GOAL_PLUGIN_DISABLED=1` now fails closed on manual mutations too. The doc's unknown-verb claim was corrected to match real coerce-to-set behavior, and `/goal set` output gained a `mutation=created\|refreshed\|replaced` field.

**Impact**

The command has one operator-confirmed name with zero current-state stale references anywhere in the repo, a config flag that means what it says, and set output that tells the caller what actually happened.

**Why**

An amendment that reverses this phase's own original conclusion was documented explicitly, in the implementation summary and the constitutional memory file, rather than silently rewritten, so the rename history stays legible instead of looking like an unexplained flip.

## 11. REGRESSION TEST BACKFILL

Phase 012 pins the corrected phase 010/011 behavior through the same public hooks OpenCode itself uses, not just internal helpers.

**Before**

Tests exercised helper functions like `renderGoalInjection` directly rather than the actual `experimental.chat.system.transform` hook. Seven event branches (`session.created`, `message.updated`, permission/question asked and replied, `session.deleted`, `.disposed`) had no coverage through the real `event()` entrypoint. The export contract was a truthy check, not a real pin. Nothing exercised `plugin.tool.mk_goal.execute` through the factory-registered path.

**After**

Tests now drive the real transform hook, the real `event()` dispatch for all seven branches, a real factory-registered tool call, an exact 15-key export-contract pin, and integration cases for smoke-mode idle logging and stale-verifier continuation.

**Impact**

A future regression in the actual OpenCode-facing surfaces, not just the internal helpers, will now be caught, including a reproduced red-before-green mutation check on the injection clamp fix from phase 010.

**Why**

A test suite that only calls internal helpers can pass while the real public entrypoints are broken; this phase closed that gap deliberately before declaring the security and normalization fixes durable.

## 12. DESIGN FIDELITY AND POLISH

Phase 013 wires a dormant status enum to real behavior and closes packet-wide metadata drift the earlier phases had accumulated.

**Before**

`usage_limited` was declared in `VALID_STATUSES` and documented as first-class but had zero production writers, a real design gap between what the enum claimed and what the code did. Phases 001-008 all carried the same placeholder `session_dedup.fingerprint`, universally failing the freshness gate. Phase 006 claimed 100% completion despite live idle-smoke behavior never being exercised end-to-end. `fsyncDirectory` silently swallowed every fsync failure.

**After**

The operator chose to wire a real detector over collapsing the enum: `recordMessageUpdated` now detects a provider 429 (`APIError` with `data.statusCode === 429`) and marks the goal `usage_limited`. Phases 001-008 now carry real computed fingerprints. Phase 006's completion is downgraded to 90% with the live-smoke gap disclosed. `fsyncDirectory` logs failures under `MK_GOAL_DEBUG=1` instead of discarding them silently.

**Impact**

`usage_limited` is now a status a goal can actually reach, packet-wide freshness checks stop universally failing on a shared placeholder, and phase 006's own claim now matches what was actually verified.

**Why**

This phase was scoped as design-fidelity work, closing gaps between what the packet claimed and what it actually did, rather than adding new capability, so the operator decision on the usage_limited fork mattered more than the implementation itself.

## 13. GOAL-STATE CLEANUP AND ARCHIVE

Phase 014 is the one phase in this program that did not originate from either audit; the operator flagged it mid-session as a gap neither review had caught.

**Before**

Goal state files accumulated indefinitely in the active `.goal-state/` directory. There was no archive path on session teardown and no recovery path for state orphaned by a session that crashed before deletion.

**After**

`session.deleted` now archives the session's state file via `rename` into `.goal-state/.archive/`, then prunes archive entries older than a configurable retention window. A throttled sweep on `session.created` catches orphaned active state past its own age threshold. Three new env vars (`MK_GOAL_STATE_ARCHIVE_RETENTION_DAYS`, `MK_GOAL_STATE_ACTIVE_RETENTION_DAYS`, `MK_GOAL_STATE_SWEEP_INTERVAL_MS`) control the windows.

**Impact**

`.goal-state/` now has a real lifecycle boundary instead of growing forever, and a crashed session's leftover state gets recovered on the next session start rather than sitting untouched.

**Why**

Archiving instead of deleting on teardown was the deliberate choice: it keeps the active directory clean while preserving teardown history for inspection, and piggybacking prune on every successful archive write avoided adding a separate scheduler.
