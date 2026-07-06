---
title: "Decision Record: Phase 012 - Rigorous Routing Benchmark and Skill-Advisor Verification"
description: "Decision record defining numeric near-perfect routing floors and a remediation loop for the post-011 sk-design routing-accuracy release gate."
trigger_phrases:
  - "near-perfect routing floors"
  - "advisor confidence floor decision"
  - "gap-to-second decision"
  - "remediation loop authority"
importance_tier: "high"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor"
    last_updated_at: "2026-07-06T00:00:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Reconciled ADR-001/ADR-002 to real evidence; added ADR-003 for accepted descope; added ADR-004 resolving the P2-002 duplicate-benchmark-naming finding from the 009 packet's review"
    next_safe_action: "No further action required; future phase may pick up ADR-003 descoped items or ADR-004's optional cleanup"
---
# Decision Record: Phase 012 - Rigorous Routing Benchmark and Skill-Advisor Verification

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Define Numeric Near-Perfect Routing Floors

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Partially exercised — the hard-gate and router-scored floors (D1 intra, D2, D5, aggregate verdict) are verified against the real existing `benchmark/after-012-routing-rigor/report.json` (verdict PASS, aggregate 100/100). The live-only floors (D1 inter, advisor confidence, gap-to-second, procedure-card selection accuracy, router/live reconciliation) remain unverified because the expanded battery and harness extension were never built; see ADR-003 for the formal descope decision. |
| **Date** | 2026-07-06 |
| **Deciders** | Phase packet owner, user-provided task scope, release owner (to confirm at execution time) |

---

<!-- ANCHOR:adr-001-context -->
### Context

Phase 005 froze parity-benchmark evidence showing D1 intra, D2, and D5 all at 100/100, but against a small, easy 21-24 scenario corpus, and without measuring skill-advisor top-1 confidence, the gap between the top candidate and the next candidate, or procedure-card selection accuracy at all. Phase 012 plans a materially larger battery (at least 60 scenarios/prompts) after Phases 006-011 land. A larger, harder battery will not automatically reproduce 100/100 scores, and without an explicit numeric definition of "near-perfect," a future release claim could rest on route-only success or an easy-corpus artifact rather than rigorous evidence.

### Constraints

- Floors must be evidence-linked to `benchmark/baseline/` and `benchmark/after-009/`, not chosen arbitrarily.
- D5 connectivity is a hard gate in the existing harness (`score-skill-benchmark.cjs`) and must remain an exact 100, with no tolerance, consistent with Phase 005's precedent.
- The advisor confidence floor should reuse the project's own existing Gate 2 skill-routing confidence threshold (0.8) rather than inventing an unrelated number, for repo-wide consistency.
- Gap-to-second must have a defined behavior for prompts with no plausible second candidate (report N/A, not a forced value).
- Floors must be reviewable and adjustable by a later phase without requiring this ADR to be silently reopened.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: The following numeric floors define "near-perfect routing" for the Phase 012 release gate, measured over the expanded post-011 battery:

| Dimension | Floor | Tolerance Rationale |
|-----------|-------|----------------------|
| D1 intra (router mode/card resolution) | >= 98/100 aggregate; 100% for any P0-tagged scenario | Small tolerance for the much larger, harder battery; P0 scenarios (core mode/card triggers) must still resolve at rank 1 |
| D1 inter (advisor skill-id, rank-weighted) | >= 95/100 aggregate | Live-mode-only dimension; slightly larger tolerance than D1 intra because it depends on the advisor's SQLite-backed scorer, not pure router replay |
| D2 discovery | >= 95/100 | Small tolerance for new asset/procedure references introduced by Phases 006-011 that may not yet be fully indexed |
| D5 connectivity (hard gate) | = 100/100, no tolerance | Existing hard-gate philosophy from Phase 005; any structural break must block release outright |
| Advisor top-1 confidence | >= 0.80 per in-domain scenario; >= 0.90 median across the advisor-confidence battery | Reuses the repository's existing Gate 2 skill-routing confidence threshold (0.8) for consistency; median target is stricter than the per-scenario floor |
| Gap-to-second | >= 0.15 for every in-domain scenario with a plausible second candidate; N/A where no plausible second candidate exists | Prevents a "technically top-1" result that is actually a coin-flip against a neighbor skill (for example `sk-code`) |
| Procedure-card selection accuracy | >= 95% of card-selection scenarios overall; 100% for P0-tagged card scenarios | Mirrors the D1-intra tolerance split between aggregate and P0-critical scenarios |
| Router/live reconciliation | At most 1 unexplained divergence per rerun | Any unexplained router/live divergence beyond this is a routing risk that blocks release until documented or fixed |

