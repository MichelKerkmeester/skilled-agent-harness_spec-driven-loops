import CloudKit
import CryptoKit
import Foundation
import OSLog
import Security
#if os(iOS)
import UIKit
#endif

/// Device pairing, ported from the validated Phase-0 spike (pairing-spike/).
///
/// Scope in the app: pairing establishes *identity* — each device keeps a
/// Curve25519 private key in its local keychain, exchanges public halves
/// through the shared-Apple-ID CloudKit private database, and the user
/// confirms a 6-digit code shown on both screens. The derived shared secret
/// then authenticates and encrypts the LAN channel (see Wire).
///
/// The same rendezvous record then carries the devices' address candidates,
/// so the cross-network transport (see Punch) has somewhere to meet without
/// a server of ours in the middle. Pairing itself needs none of that —
/// CloudKit is the rendezvous for both.
public enum Pairing {
    public static let cloudContainerID = "iCloud.com.timwilliams.opencodego"
    static let keychainService = "com.timwilliams.opencodego"
}

// MARK: - Roles and records

public enum DeviceRole: String, Codable, Sendable {
    case mac
    case phone

    /// The fixed record name of the pre-multi-peer scheme ("peer-mac" /
    /// "peer-phone"). Still written and read for `legacy` peers — a 1.1
    /// companion in the wild knows no other rendezvous.
    var recordName: String { "peer-\(rawValue)" }
    public var peer: DeviceRole { self == .mac ? .phone : .mac }

    /// The role this build plays.
    public static var current: DeviceRole {
        #if os(macOS)
        .mac
        #else
        .phone
        #endif
    }

    /// The word for a device of this role on someone else's screen.
    public var noun: String { self == .mac ? "Mac" : "iPhone" }
}

/// A stable identity per install, minted once. This is what lets any
/// number of devices share one Apple ID: each publishes its own
/// `device-<id>` record instead of fighting over a fixed name per role.
public enum DeviceID {
    static let key = "opencodego.deviceID"

    public static var current: String {
        if let id = PairingStore.defaults.string(forKey: key) { return id }
        let id = UUID().uuidString
        PairingStore.defaults.set(id, forKey: key)
        return id
    }

    /// The CloudKit record name for a device id.
    public static func recordName(for id: String) -> String { "device-\(id)" }
}

/// What this device calls itself on the other one's screen.
public enum DeviceIdentity {
    public static var name: String {
        #if os(macOS)
        Host.current().localizedName ?? "Mac"
        #else
        UIDevice.current.name
        #endif
    }
}

struct PeerRecord {
    var deviceName: String
    var role: DeviceRole
    var pubKeyAgreement: Data
    var pubKeySigning: Data
    var heartbeatAt: Date
    var approvedAt: Date?
    /// "ip:port" candidates this device can currently be reached at — its
    /// LAN addresses plus the reflexive one STUN reported. Empty until the
    /// device has published any.
    var endpoints: [String] = []
    /// Set by a client when it starts dialling, so the server knows to
    /// punch back now rather than at its next lazy poll.
    var connectRequestedAt: Date?
    /// The publisher's stable install id. Absent on records written by
    /// pre-multi-peer builds — which is exactly how a legacy peer is
    /// recognised during pairing.
    var deviceID: String?
}

public enum PairingError: Error, LocalizedError {
    case keychain(OSStatus)
    case notPaired
    case network(String)

    public var errorDescription: String? {
        switch self {
        case let .keychain(s): return "keychain error \(s)"
        case .notPaired: return "No paired device."
        case let .network(m): return m
        }
    }
}

// MARK: - Key material

/// Device-local key material. Private keys are generic-password keychain
/// items, non-synchronizable — only public halves ever reach CloudKit.
enum PairingKeyStore {
    static func agreementKey() throws -> Curve25519.KeyAgreement.PrivateKey {
        if let data = try read(tag: "pairing.agreement") {
            return try Curve25519.KeyAgreement.PrivateKey(rawRepresentation: data)
        }
        let key = Curve25519.KeyAgreement.PrivateKey()
        try write(tag: "pairing.agreement", data: key.rawRepresentation)
        return key
    }

