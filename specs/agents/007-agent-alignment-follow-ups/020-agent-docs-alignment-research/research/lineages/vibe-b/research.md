---
title: "Agent Documentation Alignment — vibe-b Lineage Synthesis"
description: "Doc lines across README.md, AGENTS.md, CROSS-CLI.md, the runtime sync docs, skill docs and playbooks that misdescribe the eleven agents or their runtime copies."
---

# Agent Documentation Alignment — vibe-b Lineage Synthesis

## 1. Executive Summary

Thirteen doc lines misdescribe the eleven-agent roster or its runtime copies. They fall into four classes: an undercounted runtime-tree inventory (five lines), a wrong mode count (one line), a self-contradicting sync contract (two lines), and a status vocabulary that lost a value (one line). Four further lines make role or inventory claims that the agent frontmatter contradicts or that only hold under a narrow reading.

The dominant pattern is **enumeration drift**: the repo's agent documentation was written when fewer runtime trees existed, and every list that enumerates the trees is now short by two (`.dsh/agents/` and `.vibe/agents/`). The second pattern is **contract drift inside a single file**: `.vibe/SYNC.md` states in one paragraph that `mode` becomes `agent_type` and sixteen lines later that `mode` does not travel at all.

Nothing here is a broken link or a missing file. Every cited path resolves; the drift is in what the prose says about the paths.

## 2. Research Question

Do the READMEs, `AGENTS.md`, `CROSS-CLI.md`, runtime sync docs, skill and command docs, feature catalogs and manual testing playbooks describe the current eleven agents (`.skilled/agents/*.md` and `agent-registry.json`) and their runtime copies (`.claude`, `.codex`, `.cursor`, `.devin`, `.dsh`, `.opencode`, `.pi`, `.vibe` agent folders) correctly? Find each doc line that misdescribes an agent's role, tools, status values, routing, file location, model pin or sync mechanism, and cite both the doc line and the agent or generator file it contradicts. Changelogs, `specs/` and archived packets are excluded.

## 3. Methodology

Two iterations, each with a different comparison target.

- **Iteration 1** compared doc claims against the filesystem: the roster in `.skilled/agents/`, the eight runtime agent directories, and the repo's own translation contract at `.skilled/bin/agent-mirror-crosswalk.md`. It covered file location and sync mechanism.
- **Iteration 2** compared doc claims against agent frontmatter blocks and sibling skill docs: the `.vibe/SYNC.md` profile contract, the iteration status enums in the two deep-loop skill docs, and the README's eleven per-agent role paragraphs. It covered role, tools, status values and routing.

Both iterations verified the claims that turned out to be *correct* as carefully as the ones that were wrong. That produced a large Eliminated Alternatives section and kept the finding list from inflating.

## 4. Scope and Boundaries

- **In scope**: `README.md`, `AGENTS.md`, `.skilled/CROSS-CLI.md`, `.skilled/agents/README.txt`, `.skilled/bin/agent-mirror-crosswalk.md`, `.skilled/bin/README.md`, `.vibe/SYNC.md`, `.dsh/SYNC.md`, `.skilled/skills/*/SKILL.md`, `.skilled/skills/*/feature-catalog/`, `.skilled/skills/*/manual-testing-playbook/`, and the two roster checkers.
- **Out of scope**: changelogs, `specs/` packets, archived research packets, and the agent bodies themselves except where a doc makes a claim about them.
- **Not done**: the repo's own gates (`sync-agent-roster.cjs --check`, `check-agent-mirror-sync.cjs --all`, `agent-roster-mirror-check.cjs`) were not run. They are repo-wide tooling and this lineage's write surface is its own directory.

## 5. Agent Roster Ground Truth

Eleven agents, from `.skilled/agents/*.md` and `agent-registry.json`:

