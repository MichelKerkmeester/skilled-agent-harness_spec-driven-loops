# Deep Research Strategy - Repo rule concision and loading

## 1. OVERVIEW

### Purpose
Persistent brain for this fan-out lineage. One focus per iteration; evidence externalized to `iterations/` and `deltas/`. The steer file fixes the scope and the four-iteration plan; it is read before every iteration and is never overridden by this file.

### Session
- Session: `fanout-deepseek-v4-1-flash-max-1791120151016-ksetij`
- Executor: cli-devin model=deepseek-v4-1-flash-max
- Stop policy: max-iterations (4 iterations forced; convergence before the cap is telemetry only)
- Steer: `steer.md` present (loading design; scope fixed)

---

## 2. TOPIC

Question (from `steer.md`): what should `AGENTS.md` always carry, what should Gate 5 load, and what role, if any, should a hook have? Hook constraint: deliver a given rule at most once per compaction window, reset only on a compaction boundary. Five options under test: (1) status quo, (2) short rule cards resident in `AGENTS.md` with full text on demand, (3) Gate 5 loads cards not full files, (4) a hook injecting cards once per window, (5) load everything. Per option report: resident tokens, tokens per compaction window, silence condition, dedup mechanism and reset event, runtimes it reaches.

Packet context: the 13 repo rules total about 27k tokens; sessions read only a few; reading a rule does not measurably change most prohibitions it forbids (`prep/evidence-pack.md` §3). This lineage answers only the steer's loading-design question; concision targets are other lineages' scope.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- [x] None. All four questions resolved (Q1-Q4; see Answered Questions).
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Rewriting any rule, `AGENTS.md` or `REPO RULES.md` (a later build packet applies the verdict).
- Re-deriving the steer's scope; answering anything outside its Question line.
- Writing anywhere outside this lineage artifact directory.

---

## 5. STOP CONDITIONS

- `config.stopPolicy = max-iterations`: the run ends at iteration 4 regardless of convergence.
- Convergence before the cap is recorded as telemetry; the response is to broaden the review angle, not to synthesize early.
- Terminal stop reason must be `maxIterationsReached` in the synthesis record.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

- [x] Q1: Load paths and costs tabled (iteration 1). Seven paths: AGENTS.md 27,012 B resident (16,384 B as delivered in this runtime, truncated), REPO RULES.md 11,853 B at first write, trigger-matched rules 5.6-11.8 KB each with 3-4 firing normally, reply-time five 42,811 B (mandatory pair 18,340 B), advisor brief ~261 B/prompt deduped to ~54 B, spec-gate notice 551 B once/session, session-start recovery UNKNOWN size. Compaction confirmed as the natural re-read boundary (104 vs 1).
- [x] Q2: Five options matrixed (iteration 2). Status quo vs resident cards (+2,509-17,882 B) vs Gate 5 cards (0.7-1.8k tok per fire, ~70-80% load-event reduction) vs hook cards (234-446 tok per card per window) vs load everything (36.5k tok/load). Reset-semantics finding: only the directive lifecycle matches the steer's compaction-boundary reset; the spec-gate marker is session-scoped. The 16,384-byte delivery cap constrains resident-card options in this runtime.
- [x] Q3: Hook dedup design delivered (iteration 3). Marker = directive-lifecycle receipt v2; storage = durable tmpdir store (Claude family) / Pi in-memory / OpenCode epoch map; reset = compaction via boundary owners (session-prime, post-compaction, cursor precompact, codex mirrors) + transcript shrink + epoch advance; coverage all six runtimes with two caveats: Cursor delivery contradicted in the contract, and transcript-less runtimes degrade to full-every-turn (once-per-window unmet by existing machinery). Delivered-set keying is new work.
- [x] Q4: Verdict delivered (iteration 4, revised-steer form). AGENTS.md carries binding clauses + pointers, never full rule text, inside the delivery budget; Gate 5 loads router + matched cards with full text on demand (~70-80% load-event reduction at measured bounds); no hook now — future role is action-boundary card delivery on the directive-lifecycle window model, with delivered-set keying and boundary-epoch-only suppression as the two build deltas. Runtime caps sourced per runtime (F27); must-carry clauses vs the 16,384-byte cut tabled with line numbers (F28); orchestrator fire count incorporated (F29). Per-part falsifiers recorded in `iterations/iteration-004.md`.
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED

