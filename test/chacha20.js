'use strict';

const {assert, expect} = require('chai');

const {ChaCha20} = require('../lib');

const assertThrow = fn => expect(fn).to.throw;

describe('chaCha20', () => {
    const defaultKey16   = new Buffer(16);
    const defaultKey32   = new Buffer(32);
    const defaultIV8  = new Buffer(8);
    const defaultIV12 = new Buffer(12);

    describe('key, IV', () => {
        const chacha20WithParams = (key, IV) =>
            new ChaCha20(key, IV);

        it ('key: only accept length 16 or 32', () => {
            expect(() => chacha20WithParams(defaultKey16, defaultIV8)).to.not.throw();
            expect(() => chacha20WithParams(defaultKey16, defaultIV12)).to.not.throw();
            expect(() => chacha20WithParams(defaultKey32, defaultIV8)).to.not.throw();
            expect(() => chacha20WithParams(defaultKey32, defaultIV12)).to.not.throw();

            expect(() => chacha20WithParams(new Buffer(123), defaultIV12)).to.throw();
        });

        it ('IV: only accept length 8 or 12', () => {
            expect(() => chacha20WithParams(defaultKey16, defaultIV8)).to.not.throw();
            expect(() => chacha20WithParams(defaultKey16, defaultIV12)).to.not.throw();

            expect(() => chacha20WithParams(defaultKey16, new Buffer(17))).to.throw();
            expect(() => chacha20WithParams(defaultKey16, new Buffer(16))).to.throw();
            expect(() => chacha20WithParams(defaultKey16, new Buffer(32))).to.throw();
        });
    });

    describe('processing vectors', () => {
        let chaCha20;

        const vectors = [
            [new Buffer([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]),
                new Buffer([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]), [
                    new Buffer([0x89, 0x67, 0x09, 0x52, 0x60, 0x83, 0x64, 0xfd, 0x00, 0xb2, 0xf9, 0x09, 0x36, 0xf0, 0x31, 0xc8, 0xe7, 0x56, 0xe1, 0x5d, 0xba, 0x04, 0xb8, 0x49, 0x3d, 0x00, 0x42, 0x92, 0x59, 0xb2, 0x0f, 0x46, 0xcc, 0x04, 0xf1, 0x11, 0x24, 0x6b, 0x6c, 0x2c, 0xe0, 0x66, 0xbe, 0x3b, 0xfb, 0x32, 0xd9, 0xaa, 0x0f, 0xdd, 0xfb, 0xc1, 0x21, 0x23, 0xd4, 0xb9, 0xe4, 0x4f, 0x34, 0xdc, 0xa0, 0x5a, 0x10, 0x3f, ]),
                    new Buffer([0x6c, 0xd1, 0x35, 0xc2, 0x87, 0x8c, 0x83, 0x2b, 0x58, 0x96, 0xb1, 0x34, 0xf6, 0x14, 0x2a, 0x9d, 0x4d, 0x8d, 0x0d, 0x8f, 0x10, 0x26, 0xd2, 0x0a, 0x0a, 0x81, 0x51, 0x2c, 0xbc, 0xe6, 0xe9, 0x75, 0x8a, 0x71, 0x43, 0xd0, 0x21, 0x97, 0x80, 0x22, 0xa3, 0x84, 0x14, 0x1a, 0x80, 0xce, 0xa3, 0x06, 0x2f, 0x41, 0xf6, 0x7a, 0x75, 0x2e, 0x66, 0xad, 0x34, 0x11, 0x98, 0x4c, 0x78, 0x7e, 0x30, 0xad, ])
                ]
            ],

            [new Buffer([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]),
                new Buffer([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]), [
                    new Buffer([0x76, 0xb8, 0xe0, 0xad, 0xa0, 0xf1, 0x3d, 0x90, 0x40, 0x5d, 0x6a, 0xe5, 0x53, 0x86, 0xbd, 0x28, 0xbd, 0xd2, 0x19, 0xb8, 0xa0, 0x8d, 0xed, 0x1a, 0xa8, 0x36, 0xef, 0xcc, 0x8b, 0x77, 0x0d, 0xc7, 0xda, 0x41, 0x59, 0x7c, 0x51, 0x57, 0x48, 0x8d, 0x77, 0x24, 0xe0, 0x3f, 0xb8, 0xd8, 0x4a, 0x37, 0x6a, 0x43, 0xb8, 0xf4, 0x15, 0x18, 0xa1, 0x1c, 0xc3, 0x87, 0xb6, 0x69, 0xb2, 0xee, 0x65, 0x86, ]),
                    new Buffer([0x9f, 0x07, 0xe7, 0xbe, 0x55, 0x51, 0x38, 0x7a, 0x98, 0xba, 0x97, 0x7c, 0x73, 0x2d, 0x08, 0x0d, 0xcb, 0x0f, 0x29, 0xa0, 0x48, 0xe3, 0x65, 0x69, 0x12, 0xc6, 0x53, 0x3e, 0x32, 0xee, 0x7a, 0xed, 0x29, 0xb7, 0x21, 0x76, 0x9c, 0xe6, 0x4e, 0x43, 0xd5, 0x71, 0x33, 0xb0, 0x74, 0xd8, 0x39, 0xd5, 0x31, 0xed, 0x1f, 0x28, 0x51, 0x0a, 0xfb, 0x45, 0xac, 0xe1, 0x0a, 0x1f, 0x4b, 0x79, 0x4d, 0x6f, ])
                ]
            ],

            [new Buffer([0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]),
                new Buffer([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]), [
                    new Buffer([0xae, 0x56, 0x06, 0x0d, 0x04, 0xf5, 0xb5, 0x97, 0x89, 0x7f, 0xf2, 0xaf, 0x13, 0x88, 0xdb, 0xce, 0xff, 0x5a, 0x2a, 0x49, 0x20, 0x33, 0x5d, 0xc1, 0x7a, 0x3c, 0xb1, 0xb1, 0xb1, 0x0f, 0xbe, 0x70, 0xec, 0xe8, 0xf4, 0x86, 0x4d, 0x8c, 0x7c, 0xdf, 0x00, 0x76, 0x45, 0x3a, 0x82, 0x91, 0xc7, 0xdb, 0xeb, 0x3a, 0xa9, 0xc9, 0xd1, 0x0e, 0x8c, 0xa3, 0x6b, 0xe4, 0x44, 0x93, 0x76, 0xed, 0x7c, 0x42, ]),
                    new Buffer([0xfc, 0x3d, 0x47, 0x1c, 0x34, 0xa3, 0x6f, 0xbb, 0xf6, 0x16, 0xbc, 0x0a, 0x0e, 0x7c, 0x52, 0x30, 0x30, 0xd9, 0x44, 0xf4, 0x3e, 0xc3, 0xe7, 0x8d, 0xd6, 0xa1, 0x24, 0x66, 0x54, 0x7c, 0xb4, 0xf7, 0xb3, 0xce, 0xbd, 0x0a, 0x50, 0x05, 0xe7, 0x62, 0xe5, 0x62, 0xd1, 0x37, 0x5b, 0x7a, 0xc4, 0x45, 0x93, 0xa9, 0x91, 0xb8, 0x5d, 0x1a, 0x60, 0xfb, 0xa2, 0x03, 0x5d, 0xfa, 0xa2, 0xa6, 0x42, 0xd5, ])
                ]
            ],

            [new Buffer([0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]),
                new Buffer([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]), [
                    new Buffer([0xc5, 0xd3, 0x0a, 0x7c, 0xe1, 0xec, 0x11, 0x93, 0x78, 0xc8, 0x4f, 0x48, 0x7d, 0x77, 0x5a, 0x85, 0x42, 0xf1, 0x3e, 0xce, 0x23, 0x8a, 0x94, 0x55, 0xe8, 0x22, 0x9e, 0x88, 0x8d, 0xe8, 0x5b, 0xbd, 0x29, 0xeb, 0x63, 0xd0, 0xa1, 0x7a, 0x5b, 0x99, 0x9b, 0x52, 0xda, 0x22, 0xbe, 0x40, 0x23, 0xeb, 0x07, 0x62, 0x0a, 0x54, 0xf6, 0xfa, 0x6a, 0xd8, 0x73, 0x7b, 0x71, 0xeb, 0x04, 0x64, 0xda, 0xc0, ]),
                    new Buffer([0x10, 0xf6, 0x56, 0xe6, 0xd1, 0xfd, 0x55, 0x05, 0x3e, 0x50, 0xc4, 0x87, 0x5c, 0x99, 0x30, 0xa3, 0x3f, 0x6d, 0x02, 0x63, 0xbd, 0x14, 0xdf, 0xd6, 0xab, 0x8c, 0x70, 0x52, 0x1c, 0x19, 0x33, 0x8b, 0x23, 0x08, 0xb9, 0x5c, 0xf8, 0xd0, 0xbb, 0x7d, 0x20, 0x2d, 0x21, 0x02, 0x78, 0x0e, 0xa3, 0x52, 0x8f, 0x1c, 0xb4, 0x85, 0x60, 0xf7, 0x6b, 0x20, 0xf3, 0x82, 0xb9, 0x42, 0x50, 0x0f, 0xce, 0xac, ])
                ]
            ],

            [new Buffer([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]),
                new Buffer([0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]), [
                    new Buffer([0x16, 0x63, 0x87, 0x9e, 0xb3, 0xf2, 0xc9, 0x94, 0x9e, 0x23, 0x88, 0xca, 0xa3, 0x43, 0xd3, 0x61, 0xbb, 0x13, 0x27, 0x71, 0x24, 0x5a, 0xe6, 0xd0, 0x27, 0xca, 0x9c, 0xb0, 0x10, 0xdc, 0x1f, 0xa7, 0x17, 0x8d, 0xc4, 0x1f, 0x82, 0x78, 0xbc, 0x1f, 0x64, 0xb3, 0xf1, 0x27, 0x69, 0xa2, 0x40, 0x97, 0xf4, 0x0d, 0x63, 0xa8, 0x63, 0x66, 0xbd, 0xb3, 0x6a, 0xc0, 0x8a, 0xbe, 0x60, 0xc0, 0x7f, 0xe8, ]),
                    new Buffer([0xb0, 0x57, 0x37, 0x5c, 0x89, 0x14, 0x44, 0x08, 0xcc, 0x74, 0x46, 0x24, 0xf6, 0x9f, 0x7f, 0x4c, 0xcb, 0xd9, 0x33, 0x66, 0xc9, 0x2f, 0xc4, 0xdf, 0xca, 0xda, 0x65, 0xf1, 0xb9, 0x59, 0xd8, 0xc6, 0x4d, 0xfc, 0x50, 0xde, 0x71, 0x1f, 0xb4, 0x64, 0x16, 0xc2, 0x55, 0x3c, 0xc6, 0x0f, 0x21, 0xbb, 0xfd, 0x00, 0x64, 0x91, 0xcb, 0x17, 0x88, 0x8b, 0x4f, 0xb3, 0x52, 0x1c, 0x4f, 0xdd, 0x87, 0x45, ])
                ]
            ],

            [new Buffer([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]),
                new Buffer([0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]), [
                    new Buffer([0xef, 0x3f, 0xdf, 0xd6, 0xc6, 0x15, 0x78, 0xfb, 0xf5, 0xcf, 0x35, 0xbd, 0x3d, 0xd3, 0x3b, 0x80, 0x09, 0x63, 0x16, 0x34, 0xd2, 0x1e, 0x42, 0xac, 0x33, 0x96, 0x0b, 0xd1, 0x38, 0xe5, 0x0d, 0x32, 0x11, 0x1e, 0x4c, 0xaf, 0x23, 0x7e, 0xe5, 0x3c, 0xa8, 0xad, 0x64, 0x26, 0x19, 0x4a, 0x88, 0x54, 0x5d, 0xdc, 0x49, 0x7a, 0x0b, 0x46, 0x6e, 0x7d, 0x6b, 0xbd, 0xb0, 0x04, 0x1b, 0x2f, 0x58, 0x6b, ]),
                    new Buffer([0x53, 0x05, 0xe5, 0xe4, 0x4a, 0xff, 0x19, 0xb2, 0x35, 0x93, 0x61, 0x44, 0x67, 0x5e, 0xfb, 0xe4, 0x40, 0x9e, 0xb7, 0xe8, 0xe5, 0xf1, 0x43, 0x0f, 0x5f, 0x58, 0x36, 0xae, 0xb4, 0x9b, 0xb5, 0x32, 0x8b, 0x01, 0x7c, 0x4b, 0x9d, 0xc1, 0x1f, 0x8a, 0x03, 0x86, 0x3f, 0xa8, 0x03, 0xdc, 0x71, 0xd5, 0x72, 0x6b, 0x2b, 0x6b, 0x31, 0xaa, 0x32, 0x70, 0x8a, 0xfe, 0x5a, 0xf1, 0xd6, 0xb6, 0x90, 0x58, ])
                ]
            ],

            [new Buffer([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]),
                new Buffer([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]), [
                    new Buffer([0x99, 0x29, 0x47, 0xc3, 0x96, 0x61, 0x26, 0xa0, 0xe6, 0x60, 0xa3, 0xe9, 0x5d, 0xb0, 0x48, 0xde, 0x09, 0x1f, 0xb9, 0xe0, 0x18, 0x5b, 0x1e, 0x41, 0xe4, 0x10, 0x15, 0xbb, 0x7e, 0xe5, 0x01, 0x50, 0x39, 0x9e, 0x47, 0x60, 0xb2, 0x62, 0xf9, 0xd5, 0x3f, 0x26, 0xd8, 0xdd, 0x19, 0xe5, 0x6f, 0x5c, 0x50, 0x6a, 0xe0, 0xc3, 0x61, 0x9f, 0xa6, 0x7f, 0xb0, 0xc4, 0x08, 0x10, 0x6d, 0x02, 0x03, 0xee, ]),
                    new Buffer([0x40, 0xea, 0x3c, 0xfa, 0x61, 0xfa, 0x32, 0xa2, 0xfd, 0xa8, 0xd1, 0x23, 0x8a, 0x21, 0x35, 0xd9, 0xd4, 0x17, 0x87, 0x75, 0x24, 0x0f, 0x99, 0x00, 0x70, 0x64, 0xa6, 0xa7, 0xf0, 0xc7, 0x31, 0xb6, 0x7c, 0x22, 0x7c, 0x52, 0xef, 0x79, 0x6b, 0x6b, 0xed, 0x9f, 0x90, 0x59, 0xba, 0x06, 0x14, 0xbc, 0xf6, 0xdd, 0x6e, 0x38, 0x91, 0x7f, 0x3b, 0x15, 0x0e, 0x57, 0x63, 0x75, 0xbe, 0x50, 0xed, 0x67, ])
                ]
            ],

            [new Buffer([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]),
                new Buffer([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]), [
                    new Buffer([0xd9, 0xbf, 0x3f, 0x6b, 0xce, 0x6e, 0xd0, 0xb5, 0x42, 0x54, 0x55, 0x77, 0x67, 0xfb, 0x57, 0x44, 0x3d, 0xd4, 0x77, 0x89, 0x11, 0xb6, 0x06, 0x05, 0x5c, 0x39, 0xcc, 0x25, 0xe6, 0x74, 0xb8, 0x36, 0x3f, 0xea, 0xbc, 0x57, 0xfd, 0xe5, 0x4f, 0x79, 0x0c, 0x52, 0xc8, 0xae, 0x43, 0x24, 0x0b, 0x79, 0xd4, 0x90, 0x42, 0xb7, 0x77, 0xbf, 0xd6, 0xcb, 0x80, 0xe9, 0x31, 0x27, 0x0b, 0x7f, 0x50, 0xeb, ]),
                    new Buffer([0x5b, 0xac, 0x2a, 0xcd, 0x86, 0xa8, 0x36, 0xc5, 0xdc, 0x98, 0xc1, 0x16, 0xc1, 0x21, 0x7e, 0xc3, 0x1d, 0x3a, 0x63, 0xa9, 0x45, 0x13, 0x19, 0xf0, 0x97, 0xf3, 0xb4, 0xd6, 0xda, 0xb0, 0x77, 0x87, 0x19, 0x47, 0x7d, 0x24, 0xd2, 0x4b, 0x40, 0x3a, 0x12, 0x24, 0x1d, 0x7c, 0xca, 0x06, 0x4f, 0x79, 0x0f, 0x1d, 0x51, 0xcc, 0xaf, 0xf6, 0xb1, 0x66, 0x7d, 0x4b, 0xbc, 0xa1, 0x95, 0x8c, 0x43, 0x06, ])
                ]
            ],

            [new Buffer([0x55, 0x55, 0x55, 0x55, 0x55, 0x55, 0x55, 0x55, 0x55, 0x55, 0x55, 0x55, 0x55, 0x55, 0x55, 0x55]),
                new Buffer([0x55, 0x55, 0x55, 0x55, 0x55, 0x55, 0x55, 0x55]), [
                    new Buffer([0x35, 0x7d, 0x7d, 0x94, 0xf9, 0x66, 0x77, 0x8f, 0x58, 0x15, 0xa2, 0x05, 0x1d, 0xcb, 0x04, 0x13, 0x3b, 0x26, 0xb0, 0xea, 0xd9, 0xf5, 0x7d, 0xd0, 0x99, 0x27, 0x83, 0x7b, 0xc3, 0x06, 0x7e, 0x4b, 0x6b, 0xf2, 0x99, 0xad, 0x81, 0xf7, 0xf5, 0x0c, 0x8d, 0xa8, 0x3c, 0x78, 0x10, 0xbf, 0xc1, 0x7b, 0xb6, 0xf4, 0x81, 0x3a, 0xb6, 0xc3, 0x26, 0x95, 0x70, 0x45, 0xfd, 0x3f, 0xd5, 0xe1, 0x99, 0x15, ]),
                    new Buffer([0xec, 0x74, 0x4a, 0x6b, 0x9b, 0xf8, 0xcb, 0xdc, 0xb3, 0x6d, 0x8b, 0x6a, 0x54, 0x99, 0xc6, 0x8a, 0x08, 0xef, 0x7b, 0xe6, 0xcc, 0x1e, 0x93, 0xf2, 0xf5, 0xbc, 0xd2, 0xca, 0xd4, 0xe4, 0x7c, 0x18, 0xa3, 0xe5, 0xd9, 0x4b, 0x56, 0x66, 0x38, 0x2c, 0x6d, 0x13, 0x0d, 0x82, 0x2d, 0xd5, 0x6a, 0xac, 0xb0, 0xf8, 0x19, 0x52, 0x78, 0xe7, 0xb2, 0x92, 0x49, 0x5f, 0x09, 0x86, 0x8d, 0xdf, 0x12, 0xcc, ])
                ]
            ],

            [new Buffer([0x55, 0x55, 0x55, 0x55, 0x55, 0x55, 0x55, 0x55, 0x55, 0x55, 0x55, 0x55, 0x55, 0x55, 0x55, 0x55, 0x55, 0x55, 0x55, 0x55, 0x55, 0x55, 0x55, 0x55, 0x55, 0x55, 0x55, 0x55, 0x55, 0x55, 0x55, 0x55]),
                new Buffer([0x55, 0x55, 0x55, 0x55, 0x55, 0x55, 0x55, 0x55]), [
                    new Buffer([0xbe, 0xa9, 0x41, 0x1a, 0xa4, 0x53, 0xc5, 0x43, 0x4a, 0x5a, 0xe8, 0xc9, 0x28, 0x62, 0xf5, 0x64, 0x39, 0x68, 0x55, 0xa9, 0xea, 0x6e, 0x22, 0xd6, 0xd3, 0xb5, 0x0a, 0xe1, 0xb3, 0x66, 0x33, 0x11, 0xa4, 0xa3, 0x60, 0x6c, 0x67, 0x1d, 0x60, 0x5c, 0xe1, 0x6c, 0x3a, 0xec, 0xe8, 0xe6, 0x1e, 0xa1, 0x45, 0xc5, 0x97, 0x75, 0x01, 0x7b, 0xee, 0x2f, 0xa6, 0xf8, 0x8a, 0xfc, 0x75, 0x80, 0x69, 0xf7, ]),
                    new Buffer([0xe0, 0xb8, 0xf6, 0x76, 0xe6, 0x44, 0x21, 0x6f, 0x4d, 0x2a, 0x34, 0x22, 0xd7, 0xfa, 0x36, 0xc6, 0xc4, 0x93, 0x1a, 0xca, 0x95, 0x0e, 0x9d, 0xa4, 0x27, 0x88, 0xe6, 0xd0, 0xb6, 0xd1, 0xcd, 0x83, 0x8e, 0xf6, 0x52, 0xe9, 0x7b, 0x14, 0x5b, 0x14, 0x87, 0x1e, 0xae, 0x6c, 0x68, 0x04, 0xc7, 0x00, 0x4d, 0xb5, 0xac, 0x2f, 0xce, 0x4c, 0x68, 0xc7, 0x26, 0xd0, 0x04, 0xb1, 0x0f, 0xca, 0xba, 0x86, ])
                ]
            ],

            [new Buffer([0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa]),
                new Buffer([0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa]), [
                    new Buffer([0xfc, 0x79, 0xac, 0xbd, 0x58, 0x52, 0x61, 0x03, 0x86, 0x27, 0x76, 0xaa, 0xb2, 0x0f, 0x3b, 0x7d, 0x8d, 0x31, 0x49, 0xb2, 0xfa, 0xb6, 0x57, 0x66, 0x29, 0x93, 0x16, 0xb6, 0xe5, 0xb1, 0x66, 0x84, 0xde, 0x5d, 0xe5, 0x48, 0xc1, 0xb7, 0xd0, 0x83, 0xef, 0xd9, 0xe3, 0x05, 0x23, 0x19, 0xe0, 0xc6, 0x25, 0x41, 0x41, 0xda, 0x04, 0xa6, 0x58, 0x6d, 0xf8, 0x00, 0xf6, 0x4d, 0x46, 0xb0, 0x1c, 0x87, ]),
                    new Buffer([0x1f, 0x05, 0xbc, 0x67, 0xe0, 0x76, 0x28, 0xeb, 0xe6, 0xf6, 0x86, 0x5a, 0x21, 0x77, 0xe0, 0xb6, 0x6a, 0x55, 0x8a, 0xa7, 0xcc, 0x1e, 0x8f, 0xf1, 0xa9, 0x8d, 0x27, 0xf7, 0x07, 0x1f, 0x83, 0x35, 0xef, 0xce, 0x45, 0x37, 0xbb, 0x0e, 0xf7, 0xb5, 0x73, 0xb3, 0x2f, 0x32, 0x76, 0x5f, 0x29, 0x00, 0x7d, 0xa5, 0x3b, 0xba, 0x62, 0xe7, 0xa4, 0x4d, 0x00, 0x6f, 0x41, 0xeb, 0x28, 0xfe, 0x15, 0xd6, ])
                ]
            ],

            [new Buffer([0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa]),
                new Buffer([0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa, 0xaa]), [
                    new Buffer([0x9a, 0xa2, 0xa9, 0xf6, 0x56, 0xef, 0xde, 0x5a, 0xa7, 0x59, 0x1c, 0x5f, 0xed, 0x4b, 0x35, 0xae, 0xa2, 0x89, 0x5d, 0xec, 0x7c, 0xb4, 0x54, 0x3b, 0x9e, 0x9f, 0x21, 0xf5, 0xe7, 0xbc, 0xbc, 0xf3, 0xc4, 0x3c, 0x74, 0x8a, 0x97, 0x08, 0x88, 0xf8, 0x24, 0x83, 0x93, 0xa0, 0x9d, 0x43, 0xe0, 0xb7, 0xe1, 0x64, 0xbc, 0x4d, 0x0b, 0x0f, 0xb2, 0x40, 0xa2, 0xd7, 0x21, 0x15, 0xc4, 0x80, 0x89, 0x06, ]),
                    new Buffer([0x72, 0x18, 0x44, 0x89, 0x44, 0x05, 0x45, 0xd0, 0x21, 0xd9, 0x7e, 0xf6, 0xb6, 0x93, 0xdf, 0xe5, 0xb2, 0xc1, 0x32, 0xd4, 0x7e, 0x6f, 0x04, 0x1c, 0x90, 0x63, 0x65, 0x1f, 0x96, 0xb6, 0x23, 0xe6, 0x2a, 0x11, 0x99, 0x9a, 0x23, 0xb6, 0xf7, 0xc4, 0x61, 0xb2, 0x15, 0x30, 0x26, 0xad, 0x5e, 0x86, 0x6a, 0x2e, 0x59, 0x7e, 0xd0, 0x7b, 0x84, 0x01, 0xde, 0xc6, 0x3a, 0x09, 0x34, 0xc6, 0xb2, 0xa9, ])
                ]
            ],

            [new Buffer([0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, 0x99, 0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff]),
                new Buffer([0x0f, 0x1e, 0x2d, 0x3c, 0x4b, 0x5a, 0x69, 0x78]), [
                    new Buffer([0xd1, 0xab, 0xf6, 0x30, 0x46, 0x7e, 0xb4, 0xf6, 0x7f, 0x1c, 0xfb, 0x47, 0xcd, 0x62, 0x6a, 0xae, 0x8a, 0xfe, 0xdb, 0xbe, 0x4f, 0xf8, 0xfc, 0x5f, 0xe9, 0xcf, 0xae, 0x30, 0x7e, 0x74, 0xed, 0x45, 0x1f, 0x14, 0x04, 0x42, 0x5a, 0xd2, 0xb5, 0x45, 0x69, 0xd5, 0xf1, 0x81, 0x48, 0x93, 0x99, 0x71, 0xab, 0xb8, 0xfa, 0xfc, 0x88, 0xce, 0x4a, 0xc7, 0xfe, 0x1c, 0x3d, 0x1f, 0x7a, 0x1e, 0xb7, 0xca, ]),
                    new Buffer([0xe7, 0x6c, 0xa8, 0x7b, 0x61, 0xa9, 0x71, 0x35, 0x41, 0x49, 0x77, 0x60, 0xdd, 0x9a, 0xe0, 0x59, 0x35, 0x0c, 0xad, 0x0d, 0xce, 0xdf, 0xaa, 0x80, 0xa8, 0x83, 0x11, 0x9a, 0x1a, 0x6f, 0x98, 0x7f, 0xd1, 0xce, 0x91, 0xfd, 0x8e, 0xe0, 0x82, 0x80, 0x34, 0xb4, 0x11, 0x20, 0x0a, 0x97, 0x45, 0xa2, 0x85, 0x55, 0x44, 0x75, 0xd1, 0x2a, 0xfc, 0x04, 0x88, 0x7f, 0xef, 0x35, 0x16, 0xd1, 0x2a, 0x2c, ])
                ]
            ],

            [new Buffer([0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, 0x99, 0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff, 0xff, 0xee, 0xdd, 0xcc, 0xbb, 0xaa, 0x99, 0x88, 0x77, 0x66, 0x55, 0x44, 0x33, 0x22, 0x11, 0x00]),
                new Buffer([0x0f, 0x1e, 0x2d, 0x3c, 0x4b, 0x5a, 0x69, 0x78]), [
                    new Buffer([0x9f, 0xad, 0xf4, 0x09, 0xc0, 0x08, 0x11, 0xd0, 0x04, 0x31, 0xd6, 0x7e, 0xfb, 0xd8, 0x8f, 0xba, 0x59, 0x21, 0x8d, 0x5d, 0x67, 0x08, 0xb1, 0xd6, 0x85, 0x86, 0x3f, 0xab, 0xbb, 0x0e, 0x96, 0x1e, 0xea, 0x48, 0x0f, 0xd6, 0xfb, 0x53, 0x2b, 0xfd, 0x49, 0x4b, 0x21, 0x51, 0x01, 0x50, 0x57, 0x42, 0x3a, 0xb6, 0x0a, 0x63, 0xfe, 0x4f, 0x55, 0xf7, 0xa2, 0x12, 0xe2, 0x16, 0x7c, 0xca, 0xb9, 0x31, ]),
                    new Buffer([0xfb, 0xfd, 0x29, 0xcf, 0x7b, 0xc1, 0xd2, 0x79, 0xed, 0xdf, 0x25, 0xdd, 0x31, 0x6b, 0xb8, 0x84, 0x3d, 0x6e, 0xde, 0xe0, 0xbd, 0x1e, 0xf1, 0x21, 0xd1, 0x2f, 0xa1, 0x7c, 0xbc, 0x2c, 0x57, 0x4c, 0xcc, 0xab, 0x5e, 0x27, 0x51, 0x67, 0xb0, 0x8b, 0xd6, 0x86, 0xf8, 0xa0, 0x9d, 0xf8, 0x7e, 0xc3, 0xff, 0xb3, 0x53, 0x61, 0xb9, 0x4e, 0xbf, 0xa1, 0x3f, 0xec, 0x0e, 0x48, 0x89, 0xd1, 0x8d, 0xa5, ])
                ]
            ],

            [new Buffer([0xc4, 0x6e, 0xc1, 0xb1, 0x8c, 0xe8, 0xa8, 0x78, 0x72, 0x5a, 0x37, 0xe7, 0x80, 0xdf, 0xb7, 0x35]),
                new Buffer([0x1a, 0xda, 0x31, 0xd5, 0xcf, 0x68, 0x82, 0x21]), [
                    new Buffer([0x82, 0x6a, 0xbd, 0xd8, 0x44, 0x60, 0xe2, 0xe9, 0x34, 0x9f, 0x0e, 0xf4, 0xaf, 0x5b, 0x17, 0x9b, 0x42, 0x6e, 0x4b, 0x2d, 0x10, 0x9a, 0x9c, 0x5b, 0xb4, 0x40, 0x00, 0xae, 0x51, 0xbe, 0xa9, 0x0a, 0x49, 0x6b, 0xee, 0xef, 0x62, 0xa7, 0x68, 0x50, 0xff, 0x3f, 0x04, 0x02, 0xc4, 0xdd, 0xc9, 0x9f, 0x6d, 0xb0, 0x7f, 0x15, 0x1c, 0x1c, 0x0d, 0xfa, 0xc2, 0xe5, 0x65, 0x65, 0xd6, 0x28, 0x96, 0x25, ]),
                    new Buffer([0x5b, 0x23, 0x13, 0x2e, 0x7b, 0x46, 0x9c, 0x7b, 0xfb, 0x88, 0xfa, 0x95, 0xd4, 0x4c, 0xa5, 0xae, 0x3e, 0x45, 0xe8, 0x48, 0xa4, 0x10, 0x8e, 0x98, 0xba, 0xd7, 0xa9, 0xeb, 0x15, 0x51, 0x27, 0x84, 0xa6, 0xa9, 0xe6, 0xe5, 0x91, 0xdc, 0xe6, 0x74, 0x12, 0x0a, 0xca, 0xf9, 0x04, 0x0f, 0xf5, 0x0f, 0xf3, 0xac, 0x30, 0xcc, 0xfb, 0x5e, 0x14, 0x20, 0x4f, 0x5e, 0x42, 0x68, 0xb9, 0x0a, 0x88, 0x04, ])
                ]
            ],
            [new Buffer([0xc4, 0x6e, 0xc1, 0xb1, 0x8c, 0xe8, 0xa8, 0x78, 0x72, 0x5a, 0x37, 0xe7, 0x80, 0xdf, 0xb7, 0x35, 0x1f, 0x68, 0xed, 0x2e, 0x19, 0x4c, 0x79, 0xfb, 0xc6, 0xae, 0xbe, 0xe1, 0xa6, 0x67, 0x97, 0x5d]),
                new Buffer([0x1a, 0xda, 0x31, 0xd5, 0xcf, 0x68, 0x82, 0x21]), [
                    new Buffer([0xf6, 0x3a, 0x89, 0xb7, 0x5c, 0x22, 0x71, 0xf9, 0x36, 0x88, 0x16, 0x54, 0x2b, 0xa5, 0x2f, 0x06, 0xed, 0x49, 0x24, 0x17, 0x92, 0x30, 0x2b, 0x00, 0xb5, 0xe8, 0xf8, 0x0a, 0xe9, 0xa4, 0x73, 0xaf, 0xc2, 0x5b, 0x21, 0x8f, 0x51, 0x9a, 0xf0, 0xfd, 0xd4, 0x06, 0x36, 0x2e, 0x8d, 0x69, 0xde, 0x7f, 0x54, 0xc6, 0x04, 0xa6, 0xe0, 0x0f, 0x35, 0x3f, 0x11, 0x0f, 0x77, 0x1b, 0xdc, 0xa8, 0xab, 0x92, ]),
                    new Buffer([0xe5, 0xfb, 0xc3, 0x4e, 0x60, 0xa1, 0xd9, 0xa9, 0xdb, 0x17, 0x34, 0x5b, 0x0a, 0x40, 0x27, 0x36, 0x85, 0x3b, 0xf9, 0x10, 0xb0, 0x60, 0xbd, 0xf1, 0xf8, 0x97, 0xb6, 0x29, 0x0f, 0x01, 0xd1, 0x38, 0xae, 0x2c, 0x4c, 0x90, 0x22, 0x5b, 0xa9, 0xea, 0x14, 0xd5, 0x18, 0xf5, 0x59, 0x29, 0xde, 0xa0, 0x98, 0xca, 0x7a, 0x6c, 0xcf, 0xe6, 0x12, 0x27, 0x05, 0x3c, 0x84, 0xe4, 0x9a, 0x4a, 0x33, 0x32, ])
                ]
            ]
        ].forEach(([key, iv, results]) =>
            it(`key: ${key.toString('hex')}, IV: ${iv.toString('hex')}`, () => {
                const chacha20 = new ChaCha20(key, iv);

                const round1 = chacha20.process(Buffer(64).fill(0));
                const round2 = chacha20.process(Buffer(64).fill(0));

                assert(round1.equals(results[0]), `round1 should be ${results[0].toString('hex')}`);
                assert(round2.equals(results[1]), `round2 should be ${results[1].toString('hex')}`);
            })
        );
    });
});