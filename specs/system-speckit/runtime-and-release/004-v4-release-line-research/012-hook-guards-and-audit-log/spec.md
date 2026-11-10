---
title: "Feature Specification: Phase 12: hook-guards-and-audit-log"
description: "The ask-surface guard misreads numbered menus, two Stop hooks block on stdin with no deadline, its send-back-once rule means four things across runtimes, and dispatch-audit logs scatter into nested folders. This phase fixes all four."
trigger_phrases:
  - "hook guards and audit log"
  - "phase 12 hook guards and audit log"
  - "ask surface guard menu detector"
  - "dispatch audit log root"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 12: hook-guards-and-audit-log

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-08 |
| **Branch** | `worktrees/334-v4-release-remediation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 12 of 17 |
| **Predecessor** | 011-spec-kit-doc-drift |
| **Successor** | 013-agents-md-delivery-budget |
| **Handoff Criteria** | Hook suites hold their baseline and the child-mode failure set is unchanged |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the v4 release line remediation specification.

**Scope Boundary**: Verified findings V44, V45, V46 and V47 from `../research/research.md` section 2.

**Dependencies**:
- None. The hook tree shares no file with phases 009 to 011.

**Deliverables**:
- A menu detector that accepts `1.` and multi-digit labels and ignores how-to lists.
- Stop hooks that read stdin through the shared deadline reader.
- One send-back-once contract: at most one send-back per operator message.
- A dispatch-audit log always rooted at the repository top level.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The ask-surface guard misses a menu numbered `1.` or one with a tenth option and fires on a `1)` how-to list that ends in an unrelated question. The Claude ask-surface Stop hook and the Codex and Devin advisory Stop hooks block on `readFileSync(0)`, so a runtime that holds stdin open hangs the turn. "Sent back once" is keyed four different ways, so OpenCode and dsh can send the same operator turn back repeatedly. Dispatch-audit adapters write the log under whatever folder the session is in, which planted `.skilled/logs` trees inside spec packets.

### Purpose
Every runtime's guard behaves the same way on the same turn, never hangs, and logs to one place.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ sed -n 37p .skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs
const OPTION_LINE = /^\s*(?:[-*+]\s+)?(?:\*\*|__)?\(?(?:([A-Ha-h])[).:]|([1-9])\))(?:\*\*|__)?\s+\S/;

$ sed -n 81,84p .skilled/hooks/ask-surface-guard/claude/ask-surface-stop.cjs
function readStdin() {
  try {
    return readFileSync(0, 'utf8');

$ rg -n "turnKey|markTurn" .opencode/plugins/ask-surface-guard.js .skilled/hooks/ask-surface-guard/dsh/ask-surface-guard.mjs
ask-surface-guard.js:102: core.markTurn(projectDir, `opencode:${sessionID}:${turn.messageId || turn.lastMessage}`, ...)
ask-surface-guard.mjs:107: const turnKey = `dsh:${agent?.session?.id ?? agent?.id ?? 'session'}:${turn}`;

$ find . -path ./node_modules -prune -o -type d -path "*/.skilled/logs" -print | grep -v "^./.skilled/logs$"
./specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/.skilled/logs
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Widen the option-line rule to `1.` and multi-digit labels, and require a choice question for numeric lists (V44).
- Move the Claude ask-surface Stop hook and `advisory-stop.cjs` onto the shared stdin deadline reader (V45).
- Key OpenCode and dsh send-back on the latest operator message (V46).
- Root every dispatch-audit adapter's log at the git top-level of its starting directory (V47).

### Out of Scope
- Deleting the stray `specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/.skilled/logs` - untracked and gitignored, so deletion is in the irreversible tier; recorded for the operator.
- The 27 OpenCode plugin tests that fail only under `AI_SESSION_CHILD=1` - a test-isolation trap the research downgraded; unchanged by this phase.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs` | Modify | Menu rule and the one-sentence contract |
| `.skilled/hooks/ask-surface-guard/fixtures/*.json` | Create | Three new fixtures |
| `.skilled/hooks/ask-surface-guard/claude/ask-surface-stop.cjs`, `lib/advisory-stop.cjs` | Modify | Deadline reader |
| `.opencode/plugins/ask-surface-guard.js`, `.skilled/hooks/ask-surface-guard/dsh/ask-surface-guard.mjs` | Modify | Operator-message key |
| `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` and the claude, codex, devin, pi adapters | Modify | Repo-rooted log path |
| Tests beside each, `.skilled/hooks/dispatch/README.md` | Modify | Coverage and the runtime table |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A Stop hook whose stdin stays open exits within its deadline and lets the turn end. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | `prose-menu-dotted.json` and `prose-menu-ten.json` fire, `howto-list-question.json` and every existing negative fixture do not. |
| REQ-003 | On OpenCode and dsh, a second prose menu without a new operator message is not sent back. |
| REQ-004 | A dispatch audited from a nested folder of a git repository is logged at `<top-level>/.skilled/logs/cli-dispatch-audit.log`. |
| REQ-005 | The hook suites keep every baseline pass and the child-mode failure set is unchanged. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each REQ has a test that fails on the old code and passes now.
- **SC-002**: Plugin, hook node and hook vitest suites hold or grow their pass counts with zero new failures.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `hook-adapter-shared.cjs` deadline reader | Async read changes hook flow | Fail-open kept; open-stdin test spawns the hook |
| Risk | A wider menu rule fires on summaries | Med | Numeric lists need a choice question; numbered-steps fixture stays negative |
| Risk | A repo-root lookup spawns git per audited call | Low | One `git rev-parse` per hook process, fallback to the start directory |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: A Stop hook never waits on stdin longer than the shared reader's deadline.

### Security
- **NFR-S01**: N/A: no input crosses a new trust boundary.

### Reliability
- **NFR-R01**: Every guard keeps failing open: an error ends the turn normally.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: an empty or invalid stdin payload ends the turn with no output.
- Maximum input: a ten-option menu fires.
- Failure path: git missing or a non-git directory logs under the start directory.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Sixteen files across two hook families and six runtimes |
| Risk | 15/25 | Stop hooks run at every turn end |
| Research | 4/20 | Evidence from the parent synthesis |
| **Total** | **33/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The send-back contract decision is in `decision-record.md`.
<!-- /ANCHOR:questions -->

---
