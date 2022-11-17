const Type = {
    Alliances: [140, 170],
    Towns: [120, 180],
    Nations: [120, 180],
    News: [20, 60],
    Nearby: {
        Towns: [300, 1200],
        Nations: [600, 1800],
        Players: [2, 15]   
    }
}

class CacheControl {
    #headers = [30, 60]
    #enabled = false

    constructor(type=null) {
        this.set(type)
    }

    get = () => this.#enabled ? this.#headers : [1, 5]
    set = type => {
        this.#enabled = true
        this.#headers = type ?? [30, 60]
    }

    disable = () => this.#enabled = false
    reset = () => this.set(null)
}

export {
    Type as CacheType,
    CacheControl
}