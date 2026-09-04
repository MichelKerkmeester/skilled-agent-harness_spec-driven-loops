# MCP guide

[Documentation](./README.md) · [Agents](./01-agents.md) ·
[CLI](./02-cli.md) · [MCP](./03-mcp.md) · [Pipeline](./04-pipeline.md) ·
[Architecture](./05-architecture.md) · [Server](./06-server.md) ·
[Embedding](./07-embedding.md) · [Roadmap](./08-roadmap.md)

zvec-grep exposes its local search layer over Streamable HTTP MCP. The normal
endpoint is:

```text
http://127.0.0.1:7999/mcp
```

Run `zg install` to configure a supported agent automatically. Use this page
when building another MCP client or when you need the exact boundary between
the default and compatibility toolsets. See
[Server and execution modes](./06-server.md) for lifecycle, mode selection,
refresh, authentication, and logs.

## Transports

| Transport | Command | Execution |
| --- | --- | --- |
| Streamable HTTP | `zg server on` | The shared daemon serves every client |
| stdio bootstrap | `zg server --stdio` | Starts or reuses the daemon and proxies MCP over stdin/stdout |
| stdio direct | `zg server --stdio --mode direct` | Runs the tools in the client's own child process; no daemon |

The tool contract does not change with the transport. The same schemas, input
normalization, and result formatting produce the same tool output; only the
execution backend differs. `ZVEC_GREP_MODE=direct` selects direct mode for the
stdio entry as well, and an explicit `--mode` wins over the environment.

