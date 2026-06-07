# Deep Review — Iteration 005

**Dimension**: traceability
**Scope**: lock / executor-audit / :with-context wiring across review + improvement + benchmark + context YAMLs + speckit complete.md/plan.md
**Executor**: cli-opencode openai/gpt-5.5-fast --variant xhigh (read-only)
**Raw output**: /tmp/dr-r5.out

## Findings

- **[P1] R5-1** `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:236`
  - Issue: lock acquire/release is generic and never captures an owner id; releases at 242-251 and 1393-1396 are not owner-scoped
  - Impact: concurrent or stale-lock cleanup can release the wrong lock or fail traceability
  - Fix: use loop-lock.cjs acquire, bind owner id, and release with that owner everywhere
  - Note: VERIFY in R9 vs deep-research reference YAML — owner-threading may be a pre-existing pattern across all loops
- **[P1] R5-2** `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml:225`
  - Issue: acquire lacks on_halt/on_cancel/on_workflow_exit cleanup and owner capture; only final save release exists at 1372
  - Impact: cancel/invalid/completed branches can leave stale locks
  - Fix: add the cleanup hooks and owner-threaded release commands
- **[P1] R5-3** `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml:127`
  - Issue: lock acquire/release is generic and never captures an owner id; releases at 132-140 and 231-234 are not owner-scoped
  - Impact: owner-threading requirement is not satisfied
  - Fix: switch to owner-emitting acquire and pass owner to every release
- **[P1] R5-4** `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_confirm.yaml:140`
  - Issue: acquire lacks on_halt/on_cancel/on_workflow_exit cleanup and owner capture; only final synthesis release exists at 262
  - Impact: operator cancel or halt can leak the lock
  - Fix: add cleanup hooks plus owner-threaded releases
- **[P1] R5-5** `.opencode/commands/deep/assets/deep_start-model-benchmark-loop_auto.yaml:125`
  - Issue: lock acquire/release is generic and never captures an owner id; releases at 129-137 and 195-198 are not owner-scoped
  - Impact: shared improvement ledger lock can be released without ownership proof
  - Fix: switch to owner-emitting acquire and owner-scoped releases
- **[P1] R5-6** `.opencode/commands/deep/assets/deep_start-model-benchmark-loop_confirm.yaml:137`
  - Issue: acquire lacks on_halt/on_cancel/on_workflow_exit cleanup and owner capture; only final synthesis release exists at 228
  - Impact: cancel/halt paths can leave the shared improvement lock stale
  - Fix: add cleanup hooks plus owner-threaded releases
- **[P1] R5-7** `.opencode/commands/deep/assets/deep_start-context-loop_auto.yaml:171`
  - Issue: acquire passes --packet {spec_path}, but this file only defines spec_folder/artifact outputs and has no spec_path binding
  - Impact: lock acquisition can fail placeholder validation or use a literal unresolved packet id
  - Fix: bind spec_path explicitly or pass {spec_folder}/{state_paths.packet_dir} consistently
  - Note: CONFIRMED this session — introduced defect
- **[P1] R5-8** `.opencode/commands/deep/assets/deep_start-context-loop_confirm.yaml:162`
  - Issue: acquire passes --packet {spec_path}; confirm mode can fail the same lock acquisition path as auto
  - Impact: confirm-mode lock acquisition can fail placeholder validation
  - Fix: bind spec_path explicitly or pass {spec_folder}/{state_paths.packet_dir}
  - Note: CONFIRMED this session — introduced defect
- **[P1] R5-9** `.opencode/commands/speckit/plan.md:50`
  - Issue: auto setup config shape omits contextIntegration even though :with-context is parsed at 70/97/122 and complete.md persists it at 51
  - Impact: /speckit:plan:auto :with-context can parse the flag but fail to bind it into the YAML workflow
  - Fix: add contextIntegration/context_integration to the persisted plan config shape and parse outputs
- **[P2] R5-10** `.opencode/commands/speckit/complete.md:15`
  - Issue: first-action note lists feature flags but omits :with-context
  - Impact: setup guidance inconsistent with the documented :with-context add-on at 320 and 349-366
  - Fix: include :with-context in the feature-flag note
- **[P2] R5-11** `.opencode/commands/speckit/plan.md:15`
  - Issue: first-action note says only :with-phases is a feature flag, omitting :with-context
  - Impact: setup guidance inconsistent with the documented :with-context add-on at 316-332
  - Fix: include :with-context in the feature-flag note
