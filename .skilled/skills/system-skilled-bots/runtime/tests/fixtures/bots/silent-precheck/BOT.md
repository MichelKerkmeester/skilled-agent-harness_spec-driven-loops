---
id: silent-precheck
trigger: {kind: manual}
runtime: {kind: cli-codex}
isolation: shared
precheck: "echo '[SILENT] nothing changed'"
---
Never dispatched: the precheck has nothing to report.
