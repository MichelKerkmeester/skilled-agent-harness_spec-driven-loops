# Iteration 008

## Focus

Should the missing Pi checker invocations be restored before any route-level source-selection work is implemented?

## Actions Taken

- Re-ran `node .opencode/bin/install-codex-hooks.mjs --check`. It exited 1 because this checkout is linked; the installer identified `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public` as the primary checkout and refused to anchor global hooks here. The check did not write anything.
- Read the `runtime-mirrors` route and its YAML asset. The route manifest invokes five checks, while the asset lists seven upstream assets and seven execution steps, including `pi_agents` and `pi_prompts` (`.opencode/commands/doctor/_routes.yaml:189-201`; `.opencode/commands/doctor/assets/doctor-runtime-mirrors.yaml:33-60`).
- Read `sync-runtime-mirrors.cjs`. Its expected-link inventory covers Cursor/Devin agent and command mirrors plus four hook-discovery mirrors; it has no `.pi/agents` or `.pi/prompts` inventory (`.opencode/skills/system-spec-kit/scripts/runtime-mirrors/sync-runtime-mirrors.cjs:24-38,100-129`).
- Ran the omitted Pi checks independently. `sync-agents-pi.cjs --check` exited 1 and reported nine stale agent files; `sync-prompts-pi.cjs --check` exited 0 and reported 34 prompts in sync.
- Read both Pi checker argument parsers. They derive `REPO_ROOT` from `__dirname` and accept only an optional `--check`; neither accepts `--repo` (`.opencode/skills/system-spec-kit/scripts/pi/sync-agents-pi.cjs:10-37`; `.opencode/skills/system-spec-kit/scripts/pi/sync-prompts-pi.cjs:11-23`).
- Did not modify any investigated source, route, checker, or installer file.

## Findings

1. **The missing Pi invocations are a real route-coverage defect (P1).** `doctor-runtime-mirrors.yaml` claims that Pi agents and prompts are part of the diagnostic, but `_routes.yaml` never invokes either checker. The aggregate runtime-mirror generator cannot compensate because its inventory has no Pi tree. The route therefore cannot report the Pi agent drift observed in this checkout.

2. **The omission has a live symptom, not just a documentation mismatch (P1).** The independently run Pi agent checker found nine stale generated files, while the prompt checker passed 34 files. A `/doctor:runtime-mirrors` execution using the current route would report neither result, so its aggregate status is incomplete even though the Pi scripts and generated surfaces are present.

3. **Source selection should follow checker-inventory repair (P1).** The route declares `allowed_flags: []`, and the asset declares no inputs. The Pi generators reject `--repo` and root themselves from their module location. Passing a new route-wide selector before restoring the documented checker set would produce a partial contract: it would have to target the Codex-hook installer specially while the Pi checks remain absent and the other checkers remain fixed-root.

4. **The route validator cannot detect this class of omission.** `route-validate.py` verifies that paths already present in `script_invocations` exist (`.opencode/commands/doctor/scripts/route-validate.py:338-353`); it does not compare the route invocation set with `doctor-runtime-mirrors.yaml`'s `upstream_assets` or execution steps. Route/asset parity therefore needs an explicit validation rule or test.

5. **Recommendation: restore Pi checks first, then revisit source selection.** Add the two Pi `--check` invocations to the route and align the asset's “five” wording and output inventory with the actual seven checks. Keep the diagnostic read-only. After that, evaluate a selector narrowly for the Codex-hook comparison, or introduce a common root-selection contract across every checker before exposing a shared route flag. Do not blind-forward `--repo` to the current Pi generators.

## Questions Answered

- **Should the missing Pi checker invocations be restored before route-level source-selection work?** Yes. The asset already promises those checks, the aggregate mirror checker does not cover Pi, and the live Pi agent check currently detects nine stale files.
- **Are the Pi checkers available and suitable for immediate route wiring?** Yes for check-only invocation: both scripts exist and accept `--check`. They are not suitable for a shared `--repo` pass-through under their current CLI contracts.
- **Does the current route validator protect against the omission?** No. It checks existence of listed scripts, not parity between the route manifest and the route asset.

## Questions Remaining

- Should route/asset checker-set parity become a doctor-route validation invariant, a dedicated test, or both?
- After Pi invocations are restored, should source selection remain a Codex-hook-only option or be generalized through a common checker API?
- Should the route present the linked-worktree primary-checkout path as an explicit source-selection diagnostic before any repair command is offered?

## Next Focus

Reconcile the runtime-mirror route’s checker inventory and user-facing status contract, then reassess the smallest safe source-selection design and its handoff to the create/doctor/skill-advisor lifecycle.
