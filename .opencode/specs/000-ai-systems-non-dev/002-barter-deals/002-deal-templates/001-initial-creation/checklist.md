# Barter Deal Templates — Checklist

| Field | Value |
|-------|-------|
| **Last Updated** | 2026-02-06 |

---

## Completion Summary

| Category | Total | Complete | Remaining |
|----------|-------|----------|-----------|
| P0 — Setup | 10 | 10 | 0 |
| P1 — Core KB | 28 | 28 | 0 |
| P2 — Context Modules | 12 | 12 | 0 |
| P3 — Quality and Integration | 22 | 1 | 21 |
| **Total** | **72** | **51** | **21** |

---

## P0 — Setup and Prerequisites

### Folder Structure

- [x] P0-001: `/knowledge base/` directory exists
- [x] P0-002: `/export/` directory exists
- [x] P0-003: `/context/` directory exists with `barter_deal_templates.md`
- [x] P0-004: `/memory/` directory exists with README.md

### Configuration

- [x] P0-005: AGENTS.md updated with deal-specific role (-> Task T1.2)
- [x] P0-006: AGENTS.md export protocol references deal naming convention
- [x] P0-007: AGENTS.md reading instructions reference DT knowledge base files
- [x] P0-008: AGENTS.md processing hierarchy configured
- [x] P0-009: README.md updated with system overview and file inventory
- [x] P0-010: Spec folder created with spec.md, plan.md, decision-record.md, tasks.md, checklist.md, style-guide.md, examples.md

---

## P1 — Core Knowledge Base (MVS)

### System Prompt (-> Task T2.1)

- [x] P1-001: DEAL scoring system defined (25-point rubric, 19+ threshold)
- [x] P1-002: Smart routing logic for product vs service deals
- [x] P1-003: Variation scaling configuration (9/6/3, description only)
- [x] P1-004: DEPTH adaptive rounds configured (7/10/5/1-3)
- [x] P1-005: Template structure defined (fixed vs variable sections)

### Brand Context (-> Task T2.2)

- [x] P1-006: Extended from Copywriter Brand Context v0.111
- [x] P1-007: Deal-specific voice patterns added (product tone, service tone)

### HVR and DEPTH (-> Tasks T2.3, T2.4)

- [x] P1-008: HVR v0.100 copied from Copywriter knowledge base
- [x] P1-009: DEPTH framework adapted with adaptive rounds
- [x] P1-010: Deal-specific phase guidance added to DEPTH

### Standards (-> Task T2.5)

- [x] P1-011: Output formatting rules defined
- [x] P1-012: Artifact header format specified
- [x] P1-013: DEAL score display format defined
- [x] P1-014: Variation labeling convention set
- [x] P1-015: Export file naming convention documented

### Interactive Mode (-> Task T3.5)

- [x] P1-016: Deal Brief question template defined (9 questions)
- [x] P1-017: Quick Deal question template defined (4 questions)
- [x] P1-018: Improve Existing question template defined (3 questions)
- [x] P1-019: Activation triggers documented (no brand, no type, no value, ambiguous)

### Command Shortcuts (-> Task T2.5)

- [x] P1-020: $product command defined with routing and loading
- [x] P1-021: $service command defined with routing and loading
- [x] P1-022: $quick command defined with minimal Interactive Mode
- [x] P1-023: $improve, $score, $hvr commands defined

### Output Artifact Format (-> Task T2.5)

- [x] P1-024: System header format defined (Mode, DEAL score, Template version)
- [x] P1-025: Processing Summary format defined (file path, score breakdown, HVR status)
- [x] P1-026: Variation labeling convention defined (A/B/C with tone labels)

### Smart Routing (-> Task T2.1)

- [x] P1-027: Deal type detection signals documented (product vs service)
- [x] P1-028: Confidence thresholds defined (90%+ high, 60-89% medium, <60% low)

---

## P2 — Context Modules

### Deal Type Files (-> Tasks T3.1, T3.2)

- [x] P2-001: Product deal template structure documented
- [x] P2-002: Product deal annotated examples (2-3)
- [x] P2-003: Service deal template structure documented
- [x] P2-004: Service deal annotated examples (2-3)

### Supporting Modules (-> Tasks T3.3, T3.4, T3.5)

- [x] P2-005: Industry module — Fashion and beauty
- [x] P2-006: Industry module — Food and hospitality
- [x] P2-007: Industry module — Tech and gadgets
- [x] P2-008: Industry module — Health and wellness
- [x] P2-009: Industry module — Home and lifestyle
- [x] P2-010: Market data — Pricing benchmarks and value ranges
- [x] P2-011: Interactive mode — Clarification flows
- [x] P2-012: Interactive mode — Missing information prompts

---

## P3 — Quality and Integration

### Deal Generation Testing (-> Tasks T4.1, T4.2)

- [ ] P3-001: Product deal test 1 generated and scored DEAL 19+
- [ ] P3-002: Product deal test 2 generated and scored DEAL 19+
- [ ] P3-003: Product deal test 3 generated and scored DEAL 19+
- [ ] P3-004: Service deal test 1 generated and scored DEAL 19+
- [ ] P3-005: Service deal test 2 generated and scored DEAL 19+
- [ ] P3-006: Service deal test 3 generated and scored DEAL 19+

### HVR Compliance (-> Task T4.3)

- [ ] P3-007: All test outputs scanned for em dashes — zero found
- [ ] P3-008: All test outputs scanned for semicolons — zero found
- [ ] P3-009: All test outputs scanned for hard blocker words — zero found
- [ ] P3-010: All test outputs scanned for "not just X, but also Y" — zero found
- [ ] P3-011: All test outputs scanned for exactly 3-item lists — zero found
- [ ] P3-012: All test outputs scanned for setup language — zero found

### Export Protocol (-> Task T4.4)

- [ ] P3-013: Export path `/export/` writable
- [ ] P3-014: File naming follows `[###] - deal-[type]-[brand].md` pattern
- [ ] P3-015: Sequential numbering works correctly
- [ ] P3-016: Chat shows file path + summary only (not full content)

### DEAL Scoring (-> Task T4.5)

- [ ] P3-017: DEAL scores correlate with manual quality assessment
- [ ] P3-018: Score 23+ deals are genuinely high quality
- [ ] P3-019: Score < 19 deals correctly identified as needing revision

### Integration Testing (-> Tasks T5.1, T5.2, T5.3)

- [ ] P3-020: Voice consistency with Copywriter confirmed
- [x] P3-021: Always-loaded content under 2,000 lines (verified: ~1,692 lines)
- [ ] P3-022: End-to-end workflow completes in under 2 minutes
