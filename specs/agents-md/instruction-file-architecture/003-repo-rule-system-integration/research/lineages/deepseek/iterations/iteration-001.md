{"timestamp":"2026-09-11T18:32:45.514Z","runtime":"claude","status":"fail_open","freshness":"unavailable","durationMs":2510,"cacheHit":false,"errorCode":"NONZERO_EXIT","errorDetails":"CLI_RETRYABLE_UNAVAILABLE exit 75: socket_absent"}
# Iteration 1 Findings

Ground truth re-verified before asserting: AGENTS.md is **502 lines** (read tool reports "Showing lines 1-488 of 502", tail read through 502). CLAUDE.md opens as the same document (identical first line, same 502-line span). `repo-rules/` holds **11 rule files**. REPO RULES.md carries 11 trigger rows (lines 40-50) and 11 index rows (lines 58-68), so the three-way parity the mode requires (agents-md-integration.md:73-74) currently holds. Every line number below was re-checked in this session.

---

## Q1. Which new rules do the skills and other system surfaces actually justify?

**Verdict: zero new rules. Every candidate I could derive from the current surfaces fails at least one of the four decision tests, and most fail test 2 (scope boundary) or the four-part refusal test's "has an existing home" clause.**

The refusal is the designed outcome, not a null result. sk-create-repo-rule/SKILL.md:16-18: "**Most requests should not become a rule.** The four decision tests in `references/decision-tests.md` refuse more than they admit, and running them first is the cheap order." decision-tests.md:116-120 records that a prior research pass "returned zero new rule files across five iterations, and its single most valuable output was a **subtraction**", and closes with "**A review of a rule set that only adds has not reviewed it.**"

Two structural facts decided several candidates before any drafting:
- The Gate 5 read-only constraint. AGENTS.md:122: "Trigger: the FIRST write of the session, in any repository whose root holds a `REPO RULES.md`. Read-only turns never fire it". decision-tests.md:32-33 states the consequence: "**A rule file loads on a trigger. Content that must bind when no trigger has fired cannot live in one.**" Any candidate whose content must bind while reading was refused on test 1.
- The pre-refused class. decision-tests.md:94-96: "the adoption phase used exactly this to refuse ten candidates — gate-discipline, git/PR, communication-format, testing, security, memory, spec-folder, skill-routing, delegation-mechanics, and collaboration."

Surfaces surveyed (directory listings this session): the skills fleet under `.opencode/skills` (cli-external-orchestration, mcp-code-mode, mcp-tooling, sk-code, sk-communication, sk-design, sk-doc, sk-git, sk-prompt, sk-vision, system-deep-loop, system-skill-advisor, system-spec-kit), the commands tree (`agent-router.md`, `goal-opencode.md`, `vision.md`, plus `create/`, `deep/`, `design/`, `doctor/`, `prompt/`, `rewrite/`, `speckit/`, `scripts/`), the git and platform hooks, the MCP configs (`opencode.json`, `.mcp.json`, `.utcp_config.json`), the six runtime trees (`.claude`, `.codex`, `.cursor`, `.devin`, `.pi`, `.opencode`) and the Pi plugin inventory (`.pi/PLUGINS.md`).

Surface-by-surface, with the candidate each would generate and its disposition:

