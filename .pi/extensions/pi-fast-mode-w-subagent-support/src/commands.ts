// ───────────────────────────────────────────────────────────────────
// MODULE: Commands
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ───────────────────────────────────────────────────────────────────

/** Usage guidance shown when the Fast Mode command arguments are invalid. */
export const FAST_COMMAND_USAGE = "Usage: /fast [on|off|toggle]";

// ───────────────────────────────────────────────────────────────────
// 2. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

/** Error raised when the Fast Mode command receives invalid arguments. */
export class FastCommandUsageError extends Error {
  constructor(message: string = FAST_COMMAND_USAGE) {
    super(message);
    this.name = "FastCommandUsageError";
  }
}

/** Parse a Fast Mode command argument into the next enabled state.
 *
 * @param args - Command arguments after the command name.
 * @param currentEnabled - Current Fast Mode state used by `toggle`.
 * @returns The requested or toggled Fast Mode state.
 * @throws {@link FastCommandUsageError} When the argument is unsupported.
 */
export function parseFastCommand(
  args: string,
  currentEnabled: boolean,
): boolean {
  const normalized = args.trim().toLowerCase();

  if (normalized === "" || normalized === "toggle") {
    return !currentEnabled;
  }

  if (normalized === "on") return true;
  if (normalized === "off") return false;

  throw new FastCommandUsageError();
}

/** Return command completions matching the supplied argument prefix. */
export function getFastCommandCompletions(
  argumentPrefix: string,
): { value: string; label: string }[] {
  const prefix = argumentPrefix.trim().toLowerCase();
  return ["on", "off", "toggle"]
    .filter((option) => option.startsWith(prefix))
    .map((value) => ({ value, label: value }));
}
