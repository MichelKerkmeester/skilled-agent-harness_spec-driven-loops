# Iteration 3: Parent Hub / Session Contract

## Focus

This iteration derives the desired `sk-design` parent hub/session contract from the external Claude Design source, with emphasis on designer persona, autonomy and question behavior, procedural skill selection order, verification cadence, output expectations, and fit with OpenCode's single advisor identity plus mode-registry model. It follows iteration 2's recommended next focus and does not edit `sk-design` or external source files. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/research/iterations/iteration-002.md:84] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/research/deep-research-strategy.md:48]

## Findings

1. The parent persona should be a designer-manager collaboration contract, not a mode list: Claude frames the assistant as an expert designer using code as the medium, expected to push back on harmful additions while deferring to the user as manager, and to speak about capabilities in user-facing terms rather than exposing internal tool or skill names. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:1] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:5] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:11] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:15] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:17] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:19]
2. The parent session contract should start with a `Design Read`: inspect attached/source context first, then ask only design-shaping questions in one consolidated round, skip questions when scope is explicit or small, and execute autonomously after the user's answers. This belongs as cross-mode session choreography, not per-mode taste logic. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:25] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:40] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:46] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:58] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:60] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:62] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/skills/discovery-questions.md:5] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/skills/discovery-questions.md:17] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/skills/discovery-questions.md:34] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/skills/discovery-questions.md:119]
3. The procedural selection order should be represented as internal procedure cards under the existing five-mode architecture: `discovery-questions` first when new/ambiguous; context extraction or `md-generator` when real design-system evidence is needed; aesthetic direction before greenfield hi-fi; wireframe/deck/prototype/tweakable/variations as production procedures; review skills as audit/final-gate procedures. Claude's own order is explicit and chainable, but OpenCode should keep one public `sk-design` identity and let the hub resolve modes through the registry. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:600] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:606] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:616] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:621] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:641] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:643] [SOURCE: .opencode/skills/sk-design/SKILL.md:15] [SOURCE: .opencode/skills/sk-design/SKILL.md:41] [SOURCE: .opencode/skills/sk-design/mode-registry.json:4]
4. The verification cadence should become an OpenCode-native review policy rather than a copied Claude subagent mechanism: Claude verifies after every substantive visual change and uses a final polish gate that launches four reviews, deduplicates findings, fixes blockers/quality issues, re-checks high-risk areas, and reports a short verdict. OpenCode can preserve the cadence with `audit`/browser/implementation verification checkpoints while avoiding Claude-specific parallel-agent mechanics where runtime boundaries forbid them. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:29] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:578] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/skills/polish-pass.md:22] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/skills/polish-pass.md:71] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/skills/polish-pass.md:83] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/skills/polish-pass.md:91] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/skills/polish-pass.md:100] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/research/iterations/iteration-002.md:39]
5. Output expectations should be session-level invariants: choose the right artifact format, prefer one live file with toggles for variants, show a skeleton early, keep chat brief, report caveats/next steps only, and never claim unverified success. These are parent-contract expectations because they affect every mode's user experience, while the exact artifact mechanics remain in mode packets. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:535] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:539] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:555] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:567] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:573] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:584]
6. The fit with OpenCode is a two-layer contract: the advisor sees only `sk-design`; the parent applies session choreography and registry-driven mode resolution; selected packets own detailed design logic. This preserves the existing one-graph-metadata invariant, mode-registry source of truth, smallest-useful-mode rule, and UI build bundle while allowing Claude-like behavior to appear as a coherent backend session. [SOURCE: .opencode/skills/sk-design/SKILL.md:15] [SOURCE: .opencode/skills/sk-design/SKILL.md:41] [SOURCE: .opencode/skills/sk-design/SKILL.md:56] [SOURCE: .opencode/skills/sk-design/SKILL.md:60] [SOURCE: .opencode/skills/sk-design/SKILL.md:64] [SOURCE: .opencode/skills/sk-design/SKILL.md:80] [SOURCE: .opencode/skills/sk-design/SKILL.md:90] [SOURCE: .opencode/skills/sk-design/SKILL.md:92] [SOURCE: .opencode/skills/sk-design/hub-router.json:4] [SOURCE: .opencode/skills/sk-design/hub-router.json:19]

## Proposed Parent Hub / Session Contract

