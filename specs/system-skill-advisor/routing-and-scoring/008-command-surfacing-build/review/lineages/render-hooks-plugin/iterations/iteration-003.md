# Review Iteration 003

## Dispatcher

- Mode: review (fan-out lineage `render-hooks-plugin`)
- Session: `fanout-render-hooks-plugin-1794550137809-1ecgc7`, generation 1, lineage mode `new`
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`
- Area: `render-hooks-plugin`
- Operator review focus addressed this iteration: "docs that disagree with code". Every document in this area was read against the exact code it describes, and each claim below carries a line on both sides.
- Budget profile: `verify` (10 analysis actions)

## Files Reviewed

- `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:25`, `:38-39`, `:43`, `:50-53`, `:75`, `:88`, `:176`, `:192`
- `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:23`, `:33-47`, `:60`, `:69`
- `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/skill-advisor-cli.md`
- `.skilled/skills/system-skill-advisor/feature-catalog/hooks-and-plugin/claude-hook.md:24`, `:36`, `:40`, `:63`
- `.skilled/skills/system-skill-advisor/hooks/lib/README.md:21`
- `.skilled/hooks/shared/session-readers/README.md:18-47`, `:53-64`
- `.opencode/plugins/README.md:18-33`, `:61`, `:157`, `:168-179`, `:192`
- `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/README.md:1-60`
- `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-gate1-pointers.cjs:25-40`, `:55-96`, `:184-190`
- `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:103`, `:119`
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:70-82`
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:44-70`
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1480-1520`
- `.opencode/plugins/README.md:177` with `.opencode/plugins/system-skill-advisor.js:49`, `:376`

## Findings - New

### P0 Findings

None.

### P1 Findings

None. See the adjudications below: the one P1 raised in iteration 2 is downgraded on new documentary evidence.

### P2 Findings

1. **A documented timeout consumer never reads the timeout variable** -- `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:176` -- the line names `runtime/lib/subprocess.ts`, `skill-advisor-brief.ts`, the OpenCode bridge and `skill_advisor.py` as the live consumers of `SPECKIT_OPENCODE_HOOK_TIMEOUT_MS`. `subprocess.ts:119` does read it against `DEFAULT_TIMEOUT_MS = 3000` (`subprocess.ts:103`), but `skill-advisor-brief.ts` contains no occurrence of the name at all.
Finding class: instance-only
Scope proof: `rg -n "SPECKIT_OPENCODE_HOOK_TIMEOUT_MS" .skilled/skills/system-skill-advisor --include=*.ts` returns `subprocess.ts:119` and the dist mirror only; the count in `skill-advisor-brief.ts` is 0, so the brief layer is the single named consumer that does not exist.
Affected surface hints: ["hook documentation", "brief options", "advisor subprocess budget"]
Case: an operator raises `SPECKIT_OPENCODE_HOOK_TIMEOUT_MS` to widen the brief budget; `subprocess.ts` honours it and the brief layer does not, and a maintainer looking for the effect in `skill-advisor-brief.ts` finds no code path.

2. **The documented recommendation contract omits the field that decides the child-session downgrade** -- `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:41` -- the contract section names `kind`, `command`, `policy` and `ownerSkillId`; the code's row type carries a fifth field, `mutating` (`command-attach.ts:51`), and the child downgrade reads exactly that field (`render.ts:233`). `skill-advisor-hook.md:39` states the outcome as "a `run` command that is not read-only" without naming `mutating` or its vocabulary.
Finding class: class-of-bug
Scope proof: `rg -n "mutating" .skilled/skills/system-skill-advisor --include=*.md` returns the vocabulary only in `runtime/scripts/command-bridges/README.md:113-128` and prose hits elsewhere; neither the recommendation contract nor the render section that depends on it names the field, so every reader of the offer contract must find it in a third document.
Affected surface hints: ["feature catalog", "command-attach rows", "brief renderer", "child-session policy"]
Case: a maintainer adds a command row and sets `mutating: 'read-only'` on a command that writes; the child downgrade stops firing and no document in the contract path warns that this field is the guard's only input.

## Adjudications

