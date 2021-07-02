const get = function() {
    const candidates = [];
    return candidates[Math.floor(Math.random() * candidates.length)];
}
console.log(get());
