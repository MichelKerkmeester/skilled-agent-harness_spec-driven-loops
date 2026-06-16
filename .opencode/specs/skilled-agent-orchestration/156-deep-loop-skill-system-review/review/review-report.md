# Comprehensive Deep Review — deep-loop + skill-system trio (152 / 153 / 155)

## VERDICT: CONDITIONAL PASS → conditions MET (remediated + 3 adversarial waves; 0 P0, all P1 fixed on origin/027)

The deep-loop merge (152), the mcp skill-install/doctor standardization (153), and the parent-nested-skill formalization (155) are **functionally sound — zero P0**. The conditions are a contained **completion-honesty + dead-path** cluster (3 P1) and routine P2 cleanup, plus the operator-requested sk-doc dissection.

| Packet | Verdict | One-line |
|---|---|---|
| 152-deep-loop-workflows | **CONDITIONAL** | merge works (351 runtime tests pass, all requires resolve), but its destructive phase shipped without its gates while claiming Complete, leaving dead-path fallout |
| 153-mcp-skill-install-doctor-standardization | **PASS** | new scripts clean/idempotent; `validate.sh --strict` passes (the 85% was stale); only P2 edges |
| 155-parent-nested-skill-pattern | **PASS** | invariants hold; the C-plus guard + runtime self-containment are sound *for the shipped instance*; post-rename doc staleness only |

## Method
Orchestrated-wave deep review, operator-specified executors: **claude2 opus-4.8 (read-only, primary)** + **cli-opencode gpt-5.5-fast xhigh (fallback)**. 3 in-process scope-mapping agents → 9 opus discovery seats + 2 gpt-5.5 seats + 1 orchestrator-executed resolution check → 3 opus round-2 adversarial-verify seats (each prompted to *refute*). Orchestrator wrote all state (Gate-3 safe). 38 raw findings → round-2 calibrated to 0 P0 / 3 P1 / 35 P2.