| Agent | Tier | `mode` | `temperature` | `task` | Notable permission facts |
|---|---|---|---|---|---|
| `context` | LEAF | subagent | 0.1 | deny | `write`/`edit`/`bash`/`patch` deny — genuinely read-only |
| `deep-research` | LEAF | subagent | 0.1 | deny | `webfetch` allow |
| `ai-council` | LEAF | subagent | 0.1 | **allow** | `bash` deny; Depth 0 delegation exception |
| `markdown` | LEAF | **all** | 0.1 | deny | body calls itself "LEAF-only" |
| `review` | LEAF | subagent | 0.1 | deny | `write`/`edit` deny — genuinely read-only |
| `deep-review` | LEAF | subagent | 0.1 | deny | `write`/`edit`/`bash` **allow**; no `external_directory` key |
| `code` | LEAF | subagent | 0.1 | deny | `external_directory` deny |
| `debug` | LEAF | subagent | **0.2** | deny | operator-only dispatcher |
| `design` | LEAF | subagent | **0.2** | deny | — |
| `prompt-improver` | LEAF | subagent | 0.1 | deny | `write`/`edit`/`bash` deny |
| `orchestrate` | ORCHESTRATOR | **primary** | 0.1 | **allow** | `list`/`glob`/`grep` deny |

Mode split: **nine** `subagent`, one `all`, one `primary`.

Eight runtime agent trees each carry all eleven: `.claude/agents/` (11 `.md` + `Explore.md` + `README.txt`), `.codex/agents/` (11 `.toml`), `.cursor/agents/` (11 `.md` symlinks), `.devin/agents/` (11 `<name>/AGENT.md` symlinks), `.dsh/agents/` (11 `.patch.yml`), `.opencode/agents/` (a symlink to `../.skilled/agents`), `.pi/agents/` (11 `.md`), `.vibe/agents/` (11 `.toml`).

## 6. Findings — Roster and Runtime-Tree Inventory

**F1.** `.skilled/bin/agent-mirror-crosswalk.md:16` states "Six runtime trees ship the same eleven agents: `.skilled/agents/`, `.claude/agents/`, `.cursor/agents/`, `.pi/agents/`, `.codex/agents/` and `.devin/agents/`." `.dsh/agents/` and `.vibe/agents/` also ship all eleven and are omitted; the file's frontmatter description repeats the "six" count. [SOURCE: .skilled/bin/agent-mirror-crosswalk.md:16] [SOURCE: .skilled/CROSS-CLI.md:77] [SOURCE: .skilled/CROSS-CLI.md:78]

**F2.** `.skilled/bin/agent-mirror-crosswalk.md:121` states "`.skilled` declares `mode: subagent` for ten agents, `mode: all` for `markdown` and `mode: primary` for `orchestrate`." The split is nine / one / one, and the sentence's three counts sum to twelve against an eleven-agent roster. [SOURCE: .skilled/bin/agent-mirror-crosswalk.md:121] [SOURCE: .skilled/agents/markdown.md:5] [SOURCE: .skilled/agents/orchestrate.md:5]

**F3.** `README.md:963` states the eleven agents are "mirrored for Claude Code, Codex, Cursor, Devin and Pi (`.<runtime>/agents/`)". `.dsh/agents/` and `.vibe/agents/` are omitted, so the README names five of seven runtime copies while `AGENTS.md:282` names all eight. [SOURCE: README.md:963] [SOURCE: AGENTS.md:282]

**F4.** `.skilled/CROSS-CLI.md:57` states "`.skilled/agents/` is canonical for the Claude fork, the Codex TOMLs and the Pi copies, while `.claude/agents/` is canonical for Cursor and Devin." The same file's generator table attributes `.dsh/agents/` to `sync-agents-dsh.cjs` and `.vibe/agents/` to `sync-agents-vibe.cjs`, both reading `.skilled/agents/`. [SOURCE: .skilled/CROSS-CLI.md:57] [SOURCE: .skilled/CROSS-CLI.md:77] [SOURCE: .skilled/CROSS-CLI.md:78]

**F5.** `.skilled/agents/README.txt:8` states "Sibling runtime: .claude/agents/ (.md)" — one sibling, while seven runtime copies exist and the same file's next paragraph already refers to "the `.codex` and `.pi` trees". [SOURCE: .skilled/agents/README.txt:8] [SOURCE: .skilled/agents/README.txt:5]

## 7. Findings — Sync Mechanism Claims

**F6.** `.skilled/bin/check-agent-mirror-sync.cjs:6` states "Every agent is authored once under `.opencode/agents/<name>.md`". `.skilled/bin/agent-mirror-crosswalk.md:30` designates `.skilled/agents/` as the "authored source of truth", and `.opencode/agents` is a symlink to `../.skilled/agents`, so the two paths are the same file rather than two authoring locations. [SOURCE: .skilled/bin/check-agent-mirror-sync.cjs:6] [SOURCE: .skilled/bin/agent-mirror-crosswalk.md:30]

