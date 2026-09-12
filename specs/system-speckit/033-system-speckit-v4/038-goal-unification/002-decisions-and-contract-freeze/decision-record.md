---
title: "Decision Record: Goal unification"
description: "Eight frozen decisions for goal unification: binding, store fate, strip contract, resend cadence, runtime surfaces, budget, isolation reconciliation and the home of the goal posture."
trigger_phrases:
  - "goal unification decisions"
  - "goal ADR"
  - "session packet binding"
  - "goal store fate"
  - "frontmatter strip contract"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/036-goal-unification/002-decisions-and-contract-freeze"
    last_updated_at: "2026-09-11T10:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Shaped eight ADR blocks awaiting the research synthesis"
    next_safe_action: "Fill each ADR from research/synthesis.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-11-system-spec-kit-goals"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Goal unification

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Session-to-packet binding

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-11 |
| **Deciders** | Operator (frozen D-rows), research lineages deepseek and glm, fresh-model synthesis |

---

<!-- ANCHOR:adr-001-context -->
### Context

A session's goal record is keyed by workspace, runtime and session id and carries no packet. Nothing reads a packet goal.md, and the phased packet case is one the repo's own detector calls ambiguous. Two sessions in one packet and one session switching packets both need a defined answer.

### Constraints

- Goal selection must never guess (specs/hooks/009-goal-isolation/decision-record.md:72)
- The composite scope key stays as it is (.opencode/hooks/goal/lib/goal-core.cjs:191); the packet path arrives from outside the key
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: A session binds to a packet through an explicit per-session pointer written only by a deliberate bind, never inferred.

**How it works**: A bind resolver beside `resolveGoalScope` (goal-core.cjs:174) stores `packetPath` in the per-session record, adopting the vocabulary the file already carries as `packet_pointer` in its continuity block. The speckit set step is the writer. A bound record whose goal document is gone or escapes the workspace is unbound for rendering: no injection and no fallback to the stored copy. A record set from plain text and never bound is the non-packet path: it keeps rendering its stored objective exactly as before this packet, because the text goal is the directive in that mode and nothing else holds it.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Explicit per-session pointer** | Deterministic, survives compaction, tested vocabulary | One more field to write on bind | 9/10 |
| Conversational only | Zero cost | Lost at compaction, invisible to hooks | 2/10 |
| Nearest packet from cwd | No writes | Phased packets are ambiguous; violates never-guess | 2/10 |
| Command-mediated derivation only | Reuses the speckit set step | Chat resend is not command-mediated | 4/10 |

**Why this one**: The pointer is the only mechanism that survives compaction, is visible to hooks, and never guesses.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Compaction and hook paths see the same packet
- Two sessions in one packet share a directive without sharing selection

**What it costs**:
- One bind step before injection. Mitigation: the speckit set step performs it, so the operator never types a path twice.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Stale pointer after a packet rename | M | Unbound state, no fallback, CLI diagnostic names the missing path |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The record has no packet field today |
| 2 | **Beyond Local Maxima?** | PASS | Four mechanisms weighed, two rejected by a landed ADR |
| 3 | **Sufficient?** | PASS | One field and one resolver |
| 4 | **Fits Goal?** | PASS | Every other decision needs a bound packet |
| 5 | **Open Horizons?** | PASS | The pointer vocabulary already exists as packet_pointer |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `goal-core.cjs`: bind resolver beside `resolveGoalScope`, `packetPath` in the record
- `bin/goal.cjs`: bind and unbound reporting

**How to roll back**: Remove the resolver and the field; records without the field already mean unbound.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Legacy goal store fate

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-11 |
| **Deciders** | Operator (frozen D-rows), research lineages deepseek and glm, fresh-model synthesis |

---

<!-- ANCHOR:adr-002-context -->
### Context

The legacy store holds fourteen liveness and telemetry fields and two content fields, with locks, retention and archives. On this checkout it holds zero records and one README. A git-tracked goal.md cannot hold per-session liveness without recreating the singleton failure 009 removed.

### Constraints

- Locks, retention and telemetry need a home outside the tracked file (goal-core.cjs:524, opencode-goal.js:37)
- Legacy adoption only when the store is the workspace's own (goal-core.cjs:195)
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Demote the store to a per-session index plus liveness and telemetry. The directive is read from goal.md and never duplicated into the record.

