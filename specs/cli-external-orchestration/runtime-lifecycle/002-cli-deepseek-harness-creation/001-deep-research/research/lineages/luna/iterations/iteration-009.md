# Iteration 9 — Angle 9: deep-loop fan-out executor fitness

**Timestamp:** 2026-11-05T22:48:29Z  
**Focus:** Headless command construction, state and environment isolation, recursion, confinement, exit handling, and the cross-repository executor inventory.

## Findings

1. **The fan-out adapter should use a DSH-native headless command, not Pi flags.** A plausible dispatch is `dsh --profile headless --patch <repo-local-overlay> --json --permission-mode workspace-write --approval-policy never -`, with the task delivered on stdin and the child working directory set to that lineage's artifact directory. DSH documents `-` as the stdin task marker and supports `--json`, `--permission-mode`, `--approval-policy`, and repeatable `--add-dir`; the DSH CLI's top-level profile/patch options must precede app arguments. Its `workspace-write` process sandbox is a potential preventive boundary, but a lineage cwd, tool writes, and subprocess writes all need a harmless effect test before marking the executor as confined. The existing post-dispatch containment scan should remain a second boundary. [SOURCES: dsh-src/packages/bundle/headless/src/startup.ts:53-74; dsh-src/packages/bundle/headless/README.md:87-100,128-136; dsh-src/packages/sandbox/README.md:10-32; dsh-src/apps/cli/reference/README.md:28-34; fanout-run.cjs:3579-3585,4038-4057]

2. **Timeouts are supervisor-owned, while DSH's process status is a usable success signal.** The headless parser has no per-call timeout flag, so `timeoutSeconds` must be applied by the shared runner, which already closes unused stdin and supervises the child. DSH exits 0 only for a completed final turn and 1 for aborted/error/no-final-turn outcomes; under `--json`, also require a `final` record with a successful reason rather than treating any parseable output as task success. This differs from Pi's explicitly documented nondeterministic exit status, so DSH should use the normal nonzero-is-failure rule. [SOURCES: iteration-001.md:17-20; dsh-src/packages/bundle/headless/README.md:104,134-136; fanout-run.cjs:1815-1829,2104-2118,4043-4049]

3. **Lineage isolation needs both a real DSH home and a credential plan.** The fan-out runner allocates `{lineageDir}/.executor-state` and sets a per-kind `SPECKIT_*_STATE_DIR`, but those markers are detection hints unless a native home override is also set. DSH's `$DSH_HOME` owns profiles and persistent Sessions, and the new executor env allowlist must explicitly admit `DSH_HOME` plus only the provider credential variables approved for the two routes. A unique `--session-id` per lineage/run can separate session history; a fresh per-lineage `$DSH_HOME` avoids shared profile/session state but will not contain credentials unless they are inherited through the approved env or deliberately provisioned. Do not broadly pass `DSH_*` or all parent secrets. [SOURCES: fanout-run.cjs:504-513,3579-3585,3648-3675; executor-audit.ts:93-120,129-180,994-1010; dsh-src/apps/cli/README.md:11,38-47; iteration-003.md:17-24]

4. **Keep DSH inside the normal recursion guard and fail-closed adapter path.** The shared audit layer blocks nested same-runtime dispatch by checking executor presence/ancestry, and only Pi is exempt because it cannot delegate in-process; DSH should not receive that exemption. The builder needs a binary-availability check, a closed supported-model/provider mapping, explicit erroring for unsupported reasoning or sandbox fields, and no fallback to native on failure. DSH's native sandbox is documented as subprocess file-effect confinement, not a host/container boundary; expose it as preventive only after testing the native file, shell, and MCP tools under `workspace-write` and `read-only`. [SOURCES: executor-audit.ts:93-127,151-224,965-1010; executor-config.ts:11-15,68-82,93-148; dsh-src/packages/sandbox/README.md:10-32; dsh-src/packages/bundle/headless/README.md:92-100,132]

