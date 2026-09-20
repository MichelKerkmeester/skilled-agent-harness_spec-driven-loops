---
title: "wave1-glm iteration 002 — Angle 7: agents and mirrors"
loop: review
lane: wave1-glm
session: fanout-wave1-glm-1789465945073-px9i6h
iteration: 2 of 5
angle: 7
dimension_primary: traceability
dimension_secondary: maintainability
verdict: PASS
hasAdvisories: true
---

# Dimension / Focus

**Dimension:** traceability (primary), maintainability (secondary).
**Focus (Angle 7):** every agent under `.opencode/agents/` against its `.claude`, `.codex` and `.pi` mirrors — the permission mappings, the delegation gates, and the tool vocabularies each mirror must preserve.

# Files Reviewed

- `.opencode/agents/` — 12 agents + README.txt (15859–58894 B); declaration census of all 12 frontmatters, the full `permission:` block of all 12, and `.opencode/agents/deep-review.md` declaration + contract lines
- `.claude/agents/` — the 12 mirrors (15661–58781 B; uniformly smallest); `tools:` lines ×12, permission prose residue, and `.claude/agents/deep-review.md` verbatim block
- `.codex/agents/` — 12 `.toml` mirrors (15816–58894 B); header keys (name/description/`model`/`sandbox_mode`/`model_reasoning_effort`), `# Converted from` provenance markers
- `.pi/agents/` — the 12 mirrors (15749–58798 B); `tools:` block values ×12 (lowercase, `find`+`ls`, no `glob`)
- The deep-review 4-uplet verbatim: `.opencode/agents/deep-review.md`, `.claude/agents/deep-review.md`, `.pi/agents/deep-review.md`, `.codex/agents/deep-review.toml`
- `.claude/agents/code.md` (permission provenance prose, line 40)

Method note: the four trees were written as 4-uplets within ±1 minute (e.g. `code` 07:06×4, `orchestrate` 05:18×4, `deep-review` 22:30–22:31×4) — they are build-generated translations, so this angle graded the *translation contract*, not freshness. The 12×4 = 48 declaration blocks are all in evidence; bodies were compared via the byte-delta argument (`.opencode`→`.claude` = −168 B = exactly the frontmatter delta; `.pi` = +28 B = the tools-block syntax), making the prose bodies verbatim-shared across the three `.md` trees.

# Scorecard

| Gate | Rating | Basis |
|------|--------|-------|
| evidence | pass | every finding cites the 48-block matrix or a specific file:line from this session's grep/sed output |
| scope | pass | the 4 trees are the Angle-7 bound scope (strategy §13); the mirrors' out-of-four-tree position is sanctioned by the target spec's unless-clause (Angle 7); writes stayed inside the ALLOWED-WRITE set |
| coverage | pass | all 12 agents × 4 runtimes compared on 6 declaration axes (name, description, mode, temperature, permission, tools) + model + provenance; the delegation gate and the tool lexicon each received a verdict |

# Findings by Severity

## P0

None.

## P1

None. All five findings are P2.

## P2

### F009 — Sampling configuration is `.opencode`-only; three mirrors substitute either nothing or a different knob

`[SOURCE: .opencode/agents/deep-review.md:5 (temperature: 0.1), .opencode/agents/debug.md:5 + deep-improvement.md:5 + design.md:5 (temperature: 0.2); .claude/agents/*.md + .pi/agents/*.md (no temperature key anywhere); .codex/agents/deep-review.toml:8 (model_reasoning_effort = "high")]`

The source fleet tunes determinism per agent (`temperature: 0.1` ×9, `0.2` for debug/deep-improvement/design). No `.claude` or `.pi` mirror carries a temperature key — those runtimes fall back to their own defaults — and the `.codex` mirrors carry no temperature at all, only `model_reasoning_effort = "high"`, which is a different knob (effort ≠ temperature). Four dialects, no shared sampling vocabulary. The drift surface is the manual/interactive invocation route: the dispatched routes pass model and reasoning flags explicitly at dispatch time, so they are exact; a hand-invoked `@debug`-style run gets whichever default its runtime picks.

**Recommendation:** either carry a documented sampling-equivalence table (what 0.1/0.2 maps to per runtime) or state in the mirrors' prose that sampling parity is dispatch-time-only.

### F010 — The permission matrix's deny-half translates three different ways: runtime-enforced, prose-remembered, and silent

