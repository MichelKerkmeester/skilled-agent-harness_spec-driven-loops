# Plan: Copywriter AI System Audit

## Approach

This audit used a systematic cross-file analysis methodology:

1. **Complete Ingestion** — Read ALL files in the system (11 knowledge base + 2 shared + 5 exports)
2. **Cross-Reference Mapping** — Map where the same concept is defined across multiple files
3. **Contradiction Detection** — For each shared concept, check for conflicting definitions
4. **Mathematical Validation** — Verify token budgets, scoring arithmetic, round counts
5. **State Machine Analysis** — Trace all possible state transitions for completeness
6. **Cognitive Load Assessment** — Count total discrete rules for LLM feasibility

## Analysis Matrix

| Concern | Defined In | Expected: 1 Source of Truth | Actual Sources | Status |
|---------|-----------|---------------------------|----------------|--------|
| Processing flow | AGENTS.md, System Prompt, Interactive Mode | 1 | 3 | ❌ CONFLICT |
| Token budget | Token Budget v0.100 | 1 | 1 | ❌ SELF-CONTRADICTING |
| MEQT scoring | System Prompt, Frameworks, HVR Extensions | 1 | 3 | ❌ CONFLICT |
| DEPTH rounds | DEPTH Framework, System Prompt, Token Budget | 1 | 3 | ❌ CONFLICT |
| HVR penalties | Human Voice v0.101, HVR Extensions v0.102 | 1 | 2 | ❌ CONFLICT |
| Framework selection | System Prompt, Frameworks, DEPTH | 1 | 3 | ❌ CONFLICT |
| Tone definitions | System Prompt, Brand Extensions | 1 | 2 | ⚠️ MISMATCH |
| Market stats | Market Extensions | 1 | 1 | ⚠️ STALE RISK |
| Thinking framework | AGENTS.md, DEPTH Framework | 1 | 2 | ❌ CONFLICT |
| Export protocol | AGENTS.md | 1 | 1 | ⚠️ NO ERROR HANDLING |
| State machine | Interactive Mode | 1 | 1 | ⚠️ DEAD STATES |

**Conflict Rate: 6/11 (55%) of shared concerns have multi-source conflicts**

## Remediation Strategy (Recommended)

### Phase 1: Consolidate (Highest Impact)
1. **Single Processing Flow** — Merge AGENTS.md hierarchy, System Prompt routing, and Interactive Mode states into ONE canonical flow
2. **Single Scoring System** — Define MEQT + HVR penalties in ONE location with ONE penalty calculation
3. **Single DEPTH Definition** — Standardize round counts (standard = X, quick = Y) in ONE file

### Phase 2: Reduce (Cognitive Load)
4. **Rule Compression** — Reduce 200+ rules to ≤30 core rules with sub-rules as reference-only
5. **Framework Simplification** — Reduce from 10 frameworks to 3-5 most-used (exports show only 3 are used)
6. **Token Budget Fix** — Either increase ceiling or reduce ALWAYS-load files

### Phase 3: Validate (Quality)
7. **MEQT Recalibration** — Widen scoring range (current 19-25 has only 6 points of variance)
8. **State Machine Completion** — Add exit transitions, default state, error states
9. **Market Data Versioning** — Add timestamps, expiry, and refresh protocol
