# Iteration 15: Sub-Agent Enforcement Plugin Boundaries

## Focus
KQ5 plugin scope.

## Findings
- Plugins can inject system context per session and message transforms per prompt [SOURCE: .opencode/plugins/mk-code-graph.js:442-518].
- `mk-spec-memory` demonstrates session event handling and system-transform injection [SOURCE: .opencode/plugins/mk-spec-memory.js:416-437].
- Enforcement plugin should be a new small plugin because system-skill-advisor owns recommendation, not dispatch enforcement [SOURCE: .opencode/plugins/README.md:44-50].

## Sources Consulted
Plugin entrypoints.

## Assessment
newInfoRatio: 0.34. The plugin is useful as a route-contract injector/auditor, not a replacement for route-proof validation.

## Reflection
Avoid overloading skill advisor with runtime enforcement.

## Recommended Next Focus
Inspect setup gate friction.
