---
title: "Feature Specification: Fix every finding of the twelve-pass deep review of the system-skill-advisor logic"
description: "Twelve review passes over the advisor runtime and hooks returned FAIL with 3 P1 and 16 P2 findings. A one-skill graph scan wipes the live graph, two temp-folder writers and the socket clients trust folders another user can own, and five code comments promise what the code does not do. This packet fixes all of them, deletes the dead lifecycle code, and reruns one review pass to prove the verdict moved."
trigger_phrases:
  - "advisor logic review fixes"
  - "fix every finding of the twelve pass deep"
  - "advisor temp folder owner check"
  - "scoped skill graph scan delete"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.4 -->
# Feature Specification: Fix every finding of the twelve-pass deep review of the system-skill-advisor logic

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

A scan of one skill's folder deletes every other skill from the live advisor graph, the CLI connects through a socket folder it never checks the owner of, and the hook metrics store follows a planted symlink. This packet scopes the scan's delete to the root it scanned, puts one owner, mode and symlink check in front of every advisor socket client and temp-folder store, corrects five false code comments, fixes the scorer predicates in TypeScript and Python together, and deletes the lifecycle code no live route calls. The proof is a one-skill scan that leaves 15 nodes and 59 edges in place, tests that refuse a foreign-owned folder and a planted symlink, the full advisor gate set, and one extra review pass whose verdict script no longer prints FAIL.

**Key Decisions**: Scope the scan's delete to the scanned root rather than refuse a narrow root. Keep the trusted default and correct the comment and docs that deny it. Delete the dead supersession, rollback and backfill code. Pin the scorer's stage order with a test rather than split the function.

**Critical Dependencies**: The deep-review packet at `../review/`, whose generation 5 report and registry hold the findings and whose verdict script decides REQ-014.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-24 |
| **Branch** | `worktrees/532-advisor-review-extension` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Twelve deep-review passes over the advisor's runtime and hooks code (five DeepSeek passes in generation 4, seven Opus passes in generation 5) ended with verdict FAIL, 3 active P1 and 16 active P2 findings. The FAIL comes from the coverage gate, because five code comments promise behaviour the code does not have. The three P1s are a graph scan that wipes the live graph, a CLI that trusts a socket folder another local user can own, and a metrics store that follows a planted symlink.

### Purpose
Every finding in the generation 5 registry is fixed or removed with its code, and a fresh review pass records the verdict as no longer FAIL.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
A copy of the live graph database, indexed through the built `indexSkillMetadata` with the root set to one skill folder and then to the full skills root. The live database was not touched, because `SYSTEM_SKILL_ADVISOR_DB_DIR` pointed at the copy.

```text
$ SYSTEM_SKILL_ADVISOR_DB_DIR=/private/tmp/dr532-measure/db node probe-scan2.mjs /Users/michelkerkmeester/worktrees/public/532-advisor-review-extension
[skill-graph] UNKNOWN-TARGET: rejected sk-code enhances system-spec-kit (.../.skilled/skills/sk-code/graph-metadata.json)
[skill-graph] UNKNOWN-TARGET: rejected sk-code siblings sk-prompt (.../.skilled/skills/sk-code/graph-metadata.json)
[skill-graph] UNKNOWN-TARGET: rejected sk-code siblings cli-external-orchestration (.../.skilled/skills/sk-code/graph-metadata.json)
[skill-graph] UNKNOWN-TARGET: rejected sk-code siblings sk-git (.../.skilled/skills/sk-code/graph-metadata.json)
[skill-graph] UNKNOWN-TARGET: rejected sk-code prerequisite_for system-skill-advisor (.../.skilled/skills/sk-code/graph-metadata.json)
[skill-graph] UNKNOWN-TARGET: rejected sk-code prerequisite_for system-deep-loop (.../.skilled/skills/sk-code/graph-metadata.json)
[{"label":"before","nodes":15,"edges":59,"skCodeOut":6,"intoSkCode":8},{"label":"afterOneSkillRoot","nodes":1,"edges":0,"skCodeOut":0,"intoSkCode":0,"deletedNodes":14,"indexedEdges":0,"rejectedEdges":6},{"label":"afterFullRootRescan","nodes":15,"edges":59,"skCodeOut":6,"intoSkCode":8,"indexedFiles":14,"skippedFiles":14,"indexedEdges":59}]
exit=0
```

