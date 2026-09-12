# Repo-rule system integration: synthesis of ten DeepSeek iterations

Source: `research/lineages/deepseek/iterations/iteration-001.md` through `iteration-010.md`, about 234 KB, one model family (DeepSeek V4.1 Flash, max effort), ten passes, each told what earlier passes found and told not to repeat them. Two other lineages were planned and dropped after executor stalls produced nothing. **This is one opinion iterated, not three models agreeing.**

Verification state: all line numbers below were re-checked against the working tree on 2026-09-11. `AGENTS.md` measures 501 by `wc -l` and 502 to a reader, because the file has no trailing newline. The brief's 501 and the iterations' 502 are both right. Do not chase that difference.

---

## VERDICT

The research establishes one substantive thing and one negative thing, and the negative one is the more valuable.

**The substantive finding is the federation.** The rule corpus is not a single-repository artifact. Nine of the eleven rule files are symlinked into at least two sibling repositories, `Mobile CLI` and `Obsidian Plugin`, and the root `AGENTS.md` reaches both as an absolute symlink into this checkout. Two rules added here recently, `handoff-and-questions.md` and `presenting-decisions.md`, were never propagated. The shared `AGENTS.md` points at them on six lines and the shared `communication.md` points at one of them on a seventh. That is seven references that resolve to nothing in each sibling, today, in production. No iteration before the sixth saw this, and it reframes every earlier count finding. Verified directly: both siblings' `repo-rules/` directories, both `.gitignore` shared blocks, both `AGENTS.md` symlink targets.

**The negative finding is that the rule set should not grow.** Across ten passes and roughly forty candidate rules, the answer was zero new rules every time. The deciding constraint is the one the brief names: Gate 5 fires on the first write and never on a read-only turn (`AGENTS.md:122`), so any content that must bind while reading cannot live in a rule file. That single test refused most candidates before any other consideration. The rest were refused because a home already exists. This is a real result and it should be recorded as one, not treated as a null run.

**What the research does not establish is a case for cutting `AGENTS.md`.** Ten passes found roughly thirty to forty lines of compression across a 502-line document, and most of it is contested inside the lineage itself. A prior audit already took the document from 555 lines to its current size and concluded it sits at a pointer floor. The iterations independently rediscovered that floor from five different angles. The honest answer to sub-question four is: almost nothing, and the reason is structural rather than editorial.

**Weight.** Treat the structural findings as strong, because I re-verified them against the files. Treat the arithmetic findings as weaker, because three iterations got the same length-table arithmetic wrong in the same direction, which is exactly the failure mode a single model family produces and a second family would have caught. Treat every refusal as a hypothesis about fit, not a proof of value.

---

## RANKED RECOMMENDATIONS

One ordered list across all four sub-questions. Nothing here is a new rule. The set stays at 11 files, 11 trigger rows, 11 index rows, except where item 1 says otherwise.

### 1. Decide the federation question for the two local-only rules, then execute it

**Change.** Either promote `handoff-and-questions.md` and `presenting-decisions.md` to shared files, or re-scope the shared documents that point at them. This is an operator decision, not a research answer, and it gates items 5 and 8.

**Evidence.** `Mobile CLI/repo-rules/` holds 15 entries and `Obsidian Plugin/repo-rules/` holds 12, and neither contains either file (directory listings, verified). Both sibling `AGENTS.md` files are absolute symlinks to `Code_Environment/Public/AGENTS.md` (`ls -la`, verified). That shared document names the two files on six lines: `AGENTS.md:148`, `:175`, `:407`, `:409`, `:498`, `:500`. `repo-rules/communication.md:47` links to `presenting-decisions.md` as a relative path, and `communication.md` is itself symlinked into both siblings. Seven broken references per sibling. The audit packet that certified this federation recorded the opposite state: `specs/sk-doc/043-repo-rules-router-audit/implementation-summary.md:238-240` says all four repositories hold equal counts and "zero broken links". That was true when measured and was invalidated when the two rules landed here.

**Files.** Promote path: two symlinks plus two `.gitignore` lines per sibling, following the existing nine-file block at `Obsidian Plugin/.gitignore:82-92` and the matching Mobile CLI block, plus a trigger row and an index row per sibling router. Re-scope path: six lines in `AGENTS.md` plus `repo-rules/communication.md:47`.

**Cost.** Promote is cheaper by inspection: zero edits to the shared document, and it fixes all seven references at once. Re-scope costs seven edits to shared surfaces and leaves the siblings without the rules. **Flag against the settled facts:** promoting adds two rules to each sibling set, so each sibling needs all three edits the operator named, the file, the trigger row and the index row. Mobile CLI goes 15 to 17, Obsidian Plugin 12 to 14. This repo stays at 11.

**Also in scope of the same decision.** Both sibling routers still carry a pre-split communication row promising "verdict-first order, Ask to Do framing" from `communication.md`, at `Mobile CLI/REPO RULES.md:55` and `Obsidian Plugin/REPO RULES.md:52`. That content moved to `presenting-decisions.md` per `communication.md:46-48`. Only this repo's rows were updated.

### 2. Repair the five trigger rows that no longer cover their rules' fire lists

**Change.** Bring each row to at least one phrase per fire in the rule it routes to.

**Evidence.** Verified by reading each rule's `Fires when` block against its row.

- `REPO RULES.md:45` drops "You are tempted to call a failure a flake, an infra problem, or pre-existing" (`root-cause-and-debugging.md:37`).
- `REPO RULES.md:41` drops "Part of the work is blocked and you are deciding what to do with the rest" (`scope-discipline.md:39`).
- `REPO RULES.md:48` drops "About to list every option you considered" (`presenting-decisions.md:39`).
- `REPO RULES.md:46` drops "About to name a path, flag, function, version, or number you have not verified" (`uncertainty-and-honesty.md:35`).
- `REPO RULES.md:44` drops "Any call that leaves this machine" (`blast-radius.md:37`), plus "truncate" and "branches, tags, or reflogs" from `:33-34`.
- `REPO RULES.md:43` drops delegation's first fire, "About to decide whether to hand work to another runtime at all" (`delegation-and-orchestration.md:37-38`). The rule's own text says it "used to fire only after it", so the row is the pre-widening shape.
- Keyword drops: `REPO RULES.md:40` omits *scalable*, *extensible* and *while we're here* from `prevent-overengineering.md:39`. `REPO RULES.md:50` omits "reachable" from `skill-hub-routing.md:38`.

**Why this is the highest-value in-repo item.** The router matches on the action about to be taken, and `REPO RULES.md:18` says that nothing firing means `AGENTS.md` alone governs and you do not hunt for a rule. A fire with no row phrase is therefore a silent non-load, not a near miss. The wiring contract already makes the row edit mandatory in the same change: `agents-md-integration.md:87-88` says that otherwise the router lies about the rule, and it lies silently.

**Files.** `REPO RULES.md` rows only. Counts unchanged, so no index edits.

**Cost.** One editing pass, low risk. Second leg, optional: the create command's verify step (`create-repo-rule-auto.yaml:200-204`) checks counts and link resolution only, so extend it to compare row coverage against each rule's fires. Without that leg this class recurs.

### 3. Fix the §8 attribution conflict inside the always-loaded document

**Change.** `AGENTS.md:405` credits `communication.md` with "verdict-first ordering, how to present a recommendation, the Ask to Do framing for an ambiguous request". `AGENTS.md:407`, two lines later, credits `presenting-decisions.md` with "verdict first, one recommended path". `communication.md:46-48` says that content moved out when the file hit its length ceiling. Line 405 is stale since the split.

**Evidence.** All three lines read and confirmed.

