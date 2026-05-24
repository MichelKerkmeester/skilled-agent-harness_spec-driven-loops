---
title: "RT-034 -- Replay Consumer Artifact Verification"
description: "Manual validation scenario for RT-034: Replay Consumer Artifact Verification."
feature_id: "RT-034"
category: "Runtime Truth"
---

# RT-034 -- Replay Consumer Artifact Verification

This document captures the canonical manual-testing contract for `RT-034`.

---

## 1. OVERVIEW

This scenario validates ADR-002 Option A replay-consumer behavior: `reduce-state.cjs` reads `improvement-journal.jsonl`, `candidate-lineage.json`, and `mutation-coverage.json`, writes their summaries into the registry, and degrades gracefully when any one artifact is missing. Given: an improvement runtime where `improvement-journal.jsonl`, `candidate-lineage.json`, and `mutation-coverage.json` are all present. When: the operator runs `reduce-state.cjs` and then repeats the run with one artifact removed at a time from a disposable runtime copy. Then: the registry contains `journalSummary`, `candidateLineage`, and `mutationCoverage`; and any missing artifact resolves to `null` without throwing.

---

## 2. SCENARIO CONTRACT

- Objective: Validate Replay Consumer Artifact Verification for the journal, continuation, stop-gate, stability, and replay-consumer scenarios.
- Real user request: `` Validate that ADR-002 Option A replay-consumer behavior: `reduce-state.cjs` reads `improvement-journal.jsonl`, `candidate-lineage.json`, and `mutation-coverage.json`, writes their summaries into the registry, and degrades gracefully when any one artifact is missing. Given: an improvement runtime where `improvement-journal.jsonl`, `candidate-lineage.json`, and `mutation-coverage.json` are all present. When: the operator runs `reduce-state.cjs` and then repeats the run with one artifact removed at a time from a disposable runtime copy. Then: the registry contains `journalSummary`, `candidateLineage`, and `mutationCoverage`; and any missing artifact resolves to `null` without throwing. ``
- Prompt: `Validate that reduce-state.cjs consumes replay artifacts and degrades gracefully when one is missing.`
- Expected execution process: Run the reducer against the documented disposable runtime state; capture stdout, stderr, exit code, and any generated files; then execute the verification block against the same run artifacts.
- Expected signals: `experiment-registry.json` contains:; `journalSummary` with `lastSessionStart`, `lastSessionEnd`, `totalEvents`, `eventTypeCounts`, `stopReason`, `sessionOutcome`; `candidateLineage` with `lineageDepth`, `totalCandidates`, `currentLeaf`; `mutationCoverage` with `coverageRatio`, `uncoveredMutations`; Re-running the reducer with any one of the 3 artifacts removed does not throw; The corresponding registry field resolves to `null` when its source artifact is missing; The remaining consumer paths still populate normally when only one artifact is absent
- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with the decisive evidence from the command output and verification checks.
- Pass/fail: With all three replay artifacts present, `reduce-state.cjs` populates `journalSummary`, `candidateLineage`, and `mutationCoverage` in the registry. When any one artifact is missing, the reducer completes successfully and sets only the corresponding field to `null` while preserving the others.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Confirm the working directory is the repository root.
2. Resolve any placeholders in the command sequence, especially `{spec}`, to disposable test paths.
3. Run the exact command sequence and capture stdout, stderr, exit code, and generated artifacts.
4. Run the verification block against the same artifacts from the same execution.
5. Compare observed output against the expected signals and pass/fail criteria.
6. Record the scenario verdict with the decisive evidence.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| RT-034 | Replay Consumer Artifact Verification | Validate Replay Consumer Artifact Verification | `Validate that reduce-state.cjs consumes replay artifacts and degrades gracefully when one is missing.` | node .opencode/skills/deep-agent-improvement/scripts/reduce-state.cjs {spec}/improvement<br><br><br>Verification:<br><br><br>RUNTIME_COPY=&quot;$(mktemp -d /tmp/deep-agent-improvement-replay-XXXXXX)&quot;<br>cp -R &quot;{spec}/improvement/.&quot; &quot;$RUNTIME_COPY/&quot;<br><br><br>node .opencode/skills/deep-agent-improvement/scripts/reduce-state.cjs &quot;$RUNTIME_COPY&quot;<br><br><br>cat &quot;$RUNTIME_COPY/experiment-registry.json&quot; &#124; jq &#x27;.journalSummary, .candidateLineage, .mutationCoverage&#x27;<br><br><br>python3 - &lt;&lt;&#x27;PY&#x27; &quot;$RUNTIME_COPY/experiment-registry.json&quot;<br>import json, sys<br>registry = json.load(open(sys.argv[1], &#x27;r&#x27;, encoding=&#x27;utf-8&#x27;))<br>js = registry.get(&#x27;journalSummary&#x27;)<br>cl = registry.get(&#x27;candidateLineage&#x27;)<br>mc = registry.get(&#x27;mutationCoverage&#x27;)<br>assert js is not None, &#x27;journalSummary missing&#x27;<br>assert cl is not None, &#x27;candidateLineage missing&#x27;<br>assert mc is not None, &#x27;mutationCoverage missing&#x27;<br>required_js = [&#x27;lastSessionStart&#x27;, &#x27;lastSessionEnd&#x27;, &#x27;totalEvents&#x27;, &#x27;eventTypeCounts&#x27;, &#x27;stopReason&#x27;, &#x27;sessionOutcome&#x27;]<br>required_cl = [&#x27;lineageDepth&#x27;, &#x27;totalCandidates&#x27;, &#x27;currentLeaf&#x27;]<br>required_mc = [&#x27;coverageRatio&#x27;, &#x27;uncoveredMutations&#x27;]<br>for key in required_js:<br>    assert key in js, f&#x27;journalSummary missing {key}&#x27;<br>for key in required_cl:<br>    assert key in cl, f&#x27;candidateLineage missing {key}&#x27;<br>for key in required_mc:<br>    assert key in mc, f&#x27;mutationCoverage missing {key}&#x27;<br>print(&#x27;PASS — reducer populated all three replay consumer summaries&#x27;)<br>PY<br><br><br>for artifact in improvement-journal.jsonl candidate-lineage.json mutation-coverage.json; do<br>  TMP_CASE=&quot;$(mktemp -d /tmp/deep-agent-improvement-replay-case-XXXXXX)&quot;<br>  cp -R &quot;$RUNTIME_COPY/.&quot; &quot;$TMP_CASE/&quot;<br>  rm -f &quot;$TMP_CASE/$artifact&quot;<br>  node .opencode/skills/deep-agent-improvement/scripts/reduce-state.cjs &quot;$TMP_CASE&quot;<br>  case &quot;$artifact&quot; in<br>    improvement-journal.jsonl)<br>      cat &quot;$TMP_CASE/experiment-registry.json&quot; &#124; jq &#x27;.journalSummary&#x27;<br>      test &quot;$(cat &quot;$TMP_CASE/experiment-registry.json&quot; &#124; jq -r &#x27;.journalSummary&#x27;)&quot; = &quot;null&quot;<br>      ;;<br>    candidate-lineage.json)<br>      cat &quot;$TMP_CASE/experiment-registry.json&quot; &#124; jq &#x27;.candidateLineage&#x27;<br>      test &quot;$(cat &quot;$TMP_CASE/experiment-registry.json&quot; &#124; jq -r &#x27;.candidateLineage&#x27;)&quot; = &quot;null&quot;<br>      ;;<br>    mutation-coverage.json)<br>      cat &quot;$TMP_CASE/experiment-registry.json&quot; &#124; jq &#x27;.mutationCoverage&#x27;<br>      test &quot;$(cat &quot;$TMP_CASE/experiment-registry.json&quot; &#124; jq -r &#x27;.mutationCoverage&#x27;)&quot; = &quot;null&quot;<br>      ;;<br>  esac<br>  rm -rf &quot;$TMP_CASE&quot;<br>done<br><br><br>rm -rf &quot;$RUNTIME_COPY&quot; | `experiment-registry.json` contains:; `journalSummary` with `lastSessionStart`, `lastSessionEnd`, `totalEvents`, `eventTypeCounts`, `stopReason`, `sessionOutcome`; `candidateLineage` with `lineageDepth`, `totalCandidates`, `currentLeaf`; `mutationCoverage` with `coverageRatio`, `uncoveredMutations`; Re-running the reducer with any one of the 3 artifacts removed does not throw; The corresponding registry field resolves to `null` when its source artifact is missing; The remaining consumer paths still populate normally when only one artifact is absent | `terminal transcript, command output, generated files, and PASS/FAIL verdict` | With all three replay artifacts present, `reduce-state.cjs` populates `journalSummary`, `candidateLineage`, and `mutationCoverage` in the registry. When any one artifact is missing, the reducer completes successfully and sets only the corresponding field to `null` while preserving the others. | If any registry summary is missing with artifacts present: inspect `buildJournalSummary()`, `buildCandidateLineageSummary()`, or `buildMutationCoverageSummary()` in `reduce-state.cjs`<br>If the reducer throws when one artifact is removed: verify `readOptionalUtf8()` / `readOptionalJson()` are still used for graceful degradation<br>If a missing artifact silently drops multiple fields: confirm each summary builder is wired independently from its own path<br>If a later doc claims dashboard-only proof for ADR-002 Option A: trim it back to the registry fields, which are the canonical replay-consumer outputs validated by this scenario |

