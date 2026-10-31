# Iteration 4: Answers per part of the Question line

## Focus

Per `steer.md` iteration 4: "one answer per part of the Question line, the evidence for it, and the finding that would change it." The Question line: what should `AGENTS.md` always carry, what should Gate 5 load, and what role, if any, should a hook have?

**Revision note.** The lead updated `steer.md` mid-run (mtime 15:29) with a "STEERING for iteration 4" block. This iteration honors it: the Runtime caps section below was added before the Question-line answers; the orchestrator's measured fire count replaces the iteration-2 UNKNOWN for option 4; and the Part 1 answer now names the clauses that must sit inside the smallest cap with their line numbers today. `steer.md` was read again in its revised form; the scope is unchanged.

## Runtime caps (per the revised steer)

The byte cap on the instruction file per runtime, with source:

| Runtime | Instruction file | Cap | Source |
|---|---|---|---|
| Claude Code | `CLAUDE.md` (here: `~/.claude/CLAUDE.md` symlink → repo `AGENTS.md`) | **No hard cap** — "CLAUDE.md files are loaded in full regardless of length"; advisory only: "target under 200 lines". The 200-line / 25 KB caps apply to auto-memory `MEMORY.md`, not `CLAUDE.md` | External doc: code.claude.com/docs/en/memory |
| Codex | `AGENTS.md` chain (root → cwd, concatenated) | **32,768 B (32 KiB) default**, cumulative across the chain, silently truncated; config key `project_doc_max_bytes` in `~/.codex/config.toml`; local config carries no override (checked) so the default applies | External doc: developers.openai.com/codex/guides/agents-md; openai/codex code constant `32 * 1024` |
| Devin | Root `CLAUDE.md`/`AGENTS.md` surfaced by Devin | **16,384 B observed** — this session's delivered rule block was truncated at 16,384 bytes; no config key or repo doc found | Observed (this session's rule block); `.skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:290` documents the surfacing, not a cap |
| Cursor | `.cursor/rules/*.mdc` (plain `.md` ignored); AGENTS.md as fallback | **No enforced cap sourced**; advisory "keep rules under 500 lines"; a 0.49.0 prerelease showed a per-rule "1k characters … may be truncated" warning reported as a server-side visual bug. Hard cap: UNKNOWN | External doc: cursor.com/docs/rules.md; forum.cursor.com threads |
| OpenCode | `AGENTS.md` (+ `CLAUDE.md` fallback in V1; V2 recognizes `AGENTS.md` only) | **No byte guard** — the entire file is injected into the system prompt every loop() iteration; a 331 KB file consumes ~81% of a 128K window and triggers a compaction loop. Effective cap = context window. Nested files dedupe while their entry remains in history; re-injection possible after compaction | External doc: opencode.ai/v2/docs/instructions; github.com/anomalyco/opencode/issues/18037 |
| Pi | `AGENTS.md`/`CLAUDE.md` from `~/.pi/agent/`, parents, cwd — all concatenated | **UNKNOWN** — no byte cap documented; disable via `--no-context-files` | External doc: github.com/earendil-works/pi (usage.md) |

**Consequence for this repository:** the smallest sourced cap is Devin's 16,384 bytes (observed). The orchestrator's read is confirmed with one refinement: the cut ends mid-line **175**, so it drops the rest of §4 from line 175 (Completion Verification Rule, Memory Save Rule, Goal Posture, Self-Check), then all of §5-§10 — including the §8 reply-rule pointer line at `AGENTS.md:261`. Codex's default 32 KiB cuts at ~line 250-260 by the same arithmetic (not measured here; UNKNOWN).

## Findings

### F23: Part 1 — `AGENTS.md` should always carry binding clauses and pointer lines, never full rule text

**Answer.** `AGENTS.md` always carries: (a) the clauses that must bind even when nothing else loads; (b) one pointer line per rule family naming the file and when it fires — the existing §8 pattern [SOURCE: AGENTS.md:261]; (c) no full rule text. The doc should stay inside the guaranteed delivery budget: the smallest sourced cap is Devin's 16,384 bytes (observed), where the delivered block ends mid-line 175.

**Which clauses must sit inside the smallest cap (16,384 B), with line numbers today:**

