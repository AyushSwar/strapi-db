import { fetchDailyHoroscope } from './util/horoscopeFetcher';

export default {
  register() {},

  bootstrap({ strapi }) {
    strapi.cron.add({
      // UTC time: 06:35 => 12:20 PM NPT
      '35 6 * * *': async () => {
        console.log('🌀 [CRON START] Running horoscope fetch at 12:20 PM NPT...');
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