    static func signingKey() throws -> Curve25519.Signing.PrivateKey {
        if let data = try read(tag: "pairing.signing") {
            return try Curve25519.Signing.PrivateKey(rawRepresentation: data)
        }
        let key = Curve25519.Signing.PrivateKey()
        try write(tag: "pairing.signing", data: key.rawRepresentation)
        return key
    }

    private static func query(tag: String) -> [String: Any] {
        [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: Pairing.keychainService,
            kSecAttrAccount as String: tag,
        ]
    }

    private static func read(tag: String) throws -> Data? {
        var q = query(tag: tag)
        q[kSecReturnData as String] = true
        var out: CFTypeRef?
        let status = SecItemCopyMatching(q as CFDictionary, &out)
        if status == errSecItemNotFound { return nil }
        // -25293: the item exists but this binary may not read it. On macOS
        // that means the keychain ACL was written by a differently-signed
        // build of this app — a re-sign, a move, an unsigned local build.
        //
        // An unreadable private key is a dead pairing by definition: the
        // channel key can't be derived, so nothing can authenticate with it
        // ever again. Holding onto it would leave the user stuck at an
        // error with no way forward, including through the re-pair that
        // would otherwise fix everything. So drop it and mint a fresh one;
        // the peer's records are rewritten by the next pairing anyway.
        if status == errSecAuthFailed || status == errSecInteractionNotAllowed {
            SecItemDelete(query(tag: tag) as CFDictionary)
            return nil
        }
        guard status == errSecSuccess else { throw PairingError.keychain(status) }
        return out as? Data
    }

    private static func write(tag: String, data: Data) throws {
        var q = query(tag: tag)
        q[kSecValueData as String] = data
        q[kSecAttrAccessible as String] = kSecAttrAccessibleAfterFirstUnlock
        var status = SecItemAdd(q as CFDictionary, nil)
        if status == errSecDuplicateItem {
            // A leftover we just failed to read, or a partial write. The
            // add is the authority here, so replace rather than keep.
            SecItemDelete(query(tag: tag) as CFDictionary)
            status = SecItemAdd(q as CFDictionary, nil)
        }
        guard status == errSecSuccess else {
            throw PairingError.keychain(status)
        }
    }

    /// Forget this device's key material entirely, so the next pairing
    /// starts from new keys. Used by unpair — a re-pair that reuses a key
    /// the peer has already rejected is not a fresh start.
    static func reset() {
        for tag in ["pairing.agreement", "pairing.signing"] {
            SecItemDelete(query(tag: tag) as CFDictionary)
        }
    }
}

// MARK: - Session crypto

/// X25519 → HKDF channel key, plus the 6-digit short-auth string both
/// screens display during pairing.
public struct PairingCrypto {
    public let channelKey: SymmetricKey
    public let sas: String

    init(myKey: Curve25519.KeyAgreement.PrivateKey, peerPub: Data) throws {
        let peer = try Curve25519.KeyAgreement.PublicKey(rawRepresentation: peerPub)
        let secret = try myKey.sharedSecretFromKeyAgreement(with: peer)
        channelKey = secret.hkdfDerivedSymmetricKey(
            using: SHA256.self,
            salt: Data("opencodego-v1".utf8),
            sharedInfo: Data("channel".utf8),
            outputByteCount: 32
        )
        sas = Self.shortAuthString(myKey.publicKey.rawRepresentation, peerPub)
    }

    /// Order-independent 6-digit code over both public keys. Matching
    /// numbers on both screens rules out a rendezvous-level MITM.
    static func shortAuthString(_ a: Data, _ b: Data) -> String {
        let sorted = [a, b].sorted { $0.lexicographicallyPrecedes($1) }
        let digest = SHA256.hash(data: sorted[0] + sorted[1])
        let n = digest.withUnsafeBytes { $0.load(as: UInt32.self).bigEndian }
        return String(format: "%06d", n % 1_000_000)
    }
}

// MARK: - Persisted pairing state

/// The pre-multi-peer persisted shape, kept for migration and for the few
/// call sites that still think in terms of "the" peer.
public struct PairedDevice: Codable, Equatable {
    public var name: String
    public var role: DeviceRole
    public var pubKeyAgreement: Data
    public var pairedAt: Date
}