`[SOURCE: .opencode/agents/deep-review.md:6-17 (permission: read/write/edit/bash/grep/glob allow; webfetch/chrome_devtools/task/patch deny); .claude/agents/code.md:40; .claude/agents/deep-review.md:80; .claude/agents/context.md:4 + prompt-improver.md:4 + review.md:4 vs .pi/agents/context.md:4-7 + prompt-improver.md:4-7 + review.md:4-7]`

The good news, verified 12/12: the *allow→present / deny→absent* translation is faithful — `context` (write/edit/bash denied) appears in `.claude` as `Read, Grep, Glob` and in `.pi` as `read, grep, find, ls`; `prompt-improver` (write/edit/bash denied) likewise; `review` keeps Bash (allowed) but not Write/Edit (denied) in both mirrors. The findings are about the deny-half's enforcement: in `.opencode` it is a *runtime* gate (`task: deny` blocks the Task tool "at the OpenCode runtime layer" — as `.claude/agents/code.md:40` itself explains); in `.claude` the enforcement is replacement-implicit (tools not listed are unavailable) *plus* prose reminders inside the body ("Treat review target paths as read-only **even when write permissions are technically available**", deep-review.md:80; "`task` is denied in this agent's permissions", deep-improvement.md:21) — this is precisely the spec's "permission mappings dropped with only a comment" pattern, here surviving as instructional prose; in `.pi` the deny-side vanishes with no prose trail at all. Same contract, three enforcement dialects, none documented as a system.

**Recommendation:** one paragraph in a shared README (or the missing per-tree READMEs, F011) stating the deny-translation semantics per runtime, so an auditor does not have to re-derive it.

### F011 — Tool lexicon: three spoken dialects, no documented crosswalk, provenance marking in only one of four trees

`[SOURCE: .claude/agents/ai-council.md:4 + orchestrate.md:4 (TitleCase CSV, delegation via the `Agent` tool); .pi/agents/*.md:4-8 (lowercase block, `find`+`ls`, no `glob`, ×12 systematic); .codex/agents/deep-review.toml:5 (no tool declaration; sandbox_mode = "workspace-write" + prose); .codex/agents/deep-review.toml:2 ("# Converted from: .opencode/agents/deep-review.md"); assets-adjacent: README.txt present only in .opencode/agents/ and .claude/agents/)]`

`.claude` speaks TitleCase CSV and expresses delegation by *membership* (only `orchestrate` and `ai-council` carry the `Agent` tool); `.pi` speaks a lowercase block and systematically swaps the `glob` primitive for `find`+`ls` (all 12) — a lexicon decision recorded nowhere in its tree (`.pi/agents/` has no README); `.codex` declares no tools at all (sandbox + prose carry the whole contract). Only the `.codex` mirrors document their own provenance (`# Converted from: .opencode/agents/…`); the `.claude`/`.pi` mirrors are unmarked. A cross-runtime reader (or the wave-two reviewers) must reconstruct the equivalences — glob↔find+ls, permission-deny↔omission, mode↔Agent-membership — from diffing, which is exactly what this review just had to do.

**Recommendation:** add the two missing tree-level READMEs (or a lexicon section in the existing two) covering: the primitive swap, the delegation-translation rule, and the provenance convention; extend the `# Converted from` marker to the `.claude`/`.pi` trees.

### F012 — The leaf contract is triple-licensed: the agent file, the workflow, and the state schema disagree on the iteration record's tool-budget/edge-case vocabulary

`[SOURCE: .opencode/agents/deep-review.md:14 ("record edge cases and integration touchpoints"), :128 ("3-5 focused analysis actions within budget"), :167 ("Choose and record one budget profile before analysis: `scan` 9-11 calls, `verify` 11-13 calls, or `adjudicate` 8-10 calls"), :480 ("Exceed tool budget (max 13 calls)"), :520 ("[x] JSONL matches artifact counts, focus, status, ruledOut, budgetProfile, and edgeCases"); this lane's prompt packs, lines 97 (Target 9 tool calls. Soft max 12, hard max 13) and 115-119 (the record fieldlist); the state record contract's required/optional fieldlists (no budgetProfile, no edgeCases)]`

