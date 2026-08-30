---
title: "Feature Specification: Path Containment Follow-Ups"
description: "The repair write decides a path is safe by inspecting it, then writes through a handle that can point somewhere else: swapping a scanned directory for a symlink overwrites a file outside the tree. Prove the handle reaches what the scan classified, and retire a containment branch that has been shown to decide nothing."
trigger_phrases:
  - "path containment followups"
  - "repair scan to write gap"
  - "directory swap symlink"
  - "containment branch subsumed"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/046-path-containment-followups"
    last_updated_at: "2026-08-30T15:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored from two findings reproduced against the live tree after a fresh-model review"
    next_safe_action: "Plan the handle-identity check; the branch removal is a deletion"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp-server/scripts/repair-graph-metadata.mjs"
      - ".opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-parser.ts"
      - ".opencode/skills/system-spec-kit/scripts/tests/repair-write-symlink-refusal.sh"
      - ".opencode/skills/system-spec-kit/scripts/tests/graph-metadata-write-containment.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-30-path-containment-followups"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Path Containment Follow-Ups

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-30 |
| **Branch** | `skilled/v4.0.0.0` |
| **Handoff Criteria** | The repair write cannot reach a file the scan did not classify, and no containment branch remains that decides nothing |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Two packets closed on the same idea — prove membership rather than match a shape — and each left a
piece of it unproven.

**The repair write can still be redirected, by swapping a directory instead of a file.** The write
opens with `O_NOFOLLOW`, which refuses a symlink only at the final path component. Every parent
directory is still followed. Reproduced against the current tree:

```
ln -s $T/evil $T/real/pkt
writeExistingFileNoFollow("$T/real/pkt/graph-metadata.json", "REPAIRED")  -> WROTE
cat $T/evil/graph-metadata.json                                           -> REPAIRED
```

A file outside the scanned tree is overwritten and its previous content is gone. The existing
suite passes 5 of 5 against this, because every one of its cases swaps a file. The shape of the
defect is the one its own packet named: a property is established by inspecting a path, then acted
on through a handle that can point somewhere else by the time it is used.

**A containment branch was measured to decide nothing and kept anyway.** The write guard consults
two root sources: those discovered from the calling process, and those derived from the
destination. Every path the first accepts, the second also accepts — walking up from a destination
inside a configured root reaches the same workspace anchor. Removing the first leaves the suite at
8 of 8. A branch that changes no outcome is not a second layer; it is a claim that something is
being checked twice when it is not.

Related: the guard's remaining strength is narrow, and its own record already says so. One
`mkdir` of a directory named `.opencode` beside a destination flips the suite's own
"outside the workspace" case from refused to written. That is worth stating plainly in the packet
that owns the guard rather than leaving a reader to infer a boundary that is not there.

### Purpose

A write reaches only what was classified, and no guard claims a check it does not perform.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Proving the opened handle is the file the scan classified, rather than trusting the path.
- A test case that swaps a directory, which the current suite has no equivalent of.
- Removing the containment branch that was measured to change no outcome.
- Correcting the record on what the containment guard actually bounds.

### Out of Scope
- The third sibling finding, where lexical containment can accept an in-root symlink redirecting resume reads. Same family, different surface, and two stricter variants were already measured as worse — it needs its own packet, not a fold-in here.
- Widening the containment guard into a real security boundary. Its own record concedes the threat model; a wider guard was measured and refused legitimate writes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp-server/scripts/repair-graph-metadata.mjs` | Modify | Verify handle identity against the scan-time observation before writing |
| `scripts/tests/repair-write-symlink-refusal.sh` | Modify | Add the directory-swap case the suite lacks |
| `mcp-server/lib/graph/graph-metadata-parser.ts` | Modify | Remove the root source that changes no outcome |
| `scripts/tests/graph-metadata-write-containment.sh` | Modify | Keep the suite green on the reduced guard, and pin the mkdir boundary explicitly |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A write cannot reach a file the scan did not classify, including when a parent directory is replaced between the scan and the write. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | The containment guard consults only root sources that change an outcome. |
| REQ-003 | The record states what the containment guard bounds and what defeats it, so no reader infers a boundary it does not provide. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The directory-swap reproduction above is refused, and the file outside the tree is unchanged.
- **SC-002**: The containment suite passes with one root source, and a case pins the condition that defeats the guard.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | An identity check that is too strict refuses legitimate repair across the symlinked tracks | High | Those tracks are the case that broke a previous stricter attempt; cover them in the suite before landing |
| Risk | Removing a root source looks like weakening a guard | Med | It was measured to change no outcome; the measurement belongs in the packet, not in a commit message |
| Dependency | The scan already records enough about each candidate to compare against | Med | If it does not, the scan must carry the observation forward rather than the write re-deriving it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The identity check adds at most one stat per file already being opened.

### Security
- **NFR-S01**: The write refuses rather than falling back when identity cannot be established.

### Reliability
- **NFR-R01**: A legitimate repair inside a symlinked track still succeeds.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Final component swapped to a symlink: already refused; must stay refused.
- Parent directory swapped to a symlink: the case this packet exists for.
- A track that is legitimately a symlink into a sibling repository: must still be writable.

### Error Scenarios
- The file disappears between scan and write: refuse, do not create.
- Identity cannot be determined: refuse, do not write.

### State Transitions
- A repair run interrupted after some files: re-running must be safe.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Two source files, two suites |
| Risk | 16/25 | The write destroys previous content when it lands wrong |
| Research | 4/20 | Both findings reproduced before authoring |
| **Total** | **28/70** | **Level 2** |

The deterministic scorer returned Level 0 on lines and file count. Level 2 was chosen because
REQ-001 is a confirmed overwrite of a file outside the scanned tree, and the evidence that it is
closed belongs in a document that gates closure rather than in a commit message.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should the scan carry its observation forward to the write, or should the write re-establish identity independently? Carrying it forward is cheaper; re-establishing is harder to get subtly wrong.
- The third sibling finding needs a packet. Open it now while the family is in view, or when someone next touches resume?
<!-- /ANCHOR:questions -->
