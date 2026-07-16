### DR-005-01 [P2] [maintainability] Versioned working-set deserialize guard accepts null payload sections

file: `.opencode/skills/system-code-graph/mcp_server/lib/working-set-tracker.ts:23`

evidence:

```ts
23: function isSerializedWorkingSetTracker(data: SerializedWorkingSetTracker | LegacySerializedWorkingSetTracker): data is SerializedWorkingSetTracker {
24:   const candidate = data as Partial<SerializedWorkingSetTracker>;
25:   return candidate.version === 1 && typeof candidate.files === 'object' && typeof candidate.symbols === 'object';
```

```ts
98:   static deserialize(data: SerializedWorkingSetTracker | LegacySerializedWorkingSetTracker): WorkingSetTracker {
99:     const tracker = new WorkingSetTracker();
100:     const files = isSerializedWorkingSetTracker(data) ? data.files : data;
101:     const symbols = isSerializedWorkingSetTracker(data) ? data.symbols : {};
102:     for (const [key, value] of Object.entries(files)) {
```

why: The new v1 shape guard reads like a validation boundary, but `typeof null === 'object'`, and arrays also satisfy the current object check. A partially corrupted persisted hook-state payload such as `{ "version": 1, "files": null, "symbols": {} }` is treated as valid v1 and then throws at `Object.entries(files)`. That makes future maintainers think deserialize is shape-safe when it is only a shallow tag check.

fix: Tighten the guard with a small `isPlainRecord()` check for non-null, non-array `files` and `symbols`; otherwise fall back to an empty tracker or legacy-record handling with a targeted warning.

confidence: 0.86

### DR-005-02 [P2] [maintainability] Git HEAD timeout policy is duplicated outside the defaults module

file: `.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:211`

evidence:

```ts
211:     return execSync('git rev-parse HEAD', {
212:       cwd: rootDir,
213:       encoding: 'utf-8',
214:       timeout: 5_000,
215:       stdio: ['ignore', 'pipe', 'pipe'],
```

```ts
99:     return execFileSync('git', ['rev-parse', 'HEAD'], {
100:       cwd: rootDir,
101:       encoding: 'utf-8',
102:       timeout: 5_000,
103:       stdio: ['ignore', 'pipe', 'pipe'],
```

```ts
4: // Single source of truth for P1 hardcoded config values.
5: // All scalar defaults derive from env-var overrides; object defaults
```

why: CG-035 added the same `5_000` timeout literal to both scan-time and ensure-ready Git HEAD probes, while `config-defaults.ts` explicitly exists as the single source of truth for hardcoded scalar defaults. A future timeout adjustment now requires finding both helpers manually, and the policy cannot be overridden consistently with the rest of the code-graph defaults.

fix: Add a `gitHeadTimeoutMs` default to `CODE_GRAPH_DEFAULTS` (with the same positive-int env override pattern) and use it from both Git HEAD helpers.

confidence: 0.84

### DR-005-03 [P2] [maintainability] Naming conventions still explain the skill-local DB as the old shared-spec-kit location

file: `.opencode/skills/system-code-graph/references/runtime/naming_conventions.md:51`

evidence:

```md
51: | Database directory | `.opencode/skills/system-code-graph/mcp_server/database/` | `INSTALL_GUIDE.md §7` | Shared spec-kit data dir; folder name uses `code-graph` (skill-domain) to keep the path readable across runtimes. |
```

```md
89: The code-graph SQLite triplet (`code-graph.sqlite`, `.sqlite-wal`, `.sqlite-shm`), readiness marker (`.code-graph-readiness.json`), and launcher state (`.mk-code-index-launcher.json`) all live in the shared spec-kit data directory:
90: 
91: ```text
92: .opencode/skills/system-code-graph/mcp_server/database/
93: ```
```

```md
95: This shared location replaced an earlier skill-local location (`.opencode/skills/system-code-graph/mcp_server/database/`) to support cross-runtime coordination — all six runtimes read and write the same database instead of fragmenting state per-runtime. See [`../config/database_path_policy.md`](../config/database_path_policy.md) for the full migration record and override rules.
```

why: The path is now skill-local, but the explanation still says it is a shared spec-kit data directory and line 95 says the current skill-local path replaced an earlier skill-local path. This is distinct from DR-001-04's `database_path_policy.md` drift: this runtime naming reference remains internally self-contradictory after the policy reversal and can mislead maintainers auditing fix #1.

fix: Rewrite the database row and section 5 to say the DB is skill-local and shared across runtimes through the `.opencode/skills` symlink; remove the stale "replaced an earlier skill-local location" sentence or replace it with the actual `.opencode/.spec-kit/code-graph/database/` reversal.

confidence: 0.95

newFindings: 3, dimension: maintainability
