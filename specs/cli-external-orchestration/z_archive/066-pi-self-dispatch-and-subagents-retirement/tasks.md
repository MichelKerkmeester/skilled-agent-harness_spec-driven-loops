---
title: "Tasks: Let a Pi session dispatch cli-pi, and retire the pi-subagents route"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "cli-pi packet tasks"
  - "pi self dispatch tasks"
  - "executor audit exemption"
  - "pi-subagents removal tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/066-pi-self-dispatch-and-subagents-retirement"
    last_updated_at: "2026-09-08T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "All workstreams executed and verified"
    next_safe_action: "Operator runs T097 from a Pi session, or the packet closes with AC-002 unverified"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts"
      - ".opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts"
      - ".opencode/skills/cli-external-orchestration/cli-pi/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-066-pi-self-dispatch"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Let a Pi session dispatch cli-pi, and retire the pi-subagents route

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture the pre-change verification baseline before any edit (`scratch/baseline/`) — `npx vitest run tests/unit/executor-audit.vitest.ts tests/unit/fanout-run.vitest.ts` and `npm run typecheck`, pass/fail counts and the `tsc` error list saved to file [evidence: `scratch/baseline/vitest-guard-suites.txt` 156 passed / 2 files; `scratch/baseline/typecheck.txt` exit 0, no errors]
- [x] T002 Capture the full residue inventory (`scratch/baseline/`) — `grep -rn "self.invocation"` and `grep -rn "pi-subagents"` over `cli-external-orchestration/`, `hooks/dispatch/`, and `skills/README.txt`, saved so the after-state is diffable [evidence: `scratch/baseline/residue-self-invocation.txt` 319 lines, `residue-pi-subagents.txt` 53 lines]
- [x] T003 Rebuild the deep-loop runtime before trusting any green run — a stale `dist/` has silently no-opped checks in this repository [finding: no `dist/` and no build script exist for this runtime; tests import `lib/deep-loop/executor-audit.js` directly, so there is no stale-build hazard here]
- [x] T004 Confirm `.opencode` resolves to a real directory (`ls -ld .opencode`) so spec scripts do not no-op through a symlink [evidence: `ls -ld .opencode` -> `drwxr-xr-x`, not a symlink]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### WS2a — Shared runtime carve-out (do first; the only surface that can break another executor)

- [x] T010 Add the kind-keyed exemption set beside the existing per-kind maps, with a comment stating the durable reason and no artifact ids (`system-deep-loop/runtime/lib/deep-loop/executor-audit.ts`) [`SELF_PRESENCE_EXEMPT_KINDS`, beside the per-kind maps]
- [x] T011 Consult the set in the `ancestry` layer only (`executor-audit.ts:858`)
- [x] T012 Consult the set in the `lockfile` layer only (`executor-audit.ts:878`)
- [x] T013 Leave `lineage` (:838), `stack` (:850), and `env` (:867) untouched; do **not** add a `cli-pi` entry to `EXECUTOR_SESSION_ENV_BY_KIND`
- [x] T014 Test: `cli-pi` is allowed when the only signal is process ancestry (`tests/unit/executor-audit.vitest.ts`) [passing]
- [x] T015 Test: `cli-pi` is allowed when the only signal is a Pi state lockfile (`tests/unit/executor-audit.vitest.ts`) [passing]
- [x] T016 Test: the other five kinds still refuse on both layers — fails if the exemption is written kind-agnostically (`tests/unit/executor-audit.vitest.ts`) [10 parameterized cases, passing]
- [x] T017 Test: `cli-pi` still refuses on `lineage` and on `stack` (`tests/unit/executor-audit.vitest.ts`) [passing]
- [x] T018 Run the adapter stress suite unchanged and confirm test 13 stays green (`tests/stress/cli-adapter/cli-pi.vitest.ts`) [evidence: 19 passed, 1 skipped, file untouched]

### WS2b — Pi preflight hook (after WS2a)