| Contract layer | Desired behavior | OpenCode placement |
| --- | --- | --- |
| Persona | Speak and decide as a designer who uses code, not as a code generator with taste presets; push back when the work would get worse, defer to the user's goals, and hide internal skill names. | Parent `sk-design` identity and shared session copy. Keep mode names internal unless the operator explicitly asks about workflow. |
| Design Read | Read supplied assets, codebase/design-system pointers, screenshots, and prior context before asking or recommending. If context is absent and the task is hi-fi, ask for it or explicitly confirm inventing an aesthetic. | Parent preflight plus existing context manifest/proof-card contract; `md-generator` when measured CSS/design extraction is requested. |
| Question policy | One consolidated round for new/ambiguous work; ask only questions whose answers change design direction; skip for explicit scope, small tweaks, or follow-ups; after answers, proceed autonomously. | Parent session choreography; `discovery-questions` becomes an internal procedure card rather than a public advisor identity. |
| Procedure order | Discovery/context first, then aesthetic direction or system extraction, then production procedure, then review/polish. Typical greenfield chain: discovery -> aesthetic direction -> wireframe -> prototype -> polish; brand-aware chain: extraction -> variations -> tweakable -> polish. | Registry still resolves `interface`, `foundations`, `motion`, `audit`, or `md-generator`; procedure cards live inside packets or shared references. |
| Verification cadence | Verify after each substantive visual change and again before delivery; final polish aggregates accessibility, AI slop, hierarchy/rhythm, and interaction states. | Use `design-audit`, browser/tool verification, and implementation handoff checks; do not require Claude-style subagent fan-out as the only valid mechanism. |
| Output | Right artifact format for the medium; one file with toggles for variants when possible; skeleton surfaced early; final response is caveats/next steps, not a full change log. | Mode packet output sections plus parent summary rule; preserve OpenCode's concise progress style. |

## Ruled Out

- Creating 14 public `sk-design` advisor identities remains ruled out because the current hub is explicitly one advisor-routable skill with registry-driven internal mode resolution. [SOURCE: .opencode/skills/sk-design/SKILL.md:15] [SOURCE: .opencode/skills/sk-design/SKILL.md:41] [SOURCE: .opencode/skills/sk-design/mode-registry.json:9]
- Copying Claude's verifier-subagent requirement literally is ruled out; the durable behavior is verification after substantive visual changes and final polish, not the exact subagent transport. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:578] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/skills/polish-pass.md:22]
- Putting detailed per-mode design logic into the parent hub is ruled out because the existing hub forbids flattening mode instructions into the parent; the parent should own session invariants only. [SOURCE: .opencode/skills/sk-design/SKILL.md:64] [SOURCE: .opencode/skills/sk-design/SKILL.md:90] [SOURCE: .opencode/skills/sk-design/SKILL.md:98]

## Dead Ends

- `Glob` did not return `external/claude/skills/*.md` even though direct `Read` and `Grep` confirmed the directory and files were present; direct reads were used for cited procedural evidence.
- Treating output expectations as `interface`-only was eliminated because Claude applies artifact format, early skeleton, brief summary, and verification honesty across decks, prototypes, motion, and extraction-style work. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:535] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:565]

## Edge Cases

- Small tweaks and explicit follow-ups should bypass the discovery round, but only after reading any attached context. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:46] [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/skills/discovery-questions.md:27]
- If the user asks to recreate proprietary branded UI, the parent contract needs an IP boundary before routing into production modes. [SOURCE: .opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:586]
- If a prompt spans more than three design axes, the existing hub already escalates for explicit workflow order; the Claude-like contract should reuse that rather than forcing an over-bundled mode stack. [SOURCE: .opencode/skills/sk-design/SKILL.md:104]

## Sources Consulted

- `.opencode/specs/design/009-sk-design-claude-parity/research/deep-research-config.json:13`
- `.opencode/specs/design/009-sk-design-claude-parity/research/deep-research-state.jsonl:3`
- `.opencode/specs/design/009-sk-design-claude-parity/research/deep-research-strategy.md:48`
- `.opencode/specs/design/009-sk-design-claude-parity/research/iterations/iteration-002.md:84`
- `.opencode/specs/design/009-sk-design-claude-parity/external/claude/system-prompt.md:1`
- `.opencode/specs/design/009-sk-design-claude-parity/external/claude/skills/discovery-questions.md:1`
- `.opencode/specs/design/009-sk-design-claude-parity/external/claude/skills/polish-pass.md:1`
- `.opencode/skills/sk-design/SKILL.md:15`
- `.opencode/skills/sk-design/mode-registry.json:4`
- `.opencode/skills/sk-design/hub-router.json:4`
- `.opencode/skills/deep-loop-workflows/mode-registry.json:31`

## Assessment

- New information ratio: 0.86
- Novelty justification: 4 of 6 findings are fully new parent/session-contract synthesis, 2 extend iteration 2's mode-placement conclusions, and the contract table adds a compact model for Q4.
- Questions addressed: Q1 - Claude Design essence; Q4 - Parent hub contract; partial Q5 - verification cadence.
- Questions answered: Q4 now has a proposed parent hub/session contract that fits OpenCode's single advisor identity and registry model.
- Questions remaining: Q3 preservation details for backend starters/host protocols; Q5 benchmark/playbook proof.

## Reflection

- What worked and why: The Claude system prompt carried most parent-session evidence, while `discovery-questions` and `polish-pass` clarified the beginning and end of the session loop.
- What did not work and why: Directory globbing for Claude skill files failed unexpectedly, so direct reads and targeted grep were more reliable for cited evidence.
- What I would do differently: Next pass should turn this contract into benchmark scenarios and a migration checklist without editing `sk-design`.

## Recommended Next Focus

Define verification and benchmark proof for the refactor: scenarios that demonstrate the manager/designer persona, one-round question behavior, procedure-order routing, repeated review cadence, concise output expectations, and preservation of unique OpenCode affordances.
