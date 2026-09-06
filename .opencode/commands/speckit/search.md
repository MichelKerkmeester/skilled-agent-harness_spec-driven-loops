---
description: "Continuity retrieval front door: trigger-index lookup plus the ripgrep recipes over spec docs and skill docs."
argument-hint: "<query> [--packet <specFolder>] [--triggers] [--paths] [--count]"
allowed-tools: Bash, Read, Grep, Glob
---

# /speckit:search

Thin router for lexical retrieval over spec docs and skill docs.

## 1. ROUTER CONTRACT

Argument resolution (deterministic, read this first). The shell line below is evaluated before you read any policy. It is the ground truth for this invocation. The renderer substitutes the raw query text where `$ARGUMENTS` appears as one positional argument after `--`, so the wrapper treats shell metacharacters in the query (`*`, `$(…)`, backticks, `;`, `|`) as literal query text. The wrapper then joins the provided positional argument into one string and reports whether any argument was supplied.

!`bash -c 'if [ "$#" -gt 0 ]; then q="$*"; q="${q//\"/\\\"}"; printf "ARGS_PRESENT=true\nQUERY=\"%s\"\n" "$q"; else printf "ARGS_PRESENT=false\nQUERY=\"\"\n"; fi' -- '$ARGUMENTS'`

Bind your control flow to the two values above — never re-derive arg-presence from your own reading of the prompt:

- **When `ARGS_PRESENT=true`: you MUST execute retrieval on `QUERY` now.** Do NOT ask the startup question, and do NOT treat a populated `QUERY` as empty. Go to the retrieval routes in §4 EXECUTION TARGETS.
- **ONLY IF `ARGS_PRESENT=false`:** follow startup routing in §3 MODE ROUTING and ask the one open-ended question.

Guardrails:
- Do not infer a query from prior conversation when `ARGS_PRESENT=false`; ask the open-ended startup question.
- Ask targeted follow-up questions only when the query is genuinely ambiguous.
- Do not display an option dump at startup.
- Do not use forbidden result labels listed in the presentation asset.
- Copy the recipe flags literally from `retrieval-conventions.md`. Each of `--no-config`, `--hidden`, the four exclusion globs and the `--` separator closes a specific failure; paraphrasing them reintroduces it.
- Retrieval here is lexical. Never soften a no-hit into a paraphrase or a nearest guess.
- This is a direct-dispatch command with no workflow YAML by design; do not create or modify workflow YAML from this command.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation | `.opencode/commands/speckit/assets/search-presentation.txt` |
| Retrieval contract | `.opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` |

This is a direct-dispatch command: it runs a local lookup script and `rg` directly, and owns no workflow YAML by design. Nothing it calls needs a background service.

Before asking startup questions or displaying results, read the presentation asset and use it as the display source of truth. Read the retrieval contract before composing any recipe.

---

## 3. MODE ROUTING

Execution order:

1. Read the §1 ROUTER CONTRACT argument-resolution output: `ARGS_PRESENT` and `QUERY` are already computed for you.
2. Read `.opencode/commands/speckit/assets/search-presentation.txt` before rendering any response.
3. **If `ARGS_PRESENT=true`:** route `QUERY` to the matching lane in §4 EXECUTION TARGETS. Execute now — do NOT ask the startup question.
4. **ONLY IF `ARGS_PRESENT=false`:** follow startup routing (below) and ask the one open-ended question.
5. Render the response from the presentation contract.

Startup routing. **Reach this ONLY IF `ARGS_PRESENT=false`.** A populated `QUERY` never reaches here. When `ARGS_PRESENT=false`, ask the one open-ended question from the presentation asset and treat the answer as the query.

Lane selection:

| Condition | Lane |
| --- | --- |
| `--triggers`, or the query is a prompt being matched against author-declared `trigger_phrases` | Trigger-index lane |
| Default, or the query is a phrase to find anywhere in the corpus | Free-text lane |
| The request names lineage, drift, ablations, dashboards, epistemic baselines, or semantic/paraphrase matching | Unsupported — render the §6 notice from the presentation asset |

The two lanes answer different questions. Prompt-to-declared-phrase matching is a keyed lookup over an author-controlled field; grepping prose is a scan. Using the scan for trigger matching loses precision, and using the index for free text loses everything the author never declared.

---

## 4. EXECUTION TARGETS

### Trigger-index lane

The keyed lookup over the generated index. Reads a file and exits.

```bash
node .opencode/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs --json -- "<QUERY>"
```

