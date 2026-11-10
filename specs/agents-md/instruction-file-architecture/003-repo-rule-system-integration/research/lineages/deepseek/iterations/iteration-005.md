{"timestamp":"2026-09-11T19:01:51.455Z","runtime":"claude","status":"ok","freshness":"live","durationMs":2021,"cacheHit":false,"skillLabel":"sk-code"}
# Iteration 5 Findings (read-only)

**Method note.** Everything cited below was opened and re-checked this run against the live tree. Ground truth: `AGENTS.md` is **502 lines** (the brief said 501; the iteration-1 finding stands), `repo-rules/` holds **11 files** with 11 trigger rows (`REPO RULES.md:40-50`) and 11 index rows (`:58-68`). New surfaces opened this iteration beyond the standing set: both authoring **asset templates**, the playbook's `rule-authoring/` files, the full sk-git policy stack (`SKILL.md` §workspace safety, `references/remote-branch-policy.md`, `scripts/remote-branch-allowlist.txt`), the child-dispatch chain (`cli-opencode/SKILL.md` step 17 + `shared/references/child-dispatch-preamble.md`), the per-hub gate implementation (`parent-skill-check.cjs`), the skill-root metadata contract and its load path in `sk-create-skill/SKILL.md`, `route-exclusions.json`, the goal hook's test suite, the four agent mirror trees, `quick-reference.md` §8, the commands front door's Doctor section, and one prior decision record (`specs/sk-git/028-crawlable-commit-history/002-format-decision/decision-record.md`). The two look-alike blocks (`prevent-overengineering.md:102` defers to the Restraint Signals table; `uncertainty-and-honesty.md:48-49` points at the one Confidence Thresholds table) were re-verified as sole copies and are not proposed for removal. Items found by iterations 1-4 are not repeated; where this iteration extends one, it says so. I re-ran no trigger-phrase collision sweep.

---

## Q1. Which new rules do the skills and other system surfaces actually justify?

**Result: zero new rules. Four new candidates, all refused.** The standing constraints still decide: `AGENTS.md:122` ("Trigger: the FIRST write of the session... Read-only turns never fire it") plus `decision-tests.md:32-33` ("**A rule file loads on a trigger. Content that must bind when no trigger has fired cannot live in one.**"), the scope boundary at `decision-tests.md:59-63`, and the router's Out list (`REPO RULES.md:85-86`).

**1.1 Surfaces examined this iteration and what each would need bound.**

