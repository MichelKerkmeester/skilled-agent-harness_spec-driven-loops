---
title: Deep Agent Improvement Promotion Gate Contract
description: Formal contract defining the guarded promotion gates that must pass before a packet-local candidate can mutate the canonical target.
trigger_phrases:
  - "promotion gates"
  - "promotion contract"
  - "guarded promotion"
  - "promotion eligibility"
importance_tier: important
contextType: reference
---

# Deep Agent Improvement Promotion Gate Contract

Formal contract defining the guarded promotion gates that must pass before a packet-local candidate can mutate the canonical target.

---

## 1. OVERVIEW

Promotion is a narrow, gated operation that moves a packet-local candidate into the canonical target location. The promotion gate contract defines the five required gates that must all pass before mutation is allowed: prompt scoring, benchmark status, repeatability evidence, manifest boundary compliance, and explicit operator approval.

**Promotion script:** `scripts/shared/promote-candidate.cjs`

**Rollback script:** `scripts/agent-improvement/rollback-candidate.cjs`

**Policy reference:** `references/shared/promotion_rules.md`

---

## 2. PROMOTION GATES

### Gate 1: Prompt Scoring

**Requirement:** Weighted score >= 70, baseline delta above runtime threshold, and every scored dimension meeting its named promotion gate.

**Per-dimension gates:** `scripts/lib/promotion-gates.cjs` is the source of truth.

| Dimension | Minimum Score |
| --- | ---: |
| `structural` | 80 |
| `ruleCoherence` | 85 |
| `integration` | 90 |
| `outputQuality` | 75 |
| `systemFitness` | 80 |

**Validation:**
- Run `scripts/agent-improvement/score-candidate.cjs` on the candidate
- Check `score >= 70`
- Check `recommendation === "candidate-better"` when promotion uses a baseline
- Verify all 5 dimensions have scores (no NaN or missing values)
- Verify `promotionGates.passed === true` or recompute the same map from score output

**Failure mode:** `score_gate_failed` - candidate does not meet minimum quality threshold.

---

### Gate 2: Benchmark Status

**Requirement:** Benchmark pass with `minimumAggregateScore >= 85`.

**Validation:**
- Run `scripts/model-benchmark/run-benchmark.cjs` with target-specific fixtures
- Check `benchmark-outputs/report.json` exists
- Check `report.status === "benchmark-complete"`
- Check `report.aggregateScore >= 85`
- Verify fixture coverage (all fixtures executed)

**Failure mode:** `benchmark_gate_failed` - candidate fails output-based validation.

**Note:** Benchmark integration requires target-specific fixture set under `assets/model-benchmark/benchmark-fixtures/`. Not all targets have fixtures; this gate is conditional on fixture availability.

---

### Gate 3: Repeatability Evidence

**Requirement:** Minimum 3 benchmark runs with score variance <= 5.

**Validation:**
- Run `scripts/agent-improvement/benchmark-stability.cjs` on historical benchmark data
- Check `runCount >= 3`
- Check `scoreVariance <= 5`
- Verify no regression across runs

**Failure mode:** `repeatability_gate_failed` - benchmark results are not stable.

**Note:** Repeatability is advisory only in current release. `benchmark-stability.cjs` emits recommendations but does not auto-apply them (ADR-005).

---

### Gate 4: Manifest Boundary Compliance

**Requirement:** Candidate path matches `target_manifest.jsonc` target definition.

**Validation:**
- Load `assets/agent-improvement/target_manifest.jsonc`
- Check candidate path matches `targets[].canonicalPath`
- Verify target is marked `mutable: true`
- Check candidate is under packet-local `candidates/` directory (not canonical)

**Failure mode:** `boundary_gate_failed` - candidate violates boundary policy.

---

### Gate 5: Explicit Operator Approval

**Requirement:** Operator explicitly approves promotion via `--approve` flag.

**Validation:**
- Check `--approve` flag is present in promotion command
- Verify approval is for the specific candidate being promoted
- Log approval in `improvement-journal.jsonl` as `promotion_attempt` event

**Failure mode:** `approval_gate_failed` - missing explicit operator consent.

---

## 3. PROMOTION PROCESS

### Step 1: Pre-Promotion Validation

```bash
node .opencode/skills/deep-improvement/scripts/shared/promote-candidate.cjs \
  --candidate={spec_folder}/improvement/candidates/{candidate_id}.md \
  --target={canonical_target_path} \
  --score={score_json_path} \
  --approve
```

**Validation sequence:**
1. Load candidate file and verify it exists
2. Load score JSON and verify scoring gate passed
3. Load benchmark report (if fixtures exist) and verify benchmark gate passed
4. Load manifest and verify boundary compliance
5. Verify `--approve` flag is present
6. If any gate fails, abort with specific failure mode

---

