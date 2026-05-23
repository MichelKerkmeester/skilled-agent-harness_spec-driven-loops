---
title: Deep Agent Improvement 5-Dimension Scoring Rubric
description: Formal definition of the 5-dimension evaluation framework used by deep-agent-improvement to score agent candidates.
trigger_phrases:
  - "5-dimension scoring"
  - "scoring rubric"
  - "dimension weights"
  - "evaluation dimensions"
importance_tier: important
contextType: reference
---

# Deep Agent Improvement 5-Dimension Scoring Rubric

Formal definition of the 5-dimension evaluation framework used by deep-agent-improvement to score agent candidates.

---

## 1. OVERVIEW

The 5-dimension scoring rubric is the core evaluation framework for deep-agent-improvement. It measures agent quality across five weighted dimensions: structural integrity, rule coherence, integration consistency, output quality, and system fitness. Each dimension is scored 0-100, then combined using dimension weights to produce a final weighted score.

**Scoring mode:** Dynamic only (no static profiles shipped).

**Weighted score threshold:** >= 70 produces `candidate-acceptable`; below 70 produces `needs-improvement`.

---

## 2. DIMENSIONS

### Dimension 1: Structural Integrity

**Weight:** 0.20

**What it measures:** Agent template compliance and required section presence.

**Scoring logic:**
- Checks for required sections: CORE WORKFLOW, OUTPUT VERIFICATION, ANTI-PATTERNS, CAPABILITY SCAN, RULES, RELATED RESOURCES
- Each required section present: +20 points
- Missing required section: 0 points for that section
- Score = (sections present / total required sections) * 100

**Implementation:** `score-candidate.cjs` → `checkStructuralIntegrity()`

---

### Dimension 2: Rule Coherence

**Weight:** 0.25

**What it measures:** Alignment between ALWAYS/NEVER rules and workflow instructions.

**Scoring logic:**
- Extracts ALWAYS and NEVER rules from agent definition
- Checks keyword presence in workflow instructions
- Each rule with matching keyword: +10 points
- Each rule without matching keyword: 0 points
- Score = (rules with matches / total rules) * 100

**Implementation:** `score-candidate.cjs` → `checkRuleCoherence()`

---

### Dimension 3: Integration Consistency

**Weight:** 0.25

**What it measures:** Mirror parity, command coverage, and skill references.

**Scoring logic:**
- Runs `scan-integration.cjs` to discover integration surfaces
- Mirror parity score: 60% of dimension (3 mirrors checked: Claude, Codex, .agents)
- Command coverage: 20% of dimension (commands reference agent)
- Skill coverage: 20% of dimension (skills reference agent)
- Score = (mirrorScore * 0.60) + (commandScore * 0.20) + (skillScore * 0.20)

**Implementation:** `score-candidate.cjs` → `checkIntegrationConsistency()` delegates to `scan-integration.cjs`

---

### Dimension 4: Output Quality

**Weight:** 0.15

**What it measures:** Output verification checklist presence and placeholder content.

**Scoring logic:**
- Checks for OUTPUT VERIFICATION section
- Each verification item present: +10 points
- Placeholder strings (TODO, FIXME, placeholder): -5 points each
- Score = (verification items / expected items) * 100 - placeholder penalty

**Implementation:** `score-candidate.cjs` → `checkOutputQuality()`

---

### Dimension 5: System Fitness

**Weight:** 0.15

**What it measures:** Permission-capability alignment, resource references, and frontmatter completeness.

**Scoring logic:**
- Verifies tools in capability scan match permission model
- Checks resource references exist
- Validates frontmatter completeness (name, description, triggers)
- Each check passing: +20 points
- Score = (checks passing / total checks) * 100

**Implementation:** `score-candidate.cjs` → `checkSystemFitness()`

---

## 3. WEIGHTED SCORE CALCULATION

```javascript
weightedScore = (
  structural * 0.20 +
  ruleCoherence * 0.25 +
  integration * 0.25 +
  outputQuality * 0.15 +
  systemFitness * 0.15
)
```

**Thresholds:**
- `weightedScore >= 70`: `candidate-acceptable`
- `weightedScore < 70`: `needs-improvement`

---

## 4. DYNAMIC PROFILING

**Profile generation:** `scripts/generate-profile.cjs`

**Process:**
1. Parse agent frontmatter (name, description, triggers)
2. Extract ALWAYS/NEVER rules from RULES section or body fallback
3. Extract OUTPUT VERIFICATION checklist items
4. Extract CAPABILITY SCAN tool list
5. Extract RELATED RESOURCES table
5. Extract denied permissions
6. Build derived profile JSON with dimension-specific checks

**Profile output fields:**
- `id`: Agent identifier
- `derivedChecks.ruleCoherence`: Array of ALWAYS/NEVER rules
- `derivedChecks.outputChecks`: Array of verification items
- `derivedChecks.capabilityScan`: Tool list
- `derivedChecks.permissions`: Permission model
- `agentMeta`: Frontmatter metadata

---

## 5. SCORING OUTPUT FORMAT

```json
{
  "status": "success",
  "evaluationMode": "dynamic-5d",
  "profileId": "agent-name",
  "weightedScore": 78.5,
  "recommendation": "candidate-acceptable",
  "dimensions": [
    {
      "name": "structural",
      "score": 85,
      "weight": 0.20,
      "details": [
        { "check": "CORE WORKFLOW present", "passed": true },
        { "check": "OUTPUT VERIFICATION present", "passed": true }
      ]
    },
    {
      "name": "ruleCoherence",
      "score": 72,
      "weight": 0.25,
      "details": [
        { "check": "ALWAYS rule: Read files first", "passed": true },
        { "check": "NEVER rule: Don't guess", "passed": true }
      ]
    },
    {
      "name": "integration",
      "score": 80,
      "weight": 0.25,
      "details": [
        { "check": "Mirror parity: Claude", "passed": true },
        { "check": "Mirror parity: Codex", "passed": false }
      ]
    },
    {
      "name": "outputQuality",
      "score": 90,
      "weight": 0.15,
      "details": [
        { "check": "Verification items present", "passed": true }
      ]
    },
    {
      "name": "systemFitness",
      "score": 65,
      "weight": 0.15,
      "details": [
        { "check": "Permission alignment", "passed": true },
        { "check": "Resource references", "passed": false }
      ]
    }
  ]
}
```

---

## 6. SOURCE ANCHORS

|| Path | Role |
|---|---|
| `scripts/score-candidate.cjs` | Main scoring implementation |
| `scripts/generate-profile.cjs` | Dynamic profile generation |
| `scripts/scan-integration.cjs` | Integration surface discovery |
| `references/evaluator_contract.md` | Evaluator policy contract |
| `feature_catalog/03--scoring-system/01-five-dimension-rubric.md` | Feature catalog entry |
