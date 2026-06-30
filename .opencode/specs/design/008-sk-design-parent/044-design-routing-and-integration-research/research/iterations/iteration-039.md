# Iteration 39: D4-A8 - Inner Generator Payload Boundary

## Focus

[D4-A8 / D4] inner-generator context loss: `start_run --agent` spawns a second model with no guaranteed `sk-design` context. This iteration narrows prior D4 token/gate findings into the payload contract needed at the Open Design inner-agent boundary: compile the `sk-design` judgment into the `start_run` brief and into every discovery-form answer, then bind those payloads to the run-scoped proof token.

## Actions Taken

1. Re-read the active strategy and prior boundary work to avoid repeating D4-A1 through D4-A5 and D3-A9. Prior work already established a tool-bound `skDesignGate`, a positive pure-transport exemption, and a generic child-dispatch proof gap. [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/deep-research-strategy.md:37] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-026.md:5] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-035.md:108] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-036.md:78]
2. Verified the Open Design run path. `start_run` / `od run start` fires turn 1, spawns an inner agent, returns a discovery form with zero files, and the design is built only after a form answer or follow-up message. [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:52] [SOURCE: .opencode/skills/mcp-open-design/references/od_cli_reference.md:183] [SOURCE: .opencode/skills/mcp-open-design/references/od_cli_reference.md:184]
3. Verified the existing mandatory pairing language. The checked-in skill already says `sk-design` must shape the brief and every discovery-form answer, but that requirement is prose rather than a machine-checkable payload schema. [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:21] [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:230]
4. Checked the `sk-design` proof primitives. They require a context manifest, context-loaded card, and proof-of-application card, but do not currently bind the exact Open Design brief or form answer payload. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:46] [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:71] [SOURCE: .opencode/skills/sk-design/shared/assets/context_loaded_card.md:45] [SOURCE: .opencode/skills/sk-design/shared/assets/proof_of_application_card.md:15] [SOURCE: .opencode/skills/sk-design/shared/assets/proof_of_application_card.md:68]

## Findings

### Finding 1: `start_run --agent` creates a child-context boundary, so parent-local `sk-design` loading is not enough

Severity: P1. ENFORCEABLE-vs-ADVISORY label: ENFORCEABLE for payload presence, schema, hashes, and transcript replay; ADVISORY for proving the inner model's private reasoning or taste quality.

The current mcp-open-design contract already says the parent must load `sk-design`, run ground -> token-system -> critique, and shape both the brief and discovery-form answers with that judgment. [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:21] The run mechanics then cross a hard context boundary: `od run start --project <id> --message "<brief>" --agent ...` spawns an inner agent, returns a discovery question-form, and ends with zero files until the form is answered. [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:233] [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:234] [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:235] [SOURCE: .opencode/skills/mcp-open-design/references/od_cli_reference.md:183]

No checked source states that the inner `claude` / `codex` / `gemini` / `opencode` agent inherits the parent agent's loaded `sk-design` files. The only guaranteed carriers visible in the documented interface are the `start_run` prompt/message, optional inputs, agent/model fields, and the later form answer. [SOURCE: .opencode/skills/mcp-open-design/references/od_cli_reference.md:183] [SOURCE: .opencode/skills/mcp-open-design/references/od_cli_reference.md:184] So the precondition cannot stop at "parent loaded sk-design"; it must require a compiled payload that the inner agent actually receives.

Buildable recommendation: add a `compiledOpenDesignBrief` object to guarded `start_run` / `od run start` calls and make it the thing hashed by `skDesignGate`:

```json
{
  "openDesignPurpose": {"class": "design_authorized", "use": "generation"},
  "skDesignGate": {
    "version": 1,
    "surface": "string",
    "taskType": "generation",
    "workflowModes": ["interface", "foundations"],
    "briefDigest": "sha256:...",
    "expiresAt": "ISO-8601"
  },
  "compiledOpenDesignBrief": {
    "subject": "string",
    "audience": "string",
    "job": "string",
    "register": "Brand|Product",
    "dials": {"variance": 0, "motion": 0, "density": 0},
    "resolvedSystem": {"name": "string", "sourceDigest": "sha256:..."},
    "reusePlan": ["tokens/components to preserve"],
    "tokenSystem": ["locked semantic tokens or values"],
    "layoutDirection": "brief-specific direction",
    "motionBudget": "bounded motion rule",
    "antiDefaultCritique": ["defaults rejected and why"],
    "mustKeep": ["constraints, copy, nav, legal, fields"],
    "proofSources": [{"path": "...", "sha256": "..."}]
  },
  "innerRun": {"project": "id", "agent": "opencode", "model": "explicit"}
}
```

