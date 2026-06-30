[0m
> build · glm-5.2
[0m
[0m→ [0mRead .opencode/skills/sk-design/design-md-generator/manual_testing_playbook/manual_testing_playbook.md
[0m→ [0mRead .opencode/skills/sk-design/design-audit/manual_testing_playbook/manual_testing_playbook.md
[0m→ [0mRead .opencode/skills/sk-design/design-interface/manual_testing_playbook/manual_testing_playbook.md
[0m→ [0mRead .opencode/skills/sk-design/design-foundations/manual_testing_playbook/manual_testing_playbook.md
[0m→ [0mRead .opencode/skills/sk-design/design-motion/manual_testing_playbook/manual_testing_playbook.md
[0m
[0m$ [0mgrep -rhoE '[0-9]{3}-[a-z][a-z0-9-]*\.md' .opencode/skills/sk-design
(no output)
[0m
The grep returned empty (no `NNN-name.md` files). Now verify a sample of per-feature links exist.
[0m$ [0mcd .opencode/skills/sk-design
for f in \
  design-interface/manual_testing_playbook/01--direction-freedom-and-deviation/free-axis-brainstorm-and-deviation.md \
  design-interface/manual_testing_playbook/13--redesign-intake/redesign-intake-classification.md \
  design-md-generator/manual_testing_playbook/01--extract/live-extraction.md \
  design-md-generator/manual_testing_playbook/06--escalation/anti-bot-escalation.md \
  design-audit/manual_testing_playbook/01--score/findings-first-score.md \
  design-audit/manual_testing_playbook/04--evidence-worksheet/evidence-backed-release-readiness.md \
  design-motion/manual_testing_playbook/01--strategy/purposeful-motion-plan.md \
  design-motion/manual_testing_playbook/06--advanced-craft/advanced-craft-popover-tooltip.md \
  design-foundations/manual_testing_playbook/01--color/oklch-palette-and-dark-mode.md \
  design-foundations/manual_testing_playbook/06--worked-examples/worked-examples-not-presets.md; do
  if [ -f "$f" ]; then echo "OK   $f"; else echo "MISS $f"; fi
done
OK   design-interface/manual_testing_playbook/01--direction-freedom-and-deviation/free-axis-brainstorm-and-deviation.md
OK   design-interface/manual_testing_playbook/13--redesign-intake/redesign-intake-classification.md
OK   design-md-generator/manual_testing_playbook/01--extract/live-extraction.md
OK   design-md-generator/manual_testing_playbook/06--escalation/anti-bot-escalation.md
OK   design-audit/manual_testing_playbook/01--score/findings-first-score.md
OK   design-audit/manual_testing_playbook/04--evidence-worksheet/evidence-backed-release-readiness.md
OK   design-motion/manual_testing_playbook/01--strategy/purposeful-motion-plan.md
OK   design-motion/manual_testing_playbook/06--advanced-craft/advanced-craft-popover-tooltip.md
OK   design-foundations/manual_testing_playbook/01--color/oklch-palette-and-dark-mode.md
OK   design-foundations/manual_testing_playbook/06--worked-examples/worked-examples-not-presets.md
[0m
All 10 sampled links resolve. The `grep` for any `NNN-name.md` pattern returned empty (no de-numbered files remain), and every sampled per-feature link target exists on disk.

```json
{"pass":"denumber-link-integrity","findings":[]}
```
