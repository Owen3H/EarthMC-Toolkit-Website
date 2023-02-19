import type { NextApiResponse } from 'next'
import LRU from 'lru-cache'

type Options = {
  uniqueTokenPerInterval?: number
  interval?: number
}

function rateLimit(options?: Options) {
  const tokenCache = new LRU({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 20000
  })

  return {
    check: (res: NextApiResponse, limit: number, token: string) => new Promise<void>((resolve, reject) => {
        const tokenCount = (tokenCache.get(token) as number[]) || [0]
        if (tokenCount[0] === 0) tokenCache.set(token, tokenCount)
        
        tokenCount[0] += 1

        const currentUsage = tokenCount[0],
              isRateLimited = currentUsage >= limit,
              remaining = isRateLimited ? 0 : limit - currentUsage

        res.setHeader('X-RateLimit-Limit', limit)
        res.setHeader('X-RateLimit-Remaining', remaining)
        
        return isRateLimited ? reject() : resolve()
    })
  }
}

export default rateLimit
export {
  rateLimit
}