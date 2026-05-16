---
title: "Decision Record: Doctor Router Phase 1 [system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/003-router-phase/decision-record]"
description: "Architectural Decision Records for the /doctor router consolidation: Option C boundary, manifest-file split, argv-positional UX, two-phase rollout, flag-parsing order."
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v2.2 -->"
---
# Decision Record: Doctor Router Phase 1

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v2.2 -->

---

## ADR-001: Option C (10 → 3 .md) is the chosen consolidation boundary

**Status:** Accepted (2026-05-11)

**Context:** Packet 013 shipped 10 `/doctor:*` markdown commands with ~50 lines of duplicated boilerplate per Gen-A file. Three consolidation options were considered:
- **Option B (10 → 2 .md):** Single router + orchestrator; MCP infra folds into router.
- **Option C (10 → 3 .md):** Router + orchestrator + MCP infra command.
- **Option D (10 → 5 .md):** Functional buckets (db / audit / advisor / mcp / update).

**Decision:** Option C.

**Rationale:**
1. **Three coherent mental models survive intact:** per-subsystem diagnostic (router), full-system orchestrator (`/doctor:update`), MCP infrastructure (`/doctor:mcp`). Conflating any two weakens operator intuition.
2. **`mcp_debug` + `mcp_install` manage infrastructure, not databases.** Without working MCP servers, none of the other doctors run — `mcp install` is a *bootstrap* operation. Folding it into the same router as memory/causal-graph/etc. mixes upstream-of-DAG infra with in-DAG subsystems.
3. **`/doctor:update`'s DAG-coordinated lock+snapshot+rollback semantics are categorically different** from per-subsystem diagnostic semantics. Codex second opinion echoed this: "Option B over-compresses."
4. **Different contract generations under one router shell** would force the router to handle both Gen-A's `intent/scope/no_snapshot/dry_run` setup variables AND Gen-B's `MODE POLICY: Standalone` contract. Isolating Gen-B under `/doctor:mcp` keeps the router uniform.

**Alternatives rejected:**
- **B** — over-compression; weakens operator mental models.
- **D** — buckets are subjective; "audit" vs "db" is fuzzy when most subsystems support both.

**Consequences:**
- Final state after Phase 2: `.opencode/commands/doctor.md` (router), `.opencode/commands/doctor/update.md` (orchestrator), `.opencode/commands/doctor/mcp.md` (infra) — exactly 3 .md files.
- Mirror cost drops from 4 runtimes × 10 = 40 files to 4 × 3 = 12 files.

---

## ADR-002: Routing manifest lives in a separate `_routes.yaml`, not inlined in the router .md

**Status:** Accepted (2026-05-11)

**Context:** Two viable patterns for storing per-target route metadata:
- **Inlined markdown table** in the router .md (single-file simplicity).
- **Separate `_routes.yaml`** that the router reads at dispatch time (data-driven simplicity).

**Decision:** Separate `_routes.yaml`.

**Rationale (codex second-opinion-driven):**
1. **Skill Advisor ingestion:** advisor's lexical lane consumes per-target trigger phrases. A separate YAML file is a cleaner data source than scraping a markdown table.
2. **CI validation:** `route-validate.sh` can `yq` the manifest and assert internal consistency (each `yaml` references an existing file; each `mcp_tools` subset is within `allowed-tools` union; no duplicate targets).
3. **Auditability:** one place to add/remove targets. Spec packets, playbook scenarios, and future tooling can reference the manifest path canonically.
4. **Router .md stays stable:** new targets are added by appending to `_routes.yaml` only; the markdown doesn't change.

**Alternative rejected:** inlined markdown table — required parsing markdown for advisor + CI, fragile across formatting changes, no schema.

**Consequences:**
- `_routes.yaml` is the single source of truth for routing metadata.
- The router .md's SUBSYSTEM MANIFEST table is a human-readable mirror, not the canonical data.

---

## ADR-003: Argv-positional dispatch (`/doctor <target>`) is the primary UX; `--target=<name>` is a compatibility alias

