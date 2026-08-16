import CryptoKit
import Foundation
import Testing

@testable import RemoteKit

/// The store under multi-peer, and above all the migration: a shipped
/// pairing survives the update only if the peer's public key comes through
/// byte-identical, because the channel key is derived from nothing else.
@Suite("Pairing store", .serialized)
struct PairingStoreTests {
    /// A scratch defaults suite per test, restored afterwards.
    private func withScratchDefaults(_ body: (UserDefaults) throws -> Void) rethrows {
        let name = "test.\(UUID().uuidString)"
        let scratch = UserDefaults(suiteName: name)!
        let previous = PairingStore.defaults
        PairingStore.defaults = scratch
        defer {
            PairingStore.defaults = previous
            scratch.removePersistentDomain(forName: name)
        }
        try body(scratch)
    }

    private func makePeer(
        id: String = "peer-1", role: DeviceRole = .mac, legacy: Bool = false
    ) -> PairedPeer {
        PairedPeer(
            id: id, name: "Test \(id)", role: role,
            pubKeyAgreement: Curve25519.KeyAgreement.PrivateKey().publicKey.rawRepresentation,
            pairedAt: Date(), legacy: legacy
        )
    }

    @Test("Peers round-trip through the store")
    func roundTrip() {
        withScratchDefaults { _ in
            let a = makePeer(id: "a")
            let b = makePeer(id: "b", role: .phone)
            PairingStore.add(a)
            PairingStore.add(b)
            #expect(PairingStore.peers() == [a, b])
            PairingStore.remove("a")
            #expect(PairingStore.peers() == [b])
        }
    }

    @Test("Re-adding the same public key replaces rather than duplicates")
    func rePairReplaces() {
        withScratchDefaults { _ in
            var peer = makePeer(id: "legacy-mac", legacy: true)
            PairingStore.add(peer)
            // The same install re-pairs after updating: new id, same key.
            peer.id = "real-device-id"
            peer.legacy = false
            PairingStore.add(peer)
            #expect(PairingStore.peers().count == 1)
            #expect(PairingStore.peers().first?.id == "real-device-id")
            #expect(PairingStore.peers().first?.legacy == false)
        }
    }

    @Test("The primary peer is the counterpart role")
    func primaryPrefersCounterpart() {
        withScratchDefaults { _ in
            let sameRole = makePeer(id: "same", role: DeviceRole.current)
            let counterpart = makePeer(id: "other", role: DeviceRole.current.peer)
            PairingStore.add(sameRole)
            PairingStore.add(counterpart)
            #expect(PairingStore.primary?.id == "other")
        }
    }

    @Test("Migration preserves the public key byte-for-byte, marked legacy")
    func migration() throws {
        try withScratchDefaults { defaults in
            let keyBytes = Curve25519.KeyAgreement.PrivateKey().publicKey.rawRepresentation
            let old = PairedDevice(
                name: "Old iPhone", role: .phone,
                pubKeyAgreement: keyBytes, pairedAt: Date(timeIntervalSince1970: 1_700_000_000)
            )
            defaults.set(try JSONEncoder().encode(old), forKey: "opencodego.pairedDevice")

            let peers = PairingStore.peers()
            #expect(peers.count == 1)
            let migrated = try #require(peers.first)
            #expect(migrated.pubKeyAgreement == keyBytes, "channel-key derivation depends on this")
            #expect(migrated.legacy)
            #expect(migrated.id == "legacy-phone")
            #expect(migrated.name == "Old iPhone")
            #expect(migrated.pairedAt == old.pairedAt)
            // The old blob survives for downgrade.
            #expect(defaults.data(forKey: "opencodego.pairedDevice") != nil)
        }
    }

    @Test("Migration runs once — an edited list is not re-clobbered")
    func migrationIsOneShot() throws {
        try withScratchDefaults { defaults in
            let old = PairedDevice(
                name: "Old iPhone", role: .phone,
                pubKeyAgreement: Data([1, 2, 3]), pairedAt: Date()
            )
            defaults.set(try JSONEncoder().encode(old), forKey: "opencodego.pairedDevice")
            _ = PairingStore.peers()          // migrates
            PairingStore.remove("legacy-phone")
            #expect(PairingStore.peers().isEmpty, "the legacy blob must not resurrect a removed peer")
        }
    }

    @Test("The load() shim mirrors the primary peer")
    func loadShim() {
        withScratchDefaults { _ in
            #expect(PairingStore.load() == nil)
            let peer = makePeer(role: DeviceRole.current.peer)
            PairingStore.add(peer)
            let shim = PairingStore.load()
            #expect(shim?.name == peer.name)
            #expect(shim?.pubKeyAgreement == peer.pubKeyAgreement)
        }
    }

    // In this suite, not a separate one: it swaps the same global defaults
    // seam, and separate suites run in parallel.
    @Test("DeviceID mints once and stays stable")
    func stableID() {
        withScratchDefaults { _ in
            let first = DeviceID.current
            #expect(DeviceID.current == first)
            #expect(!first.isEmpty)
        }
    }
}

@Suite("Device identity")
struct DeviceIdentityTests {
    @Test("Record names distinguish schemes")
    func recordNames() {
        #expect(DeviceID.recordName(for: "abc") == "device-abc")
        #expect(DeviceRole.mac.recordName == "peer-mac")
        #expect(DeviceRole.phone.recordName == "peer-phone")
        let legacy = PairedPeer(
            id: "legacy-mac", name: "x", role: DeviceRole.current.peer,
            pubKeyAgreement: Data(), pairedAt: Date(), legacy: true
        )
        // A legacy peer is found at the fixed counterpart name; a modern
        // one at its own device record.
        #expect(Punch.recordName(for: legacy) == DeviceRole.current.peer.recordName)
        let modern = PairedPeer(
            id: "abc", name: "x", role: .mac,
            pubKeyAgreement: Data(), pairedAt: Date()
        )
        #expect(Punch.recordName(for: modern) == "device-abc")
    }
}