The agent body — verbatim-identical across all four trees, hence(contract ×4) — orders the leaf to (a) choose and *record* one of three named budget profiles (scan 9-11, verify 11-13, adjudicate 8-10) before analysis, (b) record edge cases, and (c) self-certify in its final checklist that the JSONL "matches … **budgetProfile** and **edgeCases**". The dispatch layer (the workflow's agent block, restated verbatim in every rendered prompt pack, lines 97) instead speaks a flat static band — "Target 9, soft max 12, hard max 13" — with no profile concept; its OUTPUT CONTRACT's record fieldlist (packs, sections 2-3) demands neither key; the state-record contract's required and optional fieldlists (state-jsonl.md) contain neither. So a compliant-with-the-pack record (like this lane's iteration-001: 12 calls, no `budgetProfile`, no `edgeCases` keys) is checklist-noncompliant with the agent file, and the mechanical gate (verify-iteration.cjs) checks neither, so the drift is invisible to the loop's only automated контроля. Impact today is advisory (the reducer reads counts, not these keys); the tax is contradicted- guidance for every future leaf.

**Recommendation:** pick one licensing: either the packs adopt the profile+edgeCases vocabulary (and state-jsonl.md adds the two optional keys), or the agent body's checklist drops the self-certification to match the pack. Rated P2 (advisory impact; borderline P1 under a strict "spec mismatch" reading — noted, impact-based call, confidence 0.8).

### F013 — Model attraction is structurally unowned: three of four trees are silent, the fourth pins a different model

`[SOURCE: .opencode/agents/deep-review.md (no model key in frontmatter; grep for `opus` over the whole file: zero hits); .claude/agents/deep-review.md:1-4 + .pi/agents/deep-review.md:1-11 (no model key); .codex/agents/deep-review.toml:6-7 (`model = "gpt-5.5"`, `model_reasoning_effort = "high"`); the workflow's agent block (dispatch-time default "runs model opus", recorded earlier this session)]`

