# Iteration 4: What tooling finds, what only reading finds, and why the split falls where it does

## Focus

Finish the tooling-versus-reading split for iteration 3's seven residue classes, add the class the split itself exposed, and derive the ordering rule: which classes are discoverable before the removal and which only after. Deliverable: the two-column table with a reason per class, plus pre-removal versus post-removal timing.

## Findings

### 1. The eight classes, split by the instrument that actually finds them

| Class | Tooling that finds it | That tool's blind spot | What reading supplies |
|---|---|---|---|
| R1 config env whose holder died | `git show <deregister-commit>` — the diff is the only place the block's contents exist | a deleted block leaves no hit in the working tree; `grep` searches the wrong universe unless it is `git show` | whether the value is still *needed* by the new front door. The trust grant and the doc-trigger flag are policy, not transport |
| R2 tests encoding the removed contract | a full test run | a focused run samples nothing | retire, rewrite, or repoint — and the packet's rule to *raise* rather than fix in place is a judgement, not a tool |
| R3 names outliving referents | token grep lists candidates | cannot tell a dead referent from a live one | the disposition for each name; the referent's existence is a fact about the world |
| R4 generated artifacts | token grep finds the stale strings | cannot see that regeneration is non-separable, or that a consumer depends on the drift | the scheduling decision: fix now, defer with a record, or treat as a fence |
| R5 cross-package hardcoded paths | path grep, but only run *outside* the swept tranche | a tranche-scoped grep returns clean, and "clean" is an artifact of scope | whether a surviving path is a runnable example (must fix) or a historical record (must not) |
| R6 documentation describing a deleted harness | token grep finds the strings | cannot separate past tense from present tense, and buckets `MCP server`, `system_skill_advisor` and a legitimate negative assertion together | tense and consequence: the doctor warning is only wrong once you read what it tells an operator to do |
| R7 local machine state outside the repository | none — a suite *creates* it and nothing inspects afterwards | the corpus is the wrong universe; the residue is in `/tmp`, the launcher status file, the state counter | deciding to look at a run's side effects at all |
| **R8 alias pairs collapsed by a rename** (new) | a **concept** grep — `legacy fallback` — not a token grep; and a diff of docs against code | a search keyed to the retired transport token does not reach it, because no transport token is involved | that a documented alias and a code operand are supposed to be the same name |

The split is not "grep finds some, people find others". Every class above is *reachable* by a command; the question each time is whether the command's search key is the right one. R1 needs a key in git history, R8 needs a key in intent vocabulary, R7 needs no key at all because there is no corpus.

### 2. R8: the class the split exposed, and the proof that it is a solvable class

The advisor's own `references/config/db-path-policy.md:80` states:

> `SYSTEM_SKILL_ADVISOR_DB_DIR` is allowed for tests and disposable CI runs only. `SYSTEM_SKILL_ADVISOR_DB_DIR` remains a legacy fallback for existing scripts.

and `runtime/database/README.md:25` repeats it:

> Tests may override the directory with `SYSTEM_SKILL_ADVISOR_DB_DIR`; `SYSTEM_SKILL_ADVISOR_DB_DIR` remains a legacy fallback.

Two documents assert that a second spelling is honored, and the second spelling in both sentences is the first spelling. The code does the same thing at the sites listed in iteration 1 (`hooks/lib/skill-advisor-cli-fallback.ts:182`, `bin/lib/launcher-ipc-bridge.cjs:95`, `bin/system-skill-advisor-launcher.cjs:358`, `plugins/system-skill-advisor.js:355-356`, `commands/doctor/scripts/skill-graph-freshness.cjs:47`), and the child-env allowlist carries the same name twice (`system-skill-advisor-launcher.cjs:131,133`).

Three things make this the most instructive residue in the packet.

**It is inside the swept tranche and the sweep walked past it.** Both documents live under `.opencode/skills/system-skill-advisor/`, the exact directory 007 swept to zero retired tool ids and 12 classified `MCP server` lines. They survived because the sweep's key was the transport token and this residue contains no transport token. Correction to iteration 3's R1: the documentation did not merely die with the deleted config block — two live documents inside the swept directory still assert the dead alias.

**The same repository contains the working form of the mitigation.** `.opencode/hooks/shared/hook-flags.cjs:43-63` keeps an explicit `LEGACY_ALIASES` table for exactly this problem, with the generations named in a comment — "Three generations coexist here so operator config written against any of them keeps working" — and the rule stated outright: "everything a real surface also documents or exports for the same concern is listed here so the documented switch actually disables the hook". The skill-advisor entry alone lists seven spellings across `SYSTEM_`, `MK_` and `SPECKIT_` (`:54-61`). So the contrast is not hypothetical: **one owner with an enumerated alias table works, and an inline `NAME ?? NAME` chain repeated at every consumer is what fails.** The failure mode is not "the rename was mechanized"; it is "the alias knowledge was copied per site instead of owned in one place".

