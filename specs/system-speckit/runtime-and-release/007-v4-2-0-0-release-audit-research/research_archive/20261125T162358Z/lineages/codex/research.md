# Research Synthesis: Skilled v4.2.0.0 Release Audit

## 1. Executive Decision

This is a bounded, partial audit of the v4.2.0.0 release notes against the v4.1.0.0..HEAD window. Ten iterations confirmed **15 P2 findings: 11 MISSING, 2 DRIFT, and 2 BUG**. No P0 or P1 finding was confirmed. A local Markdown-link scan found no missing targets in the release-note document. The 10-iteration cap stopped the run with the four top-level research questions still open; this report does not claim exhaustive coverage of all 1,084 commits or all 21 recent packets.

The clearest release-note corrections are the missing research-loop behavior, several post-draft browser/advisor/worktree changes, and the omitted Claude Stop and playbook-recorder features. The concrete defects are the case-sensitive reserved-path guard and a worktree script that lost its executable mode. The Bladebro installation line also no longer matches the current verified installation procedure.

## 2. Research Objective and Boundaries

The audit compares `.skilled/changelog/skilled/v4.2.0.0.md` with changes in `v4.1.0.0..HEAD`, including the supplied 1,084-line commit window and 21 most-recently-touched packet roots. The requested classifications are:

- **MISSING**: a user-visible change in the window is not described in the aggregate release notes.
- **DRIFT**: a release-note claim is contradicted by current code or documentation.
- **BUG**: a defect in changed code is shown by source inspection or a read-only command.

The scope was read-only outside this lineage. Tests, `validate.sh`, and mutation commands on the repository were not run. Historical test totals in the notes were treated as historical results, not rerun results.

## 3. Method and Evidence Provenance

Ten section-focused iterations read the lineage state and strategy before selecting work, checked relevant commit diffs and current code/docs, and recorded findings with commit hashes and current file-line citations. Recent packet summaries were used to trace three additional omissions in iteration 10. A static scan of local Markdown targets in the top-level release note returned zero missing local files or anchors; it did not inspect arbitrary path strings or runtime links.

The audit checked the release-note sections in turn: Deep Loop, Fan-Out Runs, Dispatch and Safety, Skill Advisor, Installs and Overlays, OpenCode, Browser Use, Skills and Worktrees, How It Was Checked, and Upgrade Notes. A section pass with no finding means no discrepancy was confirmed in the inspected claims, not that every commit affecting the component was exhaustively reviewed.

## 4. Missing Release-Note Coverage

All findings below are P2. The nearest aggregate-note line is cited even where it only names a component or describes adjacent behavior.

### Deep Loop and Fan-Out Runs

1. **MISSING | P2 — Research fan-out now stops when its assigned frontier is drained.** The note describes `frontier_drained` for review but omits the research-lineage stop. Commit `b3fea67595ede5d47ce0d9ef57629bd46aedda8f`; workflow and convergence evidence: `.skilled/commands/deep/assets/deep-research.yaml:1132`, `.skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md:130`; related note: `.skilled/changelog/skilled/v4.2.0.0.md:179`.
2. **MISSING | P2 — CLI iterations persist masked child stdout as `iterations/iteration-NNN.out`.** The output artifact was added for streamed executor output, but the notes mention tool/source metrics without this file. Commit `1b7fe3e1a26ff0b808b5d78bb17bb032caa46ead`; current code: `.skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:390,396`, `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1599`; related note: `.skilled/changelog/skilled/v4.2.0.0.md:210`.
3. **MISSING | P2 — Fan-out records an unknown executable identity when the first runnable PATH match cannot be read.** It does not attribute a later binary's identity to the unreadable match. Commit `15fe7306bca6e92332b827d129cdc799b74efeae`; current code: `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3506-3517,3676`; related finished-lineage note: `.skilled/changelog/skilled/v4.2.0.0.md:294`.

### Installs and Overlays

