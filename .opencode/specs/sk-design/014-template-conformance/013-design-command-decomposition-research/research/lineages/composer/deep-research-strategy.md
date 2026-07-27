# Deep Research Strategy — composer lineage

## 2. TOPIC

Should `/interface:design` be split into smaller single-purpose commands after the sk-design consolidation, and if so where do the seams fall?

## 3. KEY QUESTIONS (remaining)

- [ ] Q1: Which INTENT_SIGNALS co-occur vs never co-occur in RESOURCE_MAP?
- [ ] Q2: Which argument/internal lanes are separable jobs vs sequential phases?
- [ ] Q3: What does a command split cost in files, tests, and discriminator wiring?
- [ ] Q4: Do middle paths (lanes, subcommands, mode routing) already separate concerns?
- [ ] Q5: What failure modes does the single-command shape produce today?

## 4. NON-GOALS

- Implementing any command split or new command docs.
- Re-litigating the foundations/motion/audit mode retirement decision.
- Merging conclusions with the glm lineage.

## 5. STOP CONDITIONS

- 10 forced iterations complete (max-iterations stop policy).
- Hard constraint applied: no recommendation without demonstrated current problem.

## 12. KNOWN CONTEXT

- Hub consolidated to 2 workflow modes + 1 transport / 2 public commands.
- `design-interface/SKILL.md` at 4991 words (package_skill hard cap 5000; recommended 3000).
- Uncommitted working-tree trim: 5235 → 4991 words (motion-merge dedup).
- Stale `/interface:motion` still referenced in `design.md:27`.
- `command-metadata.json` tasks[] already maps 17 lanes to INTENT_SIGNALS.

## 13. RESEARCH BOUNDARIES

- Max iterations: 10
- Stop policy: max-iterations (convergence telemetry only)
- Write scope: `research/lineages/composer/` only
