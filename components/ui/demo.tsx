import { EconomicCalendar, EconomicEvent } from '@/components/ui/economic-calendar';

const eventsData: EconomicEvent[] = [
  {
    countryCode: 'US',
    time: '21:30',
    eventName: '15-Year Mortgage Rate',
    actual: '10:59',
    forecast: null,
    prior: '5.49%',
    impact: 'medium',
  },
  {
    countryCode: 'US',
    time: '21:30',
    eventName: '30-Year Mortgage Rate',
    actual: '10:59',
    forecast: null,
    prior: '6.3%',
    impact: 'high',
  },
  {
    countryCode: 'EU',
    time: '22:30',
    eventName: 'ECB Guindos Speech',
    actual: null,
    forecast: null,
    prior: null,
    impact: 'low',
  },
  {
    countryCode: 'CA',
    time: '23:10',
    eventName: 'BoC Mendes Speech',
    actual: null,
    forecast: null,
    prior: null,
    impact: 'low',
  },
  {
    countryCode: 'JP',
    time: '23:50',
    eventName: 'BoJ Core CPI y/y',
    actual: '2.8%',
    forecast: '2.9%',
    prior: '3.1%',
    impact: 'high',
  },
  {
    countryCode: 'AU',
    time: '01:00',
    eventName: 'RBA Financial Stability Review',
    actual: null,
    forecast: null,
    prior: null,
    impact: 'medium',
  },
];

export default function EconomicCalendarDemo() {
  return (
    <div className="w-full bg-[#1a1d29] flex items-center justify-center py-12">
      <EconomicCalendar title="Economic Calendar" events={eventsData} />
    </div>
  );
}