| Surface | What it would need bound | Candidate | Outcome and deciding test |
|---|---|---|---|
| sk-code hub, its four surface packets, sk-code-quality, sk-code-review | Code quality, comment hygiene | C1, a comment-hygiene expansion | Refused. Four-part test 2: home exists at three layers. `.opencode/scripts/git-hooks/pre-commit:40-42` runs a "Comment hygiene gate (blocking)" whose checker is `sk-code/sk-code-quality/scripts/check-comment-hygiene.sh` (pre-commit:44), whose standard is `sk-code/shared/references/universal/code-style-guide.md` §4 (pre-commit:43), and which sk-code-quality/SKILL.md:183 invokes per modified file. AGENTS.md:44-46 already carries the hard block. Test 4 also fails: the gate blocks today, so no named failure exists |
| sk-git | Workspace choice, push policy, branch naming, commit identity | C2, a git workflow rule | Refused. Pre-refused class ("git/PR", decision-tests.md:94-96). Four-part test 2: home exists in sk-git/SKILL.md ("MANDATORY" ask-first at :276-285, "MANDATORY" push policy at :299), plus AGENTS.md:326-335 and the enforcement hooks |
| system-spec-kit | Spec levels, validation, save, goal, retrieval | C3 spec-folder mechanics, C4 memory save, C5 retrieval discipline | Refused. Pre-refused classes (spec-folder, memory) plus scope Out. REPO RULES.md:85-89: "**Out:** skill routing, workflow selection, spec-folder mechanics...". Homes already live at validation-rules.md, save-workflow.md, retrieval-conventions.md |
| system-deep-loop | Iteration, convergence and state discipline | C6, a deep-loop rule | Refused. Test 2: workflow mechanics are Out. Home is AGENTS.md:117 (Gate 4) plus the mode packets' own SKILL.md invariants, which AGENTS.md:117 names as "the `/deep:research` and `/deep:review` mode-packet SKILL.md invariants" |
| cli-external-orchestration hub, six cli-X modes | Executor contract reading, briefing mechanics | C7, an executor-dispatch rule | Refused. Test 2 Out ("the *mechanics* of agent and CLI dispatch", REPO RULES.md:85-89). Home is AGENTS.md:493 plus each `cli-X/SKILL.md` plus delegation-and-orchestration.md §2 |
| mcp-code-mode, mcp-tooling | Tool discovery, naming, availability claims | C8, a tool-routing rule | Refused. Four-part test 2: home exists at AGENTS.md:355-363 plus `mcp-code-mode/references/naming-convention.md` (file exists, verified by find) |
| system-skill-advisor | Routing decisions | C9 | Refused. Pre-refused ("skill-routing"). The advisor's own regression corpus and benchmark assets own its behavior |
| sk-doc hub, including sk-create-repo-rule itself | Rule-system maintenance invariants | C10, a router-parity rule | Refused. Test 1: parity matters only while editing the rule system, never on a no-trigger turn. Four-part test 2: home is agents-md-integration.md:73-74, README.md:178 (the awk parity check) and the playbook scenarios RRL-001..003 |
| sk-communication, sk-prompt, sk-vision, sk-design | Delivery capability | none beyond existing rules | The one-time "communication-format" refusal was superseded by a deliberate operator move, documented at decision-tests.md:48-51: "the communication rule moved almost entirely out of `AGENTS.md` §8 anyway, on an operator decision" |
| Commands (`speckit/`, `deep/`, `doctor/`, `create/`, `prompt/`, `rewrite/`, `goal`, `agent-router`, `vision`) | Workflow selection and command mechanics | any candidate | Refused by test 2 without exception |
| Hooks (goal hook, git advisory, git enforcement, advisor hook) | Execution mechanics | any candidate | Refused by test 2 |
| Runtimes and plugins (`.pi` etc.) | Ask-surface, runtime quirks | C11 ask-surface, C12 runtime-quirk rule | C11 already admitted, as a widening not a file: REPO RULES.md:98-109, "The ask-surface carve-out, added as the fourth widening". C12 refused by four-part test 4 (no AGENTS.md anchor) and test 3 |
| MCP configs | Roster mechanics | any candidate | Refused. Home is AGENTS.md:355-363, which already says "Read the config for the current roster" |

**Result: zero admitted. The per-candidate refusals with tests are in REFUSALS below.**

---

## Q2. Which existing rules need changing, and why?

**Verdict: none of the 11 rule files shows an observed failure against the surfaces it claims to govern. Every cross-reference out of the rule files resolves. The changes cluster in the sk-create-repo-rule reference set, whose measured claims are falsified against the live corpus; the observed failure is a statement that is now false.**

### 2.1 rule-anatomy.md is falsified in three places (highest priority)

