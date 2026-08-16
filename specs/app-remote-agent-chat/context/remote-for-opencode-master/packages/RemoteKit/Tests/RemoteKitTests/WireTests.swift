import CryptoKit
import Foundation
import Testing

@testable import RemoteKit

/// The protocol layer. These are the things that, if wrong, break the
/// product silently rather than loudly: a frame that splits in the wrong
/// place, a seal that opens something it shouldn't, a compressed body
/// mistaken for JSON.
@Suite("Wire protocol")
struct WireTests {
    @Test("Framer splits on newlines and holds partial frames")
    func framing() {
        var framer = LineFramer()
        #expect(framer.push(Data("{\"a\":1}".utf8)).isEmpty, "no frame until the newline")
        let frames = framer.push(Data("\n{\"b\":2}\n".utf8))
        #expect(frames.count == 2)
        #expect(String(data: frames[0], encoding: .utf8) == "{\"a\":1}")
        #expect(String(data: frames[1], encoding: .utf8) == "{\"b\":2}")
    }

    @Test("Framer survives a frame arriving one byte at a time")
    func framingByteByByte() {
        var framer = LineFramer()
        var out: [Data] = []
        for byte in Data("hello\nworld\n".utf8) {
            out.append(contentsOf: framer.push(Data([byte])))
        }
        #expect(out.count == 2)
        #expect(String(data: out[1], encoding: .utf8) == "world")
    }

    @Test("Sealed frames round-trip and carry their newline")
    func sealRoundTrip() throws {
        let channel = Wire.SecureChannel(key: SymmetricKey(size: .bits256))
        let plaintext = Data("{\"kind\":\"ready\"}".utf8)
        let sealed = try #require(channel.seal(plaintext))
        #expect(sealed.last == 0x0A, "framing depends on the trailing newline")
        let opened = try #require(channel.open(sealed.dropLast()))
        #expect(opened == plaintext)
    }

