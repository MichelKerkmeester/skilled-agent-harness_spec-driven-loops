---
title: "Dispatch Preflight Parity and the Hermes Caveat Fixes — Lineage Synthesis (deepseek)"
trigger_phrases:
  - "dispatch preflight parity synthesis"
  - "cli hard rule severity table"
  - "hermes caveat fixes plan"
---
# Dispatch Preflight Parity and the Hermes Caveat Fixes

> Lineage `deepseek` (`deepseek-v4.1-flash` at max, cli-pi), ten iterations, stop policy `max-iterations`, stopReason `maxIterationsReached`. One angle per iteration; every finding carries a `file:line` citation. Four confirmed defects and two coverage gaps were given; this research found **two further defects** (a codex-wide dispatch-shape failure and an unwired Hermes plugin opt-in), completed the severity survey, and produced the ranked plan below.

---

## 1. Severity table — every `hard_rules` entry across the seven `cli-*` skills

23 declarations; 7 at `error`, 16 at `warn`. "Fires?" = the check detects its violation from the command string (verified by probe where marked *). Recommended severity is what the rule should declare, with the reason.

| # | Skill | Rule id | Check | Declared | Fires? | Recommended | Reason |
|---|-------|---------|-------|----------|--------|-------------|--------|
| 1 | claude-code | stdin-redirect-required | stdin-redirect-required | warn | yes* | **error** | Violation hangs with zero output, indistinguishable from a slow model. |
| 2 | claude-code | non-interactive-permission-mode-risk | non-interactive-permission-mode-risk | warn | partial | warn (redesign) | Check demands the bypass flag; the message's second safe path is not command-checkable. |
| 3 | codex | stdin-redirect-required | stdin-redirect-required | warn | yes* | **error** | Same silent-hang class. |
| 4 | codex | codex-availability-required | command-v-codex-required | error | yes | error (keep) | Correct as declared. |
| 5 | cursor | stdin-redirect-required | stdin-redirect-required | warn | yes* | **error** | Same silent-hang class. |
| 6 | cursor | cursor-availability-required | command-v-cursor-agent-required | error | yes | error (keep) | Correct as declared. |
| 7 | devin | stdin-redirect-required | stdin-redirect-required | warn | yes* | **error** | Same silent-hang class. |
| 8 | devin | devin-availability-required | command-v-devin-required | error | yes | error (keep) | Correct as declared. |
| 9 | hermes | stdin-redirect-required | stdin-redirect-required | warn | yes* | **error** | Same silent-hang class. |
| 10 | hermes | hermes-availability-required | command-v-hermes-required | error | yes | error (keep) | Correct as declared. |
| 11 | hermes | yolo-required-for-writes | hermes-yolo-required-for-writes | error | partial | error (widen roster) | A flagged step silently fails the leaf; `-t shell` slips the write-toolset list. |
| 12 | hermes | ignore-rules-required | hermes-ignore-rules-required | warn | yes (false exemption) | **error after exemption removal** | Missing flag injects SOUL.md/memories/session search into the leaf. |
| 13 | hermes | explicit-toolsets-required | hermes-explicit-toolsets-required | warn | partial (no `file`) | **error after check fix** | `-t search,todo` passes; leaf cannot read, exits 0 empty. |
| 14 | hermes | no-worktree-flag | hermes-no-worktree-flag | error | yes | error (keep) | Correct as declared. |
| 15 | hermes | mcp-config-operator-required | hermes-mcp-config-operator-required | warn | yes | **error** (medium confidence) | Mutates user-level operator config from inside a leaf. |
| 16 | hermes | hooks-user-level | hermes-hooks-user-level | warn | yes | warn (keep) | Unauthorized-action class, not silent-wrong-result. |
| 17 | opencode | stdin-redirect-required | stdin-redirect-required | warn | yes* | **error** | Same silent-hang class. |
| 18 | opencode | explicit-model-required | explicit-model-required | warn | yes | **error** | 429 retries forever with NO output. |
| 19 | opencode | no-bare-agent-general | no-bare-agent-general | warn | partial (`--agent=general` slips) | warn (fix predicate) | opencode rejects it loudly; not silent. |
| 20 | opencode | command-flag-for-slash-prompt | command-flag-for-slash-prompt | warn | partial (unquoted slips) | **error after predicate fix** | Slash text delivered as prose = wrong task, no error. |
| 21 | opencode | share-requires-confirmation | share-requires-confirmation | warn | partial (`--share=…` slips) | warn (keep) | Consent is not visible in the command. |
| 22 | pi | stdin-redirect-required | stdin-redirect-required | warn | yes* | **error** | Same silent-hang class. |
| 23 | pi | pi-availability-required | command-v-pi-required | error | yes | error (keep) | Correct as declared. |

