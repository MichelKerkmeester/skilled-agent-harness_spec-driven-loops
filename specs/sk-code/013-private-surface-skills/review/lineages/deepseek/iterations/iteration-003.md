# Review Iteration 003 — Traceability

**Lineage:** `deepseek` · **Session:** `fanout-deepseek-1792944728998-cwb2cp` · **Iteration:** 3 of 5
**Dimension:** traceability (phase state, closure gates, spec-to-record fidelity)

## Dimension

Traceability: does the packet's own record agree with itself and with the repository? This pass compares the parent's declared state, the goal's completion log, each phase's acceptance-criteria rows, and the handoff blocks' expected outputs against the commits that are actually on `origin/main`.

## Files Reviewed

- `specs/sk-code/013-private-surface-skills/spec.md:13,50,100,136-138,188`
- `specs/sk-code/013-private-surface-skills/goal.md:89-93,111-112`
- `specs/sk-code/013-private-surface-skills/002-hub-surface-removal/acceptance-criteria.md:13,44,69-70,86-87`
- `specs/sk-code/013-private-surface-skills/002-hub-surface-removal/implementation-summary.md:41,54`
- `specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/acceptance-criteria.md:41,79-80,347`
- `specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/spec.md:33`
- `specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/implementation-summary.md:14`
- `.skilled/skills/sk-code/mode-registry.json` (modes array)
- `.skilled/skills/system-skill-advisor/runtime/tests/private-skill-target.vitest.ts`, `tests/skill-graph-db.vitest.ts` (test counts)

## Findings by Severity

### P0 Findings

None. No finding here asserts that a shipped behavior is wrong; every one is a contradiction between records. The underlying work is committed: `e3beac65f4`, `1218b94938`, `e8256b8044`, `ff993936c7`, `01742752c1` and `ee0fdc94eb` are all ancestors of `origin/main`, and `HEAD` equals `origin/main`.

### P1 Findings

#### 1. R3-P1-001 — The parent spec contradicts itself on whether the packet is complete

- **Severity:** P1
- **File:** `specs/sk-code/013-private-surface-skills/spec.md:50`
- **Claim:** The metadata table states `Status | Complete`, while the same document's phase map three sections later marks phase 2 `In progress`, phase 3 `Pending` and phase 4 `Pending` (`spec.md:136-138`), and its continuity block still says "phase 002 in progress uncommitted" (`spec.md:13`).
- **Evidence:** `spec.md:50`, `spec.md:136`, `spec.md:137`, `spec.md:138`, `spec.md:13`; `goal.md:111-112` records phases 2 and 3 as Done with named commits, and `git merge-base --is-ancestor e3beac65f4 origin/main` exits 0.
- **Counterevidence sought:** Checked whether the phase map is a historical snapshot by design — the parent template's "PHASE DOCUMENTATION MAP" section is presented as current state with a Status column, and the goal binds the parent as the aggregate progress tracker (`spec.md:147`).
- **Alternative explanation:** The Status row was advanced to `Complete` when the goal was reconciled and the phase map was not updated in the same pass; the direction of the drift is benign (the newer statement is the true one).
- **Final severity:** P1. A resumer reading only the map would re-run phases 2-4.
- **Confidence:** high.
- **Downgrade trigger:** the phase map being explicitly labeled historical in a future edit.

#### 2. R3-P1-002 — One acceptance row says Met and the same file's evidence says Unmet

- **Severity:** P1
- **File:** `specs/sk-code/013-private-surface-skills/002-hub-surface-removal/acceptance-criteria.md:69`
- **Claim:** AC-013's table row ends `Met`, with an observation dated 2026-10-24; the evidence section for the same criterion (`:86`) says "AC-013 — Unmet", and the frontmatter (`:13`) says "AC-001–012 Met; AC-013–014 Unmet".
- **Evidence:** `:69` (row), `:86` (evidence), `:13` (frontmatter), `:44` (`Status: In progress (~90%)`).
- **Counterevidence sought:** Read the full AC-013 block (`:265-272`) to see whether a later note supersedes the evidence paragraph. The block repeats the Unmet reasoning and names the compiled-route sentinel as the cause; no later row withdraws it.
- **Alternative explanation:** The row was corrected to Met after the advisor rebuild and the evidence paragraph was left behind. If so, the evidence paragraph is the stale half — the defect is the same either way: the file disagrees with itself, so neither a reader nor a validator can decide the criterion's state.
- **Final severity:** P1. The acceptance criteria are the packet's closure gate.
- **Confidence:** high.
- **Downgrade trigger:** a recorded run of the AC-013 command showing the compiled route present, plus the evidence paragraph updated.

