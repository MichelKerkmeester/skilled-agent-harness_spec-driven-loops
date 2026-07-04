## DELIVERABLE 1

Current anchors: executor audit can already attest executor kind/model/effort/tier at `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts:562-569`, writes dispatch failures at `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts:637-645`, and filters child env at `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts:537-553`. Deep review state lives under `{artifact_dir}` with state log at `.opencode/commands/deep/assets/deep_review_auto.yaml:86-110`.

```ts
// .opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts

export type DispatchReceiptExecutorKind = 'native_task' | 'audited_cli';

export type DispatchReceiptRecord = {
  type: 'event';
  event: 'dispatch_receipt';
  schemaVersion: 1;
  dispatchId: string;
  iteration: number;
  mode: string;
  receiptKind: DispatchReceiptExecutorKind;
  executor: {
    kind: ExecutorKind;
    model?: string | null;
    reasoningEffort?: string | null;
    serviceTier?: string | null;
  };
  child: {
    sessionId: string;
    pid?: number | null;
    sessionIdSource: 'native_dispatch' | 'parent_dispatch_id' | 'executor_env';
  };
  route: {
    mode: string;
    targetAgent: string;
    agentDefinitionLoaded: boolean;
    resolvedRoute: string;
  };
  prompt: {
    path: string;
    sha256: string;
    bytes: number;
  };
  state: {
    stateLogPath: string;
    previousStateLogSize: number;
    receiptLogPath: string;
  };
  writer: {
    mechanism: 'native-task-dispatch' | 'runAuditedExecutorCommand';
    parentPid: number;
    cwd: string;
  };
  timestamps: {
    receiptCreatedAt: string;
  };
  mac: string;
};
```

```jsonl
{"type":"event","event":"dispatch_receipt","schemaVersion":1,"dispatchId":"uuid","iteration":3,"mode":"review","receiptKind":"audited_cli","executor":{"kind":"cli-opencode","model":"openai/gpt-5.5","reasoningEffort":"high","serviceTier":null},"child":{"sessionId":"uuid","pid":null,"sessionIdSource":"parent_dispatch_id"},"route":{"mode":"review","targetAgent":"deep-review","agentDefinitionLoaded":true,"resolvedRoute":"Resolved route: mode=review target_agent=deep-review"},"prompt":{"path":"{artifact_dir}/prompts/iteration-3.md","sha256":"sha256hex","bytes":12345},"state":{"stateLogPath":"{artifact_dir}/deep-review-state.jsonl","previousStateLogSize":45678,"receiptLogPath":"{artifact_dir}/dispatch-receipts.jsonl"},"writer":{"mechanism":"runAuditedExecutorCommand","parentPid":1234,"cwd":"{repo_root}"},"timestamps":{"receiptCreatedAt":"2026-07-03T00:00:00.000Z"},"mac":"hmac-sha256:hex"}
```

Write location: add `state_paths.dispatch_receipts: "{artifact_dir}/dispatch-receipts.jsonl"` beside `state_paths.state_log`. The HMAC key is parent-generated per dispatch, passed only as workflow-private binding to validation, never written to prompt/state and never passed through `buildExecutorDispatchEnv`.

## DELIVERABLE 2

Current anchors: dispatch starts at `.opencode/commands/deep/assets/deep_review_auto.yaml:765-816`; the vulnerable `opencode run` branch is `.opencode/commands/deep/assets/deep_review_auto.yaml:904-928`; validation wiring is `.opencode/commands/deep/assets/deep_review_auto.yaml:928-960`.

```yaml
# .opencode/commands/deep/assets/deep_review_auto.yaml
# before, state_paths excerpt

state_log: "{artifact_dir}/deep-review-state.jsonl"
```

```yaml
# .opencode/commands/deep/assets/deep_review_auto.yaml
# after, state_paths excerpt

state_log: "{artifact_dir}/deep-review-state.jsonl"
dispatch_receipts: "{artifact_dir}/dispatch-receipts.jsonl"
```

```yaml
# .opencode/commands/deep/assets/deep_review_auto.yaml
# before, dispatch excerpt

pre_dispatch_audit:
  skip_when: "config.executor.kind == 'native'"
  call: ".opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts#writeFirstRecordExecutor"
  args:
    stateLogPath: "{state_paths.state_log}"
    executor: "{config.executor}"
    iteration: "{current_iteration}"
branch_on: "config.executor.kind"
```

