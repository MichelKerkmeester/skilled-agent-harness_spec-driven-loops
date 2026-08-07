# Research: Implications of Relocating `.opencode/specs` to a Top-Level `specs/` Directory

**Spec folder:** `.opencode/specs/system-speckit/032-relocate-specs-folder/001-relocation-implications-research`
**Lineages:** `glm` (cli-devin/glm-5-2, 5 iter) · `grok` (cli-cursor/cursor-grok-4.5-high, 6 iter) · `sol` (cli-codex/gpt-5.6-sol high, 5 iter) · `luna` (cli-codex/gpt-5.6-luna max, 5 iter)
**Verification note:** 15 of 15 spot-checked citations across all four lineages were independently re-checked against the actual files during synthesis and matched exactly. All four lineages' per-iteration timestamps are self-reported and do not reflect true wall-clock time (each CLI ran its full multi-iteration loop inside one continuous session) — the *timing* metadata is synthetic; the *findings* are real and verified.
**Note on `sol`:** the orchestrator marked this lineage "failed" over a write-containment violation (`.pi/modes.json` modified, then automatically reverted — confirmed clean, zero residue). sol's own research completed cleanly beforehand (5/5 iterations, `synthesis_complete`, lock released) and never referenced that file in its own output; the most likely cause is an incidental side effect of a benign `ls -ld .pi/specs` command run while investigating the `.pi` runtime mirror, not a deliberate or dangerous action. Its findings are included below because they were independently verified, not despite the containment flag.

---

## 1. Executive Summary

Four independent research passes converge on the same shape and add up to more than any one of them: **relocation is safe as a "flip" (real tree at `specs/`, `.opencode/specs` becomes a compatibility symlink back), not a literal repoint of hundreds of thousands of lines.** The risk is concentrated in a specific, enumerable set of root-selection contracts across Spec Kit tooling and the Memory MCP server — not in git, not in the runtime mirrors, and not in the sheer reference count.

The biggest addition from this round: **`sol` and `luna` independently found that this repo already has a substantial migration-safety subsystem** — `spec-root-registry.ts` (21 resolver contracts), `spec-root-migration.ts`, `spec-root-migration-manifest.ts`, `spec-root-write-guard.ts`, and a 61-test-case validation matrix (`spec-root-validation-matrix.vitest.ts`, `spec-root-fault-injection.vitest.ts`) — built for the opposite direction (moving legacy `specs/` packets *into* `.opencode/specs`). All of this is verified real and precisely matches its stated purpose. **This machinery should be inverted and reused, not built from scratch.** Neither `glm` nor `grok` found this in the first round; it changes the recommendation from "patch ~7 literals by hand" to "invert and run the existing migration harness."

---

## 2. Where all four agree

- **The flip is the right shape.** Real tree at `specs/`, `.opencode/specs -> ../specs` as a compatibility symlink. Every lineage independently reached this architecture.
- **Git is not the blocker.** The symlink→real-directory swap is a normal, atomic, reversible git change; `.gitignore` negations (`!specs`, `!.opencode/`) and `~/.gitignore_global`'s path-keyed `/specs`+`/.opencode/` ignores are form-agnostic.
- **No runtime mirror (`.claude`, `.codex`, `.cursor`, `.devin`, `.pi`) owns a specs path.** None has ever needed its own specs symlink; mirror sync code has zero specs-handling logic. `sol` additionally confirmed `.claude/SYNC.md`'s claim of a `.claude/specs` symlink is stale documentation — no such symlink exists on disk.
- **The raw reference count is not the real risk surface.** Estimates range 100-476K depending on scope (full markdown corpus vs. active runtime code), but every lineage independently concludes blanket `sed`/rewrite is the wrong tactic — the actionable surface is a small, enumerable set of root-selection contracts, not a line count.
- **Memory MCP is internally inconsistent about root precedence** — some subsystems already accept both roots, others are canonical-only (`.opencode/specs`-locked). All four lineages found pieces of this; combined, the picture is now much more complete (see §4).

---

## 3. Combined ranked implication list

