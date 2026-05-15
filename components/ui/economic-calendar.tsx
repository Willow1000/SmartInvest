"use client";

import * as React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface EconomicEvent {
  countryCode: string;
  time: string;
  eventName: string;
  actual: string | null;
  forecast: string | null;
  prior: string | null;
  impact: 'high' | 'medium' | 'low';
  imageUrl?: string;
}

interface EconomicCalendarProps {
  title: string;
  events: EconomicEvent[];
  className?: string;
}

const VolatilityIcon = ({ impact }: { impact: EconomicEvent['impact'] }) => {
  const barCount = impact === 'high' ? 3 : impact === 'medium' ? 2 : 1;

  return (
    <div className="flex items-end gap-0.5 h-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            'w-1 rounded-full',
            i === 0 ? 'h-2' : i === 1 ? 'h-3' : 'h-4',
            i < barCount ? 'bg-[#4a9d7e]' : 'bg-gray-600/60'
          )}
        />
      ))}
    </div>
  );
};

export const EconomicCalendar = React.forwardRef<HTMLDivElement, EconomicCalendarProps>(
  ({ title, events, className }, ref) => {
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);
    const [hoveredCardIndex, setHoveredCardIndex] = React.useState<number | null>(null);
    const [focusedCardIndex, setFocusedCardIndex] = React.useState<number | null>(null);
    const [selectedCardIndex, setSelectedCardIndex] = React.useState<number | null>(null);

    const isAutoPaused =
      hoveredCardIndex !== null || focusedCardIndex !== null || selectedCardIndex !== null;

    const loopedEvents = React.useMemo(() => {
      if (events.length <= 1) {
        return events;
      }
      return [...events, ...events];
    }, [events]);

    const normalizeInfinitePosition = React.useCallback(() => {
      const container = scrollContainerRef.current;
      if (!container || events.length <= 1) {
        return;
      }

      const midpoint = container.scrollWidth / 2;

      if (container.scrollLeft >= midpoint) {
        container.scrollLeft -= midpoint;
      } else if (container.scrollLeft <= 0) {
        container.scrollLeft += midpoint;
      }
    }, [events.length]);

    const handleScroll = React.useCallback(() => {
      normalizeInfinitePosition();
    }, [normalizeInfinitePosition]);

    React.useEffect(() => {
      const container = scrollContainerRef.current;
      if (!container || events.length <= 1) {
        return;
      }

      const setupId = window.requestAnimationFrame(() => {
        container.scrollLeft = container.scrollWidth / 4;
        handleScroll();
      });

      return () => {
        window.cancelAnimationFrame(setupId);
      };
    }, [events.length, handleScroll]);

    React.useEffect(() => {
      const container = scrollContainerRef.current;
      if (!container) {
        return;
      }

      container.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('resize', handleScroll);
      handleScroll();

      return () => {
        container.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleScroll);
      };
    }, [handleScroll]);

    React.useEffect(() => {
      if (isAutoPaused || events.length <= 1) {
        return;
      }

      const container = scrollContainerRef.current;
      if (!container) {
        return;
      }

      let animationFrameId = 0;
      let previousTimestamp = 0;
      const pixelsPerSecond = 56;

      const step = (timestamp: number) => {
        if (previousTimestamp === 0) {
          previousTimestamp = timestamp;
        }

        const deltaSeconds = Math.min((timestamp - previousTimestamp) / 1000, 0.04);
        previousTimestamp = timestamp;

        // Decrease scrollLeft so cards move visually left-to-right.
        container.scrollLeft -= pixelsPerSecond * deltaSeconds;
        normalizeInfinitePosition();

        animationFrameId = window.requestAnimationFrame(step);
      };

      animationFrameId = window.requestAnimationFrame(step);

      return () => {
        window.cancelAnimationFrame(animationFrameId);
      };
    }, [events.length, isAutoPaused, normalizeInfinitePosition]);

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.06,
        },
      },
    };

    const itemVariants = {
      hidden: { y: 18, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          type: 'spring',
          stiffness: 100,
          damping: 14,
        },
      },
    };

    return (
      <div ref={ref} className={cn('w-full max-w-6xl mx-auto p-1 sm:p-2', className)}>
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            {title}
          </h2>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#4a9d7e] ml-1" />
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="overflow-x-auto pb-4 scrollbar-hide"
        >
          <motion.div className="flex flex-nowrap gap-4 min-w-max" variants={containerVariants} initial="hidden" animate="visible">
            {loopedEvents.map((event, index) => (
              <motion.div
                key={`${event.eventName}-${index}`}
                variants={itemVariants}
                data-event-card="true"
                role="button"
                tabIndex={0}
                aria-pressed={selectedCardIndex === index}
                onMouseEnter={() => setHoveredCardIndex(index)}
                onMouseLeave={() => setHoveredCardIndex((current) => (current === index ? null : current))}
                onFocus={() => setFocusedCardIndex(index)}
                onBlur={() => setFocusedCardIndex((current) => (current === index ? null : current))}
                onClick={() => setSelectedCardIndex((current) => (current === index ? null : index))}
                className="w-[300px] sm:w-[340px] md:w-[380px] lg:w-[420px] min-h-[280px] sm:min-h-[296px] md:min-h-[312px] flex-shrink-0 flex flex-col bg-[#252836]/40 backdrop-blur-sm border border-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 hover:border-[#4a9d7e]/60 hover:bg-[#252836]/60 transition-all duration-300"
              >
                <div className="flex justify-between items-center mb-4 sm:mb-5">
                  <div className="flex items-center gap-2">
                    <p className="text-[11px] uppercase tracking-wide text-gray-400">Live</p>
                    <span className="text-[11px] font-semibold text-[#4a9d7e] bg-[#4a9d7e]/15 px-2 py-0.5 rounded-md">
                      {event.time}
                    </span>
                  </div>
                  <VolatilityIcon impact={event.impact} />
                </div>

                <div className="flex items-center gap-3 mb-5 sm:mb-6 min-h-[48px]">
                  <img
                    src={event.imageUrl ?? `https://flagcdn.com/w40/${event.countryCode.toLowerCase()}.png`}
                    alt={event.eventName}
                    className="h-10 w-10 rounded-full object-cover bg-gray-700/40 border border-gray-700"
                  />
                  <h3 className="font-semibold text-white leading-snug line-clamp-2">{event.eventName}</h3>
                </div>

                <div className="mt-auto border-t border-gray-700/60 pt-4 sm:pt-5">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="flex flex-col items-center justify-center min-h-[52px]">
                      <p className="text-[11px] uppercase tracking-wide text-gray-400">Actual</p>
                      <p className="font-medium text-sm text-white mt-1">{event.actual ?? '—'}</p>
                    </div>
                    <div className="flex flex-col items-center justify-center min-h-[52px] border-x border-gray-700/50">
                      <p className="text-[11px] uppercase tracking-wide text-gray-400">Forecast</p>
                      <p className="font-medium text-sm text-white mt-1">{event.forecast ?? '—'}</p>
                    </div>
                    <div className="flex flex-col items-center justify-center min-h-[52px]">
                      <p className="text-[11px] uppercase tracking-wide text-gray-400">Prior</p>
                      <p className="font-medium text-sm text-white mt-1">{event.prior ?? '—'}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    );
  }
);

EconomicCalendar.displayName = 'EconomicCalendar';
