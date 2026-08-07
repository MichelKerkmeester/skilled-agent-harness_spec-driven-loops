# Codex dispatch: Sandbox + playbook realignment after doctor mode reduction

## ROLE

You are Codex (gpt-5.5 high fast) dispatched by Claude Opus 4.7. The doctor command surface was reduced from 5 modes per command to a single interactive mode. The 25 manual playbook scenarios + 25 sandbox shell wrappers in `_sandbox/23--doctor-commands/scenarios/` were authored against the old multi-mode surface. They reference deleted yaml paths and deleted mode tags. Your job: curated rewrite that drops obsolete scenarios, rewrites surviving ones for the single-mode surface, and keeps sandbox + playbook + spec docs in lockstep.

Spec folder (pre-approved, skip Gate 3): `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/002-sandbox-testing-playbook/`

Branch: stay on `main`. Do not branch.

## CURRENT RUNTIME (treat as authoritative)

10 doctor YAMLs at `.opencode/commands/doctor/assets/` — bare names, no mode suffix:
- `doctor_causal-graph.yaml`, `doctor_cocoindex.yaml`, `doctor_code-graph.yaml`, `doctor_deep-loop.yaml`, `doctor_memory.yaml`, `doctor_skill-advisor.yaml`, `doctor_skill-budget.yaml`, `doctor_update.yaml`, `doctor_mcp_debug.yaml`, `doctor_mcp_install.yaml`

8 doctor command Markdown entrypoints at `.opencode/commands/doctor/*.md` already cleaned of `:auto`/`:apply`/`:apply-confirm`/`:default` references.

Single mode for all doctor commands:
- Status check first (memory, causal-graph, deep-loop, cocoindex)
- Tier-aware confirmation prompts before any mutation (short auto-ack, medium combined-prompt, long-pole ETA prompt)
- Read-only diagnostic flow for the read-only commands; mutation commands still prompt before each phase
- Invocation: bare `/doctor:memory`, `/doctor:causal-graph`, etc. — no mode suffix accepted

## PER-SCENARIO DECISIONS (apply exactly)

### KEEP & rewrite for bare command (21 files)

| ID | File | Action |
|----|------|--------|
| 323 | 323-doctor-memory-fresh-install.md | rewrite invocations: `/doctor:memory:apply` → `/doctor:memory`; yaml ref `doctor_memory_apply.yaml` → `doctor_memory.yaml`; description: "validates /doctor:memory bootstrap behavior on fresh workspace" |
| 324 | 324-doctor-memory-drift-detection.md | `/doctor:memory:auto` → `/doctor:memory`; drift IS the read-only diagnostic flow now |
| 325 | 325-doctor-memory-long-pole-rebuild.md | already mostly bare; sweep any stale yaml refs |
| 326 | 326-doctor-memory-sigint-cancellation.md | already mostly bare; sweep stale refs |
| 327 | 327-doctor-memory-disk-pressure.md | `/doctor:memory:apply` → `/doctor:memory` |
| 328 | 328-doctor-causal-graph-low-coverage.md | `/doctor:causal-graph:auto` → `/doctor:causal-graph` |
| 329 | 329-doctor-causal-graph-confidence-threshold.md | `/doctor:causal-graph:apply` → `/doctor:causal-graph` |
| 330 | 330-doctor-causal-graph-add-only.md | `/doctor:causal-graph:apply` → `/doctor:causal-graph` |
| 331 | 331-doctor-deep-loop-lazy-init.md | `/doctor:deep-loop:apply` → `/doctor:deep-loop` |
| 332 | 332-doctor-deep-loop-empty-no-source.md | `/doctor:deep-loop:auto` → `/doctor:deep-loop` |
| 333 | 333-doctor-deep-loop-convergence.md | `/doctor:deep-loop:apply` → `/doctor:deep-loop` |
| 334 | 334-doctor-cocoindex-daemon-healthy.md | `/doctor:cocoindex:apply` → `/doctor:cocoindex` |
| 335 | 335-doctor-cocoindex-daemon-zombie.md | `/doctor:cocoindex:apply` → `/doctor:cocoindex` |
| 336 | 336-doctor-cocoindex-daemon-unreachable.md | `/doctor:cocoindex:apply` → `/doctor:cocoindex` |
| 338 | 338-doctor-update-G5-confirm-failure-injection.md | rename heading drop "G5 confirm" → "G5 failure injection mid-rebuild"; `/doctor:update:confirm` → `/doctor:update`; this IS the canonical failure-handling scenario in single-mode |
| 339 | 339-doctor-update-G6-concurrent.md | `/doctor:update:auto` → `/doctor:update`; concurrent dispatch refusal contract still valid |
| 340 | 340-doctor-update-G7-sigint.md | `/doctor:update:apply` → `/doctor:update` |
| 341 | 341-doctor-update-G8-migration-gap.md | already flag-based (--migrate); sweep any stale refs |
| 342 | 342-doctor-update-G9-dashboard.md | `/doctor:update:auto` → `/doctor:update` |
| 344 | 344-doctor-update-tier-aware-default.md | rewrite to test tier-aware behavior in the interactive mode (the natural default); drop "default mode" framing — single mode IS tier-aware by design |
| 345 | 345-version-migration-3.3.0.0-to-3.4.1.0.md | already flag-based; sweep stale refs |
| 346 | 346-version-migration-cleanup-legacy.md | already flag-based; sweep stale refs |
| 347 | 347-version-migration-no-op.md | already flag-based; sweep stale refs |

