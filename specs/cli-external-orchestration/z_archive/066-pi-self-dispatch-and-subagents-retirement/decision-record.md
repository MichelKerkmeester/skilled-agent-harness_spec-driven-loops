---
title: "Decision Record: which guard layers the Pi carve-out lifts"
description: "Why 'inside Pi may dispatch pi' is read as the ancestry and lockfile layers only, and why the lineage and stack layers stay for cli-pi along with every other kind."
trigger_phrases:
  - "guard layer split decision"
  - "pi ancestry lockfile exemption"
  - "recursion guard adr"
  - "cli-pi carve-out rationale"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/066-pi-self-dispatch-and-subagents-retirement"
    last_updated_at: "2026-09-08T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Layer split implemented as recorded"
    next_safe_action: "None; the decision is implemented"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-066-pi-self-dispatch"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: which guard layers the Pi carve-out lifts

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Lift the ancestry and lockfile layers for cli-pi, keep lineage and stack

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-08 |
| **Deciders** | Operator chose "docs + hook + runtime carve-out" on 2026-09-08; this record fixes what "carve-out" means at the layer level |

---

<!-- ANCHOR:adr-001-context -->
### Context

The operator's instruction was "remove the self invocation block from cli pi skill, inside pi they
are allowed to use it", and, when asked how deep the removal should go, chose the option that
includes a shared-runtime carve-out.

`validateExecutorDispatchAllowed` is one function serving six executor kinds through five layers,
and the layers do not all answer the same question:

| Layer | Question it answers | Fires when |
|-------|--------------------|------------|
| `lineage` (:838) | Is this process already a fan-out CLI lineage? | `SPECKIT_FANOUT_LINEAGE_ID` is set, for any kind |
| `stack` (:850) | Is this kind already in the dispatch chain? | `CLI_DISPATCH_STACK_ENV` names it |
| `ancestry` (:858) | Is the caller running inside this CLI right now? | The executor binary is in process ancestry |
| `env` (:867) | Same question, via a session variable | Already inert for `cli-pi`: no entry in `EXECUTOR_SESSION_ENV_BY_KIND` |
| `lockfile` (:878) | Same question, via runtime state | A lockfile in the kind's state path |

"Inside Pi they are allowed to use it" is a statement about the third and fifth rows. It is not a
statement about the first two, which exist to bound a spawn chain rather than to describe where
the caller is sitting.

### Constraints

- The exemption is written in code shared by six executors. Anything not keyed to `cli-pi` loosens
  all of them.
- Pi has no in-process delegation left. That is what makes the CLI route necessary and is the
  durable reason the code comment must carry.
- `.pi/` exists in this repository, so the `lockfile` layer can fire for a caller that is not Pi at
  all. That is an argument for exempting the layer rather than making it more precise, which would
  be a larger change to shared code than this packet is scoped for.
- The adapter stress suite asserts `recursion-guard-stack` for every kind, `cli-pi` included. A
  carve-out that reached the stack layer would break a shipped test — usefully, as a tripwire.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: a `cli-pi`-keyed exemption set consulted by the `ancestry` and `lockfile` layers
only. `lineage`, `stack` and `env` are untouched for every kind.

**How it works**: a Pi session may dispatch `cli-pi`, because being inside Pi stops being a
refusal signal. A `cli-pi` fan-out lineage still may not spawn another one, because the layer that
refuses that is not about where the caller sits. The two rules are independent, and after this
change the codebase states them separately instead of collapsing them into "never dispatch
yourself".
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Exempt ancestry and lockfile, keep lineage and stack** | Grants exactly what the instruction asked for; runaway chains stay bounded; a shipped stress test remains a live tripwire | The word "removed" is now qualified, so three surfaces must say which layers still hold | 9/10 |
| Exempt all five layers for `cli-pi` | One rule, nothing to explain | A Pi fan-out lineage could spawn Pi fan-out lineages without bound; contradicts a shipped stress cell that would have to be rewritten to assert less | 4/10 |
| Documentation only, both enforcement layers kept | Smallest diff | The docs would promise what the hook still refuses — the exact disagreement this packet exists to end | 1/10 |
| Make the `lockfile` layer precise instead of exempting it | Fixes a real imprecision: `.pi/` presence is not proof of a Pi session | Rewrites detection shared by six kinds, for a problem the operator did not raise | 3/10 |

**Why this one**: it is the only option where the instruction is satisfied and nothing outside
`cli-pi`'s "am I inside Pi" question changes.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A Pi session regains a delegation route, which is the capability it lost when subagents went away.
- Two questions the guard was conflating are now separated, in code and in prose.

**What it costs**:
- Three surfaces must state a carve-out rather than a flat rule, which is more words than "never".
- `cli-pi` loses its last ancestry-based refusal on macOS, where `ps` is the only ancestry source.
  Mitigation: `lineage` and `stack` are env-based and unaffected by platform.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A later edit generalizes the exemption to all kinds | H | The unit test asserts the other five still refuse on both layers, so a kind-agnostic rewrite fails |
| A later edit extends the exemption to the stack layer | H | The adapter stress suite's test 13 fails, unchanged and unmocked |
| The split is not what the operator meant | M | Recorded here and in `spec.md` §9 before implementation, when it is a one-line change |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without a runtime change the hook and the documentation disagree; the operator chose the carve-out explicitly |
| 2 | **Beyond Local Maxima?** | PASS | Four options weighed, including doing less and doing more |
| 3 | **Sufficient?** | PASS | One named constant and two call sites; no parameter threading, no config flag, no new abstraction |
| 4 | **Fits Goal?** | PASS | Grants the stated permission and nothing adjacent to it |
| 5 | **Open Horizons?** | PASS | Widening later is one entry in the same set; narrowing is deleting it |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**: `executor-audit.ts` gains the exemption set and two layer conditions;
`executor-audit.vitest.ts` gains four cases, two of which exist to fail if the exemption is written
too broadly. Nothing else in the runtime moves.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