**F7.** `.skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs:57`-`:68` enumerates roster surfaces as `cursor`, `devin`, `opencode`, `codex` and `pi`. `.dsh/agents/` and `.vibe/agents/` are absent from both the `LINKED` and `AUTHORED` lists, so the check that `.skilled/bin/agent-mirror-crosswalk.md:58` advertises as failing "when a runtime is missing an agent" cannot see two of the eight runtime trees. [SOURCE: .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs:57] [SOURCE: .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs:65] [SOURCE: .skilled/bin/agent-mirror-crosswalk.md:58]

**F8.** `.vibe/SYNC.md:37` states "One `.toml` per `.skilled/agents/*.md`, `README.md` excepted". The exception file is `.skilled/agents/README.txt`; there is no `README.md` in `.skilled/agents/`. [SOURCE: .vibe/SYNC.md:37] [SOURCE: .skilled/agents/README.txt:1]

**F9.** `.vibe/SYNC.md:39` labels its second column "`mode` (dropped)" and `.vibe/SYNC.md:53` states "the OpenCode `permission` map and the `mode` value do not travel into Vibe." Both contradict `.vibe/SYNC.md:37` in the same section, which says the render "adds `agent_type = \"subagent\"` when the source declares `mode: subagent`", and contradict the generated tree: nine of eleven `.vibe/agents/*.toml` carry `agent_type = "subagent"`. `mode` does travel, as `agent_type`; only `all` and `primary` are dropped. [SOURCE: .vibe/SYNC.md:39] [SOURCE: .vibe/SYNC.md:53] [SOURCE: .vibe/SYNC.md:37] [SOURCE: .vibe/agents/context.toml:3]

## 8. Findings — Role and Tool Surface

**F10.** `README.md:1017` describes Deep Review as "audits one review pass, read-only on code". `.skilled/agents/deep-review.md:7`-`:9` grants `write: allow`, `edit: allow` and `bash: allow`, so the agent is not read-only by tool surface; only its behavioral rule forbids code changes (`.skilled/skills/system-deep-loop/deep-review/SKILL.md:260`). The contrast is sharpest against `review`, which genuinely is read-only and which `README.md:983` describes as "never edits". [SOURCE: README.md:1017] [SOURCE: .skilled/agents/deep-review.md:7] [SOURCE: .skilled/skills/system-deep-loop/deep-review/SKILL.md:260] [SOURCE: README.md:983]

**F11.** `.skilled/agents/README.txt:9` states "Inventory rule: if an agent file is not present in this directory, it is not a live runtime surface here." `.claude/agents/Explore.md` is a live runtime surface in the sibling tree the previous line names, and is not present in `.skilled/agents/`. The rule holds only if "here" is read as strictly `.skilled/agents/` (and, through the symlink, `.opencode/agents/`). [SOURCE: .skilled/agents/README.txt:9] [SOURCE: .skilled/agents/README.txt:8] [SOURCE: .claude/agents/Explore.md:1]

## 9. Findings — Status Vocabulary

**F12.** `.skilled/skills/system-deep-loop/deep-review/SKILL.md:264` gives the iteration status enum as `complete | timeout | error | stuck | insight` — five values. `.skilled/agents/deep-review.md:236` allows six, adding `thought`, and the deep-research sibling at `.skilled/skills/system-deep-loop/deep-research/SKILL.md:225` lists all six. The deep-review skill doc omits the analytical-only status and its explanatory list at `:266` explains only `insight`. [SOURCE: .skilled/skills/system-deep-loop/deep-review/SKILL.md:264] [SOURCE: .skilled/agents/deep-review.md:236] [SOURCE: .skilled/skills/system-deep-loop/deep-research/SKILL.md:225]

## 10. Findings — Routing and Model Pins

**F13.** `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/template-compliance-contract-enforcement-blocks-non-compliant.md:184` tells the operator to "Inspect ... `.skilled/agents/speckit.toml`". No `speckit` agent exists in the roster, and `.skilled/agents/` holds `.md` files, not `.toml`. The same file's evidence block at lines 64-68 already records `MISSING .skilled/agents/speckit.md` and `MISSING .skilled/agents/speckit.toml`. [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/template-compliance-contract-enforcement-blocks-non-compliant.md:184] [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/template-compliance-contract-enforcement-blocks-non-compliant.md:65]

