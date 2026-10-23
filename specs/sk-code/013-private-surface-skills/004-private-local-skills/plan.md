---
title: "Implementation Plan: Phase 4: private-local-skills"
description: "Restore both removed surface trees from commit 42b41dd286 into two gitignored local-* skills, then make each one standalone: real workflow references instead of hub symlinks, links recomputed for the new location, no hub-bundling prose, and one skill-root graph-metadata.json."
trigger_phrases:
  - "private local skills plan"
  - "restore surfaces from history"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: private-local-skills

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill documents, JSON skill metadata, Bash restore commands |
| **Framework** | sk-code skill contract (SKILL.md frontmatter, `graph-metadata.json`, references/assets tree) |
| **Storage** | None. The two skills live as gitignored folders or as symlinks to a private repository; the advisor database is throwaway |
| **Testing** | Link audit over both trees, `regenerate-skill-derived.cjs --write` followed by a confirming dry run, throwaway advisor database with `sqlite3`, `validate.sh --strict` |

### Overview
The restore is a single `git archive` pipeline pinned to `42b41dd286`, so both skills are byte-identical to what the hub shipped. Everything after it is a consequence of the move: three `references/workflow-*.md` symlinks become real copies, every relative link that escapes the skill root is recomputed from the new depth, every absolute `.skilled/skills/sk-code/sk-code-*` path names the new folder, and the hub-surface prose becomes standalone-skill prose. Each skill ends with one skill-root `graph-metadata.json` so the operator's advisor can score it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [ ] Phase 003's compiler skip is on `origin/main` and in the operator's working copy (T001 proves it; it is not assumed)
- [ ] `git cat-file -t 42b41dd286` prints `commit` in the operator's main checkout (T001 proves it)
- [ ] `git check-ignore -v .skilled/skills/local-webflow` names the phase 1 rule (T003 or T005 proves it)
- [ ] ADR-001 records a folder mode (T002 stops while it is pending)

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Link audit on both skills reports only the one pre-existing broken link
- [ ] `git status --porcelain .skilled` and `git diff --cached --name-only` are both empty
- [ ] Docs updated (spec/plan/tasks)
- [ ] The phase commit is on `main` and `HEAD` equals `origin/main`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two self-contained evidence skills, restored by archive and made location-independent. Nothing is shared by reference: the hub tier they used to reach by relative path is either copied in (`references/workflow-*.md`) or reached by a recomputed relative link.

### Key Components
- **`.skilled/skills/local-webflow/`**: the restored Webflow evidence tree, either a real folder or a symlink to a private repository, holding `SKILL.md`, `README.md`, `references/`, `assets/`, `manual-testing-playbook/`, `changelog/`, `benchmark/`, and a new `graph-metadata.json`.
- **`.skilled/skills/local-obsidian/`**: the restored Obsidian evidence tree with the same shape minus `benchmark/`.
- **`graph-metadata.json` (skill root, one per skill)**: the identity the advisor's disk scan reads. `skill_id` must equal the folder name; `family` must be one of `cli`, `mcp`, `sk-code`, `sk-hub`, `deep-loop`, `sk-util`, `system`.
- **`references/workflow-{implement,debug,verify}.md`**: real copies of the hub's shared doctrine, because the symlink target `../../shared/references/` no longer resolves from the new depth.

### Data Flow
`git archive 42b41dd286 <surface path>` -> `tar --strip-components=4` -> the new skill folder. Then the edits: symlinks replaced, links recomputed, prose rewritten, `graph-metadata.json` written. The advisor's disk scan (`skill-graph-db.ts:733`, made symlink-aware by phase 3) reads each skill root's `graph-metadata.json`, the scorer reads `SKILL.md`'s `description`, and the local advisor returns the skill on a matching prompt.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/skills/sk-code/sk-code-webflow/` (restore source) | Tracked surface removed by phase 2 | read only, never edited | `git cat-file -t 42b41dd286` prints `commit`; the archive listing is quoted in Step 0 |
| `.skilled/skills/sk-code/sk-code-obsidian/` (restore source) | Tracked surface removed by phase 2 | read only, never edited | same archive listing for the Obsidian path |
| `.skilled/skills/sk-code/shared/references/workflow-*.md` | Public shared doctrine, the copy source | unchanged; copied, never moved | `git status --porcelain .skilled` stays empty after the copy step |
| `.skilled/skills/local-webflow/`, `.skilled/skills/local-obsidian/` | New gitignored skills | create, then edit | `git status --porcelain --ignored .skilled/skills/local-webflow .skilled/skills/local-obsidian` shows two `!!` entries |
| Root `.gitignore` (phase 1) | Owns the ignore rules | not a consumer, unchanged | `git check-ignore -v` names the rule for each path |
| `.skilled/scripts/git-hooks/pre-commit` (phase 1) | Refuses a staged `local-*` path | not a consumer, unchanged | `git diff --cached --name-only` is empty |
| Advisor disk scan `skill-graph-db.ts:733` (phase 3) | Reads skill-root `graph-metadata.json` | not a consumer of this phase's code, but it must accept the chosen folder mode | throwaway database contains both `local-*` nodes |
| `regenerate-skill-derived.cjs` | Repairs `derived` drift | consumer of the new metadata | `--write` reports `written` or `unchanged` and a following dry run reports `unchanged`, never `error` |
| This child's documents | Plan and gates | update | `validate.sh --strict` prints `RESULT: PASSED` |

Required inventories:
- Same-class producers: `git grep -n -E 'sk-code-webflow|sk-code-obsidian' 42b41dd286 -- .skilled/skills/sk-code/sk-code-webflow .skilled/skills/sk-code/sk-code-obsidian` lists every self-naming site this phase rewrites. The working-tree paths no longer exist once phase 2 lands, so the inventory reads the pinned commit.
- Consumers of changed symbols: `rg -n 'local-webflow|local-obsidian' .skilled --glob '!*/local-*/**'` must stay empty; nothing outside the two skills learns these names.
- Matrix axes: folder mode (real folder, symlink) x path reference form (absolute repo path, relative link, prose mention) x document kind (SKILL.md, README.md, reference, playbook, asset README).
- Algorithm invariant: for every relative link in a skill, `resolve(new file dir, new link) == resolve(old file dir, old link)`. Adversarial cases: a link that escapes to the hub shared tier, a link that escapes to another skill, a link that stays inside the skill, a link that was already broken, and a prose path mention that is not a link.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. This section owns the commands, the anchors and the replacement text those tasks name.

### Step 0 - Preconditions (no file changes)

| Check | Command | Expected |
|---|---|---|
| Phase 003's compiler skip is on `main` | `git show origin/main:.skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py` then `grep -c 'if entry.startswith("local-"):'` | `1`; any other count means phase 003 has not landed, so stop |
| Phase 003's compiler skip is in the working copy | `grep -c 'if entry.startswith("local-"):' .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py` | `1` |
| Restore source exists | `git cat-file -t 42b41dd286` | `commit` |
| Ignore rules exist | `git check-ignore -v .skilled/skills/local-webflow` | a line naming `.gitignore` and `/.skilled/skills/local-*`; a bare exit 1 means phase 1 has not landed, so stop |
| Nothing staged yet | `git diff --cached --name-only` | no output |
| Nothing under `.skilled/` is modified or untracked | `git status --porcelain .skilled` | no output |

Every step in this plan runs in one of two checkouts, split by what each one holds. Steps 1 to 6 and 8 to 9 run in the operator's main checkout, `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`, not in a worktree, because both `local-*` trees are gitignored and ignored files never travel between checkouts: a tree restored inside a worktree stays in that worktree, invisible to the operator's checkout and to the advisor that serves it. Step 10 and the commit run in the authoring worktree that holds this packet, `<worktree>`, because this child's documents exist only there. No packet document is copied between the two checkouts: Step 10 transcribes readings taken in the operator's checkout, and the commit stages the worktree copy.

