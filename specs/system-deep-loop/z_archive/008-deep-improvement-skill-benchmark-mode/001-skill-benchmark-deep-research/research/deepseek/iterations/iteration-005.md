# Iteration 5 (DeepSeek-v4-pro): RQ6 — Exhaustive Rename Surface + Safe Ordering

## Focus

RQ6: exhaustive rename surface map + SAFE ORDERING for `deep-agent-improvement` → `deep-improvement`, covering every surface that names the old id, dangling-reference risks, and the phase-gating constraint: must the rename happen before Lane C (`skill-benchmark`) is built, or after?

---

## Actions Taken

1. **Read** `deep-agent-improvement` SKILL.md in its entirety to catalog every self-reference, frontmatter field, trigger phrase, keyword comment, integration-point entry, and script-path prefix that carries the old name. [SOURCE: .opencode/skills/deep-agent-improvement/SKILL.md]

2. **Read** the canonical agent file `.opencode/agents/deep-agent-improvement.md` to inventory frontmatter, body-text, skill-reference-table, and command-path self-references. [SOURCE: .opencode/agents/deep-agent-improvement.md]

3. **Read** the TypeScript skill-advisor scorer to extract exact alias-group keys and phrase-boost entries that hard-code `deep-agent-improvement`. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:27-32] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:116-138]

4. **Read** the Python skill-advisor shim to confirm the parallel alias + phrase-boost surface that must stay in sync with the TS implementation. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:250-254] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:1577-1790]

5. **Glob-surveyed** all runtime mirror directories and confirmed four agent mirror files exist with the old name. [SOURCE: glob results — .claude/agents/deep-agent-improvement.md, .codex/agents/deep-agent-improvement.toml, .gemini/agents/deep-agent-improvement.md, .opencode/agents/deep-agent-improvement.md]

6. **Read** both deep-loop command files (`start-agent-improvement-loop.md`, `start-model-benchmark-loop.md`) to count body-text, step-instruction, `load skill`, example, and notes-section references to the old skill path and agent name. [SOURCE: .opencode/commands/deep/start-agent-improvement-loop.md] [SOURCE: .opencode/commands/deep/start-model-benchmark-loop.md]

7. **Read** the Phase 002 rename spec to confirm the scope expectations and success criteria that Phase 001 must inform. [SOURCE: .opencode/specs/skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/002-skill-rename-deep-improvement/spec.md:38-55]

8. **Read** the skill's own `graph-metadata.json` — skill_id, derived trigger_phrases, derived key_files, derived entities all name the old id. [SOURCE: .opencode/skills/deep-agent-improvement/graph-metadata.json:1-181]

9. **Read** `system-skill-advisor/graph-metadata.json` — the enhances edge with target `deep-agent-improvement` that must be updated. [SOURCE: .opencode/skills/system-skill-advisor/graph-metadata.json:70-73]

10. **Read** `sk-prompt-models/SKILL.md` to inventory cross-skill references. No explicit `deep-agent-improvement` reference was found in the body text at lines 1-229; the sentinel's graph-metadata.json may carry auto-inferred edges but the SKILL.md text itself does not directly name `deep-agent-improvement`. [SOURCE: .opencode/skills/sk-prompt-models/SKILL.md:1-229]

11. **Read** `AGENTS.md` to confirm the agent routing entry. [SOURCE: AGENTS.md:349]

---

## Findings

### F-DEEPSEEK-I5-01: Skill Directory Rename (git mv) Is the Root Mutation — Everything Flows From It

The directory `.opencode/skills/deep-agent-improvement/` contains 65+ files. The skill's self-contained script paths (YAML `scripts:`, SKILL.md §11) all prefix with `.opencode/skills/deep-agent-improvement/`. A `git mv` of the directory is the single best-preserving mutation. Every internal path reference inside the skill becomes correct by construction, since relative paths inside the tree are unchanged and absolute-skill-root paths are relative to `SKILL_ROOT`, which moves atomically with the directory. However, any external reference that hard-codes `.opencode/skills/deep-agent-improvement/` as a string literal (command YAMLs, command .md files, advisor Python shim) will break and must be updated separately.

**Actionable**: `git mv .opencode/skills/deep-agent-improvement .opencode/skills/deep-improvement` is the correct first step. All script-intent references that use `__dirname` or `SKILL_ROOT` resolution inside the skill will self-heal. Command YAML `scripts:` blocks and inline `node .opencode/skills/deep-agent-improvement/...` references will NOT self-heal.

