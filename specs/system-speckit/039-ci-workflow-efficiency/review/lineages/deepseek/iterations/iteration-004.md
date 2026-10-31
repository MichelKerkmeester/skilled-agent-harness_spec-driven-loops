# Deep Review Iteration 4 — Maintainability

**Iteration**: 4 of 5
**Dimension**: maintainability
**Target**: `specs/system-speckit/053-ci-workflow-efficiency`
**Focus**: whether the packet's documents can be kept true by the next person — template and anchor integrity, whether the task lists can express their own completion, whether cross-references resolve, and whether an amended acceptance row still reads as one statement.

---

## 1. FILES REVIEWED

- All 64 packet markdown documents outside `scratch/`, `research/` and `review/` — anchor balance and template-source presence checked programmatically.
- `specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/tasks.md` — 102 task headings, 8 without a status marker; Completion Criteria at `:2682`.
- `specs/system-speckit/053-ci-workflow-efficiency/004-setup-caching-provisioning/tasks.md:3228` — the checklist's own task-count claim.
- All nine child `spec.md` files — the `../changelog/` instruction.
- All nine `acceptance-criteria.md` files — rows carrying more than one "observed" clause.
- `specs/system-speckit/053-ci-workflow-efficiency/spec.md:1-40` — parent frontmatter and metadata.

---

## 2. VERIFIED STRUCTURAL PROPERTIES

| Property | Check | Result |
|---|---|---|
| Anchors balanced | Every `<!-- ANCHOR: x -->` paired with `<!-- /ANCHOR: x -->` across 64 documents | **0 mismatches** |
| Template source present | `SPECKIT_TEMPLATE_SOURCE` in every document | **0 missing** |
| Task headings countable | `^### T[0-9]+[A-Z]?` across the nine task lists | 004: 82 headings, matching its checklist's "82 tasks" claim exactly |
| Acceptance rows complete | Every `| AC-` row carries AC-ID, R-id, REQ, Given/When/Then, Verification, Status, Waiver | 115 rows across nine packets, 0 short rows |

---

## 3. FINDINGS BY SEVERITY

### P0 Findings

None.

### P1 Findings

#### R4-P1-001 — Phase 007's task list cannot express its own completion: 8 of 102 headings carry no status marker, and they are the commit tasks and the open ones

`007-.../tasks.md` holds 102 `### T…` headings. 94 carry `[x]`; the remaining eight carry no marker at all, so they match neither the `[ ]` pending convention nor the `[x]` complete convention the file's own Notation table defines:

| Line | Heading | What it is |
|---|---|---|
| `:621` | `### T021 Commit the permissions pass (AC-001)` | the commit that lands R25 |
| `:678` | `### T023 Commit the Dependabot split (AC-002)` | the commit that lands the split |
| `:1580` | `### T061 Commit the timeout pass (AC-003)` | the commit that lands R24 |
| `:2455` | `### T097 Commit the switch pass (AC-005)` | the commit that lands R26 |
| `:2488` | `### T098 Commit the README section (AC-007)` | the commit that documents R26 |
| `:2595` | `### T100 Read the first 24 hours of runs for a timeout kill (AC-003)` | still pending |
| `:2618` | `### T101 Run the final gates and record the phase result (AC-009, AC-011, AC-012)` | still pending |
| `:2644` | `### T102 Commit the closure records (AC-009, AC-011, AC-012)` | still pending |

The five commit tasks are exactly the ones that would prove the work reached `main` — the question at the centre of R1-P1-001 — and they are the ones with no status. The three pending tasks are invisible to the file's own Completion Criteria, which reads `- [ ] All tasks marked `[x]`` (`:2682`): a reader who counts `[ ]` finds zero pending tasks in a file that has three, and a reader who counts `[x]` finds 94 of 94.

The consequence is mechanical: `grep -c '^### T[0-9]* \[x\]'` returns 94 and `grep -c '^### T[0-9]* \[ \]'` returns 0, so every automated or eyeball completion count agrees the phase is finished while its own last three tasks are not, and its own five commit tasks were never ticked. This is the mechanism by which the status inversion in R1-P1-001 could persist unnoticed.

[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/tasks.md:621]
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/tasks.md:2682]