- **Internal contradiction plus stale corpus count.** :17-19: "Derived from the eight files under `repo-rules/` plus the router... every MUST element was found in 8 of 8 rules". :3 (description) says "derived mechanically from the nine shipped files". :47 says "Every one of these is 9/9". `repo-rules/` now holds **11** files.
- **Length table is stale and incomplete.** :94-108 lists 9 files. `handoff-and-questions.md` and `presenting-decisions.md` are absent (both now exist; sizes 165 and 156 lines by read count). Three listed numbers no longer hold: `communication.md` is 193 lines now (last read line 193) against the table's 244, `delegation-and-orchestration.md` is 250 against 248, `prevent-overengineering.md` is 163 against 162. The summary sentence "Four preferred, two good, three at the limit, none over" (:108) no longer describes the set. The bands themselves (:87-92: "Preferred ≤ 160... **Over** > 250 | Split it, or cut it") are intact and checkable.
- **Cross-reference measurement is wrong and mutually contradicted.** :122: "The corpus carries **10 cross-reference links in total, 7 distinct pairs**, across 9 files, and only 3 files carry any." My grep of `](` across `repo-rules/` shows **14 in-set markdown links, 10 distinct unordered pairs, across 5 files** (handoff-and-questions 2, skill-hub-routing 1, presenting-decisions 2, delegation-and-orchestration 5, communication 4). The sibling file says something different again, see 2.2.
- **Dangling provenance reference.** :17-18: "parsed structurally by `scratch/inventory.py`". The only file matching is `specs/sk-doc/040-create-repo-rules/002-inventory-and-skill-contract/scratch/inventory.py`. Nothing named `scratch/inventory.py` resolves from the reference's location or from the repository root.

**Why a change:** the document's own premise is "every count is measured, not recalled" (:19). It is the instrument a future rule author runs to place a new rule, and it now mis-measures the corpus it claims to describe.

### 2.2 creation-standards.md carries the same class of falsified claims

- :3 and :26-27 say "all nine shipped rules" and "the nine shipped rules... all nine". Corpus is 11.
- :115: "Three of eight carry a `WHAT THIS RULE IS NOT` section". Five of 11 carry it now: prevent-overengineering.md §5 (:145), communication.md §8 (:171), delegation-and-orchestration.md §8 (:222), presenting-decisions.md §6 (:136), handoff-and-questions.md §6 (:144).
- :74: "The set carries 161 phrases with zero collisions". Current inventory: **194 trigger phrases across 11 files** (grep sum: 17+17+16+17+16+17+18+20+18+18+20). No exact duplicate phrase appears in the extracted inventory, so the constraint holds while the number does not.
- :138-139: "The corpus carries four sideways links across eight files." Reality is 14 links across 5 files. This directly contradicts rule-anatomy.md:122's "10 links... 3 files", so the two references disagree with each other and both disagree with the corpus.

### 2.3 The router scope widening count is stale in two references (a live contradiction)

- decision-tests.md:72-74: "**Recovered from:** the router's own section 4, which has been widened exactly three times and every time deliberately — to admit delegation posture, then delivery, then a narrow routing carve-out." :75-76: "A fourth widening that admitted selection would dissolve the boundary the set exists to hold."
- agents-md-integration.md:55-60: "All three were caught and the boundary was widened deliberately each time, the third being the narrow routing carve-out... **A fourth widening that admitted selection itself would dissolve the boundary the set exists to hold**".
- REPO RULES.md contradicts the count. :91: "**The routing carve-out, added deliberately as the third widening.**" :98: "**The ask-surface carve-out, added as the fourth widening, on an operator decision that overrode a research refusal.**"

**Why a change:** a fourth widening exists and is recorded in the live router. The references' doctrine about *selection* is not falsified (the fourth widening admits the ask-surface, not selection), but their description of the current state ("widened exactly three times", "All three were caught") is. A future author reading them mis-counts the boundary they are supposed to check against (§2 of agents-md-integration.md instructs exactly that check).

### 2.4 agents-md-integration.md §4 version claims are falsified

:92-94: "all nine shipped rules sit at `1.0.0.0`... Use the fourth segment for any content change and leave the first three alone until something forces the question." Two rules diverged: handoff-and-questions.md:25 is `1.1.0.0` (second segment bumped), delegation-and-orchestration.md:27 is `1.0.0.2` (fourth segment, per guidance). Stale count, and the corpus no longer follows the one convention offered.

### 2.5 No rule-file change is justified

I read each of the 11 rule files against the surfaces they claim to govern and checked every external target they name. All resolve: `code-quality-standards.md` §1 rungs (:42-47), `hvr-rules.md`, `parent-skills-nested-packets.md` §7 (:212) and its routingClass table (:112-114), `parent-skill-check.cjs`, `.pi/PLUGINS.md:16` (rpiv-ask-user-question), `agent-router.md:198/:342/:442` (AskUserQuestion), `rewrite/response.md` and `rewrite/explain-visually.md`, the save writer `runtime/cli/dist/continuity/generate-context.js` (present in `dist/continuity/`). A rule-file edit without an observed governing failure would violate the brief's own standard, so I propose none.