**How it works**: Once the post-011 rigorous run (`benchmark/after-011/` and `benchmark/after-011-live/`) completes, the release owner compares each measured value against its floor in this table. Every dimension at or above its floor passes; any dimension below its floor triggers ADR-002's remediation loop before a release-ready verdict can be recorded.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-actual-result -->
### Actual Result Against the Real Existing Report (2026-07-06 Reconciliation)

No `after-011/`/`after-011-live/` rerun was performed. Instead, this reconciliation checks each ADR-001 floor against the real, already-existing `benchmark/after-012-routing-rigor/report.json` / `report.md` (verdict `PASS`, aggregate `100/100`, `traceMode: "router"`, `scoringMethod: "mode-a-router-replay"`, 24 total scenarios, 18 scored, 6 routed out to browser). That report scores the **same, non-expanded** 24-scenario corpus as `benchmark/after-009/` — the >=60-scenario expanded battery, the `07--procedure-card-selection/` and `08--advisor-confidence-battery/` categories, and the `advisor-probe.cjs`/`score-skill-benchmark.cjs` `topConfidence`/`gapToSecond` extension were never built.

| Dimension | Floor | Actual Value (report.json) | Result | Citation |
|-----------|-------|------------------------------|--------|----------|
| D1 intra (router mode/card resolution) | >= 98/100 aggregate; 100% P0 scenarios | `dimensionScores.D1intra.score = 100` | **PASS** | `report.json` `dimensionScores.D1intra`; all 12 `routing`-class scenarios (AI-001-003, TV-001-005, SR-001-004) score 100/100 in `report.md` Scenarios table |
| D1 inter (advisor skill-id, rank-weighted) | >= 95/100 aggregate | `dimensionScores.D1inter.score = null`, `status: "unscored-mode-a"` | **UNSCORED** — live-mode-only dimension, not measured by this router-mode run | `report.json` `dimensionScores.D1inter`, `unscoredDimensions: ["D1inter","D4"]` |
| D2 discovery | >= 95/100 | `dimensionScores.D2.score = 100` | **PASS** | `report.json` `dimensionScores.D2` |
| D5 connectivity (hard gate) | = 100/100, no tolerance | `dimensionScores.D5.score = 100`, `gate.d5Score = 100`, `gate.gateFailed = false` | **PASS** | `report.json` `gate` |
| Advisor top-1 confidence | >= 0.80 per scenario; >= 0.90 median | Not present in `report.json`; the `advisor-probe.cjs` `topConfidence` extension named in `plan.md` T011 was never built | **UNSCORED / NOT MEASURED** — no harness instrumentation exists to compute this value | Confirmed via `git status` showing zero diff to `advisor-probe.cjs` |
| Gap-to-second | >= 0.15 (N/A if no plausible second candidate) | Not present in `report.json`; the `gapToSecond` extension named in `plan.md` T011 was never built | **UNSCORED / NOT MEASURED** | Same as above |
| Procedure-card selection accuracy | >= 95% overall; 100% P0 | No `07--procedure-card-selection/` category exists in this corpus; `coverage.routing = 12`, `coverage.advisor = 6`, matching the original `after-009`-era category shape | **UNSCORED / NOT MEASURED** — dedicated card-selection scenarios were never authored | `report.json` `coverage`; `manual_testing_playbook/` category count unchanged from Phase 011 |
| Router/live reconciliation | At most 1 unexplained divergence per rerun | No live-mode rerun (`after-011-live/`) exists to compare against | **NOT APPLICABLE** — nothing to reconcile without a live-mode counterpart | Confirmed via directory listing: only `benchmark/after-012-routing-rigor/` exists, no `after-011-live/` sibling |