**Surface count**: ~18 YAML script-path references across 4 YAML files, plus ~12 inline path references in the two command .md files.

### F-DEEPSEEK-I5-02: Skill-Advisor Has THREE Independent Representations — All Must Be Updated

The advisor names `deep-agent-improvement` in three decoupled locations:

**(a) TypeScript alias group** (`aliases.ts:27-32`): The canonical canonical-id key `'deep-agent-improvement'` and four alias strings must be updated. The group maps `command-spec-kit-deep-agent-improvement`, `/deep:start-agent-improvement-loop`, `deep-agent-improvement`, `sk-deep-agent-improvement`. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:27-32]

**(b) TypeScript phrase-boost matrix** (`explicit.ts:116-138`): Ten phrase entries carry positive boosts to `deep-agent-improvement` (e.g., `'5d scoring': [['deep-agent-improvement', 1.5]]`) and seven entries carry negative penalties to `deep-agent-improvement` for benchmark-vs-agent-improvement disambiguation (e.g., `'benchmark a model': [['deep-model-benchmark', 1.6], ['deep-agent-improvement', -0.6]]`). After rename, the negative penalties become inert (targeting a non-existent skill id), which is non-breaking but degrades the disambiguation quality. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:116-138]

**(c) Python shim** (`skill_advisor.py`): The alias group at line 250-254 mirrors the TS alias group. The lexical phrase-boost matrix at lines 1577-1790 carries 35+ entries mapping phrases to `deep-agent-improvement`. Both must be updated; missing either creates a split-brain if the shim is ever used as a fallback. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:250-254] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:1577-1790]

**Additional**: The compiled `skill-graph.json` and regression fixtures (`regression_cases.jsonl:42-45`, four P1 cases with `expected_top_any: ["sk-deep-agent-improvement"]`) also carry the old name. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/scripts/skill-graph.json:27,87,187,221,278] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/scripts/fixtures/skill_advisor_regression_cases.jsonl:42-45]

**Actionable**: Update aliases.ts, explicit.ts, skill_advisor.py, and skill-graph.json in one atomic commit, then run `advisor_rebuild` + `advisor_validate` to regenerate the compiled graph and confirm regression suites pass with the new ids.

### F-DEEPSEEK-I5-03: Four Agent Runtime Mirrors — Each Has a `deep-agent-improvement` File

All four agent mirror directories contain a file whose name and frontmatter reference the old skill id:

- `.opencode/agents/deep-agent-improvement.md` — frontmatter `name: deep-agent-improvement`, body text, skill-reference-table, routing scan
- `.claude/agents/deep-agent-improvement.md`
- `.codex/agents/deep-agent-improvement.toml`
- `.gemini/agents/deep-agent-improvement.md`

If the directory is renamed via `git mv` but these four mirror files are not updated, the agent name `deep-agent-improvement` will continue to resolve in the runtime but will point at a no-longer-existent skill, causing broken dispatches for Lane A candidates. The old agent name in the running system would produce a confusing `skill deep-agent-improvement not found` on every `/deep:start-agent-improvement-loop` invocation.

**Actionable**: Rename all four mirror files concurrently with the skill directory rename. The `.codex` mirror uses `.toml` format; verify that its internal `[skill]` or `[agent]` key also gets updated.

### F-DEEPSEEK-I5-04: Command Files Carry ~30 Hard-Coded Path/Skill References

The two deep-loop command files (`start-agent-improvement-loop.md`, `start-model-benchmark-loop.md`) each contain approximately 15 references to `deep-agent-improvement`:

- **Skill load instructions**: `Read(".opencode/skills/deep-agent-improvement/SKILL.md")` — Step 1 in both commands
- **Script paths**: ~12 `node .opencode/skills/deep-agent-improvement/scripts/...` calls per command
- **YAML role text**: "Agent Improvement Specialist using deep-agent-improvement" / "Model Benchmark Specialist using deep-agent-improvement"
- **Agent dispatch**: `"Dispatch @deep-agent-improvement to write one bounded candidate"` — if the agent is renamed to `@deep-improvement`, this must change
- **Skill dependency notes**: "Requires `deep-agent-improvement` at `.opencode/skills/deep-agent-improvement/`"

The four YAML workflow assets (`deep_start-agent-improvement-loop_{auto,confirm}.yaml`, `deep_start-model-benchmark-loop_{auto,confirm}.yaml`) each have `skill: deep-agent-improvement` and ~18 script-path references. Combined, this is ~90 surface edits across 6 files.

