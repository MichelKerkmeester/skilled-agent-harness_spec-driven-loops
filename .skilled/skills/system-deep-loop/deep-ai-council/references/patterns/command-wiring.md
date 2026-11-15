---
title: "AI Council Command Wiring"
description: "Canonical post-dispatch wiring for persisting AI Council packet artifacts."
trigger_phrases:
  - "deep-ai-council command wiring"
  - "council persistence helper"
  - "persist council artifacts"
  - "council yaml workflow"
importance_tier: "normal"
contextType: "implementation"
version: 1.7.4.0
---

# AI Council Command Wiring

This reference defines who writes AI Council packet artifacts, how state events reach the append gateway, and the helper fallback for callers that hold a council report the agent did not write.

---

## 1. OVERVIEW

### Purpose

Durable packet artifacts for every council run, with one named writer per run.

### When to Use

- A caller dispatches `@ai-council` and needs to know what the agent writes and what the caller still owns.
- A command YAML or an external CLI playbook holds a council report and owns the persistence step.

### Single Writer Authority

When a caller dispatches `@ai-council`, the agent is the one writer of that run's `ai-council/**` artifacts. It writes them with Write and Edit, in the shapes the named exports of `.skilled/skills/system-deep-loop/deep-ai-council/scripts/lib/persist-artifacts.cjs` produce: `writeConfig`, `writeStrategyMd`, `writeSeat`, `writeDeliberation`, `writeCritique` and `writeReport`. The dispatching parent does not write council artifacts and does not run the helper after the agent returns. It handles code or spec changes once the council's plan is in.

Runs that never dispatch `@ai-council` have their own writer. `/deep:ai-council` dispatches each seat through `orchestrate-session.cjs` and persists it with the helper. A playbook that captures a report from an external runtime runs the helper itself. In those runs the helper is the one writer.

### Recording State Through the Append Gateway

The agent has no Bash, so it names every state event in its report, in order, and the caller records each one:

```bash
node .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs \
  --mode ai-council \
  --run-directory <resolved ai-council packet root> \
  --event-json <event payload file>
```

The gateway authorizes the event against the mode's durable authority and keeps it in the mode ledger. Exit `0` means the event is durable; exit `2` means it was refused, so halt and name the check the refusal reports. The gateway does not refresh `ai-council-state.jsonl`, because `append-mode-event.ts` registers no projection for this mode. Never fall back to a direct write of that file from the agent.

### Scoped-Write Rules

1. **Allowed root**: `<packet>/ai-council/**` only.
2. **Denied operations**: Bash and Patch stay denied to the agent. It does not shell out for persistence.
3. **Out-of-scope writes**: any target outside `ai-council/**` fails with `OUT_OF_SCOPE_WRITE` before it touches the filesystem.

This convention applies to council runs from its adoption forward. Outputs in earlier packets stay where they are and are not migrated.

---

## 2. CALLER PATTERNS

### Top-Level Task Dispatch

A user or top-level assistant dispatches `@ai-council`. The agent writes its artifacts, and the caller records the state events the report names.

### `@orchestrate` at Depth 1

`@orchestrate` dispatches `@ai-council` as a LEAF. The agent writes its artifacts in context and returns the report with its state events. `@orchestrate` runs no helper afterwards.

Use this when multi-agent planning is part of a larger implementation workflow.

### Command YAML Workflow

A command YAML that holds a council report it did not get from `@ai-council` follows it with a persistence step. The command workflow owns the helper invocation. `/deep:ai-council` is this pattern.

### CLI-Skill Playbook

`cli-claude-code`, `cli-opencode`, and `cli-codex` playbooks may capture a council report from an external runtime and then invoke the helper locally. Each playbook stays within ONE CLI per round (`SKILL.md §5` ALWAYS rule 6); multi-CLI deliberations stage additional dedicated rounds.

Use this when an external AI vantage contributes the report but packet artifacts still need to land in the local spec folder.

---

## 3. SHELL SNIPPET

The snippets in this section and the next show the helper fallback, for a caller that holds a council report from a runtime that could not write it. Do not run the helper after an `@ai-council` dispatch: the agent already wrote that run's artifacts.

