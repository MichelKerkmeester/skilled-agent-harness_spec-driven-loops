---
title: "Iteration 1: Current Gate 5 delivery path, rule corpus inventory, and prior settled decisions"
trigger_phrases: []
---
# Iteration 1: Current Gate 5 delivery path, rule corpus inventory, and prior settled decisions

## Focus

Establish how repo rules reach the model today, inventory the `.skilled/repo-rules/` corpus and its `trigger_phrases` frontmatter, and record every prior decision that already bears on the candidate surfaces — so later iterations evaluate candidates against settled law instead of re-litigating it.

## Actions Taken

- Read `AGENTS.md` Gate 5 (`AGENTS.md:93-101`) and the root `REPO RULES.md` trigger table, precedence, and §4 scope.
- Inventoried `.skilled/repo-rules/` (13 files) and confirmed `trigger_phrases` frontmatter on every file.
- Read `specs/hooks/022-smart-rule-injection/decisions.md` and `001-deep-research/implementation-summary.md` in full.
- Read `.skilled/hooks/injection-contract.md` (all injection channels, visibility tags).
- Read `specs/agents/010-repo-rule-system-integration/research/synthesis.md` and `cross-lineage-synthesis.md`.
- Read `corpus.mjs` (CORPUS_ROOTS, exclusions, symlink handling) and `retrieval-conventions.md` coverage table.

## Findings

1. **The current path is single-door, action-keyed, write-gated.** Gate 5 fires on "the FIRST write of the session" and "Read-only turns never fire it" [SOURCE: AGENTS.md:94]. The model then matches "the action you are about to take" against the trigger table — "the action, never the topic of the request" [SOURCE: AGENTS.md:96; REPO RULES.md:12]. The corpus today is 13 rule files (verified `ls`), routed by 13 trigger rows [SOURCE: REPO RULES.md:40-52] and 13 index rows [SOURCE: REPO RULES.md:60-72].

2. **Every rule file already carries `trigger_phrases` frontmatter, read by nothing at retrieval time.** Spot check shows 17–30 phrases per file [SOURCE: .skilled/repo-rules/blast-radius.md:4-20]. The conventions doc records that those phrases currently serve only `sk-create-repo-rule`'s own collision check [SOURCE: .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:284].

3. **PRIOR DECISION — repo-rules were deliberately excluded from BOTH retrieval lanes.** `retrieval-conventions.md:284`: "`.skilled/repo-rules` | No | No as a root; reached under `.skilled` | **Decided against.** The rule documents carry the same frontmatter as spec docs, but they are loaded at Gate 5 through the trigger table in `REPO RULES.md`, not retrieved at Gate 1; indexing them would surface a rule as a context candidate." `CORPUS_ROOTS` is `['specs', '.skilled/skills', '.skilled/hooks', '.skilled/changelog/skilled']` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs:30], and the divergence table is machine-enforced by `runtime/cli/tests/retrieval-coverage-parity.vitest.ts` [SOURCE: retrieval-conventions.md:271]. Candidate (b) is therefore not an open design — it is a proposal to overturn a recorded decision and must answer the recorded reason.

4. **PRIOR DECISION — the prompt-time injection bar.** Packet 022 settled: "a prompt-time injection earns its slot by naming a specific prohibition a gate enforces, not by restating a disposition the always-loaded document already carries" [SOURCE: specs/hooks/022-smart-rule-injection/decisions.md:21-24; 001-deep-research/implementation-summary.md:51]. Eighteen prompt-vocabulary candidates were refused under it. The governor and proof-over-appearance advisor directives were retired for exactly this reason; the comment-hygiene directive survives because a pre-commit gate enforces it [SOURCE: .skilled/hooks/injection-contract.md:52-54].

5. **PRIOR DECISION — event frequency must be measured, never reasoned.** The strongest injection candidate in 022 "died on measurement": the advisory it would ride fires ~8 times/minute at peak while the underlying condition persists tens of minutes [SOURCE: decisions.md:33-36]. Any candidate whose cost model assumes rarity needs a measured rate, not an estimated one.

6. **Rules deliberately do not do route selection.** `REPO RULES.md` §4: "Out: skill routing, workflow selection, spec-folder mechanics, and the mechanics of agent and CLI dispatch" [SOURCE: REPO RULES.md:90-94]. The trigger table is a router keyed on action; a surface that suggests rules keyed on prompt topic would invert the corpus's own match discipline.

