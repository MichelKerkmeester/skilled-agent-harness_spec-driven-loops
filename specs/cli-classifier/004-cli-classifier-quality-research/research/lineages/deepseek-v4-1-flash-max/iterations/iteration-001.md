# Iteration 001 — Surface map, caller inventory, and the first documentation-accuracy pass

- **Focus:** Enumerate the hub and packet surface; locate every live caller of `shared/scripts/jev-transport.mjs` and `shared/scripts/scorer-report.mjs`; check the hub's core docs against the code they describe (axes 5 and 7 foundation; Q1/Q5 start).
- **Read first:** no `steer.md` exists in this lineage yet (checked at iteration start, absent).
- **Lens:** every claim gets a `file:line`; every "confirmed" names the check that produced it.

## Method

1. Enumerated `.skilled/skills/cli-classifier/` with `find` (116 files) and line-counted the hub root docs and shared scripts.
2. Caller inventory: `grep -rn "jev-transport|scorer-report"` across `.skilled/skills/` (52 hits), then per-file verification of the six importers.
3. Read the hub root docs (`README.md`, `SKILL.md`, `ROUTER.md`, `mode-registry.json`, `hub-router.json`, `leaf-manifest.json`, `description.json`, `graph-metadata.json`) and `shared/scripts/jev-transport.mjs` end to end; read `shared/scripts/README.md`, `cli-jev/SKILL.md` transport section, and the latest hub changelog.
4. Ran the hub README's three verification commands with a `git status --porcelain` before/after containment check (no repo writes observed).

## Findings

### F-001 — Hub `SKILL.md` misdescribes the transport default (axis 5, P2)

`SKILL.md:114` says `shared/scripts/jev-transport.mjs` "carries the **opt-in** Pi route for `choice` questions, with the `jev` CLI as the **default and the fallback**".

The code says the opposite. `resolveTransport` returns `{transport:'auto'}` when nothing is named (`shared/scripts/jev-transport.mjs:64-73`), and `spawnClassifierCall` then runs the Pi preflight first; only a failed preflight falls to the CLI, silently for the auto route (`shared/scripts/jev-transport.mjs:534-553`). The module header states it directly: "Answers a jev `choice` or `noul` question through Pi's native classifier runtime when its preflight passes, and through the jev CLI otherwise" (`shared/scripts/jev-transport.mjs:4-7`). `shared/scripts/README.md:16` and `:28` agree ("With no transport named it tries Pi first and the CLI answers wherever Pi cannot"; "Tries Pi by default"), as does the packet's own transport-selection table (`cli-jev/SKILL.md:241-260`). The claim is wrong twice: Pi is not opt-in, and the CLI is not the default. It also understates the Pi route to `choice` only, while the code and the packet SKILL both support `noul` on Pi (`shared/scripts/jev-transport.mjs:137-163`, `:176-194`, `:577-579`).

- **Confirmed by:** reading the code path end to end (`resolveTransport` → `spawnClassifierCall` auto branch) and comparing against all three sibling descriptions. The hub SKILL.md is the only surface that disagrees.
- **Impact:** an agent that reads only the hub `SKILL.md` will believe a bare call stays on the `jev` CLI and that Pi requires opt-in; it may avoid or mistrust the default route. Fix: mirror the packet table's wording.

### F-002 — One caller drops the answering route; the catalog's five-scorer claim is ambiguous against code (axis 5, P2)

`feature-catalog.md:63` lists six callers and then says: "The five scorers record the answering route as `transport` in their call records."

Code check across the six:

| Caller | Calls transport | Records `transport` |
|---|---|---|
| `sk-doc/sk-create-skill/scripts/score-clarify-default.cjs` | `:1267` | **No** — records a hardcoded `backend: 'jev'` (`:1271`, `:1315`, `:1368`) |
| `sk-doc/shared/scripts/cite-drift-scan.mjs` | `:1155`, `:1553` | `:1239` (`transport: call.transport`) |
| `cli-classifier/benchmark/injection-screen/score-injection-screen.mjs` | `:1314`, `:1329` | `:1301` (`transport: r.transport`) |
| `system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs` | `:901`, `:917` | `:886` |
| `system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs` | `:859` | `:838` |
| `system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs` | `:1713`, `:1728` | `:1695` |

Five of six record it; `score-clarify-default.cjs` does not. If "the five scorers" means the five files named `score-*`, the sentence is false (clarify-default is one of them and lacks the field). If it means "five of the six callers", the sentence is true but silently excludes the one caller whose name says "score" while including `cite-drift-scan`. Either reading, the code fact stands: a `score-clarify-default` run answered by Pi records `backend: 'jev'`, losing the route that actually answered — exactly the provenance the other five preserve.

- **Confirmed by:** `grep` for `spawnClassifierCall(`/`transport:` across the six files, then reading each record-shaping block. The file's own comment (`score-clarify-default.cjs:1356-1358`) shows the author knew the route can differ from the CLI while the record still hardcodes `backend: 'jev'`.
- **Impact:** measurement provenance for one arm; catalog wording that a reader cannot reconcile with the code without this table. Fix: record `transport: result.transport` in `score-clarify-default.cjs` and tighten the catalog sentence.

## Checked and cleared (recorded so later iterations do not re-litigate)

- **Caller list accuracy (axis 5):** the six callers named in `feature-catalog.md:63` are exactly the six live importers; no seventh caller exists under `.skilled/skills/` (the two `system-spec-kit` test files reference `scorer-report.mjs` by path but are tests, not callers).
- **Hub README verification block (axis 5):** all three commands exist and pass — `parent-skill-check.cjs` reports every hard invariant PASS with 0 warnings; `compiled-route.cjs --hub cli-classifier` returns `selectionKind: single` with target `cli-jev`; `validate_document.py --type readme` reports 0 issues. Run with a git-status containment check; no repo writes.
- **README frontmatter version lag (not a finding):** hub `README.md:8` carries `0.4.0.0` while routing artifacts carry `0.7.0.0`, but a six-skill sample shows the same lag repo-wide (`system-skill-advisor` 0.14.2.0/0.12.0.54, `sk-doc` 2.2.6.0/2.2.0.77, `sk-prompt` 3.0.2.0/3.0.0.0, `system-deep-loop` 1.5.3.0/1.4.3.0, `cli-external-orchestration` 1.7.1.0/1.6.0.0). README `version` reads as the document's own revision, not the skill release. `parent-skill-check` rule 13a already validates routing artifacts separately and passes.
- **`cli-deem` remnants (not a finding):** the retired mode appears only in historical changelog entries (`changelog/v0.3.0.0.md` … `v0.7.0.0.md`, `cli-jev/changelog/v0.1.5.0.md`), which is the correct place for history; no current doc references it.

## Ruled-out directions

- Treating README/SKILL version lag as drift — repo-wide convention, cleared above.
- Treating the changelog's `cli-deem` mentions as stale references — historical records.

## Key-question progress

- Q1 (axes 1+5): first accuracy pass done; full sk-doc compliance sweep is iteration 2.
- Q5 (axis 7): initial drift checks done; metadata/mirror/code cross-checks continue in iterations 4–5.
- Q2, Q3, Q4: not yet addressed (iterations 2–4).

## Next focus

Iteration 2 — sk-doc compliance of every hub and packet doc: frontmatter completeness, naming, structure, changelog form, playbook/catalog conventions, and the validation tooling's own view of each document.
