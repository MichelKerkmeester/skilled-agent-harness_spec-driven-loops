# Alignment report: worktrees/474-advisor-pasted-context-and-crash-fallback

Report-only run: every check ran in its read-only form, and this command writes only into its run folder.

## Scope

- Kind: branch, file set first-parent
- Target: `worktrees/474-advisor-pasted-context-and-crash-fallback`, base `4bf79332378`
- Commits: `538d2f789ecfdc2ce162396cd96c7a4c2edeffe4` to `4d65eced09eff82336f470b8b18aa22935f84295`, 20 first-parent commits
- Files: 220, of which 0 uncommitted or untracked
- Owners: 4
- Findings: 25 (P0 1, P1 9, P2 15), 5 literal, 0 inferred, 9 outside the scope; 2 more overturned by the critic and not counted
- Open findings: 25 (0 handed off, 0 rebutted)
- Lanes: A, B, C, D
- Fix plan: [fix-plan.md](fix-plan.md)

## Surfaces

| Surface | Title | Fired | Files | Checks |
|---|---|---|---|---|
| S1 | Code aligns with sk-code | yes | 26 | 3 |
| S2 | Skill docs match sk-create-skill | yes | 8 | 7 |
| S3 | Feature catalog entries | yes | 34 | 1 |
| S4 | Playbooks match sk-create-manual-testing-playbook | yes | 34 | 2 |
| S5 | READMEs match sk-create-readme, root included | yes | 34 | 3 |
| S6 | Changelogs updated or created | yes | 33 | 1 |
| S7 | Skill routing is right | yes | 33 | 6 |
| S8 | Skill integrated in system-skill-advisor | yes | 33 | 1 |
| S9 | Commands aligned | no | 0 | 3 |
| S10 | Agents aligned | no | 0 | 1 |
| S11 | Runtime mirrors | no | 0 | 7 |
| S12 | AGENTS.md and repo rules | no | 0 | 2 |
| S13 | Env docs list every operator-settable variable | yes | 27 | 1 |
| S14 | Spec packets validate (changed-packet-validation replay) | yes | 68 | 1 |
| S15 | CI parity | yes | 0 | 21 |

## Battery

pass 51, fail 2, cannot run 0, not applicable 8

Grading: P0 when a CI step in a workflow that fires for the scope runs the same command; P1 for a skill package gate; P2 otherwise.

Failures are not compared against the scope's start point in this version, so a failing row may be debt that predates the scope. Re-running a check at the start point needs a second checkout, which a report-only run does not create.