## Refuted by verification (did NOT survive — saved from false escalation)
- **Cold-clone CI gate is inert** → REFUTED (the gate genuinely runs its assertions).
- **Mutating installers are unsafe** → REFUTED (shell-profile append is grep-before-append idempotent; pipx/pip guarded).
- **Broken requires from the +1 nesting** → REFUTED (all 23 cross-skill requires resolve; this session's depth fixes were complete).
- **Loop-lock race** → mostly correct (single-winner reclaim holds; only P2 edges).
- **C-plus only-canonical is a P1 gap** → downgraded P2 (correct-by-design; only one parent skill exists).
- **Seam-guard "coverage hole" is a regression** → downgraded P2 (the guard is runtime-scoped by design).
- **Stale skill-graph.json / advisor "drift"** → REFUTED at scope time (live sqlite correct; drift-guard 5/5).

## Surviving findings

### P1 (3) — fix before calling the trio "done"
1. **[152] Destructive deletion shipped without its gates, parent claims Complete.** `152/009-old-skill-deletion-and-validation/checklist.md` (0/18 P0 "pending execution"), `009/graph-metadata.json` (`status: planned_(scaffold)`, no implementation-summary), parent `spec.md` (`Complete/100%`); the required pre-deletion B1 council-graph probe was never added (`commands/doctor/assets/doctor_deep-loop.yaml` reads `deep-loop-graph.sqlite` only, 0 council refs). *No live harm* (skills merged + functional, deletion git-recoverable), but a real false-completion claim on an irreversible change. **Fix:** reconcile the metadata (record what actually verified the deletion — the 351 passing runtime tests — and either implement the B1 council-graph probe or formally descope it).
2. **[152] Failing sk-doc test.** `.opencode/skills/sk-doc/scripts/tests/test_changelog_validator.py:27` reads a now-deleted `deep-ai-council` changelog → fails on execution (no skip/guard). **Fix:** repoint to the merged location or guard the path.
3. **[155] Stale `key_files`.** `155/003-formalize-pattern/implementation-summary.md` `key_files` names `commands/create/parent-skill.md` (renamed to `sk-skill-parent.md`). **Fix:** repoint (or accept as point-in-time and note).

### P2 (35) — routine cleanup (representative)
Dead-path/stale fallout from the 152 deletion (broken `node`/`npx` commands in sk-code refs + benchmark READMEs; tests/playbooks naming deleted dirs; ~28 stale `/deep:start-*-loop` tokens, 5 at now-deleted files); the `reduce-state.cjs:123` tsx reach-in (coupling-only); doc-level reach-ins; a stale "three levels up" comment; `/doctor:update` missing `gate3_location`; doctor-script edges (hardcoded `release-stable` socket, a shared config-mutating/preview code fence); inert local pre-commit mirror gate (CI covers it). Full list: `deltas/iter-00*.jsonl`.

## Remediation plan (ordered)
1. **P1 trio** — the metadata reconciliation (152), the failing test (152), the stale key_files (155). Small, surgical.
2. **sk-doc dissection (operator-requested).** Split `references/skill_creation.md` (1138L) → `references/skill_creation/` per the verified map: `overview.md` (§1+§2+§9), `creation_workflow.md` (§3), `validation_and_packaging.md` (§4+§8), `common_pitfalls.md` (§5 — handle its embedded example-H2s for the sequential-numbering validator), `examples_and_maintenance.md` (§6+§7), `parent_skills_nested_packets.md` (§10 whole); `skill_creation.md` → thin hub. **Repoint the 33 live inbound refs** (templates, SKILL.md RESOURCE_MAP, graph-metadata key_files/entities, the `/create:sk-skill-parent` + `/doctor:parent-skill` "read skill_creation.md, locate Parent Skills" instructions, package_skill.py section-number comments, playbook resource-count fixtures) and **fix the 3 pre-existing-broken `references/specific/skill_creation.md` refs** in the same pass.
3. **P2 dead-path/stale sweep** — repoint the deleted-skill references (mostly the same class fixed earlier this session).

## Coverage note (honest)
The review **converged**: round-2 downgraded every escalated P1 except one and no P0 survived, so the verdict is stable. ~15 verified passes covered the high-value surface across all three packets. The genuine *remaining* surface (152's per-phase merged tree, agent-mirror three-way parity, runtime-promotion seams; 155 research→impl fidelity) is lower-yield P2-hunting — pushing to the full 50-seat budget would add P2s, not change the verdict. Available on request if exhaustive coverage is wanted.

---

## Post-remediation (3 adversarial waves, ~9 claude2-opus seats — all on origin/027)

The CONDITIONAL conditions are now **met**: the 3 original P1s fixed (failing sk-doc test, stale 155 key_files, 152 metadata reconciled), the operator-requested **sk-doc dissection** shipped, the **B1 council-graph probe built + verified**, and the dead-path sweep completed. Three further waves on the post-remediation code + the genuinely-uncovered surface found **1 P1 + ~12 P2** (commits `7dd2792a58`, `df37d442e4`, `22b65aaffd`):

- **Wave 1** — review of the shipped remediation: 3 P2, all fixed.
- **Wave 2** — 152 tree / 155 fidelity / 153 installers: **1 P1** (parent `152/spec.md` claimed EPIC COMPLETE while `009` = 6/18 — reconciled) + real installer safety bugs (`--dry-run` global npx-cache wipe; a "read-only" doctor connecting to every approved MCP server) — 6 fixed, 3 flagged.
- **Wave 3** — backend / installers / mirrors: 6 P2 — 3 installer bugs fixed; backend writer-lock hardening + one cosmetic mirror line flagged.

**Final: 0 P0; every P1 fixed and pushed.** The trio is functionally sound; agent-mirror three-way parity holds, runtime promotions are wired, the MCP-free boundary holds, and live advisor↔parent-skill routing parity is proven.

### Open flags (operator decisions / follow-ups — not fresh defects)
1. **Phase-007 governance R1** — the one-consolidated-catalog MUST was never built (5 per-mode trees ship). Decide: implement R1, or record a decision-record amendment (per-packet governance supersedes R1) + reconcile the 007 row.
2. **Full 009 gate sign-off** — 10 P0 gates unrun (byte-parity replay = the acceptance bar; strict validation; skill-graph rebuild; advisor/mirror/registry). Dedicated pass.
3. **deep-loop-runtime writer-lock hardening** — no stale-lock reclamation (an orphaned lock bricks all writers); convergence snapshot writes skip the lock. Focused backend pass.
4. **153 mutation-class CI** + **`/doctor:parent-skill` 4a target-awareness** — small follow-ons (limitations documented).
5. **`.claude/agents/deep-review.md` path-convention line** — one-line cosmetic fix, left to its concurrent-session owner.

### Flag resolution (operator-directed, 2026-06-16 — detail in iteration-004)
All flags actioned: **007 descoped** (decision-record supersedes R1), **009 signed off to 12/18 P0** (CHK-060/065 honestly reported-not-faked, not back-dated), **backend lock hardened** — Kimi k2.7's review caught 2 mutual-exclusion races the reclamation introduced, closed with a per-acquisition nonce + ownership-checked release (a real 24-process contention run holds mutual exclusion), **153 mutation-class CI built** (catches the two shipped bug classes), **doctor 4a made target-aware**, mirror line left to its owner. Two honest sub-flags remain: the 009 remainder (CHK-060 quiescent rebuild + CHK-065 artifact replay + 4 process gates) and a pre-existing `152/004/005/006/008` "missing 1 Level-2 file" cleanup.
