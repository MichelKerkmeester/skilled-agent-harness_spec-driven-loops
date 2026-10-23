# Iteration 013 — `/doctor:ci` command surface

**Focus:** Specify `/doctor:ci` by reading the existing doctor command family (`_routes.yaml`, `setup`, `env`, `sk-code`), the route validator, and the `gate-inputs` workflow that constrains what a scaffolded workflow may contain. Read-only: no workflow, script or code was modified.

**Mode:** research · **Iteration:** 13 of 20 · **Question closed:** *What should a /doctor:ci command do, how is it made safe, and who owns it?*

---

## 1. FOCUS

The `/doctor:ci` command does not exist yet, and the doctor surface is not a folder of loose markdown: it is a five-surface registration contract with three machine validators. This iteration establishes (a) exactly which surfaces a new route must touch, (b) the validator rules that dictate its mode split, (c) the read-only and confirmed-write patterns it must copy, (d) the `gate-inputs` constraint every scaffolded workflow must satisfy, and (e) where the command belongs relative to `sk-git` and the proposed `sk-code-ci` mode.

## 2. ACTIONS TAKEN

1. Listed `.skilled/commands/doctor/` and read `_routes.yaml` in full — the canonical route manifest, its per-route schema, and its documented add-a-target procedure [SOURCE: .skilled/commands/doctor/_routes.yaml:23-43].
2. Read the two read-only reference commands `setup.md` / `doctor-setup.yaml` and the confirmed-write reference `env.md`, then `sk-code.md` and the standalone `env` route entry [SOURCE: .skilled/commands/doctor/env.md:52-58] [SOURCE: .skilled/commands/doctor/_routes.yaml:387-399].
3. Read `route-validate.py`'s rule set to learn which properties are machine-enforced rather than stylistic [SOURCE: .skilled/commands/doctor/scripts/route-validate.py:18-28].
4. Read `.github/workflows/gate-inputs.yml` and the parity rules inside `.github/scripts/check-gate-inputs.sh` — the constraint on any workflow a `/doctor:ci scaffold` would emit [SOURCE: .github/workflows/gate-inputs.yml:41-57].
5. Read the workflow README's push/pull-request coverage table and guard-entrypoint section, plus `.skilled/commands/README.txt`'s doctor index table, to enumerate the documentation rows a new command and a new workflow each owe.

## 3. FINDINGS

### F1 — Registration is five surfaces plus three reruns, not a file drop — **confirmed**

The manifest documents the procedure inline. Adding a target requires: append the route to `_routes.yaml` with `trigger_phrases` of three or more words; list the target in that command's router and presentation and add its row to `.skilled/commands/doctor/assets/doctor-setup-presentation.txt`; add its activation entry to **both** the `typescript` and `python` lists in `scoring-compatibility.json` — "A bridge without one stays inactive"; then rerun `derive-command-bridges.cjs`, `route-validate.sh` and `doctor-phrase-reach.cjs` [SOURCE: .skilled/commands/doctor/_routes.yaml:38-43]. The presentation target list currently carries 17 rows across every doctor target [SOURCE: .skilled/commands/doctor/assets/doctor-setup-presentation.txt:19-35]. Command-level documentation is a sixth surface: `.skilled/commands/README.txt` holds a per-group count ("doctor … 10"), a doctor command table, and the intro sentence "Ten command files cover the diagnostic surface" — adding `ci.md` makes all three stale [SOURCE: .skilled/commands/README.txt:46] [SOURCE: .skilled/commands/README.txt:160].

**Consequence:** a `/doctor:ci` implementation is a 6-file-plus-3-command change, and any phase plan that treats it as "add one command" under-states the diff by roughly 5x.

### F2 — `K1` forbids one route that both lists and toggles — the mode surface is forced to split — **confirmed**

The validator enforces a mutation-class enum `{read-only, add-only, mutates}` (E1) [SOURCE: .skilled/commands/doctor/scripts/route-validate.py:431-437], and rule K1 fails any route classified `mutating: read-only` whose YAML "declares a write", with the instruction to "reclassify as add-only/mutates or remove the write"; K2 additionally fails a read-only route that grants a known-mutating advisor command [SOURCE: .skilled/commands/doctor/scripts/route-validate.py:624-641]. Because the rule keys on the route's YAML declaring *any* write, a single `ci` route cannot serve both inspection and toggling: the YAML's `mutation_boundaries` would have to admit a write, and the whole route would be reclassified.

**Consequence — the mode surface must be at least three routes, one mutation class each:**

