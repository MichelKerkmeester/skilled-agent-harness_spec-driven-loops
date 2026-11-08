# Iteration 017 — Ask-surface once-guard per adapter, and the reach of the Python advisor

## Focus

Verify two claims that until now rested only on executor reading:

1. The ask-surface send-back "once" guard is per assistant message on OpenCode and per turn counter on dsh, versus per operator turn on Pi and Claude — and whether any test pins the once-per-operator-turn behaviour.
2. The reach of the Python advisor: every non-test caller of `skill_advisor.py`, and whether each one's output reaches an operator-visible ranking.

## Actions Taken

1. Read all four/five guard adapters and the shared core: `.opencode/plugins/ask-surface-guard.js`, `.skilled/hooks/ask-surface-guard/dsh/ask-surface-guard.mjs`, `.skilled/hooks/ask-surface-guard/pi/ask-surface-guard.ts`, `.skilled/hooks/ask-surface-guard/claude/ask-surface-stop.cjs`, `.skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs`.
2. Ran the three `node:test` suites that cover the core, Claude and dsh adapters (read-only): **31 tests, 31 pass, 0 fail** (211 ms). No files written by the run.
3. Grepped every test file for the once-guard assertion (`stop_hook_active|markTurn|twice|second|once`).
4. Grepped `.opencode`, `.skilled/bin`, `.skilled/hooks`, `.skilled/commands`, `.github` and the advisor's own runtime for non-test references to `skill_advisor.py`, then read the two files that actually mention it in code (`.opencode/plugins/system-skill-advisor.js`, `runtime/lib/freshness.ts`) to see whether the reference is an execution site or a signature input.
5. Checked whether the flags the two shell callers use (`--emit-routing-projection`, `--health`) exist in `skill_advisor.py`, and whether `.skilled/bin/skill-advisor.cjs` or the launcher names Python at all.

## Findings

### f-iter017-001 — FALSIFIED: the documented degraded local scoring has no caller (P1, drift doc-vs-code)

`system-skill-advisor/README.md:44` states: "When the daemon is unreachable, the CLI answers from the Python scorer at `runtime/scripts/skill_advisor.py` and marks the response degraded". No production process spawns that file.

- `.skilled/bin/skill-advisor.cjs` contains no occurrence of `python`, `skill_advisor` or `degraded`.
- `.skilled/bin/system-skill-advisor-launcher.cjs` likewise: no `python`, no `.py`, no `degraded`.
- The two remaining in-repo mentions are **signature inputs, not execution sites**: `.skilled/skills/system-skill-advisor/runtime/lib/freshness.ts:105` lists `skill_advisor.py` among files whose mtime/hash decides freshness, and `.opencode/plugins/system-skill-advisor.js:152` declares `ADVISOR_SCRIPT_RELATIVE_PATHS` which is only consumed by the cache-signature loop at `.opencode/plugins/system-skill-advisor.js:355`.

Release that introduced the claim: v4.0.0.0 / v4.0.0.16 (transport replacement era). Confidence: high (multiple independent negative searches across the two front doors plus the launcher). [SOURCE: .skilled/skills/system-skill-advisor/README.md:44] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/freshness.ts:105] [SOURCE: .opencode/plugins/system-skill-advisor.js:355]

Verify: `rg -n "python|skill_advisor|degraded" .skilled/bin/skill-advisor.cjs .skilled/bin/system-skill-advisor-launcher.cjs` → no matches; then stop the daemon and run `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"x"}'` and observe whether any ranking comes back.

### f-iter017-002 — CONFIRMED: the "once" guard is four different contracts (P2, drift / over-engineering)

| Runtime | Key | Where |
|---|---|---|
| Pi | operator message (index + timestamp + content hash) | `.skilled/hooks/ask-surface-guard/pi/ask-surface-guard.ts:66`, consumed at `:107` |
| OpenCode | assistant `messageId` (falls back to last message text) | `.opencode/plugins/ask-surface-guard.js:102` |
| dsh | turn **number** | `.skilled/hooks/ask-surface-guard/dsh/ask-surface-guard.mjs:107` |
| Claude | none of its own — delegates to `payload.stop_hook_active` | `.skilled/hooks/ask-surface-guard/claude/ask-surface-stop.cjs:92` |