**Files.** `AGENTS.md:405`, one line. Prefer compressing the enumeration rather than re-listing, because a coverage list is what drifted.

**Cost.** One line. This is an `AGENTS.md` edit, which the authoring mode treats as an operator escalation (`sk-create-repo-rule/SKILL.md:209-210`).

### 4. Fix the four surviving singular-load statements that contradict Gate 5

**Change.** `AGENTS.md:125` says "LOAD every rule file it names" and "Two triggers fire, load both", and `REPO RULES.md:15-17` repeats it. Four surfaces still say the opposite.

**Evidence.** `AGENTS.md:304` self-check reads "LOADED the rule file it names?" (singular). `AGENTS.md:455` reads "load the one `repo-rules/*.md` it names". `REPO RULES.md:4-5` reads "routes you to the one rule file", line-wrapped, which is why a flat grep misses it. `assets/repo-rules-router-template.md:39-40` repeats the same singular into every future bootstrapped repository. All four read and confirmed.

**Files.** `AGENTS.md` two lines, `REPO RULES.md` one sentence, the template one sentence.

**Cost.** Four small edits. A reader following `:455` loads one rule where the router says three or four normally fire.

### 5. Repair the widening canon across six surfaces

**Change.** State one count and one next-ordinal everywhere, or re-word each surface so it needs no ordinal.

**Evidence.** The live router states four widenings and pre-refuses a fifth: `REPO RULES.md:91` (third), `:98` (fourth), `:108-109` (a fifth would dissolve the boundary). Five other surfaces disagree and their refusal ordinals all point one or two steps low.

| Surface | Count it states | Guard it names | Checked |
|---|---|---|---|
| `references/decision-tests.md:72-76` | "widened exactly three times" | "A fourth widening" | yes |
| `references/agents-md-integration.md:49` | "hit this twice" | | yes |
| `references/agents-md-integration.md:55-57` | "All three were caught" | "A fourth widening" | yes |
| `assets/repo-rules-router-template.md:103` | "hit this twice" | | yes |
| `manual-testing-playbook/rule-decision/routing-refusal.md:20` | "exactly twice" | "a third widening" | yes |
| `manual-testing-playbook/lifecycle-and-wiring/scope-boundary-halt.md:20` | "hit this twice" | "a unilateral third widening" | yes |

`agents-md-integration.md` contradicts itself inside six lines, saying "twice" at :49 and "All three" at :55.

**Why it matters.** This is the guard text a future proposal is refused with, and the two playbook scenarios exist specifically to teach the operator that a widening is never unilateral. Their pass and fail criteria check behavior, not history text, so a scenario run cannot catch its own staleness.

**Files.** `REPO RULES.md` (no change needed, it is the correct side), two references, one template, two scenario files.

**Cost.** Five edits, mechanical. Note that the router's fourth widening was itself an operator decision overriding a research refusal, which is recorded at `REPO RULES.md:98-109`, so the references are the stale side and not the router.

### 6. Fix the ten skill files that point at the wrong `AGENTS.md` section

**Change.** Ten `SKILL.md` files cite "AGENTS.md Section 6 decision tree" for tool routing. §6 is Spec Folder Documentation (`AGENTS.md:367`). The Code Search Decision Tree lives in §5 (`AGENTS.md:311`).

**Evidence.** Verified by grep over `SKILL.md` files only, exactly ten hits: `sk-prompt`, `mcp-tooling/mcp-chrome-devtools`, `mcp-tooling/mcp-aside-devtools`, `mcp-code-mode`, `cli-external-orchestration/cli-claude-code`, `cli-devin`, `cli-codex`, `cli-cursor`, `cli-opencode`, `sk-git`. Section headings confirmed at `AGENTS.md:17,59,140,230,311,367,385,403,415,444`.

**Files.** Ten `SKILL.md` files, plus propagation to the `.claude` and `.codex` mirrors where those skills are forked.

**Cost.** Mechanical, zero risk, ten one-line edits.

**Adjacent, same class, reported by iteration 3 but not re-verified by me.** Eight files cite "AGENTS.md §7" for the runtime persona and agent-directory rule, which is §9 (`AGENTS.md:415`): the six `cli-*` mode files, `cli-external-orchestration/SKILL.md:171`, and `sk-prompt/assets/cli-prompt-quality-card.md:113`. `agents/code.md:360-361` cites §4 for confidence thresholds and Logic-Sync, which are §2 and §7, propagated to three mirrors. `agents/code.md:518` names a "Quality and Anti-Patterns table" that no longer exists by that name. `speckit-plan.yaml:647` delegates tool selection to "Section 8", which is Communication. Verify these before editing.

### 7. Repair the two dead cross-references in `code-quality-standards.md`

**Change.** `AGENTS.md:181` names `sk-code/shared/references/universal/code-quality-standards.md` §1 as the authoritative restraint ladder, and `prevent-overengineering.md:68-75` builds the corpus doctrine on that same citation. That document's own outbound references dead-end.

**Evidence.** `code-quality-standards.md:53` says to see the repo `CLAUDE.md` "ANTI-PATTERNS" table. Root `CLAUDE.md` is a symlink to `AGENTS.md` (`ls -la` confirmed, 9-byte link), and `AGENTS.md` has no ANTI-PATTERNS table. The nearest real owners are the Restraint Signals table in `AGENTS.md` §3 and `prevent-overengineering.md` §3 and §4. `code-quality-standards.md:81` says to see `code_style_guide.md` §4. No such file exists. The real file is `code-style-guide.md` with a hyphen, present in the same directory (`ls` confirmed).

**Files.** One document, two lines.

**Cost.** Two edits. Caveat worth keeping: `code-quality-standards.md` is shared, so the `CLAUDE.md` sentence may be written for a consumer repository that brings its own table. If so, say that in the sentence rather than deleting it.

### 8. Sweep the authoring references' measurements, and name the scope in every count

**Change.** Correct or delete every hand-maintained corpus count in the rule-authoring documents, and add the missing scope noun. This is the largest item by edit count and the smallest by per-edit value, which is why it ranks here and not higher.

**Evidence, measured by me this session.** Corpus: 11 files in `repo-rules/`. Trigger phrases: 194 across all 11, 158 across the shared nine. In-set cross links: 14 across 5 files, or 10 across 3 files if you drop the two local-only files. `WHAT THIS RULE IS NOT`: 5 of 11, or 3 of the shared nine. Versions: nine at `1.0.0.0`, `delegation-and-orchestration.md:27` at `1.0.0.2`, `handoff-and-questions.md:25` at `1.1.0.0`. Line counts by `wc -l`: skill-hub 127, uncertainty 144, blast 154, presenting 156, root-cause 159, prevent 162, scope 164, handoff 165, communication 192, evidence 210, delegation 249.

Known-stale locations, each read and confirmed:

