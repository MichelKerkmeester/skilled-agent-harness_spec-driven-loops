/**
 * Resolve one exact session and return the shared entry list.
 * @param {{ runtime: string, sessionId: string }} options - Runtime and exact id,
 *   plus the runtime-specific locator fields its reader accepts.
 * @returns {Promise<{ ok: true, source: object, items: Array<object> }
 *   | { ok: false, code: string }>}
 */
export function readSession(input: any): Promise<{
    ok: true;
    source: object;
    items: Array<object>;
} | {
    ok: false;
    code: string;
}>;
/**
 * Resolve one exact session and return its raw neutral records.
 * This is the only raw path; `readSession` is the projected one.
 */
export function loadSession(input: any): Promise<any>;
export const capabilities: Readonly<{
    claude: Readonly<{
        status: "ready";
        locatorKind: "transcript_path";
        storeRoot: "~/.claude/projects";
    }>;
    codex: Readonly<{
        status: "ready";
        locatorKind: "transcript_path";
        storeRoot: "$CODEX_HOME/sessions";
    }>;
    pi: Readonly<{
        status: "ready";
        locatorKind: "live_branch_or_session_log";
        storeRoot: "~/.pi/agent/sessions";
    }>;
    opencode: Readonly<{
        status: "ready";
        locatorKind: "session-store";
        storeRoot: "$XDG_DATA_HOME/opencode/opencode.db";
    }>;
    devin: Readonly<{
        status: "ready";
        locatorKind: "transcript_file";
        storeRoot: "$XDG_DATA_HOME/devin/cli/sessions.db";
    }>;
    dsh: Readonly<{
        status: "ready";
        locatorKind: "session_log";
        storeRoot: "$DSH_HOME/sessions";
    }>;
    cursor: Readonly<{
        status: "gated";
        locatorKind: "capability_flag";
        storeRoot: "(unconfirmed)";
        reason: "PreCompact delivery is unconfirmed, so there is no trustworthy capture point";
    }>;
}>;
//# sourceMappingURL=index.d.mts.map