**Status:** Accepted (2026-05-11)

**Context:** Two routing UX options:
- **`--target=<name>` flag** — explicit, no ambiguity, but flag-heavy.
- **Argv-positional** — `/doctor memory --dry-run`, follows kubectl/git/cargo convention.

**Decision:** Argv-positional primary; `--target=<name>` preserved as compatibility alias.

**Rationale:**
1. **Operator UX:** "verb noun" mental model is universal (`kubectl get pods`, `git remote add`, `cargo build release`).
2. **Tab-complete fit:** `/doctor m<TAB>` resolves cleanly under OpenCode's slash-command grammar.
3. **No flag noise:** `--target=memory` is verbose; positional `memory` is terser.
4. **Naturally extensible:** adding new targets only changes the manifest, not flag parsing.

**Alternative rejected:** flag-first (`--target=<name>`) — verbose, unfamiliar to operators used to `kubectl/git` conventions.

**Consequences:**
- Examples section in router .md leads with argv-positional form.
- `--target=<name>` is documented in the per-target case block but not advertised as the primary form.

---

## ADR-004: Two-phase rollout — Phase 1 additive (no deletes), Phase 2 hard cutover

**Status:** Accepted (2026-05-11)

**Context:** Three sequencing options for the consolidation:
- **Single packet** — router + mcp.md + mirrors + playbook updates + advisor reindex + old-file deletes all in one PR.
- **Two phases** — Phase 1 ships router additively alongside old files; Phase 2 deletes old + syncs everything.
- **Three phases** — even more granular (router-only → mirror sync → cutover).

**Decision:** Two phases.

**Rationale:**
1. **Risk isolation:** Phase 1 is purely additive — zero risk of breaking existing `/doctor:<target>` invocations. Operators can A/B test the new router against the old commands.
2. **Validation window:** Both forms work in Phase 1, so any router bugs surface against the old commands as the gold standard.
3. **Reversibility:** Phase 1 can be reverted by deleting the new files; old behavior continues. After Phase 2, reverting is harder (sed-undo + advisor re-reindex).
4. **Per user decision (2026-05-11 AskUserQuestion):** "Two phases".

**Alternative rejected:**
- **Single packet** — too many simultaneous changes; if anything regresses, the blast radius is large.
- **Three phases** — diminishing returns; the mirror sync is small enough to bundle with the cutover.

**Consequences:**
- This packet (Phase 1) creates new files only; no deletes, no playbook touch, no advisor reindex.
- Phase 2 (`005-cutover-phase`, planned) handles all the destructive + sync work atomically once Phase 1 is validated.

---

## ADR-005: Flag-parsing order — target FIRST, flags SECOND (no global flag pre-parse)

**Status:** Accepted (2026-05-11)

**Context:** Codex second opinion identified flag-parsing order as "the single most surprising design risk" in a router that dispatches to disjoint flag schemas. Two implementation approaches:
- **Global flag pre-parse** — router parses ALL `--flag` args first, then dispatches by target. Simple to write; fragile.
- **Target-first** — router parses ONLY the positional target first, then runs the target-specific flag parser.

**Decision:** Target-first.

**Rationale:**
1. **Disjoint flag spaces:** `--scope` means different things in `code-graph` vs `deep-loop`. `--server` only exists for `/doctor:mcp`. `--confidence-threshold` only exists for `causal-graph`. Global pre-parse can't decide which schema to apply.
2. **Silent corruption risk:** if `--scope=both` is pre-parsed when target is unknown, it could later be bound to `code-graph` (where `--scope` accepts different values), silently corrupting the invocation.
3. **Clear error UX:** target-first parsing lets the per-target parser emit a precise error: "`--confidence-threshold` is not a valid flag for `memory`; did you mean `/doctor causal-graph --confidence-threshold=0.8`?"

**Alternative rejected:** global pre-parse — codex flagged as the #1 subtle-bug risk.

