# sk-design — Styles Library & Interface Commands: Gap Analysis

> Captures the gaps you flagged in `.opencode/skills/sk-design/styles/**` and the
> `/interface:*` commands, each confirmed against the actual repo state (evidence
> inline). Verdict-first per gap; a proposed target structure follows.
> Read-only analysis — nothing was changed to produce this.

---

## TL;DR

- **The `styles/` directory mixes 1,290 downloaded data folders with the backend code and two manifests in one flat namespace.** Data and logic are not separated.
- **The naming (`_db`, `_engine`, `_harness`, `_manifest.json`, `_retrieval-manifest.json`) violates the repo's kebab-case canon** — none of these are exempt (they're not Python and not historical).
- **The SQLite database is effectively unused: there is no `.sqlite` file on disk, and the default mode is `legacy` (flat files authoritative).** The DB is code-only and dormant.
- **The structure does not follow the proven `deep-loop/runtime` pattern** (code in `lib/`, real DBs in `database/`, clean separation, kebab throughout).
- **The `/interface:*` commands were researched to become "literal prompt" creation templates, but shipped as thin routers.** The research exists and is thorough; the literal-prompt experience you asked for was not delivered.

---

## PART A — Styles library structure, naming & utilization

### A1 — Data and backend are crammed into one flat directory  ⛔ CONFIRMED

`.opencode/skills/sk-design/styles/` holds **1,290 downloaded style folders** (`apple/`,
`ableton/`, `a24/`, `099-supply/`, …) **directly alongside** the backend and manifests:

```
styles/
  apple/  ableton/  a24/  099-supply/  … (1,290 data folders)
  _db/                     ← database code (37 files)
  _engine/                 ← retrieval/adapter code (17 files)
  _harness/                ← extraction harness (2 files)
  _manifest.json           ← crawl manifest
  _retrieval-manifest.json ← DB generation manifest
  README.md
```

**Why it's a gap:** the captured *data* (what you downloaded from refero) and the *backend
logic* (DB, engine, harness) share one namespace. Browsing, gitignoring, backing up, or
reasoning about "the styles" is impossible without stepping over code, and vice-versa. This
is the "styles should be in a separate folder from the back-end & database logic" point —
confirmed literally.

### A2 — Underscore/snake naming violates the kebab-case canon  ⛔ CONFIRMED

The repo's single source of truth — `sk-doc/shared/references/filesystem-naming-convention.md`
("Kebab-Case Canon") — states: *"Kebab-case (hyphens) is the sole canonical form for in-scope
filesystem names across the repository. This covers directory names, file names, and script
filenames."* The only exemptions are **Python source files**, **Python import-package dirs**,
and **historical/changelog names**.

`_db`, `_engine`, `_harness`, `_manifest.json`, `_retrieval-manifest.json` are **none of those**
→ they are non-conformant on two counts: the **leading underscore** and the **snake/underscore
word form**. (The kebab target would be `database/`, `engine/`, `harness/`, `manifest.json`,
`retrieval-manifest.json`.)

> Note: this is exactly the tree the repo-wide hyphen-naming program (sk-doc/017, 020) is meant
> to catch — the styles backend predates or slipped that migration.

### A3 — Two overlapping manifests at the root  ⚠️ CONFIRMED (redundancy/confusion)

There are **two** manifests, both listing 1,290 styles, both at the `styles/` root:

| File | Purpose | Shape |
|---|---|---|
| `_manifest.json` | **Crawl** manifest (flat-file world) | array of `{uuid, url, lastmod, slug, status, capturedAt, error}` |
| `_retrieval-manifest.json` | **DB generation** manifest (database world) | `{schemaVersion, generationHash, crawlManifestHash, recordCount: 1290, styles[…]}` |

Two sources of truth for "the set of styles," living side by side, is a maintenance and
drift hazard — and neither belongs at the data root.

### A4 — The database is dormant; "how is it utilized?" → it largely isn't  ⛔ CONFIRMED

- **No database file exists.** `_db/` contains only code (`schema.mjs`, `indexer.mjs`,
  `retrieval.mjs`, `canonical.mjs`, `generation-manifest.mjs`, `operator.mjs`, `vectors.mjs`,
  `stage-telemetry.mjs`, `oracle/`, `__tests__/`) — **no `.sqlite`/`.db` on disk.**
- **The default mode is `legacy`.** `_engine/persistent-adapter.mjs:104`:
  `const mode = options.styleDatabaseMode ?? process.env.SK_DESIGN_STYLE_DB_MODE ?? 'legacy';`
  and `_db/README.md:141`: *"`legacy` | Default. Runs the unchanged manifest and flat-file engine."*
- **What actually runs today:** the design-mode corpus modules (`design-interface/corpus/
  relational-exemplar.mjs`, `design-motion/corpus/motion-evidence.mjs`, `design-audit/corpus/
  comparison-lane.mjs`, `design-foundations/corpus/relationship-blueprint.mjs`) query through
  `_engine/style-library.mjs`, which runs the **legacy flat-file engine** — not the SQLite DB.

**Net:** the flat-file library is used; the SQLite database (`_db`, ~37 files, adversarially
reviewed this session) is **built but never instantiated or hit on the default path.** It is
opt-in only (`SK_DESIGN_STYLE_DB_MODE=shadow|persistent`) and has no on-disk DB to hit. That is
a large amount of code (schema, indexer, retrieval, vectors, oracle, telemetry) with **zero
default-path utilization**.

### A5 — Structure doesn't follow the proven `deep-loop/runtime` pattern  ⚠️ CONFIRMED

