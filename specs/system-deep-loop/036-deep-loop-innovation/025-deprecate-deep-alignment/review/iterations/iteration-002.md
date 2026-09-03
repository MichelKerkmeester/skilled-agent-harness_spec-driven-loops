---
title: "Deep Review Iteration 002 — Security (Reduced Scope)"
trigger_phrases: []
---
# Deep Review Iteration 002 — Security (Reduced Scope)

## Dimension

**Security** — narrowed to two questions per focus guidance (retry after executor timeout):
- (a) Did retiring the Phase-0 dispatch-context gate (commit e41aa1878ad) remove a real safety boundary, or do the surviving guards cover what it enforced?
- (b) Executor single-dispatch routing (commit d1a5981b58c): fail-closed binary preflight and model allowlist — any path where a requested CLI executor still silently degrades to native, or where a guard can be bypassed?

Questions (c),(d),(e) from the original brief are deferred to later iterations per the focus pack.

## Files Reviewed

- `git show e41aa1878ad --stat` + `git show e41aa1878ad -- .opencode/commands/deep/review.md` (Phase-0 gate removal diff)
- `.opencode/hooks/task-dispatch/lib/dispatch-guard.cjs:120-210` (surviving `isCommandDrivenIteration` deterministic guard), `:530-580` (Check 2 wiring into dispatch path), `:142`, `:557`, `:607`
- `.opencode/commands/deep/assets/deep-review-auto.yaml:1067-1080` (`branch_on: config.executor.kind`), `:1393-1495` (if_cli_codex), `:1496-1586` (if_cli_cursor), `:1587-1677` (if_cli_devin), `:1678-1740` (if_cli_pi)
- `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1880-1960` (`buildCursorLineageCommand` — binary preflight + allowlist), `:2190-2270` (`buildLineageCommand` dispatcher + `isCursorBinaryAvailable`/`isDevinBinaryAvailable`/`isPiBinaryAvailable`), `:2510-2600` (fan-out dispatch path: recursion guard, env allowlist, write-containment)
- Orphan-reference sweep for retired gate markers (`general_agent_verified`, `dispatch_context_verified`, `DIRECT INVOCATION REQUIRED`, `PHASE 0: DISPATCH-CONTEXT`, `dispatch-context check`) across `.opencode/`, `.claude/`, `.codex/`, `.cursor/`, `.pi/`, `.devin/` — **zero matches on all surfaces**
- `deep-review-findings-registry.json`, `deep-review-config.json` (session binding: sessionId `2026-08-27T19:11:40.386Z`, generation 1, lineageMode `restart`)

## Findings by Severity

### P0 (Critical)
None.

### P1 (Major)
None.

### P2 (Minor)

