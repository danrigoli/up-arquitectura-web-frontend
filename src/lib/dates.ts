import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export interface IHoursLeft {
  date: Date;
  minuteLeftMessage?: string;
  hoursLeftMessage?: string;
}
export function hoursLeft({
  date,
  minuteLeftMessage = 'mins left',
  hoursLeftMessage = 'hrs left',
}: IHoursLeft) {
  const currentDate = dayjs();
  const futureDate = dayjs(date);

  const timeDiff = futureDate.diff(currentDate); // Difference in milliseconds
  const duration = dayjs.duration(timeDiff);

  const hoursLeft = duration.hours(); // Convert difference to hours
  if (hoursLeft < 1) {
    const minLeft = duration.minutes();
    return ` ${minLeft} ${minuteLeftMessage}`;
  }
  return ` ${hoursLeft} ${hoursLeftMessage}`;
}

export function durationFromSeconds(seconds: number) {
  const duration = dayjs.duration(seconds, 'seconds');
  return `${duration.hours()}h ${duration.minutes()}m`;
}
