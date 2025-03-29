import { RateLimiter } from "limiter";

export const limiter = new RateLimiter({
  tokensPerInterval: 50, // Her dakika 3 istek izni
  interval: "minute",   // Limitleme aralığı
  fireImmediately: true // İlk isteği hemen işleme al
});