**Verdict on ADR-001 as a whole**: Every floor this run is actually capable of measuring (D1 intra, D2, D5, aggregate verdict) is met or exceeded. Every floor requiring the unbuilt expanded battery or harness extension is honestly recorded as UNSCORED/NOT MEASURED, never defaulted to a pass. ADR-003 records the decision to accept this narrower evidence as Phase 012's closeout rather than leaving the phase indefinitely "Planned."
<!-- /ANCHOR:adr-001-actual-result -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Numeric floors evidence-linked to baseline/after-009, with D5 as a hard 100 gate** | Testable, prevents route-only false confidence, reuses existing repo conventions (0.8 advisor threshold, hard D5 gate) | Requires the release owner to accept explicit numbers instead of an impression | 9/10 |
| Require exact 100/100 across every dimension | Simplest rule to state | Brittle against a much larger, harder battery; a single edge-case scenario could block release for a non-representative reason | 4/10 |
| Qualitative "looks right" verdict, no numeric floor | Fast, no measurement design needed | Exactly the failure mode Phase 012 exists to close; indistinguishable from Phase 005's route-only risk | 2/10 |
| Numeric floors without a distinct gap-to-second metric (confidence only) | Simpler to implement | Misses the specific failure mode of a technically-top-1 result that is actually ambiguous against a neighbor skill | 6/10 |

**Why this one**: A numeric, evidence-linked floor set with an explicit hard gate (D5) and an explicit advisory-but-gated pair (confidence, gap-to-second) gives the release owner a testable release gate without pretending a much larger, harder corpus should reproduce the easy corpus's 100/100 scores everywhere.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Release readiness claims become falsifiable against named numbers instead of a qualitative impression.
- Gap-to-second surfaces a routing-ambiguity failure mode that the current corpus and harness do not measure at all today.
- The advisor confidence floor stays consistent with the repository's existing Gate 2 threshold instead of introducing an unrelated number.

**What it costs**:
- The release owner must actively engage with a numeric gate table rather than a single pass/fail verdict. Mitigation: keep the table to eight rows and cite baseline evidence for each floor.
- A borderline dimension (for example D1 inter at 94/100) creates a judgment call between "block" and "accepted risk." Mitigation: ADR-002's remediation loop gives that judgment call an explicit owner and process instead of leaving it ad hoc.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Floors are treated as final before any real data exists | M | This ADR is explicitly Proposed, not Accepted, until a real post-011 rigorous run validates the floors are achievable and meaningful |
| Gap-to-second floor is too strict for legitimately close domains | M | The floor is scoped to "plausible second candidate" scenarios only; prompts with no plausible second candidate report N/A, not a forced failure |
| P0-tagged scenario requirement (100%) is too strict for a large battery | L | P0 tagging is limited to core mode/card triggers, not every scenario, keeping the 100% bar narrow and defensible |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Phase 005 shipped without any numeric near-perfect definition or confidence/gap measurement; a future release claim needs one. |
| 2 | **Beyond Local Maxima?** | PASS | The decision compares an exact-100 rule, a qualitative verdict, and a confidence-only metric before choosing the evidence-linked floor set with gap-to-second. |
| 3 | **Sufficient?** | PASS | The floor set covers every dimension named in the phase brief (D1/D2/D5, advisor confidence, gap-to-second, procedure-card selection) without adding unrelated gates. |
| 4 | **Fits Goal?** | PASS | The floors are explicitly tied to the existing Phase 005 baseline/after-009 evidence and the repository's own Gate 2 confidence convention. |
| 5 | **Open Horizons?** | PASS | The table is a proposed starting point; a later phase can revise a specific floor through its own decision record without reopening this ADR's whole structure. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `decision-record.md` (this file) states the floor table as the release-gate authority for Phase 012.
- The future implementation pass compares `benchmark/after-011/` and `benchmark/after-011-live/` results against this table before any release-ready claim.

**How to roll back**: If a floor proves unachievable or miscalibrated once real post-011 data exists, amend this ADR with the release owner rather than silently loosening the number in a report file.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Remediation Loop Trigger, Ownership, and Baseline Promotion Authority

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Exercised once, via outcome (b): the unscored/unmeasured dimensions in ADR-001's Actual Result table are accepted as documented risk under ADR-003 rather than fixed in-scope or handed to a new phase, because nothing that WAS scored fell below its floor |
| **Date** | 2026-07-06 |
| **Deciders** | Phase packet owner, user-provided task scope, release owner (to confirm at execution time) |

---

### Context

ADR-001 defines numeric floors, but a floor without a defined remediation path just becomes a new way to silently ship a known gap. Phase 005 already named a release owner for baseline-overwrite and failure-acceptance decisions; Phase 012 needs the same discipline for (a) a scenario or dimension that misses its ADR-001 floor, and (b) the authority to promote `benchmark/baseline-post-011/` as the new comparison anchor for Phase 013 onward.

