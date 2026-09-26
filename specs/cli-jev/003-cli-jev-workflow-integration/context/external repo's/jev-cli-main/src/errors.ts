/** Process exit codes. Stable: scripts may depend on them. */
export const EXIT = {
  /** Command completed and no `--fail-on` condition matched. */
  OK: 0,
  /** Usage, configuration, input, or transport error. */
  ERROR: 1,
  /** Command completed; a `--fail-on` judgment condition matched. */
  JUDGMENT: 2,
} as const;

/** An error the CLI can present to the user without a stack trace. */
export class CliError extends Error {
  readonly exitCode: number;
  constructor(message: string, exitCode: number = EXIT.ERROR) {
    super(message);
    this.name = "CliError";
    this.exitCode = exitCode;
  }
}

/** Reduce an unknown thrown value to a printable message. */
export function describeError(err: unknown): string {
  if (err instanceof Error) {
    const extra = (err as { status?: number; requestId?: string }).status
      ? ` (HTTP ${(err as { status?: number }).status})`
      : "";
    return `${err.message}${extra}`;
  }
  return String(err);
}