| Location | Claim | Status |
|---|---|---|
| `rule-anatomy.md:3` | "nine shipped files", "9 of 9" | scope-true for the shared nine, never says so |
| `rule-anatomy.md:17-19` | "the eight files", "8 of 8" | contradicts :3 and :47 in the same file |
| `rule-anatomy.md:17-18` | parsed by `scratch/inventory.py` | path does not resolve from the reference or the repo root |
| `rule-anatomy.md:47` | "Every one of these is 9/9" | contradicts :17-19 |
| `rule-anatomy.md:77` | "Total lines 145-224" | falsified by its own table at :98 (127) and :106 (248) |
| `rule-anatomy.md:94-108` | nine-row length table | 7 of 9 rows exact under `wc -l`, communication stale by 52, delegation stale by 1, summary line no longer describes the bands |
| `rule-anatomy.md:122` | "10 links, 7 pairs, across 9 files, only 3 carry any" | defensible for the shared nine, false for 11, scope unstated |
| `rule-anatomy.md:58` | "all 10 files" | 12 carriers today |
| `rule-anatomy.md:150-151` | "All eight files" | stale |
| `rule-anatomy.md:155` | "161 phrases across 9 files" | 158 shared, 194 all |
| `creation-standards.md:74` | "161 phrases with zero collisions" | number stale, the no-collision constraint still holds |
| `creation-standards.md:115` | "Three of eight carry WHAT THIS RULE IS NOT" | 3 of the shared nine, 5 of 11 |
| `creation-standards.md:124`, `:142-143` | "The five rules without one", "three of eight under 160" | stale |
| `creation-standards.md:138-139` | "four sideways links across eight files" | reproduces under no scope I can measure, and contradicts `rule-anatomy.md:122` |
| `agents-md-integration.md:92-94` | "all nine shipped rules sit at 1.0.0.0" | falsified by two files |
| `assets/repo-rule-template.md:86-87`, `:104`, `:109-118`, `:129-131` | "three of the eight", "all nine", 9/9 rows, "four inter-rule links across eight files" | stale, and this asset is loaded on the create path |
| `sk-create-repo-rule/README.md:89`, `:139`, `:140`, `:165` | "all nine", "161 phrases", "Three of the nine at the limit" | stale |
| `manual-testing-playbook/.../full-rule-authoring.md:74` | "all nine shipped files" | stale |
| `manual-testing-playbook/.../standards-gate-rejection.md:78` | "pass on all nine shipped rules" | stale |
| `manual-testing-playbook/.../existing-owner-refusal.md:57` | "the same eight files as before" | stale |
| `manual-testing-playbook/manual-testing-playbook.md:34` | "Three write, the remaining six are read-only" | nine, against a ten-scenario claim elsewhere |
| `changelog/v1.1.0.0.md:29` | "all eight shipped rules" | historical, freeze it |
| `retrieval-conventions.md:283` | "The nine rule documents" | scope-true, scope unstated, and this sentence is load-bearing for the Gate 5 exclusion decision |
| `.devin/SYNC.md:38` | "the 12 `.opencode/skills/` packets" | 13 roots on disk |

**The real defect is not the number nine.** Nine is correct for the shared set, and the shared set is machine-defined by the nine-file `.gitignore` block in each sibling. The defect is that no counting document says which set it counts. Fix that first, then the numbers.

**Files.** Four references, two assets, the packet README, three playbook files, `retrieval-conventions.md`, `.devin/SYNC.md`.

**Cost.** Large edit surface, low risk. Prefer deletion over re-counting wherever a computed check can own it. The pattern already exists in-repo at `sk-create-repo-rule/README.md:178` (an awk parity recipe) and the playbook root's own stated posture of not hand-maintaining counts.

### 9. Repair the `sk-doc` hub roster surfaces

**Change.** The hub that hosts `sk-create-repo-rule` advertises modes that belong to a different hub, and its surfaces disagree with its own registries.

**Evidence.** `sk-doc/description.json:3` claims "thirteen nested workflow packets" and names `sk-design-diagram` and `sk-design-chart` among them (read and confirmed). `sk-doc/mode-registry.json` holds 14 modes, and `leaf-manifest.json` holds modes under the same shape (both parsed). `parent-skills-nested-packets.md:173` records `sk-design` as the parent hub owning the chart and diagram modes. Reported by iteration 8 and not re-verified by me: `graph-metadata.json:427` says "fifteen", `:352` cites a key file living under `sk-design`, `ROUTER.md:75-87` defines chart and flowchart leaves that `INTENT_SIGNALS:149-168` carries no intent for, `README.md:221` and `:231` link relative paths that resolve only under `sk-design`, and `registry-compiler.cjs:222-224` already refuses cross-hub pairings.

**Files.** `sk-doc/description.json`, `graph-metadata.json`, `ROUTER.md`, `README.md`, and the canary fixture under `009-parent-hub-rollout/007-sk-doc/fixtures/`.

**Cost.** Medium. Verify the unchecked claims before editing. `sk-create-repo-rule` itself routes consistently across all five surfaces, so the rule-authoring path is not broken by this.

### 10. Reconcile `AGENTS.md:182` with what the router actually carries

**Change.** `AGENTS.md:182` says `REPO RULES.md` carries "verification commands and local contracts" alongside the posture rules. Nothing does.

**Evidence.** `AGENTS.md:182` read and confirmed. `REPO RULES.md:77-83` lists what is In and names no verification commands. `decision-tests.md:59-61` lists the same In set without them. The router template has no slot for them, and `repo-rules-router-template.md:97-99` states the doctrine that the moment a router explains how rather than where, it has stopped being a router. A prior decision record reached the same conclusion at `specs/sk-git/028-crawlable-commit-history/002-format-decision/decision-record.md:452` and `:481` (reported by iteration 5, not re-verified by me).

**Files.** Either `AGENTS.md:182` (scope the sentence down) or a deliberate new slot in the template and references, which the current doctrine forbids.

**Cost.** One line, but it is an `AGENTS.md` edit and therefore an operator call.

### 11. Reconcile Gate 2's stated bar with the advisor's actual pair

**Change.** `AGENTS.md:103` and `:110` state a one-dimensional bar, confidence at or above 0.8. The maintained contract is a pair.

**Evidence.** `skill-advisor-hook.md:37` and `:135` both state "Default confidence/uncertainty pair is `0.8 / 0.35`". `:185` shows both thresholds in a live invocation. `AGENTS.md` contains zero occurrences of `0.35` (grep count 0). All verified.

**Files.** `AGENTS.md` §2.

**Cost.** One line, operator call. The live hook path carries both numbers, so this only bites a manual or degraded check that applies the stated bar alone and invokes a skill the advisor's gate would have rejected. Whether `AGENTS.md` should state the pair or record why the confidence half suffices is the operator's to decide.

### 12. Resolve the second confidence scale in the command assets

**Change.** `AGENTS.md:85` says the Confidence Thresholds table "is the single scale, do not carry a second one". Thirty-six command assets carry one.

**Evidence.** Verified: 36 files under `.opencode/commands/` contain a `confidence_framework` block. `create-repo-rule-auto.yaml:33-43` carries bands of 80-100, 40-79 and 0-39. Most of it is compatible with `AGENTS.md:94-97`, but `create-repo-rule-auto.yaml:73` makes the checklist read "Confidence >=80%? (if not: ask)" while `AGENTS.md:95` says the 40-79 band is "Proceed with caveats". A run at 65 percent gets two different instructions.

**Files.** Either `AGENTS.md:85` (scope the sentence to exclude command-local state) or 36 command assets.

**Cost.** One line, or a 36-file sweep. The letter-level violation is exact, so the cheap fix is scoping the sentence if the blocks are intended.

### 13. Settle the Gate 2 tool naming across seven surfaces

**Change.** `AGENTS.md:61` still names `skill_advisor.py` as a Gate Action. `AGENTS.md:101` was rewritten during this research run and now describes the CLI as the advisor's single front door, with the Python scorer running when the daemon is unreachable and the brief rendering `Advisor: stale`. Five `cli-*` files plus `sk-git` still describe Gate 2 as running via `skill_advisor.py`.

**Evidence.** `AGENTS.md:61` and `:101` read and confirmed at current state. Reported by iterations 2, 3 and 9 and not re-verified by me: `sk-git/SKILL.md:587`, `cli-opencode/SKILL.md:357`, `cli-claude-code/SKILL.md:369`, `cli-codex/SKILL.md:370`, `cli-cursor/SKILL.md:403`, `sk-git/README.md:79`, `install-guides/README.md:1032`, and `skills/README.txt:80` contradicting its own `:69` four lines earlier.

