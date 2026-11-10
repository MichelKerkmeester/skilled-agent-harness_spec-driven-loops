---
title: "Iteration 2: The False Preload Exemption and Every Artifact That Encodes It"
trigger_phrases: []
---
# Iteration 2: The False Preload Exemption and Every Artifact That Encodes It

## Focus
Trace every artifact that encodes the claim "`--ignore-rules` also suppresses the skill preload" — check, rule message, test, skill prose, references, playbook scenarios, upstream source — give the minimal correct change per artifact, the exact test case that must flip, and name any second rule resting on the same false premise.

## Findings

1. **The check itself**: `hermes-ignore-rules-required` passes a chat command when `--ignore-rules` is present **or** when `HERMES_SKILL_PRELOAD` matches `(?:^|\s)(?:-s|--skills)(?:\s+|=)\S+`. The supporting comment asserts "`--ignore-rules` also suppresses preloaded-skill injection, so a dispatch that preloads a project skill with `-s`/`--skills` is the one sanctioned shape that omits the flag." That is the false premise in code. Minimal change: delete the `|| HERMES_SKILL_PRELOAD.test(cmd)` clause at line 186 and the `HERMES_SKILL_PRELOAD` constant at line 101 with its comment at lines 99-101. [SOURCE: .opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs:99-101,184-186]

2. **The rule message** repeats the claim verbatim: "Every dispatch MUST pass `--ignore-rules`, except one that preloads a project skill with `-s`, because the flag also suppresses the preload." Minimal change: drop the two exception clauses; keep "Every dispatch MUST pass `--ignore-rules`" and the injection rationale ("Without it Hermes injects SOUL.md, its memories, session search and the CWD instruction files into the leaf prompt, bleeding prior sessions into the task"). The same message is duplicated into the generated mirror at `.hermes/skills/cli-hermes/SKILL.md:19-21`, which is produced by `sync-skills-hermes.cjs` — fix the canonical file, then regenerate; never hand-edit the mirror. [SOURCE: .opencode/skills/cli-external-orchestration/cli-hermes/SKILL.md:19-22] [SOURCE: .hermes/skills/cli-hermes/SKILL.md:19-21]

3. **The test pins the wrong behavior — this is the case that must flip.** Both assertions expect zero violations for a preloading dispatch that omits `--ignore-rules`:
   - line 118: `ids('hermes chat -Q --oneshot --query-file p.md -s cli-hermes --source tool -t file,todo')` must become `['ignore-rules-required']`
   - line 119: `ids('... --skills=cli-hermes -t file,todo')` must become `['ignore-rules-required']`
   The comment at lines 116-117 ("Preloading a project skill is the one shape that omits `--ignore-rules`, because the flag would suppress the preload") must be replaced with the A/B result: `-s` preload works under `--ignore-rules`, so the omitted flag is a violation. A positive case should be added — the line-112 `good` shape already proves a `-s`-free dispatch passes; add one with both `-s cli-hermes` and `--ignore-rules` expecting `[]`. Minimal change: flip two assertion arrays, replace one comment. [SOURCE: .opencode/hooks/dispatch/lib/dispatch-rule-checks.test.mjs:112-119]

4. **The upstream source of the claim** is Hermes's own live help as transcribed into the packet's flag table: `--ignore-rules | Skip AGENTS.md, SOUL.md, .cursorrules, memory and preloaded skills injection | live help`. Every downstream artifact inherits "preloaded skills injection" from this row. Minimal change: keep the row's flag name but correct the "preloaded skills injection" clause against the A/B, or annotate the row with the observed counterexample; the packet's other statement, "`--ignore-rules` removes SOUL.md, memories, session search and the CWD instruction files ... Every dispatch passes it" (cli-reference.md:88), is already correct and becomes consistent once the exemption is gone. [SOURCE: .opencode/skills/cli-external-orchestration/cli-hermes/references/cli-reference.md:50,88]

