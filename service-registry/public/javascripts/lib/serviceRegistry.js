const moment = require('moment');
const semver = require('semver');

class ServiceRegistry {
    constructor(logger) {
        this.logger = logger;
        this.services = {};
        this.timeout = 30;
    }

    get(name, version) {
        this.cleanup();
        const candidates = Object.values(this.services)
            .filter(service => service.name === name && semver.satisfies(service.version, version));
        this.logger.log('INFO', `Get any appropriate service with ${name}, version ${version}`);
        return candidates[Math.floor(Math.random() * candidates.length)];
    }

    register(name, version, ip, port) {
        this.cleanup();
        const key = name + version + ip + port;
        if (!this.services[key]) {
            this.services[key] = {
                timestamp: parseInt(moment().format('X')),
                ip,
                port,
                name,
                version
            };
            this.logger.log('INFO', `Added service ${name}, version ${version}, at address ${ip}:${port}`);
        } else {
            this.services[key].timestamp = parseInt(moment().format('X'));
            this.logger.log('INFO', `Updated service ${name}, version ${version}, at address ${ip}:${port}`);
        }
        return key;
    }

    unregister(name, version, ip, port) {
        const key = name + version + ip + port;
        delete this.services[key];
        this.logger.log('INFO', `Unregistered service ${name}, version ${version}, at address ${ip}:${port}`);
        return key;
    }

    cleanup() {
        const now = parseInt(moment().format('X'));
        Object.keys(this.services).forEach((key) => {
            console.log();
            if (this.services[key].timestamp + this.timeout < now) {
                delete this.services[key];
                this.logger.log('INFO', `Removed service ${key}`);
            }
        })
    }
}

module.exports = ServiceRegistry;