---

## Q3. Where is cross-skill or cross-system integration missing or broken?

### The clean side (verified, so the broken list is meaningful)

- All **34 repo-rules links in AGENTS.md** across 25 lines resolve to existing files. Per-rule pointer counts run 2-4, so agents-md-integration.md:39-41's "Pointer counts run 2-4 per rule" and "two-pointer minimum" hold (skill-hub-routing: :114 and :234; delegation: :419 and :489; evidence, root-cause and uncertainty carry 4 each).
- All **14 in-set cross-links** between rule files resolve, and all **11 routed-from back-links** to `../REPO%20RULES.md` resolve.
- AGENTS.md's external targets resolve: `gate-3-classifier.ts`, `lookup-trigger-index.mjs`, `skill-advisor-hook.md`, `code-quality-standards.md`, `skill-root-metadata-contract.md`, `parent-skills-nested-packets.md`, `retrieval-conventions.md`, `validate.sh`, `recommend-level.sh`, `folder-structure.md`, `folder-routing.md`, `phase-definitions.md`, `agent-io-contract.md`, `save-workflow.md`, `generate-context.js`, `sk-code/SKILL.md` §2 SMART ROUTING (:50), and system-spec-kit/SKILL.md's "Distributed Governance Rule" (:59).

### B1. A reference that does not resolve

rule-anatomy.md:18 names `scratch/inventory.py`. The file exists only at `specs/sk-doc/040-create-repo-rules/002-inventory-and-skill-contract/scratch/inventory.py`, a spec-packet scratch path. A reader of the reference cannot resolve it, and `.gitignore`-based discovery returns nothing for the bare name.

### B2. A contradiction between the live router and its own references

Covered in Q2.3. decision-tests.md:72-76 and agents-md-integration.md:55-60 say the scope statement was widened "exactly three times" and treat a fourth as hypothetical. REPO RULES.md:98 records the fourth widening as done. Precedence resolves the disagreement in the router's favor (REPO RULES.md:24-32, level 3 files sit below the AGENTS.md doctrine the router expands, and the router is the artifact the references teach you to check), so the references are the stale side.

### B3. Two references measure the same corpus differently and both are wrong

rule-anatomy.md:122 (10 links / 7 pairs / 3 files carry) vs creation-standards.md:138-139 (4 links / 8 files). Measured now: 14 links / 10 pairs / 5 files. Any future rule author running either standard gets a different story from each, and neither story matches the corpus.

### B4. A bare reference inside AGENTS.md

AGENTS.md:114 ends "Surface list and the class table: `parent-skills-nested-packets.md`" with no path. The file exists at `.opencode/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md`, and the full link is carried by the rule at skill-hub-routing.md:68. So it resolves through the rule, not from AGENTS.md alone. Minor, but it is the one AGENTS.md reference that cannot be resolved from the document that carries it.

### B5. Reply-time load asymmetry (gap, no failure observed)

AGENTS.md:405 commands the load for communication ("Load it before answering"), while :407 and :409 only say "is governed by". On a read-only turn Gate 5 is silent (AGENTS.md:122), so presenting-decisions and handoff-and-questions can only bind through their §8 sentences at that moment. I found no observed failure from this asymmetry, so I do not recommend a change on this evidence alone.

### B6. The router parity invariant has no automated gate (observation)

agents-md-integration.md:73-74 requires "trigger rows, index rows and rule files are all the same count". The only checker is the documented awk one-liner at sk-create-repo-rule/README.md:178 plus the create command's checklist (`commands/create/assets/create-repo-rule-confirm.yaml:220`). A grep of `.github` finds no repo-rules reference, so no CI gate exists. Parity currently holds (11/11/11); the invariant is enforced by procedure only.

### Evidence limits

- agents-md-integration.md:39-41's "across 18 sections" could not be verified against a defined section count. I verified only the load-bearing part, the 2-4 pointer range.
- sk-git's preflight advisory (sk-git/SKILL.md:309-321) is documented as reaching every visible git command, but I did not exercise it in this read-only pass.

---

## Q4. Which parts of AGENTS.md can be cut, compressed, or relocated?

**Verdict: three relocation or compression candidates, all with owners that load at the moment the content binds. Everything else survives the always-loaded test, several by explicit design.**