4. **MISSING | P2 — JSON-entry overlay writes preserve the destination's indentation depth, indent unit, and prevailing CRLF endings.** The aggregate apply-shape bullets omit this serialized-output behavior. Commit `512be46971ab0b86fe3ca45850ff9f488d3aa3bb`; current code: `.skilled/commands/doctor/scripts/overlay-engine.cjs:1220-1251,1426-1633,2226-2228`; related note: `.skilled/changelog/skilled/v4.2.0.0.md:594-599`.
5. **MISSING | P2 — A linked-worktree goal is handed to Claude receivers from its actual worktree root, while other runtimes omit it with a warning to avoid binding a stale copy.** The OpenCode and Skills and Worktrees notes omit this handover behavior. Commit `12fe3abc66b48bab326a08b08accbc3c2c00f8ef`; current code: `.skilled/hooks/session-handover/lib/relaunch-core.cjs:584-591`, `.skilled/hooks/session-handover/bin/session-handover.cjs:419-421,897`, `.skilled/bin/skilled-loop:483-487,1460-1477`; related note sections: `.skilled/changelog/skilled/v4.2.0.0.md:635-681,727-748`.
6. **MISSING | P2 — New-worktree provisioning builds the missing advisor skill-graph database and fails if the scan does not produce it.** The aggregate note describes the nearest-lockfile dependency fix, not the graph-database step. Commit `957f47570f381cfc42c2d90d151771dfe695647e`; current code: `.skilled/skills/sk-git/scripts/worktree-naming.sh:796-818`; related note: `.skilled/changelog/skilled/v4.2.0.0.md:742-748`.

### Browser Use and Advisor Routing

7. **MISSING | P2 — The advisor lifts its read-only floor for attach/connect requests to the user's own Chrome.** The Browser Use section says browser requests route to the hub but omits this route exception. Commit `1a350b1512bdabbf861d63fe5c1ca2bf343c8522`; current evidence: `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:680-691`, `.skilled/skills/mcp-browser-use/SKILL.md:60`; related note: `.skilled/changelog/skilled/v4.2.0.0.md:697`.
8. **MISSING | P2 — A prompt mentioning “403 Forbidden” can route to Chrome DevTools; rejection now applies to caller constraints rather than matching prompt text.** Commit `a9a8a878daddcc7f0030ee81dc58c3dd81e82ca5`; current router and canary: `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs:113-120`, `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/fixtures/canary-cases.v1.json:263-274`; related note: `.skilled/changelog/skilled/v4.2.0.0.md:697-700`.
9. **MISSING | P2 — Advisor lexical confidence-floor lifts now require a distinctive prompt word shared by at most 25% of skills.** The note names the lexical lane and its weight but omits this anchor rule. Commit `527fc5f9d434dac875527da753f52af49acdf638`; current code: `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts:108-118`, `.skilled/skills/system-skill-advisor/runtime/lib/scorer/scoring-constants.ts:197`; packet evidence records that three of five probe lifts remained after the landed change: `specs/system-skill-advisor/routing-and-scoring/014-lexical-anchor-narrowing/implementation-summary.md:49-75`; related note: `.skilled/changelog/skilled/v4.2.0.0.md:435-438`.

### Decision Capture and Playbook Recording

10. **MISSING | P2 — Claude Stop records queued tool answers automatically when the transcript tail identifies exactly one packet.** It writes the answers to `decision-record.md` and marks their keys consumed. Commit `d57563b175a34e8e4e4f9e3f697adb1922cfb001`; current code: `.skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:195-217`; the aggregate note names `system-spec-kit` but not this behavior: `.skilled/changelog/skilled/v4.2.0.0.md:823`.
11. **MISSING | P2 — The playbook mode gained a run recorder, conversation-runner handoff, results-marker validation, and a `--coverage` report.** Commit `c06a73d348ec85d3603fe7420dca1a56f2f3b6b1`; command and mode contract: `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/record-playbook-run.cjs:62-63`, `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md:214-235,253-255`; the aggregate note names the mode but not the behavior: `.skilled/changelog/skilled/v4.2.0.0.md:823`.

## 5. Claim Drift