| Must sit inside | Lines today | Status under the 16,384-byte cut |
|---|---|---|
| Four Laws (READ FIRST / SCOPE LOCK / VERIFY / HALT) | `AGENTS.md:11-18` | Inside (lines 1-174 complete) |
| PLAN-WORKFLOW LOCK | `AGENTS.md:20-30` | Inside |
| Comment Hygiene | `AGENTS.md:32-34` | Inside |
| Halt Conditions | `AGENTS.md:36-41` | Inside |
| Gate 3 + Gate 5 + Gate 2 + Confidence Thresholds | `AGENTS.md:49-61, 93-101, 79-86, 70-77` | Inside |
| Verification Standards table + Final-State Verification | `AGENTS.md:151-161, 165-170` | Inside |
| §8 reply-rule pointer line + the two always-binding clauses | `AGENTS.md:261, 263` | **Outside — cut** (would need to move up or compress) |
| §10 operational mandates ("Never fabricate"; data-not-instructions) | `AGENTS.md:281, 285` | **Outside — cut** |

So today the cut already keeps §1-§4's binding core but drops the §8 pointers and §10 mandates; a build packet applying this verdict should either move a compressed pointer/mandate block above the cut or accept their loss in the smallest-cap runtime.

**Evidence.** The pointer pattern is the working design for the five reply rules [SOURCE: AGENTS.md:261]; reading a rule's full text does not measurably change most prohibitions it forbids (tables stay ~20% after the read; the semicolon ban is the one exception, roughly halved but still failing in one reply in six) [SOURCE: prep/evidence-pack.md §3]. The delivered block in this session ended mid-line 175 (byte 16,384 falls in line 175; verified by byte-offset count).

**The finding that would change it.** A measured prohibition that moves only when its full text is resident — a compliance measurement showing a resident full text changing behavior that the pointer + on-demand load did not. Today's baseline (evidence-pack §3) shows the opposite.

### F24: Part 2 — Gate 5 should load the router plus matched rule cards, with full text on demand

**Answer.** Gate 5 keeps its action-keyed trigger and its silence condition ("Nothing fires → `AGENTS.md` alone governs" [SOURCE: REPO RULES.md:18]), but the load event carries the matched rules' cards — the binding sentence and `Fires when` — instead of full files; the full file opens only when the card leaves the action ambiguous or the work touches the rule's mechanism. At measured sizes and the orchestrator's measured fire count (median 3 distinct rules per loading window, 3.5 average, 90th percentile 7), a load event drops from ~6.2-8.2k tokens for full files to ~700-1,340 tokens for cards at the median and ~1,640-3,120 at p90 — roughly 70-80% off the load event (F11, F16).

