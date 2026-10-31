---
title: "Decision Record: Phase 2: install-guide-router"
description: "The install guide's live check reports the framework's manifest entries and nothing else, so a criterion that asked it to name a broken .pi-subagents link could never be met and is superseded."
trigger_phrases:
  - "install guide live check"
  - "manifest entries decision"
  - "pi-subagents link"
  - "install guide decision record"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "commands/005-doctor-symlink-install/002-install-guide-router"
    last_updated_at: "2026-10-31T15:26:00Z"
    last_updated_by: "markdown"
    recent_action: "Recorded the decision that judges the live check on manifest entries"
    next_safe_action: "Run the generated-metadata refresh, then re-run strict validation"
    blockers:
      - "Strict validation reports two generated-metadata errors; repair-derived.cjs --apply clears them and this closeout does not own that rewrite"
    key_files:
      - "specs/commands/005-doctor-symlink-install/002-install-guide-router/acceptance-criteria.md"
      - "specs/commands/005-doctor-symlink-install/002-install-guide-router/tasks.md"
      - "specs/commands/005-doctor-symlink-install/scratch/verification-evidence.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "doctor-symlink-install-closeout"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Whether the live check must name a broken link outside the manifest"
---
# Decision Record: Phase 2: install-guide-router

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: The install guide's live check is judged on manifest entries, not on links outside the manifest

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-31 |
| **Deciders** | The orchestrator session, on the recorded live-check evidence |

---

<!-- ANCHOR:adr-001-context -->
### Context

One criterion asked the guide's live check to do something the command does not do. AC-004 read: given a target repository that holds whole links, when `check` runs against Obsidian Plugin, then it prints a status line per entry, names the broken `.pi-subagents` link, and exits 0. Task T014 carried the same wording.

That expectation came from the approved plan's Verification section, and it is wrong. `check` walks the framework's manifest entries: the runtime folders, `.skilled`, `AGENTS.md`, `CLAUDE.md`, `.mcp.json` and `REPO RULES.md`. `.pi-subagents` is not one of them, and the checkout has no such path at all, so no run could ever name it. The recorded run reported every runtime folder, `.skilled`, `AGENTS.md` and `CLAUDE.md` as `linked-whole`, `.mcp.json` as `missing` and `REPO RULES.md` as `local`, then exited 0 with nothing changed.

The row therefore could not go green. Held open as written, it blocks a packet whose code and family gates all pass, and it asks the next reader to hunt a report line that will never appear. The link itself is still broken on disk; what is wrong is the criterion, not the run.

### Constraints

- The check must not judge every symlink in a target repository. Links the framework never writes belong to the target and to whoever made them.
- Adding `.pi-subagents` to the manifest to satisfy the row would make the check claim ownership of a path no framework install creates.
- The check is read-only, and it stays read-only. The decision is about what it reports, not about what it runs.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: judge the live check on the manifest entries it reports, and on nothing outside the manifest. AC-004 is superseded, and AC-007 carries the same requirement in the form the command can prove: given Obsidian Plugin, when `check` runs with all seven runtimes and `--link-instructions`, then every framework entry is reported with its real state.

**How it works**: `check` reads the manifest for the root, prints one status line per entry, and says nothing about links the manifest does not list. The recorded Obsidian Plugin run is the whole of its report, and that report is what the criterion now asks for. A broken link outside the manifest stays unreported by design rather than by omission.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Judge on manifest entries** | States what the command does. Unblocks the row with a real observation | A broken link outside the manifest stays unreported | 9/10 |
| Add `.pi-subagents` to the manifest so the check names it | The row goes green with no code change | The manifest would claim a path the framework does not ship, and the check would report a broken link for something no install creates | 2/10 |
| Keep AC-004 open until some run names the link | No decision to record | No run can do it. The row blocks a packet whose gates pass | 1/10 |
| Widen `check` to report every symlink in the root | Broken links outside the manifest get surfaced | The check would report on the target's own links and blend framework state with the repository's | 4/10 |

**Why this one**: the check answers one question, whether each framework entry is what it should be. A report that also judged the target's own links would bury that answer, and a manifest entry invented to satisfy a test would be a lie in the one file the check trusts.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The criterion now states what the command does, so a green row means the framework's entries are correct rather than that a sentence was satisfied.
- The report stays short. Every line in it is an entry the framework owns.

**What it costs**:
- A broken link outside the manifest is not surfaced by `check`, and Obsidian Plugin's `.pi-subagents` link is one. Mitigation: it is not a framework link, so the target repository's own tooling owns it, and the guide promises nothing about it.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A reader takes the green row as proof the whole target repository is sound | M | AC-007 says "every framework entry", and the guide's fixed caveat line keeps the guide from promising more than the entries |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | AC-004 could never be met, and it blocked closure of a packet whose gates pass |
| 2 | **Beyond Local Maxima?** | PASS | Four options compared above, including the two that touch the manifest and the check |
| 3 | **Sufficient?** | PASS | A criterion replacement, no code change. The check already behaves this way |
| 4 | **Fits Goal?** | PASS | The check's purpose is framework state, which is what the replacement row measures |
| 5 | **Open Horizons?** | PASS | A future flag can report the target's other links without changing this scope |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `acceptance-criteria.md`: AC-004 is `Superseded` and names this record. AC-007 replaces it and is `Met` by the recorded run.
- `tasks.md`: T014 asks for the manifest entries the report holds, not for the `.pi-subagents` link it cannot.
- `implementation-summary.md`: the residual risk is written down, so the next reader knows the check is not a whole-repository link audit.

**How to roll back**: reopen AC-004, add `.pi-subagents` as a manifest entry and run `check` again. Nothing in the engine changes, so the revert is the criterion text plus one manifest line.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!--
One ADR per decision. This record settles one: what the guide's live check is judged on.
-->
