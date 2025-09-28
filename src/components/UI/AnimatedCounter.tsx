'use client';

import React, { useEffect, useState } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  formatValue?: (value: number) => string;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1000,
  formatValue,
  suffix = '',
  prefix = '',
  decimals = 0,
  className = ''
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    setIsAnimating(true);
    const startTime = performance.now();
    const startValue = displayValue;
    const targetValue = value;
    const difference = targetValue - startValue;

    if (Math.abs(difference) < 0.01) {
      setDisplayValue(targetValue);
      setIsAnimating(false);
      return;
    }

    const animateValue = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (difference * easeOut);

      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animateValue);
      } else {
        setDisplayValue(targetValue);
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(animateValue);
  }, [value, duration, isMounted]);

  const formatDisplayValue = (val: number): string => {
    if (formatValue) {
      return formatValue(val);
    }

    let formattedValue: string;

    if (decimals === 0) {
      formattedValue = Math.round(val).toLocaleString();
    } else {
      formattedValue = val.toFixed(decimals);
    }

    return `${prefix}${formattedValue}${suffix}`;
  };

  return (
    <span
      className={`${className} ${isAnimating ? 'text-blue-600 dark:text-blue-400' : ''} transition-colors duration-200`}
    >
      {formatDisplayValue(displayValue)}
    </span>
  );
};

export default AnimatedCounter;