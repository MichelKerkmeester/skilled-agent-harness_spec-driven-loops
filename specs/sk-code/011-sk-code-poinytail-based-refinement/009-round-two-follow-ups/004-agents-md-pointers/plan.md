---
title: "Implementation Plan: Phase 4: agents-md-pointers"
description: "Audits all 296 lines of AGENTS.md against the repo rules and finds one clause a Gate 6 rule can own, the section 10 close-out. The five-part status moves into communication-handoff.md section 1, evidence-and-proof.md section 10 and AGENTS.md section 10 point to it, and every other clause stays with its reason. A dry run on copies passed the canary and the repo-rule checker."
trigger_phrases:
  - "agents md pointers plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: agents-md-pointers

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown instruction file and repo rule files, read by an agent at session start (AGENTS.md) and through the `REPO RULES.md` router and Gate 6 (rule files) |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `check-rule-copies.js` and its self-test, `check-repo-rules.cjs`, `sync-gate1-pointers.cjs --check`, three vitest files, two pytest files, `diff` against `scratch/before/`, `git status --porcelain`, `repair-derived.cjs`, `validate.sh --strict`, `check-goal.cjs` |

### Overview
AGENTS.md section 10 restates a five-part close-out as four parts, and the fix cannot be a plain pointer to the rule that holds five, because that rule loads only on the first write of a session. The only rule guaranteed to load at the end of every turn is `communication-handoff.md` (Gate 6), so the list moves there, AGENTS.md section 10 shrinks to a one-line pointer, and `evidence-and-proof.md` section 10 points to the same place. A dry run of the exact edit text on a copy of the tree passed the delivery-prefix canary and the repo-rule checker, and the builder applies the same text to the real files.

### Findings from planning

Every file and line in the brief matched on 2026-10-10. These points matter to the builder:

- The audit finds one POINTER clause out of 44 rows. Twenty-one KEEP rows name a rule file that carries the same or related text, and each fails the binding test: it is a gate, hard blocker, delivery-prefix anchor or unconditional standard, or AGENTS.md is the owner and the rule file cites it, or the clause binds on read-only turns where the rule file never loads. Eighteen rows have no rule-file carrier at all, and the remaining four KEEP rows (1, 11, 19 and 38) are carried only by the router or a skill reference, or already point to the rule.
- The fix edits one AGENTS.md line. Line 296 starts at byte 27,003, past all 21 delivery-prefix anchors and past Devin's 16,384-byte cut, so the prefix report cannot move. The Blast-Radius Management anchor ends at byte 16,373, 11 bytes under the limit, so no earlier AGENTS.md line may gain a byte.
- `~/.claude/CLAUDE.md` is a symlink to the main checkout's AGENTS.md (`ls -l` shows it, and `.devin/SYNC.md` line 90 says so). The brief asks the summary to record that the operator must copy the new file there. A copy would write through the symlink into the main checkout, so the summary records the symlink and the real operator action instead (Q3 in `spec.md`).
- `communication-handoff.md` already says the status is required by `AGENTS.md` section 10 and `evidence-and-proof.md` section 10 (line 64) but lists none of it, and `evidence-and-proof.md` section 10 ends by pointing back to `communication-handoff.md` section 1. The two files already reference each other, so the move completes a loop that exists.
- Repo rules have no per-rule changelog. The contract's only record of a rule edit is the fourth-segment version bump (`agents-md-integration.md` section 4). The release changelog under `.skilled/changelog/skilled/` is the orchestrator's at release time.
- `communication-handoff.md` goes from 198 to 210 lines, into the 201 to 250 band (`rule-anatomy.md` section 3). The contract names content moved down from AGENTS.md as a sufficient reason.
- `REPO RULES.md` needs no edit. The `evidence-and-proof.md` row still says "close out a turn" and still settles "what an honest close-out contains", because section 10 keeps the not-done paragraph. The `communication-handoff.md` row already says "End a turn", and its Fires-when bullets are unchanged, so checks 9 and 10 of the checker stay as they are.
- `validate.sh --strict` printed `RESULT: PASSED` on this folder's unfilled scaffold in earlier phases, so the placeholder search in `tasks.md` is a separate required gate.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-source rule ownership. Each obligation has one home. AGENTS.md keeps what must bind with nothing loaded, and holds a pointer for anything a rule that always loads at that moment can carry.