**How it works**: The record keeps identity, `packetPath`, bind metadata, the last resent slice hash and status, plus the operator copy the runtime judges completion against. When bound, rendering reads goal.md for content and the stored copy is never the source; when set from text, the stored copy is the whole goal. Existing records stay valid without rekeying, and a text goal keeps working as it did.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Demote to index plus liveness** | Keeps locks and telemetry; one source of truth for content | Two locations to understand | 9/10 |
| Retire outright | Simplest story | Locks and retention have no home | 3/10 |
| Keep objective duplicated | No read of goal.md at inject time | Two authors of one truth; the record silently wins | 2/10 |
| Liveness into frontmatter | One file | Per-session state in a shared committed file, the removed failure | 1/10 |

**Why this one**: Only the record can hold locks and telemetry; only goal.md can hold the directive without drift.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- One source of truth for content
- Locks and telemetry keep their tested home

**What it costs**:
- Two locations to read for one goal. Mitigation: the record holds only what goal.md cannot.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Other checkouts hold live records | L | Read path keeps legacy records valid without rekeying |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Zero records on this checkout; the schema still decides injection |
| 2 | **Beyond Local Maxima?** | PASS | Four fates weighed |
| 3 | **Sufficient?** | PASS | Smallest change that keeps locks |
| 4 | **Fits Goal?** | PASS | D1 and D3 read through this record |
| 5 | **Open Horizons?** | PASS | Matches 009's per-session invariants |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `goal-core.cjs`: record shape at `buildNewRecord`, read at `readGoalRecordForScope`
- `.opencode/hooks/goal/README.md`: state model

**How to roll back**: Restore the two content fields to the record; the read path falls back to them.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Frontmatter-strip contract

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-11 |
| **Deciders** | Operator (frozen D-rows), research lineages deepseek and glm, fresh-model synthesis |

---

<!-- ANCHOR:adr-003-context -->
### Context

Template and playbook say to resend the full text of goal.md, which ships the frontmatter and the volatile log. No goal surface carries a YAML parser, and the frontmatter holds a nested continuity block. The injected objective preview keeps 576 characters, so the criteria tail is cut today.

### Constraints

- Both renderers must consume the same slice (goal-core.cjs:383, opencode-goal.js:2614)
- The phase conditional must be resolved, not stripped (goal.md.tmpl:66)
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: One extractor splits frontmatter with the validator's own regex and slices the body by anchors, producing two slices: a durable slice for chat, injection and CLI show, and a narrower objective slice of pointer plus criteria.

**How it works**: A runtime-neutral CommonJS module under `.opencode/hooks/goal/lib/` that the core and the plugin both import, pinned by a golden test against `continuity-freshness.ts:17`. The projection always puts the packet pointer first so a truncation keeps the address.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Anchor slice with regex frontmatter split** | Reuses the validator's boundary; deterministic | One new module both runtimes must import | 9/10 |
| YAML parse | Precise | No parser in any goal surface; nested block | 3/10 |
| Cut at the second fence | Trivial | Ships template scaffolding into the 576-char preview | 2/10 |
| Materialized slice file | No parsing at read | Two files drift | 2/10 |

**Why this one**: The anchors already mark the boundary and the validator already owns the frontmatter regex.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- Frontmatter cannot leak from any surface
- Pointer-first projection survives the 576-character preview

**What it costs**:
- A new shared module. Mitigation: one file, golden-tested against the validator's regex.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| ESM plugin cannot import CommonJS without a build | M | Attempt the import first; fall back to a duplicated pinned copy with a parity test |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Full-text resend ships frontmatter today |
| 2 | **Beyond Local Maxima?** | PASS | Four boundaries weighed |
| 3 | **Sufficient?** | PASS | One extractor, two slices |
| 4 | **Fits Goal?** | PASS | D4 and D6 measure this slice |
| 5 | **Open Horizons?** | PASS | Same boundary the validator uses |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `.opencode/hooks/goal/lib/goal-slice.cjs` (new): frontmatter split, anchor slice, two projections
- `goal-core.cjs` and `opencode-goal.js`: consume it

**How to roll back**: Delete the module and restore the previous render paths; they read the stored prompt.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Resend trigger and reminder cadence

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-11 |
| **Deciders** | Operator (frozen D-rows), research lineages deepseek and glm, fresh-model synthesis |

---

<!-- ANCHOR:adr-004-context -->
### Context

The resend rule exists as prose only. Packet 029 excluded verifying what an operator pasted and declared the rule agent behavior, but did not exclude detecting that the slice changed.

### Constraints

- Log appends and git operations never trigger (goal-set-string-playbook.md:79)
- The plugin's brief cache must key on the hash (opencode-goal.js:43)
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: An edge trigger on a hash of the normalized durable slice, deduplicated per session with a key of packet path plus hash. The reminder rides the injection path and never blocks work.