- Reading `steer.md` first and adopting its fixed iteration plan instead of re-deriving the scope (iteration 0, init).
- Verifying the evidence pack's headline numbers against the working tree with `wc -c` before citing them (init; AGENTS.md 27,012 B, REPO RULES.md 11,853 B, corpus 107,092 B, reply-five 42,811 B all confirmed).
- Measuring the spec-gate notice sizes by importing the module rather than estimating (iteration 1: 551 B notice, 173 B deferral).
- Catching the resident-block truncation by reading this session's own injected rule block instead of trusting "always loaded" as a size claim (iteration 1, F1).
- Measuring card-size bounds structurally (index summaries 2,509 B; frontmatter+Fires-when+The-rule proxy 17,882 B) instead of guessing at a card's size (iteration 2, F16).
- Comparing reset events across the two dedup precedents instead of assuming either fits the steer's constraint; the mismatch surfaced as F14 (iteration 2).
- Following the boundary bridge from the delivery module into the runtime hooks (session-prime, post-compaction, cursor precompact, codex mirrors) instead of stopping at a negative grep — the wiring is indirect and the grep alone would have produced a wrong "not wired" claim (iteration 3, F19).
- Catching the lead's mid-run steer revision and re-executing iteration 4 against it — Runtime caps sourced per runtime, the orchestrator's fire count replacing the option-4 UNKNOWN, and the must-carry clause table against the 16,384-byte cut (iteration 4 revision, F27-F29).
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED

- A first grep for the boundary bridge's registration across runtime config directories returned zero hits and suggested the bridge was dormant; reading the session hooks showed it is called indirectly (session-prime, post-compaction, cursor precompact, codex session-start). Registration-by-grep is not a valid negative here (iteration 3).
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

[None yet]
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS

- Reusing 010's federation counts as current fact (inherited caution from 001; not retested here).
- Treating the full 27,012 B `AGENTS.md` as unconditionally resident (iteration 1, evidence: 16,384-byte delivery cap observed in this session).
- The spec-gate marker as a drop-in for the steer's reset constraint (iteration 2, evidence: session-scoped resets, F14).
- Whole-payload equality as sufficient for per-rule once-per-window (iteration 3, evidence: changing card subsets produce different payloads; needs a delivered-set extension, F21).
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: all four steer iterations completed (load paths, five options, hook design, verdict)
- Pivot lineage: none
- Remaining frontier: none within this lineage; follow-ups for the packet are listed in `research.md` §8
<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS

- [None yet]
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

Complete. Synthesis written to `research.md` with `stopReason: maxIterationsReached`; resource map emitted; registry, dashboard, and this strategy closed out.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

### Bounded Context Snapshot

- Measured baseline (`prep/evidence-pack.md`, re-verified at init): `AGENTS.md` 27,012 B (~6.8k tok); `REPO RULES.md` 11,853 B (~3.0k tok); 13 rule files 107,092 B (~26.8k tok); five reply-time rules 42,811 B (~10.7k tok); everything 145,957 B (~36.5k tok).
- Load-path sources: `AGENTS.md:93-101` (Gate 5), `AGENTS.md:261` (§8 reply-time five), `REPO RULES.md:10-18` (router semantics), `REPO RULES.md:36-52` (trigger table).
- Hook sources: `.skilled/hooks/injection-contract.md` (§2 prompt-time, §3 tool-time, §4 lifecycle); `.skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts`; `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` (`gate3DeliveryMarker` line 364); `.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts` (Pi-local dedup).
- Prior work: `../../001-advisor-surfacing/research/research.md` (surfacing verdict; advisor pointer and trigger-index root refused; measure-before-build).
- Federation: canonical corpus `.skilled/repo-rules/`; user-level `~/.claude/CLAUDE.md` is a symlink to this repo's `AGENTS.md` (verified at init).
- Constraints and risks: read-only on the repository; write only inside the lineage dir; every load-bearing claim needs `file:line` or a `prep/` measurement; the runner validates exactly 4 iteration files and 4 iteration records.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 4
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: Sections 3, 6, 7-11A
- Canonical pause sentinel: `.deep-research-pause`
- Current generation: 1
- Started: 2026-10-04T13:22:00Z
