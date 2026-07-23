---
iteration: 3
dimension: security
focus: 015-P0 corpus indexer path/TOCTOU + SQL + secrets; 012/006 command-surface trust boundaries; 020 doc-edit security
sessionId: fanout-minimax-m3-high-1784606267078-bpkeoi
generation: 1
lineageMode: new
status: complete
filesReviewed:
  - .opencode/skills/sk-design/styles/_db/indexer.mjs
  - .opencode/skills/sk-design/styles/_db/canonical.mjs
  - .opencode/skills/sk-design/styles/_db/generation-manifest.mjs
  - .opencode/skills/sk-design/styles/_db/operator.mjs
  - .opencode/skills/sk-design/styles/_db/oracle/relevance-judgments.mjs
  - .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs
findingsCount: 2
findingsNew: 1
findingsSummary: P0=0, P1=0, P2=2
newFindingsRatio: 0.33
timestamp: 2026-07-21T06:01:00.000Z
durationMs: 120000
---

# Iteration 3 — Security on 015-P0 + 012/006 + 020

## Scope

Security is not the primary lens for this review (charter §3 line 47-48) — the 015-P0
code is for a local trusted corpus, not adversarial input. Audit nonetheless for:

- **Path traversal / escape** — does the indexer keep corpus reads inside the corpus root?
- **TOCTOU windows** — between path resolution and content read?
- **SQL injection** — all queries parameterized?
- **Shell / eval injection** — any `exec` / `spawn` / `eval` paths?
- **Secrets / credentials** — any exposed?
- **Trust boundaries** — operator command surface, manifest tamper, embedder injection.
- **Comments / spec docs** — no `eval`, no shell, no `Function` constructors.

## Findings

### F7 [P2] — `readVerifiedArtifacts` TOCTOU between `realpath` and `readFile`

**Severity**: P2 (advisory). **Category**: Security / TOCTOU on trusted-corpus reads.

**Evidence**:

- `.opencode/skills/sk-design/styles/_db/indexer.mjs:223-238`:
  ```
  223:    const linkInfo = await lstat(candidatePath, { bigint: true });
  224:    if (!linkInfo.isFile() && !linkInfo.isSymbolicLink()) continue;
  225:    const artifactRealPath = await realpath(candidatePath);
  226:    if (!isContained(corpusRealPath, artifactRealPath)) {
  ...
  231:    const before = await stat(artifactRealPath, { bigint: true });
  232:    const buffer = await readFile(artifactRealPath);
  233:    const after = await stat(artifactRealPath, { bigint: true });
  234:    if (before.size !== after.size || before.mtimeNs !== after.mtimeNs || before.ctimeNs !== after.ctimeNs) {
  ```

**What this is**: the indexer resolves the symlink target via `realpath`, validates
containment, then reads content via `readFile(artifactRealPath)`. A symlink swap
between `realpath` (line 225) and `readFile` (line 232) could redirect the read to
a different real file. The before/after `stat` (lines 231-238) catches size/mtime/ctime
drift but does not catch a same-size, same-mtime symlink-swap race.

**Why it's P2, not P1**: the corpus is a local trusted directory; the orchestrator
controls it. A symlink-swap attack requires the attacker to already have write access
inside the corpus root or to a directory the corpus traverses — at which point they
could poison the corpus regardless. The mitigation is for hardening, not for current
threat model.

**Hardening options** (not in scope):
- Use `open(path, 'r', O_NOFOLLOW)` on Linux/macOS for the read.
- Re-`realpath` after `readFile` and assert equality.
- Pass the resolved fd to subsequent operations instead of the path.

**No-op recommendation** for this packet. Note in design system as defense-in-depth.

### F8 [P2] — `relevance-judgments.mjs` `loadJudgmentSeed` accepts any JSON object

**Severity**: P2 (advisory). **Category**: Security / input validation.

**Evidence**:

- `.opencode/skills/sk-design/styles/_db/oracle/relevance-judgments.mjs:279-296`:
  ```
  279: export async function loadJudgmentSeed(source) {
  280:   const seed = typeof source === 'string'
  281:     ? JSON.parse(await readFile(source, 'utf8'))
  282:     : source;
  ...
  290:   for (const [index, row] of seed.judgments.entries()) {
  291:     const problems = validateJudgmentRow(row);
  ```

**What this is**: `loadJudgmentSeed` accepts a parsed object OR a path. When a path is
given, the contents are parsed as JSON with no schema enforcement beyond `humanLabelingRequired`
flag and per-row validation. The validation is structural (label_source ∈ enum, provenance
non-empty, relevant non-empty array, confidence in [0,1]). It does not cap the number of
judgments, the provenance field depth, or the relevant-array length.

**Why it's P2**: an adversarial caller could supply a multi-gigabyte JSON or a deeply
nested object that exhausts memory. For the current threat model (a trusted seed file
checked into the repo), this is not an exploitable surface. The default `SEED_PATH`
in tests is the repo-committed seed. External callers would need to import the
function directly.

