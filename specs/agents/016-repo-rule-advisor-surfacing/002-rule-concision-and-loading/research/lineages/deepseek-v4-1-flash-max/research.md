---
title: "Research: repo rule loading design (AGENTS.md, Gate 5, hook)"
description: "Single cli-devin lineage (deepseek-v4-1-flash-max), four forced iterations on the loading-design question: AGENTS.md carries binding clauses and pointers; Gate 5 loads router plus matched rule cards with full text on demand; no hook now, with a named future design. Every claim cites file:line or a prep/ measurement; unmeasured figures marked UNKNOWN."
trigger_phrases:
  - "repo rule loading design"
  - "gate 5 cards"
  - "rule card hook once per window"
  - "agents md always carry"
importance_tier: "important"
contextType: "research"
---

# Research: repo rule loading design (AGENTS.md, Gate 5, hook)

<!-- ANCHOR:deep-research-rule-loading-design -->

## 1. VERDICT

**AGENTS.md should always carry binding clauses and pointer lines, never full rule text. Gate 5 should load the router plus matched rule cards, with full text on demand. No hook should be built now; if a measured need appears, the directive-lifecycle window model is the right machinery with two named extensions.**

- **AGENTS.md: clauses + pointers.** The clauses that bind even when nothing else loads stay; rule text stays out, pointed at the way `AGENTS.md:261` already points at the five reply-time rules. The resident doc must stay inside the guaranteed delivery budget — the smallest sourced cap is Devin's 16,384 bytes (observed), where the cut ends mid-line 175 and drops §5-§10, so the §8 pointer line (261) and §10 mandates (281, 285) currently fall outside and would need to move up or compress (F1, F15, F28).
- **Gate 5: router + cards.** Keep the action-keyed trigger and the "nothing fires" silence (`REPO RULES.md:12,18`); load the matched rules' cards (binding sentence + `Fires when`) instead of full files; open the full file on demand. Measured bounds: cards are 935-1,784 B each; a 3-4 match event drops from ~6.2-8.2k tokens to ~0.7-1.8k, about a 70-80% reduction of the load event (F11, F16).
- **Hook: deferred, narrow if ever built.** The only existing mechanism whose reset matches the steer's constraint ("at most once per compaction window, reset only on a compaction boundary") is the directive-lifecycle receipt; compaction resets are wired on all six runtimes (F14, F19). But suppression requires transcript evidence and otherwise delivers full every turn (F20), and "a given rule" needs a delivered-set key the machinery lacks (F21). No measured Gate 5 miss rate exists, and 022's rule is to measure before building (`../../001-advisor-surfacing/research/research.md` §1, §5; `specs/hooks/022-smart-rule-injection/decisions.md:33-36`).

This lineage answered only the steer's loading-design question; the concision playbook (per-rule compression targets) is other lineages' scope.

---

## 2. QUESTION AND METHOD

Question (from `steer.md`): what should `AGENTS.md` always carry, what should Gate 5 load, and what role, if any, should a hook have? Constraint: deliver a given rule at most once per compaction window, reset only on a compaction boundary. Options under test: status quo; resident cards; Gate 5 cards; hook cards; load everything.

Method: one `cli-devin` lineage (`deepseek-v4-1-flash-max`), four forced iterations (`stopPolicy: max-iterations`), `steer.md` read before every iteration, all writes inside `research/lineages/deepseek-v4-1-flash-max/`, read-only on the repository. Every iteration produced `iterations/iteration-NNN.md` + `deltas/iter-NNN.jsonl`; the state log carries four iteration records. The lead revised `steer.md` mid-run (Runtime caps section, measured fire count, must-carry clause lines); iteration 4 was executed against the revised text and carries a revision note.

| Iteration | Focus | newInfoRatio | Findings |
|---|---|---|---|
| 1 | Current load paths and costs | 0.85 | F1-F8 |
| 2 | Five options, five fields each | 0.75 | F9-F16 |
| 3 | Hook dedup design | 0.80 | F17-F22 |
| 4 | Answers per part of the Question line (+ revised-steer Runtime caps) | 0.70 | F23-F29 |

---

## 3. THE LOAD PATHS (measured)