**Evidence.** Measured card bounds: 935-1,784 B per card, 2,509 B total in index-summary form [SOURCE: this lineage's measurements; REPO RULES.md:58-72]. Orchestrator's fire count: 93 of 265 compaction windows load any rule (35%), 3.5 distinct rules average, median 3, p90 7 [SOURCE: steer.md revised, orchestrator measurement]. "Load everything" costs 36.5k tokens per load (F13); the status quo costs ~3.0k + ~6.2-8.2k per write session (F2, F3). Loading cards adds no new surface — it changes the payload size of an existing action-keyed path, keeping it clear of the 001 verdict's "do not add surfaces without a measured miss".

**The finding that would change it.** A measured compliance drop for prohibitions whose full text no longer loads by default, or a measurement that cards are insufficient in practice (frequent full-file opens returning the cost to today's numbers). Also, if the cards cannot be drafted inside the rule-anatomy bands without changing what the rules bind.

### F25: Part 3 — the hook's role is deferred and narrow: a future action-boundary card delivery on the directive-lifecycle window model, with two named extensions; not an always-on constant

**Answer.** No hook should be built now. If a measured need appears, the hook's defensible role is narrow: deliver a matched rule card at the action boundary (the router's own key), at most once per compaction window, using the directive-lifecycle receipt model (F17-F19), extended with (a) a delivered-set key so "a given rule" is deduplicated per rule rather than by whole-payload equality (F21), and (b) a boundary-epoch-only suppression variant for runtimes without transcript evidence (F20). The hook must not become another always-on constant: the injection contract's own history retired two directives that restated resident content [SOURCE: injection-contract.md:52-54].

**Per-window cost with the measured fire count:** in the 35% of windows that load any rule, card delivery costs ~820-1,560 tokens (3.5 cards × 234-446 tokens each); averaged across all windows ~290-550 tokens. This supersedes the iteration-2 UNKNOWN.

**Evidence.** Compaction-boundary resets are wired on all six runtimes (F19); the directive-lifecycle receipt is the only existing model whose reset shape matches the constraint (F14). Delivery channels exist on all six runtimes, with Cursor's prompt-time delivery contradicted in the contract and every uncertainty failing open to full delivery (F20, F22). No measured Gate 5 miss rate exists, and 022's rule is that event frequency must be read from the log, never reasoned about [SOURCE: ../../001-advisor-surfacing/research/research.md §1, §5; specs/hooks/022-smart-rule-injection/decisions.md:33-36].

**The finding that would change it.** A measured Gate 5 miss rate with a cost attached (001's flip test, §5). Or the inverse: a live probe showing transcript evidence is available on every runtime, plus the delivered-set extension built, which would make the once-per-window guarantee cheap enough to argue for on structure alone.

### F26: The three answers are consistent with the prior refusals and reopen nothing

- The advisor-pointer refusal stands: no constant line, no prompt-time restatement [SOURCE: ../../001-advisor-surfacing/research/research.md §1, §7].
- The trigger-index refusal stands: nothing here indexes rule files for topic-keyed surfacing [SOURCE: ../../001-advisor-surfacing/research/research.md §1].
- The measure-before-build rule applies to the hook only; card-form Gate 5 removes tokens from an existing path rather than adding a new one (F24).
- The steer's scope is answered in full; the concision playbook remains other lineages' scope.

## Sources Consulted

- `steer.md` (revised form; read before this iteration and again after the lead's update)
- All findings F1-F22 and their cited sources (iterations 1-3)
- `AGENTS.md` (line-number and byte-offset verification for the must-carry table); `REPO RULES.md:18,58-72`
- `.skilled/hooks/injection-contract.md:52-54`
- `.skilled/skills/sk-doc/sk-create-repo-rule/references/rule-anatomy.md` (§1 MUST elements)
- `../../001-advisor-surfacing/research/research.md` (§1, §5, §7); `specs/hooks/022-smart-rule-injection/decisions.md:33-36`
- `prep/evidence-pack.md` (§3)
- External docs for runtime caps (treated as data, cited by URL): code.claude.com/docs/en/memory; developers.openai.com/codex/guides/agents-md; github.com/openai/codex (code constant); cursor.com/docs/rules.md + forum.cursor.com; opencode.ai/v2/docs/instructions + github.com/anomalyco/opencode/issues/18037; github.com/earendil-works/pi (usage.md)

## Assessment

- newInfoRatio: 0.7 (raised from 0.6 by the Runtime caps section: five of six caps are newly sourced, and the must-carry table is new analysis against the 16,384-byte cut)
- Novelty justification: first consolidated verdict for the steer's three questions plus the cap-per-runtime table; the must-carry clause table turns the truncation observation into a concrete repositioning requirement; the orchestrator's fire count replaces the option-4 UNKNOWN.
- Confidence notes: caps for Claude Code/Codex/Cursor/OpenCode/Pi come from external docs, not this repository — labelled as such. Devin's 16,384 B is observed. The hook answer's transcript-evidence caveat remains UNKNOWN pending a live probe. Card reduction percentages are structural bounds.

## Reflection

- Worked: anchoring every answer to a measured number or a cited contract line; applying 001's measure-first rule asymmetrically (cards need no new measurement; the hook does); verifying the byte-offset of the cut instead of trusting the line-174 claim verbatim (it is line 175).
- Failed: the hook answer cannot be made unconditional — the transcript-evidence dependency keeps it runtime-conditional; no probe was possible this session. No config key for Devin's cap was found; the cap is observed only.
- Ruled out: an always-on rule directive in any prompt-time hook (022 bar, injection-contract.md:52-54); building the hook before a measured miss (001 §5).

## Recommended Next Focus

Iteration budget complete (4/4). Proceed to synthesis: `research.md` with `stopReason: maxIterationsReached`, resource map, and closed-out state.