| Status | Severity | CI-gated | Check | Exit | ms |
|---|---|---|---|---|---|
| pass | P2 | no | `S1-quality-gate` | 0 | 1265 |
| pass | P0 | yes | `S1-comment-hygiene` | 0 | 433 |
| not_applicable | P2 | no | `S1-package-check` | - | 0 |
| pass | P1 | no | `S2-skill-package:.skilled/skills/system-skill-advisor` | 0 | 521 |
| pass | P2 | no | `S2-quick-validate:.skilled/skills/system-skill-advisor` | 0 | 51 |
| pass | P0 | yes | `S2-skill-root-metadata` | 0 | 5452 |
| pass | P0 | yes | `S2-skill-derived-freshness` | 0 | 32 |
| pass | P0 | yes | `S2-leaf-manifest-freshness` | 0 | 5406 |
| pass | P2 | no | `S2-frontmatter-version:.skilled/skills/system-skill-advisor` | 0 | 65 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md` | 0 | 187 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-skill-advisor/runtime/tests/fixtures/README.md` | 0 | 62 |
| pass | P2 | no | `S2-validate-document:.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | 0 | 197 |
| pass | P0 | yes | `S3-catalog-package` | 0 | 946 |
| pass | P0 | yes | `S4-playbook-package:.skilled/skills/system-skill-advisor` | 0 | 95 |
| not_applicable | P2 | no | `S4-playbook-topology` | - | 0 |
| pass | P2 | no | `S5-audit-readmes` | 0 | 58637 |
| fail | P2 | no | `S5-derived-counts` | 1 | 98 |
| pass | P2 | no | `S5-readme-references` | 0 | 1581 |
| pass | P2 | no | `S6-release-coverage` | 0 | 42 |
| pass | P0 | yes | `S7-skill-graph-freshness` | 0 | 33 |
| not_applicable | P2 | no | `S7-parent-skill-check` | - | 0 |
| not_applicable | P2 | no | `S7-router-intent-signals` | - | 0 |
| not_applicable | P2 | no | `S7-router-vocabulary-reach` | - | 0 |
| pass | P0 | yes | `S7-compiled-route-guard` | 0 | 96 |
| pass | P0 | yes | `S7-compiled-route-admission` | 0 | 207 |
| pass | P2 | no | `S8-advisor-status` | 0 | 113 |
| pass | P2 | no | `S13-env-tokens` | 0 | 116 |
| pass | P0 | yes | `S14-packet-validate:specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement` | 0 | 1601 |
| fail | P0 | yes | `S14-packet-validate:specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement` | 1 | 2797 |
| pass | P0 | yes | `S14-packet-validate:specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/002-pasted-context-stripping` | 0 | 1776 |
| pass | P0 | yes | `S14-packet-validate:specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/003-follow-up-routing-benchmark` | 0 | 1775 |
| pass | P0 | yes | `S14-packet-validate:specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/004-crash-path-fallback` | 0 | 1638 |
| pass | P0 | yes | `S14-packet-validate:specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/006-strip-rule-boundary-edges` | 0 | 1638 |
| pass | P0 | yes | `S14-packet-validate:specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/007-python-scorer-strip-parity` | 0 | 1547 |
| pass | P0 | yes | `S14-packet-validate:specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/008-handler-scored-prompt-consumers` | 0 | 1556 |
| pass | P0 | yes | `S14-packet-validate:specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/009-crash-fallback-edge-cases` | 0 | 1556 |
| pass | P0 | yes | `S14-packet-validate:specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/010-route-receipts-research` | 0 | 2816 |
| pass | P0 | yes | `S14-packet-validate:specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/011-route-receipts-build` | 0 | 1638 |
| pass | P0 | yes | `S14-packet-validate:specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/012-plan-text-and-goal-closeout` | 0 | 1682 |
| pass | P0 | yes | `S14-packet-validate:specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/013-drift-guard-probe-script-errors` | 0 | 1667 |
| not_applicable | P2 | no | `S15-workflow-shape` | - | 0 |
| pass | P2 | no | `S15-workflow-select` | 0 | 0 |
| pass | P2 | no | `S15-ci-report` | 0 | 102 |
| not_applicable | P2 | no | `S15-ci-contract-drift` | - | 0 |
| pass | P0 | yes | `S15-ci-divergence-ratchet` | 0 | 6541 |
| pass | P0 | yes | `S15-ci-routing-drift-guard` | 0 | 1220 |
| pass | P0 | yes | `S15-ci-deep-loop-admission` | 0 | 51 |
| pass | P0 | yes | `S15-ci-skill-graph-compiler` | 0 | 51 |
| pass | P0 | yes | `S15-ci-router-intent-signals` | 0 | 32 |
| not_applicable | P2 | no | `S15-ci-no-spec-imports` | - | 0 |
| pass | P0 | yes | `S15-ci-message-contract` | 0 | 1839 |
| pass | P0 | yes | `S15-ci-gate-inputs` | 0 | 566 |
| pass | P0 | yes | `S15-ci-rule-canary` | 0 | 36 |
| pass | P0 | yes | `S15-ci-prompt-card-sync` | 0 | 197 |
| pass | P0 | yes | `S15-ci-skill-doc-frontmatter` | 0 | 47 |
| pass | P0 | yes | `S15-ci-markdown-links` | 0 | 1918 |
| pass | P0 | yes | `S15-ci-dispatch-rules` | 0 | 3608 |
| pass | P0 | yes | `S15-ci-command-tree-parity` | 0 | 353 |
| pass | P0 | yes | `S15-ci-playbook-operator-contract` | 0 | 1640 |
| pass | P0 | yes | `S15-ci-catalog-fixtures` | 0 | 500 |
| pass | P0 | yes | `S15-ci-agent-mirror-sync` | 0 | 128 |

## Checks that could not run

None.

## CI workflows this scope triggers

- `advisory-checks.yml`: push: no path filter
- `agent-mirror-sync.yml`: pull_request: paths match .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md
- `changed-packet-validation.yml`: push: no path filter
- `command-tree-parity.yml`: pull_request: paths match .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md
- `comment-hygiene.yml`: pull_request: no path filter
- `dependabot-auto-merge.yml`: pull_request: no path filter
- `dispatch-enforcement-guard.yml`: pull_request: no path filter
- `gate-inputs.yml`: push: no path filter
- `hook-vitest-suites.yml`: pull_request: no path filter
- `markdown-link-integrity.yml`: pull_request: paths match .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts
- `message-contract.yml`: push: no path filter
- `naming-standard-guard.yml`: pull_request: no path filter
- `opencode-plugin-tests.yml`: pull_request: paths match .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts
- `playbook-operator-contract.yml`: pull_request: no path filter
- `prompt-card-sync.yml`: pull_request: no path filter
- `routing-registry-drift.yml`: push: paths match .skilled/skills/system-skill-advisor/runtime/bench/scorer-calibration-baseline.json
- `rule-canary-sync.yml`: pull_request: no path filter
- `sk-doc-script-tests.yml`: pull_request: no path filter
- `skill-advisor-stress.yml`: pull_request: paths match .skilled/skills/system-skill-advisor/runtime/bench/scorer-calibration-baseline.json
- `skill-doc-frontmatter.yml`: pull_request: paths match .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md
- `spec-kit-check.yml`: push: paths match .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md
- `trigger-index-rebuild.yml`: push: no path filter

## Findings by surface

### S1 Code aligns with sk-code

- **A3** P2 judgment `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:411`: Every briefed turn now pays one extra durable-clock read on the user's prompt path: recordRouteReceipt calls directiveLifecycleStore.clock(sessionId) here, and applyDirectiveLifecycle (line 607) then asks the same file-backed store once more through decideDirectiveLifecycleDelivery's evaluate call. Measured on this checkout with the real file store, one clock() call is a helper spawn costing 35-46...
  - Evidence: `cd .skilled/skills/system-skill-advisor/runtime && node --input-type=module -e 'const lc=await import("./dist/hooks/lib/directive-lifecycle.js"); const store=lc.defaultDirectiveLifecycleStore(); for (...` exit 0: first 45.9ms clock second 35.2ms clock third 34.7ms clock
