# Review Report: Command Surfacing Build, Pass Three (narrow, three rounds)

- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder)
- Pass: the third and last review pass. It is narrow by design: it reads the diff of the remediation commits, not the whole packet. Pass one is kept as `review/review-report-pass-1.md` and pass two as `review/review-report-pass-2.md`, each with its registry and attribution file beside it.
- Executor for every lineage: `cli-opencode` with `opencode-go/deepseek-v4.1-flash` at reasoning effort max, threshold 0.10.
- Adjudication: the coordinator (Fable 5.2) reproduced every P0 and P1 by running the cited input. Two judgment calls got a read-only second opinion from Fable 5.2 medium on the second Claude account.

---

## 1. Executive Summary

- **Verdict: PASS.** Open findings after adjudication and fixes: P0 0, P1 0. Five P2 are left, each with a reason in section 4.
- **Rounds:** three, six lineages, twenty iterations.
- **Round one** read the diff `ec1869dae8..1ca14a4498` (phases 017 and 018). It found one P1 and one P2. Both reproduced. Fixed in `860610d783`.
- **Round two** read that fix. The hook fix held in both lineages. Both lineages raised a P1 on the coordinator's own fix for the P2: a lookahead let a real no-edit request that names its object keep a mutating offer. Reproduced and reverted in `846eab66b8`.
- **Round three** read the final state of the two changed files with the two settled decisions stated. It found no defect in the fixes. Each lineage raised a P1 on a gap in the no-edit vocabulary, graded P2 on adjudication for the reason pass two gave for the same class, and fixed anyway in `0cdc9fa3ef`.
- **Convergence:** every lineage of every round ended its last iteration at 0.00 new findings except `hook-confirm-3b`, which ended at 0.22 on its cap. Section 5 has the table. The loop is closed on this judgment: the last round found nothing in the reviewed fixes, and what it did find is one class, an incomplete word list, that a further round would find again with other words.
- **Not re-reviewed:** commit `0cdc9fa3ef` was checked by its own tests and the full gate battery, not by a lineage. It adds words to one pattern and prefixes to one set.
- **Holdout:** no reviewer opened the sealed file. The one deleted line was checked by `git diff --numstat` only.

---

## 2. Findings and their outcome

| Id | Round | Severity raised | Severity after adjudication | Finding | Outcome |
|----|-------|-----------------|-----------------------------|---------|---------|
| DR3-P1-001 | 1 | P1 | P1 | The doctor hook check read `node -e1 <script>` and `node --eval=1 <script>` as a wired hook | Fixed in `860610d783`. Held in both round two lineages |
| AR3-P2-001 | 1 | P2 | P2 | `make no changes to its public api` inside a change request reads as a no-edit request | Accepted as a cost, pinned by a test, after the first fix failed (next row) |
| HC3B-P1-001, NE3-P1-001 | 2 | P1 | P1 | The lookahead added for AR3-P2-001 let `make no changes to the files` keep a mutating offer | Fixed by reverting the lookahead in `846eab66b8` |
| HC3B-P2-003 | 2 | P2 | P2 | No test row held a real no-edit request with an object | Fixed in `846eab66b8`: one row for each reading |
| HC3B-P2-002, NE3-P2-002 | 2 | P2 | n/a | The lookahead word list was too narrow or matched one literal space | Moot: the lookahead is gone |
| HC3B-P2-001, NE3-P2-003, HC3B-P2-004 | 2 | P2 | P2 | A command node itself rejects, such as an unknown flag, can still read as a launch, and no test covers it | Declined, section 4 |
| HC3-P1-001 | 3 | P1 | P2 | `don't make any changes` was not in the no-edit wording | Fixed in `0cdc9fa3ef` |
| NC3-P1-001 | 3 | P1 | P2 | `dont create it yet` kept `/create:agent (start)` | Fixed in `0cdc9fa3ef` for an object that names nothing in particular. The rest declined, section 4 |
| NC3-P2-002 | 3 | P2 | P2 | `just show` and `just list` read a two-step change request as no-edit | Declined, section 4 |
| HC3-P2-001, NC3-P2-003 | 3 | P2 | P2 | A node flag with a space-separated value is read as the script, so a working hook reads as missing | Declined, section 4 |
| HC3-P2-002 | 3 | P2 | P2 | `command node <script>` and a launch inside a conditional were not read as a launch | Fixed in `0cdc9fa3ef` |

---

## 3. Adjudication notes

**DR3-P1-001, reproduced.** A settings file whose hook command was `node -e1 <marker>`, `node --eval=1 <marker>` or `node --print=1 <marker>` printed `ok claude`. After the fix each prints `hook-missing claude .claude/settings.json`. The severity stays P1: the doctor check would tell an operator a hook is wired when it never runs.