### Step 1 - Read the folder-mode decision and run exactly one restore pair

The mode is one operator decision, recorded in `decision-record.md` ADR-001 as three metadata cells.
T002 reads them and stops while `Status` reads `Pending operator decision`. Once the answer is recorded,
exactly one pair below runs: T003 and T004 for a real folder, T005 and T006 for a symlink.

**Mode A - real folder**

```bash
mkdir -p .skilled/skills/local-webflow .skilled/skills/local-obsidian
git archive 42b41dd286 .skilled/skills/sk-code/sk-code-webflow | tar -x --strip-components=4 -C .skilled/skills/local-webflow
git archive 42b41dd286 .skilled/skills/sk-code/sk-code-obsidian | tar -x --strip-components=4 -C .skilled/skills/local-obsidian
```

**Mode B - symlink to a private repository**

```bash
PRIVATE_ROOT=$(grep -F '| **Private repository root** | /' .worktrees/215-private-surface-level3-plans/specs/sk-code/013-private-surface-skills/004-private-local-skills/decision-record.md | cut -d'|' -f3 | sed 's/^ *//; s/ *$//')
mkdir -p "$PRIVATE_ROOT/local-webflow" "$PRIVATE_ROOT/local-obsidian"
git archive 42b41dd286 .skilled/skills/sk-code/sk-code-webflow | tar -x --strip-components=4 -C "$PRIVATE_ROOT/local-webflow"
git archive 42b41dd286 .skilled/skills/sk-code/sk-code-obsidian | tar -x --strip-components=4 -C "$PRIVATE_ROOT/local-obsidian"
ln -s "$PRIVATE_ROOT/local-webflow" .skilled/skills/local-webflow
ln -s "$PRIVATE_ROOT/local-obsidian" .skilled/skills/local-obsidian
```

`--strip-components=4` drops `.skilled/skills/sk-code/<surface>/`, so the archive's contents land
directly in the target folder. Both modes run from the repository root of the operator's main checkout
(`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`), not a worktree: the restored trees
are ignored, so a copy written in a worktree would never reach the checkout that the operator's advisor
scans. Mode B stores an absolute link target, so the private repository must not move afterwards, and
every advisor process needs `SPECKIT_PRIVATE_SKILL_ROOTS` set to that root, which Step 9 exports.

Proof: `test -f .skilled/skills/local-webflow/SKILL.md && test -f .skilled/skills/local-obsidian/SKILL.md && echo OK` prints `OK`, and `find .skilled/skills/local-webflow/ -type f | wc -l` prints `158` while the `local-obsidian` twin prints `62` (the six workflow references are still symlinks at this point).

### Step 2 - Replace the six workflow symlinks with real copies

The archive preserves symlinks, so each skill still has three links into a hub-relative path. Remove the link first: a redirect or a `cp` onto an existing symlink writes through it into the tracked hub file. The copy source is the pinned commit, not the working tree, so the bytes cannot change if phase 2 edited the hub tier.

```bash
for skill in local-webflow local-obsidian; do
  for f in implement debug verify; do
    rm ".skilled/skills/$skill/references/workflow-$f.md"
    git show "42b41dd286:.skilled/skills/sk-code/shared/references/workflow-$f.md" > ".skilled/skills/$skill/references/workflow-$f.md"
  done
done
```

Proof: `find .skilled/skills/local-webflow/ .skilled/skills/local-obsidian/ -type l | wc -l` prints `0` (the trailing slash follows a symlinked skill folder, so the skill link itself is not counted), `find .skilled/skills/local-webflow/ -type f | wc -l` now prints `161` and the `local-obsidian` twin `65`, and `git status --porcelain .skilled` stays empty.

### Step 3 - Fix the guardrail link inside the copies that carry it

Each copy carries the hub's own relative link to the guardrail document, `../../sk-code-skilled/references/shared/workflow-guardrails.md`, which is correct from `sk-code/shared/references/` and wrong from `<skill>/references/`.

- In `.skilled/skills/local-webflow/references/workflow-implement.md`, `.skilled/skills/local-webflow/references/workflow-verify.md`, `.skilled/skills/local-obsidian/references/workflow-implement.md` and `.skilled/skills/local-obsidian/references/workflow-verify.md`, read the file and locate `../../sk-code-skilled/references/shared/workflow-guardrails.md` and replace it with `../../sk-code/sk-code-skilled/references/shared/workflow-guardrails.md`.

Proof: `grep -rc "\.\./\.\./sk-code/sk-code-skilled/references/shared/workflow-guardrails.md" .skilled/skills/local-webflow/references/workflow-*.md .skilled/skills/local-obsidian/references/workflow-*.md` reports 1 for the two implement copies and 2 for the two verify copies, and `grep -rn "\.\./\.\./sk-code-skilled/" .skilled/skills/local-webflow .skilled/skills/local-obsidian` prints nothing.

### Step 4 - Create the link audit and record its post-rewrite expectation

The audit script is the phase's link proof. Create it once at the absolute path `/tmp/psurf-phase4/link-audit.sh`, from the operator's main checkout, and run it after Steps 5 to 7. The path is absolute and outside the repository on purpose: the packet's own `scratch/` is a different directory that only holds `.gitkeep`, a bare `scratch/` at the repository root is not gitignored, and an interrupted run would otherwise leave an untracked directory behind.

The script lives at `/tmp/psurf-phase4/link-audit.sh` while the phase runs and is deleted with its directory before the evidence step, so neither checkout gains an untracked path and `git status --porcelain .skilled` stays empty.

```bash
mkdir -p /tmp/psurf-phase4
cat > /tmp/psurf-phase4/link-audit.sh <<'SH'
fail=0
for f in $(find "$1/" -name '*.md' -not -path '*/changelog/*' -not -path '*/benchmark/reports/*'); do
  d=$(dirname "$f")
  for t in $(grep -o -E '\]\([^)]+' "$f" | sed 's/^](//' | sed 's/#.*$//' | grep -v -E '^(https?:|mailto:|$)' | sort -u); do
    case "$t" in /*) continue;; esac
    [ -e "$d/$t" ] || { echo "BROKEN $f -> $t"; fail=1; }
  done
done
echo "AUDIT_FAIL=$fail"
SH
```

The script appends a slash to its argument before `find`, so it descends into a symlinked skill folder as well as a real one. Run it right after Step 3 as an intermediate reading: at that point both runs end `AUDIT_FAIL=1`, because the move-induced breakage has not been repaired yet. That reading proves the script runs; it is not the phase's pass condition.

The pass condition is the measured state of the same audit against the tracked surfaces at `42b41dd286` in their hub location, before phase 2 removed them: Webflow reported exactly one broken link, `BROKEN .../references/javascript/quality-standards/shared-listener-and-weakmap.md -> target`, and ended `AUDIT_FAIL=1`; Obsidian reported none and ended `AUDIT_FAIL=0`. Steps 5 to 7 must reach that same state from the new location, so the one `-> target` line is the only finding allowed afterwards.

### Step 5 - Rewrite every relative link the move breaks

Rule, applied to every `.md` file under both skills except `changelog/` and `benchmark/reports/`: for each relative link whose target exists at `42b41dd286` and lies **outside** the skill folder, compute the path from the file's **new** location and write that. A link whose target stays inside the skill is unchanged, because the whole subtree moves rigidly. A link whose target does not exist was already broken and stays as it is.

The complete set the rule produces is the edit catalogue below: every relative link the audit reports as escaping the skill root, `E-20` to `E-28` and `O-29` to `O-34`. Measured against the archived tree, Webflow carries 15 escaping (file, link) pairs and Obsidian carries 2, which is why the intermediate audit readings are 16 and 2 after the one pre-existing broken link is counted.