| New surface (not in iteration 4's table) | What it carries / would need | New rule earned? |
|---|---|---|
| The child-dispatch chain (`cli-opencode/SKILL.md:256-257`, `shared/references/child-dispatch-preamble.md`, `AGENTS.md:79`, `delegation-and-orchestration.md:101-106`) | Pre-resolving gates a non-interactive worker cannot answer. Already complete at three layers plus an env-var contract | No |
| The sk-git hook/policy stack (`SKILL.md:299-305`, `references/remote-branch-policy.md`, `remote-branch-allowlist.txt`) | Push permission, commit identity, worktree ask-first. Enforced by hooks and owned by sk-git; the AGENTS.md §5 table carries the agent-side duty | No |
| The goal hook (`.opencode/hooks/goal/`) | Goal binding and slice resend. `AGENTS.md:292-298` owns posture, the hook owns mechanics | No |
| The authoring assets (`repo-rule-template.md`, `repo-rules-router-template.md`, playbook `rule-authoring/`) | Authoring guidance. Owner is the packet; the observed defect is stale counts (Q2.3), not a missing constraint | No |
| Spec-kit location machinery (`quick-reference.md:231-262`, `folder-routing.md`) | Update/phase/create decisions. Owned and already pointed at from `AGENTS.md:76` | No |

**1.2 The refusals this iteration ran** (full rows in REFUSALS): C1 read-only dispatch gate-resolution duty, C2 concurrent-session discipline, C3 a verification-command registry, C4 authoring-asset count maintenance. Each maps to a deciding test and a destination.

**1.3 One candidate dissolved under verification rather than refusal.** The worry that `delegation-and-orchestration.md` §2 point 5 ("Setting the environment variable that waives a gate is not enough... Put the answer in the prompt", `:104-106`) leaves the dispatch-time duty unreachable on read-only turns is wrong: `AGENTS.md` §10 Dispatch Rules (`:493`) is always-loaded and mandates reading `cli-external-orchestration/cli-X/SKILL.md` before composing any prompt, and those skills carry the duty explicitly (`cli-opencode/SKILL.md:256`: "Set `AI_SESSION_CHILD=1` in the dispatched session's env AND state the exemption in the prompt. The variable makes the waiver true; it does not make it observable."). The chain is verified end-to-end under Q3.3.

---

## Q2. Which existing rules need changing, and why?

### 2.1 `blast-radius.md` §2's tier-3 exemption set disagrees with its own §3 and with the live policy (new)

`blast-radius.md:63` places in the Irreversible tier: "**any push to a remote branch that is not release or reserved**". The same file's §3 says the opposite term for the same set: "A push to a non-allowlisted remote branch is tier 3 for exactly this reason: it needs a fresh, in-the-moment yes, and a yes for an earlier push is not one" (`:93-96`). The authoritative policy defines the allowlist as `main` (hardcoded), `skilled/v*` release branches (hardcoded), plus any glob in `remote-branch-allowlist.txt` (`sk-git/SKILL.md:301`; `references/remote-branch-policy.md:38-44`; `scripts/remote-branch-allowlist.txt:3-11`), and says adding a branch "no code or hook change needed" (`remote-branch-policy.md:44`). An operator extending the allowlist file, or a reader classifying a push of `main`, gets two different tier-3 answers from one file. The observed failure is textual but load-bearing: `AGENTS.md:333` already uses the allowlist term ("plus anything sk-git's allowlist permits"), so `blast-radius.md:63` is the outlier against both its own §3 and the always-loaded document it expands. Fix is a term alignment, not a new constraint.

### 2.2 `AGENTS.md:182` promises a `REPO RULES.md` capability that no surface implements (new)

`AGENTS.md:182`: "What `REPO RULES.md` carries is repo-local: thinking and acting discipline, restraint, scope, evidence, blast radius, diagnosis, honesty, **alongside verification commands and local contracts**". Every other surface disagrees:

- `REPO RULES.md:77-79` §4 In: "...how the posture to hold when work is handed to another runtime, how the resulting reply reads, what you may claim about wiring you have changed, and how a turn hands control back to the operator." No verification commands.
- `decision-tests.md:59-61` In: "how to think and act: restraint, scope, evidence, risk, diagnosis, honesty, the posture when work is handed to another runtime, and how the resulting reply reads." No verification commands.
- The router template has no slot for them. Its four sections are HOW TO USE / TRIGGER TABLE / INDEX / SCOPE (`repo-rules-router-template.md:45-89`), and §3 states the doctrine: "**It holds no rules.** The moment a router explains *how* to do something rather than *where to look*, it has become a rule file" (`:97-99`).
- The same doctrine is on record as a live refusal: `specs/sk-git/028-crawlable-commit-history/002-format-decision/decision-record.md:452` ("`REPO RULES.md` section 4 keeps mechanics out of rule files on purpose: which command, which flag and which hook belong to the skills") and `:481` ("the router's own scope statement says mechanics stay in skills").

The shipped router, the template, the scope boundary, and the doctrine all exclude the thing `AGENTS.md:182` says the router carries. This needs wording reconciliation (or an explicitly invented slot, which the doctrine currently forbids); since it is an `AGENTS.md` edit beyond a pointer, it escalates per `agents-md-integration.md:120-127`.

### 2.3 The stale-count class now reaches the authoring assets themselves (new surface, extends iterations 1 and 3)

Iterations 1 and 3 inventoried the drift in the four references, the packet README, one playbook file, one changelog, and `retrieval-conventions.md:283`. The blanks every new rule is authored from carry it too, and one of them is loaded on the create path (`SKILL.md:64`, `:89`):

- `assets/repo-rule-template.md:86-87`: "Three of the eight shipped rules have it" (the `WHAT THIS RULE IS NOT` guard; five of 11 carry one, per iteration 1).
- `assets/repo-rule-template.md:104`: "Ten elements are universal across all nine shipped rules"; `:109`: "One key order across all nine"; `:110-118` carry `9/9` rows.
- `assets/repo-rule-template.md:129-131`: "The corpus carries four inter-rule links across eight files." (Iteration 1 measured 14 links across 5 files from the corpus itself.)
- `manual-testing-playbook/rule-authoring/full-rule-authoring.md:74`: "That invariant holds in all nine shipped files with no exception."
- `references/rule-anatomy.md:155`: "Measured: 161 phrases across 9 files" (same claim as `creation-standards.md:74`, covered in iteration 1; this is an additional location).

### 2.4 The 11 rule files' doctrine: no further change justified

Re-verified this run: the subordination line is verbatim in 11 of 11 files (`rule-anatomy.md:54` requires it), every `AGENTS.md §N` citation inside the rule files resolves (spot-checked communication §8, handoff §3/§2/§10, presenting §2/§3/§7, prevent §3, scope §1/§3, delegation Dispatch Rules, uncertainty §2), and every rule-file mechanism claim I could test against its owning surface held: delegation §2.2's containment description matches `deep-research/references/protocol/loop-protocol.md:290` ("Write containment attributes every new dirty path outside the lineage directory to the lineage... reverted from HEAD and fails that lineage"), and skill-hub-routing §3's default-hub warning matches the implementation (`parent-skill-check.cjs:100` = `DEFAULT_TARGET = '.opencode/skills/system-deep-loop'`; `:246-249` prints a NOTE that the result "describes THAT hub only").

---

## Q3. Where is cross-skill or cross-system integration missing or broken?

### 3.1 NEW: the delegation rule's router row misses the firing moment the rule itself records as widened

- The rule fires, first item: "About to **decide whether** to hand work to another runtime at all, the cost question comes before the briefing question, and **this file used to fire only after it**" (`delegation-and-orchestration.md:37-38`).
- The router row is: "Hand work to another runtime: a CLI executor, sub-agent, fan-out lineage, or deep loop · compose the prompt one will act on · accept or quote what one returned · answer a judgment question from your own reading alone" (`REPO RULES.md:43`). It covers fires 2 through 5 and not fire 1; the row's shape is the pre-widening trigger the rule says it outgrew.
- The wiring contract makes this a defect, not a taste question: "**If the change alters when the rule fires, change the trigger row in the same edit.** Otherwise the router now lies about the rule, and it lies silently" (`agents-md-integration.md:87-88`).
- The packet's own verification cannot catch it: its recipe checks counts and link resolution (`create-repo-rule-auto.yaml:200-204` per iteration 4; packet `README.md:178`), never row-versus-fires semantics. Whether the row historically lagged the edit cannot be established without git history from this run; the structural mismatch `fires ⊄ row` stands on the current files alone.

### 3.2 NEW: the Doctor row in `AGENTS.md` §10 is malformed at the byte level

`AGENTS.md:474` contains `` `\`/doctor:mcp install\                                                | debug\`; \`/doctor:update\`` ``: the backslash precedes whitespace rather than the pipe, so the raw `|` splits the markdown cell and the row renders with shifted columns. The intended content is confirmed by the commands front door: "MCP Debug | `/doctor:mcp debug [--fix] [--server <name>]`" and "MCP Install | `/doctor:mcp install [--server <name>] [--runtime <name>]`" (`commands/README.txt:162-163`). This is a rendering defect in the always-loaded document, and it survives every existing checker for the same reason iteration 4 documented (the corpus and root `AGENTS.md` sit outside the link walk).

### 3.3 Verified-clean additions this run (so the broken list is meaningful)

- **The child-dispatch chain resolves end to end.** `AGENTS.md:79` states the child-side exemption; `delegation-and-orchestration.md:101-106` states the orchestrator-side duty; `cli-opencode/SKILL.md:256-257` binds both the env var and the prompt text; `shared/references/child-dispatch-preamble.md:25-31` explains why one without the other fails silently, `:46-62` carries the block, `:95-101` the self-check. The cli-cursor (`:310`) and cli-codex (`:282`) siblings carry the same step (grep-verified), and `deep-research/references/protocol/loop-protocol.md:275-290` documents the containment reality the orchestrator side protects against. No gap.
- **`handoff-and-questions.md:162-164`'s claim about `sk-communication` is true.** "That skill is deliberately held off advisor routing, so this rule is the only thing that reaches it" matches the committed exclusion: `route-exclusions.json:2` = `"excludedSkillIds": ["sk-communication"]`, with tests pinning it (`mcp-server/tests/route-exclusions.vitest.ts:55-57`).
- **The agent mirror trees carry the delegation pointer identically:** `.opencode/agents/orchestrate.md:847`, `.claude/agents/orchestrate.md:836`, `.codex/agents/orchestrate.toml:840`, `.pi/agents/orchestrate.md:840`. Mirror drift is not present for this resource line.
- **`AGENTS.md:112`'s metadata summary matches its contract.** Required at both roots: `graph-metadata.json |required|required|` (`skill-root-metadata-contract.md:64`); hub-only: `description.json` `:65`, `mode-registry.json` `:66`, `hub-router.json` `:67`; nested identity rejected (`:127`); spec-versus-skill schema warning (`:32`). The receiver loads during skill authoring (`sk-create-skill/SKILL.md:111` resource map; steps `:243`, `:273`, `:327`), and the fleet gate is named in the contract (`:112`, `:121`).
- **A missing `goal.md` is a defined state, not a defect.** The hook's suite pins it: "a bound record whose goal.md is gone injects nothing and does not fall back" (`goal-core.test.cjs:788-793`), binding refuses a packet without a goal document (`:795`; `bin/goal.cjs:210` errors `PACKET_GOAL_NOT_FOUND`), and `AGENTS.md:296` already says "Work never stops because a goal is unset." The 010 packet carrying no `goal.md` is therefore compliant behavior, not a gap.
- **The prior git-rule refusal is on record with its reasoning**, which strengthens the carried git/PR refusal rather than reopening it: `decision-record.md:452-481` scores "New `repo-rules/git-discipline.md`" at 4/10 against 8/10 for tightening the existing rule, and explains that "mechanics stay in skills" (`:481`).

### 3.4 Insufficiencies carried, not re-verified

Whether every mirror runtime loads the root `AGENTS.md` natively remains as iteration 3 left it for Codex and Cursor. The trigger-phrase collision sweep (iteration 1) was not re-run because no phrase changed.

---

## Q4. Which parts of AGENTS.md can be cut, compressed, or relocated?

Evaluations here extend iteration 4's table; that table already covered Comment Hygiene `:44-46`, Halt Conditions `:48-55`, the Gate 3 option list `:65-79`, Gate 4 `:116-119`, the Skill Routing intro `:110`, MEMORY SAVE/GOAL POSTURE `:284-298`, the §9 paragraph `:440`, the Execution Behavior and Blast-Radius bullets `:159-197`, and the completion/freshness items `:264-274`. These are the sections and rows it did not cover.

| Section | Verdict | Owner and load timing |
|---|---|---|
| §10 Quick Reference, Doctor row `:474` | **Repair** (defect, cross-ref 3.2) | Content owner: `commands/README.txt:161-164` carries the complete Doctor index, but it does not auto-load; the row is a discovery surface, so repair in place rather than delete. Anything here beyond removing a pointer escalates (`agents-md-integration.md:120-127`). |
| §2 Skill Routing Reference, `:112` (Advisor metadata placement) | **Compress** (conditional) | The required/forbidden matrix is duplicated in `skill-root-metadata-contract.md:64-67`, mechanically enforced (contract `:112`, `:121`; `sk-create-skill/SKILL.md:243`), and the contract is in the receiving skill's resource map (`:111`), so the write-time duty loads via the artifact trigger (`AGENTS.md:104`). Keep the binding sentence and the read-turn disambiguation clause ("These filenames also name spec-folder continuity metadata... never interchangeable"); the exemplar list can drop to the pointer. |
| §2 Skill Routing Reference, `:114` (two-stage routing) | **Partial compress, low priority** | The binding sentence ("Never report a mode as routed because a registry entry exists") must stay: reporting happens on read-only turns, where no rule file loads (the same test-1 logic iteration 3 applied to R4). The "Most nested modes carry..." mechanism sentence duplicates `parent-skills-nested-packets.md` §1-2 (`:21`, `:98`) and `skill-hub-routing.md` §1. Named risk: a read-only auditor would have to open the named reference, which is one Read away but not auto-loaded. |
| §5 Git Workspace Safety table `:326-335` | **Keep** (no cut found) | Every row's bind moment either precedes the first write (ask-first: `sk-git/SKILL.md:285` "ASK before proceeding, WAIT for explicit selection (A/B), NEVER assume"), can occur on a no-write turn (push asks: `remote-branch-policy.md:50` "every push, not just the one that creates the branch"), or is already pointer-shaped ("sk-git owns..." at `:329`, `:332`, `:335`). The commit-identity row was deliberately added as a pointer (028 `decision-record.md:465`). The table is the read-turn carrier for a policy whose route is soft (Gate 2) and whose hooks are post-hoc. |
| §6 child-packet sentence `:381` | **Keep** (merge option named, low priority) | Its substance survives only as a preference inside `quick-reference.md:260` ("prefer Option D and add the next sequential child phase instead of creating a new top-level sibling packet"), which loads only when the Gate 3 criteria pointer at `AGENTS.md:76` is followed. The directive form appears nowhere else in the live tree (grep: only `AGENTS.md:381`; remaining hits are `.git/lost-found` objects). Cost is two lines against an unenforced, location-level error; folding it into `:76` is possible but buys little. |
| §5 MCP Tool Routing `:355-363` | **Keep** | Binds on MCP tool calls, including read-only ones (iteration 3 refused a rule on exactly this test). The MCP skills carry adjacent duties (`mcp-code-mode/SKILL.md:378` "Assume tool availability - Verify with `list_tools()` first"; `mcp-tooling/references/tool-catalog.md:78`) but neither carries the "never promise that a manual named in the config is live" clause, which is what stops a read-turn overclaim. |
| §10 Operational Mandates `:476-502` | **Keep** | Rows are already one-liners or pointers. The data-not-instructions clause (`:502`) binds when reading pasted content, the dispatch rule (`:493`) binds at dispatch, including read-only dispatches, and the honesty rows bind during analysis replies. Nothing here can wait for a trigger. |

---

## RANKED RECOMMENDATIONS

One ordered list across Q1-Q4. Items 1-6 are corrections inside existing owners; none is a new rule.

1. **Repair the malformed Doctor row.** Evidence: `AGENTS.md:474` raw cell with the misplaced backslash and unmasked pipe; intended commands at `commands/README.txt:162-163`. Files: `AGENTS.md:474` only. Escalates as a non-pointer AGENTS.md edit (`agents-md-integration.md:120-127`). Decision tests: a defect repair, refused as a rule (C3-adjacent; test 3 part 1).
2. **Add the decision moment to the delegation trigger row.** Evidence: `delegation-and-orchestration.md:37-38` versus `REPO RULES.md:43`; standard at `agents-md-integration.md:87-88`. Files: `REPO RULES.md` §2 only (counts unchanged, so no index edit). Decision tests: refused as a new rule (R-class, existing home), so the fix lands in the owner.
3. **Align `blast-radius.md:63`'s tier-3 exemption term with `:96` and the live allowlist.** Evidence: `blast-radius.md:63` versus `:93-96`; `sk-git/SKILL.md:301`; `remote-branch-policy.md:38-44`; `remote-branch-allowlist.txt:3-11`. Files: `repo-rules/blast-radius.md` (one clause); version bump per `agents-md-integration.md:89-94`. Decision tests: correctness repair, not a rule.
4. **Reconcile `AGENTS.md:182`'s "verification commands and local contracts" with the router system.** Evidence: the In-lists (`REPO RULES.md:77-79`, `decision-tests.md:59-61`), the template's doctrine (`repo-rules-router-template.md:97-99`), and the recorded prior refusal (`decision-record.md:452`, `:481`). Files: `AGENTS.md:182` (operator escalation) or a deliberate slot definition in the template and references. Decision tests: refused as a rule (C3, test 3 part 4).
5. **Refresh the authoring assets' corpus counts.** Evidence: `repo-rule-template.md:86-87`, `:104`, `:109-118`, `:129-131`; `full-rule-authoring.md:74`; `rule-anatomy.md:155`. Files: those three plus any list iteration 1/3 left; owner `sk-create-repo-rule`. Decision tests: refused as a rule (C4, test 3 part 2 and test 4).
6. **Compress `AGENTS.md:112`, and trim `:114`'s mechanism sentence.** Evidence and conditions in Q4's table (contract duplication and load path verified). Files: `AGENTS.md` §2 (operator escalation). Decision tests: refused as relocation into the rule set (test 1 for the disambiguation clause), so the change stays an in-document compression.
7. **Record refusals C1-C4 and the 028-carried git-rule evidence** so the same candidates are not re-proposed (`decision-tests.md:136-138`, `agents-md-integration.md:107-108`).

---

## REFUSALS

Every proposal considered and declined this iteration, with the deciding test and where the content belongs instead (`decision-tests.md:128-134`).

| # | Proposal | Test failed | Where the content belongs |
|---|---|---|---|
| C1 | A rule carrying the dispatch-time gate-resolution duty (pre-resolve what a child will read) | Test 1: the duty binds at dispatch, which happens on read-only turns and cannot wait for Gate 5 | Already carried: `AGENTS.md` §10 Dispatch Rules (`:493`) routes every dispatch through the cli-* skills, `cli-opencode/SKILL.md:256-257` states the env-plus-prompt duty, mechanics in `shared/references/child-dispatch-preamble.md` |
| C2 | Concurrent-session discipline ("another live session overwriting edits") | Test 3 part 2 (existing homes) plus restraint: no named present-day failure, and the mechanisms exist (`AGENTS.md:326-335`, `delegation-and-orchestration.md:93-96`, `sk-git/SKILL.md:289` worktree-wrapper isolation). The playbook's `full-rule-authoring.md:48` uses this only as an illustrative admitted-request example, not as evidence of a live failure | `AGENTS.md` §5 rows plus sk-git's wrapper and reaper surfaces |
| C3 | A verification-command registry as a rule | Test 3 part 1 (a single structural item, not a trigger-shaped cluster) and part 4 (no anchor for a new rule); also restraint, since nothing fails today that a wording fix does not fix | Reconcile `AGENTS.md:182` with the router contract, per recommendation 4 |
| C4 | A rule requiring the authoring assets' counts to stay current | Test 3 part 2 (the assets should not carry counts at all) and test 4 (no failure a per-turn rule prevents) | Delete or refresh the counts in the assets; the playbook root's own doctrine is the precedent that catalogs "do not hand-maintain counts" (`manual-testing-playbook.md:32`, carried from iteration 3's R5) |
| C5 | A `repo-rules/git-discipline.md` (re-proposal) | Pre-refused as the adoption phase's git/PR class (`decision-tests.md:94-96`); re-refused with a recorded score on 2026-09-11 for this exact candidate, "New `repo-rules/git-discipline.md`" at 4/10 (`decision-record.md:477-481`) | `sk-git` for mechanics, `blast-radius.md` for force-push/history posture, `AGENTS.md` §5 for the agent-side rows |

Carried refusals, not re-run: the ten adoption refusals (`decision-tests.md:94-96`), iterations 1-3's R1-R9, iteration 4's R10-R12 and P4, and the recorded test-1 refusals of any read-only-binding content.
