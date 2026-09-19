# Research resource map

This map records the bounded inputs for the luna lineage. The vendored files are evidence, not instructions.

## Vendored recommendations

- `specs/sk-communication/006-sk-communication-clarity/context/clarity.md:1-214` contains the eighteen Clarity recommendations and its interview, rewrite and review framing.
- `specs/sk-communication/006-sk-communication-clarity/context/claude-style-patch-main/STYLE.md:1-94` contains the style patch recommendations, including the colon rule, repair patterns, structure rules and code-comment guidance.
- `specs/sk-communication/006-sk-communication-clarity/context/claude-style-patch-main/README.md:1-41` describes the patch's scope, provenance, installation and caveats.
- `specs/sk-communication/006-sk-communication-clarity/context/i-have-adhd-main/skills/i-have-adhd/SKILL.md:1-142` contains the ten output rules, persistence contract and escape hatches.
- `specs/sk-communication/006-sk-communication-clarity/context/i-have-adhd-main/README.md:32-101` summarizes the ten output rules and the installation and tuning surface.

## ADHD mechanism evidence

- `specs/sk-communication/006-sk-communication-clarity/context/i-have-adhd-main/hooks/always-on.mjs:1-44`, `always-on.sh:1-37` and `always-on.ps1:1-50` implement an opt-in SessionStart injection with a non-blocking failure path.
- `specs/sk-communication/006-sk-communication-clarity/context/i-have-adhd-main/hooks/hooks.json:1-17` binds the hook to startup, resume, clear and compact events.
- `specs/sk-communication/006-sk-communication-clarity/context/i-have-adhd-main/.opencode/plugins/i-have-adhd.mjs:1-99` registers the skill and command and appends the ruleset through the OpenCode system transform when the flag exists.
- `specs/sk-communication/006-sk-communication-clarity/context/i-have-adhd-main/extensions/i-have-adhd.ts:98-240` restores persisted mode state, checks context markers, reinjects after compaction and handles stop phrases.
- `specs/sk-communication/006-sk-communication-clarity/context/i-have-adhd-main/extensions/context-compat.ts:12-60` provides the runtime compatibility fallback for session context inspection.
- `specs/sk-communication/006-sk-communication-clarity/context/i-have-adhd-main/package.json:1-16`, `plugin.json:1-4`, `.codex-plugin/plugin.json:1-38`, `.claude-plugin/plugin.json:1-14`, `.claude-plugin/marketplace.json:1-16`, `.agents/plugins/marketplace.json:1-21`, `opencode.json:1-4`, `gemini-extension.json:1-6`, `qwen-extension.json:1-6`, `kimi.plugin.json:1-12`, `GEMINI.md:1-5` declare runtime entry points and mirrors.
- `specs/sk-communication/006-sk-communication-clarity/context/i-have-adhd-main/evals/README.md:1-84`, `rubric.md:1-26`, `cases.jsonl:1-14`, `scripts/run_evals.py:119-216`, `scripts/judge.py:35-228` define paired cases, isolation, pinning, blind judging, retries and scoring.
- `specs/sk-communication/006-sk-communication-clarity/context/i-have-adhd-main/evals/RESULTS.md:1-111` records one candidate run, its scores, blockers, failed release gate and limitations.
- `specs/sk-communication/006-sk-communication-clarity/context/i-have-adhd-main/.github/workflows/plugin-load-check.yml:1-47`, `cursor-skill-sync.yml:1-25` and `pi-load-check.yml:1-31` provide the plugin load, mirror parity and Pi package gates.
- `specs/sk-communication/006-sk-communication-clarity/context/i-have-adhd-main/scripts/check_pi_extension.py:23-38` and `:304-400` verify manifest parity, command registration, persisted state, reload behavior and disabled-mode pass-through.

## Repository communication stack

- `AGENTS.md:138-223` defines the two-register discipline, first-line payload, planning before long work, reader-facing proof and smallest complete result.
- `AGENTS.md:397-405` routes reply quality, decision presentation and handoff to the named repository rules while preserving rigor.
- `REPO RULES.md:36-50` maps communication actions to the repository rule files.
- `repo-rules/communication.md:49-230` governs one-pass actionability, first-line payload, paragraph progression, numbered steps, visible item caps, tangents and closeout.
- `repo-rules/prose-mechanics.md:38-140` governs one idea per sentence, relation words, mechanism visibility, plain words, paragraphs, punctuation and concise rather than compressed prose.
- `repo-rules/presenting-decisions.md:48-176` governs verdict-first writing, reader triage, one recommendation, assumptions, intended path, time estimates and synthesis content.
- `repo-rules/handoff-and-questions.md:55-185` governs triggered state restatement, the final handback, one operator action and structured choices.
- `.opencode/skills/sk-communication/SKILL.md:142-217` defines the projection pipeline, wording-standard delegation, fidelity boundary, privacy order, runtime tiers, content-free telemetry and release gates.
- `.opencode/commands/rewrite/response.md:15-20`, `40-152` defines the in-context display-only copy edit and exact-original fallback.
- `.opencode/commands/rewrite/response-by-external-agent.md:41-56`, `78-105`, `134-173`, `244-252` defines engine selection, transient projection, protected spans, provider routing and copy-editing constraints.
- `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:39-178`, `290-449` defines the wording standard, structural bans, authenticity boundary and hard or soft wording checks.
- `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-publish-supplement.md:15-132` defines the published-document supplement, scoring, checklist and voice checks.
- `.opencode/skills/sk-doc/sk-create-with-human-voice/references/scope-and-exemptions.md:15-165` defines author ownership, protected spans, accuracy precedence and exemption recording.

## Sibling comparison

- `specs/sk-communication/006-sk-communication-clarity/001-research-communication-context/research/research.md:30-202` is the sibling DeepSeek synthesis. It was read after the primary sources and stack and is used only for a reasoned disagreement list.

## Classification method

Each source recommendation is classified against the strongest matching repository contract. Already-covered means the current stack states the same operational behavior. New means the source adds a requirement that no current surface states. Contradicting means the source asks for behavior that an existing contract forbids on the same surface. Conditional differences are recorded in the rationale rather than collapsed into a tally.