**Files.** `AGENTS.md:61` plus six to eight skill and guide surfaces.

**Cost.** Low per edit. Note the Python tool is still correct for `--emit-routing-projection`, so the fix is role scoping and not removal.

### 14. Align `blast-radius.md:63` with its own §3 and with the live policy

**Change.** `:63` places in the irreversible tier "any push to a remote branch that is not release or reserved". `:93-96` calls the same set "non-allowlisted". The live policy is main, release branches, and any glob in the allowlist file.

**Evidence.** Both lines read and confirmed. `AGENTS.md:333` already uses the allowlist term, so `:63` is the outlier against both its own file and the document it expands.

**Files.** `repo-rules/blast-radius.md`, one clause, plus a version bump per `agents-md-integration.md:89-94`.

**Cost.** One clause. This is the only rule-file wording change anyone proposed that is not a rendering defect.

### 15. Repair the spliced blockquote in `prevent-overengineering.md`

**Change.** Line 78 runs prose and a blockquote marker together, so the worked example renders as garbled text.

**Evidence.** Read and confirmed verbatim: the paragraph ends "The sentence, written out, > "Extending `parseConfig` in place fails". The corpus has one instance.

**Files.** `repo-rules/prevent-overengineering.md:77-80`.

**Cost.** One paragraph. This is the one rule-file content edit the whole run leaves owed, and it is currently shared into both siblings.

### 16. Port the hardened precedence block into the router template

**Change.** All three live routers carry a hardened precedence row and the Gate 5 composition sentence. The template a new repository is bootstrapped from carries neither.

**Evidence.** Template `repo-rules-router-template.md:59` reads "Every `AGENTS.md` hard blocker and mandatory gate". Live `REPO RULES.md:24` reads "Every `AGENTS.md` §1 hard blocker, the Four Laws, PLAN-WORKFLOW LOCK, Comment Hygiene, and every mandatory gate in §2". Template `:64-65` stops at "None relaxes a hard block". Live `REPO RULES.md:29-32` adds that Gate 5 makes the load mandatory while the content stays at level 3. All four read and confirmed.

**Files.** One template asset.

**Cost.** Two blocks. Whether the lag is deliberate is unknown from the tree, and the divergence stands either way.

### 17. Add the federation mechanics to the rule-authoring references

**Change.** The authoring packet has no concept of the federation. Creating, promoting or removing a shared rule requires, per sibling, a symlink, a `.gitignore` line, and a trigger and index row. Nothing in the packet says so.

**Evidence.** Iteration 6 grepped the packet for symlink, sibling, federation and monorepo vocabulary and found zero relevant hits. I verified the mechanics it would have to describe: the nine-file shared block at `Obsidian Plugin/.gitignore:82-92`, the relative symlink shape (`repo-rules/communication.md` pointing at `../../Code_Environment/Public/repo-rules/communication.md`), and the statement both sibling routers carry at `Mobile CLI/REPO RULES.md:100-101` and `Obsidian Plugin/REPO RULES.md:93-94`.

**Files.** `references/agents-md-integration.md`, the router template, the packet README.

**Cost.** One section. This is the mechanism by which item 1's breakage happened, so doing item 1 without this leaves the next rule to repeat it.

### 18. Give the rule corpus mechanical coverage

**Change.** Nothing checks the rule system. Not CI, not a hook, not the link guard.

**Evidence.** Verified: `.github/` holds 18 workflows and a recursive grep for `repo-rule` returns zero matches. `check-markdown-links.cjs:23-26` fixes its roots to five directories under `.opencode` and `.claude`, so the repo root, `REPO RULES.md`, `AGENTS.md` and `repo-rules/` are all outside the walk, and a `.txt` catalog is doubly invisible. Reported and not re-verified by me: the walk collects only real files and never follows leaf symlinks, which matters because in the siblings the rule files *are* symlinks. The audit packet recorded the decision not to build one, at `implementation-summary.md:265` ("No automated checker was wired"), on the reasoning that nothing failed. That reasoning is now falsified by item 1.

**Files.** `.github/` or a doctor target. A reference implementation exists at `specs/sk-doc/043-repo-rules-router-audit/scratch/invariant-check.cjs`.

**Cost.** Medium build. Requirements the research establishes: resolve symlinks, walk sibling roots, cover root-level files, and check row-versus-fires coverage as well as counts and links.

### 19. Refresh the skills front door

**Change.** `.opencode/skills/README.txt` mis-describes the fleet and carries a broken link.

**Evidence.** Verified: `:3` and `:31` say eleven top-level identities, disk holds 13 roots. `:24` says `sk-*` (5), disk holds 7 (`sk-code`, `sk-communication`, `sk-design`, `sk-doc`, `sk-git`, `sk-prompt`, `sk-vision`). `:61` links `sk-design-md-generator/README.md`, which does not exist. The real path is `sk-design/sk-design-md-generator/`. `sk-communication` and `sk-vision` have no rows at all.

**Files.** One catalog file.

**Cost.** Small. Note this file survives the markdown link gate because it is a `.txt`, which is item 18's point in miniature.

### 20. Compress `AGENTS.md:192`, a near-duplicate of `:28`

**Change.** Delete `:192` and keep `:28`.

**Evidence.** Both read and confirmed. `:28` says Law 4 blocks forward progress while a check is failing, that a failing check may enter the bounded remediation loop in §3, and that the hard stop remains until the authoritative gate passes. `:192` says Law 4 keeps forward progress blocked while a check fails, and that diagnosis and repair are the permitted bounded remediation loop rather than permission to proceed. Same claim. `:28` additionally points to §3, so the bridge survives.

**Files.** `AGENTS.md`, one line.

**Cost.** One line, operator call. No load-timing risk, because the surviving copy is in the same always-loaded document.

### 21. Compress the advisor mechanics in `AGENTS.md:101`

**Change.** Keep the direct-call command and the clause explaining that a degraded `Advisor: stale` brief is expected. Drop the front-door, daemon-start and Python-path mechanics to their owners.

**Evidence.** `AGENTS.md:101` read at current state and it does carry all of it. Reported by iteration 8 and not re-verified by me: the same facts live at `system-skill-advisor/SKILL.md:297`, `README.md:42`, `INSTALL-GUIDE.md:239`, `daemon-cli-reference.md:44-46` and `render.ts:458`.

**Files.** `AGENTS.md`, part of one line.

**Cost.** A few words. The command must stay, because when no hook brief arrives it is the only Gate 2 path and it has to be available before the first tool call.

### 22. Compress `AGENTS.md:112` and trim `:114`

**Change.** Keep two sentences and drop the rest to their owners. From `:112`, keep the warning that these filenames also name spec-folder continuity metadata and are never interchangeable, because that binds while merely reading a file list. From `:114`, keep "Never report a mode as routed because a registry entry exists", because reporting happens on read-only turns where no rule file loads. Drop the required-and-forbidden matrix detail and the routing-class mechanism sentence.

**Evidence.** Both lines read and confirmed. The matrix is duplicated in `skill-root-metadata-contract.md`, which loads during skill authoring.

**Files.** `AGENTS.md`, two lines.

**Cost.** A few lines. Contested inside the lineage: iterations 3 and 5 proposed it, iterations 6 and 8 refused it on the read-only test. All four agree the two binding sentences stay, so the disagreement is only about the mechanism text. Low value either way.

### 23. Compress the exit-code parenthetical at `AGENTS.md:266`

**Change.** Drop the four-way exit-code taxonomy and keep the pointer.

