---
title: "Decision Record: Phase 001 — Baseline Ownership Gate"
description: "Accepted ownership, threshold, rollback, and invariant decisions for the sk-design Claude-parity baseline gate."
trigger_phrases:
  - "decision record"
  - "baseline ownership"
  - "sk-design"
  - "rollback"
  - "threshold authority"
importance_tier: "high"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/sk-design/009-sk-design-claude-parity/001-baseline-ownership-gate/"
    last_updated_at: "2026-07-05"
    last_updated_by: "openai-gpt-5.5"
    recent_action: "Recorded accepted baseline ownership decisions for Phase 001."
    next_safe_action: "Later phases may proceed only while preserving these ownership, threshold, rollback, and parent-invariant decisions."
---
# Decision Record: Phase 001 — Baseline Ownership Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-derived-from-level3 | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-05 |
| **Decider** | Repository owner, delegated to this session for Phase 001 gate closure |
| **Scope** | `.opencode/specs/sk-design/009-sk-design-claude-parity/001-baseline-ownership-gate/` documentation only |
| **Source Evidence** | Clean scoped `sk-design` status/diff, fresh benchmark artifact `/tmp/skd-bench-phase001/report.json`, parent hub files read directly |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:context -->
## Context

The sk-design Claude-parity refactor needs a stable baseline before later phases make implementation changes. The live repository already contains a committed sk-design parent-hub baseline with `SKILL.md`, `mode-registry.json`, `hub-router.json`, `graph-metadata.json`, benchmark artifacts, and manual testing playbook content. Phase 001 exists to confirm ownership of that baseline, freeze comparison evidence, and state the rollback and threshold rules that later phases must preserve.

Fresh evidence collected on 2026-07-05:

| Evidence | Result |
|----------|--------|
| Current HEAD | `ba8906743c1b1e327ff4d4a758bb9d67e9d6c8ed` |
| Scoped status | `git status --short -- ".opencode/skills/sk-design"` returned no output |
| Scoped diff | `git diff --name-status -- ".opencode/skills/sk-design"` returned no output |
| Scoped diff stat | `git diff --stat -- ".opencode/skills/sk-design"` returned no output |
| Fresh benchmark | `/tmp/skd-bench-phase001/report.json` generated with verdict `CONDITIONAL`, aggregate `69`, 21 scenarios, 15 scored, 6 browser-routed, D5 `100`, no hub-route or tool-surface gate failures |
| Committed baseline | `.opencode/skills/sk-design/benchmark/baseline/skill-benchmark-report.json` matches the same router-mode headline values and remains preserved |

<!-- /ANCHOR:context -->
---

<!-- ANCHOR:decisions -->
## Decisions

### Decision 1: Preserve the committed sk-design parent-hub baseline

**Decision**: Preserve all committed `sk-design` baseline artifacts. Do not revert, absorb, overwrite, or reclassify them in Phase 001.

**Rationale**: Scoped status and diff for `.opencode/skills/sk-design` returned no output, so there are no pending `sk-design` changes requiring file-by-file ownership classification. The parent-hub baseline is already committed at current `HEAD` and is the comparison anchor for later phases.

**Consequences**:
- Later phases compare against the committed baseline plus the fresh Phase 001 artifact at `/tmp/skd-bench-phase001/report.json`.
- `.opencode/skills/sk-design/benchmark/baseline/**` remains read-only for later phases unless a separate explicit owner decision authorizes a new sibling baseline location.
- No `.opencode/skills/sk-design/**` file is edited by Phase 001.

### Decision 2: Freeze the Phase 001 benchmark as the comparison baseline for later phases

**Decision**: Use the fresh router-mode benchmark artifact `/tmp/skd-bench-phase001/report.json` as the Phase 001 frozen comparison baseline.

**Rationale**: The canonical benchmark command completed successfully and produced `verdict=CONDITIONAL aggregate=69 scenarios=21`. The generated JSON shows D1 intra `100`, D2 `100`, D3 `0` as a router-mode measurement gap, D5 `100`, `hubRoute.failed=false`, `toolSurface.failed=false`, and `toolSurface.violations=[]`.

