# Goal — Routing Coverage, Activation & Verification (packet 015)

> The large, standing goal for this phase. Broad by design: it drives the autonomous build from the P0 activation foundation through the staged default-on cutover, verified through automated tests + benchmarks + manual-testing playbooks. Companion: `handover.md` (detailed resume state), `spec.md` (parent phase map), `001-research/{synthesis,verification,review}-v1.md` (the verified evidence base).

## 1. The destination

Make the shipped-but-inert compiled skill-router **perfectly integrated, enabled by default, and verified** — where "enabled by default" is the phased **P4 outcome** 012 settled, not a premature flip. When done:
- Turning on `SPECKIT_COMPILED_ROUTING` (and eventually leaving it unset) makes the compiled decision actually **reach an agent** and be consumed — today it does not.
- Every routing decision stays **byte-identical to legacy** (this program never changes what routes; it changes what is *served*, *observed*, and *documented*).
- Coverage is real: the router is **documented** (feature catalogs), **benchmarked** (a compiled Lane C parity gate), **manually testable** (playbook scenarios with GPT-5.6 LUNA HIGH as the routed subject), and its results are **durably archived** outside the spec tree.
- All routing code is aligned to `sk-code:code-opencode` (the machine-readable router `RESOURCE_MAP`), and every authored MD uses the correct `sk-doc` mode template.
- Every step is **byte-exact reversible** and the three frozen benchmark scorer files are **never edited**.

## 2. What the research changed (read this before building)

A 25-iteration deep-research pass (`001-research/`, 143 findings → 47 consolidated, Sonnet-verified: all 8 spine claims CONFIRMED) proved the framing was wrong:

- **Default-on is a structural no-op end-to-end.** The advisor attaches `compiledRoute` additively (`advisor-recommend.ts:371`), but the OpenCode plugin bridge rebuilds recommendations and **drops it** (`mk-skill-advisor-bridge.mjs:539-551`, 0 grep hits) — and the CLI `subprocess.ts` interface has no such field. The decision is destroyed before any agent sees it.
- **The flag can't even reach the daemon** — stripped from BOTH `CHILD_ENV_ALLOWLIST` sets (launcher `:99`, bridge `:58`).
- **The runtime reads its resolver/activation/engines from inside the mutable spec tree and fails silent fleet-wide** — ADR-003 promotion is a hard prerequisite and must move the whole *closure*.
- **`HUB_CHILD` is a runtime engine-dispatch table, not a removable duplicate allowlist** — ADR-002 must split eligibility from engine-discovery first.
- **No per-hub serving-status observability; the flag is bi-state; all 7 manifests are already `servingAuthority: compiled`** — so the P4 flip must be per-hub cohort-staged, never a fleet-wide `unset=on`.

**Therefore the load-bearing work is a P0 activation FOUNDATION; the four named coverage gaps are a downstream P3 join gate**, not parallel busywork.

## 3. The plan (children 002-011 under this packet)

Ordered by the P0→P4 safety dependency graph (`001-research/synthesis-v1.md` §5). Everything consumes the P0 foundation (002).

