// ───────────────────────────────────────────────────────────────────
// MODULE: better-sqlite3 Ambient Declaration
// ───────────────────────────────────────────────────────────────────

// better-sqlite3 ships no bundled types and @types/better-sqlite3 is not
// installed here, so the two coverage-graph consumers below would
// otherwise fall back to an implicit any. This declares only the
// constructor and instance surface those two files actually call —
// pragma, prepare/get/all/run, exec, close, and transaction — mirroring
// the shape @types/better-sqlite3 itself declares (a class merged with a
// same-named namespace) so `Database.Database` and `Database.Statement`
// resolve as they do in consumer code.

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

    interface Database {
      pragma(source: string): unknown;
      prepare(source: string): Statement;
      exec(source: string): Database;
      close(): Database;
      transaction<Fn extends (...args: readonly unknown[]) => unknown>(fn: Fn): Fn;
    }
  }

  class Database {
    constructor(filename: string);
    pragma(source: string): unknown;
    prepare(source: string): Database.Statement;
    exec(source: string): Database.Database;
    close(): Database.Database;
    transaction<Fn extends (...args: readonly unknown[]) => unknown>(fn: Fn): Fn;
  }

  export = Database;
}
