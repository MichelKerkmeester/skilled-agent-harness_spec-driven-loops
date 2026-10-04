---
title: "Iteration 3: Candidate (c) PreToolUse action-keyed advisory, candidate (d) no new surface, and federation portability"
trigger_phrases: []
---
# Iteration 3: Candidate (c) PreToolUse action-keyed advisory, candidate (d) no new surface, and federation portability

## Focus

Determine what a tool-time advisory could actually match on, whether the spec-gate once-per-session machinery is a viable precedent, how every candidate behaves on the federated sibling checkouts, and whether the status quo's gaps are real enough to admit any surface.

## Actions Taken

- Dumped `.claude/settings.json` hook registrations (every matcher and adapter path).
- Read `.skilled/hooks/README.md` kill-switch index and the full-index portability model.
- Inspected spec-gate mutation-time mechanics (`GATE_3_MUTATION_NOTICE`, `recordGate3NoticeDelivered`, once-per-session marker).
- Measured the spec-gate advise log for the 022 frequency rule.
- Empirically tested walker semantics on the live sibling checkout (`Obsidian Plugin`): `.skilled` whole-tree symlink, `repo-rules/` file-level links, and 3 sibling-local rules.
- Grepped `.skilled/hooks/` and spec-kit runtime hooks for any existing repo-rule surface (zero hits).

## Findings

### Candidate (c): action-keyed PreToolUse advisory

1. **The wiring seat exists and is proven.** `.claude/settings.json` registers `PreToolUse` matchers: `Write|Edit` → `spec-gate-enforce.mjs`; `Bash` → 4 hooks including `git-preflight-advisory` and `git-message-gate`; `Task` → dispatch guards; `mcp__claude_ai_.*` → mcp-route-guard [SOURCE: .claude/settings.json hooks block]. A rules advisory would be a fifth concern folder under `.skilled/hooks/` with per-runtime adapters, honoring the kill-switch convention (`SYSTEM_<CONCERN>_DISABLED`, `SYSTEM_HOOKS_DISABLED`) [SOURCE: .skilled/hooks/README.md kill-switch index].

2. **The once-per-session mechanism is directly cloneable.** Gate 3 delivers `GATE_3_MUTATION_NOTICE` once at the first non-exempt mutation via a persisted session marker (`gate3DeliveryMarker`, `recordGate3NoticeDelivered`); "an open gate speaks once … a mutation after that delivery stays silent" [SOURCE: spec-gate-core.mjs:1736-1783,376-444]. A "first write → remember Gate 5" advisory is the same shape: one `additionalContext` line per session at first mutation.

3. **But the tool-observable action space covers a minority of the corpus.** Mapping all 13 rules' fire lists: tool-visible triggers exist for `blast-radius` (rm/git/npm/curl commands), `skill-hub-routing` (registry/graph path prefixes), `prevent-overengineering` (new-file Write, weakly), `scope-discipline` (out-of-scope paths — needs frozen scope a hook cannot see). The other 9 — uncertainty, evidence, answer-the-actual-request, communication×4, delegation, root-cause (retry detection needs history) — fire inside reasoning or prose with no tool call to key on [SOURCE: REPO RULES.md:40-52 fire lists]. A PreToolUse advisory is structurally blind to the majority of the corpus.

4. **And the riskiest tool actions are already guarded.** The Bash matcher already runs `git-preflight-advisory` (warn) and `git-message-gate` (deny) plus `dispatch-preflight-lint` (block/warn) [SOURCE: .claude/settings.json PreToolUse Bash group; injection-contract.md:153-164]. The commands a blast-radius nudge would catch are the commands existing guards already inspect — marginal coverage ≈ low.

5. **Per-turn cost and silence.** Strongest form (first-write reminder): ~one ~150-char `additionalContext` line per session, silent thereafter via marker — near-zero cost, measured precedent: `spec-gate-warnings.log` shows ~5 advise rows in 2 days [SOURCE: .skilled/skills/.state/spec-gate/spec-gate-warnings.log tail]. Weaker form (every mutation classified): silent on non-matching tool calls by construction; but cannot measure need — no log of Gate-5 misses exists (010 item 28 open) and the 022 rule forbids estimating one [SOURCE: decisions.md:33-36; cross-lineage-synthesis.md:81].

