import axios from 'axios';

const zodiacSigns = [
  'aries', 'taurus', 'gemini', 'cancer',
  'leo', 'virgo', 'libra', 'scorpio',
  'sagittarius', 'capricorn', 'aquarius', 'pisces',
];

const headers = {
  'X-Rapidapi-Key': process.env.RAPIDAPI_KEY || '',
  'X-Rapidapi-Host': 'horoscope19.p.rapidapi.com',
};

const checkIfExists = async (strapi: any, uid: string, where: Record<string, any>): Promise<boolean> => {
  const entries = await strapi.entityService.findMany(uid, {
    filters: where,
  });
  return entries.length > 0;
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().split('T')[0];
};

export const fetchDailyHoroscope = async (strapi: any) => {
  for (const sign of zodiacSigns) {
    try {
      const res = await axios.get('https://horoscope19.p.rapidapi.com/get-horoscope/daily', {
        params: { sign, day: 'today' },
        headers,
      });

      const data = res.data.data;
      const formattedDate = formatDate(data.date);
      if (!formattedDate) {
        console.error(`Invalid date format for sign ${sign}:`, data.date);
        continue;
      }

      // Find existing record
      const existing = await strapi.entityService.findMany('api::daily-horoscope.daily-horoscope', {
        filters: { sign, date: formattedDate },
      });

      if (existing.length > 0) {
        // Update existing record
        await strapi.entityService.update('api::daily-horoscope.daily-horoscope', existing[0].id, {
          data: {
            horoscope_data: data.horoscope_data,
          },
        });
        console.log(`Updated horoscope for ${sign} on ${formattedDate}`);
      } else {
        // Create new record if none exists
        await strapi.entityService.create('api::daily-horoscope.daily-horoscope', {
          data: {
            sign,
            date: formattedDate,
            horoscope_data: data.horoscope_data,
          },
        });
        console.log(`Created horoscope for ${sign} on ${formattedDate}`);
      }
    } catch (error) {
      console.error(`Failed to fetch/update horoscope for ${sign}:`, error);
    }
  }
};