- **A4** P2 judgment `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:441`: The confirmed-session rule this change depends on is now written three times in one file: deliveryStateOptionsFor at line 267 (input.session_identity_confirmed ?? hasSessionId), the new receiptSessionId at lines 336-343, and the extracted applyDirectiveLifecycle at line 441. The transcript-size read is duplicated the same way, by the new transcriptBytesFor at line 345 and the inline statSync block...
  - Evidence: `grep -n "session_identity_confirmed\|statSync(transcriptPath)\|function transcriptBytesFor\|function receiptSessionId" .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` exit 0: ...udeUserPromptSubmitInput): string | null { 340: const confirmed = input.session_identity_confirmed 345:function transcriptBytesFor(input: ClaudeUserPromptSubmitInput): number | null { 441: const sessionConfirmed = input.session_identity_confirmed 449: transcriptBytes = statSync(transcriptPath).size;

### S2 Skill docs match sk-create-skill

- **B-01** P1 judgment `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:55`: The branch ships two user-visible capabilities and this reference describes neither. `stripLeadingPastedReply` (feat 6c4af5fb5e) rewrites the prompt in `hooks/lib/skill-advisor-cli-fallback.ts` and again in `runtime/lib/scorer/fusion.ts`; the route-receipt guard (feat c27addb71) can replace a turn's brief with `skippedWeakFollowUpResult()` and persists a receipt under `$TMPDIR/speckit-advisor/rout...
  - Evidence: `rg -n -i "pasted|route receipt|route-receipt|weak follow" .skilled/skills/system-skill-advisor --glob '*.md' --glob '!**/node_modules/**' --glob '!**/changelog/**' --glob '!**/tests/**'` exit 1: 

### S5 READMEs match sk-create-readme, root included

- **C-01** P1 literal `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:67`: The Claude row of the runtime table still says the handler shows `{}` 'on error'. The catch block now returns `renderAdvisorTimeoutFallback` for a valid prompt whose processing throws (user-prompt-submit.ts:650), and section 2 of this same doc was updated by this change to say so (line 57). A reader debugging a crashed hook is told to expect no output while the runtime shows `Advisor: outage (...)...
  - Evidence: `grep -n "on error" .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md; grep -n "renderAdvisorTimeoutFallback(renderOptions)" .skilled/skills/system-skill-advisor/hooks/claude/user-prompt...` exit 0: ...`, the compiled adapter the runtime runs | [Claude source shim, compiled to `dist/`](../../system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts) | `Advisor:` text in `hookSpecificOutput.additionalContext`, or `{}` when disabled or on error. | 650: : renderAdvisorTimeoutFallback(renderOptions);
- **BAT-01** P2 judgment: S5-derived-counts failed (exit 1).
  - Evidence: `python3 .skilled/skills/sk-doc/sk-create-readme/scripts/check_derived_readme_counts.py .skilled/skills/system-skill-advisor/README.md README.md` exit 1: ...evin. Each write waits for its own approval. DSH loads Code Mode from a hand-written patch, and Mistral Vibe has no Code Mode registration. `/doctor:mcp debug` reports PASS, WARN or FAIL per check, and its fix mode adds guided repair. FAIL README.md: claims=1 failures=1 SUMMARY files=2 pass=1 fail=1
- **C-05** P2 literal `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/README.md:49`: The new fixture row names `legacy/advisor-prompt-policy.vitest.ts` and `python/test_skill_advisor.py`, which do not exist under tests/fixtures/; the repo's reference checker reports both on line 49. The row copied the file's existing style (lines 48 and 50 carry the same defect), so the file already failed at the base, but this change adds two instances. Prefixing both with `../` resolves them.
  - Evidence: `python3 .skilled/skills/sk-doc/sk-create-readme/scripts/check_readme_references.py .skilled/skills/system-skill-advisor/runtime/tests/fixtures/README.md` exit 1: ....vitest.ts': path does not exist line 49: inline 'python/test_skill_advisor.py': path does not exist line 50: inline 'handlers/advisor-recommend.vitest.ts': path does not exist FAIL .skilled/skills/system-skill-advisor/runtime/tests/fixtures/README.md: references=25 unresolved=5 examples=0 allowed=0

### S8 Skill integrated in system-skill-advisor

- **D-01** P1 literal `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:580`: The hook's skip gate still reads the raw prompt, so a pasted earlier reply that names a skill makes `skippedAdvisorResultFor` fire and the stripped weak task is scored. Case: `Earlier you replied: I updated the README with sk-doc conventions and committed it with sk-git. Now: update this file` — `shouldFireAdvisor('update this file')` is false (`below_prompt_policy_threshold`) and the task alone r...
  - Evidence: `node /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/local-skilled-alignment-scratch/20261119T054734Z/D/repro-policy-bypass.mjs` exit 0: ...s: sk-doc 0.82/0.34 vs sk-code 0.82/0.26 pass."} {"prompt":"update this file","taskPolicy":{"fire":false,"reason":"below_prompt_policy_threshold","canonicalPrompt":"update this file","meaningfulTokenCount":2,"visibleCharCount":16,"metalinguisticMentions":[]},"contextHead":"Advisor: prompt skipped."}
- **PRB-01** P1 judgment: Probe P02 "add a regression test for the route receipt that holds a weak follow-up to the session route" expected system-skill-advisor; top-1 was sk-code.
  - Evidence: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"add a regression test for the route receipt that holds a weak follow-up to the session route"}' --format json` exit 0: top-1 was sk-code
- **PRB-02** P1 judgment: Probe P03 "make the prompt hook print the outage line instead of nothing when it crashes" expected system-skill-advisor; top-1 was sk-prompt.
  - Evidence: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"make the prompt hook print the outage line instead of nothing when it crashes"}' --format json` exit 0: top-1 was sk-prompt
