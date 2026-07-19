# Iteration 4: Open Design Multi-Turn Scaffold

## Focus
Map Open Design's discovery/build/revision lifecycle into a reusable command scaffold.

## Actions Taken
1. Read the Open Design transport skill and parity reference.
2. Read the confirmed CLI run lifecycle.
3. Separated transport mechanics from design judgment.

## Findings
1. Open Design generation is deliberately multi-turn: turn 1 asks a discovery form about fidelity, data, and behavior and writes no files; answering it fires the build. A creation command must represent clarification as a lifecycle stage, not pretend one prompt always produces a design. [SOURCE: .opencode/skills/sk-design/design-mcp-open-design/SKILL.md:127-135] [SOURCE: .opencode/skills/sk-design/design-mcp-open-design/references/od-cli-reference.md:179-187]
2. The brief and discovery answers must be shaped by `sk-design` judgment before transport invocation. This directly validates the target architecture: command template orchestrates, mode decides, optional transport realizes. [SOURCE: .opencode/skills/sk-design/design-mcp-open-design/SKILL.md:20-24] [SOURCE: .opencode/skills/sk-design/design-mcp-open-design/SKILL.md:129-133]
3. Open Design's real-UI loop adds three creation-critical stages missing from visible command prompts: reuse an owned/matched system before generating, inspect the actual `previewUrl` rather than trusting file creation, and route targeted one-change revisions. [SOURCE: .opencode/skills/sk-design/design-mcp-open-design/references/design-parity-transport.md:22-40]
4. A style chooser is explicitly rejected. Resolve at most one system from subject and brief; exemplar grounding is evidence for a decision, not a gallery of vibes. [SOURCE: .opencode/skills/sk-design/design-mcp-open-design/SKILL.md:156-163]
5. The reusable lifecycle becomes `ground -> reuse/select one exemplar -> brief -> clarification checkpoint -> mode-owned plan -> build/render -> inspect -> targeted revise (max two) -> proof/handoff`. Open Design is one optional realization branch; commands must also work without it. [INFERENCE: based on findings 1-4]

## Questions Answered
- How Open Design contributes multi-turn discovery, render verification, and revision to the template.

## Questions Remaining
- How Aura packages reusable skills and references.
- The final namespace treatment of audit and md generation.

## Ruled Out
- Requiring Open Design for every `/interface:*` command.
- Surfacing Open Design's system library as an aesthetic menu.
- Treating file creation as proof that a design is complete.

## Assessment
- New information ratio: 0.82
- Novelty justification: Four source-backed lifecycle findings and one integrated scaffold are new.

## Reflection
- What worked: transport docs exposed the difference between generation and verified creation.
- What failed: a one-shot command model cannot express discovery, build, and revision honestly.
- Next adjustment: examine Aura's reusable skill/library model and reference attachment behavior.

## Recommended Next Focus
Analyze Aura skills as reusable prompt/workflow objects, including their metadata, reference sources, invocation model, and recommended frontend workflow categories.
