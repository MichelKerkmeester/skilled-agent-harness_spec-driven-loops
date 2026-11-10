# Iteration 1: Current load paths and costs

## Focus

Enumerate every path by which repo rules or their governing documents currently reach the model, and cost each one: trigger, bytes, tokens, citation. Per `steer.md` iteration 1: "Output: one row per path with trigger, bytes, tokens, citation."

`steer.md` was read before this iteration (steer scope: what should `AGENTS.md` always carry, what should Gate 5 load, and what role, if any, should a hook have; hook constraint: deliver a given rule at most once per compaction window, reset only on a compaction boundary).

## Findings

### F1: `AGENTS.md` reaches the model as the session rules block, and in this runtime it arrives truncated at 16,384 bytes

The repo `AGENTS.md` (27,012 bytes) is byte-identical to the user-level memory file `~/.claude/CLAUDE.md`, which is a symlink to it (verified: `ls -la` shows `CLAUDE.md -> .../Public/AGENTS.md`; `diff -q` reports IDENTICAL). In this Devin session the delivered rule block carried the note "[Rule content truncated to 16384 bytes. Read the full file at /Users/michelkerkmeester/.claude/CLAUDE.md for additional content.]" — so about 10.6 KB (the tail, roughly §6 onward) was not in the resident block. The truncation is runtime behavior observed first-hand, not a property of the file; the file-level cost stays 27,012 B.

