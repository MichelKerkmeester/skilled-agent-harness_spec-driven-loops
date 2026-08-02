---
title: "Feature Specification: hub-surface-drift-sweep"
description: "Two recent structural moves left a trail of link rot and orphaned ownership language that no gate catches, because broken prose paths are not broken router paths. Human reference maps disagree with the machine maps in the same file, retired lane owners still assign work, and two install symlinks dangle into a directory that no longer exists."
trigger_phrases:
  - "hub surface drift"
  - "prose link rot"
  - "dangling install symlink"
  - "resource map disagreement"
  - "worktree naming recipe"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/025-skill-doc-currency/004-hub-surface-drift-sweep"
    last_updated_at: "2026-08-02T14:32:45Z"
    last_updated_by: "skd025-004-build"
    recent_action: "Confirmed the locked HEAD state, built both checks, and captured pre-edit baselines"
    next_safe_action: "Apply the recorded design-hub rulings, ownership repoints, and cardinality repair"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pending-first-save"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Orphan cards: quarantine the three cards unreachable from active choreography; retain every reachable card as a first-class interface card."
      - "Version pin: reconcile the unlabelled 12.15.0 style-guide outlier to the majority 12.38.0 value."
      - "External examples: relabel the absent a_nobel_en_zn anchors as external/historical; do not add repo-local examples."
      - "Archive path: ratify benchmark/reports/compiled-routing/ because the live writer and existing archives use it."
      - "Q3: admit RE-006-03, RE-006-07, and RE-006-08; the quick-reference half of RE-006-03 is deduped to RE-008-01."
      - "Q7: build the fresh resolver and dangling-entry check in sk-doc/shared/scripts using the existing path-resolution pattern."
---
# Feature Specification: hub-surface-drift-sweep

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-07-30 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

A naming migration and a hub consolidation each moved real things, and each left the prose behind. No gate caught it, because a broken prose path is not a broken router path — twelve of these findings survived a structurally clean hub check with zero warnings.

The shapes repeat. In the code hub, two surface documents carry a human-readable reference map listing flat filenames alongside a machine resource map with the correct nested paths, so the two halves of one document disagree and the reader gets the wrong half. Shared routing prose and a debugging checklist point at retired packet locations. Eight motion references and assets anchor their examples to an external tree that does not exist in this repository, and the library version is pinned to one value in one file and another value in five, with nothing marking either as historical.

In the design hub, four active documents still assign work to lanes the registry retired, three procedure cards describe a subworkflow that no choreography reaches, the packet README and its own workflow document disagree about how many cards exist, and one document declares three always-loaded resources against a default of one.

In the git hub, the quick reference — the document an agent reads when it needs a worktree *right now* — prescribes a branch shape the allocator forbids and the constitution calls permitted-but-non-conformant.

On the install surface, two entries dangle into a directory the hub consolidation removed. Confirmed at authoring: one guide entry and one install script, both unresolvable, so the master installer's path for that tool is broken and the README's file counts are wrong in both directions.

### Purpose

Every path a document names resolves, every count a document states is derived from what is on disk, and no document assigns work to an owner the registry no longer has.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Prose-versus-machine resource-map disagreement inside the two code-hub surface documents.
- Retired packet locations in shared routing prose and the universal debugging checklist.
- Motion reference and asset drift: external example anchors, a broken sibling path, inconsistent version pins, stale cross-reference labels.
- Design-hub ownership language, orphaned procedure cards, cardinality disagreement, and the always-loaded-versus-default resource contradiction.
- The git-hub worktree recipes across the quick reference and four further resources.
- The install surface: two dangling entries, the installer path they break, and the counts stated in both directions.
- The archive-path ratification for benchmark output.
- Two durable checks: a repo-wide relative-link resolver over skill markdown, and a dangling-entry check over the install surface with counts derived from the directory rather than retyped.
- The three registry-supplementary findings routed here. **[OPERATOR-DECISION: Q3 — supplementary findings]**

### Out of Scope

- The git-hub remote-branch policy document. Both supplementary findings touching it are owned by the routing-and-hook phase, deliberately: one file gets one owner, and one of the two is a safety-contract claim needing a live reproduction this phase is not set up to run.
- Canon and template rules themselves — this phase applies them; the canon phase changes them.
- Repointing a dangling symlink at a target that has not been verified to exist. Verify first, then repoint.
- Rewriting the machine resource maps. In the code-hub documents the machine half is correct; the human half moves.

### Findings in scope — the 17 registry findings

