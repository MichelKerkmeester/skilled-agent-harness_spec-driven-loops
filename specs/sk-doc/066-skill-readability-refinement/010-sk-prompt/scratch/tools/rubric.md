REVIEW RUBRIC (apply in this order):
1. The sk-doc template for the file type: references follow .skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md, assets skill-asset-template.md, SKILL.md skill-md-template.md, ROUTER.md skill-router-template.md, README.md the sk-doc readme template (.skilled/skills/sk-doc/sk-create-readme/assets/). Read the matching template before judging a file.
2. Render checks at zero: `JEV_FEATURES=0 python3 -B .skilled/skills/sk-doc/scripts/validate_document.py <file> --json` lists render_* warnings (joined bold labels, setext headings, bare URLs, compound or empty overviews, repeated labels or sentences, letter-suffixed or unnumbered H2s, related resources not last, intro restating Purpose).
3. The intro after the H1 is a 1-2 sentence hook and does not restate the Purpose. A hook tells the reader when to open the file or what they get from it, in words the Purpose does not use. A pointer sentence ("The sections below cover...", "This reference explains...", "The examples below show...") is not a hook: never propose one, and flag one that exists. An intro that already works as a hook stays, even if it shares a few words with the Purpose. Before replacing an intro, confirm that every claim it makes also appears in the overview.
4. The overview opens with Purpose and When to Use.
5. A governing decision (a trust rule, a transport choice, a skip gate) comes before the steps it governs.
6. Sections and items sit in the order a reader uses them, not the order they were written.
7. A paragraph that packs several mechanisms becomes a list. Tables stay tables.
8. An index lists every file of the directory it indexes.
9. No status tokens, authoring history or ephemeral ids (spec paths, phase or task numbers) in the body.
10. Integer section numbers; a related-resources section, when present, comes last (before a trailing MACHINE ROUTER).
NEVER change what a rule, contract, instruction or example says. Text may move, split, merge or be reformatted; every claim must survive. Keep rule ids, frontmatter keys, code blocks, JSON blocks, intent names, keywords and resource paths exactly.

Inbound references are frozen. A heading listed under INBOUND REFERENCES keeps its exact text. A file listed there with numbered-section or line references keeps the order and numbers of its H2 sections: never move, insert, merge or renumber its H2s. Line references are rechecked by hand when the skill is committed. Reorder inside a section instead. Never propose a change that would break one of those references.
