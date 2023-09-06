const expect = require('chai').expect;
const path = require('path');
const { Verifier } = require('@pact-foundation/pact');
const axios = require('axios');

const getService = async (servicename) => {
    const response = await axios.get(`http://127.0.0.1:3000/find/${servicename}/1.0.0`);
    return response.data;
}

// (2) Verify that the provider meets all consumer expectations
describe('Pact Verification', function() {
    it('validates the expectations of Matching Service', async function() {
        const service = await getService('speakers-service');

        let token = 'INVALID TOKEN';

        return new Verifier({
            logLevel: 'debug',
            pactBrokerUrl: 'http://localhost:9876',
            provider: 'app-provider-V3',
            // consumerVersionTags: ['1.0.0'],
            consumerVersionSelectors: [
                {latest: true},
                // {tag: 'develop'},
            ],
            publishVerificationResult: true,
            providerVersion: '1.0.0',
            providerBaseUrl: `http://${service.ip}:${service.port}`, // <- location of your running provider
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