#### P2-002 Phase-0 gate retirement reduced defense-in-depth (advisory)
- **File:** `.opencode/commands/deep/review.md` (diff in e41aa1878ad) — removed `PHASE 0: DISPATCH-CONTEXT CHECK`; surviving deterministic guard at `.opencode/hooks/task-dispatch/lib/dispatch-guard.cjs:142` (`isCommandDrivenIteration`) and `:557` (Check 2 wiring)
- **Claim:** Retiring the Phase-0 dispatch-context gate removed a defense-in-depth layer that intended to block the "pasted-inline" case (a worker agent re-running a command's full setup contract from pasted raw content).
- **Evidence refs:**
  - Removed gate text (from `git show e41aa1878ad -- .opencode/commands/deep/review.md`): the gate asked the model to self-classify "was this file invoked directly... or is this agent the default primary agent... as opposed to another agent pasting this file's raw content into a Task-dispatch prompt." It defaulted to PROCEED on ambiguity and hard-blocked only on "concrete evidence of the pasted-inline case."
  - Surviving deterministic guard `.opencode/hooks/task-dispatch/lib/dispatch-guard.cjs:142-170` (`isCommandDrivenIteration`): requires an `Iteration: N of M` marker to co-occur with a `Config:` path that resolves to a real on-disk deep-loop config with `mode` + `maxIterations` — "filesystem state a forger cannot produce with text alone" (comment at :127-133).
  - Check 2 wiring at `:557`: applies only to `LOOP_EXECUTOR_AGENTS` targets with a `sessionID`, warning at `WARN_AT_COUNT` and blocking at `BLOCK_AT_COUNT` when `REJECT_LOOP_ENV=1`.
- **Counterevidence sought:** (1) Is the removed gate's threat model (pasted-inline setup-contract re-run) identical to the surviving guard's threat model (loop-executor repeat hand-off)? — No, they overlap but differ: the Phase-0 gate guarded the *setup contract* entry; the deterministic guard guards *loop-iteration repeat dispatch*. (2) Could the removed gate have actually blocked the pasted-inline case? — No: it defaulted to PROCEED on ambiguity and required "concrete evidence" the model cannot observe (provenance is not visible in the prompt); the commit's architect review concluded the case "occurs in zero code paths" on codex/pi where the genuine path is byte-identical to pasted-inline.
- **Alternative explanation:** The removed layer was an ineffective, default-open prompt-level check; the surviving deterministic guard covers the concrete exploitable case (forged iteration markers without a real config artifact). The reduction is real but the removed layer added no reliable blocking.
- **Final severity:** P2 — defense-in-depth was reduced, but the removed layer was default-open and could not observe the provenance it claimed to check; the surviving deterministic guard validates on-disk state and covers the forgeable-text threat. Advisory only.
- **Confidence:** 0.82
- **Downgrade trigger:** Would downgrade to informational if a future threat model identifies a code path where a worker re-runs a deep/* setup contract from pasted content *without* an iteration marker (the surviving guard's trigger). No such path found this iteration.
- **Finding class:** defense-in-depth
- **Scope proof:** `grep` for `general_agent_verified|dispatch_context_verified|DIRECT INVOCATION REQUIRED|PHASE 0: DISPATCH-CONTEXT|dispatch-context check` across all six active surfaces returned zero matches — the gate is fully removed with no orphans; the deterministic guard at `:142` is present and wired at `:557`.
- **Affected surface hints:** ["dispatch-guard", "phase-0-gate", "deep-commands"]
- **Risk score:** 2 (advisory only)
- **Recommendation:** No code change required. Document in the deep-loop threat model that the deterministic `isCommandDrivenIteration` guard is the sole remaining protection against forged iteration-marker dispatch, and that it keys on on-disk config state (not prompt text). If a future setup-contract re-run path emerges that bypasses the iteration marker, re-introduce a deterministic (not prompt-self-classification) check.

#### P2-003 cli-codex single-executor branch does not share buildLineageCommand (pre-existing, observation-only)
- **File:** `.opencode/commands/deep/assets/deep-review-auto.yaml:1393-1495` (if_cli_codex) vs `:1496-1677` (if_cli_cursor/devin/pi)
- **Claim:** The pre-existing `if_cli_codex` branch performs its binary preflight inline (`execFileSync('/bin/sh', ['-c', 'command -v codex >/dev/null 2>&1'])` + `process.exit(1)` on absence) and constructs the codex command directly, rather than routing through the shared `buildLineageCommand` adapter that the new cursor/devin/pi branches use. This is an asymmetry: the codex single-executor path's allowlist/preflight contract is maintained separately from the fan-out codex lineage path.
- **Evidence refs:**
  - `deep-review-auto.yaml:1393-1420` — inline `command -v codex` preflight + `process.exit(1)`.
  - `deep-review-auto.yaml:1515` — `const { buildLineageCommand } = require('./.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs');` (cursor branch uses shared builder).
  - `fanout-run.cjs:2190-2196` — `buildLineageCommand` dispatches to `LINEAGE_COMMAND_ADAPTERS[lineage.kind]` (one source of truth per kind).
- **Counterevidence sought:** (1) Was this asymmetry introduced by commit d1a5981b58c? — No: the `if_cli_codex` branch predates this commit (the new branches were modeled on it). (2) Does the inline codex preflight fail closed? — Yes: `process.exit(1)` on missing binary, and the commit message notes "parity with the fan-out cli-codex lineage guard." (3) Is there a model-allowlist gap? — The codex branch does not call `buildLineageCommand`, so it does not invoke `CODEX_ALLOWED_MODELS` (if any) from the fan-out path; codex's model constraints are enforced by the codex CLI itself, not the builder. This is a contract divergence, not a bypass.
- **Alternative explanation:** The codex branch was the original single-executor template; the new branches were added with the improved shared-builder pattern. The asymmetry is a pre-existing tech-debt item, not a regression from d1a5981b58c.
- **Final severity:** P2 — pre-existing, observation-only, not introduced by the commit under review. No silent-degrade path: the codex branch fails closed on missing binary.
- **Confidence:** 0.78
- **Downgrade trigger:** Would mark out-of-scope (no finding) if the codex single-executor branch is separately tracked elsewhere. Not re-entered this iteration.
- **Finding class:** tech-debt
- **Scope proof:** `git show d1a5981b58c -- .opencode/commands/deep/assets/deep-review-auto.yaml` adds the cursor/devin/pi branches; the codex branch lines are unchanged by this commit.
- **Affected surface hints:** ["executor-routing", "cli-codex", "single-dispatch"]
- **Risk score:** 1 (observation only)
- **Recommendation:** Out of scope for this commit. Consider a follow-up to route `if_cli_codex` through `buildLineageCommand` so all single-executor CLI branches share one preflight/allowlist source of truth with the fan-out path.

## Traceability Checks

- **spec_code:** No spec-code traceability check applicable this iteration (security dimension; no spec requirements assert safety-boundary invariants for the retired gate or executor routing). The surviving deterministic guard's behavior is documented in its own inline comments (`dispatch-guard.cjs:127-170`) and the commit message of e41aa1878ad.
- **checklist_evidence:** The commit messages of e41aa1878ad and d1a5981b58c cite verification (render + check-contract-drift 24/24; validate --strict 0/0; node:test 767/17 == baseline; targeted auto-YAML vitest 71/71). Not re-run this iteration (observation-only review; no code modification).
- **skill_agent / agent_cross_runtime / feature_catalog_code / playbook_capability:** Not assessed this iteration (deferred per reduced-scope focus).

## SCOPE VIOLATIONS

None. All writes confined to the three allowed state-file paths. No reviewed source/config file was modified.

## Verdict

No P0 or P1 findings this iteration. Two P2 advisories (P2-002 defense-in-depth reduction from Phase-0 gate retirement; P2-003 pre-existing cli-codex branch asymmetry). P2-only → PASS with advisories.

The two security questions are answered:
- (a) Retiring the Phase-0 gate removed a defense-in-depth layer, but the removed layer was a default-open prompt-level self-classification that could not observe the provenance it claimed to check; the surviving deterministic `isCommandDrivenIteration` guard validates on-disk config state and covers the forgeable-text threat. No real safety boundary was lost — only an ineffective one.
- (b) The new if_cli_cursor/devin/pi branches fail closed on missing binary (`buildLineageCommand` throws → uncaught in the heredoc → non-zero exit) and on off-allowlist models. No silent-degrade-to-native path exists for the new branches. No guard bypass found. The pre-existing codex branch asymmetry is observation-only.

Review verdict: PASS

## Next Dimension

**Traceability** (iteration 3) — core (spec_code, checklist_evidence) and overlay (skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability) protocols against the seven commits, per the strategy's remaining-dimensions list.
