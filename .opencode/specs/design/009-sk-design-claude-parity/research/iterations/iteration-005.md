# Iteration 5: Backend / Operating Model

## Focus
This iteration investigated the “Claude Design-like backend/operating model” in OpenCode terms for `sk-design`: system-prompt core, procedural skill loading, evidence/source-of-truth handling, in-loop review cadence, no-subagent Codex lessons, and preservation of `mode-registry` plus `design-md-generator`. The selected interpretation was operational architecture only, not implementation.

## Findings
1. **System-prompt core should become an operating constitution, not a monolithic mode.** The external prompt defines the agent as a designer who uses code, insists that generic AI aesthetics are failure, and prescribes a workflow of understand, acquire context, plan visibly, skeleton early, iterate/verify, and summarize briefly. In OpenCode, this belongs as parent-hub choreography and shared behavioral contract; it must not absorb per-mode design logic because `sk-design` already states the hub is routing-only and packet logic remains in mode folders. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:1] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:7] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:23] [SOURCE: .opencode/skills/sk-design/SKILL.md:15] [SOURCE: .opencode/skills/sk-design/SKILL.md:64]
2. **Procedural skill loading maps best to registry-selected procedure cards loaded by file reads, not public subskills.** Claude says each skill is a phased procedure with explicit triggers and chains; the Codex variant makes the loader explicit as “read the corresponding file” because there is no skill-invocation tool. `sk-design` should emulate that by resolving `workflowMode` through `mode-registry`, then loading packet-local procedure/reference cards inside the selected mode; the registry stays the source of truth and the advisor still sees one `sk-design` identity. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:602] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:643] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/codex/AGENTS.md:5] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/codex/system-prompt.md:599] [SOURCE: .opencode/skills/sk-design/SKILL.md:41] [SOURCE: .opencode/skills/sk-design/mode-registry.json:4]
3. **Evidence/source-of-truth handling is the backend’s first gate.** The external model says high-fidelity design starts from existing design context and, for real codebases, exact source values beat memory; `sk-design` already has a UI-build bundle that requires a context manifest, `context_loaded_card`, and `proof_of_application_card`. Therefore the Claude-like backend should force “load source → record observed tokens/components/assets → design from that evidence → prove application” before ready claims. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:66] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:86] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/codex/system-prompt.md:62] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/codex/system-prompt.md:82] [SOURCE: .opencode/skills/sk-design/SKILL.md:60]
4. **Review cadence should be in-loop and transport-adaptive.** Claude delegates a verifier subagent after every substantive visual change and refuses unverified success; Codex is the no-subagent lesson: render/check yourself and report a short issue list. `sk-design` should express the cadence as a verifier protocol rather than a subagent dependency: after substantive visual changes run the strongest available verifier path (audit packet, browser/Playwright when available, or explicit “not verified”), then require proof before ready claims. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:29] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:580] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:584] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/codex/system-prompt.md:577] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/codex/AGENTS.md:7]
5. **OpenCode backend model: `reference-base` packets plus one mutating extraction backend.** The registry already names `workflowMode` and `backendKind` as discriminators, with four non-mutating `reference-base` modes and `md-generator` as the only `playwright-extract` mode that may mutate workspace outputs. A Claude-like refactor should preserve that split: clone the operating feel through prompt/procedure/evidence/review cadence, while `design-md-generator` remains the specialized measured-CSS backend rather than being flattened into generic design advice. [SOURCE: .opencode/skills/sk-design/mode-registry.json:5] [SOURCE: .opencode/skills/sk-design/mode-registry.json:7] [SOURCE: .opencode/skills/sk-design/mode-registry.json:36] [SOURCE: .opencode/skills/sk-design/mode-registry.json:93] [SOURCE: .opencode/skills/sk-design/mode-registry.json:112] [SOURCE: .opencode/skills/sk-design/mode-registry.json:114] [SOURCE: .opencode/skills/sk-design/SKILL.md:82]

## Ruled Out
- **Literal verifier-subagent dependency**: ruled out because the requested leaf/no-subagent constraint and Codex variant both show the same cadence can be implemented as self-verification when subagents are unavailable. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/codex/system-prompt.md:577] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/codex/AGENTS.md:7]
- **One mega-prompt containing all mode logic**: ruled out because the current hub explicitly forbids per-mode design logic in the parent. [SOURCE: .opencode/skills/sk-design/SKILL.md:15] [SOURCE: .opencode/skills/sk-design/SKILL.md:98]
- **Replacing `mode-registry` with prose triggers**: ruled out because routing is registry-driven and the registry is the single source of truth. [SOURCE: .opencode/skills/sk-design/SKILL.md:41] [SOURCE: .opencode/skills/sk-design/mode-registry.json:4]

## Dead Ends
- The first broad external glob attempt returned no files because the absolute-pattern/path combination did not match; the iteration fell back to direct reads of known prompt paths and a targeted grep across `external/**`. [INFERENCE: based on the no-match glob result and subsequent successful targeted reads/grep]
- Copying Claude’s parallel review-agent mechanics verbatim remains a dead end; the portable essence is “verify after substantive visual change,” not the transport. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:580] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/codex/system-prompt.md:577]

## Edge Cases
- Ambiguous input: The user asked for a backend/operating model and also included a stale instruction to call a Task subagent; the leaf/no-subagent constraint was the narrower binding interpretation, so this iteration executed directly and did not dispatch.
- Contradictory evidence: Claude requires verifier subagent delegation, while Codex says no verifier subagent exists; resolved by abstracting the cadence from the transport.
- Missing dependencies: none required; external skill files were consulted through direct prompt reads and targeted grep after broad glob failed.
- Partial success: none; the iteration answered the backend model focus with cited local evidence.

## Sources Consulted
- `.opencode/specs/design/009-sk-design-claude-parity/research/deep-research-config.json`
- `.opencode/specs/design/009-sk-design-claude-parity/research/deep-research-state.jsonl`
- `.opencode/specs/design/009-sk-design-claude-parity/research/deep-research-strategy.md`
- `.opencode/specs/design/009-sk-design-claude-parity/research/iterations/iteration-004.md`
- `.opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md`
- `.opencode/specs/design/009-sk-design-claude-parity/external/codex/system-prompt.md`
- `.opencode/specs/design/009-sk-design-claude-parity/external/codex/AGENTS.md`
- `.opencode/skills/sk-design/SKILL.md`
- `.opencode/skills/sk-design/mode-registry.json`

## Assessment
- New information ratio: 0.80
- Questions addressed: Q1 - Claude Design essence; Q3 - OpenCode feature preservation; Q4 - Parent hub contract; Q5 - Verification and benchmark proof
- Questions answered: Q4 now has a backend/operating-model definition: operating constitution + registry-selected procedures + evidence gate + transport-adaptive verifier cadence + preserved backend split.

## Reflection
- What worked and why: Comparing Claude’s subagent cadence with Codex’s no-subagent cadence exposed the portable invariant: verification must be in-loop after substantive visual changes, but the executor can vary.
- What did not work and why: Broad external glob discovery failed because the absolute glob pattern did not match under the supplied root, so targeted reads and grep were more reliable under the call budget.
- What I would do differently: Next pass should read the context/proof card assets and audit packet directly to turn this operating model into concrete proof-suite scenarios.

## Recommended Next Focus
Define the verifier/proof suite from `shared/assets/context_loaded_card.md`, `shared/assets/proof_of_application_card.md`, the `design-audit` packet, and benchmark/playbook evidence so the operating model has pass/fail checks rather than only architecture language.