```yaml
# .opencode/commands/deep/assets/deep_review_auto.yaml
# after, dispatch excerpt

pre_dispatch_receipt:
  call: ".opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts#writeDispatchReceipt"
  output: "{dispatch_receipt}"
  args:
    receiptLogPath: "{state_paths.dispatch_receipts}"
    stateLogPath: "{state_paths.state_log}"
    promptPath: "{state_paths.prompt_dir}/iteration-{current_iteration}.md"
    executor: "{config.executor}"
    iteration: "{current_iteration}"
    receiptKind: "{config.executor.kind == 'native' ? 'native_task' : 'audited_cli'}"
    routeProof:
      mode: review
      target_agent: deep-review
      agent_definition_loaded: true
      resolved_route: "Resolved route: mode=review target_agent=deep-review"

pre_dispatch_audit:
  skip_when: "config.executor.kind == 'native'"
  call: ".opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts#writeFirstRecordExecutor"
  args:
    stateLogPath: "{state_paths.state_log}"
    executor: "{config.executor}"
    iteration: "{current_iteration}"

branch_on: "config.executor.kind"
```

```yaml
# .opencode/commands/deep/assets/deep_review_auto.yaml
# before, cli-opencode branch

if_cli_opencode:
  command: |
    opencode run \
      --model "{config.executor.model}" \
      --format json \
      --dangerously-skip-permissions \
      --pure \
      --dir "{repo_root}" \
      {optional_variant_flag} \
      "$(printf '%s\n\n' 'Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true'; cat '{state_paths.prompt_dir}/iteration-{current_iteration}.md')" \
      </dev/null
```

```yaml
# .opencode/commands/deep/assets/deep_review_auto.yaml
# after, cli-opencode branch

if_cli_opencode:
  command: |
    node --experimental-strip-types --input-type=module <<'EOF'
    import { readFileSync } from 'node:fs';

    import { runAuditedExecutorCommand } from './.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts';

    const executor = {
      kind: 'cli-opencode',
      model: '{config.executor.model}',
      reasoningEffort: '{config.executor.reasoningEffort}' === 'null' ? null : '{config.executor.reasoningEffort}',
      serviceTier: '{config.executor.serviceTier}' === 'null' ? null : '{config.executor.serviceTier}',
      timeoutSeconds: Number('{config.executor.timeoutSeconds}'),
    };

    const routeLine = 'Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true';
    const prompt = `${routeLine}\n\n${readFileSync('{state_paths.prompt_dir}/iteration-{current_iteration}.md', 'utf8')}`;

    const args = [
      'run',
      '--model',
      executor.model,
      '--format',
      'json',
      '--dangerously-skip-permissions',
      '--pure',
      '--dir',
      '{repo_root}',
      {optional_variant_arg_array}
      prompt,
    ];

    process.exit(runAuditedExecutorCommand({
      command: 'opencode',
      args,
      cwd: '{repo_root}',
      timeoutSeconds: executor.timeoutSeconds,
      stateLogPath: '{state_paths.state_log}',
      executor,
      iteration: Number('{current_iteration}'),
      dispatchReceipt: {
        receiptLogPath: '{state_paths.dispatch_receipts}',
        dispatchId: '{dispatch_receipt.dispatchId}',
        receiptKey: '{dispatch_receipt.key}',
        promptText: prompt,
        routeProof: {
          mode: 'review',
          targetAgent: 'deep-review',
          agentDefinitionLoaded: true,
          resolvedRoute: 'Resolved route: mode=review target_agent=deep-review',
        },
      },
    }));
    EOF
```

```yaml
# .opencode/commands/deep/assets/deep_review_auto.yaml
# after, post_dispatch_validate excerpt

post_dispatch_validate:
  validator: ".opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts#validateIterationOutputs"
  assert_exists: "{state_paths.iteration_pattern}"
  assert_appended: "{state_paths.state_log}"
  assert_jsonl_fields: [type, iteration, mode, run, status, focus, dimensions, filesReviewed, findingsCount, findingsSummary, findingsNew, findingDetails, newFindingsRatio, sessionId, generation, lineageMode, timestamp, durationMs]
  dispatch_receipt:
    receipt_log_path: "{state_paths.dispatch_receipts}"
    dispatch_id: "{dispatch_receipt.dispatchId}"
    receipt_key: "{dispatch_receipt.key}"
  route_proof:
    mode: review
    target_agent: deep-review
    agent_definition_loaded: true
    resolved_route: "Resolved route: mode=review target_agent=deep-review"
```