The pattern you called out as "proven to work" (`system-deep-loop/runtime/`) separates cleanly:

```
runtime/
  lib/          ← code as kebab modules (council/, coverage-graph/, event-envelope/, …)
  database/     ← REAL DBs (council-graph.sqlite, deep-loop-graph.sqlite + wal/shm, observability-events.jsonl)
  scripts/  hooks/  tests/  references/  package.json  tsconfig.json  README.md
```

Styles has none of this shape: no `lib/`, no `database/` holding a real `.sqlite`, no separation
of data from code, and underscore names instead of kebab. Mirroring runtime would put the query
code in a `lib/`-style module tree, the actual DB file under `database/`, and the data out of the
way — all kebab-case.

---

## PART B — `/interface:*` commands: the "literal prompts" gap

### B1 — The research exists and is thorough  ✅ (you remembered right)

`.opencode/specs/sk-design/012-style-database-and-interface-commands/002-research-design-commands/
research/research.md` is a **20-iteration deep-research** run that answered, verbatim (its Q2):
*"Which reusable prompt structures appear in Anthropic's frontend-design skill, Open Design, and
Aura skills?"* — exactly your "literal prompts as seen in Claude design / Open Design" ask. It
even authored **literal prompt templates** per command in its §7, e.g. for `/interface:design`:

```text
Create or reshape {target}. Resolve the brief and bounded assumptions; ground one
decision in owned or subject-fit evidence; load workflowMode=interface; produce and
critique a brief-specific token/layout/signature plan before build; inspect any real
render; run interface proof; return the common blocks and accepted handoff.
```

### B2 — But the implementation shipped thin routers, not literal prompts  ⛔ GAP

What actually shipped (`.opencode/commands/interface/design.md`, 86 lines) is a **router**, by
its own words (line 9): *"Creation-template **router** for stable workflowMode=interface."* It
resolves a mode, points at a shared contract + a presentation asset + auto/confirm YAML, and
delegates. The user-facing prompt content it points to (`interface-design-presentation.txt`,
62 lines) is a thin **intake/output contract** (progressive-intake table, output block list,
status lines) — **not** a rich, self-contained design prompt with taste guidance and worked
examples the way Anthropic's frontend-design skill or Open Design read.

The shared `creation-contract.md` (206 lines) *is* substantive — it implements the research's
9-stage lifecycle, typed envelope, intake, grounding, proof, and handoff. So the **architecture**
from the research landed. What did **not** land is the thing you actually asked for: the command
as a **literal, evocative design prompt**. The research even flagged this fork as an open question
(§13: *"Does the command runtime support a literal include/shared-fragment mechanism, or should
canonical prompts use the smallest supported generated/shared contract pattern?"*) — and the
build chose the shared-contract/router pattern, quietly trading away the literal-prompt experience.

**Net:** research done → architecture implemented → **literal-prompt experience dropped.** Your
instinct ("the AI never did anything with that request") is ~60% right: the *insight* was
captured and turned into plumbing, but the *deliverable you wanted* (commands that read like
Claude-design prompts) was never produced.

---

## Proposed target structure (direction, not yet a plan)

Mirror `deep-loop/runtime`, separate data from logic, kebab throughout:

```
sk-design/styles/
  library/                        ← DATA ONLY: the 1,290 captured styles
    <slug>/DESIGN.md, tokens…
    manifest.json                 ← crawl manifest (was _manifest.json)
  engine/                         ← flat-file retrieval + the legacy adapter (was _engine)
  database/                       ← DB layer (was _db): schema, indexer, retrieval, vectors, oracle
    styles.sqlite                 ← the actual DB file (currently missing)
    retrieval-manifest.json       ← generation manifest (was _retrieval-manifest.json)
  harness/                        ← extraction/refresh harness (was _harness)
  README.md
```

Plus a decision on **A4**: either (a) wire the DB into the default path and actually build the
`.sqlite` (justify the ~37-file backend), or (b) formally shelve it and keep the flat-file
engine as the single source — but don't leave ~50 files of dormant DB/engine code claiming to
be "the styles database" when nothing uses it.

---

## Open questions for you (before any restructure)

1. **DB fate:** make the SQLite DB the real default path, or shelve it and keep flat-files? (A4)
2. **Data location:** `styles/library/` in place, or a separate top-level styles store entirely?
3. **Commands:** do you want the `/interface:*` commands rewritten as literal, Claude-style design
   prompts (B2) — i.e., actually spend the research — or keep the router+contract architecture?
4. **Scope:** one restructure packet covering A1–A5, with B as a separate command-rewrite packet?

---

## Evidence index

- Structure/counts: `ls .opencode/skills/sk-design/styles` (1,290 non-underscore dirs + 5 backend items).
- Naming rule: `sk-doc/shared/references/filesystem-naming-convention.md` (Kebab-Case Canon; exemptions).
- DB dormancy: `_engine/persistent-adapter.mjs:104` (`?? 'legacy'`), `_db/README.md:141`, no `.sqlite` in `_db/`.
- Consumers: `design-*/corpus/*.mjs` → `_engine/style-library.mjs` (legacy path).
- Runtime pattern: `system-deep-loop/runtime/{lib,database}/` (real `.sqlite` files, kebab modules).
- Commands: `commands/interface/design.md:9` ("router"), `interface-design-presentation.txt`, `shared/creation-contract.md`.
- Research: `specs/sk-design/012-.../002-research-design-commands/research/research.md` (20 iters, §7 literal templates, §13 open Q).
