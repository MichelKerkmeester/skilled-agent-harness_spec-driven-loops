# Multi-AI Council Command Wiring

This reference defines the canonical post-dispatch wiring for callers that run `@multi-ai-council` and need durable packet artifacts.

## Purpose

`@multi-ai-council` is planning-only. It returns a council report and cannot write, edit, patch, or run shell commands. The dispatching parent owns persistence by invoking `.opencode/skill/system-spec-kit/scripts/multi-ai-council/persist-artifacts.cjs` after the report is captured.

Future `/spec_kit:*` consumers and CLI-skill playbooks should use the same helper invocation so council artifacts, state JSONL, and optional memory-save payloads stay consistent.

## Caller Patterns

### Top-Level Task Dispatch

A user or top-level assistant dispatches `@multi-ai-council`, stores the returned report as `council-report.md`, then invokes the helper.

Use this when the council is requested directly and the caller can run shell commands after the planning agent returns.

### `@orchestrate` at Depth 1

`@orchestrate` dispatches `@multi-ai-council` as a LEAF. The LEAF returns report text only. `@orchestrate` then persists artifacts using the helper from its own write-capable context.

Use this when multi-agent planning is part of a larger implementation workflow.

### `/spec_kit:*` YAML Workflow

A command YAML dispatches the council as a planning step and follows it with a persistence step. The command workflow owns the helper invocation, not the council agent.

Use this for future command-owned council workflows, completion flows, or planning commands.

### CLI-Skill Playbook

`cli-claude-code`, `cli-codex`, `cli-opencode`, and `cli-gemini` playbooks may capture a council report from an external runtime and then invoke the same helper locally.

Use this when an external AI vantage contributes the report but packet artifacts still need to land in the local spec folder.

## Shell Snippet

```bash
PACKET=".opencode/specs/skilled-agent-orchestration/092-multi-ai-council-deferrals"
REPORT="/tmp/council-report.md"
PAYLOAD="/tmp/council-payload.json"

# 1. Run council through the caller-owned dispatch mechanism and write report text.
# 2. Persist packet-local ai-council artifacts and emit optional memory payload.
node .opencode/skill/system-spec-kit/scripts/multi-ai-council/persist-artifacts.cjs "$PACKET" \
  --input-file "$REPORT" \
  --memory-save-payload-out "$PAYLOAD"

# 3. Optional: route payload through the existing canonical memory save workflow.
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js \
  "$PAYLOAD" "$PACKET"
```

The payload uses existing `generate-context.js` categories such as decision record, implementation summary, and handover routing. It does not create a new ANCHOR family.

## YAML Snippet

```yaml
steps:
  - id: step_run_council
    uses: agent
    agent: multi-ai-council
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
    command: >
      node .opencode/skill/system-spec-kit/scripts/multi-ai-council/persist-artifacts.cjs
      "${packet.spec_folder}"
      --input-file "${runtime.tmp}/council-report.md"
      --memory-save-payload-out "${runtime.tmp}/council-payload.json"

  - id: step_optional_memory_save
    uses: shell.exec
    if: "${packet.enable_memory_save}"
    command: >
      node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js
      "${runtime.tmp}/council-payload.json"
      "${packet.spec_folder}"
```

This is a documentation-only pattern. Packet 092 does not edit live `/spec_kit:*` YAML assets.

## Helper Inputs

| Input | Required | Purpose |
| --- | --- | --- |
| `<packet-spec-folder>` | Yes | Destination packet folder containing `ai-council/` artifacts. |
| `--input-file FILE` | Usually | Council report markdown captured from the planning agent. If omitted, stdin is used. |
| `--round NNN` | No | Round number for generated seat and deliberation paths. Defaults to `1`. |
| `--strict-output` | No | Omits placeholder optional sections from rendered artifacts. |
| `--memory-save-payload-out FILE` | No | Writes a `generate-context.js` compatible JSON payload when the council completes. |

## Expected Outputs

The helper writes these packet-local artifacts:

- `ai-council/ai-council-config.json`
- `ai-council/ai-council-strategy.md`
- `ai-council/ai-council-state.jsonl`
- `ai-council/seats/round-NNN/*.md`
- `ai-council/deliberations/round-NNN.md`
- `ai-council/council-report.md`

When `--memory-save-payload-out FILE` is present, the helper also writes the payload file outside the packet if requested by the caller.

## Failure Handling

The helper exits `1` when required report sections are missing. It exits `2` when artifact or payload writes partially fail. Callers should surface that status and avoid running `generate-context.js` if the payload file was not written.

The advisory checker remains informational:

```bash
node .opencode/skill/system-spec-kit/scripts/multi-ai-council/advise-council-completion.cjs "$PACKET"
```

It always exits `0` and is not part of `validate.sh --strict`.

## Cross-References

- Agent body §16: `.opencode/agent/multi-ai-council.md`
- Output schema: `.opencode/skill/system-spec-kit/references/multi-ai-council/output-schema.md`
- State format: `.opencode/skill/system-spec-kit/references/multi-ai-council/state-format.md`
- Persistence helper: `.opencode/skill/system-spec-kit/scripts/multi-ai-council/persist-artifacts.cjs`
- Memory save entrypoint: `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`