**Actionable**: A find-and-replace pass across the 6 files is straightforward but high-volume. The YAML `skill:` field change is critical — if the YAML references `deep-agent-improvement` but the skill directory is now `deep-improvement`, the workflow will not resolve the skill.

### F-DEEPSEEK-I5-05: Skill-Advisor `enhances` Edge — Must Be Updated Before `advisor_rebuild`

The `system-skill-advisor/graph-metadata.json` carries an enhances edge:

```json
{"target": "deep-agent-improvement", "weight": 0.7, "context": "routes agent improvement requests"}
```

[SOURCE: .opencode/skills/system-skill-advisor/graph-metadata.json:70-73]

After rename, this edge must target `deep-improvement`. If the edge is not updated before `advisor_rebuild`, the rebuilt graph will either have a dangling target or (if the edge is auto-inferred) may auto-correct — but auto-inference is fragile and should not be relied upon. The safest path is to update the edge manually, then run `advisor_rebuild`.

### F-DEEPSEEK-I5-06: AGENTS.md Routing Entry — One-Line Fix

Line 349 of `AGENTS.md` reads:

```
- **`@deep-agent-improvement`** - Bounded agent improvement via `deep-agent-improvement`. Dispatched by `/deep:start-agent-improvement-loop`
```

[SOURCE: AGENTS.md:349]

This is a one-line fix, but it is a root-docs surface visible in every session. If missed, it will display stale agent names in future `@deep-improvement` experiments.

### F-DEEPSEEK-I5-07: Skill's Own `graph-metadata.json` — Nine Surfaces

The skill's `graph-metadata.json` carries the old name in:

1. `skill_id: "deep-agent-improvement"` — the canonical identifier
2. `derived.trigger_phrases[7]` = `"deep-agent-improvement"` — doubled with [8] which is also `"deep-agent-improvement"`
3. `derived.key_topics` — has `"agent-improvement"` (general term, probably correct as-is since it describes the Lane A concept)
4. `derived.key_files[]` — 12 entries prefixed with `.opencode/skills/deep-agent-improvement/`
5. `derived.entities[]` — 11 entities with `path` fields prefixed with `.opencode/skills/deep-agent-improvement/`, plus 2 agent entities named `@deep-agent-improvement`
6. `derived.source_docs[]` — paths

[SOURCE: .opencode/skills/deep-agent-improvement/graph-metadata.json:1-181]

The `skill_id` change is critical for advisor resolution. The `key_files` and `entities` paths will auto-correct after `git mv` + re-index. The `intent_signals` and `trigger_phrases` may still carry the old name and should be manually reviewed.

### F-DEEPSEEK-I5-08: HARD GATE — Rename MUST Precede Lane C Build

Prior iterations established that Lane C's benchmark harness resolves the skill root dynamically to find `INTENT_SIGNALS`, `RESOURCE_MAP`, and `RUNTIME_ASSETS`. Building Lane C against the old directory path and then renaming would require rebuilding all trace-normalization roots. This is the critical phase-gating constraint.

**Analysis**: Lane C must introspect the target skill to discover its smart-router surface, resource maps, trigger phrases, and intent signals. If Lane C is built against `.opencode/skills/deep-agent-improvement/` but the directory is later renamed, every hard-coded path constant in the benchmark harness breaks, and every stored benchmark trace references the wrong root. The cost of rebuilding Lane C's trace-normalization after a rename (re-running benchmarks, re-deriving profiles, re-verifying results) exceeds the cost of building Lane C against the correct final name from the start.

**Conclusion**: Phase 002 (rename) MUST complete before Phase 003 (Lane C build). The reverse ordering — build Lane C first, rename later — is technically possible but creates a mandatory Lane C remediation phase that adds risk with no offsetting benefit. Phase 002 blocks Phase 003.

**Exception**: Phase 001 (this research loop) and Phase 002 can run concurrently before Phase 003 starts, since Phase 001 is read-only research that does not mutate the skill directory.

---

## Recommendations

1. **Produce the four-column freeze inventory before any rename step.** File | Classification (active-operational | active-documentation | generated/cache | historical/archive) | Action | Verification for every `deep-agent-improvement` hit. The grep survey confirms 44,000+ hits, overwhelmingly in logs/archives/research artifacts that do NOT need updating. The active-operational surface is ~12 files. This inventory is the gate for Phase 002 success criteria. [F-DEEPSEEK-I5-01 through I5-07]

2. **Execute git mv as a dedicated commit** so history is bisectable. `git mv .opencode/skills/deep-agent-improvement .opencode/skills/deep-improvement` — confirm the move preserves `git log --follow` on all files.