```bash
PACKET="<spec-folder>"
REPORT="/tmp/council-report.md"
PAYLOAD="/tmp/council-payload.json"

# 1. Run council through the caller-owned dispatch mechanism and write report text.
# 2. Check ai-council-config.json's current_round against max_rounds. If the round
#    ceiling was reached without a converged report, pass --not-converged so the
#    persisted council_complete event honestly records convergence:false instead of
#    defaulting to true (the helper cannot infer max-round exhaustion on its own —
#    that state lives in the config the caller already tracks).
# 3. Persist packet-local ai-council artifacts and emit optional memory payload.
CONVERGED_FLAG=""
if [ "$(jq -r '.current_round >= .max_rounds' "$PACKET/ai-council-config.json")" = "true" ] && ! grep -q "converged" "$REPORT"; then
  CONVERGED_FLAG="--not-converged"
fi
node .skilled/skills/system-deep-loop/deep-ai-council/scripts/persist-artifacts.cjs "$PACKET" \
  --input-file "$REPORT" \
  --memory-save-payload-out "$PAYLOAD" \
  $CONVERGED_FLAG

# 3. Optional: route payload through the existing canonical memory save workflow.
node .skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js \
  "$PAYLOAD" "$PACKET"
```

The payload uses existing `generate-context.js` categories such as decision record, implementation summary, and handover routing. It does not create a new ANCHOR family.

---

## 4. YAML SNIPPET

```yaml
steps:
  - id: step_run_council
    uses: agent
    agent: deep-ai-council
    depth: 1
    output: council_report
    with:
      task: "${packet.task}"
      context_package: "${packet.context_package}"

  - id: step_write_council_report
    uses: file.write
    path: "${runtime.tmp}/council-report.md"
    content: "${steps.step_run_council.outputs.council_report}"

  - id: step_persist_council
    uses: shell.exec
    # Pass --not-converged when step_run_council exhausted max_rounds without a
    # converged report — see §3's shell snippet for the equivalent config check.
    # The helper cannot detect max-round exhaustion itself; the caller must tell it.
    command: >
      node .skilled/skills/system-deep-loop/deep-ai-council/scripts/persist-artifacts.cjs
      "${packet.spec_folder}"
      --input-file "${runtime.tmp}/council-report.md"
      --memory-save-payload-out "${runtime.tmp}/council-payload.json"
      ${steps.step_run_council.outputs.max_rounds_exhausted && '--not-converged' || ''}

  - id: step_optional_memory_save
    uses: shell.exec
    if: "${packet.enable_memory_save}"
    command: >
      node .skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js
      "${runtime.tmp}/council-payload.json"
      "${packet.spec_folder}"
```

This is a documentation-only pattern. This pattern does not edit live `/speckit:*` YAML assets.

---

## 5. HELPER INPUTS

| Input | Required | Purpose |
| --- | --- | --- |
| `<packet-spec-folder>` | Yes | Destination packet folder containing `ai-council/` artifacts. |
| `--input-file FILE` | Usually | Council report markdown captured from the planning agent. If omitted, stdin is used. |
| `--round NNN` | No | Round number for generated seat and deliberation paths. Defaults to `1`. |
| `--strict-output` | No | Omits placeholder optional sections from rendered artifacts. |
| `--memory-save-payload-out FILE` | No | Writes a `generate-context.js` compatible JSON payload when the council completes. |
| `--not-converged` | No | Records convergence:false on the persisted council_complete event when the round ceiling was reached without a converged report |

---

## 6. EXPECTED OUTPUTS

The helper writes these packet-local artifacts:

- `ai-council/ai-council-config.json`
- `ai-council/ai-council-strategy.md`
- `ai-council/ai-council-state.jsonl`
- `ai-council/seats/round-NNN/*.md`
- `ai-council/deliberations/round-NNN.md`
- `ai-council/council-report.md`

When `--memory-save-payload-out FILE` is present, the helper also writes the payload file outside the packet if requested by the caller.

---

## 7. FAILURE HANDLING

The helper exits `1` when required report sections are missing. It exits `2` when artifact or payload writes partially fail. Callers should surface that status and avoid running `generate-context.js` if the payload file was not written.

The advisory checker remains informational:

```bash
node .skilled/skills/system-deep-loop/deep-ai-council/scripts/advise-council-completion.cjs "$PACKET"
```

It always exits `0` and is not part of `validate.sh --strict`.

---

## 8. CROSS-REFERENCES

- Agent body §7 RULES (persistence rule and the pointer to this reference): `.skilled/agents/ai-council.md`
- Output schema: `.skilled/skills/system-deep-loop/deep-ai-council/references/structure/output-schema.md`
- State format: `.skilled/skills/system-deep-loop/deep-ai-council/references/structure/state-format.md`
- Persistence helper: `.skilled/skills/system-deep-loop/deep-ai-council/scripts/persist-artifacts.cjs`
- Memory save entrypoint: `.skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js`