Size context: AGENTS.md is 502 lines. The candidates below remove roughly a dozen lines of mechanics-grade prose, not full sections. That small yield is itself a finding: the document has already been through the compression described in the brief's "already done" list.

| Section | Binds when no trigger fires? | Verdict |
|---|---|---|
| §1 Critical Rules (:17-56) | Yes, every write | Keep. Four Laws, PLAN-WORKFLOW LOCK, Comment Hygiene, Halt Conditions are hard blockers |
| §2 Gates (:59-136) | Yes, at tool-use time | Keep. Violation Recovery relocation was already refused by the adoption phase, decision-tests.md:43-46: "the adoption phase applied it to refuse relocating Violation Recovery, whose trigger fires exactly when the trigger-loaded path may already be broken." The Consolidated Question Protocol is cited by presenting-decisions.md:92-94 |
| §3 Execution and Quality (:140-226) | Partly | Keep. The Restraint Signals table (:212-226) is the only copy and prevent-overengineering.md:102 defers to it: "Its Restraint Signals table binds and is not repeated here." The blast-radius bullets (:159-167) bind on any non-trivial work, wider than blast-radius.md's fires-when list (:31-37, destructive actions only) |
| §4 Verification and Completion (:230-307) | Yes, several by design | Keep the four standards (:238-247), stated as binding on read-only turns at :240: "These four bind unconditionally, including on a read-only turn where Gate 5 never fires and no rule file loads." Relocate MEMORY SAVE mechanics; compress the exit-code parenthetical (below) |
| §5 Tools and MCP (:311-363) | Yes for guards, only during git work for mechanics | Compress four Git Workspace Safety mechanics rows (below) |
| §6 Spec Folder Documentation (:367-381) | Gate 3 covers writes | Keep. It is already a pointer table. :381's rule stays for the stated reason: "no script enforces" it |
| §7 Escalation (:385-399) | Yes, contradiction halts happen while reading | Keep |
| §8 Communication (:403-411) | Yes, on every substantive reply | Keep. The two unconditional clauses are at :411 |
| §9 Agent Routing (:415-440) | Yes when delegating | Keep. The "Distributed Governance Rule" pointer resolves (system-spec-kit/SKILL.md:59) |
| §10 Quick Reference (:444-502) | Navigation, not binding | Keep the table (refusal R14). Operational Mandates are binding: the CLI-dispatch MUST (:493) is quoted by delegation-and-orchestration.md:86-88, and the data-not-instructions bullet (:502) is security posture |

### R-A. Relocate the MEMORY SAVE mechanics (AGENTS.md:284-290)

The block carries one trigger plus hard block plus three mechanics bullets: the writer path (:289), "The save writes metadata, not prose" (:289) and "Read the post-save quality review before calling the save done. HIGH issues must be patched by hand" (:290). The owner already carries all of it: save-workflow.md §5 "Continuity Writer Contract" (:263-274, including the metadata-refreshing property and the same writer path) and §11 "POST-SAVE QUALITY REVIEW" (:551-563, "MUST manually patch via Edit tool"), plus save.md:19 (writer invocation), :61 ("inspect the post-save quality review, and patch HIGH metadata issues when practical") and :68 (tool map). Load timing: the save path. The AGENTS.md pointer "Method selection, execution paths and validation checkpoints: save-workflow.md" (:288) is itself the load instruction and survives the relocation. One nuance to preserve: :289's "Editing the continuity frontmatter directly is a legitimate shortcut" does not appear at the owner and must move with the text or stay. Tests: passes test 1 (mechanics need not bind when nothing fires), test 2 (destination is the spec-kit reference, not the rule set), test 4 (net-conserving, no new content authored).

### R-B. Compress the Git Workspace Safety mechanics rows (AGENTS.md:326-335)