6. **Portability: weakest of the three.** Each runtime needs its own adapter + registration; visibility varies by runtime — OpenCode's mcp-route-guard is `[LOG]`-only "genuinely invisible to the OpenCode model" [SOURCE: injection-contract.md:172]; Claude/Devin PostToolUse stdout "likely never reach[es] the assistant's context" [SOURCE: injection-contract.md:201]; Cursor's `beforeSubmitPrompt` never delivers at all [SOURCE: injection-contract.md:100]. An advisory can silently become invisible per runtime — the trap the contract doc exists to name.

### Portability axis (all candidates) — measured on the live federation

7. **The federation is a double symlink chain plus sibling-local rules.** This repo: `.skilled/repo-rules/` = 13 real files; `repo-rules/` at root = 13 symlinks → `.skilled/repo-rules/` [SOURCE: `ls -la Public/repo-rules/`]. `Obsidian Plugin`: `.skilled` → symlink to `Public/.skilled`; `AGENTS.md` → absolute symlink to `Public/AGENTS.md`; `repo-rules/` = file symlinks → `Public/repo-rules/` **plus 3 real local rules** (`screenshot-currency.md`, `spec-tree-layout.md`, `verification-gates.md`) absent from `.skilled/repo-rules` [SOURCE: `ls -la "Obsidian Plugin/repo-rules/"`]. Its `REPO RULES.md` is a distinct real file (9,581 bytes) with its own trigger table [SOURCE: `ls -la "Obsidian Plugin/"`].

8. **Candidate (b) under federation — measured.** In the sibling, `.skilled/repo-rules/*` entries are NOT themselves symlinks (real files through a linked directory) → `recordFile` runs with `isLink=false` → the out-of-root refusal does NOT fire → the 13 shared files index cleanly under the `.skilled/repo-rules/` spelling [SOURCE: corpus.mjs:299-310; live `readdirSync`/`realpathSync` probe on `Obsidian Plugin`]. But the 3 sibling-local rules at root `repo-rules/` are file symlinks resolving outside the sibling root → `'symlink target outside the repository'` skip [SOURCE: corpus.mjs:307-310; live probe]. **Net: (b) indexes the shared 13 but structurally misses sibling-local rules — under-serving exactly the repos that layer their own rules.** In this repo (b) indexes all 13.

9. **Candidate (a) under federation.** The advisor brief is emitted per-runtime by the same shared renderer; siblings share `.skilled` wholesale, so the brief (and a hypothetical second directive) behaves identically — portability is (a)'s one clean axis.

10. **Gate 5 under federation.** Works by contract, not mechanism: the sibling's `AGENTS.md` is the same file (symlink), its `REPO RULES.md` is its own real table routing to its own `repo-rules/` — the design keeps the corpus federated while the router stays local [SOURCE: `ls -la "Obsidian Plugin/"`]. This is why the corpus-rooted surfaces are the wrong layer: the *routing* is deliberately per-repo even where the *content* is shared.

### Candidate (d): no new surface

11. **The read-only-turn gap is mostly covered by the promotion pattern.** Rules binding on read turns (uncertainty, evidence, communication, answering) already have their load-bearing clauses promoted into the always-loaded `AGENTS.md` §3–§4 — Confidence Thresholds, Restraint Signals, Verification Standards, Communication sections. This is the remedy 022 itself prescribed: "a clause that must bind while reading belongs where it always loads … promotion into the resident layer, not injection" [SOURCE: 001-deep-research/implementation-summary.md:55].

12. **The residual gap is real but small.** Spec.md names it: "later actions in a long session depend on the model re-consulting the table unprompted" [SOURCE: spec.md:38]. Gate 5's loaded table persists in context; the failure mode is model discipline, not missing context. No measured miss rate exists — and per the 022 rule, an unmeasured rate cannot justify a surface [SOURCE: decisions.md:33-36].

13. **The real uncovered hole is neither (a)–(c)'s territory.** 010 item 18 (open): zero repo-rule coverage in 18 workflows — no mechanical check that trigger rows cover rule fires [SOURCE: cross-lineage-synthesis.md:72; synthesis.md item 2/:53]. That is a CI/generator-check gap (the `create-repo-rule` verify step checks counts+links only), not a model-surface gap — no advisory fixes drift between rows and fires.