**Evidence.** Verified: `AGENTS.md:266` carries "exit 0 = pass, including a run that reported warnings, 1 = user error, 2 = validation error, 3 = system error" plus the warning-is-advice sentence. `validation-rules.md:44` carries the same taxonomy and the same warning semantics. That reference already owns the four ways a run lies, so this is the same class of mechanics.

**Files.** `AGENTS.md:266`, `validation-rules.md` as the standing owner.

**Cost.** Part of one line. Constraint: the explicit `RESULT: PASSED` requirement must not move, because it is the pass criterion rather than mechanics.

### 24. Relocate the MEMORY SAVE mechanics bullets

**Change.** Keep the trigger, the hard block and the pointer. Move the three mechanics bullets.

**Evidence.** Verified: `AGENTS.md:288-290` carries the writer path, "The save writes metadata, not prose", and "Read the post-save quality review before calling the save done". `save-workflow.md:551-553` carries §11 POST-SAVE QUALITY REVIEW and the fact that `generate-context.js` emits it. The receiver loads on the save path, which is a write path, so Gate 5 timing is satisfied.

**Files.** `AGENTS.md:286-290` and `save-workflow.md`.

**Cost.** Three bullets. Contested: iteration 1 proposed it, iteration 4 refused relocation on the ground that spec-folder mechanics are out of the rule set's scope. The two are talking past each other, because the destination here is a spec-kit reference and not a rule file. One clause has no home at the receiver and must move with the text or stay: that editing continuity frontmatter directly is a legitimate shortcut.

### 25. Name where refusals are recorded

**Change.** Three documents mandate recording every refusal with the test it failed. None names a destination.

**Evidence.** Reported by iteration 2 and not re-verified by me: `decision-tests.md:136-138`, `agents-md-integration.md:107-108`, and the packet `SKILL.md:218` success criterion. Iteration 2's search for a register artifact under the packet returned only playbook scenario files.

**Files.** Either a register artifact under `sk-create-repo-rule`, or a step folded into the retire ordering.

**Cost.** Small. This synthesis is itself evidence of the gap: roughly forty refusals across ten passes, and their only durable home is this spec folder.

### 26. Settle the version convention

**Change.** `agents-md-integration.md:92-94` prescribes bumping the fourth segment and states as its premise that all rules sit at `1.0.0.0`. Two files have diverged, and they diverged differently.

**Evidence.** Verified: `delegation-and-orchestration.md:27` is `1.0.0.2`, which follows the guidance. `handoff-and-questions.md:25` is `1.1.0.0`, which does not.

**Files.** The reference's premise sentence, and optionally one rule's frontmatter.

**Cost.** Small. A convention two revised files already disagree on is not yet a convention.

### 27. Decide one reproducible distribution model for the sibling `AGENTS.md`

**Change.** Pick one policy and write it down.

**Evidence.** Verified: both sibling `AGENTS.md` files are absolute symlinks into this checkout. Reported by iteration 7 and not re-verified by me: Mobile CLI commits them with no ignore entry, while Obsidian Plugin untracks and ignores them, with the reasoning written out in its `.gitignore` that an absolute symlink resolves to nothing on a fresh clone and leaks the local filesystem layout. Two repositories, opposite policies, same edge.

**Files.** Sibling documentation and `.gitignore` files, plus one line in the authoring reference.

**Cost.** A decision plus small edits. Neither current policy survives a fresh clone: one produces dangling links, the other produces no file at all, and the file that goes missing is the one carrying Gate 5.

### 28. Close the Gate 5 reach question for the mirror runtimes

**Change.** Either instrument Gate 5 reach the way Gate 1 reach is instrumented, or record per-runtime inheritance the way Pi and Devin already do.

**Evidence.** Reported by iterations 3 and 9, partly re-verified by me. Verified: `.github` and the mirrors carry no `REPO RULES` reach signal. Reported and not re-verified: the generated pointer block in `.codex/AGENTS.md:124-132` and `.cursor/rules/skill-routing.md:20-28` carries only the Gate 1 lookup, and `doctor-speckit-retrieval.yaml:162,175` models `gate1_reach` per runtime with no equivalent for Gates 2, 3 or 5.

**Files.** The doctor target or the sync manifests.

**Cost.** Medium. The honest framing is that reach is unverified for Codex and Cursor rather than known to be broken. It matters because every relocation out of `AGENTS.md` assumes a reach the repo does not measure.

### 29. Register the deliberate tier divergence in `rule-anatomy.md`

**Change.** The contract's own description promises that every divergence is classified as a permitted variant or a forbidden defect. One divergence is unclassified.

**Evidence.** Verified: `skill-hub-routing.md:22` carries `importance_tier: normal` where all ten peers carry `important`, and `:31` carries a third header blockquote line explaining why, where the template header is exactly two lines. Neither the tier value nor the blockquote count appears in the reference's table of what varies.

**Files.** `rule-anatomy.md`, one row or one note.

**Cost.** One line. The divergence is deliberate and self-explained in the rule. What is missing is its registration, so a generator author cannot tell whether `normal` is permitted.

### 30. Give `AGENTS.md:114` its bare reference a path

**Change.** The line ends by naming `parent-skills-nested-packets.md` with no path, so it resolves only through `skill-hub-routing.md:68`, which loads on a write turn.

**Evidence.** `AGENTS.md:114` read and confirmed. The file exists under `sk-doc/sk-create-skill/references/parent-skill/`.

**Files.** `AGENTS.md:114`.

**Cost.** A path. Lowest-value item that is still a real defect.

### 31. Weak, kept for completeness

These are real observations that no iteration could turn into a case for action. They rank last because the evidence is thin, not because they are wrong.

- **The trigger-breadth statements under-count.** `REPO RULES.md:80-83` calls communication "the one rule here whose trigger is every substantive reply", and `communication.md:37-39` calls its trigger "the broadest in the set", while `handoff-and-questions.md:35` fires on ending a turn "of any kind, substantive or not". Reported by iteration 4, not re-verified by me. Weak because nothing observably fails, though the sentences are the stated justification for what §8 keeps.
- **The `sk-code-mobile-cli` asymmetry.** `sk-code-obsidian` cites its repository's `REPO RULES.md` as a verification source, and the Mobile CLI surface packet cites neither its router nor its local rules. Possibly deliberate. No binding need surfaced.
- **The §9 duplicated heading.** `AGENTS.md:415` and `:417` carry the same heading text at two levels. Cosmetic.
- **The playbook scenario RRA-001's owner check greps only `repo-rules/`**, so it cannot see ownership in `sk-git` or the hooks, and its admitted example asserts "no existing owner" for a failure those surfaces already address. A test-corpus gap, not a rule.
- **Bare backticked paths the checkers cannot see.** `agents/orchestrate.md:847` and `agents/markdown.md:203` name rule assets as backticked text rather than links, so no link checker sees them. Future drift points with no guard.
- **`retrieval-conventions.md:283` is the only place the Gate 5 exclusion decision is reasoned**, and its count is wrong. The decision holds. Fix the count, not the policy.

---

## REFUSALS

Every proposal considered and declined across the ten passes, with the deciding reason. The tests referenced are the mode's own: test 1 is the always-loaded test (content that must bind when no trigger fires cannot live in a rule file, `decision-tests.md:32-33`), test 2 is the scope boundary, test 3 has four parts of which part 1 is "a cluster, not a single row", part 2 is "it already has a home" and part 4 is "an `AGENTS.md` anchor exists", and test 4 is restraint, meaning a named failure must exist.

### Pre-refused before this research began

Recorded at `decision-tests.md:94-96`, verified: the adoption phase refused ten candidate rules, being gate-discipline, git and PR, communication-format, testing, security, memory, spec-folder, skill-routing, delegation-mechanics, and collaboration. Every iteration re-confirmed the class and none reopened it.