/// One paired peer among possibly several. The peer's public key is public
/// data, so UserDefaults is fine; the channel key is re-derived from the
/// keychain private key on demand rather than stored.
public struct PairedPeer: Codable, Equatable, Identifiable, Sendable {
    /// The peer's `DeviceID`. Peers migrated from (or paired with) a
    /// pre-multi-peer build get a synthetic `legacy-<role>` id.
    public var id: String
    public var name: String
    public var role: DeviceRole
    public var pubKeyAgreement: Data
    public var pairedAt: Date
    /// True when this peer rendezvouses through the old fixed record names
    /// (`peer-mac`/`peer-phone`) because it runs a pre-multi-peer build.
    /// Dies naturally when the peer is re-paired after updating.
    public var legacy: Bool

    public init(
        id: String, name: String, role: DeviceRole,
        pubKeyAgreement: Data, pairedAt: Date, legacy: Bool = false
    ) {
        self.id = id
        self.name = name
        self.role = role
        self.pubKeyAgreement = pubKeyAgreement
        self.pairedAt = pairedAt
        self.legacy = legacy
    }
}

public enum PairingStore {
    /// Injectable for tests; the app never touches it.
    nonisolated(unsafe) static var defaults = UserDefaults.standard

    private static let legacyKey = "opencodego.pairedDevice"
    private static let peersKey = "opencodego.pairedPeers"
    private static let everKey = "opencodego.hasEverPaired"
    public static let changed = Notification.Name("PairingStore.changed")

    /// Whether this device has *ever* completed a pairing, which is not the
    /// same question as whether it is paired now and deliberately survives
    /// `clear()`.
    ///
    /// It exists to decide who needs selling to. Someone who has never paired
    /// may not know the Mac app exists, and the phone's connect screen is the
    /// only place that can tell them. Someone who has paired before knows
    /// exactly what they are missing and is looking at that screen because
    /// something is broken or they unpaired on purpose — pitching the product
    /// to them is noise sitting between them and the fix.
    public static var hasEverPaired: Bool {
        defaults.bool(forKey: everKey)
    }

    // MARK: The peer list

    public static func peers() -> [PairedPeer] {
        migrateIfNeeded()
        guard let data = defaults.data(forKey: peersKey) else { return [] }
        return (try? JSONDecoder().decode([PairedPeer].self, from: data)) ?? []
    }

    /// Adds or replaces (same id, or same public key — a re-pair of the
    /// same install under a new id must not leave the old entry behind).
    public static func add(_ peer: PairedPeer) {
        var list = peers().filter {
            $0.id != peer.id && $0.pubKeyAgreement != peer.pubKeyAgreement
        }
        list.append(peer)
        persist(list)
        defaults.set(true, forKey: everKey)
    }

    public static func remove(_ id: String) {
        persist(peers().filter { $0.id != id })
    }

    public static func clear() {
        defaults.removeObject(forKey: peersKey)
        defaults.removeObject(forKey: legacyKey)
        NotificationCenter.default.post(name: changed, object: nil)
    }

    /// The peer the single-peer call sites mean: the counterpart role's
    /// first entry (the phone's Mac; the Mac's phone), falling back to
    /// anything at all.
    public static var primary: PairedPeer? {
        let list = peers()
        return list.first { $0.role == DeviceRole.current.peer } ?? list.first
    }

    /// Transitional shim over `primary` for pre-multi-peer call sites.
    public static func load() -> PairedDevice? {
        guard let peer = primary else { return nil }
        return PairedDevice(
            name: peer.name, role: peer.role,
            pubKeyAgreement: peer.pubKeyAgreement, pairedAt: peer.pairedAt
        )
    }

    // MARK: Channel keys

    /// The symmetric key shared with the primary peer.
    public static func channelKey() throws -> SymmetricKey {
        guard let peer = primary else { throw PairingError.notPaired }
        return try channelKey(for: peer)
    }

