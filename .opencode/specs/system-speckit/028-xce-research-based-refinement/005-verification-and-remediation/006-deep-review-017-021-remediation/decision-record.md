---
title: "Decision Record: Deep-Review 017-021 Remediation [027/002/005/006]"
description: "ADRs governing how the 017-021 deep-review findings are carried into remediation: severity-lock the P1, honor synthesis verdicts, split into traceable workstreams, reconcile docs toward the implementation-summary."
trigger_phrases:
  - "017-021 remediation decisions"
  - "deep review remediation adr"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation"
    last_updated_at: "2026-06-17T00:00:00Z"
    last_updated_by: "deep-review-remediation-author"
    recent_action: "Authored 4 ADRs governing the 017-021 remediation approach"
    next_safe_action: "verify c006 renderer then begin per-file remediation"
    blockers: []
    completion_pct: 0
---
# Decision Record: Deep-Review 017-021 Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Severity-Lock the P1 Behind a Renderer-Behavior Verification

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-17 |
| **Deciders** | Deep-review remediation author |

---

<!-- ANCHOR:adr-001-context -->
### Context

The only confirmed P1 across all five phases is c006: `commands/memory/search.md:17` ends its §0 argument-resolution header in an **unquoted** `-- $ARGUMENTS`. The 017 synthesis verified that the `bash -c '…' --` wrapper protects only expansion inside the wrapped script, while the trailing `$ARGUMENTS` is substituted into the outer shell, which runs its full expansion phase (glob, command-substitution, metacharacters). Both c006 lineages (kimi correctness + opus security) flagged it; the shipped fix handles only word-splitting (`"$*"`) and `"`-escaping.

However, the actual exposure depends on a fact the review could not fully pin down: whether the OpenCode/Claude slash-command **renderer** substitutes `$ARGUMENTS` raw (live sink) or shell-quotes it into a single token (no outer-shell expansion of user text). The impl-summary's "expands one word per argument" wording suggests raw, but that is inference, not confirmation.

### Constraints
- Must not leave a live shell-injection / glob-corruption sink if the renderer is raw.
- Must not perform dead work (quote-hardening) if the renderer already quotes.
- The 017 synthesis itself prescribes a verify-first step (R1 step T1).
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Summary**: Gate the P1 fix behind a verification task. T001 confirms the renderer's `$ARGUMENTS` handling FIRST; its outcome decides T002.

**Details**: If raw → quote-harden (`set -f` / restructure) and add metacharacter verification cases; the finding stays P1 until closed. If shell-quoted → record a one-line P2 doc-note with the renderer evidence and make no code edit; the finding is downgraded to P2. T001 is marked `{needs-in-task-verification}` and is the first task in the ledger.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Verify-first severity-lock** | No dead work; no live-sink risk; matches synthesis R1 | One extra verification step before the fix | 9/10 |
| Quote-harden unconditionally | Closes the sink immediately | Dead work + possible double-escaping if renderer already quotes | 6/10 |
| Treat as P2 doc-note immediately | Cheapest | Leaves a live sink if the renderer is raw — the verified worst case | 3/10 |

**Why Chosen**: The verify-first lock is the only option that is correct under both renderer behaviors. The self→self trust boundary (operator types their own query) is why the synthesis rated this P1 not P0, but a CWD-dependent glob/cmd-sub corruption of the resolved query is still a real correctness defect that must be closed if the renderer is raw.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**:
- The fix is provably right under both renderer behaviors.
- The evidence captured by T001 is reusable for any future `$ARGUMENTS`-bearing command.

**Negative**:
- Adds one verification step before the P1 can be closed — Mitigation: it is fast (doc/source read + one live probe).

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Renderer is raw and the fix is skipped | H | T001 is a HARD first task; CHK-030 gates completion |
| Renderer quotes and we quote anyway | L | T001 outcome routes to the doc-note branch, no code edit |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| Check | Assessment |
|-------|------------|
| **Simplicity** | The lock adds one verification task, not a new abstraction — the simplest path that is correct under both renderer behaviors. |
| **Systems** | Touches only `commands/memory/search.md` §0; the renderer evidence is reusable for any future `$ARGUMENTS` command. |
| **Bias** | Resists the "just quote it" reflex — quoting blindly is dead work or double-escaping if the renderer already quotes. |
| **Sustainability** | Captures the renderer contract as evidence, so the next maintainer need not re-derive it. |
| **Scope** | One verification + one conditional fix; no scope creep into other command templates. |
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**Affected Systems**: `commands/memory/search.md` §0; the later implementation step's first action.

