# Iteration 5: Aura Reusable Skill Model

## Focus
Extract how Aura packages reusable frontend/design prompt workflows and references.

## Actions Taken
1. Fetched the skills page, its static HTML, and `llms.txt`.
2. Inspected the shipped Skills route and skill data client bundles.
3. Mapped reusable packaging to the proposed command templates.

## Findings
1. Aura defines skills as reusable instructions for coding/design agents, invoked by referencing `@` in a prompt. Its public framing emphasizes repeatable workflows rather than one-off generated output. [SOURCE: https://aura.build/assets/Skills-DW2PxyfC.js]
2. The skill object is a portable prompt package: title, description, Markdown content, optional source URL, keywords parsed from frontmatter, provenance/author, visibility, views, and forks/uses. A creation command can borrow this explicit metadata/provenance shape without becoming a skill marketplace. [SOURCE: https://aura.build/assets/Skills-DW2PxyfC.js] [SOURCE: https://aura.build/assets/githubUtils-zKYT_cu2.js]
3. Aura's recommended frontend skill categories are concrete process slices: layout critique, responsive QA, animation review, accessibility checks, component polish, prompt review, and design-system alignment. This supports keeping mode-specific commands rather than one giant `/interface:design-everything`. [SOURCE: https://aura.build/assets/Skills-DW2PxyfC.js]
4. Aura's broader builder treats templates, components, assets, design systems, snippets, and prior projects as reference inputs while exporting portable frontend output. Exemplar grounding should therefore accept heterogeneous references and state their role, not only a screenshot or style name. [SOURCE: https://aura.build/llms.txt]
5. Source refresh converts GitHub URLs to raw content and stores the refreshed Markdown, making provenance and updateability first-class. The project-native analogue should record reference identity and preserve/transform/reject decisions, but read references live and avoid copying them into command files. [SOURCE: https://aura.build/assets/githubUtils-zKYT_cu2.js] [INFERENCE: mapped to the local no-copy design authority]

## Questions Answered
- Reusable prompt packaging and reference roles across all three external reference classes.

## Questions Remaining
- Final command names and whether audit fits the namespace.
- Exact per-command scaffolds.

## Ruled Out
- Treating Aura's library as evidence for a public style chooser.
- Storing exemplar bodies inside command prompts.

## Dead Ends
- The static `/skills` HTML contains only a client shell; useful evidence required the shipped route bundle and `llms.txt`.

## Assessment
- New information ratio: 0.76
- Novelty justification: Five findings add reusable package metadata, process taxonomy, and heterogeneous reference roles.

## Reflection
- What worked: inspecting the shipped route recovered content hidden by client rendering.
- What failed: static page extraction alone returned no skill cards.
- Next adjustment: synthesize external patterns into naming criteria and test the proposed mapping.

## Recommended Next Focus
Evaluate the five proposed `/interface:*` names against user-job clarity, creation versus evaluation semantics, mode mapping, and future namespace extensibility.
