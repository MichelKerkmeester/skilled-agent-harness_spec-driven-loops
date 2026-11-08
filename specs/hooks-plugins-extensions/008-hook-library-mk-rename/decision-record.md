---
title: "Decision Record: Hook Library mk- Prefix Rename"
description: "The scope and convention decisions behind the hook-library mk- rename, including why the live daemons are included but gated and why historical specs are excluded."
trigger_phrases:
  - "hook rename decisions"
  - "mk rename adr"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/008-hook-library-mk-rename"
    last_updated_at: "2026-08-21T09:16:30Z"
    last_updated_by: "claude"
    recent_action: "Regenerated packet metadata to pass strict validate"
    next_safe_action: "Complete daemon cutover on next fresh session"
---
# Decision Record: Hook Library `mk-` Prefix Rename

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Include the two live MCP daemons in the rename

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted (operator-selected) |
| **Date** | 2026-08-20 |
| **Deciders** | Operator, AI |

---

<!-- ANCHOR:adr-001-context -->
### Context

`mk-spec-memory` and `mk_skill_advisor` are live MCP servers, not just plugin
files. Discovery showed the `mk-` daemon names were deliberately set by prior
rename packets. Reversing that is a real decision, not a mechanical sweep: it
touches live sockets, ~96 active agent/config files, and forces a daemon restart.

<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

Include the daemons in the rename. Shown the measured cost, the operator chose the
full-convention change (`mk-` → `system-`) over a plugin-only rename, so the
daemon layer aligns with the `system-*` skill packages that own it.

<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Include daemons (chosen)** | One consistent convention across the whole library | Live-socket cutover + ~96 agent-file edits; needs a restart | 8/10 |
| Plugin-only rename | Zero daemon risk; no restart | Leaves the two most-referenced names on the old prefix — the inconsistency the packet exists to remove | 5/10 |

<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

The daemon layer moves from `mk-` to `system-`. Prior packets' `mk-` choice is
superseded. The blast radius is concentrated in Phase 5, which is why that phase
is gated and staged (ADR-002).

<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks

1. **Clarity** — `system-spec-memory` / `system-skill-advisor` name their owning skill package; `mk-` named nothing.
2. **Systems** — the server key drives the `mcp__…__` tool namespace, so every agent allowlist must move in lockstep; identified and swept.
3. **Bias** — this is the real problem (opaque identity), not a symptom; the operator confirmed intent rather than the AI inferring it.
4. **Sustainability** — a future reader maps hook → owner directly; no tribal knowledge of `mk-` required.
5. **Scope** — bounded to the two daemons + their references; historical specs excluded (ADR-005).

<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation

**Affected systems**: `opencode.json` / `.claude/mcp.json` / `.codex/config.toml` / `.cursor/mcp.json` server keys; launchers + bridges; `/tmp/system-*` sockets; `mcp__system_*__` namespaces across ~96 agent/command files.

**Rollback**: revert the daemon-rename commit(s) so configs point back to `mk-*`; restart any daemon bound to `/tmp/system-*` on `/tmp/mk-*`; verify an `mcp__mk_spec_memory__*` call resolves.

<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Gate and stage the daemon rename (Phase 5)

**Status**: Accepted · **Date**: 2026-08-20

### Context
Renaming daemon sockets and server keys affects any running daemon and the tool
namespaces every agent allowlist references. This is the highest-blast part.

### Decision
Isolate the daemon rename in Phase 5, behind an explicit operator go-ahead, with a
named rollback (revert configs + restart on `/tmp/mk-*`). Phases 1–4 and 6 do not
depend on it landing.

### Consequences
The library rename (Phases 1–4) can complete and merge even if the daemon cutover
is deferred to a follow-up window — which is exactly what happened (cutover left
for the next fresh session).

<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Keep shared-core dir stems; rename only the adapters

**Status**: Accepted · **Date**: 2026-08-20

### Context
The runtime-neutral cores under `.opencode/hooks/<name>/` and the per-runtime
scripts already use unprefixed stems (`mcp-route-guard.cjs`, `post-edit-quality.cjs`).
Only the OpenCode plugin adapters carry `mk-`.

### Decision
Rename the adapters (and their env constants/banners); keep the core directory
stems. Where a plugin's new name differs from the core stem, the adapter name
changes while the core stem stays.

### Alternatives Considered
Rename every core dir + all 5 runtime script stems to the new identity —
**rejected**: large 5-runtime churn for zero readability gain, and the cores are
shared/neutral so a skill-specific stem would misrepresent them.

### Consequences
Avoids multiplying 5-runtime churn; the new identity lives on the adapter, which
is what a reader looks up first.

<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Env vars — new canonical names + permanent `MK_` aliases

**Status**: Accepted (operator-confirmed 2026-08-20)

### Context
`MK_` is a deliberately unique, collision-safe env namespace. Renaming to a generic
prefix would reduce collision safety. But the operator chose full library
consistency including env flags, and `hook-flags.cjs` already carries a
`LEGACY_ALIASES` mechanism for exactly this.

### Decision
Introduce new canonical env names matching each plugin's new identity (`SYSTEM_*`,
`SK_CODE_*`, `SK_GIT_*`, `CLI_*`, `MCP_*`, `CODEX_*`, `OPENCODE_*`) and retain
**every** old `MK_*` name **permanently** as an alias — DISABLED flags via
`LEGACY_ALIASES`, direct-read config vars via a forward-mapping shim. No operator
config ever breaks.

### Alternatives Considered
Keep `MK_` untouched for namespace safety — **rejected** in favor of consistency,
but made safe: the permanent aliases mean either choice is non-breaking.

### Consequences
Consistency with file names; zero breakage; both names live indefinitely until a
separate deprecation packet. (The post-sweep audit later caught that several new
kill-switch names had not been taught to the resolver — fixed additively.)

<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Leave historical `specs/**` untouched

**Status**: Accepted (operator-selected)

### Context
~45,534 of ~47,969 `mk-` occurrences (95%) are under `specs/**` — implementation
summaries and past packet folder names that accurately describe the system as it
was when written. Spec-folder metadata and memory-search keys index on those names.

### Decision
Rename only live/functional surfaces + active authoritative docs. Historical spec
docs keep the names that were true when written; new docs use new names.

### Consequences
The historical record stays accurate; no risk of desyncing spec metadata or memory
indexes; the change stays bounded (~2,435 references).

<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: Defer validate/generate/reindex to `main` post-merge

**Status**: Accepted (sk-git large-reorg playbook)

### Context
The ad-hoc worktree lacks gitignored `node_modules`/`dist`; the memory and vector
DBs are a single global instance, not per-worktree. Strict-validate in a bare
worktree is meaningless (may silently no-op on zero files).

### Decision
Do all `git mv` + edits in the worktree; run `validate.sh --strict`,
`generate-context.js`, graph-metadata backfill, and memory reindex on `main` after
merge. `description.json`/`graph-metadata.json` are hand-stubbed in the worktree
and regenerated on `main`.

### Consequences
Trustworthy validation; correct metadata; no false-green in the worktree. This
packet-completion pass is the realization of that deferral.

<!-- /ANCHOR:adr-006 -->