| # | Path | Trigger | Bytes | Tokens (~4 B/tok) | Citation |
|---|------|---------|-------|-------------------|----------|
| 1 | `AGENTS.md` | Session rules block | 27,012 (16,384 as delivered here) | ~6.8k (~4.1k delivered) | F1; `wc -c`; this session's rule block |
| 2 | `REPO RULES.md` | Gate 5, first write | 11,853 | ~3.0k | F2; `AGENTS.md:93-97` |
| 3 | Trigger-matched rules | Gate 5 step 3, per action | 5,644-11,823 each; ~24.7-33.0k per 3-4 fire | ~6.2-8.2k per event | F3; `REPO RULES.md:12-17` |
| 4 | Reply-time five | Before substantive reply / turn end | 42,811 all; 18,340 mandatory two | ~10.7k / ~4.6k | F4; `AGENTS.md:261` |
| 5 | Advisor brief | Every prompt; directive deduped | ~261 full / ~54 deduped | ~65 / ~14 | F5; `injection-contract.md:64` |
| 6 | Spec-gate notice | First non-exempt write | 551 (+173 deferral) | ~138 | F5; `spec-gate-core.mjs:162-170` measured |
| 7 | Session-start / compaction recovery | SessionStart / PostCompaction | UNKNOWN | UNKNOWN | `injection-contract.md:209-235` |

Measured context for the design: reading a rule does not measurably change most prohibitions it forbids (`prep/evidence-pack.md` §3); re-reads concentrate at compaction boundaries, 104 vs 1 within a window (§2); 14 of 44 sessions read any rule via `Read` (undercount, §2).

### Runtime caps on the instruction file (per the revised steer)

| Runtime | Instruction file | Cap | Source |
|---|---|---|---|
| Claude Code | `CLAUDE.md` (here the user-level symlink to `AGENTS.md`) | No hard cap; loaded in full regardless of length; advisory "target under 200 lines"; 200-line/25 KB caps apply to auto-memory `MEMORY.md` only | External doc: code.claude.com/docs/en/memory |
| Codex | `AGENTS.md` chain root → cwd, concatenated | 32,768 B default (`project_doc_max_bytes`), cumulative, silent truncation; local config has no override | External doc: developers.openai.com/codex/guides/agents-md; openai/codex constant |
| Devin | Root `CLAUDE.md`/`AGENTS.md` surfaced | 16,384 B observed in this session; no config key found | Observed; cli-devin SKILL.md:290 documents surfacing only |
| Cursor | `.cursor/rules/*.mdc` (plain `.md` ignored) | No enforced cap sourced; advisory 500 lines; 1k-char prerelease warning reported as a visual bug; hard cap UNKNOWN | External doc: cursor.com/docs/rules.md; forum.cursor.com |
| OpenCode | `AGENTS.md` (V2) | No byte guard — entire file injected every loop; effective cap = context window; nested dedup while in history, re-injection possible after compaction | External doc: opencode.ai/v2/docs/instructions; opencode issue #18037 |
| Pi | `AGENTS.md`/`CLAUDE.md` global + parents + cwd, concatenated | UNKNOWN — no byte cap documented | External doc: github.com/earendil-works/pi (usage.md) |

Smallest sourced cap: Devin's 16,384 B, whose cut ends mid-line 175 of `AGENTS.md` — dropping the rest of §4 and all of §5-§10, including the §8 reply-rule pointer line (261) and the §10 mandates (281, 285). Codex's 32 KiB default cuts later (~line 250-260 by arithmetic; not measured).

---

## 4. THE FIVE OPTIONS (five fields each)

