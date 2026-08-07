# Iteration 28: Code-Vs-Test Coverage Gaps

## Focus

Determine which fixes lack local regression coverage.

## Findings

- The timeout override phase explicitly has pending RED/GREEN test tasks and full suite verification tasks. [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation/002-fanout-timeout-override/tasks.md:44] [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation/002-fanout-timeout-override/tasks.md:62] [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation/002-fanout-timeout-override/tasks.md:63]
- The runtime hygiene phase also has pending RED test, fix, and suite tasks for salvage padding. [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation/003-runtime-hygiene-fixes/tasks.md:53] [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation/003-runtime-hygiene-fixes/tasks.md:54] [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation/003-runtime-hygiene-fixes/tasks.md:65]

## Novelty

newInfoRatio: 0.34. Clear remaining test debt for live runtime bugs.
