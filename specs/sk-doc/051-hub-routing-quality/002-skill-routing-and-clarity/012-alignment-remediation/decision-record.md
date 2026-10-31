---
title: "Decision Record: Phase 12: alignment-remediation"
description: "Why a README the checkers misread carries a reasoned readme-check marker when only that README can say what a path is, instead of a checker rule."
trigger_phrases:
  - "alignment remediation decision record"
  - "readme-check marker disposition"
importance_tier: "normal"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/012-alignment-remediation"
    last_updated_at: "2026-10-28T23:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Recorded how the README dispositions shipped"
    next_safe_action: "Land the phase on main"
    blockers: []
    key_files:
      - "plan.md"
      - "acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0266-alignment-remediation-build"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 12: alignment-remediation

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: A Reasoned Marker Where Only the README Knows What a Path Is

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-28 |
| **Deciders** | The conductor of this phase, under the operator's standing direction to decide and verify at the end |

---

<!-- ANCHOR:adr-001-context -->
### Context

`plan.md` §5 gave every README the checkers misread a disposition of **rule**, meaning the checker changes and the README stays as it is. AC-015 holds the plan to that: no README may change only to satisfy a misreading. In practice, the misread tokens came in two kinds.

The first kind is a general token class: a filename template such as `v[version].md`, or a domain plural such as "four decision tests". A checker can recognise that kind in every README, so it got a checker rule and a test case.

The second kind is a path that only one README can explain. `seats/round-NNN/` is a folder the council writes at runtime. `benchmark-report.md` is a file a benchmark run creates inside another skill. The "two plugins" that reject by default count a behavior, not files. The text of such a path looks exactly like a missing repository path, so no checker rule can tell the two apart without being told.

### Constraints

- The checkers run in CI over every README, so a rule that waved through any unresolved path would hide real defects such as the four broken links this phase fixed.
- `check_readme_references.py` and `check_derived_readme_counts.py` already support an in-file exception, the `readme-check` block with `allow-ref` and `allow-count` lines. Each exception must give a reason, and an exception nothing matches fails as unused.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: A general token class gets a checker rule with a test case. A path or count that only its own README can explain gets a `readme-check` marker in that README, with the reason written beside it.

**How it works**: The reference checker treats a bracketed filename template as a template. The count checker accepts a category word between number and noun, and any word when the line names the folder it counts. Fourteen READMEs carry a marker whose reason says what the token really is. Three of them, cli-hermes, mcp-figma and mcp-obsidian, were planned as fixes. On reading, their unresolved paths turned out to be files outside this repository (`SOUL.md`, the FigCli `plugin/manifest.json` and an Obsidian vault's `data.json`), so they got markers too. Two READMEs held real defects and changed their text. The sk-create-diff README named `.sk-create-diff/` while the script writes `.create-diff/`. The plugin tests README cited two paths that do not resolve from its folder.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Checker rule for token classes, reasoned marker for one-README facts** | Each exception sits beside the text it excuses, with its reason, and fails once it goes stale | Fourteen READMEs gain a hidden comment block | 9/10 |
| A checker rule for every row, as the plan said | No README changes | The rule would have to accept any unresolved path that looks like output, which hides real broken links | 3/10 |
| A central allowlist file in the checker's folder | READMEs stay untouched | The reason sits far from the text, and a renamed README leaves a stale entry nobody sees | 5/10 |

**Why this one**: Only the marker keeps the checker strict for every other README while recording a reason the next reader can check.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Both README rows read `SUMMARY files=55 pass=55 fail=0`, and the checkers still flag a broken link anywhere else.
- Every exception names what the token is, so a reviewer can refute it.

**What it costs**:
- AC-015's "no README changed only to satisfy a checker misreading" no longer holds as written. Mitigation: AC-016 replaces it with the criterion this decision sets.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A marker outlives the token it excuses | L | Both checkers fail an exception that matches nothing |
| A marker hides a real defect | M | Each one carries a reason that names what the token is, and this phase checked each reason against the code that writes the path |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Two CI rows failed on these READMEs |
| 2 | **Beyond Local Maxima?** | PASS | Three options were compared above |
| 3 | **Sufficient?** | PASS | It uses the exception mechanism the checkers already ship |
| 4 | **Fits Goal?** | PASS | The phase's goal is green rows that still catch real defects |
| 5 | **Open Horizons?** | PASS | A new README with a real broken link still fails |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `check_readme_references.py` and `check_derived_readme_counts.py` gain the token-class rules and their test cases.
- Fourteen READMEs gain a `readme-check` block. The sk-create-diff README names the store the script writes, and the plugin tests README cites paths that resolve.

**How to roll back**: Delete the `readme-check` blocks and revert the two checker files. Both README rows then fail again on the same READMEs.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---