5. **The executor change spans several explicit consumers; update the source of each registry and its generated/test mirrors.** The following inventory is grounded in current literal executor lists and existing per-runtime tests; entries marked “new” are proposed DSH-specific counterparts.

| File | Required DSH change | Current evidence |
|---|---|---|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Add `cli-dsh` to kind/schema/support matrices; model, reasoning, web/MCP, state-home, and preventive-sandbox contracts. | `:11-15,68-148,151-224` |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Add executable/session/home env contracts and allowed DSH variables; preserve recursion checks without Pi's self-presence exemption; include DSH in provenance. | `:70-127,129-224,994-1032` |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Add `dsh` probe and command adapter; pass JSON/stdin, patch, permissions, lineage cwd/session, timeout, state/home env; verify exit/final event and retain containment. | `:504-513,1815-1829,2104-2118,2278-2320,3579-3689,4038-4057` |
| `.skilled/commands/deep/assets/deep-research-auto.yaml` | Route single-executor DSH iterations through the shared builder and audited receipts; document fail-closed behavior. | `:1573-1588` |
| `.skilled/commands/deep/assets/deep-review-auto.yaml` | Add the same shared-builder branch and review output contract. | `:2041-2053` |
| `.skilled/commands/deep/assets/deep-ai-council-auto.yaml` | Decide whether DSH is a supported council seat; if yes, add it to the closed CLI enum and describe one DSH seat per round. | `:24-28` |
| `.skilled/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs` | If accepted as a council seat, extend kind validation, shared-builder reuse, and effective executable mapping. | `:193-202,266-275,375-384` |
| `.skilled/skills/system-deep-loop/deep-ai-council/scripts/tests/orchestrate-session-cli.vitest.ts` | Cover DSH seat parsing, command builder arguments, and fail-closed behavior. | Existing CLI orchestrator test path; confirm its current adjacent cases in implementation. |
| `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` | Classify `dsh --profile headless` task dispatches and map the binary to `cli-dsh`; do not classify profile-management commands as tasks. | `:41-66,70-99` |
| `.skilled/hooks/dispatch/lib/dispatch-audit.test.mjs` | Add direct, quoted, env-wrapped, and shell-wrapped DSH task-shape cases. | `:349-390,413-417` |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | Verify a DSH invocation binds to the DSH packet and applies executor rules. | Existing dispatch-rule suite; extend only if it owns executor identity assertions. |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts` | Test accepted DSH fields, route/model allowlist, reasoning mapping, and unsupported fields. | Existing per-kind schema tests. |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-audit.vitest.ts` | Test DSH environment filtering, recursion refusal, and provenance. | Existing per-kind audit tests. |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Test exact argv/stdin/cwd/env, missing binary/model, timeout, JSON final reason, confinement, and nonzero failure. | Existing per-kind builder tests, including Pi at `:2098-2123`. |
| `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/matrix-manifest.ts` | Add `cli-dsh` to subjects and phase-two adapter coverage. | `:5-16,45-69` |
| `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fixtures/adapter-fixture.ts` | Add DSH binary, shim, model, and mode lookup. | `:21-57` |
| `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fixtures/adapter-suite.ts` | Register the DSH shim suite and common edge rows. | Current suite is part of the fan-out fixture family. |
| `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/shims/adapter-shim-core.cjs` | Add DSH flag/input validation and captured JSON/exit behavior if common parsing cannot express it. | Existing shared shim core. |
| `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/shims/dsh-shim.cjs` (new) | Simulate task completion, error, denial, timeout, stdin closure, and lineage-only writes. | New DSH adapter shim counterpart to `pi-shim.cjs` and `hermes-shim.cjs`. |
| `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/cli-dsh.vitest.ts` (new) | Cover DSH against timeout, stdin, write containment, environment, and self-invocation matrix cases. | New per-runtime stress file alongside `cli-pi.vitest.ts` and `cli-hermes.vitest.ts`. |
| `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/README.md` | Add DSH test subject and live-smoke constraints. | Shared stress matrix documentation. |
| `.skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md` | List DSH as a supported shared-builder executor after implementation. | `:278-282` |
| `.skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md` | Document DSH adapter, permission and home isolation contract. | Shared fan-out feature reference. |
| `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown` | Regenerate compiled workflow contract after YAML routing changes. | Compiled research contract counterpart to source YAML. |
| `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown` | Regenerate compiled review contract. | Compiled review contract counterpart to source YAML. |
| `.skilled/commands/deep/assets/compiled/deep-ai-council.contract.markdown` | Regenerate if DSH is admitted as a council seat. | Compiled council contract counterpart to source YAML. |
| `.skilled/skills/cli-external-orchestration/leaf-manifest.json` | Register the new `cli-dsh` packet and workflow mode. | `:71-72,108-109` |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` and `runtime/scripts/skill-graph.json` | Add route keywords/graph node as needed, then rebuild the generated advisor graph for the new leaf. | Advisor scorer/graph generation and current routed leaf inventory. |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/executor-delegation-cases.json` | Add explicit natural-language `cli-dsh` selection and conflict cases. | `:84-85` |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/executor-delegation.vitest.ts` | Assert the new DSH mode scores to the external-orchestration hub. | `:181,266` |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` | Regenerate indexed triggers after adding the DSH skill/commands. | Generated runtime retrieval index. |
| `README.md` | Update the seven-bridge count, no-self-dispatch rule, and parent-hub route list. | `:71,867-871,1558` |
| `AGENTS.md` and `.skilled/commands/doctor/assets/agents-md-manifest.json` | Update the runtime agent-directory list and regenerate the doctor manifest from its canonical section. | `AGENTS.md:283`; manifest `:1029` |