| Option | Resident tokens | Per-window tokens | Silence | Dedup + reset | Runtimes |
|---|---|---|---|---|---|
| 1 Status quo | ~6.8k (~4.1k delivered) | Fixed ~3.0k + ~65 + ~138; variable ~6.2k (median 3 rules) to ~14.4k (p90 7) per loading window; 93/265 windows load any rule | Nothing fires → `AGENTS.md` alone | Model-side "already in context"; hooks mechanical; compaction resets | Resident: Claude, Devin verified; brief: six |
| 2 Resident cards | +2,509 to +17,882 B | 0 incremental; full text 1.4-3.0k/file | Cards always present; load model-mediated | None needed for cards; reset at compaction | Verified delivery Claude + Devin; cap risk (F15) |
| 3 Gate 5 cards | 0 | ~0.7-1.3k per load (median 3 cards) to ~1.6-3.1k (p90 7); ~70-80% less; full text on demand | No trigger match → nothing | Model-side only; reset at compaction | Every runtime Gate 5 reaches |
| 4 Hook cards | 0 | ~820-1,560 tokens in the 35% of windows that load; ~290-550 averaged across all windows | No match + post-delivery suppression + kill switches | Directive lifecycle (window-scoped) or spec-gate marker (session-scoped) | Machinery on six; dedup proof needs transcript evidence, UNKNOWN outside Claude |
| 5 Load everything | `AGENTS.md` as today | 36.5k per load | None | Model-side only; reset at compaction | Any file-reading runtime |

---

## 5. THE HOOK DESIGN (if ever built)

- **Marker:** the directive-lifecycle receipt, schema v2 (`directives`, `transcriptPath`, `transcriptHighWaterBytes`, `storeGeneration`, `lifecycleEpoch`), suppression only on a proven same-content repeat (`directive-lifecycle.ts:92-104,164-179`; store `evaluate` in `directive-lifecycle-store.py:246-273`). The spec-gate field naming (`questionDeliveredAtMs`/`Channel`/`Count`, `spec-gate-core.mjs:352-354`) is the naming precedent only — its session-scoped resets do not match the constraint (F14).
- **Storage:** durable store at `$SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR` or `tmpdir()/speckit-advisor/directive-lifecycle/<project-hash>/<session-hash>.json` with `.generation.json`, `<hash>.epoch.json`, `.poison.json` (`directive-lifecycle-file-store.ts:45-52`; `directive-lifecycle-store.py:19-24,58-77,189-196`); Pi in-memory map (`prompt-advisor.ts:114-129`); OpenCode epoch map (`.skilled/plugins/system-skill-advisor.js:228-246,416-420`).
- **Reset:** compaction boundary via three converging signals — boundary events from registered owners (session-prime at SessionStart sources; Devin post-compaction; Cursor precompact; Codex mirrors; boundary enum `startup|resume|compact|clear|post-compact`), transcript shrink, and durable epoch advance (`directive-lifecycle.ts:72-74,165,170,183-191`; `session-prime.ts:220-225`; `post-compaction.cjs:110-131`; `.cursor/hooks/precompact.js:44`; codex `session-start.js:26`).
- **Coverage:** all six runtimes have delivery and reset wiring; Cursor's prompt-time delivery is contradicted within the contract (a live probe recorded `beforeSubmitPrompt` dormant, `injection-contract.md:100` vs the channel table `:66`) — treat as not covered pending a probe. On runtimes without transcript evidence, the current suppression gate never engages and delivery stays full every turn (`directive-lifecycle.ts:129-135`), so the once-per-window guarantee is unmet there by existing machinery.
- **Two build deltas:** a delivered-set key so "a given rule" dedups per rule, not by whole-payload equality (F21); a boundary-epoch-only suppression variant for transcript-less runtimes (F20, F25).

---

## 6. THE ANSWERS PER PART (with falsifiers)