**No-op recommendation** for this packet. Document in design system that
`loadJudgmentSeed` assumes a trusted input source.

## Confirmed-correct claims (negative findings — no defect)

### Path traversal / escape

- `.opencode/skills/sk-design/styles/_db/indexer.mjs:81-84` defines `isContained`
  via `path.relative` + `!startsWith('..')`. This is the standard containment check.
- `.opencode/skills/sk-design/styles/_db/indexer.mjs:225-230,272-279` enforces
  `isContained(corpusRealPath, artifactRealPath)` for every corpus read. Every
  artifact read throws `path-escape` if containment fails. ✓
- `.opencode/skills/sk-design/styles/_db/indexer.mjs:648-655` enforces the same
  containment check on `_manifest.json`. ✓
- `.opencode/skills/sk-design/styles/_db/generation-manifest.mjs:42-49` defines
  `isContained` for manifest artifact paths. ✓
- `.opencode/skills/sk-design/styles/_db/generation-manifest.mjs:180-184`
  enforces containment for the published target (line 180-184). ✓
- `.opencode/skills/sk-design/styles/_db/generation-manifest.mjs:214-224`
  enforces containment for every manifest artifact at resolve time. ✓
- `.opencode/skills/sk-design/styles/_db/indexer.mjs:1140-1158` enforces the
  rollback target stays inside the database directory. ✓

### SQL injection

- Every `database.prepare()` call uses `?` parameter binding for variable values:
  - Line 415: `WHERE ${key} = ?` (key is hardcoded enum).
  - Lines 417, 434, 450, 455, 459, 466, 481, 495, 519, 528, 533, 544, 560, 575,
    581, 593, 665, etc.: all use `?` binding for user-controlled values.
- Table and column names are interpolated from hardcoded lists (lines 405-413, 414).
  No user-controlled values reach the SQL string itself. ✓

### Shell / eval injection

- `grep -nE "(child_process|exec|spawn|eval|new Function)" ...` returns **no hits**
  across `indexer.mjs`, `operator.mjs`, `canonical.mjs`, `oracle/*.mjs`,
  `shared/scripts/*.mjs`. The only `exec` calls are `database.exec(...)` for SQLite,
  which takes a string SQL and is internally bound — no shell evaluation. ✓

### Secrets / credentials

- No API keys, tokens, passwords, or credential strings in the diff.
- The `ORACLE_VECTOR_PROFILE` (oracle/query-set.mjs:11-17) declares a fictional
  external model; `dimensions: 2` confirms it's a stub for deterministic replay. ✓
- `oracleEmbedder` (oracle/query-set.mjs:25-27) returns a hardcoded `[1, 0]` or
  `[0, 1]` vector — no real model. ✓
- `scaledOracleEmbedder` (oracle/replay-fixtures.mjs:70-75) derives vectors from
  `digest(text)` — pure hash, no network. ✓

### Manifest integrity / tamper

- `resolveManifestArtifacts` (generation-manifest.mjs:212-235) optionally re-hashes
  every artifact and rejects `generation-artifact-tampered` if any mismatch.
- `manifest.test.mjs:102-119` test "a tampered artifact fails digest verification"
  exercises this path. ✓
- `manifest.test.mjs:226-239` test "an invalid pointer shape is rejected" exercises
  the path-escape rejection (`../escape.sqlite` is rejected). ✓

### Embedder injection

- `indexer.mjs:991-1000` and `differential-oracle.mjs:54-62` invoke the embedder
  with `await options.embedder(text)`. The text comes from a deterministic corpus,
  not user input. The embedder is a dependency-injected function and the only
  shipped implementation is the deterministic `oracleEmbedder` / `scaledOracleEmbedder`.
  A production embedder would call an external API; the current code does not. ✓

### Command-surface trust boundary (012/006)

- The surface checker is read-only — it inspects the three registries and the
  `commands/interface/` wrappers and emits drift findings. It does not write to
  any file or invoke any side effect. ✓
- The `interface-command-contract.test.mjs` is also read-only — assertions against
  parsed JSON, no file writes. ✓
- `commands/interface/` wrappers are markdown frontmatter + body. No shell execution
  embedded; the command asset pipeline reads the frontmatter but does not invoke
  the wrapper as code. ✓

### Spec-doc edit security (020)

- The 020 mechanical edits touch only markdown files. No code changes, no shell,
  no eval. ✓
- No new file paths introduced that would escape the existing spec tree. ✓

## Verdict

- **P0**: 0
- **P1**: 0
- **P2**: 2 (TOCTOU window + unbounded judgment seed size, both advisory for the
  current trusted-corpus threat model)

The shipped code has solid path-escape protection, parameterized SQL throughout, no
shell/eval paths, no secrets exposure, and read-only command-surface tooling. The
two P2 advisories are defense-in-depth hardening for an adversarial-input threat
model that is out of scope for this packet.

Review verdict: PASS