### Constraints

- The remediation loop must not silently expand Phase 012's write boundary into `mode-registry.json`, `hub-router.json`, procedure cards, or `skill_advisor.py`.
- Baseline promotion must never overwrite `benchmark/baseline/` or `benchmark/after-009/`.
- Remediation re-runs must be traceable to a specific sibling folder, not an in-place edit of `after-011/`.

### Decision

**We chose**: Any scenario or dimension below its ADR-001 floor triggers the remediation loop. The release owner (named per Phase 005 precedent: the repository owner, delegated to the executing session) decides, for each below-floor item, whether to (a) fix it within Phase 012's existing scope (benchmark corpus, playbook scenarios, or the two named harness files) and re-run only the affected scenario/dimension into a new `after-011-remediation-N/` sibling folder, (b) accept it as a documented risk with written rationale, or (c) hand it to a new remediation phase folder when the fix requires touching `mode-registry.json`, `hub-router.json`, procedure cards, or `skill_advisor.py`. `benchmark/baseline-post-011/` is promoted only after the release owner confirms every P0 floor is met or explicitly accepted as risk.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Release-owner-gated remediation loop with scoped re-runs and phase hand-off for out-of-scope fixes** | Keeps Phase 012's write boundary intact, gives every gap an explicit owner and outcome | Requires the release owner to be available and engaged for each below-floor item | 9/10 |
| Automatic full-battery re-run on any failure | Simple rule | Wastes time re-running scenarios that already passed; obscures which specific fix resolved which gap | 5/10 |
| Silent acceptance of any below-floor result | No process overhead | Reproduces exactly the route-only false-confidence risk this phase exists to close | 1/10 |

**Why this one**: Scoped remediation with an explicit owner and an explicit phase-handoff rule for out-of-scope fixes keeps Phase 012 honest about what it can and cannot fix itself, while still closing the loop on every measured gap.

### Consequences

**What improves**:
- No routing gap can be quietly shipped; every below-floor result has a named owner and a recorded outcome (fixed, accepted-risk, or handed to a new phase).
- Baseline promotion has the same explicit authority discipline Phase 005 already established, extended to the post-011 anchor.

**What it costs**:
- A remediation cycle that needs a registry/procedure-card/advisor-source fix cannot close inside Phase 012; it must wait for a new phase. Mitigation: this is the explicit, intended boundary, not an oversight — it keeps Phase 012's blast radius to benchmark and routing-test surfaces only.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Release owner is unavailable when a gap is found | M | Name the release owner before execution begins, per Phase 005 precedent, so this is confirmed rather than discovered mid-remediation |
| Remediation re-runs proliferate sibling folders | L | Number remediation folders sequentially (`after-011-remediation-1/`, `-2/`, ...) so the history stays navigable |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | ADR-001's floors are meaningless without a defined process for what happens when a floor is missed. |
| 2 | **Beyond Local Maxima?** | PASS | Compares scoped/owned remediation against automatic full re-run and silent acceptance. |
| 3 | **Sufficient?** | PASS | Covers fix-in-scope, accept-as-risk, and hand-off-to-new-phase as the three possible outcomes for any below-floor item. |
| 4 | **Fits Goal?** | PASS | Preserves Phase 012's benchmark/routing-test write boundary while still closing every measured gap to an explicit outcome. |
| 5 | **Open Horizons?** | PASS | A later phase can inherit any handed-off remediation without reopening this ADR. |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**:
- The release-gate verdict in the future implementation pass records, for every below-floor item, which of the three outcomes (fix/accept/hand-off) applied and why.
- `benchmark/baseline-post-011/` promotion is blocked until this record is complete for every P0 floor.

**How to roll back**: If the remediation loop itself proves unworkable (for example the release owner role cannot be staffed), escalate to the user for an amended process rather than silently skipping remediation.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Accept the Existing Narrower Mode A Evidence as Phase 012 Closeout, Formally Descoping the Expanded Battery and Harness Extension

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-06 |
| **Deciders** | Reconciliation session (Sonnet 5), per explicit dispatch scope: doc-only reconciliation, no benchmark harness re-run |

### Context

