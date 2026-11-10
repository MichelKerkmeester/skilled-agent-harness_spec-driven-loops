---
title: "Decision Record: Phase 2: tooling-fixes"
description: "Decisions for the router tooling fixes: an orphan is a generated intent signal no router declares, protected by a keep list, and router reach defaults to concurrency 2."
trigger_phrases:
  - "tooling fixes decision record"
  - "intent signal orphan definition"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/code-surfaces/005-frontend-upstream-proposals/002-tooling-fixes"
    last_updated_at: "2026-11-03T12:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Recorded the orphan definition and the measured reach default"
    next_safe_action: "Build T004 to T008"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ae286a84-7880-4ce7-a5fe-7d1335e09c78"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "An orphan is a generated signal no router declares any more (operator, 2026-11-03)."
---
# Decision Record: Phase 2: tooling-fixes

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: An orphan is a generated signal no router declares

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-03 |
| **Deciders** | Operator (Michel Kerkmeester) |

---

<!-- ANCHOR:adr-001-context -->
### Context

The spec defined an orphan as any `intent_signals` entry that no router declares. Measured on the live tree with the generator's own phrase extraction, that definition flags 184 signals across seven hubs, 144 of them multi-word: sk-design 99, sk-code 38, sk-doc 16, mcp-tooling 15, cli-external-orchestration 7, system-deep-loop 5, cli-classifier 4. The question put to the operator said 151, from a looser extraction that read every quoted string in the router block; the corrected count and its method are in `scratch/orphans.txt`. Nearly all are hand-curated, which the generator's own header allows: "the authored list is curated and this only ever adds to it". `routing-registry-drift.yml` and the pre-commit skill-authoring gate both run `--check`, so that definition turns both red at once, and D2 forbids the prune that would clear them.

### Constraints

- D2: no live hub's `graph-metadata.json` changes in this phase.
- `ci-skill-root-metadata.cjs` keeps a closed set of top-level keys, so any new key is added there and in `skill-root-metadata-contract.md`.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: record provenance. `--write` adds each phrase it carries up to a sibling `intent_signals_generated` array. An orphan is an entry of `intent_signals_generated` that no router declares any more and that `intent_signals_keep` does not list.

**How it works**: `--check` names and counts orphans and exits 1 on them. `--write` removes each orphan from both `intent_signals` and `intent_signals_generated`, keeping the order of what stays. A signal no router declares is hand-curated and never enters `intent_signals_generated`, so it is never an orphan. A phrase a router does declare is recorded on the hub's first `--write`, so a later rename prunes it unless it is kept. `intent_signals_keep` is the keep marker for a generated phrase that should outlive its router entry. Comparison is lower-cased, as for missing phrases.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Track generated signals** | Curated signals are safe by construction; no live file changes; CI stays green | Phrases generated before this change carry no provenance, so their renames are not caught until a hub's next `--write` | 8/10 |
| Seed keep lists now | Specced definition kept | All seven hubs' metadata change, amending D2; every future hand-added signal needs a keep entry | 5/10 |
| Report-only by default | Smallest change | Orphans are only advisory unless a flag is passed, so renames still slip through | 4/10 |

**Why this one**: The operator chose it. It catches exactly the failure the proposal names, a renamed generated phrase, without asking anyone to mark hand-curated work.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A phrase the generator added and a router later renames is reported and pruned, so no pin restore is needed.

**What it costs**:
- Two new optional top-level keys in `graph-metadata.json`, admitted by the root-metadata gate and documented in its contract.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A generated phrase is renamed before its hub's first post-change `--write` | L | The live report in `scratch/orphans.txt` names the hubs whose provenance is still empty |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Phase 001's renamed phrase stayed in sk-code until removed by hand |
| 2 | **Beyond Local Maxima?** | PASS | Three definitions were compared on live counts |
| 3 | **Sufficient?** | PASS | Provenance plus a keep list covers both generated and kept phrases |
| 4 | **Fits Goal?** | PASS | The parent goal asks for an orphan-phrase test |
| 5 | **Open Horizons?** | PASS | A hub owner can still curate `intent_signals` by hand |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `generate-router-intent-signals.cjs`: provenance on `--write`, orphan report on `--check`, prune on `--write`, keep list.
- `ci-skill-root-metadata.cjs` and `skill-root-metadata-contract.md`: admit `intent_signals_generated` and `intent_signals_keep`.

**How to roll back**: `git revert` the phase commit. No live metadata carries the new keys yet, so nothing else needs undoing.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Router reach defaults to concurrency 2

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-03 |
| **Deciders** | Measured run, per decision D3 |

---

<!-- ANCHOR:adr-002-context -->
### Context

Barter recorded 11 to 13 `probe-error` rows at concurrency 8 from a busy advisor, and none at 2. The two candidate fixes were a default of 2, or a concurrency-1 retry of `probe-error` rows. `scratch/reach-concurrency.txt` holds the run that decided it.

### Constraints

- D3: the choice comes from a measured run.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: `DEFAULT_CONCURRENCY = 2`.

**How it works**: The measured run reproduced no refusal at either setting on this machine: warm hubs, three sweeps at once, and 48 uncached probes all returned 0 errors. What it did measure is the price of the safer setting: about 0.5 s more per 48 cold probes, and noise of plus or minus 2 s on warm hubs. With that price, the one-line default beats a second retry pass.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Default 2** | One constant; matches every reach run in this goal | Slightly slower on a cold advisor | 8/10 |
| Concurrency-1 retry of `probe-error` rows | Keeps 8 when the advisor is healthy | A second code path that the measured run never exercised | 6/10 |

**Why this one**: Its cost is measured and small, and it removes the condition rather than retrying around it.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- A default run no longer reports advisor load as unreachable phrases.

**What it costs**:
- A fleet run on a cold advisor takes a little longer.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A busier advisor still refuses at 2 | L | The existing exit-75 retry stays in place |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Barter's run at 8 returned 11 to 13 probe errors |
| 2 | **Beyond Local Maxima?** | PASS | Both fixes were weighed; the default was measured at 8 and 2, and the retry path had nothing to retry because no run refused |
| 3 | **Sufficient?** | PASS | Barter's runs at 2 passed |
| 4 | **Fits Goal?** | PASS | The parent goal asks for a reach-default test |
| 5 | **Open Horizons?** | PASS | `--concurrency` still overrides the default |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `ci-router-vocabulary-reach.cjs`: `DEFAULT_CONCURRENCY` becomes 2, exported for a test that pins it.

**How to roll back**: `git revert` the phase commit.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Track generated signals | The specced definition flags 184 mostly curated signals (151 as first counted) and turns CI red under D2 | The orphan definition in `spec.md` scope | ADR-001, REQ-001 to REQ-003 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

- **Q001** asked how an orphan should be defined, given 151 live signals and the CI `--check` caller. Options: "Track generated signals (Recommended)", "Seed keep lists now", "Report-only by default". Answer: "Track generated signals (Recommended)".
<!-- /ANCHOR:operator-answers-verbatim -->

---