### DROP entirely (2 files — physically `rm -f` per memory rule "DELETE not archive")

- `337-doctor-update-G4-auto-fresh.md` — REASON: `:auto` mode gone; the "fresh-no-snapshot" path folds naturally into the single-mode tier-aware behavior. No equivalent test. ID 337 leaves a gap (acceptable per "IDs stable once published" memory rule).
- `343-doctor-update-apply-full-chain.md` — REASON: `:apply` was the autonomous full-chain bypass mode that skipped the status decision gate. Single-mode always runs status check; this scenario has no semantic equivalent. ID 343 leaves a gap.

Also delete the matching shell wrappers under `_sandbox/23--doctor-commands/scenarios/`:
- `DOC-337-doctor-update-G4-auto-fresh.sh` — DELETE
- `DOC-343-doctor-update-apply-full-chain.sh` — DELETE

### Final scenario count: 23 (was 25)

IDs: 323-336 (14 scenarios) + 338-342 (5 scenarios) + 344-347 (4 scenarios) = 23 contiguous-with-gaps-at-337-and-343.

## TASK 1: Rewrite the 23 surviving `.md` scenarios

For each scenario file in `system-spec-kit/manual_testing_playbook/23--doctor-commands/`:

1. Update frontmatter `description:` to drop the mode suffix
2. Replace ALL `/doctor:X:auto`, `/doctor:X:apply`, `/doctor:X:apply-confirm`, `/doctor:X:confirm`, `/doctor:X:default` invocations with bare `/doctor:X`
3. Replace yaml asset references: `doctor_X_(auto|apply|apply-confirm|confirm|default).yaml` → `doctor_X.yaml`
4. Update prompt examples + expected behavior text to reflect single interactive mode (status check + tier-aware prompts)
5. Update any "When to use this mode" tables: collapse to single-mode entry
6. Preserve unique scenario semantics (each scenario still tests a distinct user-observable behavior)
7. Each file must still pass `python3 .opencode/skills/sk-doc/scripts/validate_document.py --type spec`

## TASK 2: Rewrite the 23 surviving `.sh` shell wrappers

For each wrapper in `system-spec-kit/manual_testing_playbook/_sandbox/23--doctor-commands/scenarios/`:

1. Replace mode-specific command invocations with bare `/doctor:X`
2. Preserve flag-based scenarios as-is (--migrate, --cleanup-legacy, --no-snapshot, --incremental, etc.)
3. Update header comments referencing deleted modes
4. Each file must still pass `bash -n` syntax check

## TASK 3: Delete the 2 obsolete files (1 .md + 1 .sh per drop, 4 total)

```bash
rm -f .opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/337-doctor-update-G4-auto-fresh.md
rm -f .opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/343-doctor-update-apply-full-chain.md
rm -f .opencode/skills/system-spec-kit/manual_testing_playbook/_sandbox/23--doctor-commands/scenarios/DOC-337-doctor-update-G4-auto-fresh.sh
rm -f .opencode/skills/system-spec-kit/manual_testing_playbook/_sandbox/23--doctor-commands/scenarios/DOC-343-doctor-update-apply-full-chain.sh
```

## TASK 4: Update the root playbook Section 12 cross-reference index

`.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` — Section 12 currently lists 25 entries for IDs 323-347. Remove entries 337 and 343, leaving 23 entries.

## TASK 5: Update 002-sandbox-testing-playbook spec packet docs