- **PRB-03** P1 judgment: Probe P04 "rotate the session lifecycle clock when dsh starts an agent or finishes compaction" expected system-skill-advisor; top-1 was cli-external-orchestration/cli-deepseek-harness.
  - Evidence: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"rotate the session lifecycle clock when dsh starts an agent or finishes compaction"}' --format json` exit 0: top-1 was cli-external-orchestration/cli-deepseek-harness
- **PRB-04** P1 judgment: Probe P05 "strip the pasted reply in the python scorer so it matches the native scorer" expected system-skill-advisor; top-1 was sk-code/sk-code-skilled.
  - Evidence: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"strip the pasted reply in the python scorer so it matches the native scorer"}' --format json` exit 0: top-1 was sk-code/sk-code-skilled
- **PRB-05** P1 judgment: Probe P06 "measure how many top-1 advisor routes pass only on the confidence floor" expected system-skill-advisor; top-1 was nothing.
  - Evidence: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"measure how many top-1 advisor routes pass only on the confidence floor"}' --format json` exit 0: top-1 was nothing

### S13 Env docs list every operator-settable variable

- **X-01** P2 judgment `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:159`: The change adds a second consumer of `SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR` without naming it in the variable's docs. `routeReceiptBaseDir` (`hooks/lib/route-receipt.ts:97-100`) resolves the new route-receipt store's base from `DIRECTIVE_LIFECYCLE_STATE_DIR_ENV`, and the store writes under `<base>/route-receipts` (`:76`, `:224-225`). The ENV-REFERENCE row still describes the variable as the 'priv...
  - Evidence: `grep -n 'DIRECTIVE_LIFECYCLE_STATE_DIR_ENV\|route-receipts\|this.dir = join' .skilled/skills/system-skill-advisor/hooks/lib/route-receipt.ts; grep -n 'SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR' .skilled/s...` exit 0: ...he directory-descriptor-anchored subprocess store. ... | `.skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-file-store.ts`, `directive-lifecycle-store.py` | .env.example:342:# SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR= # Override the directive-lifecycle private state root (temp default)