**Claim**: the 007 task list's status markers omit the eight tasks that decide whether the phase is done, so neither its own Completion Criteria nor a grep can detect the three tasks still open.
**evidenceRefs**: the heading table above, each line read; `python3` count of 102 headings, 94 marked `[x]`, 8 unmarked; `:2682` for the Completion Criteria.
**counterevidenceSought**: checked whether the eight are sub-steps of bracketed parents (they are top-level `###` headings with their own `File:`/`Change:`/`Check:` blocks); checked whether a later section re-lists them with ticks (`grep -c 'T100'` finds three mentions, all prose or the heading); checked whether the Notation table allows an unmarked form (it defines `[ ]`, `[x]`, `[P]` and `[B]` only).
**alternativeExplanation**: the commit tasks may be deliberately unmarked because a commit is an act, not a checkbox. That reading would be defensible if the same file did not mark `T014 [x] Commit the change as one commit` in phase 002 and `T097`/`T098`'s neighbours in 007; the convention is inconsistent within the packet, not deliberately different.
**finalSeverity**: P1 — the packet's closure gate reads these markers, and the phase it cannot close is the one whose status is already inverted.
**confidence**: 0.95
**downgradeTrigger**: a notation rule in this packet that exempts commit tasks from status markers, applied consistently across all nine task lists.

### P2 Findings

#### R4-P2-001 — All nine child packets instruct a changelog refresh in a folder that does not exist

Each child `spec.md` ends its phase-context block with the same instruction. In `002-.../spec.md:68`: "When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name." The same line appears in all nine children (006 carries eight `changelog/` mentions of its own, for the sk-code changelog it creates).

`specs/system-speckit/053-ci-workflow-efficiency/` contains `001-research` … `009-doctor-ci-review-wiring`, `description.json`, `goal.md`, `graph-metadata.json`, `review/`, `spec.md` — and no `changelog/` directory. So the instruction every phase carries on closure points at nothing, and a phase that follows it either creates the folder ad hoc or skips the step. The five phases that read `Complete` have each already passed the point where the instruction applies.

[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal/spec.md:68]

#### R4-P2-002 — Nine amended acceptance rows carry two "observed" clauses, so the current evidence cannot be told from the superseded one

Rows amended in place keep their pre-amendment observation and append a new one, separated only by a dash:

| Packet | Rows with two or more "observed" clauses |
|---|---|
| 002 | AC-005, AC-007 |
| 003 | AC-013, AC-016, AC-017 |
| 004 | AC-013, AC-015, AC-017 |
| 005 | AC-006 |

`004-.../acceptance-criteria.md:74` is the clearest case: "observed: `grep -c '^D5=' scratch/decisions.md` returns `1` (`D5=approve`); — observed (2026-10-24): …". A reader has to infer that the second clause supersedes the first, and nothing in the row says so. The packet has an established mechanism for exactly this situation — AC-006 of phase 002 moved its status through an explicit `**Amendment (date, subject)**` paragraph below the table — so the fix is a convention the packet already uses rather than a new one.

[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/004-setup-caching-provisioning/acceptance-criteria.md:74]
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal/acceptance-criteria.md:65]

---

## 4. TRACEABILITY CHECKS

| Protocol | Level | Status | Evidence |
|---|---|---|---|
| `spec_code` | core | partial | Structural integrity is clean (anchors, template sources, row shape); the defects are in how status is expressed, not in whether the documents parse. |
| `checklist_evidence` | core | partial | 007's checklist cannot see 8 of its tasks; 9 rows in 4 packets carry superseded evidence beside current evidence. |
| `skill_agent` | overlay | notApplicable | No skill or agent document is in this iteration's scope. |
| `agent_cross_runtime` | overlay | notApplicable | No agent definition is in scope. |
| `feature_catalog_code` | overlay | notApplicable | No feature catalog entry is claimed. |
| `playbook_capability` | overlay | notApplicable | No playbook is claimed. |

---

## 5. RULED OUT

- **Anchor or template drift across the packet.** Ruled out: 0 anchor mismatches and 0 missing `SPECKIT_TEMPLATE_SOURCE` markers across 64 documents.
- **004's task list overstates its own size.** Ruled out: the checklist's "82 tasks: T001-T074 plus the lettered tasks T011A, T014A, T027A, T040A, T061A, T062A, T066A and T070G" matches the 82 headings exactly.
- **The 007 unmarked tasks are a formatting slip in one file.** Ruled out as a one-off: five of the eight are the commit tasks, which the same packet marks in phase 002, so the omission tracks the phase that is also status-inverted.
- **A missing `resource-map.md` is a defect.** Ruled out: the packet has none, so the Resource Map Coverage Gate is skipped by contract, and no row claims otherwise.

---

## 6. VERDICT

One P1: phase 007's task list cannot express completion — 8 of 102 headings carry no status marker, and they are the five commit tasks and the three open ones, which is why the phase's inversion survived every count. Two P2: nine children point at a `changelog/` folder that does not exist, and nine amended acceptance rows carry two observations without saying which supersedes. Structural integrity itself is clean: anchors balanced, template markers present, row shape complete across 115 acceptance rows.

Review verdict: CONDITIONAL