- **R1-P2-001 (unknown runtime reported as a missing locator) — resolved, documented contract.** `.skilled/hooks/shared/session-readers/README.md:42` defines `locator_unavailable` as "The id is empty or unsafe, or the runtime has no locator to resolve", and `:43` defines `capability_gated` as "No reader exists for the runtime". `index.mjs:99` returns the first for an empty id before it resolves the runtime, which is what the table specifies. Reclassified as `resolved_false_positive`; no remediation is required.
- **R2-P1-001 (child downgrade keyed on a process-wide env flag) — downgraded to P2.** `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:39` documents the mechanism verbatim: "With `AI_SESSION_CHILD=1`, a surfaced `start` or `ask` command, or a `run` command that is not read-only, renders as `(parent-named only)`." Code and document agree, so there is no contract violation. The residual issue is that no caller can express child status per session, and the reach for that (a host that dispatches an in-process child without setting the variable) is not provable from this code. Per the reach rule it is hardening. It reopens as P1 the moment a host is shown dispatching a child in-process; recorded with that trigger.
- **R1-P2-005 (`needsMode` backfilled from the generated row) — refined, stays P2.** `skill-advisor-hook.md:53` states that the recommendation's own fields are authoritative and the row fills only what they omit, which is exactly `render.ts:226-228`. The residual gap is narrower than first recorded: it is the interaction with `needsMode` at `render.ts:549-552`, where a withheld command is refilled whenever a row exists.
- **R1-P2-003 (DSH turn without `source`) — refined, stays P2.** `.skilled/hooks/shared/session-readers/README.md:36` documents that a DSH injected source is "the event's source kind ... or `unknown` when it names none", which shows the absent case was considered. The finding's residual claim is only that operator text with no source disappears from `records`; it is not undocumented behaviour but it is also not covered by a test.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | pass | Every documented claim checked this iteration has a matching code path except finding 1. The policy vocabulary (`advisor-recommend.md:43`) matches `command-attach.ts:50`; the degraded typed-command path (`advisor-recommend.md:47`) matches `skill-advisor-cli.ts:1498-1505`, which emits `kind`, `command`, conditional `policy` and `ownerSkillId`; the prompt-head cap (`skill-advisor-hook.md:38`) matches `ADVISOR_PROMPT_MAX_CHARS = 10_000`. |
| `checklist_evidence` | core | notApplicable | The packet carries no checklist rows for this area; the review is of changed code, not of packet acceptance criteria. |
| `skill_agent` | overlay | partial | `skill-advisor-hook.md:88` names the Claude shim chain (`system-spec-kit/.../hooks/claude/user-prompt-submit.ts` → `system-skill-advisor/.../dist/hooks/claude/user-prompt-submit.js`); the source half resolves, the dist half is a build artifact and was not read. |
| `agent_cross_runtime` | overlay | pass | `skill-advisor-hook.md:88` and `:192` describe six runtime adapters and one OpenCode plugin; `.opencode/plugins/README.md:18-20` describes the dual `{ id, setup, server }` export, and `system-skill-advisor.js` returns exactly that shape through `dualPlugin`. |
| `feature_catalog_code` | overlay | pass | `advisor-recommend.md:33-39` describes `includeCompiledRoute`, `compiledRouteTopOnly` and the "one command never takes two slots" rule; `skill-advisor-cli-fallback.ts:238-244` passes the first two, and `render.ts:223-237` renders one command per label. |
| `playbook_capability` | overlay | notApplicable | No manual-testing playbook row covers this area. |

## Doc-vs-Code Ledger

| Document claim | Code fact | Outcome |
|---|---|---|
| `session-readers/README.md:29` "The dispatcher does not consult it" (`capabilities`) | `index.mjs:97-105` never reads `capabilities` | confirmed |
| `session-readers/README.md:31` "`loadSession` passes `injected` through" | `index.mjs:142` passes it only when it is an array | confirmed |
| `session-readers/README.md:33-36` four injected source shapes | `claude.mjs:180`, `pi.mjs:171`, `devin.mjs:200-207`, `dsh.mjs:253` | confirmed |
| `session-readers/README.md:62` Devin falls back "for a store without the session's turns" | `devin.mjs:415-447` falls through only when the row is absent or the projection is empty | confirmed (and see R1-P2-004 for the corrupt-store case it does not cover) |
| `session-readers/README.md:64` `cursor.mjs` returns before touching a file | `capabilities.cursor.status === 'gated'` (`index.mjs:59-64`); reader exists but is gated | confirmed |
| `.opencode/plugins/README.md:177` `SPECKIT_OPENCODE_HOOK_TIMEOUT_MS` default 3000 | `subprocess.ts:103`, `:119` | confirmed |
| `.opencode/plugins/README.md:192` workspace-surface cache "is not capped" | documented as an accepted unbounded cache | confirmed, advisory only |
| `runtime-mirrors/README.md:15` `sync-gate1-pointers.cjs` writes two pointer blocks from root `AGENTS.md` lines | `sync-gate1-pointers.cjs:25-40`, `:68-96`, `:184-190` | confirmed |
| `skill-advisor-hook.md:176` `skill-advisor-brief.ts` consumes the timeout variable | no occurrence in that file | **finding 1** |