The review verdict before this packet, from `../review/deep-review-findings-registry.json` and `../review/deep-review-state.jsonl`:

```text
$ node .skilled/skills/system-deep-loop/runtime/scripts/review-verdict.cjs --registry-path <review>/deep-review-findings-registry.json --state-log <review>/deep-review-state.jsonl
{"status":"ok","verdict":"FAIL","has_advisories":false,"active_p0":0,"active_p1":3,"active_p2":16,"search_debt":0,"failed_required_gate_ids":["coverage"]}
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Scope the delete in `indexSkillMetadata` to nodes whose source lies under the scanned root, and print `deletedNodes` in the CLI text output (G5-I1-P1-001).
- Add one owner, mode and symlink check and call it from every advisor socket client and every temp-folder store: the CLI, the launcher bridge, the CLI shim, the metrics store, the shadow sink and the feedback calibration store (G5-I2-P1-001, G5-I6-P1-001, G5-I2-P2-002, and the calibration store the synthesis found).
- Correct the five comments that hold `spec_code` at partial and the doc lines that echo the trust-default promise (G5-I2-P2-001, G5-I4-P2-001, G5-I7-P2-001, and the comments in the files REQ-001 and REQ-003 change), plus the stale parity-suite path in the CLI catalog entry (R3-P2-002) and the missing fixture path in the degraded-daemon playbook scenario.
- Delete `routeSupersession`, `rollbackGraphMetadataFile`, `backfillDerivedV2` and `readMixedVersion`, the stress test that is their only caller, and the catalog entries that present them as live (G5-I3-P2-002).
- Fix the scorer predicates in `fusion.ts` and `skill_advisor.py` together with shared fixture cases, read the prompt cap and confidence floors from one contract, pin the scorer's stage order with a test, and fix the Pi budget, the Gate-3 lookup failure and the lock reclaim race (G5-I1-P2-001 to 004, G5-I3-P2-001, G5-I5-P2-001, G5-I4-P2-002 to 006).

### Out of Scope
- The offline scripts under `runtime/scripts/` that touch a temp folder, such as `measure-brief-cost.mjs` and the `routing-accuracy/` capture scripts - no review pass read them and no finding names them.
- The publish-after-commit ordering in `indexSkillMetadata` - pass 4 ruled it harmless to the prompt cache, and no finding was registered.
- The 90 scope files no narrative cites - they carry no finding.
- Changing the launcher's trusted default - the operator chose to correct the comment and docs instead.
- Splitting `scoreAdvisorPrompt` into stage functions - the operator chose an ordering test only.

### Files to Change

The list comes from the generation 5 report's Plan Seed. The clarification research in step 4 checks each path, and `plan.md` carries the checked list.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts` | Modify | Scope the node delete to the scanned root and correct the empty-root comment |
| `.skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/scan.ts` | Modify | Pass the scanned root through and report `deletedNodes` |
| `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts` | Modify | Owner check before connect, `deletedNodes` in text output |
| `.skilled/bin/lib/launcher-ipc-bridge.cjs` | Modify | Owner check before connect |
| `.skilled/bin/skill-advisor.cjs` | Modify | Owner check before connect |
| `.skilled/skills/system-skill-advisor/runtime/lib/metrics.ts` | Modify | Owner check, no symlink follow, stop on failed chmod |
| `.skilled/skills/system-skill-advisor/runtime/lib/shadow/shadow-sink.ts` | Modify | Same check for the opt-in shadow log |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/feedback-calibration.ts` | Modify | Same check for the opt-in calibration store |
| `.skilled/skills/system-skill-advisor/hooks/lib/route-receipt.ts` | Modify | Its existing check becomes the shared one, or calls it |
| `.skilled/skills/system-skill-advisor/runtime/advisor-server.ts` | Modify | State the real trust default |
| `.skilled/skills/system-skill-advisor/runtime/tools/advisor-contract-keys.ts` | Modify | Name consumers that exist |
| `.skilled/skills/system-skill-advisor/runtime/lib/shared/shared-payload.ts` | Modify | Name a drift guard that exists |
| `.skilled/skills/system-skill-advisor/runtime/lib/lifecycle/` and `runtime/lib/derived/` | Delete or Modify | Remove the four production-dead functions and their only test |
| `.skilled/skills/system-skill-advisor/feature-catalog/` | Modify or Delete | Trust default, CLI parity path, lifecycle entries |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` | Modify | Predicate fixes, withheld-holder fix |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | Modify | Python twins of the predicate fixes, contract-read cap and floors |
| `.skilled/skills/system-skill-advisor/runtime/schemas/compat-contract.json` | Modify | One home for the prompt cap and confidence floors |
| `.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts` | Modify | Budget pinned to the Claude value |
| `.skilled/skills/system-skill-advisor/runtime/lib/policy-plan.ts` | Modify | Gate-3 lookup failure recorded as a diagnostic |
| `.skilled/skills/system-skill-advisor/runtime/lib/freshness/generation.ts` | Modify | Re-read before reclaiming an empty lock |
| `.skilled/skills/system-skill-advisor/runtime/tests/` and `scripts/tests` | Create or Modify | One test per changed behaviour |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A `skill_graph_scan` whose `skillsRoot` is one skill folder deletes no node whose source lies outside that folder. On a copy of the live database the scan leaves 15 nodes and 59 edges, and the CLI text output prints `deletedNodes`. |
| REQ-002 | The advisor CLI, the launcher bridge and the CLI shim refuse to connect when the socket folder is owned by another user, is group or world writable, or the socket path is not a socket. A test with a mocked foreign owner proves each refusal. |
| REQ-003 | The metrics store, the shadow sink and the feedback calibration store refuse a folder they do not own, a folder with an open mode and a symlink at the folder or the file name, and a failed chmod stops the write. A test with a planted symlink leaves the symlink target unchanged. |
| REQ-004 | Each of the five code comments behind the `spec_code` partial states what its code does: `advisor-server.ts:324-326`, `skill-graph-db.ts:921-922`, `advisor-contract-keys.ts:5-9`, `metrics.ts:172` and `shared-payload.ts:4-7`. The catalog, playbook and reference lines that repeat the trust-default promise state the real default. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | `routeSupersession`, `rollbackGraphMetadataFile`, `backfillDerivedV2` and `readMixedVersion`, the stress test that is their only caller and the catalog entries that present them as live are gone, and `rg` finds no remaining reference outside `specs/` and changelogs. |
| REQ-006 | The RRF-scale, slash, doctor-inclusive ambiguity, stop-word and withheld-holder predicates in `fusion.ts` and their copies in `skill_advisor.py` behave the same, proven by shared fixture cases that both languages run. |
| REQ-007 | The prompt cap and the confidence floors have one definition that `fusion.ts` and `skill_advisor.py` both read, and a test fails if either hard-codes a different value. |
| REQ-008 | A characterization test pins the order-dependent stages of `scoreAdvisorPrompt` through its outputs on named prompts, and a mutation check shows each pinned reorder fails it. |
| REQ-009 | The Pi hook budget comes from the same value as the Claude hook budget, and a test fails if they differ. |
| REQ-010 | A failure to load the Gate-3 question list in `policy-plan.ts` is recorded as a diagnostic instead of swallowed. |
| REQ-011 | The lock reclaim in `generation.ts` re-reads an empty lock before deleting it, so a lock another process is still writing is not removed. |
| REQ-012 | The CLI catalog entry cites a parity suite that exists, and the degraded-daemon playbook scenario cites a fixture path that exists. |
| REQ-013 | Every gate in `plan.md` section 2 passes from the final tree, compared against the baseline captured before the first edit. |
| REQ-014 | One more native review pass over the fixed tree records each registry finding's state, and the verdict script prints no `FAIL`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: On a copy of the live database, a scan rooted at `.skilled/skills/sk-code` leaves 15 nodes and 59 edges, where today it leaves 1 node and 0 edges.
- **SC-002**: A test plants a symlink at each temp-folder store's file name, and the target file's content and mode are unchanged after a write.
- **SC-003**: The advisor vitest suite, the Python tests, the parity and routing ratchets and strict validation all pass, with the test count at or above the baseline.
- **SC-004**: `review-verdict.cjs` over the review packet prints a verdict other than `FAIL` after the verification pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The routing ratchets and golden prompts | A predicate fix that changes a top-1 route fails a ratchet | Run the ratchets before and after; a changed route is either the intended fix, recorded in the ledger with its reason, or a regression to undo |
| Dependency | The deep-review verdict script | REQ-014 depends on the verification pass recording `spec_code` as pass | The pass is told which five comments changed and reads each one |
| Risk | The owner check refuses a legitimate shared setup | Medium | The check accepts a folder owned by the current user only, which is the existing rule in `route-receipt.ts`; a refusal names the folder and the owner it found |
| Risk | Parallel agents edit the same file | High | Each file has exactly one owning agent in `tasks.md`; the swarm brief lists the files each agent may touch |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The owner check adds one `lstat` and one `stat` per connect or store open, and the hook path stays inside its existing budget.

