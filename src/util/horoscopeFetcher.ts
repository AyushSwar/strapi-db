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
        console.error(`Invalid date format received for sign ${sign}:`, data.date);
        continue;
      }

      const exists = await checkIfExists(strapi, 'api::daily-horoscope.daily-horoscope', {
        sign,
        date: formattedDate,
      });

      if (!exists) {
        await strapi.entityService.create('api::daily-horoscope.daily-horoscope', {
          data: {
            sign,
            date: formattedDate,
            horoscope_data: data.horoscope_data,
          },
        });
      }
    } catch (err) {
      console.error(`Daily fetch failed for ${sign}:`, err);
    }
  }
};

export const fetchWeeklyHoroscope = async (strapi: any) => {
  for (const sign of zodiacSigns) {
    try {
      const res = await axios.get('https://horoscope19.p.rapidapi.com/get-horoscope/weekly', {
        params: { sign },
        headers,
      });

      const data = res.data.data;
      const exists = await checkIfExists(strapi, 'api::weekly-horoscope.weekly-horoscope', {
        sign,
        week: data.week,
      });

      if (!exists) {
        await strapi.entityService.create('api::weekly-horoscope.weekly-horoscope', {
          data: {
            sign,
            week: data.week,
            horoscope_data: data.horoscope_data,
          },
        });
      }
    } catch (err) {
      console.error(`Weekly fetch failed for ${sign}:`, err);
    }
  }
};

export const fetchMonthlyHoroscope = async (strapi: any) => {
  for (const sign of zodiacSigns) {
    try {
      const res = await axios.get('https://horoscope19.p.rapidapi.com/get-horoscope/monthly', {
        params: { sign },
        headers,
      });

      const data = res.data.data;
      const exists = await checkIfExists(strapi, 'api::monthly-horoscope.monthly-horoscope', {
        sign,
        month: data.month,
      });

      if (!exists) {
        await strapi.entityService.create('api::monthly-horoscope.monthly-horoscope', {
          data: {
            sign,
            month: data.month,
            horoscope_data: data.horoscope_data,
            standout_days: data.standout_days,
            challenging_days: data.challenging_days,
          },
        });
      }
    } catch (err) {
      console.error(`Monthly fetch failed for ${sign}:`, err);
    }
  }
};
