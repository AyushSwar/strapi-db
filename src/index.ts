import { fetchDailyHoroscope } from './util/horoscopeFetcher';

export default {
  register() {},

  bootstrap({ strapi }) {
    strapi.cron.add({
      // UTC time: 15:47 => 9:32 PM NPT
      '47 15 * * *': async () => {
        console.log('🌀 [CRON START] Running horoscope fetch at 9:32 PM NPT...');
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
