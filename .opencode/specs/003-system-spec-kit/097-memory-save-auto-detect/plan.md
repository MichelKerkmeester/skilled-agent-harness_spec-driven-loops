# Plan: 097 — Memory Save Auto-Detect Spec Folder

## Approach
Two-layer defense to prevent unnecessary spec folder questions during memory save.

## Steps
1. **Layer 1 — AGENTS.md**: Update MEMORY SAVE RULE to reuse Gate 3 spec folder as the default argument
2. **Layer 2 — folder-detector.ts**: Add Priority 2.5 step that queries session_learning DB for most recent preflight spec_folder
3. **Compile** folder-detector.ts to dist
4. **Test** generate-context.js auto-detection without CLI argument