| Target | Class | Delivery | Behaviour |
|---|---|---|---|
| `list` | `read-only` | doctor (pattern of `doctor-setup.yaml`) | Every workflow file in `.github/workflows/` as one row: on/off state read from `vars`, trigger events and any path filter, one-line purpose from the README, Node version(s), action pinning state. Writes nothing. |
| `check` | `read-only` | doctor | The drift battery: README row missing, `uses:` not SHA-pinned, no `timeout-minutes`, no `permissions:` block, path filter naming only one source root, no `concurrency` group. PASS / DEGRADED / FAIL / ERROR, naming the repair mode. |
| `toggle` | `mutates` | doctor | Resolves a workflow or group to its `vars` key, prints the exact `gh variable set`/`unset` command, executes only on explicit yes, then re-reads state to confirm. |
| `customize` | `mutates` | doctor | Path filters, schedules and Node versions. `--dry-run` default; shows the unified diff; one explicit yes per file. Refuses protected workflows without a second confirmation. |
| `scaffold` | `add-only` | doctor route, `sk-code-ci` templates | Emits a new `.github/workflows/<name>.yml` plus its README row. add-only because it creates a file and touches one existing README. |

This is the same shape the family already uses: `/doctor:git` carries `hooks` and `standards` as `mutates` and `setup` as `read-only` as three separate routes [SOURCE: .skilled/commands/doctor/_routes.yaml:242-295].

### F3 — `J1` makes the router table and presentation list load-bearing, not cosmetic — **confirmed**

`J1` asserts "target-set parity" between the manifest, the owning router's target table and the presentation file, and fails with a per-command mismatch list when any one of the three disagrees [SOURCE: .skilled/commands/doctor/scripts/route-validate.py:591-620]. `G1` requires at least one trigger phrase per route, and `G2` requires the presentation's example phrases to appear in `trigger_phrases` [SOURCE: .skilled/commands/doctor/scripts/route-validate.py:501-507].

**Consequence:** the five `/doctor:ci` targets must appear in `ci.md`'s §4 execution-target table and in `doctor-setup-presentation.txt:19-35` in the same commit as the manifest rows, or the doctor CI gate (`route-validate.sh`) fails the build.

### F4 — The scaffold template is constrained by `gate-inputs.yml`, and a literal `.opencode/` run path fails it — **confirmed**

`gate-inputs.yml` runs the checker's own test suite, then `bash .github/scripts/check-gate-inputs.sh` over the real tree [SOURCE: .github/workflows/gate-inputs.yml:16-20]. The checker requires every literal `.opencode/<path>` a workflow runs to resolve and every path filter to name both roots [SOURCE: .github/scripts/check-gate-inputs.sh:13-18]; it rewrites a `.opencode` token to `.skilled` and back to test resolution [SOURCE: .github/scripts/check-gate-inputs.sh:114-115], and it flags any escaped single-root literal such as `\.opencode/` that does not also carry `\.skilled/` [SOURCE: .github/scripts/check-gate-inputs.sh:135-154]. Workflows already cope by selecting the root by sentinel rather than by name: `root=.skilled; [ -f "$root/skills/system-spec-kit/SKILL.md" ] || root=.opencode` [SOURCE: .github/workflows/gate-inputs.yml:43-44].

**Consequence — the scaffold template's non-negotiables:** every `paths:` entry lists both `.skilled/**` and `.opencode/**`; any script invocation resolves through a sentinel `root`, never a hard-coded literal; every `uses:` is SHA-pinned with the version in a trailing comment (the existing house style, e.g. `actions/checkout@3d3c42e5… # v7.0.1` [SOURCE: .github/workflows/gate-inputs.yml:16]); `permissions: contents: read`; `timeout-minutes`; a `concurrency` group; and a README row. A scaffold that emitted a literal `.opencode/...` run step would turn the repository's own `gate-inputs` workflow red on the first push.

### F5 — There is no automated workflow↔README parity check, so the README row is honour-system — **inferred**

`.github/scripts/` contains exactly one checker, `check-gate-inputs.sh`, and its tests directory; it validates inputs and filters, not README coverage. The README instead states the rule twice as a convention: each workflow gets a contents row plus a push/pull-request coverage row with its reason [SOURCE: .github/workflows/README.md:70-75], and "A workflow whose guard script is missing fails that step instead of skipping it" [SOURCE: .github/workflows/README.md:84]. **What would confirm this:** a repository-wide grep for a script that parses `.github/workflows/*.yml` and compares it with `README.md`'s table; the directory-level absence is evidence, not proof, and a checker could live under `.skilled/commands/doctor/scripts/` (for example `command-catalog-mirror-check.cjs` covers commands, not workflows).

**Consequence:** `/doctor:ci check` is the mechanism that would make the README row enforced — the missing row becomes a DEGRADED finding rather than silent drift. That is the strongest single argument for building `check` before `scaffold`.

### F6 — `env.md`/`doctor-env.yaml` is the confirmed-write precedent, and it prescribes print-then-verify for `toggle` — **confirmed**