### S14 Spec packets validate (changed-packet-validation replay)

- **BAT-02** P0 judgment `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement`: S14-packet-validate failed for specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement (exit 1).
  - Evidence: `node .skilled/commands/assets/local-skilled-alignment/validate-packet.cjs specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-base...` exit 1: ...resh 'The skill advisor picks skills with a local five-lane FAIL specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement: error rules GENERATED_METADATA_DRIFT,GENERATED_METADATA_INTEGRITY (validate.sh exit 2)
  - CI runs this command: changed-packet-validation.yml > changed-packets > Validate the packets this PR changed
- **X-02** P2 judgment `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/description.json:3`: Pre-existing at the merge base, not introduced by this change, but it is the only reason the S14 parent row is red. The packet's `description.json` says 'Mine the pi-context-decisions extension for ideas that could improve system-skill-advisor and its hooks' while `graph-metadata.json`'s `causal_summary` (taken from the spec.md Problem Statement) says 'The skill advisor picks skills with a local f...
  - Evidence: `SPECKIT_DRAFT_AUTO_REPAIR=0 bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-co...` exit 2: ...a local five-lane scorer...' head spec.md sha256 670d222cbd82beb1afe9fe7c878e1b3106d83f5c140274b7bfdedb013b7ff990 == head source_doc_hashes.spec.md base causal_summary 'The skill advisor picks skills with a local five-lane scorer...' base description.json 'Mine the pi-context-decisions extension...'

### S15 CI parity

