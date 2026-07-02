---
title: "041 -- Pre-flight token budget validation (PI-A3)"
description: "This scenario validates Pre-flight token budget validation (PI-A3) for `041`. It focuses on Confirm save-time preflight warn/fail behavior."
audited_post_018: true
version: 3.6.0.17
---

# 041 -- Pre-flight token budget validation (PI-A3)

## 1. OVERVIEW

This scenario validates Pre-flight token budget validation (PI-A3) for `041`. It focuses on Confirm save-time preflight warn/fail behavior.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm save-time preflight warn/fail behavior.
- Real user request: `` Please validate Pre-flight token budget validation (PI-A3) against memory_save({filePath:"<sandbox-file>", dryRun:true}) and tell me whether the expected signals are present: Token estimate is computed before embedding/database writes; near-limit input emits `PF021` warning; over-limit input emits `PF020` failure; behavior follows `MCP_CHARS_PER_TOKEN`, `MCP_MAX_MEMORY_TOKENS`, and `MCP_TOKEN_WARNING_THRESHOLD`. ``
- Prompt: `Validate pre-flight token budget handling in memory_save dry-run.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Token estimate is computed before embedding/database writes; near-limit input emits `PF021` warning; over-limit input emits `PF020` failure; behavior follows `MCP_CHARS_PER_TOKEN`, `MCP_MAX_MEMORY_TOKENS`, and `MCP_TOKEN_WARNING_THRESHOLD`
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Save-time preflight returns the expected warning/failure result without indexing side effects; FAIL: Retrieval-time truncation is required or preflight thresholds/codes drift from runtime behavior

---

## 3. TEST EXECUTION

### Prompt

```
Validate pre-flight token budget handling in memory_save dry-run.
```

### Commands

1. Prepare saved context artifacts near and over the save-time token limit
2. Run `memory_save({filePath:"<sandbox-file>", dryRun:true})` or the equivalent save preflight path
3. Verify warning/failure payloads from `preflight.ts`

### Expected

Token estimate is computed before embedding/database writes; near-limit input emits `PF021` warning; over-limit input emits `PF020` failure; behavior follows `MCP_CHARS_PER_TOKEN`, `MCP_MAX_MEMORY_TOKENS`, and `MCP_TOKEN_WARNING_THRESHOLD`

### Evidence

Executed against existing canonical spec documents because the task write boundary allowed no sandbox-file creation.

Precondition/path checks observed before final dry-runs:

```text
memory_save dryRun on .opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-native-invocability-planning/research/iterations/iteration-010.md
summary: Error: File must be a canonical spec document under specs/**/ (spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, handover.md, research.md, resource-map.md, review-report.md, description.json, graph-metadata.json) or a constitutional memory under .opencode/skills/*/constitutional/
code: E089

memory_save dryRun on .opencode/specs/anobel.com/004-bento-visuals/implementation-summary.md without governed metadata
summary: Error: Governed ingest rejected: tenantId is required for governed ingest; sessionId is required for governed ingest; userId or agentId is required for governed ingest; provenanceSource is required for governed ingest; provenanceActor is required for governed ingest
code: E085
```

Artifact sizing command output:

```text
for f in .opencode/specs/**/(spec.md|plan.md|tasks.md|checklist.md|decision-record.md|implementation-summary.md|handover.md|research.md|resource-map.md|review-report.md|description.json|graph-metadata.json)(N); do c=$(wc -c < "$f"); if [ "$c" -ge 25000 ]; then print "$c $f"; fi; done
   26373 .opencode/specs/anobel.com/004-bento-visuals/implementation-summary.md
   34218 .opencode/specs/deep-loops/z_archive/011-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md
