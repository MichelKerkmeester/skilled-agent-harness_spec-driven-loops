# Iteration 6: Plugin Hook Feasibility

## Focus
KQ5 sub-agent-enforcement plugin feasibility.

## Findings
- OpenCode auto-loads plugin files from `.opencode/plugins/`, each with a default export [SOURCE: .opencode/plugins/README.md:24-36].
- Existing plugins use `experimental.chat.system.transform` and `experimental.chat.messages.transform` to inject system/message context [SOURCE: .opencode/plugins/mk-code-graph.js:442-518].
- The plugin evidence shows prompt/context transformation hooks, not a documented Task-dispatch identity hook; therefore a plugin can enforce prompt contracts but not prove hard runtime identity [SOURCE: .opencode/plugins/README.md:44-50].

## Sources Consulted
Plugin README and code graph plugin.

## Assessment
newInfoRatio: 0.70. Feasible scope is now bounded to guardrail/injection/diagnostic behavior.

## Reflection
Ruled out claiming a plugin equals FIX-5 or host hard identity.

## Recommended Next Focus
Define benchmark metrics around existing route-proof fields.