A real Mode A router-mode benchmark run already exists and passed at `benchmark/after-012-routing-rigor/report.{json,md}` (verdict PASS, aggregate 100/100). This run is content-identical to `benchmark/after-d3-proxy/skill-benchmark-report.{json,md}` (confirmed via `diff`, both files byte-identical), an orphaned duplicate-named artifact from earlier proxy work, left untouched per this reconciliation's scope. The run scores the same 24-scenario corpus as `benchmark/after-009/`; it is not the >=60-scenario expanded battery, procedure-card-selection category, advisor-confidence-battery, or `topConfidence`/`gapToSecond` harness extension that this phase's `plan.md` and `tasks.md` originally described. Before this reconciliation pass, `spec.md` had already been updated (by an earlier, incomplete pass) to state Status: Complete and cite this report, but `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md` still described the original unexecuted expanded-battery plan, and no `implementation-summary.md` existed. This left the packet internally inconsistent.

Separately, `009-sk-design-claude-parity/010-feature-catalog-completeness/` has no `implementation-summary.md` at the time of this reconciliation, meaning `plan.md`'s "Phases 006-011 confirmed complete" Definition-of-Ready gate is not fully satisfied by documentation. This reconciliation does not resolve Phase 010's status; it only records the gap.

### Decision

**We chose**: Accept `benchmark/after-012-routing-rigor/report.{json,md}` as Phase 012's authoritative closeout evidence, exactly as `spec.md`'s reconciled Executive Summary states. Every ADR-001 floor the report can measure (D1 intra, D2, D5, aggregate verdict) is checked and passes; every floor requiring the unbuilt expanded battery or harness extension (D1 inter, advisor confidence, gap-to-second, procedure-card selection, router/live reconciliation) is recorded as UNSCORED/NOT MEASURED across `checklist.md`, `tasks.md`, and this decision record, per ADR-002 outcome (b): accepted as documented risk, because nothing that was actually scored missed its floor. The expanded battery, the `advisor-probe.cjs`/`score-skill-benchmark.cjs` harness extension, and the `benchmark/baseline-post-011/` promotion remain explicitly open and are handed to a future phase rather than silently claimed as done or silently dropped. This reconciliation touches only this phase's own spec-folder documents; it does not re-run the benchmark harness, edit `.opencode/skills/sk-design/**`, or resolve Phase 010's missing `implementation-summary.md`.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Accept existing narrower evidence, formally descope the rest (chosen)** | Matches the real state of the repo; closes an internally inconsistent packet; keeps every unscored floor honestly visible | Phase 012 closes without the originally envisioned rigor increase | 9/10 |
| Claim the full expanded-battery work was completed | Would look like the plan fully succeeded | Fabricates evidence for scenarios, harness fields, and a baseline that do not exist; directly violates NFR-E01 | 1/10 |
| Re-run the harness now to build the expanded battery | Would actually deliver the original plan | Explicitly out of scope for this doc-only reconciliation dispatch; risks scope creep into `.opencode/skills/sk-design/**` | 3/10 |
| Leave the phase "Planned / Not Started" indefinitely | Simplest, no reconciliation needed | Leaves the packet inconsistent with `spec.md`'s own already-reconciled Executive Summary and with the parent packet's Final Verification, which already treats Phase 012 as closed on this evidence | 2/10 |

**Why this one**: The existing report is real, passing evidence for the dimensions it actually measures, and the parent packet already relies on it. Formally descoping the rest — rather than fabricating or hiding it — keeps the packet both closed and honest.

### Consequences

**What improves**: The packet's five tracking docs agree with each other and with the real repo state. Every unmeasured floor stays visible for a future phase instead of being silently dropped.