| ID | Sev | Primary surface | Claim | Verification status at authoring |
|----|-----|-----------------|-------|----------------------------------|
| RE-002-01 | P1 | `sk-design/sk-design-interface/` | Active guidance still names retired lane owners | Unverified — **confirm first**, least-verified group in the program |
| RE-002-03 | P1 | `sk-design/sk-design-md-generator/SKILL.md` | Declares three always-loaded resources against a default of one | Confirmed by synthesis |
| RE-002-04 | P2 | `sk-design/sk-design-interface/procedures/` | Orphan procedure cards preserve a retired subworkflow | Unverified — **confirm first**; open question below |
| RE-002-05 | P2 | `sk-design/sk-design-interface/README.md` | Procedure cardinality disagrees across packet documents | Unverified — **confirm first**; expect the numbers to have moved |
| RE-002-06 | P2 | `sk-code/sk-code-webflow/SKILL.md` | Human reference map lists filenames that do not exist | Confirmed by synthesis |
| RE-002-07 | P2 | `sk-code/sk-code-opencode/SKILL.md` | Human reference map uses retired path shapes | Unverified — confirm in T001 |
| RE-002-08 | P2 | `sk-code/shared/references/smart-routing.md` | Shared routing prose disagrees with packet paths | Unverified — confirm in T001 |
| RE-002-09 | P2 | `sk-code/shared/references/universal-debugging-checklist.md` | Links to retired packet locations | Unverified — confirm in T001 |
| RE-002-10 | P2 | `sk-code/sk-code-webflow/references/animation/quick-start.md` | Broken sibling path | Unverified — confirm in T001 |
| RE-002-11 | P2 | `sk-code/sk-code-webflow/references/animation/` | Examples anchored to an external tree absent from this repository | Unverified — confirm in T001; open question below |
| RE-002-12 | P2 | `sk-code/sk-code-webflow/references/html/style-guide.md` | Version pins inconsistent across files | Unverified — confirm in T001; open question below |
| RE-002-13 | P3 | `sk-code/sk-code-webflow/references/` | Cross-reference labels retain old filenames | Unverified — confirm in T001 |
| RE-008-01 | P1 | `sk-git/references/quick-reference.md` | Prescribes a branch shape the allocator forbids | Confirmed verbatim by synthesis |
| RE-010-01 | P1 | `sk-doc/sk-create-benchmark/references/skill-benchmark/` | Canon archive path differs from the live writer's | Unverified — the synthesis reads this as ratification, not repair; open question below |
| RE-010-02 | P1 | `.opencode/install-guides/README.md` | Inventory contains a dangling guide entry | **Confirmed live at authoring** — the entry is unresolvable |
| RE-010-03 | P1 | `.opencode/install-guides/install-scripts/install-all.sh` | The master installer invokes a missing script | **Confirmed live at authoring** — the script entry is unresolvable |
| RE-010-04 | P2 | `sk-code/benchmark/README.md` | Preserves obsolete standalone artifact guidance | Unverified — confirm in T001 |

### Findings in scope — registry-supplementary

These three iteration-6 entries sit in the registry's `repeated[]` bucket, outside the 74, because they collided on a file-plus-title dedupe rather than on content. **Each is confirm-first with an explicit re-verify flag.** Marked `§`.

| ID | Sev | Primary surface | Claim | Judgment |
|----|-----|-----------------|-------|----------|
| RE-006-03 § | P1 | `sk-git/assets/worktree-checklist.md`, `sk-git/references/{shared-patterns,large-reorg-playbook,finish-workflows}.md` | Linked assets and references present the retired branch shape and direct branch-creation commands as normal recipes, against an allocator-and-owner-first grammar | **Admitted with a partial dedupe.** The finding also names the quick reference, which is already scheduled as `RE-008-01` — that file is repaired once, under the scheduled ID. The four *other* files are genuinely new and are what this supplementary item adds. See dispositions |
| RE-006-07 § | P2 | `sk-git/README.md`, `sk-git/SKILL.md`, `sk-git/manual-testing-playbook/` | Version metadata, scenario counts and category counts disagree with the current playbook inventory; the package map omits a documented integration | Admitted — genuinely new. Counts must be derived from the directory, not retyped |
| RE-006-08 § | P2 | `sk-git/references/gitkraken-mcp-integration.md` | Two sections describe the same tool's side effects differently; a tool count is frozen from a dated capture in a document that says the surface must be re-verified | Admitted — genuinely new. Resolve the behaviour from the current tool surface, then make both sections agree |

**Scope-table total for this phase: 17 + 3 = 20 items.**

### Dispositions inside this phase

