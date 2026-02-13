# Decision Record: Copywriter AI System Audit

## DR-001: Audit Methodology Selection

| Field | Value |
|---|---|
| **Decision** | Use cross-file contradiction analysis as primary methodology |
| **Date** | 2026-02-11 |
| **Status** | Accepted |

### Context
The system comprises 11 knowledge base files + 2 shared files that were developed incrementally. The most likely bug pattern in incrementally-built AI prompt systems is cross-file contradiction, where the same concept is defined differently in multiple locations.

### Options Considered
1. **Per-file quality review** — Check each file independently for internal issues
2. **Cross-file contradiction analysis** — Map shared concepts and check for conflicts ✅
3. **Output-based testing** — Run the system and evaluate outputs
4. **User feedback analysis** — Review how the system performs in practice

### Decision
Option 2: Cross-file contradiction analysis. This catches the highest-severity bugs (conflicting instructions that cause unpredictable behavior) and doesn't require running the system.

### Consequences
- Found 13 bugs, 6 of which are cross-file contradictions
- Also caught mathematical impossibilities (token budget, scoring arithmetic)
- Did NOT catch runtime-only bugs (would need option 3 for that)

---

## DR-002: Severity Classification

| Field | Value |
|---|---|
| **Decision** | Three-tier severity: Critical, High, Medium |
| **Date** | 2026-02-11 |
| **Status** | Accepted |

### Criteria

| Severity | Definition | Count |
|----------|-----------|-------|
| **CRITICAL** | System cannot function as designed; mathematical impossibility or architectural failure | 3 |
| **HIGH** | System produces unpredictable behavior; contradictory instructions compete | 5 |
| **MEDIUM** | Edge cases or quality degradation; system mostly works but has gaps | 5 |

---

## DR-003: Root Cause Diagnosis

| Field | Value |
|---|---|
| **Decision** | Root cause is "Accretive Specification" — not individual file errors |
| **Date** | 2026-02-11 |
| **Status** | Accepted |

### Reasoning
Each file in isolation is well-written and internally coherent. The bugs emerge ONLY at file boundaries — where File A defines concept X differently than File B. This pattern indicates:
- Files were written at different times
- Files were written without a cross-reference check against existing definitions
- No "single source of truth" policy was enforced per concept

### Implication
Fixing individual bugs (patching) will not prevent new contradictions from emerging. The fix must be architectural: establish single-source-of-truth ownership for each shared concept, and enforce cross-file validation when any file is updated.