Four catalogue entries are not separate edits. `O-30` sits inside the HOW IT WORKS block that `O-23` replaces, and `O-31` to `O-33` sit inside the related list that `O-24` replaces. Applying the two outer blocks removes all four, so no task edits them individually.

### Step 6 - Rewrite every absolute self-path

Rule: replace the exact string `.skilled/skills/sk-code/sk-code-webflow` with `.skilled/skills/local-webflow`, and `.skilled/skills/sk-code/sk-code-obsidian` with `.skilled/skills/local-obsidian`, in every file under both skills except `changelog/` and `benchmark/reports/`. This is one mechanical pass over `.md`, `.mjs`, `.js`, `.css` and `.html` files. The `find`-based loop avoids `grep --exclude-dir`, which BSD grep does not support.

```bash
for skill in local-webflow local-obsidian; do
  old="sk-code-${skill#local-}"
  find ".skilled/skills/$skill/" -type f \
    \( -name '*.md' -o -name '*.mjs' -o -name '*.js' -o -name '*.css' -o -name '*.html' \) \
    -not -path '*/changelog/*' -not -path '*/benchmark/reports/*' \
  | while read -r f; do
      if grep -q "\.skilled/skills/sk-code/$old" "$f"; then
        sed -i '' "s|\.skilled/skills/sk-code/$old|.skilled/skills/$skill|g" "$f"
      fi
    done
done
```

Apply `E-18` before this pass: its `OLD` block quotes the pre-rewrite `.skilled/skills/sk-code/sk-code-webflow/README.md` path, which this `sed` consumes, so the catalogue entry would no longer match afterwards.

`sed -i ''` is the BSD form; on GNU sed the same edit is `sed -i`. No filename under either skill contains a space, so the `while read` loop is safe. Proof: `grep -rn -E 'sk-code/sk-code-webflow|sk-code/sk-code-obsidian' .skilled/skills/local-webflow .skilled/skills/local-obsidian | grep -v '/changelog/'` prints nothing.

### Step 7 - Make each skill standalone in prose

Apply the edit catalogue below. Every site is located by quoting existing text, never by line number, because the restored files are byte-identical to `42b41dd286` and the quotes are unique.

### Step 8 - Write the skill-root `graph-metadata.json`

One file per skill. Shape reference: `.skilled/skills/sk-git/graph-metadata.json`. Field values are fixed in the table below; do not add a `description.json` (no leaf skill carries one and no consumer reads it), and do not place a second `graph-metadata.json` below the skill root.

| Field | `local-webflow` | `local-obsidian` |
|---|---|---|
| `schema_version` | `2` | `2` |
| `skill_id` | `local-webflow` | `local-obsidian` |
| `family` | `sk-code` | `sk-code` |
| `category` | `frontend` | `plugin-evidence` |
| `edges.siblings` | one entry: target `sk-code`, weight `0.5`, context "frontend evidence applied by the generic code implementation workflow" | one entry: target `sk-code`, weight `0.5`, context "plugin design-system evidence applied by the generic code implementation workflow" |
| `edges.depends_on`, `enhances`, `conflicts_with`, `prerequisite_for` | `[]` | `[]` |
| `domains` | `webflow`, `frontend`, `css`, `html`, `javascript`, `cdn-deployment`, `browser-debugging` | `obsidian-plugin`, `note-database`, `plugin-api`, `css-class-grammar`, `screenshot-harness`, `verification-gate` |
| `intent_signals` | the 11 `code-webflow-runtime` keywords plus `webflow implementation`, `webflow frontend workflow` | the 12 `code-obsidian-runtime` keywords plus `obsidian plugin implementation`, `obsidian plugin code` |
| `derived.trigger_phrases` | the 3 `mode-registry.json` aliases at line 73 plus the 15 `code-webflow-aliases` keywords in the array at `hub-router.json` line 74 (key at line 73) | the 5 `mode-registry.json` aliases at line 110 plus the 8 `code-obsidian-aliases` keywords in the array at `hub-router.json` line 90 (key at line 89) |
| `derived.key_topics` | the `domains` list, hyphenated | the `domains` list, hyphenated |
| `derived.intent_signals` | `implement webflow frontend`, `debug browser javascript`, `verify cdn deployment`, `remediate core web vitals`, `animate with motion.dev`, `minify client scripts` | `implement obsidian plugin view`, `debug plugin api boundary`, `verify screenshot harness`, `review db class grammar`, `run plugin source gates`, `add plugin stylesheet class` |
| `derived.key_files` | `.skilled/skills/local-webflow/SKILL.md`, `.skilled/skills/local-webflow/README.md`, `.skilled/skills/local-webflow/references/css/style-guide.md`, `.skilled/skills/local-webflow/references/javascript/quick-reference.md`, `.skilled/skills/local-webflow/references/html/style-guide.md` | `.skilled/skills/local-obsidian/SKILL.md`, `.skilled/skills/local-obsidian/README.md`, `.skilled/skills/local-obsidian/references/obsidian-plugin-api.md`, `.skilled/skills/local-obsidian/references/db-class-naming.md`, `.skilled/skills/local-obsidian/references/verification.md` |
| `derived.source_docs` | `SKILL.md`, `README.md` and the three reference files listed in `key_files`, all skill-relative | `SKILL.md`, `README.md` and the three reference files listed in `key_files`, all skill-relative |
| `derived.entities` | one `{name, kind, path, source: "derived"}` object per `key_files` entry, with `kind` set to `skill` for the `SKILL.md` entry and `reference` for the rest, and `path` copying that repo-root-relative value | same |
| `derived.causal_summary` | "Frontend evidence for Webflow-published pages and CDN-delivered client scripts, applied when a task matches its markers." | "Design-system and source-convention evidence for the Note Database Obsidian plugin, applied when a task works on that plugin tree." |

`key_files` and `entities[].path` are repository-root-relative, because the generator resolves them with `path.join(REPO_ROOT, rel)` and a bare `SKILL.md` or `references/css/style-guide.md` is dead at the repo root. `source_docs` are skill-relative. Every path must exist, because the generator prunes a dead path and errors on an empty required array.

Proof: `node .skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs --root .skilled/skills/local-webflow --write` (and the same for `local-obsidian`) reports `"status": "written"` or `"status": "unchanged"`, never `"status": "error"`, and a second run of each without `--write` reports `"status": "unchanged"`. The `--write` run is what repairs the file; the dry run alone only reports `"status": "would-change"` and changes nothing, so a bare dry run cannot prove the file is correct.

### Step 9 - Prove the advisor sees both skills

Mode A command, for a real-folder restore:

```bash
export SYSTEM_SKILL_ADVISOR_DB_DIR="/tmp/psurf-phase4/advisor-db"
node .skilled/bin/skill-advisor.cjs skill_graph_scan --trusted --format json
sqlite3 "$SYSTEM_SKILL_ADVISOR_DB_DIR/skill-graph.sqlite" "SELECT id FROM skill_nodes WHERE id LIKE 'local-%' ORDER BY id;"
unset SYSTEM_SKILL_ADVISOR_DB_DIR
rm -rf /tmp/psurf-phase4/advisor-db
```

Mode B command, for a symlink restore; the only difference is the trust root the scan needs:

