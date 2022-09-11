const Type = {
    Alliances: [140, 170],
    Towns: [60, 120],
    Nations: [60, 120],
    Residents: [30, 60],
    News: [20, 60],
    Nearby: {
        Towns: [300, 1200],
        Nations: [600, 1800],
        Players: [2, 15]   
    }
}

class CacheControl {
    header = null
    default = [30, 60]

    constructor(type) {
        this.set(type)
    }

    set = type => this.header = type ?? this.default
    get = () => this.header
}

export {
    Type as CacheType,
    CacheControl
}