# Iteration 020 — security

- Executor: cli-codex gpt-5.6-sol effort=high service_tier=fast sandbox=read-only
- Completed: 2026-07-30T07:35:50.791Z
- New findings: 2 (of 2 reported; prior total 74)
- Coverage: {"filesExamined":12,"keyPaths":[".opencode/specs/system-deep-loop/036-deep-loop-innovation/001-whole-system-gate/goal-file-manifest.txt",".opencode/skills/system-deep-loop/runtime/lib/deep-loop/observability-events.cjs",".opencode/skills/system-deep-loop/runtime/lib/deep-loop/prompt-pack.ts",".opencode/skills/system-deep-loop/runtime/lib/event-envelope/event-envelope-boundary.ts",".opencode/skills/system-deep-loop/runtime/lib/event-envelope/event-envelope.ts",".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs",".opencode/skills/system-deep-loop/runtime/scripts/status.cjs",".opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs",".opencode/skills/system-deep-loop/runtime/lib/council/round-state-jsonl.cjs",".opencode/skills/system-deep-loop/deep-review/SKILL.md",".opencode/skills/system-deep-loop/deep-review/references/protocol/quick-reference.md",".opencode/skills/system-deep-loop/SKILL.md"]}

## Summary
I traced the shared observability envelope and its status, convergence, fan-out, and council-state producer paths, then inspected the prompt and event-envelope boundaries. The observability layer performs no data minimization or secret/PII scrubbing: it preserves arbitrary producer payloads and serializes them verbatim. Fan-out and council integrations pass complete native records into that sink, while selected lifecycle events additionally expose the raw lineage label on stderr. I found two concrete P1 leakage defects; neither independently authorizes mutation or false certification.

## Findings
- [P1] F-020-01 Observability ledger persists unrestricted producer payloads @ .opencode/skills/system-deep-loop/runtime/lib/deep-loop/observability-events.cjs:109
  - evidence: normalizeObservabilityEvent stores `payload: { ...payload }` without an allowlist, recursive inspection, redaction, or sensitivity classification. appendObservabilityEvent then writes the complete envelope with `fs.appendFileSync(eventPath, `${JSON.stringify(envelope)}\n`, 'utf8')` at line 133. Actual bridges pass whole native objects: fanout-run.cjs line 315 passes `entry`, and round-state-jsonl.cjs line 101 passes `record`, so any prompt fragment, exception detail, credential, or PII placed in those extensible records is copied verbatim into observability-events.jsonl.
  - recommendation: Define a closed payload schema per event type and persist only operational metadata. Add recursive secret/PII rejection or redaction at this shared sink as defense in depth, cover nested objects and arrays, bound string sizes, and add tests using credential-shaped keys and prompt/error text.
- [P1] F-020-02 Loud lifecycle events disclose raw lineage labels on stderr @ .opencode/skills/system-deep-loop/runtime/lib/deep-loop/observability-events.cjs:137
  - evidence: For `stall_detected`, `orphan_requeued`, and `aborted`, the helper reads `envelope.payload.label` and interpolates it directly into `process.stderr.write(`[deep-loop] ${envelope.event}${label ? ` lineage=${label}` : ''}\n`)`. fanout-run.cjs passes its raw ledger entry into this helper and separately identifies `entry.label` as the lineage label. A label containing a user task name, path, email address, ticket subject, or accidentally pasted credential therefore reaches terminal capture, CI logs, and parent-process log collectors without escaping or redaction.
  - recommendation: Emit an opaque run or lineage identifier instead of the label. If human-readable labels are required, sanitize and length-bound them, redact credential/PII patterns, and place their emission behind an explicit diagnostic policy.

## Leaf output (verbatim JSON)
```json
{
  "iteration": 20,
  "dimension": "security",
  "summary": "I traced the shared observability envelope and its status, convergence, fan-out, and council-state producer paths, then inspected the prompt and event-envelope boundaries. The observability layer performs no data minimization or secret/PII scrubbing: it preserves arbitrary producer payloads and serializes them verbatim. Fan-out and council integrations pass complete native records into that sink, while selected lifecycle events additionally expose the raw lineage label on stderr. I found two concrete P1 leakage defects; neither independently authorizes mutation or false certification.",
  "findings": [
    {
      "severity": "P1",
      "dimension": "security",
      "title": "Observability ledger persists unrestricted producer payloads",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/observability-events.cjs",
      "line": 109,
      "evidence": "normalizeObservabilityEvent stores `payload: { ...payload }` without an allowlist, recursive inspection, redaction, or sensitivity classification. appendObservabilityEvent then writes the complete envelope with `fs.appendFileSync(eventPath, `${JSON.stringify(envelope)}\\n`, 'utf8')` at line 133. Actual bridges pass whole native objects: fanout-run.cjs line 315 passes `entry`, and round-state-jsonl.cjs line 101 passes `record`, so any prompt fragment, exception detail, credential, or PII placed in those extensible records is copied verbatim into observability-events.jsonl.",
      "recommendation": "Define a closed payload schema per event type and persist only operational metadata. Add recursive secret/PII rejection or redaction at this shared sink as defense in depth, cover nested objects and arrays, bound string sizes, and add tests using credential-shaped keys and prompt/error text."
    },
    {
      "severity": "P1",
      "dimension": "security",
      "title": "Loud lifecycle events disclose raw lineage labels on stderr",
      "file": ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/observability-events.cjs",
      "line": 137,
      "evidence": "For `stall_detected`, `orphan_requeued`, and `aborted`, the helper reads `envelope.payload.label` and interpolates it directly into `process.stderr.write(`[deep-loop] ${envelope.event}${label ? ` lineage=${label}` : ''}\\n`)`. fanout-run.cjs passes its raw ledger entry into this helper and separately identifies `entry.label` as the lineage label. A label containing a user task name, path, email address, ticket subject, or accidentally pasted credential therefore reaches terminal capture, CI logs, and parent-process log collectors without escaping or redaction.",
      "recommendation": "Emit an opaque run or lineage identifier instead of the label. If human-readable labels are required, sanitize and length-bound them, redact credential/PII patterns, and place their emission behind an explicit diagnostic policy."
    }
  ],
  "refutations": [],
  "coverage": {
    "filesExamined": 12,
    "keyPaths": [
      ".opencode/specs/system-deep-loop/036-deep-loop-innovation/001-whole-system-gate/goal-file-manifest.txt",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/observability-events.cjs",
      ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/prompt-pack.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/event-envelope/event-envelope-boundary.ts",
      ".opencode/skills/system-deep-loop/runtime/lib/event-envelope/event-envelope.ts",
      ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs",
      ".opencode/skills/system-deep-loop/runtime/scripts/status.cjs",
      ".opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs",
      ".opencode/skills/system-deep-loop/runtime/lib/council/round-state-jsonl.cjs",
      ".opencode/skills/system-deep-loop/deep-review/SKILL.md",
      ".opencode/skills/system-deep-loop/deep-review/references/protocol/quick-reference.md",
      ".opencode/skills/system-deep-loop/SKILL.md"
    ]
  }
}
```