**What it costs**: Phase 012 does not deliver the originally planned rigor increase (expanded corpus, advisor-confidence/gap-to-second measurement, procedure-card-selection proof, post-011 baseline). A future phase must pick this up explicitly.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A future reader assumes the expanded battery was built because Phase 012 shows Status: Complete | M | This ADR, `implementation-summary.md`, and `checklist.md`'s per-floor UNSCORED rows all state the gap explicitly and repeatedly |
| Phase 010's missing `implementation-summary.md` is forgotten | L | Named explicitly in this ADR's Context and in `implementation-summary.md` Known Limitations; not silently resolved by this reconciliation |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | `spec.md` was already reconciled but `plan.md`/`tasks.md`/`checklist.md`/`decision-record.md` and `implementation-summary.md` were not, leaving the packet internally inconsistent. |
| 2 | **Beyond Local Maxima?** | PASS | Compares fabricating full completion, re-running the harness, leaving the phase stale, and accepting the narrower real evidence. |
| 3 | **Sufficient?** | PASS | Every ADR-001 floor is now checked against real data and recorded PASS or UNSCORED; none is silently skipped. |
| 4 | **Fits Goal?** | PASS | Matches the exact reconciliation pattern already proven for Phases 007 and 009 in this same packet, and matches `spec.md`'s own already-reconciled framing. |
| 5 | **Open Horizons?** | PASS | The descoped expanded-battery work is named as an explicit future-phase candidate, not foreclosed. |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**: `plan.md`, `tasks.md`, `checklist.md`, and this decision record are reconciled to the real evidence in this same pass; `implementation-summary.md` is created; `description.json` and `graph-metadata.json` are regenerated last.

**How to roll back**: If a future phase builds the expanded battery and harness extension, that phase's own decision record supersedes this ADR's descope; this ADR is not silently reopened.
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Designate `after-012-routing-rigor/` as Canonical, `after-d3-proxy/` as a Named-Deprecated Duplicate

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-06 |
| **Deciders** | sk-design/009 review-remediation phase (014), per an active deep-review P2 finding (P2-002) |

### Context

The 10-iteration deep review of the 009 packet (`.opencode/specs/sk-design/009-sk-design-claude-parity/review/review-report.md`, finding P2-002) flagged that `.opencode/skills/sk-design/benchmark/after-012-routing-rigor/{report.json,report.md}` and `.opencode/skills/sk-design/benchmark/after-d3-proxy/{skill-benchmark-report.json,skill-benchmark-report.md}` are byte-identical (confirmed again via `diff`, no output either time) and use two incompatible naming conventions for the exact same benchmark run. ADR-003 above already named `after-d3-proxy/` "an orphaned duplicate-named artifact from earlier proxy work" and explicitly left it untouched, out of scope for that reconciliation pass.

### Decision

**We chose**: Formally designate `after-012-routing-rigor/` as the canonical artifact for this benchmark run (it uses the newer `report.json`/`report.md` convention shared with `after-009/`) and `after-d3-proxy/` as a confirmed, named-deprecated duplicate retained only for historical traceability to the D3-proxy-fix work session that originally produced it. No file is deleted or moved by this decision — Phase 012 is already closed, and removing a tracked artifact from a completed, unrelated phase is out of scope for a review-remediation pass whose own spec.md commits to a documentation resolution for this finding. Any future cleanup pass may act on this designation directly.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Designate canonical + document, no deletion (chosen)** | Resolves the reviewer's actual complaint (ambiguous naming) with zero blast radius on a closed phase; reversible; auditable | The duplicate file still exists on disk until a dedicated cleanup pass removes it | 9/10 |
| Delete `after-d3-proxy/` now | Fully resolves the duplication | Mutates a git-tracked directory that belongs to an already-closed, unrelated phase (012) from within a different phase (014)'s remediation pass — scope escalation beyond what either phase's own documents authorize | 3/10 |
| Rename `baseline/` and `after-d3-proxy/` to the `report.json` convention for full consistency | Uniform naming repo-wide | `skill-benchmark-report.json`/`.md` is referenced by name across many other spec-folder fixtures outside this packet (008-sk-design-parent, 009/005); renaming risks breaking those references for a P2 advisory | 2/10 |
| Leave the finding undocumented | No work needed | Repeats exactly the gap the deep review flagged; the next review cycle would re-find the same P2 | 1/10 |

**Why this one**: The finding is about ambiguity, not about the duplicate file's mere existence. Naming a canonical artifact resolves the ambiguity for any future reader without touching a closed phase's tracked files.

### Consequences

**What improves**: `after-012-routing-rigor/` is now the documented canonical reference for this benchmark run; a future reader hitting the duplicate knows which one to trust and why the other exists.

**What it costs**: The duplicate file remains on disk until an explicit future cleanup pass (out of this phase's scope) removes it.

**Risks**: None beyond that already-accepted duplication risk carried since ADR-003.

**How to roll back**: A future cleanup phase may `git rm -r .opencode/skills/sk-design/benchmark/after-d3-proxy/` directly, citing this ADR, once it owns that blast radius explicitly.
<!-- /ANCHOR:adr-004 -->
