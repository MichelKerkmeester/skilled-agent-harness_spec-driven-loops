Act as a schema-fidelity reviewer. READ-ONLY — modify nothing. Scope: would a JSON artifact authored purely from the create-skill templates actually satisfy every consumer — the fleet gate, the doctor, AND system-skill-advisor's ingestion?

Templates under .opencode/skills/sk-doc/create-skill/assets/: parent-skill/parent-skill-description-template.json, parent-skill-graph-metadata-template.json, parent-skill-registry-template.json, parent-skill-hub-router-template.json, parent-skill-command-metadata-template.json, parent-skill-leaf-aliases-template.json; skill/skill-graph-metadata-template.json, skill/skill-leaf-manifest-config-template.json.

Consumers to check field-by-field against each template:
1. Advisor ingestion: .opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/skill-graph-db.ts (schema versions accepted, skill_id/folder match, SkillFamily enum, edges/domains/intent_signals/derived validation, one-identity ingestion guard) and lib/cross-skill-edges/metadata-loader.ts
2. Doctor: .opencode/commands/doctor/scripts/parent-skill-check.cjs (rules 1b/1c, 3a-3j, 5a, 8a/8b, 11)
3. Fleet gate + libs: .opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs, scripts/lib/command-metadata-schema.cjs, scripts/lib/leaf-resource-contract.cjs, scripts/generate-leaf-manifest.cjs
4. Scaffolder equivalence: do skill/skill-graph-metadata-template.json and skill/skill-leaf-manifest-config-template.json really mirror what scripts/init_skill.py emits (compare field-for-field)? Does the parent scaffold in init_skill.py emit everything parent-skill templates promise?
For every template: list fields a consumer REQUIRES that the template omits, fields the template shows that a consumer REJECTS or ignores misleadingly, placeholder values that would fail validation if left semi-filled (e.g. family values, schema_version, keyword shapes), and any instructional note that misstates gate behavior.
OUTPUT: findings-first `P0|P1|P2 | template | claim | evidence file:line`, REFUTED list, `VERDICT: CLEAN` or `VERDICT: FINDINGS n`.
