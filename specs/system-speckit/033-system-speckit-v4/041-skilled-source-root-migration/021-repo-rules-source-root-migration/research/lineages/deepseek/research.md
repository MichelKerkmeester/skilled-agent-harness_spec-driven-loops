---
title: "Rule-corpus consumer census — detached research synthesis (deepseek lineage)"
trigger_phrases: []
---
# Rule-corpus consumer census — detached research synthesis (deepseek lineage)

**Lineage:** `deepseek`
**Session:** `fanout-deepseek-1789890318556-in1rmm`
**Loop:** `research`, 3 iterations, `max-iterations`
**Artifact root:** `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/021-repo-rules-source-root-migration/research/lineages/deepseek`
**Stop reason:** `maxIterationsReached`

## 1. Executive Summary

Every live consumer of the rule corpus lives in one of three rings. The **in-repo ring** is 26 router links in `REPO RULES.md`, 9 link instances on 5 lines in `AGENTS.md`, 13 rule-body backlinks, the corpus checker and its skill/command/playbook surfaces, two authored agent files, and one benchmark generator lane. The **generated ring** is the runtime mirrors: `.claude/agents`, `.pi/agents`, `.codex/agents` and `.hermes/skills`, all regenerated from `.skilled/agents/*.md` and the skill `SKILL.md` files, plus four derived retrieval artifacts whose single `manifestHash` couples them. The **external ring** is one observable sibling repository (and its worktrees) whose absolute symlinks point into the main checkout's `Public/repo-rules/<rule>.md`.

What breaks without re-pointing is narrower than it looks, and the farm hides most of it. Link resolution survives everywhere because the per-entry farm keeps `repo-rules/<rule>.md` resolving: the 26 router links, the 9 `AGENTS.md` links and the sibling links all still open a file. Three breakages are real. The 13 rule-body backlinks resolve to a nonexistent `.skilled/REPO RULES.md` once bodies move, so checker check 7 fails unless the links and the resolution base change together. The CI path filter `repo-rules/**` stops firing on edits under `.skilled/repo-rules/**`, so the corpus gate goes silently stale. And the checker's `startsWith('repo-rules/')` row detectors stop recognizing canonical rows, reporting every rule as unrowed.

The checker's remedy is settled by the phase plan: probe `.skilled/repo-rules` then `repo-rules`, fail naming both when neither exists, identify router rows by resolving each link and requiring it to land inside the chosen directory (which also makes the mid-move state pass), and keep the nine checks and their output untouched. Farm integrity is a separate phase-verification script, not a tenth check. The generated ring must be regenerated in the same change: mirror `--check` runs, plus a byte-determinism re-run of the trigger-index pipeline, whose four artifacts all embed a hash over every walked document.

## 2. Scope and Boundary

This detached lineage wrote only under its bound artifact root. It did not modify the corpus, the packet docs, the runtime mirrors, CI, hooks, or git state. `resolveArtifactRoot` was skipped because the configured fan-out override bound `artifact_dir` directly.

Claims carry `[SOURCE: file:line]` citations into the worktree at `/Users/michelkerkmeester/worktrees/public/056-repo-rules-source-root-migration`. Statements that could not be confirmed by reading are marked INFERRED or UNKNOWN. All counts were measured, not remembered: 26 router links by `rg -o | wc -l`, 9 `AGENTS.md` instances on 5 lines, 13 backlinks, 13 corpus files, one sibling repository found on disk.

## 3. Method

Three forced-depth iterations, one per question, each externalized to `iterations/iteration-00N.md` with a delta in `deltas/iter-00N.jsonl`:

- Iteration 1 (Q1, newInfoRatio 0.95): the outside-`specs/` consumer census, read from the corpus, the router, `AGENTS.md`, the checker in full, and every naming surface found by tree-wide grep.
- Iteration 2 (Q2, 0.90): mirror topology and generators, checker-to-mirror mapping, both gate surfaces line by line, and the trigger-index artifact pipeline with its test contract.
- Iteration 3 (0.85): the sibling link contract and observed links, the plan's checker contract, the farm-check placement, and the markdown gate's real coverage.

Convergence was telemetry only, per the `max-iterations` stop policy: rolling averages 0.95 → 0.925 → 0.9 against a 0.05 threshold, `legalStop: false` each pass. The loop ran all three configured iterations instead of synthesizing early.

