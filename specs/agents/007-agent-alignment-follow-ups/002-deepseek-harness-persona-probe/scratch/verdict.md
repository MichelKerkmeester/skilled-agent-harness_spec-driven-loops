# Verdict for the DeepSeek Harness persona probe

verdict: no-line-needed

## Evidence

| Run | Prompt | Exit code | Last `final` reason kind | Tool the child called | Last line of the final message |
|---|---|---|---|---|---|
| Control, no mapping line | `scratch/dsh-control-prompt.txt` | 0 | `completed` | `read` on `.skilled/agents/README.txt` | `FILES READ: .skilled/agents/README.txt` |
| Probe, with the mapping line | `scratch/dsh-probe-prompt.txt` | 0 | `completed` | `read` on `.skilled/agents/README.txt` | `FILES READ: .skilled/agents/README.txt` |

- Reports: `scratch/dsh-control-report.txt` and `scratch/dsh-probe-report.txt`. Event streams: `scratch/dsh-control-events.jsonl` and `scratch/dsh-probe-events.jsonl`.
- Both stderr streams were empty.
- dsh version: 0.2.2-rc.3. The skill pins 0.2.2-rc.1. The operator waived the pin for this probe on 2026-11-14.
- Route: LLM Gateway, `deepseek-v4.1-flash-1017` at max.
- Persona: `context`, inlined in full. It denies Bash and names Read, Grep and Glob.

## Why no line is needed

The harness gives the model a tool named `read`. The control child was given a persona that denies Bash and names `Read`, with no mapping line, and it called `read` on the file it was asked for. The absence of a read tool in the harness documents was a gap in the documents, not in the harness.

## Limits of this evidence

- One run each way is one sample. The verdict is observed once and not proven.
- The runs were made on 0.2.2-rc.3, not the pinned 0.2.2-rc.1.
- Only a read was tested. The names of the harness's search tools were not observed, so a persona task that needs Grep or Glob is untested.
- The skill is not changed, as the spec requires for this verdict. Its sentence listing the harness tool names leaves out `read`. That is a documentation defect outside this phase's scope and is reported, not fixed.