Fixture rule: a design generation `start_run` without `compiledOpenDesignBrief`, or with a `briefDigest` that does not match the outgoing message, fails before the Open Design daemon receives it. The advisory remainder is whether the generated design is good after the authorized path runs.

### Finding 2: The discovery-form answer is the actual build trigger and needs the same compiled-judgment contract

Severity: P1. ENFORCEABLE-vs-ADVISORY label: ENFORCEABLE for captured `od ui respond` / follow-up-message payloads; ADVISORY for evaluating the final visual judgment.

The second turn is not clerical. The docs say answering the form fires the build run that writes files and gives the project an `entryFile` plus `previewUrl`. [SOURCE: .opencode/skills/mcp-open-design/references/tool_surface.md:52] The CLI reference allows both `od ui respond --value | --value-json | --skip` and an inline follow-up `od run start --conversation <conversationId> --message "<form answers>"`. [SOURCE: .opencode/skills/mcp-open-design/references/od_cli_reference.md:184] The skill example also allows "use the recommended defaults" or `--skip`. [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:237] [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:238] [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:239] [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:240]

That is a context-loss path even when turn 1 was good. A generic "use recommended defaults" answer can cause the inner generation agent's defaults, not `sk-design`'s register/dials/token critique, to decide fidelity, data, behaviour, and visual assumptions. The manual playbook already treats the answer turn as the build trigger and lists both the GenUI path and the follow-up-message path. [SOURCE: .opencode/skills/mcp-open-design/manual_testing_playbook/03--gated-runs/gated-verb-confirm.md:52] [SOURCE: .opencode/skills/mcp-open-design/manual_testing_playbook/03--gated-runs/gated-verb-confirm.md:53]

Buildable recommendation: extend the Open Design precondition policy to guard `od ui respond`, `od ui prefill`, and follow-up `od run start --conversation` when `openDesignPurpose.class == "design_authorized"`. Require `compiledFormAnswers`:

```json
{
  "compiledFormAnswers": {
    "runId": "string",
    "conversationId": "string",
    "answers": [
      {
        "questionId": "string",
        "questionTextDigest": "sha256:...",
        "answer": "string or structured answer",
        "derivedFrom": ["register", "dials", "tokenSystem", "antiDefaultCritique"],
        "acceptedDefault": false,
        "defaultJustification": null
      }
    ],
    "formAnswersDigest": "sha256:..."
  }
}
```

Policy rule: raw `--skip` or a generic "use recommended defaults" is denied for design-generation runs unless the parent emits a per-question `acceptedDefault:true` entry explaining why the default matches the `sk-design` register, dials, and proof sources. This is deterministically checkable on captured command/tool input. It cannot by itself prove the inner model applied the content perfectly.

### Finding 3: Existing proof cards prove context shape, not exact Open Design payload lineage

Severity: P1. ENFORCEABLE-vs-ADVISORY label: ENFORCEABLE for hash binding and proof-card parsing; ADVISORY for open-ended aesthetic outcome.

The `sk-design` shared contract is already close to the needed mechanism. It requires a context manifest before dispatching an agent or making design/build decisions. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:46] It requires exact proof fields in parent sessions, delegated prompts, child responses, and final proof cards. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:71] The proof card says it proves loaded context changed the output, and `proof_check.py` gates proof-field completeness plus READY status. [SOURCE: .opencode/skills/sk-design/shared/assets/proof_of_application_card.md:15] [SOURCE: .opencode/skills/sk-design/shared/assets/proof_of_application_card.md:68]