## Ruled Out

- Treating `SPECKIT_DSH_STATE_DIR` by itself as a DSH home override; current runner comments define such markers as detection-only unless a native home environment variable is passed.
- Treating `--approval-policy never` as a confinement mechanism; it only prevents waiting for human approval.
- Treating DSH's nonzero exit like Pi's nondeterministic exit without new counterevidence.

## Uncertainties

- Installed `0.2.2-rc.1` behavior for `workspace-write`, `--json final.reason`, and all headless native tool writes has not been exercised against a temporary, credential-free profile.
- Whether a per-lineage `DSH_HOME` can be populated safely with environment-based credentials and the repo-local overlay needs a specific bootstrap contract.
- Whether council should admit DSH as a seat is a product decision; the current CLI enum rejects any unlisted kind.
- The full self-presence implementation uses multiple ancestry and lock signals; add DSH only after mapping the `dsh` process identity and nested shell behavior into those existing checks.

## Sources

- `dsh-src/packages/bundle/headless/src/startup.ts` and `packages/bundle/headless/README.md`
- `dsh-src/packages/sandbox/README.md`, `apps/cli/README.md`, and `apps/cli/reference/README.md`
- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`
- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`
- `.skilled/commands/deep/assets/deep-research-auto.yaml`, `deep-review-auto.yaml`, `deep-ai-council-auto.yaml`
- `.skilled/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs`
- `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` and its tests
- `.skilled/skills/system-deep-loop/runtime/tests/unit/` and `runtime/tests/stress/cli-adapter/`
- `.skilled/skills/system-skill-advisor/runtime/`, `.skilled/skills/cli-external-orchestration/leaf-manifest.json`, `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json`
- `README.md`, `AGENTS.md`, `.skilled/commands/doctor/assets/agents-md-manifest.json`
- `steer.md` — absent when checked before this iteration

## Scope Violations

- None added in this iteration. The iteration-8 gateway run-directory conflict and its recovery are recorded in iteration 8; this iteration's outputs remain inside the Luna lineage.

**Next Focus:** Angle 10: implementation constraints, unresolved differences, source/version boundaries, and the dependency-ordered phase plan.