    /// The symmetric key shared with one specific peer, derived fresh from
    /// the local private key and that peer's stored public key.
    public static func channelKey(for peer: PairedPeer) throws -> SymmetricKey {
        let mine = try PairingKeyStore.agreementKey()
        return try PairingCrypto(myKey: mine, peerPub: peer.pubKeyAgreement).channelKey
    }

    // MARK: Migration

    /// The single-device blob becomes a one-entry list, `legacy: true`,
    /// with the public key bytes preserved exactly — that byte identity is
    /// what keeps the shipped pairing authenticating with no user action.
    /// The old blob stays behind (harmless) so a downgrade still works.
    private static func migrateIfNeeded() {
        guard defaults.data(forKey: peersKey) == nil,
              let data = defaults.data(forKey: legacyKey),
              let old = try? JSONDecoder().decode(PairedDevice.self, from: data)
        else { return }
        let migrated = PairedPeer(
            id: "legacy-\(old.role.rawValue)",
            name: old.name, role: old.role,
            pubKeyAgreement: old.pubKeyAgreement,
            pairedAt: old.pairedAt, legacy: true
        )
        if let encoded = try? JSONEncoder().encode([migrated]) {
            defaults.set(encoded, forKey: peersKey)
        }
    }

    private static func persist(_ list: [PairedPeer]) {
        if let data = try? JSONEncoder().encode(list) {
            defaults.set(data, forKey: peersKey)
        }
        NotificationCenter.default.post(name: changed, object: nil)
    }
}

// MARK: - CloudKit rendezvous

/// Thin CloudKit private-database client for the rendezvous records.
final class PairingCloud: Sendable {
    private let db = CKContainer(identifier: Pairing.cloudContainerID).privateCloudDatabase

    func accountStatus() async throws -> CKAccountStatus {
        try await CKContainer(identifier: Pairing.cloudContainerID).accountStatus()
    }

    /// Which parts of our record a write is responsible for.
    ///
    /// Two independent things now write this record: the pairing screen and
    /// the transport's candidate publisher. They run at the same time on a
    /// phone that is pairing, and a blanket write from either would erase the
    /// other's fields — an approval lost this way stalls pairing forever, and
    /// erased candidates make the Mac punch at nothing. So every write names
    /// what it owns, and leaves the rest of the record alone.
    struct Fields: OptionSet {
        let rawValue: Int
        /// Name and public keys. Always written: whichever writer creates the
        /// record first must leave something the peer can identify.
        static let identity = Fields(rawValue: 1 << 0)
        static let approval = Fields(rawValue: 1 << 1)
        static let endpoints = Fields(rawValue: 1 << 2)
        static let connectRequest = Fields(rawValue: 1 << 3)
    }

    /// Upsert our own DevicePeer record (fetch-modify-save; retries once on
    /// a lost conflict since we are the only writer of our own record).
    ///
    /// Always writes the modern `device-<id>` record and keeps this device
    /// listed in the directory. When `includeLegacy`, the old fixed-name
    /// record is written too — the only rendezvous a pre-multi-peer peer
    /// knows to look at.
    func upsertSelf(_ me: PeerRecord, fields: Fields, includeLegacy: Bool = false) async throws {
        var mine = me
        mine.deviceID = DeviceID.current
        try await upsert(mine, fields: fields, recordName: DeviceID.recordName(for: DeviceID.current))
        await ensureListed(DeviceID.current)
        if includeLegacy {
            // The legacy record carries no deviceID on purpose: its absence
            // is how *we* recognise legacy records, and an old build would
            // simply ignore the field anyway — better to keep the two
            // schemes visibly distinct.
            var legacy = me
            legacy.deviceID = nil
            try await upsert(legacy, fields: fields, recordName: me.role.recordName)
        }
    }

    private func upsert(_ me: PeerRecord, fields: Fields, recordName: String) async throws {
        let id = CKRecord.ID(recordName: recordName)
        let record: CKRecord
        if let existing = try? await db.record(for: id) {
            record = existing
        } else {
            record = CKRecord(recordType: "DevicePeer", recordID: id)
        }
        apply(me, fields: fields, to: record)
        do {
            _ = try await db.save(record)
        } catch let e as CKError where e.code == .serverRecordChanged {
            if let server = e.serverRecord {
                apply(me, fields: fields, to: server)
                _ = try await db.save(server)
            }
        }
    }