- **A1** P1 judgment `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl:196`: The change appends row rr-paste-208 to the hash-pinned routing corpus (195 -> 196 rows, sha 4146b002802d010e -> 18bc5977180a722e) but does not recapture the corpus pin in specs/system-deep-loop/loop-architecture/003-deprecate-improvement-modes/013-drift-guard-repairs/baseline/routing-baseline.json, which still records rows 195 / sha 4146b002802d010e. The blocking step 'Routing-accuracy corpus gate...
  - Evidence: `cd .skilled/skills/system-skill-advisor/runtime && python3 -c "import hashlib,json,pathlib;b=json.load(open('../../../specs/system-deep-loop/loop-architecture/003-deprecate-improvement-modes/013-drift...` exit 2: [('labeled-prompts.jsonl', '4146b002802d010e', '18bc5977180a722e'), ('holdout-prompts.jsonl', '9408335972503fab', '918265c278fd51fe')]

## Findings outside the scope

A lane or the critic reported these on files that are not in scope.json, so they are not attributed to this range. "merged-in" means the file changed between the merge base and the head only through a merge the first-parent scope leaves out; "unchanged in range" means the range never touched it, which is usually a cause a lane traced from an in-scope change. "pre-existing (critic)" means the critic showed the finding predates the scope, whatever file it names. A finding here can still block CI; its severity stands.

### pre-existing (critic)

- **C-04** P2 literal `README.md:674`: The S5 derived-count row fails on `Claude Code (two files)`: the checker reads `two files` as a count of files in the repo root, which holds 16 or 17, and the root inventory is incomplete. The sentence means Claude Code's two config files, so it needs an allow-count entry. It predates this change: README.md and the checker are byte-identical at the base (same sha256) and blame puts the line at 0cc... [S5, C]
  - Evidence: `python3 .skilled/skills/sk-doc/sk-create-readme/scripts/check_derived_readme_counts.py README.md >/dev/null 2>&1; echo "checker=$?"; git -c core.fsmonitor=false show 538d2f789ec:README.md | shasum -a ...` exit 0: checker=1 06116720545fa5665130fa0814ed83fa07e304b1c3de6fd3635e715aed293143 06116720545fa5665130fa0814ed83fa07e304b1c3de6fd3635e715aed293143
  - Critic override: pre-existing, lane severity P2. README.md is byte-identical at the base and at the working tree (sha256 06116720545fa5665130fa0814ed83fa07e304b1c3de6fd3635e715aed293143 both), the checker .skilled/skills/sk-doc/sk-create-readme/scripts/check_derived_readme_counts.py is byte-identical (sha256 9486c98b0b6127aab1d68e5b804f20e79c56fa38691ef3c5e47b909eec658761 both), and line 674 is unchanged, so the S5-derived-counts failure predate...

### unchanged in range

- **B-02** P2 literal `.skilled/skills/system-skill-advisor/runtime/bench/README.md:48`: The bench README still presents `scorer-calibration.bench.ts` as calibration-only. The branch adds `logFollowUpRouting` and `logFollowUpReceipts` over `FOLLOW_UP_PAIRS` and `FALSE_CARRY_PAIR` (scorer-calibration.bench.ts:224-322), so the file now also measures floored follow-up routing and the route-receipt guard and emits `advisor-follow-up-routing` and `advisor-follow-up-receipts`. The table row... [S2, B]
  - Evidence: `grep -n "scorer-calibration.bench.ts" .skilled/skills/system-skill-advisor/runtime/bench/README.md` exit 0: 35:+-- scorer-calibration.bench.ts # Scorer calibration benchmark 48:| `scorer-calibration.bench.ts` | Measures scorer calibration against baseline expectations. | 78:| `scorer-calibration.bench.ts` | Benchmark | Scorer calibration measurement. |
- **B-03** P2 judgment `.skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md:20`: The catalog is the skill's canonical current-state inventory, yet it still declares 46 features across 7 groups with `hooks-and-plugin` at 4, and no entry describes either new capability. The Claude hook entry never names the crash fallback added in 98a58b6245b, and neither `hooks-and-plugin/claude-hook.md` nor `scorer-fusion/five-lane-fusion.md` names the pasted-reply strip or the route-receipt g... [S3, B]
  - Evidence: `grep -n "46 features" .skilled/skills/system-skill-advisor/feature-catalog/feature-catalog.md` exit 0: ...p 01 owns daemon correctness. Groups 02-03 own the index and lifecycle surface that feeds the scorer. Group 04 owns scoring. Group 06 owns the command surface: the nine CLI commands plus the stable compat entrypoint. Groups 07-08 cover runtime integrations, OpenCode plugins and Python compatibility.