12. **DRIFT | P2 — Typed deep-loop commands remain askable in the Python advisor fallback even when nearby text refuses the loop.** This applies when the native advisor is unavailable, while the note says a turned-down loop gets no run. Commit `73d98332fff08fc272162e870897ffc568d5325f`; current fallback and packet explanation: `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4602-4625`, `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:298`; contradicted note: `.skilled/changelog/skilled/v4.2.0.0.md:506`.
13. **DRIFT | P2 — The Bladebro upgrade command omits required install hardening.** The note says `npm install -g bladebro@4.8.2`; the current guide requires `--ignore-scripts` and digest verification before first run. The note command was added by `c7f38f295d282f34efc292a7bc611c2019fb489e`; current guide and wrapper: `.skilled/skills/mcp-browser-use/mcp-bladebro/mcp-servers/bladebro-cli/README.md:24-27,50-58`, `.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh:147-173`; installer posture was added in `ec3ed74ad01edad7311aadfe7a117d4010b10919`; contradicted note: `.skilled/changelog/skilled/v4.2.0.0.md:906`. This establishes that the published instruction is lower assurance; it does not establish that the pinned package contains a malicious payload.

## 6. Bugs

14. **BUG | P2 — The reserved `root/skilled` path guard is case-sensitive.** A path such as `root/Skilled/...` passes the guard and aliases the reserved path on a case-insensitive filesystem. Commit `5913aebc267b50c4cdb1ccc0ddf6441ae3e53639`; current checks: `.skilled/commands/doctor/scripts/overlay-engine.cjs:4160-4164,4533-4535`; related note: `.skilled/changelog/skilled/v4.2.0.0.md:546`.
15. **BUG | P2 — `worktree-naming.sh` lost its executable mode.** Commit `957f47570f381cfc42c2d90d151771dfe695647e` changes Git mode from `100755` to `100644`; direct execution fails, although explicit `bash script` examples still work. Current script and usage contract: `.skilled/skills/sk-git/scripts/worktree-naming.sh:1`, `.skilled/skills/sk-git/scripts/README.md:17`, `.skilled/skills/sk-git/SKILL.md:146`; related upgrade note: `.skilled/changelog/skilled/v4.2.0.0.md:915`. How often users invoke the shorthand directly is unconfirmed.

## 7. Release-Note Section Cross-Check

- **Deep Loop / Fan-Out Runs:** three omissions confirmed (findings 1-3).
- **Dispatch and Safety:** no separate discrepancy was confirmed in the inspected claims; the documented setup refusal and fan-out failure exit cases matched the checked code.
- **Skill Advisor:** one behavioral omission and one Python-fallback drift confirmed (findings 9 and 12). The packet describes residual probe lifts, so the landed anchor change should not be represented as eliminating every false lift.
- **Installs and Overlays:** one output-format omission and one path-case bug confirmed (findings 4 and 14).
- **OpenCode:** no current discrepancy was confirmed in the inspected setup, resolver, plugin-builder, shell-shim, or battery claims.
- **Browser Use:** two hub-routing omissions and one Bladebro install drift confirmed (findings 7, 8, 13).
- **Skills and Worktrees:** linked-worktree handover, graph-database provisioning, and the executable-mode bug are confirmed (findings 5, 6, 15).
- **How It Was Checked:** the listed suite totals are historical run results; this read-only audit did not rerun them or establish that those historical results are false.
- **Upgrade Notes:** the Bladebro command and direct script invocation have the drift/bug described in findings 13 and 15.
- The component list at line 823 is not treated as a description of the decision-capture or playbook behaviors in findings 10-11.

## 8. Recent-Packet Reconciliation

Confirmed recent-packet coverage gaps or differences include:

- `specs/system-skill-advisor/routing-and-scoring/014-lexical-anchor-narrowing` — lexical anchor rule omitted (finding 9).
- `specs/hooks-plugins-extensions/decision-capture/001-decision-capture` — Stop auto-record omitted (finding 10).
- `specs/sk-doc/authoring-modes-and-playbooks/007-playbook-run-recording` — recorder and results contract omitted (finding 11).
- `specs/sk-git/worktree-lifecycle/008-provision-skill-graph-database` — provisioning behavior omitted (finding 6).
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` — Python fallback differs from the note (finding 12).
- `specs/hooks-plugins-extensions/session-handover/002-session-handover-loop` — linked-worktree handover omitted (finding 5).
- `specs/system-skilled-doctor/007-overlay-framework-root-layout` — JSON formatting change omitted and path-case guard defect found (findings 4, 14).
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` — two routing behaviors omitted (findings 7-8).

