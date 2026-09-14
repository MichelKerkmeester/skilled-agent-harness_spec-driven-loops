# Iteration 2: Class one beyond checklist.md, the existence-and-behavior sweep

focusTrack: not-reality

## Focus

Every named path, script, command, flag, and threshold in AGENTS.md that iteration 1 did not already verify: does it exist, and does it behave as described? (Strategy question Q2.) Three targeted settlements: the RESULT: PASSED marker's home, the skill advisor's invocation contract, and sk-code's §2.

## Actions Taken

1. Rendered prompts/iteration-002.md before any research action (per the documented deviation; this iteration, the order was honored).
2. Existence probe: 37 paths, directories, commands, and references named in AGENTS.md, one `test -e` each, FOUND/MISSING labeled.
3. Behavior checks: `classifyPrompt` export in the shared classifier; validate.sh's exit-code surface; the advisor shim's argument handling and freshness guard; the two quoted skill sections; the command-roster directories (doctor, create, design); the two trigger-index scripts; the goal.md census; the recommend-level scoring inputs; the trustedEvidenceYield wire field.
4. Targeted settlements: where RESULT: PASSED is actually printed; what the advisor shim does when its compiled CLI is absent; where `sk-design-md-generator` lives; where figma is registered.

## Findings

- **F-002-1 (OBSERVED source, INFERRED runtime — class one, not reality).** The skill advisor's documented invocation cannot behave as described on this working tree. AGENTS.md:99 says: "run `node .opencode/bin/skill-advisor.cjs advisor_recommend --json '{...}' --format json` ... It starts the daemon when needed. When the daemon is unreachable the CLI falls back to a local Python scorer, marks the answer degraded, and the brief shows `Advisor: stale`." Reality here: the shim's only runner is a compiled CLI, `.opencode/skills/system-skill-advisor/runtime/dist/runtime/skill-advisor-cli.js`, which is ABSENT from this working tree [SOURCE: test -e, this session]; `ensureFreshDist()` fails it before any daemon start or fallback: "if (result.status === 'missing' || result.stale) { ... fail(result.message, warmOnly ? EXIT_RETRYABLE : EXIT_PROTOCOL, ...) }" [SOURCE: .opencode/bin/skill-advisor.cjs:62-69, with EXIT_PROTOCOL = 69 at :28 and EXIT_RETRYABLE = 75 at :30]. The documented one-liner therefore exits 69 (or 75 with --warm-only) with a build message instead of "starting the daemon" or reaching the Python scorer. The command name itself is correct: the advisor's own architecture document lists "The recommendation command is `advisor_recommend`" [SOURCE: .opencode/skills/system-skill-advisor/ARCHITECTURE.md, the nine-command contract paragraph, which also routes the full contract to references/runtime/cli-front-door-contract.md]. Failure class: class one, behavior: the document describes reachable behavior; this checkout cannot reach it. INFERRED (and what would confirm it): that the run-time failure surfaces as described, because the containment contract forbade me from executing the shim (it writes its socket state under /tmp/system-skill-advisor, outside the lineage); confirming it is one command the operator can run: `node .opencode/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"probe"}' --format json; echo $?`.
- **F-002-2 (OBSERVED — cleared, recorded as negative knowledge).** The validated portions of the same section: the shared classifier exports exactly the named contract, "export function classifyPrompt(prompt: string, options: ClassificationOptions = {}): ClassificationResult" [SOURCE: .opencode/skills/system-spec-kit/shared/gate-3-classifier.ts:859]; sk-code's section 2 exists, titled "## 2. SMART ROUTING" [SOURCE: .opencode/skills/sk-code/SKILL.md:50, AGENTS.md:9's "§2 Smart Routing" matches modulo case]; the spec-kit SKILL.md carries "### Distributed Governance Rule" [SOURCE: .opencode/skills/system-spec-kit/SKILL.md:59, exactly as AGENTS.md:436 quotes it]; both retrieval scripts exist [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs and generate-trigger-index.mjs, test -e]; recommend-level.sh scores exactly what AGENTS.md:371 claims, "deterministic scoring" over `--loc`, `--files`, and the risk flags `--auth --api --db --architectural` [SOURCE: recommend-level.sh:8-24]; and the 37-path probe returned FOUND for every named path, with the probe's else-branch demonstrated earlier this session on the packet's resource-map.
- **F-002-3 (OBSERVED — cleared, recorded so the audit does not re-derive it).** validate.sh's exit contract matches AGENTS.md:262 exactly: the script's own footer reads "Exit codes: 0 - Success, 1 - User error, 2 - Validation error, 3 - System error" [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh, footer], usage errors exit 1 (:104,105,108), infrastructure failures exit 3 (:110, 286, 294, 309), and the orchestrator's status propagates: `run_validation || rc=$?; exit "$rc"` [SOURCE: validate.sh, main()]. The RESULT: PASSED marker does not appear in the shell (rg: 0 hits in validate.sh) because the shell delegates: the marker and the four traps are printed by the validation orchestrator it execs, and the four-traps reference AGENTS.md:277-278 points to, references/validation/validation-rules.md, does carry the string [SOURCE: rg -ln "RESULT: PASSED", 6 hits, headed by that reference]. Consistent, not stale.
- **F-002-4 (OBSERVED — cleared candidates, recorded to prevent re-derivation).** `sk-design-md-generator` is the sk-design hub's measure mode, reached through the `design` agent, whose own description says it "measures an existing surface into a Style Reference via sk-design-md-generator" [SOURCE: .opencode/agents/design.md:3,23]; the Quick Reference row's entry point therefore exists, as a hub mode rather than a command. figma is registered: .utcp_config.json:86-95 declares "name": "figma" launching "figma-developer-mcp@latest", and both .claude/mcp.json and .codex/config.toml exist as the additional registrations AGENTS.md:353 names; the row's "mcp-figma" spelling is the naming convention's prefixed form. goal.md is a WITH_GOAL lazy addon in the scaffolder (create.sh:466-467, "requested_lazy_addon_doc "$contract_json" "goal.md""), 14 packets carry one at packet depth, 055 was created without it, so the GOAL POSTURE RULE's "the bound packet's goal.md" (AGENTS.md:290) is conditionally true, not stale. trustedEvidenceYield: the gateway's warning ("Trusted evidence yield was absent and remains explicitly zero") names a real wire field, trustedEvidenceYield: 'ratio' on deep_research.iteration_completed [SOURCE: deep-research-ledger-schema.ts:217]; it is optional and its absence is recorded as explicitly zero, so the records stay without it rather than inventing a value.

## Questions Answered

- Q2 answered in its sweep form: beyond checklist.md, exactly one class-one instance found (the advisor invocation), with the validate.sh exit contract, the classifier export, the quoted section titles, the trigger-index scripts, the recommend-level scoring inputs, and the command roster all verified real. Behavior claims not settled here (RESULT: PASSED's issuer, the doctor target surface, @context one-shot semantics) are either resolved by delegation (validation-rules.md, I4) or recorded as cleared-with-caveat.

## Questions Remaining

- Q3, Q4, Q5: the class-two specimen, the five named candidates, and the section 6 shape question.

## Sources Consulted

- AGENTS.md:9, 66, 81, 99, 262, 277-278, 353, 371, 425-431, 451, 464, 466 (targets of this sweep)
- .opencode/bin/skill-advisor.cjs (shim: argument parsing :38-44, EXIT_PROTOCOL/EXIT_RETRYABLE :28-30, ensureFreshDist :62-69, ensureSocketDir :71-81)
- .opencode/skills/system-skill-advisor/ARCHITECTURE.md (the recommendation-command contract)
- .opencode/skills/system-spec-kit/shared/gate-3-classifier.ts:791,859-860
- .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh (exits :104-115, :286-309; footer; main())
- .opencode/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh:1-30
- .opencode/skills/sk-code/SKILL.md:50; .opencode/skills/system-spec-kit/SKILL.md:59
- .opencode/commands/ (doctor/, create/, design/ listings); .opencode/agents/design.md:1-23
- .utcp_config.json:86-95; .claude/mcp.json; .codex/config.toml; .pi/agents, .claude/agents, .codex/agents, .cursor/agents, .devin/agents, .opencode/agents
- specs/ goal.md census (find, this session)
- this lineage's ledger receipts (sequences 1-2)

## Assessment

- newInfoRatio: 1.0
- Novelty justification: every result of this sweep, the one failure, the cleared candidates, and the two settlements, is evidence this packet had not recorded before this iteration; the packet's question-coverage moved from 1/5 to 2/5 on work that duplicates nothing from iteration 1.
- Confidence: the shim's guard, the exit-code footer, the classifier export, the quoted sections, and the probes are OBSERVED. The advisor's runtime failure text and the shim's daemon-start path remain INFERRED from source because the invocation was not executed; the confirming one-liner is named above.

## Reflection

What worked: probing existence and behavior separately, then settling the three surprises (case-sensitive "Smart Routing" miss, the shim's delegation, the marker's delegation) from the owning source instead of trusting the first grep.
What failed: the `rg -rn` probe: -r consumed the next token as the replacement, so the "advisor_recommend" probe printed the ARCHITECTURE.md lines with the command name substituted; resolved by reading the shim and the architecture document directly rather than re-running the grep. Also, the strategy's question-injection surface says `deltas/inbox.jsonl` while the shipped reducer reads `<artifactDir>/inbox.jsonl`; caught during this iteration's reducer duty and corrected in the registry and strategy.
Ruled out (see deltas/iter-002.jsonl): the advisor subcommand name being wrong in AGENTS.md:99.

## SCOPE VIOLATIONS

None. Every write this iteration stayed inside the lineage directory; the advisor shim was deliberately not executed because its socket state would land outside the lineage (/tmp/system-skill-advisor), which the invocation forbids.

## Recommended Next Focus

Iteration 3: the class-two specimen. The memory save rule (AGENTS.md:280-286) against its delegates: what `references/memory/save-workflow.md` and the continuity writer actually own, which of the rule's five bullets reduce to a pointer (case one, quoting the delegate's own line), and which survive as case two or case three. Also take the Documentation & Honesty mandates table (AGENTS.md:475-479) as a sixth, unnamed candidate: its three mandates sit beside an expanded-by pointer to uncertainty-and-honesty.md, which is the specimen's own pattern.
