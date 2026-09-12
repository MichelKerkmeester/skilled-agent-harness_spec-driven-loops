{"timestamp":"2026-09-11T18:40:55.036Z","runtime":"claude","status":"ok","freshness":"live","durationMs":1661,"cacheHit":false,"skillLabel":"sk-code"}
# Repo-Rule System Integration — Iteration 2 Findings

*Read-only run. All line numbers re-verified at current state: `AGENTS.md` is 502 lines (read tool total; `CLAUDE.md` mirrors it at 502), `repo-rules/` holds 11 files. Rule-file sizes below use the read tool's own "N lines total" and note the measurement convention where it matters. Citations resolve as of this run.*

---

## Q1. Which new rules do the skills and other system surfaces actually justify?

**Answer: zero new rules.** Every candidate I tested fails a decision test, and the two surfaces most likely to justify one — the hooks tree and the deep-loop dispatch path — already enforce or own what a rule would say.

**Surface survey (what exists, and what each would need bound):**

| Surface | What it is | Rule-relevant need |
|---|---|---|
| 11 skills (`.opencode/skills/`) | Cataloged in `skills/README.txt:24` | Domain knowledge; routing is theirs, not a rule's (`REPO RULES.md:85-89`) |
| 8 command groups, ~48 commands (`.opencode/commands/`) | Indexed in `commands/README.txt:42-51` | Workflow selection — Out (`REPO RULES.md:85`) |
| 13 agents + 5 runtime mirrors (`.opencode/agents/`) | Listed in `agents/README.txt:11-23` | Dispatch mechanics — Out; `orchestrate.md:847` already wires the delegation rule, `markdown.md:203` wires `/create:repo-rule` |
| Hooks tree, 22 wired concerns (`.opencode/hooks/README.md:38-61`) | Kill-switch index, all "wired" | A surface that *enforces*; a rule duplicating one fails restraint (`decision-tests.md:110-114`) |
| Runtime mirrors (`.claude`, `.codex`, `.cursor`, `.devin`, `.pi`) | Mostly symlinks; `retrieval-conventions.md:284` | Sync mechanics; `runtime-mirrors` doctor target exists (`commands/README.txt:161`) |
| Retrieval lanes | `retrieval-conventions.md:273-284` | `repo-rules` is **deliberately excluded** from the trigger index (`:283`) — a rule asking for index coverage would contradict a recorded decision |
| Deep-loop child dispatch | `spec-gate/README.md:12,99` | `AI_SESSION_CHILD=1` short-circuits Gate 3 "before any state read/write, question, denial, or telemetry"; delegation rule §2.5 already pre-resolves gates (`delegation-and-orchestration.md:101-106`) |

**Candidates run through all four tests (all refused):**

1. **A comment-hygiene rule file** — refused **test 3 part 2** (has a home): it is an `AGENTS.md` §1 HARD BLOCK (`AGENTS.md:44-46`), listed at precedence level 1, "can be overridden? No" (`REPO RULES.md:24`). Moving it into a tier-3 rule file would *demote* it, and it is already doubly enforced: the pre-commit chain runs the comment-hygiene sub-gate (`hooks/README.md:26,63`), and the advisor injects the directive every turn because "the gate is what makes it load-bearing" (`injection-contract.md:52-54`).
2. **A Gate-5 / rule-loading rule** — refused **test 2**: gates live in `AGENTS.md` §2 and the router implements it (`REPO RULES.md:10-18`); this is gate/plumbing territory, kept Out "so each has exactly one place to change" (`REPO RULES.md:85-89`).
3. **A repo verification-commands rule** — refused **test 4**: no named failure. `AGENTS.md:182` describes the class ("verification commands and local contracts"), and the commands already exist and are cited (`AGENTS.md:266` `validate.sh`; `:375` `recommend-level.sh`; `:472` `generate-trigger-index.mjs`), all verified present this run.
4. **A child-containment rule** ("do not write outside your lineage") — refused **test 3 part 2**: `delegation-and-orchestration.md:89-96` owns write-authority binding and the two-way freeze; the runner enforces containment, and spec-gate child no-op removes the question entirely.
5. **A mirror-sync rule** — refused **test 2/3**: mechanics; `*SYNC.md` exists per mirror, and a wired doctor target owns it (`commands/README.txt:161`).
6. **A concurrency/isolation rule** — refused **test 4** (no failure that is currently unaddressed): the worktree-per-session model and `worktree-session.sh` exist for exactly this collision (`hook git-worktree-guard/README.md:18-20`, `sk-git/SKILL.md:289`).