### Security
- **NFR-S01**: No advisor process writes into, or connects through, a folder another local user owns.

### Reliability
- **NFR-R01**: A refused folder makes the store skip its write or the client fall back as it does today when the daemon is down. It never crashes the hook.

---

## 8. EDGE CASES

- Empty input: a scan root with no skill folders deletes nothing and leaves the graph as it was.
- Maximum input: a full-root scan still deletes nodes for skills that were removed from disk, as today.
- Failure path: a foreign-owned socket folder makes the CLI report the folder and its owner and fall back to the no-daemon path, and a foreign-owned store folder makes the store skip the write.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Files: about 30, LOC: about 900, Systems: runtime, hooks, launcher, Python fallback, catalog |
| Risk | 18/25 | Auth: N, API: N, Breaking: N, cross-user file and socket trust: Y |
| Research | 8/20 | Every finding has a cited line and a fix seed from the review |
| Multi-Agent | 12/15 | Workstreams: 5, run by a parallel swarm |
| Coordination | 10/15 | Dependencies: the shared owner check before its callers, the gate set and the verification pass after |
| **Total** | **68/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A predicate fix moves a top-1 route the ratchets pin | M | M | Ratchet baseline before, rerun after, each moved route explained or reverted |
| R-002 | Deleting the lifecycle code breaks an import nobody listed | M | L | `rg` for every deleted symbol before the delete, typecheck and full suite after |
| R-003 | Two agents edit one file and one edit is lost | H | L | One owning agent per file, named in `tasks.md` |
| R-004 | The owner check refuses the operator's own worktree socket folder | M | L | A test with the current user as owner passes, and the worktree socket folder under `$HOME/.spk-wt-sock` is exercised |

---

## 11. USER STORIES

### US-001: The graph survives a narrow scan (Priority: P0)

**As a** skill author who rescans one skill, **I want** the scan to touch only that skill, **so that** the advisor keeps routing to every other skill.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Another local user cannot read or redirect my prompts (Priority: P0)

**As an** advisor user on a shared machine, **I want** the CLI and the hook stores to refuse folders I do not own, **so that** another account cannot read my prompts, forge my routing or force writes into my files.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-003: The code says what it does (Priority: P1)

**As a** maintainer reading the advisor, **I want** each comment, catalog entry and duplicated constant to match the code, **so that** I can trust what I read without re-deriving it.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None. The operator decided the four design choices: scope the scan delete, correct the trust-default comment and docs, delete the dead lifecycle code, and add an ordering test only.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Review report**: See `../review/review-report.md`

---
