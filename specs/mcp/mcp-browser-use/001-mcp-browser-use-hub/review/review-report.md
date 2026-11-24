# Deep Review Report: mcp-browser-use hub epic, generation 3

Fan-out review of `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` after phase 014 and the advisor scorer change (`dbea9ff4a25`, `ec3ed74ad01`). Four DeepSeek lineages ran with no Opus executor. Two used cli-pi `deepseek-v4.1-flash-1017` at thinking max and two used cli-mistral-vibe `deepseek-flash`. The scope held 507 files, including the 2026-11-22 ClickUp report folder and the four changed scorer files.

---

## 1. Verdict

**CONDITIONAL. This verdict is not gate-proven.** The merge counts P0 = 0, P1 = 10 and P2 = 25 across the four lineages (`fanout-merge.cjs`, exit 0). Each lineage reached CONDITIONAL on its own.

The runner failed all four lineages. Each exited 0 and wrote a `synthesis_complete` row, but none ran the terminal-gates step, so no state log holds a `terminal_gates` row. Every lineage went straight from `graph_convergence STOP_ALLOWED` to synthesis. The merge also lists vibe-1 passes 4 and 5 and vibe-2 passes 1 to 5 as unexamined, so those lineages carry less weight than pi-1 and pi-2.

Gates computed afterwards with `terminal-gates.cjs` against each lineage folder. The run did not record these, so they are evidence about the run and not gates it passed:

| Lineage | Iterations | Failed gates, computed afterwards |
|---|---|---|
| pi-1 | 5 | none |
| pi-2 | 6 | coverage |
| vibe-1 | 7 | scope, coverage |
| vibe-2 | 5 | scope |

A rerun on the same executors would likely skip the gate step the same way. A gate-proven run needs an executor that reaches that step, or a fix to the lineage workflow.

---

## 2. P1 Findings, Checked Against Source

Each P1 was reproduced with the reviewer's own case or `file:line` before it was kept.

| Finding | Lineage | Check run | Result |
|---|---|---|---|
| Naming all three mode ids drops Bladebro from the ordered bundle (`hub-router.json:96`) | vibe-1 R1-P1-001 | `compiled-route.cjs --hub mcp-browser-use --prompt "use mcp-chrome-devtools, mcp-aside-devtools and mcp-bladebro"` prints `orderedBundle mcp-chrome-devtools,mcp-aside-devtools` | **Confirmed, P1** |
| The hub capability matrix advertises Aside `page.on(...)` events, which the Aside packet documents as throwing (`SKILL.md:40`) | vibe-2 R4-P1-008 | Hub `SKILL.md:40` against Aside `SKILL.md:147,202-204`. 014 REQ-012 fixed the Aside docs and missed this row | **Confirmed, P1** |
| The `./tmp` session-dir guard does not normalize the path (`repl-evidence-capture.sh:33`) | vibe-2 R2-P1-003 | `./tmp/../../x` matches the `./tmp/*` case arm. The `./tmp` default came from 014 REQ-013 | **Confirmed, P1** |
| The Aside installer pipes a remote script into bash (`install.sh:78`) | vibe-1 R3-P1-001 | `curl -fsSL "$INSTALLER_URL" \| bash`. It is the only `install.sh` under `.skilled/skills` that does this. The script is the vendor's official installer | **Confirmed, severity left for the fix packet** |
| The canary corpus never exercises a multi-mode bundle (`canary-cases.v1.json:4`) | vibe-1 R2-P1-002 | 15 cases: 12 route, 2 defer, 1 reject, none an ordered bundle. That is how the bundle defect above went uncaught | **Confirmed, P2: a coverage gap** |
| The id-noun anchor accepts common nouns, so one shared word still reaches the 0.82 floor (`fusion.ts:332`) | pi-1, vibe-2 | A debug trace shows the noun alone lifting system-deep-loop on "fix the infinite loop in this function", mcp-tooling on "update the build tooling", mcp-code-mode on "the mode rollout" and cli-orca on "orca whale". The new floor condition is the old one with an added AND, so whatever it lifts the old floor lifted too. This is leftover leak, not a regression. Correction: this report first cited "the design of this database schema is wrong" for sk-design. That lift comes from the explicit lane's `design` entry, not the noun | **Confirmed as residual.** Fixed in phase 015 (Q006) |
| A bare `staging` hint lifts mcp-browser-use to 0.82 on non-browser prompts (`lexical.ts:30`) | pi-2 PI2-I2-P1-001 | The reviewer's exact case returns no recommendation through the CLI, but "fix the config loader that reads the wrong settings file in staging" lifts the hub to 0.82 through the bare `staging` explicit entry and hint. Correction: this report first marked the finding refuted on the exact case alone | **Confirmed.** Fixed in phase 015 |
| The Chrome install guide registers an unpinned `chrome-devtools-mcp@latest` (`INSTALL-GUIDE.md:361`) | pi-1 pi1-I2-P1-001 | Confirmed in text. Three install guides, `mcp-obsidian` and `mcp-code-mode` among them, follow the same `@latest` convention | **Confirmed, P2: matches a repository-wide convention** |
| The advisor keyword set is narrower than the hub router vocabulary (`description.json:6`) | vibe-1 R4-P1-001 | Same mechanism as the recorded known limitation MBU-PB-04 | **Duplicate of a known limitation** |

After the check: **3 P1 confirmed** in the hub, 1 security item awaiting a severity call, the `staging` hint confirmed on a reworded prompt, and 4 moved to P2 or known limitation. Phase 015 later found one more advisor-stage leak for the hub that no lineage reported: its keyword list named `mcp-code-mode`, so "fix the code in the parser" reached it at 0.82.

---

## 3. P2 Advisories

The merged registry holds 25 P2 findings, listed in `deep-review-findings-registry.json`. These were not checked one by one. The groups:

- **Packet state drift:** goal logs still say In Progress (parent `goal.md:135`, 014 `goal.md:83`). Derived `in_progress` status sits beside docs that say Complete. AC-002 and AC-013 evidence wording.
- **Docs drift:** the README version is 1.1.3.0, the benchmark index omits the newest run, the playbook index names a superseded run, `ROUTER.md` keywords have drifted, the 014 release note misstates its out-of-domain counts, and `leaf-scopes.json` is described as per-mode. A recount against `skill-benchmark-report.json` found one of the three release-note counts stale and two correct; the reviewer left the two `rb` rows out of the 11 earlier out-of-domain prompts.
- **Install hardening:** no operator-yes gate is enforced in code, the live-attach and Chrome manuals have no stated gate, the Bladebro pin is duplicated, the research table still shows an ungated `npx -y bladebro`, and the Aside example accepts `file://` URLs.
- **Engine:** `compiled-route.cjs:29` ignores the activation-root override.

---

## 4. Next Step

A phase-015 fix packet covers:
- the three confirmed hub P1 findings
- the Aside installer
- the canary bundle case
- the P2 groups above

The operator folded the id-noun residual into phase 015 (Q006). Once the fixes land, a gate-proven review needs an executor that records the `terminal_gates` row.

---

## 5. Run Record

- Root config: `deep-review-config.json`, generation 3, parent session `2026-11-24T04:43:48.599Z`, restart.
- The prior packet is archived at `../review-archive/20261124T070727Z-restart`. Moving it back undoes the restart.
- Attribution: `fanout-attribution.md`. Provider cost is unknown for all four lineages.