## Integration Evidence

- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1498-1505` emits the degraded typed-command entry with `kind: 'command'`, `command`, conditional `policy` and `ownerSkillId`, matching `advisor-recommend.md:47` field for field.
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:50-51` is the single `policy`/`mutating` vocabulary; `advisor-recommend.md:45` names `command-attach.ts` as the single source for the documented fields, which is why the missing `mutating` entry is a documentation gap and not a second code path.
- `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-gate1-pointers.cjs:28` reads `AGENTS.md` as `SOURCE_FILE` and writes `.cursor/rules/skill-routing.md` (`:37`), so the README's claim about the two blocks is exact.

## Edge Cases

- **`policy` may be absent in the degraded entry:** `advisor-recommend.md:47` says "all four fields"; `skill-advisor-cli.ts:1502` adds `policy` only when the row has one. Every generated row in `command-attach.ts:66-100` carries a policy, so the doc and code agree in practice; recorded here rather than as a finding because no row in the table omits it.
- **`mutating` is documented outside this area:** `runtime/scripts/command-bridges/README.md:113-128` holds the vocabulary, and that file belongs to the `scorer-attach` lineage. Finding 2 is scoped to the offer contract this area ships, and does not claim the vocabulary is undocumented anywhere.
- **Declaration files:** not re-entered, per the exhausted-approach record.

## Confirmed-Clean Surfaces

- `.skilled/hooks/shared/session-readers/README.md:26-31` and the failure table at `:40-47` match the dispatcher exactly, including the `session_ambiguous` code that only `pi.mjs:229` raises.
- `.skilled/skills/system-skill-advisor/hooks/lib/README.md:21` — the claim that the request goes on stdin with `--json -` and carries `includeCompiledRoute` and `compiledRouteTopOnly` matches `skill-advisor-cli-fallback.ts:228-245`.
- `.skilled/skills/system-skill-advisor/feature-catalog/hooks-and-plugin/claude-hook.md:36` — the 2200 ms shim cap under a 2500 ms hook kill matches `skill-advisor-hook.md:38` and the `subprocess.ts` default family.
- `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/README.md:32` — `sync-gate1-pointers.cjs` reports drift under `--check` and writes only without it (`:184-190`).
- `.opencode/plugins/README.md:18` — every plugin's `{ id, setup, server }` shape matches the `dualPlugin` return that `system-skill-advisor.js` builds.

## Ruled Out

- "`.opencode/plugins/README.md:177` documents a variable the plugin never reads, so the knob is dead": ruled out. The variable is read by `runtime/lib/subprocess.ts:119`, which the same line names as a consumer; the README's sentence is about the hub, not about the plugin.
- "The recommendation contract documents `mutating` under another name": ruled out. `advisor-recommend.md:41-47` names four fields and `command-attach.ts:50-51` has five.
- "The session-reader README overstates the injected guarantee": ruled out. All four readers return `injected` and `readSession` ignores it.
- "`sync-gate1-pointers.cjs` writes a third block": ruled out. It defines two end markers (`:25`, `:27`) and one source file (`:28`).

## Next Focus

- Dimension: maintainability
- Focus area: the remaining unread scope files — `runtime/skill-advisor-cli-manifest.ts`, `runtime/tests/*` (the ten in-scope suites), `runtime/lib/embedders/index.ts` and `schema.ts`, `runtime/lib/advisor-runtime-values.ts`, `spec-gate-core.mjs`, `sync-runtime-mirrors.cjs`, and `AGENTS.md`.
- Reason: three dimensions are covered but roughly 30 scope files have not been opened; maintainability is the last rotation slot and the natural place to judge test-to-behaviour fit, duplication between the plugin and the runtime, and the `AGENTS.md` hook section these surfaces claim to implement.
- Rotation status: D1, D2 and D3 complete; D4 next.
- Blocked/productive carry-forward: `.d.mts` parity stays blocked; the doc-vs-code ledger stays productive and its method carries into `AGENTS.md`.
- Required evidence: `file:line` on the module or test, plus the exact duplicate or contract it diverges from.

Review verdict: PASS
