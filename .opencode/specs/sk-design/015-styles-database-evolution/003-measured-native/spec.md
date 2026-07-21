---
title: "Feature Specification: Measured Native Experiments (Roadmap Phase 2)"
description: "Level 2 spec for sk-design 015 phase child 003-measured-native — the conditional, SLO-gated roadmap phase that evaluates sqlite-vec exact search, a Rust ort isolation sidecar, and a bounded Rust parse core, with no Rust as a valid outcome."
trigger_phrases:
  - "measured native experiments roadmap phase 2"
  - "slo crossing entry gate no rust valid outcome"
  - "sqlite-vec ort sidecar bounded rust parse core"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/015-styles-database-evolution/003-measured-native"
    last_updated_at: "2026-07-20T09:19:14Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level 2 planning docs (spec/plan/tasks/checklist/implementation-summary) for phase"
    next_safe_action: "Await parent orchestrator to finalize description.json/graph-metadata.json and run validate.sh"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/_db/retrieval.mjs"
      - ".opencode/skills/sk-design/styles/_db/vectors.mjs"
      - ".opencode/specs/sk-design/015-styles-database-evolution/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Measured Native Experiments (Roadmap Phase 2)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

- **Track:** sk-design
- **Packet:** 015-styles-database-evolution / 003-measured-native
- **Parent:** 015-styles-database-evolution
- **Parent Spec:** `../spec.md`
- **Phase:** 3 of 4 (Roadmap Phase 2 — Measured Native Experiments, conditional)
- **Predecessor:** 002-js-capabilities
- **Successor:** 004-growth
- **Level:** 2
- **Status:** PLANNED
- **Source research:** `sk-design/013-styles-database-rust-opportunities`

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 013 research concluded no Rust rewrite now, but reserved a conditional, measured path for later native work. This phase turns that reservation into a precise, gated procedure: native/Rust experiments run ONLY if a Phase 0 stage crosses a measured SLO, exactly three bounded candidates are in scope, and every candidate must prove an end-to-end oracle win plus byte-for-byte parity before it may replace the TS-owned default path.

### Purpose
Specify the SLO-crossing entry gate, the three candidate evaluations (maintained sqlite-vec exact search, a supervised Rust `ort` isolation sidecar, and a bounded Rust parse core), and the promotion/rejection gate so that any future native work in the styles database follows the sk-code/018 shell/adapter/core shape and never ships on an unmeasured assumption.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The SLO-crossing entry gate, including "no Rust" as an explicitly valid exit
- Definition of the three candidate evaluations and the evidence each needs to be promoted
- The sk-code/018 shell/adapter/core conformance requirement for any Rust introduced
- The residency-honesty requirement applied to every performance claim in this phase

### Out of Scope
- Building or shipping any native/Rust code — this packet is planning-only
- Running the Phase 0 measurement plane itself (owned by `001-foundation`)
- 10x-100x growth scaling work (owned by `004-growth`)
- JS-only capability work (owned by `002-js-capabilities`)

### Files to Change

