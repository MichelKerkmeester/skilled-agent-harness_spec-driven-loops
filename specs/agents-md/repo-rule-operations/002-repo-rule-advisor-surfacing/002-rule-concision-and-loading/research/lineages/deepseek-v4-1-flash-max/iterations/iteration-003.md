# Iteration 3: Hook dedup design

## Focus

Per `steer.md` iteration 3: "hook dedup design. Output: marker name, where it is stored, reset event, runtimes covered and not covered, each cited to the files above." `steer.md` re-read before this iteration (unchanged).

## Findings

### F17: Marker name and shape — reuse the directive-lifecycle delivery receipt, not the spec-gate session marker

The steer's constraint ("deliver a given rule at most once per compaction window, reset only on a compaction boundary") matches the directive-lifecycle receipt model:

- Receipt record (schema v2) fields: `directives` (the delivered payload text), `transcriptPath`, `transcriptHighWaterBytes`, `storeGeneration`, `lifecycleEpoch` [SOURCE: directive-lifecycle.ts:92-104 `nextRecord`; store validation in directive-lifecycle-store.py:166-186].
- Suppression condition: a proven same-content repeat — same generation, same epoch, same payload, same transcript path, transcript not shrunk, transcript bytes at or above the high-water mark [SOURCE: directive-lifecycle.ts:164-179; store `evaluate` in directive-lifecycle-store.py:246-273].
- Naming precedent if explicit fields are preferred: the spec-gate marker names its fields `questionDeliveredAtMs` / `questionDeliveredChannel` / `questionDeliveredCount` [SOURCE: spec-gate-core.mjs:352-354 `GATE_3_MARKER_FIELDS`, read at `gate3DeliveryMarker` line 364], so a rule-card analogue would be `ruleCardsDeliveredAtMs` / `ruleCardsDeliveredChannel` / `ruleCardsDeliveredCount`. But that marker is session-scoped with different reset events (F14), so it is the naming precedent only, not the reset model.

### F18: Where it is stored — three existing stores, one per delivery family

- **Durable store (Claude/Devin/Cursor/Codex family):** base directory `$SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR` or `tmpdir()/speckit-advisor` [SOURCE: directive-lifecycle-file-store.ts:45-52]; layout `directive-lifecycle/<sha256(cwd)[:12]>/<sha256(sessionId)[:16]>.json`, with `.generation.json`, `<hash>.epoch.json`, and `.poison.json` alongside [SOURCE: directive-lifecycle-store.py:19-24,58-77,189-196,229-243]. The store is directory-descriptor anchored and fails open to full delivery [SOURCE: directive-lifecycle-file-store.ts:4-6; injection-contract.md:64 "durable state: directive-lifecycle-file-store.ts plus directive-lifecycle-store.py"].
- **Pi:** in-process map under `globalThis[Symbol.for("mk.pi.directive-dedup")]`, keyed by session id [SOURCE: prompt-advisor.ts:114-129].
- **OpenCode:** in-process plugin state, `directiveEpochBySession` map with `advanceOpenCodeDirectiveBoundary` [SOURCE: .skilled/plugins/system-skill-advisor.js:228-246,416-420].
- Spec-gate alternative (if a session-scoped marker were chosen instead): per-session file at `.skilled/skills/.state/spec-gate/<session-key>.json` [SOURCE: spec-gate-core.mjs:71,802-803].

### F19: Reset event — compaction boundary, delivered by three converging signals

1. **Boundary event through registered owners.** The host bridge accepts `startup | resume | compact | clear | post-compact` [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/directive-lifecycle-boundary.ts:38-41], and the delivery decision forces full delivery on any lifecycle boundary [SOURCE: directive-lifecycle.ts:72-74,165]. The registered owners found in this checkout:
   - Claude: `session-prime.ts:215,222-225` notifies with the SessionStart `source` (startup/resume/compact).
   - Devin: `session-start.js` proxies session-prime; `post-compaction.cjs:110-131` spawns the bridge with `boundary: 'post-compact'`.
   - Cursor: `session-start.js:25` (startup) and `precompact.js:44` (compact) both call the bridge.
   - Codex: `session-start.js:26` (startup) plus the session-prime chain; PreCompact mirrors Claude's cache-then-advance chain [SOURCE: .codex/hooks.json:3,151; injection-contract.md:233].
2. **Transcript shrink.** `transcriptBytes < record.transcriptHighWaterBytes` forces full delivery [SOURCE: directive-lifecycle.ts:170] — compaction shrinks the transcript, so the receipt self-invalidates even with no boundary hook firing.
3. **Durable epoch advance.** `advanceDirectiveLifecycleBoundary` clears the session record and writes a fresh epoch [SOURCE: directive-lifecycle.ts:183-191; store.py:297-299]; a null session id invalidates every older record [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/directive-lifecycle-boundary.ts:5-6; cursor/codex call with `sessionId: null`]. This is the contract's "registered session/compaction owners advance the durable epoch through the boundary bridge" [SOURCE: injection-contract.md:64].

The measured justification for compaction as the reset point: re-reads concentrate there (104 after a boundary vs 1 within a window) [SOURCE: prep/evidence-pack.md §2].

### F20: Runtimes covered and not covered