Direct mode suits clients that must not leave a background process running. It
loads the Embedding model lazily on the first search that needs vectors and
keeps it for the life of the process, so a long-lived client pays that cost
once. Its trade-offs are covered in
[Direct-mode stdio](./06-server.md#direct-mode-stdio).

## Default agent toolset

The default `agent` toolset intentionally exposes only search:

Agents first decide whether the requested answer should be grounded in the
current indexed workspace, then choose exact or semantic retrieval. The same
rules apply to source code and non-code material such as documentation, books,
research material, meeting notes, knowledge-base exports, manuals,
configuration, and data.

Workspace relevance requires a request to inspect, search, or ground the answer
in local material, prior context that established local material as the intended
source, or a question about whether relevant local material exists. Negative,
incidental, or comparative workspace mentions do not establish relevance.

| Tool | Use it when | Index required |
| --- | --- | --- |
| `zvec_grep_search` | The answer is workspace-grounded and wording or location is unknown, or semantic, fuzzy, relationship, chronology, causality, comparison, or cross-file synthesis is required | Yes |

Agents use native grep or rg when locating an exact word, quotation, name, date,
key, filename, path, source fragment, or regex is sufficient. For mixed tasks,
start with `zvec_grep_search`, then use native grep or rg for focused follow-up.
When semantic discovery is selected because no sufficient exact anchor is
available and the user asks whether conceptually related material exists
locally, agents make at most one focused search probe and stop when its results
are not relevant. The probe does not apply to exact quotations, configuration
keys, filenames, regexes, or exhaustive occurrence requests. Unrelated
open-world knowledge, current external facts, and web content that does not
depend on local evidence use the appropriate external source instead.

Every workspace tool input uses an absolute `root` visible to the daemon.

## `zvec_grep_search`

The indexed tool supports hybrid, lexical, and vector query groups. At least one
of `query`, `queries`, `fts`, or `vector` is required.

Minimal conceptual search:

```json
{
  "root": "/absolute/path/to/workspace",
  "query": "decision history behind the launch date",
  "limit": 5
}
```

Explicit query routes and scope:

```json
{
  "root": "/absolute/path/to/workspace",
  "query": "authentication flow",
  "fts": ["AuthService", "ForbiddenError"],
  "globs": ["src/**", "!src/generated/**"],
  "fileTypes": ["ts"],
  "fuse": true,
  "limit": 10
}
```

Important inputs:

| Input | Meaning |
| --- | --- |
| `query` | One hybrid natural-language or exact query |
| `queries` | One or more hybrid query groups |
| `fts` | Ranked lexical constraints within indexed search, not exhaustive occurrence lookup |
| `vector` | Semantic-only query groups |
| `fuse` | Combine every group into one ranked plan |
| `limit` | Maximum items per group, up to 50 |
| `globs` / `insensitiveGlobs` | Ordered path rules |
| `fileTypes` / `excludedFileTypes` | ripgrep file-type filters |
| `symbolTypes` / `preferSymbol` | Indexed symbol controls |
| `modifiedAfter` / `modifiedBefore` | File modification-time bounds |
| `freshness` | `eventual` or `wait_for_fresh` |
| `autoUpdate` | Allow an eventual search to schedule a background update |

The response is compact text designed for agent context. It begins with index
state and then groups ranked results by file:

```text
freshness: fresh
src/theme/use-theme.ts:12-36
matched: 16-18
source:
15  export function useTheme() {
16    const [theme, setTheme] = useState("light");
17    useEffect(() => saveTheme(theme), [theme]);
```

When `freshness` is `possibly_stale`, the response may also include current
indexing state. Agents can use sufficient results immediately rather than
running a status preflight.

Direct mode reports the same `freshness` from a status scan, but never reports
`background_refresh`, because nothing refreshes the index in the background. A
`wait_for_fresh` search updates the index inside the call; an `eventual` search
serves the current index and ignores `autoUpdate`.

Remote models may cause the tool to request explicit Remote Embedding
authorization. See
[Embedding models](./07-embedding.md#remote-embedding-and-authorization).

## `zvec_grep_rg`

This tool is retained in the optional `full` MCP toolset and is not registered
in the default `agent` toolset. The CLI equivalent, `zg query --rg`, remains
available without changing the MCP toolset.

Pass the ripgrep command you would otherwise run. The command is parsed into
arguments and is never executed by a shell:

```json
{
  "root": "/absolute/path/to/workspace",
  "command": "rg -n -F 'loadTheme' -g '*.ts' src"
}
```

The tool is exhaustive by default. Append `| head -N` only when intentionally
requesting bounded output:

```json
{
  "root": "/absolute/path/to/workspace",
  "command": "rg -n 'TODO|FIXME' src | head -50"
}
```

Scope broad searches with command paths, `-g/--glob`, or `-t/--type`. Managed rg
supports common ripgrep matching, context, type, glob, ignore, encoding, and
regex-engine options while preserving zvec-grep's compact result format.

## Full compatibility toolset

The CLI owns index lifecycle and diagnostics, so agents normally do not need
administrative MCP tools. Clients that require them can restart the server with:

```bash
zg server off
zg server on --mcp-toolset full
```

The `full` toolset exposes six tools:

| Tool | Purpose |
| --- | --- |
| `zvec_grep_search` | Indexed retrieval |
| `zvec_grep_rg` | No-index exhaustive search |
| `zvec_grep_index` | Create, update, rebuild, or explicitly drop an index |
| `zvec_grep_index_drop` | Explicitly delete an index |
| `zvec_grep_index_status` | Inspect persisted and active index state |
| `zvec_grep_server_status` | Inspect daemon, queue, runtime, and model-pool state |

`zvec_grep_index` requires an absolute root. Its `wait` input defaults to
`false`, returning a background job identifier. Poll `zvec_grep_index_status`
only when completion, progress, failure diagnosis, or explicit monitoring is
needed. An agent must never silently create, rebuild, or delete a persistent
index.

Set `ZVEC_GREP_MCP_TOOLSET=full` as an environment fallback. An explicit
`--mcp-toolset` flag takes precedence.

The `full` toolset in direct mode exposes five tools. There is no daemon to
report on, so `zvec_grep_server_status` is not registered and the server
instructions do not mention it. The remaining tools behave as documented with
two differences: `zvec_grep_index` always runs to completion before it returns,
whatever `wait` requested, and reports the job identifier `direct`; and
`zvec_grep_index_status` returns persisted state without the `runtime` block,
which describes daemon runtimes and jobs.

Remote Embedding authorization still applies in direct mode for a workspace
indexed with a remote model, using the same MCP elicitation as the daemon. One
case is not planned there: a first index that would take a remote model from
`ZVEC_GREP_EMBEDDING` or the global default rather than from an explicit
`embedding` input. That request fails closed with an authorization error
instead of sending workspace content; pass `embedding` explicitly, or build the
index with `zg index`.

## Transport security

The MCP endpoint is loopback-only. Optional Bearer authentication protects the
local Server but remains independent of Embedding provider credentials and
Remote Embedding authorization. Configuration examples are in
[Server authentication](./06-server.md#bearer-authentication).
