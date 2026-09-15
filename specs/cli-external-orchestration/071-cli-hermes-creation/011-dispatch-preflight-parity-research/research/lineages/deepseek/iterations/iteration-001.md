---
title: "Iteration 1: Severity Audit Across All Seven cli-* hard_rules"
trigger_phrases: []
---
# Iteration 1: Severity Audit Across All Seven cli-* hard_rules

## Focus
Inventory every `hard_rules:` entry across the seven `cli-*` skills with its declared severity and whether its check can actually detect the violation; recommend a severity per rule; judge whether the two skills with no `error` rule (cli-claude-code, cli-opencode) are correct or an oversight.

## Findings

1. **Severity mapping is fixed and narrow**: `evaluate()` treats `severity === 'block' || severity === 'error'` as blocking and *everything else* — including a missing severity — as advisory (`warn`). A `warn` rule can never deny a dispatch. [SOURCE: .opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs:240-253]

2. **Full inventory: 23 rule declarations across 7 skills — 7 at `error`, 16 at `warn`.** Per skill: cli-claude-code 2/0, cli-codex 2/1, cli-cursor 2/1, cli-devin 2/1, cli-hermes 8/3, cli-opencode 5/0, cli-pi 2/1 (declared/error). [SOURCE: .opencode/skills/cli-external-orchestration/cli-claude-code/SKILL.md:6-14] [SOURCE: cli-codex/SKILL.md:6-14] [SOURCE: cli-cursor/SKILL.md:6-14] [SOURCE: cli-devin/SKILL.md:6-14] [SOURCE: cli-hermes/SKILL.md:6-38] [SOURCE: cli-opencode/SKILL.md:6-26] [SOURCE: cli-pi/SKILL.md:6-14]

### Severity table (recommendation per rule)

| # | Skill | Rule id | Check | Declared | Detects from command string? | Recommended | Reason |
|---|-------|---------|-------|----------|------------------------------|-------------|--------|
| 1 | claude-code | stdin-redirect-required | stdin-redirect-required | warn | yes (`claude -p/--print` shapes, line 81) | **error** | Violation hangs with zero output — indistinguishable from a slow model; deterministic from the command string. |
| 2 | claude-code | non-interactive-permission-mode-risk | non-interactive-permission-mode-risk | warn | partial — fires whenever the bypass flag is absent, whether or not a shell prompt exists | warn (refine predicate) | Check cannot verify the message's second safe path ("prompt needs no shell approval"); high false-positive advisory. Deadlock class is real but not command-detectable. |
| 3 | codex | stdin-redirect-required | stdin-redirect-required | warn | yes | **error** | Same silent-hang class. |
| 4 | codex | codex-availability-required | command-v-codex-required | error | yes (PATH probe; fail-open without PATH) | error (keep) | Correct as declared. |
| 5 | cursor | stdin-redirect-required | stdin-redirect-required | warn | yes | **error** | Same silent-hang class. |
| 6 | cursor | cursor-availability-required | command-v-cursor-agent-required | error | yes | error (keep) | Correct as declared. |
| 7 | devin | stdin-redirect-required | stdin-redirect-required | warn | yes | **error** | Same silent-hang class. |
| 8 | devin | devin-availability-required | command-v-devin-required | error | yes | error (keep) | Correct as declared. |
| 9 | hermes | stdin-redirect-required | stdin-redirect-required | warn | yes (`hermes chat` + query flag, line 87-88) | **error** | Same silent-hang class. |
| 10 | hermes | hermes-availability-required | command-v-hermes-required | error | yes | error (keep) | Correct as declared. |
| 11 | hermes | yolo-required-for-writes | hermes-yolo-required-for-writes | error | partial — write-toolset regex covers `terminal\|coding\|code_execution\|browser`; undocumented names (e.g. `shell`) pass | error (keep; widen roster after confirmation) | A flagged step silently fails the leaf mid-task. |
| 12 | hermes | ignore-rules-required | hermes-ignore-rules-required | warn | yes but exemption is false (line 184-186) | **error after exemption removal** | Missing flag injects SOUL.md, memories, session search into the leaf; silent context bleed. `-s` exemption disproved by A/B (starting fact 4). |
| 13 | hermes | explicit-toolsets-required | hermes-explicit-toolsets-required | warn | partial — does not require `file` (line 189-194) | **error after check fix** | `-t search,todo` passes and then the leaf cannot read a file, exiting 0 with empty stdout (starting fact 3; confirmed empirically below). |
| 14 | hermes | no-worktree-flag | hermes-no-worktree-flag | error | yes | error (keep) | Correct as declared. |
| 15 | hermes | mcp-config-operator-required | hermes-mcp-config-operator-required | warn | yes | **error** (medium confidence) | `hermes mcp add/remove` mutates user-level operator config from inside a leaf; blast radius survives the run. |
| 16 | hermes | hooks-user-level | hermes-hooks-user-level | warn | yes | warn (keep) / consider error | `--accept-hooks` blesses operator-declared shell hooks; unauthorized-action class, not silent-wrong-result. |
| 17 | opencode | stdin-redirect-required | stdin-redirect-required | warn | yes | **error** | Same silent-hang class. |
| 18 | opencode | explicit-model-required | explicit-model-required | warn | yes (line 148-151) | **error** | Without `-m` a 429 retries forever and emits NO output — silent by construction. |
| 19 | opencode | no-bare-agent-general | no-bare-agent-general | warn | partial — `--agent=general` slips the `\s+` predicate | warn (keep; fix predicate) | opencode rejects it loudly at run; not a silent failure. |
| 20 | opencode | command-flag-for-slash-prompt | command-flag-for-slash-prompt | warn | partial — unquoted slash prompts slip | **error after predicate fix** | Slash text silently delivered as raw prose = wrong task executed, no error. |
| 21 | opencode | share-requires-confirmation | share-requires-confirmation | warn | partial — `--share=value` slips | warn (keep) | Consent is a human step not visible in the command; flag for confirmation only. |
| 22 | pi | stdin-redirect-required | stdin-redirect-required | warn | yes | **error** | Same silent-hang class. |
| 23 | pi | pi-availability-required | command-v-pi-required | error | yes | error (keep) | Correct as declared. |