#### 3. R3-P1-003 — The closure gate still blocks a phase whose commits are on `origin/main`

- **Severity:** P1
- **File:** `specs/sk-code/013-private-surface-skills/002-hub-surface-removal/acceptance-criteria.md:70`
- **Claim:** AC-014 ("Given the phase is committed and pushed to `main`, When the packet validator runs on the final state, Then the packet passes and the remote matches the local commit") is `Unmet`, and the evidence says "T105 review, final T106 closure and T108 commit/push remain open" (`:87`). The goal records phase 2 as Done with commit `e3beac65f4` plus `1218b94938` on `origin/main` (`goal.md:111`), and both are ancestors of `origin/main` with `HEAD == origin/main`.
- **Evidence:** `:70`, `:87`, `goal.md:111`, `git merge-base --is-ancestor e3beac65f4 origin/main` → exit 0, `git rev-list --left-right --count HEAD...origin/main` → `0 0`.
- **Counterevidence sought:** Checked whether the criterion's validator half is unmet in a way the commit does not settle. The criterion is conjunctive (validator passes AND remote matches); the evidence paragraph says the validator printed `RESULT: PASSED` and only the commit/push was open. The commit half is now satisfied.
- **Alternative explanation:** The row predates the commit and no one re-ran the closure after it. That is the finding: a closure gate that was never re-evaluated after the state it names changed.
- **Final severity:** P1. The packet's own gate says "not closeable" for a phase the goal and the remote say is delivered.
- **Confidence:** high for the state; medium for whether the T105 review is genuinely closed (no artifact records it — see R3-P2-004).
- **Downgrade trigger:** none.

#### 4. R3-P1-004 — Phase 3's closure gate is unmet while the goal reports the phase done

