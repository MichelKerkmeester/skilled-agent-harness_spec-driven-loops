# Iteration 006 — Hub canon for `cli-external-orchestration`

## Focus

Audit the `cli-external-orchestration` hub against the checks that found the `cli-classifier` defects: (1) every phrase in each mode's `ROUTER.md` versus the hub's `hub-router.json` classes and `routerPolicy.defaultMode`; (2) version skew across hub `SKILL.md`, `ROUTER.md`, `hub-router.json`, `mode-registry.json`, `description.json` and each mode; (3) each mode's `RESOURCE_MAP` versus the hub's per-intent resources; (4) whether any `cli-*/SKILL.md` still sends a single build or doc dispatch through `fanout-run.cjs` after v4.0.0.1.

The hub is at **1.8.0.0** (`SKILL.md:5`, `description.json:4`, `mode-registry.json:3`, `hub-router.json:3`), matching its newest changelog entry `changelog/v1.8.0.0.md` as `SKILL.md:158` declares. That part of the version contract holds. Everything below is what does not.

## Actions Taken

1. Read the hub tree, then all five hub-root routing surfaces (`SKILL.md`, `ROUTER.md`, `hub-router.json`, `mode-registry.json`, `description.json`).
2. Extracted the three parallel intent vocabularies and diffed them programmatically per mode: `ROUTER.md` §3 `INTENT_SIGNALS`, `hub-router.json` `routerSignals` + `vocabularyClasses`, and `mode-registry.json` `modes[].aliases`.
3. Ran `advisor_recommend` on `"delegate this review to dsh"`, `"ask cursor to fix the bug"`, `"opencode go route this task"` and `"use cli-deepseek-harness for this"`.
4. Grepped every `cli-*/SKILL.md` for `fanout-run` to test the v4.0.0.1 claim, and opened `fanout-run.cjs:2386-2392` to check the one line reference a mode's reference doc makes into it.
5. Traced `mode-registry.json` `aliases` to its consumer to settle whether it is live or removable.

## Findings

### F1 — P1 — drift (structural): three copies of the hub intent vocabulary, and the sync contract names only one of them

`ROUTER.md:100-102` says its §3 block is "the single machine-readable projection of the intent model … the byte-for-byte source the deterministic router-replay parses", and `ROUTER.md:103-105` names exactly one thing to keep in sync: "update the matching `RESOURCE_MAP` entry here". `hub-router.json` is never named as a second copy to keep true. It is one anyway, and it is the surface the advisor actually scores.

Per-mode keyword counts, diffed by script this iteration:

| mode | ROUTER.md §3 | hub-router.json | mode-registry `aliases` |
|---|---|---|---|
| cli-opencode | 16 | 14 | 12 |
| cli-claude-code | 13 | 12 | 5 |
| cli-codex | 12 | 11 | 6 |
| cli-cursor | 15 | 11 | 5 |
| cli-devin | 18 | 13 | 6 |
| cli-pi | 17 | 12 | 9 |
| cli-deepseek-harness | 16 | 7 | 4 |

The direction is uniform: `hub-router.json` is a **strict subset** of `ROUTER.md` for all seven modes (the only phrase hub-router adds anywhere is `opencode go route`), and `mode-registry.json` is a strict subset of hub-router. So no phrase exists in the machine surface that is missing from the doc — the doc over-promises by 30 phrases across the hub. Worst case is the newest mode: `ROUTER.md:119` lists 16 harness phrases; `hub-router.json:245-253` carries 5.

The sharper contradiction is inside `ROUTER.md` alone. Prose at `ROUTER.md:88-89` states "The harness intent fires only on harness vocabulary (`dsh`, `dsh headless`, `deepseek harness`, `delegate to dsh`)" — four phrases, which agrees with `hub-router.json` and with the v1.8.0.0 note. Fourteen lines later `ROUTER.md:119` lists 16, including `cli-deepseek-harness`, `dsh review`, `dsh second opinion` and `deepseek harness headless`. §2 and §3 of one file disagree about the same mode, and §2 is the half a reader believes first.

- Release introduced: v1.8.0.0 (`51f70a0317` era — the 7th mode was appended to §3 and to `vocabularyClasses` by different hands); the three-surface pattern predates it. [SOURCE: .skilled/skills/cli-external-orchestration/ROUTER.md:100] [SOURCE: .skilled/skills/cli-external-orchestration/hub-router.json:245]
- Confidence: high on the counts (scripted diff); high on the §2/§3 contradiction (both lines read this iteration).
- Verify: `sed -n '88,89p;119p' .skilled/skills/cli-external-orchestration/ROUTER.md`