    private func apply(_ me: PeerRecord, fields: Fields, to record: CKRecord) {
        record["deviceName"] = me.deviceName
        record["role"] = me.role.rawValue
        record["pubKeyAgreement"] = me.pubKeyAgreement
        record["pubKeySigning"] = me.pubKeySigning
        record["heartbeatAt"] = me.heartbeatAt
        record["deviceID"] = me.deviceID
        if fields.contains(.approval) { record["approvedAt"] = me.approvedAt }
        if fields.contains(.endpoints) { record["endpoints"] = me.endpoints }
        if fields.contains(.connectRequest) {
            record["connectRequestedAt"] = me.connectRequestedAt
        }
    }

    // MARK: The directory

    /// One well-known record lists every live device id, because fetching
    /// by name needs no queryable indexes — the same reasoning that chose
    /// fixed names originally, kept under the new scheme.
    private static let directoryName = "device-directory"

    private func directoryIDs() async -> [String] {
        guard let record = try? await db.record(
            for: CKRecord.ID(recordName: Self.directoryName)
        ) else { return [] }
        return record["deviceIDs"] as? [String] ?? []
    }

    /// Fetch-modify-save with a union merge on conflict: several devices
    /// legitimately edit the directory at once.
    private func editDirectory(_ edit: @escaping ([String]) -> [String]) async {
        let id = CKRecord.ID(recordName: Self.directoryName)
        let record: CKRecord
        if let existing = try? await db.record(for: id) {
            record = existing
        } else {
            record = CKRecord(recordType: "DevicePeer", recordID: id)
        }
        let current = record["deviceIDs"] as? [String] ?? []
        let edited = edit(current)
        guard edited != current else { return }
        record["deviceIDs"] = edited
        do {
            _ = try await db.save(record)
        } catch let e as CKError where e.code == .serverRecordChanged {
            if let server = e.serverRecord {
                let theirs = server["deviceIDs"] as? [String] ?? []
                server["deviceIDs"] = Array(Set(edit(theirs)).union(theirs)).sorted()
                _ = try? await db.save(server)
            }
        } catch {
            Punch.logger.error("directory write failed: \(error.localizedDescription, privacy: .public)")
        }
    }

    private func ensureListed(_ deviceID: String) async {
        await editDirectory { ids in
            ids.contains(deviceID) ? ids : ids + [deviceID]
        }
    }

    func delist(_ deviceID: String) async {
        await editDirectory { ids in ids.filter { $0 != deviceID } }
    }

    // MARK: Reading peers

    /// Every other device's record, via the directory. Records that fail to
    /// parse or list ourselves are skipped.
    func fetchPeers() async -> [PeerRecord] {
        var out: [PeerRecord] = []
        for id in await directoryIDs() where id != DeviceID.current {
            if let record = try? await fetchPeer(named: DeviceID.recordName(for: id)) {
                out.append(record)
            }
        }
        return out
    }

    /// One record by name, nil until it exists.
    func fetchPeer(named recordName: String) async throws -> PeerRecord? {
        let id = CKRecord.ID(recordName: recordName)
        do {
            let r = try await db.record(for: id)
            guard
                let name = r["deviceName"] as? String,
                let roleRaw = r["role"] as? String,
                let role = DeviceRole(rawValue: roleRaw),
                let agree = r["pubKeyAgreement"] as? Data,
                let sign = r["pubKeySigning"] as? Data,
                let beat = r["heartbeatAt"] as? Date
            else { return nil }
            return PeerRecord(
                deviceName: name,
                role: role,
                pubKeyAgreement: agree,
                pubKeySigning: sign,
                heartbeatAt: beat,
                approvedAt: r["approvedAt"] as? Date,
                endpoints: r["endpoints"] as? [String] ?? [],
                connectRequestedAt: r["connectRequestedAt"] as? Date,
                deviceID: r["deviceID"] as? String
            )
        } catch let e as CKError where e.code == .unknownItem {
            return nil
        }
    }

