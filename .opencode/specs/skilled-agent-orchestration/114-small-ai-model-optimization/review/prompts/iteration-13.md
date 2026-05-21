DEEP-REVIEW

# Deep-Review Iteration Prompt Pack — iter 13 of 20

## STATE

state_summary: 12 iters done. Iter 12 STRESS-TEST confirmed both P1s are real, reproducible, untested security gaps. Iter 13: investigate whether schema-validation defense-in-depth could catch the bugs at matrix-load time, providing protection before they reach the runtime gate.

Review Iteration: 13 of 20
Mode: review
Dimension: **schema-layer defense-in-depth**
Running: P0=0, P1=2, P2=13

## ITERATION 13 FOCUS — SCHEMA AS DEFENSE-IN-DEPTH

### Check 1: Schema enforcement of deny-precedence

Read `.opencode/skills/cli-opencode/assets/permissions-matrix.schema.json` fully.

Question: Could the JSON Schema impose a constraint that rejects matrices with identical-specificity allow-before-deny ordering?

Possible mechanisms:
- A `uniqueItems` constraint with `effect` discriminator
- A semantic constraint on rule ordering (probably NOT expressible in pure JSON Schema)
- An external validator gate that linted the matrix before passing to permissions-gate.ts

Read 3 example matrices to see how the project structures matrices:
- `.opencode/skills/cli-opencode/assets/permissions-matrix.example-readonly.json`
- `.opencode/skills/cli-opencode/assets/permissions-matrix.example-packet-local.json`
- `.opencode/skills/cli-opencode/assets/permissions-matrix.example-repo-wide.json`

Check whether any example uses the dangerous allow-before-deny pattern. If yes → existing examples violate the implicit ordering convention; flag P1.

### Check 2: Schema enforcement of absolute-path globs

Same schema file. Check if `target_glob` has a `pattern` constraint that rejects paths starting with `/`.

If yes → schema already provides defense; the runtime gap is mitigated by schema validation BEFORE the matrix reaches permissions-gate.ts; downgrade F3.

If no → schema is permissive; runtime gap remains exploitable.

### Check 3: Validator layer between schema + runtime

Search for any validator script or function that runs JSON Schema validation against an input matrix before the matrix is consumed by `evaluatePermissions` / `findBestRule`.

Possible locations:
- `permissions-gate.ts` imports a JSON validator (Ajv, etc.)?
- `system-spec-kit/mcp_server/lib/deep-loop/` has a separate validator?
- `cli-opencode/scripts/` has a lint script?

If validator exists → schema is enforced; if validator missing → schema is documentation-only.

### Check 4: Runtime mitigation paths

In permissions-gate.ts, look for any code that could plausibly mitigate F3 (abs-path escape) WITHOUT adding new checks. For instance:
- Does the actual call site of `evaluatePermissions` always pass repo-relative paths?
- Are there callers that hard-code path normalization before passing to the gate?

If callers consistently normalize → runtime gap is mitigated at the call-site layer; F3 downgrade possible.

If callers pass arbitrary path → F3 stays P1.

## STATE FILES

- Write iter to: `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/review/iterations/iteration-013.md`
- Write delta to: `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/review/deltas/iter-013.jsonl`
- State log: `.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/review/deep-review-state.jsonl`

## CONSTRAINTS

- LEAF. Soft 12 / hard 13 tool calls. Read-only.
- Allowed write: 3 paths above.
- Absolute paths.

## OUTPUT CONTRACT

1. **iteration-013.md** — Per-check sections + findings + verdict + next focus.
2. **state.jsonl APPEND** — single line.
3. **deltas/iter-013.jsonl** — multi-line.

## EXECUTION

1. sequential_thinking 5+ thoughts.
2. Read permissions-matrix.schema.json + 3 examples.
3. Grep for validator / Ajv / JSONSchema in cli-opencode + system-spec-kit.
4. Grep for callers of `evaluatePermissions` to see how paths are passed in.
5. Compose iter + delta + state. Stop.
