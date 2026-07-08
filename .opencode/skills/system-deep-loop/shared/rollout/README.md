# Command Injection Rollout

This directory contains the isolated rollout-mode core for command injection.

- `command-injection-rollout.json` maps command names to `fallback` or `fix`.
- `resolve-injection-mode.cjs` resolves the effective mode from the environment override first, then the JSON map, then `fallback`.
- `promotion-rule.md` defines the evidence required before flipping any command to `fix`.

## Deferred TODOs

- Manifest capture: add emitter wiring later to capture fallback/fix manifests and fallback hashes from the live command-injection path.
- Comparator: add the CI comparator later after capture data exists; do not stub fake capture or synthetic comparator logic here.