    @Test("A frame sealed with another key does not open")
    func sealRejectsWrongKey() throws {
        let sealed = try #require(
            Wire.SecureChannel(key: SymmetricKey(size: .bits256))
                .seal(Data("secret".utf8))
        )
        let other = Wire.SecureChannel(key: SymmetricKey(size: .bits256))
        #expect(other.open(sealed.dropLast()) == nil)
    }

    @Test("Tampering with ciphertext is detected")
    func sealDetectsTampering() throws {
        let channel = Wire.SecureChannel(key: SymmetricKey(size: .bits256))
        var sealed = Array(try #require(channel.seal(Data("secret".utf8))).dropLast())
        sealed[sealed.count / 2] ^= 0xFF
        #expect(channel.open(Data(sealed)) == nil)
    }

    @Test("Auth tag verifies only for the exact challenge it answered")
    func authTagBinding() {
        let key = SymmetricKey(size: .bits256)
        let tag = Wire.Security.authTag(
            channelKey: key, serverNonce: "S", clientNonce: "C", name: "iPhone"
        )
        #expect(Wire.Security.verify(
            tag: tag, channelKey: key, serverNonce: "S", clientNonce: "C", name: "iPhone"
        ))
        // Every input is bound: a replayed tag against a fresh challenge
        // must fail, or the handshake stops meaning anything.
        #expect(!Wire.Security.verify(
            tag: tag, channelKey: key, serverNonce: "S2", clientNonce: "C", name: "iPhone"
        ))
        #expect(!Wire.Security.verify(
            tag: tag, channelKey: key, serverNonce: "S", clientNonce: "C2", name: "iPhone"
        ))
        #expect(!Wire.Security.verify(
            tag: tag, channelKey: key, serverNonce: "S", clientNonce: "C", name: "iPad"
        ))
        #expect(!Wire.Security.verify(
            tag: tag, channelKey: SymmetricKey(size: .bits256),
            serverNonce: "S", clientNonce: "C", name: "iPhone"
        ))
    }

    @Test("Session keys differ per connection")
    func sessionKeyMixesBothNonces() {
        let channel = SymmetricKey(size: .bits256)
        let a = Wire.Security.sessionKey(channelKey: channel, serverNonce: "S1", clientNonce: "C")
        let b = Wire.Security.sessionKey(channelKey: channel, serverNonce: "S2", clientNonce: "C")
        #expect(a != b, "a replayed transcript must not decrypt")
    }

    @Test("Compression round-trips and marks itself")
    func squeezeRoundTrip() throws {
        let big = Data(String(repeating: "streaming reasoning text. ", count: 500).utf8)
        let packed = Wire.Squeeze.pack(big)
        #expect(packed.count < big.count)
        #expect(packed.first == 0x00, "the marker is what tells the peer to inflate")
        #expect(Wire.Squeeze.unpack(packed) == big)
    }

    @Test("Small payloads pass through uncompressed")
    func squeezeLeavesSmallAlone() {
        let small = Data("{\"kind\":\"token\"}".utf8)
        let packed = Wire.Squeeze.pack(small)
        #expect(packed == small, "deflate overhead beats its savings below the threshold")
        #expect(Wire.Squeeze.unpack(packed) == small)
    }

    @Test("A JSON frame is never mistaken for a compressed one")
    func squeezeMarkerCannotCollideWithJSON() {
        // The marker is 0x00 precisely because no JSON frame can begin
        // with it — '{' is 0x7B.
        let json = Data("{\"kind\":\"ready\"}".utf8)
        #expect(json.first != Wire.Squeeze.marker)
        #expect(Wire.Squeeze.unpack(json) == json)
    }

    @Test("Requests and events survive a JSON round trip")
    func codableRoundTrip() throws {
        var request = Wire.Request(kind: "prompt")
        request.project = "/Users/x/repo"
        request.text = "hello"
        request.agent = "plan"
        request.attachments = [Attachment(name: "a.png", mime: "image/png", data: "AAA=")]
        let decoded = try JSONDecoder().decode(
            Wire.Request.self, from: JSONEncoder().encode(request)
        )
        #expect(decoded.kind == "prompt")
        #expect(decoded.agent == "plan")
        #expect(decoded.attachments?.first?.mime == "image/png")
    }

    @Test("Unknown fields from a newer peer decode cleanly")
    func forwardCompatibility() throws {
        // The whole version-skew strategy rests on this: an older build
        // must ignore what it doesn't know rather than fail the frame.
        let json = Data("""
        {"kind":"prompt","text":"hi","somethingFromTheFuture":{"a":1}}
        """.utf8)
        let decoded = try JSONDecoder().decode(Wire.Request.self, from: json)
        #expect(decoded.text == "hi")
    }
}

/// The server's multi-key trust decision, at the crypto layer it rests on:
/// an auth tag identifies its key among candidates, and only its key. This
/// is what lets one Mac serve its paired phone and its own loopback
/// workspace on the same listener without either being able to pose as
/// the other.
@Suite("Trust keyring")
struct TrustKeyringTests {
    private let serverNonce = Wire.Security.nonce()
    private let clientNonce = Wire.Security.nonce()

    private func tag(_ key: SymmetricKey, name: String = "Workspace") -> String {
        Wire.Security.authTag(
            channelKey: key, serverNonce: serverNonce,
            clientNonce: clientNonce, name: name
        )
    }

    private func match(_ tag: String, in candidates: [SymmetricKey], name: String = "Workspace") -> Int? {
        candidates.firstIndex { key in
            Wire.Security.verify(
                tag: tag, channelKey: key,
                serverNonce: serverNonce, clientNonce: clientNonce, name: name
            )
        }
    }

    @Test("A tag picks out exactly its own key among candidates")
    func identifiesKey() {
        let loopback = SymmetricKey(size: .bits256)
        let channel = SymmetricKey(size: .bits256)
        #expect(match(tag(loopback), in: [loopback, channel]) == 0)
        #expect(match(tag(channel), in: [loopback, channel]) == 1)
    }

    @Test("A stranger's tag matches no candidate")
    func refusesStranger() {
        let candidates = [SymmetricKey(size: .bits256), SymmetricKey(size: .bits256)]
        #expect(match(tag(SymmetricKey(size: .bits256)), in: candidates) == nil)
    }

    @Test("The tag binds the claimed name")
    func bindsName() {
        let key = SymmetricKey(size: .bits256)
        let honest = tag(key, name: "Workspace")
        #expect(match(honest, in: [key], name: "Impostor") == nil)
    }
}
