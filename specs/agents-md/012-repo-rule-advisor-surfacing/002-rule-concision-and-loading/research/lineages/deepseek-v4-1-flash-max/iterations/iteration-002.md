# Iteration 2: The five options, five fields each

## Focus

Per `steer.md` iteration 2: "the five options. Output: five entries, each with the five fields above, every field cited or UNKNOWN." The five fields: resident tokens; tokens per compaction window; silence condition; dedup mechanism and reset event; runtimes it reaches. `steer.md` was re-read before this iteration (checksum `eefddaadf0ed3570454ca2176622d152cdb2efb59b91a1968431917a0a086bea`; unchanged).

## Findings

### F9: Option 1 — status quo

| Field | Value |
|---|---|
| Resident tokens | `AGENTS.md` 27,012 B / ~6.8k tokens (16,384 B / ~4.1k as delivered in this Devin session). [SOURCE: F1; prep/evidence-pack.md §1] |
| Tokens per compaction window | Fixed loads: router ~3.0k once at first write [SOURCE: F2]; advisor brief ~65 tokens full at first turn and each boundary, ~14 deduped after [SOURCE: F5]; spec-gate notice ~138 once [SOURCE: F5]. Variable loads: 3-4 trigger-matched files ~6.2-8.2k per fire event [SOURCE: F3]; reply-time pair ~4.6k per substantive reply, ~7.3k with handoff at turn end [SOURCE: F4]. Per-window fire counts: UNKNOWN — no per-session log exists; the evidence base measures cross-session counts (per-rule reads 4-19; 104 boundary re-reads vs 1 within-window) [SOURCE: prep/evidence-pack.md §2]. |
| Silence condition | "Nothing fires → `AGENTS.md` alone governs" [SOURCE: REPO RULES.md:18]; read-only turns never fire Gate 5 [SOURCE: AGENTS.md:94]; the advisor brief never self-silences but reduces to the route line after proven delivery [SOURCE: injection-contract.md:64]; the spec-gate notice stays quiet after delivery until the gate re-opens [SOURCE: spec-gate-core.mjs:340-352 comment]. |
| Dedup mechanism and reset event | Model-side: "A file already in context is not re-read" [SOURCE: REPO RULES.md:14] — no mechanical marker for Gate 5. Hook-side: directive lifecycle suppresses the constant block only on a proven repeat (same directives, same transcript path, transcript not shrunk, same store generation + epoch) [SOURCE: directive-lifecycle.ts:121-180]; reset at lifecycle boundaries `startup/resume/compact/clear` [SOURCE: directive-lifecycle.ts:72-74,165] and on transcript shrink [SOURCE: directive-lifecycle.ts:170]. Spec-gate marker resets on gate re-open, resume trigger, or a failed answer bind [SOURCE: spec-gate-core.mjs:340-346 comment]. Measured reset concentration: compaction (104 vs 1) [SOURCE: F7]. |
| Runtimes it reaches | Resident doc: Claude (verified symlink `~/.claude/CLAUDE.md` → repo `AGENTS.md`), Devin (inherits root `CLAUDE.md`/`AGENTS.md` [SOURCE: .devin/SYNC.md:84]). Gate 5: model-driven, any runtime that can read files [SOURCE: AGENTS.md:98]. Advisor brief: six runtimes, Claude/Cursor/Devin/Codex `[SYS]`, OpenCode `[SYS]`, Pi `[MSG]` [SOURCE: injection-contract.md:66]. |

### F10: Option 2 — short rule cards resident in `AGENTS.md`, full text on demand

