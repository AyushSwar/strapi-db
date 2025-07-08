import {
    fetchDailyHoroscope,
    fetchWeeklyHoroscope,
    fetchMonthlyHoroscope,
  } from '../util/horoscopeFetcher';
  
  export default {
    // Daily at 00:05 AM UTC (5 minutes after new UTC day starts)
    '5 0 * * *': async ({ strapi }) => {
      console.log('⏰ [UTC] Running daily horoscope fetch...');
      await fetchDailyHoroscope(strapi);
    },
  
    // Weekly on Monday at 00:10 AM UTC
    '10 0 * * 1': async ({ strapi }) => {
      console.log('⏰ [UTC] Running weekly horoscope fetch...');
      await fetchWeeklyHoroscope(strapi);
    },
  
    // Monthly on the 1st at 00:15 AM UTC
    '15 0 1 * *': async ({ strapi }) => {
      console.log('⏰ [UTC] Running monthly horoscope fetch...');
      await fetchMonthlyHoroscope(strapi);
    },
  };
  