    /// The counterpart's legacy fixed-name record, nil until it exists.
    func fetchPeer(of role: DeviceRole) async throws -> PeerRecord? {
        try await fetchPeer(named: role.peer.recordName)
    }

    /// Remove one peer's rendezvous state after an unpair.
    func remove(peer: PairedPeer) async {
        if peer.legacy {
            // The legacy scheme has exactly two records; a legacy unpair
            // wipes the pair of them, matching the old behavior.
            _ = try? await db.deleteRecord(withID: CKRecord.ID(recordName: peer.role.recordName))
            _ = try? await db.deleteRecord(withID: CKRecord.ID(recordName: DeviceRole.current.recordName))
        } else {
            _ = try? await db.deleteRecord(
                withID: CKRecord.ID(recordName: DeviceID.recordName(for: peer.id))
            )
            await delist(peer.id)
        }
    }

    /// Remove everything this scheme has ever written, so a future pairing
    /// starts clean: both legacy names, our own device record, and every
    /// directory entry we can see.
    func reset() async {
        for role in [DeviceRole.mac, .phone] {
            _ = try? await db.deleteRecord(withID: CKRecord.ID(recordName: role.recordName))
        }
        for id in await directoryIDs() {
            _ = try? await db.deleteRecord(
                withID: CKRecord.ID(recordName: DeviceID.recordName(for: id))
            )
        }
        _ = try? await db.deleteRecord(
            withID: CKRecord.ID(recordName: DeviceID.recordName(for: DeviceID.current))
        )
        _ = try? await db.deleteRecord(withID: CKRecord.ID(recordName: Self.directoryName))
    }
}

// MARK: - Session state machine

/// Runs one pairing attempt while its screen is visible: publish own record,
/// poll for the peer, show the SAS, and — once both sides have approved —
/// persist the peer and stop. Both apps drive the same machine.
@MainActor
public final class PairingSession: ObservableObject {
    public enum Phase: Equatable {
        case idle
        case initializing
        /// iCloud unavailable; message explains what to do.
        case noICloud(String)
        case waitingForPeer
        case peerFound(name: String, sas: String)
        case waitingForPeerApproval(name: String, sas: String)
        case paired(name: String)
        case failed(String)
    }

    @Published public private(set) var phase: Phase = .idle

    private let role = DeviceRole.current
    private let cloud = PairingCloud()
    private var agreementKey: Curve25519.KeyAgreement.PrivateKey?
    private var crypto: PairingCrypto?
    private var peer: PeerRecord?
    private var approvedLocally = false
    private var loop: Task<Void, Never>?
    private static let logger = Logger(
        subsystem: "com.timwilliams.opencodego", category: "pairing"
    )

    public init() {}

    public var deviceName: String { DeviceIdentity.name }

    public func start() {
        guard loop == nil else { return }
        approvedLocally = false
        crypto = nil
        peer = nil
        phase = .initializing
        loop = Task { await run() }
    }

    public func stop() {
        loop?.cancel()
        loop = nil
        if case .paired = phase {} else { phase = .idle }
    }

    public func approve() {
        approvedLocally = true
        if case let .peerFound(name, sas) = phase {
            phase = .waitingForPeerApproval(name: name, sas: sas)
        }
        Task { try? await publishSelf() }
    }

    /// Forget one paired peer and remove its rendezvous state. Removing the
    /// last peer resets the key material too — a device with no pairings
    /// should start its next one from fresh keys, and leaving old keys
    /// behind is what turns "unpair and try again" into a re-pair that
    /// still can't read its own key. With other peers remaining the keys
    /// must obviously stay: they are those pairings.
    public func unpair(_ peer: PairedPeer) {
        PairingStore.remove(peer.id)
        stop()
        if PairingStore.peers().isEmpty {
            PairingKeyStore.reset()
            PairingStore.clear()
            Task { await cloud.reset() }
        } else {
            Task { await cloud.remove(peer: peer) }
        }
    }

    /// Forget every pairing and wipe the rendezvous clean.
    public func unpairAll() {
        PairingStore.clear()
        PairingKeyStore.reset()
        stop()
        Task { await cloud.reset() }
    }