These are confirmed examples, not a finding that all 21 packet roots were compared feature by feature. Feature-level coverage remains unconfirmed for at least the sk-doc readability, hub-routing, and changelog-system packets; advisor Pi integration; alignment-lane runner; system-deep-loop README alignment; and mcp-code-mode. The source inventory is `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/scratch/recent-packets.txt:5-7,11,14,18,21`.

## 9. Cross-Link and Path Checks

The local Markdown-link scan of `.skilled/changelog/skilled/v4.2.0.0.md` found zero missing local files or anchors. The path check is limited to Markdown links in that file; it does not prove arbitrary filesystem references, commands, or external links work. The executable-mode defect in finding 15 is a verified direct-invocation failure rather than a broken Markdown link.

## 10. Recommendations

1. Add concise aggregate-note entries for the eleven missing behaviors, preserving the conditions and limitations recorded in the findings.
2. Replace the Bladebro install command with the current `--ignore-scripts` and digest-verification procedure.
3. Restore the executable mode on `worktree-naming.sh` and make the reserved-path comparison case-insensitive before the next release.
4. Keep the Python fallback exception explicit in the advisor documentation so a typed command is not described as a blanket refusal.
5. Continue a feature-level comparison of the unconfirmed recent packets and review the remaining commit-window changes before claiming full release-note coverage.

## 11. Audit Limits

This pass focused on the requested release-note sections and packet summaries, then traced representative shipped changes to current code and docs. It did not perform a line-by-line semantic review of all 1,084 commits. The suite totals and live-run statements were not rerun; the 14-skill count, dependency-walk description, package-lock counts, and inspected upgrade paths matched current evidence. No P0/P1 issue was established. No security payload was established for the Bladebro package.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Treat the review `frontier_drained` note as a contradiction | It accurately describes review; the separate research-lineage stop is missing from the notes. | `.skilled/changelog/skilled/v4.2.0.0.md:179`; `.skilled/commands/deep/assets/deep-research.yaml:1132`; iteration 1 | 1 |
| Continue searching only inside the skill packet after the first scoped diff | The relevant frontier change was in workflow/runtime files; the full commit diff found it. | Iteration 1 commit-diff follow-up | 1 |
| Treat finished-lineage refusal as contradicted by unreadable executable handling | The existing refusal claim remains true; the new unknown-identity fallback is a narrower omission. | `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3506-3517`; note `:294`; iteration 2 | 2 |
| Treat the timestamp/retry evidence change as a separate release-note omission | It refines the flagged-pass feature already covered at note line 281. | Commit `0fde65e7b6989905abfc4498319d33058e62aad6`; iteration 2 | 2 |
| Count direct salvage-event JSONL append as a window change | Blame places it in June 2026, before the release window. | Iteration 2 blame check | 2 |
| Treat inspected overlay claims as additional drift | The sibling-folder, rollback, layout-link, README, cache, refusal, and release-base claims matched their inspected owners; the separate formatting omission and case guard are reported. | Iteration 5 | 5 |
| Treat inspected OpenCode setup/resolver/plugin/shell/battery claims as drift or bug | The checked current owners matched the release-note claims. | Iteration 6 | 6 |
| Add the Core Web Vitals advisor-discovery cue as another omission | The general routing cue already appears in the Browser Use note; this pass confirmed no separate gap for that cue. | `.skilled/changelog/skilled/v4.2.0.0.md:697`; iteration 7 | 7 |
| Treat the 14-skill count or nearest-lockfile provisioning description as drift | Both matched the current inventory/provisioner; the separate graph-database provisioning behavior is missing. | `.skilled/changelog/skilled/v4.2.0.0.md:736,744-748`; iteration 8 | 8 |
| Treat graph-scan provisioning as a current bug | The inspected path showed no current defect; the confirmed issue is its note omission. | `.skilled/skills/sk-git/scripts/worktree-naming.sh:796-818`; iteration 8 | 8 |
| Treat the package-lock dependency totals as stale | The 111 advisor and 313 system-spec-kit dependency counts matched when root packages are excluded. | Iteration 9 lockfile count check | 9 |
| Treat the documented upgrade paths or 14-skill count as stale | The inspected paths and top-level skill manifests matched. | Iteration 8-9 current path/inventory checks | 8-9 |
| Claim How It Was Checked totals are false | They describe historical runs; this audit did not rerun them. | `.skilled/changelog/skilled/v4.2.0.0.md:752-755`; iteration 9 | 9 |
| Claim the local release-note Markdown links contain broken targets | The static scan returned zero missing local files or anchors; arbitrary paths remain outside this check. | Iteration 10 local link scan | 10 |
| Claim the full 1,084 commits and all 21 packet features were reviewed line by line | The evidence does not support that completeness claim; unresolved packet work is listed above. | `scratch/window-commits.txt`; `scratch/recent-packets.txt:1-22`; iteration 10 | 10 |