**How it works**: At render time the slice hash is compared with `lastResentSliceHash` in the record; a difference emits the stripped slice in chat and updates the record. While the operator copy is unset the reminder repeats at every command entry. After a set, the agent acknowledges in one line and continues.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Slice hash edge trigger, packet-scoped dedup** | Fires only on real change; returns to a packet resend | Needs a normalization rule | 9/10 |
| Turn cadence | Simple | Fires with nothing changed | 2/10 |
| File mtime | Cheap | Log appends and git touch it | 1/10 |
| Continuity fingerprint | Already in frontmatter | goal.md ships a zero placeholder | 2/10 |

**Why this one**: A hash of the durable slice is the only predicate that ignores log appends and git touches.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- Resend fires only on real durable change
- Reminders never block work

**What it costs**:
- A normalization rule for the hash. Mitigation: documented once in the module and pinned by a test.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Resend spam on formatting churn | M | Normalize whitespace and anchors before hashing; dedup per packet |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The rule is prose with no code today |
| 2 | **Beyond Local Maxima?** | PASS | Five predicates weighed |
| 3 | **Sufficient?** | PASS | One hash and one record field |
| 4 | **Fits Goal?** | PASS | Criterion 5 depends on it |
| 5 | **Open Horizons?** | PASS | Stays inside the 029 boundary |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- `goal-core.cjs`: hash compare at render, `lastResentSliceHash` in the record
- speckit command goal step (phase 006)

**How to roll back**: Remove the compare; the resend returns to agent behavior per 029.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Per-runtime goal surfaces

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-11 |
| **Deciders** | Operator (frozen D-rows), research lineages deepseek and glm, fresh-model synthesis |

---

<!-- ANCHOR:adr-005-context -->
### Context

Only opencode has a working goal command. Cursor's adapter is sessionStart only and its command cannot prove session binding. Devin's adapter was decommissioned in 009 phase 006 and the README records its absence as by-design, while its hook file registers eight events. Claude Code and Codex keep host-private goal surfaces outside this repo.

### Constraints

- Operator decision: pi, opencode, cursor and devin ship; Claude Code and Codex keep their native goal command
- 009 REQ-010 requires docs and tracked files to agree about devin (specs/hooks/009-goal-isolation/spec.md:150)
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: Ship pi and opencode at full capability, cursor as degraded injection-only with its command resolving the bound packet, and devin as a build item with a new adapter, a command surface and an amended by-design row in the same change. Claude Code and Codex reach nesting through speckit commands and natural conversation, with no new /goal.

**How it works**: Each adapter calls the shared resolver and extractor. Devin gets `.opencode/hooks/goal/devin/goal-inject.mjs` and a command file, wired into `.devin/hooks.v1.json`. The hook README delivery matrix and 009's evidence row are amended together so REQ-010 stays true.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Ship four, native for two** | Matches operator decision and the repo's actual surfaces | Devin is new work | 8/10 |
| Ship all six uniformly | One story | Claude Code and Codex expose no adapter surface here | 2/10 |
| Cursor at parity | Full management on cursor | Cannot prove session binding | 3/10 |

**Why this one**: Four runtimes have a surface to build on; two have host-private goal stores this repo cannot reach.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- Every shipped surface resolves the same goal.md
- Devin's absence stops being a documented gap

**What it costs**:
- A new devin adapter and command. Mitigation: modeled on the pi and cursor adapters.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Devin host exposes no command surface | M | Ship injection first; document the command as pending with the evidence |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Only opencode works today |
| 2 | **Beyond Local Maxima?** | PASS | Six surfaces weighed one by one |
| 3 | **Sufficient?** | PASS | Four ship, two stay native |
| 4 | **Fits Goal?** | PASS | Criterion 4 is this decision |
| 5 | **Open Horizons?** | PASS | Native surfaces stay untouched |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- `.opencode/hooks/goal/{pi,cursor,devin}/`, `.opencode/plugins/opencode-goal.js`, four command files
- `.opencode/hooks/goal/README.md` delivery matrix and 009 REQ-010 evidence

**How to roll back**: Per runtime: restore the adapter from git; the shared core is unaffected.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: Parent durable budget and enforcement

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-11 |
| **Deciders** | Operator (frozen D-rows), research lineages deepseek and glm, fresh-model synthesis |

---

<!-- ANCHOR:adr-006-context -->
### Context

The runtime caps objective and prompt at 4000 and the block at 4800, the doc-side budget says 3000 in a worked example, and no validator reports either. This packet's own parent sat at 3994 durable characters after one amendment, and its objective plus criteria reach the model at 44 percent.

### Constraints

