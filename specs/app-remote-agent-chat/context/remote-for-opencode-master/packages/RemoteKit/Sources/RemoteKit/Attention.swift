import CloudKit
import Foundation
import OSLog

/// Push without a relay: the Mac writes an `Attention` record to the user's
/// own private CloudKit database, and the phone's CKQuerySubscription turns
/// that into an APNs alert. No server of ours touches the notification path
/// — the same property the whole transport has.
///
/// The payload is deliberately empty of content: the alert text is generic,
/// and the record ID is all the phone receives. On tap it fetches the record
/// (kind, session, directory) over CloudKit and then asks the Mac for the
/// actual pending work over the authenticated channel. Nothing sensitive
/// ever rides a push.
public enum Attention {
    public static let recordType = "Attention"
    public static let subscriptionID = "opencodego-attention"
    private static let logger = Logger(
        subsystem: "com.timwilliams.opencodego", category: "attention"
    )

    private static var db: CKDatabase {
        CKContainer(identifier: Pairing.cloudContainerID).privateCloudDatabase
    }

    /// What the phone learns after fetching the record the push named.
    public struct Info: Sendable {
        /// "permission" | "question" | "failed" | "done"
        public var kind: String
        public var sessionID: String?
        public var directory: String?
        /// Set for permission asks, so a notification action can answer
        /// the exact request without the app having to guess which one.
        public var permissionID: String?
    }

    /// Notification category carrying Allow/Reject actions, used only for
    /// permission asks — the other kinds have nothing to decide.
    public static let permissionCategory = "OPENCODEGO_PERMISSION"
    public static let plainCategory = "OPENCODEGO_ATTENTION"
    public static let allowAction = "OPENCODEGO_ALLOW_ONCE"
    public static let rejectAction = "OPENCODEGO_REJECT"

    // MARK: - Mac: publish

    /// The record published by the previous escalation this run — deleted
    /// before the next one, so records don't pile up. (Records from before
    /// a restart linger until the phone's next fetch sweeps them; a stray
    /// row in the user's own database is harmless.)
    @MainActor private static var lastRecordID: CKRecord.ID?

    /// Tell the phone something needs it. Fire-and-forget: a failed publish
    /// is logged, never fatal — the turn's outcome doesn't depend on the
    /// notification about it.
    @MainActor
    public static func publish(
        kind: String, sessionID: String?, directory: String?, permissionID: String? = nil
    ) {
        let record = CKRecord(recordType: recordType)
        record["kind"] = kind
        record["sessionID"] = sessionID
        record["directory"] = directory
        record["permissionID"] = permissionID
        let previous = lastRecordID
        lastRecordID = record.recordID
        Task {
            do {
                if let previous {
                    _ = try? await db.deleteRecord(withID: previous)
                }
                _ = try await db.save(record)
                logger.notice("published attention: \(kind, privacy: .public)")
            } catch {
                logger.error("attention publish failed: \(error.localizedDescription, privacy: .public)")
            }
        }
    }

    // MARK: - Phone: subscribe

    /// Idempotent: same subscription ID every time, so re-running replaces
    /// rather than duplicates. Seeds the record type first — a query
    /// subscription on a type CloudKit has never seen is an error, and in
    /// the Development environment saving (then deleting) a throwaway
    /// record is what creates the schema.
    /// Two subscriptions, split by kind, because only one of them has
    /// anything to decide: a permission ask gets a category carrying
    /// Allow/Reject actions, everything else gets a plain alert. A single
    /// subscription would put Allow buttons on "the agent finished".
    public static func ensureSubscription() async {
        do {
            // A query subscription on a record type CloudKit has never
            // seen is an error; saving and deleting one creates the schema
            // in the Development environment.
            let seed = CKRecord(recordType: recordType)
            seed["kind"] = "seed"
            seed["permissionID"] = ""
            seed["sessionID"] = ""
            seed["directory"] = ""
            let saved = try await db.save(seed)
            _ = try? await db.deleteRecord(withID: saved.recordID)

            let permission = CKQuerySubscription(
                recordType: recordType,
                predicate: NSPredicate(format: "kind == %@", "permission"),
                subscriptionID: "\(subscriptionID)-permission",
                options: .firesOnRecordCreation
            )
            let permissionNote = CKSubscription.NotificationInfo()
            // Generic on purpose — the command itself never rides a push.
            permissionNote.alertBody = "Your coding agent is waiting for approval."
            permissionNote.soundName = "default"
            permissionNote.category = permissionCategory
            permission.notificationInfo = permissionNote

            let other = CKQuerySubscription(
                recordType: recordType,
                predicate: NSPredicate(format: "kind != %@", "permission"),
                subscriptionID: "\(subscriptionID)-other",
                options: .firesOnRecordCreation
            )
            let otherNote = CKSubscription.NotificationInfo()
            otherNote.alertBody = "Your coding agent needs attention."
            otherNote.soundName = "default"
            otherNote.category = plainCategory
            other.notificationInfo = otherNote

            _ = try await db.modifySubscriptions(
                saving: [permission, other], deleting: [subscriptionID]
            )
            logger.notice("attention subscriptions in place")
        } catch {
            logger.error("attention subscribe failed: \(error.localizedDescription, privacy: .public)")
        }
    }

    /// The tap handler's follow-up: resolve a push's record ID into what
    /// actually needs attention. Deletes the record on read — it's a signal,
    /// not a log.
    public static func resolve(userInfo: [AnyHashable: Any]) async -> Info? {
        guard let note = CKNotification(fromRemoteNotificationDictionary: userInfo)
            as? CKQueryNotification,
            let recordID = note.recordID
        else { return nil }
        guard let record = try? await db.record(for: recordID) else { return nil }
        _ = try? await db.deleteRecord(withID: recordID)
        return Info(
            kind: record["kind"] as? String ?? "permission",
            sessionID: record["sessionID"] as? String,
            directory: record["directory"] as? String,
            permissionID: (record["permissionID"] as? String).flatMap { $0.isEmpty ? nil : $0 }
        )
    }
}
