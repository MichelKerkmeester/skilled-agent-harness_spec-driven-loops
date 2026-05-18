# Deep Research Iteration 006 of 20 — index.ts + package.json + tsconfig.json (entry, deps, build config)

## SITUATION

You are running as **cli-devin SWE-1.6** in non-interactive print mode, dispatched as iteration 6 of a 20-iteration deep-research campaign on the upstream `dzianisv/opencode-plugins` `auto-review` package.

**Prior context**:
- Iter 001-005: pinned SHA, README, example.json, full auto-review.ts (lines 1-end)

**Why this iter exists**: every Node/TS package has three "skeleton" files that define how it's built and shipped. Reading them reveals: (a) what version this is, (b) what dependencies it pulls in, (c) what TypeScript target/module/strict settings it uses, (d) what the public entry surface is. These small files are easy to skim but they encode the package's contract with the OpenCode plugin loader.

**Critical artifacts in your range**:
1. `index.ts` — the public entry. Likely re-exports `AutoReviewPlugin` from `auto-review.ts`. Confirm the plugin id.
2. `package.json` — name, version, main, dependencies, devDependencies, scripts
3. `tsconfig.json` — target (es2020? es2022?), module (esnext? commonjs?), strict mode, declaration emit, outDir, include/exclude

## TASK

### Step 1 — Reuse pinned SHA + fetch all 3 files

```bash
SHA=$(rg -oP 'PINNED_UPSTREAM_SHA:\s*\K[0-9a-f]{40}' .opencode/specs/skilled-agent-orchestration/106-opencode-auto-review-teachings-research/research/iterations/iteration-001.md | head -1)

for F in index.ts package.json tsconfig.json; do
  echo "=== $F ==="
  gh api "repos/dzianisv/opencode-plugins/contents/packages/auto-review/$F?ref=$SHA" \
    --jq '.content' 2>/dev/null | base64 -d \
    || curl -sL "https://raw.githubusercontent.com/dzianisv/opencode-plugins/$SHA/packages/auto-review/$F"
  echo
done > /tmp/upstream-skeleton-006.txt

cat /tmp/upstream-skeleton-006.txt
```

### Step 2 — Document index.ts

Document:
- Imports (which symbols from `auto-review.ts` are re-exported)
- Plugin id (e.g. `"auto-review"`)
- Server export (likely `default { id: "auto-review", server: AutoReviewPlugin }`)
- Type imports vs runtime imports

### Step 3 — Document package.json

Fill the inventory table:

| Field | Value | Notes |
|-------|-------|-------|
| `name` | | |
| `version` | | |
| `main` | | |
| `type` (module/commonjs) | | |
| `scripts` | | List all scripts |
| `dependencies` | | List all with versions |
| `devDependencies` | | List all with versions |
| `peerDependencies` | | If present |
| `license` | | |
| `author` | | |

Pay special attention to:
- `@opencode-ai/plugin` dependency — what version? what does this dep export?
- TypeScript version pin
- Any `pnpm`/`yarn` workspace markers (this is in a monorepo)

### Step 4 — Document tsconfig.json

Fill the compiler-options inventory:

| Option | Value | Inferred reason |
|--------|-------|-----------------|
| target | | |
| module | | |
| moduleResolution | | |
| strict | | |
| declaration | | |
| declarationMap | | |
| sourceMap | | |
| outDir | | |
| rootDir | | |
| esModuleInterop | | |
| skipLibCheck | | |
| extends | (if monorepo base) | |
| include | | |
| exclude | | |

### Step 5 — Cross-check vs our local plugins

Compare to our `.opencode/plugins/mk-skill-advisor.js` and `mk-code-graph.js`:
- We ship as plain `.js` (not TypeScript). Upstream ships as `.ts` + compiled output. Note this difference.
- We expose a single function default-export; upstream exposes `{ id, server }` shape. Note this difference.

## SCOPE

- `packages/auto-review/index.ts`
- `packages/auto-review/package.json`
- `packages/auto-review/tsconfig.json`
- `research/iterations/iteration-001.md` (SHA)
- **No writes outside `research/iterations/iteration-006.md` and `research/deep-research-state.jsonl`**

## VERIFICATION COMMANDS

