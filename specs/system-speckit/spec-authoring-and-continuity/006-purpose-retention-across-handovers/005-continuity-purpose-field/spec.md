---
title: "Feature Specification: Phase 5: continuity-purpose-field"
description: "The _memory.continuity record has no purpose field, its reader drops one on read and the Goal facet shows the next action. This phase adds an optional packet_purpose copy that the save writer refreshes from the packet's spec docs, and puts it first in the Goal facet."
trigger_phrases:
  - "continuity purpose field"
  - "phase 5 continuity purpose field"
  - "packet_purpose continuity field"
  - "goal facet packet purpose"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 5: continuity-purpose-field

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-11-13 |
| **Branch** | `worktrees/371-purpose-retention-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 5 |
| **Predecessor** | 004-compaction-purpose-line |
| **Successor** | None |
| **Handoff Criteria** | A `--full-auto` save writes `packet_purpose` into the leaf block, the runtime run prints `Tests  61 passed (61)`, the save writer run prints `Tests  41 passed (41)` and both packages build and typecheck with exit 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Carry a packet's purpose across handovers and compactions specification.

**Scope Boundary**: The `_memory.continuity` record contract, the save writer that fills it, the Goal facet and the opt-in snapshot that rewrites the block. No change to the resume brief, the relaunch note, the compaction recovery, the scaffold, the template or the resume ladder.

**Dependencies**:
- Child 004 must ship first. This phase imports `resolvePacketPurpose` and `formatPacketPurpose` from `runtime/lib/spec/packet-purpose.ts` and does not redefine them.

**Deliverables**:
- An optional `packet_purpose` field in the continuity record, its reader, validator, serializer and byte budget
- The save writer setting that field on every continuity write
- A Goal facet that lists the purpose before the next safe action
- Five new tests in three files and two short doc updates
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
The parent exists to keep a packet's problem, purpose and user need in front of the next session across relaunch hops and compactions, because the purpose is written once in `spec.md` and no hop reads it back.

Locally, the `_memory.continuity` block that a save writes into a leaf's `implementation-summary.md` carries the next action and the state of the work and nothing about why the work exists. The record type in `runtime/lib/continuity/thin-continuity-record.ts` has no purpose field, its reader builds the record from known keys only, so a hand-added `packet_purpose` key is dropped on read and lost on the next rewrite, and the facet titled Goal is filled from `next_safe_action`. All runtime paths here are under `.skilled/skills/system-spec-kit/`. The measurement below shows all three on this phase's parent packet.

### Purpose
The continuity block a save writes names the packet's purpose in one line copied from its spec docs, and the Goal facet built from that block leads with the purpose and keeps the next safe action beside it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
The script reads the parent packet's `implementation-summary.md` through the built continuity reader, prints the record keys and the Goal facet, then adds a `packet_purpose` line to the block in memory and reports what the reader and a rewrite keep. It writes no file.
```text
$ node specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/005-continuity-purpose-field/scratch/measure-continuity-purpose.mjs .skilled/skills/system-spec-kit/runtime specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers; echo "EXIT=$?"
read.ok=true bytes=1220
keys=packet_pointer,last_updated_at,last_updated_by,recent_action,next_safe_action,blockers,key_files,session_dedup,session_ref,completion_pct,open_questions,answered_questions
goal=["Plan a build packet for the read-side purpose carry and the create.sh fix"]
probe.ok=true errors=0 has_packet_purpose=false
rewrite.ok=true kept_in_markdown=false
EXIT=0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Add an optional `packet_purpose` string to the continuity record. The reader keeps a non-empty value of at most 512 characters after whitespace collapse and drops any other value without failing the record. The serializer writes it after `next_safe_action`, and the budget compaction drops it together with `session_ref`.
- Set `packet_purpose` in the save writer on every continuity write, from `resolvePacketPurpose` on the leaf the save writes into, formatted with `formatPacketPurpose`. Leave it out when the helper returns null, and never carry an old copy forward.
- Re-export the two helper functions from `runtime/api/index.ts`, because code under `runtime/cli` reaches the runtime only through `@spec-kit/runtime/api`.
- Lead the Goal facet with the purpose and keep the next safe action as its second item, and have the opt-in snapshot carry the stored value and pass it to the facets.
- Add five tests and name the field in the save help text and the continuity README.

### Out of Scope
- The resume ladder result - it gains no purpose field because its one non-test consumer, the snapshot, reads only the restore counts and gets the purpose from the record it already reads.
- The `implementation-summary.md` template - the field is writer-owned and optional, like `session_ref`, which the template does not ship either.
- The payload normalizer in `runtime/cli/utils/input-normalizer.ts` - it reads named fields only, so a session cannot type `packet_purpose` into a save, and its unknown-field check already warns that the key is ignored.
- A migration or backfill - the field is optional, and each later `--full-auto` save that writes continuity adds it.
- The resume brief, the relaunch note, the compaction recovery and the parent scaffold check - children 002, 003, 004 and 001.

### Files to Change

