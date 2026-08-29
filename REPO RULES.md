# Repo Rules — Code Environment (Public)

> Per-repository companion to `AGENTS.md`. That file carries rules true in every repository; this one carries the parts that are true only here — paths, commands, counts, flags. Its verification commands and local contracts bind exactly as `AGENTS.md`'s do.
>
> **The split rule:** if a statement names a directory layout, a script path, a command name, a tool count, an env flag, or a branch grammar, it belongs here and not in `AGENTS.md`. When this file and `AGENTS.md` appear to disagree about a *rule*, `AGENTS.md` wins. When they disagree about a *path or command*, this file wins.

---

## 1. WHAT THIS REPOSITORY IS

The home of the AI system itself: skills, agents, commands, hooks, and the spec-kit runtime that the other repositories consume by symlink. It is **not** an application codebase — `package.json` carries a single `dev` script and no test suite. The work here is authoring and maintaining the framework, so the quality gate is documentation and packet validation, not `npm test`.

Two application-ish directories exist alongside it: `a_nobel_en_zn/` and `barter/`.

`specs/` is the spec-folder root; several tracks in it are symlinks out to sibling repositories (`app-mobile-cli`, `obsidian`, `ai-systems`, `anobel.com`). Editing a packet through the symlink edits the sibling repo.

---

## 2. SKILLS, RUNTIMES, COMMANDS

**Skills root:** `.opencode/skills/`. Present here: `sk-code`, `sk-doc`, `sk-git`, `sk-design`, `sk-design-md-generator`, `sk-prompt`, `sk-vision`, `sk-communication`, `cli-external-orchestration`, `mcp-tooling`, `mcp-code-mode`, `system-spec-kit`, `system-skill-advisor`, `system-deep-loop`.

**Runtimes shipped (six).** `.opencode/`, `.claude/`, `.codex/`, `.cursor/`, `.pi/`, `.devin/` — each with its own `agents/` directory. Resolve agent definitions from the ACTIVE runtime and stay on that one directory for the whole workflow phase.

**Command surface** (`.opencode/commands/`):

| Group | Commands |
|-------|----------|
| `speckit` | `plan`, `implement`, `complete`, `resume` |
| `memory` | `save`, `search`, `manage`, `learn` |
| `deep` | `research`, `review`, `ai-council`, `agent-improvement`, `model-benchmark`, `skill-benchmark` |
| `create` | `skill`, `skill-parent`, `agent`, `command`, `readme`, `changelog`, `diagram`, `diff`, `benchmark`, `feature-catalog`, `manual-testing-playbook` |
| `doctor` | `speckit`, `mcp`, `update` |
| `rewrite` | `response`, `response-by-external-agent`, `explain-visually` |
| `prompt` | `improve` |
| `design` | `extract` |

---

## 3. VERIFICATION — THE AUTHORITATIVE GATE