5. **The persona dispatch contract is the second dependent on the same premise.** `agent-delegation.md` documents the native-shaped persona dispatch as `-s agent-<name>` + `HERMES_AGENT_PERSONA=<name>` + `HERMES_ENABLE_PROJECT_PLUGINS=1`, and states "Because `-s` is in play, `--ignore-rules` is omitted (the packet's documented exception)." The playbook repeats it twice — `persona-via-agent-skill-and-plugin.md:46` ("`--ignore-rules` is omitted because `-s` is in play") and the HERMES-016 scenario, whose expected evidence explicitly includes "an explicit note that `--ignore-rules` was omitted from the preloaded run under the hard rule's `-s` exception", with the second-pass executed record calling the omission "the hard rule's own documented exception rather than a deviation". Minimal change: add `--ignore-rules` to every persona/preload command in these scenarios and replace the "documented exception" notes with the A/B result; the persona still arrives via `-s` (the plugin's `skill_view` fallback at `.hermes/plugins/repo-guards/__init__.py:697-708` covers the case where preload is stripped). [SOURCE: .opencode/skills/cli-external-orchestration/cli-hermes/references/agent-delegation.md:48] [SOURCE: .opencode/skills/cli-external-orchestration/cli-hermes/manual-testing-playbook/agent-routing/persona-via-agent-skill-and-plugin.md:46] [SOURCE: .opencode/skills/cli-external-orchestration/cli-hermes/manual-testing-playbook/skills-and-plugins/project-skill-preload.md:34,55,76,80]

6. **No second hard rule uses the premise — the enforcement site is singular.** `HERMES_SKILL_PRELOAD` appears at exactly two lines in the registry (definition at 101, single use at 186); no other check carries a preload carve-out, and sk-git's separate `hard_rules:` block (11 rules checked, all git-pathspec-shaped) is unrelated. The charter's question finds one rule in the registry, plus the persona contract in finding 5 as the second dependent artifact. [SOURCE: dispatch-rule-checks.mjs:99-101,184-186] [SOURCE: .opencode/skills/sk-git/SKILL.md:7-46]

7. **The skill body already contradicts the exemption.** Canonical SKILL.md:305 states "The dispatch carries `--yolo` exactly when it writes, `--ignore-rules` always, and an explicit toolset list", and the mirrored copy repeats it at line 310. The body prose therefore needs no edit after the fix; before the fix it is in direct conflict with the frontmatter message. Minimal change: none beyond regeneration. [SOURCE: .opencode/skills/cli-external-orchestration/cli-hermes/SKILL.md:305] [SOURCE: .hermes/skills/cli-hermes/SKILL.md:310]

8. **Provenance chain, cleanest form**: the false claim entered as a first-pass benchmark *observation* ("`--ignore-rules` suppresses preloaded-skill injection along with the rules files" — written as observed behavior, sourced from the live-help row), was "closed" in the second pass by carving the exception into the rule, and is now disproved by the commission-time A/B (preload answered under `--ignore-rules`; no preload without `-s`). The two benchmark reports are dated historical records; the living contract is the SKILL.md, the check, the test, the references, and the playbooks. Minimal change: leave the dated benchmark reports as history; fix the living surfaces. [SOURCE: .opencode/skills/cli-external-orchestration/cli-hermes/benchmark/reports/2026-09-14-phase-008-first-pass/findings-and-recommendations.md:29-34] [SOURCE: .../2026-09-14-phase-008-second-pass/findings-and-recommendations.md:31-34]

## Ruled Out
- Editing the generated mirror `.hermes/skills/cli-hermes/SKILL.md` directly: it is a sync artifact of the canonical SKILL.md; the repository's own docs describe regeneration through `sync-skills-hermes.cjs`, and hand-editing would be reverted by the next sync. [INFERENCE: based on SKILL.md:231 describing the mirror generator and .hermes/SYNC.md existing]
- Rewriting the dated benchmark reports: they record what was observed on 2026-09-14, and the second-pass "CLOSED" verdict is now known wrong. Correcting history obscures how the defect entered; the living contract is corrected instead. [INFERENCE: repo convention that reports are dated evidence]

## Dead Ends
- Searching for a second *registry check* on the preload premise: `HERMES_SKILL_PRELOAD` has a single use site; no sibling check (stdin/yolo/toolsets/worktree/mcp/hooks) references the preload or the suppression claim. [SOURCE: dispatch-rule-checks.mjs:133-209]

## Edge Cases
- Contradictory evidence: the playbook's executed second-pass record (project-skill-preload.md:80) treats the missing `--ignore-rules` as compliance evidence, while the A/B says the flag is compatible with `-s`. Both are model-observed; the A/B is the later, controlled comparison, so the executed record's *note* is corrected while its PASS verdict on preload content stands. [INFERENCE: based on starting fact 4 vs the executed record]
- Partial success: the A/B covered `-s cli-hermes` under `--ignore-rules` with `-t todo`; whether other preload forms (`--skills=` long form, multiple skills) behave identically is unverified but follows the same code path. [INFERENCE: based on `HERMES_SKILL_PRELOAD` regex matching both forms]
- Missing dependencies: none; the fix is a two-line check deletion plus doc/test edits.

## Sources Consulted
- .opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs
- .opencode/hooks/dispatch/lib/dispatch-rule-checks.test.mjs
- .opencode/skills/cli-external-orchestration/cli-hermes/SKILL.md
- .opencode/skills/cli-external-orchestration/cli-hermes/references/cli-reference.md
- .opencode/skills/cli-external-orchestration/cli-hermes/references/agent-delegation.md
- .opencode/skills/cli-external-orchestration/cli-hermes/references/integration-patterns.md
- .opencode/skills/cli-external-orchestration/cli-hermes/manual-testing-playbook/skills-and-plugins/project-skill-preload.md
- .opencode/skills/cli-external-orchestration/cli-hermes/manual-testing-playbook/agent-routing/persona-via-agent-skill-and-plugin.md
- .opencode/skills/cli-external-orchestration/cli-hermes/benchmark/reports/2026-09-14-phase-008-first-pass/findings-and-recommendations.md
- .opencode/skills/cli-external-orchestration/cli-hermes/benchmark/reports/2026-09-14-phase-008-second-pass/findings-and-recommendations.md
- .opencode/skills/sk-git/SKILL.md (second hard_rules block, checked for the second premise — unrelated)
- .hermes/plugins/repo-guards/__init__.py
- .hermes/skills/cli-hermes/SKILL.md (generated mirror)
