Act as a documentation-coherence reviewer. READ-ONLY — modify nothing. Scope: the connection between the sk-doc/create-skill packet and the system-skill-advisor skill regarding root-level metadata JSON templates and creation guidelines.

Authority chain to verify against: .opencode/skills/sk-doc/create-skill/references/shared/skill-root-metadata-contract.md (the canonical contract, incl. its per-class template map) and the template assets under .opencode/skills/sk-doc/create-skill/assets/ (parent-skill/*.json and skill/*.json).

TASK — find every place that describes, instructs, or implies how the advisor-relevant JSON artifacts (description.json, graph-metadata.json, mode-registry.json, hub-router.json, leaf-manifest.json, leaf-aliases.json, leaf-manifest.config.json, command-metadata.json) are created or maintained, and check it AGREES with the canonical contract and links rather than restates:
1. .opencode/skills/system-skill-advisor/SKILL.md (whole file — especially the typed-leaf projection paragraph, rules, references, related-skills section)
2. .opencode/skills/system-skill-advisor/README.md and any references/*.md or feature-catalog docs that mention graph-metadata, description.json, leaf manifests, or "identity"
3. .opencode/skills/system-skill-advisor/mcp-server/ docs (README.md, lib/skill-graph/README.md, lib/cross-skill-edges/README.md)
4. .opencode/skills/sk-doc/create-skill/SKILL.md + references/parent-skill/*.md + references/shared/*.md — the reverse direction: do they correctly describe what the ADVISOR consumes (graph-metadata as the identity input, description.json as doctor-only)?
Report: contradictions, stale instructions (e.g. any remaining "keep leaf-aliases in sync by hand", references to overlay status of command-metadata, wrong file lists), missing cross-links in either direction, and restated-instead-of-linked content that will drift. For each: file:line, quote, and what the canonical contract says instead.
OUTPUT: findings-first `P0|P1|P2 | file:line | claim | quote + correction`, then REFUTED list, then `VERDICT: CLEAN` or `VERDICT: FINDINGS n`.