### F2 — P1 — bug (repro): a phrase the hub owns as its route selector loses the advisor's top slot

The v1.8.0.0 note promises "A route name beats a word inside it. `opencode go route` selects `cli-deepseek-harness`." Inside the hub that promise is kept. At the advisor's ranking it is not.

```
$ node .skilled/bin/skill-advisor.cjs advisor_recommend --json \
    '{"prompt":"opencode go route this task"}' --format json
[{"id":"sk-code", score:0.783341, conf:0.941, route:["sk-code-skilled"]},
 {"id":"cli-external-orchestration", score:0.31612, conf:0.82,
  route:["cli-deepseek-harness"], kind:"single"}]
```

The hub's internal route is correct — `cli-deepseek-harness`, `selectionKind: single` — but `sk-code` outranks it by 0.47 of score, so an agent following the top recommendation writes code locally and never reaches the hub. The phrase the release note names as an ensured route is the phrase that loses. `opencode go route` is registered twice in `hub-router.json` (in `cli-deepseek-harness-aliases` at line 251 and in `deepseek-harness-dispatch` at line 258), which raises the hub's score for the phrase and still leaves it second.

- Caveat (stated rather than buried): the probe carried the word `task`, which plausibly favours `sk-code`; the finding is that a hub-owned route phrase loses the top slot, not that it routes wrong. [SOURCE: .skilled/skills/cli-external-orchestration/hub-router.json:251]
- Release introduced: v1.8.0.0. Confidence: high on the observed ranking, medium on the "task" contribution.
- Verify: rerun the command above, then rerun with `{"prompt":"opencode go route"}` and compare.

### F3 — P2 — misalignment: the executor-delegation scorer sees a narrower vocabulary than the hub router

`mode-registry.json` `aliases` looked like the removable third copy of the vocabulary. It is not: `executor-delegation.ts:212` builds the executor roster as `{ id: mode.packetSkillName, aliases: stringArray(mode.aliases) }` and `executor-delegation.ts:357` spreads those aliases into matching. Removing `aliases` would therefore break the delegation scorer's phrase matching outright — this is the removal test the over-engineering question asks for, and it comes back negative, so F1's repair must **widen** the alias sets, never delete the field.

The consequence of the narrow sets is a two-tier contract: `pi thinking`, `dsh review`, `cli-deepseek-harness`, `composer dispatch` and 26 other phrases route in the hub but are invisible to the executor-delegation scorer, which sees 4-6 aliases for `cli-deepseek-harness` and 5 for `cli-claude-code`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/executor-delegation.ts:212] [SOURCE: .skilled/skills/cli-external-orchestration/mode-registry.json:230]
- Release introduced: v1.8.0.0 (deepseek alias set added at 4 while its hub class got 5 and its doc got 16). Confidence: high.
- Verify: `sed -n '212p' .skilled/skills/system-skill-advisor/runtime/lib/scorer/executor-delegation.ts`

### F4 — P2 — drift: a stale line reference into the fan-out runner

`cli-pi/references/cli-reference.md:201` sends the reader to `fanout-run.cjs:2390` for the 20 MB captured-stdout cap. That line is now `webSearch: effectiveWebSearchPolicy(lineage),` — inside a `build*` function, unrelated to any cap. The citation resolves to a live path and a valid line number, so `validate.sh`'s `SOURCE_TAGS` check passes it, which is exactly why a stale line survives a green gate.

This also interacts with F2 of the v4.0.0.1 change: if a single build dispatch no longer runs through the fan-out runner, a reader of this line has no way to tell whether the cap still protects their dispatch. [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/references/cli-reference.md:201]
- Release introduced: with the reference doc; the code moved after it. Confidence: high on the broken citation, medium on whether the cap exists elsewhere in the file (not searched to exhaustion).
- Verify: `sed -n '2390p' .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`

### F5 — P2 — drift: `ROUTER.md` version never moved after a material 1.8.0.0 edit

