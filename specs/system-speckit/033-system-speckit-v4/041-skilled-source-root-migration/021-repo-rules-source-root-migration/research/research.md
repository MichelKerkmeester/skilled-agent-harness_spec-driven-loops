---
title: "Rule-Corpus Relocation: Consumer Census and Reference Reconciliation"
description: "Which tracked surface names the rule corpus, what each one needs when the corpus moves under .skilled, and a disposition for every reference that remains. Reconciled against a three-iteration detached research run in research/lineages/deepseek."
trigger_phrases:
  - "rule corpus consumer census"
  - "repo-rules relocation reconciliation"
  - "root farm reference inventory"
importance_tier: "important"
contextType: "research"
---

# Rule-Corpus Relocation: Consumer Census and Reference Reconciliation

## 1. What this document is

The implementation plan asks for two to three research iterations inside this phase "to
reconcile the reference inventory this plan carries with a cited file:line census". That
ran as one bounded loop — a single lineage, three iterations, `max-iterations` stop
policy — and its synthesis is `research/lineages/deepseek/research.md`. This document is
the packet-level reconciliation: it maps every row the plan's inventory carries onto the
tree as measured, adds the rows the plan did not carry, and records a disposition for
every file that still names the corpus after the move.

## 2. Method and its one deviation

- **The loop.** Three iterations, one per question: Q1 the in-repo consumers outside
  `specs/`, Q2 generators, mirrors, CI and gate inputs, Q3 external consumers and checker
  portability. New-information ratios 0.95, 0.90, 0.85 against a 0.05 threshold that was
  telemetry only, because the stop policy was `max-iterations`.
- **The executor.** `cli-pi`, one lineage, model `deepseek-v4.1-flash`, on the operator's
  decision. The contract at `.skilled/commands/deep/research.md` is a thin router whose
  loop engine is the fan-out runner, and a Pi child that ran the command surface with
  `--executor=cli-pi` would dispatch `cli-pi` from inside a `cli-pi` stack, which the
  shared runtime refuses. The runner was therefore invoked directly with the same
  arguments the command would compute; `scratch/research-dispatch.sh` is the run's own
  record. That is a one-level deviation from the plan's command surface, not from its
  intent.
- **The census.** `rg -n --hidden "repo-rules"` over the tree with `specs/`,
  `node_modules/` and `.git/` excluded, snapshotted before and after at
  `scratch/rescan-census-before.txt` (422 lines) and `scratch/rescan-census-after.txt`
  (424 lines). Ripgrep needs `--hidden` here: without it the `.github`, `.claude`, `.pi`,
  `.codex` and `.hermes` hits are invisible while `.skilled` still reports.

## 3. Reconciliation: the plan's inventory against the tree

| Inventory row (plan) | Measured | Disposition |
|---|---|---|
| 13 corpus files under `repo-rules/` | 13 files, `git mv` each | Moved in a rename-only commit: 13 × `R100`, 0 insertions, 0 deletions. History follows through the move (`git log --follow` reaches 11 commits). |
| 13 rule-body backlinks to `../REPO%20RULES.md` | one per rule, lines 25-41 of each | Rewritten to `../../REPO%20RULES.md`. Check 7 resolves body links against the chosen rules directory, so the link and the resolution base changed together. |
| 26 router links in `REPO RULES.md` | 13 trigger rows (lines 40-52) + 13 index rows (60-72) | Re-pointed to `.skilled/repo-rules/<rule>.md`. |
| 5 `AGENTS.md` links | 9 instances on 5 lines: 28, 116, 144, 209, 261 (the Delivery sentence carries five) | All 9 re-pointed. The plan's "5" counts sites, not instances. |
| Corpus checker | 437 lines; layout hardcoded at lines 26, 46-48, 182-186, 412, and rows identified by prefix at 233 and 377 | Probe `.skilled/repo-rules` then `repo-rules`; fail naming both when neither exists; identify rows by resolving each link into a rules directory. The nine checks and the `RESULT: PASSED (9/9 checks)` line are untouched. |
| sk-doc `sk-create-repo-rule` skill | `SKILL.md`, `README.md`, `references/agents-md-integration.md`, `rule-anatomy.md`, `creation-standards.md`, `assets/repo-rule-template.md` | Re-pointed, and the destination is stated as the rules directory with both layouts named, so the skill stays portable. |
| `/create:repo-rule` command | `rules_dir` default, `rule_name` validation, `context_loading`, 2 presentation strings | `rules_dir` resolves to `.skilled/repo-rules/` first and falls back; the presentation strings print the resolved directory. The catalog description keeps the public name (see §5). |
| Two authored agent files | `.skilled/agents/markdown.md`, `orchestrate.md` | Re-pointed, with the Claude-dialect twin in `.claude/agents/` changed identically because body parity is a gate. |
| Hermes and other mirrors | `.pi/agents`, `.codex/agents`, `.hermes/skills` (agents and the two skill copies) | Regenerated from source, never hand-edited. |
| CI `repo-rules-corpus.yml` | 4 path filters and a fail-closed `GUARD` variable | `.skilled/repo-rules/**` added to both trigger blocks, `GUARD` re-pointed at the canonical script. |
| Benchmark harness | `generate-prompts.mjs` lines 69, 108-113, 127 | Both lanes probe canonical first: the working-tree lane reads `.skilled/repo-rules/`, and the recorded-commit lane falls back to `repo-rules/`, which is correct at a pre-move commit. |
| Retrieval note | `references/retrieval/retrieval-conventions.md` root table | Row renamed to `.skilled/repo-rules`, reachability cells corrected. |

### Rows the plan's inventory did not carry