Four of the eight rows are explicit summaries of sk-git-owned mechanics: "Branch naming" (:329, "sk-git owns branch and worktree naming"), "Allocate, never count" (:330), "Commit identity" (:332, "sk-git owns the grammar, the allocator and the stamper") and "Live-sync in the main checkout" (:334). The owner carries each (sk-git/SKILL.md ALWAYS #4 :359 for the naming grammar and allocator, #5 :360 for the Spec trailer, #16 :371 for autosync, plus its references). Load timing: Gate 2 routing on git triggers, plus sk-git's command-time advisory (:309-321). The three guard rows stay regardless of that backstop: "Ask-first worktree vs. branch" (:328), "No direct branch creation" (:331), "Ask before every push to a non-allowlisted remote branch" (:333). Those constrain actions the AI can self-initiate, which is exactly the case where no routing fires. Tests: passes test 1 for the four rows (they act only during git work), test 2 (destination is sk-git, not the rule set), test 4 (owner already carries the content). Caveat: the advisory's runtime delivery was not exercised in this pass, and the cut does not depend on it because the guard rows remain.

### R-C. Compress the exit-code parenthetical in the Completion Verification Rule (AGENTS.md:266)

:266 carries "(exit 0 = pass, including a run that reported warnings · 1 = user error... · 2 = validation error · 3 = system error)". validation-rules.md:44 carries the same taxonomy, and :761-763 states the ownership doctrine: "These are properties of the harness rather than of any one repository, and each has already certified a broken packet as green. They belong here because this document owns what a validation run means; a copy kept anywhere else goes stale the first time the harness moves." The four traps were already relocated there, and AGENTS.md:276-282 keeps only "**Require an explicit `RESULT: PASSED`**" plus the pointer. The exit taxonomy is the same class of mechanics. Constraint: the `RESULT: PASSED` requirement must not move, it is the pass criterion, not mechanics. Tests: passes test 1 (not needed when nothing fires), test 2 (destination is the spec-kit validation reference), test 4 (already duplicated there, so the move removes a copy rather than authoring).

---

## RANKED RECOMMENDATIONS

1. **Repair rule-anatomy.md's measurements.** Change: re-measure the corpus count, the length table (add the two missing files, correct the three stale numbers) and the cross-reference count, and fix or drop the `scratch/inventory.py` provenance reference. Evidence: Q2.1 items, all read or grep-verified this session. Files: `.opencode/skills/sk-doc/sk-create-repo-rule/references/rule-anatomy.md`. Tests: no new rule, so the four gates admit nothing or refuse nothing here. The change meets the Q2 observed-failure bar (multiple statements falsified against the live corpus) and repairs the instrument of tests 3 and 4 for every future rule.
2. **Reconcile the widening count in decision-tests.md and agents-md-integration.md with REPO RULES.md §4.** Change: bring both references to the fourth, ask-surface widening, keeping the unchanged selection boundary. Evidence: Q2.3, with the quoted contradiction. Files: `references/decision-tests.md`, `references/agents-md-integration.md`. Tests: not a rule proposal. Observed failure: both references currently mis-describe the scope statement they instruct authors to check.
3. **Repair creation-standards.md's measured claims.** Change: rule count, "Three of eight", "161 phrases", "four sideways links across eight files". Evidence: Q2.2, including the 194-phrase inventory. Files: `references/creation-standards.md`. Tests: as item 1, an instrument repair.
4. **Relocate the MEMORY SAVE mechanics (Q4 R-A).** Change: keep trigger, hard block and pointer in AGENTS.md. Evidence: duplicated ownership verified at save-workflow.md §5/§11 and save.md:19/:61/:68. Files: AGENTS.md:284-290 and `system-spec-kit/references/memory/save-workflow.md` (receiving surface, may need the frontmatter-shortcut clause preserved). Tests: 1 pass, 2 pass, 4 pass as stated in R-A.
5. **Compress the four Git Workspace Safety mechanics rows (Q4 R-B).** Change: keep the three guard rows. Evidence: sk-git/SKILL.md:359/:360/:371 plus :309-321. Files: AGENTS.md:326-335 and sk-git (receiver). Tests: 1 pass for the four rows, 2 pass, 4 pass; guards unchanged.
6. **Compress the exit-code parenthetical (Q4 R-C).** Change: keep the `RESULT: PASSED` requirement. Evidence: validation-rules.md:44 and :761-763. Files: AGENTS.md:266 and `system-spec-kit/references/validation/validation-rules.md` (receiver). Tests: 1 pass, 2 pass, 4 pass.
7. **Fix agents-md-integration.md §4's version claims.** Change: correct "all nine sit at 1.0.0.0" and state the positions the corpus actually took (handoff `1.1.0.0`, delegation `1.0.0.2`), or explicitly acknowledge both schemes. Evidence: Q2.4. Files: `references/agents-md-integration.md`. Tests: instrument repair, observed falsification.
8. **Give AGENTS.md:114's bare `parent-skills-nested-packets.md` reference its path (Q3 B4).** Evidence: it resolves only through skill-hub-routing.md:68. Files: AGENTS.md:114. Tests: n/a, a resolution fix.

---

## REFUSALS

Each entry names the proposal, the deciding test, and where the content belongs instead.

1. **A comment-hygiene rule file (C1).** Failed four-part test 2: an existing home covers it at three layers (pre-commit:40-52, code-style-guide.md §4, sk-code-quality/SKILL.md:183). Test 4 also fails, the gate blocks so no failure happens today. Destination: the existing gate and standard.
2. **A git workflow rule (C2).** Pre-refused class ("git/PR", decision-tests.md:94-96), and four-part test 2 fails, sk-git/SKILL.md:276-285 and :299 own it. Destination: sk-git plus AGENTS.md §5.
3. **A deep-loop iteration rule (C6).** Failed test 2: workflow mechanics are Out (REPO RULES.md:85-89). Destination: AGENTS.md:117 Gate 4 and the mode packets.
4. **A CLI-executor briefing rule (C7).** Failed test 2 (dispatch mechanics Out). Destination: AGENTS.md:493 and each cli-X SKILL.md, with posture already in delegation-and-orchestration.md §2.
5. **An MCP tool-discovery or naming rule (C8).** Failed four-part test 2 (home at AGENTS.md:355-363 and naming-convention.md). Destination: those two surfaces.
6. **A spec-folder or validation rule (C3).** Pre-refused ("spec-folder") and Out. Destination: system-spec-kit references.
7. **A memory-save rule file (C4).** Pre-refused ("memory"). Destination: save-workflow.md and save.md. Distinct from recommendation 4, which moves AGENTS.md prose under an existing owner rather than creating a rule file.
8. **A retrieval-discipline rule (C5).** Failed test 2 and four-part test 2. Destination: AGENTS.md:319 and retrieval-conventions.md.
9. **A router-parity rule (C10).** Failed test 1 (not needed on no-trigger turns) and four-part test 2 (agents-md-integration.md:73-74 and README.md:178 own it). Destination: the mode's own references.
10. **Relocating the Restraint Signals table out of AGENTS.md §3.** Declined. prevent-overengineering.md:102 states "Its Restraint Signals table binds and is not repeated here", making AGENTS.md its only copy, and no failure supports the move. Destination: stays at AGENTS.md:212-226.
11. **Relocating the Confidence Thresholds bands.** Declined on the same ground. uncertainty-and-honesty.md:48-49: "The scale is the Confidence Thresholds table in `AGENTS.md` §2 and there is exactly one of it; this file carries no second copy." Destination: stays at AGENTS.md:92-97.
12. **Relocating Violation Recovery.** Already refused in the adoption phase (decision-tests.md:43-46), because its trigger fires exactly when the trigger-loaded path may be broken. Destination: stays at AGENTS.md:134-136.
13. **Relocating the four verification standards.** Failed test 1 in reverse: they must bind on read-only turns, which AGENTS.md:240 states as the design. Destination: stays at AGENTS.md:238-247.
14. **Removing or relocating the §10 Quick Reference table.** Failed test 4 (no named failure) and the receiving surfaces load after the workflow is chosen, not before. Destination: stays at AGENTS.md:450-474.
15. **A new ask-surface rule (C11).** Failed four-part test 2: already admitted, as a widening into handoff-and-questions.md §5 (REPO RULES.md:98-109). Destination: the existing rule.
16. **A runtime-quirk or Pi-plugin rule (C12).** Failed four-part test 4 (no AGENTS.md anchor, nothing to load it) and test 3. Destination: `.pi/PLUGINS.md` and the runtime docs.
17. **A dependency-acquisition rule.** Failed four-part test 2: prevent-overengineering.md §4 (:139-141) and blast-radius.md §6 (:138-142) plus the AGENTS.md bullets own it. Destination: existing rules.

**Evidence limits for the whole run:** the two claims I could not settle are stated inline (B6's missing automated parity gate is an absence verified in `.github` and `.opencode`, not a guarantee, and the sk-git advisory's runtime reach is documented but unexercised). No write was made; this iteration is read-only per the brief.
