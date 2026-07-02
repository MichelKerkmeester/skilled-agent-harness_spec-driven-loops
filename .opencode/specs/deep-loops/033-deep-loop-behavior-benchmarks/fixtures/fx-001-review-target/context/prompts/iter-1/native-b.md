Resolved route: mode=context; target_agent=@deep-context; execution=parallel_read_only_sweep; seat_label=native-b; do_not_run_full_loop=true

You are a READ-ONLY deep-context analyzer seat. Perform exactly ONE analysis pass over the shared focus below and return structured findings. Do NOT run a loop. Do NOT edit any file. Do NOT propose fixes — this is codebase mapping, not review.

## 1. Gather-subject (what context is being gathered for)

The **URL slug utility** `slugify` in the `fx-001-review-target` fixture: a single,
dependency-free CommonJS function that converts short human-readable labels (post
titles, product names) into URL-safe slugs. Requirements (from spec.md): lowercase,
trim, collapse non-alphanumeric runs to a single hyphen, no leading/trailing hyphen,
60-char max length.

## 2. Shared focus / slice (identical for all seats this iteration)

- File: `.opencode/specs/deep-loops/033-deep-loop-behavior-benchmarks/fixtures/fx-001-review-target/src/slugify.js`
- Symbol: `slugify(input, maxLen)` (line 9), exported via `module.exports = slugify` (line 31)
- Supporting docs in the same fixture: `spec.md`, `plan.md`, `tasks.md`

Read the file (and the fixture docs for intent). Map what a consumer would REUSE,
where they would INTEGRATE, the CONVENTIONS the code follows, its DEPENDENCIES, and
any GAPS (missing behavior, unhandled inputs, contract ambiguities). Cite `file:line`.

## 3. Known context

None — no prior confirmed reuse candidates. This is a fresh sweep.

## 4. Output schema (return ONLY this JSON, no prose)

```json
{ "findings": [ {
  "unit_id": "leave empty or best-effort; the host recomputes sha256(path:symbol:kind)",
  "path": "src/slugify.js",
  "symbol": "slugify",
  "kind": "reuse_candidate | integration_point | convention | dependency | gap",
  "signature": "e.g. slugify(input: string, maxLen = 60): string",
  "reuse": "extend | compose | wrap | import",
  "evidence": "src/slugify.js:NN",
  "relevance": 0.0,
  "notes": "one concise sentence"
} ] }
```

Rules: keep `path` fixture-relative (`src/slugify.js`). `relevance` in [0,1] — how
central this unit is to reusing the slug utility. Include gaps as `kind: "gap"` with
`reuse` omitted or null. Return the JSON object as your entire final message.