## 4. Q1 — In-repo consumers outside `specs/`

### 4.1 The router and the root document

| Consumer | Measured | Live path | Change |
|---|---|---|---|
| `REPO RULES.md` §2 trigger table | 13 rows, lines 40-52 | `repo-rules/<rule>.md` | re-point to `.skilled/repo-rules/<rule>.md` |
| `REPO RULES.md` §3 index | 13 rows, lines 60-72 | `repo-rules/<rule>.md` | re-point (26 links total) |
| `AGENTS.md` | 9 link instances on 5 lines: 28, 116, 144, 209, 261 (the §8 sentence carries five) | `repo-rules/<rule>.md` | re-point all 9 |

The spec says "`AGENTS.md` (5)" while the file carries 9 instances. The "5" most plausibly counts link sites (lines) or the five-link §8 sentence; INFERRED, and the implementation re-points all instances regardless. [SOURCE: REPO RULES.md:40-52,60-72] [SOURCE: AGENTS.md:28,116,144,209,261] [SOURCE: spec.md:109]

### 4.2 The 13 body backlinks

Each rule body carries exactly one `../REPO%20RULES.md` backlink: `evidence-and-proof.md:32`, `uncertainty-and-honesty.md:28`, `communication-decisions.md:35`, `communication.md:37`, `prevent-overengineering.md:32`, `scope-discipline.md:30`, `communication-prose.md:25`, `root-cause-and-debugging.md:29`, `communication-handoff.md:41`, `skill-hub-routing.md:29`, `answer-the-actual-request.md:30`, `blast-radius.md:28`, `delegation-and-orchestration.md:32`. From `.skilled/repo-rules/`, the link must become `../../REPO%20RULES.md`; the checker resolves body links against the chosen rules directory, so both layouts keep resolving. [SOURCE: rg over repo-rules/ for `REPO%20RULES`] [SOURCE: check-repo-rules.cjs:327-328]

### 4.3 The corpus checker

`check-repo-rules.cjs` (437 lines) hardcodes the layout in four places: `RULES_DIR = 'repo-rules'` (line 26), `findRepoRoot` requiring the directory (lines 46-48), `loadContext` reading it (lines 182, 186), and the missing-root error (line 412). Router-row identification is a string prefix at `checkWiring` line 233 and `checkIndexSummaries` line 377. The nine checks (lines 397-407) and `RESULT: PASSED (9/9 checks)` (line 426) stay; HEAD prints `FAILED (8/9)` because `answer-the-actual-request.md` has 3 dividers against 8 sections, which the phase fixes in its own commit. [SOURCE: check-repo-rules.cjs:26,46-48,182-186,233,377,397-407,426] [SOURCE: spec.md:69-70,90]

### 4.4 Skill, command, agents, benchmark

- `sk-create-repo-rule` surface: `SKILL.md:170`; `README.md:26,86,177,178,179`; `references/rule-anatomy.md:17,22`; `references/creation-standards.md:75`; `references/agents-md-integration.md:134,141,156-161,174`; and the playbook across `manual-testing-playbook.md:34`, `rule-decision/*` (32,46,52-53,61,65), `lifecycle-and-wiring/*` (48,52-55,59,96), `rule-authoring/*` (22,34,46-56,76,78). The sibling-shape lines in `agents-md-integration.md` describe the external contract and should keep the root farm path for siblings — flagged as a judgment call. [SOURCE: rg hits; spec.md:111]
- `/create:repo-rule`: `repo-rule.md:2,13`; `create-repo-rule-auto.yaml:31,103,113,114,131,136,172,188,222,239`; `create-repo-rule-confirm.yaml:44,116,126,127,144,149,187,205,241,258`; `create-repo-rule-presentation.txt:103,108`; `commands/README.txt:149`; `commands/create/README.txt:57`. The `rules_dir` bindings (auto:113, confirm:126) and presentation strings must stay layout-aware for repositories without `.skilled/`. [SOURCE: rg hits; spec.md:112]
- The two authored agent files: `.skilled/agents/orchestrate.md:850`, `.skilled/agents/markdown.md:203`. [SOURCE: rg hits; spec.md:113]
- Benchmark generator: working-tree lane reads `repo-rules` (`generate-prompts.mjs:69,127`), historical lane reads the rule-set commit (`:108-113`); only the working-tree lane goes canonical. `cases.json:18,27,54` names the path only inside prompt text. [SOURCE: generate-prompts.mjs:69,108-113,127; spec.md:116]
- No-change surfaces per spec §3: hub-registry keyword lists (`hub-router.json:372`, `mode-registry.json:515`, `ROUTER.md:161`), `leaf-manifest.json:144`, the router template (`:75,83`), `graph-metadata.json:319`, the token-cost baseline, and all changelogs. [SOURCE: spec.md:98-101]

