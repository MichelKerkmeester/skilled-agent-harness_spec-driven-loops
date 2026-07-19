# Iteration 8: `/interface:design` Creation Template

## Focus
Specialize the shared skeleton for end-to-end interface direction and redesign.

## Findings
1. **Brief intake:** resolve target/surface, subject, audience, single job, Brand/Product register, pinned axes, existing system/components, real content/data, preserve/never-change constraints, desired fidelity, output surface, and proof bar. If subject/audience/job are absent, make one bounded assumption and state it; ask one question only when route or acceptance changes. [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/brief-to-dials.md:48-62]
2. **Exemplar grounding:** search owned system first; then select at most one subject-fit corpus or shipped-UI anchor plus an optional contrast/rejected default. Record source, role, provenance, preserve/transform/reject, and the counterfactual changed. `no-fit` is valid. [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:200-206]
3. **Scaffolded flow:** `Context Manifest -> Design Read/register+dials -> interface mode + foundations build bundle -> one procedure card -> compact token system + layout/wireframe + signature -> anti-default critique/revision -> optional direction approval -> real-UI reuse/render/check/revise loop -> interface preflight -> handoff`. [SOURCE: .opencode/skills/sk-design/SKILL.md:155-184] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/real-ui-loop.md:33-40]
4. **Mode boundary:** the command names stages and passes the resolved brief/grounding record to `workflowMode=interface`; it does not prescribe palettes, typefaces, signatures, or aesthetic rules. `foundations` is an ordered supporting mode for build/redesign, not a replacement route. [SOURCE: .opencode/skills/sk-design/SKILL.md:166-172]
5. **Visible output:** `Design Read`, `Resolved Brief`, `Grounding Record`, `Direction Plan` (tokens/layout/signature), `Critique Revision`, `Interface Direction Spec`, `Preflight Proof`, and accepted `sk-code` handoff. [SOURCE: .opencode/skills/sk-design/shared/sk-code-handoff.md:50-59]

## Prompt Template
```text
Create or reshape the interface for {target}. First resolve {subject, audience, oneJob, register, pinnedAxes, existingSystem, contentData, preserve, fidelity, proof}. State only assumptions that materially affect direction. Ground in the owned system first; otherwise choose one brief-fit reference as evidence, never a style menu. Load sk-design mode interface (plus the required foundations build bundle when producing a UI). Show the mode/procedure/proof plan. Ask the mode to produce and critique a brief-specific token/layout/signature plan before any build handoff. If a real render is produced, inspect it, route targeted revisions, and run the interface proof gates. Return the eight visible output blocks and hand off only accepted decisions through the shared schema.
```

## Ruled Out
- Embedding preferred palettes, fonts, layouts, or signature patterns in the command.
- Auto-building before direction approval on ambiguous high-fidelity work.

## Assessment
- New information ratio: 0.62
- Novelty justification: First complete per-command template; shared stages are specialized with interface fields and outputs.

## Recommended Next Focus
Specialize the template for static foundations, including axis routing, measured-vs-authored boundary, token scaffold, deterministic downstream checks, and handoff.