- Operator decision: parent at most 4000 characters excluding frontmatter, children unbounded
- Injected prompt budget is dynamic, 3602 to 4463 (goal-core.cjs:405, :417)
<!-- /ANCHOR:adr-006-context -->

---

<!-- ANCHOR:adr-006-decision -->
### Decision

**We chose**: Two tiers in the TypeScript validator: warn at 3000 and error at 4000 measured durable characters on a parent goal.md, plus a consumer-side length check at set time and a restored binding-child existence rule.

**How it works**: Rules live beside the anchor gate in `spec-doc-structure.ts` (:210-229). Units are characters. The measurement is everything after the frontmatter fence up to the log anchor, anchors and scaffold comments included, so the number matches what an author sees. The playbook's 3000 becomes the warning tier and the cut order stays: log, restated child detail, decision prose, criterion wording never count, then split the packet.
<!-- /ANCHOR:adr-006-decision -->

---

<!-- ANCHOR:adr-006-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Warn 3000, error 4000, plus consumer check** | Authors get warning before breach; catches paste failure too | Two thresholds to document | 9/10 |
| Error 4000 only | One number | No warning; this packet was six characters from breach | 4/10 |
| Enforce nothing | Zero work | A 15,028-byte goal.md shipped unreported | 1/10 |

**Why this one**: A warning tier is the only option that told this packet's own author anything before the cap.
<!-- /ANCHOR:adr-006-alternatives -->

---

<!-- ANCHOR:adr-006-consequences -->
### Consequences

**What improves**:
- Authors see the budget before pasting
- The missing-child failure the deleted rule caught returns

**What it costs**:
- Legacy parents over 3000 warn. Mitigation: warnings do not fail a run.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Units drift between bytes and characters | L | Rule states characters; test with a multibyte fixture |
<!-- /ANCHOR:adr-006-consequences -->

---

<!-- ANCHOR:adr-006-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | This parent was six characters from the cap |
| 2 | **Beyond Local Maxima?** | PASS | Four options weighed |
| 3 | **Sufficient?** | PASS | Two thresholds, one rule file |
| 4 | **Fits Goal?** | PASS | Criteria 1 and 2 are this decision |
| 5 | **Open Horizons?** | PASS | Cut order reused verbatim |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-006-five-checks -->

---

<!-- ANCHOR:adr-006-impl -->
### Implementation

**What changes**:
- `spec-doc-structure.ts`: two goal rules beside the anchor gate
- `spec-kit-docs.json`, `goal.md.tmpl`, playbook, `validation-rules.md`: the numbers

**How to roll back**: Remove the two rules; docs keep the numbers as advice.
<!-- /ANCHOR:adr-006-impl -->
<!-- /ANCHOR:adr-006 -->

---

<!-- ANCHOR:adr-007 -->
## ADR-007: Reconciliation with goal isolation and update authority

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-11 |
| **Deciders** | Operator (frozen D-rows), research lineages deepseek and glm, fresh-model synthesis |

---

<!-- ANCHOR:adr-007-context -->
### Context

009 removed a process-global singleton where the last writer replaced every session's record. A packet-shared goal.md shares content by construction, so the isolation unit has to be restated, and the auto-update requirement has to be bounded so it never rewrites the operator's copy behind their back.

### Constraints

- No injection without session identity, no auto-claiming of legacy state, no singleton fallback (009 spec REQ-001, REQ-006, SC-004)
- Command tool whitelists are the precedent: plan, implement, complete may set; resume reads (resume.md:4)
<!-- /ANCHOR:adr-007-context -->

---

<!-- ANCHOR:adr-007-decision -->
### Decision

**We chose**: Share the directive, keep selection, liveness, telemetry and locks per session. Auto-update may write only the log and continuity bookkeeping; durable-slice changes are command-mediated and operator-ratified; a child change that alters a parent decision is applied to the parent first and the parent resent.

**How it works**: This is recorded as an explicit amendment to 009's decision record: the isolated unit moves from goal content to session-to-packet binding. Resume resends without mutating, so criterion 5 of the parent is amended to say so rather than widening resume's whitelist.
<!-- /ANCHOR:adr-007-decision -->

---

<!-- ANCHOR:adr-007-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Shared directive, per-session everything else** | Preserves every 009 invariant; matches the tool whitelist ladder | Needs the amendment written | 9/10 |
| Per-session copies of the directive | Full isolation | Recreates drift | 2/10 |
| Auto-rewrite durable sections | Least operator effort | Operator copy becomes meaningless; a resend per edit | 1/10 |
| Operator-only durable writes | Safest | Contradicts the auto-update requirement | 3/10 |

**Why this one**: Sharing content while isolating selection keeps every 009 invariant and still allows auto-update of the log.
<!-- /ANCHOR:adr-007-alternatives -->