```bash
PRIVATE_ROOT=$(grep -F '| **Private repository root** | /' .worktrees/215-private-surface-level3-plans/specs/sk-code/013-private-surface-skills/004-private-local-skills/decision-record.md | cut -d'|' -f3 | sed 's/^ *//; s/ *$//')
export SPECKIT_PRIVATE_SKILL_ROOTS="$PRIVATE_ROOT"
export SYSTEM_SKILL_ADVISOR_DB_DIR="/tmp/psurf-phase4/advisor-db"
node .skilled/bin/skill-advisor.cjs skill_graph_scan --trusted --format json
sqlite3 "$SYSTEM_SKILL_ADVISOR_DB_DIR/skill-graph.sqlite" "SELECT id FROM skill_nodes WHERE id LIKE 'local-%' ORDER BY id;"
unset SYSTEM_SKILL_ADVISOR_DB_DIR SPECKIT_PRIVATE_SKILL_ROOTS
rm -rf /tmp/psurf-phase4/advisor-db
```

The database lives at the absolute path `/tmp/psurf-phase4/advisor-db` and is deleted in the same step, so it is never written inside a checkout, never shows up in `git status --porcelain`, and nothing is left behind. The override relocates it away from the live database.

Expected: `local-obsidian` and `local-webflow`, one per line. If the CLI exits 75 (retryable daemon error), re-run the scan as `node .skilled/bin/skill-advisor.cjs advisor_rebuild --trusted --force true` and repeat the query. The live database is never touched, because the override relocates it (`skill-graph-db.ts:271`).

### Step 10 - Record the evidence, review, validate, then commit and push last

Every step above ran in the operator's main checkout. This step runs in the authoring worktree, which
holds the only copy of this child's documents.

1. Write the evidence into `implementation-summary.md`: the folder-mode decision, the two restore
   commands, the intermediate and final link-audit readings, the ignore evidence and the advisor-scan
   result. Paths and counts only; no private file content. The readings come from the operator's
   checkout; the file being edited is the worktree copy, because no copy of this child's documents
   exists in the operator's checkout and none needs to.
2. Delete `/tmp/psurf-phase4`, which holds the audit script, the control fixture and the throwaway
   database.
3. Run the independent review round and write `scratch/review-round-1.md` with one row per check.
4. Run `validate.sh --strict` and require `RESULT: PASSED`.
5. Mark every acceptance criterion `Met` and set the closure statement to `Yes`.
6. Re-derive the generated phase metadata with `repair-derived.cjs --apply`, then run
   `validate.sh --strict` again, because the status change touches a gated document.
7. Commit the documents by name, prove the commit holds no `local-*` path, push `HEAD:main`, and
   confirm `git status --porcelain` is empty in both checkouts with `HEAD` equal to `origin/main`.

**Commit and push last.** Nothing is committed or pushed until the tests, the reviewer and strict
validation have all passed. The commit stages its phase documents by name, never `git add -A`, and T107 reads
the commit's file list before the push. A push that lands before validation would publish a phase the
packet still calls open.

### Edit catalogue

Every `OLD` block below is verbatim text from the restored tree at `42b41dd286`, including its arrows and em dashes. Locate the block by that exact text, never by line number. `E-` entries are in `.skilled/skills/local-webflow/`, `O-` entries in `.skilled/skills/local-obsidian/`.

Apply every entry to the file it names, by exact-block replacement. Never run a tree-wide `sed` for `E-25` to `E-28`: `../../../../SKILL.md` contains `../../../SKILL.md`, and `../../../../../sk-doc/...` contains `../../../../sk-doc/...`, so a substring rewrite in the snippets README would corrupt the deeper link. Apply `E-27` and `E-28` to `assets/animation/snippets/README.md` first, then `E-25` and `E-26` to the four other asset READMEs and never to the snippets file.

#### Webflow - `SKILL.md`

`E-01` frontmatter name

OLD:
```
name: sk-code-webflow
```

NEW:
```
name: local-webflow
```

`E-02` frontmatter metadata block

OLD:
```
metadata:
  author: OpenCode
  family: sk-code
  packetKind: surface
```

NEW:
```
metadata:
  author: OpenCode
```

`E-03` section 1 heading

OLD:
```
## 1. WHEN THE HUB BUNDLES THIS
```

NEW:
```
## 1. WHEN THIS SKILL APPLIES
```

`E-04` section 1 opening sentence fragment

OLD:
```
and acts on the evidence gathered here when the hub detects a Webflow surface.
```

NEW:
```
and applies whenever a task matches the detection markers below.
```

`E-05` section 2b intro sentence

OLD:
```
This block is the deterministic projection of sk-code-webflow's own reference/asset routing; keep it in sync with the parent hub union.
```

NEW:
```
This block is the machine-readable form of this skill's own reference and asset routing.
```

`E-06` section 2b python comment, four lines

OLD:
```
# sk-code-webflow owns its intent -> reference/asset routing. Paths are relative to
# this skill root. The parent sk-code hub RESOURCE_MAP is the union of this map
# (re-prefixed with sk-code-webflow/) and the sibling sk-code-skilled map plus the
# parent-owned universal/shared tier; a drift guard enforces that equality.
```

NEW:
```
# local-webflow owns its intent -> reference/asset routing. Paths are relative to
# this skill root. It is the only routing map for this skill: nothing outside
# this folder projects it and no drift guard compares it to another skill.
```

#### Webflow - `README.md`

`E-07` frontmatter description

OLD:
```
description: Frontend evidence for Webflow and browser work in the sk-code hub: language standards, implementation and performance patterns, CDN deployment and browser debugging and verification, bundled with a workflow mode when the hub detects the surface, never a primary.
```

NEW:
```
description: Frontend evidence for Webflow and browser work: language standards, implementation and performance patterns, CDN deployment, and browser debugging and verification.
```

`E-08` H1

OLD:
```
# webflow: Frontend Evidence (sk-code surface)
```

NEW:
```
# local-webflow: Frontend Evidence
```

`E-09` opening blockquote, final sentence

OLD:
```
This read-only surface hands the working mode that evidence the moment the hub detects the surface, so nothing gets reinvented per task.
```

NEW:
```
This read-only skill supplies that evidence directly, so nothing gets reinvented per task.
```

`E-10` AT A GLANCE kind row

OLD:
```
| **Kind** | Surface evidence packet (`packetKind: surface`, read-only, advisor-invisible) |
```

NEW:
```
| **Kind** | Standalone frontend evidence skill (read-only) |
```

`E-11` AT A GLANCE reached-by row

OLD:
```
| **Reached by** | The hub bundling it with a workflow mode (implement, debug, verify) when it detects a Webflow surface. Never routed as a primary |
```

NEW:
```
| **Reached by** | A prompt that matches its trigger phrases; the local advisor returns `local-webflow` |
```

`E-12` AT A GLANCE mutates row

OLD:
```
| **Mutates** | Nothing. The paired workflow mode owns all edits, tests and commits |
```

NEW:
```
| **Mutates** | Nothing: `allowed-tools` is read-only. The workflow applying the standards owns the edits, tests and commits |
```

`E-13` QUICK START step 1

OLD:
```
**Step 1: Let the hub detect the surface.** The hub watches for `src/2_javascript` sources, `webflow` markers, `--vw-` custom properties and CDN-delivered client scripts. When one fires, it bundles this packet with the active workflow mode.
```

NEW:
```
**Step 1: Confirm the task is Webflow frontend work.** The markers are `src/2_javascript` sources, `webflow` markers, `--vw-` custom properties and CDN-delivered client scripts. When one of them appears, this skill's standards apply; when none does, a generic frontend task belongs to `sk-code`.
```

`E-14` HOW IT WORKS, both subsections

