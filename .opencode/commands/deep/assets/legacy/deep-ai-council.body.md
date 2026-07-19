Thin router for the deep-ai-council session loop. This command verifies the orchestrating agent, resolves setup and execution mode, loads the presentation contract, then executes the owned workflow YAML.

## 1. ROUTER CONTRACT

Do not dispatch agents from this Markdown file. Agent dispatch, workflow steps, and artifact-writing behavior are owned by the workflow YAML assets.

Load the presentation contract before showing startup questions, dashboards, checkpoints, success output, failure output, examples, or next-step prompts.

This command is **general-agent based** and must pass the dispatch-context check before setup routing continues. Gate 1 (dispatch-context check) and Gate 2 (the BLOCKED Unified Setup Phase) are HARD BLOCKS; neither may be skipped.

### PHASE 0: DISPATCH-CONTEXT CHECK

**STATUS: ☐ CHECKED**

```
This gate checks actual dispatch context, not self-reported capability -- the prior
self-assessment version of this check produced a confirmed false-positive block (a
capable agent judged itself "uncertain" on an abstract question and hard-stopped).

CHECK: was this file invoked directly as /deep:ai-council (typed by the user, or an
explicit Task delegation naming this exact command) -- as opposed to another agent
pasting this file's raw content into a Task-dispatch prompt as inline ad hoc
instructions for a worker to follow (that worker should follow its own dispatch
prompt, not re-run this command's full setup contract)?

├─ YES, or no concrete evidence of the pasted-inline case:
│   └─ general_agent_verified = TRUE → Continue to the Unified Setup Phase (also a HARD BLOCK)
│
└─ NO, with concrete evidence this file's content was pasted inline rather than
   invoked as the command itself:
    │
    ├─ ⛔ HARD BLOCK - DO NOT PROCEED
    │
    ├─ DISPLAY to user:
    │   ┌────────────────────────────────────────────────────────────┐
    │   │ ⛔ DIRECT INVOCATION REQUIRED                              │
    │   │                                                            │
    │   │ This command orchestrates the deep-ai-council session and  │
    │   │ runs general-agent based.                                  │
    │   │                                                            │
    │   │ To proceed, restart with:                                  │
    │   │   /deep:ai-council [arguments]                             │
    │   └────────────────────────────────────────────────────────────┘
    │
    └─ RETURN: STATUS=FAIL ERROR="Must be invoked directly, not pasted as inline sub-agent instructions"

Default on ambiguity: PROCEED. Do not block on an inability to introspect abstract
capability (e.g. "can I orchestrate a workflow") -- that question is unanswerable
from the inside and is what caused the original false-positive block. Block only on
concrete evidence of the pasted-inline case above.
```

**Phase Output:**
- `general_agent_verified = ________________`

### MANDATORY INPUT GATE

- **DO NOT** dispatch any agent from this document.
- **ALL** agent dispatching is handled by the YAML workflow steps.
- **MARKDOWN OWNS SETUP**: resolve setup inputs here first, then hand off to YAML.
- **YAML START CONDITION**: do not load YAML until ALL required inputs are bound:
  - `deliberation_topic` or `topics`
  - `max_rounds_per_topic`
  - `max_topics_per_session`
  - `saturation_threshold`
  - `convergenceThreshold`
  - `executor.*`
  - `spec_folder`
  - `execution_mode`
- **PLANNING BOUNDARY**: deep council writes packet-local `ai-council/**` artifacts only. Implementation remains with the caller or follow-on implementation agents.
- **GRAPH BOUNDARY**: derived council graph replay uses `runtime/` CLI scripts with `--loop-type council`; `ai-council/**` artifacts remain authoritative.
- **ONE CLI PER ROUND**: all seats in a round use one executor boundary. Different CLIs are separate rounds, not mixed seats.

> **Canonical mode syntax:** use attached command suffixes (`/deep:ai-council:auto`, `/deep:ai-council:confirm`) and keep AGENTS, skills, command references, and runtime mirrors synchronized to this entrypoint.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation source of truth | `.opencode/commands/deep/assets/deep-ai-council-presentation.txt` |
| Auto workflow | `.opencode/commands/deep/assets/deep-ai-council-auto.yaml` |
| Confirm workflow | `.opencode/commands/deep/assets/deep-ai-council-confirm.yaml` |

No workflow-asset gap exists for this command.

---

## 3. MODE ROUTING

1. Parse `$ARGUMENTS` for attached command suffixes (`:auto` or `:confirm`). Canonical mode syntax is `/deep:ai-council:auto` and `/deep:ai-council:confirm`.
2. Treat topic text, `--max-rounds-per-topic`, `--max-topics`, `--saturation`, `--convergence`, `--spec-folder`, executor flags, and pre-bound setup answers as workflow inputs, not execution modes.
3. If `:auto` is present, set `execution_mode = AUTONOMOUS` and resolve required setup inputs through the presentation contract's three-tier auto setup resolution before loading YAML.
4. If `:confirm` is present, set `execution_mode = INTERACTIVE` and use the presentation contract's consolidated setup prompt before loading YAML.
5. If no mode suffix is present, set `execution_mode = ASK` and use the presentation contract's consolidated setup prompt to ask for execution mode.
6. Load the selected workflow asset only after `deliberation_topic` or `topics`, `max_rounds_per_topic`, `max_topics_per_session`, `saturation_threshold`, `convergenceThreshold`, `executor.*`, `spec_folder`, and `execution_mode` are bound.

---

## 4. EXECUTION TARGETS

| Mode | Workflow |
|------|----------|
| `:auto` | `.opencode/commands/deep/assets/deep-ai-council-auto.yaml` |
| `:confirm` or interactive choice | `.opencode/commands/deep/assets/deep-ai-council-confirm.yaml` |

---

## 5. PRESENTATION BOUNDARY

The following content lives only in `.opencode/commands/deep/assets/deep-ai-council-presentation.txt`:

- Startup-question wording, consolidated setup prompt text, question text, and reply-format examples.
- `:auto` pre-bound setup answer schema, default resolution table, targeted-ask rules, and fail-fast display behavior.
- Dashboard/checkpoint layouts, workflow overview displays, mode behavior descriptions, and council reference displays.
- Success, failure, and cancelled result templates, output formats, and final status wording.
- Example invocations, memory integration display wording, skill references, and next-step suggestion wording.

---

## 6. WORKFLOW SUMMARY

The YAML workflow runs a bounded multi-topic AI Council session under `{spec_folder}/ai-council/`: it initializes session state, runs topic loops with findings-registry priors, evaluates adjudicator-verdict stability, synthesizes per-topic and session reports, and refreshes packet continuity. Convergence uses the council-specific 0.20 default on adjudicator-verdict stability; do not transfer sibling defaults from deep-review or deep-research. Packet-local `ai-council/**` artifacts remain canonical, and derived council graph replay uses `runtime/` CLI scripts with `--loop-type council`.

For single-round planning, use the regular `ai-council` agent behavior. After a successful deep council session, continue to implementation planning or the next packet phase.
