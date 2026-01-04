// Base44 IA o'chirildi. O'yinlar lokal rejimda.
export const base44 = {
  createClient: () => ({
    collection: (name) => ({
      get: async () => ({ data: name === "PlayerProgress" ? [{ total_stars: 17, xp_points: 890, current_level: 6 }] : [] }),
      update: async () => ({ success: true }),
      on: () => () => {} 
    })
  })
};