The missing field is not another checkbox. It is payload lineage. A `Context Loaded` card can say register/dials and required files were loaded, but without a digest of the exact `--message` and form answer object, a later checker cannot know whether the Open Design inner agent received those decisions. Iteration 35's `skDesignGate` sketch already carries loaded-file hashes, workflow modes, expiry, and proof digest; D4-A8 needs to add the Open Design payload digests to that token. [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-035.md:108] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-035.md:119] [SOURCE: .opencode/specs/design/008-sk-design-parent/044-design-routing-and-integration-research/research/iterations/iteration-035.md:121]

Buildable recommendation: extend `skDesignGate` with Open Design lineage fields:

```json
{
  "openDesignLineage": {
    "toolName": "start_run | od.run.start | od.ui.respond | od.run.followup",
    "projectId": "string",
    "conversationId": "string|null",
    "runId": "string|null",
    "innerAgent": "claude|codex|gemini|opencode",
    "innerModel": "string",
    "briefDigest": "sha256:...",
    "formAnswersDigest": "sha256:...",
    "compiledPayloadSchema": "compiled-open-design-brief/v1"
  }
}
```

The guarded MCP proxy or PreToolUse branch recomputes the digest from the actual outgoing tool input/CLI command and denies if it does not match the token. The final proof-of-application card can then cite the same run/conversation/payload digests, making "loaded" and "applied" traceable across the Open Design inner-generation boundary.

### Finding 4: Inner-agent model selection is part of the payload proof, not an incidental flag

Severity: P2. ENFORCEABLE-vs-ADVISORY label: ENFORCEABLE for explicit agent/model fields and start-event verification; ADVISORY for the model's resulting taste quality.

The run docs warn that `opencode` works as an inner agent but needs an explicit `--model`, otherwise the run uses opencode's default and the start event shows `"model":null`. [SOURCE: .opencode/skills/mcp-open-design/SKILL.md:243] The manual run playbook repeats the same risk and tells the operator to pin the model and verify the actual model in the start event. [SOURCE: .opencode/skills/mcp-open-design/manual_testing_playbook/03--gated-runs/gated-verb-confirm.md:52]

That is not only operational hygiene. If D4-A8's purpose is to survive a second model boundary, the token must bind which inner agent/model received the compiled brief. The `sk-design` contract already has a Dispatch Profile hard gate for small-model delegation. [SOURCE: .opencode/skills/sk-design/shared/context_loading_contract.md:147] Open Design's inner agent should be treated the same way when a design run is delegated to it.

Buildable recommendation: require `innerAgent` and `innerModel` inside `compiledOpenDesignBrief.innerRun` and inside `skDesignGate.openDesignLineage`. For `agent=opencode`, deny design generation when model is missing unless the policy explicitly allows the local default and records the default model digest or id from a verified start event. After `start_run`, replay fixtures should read the run start event and fail if it disagrees with the token's `innerAgent`/`innerModel`.

## Questions Answered

- Q3/D4: A deny-by-default Open Design gate must validate more than `skDesignGate` presence. It must require the `sk-design` judgment to be serialized into the exact `start_run` brief and discovery-form answer payloads, then bind those payloads by digest to the token.
- Q4/D5: The Open Design inner generator is a nested child boundary. Parent-local loaded context does not prove the child saw it; the child only gets the compiled brief, inputs, and form answers that the parent sends.
- Q5/all: ENFORCEABLE items are payload schema, digest binding, expiry, explicit agent/model fields, transcript replay, and denial of raw defaults for design runs. ADVISORY items are the inner model's private reasoning and the final design's aesthetic quality.

## Questions Remaining

- Should `compiledOpenDesignBrief` be minted by a `sk-design` proof-card parser, by a dedicated `openDesignGate mint` helper, or by the guarded MCP proxy itself?
- What exact MCP `start_run` input schema is exposed by the live server for `inputs`, `agent`, and `model`? The local docs name the conceptual fields, but final implementation still needs live `tools/list` schema capture.
- Can raw `--skip` ever be allowed for a design-generation form, or should it always require per-question compiled default acceptance?
- How should compiled payload records avoid caching Open Design source content while still carrying enough digest material to prove lineage?

## Next Focus

D4-A9 should follow the same payload-boundary idea into sub-agent/Task delegation laundering: the proof token must travel in the dispatch payload and re-validate at the child tool boundary before the child can call Open Design.