The shared core exposes exactly one mechanism, `markTurn` with a filesystem `wx` marker (`.skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs:180`), and only three of the four runtimes use it; Claude uses the host's re-entry flag instead. The removal test: the core marker cannot be deleted while Pi, OpenCode and dsh depend on it, but Claude's branch would survive its removal untouched — which is the clearest evidence the two mechanisms are not one contract. Introduced v4.0.2.0. Confidence: high (read every adapter this iteration). [SOURCE: .skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs:180] [SOURCE: .opencode/plugins/ask-surface-guard.js:102]

### f-iter017-003 — NARROWED then CONFIRMED as a bug: dsh's turn key changes when the guard steers (P1, bug)

The dsh guard keys its marker on `dsh:<sessionId>:<turn>` (`.skilled/hooks/ask-surface-guard/dsh/ask-surface-guard.mjs:107`) and then calls `agent.steer(...)` (`:111`). The module header states the steer "makes the agent take one more step" (`.skilled/hooks/ask-surface-guard/dsh/ask-surface-guard.mjs:5`). A further step carries a further turn number, so `markTurn` sees a fresh key and returns `true` again: the once-guard protects one *turn number*, not one operator turn. The existing test proves only the same-turn case — "a turn closing on a prose menu is steered once, and a second stop **in that turn** is not" (`.skilled/hooks/ask-surface-guard/tests/dsh-ask-surface-guard.test.mjs:36`).

Severity P1 rather than P2 because a repeating steer loop is user-visible and unbounded: nothing in the adapter compares the steered message's `source.kind` (`'repo-guards'`, set at `.skilled/hooks/ask-surface-guard/dsh/ask-surface-guard.mjs:81`) against the turn it is about to judge. Confidence: medium-high — the turn-numbering behaviour is inferred from the module's own comment, not measured. Introduced v4.0.2.0. [SOURCE: .skilled/hooks/ask-surface-guard/dsh/ask-surface-guard.mjs:107] [SOURCE: .skilled/hooks/ask-surface-guard/tests/dsh-ask-surface-guard.test.mjs:36]

Verify: extend `tests/dsh-ask-surface-guard.test.mjs` with two `agent/turn-stopping` emissions carrying turn `1` then turn `2` and the same prose menu; if `agent.steer` is called twice, the once-per-operator-turn contract is absent on dsh.

### f-iter017-004 — CONFIRMED: which adapters have a test that pins once-per-operator-turn (P2, verification gap)

- **Pi — pinned.** `pi/ask-surface-guard.test.ts:64`: "sends one operator turn back once, however many agent loops end in the menu". This is the only test in the cluster that asserts the operator-turn contract.
- **Core marker — pinned, but only for the key it is handed.** `lib/ask-surface-core.test.mjs:62`: "markTurn is true once per turn key, then false".
- **dsh — not pinned.** `tests/dsh-ask-surface-guard.test.mjs:36` bounds itself to one turn number (see f-iter017-003).
- **Claude — not pinnable locally.** `claude/ask-surface-stop.test.mjs:49` asserts the guard *respects* `stop_hook_active: true`; nothing asserts the host sets it for the second Stop inside one operator turn. The once-per-operator-turn behaviour on Claude is therefore a host contract, not a repo contract.

Suite state at HEAD: `node --test` over claude + lib + dsh → 31/31 pass. Confidence: high. [SOURCE: .skilled/hooks/ask-surface-guard/pi/ask-surface-guard.test.ts:64] [SOURCE: .skilled/hooks/ask-surface-guard/claude/ask-surface-stop.test.mjs:49]

Verify: `node --test .skilled/hooks/ask-surface-guard/claude/ask-surface-stop.test.mjs .skilled/hooks/ask-surface-guard/lib/ask-surface-core.test.mjs .skilled/hooks/ask-surface-guard/tests/dsh-ask-surface-guard.test.mjs`

### f-iter017-005 — CONFIRMED: the Python advisor reaches no operator-visible ranking (P1, over-engineering + drift)

