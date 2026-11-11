#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Command-Hook env-secret-guard After-Call Entry
// ───────────────────────────────────────────────────────────────────
// STATUS: wired through hook-registry.json as a PostToolUse hook for Claude
// Code, Codex and Devin and a postToolUse hook for Cursor.
//
// The Codex hook installer identifies a hook by its script path, so one script
// cannot be registered on two events. This entry gives the after-call
// registration its own path and runs the same adapter, which reads the event
// name from the payload and takes the after-call branch.
'use strict';

require('./env-secret-guard.cjs');
