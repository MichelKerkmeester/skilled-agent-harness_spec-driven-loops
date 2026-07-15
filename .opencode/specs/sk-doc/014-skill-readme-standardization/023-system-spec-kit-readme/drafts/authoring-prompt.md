Spec folder: sk-doc/014-skill-readme-standardization/023-system-spec-kit-readme (pre-approved, skip Gate 3). OUTPUT-ONLY task: do NOT write, create or edit any file. Return ONLY markdown in a single fenced ```markdown block as your final message. No preamble, no commentary.

Role: You are a technical writer reshaping the TOP of a large reference README into the repo's narrative house voice. The skill is `system-spec-kit`. Its README is a 1084-line reference manual that will KEEP its reference depth; your job is only the reframed opening and a section-header scheme, not the whole document.

Context you must use:
- The factual map is in `.opencode/specs/sk-doc/014-skill-readme-standardization/023-system-spec-kit-readme/context/context-report.md` and the four seat reports under `context/seats/`. The current README is at `.opencode/skills/system-spec-kit/README.md`. Read the current README sections 1 (OVERVIEW) and the section headers.
- The required voice and structure are in `.opencode/skills/sk-doc/assets/skill/skill_readme_template.md`. The golden example is `.opencode/skills/sk-git/README.md`. The voice rules are in `.opencode/skills/sk-doc/references/global/hvr_rules.md`. Read all three.

Produce EXACTLY these pieces, in order, as one markdown block:

1. FRONTMATTER — yaml frontmatter with `title: "System Spec Kit"`, a one-sentence `description`, and `trigger_phrases` (keep the current ones: "spec kit", "spec folder", "memory system", "hybrid search", "context preservation", "documentation levels", "memory save", "spec folder workflow").
2. H1 `# System Spec Kit` then a one-line `>` blockquote pitch. The current pitch is good: "Documentation and memory for AI-assisted development. Every file change gets a spec folder. Every session gets persistent context." Keep or lightly improve it. One line only.
3. `## 1. AT A GLANCE` — a four-row table (Aspect | What you get). Synthesize it from the current OVERVIEW's "Key Features at a Glance" and "How This Compares". Rows: Use it for, Invoke with, Works on, Produces. One-line cells, no prose paragraphs.
4. `## 2. OVERVIEW` with two subsections: `### Why This Skill Exists` (problem-first: AI conversations that modify files leave no reasoning trail, and AI assistants start every session from a blank slate; 2 to 4 sentences, problem before solution, no feature list) and `### What It Does` (the documentation-and-memory loop: spec folders capture, the local index makes it searchable, the next session resumes; name the canonical surfaces /memory:save and /speckit:resume; 2 to 4 sentences). Then keep a short `### How This Compares` paragraph and a `### Requirements` block (Node.js >= 20.11, TypeScript 5.0+, Bash 4.0+, local-first embeddings via the Ollama-first cascade).
5. A fenced sub-block titled `<!-- HEADER SCHEME -->` listing your recommended ALL-CAPS numbered headers for sections 3 through 9, given that this is a reference manual that keeps its depth. The current headers are FEATURES, STRUCTURE, CONFIGURATION, USAGE EXAMPLES, TROUBLESHOOTING, FAQ, RELATED DOCUMENTS. State for each whether to keep or rename, one line of rationale each.

Hard facts (do not contradict): the MCP server has 37 tools (verified, stable). Five retrieval channels (Vector, FTS5, BM25, Causal Graph, Degree) fused with RRF. Four documentation levels (1, 2, 3, 3+) plus phase parents. Local-first embedding cascade (Ollama then hf-local then OpenAI then Voyage, ADR-014). Do NOT pin drift-prone counts (script counts, feature-catalog totals, per-namespace command counts) in your prose. Do NOT include a version line anywhere.

Voice: no em dashes, no double-hyphen `--` dash separators, no semicolons, no Oxford commas, no banned words, no setup phrases. Lead with the reader. This is the opening of a reference manual, so it should feel welcoming but dense-aware.

Return only the markdown block with pieces 1 through 5. Nothing else.
