---
title: Deep Agent Improvement Promotion Gate Contract
description: Formal contract defining the guarded promotion gates that must pass before a packet-local candidate can mutate the canonical target.
trigger_phrases:
  - "promotion gates"
  - "promotion contract"
  - "guarded promotion"
  - "promotion eligibility"
importance_tier: important
contextType: implementation
version: 1.17.0.13
---

# Deep Agent Improvement Promotion Gate Contract

Formal contract defining the guarded gates that must pass before a packet-local candidate can move from accepted evidence to a canonical shipped target.

---

## 1. OVERVIEW

Promotion has two callable phases:

- `accept`: verify all gates, snapshot the canonical preimage, snapshot the candidate, and record the preserved branch without mutating the canonical target.
- `ship`: re-check the same evidence, require the canonical target to still match the accepted preimage, then copy the accepted candidate snapshot into the canonical target.

The promotion gate contract defines the five required gates that must pass before either phase can proceed: prompt scoring, benchmark status, repeatability evidence, manifest boundary compliance, and explicit operator approval.

**Promotion script:** `scripts/shared/promote-candidate.cjs`

**Rollback script:** `scripts/shared/rollback-candidate.cjs`

**Policy reference:** `references/shared/promotion-rules.md`

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

**Requirement:** Candidate path matches `target-manifest.jsonc` target definition.

**Validation:**
- Load `assets/agent-improvement/target-manifest.jsonc`
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

### Step 1: Accept Candidate

```bash
node .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs \
  --phase=accept \
  --candidate={spec_folder}/improvement/candidates/{candidate_id}.md \
  --target={canonical_target_path} \
  --score={score_json_path} \
  --benchmark-report={benchmark_report_path} \
  --repeatability-report={repeatability_report_path} \
  --config={spec_folder}/improvement/agent-improvement-config.json \
  --manifest={spec_folder}/improvement/target-manifest.jsonc \
  --archive-dir={spec_folder}/improvement/archive \
  --approve
```

**Validation sequence:**
1. Load candidate file and verify it exists
2. Load score JSON and verify scoring gate passed
3. Load benchmark report (if fixtures exist) and verify benchmark gate passed
4. Load manifest and verify boundary compliance
5. Verify `--approve` flag is present
6. If any gate fails, abort with specific failure mode and emit `promotion_blocked_branch_preserved` when an event log is configured
7. Snapshot canonical target and candidate under the archive directory
8. Write an accepted-state file and return its `acceptanceFile` path

---

### Step 2: Ship Accepted Candidate

```bash
node .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs \
  --phase=ship \
  --acceptance-file={spec_folder}/improvement/archive/{target_name}.{timestamp}.accepted.json \
  --approve
```

**Ship sequence:**
1. Re-load the accepted-state file and gate evidence
2. Verify the canonical target still hashes to the pre-acceptance snapshot
3. Restore the pre-acceptance snapshot and emit `promotion_blocked_branch_preserved` if the clean-tree check fails
4. Copy the accepted candidate snapshot over the canonical target
5. Return `status: "shipped"` with the rollback backup path and preserved branch

---

### Step 3: Post-Ship Verification

**Mirror sync check:**
- Run `scripts/agent-improvement/check-mirror-drift.cjs` to detect mirror divergence
- Record drift status in journal (separate packaging work)

**Dimensional verification:**
- Re-score canonical target to verify the shipped candidate
- Compare post-ship score to pre-acceptance baseline
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
node .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/rollback-candidate.cjs \
  --target={canonical_target_path} \
  --backup={backup_path} \
  --config={config_path} \
  --manifest={manifest_path}
```

When rolling back a two-phase promotion, the accepted-state file can supply those paths:

```bash
node .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/rollback-candidate.cjs \
  --acceptance-file={acceptance_file_path}
```

**Rollback sequence:**
1. Verify backup file exists and is valid
2. Verify target path matches manifest
3. Copy backup over canonical target
4. Emit `rollback_result` event with `status: "success"`
5. Leave the preserved branch and accepted candidate snapshot intact for audit
6. Record post-rollback dimensional snapshot

**Post-rollback verification:**
- Re-score canonical target to verify restoration
- Compare post-rollback score to original baseline
- Record verification in journal

---

## 5. JOURNAL EVENTS

### Promotion Events

**Event:** `promotion_blocked_branch_preserved`
```json
{
  "eventType": "promotion_blocked_branch_preserved",
  "phase": "ship",
  "target": ".opencode/agents/debug.md",
  "candidate": "improvement/archive/debug.md.accepted",
  "preservedBranch": "feature/improve-debug-agent",
  "branchPreservationPolicy": "preserve-on-failure"
}
```

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
| `promotion_blocked_branch_preserved` | Accept or ship gate failed under branch-preservation policy | Inspect the preserved branch and acceptance evidence before retry |

---

## 7. SOURCE ANCHORS

|| Path | Role |
|---|---|
| `scripts/shared/promote-candidate.cjs` | Promotion gate validation and mutation |
| `scripts/lib/promotion-gates.cjs` | Named weighted, benchmark, and per-dimension gate values |
| `scripts/shared/rollback-candidate.cjs` | Rollback execution and verification |
| `scripts/agent-improvement/check-mirror-drift.cjs` | Post-promotion mirror sync check |
| `scripts/agent-improvement/score-candidate.cjs` | Prompt scoring gate |
| `scripts/model-benchmark/run-benchmark.cjs` | Benchmark execution gate |
| `scripts/agent-improvement/benchmark-stability.cjs` | Repeatability analysis |
| `assets/agent-improvement/target-manifest.jsonc` | Target boundary definition |
| `references/shared/promotion-rules.md` | Promotion policy documentation |
| `feature-catalog/evaluation-loop/promotion-gates.md` | Feature catalog entry |