OLD:
```
### The Surface Axis

The sk-code hub splits frontend work along two axes. Workflow modes own the implement-to-verify process. Surface packets own the read-only evidence. This packet is `packetKind: surface` with a `toolSurface` of Read, Bash, Grep and Glob only. It mutates nothing. The paired workflow mode owns every edit and test. Each commit runs through that mode.

Because the packet is advisor-invisible, it never gets routed as a primary. A request naming frontend work lands on a workflow mode with this evidence attached. The mode acts on it.

### Detection and Bundling

Detection is deterministic. The hub matches `src/2_javascript` sources, `webflow` markers, `--vw-` custom properties and CDN-delivered client scripts, then picks one surface by detection, so a task gets this packet or its sibling, not both.

The workflow mode pulls the references and assets on demand. The surface stays out of the way until the active phase needs a standard, a pattern, a checklist or a procedure.
```

NEW:
```
### How Routing Works

`local-webflow` is a standalone skill. The local advisor scores a prompt against the trigger phrases and intent signals in its `graph-metadata.json` and returns it directly. No other skill detects it, bundles it or projects its routing map.

### Detection Markers

Detection is local and deterministic: `src/2_javascript` sources, `webflow` markers, `--vw-` custom properties and CDN-delivered client scripts. When they appear, the standards here apply. When they do not, generic frontend work belongs to `sk-code`.

The references and assets are pulled on demand. The skill stays out of the way until the task needs a standard, a pattern, a checklist or a procedure.
```

`E-15` INTEGRATION & NAVIGATION, both subsections

OLD:
```
### When The Hub Bundles This Surface

Use this surface when the task touches Webflow-published pages or CDN-delivered client scripts, when the active workflow phase needs a frontend standard, an implementation pattern, a performance remediation, a deployment step or a browser debugging or verification procedure. Formal findings-first review hands off to `sk-code-review`. Author-side quality gates hand off to `sk-code-quality`.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-code` | Parent hub that detects the surface and bundles it with the active workflow mode |
| `sk-code-skilled` | Sibling surface carrying `.skilled/` system-code evidence, picked by the same detection |
| `sk-code-review` | Owns formal findings-first review after the workflow phases |
| `sk-code-quality` | Owns author-side quality gates |
```

NEW:
```
### When This Skill Applies

Use it when the task touches Webflow-published pages or CDN-delivered client scripts, when the phase needs a frontend standard, an implementation pattern, a performance remediation, a deployment step or a browser debugging or verification procedure. Formal findings-first review hands off to `sk-code-review`. Author-side quality gates hand off to `sk-code-quality`.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-code` | Generic code implementation workflow for work these markers do not match |
| `sk-code/sk-code-skilled` | `.skilled/` system-code evidence, for a task that is not frontend work |
| `sk-code-review` | Owns formal findings-first review after the workflow phases |
| `sk-code-quality` | Owns author-side quality gates |
```

`E-16` FAQ first question and answer

OLD:
```
**Q: Why is this packet read-only and advisor-invisible?**

A: It is evidence, not a worker. A surface that mutated would blur who owns the edit. A surface that routed as a primary could send a task to a packet that cannot act. The workflow mode owns the action. The surface supplies the standards.
```

NEW:
```
**Q: Why is this skill read-only?**

A: It is evidence, not a worker. Evidence that mutated would blur who owns the edit. The workflow that applies the standards owns the action; this skill supplies the standards.
```

`E-17` FAQ second answer

OLD:
```
A: The hub picks the surface by detection, so `.skilled/` system-code work matches `sk-code-skilled` instead. The workflow mode proceeds with the references the bundled surface carries.
```

NEW:
```
A: `local-webflow` stays out of it. A `.skilled/` system-code task belongs to `sk-code/sk-code-skilled`; a generic frontend task belongs to `sk-code`.
```

`E-18` VERIFICATION table, README structure row - apply before Step 6's `sed`, which rewrites the same path

OLD:
```
validate_document.py .skilled/skills/sk-code/sk-code-webflow/README.md --type readme
```

NEW:
```
validate_document.py .skilled/skills/local-webflow/README.md --type readme
```

`E-19` RELATED DOCUMENTS, SKILL.md row

OLD:
```
| [`SKILL.md`](./SKILL.md) | Surface contract, full reference map and the non-negotiable standards |
```

NEW:
```
| [`SKILL.md`](./SKILL.md) | Skill contract, full reference map and the non-negotiable standards |
```

#### Webflow - relative links and prose path mentions

`E-20` `references/shared/enforcement.md`, three occurrences

OLD:
```
../../../sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md
```

NEW:
```
../../../sk-code/sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md
```

`E-21` `references/shared/cross-language-rules.md`, four occurrences

OLD:
```
../../../shared/references/universal/code-style-guide.md
```

NEW:
```
../../../sk-code/shared/references/universal/code-style-guide.md
```

`E-22` `references/javascript/quick-reference.md`, three occurrences

OLD:
```
../../../shared/references/universal/code-style-guide.md
```

NEW:
```
../../../sk-code/shared/references/universal/code-style-guide.md
```

`E-23` `references/performance/interaction-gated-loading.md`, two occurrences

OLD:
```
../../../shared/references/performance-loading-checklist.md
```

NEW:
```
../../../sk-code/shared/references/performance-loading-checklist.md
```

`E-24` `references/shared/dev-workflow/common-commands.md`, one occurrence

OLD:
```
../../../../../mcp-tooling/mcp-chrome-devtools/SKILL.md
```

NEW:
```
../../../../mcp-tooling/mcp-chrome-devtools/SKILL.md
```

`E-25` `assets/patterns/README.md`, `assets/integrations/README.md`, `assets/scripts/README.md`, `assets/templates/README.md`, two occurrences each; never the snippets file

OLD:
```
../../../SKILL.md
```

NEW:
```
../../../sk-code/SKILL.md
```

`E-26` the same four asset READMEs, one occurrence each; the snippets file carries the deeper form and must not be touched

OLD:
```
../../../../sk-doc/sk-create-skill/assets/skill/skill-readme-template.md
```

NEW:
```
../../../sk-doc/sk-create-skill/assets/skill/skill-readme-template.md
```

`E-27` `assets/animation/snippets/README.md`, two occurrences

OLD:
```
../../../../SKILL.md
```

NEW:
```
../../../../sk-code/SKILL.md
```

`E-28` `assets/animation/snippets/README.md`, one occurrence

OLD:
```
../../../../../sk-doc/sk-create-skill/assets/skill/skill-readme-template.md
```

NEW:
```
../../../../sk-doc/sk-create-skill/assets/skill/skill-readme-template.md
```

#### Obsidian - `SKILL.md`

`O-01` frontmatter name

OLD:
```
name: sk-code-obsidian
```

NEW:
```
name: local-obsidian
```

`O-02` frontmatter metadata block

OLD:
```
metadata:
  author: OpenCode
  family: sk-code
  packetKind: surface
```

NEW:
```
metadata:
  author: OpenCode
```

`O-03` opening paragraph fragment

OLD:
```
When the hub bundles this surface, a code workflow gains the plugin's Obsidian API
```

NEW:
```
When a task matches its markers, this skill supplies the plugin's Obsidian API
```

`O-04` section 1 heading

OLD:
```
## 1. WHEN THE HUB BUNDLES THIS
```

NEW:
```
## 1. WHEN THIS SKILL APPLIES
```

`O-05` section 1 first bullet, final sentence

OLD:
```
The hub's surface detection resolves **OBSIDIAN**, at precedence
  `SKILLED > OBSIDIAN > WEBFLOW > UNKNOWN`.
```

NEW:
```
These markers are the whole detection rule; no surface id has to resolve.
```

`O-06` section 1 fourth bullet

OLD:
```
- This surface never owns edits, tests, or verification itself. The bundled workflow mode does the
  work (for example, `sk-code-quality` or `sk-code-review`) and this packet supplies the evidence it
  must honor. A typical resolution is `[sk-code-quality, sk-code-obsidian]` or
  `[sk-code-review, sk-code-obsidian]`.
```