- [x] T020 Remove the `cli-pi` deny branch (`hooks/dispatch/pi/dispatch-preflight-lint.ts:189-190`)
- [x] T021 Remove the paired block message (`dispatch-preflight-lint.ts:252-255`); a `cli-pi` dispatch then falls through to the same explicit-executor rules as any sibling
- [x] T022 Flip the `cli-pi self-recursion` case and assert every other denial case is unchanged (`hooks/dispatch/pi/dispatch-preflight-lint.test.ts`) [evidence: 33 passed; row now `false`, plus a new row asserting an unnamed cli-pi dispatch is still denied]

### WS1 — Guard prose removal (after WS2)

- [x] T030 Remove the `self-invocation-prohibited` hard rule, the `CRITICAL — SELF-INVOCATION PROHIBITED` block, the `detect_self_invocation()` guard, the "You ARE Pi already" bullet, both workflow steps, and the verification line; state which layers still bound recursion (`cli-pi/SKILL.md`)
- [x] T031 [P] Remove five guard mentions from the pitch, overview, and capability prose (`cli-pi/README.md`)
- [x] T032 [P] Remove two guard steps (`cli-pi/references/integration-patterns.md`)
- [x] T033 [P] Remove three guard cross-references (`cli-pi/references/providers-and-models.md`)
- [x] T034 [P] Remove one guard row from the runtime table (`cli-pi/references/native-skills-and-extensions.md`)
- [x] T035 [P] Remove one guard line from the verification checklist (`cli-pi/references/cli-reference.md:214`)
- [x] T036 [P] Remove the guard precondition (`cli-pi/assets/prompt-templates.md`)
- [x] T037 Remove the GUARD blockquote, precondition 5, the source-anchor row, and the EC-014 index line (`cli-pi/manual-testing-playbook/manual-testing-playbook.md`)
- [x] T038 Repoint source anchors off the removed `SKILL.md` §2 guard; **do not delete this file** and do not change its fan-out contract or frontmatter cell fields (`cli-pi/manual-testing-playbook/stress/self-invocation.md`) [**no-op**: the cell never referenced the SKILL.md guard; its only mentions are its own manifest-bound title and path. File untouched, contract unchanged]
- [x] T039 [P] Remove one guard reference (`cli-pi/manual-testing-playbook/cli-invocation/default-invocation-and-settings-merge.md`)
- [x] T040 [P] Remove one guard reference from the fixture read list (`cli-pi/manual-testing-playbook/cli-invocation/hallucination-fixture-undocumented-pi-syntax.md`)

### WS1 — pi-subagents retirement (independent of WS2; may run in parallel)

- [x] T050 Remove the activation trigger, the `AGENT_DELEGATION` router keywords, and hard rule 6 (`cli-pi/SKILL.md`)
- [x] T051 Rewrite around Pi's built-in tools; **rewrite, do not delete** — it is a declared leaf in `leaf-manifest.json` (`cli-pi/references/agent-delegation.md`)
- [x] T052 Remove fourteen mentions, keeping `pi-mcp-extension` intact (`cli-pi/references/mcp-and-third-party-packages.md`)
- [x] T053 [P] Remove two mentions (`cli-pi/references/integration-patterns.md`)
- [x] T054 [P] Remove one mention (`cli-pi/references/pi-tools.md`)
- [x] T055 [P] Remove the FAQ answer (`cli-pi/README.md`)
- [x] T056 [P] Remove the delegation template (`cli-pi/assets/prompt-templates.md`)
- [x] T057 [P] Remove three mentions (`cli-pi/manual-testing-playbook/manual-testing-playbook.md`)
- [x] T058 [P] Remove two mentions (`cli-pi/manual-testing-playbook/cli-invocation/default-invocation-and-settings-merge.md`)
- [x] T059 [P] Remove one mention (`cli-pi/manual-testing-playbook/model-dispatch/provider-settings-merge.md`)
- [x] T060 Delete the scenario for the retired package — safe because `agent-bridge/` is outside the orphan-scanned stress roots (`cli-pi/manual-testing-playbook/agent-bridge/pi-subagents-agent-parse.md`) [deleted; playbook validator reports no orphan/missing/metadata failure]
- [x] T061 [P] Correct the claim that Pi loads `pi-subagents` from its plugin packages (`.opencode/skills/README.txt:74`)

