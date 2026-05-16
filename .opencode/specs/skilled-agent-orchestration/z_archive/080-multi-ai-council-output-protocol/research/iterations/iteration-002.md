# Iteration 2: Q2 §17 placement

## Focus

Answer Q2: decide whether the new §17 Caller Persistence Protocol belongs in `.opencode/agents/multi-ai-council.md`, in `.opencode/skills/system-spec-kit/references/multi-ai-council/`, or split across both surfaces.

The upstream dependency is Q3: the §8 shared schema artifact should not be designed until the canonical location of caller-facing protocol language is clear.

## Actions Taken

- Read current strategy/state to determine iteration number and avoid repeating iteration 1's Q1 helper-script work.
- Inspected `.opencode/agents/multi-ai-council.md` headings and relevant body sections.
- Inspected the four existing `.opencode/skills/system-spec-kit/references/multi-ai-council/*.md` files.
- Inspected `.opencode/agents/orchestrate.md`, packet 080's `ai-council/council-report.md`, and `decision-record.md` for caller patterns, ADR constraints, and round-2 ADD requirements.

## Findings

### 1. §17 should be added to the agent body, but kept short

The agent body is already the operator-facing contract surface for the council protocol. It contains §12 Output Protocol, §13 Invocation Contract, §14 State Schema, and §15 Convergence Signal at `.opencode/agents/multi-ai-council.md:579`, `.opencode/agents/multi-ai-council.md:607`, `.opencode/agents/multi-ai-council.md:617`, and `.opencode/agents/multi-ai-council.md:641`.

That means a caller who loads the agent body before dispatch already sees the artifact folder contract, invocation lifecycle, state events, and convergence rule. A new §17 belongs beside those sections because it changes caller behavior after council output returns.

Keep §17 concise:

- Name the caller persistence responsibility.
- Preserve the §0 planning-only invariant.
- Enumerate the four caller patterns from the round-2 addendum.
- Show the helper invocation shape and exit-code handling.
- Point long details to references.

This avoids a hidden protocol that only exists in reference docs a caller may not load.

### 2. A reference-only §17 would conflict with ADR-001's "agent body is the source of truth" consequence

ADR-001 explicitly keeps the convention lightweight by avoiding a dedicated `.opencode/skills/multi-ai-council/` folder, and says "all logic stays in the agent body plus 4 reference files" at `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/decision-record.md:57`.

The same ADR says the agent body must absorb folder-layout and protocol responsibilities, with detail spilled to references only if the body crosses roughly 750 LOC at `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/decision-record.md:71`. The current body is 689 LOC. A short §17 can fit below the threshold; a long, example-heavy §17 probably should not.

So the right reading is not "reference file instead of agent body." It is "agent body owns the normative caller protocol; references hold expanded examples and schema detail."

### 3. Round-2 already requires §17 in the agent body

The amended council plan says Step 2 is to update agent body §13 and add §17 Caller Persistence Protocol. It specifies that §17 should include a copy-paste helper snippet, exit codes, resulting layout, and preserve §0 verbatim at `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/ai-council/council-report.md:74` through `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/ai-council/council-report.md:80`.

The same report's ADD-1 says §17 must enumerate all four caller patterns and that the helper must be standalone-invokable for top-level Task dispatch and CLI-skill manual dispatch at `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/ai-council/council-report.md:131` through `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/ai-council/council-report.md:139`.

That is direct evidence for agent-body placement. The open design question is only how much goes there.

### 4. References should receive the expanded protocol, not replace §17

The existing references already split stable detail out of the agent body:

- `folder-layout.md` documents the artifact home and cross-references ADR-002/ADR-004.
- `state-format.md` documents events, resume semantics, and convention-only validation.
- `convergence-signals.md` documents default convergence and validator graduation.
- `seat-diversity-patterns.md` documents lens and vantage recipes.

This pattern supports adding a new `caller-persistence-protocol.md` reference, or expanding `folder-layout.md` if the team wants to keep exactly four files. My read is to add a fifth reference only if the §17 examples are longer than about 40 lines or include separate recipes for all four caller patterns. Otherwise §17 can carry the recipe directly and reference `folder-layout.md` plus `state-format.md`.

### 5. Depth-1 behavior must be in the agent body

The `@orchestrate` agent lists `@multi-ai-council` as a LEAF target at `.opencode/agents/orchestrate.md:97`, includes it in task format at `.opencode/agents/orchestrate.md:192`, and warns that LEAF agents must not dispatch sub-agents at `.opencode/agents/orchestrate.md:749`.

The multi-ai-council body itself already switches behavior by depth: Depth 0 may dispatch seats, while Depth 1 uses inline sequential reasoning at `.opencode/agents/multi-ai-council.md:37` through `.opencode/agents/multi-ai-council.md:44`.

Because Depth 1 agents cannot call a persistence helper after returning to their parent, the "parent owns helper invocation" rule must be visible in the agent body. The round-2 ADD-4 states exactly that at `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/ai-council/council-report.md:155` through `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/ai-council/council-report.md:157`.

## Questions Answered

- Q2 answered: §17 belongs in the agent body as the normative caller protocol, with long examples and schema detail delegated to references when they would push the body toward the ADR-001 spill threshold.

## Questions Remaining

- Q3 remains: the §8 OUTPUT FORMAT shared schema artifact should now be designed as a reference artifact that the agent body's §8 and the helper parser both cite.
- Q4 remains: validator awareness is still separate. ADR-004 currently says `ai-council/` remains free-form.
- Q6 remains: any §17 update must be mirrored across the four runtime agent surfaces; this iteration did not inspect the mirror-sync mechanism.

## Next Focus

Iteration 3 should answer Q3: define the §8 shared output-schema artifact. The starting recommendation is a markdown contract under `.opencode/skills/system-spec-kit/references/multi-ai-council/output-schema.md`, with fixture coverage for the helper parser if packet 081 implements the helper.
