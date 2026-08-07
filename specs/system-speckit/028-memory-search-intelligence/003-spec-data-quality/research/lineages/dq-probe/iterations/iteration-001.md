# Iteration 1: Inventory of automated quality machinery and its coverage gaps across the spec-kit surface

## Focus

Map every automated on-write and retroactive data-quality mechanism that already exists across the spec-kit knowledge surface, then identify which segments of that surface (skill docs, references, command docs, context-engineering prompts/assets) are NOT covered. This is the net-new question the parent packet did not answer: the parent stopped at spec docs + the two metadata JSONs + retrieval code.

## Actions Taken

1. Enumerated the spec-folder validator surface (`find rules/check-*.sh`) and read the canonical wiring at `validator-registry.json`.
2. Read the active git `pre-commit` hook to find the real on-write automation backbone.
3. Located and read the sk-doc Document Quality Index (DQI) machinery and its quality gates.
4. Searched for a corpus-wide / retroactive quality runner and for the generate-context post-save review.

## Findings

### F1: The spec-folder gate is deep but every one of its 33 rules is spec-doc-scoped

`validator-registry.json` wires 33 rules. Every rule carries `category` ∈ {`authored_template`, `operational_runtime`, `structural`}, and every target is a spec-folder artifact: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, or the two metadata JSONs (`description.json`, `graph-metadata.json`). [SOURCE: file:.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json:1-313] No rule targets a `SKILL.md`, a `references/*.md`, a command doc, or a context-engineering asset. The deepest, most mature quality gate in the repo is structurally blind to the largest part of the knowledge surface.

### F2: validate.sh is a completion-time manual gate, not an on-write automated one

The spec-folder gate runs via `bash .../validate.sh <spec-folder> --strict` and is invoked by the COMPLETION VERIFICATION RULE (claiming "done"/"complete") [SOURCE: file:CLAUDE.md COMPLETION VERIFICATION RULE]. It is NOT wired into the commit hook (see F3). So even for spec docs, the quality gate is human-triggered at completion, not enforced automatically on every write.

### F3: The real on-write backbone is the pre-commit hook, and it gates code/MCP/prompt surfaces, never doc data-quality

The active `pre-commit` hook runs five gates [SOURCE: file:.git/hooks/pre-commit]:
- doc-model-refs drift (advisory, non-blocking) — only checks that docs cite canonical model names from `registry.ts`.
- comment-hygiene (blocking) — code comments only.
- prompt-knowledge card-sync (blocking) — fires only for `cli-*`, `sk-prompt`, `sk-prompt-models` paths.
- MCP mutation-class (blocking) — fires only for `mcp-*` install/doctor scripts.
- tool-ownership map (blocking) — MCP TOOL_DEFINITIONS only.

None of these run `validate.sh`, none compute a DQI, none inspect `trigger_phrases`/`importance_tier`/`contextType` frontmatter, and none assess retrieval-shaping or adherence quality of any doc. The on-write automation that DOES exist is for code/tool/prompt-registry integrity, not for document data quality.

### F4: A real deterministic DQI scorer EXISTS but is never automated (reuse-first lever, half-built)

sk-doc ships `extract_structure.py`, which computes a 100%-deterministic Document Quality Index (0-100: Structure 40 / Content 30 / Style 30), is type-aware (skill, command, reference, readme, spec, template, flowchart), and runs 14 SKILL-specific checks including frontmatter presence, `name` hyphen-case, single-line `description`, `allowed-tools` array shape, and required sections. It defines per-type quality gates ("SKILL.md: no checklist failures allowed; Command: strict; Reference: no critical failures"). [SOURCE: file:.opencode/skills/sk-doc/references/global/validation.md:177-310] But this scorer is invoked manually during doc authoring; it is not wired into any hook, into `validate.sh`, or into a retroactive corpus sweep. This is the exact parent-packet pattern: the lever already exists and the work is wiring, not inventing.

### F5: The largest retrieval-and-adherence surface carries live retrieval signals with zero automated quality gate

Every skill reference I read carries `trigger_phrases`, `importance_tier`, and `contextType` frontmatter (e.g. `loop_protocol.md`, `state_format.md`, `validation.md` headers). These are precisely the write-time retrieval and adherence signals the parent's truncation law says BYPASS the 3-result prod floor. Yet the DQI checks only frontmatter presence/format, not `trigger_phrase` quality (coverage, duplication, retrieval value), and no gate validates this metadata at all on the skill/reference/command surface. The cheapest-win class identified by the parent (write-time, floor-bypassing) is wholly ungated on the biggest doc surface.

### F6: generate-context.js carries a post-save quality review, but only for spec-folder continuity

`post-save-review.ts` runs after `generate-context.js` and emits HIGH/MEDIUM quality issues (title, trigger_phrases, importance_tier) [SOURCE: file:.opencode/skills/system-spec-kit/scripts/core/post-save-review.ts; CLAUDE.md Post-Save Review]. This is the ONE place trigger_phrase quality is auto-reviewed, but it fires only on a spec-folder memory save, not on skill-doc or command-doc writes, and its fixes are hand-applied by the AI, not auto-enforced.

## Questions Answered

- Q1 (ANSWERED): The automated machinery is bifurcated and surface-incomplete. Spec docs get a deep 33-rule gate (`validate.sh`) that is manual-at-completion. Code/MCP/prompt-registry surfaces get blocking on-write commit gates. The sk-doc DQI scorer is real, deterministic, and type-aware but never automated. Skill docs, references, command docs, and context-engineering assets — the largest retrieval/adherence surface, and the one carrying floor-bypassing write-time signals — have NO automated on-write or retroactive data-quality gate.

## Questions Remaining

- Q2: Which document-refinement and context-engineering automations maximize AI adherence and logic reading, and do they bypass or pay the truncation floor?
- Q3: The highest-ROI ranked set of out-of-the-box automated features to perfect data quality across the FULL surface.

## Dead Ends

- Searching for a corpus-wide retroactive doc-quality runner returned nothing wiring the DQI across the surface; the batch examples in `validation.md:506-522` are illustrative shell snippets, not a shipped retroactive sweep. Ruled out: "a corpus-wide doc-quality sweep already exists."

## Assessment

- newInfoRatio: 0.85
- Novelty justification: First pass over the net-new surface (skill/command/context-engineering quality machinery); the bifurcation finding and the never-automated DQI scorer are new to this packet, distinct from the parent's retrieval-code tiering.
- Confidence: High on F1-F4/F6 (file:line confirmed); medium on F5's "biggest surface" magnitude claim (asserted from sampled reference headers, not a counted census).

## Reflection

What worked: going straight to `validator-registry.json` and the live commit hook exposed the bifurcation immediately. What to do next: turn the gap into a ranked, floor-aware automation set, and look specifically at the context-engineering layer (assembly/injection/prompts) which iteration 1 only touched via the post-save review.

## Recommended Next Focus

Iteration 2: Rank the out-of-the-box automated features (on-write gates + retroactive sweeps) that perfect data quality across the full surface, classified by reader (R/A/L) and by truncation-floor relationship, reusing the half-built DQI scorer and the post-save-review pattern. Cover the context-engineering layer explicitly.