```

Near-limit dry-run command:

```text
memory_save({filePath:"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/anobel.com/004-bento-visuals/implementation-summary.md", dryRun:true, tenantId:"manual-playbook", userId:"opencode", sessionId:"pre-flight-token-budget-validation-pi-a3", provenanceSource:"manual_testing_playbook", provenanceActor:"opencode", governedAt:"2026-07-02T11:30:00.000Z", retentionPolicy:"keep"})
```

Near-limit response payload excerpt:

```json
{
  "summary": "Dry-run would pass in manual-fallback mode with deferred indexing.",
  "data": {
    "status": "dry_run",
    "would_pass": true,
    "validation": {
      "errors": [],
      "warnings": [
        {
          "code": "PF021",
          "message": "Content is 84% of token budget (6688/8000 tokens)",
          "suggestion": "Consider splitting into smaller memories for better retrieval"
        }
      ],
      "details": {
        "checks_run": ["content_size", "anchor_format", "token_budget", "duplicate_check"],
        "content_size": { "valid": true, "content_length": 26150 },
        "token_budget": {
          "within_budget": true,
          "estimated_tokens": 6688,
          "maxTokens": 8000,
          "percentage_used": 0.836,
          "warnings": [
            {
              "code": "PF021",
              "message": "Content is 84% of token budget (6688/8000 tokens)",
              "suggestion": "Consider splitting into smaller memories for better retrieval"
            }
          ],
          "errors": []
        }
      }
    },
    "message": "Dry-run would pass in manual-fallback mode with deferred indexing."
  },
  "hints": ["Dry-run complete - no changes made"]
}
```

Over-limit dry-run command:

```text
memory_save({filePath:"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/deep-loops/z_archive/011-sk-deep-research-review-improvement-2/002-semantic-coverage-graph/spec.md", dryRun:true, tenantId:"manual-playbook", userId:"opencode", sessionId:"pre-flight-token-budget-validation-pi-a3", provenanceSource:"manual_testing_playbook", provenanceActor:"opencode", governedAt:"2026-07-02T11:30:00.000Z", retentionPolicy:"keep"})
```

Over-limit response payload excerpt:

```json
{
  "summary": "Pre-flight validation failed: 1 error(s)",
  "data": {
    "status": "dry_run",
    "would_pass": false,
    "validation": {
      "errors": [
        {
          "code": "PF020",
          "message": "Content exceeds token budget: 8757 tokens (max: 8000)",
          "suggestion": "Reduce content by approximately 757 tokens (3028 characters)"
        }
      ],
      "warnings": [],
      "details": {
        "checks_run": ["content_size", "anchor_format", "token_budget", "duplicate_check"],
        "content_size": { "valid": true, "content_length": 34425 },
        "token_budget": {
          "within_budget": false,
          "estimated_tokens": 8757,
          "maxTokens": 8000,
          "percentage_used": 1.094625,
          "warnings": [],
          "errors": [
            {
              "code": "PF020",
              "message": "Content exceeds token budget: 8757 tokens (max: 8000)",
              "suggestion": "Reduce content by approximately 757 tokens (3028 characters)"
            }
          ]
        }
      }
    },
    "message": "Pre-flight validation failed: 1 error(s)"
  },
  "hints": ["Fix validation errors before saving"]
}
```

`preflight.ts` configuration and token-budget implementation readback:

```text
PREFLIGHT_CONFIG charsPerToken: parseFloat(process.env.MCP_CHARS_PER_TOKEN || '4')
PREFLIGHT_CONFIG max_tokens_per_memory: parseInt(process.env.MCP_MAX_MEMORY_TOKENS || '8000', 10)
PREFLIGHT_CONFIG warning_threshold: parseFloat(process.env.MCP_TOKEN_WARNING_THRESHOLD || '0.8')
estimateTokens: Math.max(1, Math.ceil(text.length / PREFLIGHT_CONFIG.charsPerToken))
checkTokenBudget defaults: maxTokens = PREFLIGHT_CONFIG.max_tokens_per_memory; warning_threshold = PREFLIGHT_CONFIG.warning_threshold; include_embedding_overhead = true
embeddingOverhead: 150
PF020 branch: if (estimated > maxTokens)
PF021 branch: else if (result.percentage_used >= warning_threshold)
```

### Pass / Fail

- **PASS**: Save-time `memory_save({dryRun:true})` preflight returned `PF021` for the near-limit canonical document and `PF020` for the over-limit canonical document, with `estimated_tokens`, `maxTokens`, `percentage_used`, and `Dry-run complete - no changes made` evidence matching the expected save-time preflight behavior.

### Failure Triage

Verify `preflight.ts` token counting math → Check `MCP_CHARS_PER_TOKEN`, `MCP_MAX_MEMORY_TOKENS`, and `MCP_TOKEN_WARNING_THRESHOLD` wiring → Inspect dry-run/save preflight behavior

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [13--memory-quality-and-indexing/pre-flight-token-budget-validation.md](../../feature_catalog/13--memory-quality-and-indexing/pre-flight-token-budget-validation.md)

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: 041
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `13--memory-quality-and-indexing/pre-flight-token-budget-validation-pi-a3.md`