## 5. Q2 — Generators, mirrors, CI and gate inputs

### 5.1 Mirror topology

Authored agents are `.skilled/agents/*.md`; `.opencode/agents` is a symlink to it, and both agent generators read `.skilled/agents` as `SOURCE_DIR`. `.claude/agents/*.md` is a real-file mirror whose body parity is required (`mirror-sync-verify.cjs:18-22`), and it is also the Claude-dialect source for the `.cursor`/`.devin` symlink mirrors (`sync-runtime-mirrors.cjs:36-40,65-67,121`). `.pi/agents/*.md` and `.codex/agents/*.toml` are generated by `sync-agents-pi.cjs` and `sync-agents.cjs`. `.hermes/skills/*/SKILL.md` is generated from every skill `SKILL.md` plus `.skilled/agents/*.md` (as `agent-<name>` skills). [SOURCE: sync-agents.cjs:23-25; sync-agents-pi.cjs:21-23; sync-skills-hermes.cjs:20-38]

Mirrors currently carrying `repo-rules` text, therefore in the regeneration set: `.claude/agents/{markdown,orchestrate}.md`, `.pi/agents/{markdown,orchestrate}.md`, `.codex/agents/{markdown,orchestrate}.toml`, `.hermes/skills/agent-{markdown,orchestrate}/SKILL.md`, plus `.hermes/skills/{sk-create-repo-rule,sk-doc}/SKILL.md` from the skill-doc edits. [SOURCE: rg -l "repo-rules" over the four mirror trees]

### 5.2 Which script checks each

| Surface | Checker | Wired by |
|---|---|---|
| `.claude` + `.codex` + `.opencode` bodies | `check-agent-mirror-sync.cjs` | `agent-mirror-sync.yml:17,29`; pre-commit:104-128 |
| `.codex` generation | `sync-agents.cjs --check` | `spec-kit-check.yml:159`; pre-commit:193 |
| Five-runtime roster (incl. `.pi` presence, cursor/devin link resolution) | `agent-roster-mirror-check.cjs` | `spec-kit-check.yml:161`; pre-commit:195 |
| `.hermes/skills` | `sync-skills-hermes.cjs --check` | `command-tree-parity.yml:65` |
| `.pi` bodies | `sync-agents-pi.cjs --check` | documented (`.pi/SYNC.md:103`), **no CI invocation found** — INFERRED gap |

[SOURCE: files as cited in the table]

### 5.3 The two gate surfaces

`repo-rules-corpus.yml` keys on four path filters in both PR and push blocks (`REPO RULES.md`, `repo-rules/**`, and the checker spelled under both roots; lines 5-16) and runs a fail-closed guard at `.opencode/skills/.../check-repo-rules.cjs` (lines 32-39). After the move, `repo-rules/**` alone no longer fires on canonical edits. Adding `.skilled/repo-rules/**` interacts with the gate-inputs twin rule: filter entries matching `^!?\.(opencode|skilled)/` must carry their opposite-root twin in the same `paths:` group, so `.skilled/repo-rules/**` requires `.opencode/repo-rules/**` beside it, or the gate fails with "path filter … has no twin". Entries spelled `repo-rules/**` are not twin-checked. [SOURCE: repo-rules-corpus.yml:5-16,32-39] [SOURCE: check-gate-inputs.sh:113-116,356,369,413]

`check-gate-inputs.sh` enforces five rules — `gate-files`, `hook-inputs`, `workflow-inputs`, `filter-twins`, `parser-miss` (header lines 12-29) — selecting `.skilled` with `.opencode` fallback (lines 50-51). Its twin vocabulary is strictly `.opencode` ↔ `.skilled`; `repo-rules` and its canonical home are outside it. The check runs from `gate-inputs.yml` on push to `main`/`skilled/**`, PRs and dispatch, with its fixture suite and the hook test suites. [SOURCE: check-gate-inputs.sh:12-29,50-51,353-376] [SOURCE: gate-inputs.yml:3-6,17-20,27-43]

