---
title: "Decision Record: Phase 10: alignment-audit"
description: "Three decisions of the alignment audit: an independent re-audit before release, a changelog omission check that warns, and a narrowed playbook-corpus routing-gold list."
trigger_phrases:
  - "alignment audit decision record"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/015-quality-agnostic-gate/010-alignment-audit"
    last_updated_at: "2026-10-26T20:30:00Z"
    last_updated_by: "claude-sonnet-5-5"
    recent_action: "Recorded three decisions and the choices still open"
    next_safe_action: "Ask the operator about the two open routing prompts"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-010-alignment-audit"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Phase 10: alignment-audit

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Re-audit every fix before the release stage

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-26 |
| **Deciders** | The conductor, inside the operator's request of 2026-10-26 to check all ten questions |

---

<!-- ANCHOR:adr-001-context -->
### Context

The 28 first-round batches each reported their own success. Several of those reports described a command that passed for the batch while a gate elsewhere failed: the test move left a Hermes copy pointing at deleted paths, and the router edits left four hubs with stale manifests.

### Constraints

- A batch edits only its own files, so it cannot see a gate that reads another batch's files.
- A generator owns every mirror, so the repair for a mirror is a regeneration, not an edit.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: four reviewers re-check every fix against the working tree, and a release stage runs after the second fix round.

**How it works**: Each reviewer marks a finding `fixed` or `not_fixed` with the command output, and raises new findings with a rule and a mechanical or judgment fix. Findings that need a generator go to the release stage instead of a hand edit.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Re-audit, then release** | Catches cross-batch breakage and stale generated files | One extra round | 9/10 |
| Trust the batch handbacks | Fastest | The Hermes copy and the manifests would have shipped stale | 3/10 |

**Why this one**: it found nine problems that no single batch could see, and two of them failed a blocking gate.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- CODE-R01 and SKILL-16 were caught before a commit, where the pre-commit hook and the CI parity workflow would have refused it.
- Each ticked row in `tasks.md` rests on a re-run or a re-audit reading.

**What it costs**:
- An extra fix round and 11 more batches. Mitigation: the second round touched nine findings and most were mechanical.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A reviewer repeats a batch's claim | M | The final-state run in this phase re-ran the gates itself |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Two blocking gates failed after round 1 |
| 2 | **Beyond Local Maxima?** | PASS | Trusting the handbacks was the alternative |
| 3 | **Sufficient?** | PASS | One re-audit round fixed the nine new findings, and the ninth leaves one design question open |
| 4 | **Fits Goal?** | PASS | The operator asked whether everything is aligned |
| 5 | **Open Horizons?** | PASS | The same loop reuses for the next audit |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- The ledger in `tasks.md` records a round-1 task and a round-2 task for each finding the re-audit reopened.

**How to roll back**: Drop the re-audit stage and treat the first-round handbacks as final. That reopens CODE-R01 and SKILL-16.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: The changelog omission check warns and does not block

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, open to operator change |
| **Date** | 2026-10-26 |
| **Deciders** | The conductor |

---

<!-- ANCHOR:adr-002-context -->
### Context

Two released `sk-code-quality` entries name an internal scenario id and carry test counts, which the changelog contract forbids. Nothing automated caught the class, because `validate_document.py --type changelog` passed both files. Released entries cannot be edited.

### Constraints

- A blocking check would fail the two released entries and every other released entry with the same text.
- The contract text already states the rule, so the gap is detection.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: add a changelog-branch check to `validate_document.py` that reports an internal id and a test count as warnings.

**How it works**: `validate_changelog_omissions()` skips the frontmatter and any line that starts with `>`, which covers the spec-folder line. It matches `[A-Z]{2,4}-\d{3}` and a number followed by `cases`, `tests` or `PASS lines`. A warning keeps the exit code at 0.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Warn** | New entries see the rule, released entries stay valid | A warning can be ignored | 7/10 |
| Block | Stops the class | Fails released entries that cannot be edited | 3/10 |
| Do nothing | No code change | The class stays undetected | 2/10 |

**Why this one**: it makes the rule visible at authoring time without turning the published history red.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- `v1.4.0.0.md` now prints `changelog_internal_id` and the validator suite holds a positive and a negative case, `12 passed`.

**What it costs**:
- The two released entries keep their text. Mitigation: an erratum entry is the operator's call (tasks T040).

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A false positive on a ticket-like id in prose | L | The pattern needs two to four capitals and three digits, and the warning does not block |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Two released entries broke the rule undetected |
| 2 | **Beyond Local Maxima?** | PASS | Block, warn and nothing were weighed |
| 3 | **Sufficient?** | PASS | One function and two tests |
| 4 | **Fits Goal?** | PASS | The operator asked for changelogs aligned |
| 5 | **Open Horizons?** | PASS | The operator can raise it to a block later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `.skilled/skills/sk-doc/shared/scripts/validate_document.py` gains the function and its call in the changelog branch.
- `.skilled/skills/sk-doc/scripts/tests/test_changelog_validator.py` gains two cases.

**How to roll back**: Remove the function, its call and the two cases.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Narrow the routing-gold root list instead of exempting the fanout-stress files

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-26 |
| **Deciders** | The conductor |

---

<!-- ANCHOR:adr-003-context -->
### Context

The cli-external-orchestration playbook root sat in `routingGoldRoots`, which the corpus manifest reserves for homogeneous routing-oracle hubs. That hub holds 10 routing-gold files and 14 hermetic operator scenarios that carry no expected workflow mode. The 14 escaped the operator validator only because of the broad entry.

### Constraints

- The sk-create-manual-testing-playbook contract exempts routing-gold files, not hermetic scenarios.
- The routing-gold files must stay exempt.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: rewrite the 14 files into the five-section scenario shape and narrow `routingGoldRoots` to the routing-gold subfolders.

**How it works**: The manifest lists the subfolders that hold gold files, so the validator now checks the 14 operator scenarios. The package validator reports `operator=14 routing_gold_excluded=10`.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Rewrite and narrow** | The contract holds for every file | 14 files rewritten | 8/10 |
| Leave the broad exemption | No edit | A mixed hub hides 14 files from the validator | 3/10 |

**Why this one**: it fixes the cause, a manifest entry broader than its meaning, and leaves nothing outside the validator.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- `validate-playbook-package.cjs --package cli-external-orchestration` prints `PASS ... operator=14 routing_gold_excluded=10 violations=0`.

**What it costs**:
- The narrowing exposed one older warning, the missing result-persistence marker, which the root playbook now carries (tasks T019).

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A new gold folder is added and not listed | M | The package validator reports it as an operator file, so a miss fails loudly |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 14 files escaped the validator |
| 2 | **Beyond Local Maxima?** | PASS | An exemption was the alternative |
| 3 | **Sufficient?** | PASS | One manifest edit plus the rewrite |
| 4 | **Fits Goal?** | PASS | Playbooks align with the creation skill |
| 5 | **Open Horizons?** | PASS | The same rule fits the next mixed hub |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `playbook-corpus-manifest.json` lines 6 to 8 list the subfolders.
- The 14 `fanout-stress/*.md` files use sections 1 to 5.

**How to roll back**: Restore the manifest entry from `HEAD`. The rewritten files remain valid under either entry.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---
