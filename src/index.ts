import { fetchDailyHoroscope } from './util/horoscopeFetcher';

export default {
  register() {},

  bootstrap({ strapi }) {
    strapi.cron.add({
      '15 21 * * *': async () => {
        console.log('🌀 [CRON START] Running horoscope fetch at 9:15 PM NPT...');
        try {
          await fetchDailyHoroscope(strapi);
          console.log('✅ Horoscope fetched and saved.');
        } catch (e) {
          console.error('❌ Horoscope fetch failed:', e);
        }
        console.log('🌀 [CRON END]');
      },
    });
  },
};
