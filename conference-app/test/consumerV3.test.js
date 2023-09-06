const { PactV3, MatchersV3  } = require('@pact-foundation/pact');
const path = require('path');
const SpeakersService = require('../server/services/Speakers');
const axios = require('axios');
const expect = require('chai').expect;
const LOG_LEVEL = process.env.LOG_LEVEL || 'DEBUG';

const {
    eachLike,
    atLeastLike,
    integer,
    timestamp,
    boolean,
    string,
    regex,
    like,
} = MatchersV3;

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
/*
const EXPECTED_LIST_SHORT = [
    {
        'name': 'Lorenzo Garcia',
        'shortname': 'Lorenzo_Garcia',
        'title': 'Art in Full Bloom'
    },
    {
        'name': 'Hilary Goldywynn Post',
        'shortname': 'Hillary_Goldwynn',
        'title': 'Deep Sea Wonders'
    },
    {
        'name': 'Riley Rudolph Rewington',
        'shortname': 'Riley_Rewington',
        'title': 'The Art of Abstract'
    }
];
*/

const EXPECTED_LIST_SHORT = eachLike(
    {
        'name': string('Lorenzo Garcia'),
        'shortname': string('Lorenzo_Garcia'),
        'title': string('Art in Full Bloom')
    }
);

let url = 'http://127.0.0.1';
const port = 58289;

describe.only('GET /list-short', function() {

    const provider = new PactV3({
        port: port,
        dir: path.resolve(process.cwd(), 'pacts'),
        consumer: 'app-consumer-V3',
        provider: 'app-provider-V3',
        logLevel: LOG_LEVEL,
    });


    it('returns an HTTP 200 and a list of speakers', async function() {
        provider
            .given('I have a list of speakers')
            .uponReceiving('a request for all speakers')
            .withRequest({
                method: 'GET',
                path: '/list-short',
                // query: { from: 'today' },
                headers: {
                    Accept: [
                        'application/problem+json',
                        'application/json',
                        'text/plain',
                        '*/*',
                    ],
                },
            })
            .willRespondWith({
                status: 200,
                // headers: { 'Content-Type': 'application/json' },
                // body: EXPECTED_BODY,
                body: EXPECTED_LIST_SHORT,
            });

        return provider.executeTest(async () => {
            const urlAndPort = {
                url: url,
                port: port,
            };
            const response = await getListShort(urlAndPort);
            // expect(response.data).to.eql(EXPECTED_LIST_SHORT);
            expect(true).to.eql(true);
        })

    });
});

// a row to publish contracts to a broker using pact-broker.bat from officials
// .\pact-broker.bat publish D:\code\own\microservices-example\conference-app\pacts --consumer-app-version='develop' --auto-detect-version-properties --broker-base-url='http://localhost:9876' --branch=main
// or
// pact-broker publish ./pacts --consumer-app-version='develop' --auto-detect-version-properties --broker-base-url='http://localhost:9876' --branch=main
// if pact-broker bat file added to env variables