**The evidence that the second name was real is still present.** `MK_SKILL_ADVISOR_DB_DIR` survives in the plugin test that deletes it to prove the override works (`.opencode/plugins/tests/system-skill-advisor.test.cjs:193-194`), in `hook-flags.cjs:57-59`, and in the retrieval fixture corpus. The pre-rename `_NOTE_DB` string named it as the override. The intent was never ambiguous; only the implementation collapsed.

### 3. Tooling versus reading, restated as a property of the search key

The table in §1 reduces to three statements that generalise beyond this packet:

1. **A token-keyed search finds residue that still carries the removed token.** R2's red suites, R5's surviving paths and R6's stale strings are all token-reachable. This is why a sweep keyed on the old transport's vocabulary looked complete: it *was* complete for the classes whose carrier names the removed thing.
2. **A residue class whose carrier does not name the removed thing is invisible to that search, even inside the swept directory.** R8 is the proof. The collapse was caused by a *different* rename, in a *different* vocabulary, and no transport token appears in the carrier.
3. **Some classes have no corpus at all.** R7 is not found by a better key; it is found by inspecting the side effects of a run. And R1 is found only by a key in history (`git show`), not in the tree.

The practical consequence is a change of instrument, not of effort. To close (2), the sweep needs a second key family: the *intent* vocabulary of the operation — for a rename, words like `legacy`, `alias`, `fallback`, `deprecated`, `still recognized`, `old name`, `both spellings`. That search is cheap and it found this packet's unclosed class in one command. To close (3), the sweep needs a step in the procedure rather than a query: after any harness run, diff the machine state the run touched.

### 4. Pre-removal versus post-removal discoverability, and what that implies for scheduling

| Class | Discoverable before the removal? | Why | Cost of finding it late |
|---|---|---|---|
| R1 env whose holder died | **Yes** — read the block before deleting it | the values and their `_NOTE_*` doc live in the file being deleted | a live invariant (the trust gate, the doc-trigger flag) has to be rediscovered from git after a caller breaks |
| R3 names outliving referents | **Yes** — decide while the referent is in code | the dead/live call needs the old structure to hand | a rename in a later phase, or a permanent lie like `mcpServerDir` |
| R5 cross-package hardcoded paths | **Yes** — search outside the tranche first | the path is a string, findable at any time | a broken runtime path discovered from a failing session |
| R8 alias collapse | **Yes, and cheapest here** — a concept grep finds the pair while both names are still adjacent | the alias knowledge is local and readable | a documented switch that silently does nothing |
| R2 tests encoding the removed contract | **No** — the red state exists only after the contract is gone | a test is red because its referent is gone | low: tooling finds it, and the packet's raise-don't-fix rule contains it |
| R6 documentation describing a deleted harness | **No** — the false present tense becomes false only after | the claim's truth value is a function of the removal | moderate: an operator-visible warning that invites re-registration |
| R7 local state outside the corpus | **No** — requires a run to have happened | the residue is created by the migration activity itself | low per instance, unbounded in aggregate because nothing collects it |

The rule that falls out is the useful deliverable of this iteration, and it is a scheduling rule rather than a search rule:

> **Classes discoverable before the removal are gates on the removal. Classes discoverable only after are steps in a post-removal battery.**

The first set (R1, R3, R5, R8) is cheap because both sides of every rename still coexist, so a mistaken decision is visible immediately. The second set (R2, R6, R7) should not be searched for in advance, because the search cannot succeed; it should be *scheduled* — a full-suite run, a present-tense read of live operator surfaces, and a machine-state diff after the first harness run. Iteration 3 already showed the packet doing exactly this for R2 without naming it: the red suites were found by running the suite and were handled by the same commit that removed the last referent.

### 5. A process residue class the sweep cannot see: a handoff with no receiving record

005 recorded the retrieval fixture as "Data rather than a caller; handed to phase 7" (`005-mcp-transport-removal/goal.md:15`). The fixture survives: `.opencode/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json:60670` still carries `mcp__system_skill_advisor__skill_graph`. 007's implementation summary does not mention it, and 007's scope was the advisor skill directory while the fixture lives in system-spec-kit — so the receiving phase could not have acted on the handoff even if it had read it.

