---
title: "Decision Record: Phase 9: gate3-and-continuity-root"
description: "Decisions taken without the operator for the Gate 3, project-root, install-probe and create.sh fixes, with the workflow deviations this phase made."
trigger_phrases:
  - "gate3 and continuity root decisions"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/004-v4-release-line-research/009-gate3-and-continuity-root"
    last_updated_at: "2026-11-09T12:00:00Z"
    last_updated_by: "remediation-orchestrator-b"
    recent_action: "Recorded the phase decisions"
    next_safe_action: "Commit the phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-09-047-remediation-b"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 9: gate3-and-continuity-root

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Workflow deviations under an absent operator

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-09 |
| **Deciders** | Remediation orchestrator B (operator unavailable, goal decision G5) |

---

### Context

`/speckit:plan:auto` step 5 dispatches four `@context` explorers through the Task tool, and both workflows end in a continuity save through `generate-context.js`. This orchestrator runs as a leaf that may not dispatch native agents, and the goal reserves code writes for CLI workers.

### Constraints
- Goal G4: code writes only through cli-codex Luna or DeepSeek workers.
- The runtime forbids this orchestrator from dispatching another agent.

---

### Decision

**Summary**: Do step 5's exploration inline from the evidence in `../research/research.md`, run the CLI workers one at a time, and refresh continuity by editing the spec docs' `_memory` blocks instead of running the save writer.

**Details**: The plan YAML's own fallback, "Use inline planning activities below", covers a failed explorer dispatch. The research for this phase is the parent synthesis, so no `research/research.md` is created here. cli-codex rule 15 keeps one dispatch alive at a time unless the operator authorizes more, and no operator is present to do that. The phase commit sets `SPECKIT_SKIP_SPEC_REMINT=1` (and only that hook skip), as the lead approved: the spec-remint pre-commit check refuses any commit that stages 047 docs while another 047 child has unstaged edits, which is always true with two orchestrators in one worktree. `repair-derived.cjs --apply` runs on the parent and this phase under the commit lock first, and the lead runs one final unbypassed commit.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Inline exploration, serial workers** | Stays inside every hard rule | Slower | 8/10 |
| Parallel CLI workers | Faster | Breaks cli-codex rule 15 without operator approval | 3/10 |

**Why Chosen**: It is the only option that breaks no rule.

---

### Consequences

**Positive**:
- Every write is traceable to one brief.

**Negative**:
- Wall-clock time per phase grows. Mitigation: briefs are one change each so each run is short.

---

### Implementation

**Affected Systems**: none beyond this phase's files.

**Rollback**: not applicable; this is a process decision.

<!-- /ANCHOR:adr-001 -->
---

<!-- ANCHOR:adr-002 -->
## ADR-002: Instruction position decides Gate 3, not "resume always required"

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-09 |
| **Deciders** | Remediation orchestrator B |

---

### Context

V26 quotes the classifier header, "resume is always required". Applying it literally (any resume word fires) dropped the 195-row labeled corpus from 191 to 186 agreements: read-only questions such as "Review whether the corpus already covers enough resume and continuation phrases." are labeled no. A symmetric write-before-read rule for V25 also fired on nouns ("Review the build output and explain the failures."), which the cross-family review caught.

### Constraints
- The labeled corpus is the only recorded statement of intended Gate 3 behaviour.
- The four probe prompts in `spec.md` must fire.

---

### Decision

**Summary**: A write or resume word counts as an instruction only in instruction position: the start of the prompt, or right after "and" or "then" (and a comma or semicolon for write verbs). A read-only question that merely mentions resume, or names a write word as a noun, stays quiet.

**Details**: The classifier header is corrected to state this rule, and the spec's scope line follows it.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Instruction position** | Probes fire, corpus holds 191 | One more regex to maintain | 8/10 |
| Resume always required | Matches the old header literally | Corpus drops to 186, false Gate 3 prompts | 3/10 |

**Why Chosen**: It is the only option that closes both findings without new false positives on the labeled corpus.

---

### Consequences

**Positive**:
- Gate 3 no longer depends on word order for instructions.

**Negative**:
- A list such as "save, reload and resume" ending a read-only question is a residual edge. Mitigation: covered by a negative test.

---

### Implementation

**Affected Systems**: `shared/gate-3-classifier.ts` and its vitest file.

**Rollback**: revert the phase commit.

<!-- /ANCHOR:adr-002 -->
---

<!-- ANCHOR:adr-003 -->
## ADR-003: Cross-family review adjudication

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-09 |
| **Deciders** | Remediation orchestrator B |

---

### Context

DeepSeek V4.1 Flash max (cli-pi, read-only) reviewed the Luna diff and returned FAIL with two P1 and six P2 rows. The orchestrator reproduced both P1 rows against the rebuilt `shared/dist` before acting.

### Constraints
- Out-of-scope defects are recorded, never fixed (goal G7).

---

### Decision

**Summary**: Fix both P1 rows and four P2 rows; record two P2 rows.

**Details**: Fixed: write word before a read-only verb now counts only in instruction position; the resume marker ignores comma lists; the dead suppression conjunct and comment; the `create.sh --help` templates line; the duplicate `SPECKIT_TEMPLATES_BASE` row; the `validation-rules.md` build line; the cwd-dependent test. Recorded, not fixed: `backfill-frontmatter.ts:85` and `migrate-trigger-phrase-residual.ts:136` still resolve the root with the fallback (writers outside the save path V28 names); and `isRuntimeRepositoryFallback()` reads `process.cwd()`, so a programmatic `main()` caller passing its own root from outside any repository is refused.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Fix reproduced rows, record adjacent ones** | Stays in scope | Two writers keep the old fallback | 8/10 |
| Fix every row | Closes the class | Edits writers no verified finding names | 5/10 |

**Why Chosen**: Scope discipline: the two writers are the same class but not a verified finding.

---

### Consequences

**Positive**:
- No reproduced review issue is left open.

**Negative**:
- Two backfill tools still fall back to the runtime repository. Mitigation: listed for a later phase.

---

### Implementation

**Affected Systems**: classifier, its tests, create.sh, ENV-REFERENCE.md, validation-rules.md.

**Rollback**: revert the phase commit.

<!-- /ANCHOR:adr-003 -->
---