## Divergence Map

The reducer registry contains 15 key findings and four open key questions. The lineage coverage graph remained empty: the graph upsert reported no finding derived because there were no matching question nodes or answers. The final convergence check therefore had no graph evidence or source-diversity pass, no graph pivots, no overrides, and zero graph nodes/edges. The max-iteration cap, not convergence, ended the loop.

## 12. Open Questions and Residual Gaps

All four strategy questions remain globally open (0 answered of 4):

1. Which commits in the window change user-visible behavior with no entry in the notes across all listed sections?
2. Which of the 21 recent packets shipped uncovered or differently described work?
3. Which concrete release-note claims no longer match HEAD?
4. Which window changes introduced a bug, dead reference, or broken cross-link?

The 15 findings are confirmed instances, not proof that the lists are exhaustive. In particular, feature-level checks remain open for the packets identified in Section 8, and the local link scan does not cover arbitrary path references.

## 13. Implementation Handoff

This lineage supplies evidence for the release-note and code owners; it does not change source code or the aggregate changelog. The release owner can use findings 1-15 to amend the notes and route the two code defects and install-command drift to their owning components. A follow-up audit should continue from the unconfirmed packet list and the original commit window.

## 14. Verification Matrix

| Check | Result |
|---|---|
| Iteration narratives | Iterations 1-10 recorded; iteration 10 contains all required sections and three cited findings. |
| State writes | Iteration 10 went through `append-mode-event.cjs`; receipt sequence 22, exit 0. The gateway refreshed the state projection. |
| Reducer | Post-iteration reducer reported `iterationsCompleted: 10` and `corruptionCount: 0`. |
| Delta | Iteration 10 delta contains one iteration row and three finding rows; `findingsCount` is 3. |
| Finding citations | All 15 findings cite an introducing commit, current source line(s), and the related aggregate-note line(s). |
| Markdown links | Local Markdown scan reported zero missing targets in the release-note document. |
| Tests and strict validator | Not run; this was a read-only release audit, and the dispatch explicitly excluded `validate.sh` and repository writes. |

## 15. References

- Aggregate release notes: `.skilled/changelog/skilled/v4.2.0.0.md:1-926`.
- Commit window: `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/scratch/window-commits.txt`.
- Recent packet inventory: `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/scratch/recent-packets.txt:1-22`.
- Iteration evidence: `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/lineages/codex/iterations/iteration-001.md` through `iteration-010.md`.
- Structured deltas: `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/lineages/codex/deltas/iter-001.jsonl` through `iter-010.jsonl`.
- State and registry: `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/lineages/codex/deep-research-state.jsonl`, `findings-registry.json`, and `deep-research-strategy.md`.

## 16. Convergence Report

- Stop reason: `maxIterationsReached`.
- Total iterations: 10.
- Questions answered: 0 / 4.
- Remaining questions: all four strategy questions.
- Last iteration summaries: run 8 Skills and Worktrees (1.0); run 9 Verification and Upgrade Notes (1.0); run 10 final packet/link cross-check (1.0).
- Convergence threshold: 0.05.
- Graph summary: empty graph; no pivots or overrides recorded. Source-diversity guard remained insufficient. This report does not claim topic convergence.

## 17. Execution Audit

The final iteration, delta, state event, synthesis output, and gateway-staged terminal event are kept inside the Codex lineage directory. The workflow closeout's default `mktemp` event directory would write outside the supplied write surface; the closeout will use the existing packet-local `.events` directory instead. The packet config remains `status: initialized` because the deep-research leaf contract makes `deep-research-config.json` read-only; the config-status mutation is therefore not performed. The parent spec and root research packet were not written. No tests, validator, git write, or source change was performed.