| Rank | Area | Implication | Source(s) | Found by |
|------|------|-------------|-----------|----------|
| P0 | Existing migration infrastructure | `spec-root-migration.ts`, `spec-root-migration-manifest.ts`, `spec-root-write-guard.ts`, `spec-root-registry.ts` (21 resolver contracts) already implement packet-hash dedup, divergent-duplicate rejection, writer freeze, quarantine-before-move, and rollback — pointed the opposite direction. Inverting and reusing this is lower-risk than a hand-written migration. | `spec-root-migration.ts:219`; `spec-root-write-guard.ts:15`; `spec-root-registry.ts:24-169` | sol, luna |
| P0 | Existing test coverage | A 61-test-case validation matrix already covers same-inode aliases, byte-identical/divergent duplicates, broken links, cross-device moves, writer freeze, quarantine, and rollback — for the opposite direction. Needs inversion + Git-index + Memory MCP assertions added, not authoring from zero. | `spec-root-validation-matrix.vitest.ts:27`; `spec-root-fault-injection.vitest.ts:96,130` | sol |
| P0 | Memory MCP discovery | Document/graph-metadata discovery and `startup-checks.ts` scan `.opencode/specs` first and treat it as canonical; `specs/` is fallback-only. A leftover `.opencode/specs` after a flip would shadow the new real tree until this precedence is inverted. | `memory-index-discovery.ts:203-221,308-379`; `startup-checks.ts:261-292` | grok, sol, luna (independently, cross-confirmed) |
| P0 | validate.sh | Hardcoded canonical-parent glob (`*/.opencode/specs/system-deep-loop/036-...`) causes a **silent skip** (returns 0, no error) after relocation — a correctness regression, not a loud break. | `validate.sh:212-221` | glm, sol, luna |
| P1 | create.sh + backfill | Both default their write/discovery root to `.opencode/specs`; both already accept an explicit override or dual-root in validation. Need default-flip, not new capability. | `create.sh:412-415,712-727,811-815`; `backfill-graph-metadata.ts:238-260,319-367` | glm, grok, sol, luna |
| P1 | CI | Strict-pass freshness workflow passes `--roots .opencode/specs` explicitly; the underlying sweep script itself accepts multiple roots. A cutover item, not cleanup. | `.github/workflows/strict-pass-freshness-sweep.yml:55`; `strict-pass-freshness.ts:83` | sol (new — neither glm/grok/luna checked CI) |
| P1 | context-server.ts | Moved-folder description-refresh base and startup drift-marker containment hardcoded to `.opencode/specs`. | `context-server.ts:1978-1984,242` | glm, luna |
| P1 | Memory MCP index scope | Default exclude glob `**/.opencode/specs/**` misses a bare top-level `specs/`. | `index-scope.ts:~45` | grok (unique — not independently re-checked by sol/luna, carry forward for verification) |
| P2 | Git tree | `specs` is a tracked symlink (mode `120000`), not a real directory — confirmed independently by 3 lineages via different commands (`git ls-files -s`, `git ls-files --stage`, `readlink`). The reverse alias must be **relative** (`../specs`), not absolute — the existing alias-retirement runbook incorrectly describes it as absolute and should not drive implementation. | `git ls-files -s specs`; sol's reproduction of the runbook error | glm, grok, sol |
| P2 | Downstream ownership | Whether a downstream repo's project-local specs data stays framework-shared (globally ignored) or becomes repo-owned (needs a local `!specs/` negation) is a **policy decision the research cannot make for you** — `PUBLIC-RELEASE.md` currently writes project data under `.opencode/specs` and needs updating either way. | `.gitignore:5-11`; `~/.gitignore_global:10-16`; `PUBLIC-RELEASE.md` | sol (most detailed treatment) |
| P2 | Gate 3 / docs UX | Gate 3 examples, `spec-gate-core.mjs`, and `AGENTS.md` still show `.opencode/specs` as the canonical example path. | `spec-gate-core.mjs:105-112`; `AGENTS.md:265` | glm, grok, sol |
| P3 | Documentation volume | 42-448 markdown/doc files carry stale `.opencode/specs` prose depending on scope measured — volume, not a functional break. | repo-wide `rg` counts (all 4 lineages, different scopes) | glm, grok, sol, luna |
| INFO (positive) | Memory MCP — partial dual-root already | Identity resolution, explicit-path indexing, resume, pending recovery, and alias handling already accept both roots (just not uniformly — see P0 above). | `spec-doc-paths.ts:275-334`; `indexing.ts:66-92`; `folder-discovery.ts:1364-1379`; `resume-ladder.ts:863-925` | luna (most complete), glm (partial) |
| INFO (positive) | No runtime mirror needs a specs symlink | Confirmed independently by all 4 lineages via direct filesystem inspection. | mirror `ls -la` inventories; `sync-runtime-mirrors.cjs` | glm, grok, sol, luna |

---

## 4. What running four lineages caught that fewer would have missed