| Field | Value |
|---|---|
| Resident tokens | `AGENTS.md` grows by the card set. Measured bounds: index-summary form (the existing `REPO RULES.md` §3 summaries) totals 2,509 B, ~627 tokens; full card proxy (frontmatter + `Fires when` + `The rule`) totals 17,882 B, ~4.5k tokens, per-card 935-1,784 B [SOURCE: `sed`+`wc -c` on REPO RULES.md:58-72; python section parser over `.skilled/repo-rules/*.md`, both read-only measurements this session]. Exact drafted-card size: UNKNOWN. Precedent: `AGENTS.md:261` is already a resident pointer block naming five rules [SOURCE: AGENTS.md:261]. |
| Tokens per compaction window | Zero incremental per turn — cards are resident once. Full-text loads on demand cost the same as today's per-file reads, 1.4-3.0k tokens each [SOURCE: F3]. Whether the runtime re-delivers the rules block after a compaction: UNKNOWN (session-start recovery exists [SOURCE: injection-contract.md:209-215,229-235], but per-runtime re-delivery of the resident block is not measured). |
| Silence condition | Cards are always present; the full-text load is silent unless the model judges a card insufficient — model-mediated, no mechanical trigger. [SOURCE: design inference from AGENTS.md:261 pointer pattern; no enforcing gate exists] |
| Dedup mechanism and reset event | None needed for the cards themselves (single runtime delivery); "a file already in context is not re-read" covers full text [SOURCE: REPO RULES.md:14]. Reset: session/compaction reload — re-reads concentrate at compaction boundaries (104 vs 1) [SOURCE: F7]. |
| Runtimes it reaches | Runtimes that deliver `AGENTS.md` as memory: Claude verified, Devin inherits [SOURCE: .devin/SYNC.md:84; `ls -la ~/.claude/CLAUDE.md`]. Codex's global doc is a different file (`.codex/AGENTS.md`, 10,361 B, not the universal template) [SOURCE: `ls -la ~/.codex/AGENTS.md`; .codex/SYNC.md:33]; other runtimes UNKNOWN. |

### F11: Option 3 — Gate 5 loads cards not full files

| Field | Value |
|---|---|
| Resident tokens | 0 added to `AGENTS.md`. Cards live where Gate 5 reads: router (`REPO RULES.md` grows by +2,509 B to +17,882 B depending on form) or a card block inside each rule file (corpus total unchanged). Placement choice: design-dependent, exact UNKNOWN. [SOURCE: F10 measurements; REPO RULES.md:36-52] |
| Tokens per compaction window | Per fire event: matched cards only, 935-1,784 B each (~234-446 tokens), so a 3-4 match event costs ~0.7-1.8k tokens against today's ~6.2-8.2k for full files — about a 70-80% reduction of the load event at measured averages [SOURCE: F3 + this session's card measurement]. Full text on demand adds 1.4-3.0k per file only when opened [SOURCE: F3]. Fire count per window: UNKNOWN [SOURCE: prep/evidence-pack.md §2 covers cross-session counts only]. |
| Silence condition | No trigger match → nothing loads [SOURCE: REPO RULES.md:18]; read-only turns still skip Gate 5 [SOURCE: AGENTS.md:94]. |
| Dedup mechanism and reset event | Model-side "already in context" only; no mechanical marker exists for Gate 5 today [SOURCE: REPO RULES.md:14]. Reset: compaction boundary [SOURCE: F7]. |
| Runtimes it reaches | Same reach as Gate 5 today — model-driven file reads, no hook dependency, all runtimes that read files [SOURCE: AGENTS.md:98]. |

### F12: Option 4 — a hook injecting cards once per window

| Field | Value |
|---|---|
| Resident tokens | 0 — nothing resident beyond `AGENTS.md`. |
| Tokens per compaction window | One card delivery per matched rule per window: 935-1,784 B (~234-446 tokens) each; number of distinct matches per window: UNKNOWN. Machinery adds no context cost (process spawn per event) [SOURCE: injection-contract.md:79; card measurement this session]. |
| Silence condition | No action match; after first delivery the same window is quiet; master `SYSTEM_HOOKS_DISABLED` plus per-concern switch [SOURCE: injection-contract.md:20]. Fail-open: missing evidence, contention, or any error stays full delivery [SOURCE: injection-contract.md:64]. |
| Dedup mechanism and reset event | Directive-lifecycle machinery: suppression only on a proven repeat; full delivery forced by lifecycle boundary (`startup/resume/compact/clear`) and transcript shrink [SOURCE: directive-lifecycle.ts:72-74,165-179; store `evaluate` in directive-lifecycle-store.py:246-273]. Durable epoch advance via the boundary bridge [SOURCE: injection-contract.md:64]. Spec-gate marker precedent: `questionDeliveredAtMs` / `questionDeliveredChannel` / `questionDeliveredCount` [SOURCE: spec-gate-core.mjs:352-354], per-session state file [SOURCE: spec-gate-core.mjs:71,802-803], reset on gate re-open/resume/failed bind [SOURCE: spec-gate-core.mjs:340-346]. Pi-local: in-memory per-session map, reset on `session_start` and `session_compact` [SOURCE: prompt-advisor.ts:114-129,222-227]. |
| Runtimes it reaches | Delivery machinery exists on all six runtimes (advisor brief channels [SOURCE: injection-contract.md:66]; spec-gate channels [SOURCE: injection-contract.md:81]). Dedup proof requires session identity plus transcript path+bytes; without them delivery stays full every turn [SOURCE: directive-lifecycle.ts:133-135]. Which runtimes supply transcript evidence: Claude documented [SOURCE: injection-contract.md:261]; Devin/Cursor/Codex/OpenCode/Pi UNKNOWN (needs a live probe). |

