// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CertificateRegistry {

    address public admin;

    mapping(string => bool) private certificateHashes;

    event CertificateStored(string hash, address storedBy);

    constructor() {
        admin = msg.sender;
    }

    function storeCertificate(string memory _hash) public {
        require(!certificateHashes[_hash], "Certificate already exists");
        certificateHashes[_hash] = true;

        emit CertificateStored(_hash, msg.sender);
    }

    function verifyCertificate(string memory _hash) public view returns (bool) {
        return certificateHashes[_hash];
    }
}