| Runtime | Delivery of the advisor-style hook | Boundary/reset coverage | Verdict |
|---|---|---|---|
| Claude Code | `[SYS]` via `user-prompt-submit.js` → `additionalContext` [SOURCE: injection-contract.md:66] | SessionStart sources startup/resume/compact; PreCompact caches, advance lands at the next SessionStart [SOURCE: session-prime.ts:220-225; injection-contract.md:233] | Covered; transcript path documented [SOURCE: injection-contract.md:261] |
| Devin | `[SYS]`, same shim re-wrapped [SOURCE: injection-contract.md:66] | SessionStart proxy + PostCompaction bridge [SOURCE: session-start.js; post-compaction.cjs:110-131] | Covered; transcript evidence UNKNOWN |
| Codex | `[SYS]`, mirror of the Claude shim [SOURCE: injection-contract.md:66] | SessionStart mirror + PreCompact chain [SOURCE: .codex/hooks.json:3,151; codex session-start.js:26] | Covered; transcript evidence UNKNOWN |
| Cursor | Listed `[SYS]` via the same shim [SOURCE: injection-contract.md:66], **but** a live probe recorded that `beforeSubmitPrompt` never delivers and the spec-kit hooks on that event are dormant [SOURCE: injection-contract.md:100] | sessionStart + preCompact both advance the bridge [SOURCE: cursor session-start.js:25; precompact.js:44] | Reset covered; **delivery contradicted within the contract — treat as not covered pending a probe** |
| OpenCode | `[SYS]` via `experimental.chat.system.transform` [SOURCE: injection-contract.md:66] | Plugin epoch advance [SOURCE: .skilled/plugins/system-skill-advisor.js:416-420] | Covered (in-process mirror) |
| Pi | `[MSG]` — appended onto the visible prompt [SOURCE: injection-contract.md:66] | In-memory reset on `session_start` and `session_compact` [SOURCE: prompt-advisor.ts:222-227] | Covered; dedup state is process-scoped |

**The decisive caveat:** dedup suppression requires session identity plus transcript path and bytes; missing evidence keeps delivery full every turn [SOURCE: directive-lifecycle.ts:129-135; injection-contract.md:64 "Missing evidence, contention, insecure state, helper/platform failure, fallback policy, or any error also stays full"]. Which runtimes supply transcript evidence is UNKNOWN outside Claude; on any runtime that does not, the "at most once per window" guarantee is **not met by the existing machinery** — it degrades to full-every-turn delivery. A rule-card hook inherits this dependency exactly.

### F21: The dedup key today is whole-payload equality; "a given rule at most once" needs a delivered-set extension

The store suppresses only when the new payload equals the recorded `directives` text [SOURCE: store.py:257-265]. A card hook that injects different card subsets per event produces a different payload each time, so payload equality would not stop a card from being re-delivered when the matched set changes. Satisfying "a given rule at most once" per window requires the record to carry a delivered-card set (or one receipt per rule id) rather than a single payload string. This is new design work on top of the existing machinery, not a configuration of it. [SOURCE: store.py:246-273; directive-lifecycle.ts:164-179]

### F22: Bounded race and fail-open switches are inherited, with precedent accepting the harm

- Race window: "two mutations that start in the same session before either records its marker can both deliver, because the check and the write are separate steps across processes"; the spec-gate precedent accepts the double notice as harmless [SOURCE: spec-gate-core.mjs:345-351 comment]. For cards, a double delivery is duplicate text, the same bounded harm.
- Switches: master `SYSTEM_HOOKS_DISABLED` plus per-concern switch restore full behavior [SOURCE: injection-contract.md:20]; `SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP=0` restores always-full delivery [SOURCE: directive-lifecycle.ts:37-41].
- Fail-open direction: any uncertainty keeps the full delivery [SOURCE: directive-lifecycle.ts:4-6 module header; injection-contract.md:64].

## Sources Consulted

- `steer.md` (re-read; unchanged)
- `AGENTS.md:93-101,261`; `REPO RULES.md:12-18`
- `.skilled/hooks/injection-contract.md` (§2-§5)
- `.skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts`, `directive-lifecycle-file-store.ts`, `directive-lifecycle-store.py`; `hooks/pi/prompt-advisor.ts`; `.skilled/plugins/system-skill-advisor.js`
- `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs`; `runtime/hooks/claude/directive-lifecycle-boundary.ts`, `session-prime.ts`; `runtime/hooks/devin/post-compaction.cjs`, `session-start.js` (dist); `runtime/hooks/cursor/session-start.js` (dist), `.cursor/hooks/precompact.js`; `runtime/hooks/codex/session-start.js` (dist); `.codex/hooks.json`
- `../../001-advisor-surfacing/research/research.md` (spec-gate delivery precedent context)
- Commands: `grep`, `sed` (read-only)

## Assessment

- newInfoRatio: 0.8
- Novelty justification: the reset wiring is enumerated end to end for the first time — session-prime, post-compaction, Cursor precompact, Codex mirrors, OpenCode epoch map, Pi in-memory reset — plus two design deltas the machinery does not cover (delivered-set keying; transcript-evidence dependency outside Claude).
- Confidence notes: all wiring claims are file reads; transcript availability per runtime and live delivery status on Cursor are UNKNOWN (probe needed). The design proposal is grounded in the existing modules but has not been built.

## Reflection

- Worked: following the boundary bridge from `directive-lifecycle.ts` into the runtime hooks found the full owner set; checking registration by grep first looked like "not wired", but reading session-prime and post-compaction showed the bridge is called indirectly — the correction is itself evidence.
- Failed: no live probe was possible this session, so per-runtime transcript availability stays UNKNOWN; the design cannot claim the once-per-window guarantee on those runtimes.
- Ruled out: a plain session-scoped marker for the steer's window constraint (F14); whole-payload equality as sufficient for "a given rule at most once" (F21).

## Recommended Next Focus

Iteration 4 (per `steer.md`): one answer per part of the Question line — what should `AGENTS.md` always carry, what should Gate 5 load, and what role, if any, should a hook have — with the evidence for each and the finding that would change it.