**Consequences**:
- Later phases must keep verdict at least `CONDITIONAL` and aggregate score `>= 69` for the same router-mode corpus.
- Any D5 hard-gate failure, hub-route regression, or read-only mode tool-surface violation blocks later-phase closure.
- D1 inter and D4 remain unscored in router mode and require live-mode evidence if a later phase claims those dimensions improved.

### Decision 3: Repository owner is the release and threshold authority for this gate

**Decision**: The repository owner is the release and threshold authority for Phase 001, delegated to this session by the user instruction for this autonomous run.

**Rationale**: The user explicitly supplied release/threshold authority for this run and instructed this session to record decisions plainly rather than leaving authority as an open question.

**Consequences**:
- No open authority blocker remains for Phase 001.
- Later phases may use the thresholds in `plan.md` unless the repository owner records a replacement threshold decision.

### Decision 4: Rollback is non-destructive first; destructive checkout requires explicit confirmation

**Decision**: Rollback starts with inspection using `git diff` against current `HEAD` `ba8906743c1b1e327ff4d4a758bb9d67e9d6c8ed`. Destructive checkout, reset, stash, cleanup, or commit actions require explicit user confirmation and are not part of Phase 001 execution.

**Rationale**: The workspace may contain concurrent user or agent changes outside this phase. Non-destructive inspection preserves unrelated work and keeps ownership legible.

**Consequences**:
- No git mutation command is needed or allowed for Phase 001 closure.
- Later phases must stop and escalate if rollback would touch unowned paths.

### Decision 5: Parent invariants are hard gates for later phases

**Decision**: Later phases must preserve the parent-hub invariants recorded in `spec.md`: one `sk-design` parent hub; five modes routed by `mode-registry.json`; four read-only advisory modes using only `Read`, `Glob`, and `Grep`; `design-md-generator` as the only mutating mode; exactly one skill-level `graph-metadata.json`; committed benchmark baseline preserved; 21-scenario manual playbook coverage preserved unless explicitly changed.

**Rationale**: The Phase 001 evidence re-read `SKILL.md`, `mode-registry.json`, `benchmark/README.md`, the manual testing playbook, and the graph metadata path. These files define the baseline architecture that the Claude-parity refactor must not silently change.

**Consequences**:
- Any later phase that requires a read-only advisory mode to write, edit, or run Bash violates this gate.
- Any later phase that creates mode-packet `graph-metadata.json` files violates this gate.
- Corpus or baseline changes require a new explicit decision before they can be treated as accepted movement rather than regression.

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:alternatives -->
## Alternatives Considered

| Alternative | Why Rejected |
|-------------|--------------|
| Absorb pending `sk-design` changes into Phase 001 | No pending scoped `sk-design` changes exist; absorbing nothing would create false authorship. |
| Overwrite `.opencode/skills/sk-design/benchmark/baseline/**` with the fresh run | The committed baseline is an ownership anchor; Phase 001 evidence belongs in `/tmp/skd-bench-phase001/` and later comparisons should write outside `benchmark/baseline/`. |
| Leave threshold authority open | The user delegated repository-owner authority to this session for this run, so leaving it open would contradict the task instruction. |
| Manually allow read-only design modes to require mutating tools in later phases | This contradicts the parent hub contract and would break the Phase 001 ownership gate. |

<!-- /ANCHOR:alternatives -->
---

<!-- ANCHOR:handoff -->
## Handoff

Later phases are clear to proceed only if they preserve the decisions above and re-run their own evidence checks before claiming completion. A later phase must stop and record a new decision if it needs to change benchmark corpus shape, lower thresholds, overwrite committed baseline artifacts, add graph metadata under a mode packet, or expand a read-only advisory mode beyond `Read`, `Glob`, and `Grep`.

<!-- /ANCHOR:handoff -->