NEW:
```
- This skill never owns edits, tests, or verification itself. The workflow that applies it, whether
  the implementation mode, `sk-code-quality` or `sk-code-review`, does the work and this skill
  supplies the evidence it must honor.
```

`O-07` the paragraph after section 1's bullets

OLD:
```
This packet is **advisor-invisible** (`routingClass: metadata`) and **read-only**. It never routes as a
primary and mutates nothing. It supplies evidence while the acting workflow applies it.
```

NEW:
```
This skill is **read-only**: `allowed-tools` is `Read`, `Bash`, `Grep` and `Glob`. The local advisor
routes it directly on a matching prompt, and it supplies evidence while the acting workflow applies it.
```

`O-08` section 2b intro

OLD:
```
This block is the deterministic projection of `sk-code-obsidian`'s own intent → reference/asset
routing. Keep it in sync with the parent hub union.
```

NEW:
```
This block is the machine-readable form of this skill's own intent → reference/asset routing.
```

`O-09` section 2b python comment, four lines

OLD:
```
# code-obsidian owns its intent -> reference/asset routing. Paths are relative to
# this skill root. The parent sk-code hub RESOURCE_MAP is the union of this map
# (re-prefixed with sk-code-obsidian/) and the sibling surface maps plus the
# parent-owned universal/shared tier. A drift guard enforces that equality.
```

NEW:
```
# local-obsidian owns its intent -> reference/asset routing. Paths are relative to
# this skill root. It is the only routing map for this skill: nothing outside
# this folder projects it and no drift guard compares it to another skill.
```

`O-10` reference map row for the workflow trio

OLD:
```
The shared implement → debug → verify doctrine (symlinked from `../../shared/references/`).
```

NEW:
```
The shared implement → debug → verify doctrine (copied from `../sk-code/shared/references/`).
```

`O-11` RULES, ALWAYS first bullet

OLD:
```
- Follow the parent hub's selected workflow mode and apply this surface's standards as read-only
  evidence.
```

NEW:
```
- Apply this skill's standards as read-only evidence while the active workflow owns the edit.
```

`O-12` RULES, NEVER first bullet

OLD:
```
- Never act as a separate advisor identity or route as a primary.
```

NEW:
```
- Never edit the plugin tree from this skill: `allowed-tools` is read-only.
```

`O-13` RULES, NEVER metadata bullet

OLD:
```
- Never carry a packet-level `graph-metadata.json` or `description.json` — either is a `NESTED_IDENTITY`
  violation at this hub.
```

NEW:
```
- Never add a second `graph-metadata.json` below this skill root: the root carries exactly one, and a
  nested copy would register a second identity.
```

`O-14` INTEGRATION POINTS, input bullet opening

OLD:
```
- **Input:** requests routed to `sk-code` whose surface detects as OBSIDIAN — CWD or changed/target
```

NEW:
```
- **Input:** requests the local advisor routes to `local-obsidian` — CWD or changed/target
```

`O-15` INTEGRATION POINTS, input bullet closing sentence

OLD:
```
  `.devin` back to this hub. The hub bundles this surface behind the chosen workflow mode.
```

NEW:
```
  `.devin` back to this skills folder.
```

`O-16` INTEGRATION POINTS, related bullet

OLD:
```
- **Related:** `../sk-code-webflow` and `../sk-code-skilled` (sibling
  surfaces), `../../shared/` (the shared implement → debug → verify doctrine), `system-spec-kit` (spec
  folders), and `sk-git` (worktrees and commits).
```

NEW:
```
- **Related:** `../local-webflow` and `../sk-code/sk-code-skilled` (sibling evidence
  skills), `../sk-code/shared/` (the shared implement → debug → verify doctrine), `system-spec-kit`
  (spec folders), and `sk-git` (worktrees and commits).
```

#### Obsidian - `README.md`

`O-17` frontmatter trigger phrase

OLD:
```
  - "sk-code-obsidian"
```

NEW:
```
  - "local-obsidian"
```

`O-18` H1

OLD:
```
# sk-code-obsidian: Note Database Plugin Evidence (sk-code surface)
```

NEW:
```
# local-obsidian: Note Database Plugin Evidence
```

`O-19` AT A GLANCE packet-kind row

OLD:
```
| **Packet kind** | `surface` (read-only domain evidence) |
```

NEW:
```
| **Skill kind** | Standalone evidence skill (read-only domain evidence) |
```

`O-20` AT A GLANCE advisor row

OLD:
```
| **Advisor** | invisible (`routingClass: metadata`); reached only by hub bundling |
```

NEW:
```
| **Advisor** | routed directly; the local advisor returns `local-obsidian` on a matching prompt |
```

`O-21` AT A GLANCE bundled-with row

OLD:
```
| **Bundled with** | a workflow mode, e.g. `[sk-code-quality, sk-code-obsidian]` |
```

NEW:
```
| **Applies with** | a code workflow, e.g. `sk-code-quality` or `sk-code-review` |
```

`O-22` OVERVIEW, the plugin-repository subsection closing sentence

OLD:
```
it is the source of truth. This surface is that repo's read-only convention mirror inside `sk-code`.
```

NEW:
```
it is the source of truth. This skill is that repo's read-only convention mirror.
```

`O-23` HOW IT WORKS, both subsections

OLD:
```
### The Surface Axis

`sk-code` declares a `surface-axis` extension: `packetKind: "surface"` entries are read-only evidence
bases bundled alongside a workflow mode, never advisor identities of their own. This packet is the
third surface, beside `sk-code-webflow` and `sk-code-skilled`.

### Detection and Bundling

Surface detection (in `../shared/references/stack-detection.md`) resolves OBSIDIAN from the CWD and
changed/target files, at precedence **SKILLED > OBSIDIAN > WEBFLOW > UNKNOWN**, SKILLED
still wins a genuinely resolved `.opencode/` target; OBSIDIAN catches the plugin repository's own
paths, which would otherwise fall to UNKNOWN as generic Node.js. The hub then bundles this surface
behind the chosen workflow mode via `routerPolicy.outcomes.surfaceBundle` (workflow ordered first,
surface after).
```

NEW:
```
### How Routing Works

`local-obsidian` is a standalone skill. The local advisor scores a prompt against the trigger phrases
and intent signals in its `graph-metadata.json` and returns it directly. No other skill detects it,
bundles it or projects its routing map.

### Detection Markers

Detection is local and deterministic: `manifest.json` carrying `minAppVersion`, `esbuild.config.mjs`,
`from "obsidian"` imports, and `.db-*` classes in `styles.css`, resolved against the CWD and the
changed or target files. A resolved-realpath check catches the plugin repository's own paths, which
would otherwise read as generic Node.js.
```

`O-24` INTEGRATION & NAVIGATION, both subsections

OLD:
```
### When The Hub Bundles This Surface

`node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "<obsidian plugin task>"` resolves the
workflow mode and appends `sk-code-obsidian` as read-only evidence, e.g. a quality gate on the plugin
returns `[sk-code-quality, sk-code-obsidian]`.

### Related Skills

- `../sk-code-webflow`, `../sk-code-skilled`: sibling read-only surfaces on
  the same axis.
- `../sk-code-quality`, `../sk-code-review`: workflow modes that bundle this surface.
- `../shared/`: the implement → debug → verify doctrine this surface folds in via symlink.
- `system-spec-kit` (spec folders + memory), `sk-git` (worktrees, commits, finish).
```