The env router is explicit about the division of labour: this router "owns argument parsing and asset loading only… The workflow owns inventory parsing, read-only inspection, operator questions, and any explicitly confirmed preference write" [SOURCE: .skilled/commands/doctor/env.md:14]. Its workflow summary reads the live reference at invocation time and adds what `.env.example` documents that the reference lacks, displays a read-only set/unset inventory across sources, shows the exact proposed line and destination, writes only after an explicit yes, supports `--dry-run` as "the same preview without writing", and re-reads any changed file before its final status [SOURCE: .skilled/commands/doctor/env.md:52-58]. The env route is also the only standalone doctor command whose runnable form is pinned ("With no selector the router stops at a menu, so the runnable form names `list`") [SOURCE: .skilled/commands/doctor/_routes.yaml:387-392].

**Consequence for `toggle`:** repository variables are not a file, so the env pattern's "show the exact proposed line, write on yes, re-read" becomes "show the exact `gh variable set` line, execute on yes, re-read the variable and the resolved state, report the difference". Iteration 11's finding that writing repository variables needs an admin token the CLI typically lacks does not weaken this: the print step is the product, the execute step is optional and fails loudly.

### F7 — The umbrella's read-only invariant is the model for `list` and `check` — **confirmed**

`doctor-setup.yaml` declares `read_only: true`, `allowed_targets: []`, `forbidden_targets: ["**/*"]` and an invariant: "Every leg runs in its check-only form. This route MUST NOT regenerate the trigger index, sync a runtime mirror, start the advisor daemon, install hooks or provision the tree. A failing leg prints the doctor command that repairs it; repair is an explicit operator action, never a side effect of this diagnostic" [SOURCE: .skilled/commands/doctor/assets/doctor-setup.yaml:23-28]. Its leg taxonomy is the status vocabulary `/doctor:ci check` should reuse: exit 0 PASS; a named exit for DEGRADED (the sk-git leg treats exit 3 as degraded, "no check failed, but one is UNKNOWN or DEGRADED"); SKIP when a prerequisite is absent; FAIL for a real failure with the repair command; ERROR for a crash or unreadable output [SOURCE: .skilled/commands/doctor/assets/doctor-setup.yaml:53-58] [SOURCE: .skilled/commands/doctor/assets/doctor-setup.yaml:65-68].

**Consequence:** `check` must run every leg even after one fails, and its output contract is `STATUS=OK|FAIL|ERROR` plus a repair command per non-passing leg — never a silent fix of a workflow file.

### F8 — Advisor routing needs one bridge per target, with `id` equal to `inventoryId` — **confirmed**

Doctor bridges are derived from the manifest, and the deriver requires a doctor bridge's `id` to equal its `inventoryId` [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:336-340]; every `inventoryId` must be a known inventory entry and must be unique per platform [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:315-331]. The manifest's own note is that the deriver "turns every route… into one advisor command bridge" and "A bridge routes only once scoring-compatibility.json beside the deriver activates it" [SOURCE: .skilled/commands/doctor/_routes.yaml:15-20].

**Consequence:** five `command-doctor-ci-<target>` inventory ids, five activation entries in each of the two platform lists, and `lead_phrases` only where the doctor must outrank a passing skill (for example "disable a ci workflow" versus a hypothetical `sk-code-ci` match).

### F9 — Ownership splits along the artifact boundary, not the diagnostic boundary — **inferred**

Three facts point the same way. (i) The env doctor refuses to copy its inventory into the workflow — the reference is read live, "Do not copy either switch list into this workflow or another file" [SOURCE: .skilled/commands/doctor/env.md:54]. (ii) The sk-code router's command explicitly forbids editing workflow YAML while executing [SOURCE: .skilled/commands/doctor/sk-code.md:14], which says the doctor family treats workflow authoring as someone else's contract. (iii) The doctor setup workflow's whole job is diagnosis plus a repair *pointer*, never the repair [SOURCE: .skilled/commands/doctor/assets/doctor-setup.yaml:28].

Applying that precedent: `/doctor:ci` owns **inspection, toggling and customization** — the things that need the live repository state. `sk-code-ci` owns **the standards and the template** — what a correct workflow file looks like. `scaffold` is the one seam: a doctor route that writes a file, and it must take its content from the sk-code-ci template rather than embedding YAML in `doctor-ci-*.yaml`, exactly as `env` reads its inventory from the reference instead of copying it. It does **not** belong in `sk-git`; `sk-git` owns git workspaces, commits and PRs, and its doctor route is scoped to `.sk-git/` standards and hook gates [SOURCE: .skilled/commands/doctor/_routes.yaml:242-266].

**What would confirm F9:** the sk-code hub's own registration rules (next focus) — if `sk-code-ci` is required to own reviewable templates, the seam below is the only consistent split.

