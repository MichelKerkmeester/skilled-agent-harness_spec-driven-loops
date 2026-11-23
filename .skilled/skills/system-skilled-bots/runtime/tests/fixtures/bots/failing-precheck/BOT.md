---
id: failing-precheck
trigger: {kind: manual}
runtime: {kind: cli-codex}
isolation: shared
precheck: "exit 3"
---
Never dispatched: the precheck fails.