### WS3 — Hub claims (after WS1)

- [x] T070 Replace "Never let any mode dispatch itself — non-negotiable" and the four other universal statements with the carve-out, in the form already used for `cli-opencode`'s parallel-detached asymmetry (`cli-external-orchestration/SKILL.md`)
- [x] T071 [P] Correct two universal claims (`cli-external-orchestration/README.md:34`, `:91`)
- [x] T072 [P] Correct one mention of per-packet guards (`cli-external-orchestration/ROUTER.md`)
- [x] T073 Update the advisor vocabulary and the `causal_summary` (`cli-external-orchestration/graph-metadata.json:202`, `:247`, `:383`)

### WS4 — Record

- [x] T080 Write the changelog entry: what was removed, which layers still hold, and why the removal was warranted (`cli-pi/changelog/v1.5.0.0.md`)
- [x] T081 Resolve the version drift — `SKILL.md` reads 1.3.0.0 and `README.md` reads 1.4.0.0 against a changelog head of 1.4.1.0; set both to 1.5.0.0 [both set to 1.5.0.0 per the family convention; see the contract conflict noted in the implementation summary]
- [x] T082 Record the adjacent finding for a packet of its own: `system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs` and `.pi/agents/` exist to feed `pi-subagents` and are now plausibly dead [recorded in the implementation summary]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T090 Re-run both guard suites and report the delta against the T001 baseline, not an absolute count [evidence: 170 passed vs 156 baseline, delta +14, zero failures]
- [x] T091 Re-run `npm run typecheck` and confirm the error set is unchanged from T001 [evidence: exit 0, error set unchanged from baseline]
- [x] T092 Re-run the adapter stress suite; test 13 green is the negative control proving the carve-out did not reach the stack layer [evidence: 19 passed / 1 skipped, unchanged]
- [x] T093 Re-run the residue greps from T002: `self.invocation` hits only under `changelog/`, `benchmark/reports/`, and the surviving `stress/self-invocation.md`; `pi-subagents` hits only under `changelog/` and `benchmark/reports/` [evidence: cli-pi self-invocation hits only in the surviving stress cell and one index link to it; pi-subagents zero outside changelog/benchmark]
- [x] T094 Run the playbook package validator and confirm no `[missing-playbook]`, `[orphan-playbook]`, or `[playbook-metadata]` failure [evidence: zero `missing-playbook`, `orphan-playbook`, `duplicate-playbook-cell`, `invalid-playbook`, `playbook-metadata` failures. The 252 `playbook-section`/`playbook-overclaim` failures are a pre-existing repo-wide backlog across all six packets and name no file this packet touched]
- [x] T095 Regenerate the packet metadata pair after the last spec-doc edit, or `GENERATED_METADATA_INTEGRITY` fails on a stale fingerprint
- [x] T096 `NODE_PRESERVE_SYMLINKS=1 bash "$(realpath .opencode)/skills/system-spec-kit/runtime/cli/spec/validate.sh" <folder> --strict` — require an explicit `RESULT: PASSED`, since a stale orchestrator exits 3 with no rule output at all
- [ ] T097 [B] Operator check, cannot run from this runtime: from inside a Pi session, dispatch `cli-pi` and confirm it reaches the binary rather than a hook denial. If unrun, the packet records SC-001 as unverified rather than claiming it
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`, or listed as not done with a reason
- [ ] No `[B]` blocked tasks remaining, or T097 explicitly reported as operator-pending
- [ ] Both guard suites green and the `tsc` delta zero against a baseline captured **before** the first edit
- [x] The other five executor kinds proven still guarded, by a test that would fail on a kind-agnostic exemption
- [ ] `validate.sh --strict` printed an explicit `RESULT: PASSED`, not merely the absence of `RESULT: FAILED`
- [x] The scoped diff contains no task-created residue and no file outside `spec.md` §3
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Closure Gate**: See `acceptance-criteria.md`
- **Decision Records**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