NEW:
```
### When This Skill Applies

Use it when the task works on the **Note Database** plugin's source tree, its `styles.css` class
grammar, its screenshot harness or its verification gate, and the phase needs the plugin's
design-system evidence. The workflow that applies it owns the edit; this skill supplies the evidence.

### Related Skills

- `../local-webflow`, `../sk-code/sk-code-skilled`: sibling read-only evidence skills.
- `../sk-code/sk-code-quality`, `../sk-code/sk-code-review`: workflows that apply this evidence.
- `../sk-code/shared/`: the implement → debug → verify doctrine this skill carries a copy of.
- `system-spec-kit` (spec folders + memory), `sk-git` (worktrees, commits, finish).
```

`O-25` FAQ, advisor-routable question and answer

OLD:
```
**Is it advisor-routable?** No. It is `routingClass: metadata` and advisor-invisible; the advisor routes
the single `sk-code` identity and the hub bundles this surface.
```

NEW:
```
**Is it advisor-routable?** Yes. The local advisor returns `local-obsidian` when a prompt matches its
trigger phrases or intent signals.
```

`O-26` VERIFICATION, the three routing and contract bullets

OLD:
```
- Packet conforms to the surface contract: `packetKind: surface`, `backendKind: evidence-base`, read-only
  `toolSurface`, `routingClass: metadata`, `folder == packetSkillName`, no packet-level advisor metadata.
- Fleet gate: `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` exits 0.
- Routing: `compiled-route.cjs --hub sk-code --prompt "code work on the Note Database plugin"` bundles
  this surface instead of returning `defer`.
```

NEW:
```
- Skill shape: one skill-root `graph-metadata.json` with `skill_id: local-obsidian`, read-only
  `allowed-tools`, and no nested identity file below the root.
- Link audit: every relative link under this skill resolves.
- Routing: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"obsidian plugin code"}' --format json` returns `local-obsidian` first.
```

`O-27` RELATED DOCUMENTS, hub routing bullet

OLD:
```
- `../ROUTER.md`, `../mode-registry.json`, `../hub-router.json`: the parent hub's routing.
```

NEW:
```
- `../sk-code/`: the public hub, which no longer carries this skill's routing.
```

`O-28` RELATED DOCUMENTS, SKILL.md bullet

OLD:
```
- `SKILL.md`: the surface contract, reference map, machine-readable routing, and standards.
```

NEW:
```
- `SKILL.md`: the skill contract, reference map, machine-readable routing, and standards.
```

#### Obsidian - relative links and prose path mentions

`O-29` `SKILL.md`, the code-style-guide link

OLD:
```
../shared/references/universal/code-style-guide.md
```

NEW:
```
../sk-code/shared/references/universal/code-style-guide.md
```

`O-30` `README.md`, detection prose mention

OLD:
```
Surface detection (in `../shared/references/stack-detection.md`)
```

NEW:
```
Surface detection (in `../sk-code/shared/references/stack-detection.md`)
```

`O-31` `README.md`, related bullet for sibling skills

OLD:
```
- `../sk-code-webflow`, `../sk-code-skilled`: sibling read-only surfaces on
  the same axis.
