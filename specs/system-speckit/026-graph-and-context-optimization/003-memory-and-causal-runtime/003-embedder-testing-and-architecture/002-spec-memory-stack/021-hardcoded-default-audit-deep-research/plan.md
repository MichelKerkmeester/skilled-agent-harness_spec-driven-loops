---
title: "Implementation Plan: Hardcoded-Default Audit Deep-Research"
description: "Reconstructed delivery plan for the 021-hardcoded-default-audit-deep-research packet, derived from spec.md and git history."
trigger_phrases:
  - "hardcoded default audit plan"
  - "deep research loop plan"
importance_tier: "important"
contextType: "research"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Implementation Plan: Hardcoded-Default Audit Deep-Research

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown spec docs plus the deep-research loop's JSON/JSONL state files |
| **Framework** | `/deep:start-research-loop:auto` deep-research workflow |
| **Storage** | `research/` state files |
| **Testing** | Not recorded |

### Overview

The packet dispatches a 10-iteration deep-research loop through cli-opencode + deepseek-v4-pro to enumerate every inline default across five subsystems (spec-memory, CocoIndex, skill-advisor, code-graph, rerank-sidecar), identify ADR-implementation drift like the BAAI and jina-embeddings-v3 leftovers that packet 020 fixed, and produce a remediation roadmap. The loop's `research/research.md` synthesis is the input to a follow-on remediation packet.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done

- [ ] All acceptance criteria met
- [ ] `research/research.md` records the findings table, severity classification and remediation roadmap
- [ ] Strict validation passes after the loop completes

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Single-step dispatch: the deep-research loop workflow owns setup, iteration, convergence detection, state reduction and synthesis; this packet supplies the scope charter and the five-subsystem audit surface.

### Key Components

- **`spec.md`**: scope charter, the five subsystems, R1-R10 and success criteria
- **`research/deep-research-config.json`**: executor and iteration budget; immutable during a run
- **`research/deep-research-strategy.md`**: persistent strategy and reducer-owned sections
- **`research/deep-research-state.jsonl`**: append-only per-iteration log
- **`research/findings-registry.json`** and **`research/deep-research-dashboard.md`**: reducer outputs
- **`research/research.md`**: canonical synthesis, owned by the loop

### Data Flow

`spec.md` sets scope; the loop initializes the `research/` state files; each iteration runs one focused investigation via cli-opencode + deepseek-v4-pro; the reducer updates strategy, dashboard and registry; the loop stops on convergence (`newInfoRatio < 0.05`) or at the 10-iteration cap; synthesis writes `research/research.md` and emits `research/resource-map.md`.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Not recorded. The retained sources describe a research loop with per-iteration acceptance checks in `tasks.md`, not a test suite.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Packet 020 precedent (Shape C helper pattern) | Internal | Not recorded | The remediation roadmap loses its fix-shape precedent |
| `/deep:start-research-loop:auto` workflow and YAML | Internal | Not recorded | The loop cannot initialize |
| cli-opencode + opencode-ai 1.14.51 executor | External | Not recorded | Iterations cannot run without an executor |
| system-spec-kit MCP (findings registry and continuity save) | Internal | Not recorded | Registry and continuity save degrade; the loop stays resumable |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Not recorded.
- **Procedure**: N/A. Research-only packet; it changes no runtime behavior. An interrupted loop is resumable or restartable through its own lifecycle.

<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Loop setup | None | Iteration |
| Iteration (up to 10) | Loop setup | Synthesis |
| Synthesis and verification | Iteration convergence or cap | Follow-on remediation packet |

<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Loop setup | Not recorded | Not recorded |
| Iteration (up to 10) | Not recorded | ~1-2.5 hours wall-clock total per spec.md estimate |
| Synthesis and verification | Not recorded | Not recorded |
| **Total** | | **~1-2.5 hours wall-clock per spec.md estimate** |

<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure

1. Stop the loop; resume or restart it through its own lifecycle when another run is wanted.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: N/A. Research-only packet; no data changes.

<!-- /ANCHOR:enhanced-rollback -->