## DELIVERABLE 3

Current anchors: validator input shape is `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:30-39`, failure result shape is `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:177-205`, route proof currently trusts model-written fields at `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:619-666`, and validation calls that route proof at `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:1384-1394`.

```ts
// .opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts

export type DispatchReceiptExpectation = {
  receiptLogPath: string;
  dispatchId: string;
  receiptKey: string;
  required?: boolean;
};

export type PostDispatchValidateInput = {
  iterationFile: string;
  stateLogPath: string;
  previousStateLogSize: number;
  requiredJsonlFields: string[];
  executorKind?: ExecutorKind;
  deltaFilePath?: string;
  routeProof?: RouteProofExpectation;
  dispatchReceipt?: DispatchReceiptExpectation;
  recipeConfig?: PostDispatchRecipeConfig;
};

type PostDispatchFailureReason =
  | 'dispatch_receipt_missing'
  | 'dispatch_receipt_invalid'
  | 'dispatch_receipt_route_mismatch'
  | 'dispatch_receipt_prompt_mismatch'
  | 'iteration_file_missing'
  | 'iteration_file_empty'
  | 'jsonl_not_appended'
  | 'jsonl_missing_fields'
  | 'jsonl_parse_error'
  | 'jsonl_wrong_type'
  | 'delta_file_missing'
  | 'delta_file_empty'
  | 'delta_file_missing_iteration_record'
  | 'executor_missing'
  | 'dispatch_failure_logged'
  | 'verification_degraded'
  | 'route_proof_missing'
  | 'route_proof_mismatch'
  | 'v2_missing_ledger'
  | 'v2_uncited_ledger_row'
  | 'v2_broken_linked_finding'
  | 'v2_shallow_finding_details'
  | 'delta_iteration_id_mismatch';
```

Behavior change:

```ts
// .opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts

// validateIterationOutputs now loads and verifies dispatchReceipt before trusting route proof.
// A missing receipt is a hard failure whenever routeProof is configured.
// Model-written target_agent, agent_definition_loaded, and resolved_route are no longer required fields.
// If model-written route fields exist, they must match the signed receipt.
// If they are absent, validation uses the signed receipt as the route proof.

const receipt = requireSignedDispatchReceipt(input.dispatchReceipt, input.routeProof, {
  iteration: parsedRecord.iteration,
  executorKind: input.executorKind,
  previousStateLogSize: input.previousStateLogSize,
});

const stateRouteFailure = compareAdvisoryRouteFields(parsedRecord, receipt.route, 'state_log');
if (stateRouteFailure) return stateRouteFailure;

if (deltaIterationRecord) {
  const deltaRouteFailure = compareAdvisoryRouteFields(deltaIterationRecord, receipt.route, 'delta');
  if (deltaRouteFailure) return deltaRouteFailure;
}
```

Test-case one-liners:

```text
native dispatch -> pass: signed native_task receipt exists for dispatchId, route matches expected, state iteration appended, model route fields absent or matching.
audited CLI -> pass: signed audited_cli receipt exists from runAuditedExecutorCommand, executor kind/model match, prompt hash matches, state iteration appended.
inline work + forged JSONL -> reject: state log has target_agent/resolved_route but no HMAC-valid dispatch_receipt for dispatchId.
receipt present but route mismatch -> reject: HMAC-valid receipt route differs from configured route_proof or advisory state route fields.
receipt replay -> reject: receipt dispatchId valid but previousStateLogSize/iteration does not match this validation window.
direct opencode run bypass -> reject: branch writes artifacts but no wrapper/private receipt binding reaches validator.
```

## DELIVERABLE 4

Existing green Claude native path currently dispatches directly at `.opencode/commands/deep/assets/deep_review_auto.yaml:811-816` and validation currently accepts model-written route proof at `.opencode/commands/deep/assets/deep_review_auto.yaml:928-937`.

What breaks: any path that reaches `validateIterationOutputs` without `dispatch_receipt` now fails with `dispatch_receipt_missing`.

How to keep Claude native passing unchanged: write the receipt in the parent workflow before the existing native `dispatch` block, do not add receipt fields to the prompt pack variables at `.opencode/commands/deep/assets/deep_review_auto.yaml:787-803`, and do not require Claude to change its JSONL output. Existing model-written route fields may remain, but they become advisory and are checked only against the parent-written receipt.
