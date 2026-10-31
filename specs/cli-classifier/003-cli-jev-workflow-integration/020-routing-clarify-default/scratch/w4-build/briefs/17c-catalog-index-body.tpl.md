@@PREAMBLE_MD@@

TASK: apply 2 literal text edits to one markdown file. Change nothing else in it. Another brief adds a section to this file later.

FILE (edit): .skilled/skills/sk-doc/feature-catalog/feature-catalog.md

EDIT 1, starting at line 18. Replace exactly this text, whole lines, between the ~~~~ fences and not including them:
~~~~
This catalog inventories the live `sk-doc` hub surface. The skill advisor routes any documentation- or component-authoring query to the single identity `sk-doc`; the hub resolves one of fifteen workflow modes — spread across fourteen packets, since one packet backs two modes — whose routing vocabulary is authored at the packet and projected into `mode-registry.json`/`hub-router.json` at runtime. A default-on, flag-gated compiled-routing fast path can resolve the same decision ahead of this registry-driven routing without changing what it resolves to. The hub's shared validator also holds every changelog entry to its search metadata. An advisory lint in `sk-create-goal` flags goal criteria a reader cannot check from the line alone.
~~~~
with exactly this text:
~~~~
This catalog inventories the live `sk-doc` hub surface. The skill advisor routes any documentation- or component-authoring query to the single identity `sk-doc`; the hub resolves one of fifteen workflow modes — spread across fourteen packets, since one packet backs two modes — whose routing vocabulary is authored at the packet and projected into `mode-registry.json`/`hub-router.json` at runtime. A default-on, flag-gated compiled-routing fast path can resolve the same decision ahead of this registry-driven routing without changing what it resolves to. A zero-call census in `sk-create-skill` counts how often that fast path answers `clarify`. The hub's shared validator also holds every changelog entry to its search metadata. An advisory lint in `sk-create-goal` flags goal criteria a reader cannot check from the line alone.
~~~~

EDIT 2, starting at line 94. Replace exactly this text, whole lines, between the ~~~~ fences and not including them:
~~~~
Note: this catalog documents `sk-doc`'s own hub-level routing and shared validation, plus the goal-criteria lint of `sk-create-goal`, which ships no catalog of its own. `create-diff` already owns a per-packet child-mode catalog (`sk-create-diff/feature-catalog/feature-catalog.md`); this root catalog does not duplicate or supersede it.
~~~~
with exactly this text:
~~~~
Note: this catalog documents `sk-doc`'s own hub-level routing and shared validation, plus the goal-criteria lint of `sk-create-goal` and the clarify census of `sk-create-skill`, which ship no catalog of their own. `create-diff` already owns a per-packet child-mode catalog (`sk-create-diff/feature-catalog/feature-catalog.md`); this root catalog does not duplicate or supersede it.
~~~~

Accept when: 1 file changed, every EDIT applied once, and the checks below pass.

@@TAIL@@

Checks to run: `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-doc/feature-catalog/feature-catalog.md --type feature_catalog` must print `Total issues: 0` and exit 0. Without `--type` the same command prints one `document_type_fallback` warning that is already there at HEAD; report it, do not fix it.

@@HANDBACK@@
