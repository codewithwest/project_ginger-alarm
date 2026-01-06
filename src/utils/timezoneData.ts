// Common timezone list organized by region
export const timezoneData = {
   "Africa": [
      "Africa/Cairo", "Africa/Johannesburg", "Africa/Lagos", "Africa/Nairobi",
      "Africa/Casablanca", "Africa/Tunis", "Africa/Algiers", "Africa/Accra"
   ],
   "America": [
      "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
      "America/Phoenix", "America/Anchorage", "America/Toronto", "America/Vancouver",
      "America/Mexico_City", "America/Sao_Paulo", "America/Buenos_Aires",
      "America/Lima", "America/Bogota", "America/Caracas", "America/Santiago",
      "America/Havana", "America/Panama"
   ],
   "Asia": [
      "Asia/Dubai", "Asia/Tokyo", "Asia/Shanghai", "Asia/Hong_Kong",
      "Asia/Singapore", "Asia/Seoul", "Asia/Bangkok", "Asia/Jakarta",
      "Asia/Manila", "Asia/Kolkata", "Asia/Karachi", "Asia/Tehran",
      "Asia/Baghdad", "Asia/Jerusalem", "Asia/Riyadh", "Asia/Taipei"
   ],
   "Atlantic": [
      "Atlantic/Reykjavik", "Atlantic/Azores", "Atlantic/Cape_Verde"
   ],
   "Australia": [
      "Australia/Sydney", "Australia/Melbourne", "Australia/Brisbane",
      "Australia/Perth", "Australia/Adelaide", "Australia/Darwin"
   ],
   "Europe": [
      "Europe/London", "Europe/Paris", "Europe/Berlin", "Europe/Rome",
      "Europe/Madrid", "Europe/Amsterdam", "Europe/Brussels", "Europe/Vienna",
      "Europe/Stockholm", "Europe/Copenhagen", "Europe/Oslo", "Europe/Helsinki",
      "Europe/Warsaw", "Europe/Prague", "Europe/Athens", "Europe/Istanbul",
      "Europe/Moscow", "Europe/Zurich", "Europe/Dublin", "Europe/Lisbon"
   ],
   "Pacific": [
      "Pacific/Auckland", "Pacific/Fiji", "Pacific/Honolulu", "Pacific/Guam",
      "Pacific/Port_Moresby", "Pacific/Tongatapu", "Pacific/Tahiti"
   ]
};

// Get formatted timezone with offset
export const getTimezoneWithOffset = (timezone: string): string => {
   try {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('en-US', {
         timeZone: timezone,
         timeZoneName: 'short'
      });

      const parts = formatter.formatToParts(now);
      const offsetPart = parts.find(p => p.type === 'timeZoneName');
      const offset = offsetPart ? offsetPart.value : '';

      // Get current time in that timezone
      const timeFormatter = new Intl.DateTimeFormat('en-US', {
         timeZone: timezone,
         hour: '2-digit',
         minute: '2-digit',
         hour12: false
      });
      const currentTime = timeFormatter.format(now);

      return `${timezone} (${offset}) - ${currentTime}`;
   } catch (e) {
      return timezone;
   }
};

// Get all timezones as flat array
export const getAllTimezones = (): string[] => {
   return Object.values(timezoneData).flat();
};
