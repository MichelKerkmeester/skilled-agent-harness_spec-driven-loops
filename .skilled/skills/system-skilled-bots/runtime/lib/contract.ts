// ───────────────────────────────────────────────────────────────────
// MODULE: Payload Contract
// ───────────────────────────────────────────────────────────────────
//
// The four read verbs the terminal screen draws from, status, activity, inbox
// and routines, and the ui verb that refuses a screen binary built for another
// major, all read this one number, so a payload change cannot land in one verb
// and not in another.

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

/** The payload contract major every --json read verb prints as `version`, and the terminal screen's binary reports. */
export const PAYLOAD_CONTRACT = 1;