No `.opencode`, `.claude` or `.pi` agent file declares a model — the "runs model opus" property lives in the *workflow's* dispatch configuration, not in any of the four agent artifacts. The `.codex` mirrors, uniquely, hard-pin `gpt-5.5` + reasoning effort high. Net: the four runtimes' idea of "the deep-review model" is 1×opus-via-dispatch, 1×gpt-5.5-via-TOML, 2×runtime-default — the same-agent-same-model promise holds only where a dispatch layer overrides it. For the dispatched lanes (this review's own執行 included) the guarantee is real; for direct `@deep-review`-style invocation in any runtime, the model is whatever that runtime's fallback is, and nothing in the tree says they should agree.

**Recommendation:** either add the model pin to the three silent trees (the honest default each runtime should fall back to) or add one line to the shared doctrine: "model parity is enforced at dispatch; direct invocations inherit the runtime default."

# Traceability Checks

| Protocol | Class | Status | Evidence / notes |
|----------|-------|--------|------------------|
| spec_code | hard | **pass** | Angle 7 = "every agent under .opencode/agents/ against its .claude, .codex and .pi mirrors; delegation and tool vocabulary the mirrors must preserve" (spec.md:83-adjacent; strategy §13 Angle 7 pointer). All 12 agents × 4 runtimes = 48 declaration blocks censused; 6 axes + model + provenance compared; the delegation gate (task: deny ↔ absent ↔ prose) and the tool lexicon (glob↔find+ls, TitleCase↔lowercase↔TOML-absent) each traced end-to-end. F009-F013 cite the matrix. |
| checklist_evidence | hard | notApplicable | unchanged from iteration 1: the target packet has no checklist.md; acceptance-criteria.md remains an unsatisfied scaffold; parent-REQ assessment belongs to synthesis. |

Summary: required 2, executed 1, pass 1, partial 0, fail 0, blocked 0, notApplicable 1, gatingFailures 0.

# Assessment

- **Counts:** 5 findings — P0: 0, P1: 0, P2: 5 (F009-F013). All new; zero refinements (the agent trees are disjoint from iteration 1's commands/deep surface and from the sibling lane's artifacts). Cumulative: 13 open (P0 0, P1 1, P2 12), 0 resolved.
- **newFindingsRatio:** 5/(8+5) = 0.38 (formula (new + 0.5·refined)/(priorOpen + new + refined)). stuck_count stays 0 (0.38 > 0.05). durationMs = 1175000 (pack-002 render at T0=1789469347 to this checkpoint T2=1789469522; the artifact-compose window follows, same disclosure as iteration 1).
- **Novelty justification:** first–ever 4-dialect declaration-matrix comparison of the agent trees; iteration 1 touched `.opencode/commands/deep/**` only; the sibling lane (angles 1-5) touched SKILL.md/hub-router/leaf-manifest. One residual connection: the mechanic of F012 (dispatch-vs-file contract split) parallels F004's comment-vs-code split in kind, not in root cause — recorded as parallelism, not a refinement.
- **Claim adjudication:** no new P0/P1 → the gate is vacuous-true; zero packets required, zero missing. The adjudication event records activeP0P1: 0, passed: true.
- **Quality gates:** evidence — every finding cites the 48-block matrix or named lines; scope — reads inside the sanctioned angle-7 surface (the unless-clause crossed into .claude/.codex/.pi), writes = the three narrative/delta/sidecar artifacts + the sanctioned state-log append; coverage — 12/12 agents, 4/4 runtimes, 8 comparison axes.
- **Verdict logic:** no P0, no P1 → PASS, per pack-002:77; `hasAdvisories: true` (5 active P2) per pack-002:59. This is the lane's first PASS — the PASS+advisories branch of the verdict vocabulary.

# Ruled Out

1. **README.txt parity** — present in `.opencode/agents/` and `.claude/agents/`, absent in `.codex/agents/` and `.pi/agents/`; it is non-agent prose (1603/1608 B) and not part of "every agent… against its mirrors"; noted, not graded. Its absence connects to F011's documentation remedy.
2. **The `.codex` TOML body** — the 50 KB `developer_instructions` strings are the shared body verbatim inside TOML; the body's *content* (seat protocols, checklists) belongs to angles 8/9; only the *declaration keys* were graded here.
3. **The `.pi` body-order question** — `.pi/agents/deep-review.md` (+28 B over `.claude`) assumed to carry the same sections reordered (the extra bytes ≈ the 7-line tools block); the verbatim position of the `## 0. ILLEGAL NESTING` section in the `.pi` file is UNKNOWN (flagged; the 40-line views were head-bounds, not a finding).
4. **`Agent` vs `Task` naming** — whether `.claude`'s delegation tool (`Agent`, in orchestrate + ai-council only) exactly corresponds to `.opencode`'s `task: allow/deny` lever is an external-schema question (the `.claude`/`.pi` runtime docs are outside this lane's trees); the *membership* pattern (2 of 12 carry it) matches the mode vocabulary's primaries-or-seaters; the ai-council permission tail (webfetch/task values) was truncated by the evidence gatherer (grep -A6) — flagged UNKNOWN, not graded.
5. **The "runs model opus" provenance** — recorded earlier this session from the workflow's agent block, not re-verified this iteration; F013 stands on the file truth alone (the four trees' silence/pin), which is the finding.

# Dead Ends

- The permission-block evidence gatherer used `grep -A6`, which truncated the `.opencode/agents/ai-council.md` permission block before its `webfetch:`/`task:` lines — the direct `.opencode`↔`.claude`-`Agent`-tool correspondence for the one agent that delegates seats is therefore cited as UNKNOWN rather than read (the budget went to the 12×4 census instead).
- No counter-yield: the deny→absent translation survived every attempted falsification (12/12); the drift findings all live in the *undeclared* axes (sampling, model, provenance, schema), not in mistranslated allow-sets.

# SCOPE VIOLATIONS

None. Writes: `prompts/iteration-002.md` (pre-iteration), this narrative, `deltas/iter-002.jsonl`, `logs/iter-002-events.jsonl`, the sanctioned lane-direct state-log append, and the reducer/verify invocations' in-lineage outputs.

# Recommended Next Focus / Next Dimension

Iteration 3 = **Angle 8 — cross-CLI executor parity** (executor kinds in `executor-config.ts`, the runner's command builders, the adapter stress matrix, each `cli-*/SKILL.md` roster, the deep-loop protocols' adapter lists — strategy §13 Angle 8 pointer), dimensions: correctness (primary) + security (secondary). Carry-overs: the `Agent`/`Task`-naming equivalence and the ai-council seat-dispatch permission tail (F012's UNKNOWN #4 → angle 8's delegation-vocabulary leg); the effort-vs-temperature knob question (F009) meets angle 8's dispatch-flag parity; F012's triple-licensing (pack vs agent file vs state schema) is a synthesis-level resolution, not an angle-8 task.

Review verdict: PASS