1. Run the command with the resolved `QUERY`.
2. Branch on the exit status: `0` = candidates, `1` = clean no-hit, `2` or higher = the index is missing or unreadable.
3. Render candidates with the Section 2 contract in the presentation asset — score, match class and path, in the order the tool returned them.
4. On exit `2` or higher, render the Section 7 error display with stderr attached and name `/doctor speckit-retrieval` as the diagnostic. Never report it as a no-hit.

### Free-text lane

The ripgrep recipes from `retrieval-conventions.md` Section 2. Pick exactly one output mode per invocation.

| Request shape | Recipe | Output mode |
| --- | --- | --- |
| Line-addressable evidence (default) | Section 2.1 | `--json` |
| Which files mention it (`--paths`) | Section 2.2 | `--files-with-matches` |
| How many times (`--count`) | Section 2.3 | `--count` |
| Evidence with surrounding lines, or anchor labelling | Section 2.4 | `--json -C 2` |

Structured JSONL, the default:

```bash
rg --no-config --hidden --json --fixed-strings --ignore-case \
  --glob '*.md' --glob '!**/z_archive/**' --glob '!**/node_modules/**' --glob '!**/.git/**' --glob '!**/scratch/**' \
  -- '<QUERY>' specs .opencode
```

1. Resolve the search roots. Narrow by positional path, never by pattern: `specs .opencode` for everything, `specs/<track>` for one track, `specs/<track>/<NNN-name>` for one packet, `specs/<track>/<NNN-name>/<NNN-child-name>` for one phase child. `--packet <specFolder>` replaces the roots with that path.
2. Run exactly one recipe. Never combine `--json` with the path-only or count mode: ripgrep does not reject the combination, the last output-mode flag wins silently, and a JSONL parser handed count output sees an empty result rather than an error.
3. Branch on the exit status: `0` = matches, `1` = no match returned as an empty result, `2` or higher = an execution or configuration error.
4. Order results with the ranking tuple in `retrieval-conventions.md` Section 5 — evidence field, then normalized match class, then relative path and one-based line. Ripgrep supplies matches, paths and lines; it never ranks relevance, and no rendered output may imply that it does.
5. To label anchor evidence, search for the marker itself (`<!-- ANCHOR:id -->`) and treat a line inside a matched pair as anchor evidence. Report an unmatched or orphan marker as a diagnostic rather than dropping it.
6. Render with the Section 3 contract in the presentation asset.

### Unsupported requests

The retired continuity database carried stateful capabilities that a read-only scan cannot provide. Each is a declared loss, not a degraded lane:

- Semantic paraphrase, vector and BM25 fusion, decay, access tracking, session dedup.
- Causal graph traversal, lineage and drift analysis (`causal`, `link`, `unlink`, `causal-stats`).
- Epistemic baselines and learning history (`preflight`, `postflight`, `history`).
- Channel ablations and eval dashboards (`ablation`, `dashboard`).

Render the Section 6 unsupported notice from the presentation asset and stop. Do not substitute a keyword search for any of them and present it as the same answer.

---

## 5. PRESENTATION BOUNDARY

The full presentation contract lives in `.opencode/commands/speckit/assets/search-presentation.txt`. This router may only inline the lane-selection rules and recipe mechanics above.

The following content must come from the presentation asset, not from router prose:

- Empty-argument startup question and targeted follow-up wording.
- Trigger-index, free-text, no-hit, unsupported and error displays.
- Forbidden vocabulary, result labels, field mappings and recovery text.

---

## 6. WORKFLOW SUMMARY

The router binds control flow to the deterministic `ARGS_PRESENT`/`QUERY` resolution: with arguments present it dispatches the trigger-index lane (the generated index read by `lookup-trigger-index.mjs`) or the free-text lane (one literal ripgrep recipe from `retrieval-conventions.md`, ordered by the caller-side ranking tuple); with no arguments it asks the one open-ended startup question. Retrieval is lexical and needs no background service: exit `1` is a clean no-hit rendered as an empty result, and exit `2` or higher is an error rendered with stderr attached. Capabilities that lived in the retired database — semantic matching, fusion, decay, access tracking, session dedup, causal traversal, epistemic baselines, ablations and dashboards — are declared unsupported rather than approximated. Every user-facing string renders through the presentation asset.

Related commands: `/speckit:save` (write conversation context into packet continuity surfaces); `/speckit:resume` (session recovery and continuation, which owns the continuity ladder).