**The lookahead P1s, reproduced by test.** `show me the plan and make no changes to the files` returned false from `isNoEditRequest` with the lookahead in place. The second opinion agreed with the revert and added a fact this report records: a false match costs more than the offer when the prompt also holds a read-only verb, because `isReadOnlyExplainer` then floors every skill row to 0.25 (`runtime/lib/scorer/text.ts`, `runtime/lib/scorer/fusion.ts`). So `refactor the parser, show me the diff and make no changes to its public api` can lose its skill recommendation as well as its command. That is the accepted cost of AR3-P2-001.

**The vocabulary P1s, graded P2.** Pass two held the same class, four no-edit wordings that still attached a create command with policy `start`, at P2 (SA2-P2-002, `review-report-pass-2.md`). Its two grounds have not changed: `start` runs the command without `:auto`, so its setup asks before it writes, and `AGENTS.md` Gate 2 says an explicit instruction outranks the policy. A write without asking needs the model to ignore both. The second opinion read the precedent and Gate 2 and reached P2. This is read from the documents, not observed in a session.

---

## 4. P2 left open, with reasons

1. **AR3-P2-001.** Words alone cannot tell `make no changes to the files` from a change request that says what to leave alone. Both read as no change, because a lost offer costs less than a mutating offer on a prompt that ruled one out. The code comment says so and a test pins both readings.
2. **Negated write verbs with a real object.** `don't add tools` and `don't delete the old tests` limit a change and do not refuse it, so they keep their command. A no-edit prompt in that shape is not caught. Same grounds as the precedent above.
3. **NC3-P2-002.** `just show` and `just list` predate this packet's remediation and fail toward no offer.
4. **A command node rejects** (HC3B-P2-001, NE3-P2-003, HC3B-P2-004). The hook check is a wiring heuristic. It reads how a shell starts a command, not whether node accepts every flag.
5. **A node flag with a separated value** (HC3-P2-001, NC3-P2-003). The check cannot know every flag's arity. It fails visibly: the operator sees `hook-missing` with the repair line, and the `=` form reads correctly.

---

## 5. Convergence

| Round | Lineage | Iterations | New-findings ratio per iteration | Stop reason |
|-------|---------|------------|----------------------------------|-------------|
| 1 | `advisor-runtime-3` | 4 | 1, 0, 0, 0 | cap reached |
| 1 | `doctor-docs-3` | 4 | 1, 0, 0, 0 | converged |
| 2 | `hook-confirm-3b` | 3 | 1, 0.86, 0.22 | cap reached |
| 2 | `noedit-confirm-3b` | 3 | 1, 1, 0 | cap reached |
| 3 | `hook-close-3c` | 3 | 1, 0.71, 0 | cap reached |
| 3 | `noedit-close-3c` | 3 | 1, 1, 0 | cap reached |

One lineage stopped by rule. Five stopped on their cap, four of them at 0.00. The caps were short on purpose, three or four iterations, because the scope was a few files.

---

## 6. Verification after the last fix

At `0cdc9fa3ef`, from `scratch/review-pass-3/pass3c.txt`: the advisor suite reads 184 files and 1805 passed with 0 failed, the doctor tests read 1218 passed, typed recall is 24 of 44, false offers are 0 of 35, typed delivery is 44 of 44, plain tune is 28 of 45 and the scorer eval reads `[160,50,21,5]`. All 18 reproduction probes exit 0.

---

## 7. Audit Appendix

- **Scope files:** `review/review-scope-3.txt` for round one. Rounds two and three name their files in their instructions.
- **Fan-out configs:** `review/deep-review-fanout-config-pass-3.json`, `-pass-3b.json` and `-pass-3c.json`.
- **Lineage folders:** the six folders above under `review/lineages/`, each with its own report, registry and state log.
- **Merged registry:** `review/deep-review-findings-registry.json` was last written by a fan-out run and reflects the folders that run read. This report, not that file, is the adjudicated record for pass three. Pass two's merged registry is `review/deep-review-findings-registry-pass-2.json`.
- **Root config:** `review/deep-review-config.json` stays at `initialized`, as in pass two, because the fan-out runner does not run the single-executor init and save phases.
- **Runner note:** a one-lineage fan-out is refused by the runner, so rounds two and three used two lineages each.
- **Untracked nested repository:** `review/lineages/accuracy-runner-2/logs/quotepath-probe/` is a git repository a pass two reviewer made. It is left in place and out of every commit until the operator says to delete it.
