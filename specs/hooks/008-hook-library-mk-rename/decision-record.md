---
title: "Decision Record: Hook Library mk- Prefix Rename"
description: "The scope and convention decisions behind the hook-library mk- rename, including why the live daemons are included but gated and why historical specs are excluded."
trigger_phrases:
  - "hook rename decisions"
  - "mk rename adr"
importance_tier: "normal"
contextType: "general"
---
# Decision Record: Hook Library `mk-` Prefix Rename

<!-- SPECKIT_LEVEL: 3 -->

---

## ADR-001 — Include the two live MCP daemons in the rename

**Status**: Accepted (operator-selected)

**Context**: `mk-spec-memory` and `mk_skill_advisor` are live MCP servers, not just
plugin files. Discovery showed the `mk-` daemon names were deliberately set by
prior rename packets (`052-mk-spec-memory-rename`, `015-mcp-server-mk-skill-advisor-rename`,
`007-024-mcp-tool-rename-mk-code-index`). Reversing that is a real decision.

**Decision**: Include the daemons. The operator, shown the measured cost (live
sockets, ~96 active agent/config files, daemon restart), chose the full-convention
change over a plugin-only rename.

**Consequence**: The daemon layer moves from `mk-` to `system-`, aligning with the
`system-*` skill packages that own them. Prior packets' `mk-` choice is superseded.

---

## ADR-002 — Gate and stage the daemon rename (Phase 5)

**Status**: Accepted

**Context**: Renaming daemon sockets and server keys affects any running daemon and
the tool namespaces every agent allowlist references. This is the highest-blast part.

**Decision**: Isolate the daemon rename in Phase 5, behind an explicit operator
go-ahead, with a named rollback (revert configs + restart on `/tmp/mk-*`). Phases
1–4 and 6 do not depend on it landing.

**Consequence**: The library rename (Phases 1–4) can complete and merge even if the
daemon cutover is deferred to a follow-up window.

---

## ADR-003 — Keep shared-core dir stems; rename only the adapters

**Status**: Accepted

**Context**: The runtime-neutral cores under `.opencode/hooks/<name>/` and the
per-runtime scripts already use unprefixed stems (`mcp-route-guard.cjs`,
`post-edit-quality.cjs`). Only the OpenCode plugin adapters carry `mk-`.

**Decision**: Rename the adapters (and their env constants/banners); keep the core
directory stems. Where a plugin's new name differs from the core stem (e.g.
`sk-code-post-edit-quality` adapter over the `post-edit-quality` core), the
adapter name changes while the core stem stays.

**Consequence**: Avoids multiplying 5-runtime churn for zero readability gain; the
new identity lives on the adapter, which is what a reader looks up first.

**Rejected alternative**: rename every core dir + all 5 runtime script stems to the
new identity — large churn, and the cores are shared/neutral so a skill-specific
stem would misrepresent them.

---

## ADR-004 — Env vars: new canonical names + permanent `MK_` aliases

**Status**: Accepted (operator-confirmed 2026-08-20)

**Context**: `MK_` is a deliberately unique, collision-safe env namespace. Renaming
to a generic prefix (e.g. bare `SYSTEM_`) would reduce collision safety. But the
operator chose "full library consistency" including env flags. `hook-flags.cjs`
already carries a `LEGACY_ALIASES` mechanism for exactly this.

**Decision**: Introduce new canonical env names matching each plugin's new identity
(`SYSTEM_*`, `SK_CODE_*`, `SK_GIT_*`, `CLI_*`, `MCP_*`, `CODEX_*`, `OPENCODE_*`),
and retain **every** old `MK_*` name **permanently** as an alias — DISABLED flags
via `LEGACY_ALIASES`, direct-read config vars via a `readEnv(new, ...old)` helper.
No operator config ever breaks.

**Consequence**: Consistency with file names; zero breakage; both names live
indefinitely until a separate deprecation packet.

**Open**: operator may prefer to keep `MK_` untouched for namespace safety. Either
choice is compatible with all other phases.

---

## ADR-005 — Leave historical `specs/**` untouched

**Status**: Accepted (operator-selected)

**Context**: 45,534 of 47,969 `mk-` occurrences (95%) are under `specs/**` —
implementation summaries and past packet folder names that accurately describe the
system as it was when written. Spec-folder metadata (`description.json`,
`graph-metadata.json`) and memory-search keys index on those names.

**Decision**: Rename only live/functional surfaces + active authoritative docs.
Historical spec docs keep the names that were true when written; new docs use new
names.

**Consequence**: The historical record stays accurate; no risk of desyncing spec
metadata or memory indexes; the change stays bounded (~2,435 references).

---

## ADR-006 — Defer validate/generate/reindex to `main` post-merge

**Status**: Accepted (sk-git ALWAYS #8 / large-reorg playbook)

**Context**: The ad-hoc worktree lacks gitignored `node_modules`/`dist`; the memory
and vector DBs are a single global instance, not per-worktree. Strict-validate in a
bare worktree is meaningless (may silently no-op on zero files).

**Decision**: Do all `git mv` + edits in the worktree; run `validate.sh --strict`,
`generate-context.js`, graph-metadata backfill, and memory reindex on `main` after
merge. `description.json`/`graph-metadata.json` are hand-stubbed here and
regenerated there.

**Consequence**: Trustworthy validation; correct metadata; no false-green in the
worktree.