| Phase | Child | What it delivers |
|-------|-------|------------------|
| P0 | 002-runtime-promotion-and-status-foundation | Promote the resolver/engine/activation/bundle closure out of the spec tree; split eligibility vs the `HUB_CHILD` engine table + cross-check; ship `compiled-route-status.cjs --all` + wire advisor_status/session_bootstrap; ENV-REFERENCE flag entry; tri-state flag; stderr breadcrumbs; no-spec-import CI rule |
| P1 | 003-flag-propagation-and-effective-consumption | Un-strip the flag (both allowlists); un-drop `compiledRoute` through the bridge + CLI interface + hook; cache invalidation; e2e tests |
| P1 | 004-benchmark-compiled-lane-c | `compiled-routing-parity.cjs` sibling; shape bridge; verdict sub-state in the **non-frozen** orchestrator; flag-state matrix; render-from-JSON |
| P2 | 005-playbooks-and-luna-acceptance | 7-hub serving-authority scenario matrix + evidence contract + validators; two-plane LUNA-HIGH acceptance (timeout=SKIP, gold holdouts) |
| P3 | 006-feature-catalogs | 7 hub-root catalogs (or advisor-central) + routing leaf; feature-flag-governance + advisor-recommend extension; phase-gated wording |
| P2 | 007-durable-archiving-and-serving-snapshot | `<hub>/benchmark/compiled-routing/<run-label>/` convention; `serving-snapshot.json` + renderer; portable provenance; append-only `flip-history.jsonl` |
| P3 | 008-sk-code-alignment-and-drift-guards | Make the RESOURCE_MAP gate real; `qualifiedIdToLeaf` bijection tests; `run-all-drift-guards.sh`; owns the single alignment authority |
| P3 | 009-sk-doc-template-alignment | Test-type taxonomy 2→12; topology quote-tolerance; catalog trigger-phrase fix; strict package validator; both create-skill parent templates into the P4 lockstep |
| P1 | 010-rollback-audit-and-non-hub-policy | `activate-hub.cjs --rollback`; `serving-prior` refresh; fence direction; append-only audit; non-hub ineligibility policy; named canary |
| P4 | 011-activation-cutover-p4 | Staged hub-by-hub tri-state flip + lockstep directives/templates/catalog wording; the P3 coverage-closure join gate; `=0` kill-switch drill; stop-on-first-failure |

## 4. Standing invariants (every step, no exceptions)

1. Compiled == legacy on all routing fields — never change a routing decision.
2. The three frozen scorer files (`router-replay.cjs`, `score-skill-benchmark.cjs`, `load-playbook-scenarios.cjs`) are SHA-256-pinned and NEVER edited. Verdict/exit logic goes in non-frozen orchestrators.
3. Every step names a byte-exact-manifest or flag-based rollback; `=0` is the documented fleet-wide kill-switch.
4. No runtime path reads under `.opencode/specs`.
5. Build behind the still-off flag; the repo default does not flip until P0-P3 are green per-hub (P4).

## 5. Verification (definition of done)

Per child: `validate.sh --strict` Errors:0. Program: automated tests (unit + e2e bridge/plugin + truth-tables + bijection Vitests) + `verify_alignment_drift.py --root .opencode` (markdown gate live) + the compiled Lane C parity run (compiled==legacy, distinct verdict sub-states) + LUNA-HIGH playbook runs (gold-bearing holdouts) + durable archived evidence under `<hub>/benchmark/compiled-routing/`. Frozen-scorer SHA-256 unchanged before/after every step.

## 6. Workspace & guardrails

Work ONLY in the worktree `.worktrees/0089-sk-doc-default-routing-cutover` (branch `sk-doc/0089-default-routing-cutover`); commit there; merge to v4 is operator-gated. Gate-3 is answered (Option D: children under this 015 packet). Author MDs via the correct `sk-doc` mode; never embed ephemeral artifact ids in code comments.

## 7. Current state → next action

- **DONE (build complete).** 25-iter research + synthesis + verification + review; the 015 parent + 001-research; and ALL ten implementation children 002-011 authored, implemented, and committed on this worktree — each behind the still-OFF flag, routing byte-identical to legacy, the three frozen scorer files SHA-256 unchanged, `validate.sh --strict` Errors:0. Commit range `a179c8d5e9..3d08302771` (002 `4153cbebd8`; 003+008+010 `a1cdb65d90`; 004+006+009 `8532c4b64b`; 007 `2a39ecb9a0`; 005 `d590af12be`; 011 `3d08302771`).
- **HONESTLY NOT DONE (by design).** The real staged default-flip. 011's P4 controller is built and dry-run-proven, but its P3 coverage-closure join gate reports **all 7 hubs BLOCKED** — gated on the create-skill readiness fixture + siblings 013/014, which remain genuinely Planned. The repo default stays OFF; flipping it is an operator decision after 013/014 land and the join gate goes green per hub.
- **NEXT (operator-gated).** (1) Merge this worktree branch to v4. (2) Implement 013/014 (create-skill onboarding + benchmark alignment) to clear the join gate. (3) Run the full 7-hub × {routing, holdout} LUNA-HIGH sweep (the 3-scenario sample already proves the mechanism). (4) Then the per-hub cohort-staged flip via 011's controller, with `=0` as the fleet-wide kill-switch.
- See `handover.md` for the exact per-child status and resume ladder.
