// ───────────────────────────────────────────────────────────────────
// MODULE: better-sqlite3 Ambient Declaration
// ───────────────────────────────────────────────────────────────────

// better-sqlite3 ships no bundled types and @types/better-sqlite3 is not
// installed in this dependency root, so the status index would otherwise
// fall back to an implicit any. This declares only the surface the index
// calls, in the shape @types/better-sqlite3 uses (a class merged with a
// same-named namespace), the same way the deep-loop runtime declares it.

declare module 'better-sqlite3' {
  namespace Database {
    interface RunResult {
      readonly changes: number;
      readonly lastInsertRowid: number | bigint;
    }

    interface Statement {
      get(...params: readonly unknown[]): unknown;
      all(...params: readonly unknown[]): unknown[];
      run(...params: readonly unknown[]): RunResult;
    }

    interface Options {
      readonly?: boolean;
      fileMustExist?: boolean;
      timeout?: number;
    }

    interface Database {
      pragma(source: string, options?: { simple?: boolean }): unknown;
      prepare(source: string): Statement;
      exec(source: string): Database;
      close(): Database;
      transaction<Fn extends (...args: never[]) => unknown>(fn: Fn): Fn;
    }
  }

  class Database {
    constructor(filename: string, options?: Database.Options);
    pragma(source: string, options?: { simple?: boolean }): unknown;
    prepare(source: string): Database.Statement;
    exec(source: string): Database.Database;
    close(): Database.Database;
    transaction<Fn extends (...args: never[]) => unknown>(fn: Fn): Fn;
  }

  export = Database;
}