- **B-04** P2 judgment `.skilled/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/claude-user-prompt-submit.md:87`: The only Claude-hook scenario still treats `{}` as a shim failure and a leading `Advisor: outage (` as an acceptable no-brief signal, so it would not distinguish a handler crash from a real outage; it also has no route-receipt or pasted-reply case. No file in the 53-scenario package mentions 'pasted', 'route receipt' or 'weak follow' (rg exit 1), so the new capabilities ship without a manual scena... [S4, B]
  - Evidence: `rg -n -i "pasted|route receipt|weak follow" .skilled/skills/system-skill-advisor/manual-testing-playbook` exit 1: 
- **C-02** P2 judgment `.skilled/skills/system-skill-advisor/README.md:84`: How It Works describes the hook-to-CLI path without either new routing behavior: the hook strips a leading pasted reply (a cue needs an attribution header such as 'You said:') before the 10,000-character cut and before scoring, and it holds a confidence-floored recommendation back against the session's earlier route, which renders as `Advisor: prompt skipped.` Neither behavior, nor the new public ... [S5, C]
  - Evidence: `grep -ciE "pasted|route receipt|weak follow" .skilled/skills/system-skill-advisor/README.md || echo "no mentions"` exit 0: 0 no mentions
- **C-03** P2 judgment `README.md:201`: The Skill Routing section states the 0.8 rule unconditionally and describes only the daemon and local-scorer path. The hook now withholds a confidence-floored route (the task-intent floor is 0.82) on a weak follow-up that would differ from the session's stored route, so a prompt can yield `Advisor: prompt skipped.` instead of a skill at or above 0.8; a leading pasted reply is also stripped before ... [S5, C]
  - Evidence: `grep -ciE "pasted (earlier )?(reply|context)|route receipt|weak follow|floored" README.md || echo "no mentions"` exit 0: 0 no mentions
- **C-06** P2 judgment `.skilled/changelog/skilled/v4.1.0.0.md:186`: No release entry describes the three user-visible advisor changes. v4.1.0.0.md is the newest framework entry, and its Skill Advisor section and Smaller fixes list name none of them; the v4.1.0.0 tag points at 05dbe23f023, which is before this work merged (57d3f5d9159), and no newer entry exists. Fix direction: carry the pasted-reply strip, the weak follow-up hold and the hook crash fallback in the... [S6, C]
  - Evidence: `grep -ciE "pasted (earlier )?(reply|context)|route receipt|weak follow" .skilled/changelog/skilled/v4.1.0.0.md || echo "no mentions"; git -c core.fsmonitor=false merge-base --is-ancestor v4.1.0.0 57d3...` exit 0: 0 no mentions tag-before-merge
- **C-07** P2 judgment `.skilled/skills/system-skill-advisor/SKILL.md:5`: The skill's behavior changed, but SKILL.md stays at 1.1.0.0 and no component changelog entry was added; the newest entry, v1.1.0.0, covers the earlier hook-health work. The established pattern for post-release advisor work is a version bump plus a component entry in the same phase (1367d4090e6 bumped SKILL.md, added changelog/v1.1.0.0.md and corrected the READMEs), so this change has no component ... [S6, C]
  - Evidence: `git -c core.fsmonitor=false diff --name-only 538d2f789ec 4d65eced09e -- .skilled/skills/system-skill-advisor/SKILL.md .skilled/skills/system-skill-advisor/changelog | wc -l` exit 0: 0