None in this packet beyond its own spec-folder documentation (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`). The table below is reference-only, orienting future conditional work — nothing in it is modified by this packet.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/styles/_db/retrieval.mjs` | Reference only (not modified) | Current JS retrieval path; potential integration point for a promoted sqlite-vec exact-search candidate |
| `.opencode/skills/sk-design/styles/_db/vectors.mjs` | Reference only (not modified) | Current JS vector math; the surface a bounded Rust parse core or `ort` sidecar would sit behind if promoted |
| sqlite-vec integration point (future) | Reference only (not modified) | Potential native exact-search extension behind the legacy\|shadow\|persistent adapter |
| Rust adapter/core boundary (future, sk-code/018 shape) | Reference only (not modified) | Thin napi-rs adapter + `#![forbid(unsafe_code)]` core, conditional on a measured SLO crossing |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | SLO-crossing entry gate | Each experiment cites the specific stage + measured SLO crossing that authorized it; absent a crossing, the phase resolves to "no Rust." |
| REQ-005 | sk-code/018 shape + oracle-win + parity gate | Every experiment conforms to the sk-code/018 shell/adapter/core shape and passes the end-to-end-win + byte-parity gate, or is rejected. |
| REQ-006 | Residency honesty | Every claim decomposes native vs JS-resident compute; no blended "Rust is faster" claim survives review. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Maintained sqlite-vec / native exact vector search evaluation | Evaluated only on a crossing; must beat the TS oracle end-to-end AND pass byte-for-byte parity to be promoted. |
| REQ-003 | Supervised Rust `ort` inference sidecar (crash/RSS/deployment isolation) | Justified by isolation, not speed; measured RSS/crash-isolation benefit; outputs parity-equal to the Node path. |
| REQ-004 | Bounded Rust parse core | Evaluated only if parse cost is a measured SLO crosser; bounded to exactly one kernel. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every entry into a native/Rust experiment cites a specific named stage plus the measured SLO crossing that authorized it — no experiment starts speculatively
- **SC-002**: Each evaluated candidate (sqlite-vec, `ort` sidecar, bounded parse core) is either promoted (oracle win + byte parity passed) or explicitly rejected with "no Rust" recorded — no candidate is left undecided
- **SC-003**: Zero blended "Rust is faster" claims survive review; every performance claim decomposes native vs JS-resident compute

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `001-foundation` telemetry + pinned TS oracle | Cannot evaluate any candidate without a measured baseline | Hard blocker enforced by the REQ-001 entry gate |
| Dependency | sk-code/018 shell/adapter/core contract | No sanctioned shape for introducing Rust | Every candidate must conform before evaluation proceeds |
| Risk | Premature/speculative Rust adoption | Wastes effort on unmeasured wins, reintroduces unsafe surface | SLO-crossing entry gate + "no Rust" as a valid outcome |
| Risk | Isolation benefit overstated as a speed win | Misleads future maintainers on the `ort` sidecar's purpose | Residency-honesty requirement (REQ-006) on every claim |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Planning-only in this packet; any future win is quantified against a REAL residency decomposition — SQLite/FTS5 is already native, and only vector-JSON fetch + cosine + sort + RRF are JS-resident (RRF candidate-bounded at `MAX_CANDIDATE_K=200`). No blended "Rust is faster" claim is permitted.

### Security
- **NFR-S01**: Any Rust boundary introduced in this phase follows sk-code/018 — `#![forbid(unsafe_code)]` in the core, owned boundary DTOs, and JS-controlled input never reaching `unwrap`/`panic`.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- **Failed byte parity**: a native path that fails byte parity MUST NOT silently replace the exact/default path
- **sqlite-vec exactness boundary**: sqlite-vec (Candidate A) is evaluated strictly as an EXACT vector search path — never treated as an approximate/ANN substitute across the exact/default boundary

### Error Scenarios
- **No SLO crossing**: absent an SLO crossing, the phase correctly resolves to "no Rust" — a valid, documented terminal outcome, not a blocker
- **sqlite-vec fails the oracle-win gate**: rejected, "no Rust" recorded for that candidate; the JS exact path remains authoritative
- **`ort` sidecar isolation benefit doesn't outweigh deployment complexity**: rejected, and the decision is recorded against the relevant open question
- **A perf claim credits already-native FTS5/SQLite work to a Rust change**: rejected in review per REQ-006

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Planning-only; 0 LOC shipped in this packet — narrow, well-bounded scope |
| Risk | 10/25 | Conditional; risk activates only if a Phase 0 stage crosses a measured SLO, otherwise zero-risk ("no Rust") |
| Research | 3/20 | Grounded — sourced from `sk-design/013-styles-database-rust-opportunities` (20-iteration deep research) |
| **Total** | **21/70** | **Level 2** |

<!-- /ANCHOR:complexity -->
---

## 10. OPEN QUESTIONS

- Which stage (JSON-fetch/decode, cosine+sort, or embedding throughput) crosses an SLO first, if any?
- Does sqlite-vec's maintenance/portability profile clear the bar vs. a JS exact path?
- Does the `ort` sidecar's isolation benefit outweigh its deployment complexity?

<!-- /ANCHOR:questions -->
