# Iter 017 — Track 6: Quick Start install-step usability run-through

## Executive Summary
**7 findings** — 5 critical, 2 important. The Quick Start installation instructions are **completely broken** for fresh installs. All build steps reference non-existent package.json files, verification commands reference non-existent dist files, and the rg command will fail on most systems.

## Detailed Findings

### Finding 1: Step 3 — Memory server build references non-existent package.json (CRITICAL)
**Location**: README.md lines 133-135  
**Step**: `cd .opencode/skills/system-spec-kit/mcp_server && npm install && npm run build`  
**Issue**: No package.json exists in `.opencode/skills/system-spec-kit/mcp_server/`  
**Evidence**: 
- `find_file_by_name` for package.json in mcp_server returned "No files found"
- Directory exists and contains TypeScript source files (context-server.ts, etc.) but no Node.js package configuration  
**User impact**: Silent failure with `npm ERR! ENOENT: no such file or directory, open 'package.json'`  
**New information**: Yes — this is a structural mismatch between documented build process and actual project structure

### Finding 2: Step 4 — Skill-advisor server build references non-existent package.json (CRITICAL)
**Location**: README.md lines 137-139  
**Step**: `cd .opencode/skills/system-skill-advisor/mcp_server && npm run build`  
**Issue**: No package.json exists in `.opencode/skills/system-skill-advisor/mcp_server/`  
**Evidence**: `find_file_by_name` for package.json in skill-advisor mcp_server returned "No files found"  
**User impact**: Silent failure with npm package.json error  
**New information**: Yes — same structural issue as Finding 1

### Finding 3: Step 5 — Code-graph build references non-existent package.json (CRITICAL)
**Location**: README.md lines 141-143  
**Step**: `cd .opencode/skills/system-code-graph && npm install && node node_modules/typescript/bin/tsc -p tsconfig.json`  
**Issue**: No package.json exists in `.opencode/skills/system-code-graph/`  
**Evidence**: `find_file_by_name` for package.json in system-code-graph returned "No files found"  
**User impact**: Silent failure with npm package.json error  
**New information**: Yes — same structural issue, but this step also tries to run TypeScript directly via node_modules path that won't exist after npm install fails

### Finding 4: Step 6 — CLI scripts build references non-existent package.json (CRITICAL)
**Location**: README.md lines 145-147  
**Step**: `cd .opencode/skills/system-spec-kit/scripts && npm install && npm run build`  
**Issue**: No package.json exists in `.opencode/skills/system-spec-kit/scripts/`  
**Evidence**: `find_file_by_name` for package.json in scripts directory returned "No files found"  
**User impact**: Silent failure with npm package.json error  
**New information**: Yes — same structural issue

### Finding 5: Verification command references non-existent dist file (CRITICAL)
**Location**: README.md line 175  
**Step**: `node .opencode/skills/system-spec-kit/mcp_server/dist/context-server.js --help`  
**Issue**: No dist directory exists in mcp_server  
**Evidence**: 
- `find_file_by_name` for dist in mcp_server returned "No files found"
- Source file exists as context-server.ts but no compiled JavaScript version  
**User impact**: Command fails with `Error: Cannot find module`  
**New information**: Yes — verification step assumes build completed successfully, but build process is broken

### Finding 6: Verification rg command assumes ripgrep is installed (IMPORTANT)
**Location**: README.md line 178  
**Step**: `rg '"mk-spec-memory"|"mk_skill_advisor"|"mk_code_index"|"cocoindex_code"' opencode.json .claude/mcp.json .codex/config.toml .gemini/settings.json`  
**Issue**: 
- rg (ripgrep) is not a standard Unix utility — must be installed separately
- Three of the four config files don't exist in a fresh clone (opencode.json, .claude/mcp.json, .gemini/settings.json)
- Only .codex/config.toml exists  
**Evidence**: 
- `find_file_by_name` for opencode.json, .claude, .gemini all returned "No files found"
- Only .codex/config.toml exists (verified by reading the file)  
**User impact**: 
- If rg not installed: command fails with `command not found: rg`
- If rg installed but configs missing: command returns no results, confusing the user  
**New information**: Yes — verification step assumes both tool presence and config file existence that won't exist for fresh users

### Finding 7: Step 2 — Root npm install is insufficient for framework dependencies (IMPORTANT)
**Location**: README.md line 131  
**Step**: `npm install` (at repo root)  
**Issue**: Root package.json only contains minimal dependencies (chokidar, cors, express) — none of the MCP server dependencies  
**Evidence**: Root package.json read shows only 3 dependencies, none related to MCP servers or TypeScript build tooling  
**User impact**: User completes step 2 successfully, but all subsequent build steps fail due to missing dependencies. Creates false sense of progress.  
**New information**: Yes — reveals that the documented installation flow doesn't match the actual dependency structure

## Edge Cases Missed by Iter 6
- Iter 6 likely checked for path existence but not for the presence of package.json files specifically
- Iter 6 may have assumed the build process worked if directories existed, without checking for the actual Node.js package structure
- Iter 6 may not have checked that the verification commands would work on a fresh system without ripgrep or without pre-existing config files

## Step Ordering and Numbering
- Step numbering is sequential and logical (1-7)
- Ordering is appropriate (clone → deps → builds → optional CocoIndex)
- However, the ordering doesn't account for the fact that steps 3-6 will all fail due to missing package.json files

## Environmental Variable Setup
- The "Set Up Embedding Provider" section (lines 153-169) is clear and provides good options
- No issues found with this section
- Env var examples are appropriate

## First Use Section
- Lines 181-189 assume the framework is "active" after installation, but given the broken build steps, it won't be
- The example command `/spec_kit:complete Build a user authentication system` is appropriate but won't work without successful installation

## Actual State vs Documented State
The actual project appears to use pre-built launcher scripts in `.opencode/bin/` (mk-spec-memory-launcher.cjs, mk-skill-advisor-launcher.cjs, mk-code-index-launcher.cjs) rather than building from source. The `.codex/config.toml` references these launchers directly. This suggests the Quick Start documentation is outdated and doesn't match the current deployment model.

ITER_017_COMPLETE: 7 findings, newInfoRatio=1.00
