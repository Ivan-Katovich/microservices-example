const axios = require('axios');
const url = require('url');
const crypto = require('crypto');
const fs = require('fs');
const util = require('util');

const fsexists = util.promisify(fs.exists);

const CircuitBreaker = require('../lib/circuitBreaker');

const circuitBreaker = new CircuitBreaker();

class SpeakersService {
  constructor({ serviceRegistryUrl, serviceVersionIdentifier }) {
    this.serviceRegistryUrl = serviceRegistryUrl;
    this.serviceVersionIdentifier = serviceVersionIdentifier;
    this.cache = {};
  }

  async getImage(path) {
    const { ip, port } = await this.getService('speakers-service');
    return this.callService({
      method: 'get',
      responseType: 'stream',
      url: `http://${ip}:${port}/images/${path}`,
    });
  }

  async getNames() {
    const { ip, port } = await this.getService('speakers-service');
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/names`,
    });
  }

  async getListShort() {
    const { ip, port } = await this.getService('speakers-service');
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/list-short`,
    });
  }

  async getList() {
    const { ip, port } = await this.getService('speakers-service');
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/list`,
    });
  }

  async getAllArtwork() {
    const { ip, port } = await this.getService('speakers-service');
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/artwork`,
    });
  }

  async getSpeaker(shortname) {
    const { ip, port } = await this.getService('speakers-service');
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/speaker/${shortname}`,
    });
  }

  async getArtworkForSpeaker(shortname) {
    const { ip, port } = await this.getService('speakers-service');
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/artwork/${shortname}`,
    });
  }

  async callService(requestOptions) {
    const dir = `${__dirname}/../../_imagecache`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    const servicePath = url.parse(requestOptions.url).path;
    const cacheKey = crypto.createHash('md5').update(requestOptions.method + servicePath).digest('hex');
    let cacheFile = null;
    if (requestOptions.responseType && requestOptions.responseType === 'stream') {
      cacheFile = `${dir}/${cacheKey}`;
    }
    const result = await circuitBreaker.callService(requestOptions);
    if (!result) {
      if (this.cache[cacheKey]) return this.cache[cacheKey];
      if (cacheFile) {
        const exists = await fsexists(cacheFile);
        if (exists) return fs.createReadStream(cacheFile);
      }
      return false;
    }
    if (!cacheFile) {
      this.cache[cacheKey] = result;
    } else {
      const ws = fs.createWriteStream(cacheFile);
      result.pipe(ws);
    }
    return result;
  }

  async getService(servicename) {
    console.log(this.serviceRegistryUrl);
    console.log(this.serviceVersionIdentifier);
    const response = await axios.get(`${this.serviceRegistryUrl}/find/${servicename}/${this.serviceVersionIdentifier}`);
    return response.data;
  }
}

module.exports = SpeakersService;