## 4. SPECIFICATION — `/doctor:ci` (proposed)

**Router:** `.skilled/commands/doctor/ci.md`, frontmatter `allowed-tools: Read, Bash, Grep, Glob`, `skill_agent: system-spec-kit` (the doctor group's owner). Target-first parsing, `ci` as the implicit default target (matching `setup`/`sk-code`).

**Inputs:** `list` | `check` | `toggle <workflow|group>` | `customize <workflow> [--paths|--schedule|--node]` | `scaffold <name> [--kind=test|guard|report]` | `--dry-run` | `--yes` | `--json`.

**Safety rules (each one traceable to a cited constraint):**

1. `list` and `check` declare no write and grant no mutating command (K1/K2, F2).
2. `toggle`, `customize` and `scaffold` default to dry-run; every write shows the exact line or unified diff and needs an unambiguous yes immediately before it; a prior yes authorizes nothing further (env pattern, F6).
3. **Protected set** — `gate-inputs.yml`, `message-contract.yml`, `comment-hygiene.yml`, `changed-packet-validation.yml`, `trigger-index-rebuild.yml` — cannot be edited without a second, named confirmation. The set lives in the `sk-code-ci` data, not in the router, so review and scaffolding agree. *Inferred:* the specific membership is judgement; the rule that a protected set must exist follows from `trigger-index-rebuild.yml`'s split-job token design and `message-contract.yml`'s role as the hook-independent enforcement layer.
4. `scaffold` never emits a literal `.opencode/…` run path and always lists both roots in every filter (F4).
5. `toggle` never runs `gh workflow disable`; it prints the command, and reports state it can read without a token as UNKNOWN rather than guessing (F6, iteration 11 finding).
6. Writes are allowlisted to `.github/workflows/<file>.yml` and `.github/workflows/README.md`; everything else is out of scope, and the command may never write `.env`, `.env.example` or any credential file (env's `never_write` precedent, F6).

**Presentation:** `assets/doctor-ci-presentation.txt` owns every table, prompt, error and status string.

**Owned assets:** `_routes.yaml` (5 routes), `ci.md`, `assets/doctor-ci.yaml` + per-target YAMLs, `assets/doctor-ci-presentation.txt`, and one script for the read-only battery (`--json`, zero model calls, exit 0/1/2/3 in the route-validate house style).

## 5. QUESTIONS ANSWERED

- **What should a /doctor:ci command do, how is it made safe, and who owns it?** — Answered. Five targets across three mutation classes (F2); registration is six surfaces plus three reruns (F1, F3, F8); safety is K1-enforced read-only splits, dry-run default, per-write yes, a protected set, and an allowlist (F2, F6, F7); ownership splits doctor (inspect/toggle/customize) from `sk-code-ci` (standards/template) with `scaffold` as the seam (F9); the scaffold template is bound by the `gate-inputs` sentinel-root and dual-filter rules (F4).

## 6. QUESTIONS REMAINING

- **What should an `sk-code-ci` mode contain, and what does registering a new `sk-code` mode require?** (next focus; carries the gate shape and the `off`-token rule, and must now also answer whether `scaffold`'s template is a mode asset.)
- **How do the ranked recommendations group into ordered implementation phases 002 and later?** Now better constrained: `check` is a prerequisite for noticing README drift (F5), and `sk-code-ci` must land before `scaffold` (F9).
- **Carried forward:** which jobs duplicate pre-commit hooks? (iterations 5/7/9/11/12)
- **Carried forward:** are spec-kit tests fixture-collision-safe under `fileParallelism: true`, and does `.skilled/skills/system-spec-kit/runtime/vitest.config.ts` set it?
- **Blocking phase 002, unchanged:** does a job skipped by `if:` satisfy a required status check? A skipped required check is exactly what a `vars`-driven toggle produces (iteration 11, F6), which makes this the highest-risk unknown on the whole on/off design.
- **New:** does any checker anywhere compare `.github/workflows/*.yml` against `README.md`'s table? F5 is inferred from directory-level absence only.

## 7. NEXT FOCUS

The `sk-code-ci` mode: read `.skilled/skills/sk-code/`'s hub registration (`SKILL.md`, `mode-registry.json`, `hub-router.json`, `leaf-manifest.json`) and one existing leaf mode, then specify what `sk-code-ci` contains (SHA pinning, dual-root parity per `gate-inputs`, README row, `set -euo pipefail`, timeouts, least-privilege permissions, fork and secret safety, caching, concurrency, matrix), how `sk-code-review` applies it, and which of its files `/doctor:ci scaffold` consumes.

## SCOPE VIOLATIONS

None. No file outside the allowed write paths was created, modified, renamed or deleted.