### New rule candidates refused, by iteration

| Candidate | Deciding reason | Where the content belongs |
|---|---|---|
| Comment-hygiene rule (1, 2) | Test 3 part 2, three existing homes. Also a demotion: `AGENTS.md` §1 blockers sit at precedence level 1 and rule files at level 3 | `AGENTS.md:44-46`, `code-style-guide.md` §4, the pre-commit and PR gates |
| Git workflow rule (1, 5) | Pre-refused class, plus test 3 part 2. Re-scored 4 out of 10 in a prior decision record against 8 for tightening the existing rule | `sk-git`, `blast-radius.md`, `AGENTS.md` §5 |
| Spec-folder or validation rule (1) | Pre-refused, and spec-folder mechanics are out of scope | system-spec-kit references |
| Memory-save rule (1) | Pre-refused class | `save-workflow.md`, `save.md` |
| Retrieval-discipline rule (1) | Test 2 and test 3 part 2 | `AGENTS.md` §5, `retrieval-conventions.md` |
| Deep-loop iteration rule (1) | Test 2, workflow mechanics are out | `AGENTS.md` Gate 4, the mode packets |
| CLI-executor briefing rule (1) | Test 2, dispatch mechanics are out | `AGENTS.md` §10, each `cli-X/SKILL.md`, delegation rule §2 |
| MCP tool-discovery or naming rule (1, 3) | Test 3 part 2, plus test 1 for the availability clause | `AGENTS.md` §5, `naming-convention.md` |
| Skill-advisor routing rule (1) | Pre-refused as skill-routing | the advisor's own corpus |
| Router-parity rule (1, 3) | Test 1 (parity matters only while editing the rule system) and test 3 part 1 (a single row) | `agents-md-integration.md:73-74`, the packet README recipe |
| Ask-surface rule (1) | Test 3 part 2, already admitted as the fourth widening rather than a file | `handoff-and-questions.md` §5 |
| Runtime-quirk or Pi-plugin rule (1) | Test 3 part 4, no anchor, plus test 3 | `.pi/PLUGINS.md`, runtime docs |
| Dependency-acquisition rule (1) | Test 3 part 2 | `prevent-overengineering.md` §4, `blast-radius.md` §6 |
| Gate-5 or rule-loading rule (2) | Test 2, gates are plumbing and kept out so each has one place to change | `AGENTS.md` §2, `REPO RULES.md` §1 and §2 |
| Repo verification-commands rule (2) | Test 4, no named failure | existing §4 and §6 pointers |
| Child-containment rule (2) | Test 3 part 2, and the spec-gate child no-op removes the question | `delegation-and-orchestration.md` §2 |
| Mirror-sync rule (2, 3) | Test 2 and test 3 part 4, no anchor, plus drift is mechanically checkable | the five `SYNC.md` manifests, `/doctor runtime-mirrors` |
| Concurrency or isolation rule (2, 5) | Test 4, the worktree model and guard already address it | `sk-git`, the hooks |
| "Record refusals" as a rule (2) | A single process obligation, not a trigger-shaped cluster | a doc or process artifact, item 25 above |
| Runtime persona-resolution rule (3) | Test 3 part 2, the defect is stale citations and not a missing constraint | `AGENTS.md` §9, the `cli-*` skills |
| "Registration is not availability" as a rule (3, 10) | Test 1, it binds on read-only tool use | `AGENTS.md:363`, already present |
| Skills-catalog maintenance rule (3) | Test 3 part 1, one obligation | the catalogs, by dropping hand-maintained counts |
| "Generated counts only" rule (3) | Test 3 part 1 | per-document self-measuring checks |
| Surface-repo verification rule (3) | Test 3 part 2 | `sk-code-obsidian` references |
| "Mirrors must carry the rule router" rule (3) | Test 3 part 4, no anchor, plus test 2 pressure | the pointer generator and SYNC manifests |
| Advisor-fallback statement as a rule (3) | Test 3 part 1, a single row | `AGENTS.md:101` as owner |
| Rule-corpus checker coverage as a rule (4) | Test 3 part 1, plus restraint: a rule cannot run a check | the checker layer, item 18 above |
| Single confidence scale as a rule (4) | Test 1, confidence judgment binds on read-only request handling | `AGENTS.md:85` as owner |
| Dual-threshold completeness as a rule (4) | Test 1, Gate 2 fires on read-only turns too | `AGENTS.md` §2 Gate 2 |
| Dispatch-time gate-resolution duty as a rule (5) | Test 1, the duty binds at dispatch, which happens on read-only turns | `AGENTS.md:493`, `cli-opencode/SKILL.md`, the child-dispatch preamble |
| Verification-command registry as a rule (5) | Test 3 parts 1 and 4, plus restraint: nothing fails that a wording fix does not fix | item 10 above |
| Authoring-asset count maintenance as a rule (5) | Test 3 part 2 and test 4. The assets should not carry counts at all | delete or refresh the counts |
| Federation propagation discipline as a rule (6, 10) | Test 3 part 2 (`blast-radius.md:105` already names other repositories as consumers) and test 3 part 4 (no anchor) | `agents-md-integration.md`, item 17 above |
| Corpus-count scope-noun standard as a rule (6) | Test 3 part 2, a documentation convention owned by the references | the references themselves |
| Cross-repository link verification as a rule (6) | Test 3 part 2, the command's verify step and the link tooling own it | the verify step and item 18 |
| Sibling-distribution checklist as a rule (7) | Test 3 part 2, rule-authoring mechanics | the packet references, item 17 |
| Federation distribution model as a rule (7) | Test 3 part 2, with test 2 borderline: it binds on infrastructure, not on an in-session action | the authoring reference and sibling docs, item 27 |
| Symlink-safe tooling discipline as a rule (7) | Test 1 (binds while running tools) and test 3 part 2 (the tooling owns its semantics) | the tools themselves, item 18 |
| Compiled-routing claim discipline (8) | Test 3 part 2, `skill-hub-routing.md:38-39` already fires on reporting a mode routed | the existing rule and the per-hub SKILLs |
| Hub roster parity rule (8) | Test 3 part 2. The need is repair, not a rule | `skill-hub-routing.md`, the metadata contract, the per-hub gate |
| Canary expected-field assertion rule (8) | Test 3 part 2, and a behavioral rule cannot make a fixture assert its own fields | the rollout harness |
| Row-versus-fires edit discipline as a rule (8) | Test 3 part 2, the wiring contract already states it at `agents-md-integration.md:87-88`. The gap is enforcement | the contract, plus item 2's second leg |
| Cross-reference currency discipline (9) | Test 1 (binds while reading and quoting) plus test 3 part 2 | the owning documents, item 7 |
| Corpus-metric freeze discipline (9) | Test 3 part 2 and test 4. The fix is deleting counts, not constraining behavior | the authoring references, item 8 |
| Version-and-premise currency discipline (9) | Test 3 part 2, `agents-md-integration.md` §4 owns the scheme | the reference's premise sentence, item 26 |
| Authority-pointer registry (9) | Test 3 part 2, each document owns its pointers | item 7 |
| Comment-hygiene ownership (9) | Test 3 part 2, three owners already. The observed failure was one stale filename | item 7 |
| Scenario-contract currency (10) | Test 3 part 2 and test 4 | the scenario files, item 5 |
| Bootstrap-router hardening parity (10) | Test 3 part 2, the template owns its content. Test 1 passes, which is why test 3 decides it | the template, item 16 |
| Worktree rule-system presence (10) | Test 1, test 3 part 2 and test 4. The worktree found is a legitimate older branch, and rules follow branches | withdrawn |
| Trigger-index inclusion (10) | Test 3 part 2 (`retrieval-conventions.md:283` records the decision and its reason) and test 4 (exclusion mechanically confirmed) | the existing decision note |
| Federation local-marker discipline (10) | Test 3 part 2, and the sibling routers show the marker is already implementable | the open propagation decision, item 1 |