**New evidence this iteration — a playbook premise the tests dispute.** The full-authoring scenario RRA-001 uses "two sessions clobbering each other's edits" as its admitted proposal, asserting "it is posture rather than routing… it is a cluster with no existing owner" and expecting all four tests to pass (`full-rule-authoring.md:33,48`). Its owner check greps **only `repo-rules/`** (`:53`), so it cannot see ownership in sk-git or the hooks — and the failure it names is precisely what `git-worktree-guard` and the launch wrapper already address (`hook README:18`). Whether test 2 refuses this proposal is arguable (the Out list names routing, workflow selection, spec-folder mechanics, dispatch — not session isolation), but the scenario's claim of "no existing owner" is under-inclusive as written. This is a test-corpus gap, not a call for a rule.

The ten pre-refused candidates remain refused by the same tests (`decision-tests.md:94-100`), and its reproduction check holds: none of the ten passed when I re-read the tests.

---

## Q2. Which existing rules need changing, and why?

**No rule *file* change is justified** — I read all 11 top to bottom and each check I ran (below) supports its current text. The change list sits one layer up: the contract references that describe the corpus, and one line inside `AGENTS.md` itself. Every item below has an observed defect, not an abstract improvement.

**2.1 AGENTS.md contradicts itself on the Gate 2 tool (`AGENTS.md:61` vs `:100-101`).**
- `AGENTS.md:61` exempts as "Gate Actions: the trigger index lookup, `skill_advisor.py`".
- `AGENTS.md:101` says the fallback is `node .opencode/bin/skill-advisor.cjs` and "The Python scorer under `system-skill-advisor/mcp-server/scripts/` remains for validation and is **not a routing fallback**: it disagrees with the daemon on roughly a third of prompts."
- Both scripts exist (`skill-advisor.cjs` in `.opencode/bin/`; `skill_advisor.py` found at `system-skill-advisor/mcp-server/scripts/skill_advisor.py`), so the one-word Gate-Action name is the defect. Sibling surfaces carrying the stale role are item Q3.2.

**2.2 `rule-anatomy.md:77` is internally falsified, convention-independently.**
`:77` gives the observed range "Total lines | 145-224". The same file's measured table lists `evidence-and-proof.md` 210, `communication.md` 244, `delegation-and-orchestration.md` 248 (`:104-106`) — both 244 and 248 exceed the stated 224 ceiling. Any count convention leaves this contradiction intact.