A repo-wide count of the retired tool id returns 3, and every one has a classification, which is itself the proof that the residue is not the problem here: one is a legitimate negative assertion in a route-contract test (`commands/doctor/scripts/tests/skill-advisor-route-contract.test.cjs:142`), one is the unconsumed handoff above, and one is the advisor changelog, kept on purpose. The class is **an item handed between phases with no acceptance record on the receiving side**, and its detector is neither a grep nor a read of the code — it is reading the *handoff* against the receiver's scope.

## Sources Consulted

- `.opencode/skills/system-skill-advisor/references/config/db-path-policy.md:80` and `runtime/database/README.md:25` — the two live documents asserting the collapsed alias
- `.opencode/hooks/shared/hook-flags.cjs:43-63,54-61` — the enumerated `LEGACY_ALIASES` table and its stated rule
- `.opencode/plugins/tests/system-skill-advisor.test.cjs:193-194` — the surviving `MK_SKILL_ADVISOR_DB_DIR` deletion
- `.opencode/bin/system-skill-advisor-launcher.cjs:131,133,358` — the duplicated allowlist entries and operand
- `../../../../005-mcp-transport-removal/goal.md:15` — the fixture handoff to phase 7
- `../../../../007-docs-and-residue-sweep/implementation-summary.md` — sweep scope, counts, decisions, limitation 2
- `.opencode/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json:60670` and `.opencode/commands/doctor/scripts/tests/skill-advisor-route-contract.test.cjs:142` — the two surviving retired ids outside the changelog
- `.opencode/skills/system-skill-advisor/changelog/v0.1.0.md:3` — the deliberately retained historical id
- Measured: `grep -rn "MK_SKILL_ADVISOR"`, `grep -rn "mcp__system_skill_advisor__"`, `grep -rn "legacy fallback"` over `.opencode`, excluding `node_modules` and `dist`

## Assessment

- **newInfoRatio: 0.80**
- **Novelty justification:** R8 as a class, the in-repo contrast with the working `LEGACY_ALIASES` table, the correction that two live documents inside the swept tranche still assert the dead alias, the three-statement restatement of the tooling-versus-reading split as a property of the search key, the pre/post-removal scheduling rule, and the handoff-without-acceptance class are all new to this packet's record.
- **Confidence:** High for R8 and the contrast (both are direct readings of files at HEAD, and the concept grep reproduces the find in one command). High for the pre/post table's assignments of R1, R2, R5, R6, R8. Medium for R7's placement — it is "not discoverable in advance" only because nothing in the packet's procedure looks for it; a procedure could make it a pre-step by diffing state before and after each harness run.
- **Evidence gap:** The R8 claim that the fault entered with `19e1ffedaf0` is dated from `git log -S` output, which locates the change that introduced the duplicated *string*; I did not read that commit's diff to confirm it is a find-and-replace rather than a hand edit. The distinction does not change the remedy, only the blame.

## Reflection

- **Worked:** Deriving a search key from the *operation* rather than from the *removed thing*. "Legacy fallback" is a property of renames in general; it found a class that four phases of transport-token sweeping did not, inside the directory that was swept hardest.
- **Worked:** Looking for the working form of a mitigation in the same repository. `hook-flags.cjs` turned R8 from "renames are messy" into "alias knowledge must be owned in one enumerated table", which is actionable and testable.
- **Failed / ruled out:** Treating R1 as a search problem. Ruled out by the fact that the deleted block's contents are not in the tree at all; the instrument is history, and the class is therefore a pre-deletion read, not a post-deletion sweep.
- **Failed / ruled out:** Reading the seven-class list in iteration 3 as closed. Ruled out by R8, which appeared only when the split forced me to ask what search key each class needs — a reminder that a taxonomy built from one operation's tokens can be complete for that operation and incomplete in general.
- **Correction recorded:** iteration 3 said the alias documentation "died with the block". Two live copies survive inside the swept directory, which makes the miss sharper and the correction worth carrying into synthesis.

## Recommended Next Focus

Iteration 5: the packet's own record. Enumerate every place the record is wrong, stale or self-contradictory, and separate three kinds — a phase whose `goal.md` progress rows say Pending while its commits and artifacts exist (005, 006, 008, and the parent's 004-008 rows); a phase whose `implementation-summary.md` is an untouched template next to shipped work; and a substantive claim that contradicts another artifact (`verdict.md`'s "Differing 15" against `report.json`'s `differed: 0`; 007's "four red tests raised, not fixed" against the commit that retired or rewrote three of them; 004's F18 still headed `OPEN` with the fix visible in source). Then consolidate the eight residue classes and the eight findings into the final checklist, ordered so each step fails cheaply.