7. **The injection channel inventory is mapped, and it contains a portability trap.** The advisor brief is `[SYS]` model-context-only on Claude/Cursor/Devin/Codex/OpenCode and `[MSG]` visible on Pi [SOURCE: injection-contract.md:50-68]. Tool-time hooks exist and are the candidate (c) precedent: dispatch-preflight-lint `[BLOCK]`/`[SYS]` [SOURCE: injection-contract.md:155-164], mcp-route-guard `[SYS]` except OpenCode where it is `[LOG]`-only — "genuinely invisible to the OpenCode model" [SOURCE: injection-contract.md:166-172]. Post-edit-quality on Claude Code and Devin writes plain stdout that "likely never reach[es] the assistant's context at all in normal use" — confirmed for Claude, unverified for Devin [SOURCE: injection-contract.md:201].

8. **The federation is real and changes the portability calculus.** Nine-plus rule files are symlinked into sibling repos (`Mobile CLI`, `Obsidian Plugin`) whose `AGENTS.md` files are absolute symlinks into this checkout; the shared corpus is one physical file set reached from multiple roots [SOURCE: specs/agents/010-repo-rule-system-integration/research/synthesis.md:13,31]. In this checkout the 13 files are real files, not links (verified `ls -la`). Any new surface keyed on `.skilled/repo-rules/` must resolve correctly where the directory itself is a federation mount.

9. **Open prior items that bound this research.** 010 item 18 (open): "zero repo-rule matches across eighteen workflows" and the link checker's roots exclude the repo root — no mechanical coverage exists for rules today [SOURCE: cross-lineage-synthesis.md:72]. 010 item 28 (open): "the Gate 5 reach question for the mirror runtimes" is unsettled — Gate 5's contract reaches each runtime differently [SOURCE: cross-lineage-synthesis.md:81].

## Questions Answered

- How do repo rules reach the model today? Only via Gate 5 at first write, action-matched through `REPO RULES.md` (AGENTS.md:93-101).
- Are `trigger_phrases` already machine-readable? Yes — frontmatter on all 13 files, consumed only by rule-authoring collision checks.
- What is already decided? (a) repo-rules excluded from retrieval lanes by recorded decision; (b) prompt-time injection bar; (c) frequency must be measured; (d) rules do not select routes.

## Questions Remaining

- What would each surviving candidate emit, cost per turn, and when would it stay silent? (iterations 2–3)
- Does any candidate survive the 022 bar — i.e., does it name a gate-enforced prohibition rather than restate a disposition?
- How does each candidate behave where the corpus is symlinked into a sibling repo?

## Ruled Out

- Treating candidate (b) as uncontested greenfield: it is a reversal proposal against `retrieval-conventions.md:284` and the parity test that enforces it.
- Estimating an advisory's fire rate instead of reading it from a log — forbidden by the 022 measurement rule.

## Assessment

- `newInfoRatio`: `0.92`
- Novelty justification: established the delivery baseline AND surfaced two recorded prior refusals (retrieval exclusion, injection bar) that reframe candidates (b) and (c) from design options into reversal proposals; also found the OpenCode/Claude-stdout invisibility traps that bound any new advisory's reach.
- Confidence: high — every load-bearing claim cites file:line read this session; the 010 findings are secondary but quoted with their own verification status.

## Reflection

- Worked: reading `retrieval-conventions.md` alongside `corpus.mjs` surfaced the recorded exclusion decision that the research brief itself did not cite — the single most load-bearing document for this topic.
- Worked: `injection-contract.md` already catalogs every channel a candidate could ride, including which ones are invisible on which runtimes.
- Limitation: the 010 synthesis line numbers reference an older `AGENTS.md` (501–502 lines); this checkout's `AGENTS.md` is 285 lines, so their citations were re-verified by content, not line number.

## Recommended Next Focus

Iteration 2: candidates (a) advisor-brief pointer and (b) trigger-index corpus inclusion — read `render.ts`, `directive-lifecycle.ts`, the Gate 1 lookup path (`lookup-trigger-index.mjs`), and measure each candidate's per-turn cost and silence condition against the 022 bar and the retrieval-exclusion decision.

## Sources Consulted

- [SOURCE: AGENTS.md:93-101]
- [SOURCE: REPO RULES.md:1-114]
- [SOURCE: .skilled/repo-rules/blast-radius.md:4-20]
- [SOURCE: specs/hooks/022-smart-rule-injection/decisions.md]
- [SOURCE: specs/hooks/022-smart-rule-injection/001-deep-research/implementation-summary.md]
- [SOURCE: .skilled/hooks/injection-contract.md:20-232]
- [SOURCE: specs/agents/010-repo-rule-system-integration/research/synthesis.md]
- [SOURCE: specs/agents/010-repo-rule-system-integration/research/cross-lineage-synthesis.md]
- [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs:30,44-51,191-210,299-327]
- [SOURCE: .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:270-298]
- [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/spec.md]
