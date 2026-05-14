export type ScanFunction = (args: {
    incremental: boolean;
}) => Promise<unknown>;
export interface RecoveryProcedureOptions {
    dbDir?: string;
    auditDir?: string;
    now?: () => Date;
    scan?: ScanFunction;
}
export interface RecoveryProcedureResult {
    procedureId: 'CG-RP-001' | 'CG-RP-002' | 'CG-RP-003';
    status: 'ok' | 'failed';
    quarantineDir?: string;
    recoveryDir?: string;
    knownGoodDir?: string;
    restored?: boolean;
    scanIncremental?: boolean;
    integrityCheck?: string;
    stagedFiles?: string[];
    errors: string[];
}
export declare function snapshotKnownGoodTriplet(options?: RecoveryProcedureOptions): string;
export declare function recoverSqliteCorruption(options?: RecoveryProcedureOptions): Promise<RecoveryProcedureResult>;
export declare function recoverPartialScanFailure(options?: RecoveryProcedureOptions & {
    staleFileCount?: number;
    gitHeadDrift?: boolean;
    schemaOrErrorSignal?: boolean;
}): Promise<RecoveryProcedureResult>;
export declare function rollbackBadApply(options?: RecoveryProcedureOptions): Promise<RecoveryProcedureResult>;
export declare function relativizeRecoveryPath(path: string, root?: string): string;
//# sourceMappingURL=recovery-procedures.d.ts.map