Every non-test caller of `skill_advisor.py` or its runtime siblings, and what its output reaches:

| Caller | Kind | Reaches an operator-visible ranking? |
|---|---|---|
| `.skilled/commands/create/assets/create-skill-parent-auto.yaml:240` (`advisor_projection_emit`, `--emit-routing-projection`) | live command step | **No** — emits a routing projection at skill-creation time, not a prompt-time ranking |
| `.skilled/skills/system-skill-advisor/runtime/scripts/init-skill-graph.sh:86` (`--health`) | manual init script | **No** — diagnostic only |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs:154` | research harness | **No** |
| `.opencode/plugins/system-skill-advisor.js:152` → `:355` | cache signature | **No** — path is hashed for invalidation, never spawned |
| `.skilled/skills/system-skill-advisor/runtime/lib/freshness.ts:105` | freshness signature | **No** |
| `.github/workflows/skill-advisor-stress.yml:8` | comment only | **No** (the referenced test exercises Python compat, not a ranking) |

Both Python flags the shell callers use do exist (`.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5435` and `:5445`), so those two callers are not broken — they are simply not on the recommendation path. Combined with f-iter017-001 this means the whole `skill_advisor.py` production surface is now a generator helper plus a health check, while `README.md:44` still presents it as the runtime fallback scorer. Removing the fallback claim from the README is the one-line fix; removing the script is not, because the create-skill-parent generator uses it. Confidence: high. Introduced v4.0.0.0. [SOURCE: .skilled/commands/create/assets/create-skill-parent-auto.yaml:240] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5435]

Verify: `rg -n "skill_advisor\.py" -g '!**/tests/**' -g '!**/*.test.*' -g '!**/dist/**' .opencode .skilled .github`

## Questions Answered

None ticked. Question 63 ("is the MCP transport fully gone, and do degraded local scoring and the shared daemon behave as documented") is now **half** answered — the degraded-local-scoring half is falsified by f-iter017-001 — but the shared-daemon lease/race half remains unexercised, so ticking it would overclaim.

## Questions Remaining

- **Shared daemon lease and two-launcher race** — the surviving half of question 63, ten iterations carried, now the run's largest untested claim.
- **Is the dsh steer loop real?** f-iter017-003 needs the two-turn harness described above to move from inferred to measured.
- **Does the steered dsh message carry `source.kind: 'repo-guards'` into `readTurn`?** If it does, a one-line provenance filter is the whole fix.
- Carried unchanged: the hook git-call time limit; `hook-flags.sh` vs `hook-flags.cjs` differential; which non-shared adapters import the flag module; `leaf-scopes.json` optionality; the live Claude turn-end hang; the live Codex compaction; which layer drops the advisor redirect.
- **Advisor follow-ups from generation 1** — sk-doc's `sk-create-skill-parent` shared-packet entry and the duplicate `package_skill.py`. Fifteenth iteration untouched, and now adjacent to f-iter017-005's generator finding.
- **UX and extension proper** — enabling relaunch, reading the advisor brief, recovering history. Fifteenth iteration unreached.

## Observations

- `obs-iter017-001`: the advisor status vocabulary carries a bare `'n'` value — `outageLabel: 'absent' | 'n' | 'fail_open'` (`runtime/lib/render.ts`) and `ADVISOR_HOOK_STATUS_VALUES = ['ok','skipped','stale','n','fail_open']` (`runtime/lib/metrics.ts`). A one-letter token where every sibling is a word looks like a redaction artifact rather than a designed state; worth one read before it is either documented or renamed.
- `obs-iter017-002`: `.skilled/bin/skill-advisor.cjs` reproducing no `degraded` token at all means the operator cannot tell a daemon-down answer from a live one except through the brief's own status field — relevant to the UX question, not a separate finding.

## Next Focus

Measure f-iter017-003 (two-turn dsh harness, or a provenance read of the steered message), then close the shared-daemon half of question 63 by exercising the launcher's degraded path directly — f-iter017-001 now makes that the only remaining untested transport claim, and it is cheaper than it was: one `kill` of the daemon socket plus one CLI call.