### Step 2: Canonical Mutation

**Backup creation:**
- Copy canonical target to `{spec_folder}/improvement/archive/{timestamp}_{target_name}.md.backup`
- Record backup path in journal event

**Mutation:**
- Copy candidate over canonical target
- Emit `promotion_result` event with `status: "success"`
- Record post-promotion dimensional snapshot

---

### Step 3: Post-Promotion Verification

**Mirror sync check:**
- Run `scripts/agent-improvement/check-mirror-drift.cjs` to detect mirror divergence
- Record drift status in journal (separate packaging work)

**Dimensional verification:**
- Re-score canonical target to verify improvement
- Compare post-promotion score to pre-promotion baseline
- Record dimension trajectory in journal

---

## 4. ROLLBACK PROCESS

### Trigger Conditions

Rollback is triggered when:
- Operator explicitly requests rollback
- Post-promotion verification reveals regression
- Mirror sync reveals critical drift

### Rollback Execution

```bash
node .opencode/skills/deep-improvement/scripts/agent-improvement/rollback-candidate.cjs \
  --target={canonical_target_path} \
  --backup={backup_path}
```

**Rollback sequence:**
1. Verify backup file exists and is valid
2. Verify target path matches manifest
3. Copy backup over canonical target
4. Emit `rollback_result` event with `status: "success"`
5. Record post-rollback dimensional snapshot

**Post-rollback verification:**
- Re-score canonical target to verify restoration
- Compare post-rollback score to original baseline
- Record verification in journal

---

## 5. JOURNAL EVENTS

### Promotion Events

**Event:** `promotion_attempt`
```json
{
  "eventType": "promotion_attempt",
  "candidateId": "candidate-001",
  "targetPath": ".opencode/agents/debug.md",
  "gates": {
    "score": { "passed": true, "weightedScore": 78.5 },
    "benchmark": { "passed": true, "aggregateScore": 90 },
    "repeatability": { "passed": true, "variance": 2.3 },
    "boundary": { "passed": true },
    "approval": { "passed": true, "approvedBy": "operator" }
  }
}
```

**Event:** `promotion_result`
```json
{
  "eventType": "promotion_result",
  "status": "success",
  "candidateId": "candidate-001",
  "backupPath": "improvement/archive/20260523_debug.md.backup",
  "postPromotionScore": 78.5
}
```

### Rollback Events

**Event:** `rollback`
```json
{
  "eventType": "rollback",
  "targetPath": ".opencode/agents/debug.md",
  "backupPath": "improvement/archive/20260523_debug.md.backup",
  "reason": "operator_request"
}
```

**Event:** `rollback_result`
```json
{
  "eventType": "rollback_result",
  "status": "success",
  "postRollbackScore": 72.0,
  "verified": true
}
```

---

## 6. FAILURE MODES

|| Failure Mode | Trigger Condition | Recovery |
|---|---|---|
| `score_gate_failed` | Weighted score < 70 or recommendation != "candidate-acceptable" | Improve candidate, re-score |
| `benchmark_gate_failed` | Benchmark aggregate score < 85 or benchmark incomplete | Fix output contract, improve fixtures |
| `repeatability_gate_failed` | Benchmark score variance > 5 or run count < 3 | Stabilize fixtures, investigate non-determinism |
| `boundary_gate_failed` | Candidate path not in manifest or target not mutable | Update manifest or choose different target |
| `approval_gate_failed` | `--approve` flag missing | Re-run with explicit approval |
| `backup_failed` | Cannot create backup of canonical target | Check file permissions, disk space |
| `mutation_failed` | Cannot copy candidate over target | Check file permissions, disk space |
| `rollback_failed` | Cannot restore backup | Verify backup exists, check permissions |
| `dimension_gate_failed` | One or more per-dimension gates fails or is unscored | Improve the targeted dimension and re-score |

---

## 7. SOURCE ANCHORS

|| Path | Role |
|---|---|
| `scripts/shared/promote-candidate.cjs` | Promotion gate validation and mutation |
| `scripts/lib/promotion-gates.cjs` | Named weighted, benchmark, and per-dimension gate values |
| `scripts/agent-improvement/rollback-candidate.cjs` | Rollback execution and verification |
| `scripts/agent-improvement/check-mirror-drift.cjs` | Post-promotion mirror sync check |
| `scripts/agent-improvement/score-candidate.cjs` | Prompt scoring gate |
| `scripts/model-benchmark/run-benchmark.cjs` | Benchmark execution gate |
| `scripts/agent-improvement/benchmark-stability.cjs` | Repeatability analysis |
| `assets/agent-improvement/target_manifest.jsonc` | Target boundary definition |
| `references/shared/promotion_rules.md` | Promotion policy documentation |
| `feature_catalog/01--evaluation-loop/promotion-gates.md` | Feature catalog entry |