Routing and model pins produced **no** findings. Every routing claim checked matched `agent-registry.json`, and every model-pin claim in the crosswalk matched the trees.

## 11. Recommendations

1. **Fix the tree enumerations first.** F1, F3, F4 and F5 are the same defect in four places. Adding `.dsh/agents/` and `.vibe/agents/` to each list, and correcting "six" to "eight", closes four findings in one edit pass.
2. **Correct the mode count.** F2 is a one-word fix (`ten` → `nine`) but it is the kind of error a reader uses to sanity-check the roster, so it is worth fixing before the enumerations.
3. **Resolve the `.vibe/SYNC.md` self-contradiction.** F9 is the highest-severity finding because a reader following section 3 cannot tell whether `mode` travels. Line 37 and the generated tree are right; lines 39 and 53 need rewording to say that `subagent` becomes `agent_type` while `all` and `primary` are dropped.
4. **Extend the roster check to the two missing trees.** F7 is the reason F1 and F3 could drift unnoticed: the check that should catch a missing runtime cannot see `.dsh` or `.vibe`.
5. **Add `thought` to the deep-review status enum.** F12 is a one-line fix, but it is the only place where a doc narrows a status vocabulary the agent accepts.
6. **Reword the Deep Review role line.** F10 should say "observation-only on code" rather than "read-only", which is a tool-surface claim the permission map contradicts.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Treating `.claude/agents/Explore.md` as an orphaned mirror | Documented as deliberate in three places; the roster check carries an explicit allowlist for it | `.skilled/bin/agent-mirror-crosswalk.md` §2.5; `.skilled/CROSS-CLI.md:55`; `.skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs:52` | 1 |
| Treating `.opencode/agents/` as a non-symlinked copy | `.opencode/agents` is a symlink to `../.skilled/agents`, so the "links to the same source" claims are correct | `ls -la .opencode` shows `agents -> ../.skilled/agents` | 1 |
| Reporting `.skilled` as not the only tree with a permission map | `.opencode/agents` resolves to `.skilled/agents`, so no second distinct tree carries one | `.skilled/bin/agent-mirror-crosswalk.md:68` | 1 |
| Reporting the `.codex` model pin as drift | All eleven TOMLs carry `model = "gpt-6-luna"`, effort `high` except `context` (`low`) and `markdown` (`medium`) — exactly as documented | `.codex/agents/*.toml:5-7` | 1 |
| Reporting the `.claude` model pins as drift | `context.md`, `markdown.md`, `Explore.md` = haiku; `prompt-improver.md` = sonnet — exactly as documented | `.claude/agents/*.md` | 1 |
| Reporting `.pi` model absence as drift | No `model:` key in any `.pi/agents/*.md` | `.pi/agents/*.md` | 1 |
| Reporting the temperature split as drift | `0.2` for `debug` and `design`, `0.1` for the other nine | `.skilled/agents/*.md` frontmatter | 1 |
| Reporting the `Agent`/`task` grant as drift | Only `ai-council` and `orchestrate` carry `task: allow` | `.skilled/agents/*.md` frontmatter | 1 |
| Reporting `.skilled/agents/README.txt:4` "for the OpenCode runtime" as drift | Literally true: `.opencode/agents` is a symlink to this directory | `ls -la .opencode` | 1 |
| Reporting `orchestrate.md`'s generated roster blocks as drift | All three generated blocks match `agent-registry.json` row for row: eleven rows, priorities 1-11, tiers correct | `.skilled/agents/orchestrate.md:77`, `:98`, `:171` | 2 |
| Reporting `Only @orchestrate dispatches it` (`README.md:977`) as drift | `agent-registry.json` gives `code` exactly one dispatcher, `orchestrate` | `.skilled/agents/agent-registry.json` | 2 |
| Reporting `never auto-dispatched` for `@debug` as drift | Consistent across five files, and the registry's `dispatchers: ["operator"]` matches | `.skilled/agents/agent-registry.json:123`; `.skilled/agents/debug.md:26`; `.skilled/agents/README.txt:24`; `.skilled/skills/system-spec-kit/references/debugging/universal-debugging-methodology.md:29` | 2 |
| Reporting `ai-council`'s `task: allow` as a LEAF contradiction | Documented Depth 0 exception: LEAF by default, dispatches seats only on direct operator invocation | `.skilled/agents/ai-council.md:44`; `.skilled/bin/agent-mirror-crosswalk.md` §2.4 | 2 |
| Reporting `markdown`'s `mode: all` as doc drift | The crosswalk and `.vibe/SYNC.md:48` both report `mode: all` correctly; the tension is inside the agent file itself | `.skilled/agents/markdown.md:4` vs `:24` | 2 |
| Reporting `sync-agent-roster.cjs` as a broken reference | The script exists and is documented | `.skilled/bin/sync-agent-roster.cjs`; `.skilled/bin/README.md:180` | 2 |
| Reporting `code`'s "seven dispatch modes" as drift | The agent file states the same count | `.skilled/agents/code.md:261` | 2 |
| Reporting `ai-council`'s `max_rounds` default as drift | The agent file states the same default | `.skilled/agents/ai-council.md:389` | 2 |
| Grepping for a numeric agent count as a detector | The roster is described by enumeration, not by count; count greps return almost nothing | `rg` over the repo | 1 |
| Sweeping the README's eleven role paragraphs as a detector | Nine of eleven describe behavior rather than tool surface, so there is nothing for a permission map to contradict | `README.md:969`-`1017` | 2 |