Two skills declare no `error` rule — cli-claude-code (2 warns) and cli-opencode (5 warns). Both are **oversights**: each contains at least one silent-failure rule, and neither carries an availability rule while five sibling skills do. [dispatch-rule-checks.mjs:240-253 maps `block|error` to blocking, everything else to advisory]

## 2. Defect table

| # | Defect | Line | Fix | Test that proves it |
|---|--------|------|-----|---------------------|
| D1 | Codex dispatch shape never matches the shared registry (`codex exec` has no `-p/--print`); codex preflight and audit are inert | dispatch-audit.mjs:33 | Drop the print-flag requirement from the codex entry | Fixture: documented `codex exec … -` resolves to `cli-codex` in both registries |
| D2 | Hermes project-plugin opt-in never set by the runner; the read-only marker and spec-folder it wires are consumed only by that plugin | fanout-run.cjs:3268-3272 | Add `HERMES_ENABLE_PROJECT_PLUGINS=1` to the Hermes extraEnv | Builder unit: cli-hermes dispatch env contains the key; one live lineage logs a plugin prompt section |
| D3 | `hermes-ignore-rules-required` sanctions a `-s` dispatch without `--ignore-rules` on a disproved premise | dispatch-rule-checks.mjs:184-186; test.mjs:116-119; cli-hermes/SKILL.md:19-22 | Delete the `HERMES_SKILL_PRELOAD` clause + constant; flip both assertions to expect the violation; drop the exception from the message; regenerate the `.hermes` mirror | The two flipped test lines are the proof |
| D4 | `hermes-explicit-toolsets-required` does not require `file`; `-t search,todo` passes and the leaf exits 0 empty | dispatch-rule-checks.mjs:189-194 | Require `file` in the parsed `-t` list | Fixture: `-t search,todo` → violation; `-t file,todo` → clean |
| D5 | `stdin-redirect-required` is warn everywhere; violation is a silent hang | cli-*/SKILL.md:7-10 | Flip seven declarations to `error` | Mutation pair per shape: unredirected fails, `</dev/null` passes |
| D6 | opencode severity: 429-silence and prose-delivery rules are warn | cli-opencode/SKILL.md:11-22 | Flip both to `error` | Existing evaluate fixtures still pass with `severity: block` |
| D7 | Predicate bypasses: `--agent=general`, `--share=<value>`, unquoted slash prompts | dispatch-rule-checks.mjs:153-161 | `--agent(\s+|=)general`, `--share(\s|=|$)`, prompt regex without quote dependency | One violating fixture per bypass |
| D8 | Pi `-p` without `--offline` hangs minutes on startup probes; no rule declares it | fanout-run.cjs:2559-2565 | Add `pi-offline-required` (error) | Fixture: `pi -p` without the flag → violation |
| D9 | Builder model defaults diverge and go unvalidated (codex `o4-mini` vs `gpt-5.5`; opencode `anthropic/claude-opus-4-8` vs `opencode-go/deepseek-v4.1-flash`) | fanout-run.cjs:2070,2200-2203 | Align defaults to the packet; validate where rosters exist | Unit: default equals the documented default per kind |
| D10 | Claude + OpenCode builders lack the availability probe the other five have | fanout-run.cjs:2104,2200 | Mirror the helper | Unit: PATH without the binary → `inputError` |
| D11 | Two shape registries disagree (realized drift) and neither is checked against documented commands | dispatch-audit.mjs:27-41 vs dispatch-rule-checks.mjs:78-89 | One fixture matrix both must classify identically | The matrix fails today on codex |
| D12 | Registration is asserted nowhere for claude/cursor/devin/pi; Devin's entry has no drift fallback | .devin/hooks.v1.json:72 | Registration test + drift fallback parity | CI fails when a config entry is removed |
| D13 | Model rosters duplicated as literals in the CJS builder | fanout-run.cjs:2242-2595 | Roster-agreement assertion (or shared import) | Guard fails on a one-token roster edit |
| D14 | Docs misstate the registry: README "five checks", comment "four availability rules" | dispatch/README.md §2; dispatch-rule-checks.mjs:162-170 | Update counts | Guard reads `KNOWN_CHECKS` length |
| D15 | `non-interactive-permission-mode-risk` fails all `claude -p` without the bypass flag — its pass condition is a proxy | dispatch-rule-checks.mjs:205-208 | Redesign predicate or downgrade the advisory's claim | Fixture pair reflecting the intended risk |
| D16 | AGENTS.md §7 carries the sole `U+200D`; Hermes blocks the file | AGENTS.md:247 | Replace with a non-ZWJ emoji | Hermes scan pre/post (outside repo) |

