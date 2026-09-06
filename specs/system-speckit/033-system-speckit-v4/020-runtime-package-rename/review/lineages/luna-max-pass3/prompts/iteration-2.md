Review iteration 2

Route proof: mode=review, target_agent=deep-review, executor=cli-codex model=gpt-5.6-luna, inline=true, nestedDispatch=false.

Broaden to security. Inspect the Claude process-boundary shims, their focused tests, Gate-3 realpath containment, runtime hook registrations, Devin permission policy, and the local model-server perimeter. Separate trusted explicit test/operator overrides from the normal install-anchored target path. Do not run repository tooling or nested executors.

Required angles: hook target resolution, path traversal and symlink classification, bounded stdin/stdout and child timeouts, fail-closed permission decisions, and loopback/socket isolation.