---

<!-- ANCHOR:adr-007-consequences -->
### Consequences

**What improves**:
- 009's invariants all survive
- Auto-update can never silently change what the operator judges by

**What it costs**:
- An amendment to 009's record. Mitigation: one pointer paragraph.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Two sessions edit the durable slice at once | L | Git is the conflict layer; the log is the only append area |
<!-- /ANCHOR:adr-007-consequences -->

---

<!-- ANCHOR:adr-007-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A shared file re-raises the singleton question |
| 2 | **Beyond Local Maxima?** | PASS | Four splits weighed |
| 3 | **Sufficient?** | PASS | Content shared, everything else per session |
| 4 | **Fits Goal?** | PASS | D1, D2 and D4 rest on it |
| 5 | **Open Horizons?** | PASS | The canary test is already prescribed |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-007-five-checks -->

---

<!-- ANCHOR:adr-007-impl -->
### Implementation

**What changes**:
- `specs/hooks/009-goal-isolation/decision-record.md`: amendment pointer
- Parent criterion 5: resume resends without mutating

**How to roll back**: Revert the amendment pointer; nothing in code depends on it alone.
<!-- /ANCHOR:adr-007-impl -->
<!-- /ANCHOR:adr-007 -->

---

<!-- ANCHOR:adr-008 -->
## ADR-008: Home of the always-on goal posture

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-11 |
| **Deciders** | Operator (frozen D-rows), research lineages deepseek and glm, fresh-model synthesis |

---

<!-- ANCHOR:adr-008-context -->
### Context

The operator asked whether the goal behavior needs a repo rule or an AGENTS.md change. AGENTS.md has no goal mention. The repo-rule router loads a rule only when a trigger matches the action about to be taken, and its authoring mode refuses content that must bind when no trigger fires.

### Constraints

- A rule that binds without a trigger is an AGENTS.md row (.opencode/skills/sk-doc/sk-create-repo-rule/SKILL.md:200)
- Routing, selection and dispatch mechanics never go in a rule (SKILL.md:201)
- An AGENTS.md change beyond a pointer is an operator decision (SKILL.md:209); the operator made it
<!-- /ANCHOR:adr-008-context -->

---

<!-- ANCHOR:adr-008-decision -->
### Decision

**We chose**: One GOAL POSTURE RULE block in AGENTS.md section 4 after the MEMORY SAVE RULE, plus one Quick Reference entry. No repo rule. Mechanics stay in system-spec-kit and the goal hook docs.

**How it works**: Phase 006 inserts the block quoted in research/synthesis.md section 3: the bound packet goal.md is the source and its frontmatter never leaves the file; a durable change resends the stripped slice and reminders repeat while unset; work never stops for an unset goal; after a set, acknowledge in one line and continue. The wording is shown to the operator before the write.
<!-- /ANCHOR:adr-008-decision -->

---

<!-- ANCHOR:adr-008-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **AGENTS.md row, no repo rule** | Binds every turn on every runtime; matches the authoring mode's own test | Edits the always-loaded document | 9/10 |
| Repo rule under repo-rules/ | Scoped loading | Fails decision test 1; would restate an AGENTS.md row | 2/10 |
| Skill docs only | No root change | Binds only agents that load the skill | 3/10 |

**Why this one**: The authoring mode's first refusal sends always-on posture to the always-loaded document.
<!-- /ANCHOR:adr-008-alternatives -->

---

<!-- ANCHOR:adr-008-consequences -->
### Consequences

**What improves**:
- The posture binds every runtime on every turn
- No rule file duplicates it

**What it costs**:
- An edit to the always-loaded document. Mitigation: one block and one table row, shown first.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The row drifts from spec-kit mechanics | L | Row names posture only and points at system-spec-kit for mechanics |
<!-- /ANCHOR:adr-008-consequences -->

---

<!-- ANCHOR:adr-008-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | AGENTS.md has no goal mention |
| 2 | **Beyond Local Maxima?** | PASS | Three homes weighed against the authoring mode's tests |
| 3 | **Sufficient?** | PASS | One block, one row |
| 4 | **Fits Goal?** | PASS | Criterion 7 is this decision |
| 5 | **Open Horizons?** | PASS | Repo-neutral wording |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-008-five-checks -->

---

<!-- ANCHOR:adr-008-impl -->
### Implementation

**What changes**:
- `AGENTS.md` section 4: GOAL POSTURE RULE block; section 10: Quick Reference row

**How to roll back**: Delete the block and the row.
<!-- /ANCHOR:adr-008-impl -->
<!-- /ANCHOR:adr-008 -->

---