**2.3 The length table and its summary are stale (already flagged in iteration 1; here is the corrected accounting).**
The table (`:96-106`) lists 9 files; `handoff-and-questions.md` and `presenting-decisions.md` appear nowhere in it. Measured this run (read-tool totals; on 7 of the 9 tabled files the tabled value equals this total minus one, so the table excludes the trailing blank line — that makes six of iteration 1's "no longer holds" impressions a convention artifact, and only two real deltas):
- Real deltas under that convention: `communication.md` **192 vs 244** (the documented split moved content to `presenting-decisions.md`, `communication.md:46-48`), `delegation-and-orchestration.md` **249 vs 248**.
- Missing rows: `handoff-and-questions.md` 166 total (165), `presenting-decisions.md` 157 total (156).
- Recounted bands: **preferred ≤160** — skill-hub 128(127), uncertainty 145(144), blast-radius 155(154), presenting 156, root-cause 160(159); **good 161-200** — prevent 163(162), scope 165(164), handoff 165, communication 192; **at the limit 201-250** — evidence 210, delegation 249; **over >250** — none. So `:108`'s "Four preferred, two good, three at the limit, none over" is now **five / four / two / none**.

**2.4 The stale-count problem is system-wide, not reference-local.** Verified occurrences of corpus counts that are wrong today:

| Document | Line | Claim | Current fact |
|---|---|---|---|
| `rule-anatomy.md` | 3, 17-19, 47 | "nine shipped files" / "eight files… 8 of 8" / "9/9" | 11 files |
| `rule-anatomy.md` | 122 | "10 cross-reference links… 7 distinct pairs, across 9 files… 3 files" | measured 14 links / 10 unordered pairs / 5 files (grep) |
| `rule-anatomy.md` | 155 | "161 phrases across 9 files" | measured 194 phrases across 11 (read sum: 20+18+17+16+17+18+20+18+16+17+17) |
| `rule-anatomy.md` | 167 | "present in 3 of 8" | 5 of 11 carry `WHAT THIS RULE IS NOT` |
| `creation-standards.md` | 3, 26-27, 156 | "all nine shipped rules" | 11 |
| `creation-standards.md` | 74 | "161 phrases" | 194 |
| `creation-standards.md` | 138-139 | "four sideways links across eight files" | 14 / 5 files |
| `agents-md-integration.md` | 92 | "all nine shipped rules sit at 1.0.0.0" | two counterexamples: delegation `1.0.0.2`, handoff `1.1.0.0` |
| `repo-rule-template.md` | 104, 109-118, 129-131 | "all nine… 9/9… four inter-rule links across eight files" | 11 / 14 / 5 |
| `sk-create-repo-rule/README.md` | 89, 140, 165 | "all nine shipped rules"; "Three of the nine… sit at the limit" | 11; two at the limit |
| `playbook/…/existing-owner-refusal.md` | 57 | "the same eight files as before" | 11 |
| `playbook/…/full-rule-authoring.md` | 35, 74 | "eight already shipped"; "all nine shipped files" | 11 |
| `playbook/…/standards-gate-rejection.md` | 78 | "pass on all nine shipped rules" | 11 |
| `retrieval-conventions.md` (system-spec-kit) | 283 | "The nine rule documents" | 11 |

Root cause is visible: corpus counts are embedded as prose in at least seven artifacts, and two growth events (8 → 9 → 11) updated none of them; the router and `AGENTS.md` were maintained, the derived claims were not. Changelog entries (`sk-create-repo-rule/changelog/v1.0.0.0.md:26`) are historical statements and should stay frozen — this list excludes them deliberately. The fix pattern already exists in-repo: `README.md:177-178` ships awk-based parity checks; the count-bearing prose needs the same treatment or deletion.

**2.5 Version-convention divergence (secondary).** `agents-md-integration.md:92-94` prescribes bumping the fourth segment for content changes. `delegation-and-orchestration.md:27` follows it (`1.0.0.2`); `handoff-and-questions.md:25` does not (`1.1.0.0`). A convention that two revised files already diverge on is not a convention.

**No other rule-file change is justified.** Spot checks that resolve cleanly: all 11 routed-from lines carry the verbatim two-line header (`rule-anatomy.md:53-54`); trigger rows match each file's "Fires when" list; `handoff-and-questions.md:52`→`AGENTS.md` §10 and §4 citations resolve; `uncertainty-and-honesty.md:48-49` correctly points at the sole Confidence Thresholds table; `prevent-overengineering.md:102` correctly defers to the sole Restraint Signals table.

---

## Q3. Where is cross-skill or cross-system integration missing or broken?

**3.1 Broken: ten skill files point at the wrong `AGENTS.md` section — "the Section 6 decision tree" does not exist there.** The Code Search Decision Tree is `AGENTS.md:337-345`, inside §5 "TOOLS, SEARCH & MCP ROUTING" (`:311`); §6 is Spec Folder Documentation (`:367`). These ten files cite `AGENTS.md` §6 for tool routing:
`sk-git/SKILL.md:589`, `cli-opencode/SKILL.md:358`, `cli-claude-code/SKILL.md:370`, `cli-codex/SKILL.md:371`, `cli-cursor/SKILL.md:404`, `cli-devin/SKILL.md:452`, `sk-prompt/SKILL.md:492`, `mcp-code-mode/SKILL.md:417`, `mcp-chrome-devtools/SKILL.md:317`, `mcp-aside-devtools/SKILL.md:314`. (`cli-pi` does not carry the line; the three other `mcp-tooling` hits are unrelated "Operation-to-Tool Routing Table" headings.) Whether this is leftover renumbering or a copy-paste lineage, the pointer does not resolve at current state.

**3.2 Broken: Gate 2's tool name drifted across surfaces and contradicts `AGENTS.md`.**
- `AGENTS.md:61` — `skill_advisor.py` named as a Gate Action.
- `AGENTS.md:101` — `skill-advisor.cjs` is the fallback; the Python scorer is "not a routing fallback".
- `sk-git/SKILL.md:587` — "Gate 2: Skill routing via `skill_advisor.py`".
- `cli-opencode/SKILL.md:357` — "the Skill Advisor Hook (or `skill_advisor.py` fallback)".
- `install-guides/README.md:1032` — "The Skill Advisor (`skill_advisor.py`) powers Gate 2 in AGENTS.md".
- `sk-git/README.md:79` uses the Python call as the verification recipe.
The Python file still exists, so this is role drift, not a dead path — but four surfaces teach a fallback `AGENTS.md` explicitly demoted.

**3.3 Broken: the rule corpus and its documentation disagree on basic counts** — detailed in Q2.4. One consequence worth separating: `retrieval-conventions.md:283` documents the *right* decision ("loaded at Gate 5 through the trigger table… not retrieved at Gate 1") in a sentence whose count is wrong. The decision holds; the sentence needs the count fixed, not the policy revisited.

**3.4 Gap: the system mandates recording refusals but names no destination for the record.**
- `decision-tests.md:136-138` — "**Record every refusal with the test it failed.** A declined proposal with a written reason is what stops the same suggestion arriving next quarter…"
- `agents-md-integration.md:107-108` — the retire path's step 5, same rationale.
- `SKILL.md:218` — success criterion: "A refused request leaves the user knowing which test it failed and where the content belongs."
No register artifact exists under `sk-create-repo-rule` (find over `*refus*` returns only the four playbook scenario files; `*register*` returns nothing). Today a refusal's durable record is whatever session spec folder happened to exist. Across repositories — the stated deployment model (`AGENTS.md:11`) — the mandate has no owner. This is a documentation/process gap, not a rule candidate (see REFUSALS).

**3.5 Contested: the playbook's owner check cannot see non-rule owners** — RRA-001 greps only `repo-rules/` (`full-rule-authoring.md:53`) while asserting "no existing owner" as a test-2 passing condition. Detailed in Q1; the fix is to the scenario, not to a rule.

**3.6 Verified clean (new checks this iteration, independent of iteration 1):**
- Router parity: 11 trigger rows (`REPO RULES.md:40-50`), 11 index rows (`:58-68`), 11 files — equal.
- 11 of 11 routed-from back-links resolve to `../REPO%20RULES.md`; the 14 in-set cross-links resolve, across 5 files (grep-verified; this supersedes the references' own contradictory counts, per Q2.4).
- `AGENTS.md` carries 34 rule links across 25 link-bearing lines (lines 11 and 455 mention the path without linking), all resolving.
- External targets opened this run and resolving: `references/validation/validation-rules.md` and `runtime/cli/retrieval/generate-trigger-index.mjs`; all six `cli-X/SKILL.md` files; `.pi/PLUGINS.md:16-19` (the Pi ask-user-question extension `handoff-and-questions.md:128` cites); `opencode.json`, `.claude/mcp.json`, `.codex/config.toml`, `.utcp_config.json` (the config paths `AGENTS.md:357` cites); every command named in `AGENTS.md` §10 exists (deep 5, speckit 6, doctor 3, prompt 1, rewrite 3, create/repo-rule); `parent-skills-nested-packets.md` and `skill-root-metadata-contract.md` both exist.
- The `AGENTS.md:193` chain resolves: "the code skill's repeated-failure limit" is real and documented — `sk-code/SKILL.md:192` loads `shared/references/workflow-debug.md`, which states "Never continue automatic retries after three failed fixes" (`workflow-debug.md:100`; see also `universal/error-recovery.md:29`).

**3.7 Structural note: Gate 5 has no hook.** The hooks tree's kill-switch index (`hooks/README.md:38-61`) contains every concern; none implements rule loading, and the injection contract injects no rules (`injection-contract.md:18` catalogs what is injected). Gate 3 has `spec-gate` (`spec-gate/README.md:12`); comment hygiene and mass-deletion have the pre-commit chain (`hooks/README.md:26,63`); skill-hub claims have sk-git's preflight advisory (`sk-git/SKILL.md:309-324`). Repo-rule loading is model-discipline only. That is consistent with the design (Gate 5 makes the *load* mandatory; `REPO RULES.md:29-32`) and it is why content that must bind on read-only turns cannot move into a rule file — and why proposals with a hook-enforced twin should stay with the hook.

---

## Q4. Which parts of AGENTS.md can be cut, compressed, or relocated?

**Method.** For each block: does it have to *bind* on a turn where nothing fires? If yes, it is not a relocation candidate (and, per the decision tests, its refusal destination is AGENTS.md — `decision-tests.md:130`). If no, I name an owner and whether that owner loads when the content is needed.

**Verdict by section:**

| AGENTS.md block | Verdict | Reason |
|---|---|---|
| Multi-repo note `:7-13` | Keep | Defines the hierarchy every turn reasons inside |
| §1 Four Laws / PLAN-WORKFLOW LOCK / Comment Hygiene / Halt `:17-55` | Keep | Hard blockers; comment hygiene is enforced by hook but must bind at authoring (`:44-46`, `REPO RULES.md:24`) |
| §2 gates, thresholds, Gate 4, Gate 5, protocols `:59-136` | Keep | Gates are read before acting; Confidence Thresholds is the single copy (`uncertainty-and-honesty.md:48-49`); Gate 5's sentence `:122` is the loader |
| §3 Core Principles / Blast-Radius / Execution Behavior `:140-197` | Keep | The compressed skeleton is what binds when no rule has loaded; e.g. the stakes read `:163` precedes any write |
| §3 Quality Principles / Restraint Signals `:199-226` | Keep | Restraint Signals is the only copy (`prevent-overengineering.md:102`); packet `spec.md:71` excludes removal |
| §4 Proof Standards `:232-249` | Keep | `:240` states the reason verbatim: "bind unconditionally, including on a read-only turn where Gate 5 never fires and no rule file loads" |
| §4 post-execution gates, memory, goal, self-check `:251-307` | Keep | Every one binds at a moment no trigger names |
| §5 tools, code search, terminal `:311-353` | Keep | The decision tree is the target of Q3.1's pointers; net-remove would widen that break |
| §5 Git Workspace Safety `:322-335` | **Compress** (R2) | See below |
| §5 MCP Tool Routing `:355-363` | Keep | "Registration is not availability" `:363` must bind on read-only reporting; no owner loads at MCP-use time |
| §6 `:367-381` | Keep | Already pointer-form; the one local rule `:381` has no script |
| §7 `:385-399` | Keep | Logic-sync report format must bind when a contradiction is found while reading |
| §8 `:403-411` | Keep | Governs every substantive reply, read-only turns included; the two clauses `:411` are explicitly load-independent |
| §9 `:415-440` | Keep | Dispatch can be read-only (research lineages); test 2 keeps routing here. Minor: `:415` and `:417` duplicate the heading |
| §10 Quick Reference table `:450-474` | **Relocate/compress** (R1) | See below |
| §10 mandates `:476-502` | Keep | Honesty binds always; dispatch rules bind when composing prompts; close-out binds every turn |

**R1 — Quick Reference table (`:450-474`), the largest candidate.** ~24 lines of entry-point/purpose text. The section itself concedes the risk ("repeating it here only creates a second copy to go stale", `:448`), and the "second copy" now exists and is maintained:
- `.opencode/commands/README.txt` §3-4 is a complete command index with invocation and purpose for every command the table names: `/create:repo-rule` `:150`, doctor `:161-164`, deep `:172-176`, prompt `:195`, rewrite `:205-207`, speckit `:215-220` — including the `:with-phases` variants `:217`. It even carries a staleness rule for its own counts `:55`.
- `.opencode/skills/README.txt:41-60` catalogs the skill rows; `.opencode/agents/README.txt:11-23` lists the agent rows.
- The one thing nothing else carries: the **"Order that matters"** column (Gate 3 Option B's research→plan→approval→implement; the continuity ladder; repo-rules' match→load order). Owner gap: keep those rows or give them a home; the entry-point column is pure duplication.
- Load timing: none of the receiving surfaces auto-load — but this content never has to *bind*, only to be *findable*, and the always-loaded pointer that remains in AGENTS.md preserves discovery on read-only turns. Four decision tests: not a rule proposal; tested anyway — test 1 would otherwise send it "to AGENTS.md as a compressed row" (`decision-tests.md:130`), which is exactly the recommended shape (one pointer line plus the order rows).

**R2 — Git Workspace Safety table (`:326-335`).** Fourteen dense lines whose mechanics are carried point-for-point by sk-git and enforced at command time:
- ask-first workspace choice — `sk-git/SKILL.md:276-285`;
- branch naming + allocator — `:359` (`worktree-naming.sh`, locks and seeds counters);
- no direct branch creation — `:507`;
- commit trailers (`Spec:` + `Commit-Id:`) — `:486-493`;
- push-ask — `:297-305` plus the fail-closed pre-push hook (`remote-branch-policy.md:27-28`);
- live-sync — `:293-295, :307`; hooks/preflight advisory — `:309-324`, wired per `hooks/README.md:51`.
- **Keep at least the ask-first row**: it is the one row with no hook backstop — the worktree guard warns about session placement, not about the choice (`git-worktree-guard/README.md:31-37`), and the advisory engine covers sk-git's `hard_rules:` block (`sk-git/SKILL.md:8-75`), not the ask. The push row can compress if the replacement preserves "ask, don't let the hook refuse for you."
- Load timing: sk-git loads when git work routes through Gate 2; the hooks fire at command time; a raw unrouted `git` command loads neither — hence the retained behavioral rows.

**Cosmetic:** §9's duplicated heading (`:415` `## 9. 🤖 AGENT ROUTING`, `:417` `### Agent Routing`).

---

## RANKED RECOMMENDATIONS

1. **Fix the ten wrong-section pointers** (`sk-git:589`, `cli-opencode:358`, `cli-claude-code:370`, `cli-codex:371`, `cli-cursor:404`, `cli-devin:452`, `sk-prompt:492`, `mcp-code-mode:417`, `mcp-chrome-devtools:317`, `mcp-aside-devtools:314` → `AGENTS.md` §5). Evidence: tree at `:337`, §6 at `:367`. Mechanical, zero-risk, currently misdirects readers of ten skills.
2. **Resolve the Gate 2 tool-name drift** in `AGENTS.md:61` and its four stale siblings (`sk-git:587`, `cli-opencode:357`, `install-guides:1032`, `sk-git/README.md:79`), aligning all to `AGENTS.md:100-101`. This is an operator naming decision plus a five-file edit.
3. **Correct the count-bearing prose** listed in Q2.4 (seven artifacts + `retrieval-conventions.md:283`), and stop embedding corpus counts where a computed check can own them — `README.md:177-178` already demonstrates the pattern.
4. **Repair `rule-anatomy.md`**: the `:77` range contradiction, the two missing length rows, the band recount (5/4/2/0), and the internal 8-vs-9 wording at `:17-19` vs `:3`.
5. **Relocate/compress `AGENTS.md` §10 Quick Reference** (`:450-474`) into `commands/README.txt` §4 + `skills/README.txt`, keeping only a pointer line and the order-bearing rows. Largest single AGENTS.md reduction available (~20+ lines).
6. **Compress `AGENTS.md` §5 Git Workspace Safety** (`:326-335`) to the two behavioral rows plus a pointer, with sk-git as owner and the hooks as backstops. (~8-10 lines.)
7. **Name where refusals are recorded** (Q3.4): either designate a register artifact under sk-doc or fold it into the retire path's record; the mandate exists in three documents, the destination in none.
8. **Settle the version convention** (`agents-md-integration:92-94`): `delegation` bumped segment 4, `handoff` bumped segment 2. Low blast, but the guidance and the corpus disagree today.

---

## REFUSALS

**New-rule proposals (Q1), each with its deciding test:**
- Comment-hygiene rule → **test 3 part 2** (home: `AGENTS.md:44-46`, level 1 at `REPO RULES.md:24`; demotion risk; hook + directive already enforce). Belongs: stays in AGENTS.md §1.
- Gate-5/rule-loading rule → **test 2** (gates/routing). Belongs: `AGENTS.md` §2 + `REPO RULES.md` §1-2.
- Repo verification-commands rule → **test 4** (no named failure). Belongs: existing §4/§6 pointers.
- Child-containment rule → **test 3 part 2** (delegation §2; mechanisms exist). Belongs: `delegation-and-orchestration.md` §2.
- Mirror-sync rule → **test 2** (mechanics; doctor target owns). Belongs: sync docs + `/doctor runtime-mirrors`.
- Concurrency/isolation rule → **test 4** (already addressed by worktree model + guard). Belongs: sk-git + hooks; the playbook scenario needs its owner check widened.
- "Record refusals" as a rule → refused as a rule: it is a single process obligation, not a trigger-shaped action cluster. Belongs: a doc/process artifact owned by sk-doc (recommendation 7).
- Any candidate whose content must bind while reading → **test 1** (`decision-tests.md:32-33`, `AGENTS.md:122`): refused wholesale.
- The ten adoption-phase candidates remain refused under the same four tests (`decision-tests.md:94-100`).

**Relocation/proposal refusals (Q4), each with its reason:**
- Confidence Thresholds table `:88-97` → out of scope by packet `spec.md:71`; single copy confirmed (`uncertainty-and-honesty.md:48-49`).
- Restraint Signals table `:218-226` → single copy confirmed (`prevent-overengineering.md:102`).
- Proof Standards `:232-249` → must bind on read-only turns by its own text `:240`.
- §2 Skill Routing Reference `:110-114` → routing (test 2); the read-only claim "a registry entry is not proof" needs an always-loaded copy.
- §5 MCP Tool Routing `:355-363` → `:363` must bind on read-only reports; no owner loads at MCP-use time.
- §6 table `:373-379` → already pointers; one local rule has no script owner.
- §9 runtime-directory table `:427-434` → no existing owner carries the six-runtime mapping (`agents/README.txt:8` names one sibling only); relocation would orphan it.
- §8 pointer paragraphs `:405-409` → govern every substantive reply, including read-only turns.
- §3/§4 compressed bullet skeletons → the rule files expand; the skeleton is what binds pre-load.

**Evidence limits of this run:** (1) Line counts are the read tool's totals; byte-exact `wc -l` was unavailable, so the table-convention analysis in Q2.3 states its assumption explicitly. (2) I could not open iteration 1's report — its exact wording is known only from the summary, so points that touch its territory are marked as extensions or refinements. (3) Whether the ten "Section 6" pointers reflect a renumbering or were always wrong is not established (no renumbering changelog searched); the non-resolution at current state is established. (4) The refusal-register search covered `sk-create-repo-rule` and the repository md corpus for suggestive names; a register under another name elsewhere cannot be fully excluded. (5) No behavior tests were run — this is a document-state audit; claims about load paths are read from the contracts that define them.
