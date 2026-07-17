---
title: "040 -- Signal vocabulary expansion (TM-08)"
description: "This scenario validates Signal vocabulary expansion (TM-08) for `040`. It focuses on Confirm signal category detection."
audited_post_018: true
version: 3.6.0.17
id: memory-quality-and-indexing-signal-vocabulary-expansion-tm-08
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 040 -- Signal vocabulary expansion (TM-08)

## 1. OVERVIEW

This scenario validates Signal vocabulary expansion (TM-08) for `040`. It focuses on Confirm signal category detection.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm signal category detection.
- Real user request: `Please validate Signal vocabulary expansion (TM-08) against the documented validation surface and tell me whether the expected signals are present: Signal categories (correction, preference, reinforcement) detected from prompt analysis; trigger matching reflects expanded vocabulary.`
- Prompt: `Validate signal vocabulary expansion for correction, preference, and reinforcement signals.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Signal categories (correction, preference, reinforcement) detected from prompt analysis; trigger matching reflects expanded vocabulary
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: >=3 signal categories correctly classified from varied prompts; FAIL: Categories missing or misclassified

---

## 3. TEST EXECUTION

### Prompt

```
Validate signal vocabulary expansion for correction, preference, and reinforcement signals.
```

### Commands

1. Use correction/preference prompts
2. Trigger matching
3. Verify categories

### Expected

Signal categories (correction, preference, reinforcement) detected from prompt analysis; trigger matching reflects expanded vocabulary

### Evidence

No `Preconditions` section is present in this scenario file.

Executed `memory_match_triggers` with varied correction, preference, and reinforcement prompts.

Correction prompt:

```text
Correction signal test: Actually, that is wrong; please correct the previous memory because the documented behavior should say trigger matching reflects expanded vocabulary.
```

Correction observed output:

```json
{
  "summary": "Matched 5 memories via trigger phrases",
  "data": {
    "matchType": "trigger-phrase",
    "count": 5,
    "results": [
      {
        "memoryId": 7924,
        "specFolder": "system-spec-kit/z_archive/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction",
        "matchedPhrases": ["signal"],
        "importanceWeight": 1
      },
      {
        "memoryId": 7179,
        "specFolder": "system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/091-naming-convention-test-suite",
        "matchedPhrases": ["test"],
        "importanceWeight": 1
      },
      {
        "memoryId": 7120,
        "specFolder": "system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/083-speckit-reimagined-test-suite",
        "matchedPhrases": ["test"],
        "importanceWeight": 1
      },
      {
        "memoryId": 7114,
        "specFolder": "system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/083-speckit-reimagined-test-suite",
        "matchedPhrases": ["memory"],
        "importanceWeight": 1
      },
      {
        "memoryId": 7102,
        "specFolder": "system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/083-memory-command-consolidation",
        "matchedPhrases": ["memory"],
        "importanceWeight": 1
      }
    ]
  },
  "hints": ["Signal vocabulary applied (1 category matches)"],
  "meta": {
    "triggerSignals": [
      {
        "category": "correction",
        "keywords": ["actually", "correction"],
        "boost": 0.2
      }
    ]
  }
}
```

Preference prompt:

```text
Preference signal test: I prefer that future summaries keep the pass/fail verdict concise and include cited evidence from the trigger matching output.
```

Preference observed output:

```json
{
  "summary": "Matched 5 memories via trigger phrases",
  "data": {
    "matchType": "trigger-phrase",
    "count": 5,
    "results": [
      {
        "memoryId": 7924,
        "specFolder": "system-spec-kit/z_archive/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction",
        "matchedPhrases": ["signal"],
        "importanceWeight": 0.9
      },
      {
        "memoryId": 7179,
        "specFolder": "system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/091-naming-convention-test-suite",
        "matchedPhrases": ["test"],
        "importanceWeight": 0.9
      },
      {
        "memoryId": 7120,
        "specFolder": "system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/083-speckit-reimagined-test-suite",
        "matchedPhrases": ["test"],
        "importanceWeight": 0.9
      },
      {
        "memoryId": 6835,
        "specFolder": "system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/044-speckit-test-suite",
        "matchedPhrases": ["test"],
        "importanceWeight": 0.9
      },
      {
        "memoryId": 6829,
        "specFolder": "system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/044-speckit-test-suite",
        "matchedPhrases": ["test"],
        "importanceWeight": 0.9
      }
    ]
  },
  "hints": ["Signal vocabulary applied (1 category matches)"],
  "meta": {
    "triggerSignals": [
      {
        "category": "preference",
        "keywords": ["prefer"],
        "boost": 0.1
      }
    ]
  }
}
```

Reinforcement prompt:

```text
Reinforcement signal test: This is correct and useful; keep using this validation approach because the signal categories are being detected as expected.
```

Reinforcement observed output:

```json
{
  "summary": "Matched 5 memories via trigger phrases",
  "data": {
    "matchType": "trigger-phrase",
    "count": 5,
    "results": [
      {
        "memoryId": 8582,
        "specFolder": "system-spec-kit/z_archive/024-compact-code-graph/007-testing-validation",
        "matchedPhrases": ["validation"],
        "importanceWeight": 0.9500000000000001
      },
      {
        "memoryId": 7924,
        "specFolder": "system-spec-kit/z_archive/022-hybrid-rag-fusion/009-perfect-session-capturing/008-signal-extraction",
        "matchedPhrases": ["signal"],
        "importanceWeight": 0.9500000000000001
      },
      {
        "memoryId": 7427,
        "specFolder": "system-spec-kit/z_archive/020-mcp-working-memory-hybrid-rag",
        "matchedPhrases": ["validation"],
        "importanceWeight": 0.9500000000000001
      },
      {
        "memoryId": 7415,
        "specFolder": "system-spec-kit/z_archive/020-mcp-working-memory-hybrid-rag/007-documentation-alignment",
        "matchedPhrases": ["validation"],
        "importanceWeight": 0.9500000000000001
      },
      {
        "memoryId": 7408,
        "specFolder": "system-spec-kit/z_archive/020-mcp-working-memory-hybrid-rag/006-post-research-wave-3-outcome-confirmation",
        "matchedPhrases": ["validation"],
        "importanceWeight": 0.9500000000000001
      }
    ]
  },
  "hints": ["Signal vocabulary applied (1 category matches)"],
  "meta": {
    "triggerSignals": [
      {
        "category": "reinforcement",
        "keywords": ["this is correct"],
        "boost": 0.15
      }
    ]
  }
}
```

### Pass / Fail

PASS: `correction`, `preference`, and `reinforcement` were each detected from varied prompts, and each trigger matching call returned `matchType: "trigger-phrase"` with `count: 5`.

### Failure Triage

Verify signal vocabulary dictionary → Check category detection regex/rules → Inspect trigger matching integration

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [memory_quality_and_indexing/signal_vocabulary_expansion.md](../../feature_catalog/memory_quality_and_indexing/signal_vocabulary_expansion.md)

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: 040
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `memory_quality_and_indexing/signal_vocabulary_expansion_tm_08.md`
