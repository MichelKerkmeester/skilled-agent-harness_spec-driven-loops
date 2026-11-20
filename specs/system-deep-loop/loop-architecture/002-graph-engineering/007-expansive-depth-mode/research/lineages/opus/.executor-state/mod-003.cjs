const R = '.skilled/skills/system-deep-loop/runtime/';
const f = (label, sources) => ({ label, sources });
module.exports = {
  iteration: 3,
  newInfoRatio: 0.71,
  noveltyJustification: '5 of 7 findings are new mappings; Inspect eval_set rerun and the OpenHands detector were cited last run and are partly repeated (0.5 each).',
  keyNodes: ['F-1-005'],
  answeredNodes: ['F-1-005'],
  ruledOut: ['AutoGen text-mention termination as a model', 'Inspect working_time as a duration signal', 'Agent SDK PostToolUse hook written into the operator config dir'],
  focusTrack: 'prior-art',
  toolsUsed: ['WebSearch', 'Read', 'Write'],
  sourcesQueried: ['https://inspect.aisi.org.uk/reference/inspect_ai.event.html', 'https://inspect.aisi.org.uk/eval-sets.html', 'https://inspect.aisi.org.uk/extensions-model-api.html', 'https://docs.openhands.dev/sdk/guides/agent-stuck-detector', 'https://github.com/OpenHands/software-agent-sdk/issues/762', 'https://docs.langchain.com/oss/python/langgraph/durable-execution', 'https://code.claude.com/docs/en/headless', 'https://microsoft.github.io/autogen/0.4.7/user-guide/agentchat-user-guide/tutorial/termination.html', R + 'scripts/fanout-salvage.cjs:41'],
  findings: [
    f('Inspect records ModelEvent and ToolEvent with completed time from the harness, not the model; fit: a normalized per-lineage tool_event stream beside fanout-lineage.out for every CLI (H/M/L).', ['https://inspect.aisi.org.uk/reference/inspect_ai.event.html', 'https://inspect.aisi.org.uk/eval-logs.html']),
    f('Claude Code headless stream-json ends in a result message with cost and session metadata and emits tool events with --verbose; cost may be cumulative per session so take the last result. Fit: cli-claude-code to --output-format stream-json --verbose with salvage reading the last result (H/S-M/M).', ['https://code.claude.com/docs/en/headless', 'https://pivanov.github.io/claude-wire/protocol/output-events.html', 'https://claudeissues.com/issue/83239-docs-total-cost-usd-is-cumulative-per-session-under-output-format-stream-json-bu', R + 'scripts/fanout-salvage.cjs']),
    f('OpenHands detects stuck loops from observed action-observation repeats (4+, alternating 6+) with configurable thresholds and a known false positive on intentional polling; fit: an event-shape repetition flag feeding unexamined, configurable, never a hard stop (M/S/M).', ['https://docs.openhands.dev/sdk/guides/agent-stuck-detector', 'https://github.com/OpenHands/software-agent-sdk/issues/762']),
    f('LangGraph keeps successful pending writes of a failed super-step and clears a timed-out attempt writes; fit: on resume archive orphan iteration or delta files that have no gateway record (M/S/L, resume path unverified).', ['https://docs.langchain.com/oss/python/langgraph/durable-execution', 'https://docs.langchain.com/oss/python/langgraph/fault-tolerance.md']),
    f('AutoGen composes termination conditions including ExternalTermination; fit: --stop should end lineages through a stopped outcome with a rerun command rather than a bare signal kill (M/S/L).', ['https://microsoft.github.io/autogen/0.4.7/user-guide/agentchat-user-guide/tutorial/termination.html', 'https://mintlify.com/microsoft/autogen/guides/multi-agent-workflows']),
    f('Inspect ModelAPI is one adapter per provider converting messages, tools and GenerateConfig; fit: each LINEAGE_COMMAND_ADAPTERS entry returns {argv, promptChannel, effective, parseLog, classifyFailure} with one conformance test over fixture logs per kind (H/M/M).', ['https://inspect.aisi.org.uk/extensions-model-api.html', 'https://inspect.aisi.org.uk/reference/inspect_ai.model.html']),
    f('Inspect eval_set and eval-retry match the built finished-lineage skip and --only-lineage; no prior art found for swapping the provider on a retry, so --lineage-override remains this runner own gap.', ['https://inspect.aisi.org.uk/eval-sets.html', 'https://inspect.aisi.org.uk/reference/inspect_eval-retry.html']),
  ],
};
