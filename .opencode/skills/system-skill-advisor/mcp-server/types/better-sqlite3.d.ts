// Ambient declaration for the better-sqlite3 surface this package uses. The
// upstream types package used to be borrowed from a sibling skill's
// node_modules; that dependency edge is gone, so the shape lives here.
declare module 'better-sqlite3' {
  namespace Database {
    interface RunResult {
      changes: number;
      lastInsertRowid: number | bigint;
    }

    interface Options {
      readonly?: boolean;
      fileMustExist?: boolean;
      timeout?: number;
      verbose?: ((message?: unknown, ...additionalArgs: unknown[]) => void) | null;
      nativeBinding?: string;
    }

    interface PragmaOptions {
      simple?: boolean;
    }

    interface ColumnDefinition {
      name: string;
      column: string | null;
      table: string | null;
      database: string | null;
      type: string | null;
    }

    interface Statement<BindParameters extends unknown[] = unknown[], Result = unknown> {
      database: Database;
      source: string;
      reader: boolean;
      readonly: boolean;
      busy: boolean;
      run(...params: BindParameters): RunResult;
      get(...params: BindParameters): Result | undefined;
      all(...params: BindParameters): Result[];
      iterate(...params: BindParameters): IterableIterator<Result>;
      pluck(toggleState?: boolean): this;
      expand(toggleState?: boolean): this;
      raw(toggleState?: boolean): this;
      bind(...params: BindParameters): this;
      columns(): ColumnDefinition[];
      safeIntegers(toggleState?: boolean): this;
    }

    interface Transaction<F extends (...args: never[]) => unknown> {
      (...params: Parameters<F>): ReturnType<F>;
      default(...params: Parameters<F>): ReturnType<F>;
      deferred(...params: Parameters<F>): ReturnType<F>;
      immediate(...params: Parameters<F>): ReturnType<F>;
      exclusive(...params: Parameters<F>): ReturnType<F>;
    }

    interface Database {
      memory: boolean;
      readonly: boolean;
      name: string;
      open: boolean;
      inTransaction: boolean;
      prepare<BindParameters extends unknown[] = unknown[], Result = unknown>(source: string): Statement<BindParameters, Result>;
      transaction<F extends (...args: never[]) => unknown>(fn: F): Transaction<F>;
      exec(source: string): this;
      pragma(source: string, options?: PragmaOptions): unknown;
      function(name: string, cb: (...params: unknown[]) => unknown): this;
      function(name: string, options: Record<string, unknown>, cb: (...params: unknown[]) => unknown): this;
      aggregate(name: string, options: Record<string, unknown>): this;
      loadExtension(path: string, entryPoint?: string): this;
      close(): this;
      defaultSafeIntegers(toggleState?: boolean): this;
      unsafeMode(toggleState?: boolean): this;
      backup(destinationFile: string, options?: Record<string, unknown>): Promise<unknown>;
      serialize(options?: Record<string, unknown>): Buffer;
    }

    interface DatabaseConstructor {
      new (filename?: string | Buffer, options?: Options): Database;
      (filename?: string | Buffer, options?: Options): Database;
      prototype: Database;
      SqliteError: typeof SqliteError;
    }
  }

  class SqliteError extends Error {
    name: string;
    message: string;
    code: string;
    constructor(message: string, code: string);
  }

  const Database: Database.DatabaseConstructor;
  export = Database;
}