1. **What `AGENTS.md` should always carry:** the binding clauses (four laws, PLAN-WORKFLOW LOCK, comment hygiene, gates, verification standards, §8's two always-binding clauses) and one pointer line per rule family — the `AGENTS.md:261` pattern; never full rule text; stay inside the delivery budget (16,384 B observed here). Against the smallest cap the cut ends mid-line 175, so the clauses already inside are the Four Laws (`AGENTS.md:11-18`), PLAN-WORKFLOW LOCK (20-30), Comment Hygiene (32-34), Halt Conditions (36-41), the gates (49-61, 70-77, 79-86, 93-101), and the Verification Standards plus Final-State Verification (151-161, 165-170); the §8 pointer line (261) and the §10 mandates (281, 285) currently fall outside and would need to move up or compress (F28). *Falsifier:* a measured prohibition that moves only when its full text is resident.
2. **What Gate 5 should load:** the router plus the matched rules' cards, full text on demand; keep the action key and the silence condition; ~70-80% load-event reduction at measured bounds. *Falsifier:* a measured compliance drop, frequent card-insufficient full opens, or cards unbuildable in the rule-anatomy bands.
3. **What role the hook should have:** none now; if built later, action-boundary card delivery on the directive-lifecycle window model with the two deltas above; never an always-on constant (022 bar, `injection-contract.md:52-54`). *Falsifier:* a measured Gate 5 miss rate with a cost attached (001's flip test), or a probe showing transcript evidence everywhere plus the delivered-set extension built.

Consistency: neither the advisor-pointer refusal nor the trigger-index refusal from 001 is reopened (F26).

---

## 7. LIMITS AND WHAT WOULD CHANGE THE VERDICT

- Card reduction figures are structural bounds (measured section sizes), not a built card set; the true post-build numbers require the cards to exist.
- Per-window fire counts and per-runtime transcript availability are UNKNOWN; a live probe on each runtime would close the second and decide the hook's runtime reach.
- The 16,384-byte truncation is first-party evidence from this Devin session; whether other runtimes cap differently is UNKNOWN.
- All token figures use the evidence pack's ~4 B/token estimate, not a tokenizer count.

## 8. OPEN QUESTIONS (follow-ups for the packet, not blockers)

- What is the measured Gate 5 miss rate in sessions that write? No log exists; 001's logging-only observer recommendation produces it.
- Do the runtimes actually pass `transcript_path` in hook input outside Claude Code? Probe needed before any hook build.
- Do the drafted cards fit the rule-anatomy bands (≤160 preferred lines) without changing what rules bind? Build-packet question.

---

## 9. CITATION CHECK

Verified first-hand this session: AGENTS.md 27,012 B and REPO RULES.md 11,853 B (`wc -c`); corpus 107,092 B; reply-five 42,811 B; card proxies 2,509 B and 17,882 B (parsers); spec-gate notice 551 B (node import); `~/.claude/CLAUDE.md` symlink identity (`ls -la`, `diff -q`); the 16,384-byte truncation note (this session's rule block); boundary wiring (file reads: session-prime, post-compaction, cursor precompact, codex session-start, OpenCode plugin).

Reused with attribution: the 001 lineage's advisor-brief size measurement (~261 B; render.ts:438-449); the evidence pack's compliance and frequency counts (prep/, aggregates only); the orchestrator's fire count from the revised steer (93/265 windows; 3.5 rules avg, median 3, p90 7).

External docs (treated as data, cited by URL): runtime caps from code.claude.com/docs/en/memory, developers.openai.com/codex/guides/agents-md and the openai/codex source constant, cursor.com/docs/rules.md and forum.cursor.com, opencode.ai/v2/docs/instructions and opencode issue #18037, github.com/earendil-works/pi usage.md. The steer was revised mid-run; iteration 4 was re-executed against it, and the byte-offset check refined the orchestrator's line-174 claim to the cut ending mid-line 175.

Marked UNKNOWN rather than estimated: session-start recovery block size; per-runtime transcript availability; Cursor live delivery; Pi's byte cap; Codex's cut line in this repository (arithmetic only).

## 10. REFERENCES

- `iterations/iteration-001.md` … `iteration-004.md` and `deltas/iter-001.jsonl` … `iter-004.jsonl`.
- `findings-registry.json` (29 findings, 4 questions resolved) and `deep-research-dashboard.md`.
- `deep-research-state.jsonl` (4 iteration records) and `deep-research-config.json`.
- `steer.md` (lead steering; scope fixed).
- `prep/evidence-pack.md`; `../../001-advisor-surfacing/research/research.md`.

## Convergence Report

- Stop reason: `maxIterationsReached` (forced cap; `stopPolicy: max-iterations`)
- Total iterations: 4
- Questions answered: 4 / 4
- Average newInfoRatio trend: 0.85, 0.75, 0.80, 0.60 (no convergence claim; cap reached first)
- Divergence summary: no divergent pivots; 4 directions ruled out (registry)

<!-- /ANCHOR:deep-research-rule-loading-design -->
