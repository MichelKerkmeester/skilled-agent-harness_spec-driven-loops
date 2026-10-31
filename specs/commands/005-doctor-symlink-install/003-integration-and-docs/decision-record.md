---
title: "Decision Record: Phase 3: integration-and-docs"
description: "Each owner doc registers the two new doctor commands in the form that doc already uses, so AC-008 is recorded as superseded and a runnable-and-bridge-id criterion takes its place."
trigger_phrases:
  - "doctor command registration decision"
  - "advisor readme doctor commands"
  - "ac-008 superseded"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "commands/005-doctor-symlink-install/003-integration-and-docs"
    last_updated_at: "2026-10-31T15:45:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "ADR-001 recorded: AC-008 superseded, AC-010 carries the registration check"
    next_safe_action: "None — packet closed"
    blockers: []
    key_files:
      - "specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md"
      - ".skilled/skills/system-spec-kit/README.md"
      - ".skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/doctor-command-routing.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "doctor-symlink-install-build"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 3: integration-and-docs

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Owner docs register the new commands in the form each doc already uses

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-31 |
| **Deciders** | The orchestrator set the registration scope; this record carries the decision through the close. The operator may overturn it. |

---

<!-- ANCHOR:adr-001-context -->
### Context

AC-008 asked every one of three documents to name the runnable `/doctor:symlink` and `/doctor:install` lines: both owner READMEs and the advisor's doctor routing document. One of the three does. `.skilled/skills/system-spec-kit/README.md:562` and `:563` carry a row per command in the "Seven doctor commands wrap the checks this skill owns" table, which is the form that table uses.

The other two do not, and neither has a place to put a runnable line. The advisor README carries no per-command list. Its Doctor Command Routing section states the brief's shape generically, as `Also: /doctor:<command> <target>` at `.skilled/skills/system-skill-advisor/README.md:103`, and names one concrete command, `/doctor:setup`, because the fallback hardcodes that name. `rg -n '/doctor:symlink|/doctor:install' .skilled/skills/system-skill-advisor/README.md` exits 1. The routing document registers bridges by id, and its activation sentence at `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/doctor-command-routing.md:27` already names `command-doctor-symlink-*` and `command-doctor-install` beside `command-doctor-helper` and the `command-doctor-agents-md-*` bridges. The same document says at line 35 that the renderer reads a generated lookup of runnable strings, so a doctor bridge renders as `/doctor:git setup` and never as its raw id. Runnable lines are deliberately absent from that document; the ids are what it registers.

### Constraints

- Criterion ids are stable once written. AC-008 cannot be renumbered or redefined in place.
- A `Superseded` row must name an ADR, and the ADR must exist in this file, or the validator reads the waiver as an unmet criterion.
- The advisor README's generic `/doctor:<command> <target>` form is accurate: the brief does render that shape. Adding two concrete names to it would describe a fallback that names neither.
- The routing document's reader is the bridge deriver and the renderer's id lookup. Ids are its subject, so a runnable line there would contradict its own explanation at line 35.
<!-- /ANCHOR:adr-001-context -->

### Decision

**We chose**: record AC-008 as `Superseded`, citing this record, and add AC-010 to carry the registration check in the form each owner doc actually uses.

**How it works**: AC-010 asks the spec-kit README table to name both runnable commands and the advisor routing document to name both bridge ids, and it names one command per surface. The advisor README keeps its generic form and stays out of the criterion, because it has no per-command list to add to. Both sides of the registration are still checked; only the demand that all three documents carry the same shape is dropped.

### Alternatives Considered

| Option | Pros | Cons | Score |
|-------|------|------|-------|
| **Supersede AC-008 and add AC-010 in each doc's own form** | Keeps both registrations checked, holds each document to its own convention, states plainly why the three paths cannot agree | Three surfaces become two, so the advisor README carries no registration at all | 9/10 |
| Add runnable lines to the advisor README and the routing document | The original three-path `rg -l` would pass as written | The README would name two commands its fallback never names, and the routing document would print runnable strings next to its own line saying a bridge never renders as an id | 3/10 |
| Mark AC-008 `Met` on the spec-kit README alone | The quietest close | Claims three surfaces carry the lines when one does; an unbacked waiver is an unmet criterion | 2/10 |
| Leave AC-008 `Unmet` and close with an open criterion | Records the gap loudly | The packet cannot close, and the gap is in the criterion's wording, not in the work | 4/10 |

**Why this one**: the two registrations exist and are checkable. The criterion failed on a shape it imported from a third document, so the fix belongs in the criterion.

### Consequences

**Positive:**
- Both owner docs keep the form their readers already know: a runnable row per command in the spec-kit README table, a bridge id per bridge in the routing document's activation sentence.
- The table now tells a reader that seven doctor commands wrap spec-kit's checks, where it named five before this phase.

**Negative:**
- The advisor README names no registration for either command, so a reader of that file alone learns about them from the advisor's output, not from its docs.
- A reader looking for `/doctor:symlink` in the routing document finds `command-doctor-symlink-*` instead and has to follow the renderer note at line 35 to learn why.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A later edit adds a concrete command name to the advisor README's generic brief shape | M | The shape describes what the brief renders. Check the renderer before naming a command there |
| A reader treats the routing document's bridge ids as the whole registration | L | The spec-kit README carries the runnable rows, and both are named in AC-010 |
<!-- /ANCHOR:adr-001 -->