### Key Components
- **`AGENTS.md`** (296 lines, 27,266 bytes): the always-loaded instruction file. Gate 6 (lines 103 to 107, ends at byte 10,037) is the guarantee the pointer relies on. Section 10 (lines 287 to 296) is the only section edited, and only line 296.
- **`communication-handoff.md`** (198 lines, version 1.6.0.4): loaded by Gate 6 "before ending a turn". Its Fires-when already reads "About to end a turn, of any kind, substantive or not". Section 1 gains the owner text, and section 8 gains one self-check line.
- **`evidence-and-proof.md`** (238 lines, version 1.1.1.3): loaded through Gate 5 by trigger match. Section 10 keeps its not-done paragraph and the first-report-is-honest sentence, which `answer-the-actual-request.md` section 6 cites, and swaps the list for a pointer.
- **`check-rule-copies.js`** and its self-test: the delivery-prefix canary. They read AGENTS.md whole.
- **`check-repo-rules.cjs`**: the repo-rule contract's validator, 11 checks, with `--root` for dry runs.

### Data Flow
A session loads AGENTS.md. Before any substantive reply, Gate 6 loads `communication.md` and `communication-prose.md`, and before the turn ends it loads `communication-handoff.md`. After the fix, section 10 sends the model to that file for the five status parts, and the file is already in context. On a write turn, `evidence-and-proof.md` may also load through Gate 5, and its section 10 sends the model to the same file. Nothing else reads the list.

### Consumers of AGENTS.md text

