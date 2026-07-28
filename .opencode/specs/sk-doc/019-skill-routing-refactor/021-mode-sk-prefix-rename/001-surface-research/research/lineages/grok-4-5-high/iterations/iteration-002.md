# Iteration 002 — Advisor metadata and hub-identity pair

## Focus
Advisor-facing hub identity (`description.json` / `graph-metadata.json`), `leaf-aliases.json`, and packet `SKILL.md` frontmatter `name` alignment with directory names.

## Actions Taken
1. Inspected hub-root `description.json` and `graph-metadata.json` for all four sk- hubs.
2. Parsed sk-doc `leaf-aliases.json` workflowMode bindings.
3. Verified every unique packet's `SKILL.md` frontmatter `name:` equals its directory basename (20/20).
4. Confirmed system-skill-advisor leaf files use hub-level workflowMode only (out of rename scope for mode keys, but documents non-consumer).

## Findings

### F6 — Consumer class: graph-metadata.json path + category fields
- **Class:** Advisor hub-identity metadata (skill-advisor schema, not spec-folder schema)
- **Classification mixed:**
  - **Path positions:** `derived.key_files` entries embedding packet paths (e.g. `.../code-quality/SKILL.md`) — must update after directory rename
  - **Requires-judgment / free prose:** `category: "code-quality"`, `domains` tokens, `key_topics`, `causal_summary` free text mentioning `quality` / `workflowMode`
  - **Typed (schema labels only):** mentions of the literal field name `workflowMode` in key_topics are schema vocabulary, not mode keys — do not rewrite those tokens as if they were mode IDs
- **Evidence:**
  - [SOURCE: .opencode/skills/sk-code/graph-metadata.json:5] `"category": "code-quality"`
  - [SOURCE: .opencode/skills/sk-code/graph-metadata.json:66] domains includes `code-quality`
  - [SOURCE: .opencode/skills/sk-code/graph-metadata.json:212] key_files path to `code-quality/SKILL.md`
  - [SOURCE: .opencode/skills/sk-code/graph-metadata.json causal_summary] prose: `two workflow modes (quality, code-review)`

### F7 — Consumer class: description.json prose mentions
- **Class:** Hub description / keywords
- **Classification:** free prose / requires-judgment
- **Collision risk:** High — description text contains hyphenated packet names (`code-quality`) as ordinary English compounds
- **Evidence:** [SOURCE: .opencode/skills/sk-code/description.json:3] description mentions `code-quality patterns`; keywords array includes `code-quality` [SOURCE: line 41 area]

### F8 — Consumer class: leaf-aliases.json typed workflowMode
- **Class:** Typed JSON `workflowMode` on alias rows (sk-doc)
- **Classification:** typed / safe-to-sweep
- **Evidence:** [SOURCE: .opencode/skills/sk-doc/leaf-aliases.json:3+] rows bind `create-changelog`, `create-quality-control` etc.

### F9 — Consumer class: packet SKILL.md frontmatter name
- **Class:** YAML frontmatter `name:` must match directory (and post-rename packet id)
- **Classification:** typed frontmatter identity (edit with directory rename); not free prose
- **Evidence:** 20/20 packets confirmed `name === packet` directory basename via direct SKILL.md reads
- **Note:** create-skill SKILL.md also documents workflowMode strings in router pseudocode — those are **prose/code samples requiring judgment** [SOURCE: .opencode/skills/sk-doc/create-skill/SKILL.md:51-56,151,262]

### F10 — Generated vs authored for hub identity pair
- Hub `description.json` / `graph-metadata.json` are advisor identity files authored/maintained at hub root (templates exist under create-skill parent-skill assets). Treat path-bearing derived fields as needing refresh after rename; do not assume a silent regenerator rewrites mode keys in prose.
- leaf-manifest remains the clear regenerate-not-edit artifact (iter1 F4); leaf-aliases are authored typed rows.

## Questions Answered
- Extended Q1 with advisor-metadata and SKILL frontmatter consumer classes
- Extended Q2: graph-metadata/description are mixed classification; leaf-aliases typed; SKILL name typed
- Partial Q3: leaf-manifest generated; description/graph-metadata not purely generated

## Ruled Out / Dead Ends
- Ruled out treating system-skill-advisor's own `workflowMode: system-skill-advisor` as in-scope rename surface — it is the advisor hub, not one of the 21 sk- mode keys. [SOURCE: system-skill-advisor/leaf-manifest.config.json:2]

## Next Focus
Benchmark gold / Lane C compiled-routing reports and any route-gold fixtures that embed old workflowMode strings.

## SCOPE VIOLATIONS
None.
