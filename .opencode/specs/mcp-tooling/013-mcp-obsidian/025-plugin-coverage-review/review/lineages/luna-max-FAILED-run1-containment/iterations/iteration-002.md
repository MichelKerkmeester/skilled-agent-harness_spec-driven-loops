# Iteration 2: Data-model grounding

## Dimension

Correctness — verify the packet’s no-residual-`VERIFY` rule in all 11 core data models.

## Files reviewed

All 11 `references/plugins/*/data-model.md` files. Confirmed markers include Charts at lines 133, 146, 214; Dataview at 231, 349; Excalidraw at 125, 224, 230; Git at 150-152, 166, 170; Minimal at 201; and Outliner at 134, 142.

## Findings by severity

### P1 — F001

Core data models retain ungrounded `VERIFY` markers in schema or schema-adjacent assertions. Evidence: [SOURCE: .opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/charts/data-model.md:133-146], [SOURCE: .opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/dataview/data-model.md:231], [SOURCE: .opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/git/data-model.md:150-170], [SOURCE: .opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/minimal/data-model.md:201], and [SOURCE: .opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/outliner/data-model.md:134-142]. Six of 11 plugin rows are affected. Ground each assertion or move the uncertainty to a bounded section with authoritative evidence.

Typed adjudication: claim confirmed after re-reading all 11 models; counterevidence was sought in adjacent non-schema notes; the live-vault-boundary explanation was rejected because the markers remain in core data-model files; final severity P1, confidence 0.98, downgrade only if the packet explicitly permits these markers.

Review verdict: CONDITIONAL