The brief's list was confirmed with `rg -ln --hidden -g '!node_modules' -g '!specs/**' -g '!.git/**' "AGENTS\.md" .skilled` (165 files, 20 of them code files). Only the rows below read the file, and none pins line 296.

| Consumer | How it reads AGENTS.md | Pinned text | Effect of this fix |
|----------|------------------------|-------------|--------------------|
| `check-rule-copies.js` | Whole file. Lines 81 to 85 need one Iron Law line with "completion claim" and "verification". Lines 93 to 120 hold 21 anchors, `prefixBytes` 16384, `maxBytes` 32768 | Line 18, the 21 anchors | None. Bytes fall from 27,266 to 27,252 and the prefix report is identical |
| `check-rule-copies.test.sh` | Seeds a tree from the real file, then rewrites "stack-appropriate verification", prepends 17,000 bytes and appends 33,000 bytes | Same | None |
| `sync-gate1-pointers.cjs` | First line holding `lookup-trigger-index.mjs` (line 51), rendered into `.cursor/rules/skill-routing.md` | Line 51 | None |
| `gate1-pointer-sync.vitest.ts` | Writes its own synthetic AGENTS.md | None | None |
| `workflow-invariance.vitest.ts` | Scans the real file for the words preset, capability, kind and manifest. AGENTS.md is exempt as legacy cleanup debt (`isLegacyPhaseCleanupDebt`) | None. The new line holds none of those words | None |
| `graph-key-file-declarations.vitest.ts` | Writes a one-line synthetic AGENTS.md | None | None |
| `check-grep-convention-helper.mjs` | Lists AGENTS.md among uppercase names exempt from the naming rule. Never reads it | None | None |
| `gate-3-classifier.ts` | File-exists probe while finding the workspace root | None | None |
| `test_measure_rule_compliance.py` | Passes the path string to `is_exempt_target` | None | None |
| `test_instruction_file_exclusion.py` | Writes a synthetic AGENTS.md. `validate_document.py` skips it by exact name | None | None |

Other code files only name AGENTS.md: `scan-integration.cjs`, `measure-rule-compliance.py`, `fanout-run.cjs`, `render.ts`, `skill_advisor.py`, `extract-from-evidence.cjs`, `rule-experiment.py`, `validate_document.py`, `test_build_rule_cards.py` and `resource-map-extractor.vitest.ts`. Inbound references to AGENTS.md section 10 are `communication-handoff.md` line 64 (rewritten here), `delegation-and-orchestration.md` line 73 (the CLI dispatch bullet, unchanged) and `answer-the-actual-request.md` line 101 (cites `evidence-and-proof.md` section 10, which still holds the sentence it cites).

### Audit of AGENTS.md clauses

Rule loads, as the rows use them. **G5**: Gate 5, the first write of a session, matched against the `REPO RULES.md` trigger table, so never on a read-only turn. **G6 always**: `communication.md` and `communication-prose.md` before every substantive reply. **G6 handoff**: `communication-handoff.md` before ending a turn. **skill**: owned by a skill or system-spec-kit reference, not a repo rule. Line numbers are from the file on 2026-10-10.

| # | AGENTS.md clause (section, lines) | Also carried by | Rule loads | Decision | Reason |
|---|-----------------------------------|-----------------|------------|----------|--------|
| 1 | §1 L9, load bridge | `REPO RULES.md` §1 | router, G5 | KEEP | Already a pointer, and it is what makes Gate 5 work |
| 2 | §1 L11-18, Four Laws and Iron Law | `evidence-and-proof.md` §2, §9; `scope-discipline.md` §2 to §4 | G5 | KEEP | Hard blockers and anchors. L18 is pinned: the canary needs an Iron Law line with "completion claim" and "verification", and its self-test rewrites "stack-appropriate verification" |
| 3 | §1 L20-30, PLAN-WORKFLOW LOCK | `scope-discipline.md` §5, §6 (L28 already points there) | G5 | KEEP | Hard blocker and anchor |
| 4 | §1 L32-34, Comment Hygiene | none | n/a | KEEP | Hard blocker and anchor, and no rule file carries it |
| 5 | §1 L36-41, Halt Conditions | none | n/a | KEEP | Anchor, and no rule file carries the list |
| 6 | §2 L47-54, gate banner and Gate 1 | none | n/a | KEEP | Gate and anchor. L51 is the one line `sync-gate1-pointers.cjs` reads and copies into the Cursor rule |
| 7 | §2 L56-63, Confidence Thresholds | `uncertainty-and-honesty.md` §1 (points here for the scale) | G5 | KEEP | Anchor, and AGENTS.md is the owner |
| 8 | §2 L65-72, Gate 2 | none | n/a | KEEP | Gate and anchor, owned by the skills |
| 9 | §2 L74-86, Gate 3 | none | skill | KEEP | Hard gate asked first, anchor, and `gate-3-classifier.ts` is the machine contract for its vocabulary |
| 10 | §2 L88-91, Gate 4 | none | n/a | KEEP | Gate and anchor |
| 11 | §2 L93-101, Gate 5 | `REPO RULES.md` §1 (match procedure) | router | KEEP | Gate and anchor. It is the mechanism that loads rule files, so it cannot defer to one |
| 12 | §2 L103-107, Gate 6 | none | n/a | KEEP | Gate and anchor. It is the load that makes row 44 safe |
| 13 | §2 L109-110, Consolidated Question Protocol | `communication-decisions.md` §3 and `communication-handoff.md` §7 (both cite AGENTS.md §2); `uncertainty-and-honesty.md` §1 (restates it) | G5, G6 | KEEP | Anchor, and the rule files point here |
| 14 | §2 L112-113, Violation Recovery | none | n/a | KEEP | Anchor. Its trigger fires when the trigger-loaded path may already be broken (`decision-tests.md` §1) |
| 15 | §4 L119-129, Verification Standards | `evidence-and-proof.md` §1, §2, §5, §7; `delegation-and-orchestration.md` §6 | G5 | KEEP | The text says these bind unconditionally, read-only turns included, and the section is an anchor |
| 16 | §4 L133-138, Final-State Verification | `evidence-and-proof.md` §9 | G5 | KEEP | Hard block and anchor |
| 17 | §4 L140-145, Completion Verification Rule | `evidence-and-proof.md` §2 | G5 | KEEP | Hard block and anchor, and it already points to `validation-rules.md` |
| 18 | §4 L147-151, Memory Save Rule | none | skill | KEEP | Hard block and anchor, and it already points to `save-workflow.md` |
| 19 | §4 L153-155, Goal Posture Rule | `sk-create-goal` `references/budget-and-handoff.md` §4 | skill | KEEP | Always on, and a skill reference loads only when its skill is routed. It is not a repo rule (Q4 in `spec.md`) |
| 20 | §4 L157-162, Self-Check | none | n/a | KEEP | Restates the gates themselves, not a rule file |
| 21 | §4 L164-169, Reply Rules and Mandates | `communication.md` §10; `uncertainty-and-honesty.md` §2, §3 | G6 always, G5 | KEEP | Three anchors pin L167 to L169, and §8 (L275) says these clauses bind when nothing loads. `communication.md` loads every reply, but the anchors exist for a runtime that cuts the file |
| 22 | §3 L175-178, Blast-Radius Management | `blast-radius.md` §1 to §3 | G5 | KEEP | Anchor, and "no rule file relaxes" the stop for yes. L178 names the irreversible class a session must recognize with nothing loaded, and already links the ladder |
| 23 | §3 L182-185, four Execution Behavior principles | `evidence-and-proof.md` §3, §11; `scope-discipline.md` §6; `prevent-overengineering.md` §1 | G5 | KEEP | Each binds on every turn, no rule section carries the sentence whole, and each rule loads only on its triggers |
| 24 | §3 L186, Settled stays settled | `uncertainty-and-honesty.md` §7 (L186 already links it as "Detail") | G5 | KEEP | Pushback arrives on read-only turns, where that file never loads. The link is already the pointer |
| 25 | §3 L187, Plan before acting | `scope-discipline.md` §8 | G5 | KEEP | No scope trigger in `REPO RULES.md` names planning, so the file may not be in context at the first edit |
| 26 | §3 L188, Do not stop early | `scope-discipline.md` §7 (cites AGENTS.md §3) | G5 | KEEP | AGENTS.md is the owner |
| 27 | §3 L189, Do not ask permission | `scope-discipline.md` §7; `communication-handoff.md` §4, §7 (cite AGENTS.md §3) | G5, G6 handoff | KEEP | AGENTS.md is the owner, and the sentence lists the mandatory waits |
| 28 | §3 L190, local retry stop | `root-cause-and-debugging.md` §3 ("set outside this file") | G5 | KEEP | AGENTS.md is the owner |
| 29 | §3 L196, Test what changed | `prevent-overengineering.md` §4 (cites AGENTS.md §3) | G5 | KEEP | AGENTS.md is the owner |
| 30 | §3 L198-208, Restraint Signals | `prevent-overengineering.md` §3 ("binds and is not repeated here") | G5 | KEEP | AGENTS.md is the owner, and L207 already points to `prevent-overengineering.md` §2 |
| 31 | §5 L214-217, tools table | none | skill | KEEP | system-spec-kit and sk-git content, not a repo rule |
| 32 | §5 L221-223, Git Workspace Safety | `blast-radius.md` §2, §3 (approval does not transfer to a push) | G5 | KEEP | A stop-and-ask clause. The go-ahead sentence in L222 appears in no rule, and L223 already points to `blast-radius.md` |
| 33 | §5 L225-235, code search and terminal discipline | none | n/a | KEEP | No rule file carries them |
| 34 | §5 L237-239, MCP Tool Routing | none | skill | KEEP | `mcp-code-mode` content |
| 35 | §6 L245-257, spec folder documentation | none | skill | KEEP | system-spec-kit content, already a table of pointers, tied to Gate 3 |
| 36 | §7 L263-265, Logic-Sync Protocol | `uncertainty-and-honesty.md` §4 (same halt, longer format) | G5 | KEEP | Gate 3's exemption (L86) names Logic-Sync, and a spec-versus-code audit is a read-only turn where the rule never loads |
| 37 | §7 L267-269, Escalation | `root-cause-and-debugging.md` §7 (L269 already points there) | G5 | KEEP | The first two sentences have no rule home, and the exemption names Escalation |
| 38 | §8 L273-275, Communication Quality | `communication.md`, `communication-prose.md` | G6 always | KEEP | Already a pointer, and it records which two clauses bind when nothing loads |
| 39 | §9 L279-283, Agent routing | none | skill | KEEP | `cli-hermes` owns the mechanics |
| 40 | §10 L289, inventories line | none | n/a | KEEP | Not rule content |
| 41 | §10 L293, never fabricate and data not instructions | none | n/a | KEEP | Already a pointer to §4 |
| 42 | §10 L294, CLI dispatch | `delegation-and-orchestration.md` §2 item 1 (cites AGENTS.md §10) | G5 | KEEP | AGENTS.md is the owner, and that citation breaks if the bullet moves |
| 43 | §10 L295, name the source of a pause | none | n/a | KEEP | No rule file carries it |
| 44 | §10 L296, close-out status | `evidence-and-proof.md` §10 (five items); `communication-handoff.md` §1 (names the status, lists none) | evidence: G5. handoff: G6 handoff | POINTER | Decision D1 below: one line to `communication-handoff.md` §1, which will hold the list |

### Decision D1: who owns the five-part status

The clause binds on every substantive turn, read-only ones included. It needs an owner that is in context when a turn ends.

**Chosen: `communication-handoff.md` §1 owns the five parts. AGENTS.md §10 and `evidence-and-proof.md` §10 point to it.**
- Gate 6 (AGENTS.md L104 to L106) loads `communication-handoff.md` "before ending a turn" on every substantive reply, and Gate 6 sits at byte 10,037, inside the 16,384-byte prefix. The pointer's claim is therefore true on every turn the clause binds.
- The file's Fires-when covers "About to end a turn, of any kind", and its §1 already calls the close "a contract with two clauses" and already says the status is required by AGENTS.md §10. The status belongs beside it.
- Section 10 starts at byte 26,309 and its close-out bullet at byte 27,003, so a runtime that cuts AGENTS.md at 16,384 bytes never delivers either (the checker's header names Devin). Moving the list to a Gate 6 file means those sessions receive the five parts for the first time.
- Precedent: `decision-tests.md` §1 records that the communication rule left AGENTS.md §8 once its trigger covered every reply, and that §8 kept the two clauses that must bind with nothing loaded. The status list is not one of those two.

**Rejected: point AGENTS.md §10 straight at `evidence-and-proof.md` §10, where the five parts already live.**
- That file loads only through Gate 5, which fires on the first write and reads `REPO RULES.md` then. A review, audit or explanation turn writes nothing, so the router is never opened and the target is not in context when the clause binds.
- A write turn is only partly covered. The first write may match no evidence trigger, and `REPO RULES.md` §1 asks for a match on every later action while only the first write is a hard block.
- It fixes the visible drift today and recreates it the next time either file changes.

**Also dismissed.** Leave the list in both rule files: two copies, the same drift one step down. Make `communication.md` the owner: it loads on every reply, but it governs how a reply reads, and its §5 already defers the close to `communication-handoff.md` §1.

**What the orchestrator confirms before the build** (Q1 and Q2 in `spec.md`): the owner, and the shrink of `evidence-and-proof.md` §10. The shrink is two separate tasks, T020 and T021 in `tasks.md`, so dropping it costs no other task.

### Decision tests, in brief

The repo-rule contract asks for the four decision tests on every revision. They pass for this amendment: (1) the status binds at turn end and `communication-handoff.md` has a turn-end trigger, with the §8 precedent above; (2) it is posture, how a turn closes, which `REPO RULES.md` §4 lists as In; (3) it has a home, so it lands in a section of the rule that already owns the close, with no new file; (4) the failure is real today, a four-item list in the file every session reads against a five-item list in the file most turns do not read. `tasks.md` T015 records the verdicts in the summary.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **Dry run, already done.** The exact edit text in `tasks.md` was applied to a full copy of the rule tree under a temporary root, with `scratch/apply-dryrun.py` as the script. On that copy, `check-rule-copies.js --root` exited 0 with all 21 anchors and a prefix report identical to the real tree's, and `check-repo-rules.cjs --root` printed `RESULT: PASSED (11/11 checks)` with the line ceiling reading `max=233` and the rule links reading `links=48`. The copy gave the expected line numbers and byte counts that `tasks.md` cites. `scratch/dryrun/` keeps the three edited files and the two saved checker outputs, and the builder leaves it in place.
- **AGENTS.md (REQ-001).** `diff scratch/before/AGENTS.md AGENTS.md` shows only `296c296`, which proves every KEEP row is untouched and the one POINTER row is applied. `wc -c` reads 27,252 against a limit of 27,266.
- **Canary (REQ-003).** `check-rule-copies.js` before and after, and the self-test. The prefix report must be identical, since the edit sits past byte 16,384.
- **Repo-rule contract (REQ-004).** `check-repo-rules.cjs`, plus a scan of the added lines of each file's diff for an em dash, a semicolon and a comma-list `and` or `or`. The detector is `, [^,.;]+, (and|or) `. It is a proxy that misses a serial list whose item holds a comma. A known instance proves it is live: run over `prevent-overengineering.md` it prints line 38, "Adding a file, module, class, interface, abstraction, config option, feature flag, layer, or dependency." A first draft of the AGENTS.md line tripped it on a clause join, which is why the pointer sentence opens with a full stop. The Fires-when sections are compared against `scratch/before/`.
- **Consumers (REQ-005).** `sync-gate1-pointers.cjs --check`, the three vitest files through `vitest run --config ../../vitest.config.ts --project cli` from `runtime/cli`, and the two pytest files from `sk-doc/scripts/tests`. Baseline on 2026-10-10: 12 vitest tests passed and 13 pytest tests passed.
- **Scope (REQ-006).** `git status --porcelain` over the guarded paths against the empty baseline from T002, plus `ls -l` and `cmp` on the global file.
- **Unchanged surfaces (REQ-009).** The trigger index does not carry the rule files (its corpus roots are `specs`, `.skilled/skills`, `.skilled/hooks` and `.skilled/changelog/skilled`), and the Hermes copy check is run in `--check` form only.
- **Folder validator (SC-004).** `repair-derived.cjs --apply`, then `validate.sh --strict`, read for `RESULT: PASSED`. The placeholder search is the separate gate for unfilled text.
- **Gap.** No test reads the new pointer sentence. The proof is the `diff`, the SC-002 check that Gate 6 names the owner, and the prose scan. A reader of AGENTS.md alone cannot confirm the five parts, and the pointer is what sends them to the file.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The repo-rule contract: `.skilled/skills/sk-doc/SKILL.md` (routes repo-rule work), `.skilled/skills/sk-doc/sk-create-repo-rule/SKILL.md`, `references/agents-md-integration.md` (revise path, version rule, the AGENTS.md boundary), `references/rule-anatomy.md` (length bands, one self-check line per obligation) and `references/decision-tests.md`.
- The house prose rule, `.skilled/repo-rules/communication-prose.md` §3: no em dash, no semicolon, no serial comma in any sentence a reader reads.
- The authority to change AGENTS.md: the repo-rule contract allows only adding or removing a pointer and escalates anything else. `../spec.md` §4 records the operator's choice on 2026-10-10 to run this AGENTS.md pointer pass, so replacing a restated list with a pointer is inside it.
- `check-repo-rules.cjs` check 7 resolves one link into `.skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md`. The dry run copied that file in, and the real tree needs no copy.
- Node.js with `npx vitest` from the system-spec-kit workspace, Python 3 with pytest, and `rg`.
- No sibling child. The other four children touch disjoint files, and the Hermes generator is the orchestrator's single run after all builds.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Restore the three tracked files from `scratch/before/` with `cp`, or with `git restore AGENTS.md .skilled/repo-rules/communication-handoff.md .skilled/repo-rules/evidence-and-proof.md`.
- Nothing else changed: no router row, no trigger index, no mirror, no consumer. The global `~/.claude/CLAUDE.md` is never touched, so it needs no rollback.
- Sibling repositories that symlink the two rule files pick up a restore the same way they picked up the edit.
<!-- /ANCHOR:rollback -->

---