### F13: Option 5 — load everything

| Field | Value |
|---|---|
| Resident tokens | `AGENTS.md` as today; the bulk is an on-demand load: 145,957 B total (~36.5k tokens) = 27,012 + 11,853 + 107,092 [SOURCE: `wc -c` this session; prep/evidence-pack.md §1 "about 146 KB, about 37k tokens"]. |
| Tokens per compaction window | 36.5k per load if loaded once per window; no mechanical dedup exists, so following the option literally can re-load per turn. UNKNOWN as designed. |
| Silence condition | None — the option loads everything unconditionally. |
| Dedup mechanism and reset event | Only the model-side "already in context" rule [SOURCE: REPO RULES.md:14]; reset at compaction [SOURCE: F7]. |
| Runtimes it reaches | Any runtime that can read files; no hook dependency. Practical ceiling: 36.5k tokens competes with working context in every runtime [SOURCE: prep/evidence-pack.md §1]. |

### F14: Only one existing mechanism matches the steer's reset constraint; the other is stricter but different

The steer's hook constraint is "deliver a given rule at most once per compaction window, reset only on a compaction boundary." The directive lifecycle satisfies the reset shape: compaction (transcript shrink, `compact` boundary event, epoch advance) is exactly its re-arm signal [SOURCE: directive-lifecycle.ts:72-74,165-179]. The spec-gate marker is session-scoped — it never re-arms within a session until the gate re-opens or a resume arrives [SOURCE: spec-gate-core.mjs:340-346] — which is stricter than "once per window" (zero re-delivery inside a window) but its reset events are not the compaction boundary. A rule-card hook wanting exactly the steer's semantics should copy the directive-lifecycle window model, not the spec-gate session model.

### F15: The 16,384-byte delivery cap constrains the resident-card options in at least this runtime

In this Devin session the resident block was truncated at 16,384 bytes (F1). A card set added to `AGENTS.md` beyond that cap would not reach the model in a truncating runtime: the option's resident additions compete with the file's tail for the same delivery budget. [SOURCE: F1; this session's rule block]

### F16: Card-size bounds are now measured; the drafted card remains UNKNOWN

Index-summary form: 2,509 B total (193 B/rule, ~48 tokens). Full card proxy: 17,882 B total, 935-1,784 B/rule. The true card size depends on the drafting pass (out of this lineage's scope), so both bounds are reported rather than a point estimate. [SOURCE: `sed`+`wc -c`; python section parser over `.skilled/repo-rules/*.md`]

## Sources Consulted

- `steer.md` (re-read before this iteration; checksum recorded)
- `prep/evidence-pack.md` (§1-§2)
- `AGENTS.md:93-101,261`; `REPO RULES.md:10-18,36-52,58-72`
- `.skilled/hooks/injection-contract.md` (§2-§4)
- `.skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts`, `directive-lifecycle-store.py`, `hooks/pi/prompt-advisor.ts`
- `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs`
- `.devin/SYNC.md:81-84`; `.codex/SYNC.md:33`; `ls -la` of `~/.claude/CLAUDE.md`, `~/.codex/AGENTS.md`
- Commands: `sed`/`wc -c` (index table 2,509 B), python section parser (card proxy 17,882 B), `shasum` (steer checksum) — all read-only

## Assessment

- newInfoRatio: 0.75
- Novelty justification: first consolidated five-option matrix with every field either cited or UNKNOWN, including the reset-semantics mismatch between the two dedup precedents (F14) and the measured card-size bounds (F16) that turn the "cards" options from vague into quantified ranges.
- Confidence notes: card bounds are structural proxies, not drafted cards; per-window fire counts and per-runtime transcript availability are UNKNOWN and flagged as such. All token figures use the ~4 B/token estimate.

## Reflection

- Worked: reusing iteration 1's measured paths instead of re-reading sources; splitting "resident tokens" from "per-window tokens" forced the truncation interaction (F15) into view.
- Failed: no per-window fire-count data exists anywhere in the evidence base; the matrix has to carry UNKNOWN in that field rather than a number.
- Ruled out: treating the spec-gate marker as a drop-in for the steer's reset constraint — its reset events differ (F14).

## Recommended Next Focus

Iteration 3 (per `steer.md`): hook dedup design. Output: marker name, where it is stored, reset event, runtimes covered and not covered, each cited to the files above.