Files:
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/002-sandbox-testing-playbook/spec.md`
- `.../002-sandbox-testing-playbook/plan.md`
- `.../002-sandbox-testing-playbook/tasks.md`
- `.../002-sandbox-testing-playbook/checklist.md`
- `.../002-sandbox-testing-playbook/decision-record.md`
- `.../002-sandbox-testing-playbook/resource-map.md`
- `.../002-sandbox-testing-playbook/implementation-summary.md`

Updates required:
- "25 scenarios" → "23 scenarios"
- "IDs 323-347" → "IDs 323-336, 338-342, 344-347 (gaps at 337 + 343 — see decision-record.md ADR-008)"
- Update the per-feature-block scenario counts: `/doctor:update` orchestrator drops from 8 to 6 (was DOC-337..344, now DOC-338..342 + DOC-344)
- Add `decision-record.md` ADR-008 documenting the drop of DOC-337 + DOC-343 with rationale (mode reduction)
- Update REQ-001 acceptance criteria from "exactly 25 files at IDs 323-347" → "exactly 23 files at IDs 323-336, 338-342, 344-347"
- Update `resource-map.md` Tests section: drop the 2 dropped files, drop the 2 dropped wrappers
- Update `implementation-summary.md` Files Touched + dispatch results (acknowledge mode-reduction follow-on)

## TASK 6: Update 001-doctor-commands packet docs

Files:
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/001-doctor-commands/spec.md`
- `.../001-doctor-commands/plan.md`
- `.../001-doctor-commands/tasks.md`
- `.../001-doctor-commands/checklist.md`
- `.../001-doctor-commands/decision-record.md`
- `.../001-doctor-commands/implementation-summary.md`
- `.../001-doctor-commands/resource-map.md`

Updates:
- Reflect single-mode design: "10 yamls (8 doctor + 2 mcp variants)" instead of "31 yamls / 5 modes per command"
- Update yaml asset references throughout: `doctor_X_mode.yaml` → `doctor_X.yaml`
- Decision-record: add ADR documenting the mode reduction (autonomous → interactive-only)

## HARD CONSTRAINTS

1. Stay on `main`. Do not branch.
2. DELETE not archive (per memory rule): `rm -f` for the 4 dropped files, no `.bak`/`.archived`/`_obsolete` suffix.
3. Do not delete or modify YAMLs in `.opencode/commands/doctor/assets/` — those are correct as-is.
4. Do not touch the harness scripts (`run-all.sh`, `reset-state.sh`, `capture-evidence.sh`, `assert-signals.sh`) or Dockerfile / docker-compose — those don't reference modes.
5. Each surviving `.md` scenario must pass `python3 .opencode/skills/sk-doc/scripts/validate_document.py --type spec`.
6. Each surviving `.sh` wrapper must pass `bash -n`.
7. Final state: 23 .md scenarios, 23 .sh wrappers, IDs match 1:1 between md and sh.

## VERIFICATION (run after all edits)

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
PB=.opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands
SB=.opencode/skills/system-spec-kit/manual_testing_playbook/_sandbox/23--doctor-commands

echo "=== File counts ==="
echo "Scenario .md count: $(ls $PB/*.md | wc -l)"
echo "Wrapper .sh count: $(ls $SB/scenarios/*.sh | wc -l)"

echo "=== Stale mode refs in playbook .md ==="
grep -lrE ":(auto|apply|apply-confirm|default|confirm)\b" $PB/ 2>/dev/null | grep -v spec_kit | wc -l

echo "=== Stale yaml filename refs ==="
grep -lrE "doctor_[a-z-]+_(auto|apply|apply-confirm|confirm|default)\.yaml" $PB/ $SB/ 2>/dev/null | wc -l

echo "=== Bash syntax on wrappers ==="
for f in $SB/scenarios/*.sh; do bash -n "$f" || echo "FAIL: $(basename $f)"; done

echo "=== Validate scenarios ==="
SKDOC=.opencode/skills/sk-doc/scripts
for f in $PB/*.md; do
  python3 "$SKDOC/validate_document.py" --type spec "$f" 2>&1 | grep -q '"valid": true' || echo "FAIL: $(basename $f)"
done

echo "=== Spec validate on packets ==="
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/002-sandbox-testing-playbook --strict 2>&1 | tail -5
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/001-doctor-commands --strict 2>&1 | tail -5
```

Targets:
- Scenario .md count = 23
- Wrapper .sh count = 23
- Stale mode refs = 0 (excluding spec_kit:deep-* cross-command refs)
- Stale yaml filename refs = 0
- Bash syntax: all PASS
- Validate scenarios: all PASS
- 002 strict validate: PASSED
- 001 strict validate: PASSED (or document drift if scope creeps)

## OUTPUT REQUIREMENT

After completion, print:
1. Summary table: scenarios kept (23) / scenarios dropped (2) / total files modified
2. Verification command output (paste tail of each)
3. Any residual drift: list with reason