**Spec-folder validation.** This is the completion gate for any packet:

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict
```

Exit `0` = pass · `1` = warnings · `2` = errors. **Under `--strict`, any warning also exits 2** — drive warnings to zero, do not settle for "errors: 0".

Three traps, each of which has produced a false green here:

- **Invoke it via a real path, not through a symlink into this repo from a sibling.** Through the `.opencode` symlink the script can exit 0 with no output at all. Verify by *content* — read the RESULT line — never by exit code alone.
- **Validating a phase parent recurses into children**, so the exit code and the output tail describe the last child, not the whole tree. Read every `RESULT` line, and validate children individually.
- **A tail-piped run reports the tail's exit code, not the validator's.** Capture `RC=$?` immediately, or read the summary lines.

**Metadata generation** (writes `description.json` + `graph-metadata.json`, hands off indexing, writes no canonical doc content):

```bash
node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js <json-file> <spec-folder>
```

It also accepts `--json '<inline>'` or `--stdin`. It reconstructs evidence from a session transcript, so **in a runtime whose transcript it cannot read it aborts with `INSUFFICIENT_CONTEXT_ABORT` and writes nothing.** That abort is safe. The fallback is to call the generator's own module directly:

```bash
node --input-type=module -e "
const m = await import('./.opencode/skills/system-spec-kit/mcp-server/dist/lib/graph/graph-metadata-parser.js');
console.log(m.refreshGraphMetadataForSpecFolder('<spec-folder>').metadata.derived.source_fingerprint);
"
```

That creates a correct `graph-metadata.json` from scratch. `description.json` is then hand-authored to the schema in `mcp-server/lib/description/description-schema.ts`, with `lastUpdated` set to the graph's `derived.last_save_at`. Never hand-guess `source_fingerprint` — the validator re-derives and enforces it.

**Diagnosing a validation failure by name** rather than by re-reading the whole output:

```bash
node --input-type=module -e "
const m = await import('./.opencode/skills/system-spec-kit/mcp-server/dist/lib/validation/generated-metadata-integrity.js');
console.log(JSON.stringify(m.checkGeneratedMetadataIntegrity('<spec-folder>'), null, 2));
"
```

**Templates:** `.opencode/skills/system-spec-kit/templates/` (`core/`, `addons/`, `packet-types/`).

**Legacy alias:** `.opencode/specs → ../specs`.

---

## 4. MCP AND DAEMONS

**Three native servers**, registered identically in `opencode.json`, `.claude/mcp.json` (shared with Cursor), and `.codex/config.toml`: Spec Kit Memory (`system-spec-memory`), Skill Advisor (`system_skill_advisor`), and Code Mode. The former Sequential Thinking server is decommissioned.

**Code Mode** external tools are configured in `.utcp_config.json` and reached through `call_tool_chain()`, named `{manual}.{manual}_{tool}` — e.g. `clickup.clickup_get_teams({})`. Discover with `search_tools()` / `list_tools()` rather than from a list.

**Daemon CLI front doors** — use only when the MCP tools are missing or return transport errors while the daemon should be warm. Exit `75` means retryable IPC unavailability, not task failure.

```bash
node .opencode/bin/spec-memory.cjs   memory_context     --json '{"input":"resume previous work","mode":"resume"}' --format json --timeout-ms 3000
node .opencode/bin/skill-advisor.cjs advisor_recommend  --json '{"prompt":"<request>"}' --warm-only --format json --timeout-ms 3000
```

**Advisor fallback** when no hook brief is present:

```bash
python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py "<request>" --threshold 0.8
```

**Gate 3 machine contract:** `.opencode/skills/system-spec-kit/shared/gate-3-classifier.ts` (`classifyPrompt()`).
**Hook contracts:** `.opencode/hooks/injection-contract.md`; per-runtime triggers in `system-spec-kit/references/config/hook-system.md`; feature flags in `system-spec-kit/mcp-server/ENV-REFERENCE.md`.

---

## 5. GIT

**Default branch:** `main`. Long-running release line at the time of writing: `skilled/v4.0.0.0`.

**Six hooks installed** and load-bearing, not conventions: `pre-commit`, `commit-msg`, `pre-push`, `post-commit`, `post-merge`, `post-rewrite`. `pre-push` is the technical backstop for the push policy; the commit- and merge-time hooks drive live-sync.

**Push policy.** `origin` receives release and reserved branches plus whatever `sk-git`'s allowlist permits without asking. Anything else needs a fresh in-the-moment go-ahead. One-invocation bypass: `SPECKIT_ALLOW_REMOTE_PUSH=1`.

**Advisory flags:** `SKGIT_ADVISORY`, `SKGIT_ADVISORY_SKIP=<rule-id>` to silence one advisory.

### The shared-checkout hazard — read this before any commit

**This checkout is shared with other concurrent sessions.** Its working tree routinely carries hundreds of dirty files that are not yours, and its index may already hold another session's staged entries.

- **NEVER `git add .`, `git add -A`, or `git commit -a`.** Stage explicit pathspecs only. A broad add here has already swept one session's uncommitted work into another session's commit.
- **NEVER `git add specs/`** — it stages the protected research repos underneath it (thousands of files). Recover with `git restore --staged specs/`.
- `git commit -- <pathspec>` commits working-tree content for those paths and leaves foreign staged entries intact — but **it only matches TRACKED files**. A new file needs an explicit `git add <path>` first, and the pathspec form fails silently with exit 0 if nothing matches.
- Before committing, re-check `git status --short <your paths>`: a file that was clean five minutes ago may now hold another session's edit, and committing it attributes their work to you.

---

## 6. AUTHORING CONVENTIONS

- **Reference-doc H2 headings are ALL CAPS.**
- **Skill-root metadata:** `graph-metadata.json` is the advisor identity file, required at BOTH parent-hub and standalone skill roots. `description.json`, `mode-registry.json`, `hub-router.json` are **hub-only** and forbidden on a standalone root. None of them live at a mode/packet or `shared/` sublevel. These filenames collide with spec-folder continuity metadata under a completely different schema — editing one as the other corrupts routing with no error.
- **Landing a skill edit** requires three pre-push gates to pass: `commit-msg`, branch-naming, and skill-root metadata leaf-manifest regeneration via `ci-skill-root-metadata.cjs --fix`.
- **Comment hygiene is enforced at commit time**, not just advised: no spec paths, packet or phase numbers, or ADR/REQ/task/finding ids in code comments.

---

## 7. KNOWN-GOOD ROUTES AND KNOWN TRAPS

| Situation | What actually works |
|-----------|---------------------|
| `generate-context.js` aborts on `INSUFFICIENT_CONTEXT_ABORT` | Expected outside OpenCode; it writes nothing. Use the `refreshGraphMetadataForSpecFolder` route in §3. |
| `repair-derived.cjs` says "not repairable" | It repairs an existing `graph-metadata.json`; it will not create a missing one. |
| Refreshing graph metadata on a bare **track** folder | Correctly adds missing `children_ids`, but overwrites curated `key_topics` and `causal_summary` with boilerplate, because a track folder has no `spec.md` to derive from. Back the file up and restore those two fields. |
| Dispatching a child CLI session | It inherits Gate 3 and will halt on the A/B/C/D/E question. Set `AI_SESSION_CHILD=1` (and for some CLIs a no-ask preamble in the prompt). |
| `cli-pi` dispatch hangs with zero output | A stale `.pi/deep-pi-stats.json.lock` stalls the session, and an unreachable hook daemon compounds it. `SYSTEM_HOOKS_DISABLED=1` clears the second. Exit code is never an availability signal for any `cli-*` route — check output text. |
| A `cli-*` model id from a reference doc | Re-check it against the CLI's live model store before dispatch; the docs drift. Thinking tiers differ per provider — a doc claiming `max` may map to `null`. |

---

## 8. RELATED

- `AGENTS.md` — the universal framework (symlinked here as `CLAUDE.md`).
- `.opencode/skills/system-spec-kit/SKILL.md` — spec-folder workflow, levels, validation.
- `.opencode/skills/sk-git/SKILL.md` — branch grammar, allocator, worktree and finish flows.
- `.opencode/hooks/README.md` — kill-switch index for every hook concern.
