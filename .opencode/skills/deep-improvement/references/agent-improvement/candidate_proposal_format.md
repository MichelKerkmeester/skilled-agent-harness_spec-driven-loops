---
title: Deep Agent Improvement Candidate Proposal Format
description: Formal format for packet-local candidate proposals in deep-improvement, including file structure, metadata, and mutation representation.
trigger_phrases:
  - "candidate proposal"
  - "candidate format"
  - "proposal format"
  - "mutation format"
importance_tier: important
contextType: reference
---

# Deep Agent Improvement Candidate Proposal Format

Formal format for packet-local candidate proposals in deep-improvement, including file structure, metadata, and mutation representation.

---

## 1. OVERVIEW

Candidate proposals are packet-local agent mutations that live under `{spec_folder}/improvement/candidates/` before any canonical mutation. Each candidate is a complete agent file with frontmatter metadata that tracks its lineage, mutation type, and dimensional targets.

**Candidate location:** `{spec_folder}/improvement/candidates/{candidate_id}.md`

**Generation method:** Delegated to `@deep-improvement` subagent during proposal phase

**Mutation tracking:** `mutation-coverage.json` with signature-based dedup

**Candidate proposal dedup:** `candidate-lineage.json` stores a SHA-256 `contentHash` computed over normalized candidate content after frontmatter and rubric metadata are stripped. The normalized content-hash approach preserves first-seen candidate lineage.

---

## 2. CANDIDATE FILE STRUCTURE

### Frontmatter Metadata

```yaml
---
name: agent-name
description: "Agent description"
triggers:
  - "trigger phrase"
version: "1.0.0"
candidate_id: "candidate-001"
session_id: "session-abc123"
iteration: 1
mutation_type: "rule-addition"
target_dimension: "ruleCoherence"
parent_candidate: null
created_at: "2026-05-23T07:00:00Z"
---
```

**Required fields:**
- `candidate_id`: Unique identifier for this candidate (format: `candidate-{NNN}`)
- `session_id`: Session lineage identifier
- `iteration`: Iteration number when this candidate was generated
- `mutation_type`: Type of mutation (see Section 3)
- `target_dimension`: Primary dimension this mutation targets
- `parent_candidate`: Parent candidate ID (null for first iteration)
- `created_at`: ISO timestamp of candidate creation

**Standard agent fields (inherited from target):**
- `name`: Agent name
- `description`: Agent description
- `triggers`: Trigger phrases
- `version`: Agent version

---

### Body Structure

Candidate body follows standard agent template:

```markdown
# Agent Name

Agent description.

## CORE WORKFLOW

Workflow steps...

## OUTPUT VERIFICATION

Verification checklist...

## ANTI-PATTERNS

Anti-patterns to avoid...

## CAPABILITY SCAN

Tool capabilities...

## RULES

### ALWAYS

- Rule 1
- Rule 2

### NEVER

- Rule 1
- Rule 2

## RELATED RESOURCES

| Resource | Purpose |
|----------|---------|
| resource1 | purpose1 |
```

**Mutation representation:** The candidate body differs from the canonical target only in the specific mutation being tested (e.g., added rule, modified workflow step, updated description).

---

## 3. MUTATION TYPES

### Type: rule-addition

**Description:** Add a new ALWAYS or NEVER rule to the RULES section.

**Target dimension:** `ruleCoherence`

**Example:**
```markdown
### ALWAYS

- Read files before editing them
- Validate inputs before processing
+ Use explicit uncertainty when confidence < 80%
```

---

### Type: rule-modification

**Description:** Modify an existing ALWAYS or NEVER rule.

**Target dimension:** `ruleCoherence`

**Example:**
```markdown
### ALWAYS

- Read files before editing them
- Validate inputs before processing
- Use explicit uncertainty when confidence < 80%  # modified threshold
```

---

### Type: workflow-addition

**Description:** Add a step to the CORE WORKFLOW section.

**Target dimension:** `structural`

**Example:**
```markdown
## CORE WORKFLOW

1. Parse request
2. Read files
+ 3. Validate context
4. Analyze
5. Execute
```

---

### Type: workflow-modification

**Description:** Modify an existing workflow step.

**Target dimension:** `structural`

**Example:**
```markdown
## CORE WORKFLOW

1. Parse request
2. Read files
3. Analyze context  # modified from "Analyze"
4. Execute
```

---

### Type: description-update

**Description:** Update agent description or frontmatter.

**Target dimension:** `systemFitness`

**Example:**
```yaml
---
description: "Enhanced agent with improved context validation"
---
```

---

### Type: verification-addition

**Description:** Add an item to OUTPUT VERIFICATION checklist.

**Target dimension:** `outputQuality`

**Example:**
```markdown
## OUTPUT VERIFICATION

- [ ] Output is valid JSON
- [ ] All required fields present
+ [ ] Context validation passed
```

---

### Type: integration-fix

**Description:** Fix integration surface (mirror sync, command reference, skill reference).

**Target dimension:** `integration`

**Example:** Update trigger phrases to match command references.

---

## 4. MUTATION COVERAGE TRACKING

