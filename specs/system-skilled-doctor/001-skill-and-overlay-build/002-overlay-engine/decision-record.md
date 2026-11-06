---
title: "Decision Record: Phase 2: overlay-engine"
description: "Decision record template for documenting architectural choices, alternatives, consequences and implementation notes."
trigger_phrases:
  - "overlay engine decision record"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "scaffold/002-overlay-engine"
    last_updated_at: "2026-11-06T07:23:10Z"
    last_updated_by: "template-author"
    recent_action: "Initialized decision record template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-overlay-engine"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Phase 2: overlay-engine

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: A walked token file passes only through protectedPaths

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-06 |
| **Deciders** | The operator |

---

<!-- ANCHOR:adr-001-context -->
### Context

The design ruling passes a token-named file only when a manifest entry names its exact path. Barter's `repo-frontend` directory entry walks `assets/tokens.css` and `references/barter-design-tokens.md`, so the engine refused Barter's real tree with exit 2. Exact `file` entries for the two files collide with the directory entry, which the engine refuses as two owners of one destination.

### Constraints

- Exact naming stays the rule, by the operator's ruling.
- A `.env` file is never read.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: an optional `protectedPaths` list on a `directory` or `skill-root` entry, chosen by the operator.

**How it works**: Each value is a path relative to the entry. The engine adds it to its exact set on both the overlay side and the tree side, and refuses a value outside the entry, an absolute value, an empty value or a `.env` name before reading anything.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **protectedPaths on the entry** | Keeps exact naming, two lines in Barter | One more manifest field | 9/10 |
| Barter splits `repo-frontend` | No engine change | Depends on a directory exclude the scope may lack | 5/10 |
| Allow `.md` and `.css` token names | No manifest change | The extension list the ruling replaced | 2/10 |

**Why this one**: It is the only option that keeps every walked token file refused unless a person named it.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- On a copy of Barter's tree with the two paths listed, `status` exits 0 with 445 in sync and 118 of 118 checked.

**What it costs**:
- Barter's cutover adds `protectedPaths` to `repo-frontend`. Mitigation: the overlay reference shows the exact lines.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A list grows into a blanket allow | M | Each value must name one exact path inside its entry |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Barter's real tree failed without it |
| 2 | **Beyond Local Maxima?** | PASS | Three options were weighed |
| 3 | **Sufficient?** | PASS | Two tests and the parity run pass |
| 4 | **Fits Goal?** | PASS | It unblocks Barter's cutover |
| 5 | **Open Horizons?** | PASS | A project with no token files needs no change |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `overlay-engine.cjs`: `protectedPathsFor`, `isListedProtectedPath` and the exact set.
- `tests/overlay-engine-fixes.test.cjs`: two tests, both recorded failing first.

**How to roll back**: revert this phase's commit.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Report lines keep their unbracketed shape

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-06 |
| **Deciders** | The build session |

---

<!-- ANCHOR:adr-002-context -->
### Context

The JavaScript checklist asks for a bracketed `[overlay-engine]` prefix on logged lines. The engine's report lines, such as `refuse:`, the state lines and `N changed`, are its output contract: the ported tests assert them exactly, and a hook matches `^refuse:`.

### Constraints

- Errors on stderr carry the `[overlay-engine]` prefix.
- The ported tests keep their meaning.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: the prefix on error lines only, and report lines exactly as the ported tests and hooks read them.

**How it works**: Every stderr error starts with `[overlay-engine]`. Report lines on stdout keep their shape.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Prefix errors only** | Keeps the output contract | One checklist item applies in part | 8/10 |
| Prefix every line | Matches the checklist word for word | Breaks the ported tests and the hook match | 3/10 |

**Why this one**: The report lines are parsed by callers, so they are an interface, not a log.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- The ported tests pass unchanged in meaning.

**What it costs**:
- One checklist line is met for errors only. Mitigation: this record names the reason.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A caller parses an error line | L | Errors go to stderr, report lines to stdout |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The checklist and the tests conflicted |
| 2 | **Beyond Local Maxima?** | PASS | Both shapes were compared |
| 3 | **Sufficient?** | PASS | The suite passes 1045 of 1045 |
| 4 | **Fits Goal?** | PASS | The hook in phase 004 matches the refusal line |
| 5 | **Open Horizons?** | PASS | A later JSON mode already exists for parsers |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `overlay-engine.cjs`: stderr errors prefixed, stdout report lines unchanged.

**How to roll back**: revert this phase's commit.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: The route-guard test is not ported

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-06 |
| **Deciders** | The build session |

---

<!-- ANCHOR:adr-003-context -->
### Context

The design names three Barter test files to port. `compiled-route-guard.test.cjs` loads `barter-overlays/compiled-routing/.skilled/bin/compiled-route-guard.cjs` and the live guard (lines 16 to 23), and asserts `guard.authoredProgramShipped` and `guard.authoredDrift` (lines 30, 31 and 41).

### Constraints

- Ported tests must drive the engine.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: not to port it, because it tests Barter's overlaid copy of the routing guard, not the engine.

**How it works**: The sync and replay tests are ported. The route-guard test stays with Barter's overlay of that guard.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Leave it with Barter** | Tests only engine behavior here | One of three named files not ported | 8/10 |
| Port it | Matches the design count | Tests a Barter file the engine never loads | 2/10 |

**Why this one**: A test that never calls the engine proves nothing about the port.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- The ported suite is engine behavior only.

**What it costs**:
- The design's count of three files is not met. Mitigation: this record names the reason.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Barter loses that test at cutover | L | It stays in Barter beside the overlay it tests |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The file was read before deciding |
| 2 | **Beyond Local Maxima?** | PASS | Porting was weighed |
| 3 | **Sufficient?** | PASS | 21 ported tests cover the engine |
| 4 | **Fits Goal?** | PASS | The port is the engine |
| 5 | **Open Horizons?** | PASS | Barter keeps its own guard test |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- No file. The test is not ported.

**How to roll back**: revert this phase's commit.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| OD-001 | A walked token-named file passes only when its entry lists the exact path in `protectedPaths` | Recommended option; Barter's tree failed the exact-path rule as its manifest stands | Amends Q004 for walked entries | ADR-001, `overlay-engine.cjs` |
| Q001 | A directory or skill-root entry lists each token-named file it may read, by exact path, in protectedPaths. | Not stated. | None | ADR-001, REQ-012, overlay-engine.cjs protectedPathsFor |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

- **OD-001.** Question: how should the engine handle a token-named file inside a directory entry. Options: Exact list on the entry (Recommended), Keep the rule, Barter splits, Allow non-secret extensions. Answer: "Exact list on the entry (Recommended)".

### Q001
<!-- source: claude:ae286a84-7880-4ce7-a5fe-7d1335e09c78:toolu_019yvpJiVxenEdwiL8Jnbr2r:0 -->

Question:
```text
Your ruling (Q004) was that a token-named file passes the secret guard only when the manifest names its exact path. Barter's `repo-frontend` directory entry walks two such files (`assets/tokens.css`, `references/barter-design-tokens.md`), so the new engine refuses Barter's real tree with exit 2. How should the engine handle a token-named file inside a directory entry?
```

Options:
```text
Exact list on the entry (Recommended)
Keep the rule, Barter splits
Allow non-secret extensions
```

Answer:
```text
Exact list on the entry (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->

---