## 3. Parity table — Cursor and OpenCode

| | Cursor | OpenCode |
|---|---|---|
| Pre-execution surface | `preToolUse` array in `.cursor/hooks.json` with matchers — **live today** (`spec-gate-enforce`, `task-dispatch-guard` on `Task`, `git-preflight-advisory` on `Shell`) | Plugin API `tool.execute.before(input, output)`; deny = `throw` ("OpenCode's deny signal") |
| Existing dispatch artifact | `cursor/post-tool-use.mjs` — multiplexed proxy, audit only, never blocks | `.opencode/plugins/cli-dispatch-audit.js` — `tool.execute.after`, observe-only, shared audit core |
| Smallest adapter | Translation shim over `claude/dispatch-preflight-lint.mjs` (Shell → Bash payload, `workspace_roots[0]` root, Cursor `{permission:'deny', user_message, agent_message}` + exit 2 / `{permission:'allow', agent_message}`) | Add a `tool.execute.before` hook to the same plugin: shared `readHardRules`/`evaluate`/`DISPATCH_SHAPES`; throw for block, buffer for the next `experimental.chat.system.transform` |
| Reuses shared library unchanged | yes (`git-preflight-advisory.mjs` already imports the engine) | yes (both imports already used by sibling plugins) |
| Cost | ~150 lines mirroring an existing shim; no new deps | ~40 lines in an existing plugin; no subprocess |
| Detection latency | zero — pre-spawn | zero for blocks; advisory lands on the next transform |
| Blind to | commands run in other runtimes | commands run in other runtimes |
| Today's coverage | nothing pre-execution for dispatch | nothing pre-execution for dispatch |

Both runtimes already carry the primitive; the parity gap is wiring, not platform. [.cursor/hooks.json; task-dispatch-guard.mjs:104-124; plugins/README.md:84; cli-dispatch-audit.js:60-90]

## 4. Ranked recommendations

Ranked by (failure severity × confidence) ÷ cost. Full table with ratios in `iterations/iteration-010.md`.

**Do now** — codex shape fix (D1); Hermes plugin opt-in (D2); the `-s` exemption removal with its test flip (D3); `file`-toolset requirement for Hermes (D4); seven stdin severity flips (D5); opencode severity flips (D6); AGENTS.md joiner removal (D16).

**Do next** — the one CI guard (shape parity + bijection + per-check fixtures + registrations, catching D7/D11/D12/D13/D14 at once); OpenCode `tool.execute.before` preflight; Cursor preflight shim; `pi --offline` + provider-qualified-model checks (D8); predicate bypass fixes (D7); remaining new predicates (Hermes provider/source/`-z`/budget; opencode `--dir`; cursor `auto`; claude/codex model pins; devin permission-mode advisory); builder parity (D9, D10); Devin drift fallback; `mcp-config-operator-required` → error; kill-switch advisory; persona wiring (`HERMES_AGENT_PERSONA` + `-s agent-<name>`, sequenced after D3); permission-mode predicate redesign (D15); doc drift sweep (D14).

**Do not** — repo-rules digest section (16%-at-best and skipped when over; name the file instead); per-dispatch self-test; a third roster copy; per-runtime engine reimplementations; hand-editing generated mirrors or dated reports; fail-closed posture.

## 5. Phase decomposition (ready to scaffold)

| Phase | Scope (one line) | Depends on | Closing gate |
|---|---|---|---|
| 1. Close the four silent holes | The seven do-now items | — | dispatch-rule-checks tests green with flipped assertions; shape matrix green; Hermes plugin env test; Hermes scan clears |
| 2. Extend coverage | New predicates + OpenCode before-hook + Cursor shim + Devin fallback + registrations | Phase 1 | one live denial per new adapter; per-predicate fixture pair; registration test reddens on a removed entry |
| 3. Wire the builders | Availability parity, model defaults, service tier, persona env + preload | Phase 1 (D3) for the persona shape | builder unit tests per kind; one live Hermes lineage showing persona/session-context sections |
| 4. Make silence loud | The full CI guard, mutation-proofed, plus the kill-switch advisory | Phases 1 and 3 | guard green; mutated assertion turns it red |

---

## Convergence report
- Stop reason: `maxIterationsReached` (forced depth, 10/10 iterations).
- Iterations completed: 10. Questions answered: 10/10.
- newInfoRatio trend: 1.0, 0.85, 0.9, 0.9, 0.85, 0.8, 0.85, 0.85, 0.8, 0.55 (mean ≈ 0.835) — convergence telemetry only; the cap was reached as configured.
- Lineage artifacts: `iterations/iteration-001..010.md`, `deltas/iter-001..010.jsonl`, `deep-research-state.jsonl`, `findings-registry.json`.
