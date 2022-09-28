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
    #headers = []
    #enabled = false

    constructor(type) {
        this.set(type)
    }

    reset = () => this.#enabled = false
    get = () => this.#enabled ? this.#headers : [1, 5]
    set = type => {
        this.#headers = type ?? [30, 60]
        this.#enabled = true
    }
}

export {
    Type as CacheType,
    CacheControl
}