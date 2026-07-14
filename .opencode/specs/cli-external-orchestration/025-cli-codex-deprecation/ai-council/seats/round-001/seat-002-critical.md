---
round: 1
seat: seat-002
executor: native-review
lens: Critical
status: ok
timestamp: 2026-06-30T12:00:00.000Z
simulated: false
---

# Seat 002 — Critical / Native Review Lens

## Proposed Plan
Classify every hit before editing: active runtime behavior, active support claim, historical/archive/fixture, or ambiguous. Remove active behavior and support claims; preserve or explicitly allowlist historical material.

## Reasoning
The biggest failure modes are dangling references after hook deletion and false-positive deletion of archive/changelog/test fixtures. Active risk zones are README claims, pre-commit mirror checks, command route/assets, and skill hook/policy code.

## Risks & Trade-offs
- Dangling route risk if doctor/create/deep assets still mention deleted Codex hook paths.
- False-positive risk for `.opencode/skills/z_archive/cli-codex-retired/**`, changelogs, historical manual tests, and design fingerprint fixtures.
- Hook behavior risk if OpenCode plugin and Claude Code hook paths do not receive equivalent startup/advisor coverage after Codex deletion.

## Assumptions and Evidence Gaps
Unknown whether command manifests indirectly register Codex through generated YAML. Unknown whether tests treat Codex as legacy fixture or active support.

## Alternative Challenged
A literal `rg -i codex | delete` pass is unsafe and would erase useful audit records while still potentially missing generated registrations.

## Confidence
88/100 — strongest on risk classification, pending exact caller reads.
