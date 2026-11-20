---
title: "Decision Record: Phase 5: v1-reference-purge"
description: "Two decisions: purge every OpenCode 1 reference on the operator's answer, superseding phase 003 ADR-001, and accept history-fed residue in the generated retrieval files."
trigger_phrases:
  - "v1 reference purge decision record"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/005-v1-reference-purge"
    last_updated_at: "2026-11-20T16:32:14Z"
    last_updated_by: "template-author"
    recent_action: "Initialized decision record template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-v1-reference-purge"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Phase 5: v1-reference-purge

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Purge every OpenCode 1 reference, superseding phase 003's dated survivors

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-20 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-001-context -->
### Context

Phase 003's ADR-001 kept dated OpenCode 1 survivors and listed each one in `../003-v1-docs-and-playbooks-sweep/scratch/justified.txt`. The refusal code, the `remove-v1` helper and their tests were kept as intended survivors. On current main, 36 hand-written files outside specs, changelogs and benchmarks still mentioned OpenCode 1, and none of them runs it. The operator was asked how far the purge should go and answered "Purge everything": delete the refusal and the helper and their tests too, so no file outside history names OpenCode 1, accepting that a leftover v1 binary then launches and fails without a clear message.

### Constraints

- History stays as written: `specs/`, changelogs and benchmarks are not edited.
- A claim measured only on OpenCode 1 is deleted, never restated as an OpenCode 2 result.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: remove every OpenCode 1 branch, helper, test and observation outside history, and narrow the version families to `v2` and `unknown`.

**How it works**: each parser reads major 2 as `v2` and every other major as `unknown`. The deep loop refuses `unknown` with its existing "was not supported" error, the dispatch guard holds `unknown` to every rule as before, and the wrapper no longer probes the version before it adds `--standalone`. This supersedes phase 003's ADR-001 and its justified-list approach.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Purge everything** | No live file names a version the repository does not run | A leftover v1 binary launches and fails with OpenCode's own usage error | 8/10 |
| Keep the refusal and the helper, purge the observations | A leftover install gets a clear message | Keeps code and tests for a version nobody here runs | 6/10 |

**Why this one**: the operator chose it, and the remaining failure mode is a usage error on an install that no supported path creates.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The version contract has two families instead of three, in four parsers and three consumers.
- The wrapper starts OpenCode without a `--version` probe first.

**What it costs**:
- A leftover OpenCode 1 install is no longer named or removable by the helper. Mitigation: `npm uninstall -g opencode-ai` removes it by hand.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A v1 binary reaches the deep loop | L | It reads as `unknown` and the resolver refuses it |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 39 files named a version nothing runs |
| 2 | **Beyond Local Maxima?** | PASS | The keep-the-refusal option was offered and declined |
| 3 | **Sufficient?** | PASS | Deletions only; no new code path |
| 4 | **Fits Goal?** | PASS | Completes the v1 removal this track exists for |
| 5 | **Open Horizons?** | PASS | A future major reads as `unknown` with no special case |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Resolvers, rule engine, wrapper, battery and setup helper lose their OpenCode 1 branches.
- Docs, CI, the plugin inventory and the sk-git fixture lose their OpenCode 1 text; phase 003's `justified.txt` is marked superseded.

**How to roll back**: `git revert` this phase's commits on main, which restores the refusal, the helper and the dated survivors.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: The sweep's residue in generated retrieval files supersedes AC-001's empty result

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-20 |
| **Deciders** | This phase, reported to the operator |

### Context

The sweep excludes `specs/`, changelogs and benchmarks, but not the generated `trigger-index.json` and `phrase-variants.json`, which index those very sources. After regeneration a source trace finds 48 phrases such as `cli opencode 1 3 0 0`, which are the cli-opencode skill's own 1.x release versions that the `OpenCode 1\b` pattern matches by accident, and 4 phrases whose only sources are spec docs or changelogs. No live source contributes one.

### Decision

**We chose**: leave history unedited and accept the two generated files as the sweep's only output, rather than edit changelogs or special-case the generator.

**How it works**: AC-001 is met for every hand-written file and superseded for the two generated files; the report to the operator names the residue and its sources.

### Consequences

- The literal sweep is not empty while those changelogs and spec docs exist. A narrower check, the sweep with `':!**/trigger-index.json' ':!**/phrase-variants.json'` added, prints nothing.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set. The purge decision is cross-phase, so the continuity writer records it in the phase parent's `decision-record.md`.
<!-- /ANCHOR:operator-answers-verbatim -->

---