### Mutation Signature

Each mutation entry in `mutation-coverage.json` carries a `signature` field for deduplication:

```javascript
signature = sha256(
  dimension + "\u001f" +
  mutationType + "\u001f" +
  targetSection + "\u001f" +
  normalizedBody64
)
```

Where `normalizedBody64` = whitespace-collapsed, lowercased, first 64 characters of the mutation body.

### Mutation Coverage Schema

```json
{
  "session_id": "session-abc123",
  "loop_type": "improvement",
  "mutations": [
    {
      "dimension": "ruleCoherence",
      "mutationType": "rule-addition",
      "targetSection": "RULES",
      "signature": "abc123...",
      "iteration": 1,
      "candidateId": "candidate-001",
      "outcome": "accepted"
    }
  ],
  "exhausted": [
    {
      "dimension": "ruleCoherence",
      "mutationType": "rule-addition",
      "targetSection": "RULES",
      "signature": "def456...",
      "reason": "EXHAUSTED-FROM: iter-003"
    }
  ]
}
```

### Dedup Behavior

- Before proposing a new mutation, `isSignatureSeen()` scans existing `mutations[]` and `exhausted[]` arrays
- If the signature matches, the candidate is skipped with `reason: "EXHAUSTED-FROM: iter-NNN"`
- Bypass: `export DEEP_AGENT_IMPROVEMENT_SKIP_DEDUP=1`

### Candidate Content Hash Dedup

Candidate proposal storage additionally uses `scripts/agent-improvement/candidate-lineage.cjs` to compute:

```javascript
contentHash = sha256(normalize(stripFrontmatterAndRubricMetadata(candidateContent)))
```

When a new candidate has the same `contentHash` as a prior node, the lineage graph records it under `duplicates[]` and preserves the first node as the primary proposal.

---

## 5. CANDIDATE LINEAGE

### Lineage Graph

The candidate lineage is a directed graph tracking proposal relationships:

```json
{
  "session_id": "session-abc123",
  "candidates": [
    {
      "candidateId": "candidate-001",
      "iteration": 1,
      "waveIndex": 0,
      "spawningMutationType": "rule-addition",
      "parentCandidateId": null,
      "children": ["candidate-002", "candidate-003"]
    },
    {
      "candidateId": "candidate-002",
      "iteration": 2,
      "waveIndex": 0,
      "spawningMutationType": "workflow-modification",
      "parentCandidateId": "candidate-001",
      "children": []
    }
  ]
}
```

### Parallel Waves (Optional)

When `parallelWaves.enabled: true` in config, the orchestrator can spawn 2-3 candidates with different mutation strategies in a single iteration. Activation requires:
- Exploration-breadth score above threshold
- 3+ unresolved mutation families
- 2 consecutive tie/plateau iterations

---

## 6. CANDIDATE GENERATION PROTOCOL

### Subagent Contract

The `@deep-improvement` subagent must:

1. Read the copied charter and manifest first
2. Write only under the packet-local runtime area (`{spec_folder}/improvement/candidates/`)
3. Return structured metadata including `candidate_id`, `mutation_type`, `target_dimension`
4. Stop before scoring, benchmarking, promotion, or mirror synchronization begins

### Generation Steps

1. **Read context:** Load charter, strategy, manifest, and baseline candidate
2. **Select mutation:** Choose mutation type based on dimensional targets and mutation coverage
3. **Check dedup:** Verify mutation signature not in `exhausted[]` log
4. **Apply mutation:** Modify baseline agent body with specific mutation
5. **Write candidate:** Save to `{spec_folder}/improvement/candidates/{candidate_id}.md`
6. **Emit event:** Write `candidate_generated` journal event
7. **Return metadata:** Provide candidate metadata to orchestrator

---

## 7. CANDIDATE SCORING INTEGRATION

After generation, the candidate is scored via `scripts/agent-improvement/score-candidate.cjs`:

```bash
node .opencode/skills/deep-improvement/scripts/agent-improvement/score-candidate.cjs \
  --candidate={spec_folder}/improvement/candidates/{candidate_id}.md \
  --target={canonical_target_path} \
  --manifest=assets/agent-improvement/target_manifest.jsonc
```

**Scoring output includes:**
- `evaluationMode`: "dynamic-5d"
- `profileId`: Derived from agent name
- `weightedScore`: 0-100
- `recommendation`: "candidate-acceptable" or "needs-improvement"
- `dimensions`: Array of 5 dimension scores with details

---

## 8. SOURCE ANCHORS

|| Path | Role |
|---|---|
| `scripts/shared/mutation-coverage.cjs` | Mutation coverage tracking and dedup |
| `scripts/agent-improvement/candidate-lineage.cjs` | Candidate lineage graph management |
| `scripts/agent-improvement/score-candidate.cjs` | Candidate scoring |
| `assets/agent-improvement/improvement_charter.md` | Charter template (read during generation) |
| `assets/agent-improvement/target_manifest.jsonc` | Target boundary definition |
| `feature_catalog/01--evaluation-loop/02-candidate-generation.md` | Feature catalog entry |