`SKILL.md:158` sets the contract: hub release version is shared by `description.json`, `mode-registry.json` and `hub-router.json`; "`ROUTER.md` keeps its own document version". All three JSON surfaces and `SKILL.md` read 1.8.0.0. `ROUTER.md:11` reads **1.7.11.0** — yet 1.8.0.0 materially edited this file, adding the seventh mode to the mode list at `ROUTER.md:30-31`, the `DEEPSEEK_HARNESS` intent class at `:119`, its leaves at `:148-149` and the containment paragraph at `:85-89`. A document version that does not move on a material edit stops identifying the content it labels, and nothing in the repo compares the two (the same missing-validator class as iteration 5's F5). [SOURCE: .skilled/skills/cli-external-orchestration/ROUTER.md:11] [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:158]
- Release introduced: v1.8.0.0. Confidence: high.
- Verify: `grep -n '^version' .skilled/skills/cli-external-orchestration/ROUTER.md .skilled/skills/cli-external-orchestration/SKILL.md`

### F6 — P2 — UX: two recommendations clear the 0.8 bar, and the framework has one instruction for that case

```
$ ... advisor_recommend '{"prompt":"ask cursor to fix the bug"}'
[{"id":"cli-external-orchestration", conf:0.95, route:["cli-cursor"]},
 {"id":"cli-classifier",           conf:0.82}]
```

Gate 2 of the operating framework says "Confidence ≥ 0.8 → MUST invoke skill". Two skills clear it. The agent must therefore either invoke both or silently pick one, and no surface states which — the hub wins on score (0.167 vs 0.079) but `cli-classifier` alone clears the threshold that is written as mandatory. Both of this iteration's real prompts routed correctly (`dsh` → `cli-deepseek-harness`, `cursor` → `cli-cursor`, both `selectionKind: single`), so this is a decision-rule gap rather than a routing error. [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:158]
- Release introduced: not a v4 regression; the raw hub gain in 1.8.0.0 widens it. Confidence: high on the observation.
- Verify: the command above; note the second recommendation's `confidence` field.

## Questions Answered

None ticked this iteration, deliberately. The open question is "Hub canon (v4.0.1.0): do the cli-external-orchestration and cli-classifier hubs **and every mode** follow the parent-hub canon and the rule that each skill routes from its own `ROUTER.md`?" I verified structure for `cli-external-orchestration`: all seven modes carry a `ROUTER.md` beside `SKILL.md`, the hub `SKILL.md` states the version contract, and both advisor probes resolved to a single correct mode. I did **not** run `package_skill.py --strict`, which v4.0.1.0 names as the enforcing gate ("A skill that keeps its router inside `SKILL.md`, or has no `ROUTER.md`, now fails `package_skill.py --strict`"), and the canon question is only answerable through that gate. Ticking it on file-existence evidence would claim a check I never ran.

Partial evidence recorded, question left open. Its scope has narrowed from "does the hub follow canon" to "does `package_skill.py --strict` pass".

## Questions Remaining

- **Hub canon (narrowed):** run `package_skill.py --strict` across the hub and its seven modes. Structure is present; conformance is unproven.
- **Over-engineering:** unresolved in the other direction — this iteration *falsified* one removal candidate (`mode-registry` `aliases` is live, F3) but the divergent pivot, legacy projection, idea lifecycle, observability and wave planner surfaces remain uncensused.
- **UX:** F6 adds a second UX instance (ambiguous multi-recommendation). `deep-research-auto.yaml` steps still unexamined.
- **Extension:** F1 and F3 now point at one concrete extension rather than several — generate `hub-router.json` `vocabularyClasses` and `mode-registry.json` `aliases` from `ROUTER.md` §3, so one edit updates all three and the drift class closes at the source.
- **Executor failure handling:** still unexamined (quota errors, builder throws, executor swap).
- **Single-executor dispatch:** the `if_cli_*` branch defects remain unexamined.

## Ruled Out

- **"`defaultMode: null` is a misconfiguration."** It is documented fail-closed design: `hub-router.json:5` plus the `discoveryClassesContract` at `:27-31` state that a prompt carrying only hub-identity vocabulary scores zero modes and takes the defer outcome. Both advisor probes returned a single named executors, consistent with the contract.
- **"Mode `aliases` are dead code."** Falsified — `executor-delegation.ts:212` reads them.

## Invariant That Held

v4.0.0.1's fan-out scoping holds at the hub: **zero** `fanout-run` references survive in any `cli-*/SKILL.md`. Every remaining hit sits in a `references/` doc, the manual-testing playbook or the feature catalog, and each is scoped to multi-lineage/parallel dispatch or to stress testing rather than to a single build dispatch. The one residual (a stale line *into* the runner, F4) is a reference-accuracy defect, not a violated scoping rule.

## Next Focus

Run `package_skill.py --strict` over `cli-external-orchestration` and its seven mode packets to close or refute the narrowed canon question, then census the `system-deep-loop` runtime surfaces for the removal test.