### Relocations out of `AGENTS.md` refused

Each of these was tested and declined. The common reason is the operator's own constraint: the content must bind on a turn where Gate 5 never fires.

| Block | Deciding reason |
|---|---|
| Restraint Signals table, §3 | Not a duplicate. `prevent-overengineering.md:102` says the table binds and is not repeated there. Removing it deletes the only copy. Verified |
| Confidence Thresholds bands, §2 | Not a duplicate. `uncertainty-and-honesty.md:48-49` says there is exactly one of it and this file carries no second copy. Verified |
| Violation Recovery, §2 | Already refused in the adoption phase, because its trigger fires exactly when the trigger-loaded path may already be broken |
| The four Verification Standards, §4 | The document states its own test at `AGENTS.md:240`: these bind unconditionally, including on a read-only turn where Gate 5 never fires. Verified |
| §10 Quick Reference table | The receiving surfaces do not auto-load, and the order-that-matters column binds before a command is chosen. Contested, see disagreements |
| §5 Git Workspace Safety table | Binds before any routing fires. The advisor brief is reported dormant under one runtime's CLI build, and `sk-git` loads only through Gate 2 routing, so the table is the read-turn carrier. Contested, see disagreements |
| §5 MCP Tool Routing block | "Registration is not availability" binds while describing or promising tools, on any turn |
| §2 Skill Routing Reference intro | Defines what invoking a skill means, and skill loading happens in read-only research |
| §2 advisor-metadata paragraphs | The filename-collision guard binds while reading a file list. Partly contested, see item 22 |
| §1 Comment Hygiene | Relocating demotes it from precedence level 1 to level 3. A relocation that changes the class is not a relocation |
| §1 Iron Law line | CI-locked. A canary pins its concepts in this file, so moving it fails the check by design |
| §1 PLAN-WORKFLOW LOCK and Halt Conditions | Bind at moments that occur with no trigger, including mid-read |
| §2 Gate 3 option list | The human-readable list is the authority for runtimes that do not call the classifier, which is exactly the case no other surface covers |
| §2 Gate 4 tiebreakers | The executor-name case arrives mid-task, including on read-only runs |
| §2 Consolidated Question Protocol | Binds before the first tool on a multi-question request |
| §3 Execution and Blast-Radius bullets | They are the read-turn carriers for rules that only load on write turns |
| §4 "Invoking validate.sh" warning | A completion claim can arise on a read-only turn |
| §4 completion and freshness items | Claims are made at turn boundaries, and the flags have no other always-loaded home |
| §5 Code Search Decision Tree and Terminal Discipline | Both bind while searching and running commands. This research run is the evidence |
| §6 child-packet sentence | Binds at the packet-creation decision, which precedes the first write. The receiving surfaces load after the decision |
| §7 Escalation and Logic-Sync | Contradiction halts happen while reading |
| §8 pointer paragraphs | Govern every substantive reply, read-only turns included |
| §9 runtime-directory table | No existing owner carries the six-runtime mapping, so relocation orphans it |
| §9 Template and Validation paragraph | Pointer circularity: moving it into the contract it points at means you find it only after loading the contract |
| §10 Operational Mandates | Honesty rows bind during analysis replies, the dispatch row binds before composing a dispatch, which can precede any write |
| §10 data-not-instructions line | Binds before any content handling, and it is security posture |
| §10 trigger-index maintenance row | The duty arrives after an unrelated edit, when nothing loads. The row is its only carrier |
| Preamble Multi-Repository Architecture | The precedence sentence must hold when a rule file is read. Each precedence copy has a distinct role |
| MEMORY SAVE and GOAL POSTURE | Refused as a move into the rule set. Not the same question as item 24, which moves to a spec-kit reference |
| Removing `AGENTS.md:101`'s direct-call block outright | When no hook brief arrives, that command is the only Gate 2 path and must be available before the first tool |

### Withdrawals and reversals inside the lineage

- **The "fifth validate.sh trap" finding was withdrawn by its own author** in iteration 7. `validation-rules.md` §14 already carries the symlink trap as its own item, so `AGENTS.md`'s four-ways claim is upheld.
- **The audit packet's zero-broken-links record was re-characterised**, not falsified. It was true when measured and was invalidated later when the two local-only rules were added.
- **One long-open audit question was closed as KEEP.** A 2026-08-08 audit flagged the post-save review sentence in `AGENTS.md` as possibly stale. The mechanism is live, so nothing to cut.
- **A worry about the dispatch-time gate duty dissolved under verification** rather than being refused: the always-loaded dispatch rule already routes every dispatch through the `cli-X` skills, which carry the duty explicitly.

---

## DISAGREEMENTS ACROSS ITERATIONS

Where the ten passes did not agree, with what the evidence says.

### 1. The length-table arithmetic. Three answers, one is right.

Iteration 1 said three rows of the nine-row table no longer hold. Iteration 2 said most of that was a counting-convention artifact and only two rows are really stale. Iterations 6 and 7 said five rows undercount by one and delegation by two.

**Measured this session by `wc -l`:** seven of the nine rows are exact (skill-hub 127, uncertainty 144, blast 154, root-cause 159, prevent 162, scope 164, evidence 210). Two are stale: communication reads 192 against a tabled 244, and delegation reads 249 against a tabled 248.

**Iteration 2 is right.** Iteration 1 overstated by one row and iterations 6 and 7 invented an off-by-one that does not exist, because they measured with a reader that counts a trailing partial line and compared against a table built with `wc -l`. This is the single clearest example in the run of one model family making the same measurement mistake twice, in different passes, in the same direction.

### 2. Whether "nine" is stale or correct.

Iterations 1 through 5 treated every "nine shipped rules" claim as falsified by an 11-file corpus. Iteration 6 re-scoped it: nine is the shared set, symlinked into the siblings, and the two extra files are local to this repository.

**Iteration 6 is substantially right, and it supersedes the earlier framing.** Verified: both siblings pin exactly nine shared files in a `.gitignore` block, and that block is the only machine-readable definition of the shared set. But iterations 1 through 5 are still right about the specific measurements. Phrase count is 158 shared and 194 total, against a claimed 161, so it is stale under either scope. The version premise is falsified under either scope. `creation-standards.md:138-139`'s "four sideways links across eight files" reproduces under no scope I can measure.

**The synthesis:** the number nine is defensible and the documents never say so. Fix the scope noun before the numbers.

### 3. The cross-reference count at `rule-anatomy.md:122`.

Iteration 1 called it falsified. Iteration 6 called it exactly right for the shared nine and recorded the reversal.

**Measured:** 14 in-set links across 5 files for the whole corpus. Dropping the two local-only files' own links leaves 10 links from 3 files, which matches the claim. So iteration 6's reading holds, with one caveat iteration 6 did not name: one of those 10 is `communication.md:47` pointing at `presenting-decisions.md`, which is outside the shared set and is precisely the link that is broken in both siblings. The arithmetic survives on a link that should not be counted.

### 4. The malformed Doctor row. Does not reproduce.

Iteration 5 reported `AGENTS.md:474` as malformed at the byte level, with a backslash preceding whitespace rather than the pipe, so the table row renders with shifted columns.

**Checked byte by byte with `od -c`.** The raw cell reads `` `/doctor:mcp install\|debug` ``, with the backslash directly before the pipe. The escape is correct and the row is well-formed. No other iteration repeated the claim. **This finding fails and does not enter the recommendations.**

### 5. The Git Workspace Safety table. Two say compress, three say keep.