- **glm+grok alone (round 1) never found the existing `spec-root-*` migration subsystem** — the single highest-value finding of this whole research effort. Executing glm's original "patch ~7 literals" plan without this would have meant hand-building migration safety (dedup, quarantine, rollback) that already exists, tested, one directory away.
- **grok found `index-scope.ts` and `startup-checks.ts`** that glm's first-round lineage never inspected; `sol` and `luna` (round 2) independently re-confirmed `startup-checks.ts` but neither happened to check `index-scope.ts` specifically — still worth carrying forward as unverified-by-round-2 rather than assuming it's covered.
- **Only `sol` inspected CI** (`.github/workflows/strict-pass-freshness-sweep.yml`) — a real cutover item none of the other three lineages checked.
- **Only `sol` reproduced the actual documented migration runbook** and found it describes the current symlink as absolute when it's actually relative — a detail that would have broken the reverse-alias step if followed literally.
- **`luna` was the most explicit about environmental limitations** — it flagged that its own graph-convergence probe never worked (`better-sqlite3` Node ABI mismatch: built for 127, running on 141) and that Memory findings are source-code-level, not a live database scan. That honesty is worth preserving: none of this research queried the live Memory MCP database directly.

---

## 5. Recommendation

**CONDITIONAL-GO, revised: invert and reuse the existing `spec-root-*` migration subsystem rather than hand-writing a patch list.**

1. Read `spec-root-registry.ts`, `spec-root-migration.ts`, `spec-root-migration-manifest.ts`, and `spec-root-write-guard.ts` in full before scoping a migration phase — this is the actual starting point, not a from-scratch plan.
2. Invert the 21-entry resolver registry's precedence (canonical becomes `specs/`, legacy becomes `.opencode/specs`), then invert the P0/P1 hardcoded-default items in §3 (`validate.sh`, `create.sh`, `backfill-graph-metadata.ts`, Memory MCP discovery/startup-checks/context-server.ts) as one coordinated batch — not piecemeal.
3. Invert the existing 61-test validation matrix rather than writing new fixtures; add the Git-index and Memory MCP assertions the current suite lacks.
4. Resolve the downstream-ownership policy decision (§3, P2) before executing — the migration works either way but the ignore rules and `PUBLIC-RELEASE.md` differ by answer.
5. Verify `index-scope.ts` (grok's unconfirmed finding) and CI (`sol`'s finding) are both covered by the inverted plan.
6. Treat this as a later phase's scope — this research phase's job was to inform the plan, not execute it.

---

## 6. Carried-forward open items (verify before executing any migration)

- `index-scope.ts:~45` — grok's finding, not independently re-checked by sol/luna in round 2.
- `backfill-graph-metadata.ts`'s bulk-discovery caller (glm, round 1) — does `--all`-scope discovery enumerate both roots?
- Downstream-repo verification — no lineage tested an actual downstream symlinked repo; the `~/.gitignore_global` contract is inferred from the ignore file itself.
- Live Memory MCP database behavior — all four lineages worked from source code only; `luna` explicitly could not reach the live database (ABI mismatch blocked its convergence tooling, and the daemon IPC endpoint was unavailable during its run).
- The existing `spec-root-*` test suite and migration scripts need a close read before being trusted as "ready to invert" — sol and luna verified they exist and roughly what they do, not that every line is bug-free for the reverse direction.

---

## 7. Source index

Full per-lineage detail: `lineages/glm/research.md`, `lineages/grok/research.md`, `lineages/sol/research.md`, `lineages/luna/research.md`. Combined primary sources beyond the first-round list:

- `.opencode/skills/system-spec-kit/scripts/core/spec-root-registry.ts` (L18-169)
- `.opencode/skills/system-spec-kit/scripts/core/spec-root-migration.ts` (L213-254)
- `.opencode/skills/system-spec-kit/scripts/core/spec-root-migration-manifest.ts` (L105)
- `.opencode/skills/system-spec-kit/scripts/core/spec-root-write-guard.ts` (L10-39)
- `.opencode/skills/system-spec-kit/scripts/tests/spec-root-validation-matrix.vitest.ts` (L27)
- `.opencode/skills/system-spec-kit/scripts/tests/spec-root-fault-injection.vitest.ts` (L96,130)
- `.github/workflows/strict-pass-freshness-sweep.yml` (L55)
- `.opencode/skills/system-spec-kit/scripts/sweep/strict-pass-freshness.ts` (L83)
- `.opencode/skills/system-spec-kit/mcp-server/lib/config/spec-doc-paths.ts` (L275-334)
- `.opencode/skills/system-spec-kit/mcp-server/api/indexing.ts` (L66-92)
- `.opencode/skills/system-spec-kit/mcp-server/lib/search/folder-discovery.ts` (L1364-1379)
- `.opencode/skills/system-spec-kit/mcp-server/lib/resume/resume-ladder.ts` (L863-925)
- `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-index-alias.ts` (L114-134,220-270)
- `.opencode/skills/system-spec-kit/mcp-server/lib/utils/canonical-path.ts` (L18-75)
- Round-1 sources: see prior version in git history / lineage docs for `create.sh`, `validate.sh`, `context-server.ts`, `memory-index-discovery.ts`, `startup-checks.ts`, `.gitignore`, `~/.gitignore_global` line references (unchanged, re-confirmed by round 2).