### 5.4 Trigger index and derived artifacts

The generator walks exactly `['specs', '.skilled/skills', '.skilled/hooks']` and deliberately excludes the five runtime mirrors and the root README; `repo-rules/` is not a walked root. It publishes `runtime/data/trigger-index.json` plus `fixtures/corpus-manifest.json`, `fixtures/generation-diagnostics.json`, `fixtures/phrase-variants.json`. One corpus hash folds every walked file as `path + NUL + content + LF`; one `manifestHash` is computed once and embedded across the artifact set; `publishJson` writes atomically via temp file and rename. [SOURCE: lib/corpus.mjs:20-29,43-50] [SOURCE: generate-trigger-index.mjs:64-67,141-145,211,217,225,276,285] [SOURCE: lib/artifact.mjs:108-128]

Byte-identical regeneration **for an unchanged corpus** is a tested property: a second run produces a byte-identical artifact, the published text equals the canonical `stableStringify` serialization, and `manifest.manifestHash === index.manifestHash` with `variants.manifestHash === index.manifestHash`. The documented determinism drill diffs `indexSha256` across two runs. There is no `--check`/dry-run mode: a run publishes or refuses, so drift verification is regenerate-and-diff — an implementation step, not a read-only check. [SOURCE: trigger-index.vitest.ts:152,169,185,376,407-408] [SOURCE: README.md:136-145] [SOURCE: generate-trigger-index.mjs:27,31,449-486]

Because the migration edits walked documents, the corpus hash and `manifestHash` change and all four artifacts are rewritten together even though the phrase inventory is unaffected by moving `repo-rules/`. The five captured-once fixtures pin their snapshot's hash and are not refreshed; a manifest whose hash disagrees with the committed index is what `/doctor speckit-retrieval` flags, and no CI workflow invokes that doctor check (absence-of-hits, INFERRED). [SOURCE: README.md:76-78]

## 6. Q3 — External consumers and portability

### 6.1 What siblings link into

The documented contract is a relative symlink in the sibling's `repo-rules/` pointing at `../../Code_Environment/Public/repo-rules/<rule>.md`, plus a `.gitignore` entry and both router rows. The observable sibling at this snapshot (`MEGA/Development/Obsidian Plugin`) uses **absolute** targets into the main checkout — e.g. `communication.md -> /…/Code_Environment/Public/repo-rules/communication.md` — with 10 shared links and 3 local rules; its worktrees each carry their own `repo-rules` directories. The farm is what keeps these resolving after the move: sibling targets stay `Public/repo-rules/<rule>.md`, which becomes a farm link to `../.skilled/repo-rules/<rule>.md`. Siblings stay live during the phase because they read the main checkout, not the worktree, and are proven after merge. The specs say three sibling repositories; only one is visible on disk here, so the count is UNKNOWN from this vantage. Re-pointing siblings is explicitly out of scope. [SOURCE: agents-md-integration.md:141-181] [SOURCE: ls/readlink on the sibling] [SOURCE: spec.md:95-97,164-165,221-222] [SOURCE: parent spec.md:145]

### 6.2 The portable checker

The plan's contract verbatim: probe `.skilled/repo-rules` then `repo-rules`, fail naming both probed paths when neither exists; identify router rows "by resolving each link and requiring it to land inside the chosen rules directory, not by string prefix"; keep the nine checks and output format unchanged. Mapped onto the script: probe pair replaces `RULES_DIR` (:26); `findRepoRoot` (:46-48) and error (:412) become probe-aware; `loadContext` reads the chosen directory (:182,186); the two prefix detectors (:233,:377) become resolved-containment tests; everything else, including `RESULT: PASSED (9/9 checks)` (:426), is untouched. [SOURCE: plan.md:144-150] [SOURCE: check-repo-rules.cjs:26,46-48,182-186,233,377,426]

The mid-move requirement discriminates the resolution mechanics: the checker must pass while files are moved but the farm is not yet committed (rows may still name `repo-rules/<rule>.md`), so containment must follow the symlink (realpath-style) rather than compare lexical prefixes. A row that resolves into an unrelated directory is skipped as the spec's edge case requires. The realpath detail is INFERRED from the mid-move edge case and the "not by string prefix" wording. [SOURCE: spec.md:194,201] [SOURCE: plan.md:144-150]

