'use strict';

const expect = require('chai').expect;
const path = require('path');
const { Pact, Matchers, Publisher } = require('@pact-foundation/pact');
const LOG_LEVEL = process.env.LOG_LEVEL || 'DEBUG';
const axios = require('axios');

const getListShort = (endpoint) => {
    const url = endpoint.url;
    const port = endpoint.port;

    return axios.request({
        method: 'GET',
        baseURL: `${url}:${port}`,
        url: '/list-short',
        headers: {
            Accept: [
                'application/problem+json',
                'application/json',
                'text/plain',
                '*/*',
            ],
        },
    });
};

const getNames = (endpoint) => {
    const url = endpoint.url;
    const port = endpoint.port;

    return axios.request({
        method: 'GET',
        baseURL: `${url}:${port}`,
        url: '/names',
        headers: {
            Accept: [
                'application/problem+json',
                'application/json',
                'text/plain',
                '*/*',
            ],
        },
    });
};

describe('The Dog API', () => {
    let url = 'http://127.0.0.1';
    const port = 58289;

    const provider = new Pact({
        port: port,
        // log: path.resolve(process.cwd(), 'logs', 'mockserver-integration.log'),
        dir: path.resolve(process.cwd(), 'pacts'),
        spec: 2,
        consumer: 'app-consumer',
        provider: 'app-provider',
        logLevel: LOG_LEVEL,
    });

    const EXPECTED_LIST_SHORT = [
        {
            "name": "Lorenzo Garcia",
            "shortname": "Lorenzo_Garcia",
            "title": "Art in Full Bloom"
        },
        {
            "name": "Hilary Goldywynn Post",
            "shortname": "Hillary_Goldwynn",
            "title": "Deep Sea Wonders"
        },
        {
            "name": "Riley Rudolph Rewington",
            "shortname": "Riley_Rewington",
            "title": "The Art of Abstract"
        }
    ];

    const EXPECTED_NAMES = [
        {
            "name": "Lorenzo Garcia",
            "shortname": "Lorenzo_Garcia"
        },
        {
            "name": "Hilary Goldywynn Post",
            "shortname": "Hillary_Goldwynn"
        },
        {
            "name": "Riley Rudolph Rewington",
            "shortname": "Riley_Rewington"
        }
    ];

    // Set up the provider
    before(() => provider.setup());

    // Write Pact when all tests done
    after(() => provider.finalize());

    // verify with Pact, and reset expectations
    afterEach(() => provider.verify());

    describe('get /list-short', () => {
        before(() => {
            const interaction = {
                state: 'i have a list of speakers',
                uponReceiving: 'a request for all speakers in short format',
                withRequest: {
                    method: 'GET',
                    path: '/list-short',
                    headers: {
                        // Accept: 'application/problem+json, application/json, text/plain, */*', // <- fails, must use array syntax ❌
                        Accept: [
                            'application/problem+json',
                            'application/json',
                            'text/plain',
                            '*/*',
                        ],
                    },
                },
                willRespondWith: {
                    status: 200,
                    // headers: {
                    //     'Content-Type': 'application/json',
                    // },
                    body: EXPECTED_LIST_SHORT,
                },
            };
            return provider.addInteraction(interaction);
        });

        it('returns the correct response', async () => {
            const urlAndPort = {
                url: url,
                port: port,
            };
            const response = await getListShort(urlAndPort);
            expect(response.data).to.eql(EXPECTED_LIST_SHORT);
            expect(true).to.eql(true);
        });


    });

    describe('get /names', () => {
        before(() => {
            const interaction = {
                state: 'i have a names of speakers',
                uponReceiving: 'a request for all names with name and shortname',
                withRequest: {
                    method: 'GET',
                    path: '/names',
                    headers: {
                        // Accept: 'application/problem+json, application/json, text/plain, */*', // <- fails, must use array syntax ❌
                        Accept: [
                            'application/problem+json',
                            'application/json',
                            'text/plain',
                            '*/*',
                        ],
                    },
                },
                willRespondWith: {
                    status: 200,
                    // headers: {
                    //     'Content-Type': 'application/json',
                    // },
                    body: EXPECTED_NAMES,
                },
            };
            return provider.addInteraction(interaction);
        });

        it('returns the correct response 2', async () => {
            const urlAndPort = {
                url: url,
                port: port,
            };
            const response = await getNames(urlAndPort);
            expect(response.data).to.eql(EXPECTED_NAMES);
            expect(true).to.eql(true);
        });
    });
});