- **Severity:** P1
- **File:** `specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/acceptance-criteria.md:79`
- **Claim:** AC-026 and AC-027 are both `Unmet` (`:79`, `:80`) and the file's own status line says "In progress; AC-026 and AC-027 wait on review, commit and push" (`:41`). `goal.md:112` records phase 3 as `Done` — "Four review rounds closed with no open P0 or P1 … committed with the advisor refactor on 2026-10-24" — and the advisor refactor commit `e00fef3e76` is in the history of `origin/main`.
- **Evidence:** `:41`, `:79`, `:80`, `goal.md:112`, `git log --oneline -- specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/` → `e00fef3e76`.
- **Counterevidence sought:** Looked for the review artifact AC-027 names. No `review/` directory and no `review-report*.md` exists anywhere under the packet, and `003-advisor-vocabulary-cleanup/scratch/` is empty. The four review rounds the goal cites left no durable record in this checkout.
- **Alternative explanation:** The reviews ran as in-session subagent dispatches whose report lived in a temp file (AC-027's own proof command reads `/tmp/phase3-review.txt`). The work may well be done; the record cannot show it.
- **Final severity:** P1. Either the goal overstates completion or the closure gate was never updated — both are traceability failures, and neither is a code defect.
- **Confidence:** high for the contradiction; medium for which side is stale.
- **Downgrade trigger:** an artifact (review report, PR record, or commit note) showing AC-026/AC-027 satisfied.

### P2 Findings

#### 5. R3-P2-001 — Phase 2's implementation summary still calls the work uncommitted

- **Severity:** P2
- **File:** `specs/sk-code/013-private-surface-skills/002-hub-surface-removal/implementation-summary.md:41`
- **Claim:** `Status | In progress (~90%); implementation remains uncommitted`, and the narrative repeats it (`:54`).
- **Evidence:** `:41`, `:54`, `goal.md:111`, ancestry checks above.
- **Counterevidence sought:** None needed; the claim is a state statement that the remote contradicts.
- **Alternative explanation:** Written before the commit and never revised.
- **Final severity:** P2 — narrative staleness with no gate authority, distinct from the acceptance rows that do gate closure.
- **Confidence:** high.
- **Downgrade trigger:** none.

#### 6. R3-P2-002 — Phase 3's own spec and summary still point at commit-and-push work

- **Severity:** P2
- **File:** `specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/spec.md:33`
- **Claim:** `Status | In Progress`, and the implementation summary's `next_safe_action` is "Run the next independent review (T084), then commit and push (T074, T075)" (`implementation-summary.md:14`), while `goal.md:112` says the phase is done and committed.
- **Evidence:** `spec.md:33`, `implementation-summary.md:14`, `goal.md:112`, `e00fef3e76`.
- **Counterevidence sought:** None needed.
- **Alternative explanation:** Same stale-after-commit pattern as R3-P2-001.
- **Final severity:** P2.
- **Confidence:** high.
- **Downgrade trigger:** none.

#### 7. R3-P2-003 — The 003-to-004 handoff's expected test count no longer matches the suite

- **Severity:** P2
- **File:** `specs/sk-code/013-private-surface-skills/spec.md:188`
- **Claim:** The handoff block expects `Tests  16 passed (16)` from `tests/private-skill-target.vitest.ts tests/skill-graph-db.vitest.ts`, "five containment cases plus eleven graph cases".
- **Evidence:** `private-skill-target.vitest.ts` defines eight cases (`:38-103`, including the trusted-root, missing-target, regular-file, self-link and two-dot cases), and `skill-graph-db.vitest.ts` defines eleven; the two files total nineteen, not sixteen. The phase-3 implementation summary already describes "Eight containment cases" (`003-advisor-vocabulary-cleanup/implementation-summary.md:67`), so the handoff text is the stale copy.
- **Counterevidence sought:** Checked whether the handoff runs a filtered subset; the command names the two files without a filter, so it runs all nineteen.
- **Alternative explanation:** Three cases were added after the handoff block was written.
- **Final severity:** P2. A verifier would see nineteen and must not read that as a regression.
- **Confidence:** high for the counts; the suite was not executed here (declared non-goal).
- **Downgrade trigger:** none.

#### 8. R3-P2-004 — AC-027's proof is an ephemeral temp file

- **Severity:** P2
- **File:** `specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/acceptance-criteria.md:347`
- **Claim:** AC-027's proof command is `tail -1 /tmp/phase3-review.txt`, a path that cannot survive the session, and no review report exists in the packet.
- **Evidence:** `:347`, `:80`, and `find specs/sk-code/013-private-surface-skills -name 'review-report*.md'` → no result.
- **Counterevidence sought:** Searched the packet and `specs/sk-code` for a durable review artifact; none.
- **Alternative explanation:** The review was an in-session dispatch whose output was deliberately not committed; the criterion then has no durable evidence by construction.
- **Final severity:** P2 — evidence durability, not a behavior defect.
- **Confidence:** high.
- **Downgrade trigger:** none.

#### 9. R3-P2-005 — D1's hub composition predates a fourth packet

- **Severity:** P2
- **File:** `specs/sk-code/013-private-surface-skills/spec.md:100`
- **Claim:** D1 states the hub keeps `sk-code-quality`, `sk-code-review` and `sk-code-skilled`. `mode-registry.json` now declares four modes, adding `sk-code-ci` as a second `surface` packet, and `.skilled/skills/sk-code/` holds its folder.
- **Evidence:** `spec.md:100`, `.skilled/skills/sk-code/mode-registry.json` (modes array, `workflowMode: sk-code-ci`), `.skilled/skills/sk-code/sk-code-ci/`. The addition belongs to packet `014-code-modes-research`, not to this one.
- **Counterevidence sought:** Checked whether D1 is scoped to "the two surfaces leave" rather than to the hub's exact inventory. D1's wording is an inventory statement, and the spec's phase-2 row repeats "the hub keeps three packets" (`spec.md:136`).
- **Alternative explanation:** D1 is a frozen decision about what *this* packet leaves behind; a later packet adding a surface does not violate its intent. On that reading the finding is a documentation-currency note only.
- **Final severity:** P2.
- **Confidence:** high for the mismatch; medium for whether it needs an amendment rather than a note.
- **Downgrade trigger:** a parent-spec edit recording the later surface addition.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|---|---|---|---|
| `spec_code` | core | fail | Four P1 contradictions between the packet's declared state and its records (R3-P1-001…004); the implementation itself matches its spec. |
| `checklist_evidence` | core | fail | Two phase closure gates carry `Unmet` rows while the goal reports Done; one row contradicts its own evidence paragraph. |

## Next Dimension

D4 Maintainability: duplicated rules across sixteen scan sites, the durability of the packet's evidence, and the cost of the next change.

## Verdict

Four P1 findings, all of them record-versus-record contradictions, and five P2 advisories. The code and the shipped behavior are not in question; the packet's ability to prove its own completion is. Under the packet's own rule — "This document decides whether the packet may close" (`002-hub-surface-removal/acceptance-criteria.md:33`) — the record says it may not.

Review verdict: CONDITIONAL