**Rollback**: The doc-note branch is reversible via git; the quote-harden branch is a localized one-line/one-block change, revertible independently.
<!-- /ANCHOR:adr-001-impl -->

---


<!-- /ANCHOR:adr-001 -->
---

<!-- ANCHOR:adr-002 -->
## ADR-002: Honor Synthesis Verdicts and Downgrades; Do Not Re-Escalate

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-17 |
| **Deciders** | Deep-review remediation author |

---

### Context

Several findings were filed at P1 by individual lineages and then DOWNGRADED to P2 by the synthesizer after re-verifying against code: the 019/020 marker schema/TTL drift (predicate reads only `childPid`/`activeUntilMs`, zero runtime impact), the 021 A1 empty-files `timedPhase` gap (every phase on the branch is bounded or yields), and the 017 doc scaffold cluster. Conversely, several P1/P0-candidate findings were verified FALSE-POSITIVE: 018 mimo-1 post-restart fast-cancel (crash recovery resets jobs to `failed`), and the 020 D6/D7/D8 atomic-write-throw family (`atomicWriteFile` never throws — it returns `false`).

### Constraints
- The syntheses are the source of truth; each verdict was checked against cited code.
- Re-litigating a downgrade or re-opening a refuted finding contradicts verified evidence.

---

### Decision

**Summary**: Carry findings at the severity the syntheses verified, and exclude rejected/refuted/already-resolved findings from actionable work entirely.

**Details**: Downgraded findings are carried as P2 (e.g. A1 is a P2 instrumentation-symmetry fix, not a P1 re-election defect). Refuted findings are listed in §3 Out of Scope and re-asserted in tasks.md T034 as a negative check ("confirm no refuted finding was implemented"). The packet does NOT add try/catch rollback around `beginMaintenance`, an uncaught-exception handler for the refresh timer, or a marker around the synchronous foreground scan — all three target failure modes the code already precludes.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Honor verdicts; exclude refuted** | Matches evidence; no wasted effort; no over-hardening | Requires trusting the synthesis verification | 9/10 |
| Carry every raw lineage P1 at P1 | Maximally cautious | Re-introduces verified false-positives; over-hardens against impossible failure modes | 4/10 |
| Drop all downgraded items | Smallest backlog | Loses real P2 maintainability/observability/doc value | 5/10 |

**Why Chosen**: The syntheses already did the verify-against-code work (every CONFIRMED row opened the cited file). Re-escalating would re-introduce refuted defects (e.g. hardening a write path that cannot throw). The middle path — carry confirmed P2s, exclude refuted — preserves value without manufacturing work.

---

### Consequences

**Positive**: No over-hardening; the backlog matches reality; T034 makes the exclusion auditable.

**Negative**: If a synthesis verdict were wrong, this packet would inherit the error — Mitigation: each code task re-confirms its cite against the live file before acting (finding-is-a-hypothesis).

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| A refuted finding is mistakenly fixed | L | T034 negative check + §3 enumeration |
| A downgrade was too aggressive | L | Per-task cite re-confirmation before edit |

---

### Implementation

**Affected Systems**: the task ledger's severity tags and the Out-of-Scope list.

**Rollback**: N/A — this is a classification decision, not a code change.

---


<!-- /ANCHOR:adr-002 -->
---

<!-- ANCHOR:adr-003 -->
## ADR-003: Split Into Per-Phase + Cross-Cutting Workstreams, One Finding → One Task

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-17 |
| **Deciders** | Deep-review remediation author |

---

### Context

The five syntheses span six code files, multiple doc folders across 017-021's children, one command template, and several test files. The findings cluster naturally by phase (017 search intelligence, 018 cancellation, 019/020 maintenance grace, 021 cooperative phases) but also include one cross-cutting item (017 systemic doc drift across all 7 children).

### Constraints
- Each finding must be traceable to its synthesis line and its target file.
- Each workstream should carry a coherent verification gate (vitest vs validate.sh vs live probe).

---

### Decision

**Summary**: Organize tasks.md into eight workstreams — M1 (P1 lock+fix), M2 (017 cross-cutting doc drift), M3 (017 code P2s), M4 (018), M5 (019), M6 (020), M7 (021), M8 (verification) — with exactly one task per confirmed finding and a `<trace:…>` back-reference on each.

