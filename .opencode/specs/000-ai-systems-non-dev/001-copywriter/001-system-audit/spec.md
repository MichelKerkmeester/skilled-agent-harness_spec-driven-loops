# Spec: Copywriter AI System Audit

| Field | Value |
|---|---|
| **Spec ID** | 001 |
| **Title** | Copywriter AI System — Bug & Misalignment Audit |
| **Status** | Complete |
| **Level** | 3 (Complex/Architectural) |
| **Created** | 2026-02-11 |
| **Author** | @orchestrate (automated analysis) |

## Objective

Comprehensive audit of the Barter Copywriter AI system to identify bugs, contradictions, misalignments, and architectural issues across all 9 knowledge base files, 2 shared global files, and 5 export deliverables.

## Scope

### In Scope
- All files in `/1. Copywriter/knowledge base/` (system, context, rules)
- `AGENTS.md` (entry point)
- Shared files in `/0. Global (Shared)/` (Token Budget, Human Voice Rules)
- Export deliverables in `/1. Copywriter/export/`
- Cross-file consistency analysis
- Token budget validation
- Scoring system integrity
- State machine analysis
- Processing flow analysis

### Out of Scope
- Other Barter agents (if they exist beyond "1. Copywriter")
- Actual content quality of the 5 exports (only structural analysis)
- Platform-specific deployment issues
- User workflow optimization (separate effort)

## System Under Analysis

```
1. Copywriter/
├── AGENTS.md (Entry point, 154 lines, ~10 KB)
├── knowledge base/
│   ├── system/
│   │   ├── System Prompt v0.822 (773 lines, ~52 KB)
│   │   ├── Interactive Mode v0.414 (490 lines, ~32 KB)
│   │   └── DEPTH Framework v0.114 (371 lines, ~25 KB)
│   ├── context/
│   │   ├── Frameworks v0.111 (470 lines, ~32 KB)
│   │   ├── Brand Extensions v0.102 (114 lines, ~8 KB)
│   │   ├── Market Extensions v0.102 (154 lines, ~10 KB)
│   │   └── Standards v0.113 (248 lines, ~17 KB)
│   └── rules/
│       └── HVR Extensions v0.102 (62 lines, ~4 KB)
├── export/ (5 deliverables)
├── context/ (empty working dir)
└── memory/ (empty)

0. Global (Shared)/
├── system/Token Budget v0.100 (237 lines, ~16 KB)
└── rules/Human Voice v0.101 (708 lines, ~48 KB)
```

**Total Knowledge Base:** ~2,836 lines, ~190 KB (~47,500 tokens)
**Total with Shared:** ~3,781 lines, ~254 KB (~63,500 tokens)

## Key Findings Summary

| # | Bug | Severity | Category |
|---|-----|----------|----------|
| 1 | Triple processing flow conflict | HIGH | Authority |
| 2 | Token budget exceeds own ceiling | CRITICAL | Budget |
| 3 | MEQT scoring floor contradictions | HIGH | Scoring |
| 4 | DEPTH round count mismatch | CRITICAL | Framework |
| 5 | HVR penalty divergence (global vs extensions) | HIGH | Scoring |
| 6 | State machine dead states | MEDIUM | UX |
| 7 | Export protocol no error handling | MEDIUM | Protocol |
| 8 | Triple framework selection logic | MEDIUM | Routing |
| 9 | Cognitive overload (200+ rules) | CRITICAL | Architecture |
| 10 | Variation × DEPTH combinatorial explosion | HIGH | Architecture |
| 11 | Tone system count mismatch | MEDIUM | Consistency |
| 12 | Stale hardcoded market data | MEDIUM | Data |
| 13 | Dual cognition systems | HIGH | Architecture |

**Critical: 3 | High: 5 | Medium: 5 | Total: 13 findings**

## Root Cause

**Accretive Specification** — Features and rules were added incrementally across 11 files without cross-file reconciliation. Each file is internally coherent but contradicts neighboring files on shared concerns (scoring, routing, processing flow, token budgets).

## Success Criteria

- [x] All system files read and analyzed
- [x] Cross-file contradictions identified
- [x] Token budget validated against actual sizes
- [x] Scoring system integrity checked
- [x] State machine transitions verified
- [x] Findings documented with severity ratings
- [x] Root cause pattern identified
- [x] Remediation plan provided