Iterations 1 and 2 proposed compressing four of the eight rows into `sk-git`, calling it eight to ten lines of available reduction. Iterations 3, 5 and 7 refused, each with a mechanism: the advisor brief is dormant under one runtime's CLI build, `sk-git` loads only through Gate 2 routing, the hooks are post-hoc rather than preventive, and the ask-first row in particular has no hook backstop.

**The evidence favors keep.** The compress case rests on the owner carrying the content, which is true. The keep case rests on the owner not loading at the moment the content binds, which is also true and is the stronger argument under the operator's own Gate 5 framing. Iterations 1 and 2 did not test load timing for the unrouted case.

### 6. The §10 Quick Reference table. One says relocate, two refuse.

Iteration 2 called it the largest single reduction available, roughly 20 lines, on the ground that `commands/README.txt` is already a complete and maintained index. Iteration 3 refused, because that file is not auto-loaded by any runtime and `.opencode/commands` is deliberately outside both retrieval lanes. Iteration 6 refused the order-that-matters column specifically, because that ordering binds before a command is chosen.

**The evidence favors keep.** Iteration 2 is right that the entry-point column is duplication and right that it identified the one thing nothing else carries. Iteration 3's refusal is the stronger argument, and iteration 2 conceded the load-timing weakness in its own text.

### 7. The MEMORY SAVE mechanics. Apparent conflict, actually two questions.

Iteration 1 proposed relocating three mechanics bullets into `save-workflow.md`. Iteration 4 refused, saying spec-folder mechanics are design-excluded from the rule set.

**Not a real contradiction.** Iteration 1's destination is a spec-kit reference, not a rule file, so iteration 4's reason does not reach it. Verified that the receiver carries the content and loads on the save path. Ranked at 24 on low value, not on conflict.

### 8. `AGENTS.md:112` and `:114`. Two say compress, two refuse.

Iterations 3 and 5 proposed compressing both lines to pointers plus the binding sentences. Iterations 6 and 8 refused relocation on the read-only test.

**Largely agreement wearing a disagreement's clothes.** All four agree that two sentences must stay: the filename-collision warning and the never-report-routed-from-a-registry-entry sentence. The live disagreement is only over the mechanism text between them, which is a few lines of low value either way.

### 9. `AGENTS.md:101`. The document moved under the research.

Iteration 2 quoted `:101` as saying the Python scorer is not a routing fallback and disagrees with the daemon on roughly a third of prompts. That text no longer exists. Current `:101` describes the CLI as the advisor's single front door and the Python scorer as part of the production path when the daemon is unreachable. Iteration 8 proposed compressing the new text. Iteration 9 noticed the change and recorded it as a state change.

**Not a contradiction, a moving target.** Both quotes were accurate when written. The lesson for the operator: any line-number citation in this report is state as of 2026-09-11 evening, and `AGENTS.md` was edited during the run.

### 10. The line count of `AGENTS.md`.

The brief says 501. All ten iterations say 502 and three of them treat the brief as stale. Both are right: `wc -l` reports 501 because the file has no trailing newline, and a reader counts 502. No action.

### 11. What iterations agree on, said once.

Zero new rules, ten times out of ten, with roughly forty candidates refused. Parity holds at 11 files, 11 trigger rows, 11 index rows, verified independently in every pass and by me. The two blocks the operator flagged as look-alikes are single copies and no iteration proposed removing either. No rule file body requires a doctrine change, and the one rule-file edit anyone justified is a rendering repair. The CI gap is real and every pass that looked found the same zero.

---

## CITATION CHECK

**Checked: roughly 92 distinct citations, at least 5 from every iteration**, by opening the cited line with `sed`, `grep`, `od` or a directory listing. Coverage by iteration: 14, 9, 7, 9, 5, 12, 7, 11, 8, 10.

**Failures: 1 outright, 3 defects of lesser kinds.**

1. **Outright failure. Iteration 5, finding 3.2 and ranked item 1: `AGENTS.md:474` is malformed at the byte level.** The raw bytes show the backslash correctly escaping the pipe. The row is well formed. This claim does not enter the report.
2. **Recurring arithmetic error across iterations 1, 6 and 7.** The length-table deltas were computed against a different line-counting convention than the table uses. Under `wc -l`, seven of nine rows are exact. Iteration 1 overstated by one row, iterations 6 and 7 invented a systematic off-by-one. The two genuinely stale rows survive.
3. **Stale by drift, not by error. Iteration 2's quote of `AGENTS.md:101`.** Accurate when written, gone now, because the line was rewritten during the research run.
4. **Off by one, trivial. Iteration 4 cited `skill-advisor-hook.md:136`** for the 0.8 and 0.35 pair. The pair is at `:135` and also at `:37`, which iteration 4 cited correctly.

**Everything else resolved**, including every load-bearing claim behind ranked items 1 through 9. Spot checks that I specifically hunted for failures in and did not find: the seven broken sibling references, the ten Section-6 pointers (exactly ten, no more and no fewer), the five row-versus-fires gaps (all five, plus the two keyword drops), the six widening surfaces (all six, with the internal two-versus-three split inside one file), the two dead references in `code-quality-standards.md`, the zero CI matches, the link checker's root list, and both protected single-source blocks.

**One correction to the material that is mine, not the lineage's.** Iteration 9 says root `CLAUDE.md` is content-identical to `AGENTS.md` by per-line hashes. It is a symlink, which is stronger and explains why they can never diverge. That matters for the dead reference at `code-quality-standards.md:53`: the ANTI-PATTERNS table is not missing from a sibling document, it is missing from the same document under another name.

---

## WHAT THIS DOES NOT COVER

**One model family, ten times, is not corroboration.** Each pass was told what earlier passes found and told not to repeat them, so the divergence between iterations is engineered rather than independent. When ten passes agree, that is one model restating itself with a memory of what it already said. The measurement error in items 1, 6 and 7 of the disagreements section is the concrete cost: a second family would probably have caught a convention mismatch that this family made twice. Two other lineages were planned and both produced nothing.

**Nothing was executed.** No pass ran `validate.sh`, CI, the doctor, the advisor, or any validator. Every claim about enforcement is grep-and-read state at a moment in time. The statement that no CI reads the rule corpus is a grep result, not a run result. The statement that a checker would catch the federation breakage is untested.

**The fourth repository was never found.** The audit packet names four repositories in the federation. A search of the development tree returns three routers. Federation state is verified for this repo and two siblings. The fourth is unknown.

**Runtime reach is unverified where it matters most.** Whether Codex and Cursor natively load the root `AGENTS.md` is asserted nowhere in the repository. Pi and Devin have evidence. The mirror pointer blocks carry the Gate 1 lookup and nothing about Gate 5. Every relocation proposal assumes a reach the repo does not measure, which is one more reason the Q4 answer is "almost nothing".

**No git history was read.** Every "this drifted" finding says what the state is and not when or why it got there. Whether the ten Section-6 pointers reflect a renumbering or were always wrong is unknown. Whether the router template's lag is deliberate is unknown.

**Refusal by decision test is a test of fit, not of value.** Roughly forty candidates were declined because they failed a structural test or because a home exists. None was tested against the question of whether having it would improve behavior. A rule can have a home and still be worth stating.

**The operator decisions are not research questions.** Four items wait on a choice no further iteration resolves: propagate or re-scope the two local rules, which distribution model the sibling `AGENTS.md` uses, whether the command assets or the single-scale sentence gives way, and whether Gate 2 should state the uncertainty threshold or record why it need not.

**The document moved during the run.** `AGENTS.md:101` was rewritten between the second and ninth passes. Treat every line number here as state on 2026-09-11 and re-check before editing.
