# Barter Deal Templates — Tasks

| Field | Value |
|-------|-------|
| **Last Updated** | 2026-02-06 |
| **Total Tasks** | 21 |
| **Total Phases** | 4 (active) + 1 (testing) |
| **Estimated Time** | ~11 hours |

---

## Task Summary

| Phase | Name | Tasks | Duration | Status |
|-------|------|-------|----------|--------|
| Phase 1 | Core Setup | 3 | 1 hr | **Complete** |
| Phase 2 | Core KB (MVS) | 5 | 4 hr | **Complete** |
| Phase 3 | Context Modules | 5 | 3 hr | **Complete** |
| Phase 4 | Quality and Validation | 5 | 2 hr | Pending |
| Phase 5 | Integration Testing | 3 | 1 hr | Pending |
| **Total** | | **21** | **~11 hr** | |

---

## Phase 1 — Core Setup (1 hour)

| ID | Task | Description | Status | Est. |
|----|------|------------|--------|------|
| T1.1 | Create folder structure | Create `/knowledge base/` directory, `/export/` directory, verify `/context/` and `/memory/` exist | **Complete** | 10 min |
| T1.2 | Update AGENTS.md | Rewrite with deal-specific role, export protocol, reading instructions referencing DT knowledge base files | **Complete** | 30 min |
| T1.3 | Update README.md | Add system overview, file inventory, quick start guide, architecture diagram | **Complete** | 20 min |

---

## Phase 2 — Core Knowledge Base / MVS (3 hours)

| ID | Task | Description | Status | Est. |
|----|------|------------|--------|------|
| T2.1 | Create DT - System Prompt | Core smart routing logic (detection signals, confidence thresholds, fallback chain), DEAL scoring (25-point with granular per-point breakdown), variation scaling config, DEPTH adaptive rounds, command shortcut dispatch, export path naming | **Complete** | 75 min |
| T2.2 | Create DT - Brand Context | Extend Copywriter Brand Context v0.111 with deal-specific voice patterns, deal tone per type (product=informative, service=experiential), EUR formatting rules | **Complete** | 30 min |
| T2.3 | Copy DT - HVR v0.100 | Copy Human Voice Rules from Copywriter knowledge base, verify identical content, add deal-specific examples to quick reference | **Complete** | 10 min |
| T2.4 | Create DT - DEPTH Framework | Adapt Copywriter DEPTH v0.112: replace MEQT with DEAL, exclude RICCE and framework selection (DR-018), simplify state YAML, adapt 7/10/5/1-3 rounds, keep cognitive rigor and two-layer transparency | **Complete** | 60 min |
| T2.5 | Create DT - Standards | Output artifact format (system header + Processing Summary), command shortcuts ($product/$service/$quick/$improve/$score/$hvr), variation labeling convention, export file structure, chat summary format | **Complete** | 30 min |

**MVS Checkpoint:** After T2.3, the 4 MVS files (AGENTS.md, System Prompt, Brand Context, HVR) are complete. System can generate basic deals.

---

## Phase 3 — Context Modules (3 hours)

| ID | Task | Description | Status | Est. |
|----|------|------------|--------|------|
| T3.1 | Create DT - Deal Type Product | Product deal template structure, section-by-section guidance, 2-3 annotated examples (Rituals, HEMA), value ranges, common patterns | **Complete** | 45 min |
| T3.2 | Create DT - Deal Type Service | Service deal template structure, section-by-section guidance, 2-3 annotated examples (Spaghetteria, spa), atmosphere guidance | **Complete** | 45 min |
| T3.3 | Create DT - Industry Modules | Industry-specific vocabulary and examples for 5 verticals: fashion/beauty, food/hospitality, tech, health/wellness, home/lifestyle | **Complete** | 45 min |
| T3.4 | Create DT - Market Data | Pricing benchmarks, recommended value ranges, compensation thresholds, competitor platform pricing for context | **Complete** | 20 min |
| T3.5 | Create DT - Interactive Mode | 3 question templates (Deal Brief 9Q, Quick Deal 4Q, Improve Existing 3Q), activation triggers, two-layer transparency, response format pattern | **Complete** | 30 min |

---

## Phase 4 — Quality and Validation (2 hours)

| ID | Task | Description | Status | Est. |
|----|------|------------|--------|------|
| T4.1 | Test product deal generation | Generate 3 product deals, score each with DEAL rubric, verify DEAL 19+ | Pending | 30 min |
| T4.2 | Test service deal generation | Generate 3 service deals, score each with DEAL rubric, verify DEAL 19+ | Pending | 30 min |
| T4.3 | HVR compliance audit | Scan all test outputs for HVR violations: hard blockers, em dashes, semicolons, structural patterns | Pending | 15 min |
| T4.4 | Export protocol verification | Verify file naming convention, sequential numbering, path accessibility, chat-only summary display | Pending | 15 min |
| T4.5 | DEAL scoring calibration | Compare automated DEAL scores with manual assessment, adjust weights if needed | Pending | 30 min |

---

## Phase 5 — Integration Testing (1 hour)

| ID | Task | Description | Status | Est. |
|----|------|------------|--------|------|
| T5.1 | Cross-system voice audit | Compare Deal Templates output with Copywriter and LinkedIn outputs for voice consistency | Pending | 20 min |
| T5.2 | Context window measurement | Count lines for always-loaded content, verify under 2,000 line budget | Pending | 20 min |
| T5.3 | Full workflow test | End-to-end: user request -> DEPTH processing -> DEAL scoring -> export -> chat summary, timed | Pending | 20 min |

---

## Task-to-Checklist Cross-Reference

| Task | Checklist Items | Category |
|------|----------------|----------|
| T1.1 | P0-001 through P0-004 | Folder structure |
| T1.2 | P0-005 through P0-008 | AGENTS.md configuration |
| T1.3 | P0-009 | README.md |
| T2.1 | P1-001 through P1-005, P1-027, P1-028 | System Prompt + Smart Routing |
| T2.2 | P1-006, P1-007 | Brand Context |
| T2.3 | P1-008 | HVR copy |
| T2.4 | P1-009, P1-010 | DEPTH adaptation |
| T2.5 | P1-011 through P1-015, P1-020 through P1-026 | Standards + Commands + Output Format |
| T3.1 | P2-001, P2-002 | Product deal type |
| T3.2 | P2-003, P2-004 | Service deal type |
| T3.3 | P2-005 through P2-009 | Industry modules |
| T3.4 | P2-010 | Market data |
| T3.5 | P1-016 through P1-019, P2-011, P2-012 | Interactive Mode |
| T4.1-T4.5 | P3-001 through P3-019 | Quality validation |
| T5.1-T5.3 | P3-020 through P3-022 | Integration testing |

---

## Dependencies

```
T1.1 ──► T1.2 ──► T2.1 ──► T2.2
                         ──► T2.3
                         ──► T2.4
                         ──► T2.5
                              │
              T2.1-T2.5 ─────► T3.1
                          ────► T3.2
                          ────► T3.3
                          ────► T3.4
                          ────► T3.5
                                 │
                   T3.1-T3.5 ───► T4.1-T4.5
                                       │
                          T4.1-T4.5 ───► T5.1-T5.3
```