```

NEW:
```
- `../local-webflow`, `../sk-code/sk-code-skilled`: sibling read-only evidence skills.
```

`O-32` `README.md`, related bullet for workflows

OLD:
```
- `../sk-code-quality`, `../sk-code-review`: workflow modes that bundle this surface.
```

NEW:
```
- `../sk-code/sk-code-quality`, `../sk-code/sk-code-review`: workflows that apply this evidence.
```

`O-33` `README.md`, related bullet for the shared tier

OLD:
```
- `../shared/`: the implement → debug → verify doctrine this surface folds in via symlink.
```

NEW:
```
- `../sk-code/shared/`: the implement → debug → verify doctrine this skill carries a copy of.
```

`O-34` `manual-testing-playbook/surface-detection/negative-control-non-obsidian.md`

OLD:
```
../../../shared/references/stack-detection.md
```

NEW:
```
../../../sk-code/shared/references/stack-detection.md
```

`O-31`, `O-32` and `O-33` sit inside the block `O-24` replaces. Apply `O-24` and skip them, or apply the three before it; both orders produce the same bytes.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Link resolution in both skills | `/tmp/psurf-phase4/link-audit.sh` from Step 4 |
| Unit | `graph-metadata.json` shape and `derived` completeness | `node .skilled/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs --root <skill>` |
| Integration | The advisor indexes both skills | `SYSTEM_SKILL_ADVISOR_DB_DIR=$(mktemp -d) node .skilled/bin/skill-advisor.cjs skill_graph_scan --trusted` plus `sqlite3` |
| Integration | README structure still passes after the prose rewrite | `python3 .skilled/skills/sk-doc/scripts/validate_document.py <README> --type readme` |
| Manual | Nothing leaked into git | `git status --porcelain .skilled`, `git diff --cached --name-only`, `git status --porcelain --ignored .skilled/skills/local-webflow .skilled/skills/local-obsidian`, `git check-ignore -v` |
| Manual | Spec packet gates | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills/004-private-local-skills --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Commit `42b41dd286` in the local object database | Internal | Green | Nothing can be restored; every step after Step 1 stops |
| Phase 1 ignore rules and commit guard | Internal | Yellow - landed before this phase runs | The restore writes 226 tracked files; stop at Step 0 |
| Phase 3 symlink-aware advisor scan | Internal | Yellow - landed before this phase runs | The symlink mode is invisible to the advisor; use the real-folder mode |
| `sqlite3` on `PATH` | External | Green | The Step 9 proof cannot run; record it as an open blocker rather than claiming success |
| The operator's folder-mode decision | Human | Yellow | The phase does not block; both command paths are written out, and Step 1 records the choice |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any proof command in Steps 1 to 10 fails after three repair attempts on the same symptom; any tracked file changes; any `local-*` path becomes staged.
- **Procedure**:
  1. `rm -rf .skilled/skills/local-webflow .skilled/skills/local-obsidian` - in the symlink mode this removes the links only and leaves the private repository untouched.
  2. If anything was staged, `git restore --staged .` and then `git status --porcelain .skilled` must be empty.
  3. If a tracked file changed, `git checkout -- <path>` for that exact path, then re-run `git status --porcelain .skilled`.
  4. If the phase's docs commit is already made and must be undone, `git revert <phase-commit>` - it contains this child's documents only.
  5. Delete `/tmp/psurf-phase4`, which holds `link-audit.sh` and any throwaway database directory created by Step 9.
- **Why no `git revert` is the primary path**: the phase writes only gitignored paths, so there is no tracked code diff to revert. Deleting the two ignored folders restores the exact pre-phase state.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
001 (ignore + guard) ──► 002 (hub removal) ──► 003 (advisor cleanup) ──► 004 (this phase) ──► 005 (verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 001-ignore-and-commit-guard | None | 002, 004 |
| 002-hub-surface-removal | 001 | 003, 005 |
| 003-advisor-vocabulary-cleanup | 002 | 004, 005 |
| 004-private-local-skills | 001, 003 | 005 |
| 005-leak-and-routing-verification | 002, 003, 004 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (gates, restore, symlink replacement) | Low | 45-90 minutes |
| Core Implementation (links, paths, prose, metadata) | High | 6-10 hours |
| Verification (audits, advisor scan, evidence, review, validation) | Medium | 3-5 hours |
| **Total** | | **10-16 hours across 109 tasks** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] `git status --porcelain .skilled` empty before the first restore command
- [ ] `git check-ignore -v` names the phase 1 rule for both paths
- [ ] The private repository path is recorded before a symlink is created
- [ ] The throwaway advisor database lives at `/tmp/psurf-phase4/advisor-db` and is deleted in Step 9

### Rollback Procedure
1. Remove the two ignored paths with `rm -rf` (a symlink is removed, not followed).
2. Unstage anything that slipped in with `git restore --staged .`.
3. Restore any accidentally modified tracked file with `git checkout -- <path>`.
4. Re-run `git status --porcelain .skilled`, `git diff --cached --name-only` and `git status --porcelain --ignored .skilled/skills/local-webflow .skilled/skills/local-obsidian` to confirm the pre-phase state.
5. Delete `/tmp/psurf-phase4`.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A - no tracked data changes; the restore source is an immutable commit, so re-running Step 1 reproduces the same bytes.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
phase 001 ignore rules ──┐
phase 003 compiler skip ─┼──► T001 gate ──► T002 mode gate ──► restore pair ──► link and prose edits ──► metadata ──► audits and scan ──► evidence ──► review ──► validate ──► commit ──► push
commit 42b41dd286 ───────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Phase 003 compiler skip on `main` | Phase 003 landing | A compiler that skips `local-*` | T001, and every task after it |
| Phase 1 ignore rules | Phase 1 landing | `git check-ignore` coverage for both paths | T003, T005, AC-013 |
| Commit `42b41dd286` | The object database | The 161 and 65 archived entries | T003 to T006 |
| Restored trees | T001 to T006 | `.skilled/skills/local-webflow/`, `.skilled/skills/local-obsidian/` | Every edit task |
| Workflow copies | T007 to T012 | Six regular files | T013 to T016, AC-004 |
| Link audit script | T017 | `/tmp/psurf-phase4/link-audit.sh` | T018, T019, T088, T089 |
| Link and prose edits | The restored trees | Two standalone, navigable skills | T086 to T095 |
| Skill metadata | T035 to T085 | Two `graph-metadata.json` files | T094, T095 |
| Advisor scan | T086, T087, T094 or T095 | Two `skill_nodes` rows | AC-014 |
| Evidence and review | T088 to T101 | `implementation-summary.md`, `scratch/review-round-1.md` | T102 |
| Validation | T102 and T105 | `RESULT: PASSED` | T106 |
| Commit and push | T106 to T108 | One commit on `main` | T109, AC-019 |
<!-- /ANCHOR:dependency-graph -->

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **T001 and T002** - the two gates - CRITICAL: no file may be written before both pass.
2. **T003 or T005, then T007 to T016** - restore and make the workflow references real - CRITICAL: every later edit reads these files.
3. **T020 to T085** - the link, path and prose edits - CRITICAL: the audits and the metadata both read their output.
4. **T086 and T087** - the two metadata files - CRITICAL: the advisor scan cannot return a skill with no identity.
5. **T088 to T095** - audits, validators, packet-id checks and the advisor scan - CRITICAL: the evidence and the criteria both quote them.
6. **T096 to T105** - evidence, review and validation - CRITICAL: the commit is blocked on all three.
7. **T106 to T109** - commit, prove, push, confirm - CRITICAL: the phase is not closed until `HEAD` equals `origin/main`.

**Total Critical Path**: 109 tasks in sequence; the restore pair and the two metadata files are the only points where a wrong choice costs a re-run rather than a single edit.

**Parallel Opportunities**:
- T020 to T034 (Webflow links) and T055 to T056 (Obsidian links) touch disjoint files, but a single implementer runs them in order anyway.
- T035 to T053 (Webflow prose) and T057 to T084 (Obsidian prose) are disjoint for the same reason.
- No task is marked `[P]`, because one implementer executes them serially and the audit readings depend on the order.
<!-- /ANCHOR:critical-path -->

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Gates passed | T001 prints `commit`, `1`, `1`; T002 prints three metadata lines with an accepted mode | Phase 1 |
| M2 | Trees restored and standalone | T012 prints `REGULAR` and `IDENTICAL`; T016 prints `2` and `0`; both skill roots hold 161 and 65 files | Phases 2 to 4 |
| M3 | Links and prose rewritten | T088 prints one `BROKEN` line and `AUDIT_FAIL=1`; T089 prints `0` and `AUDIT_FAIL=0`; both README validators print `VALID` | Phases 6 to 9 |
| M4 | Metadata and routing proven | T086 and T087 print `OK`, `1`, `1`, `1`; T094 or T095 prints both `local-*` ids | Phases 10 and 11 |
| M5 | Evidence, review and validation | T101 prints `7` and `7`; T105 prints `1` | Phases 12 and 13 |
| M6 | Release ready | T106 prints `0` for non-phase paths, at least `9` for phase paths and `0` for the status; T108 prints `0`; T109 prints `HEAD_EQUALS_ORIGIN_MAIN` | Phase 13 |
<!-- /ANCHOR:milestones -->

## L3: ARCHITECTURE DECISION RECORD

Seven decisions govern this phase, each recorded in full in `decision-record.md`.

### ADR-001: Restore each private skill as a real folder or as a symlink to a private repository

**Status**: Pending operator decision

**Context**: Both shapes are legal at `.skilled/skills/local-*`, and they differ in where the bytes live, not in what the advisor reads.

**Decision**: The operator records one of `Accepted: real folder` or `Accepted: symlink to a private repository` in the ADR's metadata table; T002 stops while the cell is pending.

**Consequences**:
- One recorded answer, one restore pair, no rework.
- Mode B adds `SPECKIT_PRIVATE_SKILL_ROOTS` to every advisor process.

**Alternatives Rejected**:
- A real folder inside the private repository with no link: the advisor never sees the skill.
- Copy the trees into both checkouts: the copies drift.

### ADR-002: This phase starts only after phase 003's compiler skip is on `main`

**Status**: Accepted

**Context**: `discover_graph_metadata` follows a symlink, so a `local-*` skill created early is exported into the tracked `skill-graph.json`.

**Decision**: T001 greps the exact skip text at `origin/main` and in the working copy, and stops the run on any count other than `1`.

**Consequences**:
- No private signal can reach the tracked graph.
- Phase 003 must land first.

**Alternatives Rejected**:
- Gate on a commit SHA: unknown before phase 003 lands, and a squash merge changes it.
- Trust the phase order: nothing notices an early run until phase 5.

### ADR-003: The private trees live only in the operator's main checkout

**Status**: Accepted

**Context**: Ignored files never travel between checkouts.

**Decision**: Content commands run in the operator's checkout; document edits and the commit run in the worktree.

**Consequences**:
- The advisor indexes both skills immediately.
- Every task must name its checkout.

**Alternatives Rejected**:
- Restore in the worktree: the advisor never sees the skills.

### ADR-004: Restore with a pinned `git archive` pipeline

**Status**: Accepted

**Decision**: `git archive 42b41dd286 <surface path>` piped through `tar --strip-components=4`.

**Consequences**:
- Byte-identical, index-free and idempotent.
- The commit must exist locally.

**Alternatives Rejected**:
- `git checkout 42b41dd286 -- <paths>`: stages 226 tracked files.

### ADR-005: Replace the six workflow symlinks with real copies

**Status**: Accepted

**Decision**: `rm` each link, then write the replacement from `git show 42b41dd286:...`.

**Consequences**:
- No tracked hub file is opened for writing.
- Six copies of three documents.

**Alternatives Rejected**:
- `cp` onto the link: writes through it into the tracked hub file.

### ADR-006: One skill-root `graph-metadata.json` and no `description.json`

**Status**: Accepted

**Decision**: One file per skill root, generated and then confirmed `unchanged`.

**Consequences**:
- One identity per skill.
- The `derived` block must be generated, not hand-tuned.

**Alternatives Rejected**:
- A `description.json`: no leaf skill carries one and no consumer reads it.

### ADR-007: The evidence is paths and counts only, and the commit is by name

**Status**: Accepted

**Decision**: Record readings only, stage seven paths by name, and prove the commit holds no `local-*` path.

**Consequences**:
- The commit's file list is itself a proof.
- The summary is less detailed than a content dump.

**Alternatives Rejected**:
- `git add -A`: stages any unrelated edit and cannot prove the index is clean.

---