### Optional Supplemental Checks

Use the verification block above as the primary supplemental check. Preserve any additional evidence in this template when reporting the verdict:

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste jq output for journalSummary / candidateLineage / mutationCoverage and one null-on-missing rerun]
```

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root playbook, category summary, and review protocol |
| `07--runtime-truth/034-replay-consumer.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill entry point and operator contract for deep-agent-improvement |
| `../../scripts/reduce-state.cjs` | Implementation or verification anchor referenced by this scenario |

---

## 5. SOURCE METADATA

- Group: Runtime Truth
- Playbook ID: RT-034
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--runtime-truth/034-replay-consumer.md`

---

## 6. SIGNATURE DEDUP SMOKE TEST

Verify that `mutation-coverage.cjs` computes, stores, and respects mutation signatures for deduplication.

### Scenario: Signature dedup prevents duplicate mutation recording

**Given:** A disposable mutation coverage file with one mutation already recorded.
**When:** The same logical mutation is submitted again via `recordMutation`.
**Then:** `isSignatureSeen()` returns `{ seen: true }` for the duplicate signature.

**Smoke command sequence:**

```bash
# Create disposable coverage file
TMPFILE=$(mktemp /tmp/mutation-coverage-XXXXXX.json)
node -e "
  const mc = require('./.opencode/skills/deep-agent-improvement/scripts/mutation-coverage.cjs');
  // Record first mutation
  mc.recordMutation('$TMPFILE', {
    dimension: 'structural',
    mutationType: 'add_error_handling',
    targetSection: 'promotion-gate',
    body: 'Wraps the promotion gate in a try/catch and logs failures'
  });
  // Compute expected signature for same mutation
  const sig = mc.computeMutationSignature({
    dimension: 'structural',
    mutationType: 'add_error_handling',
    targetSection: 'promotion-gate',
    body: 'Wraps the promotion gate in a try/catch and logs failures'
  });
  const result = mc.isSignatureSeen('$TMPFILE', sig);
  console.log(JSON.stringify(result));
  // Should return { seen: true, reason: 'DUPLICATE_SIGNATURE_IN_MUTATIONS' }
"

# Verify bypass works
DEEP_AGENT_IMPROVEMENT_SKIP_DEDUP=1 node -e "
  const mc = require('./.opencode/skills/deep-agent-improvement/scripts/mutation-coverage.cjs');
  const sig = mc.computeMutationSignature({
    dimension: 'structural',
    mutationType: 'add_error_handling',
    targetSection: 'promotion-gate',
    body: 'Wraps the promotion gate in a try/catch and logs failures'
  });
  const result = mc.isSignatureSeen('$TMPFILE', sig);
  console.log(JSON.stringify(result));
  // Should return { seen: false } when SKIP_DEDUP=1
"

rm -f "$TMPFILE"
```

**Expected signals:**
- First call: `{"seen":true,"reason":"DUPLICATE_SIGNATURE_IN_MUTATIONS"}`
- Second call (with `SKIP_DEDUP=1`): `{"seen":false}`

**Pass/Fail:** Both expected signals match exactly. Exit code 0 for all commands.