**Details**: The cross-cutting 017 doc drift gets its own workstream (M2) rather than being scattered per child, because it is one fix applied seven times with a single mechanism (`generate-context.js` per child). Verification (M8) is separated so baseline→delta and validate.sh gating are explicit, not implicit.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Per-phase + cross-cutting workstreams** | Maximal traceability; per-workstream gate; matches synthesis structure | More tasks to track | 9/10 |
| One flat severity-ordered list | Simplest to read | Loses phase/gate grouping; cross-cutting item gets buried | 6/10 |
| Per-file grouping | Aligns to edit targets | A file (memory-index.ts) spans 018 + 021 findings — splits a phase's verification | 5/10 |

**Why Chosen**: Phase grouping keeps each synthesis's findings together with its verification gate, and pulling the systemic doc drift into its own workstream surfaces the dominant P2 rather than hiding it across seven children.

---

### Consequences

**Positive**: Every finding is one task with a trace; each workstream has a gate; the dominant doc-drift item is visible.

**Negative**: `handlers/memory-index.ts` appears in two workstreams (018 + 021) — Mitigation: each task cites distinct line ranges and distinct findings.

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| A finding lands in no task or two tasks | M | SC-002 (one-to-one mapping) + CHK-001 |

---

### Implementation

**Affected Systems**: tasks.md structure; the milestone map in spec.md and plan.md.

**Rollback**: N/A — organizational decision.

---


<!-- /ANCHOR:adr-003 -->
---

<!-- ANCHOR:adr-004 -->
## ADR-004: Reconcile Scaffold Docs Toward the Implementation-Summary; Never Overwrite It

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-17 |
| **Deciders** | Deep-review remediation author |

---

### Context

The 017 systemic doc drift is the highest-volume finding: all 7 children's `spec.md`/`plan.md`/`tasks.md` are unfilled scaffold templates and `graph-metadata.json` reads `Status: planned`, while each `implementation-summary.md` is populated with real shipped key_files and `completion_pct: 100`. The 019 cluster is similar (spec/plan cite non-existent paths, stale TTL, "unprotected" wording) while the code shipped correctly. The reconciliation direction matters: the impl-summary is the truth source.

### Constraints
- The impl-summary records the real shipped reality and must not be regenerated/clobbered.
- `generate-context.js` is the preferred reconciliation mechanism but can regenerate broadly.

---

### Decision

**Summary**: Reconcile the scaffold/planned docs TO the `implementation-summary.md` — never the reverse — and never overwrite real impl-summary content.

**Details**: For 017, populate spec/plan/tasks and refresh graph-metadata Status/Key Files to match the impl-summary (or explicitly mark them superseded by it); use per-child `generate-context.js` but guard the impl-summary. For 019/021, the only impl-summary edits permitted are the explicit wording corrections the syntheses prescribe (019 bullet-4 embedding-queue protection; 021 A2 `timedPhase` claim qualification) — targeted edits, not regeneration.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Reconcile scaffold → impl-summary; guard impl-summary** | Preserves truth source; safe bulk reconcile | Requires care to not let regen touch impl-summary | 9/10 |
| Regenerate all docs from scratch | Uniform output | Risks clobbering real shipped detail in impl-summaries | 4/10 |
| Mark scaffold docs superseded only | Lowest effort | Leaves spec/plan/tasks thin; weaker audit trail | 6/10 |

**Why Chosen**: The impl-summary is the only doc that already matches reality; aligning everything to it (and protecting it) is both the safest and the most accurate reconciliation. The constitutional rule `automated-writers-never-overwrite-manual` reinforces this direction.

---

### Consequences

**Positive**: Each reconciled phase becomes auditable from its own docs; no real shipped detail is lost.

**Negative**: Per-child reconciliation is more manual than a single bulk regen — Mitigation: acceptable for 7 children; the gate (validate.sh --strict) confirms each.

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| A bulk regen clobbers an impl-summary | M | CHK-051; per-child guarded `generate-context.js`; targeted edits for 019/021 |

---

### Implementation

**Affected Systems**: the 017 children's spec/plan/tasks/graph-metadata; targeted 019/021 impl-summary wording.

**Rollback**: All doc reconciliations are git-reversible per file.

<!-- /ANCHOR:adr-004 -->