Body-link resolution follows the chosen directory, so `../../REPO%20RULES.md` resolves canonically and `../REPO%20RULES.md` resolves in a legacy-only checkout; REQ-003's portability fixture (only `repo-rules/`, no `.skilled/`) then reaches the same 9/9 verdict. [SOURCE: check-repo-rules.cjs:327-328] [SOURCE: spec.md:130,194]

### 6.3 Farm integrity and verification surfaces

Farm integrity is a separate phase-verification script — planned as `bash "$PKT/scratch/verify.sh"` (farm integrity, rescan, derivation freshness), not yet present — because REQ-003 pins the checker at nine checks. It must assert: every rule file covered by exactly one root symlink and no extra symlink; every target `../.skilled/repo-rules/<rule>.md`, none leaving the repository root; dangling links reported; each uncovered rule file listed; and `ls -L repo-rules` listing the 13 rules for SC-002. [SOURCE: plan.md:159] [SOURCE: spec.md:91-92,130,151-152,162,181,198]

One observed mismatch to plan around: `check-markdown-links.cjs` walks only the skills/commands/agents roots (`ROOTS` at lines 23-26) with no way to extend them via CLI, so it checks the two authored agent files but never walks `AGENTS.md` or `REPO RULES.md`; the workflow's path filters also exclude both files. The plan's AGENTS.md verification row names this checker anyway. And because the farm keeps `repo-rules/**` resolving, no link checker can detect a missed re-point — both spellings resolve — so REQ-002 compliance rests on the phase's rescan inventory. [SOURCE: check-markdown-links.cjs:23-26,185,189-190] [SOURCE: markdown-link-integrity.yml:7-27] [SOURCE: plan.md:88,96-99]

## 7. What Breaks Without Re-pointing, and What Does Not

Real breakages (three):

1. **Body backlinks** resolve to a nonexistent `.skilled/REPO RULES.md` after the move; checker check 7 fails unless links and the resolution base change together. [SOURCE: path arithmetic on the farm target; check-repo-rules.cjs:327-328]
2. **CI filter staleness**: `repo-rules/**` stops firing on `.skilled/repo-rules/**` edits, so the corpus gate silently stops running. [SOURCE: repo-rules-corpus.yml:5-16]
3. **Row recognition**: the `startsWith('repo-rules/')` detectors report every rule as "no trigger row / no index row" once rows name the canonical path. [SOURCE: check-repo-rules.cjs:233,377]

Not breakage, despite appearances: the 26 router links, the 9 `AGENTS.md` links, and the sibling links. The farm keeps all of them resolving; re-pointing them is a REQ-002 consistency obligation, enforced by the phase's rescan rather than by any resolution check. [SOURCE: spec.md:73-75,95-97,129; plan.md:96-99]

## 8. Open Questions and Boundaries

- Which three sibling repositories the specs count; only one is observable on this machine. UNKNOWN.
- Whether containment uses `realpath` or an equivalent. The contract is behavioral; the mid-move edge case fixes the requirement, not the syscall. INFERRED design.
- Whether the implementation adds `.opencode/repo-rules/**` to the workflow filters beside `.skilled/repo-rules/**` (required by the twin rule if the canonical filter is added) or keeps the farm filter only. Implementation decision with a gate consequence.
- The exact placement of the farm-integrity script: the plan names `scratch/verify.sh`; the file does not exist yet.
- Byte-identical regeneration beyond same-corpus: pre-move artifact bytes are not preserved once walked docs change; the guarantee is determinism and same-change regeneration, not byte stability across the migration.

## 9. Sources

Primary sources are cited inline. The heaviest: `REPO RULES.md`, `AGENTS.md`, `repo-rules/*.md`, `check-repo-rules.cjs` (full read), `check-gate-inputs.sh`, `generate-trigger-index.mjs` + `lib/corpus.mjs` + `lib/artifact.mjs` + `trigger-index.vitest.ts`, the four sync/check scripts and `mirror-sync-verify.cjs`, six workflow files, four hooks lines, the packet `spec.md`/`plan.md`, the skill `references/agents-md-integration.md`, and the live sibling filesystem. Full per-iteration citations live in `iterations/iteration-001.md` through `iteration-003.md`; machine-readable findings in `deltas/` and `findings-registry.json`.
