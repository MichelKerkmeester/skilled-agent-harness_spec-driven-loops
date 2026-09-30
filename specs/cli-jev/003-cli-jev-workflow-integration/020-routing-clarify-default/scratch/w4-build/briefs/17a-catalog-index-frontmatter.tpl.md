@@PREAMBLE_MD@@

TASK: apply 2 literal text edits to one markdown file. Change nothing else in it. Two more briefs edit this file later.

FILE (edit): .skilled/skills/sk-doc/feature-catalog/feature-catalog.md

EDIT 1, starting at line 3. Replace exactly this text, whole lines, between the ~~~~ fences and not including them:
~~~~
description: "Current-state inventory for the sk-doc hub, covering its packet-authored, registry-projected routing across fourteen documentation-authoring packets, the default-on compiled-routing fast path that resolves ahead of it, the shared validator's changelog entry check and the advisory goal-criteria lint."
~~~~
with exactly this text:
~~~~
description: "Current-state inventory for the sk-doc hub, covering its packet-authored, registry-projected routing across fourteen documentation-authoring packets, the default-on compiled-routing fast path that resolves ahead of it, the zero-call clarify census, the shared validator's changelog entry check and the advisory goal-criteria lint."
~~~~

EDIT 2, starting at line 10. Replace exactly this text, whole lines, between the ~~~~ fences and not including them:
~~~~
  - "goal criteria lint"
last_updated: "2026-09-28"
~~~~
with exactly this text:
~~~~
  - "goal criteria lint"
  - "clarify default measurement"
last_updated: "2026-09-29"
~~~~

Accept when: 1 file changed, every EDIT applied once, and the checks below pass.

@@TAIL@@

Checks to run: `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-doc/feature-catalog/feature-catalog.md` must print `Total issues: 0` and exit 0. Also run it with `--type feature_catalog`: `Total issues: 0`.

@@HANDBACK@@