| Surface | Hits | Disposition |
|---|---|---|
| `sk-create-repo-rule` manual-testing playbook (10 files) | 37 | **No change.** The scenarios name the rules directory by its public path, which the farm keeps resolving, and they are recorded transcripts with expected signals. |
| Hub registries and catalogs: `command-metadata.json`, `graph-metadata.json`, `hub-router.json`, `leaf-manifest.json`, `mode-registry.json`, `ROUTER.md`, `sk-doc/SKILL.md`, `.hermes/skills/sk-doc/SKILL.md`, `.skilled/commands/{README.txt,create/README.txt,create/repo-rule.md}` | 13 | **No change.** Every hit is a keyword, a trigger phrase, an asset filename or a routing label. The public name stays the label, which keeps one string out of three mirror surfaces a doctor check compares. |
| `assets/repo-rules-router-template.md` | 2 | **No change.** The template emits a router for a repository that has none, where `repo-rules/` is the destination. |
| `manual-testing-playbook/token-cost-baseline/max-load.md` | 2 | **No change.** A captured measurement; the hits are asset filenames. |
| `cases.json` | 3 | **No change.** The case set is frozen word-for-word from the measurement baseline, and the generator reads it rather than writing it, so "refresh through the generator" has no artifact to refresh. Its prompts are condition-agnostic: the coverage case keys on bare filenames, so a reply naming either spelling scores. |
| Retrieval fixtures and index: `trigger-index.json` (95), `corpus-manifest.json` (126), `generation-diagnostics.json` (31), `phrase-variants.json` (2) | 254 | **No change.** The generator walks `specs`, `.skilled/skills` and `.skilled/hooks`; the corpus is not a walked root, so moving it changes no phrase. The embedded corpus hash does cover the skill documents this change edits, so a `/doctor speckit-retrieval` run will classify the index stale until `/doctor:update` regenerates it; that doctor is read-only and owns no regeneration, and no workflow invokes it. Recorded as a follow-up. |
| Changelogs (3 files) | 18 | **No change, frozen.** |
| `.git` (worktree gitdir file) | 1 | Not a repository file. |

## 4. The three breakages the census found, and what prevents them now

1. **Backlinks.** From `.skilled/repo-rules/`, `../REPO%20RULES.md` resolves to a
   nonexistent `.skilled/REPO RULES.md`. Check 7 now resolves body links against the
   chosen rules directory and the links climb the extra level, so both layouts resolve.
2. **CI filter staleness.** `repo-rules/**` alone stops firing on a canonical edit, which
   would let the corpus gate go quiet after a rule-body change. `.skilled/repo-rules/**`
   is now listed in both trigger blocks.
3. **Row recognition.** `startsWith('repo-rules/')` reports every rule as unrowed once the
   rows name the canonical path. Rows are now identified by where their link resolves,
   which also keeps the mid-move state green.

Everything else that looked breakable was not: the 26 router links, the 9 `AGENTS.md`
links and the sibling links all keep resolving through the farm, which is why a missed
re-point cannot be caught by a link checker and is caught by this rescan instead.

## 5. Where the census disagreed with the plan, and what was done

1. **`.opencode/repo-rules/**` is required beside the new filter.**
   `check-gate-inputs.sh` (filter-twins, lines 113-116 and 413) fails any path filter
   naming one source root without its twin in the same `paths:` block. The canonical
   filter therefore carries an inert `.opencode/repo-rules/**` twin, with the reason
   written into the workflow beside it. `twin_pairs` moved 211 → 215.
2. **`.claude/agents/**` is not generated.** The plan expected regeneration for it; it is
   the hand-authored Claude-dialect twin whose body parity with `.skilled/agents/**` is
   what `check-agent-mirror-sync.cjs` enforces. Both sides were edited identically, and
   the generated trees (`.pi`, `.codex`, `.hermes`) were regenerated from source.
3. **The sibling recipe names the canonical source.** The example in
   `references/agents-md-integration.md` now points a sibling at
   `Public/.skilled/repo-rules/<rule>.md`, and the paragraph states that the public
   `repo-rules/<rule>.md` path stays resolvable, so the siblings that already point there
   are unaffected. Re-pointing them is out of scope and needs the operator's go-ahead.
4. **`creation-standards.md` carries a stale count.** "194 phrases across the 11 files"
   is 252 across 13 at this revision. The path was re-pointed; the count was left alone,
   because a stale figure is not this change's to fix and silently correcting it would
   hide the drift. Recorded here as an observed, unfixed defect.
5. **A frozen path changed, by the commit gate.** The compiled-routing activation manifest
   `.skilled/bin/lib/compiled-routing/.../activation/sk-doc/manifest.json` is derived from
   a hash of its hub's routing inputs, and editing a skill document invalidates it. The
   pre-commit gate re-minted and staged it (`effectivePolicyHash`, one line). The
   verification script asserts that this is the only frozen-path modification and that it
   differs by that hash.

## 6. Verification

`bash <packet>/scratch/verify.sh` runs every row this change makes a claim about and
prints one line per row; the committed receipt is `scratch/verify-run.txt`
(`RESULT: PASSED (passed=19 failed=0)`). Two rows are behavioral rather than structural:

- **Farm integrity** (`scratch/check-farm.cjs`): every canonical file has exactly one
  root link, every link resolves, every target is `../.skilled/repo-rules/<name>`, and the
  farm holds nothing else. Recorded as its own check because the corpus checker is pinned
  at nine checks and a tenth would change its verdict contract.
- **Plain layout** (fixture inside `verify.sh`): a temporary tree with `repo-rules/`, no
  `.skilled` root and a checker copy still prints `RESULT: PASSED (9/9 checks)`, which is
  the portability claim the skill makes about repositories that carry no source root.
