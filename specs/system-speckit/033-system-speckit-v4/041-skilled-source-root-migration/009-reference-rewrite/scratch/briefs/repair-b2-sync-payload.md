## Edit 1

File: `.codex/SYNC.md`

OLD:

~~~~text
| Everything at once | `/doctor runtime-mirrors` | read-only |

**Orphaned entries.** Ownership is keyed on the adapter path, so renaming a hook script leaves the old entry unrecognised in `~/.codex/hooks.json` — where the preserve-third-party rule would keep it forever, invoking a file that no longer exists. The installer therefore treats **any `.opencode/` path missing on disk as its own orphan** and prunes it; paths outside `.opencode/` are never touched, whether or not they resolve. This is not hypothetical: the `mcp_server` → `mcp-server` rename left five dead entries across `SessionStart`, `UserPromptSubmit`, `Stop` and `PreCompact`, and `--check` reported OK the whole time because every *expected* entry was present.

---
~~~~

NEW:

~~~~text
| Everything at once | `/doctor runtime-mirrors` | read-only |

**Orphaned entries.** Ownership is keyed on the adapter path, so renaming a hook script leaves the old entry unrecognised in `~/.codex/hooks.json` — where the preserve-third-party rule would keep it forever, invoking a file that no longer exists. The installer therefore treats **any `.skilled/` or `.opencode/` path missing on disk as its own orphan** and prunes it; paths outside both roots are never touched, whether or not they resolve. This is not hypothetical: the `mcp_server` → `mcp-server` rename left five dead entries across `SessionStart`, `UserPromptSubmit`, `Stop` and `PreCompact`, and `--check` reported OK the whole time because every *expected* entry was present.

---
~~~~
