const expect = require('chai').expect;
const path = require('path');
const { Verifier } = require('@pact-foundation/pact');

// (2) Verify that the provider meets all consumer expectations
describe('Pact Verification', function() {
    it('validates the expectations of Matching Service', function() {
        let token = 'INVALID TOKEN';

        return new Verifier({
            logLevel: 'debug',
            pactBrokerUrl: 'http://localhost:9876',
            // pactBroker: 'http://localhost:9876',
            provider: 'app-provider-V3',
            // consumerVersionTags: ['latest'],
            // consumerVersionTags: ['1.0.0'],
            consumerVersionSelectors: [
                {latest: true},
                // {tag: 'develop'},
            ],
            publishVerificationResult: true,
            providerVersion: '1.0.0',
            providerBaseUrl: 'http://127.0.0.1:58289', // <- location of your running provider
            // pactUrls: [ path.resolve(process.cwd(), './pacts/app-consumer-app-provider.json') ],
            // pactUrls: [ 'http://localhost:9876/pacts/provider/app-provider/consumer/app-consumer/latest' ],
            // pactUrls: [ 'http://localhost:9876/pacts/provider/app-provider-V3/consumer/app-consumer-V3/latest' ],
        })
            .verifyProvider()
            .then(() => {
                console.log('Pact Verification Complete!');
            });
    });
});