## Divergence Map

- **Completed pivots**: 1. Iteration 1 compared docs against the filesystem; iteration 2 pivoted to comparing docs against agent frontmatter and sibling skill docs. The pivot is what surfaced F9, F10 and F12, none of which a filesystem comparison could find.
- **Failed pivots**: 0.
- **Audited overrides**: 0.
- **Saturated directions**: the README role-paragraph sweep (one finding from eleven paragraphs) and the numeric-count grep (zero findings). Both are recorded as dead ends and should not be retried.
- **Pivot lineage**: filesystem comparison → frontmatter and sibling-doc comparison.
- **Remaining frontier**: the repo's own gates were never run against these findings; `.dsh/SYNC.md`'s persona-patch contract was only partially read; and the `markdown` `mode: all` inconsistency is an agent-file defect rather than a doc defect and belongs to a different finding class.

## 12. Open Questions

None. All five key questions were answered across the two iterations.

Three follow-ups remain that are verification rather than discovery:

1. Run `node .skilled/bin/sync-agent-roster.cjs --check` and `node .skilled/bin/check-agent-mirror-sync.cjs --all` to confirm or refute F1-F7 mechanically. Not run here: both are repo-wide tooling and this lineage's write surface is its own directory.
2. Settle whether `.skilled/agents/markdown.md`'s `mode: all` against its own "LEAF-only" body is a defect. It is an agent-file inconsistency, not a doc drift.
3. Read `.dsh/SYNC.md`'s persona-patch contract in full for the same class of internal contradiction found in `.vibe/SYNC.md`.

## 13. Evidence Index

| Finding | Doc line | Contradicted by |
|---|---|---|
| F1 | `.skilled/bin/agent-mirror-crosswalk.md:16` | `.dsh/agents/` (11 files), `.vibe/agents/` (11 files), `.skilled/CROSS-CLI.md:77-78` |
| F2 | `.skilled/bin/agent-mirror-crosswalk.md:121` | `.skilled/agents/*.md` frontmatter (9 subagent / 1 all / 1 primary) |
| F3 | `README.md:963` | `AGENTS.md:282`, the eight runtime directories |
| F4 | `.skilled/CROSS-CLI.md:57` | `.skilled/CROSS-CLI.md:77-78` |
| F5 | `.skilled/agents/README.txt:8` | `.skilled/agents/README.txt:5`, the eight runtime directories |
| F6 | `.skilled/bin/check-agent-mirror-sync.cjs:6` | `.skilled/bin/agent-mirror-crosswalk.md:30`, `.opencode/agents` symlink |
| F7 | `.skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs:57-68` | `.dsh/agents/`, `.vibe/agents/`, `.skilled/CROSS-CLI.md:77-78` |
| F8 | `.vibe/SYNC.md:37` | `.skilled/agents/README.txt` (the file is `.txt`) |
| F9 | `.vibe/SYNC.md:39`, `:53` | `.vibe/SYNC.md:37`, nine `.vibe/agents/*.toml` with `agent_type` |
| F10 | `README.md:1017` | `.skilled/agents/deep-review.md:7-9`, `.skilled/skills/system-deep-loop/deep-review/SKILL.md:260` |
| F11 | `.skilled/agents/README.txt:9` | `.claude/agents/Explore.md` |
| F12 | `.skilled/skills/system-deep-loop/deep-review/SKILL.md:264` | `.skilled/agents/deep-review.md:236`, `.skilled/skills/system-deep-loop/deep-research/SKILL.md:225` |
| F13 | `.../template-compliance-contract-enforcement-blocks-non-compliant.md:184` | The same file's evidence block at `:65` |