**Consequences:**
- Router code structure: (1) consume first positional arg → bind target, (2) `case "$target" in` block runs per-target flag parser, (3) load YAML and hand off.
- Unit test required: cross-target flag injection raises a clear error.

---

## ADR-006: `allowed-tools` frontmatter union is unavoidable; manifest documents per-target subset

**Status:** Accepted (2026-05-11)

**Context:** The OpenCode slash-command runner authorizes tools from the `allowed-tools` frontmatter at command-load time, not lazily after YAML load. A router that dispatches to 7 different YAMLs (each with disjoint MCP tool needs) must declare the union of all 7 tool sets upfront.

**Decision:** Router's frontmatter `allowed-tools` is the full union (~32 tools, identical to `/doctor:update`'s allowlist today). Per-target `mcp_tools` in `_routes.yaml` documents what each target REALLY uses.

**Rationale (codex second-opinion-driven):**
1. **Runner limitation:** no lazy authorization is available. Codex called this "the real design tax."
2. **Already precedented:** `/doctor:update` already maintains this union today. Copying its allowlist preserves the precedent.
3. **CI assertion:** `route-validate.sh` can compare per-target `mcp_tools` against actual YAML tool calls and flag orphan tools.

**Consequences:**
- Slight expansion of router's authorization surface vs per-command least-privilege.
- Mitigated by `route-validate.sh` enforcing per-target subset discipline.

---

## ADR-007: Hard cutover end state — no shim aliases after Phase 2

**Status:** Accepted (2026-05-11)

**Context:** Three backwards-compat strategies after Phase 2:
- **Hard cutover** — delete the 9 old .md files immediately; no aliases.
- **Shim alias period** — keep 9 thin redirects for one release.
- **Advisor-only fallback** — delete old .md but advisor maps old `/doctor:memory`-style invocations to new router.

**Decision:** Hard cutover end state (with advisor-driven name absorption as a quality-of-life feature, not a redirection mechanism).

**Rationale (per memory `feedback_delete_not_archive_or_comment`):**
1. **User preference:** "Legacy code/docs must be DELETED, not archived or commented out." No `.bak`, no `.old`, no `_deprecated`, no commented-out stubs.
2. **Per AskUserQuestion 2026-05-11:** user explicitly chose hard cutover.
3. **Advisor absorbs the names:** `_routes.yaml` `trigger_phrases` teach the advisor to lexically route old phrases (`"causal edges drift"`, `"memory health"`, etc.) to the new router. Users typing `/doctor:memory` from muscle memory get a "did you mean `/doctor memory`?" suggestion.

**Alternatives rejected:**
- **Shim alias** — defeats the consolidation purpose; rotates technical debt instead of removing it.
- **Advisor-only fallback alone** — partial; user explicitly wanted the old files gone.

**Consequences:**
- Phase 2 deletes 9 .md × 4 runtimes = 36 files.
- Advisor reindex in Phase 2 establishes the trigger-phrase routing.
- Manual playbook scenarios get a sed pass in Phase 2.

---

## ADR-008: Mutation class column in the combined GATE 3 STATUS table is mandatory

**Status:** Accepted (2026-05-11)

**Context:** Today's per-command GATE 3 STATUS tables cite each target's specific `Location` (e.g., `context-index.sqlite causal_edges table` for causal-graph). Collapsing into a single router .md needs a combined table.

**Decision:** Combined table with FIVE columns: target, Location, Reason, Alternative, **Mutation class (read-only / add-only / mutates)**.

**Rationale (codex second-opinion-driven):**
1. **Codex blocker:** "skill-budget is read-only; causal-graph is add-only; code-graph can write/repair. A shared `/doctor` status table must be route-specific or it will become false documentation."
2. **Audit honesty:** operator must be able to see at a glance which targets mutate state.
3. **CI assertion:** `route-validate.sh` cross-checks the table against `_routes.yaml` `mutating` field.

**Consequences:**
- GATE 3 STATUS table in `doctor.md` is multi-row, not single-row.
- Mutation class is canonical in `_routes.yaml`; router .md table is a human-readable mirror.