```bash
SHA=$(rg -oP 'PINNED_UPSTREAM_SHA:\s*\K[0-9a-f]{40}' .opencode/specs/skilled-agent-orchestration/106-opencode-auto-review-teachings-research/research/iterations/iteration-001.md | head -1)

for F in index.ts package.json tsconfig.json; do
  OUT="/tmp/upstream-${F//\//_}.txt"
  gh api "repos/dzianisv/opencode-plugins/contents/packages/auto-review/$F?ref=$SHA" --jq '.content' 2>/dev/null | base64 -d > "$OUT" \
    || curl -sL "https://raw.githubusercontent.com/dzianisv/opencode-plugins/$SHA/packages/auto-review/$F" > "$OUT"
  echo "=== $F (lines: $(wc -l < $OUT)) ==="
  cat "$OUT"
done

# Cross-check: our local plugin shape
head -50 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/plugins/mk-skill-advisor.js
```

## CONSTRAINTS

- READ-ONLY.
- Quote every config field value verbatim (no paraphrasing).
- Cite `packages/auto-review/<file>:<line>` for every claim.
- Reuse SHA from iter-001.
- Stop adding new probes past minute 4 (these are small files).

## COMMON FAILURE MODES

1. **Monorepo `extends`**: tsconfig may extend a workspace-level base config. If `extends: "../../tsconfig.base.json"`, fetch that base too and note its options.
2. **Missing `main` or `module` field**: ESM-first packages may use `exports` map instead. Document the export shape correctly.
3. **package.json `private: true`**: indicates internal-only package. Note this.

## OUTPUT FORMAT

Write to `research/iterations/iteration-006.md`:

```markdown
<!-- PINNED_UPSTREAM_SHA: <sha> -->

# Iteration 006 — index.ts + package.json + tsconfig.json

## Summary
<2-4 sentence verdict on package shape, deps, and build config>

## Files/Commands Reviewed
- `packages/auto-review/index.ts` (at sha <sha>)
- `packages/auto-review/package.json` (at sha <sha>)
- `packages/auto-review/tsconfig.json` (at sha <sha>)
- Local: `.opencode/plugins/mk-skill-advisor.js` (cross-check)

## Findings

### index.ts
```typescript
<verbatim contents>
```

| Aspect | Value |
|--------|-------|
| Imports from | `./auto-review` |
| Re-exports | <list> |
| Default export | `{ id: "auto-review", server: AutoReviewPlugin }` |
| Plugin id | `"auto-review"` |

### package.json inventory
| Field | Value |
|-------|-------|
| name | |
| version | |
| main | |
| type | |
| scripts | |
| dependencies | |
| devDependencies | |
| peerDependencies | |
| license | |
| author | |

### tsconfig.json inventory
| Option | Value | Inferred reason |
|--------|-------|-----------------|
| target | | |
| module | | |
| (other rows) | | |

### Local plugin shape comparison
| Aspect | Upstream auto-review | Our mk-skill-advisor / mk-code-graph |
|--------|---------------------|--------------------------------------|
| Language | TypeScript (compiled to dist/) | Plain JavaScript (ESM, no build) |
| Entry shape | `default { id, server }` | function default-export |
| Dependencies | `@opencode-ai/plugin` typed | Bridge module loaded via dynamic import |
| Build step | tsc | none |
| Type safety | strict TS | jsdoc-only at best |

## Convergence Signal
`newInfoRatio: <0.0-1.0>` — typically moderate (0.4-0.6) since this is skeleton info. `dimension status: FULLY EXTRACTED`.
```

Then append to `research/deep-research-state.jsonl`:

```jsonl
{"type":"iteration","run":6,"focus":"index.ts + package.json + tsconfig.json","mechanismsExtracted":4,"gapsIdentified":<N>,"newInfoRatio":<0.0-1.0>,"executor":"cli-devin","model":"swe-1.6","pinnedSha":"<sha>","durationSec":<N>,"timestamp":"<ISO8601>"}
```

## ACCEPTANCE CRITERIA FOR THIS ITER

- [ ] index.ts contents quoted verbatim
- [ ] package.json inventory has all 10 rows
- [ ] tsconfig.json inventory has ≥ 8 rows (target/module/strict/declaration etc.)
- [ ] Local plugin shape comparison table has 5+ aspect rows
- [ ] Output file ≥ 50 lines

Begin.
