# Design

## Schema metadata

Use Python typing metadata supported by the installed official MCP SDK so descriptions are emitted into `inputSchema` by `list_tools()`. Keep runtime function signatures thin and do not add a second hand-maintained JSON Schema registry.

Every shared override uses the same wording:

- `provider`: normally omitted; selects one of the CLI-supported providers.
- `model`: normally omitted; overrides the selected provider's default model.
- `endpoint`: normally omitted; overrides the selected provider endpoint and is required for `custom` when no configured endpoint exists.

Tool-specific wording explains behavior rather than repeating the field name.

## Typed `run.request`

Represent a System One request with typed mapping shapes:

- required `state`: any JSON value evaluated by Jev
- required `questions`: map from caller-defined answer key to a question specification
- optional `model`: request model
- question specification:
  - required `type`: `noul`, `choice`, or `score`
  - required `instructions`: the decision question
  - optional/type-specific `criteria`: choice key-to-description map or low-to-high score-level list

The runtime still receives and copies an ordinary dictionary. The typed shape exists to improve MCP discovery, not to add destructive serialization. Unknown top-level and question fields remain accepted and forwarded for forward compatibility. Existing explicit `model` override and provider-default behavior is unchanged.

## Verification boundary

Tests inspect schemas obtained from the MCP SDK client, not private Python annotations. Invocation tests call `run` through the MCP client while mocking only the provider call. This verifies what an external agent sees and sends.