- Resident cost: 27,012 B, ~6.8k tokens at the evidence pack's ~4 B/token estimate; as delivered here, 16,384 B, ~4.1k tokens.
- [SOURCE: this session's injected rule block; AGENTS.md:1-3; `wc -c AGENTS.md` = 27,012; `diff -q ~/.claude/CLAUDE.md AGENTS.md` identical; prep/evidence-pack.md §1]

### F2: `REPO RULES.md` is the Gate 5 router, loaded on the first write of a session

Trigger: "the FIRST write of the session"; "Read-only turns never fire it" [SOURCE: AGENTS.md:93-94]. Gate 5 step 1 opens the root router [SOURCE: AGENTS.md:95]; step 2 matches the action against its trigger table [SOURCE: AGENTS.md:96; REPO RULES.md:12]. Cost: 11,853 B, ~3.0k tokens. [SOURCE: `wc -c "REPO RULES.md"` = 11,853; prep/evidence-pack.md §1]

### F3: Trigger-table rule files load per matched action, and 3-4 files is the normal case

The router loads every rule file whose trigger row matches the action about to be taken [SOURCE: REPO RULES.md:12-17], and "Three and four firing at once is the normal case, not an edge case" [SOURCE: REPO RULES.md:15-17]. Per-file cost measured: 5,644 B (`answer-the-actual-request.md`) to 11,823 B (`evidence-and-proof.md`); corpus total 107,092 B [SOURCE: `wc -c .skilled/repo-rules/*.md`]. A 3-4 file load is therefore about 24.7-33.0 KB, ~6.2-8.2k tokens at the corpus average of 8,238 B/file.

### F4: The reply-time five are a second, prompt-fired path that Gate 5 never reaches

`AGENTS.md` §8 names five rules to load before replies — `communication.md`, `communication-prose.md`, `communication-decisions.md`, `communication-handoff.md`, `answer-the-actual-request.md` — because "These five fire on a reply rather than on a write, so Gate 5 never reaches them" [SOURCE: AGENTS.md:261]. Measured: all five total 42,811 B (~10.7k tokens); the two mandatory before any substantive reply (`communication.md` 11,458 + `communication-prose.md` 6,882) total 18,340 B (~4.6k tokens); adding `communication-handoff.md` (10,803 B) for a turn end gives 29,143 B (~7.3k tokens). [SOURCE: `wc -c` of the five files; prep/evidence-pack.md §1]

### F5: Hook injections are a third, smaller path: the advisor brief per prompt and the spec-gate notice per session

The advisor brief fires on every user prompt; the constant directive block is delivered in full on the first proven message and after lifecycle boundaries, and reduced to the route line only on proven repeats [SOURCE: .skilled/hooks/injection-contract.md:64; .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts:121-180]. Measured by the 001 lineage: full brief ~261 B (route 42 B + label 12 B + hygiene directive 207 B), ~65 tokens; deduped route-only ~54 B, ~14 tokens [SOURCE: 001-advisor-surfacing lineage iteration 2 measurement, render.ts:438-449]. The spec-gate mutation notice is 551 B (~138 tokens), delivered once per session at the first non-exempt write [SOURCE: spec-gate-core.mjs:162-170, measured via node import; injection-contract.md:72-81].

### F6: Session-start/compaction recovery is a fourth path, size UNKNOWN

Session-start context and post-compaction recovery inject composed blocks on `SessionStart` / `PostCompaction` [SOURCE: injection-contract.md:209-215, 229-235]. No size measurement exists in the evidence base; cost marked UNKNOWN.

### F7: Compaction is the observed natural window boundary for re-reads

Across 82 sessions: 104 rule re-reads happened after a compaction boundary, 1 happened inside a window [SOURCE: prep/evidence-pack.md §2]. This is the measured basis for treating a compaction window as the unit of "deliver once" in the steer's hook constraint.

### F8: Gate 5's reach is partial: only 14 of 44 sessions read any rule via the Read tool

[SOURCE: prep/evidence-pack.md §2. Caveat stated there: `cat`/`sed` reads are not counted, so this undercounts.] Sessions per rule in the wider count ranged 4 (`root-cause-and-debugging.md`, `answer-the-actual-request.md`) to 19 (`blast-radius.md`) [SOURCE: prep/evidence-pack.md §2].

## Load-path table (the steer's required output)

| # | Path | Trigger | Bytes | Tokens (~4 B/tok) | Citation |
|---|------|---------|-------|-------------------|----------|
| 1 | `AGENTS.md` (universal template) | Runtime loads it as the session rules block at start | 27,012 (16,384 as delivered in this Devin session) | ~6.8k (~4.1k as delivered) | AGENTS.md:1-3; wc -c; this session's rule block |
| 2 | `REPO RULES.md` (router) | Gate 5, first write of session | 11,853 | ~3.0k | AGENTS.md:93-97; wc -c |
| 3 | Trigger-matched rule files | Gate 5 step 3, per matched action | 5,644-11,823 each; 107,092 corpus; ~24.7-33.0k for 3-4 fires | ~1.4-3.0k each; ~6.2-8.2k per load event | REPO RULES.md:12-17; wc -c |
| 4 | Reply-time five (§8) | Before a substantive reply / turn end | 42,811 all five; 18,340 mandatory two; 29,143 + handoff | ~10.7k; ~4.6k; ~7.3k | AGENTS.md:261; wc -c |
| 5 | Advisor brief (hook) | Every user prompt; directive deduped | ~261 full / ~54 deduped | ~65 / ~14 | injection-contract.md:64; directive-lifecycle.ts:121-180; 001 lineage measurement |
| 6 | Spec-gate notice (hook) | First non-exempt write, once per session | 551 (+173 deferral at prompt time) | ~138 (+~43) | spec-gate-core.mjs:162-170 measured; injection-contract.md:72-81 |
| 7 | Session-start / compaction recovery (hook) | SessionStart / PostCompaction | UNKNOWN | UNKNOWN | injection-contract.md:209-215, 229-235 |

## Sources Consulted

- `steer.md` (lineage directory; read before this iteration)
- `prep/evidence-pack.md` (§1 token load, §2 read frequency, §3 compliance)
- `AGENTS.md` (§1, §2 Gate 5, §8; lines 93-101, 261)
- `REPO RULES.md` (lines 1-18, 36-52)
- `.skilled/hooks/injection-contract.md` (§2, §3, §4)
- `.skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts`
- `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` (measured via `node` import)
- `../../001-advisor-surfacing/research/research.md` and its lineage iteration records (prior measurements reused with attribution)
- Commands: `wc -c`, `wc -l`, `diff -q`, `ls -la`, `node` size probe (all read-only)

## Assessment

- newInfoRatio: 0.85
- Novelty justification: the evidence pack measured corpus-level totals; this iteration produces the per-path cost table the steer requires and adds two new measurements (the 16,384-byte truncation of the resident block in this runtime; the spec-gate notice at 551 B), while re-verifying every headline number against the working tree.
- Confidence notes: bytes are observed; token figures are the evidence pack's ~4 B/token estimate, not a tokenizer count (marked as estimates). The truncation finding is first-party but runtime-specific; whether other runtimes truncate differently is UNKNOWN.

## Reflection

- Worked: verifying the evidence pack's numbers before citing them; reading `steer.md` first to avoid re-deriving scope; measuring the notice sizes directly from the module rather than estimating.
- Failed: nothing material; the session-start recovery path has no size data to measure (left UNKNOWN rather than guessed).
- Ruled out: treating `AGENTS.md`'s full 27,012 B as unconditionally resident — this session shows a 16,384-byte delivery cap in at least one runtime.

## Recommended Next Focus

Iteration 2 (per `steer.md`): the five options, each with resident tokens, tokens per compaction window, silence condition, dedup mechanism and reset event, runtimes it reaches; every field cited or UNKNOWN.