3. **Update the skill-advisor surfaces in one atomic commit** covering aliases.ts, explicit.ts, skill_advisor.py, skill-graph.json, regression fixtures, and graph-metadata.json. Run `advisor_rebuild` + `advisor_validate` immediately to confirm green. [F-DEEPSEEK-I5-02, I5-05]

4. **Rename the four agent mirror files in the same commit as the git mv** so the agent-to-skill mapping stays atomic. [F-DEEPSEEK-I5-03]

5. **Run a bulk find-and-replace across the 6 command files** (2 .md + 4 YAML). The high volume (~90 edits) means a scripted approach with `sed` or `rg -l` + manual verification per file is safer than hand-editing. [F-DEEPSEEK-I5-04]

6. **Update AGENTS.md line 349** in the same pass. [F-DEEPSEEK-I5-06]

7. **Regenerate description.json + re-index graph-metadata.json** for the skill after rename. `memory_index_scan` on the new spec folder, then `memory_save` on the freshly renamed skill's SKILL.md, description.json, and graph-metadata.json. [F-DEEPSEEK-I5-07]

8. **Update or remove the negative phrase-penalties in explicit.ts and skill_advisor.py** that target `deep-agent-improvement`. After rename these are inert. Either map them to `deep-improvement` if the Lane A vs Lane B disambiguation semantics should be preserved, or remove them and let the advisor's lane-scoring logic handle disambiguation on its own. [F-DEEPSEEK-I5-02]

9. **Run `rg 'deep-agent-improvement' --files-with-matches` post-rename** and classify every remaining hit. Active-operational hits are bugs; historical/archive hits are expected. The Phase 002 success criterion of "zero dangling operational old-name references" should be verified against this grep. [F-DEEPSEEK-I5-08]

10. **Phase ordering**: Complete Phase 002 (rename) before starting Phase 003 (Lane C build). Phase 001 (this research) can finalize concurrently with Phase 002 startup since it is read-only. [F-DEEPSEEK-I5-08]

---

## Open Questions

**OQ-DEEPSEEK-I5-01**: Should the post-rename advisor keep backward-compatible aliases (`deep-agent-improvement` → `deep-improvement` as a transient alias) so that old command strings and skill mentions continue to work during a transition window? This would ease migration but would leave the old name as an active operational reference, conflicting with the "zero dangling old-name references" success criterion. The alternative is a hard cutover where old names produce a clear error with migration guidance. Decision belongs to Phase 002.

**OQ-DEEPSEEK-I5-02**: Should the `deep-model-benchmark` alias group also be renamed (e.g., to `deep-benchmark` or kept as-is) when `deep-agent-improvement` becomes `deep-improvement`? The current architecture describes Lane B as "a MODE of the deep-agent-improvement skill" — after rename, this becomes "a MODE of the deep-improvement skill." If the model-benchmark alias group keeps its old name, it introduces naming asymmetry (the skill is `deep-improvement` but one of its lanes is `deep-model-benchmark`). If renamed, it introduces more surface edits. Decision belongs to Phase 002 decision-record.

**OQ-DEEPSEEK-I5-03**: What is the exact relationship between `sk-prompt-models`'s `graph-metadata.json` enhances edges and the rename? The SKILL.md body does not explicitly name `deep-agent-improvement`, but the advisor's auto-inference may have created an enhances edge. This edge should be checked after `advisor_rebuild` runs post-rename. If present, it may auto-correct; if not, it's a non-issue.

**OQ-DEEPSEEK-I5-04**: Should the `/deep:start-agent-improvement-loop` command verb be renamed to `/deep:start-improvement-loop`? The Phase 002 spec currently states "command verbs are NOT renamed unless Phase 001 shows a reason." This research finds that keeping the agent-improvement command verb under the new `deep-improvement` skill creates a mild naming asymmetry but is not a functional problem — the command verb describes what the lane does (improve agents), which is still accurate. The rename impact is zero if the verb is kept, and ~4 file renames + ~20 command-bodies edits if changed. Recommendation: keep the verb unchanged, document the asymmetry explicitly in Phase 002 decision-record.

**OQ-DEEPSEEK-I5-05**: The `description.json` file for the skill is auto-generated by `generate-context.js`. Should Phase 002 manually edit the old `description.json` before running `generate-context.js`, or should it delete it and regenerate fully? Both approaches produce the same result; regeneration is simpler and avoids stale-field carryover.