    private func run() async {
        do {
            let status = try await cloud.accountStatus()
            guard status == .available else {
                phase = .noICloud(
                    "Sign into iCloud on this device — pairing uses your iCloud account to find your other device, and only ever shares public keys."
                )
                return
            }
            agreementKey = try PairingKeyStore.agreementKey()
            try await publishSelf()
            phase = .waitingForPeer
            Self.logger.notice("published \(self.role.rawValue, privacy: .public) record; waiting for \(self.role.peer.rawValue, privacy: .public)")

            while !Task.isCancelled {
                try await tick()
                if case .paired = phase { return }
                try await Task.sleep(for: .seconds(3))
            }
        } catch is CancellationError {
            // stopped by the screen going away — not a failure
        } catch {
            phase = .failed(error.localizedDescription)
        }
    }

    private func tick() async throws {
        guard let agreementKey else { return }
        guard let found = await scanForCandidate() else {
            try await publishSelf()
            return
        }
        // A record with a stale heartbeat is a leftover, not a live pairing
        // attempt — pairing requires both apps open, so demand freshness
        // before showing a name or honoring an approval.
        let fresh = Date().timeIntervalSince(found.heartbeatAt) < 120
        if peer?.pubKeyAgreement != found.pubKeyAgreement {
            crypto = try PairingCrypto(myKey: agreementKey, peerPub: found.pubKeyAgreement)
            Self.logger.notice("peer '\(found.deviceName, privacy: .public)' found (heartbeat \(fresh ? "fresh" : "stale", privacy: .public), \(found.deviceID == nil ? "legacy" : "modern", privacy: .public))")
        }
        peer = found
        guard let crypto, fresh else {
            try await publishSelf()
            return
        }

        switch phase {
        case .waitingForPeer:
            phase = .peerFound(name: found.deviceName, sas: crypto.sas)
        case .peerFound, .waitingForPeerApproval:
            if approvedLocally, found.approvedAt != nil {
                complete(with: found)
                return
            }
        default:
            break
        }
        try await publishSelf()
    }

    /// The device on the other side of this pairing attempt: any *fresh*
    /// record that isn't a peer we already hold — the directory's modern
    /// records first, then the legacy fixed name, which is all a
    /// pre-multi-peer build ever writes. Ties go to the freshest heartbeat:
    /// pairing means "the device whose screen is open right now".
    private func scanForCandidate() async -> PeerRecord? {
        let known = Set(PairingStore.peers().map(\.pubKeyAgreement))
        var candidates = await cloud.fetchPeers()
            .filter { !known.contains($0.pubKeyAgreement) }
        if let legacy = try? await cloud.fetchPeer(of: role),
           !known.contains(legacy.pubKeyAgreement),
           !candidates.contains(where: { $0.pubKeyAgreement == legacy.pubKeyAgreement }) {
            candidates.append(legacy)
        }
        return candidates.max { $0.heartbeatAt < $1.heartbeatAt }
    }

    private func complete(with found: PeerRecord) {
        PairingStore.add(PairedPeer(
            id: found.deviceID ?? "legacy-\(found.role.rawValue)",
            name: found.deviceName,
            role: found.role,
            pubKeyAgreement: found.pubKeyAgreement,
            pairedAt: Date(),
            legacy: found.deviceID == nil
        ))
        phase = .paired(name: found.deviceName)
        Self.logger.notice("paired with '\(found.deviceName, privacy: .public)'")
        loop?.cancel()
        loop = nil
    }

    private func publishSelf() async throws {
        guard let agreementKey else { return }
        // Legacy included while pairing: a 1.1 companion only ever looks at
        // the fixed name, and this is the one moment we must be findable by
        // whatever is out there.
        try await cloud.upsertSelf(PeerRecord(
            deviceName: deviceName,
            role: role,
            pubKeyAgreement: agreementKey.publicKey.rawRepresentation,
            pubKeySigning: (try PairingKeyStore.signingKey()).publicKey.rawRepresentation,
            heartbeatAt: Date(),
            approvedAt: approvedLocally ? Date() : nil
        ), fields: [.identity, .approval], includeLegacy: true)
    }
}