All paths are under `.skilled/skills/system-spec-kit/runtime/`.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `lib/continuity/thin-continuity-record.ts` | Modify | The field on the type and the facet input, its size limit and normalizer, its place in the serialized block, the budget drop and the Goal facet |
| `cli/core/workflow.ts` | Modify | Import the helper, resolve and format the purpose for the leaf, write it with the writer-owned fields, keep it on the write plan |
| `api/index.ts` | Modify | Re-export `resolvePacketPurpose` and `formatPacketPurpose` |
| `lib/continuity/authored-continuity-snapshot.ts` | Modify | Read the stored record once before the facets, pass its purpose to the facets and carry it in the rewrite |
| `cli/continuity/generate-context.ts` | Modify | One help-text bullet that says the field is writer-owned |
| `lib/continuity/README.md` | Modify | One bullet that names the field |
| `tests/thin-continuity-record.vitest.ts` | Modify | Two tests: the round trip and Goal order, and an over-long value dropped |
| `cli/tests/save-continuity-write.vitest.ts` | Modify | Two tests: a parent-targeted save writes the inherited purpose into the leaf, and a stale copy is removed |
| `tests/authored-continuity-snapshot.vitest.ts` | Create | One test: the snapshot keeps the stored purpose and leads Goal with it |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The reader keeps a valid `packet_purpose` through a write and a read, and drops an invalid one while the rest of the block still loads | The tests `keeps the purpose line through a write and a read, and leads the Goal facet with it` and `drops a purpose that is not one short line and keeps the rest of the block` pass, and the probe prints `has_packet_purpose=true` and `kept_in_markdown=true` after the build |
| REQ-002 | A `--full-auto` save that writes continuity sets `packet_purpose` from the helper for the leaf it writes, including a leaf reached from a phase parent, and removes a stored copy when the helper returns null | The tests `copies the nearest authored purpose into the leaf a parent-targeted save reaches` and `removes a stored purpose copy once no purpose is authored` pass |
| REQ-003 | No existing block fails to load or save because of the change | The baseline runs in `plan.md` section 5 pass unchanged, with 58, 39, 106 and 171 passing tests before and 61, 41, 109 and 173 after |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The Goal facet lists the purpose first and the next safe action second when both exist, and the next safe action alone when no purpose is stored | The record tests above assert both orders, and the snapshot test `keeps the stored purpose copy and leads the Goal facet with it` passes |
| REQ-005 | Both packages build, typecheck and lint clean, and the API boundary check passes | `npm --prefix $RT run build` and `npm --prefix $RT/cli run build` exit 0, both typecheck commands print nothing and exit 0, eslint exits 0 and `check-api-boundary.sh` prints `PASS` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: After `npm --prefix .skilled/skills/system-spec-kit/runtime run build`, the Measured Behavior command prints `probe.ok=true errors=0 has_packet_purpose=true` and `rewrite.ok=true kept_in_markdown=true` where it printed `false` for both.
- **SC-002**: The runtime run prints `Tests  61 passed (61)` and the save writer run prints `Tests  41 passed (41)`, up from 58 and 39.
- **SC-003**: `git status --short` lists only the nine files in the Files to Change table. The rebuilt `dist` folders are ignored by git.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Child 004's `runtime/lib/spec/packet-purpose.ts` | Without it the API re-export, the writer and every test fail to build | Build this phase only after 004 has shipped. The Definition of Ready in `plan.md` checks for both exports |
| Risk | Narrow value. With 002 and 004 built, the resume brief reads `spec.md` and the compaction recovery calls the helper live. No hook or command reads the continuity block into a model automatically, and the one code path that renders the Goal facet, the opt-in snapshot, finds a spec folder only in `.opencode/specs/` paths, so it never runs in this repository. What this field alone adds is the purpose sitting in the block beside the next action, for a session, agent or person that opens the block and not `spec.md` | High | Keep the change minimal: no ladder field, no template change, no migration and no backfill. Report the narrow value plainly so the operator can drop the phase |
| Risk | A stale copy. The writer refreshes the field only on a `--full-auto` save that writes continuity. A save without continuity fields, a plan-only save or a hand edit of `spec.md` leaves the old line until the next such save | Medium | `spec.md` stays the source, and every surface that 002 and 004 build reads it live. The field is labelled as the packet's or the parent's purpose by the helper's formatter |
| Risk | A bad stored value could fail a save or a resume | Low | The reader drops an invalid value instead of reporting an error, the field is never carried, and the budget compaction drops it before it trims the status lists. The dry run found no block that crosses 2,048 bytes with the field, see `plan.md` section 5 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Open question: the research held this field and the operator chose to build it. Given the narrow value in the risk table, does the operator still want it built after 002 and 004 ship, or dropped?
- Open question: the authored snapshot already drops `session_ref` when it rewrites the block, and its spec-folder detection matches only `.opencode/specs/` paths. Both are outside this phase. Should a separate packet fix them?
- Does the stored line name where the purpose came from? Decision: yes. The writer stores the helper's formatted line, so an inherited purpose reads `Parent purpose (<parent folder>): ...` and a goal fallback reads `Goal objective: ...`. One string keeps the record flat.
- Does a save aimed at a phase parent write the parent's own purpose? Decision: no. Such a save writes the leaf it descends to, and the helper runs on that leaf, returning the leaf's purpose or, when it has none, the nearest phase parent's.
<!-- /ANCHOR:questions -->

---
