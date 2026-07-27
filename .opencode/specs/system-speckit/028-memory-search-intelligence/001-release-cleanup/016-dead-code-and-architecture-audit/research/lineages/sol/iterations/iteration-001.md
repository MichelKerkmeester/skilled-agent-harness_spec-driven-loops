# Iteration 001: Launchers and daemon serving

## Focus

Audit `bin/` entrypoints, launcher helpers, and daemon lifecycle policy for dead paths and disproportionate structure.

## Findings

1. The three live launchers and three shared supervision modules total 8,457 lines, while the package documents a lifecycle split: spec-memory supports detached daemon re-election, but code-index and skill-advisor stop with their child. This is a CAT-5/CAT-6 maintenance cluster, not dead code. [SOURCE: file:.opencode/bin/README.md:106] [SOURCE: file:.opencode/bin/README.md:114]
2. All three launcher entrypoints are configured in the root OpenCode runtime, so none is deletable as an orphan. [SOURCE: file:opencode.json:22] [SOURCE: file:opencode.json:51] [SOURCE: file:opencode.json:73]

## Sources Consulted

- `.opencode/bin/README.md:102-114`
- `opencode.json:22,51,73`
- `wc -l .opencode/bin/mk-*-launcher.cjs .opencode/bin/lib/{launcher-ipc-bridge,launcher-session-proxy,model-server-supervision}.cjs`

## Assessment

- New information ratio: 0.92
- Confidence: high for size and policy asymmetry; remediation value requires operational prioritization.

## Reflection

Entrypoint reachability was easy to prove. File size alone was not treated as a defect; the documented lifecycle divergence is the load-bearing evidence.

## Recommended Next Focus

Inspect MCP-server contract duplication and inert compatibility scaffolding.