| Item | Disposition |
|------|-------------|
| The quick-reference half of `RE-006-03` | **Duplicate of scheduled `RE-008-01`.** Same file, same defect, same verbatim recipe. Repaired once, under `RE-008-01`; the supplementary item covers only the four other files. Recorded here so the overlap is visible rather than double-counted |
| `sk-git/references/remote-branch-policy.md` | **Not this phase's file.** Both supplementary findings touching it are owned by the routing-and-hook phase, one of them safety-relevant. This phase does not edit it |

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-code/sk-code-webflow/SKILL.md` | Modify | Human reference map matched to the machine map and to disk |
| `.opencode/skills/sk-code/sk-code-opencode/SKILL.md` | Modify | Same treatment |
| `.opencode/skills/sk-code/shared/references/{smart-routing,universal-debugging-checklist}.md` | Modify | Retired packet locations repointed |
| `.opencode/skills/sk-code/sk-code-webflow/references/animation/**` | Modify | Sibling path, example anchors, cross-reference labels |
| `.opencode/skills/sk-code/sk-code-webflow/assets/animation/**` | Modify | Example anchors |
| `.opencode/skills/sk-code/sk-code-webflow/references/html/style-guide.md` | Modify | Version pin resolved or labelled historical |
| `.opencode/skills/sk-code/sk-code-webflow/references/performance/third-party.md` | Modify | Version pin consistency |
| `.opencode/skills/sk-code/benchmark/README.md` | Modify | Obsolete artifact guidance removed |
| `.opencode/skills/sk-design/sk-design-interface/{README.md,SKILL.md,procedures/**,*.md}` | Modify | Lane ownership, cardinality, orphan cards per the ruling |
| `.opencode/skills/sk-design/sk-design-md-generator/SKILL.md` | Modify | Always-loaded resources matched to the default |
| `.opencode/skills/sk-git/references/quick-reference.md` | Modify | Allocator recipe and owner-first grammar |
| `.opencode/skills/sk-git/assets/worktree-checklist.md` | Modify | Same, plus legacy examples explicitly labelled |
| `.opencode/skills/sk-git/references/{shared-patterns,large-reorg-playbook,finish-workflows}.md` | Modify | Same |
| `.opencode/skills/sk-git/{README.md,SKILL.md}` | Modify | Counts derived from the playbook inventory; package map completed |
| `.opencode/skills/sk-git/references/gitkraken-mcp-integration.md` | Modify | Contradiction resolved; frozen count replaced with a verification date and a reproducible check |
| `.opencode/skills/sk-doc/sk-create-benchmark/references/skill-benchmark/{serving-snapshot-schema,skill-benchmark-storage-guide}.md` | Modify | Archive path ratified to the live writer's location |
| `.opencode/install-guides/{README.md,MCP - Chrome Dev Tools.md}` | Modify | Dangling entry repointed after target verification; counts derived |
| `.opencode/install-guides/install-scripts/{install-all.sh,install-chrome-devtools.sh}` | Modify | Installer path repaired after target verification |
| `.opencode/skills/sk-doc/shared/scripts/` | Create or consume | Link resolver and count-derivation helper. **[OPERATOR-DECISION: Q7 — shared tooling ownership]** |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every finding is confirmed against HEAD before it is edited, with the design-hub ownership group confirmed first | `tasks.md` T001 produces a per-ID disposition; the design-hub group and the three supplementary items are dispositioned before their lanes start |
| REQ-002 | A repo-wide relative-link resolver runs over skill markdown **before** any edit, so the starting failure count is real | The pre-edit count is recorded; the post-edit count is reported as a delta |
| REQ-003 | Both dangling install entries are resolved, and no symlink is repointed at an unverified target | A dangling-entry check returns zero; the replacement targets were confirmed to exist before repointing |
| REQ-004 | The master installer runs its help or dry-run path, and the tool-specific path, without invoking a missing script | Both invocations succeed |
| REQ-005 | Every count stated on the install surface and in the git hub is derived from the directory, not retyped | A count assertion compares the stated number with what is on disk |
| REQ-006 | The packet validates clean | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this folder> --strict` exits 0 with Errors: 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | In each code-hub surface document, every path named by the human map exists and appears in the machine map | A prose-versus-machine drift check over both files returns zero mismatches |
| REQ-008 | The design-hub cardinality agrees across the packet's own documents and the files on disk | README count equals workflow-document count equals the non-quarantined files on disk |
| REQ-009 | No active design-hub document assigns work to a lane the registry does not have | Grep for the retired lane names in active documents returns zero |
| REQ-010 | Every worktree recipe in the git hub uses the allocator and the owner-first grammar; any retained legacy example is explicitly labelled legacy | Grep for the retired branch shape returns only labelled legacy examples |
| REQ-011 | The four open forks are answered before the edits they govern, not during | Each has a recorded answer with its rationale |
| REQ-012 | The three supplementary findings each reach a terminal state, individually verified | Per-ID disposition with its own evidence line; no batch edit |
| REQ-013 | No no-regression claim predates the fleet-gate re-baseline captured by the first phase | The claim cites that recorded baseline |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The relative-link resolver's failure count over skill markdown is reported as a delta from a recorded pre-edit number, and the paths named by this phase's findings are all resolved.
- **SC-002**: Zero dangling entries on the install surface; both installer paths run.
- **SC-003**: Zero prose-versus-machine mismatches in the two code-hub surface documents.
- **SC-004**: Design-hub cardinality agrees across README, workflow document and disk.
- **SC-005**: Every git-hub worktree recipe uses the allocator, or is labelled legacy.
- **SC-006**: Each of the 20 scope items ends in exactly one state: repaired, stale-finding, already-fixed, or deferred-with-reason.
- **SC-007**: `validate.sh --strict` reports Errors: 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The canon phase's structure rulings | Some conformance edits cannot land | Soft block; the link-rot and install lanes proceed regardless |
| Dependency | The first phase's fleet-gate re-baseline | No-regression claims unfalsifiable | REQ-013 |
| Dependency | Another track's link resolver, if it lands first | Two near-identical validators ship | **[OPERATOR-DECISION: Q7]** — consume rather than rewrite |
| Risk | The design-hub findings have partially moved with the consolidation | High — the least-verified group in the program | Confirmed first; expect the cardinality numbers specifically to have changed |
| Risk | Repointing a symlink at a target that also does not exist | Med | Verify the replacement target before repointing; the check runs after |
| Risk | The version-pin fork is answered by guessing | Med | It is an explicit fork with a recorded answer; a deliberate compatibility fixture must be labelled, not silently bumped |
| Risk | Quarantining orphan cards deletes something still reachable | Med | Check reachability before quarantining; a card reachable from any choreography is canonicalised, not quarantined |
| Risk | The link resolver reports noise across the whole tree and swamps the phase's own findings | Med | Report the phase's scoped subset separately from the repo-wide count |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The relative-link resolver must complete over all skill markdown fast enough to run on every later phase — target under a minute.

### Security
- **NFR-S01**: The dangling-entry check must not follow symlinks outside the repository root when resolving targets.

### Reliability
- **NFR-R01**: Both introduced checks must fail on an unreadable input rather than skipping it silently, and must report how many entries they examined.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A link that resolves only case-insensitively: treated as a failure, because the tree is shared across case-sensitive filesystems.
- An anchor-only link and an external URL: excluded from the resolver by design, and the exclusion is stated so the count is interpretable.
- A count that is legitimately a subset (a curated list, not an inventory): allowed only with an explicit marker saying so.

### Error Scenarios
- A symlink whose replacement target is also missing: the repoint is blocked and the item is escalated rather than swapped.
- A procedure card reachable from a choreography the finding did not check: canonicalise instead of quarantine, and record the reachability evidence.
- The installer's dry-run path unavailable: run the tool-specific path and record that the master path could not be exercised.

### State Transitions
- Partial completion of the sweep: the resolver's delta is reported per lane, so a partially-swept tree is visible rather than averaged away.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 17/25 | ~35 files across four skill roots and the install surface; volume, not depth |
| Risk | 9/25 | Documentation and two symlinks; the installer path is the only executable surface |
| Research | 11/20 | Four genuine forks to answer plus the least-verified finding group in the program |
| **Total** | **37/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

No open questions remain. The four implementation forks and the two operator rulings were resolved before content edits:

| Fork | Resolution | Evidence |
|---|---|---|
| Orphan procedure cards | Quarantine only the three cards unreachable from active choreography; retain all seven reachable cards as interface cards | `SKILL.md:197-203`; reachability sweep recorded in `implementation-summary.md` |
| Version pin | Reconcile the unlabelled `12.15.0` outlier to the majority `12.38.0` pin | Five majority files versus `references/html/style-guide.md:305` |
| External examples | Relabel `a_nobel_en_zn/2_javascript/` examples as external/historical | The referenced tree is absent from this repository |
| Archive path | Ratify `benchmark/reports/compiled-routing/` as the canonical archive path | `render-serving-snapshot.cjs:122`; existing archives in the same directory |
| Q3 supplementary findings | Admit RE-006-03, RE-006-07, and RE-006-08; dedupe only the quick-reference half of RE-006-03 | Operator ruling in the BUILD brief |
| Q7 shared tooling | Build both checks in `sk-doc/shared/scripts/` | Operator ruling in the BUILD brief; existing resolver pattern read first |

The first phase's task receipt supplies the fleet-gate baseline as `11/11 clean`; this phase will cite it and will not claim against a remembered number.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Spec**: See `../spec.md`
