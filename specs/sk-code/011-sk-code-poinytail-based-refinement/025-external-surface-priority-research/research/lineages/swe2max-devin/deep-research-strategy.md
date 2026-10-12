
# Deep Research Strategy - Session Tracking Template

Runtime template copied to `{spec_folder}/research/` during initialization. Tracks research progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep research session. Records what to investigate, what worked, what failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{spec_folder}/research/deep-research-strategy.md` and populates Topic, Key Questions, Known Context, and Research Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus.
- **Mutability:** Mutable — analyst-owned sections remain stable, while machine-owned sections are rewritten by the reducer after each iteration. Section 3 is a generated projection from the reducer registry.
- **Protection:** Shared state with explicit ownership boundaries. Orchestrator validates consistency on resume.

### Question Injection Surface

Use `{spec_folder}/research/inbox.jsonl` to append external questions during an active run. Each line is one JSON object with:

- `id`: stable inbox record identifier
- `text`: question text to promote
- `source`: concrete source label, such as an angle bank entry, analyst strategy, or operator note
- `origin`: one of `angle-bank`, `analyst-strategy`, `operator`, or `legacy-import`
- `injectedAtIteration`: iteration number when the question was introduced
- `promotedQuestionId`: promoted registry question id, or `null` until promotion

The reducer reads the inbox on every reduce step and carries `origin` into the question registry and dashboard badges. Direct edits to Section 3 still work as a compatibility path, but they are attributed as `legacy-import`.

Question ownership is explicit:

- Inbox rows are immutable input.
- The reducer registry is canonical question state.
- Section 3 is rendered only from the registry view.

When an inbox row targets an existing registry question but carries different text, the reducer keeps the registry value, records `operatorDecision: needs_decision`, and appends a `question_conflict` event with both `inboxValue` and `registryValue`.

---

## 2. TOPIC
Round two of the external sk-code surface priority research. Round one (research/research.md in this spec folder, findings F1-F33, recommendations R1-R5, rejected ideas X1-X9, phases P1-P4) found that the one order source is sk-code hub-router.json routerPolicy.tieBreak; a user's own surface outranks the native sk-code-opencode if it is inserted ahead of opencode (R1); stack-agnostic tooling must stop naming the obsidian and webflow examples (R2); deleting the examples must become a documented, verified path including the re-mint and authored copy (R3); the two surfaces must be marked as examples (R4); R5 (opencode generic keywords) stays as is by operator ruling. Background: sk-code-obsidian and sk-code-webflow are the operator's personal example surfaces; an external user deletes them and adds their own surface, which must outrank sk-code-opencode. sk-code-review, sk-code-quality and shared/ are stack-agnostic. Round two goes deeper, with path:line or command evidence: (1) F10, ROUTER.md stack-agnostic intents (debugging, performance, deployment, accessibility, implementation) load mostly or only Webflow leaves, so after an external user deletes webflow those intents load almost nothing: what shared/ or opencode leaves could serve them, and a proposed R6; (2) F20, compiled-routing re-mint depends on the authored closure under specs/sk-doc/z_archive/019-skill-routing-refactor/, so a user who prunes specs/ cannot re-mint: cost and blast radius of fixing it versus documenting it, and R7 or a reasoned no; (3) F18, adding a surface by hand fails five doctor legs (3d-files, 6b, 5k-alias, 5k-packet, 5k-canary): does /create:skill-parent update --surfaces (.skilled/commands/create/skill-parent.md and its assets) perform those steps, observed in a throwaway full-tree copy; (4) stress-test R1-R4: exact edit text, every file each one touches (including the auto twin of create-skill-parent-confirm.yaml, both README tables, the sk-code README), what can still break, and whether each is the smallest correct fix under .skilled/repo-rules/prevent-overengineering.md; (5) anything round one missed: other hubs or tooling that assume sk-code's examples (benchmarks, playbooks, feature catalogs, advisor batteries and fixtures, Hermes and runtime mirrors, CI workflows under .github/, install guides, /doctor:update release-engine keep-local rules) and the end-to-end external-user flow (clone, delete examples, add own surface, run doctor, route a prompt); (6) challenge the rejected ideas X1-X9 once more and name new rejections. Every recommendation must pass .skilled/repo-rules/prevent-overengineering.md: name the cheaper move and why it fails. Number new findings from F34, new recommendations from R6 and new rejections from X10 only in the final synthesis; inside iterations use the finding-row format the preamble gives.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Q7: F10, which shared/ or sk-code-opencode leaves could serve the stack-agnostic ROUTER.md intents once webflow is deleted, and what is the smallest fix (R6)?
- [x] Q8: F20, what does fixing the compiled-routing re-mint dependency on specs/sk-doc/z_archive/019-skill-routing-refactor/ cost across every hub, versus documenting it (R7 or a reasoned no)?
- [x] Q9: F18, does /create:skill-parent update --surfaces perform the five steps a hand-added surface misses (3d-files, 6b, 5k-alias, 5k-packet, 5k-canary), observed in a throwaway full-tree copy?
- [x] Q10: R1-R4 stress test, what exact edit text and which files does each touch, what can still break, and is each the smallest correct fix?
- [x] Q11: What other hubs, tooling, CI, mirrors, catalogs, playbooks, batteries or release-engine rules assume the obsidian and webflow examples, and what does the end-to-end external-user flow hit?
- [x] Q12: Do the rejected ideas X1-X9 still hold, and which new ideas should be rejected?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
Changing any skill, script, command, README or release note; deleting anything inside the worktree; building the recommendation; R5 (operator ruled it stays).

---

## 5. STOP CONDITIONS
Stop policy is max-iterations: all 10 iterations run. An unavailable executor or a usage limit stops the lineage with no substitute.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q7: F10, which shared/ or sk-code-opencode leaves could serve the stack-agnostic ROUTER.md intents once webflow is deleted, and what is the smallest fix (R6)?
- Q8: F20, what does fixing the compiled-routing re-mint dependency on specs/sk-doc/z_archive/019-skill-routing-refactor/ cost across every hub, versus documenting it (R7 or a reasoned no)?
- Q9: F18, does /create:skill-parent update --surfaces perform the five steps a hand-added surface misses (3d-files, 6b, 5k-alias, 5k-packet, 5k-canary), observed in a throwaway full-tree copy?
- Q10: R1-R4 stress test, what exact edit text and which files does each touch, what can still break, and is each the smallest correct fix?
- Q11: What other hubs, tooling, CI, mirrors, catalogs, playbooks, batteries or release-engine rules assume the obsidian and webflow examples, and what does the end-to-end external-user flow hit?
- Q12: Do the rejected ideas X1-X9 still hold, and which new ideas should be rejected?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- treating the README's own instructions as the script and running every health surface the repo ships exposed the silent-failure chain — the copy made deletion safe, and the tool exits plus JSON outputs gave quotable evidence at each step. (iteration 8)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- assuming the documented "replace" step plus a correct refresh would heal routing — refresh is registry-driven, so the deletion persists in hub-router/mode-registry; and assuming `compiled-route.cjs --json` was valid cost one probe (usage error, recovered in the same command block pattern). (iteration 8)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### "`compiled-route-manifest mint` requires the authored tree" — contradicted by observation: mint targets the runtime root and ran (exit 1 `already-exists`) with `specs/` absent. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "`compiled-route-manifest mint` requires the authored tree" — contradicted by observation: mint targets the runtime root and ran (exit 1 `already-exists`) with `specs/` absent.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "`compiled-route-manifest mint` requires the authored tree" — contradicted by observation: mint targets the runtime root and ran (exit 1 `already-exists`) with `specs/` absent.

### "Just read surfaces from mode-registry.json" (the change the focus suggested as the -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "Just read surfaces from mode-registry.json" (the change the focus suggested as the
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Just read surfaces from mode-registry.json" (the change the focus suggested as the

### "leaf-manifest.json needs hand-editing" — `generate-leaf-manifest.cjs --check` returned `OK` on the scrubbed file, i.e. `--write` produces it. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: "leaf-manifest.json needs hand-editing" — `generate-leaf-manifest.cjs --check` returned `OK` on the scrubbed file, i.e. `--write` produces it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "leaf-manifest.json needs hand-editing" — `generate-leaf-manifest.cjs --check` returned `OK` on the scrubbed file, i.e. `--write` produces it.

### "Move the whole 019 packet into `.skilled/`" — 73MB of spec history/research/real-model logs has no serving role; only the traced closure subset is consumed, and moving a subset splits the archival packet. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "Move the whole 019 packet into `.skilled/`" — 73MB of spec history/research/real-model logs has no serving role; only the traced closure subset is consumed, and moving a subset splits the archival packet.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Move the whole 019 packet into `.skilled/`" — 73MB of spec history/research/real-model logs has no serving role; only the traced closure subset is consumed, and moving a subset splits the archival packet.

### "No re-mint step needed after editing hub-router.json" — contradicted: route output collapsed to `servingAuthority:"legacy"` until `refresh` ran. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: "No re-mint step needed after editing hub-router.json" — contradicted: route output collapsed to `servingAuthority:"legacy"` until `refresh` ran.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "No re-mint step needed after editing hub-router.json" — contradicted: route output collapsed to `servingAuthority:"legacy"` until `refresh` ran.

### "R1 = insert surface first in tieBreak" — illegal: 5i enforces workflow-before-surface; correct phrase is "ahead of the default surface" (observed `PASS: 5i` only with that placement shape). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: "R1 = insert surface first in tieBreak" — illegal: 5i enforces workflow-before-surface; correct phrase is "ahead of the default surface" (observed `PASS: 5i` only with that placement shape).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "R1 = insert surface first in tieBreak" — illegal: 5i enforces workflow-before-surface; correct phrase is "ahead of the default surface" (observed `PASS: 5i` only with that placement shape).

### "sync --check catches post-refresh manifest drift" — contradicted: exit 0 while authored and runtime manifests differed (`cmp` exit 1); the guard, not sync, owns that leg. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: "sync --check catches post-refresh manifest drift" — contradicted: exit 0 while authored and runtime manifests differed (`cmp` exit 1); the guard, not sync, owns that leg.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "sync --check catches post-refresh manifest drift" — contradicted: exit 0 while authored and runtime manifests differed (`cmp` exit 1); the guard, not sync, owns that leg.

### "sync --check's printed remediation is sufficient" — the command it names is the one that fails (MOVE-SIMULATION); only the manual authored-path copy-back unblocks it. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: "sync --check's printed remediation is sufficient" — the command it names is the one that fails (MOVE-SIMULATION); only the manual authored-path copy-back unblocks it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "sync --check's printed remediation is sufficient" — the command it names is the one that fails (MOVE-SIMULATION); only the manual authored-path copy-back unblocks it.

### `/create:skill-parent update --surfaces` alone as the complete "add your own surface" path — observed gate exit 1 (5k-canary) and tieBreak-last placement. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `/create:skill-parent update --surfaces` alone as the complete "add your own surface" path — observed gate exit 1 (5k-canary) and tieBreak-last placement.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `/create:skill-parent update --surfaces` alone as the complete "add your own surface" path — observed gate exit 1 (5k-canary) and tieBreak-last placement.

### `/doctor:update` as the removal path — wrong tool class (release alignment, not checklist execution); carried F25. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `/doctor:update` as the removal path — wrong tool class (release alignment, not checklist execution); carried F25.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `/doctor:update` as the removal path — wrong tool class (release alignment, not checklist execution); carried F25.

### `compiled-route-sync --check` as a coverage check — already BLOCKED (served-copy check, not map-coverage; strategy:196-199). -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `compiled-route-sync --check` as a coverage check — already BLOCKED (served-copy check, not map-coverage; strategy:196-199).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `compiled-route-sync --check` as a coverage check — already BLOCKED (served-copy check, not map-coverage; strategy:196-199).

### `compiled-route.cjs --json` — not an option; correct form is `--hub <id> --prompt <text>` (usage line observed). Not a repo defect, just CLI shape. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `compiled-route.cjs --json` — not an option; correct form is `--hub <id> --prompt <text>` (usage line observed). Not a repo defect, just CLI shape.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `compiled-route.cjs --json` — not an option; correct form is `--hub <id> --prompt <text>` (usage line observed). Not a repo defect, just CLI shape.

### Bare `compiled-route-manifest.cjs refresh` — exits 2 usage; requires `--hub` + `--skill-root`. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Bare `compiled-route-manifest.cjs refresh` — exits 2 usage; requires `--hub` + `--skill-root`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Bare `compiled-route-manifest.cjs refresh` — exits 2 usage; requires `--hub` + `--skill-root`.

### Broad `rg 'webflow|obsidian'` as the dependent set — ~150 hits dominated by `mcp-obsidian` (a different product), the `sk-design` webflow brand bundle, and changelogs; the operative signal is the precise `sk-code-obsidian|sk-code-webflow` pattern. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Broad `rg 'webflow|obsidian'` as the dependent set — ~150 hits dominated by `mcp-obsidian` (a different product), the `sk-design` webflow brand bundle, and changelogs; the operative signal is the precise `sk-code-obsidian|sk-code-webflow` pattern.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Broad `rg 'webflow|obsidian'` as the dependent set — ~150 hits dominated by `mcp-obsidian` (a different product), the `sk-design` webflow brand bundle, and changelogs; the operative signal is the precise `sk-code-obsidian|sk-code-webflow` pattern.

### Broad `rg` for automation hooks: strategy marks the broad surface-name sweep BLOCKED (strategy:156-159); the targeted grep on the confirm YAML was sufficient. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Broad `rg` for automation hooks: strategy marks the broad surface-name sweep BLOCKED (strategy:156-159); the targeted grep on the confirm YAML was sufficient.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Broad `rg` for automation hooks: strategy marks the broad surface-name sweep BLOCKED (strategy:156-159); the targeted grep on the confirm YAML was sufficient.

### Hand-editing §11 rows to remove webflow paths — defeats the generated-projection contract (ROUTER.md:41) and the re-mint already does it. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Hand-editing §11 rows to remove webflow paths — defeats the generated-projection contract (ROUTER.md:41) and the re-mint already does it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Hand-editing §11 rows to remove webflow paths — defeats the generated-projection contract (ROUTER.md:41) and the re-mint already does it.

### Hand-editing `tieBreak` as part of the command's normal result — the YAML has no placement rule; natural execution appends at end. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Hand-editing `tieBreak` as part of the command's normal result — the YAML has no placement rule; natural execution appends at end.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Hand-editing `tieBreak` as part of the command's normal result — the YAML has no placement rule; natural execution appends at end.

### mode-registry.json `backendKind`/`packetKind`/`aliases`/`toolSurface` — all identical -- BLOCKED (iteration 5, 1 attempts)
- What was tried: mode-registry.json `backendKind`/`packetKind`/`aliases`/`toolSurface` — all identical
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: mode-registry.json `backendKind`/`packetKind`/`aliases`/`toolSurface` — all identical

### No per-surface `ROUTER.md`/map file found at `find -maxdepth 2` inside the surface packets — the per-packet maps ROUTER.md:41 describes live deeper or are generated; a later iteration (Q9/Q11) can locate the authored source the re-mint reads. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: No per-surface `ROUTER.md`/map file found at `find -maxdepth 2` inside the surface packets — the per-packet maps ROUTER.md:41 describes live deeper or are generated; a later iteration (Q9/Q11) can locate the authored source the re-mint reads.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No per-surface `ROUTER.md`/map file found at `find -maxdepth 2` inside the surface packets — the per-packet maps ROUTER.md:41 describes live deeper or are generated; a later iteration (Q9/Q11) can locate the authored source the re-mint reads.

### None new beyond the ruled-out rows. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: None new beyond the ruled-out rows.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None new beyond the ruled-out rows.

### None new beyond the violation forensics: whether the clone carried the writes or the shell cwd reverted could not be settled in budget; the end-state is recorded either way. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: None new beyond the violation forensics: whether the clone carried the writes or the shell cwd reverted could not be settled in budget; the end-state is recorded either way.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None new beyond the violation forensics: whether the clone carried the writes or the shell cwd reverted could not be settled in budget; the end-state is recorded either way.

### None new for the strategy list beyond the two ruled-out rows above. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: None new for the strategy list beyond the two ruled-out rows above.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None new for the strategy list beyond the two ruled-out rows above.

### None new; `compiled-route-sync --check` verified inapplicable to the surface-add gap (it is a served-copy check, not a map-coverage check). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: None new; `compiled-route-sync --check` verified inapplicable to the surface-add gap (it is a served-copy check, not a map-coverage check).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None new; `compiled-route-sync --check` verified inapplicable to the surface-add gap (it is a served-copy check, not a map-coverage check).

### Re-running copy probes for contract coverage: reading the workflow YAML settles which steps exist; a copy run would re-observe what iteration 2 already measured (5k-canary exit 1, tieBreak-last). -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Re-running copy probes for contract coverage: reading the workflow YAML settles which steps exist; a copy run would re-observe what iteration 2 already measured (5k-canary exit 1, tieBreak-last).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-running copy probes for contract coverage: reading the workflow YAML settles which steps exist; a copy run would re-observe what iteration 2 already measured (5k-canary exit 1, tieBreak-last).

### Searching `.github/`, `.devin/`, `.cursor/`, `.codex/`, `.claude/` for surface names — zero hits; CI and those mirror folders are clean by name (the CI coupling is indirect, via repo-walking tests and the drift guard). -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Searching `.github/`, `.devin/`, `.cursor/`, `.codex/`, `.claude/` for surface names — zero hits; CI and those mirror folders are clean by name (the CI coupling is indirect, via repo-walking tests and the drift guard).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching `.github/`, `.devin/`, `.cursor/`, `.codex/`, `.claude/` for surface names — zero hits; CI and those mirror folders are clean by name (the CI coupling is indirect, via repo-walking tests and the drift guard).

### Treating `routeSkillResources` `resources` output as a bug — it faithfully emits the map; the map itself is stale until re-mint. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating `routeSkillResources` `resources` output as a bug — it faithfully emits the map; the map itself is stale until re-mint.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `routeSkillResources` `resources` output as a bug — it faithfully emits the map; the map itself is stale until re-mint.

### Treating canary-cases.v1.json as R2 scope: it is generated closure data; re-mint owns it. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating canary-cases.v1.json as R2 scope: it is generated closure data; re-mint owns it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating canary-cases.v1.json as R2 scope: it is generated closure data; re-mint owns it.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Hand-editing §11 rows to remove webflow paths — defeats the generated-projection contract (ROUTER.md:41) and the re-mint already does it. (iteration 1)
- No per-surface `ROUTER.md`/map file found at `find -maxdepth 2` inside the surface packets — the per-packet maps ROUTER.md:41 describes live deeper or are generated; a later iteration (Q9/Q11) can locate the authored source the re-mint reads. (iteration 1)
- Treating `routeSkillResources` `resources` output as a bug — it faithfully emits the map; the map itself is stale until re-mint. (iteration 1)
- `/create:skill-parent update --surfaces` alone as the complete "add your own surface" path — observed gate exit 1 (5k-canary) and tieBreak-last placement. (iteration 2)
- Hand-editing `tieBreak` as part of the command's normal result — the YAML has no placement rule; natural execution appends at end. (iteration 2)
- None new; `compiled-route-sync --check` verified inapplicable to the surface-add gap (it is a served-copy check, not a map-coverage check). (iteration 2)
- "`compiled-route-manifest mint` requires the authored tree" — contradicted by observation: mint targets the runtime root and ran (exit 1 `already-exists`) with `specs/` absent. (iteration 3)
- "Move the whole 019 packet into `.skilled/`" — 73MB of spec history/research/real-model logs has no serving role; only the traced closure subset is consumed, and moving a subset splits the archival packet. (iteration 3)
- None new for the strategy list beyond the two ruled-out rows above. (iteration 3)
- "No re-mint step needed after editing hub-router.json" — contradicted: route output collapsed to `servingAuthority:"legacy"` until `refresh` ran. (iteration 4)
- "R1 = insert surface first in tieBreak" — illegal: 5i enforces workflow-before-surface; correct phrase is "ahead of the default surface" (observed `PASS: 5i` only with that placement shape). (iteration 4)
- "sync --check catches post-refresh manifest drift" — contradicted: exit 0 while authored and runtime manifests differed (`cmp` exit 1); the guard, not sync, owns that leg. (iteration 4)
- None new beyond the ruled-out rows. (iteration 4)
- "Just read surfaces from mode-registry.json" (the change the focus suggested as the (iteration 5)
- mode-registry.json `backendKind`/`packetKind`/`aliases`/`toolSurface` — all identical (iteration 5)
- Treating canary-cases.v1.json as R2 scope: it is generated closure data; re-mint owns it. (iteration 5)
- "leaf-manifest.json needs hand-editing" — `generate-leaf-manifest.cjs --check` returned `OK` on the scrubbed file, i.e. `--write` produces it. (iteration 6)
- "sync --check's printed remediation is sufficient" — the command it names is the one that fails (MOVE-SIMULATION); only the manual authored-path copy-back unblocks it. (iteration 6)
- None new beyond the violation forensics: whether the clone carried the writes or the shell cwd reverted could not be settled in budget; the end-state is recorded either way. (iteration 6)
- Broad `rg 'webflow|obsidian'` as the dependent set — ~150 hits dominated by `mcp-obsidian` (a different product), the `sk-design` webflow brand bundle, and changelogs; the operative signal is the precise `sk-code-obsidian|sk-code-webflow` pattern. (iteration 7)
- Searching `.github/`, `.devin/`, `.cursor/`, `.codex/`, `.claude/` for surface names — zero hits; CI and those mirror folders are clean by name (the CI coupling is indirect, via repo-walking tests and the drift guard). (iteration 7)
- `compiled-route.cjs --json` — not an option; correct form is `--hub <id> --prompt <text>` (usage line observed). Not a repo defect, just CLI shape. (iteration 8)
- Bare `compiled-route-manifest.cjs refresh` — exits 2 usage; requires `--hub` + `--skill-root`. (iteration 8)
- `/doctor:update` as the removal path — wrong tool class (release alignment, not checklist execution); carried F25. (iteration 9)
- `compiled-route-sync --check` as a coverage check — already BLOCKED (served-copy check, not map-coverage; strategy:196-199). (iteration 9)
- Broad `rg` for automation hooks: strategy marks the broad surface-name sweep BLOCKED (strategy:156-159); the targeted grep on the confirm YAML was sufficient. (iteration 9)
- Re-running copy probes for contract coverage: reading the workflow YAML settles which steps exist; a copy run would re-observe what iteration 2 already measured (5k-canary exit 1, tieBreak-last). (iteration 9)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Q10, Q11, Q12 (untouched this iteration). Refinement of F20 (new evidence): the dependency is not "re-mint needs specs" — mint writes the runtime root; the real dependency is `sync` (trace + `--check`) and the guard's authored-drift leg. (iteration 3)
- Q12 (rejected ideas X1-X9 re-challenge) — untouched this iteration. (iteration 7)
- Whether a registry-scrubbed copy heals the debug-intent defer (only the refresh was probed; the full mode-registry + hub-router scrub + re-mint in COPY_B remains unrun — flagged for a later iteration if budget allows). (iteration 8)
- Q12 (X1-X9 re-challenge) — untouched this iteration. (iteration 8)
- Whether `update --surfaces` rewrites the hub SKILL.md mode table and writes `description.json` keywords for a new surface — not located in this iteration's grep window; one targeted read of the confirm-YAML update branch would settle it. (iteration 9)
- The carried-forward F20 refinement: `sync` trace + `--check` and the guard's authored-drift leg are the real specs/ dependency, not mint (iteration 3). (iteration 9)
- Whether a registry-scrubbed copy heals the debug-intent defer (carried from iteration 8; COPY_B probe unrun). (iteration 9)
- Whether a registry-scrubbed copy heals the debug-intent defer (COPY_B probe; carried from iteration 8, unrun again — out of budget). (iteration 10)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Prior work: round one of this packet, research/research.md (F1-F33, R1-R5, X1-X9, P1-P4) and its lineages dsflash-devin and luna-max-fast under research/lineages/. resource-map.md not present for this lineage; skipping coverage gate.

### Bounded Context Snapshot

Populate during initialization when the target is codebase-scoped. Keep this pointer-based and small:

- Source pointers: paths, symbols, or resource-map entries relevant to the topic.
- Reuse candidates: existing utilities, patterns, docs, or agents worth extending.
- Integration points: files or contracts the research is likely to touch.
- Constraints and risks: scope limits, stale graph or memory gaps, and known non-goals.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use `@context` for one-shot retrieval, and use this snapshot only to seed the research loop.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `{spec_folder}/research/inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability matrix doc: `.skilled/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Capability resolver: `.skilled/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-10-12T18:58:06.247Z