## 14. Confidence Assessment

| Finding | Confidence | Basis |
|---|---|---|
| F1, F2, F3, F4, F5 | High | Directory listings and frontmatter are unambiguous; each claim is a countable fact |
| F6, F7 | High | Symlink target and the checker's own constant lists are directly readable |
| F8 | High | The filename is a single fact |
| F9 | High | The contradiction is inside one file, sixteen lines apart, and the generated tree breaks the tie |
| F12 | High | Two enums, both quoted verbatim |
| F10 | Medium | "Read-only on code" can be read as a behavioral claim, which the SKILL doc supports, or a tool-surface claim, which the permission map contradicts |
| F11 | Medium | The rule is scoped by the word "here"; it is only wrong if read as a roster-wide inventory rule |
| F13 | Medium | The line is a follow-up instruction inside a playbook whose evidence block already records the absence, so it may be a deliberate negative example |

## 15. Verification Gaps

- The repo's own gates were not run (see Open Questions 1). F1-F7 are exactly the class of drift those gates exist to catch, so a gate run would either confirm them or reveal that the gates are configured to ignore the two missing trees.
- `.dsh/SYNC.md` was read only for its agent rows. Its persona-patch contract was not audited.
- The `.claude` tree's `Explore.md` was verified as documented but its `model: haiku` pin was not checked against any Claude Code behaviour.
- No runtime was executed, so every claim about what a runtime "honors" is a claim about what the docs say, not about observed behaviour.

## 16. References

- `.skilled/agents/agent-registry.json` — the roster source of truth
- `.skilled/agents/*.md` — eleven agent definitions
- `.skilled/agents/README.txt` — the roster README and its generated block
- `.skilled/bin/agent-mirror-crosswalk.md` — the translation contract
- `.skilled/bin/check-agent-mirror-sync.cjs` — the mirror checker
- `.skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs` — the roster checker
- `.skilled/CROSS-CLI.md` — the per-runtime map
- `.vibe/SYNC.md`, `.dsh/SYNC.md` — the external-run-surface sync contracts
- `.skilled/skills/system-deep-loop/deep-review/SKILL.md`, `.skilled/skills/system-deep-loop/deep-research/SKILL.md` — the deep-loop status vocabularies
- `README.md`, `AGENTS.md` — the root docs
- `resource-map.md` was absent at init, so no map citation is included.

## 17. Appendix — Convergence Report

- **Stop reason**: `maxIterationsReached`
- **Total iterations**: 2 of 2
- **Questions answered**: 5 / 5
- **Remaining questions**: 0
- **Iteration 1**: Agent roster, runtime-tree inventory and sync-mechanism claims — 8 findings, newInfoRatio 0.94
- **Iteration 2**: Role, tool surface, status vocabulary and the Vibe sync contract — 5 findings, newInfoRatio 0.90
- **Convergence threshold**: 0.05 (not reached; the loop stopped at the iteration cap by design)
- **Divergence summary**: one completed pivot (filesystem comparison → frontmatter and sibling-doc comparison), zero failed pivots, two saturated directions recorded as dead ends.
- **Scope conflict recorded**: the workflow's `step_emit_resource_map` with `config.fanout` present runs `reduce-state.cjs --emit-resource-map --fanout-resource-map-only`, which writes `resource-map.md` into the root packet's `research/` directory — outside this lineage's write surface. The step was run once, the out-of-scope artifact was removed, and the step was not re-run. Resource-map emission belongs to the parent's `step_fanout_merge`.