3. **Zero-error skills are an oversight in both cases.** cli-claude-code declares 2 rules and cli-opencode 5, all `warn`. Neither declares an `error` rule; each contains at least one rule whose violation is a silent-hang or silent-wrong-result (stdin-redirect; explicit-model; command-flag). The zero-error posture is not a considered stance — cli-claude-code's sibling availability rules that its peers mark `error` are simply absent (finding 6). [SOURCE: cli-claude-code/SKILL.md:6-14] [SOURCE: cli-opencode/SKILL.md:6-26]

4. **`stdin-redirect-required` is the single highest-value severity flip: 7 identical warn declarations, one deterministic check.** All seven skills declare it; the check recognizes every documented headless shape (`opencode run`, `pi -p/--print`, `claude -p/--print`, `codex exec`, `devin -p`, `cursor-agent -p`, `hermes chat` + query flag, `hermes -z`) and passes on redirect, heredoc, herestring, or an upstream pipe. Flipping the seven declarations to `error` converts the largest class of silent hangs into refusals with no check code change. [SOURCE: dispatch-rule-checks.mjs:72-89, 136-144]

5. **Empirical detectability probes (run against the live registry, 2026-09-15):** confirmed fires: `claude --print "x"` → stdin violation; `hermes chat -q "x"` → stdin violation; `pi --print "x"` → stdin violation; `--agent general` → fires; quoted `"/memory:search q"` → fires; `-t terminal` without `--yolo` → fires; `claude -p "x" </dev/null` → permission-mode fires. Confirmed silent passes: `hermes chat "x"` (no query flag → not a headless shape), `--agent=general`, `--share=public`, unquoted `/memory:search q`, `hermes chat -q x -t search,todo` (no `file` — defect 3), `hermes chat -q x -s cli-hermes -t file,todo` (false exemption — defect 4), `-t shell` without `--yolo`. [SOURCE: dispatch-rule-checks.mjs:133-209; probe command `node --input-type=module -e "import {CHECKS} ..."` executed 2026-09-15]

6. **Availability coverage is inconsistent across skills.** Five skills carry an availability rule at `error` (codex, cursor, devin, hermes, pi); claude-code and opencode carry none, and the registry implements no `command-v-claude-required` / `command-v-opencode-required` check. The registry's own comment states the fail-open rationale for availability probing, so the gap is a coverage decision, not a technical limit. [SOURCE: dispatch-rule-checks.mjs:115-131, 166-170] [SOURCE: cli-codex/SKILL.md:11-14 vs cli-claude-code/SKILL.md:6-14]

7. **Documentation drift already present**: the dispatch README still says "The five checks currently registered" and lists only five, while `CHECKS` exports 17 (five availability checks added since). A severity audit done from the README would be wrong. [SOURCE: .opencode/hooks/dispatch/README.md §2 table vs dispatch-rule-checks.mjs:133-209]

## Ruled Out
- Re-deriving the eight confirmed starting facts (severity mapping, the three-blocking-hermes-rules count, the two hermes defects, the AGENTS.md joiner, Cursor/OpenCode audit-only, fanout persona gap): the charter declares them given, and iteration 1 confirms them in passing rather than treating them as new. [INFERENCE: charter "Confirmed starting facts, not to be re-derived" section]
- Flipping every `warn` to `error`: `share-requires-confirmation` asks for consent that the command string cannot express, and `non-interactive-permission-mode-risk`'s predicate is a proxy that would produce false refusals at `error`. Severity should track the failure class, not the count of declared rules. [INFERENCE: messages at cli-opencode/SKILL.md:23-25 and cli-claude-code/SKILL.md:11-13]

## Dead Ends
- Reading `hard_rules` severity from the README's check list: the README documents 5 of 17 checks and none of the severities; superseded by reading the SKILL.md frontmatter directly. [SOURCE: .opencode/hooks/dispatch/README.md §2]

## Edge Cases
- Contradictory evidence: none for the inventory. One inferred gap: `HERMES_WRITE_TOOLSETS` covers `terminal|coding|code_execution|browser`; whether Hermes accepts any other write-capable toolset name (e.g. `shell`) is unverified — an unknown toolset name may itself be rejected loudly, which would lower the risk. [SOURCE: dispatch-rule-checks.mjs:98]
- Partial success: detectability was probed for 14 command shapes; the probes cover every check in the registry except the five availability checks (PATH-dependent, covered by their unit test). [SOURCE: dispatch-rule-checks.test.mjs:63-77]
- Missing dependencies: none; the rule engine is dependency-free by design. [SOURCE: dispatch-rule-checks.mjs:1-7]

## Sources Consulted
- .opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs
- .opencode/hooks/dispatch/lib/dispatch-rule-checks.test.mjs
- .opencode/hooks/dispatch/README.md
- .opencode/skills/cli-external-orchestration/cli-claude-code/SKILL.md
- .opencode/skills/cli-external-orchestration/cli-codex/SKILL.md
- .opencode/skills/cli-external-orchestration/cli-cursor/SKILL.md
- .opencode/skills/cli-external-orchestration/cli-devin/SKILL.md
- .opencode/skills/cli-external-orchestration/cli-hermes/SKILL.md
- .opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md
- .opencode/skills/cli-external-orchestration/cli-pi/SKILL.md
