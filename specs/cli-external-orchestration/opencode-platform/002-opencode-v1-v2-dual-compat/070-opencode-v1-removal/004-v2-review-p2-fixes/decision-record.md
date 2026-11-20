---
title: "Decision Record: Phase 4: v2-review-p2-fixes"
description: "Decision record template for documenting architectural choices, alternatives, consequences and implementation notes."
trigger_phrases:
  - "v2 review p2 fixes decision record"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "scaffold/004-v2-review-p2-fixes"
    last_updated_at: "2026-11-20T11:31:34Z"
    last_updated_by: "template-author"
    recent_action: "Initialized decision record template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-v2-review-p2-fixes"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Phase 4: v2-review-p2-fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Retire `opencode2` as a v2 launcher name and keep the numbered-launcher guards

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-20 |
| **Deciders** | Operator (Q005 in `../decision-record.md`), implementer |

---

<!-- ANCHOR:adr-001-context -->
### Context

The review found that tests still presented `opencode2` as a v2 launcher spelling while the version probe trusts only `opencode`, a path ending `/opencode` and `$OPENCODE_BIN`. The operator's Q005 answer was "Rename dual/opencode2 names", so the vocabulary goes. The `opencode2` hits fall into three groups with different right answers. Some are vocabulary, such as the models-form scan. Some are parser inputs and probe tests that already assert the name is not trusted. The rest test the dispatch guards' `opencode\d*` breadth, which exists so a renamed launcher is still audited.

### Constraints

- The probe's trust list stays `opencode`, a path ending `/opencode` and `$OPENCODE_BIN`.
- The `opencode\d*` dispatch patterns stay as they are. Narrowing them would let `opencode<N> run` pass unaudited.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: retire `opencode2` as a v2 launcher name in tests and live docs, keep every test that asserts it is not trusted, and respell the guard-breadth tests with a numbered name (`opencode9`) under titles that say they test any numbered launcher.

**How it works**: the models-form scan reads only `opencode models` commands that carry a server form. A bare `opencode models` appears only in dated OpenCode 1 observations, which the scan leaves alone. The freshness-guard, dispatch-audit and Pi lint cases use `opencode9`. The parser inputs pinned to `unknown`, the probe case "does not probe an executable named opencode2", the `remove-v1` launcher listing in `opencode-setup.sh`, changelogs, dated benchmark reports, a spec path in a dated playbook result and generated index data keep the name.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Retire the name, keep the guard breadth** | Matches Q005 and the probe, and keeps the audit coverage | Leaves a few historical and retirement-asserting hits | 9/10 |
| Trust `opencode2` in the probe again | One rule everywhere | Q005 chose renaming, and the probe would run a binary on its name alone | 3/10 |
| Delete every `opencode2` hit, guards included | A zero grep count | Narrows the dispatch guards or leaves their breadth untested | 2/10 |

**Why this one**: it follows the operator's choice without weakening a guard, and each kept hit has a stated reason.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- No test or live doc calls `opencode2` the v2 launcher.
- The guard-breadth tests say what they test.

**What it costs**:
- The scan's coverage narrows. Before this change a bare `opencode2 models <provider>` was read and flagged, and now no bare form is read, so a future doc that quotes a bare `opencode models <provider>` is not caught. Mitigation: the scan still catches every server-form command, and no live doc quotes a bare v2 form today.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A reader takes a kept `opencode2` hit for residue | L | This ADR lists each kept group and why |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The review's correctness advisory and the operator's Q005 answer |
| 2 | **Beyond Local Maxima?** | PASS | Three options compared above |
| 3 | **Sufficient?** | PASS | Test and comment edits only, no runtime change |
| 4 | **Fits Goal?** | PASS | OpenCode 2 is the only supported major |
| 5 | **Open Horizons?** | PASS | A future numbered launcher is still audited |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `opencode-models-form.test.cjs`: the pattern and fixtures name `opencode` only.
- `system-dist-freshness-guard.test.cjs`, `dispatch-audit.test.mjs`, `dispatch-preflight-lint.ts` and its test: the numbered spelling is `opencode9`.

**How to roll back**: `git revert` the commit that carries these test edits; no runtime code changed.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Rename `dualPlugin` to `definePlugin` with no alias

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-20 |
| **Deciders** | Implementer |

---

<!-- ANCHOR:adr-002-context -->
### Context

The builder kept its dual-compat name after it became a single-target `{ id, setup }` builder. The review suggested an alias for one release. `git grep` found 138 hits in 33 tracked files outside `specs/`. A sweep of the untracked runtime mirror folders found no other caller, and no vendored copy exists in the tree.

### Constraints

- The hidden, non-enumerable `factory` property must keep working, because tests call `.factory(`.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: rename every caller to `definePlugin` in one change and ship no alias.

**How it works**: the builder, the 20 plugin entry files, the inventory classifier, the git-setup export reader and the docs all use the new name. The inventory hook case now fails when no plugin is classified as bridged, so a missed rename cannot make it pass on nothing.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Rename with no alias** | One name, no dead export | An external caller would break | 8/10 |
| Rename and keep `dualPlugin` as an alias | Protects an unknown caller | No caller was found, so the alias is dead code that keeps the old name alive | 4/10 |

**Why this one**: every caller is in the repository and changes in the same commit.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- The builder's name matches its v2-only contract.

**What it costs**:
- A plugin written outside this repository against `dualPlugin` must rename its import. Mitigation: none is known.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A plugin stops loading after the rename | M | The live v2 battery reported all 20 plugin files active after the rename |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The review's naming advisory |
| 2 | **Beyond Local Maxima?** | PASS | The alias option was weighed |
| 3 | **Sufficient?** | PASS | A mechanical rename plus one guard assertion |
| 4 | **Fits Goal?** | PASS | Names the v2-only contract |
| 5 | **Open Horizons?** | PASS | No alias left to retire later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `.opencode/plugins/lib/v2-bridge.js` exports `definePlugin`, and every caller imports it.
- `.opencode/plugins/ARCHITECTURE.md` and the other docs name `definePlugin`.

**How to roll back**: `git revert` the rename commit.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions
<!-- FILL: Leave the table empty: a full-auto save fills it from captured operator answers. Hand-write a row only for an answer the capture missed, with the next free id. GOOD: Q004 decides `Keep the archive for 30 days`, gives the stated reason and names REQ-002. WEAK: Q004 says `Discussed retention` and leaves the other cells empty. -->

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.
<!-- /ANCHOR:operator-answers-verbatim -->

---