### Evidence-raised candidate (e), recorded for synthesis

14. **Refined-(b): index rules but present them as rules, not context candidates.** The exclusion reason is precise — "indexing them would surface a rule *as a context candidate*" [SOURCE: retrieval-conventions.md:284]. A lookup lane that renders `.skilled/repo-rules/` hits with their Gate-5 load semantics ("rule to load on action match", not "context to read") answers the recorded objection's exact wording. Against it: still topic-matched, still fires on read-only turns, still a recorded-decision reversal requiring parity-test + conventions-table + artifact regeneration.

## Questions Answered

- (c) emission/silence/cost: cloneable once-per-session `additionalContext` at first mutation (strong form) or per-classified-action (weak form); silence is natural; cost near-zero — but the observable action space covers ≤4 of 13 rules and the riskiest commands are already guarded.
- Portability: measured. (a) clean; (b) works in this repo, misses sibling-local rules; (c) weakest — per-runtime adapters with documented invisibility traps.
- (d): the read-only gap is largely covered by promoted clauses; the residual is unmeasured model discipline.

## Questions Remaining

- Cross-candidate: does any form satisfy ALL of: names a gate-enforced prohibition (022 bar), matches on action like the table, self-silences, and survives federation? (iteration 4 synthesis verification)
- Is there a variant worth admitting despite (d) — i.e., the once-per-session first-write mechanical reminder — given Gate 5 is a declared [HARD] BLOCK with no mechanical backstop today?

## Ruled Out

- Per-action rule classification at the tool boundary as a general surface: ≤4/13 rules are tool-observable; the riskiest commands are already guarded by git-preflight/dispatch hooks.
- Assuming corpus-rooted retrieval is federation-safe: measured false for sibling-local rules under root `repo-rules/` (out-of-root symlink skips).

## Assessment

- `newInfoRatio`: `0.80`
- Novelty justification: produced the tool-observable vs reasoning-only fire-list mapping (the decisive constraint on (c)), found the cloneable once-per-session mechanism with a measured cost precedent, empirically verified federation behavior on a live sibling (double-chain + sibling-local rules), and surfaced the refined-(e) variant that answers the exclusion objection's exact wording.
- Confidence: high on mechanism/portability (empirically probed); medium on the (d) judgment — it weighs promoted-clause coverage against an unmeasured gap, and I flag which evidence would change it (a measured Gate-5 miss rate).

## Reflection

- Worked: the live sibling probe turned portability from inference into measurement — including the non-obvious result that `.skilled/repo-rules` indexes fine through a linked dir while root `repo-rules/` skips entirely.
- Worked: mapping every rule's fire list to the tool boundary before judging (c) — the coverage hole is structural, not implementational.
- Limitation: no Gate-5 miss telemetry exists anywhere; the (d) call rests on promoted-clause coverage, not measured compliance.

## Recommended Next Focus

Iteration 4: cross-candidate verification — re-check the load-bearing lines (022 bar text, retrieval-conventions:284 wording, Gate 3 marker mechanics, the promoted-clause inventory in AGENTS.md §3–§4), assemble the final candidate×axis matrix, and write the verdict with silence conditions and per-turn costs.

## Sources Consulted

- [SOURCE: .claude/settings.json (hooks block)]
- [SOURCE: .skilled/hooks/README.md (kill-switch index)]
- [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:162-187,376-444,1736-1783]
- [SOURCE: .skilled/skills/.state/spec-gate/spec-gate-warnings.log]
- [SOURCE: .skilled/hooks/injection-contract.md:52-68,100,153-172,201]
- [SOURCE: `ls -la` on Public/repo-rules/, "Obsidian Plugin/", "Obsidian Plugin/repo-rules/"]
- [SOURCE: live node probe: readdirSync/realpathSync on Obsidian Plugin .skilled/repo-rules and repo-rules]
- [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs:238-310]
- [SOURCE: specs/agents/010-repo-rule-system-integration/research/cross-lineage-synthesis.md:72,81]
- [SOURCE: specs/hooks/022-smart-rule-injection/001-deep-research/implementation-summary.md:55]
- [SOURCE: specs/hooks/022-smart-rule-injection/decisions.md:33-36]
- [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/spec.md:38]
- [SOURCE: .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:284]