- **D-02** P2 judgment `.skilled/skills/system-skill-advisor/graph-metadata.json:66`: The change adds five feature names — pasted reply, route receipt, outage line, lifecycle clock, confidence floor — but none appears in the skill's stage-one routing metadata: `graph-metadata.json` `intent_signals` (line 66), `SKILL.md` `intent_signals` (lines 21-26) and `ROUTER.md` contain none of them. Probes P02-P06 miss: `route receipt` routes to sk-code, `outage line` to sk-prompt, `lifecycle ... [S7, D]
  - Evidence: `node .skilled/commands/assets/local-skilled-alignment/run-probes.cjs --probes /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/local-skilled-alignment-scratch/20261119T054734Z/D/probes.json --out /var...` exit 1: ...sor got=- pass P07 want=sk-code got=sk-code/sk-code-review pass P08 want=system-spec-kit got=system-spec-kit pass P09 want=sk-doc got=sk-doc/sk-create-changelog pass P10 want=sk-git got=sk-git fail P11 want=sk-design got=sk-code/sk-code-frontend STATUS=FINDINGS run-probes: pass=5 fail=6 cannot_run=0

## Overturned by the critic

The critic refuted these or showed they repeat another finding, so they are left out of every count above. Each keeps the severity its lane gave it.

### refuted

- **A2** P2 judgment `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:604`: recordRouteReceipt writes the session's route receipt while the handler builds its output, before writeHookOutput (line 717) hands that output to stdout, and it is not covered by the deferred-receipt mechanism this same change built for the directive receipt. Case: the host never receives the brief (the write callback reports an error such as EPIPE), so the model's context holds no route from that... [S1, A]
  - Evidence: `cd .skilled/skills/system-skill-advisor/runtime && node --input-type=module -e 'import {readFileSync} from "node:fs"; const hook=await import("./dist/hooks/claude/user-prompt-submit.js"); const rr=awa...` exit 0: before write: sk-code after failed write: sk-code
  - Critic override: refuted, lane severity P2. 011's implementation-summary Known Limitations 5 records this exact trade-off as accepted: 'A receipt is written before the host acknowledges delivery. The directive receipt defers its commit to the stdout callback; the route receipt does not, because that deferral exists only when the lifecycle defers. If the hook process dies between the write and the output, the next weak follow-up that floors ...

### duplicate

- **D-03** P2 judgment `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:57`: The hook reference documents the policy gate and the directive lifecycle but not the route receipt guard, and no markdown file in the skill mentions 'route receipt' (`rg -l 'route receipt|route-receipt' .skilled/skills/system-skill-advisor --glob '*.md'` prints nothing). A reader of the changed file cannot predict why a weak follow-up is held back or which session state controls it. The file was e... (inferred) [S8, D]
  - Critic override: duplicate, lane severity P2. B-01 records the same defect on the same file: the hook reference never documents the route receipt (or the pasted-reply strip). B-01 also names the missing KEY FILES row, the scorer reference and the missing validation entry, so D-03 adds no separate finding.

## Env tokens

0 variables read in changed code, 0 not in .env.example.

## Probes

| Probe | Expected | Top-1 | Status |
|---|---|---|---|
| P01 | system-skill-advisor | system-skill-advisor | pass |
| P02 | system-skill-advisor | sk-code | fail |
| P03 | system-skill-advisor | sk-prompt | fail |
| P04 | system-skill-advisor | cli-external-orchestration/cli-deepseek-harness | fail |
| P05 | system-skill-advisor | sk-code/sk-code-skilled | fail |
| P06 | system-skill-advisor | - | fail |
| P07 | sk-code | sk-code/sk-code-review | pass |
| P08 | system-spec-kit | system-spec-kit | pass |
| P09 | sk-doc | sk-doc/sk-create-changelog | pass |
| P10 | sk-git | sk-git | pass |
| P11 | sk-design | sk-code/sk-code-frontend | fail |

## Probes awaiting the critic

- P11: design the motion for a mobile css animation; expected sk-design; actual skill sk-code

## Files no lane reviewed

- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/noedit-close-3c/probes/hook-probe.sh`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/scorer-attach-4/probes/vitest.config.ts`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/verify-4/probes/cli-rows.sh`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/verify-4/probes/holdout-guard-emulation.sh`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/verify-4/probes/make-heredoc-variant.sh`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/verify-4/probes/make-shell-start-variant.sh`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/verify-4/probes/paired-arm.sh`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/verify-4/probes/top-only-head.sh`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/verify-4/probes/top-only-sweep.sh`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/verify-5/probes/arena-provenance.sh`

## Inputs and overrides that could not be used

- critic.json override 4 names P11, which no finding carries, and was ignored

